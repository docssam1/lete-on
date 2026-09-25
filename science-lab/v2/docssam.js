// docssam 안내(스스로 공부하기 전용) — 한 번에 한 행동만 말한다.
//  · 목소리: 광고와 같은 docssam 음성 MP3(data/voice/*.voice.json → scripts/generate-audio.js → Supabase).
//    파일이 없거나 재생이 막히면 **자막만** 보여 준다(기기 음성으로 바꿔 읽지 않고, 음성이 있다고 표시하지도 않는다).
//  · 입 모양은 실제 오디오가 재생되는 동안에만, 재생 위치에 맞춰 움직인다.
//  · 말이 끝나면 say()가 끝난다 — 화면은 이것을 기다렸다가 다음으로 넘어간다.
const SUPA = 'https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio/science-lab/';
const A = '../assets/';
const BODY = { talk: 'docssam-A1-mouth-closed.webp', praise: 'docssam-B3-praise.webp', encourage: 'docssam-B4-encourage.webp', thinking: 'docssam-B2-thinking.webp' };
const FACE = { half: 'face-A2-mouth-half.webp', open: 'face-A3-mouth-open.webp', o: 'face-A4-mouth-o.webp' };
const REDUCED = matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function mouthFor(ch) {
  const c = ch.charCodeAt(0) - 0xac00; if (c < 0 || c > 11171) return null;
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

// 같은 탭 안에서 슬라이드가 바뀌어도 이어지는 설정
const pref = { sound: true, paused: false };
let current = null;   // 지금 말하고 있는 오디오(다음 슬라이드가 시작되면 끊는다)

export function mountGuide(host, V) {
  host.innerHTML = `<div class="dg" aria-live="polite">
    <div class="dg-char"><img class="dg-b" src="${A}${BODY.talk}" alt="독쌤"><img class="dg-f" alt=""></div>
    <p class="dg-say"></p>
    <div class="dg-ctl"><button type="button" class="dg-btn" data-g="again" aria-label="다시 듣기" title="다시 듣기">↺</button>
      <button type="button" class="dg-btn" data-g="sound" aria-pressed="${pref.sound}" title="소리">${pref.sound ? '🔊' : '🔇'}</button>
      <button type="button" class="dg-btn" data-g="pause" aria-pressed="${pref.paused}" title="자동 넘김 멈춤">${pref.paused ? '▶' : '⏸'}</button></div></div>`;
  const $say = host.querySelector('.dg-say'), $b = host.querySelector('.dg-b'), $f = host.querySelector('.dg-f');
  let token = 0, last = null, alive = true;
  const face = (k) => { if (!k) { $f.style.display = 'none'; return; } $f.src = A + FACE[k]; $f.style.display = 'block'; };
  const stopAudio = () => { try { current?.pause(); } catch { /* */ } current = null; };
  const api = {
    onPause: () => {}, get paused() { return pref.paused; },
    // id: 대사 줄 id(또는 {text}) — 끝나면 resolve(true), 다른 말에 끊기면 resolve(false)
    async say(id, { mood = 'talk' } = {}) {
      const my = ++token; last = [id, { mood }]; stopAudio(); face(null);
      const text = typeof id === 'object' ? id.text : V.lines.get(id); if (!text || !alive) return true;
      $b.src = A + (BODY[mood] || BODY.talk); $say.textContent = text; host.classList.add('talk');
      let played = false;
      if (pref.sound && V.voice && typeof id === 'string') {
        const a = new Audio(await urlOf(V.voice, id, text)); if (my !== token) return false;
        current = a;
        played = await new Promise((res) => {
          let ok = false;
          a.addEventListener('playing', () => { ok = true; }, { once: true });
          a.addEventListener('ended', () => res(true), { once: true });
          a.addEventListener('error', () => res(false), { once: true });
          a.play().catch(() => res(false));
          // 입 모양: 재생 위치의 글자 모음에 맞춰(말하는 몸 그림일 때만)
          const tick = () => { if (my !== token || a.paused || a.ended) { face(null); return; }
            if (ok && mood === 'talk' && !REDUCED && a.duration) { const i = Math.min(text.length - 1, Math.floor((a.currentTime / a.duration) * text.length)); face(Math.floor(a.currentTime * 12) % 3 ? mouthFor(text[i]) : null); }
            setTimeout(tick, 80); };
          tick();
        });
        face(null);
      }
      if (my !== token) return false;
      if (!played) await sleep(Math.min(6000, 700 + text.length * 85));   // 음성이 없으면 읽을 시간만큼 기다린다
      if (my !== token) return false;
      host.classList.remove('talk'); return true;
    },
    stop() { token++; stopAudio(); face(null); host.classList.remove('talk'); },
    destroy() { alive = false; api.stop(); },
  };
  host.querySelector('[data-g=again]').onclick = () => { if (last) api.say(...last); };
  host.querySelector('[data-g=sound]').onclick = (e) => { pref.sound = !pref.sound; e.currentTarget.textContent = pref.sound ? '🔊' : '🔇'; e.currentTarget.setAttribute('aria-pressed', pref.sound); if (!pref.sound) stopAudio(); };
  host.querySelector('[data-g=pause]').onclick = (e) => { pref.paused = !pref.paused; e.currentTarget.textContent = pref.paused ? '▶' : '⏸'; e.currentTarget.setAttribute('aria-pressed', pref.paused); api.onPause(pref.paused); };
  return api;
}
