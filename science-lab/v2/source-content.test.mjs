import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {SOURCE_CONTENT_VERSION,isStructuredSource,sourceBlocksHtml,sourceChoiceTableHtml,sourceAnswerHint,sourceAnswerText,sourceReviewPromptHtml,needsSourceTeacherReview,wireSourceTeacherReview,sourcePrintReviewHtml} from './source-content.js';
import {sourceCaption,sourceTableHtml,sourceChoiceHtml} from './source-presentation.js';
import {photoFigureHtml} from './photo-figure.js';
import {seasonAnswerHint} from './season-answer-hint.js';
import {gradeDaily,summarize} from './daily-grade.js';
import {lookupRecordQuestion} from './check.js';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fixture=(type='single-choice')=>({id:'source-fixture',sourceContentVersion:SOURCE_CONTENT_VERSION,sourceRef:{type:'original',set:1,no:1,page:1},prompt:'가상 자료를 살펴보세요.',choices:['가','나','다','라','마'],sourceContextBlocks:[{type:'text',text:'공통 자료'},{type:'figure',src:'assets/bank/fixture/context.png',alt:'공통 그림'}],sourceMaterialBlocks:[{type:'figure',src:'assets/bank/fixture/options.png',alt:'보기 그림'}],taxonomy:{track:'교과',level:'기본'},answerContract:{type,answer:0,answers:[0,2],accepted:['가'],earthMotionContract:{kind:type,answer:0,answers:[0,2],accepted:['가']}}});

test('공통 그림과 보기 그림은 원문 순서와 안전한 실제 글자를 보존한다',()=>{
 const q=fixture('short-text'),before=structuredClone(q);
 q.sourceContextBlocks.push({type:'list',items:['<img onerror="1">','ㄱ. 첫째 자료']});
 q.sourceMaterialBlocks.push({type:'table',heads:['<열>'],rows:[['<내용>']]});
 const context=sourceBlocksHtml(q,'context'),material=sourceBlocksHtml(q,'material'),whole=sourceReviewPromptHtml(q);
 assert(context.includes('../assets/bank/fixture/context.png'));assert(material.includes('../assets/bank/fixture/options.png'));
 assert(context.includes('&lt;img onerror=&quot;1&quot;&gt;'));assert(!context.includes('<img onerror'));
 assert(material.includes('&lt;열&gt;'));assert(material.includes('&lt;내용&gt;'));
 assert(whole.indexOf('공통 자료')<whole.indexOf(q.prompt));assert(whole.indexOf(q.prompt)<whole.indexOf('options.png'));
 assert.equal((whole.match(/<img /g)||[]).length,2);
 assert.deepEqual(q.sourceContextBlocks.slice(0,2),before.sourceContextBlocks);assert.deepEqual(q.answerContract,before.answerContract);
 for(const src of ['https://example.org/a.png','assets/bank/../a.png','file:///tmp/a.png'])assert.throws(()=>sourceBlocksHtml({...q,sourceMaterialBlocks:[{type:'figure',src,alt:'그림'}]},'material'));
 assert.throws(()=>sourceBlocksHtml({...q,sourceMaterialBlocks:[{type:'unknown'}]},'material'));
 for(const change of [{sourceContentVersion:'future'},{sourceRef:{type:'similar'}},{sourceRef:{type:'authored-pair'}}]){
  const other={...q,...change};assert.equal(sourceBlocksHtml(other,'context'),null);assert.equal(sourceReviewPromptHtml(other),null);
 }
});

test('표 모양 보기는 다섯 행·열과 선택 위치를 보존하고 학생 인쇄에 답을 표시하지 않는다',()=>{
 const q=fixture();q.sourceChoiceTable={heads:['첫째','둘째'],rows:Array.from({length:5},(_,i)=>['가'+i,'나'+i])};
 const before=structuredClone(q),html=sourceChoiceTableHtml(q,{mode:'daily',value:2});
 assert.equal((html.match(/data-i=/g)||[]).length,5);assert(html.includes('data-i="2" aria-pressed="true"'));
 for(let i=0;i<5;i++)for(const v of q.sourceChoiceTable.rows[i])assert(html.includes(v));
 const student=sourceChoiceTableHtml(q,{print:true}),teacher=sourceChoiceTableHtml(q,{print:true,show:true});
 assert(!student.includes('<button'));assert(!student.includes('class="ans"'));assert.equal((teacher.match(/class="ans"/g)||[]).length,1);
 assert.deepEqual(q,before);
 assert.throws(()=>sourceChoiceTableHtml({...q,choices:['하나']}));assert.throws(()=>sourceChoiceTableHtml({...q,sourceChoiceTable:{heads:['한 열'],rows:[['둘','열']]}}));
 assert.equal(sourceChoiceTableHtml({...q,sourceContentVersion:'future'}),null);
});

test('입력 안내는 답을 읽지 않고 기호 순서만 알려 준다',()=>{
 const q=fixture('short-text');
 q.answerContract={earthMotionContract:{kind:'ordered-word-parts',parts:[{label:'㉠',get accepted(){throw Error('do not read answer');}},{label:'㉡',get accepted(){throw Error('do not read answer');}}]}};
 assert.equal(sourceAnswerHint(q),'㉠ 답 / ㉡ 답처럼 순서대로 써요.');
 assert.equal(sourceAnswerHint({...q,sourceContentVersion:'future'}),'');
});

function element(dataset={}){
 const listeners={},classes=new Set();
 return {dataset,disabled:false,readOnly:false,value:'',hidden:true,textContent:'',classList:{add:(...x)=>x.forEach(v=>classes.add(v)),toggle:(c,on)=>on?classes.add(c):classes.delete(c),contains:c=>classes.has(c)},setAttribute(k,v){this[k]=v;},addEventListener(k,fn){listeners[k]=fn;},fire(k,e={}){listeners[k]?.(e);}};
}
function cardFor(q){
 const buttons=Array.from({length:5},(_,i)=>element({i:String(i)})),why=element(),input=element(),check=element();
 return {dataset:{},buttons,why,input,check,querySelector:s=>s==='.why'?why:s==='input'?input:s==='[data-act=check-short]'?check:null,querySelectorAll:s=>s==='.choice'?buttons:s==='button'?[...buttons,check]:[]};
}
test('교사 확인 선택·쓰기 답은 수업에서 자동 정오 표시 없이 보존한다',()=>{
 for(const type of ['single-choice','multi-choice','short-text']){
  const q=fixture(type);q.answerContract.earthMotionContract={kind:'teacher-review',teacherRequired:true};
  const card=cardFor(q);assert(wireSourceTeacherReview(card,q));
  if(type==='short-text'){card.check.fire('click');assert.equal(card.dataset.done,undefined);card.input.value='내 생각';card.input.fire('keydown',{key:'Enter'});}
  else{card.buttons[1].fire('click');if(type==='multi-choice'){assert.equal(card.dataset.done,undefined);card.buttons[3].fire('click');}}
  assert.equal(card.dataset.done,'review');assert(card.dataset.sourceResponse);assert.equal(card.why.hidden,false);
  assert(card.why.textContent.includes('선생님'));for(const b of card.buttons){assert(!b.classList.contains('wrong'));assert(!b.classList.contains('right'));assert(b.disabled);}
 }
 const old=fixture();old.sourceContentVersion='future';const card=cardFor(old);assert(!wireSourceTeacherReview(card,old));assert.deepEqual(card.dataset,{});
});

const shared={sourcePrintReviewHtml,esc,sourceCaption,CIRC:['①','②','③','④','⑤'],photoFigureHtml,seasonAnswerHint,sourceTableHtml,sourceChoiceHtml,sourceBlocksHtml,sourceChoiceTableHtml,sourceAnswerHint,sourceAnswerText,sourceReviewPromptHtml,needsSourceTeacherReview,isStructuredSource};
function itemRenderer(){
 const source=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
 const snippet=source.slice(source.indexOf('function blanksHtml('),source.indexOf('let FIG ='));
 return new vm.Script(snippet+'\nitemHtml').runInContext(vm.createContext({...shared,FIG:{},MISC:null,writtenPracticeHtml:()=>'<section>쓰기</section>'}));
}
function dailyRenderers(){
 const source=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8');
 const snippet=source.slice(source.indexOf('function fieldsHtml('),source.indexOf('function ring('));
 return new vm.Script(snippet+'\n({fieldsHtml,formatKey})').runInContext(vm.createContext(shared));
}
test('실제 수업·Daily 입력 렌더러가 두 그림과 보기표를 빠뜨리거나 중복하지 않는다',()=>{
 const render=itemRenderer(),daily=dailyRenderers(),q=fixture();
 q.givens={설명:'이전 fallback 자료'};q.figure='assets/bank/fixture/context.png';
 q.sourceChoiceTable={heads:['위','아래'],rows:Array.from({length:5},(_,i)=>[i,i+1])};
 const html=render(q);assert.equal((html.match(/<img /g)||[]).length,2);assert.equal((html.match(/data-i=/g)||[]).length,5);
 assert(!html.includes('이전 fallback 자료'));assert.equal((html.match(/class="why"/g)||[]).length,1);
 assert(daily.fieldsHtml(q,1,{}).includes('data-i="1" aria-pressed="true"'));
 const old={...q,sourceContentVersion:'future'};assert(render(old).includes('이전 fallback 자료'));
});

test('실제 Daily 채점 루프는 보류된 선택형을 점수·진단에서 빼고 교사 목록으로 보낸다',()=>{
 const a=fixture(),b={...fixture('multi-choice'),id:'multi-fixture'},c={...fixture(),id:'auto-fixture'};
 for(const q of [a,b])q.answerContract={...q.answerContract,earthMotionContract:{kind:'teacher-review',teacherRequired:true}};
 const list=[a,b,c],S={answers:{[a.id]:0,[b.id]:[0,2],[c.id]:0},first:{}},queued=[];let records=0,rows;
 const source=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8');
 const start=source.indexOf('  function grade({restoring=false}={}) {'),end=source.indexOf("  $app.querySelector('.dt-grade')",start);
 const formatAnswer=(q,v)=>Array.isArray(v)?v.join(','):String(v);
 const context=vm.createContext({active:true,paperLocked:false,list,S,previous:()=>false,gradeDaily,misc:{},ctx:{record(){records++;return {m:[]};},classify:()=>[]},vocab:new Set(),needsSourceTeacherReview,dailyReviewSlide:id=>'daily-'+id,u:'fixture-unit',deckPut:(key,value)=>queued.push({key,value}),formatAnswer,save(){},paintDots(){},report:r=>{rows=r;}});
 const grade=new vm.Script(source.slice(start,end)+'\ngrade').runInContext(context);grade();
 assert.equal(rows[0].status,'review');assert.equal(rows[1].status,'review');assert.equal(rows[2].status,'correct');
 assert.equal(records,1);assert.equal(queued.length,2);assert.equal(summarize(rows).confirmed,1);
 assert.equal(S.first[a.id],undefined);assert.equal(S.first[b.id],undefined);
 assert.deepEqual(JSON.parse(JSON.stringify(queued[0].value.question.sourceContextBlocks)),a.sourceContextBlocks);
 grade({restoring:true});assert.equal(records,1);assert.equal(queued.length,2);
});

test('교사 확인은 기록한 원문의 공통 그림·보기와 인쇄 답 참고를 함께 읽는다',()=>{
 const q=fixture('multi-choice');q.sourceRef.reviewOnly=true;q.reviewSummary='조건을 함께 확인해요.';
 q.printedAnswerContract={type:'multi-choice',answers:[0,2]};
 const r={k:'daily',item:q.id,slide:'daily-'+q.id,question:structuredClone(q),text:'0,2'};
 const found=lookupRecordQuestion(r,{assessment:true},[q]);
 assert.equal(found.a,q.reviewSummary);assert(found.sourceHtml.includes('context.png'));assert(found.sourceHtml.includes('options.png'));
 assert(found.printedA.includes('①'));assert(found.printedA.includes('③'));
 assert.equal(sourceAnswerText(q),q.reviewSummary);assert(sourceAnswerText(q,{printed:true}).includes('③'));
});

test('교사 확인 인쇄는 확정 답 표시와 인쇄된 답 참고를 구별한다',()=>{
 const render=itemRenderer();
 for(const type of ['single-choice','multi-choice','short-text','written-explanation']){
  const q=fixture(type);if(type==='written-explanation')q.answerContract={...q.answerContract,sample:'예시',rubric:{required:['확인할 내용']}};q.sourceRef.reviewOnly=true;q.reviewSummary='관찰 위치를 함께 확인해요.';
  q.printedAnswerContract=type==='single-choice'?{type,answer:0}:type==='multi-choice'?{type,answers:[0,2]}:type==='written-explanation'?{type,sample:'인쇄 답'}:{type,answer:'인쇄 답'};
  q.answerContract.earthMotionContract={kind:'teacher-review',teacherRequired:true};
  if(type==='single-choice')q.sourceChoiceTable={heads:['특징'],rows:q.choices.map(c=>[c])};
  const student=render(q,{print:true}),teacher=render(q,{print:true,show:true});
  assert(!student.includes('인쇄된 답 참고'));assert(!student.includes('관찰 위치를 함께 확인해요.'));
  assert(!teacher.includes('class="ans"'));assert(teacher.includes('인쇄된 답 참고'));assert(teacher.includes('자동 정오 판정 보류'));
  assert(teacher.includes(q.reviewSummary));
 }
 assert.equal(sourcePrintReviewHtml({...fixture(),sourceContentVersion:'future'}),null);
});

test('실제 수업 입력 연결이 교사 확인 답을 정오 콜백과 진단 기록으로 보내지 않는다',()=>{
 const source=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
 const snippet=source.slice(source.indexOf('function wireItem('),source.indexOf('// ── 화면 뼈대'));
 let records=0,callbacks=0;
 const wire=new vm.Script(snippet+'\nwireItem').runInContext(vm.createContext({wireSourceTeacherReview,record:()=>records++,du:x=>x,MISC:{}}));
 for(const type of ['single-choice','multi-choice','short-text']){
  const q=fixture(type);q.answerContract.earthMotionContract={kind:'teacher-review',teacherRequired:true};
  const card=cardFor(q);wire(card,q,()=>callbacks++,{u:'fixture-unit',stage:'bank'});
  if(type==='short-text'){card.input.value='확인할 답';card.check.fire('click');}
  else{card.buttons[1].fire('click');if(type==='multi-choice')card.buttons[2].fire('click');}
  assert.equal(card.dataset.done,'review');assert.equal(records,0);assert.equal(callbacks,0);
 }
});
