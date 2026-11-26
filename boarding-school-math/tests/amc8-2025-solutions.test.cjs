const test=require('node:test'),assert=require('node:assert/strict'),data=require('../competition/paper-solutions/amc8-2025.json'),keys=require('../competition/amc-original-answer-key-reference.js'),layout=require('../shared/paper-edition-layout.js'),catalog=require('../competition/paper-edition-catalog.js');
const item=n=>data.items[n-1],result=(n,value)=>assert.equal(item(n).result,String(value));
function* permutations(a){if(!a.length){yield [];return;}for(let i=0;i<a.length;i++)for(const p of permutations(a.slice(0,i).concat(a.slice(i+1))))yield [a[i],...p];}
function* combinations(a,k,start=0,p=[]){if(!k){yield p;return;}for(let i=start;i<=a.length-k;i++)yield* combinations(a,k-1,i+1,p.concat(a[i]));}
const sum=a=>a.reduce((x,y)=>x+y,0),range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
function prime(n){for(let d=2;d*d<=n;d++)if(n%d===0)return false;return n>1;}

test('a complete standalone explanation set matches all 25 original keys and never advertises translated stems',()=>{
 assert.deepEqual(layout.validateSolutions(data,data.paper,keys).languages,['en','ko','zh-Hans']);assert.equal(catalog.entryFor('amc8',2025,''),null);assert.equal(catalog.solutionEntryFor('amc8',2025,'').url,'./competition/paper-solutions/amc8-2025.json');
 for(const q of data.items)for(const v of Object.values(q.versions)){assert.ok(v.steps.length>=2);assert.ok(v.check);assert.equal(v.stem,undefined);assert.equal(v.choices,undefined);}
 const bad=structuredClone(data);bad.items[0].answer='A';assert.throws(()=>layout.validateSolutions(bad,bad.paper,keys),/wrong-answer-key/);bad.items[0].answer=item(1).answer;bad.items[1].versions.ko.stem='Must not masquerade as a question translation';assert.throws(()=>layout.validateSolutions(bad,bad.paper,keys),/solution-only/);assert.throws(()=>layout.validateSolutions(data,{program:'amc8',year:2024,form:''},keys),/wrong-paper/);
 const missing=structuredClone(data);missing.items.pop();assert.throws(()=>layout.validateSolutions(missing,missing.paper,keys),/incomplete-solutions/);const partial=structuredClone(data);delete partial.items[24].versions.ko;assert.deepEqual(layout.validateSolutions(partial,partial.paper,keys).languages,['en','zh-Hans']);
});
test('unit-area, value, equal-sharing, sequence, grid-distance and divisibility calculations (1–7)',()=>{
 result(1,(4+8/2)/16*100+'%');result(2,sum([10000,4*100,2*10,3]));result(3,4*15/6);result(4,100-9*7);
 const p=[[6,5],[7,3],[0,0],[2,4],[6,5]];result(5,sum(p.slice(1).map((q,i)=>Math.abs(q[0]-p[i][0])+Math.abs(q[1]-p[i][1]))));const erased=range(15,19).filter(n=>(sum(range(15,19))-n)%4===0);assert.equal(erased.length,1);result(6,erased[0]);result(7,50-13);
});
test('surface-area, equal-weight averages and rectangle intersection (8–10)',()=>{
 assert.equal((18/6)**1.5,3*Math.sqrt(3));result(8,'3√3');result(9,sum(range(1,6).map(n=>(n+n+6)/2))/6);
 // The rotated rectangle spans x=0..3,y=−2.5..2.5. Intersect intervals independently.
 const overlap=(Math.min(2.5,3)-Math.max(-2.5,0))*(Math.min(3,2.5)-Math.max(0,-2.5));result(10,2*5*3-overlap);
});
function orientations(shape){const seen=new Map();for(const flip of [1,-1])for(let turns=0;turns<4;turns++){const pts=shape.map(([r,c])=>{r*=flip;for(let t=0;t<turns;t++)[r,c]=[-c,r];return [r,c];});const minr=Math.min(...pts.map(p=>p[0])),minc=Math.min(...pts.map(p=>p[1]));const normalized=pts.map(([r,c])=>[r-minr,c-minc]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);seen.set(JSON.stringify(normalized),normalized);}return [...seen.values()];}
function placements(shape){const masks=new Set();for(const variant of orientations(shape))for(let r=0;r<3;r++)for(let c=0;c<4;c++){const points=variant.map(([x,y])=>[x+r,y+c]);if(points.every(([x,y])=>x<3&&y<4))masks.add(points.reduce((mask,[x,y])=>mask|(1<<(x*4+y)),0));}return [...masks];}
test('exhaustive rotated/reflected exact covers validate the tiling choice and the displayed witness (11)',()=>{
 const shapes={I:[[0,0],[1,0],[2,0],[3,0]],O:[[0,0],[1,0],[0,1],[1,1]],L:[[0,0],[1,0],[2,0],[2,1]],T:[[0,0],[0,1],[0,2],[1,1]],S:[[0,1],[0,2],[1,0],[1,1]]},p=Object.fromEntries(Object.entries(shapes).map(([n,s])=>[n,placements(s)]));
 const choices=[['I','L'],['I','T'],['L','L'],['L','S'],['O','T']],valid=choices.filter(([a,b])=>p.S.some(s=>p[a].some(x=>!(s&x)&&p[b].some(y=>!(y&s)&&!(y&x)&&(s|x|y)===4095))));assert.deepEqual(valid,[['L','L']]);result(11,'L + L');
 const grid=item(11).versions.en.grid;for(const [letter,shape]of [['L','L'],['R','L'],['S','S']]){let mask=0;grid.forEach((row,r)=>[...row].forEach((x,c)=>{if(x===letter)mask|=1<<(r*4+c);}));assert.ok(p[shape].includes(mask));}for(const v of Object.values(item(11).versions))assert.deepEqual(v.grid,grid);
});
test('all polygon edges verify the candidate inscribed circle, with an algebraic upper-bound certificate (12)',()=>{
 const cells=new Set();[[-1,1],[-2,2],[-3,3],[-3,3],[-2,2],[-1,1]].forEach(([lo,hi],i)=>{for(let x=lo;x<hi;x++)cells.add(x+','+(i-3));});let min=Infinity;
 function distanceSquared(a,b){const [x,y]=a,[u,v]=b,t=Math.max(0,Math.min(1,(-x*(u-x)-y*(v-y))/((u-x)**2+(v-y)**2)));return (x+t*(u-x))**2+(y+t*(v-y))**2;}
 for(const cell of cells){const [x,y]=cell.split(',').map(Number);for(const [dx,dy,a,b]of [[-1,0,[x,y],[x,y+1]],[1,0,[x+1,y],[x+1,y+1]],[0,-1,[x,y],[x+1,y]],[0,1,[x,y+1],[x+1,y+1]]])if(!cells.has((x+dx)+','+(y+dy)))min=Math.min(min,distanceSquared(a,b));}
 assert.equal(min,5);for(let a=0;a<=1;a+=.025)for(let b=0;b<=1;b+=.025)assert.ok((1-a)**2+(2-b)**2<=5+1e-9);result(12,'5π');
});
test('remainder histogram, inserted median, pair extremes and all legal number selections (13–16)',()=>{
 const f=Array(7).fill(0);for(let n=2;n<=50;n+=2)f[n%7]++;result(13,f.join(', '));const median=a=>{a.sort((x,y)=>x-y);return (a[2]+a[3])/2;},possible=range(-100,100).filter(n=>(50+n)/6===2*median([2,6,7,7,28,n]));assert.deepEqual(possible,[34]);result(14,possible[0]);
 const pairs=[];for(let ss=0;ss<=18;ss++)for(let sg=0;sg<=18;sg++){const gg=18-ss-sg;if(gg>=0&&2*ss+sg===13)pairs.push(gg);}result(15,Math.min(...pairs)+Math.max(...pairs));
 const sums=new Set();for(const a of combinations(range(1,10),5))for(const b of combinations(range(11,20),5))if(!a.some(n=>b.includes(n+10)))sums.add(sum(a)+sum(b));assert.deepEqual([...sums],[105]);result(16,[...sums][0]);
});
test('fractional populations, area scaling, piecewise travel times and repeated shares (17–20)',()=>{
 result(17,100*(1-1/4-1/5)+120/3+160/8);result(18,Math.sqrt(4));const x=8.5;assert.equal(5/25+(x-5)/40,5/20+(10-x)/40);assert.ok(x>=5&&x<=10);result(19,x);
 const shares=Array.from({length:15},(_,i)=>2**(-1-3*i));assert.ok(Math.abs(sum(shares)-4/7)<1e-12);result(20,'4/7');
});
test('all 7! grade assignments verify the non-neighbour proof and invariant (21)',()=>{
 const edges=['AB','AC','AF','AG','BC','BF','CF','CD','CE','DE','EF','FG'],rows=[];for(const perm of permutations(range(1,7))){const d=Object.fromEntries([...'ABCDEFG'].map((v,i)=>[v,perm[i]]));if(edges.every(([a,b])=>Math.abs(d[a]-d[b])>=2))rows.push(d);}assert.equal(rows.length,2);assert.deepEqual([...new Set(rows.map(d=>d.C+d.E+d.F))],[12]);result(21,12);const order='CGBEADF';for(const d of rows)assert.ok([order,[...order].reverse().join('')].includes([...Object.keys(d)].sort((a,b)=>d[a]-d[b]).join('')));
});
test('all hook arrangements, four-digit semiprimes, integer trapezoids and path areas (22–25)',()=>{
 const coats=[];for(let c=1;c<=35;c++)for(let e=1;e<=35;e++)if(c+(c+1)*e===35)coats.push(c);assert.deepEqual(coats,[1,2,3,5,8,11,17]);result(22,coats.length);
 const numbers=[];for(let n=1099;n<=9999;n+=100){if(!Number.isInteger(Math.sqrt(n+1)))continue;let m=n,count=0;for(let d=2;d<=m;d++)while(m%d===0){count++;m/=d;}if(count===2)numbers.push(n);}assert.deepEqual(numbers,[3599]);assert.ok(prime(59)&&prime(61));result(23,numbers.length);
 const trapezoids=[];for(let a=1;a<30;a++)for(let b=1;b<30;b++)if(3*a+2*b===30)trapezoids.push([a,b]);assert.deepEqual(trapezoids,[[2,12],[4,9],[6,6],[8,3]]);result(24,trapezoids.length);
 const areas=[];for(const steps of combinations(range(0,9),5)){const path=range(0,9).map(i=>steps.includes(i)?'R':'L');let area=0;for(let i=0;i<10;i++)for(let j=i+1;j<10;j++)if(path[i]==='R'&&path[j]==='L')area++;areas.push(area);}assert.equal(areas.length,252);result(25,sum(areas));
});
