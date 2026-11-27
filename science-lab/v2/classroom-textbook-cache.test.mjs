import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {revisedTextbookUnits} from './revised-textbook.js';
import {revisedClassroom} from './revised-lesson.js';

test('all 32 classrooms use the current shared textbook when prior loader URLs are cached',async()=>{
 const appUrl=new URL('./v2.js',import.meta.url),lessonUrl=new URL('./revised-lesson.js',import.meta.url);
 const app=fs.readFileSync(appUrl,'utf8'),lesson=fs.readFileSync(lessonUrl,'utf8');
 const importFor=(source,name)=>source.match(new RegExp(`from ['"](\\./${name}\\.js[^'"]*)['"]`))[1];
 const textbookSpec=importFor(app,'revised-textbook'),lessonSpec=importFor(app,'revised-lesson');
 const textbook=await import(new URL(textbookSpec,appUrl).href),context=vm.createContext({structuredClone});
 let cachedTextbookReads=0,cachedClassroomReads=0,currentTextbookCalls=0;
 async function synthetic(exports){
  const module=new vm.SyntheticModule(Object.keys(exports),function(){for(const[key,value]of Object.entries(exports))this.setExport(key,value);},{context});
  await module.link(()=>{});return module;
 }
 const oldTextbook=await synthetic({revisedTextbook:async(_unit,mod)=>mod});
 const oldClassroom=await synthetic({revisedClassroom:async(_unit,mod)=>mod});
 const currentTextbook=await synthetic({...textbook,revisedTextbook:async(unit,mod)=>{currentTextbookCalls++;return textbook.revisedTextbook(unit,mod);}});
 const currentLesson=new vm.SourceTextModule(lesson,{context,identifier:lessonUrl.href,importModuleDynamically:spec=>import(new URL(spec,lessonUrl).href)});
 await currentLesson.link(async spec=>{
  if(spec==='./revised-textbook.js?v=20261108-ecology-elementary'){cachedTextbookReads++;return oldTextbook;}
  if(spec===textbookSpec)return currentTextbook;
  return synthetic({...await import(new URL(spec,lessonUrl).href)});
 });
 const entry=new vm.SourceTextModule(`export {revisedClassroom} from ${JSON.stringify(lessonSpec)};`,{context,identifier:appUrl.href});
 await entry.link(spec=>{
  if(spec==='./revised-lesson.js?v=20261108-elementary-question-prompts'){cachedClassroomReads++;return oldClassroom;}
  assert.equal(new URL(spec,appUrl).pathname,lessonUrl.pathname);return currentLesson;
 });await entry.evaluate();
 assert.equal(cachedTextbookReads,0);assert.equal(cachedClassroomReads,0);
 for(const unit of revisedTextbookUnits){
  const raw=await import(new URL(`../data/book/${unit}.book.js`,import.meta.url).href),saved=JSON.stringify(raw);
  const expectedBook=await textbook.revisedTextbook(unit,raw),expectedClass=await revisedClassroom(unit,raw),actual=await entry.namespace.revisedClassroom(unit,raw);
  assert.equal(JSON.stringify(actual.workbook),JSON.stringify(expectedBook.workbook),unit+' current workbook');
  assert.equal(JSON.stringify(actual.chapter.pages),JSON.stringify(expectedBook.chapter.pages),unit+' student directions');
  assert.equal(JSON.stringify(actual.classroomItems),JSON.stringify(expectedClass.classroomItems),unit+' classroom questions');
  assert.equal(JSON.stringify(actual.plan),JSON.stringify(expectedClass.plan),unit+' lesson plan');
  assert.equal(actual.classroomLab?.mount,expectedClass.classroomLab?.mount,unit+' activity adapter');
  assert.equal(JSON.stringify(raw),saved,unit+' original book');
  const calls=currentTextbookCalls;
  const alreadyPrepared=await entry.namespace.revisedClassroom(unit,expectedBook);
  assert.equal(currentTextbookCalls,calls,unit+' prepared workbook is reused');
  assert.equal(JSON.stringify(alreadyPrepared.workbook),JSON.stringify(expectedBook.workbook));
 }
 assert.equal(currentTextbookCalls,32);
 const unsupported={chapter:{unit:'not-current'},plan:{note:'custom'}};
 assert.equal(await entry.namespace.revisedClassroom('not-current',unsupported),unsupported);
});
