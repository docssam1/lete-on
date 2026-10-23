"use strict";

const assert = require("node:assert/strict");

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-4-2-quadrilateral.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-congruence-page31.js");

const distance = (first, second) => Math.hypot(first.x-second.x, first.y-second.y);
const angleAt = (first, vertex, second) => {
  const a = { x: first.x-vertex.x, y: first.y-vertex.y };
  const b = { x: second.x-vertex.x, y: second.y-vertex.y };
  const cosine = (a.x*b.x+a.y*b.y)/(Math.hypot(a.x,a.y)*Math.hypot(b.x,b.y));
  return Math.acos(Math.max(-1,Math.min(1,cosine))) * 180 / Math.PI;
};

const allTypes = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)));
const sourceTypes = source.definitions.map(def => {
  const type = allTypes.find(item => item.id === def.sourceItemId);
  assert.ok(type, `missing curriculum type: ${def.sourceItemId}`);
  assert.equal(type.sourceItemId, def.sourceItemId);
  assert.equal(type.generatorKey, def.generatorKey);
  assert.equal(type.reviewLocked, !def.publicReady);
  return type;
});

let combinations = 0;
const areaPoolSignatures = new Set();
const midpointPoolSignatures = new Set();
const trisectionPoolSignatures = new Set();
for (const def of source.definitions) {
  for (let variant = 0; variant < 3; variant += 1) {
    for (const difficultyOffset of [-1, 0, 1]) {
      const item = source.getQuestion(def.sourceItemId, variant, difficultyOffset);
      assert.ok(item, `no question ${def.sourceItemId} / ${variant} / ${difficultyOffset}`);
      assert.equal(item.sourceItemId, def.sourceItemId);
      assert.equal(item.verifiedVariantCount, 3);
      assert.equal(item.verifiedPoolIndex, variant);
      assert.equal(item.difficultyOffset, difficultyOffset);
      assert.equal(item.answerVisualStatus, "verified-reconstruction");
      assert.match(item.answerVisual, /<svg[\s\S]*<\/svg>/);
      assert.match(item.prompt, /<svg[\s\S]*<\/svg>/);
      assert.doesNotMatch(item.prompt, /data-source-answer|정답은|답은/);
      assert.match(item.solution, /data-source-answer/);

      if (def.sourceItemId.endsWith("mission-1")) {
        const { alpha, beta, answer } = item.answerModel;
        assert.equal(alpha + beta, 45);
        assert.ok(beta > alpha && alpha < 22.5, "The fixed pool keeps B between R and S");
        assert.equal(answer, 2 * alpha);
        assert.notEqual(alpha, 20);
        assert.notEqual(beta, 25);
        assert.match(item.solution, /두 변 사이의 각|두 변과 그 사이의 각/);
        assert.doesNotMatch(item.solution, /tan\(|탄젠트/);
        const tangent = value => Math.tan(value * Math.PI / 180);
        const g = { x: 0, y: 1 }, n = { x: 1, y: 1 }, d = { x: 1, y: 0 }, r = { x: 0, y: 0 };
        const m = { x: 0, y: 1-tangent(alpha) };
        const b = { x: 1-tangent(beta), y: 0 };
        const s = { x: 1-tangent(alpha), y: 0 };
        const e = { x: 0, y: 1+tangent(beta) };
        assert.ok(r.x < b.x && b.x < s.x && s.x < d.x, "B lies between R and S for all public variants");
        assert.ok(Math.abs(distance(n,b)-distance(n,e)) < 1e-9, "The first SAS construction transfers NB=NE");
        assert.ok(Math.abs(angleAt(b,n,m)-45) < 1e-9);
        assert.ok(Math.abs(angleAt(m,n,e)-45) < 1e-9);
        assert.ok(Math.abs(angleAt(r,m,b)-answer) < 1e-8);
      } else if (def.sourceItemId.endsWith("mission-2")) {
        const { vertexAngle, centralArc, equalArc, answer } = item.answerModel;
        assert.ok(Math.abs(centralArc - (180 - 2 * vertexAngle)) < 1e-9);
        assert.ok(Math.abs(3 * equalArc + centralArc - 180) < 1e-9);
        assert.ok(Math.abs(answer - (360 - centralArc - equalArc) / 2) < 1e-9);
        assert.notEqual(vertexAngle, 60);
        assert.notEqual(answer, 130);
      } else if (def.sourceItemId.endsWith("mission-3")) {
        const { targetAngle, rotationDegrees } = item.answerModel;
        assert.equal(rotationDegrees, 60);
        assert.notEqual(targetAngle, 140);
        const d = { x: 0, y: 0 };
        const dm = 1;
        const delta = 10;
        const dn = dm * Math.sin(targetAngle * Math.PI / 180) / Math.sin((targetAngle + delta) * Math.PI / 180);
        const n = { x: dn, y: 0 };
        const m = { x: dm * Math.cos(delta * Math.PI / 180), y: dm * Math.sin(delta * Math.PI / 180) };
        const u = { x: n.x - m.x, y: n.y - m.y };
        const v = { x: d.x - m.x, y: d.y - m.y };
        const angle = Math.acos((u.x*v.x+u.y*v.y)/(Math.hypot(u.x,u.y)*Math.hypot(v.x,v.y))) * 180 / Math.PI;
        assert.ok(Math.abs(angle - targetAngle) < 1e-8);
      } else if (def.sourceItemId.endsWith("mission-4")) {
        const { k, side, outerArea, trisectedLength, cornerArea, answer } = item.answerModel;
        const svg = item.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
        assert.ok(svg, "Mission 4 must render the source's trisection-square diagram");
        const readAttr = name => Number(svg.match(new RegExp(`data-${name}="([^"]+)"`))?.[1]);
        const readPoint = name => {
          const [x,y] = svg.match(new RegExp(`data-${name}="([^"]+)"`))?.[1]?.split(",").map(Number) ?? [];
          return { x, y };
        };
        const g = readPoint("g"), n = readPoint("n"), d = readPoint("d"), r = readPoint("r");
        const m = readPoint("m"), b = readPoint("b"), s = readPoint("s"), o = readPoint("o");
        const dot = (a,b,c) => (a.x-b.x)*(c.x-b.x)+(a.y-b.y)*(c.y-b.y);
        const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
        const polygon = [m,b,s,o];
        const visualArea = Math.abs(polygon.reduce((sum,point,index) => {
          const next = polygon[(index+1)%polygon.length];
          return sum + point.x*next.y-point.y*next.x;
        },0))/2;
        const scale = (n.x-g.x)/side;
        assert.equal(readAttr("k"), k);
        assert.equal(readAttr("side-length"), side);
        assert.equal(readAttr("outer-area"), outerArea);
        assert.equal(side, 3*k);
        assert.equal(outerArea, side*side);
        assert.equal(trisectedLength, k);
        assert.deepEqual(m, { x:g.x+2*(n.x-g.x)/3, y:g.y }, "M is two thirds along the top side");
        assert.deepEqual(b, { x:r.x, y:g.y+(r.y-g.y)/3 }, "B is one third down the left side");
        assert.deepEqual(s, { x:r.x+(d.x-r.x)/3, y:r.y }, "S is one third along the bottom side");
        assert.deepEqual(o, { x:n.x, y:n.y+2*(d.y-n.y)/3 }, "O is two thirds down the right side");
        const sides = [distance(m,b), distance(b,s), distance(s,o), distance(o,m)];
        assert.ok(sides.every(value => Math.abs(value-sides[0]) < 1e-8), "inner quadrilateral is a square");
        assert.ok(Math.abs(dot(m,b,s)) < 1e-8 && Math.abs(dot(b,s,o)) < 1e-8, "adjacent inner sides are perpendicular");
        assert.equal((svg.match(/class="source52-corner-triangle"/g) ?? []).length, 4, "four outer corner triangles are represented");
        assert.equal(cornerArea, k*2*k/2);
        assert.equal(answer, outerArea-4*cornerArea);
        assert.ok(Math.abs(visualArea/(scale*scale)-answer) < 1e-8, "rendered inner square area matches the answer");
        assert.equal(item.answer, `${answer}cm²`);
        assert.match(item.prompt, new RegExp(`넓이가 ${outerArea}cm²인 정사각형`));
        assert.match(item.prompt, /삼등분점을 이어 작은 정사각형 ㅁㅂㅅㅇ/);
        assert.match(item.solution, /직각삼각형/);
        assert.match(item.solution, new RegExp(`${k}×${2*k}÷2=${cornerArea}cm²`));
        assert.match(item.solution, new RegExp(`${outerArea}−${4*cornerArea}=${answer}cm²`));
        assert.equal(item.reviewLocked, false);
        assert.equal(source.isPublicReady(def.sourceItemId), true);
        const type = sourceTypes.find(candidate => candidate.sourceItemId === def.sourceItemId);
        assert.match(type.sourceEvidence, /1BXdJeD7DOnqb78y_E1FNuIqwoOXZ9q-s/);
        assert.match(type.sourceEvidence, /d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463/);
        assert.match(type.sourceEvidence, /clean-alternate-sha256:6c3fde0d51b7e277eee7427de4db1742a42f11ef5113b25a1050aad2fcbe0ce88/);
        assert.match(type.sourceEvidence, /PDF p\.26; printed p\.31/);
        if (variant === 1 && difficultyOffset === 0) {
          assert.deepEqual({ k, side, outerArea, trisectedLength, cornerArea, answer }, { k:5, side:15, outerArea:225, trisectedLength:5, cornerArea:25, answer:125 }, "the verified pool includes the exact source values and independent answer");
        }
        trisectionPoolSignatures.add(`${k}:${outerArea}:${answer}`);
      } else if (def.sourceItemId.endsWith("mission-5")) {
        const { height, width, totalWidth, topGap, rectangleArea, leftCorner, rightCorner, topCorner, answer } = item.answerModel;
        const svg = item.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
        assert.ok(svg, "Mission 5 must render a source diagram");
        const readAttr = name => Number(svg.match(new RegExp(`data-${name}="([^"]+)"`))?.[1]);
        const readPoint = name => {
          const [x,y] = svg.match(new RegExp(`data-${name}="([^"]+)"`))?.[1]?.split(",").map(Number) ?? [];
          return { x, y };
        };
        const g = readPoint("g"), d = readPoint("d"), m = readPoint("m"), n = readPoint("n"), r = readPoint("r");
        const dot = (a,b,c) => (a.x-b.x)*(c.x-b.x)+(a.y-b.y)*(c.y-b.y);
        const shoelaceArea = Math.abs((d.x-g.x)*(m.y-g.y)-(d.y-g.y)*(m.x-g.x))/2;
        assert.equal(readAttr("height"), height);
        assert.equal(readAttr("width"), width);
        assert.ok(height > width, "the generated source figure keeps the top corner inside the bounding rectangle");
        assert.equal(totalWidth, height + width);
        assert.equal(topGap, height - width);
        assert.ok(Math.abs(dot(g,n,d))/(distance(g,n)*distance(d,n)) < 1e-4, "left source triangle has its right angle at N");
        assert.ok(Math.abs(dot(d,r,m))/(distance(d,r)*distance(m,r)) < 1e-4, "right source triangle has its right angle at R");
        assert.ok(Math.abs(distance(n,g)-distance(r,d)) < 0.05, "congruent triangles have equal corresponding vertical legs");
        assert.ok(Math.abs(distance(n,d)-distance(r,m)) < 0.05, "congruent triangles have equal corresponding horizontal legs");
        assert.ok(Math.abs(distance(g,d)-distance(d,m)) < 0.05, "congruent triangles have equal hypotenuses");
        const renderedAreaInCm = shoelaceArea / ((228/totalWidth) ** 2);
        assert.ok(Math.abs(renderedAreaInCm-answer) < 0.01, "the rendered target triangle matches the answer");
        assert.equal(leftCorner, height*width/2);
        assert.equal(rightCorner, height*width/2);
        assert.equal(rectangleArea, height*totalWidth);
        assert.equal(topCorner, totalWidth*topGap/2);
        assert.equal(answer, (height*height+width*width)/2);
        assert.notDeepEqual([height,width], [16,8], "generated values do not reproduce the source numbers");
        assert.match(item.prompt, new RegExp(`ㄱㄴ=${height}cm`));
        assert.match(item.prompt, new RegExp(`ㄹㅁ=${width}cm`));
        assert.match(item.solution, /합동 표기 순서대로/);
        assert.match(item.solution, /직사각형/);
        assert.match(item.solution, /data-source52-figure|area-proof/);
        assert.match(item.solution, new RegExp(`${answer}cm²`));
        assert.equal(item.reviewLocked, false);
        assert.equal(source.isPublicReady(def.sourceItemId), true, "only the verified candidate is public-ready");
        const type = sourceTypes.find(candidate => candidate.sourceItemId === def.sourceItemId);
        assert.match(type.sourceEvidence, /1BXdJeD7DOnqb78y_E1FNuIqwoOXZ9q-s/);
        assert.match(type.sourceEvidence, /d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463/);
        assert.match(type.sourceEvidence, /PDF p\.27; printed p\.31/);
        areaPoolSignatures.add(`${height}:${width}`);
      } else {
        const { top, bottom, height, midpointWidth, answer } = item.answerModel;
        const svg = item.prompt.match(/<svg[\s\S]*?<\/svg>/)?.[0];
        assert.ok(svg, "Mission 6 must render the verified trapezoid source structure");
        const readAttr = name => Number(svg.match(new RegExp(`data-${name}="([^"]+)"`))?.[1]);
        const readPoint = name => {
          const [x,y] = svg.match(new RegExp(`data-${name}="([^"]+)"`))?.[1]?.split(",").map(Number) ?? [];
          return { x, y };
        };
        const g = readPoint("g"), n = readPoint("n"), d = readPoint("d"), r = readPoint("r"), m = readPoint("m"), p = readPoint("p");
        const dot = (a,b,c) => (a.x-b.x)*(c.x-b.x)+(a.y-b.y)*(c.y-b.y);
        const area = Math.abs((r.x-g.x)*(m.y-g.y)-(r.y-g.y)*(m.x-g.x))/2;
        assert.equal(readAttr("top"), top);
        assert.equal(readAttr("bottom"), bottom);
        assert.equal(readAttr("height"), height);
        assert.deepEqual(m, { x:(n.x+d.x)/2, y:(n.y+d.y)/2 }, "M is the midpoint of side ND");
        assert.equal(p.x, g.x);
        assert.equal(p.y, m.y);
        assert.ok(Math.abs(dot(n,g,r))/(distance(g,n)*distance(r,g)) < 1e-8, "base GN is perpendicular to GR");
        assert.ok(Math.abs(dot(d,r,g))/(distance(r,d)*distance(g,r)) < 1e-8, "base RD is perpendicular to GR");
        assert.equal(midpointWidth, (top+bottom)/2);
        assert.equal(answer, height*midpointWidth/2);
        if (variant === 0 && difficultyOffset === 0) {
          assert.deepEqual({ top, bottom, height, midpointWidth, answer }, { top:10, bottom:8, height:6, midpointWidth:9, answer:27 }, "the source's original dimensions and answer must be present in the verified pool");
        }
        assert.ok(Math.abs(area / ((Math.min(14,240/top,180/height))**2) - answer) < 1e-8, "rendered target triangle matches the answer");
        assert.match(svg, new RegExp(`>${bottom}cm<\/text>`));
        assert.match(svg, new RegExp(`>${top}cm<\/text>`));
        assert.match(svg, new RegExp(`>${height}cm<\/text>`));
        assert.match(item.prompt, /삼각형 ㄱㄹㅁ의 넓이/);
        assert.match(item.prompt, /점 ㅁ은 변 ㄴㄷ의 한가운데 점/);
        assert.match(item.solution, /사다리꼴의 중선 길이는 두 평행한 변의 길이의 평균/);
        assert.match(item.solution, new RegExp(`${answer}cm²`));
        assert.equal(item.reviewLocked, false);
        assert.equal(source.isPublicReady(def.sourceItemId), true);
        const type = sourceTypes.find(candidate => candidate.sourceItemId === def.sourceItemId);
        assert.match(type.sourceEvidence, /1BXdJeD7DOnqb78y_E1FNuIqwoOXZ9q-s/);
        assert.match(type.sourceEvidence, /d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463/);
        assert.match(type.sourceEvidence, /PDF p\.27; printed p\.31/);
        midpointPoolSignatures.add(`${top}:${bottom}:${height}`);
      }
      combinations += 1;
    }
  }
}

assert.equal(source.getQuestion("unknown", 0, 0), null);
assert.equal(source.getQuestion(source.definitions[0].sourceItemId, 3, 0), null);
assert.equal(source.getQuestion(source.definitions[0].sourceItemId, 0, 2), null);
assert.equal(areaPoolSignatures.size, 9, "all three variants at all difficulty levels must be distinct");
assert.equal(midpointPoolSignatures.size, 9, "all Mission 6 pools and difficulty levels must be distinct");
assert.equal(trisectionPoolSignatures.size, 9, "all Mission 4 pools and difficulty levels must be distinct");
for (const type of sourceTypes) {
  if (type.reviewLocked) {
    assert.equal(window.HSE_GENERATORS.generatorKey(type), "", "review-locked Mission 5 must not register publicly");
    assert.equal(window.HSE_GENERATORS.generate(type, 1, 0, "audit", 0), null);
    continue;
  }
  assert.equal(window.HSE_GENERATORS.generatorKey(type), type.generatorKey);
  for (let variant = 0; variant < 3; variant += 1) {
    for (const difficultyOffset of [-1, 0, 1]) {
      const generated = window.HSE_GENERATORS.generate(type, 1, difficultyOffset, "audit", variant);
      assert.ok(generated, `HSE_GENERATORS rejected ${type.id}`);
      assert.equal(generated.sourceItemId, type.sourceItemId);
    }
  }
}

console.log(`인쇄 31쪽 합동·대칭 Mission 감사 통과: 6문항 · ${combinations}개 조합 · SAS·삼등분 넓이·넓이 분할·사다리꼴 중선 검산 · 공개 6`);
