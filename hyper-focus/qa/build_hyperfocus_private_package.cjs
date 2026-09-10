// Local teacher build only. Does not approve, upload or publish any content.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({console});
for(const name of ['generator/q01.js','generator/stacking.js','generator/spatial.js','generator/reasoning.js','generator/advanced.js','generator/logic.js','generator/combinatorics.js','generator/applications.js','mock/mock-core.js'])vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const contentVersion='hf-practice-'+new Date().toISOString().replace(/\D/g,''),out=path.join(root,'output/private-practice',contentVersion),privateOut=path.join(out,'private');
const manifest={schemaVersion:1,contentVersion,bank:{}},catalog={schemaVersion:1,contentVersion,types:[]};
const report={contentVersion,out,releaseStatus:'held',reason:'Existing generator checks do not constitute new private-release approval.',remoteWrites:0,sourceMutations:0,types:[],sourceHashes:{},uniqueQuestions:0,files:0};
for(const name of ['q01','stacking','spatial','reasoning','advanced','logic','combinatorics','applications'])report.sourceHashes['generator/'+name+'.js']=hash(fs.readFileSync(path.join(root,'generator',name+'.js')));
report.sourceHashes['mock/mock-core.js']=hash(fs.readFileSync(path.join(root,'mock/mock-core.js')));
function save(relative,obj){const bytes=Buffer.from(JSON.stringify(obj));if(bytes.length>5_800_000)throw Error('Shard too large');const dest=path.join(privateOut,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);report.files++;return{path:relative,sha256:hash(bytes)};}
for(let typeId=1;typeId<=54;typeId++){
 const code='q'+String(typeId).padStart(2,'0'),meta=context.HFMock.getTypeMeta(typeId),row={typeId,title:meta.title,pools:{}},evidence={typeId,levels:{}};
 manifest.bank[code]={};
 for(const difficulty of ['easy','same','hard']){
  const items=[],seen=new Set();let attempted=0;
  for(let seed=1;seed<=240&&items.length<24;seed++){
   attempted++;const q=context.HFMock.generateQuestion(typeId,difficulty,seed,1),fingerprint=hash(JSON.stringify([q.prompt,q.problemHtml]));
   if(seen.has(fingerprint))continue;seen.add(fingerprint);
   if(!q.prompt||!q.problemHtml||!q.answerText)throw Error('Incomplete question '+code);
   if(/<(?:script|iframe|object|embed)\b|\bon\w+\s*=|(?:src|href)\s*=\s*["'](?:https?:|javascript:)/i.test(q.problemHtml))throw Error('Unsafe diagram '+code);
   items.push({q,id:code+'-'+difficulty+'-'+fingerprint.slice(0,20),seed,fingerprint});
  }
  if(items.length<2)throw Error('Free pair unavailable '+code+' '+difficulty);
  report.uniqueQuestions+=items.length;manifest.bank[code][difficulty]={};row.pools[difficulty]={};
  evidence.levels[difficulty]={attempted,count:items.length,seeds:items.map(x=>x.seed),fingerprints:items.map(x=>x.fingerprint)};
  const secondFree=items.find(x=>JSON.stringify(x.q.answer)!==JSON.stringify(items[0].q.answer));
  if(!secondFree)throw Error('Distinct free answers unavailable '+code+' '+difficulty);
  for(const accessTier of ['free','paid']){
   const chosen=accessTier==='free'?[items[0],secondFree]:items,pool={releaseStatus:'held',totalCount:chosen.length,shards:[]};
   manifest.bank[code][difficulty][accessTier]=pool;row.pools[difficulty][accessTier]={count:chosen.length,releaseStatus:'held'};
   for(let from=0;from<chosen.length;from+=8){
    const shardIndex=pool.shards.length,chunk=chosen.slice(from,from+8),shard={count:chunk.length};
    for(const part of ['questions','answers']){
     // Existing generators provide a single, complete plain-text answer and explanation.
     // Keep it once in solution; do not duplicate it in the answer heading.
     const payload=chunk.map(({q,id})=>part==='questions'?{id,prompt:q.prompt,problemHtml:q.problemHtml}:{id,answerHtml:'',solution:String(q.answerText)});
     shard[part]=save(`v1/bank/${code}/${difficulty}.${accessTier}.${part}.${shardIndex}.json`,{schemaVersion:1,contentVersion,typeId,difficulty,accessTier,part,shardIndex,items:payload});
    }
    pool.shards.push(shard);
   }
  }
 }
 report.types.push(evidence);catalog.types.push(row);
}
fs.mkdirSync(path.join(out,'public'),{recursive:true});
const manifestBytes=Buffer.from(JSON.stringify(manifest));fs.writeFileSync(path.join(privateOut,'manifest.json'),manifestBytes);report.manifestSha256=hash(manifestBytes);
const metadata='window.HFPracticeCatalog='+JSON.stringify(catalog)+';\n';
fs.writeFileSync(path.join(out,'public/practice-public-catalog.js'),metadata);
fs.writeFileSync(path.join(root,'mock/practice-public-catalog.js'),metadata);
fs.writeFileSync(path.join(out,'build-report.json'),JSON.stringify(report,null,2));fs.writeFileSync(path.join(root,'output/private-practice/latest.json'),JSON.stringify({out,contentVersion}));
console.log(JSON.stringify({contentVersion,out,types:54,levels:162,uniqueQuestions:report.uniqueQuestions,files:report.files,releaseStatus:report.releaseStatus,manifestSha256:report.manifestSha256}));
