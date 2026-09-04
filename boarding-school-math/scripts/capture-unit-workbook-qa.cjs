"use strict";

const http=require("node:http");
const fs=require("node:fs");
const path=require("node:path");
const {chromium}=require("playwright");
const repoRoot=path.resolve(__dirname,"..","..");
const outputRoot=path.join(repoRoot,"tmp","unit-workbook-qa","6-sp-a");
fs.mkdirSync(outputRoot,{recursive:true});
function type(file){if(file.endsWith(".html"))return"text/html; charset=utf-8";if(file.endsWith(".css"))return"text/css; charset=utf-8";if(file.endsWith(".js"))return"text/javascript; charset=utf-8";return"application/octet-stream";}
(async function(){
  const server=http.createServer(function(request,response){const file=path.resolve(repoRoot,"."+decodeURIComponent(request.url.split("?")[0]));if(!file.startsWith(repoRoot)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){response.writeHead(404);response.end("Not found");return;}response.writeHead(200,{"content-type":type(file)});fs.createReadStream(file).pipe(response);});
  await new Promise(function(resolve){server.listen(0,"127.0.0.1",resolve);});
  const base=`http://127.0.0.1:${server.address().port}/boarding-school-math/unit-workbook.html`;
  const browser=await chromium.launch({headless:true});
  const errors=[];
  try{
    const desktop=await browser.newPage({viewport:{width:1440,height:1000}});desktop.on("pageerror",function(error){errors.push(error.message);});
    await desktop.goto(`${base}?cluster=6.SP.A&mode=workbook&audience=student&locale=ko&paper=A4`,{waitUntil:"networkidle"});
    await desktop.locator(".book-page").nth(0).screenshot({path:path.join(outputRoot,"student-cover-a4.png")});
    await desktop.locator(".book-page").nth(2).screenshot({path:path.join(outputRoot,"student-practice-a4.png")});
    await desktop.pdf({path:path.join(outputRoot,"grade6-sp-a-student-a4.pdf"),printBackground:true,preferCSSPageSize:true});
    const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true});mobile.on("pageerror",function(error){errors.push(error.message);});
    await mobile.goto(`${base}?cluster=6.SP.A&mode=recheck&audience=student&locale=en&paper=A4`,{waitUntil:"networkidle"});
    await mobile.screenshot({path:path.join(outputRoot,"student-recheck-mobile.png"),fullPage:true});
    const teacher=await browser.newPage({viewport:{width:1440,height:1000}});teacher.on("pageerror",function(error){errors.push(error.message);});
    await teacher.goto(`${base}?cluster=6.SP.A&mode=workbook&audience=teacher&locale=zh-Hans&paper=Letter`,{waitUntil:"networkidle"});
    await teacher.locator(".book-page").nth(2).screenshot({path:path.join(outputRoot,"teacher-practice-letter-zh.png")});
    await teacher.pdf({path:path.join(outputRoot,"grade6-sp-a-teacher-letter-zh.pdf"),printBackground:true,preferCSSPageSize:true});
    if(errors.length)throw new Error("UNIT_WORKBOOK_QA_BROWSER_ERRORS: "+errors.join(" | "));
    process.stdout.write(JSON.stringify({outputRoot:outputRoot,studentPdf:path.join(outputRoot,"grade6-sp-a-student-a4.pdf"),teacherPdf:path.join(outputRoot,"grade6-sp-a-teacher-letter-zh.pdf")}));
  }finally{await browser.close();await new Promise(function(resolve){server.close(resolve);});}
})().catch(function(error){console.error(error);process.exitCode=1;});
