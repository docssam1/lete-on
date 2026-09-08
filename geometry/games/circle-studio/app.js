import { domains, problemsFor, promptPartsFor, hintFor, solutionFor, grade, optionLabels } from './core.js?v=circle-1';
import { renderProblem } from './render.js?v=circle-1';
import { translation, languages } from './i18n.js?v=circle-1';
import { icon } from '../shape-transform/ui-icons.js?v=shape-transform-5';
import { sessionProblems } from '../../shared/problem-pool.js';
import { saveGameProgress } from '../../shared/profile-storage.js';

const $ = selector => document.querySelector(selector);
const url = new URL(location.href);
const domain = domains.find(d=>d.id===url.searchParams.get('domain')) || domains.find(d=>d.level===Number(url.searchParams.get('level'))) || domains[0];
let savedLanguage;
try { savedLanguage=localStorage.getItem('gfield-language'); } catch { /* Storage is optional. */ }
let lang=url.searchParams.get('lang') || savedLanguage || 'ko';
if(!languages.includes(lang))lang='ko';
url.searchParams.set('domain',domain.id);url.searchParams.set('level',domain.level);
history.replaceState(null,'',url);
const queue=sessionProblems('circle-studio',domain.level,problemsFor(domain.id),5);
url.searchParams.delete('practice');history.replaceState(null,'',url);
const state={index:0,selectedIds:[],selectedPoint:null,radius:1,length:'',history:[],finished:false,feedback:'',response:null,storageFailed:false,focusKey:null,traceProgress:0,animating:false};
let frame=0,generation=0;
const p=()=>queue[state.index];
const t=key=>translation(lang)[key];
const construction=()=>state.selectedPoint?{center:[...state.selectedPoint],radius:state.radius}:null;
const outside=()=>p().domain==='draw' && state.selectedPoint && state.selectedPoint.some(n=>n-state.radius<0 || n+state.radius>6);
const snapshot=()=>({selectedIds:[...state.selectedIds],selectedPoint:state.selectedPoint?[...state.selectedPoint]:null,radius:state.radius,length:state.length});
function stopTrace(clear=true) {
  generation++;cancelAnimationFrame(frame);frame=0;state.animating=false;
  if(clear)state.traceProgress=0;
}
function action(selector,glyph,key,iconOnly=false) {
  const node=$(selector);node.innerHTML=icon(glyph)+(iconOnly?'':`<span>${t(key)}</span>`);
  node.title=t(key);node.setAttribute('aria-label',t(key));
}
function renderBoard(focus=false) {
  $('#board').dataset.problemId=p().id;
  $('#board').dataset.traceState=state.animating?'tracing':state.traceProgress===1?'complete':'empty';
  $('#board').innerHTML=renderProblem(p(),{lang,reveal:state.finished,interactive:!state.finished,selectedPoint:state.selectedPoint,selectedIds:state.selectedIds,construction:p().domain==='draw'?construction():null,traceProgress:state.traceProgress});
  const target=state.focusKey && $('#board').querySelector(state.focusKey);
  if(target) {
    $('#board').querySelectorAll('[tabindex]').forEach(node=>node.setAttribute('tabindex','-1'));
    target.setAttribute('tabindex','0');if(focus)target.focus({preventScroll:true});
  }
}
function updateResponse() {
  const empty=p().domain==='parts'?!state.selectedIds.length:p().domain==='measure'?!state.length:!state.selectedPoint;
  $('#check').disabled=state.finished || empty || (p().domain==='draw' && state.traceProgress!==1);
  $('#undo').disabled=state.finished || !state.history.length;
  $('#choices').querySelectorAll('input').forEach(input=>{input.checked=state.selectedIds.includes(input.value);input.disabled=state.finished;});
  $('#length').value=state.length;$('#length').disabled=state.finished;
  $('#pointReadout').hidden=!['center','draw'].includes(p().domain);
  $('#pointReadout').textContent=state.selectedPoint?t('point')(...state.selectedPoint):t('noPoint');
  $('#radius').textContent=`${state.radius} cm`;$('#radius').dataset.radius=state.radius;
  $('#decrease').disabled=state.finished || !state.selectedPoint || state.radius<=1;
  $('#increase').disabled=state.finished || !state.selectedPoint || state.radius>=3;
  $('#trace').disabled=state.finished || !state.selectedPoint || state.animating || !!outside();
  $('#cancel').disabled=state.finished || (!state.animating && !state.traceProgress);
  $('#traceStatus').textContent=t(!state.selectedPoint?'pin':outside()?'outside':state.animating?'tracing':state.traceProgress===1?'traced':'ready');
  $('#traceStatus').dataset.outOfGrid=String(!!outside());
  $('#feedback').textContent=state.feedback?t(state.feedback):'';$('#feedback').dataset.kind=state.finished?'correct':'';
  $('#length').setAttribute('aria-invalid',String(state.feedback==='invalidMeasure'));
  $('#review').hidden=!state.finished;$('#solution').textContent=state.finished?solutionFor(p(),lang,state.response):'';
  $('#next').hidden=!state.finished;$('#progressBar').value=state.index+(state.finished?1:0);
  $('#storageWarning').textContent=state.storageFailed?t('storage'):'';
}
function renderCopy() {
  document.documentElement.lang=lang;document.title=`GFIELD ${t('title')}`;$('.studio').dataset.domain=domain.id;
  $('#language').value=lang;$('#language').setAttribute('aria-label',t('language'));
  $('#studioTitle').textContent=t('title');$('#title').textContent=domain.names[lang];
  $('#domainTabs').setAttribute('aria-label',t('area'));
  $('#domainTabs').innerHTML=domains.map(d=>`<a href="?domain=${d.id}&level=${d.level}&lang=${lang}" ${d.id===domain.id?'aria-current="page"':''}>${d.names[lang]}</a>`).join('');
  action('#back','back','back',true);action('#retry','retry','retry',true);action('#undo','back','undo',true);
  action('#worksheet','book','worksheet',true);$('#worksheet').href=`../../worksheet/circle-studio/?domain=${domain.id}&lang=${lang}`;
  action('#check','check','check');action('#next','next',state.index===queue.length-1?'done':'next');action('#close','close','done',true);
  action('#trace','clockwise','trace',true);action('#cancel','close','cancel',true);action('#decrease','down','decrease',true);action('#increase','up','increase',true);
  const parts=promptPartsFor(p(),lang);$('#prompt').textContent=parts.question;
  $('#conditions').replaceChildren(...parts.conditions.map(text=>{const node=document.createElement('p');node.textContent=text;return node;}));
  $('#conditions').hidden=!parts.conditions.length;
  $('#progress').textContent=`${state.index+1} / ${queue.length}`;$('#progressBar').setAttribute('aria-label',t('progress'));
  $('#selectionResponse').hidden=domain.id!=='parts';$('#measureResponse').hidden=domain.id!=='measure';$('#drawResponse').hidden=domain.id!=='draw';
  $('#choicesTitle').textContent=t('choices');$('#choices').replaceChildren();
  if(domain.id==='parts')for(const {id,label} of optionLabels(domain.id,lang)) {
    const wrapper=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');
    input.type='checkbox';input.name='selection';input.value=id;input.id=`choice-${id}`;span.textContent=label;
    wrapper.append(input,span);$('#choices').append(wrapper);
  }
  $('#lengthLabel').textContent=t('length');$('#openingLabel').textContent=t('opening');
  $('#hintTitle').textContent=t('hint');$('#hintText').textContent=hintFor(p(),lang);$('#reviewTitle').textContent=t('review');
  $('#completeTitle').textContent=t('complete');$('#completeText').textContent=t('completeText');
  $('#practice').href=`?domain=${domain.id}&level=${domain.level}&practice=1&lang=${lang}`;$('#practice').textContent=t('practice');$('#garden').textContent=t('area');
  renderBoard();updateResponse();
}
function choose(node) {
  if(!node || state.finished)return;
  state.history.push(snapshot());stopTrace();state.selectedPoint=node.dataset.point.split(',').map(Number);
  state.focusKey=`[data-point="${node.dataset.point}"]`;state.feedback='';renderBoard(true);updateResponse();
}
$('#board').addEventListener('click',event=>choose(event.target.closest('[data-point]')));
$('#board').addEventListener('keydown',event=>{
  const node=event.target.closest('[data-point]');if(!node || state.finished)return;
  if(['Enter',' '].includes(event.key)){event.preventDefault();choose(node);return;}
  const vector={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(!vector && !['Home','End'].includes(event.key))return;
  event.preventDefault();const [x,y]=node.dataset.point.split(',').map(Number);
  const point=vector?[(x+vector[0]+7)%7,(y+vector[1]+7)%7]:event.key==='Home'?[0,y]:[6,y];
  const selector=`[data-point="${point}"]`,next=$('#board').querySelector(selector);
  node.setAttribute('tabindex','-1');next.setAttribute('tabindex','0');next.focus({preventScroll:true});state.focusKey=selector;
});
$('#choices').addEventListener('change',event=>{
  if(state.finished || !event.target.matches('input'))return;
  state.history.push(snapshot());const id=event.target.value;
  state.selectedIds=state.selectedIds.includes(id)?state.selectedIds.filter(value=>value!==id):[...state.selectedIds,id];
  state.feedback='';renderBoard();updateResponse();
});
$('#length').addEventListener('input',()=>{
  if(state.finished)return;
  state.history.push(snapshot());state.length=$('#length').value;state.feedback='';updateResponse();
});
function changeRadius(delta) {
  if(state.finished || !state.selectedPoint)return;
  const radius=Math.max(1,Math.min(3,state.radius+delta));if(radius===state.radius)return;
  state.history.push(snapshot());stopTrace();state.radius=radius;state.feedback='';renderBoard();updateResponse();
}
$('#decrease').addEventListener('click',()=>changeRadius(-1));$('#increase').addEventListener('click',()=>changeRadius(1));
$('#trace').addEventListener('click',()=>{
  if(state.finished || !state.selectedPoint || state.animating || outside())return;
  state.history.push(snapshot());stopTrace();state.animating=true;state.feedback='';
  const token=generation,start=performance.now();
  renderBoard();updateResponse();
  const finish=()=>{state.traceProgress=1;state.animating=false;frame=0;renderBoard();updateResponse();};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return;}
  // A generation token prevents an interrupted callback from restoring an old trace.
  const sweep=now=>{
    if(token!==generation)return;
    state.traceProgress=Math.min(1,(now-start)/1600);
    if(state.traceProgress===1){finish();return;}
    renderBoard();frame=requestAnimationFrame(sweep);
  };
  frame=requestAnimationFrame(sweep);
});
$('#cancel').addEventListener('click',()=>{if(state.finished)return;stopTrace();state.feedback='';renderBoard();updateResponse();});
$('#undo').addEventListener('click',()=>{
  if(state.finished || !state.history.length)return;
  stopTrace();Object.assign(state,state.history.pop(),{feedback:''});renderBoard();updateResponse();
});
function resetProblem() {
  stopTrace();Object.assign(state,{selectedIds:[],selectedPoint:null,radius:1,length:'',history:[],finished:false,feedback:'',response:null,focusKey:null});
  $('#hint').open=false;renderCopy();
}
$('#retry').addEventListener('click',()=>{resetProblem();$('#prompt').focus();});
$('#answerForm').addEventListener('submit',event=>{
  event.preventDefault();if(state.finished || (p().domain==='draw' && state.traceProgress!==1))return;
  const response=p().domain==='center'?state.selectedPoint:p().domain==='parts'?state.selectedIds:p().domain==='draw'?construction():state.length===''?null:Number(state.length);
  const result=p().domain==='measure' && !$('#length').validity.valid?{valid:false,correct:false,kind:'invalid'}:grade(p(),response);state.finished=result.correct;
  state.feedback=result.correct?'correct':!result.valid?(p().domain==='measure'?'invalidMeasure':'invalid'):'retryAnswer';
  if(result.correct) {
    state.response=structuredClone(response);
    try { saveGameProgress('circle-studio',{domain:domain.id,problemIndex:state.index,completedProblem:p().id}); }
    catch { state.storageFailed=true; }
    renderBoard();
  }
  updateResponse();
});
$('#next').addEventListener('click',()=>{
  if(!state.finished)return;
  if(state.index===queue.length-1){$('#completion').showModal();return;}
  state.index++;resetProblem();$('#prompt').focus();
});
$('#close').addEventListener('click',()=>$('#completion').close());
$('#language').addEventListener('change',()=>{
  if(!state.finished)stopTrace();
  lang=$('#language').value;try {localStorage.setItem('gfield-language',lang);}catch { /* Keep this visit usable. */ }
  url.searchParams.set('lang',lang);history.replaceState(null,'',url);renderCopy();
});
addEventListener('pagehide',()=>stopTrace(state.traceProgress!==1));
addEventListener('pageshow',()=>{renderBoard();updateResponse();});
renderCopy();
