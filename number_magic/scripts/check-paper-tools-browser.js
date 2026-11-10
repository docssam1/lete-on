#!/usr/bin/env node
// Actual standalone tool and worksheet renderer, every tool × 3 languages.
// Gallery navigation, mathematical dimensions, labels and A4; no cloud writes.
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'..'),OUT=process.env.NM_PAPER_REVIEW_OUT;
const source=fs.readFileSync(path.join(ROOT,'data/paper-tools.js'),'utf8');
const box={window:{}};require('vm').runInNewContext(source,box);
const tools=box.window.NM_PAPER_TOOLS;
const ids=tools.flatMap(t=>t.courseIds);assert.equal(new Set(ids).size,ids.length,'course assigned twice');
for(const [course,key]of [[0,'rods'],[1,'hundred'],[2,'tenframe'],[6,'placechips'],[4,'array'],[5,'place'],[16,'decimal'],[17,'array'],[31,'algtiles'],[34,'coord'],[36,'algtiles'],[62,'unitcircle']])assert.equal(box.window.NM_PAPER_TOOL_OF_COURSE(course).key,key);
assert.equal(box.window.NM_PAPER_TOOL_OF_COURSE(53),null);
assert.equal(box.window.NM_PAPER_TOOLS_OF_COURSE(1).map(t=>t.key).join(','),'hundred,tenframe','C1 gets the hundred board first, then the ten-frame');
const report={templates:tools.length,cases:[],errors:[],externalWrites:[]};
if(OUT)fs.mkdirSync(OUT,{recursive:true});
const server=http.createServer((req,res)=>{
 const p=path.join(ROOT,decodeURIComponent(req.url.split('?')[0]));
 if(!p.startsWith(ROOT+path.sep)||!fs.existsSync(p)||fs.statSync(p).isDirectory()){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2'})[path.extname(p)]||'application/octet-stream');fs.createReadStream(p).pipe(res);
});
(async()=>{await new Promise(r=>server.listen(0,r));const base='http://localhost:'+server.address().port,b=await chromium.launch();
try{for(const tool of tools)for(const lang of ['ko','en','zh']){
 const ctx=await b.newContext({viewport:{width:1100,height:1200}});
 await ctx.route('**/*',r=>{const q=r.request();if(q.method()==='GET'&&q.url().startsWith(base+'/'))return r.continue();if(!['GET','HEAD'].includes(q.method()))report.externalWrites.push(q.url());return r.abort();});
 const saved=JSON.stringify({lang:lang==='zh'?'ko':'zh',marker:'preserve-preview-state'});
 await ctx.addInitScript(raw=>localStorage.setItem('nm_preview_state_v1',raw),saved);
 const p=await ctx.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 await p.goto(base+'/ws.html?tool='+tool.key+'&auto=0&l='+lang);await p.waitForFunction(()=>window.NM_WS_READY===true);
 await p.emulateMedia({media:'print'});
 await p.addStyleTag({content:'html,body,.nm-print-sheet{width:190mm!important}'});await p.evaluate(()=>document.fonts.ready);
 const d=await p.evaluate(()=>{
  const page=document.querySelector('.nm-pt-page'),art=page.querySelector('.nm-pt-art'),s=art.querySelector('svg'),v=s.viewBox.baseVal,bb=s.getBBox(),pr=page.getBoundingClientRect(),ar=art.getBoundingClientRect(),m=s.getScreenCTM(),mm=96/25.4;
  const bad=[],collisions=[];
  for(const svg of page.querySelectorAll('.nm-pt-art svg,.nm-pt-demo svg')){
   const vb=svg.viewBox.baseVal,bb=svg.getBBox();if(bb.x<-.6||bb.y<-.6||bb.x+bb.width>vb.width+.6||bb.y+bb.height>vb.height+.6)bad.push('SVG bounds');
   const texts=[...svg.querySelectorAll('text')];
   for(const e of texts){const r=e.getBBox();if(r.x<-.6||r.y<-.6||r.x+r.width>vb.width+.6||r.y+r.height>vb.height+.6)bad.push(e.textContent);}
   for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){const a=texts[i].getBoundingClientRect(),b=texts[j].getBoundingClientRect();if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)collisions.push(texts[i].textContent+' / '+texts[j].textContent);}
  }
  for(const e of page.querySelectorAll('.nm-pt-steps li,.nm-pt-opt,.nm-pt-why'))if(e.scrollWidth>e.clientWidth+2)bad.push('text box: '+e.textContent);
  const counter=s.querySelector('[data-part="counter"]'),rod=s.querySelector('[data-part="rod"]'),one=s.querySelector('[data-part="one"]');
  return {key:page.dataset.tool,lang:document.querySelector('.nm-print-sheet').lang,overflow:page.scrollHeight-page.clientHeight,
   artClipped:ar.top<pr.top-1||ar.bottom>pr.bottom+1||bb.x<-.6||bb.y<-.6||bb.x+bb.width>v.width+.6||bb.y+bb.height>v.height+.6,
   labelOverflow:bad,labelCollisions:collisions,fontLoaded:document.fonts.check('12px "NM Tools Sans"'),nonKoreanDiagram:/[가-힣]/.test(s.textContent),scaleMm:m.a/mm,frameCount:s.querySelectorAll('[data-part="frame"]').length,
   counters:s.querySelectorAll('[data-part="counter"]').length,counterDiameterMm:counter?(counter.tagName==='rect'?+counter.getAttribute('width'):+counter.getAttribute('r')*2)*m.a/mm:null,
   rods:s.querySelectorAll('[data-part="rod"]').length,ones:s.querySelectorAll('[data-part="one"]').length,
   rodSizeMm:rod?[+rod.getAttribute('width')*m.a/mm,+rod.getAttribute('height')*m.d/mm]:null,oneSizeMm:one?+one.getAttribute('width')*m.a/mm:null,
   fractionLabels:s.querySelectorAll('[data-part="fraction-label"]').length,slashFraction:/\b1\/[23468]\b/.test(page.textContent),
   unitCircleRadius:s.querySelector('[data-part="unit-circle"]')?.getAttribute('r'),
   armLength:(()=>{const a=s.querySelector('[data-part="arm-pivot"]'),b=s.querySelector('[data-part="arm-tip"]');return a&&b?Math.hypot(+b.getAttribute('cx')- +a.getAttribute('cx'),+b.getAttribute('cy')- +a.getAttribute('cy')):null})(),
   fractionDiscs:[...s.querySelectorAll('[data-part="fraction-disc"]')].map(e=>({n:+e.dataset.parts,r:+e.getAttribute('r')})),
   algebra:[...s.querySelectorAll('[data-part^="algebra-"]')].map(e=>({part:e.dataset.part,w:+e.getAttribute('width'),h:+e.getAttribute('height')})),
   pentoPieces:[...s.querySelectorAll('[data-part="pento-piece"]')].map(e=>({id:e.dataset.piece,cells:[...e.querySelectorAll('rect')].map(r=>({x:+r.getAttribute('x'),y:+r.getAttribute('y'),w:+r.getAttribute('width'),h:+r.getAttribute('height')}))})),
   pentoExample:[...s.querySelectorAll('[data-part="pento-example-cell"]')].map(e=>({id:e.dataset.piece,x:+e.getAttribute('x'),y:+e.getAttribute('y')})),
   arrayDots:s.querySelectorAll('[data-part="array-dot"]').length,integerCards:s.querySelectorAll('[data-part="integer-card"]').length,operationCards:s.querySelectorAll('[data-part="operation-card"]').length,
   demoDots:page.querySelectorAll('.nm-pt-demo [data-kind="dot"]').length,demoRings:page.querySelectorAll('.nm-pt-demo [data-kind="ring"]').length,
   examples:page.querySelectorAll('.nm-pt-example').length,images:[...page.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0),text:page.innerText};
 });
 assert.equal(await p.evaluate(()=>localStorage.getItem('nm_preview_state_v1')),saved,'preview state changed');
 report.cases.push(d);assert.equal(d.key,tool.key);assert.equal(d.lang,lang);assert(d.overflow<=3,tool.key+' '+lang+' A4 overflow '+d.overflow);assert(!d.artClipped,tool.key+' clipped art');assert.deepEqual(d.labelOverflow,[],tool.key+' labels');assert(d.images,'missing character');assert(d.fontLoaded,'local tool font');assert.deepEqual(d.labelCollisions,[],tool.key+' label overlap');if(lang!=='ko')assert(!d.nonKoreanDiagram,tool.key+' unlocalised diagram');assert.equal(d.examples,tool.embeddedExample?0:1);
 if(tool.key==='tenframe'){assert.equal(d.frameCount,2);assert.equal(d.counters,20);assert.equal(d.demoDots,8);assert.equal(d.demoRings,7);assert(d.counterDiameterMm>=16,'counter too small');assert(19*d.scaleMm>=18,'frame cell too small');assert(!/빌려|borrowing/.test(d.text));}
 if(tool.key==='hundred'){assert.equal(d.counters,14);assert(d.counterDiameterMm>=13,'hundred-board counter too small');}
 if(tool.key==='place'){assert.equal(d.rods,8);assert.equal(d.ones,20);assert(d.oneSizeMm>=7.5);assert(Math.abs(d.rodSizeMm[1]/d.oneSizeMm-10)<.01,'ten rod must equal ten units');assert(Math.abs(d.rodSizeMm[0]/d.oneSizeMm-1)<.01);}
 if(tool.key==='array')assert.equal(d.arrayDots,100);
 if(tool.key==='intline'){assert.equal(d.integerCards,12);assert.equal(d.operationCards,2);}
 if(tool.key==='unitcircle')assert.equal(d.armLength,+d.unitCircleRadius,'arm must match circle radius');
 if(tool.key==='algtiles'){const x=d.algebra.filter(x=>x.part==='algebra-x'),o=d.algebra.filter(x=>x.part==='algebra-one'),sq=d.algebra.filter(x=>x.part==='algebra-square');assert.equal(x.length,8);assert.equal(o.length,20);assert.equal(sq.length,4);assert.equal(x[0].w,o[0].w);assert.equal(x[0].h,sq[0].w);}
 if(tool.key==='pentomino'){
  function canonical(cells){const v=[];for(const flip of [-1,1])for(let turn=0;turn<4;turn++){let a=cells.map(([x,y])=>{x*=flip;for(let r=0;r<turn;r++)[x,y]=[-y,x];return[x,y]});const mx=Math.min(...a.map(c=>c[0])),my=Math.min(...a.map(c=>c[1]));v.push(a.map(([x,y])=>[x-mx,y-my]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]).map(c=>c.join(',')).join(';'));}return v.sort()[0];}
  const signatures=[];for(const p of d.pentoPieces){const minx=Math.min(...p.cells.map(c=>c.x)),miny=Math.min(...p.cells.map(c=>c.y));const shape=canonical(p.cells.map(c=>[Math.round((c.x-minx)/c.w),Math.round((c.y-miny)/c.h)]));signatures.push(shape);const example=d.pentoExample.filter(c=>c.id===p.id),x0=Math.min(...example.map(c=>c.x)),y0=Math.min(...example.map(c=>c.y));assert.equal(canonical(example.map(c=>[Math.round((c.x-x0)/4.3),Math.round((c.y-y0)/4.3)])),shape,p.id+' example changes shape');}assert.equal(new Set(signatures).size,12,'duplicate pentomino shape');
  assert.equal(d.pentoPieces.length,12);for(const p of d.pentoPieces)assert.equal(p.cells.length,5);assert.equal(d.pentoExample.length,60);assert.equal(new Set(d.pentoExample.map(c=>c.x+','+c.y)).size,60);for(const p of d.pentoPieces)assert.equal(d.pentoExample.filter(c=>c.id===p.id).length,5);assert(d.scaleMm*8>=7.5,'pento cells too small');}
 if(tool.key==='fraction'){assert.equal(new Set(d.fractionDiscs.map(c=>c.r)).size,1);assert.deepEqual(d.fractionDiscs.map(c=>c.n),[1,2,3,4,6,8]);assert.equal(d.fractionLabels,5);assert(!d.slashFraction,'use stacked fractions');}
 if(OUT&&lang==='ko'){
  await p.locator('.nm-pt-page').screenshot({path:path.join(OUT,tool.key+'.png')});
  {
   await p.evaluate(()=>{const page=document.querySelector('.nm-pt-page'),sheet=page.parentElement;page.remove();sheet.replaceChildren(page);});
   await p.pdf({path:path.join(OUT,tool.key+'.pdf'),format:'A4',margin:{top:'10mm',bottom:'10mm',left:'10mm',right:'10mm'},printBackground:true});
  }
 }
 await ctx.close();
}
// The all-tools file must use twelve distinct page IDs and print as twelve A4 pages.
{
 const ctx=await b.newContext(),p=await ctx.newPage();
 await ctx.route('**/*',r=>r.request().method()==='GET'&&r.request().url().startsWith(base+'/')?r.continue():r.abort());
 await p.goto(base+'/ws.html?tool=all&l=ko&auto=0');await p.waitForFunction(()=>window.NM_WS_READY===true);
 assert.equal(await p.locator('.nm-pt-page').count(),tools.length);assert.equal(await p.locator('.nm-w2-item').count(),0);
 assert.equal(await p.locator('.nm-pt-page').evaluateAll(es=>new Set(es.map(e=>e.id)).size),tools.length);
 await p.emulateMedia({media:'print'});await p.addStyleTag({content:'html,body,.nm-print-sheet{width:190mm!important}'});
 const overflow=await p.locator('.nm-pt-page').evaluateAll(es=>es.filter(e=>e.scrollHeight>e.clientHeight+3).map(e=>e.dataset.tool));assert.deepEqual(overflow,[]);
 if(OUT)await p.pdf({path:path.join(OUT,'all-paper-tools.pdf'),format:'A4',margin:{top:'10mm',bottom:'10mm',left:'10mm',right:'10mm'},printBackground:true});
 await ctx.close();report.allTools={pages:tools.length,uniqueIds:tools.length,questions:0};
}
// Visit all twelve tools through the real previous/next gallery controls.
for(const width of [1440,375]){
 const ctx=await b.newContext({viewport:{width,height:900}}),p=await ctx.newPage();
 await ctx.route('**/*',r=>r.request().method()==='GET'&&r.request().url().startsWith(base+'/')?r.continue():r.abort());
 await p.goto(base+'/paper-tools.html');
 for(let i=0;i<tools.length;i++){
  await p.waitForFunction(key=>{const w=document.getElementById('sheet').contentWindow;return w.NM_WS_READY===true&&w.document.querySelector('.nm-pt-page')?.dataset.tool===key;},tools[i].key);
  assert.equal(await p.locator('#progress').textContent(),(i+1)+' / '+tools.length);
  assert.equal(await p.frameLocator('#sheet').locator('.nm-pt-page').getAttribute('data-tool'),tools[i].key);
  assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'gallery horizontal overflow '+width);
  assert.equal(await p.frameLocator('#sheet').locator('#wsBar').isVisible(),false,'duplicate frame toolbar');
  if(i<tools.length-1)await p.locator('#next').click();
 }
 assert(await p.locator('#print').evaluate(e=>e.innerText.trim().length>0),'empty print button');
 assert(await p.locator('#next').isDisabled());await p.locator('#prev').click();assert.equal(await p.locator('#progress').textContent(),(tools.length-1)+' / '+tools.length);
 await p.waitForFunction(key=>document.getElementById('sheet').contentWindow.NM_WS_READY===true&&document.getElementById('sheet').contentWindow.document.querySelector('.nm-pt-page')?.dataset.tool===key,tools[tools.length-2].key);
 for(const language of ['en','zh','ko']){await p.locator('#lang').selectOption(language);await p.waitForFunction(l=>{const w=document.getElementById('sheet').contentWindow;return w.NM_WS_READY===true&&w.document.documentElement.lang===l;},language);}
 if(OUT)await p.screenshot({path:path.join(OUT,'gallery-'+width+'.png')});
 await p.goto(base+'/ws.html?tool=unknown');await p.waitForFunction(()=>window.NM_WS_READY==='error');assert(await p.locator('#wsPrint').isDisabled());
 await ctx.close();
}
report.gallery={viewports:[1440,375],toolsPerViewport:tools.length,invalidLinkRejected:true};
assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalWrites,[]);console.log('Paper tools: '+report.cases.length+' A4/language cases passed; SVG/text clipping 0; external writes 0.');
}finally{if(OUT)fs.writeFileSync(path.join(OUT,'paper-tools-browser.json'),JSON.stringify(report,null,2));await b.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
