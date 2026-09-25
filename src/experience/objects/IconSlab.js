import * as THREE from 'three';
import { damp } from '../utils/math';
import { makeCanvas, roundRectPath, toTexture, FONT_SANS, FONT_MONO } from '../utils/canvas';

export const SLAB_SIZE = 1.6;

// The back of every icon carries the app's name, so spinning one around
// rewards the visitor with something to read.
export function createSlabBackTexture(app) {
  const { canvas, ctx } = makeCanvas(512, 512);
  const gradient = ctx.createLinearGradient(0, 0, 512, 512);
  gradient.addColorStop(0, app.colors.a);
  gradient.addColorStop(1, app.colors.b);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = 'rgba(6, 7, 10, 0.55)';
  roundRectPath(ctx, 40, 40, 432, 432, 70);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = 84;
  ctx.font = `650 ${size}px ${FONT_SANS}`;
  while (ctx.measureText(app.name).width > 380 && size > 40) {
    size -= 4;
    ctx.font = `650 ${size}px ${FONT_SANS}`;
  }
  ctx.fillText(app.name, 256, 236);
  ctx.font = `500 22px ${FONT_MONO}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('BY CURRENTTECH', 256, 318);
  return toTexture(canvas);
}

export class IconSlab {
  constructor({ geometry, texture, backTexture, colors }) {
    // A dim diffuse plus an emissive copy of the art keeps icons saturated
    // (like a lit screen) while the clearcoat still catches reflections.
    this.front = new THREE.MeshPhysicalMaterial({
      map: texture,
      color: new THREE.Color(0.35, 0.35, 0.35),
      emissive: new THREE.Color('#ffffff'),
      emissiveMap: texture,
      emissiveIntensity: 0.3,
      roughness: 0.3,
      metalness: 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.14,
    });
    this.side = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(colors.a).lerp(new THREE.Color('#1a1a22'), 0.35),
      roughness: 0.26,
      metalness: 0.65,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    });
    this.back = new THREE.MeshPhysicalMaterial({
      map: backTexture,
      color: new THREE.Color(0.4, 0.4, 0.4),
      emissive: new THREE.Color('#ffffff'),
      emissiveMap: backTexture,
      emissiveIntensity: 0.25,
      roughness: 0.4,
      metalness: 0.1,
      clearcoat: 0.7,
    });

    this.mesh = new THREE.Mesh(geometry, [this.front, this.side, this.back]);
    this.pivot = new THREE.Group();
    this.pivot.add(this.mesh);
    this.group = new THREE.Group();
    this.group.add(this.pivot);

    this.spin = 0;
    this.spinVelocity = 0;
    this.tiltX = 0;
    this.tiltY = 0;
    this.hover = 0;
    this.hoverTarget = 0;
    this.pulse = 0;
    this.dragging = false;
  }

  push(amount) {
    this.spinVelocity += amount;
  }

  drag(dx) {
    this.spin += dx * 0.012;
    this.spinVelocity = dx * 0.9;
  }

  update(delta, { tiltX = 0, tiltY = 0, idle = 0, time = 0, motion = 1 }) {
    this.spinVelocity *= Math.exp(-delta * 1.4);
    this.spin += this.spinVelocity * delta;
    if (!this.dragging && Math.abs(this.spinVelocity) < 1.2) {
      const rest = Math.round(this.spin / (Math.PI * 2)) * Math.PI * 2;
      this.spin = damp(this.spin, rest, 2.6, delta);
    }
    this.tiltX = damp(this.tiltX, tiltX, 4, delta);
    this.tiltY = damp(this.tiltY, tiltY, 4, delta);
    this.hover = damp(this.hover, this.hoverTarget, 8, delta);
    this.pulse = damp(this.pulse, 0, 7, delta);

    const float = Math.sin(time * 1.1) * 0.05 * idle * motion;
    this.pivot.position.y = float;
    this.pivot.rotation.set(this.tiltY + Math.sin(time * 0.7) * 0.04 * idle * motion, this.spin + this.tiltX, 0);
    this.pivot.scale.setScalar(1 + this.hover * 0.05 + this.pulse);
  }
}
