// 첫 화면(home.html): 카드 주소에 학생 이름(?student=) 이어 붙이기 · 이어서 하기 한 줄 · 로그인 글자 · 숏릴 자막 · 멈춤 단추.
import { createTimeline, stagger, splitText } from "./vendor/animejs-4.5.0/anime.esm.min.js";
import { setIcon } from "./ui-icons.js?v=20261105b";
import { loggedIn, loadLocalAll } from "./study-progress.js?v=20261029q";

// 인트로(원장 2026-11-04 「인트로에 필요 없어?」 — 영상 1 「로고·인트로는 Anime.js」, 스킬 web-ui-library-picks):
// 로고 동그라미가 굴러 들어오고 → WELCOME TO → 뒤의 큰 글자 GIFTED MATH BANK가 한 글자씩 아래에서 올라온다. 카드 셋은 원래 CSS 등장(hm-in) 그대로.
// 첫 화면에 한 번만 · 움직임 줄이기 설정이면 움직이지 않는다.
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const giant = [...document.querySelectorAll(".hm-giant > span")];
  const chars = giant.flatMap((line) => splitText(line, { chars: true }).chars);
  createTimeline({ defaults: { ease: "out(4)" } })
    .add(".hm-logo i", { rotate: [-200, 0], scale: [0.3, 1], opacity: [0, 1], duration: 700, ease: "outBack(1.6)" }, 0)
    .add(".hm-logo span", { opacity: [0, 1], x: [-10, 0], duration: 420 }, 260)
    .add(".hm-welcome", { opacity: [0, 1], y: [-12, 0], letterSpacing: ["0.4em", "0.06em"], duration: 700 }, 120)
    .add(chars, { opacity: [0, 1], y: ["70%", "0%"], duration: 900, delay: stagger(36) }, 200);
}
// 학생 이름: 주소(?student=) → 로그인한 학생 → 없음(DEMO). 카드 주소에 이어 붙인다.
const me = loggedIn();
const student = new URLSearchParams(location.search).get("student") || (me && me.type !== "admin" ? me.name : "") || "";
if (student) {
  document.querySelectorAll("a[data-link]").forEach((a) => {
    const url = new URL(a.getAttribute("href"), location.href);
    url.searchParams.set("student", student);
    a.href = `./${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  });
}
// 위 오른쪽: 로그인했으면 이름(학생) 또는 「원장 화면」, 가입 글자는 숨긴다
if (me) {
  const login = document.getElementById("homeLogin");
  login.textContent = me.type === "admin" ? "원장 화면" : `${me.name} 로그인됨`;
  login.href = me.type === "admin" ? "./teacher.html" : "./login.html";
  document.getElementById("homeSignup").hidden = true;
}
// 이어서 하기(원장 2026-11-10 「대문이 학생 문이 되어야지」): 이 기기에 남은 차시 기록 가운데 가장 최근 것 → 누르면 바로 그 차시 덱.
// 기록 열쇠 `book-NN-u<단원>` · payload { part, last } (study-progress.js). 기록이 없으면 보이지 않는다.
{
  const who = student || "DEMO";
  const row = loadLocalAll().records.filter((entry) => entry.student_name === who && entry.kind === "week" && /^book-\d+-u\d+$/.test(entry.record_key))
    .sort((a, b) => String(b.updated_at || "").localeCompare(String(a.updated_at || "")))[0];
  if (row) {
    const [, bookId, unitText] = /^(book-(?:\d+))-u(\d+)$/.exec(row.record_key);
    const unit = Number(unitText), part = Math.max(1, Number(row.payload?.part) || 1), last = Number(row.payload?.last) || 0;
    const link = document.getElementById("homeContinue");
    link.href = `./study.html?${new URLSearchParams({ student: who, book: bookId, unit: String(unit), part: String(part), ...(last ? { s: String(last) } : {}) })}`;
    document.getElementById("homeContinueAt").textContent = `${Number(bookId.slice(5))}권 ${unit + 1}단원 ${part}차시`;
    link.hidden = false;
  }
}

// 숏릴 장면(초): tools/home-reel/record.cjs 가 영상과 함께 assets/front/reel-scenes.json 에 적는다. 못 읽으면 아래 기본값.
let SCENES = [
  {at: 0, id: "shape", kicker: "보고 배우고", title: "뒤집고 돌리기 공방", step: 0},
  {at: 3, id: "clock", kicker: "보고 배우고", title: "시계 바늘 돌리기", step: 0},
  {at: 8, id: "balance", kicker: "보고 배우고", title: "무게 줄 세우기", step: 0},
  {at: 12, id: "cubes", kicker: "보고 배우고", title: "쌓기나무 탑 쌓기", step: 0},
  {at: 17, id: "board", kicker: "공부하고", title: "개념 학습 · 독쌤 칠판", step: 1},
  {at: 21, id: "bell", kicker: "공부하고", title: "워밍업 문제", step: 1},
  {at: 24, id: "start", kicker: "공부하고", title: "오늘 공부할 내용 고르기", step: 1},
  {at: 27, id: "bank-range", kicker: "완성하기", title: "문제은행 · 범위 고르기", step: 2},
  {at: 29, id: "bank-edit", kicker: "완성하기", title: "문제은행 · 상세 편집", step: 2},
  {at: 33, id: "bank-print", kicker: "완성하기", title: "문제은행 · 시험지 인쇄", step: 2}
];
// 장면마다 화면 위에 크게 띄우는 한 줄
const SAY = { shape: "손으로 뒤집어 보고", clock: "바늘을 직접 돌리고", balance: "무게도 비교하고", cubes: "쌓기나무를 쌓아요", board: "개념은 독쌤 칠판으로", bell: "워밍업으로 바로 확인", start: "오늘 공부, 골라서 시작!", "bank-range": "문제은행에서 범위를 고르고", "bank-edit": "쌍둥이 문제로 바꾸고 더하고", "bank-print": "시험지로 바로 인쇄" };
fetch("./assets/front/reel-scenes.json", { cache: "no-cache" }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (j?.scenes?.length) { SCENES = j.scenes; shown = -1; syncCaption(); } }).catch(() => {});
const video = document.getElementById("reel");
const cap = document.getElementById("reelCap");
const sayEl = document.getElementById("reelSay");
const steps = [...document.querySelectorAll(".hm-three li")];
let shown = -1;
const syncCaption = () => {
  let k = 0;
  for (let i = 0; i < SCENES.length; i++) if (video.currentTime >= SCENES[i].at) k = i;
  if (k === shown) return;
  shown = k;
  const { id, kicker, title, step } = SCENES[k];
  cap.querySelector("em").textContent = kicker;
  cap.querySelector("span").textContent = title;
  sayEl.textContent = SAY[id] || title;
  sayEl.classList.remove("in"); void sayEl.offsetWidth; sayEl.classList.add("in");
  steps.forEach((li) => li.classList.toggle("is-on", Number(li.dataset.step) === step));
};
video.addEventListener("timeupdate", syncCaption);
video.addEventListener("seeked", syncCaption);

// 움직임 줄이기 설정이면 저절로 재생하지 않는다(포스터만). 단추로는 언제든 재생.
// 화면에 보일 때만 돌고, 보이지 않으면 멈춘다(휴대폰 배터리). 사용자가 직접 멈춘 뒤에는 다시 켜지 않는다.
const play = document.getElementById("reelPlay");
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
let userPaused = still;
const setState = (playing) => { play.setAttribute("aria-pressed", String(playing)); play.setAttribute("aria-label", playing ? "영상 멈추기" : "영상 재생하기"); setIcon(play, playing ? "pause" : "play", "18px"); };
if (still) { video.removeAttribute("autoplay"); video.pause(); }
setState(!video.paused);
video.addEventListener("play", () => setState(true));
video.addEventListener("pause", () => setState(false));
// 소리: 처음엔 꺼 둔다(브라우저가 소리 나는 자동 재생을 막는다). 누르면 음악·효과음이 나온다.
const sound = document.getElementById("reelSound");
sound.addEventListener("click", () => {
  video.muted = !video.muted;
  sound.setAttribute("aria-pressed", String(!video.muted)); sound.setAttribute("aria-label", video.muted ? "소리 켜기" : "소리 끄기"); setIcon(sound, video.muted ? "soundOff" : "soundOn", "18px");
  if (!video.muted && video.paused) { userPaused = false; video.play().catch(() => {}); }
});
play.addEventListener("click", () => { if (video.paused) { userPaused = false; video.play().catch(() => {}); } else { userPaused = true; video.pause(); } });
if ("IntersectionObserver" in window) {
  new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { if (!userPaused && video.paused) video.play().catch(() => {}); } else if (!video.paused) video.pause();
  }), { threshold: 0.3 }).observe(video);
}
