import { activities,bank,problemsFor } from './core.js?v=number-paper-1';
import { languages,translation } from './activity-i18n.js?v=7';
import { initialActivity,restoreActivity,advance,piecesFor,foldGeometry,sceneShift,shiftTransform } from './activity-model.js?v=3';
import { paperScene,foldDirections } from './activity-render.js?v=7';
import { sessionProblems } from '../../shared/problem-pool.js';
import { readGameProgress,saveGameProgress } from '../../shared/profile-storage.js';
import {difficultyFor,initialCalculation,restoreCalculation,completedActivity,phaseFor,submitCalculation} from './calculation.js?v=6';
import {additionSteps,requestHelp,nextHelp} from './calculation-help.js?v=6';
const $=s=>document.querySelector(s),url=new URL(location.href);
let prior={},storedLanguage;
try{prior=readGameProgress('number-paper');storedLanguage=localStorage.getItem('gfield-language');}catch{/* Optional storage. */}
let lang=url.searchParams.get('lang')||storedLanguage||'ko';if(!languages.includes(lang))lang='ko';
const difficulty=difficultyFor(url.searchParams.get('difficulty')||prior.paperPlayDifficulty);
const checkpointKey=difficulty==='challenge'?'paperPlayChallenge':'paperPlay';
const saved=prior[checkpointKey]?.version===3?prior[checkpointKey]:{};
const activity=activities.find(a=>a.id===url.searchParams.get('activity'))||activities.find(a=>a.level===Number(url.searchParams.get('level')))||activities.find(a=>a.id===saved.activity)||activities[0];
url.searchParams.set('difficulty',difficulty);url.searchParams.set('activity',activity.id);url.searchParams.set('level',activity.level);
const restored=url.searchParams.get('practice')!=='1'&&saved.activity===activity.id&&Array.isArray(saved.queueIds)&&saved.queueIds.length===5&&new Set(saved.queueIds).size===5&&saved.queueIds.every(id=>problemsFor(activity.id).some(p=>p.id===id));
const queue=restored?saved.queueIds.map(id=>bank.find(p=>p.id===id)):sessionProblems('number-paper',activity.level,problemsFor(activity.id),5);
url.searchParams.delete('practice');history.replaceState(null,'',url);
let index=restored&&Number.isInteger(saved.index)&&saved.index>=0&&saved.index<queue.length?saved.index:0;
let state=restored?restoreActivity(queue[index],saved.model):initialActivity();
let calculation=restored?restoreCalculation(queue[index],state,saved.calculation):initialCalculation();
let calculationFeedback='';
let made=restored&&Array.isArray(saved.made)?saved.made.filter(id=>queue.some(p=>p.id===id)):[];
const assistedIds=restored&&Array.isArray(saved.assistedIds)?[...new Set(saved.assistedIds.filter(id=>queue.some(p=>p.id===id)))]:[];
if(calculation.assisted&&!assistedIds.includes(queue[index].id))assistedIds.push(queue[index].id);
let busy=false,generation=0,gesture=null,suppressClickUntil=0,storageFailed=false;
const p=()=>queue[index],t=()=>translation(lang),reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function persist(){
  try{saveGameProgress('number-paper',{paperPlayDifficulty:difficulty,[checkpointKey]:{version:3,activity:activity.id,queueIds:queue.map(p=>p.id),index,model:state,made,calculation,assistedIds}});}catch{storageFailed=true;}
  $('#storageWarning').textContent=storageFailed?t().storage:'';
}
function stepIndex(){if(phaseFor(difficulty,state,calculation)==='calculate'||(difficulty==='challenge'&&calculation.solved))return 4;return state.phase.startsWith('fold')?0:state.phase==='cut'?1:state.phase.startsWith('unfold')?2:3;}
function render(focus=false){
  const text=t(),completed=completedActivity(difficulty,state,calculation),phase=phaseFor(difficulty,state,calculation);
  $('.paper-play').dataset.difficulty=difficulty;$('.paper-play').dataset.phase=phase;
  $('#difficulty').innerHTML=`<option value="play">${text.playMode}</option><option value="challenge">${text.challengeMode}</option>`;$('#difficulty').value=difficulty;$('#difficulty').ariaLabel=text.difficulty;
  document.documentElement.lang=lang;document.title=`GFIELD ${text.title}`;
  $('#gameTitle').textContent=text.title;$('#back').ariaLabel=text.back;
  $('#language').value=lang;$('#language').ariaLabel=text.language;
  $('#activity').innerHTML=activities.map(a=>`<option value="${a.id}">${text[a.id]}</option>`).join('');$('#activity').value=activity.id;$('#activity').ariaLabel=text.activity;
  $('#prompt').textContent=text[state.phase==='cut'?'cutAction':state.phase==='collect'?(activity.id==='cut'?'collectCut':'collectRemain'):phase];
  $('#gestureHint').textContent=completed?'':phase==='calculate'?text.calculateHelp:state.phase.startsWith('unfold')?text.predictShape:text.tap;
  $('#steps').ariaLabel=(difficulty==='challenge'?[...text.step,text.calculateStep]:text.step).join(' → ');
  $('#steps').innerHTML=(difficulty==='challenge'?[...text.step,text.calculateStep]:text.step).map((name,i)=>`<li class="${i===stepIndex()?'active':i<stepIndex()?'past':''}"${i===stepIndex()?' aria-current="step"':''}><b>${i<stepIndex()?'✓':i+1}</b>${name}</li>`).join('');
  $('#paper').innerHTML=paperScene(p(),phase==='calculate'?{...state,phase:'collect'}:state,text);$('#paper').dataset.phase=phase;$('#paper').dataset.problemId=p().id;$('#paper').ariaLabel=text.title;
  const directions=foldDirections(p(),state,text);$('#foldDirections').innerHTML=directions;$('#foldDirections').hidden=!directions;$('#foldDirections').ariaLabel=state.phase.startsWith('unfold')?text.openDirections:text.foldDirections;
  $('#trayTitle').textContent=text.tray;$('#basket').ariaLabel=text.tray;
  const collected=piecesFor(p()).filter(piece=>state.collected.includes(piece.id));
  const numbers=collected.flatMap(piece=>piece.cells.map(id=>p().grid[Math.floor(id/4)][id%4]));
  $('#tokens').innerHTML=numbers.map((n,i)=>`<span class="token" style="--tilt:${(i*7)%17-8}deg">${n}</span>`).join('');
  $('#basketHelp').hidden=phase==='calculate';$('#basketHelp').textContent=completed&&calculation.assisted?text.assistedDone:numbers.length?`${collected.length} ${text.pieces}`:text.ready;
  $('.total').hidden=difficulty==='challenge'&&!calculation.solved;
  $('#calculation').hidden=phase!=='calculate';$('#basket').classList.toggle('calculating',phase==='calculate');
  $('#answerLabel').textContent=text.answerLabel;$('#answer').value=calculation.input;$('#answer').setAttribute('aria-invalid',String(calculationFeedback==='tryAgain'));
  $('#checkSum').textContent=text.checkSum;$('#checkSum').disabled=!calculation.input.trim();
  $('#calculationFeedback').textContent=calculationFeedback?text[calculationFeedback]:'';
  $('#sumLabel').textContent=text.sum;$('#sum').textContent=difficulty==='challenge'&&!calculation.solved?'':collected.reduce((n,piece)=>n+piece.sum,0);
  $('#collectionTitle').textContent=text.collection;
  $('#collection').innerHTML=queue.map((q,i)=>`<span class="creation ${made.includes(q.id)?'made':''} ${index===i?'current':''}" style="--tilt:${i%2?-7:6}deg" aria-label="${i+1}/5${made.includes(q.id)?' ✓':''}${assistedIds.includes(q.id)?` ${text.assistedDone}`:''}">${made.includes(q.id)?'✦':i+1}</span>`).join('');
  $('#progress').textContent=`${index+1} / ${queue.length}`;$('#retry').textContent=text.retry;
  $('#next').hidden=!completed||index===queue.length-1;$('#next').textContent=text.next;
  $('#practice').hidden=!completed||index!==queue.length-1;$('#practice').textContent=text.practice;$('#practice').href=`?activity=${activity.id}&level=${activity.level}&practice=1&difficulty=${difficulty}&lang=${lang}`;
  $('#status').textContent=completed?(index===queue.length-1?text.complete:''):state.phase==='cut'?`${text.cuts} ${state.cutKeys.length} / ${p().cells.length}`:'';
  renderCalculationHelp(phase);
  persist();if(focus){if(phase==='calculate')$('#answer').focus();else $('#paper').querySelector('button:not(:disabled)')?.focus({preventScroll:true});}
}
function renderCalculationHelp(phase){
  const text=t(),available=phase==='calculate';
  $('#helpCalculation').hidden=!available;$('#helpCalculation').textContent=text.helpCalculate;
  const open=available&&calculation.helpOpen===true;$('#calculationHelp').hidden=!open;$('#helpCalculation').setAttribute('aria-expanded',String(open));
  $('#helpClose').ariaLabel=text.helpClose;$('#helpTitle').textContent=text.helpTitle;
  if(!open)return;
  const steps=additionSteps(p()),step=steps[calculation.helpStep],packed=step.kind==='make-ten'&&calculation.helpPacked;
  $('#helpProgress').textContent=`${calculation.helpStep+1} / ${steps.length}`;
  const finish=step.kind==='finish',first=finish?step.remainder:step.left;
  $('#helpTitle').textContent=finish?text.tenFinal:packed?text.tenPacked:step.strategy==='split'?text.tenSplit:step.strategy==='pair'?text.tenPair(step.left,step.number):text.tenGroup;
  const bags=finish?step.tenCount:step.tenCount-(packed?0:1);
  const ledger=`<div class="ten-bundles"><small>${text.tenBags}</small>${Array.from({length:bags},()=>'<span>10</span>').join('')}${bags?'':'<i>0</i>'}</div>`;
  const frame=`<div class="ten-frame" aria-hidden="true">${Array.from({length:10},(_,i)=>`<i class="${i<first?'base':!finish&&packed?'joined':!finish?'waiting':''}"></i>`).join('')}</div>`;
  let note;
  if(finish){const rest=step.available.filter(v=>v>0);note=rest.length>1?rest.join(' + ')+` = ${step.remainder}`:rest.length?`${text.tenLeft}: ${step.remainder}`:text.noLeft;}
  else{
    const split=step.contributions.find(c=>c.after>0);
    const prefix=step.contributions.slice(0,-1).map(c=>c.take).join(' + ')+` = ${step.left}`;
    note=split?(step.contributions.length>2?prefix+'<br>':'')+text.splitNumber(split.before,split.take,split.after):step.strategy==='pair'?text.tenPairNote:prefix;
  }
  $('#helpEquation').innerHTML=`${ledger}<div class="ten-display"><div class="ten-frame-wrap"><small>${finish?text.tenLeft:text.tenGoal}</small>${frame}</div><div class="ten-math"><div class="ten-equation"><span>${step.left}</span><b>+</b><span>${step.number}</span><b>=</b><strong>${step.total}</strong></div><small class="ten-source">${note}</small></div></div>`;
  $('#helpNext').textContent=finish?text.writeAnswer:!packed?text.packTen:steps[calculation.helpStep+1].kind==='finish'?text.addTens:text.findTen;
  const used=packed?step.usedAfter:step.usedBefore;
  $('#tokens').querySelectorAll('.token').forEach((token,i)=>{
    token.classList.toggle('help-counted',used[i]>0);token.style.setProperty('--used',`${used[i]/Number(token.textContent)*100}%`);
    token.classList.toggle('help-current',!finish&&step.contributions.some(c=>c.index===i));
  });
}
function resetTransient(){
  generation++;busy=false;const active=gesture;gesture=null;
  if(active&&$('#paper').hasPointerCapture(active.pointerId))$('#paper').releasePointerCapture(active.pointerId);
  $('#paper').getAnimations({subtree:true}).forEach(a=>a.cancel());$('#basket').classList.remove('hover');
}
async function animate(node,frames,duration=550){
  if(!node)return;
  try{await node.animate(frames,{duration:reduced()?0:duration,easing:'cubic-bezier(.3,.05,.2,1)',fill:'forwards'}).finished;}catch{/* A reset invalidates the operation below. */}
}
function completeAction(action,value,focus=false){
  const wasDone=completedActivity(difficulty,state,calculation);state=advance(p(),state,action,value);
  if(completedActivity(difficulty,state,calculation)&&!made.includes(p().id))made.push(p().id);
  busy=false;render(focus);
  if(!wasDone&&completedActivity(difficulty,state,calculation))celebrate(focus);
}
function celebrate(focus){
    $('#sparkles').innerHTML=Array.from({length:14},(_,i)=>`<i style="--x:${Math.cos(i*2.4)*180}px;--y:${Math.sin(i*2.4)*160}px;--color:${['#fff0a4','#f6a69e','#b8e8d6'][i%3]}"></i>`).join('');
    if(focus)(index===queue.length-1?$('#practice'):$('#next')).focus({preventScroll:true});
}
async function fold(startAngle=null,focus=false){
  if(busy||!['fold-h','fold-v','unfold-v','unfold-h'].includes(state.phase))return;
  busy=true;const epoch=generation,g=foldGeometry(p(),state.phase),node=$('.flap');
  $('.fold-handle').style.visibility='hidden';
  const from=startAngle??(g.unfold?g.angle:0),to=g.unfold?0:g.angle;
  const object=$('.paper-object'),target=shiftTransform(sceneShift(p(),advance(p(),state,'fold').phase)),duration=Math.max(180,550*Math.abs(to-from)/180);
  await Promise.all([animate(node,[{transform:`rotate${g.axis}(${from}deg)`},{transform:`rotate${g.axis}(${to}deg)`}],duration),animate(object,[{transform:object.style.transform},{transform:target}],duration)]);
  if(epoch===generation)completeAction('fold',null,focus);
}
async function cut(key,focus=false){
  if(busy||state.phase!=='cut'||state.cutKeys.includes(key)||!p().cells.some(cell=>cell.r*2+cell.c===key))return;
  busy=true;const epoch=generation,node=$(`[data-cut="${key}"]`);node.classList.add('cutting');
  await animate(node,[{filter:'brightness(1)'},{filter:'brightness(1.3)',offset:.5},{filter:'brightness(1)'}],500);
  if(epoch===generation)completeAction('cut',key,focus);
}
async function collect(id,from={x:0,y:0},focus=false){
  if(busy||state.phase!=='collect'||state.collected.includes(id))return;
  const piece=piecesFor(p()).find(piece=>piece.id===id);if(!piece)return;
  busy=true;const epoch=generation,node=$(`[data-group="${id}"]`),paper=$('#paper').getBoundingClientRect(),basket=$('#basket').getBoundingClientRect();
  const cx=piece.cells.reduce((n,id)=>n+(id%4+.5)*paper.width/4,0)/piece.cells.length;
  const cy=piece.cells.reduce((n,id)=>n+(Math.floor(id/4)+.5)*paper.height/4,0)/piece.cells.length;
  node.style.transformOrigin=`${cx}px ${cy}px`;
  const dx=basket.x+basket.width/2-paper.x-cx,dy=basket.y+basket.height*.45-paper.y-cy;
  await animate(node,[{transform:node.style.transform||getComputedStyle(node).transform,opacity:1},{transform:`translate(${dx}px,${dy}px) rotate(14deg) scale(.18)`,opacity:.2}],450);
  if(epoch===generation)completeAction('collect',id,focus);
}
const paper=$('#paper');
paper.addEventListener('pointerdown',event=>{
  if(busy||event.button!==0)return;
  const node=event.target.closest('[data-fold],[data-cut],[data-piece]');if(!node||node.disabled)return;
  const type=node.hasAttribute('data-fold')?'fold':node.hasAttribute('data-cut')?'cut':'piece';
  gesture={type,node,pointerId:event.pointerId,x:event.clientX,y:event.clientY,dx:0,dy:0,progress:0};
  if(type==='fold')gesture.g=foldGeometry(p(),state.phase);
  if(type==='piece'){gesture.group=$(`[data-group="${node.dataset.piece}"]`);gesture.group.classList.add('dragging');}
  paper.setPointerCapture(event.pointerId);
});
paper.addEventListener('pointermove',event=>{
  if(!gesture||gesture.pointerId!==event.pointerId)return;
  const a=gesture;a.dx=event.clientX-a.x;a.dy=event.clientY-a.y;
  if(Math.hypot(a.dx,a.dy)<5)return;
  if(a.type==='fold'){
    const rect=paper.getBoundingClientRect(),sign=a.g.unfold?-1:1;
    a.progress=Math.max(0,Math.min(1,(a.dx*a.g.vector[0]+a.dy*a.g.vector[1])*sign/(a.g.horizontal?rect.height/2:rect.width/2)));
    const angle=a.g.unfold?a.g.angle*(1-a.progress):a.g.angle*a.progress;
    $('.flap').style.transform=`rotate${a.g.axis}(${angle}deg)`;
    const from=sceneShift(p(),state.phase),to=sceneShift(p(),advance(p(),state,'fold').phase);
    $('.paper-object').style.transform=shiftTransform({x:from.x+(to.x-from.x)*a.progress,y:from.y+(to.y-from.y)*a.progress});a.node.style.opacity='.1';
  }else if(a.type==='piece'){
    a.group.style.transform=`translate(${a.dx+Number(a.group.dataset.homeX)}px,${a.dy+Number(a.group.dataset.homeY)}px) rotate(0deg)`;
    const r=$('#basket').getBoundingClientRect();$('#basket').classList.toggle('hover',event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom);
  }else if(a.type==='cut')a.node.querySelector('svg')?.setAttribute('style',`transform:translate(${a.dx}px,${a.dy}px) rotate(-8deg)`);
});
async function endGesture(event,cancel=false){
  if(!gesture||gesture.pointerId!==event.pointerId)return;
  const a=gesture;gesture=null;suppressClickUntil=performance.now()+500;
  if(paper.hasPointerCapture(event.pointerId))paper.releasePointerCapture(event.pointerId);
  const moved=Math.hypot(a.dx,a.dy)>6;
  if(a.type==='fold'){
    const start=a.g.unfold?a.g.angle*(1-a.progress):a.g.angle*a.progress;
    a.node.style.opacity='';
    if(!cancel&&(!moved||a.progress>=.32))await fold(moved?start:null);
    else{
      busy=true;const epoch=generation,object=$('.paper-object');
      await Promise.all([animate($('.flap'),[{transform:`rotate${a.g.axis}(${start}deg)`},{transform:`rotate${a.g.axis}(${a.g.unfold?a.g.angle:0}deg)`}],220),animate(object,[{transform:object.style.transform},{transform:shiftTransform(sceneShift(p(),state.phase))}],220)]);
      if(epoch===generation){busy=false;render();}
    }
  }else if(a.type==='cut'){
    a.node.querySelector('svg')?.removeAttribute('style');if(!cancel)await cut(Number(a.node.dataset.cut));
  }else{
    $('#basket').classList.remove('hover');a.group.classList.remove('dragging');
    const r=$('#basket').getBoundingClientRect(),inBasket=event.clientX>=r.left&&event.clientX<=r.right&&event.clientY>=r.top&&event.clientY<=r.bottom;
    if(!cancel&&(!moved||inBasket))await collect(a.node.dataset.piece,{x:a.dx,y:a.dy});
    else{
      busy=true;const epoch=generation;await animate(a.group,[{transform:a.group.style.transform},{transform:'translate(var(--home-x),var(--home-y)) rotate(var(--lift))'}],200);
      if(epoch===generation){busy=false;render();}
    }
  }
}
paper.addEventListener('pointerup',event=>endGesture(event));paper.addEventListener('pointercancel',event=>endGesture(event,true));
paper.addEventListener('click',event=>{
  if(busy||(event.detail!==0&&performance.now()<suppressClickUntil))return;
  const node=event.target.closest('[data-fold],[data-cut],[data-piece]');if(!node||node.disabled)return;
  if(node.hasAttribute('data-fold'))fold(null,true);else if(node.hasAttribute('data-cut'))cut(Number(node.dataset.cut),true);else collect(node.dataset.piece,{x:0,y:0},true);
});
$('#retry').addEventListener('click',()=>{resetTransient();state=initialActivity();calculation=initialCalculation();calculationFeedback='';render(true);});
$('#next').addEventListener('click',()=>{if(!completedActivity(difficulty,state,calculation)||index>=queue.length-1)return;resetTransient();index++;state=initialActivity();calculation=initialCalculation();calculationFeedback='';render(true);});
$('#language').addEventListener('change',()=>{resetTransient();lang=$('#language').value;try{localStorage.setItem('gfield-language',lang);}catch{storageFailed=true;}url.searchParams.set('lang',lang);history.replaceState(null,'',url);render();});
$('#activity').addEventListener('change',()=>{location.href=`?activity=${$('#activity').value}&level=${$('#activity').value==='cut'?1:2}&difficulty=${difficulty}&lang=${lang}`;});
$('#difficulty').addEventListener('change',()=>{url.searchParams.set('difficulty',$('#difficulty').value);location.href=url.toString();});
$('#answer').addEventListener('input',()=>{if(phaseFor(difficulty,state,calculation)!=='calculate')return;calculation.input=$('#answer').value.slice(0,4);calculationFeedback='';$('#answer').setAttribute('aria-invalid','false');$('#calculationFeedback').textContent='';$('#checkSum').disabled=!calculation.input.trim();persist();});
$('#calculation').addEventListener('submit',event=>{event.preventDefault();if(phaseFor(difficulty,state,calculation)!=='calculate'||!calculation.input.trim())return;calculation=submitCalculation(p(),state,calculation);if(calculation.solved){if(!made.includes(p().id))made.push(p().id);calculationFeedback='';render();celebrate(true);}else{calculationFeedback='tryAgain';$('#answer').setAttribute('aria-invalid','true');$('#calculationFeedback').textContent=t().tryAgain;persist();$('#answer').focus({preventScroll:true});}});
function focusCalculationHelp(){$('#calculationHelp').scrollIntoView({block:'center'});$('#helpNext').focus({preventScroll:true});}
$('#helpCalculation').addEventListener('click',()=>{
  if(phaseFor(difficulty,state,calculation)!=='calculate')return;
  if(calculation.helpOpen){closeHelp();return;}
  calculation=requestHelp(p(),state,calculation);if(!assistedIds.includes(p().id))assistedIds.push(p().id);render();focusCalculationHelp();
});
function closeHelp(){calculation.helpOpen=false;render();$('#answer').focus();}
$('#helpClose').addEventListener('click',closeHelp);
$('#calculationHelp').addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeHelp();}});
$('#helpNext').addEventListener('click',()=>{
  if(phaseFor(difficulty,state,calculation)!=='calculate'||!calculation.helpOpen)return;
  if(calculation.helpStep===additionSteps(p()).length-1){closeHelp();return;}
  calculation=nextHelp(p(),state,calculation);render();focusCalculationHelp();
});
render();
