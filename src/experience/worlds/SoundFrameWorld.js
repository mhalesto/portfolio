import * as THREE from 'three';
import { World } from './World';
import { roundedRectShape } from '../utils/geometry';
import { createRandom, damp, smoothstep } from '../utils/math';

const BARS = 96;
const INNER = 1.42;
const BPM = 118;
const TIMELINE_HALF = 3.1;

// SoundFrame: a radial equaliser pumping on a steady beat around the icon,
// over a timeline of layered clips that scroll under the playhead.
export class SoundFrameWorld extends World {
  constructor({ app }) {
    super({ app });
    this.slabAnchor.position.set(0, 0.2, 0);
    this.colorA = new THREE.Color(app.colors.a);
    this.colorB = new THREE.Color(app.colors.b);

    const barGeometry = new THREE.BoxGeometry(0.052, 1, 0.052);
    barGeometry.translate(0, 0.5, 0);
    this.bars = new THREE.InstancedMesh(barGeometry, new THREE.MeshBasicMaterial({ color: '#ffffff' }), BARS);
    this.bars.position.copy(this.slabAnchor.position);
    this.bars.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.group.add(this.bars);
    this.heights = new Float32Array(BARS).fill(0.1);
    this.dummy = new THREE.Object3D();
    this.tmpColor = new THREE.Color();
    for (let i = 0; i < BARS; i += 1) this.bars.setColorAt(i, this.colorA);

    this.ringMaterial = new THREE.MeshBasicMaterial({ color: this.colorA.clone().multiplyScalar(2) });
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(INNER - 0.06, 0.012, 8, 160), this.ringMaterial);
    this.ring.position.copy(this.slabAnchor.position);
    this.group.add(this.ring);

    this.shockMaterial = new THREE.MeshBasicMaterial({
      color: this.colorB.clone().multiplyScalar(2.2),
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this.shock = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 8, 160), this.shockMaterial);
    this.shock.position.copy(this.slabAnchor.position);
    this.group.add(this.shock);

    // Timeline floor: video, captions, graphics and audio tracks.
    this.timeline = new THREE.Group();
    this.timeline.position.set(0, -1.85, -0.6);
    this.timeline.rotation.x = -1.2;
    this.group.add(this.timeline);
    const random = createRandom(5);
    const trackColors = ['#3a7cf2', '#f5c35e', '#9b5cff', '#18c7e6'];
    this.clips = [];
    trackColors.forEach((color, track) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.3,
        roughness: 0.4,
      });
      let x = -TIMELINE_HALF;
      while (x < TIMELINE_HALF) {
        const length = 0.5 + random() * 1.3;
        const geometry = new THREE.ExtrudeGeometry(roundedRectShape(length, 0.24, 0.08), {
          depth: 0.04,
          bevelEnabled: false,
          curveSegments: 6,
        });
        const clip = new THREE.Mesh(geometry, material);
        clip.position.set(x + length / 2, (1.5 - track) * 0.34, 0);
        clip.userData = { length };
        this.timeline.add(clip);
        this.clips.push(clip);
        x += length + 0.1 + random() * 0.3;
      }
    });
    const playhead = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 1.6, 0.02),
      new THREE.MeshBasicMaterial({ color: new THREE.Color('#ff5a5f').multiplyScalar(2.4) }),
    );
    playhead.position.z = 0.06;
    this.timeline.add(playhead);

    this.drop = 0;
    this.shockTime = 1;

    const proxy = new THREE.Mesh(new THREE.CircleGeometry(2.5, 40), new THREE.MeshBasicMaterial({ visible: false }));
    proxy.position.copy(this.slabAnchor.position);
    this.group.add(proxy);
    this.targets.push({
      object: proxy,
      label: 'Drop',
      color: app.colors.a,
      onClick: () => {
        this.drop = 1;
        this.shockTime = 0;
      },
    });
  }

  update({ time, delta, motion }) {
    const beat = (time * BPM) / 60;
    const phase = beat % 1;
    const bar = Math.floor(beat) % 4;
    this.drop = damp(this.drop, 0, 0.6, delta);
    const kick = Math.exp(-phase * 7) * (bar === 0 ? 1 : 0.7) * (0.6 + motion * 0.4) * (1 + this.drop * 0.8);
    const hat = Math.exp(-((phase + 0.5) % 1) * 12) * 0.35;

    const dummy = this.dummy;
    for (let i = 0; i < BARS; i += 1) {
      const angle = (i / BARS) * Math.PI * 2;
      const mirror = Math.abs(Math.sin(angle * 1.5));
      const wave = 0.5 + 0.5 * Math.sin(angle * 5 + time * 2.1) * Math.sin(angle * 3 - time * 1.3);
      const target = 0.06 + kick * (0.25 + mirror * 0.55) + wave * 0.25 + hat * (i % 3 === 0 ? 0.3 : 0);
      this.heights[i] = damp(this.heights[i], target, target > this.heights[i] ? 30 : 8, delta);
      const h = this.heights[i];
      dummy.position.set(Math.cos(angle) * INNER, Math.sin(angle) * INNER, 0);
      dummy.rotation.set(0, 0, angle - Math.PI / 2);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      this.bars.setMatrixAt(i, dummy.matrix);
      this.tmpColor
        .copy(this.colorA)
        .lerp(this.colorB, 0.5 + 0.5 * Math.sin(angle * 2 + time * 0.5))
        .multiplyScalar(0.9 + h * 2.2);
      this.bars.setColorAt(i, this.tmpColor);
    }
    this.bars.instanceMatrix.needsUpdate = true;
    this.bars.instanceColor.needsUpdate = true;
    this.bars.rotation.z = time * 0.08 * motion;

    this.ring.scale.setScalar(1 + kick * 0.03);
    this.ringMaterial.color.copy(this.colorA).multiplyScalar(1.4 + kick * 2);
    if (this.slab) this.slab.pulse = Math.max(this.slab.pulse, kick * 0.045);

    this.shockTime = Math.min(1, this.shockTime + delta * 0.9);
    this.shock.scale.setScalar(1.4 + this.shockTime * 2.2);
    this.shockMaterial.opacity = (1 - this.shockTime) * 0.9;

    const speed = 0.9 * motion * (1 + this.drop);
    this.clips.forEach(clip => {
      clip.position.x -= speed * delta;
      const half = clip.userData.length / 2;
      if (clip.position.x + half < -TIMELINE_HALF) clip.position.x += TIMELINE_HALF * 2 + 0.2;
      const underPlayhead = Math.abs(clip.position.x) < half;
      // Clips shrink away at both ends so the strip never spills under the text.
      const fade = Math.max(0.001, smoothstep(TIMELINE_HALF + 0.2, TIMELINE_HALF - 0.9, Math.abs(clip.position.x)));
      clip.scale.set(fade, fade, underPlayhead ? 1 + kick * 3 : 1);
    });
  }
}
