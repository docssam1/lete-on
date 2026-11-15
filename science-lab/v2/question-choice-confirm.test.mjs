import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink} from './think-merge.js';
import {gradeDaily} from './daily-grade.js';
import {needsSourceTeacherReview} from './source-content.js';
import {classify} from './progress.js';
import {revisedTextbookUnits} from './revised-textbook.js';
const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink}));
const wireSource=code.slice(code.indexOf('function wireItem('),code.indexOf('// ── 화면 뼈대'));
function node(dataset={}){const flags=new Set();return{dataset,disabled:false,hidden:true,textContent:'',innerHTML:'',events:{},attributes:{},classList:{add:(...s)=>s.forEach(x=>flags.add(x)),toggle:(s,on)=>on?flags.add(s):flags.delete(s),contains:s=>flags.has(s)},setAttribute(k,v){this.attributes[k]=String(v);},addEventListener(k,fn){this.events[k]=fn;},click(){if(!this.disabled)this.events.click?.();}};}
function fixture(q,misc){
 const choices=q.choices.map((_,i)=>node({i:String(i)})),check=node(),status=node(),why=node(),records=[],done=[],feedback=[];check.disabled=true;
 const card={dataset:{},querySelector:s=>({'.why':why,'[data-act=check-multi]':check,'[data-choice-status]':status}[s]||null),querySelectorAll:s=>s==='.choice'?choices:[]};
 const context=vm.createContext({MISC:misc,wireSourceTeacherReview:()=>false,du:x=>x,record:(u,it,stage,ok,detail,m)=>records.push({u,id:it.id,stage,ok,detail,m:classify(it,m,ok,detail)}),whyHtml:(it,ok,detail)=>{feedback.push({id:it.id,ok,detail});return ok?'맞았어요':'다시 살펴봐요';}});
 new vm.Script(wireSource+';wireItem').runInContext(context)(card,q,(ok,detail)=>done.push({ok,detail}),{u:'unit',stage:'sub'});
 return{choices,check,status,why,records,done,feedback,card};
}
let all;async function questions(){return all||=(async()=>{const rows=[];for(const u of revisedTextbookUnits){const m=await loaders[u]();for(const kind of['items','similar','source'])for(const q of m[kind]||[])if(q.answerContract.type==='multi-choice'&&!needsSourceTeacherReview(q))rows.push({u,kind,q,misc:m.misc});}return rows;})();}

test('all current multi-choice questions wait for confirmation and match Daily grading and diagnosis for every selection set',async()=>{
 let subsets=0,graded=0;const rows=await questions();assert(rows.length>0);
 for(const{q,misc}of rows){assert(q.choices.length<=6);const before=JSON.stringify(q);
  for(let mask=0;mask<1<<q.choices.length;mask++){
   const f=fixture(q,misc),picked=q.choices.flatMap((_,i)=>mask&(1<<i)?[i]:[]);subsets++;
   for(const i of picked){f.choices[i].click();assert.equal(f.choices[i].attributes['aria-pressed'],'true');}
   assert.equal(f.records.length,0,q.id+' must not grade on selection');assert(f.why.hidden);assert.equal(f.feedback.length,0);
   assert(f.choices.every(x=>!x.classList.contains('right')&&!x.classList.contains('wrong')));
   if(!picked.length){assert(f.check.disabled);f.check.events.click();assert.equal(f.records.length,0);continue;}
   assert(!f.check.disabled);f.check.click();graded++;const expected=gradeDaily(q,picked,{misc});
   assert.equal(f.done.length,1);assert.equal(f.records.length,1);assert.equal(f.feedback.length,1);
   assert.equal(f.done[0].ok,expected.status==='correct',q.id+' '+picked);assert.deepEqual(f.records[0].m,classify(q,misc,expected.status==='correct',expected.detail));
   assert.deepEqual(Array.from(f.done[0].detail.picked),picked.filter(i=>!q.answerContract.answers.includes(i)));assert(!f.why.hidden);assert(f.check.disabled);assert(f.choices.every(x=>x.disabled));
   for(const choice of f.choices)choice.events.click();f.check.events.click();assert.equal(f.records.length,1,'completed question records once');
  }
  assert.equal(JSON.stringify(q),before);
 }
 assert(subsets>graded);assert.equal(subsets-graded,rows.length);
});

test('a student can replace an initially wrong full selection before confirming without recording or revealing an answer',async()=>{
 for(const{q,misc}of await questions()){
  const key=q.answerContract.answers,wrong=q.choices.findIndex((_,i)=>!key.includes(i));if(wrong<0)continue;
  const f=fixture(q,misc);f.choices[wrong].click();for(const i of key.slice(1))f.choices[i].click();assert.equal(f.records.length,0);assert(!f.card.dataset.done);
  f.choices[wrong].click();assert.equal(f.choices[wrong].attributes['aria-pressed'],'false');f.choices[key[0]].click();assert.equal(f.records.length,0);
  f.check.click();assert.equal(f.records.length,1);assert(f.done[0].ok);assert.equal(f.records[0].stage,'sub');
 }
 const{q,misc}=(await questions())[0],f=fixture(q,misc);f.choices[0].click();f.choices[0].click();assert(f.check.disabled);assert.equal(f.status.textContent,'아직 고른 답이 없어요.');f.check.events.click();assert.equal(f.records.length,0);
});

test('real multi-choice rendering exposes native controls and a live selection status only on screen, with source choices intact',async()=>{
 const prefix=code.slice(code.indexOf('function blanksHtml('),code.indexOf('let FIG ='));
 const q={id:'confirmation-fixture',prompt:'사진에서 확인한 특징을 모두 고르세요.',choices:['둥근 모양','길쭉한 모양','붉은색'],answerContract:{type:'multi-choice',answers:[0,2]},taxonomy:{track:'탐구',level:'기본'}};
 const context=vm.createContext({esc:s=>String(s??''),CIRC:['①','②','③'],MISC:null,FIG:{},sourceCaption:()=>'',photoFigureHtml:()=>'',sourceBlocksHtml:()=>null,needsSourceTeacherReview,sourceChoiceHtml:(_q,c)=>c,sourcePrintReviewHtml:()=>'',sourceFigureImageAttrs:()=>'',sourceTableHtml:()=>'',sourcePartHtml:()=>''});
 const render=new vm.Script(prefix+';itemHtml').runInContext(context),screen=render(q),student=render(q,{print:true}),teacher=render(q,{print:true,show:true});
 assert(screen.includes('2개를 고른 뒤 확인을 눌러요.'));assert(screen.includes('role="group" aria-label="답 고르기"'));assert(screen.includes('role="status" aria-live="polite"'));assert(screen.includes('data-act="check-multi" disabled>선택한 답 확인'));
 assert.equal((screen.match(/aria-pressed="false"/g)||[]).length,3);
 for(const html of[student,teacher]){assert(!html.includes('check-multi'));assert(!html.includes('data-choice-status'));assert(!html.includes('aria-pressed'));for(const c of q.choices)assert(html.includes(c));}
 assert.equal((teacher.match(/class="ans"/g)||[]).length,2);
 let held=0;for(const u of revisedTextbookUnits){const m=await loaders[u]();for(const q of m.source||[])if(q.answerContract.type==='multi-choice'&&needsSourceTeacherReview(q)){held++;const html=render(q);assert(!html.includes('check-multi'));assert(!html.includes('data-choice-status'));assert(html.includes('개를 고르세요.'));}}assert.equal(held,5);
 assert(fs.readFileSync(new URL('./index.html',import.meta.url),'utf8').includes('&question-choice=20261115-question-multi-confirm'));
});
