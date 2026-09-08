"use strict";
const fs=require("node:fs");
const http=require("node:http");
const path=require("node:path");
const {chromium}=require("playwright");
const siteRoot=path.resolve(__dirname,"..","..");
const outputDir=process.env.GFIELD_SCREEN_QA_OUTPUT_DIR;
if(!outputDir)throw new Error("GFIELD_SCREEN_QA_OUTPUT_DIR is required");
fs.mkdirSync(outputDir,{recursive:true});
function type(file){if(file.endsWith(".html"))return"text/html; charset=utf-8";if(file.endsWith(".css"))return"text/css; charset=utf-8";if(file.endsWith(".js"))return"text/javascript; charset=utf-8";return"application/octet-stream";}
const server=http.createServer(function(request,response){const file=path.resolve(siteRoot,"."+decodeURIComponent(request.url.split("?")[0]));if(!file.startsWith(siteRoot)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){response.writeHead(404);response.end("Not found");return;}response.writeHead(200,{"content-type":type(file)});fs.createReadStream(file).pipe(response);});
function errorsFor(page){const errors=[];page.on("pageerror",function(error){errors.push(error.message);});page.on("console",function(message){if(message.type()==="error")errors.push(message.text());});return errors;}
(async function(){
  await new Promise(function(resolve){server.listen(0,"127.0.0.1",resolve);});
  const baseUrl="http://127.0.0.1:"+server.address().port+"/boarding-school-math/unit-workbook.html";
  const browser=await chromium.launch({headless:true});
  let result;
  try{
    const student=await browser.newPage({viewport:{width:1440,height:1000}}),studentErrors=errorsFor(student);
    await student.goto(baseUrl+"?cluster=6.EE.B&mode=workbook&audience=student&locale=ko&paper=A4",{waitUntil:"networkidle"});
    await student.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
    for(const index of [2,5,8,11])await student.locator(".book-page").nth(index).screenshot({path:path.join(outputDir,"student-page-"+String(index+1).padStart(2,"0")+".png")});
    const studentAudit=await student.evaluate(function(){const pages=[...document.querySelectorAll(".book-page")];return{pages:pages.length,items:document.querySelectorAll(".book-problem").length,inputs:document.querySelectorAll(".answer-input").length,teacherBlocks:document.querySelectorAll(".teacher-key,.teacher-move").length,answerRays:document.querySelectorAll(".solution-ray").length,overflow:pages.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length};});
    const teacher=await browser.newPage({viewport:{width:1440,height:1000}}),teacherErrors=errorsFor(teacher);
    await teacher.goto(baseUrl+"?cluster=6.EE.B&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter",{waitUntil:"networkidle"});
    await teacher.waitForFunction(function(){return document.getElementById("print-book").dataset.ready==="true";});
    await teacher.locator(".book-page").nth(19).screenshot({path:path.join(outputDir,"teacher-page-20.png")});
    const teacherAudit=await teacher.evaluate(function(){const pages=[...document.querySelectorAll(".book-page")];return{pages:pages.length,items:document.querySelectorAll(".book-problem").length,keys:document.querySelectorAll(".teacher-key").length,inputs:document.querySelectorAll(".answer-input,.print-answer-line").length,answerRays:document.querySelectorAll(".solution-ray").length,overflow:pages.filter(function(node){return node.scrollHeight>node.clientHeight+1;}).length};});
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true}),mobileErrors=errorsFor(mobile);
    await mobile.goto(baseUrl+"?cluster=6.EE.B&mode=workbook&audience=student&locale=en&paper=A4",{waitUntil:"networkidle"});
    await mobile.screenshot({path:path.join(outputDir,"student-mobile-390.png"),fullPage:true});
    const mobileAudit=await mobile.evaluate(function(){return{viewport:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,items:document.querySelectorAll(".book-problem").length};});
    result={outputDir:outputDir,student:studentAudit,teacher:teacherAudit,mobile:mobileAudit,errors:studentErrors.concat(teacherErrors,mobileErrors)};
    if(studentAudit.pages!==12||studentAudit.items!==36||studentAudit.inputs!==36||studentAudit.teacherBlocks!==0||studentAudit.answerRays!==0||studentAudit.overflow!==0)throw new Error("EEB_STUDENT_SCREEN_AUDIT_FAILED");
    if(teacherAudit.pages!==20||teacherAudit.items!==36||teacherAudit.keys!==36||teacherAudit.inputs!==0||teacherAudit.answerRays<1||teacherAudit.overflow!==0)throw new Error("EEB_TEACHER_SCREEN_AUDIT_FAILED");
    if(mobileAudit.viewport!==390||mobileAudit.scrollWidth!==390||mobileAudit.items!==36)throw new Error("EEB_MOBILE_SCREEN_AUDIT_FAILED");
    if(result.errors.length)throw new Error("EEB_SCREEN_BROWSER_ERRORS_"+result.errors.join(" | "));
  }finally{await browser.close();await new Promise(function(resolve){server.close(resolve);});}
  process.stdout.write(JSON.stringify(result,null,2)+"\n");
})().catch(function(error){console.error(error);process.exitCode=1;});
