import * as THREE from 'three';
import { World } from './World';
import { roundedPlane } from '../utils/geometry';
import { makeCanvas, roundRectPath, toTexture, FONT_SANS } from '../utils/canvas';
import { damp } from '../utils/math';

const PANE_W = 1.9;
const PANE_H = 1.3;
const LAYOUT = [
  { position: [-1.12, 0.74, 0], rotation: [0.04, 0.22, 0.02] },
  { position: [1.08, 0.9, -0.55], rotation: [0.06, -0.2, -0.02] },
  { position: [-0.98, -0.8, -0.45], rotation: [-0.05, 0.2, -0.02] },
  { position: [1.18, -0.62, 0.15], rotation: [-0.04, -0.24, 0.02] },
];

function paneTexture(project, image, anisotropy) {
  const { canvas, ctx } = makeCanvas(1024, 700);
  ctx.fillStyle = '#15171d';
  ctx.fillRect(0, 0, 1024, 700);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(40 + i * 30, 34, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#23262f';
  roundRectPath(ctx, 230, 14, 564, 40, 20);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `500 21px ${FONT_SANS}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(project.domain, 512, 35);

  if (image) {
    const top = 68;
    const areaW = 1024;
    const areaH = 700 - top;
    const scale = Math.max(areaW / image.width, areaH / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, top, areaW, areaH);
    ctx.clip();
    ctx.drawImage(image, (areaW - w) / 2, top + (areaH - h) * 0.4, w, h);
    ctx.restore();
  }
  return toTexture(canvas, { anisotropy });
}

// Client websites as floating browser windows. Hovering a row in the DOM
// list (or a window itself) lifts the matching window.
export class WebWorld extends World {
  constructor({ projects, images, anisotropy = 4 }) {
    super();
    this.projects = projects;
    this.panes = projects.map((project, index) => {
      const layout = LAYOUT[index % LAYOUT.length];
      const material = new THREE.MeshBasicMaterial({ map: paneTexture(project, images[project.slug], anisotropy) });
      const mesh = new THREE.Mesh(roundedPlane(PANE_W, PANE_H, 0.07, 8), material);
      const holder = new THREE.Group();
      holder.position.set(...layout.position);
      holder.rotation.set(...layout.rotation);
      holder.add(mesh);
      const glow = new THREE.Mesh(
        roundedPlane(PANE_W + 0.08, PANE_H + 0.08, 0.1, 8),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(project.color).multiplyScalar(1.6),
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      glow.position.z = -0.01;
      holder.add(glow);
      this.group.add(holder);
      this.targets.push({
        object: mesh,
        label: 'Visit',
        color: project.color,
        onHover: active => {
          this.hovered = active ? index : this.hovered === index ? -1 : this.hovered;
        },
        onClick: () => window.open(project.url, '_blank', 'noopener'),
      });
      return { holder, mesh, glow, lift: 0, base: new THREE.Vector3(...layout.position), phase: index * 1.3 };
    });
    this.hovered = -1;
    this.highlighted = -1;
  }

  setHighlight(index) {
    this.highlighted = index;
  }

  update({ time, delta, interaction, motion }) {
    const focus = this.hovered >= 0 ? this.hovered : this.highlighted;
    this.panes.forEach((pane, index) => {
      pane.lift = damp(pane.lift, focus === index ? 1 : 0, 7, delta);
      pane.holder.position.set(
        pane.base.x + interaction.screen.x * 0.08 * (index + 1),
        pane.base.y + Math.sin(time * 0.8 + pane.phase) * 0.05 * motion,
        pane.base.z + pane.lift * 0.55,
      );
      pane.holder.scale.setScalar(1 + pane.lift * 0.08);
      pane.glow.material.opacity = pane.lift * 0.9;
    });
  }
}
