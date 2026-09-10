'use strict';
// Read-only explanation audit. It neither builds nor publishes the private package.
const assert=require('node:assert/strict');
const V=require('../challenge/variant-provider.js');
const fs=require('node:fs'),vm=require('node:vm');
const operators=new Set(['r3-main-11','r4-main-9']);
const ordering=new Set(['replace-house-between','replace-student-queue','r2-circular-seating','r3-main-10']);
const unknowns=new Set(['r3-main-1','r4-main-17']);
const permutations=a=>a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>i!==j)).map(row=>[x,...row])):[[]];
function holds(row,rel){const[a,b,c]=rel.args,A=row.indexOf(a),B=row.indexOf(b),C=row.indexOf(c);switch(rel.kind){case'between':return Math.min(B,C)<A&&A<Math.max(B,C);case'next':return row[A+1]===b;case'before':return A<B;case'notLast':return row.at(-1)!==a;case'place':return row[b]===a;case'clockwise':return row[(A+c)%row.length]===b;default:throw Error('Unrecognized clue');}}
const normalized=s=>String(s).replaceAll('−','-').replaceAll(' ','');
function checkArithmetic(solution){let count=0;for(const m of solution.matchAll(/(-?\d+)([+−])(-?\d+)=(-?\d+)/g)){const a=Number(m[1]),b=Number(m[3]);assert.equal(m[2]==='+'?a+b:a-b,Number(m[4]),`False worked calculation: ${m[0]}`);count++;}return count;}
function checkOperators(q){
 const p=q.payload,signs=String(q.answer).match(/[+\-=]/g),equal=signs.indexOf('='),hard=p.kind==='core-operators';assert.equal(signs.length,p.numbers.length-1);
 const side=(ops,start,end)=>{let value=p.numbers[start];for(let i=start;i<end;i++)value=ops[i]==='+'?value+p.numbers[i+1]:value-p.numbers[i+1];return value;};assert.equal(side(signs,0,equal),side(signs,equal+1,p.numbers.length-1));
 const candidates=[...new Set(permutations(p.symbols).map(s=>s.join('')))].map(s=>s.split('')).filter(s=>Object.entries(p.given||{}).every(([i,op])=>s[Number(i)]===op));assert.equal(candidates.length,hard?12:Object.keys(p.given).length?2:6);let accepted=0;
 for(const candidate of candidates){const e=candidate.indexOf('='),a=side(candidate,0,e),b=side(candidate,e+1,p.numbers.length-1);if(a===b)accepted++;if(hard){const start=q.solution.indexOf(`=가 ${e+1}번일 때`),end=q.solution.indexOf('=가 ',start+4),segment=q.solution.slice(start,end<0?undefined:end),m=candidate.indexOf('-');assert(start>=0);assert(segment.includes(a<0||b<0?`−가 ${m+1}번: ${a<0?'왼쪽':'오른쪽'}은 더할 수를 모아도 뺄 수보다 작아 제외`:`−가 ${m+1}번: ${a}와 ${b}${a===b?'로 같음':'로 다름'}`));}
 else {const expression=p.numbers.map((n,i)=>`${n}${i<candidate.length?' '+(candidate[i]==='-'?'−':candidate[i])+' ':''}`).join('');assert(q.solution.includes(a<0||b<0?`${expression}: ${a<0?'왼쪽':'오른쪽'}은 더할 수를 모두 모아도 뺄 수보다 작고 다른 쪽은 0보다 크므로 제외합니다.`:`${expression}: 왼쪽 ${a}, 오른쪽 ${b} → ${a===b?'같습니다':'다르므로 제외합니다'}.`));}}
 assert.equal(accepted,1,'All legal sign placements must give exactly one solution');assert.equal(checkArithmetic(q.solution),hard?3:2);if(!hard)assert(q.solution.includes(`=를 ${p.numbers[equal]}와 ${p.numbers[equal+1]} 사이`));assert(q.solution.includes('왼쪽은')&&q.solution.includes('오른쪽은'));assert(normalized(q.solution).includes(normalized(q.answer)));for(const[i,sign]of Object.entries(p.given||{}))assert.equal(signs[Number(i)],sign);assert.notEqual(normalized(q.solution),normalized(q.answer));
}
function clueStart(rel){const[a,b,c]=rel.args;return rel.kind==='between'?`${a}의 위치가 ${b}, ${c} 사이`:rel.kind==='next'?`${a} 바로 뒤가 ${b}`:rel.kind==='before'?`${a}의 위치가 ${b}보다 앞`:rel.kind==='notLast'?`${a}의 위치는 맨 뒤`: `${a}의 위치는 앞에서 ${b+1}번째`;}
function checkOrder(q){const p=q.payload,n=p.people.length,all=permutations(p.people),valid=all.filter(row=>(!p.anchor||row[0]===p.anchor)&&p.relations.every(rel=>holds(row,rel)));assert(valid.length);const responses=[...new Set(valid.map(row=>JSON.stringify(p.query!==null?row[p.query]:p.anchor?row.slice(1):row)))];assert.equal(responses.length,1);assert.deepEqual(q.answer,JSON.parse(responses[0]));assert(!q.solution.includes('조건을 놓아 보면'));
  if(p.anchor){const places=new Map([[p.anchor,1]]);for(const rel of p.relations){const[a,b,c]=rel.args;assert(places.has(a),'Each step starts at an already located child');let seat=places.get(a),steps=[];for(let i=0;i<c;i++){seat=seat===n?1:seat+1;steps.push(seat);}assert(q.solution.includes(`${a}의 ${places.get(a)}번 자리에서 ${c}칸 이동: ${steps.join(' → ')}번.`));assert(q.solution.includes(`${b}의 자리는 ${seat}번입니다.`));places.set(b,seat);}assert.equal(places.size,n);return;}
  let remaining=all,previousChoices=p.people.join(', '),previous=new Map(p.people.map(name=>[name,Array.from({length:n},(_,i)=>i+1).join(', ')])),lastIndex=-1;
  p.relations.forEach((rel,index)=>{const start=q.solution.indexOf(clueStart(rel),lastIndex+1);assert(start>lastIndex,'Every source condition must have its own worked step');lastIndex=start;const next=index+1<p.relations.length?q.solution.indexOf(clueStart(p.relations[index+1]),start+1):q.solution.length;assert(next>start);const segment=q.solution.slice(start,next);remaining=remaining.filter(row=>holds(row,rel));assert(remaining.length);if(rel.kind==='between'){const[a,b,c]=rel.args;assert(segment.includes(`${b} → ${a} → ${c} 또는 ${c} → ${a} → ${b}`));}
    if(p.query!==null){const names=p.people.filter(name=>remaining.some(row=>row[p.query]===name)).join(', ');if(names!==previousChoices)assert(segment.includes(`${p.query+1}번 자리에 올 수 있는 이름은 ${names}입니다.`),'Candidate reductions must match all remaining legal orders');previousChoices=names;}
    else for(const name of p.people){const positions=Array.from({length:n},(_,i)=>i).filter(i=>remaining.some(row=>row[i]===name)).map(i=>i+1).join(', ');if(positions!==previous.get(name))assert(segment.includes(`${name}: ${positions}번`),'Position reductions must be derived from the cumulative conditions');previous.set(name,positions);}
  });
  if(p.query!==null)assert(q.solution.includes(`${p.query+1}번 자리에는 ${q.answer}만 남습니다.`));else assert(q.solution.includes(q.answer.join(' → ')));
}
function checkOriginals(){let count=0;for(const[round,number]of[[3,1],[4,17]]){const q=V.getSource({round,section:'main',number});assert.equal(q.payload.kind,'unknowns');assert(q.payload.equations.length>=2);assert(['range','minimum-index'].includes(q.payload.select));count++;}return count;}
function checkUnknowns(q){const p=q.payload,values=p.equations.map(([a,op,b],i)=>{const fits=Array.from({length:101},(_,v)=>v).filter(v=>(op==='+'?a+v:a-v)===b);assert.equal(fits.length,1);const value=fits[0],calculation=op==='+'?`${b}−${a}=${value}`:`${a}−${b}=${value}`;assert(q.solution.includes(calculation));assert(q.solution.includes(`${['①','②','③','④'][i]}은`));return value;}),sorted=values.slice().sort((a,b)=>a-b);assert(q.solution.includes(sorted.join(', ')));const answer=p.select==='range'?sorted.at(-1)-sorted[0]:values.indexOf(sorted[0])+1;assert.equal(q.answer,answer);if(p.select==='range')assert(q.solution.includes(`${sorted.at(-1)}−${sorted[0]}=${answer}`));else assert(q.solution.includes(`${['①','②','③','④'][answer-1]}이므로 ${answer}번`));assert(checkArithmetic(q.solution)>=p.equations.length);}
function checkTemporaryNegative(){
 const source=fs.readFileSync(require.resolve('../challenge/variant-provider.js'),'utf8'),functionText=source.slice(source.indexOf('function operatorsExplanation('),source.indexOf('function operatorsQuestion('));
 const explanation=vm.runInNewContext(`(${functionText.trim()})`,{perms:permutations,sum:a=>a.reduce((total,n)=>total+n,0)})([2,8,10,4],['-','+','='],-1,'2 - 8 + 10 = 4');
 assert(explanation.includes('2 − 8 + 10 = 4: 왼쪽 4, 오른쪽 4 → 같습니다.'));
 assert(explanation.includes('2+10=12')&&explanation.includes('12−8=4'));
 assert(!explanation.includes('=-6'),'A temporary negative is not a reason to reject a valid equation or ask a young child to compute it');
 return 3;
}
function run(){
 let checked=0,detailed=0,negative=0;const rows=V.list().filter(row=>operators.has(row.typeId)||ordering.has(row.typeId)||unknowns.has(row.typeId));assert.equal(rows.length,8);
 for(const row of rows)for(const difficulty of ['easy','same','hard'])for(let seed=0;seed<40;seed++){
  const q=V.generate({...row,difficulty,seed}).question;
  if(unknowns.has(row.typeId)){checkUnknowns(q);assert.throws(()=>checkUnknowns({...q,solution:q.solution.replace(/−\d+=/,'−999=')}));assert.throws(()=>checkUnknowns({...q,answer:q.answer+1}));negative+=2;}
  else if(operators.has(row.typeId)){
   checkOperators(q);const broken={...q,solution:q.solution.replace(/(-?\d+)([+−])(-?\d+)=(-?\d+)/,(_,a,op,b,c)=>`${a}${op}${b}=${Number(c)+1}`)};assert.throws(()=>checkOperators(broken));negative++;
   const missing={...q,solution:q.solution.replace(q.payload.kind==='core-operators'?'=가 1번일 때':' → ',' 비교 누락 ')};assert.throws(()=>checkOperators(missing));negative++;
  }else{checkOrder(q);const broken={...q,solution:q.solution.replace(q.payload.anchor?'칸 이동:':clueStart(q.payload.relations[0]),'조건 누락:')};assert.throws(()=>checkOrder(broken));negative++;const wrong={...q,answer:Array.isArray(q.answer)?q.answer.slice().reverse():'존재하지 않는 이름'};assert.throws(()=>checkOrder(wrong));negative++;}
  checked++;detailed++;
 }
 return{checked,detailed,negative,temporaryNegativeAssertions:checkTemporaryNegative(),originals:checkOriginals(),scope:'Solution derivations only; no blanket completeness or visual-layout claim'};
}
if(require.main===module)console.log(JSON.stringify(run(),null,2));
module.exports={run,checkOperators,checkOrder,checkUnknowns,checkOriginals};
