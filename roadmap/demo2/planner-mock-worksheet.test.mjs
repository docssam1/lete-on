import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const read=name=>readFileSync(new URL(name,import.meta.url),'utf8');
const plain=value=>JSON.parse(JSON.stringify(value));
function setup(extra={}){
 const window={location:{href:'https://roadmap.gfieldacademy.net/roadmap/demo2/planner.html'},document:{currentScript:{src:'https://roadmap.gfieldacademy.net/roadmap/demo2/planner-mock-worksheet.js?v=test'}},...extra};
 const context=vm.createContext({window,URL});
 for(const file of ['planner-mock-schedule.js','planner-mock-library-data.js','planner-mock-library.js','planner-mock-items-data.js','planner-mock-items.js','planner-mock-paper-layouts.js','planner-mock-score-data.js','planner-mock-worksheet.js'])vm.runInContext(read(file),context,{filename:file});
 return{window,W:window.PlannerMockWorksheet,I:window.PlannerMockItems,S:window.PlannerMockSchedule,L:window.PlannerMockLibrary};
}
function current(s,id='h1-06'){
 const paper=s.S.resolvePaper(id),selection=s.I.select(paper,['c1-poly','c1-remainder']);
 return{paper,selection,practiceDate:'2026-11-06'};
}

test('only the actual selected questions are matched to the exact official PDF layout, without changing saved selections',()=>{
 const s=setup(),options=current(s),before=JSON.stringify(options),result=s.W.validate(options);
 assert.equal(result.error,undefined);assert.ok(result.items.length>0);
 assert.deepEqual(plain(result.items.map(q=>q.number)),plain(options.selection.selected));
 assert.ok(result.items.every(q=>!options.selection.excludedUnlearned.includes(q.number)));
 assert.equal(result.layout.sourceUrl,options.paper.files.problem);assert.equal(JSON.stringify(options),before);
});

test('projected, empty, invalid, mismatched and duplicated selections do not become a worksheet',()=>{
 const s=setup(),options=current(s),raw=options.selection;
 for(const selection of [null,{...raw,projected:true},{...raw,selected:[]},{...raw,paperId:'h2-06'},{...raw,selected:[1,1]},{...raw,selected:[0]},{...raw,selected:[31]}])assert.ok(s.W.validate({...options,selection}).error);
 assert.ok(s.W.validate({...options,paper:{id:'h1-06',exam:'2025년 6월 학평',level:'3'}}).error);
});

test('missing layouts, changed sources or hashes and invalid crop boundaries fail closed',()=>{
 const s=setup(),options=current(s),id=options.paper.id,original=plain(s.window.PlannerMockPaperLayoutData[id]),number=options.selection.selected[0];
 const variants=[null,{...original,sourceUrl:'https://evil.test/p.pdf'},{...original,sourceUrl:options.paper.files.explanation},{...original,sha256:'not-a-digest'}];
 for(const patch of [{page:0},{page:original.pageCount+1},{rect:[-1,0,20,30]},{rect:[0,0,1e6,30]},{rect:[0,0,30,1e6]},{rect:[0,0,0,20]},{rect:[0,0,NaN,20]},{rect:[0,0,20]}])variants.push({...original,items:original.items.map(q=>q.number===number?{...q,...patch}:q)});
 variants.push({...original,items:original.items.filter(q=>q.number!==number)});
 for(const layout of variants){s.window.PlannerMockPaperLayoutData[id]=layout;assert.ok(s.W.validate(options).error,JSON.stringify(layout));}
 s.window.PlannerMockPaperLayoutData[id]=original;assert.equal(s.W.validate(options).error,undefined);
});

test('all published crop metadata has exact source identity, unique question numbers and in-page nonoverlapping rectangles',()=>{
 const s=setup(),entries=Object.entries(s.window.PlannerMockPaperLayoutData);assert.ok(entries.length>0);
 for(const [id,layout]of entries){
  const paper=s.S.resolvePaper(id);assert.ok(paper,id);assert.equal(layout.sourceUrl,paper.files.problem,id);assert.match(layout.sha256,/^[a-f0-9]{64}$/);
  assert.ok(Number.isInteger(layout.pageCount)&&layout.pageCount>0);assert.equal(layout.pages.length,layout.pageCount,id);
  assert.equal(layout.items.length,30,id);assert.deepEqual(plain(layout.items.map(q=>q.number).sort((a,b)=>a-b)),Array.from({length:30},(_,i)=>i+1),id);
  assert.equal(layout.items.reduce((sum,q)=>sum+q.points,0),100,id);
  for(const page of layout.pages)assert.ok(Number.isFinite(page.width)&&page.width>0&&Number.isFinite(page.height)&&page.height>0,id);
  for(const item of layout.items){
   assert.ok([2,3,4].includes(item.points),id);const page=layout.pages[item.page-1];assert.ok(page,id);
   const [x0,y0,x1,y1]=item.rect;assert.ok(item.rect.length===4&&item.rect.every(Number.isFinite)&&x0>=0&&y0>=0&&x0<x1&&y0<y1&&x1<=page.width&&y1<=page.height,id+' #'+item.number);
   for(const other of layout.items.filter(q=>q.number>item.number&&q.page===item.page)){
    const overlapX=Math.min(x1,other.rect[2])-Math.max(x0,other.rect[0]),overlapY=Math.min(y1,other.rect[3])-Math.max(y0,other.rect[1]);
    assert.ok(overlapX<=0||overlapY<=0,id+' overlapping #'+item.number+'/#'+other.number);
   }
  }
 }
});

test('published layout data contains positions and official provenance, never original problem, answer or solution payloads',()=>{
 const s=setup();
 for(const layout of Object.values(s.window.PlannerMockPaperLayoutData)){
  assert.deepEqual(Object.keys(layout).sort(),['sourceUrl','sha256','pageCount','pages','items'].sort());
  for(const page of layout.pages)assert.deepEqual(Object.keys(page).sort(),['height','width']);
  for(const item of layout.items)assert.deepEqual(Object.keys(item).sort(),['number','points','page','rect'].sort());
 }
 assert.doesNotMatch(read('planner-mock-paper-layouts.js'),/data:application\/pdf|data:image\/|%PDF-|base64,/);
});

test('popup shell escapes labels, starts print buttons disabled and keeps answers separate from the question original',()=>{
 const s=setup(),options=current(s),label='<img src=x onerror=alert(1)>',html=s.W.shell({...options.paper,title:label},options.selection,label);
 assert.match(html,/<!doctype html>/i);assert.match(html,/<html lang="ko">/);assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img src=x|<script|<iframe|<object|<embed/i);
 assert.match(html,/data-print disabled/);assert.match(html,/data-guide disabled/);assert.match(html,/data-status role="status"/);assert.match(html,/rel="noopener noreferrer"/);
 assert.ok(html.includes(options.paper.files.problem));assert.ok(!html.includes(options.paper.files.explanation));assert.match(html,/planner-mock-worksheet\.css\?v=/);assert.match(html,/name="referrer" content="no-referrer"/);
});

test('invalid worksheet requests never open a popup, and browser popup refusal is reported without starting PDF work',()=>{
 const calls=[],s=setup({open:(...args)=>{calls.push(args);return null;}}),options=current(s);
 const invalid=s.W.open({...options,selection:{...options.selection,projected:true}});assert.equal(invalid.ok,false);assert.equal(calls.length,0);
 const blocked=s.W.open(options);assert.equal(blocked.ok,false);assert.match(blocked.error,/팝업/);assert.deepEqual(calls,[['about:blank','_blank']]);
});


test('official 100-point scoring matches each verified crop and has all 92 catalogue paper identities',()=>{
 const s=setup(),data=s.window.PlannerMockScoreData;assert.equal(Object.keys(data).length,92);
 for(const [id,row]of Object.entries(data)){const layout=s.window.PlannerMockPaperLayoutData[id];assert.ok(layout);assert.equal(row.sourceUrl,layout.sourceUrl);assert.equal(row.verified,true);assert.equal(Object.keys(row.points).length,30);assert.equal(Object.values(row.points).reduce((a,b)=>a+b,0),100);for(const q of layout.items)assert.equal(row.points[q.number],q.points,id+' #'+q.number);}
});
