import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{workbook,climateContextPriorWorkbook as prior}from'../data/book/c22-s42-u04.workbook.js';
import{withClimateWorkbookContext,CLIMATE_CONTEXT_VERSION as version}from'../data/book/climate-workbook-context.js';
import{revisedTextbook,revisedTextbookPaper}from'./revised-textbook.js';import{renderChapter}from'./book.js';
const unit='c22-s42-u04',at=(book,n)=>book.questions.find(q=>q.no===n),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('actual climate student and teacher routes supply the A/D model facts and align required criteria with what each question asks',async()=>{
 const q=at(workbook,44);assert.equal(at(prior,44).given,undefined);assert.equal(q.given.length,2);assert(q.given[0].includes('방파제가 없고'));assert(q.given[0].includes('물높이는 4 cm'));assert(q.given[1].includes('바다 바로 옆'));assert(q.given[1].includes('4.5 cm'));assert(q.given[1].includes('3.5 cm'));assert(!q.given.join('').includes('젖지'));assert(!q.given.join('').includes('물에 닿았다'));
 const raw=await import('../data/book/'+unit+'.book.js'),book=await revisedTextbook(unit,raw),paper=await revisedTextbookPaper(unit);
 for(const mode of['student','teacher'])for(const html of[paper.workbookPaper({mode}),renderChapter(book.chapter,book.art,[],{teacher:mode==='teacher',live:true})]){
  const start=html.indexOf('data-question="'+q.id+'"');assert(start>=0);const item=html.slice(start,html.indexOf('</li>',start));for(const text of q.given)assert(item.includes(esc(text)));assert.equal(item.includes('class="ed-key"'),mode==='teacher');
  for(const title of['생물의 변화를 볼 때 무엇을 같게 살필까요?','사례와 영향을 이어요','읽고 설명해요'])assert(html.includes(title));assert(html.includes('꽃이 핀 날을 비교할 때 같게 살펴야 할 조건'));assert(!html.includes('생물의 수가 달라진 까닭'));
 }
 const wall=at(workbook,22),cards=at(workbook,78),order=at(workbook,76);assert(wall.prompt.includes('모형 결과로'));assert(!wall.criteria.includes('실제'));assert.equal(wall.responseContract.criteria,wall.criteria);assert.equal(wall.responseContract.teacherRequired,true);assert.deepEqual(cards.responseContract.requiredElements,at(prior,78).responseContract.requiredElements.slice(0,3));assert(!cards.criteria.includes('제공 자료'));assert.equal(cards.responseContract.teacherRequired,true);
 assert(order.given[3].startsWith('ㄹ. 적은 내용을 보고'));assert.deepEqual(order.responseContract,at(prior,76).responseContract);
 for(const name of['v2.js','revised-lesson.js','index.html'])assert(fs.readFileSync(new URL('./'+name,import.meta.url),'utf8').includes('&climateContext='+version));
});

test('exact question and full-page guards preserve all keys, optional upper learning, writing space, original and future material',()=>{
 const saved=structuredClone(prior);assert.deepEqual(withClimateWorkbookContext(prior),workbook);assert.deepEqual(prior,saved);assert.equal(withClimateWorkbookContext(workbook),workbook);const other={...prior,unit:'other'};assert.equal(withClimateWorkbookContext(other),other);
 for(const key of['figures','teacherPages','quickPages'])assert.equal(workbook[key],prior[key]);assert.equal(workbook.questions.length,80);assert.deepEqual(workbook.questions.filter((q,i)=>q!==prior.questions[i]).map(q=>q.no),[22,44,76,78]);
 for(let i=0;i<80;i++){const q=workbook.questions[i],old=prior.questions[i];for(const key of['id','no','form','prompt','choices','parts','key','answer','explanation','taxonomy','status','sourceRef'])assert.deepEqual(q[key],old[key]);}
 for(const group of['pages','teacherStudentPages']){let changed=0;assert.equal(workbook[group].length,prior[group].length);for(let i=0;i<prior[group].length;i++){const before=prior[group][i],now=workbook[group][i];if(now===before)continue;changed++;assert.equal(now.title,before.title);assert.deepEqual(now.blocks,before.blocks);assert.deepEqual(now.rail[1],before.rail[1]);assert.deepEqual(now.rail.map(n=>n.write),before.rail.map(n=>n.write));assert.deepEqual({...now,rail:before.rail},before);}assert.equal(changed,10);}
 for(const fields of[{prompt:'future prompt'},{given:['already supplied']},{status:'source'},{sourceRef:{type:'original'}},{contentVersion:'future'},{responseContract:{teacherRequired:false}}]){const input={...prior,questions:prior.questions.map(q=>({...q,...fields})),pages:prior.pages.map(p=>({...p,title:p.title+' future'})),teacherStudentPages:undefined};assert.equal(withClimateWorkbookContext(input),input);}
 const page=prior.pages.find(p=>p.title==='읽고 설명해요'),edited={...prior,questions:prior.questions.map(q=>q.no===44?{...q,given:['future A/D facts']}:q)};assert.equal(withClimateWorkbookContext(edited).pages.find(p=>p.title===page.title),page);
});
