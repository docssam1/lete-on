(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports = factory(require("./source-6-2-t-pattern-example2-contracts.js"));
  else root.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION = factory(root.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS);
})(typeof window !== "undefined" ? window : globalThis, function (contracts) {
  "use strict";
  const escape = text => String(text).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

  function layerGeometry(model, layer) {
    const cells = model.layers[layer - 1].cells, size = 16, pad = 10;
    const minX = Math.min(...cells.map(([x]) => x)), maxX = Math.max(...cells.map(([x]) => x));
    const minZ = Math.min(...cells.map(([, z]) => z)), maxZ = Math.max(...cells.map(([, z]) => z));
    return { cells, size, pad, minX, minZ, width: (maxX - minX + 1) * size + 2 * pad, height: (maxZ - minZ + 1) * size + 2 * pad };
  }

  function layerSvg(q, layer) {
    if (!q || q.sourceItemId !== "6-2-u3-e2-example-2" || !Number.isSafeInteger(q.level) || q.level < 0 || q.level > 2 ||
        !q.model || q.model.sourceItemId !== q.sourceItemId || !Number.isSafeInteger(layer) ||
        !(q.level === 2 ? [1, q.model.n, q.model.n - 1, q.model.n - 2] : [1, q.model.n]).includes(layer))
      throw new RangeError("Unsupported T-pattern answer layer");
    const { cells, size, pad, minX, minZ, width, height } = layerGeometry(q.model, layer);
    // Model H rows run back-to-front; only exterior empty margins are cropped.
    return `<svg xmlns="http://www.w3.org/2000/svg" class="source62-t-pattern-grid" data-layer="${layer}" data-min-x="${minX}" data-min-z="${minZ}" data-orientation="back-to-front" role="img" aria-label="${layer}층의 T자 배열" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background:#fff;--source62-t-pattern-grid-width:${width}px">${cells.map(([x, z]) => `<rect data-x="${x}" data-z="${z}" data-layer="${layer}" x="${pad + (x - minX) * size}" y="${pad + (z - minZ) * size}" width="${size}" height="${size}" fill="#fff" stroke="#000" stroke-width="1"/>`).join("")}</svg>`;
  }

  function layerFigure(q, layer) {
    const cells = q.model.layers[layer - 1].cells, removed = q.removedTopLayers?.rows.some(row => row.layer === layer) || false;
    const svg = layerSvg(q, layer), { width } = layerGeometry(q.model, layer);
    return `<figure class="source62-t-pattern-grid-figure${layer === 1 ? " source62-t-pattern-grid-ground" : ""}" data-removed="${removed}"><figcaption>${layer}층 · ${cells.length}개${removed ? " · 제거하는 층" : ""}</figcaption><button type="button" class="source62-m3-image-button source62-t-pattern-grid-button" data-m3-figure="${q.variant}" data-source-figure-family="t-pattern-layer" data-source-answer-layer="${layer}" data-source-difficulty-level="${q.level}" aria-label="${layer}층 그림 확대" title="${layer}층 그림 확대" style="--source62-t-pattern-grid-width:${width}px">${svg}</button></figure>`;
  }

  function render(id, variant, level) {
    const q = contracts.generate(id, variant, level);
    const text = q.promptText.split(/(?=\([123]\))/).map(escape).join("<br>");
    const given = `<div class="source62-t-pattern-given" data-source="${id}"><div class="source62-t-pattern-given-text">${text}</div><button type="button" class="source62-m3-image-button" data-m3-figure="${variant}" data-source-figure-family="t-pattern-example2" title="입체 그림 확대" aria-label="입체 그림 확대"><img src="./assets/source-6-2-t-pattern-example2/prefix-given.png" width="1600" height="523" alt="첫째, 둘째, 셋째 T자 쌓기나무 모양" data-glyphless="true"></button></div>`;
    const layers = [...new Set(level === 2 ? [1, q.model.n, q.model.n - 1, q.model.n - 2] : [1, q.model.n])];
    return Object.freeze({ ...q, prompt: given, answer: q.answer.map((count, index) => `(${index + 1})${count}개`).join(";"),
      answerVisual: `<div class="source62-t-pattern-answer" data-source="${id}">${layers.map(layer => layerFigure(q, layer)).join("")}</div>`, answerKeyVisual: true });
  }

  return Object.freeze({ render, layerSvg, sourceItemIds: contracts.sourceItemIds, registrationOnly: true, learnerReleaseVerified: false });
});
