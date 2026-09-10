"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const workbookSource=require("../learning/grade6-sp-a-unit-workbook.js");
const ratioSource=require("../learning/grade6-rp-a-unit-workbook.js");
const fractionSource=require("../learning/grade6-ns-a-unit-workbook.js");
const computationSource=require("../learning/grade6-ns-b-unit-workbook.js");
const signedNumberSource=require("../learning/grade6-ns-c-unit-workbook.js");
const expressionSource=require("../learning/grade6-ee-a-unit-workbook.js");
const equationSource=require("../learning/grade6-ee-b-unit-workbook.js");
const relationshipSource=require("../learning/grade6-ee-c-unit-workbook.js");
const geometrySource=require("../learning/grade6-g-a-unit-workbook.js");
const grade7RatioSource=require("../learning/grade7-rp-a-unit-workbook.js");
const root=path.resolve(__dirname,"..","..");
let server,browser,baseUrl;
function type(file){if(file.endsWith(".html"))return"text/html; charset=utf-8";if(file.endsWith(".css"))return"text/css; charset=utf-8";if(file.endsWith(".js"))return"text/javascript; charset=utf-8";return"application/octet-stream";}
function errorsFor(page){const errors=[];page.on("pageerror",function(error){errors.push(error.message);});page.on("console",function(message){if(message.type()==="error")errors.push(message.text());});return errors;}
test.before(async function(){server=http.createServer(function(request,response){const file=path.resolve(root,"."+decodeURIComponent(request.url.split("?")[0]));if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){response.writeHead(404);response.end("Not found");return;}response.writeHead(200,{"content-type":type(file)});fs.createReadStream(file).pipe(response);});await new Promise(function(resolve){server.listen(0,"127.0.0.1",resolve);});baseUrl=`http://127.0.0.1:${server.address().port}/boarding-school-math/unit-workbook.html`;browser=await chromium.launch({headless:true});});
test.after(async function(){if(browser)await browser.close();if(server)await new Promise(function(resolve){server.close(resolve);});});

test("student edition renders a 12-page, 36-item answer-free book",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.SP.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});
  await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);
  assert.equal(await page.locator(".book-problem").count(),36);
  assert.equal(await page.locator(".concept-card").count(),2);
  assert.equal(await page.locator(".teacher-key,.teacher-move").count(),0);
  assert.equal(await page.locator('[data-audience="teacher"]').count(),0);
  assert.equal(await page.locator("#edition-label").innerText(),"학생용");
  assert.equal(await page.locator('[data-mode="recheck"]').isDisabled(),true);
  assert.equal(await page.locator("#print-book").isEnabled(),true);
  assert.equal(await page.locator(".record-page").count(),1);
  const palette=await page.evaluate(function(){const body=getComputedStyle(document.body);const paper=getComputedStyle(document.querySelector(".book-page"));const print=getComputedStyle(document.getElementById("print-book"));return{body:body.backgroundColor,paper:paper.backgroundColor,print:print.backgroundColor,watermark:getComputedStyle(document.querySelector(".book-page"),"::before").content};});
  assert.deepEqual(palette,{body:"rgb(245, 246, 248)",paper:"rgb(255, 255, 255)",print:"rgb(36, 86, 196)",watermark:'"GFIELD MATH"'});
  const first=page.locator('[data-item-id="spa-w01"]');
  await first.locator('[data-answer-id="N"]').click();assert.equal(await first.locator(".choice-feedback.wrong").count(),1);
  await first.locator('[data-answer-id="S"]').click();assert.equal(await first.locator(".choice-feedback.correct").count(),1);
  assert.equal(await page.locator("#progress-chip").textContent(),"1 / 36");
  await page.locator("#locale-select").selectOption("en");
  assert.equal(await page.locator("#progress-chip").textContent(),"1 / 36");
  assert.equal(await first.locator('[data-answer-id="S"].is-selected.is-correct').count(),1);
  await page.emulateMedia({media:"print"});
  const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});
  assert.deepEqual(overflow,[]);
  assert.deepEqual(errors,[]);await page.close();
});

test("ratio student edition is a 36-item printable unit with exact-response inputs",async function(){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.RP.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});
  await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);
  assert.equal(await page.locator(".book-problem").count(),36);
  assert.equal(await page.locator(".answer-input").count(),36);
  assert.equal(await page.locator(".choice-button,.teacher-key,.teacher-move").count(),0);
  assert.equal(await page.locator("h1").innerText(),"6.RP.A 비와 비율 단원 워크북");
  assert.match(await page.locator("main").innerText(),/단위율과 같은 비로 구하기/);
  assert.doesNotMatch(await page.locator("main").innerText(),/비례값/);
  assert.match(await page.locator(".scope-notice").innerText(),/전체 숙달·배치·승급을 결정하지 않습니다/);
  assert.match(await page.locator(".reflection-box").innerText(),/내가 설명하는 비와 단위율/);
  const first=page.locator('[data-item-id="rpa-w01"]');
  await first.locator(".answer-input").fill("21");await first.locator(".check-button").click();assert.equal(await first.locator(".choice-feedback.wrong").count(),1);
  await first.locator(".answer-input").fill("20");await first.locator(".check-button").click();assert.equal(await first.locator(".choice-feedback.correct").count(),1);
  assert.equal(await page.locator("#progress-chip").innerText(),"1 / 36");
  await page.emulateMedia({media:"print"});
  assert.equal(await page.locator(".screen-answer").first().evaluate(function(node){return getComputedStyle(node).display;}),"none");
  assert.equal(await page.locator(".print-answer-line").first().evaluate(function(node){return getComputedStyle(node).display;}),"block");
  const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});
  assert.deepEqual(overflow,[]);
  assert.deepEqual(errors,[]);await context.close();
});

test("all 36 ratio responses unlock only the new 8-item recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.RP.A&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});
  for(const item of ratioSource.pack.workbookItems){const card=page.locator(`[data-item-id="${item.id}"]`);await card.locator(".answer-input").fill(ratioSource.formatResult(item));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");
  assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.RP.A:v1");}),"complete-v1");
  assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.RP.A:v1");}),null);
  assert.equal(await page.locator('[data-mode="recheck"]').isEnabled(),true);
  await page.locator('[data-mode="recheck"]').click();
  assert.equal(await page.locator(".book-problem").count(),8);
  assert.equal(await page.locator(".answer-input").count(),8);
  assert.equal(await page.locator("#progress-chip").innerText(),"0 / 8");
  assert.deepEqual(errors,[]);await context.close();
});

test("ratio Chinese teacher guide keeps answers separate from the student edition",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.RP.A&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".book-page").count(),20);
  assert.equal(await page.locator(".book-problem").count(),36);
  assert.equal(await page.locator(".teacher-key").count(),36);
  assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);
  assert.equal(await page.locator("h1").innerText(),"6.RP.A 比与比率单元练习册");
  assert.match(await page.locator("main").innerText(),/单位率与按比例求值/);
  assert.doesNotMatch(await page.locator("main").innerText(),/比例值/);
  assert.match(await page.locator(".teacher-observation").innerText(),/表格、比率条或双数轴/);
  await page.emulateMedia({media:"print"});
  const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});
  assert.deepEqual(overflow,[]);assert.deepEqual(errors,[]);await page.close();
});

test("fraction-division student edition renders 36 exact-response items on 12 pages",async function(){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});
  await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);
  assert.equal(await page.locator(".book-problem").count(),36);
  assert.equal(await page.locator(".answer-input").count(),36);
  assert.equal(await page.locator(".teacher-key,.teacher-move,.choice-button").count(),0);
  assert.equal(await page.locator("h1").innerText(),"6.NS.A 분수 나눗셈 단원 워크북");
  assert.match(await page.locator("main").innerText(),/몇 묶음인지와 한 몫의 크기/);
  assert.match(await page.locator("main").innerText(),/측정, 나눔, 단위율과 넓이에 적용/);
  const card=page.locator('[data-item-id="nsa-w14"]');await card.locator(".answer-input").fill("10/8");await card.locator(".check-button").click();assert.equal(await card.locator(".choice-feedback.wrong").count(),1);await card.locator(".answer-input").fill("5/4");await card.locator(".check-button").click();assert.equal(await card.locator(".choice-feedback.correct").count(),1);
  await page.emulateMedia({media:"print"});const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;});assert.equal(overflow,0);
  assert.deepEqual(errors,[]);await context.close();
});

test("all 36 fraction-division responses unlock only the separate 8-item recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.A&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});
  for(const item of fractionSource.pack.workbookItems){const card=page.locator(`[data-item-id="${item.id}"]`);await card.locator(".answer-input").fill(fractionSource.formatResult(item));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");
  assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.NS.A:v1");}),"complete-v1");
  assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.NS.A:v1");}),null);
  await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.equal(await page.locator("#progress-chip").innerText(),"0 / 8");
  assert.deepEqual(errors,[]);await context.close();
});

test("fraction-division Chinese teacher guide keeps 36 answers out of student controls",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.A&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key").count(),36);assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);
  assert.equal(await page.locator("h1").innerText(),"6.NS.A 分数除法单元练习册");assert.match(await page.locator(".teacher-observation").innerText(),/求份数与求每份大小/);
  await page.emulateMedia({media:"print"});const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;});assert.equal(overflow,0);
  assert.deepEqual(errors,[]);await page.close();
});

test("number-system student edition renders 36 exact-response items on 12 pages",async function(){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.B&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".answer-input").count(),36);assert.equal(await page.locator(".teacher-key,.teacher-move,.choice-button").count(),0);assert.equal(await page.locator("h1").innerText(),"6.NS.B 수 체계 계산 단원 워크북");assert.match(await page.locator("main").innerText(),/최대공약수, 최소공배수와 분배법칙/);assert.match(await page.locator('[data-item-id="nsba-w16"] .problem-visual').innerText(),/1487.5 ÷ 125 = □/);
  await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await context.close();
});

test("all 36 number-system responses unlock only its eight-item recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.B&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});for(const candidate of computationSource.pack.workbookItems){const card=page.locator(`[data-item-id="${candidate.id}"]`);await card.locator(".answer-input").fill(computationSource.formatResult(candidate));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.NS.B:v1");}),"complete-v1");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.NS.B:v1");}),null);await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.deepEqual(errors,[]);await context.close();
});

test("number-system Chinese teacher guide separates all 36 answers",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.NS.B&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key").count(),36);assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);assert.equal(await page.locator("h1").innerText(),"6.NS.B 数系计算单元练习册");await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await page.close();
});

test("signed-number student edition renders 36 answer-free calculated visuals on 12 pages",async function(){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.C&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".answer-input").count(),36);assert.equal(await page.locator(".teacher-key,.teacher-move,.choice-button").count(),0);assert.equal(await page.locator("h1").innerText(),"6.NS.C 음수와 좌표평면 단원 워크북");assert.equal(await page.locator(".nsc-number-line,.nsc-coordinate-plane").count(),36);assert.equal(await page.locator("svg[aria-label*='7/4'],svg[aria-label*='Quadrant']").count(),0);
  const yMirror=page.locator('[data-item-id="nsca-w35"] circle');assert.equal(await yMirror.count(),1);assert.equal(await page.locator('[data-item-id="nsca-w35"] .is-target').count(),0);assert.equal(await page.locator(".nsc-target-label").count(),0);
  await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await context.close();
});

test("all 36 signed-number responses unlock only its eight-item recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.NS.C&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});for(const candidate of signedNumberSource.pack.workbookItems){const card=page.locator(`[data-item-id="${candidate.id}"]`);await card.locator(".answer-input").fill(signedNumberSource.formatResult(candidate));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.NS.C:v1");}),"complete-v1");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.NS.C:v1");}),null);await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.deepEqual(errors,[]);await context.close();
});

test("signed-number Chinese teacher guide separates all 36 answers",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.NS.C&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key").count(),36);assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);assert.equal(await page.locator("h1").innerText(),"6.NS.C 负数与坐标平面单元练习册");assert.match(await page.locator(".teacher-observation").innerText(),/基准与方向/);const yMirror=await page.locator('[data-item-id="nsca-w35"] circle').evaluateAll(function(nodes){return nodes.map(function(node){return[Number(node.getAttribute("cx")),Number(node.getAttribute("cy"))];});});assert.equal(yMirror.length,2);assert.ok(Math.abs(yMirror[0][0]+yMirror[1][0]-280)<.01);assert.equal(yMirror[0][1],yMirror[1][1]);await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await page.close();
});

test("expression student edition renders 36 answer-free structure models on 12 pages",async function(){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.EE.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".answer-input").count(),36);assert.equal(await page.locator(".teacher-key,.teacher-move,.choice-button").count(),0);assert.equal(await page.locator("h1").innerText(),"6.EE.A 식의 구조와 동치식 단원 워크북");assert.equal(await page.locator(".eea-expression-model").count(),36);assert.match(await page.locator('[data-item-id="eeau-w04"] .eea-expression-model').innerText(),/4 × 4 × 4 = □/);
  const card=page.locator('[data-item-id="eeau-w16"]');await card.locator(".answer-input").fill("48");await card.locator(".check-button").click();assert.equal(await card.locator(".choice-feedback.wrong").count(),1);await card.locator(".answer-input").fill("47");await card.locator(".check-button").click();assert.equal(await card.locator(".choice-feedback.correct").count(),1);
  await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await context.close();
});

test("all 36 expression responses unlock only its eight-item recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.EE.A&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});for(const candidate of expressionSource.pack.workbookItems){const card=page.locator(`[data-item-id="${candidate.id}"]`);await card.locator(".answer-input").fill(expressionSource.formatResult(candidate));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.EE.A:v1");}),"complete-v1");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.EE.A:v1");}),null);await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.deepEqual(errors,[]);await context.close();
});

test("expression Chinese teacher guide separates all 36 answers",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.EE.A&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key").count(),36);assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);assert.equal(await page.locator("h1").innerText(),"6.EE.A 式子结构与等价式单元练习册");assert.match(await page.locator(".teacher-observation").innerText(),/区分项与因数/);await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await page.close();
});

test("equation student edition renders 36 answer-free models on 12 pages",async function(){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.EE.B&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".answer-input").count(),36);assert.equal(await page.locator(".teacher-key,.teacher-move,.choice-button").count(),0);assert.equal(await page.locator("h1").innerText(),"6.EE.B 방정식과 부등식 단원 워크북");assert.equal(await page.locator(".eeb-equation-model,.eeb-number-line").count(),36);assert.equal(await page.locator('[data-item-id="eebu-w25"] .eeb-number-line text').textContent(),"c");assert.equal(await page.locator('[data-item-id="eebu-w30"] .solution-ray').count(),0);
  const card=page.locator('[data-item-id="eebu-w20"]');await card.locator(".answer-input").fill("2");await card.locator(".check-button").click();assert.equal(await card.locator(".choice-feedback.wrong").count(),1);await card.locator(".answer-input").fill("3/2");await card.locator(".check-button").click();assert.equal(await card.locator(".choice-feedback.correct").count(),1);
  await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await context.close();
});

test("all 36 equation responses unlock only its eight-item recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.EE.B&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});for(const candidate of equationSource.pack.workbookItems){const card=page.locator(`[data-item-id="${candidate.id}"]`);await card.locator(".answer-input").fill(equationSource.formatResult(candidate));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.EE.B:v1");}),"complete-v1");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.EE.B:v1");}),null);await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.deepEqual(await page.locator(".practice-heading h2").allInnerTexts(),["New items · Eight-structure recheck","New items · Eight-structure recheck"]);assert.match(await page.locator('[data-item-id="eebu-r06"] .eeb-equation-model').innerText(),/p \+ 24 = 65/);assert.deepEqual(errors,[]);await context.close();
});

test("equation Chinese teacher guide separates all 36 answers and shows solution rays",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.EE.B&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key").count(),36);assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);assert.equal(await page.locator("h1").innerText(),"6.EE.B 方程与不等式单元练习册");assert.match(await page.locator(".teacher-observation").innerText(),/边界是否包含/);assert.ok(await page.locator(".solution-ray").count()>0);await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await page.close();
});

test("all 36 verified responses unlock only the separate recheck route",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.SP.A&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});
  assert.equal(await page.locator('[data-mode="recheck"]').isDisabled(),true);
  for(const item of workbookSource.pack.workbookItems){await page.locator(`[data-item-id="${item.id}"] [data-answer-id="${workbookSource.solveItem(item)}"]`).click();}
  assert.equal(await page.locator("#progress-chip").textContent(),"36 / 36");
  assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.SP.A:v1");}),"complete-v1");
  assert.equal(await page.locator('[data-mode="recheck"]').isEnabled(),true);
  await page.locator('[data-mode="recheck"]').click();
  assert.equal(await page.locator(".book-problem").count(),8);
  assert.equal(await page.locator("#progress-chip").textContent(),"0 / 8");
  assert.equal(new URL(page.url()).searchParams.get("mode"),"recheck");
  assert.equal(await page.locator(".teacher-key,.teacher-move").count(),0);
  assert.deepEqual(errors,[]);await context.close();
});

test("a fresh student cannot bypass the unit by opening the recheck URL",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.SP.A&mode=recheck&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});
  assert.equal(new URL(page.url()).searchParams.get("mode"),"workbook");
  assert.equal(await page.locator(".book-problem").count(),36);
  assert.equal(await page.locator('[data-mode="recheck"]').isDisabled(),true);
  assert.match(await page.locator('[data-mode="recheck"]').getAttribute("title"),/36문항을 모두 맞힌 뒤/);
  assert.deepEqual(errors,[]);await context.close();
});

test("teacher Chinese edition keeps the same 36 items and adds guidance without response feedback",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.SP.A&mode=workbook&audience=teacher&locale=zh-Hans&paper=A4`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".book-page").count(),20);
  assert.equal(await page.locator(".book-problem").count(),36);
  assert.equal(await page.locator(".teacher-key").count(),36);
  assert.equal(await page.locator(".teacher-move").count(),36);
  assert.equal(await page.locator(".choice-feedback,.record-page").count(),0);
  assert.equal(await page.locator('[data-audience="student"]').count(),0);
  assert.equal(await page.locator("#edition-label").innerText(),"教师版");
  assert.equal(await page.locator('[data-mode="recheck"]').isEnabled(),true);
  assert.match(await page.locator(".teacher-observation").innerText(),/自己提出一个需要收集数据来回答的调查问题/);
  await page.emulateMedia({media:"print"});
  const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});
  assert.deepEqual(overflow,[]);
  assert.deepEqual(errors,[]);await page.close();
});

test("curriculum-specific Grade 6 wording renders cleanly in every locale",async function(){
  for(const locale of ["ko","en","zh-Hans"]){
    const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
    await page.goto(`${baseUrl}?cluster=6.SP.A&mode=workbook&audience=student&locale=${locale}&paper=A4`,{waitUntil:"networkidle"});
    const visible=await page.locator("main").innerText();
    if(locale==="ko"){
      assert.match(visible,/6\.SP\.A 자료를 모아 답하는 질문과 자료의 분포/);
      assert.match(visible,/미국 6학년 수학에서는 이런 질문을 statistical question이라고 합니다/);
      assert.match(visible,/질문에 필요한 자료 찾기/);
      assert.match(visible,/이 질문에 답하려면 어떤 자료를 모아야 하나요\?/);
      assert.match(visible,/평균과 범위로 두 자료 비교하기/);
      assert.match(visible,/중심을 나타낼까, 퍼짐을 나타낼까/);
      assert.match(visible,/6\.SP\.B\.4-5로 이어지는 연결 연습/);
      assert.match(visible,/그래프 작성과 맥락 설명을 마쳤다는 증거로 사용하지 않습니다/);
      assert.doesNotMatch(visible,/통계적 질문|예상되는 변이|학생이나 관측마다 달라질 양|중심 측도와 변이 측도|6학년이라는 학년|지난 토요일이라는 날짜|4주라는 기간|이번 시즌이라는 기간|관찰한 14일/);
      assert.equal(await page.locator(".question-card").first().evaluate(function (node) { return getComputedStyle(node).wordBreak; }),"keep-all");
    }else if(locale==="en"){
      assert.match(visible,/US Grade 6 standards 6\.SP\.A\.1-3/);
      assert.match(visible,/bridge to 6\.SP\.B\.4-5/);
      assert.match(visible,/mean absolute deviation \(MAD\)/);
    }else{
      assert.match(visible,/6\.SP\.A 用数据回答的问题与数据分布/);
      assert.match(visible,/美国六年级数学标准6\.SP\.A\.1-3/);
      assert.match(visible,/衔接6\.SP\.B\.4-5/);
      assert.match(visible,/答案可能不同，需要收集数据的调查问题/);
      assert.match(visible,/这类问题称为 statistical question（统计问题）/);
      assert.match(visible,/我提出的调查问题/);
      assert.equal((visible.match(/统计问题/g) || []).length,1);
      assert.doesNotMatch(visible,/预期变异|我提出的统计问题|是否为统计问题/);
    }
    await page.emulateMedia({media:"print"});
    const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});
    assert.deepEqual(overflow,[]);
    assert.deepEqual(errors,[]);await page.close();
  }
});

test("mobile and A4 or Letter print layouts stay within their intended width",async function(){
  for(const width of [320,390]){const page=await browser.newPage({viewport:{width:width,height:844},isMobile:true});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.SP.A&mode=recheck&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});const dimensions=await page.evaluate(function(){return[document.documentElement.scrollWidth,document.documentElement.clientWidth];});assert.deepEqual(dimensions,[width,width]);assert.equal(await page.locator(".site-header nav").evaluate(function(node){return getComputedStyle(node).display;}),"none");assert.equal(await page.locator(".workbook-toolbar").evaluate(function(node){return getComputedStyle(node).position;}),"static");const targets=await page.locator("button,select,.brand").evaluateAll(function(nodes){return nodes.filter(function(node){return getComputedStyle(node).display!=="none";}).map(function(node){const box=node.getBoundingClientRect();return[box.width,box.height];});});targets.forEach(function(size){assert.ok(size[0]>=44);assert.ok(size[1]>=44);});assert.deepEqual(errors,[]);await page.close();}
  for(const paper of ["A4","Letter"]){const page=await browser.newPage({viewport:{width:794,height:1123}});await page.goto(`${baseUrl}?cluster=6.SP.A&mode=recheck&audience=student&locale=en&paper=${paper}`,{waitUntil:"networkidle"});await page.emulateMedia({media:"print"});const box=await page.locator(".book-page").first().evaluate(function(node){const style=getComputedStyle(node);return{width:parseFloat(style.width),height:parseFloat(style.height)};});if(paper==="A4"){assert.ok(box.width>790&&box.width<797);assert.ok(box.height>1121&&box.height<1124);}else{assert.ok(box.width>814&&box.width<818);assert.ok(box.height>1054&&box.height<1058);}const columns=await page.locator(".problem-list").first().evaluate(function(node){return getComputedStyle(node).gridTemplateColumns.split(" ").length;});assert.equal(columns,2);const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});assert.deepEqual(overflow,[],JSON.stringify(overflow));assert.match(await page.locator("#dynamic-page-size").textContent(),new RegExp("size: "+paper));assert.equal(await page.locator(".teacher-key").count(),0);await page.close();}
});

test("HTML workbook renders stacked fractions while slash input remains valid",async function(){
  const cases=[{locale:"ko",label:"8분의 5"},{locale:"en",label:"1 over 16"},{locale:"zh-Hans",label:"8分之5"}];
  for(const candidate of cases){
    const page=await browser.newPage({viewport:{width:1100,height:900}});const errors=errorsFor(page);
    await page.goto(`${baseUrl}?cluster=6.NS.A&mode=workbook&audience=student&locale=${candidate.locale}&paper=A4`,{waitUntil:"networkidle"});
    const fractionCard=page.locator('[data-item-id="nsa-w04"]'),prompt=fractionCard.locator(".problem-prompt");assert.equal(await prompt.locator("mfrac").count(),2);assert.equal(await prompt.locator("math").first().getAttribute("aria-label"),candidate.label);assert.equal(await fractionCard.locator(".problem-visual mfrac").count(),2);
    const answerCard=page.locator('[data-item-id="nsa-w18"]');await answerCard.locator(".answer-input").fill("6/5");await answerCard.locator(".check-button").click();assert.equal(await answerCard.locator(".choice-feedback.correct").count(),1);
    assert.deepEqual(errors,[]);await page.close();
  }
});

test("ratio, algebra, and geometry workbooks stay usable at 320px and 390px",async function(){
  for(const cluster of ["6.RP.A","6.NS.A","6.NS.B","6.NS.C","6.EE.A","6.EE.B","6.EE.C","6.G.A"]) for(const width of [320,390]){
    const page=await browser.newPage({viewport:{width:width,height:844},isMobile:true});
    const errors=errorsFor(page);
    await page.goto(`${baseUrl}?cluster=${cluster}&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});
    const dimensions=await page.evaluate(function(){return[document.documentElement.scrollWidth,document.documentElement.clientWidth];});
    assert.deepEqual(dimensions,[width,width]);
    assert.equal(await page.locator(".answer-input").count(),36);
    const targets=await page.locator("button,select,input,.brand").evaluateAll(function(nodes){return nodes.filter(function(node){return getComputedStyle(node).display!=="none";}).map(function(node){const box=node.getBoundingClientRect();return[box.width,box.height];});});
    targets.forEach(function(size){assert.ok(size[0]>=44);assert.ok(size[1]>=44);});
    assert.deepEqual(errors,[]);
    await page.close();
  }
});

test("variable-relationship student workbook renders 36 answer-free relation, table, and graph models",async function(){
  const context=await browser.newContext({viewport:{width:1280,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.EE.C&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".answer-input").count(),36);assert.equal(await page.locator(".teacher-key,.teacher-move,.choice-button").count(),0);assert.equal(await page.locator("h1").innerText(),"6.EE.C 변수 관계와 그래프 단원 워크북");assert.equal(await page.locator(".eec-variable-model,.eec-linear-model,.clinic-relation-table,.eec-coordinate-plane").count(),36);assert.equal(await page.locator(".eec-coordinate-plane").count(),12);
  const graph=page.locator('[data-item-id="eecu-w33"] .eec-coordinate-plane');assert.match(await graph.innerText(),/\(2, 8\)/);assert.doesNotMatch(await graph.innerText(),/\(0, 3\)/);
  await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await context.close();
});

test("all 36 variable-relationship responses unlock only its separate eight-item recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);await context.addInitScript(function(){localStorage.setItem("gfield-clinic-workbook:6.EE.C:v1","complete-v1");});
  await page.goto(`${baseUrl}?cluster=6.EE.C&mode=recheck&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});assert.equal(new URL(page.url()).searchParams.get("mode"),"workbook");
  for(const candidate of relationshipSource.pack.workbookItems){const card=page.locator(`[data-item-id="${candidate.id}"]`);await card.locator(".answer-input").fill(relationshipSource.formatResult(candidate));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.EE.C:v1");}),"complete-v1");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.EE.C:v1");}),"complete-v1");await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.deepEqual(await page.locator(".practice-heading h2").allInnerTexts(),["New items · Eight-structure recheck","New items · Eight-structure recheck"]);assert.equal(await page.locator(".teacher-key,.teacher-move").count(),0);assert.deepEqual(errors,[]);await context.close();
});

test("variable-relationship Chinese teacher guide separates all answers and retains calculated graphs",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.EE.C&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key").count(),36);assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);assert.equal(await page.locator("h1").innerText(),"6.EE.C 变量关系与图象单元练习册");assert.equal(await page.locator(".eec-coordinate-plane").count(),12);assert.match(await page.locator(".teacher-observation").innerText(),/情境中的作用/);await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await page.close();
});

test("geometry student workbook renders 36 calculated figures without teacher answers",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.G.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".answer-input").count(),36);assert.equal(await page.locator(".teacher-key,.teacher-move,.choice-button").count(),0);assert.equal(await page.locator("h1").innerText(),"6.G.A 기하 측정 단원 워크북");assert.equal(await page.locator(".clinic-geometry-svg").count(),36);
  const polygon=page.locator('[data-item-id="gau-w01"] .clinic-geometry-svg');assert.equal(await polygon.locator("polygon").count(),1);const coordinate=page.locator('[data-item-id="gau-w21"] .clinic-geometry-svg');assert.equal(await coordinate.locator("polygon").count(),1);
  await page.emulateMedia({media:"print"});const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(entry){return entry.scrollHeight>entry.clientHeight+1;});});assert.deepEqual(overflow,[]);assert.deepEqual(errors,[]);await page.close();
});

test("all 36 geometry responses unlock only the separate eight-structure recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);await context.addInitScript(function(){localStorage.setItem("gfield-clinic-workbook:6.G.A:v1","complete-v1");});
  await page.goto(`${baseUrl}?cluster=6.G.A&mode=recheck&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});assert.equal(new URL(page.url()).searchParams.get("mode"),"workbook");
  for(const candidate of geometrySource.pack.workbookItems){const card=page.locator(`[data-item-id="${candidate.id}"]`);await card.locator(".answer-input").fill(geometrySource.formatResult(candidate));await card.locator(".check-button").click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:6.G.A:v1");}),"complete-v1");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.G.A:v1");}),"complete-v1");await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.deepEqual(await page.locator(".practice-heading h2").allInnerTexts(),["New figures · Eight-structure recheck","New figures · Eight-structure recheck"]);assert.equal(await page.locator(".teacher-key,.teacher-move").count(),0);assert.deepEqual(errors,[]);await context.close();
});

test("geometry Chinese teacher guide separates all answers and printable figures",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.G.A&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key").count(),36);assert.equal(await page.locator(".answer-input,.print-answer-line,.record-page").count(),0);assert.equal(await page.locator("h1").innerText(),"6.G.A 几何测量单元练习册");assert.equal(await page.locator(".clinic-geometry-svg").count(),36);assert.match(await page.locator(".teacher-observation").innerText(),/作图/);await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);assert.deepEqual(errors,[]);await page.close();
});

test("Grade 7 proportionality student edition renders a 12-page 36-item answer-free workbook",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=7.RP.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});await page.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
  assert.equal(await page.locator(".book-page").count(),12);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".choice-button").count(),144);assert.equal(await page.locator(".choice-button > .choice-label").count(),144);assert.equal(await page.locator(".teacher-key,.teacher-move,.answer-input").count(),0);assert.equal(await page.locator(".book-cover .page-kicker").innerText(),"GFIELD MATH · US GRADE 7 · 7.RP.A.1-3");assert.equal(await page.locator("h1").innerText(),"7.RP.A 비례관계 단원 워크북");assert.equal(await page.locator(".g7rpa-rate-model,.g7rpa-table,.g7rpa-graph,.g7rpa-percent-flow").count(),36);
  const first=page.locator('[data-item-id="g7rpa-w01"]');await first.locator('[data-answer-id="A"]').click();assert.equal(await first.locator(".choice-feedback.wrong").count(),1);await first.locator('[data-answer-id="B"]').click();assert.equal(await first.locator(".choice-feedback.correct").count(),1);assert.equal(await page.locator("#progress-chip").innerText(),"1 / 36");
  await page.emulateMedia({media:"print"});const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(entry){return entry.scrollHeight>entry.clientHeight+1;});});assert.deepEqual(overflow,[]);assert.deepEqual(errors,[]);await page.close();
});

test("Grade 7 proportionality completion unlocks only its own recheck",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=7.RP.A&mode=recheck&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});assert.equal(new URL(page.url()).searchParams.get("mode"),"workbook");assert.equal(await page.locator('[data-mode="recheck"]').isDisabled(),true);
  for(const item of grade7RatioSource.pack.workbookItems){const card=page.locator(`[data-item-id="${item.id}"]`);await card.locator(`[data-answer-id="${grade7RatioSource.solveItem(item)}"]`).click();}
  assert.equal(await page.locator("#progress-chip").innerText(),"36 / 36");assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-unit-workbook:7.RP.A:v1");}),"complete-v1");assert.equal(await page.locator('[data-mode="recheck"]').isEnabled(),true);await page.locator('[data-mode="recheck"]').click();assert.equal(await page.locator(".book-problem").count(),8);assert.equal(await page.locator(".teacher-key,.teacher-move").count(),0);assert.deepEqual(errors,[]);await context.close();
});

test("Grade 7 proportionality Chinese teacher guide and mobile view keep the audience and layout boundary",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=7.RP.A&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".book-page").count(),20);assert.equal(await page.locator(".book-problem").count(),36);assert.equal(await page.locator(".teacher-key,.teacher-move").count(),72);assert.equal(await page.locator(".choice-button,.record-page").count(),0);assert.equal(await page.locator("h1").innerText(),"7.RP.A 正比例关系单元练习册");await page.emulateMedia({media:"print"});assert.equal(await page.locator(".book-page").evaluateAll(function(nodes){return nodes.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length;}),0);await page.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true});await mobile.goto(`${baseUrl}?cluster=7.RP.A&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});assert.deepEqual(await mobile.evaluate(function(){return[document.documentElement.scrollWidth,document.documentElement.clientWidth];}),[390,390]);assert.deepEqual(errors,[]);await mobile.close();
});
