export class CameraController {
  constructor(THREE, camera, target, renderer, options = {}) {
    this.THREE = THREE;
    this.camera = camera;
    this.target = target;
    this.renderer = renderer;
    this.mode = options.mode || 'explore';
    this.yaw = Number.isFinite(options.yaw) ? options.yaw : Math.PI * .25;
    this.zoom = Number.isFinite(options.zoom) ? options.zoom : 1;
    this.pitch = .92;
    this.pointer = null;
    this.pinch = null;
    this.lastTarget = new THREE.Vector3();
    this.onChange = options.onChange || (() => {});
    this.bind();
  }

  bind() {
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', e => {
      if (e.clientX < innerWidth * .38 && matchMedia('(pointer:coarse)').matches) return;
      this.pointer = { id: e.pointerId, x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
    });
    el.addEventListener('pointermove', e => {
      if (!this.pointer || this.pointer.id !== e.pointerId) return;
      const dx = e.clientX - this.pointer.x;
      const dy = e.clientY - this.pointer.y;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.yaw -= dx * .006;
      if (this.mode === 'follow') this.pitch = this.THREE.MathUtils.clamp(this.pitch + dy * .003, .35, 1.15);
      this.onChange(this.snapshot());
    });
    const clear = e => { if (!e || !this.pointer || e.pointerId === this.pointer.id) this.pointer = null; };
    el.addEventListener('pointerup', clear);
    el.addEventListener('pointercancel', clear);
    el.addEventListener('wheel', e => {
      e.preventDefault();
      this.zoom = this.THREE.MathUtils.clamp(this.zoom + (e.deltaY > 0 ? -.08 : .08), .68, 1.5);
      this.onChange(this.snapshot());
    }, { passive: false });
    el.addEventListener('touchstart', e => {
      if (e.touches.length === 2) this.pinch = this.distance(e.touches[0], e.touches[1]);
    }, { passive: true });
    el.addEventListener('touchmove', e => {
      if (e.touches.length !== 2 || !this.pinch) return;
      const next = this.distance(e.touches[0], e.touches[1]);
      this.zoom = this.THREE.MathUtils.clamp(this.zoom + (next - this.pinch) * .0035, .68, 1.5);
      this.pinch = next;
      this.onChange(this.snapshot());
    }, { passive: true });
    el.addEventListener('touchend', () => { this.pinch = null; }, { passive: true });
  }

  distance(a, b) { return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY); }

  setMode(mode) {
    const modes = ['follow', 'explore', 'overview'];
    this.mode = modes.includes(mode) ? mode : 'explore';
    this.onChange(this.snapshot());
  }

  cycleMode() {
    const modes = ['follow', 'explore', 'overview'];
    this.setMode(modes[(modes.indexOf(this.mode) + 1) % modes.length]);
    return this.mode;
  }

  snapshot() { return { mode: this.mode, yaw: this.yaw, zoom: this.zoom, pitch: this.pitch }; }

  update(delta) {
    const THREE = this.THREE;
    const t = this.target.position.clone().add(new THREE.Vector3(0, 1.35, 0));
    this.lastTarget.lerp(t, 1 - Math.exp(-delta * 7));
    let distance, height;
    if (this.mode === 'follow') {
      distance = 7.4 / this.zoom;
      height = 3.5 + this.pitch * 2.2;
    } else if (this.mode === 'overview') {
      distance = 23 / this.zoom;
      height = 25 / this.zoom;
    } else {
      distance = 14.2 / this.zoom;
      height = 18.2 / this.zoom;
    }
    const offset = new THREE.Vector3(Math.sin(this.yaw) * distance, height, Math.cos(this.yaw) * distance);
    const desired = this.lastTarget.clone().add(offset);
    this.camera.position.lerp(desired, 1 - Math.exp(-delta * (this.mode === 'follow' ? 8 : 5)));
    this.camera.lookAt(this.lastTarget);
  }
}
