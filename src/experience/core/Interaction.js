import * as THREE from 'three';
import { cursorStore } from '../../site/ticker';

// Pointer handling for the canvas. The DOM sits on top of the canvas with
// pointer-events disabled on empty areas, so the canvas receives events
// wherever there is no text or link. Targets are registered by the active
// scene parts: { object, label, color, onClick, onDrag, onHover }.
export class Interaction {
  constructor({ canvas, camera }) {
    this.canvas = canvas;
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.ndc = new THREE.Vector2(0, 0);
    this.screen = new THREE.Vector2(0, 0); // -1..1 anywhere on the page, for parallax
    this.overCanvas = false;
    this.moved = true;
    this.targets = [];
    this.hovered = null;
    this.hit = null;
    this.drag = null;
    this.pointerType = 'mouse';

    this.onMove = this.onMove.bind(this);
    this.onDown = this.onDown.bind(this);
    this.onUp = this.onUp.bind(this);
    this.onLeave = this.onLeave.bind(this);
    window.addEventListener('pointermove', this.onMove, { passive: true });
    window.addEventListener('pointerdown', this.onDown, { passive: true });
    window.addEventListener('pointerup', this.onUp, { passive: true });
    window.addEventListener('pointercancel', this.onUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', this.onLeave);
  }

  setTargets(targets) {
    this.targets = targets;
    this.moved = true;
  }

  updatePosition(event) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.ndc.set((event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1);
    this.screen.copy(this.ndc);
    this.pointerType = event.pointerType || 'mouse';
    this.overCanvas = event.target === this.canvas;
    this.moved = true;
  }

  onMove(event) {
    this.updatePosition(event);
    if (this.drag && this.drag.target.onDrag) {
      const dx = event.clientX - this.drag.lastX;
      const dy = event.clientY - this.drag.lastY;
      this.drag.lastX = event.clientX;
      this.drag.lastY = event.clientY;
      this.drag.distance += Math.abs(dx) + Math.abs(dy);
      this.drag.target.onDrag(dx, dy, this.drag.hit);
    }
  }

  onDown(event) {
    this.updatePosition(event);
    if (!this.overCanvas) return;
    this.pick();
    if (!this.hovered) return;
    this.drag = {
      target: this.hovered,
      hit: this.hit,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      distance: 0,
      time: performance.now(),
    };
    if (this.hovered.onPress) this.hovered.onPress(this.hit);
  }

  onUp(event) {
    const drag = this.drag;
    this.drag = null;
    if (!drag || event.type === 'pointercancel') return;
    const quick = performance.now() - drag.time < 600;
    if (drag.distance < 8 && quick && drag.target.onClick) drag.target.onClick(drag.hit);
    if (drag.target.onRelease) drag.target.onRelease();
    if (this.pointerType !== 'mouse') this.clearHover();
  }

  onLeave() {
    this.overCanvas = false;
    this.clearHover();
  }

  pick() {
    this.hit = null;
    if (!this.targets.length) return this.setHovered(null);
    this.raycaster.setFromCamera(this.ndc, this.camera);
    let best = null;
    for (let i = 0; i < this.targets.length; i += 1) {
      const target = this.targets[i];
      if (target.enabled === false) continue;
      const object = target.proxy || target.object;
      if (!object || !object.visible) continue;
      const hits = this.raycaster.intersectObject(object, true);
      if (hits.length && (!best || hits[0].distance < best.hit.distance)) best = { target, hit: hits[0] };
    }
    this.hit = best ? best.hit : null;
    return this.setHovered(best ? best.target : null);
  }

  setHovered(target) {
    if (target === this.hovered) {
      if (target && target.onHover) target.onHover(true, this.hit);
      return target;
    }
    if (this.hovered && this.hovered.onHover) this.hovered.onHover(false, null);
    this.hovered = target;
    if (target && target.onHover) target.onHover(true, this.hit);
    cursorStore.set(
      target
        ? { active: true, label: target.label || '', color: target.color || '' }
        : { active: false, label: '', color: '' },
    );
    return target;
  }

  clearHover() {
    this.setHovered(null);
  }

  // Called every frame: re-pick while the pointer is over the canvas because
  // the camera keeps moving with scroll even when the mouse is still.
  update() {
    if (this.drag) return;
    if (!this.overCanvas || this.pointerType !== 'mouse') {
      if (this.hovered) this.clearHover();
      return;
    }
    this.pick();
    this.moved = false;
  }

  dispose() {
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onUp);
    document.documentElement.removeEventListener('mouseleave', this.onLeave);
    cursorStore.set({ active: false, label: '', color: '' });
  }
}
