import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const plain=v=>JSON.parse(JSON.stringify(v));
const selection=(extra={})=>({version:1,paperId:'h1-06',metadataVersion:'items-v1',mode:'current',selected:[1,2,3,4,5,6,7,8],excludedUnlearned:Array.from({length:22},(_,i)=>i+9),unmapped:[],learnedUnitIds:['polynomials','equations'],targetUnitIds:[],...extra});
const statuses={1:'correct',2:'correct',3:'correct',4:'correct',5:'correct',6:'helped',7:'wrong',8:'unanswered'};
const input=(extra={})=>({exam:'2026년 6월 학평',level:'1',date:'2026-11-06',scope:'공통수학1 · 선택 문항',attempt:'first',timing:'untimed',minutes:'25',limit:'',total:'',unlearned:'',correct:'',helped:'',cause:'strategy',review:'none',startMonth:'2026-11',months:'1',questionSelection:JSON.stringify(selection()),...Object.fromEntries(Object.entries(statuses).map(([n,v])=>['question-'+n,v])),...extra});
function setup(withItems=true){
 const calls=[],window={},ctx=vm.createContext({window});
 // Contract doubles keep these tests focused on evidence save/restore order.
 // The item engine owns official metadata, identity and number validation.
 const recognized=r=>r.exam==='2026년 6월 학평'&&r.level==='1';
 const restoreItems=r=>{const q=r.questionSelection,a=r.answers||{};if(!recognized(r)||q?.paperId!=='h1-06'||!Array.isArray(q.selected)||q.selected.length>30||q.selected.some(n=>!Number.isInteger(n)||n<1||n>30)||new Set(q.selected).size!==q.selected.length||Object.entries(a).some(([n,s])=>!q.selected.includes(+n)||!['correct','helped','wrong','unanswered','unlearned'].includes(s)))return{};return{questionSelection:plain(q),answers:plain(a)};};
 if(withItems)window.PlannerMockItems={
  restoreRecord:restoreItems,
  readInput(i,r){
   calls.push('items');if(!i.questionSelection)return{value:null,error:null};let q;try{q=typeof i.questionSelection==='string'?JSON.parse(i.questionSelection):i.questionSelection;}catch{return{error:'문항 선택을 다시 확인하세요.'};}
   const answers=Object.fromEntries((q.selected||[]).map(n=>[n,i['question-'+n]]));
   if(Object.values(answers).some(v=>!v))return{error:'각 문항 결과를 선택하세요.'};
   const restored=restoreItems({...r,questionSelection:q,answers});if(!restored.questionSelection)return{error:'시험과 문항 선택을 다시 확인하세요.'};
   const count=s=>Object.values(answers).filter(v=>v===s).length;
   return{value:{...restored,total:q.selected.length,unlearned:count('unlearned'),correct:count('correct'),helped:count('helped'),units:[{title:'이차방정식',unitId:'equations',missed:count('wrong')+count('unanswered'),helped:count('helped'),cause:r.cause}],coveredUnitIds:['equations']},error:null};
  },
  fields(d){return d.questionSelection?'<fieldset data-item-fields><legend>문항별 결과</legend><input type="hidden" name="questionSelection" value="selection"></fieldset>':'';},
  summary(){return '<p>선택 문항</p>';}
 };
 window.PlannerMockFeedback={
  restore:v=>({version:1,assignments:v?.assignments||{}}),
  metadata:r=>({units:plain(r.units||[]),coveredUnitIds:plain(r.coveredUnitIds||[]),bookRepair:plain(r.bookRepair||{version:1,items:[]}),rangeMode:r.rangeMode||'selected'}),
  readInput(i,r,records,previous){calls.push(['feedback',r.total,r.unlearned,r.correct,r.helped]);return{value:{units:[{title:'old manual title',missed:0,helped:0,cause:'unknown'}],bookRepair:plain(previous?.bookRepair||{version:1,items:[]}),rangeMode:'selected'}};},
  fields:()=>'',
  localToday:()=> '2026-11-06'
 };
 vm.runInContext(readFileSync(new URL('planner-mock-evidence.js',import.meta.url),'utf8'),ctx,{filename:'planner-mock-evidence.js'});
 return{M:window.PlannerMockEvidence,window,calls};
}

test('selected questions determine the denominator before feedback validation; earlier unlearned exclusions stay outside it',()=>{
 const {M,calls}=setup(),saved=M.save(null,input({total:'30',unlearned:'0',correct:'30',helped:'0'}));assert.equal(saved.error,null);
 const r=saved.state.records[0];assert.deepEqual(plain(M.result(r)),{learned:8,percent:63,pending:2});assert.equal(r.total,8);assert.equal(r.unlearned,0);assert.equal(r.questionSelection.excludedUnlearned.length,22);
 assert.deepEqual(calls,['items',['feedback',8,0,5,1]]);assert.equal(r.units[0].unitId,'equations');assert.equal(r.units[0].title,'이차방정식');assert.deepEqual(plain(r.coveredUnitIds),['equations']);
});
test('a selected question later marked unlearned is excluded but wrong and unanswered learned questions remain in the denominator',()=>{
 const {M}=setup(),saved=M.save(null,input({'question-8':'unlearned'}));assert.equal(saved.error,null);
 assert.deepEqual(plain(M.result(saved.state.records[0])),{learned:7,percent:71,pending:1});assert.equal(saved.state.records[0].unlearned,1);
 const missing=M.save(saved.state,input({'question-8':''}));assert.match(missing.error,/각 문항/);assert.equal(missing.state.records.length,1);
});
test('question snapshots survive JSON restoration and edits without overwriting book workload or other observations',()=>{
 const {M}=setup(),first=M.save(null,input()).state,r=first.records[0];
 r.bookRepair={version:1,items:[{id:'repair-1',topicKey:'unit:이차방정식',planned:20,completed:12,bookName:'현재 교재'}]};
 const manual=M.save(first,input({questionSelection:'',exam:'별도 수기 시험',scope:'함수',total:'4',unlearned:'0',correct:'3',helped:'0'})).state;
 const restored=M.restore(JSON.parse(JSON.stringify(manual)));assert.deepEqual(plain(restored.records[0].questionSelection),selection());assert.deepEqual(plain(restored.records[0].answers),statuses);
 const before=JSON.stringify(restored),edited=M.save(restored,input({id:r.id,'question-7':'correct'}));assert.equal(edited.error,null);assert.equal(edited.state.records.length,2);assert.equal(edited.state.records[0].correct,6);
 assert.deepEqual(plain(edited.state.records[0].bookRepair),r.bookRepair);assert.equal(edited.state.records[1].exam,'별도 수기 시험');assert.equal(JSON.stringify(restored),before);
});
test('the evidence boundary preserves all item-derived unit rows rather than applying the legacy eight-unit limit',()=>{
 const {M,window}=setup(),original=window.PlannerMockItems.readInput,q=selection({selected:Array.from({length:30},(_,i)=>i+1),excludedUnlearned:[]});
 window.PlannerMockItems.readInput=(...args)=>{const out=original(...args);out.value.units=Array.from({length:30},(_,i)=>({title:'확인 단원 '+i,unitId:'unit-'+i,missed:1,helped:0,cause:'concept'}));return out;};
 const saved=M.save(null,input({questionSelection:JSON.stringify(q),...Object.fromEntries(q.selected.map(n=>['question-'+n,'wrong']))}));assert.equal(saved.error,null);
 const restored=M.restore(JSON.parse(JSON.stringify(saved.state)));assert.equal(restored.records[0].units.length,30);assert.equal(restored.records[0].units[29].unitId,'unit-29');assert.equal(M.result(restored.records[0]).pending,30);
});
test('a changed exam or grade cannot carry old question answers into an edited observation',()=>{
 const {M}=setup(),s=M.save(null,input()).state,before=JSON.stringify(s),id=s.records[0].id;
 for(const change of [{exam:'2025년 6월 학평'},{level:'2'}]){const out=M.save(s,input({id,...change}));assert.match(out.error,/시험과 문항/);assert.deepEqual(plain(out.state),JSON.parse(before));assert.equal(JSON.stringify(s),before);}
});
test('invalid or inconsistent item snapshots fall back to preserved aggregate evidence instead of losing the original record',()=>{
 const {M}=setup(),s=M.save(null,input()).state,r=s.records[0];
 for(const bad of [{...r,correct:4},{...r,answers:{...r.answers,31:'correct'}},{...r,questionSelection:{...r.questionSelection,paperId:'y2025-h1-06'}}]){
  const restored=M.restore({version:1,records:[bad]}).records[0];assert.ok(restored);assert.equal(restored.correct,bad.correct);assert.equal(restored.questionSelection,undefined);assert.equal(restored.answers,undefined);
 }
 const missing={...r,answers:{...r.answers}};delete missing.answers[8];const restored=M.restore({version:1,records:[missing]}).records[0];assert.ok(restored.questionSelection);assert.equal(M.result(restored).pending,2);
});
test('legacy aggregate mode and the 100-record limit remain available with or without an item helper',()=>{
 for(const withItems of [false,true]){const {M}=setup(withItems),i=input({questionSelection:'',total:'10',unlearned:'2',correct:'6',helped:'1'}),out=M.save(null,i);assert.equal(out.error,null);assert.deepEqual(plain(M.result(out.state.records[0])),{learned:8,percent:75,pending:1});
  const records=Array.from({length:100},(_,n)=>({...out.state.records[0],id:'legacy-'+n}));const full=M.save({version:1,records},i);assert.match(full.error,/100개/);assert.equal(full.state.records.length,100);
 }
});
test('empty selections cannot save, while rendered item counts are readonly and an empty form explains why submission is unavailable',()=>{
 const {M}=setup(),q=selection({selected:[]}),out=M.save(null,input({questionSelection:JSON.stringify(q)}));assert.match(out.error,/선택된 문항이 없습니다/);assert.equal(out.state.records.length,0);
 const html=M.render(null,{today:'2026-11-06',prefill:{...input(),questionSelection:selection(),answers:statuses}});assert.ok(html.indexOf('data-item-fields')<html.indexOf('<legend>이 범위의 문항 수'));
 for(const name of ['total','unlearned','correct','helped'])assert.match(html,new RegExp('name="'+name+'"[^>]*readonly'));
 assert.match(html,/선택 전에 제외한 미학습/);
 const empty=M.render(null,{prefill:{questionSelection:q}});assert.match(empty,/<button type="submit" disabled>/);assert.match(empty,/선택된 문항이 없습니다/);
 const manual=M.render(null);assert.doesNotMatch(manual,/name="total"[^>]*readonly/);
});
test('item errors short-circuit feedback and do not expose arbitrary helper metadata through restoration',()=>{
 const {M,window,calls}=setup(),bad=M.save(null,input({questionSelection:'not-json'}));assert.match(bad.error,/문항 선택/);assert.deepEqual(calls,['items']);
 const r=M.save(null,input()).state.records[0],original=window.PlannerMockItems.restoreRecord;window.PlannerMockItems.restoreRecord=x=>({...original(x),unexpected:'not part of evidence contract'});
 assert.equal(M.restore({version:1,records:[r]}).records[0].unexpected,undefined);
});
