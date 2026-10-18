// Paper coordinates stay in the original 4×4 frame throughout the activity.
export const phases = ['fold-h','fold-v','cut','unfold-v','unfold-h','collect','done'];
export const stageFor = phase => ({'fold-h':0,'fold-v':1,cut:2,'unfold-v':2,'unfold-h':1,collect:0,done:0})[phase];
export const initialActivity = () => ({phase:'fold-h',cutKeys:[],collected:[]});
export const cutKeysFor = p => p.cells.map(({r,c})=>r*2+c);
export function projectCell(id,p,stage) {
  let r=Math.floor(id/4),c=id%4;
  if(stage>=1 && (p.hDir==='up'?r>=2:r<2))r=3-r;
  if(stage>=2 && (p.vDir==='left'?c>=2:c<2))c=3-c;
  return r*4+c;
}
export function visibleIds(p,stage) {
  return [...new Set(Array.from({length:16},(_,id)=>projectCell(id,p,stage)))].sort((a,b)=>a-b);
}
export function removedIds(p,keys) {
  return [...p.removed].filter(id=>{
    const folded=projectCell(id,p,2);
    return keys.includes((Math.floor(folded/4)-p.packetRow)*2+folded%4-p.packetCol);
  });
}
export const holesAt = (p,keys,stage) => new Set(removedIds(p,keys).map(id=>projectCell(id,p,stage)));
export function piecesFor(p) {
  const remaining=new Set(Array.from({length:16},(_,id)=>id).filter(id=>p.activity==='cut'?p.removed.has(id):!p.removed.has(id)));
  const pieces=[];
  while(remaining.size) {
    const first=Math.min(...remaining),cells=[first];remaining.delete(first);
    for(let i=0;i<cells.length;i++) {
      const id=cells[i],r=Math.floor(id/4),c=id%4;
      for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr=r+dr,nc=c+dc,n=nr*4+nc;
        if(nr>=0&&nr<4&&nc>=0&&nc<4&&remaining.delete(n))cells.push(n);
      }
    }
    cells.sort((a,b)=>a-b);
    pieces.push({id:String(first),cells,sum:cells.reduce((n,id)=>n+p.grid[Math.floor(id/4)][id%4],0)});
  }
  return pieces;
}
export function advance(p,state,action,value) {
  const next={phase:state.phase,cutKeys:[...state.cutKeys],collected:[...state.collected]};
  if(action==='fold' && ['fold-h','fold-v','unfold-v','unfold-h'].includes(state.phase))next.phase=phases[phases.indexOf(state.phase)+1];
  else if(action==='cut' && state.phase==='cut' && cutKeysFor(p).includes(value) && !next.cutKeys.includes(value)) {
    next.cutKeys.push(value);
    if(next.cutKeys.length===p.cells.length)next.phase='unfold-v';
  } else if(action==='collect' && state.phase==='collect' && piecesFor(p).some(piece=>piece.id===value) && !next.collected.includes(value)) {
    next.collected.push(value);
    if(next.collected.length===piecesFor(p).length)next.phase='done';
  }
  return next;
}
export function restoreActivity(p,value) {
  // Replay legal operations rather than trusting stored phase/IDs.
  let state=initialActivity();
  if(!value || !phases.includes(value.phase))return state;
  const target=phases.indexOf(value.phase);
  for(let i=0;i<Math.min(2,target);i++)state=advance(p,state,'fold');
  if(target>=2)for(const key of Array.isArray(value.cutKeys)?value.cutKeys:[])state=advance(p,state,'cut',key);
  if(target>=3 && state.phase!=='unfold-v')return initialActivity();
  if(target>=4)state=advance(p,state,'fold');
  if(target>=5)state=advance(p,state,'fold');
  if(target>=5)for(const id of Array.isArray(value.collected)?value.collected:[])state=advance(p,state,'collect',id);
  return state.phase===value.phase?state:initialActivity();
}
export function foldGeometry(p,phase) {
  const horizontal=phase==='fold-h'||phase==='unfold-h';
  const unfold=phase.startsWith('unfold');
  const expandedStage=horizontal?0:1;
  const r=horizontal?(p.hDir==='up'?2:0):p.packetRow;
  const c=horizontal?0:(p.vDir==='left'?2:0);
  return {horizontal,unfold,expandedStage,r,c,rows:2,cols:horizontal?4:2,
    origin:horizontal?(p.hDir==='up'?'50% 0%':'50% 100%'):(p.vDir==='left'?'0% 50%':'100% 50%'),
    axis:horizontal?'X':'Y',angle:horizontal?(p.hDir==='up'?180:-180):(p.vDir==='left'?-180:180),
    vector:horizontal?[0,p.hDir==='up'?-1:1]:[p.vDir==='left'?-1:1,0]};
}
// Keep the physical sheet centred as its footprint becomes smaller or larger.
export function sceneShift(p,phase) {
  const stage=stageFor(phase);
  return {x:stage>=2?(p.vDir==='left'?25:-25):0,y:stage>=1?(p.hDir==='up'?25:-25):0};
}
export const shiftTransform=shift=>`translate(${shift.x}%,${shift.y}%)`;
