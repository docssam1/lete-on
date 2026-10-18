import assert from 'node:assert/strict';
import {buildActivity,activityIds} from './paper-craft-catalog.js?v=20261018-3';
import {inside,markContains,polygonArea,reflect,boundaryLayers} from './paper-craft-model.js?v=20261018-3';
import {clipHalfPlane} from '../games/paper-fold/reverse-fold.js?v=20261018-3';
const distance=(p,a,b)=>{const x=b.x-a.x,y=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*x+(p.y-a.y)*y)/(x*x+y*y)));return Math.hypot(p.x-a.x-t*x,p.y-a.y-t*y);};
function components(size,active){
  const cells=new Uint8Array(size*size),seen=new Uint8Array(cells.length),queue=new Int32Array(cells.length);let count=0;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)cells[y*size+x]=active({x:(x+.5)/size,y:(y+.5)/size})?1:0;
  for(let start=0;start<cells.length;start++){if(!cells[start]||seen[start])continue;count++;let head=0,tail=0;queue[tail++]=start;seen[start]=1;while(head<tail){const id=queue[head++],x=id%size,y=Math.floor(id/size);for(const n of [x>0?id-1:-1,x<size-1?id+1:-1,y>0?id-size:-1,y<size-1?id+size:-1])if(n>=0&&cells[n]&&!seen[n]){seen[n]=1;queue[tail++]=n;}}}
  return count;
}
let sampledNumberPoints=0,inkTransforms=0;
for(const id of activityIds){const p=buildActivity(id);
  if(p.folds)for(let i=0;i<p.folds.length;i++){const f=p.folds[i],moving=clipHalfPlane(p.paperStages[i],f,f.moving);assert(moving.map(q=>reflect(f,q)).every(q=>inside(p.paperStages[i+1],q)),id+' flap leaves stated footprint');}
  if(p.family==='number')for(let cell=0;cell<16;cell++)for(const u of [.19,.47,.79])for(const v of [.19,.47,.79]){const q={x:(cell%4+u)/4,y:(Math.floor(cell/4)+v)/4},cut=p.markStages.at(-1).some(m=>markContains(m,q));assert.equal(p.target.includes(cell),p.askRemain?!cut:cut,id+' cut-cell geometry');sampledNumberPoints++;}
  for(const layer of p.stages?.flat()||[]){if(!layer.ink)continue;const [a,b,c,d]=layer.ink;assert(Math.abs(a*a+b*b-1)<1e-6);assert(Math.abs(c*c+d*d-1)<1e-6);assert(Math.abs(a*c+b*d)<1e-6);assert(Math.abs(a*d-b*c-(layer.front?1:-1))<1e-6);inkTransforms++;}
}
const raster=[];
for(const size of [181,257]){
  for(const [id,expected] of [['PF-A07-1',12],['PF-B09-1',4]]){const p=buildActivity(id),count=components(size,q=>p.allCuts.every(([a,b])=>distance(q,a,b)>.72/size));assert.equal(count,expected,id+' raster '+size);raster.push({id,size,count});}
  for(const [id,expected] of [['PF-A08-1',4],['PF-A09-1',6],['PF-A10-1',8]]){const p=buildActivity(id),count=components(size,q=>p.markStages.at(-1).some(m=>markContains(m,q)));assert.equal(count,expected,id+' holes '+size);raster.push({id,size,count});}
}
const top=buildActivity('PF-C01-1');assert.equal(top.sourceLayers.length,16);for(const l of top.sourceLayers){assert.equal(l.poly.length,3);assert(Math.abs(polygonArea(l.poly)-1/32)<1e-7);}assert.equal(top.stages.at(-1).length,16);
let partialFoldSamples=0;
for(let variant=1;variant<=4;variant++){const p=buildActivity('PF-C04-'+variant);assert.deepEqual(p.depths.map(d=>[d.min,d.max]),[[1,1],[2,2],[4,4],[4,8],[8,8]]);
  assert.deepEqual([...new Set(boundaryLayers(p.paperStages[3],p.stages[3]).map(e=>e.layers))].sort((a,b)=>a-b),[4,8],'partial fold sides must show their real depths');
  for(let y=0;y<101;y++)for(let x=0;x<101;x++){const original={x:(x+.379)/101,y:(y+.613)/101};let q=original;for(const f of p.folds)if((q.x*f.nx+q.y*f.ny-f.c)*f.moving>1e-7)q=reflect(f,q);assert.equal(p.marks.some(m=>markContains(m,q)),p.markStages.at(-1).some(m=>markContains(m,original)),'independent partial-fold projection');partialFoldSamples++;}
}
console.log(JSON.stringify({sampledNumberPoints,partialFoldSamples,inkTransforms,raster,triangularNumberCells:16},null,2));
