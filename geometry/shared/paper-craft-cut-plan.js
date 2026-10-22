import {polygonCentroid,inside,box} from './paper-craft-model.js?v=20261018-3';

export const cutAnchor=m=>m.kind==='circle'?m.center:polygonCentroid(m.poly);
// Every point on the packet is an input, including wrong guesses. No answer
// locations become buttons, focus stops or pointer targets.
export function placedCut(p,index,point){
  if(!Number.isInteger(index)||!p.marks[index]||!point||!Number.isFinite(point.x)||!Number.isFinite(point.y)||!inside(p.paperStages.at(-1),point))return null;
  const source=p.marks[index],a=cutAnchor(source),dx=point.x-a.x,dy=point.y-a.y;
  return source.kind==='circle'?{...source,center:{x:point.x,y:point.y}}:{...source,poly:source.poly.map(q=>({x:q.x+dx,y:q.y+dy}))};
}
export function matchesCutPlan(p,placements){
  if(!Array.isArray(placements)||placements.length!==p.marks.length)return false;
  const b=box(p.paperStages.at(-1)),tolerance=Math.min(b.right-b.left,b.bottom-b.top)*.06;
  const signature=m=>{const a=cutAnchor(m);return m.kind==='circle'?'circle:'+m.radius:m.poly.map(q=>`${(q.x-a.x).toFixed(6)},${(q.y-a.y).toFixed(6)}`).sort().join('|');};
  const remaining=new Set(p.marks.map((_,i)=>i));
  return p.marks.every((m,i)=>{const q=placements[i];if(!placedCut(p,i,q))return false;const match=[...remaining].find(j=>signature(m)===signature(p.marks[j])&&Math.hypot(cutAnchor(p.marks[j]).x-q.x,cutAnchor(p.marks[j]).y-q.y)<=tolerance);if(match===undefined)return false;remaining.delete(match);return true;});
}
