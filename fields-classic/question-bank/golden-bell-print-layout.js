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
  return [...page.children].filter((node) => !node.matches(".gold-print-footer"))
    .every((node) => node.getBoundingClientRect().bottom <= footerTop - 8);
}

function exerciseFamily(page) {
  const part = page.dataset.printPart;
  if (part.startsWith("story-")) return "story";
  if (part.startsWith("original-")) return "source";
  return null;
}

function exerciseNodes(page) {
  const family = exerciseFamily(page);
  if (!family) return null;
  return [...page.querySelectorAll(family === "source" ? ".gold-print-source-item" : ".gold-print-story")];
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
  const footer = first.querySelector(":scope > .gold-print-footer");
  const extras = [...first.children].filter((node) => !node.matches(".gold-print-head,.gold-print-footer,.gold-print-block"));
  const questions = pages.flatMap((page) => exerciseNodes(page).map((question, index) => {
    question.dataset.printExerciseKey = `${page.dataset.printLesson}:${page.dataset.printPart}:${index}`;
    question.dataset.printSourcePart = page.dataset.printPart;
    return question;
  }));
  let sheet;
  let grid;
  const packed = [];
  function nextSheet() {
    sheet = first.cloneNode(false);
    sheet.classList.add("compact-exercise-page", "two-column-exercises");
    grid = document.createElement("div");
    grid.className = "gold-print-exercise-grid";
    sheet.append(header.cloneNode(true), ...(packed.length ? [] : extras), grid, footer.cloneNode(true));
    first.before(sheet);
    packed.push(sheet);
  }
  nextSheet();
  for (const question of questions) {
    grid.append(question);
    if (needsFullWidth(question)) question.classList.add("full-width-exercise");
    if (!contentFits(sheet) && grid.children.length > 1) {
      question.remove();
      nextSheet();
      grid.append(question);
    }
    if (!contentFits(sheet)) {
      question.classList.add("full-width-exercise");
      if (!contentFits(sheet) && sheet.querySelector(".gold-print-concept,.gold-print-experience")) {
        question.remove();
        nextSheet();
        grid.append(question);
      }
    }
    if (!contentFits(sheet)) throw new Error("A print exercise does not fit A4 without clipping");
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
        && pages[index + 1].dataset.printLesson === page.dataset.printLesson
        && pages[index + 1].dataset.printBook === page.dataset.printBook) {
        group.push(pages[++index]);
      }
      packExercisePages(group);
    }
    const packed = [...copy.children];
    packed.forEach((page, index) => {
      const number = document.createElement("span");
      number.className = "gold-print-page-number";
      number.textContent = ` ${index + 1} / ${packed.length}`;
      page.querySelector(":scope > .gold-print-footer").append(number);
    });
    root.replaceChildren(...packed);
    return packed.length;
  } finally {
    host.remove();
  }
}
