function printRules(rules) {
  return [...rules].map((rule) => {
    if (rule.type === CSSRule.MEDIA_RULE) {
      return /\bprint\b/.test(rule.conditionText) ? printRules(rule.cssRules) : "";
    }
    if (rule.type === CSSRule.PAGE_RULE || rule.type === CSSRule.IMPORT_RULE) return "";
    return rule.cssText;
  }).join("\n");
}

function contentFits(page) {
  const footerTop = page.querySelector(":scope > .gold-print-footer").getBoundingClientRect().top;
  return [...page.children].filter((node) => !node.matches(".gold-print-footer,.gold-cover-art"))
    .every((node) => node.getBoundingClientRect().bottom <= footerTop - 8);
}

function exerciseFamily(page) {
  const part = page.dataset.printPart;
  if (part.startsWith("story-")) return "story";
  if (part.startsWith("original-")) return "source";
  if (part.startsWith("answers-")) return "answer";
  return null;
}

function exerciseNodes(page) {
  const family = exerciseFamily(page);
  if (!family) return null;
  return [...page.querySelectorAll(family === "story" ? ".gold-print-story" : ".gold-print-source-item")];
}

function needsFullWidth(question) {
  if (question.querySelectorAll(".gold-print-part-answers > span").length > 4) return true;
  const rect = question.getBoundingClientRect();
  return [...question.querySelectorAll("*")].some((node) => node instanceof HTMLElement
    && node.clientWidth > 0 && (node.scrollWidth > node.clientWidth + 2
      || node.getBoundingClientRect().right > rect.right + 2));
}

// 그림이 정해진 칸 높이보다 크면(예전엔 통째로 줄였다 — 0.55배까지) 구조를 바꿔 크게 둔다(원장 2026-11-19 「구조를 바꿔 크게 만들어」):
// ① 반 칸 문제는 한 줄 전체 폭으로 펴 보고 ② 그래도 넘치면 그림 칸 높이를 그림만큼 늘린다. 한 쪽에 다 못 들어가면 그때만 줄인다(fitClippedVisuals).
function visualOverflows(question) {
  return [...question.querySelectorAll(".gold-print-visual > *")]
    .some((box) => box.clientHeight && box.scrollHeight > box.clientHeight + 2);
}

// 문항이 실제로 차지하는 높이(칸 줄 높이로 늘어난 것 말고 속 내용 끝까지)
function contentHeight(question) {
  const top = question.getBoundingClientRect().top;
  return Math.max(0, ...[...question.children].map((child) => child.getBoundingClientRect().bottom - top));
}

// 반 칸에서 그림 칸만 늘린 것과 한 줄 전체로 편 것 중 종이를 덜 쓰는 쪽(반 칸 = 폭 절반이니 높이가 두 배 안쪽이면 반 칸)
function enlargeVisual(question) {
  if (!visualOverflows(question)) return;
  if (!question.classList.contains("full-width-exercise")) {
    question.classList.add("print-visual-grow");
    const halfHeight = contentHeight(question);
    question.classList.remove("print-visual-grow");
    question.classList.add("full-width-exercise");
    if (!visualOverflows(question) && halfHeight > 2 * contentHeight(question)) { question.dataset.printWidened = "1"; return; }
    question.classList.remove("full-width-exercise");
  }
  question.classList.add("print-visual-grow");
}

// 늘린 그림 때문에 문제가 다음 쪽으로 밀려 앞 쪽이 비면(쪽만 늘고 한 문제만 남는 쪽) 그 그림만 조금(0.8배까지) 줄여 이 쪽에 남겨 본다.
const KEEP_ZOOMS = [0.92, 0.85, 0.8];
// 묶음의 마지막 문제가 혼자 새 쪽으로 넘어가면(쪽 하나에 한 문제) 그림을 0.7배까지 줄여서라도 앞 쪽에 남긴다.
const LAST_ZOOMS = [0.92, 0.85, 0.8, 0.75, 0.7];
// 처음부터 큰 그림(키우지 않은 그림)이라도 0.8배까지만 줄여 이 쪽에 남겨 본다 — 쪽 아래가 크게 비는 것보다 낫다(원장 2026-11-21 「빈 쪽 없게」)
function zoomToStay(question, sheet, { last = false } = {}) {
  const boxes = [...question.querySelectorAll(".gold-print-visual > *")];
  if (!boxes.length) return false;
  for (const zoom of last ? LAST_ZOOMS : KEEP_ZOOMS) {
    boxes.forEach((box) => { box.dataset.printFit = String(zoom); [...box.children].forEach((child) => { child.style.zoom = String(zoom); }); });
    if (contentFits(sheet)) return true;
  }
  boxes.forEach((box) => { delete box.dataset.printFit; [...box.children].forEach((child) => { child.style.zoom = ""; }); });
  return false;
}

const BACKFILL = false;

function packExercisePages(pages) {
  const first = pages[0];
  const header = first.querySelector(":scope > .gold-print-head");
  const footer = pages.map((page) => page.querySelector(":scope > .gold-print-footer"))
    .find((node) => node.classList.contains("has-game-qr")) || first.querySelector(":scope > .gold-print-footer");
  const hasGameFooter = footer.classList.contains("has-game-qr");
  const regularFooter = footer.cloneNode(true);
  regularFooter.querySelector(".gold-print-games")?.remove();
  regularFooter.classList.remove("has-game-qr");
  const extras = [...first.children].filter((node) => !node.matches(".gold-print-head,.gold-print-footer,.gold-print-block"));
  // 여러 묶음을 이어 담을 때(차시 교재): 다음 묶음은 새 쪽이 아니라 앞 쪽의 남은 자리에서 「묶음 제목」 칸으로 시작한다(원장 2026-11-21 「빈 쪽 없게」).
  // 그 묶음의 머리(쪽 머리 h1)와 안내 칸(개념·체험·이끄는 글)은 제목 칸 안으로 옮기고, 묶음이 새 쪽 맨 위에서 시작하면 그 쪽 머리를 그 묶음 것으로 쓴다.
  const pageHeads = pages.map((page) => page.querySelector(":scope > .gold-print-head"));
  const pageFooters = pages.map((page) => page.querySelector(":scope > .gold-print-footer"));
  const questions = pages.flatMap((page, pageIndex) => {
    const items = exerciseNodes(page).map((question, index) => {
      question.dataset.printExerciseKey = `${page.dataset.printLesson}:${page.dataset.printPart}:${index}`;
      question.dataset.printSourcePart = page.dataset.printPart;
      question.dataset.printPageIndex = String(pageIndex);
      return question;
    });
    const previous = pages[pageIndex - 1];
    const startsSection = pageIndex > 0 && (page.dataset.printLesson !== previous.dataset.printLesson || exerciseFamily(page) !== exerciseFamily(previous));
    if (!startsSection || !items.length) return items;
    const head = pageHeads[pageIndex];
    const section = document.createElement("section");
    section.className = "gold-print-source-item full-width-exercise tb-section-start";
    section.dataset.printSourcePart = page.dataset.printPart;
    section.dataset.printPageIndex = String(pageIndex);
    const kick = head?.querySelector("span")?.textContent || "";
    const title = head?.querySelector("h1")?.textContent || "";
    section.innerHTML = `<div class="tb-section-title"><span>${kick}</span><b>${title}</b></div>`;
    // 안내 칸(개념 요약·체험 그림 …)은 하나씩 따로 담아, 앞 쪽에 들어가는 만큼은 앞 쪽에 둔다
    const leads = [...page.children].filter((node) => !node.matches(".gold-print-head,.gold-print-footer,.gold-print-block"));
    if (leads.length) section.append(leads.shift());
    const parts = leads.map((node) => {
      const part = document.createElement("section");
      part.className = "gold-print-source-item full-width-exercise tb-section-part";
      part.dataset.printSourcePart = page.dataset.printPart;
      part.dataset.printPageIndex = String(pageIndex);
      part.append(node);
      return part;
    });
    return [section, ...parts, ...items];
  });
  let sheet;
  let grid;
  const packed = [];
  function nextSheet(showGames = false, pageIndex = 0) {
    sheet = (pages[pageIndex] || first).cloneNode(false);
    sheet.classList.add("compact-exercise-page", "two-column-exercises");
    grid = document.createElement("div");
    grid.className = "gold-print-exercise-grid";
    const head = (pageHeads[pageIndex] || header).cloneNode(true);
    const foot = showGames ? footer : (pageIndex ? pageFooters[pageIndex] || regularFooter : regularFooter);
    sheet.append(head, ...(packed.length ? [] : extras), grid, foot.cloneNode(true));
    first.before(sheet);
    packed.push(sheet);
  }
  const pageOf = (node) => Number(node.dataset.printPageIndex || 0);
  nextSheet();
  const queue = [...questions];
  // 이 쪽에 안 들어가 다음 쪽으로 넘기기 전에, 뒤에 올 문제 가운데 남은 자리에 들어가는 것을 먼저 채운다(원장 2026-11-21 「빈 쪽 없게 문제 배치 다시 맞춰」).
  // 개념 칸(.tb-concept-item)은 그 묶음 문제보다 앞서야 하므로 개념 칸 뒤의 문제는 당겨 오지 않고, 게임 QR이 붙는 마지막 문제도 당기지 않는다.
  const backfill = () => {
    for (let k = 0; k < queue.length && k < 8; k += 1) {
      const candidate = queue[k];
      if (candidate.classList.contains("tb-concept-item") || candidate.classList.contains("tb-section-start") || candidate.classList.contains("tb-section-part")) break;
      if (hasGameFooter && candidate === questions.at(-1)) continue;
      const hadFull = candidate.classList.contains("full-width-exercise");
      grid.append(candidate);
      if (needsFullWidth(candidate)) candidate.classList.add("full-width-exercise");
      enlargeVisual(candidate);
      if (contentFits(sheet)) { queue.splice(k, 1); candidate.dataset.printBackfilled = "1"; k = -1; continue; }
      candidate.remove();
      if (!hadFull && !candidate.dataset.printWidened) candidate.classList.remove("full-width-exercise");
    }
  };
  while (queue.length) {
    const question = queue.shift();
    const isLast = hasGameFooter && question === questions.at(-1);
    if (isLast) sheet.querySelector(":scope > .gold-print-footer").replaceWith(footer.cloneNode(true));
    grid.append(question);
    if (needsFullWidth(question)) question.classList.add("full-width-exercise");
    enlargeVisual(question);
    const lastInSection = !queue.length || queue[0].classList.contains("tb-section-start");
    if (!contentFits(sheet) && grid.children.length > 1 && !zoomToStay(question, sheet, { last: lastInSection })) {
      question.remove();
      // 개념 정리의 빈 「풀이」 자리는 다음 쪽으로 넘기지 않고 뺀다(예제와 떨어진 빈 칸만 남으므로)
      if (question.classList.contains("tb-nc-blank")) continue;
      // 묶음 제목 칸만 쪽 끝에 혼자 남기지 않는다 — 첫 문제와 함께 다음 쪽으로
      // (안내 칸·개념 그림이 함께 든 제목 칸은 그 자체로 내용이라 이 쪽에 남긴다)
      const lastChild = grid.lastElementChild;
      const orphan = lastChild?.classList.contains("tb-section-start") && lastChild.children.length <= 1 ? lastChild : null;
      orphan?.remove();
      // 뒤 문제 당겨 채우기(backfill)는 쓰지 않는다 — 번호 차례가 바뀐다(원장 2026-11-21 「번호 차례는 지켜야지 당겨 채우기 꺼」)
      if (BACKFILL && !orphan && !question.classList.contains("tb-concept-item") && !question.classList.contains("tb-section-start") && !question.classList.contains("tb-section-part")) backfill();
      if (isLast) sheet.querySelector(":scope > .gold-print-footer").replaceWith(regularFooter.cloneNode(true));
      nextSheet(isLast, pageOf(orphan || question));
      if (orphan) grid.append(orphan);
      grid.append(question);
    }
    if (!contentFits(sheet)) {
      question.classList.add("full-width-exercise");
      if (!contentFits(sheet) && sheet.querySelector(".gold-print-concept,.gold-print-experience")) {
        question.remove();
        if (isLast) sheet.querySelector(":scope > .gold-print-footer").replaceWith(regularFooter.cloneNode(true));
        nextSheet(isLast);
        grid.append(question);
      }
    }
    // 늘린 그림 때문에 새 쪽에서도 넘치면 늘리기를 거두고 예전처럼 줄인다.
    if (!contentFits(sheet) && question.classList.contains("print-visual-grow")) question.classList.remove("print-visual-grow");
    if (!contentFits(sheet)) throw new Error(`A print exercise does not fit A4 without clipping: ${question.dataset.printExerciseKey || "unknown"}`);
  }
  packed.forEach((page) => {
    const top = page.querySelector(".gold-print-exercise-grid > :first-child");
    // 쪽 맨 위에서 시작하는 묶음은 쪽 머리가 곧 제목이다 — 제목뿐인 칸은 빼고, 안내 칸이 든 칸은 제목 줄만 감춘다
    if (top?.classList.contains("tb-section-start")) {
      if (top.children.length <= 1) top.remove();
      else top.classList.add("at-top");
    }
  });
  packed.forEach((page) => {
    const parts = [...new Set([...page.querySelectorAll("[data-print-source-part]")].map((node) => node.dataset.printSourcePart))];
    if (!parts.length) parts.push(first.dataset.printPart);
    page.dataset.printParts = JSON.stringify(parts);
    page.dataset.printPart = parts[0];
  });
  pages.forEach((page) => page.remove());
}

// 개념 정리 쪽의 마지막 칸이 「따라 풀기」면, 쪽 아래 남는 자리를 그 풀이 자리로 채운다(원장 2026-11-22 「너무 비어 보여 · 따라 풀기 아래 옅은 색을 칠해줘」).
function growFollow(scope) {
  [...scope.children].forEach((page) => {
    const work = page.querySelector(".gold-print-exercise-grid > :last-child .tb-nc-work");
    if (!work || !contentFits(page)) return;
    const mm = (n) => `${n}mm`;
    const base = work.closest(".tb-nc-blank") ? 6 : 14;
    let low = 0, high = 150;
    for (let step = 0; step < 9; step += 1) {
      const mid = (low + high) / 2;
      work.style.minHeight = mm(base + mid);
      if (contentFits(page)) low = mid; else high = mid;
    }
    // 잴 때는 쪽을 265mm로 잡아(실제 275mm) 10mm 여유를 두므로, 마지막 칸만 그 여유 가운데 9mm를 더 써서 쪽 아래까지 채운다
    work.style.minHeight = mm(base + Math.floor(low) + 9);
  });
}

// A figure box has a fixed print height and hides overflow; shrink overflowing content to fit instead of cutting it off.
function fitClippedVisuals(scope) {
  scope.querySelectorAll(".gold-print-visual > *").forEach((box) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (!box.clientHeight || box.scrollHeight <= box.clientHeight + 2) break;
      const zoom = Math.max(0.5, Number(box.dataset.printFit || 1) * box.clientHeight / box.scrollHeight);
      box.dataset.printFit = zoom.toFixed(3);
      [...box.children].forEach((child) => { child.style.zoom = box.dataset.printFit; });
    }
  });
}

// Measure with the same print cascade, isolated from the student's screen.
export function compactGoldenBellPrint(root) {
  const host = document.createElement("div");
  host.style.cssText = "position:absolute;left:-100000px;top:0;width:188mm;visibility:hidden;pointer-events:none";
  host.setAttribute("aria-hidden", "true");
  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = [...document.styleSheets].map((sheet) => {
    try { return printRules(sheet.cssRules); } catch { return ""; }
  }).join("\n") + "\n.gold-print-page{height:265mm!important;min-height:265mm!important;max-height:265mm!important}";
  const copy = root.cloneNode(true);
  shadow.append(style, copy);
  document.body.append(host);
  try {
    const pages = [...copy.children];
    // 차시 교재(데일리·공부하기·과제·평가 쪽이 있는 인쇄)에서만 묶음을 이어 담는다 — 워밍업만 따로 인쇄할 때는 예전처럼 차시마다 새 쪽.
    const sessionBook = pages.some((page) => page.classList.contains("tb-session-page"));
    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      page.dataset.printParts = JSON.stringify([page.dataset.printPart]);
      if (!exerciseNodes(page)) continue;
      const group = [page];
      const flowing = (a, b) => sessionBook && exerciseFamily(a) !== "answer" && exerciseFamily(b) !== "answer"
        && !a.classList.contains("tb-answer-page") && !b.classList.contains("tb-answer-page")
        && !a.querySelector(".has-game-qr") && !b.querySelector(".has-game-qr");
      while (pages[index + 1] && exerciseNodes(pages[index + 1])
        && (exerciseFamily(pages[index + 1]) === "answer") === (exerciseFamily(page) === "answer")
        && (pages[index + 1].dataset.printLesson === page.dataset.printLesson || flowing(pages[index], pages[index + 1]))
        && (pages[index + 1].dataset.printBook === page.dataset.printBook || flowing(pages[index], pages[index + 1]))) {
        group.push(pages[++index]);
      }
      packExercisePages(group);
    }
    fitClippedVisuals(copy);
    growFollow(copy);
    const packed = [...copy.children];
    packed.forEach((page, index) => {
      if ((page.querySelector(".has-game-qr") || page.classList.contains("has-cover-games")) && !contentFits(page)) {
        throw new Error(`A print game QR overlaps learning content: ${page.dataset.printLesson}`);
      }
      const number = document.createElement("span");
      number.className = "gold-print-page-number";
      number.textContent = ` ${index + 1} / ${packed.length}`;
      const footer = page.querySelector(":scope > .gold-print-footer");
      (footer.querySelector(".gold-print-footer-meta") || footer).append(number);
    });
    root.replaceChildren(...packed);
    return packed.length;
  } finally {
    host.remove();
  }
}
