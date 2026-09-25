import * as THREE from 'three';
import { Engine } from './core/Engine';
import { Interaction } from './core/Interaction';
import { Backdrop } from './objects/Backdrop';
import { Dust } from './objects/Dust';
import { Current } from './objects/Current';
import { SLAB_SIZE, createSlabBackTexture } from './objects/IconSlab';
import { FinaleWorld } from './worlds/FinaleWorld';
import { createSlabGeometry } from './utils/geometry';
import { ensureFonts } from './utils/canvas';
import { damp } from './utils/math';
import { resetSharedMaterials } from './worlds/materials';

const FOV = 35;

// Projects page header: every app icon orbiting the CurrentTech core, each
// one clickable. A closed loop of the current swirls around them.
export function createOrbitExperience(options) {
  const controller = {
    disposed: false,
    experience: null,
    dispose() {
      controller.disposed = true;
      if (controller.experience) controller.experience.dispose();
      controller.experience = null;
    },
  };
  build(options, controller)
    .then(experience => {
      if (!experience) return;
      if (controller.disposed) experience.dispose();
      else controller.experience = experience;
    })
    .catch(error => {
      if (options.onError) options.onError(error);
    });
  return controller;
}

async function build({ canvas, apps, onNavigate, onReady = () => {} }, controller) {
  const engine = new Engine({ canvas, fov: FOV });
  engine.setRunning(false);
  const { scene, camera, renderer } = engine;
  const abort = () => {
    engine.dispose();
    return null;
  };

  await ensureFonts();
  const loader = new THREE.TextureLoader();
  const icons = await Promise.all(
    apps.map(
      app =>
        new Promise(resolve =>
          loader.load(
            app.icon,
            texture => {
              texture.colorSpace = THREE.SRGBColorSpace;
              texture.anisotropy = engine.maxAnisotropy;
              resolve(texture);
            },
            undefined,
            () => resolve(null),
          ),
        ),
    ),
  );
  if (controller.disposed) return abort();

  scene.add(new THREE.HemisphereLight('#c9d6ff', '#1a1020', 0.5));
  const key = new THREE.DirectionalLight('#ffffff', 1.5);
  key.position.set(4, 6, 8);
  scene.add(key);

  const backdrop = new Backdrop();
  backdrop.uniforms.uBase.value.set('#0a0807');
  backdrop.uniforms.uGlowA.value.set('#f4a93b');
  backdrop.uniforms.uGlowB.value.set('#8b3dff');
  scene.add(backdrop.mesh);
  const dust = new Dust({ count: Math.round(1400 * engine.preset.particles), zStart: 20, zEnd: -80, spread: 26 });
  scene.add(dust.points);

  const loop = [];
  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2;
    loop.push(new THREE.Vector3(Math.cos(angle) * 3.4, Math.sin(angle * 2) * 0.35 - 0.2, Math.sin(angle) * 1.9));
  }
  const gold = new THREE.Color('#f4c15d');
  const violet = new THREE.Color('#8b3dff');
  const current = new Current({
    curve: new THREE.CatmullRomCurve3(loop, true, 'centripetal'),
    count: Math.round(7000 * engine.preset.particles),
    filaments: 2,
    colorAt: (point, target) => target.copy(gold).lerp(violet, 0.5 + 0.5 * Math.sin(Math.atan2(point.z, point.x))),
  });
  scene.add(current.group);

  const slabGeometry = createSlabGeometry({ size: SLAB_SIZE });
  const slabTextures = apps.map((app, index) => ({
    front: icons[index] || new THREE.Texture(),
    back: createSlabBackTexture(app),
  }));
  const finale = new FinaleWorld({ apps, slabGeometry, slabTextures, onNavigate, radius: 2.6, iconScale: 0.5 });
  scene.add(finale.group);

  const interaction = new Interaction({ canvas, camera });
  interaction.setTargets(finale.targets);

  let stacked = false;
  let distance = 10;
  engine.onResize((width, height) => {
    const aspect = width / height;
    stacked = aspect < 0.95 || width < 760;
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    distance = stacked
      ? Math.max(3.2 / (tanHalf * aspect * 0.96), 2.4 / (tanHalf * 0.5))
      : Math.max(2.6 / (tanHalf * 0.8), 3.6 / (tanHalf * aspect * 0.62));
  });

  const frameState = {
    time: 0,
    delta: 0,
    local: 0,
    hold: 0,
    camera,
    interaction,
    motion: engine.motion,
    pixelRatio: 1,
  };
  let scrollFade = 0;
  engine.onFrame((time, delta) => {
    scrollFade = damp(scrollFade, Math.min(1, window.scrollY / window.innerHeight), 6, delta);
    const parallax = engine.motion;
    camera.position.set(
      interaction.screen.x * 0.4 * parallax,
      0.9 + interaction.screen.y * 0.3 * parallax + scrollFade * 1.2,
      distance,
    );
    camera.lookAt(0, scrollFade * 0.6, 0);
    const fx = stacked ? 0.5 : 0.68;
    const fy = stacked ? 0.3 : 0.5;
    camera.setViewOffset(
      engine.width,
      engine.height,
      (0.5 - fx) * engine.width,
      (0.5 - fy) * engine.height,
      engine.width,
      engine.height,
    );
    backdrop.update(camera, time);
    dust.update(time, engine.dpr);
    current.update(time, engine.dpr, 0);
    frameState.time = time;
    frameState.delta = delta;
    frameState.pixelRatio = engine.dpr;
    finale.update(frameState);
    interaction.update();
  });

  // Stop rendering once the header has scrolled away.
  const observer = new IntersectionObserver(([entry]) => engine.setRunning(entry.isIntersecting), { threshold: 0 });
  try {
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
  } catch (error) {
    // Compile lazily on first render instead.
  }
  if (controller.disposed) return abort();
  engine.setRunning(true);
  observer.observe(canvas);
  onReady();

  return {
    dispose() {
      observer.disconnect();
      interaction.dispose();
      engine.dispose();
      resetSharedMaterials();
    },
  };
}
