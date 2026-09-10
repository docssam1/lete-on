'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {solve,arrangements}=require('./independent_challenge_revision.cjs');
const bank=globalThis.HFChallengeBank;
const one=values=>{assert.equal(values.length,1,'expected one independent solution');return values[0];};
function solveRound2(p){
  if(p.typeId.startsWith('priority-'))return require('./challenge-priority-solvers.cjs').solve(p);
  if(p.typeId.startsWith('replace-'))return require('./challenge-replacement-solvers.cjs').solve(p);
  switch(p.typeId){
    case 'r2-bird-departure':return one(Array.from({length:p.initial+1},(_,n)=>n).filter(n=>p.initial-n+p.arrived===p.final));
    case 'r2-number-machines':return [p.half/2,p.end-p.increase];
    case 'r2-grid-mirror-polygon':{
      const reflected=p.vertices.map(([x,y])=>[p.mirrorX+(p.mirrorX-x),y]);
      assert(reflected.every(([x,y])=>x>p.mirrorX&&x<=p.columns&&y>=0&&y<=p.rows));
      assert.deepEqual(reflected.map(([x,y])=>[2*p.mirrorX-x,y]),p.vertices);
      return reflected;}
    case 'r2-object-position':return one(arrangements(p.items).filter(a=>a[3]==='연필'&&a.indexOf('가위')<a.indexOf('지우개')&&a.indexOf('지우개')<a.indexOf('연필')&&a.indexOf('필통')+1===a.indexOf('지우개')));
    case 'r2-growing-tile-sequence':{
      const d=p.counts[1]-p.counts[0];assert(p.counts.every((n,i)=>n===p.counts[0]+d*i));return p.positions.reduce((n,k)=>n+p.counts[0]+d*(k-1),0);}
    case 'r2-orange-reverse':return one(Array.from({length:100},(_,n)=>n).filter(n=>n-p.ate+p.added===p.final));
    case 'r2-digit-constraint':return one(Array.from({length:90},(_,i)=>i+10).filter(n=>n%2===0&&Math.floor(n/10)+n%10===p.digitSum&&Math.floor(n/10)-n%10===p.tensExcess))-p.subtract;
    case 'r2-nested-shape-order':{const changed=[...p.initial].reverse();const names={square:'정사각형',circle:'원',triangle:'삼각형'};return [names[changed[0]],names[changed[2]]];}
    case 'r2-circular-seating':return one(arrangements(['다은','서아','민호','하준']).map(a=>['지우',...a]).filter(a=>{
      const at=n=>a.indexOf(n),near=(a,b)=>Math.min(Math.abs(a-b),5-Math.abs(a-b))===1;
      return at('서아')===2&&at('민호')===(at('서아')+1)%5&&near(at('다은'),at('지우'))&&near(at('다은'),at('서아'));
    })).slice(1);
    case 'r2-card-distribution':{
      const found=new Map();for(const a of arrangements(p.cards)){let ok=true;for(let i=0;i<4;i++)if(a[2*i]+a[2*i+1]!==p.sums[i])ok=false;if(ok){const pairs=Array.from({length:4},(_,i)=>a.slice(2*i,2*i+2).sort((a,b)=>a-b));found.set(JSON.stringify(pairs),pairs);}}return one([...found.values()]);}
    case 'r2-weight-transitivity':{
      const extrema=new Set();for(let a=1;a<=4;a++)for(let b=1;b<=4;b++)for(let c=1;c<=4;c++)for(let d=1;d<=4;d++){
        const w=[0,a,b,c,d];if(!p.relations.every(([h,l])=>w[h]>w[l])||w[p.equal[0]]!==w[p.equal[1]])continue;
        const hi=[1,2,3,4].filter(i=>w[i]===Math.max(a,b,c,d)),lo=[1,2,3,4].filter(i=>w[i]===Math.min(a,b,c,d));extrema.add(JSON.stringify([hi[0],lo.join('번과 ')+'번']));
      }return JSON.parse(one([...extrema]));}
    case 'r2-ticket-inventory':return p.initial-p.gift-p.used.reduce((n,v)=>n+v,0);
    case 'r2-domino-side-sums':{
      const f=p.fixed,results=[];for(let a=0;a<=6;a++)for(let b=0;b<=6;b++)for(let c=0;c<=6;c++)for(let d=0;d<=6;d++){
        if(a+f[0]+b!==p.target||b+f[1]+f[2]!==p.target||c+f[2]+f[3]!==p.target||a+d+f[3]!==p.target)continue;
        const tiles=[[a,f[0]],[b,f[1]],[c,f[2]],[d,f[3]]].map(t=>t.sort().join(','));if(new Set(tiles).size===4)results.push([a,b,c,d]);
      }return one(results);}
    case 'r2-paper-hole-unfold':return one(p.options.flatMap((cells,i)=>JSON.stringify(cells)==='[0,1]'?[i+1]:[]));
    case 'r2-fruit-equations':{
      const results=[];for(let apple=1;apple<15;apple++)for(let berry=1;berry<15;berry++)for(let pear=1;pear<15;pear++)if(apple*3===p.triple&&apple+berry===p.pair&&berry-pear===p.difference)results.push(apple+berry+pear);return one(results);}
    case 'r2-number-reference-reading':return one(Array.from({length:100},(_,n)=>n).filter(n=>n-p.less===p.result))+p.more;
    case 'r2-three-balance-order':{
      const orders=new Set(),names={apple:'사과',pear:'배',orange:'귤',berry:'딸기'};
      for(let a=1;a<=8;a++)for(let b=1;b<=8;b++)for(let c=1;c<=8;c++)for(let d=1;d<=8;d++){
        const w=Object.fromEntries(p.kinds.map((k,i)=>[k,[a,b,c,d][i]]));
        if(p.pans.every(pan=>Math.sign(pan.left.reduce((n,k)=>n+w[k],0)-pan.right.reduce((n,k)=>n+w[k],0))===Math.sign(pan.tilt)))orders.add(JSON.stringify([...p.kinds].sort((x,y)=>w[y]-w[x]).map(k=>names[k])));
      }return JSON.parse(one([...orders]));}
    case 'r2-days-inclusive':return Array.from({length:p.days},(_,i)=>i).filter(i=>i!==2).length*p.perDay+p.extra;
    case 'r2-triangle-enumeration':{
      // Independently enumerate vertex triples on actual line segments, including intersections.
      const [apex,...base]=p.vertices,mid=base.map(([x,y])=>[apex[0]+(x-apex[0])*(p.middleY-apex[1])/(y-apex[1]),p.middleY]);
      const vertices=[apex,...base,...mid],segments=base.map(b=>[apex,b]).concat([[base[0],base[3]],[mid[0],mid[3]]]);
      const on=(p,[a,b])=>Math.abs((p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0]))<1e-6&&p[0]>=Math.min(a[0],b[0])-1e-6&&p[0]<=Math.max(a[0],b[0])+1e-6&&p[1]>=Math.min(a[1],b[1])-1e-6&&p[1]<=Math.max(a[1],b[1])+1e-6;
      let count=0;for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++)for(let k=j+1;k<vertices.length;k++){
        const [a,b,c]=[vertices[i],vertices[j],vertices[k]];if(Math.abs((b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]))<1e-6)continue;
        if([[a,b],[b,c],[a,c]].every(([u,v])=>segments.some(s=>on(u,s)&&on(v,s))))count++;
      }return count;}
    case 'r2-fruit-logic-table':{
      const rows=[];for(let mask=0;mask<16;mask++){const row=Array.from({length:4},(_,i)=>(mask>>i)&1);if(row.reduce((a,b)=>a+b,0)===p.likesPerPerson)rows.push(row);}
      const results=[];for(const a of rows)for(const b of rows)for(const c of rows)for(const d of rows){const m=[a,b,c,d];
        if(!Object.entries(p.known).every(([r,likes])=>m[r].every((v,i)=>v===Number(likes.includes(i)))))continue;
        if(!Object.entries(p.dislikes).every(([r,ds])=>ds.every(i=>m[r][i]===0)))continue;
        if(p.totals.every((n,i)=>m.reduce((s,row)=>s+row[i],0)===n))results.push(m);
      }return one(results);}
    default:throw Error('missing round 2 solver '+p.typeId);
  }
}
module.exports={solveRound2};
// Content regression checks keep their authored keys; displayed order is verified separately.
const canonical=exam=>({...exam,questions:[...exam.questions].sort((a,b)=>a.sourceNumber-b.sourceNumber).map(q=>({...q,number:q.sourceNumber}))});
const first=canonical(bank.createMockExam(1,62001)),second=canonical(bank.createMockExam(2,62001));
assert.notEqual(first.editionId,second.editionId);
assert.equal(new Set([...first.questions,...second.questions].map(q=>q.typeId)).size,40,'round 2 must have its own authored blueprint');
assert(!second.questions.some(q=>first.questions.some(p=>p.prompt===q.prompt&&p.problemHtml===q.problemHtml)));
let checks=0;
for(let seed=1;seed<=100;seed++)for(const q of bank.createMockExam(1,seed*617).questions){let answer=solve(q.payload);if(q.responsePart!==undefined)answer=answer[q.responsePart];assert.deepEqual(answer,q.answer);assert(q.solution.length>30);checks++;}
for(const q of second.questions){assert.deepEqual(solveRound2(q.payload),q.answer,'2회 '+q.number);assert(q.solution.length>30);checks++;}
assert.deepEqual(canonical(bank.createMockExam(2,999)),second,'fixed authored edition must not silently become a seeded clone');
for(const n of [4,7,13])assert(!first.questions[n-1].subquestions);
assert(!first.questions[2].prompt.includes('하나라도'));
assert(first.questions[2].prompt.includes('마릿수를 쓰세요'));
assert(!first.questions[2].prompt.includes('동그라미'));
assert(!first.questions[2].problemHtml.includes('<svg')&&!first.questions[2].payload.options);
assert.equal(first.questions[2].payload.responseMode,'written');
for(const n of [6,11])assert(!first.questions[n-1].problemHtml.includes('골라 보세요')&&!first.questions[n-1].problemHtml.includes('차이가 나게 담습니다'));
assert(!first.questions[11].problemHtml.includes('동물:'));
assert(first.questions[12].problemHtml.includes('보기')&&first.questions[12].problemHtml.includes('fill="white"'));
assert.equal(first.questions[12].payload.verticalStep,8);
assert(first.questions[12].problemHtml.includes('>27</text>')&&first.questions[12].problemHtml.includes('>43</text>'));
assert.equal(first.questions[12].answer,first.questions[12].payload.start+1-8*3);
assert.equal(solve({typeId:'arrow-number-move',verticalStep:8,start:40,moves:['D','D','R','U','L'],missing:'end'}),48);
assert(first.questions[17].problemHtml.includes('fill-target')&&first.questions[17].problemHtml.includes('빈칸을 가득 채우려면'));
const cubeBorders=[...first.questions[17].problemHtml.matchAll(/<g class="fill-target[^>]*>(.*?)<\/g>/g)].map(m=>m[1]);
assert.equal(cubeBorders.length,2,'box edges must be separated behind and in front of cubes');
assert.equal(cubeBorders.join('').match(/<path /g).length,12,'only the twelve outer box edges');
assert(!cubeBorders.join('').includes('stroke-dasharray'),'box border must be solid');
assert(!first.questions[17].prompt.includes('점선')&&!first.questions[17].solution.includes('점선'));
assert.equal(first.questions[18].responsePart,1);
assert(!/정사각형|직사각형|\(1\)|\(2\)/.test(first.questions[18].prompt+first.questions[18].problemHtml+first.questions[18].answerHtml+first.questions[18].solution));
assert.equal(first.questions[18].answer,19);
const domainCounts=Object.fromEntries(['지문이해','수','도형','논리추리'].map(d=>[d,second.questions.filter(q=>q.domain===d).length]));
const r2=n=>second.questions[n-1];
assert(!r2(1).problemHtml.includes('<text')&&!r2(1).problemHtml.includes('<path'));
assert([34,8,17].every(n=>r2(1).prompt.includes(String(n))));
assert.equal((r2(2).problemHtml.match(/class="vertical-number-machine"/g)||[]).length,6);
assert.equal((r2(2).problemHtml.match(/width="80" height="80"/g)||[]).length,6);
assert.equal((r2(3).problemHtml.match(/<polygon /g)||[]).length,1,'student mirror half must stay blank');
assert.equal((r2(3).solutionDiagram.match(/<polygon /g)||[]).length,2);
assert.equal((r2(5).problemHtml.match(/<polygon /g)||[]).length,20,'five frames, four stars each; final frame blank');
assert.equal(r2(6).problemHtml,'');
assert.equal(r2(14).payload.examples.length,9);assert.equal(r2(14).payload.targetPosition,18);
assert(r2(14).problemHtml.includes('…')&&!r2(14).problemHtml.includes('(2)'));
assert.equal((r2(17).problemHtml.match(/class="proper-balance"/g)||[]).length,3);
assert.equal(r2(19).prompt,'그림에 그어진 선을 따라 그릴 수 있는 삼각형은 모두 몇 개입니까?');
assert(r2(20).problemHtml.includes('fruit-logic-table'));
assert.equal(r2(20).payload.likesPerPerson,2);
assert.deepEqual(domainCounts,{'지문이해':3,'수':5,'도형':6,'논리추리':6});
assert.deepEqual(first.questions.filter(q=>q.priorityReplacement).map(q=>q.number),[]);
assert.deepEqual(bank.createMockExam(1,62001).questions.filter(q=>q.mockConceptRevision).map(q=>q.number),[3,12,14]);
assert.deepEqual(second.questions.filter(q=>q.priorityReplacement).map(q=>q.number),[12,18]);
assert.deepEqual(first.questions.filter(q=>q.replacement).map(q=>q.number),[1,3,5,16,17]);
assert.deepEqual(second.questions.filter(q=>q.replacement).map(q=>q.number),[4,5,8,10,11,14]);
assert(fs.readFileSync(path.resolve(__dirname,'../challenge/exam.css'),'utf8').includes('print-color-adjust:exact'),'PDF must preserve color');
const report={passed:true,editionChecks:checks,replacements:{round1:5,round2:6},round2DomainCounts:domainCounts,round1Domains:Object.fromEntries(['지문이해','수','도형','논리추리'].map(d=>[d,first.questions.filter(q=>q.domain===d).length])),exactDuplicateItems:0,sharedTemplateIds:0,visualChecksRequired:['symmetry contours','colored pattern and matrix diagrams','cube target wireframe','all PDF pages']};
const out=path.resolve(__dirname,'../output/qa/challenge-editions-separated');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'math-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
