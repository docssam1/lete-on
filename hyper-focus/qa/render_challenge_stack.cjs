const fs=require('fs'),path=require('path'),{chromium}=require('playwright');
const {draw}=require('./render_challenge_more.cjs');
const q=require('../challenge/exam-more.js').all[4].main[11];
(async()=>{const browser=await chromium.launch(),page=await browser.newPage();try{const data=await page.evaluate(draw,{v:q.visual,answer:false});const output=path.resolve(__dirname,'../challenge/assets/more',q.id+'.png');fs.writeFileSync(output,Buffer.from(data.split(',')[1],'base64'));console.log(JSON.stringify({output}));}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
