/* ============================================================
   수의 마법 — 3D 마법책 시범 두 쪽 (2026-10-27, 원장 「2쪽만 해봐」)
   참고로 본 것: Every Joule(iamtechartist) — 책상 위 진짜 책, 지면에서 솟는 펜 선 그림, 빛으로 흐르는 양,
   예측 → 직접 해 보기 → 날개 들추기 → 도장. 그쪽 코드·그림은 라이선스가 없어 쓰지 않았다. 전부 새로 그렸다.

   장면: 로그인 책과 같은 초록 가죽 책(assets/promo/grimoire-emerald.webp)이 도형 나라 쌓기나무 판과 같은
   밝은 단풍나무 판(geometry/app.js createWoodTexture·createWoodBoard 의 색과 결) 위에 놓여 있다. 바탕은 도형 나라와 같은 크림.
   원장 「우리 책은 스르륵이야. 로그인에 사용했던 거」 → 로그인 책처럼 1.4초 smoothstep 으로 펼쳐진다.
   원장 「책은 더 두꺼워야 돼. 책상 초록 안 돼. 지오메트리 쌓기나무 판 정도로」 → 두꺼운 종이 묶음 · 나무 판 책상.
   책은 두 반쪽이다. 오른쪽 반(뒤표지·종이 묶음·5쪽)은 가만히 있고, 왼쪽 반(앞표지·종이 묶음·4쪽)이 책등을 축으로
   돌아 덮였다 펼쳐진다. 덮이면 앞표지(가죽)가 위를 본다.
   4쪽 = 개념 · 핵심 낱말 · 예측(누르면 손글씨 체크) · 날개(들추면 정답) · 다 하면 손글씨 풀이와 도장.
   5쪽 = 지면 위로 솟는 10칸 상자 두 개(8 · 7). 노란 구슬을 누르면 빛을 남기며 8 쪽으로 날아가 10을 만든다.
   쪽 글자는 캔버스로 찍어 종이 위에 입힌다(한·영·중). 같은 내용·같은 조작은 페이지의 「글로 보기」에도 있다.
   움직임 줄이기면 모든 움직임이 즉시 끝난 모습으로 바뀐다.

   const ctl = await mountBook(canvas, { lang, reduced, sound, onChange(state, event) })
   ctl.open() · close() · reset() · moveBead() · liftFlap() · pick(i) · setView('spread'|'left'|'right') ·
   setReduced(bool) · setSound(bool) · state · dispose()
   ============================================================ */
import * as THREE from '../../../world-explorer/vendor/three.module.js';
import { CONTENT, WORK, CORRECT_CHOICE } from './content.js';

export function supportsWebGL(){
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); }
  catch(e){ return false; }
}

/* ── 색 · 글꼴 ── */
const INK = '#163f39', PAPER = '#fffcf5', GOLD = '#c8961e', TEAL = '#2e7d6b', AMBER = '#e8a23a', RUST = '#a8452c', PEN = '#24585a';
const FONT_DIR = new URL('../../assets/fonts/', import.meta.url);
const COVER_URL = new URL('../../assets/promo/grimoire-emerald.webp', import.meta.url);
let fontsP = null;
function loadFonts(){
  if(fontsP) return fontsP;
  const list = [['NM Book Sans', 'pretendard-var.woff2', '100 900'], ['NM Book Hand', 'nm-lesson-hand.woff2', '400'],
    ['NM Book Kalam', 'kalam-cover.ttf', '400'], ['NM Book Brush', 'ma-shan-cover.ttf', '400']];
  const loads = list.map(([fam, file, weight]) => {
    try { const f = new FontFace(fam, `url(${new URL(file, FONT_DIR)})`, { weight }); document.fonts.add(f); return f.load().catch(() => null); }
    catch(e){ return Promise.resolve(null); }
  });
  /* 제목 명조(함렛 — 입구·앱과 같은 글꼴)는 페이지가 Google Fonts 로 부른다. 막혀 있으면 기다리지 않고 바탕체로 간다. */
  const serif = Promise.race([document.fonts.load('600 40px "Hahmlet"').catch(() => null), new Promise(r => setTimeout(r, 2500))]);
  fontsP = Promise.all([...loads, serif]);
  return fontsP;
}
const SANS = '"NM Book Sans", Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif';
const SERIF = '"Hahmlet", "Noto Serif KR", "Nanum Myeongjo", Georgia, serif';
const handFont = lang => lang === 'en' ? '"NM Book Kalam", cursive' : lang === 'zh' ? '"NM Book Brush", ' + SANS : '"NM Book Hand", ' + SANS;

/* ── 쪽 크기(세계 단위) · 캔버스 크기 ── */
const PAGE_W = 1, PAGE_H = 1.34, PW = 1400, PH = Math.round(1400 * 1.34);
const BOARD = 0.03, STACK = 0.12, PIV = BOARD + STACK;             // 종이 윗면 높이(두꺼운 책: 덮으면 0.3 — 쪽 너비의 30%)
const GUT = 0.2, DIP = 0.038;                                     // 책등 쪽으로 휘어 들어가는 너비·깊이
const DESK_W = 3.2, DESK_H = 2.35, DESK_T = 0.16, RIM = 0.06;      // 나무 판(쌓기나무 판 비율)
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const smooth = t => t * t * (3 - 2 * t);      // 로그인 책 펼침과 같은 곡선(app/access.js)
const clamp01 = t => Math.max(0, Math.min(1, t));

/* 글 줄바꿈 — 한·영은 낱말 단위, 중국어와 너무 긴 낱말은 글자 단위 */
function wrap(g, text, maxW){
  const words = /[一-鿿]/.test(text) && !/\s/.test(text.trim()) ? [...text] : text.split(/(\s+)/);
  const lines = []; let line = '';
  for(const w of words){
    const test = line + w;
    if(g.measureText(test).width <= maxW || !line.trim()){ line = test; continue; }
    lines.push(line.trim()); line = w.trimStart();
    while(g.measureText(line).width > maxW && line.length > 1){
      let i = line.length; while(i > 1 && g.measureText(line.slice(0, i)).width > maxW) i--;
      lines.push(line.slice(0, i)); line = line.slice(i);
    }
  }
  if(line.trim()) lines.push(line.trim());
  return lines;
}
/* 한 줄이 너비를 넘으면 글자 크기를 줄인다 */
function fit(g, text, maxW, size, tpl){ let s = size; g.font = tpl(s); while(s > 20 && g.measureText(text).width > maxW){ s -= 2; g.font = tpl(s); } return s; }
function rng(seed){ let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

/* 종이 바탕 — 섬유 점 · 안쪽(책등) 그늘 · 바깥 가장자리. 한 번 그려 두고 쪽을 다시 그릴 때마다 붙여 쓴다. */
const paperCache = {};
function paper(g, gutter){
  if(!paperCache[gutter]){ const c = document.createElement('canvas'); c.width = PW; c.height = PH; paperBase(c.getContext('2d'), gutter); paperCache[gutter] = c; }
  g.drawImage(paperCache[gutter], 0, 0);
}
function paperBase(g, gutter){
  g.fillStyle = PAPER; g.fillRect(0, 0, PW, PH);
  const r = rng(gutter === 'right' ? 11 : 23);
  for(let i = 0; i < 900; i++){
    g.fillStyle = `rgba(${120 + r() * 60 | 0},${100 + r() * 50 | 0},${60 + r() * 40 | 0},${0.015 + r() * 0.025})`;
    g.fillRect(r() * PW, r() * PH, 1 + r() * 2.5, 1 + r() * 1.2);
  }
  const gx = gutter === 'right' ? PW : 0, gw = 170;
  const gr = g.createLinearGradient(gx, 0, gutter === 'right' ? PW - gw : gw, 0);
  gr.addColorStop(0, 'rgba(70,50,20,0.20)'); gr.addColorStop(0.35, 'rgba(70,50,20,0.06)'); gr.addColorStop(1, 'rgba(70,50,20,0)');
  g.fillStyle = gr; g.fillRect(gutter === 'right' ? PW - gw : 0, 0, gw, PH);
  const ox = gutter === 'right' ? 0 : PW;
  const er = g.createLinearGradient(ox, 0, gutter === 'right' ? 36 : PW - 36, 0);
  er.addColorStop(0, 'rgba(120,95,50,0.10)'); er.addColorStop(1, 'rgba(120,95,50,0)');
  g.fillStyle = er; g.fillRect(gutter === 'right' ? 0 : PW - 36, 0, 36, PH);
}

/* 손으로 그은 체크(살짝 떨리는 두 획) */
function penCheck(g, x, y, s){
  g.save(); g.strokeStyle = RUST; g.lineWidth = s * 0.13; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x - s * .42, y - s * .02); g.quadraticCurveTo(x - s * .22, y + s * .14, x - s * .1, y + s * .36);
  g.quadraticCurveTo(x + s * .12, y - s * .1, x + s * .55, y - s * .52); g.stroke(); g.restore();
}

export async function mountBook(canvas, opts){
  opts = opts || {};
  const lang = CONTENT[opts.lang] ? opts.lang : 'ko', T = CONTENT[lang], HAND = handFont(lang);
  let reduced = !!opts.reduced, sound = !!opts.sound;
  const onChange = typeof opts.onChange === 'function' ? opts.onChange : () => {};
  await loadFonts();

  /* ── 렌더러 · 장면 ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.02;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 40);

  scene.add(new THREE.HemisphereLight('#fffaf0', '#c9b79a', 1.25));
  const sun = new THREE.DirectionalLight('#fff0d8', 2.4);
  sun.position.set(-2.2, 4.2, 1.8); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0008; sun.shadow.normalBias = 0.045;
  Object.assign(sun.shadow.camera, { left: -2.4, right: 2.4, top: 2.4, bottom: -2.4, near: 0.5, far: 12 });
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#e8efff', 0.35); fill.position.set(2.5, 2, 3); scene.add(fill);

  const disposables = [];
  const keep = x => { disposables.push(x); return x; };
  const canvasTexture = (c, srgb = true) => { const t = keep(new THREE.CanvasTexture(c)); if(srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; return t; };
  const makeCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  /* ── 나무 판: 도형 나라 쌓기나무 판과 같은 단풍나무 결(geometry/app.js createWoodTexture 의 색·결 그대로) ── */
  const woodTex = (() => {
    const c = makeCanvas(512, 512), g = c.getContext('2d');
    const base = g.createLinearGradient(0, 0, 512, 512); base.addColorStop(0, '#fff7e7'); base.addColorStop(0.46, '#f0d4a5'); base.addColorStop(1, '#d9b57e');
    g.fillStyle = base; g.fillRect(0, 0, 512, 512);
    for(let i = 0; i < 76; i++){ const y = 18 + i * 6.5 + Math.sin(i * 1.7) * 6; g.beginPath(); g.moveTo(-20, y);
      for(let x = -20; x <= 540; x += 18) g.lineTo(x, y + Math.sin(x * 0.036 + i) * 3.6 + Math.sin(x * 0.012 + i * 0.4) * 2.4);
      g.strokeStyle = i % 3 === 0 ? 'rgba(115,78,39,.095)' : 'rgba(255,255,245,.24)'; g.lineWidth = i % 3 === 0 ? 1.15 : 0.9; g.stroke(); }
    for(let i = 0; i < 34; i++){ g.beginPath(); g.ellipse(44 + (i * 83) % 432, 38 + (i * 117) % 420, 20, 6, i, 0, Math.PI * 2); g.strokeStyle = 'rgba(105,70,35,.07)'; g.lineWidth = 1; g.stroke(); }
    const t = canvasTexture(c); t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping; return t;
  })();
  const roundRect = (w, h, r, holeW, holeH, holeR) => {
    const sh = new THREE.Shape(), rr = (path, w, h, r) => { path.moveTo(-w / 2 + r, -h / 2); path.lineTo(w / 2 - r, -h / 2); path.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      path.lineTo(w / 2, h / 2 - r); path.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2); path.lineTo(-w / 2 + r, h / 2); path.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      path.lineTo(-w / 2, -h / 2 + r); path.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2); };
    rr(sh, w, h, r); if(holeW){ const hole = new THREE.Path(); rr(hole, holeW, holeH, holeR); sh.holes.push(hole); } return sh;
  };
  const woodSlab = (shape, depth, bevel, color) => {
    const geo = keep(new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 10 }));
    geo.rotateX(-Math.PI / 2);      // 두께가 위로
    /* 판 전체에 결 한 장(이음매 없이) — 쌓기나무 판처럼 */
    const uv = geo.attributes.uv; for(let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / DESK_W + 0.5, uv.getY(i) / DESK_H + 0.5);
    const m = new THREE.Mesh(geo, keep(new THREE.MeshStandardMaterial({ color, map: woodTex, bumpMap: woodTex, bumpScale: 0.01, roughness: 0.58, metalness: 0.01 })));
    m.castShadow = m.receiveShadow = true; return m;
  };
  const desk = woodSlab(roundRect(DESK_W, DESK_H, 0.16), DESK_T, 0.025, '#e7c28e'); desk.position.y = -DESK_T; scene.add(desk);
  const rim = woodSlab(roundRect(DESK_W - 0.02, DESK_H - 0.02, 0.15, DESK_W - 0.02 - RIM * 2, DESK_H - 0.02 - RIM * 2, 0.1), 0.035, 0.012, '#d0a36b'); rim.position.y = 0.012; scene.add(rim);
  /* 판 밑 그림자만 받는 바닥(바탕은 페이지 CSS 의 크림) */
  { const floor = new THREE.Mesh(keep(new THREE.PlaneGeometry(16, 12)), keep(new THREE.ShadowMaterial({ opacity: 0.22, color: '#5b4326' })));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -DESK_T - 0.03; floor.receiveShadow = true; scene.add(floor); }

  /* ── 표지(가죽) 텍스처: 입구와 같은 그림 + 금박 제목 ── */
  const coverImg = await new Promise(res => { const im = new Image(); im.onload = () => res(im); im.onerror = () => res(null); im.src = COVER_URL.href; });
  const coverCanvas = makeCanvas(1080, 1456), cg = coverCanvas.getContext('2d');
  if(coverImg){ const sx = coverImg.naturalWidth * 0.068; cg.drawImage(coverImg, sx, 0, coverImg.naturalWidth - sx, coverImg.naturalHeight, 0, 0, 1080, 1456); }
  else { cg.fillStyle = '#1f4a32'; cg.fillRect(0, 0, 1080, 1456); }
  {
    const gold = cg.createLinearGradient(0, 380, 0, 760);
    gold.addColorStop(0, '#f5e2a8'); gold.addColorStop(.5, '#d9b866'); gold.addColorStop(1, '#b8913f');
    cg.textAlign = 'center'; cg.shadowColor = 'rgba(0,0,0,.45)'; cg.shadowBlur = 6; cg.shadowOffsetY = 3; cg.fillStyle = gold;
    cg.font = `700 132px Georgia, ${SERIF}`; cg.fillText('Numbers', 540, 520);
    { cg.textAlign = 'left'; cg.font = `italic 400 84px Georgia, ${SERIF}`; const wo = cg.measureText('of').width;
      cg.font = `700 132px Georgia, ${SERIF}`; const wm = cg.measureText('Magic').width, x0 = 540 - (wo + 22 + wm) / 2;
      cg.font = `italic 400 84px Georgia, ${SERIF}`; cg.fillText('of', x0, 650); cg.font = `700 132px Georgia, ${SERIF}`; cg.fillText('Magic', x0 + wo + 22, 650); cg.textAlign = 'center'; }
    cg.font = `400 92px ${handFont('ko')}`; cg.fillText(lang === 'zh' ? '数之魔法' : '수의 마법', 540, 800);
    cg.font = `400 150px ${handFont('ko')}`; cg.fillText('8 + 7', 540, 1080);
    cg.shadowBlur = 0; cg.font = `600 34px ${SANS}`; cg.fillStyle = '#e3cc9d';
    cg.fillText(lang === 'en' ? 'The power to calculate, read and think' : lang === 'zh' ? '计算的力量，阅读与思考的力量' : '계산하는 힘, 읽고 생각하는 힘', 540, 300);
  }
  const coverTex = canvasTexture(coverCanvas);
  const leather = keep(new THREE.MeshStandardMaterial({ color: '#21482f', roughness: 0.7 }));
  const coverMat = keep(new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.62 }));
  const edgeMat = (() => {   // 종이 묶음 옆면: 가는 결
    const c = makeCanvas(64, 512), g = c.getContext('2d'); g.fillStyle = '#efe6d2'; g.fillRect(0, 0, 64, 512);
    for(let y = 0; y < 512; y += 3){ g.fillStyle = `rgba(120,100,70,${0.08 + (y % 9 === 0 ? 0.06 : 0)})`; g.fillRect(0, y, 64, 1); }
    const t = canvasTexture(c); return keep(new THREE.MeshStandardMaterial({ map: t, roughness: 0.95 }));
  })();
  /* 종이 묶음: 바깥 세 면만 보인다. 윗면과 책등 쪽 면은 쪽 아래에 숨어 있는데, 그려 두면 휜 쪽 너머로 줄이 비친다. */
  const hidden = keep(new THREE.MeshBasicMaterial({ visible: false }));
  const stackMats = side => side === 'right' ? [edgeMat, hidden, hidden, edgeMat, edgeMat, edgeMat] : [hidden, edgeMat, hidden, edgeMat, edgeMat, edgeMat];

  /* ── 쪽 캔버스 ── */
  const leftCanvas = makeCanvas(PW, PH), lg = leftCanvas.getContext('2d');
  const rightCanvas = makeCanvas(PW, PH), rg = rightCanvas.getContext('2d');
  const leftTex = canvasTexture(leftCanvas), rightTex = canvasTexture(rightCanvas);
  const hits = { choices: [], flap: null };
  const state = { open: false, choice: null, flap: false, moved: 0, view: 'spread' };
  const anim = { work: 0, stamp: 0 };      // 손글씨 풀이 · 도장 진행(0~1)

  function drawLeft(){
    const g = lg, M = 150, IN = 130, W = PW - M - IN;
    paper(g, 'right');
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    g.fillStyle = '#5e6b66'; g.font = `400 40px Georgia, ${SERIF}`; g.fillText('Numbers ', M, 150); const nw = g.measureText('Numbers ').width;
    g.font = `italic 400 40px Georgia, ${SERIF}`; g.fillText('of ', M + nw, 150); const ow = g.measureText('of ').width; g.font = `400 40px Georgia, ${SERIF}`; g.fillText('Magic', M + nw + ow, 150);
    g.fillStyle = '#8a6a2a'; g.font = `700 30px ${SANS}`; g.textAlign = 'right'; g.fillText(T.kicker, PW - IN, 150); g.textAlign = 'left';
    g.fillStyle = INK; fit(g, T.heading, W, 92, s => `600 ${s}px ${SERIF}`); g.fillText(T.heading, M, 300);
    g.fillStyle = GOLD; g.fillRect(M, 338, 170, 5);
    let y = 432; g.font = `400 46px ${SANS}`; g.fillStyle = '#2c3433';
    for(const p of T.body){ for(const line of wrap(g, p, W)){ g.fillText(line, M, y); y += 72; } y += 14; }
    /* 핵심 낱말 */
    y += 8; const boxTop = y, rowH = 66, boxH = 84 + T.words.length * rowH;
    g.fillStyle = 'rgba(46,125,107,0.08)'; g.strokeStyle = 'rgba(46,125,107,0.38)'; g.lineWidth = 2.5;
    g.beginPath(); g.roundRect ? g.roundRect(M, boxTop, W, boxH, 20) : g.rect(M, boxTop, W, boxH); g.fill(); g.stroke();
    g.fillStyle = TEAL; g.font = `700 32px ${SANS}`; g.fillText(T.wordsLabel, M + 38, boxTop + 58);
    g.font = `700 42px ${SANS}`; const tw = Math.max(...T.words.map(([w]) => g.measureText(w).width)) + 40;
    T.words.forEach(([w, d], i) => {
      const ry = boxTop + 124 + i * rowH;
      g.fillStyle = INK; g.font = `700 42px ${SANS}`; g.fillText(w, M + 38, ry);
      g.fillStyle = '#545b57'; fit(g, d, W - 76 - tw, 40, s => `400 ${s}px ${SANS}`); g.fillText(d, M + 38 + tw, ry);
    });
    y = boxTop + boxH + 92;
    /* 예측 */
    g.fillStyle = RUST; g.font = `700 32px ${SANS}`; g.fillText(T.predictLabel, M, y); y += 66;
    g.fillStyle = INK; g.font = `600 50px ${SANS}`; for(const line of wrap(g, T.predictQ, W)){ g.fillText(line, M, y); y += 66; }
    hits.choices = [];
    const cw = Math.min(330, W / 3);
    T.choices.forEach((c, i) => {
      const x = M + i * cw, by = y + 6;
      g.strokeStyle = INK; g.lineWidth = 3.5; g.strokeRect(x, by, 56, 56);
      g.fillStyle = INK; g.font = `500 48px ${SANS}`; g.fillText(c, x + 80, by + 48);
      if(state.choice === i) penCheck(g, x + 28, by + 22, 84);
      hits.choices.push({ x: x - 20, y: by - 24, w: cw - 10, h: 104, i });
    });
    y += 140;
    /* 풀이 — 다 하면 손글씨로 써진다 */
    const workY = y + 70;
    if(anim.work > 0){
      g.fillStyle = '#8a7a5a'; g.font = `700 28px ${SANS}`; g.fillText(T.workLabel, M, y);
      g.save(); g.beginPath(); g.rect(M - 10, workY - 100, (W + 20) * anim.work, 150); g.clip();
      g.fillStyle = PEN; fit(g, WORK, W, 78, s => `400 ${s}px ${handFont(lang === 'zh' ? 'ko' : lang)}`);
      g.fillText(WORK, M, workY); g.restore();
    }
    /* 날개 아래 정답(날개가 덮고 있다) */
    const flapH = 270, flapY = PH - 150 - flapH;
    hits.flap = { x: M, y: flapY, w: W, h: flapH };
    g.fillStyle = 'rgba(200,150,30,0.12)'; g.fillRect(M, flapY, W, flapH);
    g.fillStyle = INK; g.font = `700 52px ${SANS}`; g.fillText(T.answerTitle, M + 38, flapY + 82);
    g.fillStyle = '#3a403e'; g.font = `400 40px ${SANS}`;
    let ay = flapY + 146; for(const line of wrap(g, T.answer, W - 76)){ g.fillText(line, M + 38, ay); ay += 56; }
    /* 도장 */
    if(anim.stamp > 0){
      const s = 1 + (1 - ease(anim.stamp)) * 0.6, a = Math.min(1, anim.stamp * 1.6);
      g.save(); g.translate(PW - IN - 140, workY - 190); g.rotate(-0.2); g.scale(s, s); g.globalAlpha = a * 0.88;
      g.strokeStyle = RUST; g.fillStyle = RUST; g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 122, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 104, 0, Math.PI * 2); g.stroke();
      g.textAlign = 'center'; fit(g, T.stamp[0], 180, 40, s2 => `800 ${s2}px ${SANS}`); g.fillText(T.stamp[0], 0, -6);
      fit(g, T.stamp[1], 170, 32, s2 => `700 ${s2}px ${SANS}`); g.fillText(T.stamp[1], 0, 40);
      g.restore();
    }
    g.textAlign = 'center'; g.fillStyle = '#8a7a5a'; g.font = `500 28px ${SANS}`; g.fillText('04', (M + PW - IN) / 2, PH - 70); g.textAlign = 'left';
    leftTex.needsUpdate = true;
  }
  function drawRight(){
    const g = rg, M = 150, IN = 130, W = PW - M - IN;
    paper(g, 'left');
    g.textAlign = 'right'; g.fillStyle = '#8a7a5a'; g.font = `600 30px ${SANS}`; g.fillText(T.runningHead, PW - M, 130);
    g.textAlign = 'left';
    let y = PH - 380;
    g.fillStyle = '#6b6450'; g.font = `italic 400 36px ${SERIF}`; g.fillText(T.figCaption, IN, y); y += 68;
    g.fillStyle = '#3a403e'; g.font = `400 42px ${SANS}`; for(const line of wrap(g, T.tapHint, W)){ g.fillText(line, IN, y); y += 60; }
    y += 14; g.fillStyle = state.moved >= 2 ? RUST : TEAL; g.font = `700 46px ${SANS}`;
    for(const line of wrap(g, T.status(state.moved), W)){ g.fillText(line, IN, y); y += 62; }
    g.textAlign = 'center'; g.fillStyle = '#8a7a5a'; g.font = `500 28px ${SANS}`; g.fillText('05', (IN + PW - M) / 2, PH - 70);
    rightTex.needsUpdate = true;
  }

  /* ── 쪽(종이 면): 책등 쪽으로 살짝 휘어 들어간다 ── */
  function pageGeometry(side){
    const geo = keep(new THREE.PlaneGeometry(PAGE_W, PAGE_H, 40, 2));
    geo.rotateX(-Math.PI / 2); geo.translate(side === 'left' ? -PAGE_W / 2 : PAGE_W / 2, 0, 0);
    const p = geo.attributes.position;
    for(let i = 0; i < p.count; i++){ const ax = Math.abs(p.getX(i)); if(ax < GUT) p.setY(i, p.getY(i) - DIP * (0.5 + 0.5 * Math.cos(Math.PI * ax / GUT))); }
    p.needsUpdate = true; geo.computeVertexNormals(); return geo;
  }
  const pageMat = tex => keep(new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.3 }));

  /* 오른쪽 반(가만히): 뒤표지 · 종이 묶음 · 5쪽 */
  const book = new THREE.Group(); scene.add(book);
  const rightHalf = new THREE.Group(); book.add(rightHalf);
  const board = (side) => {
    const m = new THREE.Mesh(keep(new THREE.BoxGeometry(PAGE_W + 0.03, BOARD, PAGE_H + 0.05)), [leather, leather, leather, side === 'left' ? coverMat : leather, leather, leather]);
    m.castShadow = m.receiveShadow = true; return m;
  };
  { const b = board('right'); b.position.set(PAGE_W / 2 + 0.005, BOARD / 2, 0); rightHalf.add(b);
    const st = new THREE.Mesh(keep(new THREE.BoxGeometry(PAGE_W - 0.01, STACK, PAGE_H - 0.01)), stackMats('right')); st.position.set(PAGE_W / 2, BOARD + STACK / 2 - 0.004, 0); st.receiveShadow = true;   /* 종이 묶음은 쪽 아래에 숨어 있다 — 그림자를 드리우면 휜 쪽에 줄무늬가 진다 */ rightHalf.add(st);
    const pg = new THREE.Mesh(pageGeometry('right'), pageMat(rightTex)); pg.position.y = PIV + 0.0005; pg.receiveShadow = true; pg.name = 'rightPage'; rightHalf.add(pg); }

  /* 왼쪽 반(책등을 축으로 돈다): 앞표지(가죽) · 종이 묶음 · 4쪽 · 날개 */
  const leftHalf = new THREE.Group(); leftHalf.position.set(0, PIV, 0); book.add(leftHalf);
  let leftPage, flap;
  { const b = board('left'); b.position.set(-PAGE_W / 2 - 0.005, -PIV + BOARD / 2, 0); leftHalf.add(b);
    /* 앞표지 그림은 판의 아랫면에 붙는다 — 덮이면(π 회전) 그 면이 위를 본다. 회전으로 뒤집히는 방향을 맞춘다. */
    coverTex.center.set(0.5, 0.5); coverTex.rotation = Math.PI;
    const st = new THREE.Mesh(keep(new THREE.BoxGeometry(PAGE_W - 0.01, STACK, PAGE_H - 0.01)), stackMats('left')); st.position.set(-PAGE_W / 2, -PIV + BOARD + STACK / 2 - 0.004, 0); st.receiveShadow = true;   /* 종이 묶음은 쪽 아래에 숨어 있다 — 그림자를 드리우면 휜 쪽에 줄무늬가 진다 */ leftHalf.add(st);
    leftPage = new THREE.Mesh(pageGeometry('left'), pageMat(leftTex)); leftPage.position.y = 0.0005; leftPage.receiveShadow = true; leftPage.name = 'leftPage'; leftHalf.add(leftPage); }
  /* 책등: 덮였을 때는 두 반쪽을 잇는 두꺼운 가죽, 펼치면 얇아져 아래로 숨는다 */
  const spine = new THREE.Mesh(keep(new THREE.BoxGeometry(0.05, 1, PAGE_H + 0.05)), leather);
  spine.castShadow = true; book.add(spine);

  /* 날개: 4쪽 정답 위에 붙은 종이. 아래쪽 가장자리를 경첩으로 읽는 사람 쪽으로 넘어간다. */
  const FLAP_W = 1120, FLAP_H = 270, flapCanvas = makeCanvas(FLAP_W, FLAP_H), fg = flapCanvas.getContext('2d'), flapTex = canvasTexture(flapCanvas);
  function drawFlap(){
    const g = fg; g.fillStyle = '#f2e7cd'; g.fillRect(0, 0, FLAP_W, FLAP_H);
    const r = rng(41); for(let i = 0; i < 900; i++){ g.fillStyle = `rgba(120,95,50,${0.03 + r() * 0.05})`; g.fillRect(r() * FLAP_W, r() * FLAP_H, 2, 1.2); }
    g.strokeStyle = 'rgba(120,95,50,0.35)'; g.setLineDash([12, 9]); g.lineWidth = 2.5; g.strokeRect(14, 14, FLAP_W - 28, FLAP_H - 28); g.setLineDash([]);
    g.textAlign = 'left'; g.fillStyle = RUST; g.font = `700 34px ${SANS}`; g.fillText(T.flapLabel, 46, 86);
    g.fillStyle = INK; fit(g, T.flapHint, 820, 46, s => `600 ${s}px ${SANS}`); g.fillText(T.flapHint, 46, 166);
    g.fillStyle = PEN; g.font = `400 52px ${HAND}`; g.textAlign = 'right'; g.fillText(T.flapTag, 1070, 92);
    g.strokeStyle = PEN; g.lineWidth = 4.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(985, 118); g.quadraticCurveTo(1015, 180, 1066, 214); g.moveTo(1066, 214); g.lineTo(1034, 210); g.moveTo(1066, 214); g.lineTo(1058, 182); g.stroke();
    flapTex.needsUpdate = true;
  }
  const flapPivot = new THREE.Group(); leftHalf.add(flapPivot);
  {
    const fw = PAGE_W * FLAP_W / PW, fh = PAGE_H * FLAP_H / PH;
    const geo = keep(new THREE.PlaneGeometry(fw, fh)); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, -fh / 2);
    flap = new THREE.Mesh(geo, keep(new THREE.MeshStandardMaterial({ map: flapTex, roughness: 0.95, emissive: '#ffffff', emissiveMap: flapTex, emissiveIntensity: 0.25 })));
    flap.castShadow = true; flap.name = 'flap'; flapPivot.add(flap);
    /* 날개 뒷면은 글씨 없는 종이(앞면 글씨가 뒤집혀 비치지 않게) */
    const back = new THREE.Mesh(geo, keep(new THREE.MeshStandardMaterial({ color: '#efe3c6', roughness: 0.95, side: THREE.BackSide })));
    back.name = 'flapBack'; flap.add(back);
  }
  /* 경첩 = 날개의 아래(읽는 사람 쪽) 가장자리. 들추면 읽는 사람 쪽으로 넘어가 책 밖으로 접혀 나가므로 다른 글을 가리지 않는다. */
  function placeFlap(){ const f = hits.flap; if(!f) return;
    flapPivot.position.set(-PAGE_W + (f.x + f.w / 2) / PW * PAGE_W, 0.004, -PAGE_H / 2 + (f.y + f.h) / PH * PAGE_H); }

  /* ── 지면 위로 솟는 10칸 상자 두 개 ── */
  const inkLine = keep(new THREE.LineBasicMaterial({ color: INK }));
  const goldLine = keep(new THREE.LineBasicMaterial({ color: GOLD }));
  const paperMat = keep(new THREE.MeshStandardMaterial({ color: '#fffaf0', roughness: 0.95 }));
  const hullMat = keep(new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide }));
  const CELL = 0.148, BR = 0.05, LIFT = 0.085;
  const withEdges = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true;
    const e = new THREE.LineSegments(keep(new THREE.EdgesGeometry(geo, 25)), inkLine); m.add(e); m.userData.edges = e; return m; };
  function tray(){
    const grp = new THREE.Group(), inner = new THREE.Group(); grp.add(inner);
    const W = CELL * 5 + 0.02, D = CELL * 2 + 0.02;
    const base = withEdges(keep(new THREE.BoxGeometry(W, 0.022, D)), paperMat); base.position.y = LIFT; inner.add(base);
    const wall = (w, h, d, x, z) => { const m = withEdges(keep(new THREE.BoxGeometry(w, h, d)), paperMat); m.position.set(x, LIFT + 0.011 + h / 2, z); inner.add(m); return m; };
    wall(W, 0.045, 0.012, 0, -D / 2 + 0.006); wall(W, 0.045, 0.012, 0, D / 2 - 0.006);
    wall(0.012, 0.045, D, -W / 2 + 0.006, 0); wall(0.012, 0.045, D, W / 2 - 0.006, 0);
    for(let i = 1; i < 5; i++) wall(0.008, 0.032, D - 0.02, -W / 2 + 0.01 + i * CELL, 0);
    wall(W - 0.02, 0.032, 0.008, 0, 0);
    /* 받침: 접힌 종이 두 장 */
    for(const x of [-0.24, 0.24]){ const t = withEdges(keep(new THREE.BoxGeometry(0.006, LIFT, D * 0.62)), paperMat); t.position.set(x, LIFT / 2, 0); inner.add(t); }
    const cells = []; for(let r = 0; r < 2; r++) for(let c = 0; c < 5; c++) cells.push(new THREE.Vector3(-W / 2 + 0.01 + CELL * (c + 0.5), LIFT + 0.011 + BR, -D / 2 + 0.01 + CELL * (r + 0.5)));
    grp.userData = { inner, cells, base };
    return grp;
  }
  const beadGeo = keep(new THREE.SphereGeometry(BR, 32, 18)), hullGeo = keep(new THREE.SphereGeometry(BR * 1.13, 24, 14));
  const tealMat = keep(new THREE.MeshStandardMaterial({ color: TEAL, roughness: 0.32 }));
  const amberMat = keep(new THREE.MeshStandardMaterial({ color: AMBER, roughness: 0.3, emissive: '#5a3500', emissiveIntensity: 0.25 }));
  function bead(mat){ const m = new THREE.Mesh(beadGeo, mat); m.castShadow = true; m.add(new THREE.Mesh(hullGeo, hullMat)); return m; }
  const pop = new THREE.Group(); rightHalf.add(pop); pop.position.set(PAGE_W / 2, PIV, 0);
  const trayA = tray(), trayB = tray(); trayA.position.set(0, 0, -0.33); trayB.position.set(0, 0, 0.09);
  pop.add(trayA, trayB);
  const beadsA = [], beadsB = [];
  for(let i = 0; i < 8; i++){ const b = bead(tealMat); b.position.copy(trayA.userData.cells[i]); trayA.userData.inner.add(b); beadsA.push(b); }
  for(let i = 0; i < 7; i++){ const b = bead(amberMat); b.position.copy(trayB.userData.cells[i]); b.userData.home = i; b.name = 'amber'; trayB.userData.inner.add(b); beadsB.push(b); }

  /* 손글씨 수 표지(8 · 7 → 10 · 5) — 늘 카메라를 본다 */
  function labelSprite(){
    const c = makeCanvas(256, 256), tex = canvasTexture(c);
    const sp = new THREE.Sprite(keep(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })));
    sp.scale.set(0.2, 0.2, 1);
    sp.userData.set = (txt, color) => { const g = c.getContext('2d'); g.clearRect(0, 0, 256, 256); g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillStyle = color || INK; g.font = `400 190px ${handFont('ko')}`; g.fillText(txt, 128, 140); tex.needsUpdate = true; };
    return sp;
  }
  const labelA = labelSprite(), labelB = labelSprite();
  labelA.position.set(-0.47, LIFT + 0.12, -0.33); labelB.position.set(-0.47, LIFT + 0.12, 0.09);
  pop.add(labelA, labelB);

  /* 빛: 둥근 빛 무늬(더하기 섞기) — 날아가는 구슬의 빛과 꼬리, 10이 됐을 때의 빛 */
  const glowTex = (() => { const c = makeCanvas(128, 128), g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,236,170,1)'); gr.addColorStop(0.25, 'rgba(255,190,70,0.75)'); gr.addColorStop(1, 'rgba(255,160,40,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return canvasTexture(c); })();
  const glowMat = () => keep(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  const trail = [];
  const trayGlow = new THREE.Sprite(glowMat()); trayGlow.scale.set(1.0, 0.55, 1); trayGlow.position.set(0, LIFT + 0.05, -0.33); trayGlow.material.opacity = 0; pop.add(trayGlow);

  /* ── 카메라 틀: 어떤 화면비에서도 보고 싶은 상자가 들어오게 ── */
  const camNow = { pos: new THREE.Vector3(), tgt: new THREE.Vector3() }, camFrom = { pos: new THREE.Vector3(), tgt: new THREE.Vector3() }, camTo = { pos: new THREE.Vector3(), tgt: new THREE.Vector3() };
  let camT = 1;
  function framing(){
    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight), portrait = aspect < 0.85;
    let tx, w, d, el;
    if(!state.open){ tx = 0.5; w = 1.5; d = 1.6; el = 0.95; }
    else if(portrait && state.view !== 'spread'){ tx = state.view === 'left' ? -0.5 : 0.5; w = 1.26; d = 1.42; el = 1.28; }
    else { tx = 0; w = 2.3; d = 1.5; el = 1.05; }
    const fov = THREE.MathUtils.degToRad(camera.fov), t2 = 2 * Math.tan(fov / 2);
    const dist = Math.max(w / aspect / t2, (d * Math.sin(el) + 0.32) / t2) * 1.08;
    const tgt = new THREE.Vector3(tx, state.open ? PIV : PIV * 1.2, state.open && !(portrait && state.view !== 'spread') ? 0.03 : 0.0);
    return { tgt, pos: new THREE.Vector3(tx, tgt.y + dist * Math.sin(el), tgt.z + dist * Math.cos(el)) };
  }
  function aimCamera(instant){
    const f = framing(); camFrom.pos.copy(camNow.pos); camFrom.tgt.copy(camNow.tgt); camTo.pos.copy(f.pos); camTo.tgt.copy(f.tgt);
    if(instant || reduced){ camNow.pos.copy(f.pos); camNow.tgt.copy(f.tgt); camT = 1; } else camT = 0;
    wake();
  }

  /* ── 움직임(트윈) ── */
  const tweens = [];
  function tween(dur, fn, done){ if(reduced || dur <= 0){ fn(1); done && done(); wake(); return; } tweens.push({ t: 0, dur, fn, done }); wake(); }
  let openT = 0, popT = 0;      // 0 = 덮임/접힘, 1 = 펼침/솟음
  function applyOpen(){
    leftHalf.rotation.z = -Math.PI * (1 - smooth(openT));
    spine.scale.y = THREE.MathUtils.lerp(PIV * 2 + 0.002, 0.012, ease(clamp01(openT * 1.4)));
    spine.position.set(-0.025 * (1 - openT), spine.scale.y / 2, 0);
    for(const [i, t] of [[0, trayA], [1, trayB]]){
      const k = ease(clamp01(popT * 1.3 - i * 0.3));
      t.userData.inner.rotation.x = -(1 - k) * 1.45; t.userData.inner.scale.setScalar(0.001 + k * 0.999); t.visible = k > 0.002;
    }
    labelA.material.opacity = labelB.material.opacity = clamp01(popT * 2 - 1);
    labelA.visible = labelB.visible = popT > 0.5;
    flap.visible = openT > 0.02;
  }
  function setLabels(){ labelA.userData.set(state.moved >= 2 ? '10' : '8', state.moved >= 2 ? RUST : INK); labelB.userData.set(String(7 - state.moved)); }

  /* ── 소리(선택, 기본 꺼짐) — 짧은 종소리를 직접 만든다 ── */
  let actx = null;
  function chime(freqs, dur){
    if(!sound) return;
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); const t0 = actx.currentTime;
      freqs.forEach((f, i) => { const o = actx.createOscillator(), gn = actx.createGain(); o.type = 'sine'; o.frequency.value = f;
        gn.gain.setValueAtTime(0.0001, t0 + i * 0.07); gn.gain.exponentialRampToValueAtTime(0.18, t0 + i * 0.07 + 0.02); gn.gain.exponentialRampToValueAtTime(0.0001, t0 + i * 0.07 + dur);
        o.connect(gn).connect(actx.destination); o.start(t0 + i * 0.07); o.stop(t0 + i * 0.07 + dur + 0.05); });
    } catch(e){}
  }

  /* ── 동작 ── */
  let busy = false;
  function emit(type, extra){ onChange(Object.assign({}, state), Object.assign({ type }, extra || {})); }
  function open(){
    if(state.open || busy) return; busy = true; state.open = true; aimCamera();
    tween(1.4, k => { openT = k; applyOpen(); }, () => tween(0.9, k => { popT = k; applyOpen(); }, () => { busy = false; emit('opened'); }));
  }
  function close(){
    if(!state.open || busy) return; busy = true;
    tween(0.6, k => { popT = 1 - k; applyOpen(); }, () => { state.open = false; aimCamera(); tween(1.2, k => { openT = 1 - k; applyOpen(); }, () => { busy = false; emit('closed'); }); });
  }
  function pick(i){
    if(i < 0 || i >= T.choices.length) return; state.choice = i; drawLeft(); wake(); chime([660], 0.25);
    emit('pick', { correct: i === CORRECT_CHOICE });
  }
  function liftFlap(){
    state.flap = !state.flap; const from = flapPivot.rotation.x, to = state.flap ? 2.85 : 0;
    tween(0.75, k => { flapPivot.rotation.x = from + (to - from) * ease(k); }); chime(state.flap ? [520, 780] : [440], 0.3); emit('flap');
  }
  let flying = 0, queued = 0;   // 날아가는 동안 또 누르면 내려앉은 뒤 이어서 날린다(빠르게 두 번 눌러도 잃지 않게)
  function moveBead(){
    if(!state.open){ open(); return; }
    if(state.moved >= 2){ emit('full'); nudge(trayA); return; }
    if(flying){ if(state.moved + queued < 2) queued++; return; }
    const bd = beadsB[beadsB.length - 1 - state.moved] ;
    const slot = trayA.userData.cells[8 + state.moved];
    state.moved++; flying++;
    const start = new THREE.Vector3(), end = new THREE.Vector3();
    bd.getWorldPosition(start); trayA.userData.inner.localToWorld(end.copy(slot));
    scene.attach(bd);
    const ctrl = start.clone().add(end).multiplyScalar(0.5); ctrl.y += 0.42;
    const glow = new THREE.Sprite(glowMat()); glow.scale.set(0.26, 0.26, 1); scene.add(glow);
    let lastTrail = 0;
    tween(0.95, k => {
      const t = ease(k), a = start.clone().lerp(ctrl, t), b = ctrl.clone().lerp(end, t), p = a.lerp(b, t);
      bd.position.copy(p); glow.position.copy(p); glow.material.opacity = 0.9 * Math.sin(Math.PI * Math.min(1, k * 1.1));
      if(k - lastTrail > 0.04 && k < 0.95){ lastTrail = k; const s = new THREE.Sprite(glowMat()); s.position.copy(p); s.scale.set(0.12, 0.12, 1); s.userData.life = 0.55; scene.add(s); trail.push(s); }
    }, () => {
      trayA.userData.inner.attach(bd); bd.position.copy(slot); scene.remove(glow); glow.material.dispose(); flying--;
      tween(0.28, k => { const s = 1 + Math.sin(Math.PI * k) * 0.25; bd.scale.setScalar(s); });
      chime([880], 0.35); setLabels(); drawRight();
      emit('moved', { moved: state.moved });
      if(state.moved >= 2) success();
      else if(queued > 0){ queued--; moveBead(); }
    });
    drawRight();
  }
  function success(){
    chime([660, 880, 1320], 0.6);
    tween(1.3, k => { anim.work = k; drawLeft(); }, () => tween(0.5, k => { anim.stamp = k; drawLeft(); }));
    tween(2.6, k => { trayGlow.material.opacity = 0.45 * Math.sin(Math.PI * k);
      const e = k < 0.85 ? goldLine : inkLine; trayA.userData.inner.traverse(o => { if(o.isLineSegments) o.material = e; }); });
    emit('success');
  }
  function nudge(t){ const x0 = t.position.x; tween(0.4, k => { t.position.x = x0 + Math.sin(k * Math.PI * 4) * 0.012 * (1 - k); }); }
  function reset(){
    if(flying) return; queued = 0;
    state.choice = null; state.moved = 0; anim.work = 0; anim.stamp = 0;
    beadsB.forEach((b, i) => { trayB.userData.inner.attach(b); b.position.copy(trayB.userData.cells[i]); b.scale.setScalar(1); });
    trayA.userData.inner.traverse(o => { if(o.isLineSegments) o.material = inkLine; }); trayGlow.material.opacity = 0;
    if(state.flap){ state.flap = false; flapPivot.rotation.x = 0; }
    setLabels(); drawLeft(); drawRight(); placeFlap(); wake(); emit('reset');
  }

  /* ── 누르기: 책 · 노란 구슬 · 날개 · 예측 칸 ── */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function hitAt(cx, cy){
    const r = canvas.getBoundingClientRect(); ndc.set((cx - r.left) / r.width * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const list = ray.intersectObjects(book.children, true).filter(h => h.object.visible && !h.object.isLineSegments && !h.object.isSprite);
    for(const h of list){
      let o = h.object; while(o && !o.name && o.parent) o = o.parent;
      const name = h.object.name || (h.object.parent && h.object.parent.name) || '';
      if(!state.open) return { kind: 'book' };
      if(name === 'amber' || beadsB.includes(h.object) || beadsB.includes(h.object.parent)) return { kind: 'bead' };
      if(h.object === flap || h.object.name === 'flapBack') return { kind: 'flap' };
      if(h.object === leftPage && h.uv){
        const px = h.uv.x * PW, py = (1 - h.uv.y) * PH;
        const c = hits.choices.find(c => px >= c.x && px <= c.x + c.w && py >= c.y && py <= c.y + c.h);
        if(c) return { kind: 'choice', i: c.i };
        return null;
      }
      if(isUnder(h.object, trayB)) return { kind: 'bead' };
      if(isUnder(h.object, trayA) && state.moved >= 2) return { kind: 'full' };
      return null;
    }
    return null;
  }
  const isUnder = (o, root) => { for(let p = o; p; p = p.parent) if(p === root) return true; return false; };
  let down = null;
  const onDown = e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; };
  const onUp = e => {
    if(!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null; if(moved > 10) return;
    const h = hitAt(e.clientX, e.clientY); if(!h) return;
    if(h.kind === 'book') open(); else if(h.kind === 'bead') moveBead(); else if(h.kind === 'flap') liftFlap(); else if(h.kind === 'choice') pick(h.i); else if(h.kind === 'full'){ emit('full'); nudge(trayA); }
  };
  let hoverRaf = 0;
  const onMove = e => { if(hoverRaf) return; hoverRaf = requestAnimationFrame(() => { hoverRaf = 0; canvas.style.cursor = hitAt(e.clientX, e.clientY) ? 'pointer' : 'default'; }); };
  canvas.addEventListener('pointerdown', onDown); canvas.addEventListener('pointerup', onUp); canvas.addEventListener('pointermove', onMove);

  /* ── 크기 · 그리기 고리(움직일 때만 그린다) ── */
  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight; if(!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); aimCamera(true);
  }
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  let raf = 0, last = performance.now(), idleFrames = 0, disposed = false;
  function wake(){ idleFrames = 0; if(!raf && !disposed) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function frame(now){
    /* 시간은 벽시계로 — 느린 기기에서도 펼침·날아가기가 정해진 초 안에 끝난다(과학 탐구 랩 규칙과 같음) */
    raf = 0; const dt = Math.min(0.25, (now - last) / 1000); last = now;
    for(let i = tweens.length - 1; i >= 0; i--){ const tw = tweens[i]; tw.t += dt; const k = clamp01(tw.t / tw.dur); tw.fn(k); if(k >= 1){ tweens.splice(i, 1); tw.done && tw.done(); } }
    for(let i = trail.length - 1; i >= 0; i--){ const s = trail[i]; s.userData.life -= dt; s.material.opacity = Math.max(0, s.userData.life / 0.55) * 0.7; s.scale.setScalar(0.12 * (0.5 + s.userData.life)); if(s.userData.life <= 0){ scene.remove(s); s.material.dispose(); trail.splice(i, 1); } }
    if(camT < 1){ camT = Math.min(1, camT + dt / 1.4); const k = smooth(camT); camNow.pos.lerpVectors(camFrom.pos, camTo.pos, k); camNow.tgt.lerpVectors(camFrom.tgt, camTo.tgt, k); }
    camera.position.copy(camNow.pos); camera.lookAt(camNow.tgt);
    renderer.render(scene, camera);
    const active = tweens.length || trail.length || camT < 1 || flying;
    if(active) idleFrames = 0; else idleFrames++;
    if(idleFrames < 3 && !document.hidden) raf = requestAnimationFrame(frame);
  }
  const onVis = () => { if(!document.hidden) wake(); };
  document.addEventListener('visibilitychange', onVis);

  /* ── 처음 모습 ── */
  drawLeft(); drawRight(); drawFlap(); placeFlap(); setLabels();
  openT = 0; popT = 0; applyOpen();
  const f0 = framing(); camNow.pos.copy(f0.pos); camNow.tgt.copy(f0.tgt); resize();
  if(opts.startOpen){ state.open = true; openT = 1; popT = 1; applyOpen(); aimCamera(true); }
  wake();

  return {
    get state(){ return Object.assign({}, state); },
    get busy(){ return flying > 0 || tweens.length > 0 || queued > 0; },
    open, close, reset, moveBead, liftFlap, pick,
    setView(v){ state.view = v; aimCamera(); },
    setReduced(v){ reduced = !!v; },
    setSound(v){ sound = !!v; },
    render(){ wake(); },
    get _debug(){ return { scene, renderer, sun, camera }; },   // 검사·문제 찾기용
    /* 검사용: 이름으로 찾은 물건(노란 구슬 · 날개)의 화면 좌표 */
    _hit(x, y){ return hitAt(x, y); },
    _screenOf(kind){
      const o = kind === 'flap' ? flap : beadsB[beadsB.length - 1 - state.moved];
      if(!o) return null; const v = new THREE.Vector3(); o.getWorldPosition(v);
      if(kind === 'flap'){ const bb = new THREE.Box3().setFromObject(flap); bb.getCenter(v); }
      v.project(camera); const r = canvas.getBoundingClientRect();
      return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
    },
    dispose(){ disposed = true; cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerdown', onDown); canvas.removeEventListener('pointerup', onUp); canvas.removeEventListener('pointermove', onMove);
      disposables.forEach(d => d.dispose && d.dispose()); renderer.dispose(); }
  };
}
