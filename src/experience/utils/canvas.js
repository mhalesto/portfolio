import * as THREE from 'three';

export const FONT_SANS = '"Inter Tight Variable", "Inter Tight", system-ui, -apple-system, sans-serif';
export const FONT_MONO = '"JetBrains Mono Variable", "JetBrains Mono", ui-monospace, monospace';
export const FONT_SERIF = '"Instrument Serif", Georgia, serif';

export function makeCanvas(width, height) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return { canvas, ctx: canvas.getContext('2d') };
}

export function roundRectPath(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

export function toTexture(canvas, { anisotropy = 4, srgb = true } = {}) {
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

// Canvas text is drawn once, so wait for the self-hosted fonts first.
export async function ensureFonts() {
  if (!document.fonts || !document.fonts.load) return;
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load(`600 48px ${FONT_SANS}`),
        document.fonts.load(`500 20px ${FONT_MONO}`),
        document.fonts.load(`italic 400 48px ${FONT_SERIF}`),
      ]),
      new Promise(resolve => setTimeout(resolve, 2500)),
    ]);
  } catch (error) {
    // Fall back to system fonts; the scene still renders.
  }
}

// Mean linear luminance (0-1) of an image or canvas, sampled at low resolution.
export function imageBrightness(image) {
  if (!image) return 0;
  try {
    const { ctx } = makeCanvas(24, 24);
    ctx.drawImage(image, 0, 0, 24, 24);
    const { data } = ctx.getImageData(0, 0, 24, 24);
    const linear = value => {
      const c = value / 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    let total = 0;
    for (let i = 0; i < data.length; i += 4) {
      total += 0.2126 * linear(data[i]) + 0.7152 * linear(data[i + 1]) + 0.0722 * linear(data[i + 2]);
    }
    return total / (data.length / 4);
  } catch (error) {
    return 0;
  }
}

export function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
