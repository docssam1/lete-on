import { CURRICULUM } from "./source-data.js?v=20260918a";
import { unitParts, partProblems, lessonsByUnit, lessonsByPart, gameTitles, loadGoldenBell } from "./study-map.js?v=20261024a";

// 학생용 단원 공부: 권 → 단원 → 차시(개념 1 · 개념 2)마다 ① 개념 배우기 → ② 게임하기 → ③ 골든벨 → ④ 공부하기.
// ④는 학생이 종이 본책을 펴 놓고 푼다는 전제다. 모르는 번호를 누르면 그 문제와 같은 유형의 유사문제가 나온다(문제은행 학생 화면).
// 주소: ?book=book-01&unit=0&part=1&student=…   차시 나누기 규칙은 study-map.js

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const book = CURRICULUM.find((entry) => entry.id === params.get("book")) || CURRICULUM[0];
const unitIndex = Math.min(Math.max(Number(params.get("unit")) || 0, 0), book.units.length - 1);
const unit = book.units[unitIndex];
const { count } = unitParts(unit);
let part = Math.min(Math.max(Number(params.get("part")) || 1, 1), count);
let bell = null;
const seenKey = `fields-classic-study-seen:${student}:${book.id}:${unitIndex}`;
const seen = (() => { try { return new Set(JSON.parse(localStorage.getItem(seenKey) || "[]")); } catch { return new Set(); } })();

const link = (page, entries) => `./${page}?${new URLSearchParams({ student, ...entries })}`;
const here = () => link("study.html", { book: book.id, unit: String(unitIndex), part: String(part) });
const bellLink = (entries) => link("golden-bell.html", { book: book.id, as: "student", back: here(), ...entries });

function renderHead() {
  document.title = `${book.label} ${unitIndex + 1}단원 · ${unit.label}`;
  $("eyebrow").textContent = `GFIELD CLASSIC · ${book.label} ${book.title}`;
  $("unitTitle").textContent = `${unitIndex + 1}단원 · ${unit.label}`;
  $("studentName").textContent = student;
  $("backLink").href = link("start.html", { book: book.id });
  $("partTabs").innerHTML = Array.from({ length: count }, (_, index) => `<button type="button" role="tab" data-part="${index + 1}" aria-selected="${index + 1 === part}">
    <b>${index + 1}차시</b><span>개념 ${index + 1}</span></button>`).join("");
}

function lessonLinks(lessons, kind) {
  if (!bell) return `<p class="sd-wait">불러오는 중…</p>`;
  const rows = lessons.map((lesson) => {
    if (kind === "concept") {
      const tutorial = Boolean(bell.games.flows[`${book.id}/${lesson.id}`]);
      return `<a class="sd-item${tutorial ? " is-tutorial" : ""}" href="${esc(bellLink({ lesson: lesson.id }))}"><b>${esc(lesson.title)}</b><span>${tutorial ? "튜토리얼 · 개념 설명 → 예제 → 게임" : "개념 설명"}</span></a>`;
    }
    if (kind === "game") {
      const games = gameTitles(book.id, lesson, bell.games);
      return games.length ? `<a class="sd-item" href="${esc(bellLink({ lesson: lesson.id }))}"><b>${esc(games.join(" · "))}</b><span>${esc(lesson.title)}</span></a>` : "";
    }
    const items = lesson.original?.items?.length || 0;
    return items ? `<a class="sd-item" href="${esc(bellLink({ lesson: lesson.id, phase: "original" }))}"><b>${esc(lesson.title)}</b><span>골든벨 ${items}문항 · 개념을 본 뒤 열려요</span></a>` : "";
  }).filter(Boolean);
  if (rows.length) return `<div class="sd-items">${rows.join("")}</div>`;
  return `<p class="sd-empty">${kind === "concept" ? "이 차시의 개념 설명은 준비 중입니다." : kind === "game" ? "이 차시의 게임은 준비 중입니다." : "이 차시의 골든벨 문항은 준비 중입니다."}</p>`;
}

function boardMarkup() {
  const blocks = partProblems(unit, part);
  return `<p class="sd-board-help">본책을 펴 놓고 풀어요. <b>모르는 문제 번호를 누르면</b> 같은 유형의 유사문제가 나와요.</p>
    ${blocks.map((block) => `<div class="sd-block"><h4>${esc(block.label)}</h4><div class="sd-numbers">${block.numbers.map(({ n, typeId, stage }) => {
      const ref = block.label.includes(" ") ? `${block.label}-${n}번` : `${block.label} ${n}번`; // 활동 1-3번 · 연습 7번
      const key = `${block.section}${block.group}-${n}`;
      const href = link("index.html", { mode: "curriculum", book: book.id, units: String(unitIndex), only: typeId, stage, count: "1", build: "1", as: "student", ref: `${unitIndex + 1}단원 ${ref}`, back: here() });
      return `<a class="sd-number${seen.has(key) ? " is-seen" : ""}" data-key="${key}" href="${esc(href)}" aria-label="${esc(ref)} 유사문제">${n}</a>`;
    }).join("")}</div></div>`).join("")}
    <p class="sd-board-note">○ 표시는 한 번 눌러 본 번호예요.</p>`;
}

function render() {
  const lessons = bell ? lessonsByPart(unit, lessonsByUnit(book, bell.books.find((entry) => entry.id === book.id)).units[unitIndex])[part - 1] : [];
  const steps = [
    ["개념 배우기", "골든벨 대표 문제로 이 차시의 개념을 배워요.", lessonLinks(lessons, "concept")],
    ["게임하기", "풀이 과정을 손으로 해 보며 개념을 익혀요.", lessonLinks(lessons, "game")],
    ["골든벨", "골든벨 문항을 풀고 채점해요.", lessonLinks(lessons, "bell")],
    ["공부하기", "본책 문제를 풀어요.", boardMarkup()]
  ];
  $("steps").innerHTML = steps.map(([title, lead, body], index) => `<li class="sd-step"><div class="sd-step-head"><span class="sd-no">${index + 1}</span><div><h3>${title}</h3><p>${lead}</p></div></div>${body}</li>`).join("");
  document.querySelectorAll("[data-part]").forEach((button) => button.setAttribute("aria-selected", String(Number(button.dataset.part) === part)));
}

$("partTabs").addEventListener("click", (event) => {
  const button = event.target.closest("[data-part]");
  if (!button) return;
  part = Number(button.dataset.part);
  history.replaceState(null, "", here());
  render();
});
$("steps").addEventListener("click", (event) => {
  const number = event.target.closest(".sd-number");
  if (!number) return;
  seen.add(number.dataset.key);
  try { localStorage.setItem(seenKey, JSON.stringify([...seen])); } catch {}
});

renderHead();
render();
loadGoldenBell().then((data) => { bell = data; render(); }).catch(() => {
  document.querySelectorAll(".sd-wait").forEach((node) => { node.textContent = "골든벨 학습을 불러오지 못했습니다. 새로고침해 주세요."; });
});
