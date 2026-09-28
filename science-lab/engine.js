// 3D 무대 + 비트 플레이어.
// 자막이 원본이다: 화면 캡션·대본·음성이 전부 같은 문자열을 쓴다.
// 비트는 시간(dur) 또는 학습자의 조작으로 넘어가고, 음성이 끝나기를 기다리지 않는다.
import * as THREE from '../world-explorer/vendor/three.module.js';
import { PALETTE, ease, fitLabels } from './scenes/_kit.js';

const REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// 화질 단계: 0 높음(DPR≤2 · 그림자 2048) → 1 보통(DPR≤1.5 · 1024) → 2 낮음(DPR 1 · 1024) → 3 최소(DPR 1 · 그림자 끔).
// 처음엔 기기 추정으로 0 또는 1에서 시작하고, 실제 프레임 시간이 길면 스스로 한 단계씩 내린다(올리지는 않는다 — 깜빡임 방지).
// 강제로 고정하려면 globalThis.SL_QUALITY 또는 <html data-q3d> 에 'high' | 'low'.
const TIERS = [{ dpr: 2, shadow: 2048, shadows: true }, { dpr: 1.5, shadow: 1024, shadows: true }, { dpr: 1, shadow: 1024, shadows: true }, { dpr: 1, shadow: 512, shadows: false }];
const forcedQuality = () => { try { return globalThis.SL_QUALITY || document.documentElement.dataset.q3d || ''; } catch { return ''; } };
let _glOK = null;

export class Stage {
  static live = new Set();   // 살아 있는 무대(책 속 팝업을 닫을 때 정리하려고)
  // WebGL이 되는지 한 번만 확인한다. 확인용 캔버스의 문맥은 바로 돌려준다(쌓이면 브라우저가 오래된 3D부터 끈다).
  static canWebGL() {
    if (_glOK != null) return _glOK;
    try {
      const c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl');
      _glOK = !!gl; gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch { _glOK = false; }
    return _glOK;
  }
  constructor(canvas) {
    this.canvas = canvas; Stage.live.add(this);
    this._cleanups = []; this._raf = 0; this._inView = true; this._pageVisible = document.visibilityState !== 'hidden';
    const lowPower = !!(matchMedia?.('(max-width: 760px)').matches || (navigator.deviceMemory && navigator.deviceMemory <= 4));
    const forced = forcedQuality();
    this.lowPower = lowPower; this._adaptive = !forced; this.tier = forced === 'high' ? 0 : forced === 'low' ? 3 : lowPower || Stage.live.size > 1 ? 1 : 0;   // 배틀처럼 두 무대가 함께 뜨면 보통 화질부터
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, TIERS[this.tier].dpr));
    // 부드러운 그림자: r184의 PCF는 보겔 원판 표본(반지름 radius)으로 가장자리를 흐린다(PCFSoft는 폐지됨).
    this.renderer.shadowMap.enabled = true; this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    // 필름 톤: Khronos PBR Neutral — 아이들 교구의 원색을 바래지 않게 두면서 밝은 반사만 부드럽게 눌러 준다.
    this.renderer.toneMapping = THREE.NeutralToneMapping; this.renderer.toneMappingExposure = 1.0;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    this.root = new THREE.Group(); this.scene.add(this.root);
    this.orbit = { theta: 0.55, phi: 1.12, dist: 9, target: new THREE.Vector3(0, 0.8, 0), home: null };
    this._perf = { n: 0, dts: [], drops: 0 };
    this._setupBackdrop(); this._setupEnv(); this._setupLights(); this._setupGround(); this._setupInput(); this._applyTier(this.tier);
    this.clock = new THREE.Timer(); this.update = null; this.running = true;   // Clock은 r184에서 폐지(콘솔 경고)
    this._resizeHandler = () => this._resize(); this._on(window, 'resize', this._resizeHandler);
    this._visibilityHandler = () => { this._pageVisible = document.visibilityState !== 'hidden'; this._updateActivity(); };
    this._on(document, 'visibilitychange', this._visibilityHandler);
    this._on(canvas, 'webglcontextlost', (e) => { e.preventDefault(); this.lost = true; canvas.dataset.contextLost = 'true'; });
    this._on(canvas, 'webglcontextrestored', () => { this.lost = false; delete canvas.dataset.contextLost; });
    if ('IntersectionObserver' in window) {
      this._observer = new IntersectionObserver(([entry]) => { this._inView = !!entry?.isIntersecting; this._updateActivity(); }, { threshold: 0.01 });
      this._observer.observe(canvas);
    }
    this._loop = this._loop.bind(this); this._resize(); this._updateActivity();
  }
  _on(target, type, handler, options) { target.addEventListener(type, handler, options); this._cleanups.push(() => target.removeEventListener(type, handler, options)); }
  // 사진 스튜디오 배경: 위는 밝고 아래로 갈수록 따뜻하게 어두워지는 휜 배경지(사이클로라마) + 가운데 은은한 조명 자국.
  // 화면에 고정된 그림이라 카메라를 돌려도 바닥 원판의 테두리 같은 "지평선"이 생기지 않는다. 띠 무늬가 안 생기게 점묘(dither)를 섞는다.
  _setupBackdrop() {
    const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d');
    const v = g.createLinearGradient(0, 0, 0, S); v.addColorStop(0, '#fbf9f4'); v.addColorStop(0.5, '#f4efe5'); v.addColorStop(0.78, '#ebe3d4'); v.addColorStop(1, '#ddd3c1');
    g.fillStyle = v; g.fillRect(0, 0, S, S);
    const r = g.createRadialGradient(S * 0.5, S * 0.42, 10, S * 0.5, S * 0.5, S * 0.72); r.addColorStop(0, 'rgba(255,255,252,0.55)'); r.addColorStop(0.55, 'rgba(255,255,250,0.12)'); r.addColorStop(1, 'rgba(120,100,70,0.10)');
    g.fillStyle = r; g.fillRect(0, 0, S, S);
    const d = g.getImageData(0, 0, S, S), px = d.data; for (let i = 0; i < px.length; i += 4) { const n = (Math.random() - 0.5) * 3; px[i] += n; px[i + 1] += n; px[i + 2] += n; } g.putImageData(d, 0, 0);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; this.scene.background = tex; this._bgTex = tex;
  }
  // 반사 환경: 코드로 만든 작은 사진 스튜디오(밝은 천장·소프트박스 넷·따뜻한 바닥)를 PMREM으로 구워 재질에 비춘다.
  // 외부 HDR 파일 없이 유리·물·금속·플라스틱에 자연스러운 반짝임과 입체감이 생긴다.
  _setupEnv() {
    try {
      const room = new THREE.Scene(), geo = new THREE.SphereGeometry(20, 32, 16), col = [];
      const pos = geo.attributes.position, top = new THREE.Color(0xffffff), mid = new THREE.Color(0xe9e4d9), low = new THREE.Color(0x857a69), c = new THREE.Color();
      for (let i = 0; i < pos.count; i++) { const y = pos.getY(i) / 20; c.copy(y > 0 ? mid.clone().lerp(top, y) : mid.clone().lerp(low, Math.min(1, -y * 1.6))); col.push(c.r, c.g, c.b); }
      geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
      room.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
      // [x, y, z, 폭, 높이, 밝기] — 밝기 1 이상이면 반사에 또렷한 창 모양 하이라이트가 맺힌다
      for (const [x, y, z, w, h, k] of [[9, 7, 7, 7, 9, 2.4], [-10, 5, 4, 4, 9, 1.4], [0, 15, 0, 9, 7, 1.0], [-3, 6, -12, 12, 5, 1.2], [6, -2, -8, 6, 2, 0.5]]) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k * 0.99, k * 0.96), side: THREE.DoubleSide }));
        p.position.set(x, y, z); p.lookAt(0, 0, 0); room.add(p);
      }
      const pm = new THREE.PMREMGenerator(this.renderer);
      this._envTex = pm.fromScene(room, 0.03).texture; this.scene.environment = this._envTex; this.scene.environmentIntensity = 0.55;
      pm.dispose(); room.traverse((o) => { o.geometry?.dispose(); o.material?.dispose(); });
    } catch { /* 환경맵이 안 되는 기기면 조명만으로 */ }
  }
  _setupLights() {
    const hemi = new THREE.HemisphereLight(0xffffff, 0xc2b49c, 0.55); this.scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff3e4, 1.85); key.position.set(-2.6, 9, 5.4); key.castShadow = true;
    const s = 7; Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 30 });
    key.shadow.bias = -0.0004; key.shadow.normalBias = 0.025; key.shadow.radius = 5; this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xdce8ff, 0.55); fill.position.set(6, 2.8, 4); this.scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.9); rim.position.set(-3, 5, -7); this.scene.add(rim);   // 윤곽을 배경에서 떼어 내는 뒤쪽 빛
    this.key = key;
  }
  _setupGround() {
    // 바닥은 보이지 않고 그림자만 받는다(그림자 받이) — 배경지 위에 물체가 놓인 제품 사진처럼.
    const catcher = new THREE.Mesh(new THREE.CircleGeometry(12, 64), new THREE.ShadowMaterial({ color: 0x3b2c1a, opacity: 0.3, depthWrite: false }));
    catcher.rotation.x = -Math.PI / 2; catcher.receiveShadow = true; catcher.renderOrder = -2; this.scene.add(catcher);
    // 닿은 그늘(contact shadow): 물체가 바닥에 앉아 보이도록 가운데를 옅게 어둡게 — 그림자를 끈 저사양에서도 떠 보이지 않는다.
    const S = 256, cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d');
    // alphaMap은 초록 채널을 읽는다 — 투명도 말고 검정 바탕 위 밝기로 그린다(가장자리가 0이 되어 테두리가 안 생긴다).
    const gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); gr.addColorStop(0, '#fff'); gr.addColorStop(0.3, '#999'); gr.addColorStop(0.62, '#2e2e2e'); gr.addColorStop(1, '#000');
    g.fillStyle = gr; g.fillRect(0, 0, S, S);
    const tex = new THREE.CanvasTexture(cv);
    const ao = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x5a4630, alphaMap: tex, transparent: true, opacity: 0.22, depthWrite: false, toneMapped: false }));
    ao.rotation.x = -Math.PI / 2; ao.position.y = 0.001; ao.scale.set(6.4, 4.8, 1); ao.renderOrder = -1; this.scene.add(ao);
    this.ground = { catcher, ao };
  }
  // 바닥 닿은 그늘의 크기·위치를 장면이 바꿀 수 있다(물체가 한쪽에 몰린 장면).
  setContactShadow({ x = 0, z = 0, w = 6.4, d = 4.8, opacity = 0.22 } = {}) { const a = this.ground?.ao; if (!a) return; a.position.x = x; a.position.z = z; a.scale.set(w, d, 1); a.material.opacity = opacity; }
  _applyTier(t) {
    const T = TIERS[Math.max(0, Math.min(TIERS.length - 1, t))]; this.tier = TIERS.indexOf(T);
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, T.dpr));
    const k = this.key; if (k) {
      if (k.shadow.mapSize.x !== T.shadow) { k.shadow.mapSize.set(T.shadow, T.shadow); k.shadow.map?.dispose(); k.shadow.map = null; }
      k.castShadow = T.shadows;
    }
    this.canvas.dataset.quality = ['high', 'mid', 'low', 'min'][this.tier];
    if (this._raf || this.clock) this._resize();
  }
  // 실제 프레임 시간으로 화질을 맞춘다: 활성 상태 첫 30프레임(셰이더 컴파일)은 버리고, 90프레임마다 중앙값이 32ms를 넘으면 한 단계 내린다.
  _measure(raw) {
    if (!this._adaptive || this.tier >= TIERS.length - 1) return;
    const P = this._perf; if (++P.n <= 30 || raw > 0.25) return;
    P.dts.push(raw); if (P.dts.length < 90) return;
    const m = P.dts.sort((a, b) => a - b)[45]; P.dts.length = 0;
    if (m > 0.032) { this._applyTier(this.tier + 1); P.n = 10; if (++P.drops >= 3) this._adaptive = false; }
    else if (P.n > 600) this._adaptive = false;    // 10초 넘게 괜찮으면 그만 잰다
  }
  _setupInput() {
    const c = this.canvas; let drag = null, pinch = null;
    const down = (x, y) => { drag = { x, y, th: this.orbit.theta, ph: this.orbit.phi }; };
    const move = (x, y) => { if (!drag) return; const dx = (x - drag.x) / c.clientWidth, dy = (y - drag.y) / c.clientHeight; this.orbit.theta = drag.th - dx * 3.2; this.orbit.phi = Math.max(0.35, Math.min(1.5, drag.ph - dy * 2.4)); };
    this._on(c, 'pointerdown', (e) => { if (e.isPrimary) { down(e.clientX, e.clientY); c.setPointerCapture(e.pointerId); } });
    this._on(c, 'pointermove', (e) => { if (e.isPrimary) move(e.clientX, e.clientY); });
    this._on(c, 'pointerup', () => { drag = null; }); this._on(c, 'pointercancel', () => { drag = null; });
    // 보통 휠은 팝업/페이지를 스크롤한다. 확대는 Ctrl+휠, 폰은 두 손가락만 사용한다.
    this._on(c, 'wheel', (e) => { if (!e.ctrlKey) return; e.preventDefault(); this.orbit.dist = Math.max(3, Math.min(20, this.orbit.dist * (1 + Math.sign(e.deltaY) * 0.08))); }, { passive: false });
    this._on(c, 'touchstart', (e) => { if (e.touches.length === 2) pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
    this._on(c, 'touchmove', (e) => { if (e.touches.length === 2 && pinch) { const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); this.orbit.dist = Math.max(3, Math.min(20, this.orbit.dist * pinch / d)); pinch = d; } }, { passive: true });
    this._on(c, 'touchend', () => { pinch = null; });
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
  // 형상·재질·텍스처를 모두 GPU에서 내린다(라벨 텍스처는 여러 무대가 캐시로 같이 쓰지만, 내려도 다음에 쓸 때 다시 올라간다).
  _disposeObjects(objects) {
    const geometries = new Set(), materials = new Set(), textures = new Set();
    objects.forEach((object) => object?.traverse((n) => {
      if (n.geometry) geometries.add(n.geometry);
      const mm = Array.isArray(n.material) ? n.material : n.material ? [n.material] : [];
      mm.forEach((m) => { materials.add(m); for (const k in m) { const v = m[k]; if (v && v.isTexture) textures.add(v); } });
      if (n.isInstancedMesh) n.dispose();   // 인스턴스 행렬·색 버퍼
    }));
    geometries.forEach((g) => g.dispose()); materials.forEach((m) => m.dispose()); textures.forEach((t) => t.dispose());
  }
  clear() { const children = [...this.root.children]; children.forEach((c) => this.root.remove(c)); this._disposeObjects(children); this.update = null; }
  _requestFrame() { if (this.running && this.active && !this._raf) this._raf = requestAnimationFrame(this._loop); }
  _updateActivity() {
    const active = !!(this.running && this._pageVisible && this._inView);
    if (active === this.active) return;
    this.active = active; this.canvas.dataset.animationActive = active ? 'true' : 'false';
    if (active) { this.clock?.update(); this._requestFrame(); }   // 멈춰 있던 시간은 한 프레임으로 치지 않는다
    else if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
  }
  _loop() {
    this._raf = 0; if (!this.running || !this.active) return;
    this.clock.update(); const raw = this.clock.getDelta(), dt = Math.min(0.25, raw), t = this.clock.getElapsed(); const o = this.orbit;
    if (this.lost) { this._requestFrame(); return; }
    this._measure(raw);
    // fitWidth(선택): 옆으로 넓게 놓인 실험실이 세로로 긴 화면에서 잘리지 않게, 그 비율보다 좁아지면 그만큼만 뒤로 물러난다.
    const fw = this.fitWidth && this.camera.aspect < this.fitWidth ? Math.min(1.8, this.fitWidth / this.camera.aspect) : 1, D = o.dist * fw;
    const x = o.target.x + D * Math.sin(o.phi) * Math.sin(o.theta), y = o.target.y + D * Math.cos(o.phi), z = o.target.z + D * Math.sin(o.phi) * Math.cos(o.theta);
    this.camera.position.set(x, y, z); this.camera.lookAt(o.target);
    if (this.update) this.update(dt, t, raw);
    const pr = this.renderer.getPixelRatio();   // 가로 크게 보기로 높이만 바뀌어도 다시 맞춘다
    if (this.canvas.width !== Math.floor(this.canvas.clientWidth * pr) || this.canvas.height !== Math.floor(this.canvas.clientHeight * pr)) this._resize();
    fitLabels(this.scene, this.camera, this.canvas.clientHeight, this.canvas.clientWidth < 500 ? 44 : 40, 72, this.canvas.clientWidth);   // 라벨 그림 전체 높이 px(카드는 약 71%, 글자는 약 45%)
    this.renderer.render(this.scene, this.camera);
    this._requestFrame();
  }
  dispose() {
    if (!this.running && !Stage.live.has(this)) return;
    Stage.live.delete(this); this.running = false; this.active = false;
    if (this._raf) cancelAnimationFrame(this._raf); this._raf = 0;
    this._observer?.disconnect(); this._cleanups.splice(0).forEach((off) => off());
    this.clear(); this._disposeObjects([this.scene]); this._bgTex?.dispose(); this._envTex?.dispose(); this.key?.shadow?.map?.dispose();
    this.scene.background = null; this.scene.environment = null;
    this.renderer.renderLists?.dispose(); this.renderer.dispose();
    // 문맥을 바로 돌려준다 — 책장을 넘길 때마다 실험실이 새로 뜨므로, 가비지 수거를 기다리면 브라우저 한도(보통 16개)에 걸려 3D가 꺼진다.
    try { this.renderer.forceContextLoss(); } catch { /* 이미 잃었으면 그대로 */ }
    this.canvas.dataset.animationActive = 'false';
  }
}

// 해시가 바뀌지 않아도(책 팝업 닫기) 떨어진 무대를 즉시 정리한다.
export function watchDetached(host, cleanup) {
  let done = false;
  const finish = () => { if (done) return; done = true; observer.disconnect(); removeEventListener('hashchange', check); cleanup(); };
  const check = () => setTimeout(() => { if (!host.isConnected) finish(); });
  const observer = new MutationObserver(check); observer.observe(document.body, { childList: true, subtree: true });
  addEventListener('hashchange', check);
  return finish;
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
