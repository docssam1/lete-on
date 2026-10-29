export const edgeKey=(a,b)=>[a,b].sort().join("|");
export const nodePoint=([x,y])=>({x:12+x*76/3,y:12+y*76/3});
export const fresh=()=>({path:[]});
export const usedEdges=state=>state.path.slice(1).map((id,i)=>edgeKey(state.path[i],id));
export const lastNode=state=>state.path.at(-1)||null;
export const isSolved=(problem,state)=>{
  const used=usedEdges(state);
  return used.length===problem.edges.length&&new Set(used).size===problem.edges.length
    &&problem.starts.includes(state.path[0])&&used.every(key=>problem.edges.some(edge=>edgeKey(...edge)===key));
};
export function step(problem,state,id){
  if(!Object.hasOwn(problem.nodes,id))return {state,error:"choosePeg"};
  if(isSolved(problem,state))return {state,error:null};
  if(!state.path.length){
    return problem.starts.includes(id)?{state:{path:[id]},error:null}:{state,error:"wrongStart"};
  }
  const from=lastNode(state),key=edgeKey(from,id);
  if(from===id)return {state,error:null};
  if(!problem.edges.some(([a,b])=>edgeKey(a,b)===key))return {state,error:"followLines"};
  if(usedEdges(state).includes(key))return {state,error:"usedLine"};
  return {state:{path:[...state.path,id]},error:null};
}
export function undo(state){return {path:state.path.slice(0,-1)};}
export function isStuck(problem,state){
  if(!state.path.length||isSolved(problem,state))return false;
  const current=lastNode(state),used=new Set(usedEdges(state));
  return !problem.edges.some(([a,b])=>(a===current||b===current)&&!used.has(edgeKey(a,b)));
}
export function restorePath(problem,value){
  if(!Array.isArray(value)||value.length>problem.edges.length+1)return fresh();
  let state=fresh();
  for(const id of value){
    if(typeof id!=="string"||isSolved(problem,state)||id===lastNode(state))return fresh();
    const result=step(problem,state,id);if(result.error)return fresh();state=result.state;
  }
  return state;
}
export function validateBank(bank){
  if(bank?.version!==1||!Array.isArray(bank.problems)||bank.problems.length!==12)throw new Error("Invalid one-stroke bank");
  const ids=new Set();
  for(const p of bank.problems){
    if(ids.has(p.id)||![1,2,3].includes(p.level)||!p.nodes||!Array.isArray(p.edges)||!p.edges.length||!p.starts?.length)throw new Error("Invalid graph metadata");
    ids.add(p.id);const seen=new Set(),positions=new Set();
    for(const [id,xy]of Object.entries(p.nodes)){
      if(!/^[a-z]$/.test(id)||!Array.isArray(xy)||xy.length!==2||!xy.every(v=>Number.isFinite(v)&&v>=0&&v<=3)||positions.has(xy.join(",")))throw new Error("Invalid peg");
      positions.add(xy.join(","));
    }
    for(const edge of p.edges){
      if(edge.length!==2||edge[0]===edge[1]||edge.some(id=>!Object.hasOwn(p.nodes,id))||seen.has(edgeKey(...edge)))throw new Error("Invalid edge");
      seen.add(edgeKey(...edge));
    }
    if(new Set(p.starts).size!==p.starts.length||p.starts.some(id=>!Object.hasOwn(p.nodes,id)))throw new Error("Invalid starts");
  }
  for(const level of [1,2,3])if(bank.problems.filter(p=>p.level===level).length!==4)throw new Error("Invalid level size");
  return bank;
}
export function restoreProgress(bank,value){
  const progress={version:1,bankVersion:bank.version,level:1,indices:{1:0,2:0,3:0},paths:{}};
  if(value?.version!==1||value.bankVersion!==bank.version)return progress;
  for(const p of bank.problems)progress.paths[p.id]=restorePath(p,value.paths?.[p.id]||[]).path;
  for(const level of [1,2,3]){
    const questions=bank.problems.filter(p=>p.level===level);
    const first=questions.findIndex(p=>!isSolved(p,{path:progress.paths[p.id]}));
    const limit=first<0?questions.length-1:first,index=value.indices?.[level];
    progress.indices[level]=Number.isInteger(index)&&index>=0?Math.min(index,limit):0;
  }
  progress.level=[1,2,3].includes(value.level)?value.level:1;return progress;
}
export function distanceToSegment(p,a,b){
  const dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy;
  const t=length?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/length)):0;
  return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
}

// A geometric input adapter, not an Euler solver. Sparse pointer events are swept
// through peg hit areas; an off-line excursion must return to the current peg.
export function createTrace(problem,getState,accept,{radius=8,corridor=5}={}){
  const points=Object.fromEntries(Object.entries(problem.nodes).map(([id,xy])=>[id,nodePoint(xy)]));
  let previous=null,possible=null,blocked=false,lastError=null,preview=null;
  function nearest(p){return Object.keys(points).map(id=>({id,d:Math.hypot(points[id].x-p.x,points[id].y-p.y)})).filter(n=>n.d<=radius).sort((a,b)=>a.d-b.d)[0]?.id||null;}
  function resetOptions(current){possible=problem.edges.filter(edge=>edge.includes(current)).map(edge=>edge.find(id=>id!==current));blocked=false;lastError=null;}
  function begin(p){previous=p;preview=null;resetOptions(lastNode(getState()));}
  function move(p){
    if(!previous)return null;
    const from=previous,steps=Math.max(1,Math.min(256,Math.ceil(Math.hypot(p.x-from.x,p.y-from.y)/(radius*.35))));
    let error=null;
    for(let i=1;i<=steps;i++){
      if(isSolved(problem,getState()))break;
      const at={x:from.x+(p.x-from.x)*i/steps,y:from.y+(p.y-from.y)*i/steps},current=lastNode(getState());
      if(!current)break;
      if(Math.hypot(points[current].x-at.x,points[current].y-at.y)<=radius){preview=null;resetOptions(current);continue;}
      if(blocked)continue;
      possible=possible.filter(id=>distanceToSegment(at,points[current],points[id])<=corridor);
      if(!possible.length){blocked=true;preview=null;error="followLines";continue;}
      const nearestEdge=[...possible].sort((a,b)=>distanceToSegment(at,points[current],points[a])-distanceToSegment(at,points[current],points[b]))[0];
      const a=points[current],b=points[nearestEdge],dx=b.x-a.x,dy=b.y-a.y;
      const amount=Math.max(0,Math.min(1,((at.x-a.x)*dx+(at.y-a.y)*dy)/(dx*dx+dy*dy)));
      preview=usedEdges(getState()).includes(edgeKey(current,nearestEdge))?null:{from:a,to:{x:a.x+amount*dx,y:a.y+amount*dy}};
      const hit=nearest(at);
      if(hit&&hit!==current&&possible.includes(hit)){
        const result=accept(hit);
        preview=null;if(result){blocked=true;error=result;}else resetOptions(hit);
      }
    }
    previous=p;
    if(error&&error!==lastError){lastError=error;return error;}
    return null;
  }
  return {nearest,begin,move,get blocked(){return blocked;},get preview(){return preview;}};
}
