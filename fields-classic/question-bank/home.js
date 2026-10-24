// 첫 화면(home.html): 카드 주소에 학생 이름(?student=) 이어 붙이기 · 숏릴 자막 · 멈춤 단추.
const student = new URLSearchParams(location.search).get("student");
if (student) {
  document.querySelectorAll("a[data-link]").forEach((a) => {
    const url = new URL(a.getAttribute("href"), location.href);
    url.searchParams.set("student", student);
    a.href = `./${url.pathname.split("/").pop()}${url.search}${url.hash}`;
  });
}

// 숏릴 구간(초): 5초씩 7장면. 영상(assets/front/reel.mp4)을 다시 찍으면 여기도 맞춘다.
const SCENES = [
  [0, "보고 배우고", "뒤집고 돌리기 공방", 0],
  [5, "보고 배우고", "디지털 숫자 공방", 0],
  [10, "보고 배우고", "시계 바늘 돌리기", 0],
  [15, "보고 배우고", "쌓기나무 탑 쌓기", 0],
  [20, "보고 배우고", "무게 줄 세우기", 0],
  [25, "공부하고", "개념 학습 · 한 장씩", 1],
  [30, "완성하기", "사고력 문제은행", 2]
];
const video = document.getElementById("reel");
const cap = document.getElementById("reelCap");
const steps = [...document.querySelectorAll(".hm-three li")];
let shown = -1;
const syncCaption = () => {
  let k = 0;
  for (let i = 0; i < SCENES.length; i++) if (video.currentTime >= SCENES[i][0]) k = i;
  if (k === shown) return;
  shown = k;
  const [, kicker, title, step] = SCENES[k];
  cap.querySelector("em").textContent = kicker;
  cap.querySelector("span").textContent = title;
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
play.addEventListener("click", () => { if (video.paused) { userPaused = false; video.play().catch(() => {}); } else { userPaused = true; video.pause(); } });
if ("IntersectionObserver" in window) {
  new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { if (!userPaused && video.paused) video.play().catch(() => {}); } else if (!video.paused) video.pause();
  }), { threshold: 0.3 }).observe(video);
}
