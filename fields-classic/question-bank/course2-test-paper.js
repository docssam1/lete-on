import { COURSE2_TESTS } from "./course2-test-originals/index.js?v=20261115f";
import { COURSE3_TESTS } from "./course3-test-originals/index.js?v=20261115d";
import { mathText } from "./math-markup.js?v=20261027p";

// 2과정 권별 테스트 시험지 보기·인쇄 — 원장 2026-11-14 「G4 테스트는 다시 만들어」.
// 권마다 course2-test-originals/<권>.js 가 { perPage, meta:{course,book,title}, questions:[{ number, prompt, figure(), answer }] } 를 내보낸다.
// 시험지 꼴은 선발시험·권별 테스트와 같다(unit-test-solve.css + selection-test-paper.css). 정답은 여기 없다 —
// 「답안 확인 및 채점하기」를 누를 때 비공개 표에서 서버 함수 unit-test-answers(bookId course-02-<권>)로 받아 와 ○✕를 고른다(원장 2026-11-14 「좋아」).
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const params = new URLSearchParams(location.search);
const book = String(params.get("book") || "").toLowerCase();
// 3과정도 같은 화면(?course=3&book=a1, 원장 2026-11-15 「다른 과정 권별은 폴더에 있잖아」) — 파일은 course3-test-originals/, 정답 bookId course-03-<권>
const course = params.get("course") === "3" ? 3 : 2;
// 뒤로 = 사고력 문제은행의 그 과정 탭(원장 2026-11-16 「2과정은 사고력 안에 있어야지」)
document.querySelector(".ut-back")?.setAttribute("href", `./similar.html?course=${course}`);
const TESTS = course === 3 ? COURSE3_TESTS : COURSE2_TESTS;
const tag = TESTS[book] || (params.get("preview") === "1" && /^[ag][1-5]$/.test(book) ? String(Date.now()) : "");
const original = tag ? await import(`./course${course}-test-originals/${book}.js?v=${tag}`).catch((error) => { console.error(error); return null; }) : null;

function questionMarkup(question) {
  const blank = (a) => `<span class="st-ans">${mathText(esc(a.label || "답"))} <span aria-hidden="true">(</span><i></i><span aria-hidden="true">)</span>${a.unit ? esc(a.unit) : ""}</span>`;
  const list = [].concat(question.answer || []);
  const answer = list.length ? `<p class="ut-q-ans${list.length > 1 ? " is-multi" : ""}">${list.map(blank).join("")}</p>` : "";
  return `<section class="ut-q" aria-label="${question.number}번"><div class="ut-q-head"><b>${question.number}</b><p>${question.mathPrompt ? mathText(esc(question.prompt)) : esc(question.prompt)}</p></div><div class="ut-q-fig">${question.figure ? question.figure() : ""}</div>${answer}</section>`;
}
function pagesMarkup() {
  const { questions, meta } = original;
  const per = original.perPage || 4;
  const band = `${meta.course} · ${meta.book}`;
  const pages = [];
  for (let start = 0; start < questions.length; start += per) pages.push(questions.slice(start, start + per));
  const head = (index) => index === 0
    ? `<header class="ut-test-head"><p class="ut-test-band"><span>${esc(band)}</span><span>권별 테스트</span></p><h1>${esc(meta.title)}</h1><dl><div><dt>이름</dt><dd></dd></div><div><dt>날짜</dt><dd></dd></div><div><dt>맞은 개수</dt><dd><span>/ ${questions.length}</span></dd></div></dl></header>`
    : `<header class="ut-test-run"><span>${esc(band)} 권별 테스트</span><span>${esc(meta.title)}</span></header>`;
  return pages.map((group, index) => `<article class="ut-test-page ${per === 2 ? "st-two" : ""}" aria-label="${index + 1}쪽">${head(index)}<div class="ut-test-body">${group.map(questionMarkup).join("")}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>${index + 1}</span></footer></article>`).join("");
}

// ── 답안 확인 · 채점(○✕는 이 기기에만 기억)
const ANSWER_API = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/unit-test-answers";
const student = params.get("student") || "DEMO";
const storageKey = course === 3 ? `fields-classic-course3-test:${student}:${book}` : `fields-classic-course2-test:${student}:${book}`;
const load = () => { try { return JSON.parse(localStorage.getItem(storageKey) || "{}") || {}; } catch { return {}; } };
const sheet = load();
const save = () => { try { localStorage.setItem(storageKey, JSON.stringify(sheet)); } catch { /* 저장 안 되는 기기 */ } };
let answers = null;
async function loadAnswers() {
  try {
    const response = await fetch(ANSWER_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookId: `course-0${course}-${book}` }) });
    if (!response.ok) return null;
    return (await response.json()).answers || null;
  } catch { return null; }
}
const numbers = () => (original?.questions || []).map((q) => q.number);
function renderSheet() {
  $("sheet").innerHTML = numbers().map((n) => {
    const mark = sheet[n];
    const key = answers?.[n];
    return `<li class="ut-row ${mark ? `is-${mark}` : ""}"><b>${n}</b>
      <div class="ut-key">${key ? `<span>${mathText(esc(key.text))}</span>` : `<span class="is-off">${answers ? "정답 준비 중" : "선생님 답지로 확인"}</span>`}</div>
      <span class="ut-marks" role="group" aria-label="${n}번 채점">
        <button type="button" data-mark="${n}" data-value="right" aria-pressed="${mark === "right"}" aria-label="${n}번 맞음">○</button>
        <button type="button" data-mark="${n}" data-value="wrong" aria-pressed="${mark === "wrong"}" aria-label="${n}번 틀림">✕</button>
      </span></li>`;
  }).join("");
  renderFoot();
}
function renderFoot() {
  const all = numbers();
  const marked = all.filter((n) => sheet[n]);
  const right = marked.filter((n) => sheet[n] === "right").length;
  $("sheetScore").textContent = marked.length ? `${right} / ${all.length} 맞음${marked.length < all.length ? ` · ${all.length - marked.length}문항 채점 전` : ""}` : "";
  const wrong = all.filter((n) => sheet[n] === "wrong");
  $("wrongList").textContent = wrong.length ? `틀린 번호: ${wrong.join(", ")}번` : "";
}
function answerPagesMarkup() {
  const { meta } = original;
  const items = numbers().map((n) => `<section class="ut-ans-item"><b>${n}</b><div><p>${mathText(esc(answers?.[n]?.text || ""))}</p></div></section>`).join("");
  return `<header class="ut-test-run"><span>${esc(meta.course)} · ${esc(meta.book)} 권별 테스트</span><span>정답</span></header><h2 class="ut-ans-title">${esc(meta.title)} · 정답</h2><div class="ut-ans-grid">${items}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>정답</span></footer>`;
}
async function openCheck() {
  $("checkStart").hidden = true;
  $("checkPanel").hidden = false;
  $("answerStatus").textContent = "정답을 불러오는 중…";
  if (!answers) answers = await loadAnswers();
  $("answerStatus").textContent = answers ? "정답을 보며 ○ · ✕를 눌러요." : "정답을 불러오지 못했어요. 선생님 답지로 ○ · ✕를 눌러요.";
  $("answerPrintButton").hidden = !answers;
  $("answerPages").innerHTML = answers ? answerPagesMarkup() : "";
  renderSheet();
}
$("sheet").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mark]");
  if (!button) return;
  const n = button.dataset.mark;
  sheet[n] = sheet[n] === button.dataset.value ? undefined : button.dataset.value;
  if (!sheet[n]) delete sheet[n];
  save();
  renderSheet();
});
$("clearButton").addEventListener("click", () => {
  if (!window.confirm("○✕ 채점을 모두 지울까요?")) return;
  for (const key of Object.keys(sheet)) delete sheet[key];
  save();
  renderSheet();
});
$("checkButton").addEventListener("click", openCheck);
$("answerPrintButton").addEventListener("click", () => { document.body.classList.add("print-answers"); window.print(); });
window.addEventListener("afterprint", () => document.body.classList.remove("print-answers"));

if (!original) {
  $("title").textContent = "권별 테스트";
  $("pages").innerHTML = `<p class="st-empty">이 권의 시험지는 아직 준비 중이에요.</p>`;
  $("printButton").hidden = true;
  document.querySelector(".ut-sheet").hidden = true;
} else {
  document.title = `${original.meta.course} ${original.meta.book} 권별 테스트`;
  $("title").textContent = `${original.meta.book} 권별 테스트 · ${original.meta.title}`;
  $("eyebrow").textContent = `${original.meta.course} · ${original.questions.length}문항`;
  document.body.classList.add("is-typeset");
  $("pages").innerHTML = pagesMarkup();
  $("printButton").addEventListener("click", () => window.print());
  if (Object.keys(sheet).length) openCheck();
}
