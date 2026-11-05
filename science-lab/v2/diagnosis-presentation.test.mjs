import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {analyze,remedyItems} from './progress.js';
import {pickedChoiceTexts,questionAtVersion} from './question-revision.js';
import {revisedTextbookUnits} from './revised-textbook.js';
import {careerCurrentItems} from './career-question-language.js';
import {items as careerItems} from '../data/units/c22-s62-u04.js';

const source=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
const body=source.slice(source.indexOf('function pageDiagnose('),source.indexOf('// 소단원 = 교육과정 내용 요소.'));
const items=[1,2].map(n=>({id:'fixture-'+n,prompt:'사진에서 관찰한 특징을 고르세요.',choices:['관찰한 특징','아직 관찰하지 않은 특징'],answerContract:{type:'choice'},taxonomy:{element:'E1',type:'T1'}}));
const misc={misconceptions:{m:{label:'관찰한 특징',fix:'사진에 보이는 특징을 살펴보아요.'}},distractors:Object.fromEntries(items.map(q=>[q.id,{1:'m'}])),remedy:{m:{step:3}}};
const event=(id,ok,extra={})=>({id,ok,m:ok?[]:['m'],stage:'deck',element:'E1',type:'T1',at:1,picked:ok?0:1,...extra});
function render(events,{unit='c22-s62-u04',mode='student',pool=items,remedial=true}={}){
 let html='',writes=0,reads=0;
 const before=JSON.stringify(events),saved=globalThis.localStorage;
 globalThis.localStorage={getItem:key=>{reads++;assert.equal(key,'sciLab.log');return JSON.stringify({[unit]:events});},setItem:()=>{writes++;throw Error('Render must not save');}};
 const context=vm.createContext({
  pickedChoiceTexts,questionAtVersion,revisedTextbookUnits,analyze,
  remedyItems:remedial?remedyItems:()=>[],MISC:misc,
  BOOKX:{taxonomy:{elements:[{id:'E1',name:'관찰하기'}],types:[{id:'T1',name:'특징 살펴보기'}]}},
  $app:{querySelectorAll:()=>[],querySelector:()=>null},du:x=>x,
  frame:(_u,_l,_n,value)=>{html=value;},
  esc:s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
  CIRC:['①','②','③','④','⑤'],itemHtml:q=>`<article data-question="${q.id}"></article>`,wireItem(){},
 });
 try{
  const page=new vm.Script(body+'\npageDiagnose').runInContext(context);
  page(unit,{title:'사진 자료 살펴보기'},pool,mode);
  assert.equal(writes,0);assert.equal(JSON.stringify(events),before);assert(reads>0);
  return html;
 }finally{if(saved===undefined)delete globalThis.localStorage;else globalThis.localStorage=saved;}
}

test('다른 두 문제에서 반복된 오답과 한 문제의 오답을 학생에게 구별해 설명한다',()=>{
 const suspected=render([event(items[0].id,false)]);
 assert(suspected.includes('한 번씩 헷갈린 내용'));assert(suspected.includes('수업 확인 문제'));
 assert(!suspected.includes('>의심<'));assert(!suspected.includes('>확정<'));
 const confirmed=render([event(items[0].id,false),event(items[1].id,false,{at:2})]);
 assert(confirmed.includes('서로 다른 문제에서 두 번 이상'));assert(confirmed.includes('다시 살펴봐요'));
 const repeat=render([event(items[0].id,false),event(items[0].id,false,{at:2})]);
 assert(!repeat.includes('서로 다른 문제에서 두 번 이상'));
});
test('기록 없음·모두 정답·분류하지 못한 오답·답 열람을 이해 완료로 단정하지 않는다',()=>{
 assert(render([]).includes('아직 푼 문제가 없어요'));
 assert(render([event(items[0].id,true)]).includes('지금까지 기록된 문제는 모두 맞혔어요'));
 for(const kind of ['slip','reveal']){
  const html=render([event(items[0].id,false,{m:[],kind})]);
  assert(html.includes('이 기록만으로는 헷갈린 까닭을 정하기 어려워요'));
  assert(!html.includes('오개념 없이 잘 이해'));assert(!html.includes('단순 실수'));
 }
});
test('다시 맞힌 기록은 그대로 표시하고 복습 문항이 없으면 빈 문제 묶음을 만들지 않는다',()=>{
 const resolved=render([event(items[0].id,false),event(items[0].id,true,{at:2}),event(items[1].id,true,{at:3})]);
 assert(resolved.includes('헷갈렸던 내용을 다시 맞혔어요'));assert(resolved.includes('다시 맞혔어요'));
 assert(!resolved.includes('class="rx"'));
 const none=render([event(items[0].id,false)],{remedial:false});
 assert(none.includes('사고력 수업 다시 보기'));assert(!none.includes('문제 0개'));assert(!none.includes('class="rx-d"'));
});
test('현행32단원 복습은 학생/교사 수업으로 나누고 예전 단원의 지정 단계는 보존한다',()=>{
 for(const unit of revisedTextbookUnits){
  const events=[event(items[0].id,false)];
  const student=render(events,{unit});
  assert(student.includes(`href="#/${unit}/lab-class/self/1"`));
  assert(!student.includes(`href="#/${unit}/3"`));
  const teacher=render(events,{unit,mode:'teacher'});
  assert(teacher.includes(`href="#/${unit}/lab-class/teach/1"`));
  assert(!teacher.includes(`/lab-class/self/`));assert(teacher.includes('>의심<'));
 }
 const legacy=render([event(items[0].id,false)],{unit:'s42-u02'});
 assert(legacy.includes('href="#/s42-u02/3"'));assert(legacy.includes('개념 화면 다시 보기'));
});
test('진단 근거의 질문과 선택지는 기록 당시 원고로 읽고 없는 버전을 현재 질문으로 대체하지 않는다',()=>{
 const q=careerCurrentItems(careerItems).find(q=>q.previousVersions?.some(p=>p.prompt!==q.prompt)&&q.choices);
 assert(q,'실제 질문 원고가 바뀐 진로 문항');
 const old=q.previousVersions.find(p=>p.prompt!==q.prompt);
 const oldHtml=render([event(q.id,false,{presentationVersion:old.version})],{pool:[q],remedial:false});
 const excerpt=old.prompt.length>40?old.prompt.slice(0,40)+'…':old.prompt;
 assert(oldHtml.includes(excerpt.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))));
 const missing=render([event(q.id,false,{presentationVersion:999})],{pool:[q],remedial:false});
 assert(missing.includes('이전 문항의 내용을 확인할 수 없어요.'));
 assert(!missing.includes(q.prompt.slice(0,40)));
 const removed=render([event('removed-question',false)],{remedial:false});
 assert(removed.includes('이전 문항의 내용을 확인할 수 없어요.'));
});
