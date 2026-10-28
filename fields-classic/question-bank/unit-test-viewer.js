import { CURRICULUM, typeById } from "./source-data.js?v=20261028m";
import { saveRecord } from "./study-progress.js?v=20261028n";
import { book01UnitTestOriginal, BOOK01_UNIT_TEST_ORIGINAL_NUMBERS } from "./book01-unit-test-generators.js?v=20261028zb";
import { book01Markup } from "./book01-renderers.js?v=20261028za";

// 권별테스트 원문 풀기 (원장 지시 2026-10-24): 「교재 권별테스트는 원본 문제 그대로 1세트가 있고, 유사문제로 공부하는 거야.」
// 원문을 보여 주고, 다 풀면 「답안 확인 및 진단하기」(원장 2026-10-28 「답을 쓰는 란은 필요없고 … 답안지 인쇄와 o,x를 하면 부족한 영역 진단」)로
// 정답을 보며 ○✕를 누른다. 정답은 git·공개 파일에 없다 — 비공개 DB(fields_unit_test_answer_keys)에서 서버 함수 unit-test-answers 로
// 버튼을 누를 때만 받아 온다(정답이 아직 없는 권은 선생님 답지로 ○✕). 틀린 번호는 문제은행 유사문제(같은 구조, 새 숫자)로 다시 푼다.
// 주소: ?book=book01 (예전 형식) 또는 ?book=book-01

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const requested = String(params.get("book") || "book-01");
const student = params.get("student") || "DEMO";
const book = CURRICULUM.find((item) => item.id === requested || item.id.replace("-", "") === requested) || CURRICULUM[0];
const folder = book.id.replace("-", "");
const storageKey = `fields-classic-unit-test-sheet:${student}:${book.id}`;
const questions = book.source.unitTestQuestions || [];
const ready = new Set(questions.filter((question) => question.verified).map((question) => question.number));
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

function load() {
  try { return JSON.parse(localStorage.getItem(storageKey) || "{}") || {}; } catch { return {}; }
}
const sheet = load();
function save() {
  try { localStorage.setItem(storageKey, JSON.stringify(sheet)); } catch {}
}

function similarLink(numbers) {
  const url = new URLSearchParams({ student, mode: "curriculum", book: book.id, set: "unit-test", fresh: "1", build: "1" });
  if (numbers) url.set("numbers", numbers.join(","));
  return `./index.html?${url}`;
}

// 유형별 진단(원장 2026-10-27 「테스트 O,X 연결해서 진단해 주고 유형별 유사 유형으로 약점 유형 공부하기」):
// ○✕를 유형으로 묶어 약한 유형을 보이고, 그 유형마다 같은 유형 새 문제 2개(교재 연습 단계)로 학습지를 만든다.
function weakTypeLink(typeIds) {
  const picks = typeIds.flatMap((typeId) => [0, 1].map(() => `${typeId}~practice~권별 약점 유형`)).join("|");
  return `./index.html?${new URLSearchParams({ student, mode: "curriculum", book: book.id, picks, build: "1", as: "student", title: `${book.label} 약점 유형 다시 공부하기` })}`;
}
// 부족한 영역 진단: 단원이 아니라 문항마다 달린 분류(대분류 › 중분류)로 묶는다.
// 시험 문항의 유형이 교재 단원 목록에 없는 권이 많아서(8~10권은 25문항 모두) 단원으로는 묶이지 않는다.
const areaOf = (question) => {
  const c = question.classification || {};
  const type = typeById(question.typeId);
  return { key: `${c.majorDomainLabel || type?.domainLabel || ""}|${c.minorDomain || type?.middle || question.label}`, major: c.majorDomainLabel || "", minor: c.minorDomain || type?.middle || question.label };
};
function renderDiagnosis() {
  const box = $("diagnosis");
  const marked = questions.filter(({ number }) => sheet[number]?.mark);
  if (!marked.length) { box.hidden = true; box.innerHTML = ""; return; }
  const rows = new Map();
  for (const question of questions) {
    const area = areaOf(question);
    const row = rows.get(area.key) || { ...area, numbers: [], right: 0, wrong: 0, typeIds: new Set() };
    row.numbers.push(question.number);
    if (sheet[question.number]?.mark === "right") row.right += 1;
    if (sheet[question.number]?.mark === "wrong") { row.wrong += 1; if (typeById(question.typeId)) row.typeIds.add(question.typeId); }
    rows.set(area.key, row);
  }
  const list = [...rows.values()].sort((a, b) => b.wrong / b.numbers.length - a.wrong / a.numbers.length || b.wrong - a.wrong);
  const weak = list.filter((row) => row.wrong);
  const weakTypes = [...new Set(weak.flatMap((row) => [...row.typeIds]))];
  // 「내 학습 상황」에 남긴다(원문 답은 남기지 않고 점수·틀린 번호·약점 유형 id만)
  saveRecord(student, "book-test", book.id, {
    right: marked.filter(({ number }) => sheet[number].mark === "right").length, total: questions.length, marked: marked.length,
    wrong: questions.filter(({ number }) => sheet[number]?.mark === "wrong").map(({ number }) => number), weak: weakTypes
  });
  box.hidden = false;
  box.innerHTML = `<h3 id="diagnosisHeading">부족한 영역 진단</h3>
    <ol class="ut-diag-rows">${list.map((row) => `<li class="${row.wrong ? "is-weak" : row.right === row.numbers.length ? "is-clear" : ""}"><span><small>${esc(row.major)}</small>${esc(row.minor)}</span><small>${row.numbers.join("·")}번</small><b>${row.wrong ? `✕ ${row.wrong}` : row.right === row.numbers.length ? "○" : "–"}</b></li>`).join("")}</ol>
    ${weak.length ? `<p class="ut-diag-weak">더 공부할 영역: <b>${weak.map((row) => esc(row.minor)).join(" · ")}</b></p>${weakTypes.length ? `<a class="ut-btn primary" href="${esc(weakTypeLink(weakTypes))}">약점 영역 공부하기 · ${weakTypes.length}유형 × 2문제</a>` : ""}` : marked.length === questions.length ? `<p class="ut-diag-clear">부족한 영역이 없어요. 잘했어요!</p>` : ""}`;
}

document.title = `${book.label} 권별테스트 원문 풀기`;
$("title").textContent = `${book.label} 권별테스트 · 원문`;
$("eyebrow").textContent = `GIFTED MATH BANK · 1과정 · ${book.title}`;
$("backLink").href = `./start.html?${new URLSearchParams({ student, book: book.id, door: "test" })}`;
// 원문을 우리 시험지 꼴로 다시 짠 권(원장 2026-10-28 「권별 테스트 원문은 폼을 바꾸자 · 글씨체와 색도 · 우리쪽에 맞추자」):
// 수·이름·그림 배치는 원문 그대로, 글꼴(문제 명조 · 번호 Pretendard)·색·그림은 우리 것. 아직 안 옮긴 권은 원문 쪽 그림을 그대로 보인다.
const ORIGINAL_SETS = {
  "book-01": { numbers: BOOK01_UNIT_TEST_ORIGINAL_NUMBERS, get: book01UnitTestOriginal, figure: book01Markup }
};
const original = ORIGINAL_SETS[book.id];
const PER_PAGE = 4;
function originalQuestionMarkup(question) {
  const answer = question.responseKind ? "" : `<p class="ut-q-ans">답 <span aria-hidden="true">(</span><i></i><span aria-hidden="true">)</span></p>`;
  return `<section class="ut-q" aria-label="${question.number}번"><div class="ut-q-head"><b>${question.number}</b><p>${esc(question.prompt)}</p></div><div class="ut-q-fig">${original.figure(question.visual)}</div>${answer}</section>`;
}
function originalPagesMarkup() {
  const questions = original.numbers.map(original.get).filter(Boolean);
  const pages = [];
  for (let start = 0; start < questions.length; start += PER_PAGE) pages.push(questions.slice(start, start + PER_PAGE));
  const course = "1과정";
  const head = (index) => index === 0
    ? `<header class="ut-test-head"><p class="ut-test-band"><span>${esc(course)} · ${esc(book.label)}</span><span>권별 테스트</span></p><h1>${esc(book.title)}</h1><dl><div><dt>이름</dt><dd></dd></div><div><dt>날짜</dt><dd></dd></div><div><dt>맞은 개수</dt><dd><span>/ ${questions.length}</span></dd></div></dl></header>`
    : `<header class="ut-test-run"><span>${esc(course)} · ${esc(book.label)} 권별 테스트</span><span>${esc(book.title)}</span></header>`;
  return pages.map((group, index) => `<article class="ut-test-page" aria-label="${index + 1}쪽">${head(index)}<div class="ut-test-body">${group.map(originalQuestionMarkup).join("")}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>${index + 1}</span></footer></article>`).join("");
}
if (original) {
  document.body.classList.add("is-typeset");
  $("guide").innerHTML = "원문 문제를 우리 시험지로 옮겼어요(수와 그림 배치는 그대로). 공책이나 인쇄한 시험지에 풀고, 다 풀면 <b>답안 확인 및 진단하기</b>를 눌러요. 틀린 번호는 <b>유사문제</b>로 다시 공부합니다.";
}
$("pages").innerHTML = original ? originalPagesMarkup() : Array.from({ length: book.source.unitTestPageCount }, (_, index) => {
  const page = String(index + 1).padStart(2, "0");
  return `<figure><img src="./assets/unit-tests/${folder}/page-${page}.png?v=20261024a" alt="${esc(book.label)} 권별테스트 원문 ${index + 1}쪽" loading="${index > 1 ? "lazy" : "eager"}" /></figure>`;
}).join("");
$("watermark").innerHTML = Array.from({ length: 4 }, () => `<span>${esc(student)} · GFIELD · ${esc(student)} · GFIELD · ${esc(student)}</span>`).join("");

// 정답(비공개 DB) — 「답안 확인 및 진단하기」를 누를 때 한 번 받아 온다
const ANSWER_API = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/unit-test-answers";
let answers = null;
async function loadAnswers() {
  try {
    const response = await fetch(ANSWER_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookId: book.id }) });
    if (!response.ok) return null;
    return (await response.json()).answers || null;
  } catch { return null; }
}
const answerFigure = (entry) => (entry?.visual && original ? original.figure(entry.visual) : "");

function renderSheet() {
  $("sheet").innerHTML = questions.map(({ number, label }) => {
    const entry = sheet[number] || {};
    const key = answers?.[number];
    const figure = answerFigure(key);
    return `<li class="ut-row ${entry.mark ? `is-${entry.mark}` : ""}">
      <b>${number}</b>
      <div class="ut-key">${key ? `<span>${esc(key.text)}</span>${figure ? `<details><summary>답 그림</summary><div class="ut-key-fig">${figure}</div></details>` : ""}` : `<span class="is-off">${answers ? "정답 준비 중" : "선생님 답지로 확인"}</span>`}</div>
      <span class="ut-marks" role="group" aria-label="${number}번 채점">
        <button type="button" data-mark="${number}" data-value="right" aria-pressed="${entry.mark === "right"}" aria-label="${number}번 맞음">○</button>
        <button type="button" data-mark="${number}" data-value="wrong" aria-pressed="${entry.mark === "wrong"}" aria-label="${number}번 틀림">✕</button>
      </span>
      ${ready.has(number)
        ? `<a class="ut-similar" href="${esc(similarLink([number]))}" title="${esc(label)}">유사</a>`
        : `<span class="ut-similar is-off" title="이 번호의 유사문제는 아직 검증 중입니다">준비 중</span>`}
    </li>`;
  }).join("");
  renderFoot();
}

// 답안지(정답지) 인쇄: 시험지와 같은 꼴의 A4 — 번호 · 정답 · 답 그림
function answerPagesMarkup() {
  const items = questions.map(({ number }) => {
    const key = answers?.[number];
    return `<section class="ut-ans-item"><b>${number}</b><div><p>${esc(key?.text || "")}</p>${answerFigure(key) ? `<div class="ut-ans-fig">${answerFigure(key)}</div>` : ""}</div></section>`;
  }).join("");
  return `<header class="ut-test-run"><span>1과정 · ${esc(book.label)} 권별 테스트</span><span>정답</span></header><h2 class="ut-ans-title">${esc(book.title)} · 정답</h2><div class="ut-ans-grid">${items}</div><footer class="ut-test-foot"><span>지필드 영재교육</span><span>정답</span></footer>`;
}
async function openCheck() {
  $("checkStart").hidden = true;
  $("checkPanel").hidden = false;
  $("answerStatus").textContent = "정답을 불러오는 중…";
  if (!answers) answers = await loadAnswers();
  $("answerStatus").textContent = answers ? "정답을 보며 ○ · ✕를 눌러요." : "이 권은 정답이 아직 없어요. 선생님 답지로 ○ · ✕를 눌러요.";
  $("answerPrintButton").hidden = !answers;
  $("answerPages").innerHTML = answers ? answerPagesMarkup() : "";
  renderSheet();
}

function renderFoot() {
  const marked = questions.filter(({ number }) => sheet[number]?.mark);
  const right = marked.filter(({ number }) => sheet[number].mark === "right").length;
  $("sheetScore").textContent = marked.length ? `${right} / ${questions.length} 맞음${marked.length < questions.length ? ` · ${questions.length - marked.length}문항 채점 전` : ""}` : "";
  const wrong = questions.filter(({ number }) => sheet[number]?.mark === "wrong" && ready.has(number)).map(({ number }) => number);
  const wrongOff = questions.filter(({ number }) => sheet[number]?.mark === "wrong" && !ready.has(number)).length;
  const link = $("wrongLink");
  link.textContent = wrong.length ? `틀린 ${wrong.length}문항 유사문제 공부하기` : "틀린 번호 유사문제 공부하기";
  link.setAttribute("aria-disabled", String(!wrong.length));
  link.href = wrong.length ? similarLink(wrong) : "#sheet";
  link.title = wrongOff ? `유사문제가 아직 없는 틀린 번호 ${wrongOff}개는 빠집니다` : "";
  $("allLink").textContent = ready.size === questions.length ? `${questions.length}문항 전체 유사문제` : `준비된 ${ready.size}문항 유사문제`;
  $("allLink").href = similarLink(null);
  renderDiagnosis();
}

$("sheet").addEventListener("click", (event) => {
  const button = event.target.closest("[data-mark]");
  if (!button) return;
  const number = button.dataset.mark;
  const entry = sheet[number] || {};
  sheet[number] = { ...entry, mark: entry.mark === button.dataset.value ? null : button.dataset.value };
  save();
  const row = button.closest(".ut-row");
  row.classList.toggle("is-right", sheet[number].mark === "right");
  row.classList.toggle("is-wrong", sheet[number].mark === "wrong");
  row.querySelectorAll("[data-mark]").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.value === sheet[number].mark)));
  renderFoot();
});
$("wrongLink").addEventListener("click", (event) => {
  if ($("wrongLink").getAttribute("aria-disabled") === "true") event.preventDefault();
});
$("clearButton").addEventListener("click", () => {
  if (!window.confirm("○✕ 채점을 모두 지울까요?")) return;
  for (const key of Object.keys(sheet)) delete sheet[key];
  save();
  renderSheet();
});
$("printButton").addEventListener("click", () => window.print());
$("checkButton").addEventListener("click", openCheck);
$("answerPrintButton").addEventListener("click", () => {
  document.body.classList.add("print-answers");
  window.print();
});
window.addEventListener("afterprint", () => document.body.classList.remove("print-answers"));
// 이미 ○✕를 누른 적이 있으면 바로 열어 둔다
if (questions.some(({ number }) => sheet[number]?.mark)) openCheck();
else renderFoot();
