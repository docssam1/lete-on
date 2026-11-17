(function (root) {
  "use strict";

  function append(target, value) {
    const sourceText = String(value == null ? "" : value);
    const i18n = root.GFIELDContentI18n;
    const initialLength = i18n ? target.childNodes.length : 0;
    const text = i18n ? i18n.text(sourceText) : sourceText;
    const parenthesized = "\\((?:[^()]|\\([^()]*\\))*\\)";
    const absoluteValue = "\\|[^|]+\\|";
    const algebraicTerm = "(?:\\d+(?:\\.\\d+)?π?[A-Za-z]?|π[A-Za-z]?|[A-Za-z])";
    const mathToken = `(?:[−-]?(?:${algebraicTerm}|√(?:\\d+(?:\\.\\d+)?|${parenthesized}))|${absoluteValue}|[θΘ]|[가-힣]+)`;
    const denominator = `(?:\\d+(?:\\.\\d+)?|${parenthesized}|${absoluteValue}|[A-Za-z]\\([^()]*\\)|[A-Za-z](?:_\\d+)?|[θΘπΠ]|[가-힣]+)`;
    const fraction = new RegExp(`(^|[^\\w./가-힣])(${mathToken}|${parenthesized})\\s*\\/\\s*(${denominator})(?:(?![\\w/]|\\.(?=\\d))|(?<=[0-9)])(?=[A-Za-z]\\b))`, "g");
    const unitRates = new Set(["m/s", "km/h", "mi/h", "ft/s", "km/시간", "마일/시간", "달러/회", "달러/km"]);
    let cursor = 0;
    let match;
    while ((match = fraction.exec(text))) {
      const start = match.index + match[1].length;
      if (unitRates.has(`${match[2]}/${match[3]}`.toLowerCase())) continue;
      if (/\bAMC\s*$/i.test(text.slice(0, start)) && match[2] === "10" && match[3] === "12") continue;
      if (start > cursor) target.append(document.createTextNode(text.slice(cursor, start)));
      const node = document.createElement("span");
      node.className = "math-fraction";
      node.setAttribute("role", "math");
      const numeratorText = match[2].startsWith("(") ? match[2].slice(1, -1) : match[2];
      const denominatorText = match[3].startsWith("(") ? match[3].slice(1, -1) : match[3];
      node.setAttribute("aria-label", `${denominatorText}분의 ${numeratorText}`);
      const numerator = document.createElement("span");
      numerator.className = "math-fraction-numerator";
      numerator.textContent = numeratorText;
      const denominator = document.createElement("span");
      denominator.className = "math-fraction-denominator";
      denominator.textContent = denominatorText;
      node.append(numerator, denominator);
      target.append(node);
      cursor = fraction.lastIndex;
    }
    if (cursor < text.length) target.append(document.createTextNode(text.slice(cursor)));
    if (i18n) i18n.trackMath(target, sourceText, Array.from(target.childNodes).slice(initialLength));
    return target;
  }

  root.GFIELDMathText = Object.freeze({ append: append });
})(window);
