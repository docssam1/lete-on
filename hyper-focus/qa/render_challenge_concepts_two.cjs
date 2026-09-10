'use strict';
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'hyper-focus/output/qa/challenge-concepts-two'),challenge=path.join(root,'hyper-focus/challenge');
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
 const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,bytes)=>{
  if(error){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.html':'text/html','.png':'image/png','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');
  res.end(bytes);
 });
});

(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch();
 const page=await browser.newPage({viewport:{width:1100,height:1200},deviceScaleFactor:2});
 const errors=[];
 const base='http://127.0.0.1:'+server.address().port+'/hyper-focus/challenge/';
 page.on('pageerror',error=>errors.push('pageerror '+error.message));
 page.on('response',response=>{if(response.status()>=400)errors.push(response.status()+' '+response.url());});
 try{
  await page.goto(base+'concepts.html?teacherPreview=1',{waitUntil:'networkidle'});
  try{await page.waitForFunction(()=>window.HFConceptBook?.counts?.length===2,{timeout:60000});}catch(error){console.error(JSON.stringify({loadErrors:errors},null,2));throw error;}
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
  const audits=[];
  for(const round of [1,2]){
   await page.emulateMedia({media:'screen'});
   await page.selectOption('#round',String(round));
   await page.selectOption('#unit','all');
   await page.emulateMedia({media:'print'});
   const audit=await page.evaluate(()=>{
    const pages=[...document.querySelectorAll('.concept-page')].filter(node=>getComputedStyle(node).display!=='none');
    const issues=[];
    for(const [index,node] of pages.entries()){
     const footer=node.querySelector('.foot'),pageBox=node.getBoundingClientRect();
     if(node.scrollHeight>node.clientHeight+2)issues.push({page:index+1,kind:'page-overflow'});
     if(!node.classList.contains('book-blank')&&!footer)issues.push({page:index+1,kind:'missing-footer'});
     const footerTop=footer?footer.getBoundingClientRect().top:pageBox.bottom;
     for(const element of node.querySelectorAll('.problem,.solution-row,.question-text,.workspace,.question-art,.answer-visual,.cover-frame,.toc,.response')){
      const box=element.getBoundingClientRect();
      if(box.bottom>footerTop-3||box.right>pageBox.right-15||box.left<pageBox.left)issues.push({page:index+1,kind:'bounds',class:element.className});
      if(element.matches('.workspace,.solution-row')&&element.scrollHeight>element.clientHeight+3)issues.push({page:index+1,kind:'content-overflow',class:element.className});
     }
    }
    const answerCover=pages.findIndex(node=>node.classList.contains('answer-cover'))+1;
    const student=pages.filter(node=>node.classList.contains('lesson'));
    return {
     round:Number(document.getElementById('round').value),pages:pages.length,answerCover,
     behaviorPages:student.filter(node=>node.classList.contains('behavior-page')).length,
     reviewPages:student.filter(node=>node.classList.contains('review-page')).length,
     questions:student.reduce((sum,node)=>sum+node.querySelectorAll('.problem').length,0),
     responseFields:student.reduce((sum,node)=>sum+node.querySelectorAll('.response').length,0),
     answerRows:pages.reduce((sum,node)=>sum+node.querySelectorAll('.solution-row').length,0),
     inlineAnswers:student.some(node=>node.querySelector('.solution-row,.answer-visual,.worked,.more-answer')),
     genericHintBands:student.reduce((sum,node)=>sum+node.querySelectorAll('.concept-note,.contents-note,.hint-summary').length,0),issues
    };
   });
   audits.push(audit);
   await page.pdf({path:path.join(challenge,'output/pdf/challenge-concepts-round'+round+'.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true});
   const samples=round===1?[1,6]:[3,5,7];
   for(const chapter of samples)await page.locator(`#r${round}-chapter-${chapter}`).screenshot({path:path.join(out,`round${round}-chapter${chapter}.png`)});
   await page.locator(`.answer-cover[data-round="${round}"]`).screenshot({path:path.join(out,`round${round}-answer-cover.png`)});
  }

  await page.emulateMedia({media:'screen'});
  await page.setViewportSize({width:390,height:844});
  await page.selectOption('#round','1');
  await page.selectOption('#unit','6');
  await page.screenshot({path:path.join(out,'mobile390.png'),fullPage:true});
  const mobile=await page.evaluate(()=>({width:innerWidth,bodyWidth:document.body.scrollWidth,visibleLessonPages:[...document.querySelectorAll('.lesson')].filter(node=>getComputedStyle(node).display!=='none').length,inlineAnswers:!!document.querySelector('.lesson .solution-row,.lesson .answer-visual,.lesson .worked')}));
  await page.selectOption('#unit','all');
  await page.check('#answers');
  const answerToggle=await page.locator('.answer-cover[data-round="1"]').isVisible();
  const result={audits,errors,mobile,answerToggle};
  fs.writeFileSync(path.join(out,'layout-report.json'),JSON.stringify(result,null,2));
  console.log(JSON.stringify(result,null,2));
  assert.equal(errors.length,0);
  for(const audit of audits){
   const behaviorCount=audit.round===1?40:39;
   const expectedPages=83;
   const expectedAnswerCover=63;
   assert.equal(audit.issues.length,0);assert.equal(audit.pages,expectedPages);assert.equal(audit.answerCover,expectedAnswerCover);assert.equal(audit.answerCover%2,1);
   assert.equal(audit.behaviorPages,behaviorCount);assert.equal(audit.reviewPages,20);assert.equal(audit.questions,behaviorCount*3);assert.equal(audit.responseFields,behaviorCount*3);assert.equal(audit.answerRows,behaviorCount*3);
   assert.equal(audit.inlineAnswers,false);assert.equal(audit.genericHintBands,0);
  }
  assert(mobile.bodyWidth<=390);assert.equal(mobile.visibleLessonPages,5);assert.equal(mobile.inlineAnswers,false);assert(answerToggle);
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
