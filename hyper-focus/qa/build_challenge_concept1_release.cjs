'use strict';
// Creates a private, uploadable Concept Book 1 package from an already validated full package.
// It does not change the full-package latest pointer, publish a catalog, grant access, or upload.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const ROOT=path.resolve(__dirname,'../output/private-challenge'),PRODUCT='challenge-concept-1';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
function fail(code){throw Error(code);}
function readJSON(file){return JSON.parse(fs.readFileSync(file,'utf8'));}
function main(){
 const args=process.argv.slice(2);if(args.length)fail('usage_no_arguments');
 const latest=readJSON(path.join(ROOT,'latest.json'));if(!/^challenge-[0-9]{17}$/.test(latest.contentVersion)||typeof latest.out!=='string')fail('invalid_latest');
 const source=path.resolve(latest.out),sourcePrivate=path.join(source,'private'),sourceManifest=readJSON(path.join(sourcePrivate,'manifest.json'));
 if(sourceManifest.contentVersion!==latest.contentVersion||!sourceManifest.documents?.[PRODUCT])fail('concept1_not_in_source_package');
 const contentVersion='challenge-'+new Date().toISOString().replace(/[^0-9]/g,''),out=path.join(ROOT,contentVersion),privateOut=path.join(out,'private');
 if(fs.existsSync(out))fail('destination_exists');
 const manifest={schemaVersion:1,contentVersion,documents:{[PRODUCT]:{}},bank:{},sources:{}};
 for(const part of ['questions','answers']){
  const ref=sourceManifest.documents[PRODUCT][part];if(!ref||ref.path!==`v1/documents/${PRODUCT}.${part}.json`||!/^[a-f0-9]{64}$/.test(ref.sha256))fail('invalid_source_reference');
  const sourceFile=path.join(sourcePrivate,ref.path),bytes=fs.readFileSync(sourceFile);if(sha(bytes)!==ref.sha256)fail('source_hash_mismatch');
  const document=JSON.parse(bytes.toString('utf8'));if(document.schemaVersion!==1||document.contentVersion!==sourceManifest.contentVersion||document.productKey!==PRODUCT||document.part!==part||!document.document?.html)fail('invalid_source_document');
  document.contentVersion=contentVersion;const next=Buffer.from(JSON.stringify(document));const target=path.join(privateOut,ref.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,next,{flag:'wx'});manifest.documents[PRODUCT][part]={path:ref.path,sha256:sha(next)};
 }
 const manifestBytes=Buffer.from(JSON.stringify(manifest));fs.writeFileSync(path.join(privateOut,'manifest.json'),manifestBytes,{flag:'wx'});
 const report={contentVersion,out,sourcePackage:source,productKey:PRODUCT,files:3,manifestSha256:sha(manifestBytes),remoteWrites:0,published:false};fs.writeFileSync(path.join(out,'build-report.json'),JSON.stringify(report,null,2),{flag:'wx'});
 console.log(JSON.stringify(report));
}
try{main();}catch(error){console.error(error?.message||'concept1_release_build_failed');process.exitCode=1;}
