#!/usr/bin/env node
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright'),DP=require('../app/delivery-plan.js'),legacy=require('../data/delivery-courses-v1.js');
const ROOT=path.resolve(__dirname,'../..'),current=require('../../scripts/build-nm-delivery-runtime.cjs').loadCourses().courses;
const plan={courseKey:'C29',sessionIndex:1,startDate:'2026-10-19',speed:1,amount:1,cadence:'w2',pace:'p2'};
const server=http.createServer((req,res)=>{const file=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',({'.js':'application/javascript','.html':'text/html','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
(async()=>{let browser;await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin='http://127.0.0.1:'+server.address().port;try{
 browser=await chromium.launch();let checks=0;
 for(const [kind,version,want]of [['personal',DP.LEGACY_VERSION,legacy],['personal',DP.VERSION,current],['managed','20261023-middle25',legacy],['managed','20261026-middle25-v2',current]]){
  const page=await browser.newPage();await page.route('**/*',r=>r.request().url().startsWith(origin+'/')?r.continue():r.abort());
  const query=new URLSearchParams({c:'C29',s:'1',p:'1',w:'2026-W43',k:'1',cad:'w2',amt:'1',auto:'0'});
  if(kind==='personal'){query.set('dv',version);query.set('dp',DP.encode(plan));}else{query.set('hp','1');query.set('highPlanVersion',version);}
  await page.goto(origin+'/number_magic/ws.html?'+query);await page.waitForFunction(()=>window.NM_WS_READY!==undefined,null,{timeout:90000});
  const result=await page.evaluate(()=>({ready:NM_WS_READY,course:JSON.parse(JSON.stringify(NM_COURSES.C29)),errors:document.querySelectorAll('.katex-error').length}));
  assert.equal(result.ready,true,kind+version);assert.equal(result.errors,0);assert.deepEqual(result.course,want.C29,kind+version+' exact resolved source content and bundles');checks++;
  console.log('DELIVERY_VERSION_BROWSER_OK '+kind+' '+version);await page.close();
 }
 console.log('DELIVERY_VERSIONS_BROWSER_OK cases='+checks+' externalWrites=0');
}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
