import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { World } from './World';
import { roundedRectShape } from '../utils/geometry';
import { createRandom, easeOutBack } from '../utils/math';

const SIZE = 5;
const CELL = 0.6;

function paint(geometry, color) {
  const flat = geometry.index ? geometry.toNonIndexed() : geometry;
  const c = new THREE.Color(color);
  const colors = new Float32Array(flat.attributes.position.count * 3);
  for (let i = 0; i < colors.length; i += 3) {
    colors[i] = c.r;
    colors[i + 1] = c.g;
    colors[i + 2] = c.b;
  }
  flat.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  if (!flat.attributes.uv)
    flat.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(flat.attributes.position.count * 2), 2));
  return flat;
}

const lathe = (points, segments = 28) =>
  new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );

function leaf(x, y, z, rotation, size = 0.06) {
  const geometry = new THREE.SphereGeometry(size, 10, 6);
  geometry.scale(1, 0.22, 0.5);
  geometry.rotateZ(rotation);
  geometry.translate(x, y, z);
  return paint(geometry, '#3cb44b');
}

function stem(x, y, tilt = -0.2, height = 0.1) {
  const geometry = new THREE.CylinderGeometry(0.011, 0.015, height, 6);
  geometry.rotateZ(tilt);
  geometry.translate(x, y, 0);
  return paint(geometry, '#6b4226');
}

function apple() {
  const body = lathe([
    [0, -0.15],
    [0.07, -0.175],
    [0.14, -0.15],
    [0.19, -0.07],
    [0.2, 0.02],
    [0.18, 0.1],
    [0.13, 0.16],
    [0.07, 0.17],
    [0.03, 0.14],
    [0, 0.125],
  ]);
  return [paint(body, '#e3263a'), stem(0.012, 0.19), leaf(0.07, 0.21, 0, 0.5)];
}

function cherries() {
  const parts = [];
  [
    [-0.08, -0.08, 0],
    [0.085, -0.1, 0.02],
  ].forEach(([x, y, z]) => {
    const berry = new THREE.SphereGeometry(0.1, 22, 16);
    berry.translate(x, y, z);
    parts.push(paint(berry, '#c8102e'));
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(x, y + 0.08, z),
      new THREE.Vector3(x * 0.6, 0.12, z),
      new THREE.Vector3(0.02, 0.21, 0),
    );
    parts.push(paint(new THREE.TubeGeometry(curve, 12, 0.011, 5, false), '#5b8c2a'));
  });
  parts.push(leaf(0.08, 0.22, 0, -0.4, 0.055));
  return parts;
}

function strawberry(random) {
  const profile = [
    [0, -0.2],
    [0.05, -0.17],
    [0.11, -0.08],
    [0.15, 0.02],
    [0.155, 0.08],
    [0.13, 0.13],
    [0.07, 0.155],
    [0, 0.16],
  ];
  const parts = [paint(lathe(profile), '#ef2b3c')];
  const radiusAt = y => {
    for (let i = 0; i < profile.length - 1; i += 1) {
      const [x0, y0] = profile[i];
      const [x1, y1] = profile[i + 1];
      if (y >= y0 && y <= y1) return x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
    }
    return 0.05;
  };
  for (let i = 0; i < 28; i += 1) {
    const y = -0.15 + random() * 0.26;
    const angle = random() * Math.PI * 2;
    const r = radiusAt(y) + 0.004;
    const seed = new THREE.IcosahedronGeometry(0.012, 0);
    seed.scale(1, 1.5, 1);
    seed.translate(Math.cos(angle) * r, y, Math.sin(angle) * r);
    parts.push(paint(seed, '#ffe08a'));
  }
  for (let i = 0; i < 6; i += 1) {
    const sepal = new THREE.ConeGeometry(0.035, 0.12, 4);
    sepal.rotateZ(Math.PI / 2 + 0.5);
    sepal.translate(0.07, 0.155, 0);
    sepal.rotateY((i / 6) * Math.PI * 2);
    parts.push(paint(sepal, '#2f9e44'));
  }
  parts.push(stem(0, 0.2, 0, 0.08));
  return parts;
}

function grapes() {
  const parts = [];
  const layers = [
    { y: 0.1, count: 4, r: 0.075, offset: 0 },
    { y: 0.01, count: 4, r: 0.065, offset: Math.PI / 4 },
    { y: -0.08, count: 3, r: 0.05, offset: 0.3 },
    { y: -0.16, count: 1, r: 0, offset: 0 },
  ];
  layers.forEach((layer, layerIndex) => {
    for (let i = 0; i < layer.count; i += 1) {
      const angle = layer.offset + (i / layer.count) * Math.PI * 2;
      const grape = new THREE.SphereGeometry(0.066, 16, 12);
      grape.translate(Math.cos(angle) * layer.r, layer.y, Math.sin(angle) * layer.r);
      parts.push(paint(grape, (i + layerIndex) % 2 ? '#7b2d8e' : '#9b3fb0'));
    }
  });
  parts.push(stem(0, 0.2, 0.1, 0.1));
  parts.push(leaf(-0.07, 0.19, 0, -0.5, 0.07));
  return parts;
}

function banana() {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.21, 0.1, 0),
    new THREE.Vector3(0.0, -0.22, 0),
    new THREE.Vector3(0.21, 0.1, 0),
  );
  const segments = 26;
  const radial = 10;
  const tube = new THREE.TubeGeometry(curve, segments, 0.075, radial, false);
  const position = tube.attributes.position;
  const centre = new THREE.Vector3();
  const vertex = new THREE.Vector3();
  for (let i = 0; i <= segments; i += 1) {
    const u = i / segments;
    curve.getPointAt(u, centre);
    const taper = 0.22 + 0.78 * Math.pow(Math.sin(Math.PI * u), 0.65);
    for (let j = 0; j <= radial; j += 1) {
      const index = i * (radial + 1) + j;
      vertex.fromBufferAttribute(position, index).sub(centre).multiplyScalar(taper).add(centre);
      position.setXYZ(index, vertex.x, vertex.y, vertex.z);
    }
  }
  tube.computeVertexNormals();
  const tipA = new THREE.SphereGeometry(0.02, 8, 6);
  tipA.translate(-0.21, 0.1, 0);
  const tipB = new THREE.SphereGeometry(0.024, 8, 6);
  tipB.translate(0.21, 0.1, 0);
  return [paint(tube, '#ffd23f'), paint(tipA, '#5b3a1e'), paint(tipB, '#5b3a1e')];
}

const FRUIT_COLORS = ['#ff4d5e', '#ff2d55', '#ff4d6d', '#b04fd1', '#ffd23f'];

// SugarShifts: a wooden board (like the icon's basket) of glossy fruit that
// keeps making match-3 clears. Visitors can pop fruit themselves.
export class SugarShiftsWorld extends World {
  constructor({ app }) {
    super({ app });
    const random = createRandom(9);
    this.random = random;
    this.slabAnchor.position.set(0, 1.5, 0.55);
    this.slabAnchor.scale = 0.66;

    this.fruitGeometries = [apple(), cherries(), strawberry(random), grapes(), banana()].map(parts => {
      const merged = mergeGeometries(parts);
      parts.forEach(part => part.dispose());
      return merged;
    });
    this.fruitMaterial = new THREE.MeshPhysicalMaterial({
      vertexColors: true,
      roughness: 0.28,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });

    this.board = new THREE.Group();
    this.board.position.set(0, -0.5, -0.2);
    this.board.rotation.x = 0.95;
    this.group.add(this.board);

    const base = new THREE.ExtrudeGeometry(roundedRectShape(3.25, 3.25, 0.36), {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 10,
    });
    base.rotateX(-Math.PI / 2);
    base.translate(0, -0.2, 0);
    this.board.add(
      new THREE.Mesh(
        base,
        new THREE.MeshPhysicalMaterial({ color: '#9a5b33', roughness: 0.45, clearcoat: 0.6, clearcoatRoughness: 0.3 }),
      ),
    );

    const tile = new THREE.ExtrudeGeometry(roundedRectShape(0.52, 0.52, 0.12), {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
      curveSegments: 8,
    });
    tile.rotateX(-Math.PI / 2);
    const tiles = new THREE.InstancedMesh(
      tile,
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0.55, 0.55, 0.55),
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.2,
      }),
      SIZE * SIZE,
    );
    const pastel = ['#ffe4f1', '#fff3d6', '#e6f4ff', '#eafbe7', '#f3e8ff'].map(c => new THREE.Color(c));
    const matrix = new THREE.Matrix4();
    this.cells = [];
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const index = row * SIZE + col;
        const x = (col - (SIZE - 1) / 2) * CELL;
        const z = (row - (SIZE - 1) / 2) * CELL;
        matrix.makeTranslation(x, -0.06, z);
        tiles.setMatrixAt(index, matrix);
        tiles.setColorAt(index, pastel[(row * 2 + col) % pastel.length]);
        const type = Math.floor(random() * this.fruitGeometries.length);
        const mesh = new THREE.Mesh(this.fruitGeometries[type], this.fruitMaterial);
        mesh.position.set(x, 0.2, z);
        mesh.rotation.y = (random() - 0.5) * 0.8;
        mesh.userData.cell = index;
        this.board.add(mesh);
        this.cells.push({ index, row, col, type, mesh, pop: 0, drop: 0, wiggle: 0 });
      }
    }
    this.board.add(tiles);

    // Sparkle pool for pops
    this.sparkCount = 160;
    this.sparks = Array.from({ length: this.sparkCount }, () => ({
      life: 0,
      velocity: new THREE.Vector3(),
      position: new THREE.Vector3(),
    }));
    this.sparkPositions = new Float32Array(this.sparkCount * 3);
    this.sparkColors = new Float32Array(this.sparkCount * 3);
    this.sparkLife = new Float32Array(this.sparkCount);
    const sparkGeometry = new THREE.BufferGeometry();
    sparkGeometry.setAttribute('position', new THREE.BufferAttribute(this.sparkPositions, 3));
    sparkGeometry.setAttribute('color', new THREE.BufferAttribute(this.sparkColors, 3));
    sparkGeometry.setAttribute('aLife', new THREE.BufferAttribute(this.sparkLife, 1));
    this.sparkUniforms = { uPixelRatio: { value: 1 } };
    this.sparkPoints = new THREE.Points(
      sparkGeometry,
      new THREE.ShaderMaterial({
        uniforms: this.sparkUniforms,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uPixelRatio;
          attribute float aLife;
          varying float vLife;
          varying vec3 vColor;
          void main() {
            vLife = aLife;
            vColor = color;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (4.0 + 10.0 * aLife) * uPixelRatio * 6.0 / max(-mv.z, 0.5);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vLife;
          varying vec3 vColor;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d) * vLife;
            gl_FragColor = vec4(vColor * 2.2, a);
          }
        `,
      }),
    );
    this.sparkPoints.frustumCulled = false;
    this.board.add(this.sparkPoints);
    this.nextSpark = 0;

    this.timer = 0.6;
    this.queue = [];
    this.clock = 0;

    // Sparks must never intercept the pointer.
    this.sparkPoints.raycast = () => {};

    this.targets.push({
      object: this.board,
      label: 'Pop',
      color: app.colors.a,
      onClick: hit => {
        const cell =
          hit && hit.object && hit.object.userData.cell !== undefined ? this.cells[hit.object.userData.cell] : null;
        if (cell && cell.pop === 0 && cell.drop <= 0.05) this.pop([cell]);
      },
    });
  }

  at(delay, fn) {
    this.queue.push({ at: this.clock + delay, fn });
  }

  findMatches() {
    const found = new Set();
    const typeAt = (row, col) => this.cells[row * SIZE + col].type;
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE - 2; col += 1) {
        const t = typeAt(row, col);
        if (t === typeAt(row, col + 1) && t === typeAt(row, col + 2))
          [0, 1, 2].forEach(k => found.add(row * SIZE + col + k));
      }
    }
    for (let col = 0; col < SIZE; col += 1) {
      for (let row = 0; row < SIZE - 2; row += 1) {
        const t = typeAt(row, col);
        if (t === typeAt(row + 1, col) && t === typeAt(row + 2, col))
          [0, 1, 2].forEach(k => found.add((row + k) * SIZE + col));
      }
    }
    return Array.from(found).map(index => this.cells[index]);
  }

  // No natural match on the board: line three fruit up with a quick
  // "shift" wiggle, then clear them like the game does.
  arrangeMatch() {
    const horizontal = this.random() > 0.5;
    const row = Math.floor(this.random() * (horizontal ? SIZE : SIZE - 2));
    const col = Math.floor(this.random() * (horizontal ? SIZE - 2 : SIZE));
    const line = [0, 1, 2].map(k => this.cells[horizontal ? row * SIZE + col + k : (row + k) * SIZE + col]);
    const type = line[1].type;
    line.forEach(cell => {
      cell.wiggle = 1;
      if (cell.type !== type) this.setType(cell, type);
    });
    return line;
  }

  setType(cell, type) {
    cell.type = type;
    cell.mesh.geometry = this.fruitGeometries[type];
  }

  pop(cells) {
    cells.forEach(cell => {
      cell.pop = 0.0001;
      this.emitSparks(cell);
    });
    this.at(0.32, () => {
      cells.forEach(cell => {
        let type = Math.floor(this.random() * this.fruitGeometries.length);
        if (type === cell.type) type = (type + 1) % this.fruitGeometries.length;
        this.setType(cell, type);
        cell.pop = 0;
        cell.drop = 1;
      });
    });
  }

  emitSparks(cell) {
    const color = new THREE.Color(FRUIT_COLORS[cell.type]);
    for (let i = 0; i < 18; i += 1) {
      const spark = this.sparks[this.nextSpark];
      this.nextSpark = (this.nextSpark + 1) % this.sparkCount;
      spark.life = 1;
      spark.position.copy(cell.mesh.position);
      spark.position.y += 0.05;
      spark.velocity.set((this.random() - 0.5) * 2.2, 0.8 + this.random() * 1.6, (this.random() - 0.5) * 2.2);
      spark.color = color;
    }
  }

  update({ time, delta, local, motion, pixelRatio }) {
    this.clock += delta;
    this.sparkUniforms.uPixelRatio.value = pixelRatio;
    const active = Math.abs(local) < 0.4;
    if (active) {
      this.timer -= delta * motion;
      if (this.timer <= 0) {
        this.timer = 1.9;
        const matches = this.findMatches();
        if (matches.length) this.pop(matches);
        else {
          const line = this.arrangeMatch();
          this.at(0.45, () => this.pop(line));
        }
      }
    }
    this.queue = this.queue.filter(item => {
      if (item.at <= this.clock) {
        item.fn();
        return false;
      }
      return true;
    });

    this.cells.forEach(cell => {
      const mesh = cell.mesh;
      if (cell.pop > 0) cell.pop = Math.min(1, cell.pop + delta * 3.2);
      cell.drop = Math.max(0, cell.drop - delta * 1.8);
      cell.wiggle = Math.max(0, cell.wiggle - delta * 2.2);
      const popScale =
        cell.pop > 0 ? (cell.pop < 0.35 ? 1 + cell.pop * 0.9 : Math.max(0, 1.3 * (1 - (cell.pop - 0.35) / 0.65))) : 1;
      const dropT = 1 - cell.drop;
      const fall = cell.drop > 0 ? (1 - easeOutBack(dropT, 1.2)) * 1.4 : 0;
      mesh.position.y = 0.2 + fall + Math.sin(time * 2 + cell.index) * 0.015 * motion;
      mesh.rotation.z = Math.sin(time * 18) * 0.25 * cell.wiggle;
      mesh.scale.setScalar(Math.max(0.0001, popScale * (cell.drop > 0 ? Math.min(1, dropT * 3) : 1)));
    });

    for (let i = 0; i < this.sparkCount; i += 1) {
      const spark = this.sparks[i];
      if (spark.life > 0) {
        spark.life = Math.max(0, spark.life - delta * 1.6);
        spark.velocity.y -= delta * 3.2;
        spark.position.addScaledVector(spark.velocity, delta);
      }
      this.sparkPositions[i * 3] = spark.position.x;
      this.sparkPositions[i * 3 + 1] = spark.position.y;
      this.sparkPositions[i * 3 + 2] = spark.position.z;
      const color = spark.color || { r: 1, g: 1, b: 1 };
      this.sparkColors[i * 3] = color.r;
      this.sparkColors[i * 3 + 1] = color.g;
      this.sparkColors[i * 3 + 2] = color.b;
      this.sparkLife[i] = spark.life;
    }
    const attributes = this.sparkPoints.geometry.attributes;
    attributes.position.needsUpdate = true;
    attributes.color.needsUpdate = true;
    attributes.aLife.needsUpdate = true;

    this.board.rotation.z = Math.sin(time * 0.35) * 0.05 * motion;
  }
}
