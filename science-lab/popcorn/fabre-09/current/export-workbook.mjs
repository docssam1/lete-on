// Export the same authored pages used by the browser workbook. No learner data is read.
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
const {chromium}=await import(process.env.SCIENCE_PLAYWRIGHT||'playwright');
const base=process.env.PILOT_URL||'http://127.0.0.1:39247/science-lab/popcorn/fabre-09/current/';
const out=process.env.PILOT_PDF_OUT||fileURLToPath(new URL('./docs/',import.meta.url));
await mkdir(out,{recursive:true});
const browser=await chromium.launch();
const report=[];
try{
  for(const [name,query,count] of [['student-workbook','',8],['teacher-guide','?teacher=1',3]]){
    const page=await browser.newPage({viewport:{width:1200,height:1000}});
    const errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('response',response=>{if(response.status()>=400)errors.push(`${response.status()} ${response.url()}`);});
    await page.goto(new URL('workbook.html'+query,base).href,{waitUntil:'networkidle'});
    await page.waitForFunction(expected=>document.querySelectorAll('.workbook-page').length===expected,count);
    await page.waitForFunction(()=>document.querySelector('[data-workbook-ready="true"]'));
    await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.querySelectorAll('img')].map(image=>image.decode()));});
    await page.emulateMedia({media:'print'});
    await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
    await page.evaluate(()=>Promise.all([...document.querySelectorAll('.workbook-print-root img')].map(image=>image.decode())));
    const layout=await page.locator('.workbook-print-root .workbook-page').evaluateAll(pages=>pages.map(p=>({page:p.dataset.page,width:p.getBoundingClientRect().width,height:p.getBoundingClientRect().height,scrollHeight:p.scrollHeight,clientHeight:p.clientHeight,title:p.querySelector('h2')?.textContent})));
    if(errors.length)throw new Error(errors.join('\n'));
    await page.pdf({path:join(out,name+'.pdf'),format:'A4',printBackground:true,preferCSSPageSize:true,tagged:true});
    report.push({name,expectedPages:count,layout,errors});
    await page.close();
  }
  if(process.env.PILOT_SHOTS){await mkdir(process.env.PILOT_SHOTS,{recursive:true});await writeFile(join(process.env.PILOT_SHOTS,'workbook-pdf-layout.json'),JSON.stringify(report,null,2));}
  console.log(JSON.stringify(report,null,2));
}finally{await browser.close();}
