// 독쌤 안내 — 5세는 글을 거의 못 읽으므로 모든 지시를 소리로 읽어 준다.
//  · 그림은 승인된 독쌤 전신 5장(science-lab/assets)을 겹쳐 두고 한 장만 보인다(.claude/skills/docssam-talking-guide).
//    다른 프로그램이라 science-lab 코드를 가져오지 않고 여기 따로 둔다(스킬 「코드를 복사해서 따로 둔다」).
//  · 목소리: 기기 음성(Web Speech ko-KR). 독쌤 복제 음성 파일은 아직 없다.
//    기기 음성일 때는 입을 움직이지 않는다(스킬: 소리 없는 입 움직임 금지 — 기기 음성은 재생 위치를 알 수 없음). 몸만 끄덕인다.
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

function speak(text) {
  if (!voiceOn || typeof speechSynthesis === "undefined" || !text) return Promise.resolve(false);
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

// host: 독쌤 그림이 들어갈 단추, textEl: 큰 글씨 칸, voiceBtn: 소리 켜기/끄기 단추
export function createGuide({ host, textEl, voiceBtn }) {
  host.classList.add("sm-guide");
  host.type = "button";
  host.setAttribute("aria-label", "독쌤 — 누르면 다시 말해 줘요");
  host.innerHTML = `<span class="act">${Object.entries(BODY).map(([k, f]) => `<img data-b="${k}" src="${A}${f}" alt="" draggable="false" decoding="async">`).join("")}</span>`;
  const imgs = Object.fromEntries([...host.querySelectorAll("img")].map((i) => [i.dataset.b, i]));
  Object.values(imgs).forEach((i) => i.decode?.().catch(() => {}));
  let last = "", token = 0, moodTimer = 0;
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
    if (!voiceOn) speechSynthesis?.cancel?.();
    paintVoice();
    if (voiceOn && last) api.say(last);
  });
  host.addEventListener("click", () => { if (last) api.say(last); });

  const api = {
    // 글을 크게 띄우고 읽는다. 다른 말이 끼어들면 false.
    async say(text, { mood = "explain", hold = false } = {}) {
      const my = ++token;
      last = text;
      if (textEl) { textEl.textContent = text; textEl.animate?.([{ transform: "translateY(8px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 320, easing: "cubic-bezier(.2,.8,.2,1)" }); }
      clearTimeout(moodTimer);
      show(mood); host.classList.add("talk");
      const ok = await speak(text);
      if (my !== token) return false;
      host.classList.remove("talk");
      if (!hold && mood !== "explain") moodTimer = setTimeout(() => show("explain"), 1600);
      return ok;
    },
    praise(text) { motion("hop"); return api.say(text, { mood: "praise" }); },
    encourage(text) { motion("nod"); return api.say(text, { mood: "encourage" }); },
    think(text) { return api.say(text, { mood: "think" }); },
    stop() { token++; try { speechSynthesis.cancel(); } catch { /* 없음 */ } host.classList.remove("talk"); },
    get last() { return last; }
  };
  return api;
}
