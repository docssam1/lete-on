"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const workbookSource=require("../learning/grade6-sp-a-unit-workbook.js");
const root=path.resolve(__dirname,"..","..");
let server,browser,baseUrl;
function type(file){if(file.endsWith(".html"))return"text/html; charset=utf-8";if(file.endsWith(".css"))return"text/css; charset=utf-8";if(file.endsWith(".js"))return"text/javascript; charset=utf-8";return"application/octet-stream";}
function errorsFor(page){const errors=[];page.on("pageerror",function(error){errors.push(error.message);});page.on("console",function(message){if(message.type()==="error")errors.push(message.text());});return errors;}
test.before(async function(){server=http.createServer(function(request,response){const file=path.resolve(root,"."+decodeURIComponent(request.url.split("?")[0]));if(!file.startsWith(root)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){response.writeHead(404);response.end("Not found");return;}response.writeHead(200,{"content-type":type(file)});fs.createReadStream(file).pipe(response);});await new Promise(function(resolve){server.listen(0,"127.0.0.1",resolve);});baseUrl=`http://127.0.0.1:${server.address().port}/boarding-school-math/unit-workbook.html`;browser=await chromium.launch({headless:true});});
test.after(async function(){if(browser)await browser.close();if(server)await new Promise(function(resolve){server.close(resolve);});});

test("student edition renders a 12-page, 36-item answer-free book",async function(){
  const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.SP.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});
  assert.equal(await page.locator(".book-page").count(),12);
  assert.equal(await page.locator(".book-problem").count(),36);
  assert.equal(await page.locator(".concept-card").count(),2);
  assert.equal(await page.locator(".teacher-key,.teacher-move").count(),0);
  assert.equal(await page.locator(".record-page").count(),1);
  const first=page.locator('[data-item-id="spa-w01"]');
  await first.locator('[data-answer-id="N"]').click();assert.equal(await first.locator(".choice-feedback.wrong").count(),1);
  await first.locator('[data-answer-id="S"]').click();assert.equal(await first.locator(".choice-feedback.correct").count(),1);
  assert.equal(await page.locator("#progress-chip").textContent(),"1 / 36");
  await page.emulateMedia({media:"print"});
  const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});
  assert.deepEqual(overflow,[]);
  assert.deepEqual(errors,[]);await page.close();
});

test("all 36 verified responses unlock only the separate recheck route",async function(){
  const context=await browser.newContext({viewport:{width:1180,height:900}});const page=await context.newPage();const errors=errorsFor(page);
  await page.goto(`${baseUrl}?cluster=6.SP.A&mode=workbook&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});
  for(const item of workbookSource.pack.workbookItems){await page.locator(`[data-item-id="${item.id}"] [data-answer-id="${workbookSource.solveItem(item)}"]`).click();}
  assert.equal(await page.locator("#progress-chip").textContent(),"36 / 36");
  assert.equal(await page.evaluate(function(){return localStorage.getItem("gfield-clinic-workbook:6.SP.A:v1");}),"complete-v1");
  assert.equal(await page.locator(".teacher-key,.teacher-move").count(),0);
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
  assert.match(await page.locator(".teacher-observation").innerText(),/自己提出一个统计问题/);
  await page.emulateMedia({media:"print"});
  const overflow=await page.locator(".book-page").evaluateAll(function(nodes){return nodes.map(function(node,index){return{page:index+1,clientHeight:node.clientHeight,scrollHeight:node.scrollHeight};}).filter(function(result){return result.scrollHeight>result.clientHeight+1;});});
  assert.deepEqual(overflow,[]);
  assert.deepEqual(errors,[]);await page.close();
});

test("mobile and A4 or Letter print layouts stay within their intended width",async function(){
  for(const width of [320,390]){const page=await browser.newPage({viewport:{width:width,height:844},isMobile:true});const errors=errorsFor(page);await page.goto(`${baseUrl}?cluster=6.SP.A&mode=recheck&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});const dimensions=await page.evaluate(function(){return[document.documentElement.scrollWidth,document.documentElement.clientWidth];});assert.deepEqual(dimensions,[width,width]);const targets=await page.locator("button,select,.brand").evaluateAll(function(nodes){return nodes.filter(function(node){return getComputedStyle(node).display!=="none";}).map(function(node){const box=node.getBoundingClientRect();return[box.width,box.height];});});targets.forEach(function(size){assert.ok(size[0]>=44);assert.ok(size[1]>=44);});assert.deepEqual(errors,[]);await page.close();}
  for(const paper of ["A4","Letter"]){const page=await browser.newPage({viewport:{width:1000,height:1200}});await page.goto(`${baseUrl}?cluster=6.SP.A&mode=recheck&audience=student&locale=en&paper=${paper}`,{waitUntil:"networkidle"});await page.emulateMedia({media:"print"});const box=await page.locator(".book-page").first().evaluate(function(node){const style=getComputedStyle(node);return{width:parseFloat(style.width),height:parseFloat(style.height)};});if(paper==="A4"){assert.ok(box.width>790&&box.width<797);assert.ok(box.height>1115&&box.height<1122);}else{assert.ok(box.width>813&&box.width<820);assert.ok(box.height>1046&&box.height<1054);}assert.match(await page.locator("#dynamic-page-size").textContent(),new RegExp("size: "+paper));assert.equal(await page.locator(".teacher-key").count(),0);await page.close();}
});
