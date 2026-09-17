"use strict";

async function auditSvgLayouts(locator, profile) {
  return locator.evaluateAll((svgs, profileName) => {
    const overlaps = (a, b, gap = 0) => a.left - gap < b.right && a.right + gap > b.left && a.top - gap < b.bottom && a.bottom + gap > b.top;
    const inside = (point, rect, gap = 1.5) => point.x >= rect.left - gap && point.x <= rect.right + gap && point.y >= rect.top - gap && point.y <= rect.bottom + gap;
    const screenPoint = (element, x, y) => {
      const point = element.ownerSVGElement.createSVGPoint();
      point.x = x;
      point.y = y;
      return point.matrixTransform(element.getScreenCTM());
    };
    const sampleShape = element => {
      const tag = element.tagName.toLowerCase();
      if (tag === "line") {
        const a = screenPoint(element, Number(element.getAttribute("x1")), Number(element.getAttribute("y1")));
        const b = screenPoint(element, Number(element.getAttribute("x2")), Number(element.getAttribute("y2")));
        return Array.from({ length: 41 }, (_, index) => ({ x: a.x + (b.x - a.x) * index / 40, y: a.y + (b.y - a.y) * index / 40 }));
      }
      if (tag === "path" && typeof element.getTotalLength === "function") {
        const length = element.getTotalLength();
        const count = Math.max(12, Math.ceil(length / 2));
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
          const count = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 2));
          for (let step = 0; step <= count; step += 1) output.push({ x: a.x + (b.x - a.x) * step / count, y: a.y + (b.y - a.y) * step / count });
        }
        return output;
      }
      return [];
    };

    return svgs.flatMap((svg, svgIndex) => {
      const article = svg.closest(".question-item, .solution-item");
      const context = {
        profile: profileName,
        svgIndex,
        question: article?.id || "",
        typeId: article?.dataset.typeId || "",
        sourceItemId: article?.dataset.sourceItemId || "",
        className: svg.getAttribute("class") || ""
      };
      const failures = [];
      const svgRect = svg.getBoundingClientRect();
      const texts = [...svg.querySelectorAll("text")].filter(text => {
        const style = getComputedStyle(text);
        return style.display !== "none" && style.visibility !== "hidden" && text.getBoundingClientRect().width > 0;
      });
      const shapes = [...svg.querySelectorAll("line,path,polyline,polygon")].filter(shape => !shape.matches("[data-layout-ignore], [data-layout-overlap-ok]"));
      const entries = texts.map(text => ({
        text,
        value: (text.textContent || "").trim(),
        rect: text.getBoundingClientRect(),
        role: text.dataset.layoutRole || [...text.classList].find(name => /label|number|point/.test(name)) || "text"
      }));

      entries.forEach((entry, index) => {
        const rect = entry.rect;
        const fontSize = parseFloat(getComputedStyle(entry.text).fontSize);
        if (entry.text.dataset.layoutStatus === "unresolved") failures.push({ ...context, kind: "unresolved-label-layout", label: entry.value, role: entry.role });
        if (rect.left < svgRect.left - 1 || rect.right > svgRect.right + 1 || rect.top < svgRect.top - 1 || rect.bottom > svgRect.bottom + 1) {
          failures.push({ ...context, kind: "label-outside-svg", label: entry.value, role: entry.role });
        }
        if (fontSize < 10) failures.push({ ...context, kind: "undersized-label", label: entry.value, role: entry.role, fontSize });
        for (let otherIndex = index + 1; otherIndex < entries.length; otherIndex += 1) {
          const other = entries[otherIndex];
          if (overlaps(rect, other.rect, 1)) failures.push({ ...context, kind: "label-label-overlap", label: entry.value, other: other.value });
        }
        if (entry.text.matches("[data-layout-overlap-ok]")) return;
        shapes.forEach(shape => {
          if (entry.text.dataset.labelFor && entry.text.dataset.labelFor === shape.id) return;
          if (!sampleShape(shape).some(point => inside(point, rect, 0.25))) return;
          failures.push({
            ...context,
            kind: "label-stroke-overlap",
            label: entry.value,
            role: entry.role,
            shape: {
              tag: shape.tagName.toLowerCase(),
              id: shape.id || "",
              className: shape.getAttribute("class") || "",
              hand: shape.dataset.hand || "",
              tick: shape.dataset.tickIndex || ""
            }
          });
        });
      });
      return failures;
    });
  }, profile);
}

module.exports = { auditSvgLayouts };
