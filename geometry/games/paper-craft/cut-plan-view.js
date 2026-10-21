import {paperSurface,polygonPath,escapeHtml as e} from '../../shared/paper-craft-svg.js?v=20261021-4';
import {box} from '../../shared/paper-craft-model.js?v=20261018-3';
import {cutAnchor} from '../../shared/paper-craft-cut-plan.js?v=20261021-4';

function picture(poly,marks,id,question=false,fixed=false,layers=1){
  const b=box(poly),v=fixed?{left:0,top:0,right:1,bottom:1}:b,m=Math.max(v.right-v.left,v.bottom-v.top)*.08;
  return `<svg viewBox="${v.left-m} ${v.top-m} ${v.right-v.left+2*m} ${v.bottom-v.top+2*m}" aria-hidden="true">${fixed?'<path d="M0 0H1V1H0Z" fill="none" stroke="#78929e" stroke-width=".018" stroke-dasharray=".05 .04"/>':''}${paperSurface(poly,{marks,id,layers})}${question?`<text x="${(b.left+b.right)/2}" y="${(b.top+b.bottom)/2}" dominant-baseline="middle" text-anchor="middle" font-size="${Math.min(b.right-b.left,b.bottom-b.top)*.45}" fill="#324960">?</text>`:''}</svg>`;
}
export function cutPlanTools(p,s,t,selected){
  const packet=p.paperStages.at(-1),steps=[picture(p.paperStages[0],[],'flow-start'),picture(packet,[],'flow-fold',false,true,p.depths.at(-1).max),picture(packet,[],'flow-think',true,true,p.depths.at(-1).max),picture(p.paperStages[0],p.markStages.at(-1),'flow-result')];
  const flow=`<ol class="cut-process" aria-label="${e(t.cutProcess)}">${steps.map((pic,i)=>`<li>${pic}<span>${e(t.cutSteps[i])}</span></li>`).join('')}</ol>`;
  const goal=`<section class="cut-goal"><h2>${e(t.cutGoal)}</h2>${picture(p.paperStages[0],p.markStages.at(-1),'cut-goal')}</section>`;
  if(s.phase!=='work')return flow+goal;
  const tools=p.marks.map((m,i)=>{
    const a=cutAnchor(m),shape=m.kind==='circle'?`<circle cx="0" cy="0" r="${m.radius}"/>`:`<path d="${polygonPath(m.poly.map(q=>({x:q.x-a.x,y:q.y-a.y})))}"/>`,b=m.kind==='circle'?{left:-m.radius,top:-m.radius,right:m.radius,bottom:m.radius}:box(m.poly.map(q=>({x:q.x-a.x,y:q.y-a.y}))),span=Math.max(b.right-b.left,b.bottom-b.top)*1.2;
    return `<button data-cut-tool="${i}" aria-pressed="${i===selected}" aria-label="${e(t.cutTool)} ${i+1}"><svg viewBox="${(b.left+b.right-span)/2} ${(b.top+b.bottom-span)/2} ${span} ${span}" aria-hidden="true">${shape}</svg><span>${i+1}${s.cutPlacements[i]?' ✓':''}</span></button>`;
  }).join('');
  return flow+goal+`<p class="cut-instruction">${e(t.cutPlace)}</p><div class="cut-tools">${tools}</div><button data-action="cut-check" ${p.marks.every((_,i)=>s.cutPlacements[i])?'':'disabled'}>${e(t.cutCheck)}</button>`;
}
