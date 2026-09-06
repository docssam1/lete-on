import assert from "node:assert/strict";
import { rotationArc, rotationCue } from "./rotation-cue.js";
import { operationLabel, translation } from "./i18n.js";
import { operationText } from "../../worksheet/shape-transform/workbook-core.js";

const cases = [
  { angle:90, end:[56,32], tangent:[0,1], sweep:1 },
  { angle:-90, end:[8,32], tangent:[0,1], sweep:0 },
  { angle:180, end:[32,56], tangent:[-1,0], sweep:1 }
];
for (const fixture of cases) {
  const arc = rotationArc(fixture.angle);
  assert.deepEqual(arc.end,fixture.end);
  assert.deepEqual(arc.head[0],fixture.end);
  assert.ok(arc.tangent.every((value,index)=>Math.abs(value-fixture.tangent[index])<1e-8));
  assert.equal(arc.path,`M32 8 A24 24 0 0 ${fixture.sweep} ${fixture.end.join(" ")}`);
  assert.equal(Math.hypot(arc.end[0]-32,arc.end[1]-32),24);
  const base = arc.head.slice(1).reduce((sum,point)=>sum.map((value,index)=>value+point[index]/2),[0,0]);
  const forward = arc.end.map((value,index)=>value-base[index]);
  assert.ok(forward.reduce((sum,value,index)=>sum+value*fixture.tangent[index],0)>6.9,"Arrowhead must point along the turn");
  const copy = operationText({kind:"rotate",angle:fixture.angle});
  assert.match(copy,Math.abs(fixture.angle)===90?/반의 반 바퀴 \(90°\)/:/반 바퀴 \(180°\)/);
  assert.equal(copy.startsWith("반시계"),fixture.angle<0);
  for (const language of ["ko","en","zh","ja"]) {
    const { t } = translation(language);
    const label = operationLabel({operation:{kind:"rotate",angle:fixture.angle}},t);
    assert.ok(label.includes(Math.abs(fixture.angle)+"°"));
    assert.ok(!/[º]|1\/2|0\.5|\\frac/.test(label));
    const svg = rotationCue(fixture.angle,label);
    assert.ok(svg.includes('data-angle="'+fixture.angle+'"'));
    assert.ok(svg.includes(">"+Math.abs(fixture.angle)+"°</text>"));
  }
}
assert.equal(operationText({kind:"reduce",scale:.5}),"변의 길이를 절반으로 줄이기");
assert.equal(operationText({kind:"enlarge",scale:2}),"변의 길이를 2배로 확대");
assert.ok(rotationCue(90,'<test "label">').includes('&lt;test &quot;label&quot;&gt;'));
assert.throws(()=>rotationArc(45),/Unsupported/);
console.log("Notation passed: 3 exact arcs and tangent arrowheads; 4 locales; half and double labels.");
