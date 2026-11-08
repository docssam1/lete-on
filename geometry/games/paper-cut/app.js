import {bank,anchors,piecesAfter,tally,split,candidate,solutions,center} from './model.js?v=straight-cut-1';
import {copy,shapeKey,firstCutPrompt,answerCopy} from './copy.js?v=straight-cut-2';
import {icon} from '../shape-transform/ui-icons.js';
import {createMaterialAudio,bindMaterialAudioButton} from '../../shared/material-audio.js?v=material-2';
const lang=Object.hasOwn(copy,localStorage.getItem('gfield-language'))?localStorage.getItem('gfield-language'):'ko',c=copy[lang],a=answerCopy[lang],SAVE='gfield-straight-paper-cut-v1';
document.documentElement.lang=lang;document.title=`GFIELD · ${c.title}`;
let saved;try{saved=JSON.parse(localStorage.getItem(SAVE)||'{}');}catch{saved={};}
if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
saved.positions||={};saved.completed=Array.isArray(saved.completed)?saved.completed:[];
const requested=new URLSearchParams(location.search).get('type');
let type=Object.hasOwn(bank,requested)?requested:'count',index=0,task,state,training=false,snapshot=null;
const audio=createMaterialAudio(),root=document.querySelector('#app');
root.innerHTML=`<header><a class="tool back" href="../../origami-studio/" title="${c.back}" aria-label="${c.back}">${icon('back')}</a><div class="brand"><small>GFIELD · PAPER</small><h1>${c.title}</h1></div><a class="tool" href="../../worksheet/paper-cut/" title="${c.sheet}" aria-label="${c.sheet}">${icon('book')}</a><button class="tool help" title="${c.help}" aria-label="${c.help}">?</button><button class="tool sound"></button></header><nav class="types" role="tablist">${['count','make'].map(t=>`<button role="tab" data-type="${t}">${c[t]}</button>`).join('')}</nav><section class="mission"><div><h2 class="prompt"></h2><p class="instruction"></p></div><p class="progress"></p></section><section class="game"><div class="stage"><div class="board"><svg class="paper-board" viewBox="-20 -20 140 140" role="group" aria-label="${c.draw}"></svg><div class="points"></div></div></div><aside class="info"><h3 class="answer-title">${a.answer}</h3><div class="goals"></div><div class="number-pad" aria-label="${a.answer}">${Array.from({length:10},(_,n)=>`<button type="button" data-digit="${n}">${n}</button>`).join('')}<button type="button" class="clear-key" title="${a.clear}" aria-label="${a.clear}">${icon('retry')}</button></div><div class="coach"><div class="speech-bubble"><p class="message" role="status" aria-live="polite"></p><p class="coach-guide"></p></div><img src="../../world-map/assets/foldy-character.webp" alt="${a.name}" width="140" height="140"></div></aside></section><footer><button class="tool retry" title="${c.retry}" aria-label="${c.retry}">${icon('retry')}</button><button class="tool undo" title="${c.undo}" aria-label="${c.undo}">${icon('back')}</button><button class="tool hint" title="${c.hint}" aria-label="${c.hint}">${icon('hint')}</button><button class="check">${c.check}</button><button class="next" hidden>${c.next}</button></footer>`;
const $=selector=>root.querySelector(selector),svg=$('.paper-board'),points=$('.points');
$('.answer-title').after($('.clear-key'));
bindMaterialAudioButton($('.sound'),audio,()=>lang);
const fresh=()=>({first:null,cut:null,separated:type==='count',solved:false,values:{3:null,4:null,5:null},active:type==='count'?Number(Object.keys(tally(piecesAfter(task.cuts)))[0]):null,hint:null});
function write(){if(training)return;saved.positions[type]=index;try{localStorage.setItem(SAVE,JSON.stringify(saved));}catch{}}
function load(){const position=saved.positions[type];index=Number.isInteger(position)&&position>=0&&position<bank[type].length?position:0;task=bank[type][index];state=fresh();render();write();}
function paint(){
 const colors=[['#ffea80','#e2b546'],['#efb8d7','#b979a4'],['#a9d9e8','#679fb9'],['#b8dfc8','#6fa386']][index%4];
 const pieces=state.separated?piecesAfter([...task.cuts,...(state.cut?[state.cut]:[])]):piecesAfter([]);
 const selected=state.first===null?null:anchors[state.first];
 const lineMarkup=(cut,cls)=>`<path class="${cls}" d="M${cut[0].x*100} ${cut[0].y*100}L${cut[1].x*100} ${cut[1].y*100}"/>`;
 svg.innerHTML=`<defs><linearGradient id="sheet" x2=".8" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".55" stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx=".3" dy="1" stdDeviation=".6" flood-opacity=".25"/></filter></defs>${pieces.map((piece,i)=>{const at=center(piece),dx=state.separated?(at.x-.5)*17:0,dy=state.separated?(at.y-.5)*17:0;return `<g class="piece" data-piece="${i}" transform="translate(${dx} ${dy})" filter="url(#shadow)"><polygon points="${piece.map(p=>`${p.x*100},${p.y*100}`).join(' ')}" fill="url(#sheet)" stroke="${colors[1]}" stroke-width=".65"/>${state.separated&&state.solved?`<text x="${at.x*100}" y="${at.y*100}" class="piece-label">${i+1}</text>`:''}</g>`;}).join('')}${!state.separated?task.cuts.map(cut=>lineMarkup(cut,'existing-cut')).join(''):''}${type==='count'&&!state.separated?task.cuts.map(cut=>lineMarkup(cut,'cut-hit')).join(''):''}${state.hint&&!state.separated?lineMarkup(state.hint,'example-cut'):''}${selected?`<circle cx="${selected.x*100}" cy="${selected.y*100}" r="2" class="selected-point"/>`:''}`;
 points.innerHTML=type==='make'&&!state.separated?anchors.map((point,i)=>`<button class="edge-point" data-point="${i}" style="left:${(point.x*100+20)/1.4}%;top:${(point.y*100+20)/1.4}%" aria-label="${c.draw} ${i+1}" aria-pressed="${state.first===i}"><span></span></button>`).join(''):'';
 svg.querySelectorAll('.cut-hit').forEach(node=>{node.setAttribute('role','button');node.setAttribute('tabindex','0');node.setAttribute('aria-label',c.cut);node.addEventListener('click',performCountCut);node.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();performCountCut();}});});
 points.querySelectorAll('button').forEach(button=>button.addEventListener('click',event=>{if(event.detail===0)choosePoint(Number(button.dataset.point));}));
 root.dataset.phase=state.solved?'solved':state.separated?'answer':state.first===null?'ready':'endpoint';root.dataset.task=task.id;root.dataset.training=String(training);
}
function render(){
 for(const button of root.querySelectorAll('[data-type]')){button.setAttribute('aria-selected',String(button.dataset.type===type));button.tabIndex=button.dataset.type===type?0:-1;}
 $('.progress').textContent=training?c.practice:`${index+1} / ${bank[type].length}`;
 root.dataset.type=type;
 $('.prompt').textContent=type==='count'?a.problem:!task.cuts.length?firstCutPrompt[lang]:c.makePrompt;
 $('.instruction').textContent=type==='count'?a.question:state.separated?'':state.first===null?c.first:c.second;
 const fields=Object.keys(tally(piecesAfter(task.cuts)));
 $('.goals').innerHTML=type==='make'?`<h3>${c.target}</h3>${Object.entries(task.target).map(([n,count])=>`<div class="goal"><span>${c[shapeKey[n]]}</span><strong>${count}</strong><small>${a.unit}</small></div>`).join('')}`:fields.map(n=>`<button type="button" class="total-display${state.active===Number(n)?' active':''}" data-count="${n}" aria-pressed="${state.active===Number(n)}" ${state.solved?'disabled':''}><span>${c[shapeKey[n]]}</span><strong>${state.values[n]??'?'}</strong><small>${a.unit}</small></button>`).join('');
 $('.message').textContent=state.solved?c.correct:'';
 $('.check').hidden=type!=='count'||!state.separated||state.solved;
 $('.number-pad').hidden=type!=='count';$('.answer-title').textContent=type==='count'?a.answer:c.target;
 $('.clear-key').hidden=type!=='count';$('.clear-key').disabled=state.solved;
 $('.coach-guide').textContent=state.solved?c.correct:type==='count'?a.choose:state.separated?c.again:state.first===null?c.first:c.second;
 for(const button of $('.number-pad').querySelectorAll('button'))button.disabled=state.solved;
 $('.next').hidden=!state.solved;$('.next').textContent=training?c.return:index===bank[type].length-1?c.complete:c.next;
 $('.retry').disabled=type==='count'?!Object.values(state.values).some(value=>value!==null):!state.separated&&state.first===null&&!state.hint;$('.undo').disabled=state.first===null||state.separated;
 $('.hint').disabled=state.separated||type!=='make';
 $('.retry').title=type==='count'?a.clear:c.retry;$('.retry').setAttribute('aria-label',$('.retry').title);
 $('.goals').querySelectorAll('[data-count]').forEach(button=>button.addEventListener('click',()=>{state.active=Number(button.dataset.count);render();$('.goals [data-count="'+state.active+'"]').focus();}));
 paint();
}
function solved(){state.solved=true;if(!training&&!saved.completed.includes(task.id)){saved.completed.push(task.id);write();}render();}
function performCountCut(){if(state.separated)return;state.separated=true;audio.play('paper-grab');render();}
function choosePoint(i){
 if(state.separated)return;
 if(state.first===null){state.first=i;audio.play('peg-touch');render();return;}
 if(state.first===i){state.first=null;render();return;}
 const cut=[anchors[state.first],anchors[i]],result=candidate(task,...cut);
 if(!result.changed){state.first=null;render();$('.message').textContent=c.notCut;return;}
 state.cut=cut;state.separated=true;state.first=null;audio.play('paper-grab');
 if(result.correct)solved();else{render();$('.message').textContent=c.again;}
}
$('.board').addEventListener('pointerdown',event=>{
 if(type!=='make'||state.separated)return;
 const box=$('.board').getBoundingClientRect(),distance=anchors.map((p,i)=>({i,d:Math.hypot(box.x+(p.x*100+20)*box.width/140-event.clientX,box.y+(p.y*100+20)*box.height/140-event.clientY)})).sort((a,b)=>a.d-b.d);
 if(distance[0].d<=24){event.preventDefault();choosePoint(distance[0].i);}
});
$('.check').addEventListener('click',()=>{const actual=tally(piecesAfter(task.cuts));if(Object.keys(actual).every(n=>state.values[n]===actual[n]))solved();else{$('.message').textContent=c.wrong;for(const button of $('.goals').querySelectorAll('[data-count]'))button.classList.toggle('wrong',state.values[button.dataset.count]!==actual[button.dataset.count]);}});
function enterDigit(digit){if(type!=='count'||state.solved||state.active===null)return;state.values[state.active]=digit;audio.play('peg-touch');render();}
$('.number-pad').querySelectorAll('[data-digit]').forEach(button=>button.addEventListener('click',()=>enterDigit(Number(button.dataset.digit))));
$('.clear-key').addEventListener('click',()=>{if(type!=='count'||state.solved)return;state.values[state.active]=null;render();});
document.addEventListener('keydown',event=>{if(event.ctrlKey||event.altKey||event.metaKey||event.repeat||type!=='count'||state.solved)return;if(/^\d$/.test(event.key)){event.preventDefault();enterDigit(Number(event.key));}else if(['Backspace','Delete'].includes(event.key)){event.preventDefault();state.values[state.active]=null;render();}else if(event.key==='Enter'&&event.target===document.body){event.preventDefault();$('.check').click();}});
$('.retry').addEventListener('click',()=>{state=fresh();render();});
$('.undo').addEventListener('click',()=>{state.first=null;render();});
$('.hint').addEventListener('click',()=>{state.hint=solutions(task)[0];render();$('.message').textContent=c.example;});
$('.next').addEventListener('click',()=>{if(!state.solved)return;if(training){({type,index,task,state}=snapshot);training=false;snapshot=null;render();return;}index=(index+1)%bank[type].length;task=bank[type][index];state=fresh();write();render();});
function changeType(next){training=false;snapshot=null;type=next;history.replaceState({},'',`?type=${type}`);load();}
root.querySelectorAll('[data-type]').forEach(button=>{button.addEventListener('click',()=>changeType(button.dataset.type));button.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight'].includes(event.key)){event.preventDefault();changeType(type==='count'?'make':'count');root.querySelector(`[data-type="${type}"]`).focus();}});});
$('.help').addEventListener('click',()=>{if(training){({type,index,task,state}=snapshot);training=false;snapshot=null;render();return;}snapshot={type,index,task,state:structuredClone(state)};training=true;task=bank[type][0];index=0;state=fresh();render();});
window.addEventListener('pagehide',()=>audio.destroy(),{once:true});
load();
