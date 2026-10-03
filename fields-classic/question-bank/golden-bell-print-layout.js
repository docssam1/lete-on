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
  const questions = pages.flatMap((page) => exerciseNodes(page).map((question, index) => {
    question.dataset.printExerciseKey = `${page.dataset.printLesson}:${page.dataset.printPart}:${index}`;
    question.dataset.printSourcePart = page.dataset.printPart;
    return question;
  }));
  let sheet;
  let grid;
  const packed = [];
  function nextSheet(showGames = false) {
    sheet = first.cloneNode(false);
    sheet.classList.add("compact-exercise-page", "two-column-exercises");
    grid = document.createElement("div");
    grid.className = "gold-print-exercise-grid";
    sheet.append(header.cloneNode(true), ...(packed.length ? [] : extras), grid, (showGames ? footer : regularFooter).cloneNode(true));
    first.before(sheet);
    packed.push(sheet);
  }
  nextSheet();
  for (const question of questions) {
    const isLast = hasGameFooter && question === questions.at(-1);
    if (isLast) sheet.querySelector(":scope > .gold-print-footer").replaceWith(footer.cloneNode(true));
    grid.append(question);
    if (needsFullWidth(question)) question.classList.add("full-width-exercise");
    if (!contentFits(sheet) && grid.children.length > 1) {
      question.remove();
      if (isLast) sheet.querySelector(":scope > .gold-print-footer").replaceWith(regularFooter.cloneNode(true));
      nextSheet(isLast);
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
    if (!contentFits(sheet)) throw new Error(`A print exercise does not fit A4 without clipping: ${question.dataset.printExerciseKey || "unknown"}`);
  }
  packed.forEach((page) => {
    const parts = [...new Set([...page.querySelectorAll("[data-print-source-part]")].map((node) => node.dataset.printSourcePart))];
    if (!parts.length) parts.push(first.dataset.printPart);
    page.dataset.printParts = JSON.stringify(parts);
    page.dataset.printPart = parts[0];
  });
  pages.forEach((page) => page.remove());
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
    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      page.dataset.printParts = JSON.stringify([page.dataset.printPart]);
      if (!exerciseNodes(page)) continue;
      const group = [page];
      while (pages[index + 1] && exerciseNodes(pages[index + 1])
        && (exerciseFamily(pages[index + 1]) === "answer") === (exerciseFamily(page) === "answer")
        && pages[index + 1].dataset.printLesson === page.dataset.printLesson
        && pages[index + 1].dataset.printBook === page.dataset.printBook) {
        group.push(pages[++index]);
      }
      packExercisePages(group);
    }
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
