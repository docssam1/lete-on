#!/usr/bin/env node
// Real worksheet renderer, all 12 tool templates × 3 languages. Read-only local
// fixture swaps the selected tool before ws.html builds; no student/API writes.
'use strict';
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'..'),OUT=process.env.NM_PAPER_REVIEW_OUT;
const source=fs.readFileSync(path.join(ROOT,'data/paper-tools.js'),'utf8');
const box={window:{}};require('vm').runInNewContext(source,box);
const tools=box.window.NM_PAPER_TOOLS, report={templates:tools.length,cases:[],errors:[],externalWrites:[]};
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
 await ctx.route('**/data/paper-tools.js*',r=>r.fulfill({contentType:'text/javascript',body:source+'\nwindow.NM_PAPER_TOOL_OF_COURSE=function(){return window.NM_PAPER_TOOLS.find(t=>t.key==='+JSON.stringify(tool.key)+');};'}));
 const p=await ctx.newPage();p.on('pageerror',e=>report.errors.push(e.message));
 await p.goto(base+'/ws.html?c=C1&r=1&w=2026-W45&auto=0&l='+lang+'#nm-paper-tool');await p.waitForFunction(()=>window.NM_WS_READY===true);
 if(tool.key==='tenframe'&&lang==='ko')assert(await p.locator('#nm-paper-tool').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<100),'tool deep link did not scroll');
 await p.emulateMedia({media:'print'});
 await p.addStyleTag({content:'html,body,.nm-print-sheet{width:190mm!important}'});await p.evaluate(()=>document.fonts.ready);
 const d=await p.evaluate(()=>{
  const page=document.querySelector('.nm-pt-page'),art=page.querySelector('.nm-pt-art'),s=art.querySelector('svg'),v=s.viewBox.baseVal,bb=s.getBBox(),pr=page.getBoundingClientRect(),ar=art.getBoundingClientRect(),m=s.getScreenCTM(),mm=96/25.4;
  const bad=[];for(const e of page.querySelectorAll('text')){const r=e.getBBox();if(r.x<-.6||r.y<-.6||r.x+r.width>v.width+.6||r.y+r.height>v.height+.6)bad.push(e.textContent);}
  for(const e of page.querySelectorAll('.nm-pt-steps li,.nm-pt-opt,.nm-pt-why'))if(e.scrollWidth>e.clientWidth+2)bad.push('text box: '+e.textContent);
  const counter=s.querySelector('[data-part="counter"]'),rod=s.querySelector('[data-part="rod"]'),one=s.querySelector('[data-part="one"]');
  return {key:page.dataset.tool,lang:document.querySelector('.nm-print-sheet').lang,overflow:page.scrollHeight-page.clientHeight,
   artClipped:ar.top<pr.top-1||ar.bottom>pr.bottom+1||bb.x<-.6||bb.y<-.6||bb.x+bb.width>v.width+.6||bb.y+bb.height>v.height+.6,
   labelOverflow:bad,scaleMm:m.a/mm,frameCount:s.querySelectorAll('[data-part="frame"]').length,
   counters:s.querySelectorAll('[data-part="counter"]').length,counterDiameterMm:counter?+counter.getAttribute('r')*2*m.a/mm:null,
   rods:s.querySelectorAll('[data-part="rod"]').length,ones:s.querySelectorAll('[data-part="one"]').length,
   rodSizeMm:rod?[+rod.getAttribute('width')*m.a/mm,+rod.getAttribute('height')*m.d/mm]:null,oneSizeMm:one?+one.getAttribute('width')*m.a/mm:null,
   fractionLabels:s.querySelectorAll('[data-part="fraction-label"]').length,slashFraction:/\b1\/[23468]\b/.test(page.textContent),
   images:[...page.querySelectorAll('img')].every(i=>i.complete&&i.naturalWidth>0),text:page.innerText};
 });
 report.cases.push(d);assert.equal(d.key,tool.key);assert.equal(d.lang,lang);assert(d.overflow<=3,tool.key+' '+lang+' A4 overflow '+d.overflow);assert(!d.artClipped,tool.key+' clipped art');assert.deepEqual(d.labelOverflow,[],tool.key+' labels');assert(d.images,'missing character');
 if(tool.key==='tenframe'){assert.equal(d.frameCount,2);assert.equal(d.counters,20);assert(d.counterDiameterMm>=16,'counter too small');assert(19*d.scaleMm>=18,'frame cell too small');assert(!/빌려|borrowing/.test(d.text));}
 if(tool.key==='place'){assert.equal(d.rods,8);assert.equal(d.ones,20);assert(d.oneSizeMm>=7.5);assert(Math.abs(d.rodSizeMm[1]/d.oneSizeMm-10)<.01,'ten rod must equal ten units');assert(Math.abs(d.rodSizeMm[0]/d.oneSizeMm-1)<.01);}
 if(tool.key==='fraction'){assert.equal(d.fractionLabels,5);assert(!d.slashFraction,'use stacked fractions');}
 if(OUT&&lang==='ko'){
  await p.locator('.nm-pt-page').screenshot({path:path.join(OUT,tool.key+'.png')});
  if(['tenframe','place','fraction','pentomino'].includes(tool.key)){
   await p.evaluate(()=>{const page=document.querySelector('.nm-pt-page'),sheet=page.parentElement;page.remove();sheet.replaceChildren(page);});
   await p.pdf({path:path.join(OUT,tool.key+'.pdf'),format:'A4',margin:{top:'10mm',bottom:'10mm',left:'10mm',right:'10mm'},printBackground:true});
  }
 }
 await ctx.close();
}
assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalWrites,[]);console.log('Paper tools: '+report.cases.length+' A4/language cases passed; SVG/text clipping 0; external writes 0.');
}finally{if(OUT)fs.writeFileSync(path.join(OUT,'paper-tools-browser.json'),JSON.stringify(report,null,2));await b.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
