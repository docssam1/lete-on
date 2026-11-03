"use strict";
const assert=require("node:assert/strict"),path=require("node:path"),os=require("node:os"),fs=require("node:fs"),{execFileSync}=require("node:child_process");
const {chromium}=require(process.env.HSE_PLAYWRIGHT_PATH||"playwright");
const origin=process.env.HSE_AUDIT_ORIGIN||"http://127.0.0.1:8932";
(async()=>{const browser=await chromium.launch({headless:true});try{
  const context=await browser.newContext({viewport:{width:1280,height:1000},serviceWorkers:"block"});
  await context.route("**/*",async route=>{
    const url=new URL(route.request().url());
    if(url.origin!==origin)return route.abort();
    if(url.pathname.endsWith("/hselementary/question-bank/app.js")){
      const source=fs.readFileSync(path.join(__dirname,"app.js"),"utf8");
      const needle="  function renderProblems() {";
      assert(source.includes(needle));
      return route.fulfill({status:200,contentType:"application/javascript",body:source.replace(needle,"  window.__auditMixedRender = questions => { state.questions = questions; renderProblems(); };\n"+needle)});
    }
    return route.continue();
  });
  const page=await context.newPage(),errors=[];page.on("pageerror",e=>errors.push(e.message));
  await page.goto(`${origin}/hselementary/question-bank/`);await page.waitForFunction(()=>window.__auditMixedRender);
  await page.evaluate(()=>{
    const questions=Array.from({length:9},(_,i)=>({number:i+1,type:{grade:5,term:2,unitName:"검사",name:"배치 확인"},difficulty:"심화 기준",sourceItemId:`fixture-${i}`,
      prompt:i===4?'<div data-reference-role="source-given-worked-example"><p>큰 그림이 있는 문제</p><svg width="420" height="180" viewBox="0 0 420 180"><rect x="1" y="1" width="418" height="178" fill="none" stroke="black"/></svg></div>':`<p>간단한 문제 ${i+1}</p>`}));
    window.__auditMixedRender(questions);document.querySelector("#bankLayout").hidden=true;document.querySelector("#worksheet").hidden=false;document.body.dataset.printMode="problem";
  });
  await page.emulateMedia({media:"print"});
  const pages=await page.locator("#problemView .print-page").evaluateAll(nodes=>nodes.map(p=>({four:p.classList.contains("print-page--four-up"),numbers:[...p.querySelectorAll("header b")].map(n=>Number(n.textContent)),height:p.querySelector(".question-grid").getBoundingClientRect().height})));
  assert.deepEqual(pages.map(p=>p.numbers),[[1,2,3,4],[5],[6,7,8,9]]);
  assert.deepEqual(pages.map(p=>p.four),[true,false,true]);
  assert(pages[0].height>850&&pages[2].height>850,"short questions use the A4 page height");
  const file=path.join(process.env.MAC_CHECK_OUTPUT||os.tmpdir(),"mixed-four-up.pdf");
  await page.pdf({path:file,format:"A4",printBackground:true,preferCSSPageSize:true});
  assert.match(execFileSync("pdfinfo",[file],{encoding:"utf8"}),/Pages:\s+3\b/);
  assert.deepEqual(errors,[]);await context.close();
}finally{await browser.close();}console.log("PASS: short runs remain four-up around a large question, with three A4 pages");})().catch(e=>{console.error(e);process.exitCode=1;});
