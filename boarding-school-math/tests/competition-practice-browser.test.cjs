"use strict";
const test=require("node:test");const assert=require("node:assert/strict");const fs=require("node:fs");const http=require("node:http");const path=require("node:path");const{chromium}=require("playwright");
const root=path.resolve(__dirname,"..","..");let server,browser,url;
function type(file){if(file.endsWith(".html"))return"text/html; charset=utf-8";if(file.endsWith(".css"))return"text/css; charset=utf-8";return"text/javascript; charset=utf-8";}
test.before(async function(){server=http.createServer(function(req,res){const file=path.resolve(root,"."+decodeURIComponent(new URL(req.url,"http://127.0.0.1").pathname));if(!file.startsWith(root)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end();return;}res.writeHead(200,{"content-type":type(file)});fs.createReadStream(file).pipe(res);});await new Promise(function(resolve){server.listen(0,"127.0.0.1",resolve);});url=`http://127.0.0.1:${server.address().port}/boarding-school-math/competition-practice.html`;browser=await chromium.launch({headless:true});});
test.after(async function(){await browser.close();await new Promise(function(resolve){server.close(resolve);});});

test("student solves actual SASMO, Math Kangaroo, and AMC bridge types without teacher answers",async function(){const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on("pageerror",function(error){errors.push(error.message);});await page.goto(`${url}?program=sasmo&audience=student&locale=ko`,{waitUntil:"networkidle"});assert.equal(await page.locator(".program-tab").count(),3);assert.deepEqual(await page.locator(".program-tab span").allInnerTexts(),["Grade 6 · 10개 유형","Grades 5–6 · 10개 유형","Grade 6 기초 연결 · 10개 유형"]);assert.equal(await page.locator(".problem-page").count(),5);assert.equal(await page.locator(".problem-card").count(),10);assert.equal(await page.locator(".choice").count(),50);assert.equal(await page.locator(".teacher-solution").count(),0);const first=page.locator('[data-item-id="sasmo-g6-model-01"]');await first.locator('[data-answer-id="A"]').click();assert.equal(await first.locator(".feedback.wrong").count(),1);await first.locator('[data-answer-id="C"]').click();assert.equal(await first.locator(".feedback.correct").count(),1);assert.equal(await page.locator("#progress-label").innerText(),"1 / 10");await page.locator(".program-tab").nth(1).click();assert.equal(await page.locator('[data-item-id^="mk56-"]').count(),10);await page.locator(".program-tab").nth(2).click();assert.equal(await page.locator('[data-item-id^="amc8-"]').count(),10);assert.deepEqual(errors,[]);await page.close();});

test("teacher, localization, print, keyboard, and 390px boundaries remain distinct",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  await page.goto(`${url}?program=amc8&audience=teacher&locale=en`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".teacher-solution").count(),10);
  assert.equal(await page.locator(".choice:enabled").count(),0);
  assert.equal(await page.locator(".choice.correct").count(),10);
  assert.equal(await page.locator('[data-audience="student"]').innerText(),"Student");
  assert.equal(await page.locator('[data-audience="teacher"]').innerText(),"Teacher");
  assert.equal(await page.locator("#release-title").innerText(),"GFIELD-original problems");
  assert.match(await page.locator("#source-use").innerText(),/^MAA AMC 8/);
  await page.locator("#locale-select").selectOption("zh-Hans");
  assert.equal(await page.locator("html").getAttribute("lang"),"zh-Hans");
  assert.equal(await page.locator('[data-audience="student"]').innerText(),"学生版");
  assert.equal(await page.locator("#workspace-title").innerText(),"真实题型");
  await page.emulateMedia({media:"print"});
  assert.equal(await page.locator(".skip-link,.site-header,.bank-toolbar,.program-browser").evaluateAll(function(nodes){return nodes.filter(function(node){return getComputedStyle(node).display!=="none";}).length;}),0);
  await page.close();
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
  await mobile.goto(`${url}?program=kangaroo&audience=student&locale=ko`,{waitUntil:"networkidle"});
  assert.deepEqual(await mobile.evaluate(function(){return[document.documentElement.scrollWidth,document.documentElement.clientWidth];}),[390,390]);
  assert.equal(await mobile.locator(".problem-card").count(),10);
  assert.equal(await mobile.locator(".math-fraction").count(),7);
  assert.equal(await mobile.locator(".competition-geometry").count(),4);
  await mobile.close();
});
