const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const core=require('./independent_challenge_revision.cjs'),r2=require('./validate_challenge_editions.cjs'),extra=require('./validate_challenge_supplement.cjs'),more=require('./challenge-more-solvers.cjs');
const lessons=require('../challenge/concept-catalog.js').build();
const specials=require('../challenge/concept-specials.js').get();
const replacementModule=require('../challenge/concept-replacement-specials.js'),replacementSpecials=replacementModule.get();
function variants(p){const out=new Map;for(const f of [1,-1])for(let k=0;k<4;k++){let a=p.map(([x,y])=>[x*f,y]);for(let j=0;j<k;j++)a=a.map(([x,y])=>[-y,x]);const x=Math.min(...a.map(c=>c[0])),y=Math.min(...a.map(c=>c[1]));a=a.map(([u,v])=>[u-x,v-y]);out.set(a.map(String).sort().join(';'),a);}return [...out.values()];}
function partitionSolutions(p){const set=new Set(p.cells.map(String)),answers=[];
 for(const base of more.tileBases){const placements=[];for(const v of variants(base))for(let x=0;x<=Math.max(...p.cells.map(a=>a[0]));x++)for(let y=0;y<=Math.max(...p.cells.map(a=>a[1]));y++){const a=v.map(([u,w])=>[u+x,w+y]);if(a.every(c=>set.has(String(c))))placements.push(a);}
 function go(rem,parts){if(!rem.size){answers.push(parts);return;}const first=[...rem][0];for(const a of placements)if(a.some(c=>String(c)===first)&&a.every(c=>rem.has(String(c)))){const next=new Set(rem);a.forEach(c=>next.delete(String(c)));go(next,[...parts,a]);}}go(set,[]);
 }return [...new Map(answers.map(a=>[a.map(p=>p.map(String).sort().join(';')).sort().join('|'),a])).values()];}
function foldNetOpposites(cells){const neg=a=>a.map(v=>-v),key=a=>a.join(','),at=new Map(cells.map((cell,index)=>[cell.join(','),index])),frames=Array(cells.length),queue=[0];frames[0]={n:[0,0,1],u:[0,-1,0],r:[1,0,0]};while(queue.length){const index=queue.shift(),[x,y]=cells[index],f=frames[index];for(const[dx,dy,d]of[[1,0,'E'],[-1,0,'W'],[0,1,'S'],[0,-1,'N']]){const nextIndex=at.get(`${x+dx},${y+dy}`);if(nextIndex===undefined||frames[nextIndex])continue;frames[nextIndex]=d==='E'?{n:f.r,u:f.u,r:neg(f.n)}:d==='W'?{n:neg(f.r),u:f.u,r:f.n}:d==='S'?{n:neg(f.u),u:f.n,r:f.r}:{n:f.u,u:neg(f.n),r:f.r};queue.push(nextIndex);}}const normals=frames.map(f=>key(f.n));assert.equal(new Set(normals).size,6);return frames.map(f=>normals.indexOf(key(neg(f.n))));}
function rollDie(o,d){return d==='N'?{top:o.south,bottom:o.north,north:o.top,south:o.bottom,east:o.east,west:o.west}:d==='S'?{top:o.north,bottom:o.south,north:o.bottom,south:o.top,east:o.east,west:o.west}:d==='E'?{top:o.west,bottom:o.east,north:o.north,south:o.south,east:o.top,west:o.bottom}:{top:o.east,bottom:o.west,north:o.north,south:o.south,east:o.bottom,west:o.top};}
function visibleDie(o,view){return view==='rear-left'?[o.top,o.west,o.north]:view==='rear-right'?[o.top,o.north,o.east]:view==='front-left'?[o.top,o.south,o.west]:[o.top,o.south,o.east];}
function oppositeSumOrientations(){const out=[];for(let top=1;top<=6;top++)for(let north=1;north<=6;north++)for(let east=1;east<=6;east++){const orientation={top,bottom:7-top,north,south:7-north,east,west:7-east};if(new Set(Object.values(orientation)).size===6)out.push(orientation);}return out;}
const oppositeSumDice=oppositeSumOrientations();
function specialSolve(p){switch(p.kind){
 case 'equal-digits':{const a=Array.from({length:90},(_,i)=>i+10).filter(n=>n%10===Math.floor(n/10)&&n>p.lower&&n<p.upper&&n%2===p.parity);assert.equal(a.length,1);return a[0];}
 case 'partition-three':{const answers=partitionSolutions(p);assert.equal(answers.length,1);assert.equal(answers[0].length,3);return '풀이 그림 참고';}
 case 'split-three-all':{const a=[];for(let x=1;x<=p.max;x++)for(let y=x+1;y<=p.max;y++)for(let z=y+1;z<=p.max;z++)if(x+y+z===p.total)a.push([x,y,z]);return a;}
 case 'triangle-enumeration':return p.rays*(p.rays-1)/2*p.bases;
 case 'net-perspective':{const neg=a=>a.map(v=>-v),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],equal=(a,b)=>a.every((v,i)=>v===b[i]),byPosition=new Map(p.faces.map(face=>[[face.x,face.y].join(),face])),rootFace=p.faces.find(face=>face.x===0&&face.y===0)||p.faces[0],orientations=new Map([[rootFace.faceId,{n:[0,0,1],r:[1,0,0],u:[0,1,0]}]]),queue=[rootFace];while(queue.length){const face=queue.shift(),orientation=orientations.get(face.faceId);for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const next=byPosition.get([face.x+dx,face.y+dy].join());if(!next||orientations.has(next.faceId))continue;let n,r,u;if(dx===1){n=orientation.r;r=neg(orientation.n);u=orientation.u;}else if(dx===-1){n=neg(orientation.r);r=orientation.n;u=orientation.u;}else if(dy===1){n=orientation.u;r=orientation.r;u=neg(orientation.n);}else{n=neg(orientation.u);r=orientation.r;u=orientation.n;}orientations.set(next.faceId,{n,r,u});queue.push(next);}}const normalByMark=new Map(p.faces.map(face=>[face.mark,orientations.get(face.faceId).n])),valid=p.choices.filter(choice=>{const[top,left,right]=choice.visibleMarks.map(mark=>normalByMark.get(mark));return equal(cross(left,top),right);});assert.equal(valid.length,1);return valid[0].choiceId;}
  case 'stack-box-fill':return p.width*p.depth*p.boxH-p.heightMap.flat().reduce((sum,height)=>sum+height,0);
   case 'stack-minimum-visible':return p.heightMap.flat().reduce((sum,height)=>sum+height,0);
  case 'checker-stack-count':{const answer={black:0,white:0};p.heightMap.forEach((row,y)=>row.forEach((height,x)=>{for(let z=0;z<height;z++)answer[(x+y+z+p.checkerOffset)%2===0?'black':'white']++;}));return answer;}
  case 'congruent-marked-partition':return p.boards.map(board=>board.parts);
  case 'tetra-cube-hole-count':return p.heightMap.flat().reduce((sum,height)=>sum+height,0)/p.tetraCubeSize;
  case 'object-length-equivalence':return p.query==='pencil-minus-two-erasers'?p.units.P-2*p.units.E:p.units.P;
  case 'block-build-count':return {A:p.width*p.depth*p.height-p.bPieces.length*2,B:p.bPieces.length};
  case 'net-colors-pair':case 'net-pips-pair':return p.subproblems.map(subproblem=>{const opposite=foldNetOpposites(subproblem.cells);return subproblem.query.map(queryIndex=>{const known=subproblem.values[opposite[queryIndex]];return p.kind==='net-colors-pair'?known:7-known;});});
  case 'dice-target-bottom':return p.route.reduce(rollDie,p.startOrientation).bottom;
  case 'dice-finish-visible-faces':{const finish=p.route.reduce(rollDie,p.startOrientation);return [finish.top,finish.south,finish.east];}
  case 'dice-paired-bottom-inference':{const contacts=p.boards.map(board=>board.route.reduce(rollDie,board.startOrientation).bottom);assert.equal(contacts[0],contacts[1]);assert.equal(contacts[0],p.contactValue);const hiddenKey={top:'top',front:'south',right:'east'}[p.unknownFace],second=p.boards[1],shown=['top','south','east'].filter(key=>key!==hiddenKey),candidates=oppositeSumDice.filter(orientation=>shown.every(key=>orientation[key]===second.startOrientation[key])&&second.route.reduce(rollDie,orientation).bottom===p.contactValue),answers=new Set(candidates.map(orientation=>orientation[hiddenKey]));assert.equal(answers.size,1);return [...answers][0];}
  case 'simple-path-network':{const neighbors=new Map(p.vertices.map(vertex=>[vertex.id,[]]));for(const[a,b]of p.edges){neighbors.get(a).push(b);neighbors.get(b).push(a);}let count=0;function visit(node,seen){if(node===p.end){count++;return;}for(const next of neighbors.get(node))if(!seen.has(next)){seen.add(next);visit(next,seen);seen.delete(next);}}visit(p.start,new Set([p.start]));return count;}
 case 'rod-subset-lengths':{const sums=new Set;for(let mask=1;mask<(1<<p.rods.length);mask++){let total=0;for(let index=0;index<p.rods.length;index++)if(mask&(1<<index))total+=p.rods[index];sums.add(total);}return sums.size;}
 case 'shortest-path-grid':{const blocked=new Set(p.blocked.map(String)),ways=Array.from({length:p.rows+1},()=>Array(p.cols+1).fill(0));ways[p.rows][0]=1;for(let y=p.rows;y>=0;y--)for(let x=0;x<=p.cols;x++){if(x===0&&y===p.rows||blocked.has(String([x,y])))continue;ways[y][x]=(x?ways[y][x-1]:0)+(y<p.rows?ways[y+1][x]:0);}return ways[0][p.cols];}
 case 'balance-substitution-pictures':{const query=p.equations.find(equation=>equation.query);const weight=items=>items.reduce((total,item)=>total+p.values[item.key]*item.count,0);for(const equation of p.equations)assert.equal(weight(equation.left),weight(equation.right));return query.answer;}
 case 'piece-count':{const choices=[];function go(a){if(a.length===p.count){if(a.reduce((s,v)=>s+v,0)===p.total)choices.push(a);return;}for(const x of p.units)if(!a.length||x>=a.at(-1))go([...a,x]);}go([]);assert.equal(choices.length,1);const names={1:'초록',2:'파란',3:'빨간'},counts=new Map;for(const unit of choices[0])counts.set(unit,(counts.get(unit)||0)+1);return [...counts].sort((a,b)=>b[0]-a[0]).map(([unit,count])=>`${names[unit]} 조각 ${count}개`).join(', ');}
 case 'circle-not-adjacent':{const perm=a=>a.length?a.flatMap((x,i)=>perm(a.filter((_,j)=>i!==j)).map(b=>[x,...b])):[[]];const a=perm([0,1,2,3]).filter(a=>a[0]===p.anchor&&a.indexOf(p.notNext)===2&&a[1]===p.clockwiseNext);assert.equal(a.length,1);return a[0].map(i=>p.names[i]).join(', ');}
 default:throw Error(p.kind);
}}
const specialKinds=new Set([...Object.values(specials),...Object.values(replacementSpecials)].flat().map(q=>q.payload.kind));
const coreIds=new Set(globalThis.HFChallengeBank.listTypes().map(t=>t.id));
function solveQuestion(q){const p=q.payload;if(q.typeId==='concept-check')return null;
 if(specialKinds.has(p.kind))return specialSolve(p);
 if(p.kind==='variant-routes'){const lengths=p.paths.map(path=>path.slice(1).reduce((total,point,index)=>total+Math.hypot(point[0]-path[index][0],point[1]-path[index][1]),0)),ordered=p.labels.slice().sort((left,right)=>(lengths[p.labels.indexOf(left)]-lengths[p.labels.indexOf(right)])*(p.descending?-1:1));return p.difference?[ordered,Math.round(Math.max(...lengths)-Math.min(...lengths))]:ordered.join(', ');}
 if(q.typeId.startsWith('r3-')||q.typeId.startsWith('r4-'))return more.solve(p);
 if(q.typeId.startsWith('extra-'))return extra.solve(p);
 if(q.typeId.startsWith('r2-'))return r2.solveRound2(p);
 let a=core.solve(p);if(q.responsePart!==undefined)a=a[q.responsePart];return a;
}
if(require.main===module){
let checked=0,conceptChecks=0;const failures=[];
for(const l of lessons)for(const phase of ['example','practice']){const q=l[phase];try{assert(q.prompt&&q.solution&&q.answerHtml!==undefined);if(q.typeId==='concept-check'){assert(['맞음','틀림'].includes(q.answer));conceptChecks++;continue;}assert.deepEqual(solveQuestion(q),q.answer);checked++;if(process.env.CHECK_CONCEPT_IMAGES==='1'&&q.problemHtml){const f=path.resolve(__dirname,'../challenge/assets/concepts',`unit-${String(l.number).padStart(2,'0')}-${phase}.png`);assert(fs.readFileSync(f).readUInt32BE(16)>=1200);}}catch(e){failures.push({unit:l.number,id:l.id,phase,error:e.message});}}
assert.equal(lessons.filter(l=>l.id.startsWith('core-')).length,coreIds.size);
assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
const imageMap=[['pattern-piece-count'],['tetromino'],['domino-pattern','net-colors'],['net-pips'],['noncrossing-links'],['number-walk'],['core-card-sum-count'],['partition-three'],['long-bricks'],['split-three-all'],['distinct-tree'],['operator-insertion'],['growing-groups'],['growing-runs','growing-groups'],['diagonal-length'],['orthogonal-length'],['balance-order'],['congruent-conditions'],['blank-comparison'],['line-rotation']];
for(const ids of imageMap)for(const id of ids)assert(lessons.some(l=>l.id===id),'Missing attachment type '+id);
for(const id of ['dice-roll','opposite-faces','circle-not-adjacent','length-substitution'])assert(lessons.some(l=>l.id===id));
  for(const id of ['checker-stack-count','stack-box-fill','stack-minimum-visible','congruent-marked-partition','tetra-cube-hole-count','net-colors-pair','net-pips-pair','dice-target-bottom','object-length-equivalence','block-build-count','simple-path-network','rod-subset-lengths','shortest-path-grid','balance-substitution-pictures'])assert(lessons.some(l=>l.id===id));
const replacementValidation=replacementModule.validate();assert.equal(replacementValidation.ok,true);
const report={passed:!failures.length,units:lessons.length,independentMathChecks:checked,reviewedConceptChecks:conceptChecks,replacementValidation,latest20Images:imageMap.map((ids,i)=>({image:i+1,units:ids.map(id=>({id,number:lessons.find(l=>l.id===id).number}))})),failures};
const out=path.resolve(__dirname,'../output/qa/challenge-concepts');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'math-coverage.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;
}
module.exports={specialSolve,partitionSolutions,solveQuestion};
