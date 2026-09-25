import * as THREE from 'three';
import { roundedPlane, roundedRectShape } from '../utils/geometry';
import { makeCanvas, roundRectPath, toTexture, FONT_SANS, FONT_MONO } from '../utils/canvas';
import { SLAB_SIZE } from './IconSlab';

const PHONE_W = 1.02;
const PHONE_H = 2.1;
const PHONE_D = 0.11;
const SCREEN_W = 0.955;
const SCREEN_H = 2.035;
const CANVAS_W = 768;
const CANVAS_H = 1636;
const ICON = 132;
const COLUMNS = [124, 297.3, 470.7, 644];
const ROWS = [566, 778];

const slotCentre = index => ({ x: COLUMNS[index % 4], y: ROWS[Math.floor(index / 4)] });

function drawHomeScreen(apps, icons) {
  const { canvas, ctx } = makeCanvas(CANVAS_W, CANVAS_H);

  // Wallpaper: a dark aurora in the site's gold, violet and cyan.
  const base = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  base.addColorStop(0, '#0b0f1d');
  base.addColorStop(1, '#06060c');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const blob = (x, y, r, color) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  };
  blob(140, 1040, 560, 'rgba(244, 193, 93, 0.5)');
  blob(680, 640, 520, 'rgba(124, 77, 255, 0.5)');
  blob(420, 1500, 460, 'rgba(34, 211, 238, 0.32)');
  blob(360, 120, 380, 'rgba(58, 124, 242, 0.25)');
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 5; i += 1) {
    ctx.strokeStyle = `rgba(244, 193, 93, ${0.05 + i * 0.018})`;
    ctx.lineWidth = 2 + i;
    ctx.beginPath();
    ctx.moveTo(-40, 980 + i * 42);
    ctx.bezierCurveTo(220, 820 + i * 30, 470, 1320 - i * 40, 820, 1080 + i * 36);
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over';

  // Status bar
  ctx.fillStyle = '#ffffff';
  ctx.font = `600 34px ${FONT_SANS}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('9:41', 84, 72);
  [0, 1, 2, 3].forEach(i => {
    const h = 9 + i * 5;
    roundRectPath(ctx, 548 + i * 11, 82 - h, 7, h, 2);
    ctx.fill();
  });
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#ffffff';
  [8, 16].forEach(r => {
    ctx.beginPath();
    ctx.arc(618, 84, r, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
  });
  ctx.beginPath();
  ctx.arc(618, 84, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  roundRectPath(ctx, 650, 60, 52, 26, 8);
  ctx.stroke();
  roundRectPath(ctx, 654, 64, 38, 18, 5);
  ctx.fill();

  // Widget
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  roundRectPath(ctx, 48, 140, 672, 300, 48);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = `500 19px ${FONT_MONO}`;
  ctx.fillText('CURRENTTECH  ·  STUDIO', 88, 196);
  ctx.fillStyle = '#ffffff';
  ctx.font = `600 150px ${FONT_SANS}`;
  ctx.fillText(String(apps.length).padStart(2, '0'), 80, 312);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.font = `500 27px ${FONT_SANS}`;
  ctx.fillText('apps on this phone', 88, 398);
  const ring = (radius, color, amount) => {
    ctx.lineCap = 'round';
    ctx.lineWidth = 16;
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(588, 290, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(588, 290, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * amount);
    ctx.stroke();
  };
  ring(92, '#f4c15d', 0.82);
  ring(66, '#8b5cf6', 0.64);
  ring(40, '#22d3ee', 0.9);

  // App slots: faint wells that stay behind when an icon lifts off.
  ctx.textAlign = 'center';
  apps.forEach((app, index) => {
    const { x, y } = slotCentre(index);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    roundRectPath(ctx, x - ICON / 2, y - ICON / 2, ICON, ICON, 34);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (icons && icons[index]) {
      // Painted underneath the slab so the screen never looks empty while
      // textures stream in; hidden once the slab sits on top of it.
      ctx.save();
      roundRectPath(ctx, x - ICON / 2, y - ICON / 2, ICON, ICON, 34);
      ctx.clip();
      ctx.globalAlpha = 0.18;
      ctx.drawImage(icons[index], x - ICON / 2, y - ICON / 2, ICON, ICON);
      ctx.restore();
    }
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.font = `500 23px ${FONT_SANS}`;
    ctx.fillText(app.name, x, y + ICON / 2 + 32);
  });

  // "Your app" placeholder in the last slot.
  const extra = slotCentre(apps.length);
  if (apps.length < 8) {
    ctx.setLineDash([10, 9]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2.5;
    roundRectPath(ctx, extra.x - ICON / 2, extra.y - ICON / 2, ICON, ICON, 34);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(extra.x - 20, extra.y);
    ctx.lineTo(extra.x + 20, extra.y);
    ctx.moveTo(extra.x, extra.y - 20);
    ctx.lineTo(extra.x, extra.y + 20);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.font = `500 23px ${FONT_SANS}`;
    ctx.fillText('Your app', extra.x, extra.y + ICON / 2 + 32);
  }

  // Page dots
  [-1, 0, 1].forEach(i => {
    ctx.fillStyle = i === -1 ? '#ffffff' : 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.arc(CANVAS_W / 2 + i * 22, 1372, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Dock
  ctx.fillStyle = 'rgba(255, 255, 255, 0.13)';
  roundRectPath(ctx, 36, 1418, 696, 176, 64);
  ctx.fill();
  const dock = [
    { from: '#3b82f6', to: '#1d4ed8', glyph: 'mail' },
    { from: '#2a2d36', to: '#111318', glyph: 'code' },
    { from: '#14b8a6', to: '#0f766e', glyph: 'globe' },
    { from: '#4ade80', to: '#16a34a', glyph: 'chat' },
  ];
  dock.forEach((item, i) => {
    const cx = 36 + (696 / 8) * (i * 2 + 1);
    const cy = 1506;
    const g = ctx.createLinearGradient(cx, cy - 60, cx, cy + 60);
    g.addColorStop(0, item.from);
    g.addColorStop(1, item.to);
    ctx.fillStyle = g;
    roundRectPath(ctx, cx - 60, cy - 60, 120, 120, 30);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    if (item.glyph === 'mail') {
      roundRectPath(ctx, cx - 32, cy - 22, 64, 44, 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 18);
      ctx.lineTo(cx, cy + 4);
      ctx.lineTo(cx + 30, cy - 18);
    } else if (item.glyph === 'code') {
      ctx.moveTo(cx - 12, cy - 22);
      ctx.lineTo(cx - 30, cy);
      ctx.lineTo(cx - 12, cy + 22);
      ctx.moveTo(cx + 12, cy - 22);
      ctx.lineTo(cx + 30, cy);
      ctx.lineTo(cx + 12, cy + 22);
    } else if (item.glyph === 'globe') {
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.moveTo(cx - 30, cy);
      ctx.lineTo(cx + 30, cy);
      ctx.ellipse(cx, cy, 13, 30, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(cx, cy - 4, 32, 25, 0, 0, Math.PI * 2);
      ctx.moveTo(cx - 18, cy + 17);
      ctx.lineTo(cx - 24, cy + 30);
      ctx.lineTo(cx - 6, cy + 20);
    }
    ctx.stroke();
  });

  // Home indicator
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  roundRectPath(ctx, CANVAS_W / 2 - 100, 1608, 200, 9, 5);
  ctx.fill();

  return canvas;
}

export class Phone {
  constructor({ apps, icons, anisotropy = 4 }) {
    this.apps = apps;
    this.group = new THREE.Group();
    this.body = new THREE.Group();
    this.group.add(this.body);

    const glass = new THREE.MeshPhysicalMaterial({
      color: '#0b0c10',
      roughness: 0.18,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const titanium = new THREE.MeshPhysicalMaterial({
      color: '#8a8c93',
      roughness: 0.3,
      metalness: 1,
      clearcoat: 0.3,
    });
    const bevel = 0.022;
    const bodyGeometry = new THREE.ExtrudeGeometry(
      roundedRectShape(PHONE_W - bevel * 2, PHONE_H - bevel * 2, 0.165 - bevel),
      {
        depth: PHONE_D - bevel * 2,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 4,
        curveSegments: 16,
      },
    );
    bodyGeometry.translate(0, 0, -(PHONE_D - bevel * 2) / 2);
    this.body.add(new THREE.Mesh(bodyGeometry, [glass, titanium]));

    this.screenTexture = toTexture(drawHomeScreen(apps, icons), { anisotropy });
    const screenGeometry = roundedPlane(SCREEN_W, SCREEN_H, 0.142, 12);
    this.screenZ = PHONE_D / 2 + 0.0015;
    const screen = new THREE.Mesh(screenGeometry, new THREE.MeshBasicMaterial({ map: this.screenTexture }));
    screen.position.z = this.screenZ;
    this.body.add(screen);

    // A sheen layer: only the environment reflection is added on top.
    const sheen = new THREE.Mesh(
      screenGeometry,
      new THREE.MeshPhysicalMaterial({
        color: '#000000',
        roughness: 0.06,
        metalness: 0,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        envMapIntensity: 0.3,
      }),
    );
    sheen.position.z = this.screenZ + 0.0012;
    this.body.add(sheen);

    const island = new THREE.Mesh(
      roundedPlane(0.28, 0.082, 0.041, 8),
      new THREE.MeshBasicMaterial({ color: '#000000' }),
    );
    island.position.set(0, SCREEN_H / 2 - 0.085, this.screenZ + 0.0008);
    this.body.add(island);

    const button = (x, y, height) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.018, height, 0.04), titanium);
      mesh.position.set(x, y, 0);
      this.body.add(mesh);
    };
    button(-PHONE_W / 2 - 0.004, 0.56, 0.1);
    button(-PHONE_W / 2 - 0.004, 0.36, 0.17);
    button(-PHONE_W / 2 - 0.004, 0.14, 0.17);
    button(PHONE_W / 2 + 0.004, 0.3, 0.26);

    const cameraModule = new THREE.Mesh(
      new THREE.ExtrudeGeometry(roundedRectShape(0.4, 0.4, 0.1), {
        depth: 0.02,
        bevelEnabled: false,
        curveSegments: 10,
      }),
      glass,
    );
    cameraModule.position.set(-PHONE_W / 2 + 0.26, PHONE_H / 2 - 0.26, -PHONE_D / 2 - 0.02);
    this.body.add(cameraModule);
    const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: '#050507',
      roughness: 0.05,
      metalness: 0.5,
      clearcoat: 1,
    });
    [
      [-0.085, 0.085],
      [-0.085, -0.085],
      [0.085, 0],
    ].forEach(([x, y]) => {
      const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.072, 0.035, 28), lensMaterial);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(cameraModule.position.x + x, cameraModule.position.y + y, -PHONE_D / 2 - 0.035);
      this.body.add(lens);
    });

    this.scratchScale = new THREE.Vector3();
    this.slotScale = ((ICON / CANVAS_W) * SCREEN_W) / SLAB_SIZE;
    this.slotPositions = apps.map((app, index) => {
      const { x, y } = slotCentre(index);
      return new THREE.Vector3(
        (x / CANVAS_W - 0.5) * SCREEN_W,
        (0.5 - y / CANVAS_H) * SCREEN_H,
        this.screenZ + 0.13 * this.slotScale + 0.004,
      );
    });
  }

  // World-space pose of an icon slot, used as the launch point of each slab.
  slotPose(index, position, quaternion) {
    this.body.updateWorldMatrix(true, false);
    position.copy(this.slotPositions[index]).applyMatrix4(this.body.matrixWorld);
    this.body.getWorldQuaternion(quaternion);
    this.body.getWorldScale(this.scratchScale);
    return this.slotScale * this.scratchScale.x;
  }
}
