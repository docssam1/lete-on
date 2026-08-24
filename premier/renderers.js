(function (global) {
  "use strict";
  const registry = new Map();
  function register(id, renderer) {
    if (!id || typeof renderer !== "function") throw new Error("그림 렌더러 등록값이 올바르지 않습니다.");
    registry.set(String(id), renderer);
  }
  function render(figure, question) {
    if (!figure) return "";
    const id = typeof figure === "string" ? figure : figure.id;
    const renderer = registry.get(String(id));
    if (!renderer) return `<span role="status">그림 준비 중: ${String(id || "알 수 없음")}</span>`;
    return renderer(typeof figure === "object" ? figure : {}, question);
  }
  function svg(viewBox, body, className) {
    return `<svg class="${className || ""}" viewBox="${viewBox}" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  }
  function line(x1, y1, x2, y2, extra) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra || ""}/>`; }
  function text(x, y, value, extra) { return `<text x="${x}" y="${y}" ${extra || ""}>${value}</text>`; }
  global.PremierFigures = { register, render, svg, line, text };
})(window);
