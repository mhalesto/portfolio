import * as THREE from 'three';
import { World } from './World';
import { getRoundedMask } from './materials';
import { simplexNoise } from '../utils/glsl';
import { makeCanvas, roundRectPath } from '../utils/canvas';
import { damp } from '../utils/math';

const FRAMES = 10;
const RADIUS = 2.3;
const FRAME_H = 1.22;
const FRAME_W = FRAME_H * 0.46;

function sprocketTexture() {
  const { canvas, ctx } = makeCanvas(512, 128);
  ctx.fillStyle = '#0c0a14';
  ctx.fillRect(0, 0, 512, 128);
  ctx.globalCompositeOperation = 'destination-out';
  for (let x = 8; x < 512; x += 32) {
    roundRectPath(ctx, x, 7, 16, 10, 3);
    ctx.fill();
    roundRectPath(ctx, x, 111, 16, 10, 3);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(7, 1);
  return texture;
}

// ClipAura: the icon wrapped in a glowing aura, orbited by a film reel made
// of the app's real App Store screens.
export class ClipAuraWorld extends World {
  constructor({ app, textures }) {
    super({ app });
    this.slabAnchor.position.set(0, 0.3, 0);

    this.auraUniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(app.colors.a) },
      uColorB: { value: new THREE.Color(app.colors.b) },
      uIntensity: { value: 1 },
    };
    this.aura = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.42, 12),
      new THREE.ShaderMaterial({
        uniforms: this.auraUniforms,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vView;
          varying float vNoise;
          ${simplexNoise}
          void main() {
            float n = snoise(normal * 1.3 + vec3(0.0, uTime * 0.22, uTime * 0.1));
            vec3 displaced = position + normal * n * 0.16;
            vNoise = n;
            vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
            vView = normalize(-mv.xyz);
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uIntensity;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vView;
          varying float vNoise;
          void main() {
            float rim = 1.0 - abs(dot(normalize(vNormal), normalize(vView)));
            rim = pow(rim, 2.4);
            vec3 color = mix(uColorA, uColorB, smoothstep(-0.5, 0.6, vNoise + sin(uTime * 0.5) * 0.3));
            float bands = 0.5 + 0.5 * sin(vNoise * 10.0 + uTime * 1.3);
            gl_FragColor = vec4(color * (rim * 1.3 + bands * rim * 0.6) * uIntensity, 1.0);
          }
        `,
      }),
    );
    this.aura.position.copy(this.slabAnchor.position);
    this.aura.position.z = -0.1;
    this.group.add(this.aura);

    // Film reel
    this.reel = new THREE.Group();
    this.reel.position.y = -0.05;
    this.reel.rotation.set(0.46, 0, -0.14);
    this.group.add(this.reel);
    this.spinner = new THREE.Group();
    this.reel.add(this.spinner);

    const bandMaterial = new THREE.MeshBasicMaterial({
      map: sprocketTexture(),
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      opacity: 0.92,
    });
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(RADIUS - 0.012, RADIUS - 0.012, FRAME_H + 0.3, 120, 1, true),
      bandMaterial,
    );
    this.spinner.add(band);

    const edgeMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(app.colors.b).multiplyScalar(1.4) });
    [-1, 1].forEach(side => {
      const edge = new THREE.Mesh(new THREE.TorusGeometry(RADIUS, 0.006, 6, 160), edgeMaterial);
      edge.rotation.x = Math.PI / 2;
      edge.position.y = side * (FRAME_H / 2 + 0.15);
      this.spinner.add(edge);
    });

    const theta = FRAME_W / RADIUS;
    const mask = getRoundedMask();
    this.frames = [];
    for (let i = 0; i < FRAMES; i += 1) {
      const map = textures.reel.clone();
      map.repeat.set(1 / 5, 1 / 2);
      map.offset.set((i % 5) / 5, i < 5 ? 0.5 : 0);
      map.needsUpdate = true;
      const frame = new THREE.Mesh(
        new THREE.CylinderGeometry(RADIUS, RADIUS, FRAME_H, 10, 1, true, -theta / 2, theta),
        new THREE.MeshBasicMaterial({ map, alphaMap: mask, alphaTest: 0.5, alphaToCoverage: true }),
      );
      frame.rotation.y = (i / FRAMES) * Math.PI * 2;
      frame.userData.lift = 0;
      this.spinner.add(frame);
      this.frames.push(frame);
    }

    this.velocity = 0;
    this.hoveredFrame = -1;
    this.energy = 0;

    this.targets.push({
      object: this.spinner,
      label: 'Spin',
      color: app.colors.b,
      onDrag: dx => {
        this.velocity += dx * 0.006;
      },
      onClick: () => {
        this.velocity += 2.4;
      },
      onHover: (active, hit) => {
        this.hoveredFrame = active && hit ? this.frames.indexOf(hit.object) : -1;
      },
    });
  }

  update({ time, delta, motion }) {
    this.auraUniforms.uTime.value = time;
    this.velocity = damp(this.velocity, 0, 1.1, delta);
    this.velocity = Math.max(-8, Math.min(8, this.velocity));
    this.spinner.rotation.y += (0.16 * motion + this.velocity) * delta;
    this.energy = damp(
      this.energy,
      Math.min(1, Math.abs(this.velocity) / 3 + (this.hoveredFrame >= 0 ? 0.35 : 0)),
      4,
      delta,
    );
    this.auraUniforms.uIntensity.value = 0.85 + this.energy * 0.9;
    this.aura.rotation.y = time * 0.1;

    this.frames.forEach((frame, index) => {
      const target = index === this.hoveredFrame ? 1 : 0;
      frame.userData.lift = damp(frame.userData.lift, target, 8, delta);
      const lift = frame.userData.lift;
      frame.scale.set(1 + lift * 0.1, 1 + lift * 0.1, 1 + lift * 0.1);
    });
  }
}
