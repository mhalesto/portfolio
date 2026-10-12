import * as THREE from 'three';
import { createRandom } from '../utils/math';

// Fine star dust spread along the whole journey; gives parallax and a sense
// of speed while the camera travels between worlds.
export class Dust {
  constructor({ count = 2400, zStart = 30, zEnd = -260, spread = 34, seed = 7 }) {
    const random = createRandom(seed);
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (random() - 0.5) * spread * 2;
      positions[i * 3 + 1] = (random() - 0.5) * spread * 1.2;
      positions[i * 3 + 2] = zStart + random() * (zEnd - zStart);
      sizes[i] = 0.35 + Math.pow(random(), 3) * 1.8;
      phases[i] = random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    this.uniforms = {
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color('#f3e9d2') },
    };
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aSize;
        attribute float aPhase;
        varying float vAlpha;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float depth = -mv.z;
          gl_PointSize = aSize * uPixelRatio * 26.0 / max(depth, 0.5);
          float twinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aSize) + aPhase);
          vAlpha = twinkle * smoothstep(140.0, 30.0, depth) * smoothstep(0.6, 3.0, depth);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(uColor, a * a * vAlpha * 0.9);
        }
      `,
    });
    this.points = new THREE.Points(geometry, material);
    this.points.frustumCulled = false;
  }

  update(time, pixelRatio) {
    this.uniforms.uTime.value = time;
    this.uniforms.uPixelRatio.value = pixelRatio;
  }
}
