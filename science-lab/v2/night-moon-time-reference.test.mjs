import{MATERIAL_READING_VERSION}from'../data/book/material-reading-criteria.js';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{NIGHT_MOON_TIME_REFERENCE_VERSION as version,nightMoonTimeGiven,withNightMoonTimeReference}from'../data/book/c22-s42-u01.rail-notes.js';import{materialReadingPriorWorkbook as workbook,nightMoonTimePriorWorkbook as prior}from'../data/book/c22-s42-u01.workbook.js';import{revisedTextbookPaper}from'./revised-textbook.js';
const unit='c22-s42-u01',id=unit+'-w024';
test('the Moon comparison exercise carries the existing evening and dawn conditions beside its blanks without changing answers or writing areas',()=>{
 let n=0;for(let i=0;i<workbook.questions.length;i++){const q=workbook.questions[i],old=prior.questions[i];if(q.id!==id){assert.deepEqual(q,old);continue;}n++;for(const key of new Set([...Object.keys(q),...Object.keys(old)]))if(!['prompt','given'].includes(key))assert.deepEqual(q[key],old[key]);assert.deepEqual(q.given,nightMoonTimeGiven);assert.equal(q.answer,'㉠ 시각 · ㉡ 새벽');assert(!q.prompt.includes('저녁 표'));}
 assert.equal(n,1);for(const key of Object.keys(prior).filter(k=>k!=='questions'))assert.equal(workbook[key],prior[key]);assert.equal(withNightMoonTimeReference(workbook),workbook);const unsupported={...prior,unit:'other'};assert.equal(withNightMoonTimeReference(unsupported),unsupported);
 for(const patch of[{prompt:'future'},{given:['existing']},{figure:'existing'},{contentVersion:'future'},{sourceRef:{type:'original'}},{no:25},{form:'written'}]){const future={...prior,questions:prior.questions.map(q=>q.id===id?{...q,...patch}:q)};assert.equal(withNightMoonTimeReference(future),future);}
 const future={...prior,figures:{...prior.figures,skyDawn:'later reviewed data'}};assert.equal(withNightMoonTimeReference(future),future);
 for(const day of['3일','7일','15일'])assert(prior.figures.skyEvening.includes(day));for(const day of['22일','26일'])assert(prior.figures.skyDawn.includes(day));assert(prior.figures.skyEvening.includes('저녁 7시쯤'));assert(prior.figures.skyDawn.includes('새벽 6시쯤'));assert.equal(prior.pages[4].blocks[0].key,'skyEvening');assert.equal(prior.pages[6].blocks[0].key,'skyDawn');
});

test('actual student and teacher papers place all time conditions in question 24 while answers remain hidden in the student view',async()=>{
 const paper=await revisedTextbookPaper(unit),q=workbook.questions.find(q=>q.id===id);
 for(const mode of['student','teacher','answers','quick']){const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));if(['student','teacher'].includes(mode)){const start=html.indexOf('data-question="'+id+'"'),end=html.indexOf('</li>',start),block=html.slice(start,end);assert(start>=0);assert(block.includes('다음 모형 자료에서'));for(const line of nightMoonTimeGiven)assert(block.includes(line));assert.equal((block.match(/class="ed-given"/g)||[]).length,1);}if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));}
});

test('the actual shared textbook loader bypasses an older cached night workbook and the app entry refreshes the workbook independently of photo CSS',async()=>{
 const url=new URL('./revised-textbook.js',import.meta.url),source=fs.readFileSync(url,'utf8'),context=vm.createContext({structuredClone}),cache=new Map();let fresh=0,stale=0;
 async function synthetic(ns){const m=new vm.SyntheticModule(Object.keys(ns),function(){for(const[k,v]of Object.entries(ns))this.setExport(k,v);},{context});await m.link(()=>{});await m.evaluate();return m;}
 const compiled=new vm.SourceTextModule(source,{context,identifier:url.href,importModuleDynamically:async spec=>{const target=new URL(spec,url);if(target.pathname.endsWith('/'+unit+'.workbook.js')){if(target.searchParams.get('v')===SKY_RESPONSE_VERSION)fresh++;else{stale++;return synthetic({workbook:prior});}}return import(target.href);}});
 await compiled.link(async spec=>{const target=new URL(spec,url);if(!cache.has(target.href))cache.set(target.href,await synthetic(await import(target.href)));return cache.get(target.href);});await compiled.evaluate();const paper=await compiled.namespace.revisedTextbookPaper(unit);assert(paper.workbookPaper({mode:'student'}).includes(nightMoonTimeGiven[2]));assert.equal(fresh,1);assert.equal(stale,0);
 const app=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),lesson=fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');const active=app.match(/revised-textbook\.js\?v=([^'\"]+)/)?.[1];assert(active);assert(app.includes('./revised-lesson.js?v='+active));assert(lesson.includes('./revised-textbook.js?v='+active));assert(index.includes('&book='+active));
});

import{SKY_WORKBOOK_DIRECTIONS_VERSION}from'../data/book/sky-workbook-directions.js';

import{SKY_RESPONSE_VERSION}from'../data/book/sky-response-review.js';
