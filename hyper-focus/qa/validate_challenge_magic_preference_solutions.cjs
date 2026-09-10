'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const V=require('../challenge/variant-provider.js');
const rows=V.list().filter(x=>['replace-magic-triangle','r2-fruit-logic-table','r4-main-19'].includes(x.typeId));
assert.equal(rows.length,3);
const out=path.resolve(__dirname,'../output/qa/challenge-magic-preference-solutions'),baseline=path.join(out,'before.json');
const samples=rows.flatMap(ref=>['easy','same','hard'].flatMap(difficulty=>Array.from({length:100},(_,seed)=>{const result=V.generate({...ref,difficulty,seed});assert.equal(result.status,'verified');return{ref,difficulty,seed,q:result.question};})));
const stable=q=>Object.fromEntries(['id','typeId','number','difficulty','seed','prompt','problemHtml','payload','answer','answerHtml'].map(k=>[k,q[k]]));
const snapshot=Object.fromEntries(samples.map(({ref,difficulty,seed,q})=>[[ref.key,difficulty,seed].join('/'),crypto.createHash('sha256').update(JSON.stringify(stable(q))).digest('hex')]));
if(process.argv.includes('--baseline')){assert(!fs.existsSync(baseline),'Baseline already exists');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(baseline,JSON.stringify(snapshot,null,2));console.log(JSON.stringify({baseline:samples.length}));process.exit();}
assert.deepEqual(snapshot,JSON.parse(fs.readFileSync(baseline,'utf8')),'Question, drawing, answer, model or difficulty changed');
const E=require('../challenge/variant-numeric-extension.js'),clone=x=>JSON.parse(JSON.stringify(x));
const perms=a=>a.length?a.flatMap((v,i)=>perms(a.filter((_,j)=>i!==j)).map(t=>[v,...t])):[[]];
const sum=a=>a.reduce((s,v)=>s+v,0),canonical=a=>a.map(x=>JSON.stringify(x)).sort();
let steps=0,negative=0,maxMagicLength=0,maxPreferenceLength=0;
function verifyMagic(p,proof,answer,solution){
 const constraints=p.lines.map(indices=>({indices,total:p.target}));if(p.pairClue)constraints.push(p.pairClue);
 const valid=perms(p.values).filter(a=>Object.entries(p.givens).every(([i,v])=>a[i]===v)&&constraints.every(c=>sum(c.indices.map(i=>a[i]))===c.total));
 assert.equal(valid.length,1,'The actual question must have exactly one full assignment');assert.deepEqual(valid[0],answer);
 const domains=p.values.map((_,i)=>p.givens[i]===undefined?p.values.slice():[p.givens[i]]);
 for(const step of proof.steps){
  assert(solution.includes(step.text),'Every replayed step must be visible to the reader');
  let expected;
  if(step.rule==='unused'){
   const used=domains.filter(a=>a.length===1).flat();assert.deepEqual(step.fixed,used);assert.equal(new Set(used).size,used.length);
   expected=domains.map((a,i)=>({index:i,values:a.length===1?a:a.filter(v=>!used.includes(v))})).filter(u=>u.values.length!==domains[u.index].length);
  }else{
   assert(['single-line','line-options'].includes(step.rule));const c=constraints[step.constraint];assert(c);
   let tuples=[[]];for(const i of c.indices)tuples=tuples.flatMap(a=>domains[i].map(v=>[...a,v]));tuples=tuples.filter(a=>new Set(a).size===a.length&&sum(a)===c.total);
   assert(tuples.length);assert.deepEqual(canonical(step.tuples),canonical(tuples));
   expected=c.indices.map((i,k)=>({index:i,values:domains[i].filter(v=>tuples.some(a=>a[k]===v))})).filter(u=>u.values.length!==domains[u.index].length);
   const missing=c.indices.filter(i=>domains[i].length>1);
   if(step.rule==='single-line'){
    assert.equal(missing.length,1);const known=c.indices.filter(i=>i!==missing[0]).map(i=>domains[i][0]),v=c.total-sum(known);
    assert(step.text.includes(`${[c.total,...known].join('−')}=${v}`),'A one-blank line must show its actual inverse calculation');
   }else{assert(missing.length>=2);for(const tuple of tuples)assert(step.text.includes('('+tuple.join(', ')+')'),'Candidate sums may not be silently skipped');}
  }
  assert(expected.length,'No fake progress');assert.deepEqual(step.updates,expected);
  for(const u of expected){assert(u.values.length);assert(u.values.includes(answer[u.index]));domains[u.index]=u.values;}
 }
 assert(domains.every(a=>a.length===1),'All blanks must be derived');assert.deepEqual(domains.flat(),answer);assert.deepEqual(proof.result,answer);assert.equal(solution,proof.solution);
 return proof.steps.length;
}
function verifyPreference(p,proof,answer,solution){
 const people=p.people||p.names,items=p.items,facts=p.facts||[...p.yes.map(([i,j])=>[i,j,1]),...p.no.map(([i,j])=>[i,j,0])];
 const legalRows=Array.from({length:16},(_,bits)=>items.map((_,j)=>(bits>>j)&1)).filter(a=>sum(a)===2);
 let possible=[[]];for(let i=0;i<4;i++)possible=possible.flatMap(m=>legalRows.map(row=>[...m,row]));
 possible=possible.filter(m=>p.totals.every((v,j)=>sum(m.map(row=>row[j]))===v)&&facts.every(([i,j,v])=>m[i][j]===v));
 assert.equal(possible.length,1,'Actual row/column/yes/no constraints must be unique');const target=possible[0];
 if(Array.isArray(answer))assert.deepEqual(target,answer);else assert.equal(answer,people.map((name,i)=>`${name}: ${items.filter((_,j)=>target[i][j]).join('·')}`).join(' / '));
 const board=people.map(()=>items.map(()=>null));facts.forEach(([i,j,v])=>board[i][j]=v);
 for(const step of proof.steps){
  assert(solution.includes(step.text));assert(['row','column'].includes(step.axis));
  const cells=step.axis==='row'?items.map((_,j)=>[step.index,j]):people.map((_,i)=>[i,step.index]),goal=step.axis==='row'?2:p.totals[step.index],yes=cells.filter(([i,j])=>board[i][j]===1).length,blanks=cells.filter(([i,j])=>board[i][j]===null);
  assert(blanks.length);assert.equal(step.goal,goal);assert.equal(step.yes,yes);assert(yes===goal||yes+blanks.length===goal,'No unsupported row/column inference');assert.equal(step.value,yes===goal?0:1);assert.deepEqual(step.cells,blanks);
  for(const[i,j]of blanks){assert.equal(step.value,target[i][j]);assert(step.text.includes(`${people[i]}·${items[j]} ${step.value?'○':'×'}`));board[i][j]=step.value;}
 }
 assert.deepEqual(board,target,'Every cell must be derived before the final summary');assert.deepEqual(proof.result,target);assert.equal(solution,proof.solution);return proof.steps.length;
}
for(const {q}of samples){
 if(q.typeId==='replace-magic-triangle'){
  const proof=E.explainMagic(q.payload);steps+=verifyMagic(q.payload,proof,q.answer,q.solution);maxMagicLength=Math.max(maxMagicLength,q.solution.length);
  const broken=clone(proof);broken.steps[0].updates[0].values=[99];assert.throws(()=>verifyMagic(q.payload,broken,q.answer,q.solution));negative++;
 }else{
  const proof=E.explainPreference(q.payload);steps+=verifyPreference(q.payload,proof,q.answer,q.solution);maxPreferenceLength=Math.max(maxPreferenceLength,q.solution.length);
  const broken=clone(proof);broken.steps[0].value=1-broken.steps[0].value;assert.throws(()=>verifyPreference(q.payload,broken,q.answer,q.solution));negative++;
 }
}
let packageItems=0;
if(process.argv.includes('--package')){
 const latest=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../output/private-challenge/latest.json'),'utf8')),privateRoot=path.join(latest.out,'private'),manifest=JSON.parse(fs.readFileSync(path.join(privateRoot,'manifest.json'),'utf8'));
 for(const ref of rows)for(const difficulty of ['easy','same','hard'])for(const shard of manifest.bank[ref.typeId][difficulty].shards){
  const questions=JSON.parse(fs.readFileSync(path.join(privateRoot,shard.questions.path),'utf8')).items,answers=JSON.parse(fs.readFileSync(path.join(privateRoot,shard.answers.path),'utf8')).items;
  for(let i=0;i<questions.length;i++){
   const old=questions[i],match=old.id.match(/-(easy|same|hard)-(\d+)-[a-f0-9]+$/);assert(match);const q=V.generate({...ref,difficulty:match[1],seed:+match[2]}).question;
   assert.deepEqual({id:q.id,prompt:q.prompt,problemHtml:q.problemHtml},old);assert.equal(String(q.answerHtml),answers[i].answerHtml);
   if(ref.typeId==='replace-magic-triangle')verifyMagic(q.payload,E.explainMagic(q.payload),q.answer,q.solution);else verifyPreference(q.payload,E.explainPreference(q.payload),q.answer,q.solution);packageItems++;
  }
 }
}
const report={passed:true,unchanged:samples.length,independentlyVerifiedQuestions:samples.length,replayedSteps:steps,negativeChecks:negative,unchangedPackageItems:packageItems,maxMagicLength,maxPreferenceLength,scope:'Only magic triangle and two preference-table families; no question or answer changes; local only'};
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
