const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const q=require('../challenge/exam-more.js').all[4].main[11],p=q.payload,solve=require('./challenge-more-solvers.cjs').solve;
assert.equal(solve(p),12);
const orientations=p.bricks.reduce((s,b)=>{s[b.slice(3).indexOf(2)]++;return s;},[0,0,0]);assert(orientations.every(n=>n>0));
const occupied=new Map();p.bricks.forEach(([x,y,z,dx,dy,dz],i)=>{for(let a=x;a<x+dx;a++)for(let b=y;b<y+dy;b++)for(let c=z;c<z+dz;c++)occupied.set([a,b,c].join(),i);});
const ownerAt=pos=>occupied.get(pos.map(Math.floor).join());
const visible=new Set(),topColumns=[];
function clear(point){for(let t=.025;t<8;t+=.025){const hit=ownerAt(point.map(n=>n+t));if(hit!==undefined)return false;}return true;}
for(const [key,id] of occupied){const cell=key.split(',').map(Number);for(let axis=0;axis<3;axis++){const point=cell.map((n,i)=>n+(i===axis?1:.5));if(clear(point))visible.add(id);}}
p.heights.forEach((row,y)=>row.forEach((h,x)=>{const point=[x+.5,y+.5,h];assert(clear(point),'top surface hidden at '+[x,y]);topColumns.push([x,y,h]);}));
const hidden=p.bricks.map((_,i)=>i).filter(i=>!visible.has(i));assert(hidden.length>0,'must require hidden blocks');
assert.throws(()=>solve({...p,solid:false}));assert.throws(()=>solve({...p,bricks:p.bricks.slice(1)}));assert.throws(()=>solve({...p,bricks:[...p.bricks,p.bricks[0]]}));
const result={passed:true,blocks:12,layers:[12,8,4],orientations:{leftRight:orientations[0],frontBack:orientations[1],upright:orientations[2]},hiddenBlockIndices:hidden,visibleTopColumns:topColumns.length,conditions:'solid to floor; exposed top surfaces; matching side elevation',notAnOverallRoundApproval:true};
fs.writeFileSync(path.resolve(__dirname,'../output/qa/challenge-editions-separated/stack-visibility.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result));
