#!/usr/bin/env node
'use strict';
// Hyper Focus only. CI does not read ignored output/private-* packages.
// Legacy diagnosis assets/generators remain public for compatibility: this is NOT full HF privatization.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const CHALLENGE_PUBLIC=Object.freeze([
 'public-catalog.js','index.html','landing.css','landing.js','intro.html','intro.css','access-catalog.js','access-service.js',
 'admin.html','admin.css','admin.js','exam.html','mock-video.js','concepts.html','review.css','exam.css','exam-print-revision.css',
 'concepts-two.css','concept-video.js','studio.html','studio.css','studio.js','challenge-taxonomy.js','diagnosis-core.js',
 'content-client.js','secure-document.js','remote-variants.js','studio-loader.js','document-access.js','assets/gfield-logo.png'
]);
// Reviewed runtime entry points; new tracked files are never automatically published.
const LEGACY_RUNTIME=Object.freeze([
 'index.html','diagnosis.html','review.html','admin.html','admin-app.js','admin-mfa.html','data.js',
 'portal-auth.js','portal-collection.js','portal-data.js','portal.css','portal.js','secure-mock.js','supabase-client.js','supabase-config.js',
 'generator/q01.js','generator/stacking.js','generator/spatial.js','generator/reasoning.js',
 'generator/advanced.js','generator/logic.js','generator/combinatorics.js','generator/applications.js',
 'mock/index.html','mock/viewer.html','mock/access-policy.js','mock/exam-blueprints.js','mock/premier-release-catalog.js',
 'mock/variation-bank.js','mock/mock-core.js','mock/secure-flow.js',
 'vip/index.html','vip/styles.css','vip/app.js','vip/data.js','vip/admin.html','vip/admin.css','vip/admin.js','assets/kr_font.js'
]);
// Explicit current additions approved for this HF release; must be committed by the release owner for CI.
const APPROVED_ADDITIONS=Object.freeze([
 'program-selector.css','type-access-catalog.js','type-access.js','type-admin.html','type-admin.css','type-admin.js',
 'mock/practice-content-client.js','mock/practice-public-catalog.js','mock/secure-practice-loader.js',
 ...CHALLENGE_PUBLIC.map(file=>'challenge/'+file)
]);
const runtime=new Set(LEGACY_RUNTIME),additions=new Set(APPROVED_ADDITIONS),challenge=new Set(CHALLENGE_PUBLIC);
const deniedSegment=/^(?:output|qa|tests?|supabase|docs?|private(?:[-_].*)?|sources?|reference(?:s)?|originals?|node_modules|tmp|temp)$/i;
const qNumber=String.raw`(?:0[1-9]|[1-4][0-9]|5[0-4])`;
const legacyAssetPatterns=[
 new RegExp('^assets/problems/q'+qNumber+'\\.png$'),
 /^assets\/book\/1_(?:[1-9]|1[0-9]|2[0-9])\.png$/,
 new RegExp('^assets/svg/variations/q'+qNumber+'_var0[12]\\.svg$'),
 new RegExp('^data/canonical/q'+qNumber+'\\.json$'),
 /^data\/canonical\/index\.json$/,
 new RegExp('^data/variations/q'+qNumber+'_var0[12]\\.json$')
];
const slash=s=>s.split(path.sep).join('/');
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function validRelative(file){
 return typeof file==='string'&&file!==''&&!file.includes('\\')&&!file.includes('\0')&&!path.posix.isAbsolute(file)&&path.posix.normalize(file)===file&&!file.split('/').some(part=>!part||part==='..'||part.startsWith('.')||deniedSegment.test(part))&&!/\.(?:md|pdf|map|zip|docx?|pptx?|xlsx?|ps1|py|ts|cjs|toml|sql|lock)$/i.test(file);
}
function isAllowed(file,tracked){
 if(!validRelative(file))return false;
 if(file.startsWith('challenge/'))return challenge.has(file.slice('challenge/'.length));
 if(additions.has(file))return true;
 return tracked.has(file)&&(runtime.has(file)||legacyAssetPatterns.some(pattern=>pattern.test(file)));
}
function assertPlainPath(target,stop){
 let current=path.resolve(target),boundary=stop?path.resolve(stop):path.parse(current).root;
 while(true){
  if(fs.existsSync(current)&&fs.lstatSync(current).isSymbolicLink())throw Error('Symbolic links/junctions are not permitted: '+current);
  if(current===boundary)break;
  const parent=path.dirname(current);if(parent===current)break;current=parent;
 }
}
function trackedFiles(source){
 const parent=path.dirname(source),prefix=slash(path.relative(parent,source))+'/';
 const result=execFileSync('git',['-c','safe.directory='+parent,'-C',parent,'ls-files','-z','--',path.basename(source)],{encoding:'utf8',maxBuffer:16*1024*1024,stdio:['ignore','pipe','pipe']});
 return new Set(result.split('\0').filter(file=>file.startsWith(prefix)).map(file=>file.slice(prefix.length)));
}
function plan(sourceInput){
 const source=path.resolve(sourceInput);if(path.basename(source)!=='hyper-focus'||!fs.existsSync(source)||!fs.statSync(source).isDirectory())throw Error('--source must name the existing hyper-focus directory.');
 assertPlainPath(source);
 const tracked=trackedFiles(source),all=[...new Set([...tracked,...APPROVED_ADDITIONS])].filter(file=>isAllowed(file,tracked)).sort();
 for(const file of LEGACY_RUNTIME)if(!tracked.has(file))throw Error('Required legacy runtime is not tracked: '+file);
 for(const file of [...LEGACY_RUNTIME,...APPROVED_ADDITIONS])if(!all.includes(file))throw Error('Required public runtime excluded: '+file);
 const files=all.map(file=>{
  const absolute=path.join(source,...file.split('/'));assertPlainPath(absolute,source);
  if(!fs.existsSync(absolute)||!fs.lstatSync(absolute).isFile())throw Error('Public runtime file is missing/not regular: '+file);
  const bytes=fs.readFileSync(absolute);
  if(/\.(js|html|css|json)$/.test(file)&&/sb_secret_[a-zA-Z0-9]|SUPABASE_SERVICE_ROLE_KEY/.test(bytes.toString('utf8')))throw Error('Secret material in public runtime: '+file);
  if(file==='challenge/public-catalog.js'&&/["'](?:prompt|problemHtml|answerHtml|solution|payload|answer)["']\s*:/.test(bytes.toString('utf8')))throw Error('Challenge catalog must contain metadata only.');
  if(file==='supabase-config.js'&&!/\bsecurePracticeDelivery\s*:\s*false\b/.test(bytes.toString('utf8')))throw Error('securePracticeDelivery must remain false for this release.');
  return {file,absolute,size:bytes.length,sha256:digest(bytes),basis:tracked.has(file)?'tracked':'explicit-approved-addition'};
 });
 return {source,files,tracked};
}
function checkDestination(source,destInput){
 const dest=path.resolve(destInput),root=path.parse(dest).root;
 if(path.basename(dest)!=='hyper-focus'||dest===root||dest===source||source.startsWith(dest+path.sep))throw Error('--dest must be a distinct fresh hyper-focus directory, not a source or ancestor.');
 // Test artifacts may be created only in the excluded QA output subtree.
 if(dest.startsWith(source+path.sep)&&!dest.startsWith(path.join(source,'output','qa')+path.sep))throw Error('A destination inside source is allowed only below output/qa.');
 assertPlainPath(dest);
 if(fs.existsSync(dest)&&(!fs.statSync(dest).isDirectory()||fs.readdirSync(dest).length!==0))throw Error('Destination must be new or empty. Nothing was deleted.');
 return dest;
}
function stage({source:sourceInput,dest:destInput}){
 if(!sourceInput||!destInput)throw Error('Usage: node stage_public_release.cjs --source hyper-focus --dest /freshdir/hyper-focus');
 const {source,files,tracked}=plan(sourceInput),dest=checkDestination(source,destInput);
 // All content/scope checks finish before creating destination. Never delete/reuse an existing staging tree.
 fs.mkdirSync(dest,{recursive:true});assertPlainPath(dest);
 for(const entry of files){
  const target=path.join(dest,...entry.file.split('/'));fs.mkdirSync(path.dirname(target),{recursive:true});assertPlainPath(target,dest);
  fs.copyFileSync(entry.absolute,target,fs.constants.COPYFILE_EXCL);
  if(digest(fs.readFileSync(target))!==entry.sha256)throw Error('Source changed during staging; do not publish partial destination: '+entry.file);
 }
 return {passed:true,dest,files:files.map(({absolute,...rest})=>rest),count:files.length,challengeFiles:files.filter(x=>x.file.startsWith('challenge/')).length,excludedTracked:[...tracked].filter(file=>!files.some(item=>item.file===file)).sort(),legacyPublicBoundary:'Existing HF diagnosis, generator, canonical/variation data and required original book/problem images are intentionally preserved. This is not full legacy HF privatization.',securePracticeDelivery:false,remoteWrites:0};
}
function args(argv){const options={};for(let i=0;i<argv.length;i+=2){if(!['--source','--dest'].includes(argv[i])||!argv[i+1]||options[argv[i].slice(2)])throw Error('Only --source and --dest are accepted, once each.');options[argv[i].slice(2)]=argv[i+1];}return options;}
module.exports={CHALLENGE_PUBLIC,LEGACY_RUNTIME,APPROVED_ADDITIONS,isAllowed,validRelative,trackedFiles,plan,stage,args};
if(require.main===module){try{console.log(JSON.stringify(stage(args(process.argv.slice(2))),null,2));}catch(error){console.error(error.message);process.exitCode=1;}}
