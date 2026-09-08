import { domains, problemsFor, promptPartsFor, hintFor, solutionFor, grade, optionLabels } from './core.js?v=quad-1';
import { renderProblem } from './render.js?v=quad-1';
import { translation, languages } from './i18n.js?v=quad-1';
import { icon } from '../shape-transform/ui-icons.js?v=shape-transform-5';
import { sessionProblems } from '../../shared/problem-pool.js';
import { saveGameProgress } from '../../shared/profile-storage.js';

const $ = selector => document.querySelector(selector);
const url = new URL(location.href);
const domain = domains.find(d=>d.id===url.searchParams.get('domain')) || domains.find(d=>d.level===Number(url.searchParams.get('level'))) || domains[0];
let savedLanguage;
try { savedLanguage=localStorage.getItem('gfield-language'); } catch { /* Optional storage. */ }
let lang=url.searchParams.get('lang') || savedLanguage || 'ko';
if(!languages.includes(lang)) lang='ko';
url.searchParams.set('domain',domain.id);url.searchParams.set('level',domain.level);
history.replaceState(null,'',url);
const bank=problemsFor(domain.id);
const queue=sessionProblems('quadrilateral',domain.level,bank,5);
url.searchParams.delete('practice');history.replaceState(null,'',url);
const state={index:0,selectedIds:[],selectedPoint:null,history:[],finished:false,feedback:'',response:null,storageFailed:false,focusKey:null};
const p=()=>queue[state.index];
const t=key=>translation(lang)[key];
const response=()=>p().domain==='build'?state.selectedPoint:state.selectedIds;
const snapshot=()=>({selectedIds:[...state.selectedIds],selectedPoint:state.selectedPoint?[...state.selectedPoint]:null});
function action(selector,glyph,key,iconOnly=false) {
  const node=$(selector);node.innerHTML=icon(glyph)+(iconOnly?'':`<span>${t(key)}</span>`);
  node.title=t(key);node.setAttribute('aria-label',t(key));
}
function renderBoard(focus=false) {
  $('#board').dataset.problemId=p().id;
  $('#board').innerHTML=renderProblem(p(),{lang,reveal:state.finished,interactive:!state.finished,selectedPoint:state.selectedPoint,selectedIds:state.selectedIds});
  const target=state.focusKey && $('#board').querySelector(state.focusKey);
  if(target) {
    $('#board').querySelectorAll('[tabindex]').forEach(node=>node.setAttribute('tabindex','-1'));
    target.setAttribute('tabindex','0');if(focus)target.focus({preventScroll:true});
  }
}
function updateResponse() {
  $('#check').disabled=state.finished || (p().domain==='build'?!state.selectedPoint:!state.selectedIds.length);
  $('#undo').disabled=state.finished || !state.history.length;
  $('#choices').querySelectorAll('input').forEach(input=>{input.checked=state.selectedIds.includes(input.value);input.disabled=state.finished;});
  $('#pointReadout').hidden=p().domain!=='build';
  $('#pointReadout').textContent=state.selectedPoint?t('point')(...state.selectedPoint):t('noPoint');
  $('#feedback').textContent=state.feedback?t(state.feedback):'';
  $('#feedback').dataset.kind=state.finished?'correct':'';
  $('#review').hidden=!state.finished;
  $('#solution').textContent=state.finished?solutionFor(p(),lang,state.response):'';
  $('#next').hidden=!state.finished;
  $('#progressBar').value=state.index+(state.finished?1:0);
  $('#storageWarning').textContent=state.storageFailed?t('storage'):'';
}
function renderCopy() {
  document.documentElement.lang=lang;document.title=`GFIELD ${t('title')}`;
  $('.studio').dataset.domain=domain.id;
  $('#language').value=lang;$('#language').setAttribute('aria-label',t('language'));
  $('#studioTitle').textContent=t('title');$('#title').textContent=domain.names[lang];
  $('#domainTabs').setAttribute('aria-label',t('area'));
  $('#domainTabs').innerHTML=domains.map(d=>`<a href="?domain=${d.id}&level=${d.level}&lang=${lang}" ${d.id===domain.id?'aria-current="page"':''}>${d.names[lang]}</a>`).join('');
  action('#back','back','back',true);action('#retry','retry','retry',true);action('#undo','back','undo',true);
  action('#worksheet','book','worksheet',true);$('#worksheet').href=`../../worksheet/quadrilateral/?domain=${domain.id}&lang=${lang}`;
  action('#check','check','check');action('#next','next',state.index===queue.length-1?'done':'next');action('#close','close','done',true);
  const parts=promptPartsFor(p(),lang);$('#prompt').textContent=parts.question;
  $('#conditions').replaceChildren(...parts.conditions.map(text=>{const paragraph=document.createElement('p');paragraph.textContent=text;return paragraph;}));
  $('#conditions').hidden=!parts.conditions.length;
  $('#legend').hidden=domain.id!=='classify';$('#legend').textContent=t('legend');
  $('#progress').textContent=`${state.index+1} / ${queue.length}`;$('#progressBar').setAttribute('aria-label',t('progress'));
  $('#selectionResponse').hidden=domain.id==='build';$('#choicesTitle').textContent=t('choices');
  $('#choices').replaceChildren();
  if(domain.id!=='build') for(const {id,label} of optionLabels(domain.id,lang)) {
    const wrapper=document.createElement('label'),input=document.createElement('input'),span=document.createElement('span');
    input.type='checkbox';input.name='selection';input.value=id;input.id=`choice-${id}`;span.textContent=label;
    wrapper.append(input,span);$('#choices').append(wrapper);
  }
  $('#hintTitle').textContent=t('hint');$('#hintText').textContent=hintFor(p(),lang);$('#reviewTitle').textContent=t('review');
  $('#completeTitle').textContent=t('complete');$('#completeText').textContent=t('completeText');
  $('#practice').href=`?domain=${domain.id}&level=${domain.level}&practice=1&lang=${lang}`;$('#practice').textContent=t('practice');$('#garden').textContent=t('area');
  renderBoard();updateResponse();
}
function toggle(id) {
  state.history.push(snapshot());
  if(id==='none') state.selectedIds=state.selectedIds.includes(id)?[]:['none'];
  else state.selectedIds=state.selectedIds.includes(id)?state.selectedIds.filter(value=>value!==id):[...state.selectedIds.filter(value=>value!=='none'),id];
  state.feedback='';
}
function choose(node) {
  if(!node || state.finished)return;
  if(node.hasAttribute('data-point')) {
    state.history.push(snapshot());state.selectedPoint=node.dataset.point.split(',').map(Number);
    state.focusKey=`[data-point="${node.dataset.point}"]`;
  } else if(node.hasAttribute('data-vertex')) {
    toggle(node.dataset.vertex);state.focusKey=`[data-vertex="${node.dataset.vertex}"]`;
  } else return;
  state.feedback=p().domain==='build' && p().vertices.some(point=>point[0]===state.selectedPoint[0]&&point[1]===state.selectedPoint[1])?'invalidBuild':'';
  renderBoard(true);updateResponse();
}
$('#choices').addEventListener('change',event=>{
  if(state.finished || !event.target.matches('input'))return;
  toggle(event.target.value);renderBoard();updateResponse();
});
$('#board').addEventListener('click',event=>choose(event.target.closest('[data-point],[data-vertex]')));
$('#board').addEventListener('keydown',event=>{
  const node=event.target.closest('[data-point],[data-vertex]');if(!node || state.finished)return;
  if(['Enter',' '].includes(event.key)){event.preventDefault();choose(node);return;}
  const vector={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
  if(!vector)return;event.preventDefault();let selector;
  if(node.hasAttribute('data-point')) {
    const [x,y]=node.dataset.point.split(',').map(Number);selector=`[data-point="${(x+vector[0]+7)%7},${(y+vector[1]+7)%7}"]`;
  } else {
    const i='ABCD'.indexOf(node.dataset.vertex);selector=`[data-vertex="${'ABCD'[(i+vector[0]+vector[1]+4)%4]}"]`;
  }
  const next=$('#board').querySelector(selector);node.setAttribute('tabindex','-1');next.setAttribute('tabindex','0');next.focus({preventScroll:true});state.focusKey=selector;
});
$('#undo').addEventListener('click',()=>{
  if(state.finished || !state.history.length)return;
  Object.assign(state,state.history.pop(),{feedback:''});renderBoard();updateResponse();
});
function resetProblem() {
  Object.assign(state,{selectedIds:[],selectedPoint:null,history:[],finished:false,feedback:'',response:null,focusKey:null});
  $('#hint').open=false;renderCopy();
}
$('#retry').addEventListener('click',()=>{resetProblem();$('#prompt').focus();});
$('#answerForm').addEventListener('submit',event=>{
  event.preventDefault();if(state.finished)return;
  const result=grade(p(),response());
  state.finished=result.correct;
  state.feedback=result.correct?'correct':!result.valid?'invalid':p().domain==='build'&&['shape','outside','invalid'].includes(result.kind)?'invalidBuild':'retryAnswer';
  if(result.correct) {
    state.response=p().domain==='build'?[...state.selectedPoint]:[...state.selectedIds];
    try {saveGameProgress('quadrilateral',{domain:domain.id,problemIndex:state.index,completedProblem:p().id});}
    catch {state.storageFailed=true;}
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
  lang=$('#language').value;
  try{localStorage.setItem('gfield-language',lang);}catch{/* Keep the visit language. */}
  url.searchParams.set('lang',lang);history.replaceState(null,'',url);renderCopy();
});
renderCopy();
