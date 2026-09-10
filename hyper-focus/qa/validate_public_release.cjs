#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const builder=require('./stage_public_release.cjs');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const DENIED=Object.freeze([
 'challenge/challenge-bank.js','challenge/exam.js','challenge/exam-editions.js','challenge/exam-replacements.js',
 'challenge/exam-more.js','challenge/exam-priority.js','challenge/exam-supplement.js','challenge/concept-specials.js',
 'challenge/concept-catalog.js','challenge/concepts-two.js','challenge/variant-provider.js','challenge/variant-core-levels.js',
 'challenge/variant-numeric-extension.js','challenge/variant-geometry-extension.js','challenge/balance-diagram.js',
 'challenge/assets/exam-objects-illustration.png','challenge/assets/reference.png','challenge/output/pdf/challenge-mock-review-round1.pdf',
 'challenge/private/manifest.json','challenge/v1/sources/1-main-1.questions.json','challenge/README.md',
 'output/private-challenge/latest.json','output/private-practice/latest.json','qa/stage_public_release.cjs',
 'tests/secure-mock-ui.test.cjs','supabase/functions/challenge-content/index.ts','docs/HF_PRIVATE_DELIVERY.md','.source-memory/source-memory.json',
 'generator/variant-provider.js','challenge-clone/challenge-bank.js','assets/problems/q55.png'
]);
function walk(folder,relative=''){
 return fs.readdirSync(path.join(folder,relative),{withFileTypes:true}).flatMap(entry=>{
  const name=relative?relative+'/'+entry.name:entry.name,target=path.join(folder,...name.split('/'));
  assert(!fs.lstatSync(target).isSymbolicLink(),'staged symlink/junction: '+name);
  return entry.isDirectory()?walk(folder,name):[name];
 });
}
async function validate({source,dest}){
 const plan=builder.plan(source),expected=new Map(plan.files.map(entry=>[entry.file,entry])),actual=walk(dest),checks=[];
 const check=(label,condition)=>{assert(condition,label);checks.push(label);};
 check('only exact planned public files',actual.length===expected.size&&actual.every(file=>expected.has(file)));
 check('exact Challenge public allowlist',actual.filter(file=>file.startsWith('challenge/')).length===builder.CHALLENGE_PUBLIC.length);
 for(const file of actual){check('safe path '+file,builder.validRelative(file));check('byte identity '+file,hash(fs.readFileSync(path.join(dest,...file.split('/'))))===expected.get(file).sha256);}
 for(const file of [...builder.LEGACY_RUNTIME,...builder.APPROVED_ADDITIONS])check('required runtime '+file,actual.includes(file));
 for(const file of DENIED)check('excluded '+file,!actual.includes(file));
 const allowed=new Set(actual);
 for(const file of actual.filter(file=>file.endsWith('.html'))){
  const html=fs.readFileSync(path.join(dest,...file.split('/')),'utf8');
  for(const match of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/gi)){
   const resolved=new URL(match[1],'https://staging.invalid/hyper-focus/'+file);
   if(resolved.origin!=='https://staging.invalid'||!resolved.pathname.startsWith('/hyper-focus/'))continue;
   const dependency=decodeURIComponent(resolved.pathname.slice('/hyper-focus/'.length));
   check('HTML runtime dependency '+file+' -> '+dependency,allowed.has(dependency));
  }
 }
 for(const file of actual.filter(file=>file.startsWith('data/variations/')&&file.endsWith('.json'))){
  const data=JSON.parse(fs.readFileSync(path.join(dest,...file.split('/')),'utf8'));
  if(data.status!=='rejected'&&data.presentation?.mode!=='text-only'&&data.source?.problemImage?.startsWith('./assets/'))check('legacy variation image '+file,allowed.has(data.source.problemImage.slice(2)));
 }
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://local');let rel;
  try{rel=decodeURIComponent(url.pathname);}catch(_){res.writeHead(404);return res.end();}
  if(!rel.startsWith('/hyper-focus/')){res.writeHead(404);return res.end();}
  rel=rel.slice('/hyper-focus/'.length);if(!rel||rel.endsWith('/'))rel+='index.html';
  if(!allowed.has(rel)){res.writeHead(404);return res.end();}
  res.writeHead(200);res.end(fs.readFileSync(path.join(dest,...rel.split('/'))));
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin='http://127.0.0.1:'+server.address().port;
 try{
  for(const file of ['index.html','diagnosis.html','review.html','mock/index.html','mock/viewer.html','vip/index.html','admin.html','type-admin.html',...builder.CHALLENGE_PUBLIC.map(file=>'challenge/'+file)])check('HTTP public '+file,(await fetch(origin+'/hyper-focus/'+file)).status===200);
  for(const file of DENIED)check('HTTP denied '+file,(await fetch(origin+'/hyper-focus/'+file)).status===404);
  for(const file of ['challenge/%2e%2e/output/private-challenge/latest.json','challenge/%2e%2e%2fsupabase/config.toml','%2e%2e/config.js'])check('HTTP traversal denied '+file,(await fetch(origin+'/hyper-focus/'+file)).status===404);
 }finally{await new Promise(resolve=>server.close(resolve));}
 return {passed:true,checks:checks.length,fileCount:actual.length,challengeFileCount:builder.CHALLENGE_PUBLIC.length,legacyPublicBoundary:'Existing HF diagnosis, generators, data and required original images remain public intentionally; legacy full privacy is not claimed.',securePracticeDelivery:false,remoteWrites:0};
}
function writeFixture(root){
 const source=path.join(root,'hyper-focus');fs.mkdirSync(source,{recursive:true});
 const tracked=[...builder.LEGACY_RUNTIME,...DENIED,'assets/problems/q01.png','assets/book/1_1.png','data/canonical/q01.json','.gitkeep','docs/private.md'];
 const all=[...new Set([...tracked,...builder.APPROVED_ADDITIONS,'unapproved.js','mock/unapproved.js'])];
 for(const file of all){const target=path.join(source,...file.split('/'));fs.mkdirSync(path.dirname(target),{recursive:true});const body=file==='supabase-config.js'?'window.GFIELD_HF_SUPABASE_CONFIG={features:{securePracticeDelivery:false}};':file==='challenge/public-catalog.js'?'window.HFChallengePublicCatalog={variants:[]};':file.endsWith('.json')?'{}':file.endsWith('.html')?'<!doctype html><title>fixture</title>':'local fixture';fs.writeFileSync(target,body);}
 execFileSync('git',['init','--quiet',root],{stdio:'ignore'});
 execFileSync('git',['-C',root,'add','--',...tracked.map(file=>'hyper-focus/'+file)],{stdio:'ignore'});
 return source;
}
async function selfTest(source){
 const output=path.join(source,'output','qa','public-release');fs.mkdirSync(output,{recursive:true});const folder=fs.mkdtempSync(path.join(output,'run-')),dest=path.join(folder,'public','hyper-focus');
 const staged=builder.stage({source,dest}),real=await validate({source,dest});let negativeChecks=0;
 function rejects(fn,label){assert.throws(fn,undefined,label);negativeChecks++;}
 rejects(()=>builder.stage({source,dest}),'nonempty destination is never overwritten');
 rejects(()=>builder.stage({source,dest:source}),'source is never a destination');
 rejects(()=>builder.stage({source,dest:path.dirname(source)}),'source ancestor rejected');
 rejects(()=>builder.stage({source,dest:path.join(source,'challenge','hyper-focus')}),'non-QA nested source destination rejected');
 rejects(()=>builder.args(['--source',source,'--delete','yes']),'unknown destructive argument rejected');
 const fixtureRoot=path.join(folder,'fixture'),fixture=writeFixture(fixtureRoot),fixtureDest=path.join(folder,'fixture-public','hyper-focus'),fixtureStage=builder.stage({source:fixture,dest:fixtureDest});
 for(const file of DENIED){assert(!fixtureStage.files.some(entry=>entry.file===file),'tracked private file leaked: '+file);negativeChecks++;}
 assert(!fixtureStage.files.some(entry=>entry.file==='unapproved.js'||entry.file==='mock/unapproved.js'));negativeChecks++;
 assert(fixtureStage.files.some(entry=>entry.file==='type-access.js'&&entry.basis==='explicit-approved-addition'));negativeChecks++;
 const sentinel=path.join(fixtureDest,'sentinel.txt');fs.writeFileSync(sentinel,'keep me');rejects(()=>builder.stage({source:fixture,dest:fixtureDest}),'existing destination preserved');assert.equal(fs.readFileSync(sentinel,'utf8'),'keep me');negativeChecks++;
 const before=hash(fs.readFileSync(path.join(fixture,'supabase-config.js')));rejects(()=>builder.stage({source:fixture,dest:path.join(fixture,'private','hyper-focus')}),'private source subtree cannot be staging');assert.equal(hash(fs.readFileSync(path.join(fixture,'supabase-config.js'))),before);negativeChecks++;
 const missingSource=path.join(folder,'missing-source','hyper-focus');rejects(()=>builder.stage({source:missingSource,dest:path.join(folder,'missing-dest','hyper-focus')}),'missing source fail closed');assert(!fs.existsSync(path.join(folder,'missing-dest')));negativeChecks++;
 const secret=path.join(fixture,'type-admin.js');fs.writeFileSync(secret,'const leaked="sb_secret_fixture";');rejects(()=>builder.stage({source:fixture,dest:path.join(folder,'secret-dest','hyper-focus')}),'secret fails before creating destination');assert(!fs.existsSync(path.join(folder,'secret-dest')));negativeChecks++;fs.writeFileSync(secret,'local fixture');
 const assetFolder=path.join(fixture,'challenge','assets'),outside=path.join(folder,'outside');fs.mkdirSync(outside);fs.writeFileSync(path.join(outside,'gfield-logo.png'),'private outside asset');fs.renameSync(assetFolder,assetFolder+'.preserved');fs.symlinkSync(outside,assetFolder,process.platform==='win32'?'junction':'dir');rejects(()=>builder.stage({source:fixture,dest:path.join(folder,'symlink-dest','hyper-focus')}),'source symlink/junction rejected');assert(!fs.existsSync(path.join(folder,'symlink-dest')));negativeChecks++;
 const report={...real,negativeChecks,artifact:dest,approvedUntrackedAdditions:staged.files.filter(file=>file.basis==='explicit-approved-addition').map(file=>file.file),fixtureScope:'All fixtures and outputs remain in a fresh excluded output/qa directory; no files deleted.'};
 fs.writeFileSync(path.join(folder,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));return report;
}
module.exports={validate,selfTest,DENIED};
if(require.main===module){const options=builder.args(process.argv.slice(2));(options.dest?validate({source:options.source,dest:path.resolve(options.dest)}).then(report=>console.log(JSON.stringify(report))):selfTest(path.resolve(options.source||path.join(__dirname,'..')))).catch(error=>{console.error(error);process.exitCode=1;});}
