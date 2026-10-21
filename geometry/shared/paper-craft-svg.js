import {stackConnectionPoints} from './paper-craft-stack.js?v=20261019-1';
import {box,square,polygonCentroid,inside,reflectInk,boundaryLayers} from './paper-craft-model.js?v=20261018-3';
import {clipHalfPlane,reflectAcross,chordSegments,foldOnce} from '../games/paper-fold/reverse-fold.js?v=20261018-3';
import {newMarks,markAnchor,numberGroups,withDesign} from './paper-craft-session.js?v=20261021-4';
import {placedCut} from './paper-craft-cut-plan.js?v=20261021-4';
export const escapeHtml=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const points=poly=>poly.map(p=>`${p.x},${p.y}`).join(' ');
export const polygonPath=poly=>poly.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join('')+'Z';
export const markSvg=(m,attrs='')=>m.kind==='circle'?`<circle cx="${m.center.x}" cy="${m.center.y}" r="${m.radius}" ${attrs}/>`:`<path d="${polygonPath(m.poly)}" ${attrs}/>`;
export const colors=['#ffe394','#9ce0e8','#b8e6bc','#e6b8df','#bdbbfa','#ffc4a0','#a4d4fb','#d6e69b'];
// Screen materials are separate from the flat, economical worksheet inks.
export const stackMaterials=[
  {light:'#efd071',base:'#d6ab43',deep:'#bd9131',ink:'#30230d'},
  {light:'#238399',base:'#126b82',deep:'#0b4b64',ink:'#ffffff'},
  {light:'#278670',base:'#146b55',deep:'#0b493d',ink:'#ffffff'},
  {light:'#bc497d',base:'#9f3065',deep:'#741f4e',ink:'#ffffff'},
  {light:'#7c66b9',base:'#60499c',deep:'#422f75',ink:'#ffffff'},
  {light:'#bd643d',base:'#a7492b',deep:'#7a321f',ink:'#ffffff'},
  {light:'#397fba',base:'#255f9e',deep:'#183f75',ink:'#ffffff'},
  {light:'#7e913d',base:'#64772c',deep:'#46591b',ink:'#ffffff'},
];
export function stackMaterialStyle(color){const m=stackMaterials[color%stackMaterials.length];return `--paper:${m.base};--paper-light:${m.light};--paper-deep:${m.deep};--paper-ink:${m.ink}`;}
export function frame(poly){const b=box(poly),span=Math.max(b.right-b.left,b.bottom-b.top),scale=Math.min(350/span,1200),x=260-(b.left+b.right)/2*scale,y=238-(b.top+b.bottom)/2*scale;return {x,y,scale,transform:`translate(${x} ${y}) scale(${scale})`};}
const polygon=(poly,attrs='')=>`<path d="${polygonPath(poly)}" ${attrs}/>`;
const svg=(content,cls='')=>`<svg class="craft-svg ${cls}" viewBox="0 0 520 480" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
export function paperSurface(poly,{marks=[],cuts=[],layers=1,fill='#ffe394',numbers=null,physicalLayers=null,id='paper',glossy=false,gridSize=0}={}){
  const mask=`<mask id="${id}-holes" maskUnits="userSpaceOnUse" x="-1" y="-1" width="3" height="3"><path d="${polygonPath(poly)}" fill="white"/>${marks.map(m=>markSvg(m,'fill="black"')).join('')}${cuts.map(s=>`<path d="M${s[0].x} ${s[0].y}L${s[1].x} ${s[1].y}" fill="none" stroke="black" stroke-width=".004"/>`).join('')}</mask>`;
  const depth=Math.min(layers,16),side=physicalLayers?boundaryLayers(poly,physicalLayers,marks).map(edge=>{const dz=(edge.layers-1)*.002;if(!dz)return '';const {a,b}=edge;return polygon([a,b,{x:b.x+dz,y:b.y+dz},{x:a.x+dz,y:a.y+dz}],'fill="#c89544" stroke="#9a712d" stroke-width=".001"')+Array.from({length:edge.layers-1},(_,i)=>`<path d="M${a.x+(i+1)*.002} ${a.y+(i+1)*.002}L${b.x+(i+1)*.002} ${b.y+(i+1)*.002}" stroke="#9a712d" stroke-width=".0006"/>`).join('');}).join(''):'';
  const stack=physicalLayers?side+polygon(poly,`fill="${fill}" stroke="#b98c47" stroke-width=".002" mask="url(#${id}-holes)"`):Array.from({length:depth},(_,i)=>depth-1-i).map(i=>polygon(poly,`fill="${i?'#c89544':fill}" stroke="${i?'#9a712d':'#b98c47'}" stroke-width=".002" transform="translate(${i*.002} ${i*.002})" mask="url(#${id}-holes)"`)).join('');
  let ink='';
  if(physicalLayers)ink=physicalLayers.map((l,index)=>polygon(l.poly,`fill="${l.front?'#ffe394':'#fff1be'}" stroke="#c69c5f" stroke-width=".0015"`)+(numbers&&l.front&&l.dot&&!physicalLayers.slice(index+1).some(above=>inside(above.poly,l.dot))?`<g transform="translate(${l.dot.x} ${l.dot.y}) matrix(${(l.ink||[1,0,0,1]).join(' ')} 0 0)"><text class="number-label" x="0" y=".027" text-anchor="middle" fill="#573c1e" font-size=".085" font-weight="850">${numbers[l.id]}</text></g>`:'')).join('');
  else if(numbers)ink=numbers.map((n,i)=>`<text x="${i%4/4+.125}" y="${Math.floor(i/4)/4+.15}" text-anchor="middle" fill="#573c1e" font-size=".085" font-weight="850">${n}</text>`).join('');
  const grid=gridSize?`<g mask="url(#${id}-holes)" pointer-events="none">${Array.from({length:gridSize-1},(_,i)=>`<path d="M${(i+1)/gridSize} 0V1M0 ${(i+1)/gridSize}H1" stroke="#9b8056" stroke-width=".002"/>`).join('')}</g>`:'';
  const shine=glossy?`<defs><linearGradient id="${id}-shine" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".38"/><stop offset=".45" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#b67b22" stop-opacity=".08"/></linearGradient></defs>${polygon(poly,`fill="url(#${id}-shine)" mask="url(#${id}-holes)" pointer-events="none"`)}`:'';
  return `<defs>${mask}<filter id="${id}-shadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx=".009" dy=".017" stdDeviation=".008" flood-color="#123b50" flood-opacity=".38"/></filter></defs><g filter="url(#${id}-shadow)">${stack}</g>${ink?`<g mask="url(#${id}-holes)">${ink}</g>`:''}${shine}${grid}`;
}
function arrow(f,poly,fr,opening=false){
  const b=box(poly),horizontal=Math.abs(f.nx)>.7,dir=(horizontal?f.nx:f.ny)*f.moving*(opening?-1:1),cx=fr.x+(b.left+b.right)/2*fr.scale,cy=fr.y+(b.top+b.bottom)/2*fr.scale;
  if(Math.abs(f.nx)>.1&&Math.abs(f.ny)>.1){const vx=-f.nx*f.moving*(opening?-1:1),vy=-f.ny*f.moving*(opening?-1:1),my=fr.y+b.top*fr.scale-32;return `<path class="motion-arrow" d="M${cx-vx*27} ${my-vy*27}Q${cx-vy*16} ${my+vx*16} ${cx+vx*27} ${my+vy*27}" marker-end="url(#arrowhead)"/>`;}
  if(horizontal){const y=fr.y+b.top*fr.scale-14;return `<path class="motion-arrow" d="M${cx+(dir>0?42:-42)} ${y}C${cx+(dir>0?42:-42)} ${y-48} ${cx+(dir>0?-42:42)} ${y-48} ${cx+(dir>0?-42:42)} ${y}" marker-end="url(#arrowhead)"/>`;}
  const x=fr.x+b.right*fr.scale+18;return `<path class="motion-arrow" d="M${x} ${cy+(dir>0?42:-42)}C${x+46} ${cy+(dir>0?42:-42)} ${x+46} ${cy+(dir>0?-42:42)} ${x} ${cy+(dir>0?-42:42)}" marker-end="url(#arrowhead)"/>`;
}
const arrowDefs='<defs><marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M1 1L4 3L1 5" fill="none" stroke="#913851" stroke-width="1.2" stroke-linejoin="round"/></marker></defs>';
const action=(content,attrs='')=>`<g role="button" tabindex="0" ${attrs}>${content}</g>`;
export function currentPaper(p,s){
  const stage=['turn','fold'].includes(s.phase)?s.fold:['work','design'].includes(s.phase)?p.folds.length:Math.max(0,p.folds.length-s.opened-(s.phase==='predict'?1:0));return {stage,poly:p.paperStages[stage]};
}
export function renderScene(raw,s,t){
  const p=withDesign(raw,s);
  if(p.family==='stack')return renderStack(p,s,t);
  if(p.family==='reverse')return renderReverse(p,s,t);
  let {stage,poly}=currentPaper(p,s);if(['sort','collect','calculate','discover','done'].includes(s.phase)){stage=0;poly=p.paperStages[0];}
  const fr=frame(poly),hit=t.hitScale||1,folding=s.phase==='fold',opening=s.phase==='open',work=s.phase==='work',markIndex=Math.min(s.opened,p.markStages.length-1);
  let marks=['fold','turn'].includes(s.phase)?[]:work?p.marks.filter((_,i)=>s.worked.includes(i)):s.phase==='design'?s.customMarks:p.markStages[markIndex];
  if(s.phase==='predict')marks=[...marks,...newMarks(p,s.opened).filter((_,i)=>s.stamped.includes(i))];
  const cutLines=['sort','done'].includes(s.phase)?p.allCuts||[]:work?p.cuts?.filter((_,i)=>s.worked.includes(i))||[]:p.cuts?.length?p.allCuts.filter(()=>stage===0):[];
  const shownLayers=p.stages[stage];
  const cleared=p.family==='sort'&&['sort','done'].includes(s.phase)||p.family==='number'&&p.askRemain&&['collect','calculate','done'].includes(s.phase);
  let body=cleared?'':paperSurface(poly,{marks,cuts:cutLines,layers:p.depths[stage].max,numbers:p.numbers,physicalLayers:s.phase==='turn'?p.sourceLayers:shownLayers,glossy:true,gridSize:p.gridSize});
  if(folding||opening){
    const f=folding?p.folds[s.fold]:p.folds[p.folds.length-s.opened-1],moving=clipHalfPlane(poly,f,folding?f.moving:-f.moving),center=polygonCentroid(moving);
    body+=polygon(moving,`class="fold-hit" fill="transparent" data-action="${folding?'fold':'open'}"`);
    body+=action(`<circle cx="${center.x}" cy="${center.y}" r="${25*hit/fr.scale}" fill="#fffaf0" stroke="#a87d3e" stroke-width="${2/fr.scale}"/><text x="${center.x}" y="${center.y+9*hit/fr.scale}" text-anchor="middle" font-size="${28*hit/fr.scale}" fill="#674419" pointer-events="none">${folding?'↶':'↷'}</text>`,`data-action="${folding?'fold':'open'}" aria-label="${escapeHtml(folding?t.fold:t.open)}"`);
    const chord=chordSegments(poly,f)[0];if(chord?.length===2)body+=`<path d="M${chord[0].x} ${chord[0].y}L${chord[1].x} ${chord[1].y}" stroke="#8c6833" stroke-width="${2/fr.scale}" stroke-dasharray="${6/fr.scale} ${5/fr.scale}" pointer-events="none"/>`;
  }
  if(s.phase==='turn')body+=action(polygon(poly,'fill="transparent"'),`data-action="turn" aria-label="${escapeHtml(t.turn)}"`);
  if(work&&p.cutPlan){
    body+=`<defs><clipPath id="cut-plan-clip">${polygon(poly)}</clipPath></defs><g clip-path="url(#cut-plan-clip)" pointer-events="none">${s.cutPlacements.map((q,i)=>{const m=placedCut(p,i,q);return m?markSvg(m,`class="cut-preview" fill="#fff6e6" fill-opacity=".5" stroke="#9c3857" stroke-width="${2/fr.scale}" stroke-dasharray="${5/fr.scale} ${3/fr.scale}"`):'';}).join('')}</g>`;
    body+=polygon(poly,`fill="transparent" data-cut-surface="true" role="button" tabindex="0" aria-label="${escapeHtml(t.cutPlace)}"`);
  }
  if(work&&!p.cutPlan){const items=p.cuts?.length?p.cuts:p.marks;body+=items.filter((_,i)=>!s.worked.includes(i)).map(item=>{const i=items.indexOf(item),a=Array.isArray(item)?{x:item[0].x*.72+item[1].x*.28,y:item[0].y*.72+item[1].y*.28}:markAnchor(item),r=24*hit/fr.scale;return action(`<circle cx="${a.x}" cy="${a.y}" r="${r}" fill="#fff6e6" stroke="#9c3857" stroke-width="${2/fr.scale}"/><text x="${a.x}" y="${a.y+8*hit/fr.scale}" text-anchor="middle" fill="#9c3857" font-size="${24*hit/fr.scale}" pointer-events="none">${p.cuts?.length||p.family==='cut'?'✂':'＋'}</text>`,`data-action="work" data-value="${i}" aria-label="${escapeHtml(t.tool)} ${i+1}"`);}).join('');}
  if(s.phase==='design')body+=polygon(poly,`fill="transparent" data-design-surface="true" role="button" tabindex="0" aria-label="${escapeHtml(t.prompts.design)}"`);
  if(s.phase==='predict'){
    body+=polygon(poly,`fill="transparent" data-predict-surface="true" role="button" tabindex="0" aria-label="${escapeHtml(t.prompts.predict)}"`);
    const f=p.folds[p.folds.length-s.opened-1],chord=chordSegments(poly,f)[0];if(chord)body+=`<path d="M${chord[0].x} ${chord[0].y}L${chord[1].x} ${chord[1].y}" stroke="#8c6833" stroke-width="${2/fr.scale}" stroke-dasharray="${6/fr.scale} ${5/fr.scale}" pointer-events="none"/>`;
  }
  if(s.phase==='sort')body+=p.pieces.filter(piece=>!s.sorted[piece.id]).map(piece=>action(polygon(piece.poly,`fill="${'#ffe394'}" stroke="#8a663b" stroke-width=".004"`),`data-piece="${piece.id}" aria-label="${escapeHtml(t.piece)} ${Number(piece.id)+1}"`)).join('');
  if(s.phase==='collect')body+=numberGroups(p).filter(g=>!g.some(id=>s.collected.includes(id))).map(g=>{const i=numberGroups(p).findIndex(group=>group.join()===g.join()),cells=g.map(id=>{const x=id%4/4,y=Math.floor(id/4)/4;return polygon([{x,y},{x:x+.25,y},{x:x+.25,y:y+.25},{x,y:y+.25}],`fill="#fff0af" stroke="#9b6630" stroke-width=".004"`)+`<text x="${x+.125}" y="${y+.15}" text-anchor="middle" fill="#573b1b" font-size=".085" font-weight="850" pointer-events="none">${p.numbers[id]}</text>`;}).join('');return action(cells,`data-action="collect" data-value="${i}" aria-label="${escapeHtml(t.collect)} ${g.map(n=>p.numbers[n]).join(', ')}"`);}).join('');
  if(s.phase==='discover')body+=p.markStages.at(-1).map((m,i)=>{const a=markAnchor(m);const stamp=`<circle cx="${a.x}" cy="${a.y}" r="${(s.collected.includes(i)?13:22)*hit/fr.scale}" fill="${s.collected.includes(i)?'#b8ead0':'#fff9dc'}" fill-opacity=".8" stroke="#337b72" stroke-width="${2/fr.scale}"/><text x="${a.x}" y="${a.y+7*hit/fr.scale}" text-anchor="middle" font-size="${23*hit/fr.scale}" fill="#26665f" pointer-events="none">${s.collected.includes(i)?'✓':'✦'}</text>`;return s.collected.includes(i)?`<g aria-hidden="true" pointer-events="none">${stamp}</g>`:action(stamp,`data-action="discover" data-value="${i}" aria-label="${escapeHtml(t.discover)} ${i+1}"`);}).join('');
  let outer='';if(folding)outer=arrow(p.folds[s.fold],poly,fr);if(opening||s.phase==='predict')outer=arrow(p.folds[p.folds.length-s.opened-1],poly,fr,true);
  return svg(`${arrowDefs}<g class="paper-world" transform="${fr.transform}" data-frame-x="${fr.x}" data-frame-y="${fr.y}" data-frame-scale="${fr.scale}">${body}</g>${outer}`);
}
function renderStack(p,s,t){
  const connect=!p.build&&t.stackMode==='connect',gone=new Set(s.peeled),visible=p.build?p.papers.filter(x=>s.built.includes(x.id)):connect?p.papers:p.papers.filter(x=>!gone.has(x.id));
  const guides=s.phase==='build'?p.papers.map(paper=>polygon(paper.poly,'fill="none" stroke="#d6eeeb" stroke-width=".003" stroke-dasharray=".012 .012" pointer-events="none"')).join(''):'';
  const id=`stack-scene-${p.id}`,route=connect?stackConnectionPoints(p,s.peeled):[];
  const connection=route.length>1?`<g pointer-events="none"><polyline class="connect-line-outline" points="${points(route)}"/><polyline class="connect-line" points="${points(route)}"/></g>`:'';
  const labels=connect?p.papers.map(paper=>{
    const rank=s.peeled.indexOf(paper.id),label=stackPaperLabel(paper)+(rank>=0?`<circle class="connect-step" cx="${paper.label.x+.047}" cy="${paper.label.y-.047}" r=".03"/><text class="connect-step-number" x="${paper.label.x+.047}" y="${paper.label.y-.047}">${rank+1}</text>`:'');
    return rank<0&&s.phase!=='done'?action(`<circle cx="${paper.label.x}" cy="${paper.label.y}" r="${22.25*(t.hitScale||1)/480}" fill="transparent"/>${label}`,`data-action="paper" data-value="${paper.id}" aria-label="${escapeHtml(t.paper)} ${paper.id}"`):`<g aria-label="${escapeHtml(t.paper)} ${paper.id}">${label}</g>`;
  }).join(''):'';
  return svg(`${stackMaterialDefs(id)}<g class="paper-world" transform="translate(25 50) scale(480)">${guides}${visible.map(paper=>connect?stackPaper(paper,id,false):action(stackPaper(paper,id),`data-action="paper" data-value="${paper.id}" aria-label="${escapeHtml(t.paper)} ${paper.id}"`)).join('')}${connection}${labels}</g>`);
}
function stackMaterialDefs(id){return `<defs>${stackMaterials.map((m,i)=>`<linearGradient id="${id}-color-${i}" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="${m.light}"/><stop offset=".43" stop-color="${m.base}"/><stop offset="1" stop-color="${m.deep}"/></linearGradient>`).join('')}<linearGradient id="${id}-reflection" x1="0" y1="0" x2="1" y2=".82"><stop stop-color="#ffffff" stop-opacity=".22"/><stop offset=".28" stop-color="#ffffff" stop-opacity=".05"/><stop offset=".31" stop-color="#ffffff" stop-opacity=".15"/><stop offset=".48" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient><filter id="${id}-contact" x="-20%" y="-20%" width="150%" height="155%" color-interpolation-filters="sRGB"><feDropShadow dx=".003" dy=".007" stdDeviation=".004" flood-color="#102333" flood-opacity=".48"/></filter></defs>`;}
function stackPaper(paper,id,label=true){
  const m=stackMaterials[paper.color],clip=`${id}-clip-${paper.id}`,b=box(paper.poly),x=paper.label?.x??b.left+.04,y=paper.label?.y??b.top+.065;
  return `<defs><clipPath id="${clip}">${polygon(paper.poly)}</clipPath></defs>${polygon(paper.poly,`class="stack-face" fill="url(#${id}-color-${paper.color})" stroke="${m.deep}" stroke-width=".0025" filter="url(#${id}-contact)"`)}<g clip-path="url(#${clip})" pointer-events="none">${polygon(paper.poly,`fill="url(#${id}-reflection)"`)}<path d="M${b.left} ${b.bottom}V${b.top}H${b.right}" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width=".0035"/><path d="M${b.left} ${b.bottom}H${b.right}V${b.top}" fill="none" stroke="${m.deep}" stroke-width=".006"/>${label?stackPaperLabel(paper):''}</g>`;
}
function stackPaperLabel(paper){
  const m=stackMaterials[paper.color],b=box(paper.poly),x=paper.label?.x??b.left+.04,y=paper.label?.y??b.top+.065;
  return `<circle cx="${x}" cy="${y}" r=".036" fill="${m.ink==='#ffffff'?'#102536':'#fff4c4'}" fill-opacity=".33"/><text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size=".055" font-weight="850" fill="${m.ink}">${paper.id}</text>`;
}

export function stackReference(p,label){const id=`stack-reference-${p.id}`;return svg(`${stackMaterialDefs(id)}<g transform="translate(25 0) scale(480)" aria-label="${escapeHtml(label)}">${p.papers.map(paper=>stackPaper(paper,id)).join('')}</g>`,'stack-reference');}
function renderReverse(p,s,t){
  const poly=p.paper,fr=frame(square()),chords=p.lineChoices||p.creaseHints;let body=paperSurface(poly,{fill:'#b8e1ee'});
  if(s.trial)body=s.trial.pieces.map(poly=>polygon(poly,'fill="#b8e1ee" stroke="#557887" stroke-width=".003"')).join('');
  body+=`<g clip-path="url(#reverse-paper-clip)">${chords.map((c,i)=>action(`<path d="M${c.chord[0].x} ${c.chord[0].y}L${c.chord[1].x} ${c.chord[1].y}" stroke="transparent" stroke-width="${.13*(t.hitScale||1)}"/><path d="M${c.chord[0].x} ${c.chord[0].y}L${c.chord[1].x} ${c.chord[1].y}" stroke="${s.trial?.line===i?'#913851':'#4e7183'}" stroke-width=".005" stroke-dasharray=".018 .012"/>`,`data-action="trial" data-value="${i}" aria-label="${escapeHtml(t.tryFold)} ${i+1}"`)).join('')}</g>`;
  return svg(`<defs><clipPath id="reverse-paper-clip">${polygon(poly)}</clipPath></defs><g class="paper-world" transform="${fr.transform}">${body}</g>`);
}
export function renderMotion(p,s){
  const opening=s.phase==='open',i=opening?p.folds.length-s.opened-1:s.fold,f=p.folds[i],poly=p.paperStages[i],fr=frame(poly),chord=chordSegments(poly,f)[0],origin={x:fr.x+(chord[0].x+chord[1].x)/2*fr.scale,y:fr.y+(chord[0].y+chord[1].y)/2*fr.scale};
  const source=p.stages[i],fixed=[],moving=[];for(const l of source){for(const [target,sign] of [[fixed,-f.moving],[moving,f.moving]]){const part=clipHalfPlane(l.poly,f,sign);if(part.length>=3)target.push({...l,poly:part,dot:l.dot&&(f.nx*l.dot.x+f.ny*l.dot.y-f.c)*sign>=-1e-7?l.dot:null});}}
  const fixedPoly=clipHalfPlane(poly,f,-f.moving),movingPoly=clipHalfPlane(poly,f,f.moving),back=moving.map(l=>({...l,front:!l.front,ink:reflectInk(l.ink,f),poly:l.poly.map(q=>reflectAcross(f,q)),dot:l.dot?reflectAcross(f,l.dot):null})).reverse(),backPoly=movingPoly.map(q=>reflectAcross(f,q));
  const surface=(poly,layers,id)=>svg(`<g transform="${fr.transform}">${paperSurface(poly,{physicalLayers:layers,numbers:p.numbers,layers:p.depths[i].max,id,glossy:true,gridSize:p.gridSize,marks:opening?withDesign(p,s).markStages[s.opened+1]:[]})}</g>`);
  const axis=`${-f.ny},${f.nx},0`,angle=-f.moving*180,style=`transform-origin:${origin.x/520*100}% ${origin.y/480*100}%;`;
  return {axis,angle,html:`<div class="fold-motion-fixed">${surface(fixedPoly,fixed,'fixed')}</div><div class="physical-flap" style="${style}transform:rotate3d(${axis},${opening?angle:0}deg)"><div class="flap-front">${surface(movingPoly,moving,'moving')}</div><div class="flap-back" style="${style}transform:rotate3d(${axis},180deg)">${surface(backPoly,back,'back')}</div></div>`};
}
export function smallPaper(poly,marks=[],opts={}){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.04 -0.04 1.08 1.08" role="img" aria-label="${escapeHtml(opts.label||'')}" class="small-paper">${paperSurface(poly,{marks,layers:opts.layers||1,numbers:opts.numbers,id:opts.id||'small'})}</svg>`;}
export function resultSvg(p,option){return `<svg viewBox="-.08 -.08 1.16 1.16" class="small-paper" aria-hidden="true">${option.pieces.map(poly=>polygon(poly,'fill="#b8e1ee" stroke="#557887" stroke-width=".007"')).join('')}</svg>`;}
