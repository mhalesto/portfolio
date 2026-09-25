import * as THREE from 'three';
import { simplexNoise } from '../utils/glsl';

// A camera-centred sky sphere: near-black with two soft coloured glows that
// take on the palette of whichever app world the camera is visiting.
export class Backdrop {
  constructor() {
    this.uniforms = {
      uBase: { value: new THREE.Color('#06070a') },
      uGlowA: { value: new THREE.Color('#f4c15d') },
      uGlowB: { value: new THREE.Color('#3a7cf2') },
      uIntensity: { value: 1 },
      uTime: { value: 0 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false,
      vertexShader: /* glsl */ `
        varying vec3 vDirection;
        void main() {
          vDirection = normalize(position);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uBase;
        uniform vec3 uGlowA;
        uniform vec3 uGlowB;
        uniform float uIntensity;
        uniform float uTime;
        varying vec3 vDirection;
        ${simplexNoise}
        void main() {
          vec3 d = normalize(vDirection);
          vec3 color = uBase * (0.7 + 0.6 * smoothstep(-0.6, 0.8, d.y));
          float n = snoise(d * 2.3 + vec3(0.0, uTime * 0.015, 0.0)) * 0.5 + 0.5;
          float glowA = pow(max(dot(d, normalize(vec3(0.62, 0.32, -0.72))), 0.0), 3.2);
          float glowB = pow(max(dot(d, normalize(vec3(-0.7, -0.28, -0.66))), 0.0), 4.0);
          color += uGlowA * glowA * (0.07 + 0.08 * n) * uIntensity;
          color += uGlowB * glowB * (0.05 + 0.06 * n) * uIntensity;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), material);
    this.mesh.renderOrder = -100;
    this.mesh.frustumCulled = false;
  }

  update(camera, time) {
    this.mesh.position.copy(camera.position);
    this.uniforms.uTime.value = time;
  }
}
