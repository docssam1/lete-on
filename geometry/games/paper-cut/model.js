import {clipHalfPlane,lineThrough,polygonArea,polygonCentroid} from '../paper-fold/reverse-fold.js';
export const square=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
export const anchors=square.flatMap((a,i)=>[0,.25,.5,.75].map(t=>({x:a.x+(square[(i+1)%4].x-a.x)*t,y:a.y+(square[(i+1)%4].y-a.y)*t})));
export function corners(points){
 // The shared fold clipper rounds coordinates to six decimals. Collapse its
 // sub-pixel corner slivers before counting polygon sides.
 const clean=points.filter((p,i)=>Math.hypot(p.x-points[(i+points.length-1)%points.length].x,p.y-points[(i+points.length-1)%points.length].y)>1e-5);
 return clean.filter((p,i)=>{const a=clean[(i+clean.length-1)%clean.length],b=clean[(i+1)%clean.length];return Math.abs((p.x-a.x)*(b.y-p.y)-(p.y-a.y)*(b.x-p.x))>1e-5;});
}
export function split(pieces,a,b){
 if(!a||!b||Math.hypot(a.x-b.x,a.y-b.y)<1e-5)return pieces;
 const line=lineThrough(a,b);
 return pieces.flatMap(piece=>[1,-1].map(sign=>corners(clipHalfPlane(piece,line,sign))).filter(part=>polygonArea(part)>1e-6));
}
export const piecesAfter=cuts=>cuts.reduce((pieces,[a,b])=>split(pieces,a,b),[square]);
export function tally(pieces){return pieces.reduce((result,piece)=>{const n=corners(piece).length;result[n]=(result[n]||0)+1;return result;},{});}
export const equalCounts=(a={},b={})=>[3,4,5,6,7,8].every(n=>(a[n]||0)===(b[n]||0));
export const center=polygonCentroid;
export const area=polygonArea;
export function candidate(task,a,b){
 const before=piecesAfter(task.cuts),after=split(before,a,b);
 return {pieces:after,changed:after.length>before.length,correct:after.length>before.length&&equalCounts(tally(after),task.target)};
}
export function solutions(task){
 return anchors.flatMap((a,i)=>anchors.slice(i+1).flatMap(b=>candidate(task,a,b).correct?[[a,b]]:[]));
}
const p=(x,y)=>({x,y}), line=(x,y,u,v)=>[p(x,y),p(u,v)];
const rotate=p=>({x:1-p.y,y:p.x});
const turn=(cuts,n)=>cuts.map(cut=>cut.map(point=>{for(let i=0;i<n;i++)point=rotate(point);return point;}));
const countBases=[line(.5,0,.5,1),line(1,0,.25,1),line(0,0,1,1),line(.5,0,1,.5)];
const goalBases=[
 {cuts:[],target:{4:2}}, {cuts:[],target:{3:1,5:1}},
 {cuts:[line(0,1,1,0)],target:{3:4}},
 {cuts:[line(.5,0,.5,1)],target:{3:2,4:1}},
 {cuts:[line(.75,0,.75,1)],target:{4:4}},
 {cuts:[line(0,.5,1,.5)],target:{3:1,4:2}}
];
function canonical(cuts){return cuts.map(cut=>cut.map(p=>`${p.x},${p.y}`).sort().join('/')).sort().join('|');}
function unique(items){return [...new Map(items.map(item=>[`${canonical(item.cuts)}-${JSON.stringify(item.target||{})}`,item])).values()];}
export const bank={
 count:unique(countBases.flatMap((cut,i)=>[0,1,2,3].map(r=>({id:`count-${i+1}-${r}`,cuts:turn([cut],r),referenceKind:i<2?'reference-structure':'authored-extension'})))),
 make:unique(goalBases.flatMap((base,i)=>[0,1,2,3].map(r=>({...base,id:`make-${i+1}-${r}`,cuts:turn(base.cuts,r),referenceKind:'reference-structure'}))))
};
