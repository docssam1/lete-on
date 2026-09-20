// 지필드 사이언스 랩 — 광고용 체험 페이지.
// 표지(로드맵이 그려진 책) → 넘기면 교재 소개 장들 → "다음 장부터 살아 움직여요" → 실제 교재 쪽(영상·3D 실험실·빈칸·채점이 살아 있음) → 뒤표지 상담.
// 넘길 때마다 docssam이 말하고(유료 TTS 밝은 남자 목소리 MP3, 없으면 기기 음성), 책장은 3D로 넘어간다.
import { renderChapter, fitPages } from '../v2/book.js';
import { wireLive } from '../v2/live.js';
import { mount3D, mountLabOf } from '../v2/mounts.js';
import { SEMS, READY } from '../v2/units-index.js';

const A = '../assets/';
const SUPA = 'https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio/science-lab/';
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const CH = {
  's41-u03b': { book: () => import('../data/book/s41-u03b.book.js'), lesson: () => import('../data/units/s41-u03b.lesson.js') },
  's41-u03': { book: () => import('../data/book/s41-u03.book.js'), lesson: () => import('../data/units/s41-u03.lesson.js') },
};
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s) => document.querySelector(s);

// ── docssam 안내 ──
const FACE = { half: 'face-A2-mouth-half.webp', open: 'face-A3-mouth-open.webp', o: 'face-A4-mouth-o.webp' };
const mouthFor = (ch) => { const c = ch.charCodeAt(0) - 0xac00; if (c < 0 || c > 11171) return null; const j = Math.floor(c / 28) % 21; return [0, 2, 4, 6, 9, 14].includes(j) ? 'open' : [8, 12, 13, 17].includes(j) ? 'o' : 'half'; };
let NAR = { voice: '', lines: [] }, soundOn = true, sayToken = 0, audio = null;
const guide = $('.it-guide'), $p = guide.querySelector('.it-bubble p');
guide.insertAdjacentHTML('afterbegin', '<div class="it-char"><img class="b" src="' + A + 'docssam-A1-mouth-closed.webp" alt="독쌀"><img class="f" alt=""></div>');
guide.querySelector('.it-guide-img').remove();
const $face = guide.querySelector('.it-char .f');
async function urlOf(line) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(`${NAR.voice}|${line.text}`));
  return `${SUPA}${line.id}-${[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 10)}.mp3`;
}
function speakDevice(text) {
  if (!('speechSynthesis' in window)) return 0;
  try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'ko-KR'; u.rate = 1.05; u.pitch = 1.1;
    const v = speechSynthesis.getVoices().filter((x) => /^ko/i.test(x.lang)); u.voice = v.find((x) => /InJoon|Male|남/i.test(x.name)) || v[0] || null; speechSynthesis.speak(u); } catch { /* 음성 없음 */ }
  return 1;
}
async function say(ids) {
  const my = ++sayToken; guide.classList.remove('min');
  for (const id of [].concat(ids)) {
    const line = NAR.lines.find((l) => l.id === id); if (!line) continue;
    if (my !== sayToken) return;
    try { audio?.pause(); speechSynthesis?.cancel(); } catch { /* */ }
    if (soundOn) {
      audio = new Audio(await urlOf(line)); audio.preload = 'auto';
      audio.play().catch(() => { if (my === sayToken && soundOn) speakDevice(line.text); });
    }
    guide.classList.add('talk'); $p.textContent = '';
    for (const ch of line.text) {
      if (my !== sayToken) return;
      $p.textContent += ch; const m = REDUCED ? null : mouthFor(ch);
      if (m) { $face.src = A + FACE[m]; $face.style.display = 'block'; } else $face.style.display = 'none';
      await new Promise((r) => setTimeout(r, m ? 70 : 110));
    }
    $face.style.display = 'none'; guide.classList.remove('talk');
    await new Promise((r) => setTimeout(r, 900));
  }
}
guide.querySelector('.it-sound').addEventListener('click', (e) => { soundOn = !soundOn; e.currentTarget.setAttribute('aria-pressed', soundOn); e.currentTarget.textContent = soundOn ? '소리 켬' : '소리 끕'; if (!soundOn) { try { audio?.pause(); speechSynthesis?.cancel(); } catch { /* */ } } });
guide.querySelector('.it-hide').addEventListener('click', () => guide.classList.toggle('min'));
guide.querySelector('.it-char').addEventListener('click', () => guide.classList.remove('min'));

// ── 로드맵 데이터 ──
const readySems = new Set(Object.keys(READY).filter((k) => !READY[k].hidden).map((k) => `${k[1]}-${k[2]}`));
const road = () => SEMS.map((s) => ({ sem: s.sem, units: s.units.map((u) => ({ ...u, ready: !!READY[u.id] && !READY[u.id].hidden, hero: READY[u.id]?.labs?.map((l) => l.hero).join(' · ') || READY[u.id]?.hero })) }));

// ── 광고 쪽들(교재와 같은 A4 틀) — 두꺼운 마법서: 가죽 표지·금박·양피지 ──
const adPage = (cls, body) => `<section class="bk-page ad-page ${cls}">${body}</section>`;
const GOLD = `<defs><linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a5418"/><stop offset=".35" stop-color="#f3d48a"/><stop offset=".5" stop-color="#fff2c4"/><stop offset=".65" stop-color="#d9a441"/><stop offset="1" stop-color="#6b4712"/>
  <animate attributeName="x1" values="-1;1;-1" dur="7s" repeatCount="indefinite"/><animate attributeName="x2" values="0;2;0" dur="7s" repeatCount="indefinite"/></linearGradient>
  <radialGradient id="glow"><stop offset="0" stop-color="#ffcf73" stop-opacity=".95"/><stop offset=".4" stop-color="#ff8a3d" stop-opacity=".45"/><stop offset="1" stop-color="#ff8a3d" stop-opacity="0"/></radialGradient>
  <filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
// 모서리 덩쿽 장식(왼쪽 위 기준, 돌려서 네 모서리에)
const CORNER = '<path d="M0 0 C18 2 26 10 28 28 M0 0 C2 18 10 26 28 28 M6 6 C14 7 20 12 21 21 M6 6 C7 14 12 20 21 21 M28 28 c4 -6 10 -6 12 -2 c2 4 -2 8 -6 6 M28 28 c-6 4 -6 10 -2 12 c4 2 8 -2 6 -6" fill="none" stroke="url(#gd)" stroke-width="1"/><circle cx="28" cy="28" r="1.8" fill="url(#gd)"/>';
const corners = (w, h, m) => [[m, m, 0], [w - m, m, 90], [w - m, h - m, 180], [m, h - m, 270]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(.78)">${CORNER}</g>`).join('');
function coverPage() {
  // 로드맵 = 별자리: 3-1 → 6-2 여덟 학기가 원 안에서 별로 이어진다(체험 가능한 학기는 불이 켜짐)
  const cx = 105, cy = 184, R = 48;
  const pts = SEMS.map((_, i) => { const a = -Math.PI / 2 + (i / SEMS.length) * Math.PI * 2 + 0.25; const r = R * (i % 2 ? 0.62 : 0.86); return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const stars = SEMS.map((s, i) => { const [x, y] = pts[i], on = readySems.has(s.sem); return `<g class="st ${on ? 'on' : ''}" style="animation-delay:${(i * 0.37).toFixed(2)}s">${on ? `<circle cx="${x}" cy="${y}" r="7" fill="url(#glow)"/>` : ''}<path d="M${x} ${y - 3.2} L${x + .9} ${y - .9} L${x + 3.2} ${y} L${x + .9} ${y + .9} L${x} ${y + 3.2} L${x - .9} ${y + .9} L${x - 3.2} ${y} L${x - .9} ${y - .9}Z" fill="${on ? '#ffe7a8' : 'url(#gd)'}"/><text x="${x}" y="${y + (y < cy ? -5 : 8)}" text-anchor="middle">${s.sem}</text></g>`; }).join('');
  const ring = (r, txt, cls) => `<path id="rg${r}" d="M${cx} ${cy - r} a${r} ${r} 0 1 1 -0.01 0" fill="none"/><g class="${cls}"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="url(#gd)" stroke-width=".5"/><text class="rune"><textPath href="#rg${r}">${txt}</textPath></text></g>`;
  return adPage('cover', `<svg class="cv" viewBox="0 0 210 297" aria-label="GFIELD 실험 과학 영재 표지">${GOLD}
    <rect x="9" y="9" width="192" height="279" rx="3" fill="none" stroke="url(#gd)" stroke-width="1.2"/><rect x="13" y="13" width="184" height="271" rx="2" fill="none" stroke="url(#gd)" stroke-width=".4"/>${corners(210, 297, 13)}
    <text class="cv-en" x="105" y="40" text-anchor="middle">GFIELD GIFTED EDUCATION</text>
    <path d="M66 51 H144" stroke="url(#gd)" stroke-width=".5"/><path d="M98 51 l7 -3 l7 3 l-7 3z" fill="url(#gd)"/>
    <text class="cv-t1" x="105" y="74" text-anchor="middle">SCIENCE</text><text class="cv-t2" x="105" y="99" text-anchor="middle">LAB</text>
    <text class="cv-motto" x="105" y="110" text-anchor="middle">EXPERIMENT · DISCOVER · MASTER</text>
    <text class="cv-sub" x="105" y="119" text-anchor="middle">실험 과학 영재 · 읽고 보고 직접 해 보는 교과 실험서</text>
    <g class="cv-emblem" filter="url(#gl)">
      <circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="url(#glow)" opacity=".18" class="cv-halo"/>
      ${ring(R + 10, 'OBSERVE · PREDICT · EXPERIMENT · RECORD · CONCLUDE · DISCOVER · OBSERVE · PREDICT ·', 'r1')}
      ${ring(R + 3, '관찰 · 예상 · 계획 · 실험 · 기록 · 결론 · 탐구 · 관찰 · 예상 · 계획 · 실험 · 기록 · 결론 ·', 'r2')}
      <path class="cv-line" d="${line}" fill="none" stroke="#ffd98a" stroke-width=".7" stroke-dasharray="2 1.5"/>${stars}
      <g class="cv-flask" transform="translate(${cx} ${cy})"><path d="M-4 -12 h8 M-3 -12 v8 l-8 13 a3 3 0 0 0 3 4 h16 a3 3 0 0 0 3 -4 l-8 -13 v-8" fill="none" stroke="url(#gd)" stroke-width="1.1"/><path d="M-7.5 3 h15 l3.4 5.6 a2 2 0 0 1 -1.8 3 h-18.2 a2 2 0 0 1 -1.8 -3z" fill="#ff8a3d" opacity=".75"/><circle cx="-2" cy="6" r="1" fill="#fff3c4"/><circle cx="2.5" cy="8" r=".7" fill="#fff3c4"/></g>
    </g>
    <text class="cv-road" x="105" y="252" text-anchor="middle">3학년에서 6학년까지 · 여덟 학기의 탐구 여정</text>
    <text class="cv-brand" x="105" y="272" text-anchor="middle">GFIELD SCIENCE LAB</text>
  </svg><div class="cv-tap">책장을 넘겨 보세요</div>`);
}
const orn = '<div class="orn"><svg viewBox="0 0 120 10"><path d="M0 5 H48 M72 5 H120" stroke="#b8872b" stroke-width=".8"/><path d="M60 0 l6 5 l-6 5 l-6 -5z M50 5 a2 2 0 1 0 0 .01 M70 5 a2 2 0 1 0 0 .01" fill="#b8872b"/></svg></div>';
const chap = (k, h) => `<p class="ad-k">${k}</p><h2>${h}</h2>${orn}`;
const ads = () => [
  adPage('ad a1', `${chap('PROLOGUE · 이 책에 대하여', '이런 과학책,<br>본 적 있나요?')}
    <p class="drop">과학은 외우는 것이 아니라 직접 해 보는 것입니다. 이 책은 교과서 단원마다 실험 한 장을 담고, 화면에서 펼치면 그 실험이 깨어나 아이의 손끕에서 다시 일어납니다.</p>
    <ol class="ad-3"><li><b>읽고</b><span>교과서 단원에 딱 맞춘 개념과 실험 설계</span></li><li><b>보고</b><span>실제 화산·용암 영상과 사진, 땅속까지 보이는 3D</span></li><li><b>해 보고</b><span>불을 켜고, 가열하고, 식혀 보는 3D 체험 실험실</span></li></ol>`),
  adPage('ad a2', `${chap('CHAPTER Ⅰ · 탐구의 지도', '여덟 학기, 단원마다<br>실험 한 장')}
    <div class="ad-road">${road().map((s) => `<div class="ad-sem ${readySems.has(s.sem) ? 'on' : ''}"><b>${s.sem}</b><ul>${s.units.map((u) => `<li class="${u.ready ? 'on' : ''}">${esc(u.title)}${u.ready ? `<small>✦ ${esc(u.hero)}</small>` : ''}</li>`).join('')}</ul></div>`).join('')}</div>
    <p class="ad-note">✦ 표시된 단원은 지금 바로 펼쳐 볼 수 있습니다</p>`),
  adPage('ad a3', `${chap('CHAPTER Ⅱ · 한 장의 비밀', '영재원 탐구 방식,<br>그대로 한 장에')}
    <ol class="ad-flow">${['생각 열기 — 경험에서 질문을 찾는다', '예상하기 — “~할수록 ~할 것이다”', '계획하기 — 바꿀 조건은 오직 하나', '실험하기 — 단계별 그림과 3D 실험실', '기록과 결론 — 표에 적고 내 말로', '개념 한눈에 — 빈칸으로 정리한다', '상상 실험실 · 토론 — 생각을 넓힌다', '영재 도전 — 유창성 · 융통성 · 독창성', '교과서 점검 — 단원평가 유형으로'].map((t, i) => `<li><span>${'ⅠⅡⅢⅣⅤⅥⅦⅧⅨ'[i]}</span>${esc(t)}</li>`).join('')}</ol>`),
  adPage('ad a4', `${chap('CHAPTER Ⅲ · 네 개의 열쇠', '한 권으로 네 가지 수업')}
    <div class="ad-4"><div><b>학생용 교재</b><span>빈칸과 쓰는 줄. A4 그대로 인쇄</span></div><div><b>강사용 교재</b><span>같은 자리에 붉은 예시 답과 채점 기준</span></div><div><b>가르치기 화면</b><span>누를 때마다 답이 열리는 90분 교안</span></div><div><b>스스로 공부</b><span>써 보고 예시 답 확인, 문제는 바로 채점</span></div></div>
    <figure class="ad-photo"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Augustine_volcano_Jan_24_2006_-_Cyrus_Read.jpg/1280px-Augustine_volcano_Jan_24_2006_-_Cyrus_Read.jpg" alt="화산 분출 사진"><figcaption>책 속의 실제 기록 · Cyrus Read, USGS (Public domain)</figcaption></figure>`),
  adPage('ad a5', `${chap('UNSEAL · 봉인 해제', '다음 장부터<br><em>책이 깨어납니다</em>')}
    <ul class="ad-how"><li><i>▶</i><span>그림 속 <b>영상</b> — 실제 화산이 책 안에서 타오릅니다</span></li><li><i>✦</i><span>주황 인장 — <b>3D 실험실</b>이 책 밖으로 솟아오릅니다</span></li><li><i>ⓐ</i><span><b>빈칸</b>을 누르면 답이 드러납니다</span></li><li><i>Ⅰ</i><span>확인 문제는 누르면 <b>바로 채점</b></span></li><li><i>⤢</i><span>사진을 누르면 <b>크게</b></span></li></ul>
    <svg class="seal" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#8b1e1e"/><circle cx="50" cy="50" r="33" fill="none" stroke="#c9463a" stroke-width="2"/><text x="50" y="47" text-anchor="middle" fill="#f3d48a" font-size="11" font-weight="800">GFIELD</text><text x="50" y="62" text-anchor="middle" fill="#f3d48a" font-size="9">SCIENCE LAB</text></svg>`),
];
const backPage = () => adPage('back', `<svg class="cv" viewBox="0 0 210 297" aria-hidden="true">${GOLD}<rect x="9" y="9" width="192" height="279" rx="3" fill="none" stroke="url(#gd)" stroke-width="1.2"/>${corners(210, 297, 13)}</svg>
  <div class="bc-in"><p class="bc-k">GFIELD SCIENCE LAB</p><h2>우리 아이 과학,<br>읽고 보고 직접 해 보는 책으로</h2>
  <p>교과서 단원마다 실험 한 장 · 실제 영상과 3D 체험 실험실<br>A4 인쇄 교재 · 수업 화면까지 한 권에</p>
  <div class="bc-btns"><a href="https://open.kakao.com/me/gfield" target="_blank" rel="noopener">카카오톡 상담</a><a class="ghost" href="tel:02-3453-7772">02-3453-7772</a></div>
  <p class="bc-addr">지필드 영재교육 · 서울시 강남구 역삼로 460-2 4층</p></div>`);

// ── 책 만들기 ──
let state = { ch: 's41-u03b', teacher: false, pages: [], spread: 0, single: false, leaves: [], built: null };
const book = $('.it-book'), wrapEl = $('.it-book-wrap');
async function build() {
  $('.it-loading').hidden = false;
  const [bm, lm] = await Promise.all([CH[state.ch].book(), CH[state.ch].lesson()]);
  const simMod = await import('../data/units/s41-u03.similar.js');
  const html = renderChapter(bm.chapter, bm.art, simMod.similar, { teacher: state.teacher, live: true, media: bm.media });
  // 쪽 맞춤은 실제 A4 크기에서 한 번 하고, 쪽마다 따로 떼어 책장에 붙인다.
  const host = document.createElement('div'); host.className = 'it-measure'; host.innerHTML = html; document.body.appendChild(host);
  const bk = host.querySelector('.bk'); bk.classList.add('a4');
  const adHost = document.createElement('div'); adHost.className = bk.className; adHost.setAttribute('style', bk.getAttribute('style'));
  adHost.innerHTML = coverPage() + ads().join('') + backPage(); host.appendChild(adHost);
  await document.fonts?.ready; fitPages(bk);
  const wrapPage = (sec, from) => { const w = document.createElement('div'); w.className = from.className; w.setAttribute('style', from.getAttribute('style')); w.appendChild(sec); return w; };
  const adSecs = [...adHost.children], chSecs = [...bk.children];
  state.pages = [adSecs[0], ...adSecs.slice(1, 6), ...chSecs, adSecs[6]].map((s, i) => wrapPage(s, i < 6 || i === 6 + chSecs.length ? adHost : bk));
  state.chCount = chSecs.length; host.remove();
  state.L = lm.lesson; state.rows = [];
  layout(true);
  wireLive(book, {
    scene: (el) => mount3D(el, state.L.engage.scene, { autoplay: true }),
    lab: (el) => mountLabOf(state.L.explore.lab.kind)(el, { ...state.L.explore.lab, rows: state.rows, onRecord: (rows) => { state.rows = rows; } }),
  });
  $('.it-loading').hidden = true;
}

// 책장: 넓은 화면은 두 쪽 펼침(오른쪽 반에 겹친 장이 왼쪽으로 넘어감), 좁은 화면은 한 쪽씩
function layout(rebuild = false) {
  const single = innerWidth < 760;
  const availH = Math.max(320, innerHeight - (single ? 260 : 240)), availW = innerWidth - (single ? 24 : 150);
  const pw = Math.floor(Math.min(single ? availW : availW / 2, availH * 210 / 297)), ph = Math.round(pw * 297 / 210);
  book.style.setProperty('--pw', pw + 'px'); book.style.setProperty('--ph', ph + 'px'); book.style.setProperty('--k', (pw / 793.7).toFixed(4));
  if (rebuild || single !== state.single) {
    state.single = single; book.classList.toggle('single', single); book.innerHTML = '';
    const P = state.pages;
    const faces = single ? P.map((p) => [p, null]) : Array.from({ length: Math.ceil(P.length / 2) }, (_, i) => [P[2 * i], P[2 * i + 1] || null]);
    book.insertAdjacentHTML('beforeend', '<div class="tl"></div>');
    state.leaves = faces.map(([f, b], i) => {
      const leaf = document.createElement('div'); leaf.className = 'leaf';
      leaf.innerHTML = '<div class="face front"><div class="sc"></div></div><div class="face back"><div class="sc"></div></div>';
      leaf.querySelector('.front .sc').appendChild(f); if (b) leaf.querySelector('.back .sc').appendChild(b); else leaf.querySelector('.back').classList.add('blank');
      book.appendChild(leaf); return leaf;
    });
    const max = state.leaves.length;
    if (state.spread > max) state.spread = max;
    paint(false);
  }
}
function paint(anim = true, dir = 1) {
  const n = state.leaves.length, s = state.spread;
  state.leaves.forEach((leaf, i) => {
    const flipped = i < s;
    leaf.classList.toggle('flipped', flipped);
    leaf.style.zIndex = flipped ? i + 1 : n - i;
    leaf.style.transition = anim && !REDUCED ? '' : 'none';
    leaf.querySelectorAll('.face').forEach((f) => f.setAttribute('aria-hidden', 'true'));
  });
  if (anim) { const t = state.leaves[dir > 0 ? s - 1 : s]; if (t) { t.style.zIndex = n + 2; setTimeout(() => { t.style.zIndex = t.classList.contains('flipped') ? state.leaves.indexOf(t) + 1 : n - state.leaves.indexOf(t); }, 900); } }
  // 표지만 보일 땐 책을 가운데로, 마지막(뒤표지 왼쪽만)도 가운데로
  const shift = state.single ? 0 : s === 0 ? -0.5 : s === n ? 0.5 : 0;
  book.style.transform = s === 0 ? '' : `translateX(calc(var(--pw) * ${shift}))`;
  book.classList.toggle('closed', s === 0);
  const done = state.single ? 0 : s / n;   // 넘긴 만큼 왼쪽 책장 두께가 두껍어진다
  book.style.setProperty('--tl', `${(4 + 16 * done).toFixed(1)}px`); book.style.setProperty('--tr', `${(4 + 16 * (1 - done)).toFixed(1)}px`);
  const P = state.pages.length, first = state.single ? s + 1 : s * 2, lastI = state.single ? s + 1 : Math.min(P, s * 2 + 1);
  $('.it-count').textContent = s === 0 ? '표지' : state.single || first === lastI ? `${first} / ${P}` : `${first}–${lastI} / ${P}`;
  $('.it-arrow.prev').disabled = s === 0; $('.it-arrow.next').disabled = s >= n - (state.single ? 1 : 0);
  narrate();
}
// 두꺼운 마법서 책장 소리(WebAudio로 합성: 종이 스치는 소리 + 표지는 묵직한 울림)
let AC = null;
function turnSound(heavy) {
  if (!soundOn) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)(); const t = AC.currentTime, len = heavy ? 0.9 : 0.55;
    const buf = AC.createBuffer(1, AC.sampleRate * len, AC.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) { const x = i / d.length; d[i] = (Math.random() * 2 - 1) * Math.pow(Math.sin(Math.PI * x), 1.6) * (0.6 + 0.4 * Math.sin(x * 40)); }
    const src = AC.createBufferSource(); src.buffer = buf;
    const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.8; bp.frequency.setValueAtTime(heavy ? 900 : 2600, t); bp.frequency.exponentialRampToValueAtTime(heavy ? 250 : 700, t + len);
    const g = AC.createGain(); g.gain.value = heavy ? 0.5 : 0.32; src.connect(bp).connect(g).connect(AC.destination); src.start(t);
    if (heavy) { const o = AC.createOscillator(), og = AC.createGain(); o.frequency.setValueAtTime(90, t + 0.55); o.frequency.exponentialRampToValueAtTime(40, t + 0.9); og.gain.setValueAtTime(0.0001, t + 0.5); og.gain.exponentialRampToValueAtTime(0.5, t + 0.58); og.gain.exponentialRampToValueAtTime(0.0001, t + 1.1); o.connect(og).connect(AC.destination); o.start(t + 0.5); o.stop(t + 1.2); }
  } catch { /* 소리 없음 */ }
}
// 지금 보이는 쪽에 맞춰 docssam이 말한다
function visiblePages() { const s = state.spread; return state.single ? [s] : [2 * s - 1, 2 * s].filter((i) => i >= 0); }
function narrate() {
  const vis = visiblePages(), c0 = 6, cn = state.chCount, rel = (i) => i - c0 + 1;   // 교재 쪽 번호(1~)
  const ids = [];
  for (const i of vis) {
    if (i === 0) ids.push('cover'); else if (i === 1) ids.push('ad1'); else if (i === 2) ids.push('ad2'); else if (i === 3 || i === 4) { if (!ids.includes('ad3')) ids.push('ad3'); }
    else if (i === 5) ids.push('live');
    else if (i >= c0 && i < c0 + cn) { const r = rel(i); const k = r === 1 ? 'live' : r <= 4 ? 'steps' : r === 5 ? 'results' : r <= 7 ? 'concept' : r === 8 ? 'gifted' : 'check'; if (!ids.includes(k)) ids.push(k); }
    else ids.push('print', 'cta');
  }
  const key = ids.join(','); if (key === state.said) return; state.said = key; say(ids);
}
function go(d) {
  const n = state.leaves.length, max = state.single ? n - 1 : n, s = Math.max(0, Math.min(max, state.spread + d));
  if (s === state.spread) return; const heavy = (d > 0 && state.spread === 0) || (d < 0 && s === 0);
  state.spread = s; paint(true, d); turnSound(heavy);
  const t = state.leaves[d > 0 ? s - 1 : s]; if (t) { t.classList.add('turning'); setTimeout(() => t.classList.remove('turning'), 1300); }
  document.querySelector('.bk-pop-wrap')?.__close?.();
}
$('.it-arrow.next').addEventListener('click', () => go(1));
$('.it-arrow.prev').addEventListener('click', () => go(-1));
addEventListener('keydown', (e) => { if (document.querySelector('.bk-pop-wrap') || /INPUT|TEXTAREA/.test(e.target.tagName)) return; if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); });
// 책장 모서리를 누르거나 밀어서 넘기기
let sx = null;
wrapEl.addEventListener('pointerdown', (e) => { if (e.target.closest('button,a,video,.bk-blank,.bk-choices li,img')) return; sx = e.clientX; });
wrapEl.addEventListener('pointerup', (e) => {
  if (sx == null) return; const dx = e.clientX - sx; sx = null;
  if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); return; }
  const r = book.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
  if (state.spread === 0 || x > 0.88) go(1); else if (x < 0.12) go(-1);
});
let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => layout(false), 150); });
document.querySelectorAll('[data-ch]').forEach((b) => b.addEventListener('click', async () => {
  if (state.ch === b.dataset.ch) return; state.ch = b.dataset.ch; document.querySelectorAll('[data-ch]').forEach((x) => x.setAttribute('aria-pressed', x === b));
  $('.it-print').href = `../v2/#/${state.ch}/lab-book/${state.teacher ? 'teacher' : 'student'}`; state.spread = Math.min(state.spread, 3); state.said = ''; await build();
}));
document.querySelectorAll('[data-t]').forEach((b) => b.addEventListener('click', async () => {
  const t = b.dataset.t === '1'; if (t === state.teacher) return; state.teacher = t; document.querySelectorAll('[data-t]').forEach((x) => x.setAttribute('aria-pressed', x === b));
  $('.it-print').href = `../v2/#/${state.ch}/lab-book/${t ? 'teacher' : 'student'}`; await build();
}));

// ── 살아 있는 표지: 닫혀 있을 땐 마우스를 따라 책이 살짝 기울고, 배경에는 불씨가 떠오른다 ──
const tilt = (e) => {
  if (state.spread !== 0 || REDUCED) { book.style.removeProperty('--rx'); book.style.removeProperty('--ry'); return; }
  const r = wrapEl.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  book.style.setProperty('--ry', `${(x * 14).toFixed(2)}deg`); book.style.setProperty('--rx', `${(-y * 10).toFixed(2)}deg`);
};
addEventListener('pointermove', tilt);
(function embers() {
  if (REDUCED) return;
  const c = document.createElement('canvas'); c.className = 'it-embers'; document.body.prepend(c);
  const g = c.getContext('2d'); let W, H, P = [];
  const size = () => { W = c.width = innerWidth; H = c.height = innerHeight; P = Array.from({ length: Math.round(W / 22) }, () => spawn(true)); };
  const spawn = (any) => ({ x: Math.random() * W, y: any ? Math.random() * H : H + 10, r: 0.6 + Math.random() * 1.8, v: 8 + Math.random() * 22, w: Math.random() * 6.28, a: 0.25 + Math.random() * 0.6, gold: Math.random() < 0.7 });
  addEventListener('resize', size); size(); let last = performance.now();
  (function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; g.clearRect(0, 0, W, H);
    for (const p of P) {
      p.y -= p.v * dt; p.w += dt * 1.3; p.x += Math.sin(p.w) * 0.25; if (p.y < -10) Object.assign(p, spawn(false));
      const tw = p.a * (0.55 + 0.45 * Math.sin(p.w * 3)); g.beginPath(); g.fillStyle = p.gold ? `rgba(255,200,110,${tw})` : `rgba(255,120,60,${tw})`;
      g.shadowColor = p.gold ? '#ffcf73' : '#ff6a2a'; g.shadowBlur = 8; g.arc(p.x, p.y, p.r, 0, 6.283); g.fill();
    }
    requestAnimationFrame(loop);
  })(last);
})();

// ── 아래 로드맵 섹션 ──
$('.it-road').innerHTML = road().map((s) => `<div class="rd-sem ${readySems.has(s.sem) ? 'on' : ''}"><h3>${s.sem}</h3><ul>${s.units.map((u) => u.ready ? `<li class="on"><a href="../v2/#/${u.id}/1" target="_blank" rel="noopener">${esc(u.title)}<small>${esc(u.hero)}</small></a></li>` : `<li>${esc(u.title)}<small>준비 중</small></li>`).join('')}</ul></div>`).join('');

// ── 시작 ──
(async () => {
  try { NAR = await (await fetch('./narration.json')).json(); } catch { /* 나레이션 없음 */ }
  await build();
  // 첫 인사는 소리 없이 글만(브라우저 자동 재생 정책) — 첫 조작부터 소리
  const quiet = soundOn; soundOn = false; state.said = ''; narrate(); soundOn = quiet;
})();
