'use strict';
function combinations(a,n){if(!n)return [[]];return a.flatMap((v,i)=>combinations(a.slice(i+1),n-1).map(t=>[v,...t]));}
function shapeKey(cells){
  const forms=[];
  for(const mirror of [1,-1])for(let turn=0;turn<4;turn++){
    let pts=cells.map(([x,y])=>[x*mirror,y]);
    for(let i=0;i<turn;i++)pts=pts.map(([x,y])=>[-y,x]);
    const minX=Math.min(...pts.map(p=>p[0])),minY=Math.min(...pts.map(p=>p[1]));
    forms.push(pts.map(([x,y])=>[x-minX,y-minY].join(',')).sort().join(';'));
  }
  return forms.sort()[0];
}
function partitions(size=4){
  const cells=Array.from({length:size*size},(_,i)=>i),groups=new Map();
  for(const region of combinations(cells,4)){
    const seen=new Set([region[0]]),todo=[region[0]];
    while(todo.length){const p=todo.pop();for(const q of region)if(!seen.has(q)&&Math.abs(p%size-q%size)+Math.abs(Math.floor(p/size)-Math.floor(q/size))===1){seen.add(q);todo.push(q);}}
    if(seen.size!==4)continue;
    const key=shapeKey(region.map(i=>[i%size,Math.floor(i/size)]));
    if(!groups.has(key))groups.set(key,[]);groups.get(key).push(region);
  }
  const results=[];
  for(const [key,regions]of groups){
    function cover(used,parts){if(used.size===cells.length){results.push({key,parts});return;}
      const first=cells.find(i=>!used.has(i));
      for(const r of regions.filter(r=>r.includes(first)&&r.every(i=>!used.has(i))))cover(new Set([...used,...r]),[...parts,r]);
    }cover(new Set(),[]);
  }
  return results;
}
function quadrilaterals(points,segments){
  const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  const on=(p,[a,b])=>Math.abs(cross(a,b,p))<1e-8&&p[0]>=Math.min(a[0],b[0])-1e-8&&p[0]<=Math.max(a[0],b[0])+1e-8&&p[1]>=Math.min(a[1],b[1])-1e-8&&p[1]<=Math.max(a[1],b[1])+1e-8;
  return combinations(points.map((_,i)=>i),4).filter(ids=>{
    const cx=ids.reduce((s,i)=>s+points[i][0],0)/4,cy=ids.reduce((s,i)=>s+points[i][1],0)/4;
    ids.sort((a,b)=>Math.atan2(points[a][1]-cy,points[a][0]-cx)-Math.atan2(points[b][1]-cy,points[b][0]-cx));
    const turns=ids.map((_,i)=>cross(points[ids[i]],points[ids[(i+1)%4]],points[ids[(i+2)%4]]));
    return turns.every(t=>t>1e-8)&&ids.every((a,i)=>segments.some(s=>on(points[a],s)&&on(points[ids[(i+1)%4]],s)));
  });
}
module.exports={partitions,quadrilaterals,shapeKey};
