// 2과정 차시 교재의 「개념 정리」 쪽(DESIGN-COURSE2.md 5절) — 데일리 다음, 공부하기 앞.
// 개념 꾸러미마다 정리 카드(그림 · 용어 · 성질 · 조심할 것) 한 칸 + 예제 빈칸 풀이 한 칸. 예제 답은 맨 뒤 정답 쪽에 싣는다.
// 쪽 꼴은 차시 교재의 다른 쪽(session-book-sheet.js)과 같다 — tb-session-page 안 gold-print-source-item 칸이라 쪽 채우기(compactGoldenBellPrint)가 그대로 흘린다.
import { mathText } from "./math-markup.js?v=20261122i";
import { packsFor } from "./course2-concepts/packs.js?v=20261122k";
const M = (html) => mathText(String(html ?? ""));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const strip = (html) => String(html ?? "").replace(/<[^>]+>/g, "");
const fig = (f) => f ? `<div class="gold-print-visual tb-pack-fig">${typeof f === "function" ? f() : f}</div>` : "";

// 개념 정리 새 꼴(원장 2026-11-22 「이런 식의 교재 디자인 구성」 → 시범 → 「왼쪽 한 칸 더 연습 · 표 안에 식이 잘 나와야지 식이 한 개씩밖에 안 나와 · 너무 구식이야」):
// 주소 &packlook=board일 때만. 스킬 gfield-textbook-design 4절 교재형 — 옅은 초록 개념 상자(왼쪽 굵은 띠) → 식 띠(식 한 줄을 통째로) → 연습 두 칸(한 번 풀기 | 단계 칸 예제).
// 얇은 선·여백만, 큰 카드·칠판 틀·그라데이션 없음. 색은 인쇄 규칙(종이 · 깊은 초록 · 감색 점 강조).
const CIRCLED = ["①", "②", "③", "④", "⑤", "⑥"];
// 식 칠판(pack-kit formulas)의 줄을 꺼내, + − = 로 시작하는 이어진 줄은 앞 줄에 붙여 식 하나를 한 줄로 만든다(화면 덱은 좁아서 나눠 둔 것)
function equationLines(f) {
  const html = typeof f === "function" ? f() : String(f || "");
  if (!html.includes("pk-board-line")) return null;
  const lines = [...html.matchAll(/<div class="pk-board-line">([\s\S]*?)<\/div>/g)].map((m) => m[1]);
  return lines.reduce((out, line) => {
    const lead = line.replace(/<[^>]+>/g, "").trim()[0];
    if (out.length && "+−-=×÷…".includes(lead)) out[out.length - 1] += ` ${line}`; else out.push(line);
    return out;
  }, []);
}
const equationBand = (f, cls = "") => {
  if (!f) return "";
  const lines = equationLines(f);
  if (lines) return `<div class="tb-eq-band ${cls}">${lines.map((l) => `<span class="tb-eq">${l}</span>`).join("")}</div>`;
  return `<div class="tb-eq-band is-figure ${cls}">${typeof f === "function" ? f() : f}</div>`;
};
function boardItems(pack, k, answers) {
  const s = pack.summary, e = pack.example, r = pack.recall;
  answers.push({ no: `한 번 풀기 ${k + 1}`, label: "개념 정리", html: `${M(esc(r.ask))} <b>${CIRCLED[r.answer] || ""} ${M(esc(r.options[r.answer]))}</b>` });
  answers.push({ no: `예제 ${k + 1}`, label: "개념 정리", html: e.steps.map((step, i) => `${CIRCLED[i] || ""} ${M(esc(strip(step.ask)))} <b>${M(esc(step.answer))}${esc(step.unit || "")}</b>`).join("<br>") });
  const concept = `<section class="gold-print-source-item full-width-exercise tb-item tb-nc">
    <div class="tb-nc-box"><div class="tb-nc-head"><span class="tb-nc-tag">개념 ${k + 1}</span><h3>${esc(pack.title)}</h3><img class="tb-nc-teacher" src="./assets/docssam-math/A3-mouth-open.webp" alt=""></div>
      ${s.terms?.length ? `<dl class="tb-nc-terms">${s.terms.map(([t, d]) => `<div><dt>${esc(t)}</dt><dd>${M(d)}</dd></div>`).join("")}</dl>` : ""}
      <ol class="tb-nc-facts">${s.facts.map((f) => `<li>${M(f)}</li>`).join("")}</ol>
      ${pack.pitfall ? `<p class="tb-nc-pitfall"><b>조심</b>${M(esc(pack.pitfall))}</p>` : ""}
    </div>${equationBand(s.figure)}</section>`;
  const practice = `<section class="gold-print-source-item full-width-exercise tb-item tb-nc-practice">
    <div class="tb-nc-cols">
      <div class="tb-nc-col"><div class="tb-nc-cap"><span>한 번 풀기</span></div>
        <p class="tb-nc-lead">${M(r.text)}</p><p class="tb-nc-ask">${M(esc(r.ask))}</p>
        <div class="tb-nc-opts">${r.options.map((o, i) => `<span>${CIRCLED[i]} ${M(esc(o))}</span>`).join("")}</div></div>
      <div class="tb-nc-col"><div class="tb-nc-cap"><span>예제 ${k + 1} · 단계 칸</span></div>
        <p class="tb-nc-ask">${M(e.prompt)}</p>
        <ol class="tb-nc-steps">${e.steps.map((step, i) => `<li><b>${CIRCLED[i] || i + 1}</b><span class="tb-nc-q">${M(step.ask)}</span><span class="tb-nc-ans"></span>${step.unit ? `<span class="tb-nc-unit">${esc(step.unit)}</span>` : ""}</li>`).join("")}</ol></div>
    </div>${equationBand(e.figure, "is-hint")}</section>`;
  return concept + practice;
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
