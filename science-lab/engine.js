// 3D 무대 + 비트 플레이어.
// 자막이 원본이다: 화면 캡션·대본·음성이 전부 같은 문자열을 쓴다.
// 비트는 시간(dur) 또는 학습자의 조작으로 넘어가고, 음성이 끝나기를 기다리지 않는다.
import * as THREE from '../world-explorer/vendor/three.module.js';
import { PALETTE, ease } from './scenes/_kit.js';

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export class Stage {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene(); this.scene.background = new THREE.Color(PALETTE.paper);
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.root = new THREE.Group(); this.scene.add(this.root);
    this.orbit = { theta: 0.55, phi: 1.12, dist: 9, target: new THREE.Vector3(0, 0.8, 0), home: null };
    this._setupLights(); this._setupGround(); this._setupInput();
    this.clock = new THREE.Clock(); this.update = null; this.running = true;
    this._resize(); addEventListener('resize', () => this._resize());
    this._loop = this._loop.bind(this); requestAnimationFrame(this._loop);
  }
  _setupLights() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0xcbbfa9, 0.9); this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 8, 5); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); const s = 7; Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 30 });
    key.shadow.bias = -0.0005; this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xdfe9ff, 0.5); fill.position.set(-5, 3, -4); this.scene.add(fill);
  }
  _setupGround() {
    const g = new THREE.Mesh(new THREE.CircleGeometry(9, 64), new THREE.MeshStandardMaterial({ color: PALETTE.board, roughness: 0.95 }));
    g.rotation.x = -Math.PI / 2; g.receiveShadow = true; this.scene.add(g);
    const grid = new THREE.GridHelper(12, 24, 0xd6ccb8, 0xe3dbcb); grid.position.y = 0.002; grid.material.transparent = true; grid.material.opacity = 0.55; this.scene.add(grid);
  }
  _setupInput() {
    const c = this.canvas; let drag = null, pinch = null;
    const down = (x, y) => { drag = { x, y, th: this.orbit.theta, ph: this.orbit.phi }; };
    const move = (x, y) => { if (!drag) return; const dx = (x - drag.x) / c.clientWidth, dy = (y - drag.y) / c.clientHeight; this.orbit.theta = drag.th - dx * 3.2; this.orbit.phi = Math.max(0.35, Math.min(1.5, drag.ph - dy * 2.4)); };
    c.addEventListener('pointerdown', (e) => { if (e.isPrimary) { down(e.clientX, e.clientY); c.setPointerCapture(e.pointerId); } });
    c.addEventListener('pointermove', (e) => { if (e.isPrimary) move(e.clientX, e.clientY); });
    c.addEventListener('pointerup', () => { drag = null; }); c.addEventListener('pointercancel', () => { drag = null; });
    c.addEventListener('wheel', (e) => { e.preventDefault(); this.orbit.dist = Math.max(3, Math.min(20, this.orbit.dist * (1 + Math.sign(e.deltaY) * 0.08))); }, { passive: false });
    c.addEventListener('touchstart', (e) => { if (e.touches.length === 2) pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
    c.addEventListener('touchmove', (e) => { if (e.touches.length === 2 && pinch) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); this.orbit.dist = Math.max(3, Math.min(20, this.orbit.dist * pinch / d)); pinch = d; } }, { passive: true });
    c.addEventListener('touchend', () => { pinch = null; });
  }
  _resize() {
    const w = this.canvas.clientWidth || 640, h = this.canvas.clientHeight || 400;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
  }
  setView(view) {
    if (!view) return; const o = this.orbit;
    if (view.theta != null) o.theta = view.theta; if (view.phi != null) o.phi = view.phi; if (view.dist != null) o.dist = view.dist;
    if (view.target) o.target.set(...view.target);
    o.home = { theta: o.theta, phi: o.phi, dist: o.dist, target: o.target.clone() };
  }
  resetView() { const h = this.orbit.home; if (h) { this.orbit.theta = h.theta; this.orbit.phi = h.phi; this.orbit.dist = h.dist; this.orbit.target.copy(h.target); } }
  clear() { while (this.root.children.length) { const c = this.root.children.pop(); c.traverse((n) => { if (n.geometry) n.geometry.dispose(); }); } this.update = null; }
  _loop() {
    if (!this.running) return; requestAnimationFrame(this._loop);
    const raw = this.clock.getDelta(), dt = Math.min(0.25, raw), t = this.clock.elapsedTime; const o = this.orbit;
    const x = o.target.x + o.dist * Math.sin(o.phi) * Math.sin(o.theta), y = o.target.y + o.dist * Math.cos(o.phi), z = o.target.z + o.dist * Math.sin(o.phi) * Math.cos(o.theta);
    this.camera.position.set(x, y, z); this.camera.lookAt(o.target);
    if (this.update) this.update(dt, t, raw);
    if (this.canvas.width !== Math.floor(this.canvas.clientWidth * this.renderer.getPixelRatio())) this._resize();
    this.renderer.render(this.scene, this.camera);
  }
  dispose() { this.running = false; this.clear(); this.renderer.dispose(); }
}

// 장면 모듈 규약:
//   { view:{theta,phi,dist,target}, build(kit, world) → {update?}, beats:[{text, show?, hide?, dur?, anim?(p, o, t)}] }
//   world.add(id, obj) 로 등록한 객체는 처음엔 보이지 않고, 비트의 show에 오르면 나타난다.
export class Player {
  constructor(stage, ui) {
    this.stage = stage; this.ui = ui; this.objects = new Map(); this.beats = []; this.index = -1;
    this.playing = false; this.speed = 1; this.voice = false; this.p = 0; this.elapsed = 0; this.hold = 0; this.done = false;
    this.onChange = () => {};
  }
  async load(mod) {
    this.stop(); this.stage.clear(); this.objects.clear(); this.index = -1; this.done = false;
    const world = { group: this.stage.root, add: (id, obj) => { obj.visible = false; obj.userData.id = id; this.objects.set(id, obj); this.stage.root.add(obj); return obj; }, get: (id) => this.objects.get(id) };
    const kit = await import('./scenes/_kit.js');
    const built = mod.build(kit, world) || {};
    this.sceneUpdate = built.update || null; this.beats = mod.beats; this.stage.setView(mod.view);
    this.stage.update = (dt, t, raw) => this._tick(dt, t, raw);
    this.goto(0, false);
  }
  _o() { const o = {}; for (const [k, v] of this.objects) o[k] = v; return o; }
  _applyFinal(i) { const b = this.beats[i]; if (!b) return; (b.show || []).forEach((id) => { const o = this.objects.get(id); if (o) o.visible = true; }); (b.hide || []).forEach((id) => { const o = this.objects.get(id); if (o) o.visible = false; }); if (b.anim) b.anim(1, this._o(), 0); }
  goto(i, autoplay = this.playing) {
    if (i < 0 || i >= this.beats.length) return;
    // 처음 상태로 되돌린 뒤 i 이전 비트를 최종 상태로 적용한다 — 되감기가 "그때 그 화면"이 되도록.
    for (const o of this.objects.values()) o.visible = false;
    if (this.beats[0]?.reset) this.beats[0].reset(this._o());
    for (let k = 0; k < i; k++) this._applyFinal(k);
    this.index = i; this.p = 0; this.elapsed = 0; this.hold = 0; this.done = false;
    const b = this.beats[i]; (b.show || []).forEach((id) => { const o = this.objects.get(id); if (o) o.visible = true; }); (b.hide || []).forEach((id) => { const o = this.objects.get(id); if (o) o.visible = false; });
    if (b.view) { const o = this.stage.orbit; if (b.view.theta != null) o.theta = b.view.theta; if (b.view.phi != null) o.phi = b.view.phi; if (b.view.dist != null) o.dist = b.view.dist; if (b.view.target) o.target.set(...b.view.target); }
    if (REDUCED) { this.p = 1; if (b.anim) b.anim(1, this._o(), 0); }
    this.playing = autoplay; this._speak(b.text); this.onChange();
  }
  _tick(dt, t, raw = dt) {
    // 비트 진행은 실제 경과 시간(raw)으로 — 느린 기기에서 프레임이 끊겨도 자막 타이밍은 벽시계를 따른다.
    const b = this.beats[this.index]; if (!b) return;
    if (this.sceneUpdate) this.sceneUpdate(dt, t);
    const dur = (b.dur ?? 4) / this.speed;
    if (this.playing && !REDUCED && this.p < 1) { this.elapsed += raw; this.p = Math.min(1, this.elapsed / dur); }
    if (b.anim) b.anim(REDUCED ? 1 : ease.io(this.p), this._o(), t);
    if (this.playing && this.p >= 1) {
      this.hold += raw; const wait = REDUCED ? Math.max(2.5, (b.dur ?? 4) * 0.8) / this.speed : 1.1 / this.speed;
      if (this.hold >= wait) { if (this.index + 1 < this.beats.length) this.goto(this.index + 1, true); else { this.playing = false; this.done = true; this.onChange(); } }
    }
  }
  play() { if (this.done || (this.index === this.beats.length - 1 && this.p >= 1)) { this.goto(0, true); return; } this.playing = true; if (this.p >= 1) { this.hold = 0; } this.onChange(); }
  pause() { this.playing = false; speechSynthesis?.cancel?.(); this.onChange(); }
  toggle() { this.playing ? this.pause() : this.play(); }
  next() { if (this.index + 1 < this.beats.length) this.goto(this.index + 1, this.playing); else { this.p = 1; this.done = true; this.playing = false; this.onChange(); } }
  prev() { this.goto(Math.max(0, this.index - 1), this.playing); }
  replay() { this.stage.resetView(); this.goto(0, true); }
  stop() { this.playing = false; try { speechSynthesis.cancel(); } catch (_) { /* no voice */ } }
  setSpeed(s) { this.speed = s; this.onChange(); }
  setVoice(on) { this.voice = on; if (!on) { try { speechSynthesis.cancel(); } catch (_) {} } else if (this.beats[this.index]) this._speak(this.beats[this.index].text); this.onChange(); }
  _speak(text) {
    // 2단계 음성: Web Speech(ko-KR) → 실패하면 침묵. 자막이 내용을 전부 담으므로 음성은 보조다.
    if (!this.voice || typeof speechSynthesis === 'undefined') return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'ko-KR'; u.rate = Math.min(1.4, 0.95 * this.speed); u.pitch = 1.05; speechSynthesis.speak(u); } catch (_) { /* silent */ }
  }
}
