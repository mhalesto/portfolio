import * as THREE from 'three';
import { World } from './World';
import { makeCanvas, roundRectPath } from '../utils/canvas';
import { createRandom, damp, easeInOutCubic } from '../utils/math';

const SHEETS = 7;
const PAPER_W = 0.92;
const PAPER_H = 1.3;

// Procedural résumé layouts: each sheet is a different "template".
function resumeTexture(index) {
  const random = createRandom(100 + index * 17);
  const accents = ['#f05a13', '#1f3a68', '#0f8b7f', '#6b3fa0', '#c2410c', '#334155', '#be185d'];
  const accent = accents[index % accents.length];
  const { canvas, ctx } = makeCanvas(512, 724);
  ctx.fillStyle = '#f7f4ee';
  ctx.fillRect(0, 0, 512, 724);
  const sidebar = index % 3 === 1;
  const photo = index % 2 === 0;
  const left = sidebar ? 176 : 44;
  if (sidebar) {
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 148, 724);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 9; i += 1) {
      roundRectPath(ctx, 24, 250 + i * 34, 60 + random() * 50, 9, 4);
      ctx.fill();
    }
  }
  if (photo) {
    ctx.fillStyle = sidebar ? '#ffffff' : accent;
    ctx.beginPath();
    ctx.arc(sidebar ? 74 : 440, sidebar ? 110 : 84, 44, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#16181d';
  roundRectPath(ctx, left, 58, 200 + random() * 60, 26, 6);
  ctx.fill();
  ctx.fillStyle = accent;
  roundRectPath(ctx, left, 96, 120 + random() * 50, 12, 6);
  ctx.fill();
  let y = 150;
  for (let section = 0; section < 4; section += 1) {
    ctx.fillStyle = accent;
    roundRectPath(ctx, left, y, 90, 12, 6);
    ctx.fill();
    ctx.fillRect(left, y + 22, (sidebar ? 292 : 424) * 0.98, 2);
    y += 40;
    const lines = 3 + Math.floor(random() * 3);
    for (let line = 0; line < lines; line += 1) {
      ctx.fillStyle = line === 0 ? '#3b3f47' : '#c8ccd3';
      const width = (sidebar ? 290 : 420) * (line === 0 ? 0.55 : 0.6 + random() * 0.38);
      roundRectPath(ctx, left, y, width, 9, 4);
      ctx.fill();
      y += 20;
    }
    y += 22;
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

// ResumeStudio: a fan of résumé templates around the icon, with the
// "Recruiter Scan" magnifier following the pointer across the pages.
export class ResumeStudioWorld extends World {
  constructor({ app }) {
    super({ app });
    this.slabAnchor.position.set(0, 0, 0.35);

    this.bendUniforms = { uTime: { value: 0 } };
    const geometry = new THREE.PlaneGeometry(PAPER_W, PAPER_H, 12, 16);
    this.slots = [];
    for (let i = 0; i < SHEETS; i += 1) {
      const angle = -Math.PI * 0.62 + (i / (SHEETS - 1)) * Math.PI * 1.24;
      this.slots.push({
        position: new THREE.Vector3(
          Math.sin(angle) * 2.05,
          Math.cos(angle) * 0.9 - 0.25,
          -0.55 - Math.cos(angle) * 0.4,
        ),
        rotation: new THREE.Euler(0.06, -Math.sin(angle) * 0.5, -Math.sin(angle) * 0.22),
      });
    }
    this.sheets = [];
    for (let i = 0; i < SHEETS; i += 1) {
      const material = new THREE.MeshStandardMaterial({
        map: resumeTexture(i),
        color: new THREE.Color(0.5, 0.5, 0.5),
        roughness: 0.82,
        metalness: 0,
        side: THREE.DoubleSide,
        emissive: new THREE.Color('#ffffff'),
        emissiveMap: null,
        emissiveIntensity: 0,
      });
      const seed = i * 1.7;
      material.onBeforeCompile = shader => {
        // All sheets share one compiled program, so per-sheet values must be
        // uniforms rather than constants baked into the source.
        shader.uniforms.uTime = this.bendUniforms.uTime;
        shader.uniforms.uLift = { value: 0 };
        shader.uniforms.uSeed = { value: seed };
        material.userData.shader = shader;
        shader.vertexShader = shader.vertexShader
          .replace(
            '#include <common>',
            '#include <common>\nuniform float uTime;\nuniform float uLift;\nuniform float uSeed;',
          )
          .replace(
            '#include <begin_vertex>',
            `#include <begin_vertex>
            float curl = (1.0 - uLift) * 0.09;
            transformed.z += curl * transformed.x * transformed.x + sin(transformed.y * 2.4 + uTime * 1.4 + uSeed) * 0.035 * (1.0 - uLift);`,
          );
      };
      const sheet = new THREE.Mesh(geometry, material);
      sheet.userData = { slot: i, from: i, blend: 1, lift: 0, seed };
      this.group.add(sheet);
      this.sheets.push(sheet);
    }

    // Magnifier (the "CV" lens from the icon)
    const orange = new THREE.MeshStandardMaterial({
      color: app.colors.a,
      emissive: new THREE.Color(app.colors.a),
      emissiveIntensity: 0.6,
      roughness: 0.35,
      metalness: 0.2,
    });
    this.magnifier = new THREE.Group();
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 18, 64), orange);
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.6, 16), orange);
    handle.position.set(0.37, -0.37, 0);
    handle.rotation.z = Math.PI / 4;
    const lens = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 48),
      new THREE.MeshPhysicalMaterial({
        color: '#dbeafe',
        transparent: true,
        opacity: 0.2,
        roughness: 0.02,
        metalness: 0,
        clearcoat: 1,
        envMapIntensity: 2,
        depthWrite: false,
      }),
    );
    this.magnifier.add(rim, handle, lens);
    this.magnifier.position.set(0.9, 0.4, 0.9);
    this.group.add(this.magnifier);

    this.pointerTarget = new THREE.Vector3(0.9, 0.4, 0.9);
    this.scratch = new THREE.Vector3();
    this.shuffle = 0;
    this.shuffleFrom = 0;

    const proxy = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 3.4), new THREE.MeshBasicMaterial({ visible: false }));
    proxy.position.z = -0.3;
    this.group.add(proxy);
    this.targets.push({
      object: proxy,
      label: 'Shuffle',
      color: app.colors.a,
      onClick: () => this.reshuffle(),
    });
  }

  reshuffle() {
    this.sheets.forEach(sheet => {
      sheet.userData.from = sheet.userData.slot;
      sheet.userData.slot = (sheet.userData.slot + 1) % SHEETS;
      sheet.userData.blend = 0;
    });
  }

  update(state) {
    const { time, delta, interaction, motion } = state;
    this.bendUniforms.uTime.value = time * motion;

    // The lens follows the pointer while it is over the canvas; otherwise it
    // drifts over the pages on its own.
    const onCanvas = interaction.overCanvas && interaction.pointerType === 'mouse';
    if (onCanvas && this.pointerOnPlane(state, 0.9, this.scratch)) {
      this.pointerTarget.set(
        THREE.MathUtils.clamp(this.scratch.x, -2.4, 2.4),
        THREE.MathUtils.clamp(this.scratch.y, -1.4, 1.4),
        0.9,
      );
    } else {
      this.pointerTarget.set(Math.sin(time * 0.45) * 1.6, Math.sin(time * 0.7) * 0.6 + 0.1, 0.9);
    }
    this.magnifier.position.x = damp(this.magnifier.position.x, this.pointerTarget.x, 6, delta);
    this.magnifier.position.y = damp(this.magnifier.position.y, this.pointerTarget.y, 6, delta);
    this.magnifier.position.z = 0.9;
    this.magnifier.rotation.z = Math.sin(time * 0.8) * 0.08;

    const lensPosition = this.magnifier.position;
    this.sheets.forEach(sheet => {
      const data = sheet.userData;
      data.blend = Math.min(1, data.blend + delta * 1.4);
      const t = easeInOutCubic(data.blend);
      const from = this.slots[data.from];
      const to = this.slots[data.slot];
      sheet.position.lerpVectors(from.position, to.position, t);
      sheet.position.z += Math.sin(t * Math.PI) * 0.6;
      sheet.rotation.set(
        THREE.MathUtils.lerp(from.rotation.x, to.rotation.x, t),
        THREE.MathUtils.lerp(from.rotation.y, to.rotation.y, t),
        THREE.MathUtils.lerp(from.rotation.z, to.rotation.z, t),
      );
      const distance = Math.hypot(sheet.position.x - lensPosition.x, sheet.position.y - lensPosition.y);
      data.lift = damp(data.lift, distance < 0.75 ? 1 : 0, 6, delta);
      sheet.position.z += data.lift * 0.3;
      sheet.position.y += Math.sin(time * 0.9 + data.seed) * 0.04 * motion;
      sheet.scale.setScalar(1 + data.lift * 0.06);
      const shader = sheet.material.userData.shader;
      if (shader) shader.uniforms.uLift.value = data.lift;
      sheet.material.emissiveIntensity = data.lift * 0.08;
    });
  }
}
