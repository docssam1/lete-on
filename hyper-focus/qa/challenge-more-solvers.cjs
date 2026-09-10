const perm=a=>a.length?a.flatMap((x,i)=>perm(a.filter((_,j)=>i!==j)).map(b=>[x,...b])):[[]];
const only=a=>{const u=[...new Set(a.map(JSON.stringify))].map(JSON.parse);if(u.length!==1)throw Error('Expected one answer, found '+u.length);return u[0];};
const norm=p=>{const x=Math.min(...p.map(t=>t[0])),y=Math.min(...p.map(t=>t[1]));return p.map(([a,b])=>[a-x,b-y]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);};
const tileBases=[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[0,1],[1,1]],[[1,0],[2,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[1,1]]];
function variants(p){const m=new Map;for(const f of [1,-1])for(let r=0;r<4;r++){let a=p.map(([x,y])=>[x*f,y]);for(let i=0;i<r;i++)a=a.map(([x,y])=>[-y,x]);a=norm(a);m.set(JSON.stringify(a),a);}return [...m.values()];}
function tileSolutions(target){const set=new Set(target.map(String)),sol=[];for(let i=0;i<5;i++)for(const v of variants(tileBases[i]))for(let x=0;x<=Math.max(...target.map(p=>p[0]));x++)for(let y=0;y<=Math.max(...target.map(p=>p[1]));y++){const a=v.map(([u,w])=>[u+x,w+y]);if(!a.every(c=>set.has(String(c))))continue;const rest=target.filter(c=>!a.some(p=>String(c)===String(p)));for(let j=i+1;j<5;j++)if(variants(tileBases[j]).some(t=>JSON.stringify(t)===JSON.stringify(norm(rest))))sol.push({pair:[i+1,j+1],parts:[a,rest]});}return sol;}
function paths(w,h,a,b,blocked=[]){
 const total=w*h,out=[],closed=new Set(blocked),used=new Uint8Array(total);
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||![a,b].every(n=>Number.isInteger(n)&&n>=0&&n<total))throw Error('invalid grid path');
 if(a===b||closed.has(a)||closed.has(b))return out;
 const adj=n=>[n%w?n-1:-1,n%w<w-1?n+1:-1,n>=w?n-w:-1,n<w*(h-1)?n+w:-1].filter(x=>x>=0);
 used[a]=1;
 function go(n,p){
  if(n===b){out.push(p.slice());return;}
  for(const v of adj(n))if(!used[v]&&!closed.has(v)){used[v]=1;p.push(v);go(v,p);p.pop();used[v]=0;}
 }
 go(a,[a]);return out;
}
function pathsFor(p){if(p.kind==='links'){
 const pairs=p.pairs||[],endpoints=pairs.flat();
 if(pairs.length<1||pairs.some(pair=>!Array.isArray(pair)||pair.length!==2))throw Error('links require endpoint pairs');
 if(new Set(endpoints).size!==endpoints.length)throw Error('link endpoints must be distinct');
 const out=[];
 function join(i,occupied,routes){
  if(i===pairs.length){out.push(routes.map(route=>route.slice()));return;}
  const forbidden=[...occupied,...pairs.slice(i+1).flat()];
  for(const route of paths(p.w,p.h,pairs[i][0],pairs[i][1],forbidden)){
   const next=new Set(occupied);for(const cell of route)next.add(cell);
   join(i+1,next,[...routes,route]);
  }
 }
 join(0,new Set(),[]);return out;
}
 const c=p.checkpoints;return paths(p.w,p.h,c[0],c.at(-1)).filter(a=>a.length===p.w*p.h&&c.every((n,i)=>i===0||a.indexOf(n)>a.indexOf(c[i-1]))).map(a=>[a]);}
function roll(p){let s={T:p.top,B:7-p.top,F:p.front,K:7-p.front,R:p.right,L:7-p.right};for(const m of p.moves){let a={...s};if(!['R','L','U','D'].includes(m))throw Error('unknown roll move '+m);if(m==='R')Object.assign(s,{T:a.L,R:a.T,B:a.R,L:a.B});if(m==='L')Object.assign(s,{T:a.R,L:a.T,B:a.L,R:a.B});if(m==='U')Object.assign(s,{T:a.F,K:a.T,B:a.K,F:a.B});if(m==='D')Object.assign(s,{T:a.K,F:a.T,B:a.F,K:a.B});}return s[p.query==='bottom'?'B':'T'];}
function solve(p){switch(p.kind){
 case 'carry-borrow':return p.items.map(([a,op,b])=>op==='-'?a-b:a+b);
 case 'checker-stack-count':{const answer={black:0,white:0};p.heightMap.forEach((row,y)=>row.forEach((height,x)=>{for(let z=0;z<height;z++)answer[(x+y+z+p.checkerOffset)%2===0?'black':'white']++;}));return answer;}
 case 'congruent-marked-partition':return p.boards.map(board=>board.parts);
 case 'tetra-cube-hole-count':return p.heightMap.flat().reduce((sum,height)=>sum+height,0)/p.tetraCubeSize;
 case 'object-length-equivalence':return p.query==='pencil-minus-two-erasers'?p.units.P-2*p.units.E:p.units.P;
 case 'block-build-count':return {A:p.width*p.depth*p.height-p.bPieces.length*2,B:p.bPieces.length};
 case 'stack-box-fill':return p.full-p.placed;
 case 'cube-count-fill-custom':return [p.placed,p.need];
 case 'shortest-path-grid':{
  const blocked=new Set(p.blocked.map(String)),key=point=>String(point),start=[0,p.rows],target=[p.cols,0],queue=[start],distance=new Map([[key(start),0]]),counts=new Map([[key(start),1]]);let head=0;
  while(head<queue.length){const point=queue[head++],pointKey=key(point),[x,y]=point,next=[];if(x<p.cols)next.push([x+1,y]);if(y>0)next.push([x,y-1]);for(const [from,to] of p.diagonals||[])if(key(from)===pointKey)next.push(to);
   for(const candidate of next){const candidateKey=key(candidate);if(blocked.has(candidateKey))continue;const nextDistance=distance.get(pointKey)+1;if(!distance.has(candidateKey)){distance.set(candidateKey,nextDistance);counts.set(candidateKey,counts.get(pointKey));queue.push(candidate);}else if(distance.get(candidateKey)===nextDistance)counts.set(candidateKey,counts.get(candidateKey)+counts.get(pointKey));}
  }
  return counts.get(key(target))||0;
 }
 case 'balance-substitution-pictures':{const query=p.equations.find(equation=>equation.query),weight=items=>items.reduce((total,item)=>total+p.values[item.key]*item.count,0);for(const equation of p.equations)if(weight(equation.left)!==weight(equation.right))throw Error('unbalanced relation');return query.answer;}
 case 'simple-path-network':{const neighbors=new Map(p.vertices.map(vertex=>[vertex.id,[]]));for(const[a,b]of p.edges){neighbors.get(a).push(b);neighbors.get(b).push(a);}let count=0;function visit(node,seen){if(node===p.end){count++;return;}for(const next of neighbors.get(node))if(!seen.has(next)){seen.add(next);visit(next,seen);seen.delete(next);}}visit(p.start,new Set([p.start]));return count;}
 case 'dice-target-bottom':{const step=(o,d)=>d==='N'?{top:o.south,bottom:o.north,north:o.top,south:o.bottom,east:o.east,west:o.west}:d==='S'?{top:o.north,bottom:o.south,north:o.bottom,south:o.top,east:o.east,west:o.west}:d==='E'?{top:o.west,bottom:o.east,north:o.north,south:o.south,east:o.top,west:o.bottom}:{top:o.east,bottom:o.west,north:o.north,south:o.south,east:o.bottom,west:o.top};return p.route.reduce(step,p.startOrientation).bottom;}
 case 'reverse-distribution':return only(Array.from({length:101},(_,n)=>n).filter(n=>n>=p.remainder&&(n-p.remainder)%p.groups===0&&(n-p.remainder)/p.groups-p.usedEach===p.afterEach));
 case 'card-boxes':{
  const solutions=[];const subsets=(a,n)=>a.reduce((all,x)=>all.concat(all.filter(s=>s.length<n).map(s=>[...s,x])),[[]]).filter(s=>s.length===n);
  function go(left,groups){const i=groups.length;if(i===p.counts.length){if(!left.length)solutions.push(groups);return;}for(const a of subsets(left,p.counts[i]))if(a.reduce((s,n)=>s+n,0)===p.totals[i]&&p.anchors[i].every(n=>a.includes(n)))go(left.filter(n=>!a.includes(n)),[...groups,a]);}go(p.cards,[]);
  return only(solutions.map(groups=>groups.map((a,i)=>['가','나','다'][i]+': '+a.join(', ')).join(' / ')));
 }
 case 'preference-table':{
  const choices=[];for(let mask=0;mask<1<<p.items.length;mask++){const a=p.items.map((_,i)=>!!(mask&(1<<i)));if(a.filter(Boolean).length===p.each)choices.push(a);}
  const solutions=[];function go(rows){const i=rows.length;if(i===p.names.length){if(p.totals.every((n,c)=>rows.filter(r=>r[c]).length===n))solutions.push(rows);return;}for(const a of choices)if(p.yes.filter(x=>x[0]===i).every(x=>a[x[1]])&&p.no.filter(x=>x[0]===i).every(x=>!a[x[1]]))go([...rows,a]);}go([]);
  return only(solutions.map(rows=>rows.map((row,i)=>p.names[i]+': '+p.items.filter((_,j)=>row[j]).join('·')).join(' / ')));
 }
 case 'changes':return p.changes.reduce((a,b)=>a+b,p.start);
 case 'reverse':return p.end-p.changes.reduce((a,b)=>a+b,0);
 case 'two-groups':return p.groups.flat().reduce((a,b)=>a+b,0);
 case 'rank-gap':return Math.abs(p.front-(p.total-p.back+1))-1;
 case 'transfer':return p.total-p.afterReceiver+p.moved;
 case 'chain':return p.total-p.known+p.add-p.end;
 case 'unknowns':{const values=p.equations.map(([n,op,result])=>only(Array.from({length:61},(_,x)=>x).filter(x=>op==='+'?n+x===result:n-x===result)));return p.select==='range'?Math.max(...values)-Math.min(...values):values.indexOf(Math.min(...values))+1;}
 case 'triples':{let n=0;for(let a=1;a<=p.max;a++)for(let b=a+1;b<=p.max;b++)for(let c=b+1;c<=p.max;c++)if(a+b+c===p.total)n++;return n;}
 case 'pair-sum':{let n=0;for(let a=1;a<=p.max;a++)for(let b=a+1;b<=p.max;b++)if(a+b+p.known===p.total)n++;return n;}
 case 'tree':{const x=p.total-p.left,y=x-p.leaf;if(new Set([p.total,p.left,p.leaf,x,y]).size!==5)throw Error('tree numbers not distinct');return `${x}, ${y}`;}
 case 'group':{if(p.mode==='group')return `${p.colors[(p.position-1)%2]} ${p.position}개`;if(p.mode==='sumSecond'){let sum=0;for(let i=2;i<=p.position;i+=2)sum+=i;return sum;}let n=p.position,g=1;while(n>g)n-=g++;return p.colors[(g-1)%2];}
 case 'runs':{let i=p.position,g=1;while(i>g+1)i-=g+++1;return i===1?'하얀색':'파란색';}
 case 'net':{const opposite=[2,3,0,1,5,4],a=p.query.map(i=>p.rule==='same'?p.values[opposite[i]]:7-p.values[opposite[i]]);return p.sum?a.reduce((x,y)=>x+y,0):a.join(', ');}
 case 'sequence':return p.values.at(-1)+p.step;
 case 'domino-pair':return `${2*p.left.at(-1)-p.left.at(-2)}, ${2*p.right.at(-1)-p.right.at(-2)}`;
 case 'routes':{const values=p.paths.map(ps=>ps.slice(1).reduce((a,b,i)=>a+Math.hypot(b[0]-ps[i][0],b[1]-ps[i][1]),0));if(new Set(values.map(v=>v.toFixed(8))).size!==values.length)throw Error('route tie');return values.map((v,i)=>({v,i})).sort((a,b)=>(p.descending?-1:1)*(a.v-b.v)).map(x=>['가','나','다'][x.i]).join(', ');}
 case 'order':{const a=only(perm(p.names).filter(a=>(p.before||[]).every(([x,y])=>a.indexOf(x)<a.indexOf(y))&&(p.next||[]).every(([x,y])=>a.indexOf(y)===a.indexOf(x)+1)));return a[p.query];}
 case 'assign':return only(perm(p.items.map((_,i)=>i)).filter(a=>(p.not||[]).every(([i,v])=>a[i]!==v)&&(p.fixed||[]).every(([i,v])=>a[i]===v))).map(i=>p.items[i]).join(', ');
 case 'operators':{const found=[];for(const ops of perm(p.symbols)){const eq=ops.indexOf('=');if(eq<0)continue;const calc=(start,end)=>{let a=p.numbers[start];for(let i=start;i<end;i++)a+=ops[i]==='+'?p.numbers[i+1]:-p.numbers[i+1];return a;};if(calc(0,eq)===calc(eq+1,3))found.push(p.numbers.map((n,i)=>String(n)+(ops[i]?' '+ops[i].replace('-','−')+' ':'')).join(''));}return only(found);}
 case 'roll':{const a=roll(p);if(p.label){const labels=new Map([[p.top,'파란 동그라미'],[p.front,'초록 세모'],[p.right,'노란 별']]);if(!labels.has(a))throw Error('final top is an unlabeled hidden face');return labels.get(a);}return a;}
 case 'distribute':return p.total-p.groups*p.each-p.used;
 case 'pattern':return (p.cells-p.used.reduce((a,b)=>a+b,0))/p.unit;
  case 'bricks-stack':{
   if(!p.solid)throw Error('hidden cavities make the count ambiguous');
   const occupied=new Set();
   for(const [x,y,z,dx,dy,dz] of p.bricks){
    if(dx*dy*dz!==2)throw Error('non-unit brick');
    for(let a=x;a<x+dx;a++)for(let b=y;b<y+dy;b++)for(let c=z;c<z+dz;c++){const k=[a,b,c].join();if(occupied.has(k))throw Error('overlap');occupied.add(k);}
   }
   const inferred=new Set();p.heights.forEach((row,y)=>row.forEach((h,x)=>{for(let z=0;z<h;z++)inferred.add([x,y,z].join());}));
   if(occupied.size!==inferred.size||[...inferred].some(k=>!occupied.has(k)))throw Error('cavity or height mismatch');
   return [...inferred].length/2;
  }
  case 'bricks':{for(const b of p.bricks)if(b.slice(3).reduce((a,b)=>a*b,1)!==2)throw Error('non-unit brick');return p.bricks.length;}
 case 'length-difference':return p.topUnits-p.bottomUnits;
 case 'tiles':return only(tileSolutions(p.target).map(s=>s.pair)).map(n=>['①','②','③','④','⑤'][n-1]).join(', ');
 case 'links':case 'walk':only(pathsFor(p));return '풀이 그림과 같이 연결';
 case 'opposite':{ // Enumerate all rotations of all six-face label assignments, not a saved answer.
   const faces=['T','B','F','K','R','L'],symbols=[...new Set(p.views.flat())];while(symbols.length<6)symbols.push('숨은'+symbols.length);
   const rotations=s=>{const out=[],seen=new Set,queue=[s];while(queue.length){const a=queue.shift(),key=faces.map(k=>a[k]).join('|');if(seen.has(key))continue;seen.add(key);out.push(a);queue.push({...a,T:a.F,K:a.T,B:a.K,F:a.B},{...a,T:a.L,R:a.T,B:a.R,L:a.B});}return out;};
   const answers=[];for(const labels of perm(symbols)){const s=Object.fromEntries(faces.map((k,i)=>[k,labels[i]]));if(!p.views.every(([f,t,r])=>rotations(s).some(a=>a.F===f&&a.T===t&&a.R===r)))continue;const opp={T:'B',B:'T',F:'K',K:'F',L:'R',R:'L'};answers.push(s[opp[faces.find(k=>s[k]===p.query)]]);}return ({'세모':'초록색 세모','네모':'빨간 네모','동그라미':'파란 동그라미','별':'노란 별'})[only(answers)];
 }
 default:throw Error('Unknown solver '+p.kind);
}}
module.exports={solve,pathsFor,tileSolutions,tileBases,roll};
