import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{reviewLabel}from'../bank/review-label.mjs';import{withThink}from'./think-merge.js';import{teacherKeyHtml}from'./daily.js';import{gradeDaily,vocabOf}from'./daily-grade.js';import{questionMisconceptions}from'./question-revision.js';
const units=['c22-s42-u01','c22-s42-u02','c22-s42-u03','c22-s42-u04','s41-u04'],shorts=['c22s42u01','c22s42u02','c22s42u03','c22s42u04','s41u04'];
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8'),json=p=>JSON.parse(read(p));
const code=read('./v2.js'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

test('all five real bank builders and the biology supplement reproduce the reviewed labels without writing question files',async()=>{
 for(const[unit,i]of units.map((u,i)=>[u,i])){
  const source=read('../../scripts/bank-science-'+shorts[i]+'.mjs'),start=source.indexOf('const newMis='),end=source.indexOf(';',start)+1;assert(start>=0&&end>start);assert(source.includes("../science-lab/bank/review-label.mjs"));
  const context={reviewLabel};
  if(unit==='s41-u04'){
   const rows=/const typeRows=(\[[\s\S]*?\n\]);/.exec(source),fixes=/const fixes=(\[[\s\S]*?\n\]);/.exec(source);assert(rows&&fixes);context.typeRows=vm.runInNewContext('('+rows[1]+')');context.fixes=vm.runInNewContext('('+fixes[1]+')');context.sup=json('../bank/work/s41u04/supplement.json');
  }else context.types=json('../bank/work/'+shorts[i]+'/types-reviewed.json').types;
  const generated=vm.runInNewContext(source.slice(start,end)+(unit==='s41-u04'?'Object.assign(newMis,sup.misconceptions);':'')+'newMis;',context),misc=await import('../data/units/'+unit+'.misc.js');
  assert.deepEqual(Object.keys(generated),Object.keys(misc.misconceptions));for(const[id,m]of Object.entries(generated))assert.equal(m.label,misc.misconceptions[id].label,unit+' '+id);
 }
 assert.equal(reviewLabel('관찰과 추론의 구별'),'관찰과 추론의 구별을 다시 살펴봐요');assert.equal(reviewLabel('미생물의 생활 사례'),'미생물의 생활 사례를 다시 살펴봐요');assert.equal(reviewLabel('기체의 성질'),'기체의 성질을 다시 살펴봐요');assert.equal(reviewLabel('온도 비교'),'온도 비교를 다시 살펴봐요');
});

test('current online correction and Daily teacher keys show the same grammatical labels while answer contracts and diagnosis mappings stay intact',async()=>{
 const whyCode=code.slice(code.indexOf('function whyHtml('),code.indexOf('// ctx = { u, stage }')),anchors=[['c22-s42-u01','M01','달의 모양과 표면을 다시 살펴봐요'],['s41-u04','M14','관찰과 추론의 구별을 다시 살펴봐요']];let labelsShown=0;
 for(const unit of units){assert(code.includes(unit+'.misc.js?v=20261115-review-label-particles'));const mod=await loaders[unit](),pool=[...mod.items,...(mod.similar||[]),...(mod.source||[])],before=JSON.stringify(mod.misc),misc=mod.misc;
  const why=new vm.Script(whyCode+';whyHtml').runInContext(vm.createContext({esc,MISC:misc,questionMisconceptions}));
  for(const[id,m]of Object.entries(misc.misconceptions)){
   const row=pool.map(q=>[q.id,questionMisconceptions(q,misc)?.distractors?.[q.id]||{}]).find(([,choices])=>Object.values(choices).includes(id));
   if(!row)continue;const q=pool.find(q=>q.id===row[0]),picked=Number(Object.keys(row[1]).find(k=>row[1][k]===id));
   assert(why(q,false,{picked}).includes(esc(m.label)));const html=teacherKeyHtml({u:unit,ch:{title:unit},list:[q],misc});if(!q.diagnosticOverride)assert(html.includes(esc(m.label)));labelsShown++;
   const vocabulary=vocabOf(pool,misc),r=gradeDaily(q,picked,{misc:questionMisconceptions(q,misc),vocab:vocabulary});assert(['wrong','review'].includes(r.status));
  }
  assert.equal(JSON.stringify(misc),before);
 }
 for(const[u,id,label]of anchors){const mod=await loaders[u]();assert.equal(mod.misc.misconceptions[id].label,label);}
 assert(labelsShown>=60);
});
