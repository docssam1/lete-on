'use strict';
// Actual worksheet covers: excluded endpoints must occlude the underlying line.
// Local fixture only. No authentication, messages or student writes.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const {chromium}=require('./lib/playwright');
const ROOT=path.resolve(__dirname,'../..'),OUT=process.env.NM_COVER_ARTIFACTS||'/tmp/nm-cover-open-points';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf'};
const server=http.createServer((req,res)=>{const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+'/')||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');res.end(fs.readFileSync(f));});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));fs.mkdirSync(OUT,{recursive:true});const base='http://127.0.0.1:'+server.address().port,b=await chromium.launch(),report=[];
try{for(const course of ['C45','C70']){const p=await b.newPage({viewport:{width:1100,height:1300}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route(u=>!u.href.startsWith(base+'/'),r=>r.abort());
 await p.goto(base+'/number_magic/ws.html?c='+course+'&r=1&w=2026-W45&auto=0');await p.waitForFunction(()=>window.NM_WS_READY!==undefined);assert.equal(await p.evaluate(()=>NM_WS_READY),true);await p.evaluate(()=>document.fonts.ready);
 const proof=await p.locator('.nm-series-front').evaluate(el=>{const svg=el.querySelector('svg'),circle=[...svg.querySelectorAll('circle')].find(c=>c.getAttribute('fill')?.includes('--series-ground'));if(!circle)return null;const rect=circle.getBoundingClientRect(),cover=el.getBoundingClientRect();return {fill:getComputedStyle(circle).fill,background:getComputedStyle(el).backgroundColor,stroke:getComputedStyle(circle).stroke,point:[rect.x+rect.width/2-cover.x,rect.y+rect.height/2-cover.y],width:cover.width,height:cover.height};});assert(proof,course+' missing open endpoint');assert.equal(proof.fill,proof.background,course+' open endpoint must mask the underlying line');assert.notEqual(proof.stroke,proof.background);assert.deepEqual(errors,[]);
 await p.locator('.nm-series-front').screenshot({path:path.join(OUT,course+'-cover.png')});
 await p.emulateMedia({media:'print'});await p.pdf({path:path.join(OUT,course+'.pdf'),format:'A4',printBackground:true,pageRanges:'1-2',preferCSSPageSize:true});report.push({course,...proof,errors});await p.close();}
 fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
