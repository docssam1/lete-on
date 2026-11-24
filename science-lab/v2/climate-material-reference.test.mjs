import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{climateContextPriorWorkbook as workbook,climateMaterialPriorWorkbook as prior}from'../data/book/c22-s42-u04.workbook.js';
import{CLIMATE_MATERIAL_REFERENCE_VERSION as version,climateHouseHeightReference,climateHouseHeightCondition,climateHeatwaveReadingNotes,withClimateMaterialReferences}from'../data/book/c22-s42-u04.rail-notes.js';
import{revisedTextbookPaper}from'./revised-textbook.js';import{withThink}from'./think-merge.js';
const unit='c22-s42-u04',houseTitle='어느 집이 먼저 물에 닿았나요?',heatTitle='표가 말해 주는 것과 말해 주지 않는 것';
test('the climate result page repeats only the existing five house heights and the heatwave page has weather reading notes in both editions',()=>{
 assert.equal(workbook.questions,prior.questions);assert.equal(workbook.figures,prior.figures);assert.equal(workbook.teacherPages,prior.teacherPages);assert.equal(workbook.quickPages,prior.quickPages);
 for(const key of ['pages','teacherStudentPages']){
  let changed=0;assert.equal(workbook[key].length,prior[key].length);
  for(let i=0;i<workbook[key].length;i++){
   const a=prior[key][i],b=workbook[key][i];if(a===b)continue;changed++;
   if(b.title===houseTitle){const source=prior.pages.find(p=>p.title==='해안 마을 모형으로 실험해요').blocks.find(b=>b.type==='table');assert.deepEqual(b.blocks[2].heads.slice(1),source.rows.map(r=>r[0]));assert.deepEqual(b.blocks[2].rows[0].slice(1),source.rows.map(r=>r[2].replace(' cm','')));assert.deepEqual(b.blocks,[a.blocks[0],{type:'text',text:climateHouseHeightCondition},climateHouseHeightReference,a.blocks[1]]);assert.deepEqual({...b,blocks:a.blocks},a);assert(!JSON.stringify(b.blocks.slice(1,3)).includes('B, C'));}
   else{assert.equal(b.title,heatTitle);assert.equal(b.blocks,a.blocks);assert.deepEqual(b.rail.map(n=>n.write),a.rail.map(n=>n.write));assert.equal(b.rail[0],a.rail[0]);assert.deepEqual(b.rail.slice(1).map(n=>n.text),climateHeatwaveReadingNotes);assert(!JSON.stringify(b.rail).includes('전기'));assert(b.rail[1].text.includes('5~6학년'));assert.deepEqual({...b,rail:a.rail},a);}
  }
  assert.equal(changed,2);
 }
 assert.equal(withClimateMaterialReferences(workbook),workbook);
 const other={...prior,unit:'other'};assert.equal(withClimateMaterialReferences(other),other);
 const changedSource={...prior,pages:prior.pages.map(p=>p.title==='해안 마을 모형으로 실험해요'?{...p,blocks:[]}:p),teacherStudentPages:undefined};const guarded=withClimateMaterialReferences(changedSource);assert.equal(guarded.pages.find(p=>p.title===houseTitle),changedSource.pages.find(p=>p.title===houseTitle));
 const future={...prior,pages:prior.pages.map(p=>p.title===houseTitle?{...p,blocks:[...p.blocks,{type:'text',text:'future material'}]}:p.title===heatTitle?{...p,rail:p.rail.map(n=>({...n,text:'future reviewed note'}))}:p),teacherStudentPages:undefined};assert.equal(withClimateMaterialReferences(future),future);
});

test('both actual climate workbook routes put the compact height table on the result page, keep writing lines and hide student answers',async()=>{
 const code=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),start=code.indexOf('const UNITS = ')+14,end=code.indexOf('\n// 문제은행만',start),literal=code.slice(start,end).trim().replace(/;$/,'');
 const loaders=new vm.Script('('+literal+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
 const currentPaper=await revisedTextbookPaper(unit);for(const paper of [currentPaper,await loaders[unit]()])for(const mode of ['student','teacher','answers','quick']){
  const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));
  if(['student','teacher'].includes(mode)){
   const pages=html.split('<section class="bk-page '),house=pages.find(p=>p.includes('data-question="'+unit+'-w017"')),heat=pages.find(p=>p.includes('data-question="'+unit+'-w027"'));assert(house&&heat);assert(house.includes(climateHouseHeightCondition));assert(house.includes('땅 높이(cm)'));assert.equal((house.match(/<table/g)||[]).length,1);for(const h of ['4.5','1.5','2.5','3.5','6'])assert(house.includes('>'+h+'<'));assert(heat.includes(climateHeatwaveReadingNotes[0]));assert(heat.includes(paper===currentPaper?'비교하기 전에 같은 장소인지 살펴보세요.':climateHeatwaveReadingNotes[1]));assert(!heat.includes('쓴 전기'));if(mode==='student'){assert(house.includes(paper===currentPaper?'ed-choices':'ed-lines'));assert(heat.includes(paper===currentPaper?'ed-choices':'ed-lines'));}else{assert(house.includes('class="ed-key"'));assert(heat.includes('class="ed-key"'));}
  }
  if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
 }
});

test('the shared loader refreshes the generated climate manuscript while the existing photo cache stays independent',async()=>{
 const url=new URL('./revised-textbook.js',import.meta.url),context=vm.createContext({structuredClone}),cache=new Map();let fresh=0,stale=0;
 async function synthetic(ns){const m=new vm.SyntheticModule(Object.keys(ns),function(){for(const[k,v]of Object.entries(ns))this.setExport(k,v);},{context});await m.link(()=>{});await m.evaluate();return m;}
 const m=new vm.SourceTextModule(fs.readFileSync(url,'utf8'),{context,identifier:url.href,importModuleDynamically:async spec=>{const target=new URL(spec,url);if(target.pathname.endsWith('/'+unit+'.workbook.js')){if(target.searchParams.get('v')===CLIMATE_CONTEXT_VERSION)fresh++;else{stale++;return synthetic({workbook:prior});}}return import(target.href);}});
 await m.link(async spec=>{const target=new URL(spec,url);if(!cache.has(target.href))cache.set(target.href,await synthetic(await import(target.href)));return cache.get(target.href);});await m.evaluate();const paper=await m.namespace.revisedTextbookPaper(unit);assert(paper.workbookPaper({mode:'student'}).includes(climateHouseHeightCondition));assert.equal(fresh,1);assert.equal(stale,0);
 const app=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),active=app.match(/revised-textbook\.js\?v=([^'\"]+)/)?.[1];assert(active);assert(app.includes('./revised-lesson.js?v='+active));assert(fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8').includes('./revised-textbook.js?v='+active));assert(fs.readFileSync(new URL('./index.html',import.meta.url),'utf8').includes('&book='+active));
});

import{CLIMATE_CONTEXT_VERSION}from'../data/book/climate-workbook-context.js';
