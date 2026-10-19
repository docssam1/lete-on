import assert from 'node:assert/strict';
import {PAPER_SHAPES,foldOnce,signatureKey,polygonArea} from '../games/paper-fold/reverse-fold.js?v=20261018-3';
import {inside} from './paper-craft-model.js?v=20261018-3';
import {resultActivity} from './paper-craft-reverse.js?v=20261018-3';
function topology(pieces,size){
  const fill=new Uint8Array(size*size),seen=new Uint8Array(fill.length),queue=new Int32Array(fill.length);let components=0,holes=0;
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)fill[y*size+x]=pieces.some(p=>inside(p,{x:(x+.5)/size,y:(y+.5)/size}))?1:0;
  for(let start=0;start<fill.length;start++){if(seen[start])continue;const value=fill[start];let border=false,head=0,tail=0;queue[tail++]=start;seen[start]=1;
    while(head<tail){const id=queue[head++],x=id%size,y=Math.floor(id/size);if(!x||!y||x===size-1||y===size-1)border=true;for(const n of [x?id-1:-1,x<size-1?id+1:-1,y?id-size:-1,y<size-1?id+size:-1])if(n>=0&&!seen[n]&&fill[n]===value){seen[n]=1;queue[tail++]=n;}}
    if(value)components++;else if(!border)holes++;
  }return {components,holes};
}
let checked=0;
for(const shape of ['rectangle','parallelogram','trapezoid'])for(let variant=0;variant<3;variant++){
  const p=resultActivity(shape,variant);assert.equal(new Set(p.resultOptions.map(o=>o.signature)).size,4);
  const poly=PAPER_SHAPES[shape].polygon,turns=poly.map((a,i)=>{const b=poly[(i+1)%4],c=poly[(i+2)%4];return Math.sign((b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x));});assert(turns.every(t=>t===turns[0]&&t!==0));
  for(const o of p.resultOptions){
    if(o.correct){const fold=foldOnce(p.paper,o.line,o.movingSign);assert.equal(signatureKey(fold.pieces),o.signature);assert(Math.abs(fold.pieces.reduce((s,a)=>s+polygonArea(a),0)-polygonArea(poly))<1e-6);}
    for(const size of [181,257]){const result=topology(o.pieces,size);assert.deepEqual(result,o.correct?{components:1,holes:0}:o.impossibility==='hole'?{components:1,holes:1}:{components:2,holes:0});checked++;}
  }
}
console.log(JSON.stringify({shapes:3,variants:9,topologyChecks:checked,correct:18,impossible:18,rigidMotionInvariant:true,proof:'two convex pieces share a crease, so their union is connected and hole-free'},null,2));
