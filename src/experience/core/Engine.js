import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { FinalPass } from './FinalPass';
import { addTicker } from '../../site/ticker';

const PRESETS = {
  high: { maxDpr: 2, bloom: true, samples: 4, particles: 1 },
  medium: { maxDpr: 1.5, bloom: true, samples: 4, particles: 0.7 },
  low: { maxDpr: 1.25, bloom: false, samples: 2, particles: 0.45 },
};

export function detectTier() {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 8;
  if (coarse) return cores >= 6 && memory >= 4 ? 'medium' : 'low';
  return cores >= 8 ? 'high' : 'medium';
}

// Owns the renderer, post-processing chain and frame loop. Scenes register
// per-frame callbacks; the engine watches its own frame time and quietly
// lowers resolution, then bloom, if a device cannot keep up.
export class Engine {
  constructor({ canvas, fov = 35, background = '#06070a' }) {
    this.canvas = canvas;
    this.tier = detectTier();
    this.preset = { ...PRESETS[this.tier] };
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.motion = this.reducedMotion ? 0.25 : 1;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(background, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.maxAnisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 480);

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const room = new RoomEnvironment();
    // A blurrier room keeps the light panels from mirroring as hot spots.
    this.environment = pmrem.fromScene(room, 0.12).texture;
    this.scene.environment = this.environment;
    this.scene.environmentIntensity = 0.55;
    pmrem.dispose();
    if (room.dispose) room.dispose();

    const target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      samples: this.preset.samples,
    });
    this.composer = new EffectComposer(this.renderer, target);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    // Threshold 1.0: only true HDR emissives (glows, the current) bloom; lit
    // surfaces such as paper or pastel tiles stay crisp.
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.55, 0.5, 1.0);
    this.bloomPass.enabled = this.preset.bloom;
    this.composer.addPass(this.bloomPass);
    this.finalPass = new FinalPass();
    this.composer.addPass(this.finalPass);

    this.time = 0;
    this.width = 1;
    this.height = 1;
    this.dpr = 1;
    this.running = true;
    this.callbacks = [];
    this.resizeCallbacks = [];
    this.perf = { frames: 0, time: 0, windows: 0 };

    this.handleResize = () => this.resize();
    window.addEventListener('resize', this.handleResize);
    this.resize();
    this.removeTicker = addTicker((now, delta) => this.frame(delta), 0);
  }

  onFrame(callback) {
    this.callbacks.push(callback);
  }

  onResize(callback) {
    this.resizeCallbacks.push(callback);
    callback(this.width, this.height);
  }

  setRunning(value) {
    this.running = value;
  }

  resize() {
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.preset.maxDpr);
    // Mobile browsers fire resize when their toolbars slide; the canvas is
    // sized in lvh so nothing changes and render targets stay untouched.
    if (width === this.width && height === this.height && dpr === this.dpr) return;
    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(width, height, false);
    this.composer.setPixelRatio(this.dpr);
    this.composer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.resizeCallbacks.forEach(callback => callback(width, height));
  }

  frame(delta) {
    if (!this.running) return;
    this.time += delta;
    this.watchPerformance(delta);
    for (let i = 0; i < this.callbacks.length; i += 1) this.callbacks[i](this.time, delta);
    this.composer.render(delta);
  }

  watchPerformance(delta) {
    const perf = this.perf;
    perf.frames += 1;
    perf.time += delta;
    if (perf.frames < 90) return;
    const average = perf.time / perf.frames;
    perf.frames = 0;
    perf.time = 0;
    perf.windows += 1;
    // Ignore the first few seconds while textures upload and shaders compile.
    if (perf.windows < 3 || average < 1 / 40) return;
    if (this.dpr > 1.01) {
      this.preset.maxDpr = Math.max(1, this.dpr - 0.35);
      this.resize();
    } else if (this.bloomPass.enabled) {
      this.bloomPass.enabled = false;
    }
  }

  dispose() {
    this.running = false;
    this.removeTicker();
    window.removeEventListener('resize', this.handleResize);
    this.scene.traverse(object => {
      if (object.geometry) object.geometry.dispose();
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach(material => {
        if (!material) return;
        Object.values(material).forEach(value => {
          if (value && value.isTexture) value.dispose();
        });
        if (material.uniforms) {
          Object.values(material.uniforms).forEach(uniform => {
            if (uniform && uniform.value && uniform.value.isTexture) uniform.value.dispose();
          });
        }
        material.dispose();
      });
    });
    this.environment.dispose();
    this.composer.dispose();
    this.bloomPass.dispose();
    this.finalPass.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
