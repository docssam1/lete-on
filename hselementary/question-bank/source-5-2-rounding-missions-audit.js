"use strict";
const assert = require("node:assert/strict");
const api = require("./source-5-2-rounding-missions.js");
const strip = html => String(html).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
const nums = text => [...text.matchAll(/\d[\d,]*/g)].map(m => Number(m[0].replaceAll(",", "")));
const ceil = (n, u) => Math.ceil(n / u) * u;
const floor = (n, u) => Math.floor(n / u) * u;
const round = (n, u) => Math.floor(n / u + 0.5) * u;
const particle = (n, withoutBatchim, withBatchim) => [0,1,3,6,7,8].includes(Number(String(Math.abs(n)).replace(/\D/g, "").slice(-1))) ? withBatchim : withoutBatchim;
function permute(digits) { const out=[]; function walk(prefix,left){ if(!left.length){if(prefix[0]!==0)out.push(Number(prefix.join("")));return;} for(let i=0;i<left.length;i++)walk([...prefix,left[i]],[...left.slice(0,i),...left.slice(i+1)]);} walk([],digits); return out; }
function expectedFromVisiblePrompt(id, prompt) {
  const text = strip(prompt);
  if (id.endsWith("mission-1")) {
    const rows = [...prompt.matchAll(/<tr><th>([\d,]+)<\/th>([\s\S]*?)<\/tr>/g)];
    assert.equal(rows.length, 2);
    assert(rows.every(row => (row[2].match(/source52-rounding-blank/g) || []).length === 3), "Student table must have six blank answer cells");
    return rows.flatMap(row => { const n=Number(row[1].replaceAll(",","")); return [10,100,1000].map(u=>ceil(n,u)); });
  }
  if (id.endsWith("mission-2")) {
    const list = [...prompt.matchAll(/<li>([\d,]+)<\/li>/g)].map(m=>Number(m[1].replaceAll(",","")));
    assert.equal(list.length,2);
    return list.map(n=>Math.abs(ceil(n,100)-round(n,1000)));
  }
  const targetMatch = text.match(/중에서 ([\d,]+)에 가장 가까운/);
  const cardMatch = prompt.match(/class="source52-rounding-cards"[^>]*>([\s\S]*?)<\/div>/);
  assert(targetMatch && cardMatch);
  const target=Number(targetMatch[1].replaceAll(",",""));
  const digits=[...cardMatch[1].matchAll(/digit-card[^>]*>(\d)</g)].map(m=>Number(m[1]));
  assert.equal(digits.length,6);
  const candidates=permute(digits), min=Math.min(...candidates.map(n=>Math.abs(n-target))), winners=candidates.filter(n=>Math.abs(n-target)===min);
  assert.equal(winners.length,1,"Mission 3 must have a unique closest number");
  return [round(winners[0],1000)];
}
const questions=[];
for(const id of api.ids.slice(0,3)) for(let variant=0;variant<3;variant++) for(const difficulty of [-1,0,1]) {
  const q=api.getQuestion(id,variant,difficulty); assert(q);
  const fromPrompt=expectedFromVisiblePrompt(id,q.prompt);
  const published=nums(q.answer);
  assert.deepEqual(published,fromPrompt,`${id} v${variant} d${difficulty}: visible condition and answer`);
  assert(q.solution && strip(q.solution).length>0);
  if (id.endsWith("mission-1")) {
    const values=[...q.prompt.matchAll(/<tr><th>([\d,]+)<\/th>/g)].map(m=>Number(m[1].replaceAll(",","")));
    assert(values.every(n=>q.solution.includes(`${n.toLocaleString("en-US")}${particle(n,"는","은")}`)),"Mission 1 explanations must attach the correct Korean subject particle");
  } else if (id.endsWith("mission-2")) {
    const values=[...q.prompt.matchAll(/<li>([\d,]+)<\/li>/g)].map(m=>Number(m[1].replaceAll(",","")));
    assert(values.every(n=>q.solution.includes(`${n.toLocaleString("en-US")}${particle(n,"를","을")}`)),"Mission 2 explanations must attach the correct Korean object particle");
  } else {
    const target=Number(strip(q.prompt).match(/중에서 ([\d,]+)에 가장 가까운/)[1].replaceAll(",",""));
    const digits=[...q.prompt.matchAll(/digit-card[^>]*>(\d)</g)].map(m=>Number(m[1]));
    const candidates=permute(digits), winner=candidates.reduce((best,n)=>Math.abs(n-target)<Math.abs(best-target)?n:best,candidates[0]);
    assert(q.solution.includes(`${winner.toLocaleString("en-US")}${particle(winner,"를","을")}`),"Mission 3 explanation must attach the correct Korean object particle");
  }
  assert.equal(q.publisherKeyVerified,false);
  assert.equal(q.answerVerification,"independent-enumeration-user-authorized");
  assert.equal((q.prompt.match(/source52-rounding-blank/g)||[]).length,id.endsWith("mission-1")?6:0);
  questions.push({id,variant,difficulty,prompt:strip(q.prompt),answers:fromPrompt});
}
assert.equal(questions.length,27);
assert.equal(api.ids.length,6);
assert.deepEqual(api.getQuestion(api.ids[0],0,0).answerModel.values,[[5840,5900,6000],[8420,8500,9000]]);
assert.equal(api.getQuestion(api.ids[1],0,0).answer,"300, 200");
assert.equal(api.getQuestion(api.ids[2],0,0).answer,"398,000");
assert.equal(api.getQuestion(api.ids[2],1,0).answer,"402,000");
assert.equal(api.getQuestion(api.ids[2],2,0).answer,"602,000");
assert.equal(api.getQuestion(api.ids[0],3,0).verifiedPoolIndex,0,"No unlimited cycling beyond the verified pool");
assert.equal(api.getQuestion("5-2-u1-e2-mission-99"),null);
assert.equal(api.getQuestion(api.ids[0],-1,0),null);
assert.equal(api.getQuestion(api.ids[0],0,2),null);
const output=process.env.HSE_AUDIT_OUTPUT;
if(output){const fs=require("node:fs");const path=require("node:path");assert(path.isAbsolute(output));fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,"visible-prompt-configurations.json"),JSON.stringify({version:1,items:questions},null,2)+"\n");}
console.log(JSON.stringify({status:"passed",configurations:questions.length,types:api.ids.length,variants:3,difficultyOffsets:3,answersDerivedFromVisiblePrompt:true,solutionSeparation:questions.length,officialPublisherKey:false,uniqueCardWinners:true}));
