// 2과정 차시 교재의 「개념 정리」 쪽(DESIGN-COURSE2.md 5절) — 데일리 다음, 공부하기 앞.
// 개념 꾸러미마다 정리 카드(그림 · 용어 · 성질 · 조심할 것) 한 칸 + 예제 빈칸 풀이 한 칸. 예제 답은 맨 뒤 정답 쪽에 싣는다.
// 쪽 꼴은 차시 교재의 다른 쪽(session-book-sheet.js)과 같다 — tb-session-page 안 gold-print-source-item 칸이라 쪽 채우기(compactGoldenBellPrint)가 그대로 흘린다.
import { mathText } from "./math-markup.js?v=20261027p";
import { packsFor } from "./course2-concepts/packs.js?v=20261122f";
const M = (html) => mathText(String(html ?? ""));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const strip = (html) => String(html ?? "").replace(/<[^>]+>/g, "");
const fig = (f) => f ? `<div class="gold-print-visual tb-pack-fig">${typeof f === "function" ? f() : f}</div>` : "";

export function packPrintPages(spec, { book, session, student = "" }) {
  const [bookId, unit, part] = String(spec || "").split("~");
  const packs = packsFor(bookId, Number(unit), Number(part));
  if (!packs.length) return { pages: "", answers: [] };
  const wm = `${esc(student)} · GFIELD`;
  const answers = [];
  const items = packs.map((pack, k) => {
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
