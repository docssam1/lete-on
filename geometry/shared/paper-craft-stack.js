import {stackLayouts} from './paper-craft-stack-layouts.js?v=20261018-3';
import {inside} from './paper-craft-model.js?v=20261018-3';
export const topAt=(papers,q)=>{for(let i=papers.length-1;i>=0;i--)if(inside(papers[i].poly,q))return i;return -1;};
// Only a visible edge lying over a lower paper supplies an ordering clue.
// Geometric overlap hidden by a third paper is not a usable clue.
export function visibleRelations(papers){
  const pairs=new Map(),epsilon=.0002;
  papers.forEach((paper,i)=>paper.poly.forEach((a,j)=>{const b=paper.poly[(j+1)%4],dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy),nx=dy/length,ny=-dx/length;
    for(let k=1;k<40;k++){const q={x:a.x+dx*k/40,y:a.y+dy*k/40},inner={x:q.x-nx*epsilon,y:q.y-ny*epsilon},outer={x:q.x+nx*epsilon,y:q.y+ny*epsilon};if(topAt(papers,inner)!==i)continue;const lower=topAt(papers,outer);if(lower<0||lower>=i||!inside(papers[lower].poly,inner))continue;const pair=[papers[lower].id,paper.id];pairs.set(pair.join('|'),pair);}
  }));return [...pairs.values()];
}
export function orderCount(papers,relations){
  let count=0;const visit=ids=>{if(count>=3)return;if(ids.length===papers.length){count++;return;}for(const paper of papers)if(!ids.includes(paper.id)&&relations.filter(r=>r[1]===paper.id).every(r=>ids.includes(r[0])))visit([...ids,paper.id]);};visit([]);return count;
}
export function stackActivity(meta,variant){
  const conditional=meta.recipe==='conditional',six=meta.recipe==='peel6'&&variant%2===0,rectangle=meta.recipe==='peel6'&&!six;
  const layout=stackLayouts[conditional?'conditional8':six?'square6':rectangle?'rectangle8':'square8'],count=layout.length;
  const papers=layout.map((item,i)=>({...item,id:String.fromCharCode(65+(i*(count===6?5:3)+variant)%count),color:i}));
  const visible=visibleRelations(papers),relations=conditional?[...visible,...papers.slice(0,-1).map(p=>[p.id,papers.at(-1).id])]:visible;
  return {papers,relations,visibleRelations:visible,conditionTop:conditional?papers.at(-1).id:null,bottom:papers[0].id,top:papers.at(-1).id,order:papers.map(p=>p.id),build:meta.recipe==='build'};
}
