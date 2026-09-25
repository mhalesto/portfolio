import * as THREE from 'three';
import { Engine } from './core/Engine';
import { Journey } from './core/Journey';
import { Interaction } from './core/Interaction';
import { Backdrop } from './objects/Backdrop';
import { Dust } from './objects/Dust';
import { Current } from './objects/Current';
import { Phone } from './objects/Phone';
import { IconSlab, SLAB_SIZE, createSlabBackTexture } from './objects/IconSlab';
import { createSlabGeometry } from './utils/geometry';
import { ensureFonts, makeCanvas, toTexture } from './utils/canvas';
import { clamp, damp, easeInOutCubic, smoothstep } from './utils/math';
import { ClipAuraWorld } from './worlds/ClipAuraWorld';
import { SmartCleanerWorld } from './worlds/SmartCleanerWorld';
import { ResumeStudioWorld } from './worlds/ResumeStudioWorld';
import { SugarShiftsWorld } from './worlds/SugarShiftsWorld';
import { SoundFrameWorld } from './worlds/SoundFrameWorld';
import { LifeTrackWorld } from './worlds/LifeTrackWorld';
import { YouMineWorld } from './worlds/YouMineWorld';
import { WebWorld } from './worlds/WebWorld';
import { FinaleWorld } from './worlds/FinaleWorld';
import { resetSharedMaterials } from './worlds/materials';

const GAP = 24;
const FOV = 35;
const WORLD_TYPES = {
  clipaura: ClipAuraWorld,
  smartcleaner: SmartCleanerWorld,
  resumestudio: ResumeStudioWorld,
  sugarshifts: SugarShiftsWorld,
  soundframe: SoundFrameWorld,
  lifetrack: LifeTrackWorld,
  youmine: YouMineWorld,
};

// Lateral offsets make the camera weave between worlds instead of flying in
// a straight line. Index 0 is the hero phone, then the apps, then the web
// work and finally the finale core.
const OFFSETS = [
  [0, 0],
  [-5, 1],
  [4.2, -0.6],
  [-4, 0.8],
  [4.5, -0.8],
  [-4.5, 0.6],
  [4, -0.5],
  [-3.5, 0.5],
  [2, 0.2],
  [0, 0.6],
];

const FRAMING = {
  hero: {
    fitX: 1.05,
    fitY: 1.2,
    wide: { v: 0.8, h: 0.56, fx: 0.73, fy: 0.5 },
    stacked: { v: 0.46, h: 0.9, fx: 0.5, fy: 0.3 },
  },
  app: {
    fitX: 2.6,
    fitY: 2.45,
    wide: { v: 0.9, h: 0.6, fx: 0.67, fy: 0.5 },
    stacked: { v: 0.5, h: 0.94, fx: 0.5, fy: 0.29 },
  },
  web: {
    fitX: 2.3,
    fitY: 1.8,
    wide: { v: 0.9, h: 0.56, fx: 0.71, fy: 0.5 },
    stacked: { v: 0.5, h: 0.86, fx: 0.5, fy: 0.29 },
  },
  finale: {
    fitX: 3.1,
    fitY: 1.9,
    wide: { v: 0.62, h: 0.9, fx: 0.5, fy: 0.36 },
    stacked: { v: 0.44, h: 0.96, fx: 0.5, fy: 0.3 },
  },
};

function fallbackTexture(color) {
  const { canvas, ctx } = makeCanvas(64, 64);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 64, 64);
  return toTexture(canvas);
}

function palette(base, a, b) {
  return { base: new THREE.Color(base), a: new THREE.Color(a), b: new THREE.Color(b) };
}

export function createHomeExperience(options) {
  const controller = {
    disposed: false,
    experience: null,
    highlight: -1,
    setWebHover(index) {
      controller.highlight = index;
      if (controller.experience) controller.experience.setWebHover(index);
    },
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
      else {
        controller.experience = experience;
        experience.setWebHover(controller.highlight);
      }
    })
    .catch(error => {
      if (options.onError) options.onError(error);
    });
  return controller;
}

async function build(options, controller) {
  const {
    canvas,
    root,
    apps,
    webProjects,
    reelUrl,
    onProgress = () => {},
    onReady = () => {},
    onNavigate,
    onSelectApp,
  } = options;

  const engine = new Engine({ canvas, fov: FOV });
  const { scene, camera, renderer } = engine;
  // Nothing to draw until the scene is assembled and compiled.
  engine.setRunning(false);
  const alive = () => !controller.disposed;
  const abort = () => {
    engine.dispose();
    return null;
  };

  // ---------------------------------------------------------------- assets
  onProgress(0.05);
  await ensureFonts();
  if (!alive()) return abort();

  const manager = new THREE.LoadingManager();
  manager.onProgress = (url, loaded, total) => onProgress(0.08 + (loaded / total) * 0.8);
  const loader = new THREE.TextureLoader(manager);
  const load = url =>
    new Promise(resolve => {
      loader.load(
        url,
        texture => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = engine.maxAnisotropy;
          resolve(texture);
        },
        undefined,
        () => resolve(null),
      );
    });
  const [icons, reel, previews] = await Promise.all([
    Promise.all(apps.map(app => load(app.icon))),
    load(reelUrl),
    Promise.all(webProjects.map(project => load(project.image))),
  ]);
  if (!alive()) return abort();

  // ---------------------------------------------------------------- stations
  const stationKinds = ['hero', ...apps.map(() => 'app'), 'web', 'finale'];
  const palettes = [
    palette('#07080d', '#f4c15d', '#3a7cf2'),
    ...apps.map(app => palette(app.colors.bg, app.colors.a, app.colors.b)),
    palette('#07090c', '#f4c15d', '#2ec4b6'),
    palette('#0b0806', '#f4a93b', '#ff8a3d'),
  ];
  const stations = stationKinds.map((kind, index) => {
    const [x, y] = OFFSETS[index % OFFSETS.length];
    return {
      kind,
      index,
      framing: kind === 'web' && webProjects.length > 4 ? { ...FRAMING.web, fitX: 2.6 } : FRAMING[kind],
      position: new THREE.Vector3(x, y, -index * GAP),
      palette: palettes[index],
      distance: 9,
    };
  });
  const lastStation = stations.length - 1;

  // ---------------------------------------------------------------- lights
  scene.add(new THREE.HemisphereLight('#c9d6ff', '#1a1020', 0.5));
  const key = new THREE.DirectionalLight('#ffffff', 1.5);
  key.position.set(4, 6, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#9fb8ff', 0.9);
  rim.position.set(-6, 2, -5);
  scene.add(rim);

  // ---------------------------------------------------------------- atmosphere
  const backdrop = new Backdrop();
  scene.add(backdrop.mesh);
  const dust = new Dust({
    count: Math.round(2600 * engine.preset.particles),
    zStart: 30,
    zEnd: -lastStation * GAP - 40,
  });
  scene.add(dust.points);

  const currentPoints = [new THREE.Vector3(2.5, -2.5, 16)];
  stations.forEach((station, index) => {
    const side = index % 2 === 0 ? 1 : -1;
    if (index === lastStation) {
      // Pour into the finale core from below and behind it.
      currentPoints.push(station.position.clone().add(new THREE.Vector3(2.2, -2, -7)));
      currentPoints.push(station.position.clone().add(new THREE.Vector3(0.6, -0.5, -1.5)));
      currentPoints.push(station.position.clone());
      return;
    }
    currentPoints.push(station.position.clone().add(new THREE.Vector3(1.8 * side, -1.9, -4.5)));
    currentPoints.push(station.position.clone().add(new THREE.Vector3(-0.8 * side, -2.3, -GAP / 2)));
  });
  const currentCurve = new THREE.CatmullRomCurve3(currentPoints, false, 'centripetal');
  const mixColor = new THREE.Color();
  const current = new Current({
    curve: currentCurve,
    count: Math.round(15000 * engine.preset.particles),
    colorAt: (point, target) => {
      const f = clamp(-point.z / GAP, 0, lastStation);
      const i0 = Math.floor(f);
      const i1 = Math.min(i0 + 1, lastStation);
      const t = smoothstep(0.2, 0.8, f - i0);
      const from = palettes[i0];
      const to = palettes[i1];
      target.copy(from.a).lerp(from.b, 0.35);
      mixColor.copy(to.a).lerp(to.b, 0.35);
      return target.lerp(mixColor, t).multiplyScalar(0.95);
    },
  });
  scene.add(current.group);

  // ---------------------------------------------------------------- phone + icons
  const phone = new Phone({
    apps,
    icons: icons.map(texture => (texture ? texture.image : null)),
    anisotropy: engine.maxAnisotropy,
  });
  phone.group.position.copy(stations[0].position);
  scene.add(phone.group);

  const slabGeometry = createSlabGeometry({ size: SLAB_SIZE });
  const slabTextures = apps.map((app, index) => ({
    front: icons[index] || fallbackTexture(app.colors.a),
    back: createSlabBackTexture(app),
  }));
  const slabs = apps.map(
    (app, index) =>
      new IconSlab({
        geometry: slabGeometry,
        texture: slabTextures[index].front,
        backTexture: slabTextures[index].back,
        colors: app.colors,
      }),
  );
  slabs.forEach(slab => scene.add(slab.group));

  // ---------------------------------------------------------------- worlds
  const appWorlds = apps.map((app, index) => {
    const Type = WORLD_TYPES[app.slug];
    const world = new Type({
      app,
      textures: { reel: reel || fallbackTexture(app.colors.a) },
      quality: engine.preset.particles,
    });
    world.station = index + 1;
    world.attachSlab(slabs[index]);
    scene.add(world.group);
    return world;
  });
  const images = {};
  webProjects.forEach((project, index) => {
    images[project.slug] = previews[index] ? previews[index].image : null;
  });
  const web = new WebWorld({ projects: webProjects, images, anisotropy: engine.maxAnisotropy });
  web.station = apps.length + 1;
  scene.add(web.group);
  const finale = new FinaleWorld({ apps, slabGeometry, slabTextures, onNavigate });
  finale.station = apps.length + 2;
  scene.add(finale.group);
  const worlds = [...appWorlds, web, finale];
  worlds.forEach(world => world.group.position.copy(stations[world.station].position));

  // ---------------------------------------------------------------- camera rig
  const journey = new Journey(root);
  const interaction = new Interaction({ canvas, camera });
  let layout = 'wide';
  let cameraPath = null;
  let lookPath = null;
  const rebuildPaths = () => {
    const aspect = engine.width / engine.height;
    layout = aspect < 0.95 || engine.width < 760 ? 'stacked' : 'wide';
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    const cameraPoints = [];
    const lookPoints = [];
    stations.forEach(station => {
      const framing = station.framing;
      const frame = framing[layout];
      station.distance = Math.max(framing.fitY / (tanHalf * frame.v), framing.fitX / (tanHalf * aspect * frame.h));
      cameraPoints.push(station.position.clone().add(new THREE.Vector3(0, 0, station.distance)));
      lookPoints.push(station.position.clone());
    });
    cameraPath = new THREE.CatmullRomCurve3(cameraPoints, false, 'centripetal');
    lookPath = new THREE.CatmullRomCurve3(lookPoints, false, 'centripetal');
  };
  engine.onResize(() => rebuildPaths());
  const onWindowResize = () => journey.measure();
  window.addEventListener('resize', onWindowResize);

  // ---------------------------------------------------------------- interaction targets
  let phoneSpin = 0;
  let phoneSpinVelocity = 0;
  const heroTargets = [
    ...slabs.map((slab, index) => ({
      object: slab.mesh,
      label: 'Open',
      color: apps[index].colors.a,
      onHover: active => {
        slab.hoverTarget = active ? 1 : 0;
      },
      onClick: () => onSelectApp && onSelectApp(index),
    })),
    {
      object: phone.body,
      label: 'Spin',
      color: '#f4c15d',
      onDrag: dx => {
        phoneSpin += dx * 0.01;
        phoneSpinVelocity = dx * 0.6;
      },
      onClick: () => {
        phoneSpinVelocity += 7;
      },
    },
  ];
  const slabTarget = (slab, app) => ({
    object: slab.mesh,
    label: 'Spin',
    color: app.colors.a,
    onPress: () => {
      slab.dragging = true;
    },
    onRelease: () => {
      slab.dragging = false;
    },
    onDrag: dx => slab.drag(dx),
    onClick: () => slab.push(11),
    onHover: active => {
      slab.hoverTarget = active ? 1 : 0;
    },
  });
  const targetsFor = station => {
    if (station === 0) return heroTargets;
    const world = worlds.find(item => item.station === station);
    if (!world) return [];
    const list = [...world.targets];
    if (world.slab) list.unshift(slabTarget(world.slab, world.app));
    return list;
  };

  // ---------------------------------------------------------------- frame loop
  let progress = journey.stationAt(window.scrollY);
  let activeStation = null;
  let fov = FOV;
  const cameraPosition = new THREE.Vector3();
  const lookPosition = new THREE.Vector3();
  const startPosition = new THREE.Vector3();
  const endPosition = new THREE.Vector3();
  const control1 = new THREE.Vector3();
  const control2 = new THREE.Vector3();
  const startQuaternion = new THREE.Quaternion();
  const endQuaternion = new THREE.Quaternion();
  const flightQuaternion = new THREE.Quaternion();
  const spinQuaternion = new THREE.Quaternion();
  const Y = new THREE.Vector3(0, 1, 0);
  const WIND_UP = new THREE.Vector3(0, 0.4, 1.2);
  const APPROACH = new THREE.Vector3(0, 2.2, 7);
  const formation = new THREE.Vector3();
  const formationLocal = new THREE.Vector3();
  const bezier = new THREE.CubicBezierCurve3(startPosition, control1, control2, endPosition);
  let lastScroll = window.scrollY;
  let velocity = 0;

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

  engine.onFrame((time, delta) => {
    const scrollY = window.scrollY;
    velocity = damp(velocity, (scrollY - lastScroll) / Math.max(delta, 1 / 240), 6, delta);
    lastScroll = scrollY;
    const speed = Math.min(Math.abs(velocity) / 2600, 1);

    const target = journey.stationAt(scrollY);
    progress = damp(progress, target, 5, delta);
    if (Math.abs(progress - target) < 1e-4) progress = target;
    const p = progress;
    const u = clamp(p / lastStation);

    // Camera
    cameraPath.getPoint(u, cameraPosition);
    lookPath.getPoint(u, lookPosition);
    const i0 = Math.min(Math.floor(p), lastStation);
    const i1 = Math.min(i0 + 1, lastStation);
    const blend = easeInOutCubic(clamp(p - i0));
    const distance = THREE.MathUtils.lerp(stations[i0].distance, stations[i1].distance, blend);
    const parallax = (distance / 9) * engine.motion;
    cameraPosition.x += interaction.screen.x * 0.22 * parallax;
    cameraPosition.y += interaction.screen.y * 0.14 * parallax;
    camera.position.copy(cameraPosition);
    camera.lookAt(lookPosition);

    const frameA = stations[i0].framing[layout];
    const frameB = stations[i1].framing[layout];
    const fx = THREE.MathUtils.lerp(frameA.fx, frameB.fx, blend);
    const fy = THREE.MathUtils.lerp(frameA.fy, frameB.fy, blend);
    fov = damp(fov, FOV + speed * 7 * engine.motion, 5, delta);
    camera.fov = fov;
    camera.setViewOffset(
      engine.width,
      engine.height,
      (0.5 - fx) * engine.width,
      (0.5 - fy) * engine.height,
      engine.width,
      engine.height,
    );
    engine.finalPass.uniforms.uAberration.value = 0.004 + speed * 0.02 * engine.motion;

    // Palette
    const paletteBlend = smoothstep(0.2, 0.8, p - i0);
    const from = stations[i0].palette;
    const to = stations[i1].palette;
    backdrop.uniforms.uBase.value.copy(from.base).lerp(to.base, paletteBlend);
    backdrop.uniforms.uGlowA.value.copy(from.a).lerp(to.a, paletteBlend);
    backdrop.uniforms.uGlowB.value.copy(from.b).lerp(to.b, paletteBlend);

    backdrop.update(camera, time);
    dust.update(time, engine.dpr);
    current.update(time, engine.dpr, lookPosition.z);
    current.uniforms.uFlow.value = 1 + speed * 5 + smoothstep(lastStation - 0.6, lastStation, p) * 1.5;
    current.uniforms.uBoost.value = smoothstep(lastStation - 0.5, lastStation, p) * 0.4;

    frameState.time = time;
    frameState.delta = delta;
    frameState.motion = engine.motion;
    frameState.pixelRatio = engine.dpr;

    // Hero phone: floats, follows the pointer, then tips away as the camera
    // dives past it.
    const leave = smoothstep(0.04, 0.7, p);
    phone.group.visible = p < 1.2;
    phoneSpinVelocity = damp(phoneSpinVelocity, 0, 1.6, delta);
    phoneSpin += phoneSpinVelocity * delta;
    if (Math.abs(phoneSpinVelocity) < 0.8)
      phoneSpin = damp(phoneSpin, Math.round(phoneSpin / (Math.PI * 2)) * Math.PI * 2, 2.5, delta);
    const heroStation = stations[0].position;
    phone.group.position.set(
      heroStation.x,
      heroStation.y + Math.sin(time * 0.9) * 0.04 * engine.motion - leave * 3.2,
      heroStation.z - leave * 2,
    );
    phone.group.rotation.set(
      -0.06 - interaction.screen.y * 0.14 * engine.motion - leave * 1.2,
      -0.3 + interaction.screen.x * 0.28 * engine.motion + phoneSpin + leave * 0.5,
      0.03 - leave * 0.25,
    );
    phone.group.updateMatrixWorld(true);

    // Worlds: grow in from the dark as the camera approaches, then shrink
    // away once it moves on.
    worlds.forEach(world => {
      const local = p - world.station;
      const visible = local > -0.9 && local < 1;
      world.group.visible = visible;
      const enter = smoothstep(-0.9, -0.12, local);
      const exit = 1 - smoothstep(0.3, 0.95, local);
      world.group.scale.setScalar(Math.max(0.001, (0.35 + 0.65 * enter) * (0.45 + 0.55 * exit)));
      world.group.position.copy(stations[world.station].position);
      world.group.position.y += (1 - enter) * -1.4 + (1 - exit) * 1.1;
      world.group.updateMatrixWorld(true);
      if (!visible) return;
      frameState.local = local;
      frameState.hold = journey.holdProgress(world.station, scrollY);
      world.update(frameState);
    });

    // Icons: while the hero is pinned they lift off the home screen into an
    // exploded grid in front of the phone, then zoom off one after another
    // down the current to their own worlds. The camera follows afterwards.
    const heroHold = journey.holdProgress(0, scrollY);
    const hurry = smoothstep(0, 0.25, p);
    slabs.forEach((slab, index) => {
      const world = appWorlds[index];
      const lift = Math.max(smoothstep(0.03 + index * 0.03, 0.3 + index * 0.03, heroHold), hurry);
      const t = Math.max(easeInOutCubic(clamp((heroHold - (0.48 + index * 0.055)) / 0.36)), hurry);
      const slotScale = phone.slotPose(index, startPosition, startQuaternion);
      formationLocal.copy(phone.slotPositions[index]);
      const spread = layout === 'stacked' ? 1.55 : 2.15;
      formationLocal.x *= spread;
      formationLocal.y = formationLocal.y * (spread - 0.35) - 0.32;
      formationLocal.z += 0.95;
      formation.copy(formationLocal).applyMatrix4(phone.body.matrixWorld);
      const formationScale = slotScale * 1.75;
      endPosition.copy(world.slabAnchor.position).applyMatrix4(world.group.matrixWorld);
      const endScale = world.slabAnchor.scale * world.group.scale.x;

      let tiltX = 0;
      let tiltY = 0;
      let idle = 0;
      if (t <= 0) {
        slab.group.visible = phone.group.visible;
        slab.group.position.lerpVectors(startPosition, formation, easeInOutCubic(lift));
        slab.group.quaternion.copy(startQuaternion);
        slab.group.scale.setScalar(THREE.MathUtils.lerp(slotScale, formationScale, easeInOutCubic(lift)));
        idle = lift;
        tiltX = interaction.screen.x * 0.3 * lift * engine.motion;
        tiltY = -interaction.screen.y * 0.2 * lift * engine.motion;
      } else if (t < 1) {
        slab.group.visible = true;
        startPosition.copy(formation);
        control1.copy(formation).add(WIND_UP);
        control2.copy(endPosition).add(APPROACH);
        bezier.getPoint(t, slab.group.position);
        endQuaternion.identity();
        flightQuaternion.slerpQuaternions(startQuaternion, endQuaternion, smoothstep(0, 0.6, t));
        spinQuaternion.setFromAxisAngle(Y, Math.sin(t * Math.PI) * Math.PI);
        slab.group.quaternion.copy(flightQuaternion).multiply(spinQuaternion);
        slab.group.scale.setScalar(THREE.MathUtils.lerp(formationScale, endScale, smoothstep(0, 0.7, t)));
      } else {
        // Parked at its world; visible as a distant speck for the next couple
        // of stations so the camera can "follow" it in.
        slab.group.visible = p - world.station > -2.2 && p - world.station < 1;
        slab.group.position.copy(endPosition);
        slab.group.quaternion.identity();
        slab.group.scale.setScalar(endScale);
        const near = 1 - smoothstep(0.2, 0.6, Math.abs(p - world.station));
        tiltX = interaction.screen.x * 0.4 * near * engine.motion;
        tiltY = -interaction.screen.y * 0.28 * near * engine.motion;
        idle = 1;
      }
      slab.update(delta, { tiltX, tiltY, idle, time: time + index, motion: engine.motion });
    });

    // Pointer targets follow whichever station the camera is parked at.
    const nearest = Math.round(p);
    const station = Math.abs(p - nearest) < 0.34 ? nearest : null;
    if (station !== activeStation) {
      activeStation = station;
      interaction.setTargets(station === null ? [] : targetsFor(station));
    }
    interaction.update();
  });

  // ---------------------------------------------------------------- warm up
  // Compile every material up front so no world stutters on first sight.
  worlds.forEach(world => {
    world.group.visible = true;
  });
  onProgress(0.9);
  try {
    if (renderer.compileAsync) await renderer.compileAsync(scene, camera);
    else renderer.compile(scene, camera);
  } catch (error) {
    // Compilation errors surface on first render instead.
  }
  if (!alive()) return abort();
  journey.measure();
  engine.setRunning(true);
  onProgress(1);
  onReady();

  return {
    setWebHover(index) {
      web.setHighlight(index);
    },
    dispose() {
      window.removeEventListener('resize', onWindowResize);
      interaction.dispose();
      journey.dispose();
      engine.dispose();
      resetSharedMaterials();
    },
  };
}
