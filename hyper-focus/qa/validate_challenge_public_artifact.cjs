// Validate the actual staged public artifact, never the teacher workspace as a public root.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),latest=JSON.parse(fs.readFileSync(path.join(root,'output/private-challenge/latest.json'))),folder=path.join(latest.out,'public'),report=JSON.parse(fs.readFileSync(path.join(latest.out,'build-report.json'))),checks=[];
const check=(name,ok)=>{assert(ok,name);checks.push(name);};
const server=http.createServer((req,res)=>{const file=path.resolve(folder,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!file.startsWith(folder+path.sep)){res.writeHead(404);return res.end();}fs.readFile(file,(e,b)=>{res.writeHead(e?404:200);res.end(e?'':b);});});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;try{
 for(const file of report.publicFiles)check('public file '+file,(await fetch(origin+'/hyper-focus/challenge/'+file)).status===200);
 const denied=['challenge-bank.js','exam-editions.js','exam-replacements.js','exam-more.js','exam-priority.js','exam-supplement.js','concept-specials.js','concept-catalog.js','variant-provider.js','variant-numeric-extension.js','variant-geometry-extension.js','variant-replacement-measurement.js','variant-replacement-spatial.js','variant-replacement-paths.js','variant-core-levels.js','exam.js','concepts-two.js','output/pdf/challenge-mock-review-round1.pdf','../output/private-challenge/latest.json','../supabase/functions/challenge-content/index.ts','private/manifest.json','v1/sources/1-main-1.questions.json'];
 for(const file of denied)check('direct URL denied '+file,(await fetch(origin+'/hyper-focus/challenge/'+file)).status===404);
 const catalog=fs.readFileSync(path.join(folder,'hyper-focus/challenge/public-catalog.js'),'utf8');
 check('catalog contains metadata only',!/["'](?:prompt|problemHtml|answerHtml|solution|payload|answer)["']\s*:/.test(catalog));
 const scriptFiles=report.publicFiles.filter(x=>x.endsWith('.js'));for(const file of scriptFiles){const text=fs.readFileSync(path.join(folder,'hyper-focus/challenge',file),'utf8');check('no private key '+file,!/SUPABASE_SERVICE_ROLE_KEY|sb_secret_|eyJ[A-Za-z0-9_-]{20,}\./.test(text));}
 check('no hidden files or unlisted assets',walk(folder).every(p=>report.publicFiles.includes(path.relative(path.join(folder,'hyper-focus/challenge'),p).replaceAll('\\','/'))));
 console.log(JSON.stringify({passed:checks.length,contentVersion:report.contentVersion,checks,limitation:'Only staged public artifact. Existing live URLs and hosting rules still require separate authorized deployment verification.'},null,2));
 const out=path.join(root,'output/qa/challenge-public-artifact');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({passed:checks.length,checks,artifact:latest.out,remoteWrites:0},null,2));
 }finally{await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
