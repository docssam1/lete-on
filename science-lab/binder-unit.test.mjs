import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {UNITS,ORDERED,domainOf,levelOf} from './data/curriculum.js';
import {binderUnitIndexHtml,binderUnitMobileIndexHtml,binderUnitNotesHtml} from './binder-unit.js';

const source=fs.readFileSync(new URL('./app.js',import.meta.url),'utf8');
const section=(from,to)=>source.slice(source.indexOf(from),source.indexOf(to));
const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function node(dataset={},classes=[]){
 const flags=new Set(classes),listeners=new Map();
 return {dataset,listeners,scrolls:[],focuses:0,classList:{contains:cls=>flags.has(cls),toggle:(cls,on)=>on?flags.add(cls):flags.delete(cls)},
  addEventListener:(type,handler)=>listeners.set(type,handler),removeEventListener:(type,handler)=>{if(listeners.get(type)===handler)listeners.delete(type);},
  scrollIntoView(options){this.scrolls.push(options);},focus(){this.focuses++;}};
}
function render(unit,{reduced=false}={}){
 const targets=new Map(['concept','video','activity','discuss','quiz'].map(id=>[id,node()]));
 let mounted3D=0,mountedQuiz=0,observer,writes=0;
 const app={html:'',links:[],set innerHTML(value){this.html=value;this.links=[...value.matchAll(/<a\b([^>]*\bdata-to="([^"]+)"[^>]*)>/g)].map(match=>node({to:match[2]},match[1].includes('binder-unit-skip')?['binder-unit-skip']:[]));},get innerHTML(){return this.html;},querySelectorAll(selector){return this.links.filter(link=>selector==='.binder-unit-skip'?link.classList.contains('binder-unit-skip'):!link.classList.contains('binder-unit-skip'));}};
 const state={quizBest:1,report:{sentinel:'keep report'},videoDone:false},before=JSON.stringify(state);
 const context=vm.createContext({
  $app:app,UNITS,ORDERED,domainOf,levelOf,esc,binderUnitIndexHtml,binderUnitMobileIndexHtml,binderUnitNotesHtml,LETTERS:['A','B','C','D'],unitOff:null,
  store:{unit:()=>state,patch:()=>{writes++;}},
  document:{getElementById:id=>{assert(targets.has(id),id);return targets.get(id);}},
  matchMedia:()=>({matches:reduced}),
  IntersectionObserver:class{constructor(callback){this.callback=callback;this.observed=[];this.disconnected=0;observer=this;}observe(element){this.observed.push(element);}disconnect(){this.disconnected++;}},
  mount3D:()=>{mounted3D++;},mountQuiz:()=>{mountedQuiz++;},
 });
 const actual=section('function topbar(','// 홈은 서류철 차례')+section('function renderUnit(u)','async function mount3D(');
 const page=new vm.Script(actual+'\nrenderUnit').runInContext(context);page(unit);
 assert.equal(writes,0);assert.equal(JSON.stringify(state),before);
 return {app,context,targets,observer,mounted3D,mountedQuiz};
}
test('실험 차례 두 형태는15개 원래 경로와 현재 자료 표시를 유지한다',()=>{
 for(const unit of ORDERED){
  for(const html of [binderUnitIndexHtml(unit),binderUnitMobileIndexHtml(unit)]){
   assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
   assert(html.includes(`href="#/u/${unit.id}" aria-current="page"`));
   for(const linked of ORDERED)assert(html.includes(`href="#/u/${linked.id}"`));
   assert(html.includes('href="#/"'));
  }
 }
});
test('정리 날개는 원래 개념 표제·실험 조건·질문을 쓰며 정답과 예시 답을 미리 노출하지 않는다',()=>{
 for(const unit of ORDERED){
  const html=binderUnitNotesHtml(unit);
  for(const [title]of unit.concept.points.slice(0,3))assert(html.includes(esc(title)));
  for(const values of Object.values(unit.activity.vars))for(const value of values)assert(html.includes(esc(value)));
  assert(html.includes(esc(unit.discuss[0].q)));assert(!html.includes(esc(unit.discuss[0].hint)));
  assert(!html.includes('undefined'));assert(!html.includes('[object Object]'));assert(html.includes('./v2/#/'));
 }
});
test('실제15본문은 원래 개념·활동·토론·45문항과 모든 실험 조작부를 보존한다',()=>{
 for(const unit of ORDERED){
  const {app,observer,mounted3D,mountedQuiz}=render(unit),html=app.innerHTML;
  assert(html.includes('science-binder binder-experiment'));
  for(const [title,text]of unit.concept.points){assert(html.includes(esc(title)));assert(html.includes(esc(text)));}
  for(const text of unit.activity.steps)assert(html.includes(esc(text)));
  for(const discussion of unit.discuss){assert(html.includes(esc(discussion.q)));assert(html.includes(esc(discussion.hint)));}
  for(const q of unit.quiz){assert(html.includes(esc(q.q)));for(const choice of q.c)assert(html.includes(esc(choice)));}
  for(const id of ['stage','caption','dots','btnPlay','btnPrev','btnNext','btnReplay','btnVoice','speed','transcript','quiz-items','score'])assert(html.includes(`id="${id}"`));
  const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(match=>match[1]);assert.equal(ids.length,new Set(ids).size,unit.id+' duplicate IDs');
  assert(html.includes(`href="#/u/${unit.id}/report"`));assert.equal(observer.observed.length,5);assert.equal(mounted3D,1);assert.equal(mountedQuiz,1);
 }
});
test('본문 건너뛰기·줄인 움직임·현재 차례 표시를 실행하고 화면 해제 뒤 콜백을 막는다',()=>{
 const {app,context,targets,observer}=render(ORDERED[0],{reduced:true});
 const skip=app.links.find(link=>link.classList.contains('binder-unit-skip')),handler=skip.listeners.get('click');
 handler({preventDefault(){},currentTarget:skip});assert.equal(targets.get('concept').focuses,1);assert.equal(targets.get('concept').scrolls[0].behavior,'auto');
 const oldScrolls=targets.get('concept').scrolls.length;
 context.unitOff();assert.equal(observer.disconnected,1);assert(app.links.every(link=>link.listeners.size===0));
 handler({preventDefault(){},currentTarget:skip});assert.equal(targets.get('concept').scrolls.length,oldScrolls);
 observer.callback([{isIntersecting:true,target:{id:'video'}}]);
 assert(app.links.every(link=>!link.classList.contains('on')));
});
test('실제 퀴즈는 고유 ID의 영역을 쓰며 재클릭으로 채점·기록이 중복되지 않는다',()=>{
 for(const unit of ORDERED)for(const correct of [true,false]){
  let click;
  const questions=unit.quiz.map((q,qi)=>{
   const why={hidden:true,textContent:''},buttons=q.c.map((_choice,ci)=>({dataset:{c:String(ci)},disabled:false,classList:{add(){}}}));
   const question={dataset:{q:String(qi)},buttons,why,querySelectorAll:()=>buttons,querySelector:selector=>selector==='.why'?why:buttons[q.a]};
   buttons.forEach(button=>{button.closest=selector=>selector==='button'?button:selector==='.q'?question:null;});
   return question;
  });
  const score={textContent:''},writes=[],state={quizBest:correct?1:3,report:{sentinel:'keep'}};
  const context=vm.createContext({document:{getElementById:id=>{if(id==='quiz-items')return{addEventListener:(type,handler)=>{assert.equal(type,'click');click=handler;}};if(id==='score')return score;throw Error('Unexpected quiz ID '+id);}},store:{unit:()=>state,patch:(id,patch)=>writes.push({id,patch})},LETTERS:['A','B','C','D']});
  const mount=new vm.Script(source.slice(source.indexOf('function mountQuiz('),source.indexOf("addEventListener('hashchange'"))+'\nmountQuiz').runInContext(context);
  mount(unit);
  questions.forEach((question,i)=>click({target:question.buttons[correct?unit.quiz[i].a:(unit.quiz[i].a+1)%unit.quiz[i].c.length]}));
  assert.equal(writes.length,1);assert.equal(writes[0].id,unit.id);assert.equal(writes[0].patch.quizBest,3);assert.equal(writes[0].patch.lastScore,correct?3:0);assert(score.textContent.includes(correct?'3/3':'0/3'));
  assert(questions.every(question=>question.why.hidden===false));
  click({target:questions[0].buttons[unit.quiz[0].a]});assert.equal(writes.length,1);assert.equal(state.report.sentinel,'keep');
 }
});
test('실제 라우터는 다른 화면으로 이동하기 전에 실험 화면의 관찰 핸들러를 해제한다',()=>{
 let released=0,home=0;
 const context=vm.createContext({location:{hash:'#/'},teardown3D(){},homeOff:null,unitOff:()=>released++,reportOff:null,window:{scrollTo(){}},renderHome:()=>home++});
 new vm.Script(section('function route()','function teardown3D(')+'\nroute();').runInContext(context);
 assert.equal(released,1);assert.equal(context.unitOff,null);assert.equal(home,1);
});
