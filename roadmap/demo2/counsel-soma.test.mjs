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
test('family-reported help produces only the supplied book and range; unlearned and unknown do not become weaknesses',()=>{
 const rows=[{id:'thinking',book:'Ray A3-3',unit:'규칙 찾기 12~15쪽',status:'help'},
  {id:'supplement',book:'키즈 팩토',unit:'덧셈',status:'solo'},
  {id:'arithmetic',book:'소마셈 P2',unit:'가르기',status:'unlearned'},
  {id:'geometry',book:'소마도형 P',status:'unknown'}];
 const result=plain(S.evaluate(rows)),plans=plain(S.proposals(rows,settings));
 assert.deepEqual(plans,[{track:'thinking',book:'Ray A3-3',unit:'규칙 찾기 12~15쪽',...settings}]);
 assert.equal(result.filter(r=>r.ready).length,1);
 assert.match(result.find(r=>r.id==='arithmetic').advice,/미학습.*부족한 수행률로 계산하지/u);
 assert.ok(!Object.hasOwn(result[0],'score'));assert.ok(!Object.hasOwn(result[0],'mastery'));
});
test('missing actual chapter or book cannot create a placeholder assignment, and a reference is never a child level',()=>{
 const rows=[{id:'thinking',book:'Ray A3-3',status:'help'},{id:'geometry',unit:'도형 비교',status:'help'}];
 assert.equal(S.proposals(rows,settings).length,0);
 assert.ok(plain(S.restore(null)).every(r=>r.book===''&&r.unit===''&&r.status==='unknown'));
 assert.equal(C.levelGrouping,false);assert.equal(C.currentTextbook,'Ray A3-3');
 assert.equal(S.restore([{id:'thinking',status:'level-a33'}])[0].status,'unknown');
});
test('reported supplementary book decides its lane, and profile summaries contain only the four explicit domains',()=>{
 const state={rows:[{id:'supplement',book:'디딤돌 2-1',unit:'세 자리 수',status:'help'},{id:'private',book:'다른 값',unit:'민감한 원문',status:'help'}]};
 assert.equal(S.proposals(state,settings)[0].track,'curriculum');
 assert.equal(S.proposals([{...state.rows[0],book:'초등 팩토'}],settings)[0].track,'thinking');
 const summary=S.summaries(state);assert.match(summary.currentBooks,/디딤돌 2-1/u);assert.match(summary.soloRange,/세 자리 수/u);
 assert.doesNotMatch(JSON.stringify(summary),/민감한 원문|다른 값/u);
});
