import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=path.resolve(fileURLToPath(new URL('../../',import.meta.url)));
const generators=[['c22-s32-u04','gen-science-workbook-c22s32u04.mjs',48],['c22-s42-u04','gen-science-workbook-c22s42u04.mjs',46]];
const library=pathToFileURL(path.join(root,'scripts/gen-science-workbook-lib.mjs'));
const models=new Set(['glitter-model.js','sealevel-model.js'].map(file=>pathToFileURL(path.join(root,'science-lab/scenes',file)).href));

async function fixture({file=null,args=[],initial=new Map(),race=null}={}){
 const files=new Map(initial),attempts=[],writes=[],logs=[],cache=new Map();
 const process={argv:['node',file||library.pathname,...args],exitCode:0};
 const context=vm.createContext({URL,process,console:{log:(...values)=>logs.push(values)}});
 const virtualFs={...fs,
  existsSync:target=>files.has(String(target))||fs.existsSync(target),
  readFileSync:(target,encoding)=>files.has(String(target))?(encoding?files.get(String(target)):Buffer.from(files.get(String(target)))):fs.readFileSync(target,encoding),
  writeFileSync:(target,source,options)=>{
   target=String(target);attempts.push({target,options});
   if(race?.target===target&&!files.has(target))files.set(target,race.source);
   if(options?.flag==='wx'&&(files.has(target)||fs.existsSync(target))){const error=Error('EEXIST: '+target);error.code='EEXIST';throw error;}
   files.set(target,String(source));writes.push({target,source:String(source)});
  },
 };
 for(const name of ['writeFile','appendFile','appendFileSync','mkdir','mkdirSync','rename','renameSync','rm','rmSync','unlink','unlinkSync','open','openSync','truncate','truncateSync','copyFile','copyFileSync','createWriteStream'])virtualFs[name]=()=>{throw Error('unexpected filesystem mutation: '+name);};
 async function synthetic(key,exports){
  if(cache.has(key))return cache.get(key);
  const module=new vm.SyntheticModule(Object.keys(exports),function(){for(const [name,value]of Object.entries(exports))this.setExport(name,value);},{context});cache.set(key,module);await module.link(()=>{});await module.evaluate();return module;
 }
 async function load(url){
  if(cache.has(url.href))return cache.get(url.href);
  const module=new vm.SourceTextModule(fs.readFileSync(url,'utf8'),{context,identifier:url.href,initializeImportMeta:meta=>{meta.url=url.href;}});cache.set(url.href,module);
  await module.link(async(spec,from)=>{
   if(spec==='node:fs')return synthetic(spec,{default:virtualFs});
   if(spec==='node:path')return synthetic(spec,{default:path});
   const target=new URL(spec,from.identifier);
   if(target.href===library.href)return load(target);
   if(models.has(target.href))return synthetic(target.href,{...await import(target.href)});
   throw Error('unexpected generator import: '+spec);
  });return module;
 }
 let error=null,module;
 try{module=await load(file?pathToFileURL(path.join(root,'scripts',file)):library);await module.evaluate();}catch(caught){error=caught;}
 return {files,attempts,writes,logs,error,process,api:cache.get(library.href)?.namespace};
}

test('both actual legacy generators refuse to replace the current reviewed workbook and compare without writing',async()=>{
 for(const [unit,file,count]of generators){
  const target=path.join(root,'science-lab/data/book/'+unit+'.workbook.js'),before=fs.readFileSync(target,'utf8');
  const blocked=await fixture({file});assert.match(String(blocked.error),/기존 교재와 생성 후보가 달라/);assert.equal(blocked.attempts.length,0);
  const checked=await fixture({file,args:['--check']});assert.equal(checked.error,null);assert.equal(checked.process.exitCode,1);assert.equal(checked.attempts.length,0);assert.equal(checked.logs[0][8],count);assert.equal(checked.logs.at(-1)[1],'different');
  const sameTarget=await fixture({file,args:['--output',target]});assert.match(String(sameTarget.error),/덮어쓰지 않았습니다/);assert.equal(sameTarget.attempts.length,0);
  assert.equal(fs.readFileSync(target,'utf8'),before);
 }
});

test('explicit candidate output is separate, importable, repeatable and never replaces an existing different file',async()=>{
 for(const [unit,file,count]of generators){
  const target=path.join(root,'output','generator-test-'+unit+'.mjs');
  const candidate=await fixture({file,args:['--output',target]});assert.equal(candidate.error,null);assert.equal(candidate.writes.length,1);assert.equal(candidate.writes[0].target,target);
  const source=candidate.files.get(target),marker='export const workbook = ',book=JSON.parse(source.slice(source.indexOf(marker)+marker.length).trim().replace(/;$/,''));
  assert.equal(book.unit,unit);assert.equal(book.questions.length,count);assert(!source.includes('AI 실사형 설명 이미지'));
  const repeat=await fixture({file,args:['--output',target],initial:candidate.files});assert.equal(repeat.error,null);assert.equal(repeat.attempts.length,0);assert.equal(repeat.logs.at(-1)[1],'unchanged');
  const initial=new Map([[target,'another reviewed candidate']]),different=await fixture({file,args:['--output',target],initial});assert.match(String(different.error),/덮어쓰지 않았습니다/);assert.equal(different.files.get(target),initial.get(target));assert.equal(different.attempts.length,0);
 }
});

test('the writer keeps identical, different, missing and concurrently created files intact in check mode and rejects unsupported options',async()=>{
 const target=path.join(root,'output','writer-test.mjs');
 const existing=await fixture({initial:new Map([[target,'reviewed source']])});
 assert.equal(existing.api.saveWorkbookSource(target,'reviewed source').status,'unchanged');assert.equal(existing.attempts.length,0);
 assert.equal(existing.api.saveWorkbookSource(target,'new source',{check:true}).status,'different');assert.equal(existing.files.get(target),'reviewed source');assert.equal(existing.attempts.length,0);
 const missing=await fixture();assert.equal(missing.api.saveWorkbookSource(target,'new source',{check:true}).status,'missing');assert.equal(missing.attempts.length,0);
 const racing=await fixture({race:{target,source:'created by another writer'}});
 assert.throws(()=>racing.api.saveWorkbookSource(target,'new source'),error=>error.code==='EEXIST');assert.equal(racing.files.get(target),'created by another writer');assert.equal(racing.writes.length,0);
 for(const args of [['--force'],['--output'],['--output','--check'],['--output',target,'--output',target]])assert.throws(()=>existing.api.generationOptions(args));
 assert.equal(existing.files.get(target),'reviewed source');
});
