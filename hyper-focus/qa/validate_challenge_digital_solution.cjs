'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict'),provider=require('../challenge/variant-provider.js');
const out=path.resolve(__dirname,'../output/qa/challenge-digital-solution');fs.mkdirSync(out,{recursive:true});const file=path.join(out,'before.json');
const refs=provider.list().filter(r=>r.typeId==='extra-digital-mirror'),samples=[];
for(const ref of refs)for(const difficulty of ['easy','same','hard'])for(let seed=0;seed<100;seed++){const v=provider.generate({...ref,difficulty,seed});assert.equal(v.status,'verified',v.reason);samples.push(v.question);}
const hashes=samples.map(q=>crypto.createHash('sha256').update(JSON.stringify(Object.fromEntries(['id','typeId','number','difficulty','seed','prompt','problemHtml','payload','answer','answerHtml','solutionDiagram'].map(k=>[k,q[k]])))).digest('hex'));
if(process.argv.includes('--baseline')){assert(!fs.existsSync(file));fs.writeFileSync(file,JSON.stringify(hashes));console.log('baseline '+samples.length);process.exit();}
assert.deepEqual(hashes,JSON.parse(fs.readFileSync(file,'utf8')));let checks=samples.length;
for(const q of samples){const p=q.payload,missing=p.equations.map(eq=>{const candidates=[];for(let n=0;n<=100;n++){const e=eq.map(v=>v==='blank'?n:v);if((e[1]==='+'?e[0]+e[2]:e[0]-e[2])===e[4])candidates.push(n);}assert.equal(candidates.length,1);return candidates[0];});
 assert.equal(missing[0]+missing[1],q.answer);assert(q.solution.includes(missing.join('+')+'='+q.answer));assert(q.solution.includes('첫째')&&q.solution.includes('둘째'));checks+=3;
 p.equations.forEach((eq,i)=>{const restored=eq.map(v=>v==='blank'?'□':v).join(' ');assert(q.solution.includes(restored),'restored complete equation missing');const [a,op,b,,c]=eq,calculation=a==='blank'?(op==='+'?c+'−'+b:c+'+'+b):b==='blank'?(op==='+'?c+'−'+a:a+'−'+c):(op==='+'?a+'+'+b:a+'−'+b);assert(q.solution.includes(calculation+'='+missing[i]),'individual inverse calculation missing');checks+=2;});}
const report={status:'PASS',checks,samples:samples.length,questionsAnswersDiagramsDifficultyUnchanged:true};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));console.log(samples.filter((_,i)=>i%100===0).map(q=>q.difficulty+': '+q.solution).join('\n'));
