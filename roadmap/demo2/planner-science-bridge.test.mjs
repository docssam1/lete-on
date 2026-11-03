import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const w={},c=vm.createContext({window:w});
for(const f of ['planner-science-levels.js','planner-science-curriculum.js','planner-science.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),c,{filename:f});
const S=w.PlannerScience;
const ctx={now:57,year:2026,anchor:5,level:'L3',curriculumPolicy:2};
test('기본 뒤 심화·하이탑 복습은6개월로 끝나며 열린 반복구간을 자동 추가하지 않는다',()=>{
 for(const bridgeBook of ['julgi','highTop']){
  const m=S.model({version:1,enabled:true,completed:['elementary'],bridgeBook},ctx);
  assert.deepEqual(Array.from(m.next.filter(x=>!x.review),x=>x.months),[4,3,3,3]);
  const b=m.continuation.find(x=>x.bridge);assert.equal(b.end-b.start,6);
  assert.ok(!m.blocks.some(x=>x.id==='highTopRepeat'||x.repeat));
  assert.equal(m.bridgeCheckpoint.at,b.end);
  assert.ok(!w.PlannerScienceCurriculum.rows(m).some(([label])=>label==='하이탑 반복'));
  assert.match(w.PlannerScienceCurriculum.guidance(m,b).html,/복습.*기간에 포함/);
 }
});
test('학기별 기본을 고르면 브릿지는 선택이고 수학·이수 기록은 바꾸지 않는다',()=>{
 const input={version:1,enabled:true,completed:['elementary'],route:'otu'},before=JSON.stringify(input);
 const basic=S.model(input,{...ctx,level:'L9'});assert.equal(basic.continuation.length,0);
 const extra=S.model({...input,extension:'bridge'},{...ctx,level:'L9'});
 assert.equal(extra.continuation.filter(x=>x.bridge).length,1);assert.equal(extra.continuation[0].months,6);
 assert.equal(JSON.stringify(input),before);assert.ok(!basic.blocks.some(x=>x.repeat));
});

test("과학 화면은 진도라는 이름으로 안내한다",()=>{const source=readFileSync(new URL("planner-science.js",import.meta.url),"utf8");assert.ok(!source.includes("과학 갈림길"));assert.match(S.root({}),/과학 진도/);});
