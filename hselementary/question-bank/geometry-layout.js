(() => {
  const DIAGRAM_SELECTOR = [
    "svg.geometry-diagram.source41-angle-rays",
    "svg.geometry-diagram.source41-angle-location",
    "svg.geometry-diagram.source41-angle-web",
    "svg.geometry-diagram.source41-triangle-pair",
    "svg.geometry-diagram.source41-equilateral-fan",
    "svg.geometry-diagram.source41-polygon-collection",
    "svg.geometry-diagram.source41-triangle-bisectors",
    "svg.geometry-diagram.source41-altitude-bisector",
    "svg.geometry-diagram.source41-concave-octagon",
    "svg.geometry-diagram.source41-trisected-triangle",
    "svg.geometry-diagram.source41-exterior-polygon",
    "svg.geometry-diagram.source41-five-target",
    "svg.geometry-diagram.source41-two-turn-octagon",
    "svg.geometry-diagram.source41-four-triangle-cross",
    "svg.geometry-diagram.source41-three-apex",
    "svg.geometry-diagram.source41-overlap-triangles",
    "svg.geometry-diagram.source41-exterior-sum",
    "svg.geometry-diagram.source41-rotated-triangle",
    "svg.geometry-diagram.source41-star-polygon",
    "svg.geometry-diagram.source41-concave-quadrilateral",
    "svg.geometry-diagram.source41-bisected-apex",
    "svg.geometry-diagram.source41-star-relation",
    "svg.geometry-diagram.source41-angle-five"
  ].join(",");
  const LABEL_SELECTOR = "text:not(.source41-point-label):not(.source41-angle-five-note)";
  const SHAPE_SELECTOR = "line,path,polyline,polygon";

  const number = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const overlaps = (a, b, gap = 0) => a.left - gap < b.right && a.right + gap > b.left && a.top - gap < b.bottom && a.bottom + gap > b.top;
  const pointInside = (point, rect, gap = 0) => point.x >= rect.left - gap && point.x <= rect.right + gap && point.y >= rect.top - gap && point.y <= rect.bottom + gap;

  function screenPoint(element, x, y) {
    const point = element.ownerSVGElement.createSVGPoint();
    point.x = x;
    point.y = y;
    return point.matrixTransform(element.getScreenCTM());
  }

  function shapePoints(element) {
    const tag = element.tagName.toLowerCase();
    if (tag === "line") {
      const a = screenPoint(element, number(element.getAttribute("x1")), number(element.getAttribute("y1")));
      const b = screenPoint(element, number(element.getAttribute("x2")), number(element.getAttribute("y2")));
      const count = Math.max(12, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 1.5));
      return Array.from({ length: count + 1 }, (_, index) => ({ x: a.x + (b.x - a.x) * index / count, y: a.y + (b.y - a.y) * index / count }));
    }
    if ((tag === "path") && typeof element.getTotalLength === "function") {
      const length = element.getTotalLength();
      const count = Math.max(12, Math.ceil(length / 1.5));
      return Array.from({ length: count + 1 }, (_, index) => {
        const point = element.getPointAtLength(length * index / count);
        return screenPoint(element, point.x, point.y);
      });
    }
    if (tag === "polyline" || tag === "polygon") {
      const points = [...element.points].map(point => screenPoint(element, point.x, point.y));
      const output = [];
      const limit = tag === "polygon" ? points.length : points.length - 1;
      for (let index = 0; index < limit; index += 1) {
        const a = points[index];
        const b = points[(index + 1) % points.length];
        const count = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 1.5));
        for (let step = 0; step <= count; step += 1) output.push({ x: a.x + (b.x - a.x) * step / count, y: a.y + (b.y - a.y) * step / count });
      }
      return output;
    }
    return [];
  }

  function localVertices(svg) {
    const vertices = [];
    svg.querySelectorAll("line,polyline,polygon").forEach(element => {
      const tag = element.tagName.toLowerCase();
      if (tag === "line") {
        vertices.push([number(element.getAttribute("x1")), number(element.getAttribute("y1"))]);
        vertices.push([number(element.getAttribute("x2")), number(element.getAttribute("y2"))]);
      } else {
        [...element.points].forEach(point => vertices.push([point.x, point.y]));
      }
    });
    return vertices;
  }

  function candidatePositions(label, vertices) {
    const baseX = number(label.dataset.layoutBaseX, number(label.getAttribute("x")));
    const baseY = number(label.dataset.layoutBaseY, number(label.getAttribute("y")));
    let anchor = null;
    let nearest = Infinity;
    vertices.forEach(vertex => {
      const distance = Math.hypot(baseX - vertex[0], baseY - vertex[1]);
      if (distance < nearest) {
        nearest = distance;
        anchor = vertex;
      }
    });
    let radialX = 1;
    let radialY = 0;
    if (anchor && nearest > 0.5) {
      radialX = (baseX - anchor[0]) / nearest;
      radialY = (baseY - anchor[1]) / nearest;
    }
    const tangentX = -radialY;
    const tangentY = radialX;
    const candidates = [];
    [-8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72].forEach(radial => {
      [-36, -32, -28, -24, -20, -16, -12, -8, -4, 0, 4, 8, 12, 16, 20, 24, 28, 32, 36].forEach(tangent => {
        candidates.push({
          x: baseX + radialX * radial + tangentX * tangent,
          y: baseY + radialY * radial + tangentY * tangent,
          distance: Math.hypot(radial, tangent),
          deviation: Math.abs(tangent)
        });
      });
    });
    return candidates;
  }

  function layoutSvg(svg) {
    if (!svg.isConnected || svg.getBoundingClientRect().width === 0) return { labels: 0, unresolved: 0 };
    const labels = [...svg.querySelectorAll(LABEL_SELECTOR)].filter(label => label.hasAttribute("x") && label.hasAttribute("y"));
    labels.forEach(label => {
      if (!label.dataset.layoutBaseX) label.dataset.layoutBaseX = label.getAttribute("x");
      if (!label.dataset.layoutBaseY) label.dataset.layoutBaseY = label.getAttribute("y");
      label.setAttribute("x", label.dataset.layoutBaseX);
      label.setAttribute("y", label.dataset.layoutBaseY);
      delete label.dataset.layoutStatus;
    });
    const shapeEntries = [...svg.querySelectorAll(SHAPE_SELECTOR)]
      .filter(shape => !shape.matches("[data-layout-ignore],[data-layout-overlap-ok]"))
      .map(shape => ({ shape, points: shapePoints(shape) }));
    const vertices = localVertices(svg);
    const svgRect = svg.getBoundingClientRect();
    let unresolved = 0;
    const orderedLabels = labels.sort((a, b) => b.getBoundingClientRect().width - a.getBoundingClientRect().width);

    for (let pass = 0; pass < 3; pass += 1) orderedLabels.forEach(label => {
      let best = null;
      for (const candidate of candidatePositions(label, vertices)) {
        label.setAttribute("x", candidate.x.toFixed(1));
        label.setAttribute("y", candidate.y.toFixed(1));
        const rect = label.getBoundingClientRect();
        let collisions = 0;
        if (rect.left < svgRect.left + 1 || rect.right > svgRect.right - 1 || rect.top < svgRect.top + 1 || rect.bottom > svgRect.bottom - 1) collisions += 20;
        shapeEntries.forEach(({ shape, points }) => {
          if (label.dataset.labelFor && label.dataset.labelFor === shape.id) return;
          if (points.some(point => pointInside(point, rect, 0.5))) collisions += 1;
        });
        labels.forEach(other => {
          if (other === label || other.getBoundingClientRect().width === 0) return;
          if (overlaps(rect, other.getBoundingClientRect(), 1.5)) collisions += 3;
        });
        const score = collisions * 1000 + candidate.distance * 2 + candidate.deviation;
        if (!best || score < best.score) best = { ...candidate, collisions, score };
        if (collisions === 0 && candidate.distance <= 8) break;
      }
      label.setAttribute("x", best.x.toFixed(1));
      label.setAttribute("y", best.y.toFixed(1));
      label.dataset.layoutStatus = best.collisions === 0 ? "clear" : "unresolved";
      label.dataset.layoutShift = best.distance.toFixed(1);
      if (pass === 2 && best.collisions) unresolved += 1;
    });
    svg.dataset.layoutStatus = unresolved ? "unresolved" : "clear";
    return { labels: labels.length, unresolved };
  }

  function apply(root = document) {
    const diagrams = [...root.querySelectorAll(DIAGRAM_SELECTOR)];
    const results = diagrams.map(layoutSvg);
    return {
      diagrams: diagrams.length,
      labels: results.reduce((sum, result) => sum + result.labels, 0),
      unresolved: results.reduce((sum, result) => sum + result.unresolved, 0)
    };
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => apply(document), 80);
  });
  window.addEventListener("beforeprint", () => apply(document));
  if (document.fonts?.ready) document.fonts.ready.then(() => window.requestAnimationFrame(() => apply(document)));
  window.GFieldGeometryLayout = Object.freeze({ apply });
})();
