import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{withGasContextWorkbook,GAS_CONTEXT_VERSION as version}from'../data/book/gas-workbook-context.js';
import{gasPhotoPriorWorkbook as workbook,gasContextPriorWorkbook as prior}from'../data/book/c22-s42-u03.workbook.js';
import{revisedTextbook,revisedTextbookPaper}from'./revised-textbook.js';import{renderChapter}from'./book.js';
const unit='c22-s42-u03',id=unit+'-w055',esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('the open and closed syringe conditions occur inside question 55 in the actual student and teacher workbook routes',async()=>{
 const q=workbook.questions.find(q=>q.id===id),old=prior.questions.find(q=>q.id===id);assert.equal(old.given,undefined);assert.equal(q.given.length,2);assert(q.given[1].includes('A: 끝을 막아'));assert(q.given[1].includes('B: 끝이 열려'));
 assert.deepEqual({...q,given:undefined},{...old,given:undefined});assert.equal(q.responseContract.teacherRequired,true);assert.equal(q.answer,old.answer);assert.equal(q.criteria,old.criteria);
 const raw=await import('../data/book/'+unit+'.book.js'),book=await revisedTextbook(unit,raw),paper=await revisedTextbookPaper(unit);
 for(const mode of['student','teacher'])for(const html of[paper.workbookPaper({mode}),renderChapter(book.chapter,book.art,[],{teacher:mode==='teacher',live:true})]){
  const start=html.indexOf('data-question="'+id+'"');assert(start>=0);const item=html.slice(start,html.indexOf('</li>',start));for(const given of q.given)assert(item.includes(esc(given)));assert.equal(item.includes('class="ed-key"'),mode==='teacher');
 }
 const app=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),lesson=fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');for(const source of[app,lesson,index])assert(source.includes('&gasContext='+version));
});

test('material additions preserve every answer and response contract, and full-question guards retain existing, source and future material',()=>{
 const original=structuredClone(prior);assert.deepEqual(withGasContextWorkbook(prior),workbook);assert.deepEqual(prior,original);assert.equal(withGasContextWorkbook(workbook),workbook);assert.equal(withGasContextWorkbook({...prior,unit:'other'}).unit,'other');
 for(const key of['figures','teacherPages','quickPages'])assert.equal(workbook[key],prior[key]);assert.equal(workbook.questions.length,80);
 assert.deepEqual(workbook.questions.filter((q,i)=>q!==prior.questions[i]).map(q=>q.no),[24,55,67]);
 for(let i=0;i<80;i++){const q=workbook.questions[i],old=prior.questions[i];for(const key of new Set([...Object.keys(q),...Object.keys(old)]))if(!['prompt','explanation','misconception','given'].includes(key))assert.deepEqual(q[key],old[key]);}
 for(const fields of[{prompt:'future prompt'},{given:['already supplied']},{sourceRef:{type:'original'}},{contentVersion:'future'},{responseContract:{teacherRequired:false}}]){
  const input={...prior,questions:prior.questions.map(q=>({...q,...fields}))};assert.equal(withGasContextWorkbook(input),input);
 }
});
