// docssam 안내 — 화면 구석의 **작은 말풍선**(스스로 공부하기·학생용 교재·읽을거리). 가르치기·교사용에는 쓰지 않는다.
//  · 목소리: 광고와 같은 docssam 음성 MP3(data/voice/*.voice.json → scripts/generate-audio.js → Supabase).
//    파일이 없거나 재생이 막히면 **자막만** 보여 준다(기기 음성으로 바꿔 읽지 않고, 음성이 있다고 표시하지도 않는다).
//  · 표정: 승인된 전신 그림 5장(A1 기본·B1 놀람·B2 생각·B3 칭찬·B4 격려)을 겹쳐 두고 **한 장만** 보인다(통째로 바꿔 끼우기).
//    입 모양 겹그림(A2 반·A3 벌림·A4 오·A5 눈 감음)은 A1 위에만 얹는다 — 얼굴을 새로 그리지 않는다.
//  · 입은 **실제 오디오가 재생되는 동안에만**(playing~pause/ended) 재생 위치의 글자 모음에 맞춰 움직인다.
//  · 움직임은 CSS transform(guide.css): 가만히 흔들림 · 말할 때 끄덕이며 기울기 · 칭찬 깡충 · 생각 기울기 · 놀람 움찔 · 격려 끄덕.
//    prefers-reduced-motion이면 움직이지 않고 표정만 바뀐다.
//  · 자리: 화면 아래 구석(왼쪽/오른쪽) 중 내용을 덜 가리는 쪽에 앉고, 어디든 가리면 스스로 접혀 얼굴만 남는다.
//    휴대폰은 아래쪽 얇은 띠(작은 얼굴 + 1~2줄).
const SUPA = 'https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio/science-lab/';
const A = new URL('../assets/', import.meta.url).href;
const BODY = { A1: 'docssam-A1-mouth-closed.webp', B1: 'docssam-B1-surprised.webp', B2: 'docssam-B2-thinking.webp', B3: 'docssam-B3-praise.webp', B4: 'docssam-B4-encourage.webp' };
const FACE = { half: 'face-A2-mouth-half.webp', open: 'face-A3-mouth-open.webp', o: 'face-A4-mouth-o.webp', blink: 'face-A5-eyes-closed.webp' };
// 상황 → 그림
export const MOODS = { listen: 'A1', explain: 'A1', think: 'B2', surprise: 'B1', praise: 'B3', encourage: 'B4' };
const LABEL = { listen: '듣는', explain: '설명하는', think: '생각하는', surprise: '놀란', praise: '칭찬하는', encourage: '격려하는' };
const reducedQ = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function mouthFor(ch) {
  const c = (ch || ' ').charCodeAt(0) - 0xac00; if (c < 0 || c > 11171) return null;
  const j = Math.floor(c / 28) % 21;
  return [0, 2, 4, 6, 9, 14].includes(j) ? 'open' : [8, 12, 13, 17].includes(j) ? 'o' : 'half';
}
async function urlOf(voice, id, text) {
  const buf = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(`${voice}|${text}`));
  return `${SUPA}${id}-${[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 10)}.mp3`;
}

// 대사 묶음: 공통 + 단원. slides[id] → 줄 id.
const cache = new Map();
export async function loadVoice(u) {
  if (cache.has(u)) return cache.get(u);
  const get = (f) => fetch(new URL(`../data/voice/${f}`, import.meta.url)).then((r) => (r.ok ? r.json() : null)).catch(() => null);
  const p = Promise.all([get('deck-common.voice.json'), get(`${u}.voice.json`)]).then(([c, x]) => {
    const lines = new Map([...(c?.lines || []), ...(x?.lines || [])].map((l) => [l.id, l.text]));
    return { voice: x?.voice || c?.voice || '', lines, slides: x?.slides || {} };
  });
  cache.set(u, p); return p;
}

// 소리를 내는 영상이 재생 중이면 독쌤은 말하지 않는다(자막만). 소리 없는 자동 재생 영상은 괜찮다.
const loudVideo = () => [...document.querySelectorAll('video')].some((v) => !v.paused && !v.muted && v.volume > 0);

// 같은 탭 안에서 화면이 바뀌어도 이어지는 설정
const pref = { sound: true, paused: false, folded: false };
try { pref.folded = localStorage.getItem('sciLab.guideFolded') === '1'; } catch { /* 저장 불가 */ }
let live = null;   // 지금 떠 있는 안내(한 번에 하나)

// 지금 떠 있는 독쌤을 치운다(가르치기·교사용 화면에 들어갈 때)
export function dropGuide() { live?.destroy(); }

// avoid(): 가리면 안 되는 것들의 DOMRect 목록. canPause: 자동 넘김 멈춤 단추(스스로 공부하기).
export function mountGuide(V, { avoid = () => [], canPause = false, label = '독쌤' } = {}) {
  live?.destroy();
  let avoidFn = avoid, slot = null;
  const dock = document.createElement('aside');
  dock.className = 'dsg no-print'; dock.dataset.side = 'left'; dock.setAttribute('aria-label', `${label} 안내`);
  dock.innerHTML = `<button type="button" class="dsg-fig" aria-label="${label} — 누르면 말풍선을 펼쳐요" aria-expanded="true">
      <span class="dsg-pose"><span class="dsg-act"><span class="dsg-sway"><span class="dsg-bob">
        ${Object.entries(BODY).map(([k, f]) => `<img class="dsg-b" data-b="${k}" src="${A}${f}" alt="" draggable="false" decoding="async">`).join('')}
        <span class="dsg-face">${Object.entries(FACE).map(([k, f]) => `<img data-f="${k}" src="${A}${f}" alt="" draggable="false" decoding="async">`).join('')}</span>
      </span></span></span></span><i class="dsg-dot" aria-hidden="true"></i></button>
    <div class="dsg-bubble"><p class="dsg-say" role="status" aria-live="polite"></p><p class="dsg-status" hidden></p>
      <div class="dsg-ctl"><button type="button" data-g="voice" aria-pressed="${pref.sound}" title="독쌤 음성 켜기/끄기">${pref.sound ? '🔊 음성' : '🔇 음성 끔'}</button>
        <button type="button" data-g="again" title="다시 듣기" aria-label="다시 듣기">↺</button>
        ${canPause ? `<button type="button" data-g="pause" aria-pressed="${pref.paused}" title="자동 넘김 멈춤">${pref.paused ? '▶ 이어서' : '⏸ 멈춤'}</button>` : ''}
        <button type="button" data-g="fold" aria-label="말풍선 접기">접기</button></div></div>`;
  document.body.appendChild(dock);
  const fig = dock.querySelector('.dsg-fig'), $say = dock.querySelector('.dsg-say'), $status = dock.querySelector('.dsg-status'), bubble = dock.querySelector('.dsg-bubble');
  const bodies = Object.fromEntries([...dock.querySelectorAll('[data-b]')].map((i) => [i.dataset.b, i]));
  const faces = Object.fromEntries([...dock.querySelectorAll('[data-f]')].map((i) => [i.dataset.f, i]));
  [...Object.values(bodies), ...Object.values(faces)].forEach((i) => i.decode?.().catch(() => {}));   // 미리 풀어 두어 바꿔 끼울 때 깜빡이지 않게
  const act = dock.querySelector('.dsg-act');

  // ── 표정 ────────────────────────────────────────────────────────────
  let base = 'listen', reaction = null, reactUntil = 0, shownBody = null, shownFace = null, rtimer = 0, calmTimer = 0;
  let voice = null;   // 지금 재생 중인 음성 {audio, text, flapping, mouth, raf}
  const log = [];
  const now = () => performance.now();
  function show(body, face) {
    if (body !== shownBody) { bodies[shownBody]?.classList.remove('on'); bodies[body].classList.add('on'); shownBody = body; }
    if (face !== shownFace) { faces[shownFace]?.classList.remove('on'); if (face) faces[face].classList.add('on'); shownFace = face; }
    if (log.at(-1)?.body !== body || log.at(-1)?.mouth !== face) { log.push({ t: Math.round(now()), body, mouth: face, audio: !!voice?.flapping }); if (log.length > 600) log.shift(); }
  }
  function render() {
    const t = now();
    if (reaction && t >= reactUntil) reaction = null;
    const mood = reaction || base;
    const talking = !!voice?.flapping && !reaction;
    const body = talking ? 'A1' : MOODS[mood] || 'A1';
    show(body, talking && body === 'A1' ? voice.mouth : blinking && body === 'A1' ? 'blink' : null);
    dock.dataset.mood = talking ? 'explain' : mood;
    const lean = mood === 'think' && !talking ? 'lean' : '';
    if ((fig.dataset.pose || '') !== lean) fig.dataset.pose = lean;
    fig.setAttribute('aria-label', `${label} ${LABEL[talking ? 'explain' : mood]} 표정 — ${dock.classList.contains('folded') ? '누르면 말풍선을 펼쳐요' : '안내 중'}`);
    clearTimeout(rtimer); if (reaction) rtimer = setTimeout(render, Math.max(16, reactUntil - t + 4));
  }
  function kick(motion) {
    if (!motion || reducedQ.matches) return;
    delete fig.dataset.motion; void act.offsetWidth; fig.dataset.motion = motion;
  }
  fig.addEventListener('animationend', (e) => { if (/^dsg-(hop|shake|nod|present)/.test(e.animationName)) delete fig.dataset.motion; });
  const setMood = (name, { motion, calm } = {}) => {
    base = MOODS[name] ? name : 'listen'; kick(motion); render();
    clearTimeout(calmTimer); if (calm) calmTimer = setTimeout(() => { if (base === name) { base = 'listen'; render(); } }, calm);
  };
  const react = (name, ms, motion) => { reaction = name; reactUntil = now() + ms; kick(motion); render(); };
  // 눈 깜빡임(기본 얼굴에서 말하지 않을 때만)
  let blinking = false, blinkT = 0;
  const blink = () => { blinkT = setTimeout(() => { if (!dock.isConnected) return; if (!voice?.flapping && shownBody === 'A1' && !reducedQ.matches) { blinking = true; render(); setTimeout(() => { blinking = false; render(); }, 130); } blink(); }, 3200 + Math.random() * 2600); };
  blink();

  // ── 말하기(입 모양은 실제 재생 중일 때만) ───────────────────────────────
  function startFlap(v) {
    if (v.flapping || voice !== v) return;
    v.flapping = true; dock.classList.add('talking'); fig.dataset.speaking = '1'; v.mouth = null; render();
    const tick = () => {
      if (voice !== v || !v.flapping) return;
      const a = v.audio;
      if (a.paused || a.ended) { stopFlap(v); return; }
      let m = null;
      if (Number.isFinite(a.duration) && a.duration > 0) {
        const i = Math.min(v.text.length - 1, Math.floor((a.currentTime / a.duration) * v.text.length));
        m = (Math.floor(a.currentTime * 12) % 3) ? mouthFor(v.text[i]) : null;   // 세 번에 한 번은 다문다
      } else { v.alt = !v.alt; m = v.alt ? 'open' : 'half'; }                    // 길이를 모르면 리듬으로
      if (reducedQ.matches) m = m ? 'half' : null;
      if (m !== v.mouth) { v.mouth = m; render(); }
      v.timer = setTimeout(tick, 80);
    };
    tick();
  }
  function stopFlap(v) {
    if (!v?.flapping) return;
    v.flapping = false; clearTimeout(v.timer); v.mouth = null;
    dock.classList.remove('talking'); delete fig.dataset.speaking; render();
  }
  function stopAudio() {
    const v = voice; voice = null;
    if (v) { stopFlap(v); v.off.forEach((f) => f()); try { v.audio.pause(); } catch { /* */ } }
    dock.classList.remove('talking'); delete fig.dataset.speaking; setVoiceBtn(); render();
  }
  const setVoiceBtn = () => { const b = dock.querySelector('[data-g=voice]'); b.textContent = voice?.flapping ? '■ 멈춤' : pref.sound ? '🔊 음성' : '🔇 음성 끔'; b.setAttribute('aria-pressed', pref.sound); };

  let token = 0, last = null, alive = true, onPause = () => {};
  const popText = () => { bubble.classList.remove('new'); void bubble.offsetWidth; bubble.classList.add('new'); };
  const api = {
    get el() { return dock; }, get paused() { return pref.paused; }, get alive() { return alive; },
    set onPause(f) { onPause = f || (() => {}); },
    // id: 대사 줄 id(또는 {text}) — 끝나면 resolve(true), 다른 말에 끊기면 resolve(false)
    // mood: talk(설명) · praise(칭찬: 깡충 → 격려 미소) · encourage(격려: 끄덕) · surprise(놀람: 움찔 → 격려) · think(생각: 기울기)
    async say(id, { mood = 'talk' } = {}) {
      const my = ++token; last = [id, { mood }]; stopAudio();
      const text = typeof id === 'object' ? id.text : V?.lines?.get(id); if (!text || !alive) return true;
      $say.textContent = text; popText();
      if (dock.classList.contains('folded') && dock.dataset.fold === 'auto') dock.dataset.unread = '1';
      if (mood === 'praise') { react('praise', 1600, 'hop'); setMood('encourage', { calm: 6000 }); }
      else if (mood === 'encourage') { react('encourage', 900, 'nod'); setMood('encourage', { calm: 6000 }); }
      else if (mood === 'surprise') { react('surprise', 1100, 'shake'); setMood('encourage', { calm: 6000 }); }
      else if (mood === 'think') setMood('think');
      else { setMood('listen'); kick('present'); }
      arrangeSoon();
      let played = false;
      if (pref.sound && V?.voice && typeof id === 'string' && !loudVideo()) {
        let src; try { src = await urlOf(V.voice, id, text); } catch { src = null; }
        if (my !== token) return false;
        if (src) {
          const a = new Audio(src), v = { audio: a, text, flapping: false, mouth: null, off: [] };
          voice = v; setVoiceBtn();
          const on = (type, fn) => { a.addEventListener(type, fn); v.off.push(() => a.removeEventListener(type, fn)); };
          played = await new Promise((res) => {
            on('playing', () => { if (voice === v) { startFlap(v); setVoiceBtn(); } });
            on('pause', () => stopFlap(v)); on('waiting', () => stopFlap(v));
            on('ended', () => { stopFlap(v); res(true); });
            on('error', () => { stopFlap(v); dock.dataset.audio = 'missing'; res(false); });
            const p = a.play(); if (p?.catch) p.catch(() => res(false));
          });
          if (voice === v) { v.off.forEach((f) => f()); voice = null; }
          setVoiceBtn(); render();
        }
      }
      if (my !== token) return false;
      if (!played) await sleep(Math.min(6000, 700 + text.length * 85));   // 음성이 없으면 읽을 시간만큼 기다린다
      return my === token;
    },
    // 소리 없이 표정만: think(쓰는 중)·listen 등
    mood: (name, o) => setMood(name, o || {}),
    react: (name, ms = 1200, motion = null) => react(name, ms, motion),
    // 실험실 상태 문장(실험실의 도움말)을 말풍선 둘째 줄에 비춘다
    status(text) { const t = String(text || '').trim(); if (t === $status.textContent) return; $status.textContent = t; $status.hidden = !t || t === $say.textContent; if (t) popText(); arrangeSoon(); },
    stop() { token++; stopAudio(); },
    // 새 화면(슬라이드·쪽)으로 넘어갈 때: 말은 끊고, 직접 펼친 상태는 풀고, 자리를 다시 잡는다
    reset() { token++; stopAudio(); userOpened = false; api.status(''); arrangeSoon(); },
    arrange: () => arrangeSoon(),
    set avoid(f) { avoidFn = f || (() => []); arrangeSoon(); },
    // 자리 고정: el 안(예: 교재 오른쪽 실험 화면의 아래 칸)에 띠로 들어간다. null이면 다시 화면 구석으로.
    place(el) {
      if (!alive) return;
      if ((el || null) === slot && dock.parentElement === (el || document.body)) return;
      slot = el || null; (slot || document.body).appendChild(dock); dock.classList.toggle('docked', !!slot); arrangeSoon();
    },
    get state() { return { body: shownBody, mouth: shownFace, base, reaction, speaking: !!voice?.flapping, folded: dock.classList.contains('folded'), side: dock.dataset.side, log: [...log] }; },
    destroy() {
      if (!alive) return; alive = false; token++; stopAudio(); clearTimeout(blinkT); clearTimeout(rtimer); clearTimeout(calmTimer); clearTimeout(settle);
      ro.disconnect(); mo.disconnect(); removeEventListener('resize', arrangeSoon); document.removeEventListener('science:media-focus', onMedia);
      dock.remove(); document.body.style.removeProperty('--dsg-pad'); document.body.classList.remove('has-dsg'); if (live === api) live = null;
    },
  };

  // ── 자리 잡기 ───────────────────────────────────────────────────────
  let userOpened = false, raf = 0, settle = 0;
  const setFold = (on, why) => { dock.classList.toggle('folded', on); dock.dataset.fold = on ? why : ''; fig.setAttribute('aria-expanded', String(!on)); if (!on) delete dock.dataset.unread; render(); };
  const overlap = (a, list) => list.reduce((s, r) => s + Math.max(0, Math.min(a.right, r.right) - Math.max(a.left, r.left)) * Math.max(0, Math.min(a.bottom, r.bottom) - Math.max(a.top, r.top)), 0);
  function arrange() {
    raf = 0; if (!alive) return;
    const small = innerWidth <= 760 && !slot;
    dock.classList.toggle('compact', small);
    document.body.classList.add('has-dsg');
    if (slot) { document.body.style.removeProperty('--dsg-pad'); setFold(pref.folded && !userOpened, 'user'); return; }
    if (small) {   // 휴대폰: 아래 띠. 내용이 띠 밑에 숨지 않게 몸에 여백을 준다
      setFold(pref.folded && !userOpened, 'user'); dock.dataset.side = 'left';
      document.body.style.setProperty('--dsg-pad', `${dock.classList.contains('folded') ? 0 : dock.offsetHeight + 8}px`); return;
    }
    document.body.style.removeProperty('--dsg-pad');
    let list = []; try { list = (avoidFn() || []).filter((r) => r && r.width > 2 && r.height > 2); } catch { list = []; }
    const seat = (folded) => {
      let best = null;
      for (const side of ['left', 'right']) {
        dock.dataset.side = side;
        const r = folded ? fig.getBoundingClientRect() : dock.getBoundingClientRect();
        const cost = overlap(r, list);
        if (!best || cost < best.cost - 1) best = { side, cost, area: r.width * r.height };
      }
      dock.dataset.side = best.side; return best;
    };
    if (pref.folded && !userOpened) { setFold(true, 'user'); seat(true); return; }
    setFold(false, '');
    const best = seat(false);
    if (!userOpened && best.cost > best.area * 0.04) { setFold(true, 'auto'); seat(true); }
  }
  function arrangeSoon() { if (!raf) raf = requestAnimationFrame(arrange); clearTimeout(settle); settle = setTimeout(() => { if (!raf) raf = requestAnimationFrame(arrange); }, 450); }
  const ro = new ResizeObserver(arrangeSoon); ro.observe(document.body);
  const mo = new MutationObserver((recs) => { if (recs.some((r) => !dock.contains(r.target))) { clearTimeout(settle); settle = setTimeout(arrangeSoon, 250); } });
  mo.observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', arrangeSoon);
  // 소리 나는 영상이 시작되면 독쌤은 말을 멈춘다
  const onMedia = (e) => { const x = e.detail?.except; if (x instanceof HTMLMediaElement && !x.muted) api.stop(); };
  document.addEventListener('science:media-focus', onMedia);

  fig.addEventListener('click', () => {
    if (!dock.classList.contains('folded')) return;
    pref.folded = false; try { localStorage.removeItem('sciLab.guideFolded'); } catch { /* */ }
    userOpened = true; setFold(false, ''); arrangeSoon();
  });
  dock.querySelector('[data-g=fold]').onclick = () => { pref.folded = true; try { localStorage.setItem('sciLab.guideFolded', '1'); } catch { /* */ } userOpened = false; arrange(); fig.focus({ preventScroll: true }); };
  dock.querySelector('[data-g=voice]').onclick = () => {
    if (voice?.flapping) { api.stop(); return; }                 // 말하는 중이면 멈춤
    pref.sound = !pref.sound; setVoiceBtn();
    if (pref.sound && last) api.say(...last); else if (!pref.sound) api.stop();
  };
  dock.querySelector('[data-g=again]').onclick = () => { if (last) { pref.sound = true; api.say(...last); } };
  const $pause = dock.querySelector('[data-g=pause]');
  if ($pause) $pause.onclick = () => { pref.paused = !pref.paused; $pause.textContent = pref.paused ? '▶ 이어서' : '⏸ 멈춤'; $pause.setAttribute('aria-pressed', pref.paused); onPause(pref.paused); };
  render(); arrangeSoon();
  live = api;
  // 검증용(화면에는 영향 없음): 지금 표정·입·말하는 중인지
  Object.defineProperty(window, '__docssam', { configurable: true, get: () => live?.state ?? null });
  return api;
}

// 가리면 안 되는 것 모으기: root 안의 글·단추·입력·표·그림(빈 3D 바닥은 괜찮다)
export function rectsOf(root, sel = 'h1,h2,h3,h4,p,li,button,a.btn,input,textarea,select,table,figure,img,svg,video,.bk-page,.dk-choices,.dk-ans,.dk-hint,.dk-act,.lab-table,.lab3d-btns,.lab3d-read,.lab3d-tip,.ctl,.cap') {
  if (!root) return [];
  const vw = innerWidth, vh = innerHeight;
  return [...root.querySelectorAll(sel)].filter((el) => !el.closest('.dsg') && el.offsetParent !== null).map((el) => el.getBoundingClientRect())
    .filter((r) => r.width > 4 && r.height > 4 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw && r.width * r.height < vw * vh * 0.6);
}
