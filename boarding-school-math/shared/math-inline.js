(function (root) {
  "use strict";

  function append(target, value) {
    const text = String(value == null ? "" : value);
    const parenthesized = "\\((?:[^()]|\\([^()]*\\))*\\)";
    const mathToken = "(?:[−-]?(?:\\d+(?:\\.\\d+)?π?|π)|[A-Za-z]|[θΘ]|[가-힣]+)";
    const denominator = `(?:\\d+(?:\\.\\d+)?|${parenthesized}|[A-Za-z]\\w*|[θΘ]|[가-힣]+)`;
    const fraction = new RegExp(`(^|[^\\w./])(${mathToken}|${parenthesized})\\s*\\/\\s*(${denominator})(?![\\w./])`, "g");
    const unitRates = new Set(["m/s", "mi/h", "ft/s"]);
    let cursor = 0;
    let match;
    while ((match = fraction.exec(text))) {
      const start = match.index + match[1].length;
      if (unitRates.has(`${match[2]}/${match[3]}`.toLowerCase())) continue;
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
    return target;
  }

  root.GFIELDMathText = Object.freeze({ append: append });
})(window);
