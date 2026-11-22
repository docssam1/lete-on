// 2과정 차시 교재의 「개념 정리」 쪽(DESIGN-COURSE2.md 5절) — 데일리 다음, 공부하기 앞.
// 개념 꾸러미마다 정리 카드(그림 · 용어 · 성질 · 조심할 것) 한 칸 + 예제 빈칸 풀이 한 칸. 예제 답은 맨 뒤 정답 쪽에 싣는다.
// 쪽 꼴은 차시 교재의 다른 쪽(session-book-sheet.js)과 같다 — tb-session-page 안 gold-print-source-item 칸이라 쪽 채우기(compactGoldenBellPrint)가 그대로 흘린다.
import { mathText } from "./math-markup.js?v=20261122i";
import { packsFor } from "./course2-concepts/packs.js?v=20261122i";
const M = (html) => mathText(String(html ?? ""));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const strip = (html) => String(html ?? "").replace(/<[^>]+>/g, "");
const fig = (f) => f ? `<div class="gold-print-visual tb-pack-fig">${typeof f === "function" ? f() : f}</div>` : "";

// 칠판 꼴(원장 2026-11-22 「이런 식의 교재 디자인 구성」 → 「시범 한 차시만 더 보고 결정 · 색은 지금 인쇄 규칙」): 주소 &packlook=board일 때만.
// 칠판 개념 상자(독쌤 + 제목 + 용어·성질 줄) → 그림·조심 → 나의 메모장(되짚기 한 문제) → 단계 칸 예제(①②③ 칸 채우기). 색은 종이색·깊은 초록·빨강 강조 그대로.
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥"];
function boardItems(pack, k, answers) {
  const s = pack.summary, e = pack.example, r = pack.recall;
  answers.push({ no: `메모장 ${k + 1}`, label: "개념 정리", html: `${M(esc(r.ask))} <b>${CIRCLED[r.answer] || ""} ${M(esc(r.options[r.answer]))}</b>` });
  answers.push({ no: `예제 ${k + 1}`, label: "개념 정리", html: e.steps.map((step, i) => `${CIRCLED[i] || ""} ${M(esc(strip(step.ask)))} <b>${M(esc(step.answer))}${esc(step.unit || "")}</b>`).join("<br>") });
  const lines = [...(s.terms || []).map(([t, d]) => `<b>${esc(t)}</b> — ${M(d)}`), ...s.facts.map((f) => M(f))];
  const board = `<section class="gold-print-source-item full-width-exercise tb-item tb-pack-board"><h2><span>개념 ${k + 1}</span>${esc(pack.title)}</h2>
    <div class="tb-board"><img class="tb-board-teacher" src="./assets/docssam-math/A3-mouth-open.webp" alt=""><div class="tb-board-chalk"><h3>${esc(pack.title)}</h3><div class="tb-board-rule"></div>${lines.map((l) => `<p>${l}</p>`).join("")}</div></div>
    <div class="tb-pack-row">${fig(s.figure)}<div class="tb-pack-text">${pack.pitfall ? `<p class="tb-pack-pitfall"><b>조심</b> ${M(esc(pack.pitfall))}</p>` : ""}</div></div></section>`;
  const memo = `<section class="gold-print-source-item full-width-exercise tb-item tb-pack-memo"><div class="tb-memo"><span class="tb-memo-cap">나의 메모장 · 한 문제</span>
    <div class="tb-memo-body"><p>${M(r.text)}</p><p class="tb-memo-ask">${M(esc(r.ask))}</p><div class="tb-memo-opts">${r.options.map((o, i) => `<span>${CIRCLED[i]} ${M(esc(o))}</span>`).join("")}</div></div></div></section>`;
  const train = `<section class="gold-print-source-item full-width-exercise tb-item tb-pack-train"><h2><span>예제 ${k + 1}</span>단계 칸 연습</h2>
    <div class="tb-pack-row">${fig(e.figure)}<div class="tb-pack-text"><p class="tb-pack-prompt">${M(e.prompt)}</p>
      <ol class="tb-train-rows">${e.steps.map((step, i) => `<li><b>${CIRCLED[i] || i + 1}</b> ${M(step.ask)} <span class="tb-train-box"></span>${esc(step.unit || "")}</li>`).join("")}</ol>
    </div></div></section>`;
  return board + memo + train;
}

export function packPrintPages(spec, { book, session, student = "", look = "" }) {
  const [bookId, unit, part] = String(spec || "").split("~");
  const packs = packsFor(bookId, Number(unit), Number(part));
  if (!packs.length) return { pages: "", answers: [] };
  const wm = `${esc(student)} · GFIELD`;
  const answers = [];
  const items = packs.map((pack, k) => {
    if (look === "board") return boardItems(pack, k, answers);
    const s = pack.summary, e = pack.example;
    const summary = `<section class="gold-print-source-item full-width-exercise tb-item tb-pack-summary"><h2><span>개념 ${k + 1}</span>${esc(pack.title)}</h2>
      <div class="tb-pack-row">${fig(s.figure)}<div class="tb-pack-text">
        ${s.terms?.length ? `<dl class="tb-pack-terms">${s.terms.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${M(d)}</dd></div>`).join("")}</dl>` : ""}
        <ol class="tb-pack-facts">${s.facts.map((f) => `<li>${M(f)}</li>`).join("")}</ol>
        ${pack.pitfall ? `<p class="tb-pack-pitfall"><b>조심</b> ${M(esc(pack.pitfall))}</p>` : ""}
      </div></div></section>`;
    answers.push({ no: `예제 ${k + 1}`, label: "개념 정리", html: e.steps.map((step) => `${M(esc(strip(step.ask)))} <b>${M(esc(step.answer))}${esc(step.unit || "")}</b>`).join("<br>") });
    const example = `<section class="gold-print-source-item full-width-exercise tb-item tb-pack-example"><h2><span>예제 ${k + 1}</span>${esc(pack.title)}</h2>
      <div class="tb-pack-row">${fig(e.figure)}<div class="tb-pack-text"><p class="tb-pack-prompt">${M(e.prompt)}</p>
        <ol class="tb-pack-steps">${e.steps.map((step) => `<li>${M(step.ask)} <span class="tb-pack-blank"></span>${esc(step.unit || "")}</li>`).join("")}</ol>
      </div></div></section>`;
    return summary + example;
  }).join("");
  const head = `<header class="gold-print-head"><div><span>CONCEPT · 개념 정리</span><h1>${esc(book.label)} ${esc(session.label)} · 개념 정리</h1></div><dl><div><dt>이름</dt><dd>${esc(student)}</dd></div><div><dt>날짜</dt><dd></dd></div></dl></header>`;
  const pages = `<article class="gold-print-page source-practice-print tb-session-page tb-pack-page" data-print-book="${esc(book.id)}" data-print-lesson="session-concept" data-print-part="original-1" data-watermark="${wm}">${head}<section class="gold-print-block">${items}</section><footer class="gold-print-footer">${esc(book.label)} · ${esc(session.range)}</footer></article>`;
  return { pages, answers };
}
