import { visibleIds,holesAt,piecesFor,foldGeometry,stageFor,cutKeysFor,sceneShift,shiftTransform } from './activity-model.js?v=3';
const pos=(r,c,rows=1,cols=1)=>`left:${c*25}%;top:${r*25}%;width:${cols*25}%;height:${rows*25}%`;
export const scissors='<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M26 34 54 8M30 39 57 54" stroke="#324960" stroke-width="7" stroke-linecap="round"/><path d="M26 34 54 8M30 39 57 54" stroke="#d3e1e7" stroke-width="3" stroke-linecap="round"/><circle cx="18" cy="43" r="11" fill="none" stroke="#ed5c65" stroke-width="7"/><circle cx="20" cy="22" r="10" fill="none" stroke="#ed5c65" stroke-width="7"/><circle cx="30" cy="34" r="4" fill="#f9ce5d"/></svg>';
function tile(id,p,stage,extra='',attrs='') {
  const r=Math.floor(id/4),c=id%4;
  return `<span class="paper-cell ${stage?'paper-back':''} ${extra}" style="${pos(r,c)}" ${attrs}>${stage?'':`<span class="number">${p.grid[r][c]}</span>`}</span>`;
}
function face(p,stage,holes,ids=visibleIds(p,stage)) {
  return ids.filter(id=>!holes.has(id)).map(id=>tile(id,p,stage)).join('');
}
function motionLayer(p,state,t) {
  const g=foldGeometry(p,state.phase),holes=holesAt(p,state.cutKeys,g.expandedStage);
  const ids=visibleIds(p,g.expandedStage).filter(id=>Math.floor(id/4)>=g.r&&Math.floor(id/4)<g.r+g.rows&&id%4>=g.c&&id%4<g.c+g.cols);
  const local=(back=false)=>ids.filter(id=>!holes.has(id)).map(id=>{
    let row=Math.floor(id/4)-g.r,col=id%4-g.c;
    if(back){if(g.horizontal)row=g.rows-1-row;else col=g.cols-1-col;}
    return `<span class="paper-cell ${g.expandedStage||back?'paper-back':''}" style="left:${col*100/g.cols}%;top:${row*100/g.rows}%;width:${100/g.cols}%;height:${100/g.rows}%">${!g.expandedStage&&!back?`<span class="number">${p.grid[Math.floor(id/4)][id%4]}</span>`:''}</span>`;
  }).join('');
  return `<div class="flap" style="${pos(g.r,g.c,g.rows,g.cols)};transform-origin:${g.origin};transform:rotate${g.axis}(${g.unfold?g.angle:0}deg)"><div class="flap-face front">${local()}</div><div class="flap-face back" style="transform:rotate${g.axis}(180deg)">${local(true)}</div></div>`;
}
function sceneContent(p,state,t) {
  const stage=stageFor(state.phase),holes=holesAt(p,state.cutKeys,stage);
  if(state.phase==='collect'||state.phase==='done') {
    const target=new Set(piecesFor(p).flatMap(piece=>piece.cells));
    const base=Array.from({length:16},(_,id)=>id).filter(id=>!target.has(id)&&!p.removed.has(id));
    return `<div class="paper-shadow"></div>${face(p,0,new Set(),base)}${piecesFor(p).filter(piece=>!state.collected.includes(piece.id)).map((piece,i)=>{
      const cells=new Set(piece.cells);
      const hx=(piece.cells.reduce((n,id)=>n+id%4+.5,0)/piece.cells.length-2)*7;
      const hy=(piece.cells.reduce((n,id)=>n+Math.floor(id/4)+.5,0)/piece.cells.length-2)*7||-6;
      return `<div class="piece-group" data-group="${piece.id}" data-home-x="${hx}" data-home-y="${hy}" style="--lift:${i%3-1}deg;--home-x:${hx}px;--home-y:${hy}px">${piece.cells.map((id,j)=>{
        const r=Math.floor(id/4),c=id%4;
        const edges=[!cells.has(id-4)||r===0,!cells.has(id+1)||c===3,!cells.has(id+4)||r===3,!cells.has(id-1)||c===0];
        const style=`${pos(r,c)};border-width:${edges.map(b=>b?'2px':'0').join(' ')}`;
        return `<${j?'span':'button type="button"'} class="piece-cell" style="${style}" data-piece="${piece.id}"${j?'':` aria-label="${t.collect}: ${piece.cells.map(n=>p.grid[Math.floor(n/4)][n%4]).join(', ')}"`}><span class="number">${p.grid[r][c]}</span></${j?'span':'button'}>`;
      }).join('')}</div>`;
    }).join('')}${state.phase==='done'?'<div class="done-stamp" aria-hidden="true"><span>★</span> GREAT JOB!</div>':''}`;
  }
  const folding=state.phase!=='cut',g=folding?foldGeometry(p,state.phase):null;
  const moving=g?new Set(visibleIds(p,g.expandedStage).filter(id=>Math.floor(id/4)>=g.r&&Math.floor(id/4)<g.r+g.rows&&id%4>=g.c&&id%4<g.c+g.cols)):new Set();
  const fixedStage=g?.unfold?stage:g?.expandedStage??stage;
  const fixedIds=visibleIds(p,fixedStage).filter(id=>g?.unfold||!moving.has(id));
  let html=`<div class="paper-shadow"></div>${face(p,fixedStage,holes,fixedIds)}${folding?motionLayer(p,state,t):''}`;
  if(folding) {
    const handle= g.unfold?{r:p.packetRow,c:g.horizontal?0:p.packetCol,rows:2,cols:g.horizontal?4:2}:g;
    const arrow=g.unfold?(g.horizontal?(p.hDir==='up'?'↓':'↑'):(p.vDir==='left'?'→':'←')):(g.horizontal?(p.hDir==='up'?'↑':'↓'):(p.vDir==='left'?'←':'→'));
    html+=`<button type="button" class="fold-handle ${g.horizontal?'horizontal':'vertical'} ${g.unfold?'opening':''}" data-fold style="${pos(handle.r,handle.c,handle.rows,handle.cols)}" aria-label="${g.unfold?t.unfold:t.fold}"><span class="grab-tab"><span aria-hidden="true">${arrow}</span><span>${g.unfold?t.unfold:t.fold}</span><i aria-hidden="true"></i></span></button>`;
    html+=`<div class="crease ${g.horizontal?'crease-h':'crease-v'}" style="${g.horizontal?'top:50%':`left:50%;top:${p.packetRow*25}%;height:50%`}" aria-hidden="true"></div>`;
  } else {
    const all=new Set(cutKeysFor(p));
    for(const key of all) {
      const r=Math.floor(key/2),c=key%2,done=state.cutKeys.includes(key);
      const borders=[!all.has(key-2)||r===0,!all.has(key+1)||c===1,!all.has(key+2)||r===1,!all.has(key-1)||c===0];
      html+=`<button type="button" class="cut-target ${done?'snipped':''}" style="${pos(p.packetRow+r,p.packetCol+c)};border-width:${borders.map(v=>v?'3px':'0').join(' ')}" data-cut="${key}" aria-label="${t.cutCell} ${key+1}" ${done?'disabled':''}>${done?'<span aria-hidden="true">✓</span>':scissors}</button>`;
    }
  }
  return html;
}

export function paperScene(p,state,t) {
  return `<div class="paper-object" style="transform:${shiftTransform(sceneShift(p,state.phase))}">${sceneContent(p,state,t)}</div>`;
}

// Draw directly beside the current physical footprint, without a second paper.
export function foldDirections(p,state,t) {
  if(!['fold-h','fold-v','unfold-v','unfold-h'].includes(state.phase))return '';
  const g=foldGeometry(p,state.phase),stage=stageFor(state.phase);
  const direction=g.horizontal?p.hDir:p.vDir;
  const opposite={up:'down',down:'up',left:'right',right:'left'};
  const dir=g.unfold?opposite[direction]:direction;
  const curve=g.horizontal?'M16 88C92 88 92 55 28 12M29 34L27 11L49 15':'M85 85C85 45 55 35 15 35M32 24L14 35L32 46';
  const transform=dir==='down'?'rotate(180 50 50)':dir==='right'?'translate(100 0) scale(-1 1)':'';
  const label=`${g.unfold?t.openDirections:t.foldDirections}: ${t.directions[dir]}`;
  return `<svg class="large-fold-arrow" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="${label}" data-direction="${dir}" style="left:${stage>=2?75:100}%;top:50%"><g transform="${transform}"><path class="arrow-halo" d="${curve}"/><path class="arrow-ink" d="${curve}"/></g></svg>`;
}
