import * as THREE from 'three';
import { World } from './World';
import { IconSlab } from '../objects/IconSlab';
import { damp, easeOutBack } from '../utils/math';

// The end of the current: a bright core with every app orbiting it. Each
// orbiting icon is a door to that app's page.
export class FinaleWorld extends World {
  constructor({ apps, slabGeometry, slabTextures, onNavigate, radius = 2.35, iconScale = 0.4 }) {
    super();
    this.coreUniforms = {
      uTime: { value: 0 },
      uCenter: { value: new THREE.Color('#fff4dc') },
      uEdge: { value: new THREE.Color('#f4a93b') },
      uPulse: { value: 0 },
    };
    this.core = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 48, 32),
      new THREE.ShaderMaterial({
        uniforms: this.coreUniforms,
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = normalize(-mv.xyz);
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uCenter;
          uniform vec3 uEdge;
          uniform float uPulse;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float facing = max(dot(normalize(vNormal), normalize(vView)), 0.0);
            vec3 color = mix(uEdge * 1.15, uCenter * 1.7, pow(facing, 1.6));
            gl_FragColor = vec4(color * (1.0 + uPulse), 1.0);
          }
        `,
      }),
    );
    this.group.add(this.core);

    this.halo = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        uniforms: this.coreUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uEdge;
          uniform float uPulse;
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - 0.5;
            float d = length(p) * 2.0;
            float a = pow(max(1.0 - d, 0.0), 3.2);
            float rays = 0.75 + 0.25 * sin(atan(p.y, p.x) * 9.0 + uTime * 0.4);
            gl_FragColor = vec4(uEdge * (0.9 + uPulse), a * rays * 0.32);
          }
        `,
      }),
    );
    this.halo.scale.setScalar(5);
    this.group.add(this.halo);

    this.orbiters = apps.map((app, index) => {
      const slab = new IconSlab({
        geometry: slabGeometry,
        texture: slabTextures[index].front,
        backTexture: slabTextures[index].back,
        colors: app.colors,
      });
      slab.group.scale.setScalar(iconScale);
      this.group.add(slab.group);
      const orbit = {
        slab,
        app,
        radius: radius + (index % 2) * 0.4,
        speed: 0.16 + (index % 3) * 0.03,
        phase: (index / apps.length) * Math.PI * 2,
        tilt: 0.35 + (index % 3) * 0.12,
      };
      this.targets.push({
        object: slab.mesh,
        label: 'Open',
        color: app.colors.a,
        onHover: active => {
          slab.hoverTarget = active ? 1 : 0;
          orbit.hovered = active;
        },
        onClick: () => onNavigate && onNavigate(app.route),
      });
      return orbit;
    });
    this.slow = 0;
    this.iconScale = iconScale;
    this.radius = radius;
    this.slabGeometry = slabGeometry;
    this.yours = null;
  }

  // The visitor's own app joins the orbit, a little larger than the rest.
  // Textures are owned by the caller; only the slab's materials are ours.
  setYourApp(app, textures, onBuild) {
    if (this.yours) {
      const { orbit, target } = this.yours;
      this.group.remove(orbit.slab.group);
      this.orbiters.splice(this.orbiters.indexOf(orbit), 1);
      this.targets.splice(this.targets.indexOf(target), 1);
      [orbit.slab.front, orbit.slab.side, orbit.slab.back].forEach(material => material.dispose());
      this.yours = null;
    }
    if (!app || !textures) return;
    const slab = new IconSlab({
      geometry: this.slabGeometry,
      texture: textures.front,
      backTexture: textures.back,
      colors: textures.colors,
    });
    slab.group.scale.setScalar(0.0001);
    this.group.add(slab.group);
    const orbit = {
      slab,
      app,
      radius: this.radius + 0.2,
      speed: 0.2,
      phase: Math.PI * 0.42,
      tilt: 0.5,
      yours: true,
      pop: 0,
    };
    const target = {
      object: slab.mesh,
      label: 'Build it',
      color: textures.colors.a,
      onHover: active => {
        slab.hoverTarget = active ? 1 : 0;
        orbit.hovered = active;
      },
      onClick: () => onBuild && onBuild(),
    };
    this.orbiters.push(orbit);
    this.targets.push(target);
    this.yours = { orbit, target };
  }

  update({ time, delta, camera, motion }) {
    this.coreUniforms.uTime.value = time;
    this.coreUniforms.uPulse.value = 0.15 + Math.sin(time * 2.2) * 0.1;
    this.halo.quaternion.copy(camera.quaternion);
    const anyHovered = this.orbiters.some(orbit => orbit.hovered);
    this.slow = damp(this.slow, anyHovered ? 1 : 0, 4, delta);
    this.orbiters.forEach(orbit => {
      orbit.phase += delta * orbit.speed * (1 - this.slow * 0.85) * motion;
      const angle = orbit.phase;
      const x = Math.cos(angle) * orbit.radius;
      const z = Math.sin(angle) * orbit.radius * 0.55;
      const y = Math.sin(angle) * orbit.radius * 0.28 * orbit.tilt + Math.sin(time + orbit.phase * 3) * 0.06;
      orbit.slab.group.position.set(x, y, z);
      orbit.slab.group.quaternion.copy(camera.quaternion);
      let scale = this.iconScale * (1 + (z / orbit.radius) * 0.25);
      if (orbit.yours) {
        orbit.pop = Math.min(1, orbit.pop + delta * 1.2);
        scale *= 1.2 * Math.max(0.0001, easeOutBack(orbit.pop));
      }
      orbit.slab.group.scale.setScalar(scale);
      orbit.slab.update(delta, { time, idle: 1, motion, tiltX: Math.sin(time * 0.6 + orbit.phase) * 0.25 });
    });
  }
}
