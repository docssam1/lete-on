import {cutPlanTools} from './cut-plan-view.js?v=20261021-4';
import {papersOnStroke} from '../../shared/paper-craft-stack.js?v=20261019-1';
import {catalog,buildActivity} from '../../shared/paper-craft-catalog.js?v=20261021-4';
import {act,restoreSession,freshSession,newMarks,markAnchor,withDesign,upgradeCutActions} from '../../shared/paper-craft-session.js?v=20261021-4';
import {renderScene,renderMotion,currentPaper,resultSvg,stackReference,smallPaper,escapeHtml,stackMaterialStyle} from '../../shared/paper-craft-svg.js?v=20261021-4';
import {inside,box,polygonCentroid} from '../../shared/paper-craft-model.js?v=20261018-3';
import {makeTenPlan} from '../number-paper/calculation-help.js?v=2';
import {readGameProgress,saveGameProgress} from '../../shared/profile-storage.js';
import {languages,translation} from './i18n.js?v=20261021-4';
const $=s=>document.querySelector(s),params=new URLSearchParams(location.search),familyKeys=['cut','punch','sort','number','top','reverse','stack'];
let stackMode=params.get('method')==='connect'?'connect':'peel';
let lang=languages.includes(params.get('lang'))?params.get('lang'):'ko',saved=readGameProgress('paper-craft'),records=saved.records&&typeof saved.records==='object'?saved.records:{},p=null,state=null,actions=[],busy=false,selectedPiece=null,selectedShape='triangle',selectedCut=0,feedback='',gesture=null,suppressClickUntil=0,suppressClickPoint=null,keyboardCursor=null;
const t=()=>translation(lang),effective=()=>withDesign(p,state),e=escapeHtml;
function save(){if(!p)return;const previous=records[p.id],history=previous?.revision!==p.revision&&previous?.actions?{...(previous.history||{}),[previous.revision||'local-draft']:previous.actions}:previous?.history||{};records[p.id]={revision:p.revision,actions,history};try{saveGameProgress('paper-craft',{records,lastId:p.id});$('#storageWarning').textContent='';}catch{$('#storageWarning').textContent=t().storage;}}
function open(id){try{p=buildActivity(id);}catch(error){console.error('Paper activity could not be opened',id,error);$('#lobby').hidden=false;$('#play').hidden=true;return lobby();}const previous=records[id],resume=p.cutPlan&&previous?.revision==='paper-craft-20261018-1'?upgradeCutActions(p,previous.actions):previous?.revision===p.revision?previous.actions:[];const restored=restoreSession(p,resume);state=restored.state;actions=restored.actions;selectedCut=0;selectedPiece=null;feedback='';params.set('id',id);params.set('lang',lang);history.replaceState(null,'','?'+params);render();}
function lobby(family=null){document.documentElement.lang=lang;$('.home-link').href='../../origami-studio/?lang='+lang;document.title='GFIELD '+t().title;$('#lobby').hidden=false;$('#play').hidden=true;$('#title').textContent=t().title;$('#choose').textContent=t().choose;$('#lobbyTitle').textContent=t().lobby;$('#lobbyNote').textContent=t().note;$('#language').value=lang;$('#familyGrid').innerHTML=familyKeys.map((key,i)=>`<button class="family-card" data-family="${key}" style="${stackMaterialStyle(i)}"><span class="paper-token" aria-hidden="true"></span><strong>${e(t().families[i])}</strong></button>`).join('');$('#missionGrid').innerHTML=family?catalog.filter(x=>x.family===family).map((m,i)=>`<button data-id="${m.ref}-1">${e(lang==='ko'?m.title:t().families[familyKeys.indexOf(family)]+' '+(i+1))}<span aria-hidden="true">→</span></button>`).join(''):'';}
function perform(type,value=null){if(busy||!p)return;const result=act(effective(),state,type,value);if(!result.accepted){feedback=p.cutPlan&&type==='cut-check'?t().cutRetry:t().tryAgain;$('#feedback').textContent=feedback;$('#stage').classList.remove('try-again');void $('#stage').offsetWidth;$('#stage').classList.add('try-again');return;}if(state.phase!==result.state.phase)keyboardCursor=null;state=result.state;actions.push([type,value]);feedback='';selectedPiece=null;save();render();if(state.phase==='calculate')$('#sumInput')?.focus({preventScroll:true});else if(state.phase==='done')$('#next').focus({preventScroll:true});else $('#stage [role="button"]')?.focus({preventScroll:true});}
function queueFor(p){const meta=catalog.find(x=>x.ref===p.ref);return Array.from({length:meta.variants},(_,i)=>`${p.ref}-${i+1}`);}
function render(){
  $('#lobby').hidden=true;$('#play').hidden=false;
  const text={...t(),stackMode,hitScale:Math.max(1,520/($('#stage').clientWidth||520))},q=effective();document.documentElement.lang=lang;$('.home-link').href='../../origami-studio/?lang='+lang;document.title='GFIELD '+text.title;$('#title').textContent=text.title;$('#choose').textContent=text.choose;$('#language').value=lang;$('#lobby').hidden=true;$('#play').hidden=false;$('#activityTitle').textContent=p.family==='number'?(p.askRemain?text.numberRemain:text.numberCut):lang==='ko'?p.title:text.families[familyKeys.indexOf(p.family)];$('#prompt').textContent=p.family==='stack'&&!p.build&&stackMode==='connect'&&state.phase!=='done'?text.connectPrompt:p.cutPlan&&state.phase==='work'?text.cutPrompt:p.cutPlan&&state.phase==='open'?text.cutOpen:text.prompts[state.phase];$('#hint').textContent=p.cutPlan&&state.phase==='work'?text.cutHint:state.phase==='collect'?(p.askRemain?text.collectRemain:text.collectCut):state.phase==='work'&&p.family==='sort'?text.cutEdges:state.phase==='turn'?text.sourcePaper:state.phase==='predict'?text.move:state.phase==='sort'?text.choosePiece:state.phase==='experiment'?text.trial:text.move;$('#progress').textContent=`${p.variant+1} / ${p.variants}`;$('#feedback').textContent=feedback;
  $('#stage').innerHTML=renderScene(q,state,text);$('#stage').dataset.phase=state.phase;$('#stage').dataset.stackMode=p.family==='stack'&&!p.build?stackMode:'';$('#stage').dataset.activity=p.id;$('#tools').innerHTML=toolsHtml(q,text);$('#undo').textContent=text.undo;$('#undo').disabled=!actions.length;$('#restart').textContent=text.restart;$('#worksheet').textContent=text.worksheet;
  const url=new URL('../../worksheet/paper-craft/',location.href);url.searchParams.set('ids',queueFor(p).join(','));url.searchParams.set('lang',lang);if(p.family==='stack'&&!p.build&&stackMode==='connect')url.searchParams.set('method','connect');
  if(p.design&&state.customMarks.length){url.searchParams.set('ids',p.id);url.searchParams.set('pattern',JSON.stringify(state.customMarks));}$('#worksheet').href=url.href;
  $('#next').hidden=state.phase!=='done';$('#next').textContent=p.variant+1<p.variants?text.next:text.again;
  if(state.phase==='calculate'){$('#sumInput').value=state.input;if(state.help)$('#helpLaunch').setAttribute('aria-expanded','true');}
}
function toolsHtml(q,text){
  const done='<div class="magic-done"><span aria-hidden="true">✦</span><strong>'+text.great+'</strong></div>';
  if(state.phase==='done'){
    if(p.family==='stack')return done+stackMethodsHtml(text)+stackOrderHtml(text);
    if(p.family==='sort')return done+`<div class="shape-baskets">${['triangle','rhombus'].map(shape=>`<div class="shape-basket"><span>${e(text[shape])}</span><strong>${Object.values(state.sorted).filter(x=>x===shape).length}</strong></div>`).join('')}</div>`;
    if(p.family==='number')return done+`<div class="number-basket"><h2>${e(text.sum)}</h2><strong class="final-sum">${p.answer}</strong><div class="tokens">${state.collected.map(id=>`<span>${p.numbers[id]}</span>`).join('')}</div></div>`;
    return done;
  }
  if(p.cutPlan)return cutPlanTools(p,state,text,selectedCut);
  if(state.phase==='choose-pattern')return `<h2>${e(text.goal)}</h2><div class="pattern-choices">${q.patternOptions.map((marks,i)=>`<button data-action="pattern" data-value="${i}" aria-label="${e(text.goal)} ${String.fromCharCode(65+i)}">${smallPaper(q.paperStages[0],marks,{id:'pattern-'+i})}<strong>${String.fromCharCode(65+i)}</strong></button>`).join('')}</div>`;
  if(state.phase==='predict'){
    const remaining=newMarks(q,state.opened).filter((_,i)=>!state.stamped.includes(i)),shapes=[...new Set(remaining.map(m=>m.shape))];if(!shapes.includes(selectedShape))selectedShape=shapes[0];
    return `<h2>${e(text.discover)}</h2><p>${state.stamped.length} / ${newMarks(q,state.opened).length}</p><div class="stamp-tools">${shapes.map(shape=>stampButton(shape,shape===selectedShape,text)).join('')}</div>`;
  }
  if(state.phase==='design'&&!['triangle','square'].includes(selectedShape))selectedShape='triangle';
  if(state.phase==='design')return `<h2>${e(text.tool)}</h2><div class="stamp-tools">${['triangle','square'].map(shape=>stampButton(shape,shape===selectedShape,text)).join('')}</div><p>${state.customMarks.length} / 3</p><button data-action="design-finish" ${state.customMarks.length?'':'disabled'}>${e(text.finishDesign)}</button>`;
  if(state.phase==='sort')return `<h2>${e(text.basket)}</h2><div class="shape-baskets">${['triangle','rhombus'].map(shape=>`<button data-bin="${shape}" class="shape-basket"><span>${e(text[shape])}</span><strong>${Object.values(state.sorted).filter(x=>x===shape).length}</strong></button>`).join('')}</div>`;
  if(state.phase==='collect'||state.phase==='calculate'){
    const numbers=state.collected.map(id=>p.numbers[id]);let help='';if(state.help){const plan=makeTenPlan(numbers),groups=plan.filter(s=>s.kind==='make-ten'),last=plan.at(-1);help=`<div class="ten-help"><p>${e(groups.length?text.ten:text.direct)}</p>${groups.map(g=>`<p>${g.contributions.map(c=>c.take).join(' + ')} = 10${g.contributions.filter(c=>c.after>0).map(c=>`<small>${c.before} = ${c.take} + ${c.after}</small>`).join('')}</p>`).join('')}<strong>${groups.length?`${last.tenCount*10} + ${last.remainder}`:numbers.join(' + ')} = ${last.total}</strong></div>`;}
    return `<div class="number-basket" data-basket="true"><h2>${e(text.basket)}</h2><div class="tokens">${numbers.map(n=>`<span>${n}</span>`).join('')}</div>${state.phase==='calculate'?`<form id="sumForm"><label for="sumInput">${e(text.sum)}</label><input id="sumInput" inputmode="numeric" type="text" maxlength="4" autocomplete="off"><button type="submit">${e(text.check)}</button></form><button id="helpLaunch" data-action="help" aria-expanded="${state.help}">${e(text.help)}</button>${help}`:''}</div>`;
  }
  if(p.family==='stack'){
    const placed=p.build?state.built:state.peeled;
    return `${stackMethodsHtml(text)}${p.build?`<div class="stack-goal"><h2>${e(text.goal)}</h2>${stackReference(p,text.goal)}</div>`:''}${p.conditionTop?`<p class="top-clue">${e(text.condition)}<strong>${p.conditionTop}</strong></p>`:''}${stackOrderHtml(text)}${stackMode==='connect'&&!p.build?'':`<h2>${e(text.paper)}</h2><div class="paper-inventory">${[...p.papers].sort((a,b)=>a.id.localeCompare(b.id)).map(paper=>`<button data-action="paper" data-value="${paper.id}" style="${stackMaterialStyle(paper.color)}" ${placed.includes(paper.id)?'disabled':''}>${paper.id}${placed.includes(paper.id)?' ✓':''}</button>`).join('')}</div>`}`;
  }
  if(p.family==='reverse'){
    const options=p.resultOptions||[{pieces:p.resultPieces,key:'goal'}];return `<h2>${e(text.target)}</h2><div class="target-cards">${options.map((option,i)=>`<button data-action="target" data-value="${i}" ${p.lineChoices?'disabled':''} aria-pressed="${state.target===i}" class="${state.resolved.includes(option.key)?'found':''}">${resultSvg(p,option)}${state.resolved.includes(option.key)?'<span aria-label="'+e(text.great)+'">✓</span>':''}</button>`).join('')}</div><div class="crease-tools">${(p.lineChoices||p.creaseHints).map((_,i)=>`<button data-action="trial" data-value="${i}" aria-pressed="${state.trial?.line===i}">${e(text.tryFold)} ${i+1}</button>`).join('')}</div><div class="claims"><button data-action="claim" data-value="yes" ${state.trial?'':'disabled'}>${e(text.yes)}</button>${p.resultOptions?`<button data-action="claim" data-value="no" ${state.trial&&state.tries.length===p.creaseHints.length?'':'disabled'}>${e(text.no)}</button>`:''}</div>`;
  }
  return `<div class="paper-journal"><h2>${e(text.families[familyKeys.indexOf(p.family)])}</h2><ol>${p.folds.map((_,i)=>`<li class="${state.fold>i?'passed':''}">${i+1}<span aria-hidden="true">${state.fold>i?'✓':''}</span></li>`).join('')}</ol>${state.phase==='work'?`<p>${state.worked.length} / ${p.cuts?.length||p.marks.length}</p>`:''}</div>`;
}
function stackMethodsHtml(text){return `${!p.build?`<div class="stack-methods"><button data-stack-mode="peel" aria-pressed="${stackMode==='peel'}">${e(text.peelMethod)}</button><button data-stack-mode="connect" aria-pressed="${stackMode==='connect'}">${e(text.connectMethod)}</button></div>`:''}`;}

function stackOrderHtml(text){
  const placed=p.build?state.built:state.peeled,label=p.build?text.bottomToTop:text.topToBottom;
  return `<section class="stack-order" aria-label="${e(label)}"><h2>${e(label)} <small>${placed.length} / ${p.papers.length}</small></h2><ol class="order-trail" aria-label="${e(label)}">${p.papers.map((_,i)=>{const paper=p.papers.find(paper=>paper.id===placed[i]);return `<li class="${paper?'filled':i===placed.length?'current':''}" ${paper?`style="${stackMaterialStyle(paper.color)}"`:''} ${i===placed.length?'aria-current="step"':''}><small>${i+1}</small><span>${paper?paper.id:'·'}</span></li>`;}).join('')}</ol><p>${e(state.phase==='done'?text.orderDone:!p.build&&stackMode==='connect'?text.connectHint:text.orderHint)}</p></section>`;
}

function stampButton(shape,selected,text){let graphic=shape==='triangle'?'<path d="M25 5L45 42H5Z"/>':shape==='circle'?'<circle cx="25" cy="25" r="18"/>':shape==='L'?'<path d="M5 5H22V28H45V45H5Z"/>':shape==='rhombus'?'<path d="M25 3L47 25L25 47L3 25Z"/>':'<rect x="7" y="7" width="36" height="36"/>';if(shape==='other'){const m=effective().markStages.flat().find(m=>m.shape===shape);if(m?.poly){const b=box(m.poly),scale=40/Math.max(b.right-b.left,b.bottom-b.top);graphic=`<polygon points="${m.poly.map(q=>`${5+(q.x-b.left)*scale},${5+(q.y-b.top)*scale}`).join(' ')}"/>`;}}return `<button data-shape="${shape}" aria-pressed="${selected}" aria-label="${e(text[shape]||shape)}"><svg viewBox="0 0 50 50" aria-hidden="true">${graphic}</svg><span>${e(text[shape]||shape)}</span></button>`;}
function pointInPaper(event){const svg=$('#stage .craft-svg'),g=$('#stage .paper-world');if(!svg||!g)return null;const point=svg.createSVGPoint();point.x=event.clientX;point.y=event.clientY;return point.matrixTransform(g.getScreenCTM().inverse());}
function stampAt(point){
  if(!point)return;
  if(p.cutPlan&&state.phase==='work')return perform('place-cut',{index:selectedCut,x:point.x,y:point.y});
  if(state.phase==='design')return perform('design',{shape:selectedShape,x:point.x,y:point.y});
  if(state.phase!=='predict')return;
  const marks=newMarks(effective(),state.opened),candidates=marks.map((m,i)=>({m,i,a:markAnchor(m)})).filter(x=>!state.stamped.includes(x.i)&&x.m.shape===selectedShape).sort((a,b)=>Math.hypot(a.a.x-point.x,a.a.y-point.y)-Math.hypot(b.a.x-point.x,b.a.y-point.y));
  const best=candidates[0],r=22*Math.max(1,520/$('#stage').clientWidth)/Number($('#stage .paper-world').dataset.frameScale);if(best&&Math.hypot(best.a.x-point.x,best.a.y-point.y)<r)perform('predict',best.i);else perform('predict',-1);
}
function connectAlong(a,b){
  if(state.phase!=='peel')return;
  const radius=22.25*520/($('#stage').clientWidth||520)/480;
  for(const id of papersOnStroke(p,a,b,radius)){
    if(state.peeled.includes(id))continue;
    if(gesture?.rejected===id)continue;
    const before=state.peeled.length;perform('paper',id);
    if(state.peeled.length===before){if(gesture)gesture.rejected=id;break;}
    if(gesture)gesture.rejected=null;
  }
}

async function foldMotion(){
  if(busy)return;const type=state.phase==='open'?'open':'fold';if(!['fold','open'].includes(state.phase))return;const motion=renderMotion(effective(),state);busy=true;$('#stage').innerHTML=motion.html;const flap=$('#stage .physical-flap'),start=type==='open'?motion.angle:0,end=type==='open'?0:motion.angle;
  try{await flap.animate([{transform:`rotate3d(${motion.axis},${start}deg)`},{transform:`rotate3d(${motion.axis},${end}deg)`}],{duration:matchMedia('(prefers-reduced-motion: reduce)').matches?0:620,easing:'cubic-bezier(.3,.05,.2,1)',fill:'forwards'}).finished;}catch{}busy=false;perform(type);
}
function handleAction(node){const type=node.dataset.action,value=node.dataset.value;const parsed=['work','collect','discover','trial','target','pattern'].includes(type)?Number(value):value??null;if(type==='fold'||type==='open')return foldMotion();if(type==='collect')return perform(type,parsed);perform(type,parsed);}
document.addEventListener('click',event=>{
  if(busy||Date.now()<suppressClickUntil&&event.detail!==0&&suppressClickPoint&&Math.hypot(event.clientX-suppressClickPoint.x,event.clientY-suppressClickPoint.y)<4)return;const node=event.target.closest('[data-cut-tool],button[data-stack-mode],[data-action],[data-family],[data-id],[data-shape],[data-bin],[data-piece]');
  if(node){if(node.matches('[disabled]'))return;if(node.dataset.cutTool!==undefined){selectedCut=Number(node.dataset.cutTool);keyboardCursor=null;return render();}if(node.dataset.stackMode){stackMode=node.dataset.stackMode;params.set('method',stackMode);history.replaceState(null,'','?'+params);gesture=null;render();return;}if(node.dataset.family)return lobby(node.dataset.family);if(node.dataset.id)return open(node.dataset.id);if(node.dataset.shape){selectedShape=node.dataset.shape;return render();}if(node.dataset.piece){document.querySelectorAll('.selected-piece').forEach(e=>e.classList.remove('selected-piece'));selectedPiece=node.dataset.piece;$('#stage [data-piece="'+selectedPiece+'"]').classList.add('selected-piece');return;}if(node.dataset.bin){if(selectedPiece!==null)perform('sort',{id:selectedPiece,shape:node.dataset.bin});return;}return handleAction(node);}
  if(event.target.closest('[data-predict-surface],[data-design-surface],[data-cut-surface]'))stampAt(p.cutPlan&&event.detail===0?(keyboardCursor||polygonCentroid(currentPaper(p,state).poly)):pointInPaper(event));
});
document.addEventListener('keydown',event=>{
  if(!event.target.matches('[data-predict-surface],[data-design-surface],[data-cut-surface]'))return;
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(event.key))return;event.preventDefault();const poly=currentPaper(effective(),state).poly,b=box(poly),step=Math.max(b.right-b.left,b.bottom-b.top)/(p.cutPlan?(event.shiftKey?100:20):14);
  if(!keyboardCursor)keyboardCursor=polygonCentroid(poly);
  if(['Enter',' '].includes(event.key)){stampAt(keyboardCursor);return;}
  const next={x:keyboardCursor.x+(event.key==='ArrowRight'?step:event.key==='ArrowLeft'?-step:0),y:keyboardCursor.y+(event.key==='ArrowDown'?step:event.key==='ArrowUp'?-step:0)};if(inside(poly,next))keyboardCursor=next;
  $('#stage .keyboard-cursor')?.remove();const ring=document.createElementNS('http://www.w3.org/2000/svg','circle');ring.setAttribute('class','keyboard-cursor');ring.setAttribute('cx',keyboardCursor.x);ring.setAttribute('cy',keyboardCursor.y);ring.setAttribute('r',16/Number($('#stage .paper-world').dataset.frameScale));ring.setAttribute('fill','none');ring.setAttribute('stroke','#a33d70');ring.setAttribute('stroke-width',3/Number($('#stage .paper-world').dataset.frameScale));ring.setAttribute('pointer-events','none');$('#stage .paper-world').append(ring);
});
document.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.target.matches('g[role="button"]')){event.preventDefault();if(event.target.dataset.piece){selectedPiece=event.target.dataset.piece;event.target.classList.add('selected-piece');}else handleAction(event.target);}});
$('#stage').addEventListener('pointerdown',event=>{if(busy)return;if(p?.family==='stack'&&!p.build&&stackMode==='connect'&&state.phase==='peel'){const point=pointInPaper(event);if(!point)return;event.preventDefault();gesture={connect:true,lastPoint:point};$('#stage').setPointerCapture(event.pointerId);connectAlong(point,point);return;}const node=event.target.closest('[data-action="fold"],[data-action="open"],[data-piece],[data-action="collect"],[data-action="paper"]');if(!node)return;gesture={node,x:event.clientX,y:event.clientY,action:node.dataset.action,piece:node.dataset.piece,value:node.dataset.value};$('#stage').setPointerCapture(event.pointerId);});
$('#stage').addEventListener('pointermove',event=>{if(!gesture)return;if(gesture.connect){const point=pointInPaper(event);if(point){connectAlong(gesture.lastPoint,point);if(gesture)gesture.lastPoint=point;}return;}const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;if(Math.hypot(dx,dy)>8){gesture.dragged=true;if(!['fold','open'].includes(gesture.action)){const scale=$('#stage .paper-world')?.getScreenCTM()?.a||480;gesture.node.style.transform=`translate(${dx/scale}px,${dy/scale}px)`;gesture.node.classList.add('dragging');}}});
$('#stage').addEventListener('pointerup',event=>{const g=gesture;gesture=null;if(!g)return;if(g.connect){event.preventDefault();suppressClickUntil=Date.now()+400;suppressClickPoint={x:event.clientX,y:event.clientY};return;}event.preventDefault();suppressClickUntil=Date.now()+400;suppressClickPoint={x:event.clientX,y:event.clientY};if(!g.dragged){if(g.piece){selectedPiece=g.piece;g.node.classList.add('selected-piece');}else handleAction(g.node);return;}const target=document.elementFromPoint(event.clientX,event.clientY);if(g.piece&&target?.closest('[data-bin]'))perform('sort',{id:g.piece,shape:target.closest('[data-bin]').dataset.bin});else if(g.action==='collect'&&target?.closest('[data-basket]'))perform('collect',Number(g.value));else if(g.action==='paper'&&Math.hypot(event.clientX-g.x,event.clientY-g.y)>40)perform('paper',g.value);else if(['fold','open'].includes(g.action)){const opening=g.action==='open',f=p.folds[opening?p.folds.length-state.opened-1:state.fold],dx=event.clientX-g.x,dy=event.clientY-g.y;if((dx*f.nx+dy*f.ny)*f.moving*(opening?1:-1)>15)foldMotion();else{render();$('#feedback').textContent=t().tryAgain;}}else render();});
$('#stage').addEventListener('pointercancel',()=>{gesture=null;render();});
document.addEventListener('submit',event=>{if(event.target.id!=='sumForm')return;event.preventDefault();const value=$('#sumInput').value;perform('input',value);perform('sum');if(state.phase==='calculate')$('#sumInput').focus();});
document.addEventListener('input',event=>{if(event.target.id!=='sumInput')return;const result=act(effective(),state,'input',event.target.value);if(result.accepted){state=result.state;actions.push(['input',event.target.value]);save();}});
$('#undo').addEventListener('click',()=>{if(busy||!actions.length)return;actions.pop();state=restoreSession(p,actions).state;selectedPiece=null;save();render();});
$('#restart').addEventListener('click',()=>{if(busy)return;p=buildActivity(p.id);state=freshSession(p);actions=[];selectedCut=0;save();render();});
$('#next').addEventListener('click',()=>p.variant+1<p.variants?open(`${p.ref}-${p.variant+2}`):lobby(p.family));
$('#choose').addEventListener('click',()=>{if(!busy)lobby();});
$('#language').addEventListener('change',()=>{lang=$('#language').value;params.set('lang',lang);history.replaceState(null,'','?'+params);if(p&&!$('#play').hidden)render();else lobby();});
if(params.get('id'))open(params.get('id'));else lobby();

let resizeFrame;window.addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>{if(p&&!busy&&!gesture&&!$('#play').hidden)render();});});

let inventoryGesture=null;
document.addEventListener('pointerdown',event=>{
  const node=event.target.closest('.paper-inventory button');if(!node||node.disabled||!['build','peel'].includes(state?.phase)||busy)return;
  inventoryGesture={node,id:node.dataset.value,x:event.clientX,y:event.clientY,dragged:false,ghost:null};node.setPointerCapture(event.pointerId);
});
document.addEventListener('pointermove',event=>{
  const g=inventoryGesture;if(!g)return;
  if(Math.hypot(event.clientX-g.x,event.clientY-g.y)>8&&!g.ghost){g.dragged=true;g.ghost=document.createElement('div');g.ghost.className='inventory-ghost';g.ghost.textContent=g.id;for(const prop of ['--paper','--paper-light','--paper-deep','--paper-ink'])g.ghost.style.setProperty(prop,g.node.style.getPropertyValue(prop));document.body.append(g.ghost);}
  if(g.ghost){g.ghost.style.left=event.clientX+'px';g.ghost.style.top=event.clientY+'px';}
});
document.addEventListener('pointerup',event=>{
  const g=inventoryGesture;inventoryGesture=null;if(!g)return;g.ghost?.remove();if(!g.dragged)return;
  event.preventDefault();suppressClickUntil=Date.now()+400;suppressClickPoint={x:event.clientX,y:event.clientY};
  if(document.elementFromPoint(event.clientX,event.clientY)?.closest('#stage,.stack-order'))perform('paper',g.id);
});
document.addEventListener('pointercancel',()=>{inventoryGesture?.ghost?.remove();inventoryGesture=null;});
