// 독쌤 안내 — 5세는 글을 거의 못 읽으므로 모든 지시를 소리로 읽어 준다.
//  · 그림은 승인된 독쌤 전신 5장(science-lab/assets)을 겹쳐 두고 한 장만 보인다(.claude/skills/docssam-talking-guide).
//    다른 프로그램이라 science-lab 코드를 가져오지 않고 여기 따로 둔다(스킬 「코드를 복사해서 따로 둔다」).
//  · 목소리: 독쌤 복제 음성(OmniVoice, 사이언스 랩 독쌤과 같은 목소리) 파일이 있으면 그것, 없으면 기기 음성(Web Speech ko-KR).
//    파일 이름 = sm-<sha1("sm-docssam-v1|"+글) 앞 12자>.mp3, 목록은 audio/docssam/manifest.json (scripts/omnivoice-sm.py 가 만든다).
//    ${…}로 아이마다 달라지는 말은 파일이 없어 기기 음성으로 읽는다.
//    입 모양 그림이 없으므로 말하는 동안 몸만 움직인다.
//  · 말풍선 글은 .sm-ask 의 큰 글씨가 맡는다. 독쌤을 누르면 다시 말한다.
const A = new URL("../../science-lab/assets/", import.meta.url).href;
const BODY = { A1: "docssam-A1-mouth-closed.webp", B1: "docssam-B1-surprised.webp", B2: "docssam-B2-thinking.webp", B3: "docssam-B3-praise.webp", B4: "docssam-B4-encourage.webp" };
const MOOD = { explain: "A1", think: "B2", surprise: "B1", praise: "B3", encourage: "B4" };
const VOICE_KEY = "sm-voice";

let voiceOn = true;
try { voiceOn = localStorage.getItem(VOICE_KEY) !== "off"; } catch { /* 저장 불가 */ }
let koVoice = null;
function pickVoice() {
  try {
    const list = speechSynthesis.getVoices() || [];
    const ko = list.filter((v) => /^ko/i.test(v.lang));
    koVoice = ko.find((v) => /yuna|sora|female|여/i.test(v.name)) || ko[0] || null;
  } catch { koVoice = null; }
}
if (typeof speechSynthesis !== "undefined") { pickVoice(); speechSynthesis.addEventListener?.("voiceschanged", pickVoice); }

function speakDevice(text) {
  if (typeof speechSynthesis === "undefined") return Promise.resolve(false);
  return new Promise((resolve) => {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[⭐🎉✨👏]/gu, ""));
      u.lang = "ko-KR"; u.rate = 0.92; u.pitch = 1.08; if (koVoice) u.voice = koVoice;
      const t = setTimeout(() => resolve(false), 1500 + text.length * 120);   // 끝 알림이 안 오는 기기에서 오래 멈추지 않게
      u.onend = () => { clearTimeout(t); resolve(true); };
      u.onerror = () => { clearTimeout(t); resolve(false); };
      speechSynthesis.speak(u);
    } catch { resolve(false); }
  });
}

// 독쌤 복제 음성 파일
const TAG = "sm-docssam-v1";
const AUDIO = new URL("../audio/docssam/", import.meta.url).href;
let files = null;
const ready = fetch(AUDIO + "manifest.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null))
  .then((m) => { files = new Set(m?.files || []); }).catch(() => { files = new Set(); });
async function clipFor(text) {
  await ready;
  if (!files?.size || !globalThis.crypto?.subtle) return null;
  const buf = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(`${TAG}|${text}`));
  const name = `sm-${[...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 12)}.mp3`;
  return files.has(name) ? AUDIO + name : null;
}
let playing = null, seq = 0;
function stopAll() {
  try { speechSynthesis?.cancel?.(); } catch { /* 없음 */ }
  if (playing) { playing.pause(); playing = null; }
}
async function speak(text) {
  if (!voiceOn || !text) return false;
  const my = ++seq;
  stopAll();
  const url = await clipFor(text).catch(() => null);
  if (my !== seq) return false;                                   // 그사이 다른 말이 시작됨
  if (url) {
    const ok = await new Promise((resolve) => {
      const a = new Audio(url); playing = a;
      const t = setTimeout(() => resolve(false), 30000);
      a.onended = () => { clearTimeout(t); resolve(true); };
      a.onpause = () => { if (playing !== a) { clearTimeout(t); resolve(false); } };
      a.onerror = () => { clearTimeout(t); resolve(null); };
      a.play().catch(() => { clearTimeout(t); resolve(null); });
    });
    if (ok !== null) return ok;
    if (my !== seq) return false;
  }
  return speakDevice(text);                                       // 파일이 없거나 재생이 막히면 기기 음성
}

// host: 독쌤 그림이 들어갈 단추, textEl: 큰 글씨 칸, voiceBtn: 소리 켜기/끄기 단추
export function createGuide({ host, textEl, voiceBtn }) {
  host.classList.add("sm-guide");
  host.type = "button";
  host.setAttribute("aria-label", "독쌤 — 누르면 다시 말해 줘요");
  host.innerHTML = `<span class="act">${Object.entries(BODY).map(([k, f]) => `<img data-b="${k}" src="${A}${f}" alt="" draggable="false" decoding="async">`).join("")}</span>`;
  const imgs = Object.fromEntries([...host.querySelectorAll("img")].map((i) => [i.dataset.b, i]));
  Object.values(imgs).forEach((i) => i.decode?.().catch(() => {}));
  let last = "", lastVoice = null, token = 0, moodTimer = 0;
  const show = (mood) => { const b = MOOD[mood] || "A1"; Object.entries(imgs).forEach(([k, i]) => i.classList.toggle("on", k === b)); };
  const motion = (m) => { delete host.dataset.motion; void host.offsetWidth; if (m) host.dataset.motion = m; };
  host.addEventListener("animationend", () => delete host.dataset.motion);
  show("explain");

  const paintVoice = () => {
    if (!voiceBtn) return;
    voiceBtn.textContent = voiceOn ? "🔊" : "🔇";
    voiceBtn.setAttribute("aria-label", voiceOn ? "소리 끄기" : "소리 켜기");
    voiceBtn.setAttribute("aria-pressed", String(voiceOn));
  };
  paintVoice();
  voiceBtn?.addEventListener("click", () => {
    voiceOn = !voiceOn;
    try { localStorage.setItem(VOICE_KEY, voiceOn ? "on" : "off"); } catch { /* 이번만 */ }
    if (!voiceOn) stopAll();
    paintVoice();
    if (voiceOn && last) api.say(last, { voice: lastVoice });
  });
  host.addEventListener("click", () => { if (last) api.say(last, { voice: lastVoice }); });

  const api = {
    // 글을 크게 띄우고 읽는다. 다른 말이 끼어들면 false.
    // voice: 소리로 읽을 글이 화면 글과 다를 때(예: 아이 이름을 빼고 읽기 — 미리 만든 독쌤 목소리로)
    async say(text, { mood = "explain", hold = false, display = true, voice = null } = {}) {
      const my = ++token;
      last = text; lastVoice = voice;
      if (textEl && display) { textEl.textContent = text; textEl.animate?.([{ transform: "translateY(8px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" }); }
      clearTimeout(moodTimer);
      show(mood); host.classList.add("talk");
      const ok = await speak(voice || text);
      if (my !== token) return false;
      host.classList.remove("talk");
      if (!hold && mood !== "explain") moodTimer = setTimeout(() => show("explain"), 1600);
      return ok;
    },
    praise(text, opts = {}) { motion("hop"); return api.say(text, { ...opts, mood: "praise" }); },
    encourage(text) { motion("nod"); return api.say(text, { mood: "encourage" }); },
    think(text) { return api.say(text, { mood: "think" }); },
    stop() { token++; seq++; stopAll(); host.classList.remove("talk"); },
    get last() { return last; }
  };
  return api;
}
