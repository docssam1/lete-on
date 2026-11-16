import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const ctx=vm.createContext({window:{}});
for(const file of ['planner-soma-current.js','counsel-soma.js'])vm.runInContext(fs.readFileSync(new URL(file,import.meta.url),'utf8'),ctx,{filename:file});
const S=ctx.window.RoadmapCounselSoma,C=ctx.window.PLANNER_SOMA_CURRENT,plain=value=>JSON.parse(JSON.stringify(value));
const source={id:'approved-case',source:'원장님 정정 · '+C.source.sha256,body:'소마 현재 5세는 별도 레벨 구분 없이 Ray A3-3 교재를 공부합니다.'};
const settings={practice:'2026-11-15',recheck:'2026-11-22',practiceCount:3,recheckCount:2};
test('only the selected approved current-five source can display its monthly reference',()=>{
 assert.equal(S.source({question:'소마 5세',sources:[]}),undefined);
 assert.equal(S.source({sources:[{...source,status:'candidate'}]}),undefined);
 assert.equal(S.source({sources:[{...source,status:'archived'}]}),undefined);
 assert.equal(S.source({sources:[{...source,source:'다른 연도 운영표'}]}),undefined);
 assert.equal(S.source({sources:[source]}).id,'approved-case');
});
test('ten periods cover all four axes and retain the unlabelled supplement gap and B5-B8 jump',()=>{
 const rows=plain(S.monthlyRows());assert.equal(rows.length,10);
 assert.equal(rows[0].period,'2026.11 ~ 2027.02');assert.equal(rows[0].cells[1],'—');
 assert.equal(rows[2].cells[1],'키즈 팩토 기본 (A·B·C)');
 assert.equal(rows[5].cells[0],'Premier 라이즈');assert.equal(rows[8].cells[1],'디딤돌 2-1');
 assert.equal(rows[9].period,'2028.07 ~ 2028.08');
 assert.ok(rows.every(row=>row.cells.length===4));
 assert.ok(!JSON.stringify(rows).includes('소마셈 B1'));
});
test('a selected academy table can only render a reference, never an assessment or assignment',()=>{
 const tags=[];const node=tag=>({tag,children:[],textContent:'',setAttribute(k,v){this[k]=v;},append(...values){this.children.push(...values);},replaceChildren(){this.children=[];}});
 ctx.window.document={createElement:tag=>{tags.push(tag);return node(tag);}};
 ctx.window.RoadmapCounselPlan={saveBatch:()=>assert.fail('academy reference created homework')};
 const host=node('div');let opened;
 assert.equal(S.mount(host,{question:'현재 5세 소마 월별 운영표',sources:[source]},{openSource:id=>opened=id}),true);
 assert.ok(tags.includes('table'));assert.ok(tags.includes('details'));assert.ok(!tags.includes('form'));assert.ok(!tags.includes('input'));assert.equal(tags.filter(t=>t==='button').length,1);
 const fold=host.children[0];assert.equal(fold.open,true);fold.children.at(-1).onclick();assert.equal(opened,source.id);
 assert.equal(S.proposals,undefined);assert.equal(S.evaluate,undefined);
});
