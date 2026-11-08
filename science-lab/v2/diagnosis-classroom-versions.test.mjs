import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {withThink} from './think-merge.js';
import {revisedClassroom,classroomQuestions,withOptionalClassroomRecords} from './revised-lesson.js';
import {revisedTextbookUnits} from './revised-textbook.js';
import {questionVersion,questionAtVersion,pickedChoiceTexts} from './question-revision.js';
import {analyze,remedyItems} from './progress.js';

const source=await readFile(new URL('./v2.js',import.meta.url),'utf8');
const cases=[['s31-u01',['s31-u01-v020']],['s31-u02',['s31-u02-v003','s31-u02-v012','s31-u02-v013']]];
const escape=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const excerpt=s=>escape(s.length>40?s.slice(0,40)+'…':s);
function actualLoaders(context){
 const start=source.indexOf('const UNITS = ')+14,end=source.indexOf('\n// 문제은행만',start);
 return new vm.Script('('+source.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(context);
}
function routeHarness(unit,{book,hash='#/'+unit+'/diagnose'}={}){
 let rendered=null,bookLoads=0;
 const context=vm.createContext({
  routeRevision:0,location:{hash,replace(value){this.hash=value;}},releasePage(){},stopTeacher(){},stepGuide:null,
  withThink,revisedClassroom,classroomQuestions,withOptionalClassroomRecords,revisedTextbookUnits,
  BANK:{},$app:{},FIG:{},BOOKX:{},MISC:null,
  BOOKS:{[unit]:async()=>{bookLoads++;return book?book():import('../data/book/'+unit+'.book.js');}},
  pageDiagnose:(...args)=>{rendered=args;},
 });
 context.UNITS=actualLoaders(context);
 const start=source.indexOf('async function route()'),end=source.indexOf("addEventListener('hashchange', route)",start);
 const route=new vm.Script('('+source.slice(start,end)+')').runInContext(context);
 return {context,route,get rendered(){return rendered;},get bookLoads(){return bookLoads;}};
}
function renderDiagnosis(args,{events=[],repeat=false}={}){
 let html='',writes=0,callback,renderCount=0,remedial=[];
 const [unit]=args,saved=globalThis.localStorage,before=JSON.stringify(events);
 globalThis.localStorage={getItem:()=>JSON.stringify({[unit]:events}),setItem(){writes++;throw Error('diagnosis must not write answers');}};
 const pool=args[4]||[...(args.book.similar||[]),...(args.book.source||[]),...(args[2]||[])];
 const context=vm.createContext({
  pickedChoiceTexts,questionAtVersion,revisedTextbookUnits,analyze,
  remedyItems:(...values)=>{const rows=remedyItems(...values);remedial.push(...rows);return rows;},
  MISC:args.misc,BOOKX:args.book,du:x=>x,esc:escape,CIRC:['①','②','③','④','⑤'],
  frame:(_u,_l,_n,value)=>{html=value;renderCount++;},
  $app:{querySelectorAll:()=>repeat&&renderCount===1?[{dataset:{id:pool[0].id}}]:[],querySelector:()=>null},
  itemHtml:q=>`<article data-question="${q.id}"></article>`,wireItem:(_node,_q,done)=>{callback=done;},setTimeout:fn=>fn(),
 });
 const start=source.indexOf('function pageDiagnose('),end=source.indexOf('// 소단원 = 교육과정 내용 요소.',start);
 try{
  const page=new vm.Script(source.slice(start,end)+'\npageDiagnose').runInContext(context);
  page(...args);if(repeat){assert(callback);callback();assert.equal(renderCount,2);}
  assert.equal(writes,0);assert.equal(JSON.stringify(events),before);
  return {html,remedial};
 }finally{if(saved===undefined)delete globalThis.localStorage;else globalThis.localStorage=saved;}
}

test('actual diagnosis route resolves the four clarified classroom presentations and original history',async()=>{
 for(const [unit,ids]of cases){
  const harness=routeHarness(unit);await harness.route();
  const args=harness.rendered;assert(args);args.book=harness.context.BOOKX;args.misc=harness.context.MISC;
  const mod=await harness.context.UNITS[unit](),rawPool=[...(mod.similar||[]),...(mod.source||[]),...(mod.items||[])];
  const classroom=await revisedClassroom(unit,await import('../data/book/'+unit+'.book.js'));
  assert.equal(args[4]?.length,rawPool.length,'route supplies the full versioned question pool');
  for(const id of ids){
   const q=classroom.classroomItems.find(q=>q.id===id),current=args[4].find(q=>q.id===id),old=questionAtVersion(q,1);
   assert.equal(current,q);assert.equal(questionAtVersion(current,1).prompt,old.prompt);
   const picked=0,m=Object.keys(args.misc.misconceptions)[0];
   const event={id,ok:false,m:[m],stage:'deck',at:1,...(q.choices?{picked}:{typed:'stored written response'}),presentationVersion:questionVersion(q)};
   const now=renderDiagnosis(args,{events:[event]});assert(now.html.includes(excerpt(q.prompt)));
   assert(!now.html.includes('이전 문항의 내용을 확인할 수 없어요.'));
   const previous=renderDiagnosis(args,{events:[{...event,presentationVersion:1}]});assert(previous.html.includes(excerpt(old.prompt)));
   const missing=renderDiagnosis(args,{events:[{...event,presentationVersion:'unknown'}]});assert(missing.html.includes('이전 문항의 내용을 확인할 수 없어요.'));
   assert(!missing.html.includes(excerpt(q.prompt)));
   if(q.choices){const snapshot=renderDiagnosis(args,{events:[{...event,pickedTexts:['stored choice presentation']}]});assert(snapshot.html.includes('stored choice presentation'));}
   else assert(now.html.includes('stored written response'));
  }
  for(const q of rawPool.filter(q=>q.status!=='authored'))if(!ids.includes(q.id))assert.equal(args[4].find(x=>x.id===q.id),q);
 }
});

test('diagnosis rerender after a remedial answer retains the current classroom pool',async()=>{
 const harness=routeHarness('s31-u02');await harness.route();const args=harness.rendered;
 args.book=harness.context.BOOKX;args.misc=harness.context.MISC;
 const q=(await revisedClassroom('s31-u02',await import('../data/book/s31-u02.book.js'))).classroomItems.find(q=>q.id==='s31-u02-v013');
 const event={id:q.id,ok:false,m:[Object.keys(args.misc.misconceptions)[0]],stage:'deck',at:1,picked:0,presentationVersion:questionVersion(q)};
 const output=renderDiagnosis(args,{events:[event],repeat:true});assert(output.html.includes(excerpt(q.prompt)));
 for(const remedial of output.remedial){const current=args[4]?.find(q=>q.id===remedial.id);assert.equal(remedial,current);}
});

test('diagnosis async loading respects navigation cancellation and handles unavailable classroom data',async()=>{
 let release,entered;
 const enteredPromise=new Promise(resolve=>{entered=resolve;});
 const harness=routeHarness('s31-u01',{book:()=>{entered();return new Promise(resolve=>{release=resolve;});}});
 const pending=harness.route();
 const result=await Promise.race([enteredPromise.then(()=>true),pending.then(()=>false)]);assert(result,'diagnosis loads its classroom before rendering');
 harness.context.location.hash='#/s31-u02/start';release(await import('../data/book/s31-u01.book.js'));await pending;assert.equal(harness.rendered,null);
 const failed=routeHarness('s31-u01',{book:()=>Promise.reject(Error('fixture unavailable'))});await failed.route();
 assert(failed.rendered);assert(Array.isArray(failed.rendered[4]));assert(failed.rendered[4].length>0);
});
