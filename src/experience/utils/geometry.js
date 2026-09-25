import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

// iOS icons are superellipses rather than rounded rectangles; an exponent of
// about 5 reproduces the continuous "squircle" corner.
export function superellipseShape(halfWidth, halfHeight, exponent = 5, segments = 160) {
  const shape = new THREE.Shape();
  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    const c = Math.cos(t);
    const s = Math.sin(t);
    const x = Math.sign(c) * Math.pow(Math.abs(c), 2 / exponent) * halfWidth;
    const y = Math.sign(s) * Math.pow(Math.abs(s), 2 / exponent) * halfHeight;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
}

export function roundedRectShape(width, height, radius) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  const shape = new THREE.Shape();
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - r);
  shape.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
  shape.lineTo(x + r, y + height);
  shape.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + r);
  shape.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return shape;
}

// Maps a flat shape's UVs to 0..1 across its bounding box.
export function normalizeShapeUVs(geometry, width, height) {
  const position = geometry.attributes.position;
  const uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i += 1) {
    uv.setXY(i, position.getX(i) / width + 0.5, position.getY(i) / height + 0.5);
  }
  uv.needsUpdate = true;
  return geometry;
}

export function roundedPlane(width, height, radius, segments = 10) {
  const geometry = new THREE.ShapeGeometry(roundedRectShape(width, height, radius), segments);
  return normalizeShapeUVs(geometry, width, height);
}

// A thick app-icon tile with a smooth bevel. Material groups:
// 0 = front face (icon art), 1 = sides and bevel, 2 = back face.
export function createSlabGeometry({ size = 1.6, depth = 0.26, bevel = 0.06, exponent = 5 } = {}) {
  const half = size / 2 - bevel;
  const core = depth - bevel * 2;
  const extruded = new THREE.ExtrudeGeometry(superellipseShape(half, half, exponent), {
    depth: core,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 6,
    curveSegments: 1,
    steps: 1,
  });
  extruded.translate(0, 0, -core / 2);

  const lids = extruded.groups[0];
  const sides = extruded.groups[1];
  const lidHalf = lids.count / 2;
  const position = extruded.attributes.position;
  const uv = extruded.attributes.uv;
  for (let i = 0; i < position.count; i += 1) {
    let u = (position.getX(i) + size / 2) / size;
    const v = (position.getY(i) + size / 2) / size;
    // The back lid is seen from behind, so mirror it to keep its art readable.
    if (i >= lids.start && i < lids.start + lidHalf) u = 1 - u;
    uv.setXY(i, u, v);
  }

  // The lids only have rim vertices, so welding them to the bevel would bend
  // the normals across the whole flat face. Weld and smooth each part on its
  // own: flat lids, smooth bevel.
  const part = (start, count) => {
    const piece = new THREE.BufferGeometry();
    ['position', 'uv'].forEach(name => {
      const attribute = extruded.attributes[name];
      const array = attribute.array.slice(start * attribute.itemSize, (start + count) * attribute.itemSize);
      piece.setAttribute(name, new THREE.BufferAttribute(array, attribute.itemSize));
    });
    const welded = mergeVertices(piece, 1e-5);
    welded.computeVertexNormals();
    piece.dispose();
    return welded;
  };

  const front = part(lids.start + lidHalf, lidHalf);
  const side = part(sides.start, sides.count);
  const back = part(lids.start, lidHalf);
  const geometry = mergeGeometries([front, side, back], true);
  [front, side, back, extruded].forEach(piece => piece.dispose());
  return geometry;
}
