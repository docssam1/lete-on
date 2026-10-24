import { CURRICULUM } from "./source-data.js?v=20261024r";

// 첫 화면(home.html): 한 차시 둘러보기 탭 · 교재 카드 · 나타나기 · 학생 이름 이어 붙이기.
const params = new URLSearchParams(location.search);
const student = params.get("student");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const withStudent = (href) => {
  if (!student) return href;
  const url = new URL(href, location.href);
  url.searchParams.set("student", student);
  return `./${url.pathname.split("/").pop()}${url.search}${url.hash}`;
};

// 교재 카드: 권 · 제목 · 단원 넷
document.getElementById("bookGrid").innerHTML = CURRICULUM.map((book, k) => `<a class="hm-book reveal" href="${esc(withStudent(`./start.html?book=${book.id}`))}" style="--i:${k}">
  <span class="hm-book-no">${esc(book.label)}</span><strong>${esc(book.title)}</strong>
  <ol>${book.units.map((unit) => `<li>${esc(unit.label)}</li>`).join("")}</ol><em>시작하기 →</em></a>`).join("");

document.querySelectorAll("a[data-link]").forEach((a) => { a.href = withStudent(a.getAttribute("href")); });

// 한 차시 둘러보기 탭(←/→로도)
const tabs = [...document.querySelectorAll("[data-tab]")];
const panels = [...document.querySelectorAll("[data-panel]")];
const select = (k) => {
  tabs.forEach((t, i) => t.setAttribute("aria-selected", String(i === k)));
  panels.forEach((p, i) => { p.hidden = i !== k; });
};
tabs.forEach((t, i) => {
  t.addEventListener("click", () => select(i));
  t.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const k = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    select(k); tabs[k].focus();
  });
});

// 기울어진 카드에서 둘러보기 탭으로
document.querySelectorAll("[data-tab-jump]").forEach((a) => a.addEventListener("click", () => select(Number(a.dataset.tabJump))));

// 머리줄: 첫 화면을 지나면 흰 바탕
const nav = document.getElementById("nav");
const onScroll = () => nav.classList.toggle("solid", scrollY > 40);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// 나타나기(움직임 줄이기 설정이면 바로)
const items = document.querySelectorAll(".reveal");
if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) items.forEach((el) => el.classList.add("in"));
else {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  items.forEach((el) => io.observe(el));
}
