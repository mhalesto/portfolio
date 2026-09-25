import * as THREE from 'three';
import { makeCanvas, roundRectPath } from '../utils/canvas';

// A glowing torus arc that can be "filled" from 0 to 1 (progress rings,
// storage gauges). Works with TorusGeometry built with the same arc length.
export function createArcMaterial(color, arc, fill = 1) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uArc: { value: arc },
      uFill: { value: fill },
      uGlow: { value: 1 },
    },
    vertexShader: /* glsl */ `
      varying float vAngle;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vAngle = atan(position.y, position.x);
        if (vAngle < -0.001) vAngle += 6.2831853;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mv.xyz);
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uArc;
      uniform float uFill;
      uniform float uGlow;
      varying float vAngle;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float end = uArc * uFill;
        if (vAngle > end + 0.0001 || uFill <= 0.001) discard;
        float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 1.6);
        float head = smoothstep(end - 0.35, end, vAngle);
        vec3 color = uColor * (0.75 + rim * 0.9 + head * 1.2) * uGlow;
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });
}

// White rounded rectangle on black, used as an alphaMap for card-like planes.
let roundedMask = null;
export function getRoundedMask() {
  if (roundedMask) return roundedMask;
  const { canvas, ctx } = makeCanvas(256, 512);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 256, 512);
  ctx.fillStyle = '#fff';
  roundRectPath(ctx, 6, 6, 244, 500, 30);
  ctx.fill();
  roundedMask = new THREE.CanvasTexture(canvas);
  return roundedMask;
}

export function resetSharedMaterials() {
  roundedMask = null;
}
