import { CURRICULUM, typeById } from "./source-data.js?v=20261024r";
import { saveRecord } from "./study-progress.js?v=20261028g";

// 권별테스트 원문 풀기 (원장 지시 2026-10-24): 「교재 권별테스트는 원본 문제 그대로 1세트가 있고, 유사문제로 공부하는 거야.」
// 원문 쪽 그림을 그대로 보여 주고(답은 없다), 학생이 답안지에 적고 ○✕로 채점한 뒤
// 틀린 번호만 문제은행 유사문제(같은 구조, 새 숫자)로 다시 푼다. 원문 정답은 이 화면에 두지 않는다 — 채점은 선생님 답지로.
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
function renderDiagnosis() {
  const box = $("diagnosis");
  const marked = questions.filter(({ number }) => sheet[number]?.mark);
  if (!marked.length) { box.hidden = true; box.innerHTML = ""; return; }
  const rows = new Map();
  for (const question of questions) {
    const type = typeById(question.typeId);
    const key = type?.id || question.label;
    const row = rows.get(key) || { label: type ? `${type.middle} · ${type.label}` : question.label, typeId: type?.id, numbers: [], right: 0, wrong: 0 };
    row.numbers.push(question.number);
    if (sheet[question.number]?.mark === "right") row.right += 1;
    if (sheet[question.number]?.mark === "wrong") row.wrong += 1;
    rows.set(key, row);
  }
  const list = [...rows.values()].sort((a, b) => b.wrong - a.wrong);
  const weak = list.filter((row) => row.wrong && row.typeId);
  // 「내 학습 상황」에 남긴다(원문 답은 남기지 않고 점수·틀린 번호·약점 유형 id만)
  saveRecord(student, "book-test", book.id, {
    right: marked.filter(({ number }) => sheet[number].mark === "right").length, total: questions.length, marked: marked.length,
    wrong: questions.filter(({ number }) => sheet[number]?.mark === "wrong").map(({ number }) => number), weak: weak.map((row) => row.typeId)
  });
  box.hidden = false;
  box.innerHTML = `<h3 id="diagnosisHeading">유형별 진단</h3>
    <ol class="ut-diag-rows">${list.map((row) => `<li class="${row.wrong ? "is-weak" : row.right === row.numbers.length ? "is-clear" : ""}"><span>${esc(row.label)}</span><small>${row.numbers.join("·")}번</small><b>${row.wrong ? `✕ ${row.wrong}` : row.right === row.numbers.length ? "○" : "–"}</b></li>`).join("")}</ol>
    ${weak.length ? `<a class="ut-btn primary" href="${esc(weakTypeLink(weak.map((row) => row.typeId)))}">약점 유형 공부하기 · ${weak.length}유형 × 2문제</a>` : marked.length === questions.length ? `<p class="ut-diag-clear">약점 유형이 없어요. 잘했어요!</p>` : ""}`;
}

document.title = `${book.label} 권별테스트 원문 풀기`;
$("title").textContent = `${book.label} 권별테스트 · 원문`;
$("eyebrow").textContent = `GIFTED MATH BANK · 1과정 · ${book.title}`;
$("backLink").href = `./start.html?${new URLSearchParams({ student, book: book.id, door: "test" })}`;
$("pages").innerHTML = Array.from({ length: book.source.unitTestPageCount }, (_, index) => {
  const page = String(index + 1).padStart(2, "0");
  return `<figure><img src="./assets/unit-tests/${folder}/page-${page}.png?v=20261024a" alt="${esc(book.label)} 권별테스트 원문 ${index + 1}쪽" loading="${index > 1 ? "lazy" : "eager"}" /></figure>`;
}).join("");
$("watermark").innerHTML = Array.from({ length: 4 }, () => `<span>${esc(student)} · GFIELD · ${esc(student)} · GFIELD · ${esc(student)}</span>`).join("");

function renderSheet() {
  $("sheet").innerHTML = questions.map(({ number, label }) => {
    const entry = sheet[number] || {};
    return `<li class="ut-row ${entry.mark ? `is-${entry.mark}` : ""}">
      <b>${number}</b>
      <input type="text" inputmode="text" autocomplete="off" data-answer="${number}" value="${esc(entry.answer || "")}" aria-label="${number}번 답" />
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

$("sheet").addEventListener("input", (event) => {
  const number = event.target.dataset.answer;
  if (!number) return;
  sheet[number] = { ...sheet[number], answer: event.target.value };
  save();
});
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
  if (!window.confirm("적은 답과 채점을 모두 지울까요?")) return;
  for (const key of Object.keys(sheet)) delete sheet[key];
  save();
  renderSheet();
});
$("printButton").addEventListener("click", () => window.print());
renderSheet();
