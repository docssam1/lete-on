// 첫 화면(home.html): 카드 주소에 학생 이름(?student=) 이어 붙이기 · 숏릴 자막 · 멈춤 단추.
const student = new URLSearchParams(location.search).get("student");
if (student) {
  document.querySelectorAll("a[data-link]").forEach((a) => {
    const url = new URL(a.getAttribute("href"), location.href);
    url.searchParams.set("student", student);
    a.href = `./${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  });
}

// 숏릴 장면(초): tools/home-reel/record.cjs 가 영상과 함께 assets/front/reel-scenes.json 에 적는다. 못 읽으면 아래 기본값.
let SCENES = [
  {at: 0, id: "shape", kicker: "보고 배우고", title: "뒤집고 돌리기 공방", step: 0},
  {at: 3, id: "clock", kicker: "보고 배우고", title: "시계 바늘 돌리기", step: 0},
  {at: 8, id: "balance", kicker: "보고 배우고", title: "무게 줄 세우기", step: 0},
  {at: 12, id: "cubes", kicker: "보고 배우고", title: "쌓기나무 탑 쌓기", step: 0},
  {at: 17, id: "board", kicker: "공부하고", title: "개념 학습 · 독쌤 칠판", step: 1},
  {at: 21, id: "bell", kicker: "공부하고", title: "골든벨 문제", step: 1},
  {at: 24, id: "start", kicker: "공부하고", title: "오늘 공부할 내용 고르기", step: 1},
  {at: 27, id: "bank-range", kicker: "완성하기", title: "문제은행 · 범위 고르기", step: 2},
  {at: 29, id: "bank-edit", kicker: "완성하기", title: "문제은행 · 상세 편집", step: 2},
  {at: 33, id: "bank-print", kicker: "완성하기", title: "문제은행 · 시험지 인쇄", step: 2}
];
// 장면마다 화면 위에 크게 띄우는 한 줄
const SAY = { shape: "손으로 뒤집어 보고", clock: "바늘을 직접 돌리고", balance: "무게도 비교하고", cubes: "쌓기나무를 쌓아요", board: "개념은 독쌤 칠판으로", bell: "골든벨로 바로 확인", start: "오늘 공부, 골라서 시작!", "bank-range": "문제은행에서 범위를 고르고", "bank-edit": "쌍둥이 문제로 바꾸고 더하고", "bank-print": "시험지로 바로 인쇄" };
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
const setState = (playing) => { play.setAttribute("aria-pressed", String(playing)); play.setAttribute("aria-label", playing ? "영상 멈추기" : "영상 재생하기"); play.textContent = playing ? "❚❚" : "▶"; };
if (still) { video.removeAttribute("autoplay"); video.pause(); }
setState(!video.paused);
video.addEventListener("play", () => setState(true));
video.addEventListener("pause", () => setState(false));
// 소리: 처음엔 꺼 둔다(브라우저가 소리 나는 자동 재생을 막는다). 누르면 음악·효과음이 나온다.
const sound = document.getElementById("reelSound");
sound.addEventListener("click", () => {
  video.muted = !video.muted;
  sound.setAttribute("aria-pressed", String(!video.muted)); sound.setAttribute("aria-label", video.muted ? "소리 켜기" : "소리 끄기"); sound.textContent = video.muted ? "🔇" : "🔊";
  if (!video.muted && video.paused) { userPaused = false; video.play().catch(() => {}); }
});
play.addEventListener("click", () => { if (video.paused) { userPaused = false; video.play().catch(() => {}); } else { userPaused = true; video.pause(); } });
if ("IntersectionObserver" in window) {
  new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { if (!userPaused && video.paused) video.play().catch(() => {}); } else if (!video.paused) video.pause();
  }), { threshold: 0.3 }).observe(video);
}
