"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), test = require("node:test");
const reference = require("../competition/amc10-12-item-response-reference.js");
const keys = require("../competition/amc-original-answer-key-reference.js");
function csv(file) {
 const rows=[];let row=[],field="",quoted=false;const text=fs.readFileSync(path.join(__dirname,"../competition/historical-amc-grade",file),"utf8");
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field="";}else if(c==='\n'&&!quoted){row.push(field.replace(/\r$/,''));if(row.some(Boolean))rows.push(row);row=[];field="";}else field+=c;}
 if(field||row.length){row.push(field);rows.push(row);}const header=rows.shift();return rows.map(values=>Object.fromEntries(header.map((key,i)=>[key,values[i]||""])));
}
const source=csv("amc10-12-2009-item-response.csv");
const cohorts=[['amc10','A',72528,70.4,269],['amc10','B',31395,74.4,270],['amc12','A',82802,68.0,267],['amc12','B',34228,71.7,268]];

test("2009 MAA Table IX preserves all 100 source rows, public keys and source precision",()=>{
 assert.equal(source.length,100);const seen=new Set();
 for(const row of source){const program=row.contest.toLowerCase(),q=Number(row.question),id=[program,row.form,q].join(':');assert.ok(!seen.has(id));seen.add(id);assert.equal(row.year,'2009');assert.ok(q>=1&&q<=25);
  const item=reference.responseFor(program,2009,row.form,q,'A');assert.ok(item,id);assert.equal(item.correctAnswer,row.correct_answer);assert.equal(item.correctAnswer,keys.answerFor(program,2009,row.form,q).correctAnswer);
  for(const letter of 'ABCDE')assert.equal(item.responsePercent[letter],Number(row['option_'+letter.toLowerCase()+'_percent']));
  assert.equal(item.omittedPercent,Number(row.omitted_percent));assert.equal(item.unreadablePercent,null);assert.equal(row.unreadable_percent,'');assert.equal(item.respondentCount,Number(row.response_count));assert.equal(item.population,row.population);assert.equal(item.sourceUrl,row.source_url);
  const total=Object.values(item.responsePercent).reduce((a,b)=>a+b,item.omittedPercent);assert.ok(total>=99.93-1e-9&&total<=100+1e-9);assert.equal(item.availableQuestionCount,25);assert.equal(item.omittedPercentInferred,false);
 }
});
test("each 2009 form reconciles with its own printed Table I/II cohort and rounded mean",()=>{
 for(const [program,form,count,mean,page] of cohorts){let reconstructed=0;
  for(let q=1;q<=25;q++){const item=reference.responseFor(program,2009,form,q,'');assert.equal(item.respondentCount,count);reconstructed+=(6*item.correctResponsePercent+1.5*item.omittedPercent)/100;assert.match(item.sourceStatus,new RegExp('p\\.'+page));}
  assert.equal(Number(reconstructed.toFixed(1)),mean);assert.deepEqual(reference.populationsFor(program,2009,form).map(p=>[p.id,p.respondentCount]),[['global',count]]);
 }
});
test("2009 coverage rows match runtime availability without rewriting unrelated cohorts",()=>{
 const coverage=csv("amc-item-response-coverage-by-paper.csv");const identities=coverage.map(r=>[r.program,r.year,r.form].join(':'));assert.equal(new Set(identities).size,coverage.length);
 for(const [program,form,count] of cohorts){const rows=coverage.filter(r=>r.program===program&&r.year==='2009'&&r.form===form);assert.equal(rows.length,1);assert.equal(rows[0].questions_with_usable_item_response,'25');assert.equal(rows[0].expected_questions,'25');assert.equal(rows[0].respondent_count,String(count));assert.match(rows[0].coverage_status,/complete/);assert.match(rows[0].response_population,/all official/);}
 assert.equal(reference.responseFor('amc10',2009,'C',1,''),null);assert.equal(reference.responseFor('amc12',2009,'A',26,''),null);
});
