import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {sourceExamPaperHtml,sourceExamPrintLinks,sourcePaperMode} from './source-exam-paper.js';
import * as presentation from './source-presentation.js';
import * as content from './source-content.js';
import {assessmentPool,assessmentRelated} from './assessment-data.js';
import {photoFigureHtml} from './photo-figure.js';
import {seasonAnswerHint} from './season-answer-hint.js';

const src=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fixture=(no=3)=>({id:'fixture-original-'+no,sourceContentVersion:content.SOURCE_CONTENT_VERSION,sourceRef:{type:'original',set:2,no,originalNo:no,page:7,label:'가상 자료',edition:'가상 판본'},prompt:'자료를 읽고 골라요.',choices:['가상 보기 A','가상 보기 B'],sourceContextBlocks:[{type:'text',text:'앞에 읽는 자료'}],sourceMaterialBlocks:[{type:'figure',src:'assets/bank/fixture/material.png',alt:'가상 자료 그림'}],answerContract:{type:'single-choice',answer:1},explanation:'가상 해설 문장',taxonomy:{track:'교과',level:'기본'}});
function context(extra={}){
 const ctx=vm.createContext({esc,CIRC:['①','②','③','④','⑤'],FIG:{},MISC:null,...presentation,...content,photoFigureHtml,seasonAnswerHint,writtenPracticeHtml:()=>'',...extra});
 const start=src.indexOf('function blanksHtml('),end=src.indexOf('let FIG =',start);
 ctx.itemHtml=new vm.Script(src.slice(start,end)+'\nitemHtml').runInContext(ctx);
 return ctx;
}
function render(list,mode='student',bank={sourceExcerptOnly:true,sourceScopeNote:'전체 원문 준비 중'}){
 const ctx=context();
 return sourceExamPaperHtml({unit:'fixture-unit',set:2,bank,title:'가상 단원',list,mode,renderItem:ctx.itemHtml});
}

test('실제 문항 렌더러로 그림·원래 번호·서술 공간을 보존하며 학생 문제지에 정답을 싣지 않는다',()=>{
 const choice=fixture(),written={...fixture(9),prompt:'까닭을 써요.',answerContract:{type:'written-explanation',sample:'가상 예시 답',rubric:{required:['가상 기준']}},choices:undefined};
 const input=[choice,written],before=structuredClone(input),student=render(input),teacher=render(input,'teacher');
 assert.equal((student.match(/data-paper-item=/g)||[]).length,2);
 assert(student.includes('class="no">3.</span>'));assert(student.includes('class="no">9.</span>'));
 assert(student.includes('../assets/bank/fixture/material.png'));assert(student.includes('앞에 읽는 자료'));
 assert.equal((student.match(/class="ans-line"/g)||[]).length,3);
 for(const text of ['가상 해설 문장','가상 예시 답','가상 기준','class="ans"','<input','<select','data-i='])assert(!student.includes(text),text);
 for(const text of ['가상 해설 문장','가상 예시 답','가상 기준','class="ans"'])assert(teacher.includes(text),text);
 assert(student.includes('전체 원문 준비 중'));assert(student.includes('관련 문제를 골라'));
 assert.deepEqual(input,before);
});

test('표 보기·밑줄·교사 확인 답을 공용 원문 판정과 같은 규칙으로 출력한다',()=>{
 const q=fixture();
 q.sourceChoiceTable={heads:['가상 머리'],rows:[['가상 표 A'],['가상 표 B']]};
 q.answerContract.sourceResponseContract={teacherRequired:true,kind:'teacher-review'};
 const student=render([q]),teacher=render([q],'teacher');
 assert(student.includes('source-choice-table'));assert(student.includes('가상 표 A'));
 assert(!student.includes('class="ans"'));assert(!teacher.includes('class="ans"'));
 assert(teacher.includes('선생님과 확인해요.'));assert(!student.includes('가상 해설 문장'));
 const underline={...fixture(),choiceUnderlines:{0:['보기']}};
 assert(render([underline]).includes('<u>보기</u>'));
});

test('문항 세트·원문 유형·번호 누락과 중복을 거부하고 안내 문자열을 이스케이프한다',()=>{
 const q=fixture(),args={unit:'fixture-unit',set:2,list:[q],renderItem:()=>'<p>가상 본문</p>'};
 for(const list of [[],[q,q],[{...q,sourceRef:{...q.sourceRef,set:1}}],[{...q,sourceRef:{type:'similar',set:2,no:3}}],[{...q,sourceRef:{...q.sourceRef,no:null,originalNo:null}}]])assert.throws(()=>sourceExamPaperHtml({...args,list}));
 for(const unit of ['../other','<script>','u/a'])assert.throws(()=>sourceExamPrintLinks(unit,2));
 for(const set of [0,-1,NaN,'2',1.2])assert.throws(()=>sourceExamPrintLinks('fixture-unit',set));
 assert.throws(()=>sourceExamPaperHtml({...args,mode:'future'}));
 const html=sourceExamPaperHtml({...args,title:'<제목>',bank:{label:'<원문>',groups:{2:'<묶음>'},sourceScopeNote:'<script>bad</script>'}});
 assert(!html.includes('<script>'));assert(html.includes('&lt;제목&gt;'));assert(html.includes('&lt;script&gt;bad&lt;/script&gt;'));
 assert.equal(sourcePaperMode('paper'),'student');assert.equal(sourcePaperMode('paper-teacher'),'teacher');
 for(const mode of [undefined,'teacher','quick','student'])assert.equal(sourcePaperMode(mode),null);
});

test('이전 형식의 자동 판정 보류 원문도 확정 답 대신 검토 요지와 인쇄된 답 참고를 구분한다',()=>{
 const q=fixture();delete q.sourceContentVersion;
 q.sourceRef.reviewOnly=true;q.reviewSummary='가상 검토 요지';
 q.answerContract={type:'written-explanation',sample:'보류용 설명',rubric:{required:['가상 기준']}};
 q.printedAnswerContract={type:'single-choice',answer:1};
 const before=structuredClone(q),student=render([q]),teacher=render([q],'teacher');
 for(const value of ['가상 검토 요지','보류용 설명','인쇄된 답 참고','가상 해설 문장'])assert(!student.includes(value),value);
 assert(teacher.includes('가상 검토 요지'));assert(teacher.includes('인쇄된 답 참고:'));
 assert(teacher.includes('② 가상 보기 B'));assert(teacher.includes('자동 정오 판정 보류'));
 assert(!teacher.includes('class="ans"'));assert(!teacher.includes('예시 답: 보류용 설명'));
 assert.deepEqual(q,before);
});

async function exam(mode,bank={},mod={}){
 const state={daily:0,key:0,authored:0,judge:0,scroll:0},app={innerHTML:''},list=[fixture()];
 const ctx=context({$app:app,BANK:{'fixture-unit':bank},assessmentPool,assessmentRelated,sourceExamPaperHtml,sourceExamPrintLinks,sourcePaperMode,scrollTo:()=>state.scroll++,releasePage:()=>{},loadJudge:async()=>{state.judge++;return{};},du:x=>x,wireItem:()=>{}});
 const start=src.indexOf('async function pageExam('),end=src.indexOf('\n// 문제은행 전체 차례',start);
 const dynamic=async(spec)=>{
  const values=spec.startsWith('./daily.js')?{mountDaily:args=>{state.daily++;state.args=args;return()=>{};},teacherKeyHtml:()=>{state.key++;return'기존 교사 답안';}}:{assessmentPaperHtml:()=>{state.authored++;return'기존 창작 문제지';}};
  const module=new vm.SyntheticModule(Object.keys(values),function(){for(const[k,v]of Object.entries(values))this.setExport(k,v);},{context:ctx});
  await module.link(()=>{});await module.evaluate();return module;
 };
 const run=new vm.Script(src.slice(start,end)+'\npageExam',{importModuleDynamically:dynamic}).runInContext(ctx);
 await run('fixture-unit',{source:list,items:[],similar:[],...mod},{title:'가상 단원'},2,mode);
 return{...state,html:app.innerHTML};
}
test('실제 원문 인쇄 라우트는 풀이·채점·저장을 시작하지 않고 문제지만 연다',async()=>{
 for(const mode of ['paper','paper-teacher']){
  const r=await exam(mode);
  assert(r.html.includes('source-exam-paper'));assert.equal(r.daily,0);assert.equal(r.key,0);assert.equal(r.judge,0);assert.equal(r.scroll,1);
  assert.equal(r.html.includes('가상 해설 문장'),mode==='paper-teacher');
 }
 const normal=await exam();assert.equal(normal.daily,1);
 assert(normal.args.tabs.includes('#/fixture-unit/exam/2/paper"'));assert(normal.args.tabs.includes('#/fixture-unit/exam/2/paper-teacher"'));
 const teacher=await exam('teacher');assert.equal(teacher.key,1);assert.equal(teacher.html,'기존 교사 답안');
 const authored=await exam('paper',{authored:1},{source:[],items:[{...fixture(),status:'authored',sourceRef:{type:'authored-assessment',set:2,no:3}}]});
 assert.equal(authored.authored,1);assert.equal(authored.html,'기존 창작 문제지');
 let legacy=0;const specific=await exam('paper',{assessment51Print:true},{bankPaper:()=>{legacy++;return'기존 전용 문제지';}});
 assert.equal(legacy,1);assert.equal(specific.html,'기존 전용 문제지');
});
