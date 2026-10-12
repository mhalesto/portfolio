import * as THREE from 'three';
import { World } from './World';
import { createArcMaterial } from './materials';
import { makeCanvas, roundRectPath, FONT_SANS } from '../utils/canvas';
import { damp, smoothstep } from '../utils/math';

const RINGS = [
  { radius: 1.3, color: '#4f7ef7', fill: 0.78, label: 'Tasks' },
  { radius: 1.6, color: '#2fb67c', fill: 0.62, label: 'Focus' },
  { radius: 1.9, color: '#f5a524', fill: 0.86, label: 'Money' },
];

const CHIPS = [
  { text: 'Plan the week', color: '#4f7ef7' },
  { text: 'Focus · 25 min', color: '#2fb67c' },
  { text: 'Budget · 72%', color: '#f5a524' },
  { text: 'Receipt scanned', color: '#a78bfa' },
  { text: 'Reminder · 18:00', color: '#f472b6' },
];

function chipTexture({ text, color }) {
  const { canvas, ctx } = makeCanvas(512, 128);
  ctx.fillStyle = 'rgba(14, 18, 28, 0.92)';
  roundRectPath(ctx, 4, 4, 504, 120, 60);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(66, 64, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#0e121c';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(56, 64);
  ctx.lineTo(63, 72);
  ctx.lineTo(77, 56);
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = `550 44px ${FONT_SANS}`;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 108, 66);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// LifeTrack: tasks, focus and money as a gyroscope of progress rings, with
// the day's reminders orbiting as little cards.
export class LifeTrackWorld extends World {
  constructor({ app }) {
    super({ app });
    this.gyro = new THREE.Group();
    this.group.add(this.gyro);
    const trackMaterial = new THREE.MeshStandardMaterial({ color: '#1b2233', roughness: 0.35, metalness: 0.7 });
    this.rings = RINGS.map((ring, index) => {
      const holder = new THREE.Group();
      const arc = Math.PI * 2;
      holder.add(new THREE.Mesh(new THREE.TorusGeometry(ring.radius, 0.05, 12, 180), trackMaterial));
      const progress = new THREE.Mesh(
        new THREE.TorusGeometry(ring.radius, 0.072, 14, 180),
        createArcMaterial(ring.color, arc, 0),
      );
      progress.rotation.z = Math.PI / 2;
      holder.add(progress);
      this.gyro.add(holder);
      return { holder, progress, fill: 0, target: ring.fill, index, spin: 0 };
    });

    this.chips = CHIPS.map((chip, index) => {
      const material = new THREE.MeshBasicMaterial({ map: chipTexture(chip), transparent: true, depthWrite: false });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1.12, 0.28), material);
      mesh.userData.phase = (index / CHIPS.length) * Math.PI * 2;
      this.group.add(mesh);
      return mesh;
    });

    this.complete = 0;
    const proxy = new THREE.Mesh(new THREE.CircleGeometry(2.3, 40), new THREE.MeshBasicMaterial({ visible: false }));
    this.group.add(proxy);
    this.targets.push({
      object: proxy,
      label: 'Complete',
      color: app.colors.b,
      onClick: () => {
        this.complete = 1;
        this.rings.forEach(ring => {
          ring.spin += Math.PI * 2;
        });
      },
    });
  }

  update({ time, delta, local, hold, camera, interaction, motion }) {
    const arrived = 1 - smoothstep(0.1, 0.6, Math.abs(local));
    this.complete = damp(this.complete, 0, 0.5, delta);
    const tiltX = interaction.screen.y * 0.25;
    const tiltY = interaction.screen.x * 0.35;

    this.rings.forEach((ring, index) => {
      const wobble = time * (0.3 + index * 0.12) * motion;
      ring.spin = damp(ring.spin, 0, 1.8, delta);
      ring.holder.rotation.set(
        Math.sin(wobble + index) * 0.55 + tiltX * (index + 1) * 0.4,
        Math.cos(wobble * 0.8 + index * 2) * 0.6 + tiltY * (index + 1) * 0.4,
        ring.spin,
      );
      const goal = arrived * Math.min(1, ring.target * (0.55 + hold * 0.6) + this.complete);
      ring.fill = damp(ring.fill, goal, 3, delta);
      ring.progress.material.uniforms.uFill.value = ring.fill;
      ring.progress.material.uniforms.uGlow.value = 1 + this.complete * 0.8;
    });

    this.chips.forEach((chip, index) => {
      const angle = chip.userData.phase + time * 0.16 * motion;
      chip.position.set(Math.cos(angle) * 2.25, Math.sin(angle) * 1.6, Math.sin(angle + 1.2) * 0.8 + 0.3);
      chip.quaternion.copy(camera.quaternion);
      const s = 0.9 + 0.1 * Math.sin(time * 1.5 + index);
      chip.scale.setScalar(s * arrived + 0.0001);
    });
  }
}
