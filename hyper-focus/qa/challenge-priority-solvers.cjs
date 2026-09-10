'use strict';
const assert=require('node:assert/strict');
const only=xs=>{assert.equal(xs.length,1,'exactly one valid response required');return xs[0];};
function solve(p){
  switch(p.typeId||p.kind){
    case 'priority-length-units':{
      const mixed=[];
      for(let pencil=1;pencil<=30;pencil++)for(let crayon=1;crayon<=30;crayon++){
        if(pencil+p.topLeft+p.topRight===crayon+p.bottomLeft+p.bottomRight)mixed.push(pencil-crayon);
      }
      return only([...new Set(mixed)]);}
    case 'priority-diagonal-length':{
      const totals=p.paths.map(points=>points.slice(1).reduce((sum,[x,y],i)=>sum+Math.hypot(x-points[i][0],y-points[i][1]),0));
      assert.equal(new Set(totals.map(n=>n.toFixed(9))).size,3);
      const order=totals.map((n,i)=>({n,label:p.labels[i]})).sort((a,b)=>a.n-b.n);
      const difference=order.at(-1).n-order[0].n;assert(Math.abs(difference-Math.round(difference))<1e-9);
      return [order.map(o=>o.label),Math.round(difference)];}
    case 'priority-route-count':{
      const routes=[];
      function visit(x,y,seen,steps){
        if(x===p.end[0]&&y===p.end[1]){if(seen)routes.push(steps);return;}
        for(const [dx,dy] of [[1,0],[0,1]]){
          const nx=x+dx,ny=y+dy;if(nx>p.columns||ny>p.rows)continue;
          if(p.blocked.some(([a,b])=>a[0]===x&&a[1]===y&&b[0]===nx&&b[1]===ny))continue;
          visit(nx,ny,seen||(nx===p.via[0]&&ny===p.via[1]),steps+(dx?'R':'U'));
        }
      }visit(...p.start,false,'');return routes.length;}
    case 'priority-cube-top-view':{
      const occupied=[];p.heights.forEach((row,y)=>row.forEach((h,x)=>{if(h>0)occupied.push(y*3+x);}));
      return only(p.options.flatMap((cells,i)=>JSON.stringify([...cells].sort((a,b)=>a-b))===JSON.stringify(occupied)?[i+1]:[]));}
    case 'priority-fold-holes':{
      const punched=[];
      // Follow every original cell forward through the two folds, not a stored answer mask.
      for(let y=0;y<p.size;y++)for(let x=0;x<p.size;x++){
        let u=x,v=y;
        for(const fold of p.folds){if(fold==='left-to-right'&&u<p.size/2)u=p.size-1-u;else if(fold==='top-to-bottom'&&v<p.size/2)v=p.size-1-v;}
        if(u===p.hole[0]&&v===p.hole[1])punched.push(y*p.size+x);
      }return punched;}
    case 'priority-card-rank':{
      const values=[];for(const a of p.cards)for(const b of p.cards)if(a!==0&&a!==b)values.push(a*10+b);
      const sorted=[...new Set(values)].sort((a,b)=>a-b);
      assert(sorted.length>=Math.max(p.largestRank,p.smallestRank));
      return sorted[sorted.length-p.largestRank]-sorted[p.smallestRank-1];}
    default:throw Error('Missing priority solver '+p.typeId);
  }
}
module.exports={solve};
