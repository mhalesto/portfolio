import * as THREE from 'three';
import { World } from './World';
import { createArcMaterial } from './materials';
import { makeCanvas } from '../utils/canvas';
import { createRandom, damp, smoothstep } from '../utils/math';

const RING_RADIUS = 1.98;

// A 4x4 atlas of tiny generated "photos": skies, hills, portraits, city
// lights. They drift inward and shrink as they are compressed.
function photoAtlas() {
  const { canvas, ctx } = makeCanvas(512, 512);
  const random = createRandom(42);
  const palettes = [
    ['#ffb36b', '#ff5f6d', '#3b1d4a'],
    ['#7dd3fc', '#2563eb', '#0f172a'],
    ['#fde68a', '#f59e0b', '#422006'],
    ['#a7f3d0', '#10b981', '#064e3b'],
    ['#fbcfe8', '#db2777', '#3b0a24'],
    ['#c4b5fd', '#7c3aed', '#1e1147'],
  ];
  for (let i = 0; i < 16; i += 1) {
    const x = (i % 4) * 128;
    const y = Math.floor(i / 4) * 128;
    const [light, mid, dark] = palettes[i % palettes.length];
    const sky = ctx.createLinearGradient(0, y, 0, y + 128);
    sky.addColorStop(0, light);
    sky.addColorStop(1, mid);
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, 128, 128);
    const kind = i % 4;
    ctx.fillStyle = dark;
    if (kind === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.arc(x + 40 + random() * 50, y + 42, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = dark;
      ctx.beginPath();
      ctx.moveTo(x, y + 128);
      ctx.lineTo(x + 40, y + 70);
      ctx.lineTo(x + 70, y + 96);
      ctx.lineTo(x + 100, y + 60);
      ctx.lineTo(x + 128, y + 128);
      ctx.fill();
    } else if (kind === 1) {
      ctx.beginPath();
      ctx.arc(x + 64, y + 58, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(x + 64, y + 128, 46, 42, 0, Math.PI, 0);
      ctx.fill();
    } else if (kind === 2) {
      for (let b = 0; b < 6; b += 1) {
        const h = 30 + random() * 60;
        ctx.fillRect(x + b * 22, y + 128 - h, 18, h);
      }
      ctx.fillStyle = 'rgba(255,240,180,0.8)';
      for (let w = 0; w < 14; w += 1) ctx.fillRect(x + random() * 124, y + 70 + random() * 50, 3, 4);
    } else {
      ctx.beginPath();
      ctx.moveTo(x, y + 90);
      ctx.bezierCurveTo(x + 40, y + 70, x + 80, y + 110, x + 128, y + 84);
      ctx.lineTo(x + 128, y + 128);
      ctx.lineTo(x, y + 128);
      ctx.fill();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Smart Cleaner: the storage gauge from the app's own home screen, and a
// storm of photos that get compressed (not deleted) as they reach the icon.
export class SmartCleanerWorld extends World {
  constructor({ app, quality = 1 }) {
    super({ app });

    this.ring = new THREE.Group();
    this.ring.rotation.set(-0.35, 0.28, 0);
    this.group.add(this.ring);
    const track = new THREE.Mesh(
      new THREE.TorusGeometry(RING_RADIUS, 0.05, 12, 160),
      new THREE.MeshStandardMaterial({ color: '#16202f', roughness: 0.4, metalness: 0.6 }),
    );
    this.ring.add(track);

    // Photos / videos / screenshots, as on the app's storage screen.
    const segments = [
      { share: 0.46, color: '#9d5cff' },
      { share: 0.3, color: '#2f8bff' },
      { share: 0.09, color: '#34d399' },
    ];
    let start = Math.PI / 2;
    this.arcs = segments.map(segment => {
      const arc = segment.share * Math.PI * 2 - 0.06;
      const mesh = new THREE.Mesh(
        new THREE.TorusGeometry(RING_RADIUS, 0.075, 14, 120, arc),
        createArcMaterial(segment.color, arc, 0),
      );
      mesh.rotation.z = start;
      start += segment.share * Math.PI * 2;
      this.ring.add(mesh);
      return { mesh, share: segment.share, fill: 0 };
    });

    // Photo tiles
    const count = Math.round(150 * quality);
    const random = createRandom(11);
    this.tiles = [];
    const offsets = new Float32Array(count * 2);
    for (let i = 0; i < count; i += 1) {
      const cell = Math.floor(random() * 16);
      offsets[i * 2] = (cell % 4) * 0.25;
      offsets[i * 2 + 1] = 0.75 - Math.floor(cell / 4) * 0.25;
      this.tiles.push({
        angle: random() * Math.PI * 2,
        life: random(),
        speed: 0.05 + random() * 0.06,
        lane: random(),
        spin: (random() - 0.5) * 1.2,
        size: 0.16 + random() * 0.14,
      });
    }
    const geometry = new THREE.PlaneGeometry(1, 1);
    geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 2));
    this.tileUniforms = { uAtlas: { value: photoAtlas() }, uBrightness: { value: 1 } };
    this.tileMesh = new THREE.InstancedMesh(
      geometry,
      new THREE.ShaderMaterial({
        uniforms: this.tileUniforms,
        side: THREE.DoubleSide,
        vertexShader: /* glsl */ `
          attribute vec2 aOffset;
          varying vec2 vUv;
          varying vec2 vLocal;
          void main() {
            vLocal = uv;
            vUv = uv * 0.25 + aOffset;
            gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D uAtlas;
          uniform float uBrightness;
          varying vec2 vUv;
          varying vec2 vLocal;
          float box(vec2 p, vec2 b, float r) {
            vec2 q = abs(p) - b + r;
            return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
          }
          void main() {
            float d = box(vLocal - 0.5, vec2(0.5), 0.14);
            if (d > 0.0) discard;
            vec3 color = texture2D(uAtlas, vUv).rgb;
            float border = smoothstep(-0.03, 0.0, d);
            color = mix(color, vec3(1.0), border * 0.8);
            gl_FragColor = vec4(color * uBrightness, 1.0);
          }
        `,
      }),
      count,
    );
    this.tileMesh.frustumCulled = false;
    this.group.add(this.tileMesh);

    this.dummy = new THREE.Object3D();
    this.burst = 0;
    this.freed = 0;

    this.targets.push({
      object: this.tileMesh,
      proxy: this.createProxy(),
      label: 'Compress',
      color: '#2f8bff',
      onClick: () => {
        this.burst = 1;
      },
    });
  }

  createProxy() {
    const proxy = new THREE.Mesh(
      new THREE.CircleGeometry(RING_RADIUS + 0.4, 32),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    this.group.add(proxy);
    return proxy;
  }

  update({ time, delta, local, hold, motion }) {
    const arrived = 1 - smoothstep(0.1, 0.6, Math.abs(local));
    this.burst = damp(this.burst, 0, 0.9, delta);
    // Compressing frees space: the photo segment shrinks during a burst.
    this.freed = damp(this.freed, this.burst > 0.2 ? 1 : 0, 3, delta);
    this.arcs.forEach((arc, index) => {
      const target = arrived * smoothstep(index * 0.12, 0.45 + index * 0.12, hold * 0.6 + arrived * 0.6);
      arc.fill = damp(arc.fill, target, 3.5, delta);
      const squeeze = index === 0 ? 1 - this.freed * 0.42 : index === 1 ? 1 - this.freed * 0.25 : 1;
      arc.mesh.material.uniforms.uFill.value = arc.fill * squeeze;
      arc.mesh.material.uniforms.uGlow.value = 1 + this.burst * 0.8;
    });
    this.ring.rotation.z = Math.sin(time * 0.2) * 0.1;

    const speed = (1 + this.burst * 5) * motion;
    this.tileUniforms.uBrightness.value = 0.95 + this.burst * 0.6;
    const dummy = this.dummy;
    this.tiles.forEach((tile, index) => {
      tile.life = (tile.life + delta * tile.speed * speed) % 1;
      const life = tile.life;
      const radius = 3.4 - life * 2.75;
      const angle = tile.angle + life * 3.2;
      const shrink = 1 - smoothstep(0.55, 0.98, life) * 0.85;
      const appear = smoothstep(0.0, 0.08, life);
      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.78,
        (tile.lane - 0.5) * 1.2 - life * 0.4,
      );
      dummy.rotation.set(0, 0, tile.spin * life * 3);
      dummy.scale.setScalar(tile.size * shrink * appear);
      dummy.updateMatrix();
      this.tileMesh.setMatrixAt(index, dummy.matrix);
    });
    this.tileMesh.instanceMatrix.needsUpdate = true;
    if (this.slab) this.slab.pulse = Math.max(this.slab.pulse, this.burst * 0.06);
  }
}
