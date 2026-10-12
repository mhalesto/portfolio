import * as THREE from 'three';
import { FullScreenQuad, Pass } from 'three/addons/postprocessing/Pass.js';

// Replaces OutputPass: ACES tone mapping and sRGB output, plus a lens-like
// chromatic fringe that grows with scroll speed and a soft vignette.
const vertexShader = /* glsl */ `
  precision highp float;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  attribute vec3 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D tDiffuse;
  uniform float uAberration;
  uniform float uVignette;
  #include <tonemapping_pars_fragment>
  #include <colorspace_pars_fragment>
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered);
    vec2 offset = centered * uAberration * dist;
    vec3 color;
    color.r = texture2D(tDiffuse, vUv + offset).r;
    color.g = texture2D(tDiffuse, vUv).g;
    color.b = texture2D(tDiffuse, vUv - offset).b;

    color = ACESFilmicToneMapping(color);
    vec4 outColor = sRGBTransferOETF(vec4(color, 1.0));
    outColor.rgb *= 1.0 - uVignette * smoothstep(0.32, 0.95, dist);
    gl_FragColor = outColor;
  }
`;

export class FinalPass extends Pass {
  constructor() {
    super();
    this.uniforms = {
      tDiffuse: { value: null },
      toneMappingExposure: { value: 1 },
      uAberration: { value: 0.012 },
      uVignette: { value: 0.42 },
    };
    this.material = new THREE.RawShaderMaterial({
      name: 'FinalPass',
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    this.fsQuad = new FullScreenQuad(this.material);
  }

  render(renderer, writeBuffer, readBuffer) {
    this.uniforms.tDiffuse.value = readBuffer.texture;
    this.uniforms.toneMappingExposure.value = renderer.toneMappingExposure;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
    }
    this.fsQuad.render(renderer);
  }

  dispose() {
    this.material.dispose();
    this.fsQuad.dispose();
  }
}
