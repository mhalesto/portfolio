import * as THREE from 'three';
import { World } from './World';
import { simplexNoise } from '../utils/glsl';
import { damp } from '../utils/math';

const Y_AXIS = new THREE.Vector3(0, 1, 0);

// YouMine: a living voice orb that "listens" when the pointer comes close
// and "speaks" in bursts, orbited by rings like the ones on the app icon.
export class YouMineWorld extends World {
  constructor({ app }) {
    super({ app });
    this.slabAnchor.position.set(-1.25, -0.72, 1.05);
    this.slabAnchor.scale = 0.62;

    this.uniforms = {
      uTime: { value: 0 },
      uVoice: { value: 0 },
      uListen: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 1) },
      uColorA: { value: new THREE.Color('#1e3aff') },
      uColorB: { value: new THREE.Color(app.colors.a) },
      uColorC: { value: new THREE.Color('#ff5fd2') },
    };
    this.orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 28),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uVoice;
          uniform float uListen;
          uniform vec3 uPointer;
          varying vec3 vNormal;
          varying vec3 vView;
          varying float vNoise;
          varying vec3 vObjectNormal;
          ${simplexNoise}
          void main() {
            float n = snoise(normal * 1.5 + vec3(uTime * 0.35, uTime * 0.22, 0.0));
            float fine = snoise(normal * 4.0 - vec3(0.0, uTime * 1.4, 0.0));
            float toward = pow(max(dot(normal, normalize(uPointer)), 0.0), 3.0);
            float displacement = n * (0.06 + uVoice * 0.12) + fine * uVoice * 0.025 + toward * uListen * 0.22;
            vec3 displaced = position + normal * displacement;
            vNoise = n + fine * 0.3;
            vObjectNormal = normal;
            vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
            vView = normalize(-mv.xyz);
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uColorC;
          uniform float uVoice;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vView;
          varying float vNoise;
          varying vec3 vObjectNormal;
          void main() {
            float facing = max(dot(normalize(vNormal), normalize(vView)), 0.0);
            float rim = pow(1.0 - facing, 2.2);
            float blend = smoothstep(-0.8, 0.9, vObjectNormal.y + vNoise * 0.6);
            vec3 color = mix(uColorA, uColorB, blend);
            color = mix(color, uColorC, smoothstep(0.35, 1.0, vNoise) * 0.6);
            vec3 core = color * (0.35 + 0.45 * facing);
            vec3 glow = mix(uColorB, vec3(1.0), 0.35) * rim * (1.4 + uVoice * 1.6);
            gl_FragColor = vec4(core + glow, 1.0);
          }
        `,
      }),
    );
    this.orb.position.set(0.35, 0.25, -0.5);
    this.group.add(this.orb);

    this.orbits = [];
    const orbitColors = ['#5ee7ff', app.colors.a, '#3c8bff'];
    [
      [1.1, 0.25, 0],
      [-0.8, 0.9, 0.4],
      [0.3, -1.1, 0.8],
    ].forEach((rotation, index) => {
      const holder = new THREE.Group();
      holder.position.copy(this.orb.position);
      holder.rotation.set(rotation[0], rotation[1], rotation[2]);
      const color = new THREE.Color(orbitColors[index]);
      const radius = 1.62 + index * 0.16;
      holder.add(
        new THREE.Mesh(
          new THREE.TorusGeometry(radius, 0.007, 6, 200),
          new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(1.6) }),
        ),
      );
      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 16, 12),
        new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(4) }),
      );
      holder.add(electron);
      this.group.add(holder);
      this.orbits.push({ holder, electron, radius, speed: 0.6 + index * 0.25, phase: index * 2 });
    });

    this.voice = 0;
    this.talkUntil = 0;
    this.listen = 0;
    this.hovering = false;
    this.scratch = new THREE.Vector3();
    this.nextSyllable = 0;
    this.syllable = 0;

    const proxy = new THREE.Mesh(
      new THREE.SphereGeometry(1.45, 16, 12),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    proxy.position.copy(this.orb.position);
    this.group.add(proxy);
    this.targets.push({
      object: proxy,
      label: 'Talk',
      color: app.colors.a,
      onHover: active => {
        this.hovering = active;
      },
      onClick: () => {
        this.talkUntil = this.clock + 2.8;
      },
    });
    this.clock = 0;
  }

  update(state) {
    const { time, delta, interaction, motion } = state;
    this.clock += delta;
    this.uniforms.uTime.value = time * (0.4 + motion * 0.6);

    // A synthetic voice envelope: syllable bursts while talking, near
    // silence otherwise. It also talks on its own every few seconds.
    const cycle = time % 7;
    const talking = this.clock < this.talkUntil || cycle < 2.6;
    if (this.clock > this.nextSyllable) {
      this.syllable = talking ? 0.45 + Math.random() * 0.55 : 0.05;
      this.nextSyllable = this.clock + 0.09 + Math.random() * 0.16;
    }
    this.voice = damp(this.voice, this.syllable * motion, talking ? 14 : 4, delta);
    this.uniforms.uVoice.value = this.voice;

    this.listen = damp(this.listen, this.hovering ? 1 : 0, 5, delta);
    this.uniforms.uListen.value = this.listen;
    if (this.hovering && this.pointerOnPlane(state, this.orb.position.z + 1.2, this.scratch)) {
      // Into the orb's own (rotating) space, where the displacement happens.
      this.scratch.sub(this.orb.position).applyAxisAngle(Y_AXIS, -this.orb.rotation.y);
      this.uniforms.uPointer.value.lerp(this.scratch.normalize(), 0.2);
    }
    const scale = 1 + this.voice * 0.05;
    this.orb.scale.setScalar(scale);
    this.orb.rotation.y = time * 0.12;

    this.orbits.forEach(orbit => {
      const angle = time * orbit.speed * (0.5 + motion * 0.5) + orbit.phase;
      orbit.electron.position.set(Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0);
      orbit.holder.rotation.z += delta * 0.05 * motion;
    });

    if (interaction && this.slab) this.slab.pulse = Math.max(this.slab.pulse, this.voice * 0.03);
  }
}
