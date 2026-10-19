import {holesAt,cutKeysFor,visibleIds} from '../../games/number-paper/activity-model.js?v=3';
import {solutionFor,targetCells,finalEquation} from './workbook-core.js?v=1';
import {directionLabel} from './i18n.js?v=1';
export const escapeHtml=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHtml;
function arrow(dir){
  const horizontal=['up','down'].includes(dir),d=horizontal?'M16 88C92 88 92 55 28 12M29 34L27 11L49 15':'M85 85C85 45 55 35 15 35M32 24L14 35L32 46';
  const transform=dir==='down'?'rotate(180 50 50)':dir==='right'?'translate(100 0) scale(-1 1)':'';
  return `<svg x="160" y="57" width="34" height="52" viewBox="0 0 100 100" preserveAspectRatio="none"><path transform="${transform}" d="${d}" fill="none" stroke="#2456c4" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
export function paperSvg(p,{stage=0,blank=false,target=false,opened=false,foldArrow=false}={}){
  const ids=visibleIds(p,stage),rows=ids.map(id=>Math.floor(id/4)),cols=ids.map(id=>id%4),r0=Math.min(...rows),c0=Math.min(...cols),nr=Math.max(...rows)-r0+1,nc=Math.max(...cols)-c0+1;
  const unit=36,x0=10+(4-nc)*18,y0=10+(4-nr)*18,chosen=new Set(target?targetCells(p):[]),holes=opened?holesAt(p,cutKeysFor(p),stage):new Set();
  let s=`<svg class="paper-diagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 166" role="img"><defs><pattern id="hatch-${p.id}-${stage}" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#fff"/><path d="M-2 2L2-2M0 7L7 0M5 9L9 5" stroke="#5e3542" stroke-width="1.8"/></pattern></defs>`;
  for(const id of ids){
    if(holes.has(id))continue;
    const r=Math.floor(id/4),c=id%4,x=x0+(c-c0)*unit,y=y0+(r-r0)*unit;
    const cut=stage===2&&p.cells.some(cell=>cell.r===r-p.packetRow&&cell.c===c-p.packetCol);
    const fill=blank?'#fff':target?(chosen.has(id)?'#dcebf9':'#fff'):cut?`url(#hatch-${p.id}-${stage})`:'#fff5d9';
    s+=`<rect x="${x}" y="${y}" width="${unit}" height="${unit}" fill="${fill}" stroke="#40546b" stroke-width="1.2"/>`;
    if(!stage&&!blank)s+=`<text x="${x+18}" y="${y+25}" text-anchor="middle" font-family="SUIT,sans-serif" font-size="22" font-weight="700" fill="${target&&!chosen.has(id)?'#79828d':'#182230'}">${p.grid[r][c]}</text>`;
    if(target&&chosen.has(id))s+=`<rect x="${x+3}" y="${y+3}" width="30" height="30" fill="none" stroke="#2456c4" stroke-width="2"/>`;
  }
  if(foldArrow){
    s+=stage===0?'<path d="M10 82H154" stroke="#566274" stroke-dasharray="5 4" stroke-width="1.5"/>':`<path d="M82 ${y0}V${y0+nr*36}" stroke="#566274" stroke-dasharray="5 4" stroke-width="1.5"/>`;
    s+=arrow(stage===0?p.hDir:p.vDir);
  }
  return s+'</svg>';
}
const accessible=(svg,label)=>svg.replace('role="img"',`role="img" aria-label="${e(label)}"`);
const figure=(label,svg)=>`<figure><figcaption>${e(label)}</figcaption>${svg}</figure>`;
export const questionFigures=(p,t)=>[
  {label:t.first+' · ① '+directionLabel(p,true,t),svg:accessible(paperSvg(p,{foldArrow:true}),t.first+': '+p.grid.map(row=>row.join(', ')).join('; ')+'. '+directionLabel(p,true,t))},
  {label:t.fold1+' · ② '+directionLabel(p,false,t),svg:accessible(paperSvg(p,{stage:1,foldArrow:true}),t.fold1+'. '+directionLabel(p,false,t))},
  {label:t.fold2,svg:accessible(paperSvg(p,{stage:2}),t.fold2+': '+p.cells.map(c=>`${c.r+1},${c.c+1}`).join('; '))},
  {label:t.predict,svg:accessible(paperSvg(p,{blank:true}),t.predict+' 4 × 4')}
];
export const answerFigures=(p,t)=>[{label:t.undo2,svg:accessible(paperSvg(p,{stage:1,opened:true}),t.undo2)},{label:t.undo1,svg:accessible(paperSvg(p,{target:true}),t.undo1)}];
function question(p,n,t){
  return `<article class="worksheet-card" data-problem-id="${p.id}"><h2>${n}. ${e(t[p.activity])}</h2><p class="instruction">${e(p.activity==='cut'?t.promptCut:t.promptRemain)}</p><div class="fig-row">${questionFigures(p,t).map(f=>figure(f.label,f.svg)).join('')}</div><p class="calculation-prompt">${e(t.calc)}</p><div class="working"><span>${e(t.working)}</span><i></i><i></i></div><p class="sum-space">${e(t.sum)} <span></span></p></article>`;
}
function answer(p,n,t){
  const sol=solutionFor(p),finish=sol.finish;
  const groups=sol.groups.map(g=>`<li>${g.terms.join(' + ')} = 10${g.splits.map(parts=>` <small>(${e(t.split)}: ${parts[0]} = ${parts[1]} + ${parts[2]})</small>`).join('')}</li>`).join('');
  return `<article class="worksheet-card solution" data-problem-id="${p.id}" data-answer="${sol.answer}"><h2>${n}. ${e(t[p.activity])} <strong>${e(t.answer)} ${sol.answer}</strong></h2><p class="instruction">${e(t.hint)}</p><div class="solution-body"><div class="solution-pictures">${answerFigures(p,t).map(f=>figure(f.label,f.svg)).join('')}</div><div class="solution-math"><p><b>${e(t.basket)}</b><br>${sol.numbers.join(' + ')}</p><p><b>${e(sol.groups.length?t.makeTen:t.direct)}</b></p><ul>${groups}</ul><p class="final-equation">${e(finalEquation(sol))}</p></div></div></article>`;
}
export function renderPages(plan,entries,t,name=''){
  return plan.map(page=>{
    if(page.kind==='blank')return '<section class="sheet duplex-blank" aria-label="duplex blank page"></section>';
    const title=page.kind==='questions'?t.title:page.kind==='quick'?t.quickTitle:t.teacher;
    const body=page.kind==='quick'?`<table class="quick-table"><thead><tr><th>${e(t.question)}</th><th>${e(t.activity)}</th><th>${e(t.answer)}</th></tr></thead><tbody>${page.entries.map(p=>`<tr data-problem-id="${p.id}"><td>${entries.indexOf(p)+1}</td><td>${e(t[p.activity])}</td><td>${solutionFor(p).answer}</td></tr>`).join('')}</tbody></table>`:page.entries.map(p=>(page.kind==='questions'?question:answer)(p,entries.indexOf(p)+1,t)).join('');
    return `<section class="sheet" data-kind="${page.kind}"><header class="sheet-header"><div><b class="gfield">GFIELD</b><h1>${e(title)}</h1></div><p>${e(t.name)} ${e(name)||'____________'}　 ${e(t.date)} __________</p></header><div class="sheet-body">${body}</div><footer class="sheet-footer"><span>GFIELD · PAPER THINKING</span><b>${page.number} / ${page.total}</b></footer></section>`;
  }).join('');
}
