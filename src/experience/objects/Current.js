import * as THREE from 'three';
import { createRandom } from '../utils/math';

const SAMPLES = 1024;

// "The current": a river of light that runs through every world, a nod to
// CurrentTech. The path is baked into a float texture (position, frame and
// colour per sample) so tens of thousands of particles can flow along it
// entirely on the GPU.
export class Current {
  constructor({ curve, colorAt, count = 14000, filaments = 3, seed = 3 }) {
    this.group = new THREE.Group();
    this.length = curve.getLength();

    const data = new Float32Array(SAMPLES * 4 * 4);
    const frames = curve.computeFrenetFrames(SAMPLES - 1, false);
    const point = new THREE.Vector3();
    const color = new THREE.Color();
    const write = (row, index, x, y, z) => {
      const offset = (row * SAMPLES + index) * 4;
      data[offset] = x;
      data[offset + 1] = y;
      data[offset + 2] = z;
      data[offset + 3] = 1;
    };
    for (let i = 0; i < SAMPLES; i += 1) {
      curve.getPointAt(i / (SAMPLES - 1), point);
      const normal = frames.normals[i];
      const binormal = frames.binormals[i];
      colorAt(point, color);
      write(0, i, point.x, point.y, point.z);
      write(1, i, normal.x, normal.y, normal.z);
      write(2, i, binormal.x, binormal.y, binormal.z);
      write(3, i, color.r, color.g, color.b);
    }
    this.pathTexture = new THREE.DataTexture(data, SAMPLES, 4, THREE.RGBAFormat, THREE.FloatType);
    this.pathTexture.magFilter = THREE.NearestFilter;
    this.pathTexture.minFilter = THREE.NearestFilter;
    this.pathTexture.needsUpdate = true;

    this.uniforms = {
      uPath: { value: this.pathTexture },
      uTime: { value: 0 },
      uFlow: { value: 1 },
      uLength: { value: this.length },
      uPixelRatio: { value: 1 },
      uFocusZ: { value: 0 },
      uBoost: { value: 0 },
    };

    this.particles = this.createParticles(count, seed);
    this.group.add(this.particles);
    for (let i = 0; i < filaments; i += 1) this.group.add(this.createFilament(curve, frames, i, filaments));
  }

  static get pathChunk() {
    return /* glsl */ `
      uniform sampler2D uPath;
      const float SAMPLES = ${SAMPLES.toFixed(1)};
      vec3 pathSample(float row, float t) {
        float x = clamp(t, 0.0, 1.0) * (SAMPLES - 1.0);
        float i0 = floor(x);
        float i1 = min(i0 + 1.0, SAMPLES - 1.0);
        float v = (row + 0.5) / 4.0;
        vec3 a = texture2D(uPath, vec2((i0 + 0.5) / SAMPLES, v)).xyz;
        vec3 b = texture2D(uPath, vec2((i1 + 0.5) / SAMPLES, v)).xyz;
        return mix(a, b, x - i0);
      }
    `;
  }

  createParticles(count, seed) {
    const random = createRandom(seed);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const params = new Float32Array(count * 4);
    const extra = new Float32Array(count * 2);
    for (let i = 0; i < count; i += 1) {
      params[i * 4] = random();
      params[i * 4 + 1] = Math.pow(random(), 1.7) * 1.25 + 0.03;
      params[i * 4 + 2] = random() * Math.PI * 2;
      params[i * 4 + 3] = 2.2 + random() * 4.5;
      extra[i * 2] = 0.35 + Math.pow(random(), 2.2) * 1.6;
      extra[i * 2 + 1] = random();
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aParams', new THREE.BufferAttribute(params, 4));
    geometry.setAttribute('aExtra', new THREE.BufferAttribute(extra, 2));

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        ${Current.pathChunk}
        uniform float uTime;
        uniform float uFlow;
        uniform float uLength;
        uniform float uPixelRatio;
        uniform float uFocusZ;
        uniform float uBoost;
        attribute vec4 aParams;
        attribute vec2 aExtra;
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float t = fract(aParams.x + uTime * uFlow * aParams.w / uLength);
          vec3 p = pathSample(0.0, t);
          vec3 n = pathSample(1.0, t);
          vec3 b = pathSample(2.0, t);
          float seed = aExtra.y;
          float swirl = aParams.z + uTime * (0.25 + seed * 0.5) + t * 38.0;
          float radius = aParams.y * (0.8 + 0.2 * sin(t * 90.0 + seed * 6.2831 + uTime * 1.3));
          vec3 pos = p + (n * cos(swirl) + b * sin(swirl)) * radius;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          float depth = -mv.z;
          gl_PointSize = aExtra.x * uPixelRatio * 36.0 / max(depth, 0.5);
          float focus = exp(-pow((pos.z - uFocusZ) / 22.0, 2.0));
          float core = 1.0 - smoothstep(0.0, 1.3, aParams.y);
          vColor = pathSample(3.0, t) * (0.7 + core * 0.9 + uBoost);
          vAlpha = (0.35 + 0.65 * focus) * smoothstep(170.0, 40.0, depth) * smoothstep(0.8, 3.5, depth);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.05, d);
          gl_FragColor = vec4(vColor, a * a * vAlpha);
        }
      `,
    });
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    return points;
  }

  createFilament(curve, frames, index, total) {
    const points = [];
    const radius = 0.55 + index * 0.18;
    const step = 6;
    const point = new THREE.Vector3();
    for (let i = 0; i < SAMPLES; i += step) {
      const t = i / (SAMPLES - 1);
      curve.getPointAt(t, point);
      const angle = (index / total) * Math.PI * 2 + t * 18.0;
      const n = frames.normals[i];
      const b = frames.binormals[i];
      points.push(
        point
          .clone()
          .addScaledVector(n, Math.cos(angle) * radius)
          .addScaledVector(b, Math.sin(angle) * radius),
      );
    }
    const path = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(path, 1400, 0.012 + index * 0.004, 5, false);
    const material = new THREE.ShaderMaterial({
      uniforms: { ...this.uniforms, uPhase: { value: index * 0.37 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vDepth = -mv.z;
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */ `
        ${Current.pathChunk}
        uniform float uTime;
        uniform float uFlow;
        uniform float uPhase;
        uniform float uBoost;
        varying vec2 vUv;
        varying float vDepth;
        void main() {
          vec3 color = pathSample(3.0, vUv.x);
          float pulse = pow(fract(vUv.x * 42.0 - uTime * 0.12 * uFlow + uPhase), 10.0);
          float alpha = (0.12 + pulse * 0.95 + uBoost * 0.3) * smoothstep(150.0, 25.0, vDepth) * smoothstep(0.5, 3.0, vDepth);
          gl_FragColor = vec4(color * (1.2 + pulse * 2.4), alpha);
        }
      `,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    return mesh;
  }

  update(time, pixelRatio, focusZ) {
    this.uniforms.uTime.value = time;
    this.uniforms.uPixelRatio.value = pixelRatio;
    this.uniforms.uFocusZ.value = focusZ;
  }
}
