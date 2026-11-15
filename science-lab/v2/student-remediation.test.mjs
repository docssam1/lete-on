import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{withReadableRemediation,STUDENT_REMEDIATION_VERSION as version}from'../data/book/student-remediation.js';import{withThink,loadJudge}from'./think-merge.js';import{questionMisconceptions}from'./question-revision.js';import{gradeDaily,vocabOf}from'./daily-grade.js';import{bearers,classify}from'./progress.js';import{teacherKeyHtml}from'./daily.js';
const bindings={'c22-s62-u03':['M14'],'c22-s52-u02':['M07'],'c22-s61-u01':['M09'],'c22-s61-u02':['M09'],'c22-s61-u03':['M05','M13']},url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink})),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('reviewed guidance changes only labels and explanation sentences, leaving generated source and future definitions intact',async()=>{
 let changed=0;
 for(const[unit,ids]of Object.entries(bindings)){
  const raw=await import('../data/units/'+unit+'.misc.js'),input=structuredClone({...raw}),source=structuredClone(input);Object.freeze(input.misconceptions);for(const m of Object.values(input.misconceptions)){Object.freeze(m.terms);Object.freeze(m);}
  const next=withReadableRemediation(unit,input);assert.notEqual(next,input);assert.deepEqual({...next,misconceptions:input.misconceptions},input);assert.deepEqual(input,source);
  for(const[id,m]of Object.entries(next.misconceptions)){
   const before=input.misconceptions[id];if(!ids.includes(id)){assert.equal(m,before);continue;}changed++;assert.notEqual(m.label,before.label);assert.notEqual(m.fix,before.fix);assert.deepEqual({...m,label:before.label,fix:before.fix},before);assert.equal(m.terms,before.terms);
   for(const patch of[{label:before.label+' future'},{fix:before.fix+' future'},{terms:['future']},{element:'future'},{future:true}]){const altered={...input,misconceptions:{...input.misconceptions,[id]:{...before,...patch}}};assert.equal(withReadableRemediation(unit,altered).misconceptions[id],altered.misconceptions[id]);}
  }
  assert.equal(withReadableRemediation(unit,next),next);assert.equal(withReadableRemediation('another-unit',input),input);
  assert.deepEqual({...raw},source);
 }assert.equal(changed,6);
});

test('all 96 linked current/source/paired questions keep grading and diagnosis codes while actual feedback and teacher keys use clearer guidance',async()=>{
 let questions=0,cases=0,feedback=0;const newlyLinkedElectricitySources=[],pools={items:0,source:0,similar:0};
 for(const[unit,ids]of Object.entries(bindings)){
  const mod=await loaders[unit](),raw=await import('../data/units/'+unit+'.misc.js'),before={...mod.misc,misconceptions:{...mod.misc.misconceptions,...Object.fromEntries(ids.map(id=>[id,raw.misconceptions[id]]))}},judge=await loadJudge(unit),vocab=vocabOf(mod.items,mod.misc),why=new vm.Script(code.slice(code.indexOf('function whyHtml('),code.indexOf('// ctx ='))+';whyHtml').runInContext(vm.createContext({MISC:mod.misc,esc,questionMisconceptions}));assert.deepEqual(withReadableRemediation(unit,before),mod.misc);
  for(const pool of Object.keys(pools))for(const q of mod[pool]){
   const effective=questionMisconceptions(q,mod.misc);if(!ids.some(id=>bearers(effective)[id]?.has(q.id)))continue;questions++;pools[pool]++;if(unit==='c22-s62-u03'&&pool==='source'&&q.contentVersion==='20261116-electricity-source-diagnostics')newlyLinkedElectricitySources.push(q.id);
   const ac=q.answerContract,values=q.choices?(ac.type==='multi-choice'?Array.from({length:1<<q.choices.length},(_,m)=>q.choices.flatMap((_,i)=>m&(1<<i)?[i]:[])):q.choices.map((_,i)=>i)):ac.type==='cloze'?[ac.blanks.map(b=>b.answer),ac.blanks.map(()=> '다른 답')]:['',ac.sample||ac.answer||ac.answers||'설명한 답','다른 답'];
   for(const value of values){const x=gradeDaily(q,value,{misc:before,judge,vocab}),y=gradeDaily(q,value,{misc:mod.misc,judge,vocab});assert.deepEqual(y,x);cases++;const dx=classify(q,before,y.status==='correct',y.detail),dy=classify(q,mod.misc,y.status==='correct',y.detail);assert.deepEqual(dy,dx);if(y.status==='wrong'&&dy.m.some(id=>ids.includes(id))){const html=why(q,false,{...y.detail,m:dy.m});for(const id of dy.m.filter(id=>ids.includes(id))){assert(html.includes(esc(mod.misc.misconceptions[id].label)));assert(html.includes(mod.misc.misconceptions[id].fix));}feedback++;}
   }
  }
  for(const id of ids){const q=mod.items.find(q=>Object.values(questionMisconceptions(q,mod.misc).distractors?.[q.id]||{}).includes(id));assert(q);const key=teacherKeyHtml({u:unit,ch:{title:unit},list:[q],misc:mod.misc});assert(key.includes(esc(mod.misc.misconceptions[id].label)));}
 }
 assert.equal(questions,96);assert.deepEqual(pools,{items:63,source:17,similar:16});assert.deepEqual(newlyLinkedElectricitySources.sort(),['c22-s62-u03-o1-09','c22-s62-u03-o2-10','c22-s62-u03-o4-12']);assert(cases>300);assert(feedback>100);
 const index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');assert(code.includes('student-remediation.js?v='+version));assert(index.includes('&remediation='+version));
});
