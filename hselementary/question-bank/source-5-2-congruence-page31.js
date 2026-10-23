(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CONGRUENCE_PAGE31 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const definitions = Object.freeze([
    Object.freeze({ sourceItemId: "5-2-u3-e4-mission-1", generatorKey: "source52SquareAnglePage31Mission1", publicReady: true }),
    Object.freeze({ sourceItemId: "5-2-u3-e4-mission-2", generatorKey: "source52SemicircleAnglePage31Mission2", publicReady: true }),
    Object.freeze({ sourceItemId: "5-2-u3-e4-mission-3", generatorKey: "source52EquilateralRotationPage31Mission3", publicReady: true }),
    Object.freeze({ sourceItemId: "5-2-u3-e4-mission-5", generatorKey: "source52CongruentTriangleAreaPage31Mission5", publicReady: true }),
    Object.freeze({ sourceItemId: "5-2-u3-e4-mission-6", generatorKey: "source52TrapezoidMidpointPage31Mission6", publicReady: true })
  ]);
  const squareAlphas = [9, 14, 19];
  const circleBaseVertices = [48, 57, 72];
  const triangleBaseTargets = [118, 130, 152];
  const areaBaseHeights = [10, 14, 18];
  const areaBaseWidths = [6, 10, 14];
  const trapezoidTopBases = [10, 16, 20];
  const trapezoidBottomBases = [8, 10, 14];
  const trapezoidBaseHeights = [6, 8, 10];
  const difficultyDeltas = [-2, 0, 2];
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const point = (x, y) => `${Number(x.toFixed(2))},${Number(y.toFixed(2))}`;
  const rad = degree => degree * Math.PI / 180;
  const fmt = value => Number(value).toLocaleString("ko-KR");

  function angleMark(vertex, first, second, radius = 18) {
    const start = Math.atan2(first.y - vertex.y, first.x - vertex.x);
    const end = Math.atan2(second.y - vertex.y, second.x - vertex.x);
    let delta = (end - start + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    if (Math.abs(delta) < 1e-6) delta = Math.PI / 18;
    const finish = start + delta;
    const a = { x: vertex.x + radius * Math.cos(start), y: vertex.y + radius * Math.sin(start) };
    const b = { x: vertex.x + radius * Math.cos(finish), y: vertex.y + radius * Math.sin(finish) };
    const sweep = delta >= 0 ? 1 : 0;
    const d = `M${point(a.x,a.y)} A${radius} ${radius} 0 0 ${sweep} ${point(b.x,b.y)}`;
    const middle = start + delta / 2;
    const label = { x: vertex.x + (radius + 12) * Math.cos(middle), y: vertex.y + (radius + 12) * Math.sin(middle) };
    return { d, label };
  }

  function equalTick(first, second, length = 11) {
    const dx = second.x - first.x, dy = second.y - first.y;
    const magnitude = Math.hypot(dx, dy) || 1;
    const middle = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
    const px = -dy / magnitude * length / 2, py = dx / magnitude * length / 2;
    return `<line class="source52-equal-mark" x1="${(middle.x-px).toFixed(2)}" y1="${(middle.y-py).toFixed(2)}" x2="${(middle.x+px).toFixed(2)}" y2="${(middle.y+py).toFixed(2)}"/>`;
  }

  function equalDoubleTick(first, second, length = 11) {
    const dx = second.x - first.x, dy = second.y - first.y;
    const magnitude = Math.hypot(dx, dy) || 1;
    const ux = dx / magnitude, uy = dy / magnitude;
    const px = -uy * length / 2, py = ux * length / 2;
    const middle = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
    return [-3, 3].map(offset => {
      const x = middle.x + ux * offset, y = middle.y + uy * offset;
      return `<line class="source52-equal-mark" x1="${(x-px).toFixed(2)}" y1="${(y-py).toFixed(2)}" x2="${(x+px).toFixed(2)}" y2="${(y+py).toFixed(2)}"/>`;
    }).join("");
  }

  function squareDiagram(alpha, beta) {
    const g = { x: 70, y: 38 }, n = { x: 410, y: 38 }, d = { x: 410, y: 378 }, l = { x: 70, y: 378 };
    const side = n.x - g.x;
    const m = { x: l.x, y: g.y + side * Math.tan(rad(alpha)) };
    const b = { x: d.x - side * Math.tan(rad(beta)), y: d.y };
    const square = `${point(g.x,g.y)} ${point(n.x,n.y)} ${point(d.x,d.y)} ${point(l.x,l.y)}`;
    const alphaMark = angleMark(n,g,m,22), betaMark = angleMark(n,d,b,22), targetMark = angleMark(m,l,b,22);
    return `<svg class="source52-p31-diagram source52-p31-square" data-source52-figure="square-angle" viewBox="0 0 480 440" role="img" aria-label="정사각형 안에서 두 선분이 만나는 각 그림" xmlns="http://www.w3.org/2000/svg"><polygon points="${square}"/><line x1="${n.x}" y1="${n.y}" x2="${m.x}" y2="${m.y}"/><line x1="${n.x}" y1="${n.y}" x2="${b.x}" y2="${b.y}"/><line x1="${m.x}" y1="${m.y}" x2="${b.x}" y2="${b.y}"/><path class="source52-angle-mark" d="${alphaMark.d}"/><path class="source52-angle-mark" d="${betaMark.d}"/><path class="source52-angle-mark" d="${targetMark.d}"/><text class="source52-angle-label" x="${Number((alphaMark.label.x-10).toFixed(1))}" y="${Number((alphaMark.label.y+4).toFixed(1))}">${alpha}°</text><text class="source52-angle-label" x="${Number((betaMark.label.x-8).toFixed(1))}" y="${Number((betaMark.label.y+4).toFixed(1))}">${beta}°</text><text x="50" y="30">ㄱ</text><text x="418" y="30">ㄴ</text><text x="418" y="398">ㄷ</text><text x="48" y="398">ㄹ</text><text x="47" y="${Number((m.y+6).toFixed(1))}">ㅁ</text><text x="${Number((b.x+5).toFixed(1))}" y="400">ㅂ</text><text class="source52-target-label" x="${Number((targetMark.label.x-8).toFixed(1))}" y="${Number((targetMark.label.y+4).toFixed(1))}">㉠</text></svg>`;
  }

  function squareProofDiagram(alpha, beta) {
    const g = { x: 130, y: 270 }, n = { x: 370, y: 270 }, d = { x: 370, y: 510 }, l = { x: 130, y: 510 };
    const side = n.x - g.x;
    const m = { x: l.x, y: g.y + side * Math.tan(rad(alpha)) };
    const b = { x: d.x - side * Math.tan(rad(beta)), y: d.y };
    const s = { x: l.x + side * (1 - Math.tan(rad(alpha))), y: d.y };
    const e = { x: g.x, y: g.y - side * Math.tan(rad(beta)) };
    const square = `${point(g.x,g.y)} ${point(n.x,n.y)} ${point(d.x,d.y)} ${point(l.x,l.y)}`;
    const alphaMark = angleMark(n,g,m,19), betaMark = angleMark(n,d,b,19);
    return `<svg class="source52-p31-diagram source52-p31-proof-diagram" data-source52-figure="square-angle-proof" viewBox="0 0 500 560" role="img" aria-label="대각선 ㄹㄴ에 대한 대칭점 ㅅ과 ㄱㄹ을 연장해 만든 점 ㅇ을 표시한 풀이 그림" xmlns="http://www.w3.org/2000/svg"><polygon points="${square}"/><line class="source52-construction-line" x1="${l.x}" y1="${l.y}" x2="${n.x}" y2="${n.y}"/><line x1="${n.x}" y1="${n.y}" x2="${m.x}" y2="${m.y}"/><line x1="${n.x}" y1="${n.y}" x2="${b.x}" y2="${b.y}"/><line x1="${n.x}" y1="${n.y}" x2="${e.x}" y2="${e.y}"/><line class="source52-construction-line" x1="${e.x}" y1="${e.y}" x2="${g.x}" y2="${g.y}"/><line class="source52-construction-line" x1="${l.x}" y1="${l.y}" x2="${s.x}" y2="${s.y}"/>${equalTick(l,m)}${equalTick(l,s)}${equalDoubleTick(g,e)}${equalDoubleTick(d,b)}<path class="source52-angle-mark" d="${alphaMark.d}"/><path class="source52-angle-mark" d="${betaMark.d}"/><text x="108" y="266">ㄱ</text><text x="378" y="266">ㄴ</text><text x="378" y="535">ㄷ</text><text x="108" y="535">ㄹ</text><text x="108" y="${Number((m.y+7).toFixed(1))}">ㅁ</text><text x="${Number((b.x-24).toFixed(1))}" y="535">ㅂ</text><text x="${Number((s.x+7).toFixed(1))}" y="535">ㅅ</text><text x="108" y="${Number((e.y-6).toFixed(1))}">ㅇ</text></svg>`;
  }

  function circlePoint(cx, cy, radius, angle) {
    return { x: cx + radius * Math.cos(rad(angle)), y: cy - radius * Math.sin(rad(angle)) };
  }
  function semicircleDiagram(baseVertexAngle, x, centralArc) {
    const cx = 250, cy = 260, r = 190;
    const g = circlePoint(cx,cy,r,180), rr = circlePoint(cx,cy,r,180-x), m = circlePoint(cx,cy,r,2*x), b = circlePoint(cx,cy,r,x), n = circlePoint(cx,cy,r,0);
    const labels = (p, text, dx, dy) => `<text x="${Number((p.x+dx).toFixed(2))}" y="${Number((p.y+dy).toFixed(2))}">${text}</text>`;
    const givenMark = angleMark(rr,{x:cx,y:cy},m,16);
    const targetMark = angleMark(m,rr,b,17);
    const firstEqual = `<line class="source52-equal-mark" x1="${g.x}" y1="${g.y}" x2="${rr.x}" y2="${rr.y}"/>`;
    const xOne = { x: cx + 45*Math.cos(rad(48)), y: cy - 45*Math.sin(rad(48)) };
    const xTwo = { x: cx + 68*Math.cos(rad(16)), y: cy - 68*Math.sin(rad(16)) };
    return `<svg class="source52-p31-diagram source52-p31-circle" data-source52-figure="semicircle-angle" data-central-arc="${centralArc}" viewBox="0 0 500 330" role="img" aria-label="지름 ㄱㄷㄴ, 같은 현 ㄱㄹ과 ㅁㅂ, 같은 중심각, 목표각 ㉠을 표시한 반원" xmlns="http://www.w3.org/2000/svg"><path class="source52-circle-arc" d="M${point(g.x,g.y)} A${r} ${r} 0 0 1 ${point(n.x,n.y)}"/><line x1="${g.x}" y1="${g.y}" x2="${n.x}" y2="${n.y}"/><line x1="${cx}" y1="${cy}" x2="${rr.x}" y2="${rr.y}"/><line x1="${cx}" y1="${cy}" x2="${m.x}" y2="${m.y}"/><line x1="${cx}" y1="${cy}" x2="${b.x}" y2="${b.y}"/><line x1="${g.x}" y1="${g.y}" x2="${rr.x}" y2="${rr.y}"/><line x1="${rr.x}" y1="${rr.y}" x2="${m.x}" y2="${m.y}"/><line x1="${m.x}" y1="${m.y}" x2="${b.x}" y2="${b.y}"/><line x1="${b.x}" y1="${b.y}" x2="${n.x}" y2="${n.y}"/>${equalTick(g,rr)}${equalTick(m,b)}<circle cx="${cx}" cy="${cy}" r="4"/><path class="source52-angle-mark" d="${givenMark.d}"/><path class="source52-angle-mark" d="${targetMark.d}"/><text x="${cx+8}" y="${cy+18}">ㄷ</text>${labels(g,"ㄱ",-20,18)}${labels(rr,"ㄹ",-14,-10)}${labels(m,"ㅁ",-4,-12)}${labels(b,"ㅂ",-1,-12)}${labels(n,"ㄴ",8,18)}<text class="source52-angle-label" x="${Number((givenMark.label.x-16).toFixed(1))}" y="${Number((givenMark.label.y+4).toFixed(1))}">${baseVertexAngle}°</text><text class="source52-angle-label" x="${Number(xOne.x.toFixed(1))}" y="${Number(xOne.y.toFixed(1))}">x</text><text class="source52-angle-label" x="${Number(xTwo.x.toFixed(1))}" y="${Number(xTwo.y.toFixed(1))}">x</text><text class="source52-target-label" x="${Number((targetMark.label.x-8).toFixed(1))}" y="${Number((targetMark.label.y+4).toFixed(1))}">㉠</text></svg>`;
  }

  function equilateralDiagram(target, delta) {
    const d = { x: 80, y: 175 }, dm = 146;
    const angleAtD = delta;
    const dn = dm * Math.sin(rad(target)) / Math.sin(rad(target + angleAtD));
    const n = { x: d.x + dn, y: d.y };
    const g = { x: d.x + dn * Math.cos(rad(-60)), y: d.y - dn * Math.sin(rad(-60)) };
    const m = { x: d.x + dm * Math.cos(rad(angleAtD)), y: d.y - dm * Math.sin(rad(angleAtD)) };
    const r = { x: d.x + dm * Math.cos(rad(angleAtD - 60)), y: d.y - dm * Math.sin(rad(angleAtD - 60)) };
    const a = (p,q) => `<line x1="${p.x.toFixed(2)}" y1="${p.y.toFixed(2)}" x2="${q.x.toFixed(2)}" y2="${q.y.toFixed(2)}"/>`;
    const text = (p,label,dx,dy) => `<text x="${(p.x+dx).toFixed(2)}" y="${(p.y+dy).toFixed(2)}">${label}</text>`;
    const givenMark = angleMark(m,n,d,18);
    const targetMark = angleMark(r,g,d,18);
    return `<svg class="source52-p31-diagram source52-p31-equilateral" data-source52-figure="equilateral-rotation" data-target-angle="${target}" viewBox="0 0 360 390" role="img" aria-label="공통 꼭짓점 ㄷ을 둔 두 정삼각형, 주어진 각과 회전 대응각 그림" xmlns="http://www.w3.org/2000/svg">${a(d,n)}${a(n,g)}${a(g,d)}${a(d,m)}${a(m,r)}${a(r,d)}${a(m,n)}${a(r,g)}<path class="source52-angle-mark" d="${givenMark.d}"/><path class="source52-angle-mark" d="${targetMark.d}"/><text class="source52-angle-label" x="${(givenMark.label.x-20).toFixed(2)}" y="${(givenMark.label.y+4).toFixed(2)}">${target}°</text>${text(g,"ㄱ",-20,0)}${text(n,"ㄴ",8,-10)}${text(d,"ㄷ",-18,18)}${text(r,"ㄹ",18,-2)}${text(m,"ㅁ",8,-9)}<text class="source52-target-label" x="${(targetMark.label.x-8).toFixed(2)}" y="${(targetMark.label.y+4).toFixed(2)}">㉠</text></svg>`;
  }

  function congruentTriangleAreaDiagram(height, width) {
    const total = height + width;
    const scale = 228 / total;
    const baseline = 302;
    const n = { x: 76, y: baseline };
    const d = { x: n.x + width * scale, y: baseline };
    const r = { x: n.x + total * scale, y: baseline };
    const g = { x: n.x, y: baseline - height * scale };
    const m = { x: r.x, y: baseline - width * scale };
    const pointString = p => point(p.x, p.y);
    const rightAngle = (p, dx, dy, size = 13) => `<path class="source52-right-angle-mark" d="M${point(p.x + dx * size,p.y)} L${point(p.x + dx * size,p.y + dy * size)} L${point(p.x,p.y + dy * size)}"/>`;
    return `<svg class="source52-p31-diagram source52-p31-area" data-source52-figure="congruent-triangle-area" data-height="${height}" data-width="${width}" data-g="${pointString(g)}" data-d="${pointString(d)}" data-m="${pointString(m)}" data-n="${pointString(n)}" data-r="${pointString(r)}" viewBox="0 0 500 370" role="img" aria-label="서로 합동인 두 직각삼각형이 이어져 있고, 가운데 삼각형 ㄱㄷㅁ의 넓이를 구하는 그림" xmlns="http://www.w3.org/2000/svg"><polygon class="source52-area-target" points="${pointString(g)} ${pointString(d)} ${pointString(m)}"/><line x1="${n.x}" y1="${n.y}" x2="${g.x}" y2="${g.y}"/><line x1="${n.x}" y1="${n.y}" x2="${d.x}" y2="${d.y}"/><line x1="${d.x}" y1="${d.y}" x2="${g.x}" y2="${g.y}"/><line x1="${d.x}" y1="${d.y}" x2="${r.x}" y2="${r.y}"/><line x1="${r.x}" y1="${r.y}" x2="${m.x}" y2="${m.y}"/><line x1="${d.x}" y1="${d.y}" x2="${m.x}" y2="${m.y}"/>${rightAngle(n,1,-1)}${rightAngle(r,-1,-1)}<path class="source52-measure-guide" d="M${point(n.x-20,n.y)} L${point(n.x-20,g.y)} M${point(n.x-25,g.y)} L${point(n.x-15,g.y)} M${point(n.x-25,n.y)} L${point(n.x-15,n.y)} M${point(r.x+20,r.y)} L${point(r.x+20,m.y)} M${point(r.x+15,m.y)} L${point(r.x+25,m.y)} M${point(r.x+15,r.y)} L${point(r.x+25,r.y)}"/><text x="${g.x-26}" y="${g.y-4}">ㄱ</text><text x="${n.x-27}" y="${n.y+24}">ㄴ</text><text x="${d.x-10}" y="${d.y+24}">ㄷ</text><text x="${r.x+7}" y="${r.y+24}">ㄹ</text><text x="${m.x+7}" y="${m.y+4}">ㅁ</text><text class="source52-length-label" x="${n.x-49}" y="${(g.y+n.y)/2+4}">${height} cm</text><text class="source52-length-label" x="${r.x+24}" y="${(m.y+r.y)/2+4}">${width} cm</text></svg>`;
  }

  function congruentTriangleAreaProofDiagram(height, width) {
    const total = height + width;
    const scale = 228 / total;
    const baseline = 302;
    const n = { x: 76, y: baseline };
    const d = { x: n.x + width * scale, y: baseline };
    const r = { x: n.x + total * scale, y: baseline };
    const g = { x: n.x, y: baseline - height * scale };
    const m = { x: r.x, y: baseline - width * scale };
    const pointString = p => point(p.x, p.y);
    return `<svg class="source52-p31-diagram source52-p31-area-proof" viewBox="0 0 500 370" role="img" aria-label="점 ㅂ을 더해 직사각형을 만들고 삼각형 ㄱㄷㅁ을 남긴 넓이 풀이 그림" xmlns="http://www.w3.org/2000/svg"><polygon class="source52-area-target" points="${pointString(g)} ${pointString(d)} ${pointString(m)}"/><rect class="source52-construction-line" x="${n.x}" y="${g.y}" width="${total*scale}" height="${height*scale}"/><line x1="${n.x}" y1="${n.y}" x2="${g.x}" y2="${g.y}"/><line x1="${n.x}" y1="${n.y}" x2="${d.x}" y2="${d.y}"/><line x1="${d.x}" y1="${d.y}" x2="${g.x}" y2="${g.y}"/><line x1="${d.x}" y1="${d.y}" x2="${r.x}" y2="${r.y}"/><line x1="${r.x}" y1="${r.y}" x2="${m.x}" y2="${m.y}"/><line x1="${d.x}" y1="${d.y}" x2="${m.x}" y2="${m.y}"/><text x="${g.x-25}" y="${g.y-4}">ㄱ</text><text x="${n.x-26}" y="${n.y+24}">ㄴ</text><text x="${d.x-10}" y="${d.y+24}">ㄷ</text><text x="${r.x+8}" y="${r.y+24}">ㄹ</text><text x="${m.x+8}" y="${m.y+3}">ㅁ</text><text x="${r.x+8}" y="${g.y+4}">ㅂ</text></svg>`;
  }

  function buildMission5(variant, offset) {
    const height = areaBaseHeights[variant] + 2 * offset;
    const width = areaBaseWidths[variant];
    const totalWidth = height + width;
    const topGap = height - width;
    const leftCorner = height * width / 2;
    const rightCorner = height * width / 2;
    const topCorner = totalWidth * topGap / 2;
    const rectangleArea = height * totalWidth;
    const answer = rectangleArea - leftCorner - rightCorner - topCorner;
    const prompt = `<div class="source52-p31-question"><p>삼각형 ㄱㄴㄷ과 삼각형 ㄷㄹㅁ은 서로 합동입니다. ㄱㄴ=${height}cm, ㄹㅁ=${width}cm일 때 삼각형 ㄱㄷㅁ의 넓이를 구하세요.</p>${congruentTriangleAreaDiagram(height,width)}</div>`;
    const solution = `<div class="source52-p31-solution"><ol><li>합동 표기 순서대로 대응점을 맞추면 ㄱ↔ㄷ, ㄴ↔ㄹ, ㄷ↔ㅁ입니다.<br>따라서 ㄴㄷ=ㄹㅁ=${width}cm, ㄷㄹ=ㄱㄴ=${height}cm입니다.</li><li>ㄱ과 같은 높이의 점 ㅂ을 ㄹ 위에 잡아 직사각형 ㄱㄴㄹㅂ을 만듭니다.${congruentTriangleAreaProofDiagram(height,width)}직사각형의 가로는 ${totalWidth}cm, 세로는 ${height}cm이므로 넓이는 ${height}×${totalWidth}=${rectangleArea}cm²입니다.</li><li>직사각형에서 삼각형 ㄱㄷㅁ을 제외한 세 부분을 뺍니다. 왼쪽 아래와 오른쪽 아래 삼각형은 각각 ${height}×${width}÷2=${leftCorner}cm²이고, 위쪽 삼각형은 ${totalWidth}×(${height}−${width})÷2=${topCorner}cm²입니다.</li><li>따라서 삼각형 ㄱㄷㅁ의 넓이는 ${rectangleArea}−${leftCorner}−${rightCorner}−${topCorner}=${answer}cm²입니다.</li></ol></div>`;
    return result("5-2-u3-e4-mission-5", variant, offset, prompt, `${answer}cm²`, solution, { height, width, totalWidth, topGap, rectangleArea, leftCorner, rightCorner, topCorner, answer }, false, answerVisual("합동인 두 삼각형으로 만든 삼각형의 넓이", `${answer}cm²`));
  }

  function trapezoidMidpointDiagram(top, bottom, height, proof = false) {
    const scale = Math.min(14, 240 / top, 180 / height);
    const x0 = 112;
    const y0 = 80;
    const r = { x: x0, y: y0 };
    const d = { x: x0 + top * scale, y: y0 };
    const g = { x: x0, y: y0 + height * scale };
    const n = { x: x0 + bottom * scale, y: y0 + height * scale };
    const m = { x: (d.x+n.x)/2, y: (d.y+n.y)/2 };
    const p = { x: x0, y: m.y };
    const pt = value => point(value.x, value.y);
    const rightAngle = (v, dx, dy) => `<path class="source52-right-angle-mark" d="M${point(v.x+dx*12,v.y)} L${point(v.x+dx*12,v.y+dy*12)} L${point(v.x,v.y+dy*12)}"/>`;
    const construction = proof ? `<line class="source52-midpoint-line" x1="${p.x}" y1="${p.y}" x2="${m.x}" y2="${m.y}"/><circle class="source52-midpoint-dot" cx="${p.x}" cy="${p.y}" r="4"/><text class="source52-construction-label" x="${p.x-20}" y="${p.y+6}">ㅂ</text><text class="source52-measure-label" x="${(p.x+m.x)/2-14}" y="${p.y-8}">${(top+bottom)/2}cm</text>` : "";
    return `<svg class="source52-p31-diagram source52-p31-trapezoid${proof ? " source52-p31-trapezoid-proof" : ""}" data-source52-figure="trapezoid-midpoint-area" data-top="${top}" data-bottom="${bottom}" data-height="${height}" data-g="${pt(g)}" data-n="${pt(n)}" data-d="${pt(d)}" data-r="${pt(r)}" data-m="${pt(m)}" data-p="${pt(p)}" viewBox="0 0 420 330" role="img" aria-label="윗변 ${top}cm, 아랫변 ${bottom}cm, 높이 ${height}cm인 사다리꼴과 옆변의 중점 ㅁ, 목표 삼각형 ㄱㄹㅁ의 넓이를 구하는 그림${proof ? " 및 사다리꼴의 중선" : ""}" xmlns="http://www.w3.org/2000/svg"><polygon class="source52-area-target" points="${pt(g)} ${pt(r)} ${pt(m)}"/><path d="M${pt(g)} L${pt(n)} L${pt(d)} L${pt(r)} Z"/><line x1="${g.x}" y1="${g.y}" x2="${r.x}" y2="${r.y}"/><line x1="${r.x}" y1="${r.y}" x2="${d.x}" y2="${d.y}"/><line x1="${d.x}" y1="${d.y}" x2="${m.x}" y2="${m.y}"/><line x1="${n.x}" y1="${n.y}" x2="${m.x}" y2="${m.y}"/><line x1="${g.x}" y1="${g.y}" x2="${m.x}" y2="${m.y}"/>${rightAngle(g,-1,-1)}${rightAngle(r,-1,1)}${construction}<path class="source52-measure-guide" d="M${r.x} ${y0-14} L${r.x} ${y0-5} M${d.x} ${y0-14} L${d.x} ${y0-5} M${g.x} ${g.y+16} L${g.x} ${g.y+5} M${n.x} ${n.y+16} L${n.x} ${n.y+5} M${x0-18} ${r.y} L${x0-5} ${r.y} M${x0-18} ${g.y} L${x0-5} ${g.y}"/><text x="${r.x-26}" y="${r.y-6}">ㄹ</text><text x="${d.x+7}" y="${d.y+5}">ㄷ</text><text x="${n.x+7}" y="${n.y+8}">ㄴ</text><text x="${g.x-28}" y="${g.y+8}">ㄱ</text><text x="${m.x+8}" y="${m.y+1}">ㅁ</text><text class="source52-length-label" x="${(r.x+d.x)/2-22}" y="${y0-16}">${top}cm</text><text class="source52-length-label" x="${(g.x+n.x)/2-22}" y="${g.y+36}">${bottom}cm</text><text class="source52-length-label" x="${x0-58}" y="${(g.y+r.y)/2+4}">${height}cm</text></svg>`;
  }

  function buildMission6(variant, offset) {
    const top = trapezoidTopBases[variant];
    const bottom = trapezoidBottomBases[variant];
    const height = trapezoidBaseHeights[variant] + 2 * offset;
    const midpointWidth = (top+bottom)/2;
    const answer = height*midpointWidth/2;
    const prompt = `<div class="source52-p31-question"><p>사다리꼴 ㄱㄴㄷㄹ에서 선분 ㄱㄴ과 선분 ㄷㄹ은 각각 선분 ㄱㄹ에 수직입니다. 삼각형 ㄱㄹㅁ의 넓이를 구하세요. (단, 점 ㅁ은 변 ㄴㄷ의 한가운데 점입니다.)</p>${trapezoidMidpointDiagram(top,bottom,height)}</div>`;
    const solution = `<div class="source52-p31-solution"><ol><li>점 ㅁ은 변 ㄴㄷ의 중점입니다. ㅁ을 지나 ㄱㄹ과 평행한 선분을 그어 만나는 점을 ㅂ이라 하면 사다리꼴의 중선이 됩니다.${trapezoidMidpointDiagram(top,bottom,height,true)}</li><li>사다리꼴의 중선 길이는 두 평행한 변의 길이의 평균이므로 ㅂㅁ=(${top}+${bottom})÷2=${midpointWidth}cm입니다.</li><li>삼각형 ㄱㄹㅁ에서 밑변 ㄱㄹ=${height}cm이고 그 밑변에 수직인 높이는 ㅂㅁ=${midpointWidth}cm입니다.</li><li>넓이는 ${height}×${midpointWidth}÷2=${answer}cm²입니다.</li></ol></div>`;
    return result("5-2-u3-e4-mission-6",variant,offset,prompt,`${answer}cm²`,solution,{top,bottom,height,midpointWidth,answer},false,answerVisual("사다리꼴의 중점으로 구하는 삼각형의 넓이",`${answer}cm²`));
  }

  function buildMission1(variant, offset) {
    const alpha = squareAlphas[variant] + difficultyDeltas[offset + 1];
    const beta = 45 - alpha;
    const answer = 2 * alpha;
    const prompt = `<div class="source52-p31-question"><p>정사각형 ㄱㄴㄷㄹ에서 점 ㅁ은 변 ㄱㄹ 위에, 점 ㅂ은 변 ㄹㄷ 위에 있습니다. ∠ㄱㄴㅁ=${alpha}°, ∠ㄷㄴㅂ=${beta}°일 때 ∠ㄹㅁㅂ을 구하세요.</p>${squareDiagram(alpha,beta)}</div>`;
    const solution = `<div class="source52-p31-solution"><p>풀이에 필요한 점 ㅅ과 점 ㅇ은 그림과 같이 잡습니다.</p>${squareProofDiagram(alpha,beta)}<ol><li>대각선 ㄹㄴ에 대해 점 ㅁ을 대칭이동한 점을 ㅅ이라 둡니다. △ㄹㄴㅁ과 △ㄹㄴㅅ은 ㄹㄴ을 공통으로 하고 ㄹㅁ=ㄹㅅ, 두 변 사이의 각이 각각 45°이므로 합동입니다. 따라서 ∠ㄹㄴㅅ=45°−${alpha}°=${beta}°이고, ∠ㅅㄴㄷ=${alpha}°입니다.</li><li>ㄹㄱ을 ㄱ 너머로 연장하고 ㄱㅇ=ㄷㅂ이 되게 점 ㅇ을 잡습니다. △ㄴㄷㅂ과 △ㄴㄱㅇ은 두 변과 그 사이의 각이 각각 같아 합동이므로 ㄴㅂ=ㄴㅇ, ∠ㄱㄴㅇ=${beta}°입니다.</li><li>∠ㅂㄴㅁ=90°−${alpha}°−${beta}°=45°이고 ∠ㅁㄴㅇ=${alpha}°+${beta}°=45°입니다. ㄴㅂ=ㄴㅇ, ㄴㅁ은 공통이고 두 변 사이의 각도 45°로 같으므로 △ㄴㅂㅁ과 △ㄴㅇㅁ은 합동입니다. 직각삼각형 ㄴㄱㅇ에서 ∠ㄴㅇㄱ=90°−${beta}°이고 ㄱ, ㅇ, ㅁ이 한 직선 위에 있으므로 △ㄴㅇㅁ의 나머지 각은 ∠ㄴㅁㅇ=90°−${alpha}°입니다. 따라서 ∠ㄴㅁㅂ=90°−${alpha}°입니다.</li><li>직각삼각형 ㄱㄴㅁ에서 ∠ㄴㅁㄱ=90°−${alpha}°입니다. ㄱ, ㅁ, ㄹ은 한 직선 위에 있으므로 ∠ㄹㅁㄴ=90°+${alpha}°입니다. 따라서 ∠ㄹㅁㅂ=(90°+${alpha}°)−(90°−${alpha}°)=${answer}°입니다.</li></ol></div>`;
    return result("5-2-u3-e4-mission-1", variant, offset, prompt, `${answer}°`, solution, { alpha, beta, answer }, false, answerVisual("정사각형 안의 목표각", `${answer}°`));
  }

  function buildMission2(variant, offset) {
    const vertexAngle = circleBaseVertices[variant] + 3 * difficultyDeltas[offset + 1];
    const arcRM = 180 - 2 * vertexAngle;
    const equalArc = (180 - arcRM) / 3;
    const answer = 180 - (arcRM + equalArc) / 2;
    const prompt = `<div class="source52-p31-question"><p>중심이 ㄷ인 반원의 호 위에 ㄱ, ㄹ, ㅁ, ㅂ, ㄴ이 차례로 놓여 있습니다. ㄷㄹ=ㄷㅁ이고, ㄱㄹ=ㅁㅂ이며, ∠ㅁㄷㅂ=∠ㅂㄷㄴ입니다. ∠ㄷㄹㅁ=${vertexAngle}°일 때 ∠ㄹㅁㅂ을 구하세요.</p>${semicircleDiagram(vertexAngle,equalArc,arcRM)}</div>`;
    const solution = `<div class="source52-p31-solution"><ol><li>ㄷㄹ과 ㄷㅁ은 반지름이므로 △ㄷㄹㅁ은 이등변삼각형입니다. 밑각이 각각 ${vertexAngle}°이므로 중심각 ∠ㄹㄷㅁ=${arcRM}°입니다.</li><li>같은 중심각은 같은 호를 나타내고, 같은 현 ㄱㄹ과 ㅁㅂ도 같은 호를 나타냅니다. 따라서 호 ㄱㄹ, ㅁㅂ, ㅂㄴ의 크기를 각각 x라 두면 반원에서 3x+${arcRM}°=180°이므로 x=${fmt(equalArc)}°입니다.</li><li>ㄹ에서 ㅂ까지 ㅁ을 지나는 작은 호는 ${arcRM}°+${fmt(equalArc)}°=${fmt(arcRM+equalArc)}°입니다. ∠ㄹㅁㅂ은 반대쪽 큰 호 ${fmt(360-arcRM-equalArc)}°를 바라봅니다.</li><li>원주각은 바라보는 호의 절반이므로 ∠ㄹㅁㅂ=${fmt((360-arcRM-equalArc)/2)}°입니다.</li></ol></div>`;
    return result("5-2-u3-e4-mission-2", variant, offset, prompt, `${fmt(answer)}°`, solution, { vertexAngle, centralArc: arcRM, equalArc, answer }, false, answerVisual("반원 문제의 원주각", `${fmt(answer)}°`));
  }

  function buildMission3(variant, offset) {
    const target = triangleBaseTargets[variant] + difficultyDeltas[offset + 1];
    const rotation = 60;
    const prompt = `<div class="source52-p31-question"><p>정삼각형 ㄱㄴㄷ과 정삼각형 ㄷㄹㅁ이 있습니다. ∠ㄴㅁㄷ=${target}°일 때 그림의 ㉠의 크기를 구하세요.</p>${equilateralDiagram(target,10)}</div>`;
    const solution = `<div class="source52-p31-solution"><ol><li>점 ㄷ을 중심으로 시계 방향 ${rotation}° 회전하면 첫 번째 정삼각형에서 ㄴ은 ㄱ으로 옮겨집니다.</li><li>같은 회전에서 두 번째 정삼각형의 ㅁ은 ㄹ로 옮겨지고 ㄷ은 그대로입니다.</li><li>회전은 각의 크기를 보존하므로 ∠ㄴㅁㄷ=∠ㄱㄹㄷ입니다. 따라서 ㉠=${target}°입니다.</li></ol></div>`;
    return result("5-2-u3-e4-mission-3", variant, offset, prompt, `${target}°`, solution, { targetAngle: target, rotationDegrees: rotation }, false, answerVisual("회전으로 옮겨진 같은 각", `${target}°`));
  }

  function answerVisual(label, answer) {
    return `<svg class="source52-p31-answer-visual" viewBox="0 0 320 72" role="img" aria-label="${esc(label)}: ${esc(answer)}" xmlns="http://www.w3.org/2000/svg"><path d="M18 54 A32 32 0 0 1 45 24" fill="none" stroke="#2f6b4a" stroke-width="3"/><text x="62" y="48" fill="#191511" font-size="21" font-family="serif">㉠ = ${esc(answer)}</text></svg>`;
  }

  function result(sourceItemId, variant, offset, prompt, answer, solution, answerModel, reviewLocked, answerVisual) {
    const definition = definitions.find(item => item.sourceItemId === sourceItemId);
    return Object.freeze({
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${offset}" data-level="${offset+1}">${prompt}</div>`,
      answer,
      solution: `<div data-source-answer="${sourceItemId}">${solution}</div>`,
      sourceItemId, generator: definition.generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: variant,
      verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset: offset,
      difficultyLevel: offset + 1, difficultyRank: offset + 1,
      sourceStructurePreserved: true, answerVisualRequired: true,
      answerVisualStatus: "verified-reconstruction",
      answerVisual,
      publisherKeyVerified: false, publisherAnswerVerified: false,
      handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      answerModel, reviewLocked
    });
  }

  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant > 2 || ![-1,0,1].includes(difficultyOffset)) return null;
    if (sourceItemId === definitions[0].sourceItemId) return buildMission1(variant,difficultyOffset);
    if (sourceItemId === definitions[1].sourceItemId) return buildMission2(variant,difficultyOffset);
    if (sourceItemId === definitions[2].sourceItemId) return buildMission3(variant,difficultyOffset);
    if (sourceItemId === definitions[3].sourceItemId) return buildMission5(variant,difficultyOffset);
    if (sourceItemId === definitions[4].sourceItemId) return buildMission6(variant,difficultyOffset);
    return null;
  }
  const keyFor = sourceItemId => definitions.find(item => item.sourceItemId === sourceItemId)?.generatorKey || "";
  const isPublicReady = sourceItemId => Boolean(definitions.find(item => item.sourceItemId === sourceItemId)?.publicReady);

  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52CongruencePage31Installed) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const related = type => definitions.find(def => type && (type.id === def.sourceItemId || type.sourceItemId === def.sourceItemId || type.generatorKey === def.generatorKey));
    generators.generatorKey = type => {
      const def = related(type);
      return !def ? previousKey(type) : type.id === def.sourceItemId && type.sourceItemId === def.sourceItemId && type.generatorKey === def.generatorKey && type.reviewLocked === false && type.sourceVerified === true ? def.generatorKey : "";
    };
    generators.generate = (type, rank, difficulty, seed, variant = 0) => {
      const def = related(type);
      return !def ? previousGenerate(type,rank,difficulty,seed,variant) : generators.generatorKey(type) ? getQuestion(def.sourceItemId,variant,difficulty ?? 0) : null;
    };
    for (const def of definitions) if (Array.isArray(generators.names) && !generators.names.includes(def.generatorKey)) generators.names.push(def.generatorKey);
    Object.defineProperty(generators,"__source52CongruencePage31Installed",{value:true});
    return true;
  }
  return Object.freeze({ definitions, getQuestion, keyFor, isPublicReady, install });
});
