(function (root) {
  "use strict";

  function append(target, value) {
    const text = String(value == null ? "" : value);
    const fraction = /(^|[^\w.])([−-]?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)(?![\d./])/g;
    let cursor = 0;
    let match;
    while ((match = fraction.exec(text))) {
      const start = match.index + match[1].length;
      if (start > cursor) target.append(document.createTextNode(text.slice(cursor, start)));
      const node = document.createElement("span");
      node.className = "math-fraction";
      node.setAttribute("role", "math");
      node.setAttribute("aria-label", `${match[3]}분의 ${match[2]}`);
      const numerator = document.createElement("span");
      numerator.className = "math-fraction-numerator";
      numerator.textContent = match[2];
      const denominator = document.createElement("span");
      denominator.className = "math-fraction-denominator";
      denominator.textContent = match[3];
      node.append(numerator, denominator);
      target.append(node);
      cursor = fraction.lastIndex;
    }
    if (cursor < text.length) target.append(document.createTextNode(text.slice(cursor)));
    return target;
  }

  root.GFIELDMathText = Object.freeze({ append: append });
})(window);
