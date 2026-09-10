'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const provider=require('../challenge/variant-provider.js');
const out=path.resolve(__dirname,'../output/qa/challenge-solution-steps');fs.mkdirSync(out,{recursive:true});
const refs=provider.list().filter(r=>['roll','triangle-count'].includes(r.family)||r.typeId==='priority-route-count');
const stable=q=>Object.fromEntries(['id','typeId','number','difficulty','seed','prompt','problemHtml','payload','answer','answerHtml'].map(k=>[k,q[k]]));
const digest=q=>crypto.createHash('sha256').update(JSON.stringify(stable(q))).digest('hex');
const samples=refs.flatMap(ref=>['easy','same','hard'].flatMap(difficulty=>Array.from({length:50},(_,seed)=>{const result=provider.generate({...ref,difficulty,seed});assert.equal(result.status,'verified',result.reason);return {ref,difficulty,seed,q:result.question};})));
const snapshot=Object.fromEntries(samples.map(s=>[[s.ref.key,s.difficulty,s.seed].join('/'),digest(s.q)]));
const baseline=path.join(out,'before.json');
if(process.argv.includes('--baseline')){assert(!fs.existsSync(baseline),'baseline exists; do not overwrite original snapshot');fs.writeFileSync(baseline,JSON.stringify(snapshot,null,2));console.log('baseline '+samples.length);process.exit();}
assert.deepEqual(snapshot,JSON.parse(fs.readFileSync(baseline,'utf8')),'question/answer/payload/difficulty changed');
let checks=samples.length;
for(const {q}of samples){
 const p=q.payload,html=q.solutionDiagram||'';assert(html.includes('<table'),'missing concrete steps table');checks++;
 if(p.kind==='roll'){
  const normals=[[0,0,1],[0,0,-1],[0,-1,0],[0,1,0],[1,0,0],[-1,0,0]],values=[p.top,7-p.top,p.front,7-p.front,p.right,7-p.right];let faces=normals.map((n,i)=>({n,v:values[i]}));
  const trace=[values];for(const m of p.moves){faces=faces.map(({n:[x,y,z],v})=>({n:m==='R'?[z,y,-x]:m==='L'?[-z,y,x]:m==='U'?[x,z,-y]:[x,-z,y],v}));trace.push(normals.map(n=>faces.find(f=>f.n.every((v,i)=>v===n[i])).v));}
  assert.equal(trace.at(-1)[p.query==='bottom'?1:0],q.answer);assert.equal((html.match(/<tr>/g)||[]).length,p.moves.length+2);
  for(const row of trace)for(const n of row)assert(n>=1&&n<=6);checks+=trace.length;
  const parsed=[...html.matchAll(/<tr><th[^>]*>[^<]*<\/th>((?:<td[^>]*>\d<\/td>){6})<\/tr>/g)].map(m=>[...m[1].matchAll(/>(\d)<\/td>/g)].map(v=>+v[1]));
  assert.deepEqual(parsed,trace,'every face at every step differs from independent vector rotations');checks++;
 }else if(p.kind==='variant-triangle-count'){
  let pairs=0;const widths=Array(p.rays).fill(0);for(let a=0;a<p.rays;a++)for(let b=a+1;b<p.rays;b++){pairs++;widths[b-a]++;}
  assert.equal(pairs*p.bases,q.answer);for(let w=1;w<p.rays;w++)assert(html.includes('>'+widths[w]+'개<'));assert(q.solution.includes(widths.slice(1).join('+')));checks+=p.rays;
 }else if(p.kind==='geo-route-count'){
  const blocked=(a,b)=>p.blocked.some(([x,y])=>JSON.stringify([x,y])===JSON.stringify([a,b]));
  const paths=[];function visit(x,y,via,moves){if(x===p.columns&&y===p.rows){if(via)paths.push(moves);return;}for(const [a,b,s]of [[x+1,y,'→'],[x,y+1,'↑']])if(a<=p.columns&&b<=p.rows&&!blocked([x,y],[a,b]))visit(a,b,via||(a===p.via[0]&&b===p.via[1]),moves+s);}
  visit(0,0,false,'');assert.equal(paths.length,q.answer);const split=p.via[0]+p.via[1],first=new Set(paths.map(s=>s.slice(0,split))),last=new Set(paths.map(s=>s.slice(split)));
  for(const s of [...first,...last])assert(html.includes(s.split('').join(' ')),'path missing from branch table');assert.equal(first.size*last.size,q.answer);checks+=first.size+last.size;
 }
}
fs.writeFileSync(path.join(out,'report.json'),JSON.stringify({status:'PASS',checks,samples:samples.length,questionHashesUnchanged:true},null,2));console.log(JSON.stringify({checks,samples:samples.length,status:'PASS'}));
if(process.argv.includes('--render'))(async()=>{
 const {chromium}=require('playwright'),browser=await chromium.launch({headless:true}),page=await browser.newPage();
 const representatives=['roll','variant-triangle-count','geo-route-count'].map(kind=>samples.filter(s=>s.q.payload.kind===kind&&s.difficulty==='hard').sort((a,b)=>(b.q.solutionDiagram||'').length-(a.q.solutionDiagram||'').length)[0]);
 const css='*{box-sizing:border-box}body{margin:0;color:#182230;font:16px/1.7 "Malgun Gothic",sans-serif}.sheet{width:min(100%,794px);margin:auto;padding:32px;position:relative;background:#fff}.sheet h1{font-size:24px}.edition-table{border-collapse:collapse;width:100%;margin:22px 0}.edition-table th,.edition-table td{border:1px solid #566274;padding:8px;text-align:center;word-break:keep-all}.edition-table th{background:#f5f6f8;font-weight:700}footer{margin-top:28px;color:#566274;font-size:12px}@media(max-width:450px){.sheet{padding:18px}.edition-table th,.edition-table td{padding:5px 2px;font-size:12px}}@page{size:A4;margin:0}@media print{.sheet{width:210mm;min-height:297mm;padding:16mm;break-after:page}.sheet:last-child{break-after:auto}.edition-table th,.edition-table td{font-size:14px;padding:8px}.sheet:before{content:"GFIELD";position:absolute;left:30%;top:50%;transform:rotate(-30deg);opacity:.045;font-size:65px;pointer-events:none}}';
 const article=s=>'<article class="sheet"><header><h1>상세 풀이 검수</h1></header><p>'+s.q.prompt+'</p><p>'+s.q.solution+'</p>'+s.q.solutionDiagram+'<footer>교사용 검토 · GFIELD / LETE-ON</footer></article>';
 let renderChecks=0;
 try{for(const s of representatives)for(const width of [1000,390]){
 await page.setViewportSize({width,height:1000});await page.setContent('<style>'+css+'</style>'+article(s));assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'render overflow');
 const cells=await page.locator('td,th').evaluateAll(els=>els.every(el=>el.scrollWidth<=el.clientWidth+1));assert(cells,'cell clipping');renderChecks+=2;
 await page.screenshot({path:path.join(out,s.q.payload.kind+'-'+width+'.png'),fullPage:true});
 }
 await page.emulateMedia({media:'print'});await page.setViewportSize({width:1000,height:1200});await page.setContent('<style>'+css+'</style>'+representatives.map(article).join(''));assert(await page.locator('.sheet').evaluateAll(rows=>rows.every(el=>el.getBoundingClientRect().height<=1123)),'answer sheet exceeds A4');renderChecks++;
 await page.pdf({path:path.join(out,'detailed-solution-tables.pdf'),preferCSSPageSize:true,printBackground:true});
 fs.writeFileSync(path.join(out,'render-report.json'),JSON.stringify({status:'PASS',renderChecks,representatives:representatives.map(s=>({key:s.ref.key,seed:s.seed,difficulty:s.difficulty})),viewports:[1000,390],pdfPagesExpected:3},null,2));console.log('render '+renderChecks+' PASS');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
