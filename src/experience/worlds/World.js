import * as THREE from 'three';

// Base class for a station in the journey. The home scene positions the
// group, fades it in and out with scroll, and feeds update() a state object:
// { time, delta, local, hold, camera, interaction, motion, quality }
// where local = currentStation - thisStation (0 when the camera has arrived).
export class World {
  constructor({ app = null } = {}) {
    this.app = app;
    this.group = new THREE.Group();
    this.targets = [];
    // Where this world's icon slab rests, in the group's local space.
    this.slabAnchor = { position: new THREE.Vector3(0, 0, 0), scale: 1 };
    this.slab = null;
    this.raycaster = new THREE.Raycaster();
    this.plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  }

  attachSlab(slab) {
    this.slab = slab;
  }

  // Projects the pointer onto a plane parallel to the screen at the given
  // local depth, returning the point in the group's local space.
  pointerOnPlane(state, localZ, target) {
    const { camera, interaction } = state;
    this.group.updateWorldMatrix(true, false);
    const origin = new THREE.Vector3(0, 0, localZ).applyMatrix4(this.group.matrixWorld);
    this.plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), origin);
    this.raycaster.setFromCamera(interaction.ndc, camera);
    if (!this.raycaster.ray.intersectPlane(this.plane, target)) return null;
    return this.group.worldToLocal(target);
  }

  update() {}

  dispose() {}
}
