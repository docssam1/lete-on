// Teacher-side build only. No upload, permission grant, or deployment.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),crypto=require('node:crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),challenge=path.join(root,'challenge');
const variants=require('../challenge/variant-provider.js'),diagnosis=require('../challenge/diagnosis-core.js');
const contentVersion='challenge-'+new Date().toISOString().replace(/[^0-9]/g,''),out=path.join(root,'output/private-challenge',contentVersion),publicOut=path.join(out,'public/hyper-focus/challenge'),privateOut=path.join(out,'private');
const manifest={schemaVersion:1,contentVersion,documents:{},bank:{},sources:{}};
const digest=x=>crypto.createHash('sha256').update(x).digest('hex');
function save(relative,obj){const bytes=Buffer.from(JSON.stringify(obj)),dest=path.join(privateOut,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);return {path:relative,sha256:digest(bytes)};}
function inlineImages(html){const defined=new Map();return String(html||'').replace(/(<(?:img|image)\b[^>]*\b(?:src|href|xlink:href)=["'])([^"']+)(["'])/gi,(whole,prefix,src,suffix)=>{if(src==='assets/gfield-logo.png'||src.startsWith('data:image/'))return whole;const decoded=decodeURIComponent(src.split('?')[0]),file=path.resolve(challenge,decoded);if(!file.startsWith(root+path.sep)||!fs.existsSync(file))throw Error('Private image missing: '+src);const mime={'.png':'png','.jpg':'jpeg','.jpeg':'jpeg','.webp':'webp'}[path.extname(file).toLowerCase()];if(!mime)throw Error('Unexpected private image type');if(/^<image\b/i.test(prefix)){const id='private-raster-'+digest(src).slice(0,12);if(defined.has(src))return prefix.replace(/^<image/i,'<use')+'#'+id+suffix;defined.set(src,id);prefix=prefix.replace(/^<image/i,'<image id="'+id+'"');}return prefix+'data:image/'+mime+';base64,'+fs.readFileSync(file).toString('base64')+suffix;});}
const question=(q,id)=>({id,prompt:q.prompt,problemHtml:inlineImages(q.problemHtml||'')});
function answer(q,id){
 const answerHtml=String(q.answerHtml??(Array.isArray(q.answer)?JSON.stringify(q.answer):q.answer)),solution=String(q.solution||'').trim();
 const normalized=s=>s.replace(/<[^>]*>/g,'').replace(/[\s.。]/g,'').replace(/[−–]/g,'-');
 if(!solution||/풀이 확인 필요|undefined|NaN/.test(solution)||normalized(solution)===normalized(answerHtml))throw Error('Detailed solution missing: '+id);
 return {id,answerHtml,solution,...(q.solutionDiagram?{solutionDiagram:inlineImages(q.solutionDiagram)}:{})};
}
const server=http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://local').pathname),file=path.resolve(root,'.'+pathname);if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(data);});});
(async()=>{
 fs.mkdirSync(publicOut,{recursive:true});fs.mkdirSync(privateOut,{recursive:true});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage();await page.route('**/*',route=>new URL(route.request().url()).origin===origin?route.continue():route.abort());
  for(const kind of ['concept','mock'])for(let round=1;round<=(kind==='concept'?2:4);round++){
   await page.goto(`${origin}/challenge/${kind==='concept'?'concepts':'exam'}.html?round=${round}&teacherPreview=1`);
   await page.waitForFunction(({kind,round})=>kind==='concept'?window.HFConceptBook?.counts?.some(x=>x.round===round):document.querySelectorAll('.exam-page').length===21,{kind,round},{timeout:60000});
   const sections=await page.evaluate(({kind,round})=>[...document.querySelectorAll(kind==='concept'?`.concept-page[data-round="${round}"]`:'.exam-page')].map(original=>{const node=original.cloneNode(true);node.querySelectorAll('.book-watermark').forEach(el=>el.remove());node.querySelectorAll('[data-watermark]').forEach(el=>el.removeAttribute('data-watermark'));node.removeAttribute('data-watermark');node.classList.remove('hidden-round','hidden-unit');return {answer:kind==='concept'?node.classList.contains('answer-pages'):!node.classList.contains('problem-page'),html:node.outerHTML};}),{kind,round});
   const productKey=`challenge-${kind}-${round}`;manifest.documents[productKey]={};
   for(const part of ['questions','answers']){const html=inlineImages(sections.filter(s=>s.answer===(part==='answers')).map(s=>s.html).join(''));manifest.documents[productKey][part]=save(`v1/documents/${productKey}.${part}.json`,{schemaVersion:1,contentVersion,productKey,part,document:{title:`2026년 9월 챌린지 대비 · ${kind==='concept'?'개념':'모의고사'} ${round}`,html,styles:kind==='concept'?['concepts-two.css']:['exam.css','exam-print-revision.css']}});}
   console.log('document',productKey,sections.length);
  }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
 const rows=variants.list(),poolCounts={};
 for(const row of rows){
  const source=variants.getSource(row),sourceId=row.key,id='source-'+sourceId;manifest.sources[sourceId]={typeId:row.typeId};
  for(const part of ['questions','answers']){const member=part==='questions'?'question':'answer';manifest.sources[sourceId][part]=save(`v1/sources/${sourceId}.${part}.json`,{schemaVersion:1,contentVersion,sourceId,typeId:row.typeId,part,[member]:part==='questions'?question(source,id):answer(source,id)});}
  for(const difficulty of ['easy','same','hard']){
   if(!row.eligibility[difficulty])continue;
   const questions=[],answers=[],seen=new Set();
   for(let seed=10;seed<180&&questions.length<24;seed++){const result=variants.generate({...row,difficulty,seed});if(result.status!=='verified')continue;const q=result.question,key=digest(JSON.stringify([q.prompt,q.problemHtml]));if(seen.has(key))continue;seen.add(key);questions.push(question(q,q.id));answers.push(answer(q,q.id));}
   if(!questions.length)throw Error('Eligible type has no generated pool: '+row.key+' '+difficulty);
   manifest.bank[row.typeId]??={};const pool={shards:[],totalCount:questions.length};manifest.bank[row.typeId][difficulty]=pool;poolCounts[row.typeId+':'+difficulty]=questions.length;
   let from=0;while(from<questions.length){let to=from+1;while(to<questions.length&&to-from<8&&Math.max(Buffer.byteLength(JSON.stringify(questions.slice(from,to+1))),Buffer.byteLength(JSON.stringify(answers.slice(from,to+1))))<5800000)to++;const shardIndex=pool.shards.length,shard={count:to-from};for(const part of ['questions','answers'])shard[part]=save(`v1/bank/${row.typeId}/${difficulty}.${part}.${shardIndex}.json`,{schemaVersion:1,contentVersion,typeId:row.typeId,difficulty,part,shardIndex,items:(part==='questions'?questions:answers).slice(from,to)});pool.shards.push(shard);from=to;}
  }
 }
 const publicCatalog={schemaVersion:1,contentVersion,rounds:[1,2,3,4].map(r=>diagnosis.describeRound(r)),variants:rows.map(row=>({...row,poolCounts:Object.fromEntries(['easy','same','hard'].map(d=>[d,poolCounts[row.typeId+':'+d]||0]))}))};
 const metadata='window.HFChallengePublicCatalog='+JSON.stringify(publicCatalog)+';\n';
 fs.writeFileSync(path.join(publicOut,'public-catalog.js'),metadata);fs.writeFileSync(path.join(challenge,'public-catalog.js'),metadata);
 const safeFiles=['index.html','landing.css','landing.js','intro.html','intro.css','access-catalog.js','access-service.js','admin.html','admin.css','admin.js','exam.html','concepts.html','review.css','exam.css','exam-print-revision.css','concepts-two.css','studio.html','studio.css','studio.js','challenge-taxonomy.js','diagnosis-core.js','content-client.js','secure-document.js','remote-variants.js','studio-loader.js','document-access.js','assets/gfield-logo.png'];
 for(const name of safeFiles){const dest=path.join(publicOut,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(challenge,name),dest);}
 const manifestBytes=Buffer.from(JSON.stringify(manifest));fs.writeFileSync(path.join(privateOut,'manifest.json'),manifestBytes);
 const report={contentVersion,out,manifestSha256:digest(manifestBytes),documents:Object.keys(manifest.documents).length,sources:Object.keys(manifest.sources).length,bankTypes:Object.keys(manifest.bank).length,poolCounts,publicFiles:['public-catalog.js',...safeFiles],remoteWrites:0,deployed:false,release:'held pending independent package and actual private delivery verification'};
 fs.writeFileSync(path.join(out,'build-report.json'),JSON.stringify(report,null,2));fs.writeFileSync(path.join(root,'output/private-challenge/latest.json'),JSON.stringify({out,contentVersion}));console.log(JSON.stringify({out,documents:report.documents,sources:report.sources,bankTypes:report.bankTypes,manifestSha256:report.manifestSha256}));
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
