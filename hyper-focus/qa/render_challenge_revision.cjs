const fs=require('fs');
const path=require('path');
const http=require('http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'../..');
const out=path.join(root,'hyper-focus/output/qa/challenge-editions-separated');
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
  const name=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!name.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(name,(error,data)=>{if(error){res.writeHead(404).end();return;}
    res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css'})[path.extname(name)]||'application/octet-stream');res.end(data);});
});
async function audit(page){return page.evaluate(()=>{
  const problems=[];
  document.querySelectorAll('.exam-question').forEach(q=>{
    const box=q.getBoundingClientRect(),number=q.querySelector('.exam-question-no').textContent;
    if(q.scrollHeight>q.clientHeight+2)problems.push({number,kind:'overflow',height:q.clientHeight,scroll:q.scrollHeight});
    const answer=q.querySelector('.response-line').getBoundingClientRect();
    [...q.children].filter(e=>!e.matches('.response-line,.exam-question-no')).forEach(e=>{const r=e.getBoundingClientRect();if(r.bottom>answer.top-1)problems.push({number,kind:'answer-overlap',tag:e.tagName,bottom:r.bottom,answerTop:answer.top});});
    q.querySelectorAll('svg text').forEach(t=>{const r=t.getBoundingClientRect(),s=t.closest('svg').getBoundingClientRect();if(r.right>s.right+1||r.left<s.left-1||r.top<s.top-1||r.bottom>s.bottom+1)problems.push({number,kind:'svg-text-clipped',text:t.textContent});});
  });
  document.querySelectorAll('.solution-row').forEach(row=>{const r=row.getBoundingClientRect(),content=row.querySelector('div').getBoundingClientRect();if(content.bottom>r.bottom+1)problems.push({kind:'solution-overflow',number:row.querySelector('b').textContent});});
  const allPages=[...document.querySelectorAll('.exam-page')],answerCoverPage=allPages.indexOf(document.querySelector('.answer-cover-page'))+1;
  if(!answerCoverPage||answerCoverPage%2!==1)problems.push({kind:'answer-cover-not-odd',answerCoverPage});
  return {width:innerWidth,bodyWidth:document.body.scrollWidth,questions:document.querySelectorAll('.exam-question').length,mainQuestions:document.querySelectorAll('.problem-page:not(.supplement-page) .exam-question').length,extraQuestions:document.querySelectorAll('.supplement-page .exam-question').length,answers:document.querySelectorAll('.answer-row').length,answerCoverPage,blankChildren:document.querySelector('.blank-page')?.childElementCount||0,problems};
});}
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true});
  const page=await browser.newPage({viewport:{width:1200,height:1000},deviceScaleFactor:1});
  const report=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
  try{
    await page.goto(`http://127.0.0.1:${server.address().port}/hyper-focus/challenge/exam.html?seed=62001&teacherPreview=1`);
    await page.waitForSelector('.exam-question');
    await page.evaluate(()=>document.fonts.ready);
    const rounds=process.env.CHALLENGE_RENDER_ROUND?process.env.CHALLENGE_RENDER_ROUND.split(',').map(Number):[1,2,3,4];
    if(rounds.some(round=>![1,2,3,4].includes(round)))throw new Error('Invalid challenge round');
    for(const round of rounds){
      await page.selectOption('#round',String(round),{force:true});await page.emulateMedia({media:'print'});
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>img.decode()));});
      report.push({round,mode:'A4',...await audit(page)});
      const target=path.join(root,`hyper-focus/challenge/output/pdf/challenge-mock-review-round${round}.pdf`);
      await page.pdf({path:target,format:'A4',printBackground:true,preferCSSPageSize:true});
      const printModes=await page.evaluate(()=>{
        const visible=e=>getComputedStyle(e).display!=='none';
        document.body.dataset.print='exam';const studentHasAnswers=[...document.querySelectorAll('.answer-page')].some(visible);
        document.body.dataset.print='answers';const first=[...document.querySelectorAll('.exam-page')].find(visible),answersStartWithCover=first?.classList.contains('answer-cover-page');
        delete document.body.dataset.print;return {studentHasAnswers,answersStartWithCover};
      });
      if(printModes.studentHasAnswers||!printModes.answersStartWithCover)errors.push('print mode separation failed round '+round);
      for(let index=0;index<await page.locator('.exam-page').count();index++)await page.locator('.exam-page').nth(index).screenshot({path:path.join(out,`round${round}-page${index+1}.png`)});
      await page.emulateMedia({media:'screen'});await page.setViewportSize({width:390,height:844});
      report.push({round,mode:'mobile390',...await audit(page)});
      await page.locator('.problem-page').nth(2).screenshot({path:path.join(out,`round${round}-mobile390.png`)});
      await page.setViewportSize({width:1200,height:1000});
    }
    fs.writeFileSync(path.join(out,'layout-report.json'),JSON.stringify({errors,report},null,2));
    console.log(JSON.stringify({errors,report},null,2));
    if(errors.length||report.some(r=>r.problems.length||r.bodyWidth>r.width))throw new Error('Challenge layout audit failed');
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
