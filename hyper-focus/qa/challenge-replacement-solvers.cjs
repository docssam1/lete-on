'use strict';
const assert=require('node:assert/strict');
const permutations=a=>a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>j!==i)).map(p=>[v,...p])):[[]];
const one=a=>{assert.equal(a.length,1,'replacement has ambiguous answers');return a[0];};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
// Preserve connectivity: two polylines can share vertices but have different edges.
const normalize=points=>points.slice(1).map((p,i)=>[points[i].join(','),p.join(',')].sort().join(':')).sort().join('|');
const between=(a,b,c)=>Math.min(b,c)<a&&a<Math.max(b,c);
function solve(p){
  switch(p.typeId){
    case 'replace-house-between':{
      const possible=permutations(p.people).filter(a=>p.between.every(([m,x,y])=>between(a.indexOf(m),a.indexOf(x),a.indexOf(y))));
      assert.equal(possible.length,2,'left-right reflection should remain valid');return one([...new Set(possible.map(a=>a[2]))]);}
    case 'replace-count-constraints':return one(Array.from({length:p.upper-p.lower-1},(_,i)=>p.lower+1+i).filter(n=>n%2===0&&!p.excluded.includes(n)));
    case 'replace-divided-square-cycle':{
      let period=0;for(let k=1;k<p.sequence.length;k++)if(p.sequence.every((a,i)=>same(a,p.sequence[i%k]))){period=k;break;}assert.equal(period,4);
      return Array.from({length:p.missingCount},(_,i)=>p.sequence[(p.sequence.length+i)%period]);}
    case 'replace-paper-remainder':{
      const remaining=p.total-p.known.reduce((s,n)=>s+n,0);assert.equal(remaining%p.equalColors,0);return remaining/p.equalColors-p.used;}
    case 'replace-age-chain':{let ages=[p.baseAge];for(const gap of p.gaps)ages.push(ages.at(-1)+gap);return [ages,p.sumPeople.reduce((s,i)=>s+ages[i]+p.years,0)];}
    case 'replace-student-queue':return one(permutations(p.people).filter(a=>{const i=n=>a.indexOf(n);return between(...p.between.map(i))&&i(p.immediatelyBehind[0])===i(p.immediatelyBehind[1])+1&&i(p.notLast)!==3;}));
    case 'replace-compound-matrix':{
      const missing=p.matrix[2].indexOf(null),row=p.matrix[2],col=p.matrix.map(r=>r[missing]);
      const item=one([0,1,2].filter(v=>!row.includes(v)&&!col.includes(v)));return one(p.options.flatMap((opt,i)=>same(opt,p.pairs[item])?[i+1]:[]));}
    case 'replace-missing-star-combination':{
      const combos=[];for(let mask=0;mask<2**p.slots;mask++){const cells=Array.from({length:p.slots},(_,i)=>i).filter(i=>mask&(1<<i));if(cells.length===p.choose)combos.push(cells);}
      assert.equal(p.shown.length,5);assert.equal(new Set(p.shown.map(a=>a.join(','))).size,5);
      return one(combos.filter(c=>!p.shown.some(a=>same(a,c))));}
    case 'replace-magic-triangle':return one(permutations(p.values).filter(a=>Object.entries(p.givens).every(([i,v])=>a[i]===v)&&p.lines.every(line=>line.reduce((s,i)=>s+a[i],0)===p.target)));
    case 'replace-fruit-pair-cancel':{
      assert.equal(p.order.length,20);const basket=[];for(const kind of p.order){const i=basket.indexOf(kind);if(i===-1)basket.push(kind);else basket.splice(i,1);}const names={apple:'사과',pear:'배',berry:'딸기',orange:'귤'};return basket.sort().map(k=>names[p.kinds[k]]);}
    case 'replace-line-rotation-series':{
      const rotate=(pts,t)=>{for(let k=0;k<t;k++)pts=pts.map(([x,y])=>[2-y,x]);return pts;};
      const step=one([0,1,2,3].filter(t=>p.examples.every((a,i)=>normalize(a)===normalize(rotate(p.examples[0],i*t)))));
      const expected=rotate(p.examples[0],(p.targetPosition-1)*step),option=one(p.options.flatMap((a,i)=>normalize(a)===normalize(expected)?[i+1]:[]));
      assert.equal(p.examples.length,9);assert.equal(p.targetPosition,18);return option;}
    default:throw Error('unknown replacement '+p.typeId);
  }
}
module.exports={solve};
