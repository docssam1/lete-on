// 한 차시 교재(golden-bell.html?sessionbook=1)의 데일리 테스트·본책·오늘의 과제·단원 평가 쪽 — 문제은행 학습지(index.html?…&as=student&week=1)를
// 숨은 창에서 만들어 그 카드의 문제 글·그림·답 칸을 워밍업 교재 꼴 쪽으로 옮긴다(아래 importSessionPages). 문제를 새로 그리지 않는다.

const READY_TIMEOUT = 30000;

function waitFor(test, timeout = READY_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    (function poll() {
      const value = test();
      if (value) return resolve(value);
      if (performance.now() - start > timeout) return reject(new Error("sheet_timeout"));
      setTimeout(poll, 120);
    })();
  });
}

// ── 교재 조판(원장 2026-11-17 「교재 인쇄본은 정해졌으니 … 깔끔하게 만들자 · 시험지 형태가 아니라」) ──
// 문제은행 학습지(시험지 꼴: 이름·점수 머리, 카드 테두리, 유형 경로, 단계 띠, 쪽당 2문항)를 워밍업 교재와 같은 꼴로 다시 짠다.
// 카드의 문제 글·그림·답 칸만 꺼내 워밍업 쪽 부품(gold-print-head · gold-print-source-item · gold-print-footer)에 담고,
// 쪽 나누기는 워밍업과 같은 compactGoldenBellPrint(인쇄 규칙으로 재어 두 단에 채움)가 한다. 그림은 새로 그리지 않는다.
// 묶음: 데일리 테스트 · 본책(활동·확인·연습·도전 — 활동 묶음 앞에 「생각할 개념」 한 번) · 오늘의 과제 · 단원 평가 — 묶음마다 새 쪽.
const escText = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const DROP = ".question-edit-tools,.question-top,.question-style-tags,.study-stage-banner,.question-reference,.textbook-concept-tutorial,.question-prompt,.choice-buttons,.answer-line,.concept-worked-solution,.student-check,.question-concept,.concept-guide,details";
function kindOf(ref) {
  if (/데일리 테스트/u.test(ref)) return "daily";
  if (/^본책/u.test(ref)) return "book";
  if (/오늘의 과제/u.test(ref)) return "homework";
  if (/단원 평가/u.test(ref)) return "unittest";
  return "book";
}
function cardItem(card) {
  const ref = card.querySelector(".question-reference")?.textContent.trim() || "";
  const type = (card.querySelector(".question-type")?.textContent.trim() || "").split(" · ").pop();
  const prompt = (card.querySelector(".question-prompt .print-only") || card.querySelector(".question-prompt"))?.innerHTML || "";
  const tutorial = card.querySelector(".textbook-concept-tutorial")?.outerHTML || "";
  const rest = card.cloneNode(true);
  rest.querySelectorAll(DROP).forEach((node) => node.remove());
  [...rest.children].forEach((node) => { if (node.matches(".screen-only")) node.remove(); });
  // 옆으로 긴 그림(색종이 접는 차례·장면 줄 등, 가로가 세로의 2.3배 넘게)은 반 칸에서 너무 작아지므로 두 칸을 다 쓴다
  const wide = [...rest.querySelectorAll("svg[viewBox]")].some((svg) => {
    const [, , w, h] = svg.getAttribute("viewBox").split(/[\s,]+/u).map(Number);
    return w > 0 && h > 0 && w / h > 2.3;
  }) || Boolean(rest.querySelector(".b4-fold-line-problem,.fold-sequence,.b4-fold-sequence"));
  const book = /^본책\s+(\S+)\s+(\S+?)번/u.exec(ref);
  const finish = (answerHtml, answerVisual) => ({ ref, kind: kindOf(ref), stage: book?.[1] || "", no: book?.[2] || "", block: book ? `${book[1]} ${book[2].split("-")[0]}` : "", type, prompt, tutorial,
    visual: rest.innerHTML.trim(), answer: Boolean(card.querySelector(".answer-line")), wide, answerHtml, answerVisual });
  // 정답(뒤쪽 정답 쪽에 싣는다, 원장 2026-11-17 「뒤에 답안도 인쇄 되어야지」): 카드의 손글씨 정답 칸 그대로.
  // 인쇄 교재에는 고르기 보기가 없으므로 「3번 (8)」은 값 「8」만 남긴다(보기가 그림 자체인 문제는 「3번」 그대로).
  const answerBox = card.querySelector(".student-answer")?.cloneNode(true);
  answerBox?.querySelector(":scope > strong")?.remove();
  const answerVisual = Boolean(answerBox?.querySelector("svg,img,.visual"));
  let answerHtml = answerBox ? answerBox.innerHTML.trim() : "";
  // 「1번」처럼 번호만 있는 고르기 정답: 인쇄 교재에는 보기가 없으니 그 보기 그림을 정답 칸에 옮긴다(app.js pickTilesOf와 같은 찾기)
  const pickNo = !answerVisual && /^(?:<span[^>]*>)?\s*(\d+번)\s*(?:<\/span>)?$/u.exec(answerHtml)?.[1];
  if (pickNo) {
    const labels = [...card.querySelectorAll(".choice-buttons [data-choice]")].map((button) => button.dataset.choice);
    const visual = card.querySelector(".visual");
    let tile = null;
    if (visual && labels.length > 1) for (const box of visual.querySelectorAll("*")) {
      if (box.closest(".print-draw") || box.children.length !== labels.length) continue;
      const kids = [...box.children];
      if (kids.every((kid, k) => kid.textContent.includes(labels[k]))) { tile = kids[labels.indexOf(pickNo)] || null; break; }
    }
    if (tile) return finish(tile.outerHTML, true);
  }
  if (!answerVisual) answerHtml = answerHtml.replace(/^(?:<span[^>]*>)?\s*\d+번\s*\(([^()]+)\)\s*(?:<\/span>)?$/u, "$1");
  return finish(answerHtml, answerVisual);
}

const KIND = {
  daily: { kick: "DAILY TEST · 데일리 테스트", score: true, lead: (n) => `지난 차시에 배운 것을 ${n}문제로 확인해요. 다 풀고 맞은 개수를 위에 적어요.`, leadTitle: "어제 배운 것 확인" },
  book: { kick: "BOOK · 본책" },
  homework: { kick: "HOMEWORK · 오늘의 과제", lead: () => "오늘 배운 유형을 한 문제씩 다시 풀어 봐요.", leadTitle: "집에서 한 번 더" },
  unittest: { kick: "UNIT TEST · 단원 평가", score: true, lead: (n) => `이 단원에서 배운 것을 ${n}문제로 확인해요. 다 풀고 맞은 개수를 위에 적어요.`, leadTitle: "단원 마무리" }
};

// 학습지 주소 → 워밍업 꼴 쪽(<article class="gold-print-page">)들의 HTML. book = {id,label}, session = {label,range}
export async function importSessionPages(url, { book, session, student = "" }) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;visibility:hidden";
  frame.src = url;
  document.body.append(frame);
  try {
    const doc = await waitFor(() => frame.contentDocument?.querySelector("#questionGrid .question-page") && frame.contentDocument);
    await frame.contentWindow.document.fonts?.ready;
    await Promise.all([...doc.querySelectorAll("#worksheetSection img")].map((image) => image.decode?.().catch(() => null)));
    const have = new Set([...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => new URL(link.href, location.href).href));
    const loads = [];
    for (const link of doc.querySelectorAll('link[rel="stylesheet"]')) {
      const href = new URL(link.getAttribute("href"), frame.contentWindow.location.href).href;
      if (have.has(href)) continue;
      have.add(href);
      const own = document.createElement("link");
      own.rel = "stylesheet"; own.href = href; own.dataset.sessionSheet = "1";
      loads.push(new Promise((resolve) => { own.onload = own.onerror = resolve; }));
      document.head.append(own);
    }
    await Promise.all(loads);
    // 그림 규칙이 학습지 몸 class(as-student · week-book …)와 카드(.question-card) 아래에 걸려 있어 그 둘을 감싸개로 남긴다(화면 색 bank-ui는 뺀다)
    const scope = [...doc.body.classList].filter((name) => name !== "bank-ui").join(" ");
    const items = [...doc.querySelectorAll("#questionGrid .question-card")].map(cardItem);
    const groups = [];
    items.forEach((item) => { if (groups.at(-1)?.kind !== item.kind) groups.push({ kind: item.kind, items: [] }); groups.at(-1).items.push(item); });
    const unitWord = String(session.label || "").split(" ")[0];
    const wm = `${escText(student)} · GFIELD`;
    // 정답 쪽 항목(묶음 이름 · 번호 · 정답) — printSessionBook이 모아 맨 뒤에 한 묶음으로 싣는다(sessionAnswerPages)
    const ANSWER_LABEL = { daily: "데일리", book: "본책", homework: "과제", unittest: "평가" };
    const answers = groups.flatMap((group) => group.items.map((item, index) => ({
      no: group.kind === "book" ? (item.no || index + 1) : index + 1,
      label: group.kind === "book" && item.stage ? `본책 ${item.stage}` : ANSWER_LABEL[group.kind],
      html: item.answerHtml, visual: item.answerVisual, scope })));
    const pages = groups.map((group) => {
      const meta = KIND[group.kind];
      const n = group.items.length;
      const title = group.kind === "daily" ? `${unitWord} · ${group.items[0].ref}` : group.kind === "unittest" ? `${unitWord} · 단원 평가` : `${session.label} · ${group.kind === "book" ? "본책" : "오늘의 과제"}`;
      const head = `<header class="gold-print-head"><div><span>${meta.kick}</span><h1>${escText(book.label)} ${escText(title)}</h1></div><dl><div><dt>이름</dt><dd>${escText(student)}</dd></div>${meta.score ? `<div><dt>맞은 개수</dt><dd class="tb-score">/ ${n}</dd></div>` : "<div><dt>날짜</dt><dd></dd></div>"}</dl></header>`;
      const lead = meta.lead ? `<p class="gold-print-concept"><strong>${meta.leadTitle}</strong><br>${meta.lead(n)}</p>` : "";
      const seenBlocks = new Set();
      const blocks = group.items.map((item, index) => {
        let concept = "";
        if (item.tutorial && !seenBlocks.has(item.block)) {
          seenBlocks.add(item.block);
          concept = `<section class="gold-print-source-item full-width-exercise tb-concept-item"><h2><span>개념</span>${escText(item.block)} · 생각할 개념</h2><div class="gold-print-visual tb-concept"><div class="${scope}"><div class="question-card tb-q">${item.tutorial}</div></div></div></section>`;
        }
        const number = group.kind === "book" ? (item.no || index + 1) : index + 1;
        const label = group.kind === "book" && item.stage ? `${item.stage} · ${item.type}` : item.type;
        const visual = item.visual ? `<div class="gold-print-visual"><div class="${scope}"><div class="question-card tb-q">${item.visual}</div></div></div>` : "";
        const answer = item.answer ? `<span class="gold-print-answer"><b>답</b><i></i></span>` : "";
        return `${concept}<section class="gold-print-source-item tb-item${item.wide ? " full-width-exercise" : ""}"><h2><span>${escText(number)}</span>${escText(label)}</h2><p>${item.prompt}</p>${visual}${answer}</section>`;
      }).join("");
      return `<article class="gold-print-page source-practice-print tb-session-page" data-print-book="${escText(book.id)}" data-print-lesson="session-${group.kind}" data-print-part="original-1" data-watermark="${wm}">${head}${lead}<section class="gold-print-block">${blocks}</section><footer class="gold-print-footer">${escText(book.label)} · ${escText(session.range)}</footer></article>`;
    }).join("");
    return { pages, answers };
  } finally {
    frame.remove();
  }
}

// 정답 쪽(맨 뒤): 데일리·본책·과제·평가 정답을 한 묶음으로, 워밍업과 같은 두 단 쪽에. 그림 정답(나누는 선 등)은 그림째.
export function sessionAnswerPages(answers, { book, session, student = "" }) {
  const list = answers.filter((answer) => answer.html);
  if (!list.length) return "";
  const items = list.map((answer) => `<section class="gold-print-source-item tb-answer-item"><h2><span>${escText(answer.no)}</span>${escText(answer.label)}</h2>${answer.visual
    ? `<div class="gold-print-visual tb-ans-visual"><div class="${answer.scope}"><div class="question-card tb-q"><div class="student-answer">${answer.html}</div></div></div></div>`
    : `<p class="tb-ans">${answer.html}</p>`}</section>`).join("");
  return `<article class="gold-print-page source-practice-print tb-session-page tb-answer-page" data-print-book="${escText(book.id)}" data-print-lesson="session-answers" data-print-part="original-1" data-watermark="${escText(student)} · GFIELD"><header class="gold-print-head"><div><span>ANSWERS · 정답</span><h1>${escText(book.label)} ${escText(session.label)} · 정답</h1></div><dl><div><dt>이름</dt><dd>${escText(student)}</dd></div></dl></header><p class="gold-print-concept"><strong>정답</strong><br>데일리 테스트 · 본책 · 오늘의 과제${list.some((a) => a.label === "평가") ? " · 단원 평가" : ""} 정답이에요. 다 풀고 나서 맞춰 봐요.</p><section class="gold-print-block">${items}</section><footer class="gold-print-footer">${escText(book.label)} · ${escText(session.range)} · 정답</footer></article>`;
}
