#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {chromium}=require('./lib/playwright'),{serve}=require('./showreel/lib');
const source=fs.readFileSync(path.join(__dirname,'../app/main.js'),'utf8');
const helper=source.slice(source.indexOf('function numiDialogueHtml('),source.indexOf('function stepLabNumpad('));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx=vm.createContext({esc});vm.runInContext(helper,ctx);
const out=process.env.NM_DIALOGUE_ARTIFACTS;
const short='누미와 함께 8+7을 10+5로 펼쳐 봐요!';
const long='긴 설명은 읽기 편한 글씨로 남깁니다. '.repeat(8);
async function run(){
 if(out)fs.mkdirSync(out,{recursive:true});
 const {server,base}=await serve(),browser=await chromium.launch();
 try{
  for(const [band,lang,text,pen] of [['preschool','ko',short,true],['elementary','en','Let’s open 8+7 as 10+5!',true],
   ['preschool','zh','一起把8+7展开成10+5！',false],['secondary','ko',short,false],
   ['preschool','ko',long,false],['elementary','ko','수식 원문 \\frac{8}{7}은 그대로',false],
   ['preschool','ko','<img src=x> & "8+7"도 원문 그대로',true]]){
   const context=await browser.newContext({viewport:{width:390,height:844}});
   await context.route('**/*',r=>!r.request().url().startsWith(base)?r.abort():r.continue());
   await context.route('**/__numi-dialogue.html',r=>r.fulfill({contentType:'text/html',body:
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
    '<link rel="stylesheet" href="app/learning-stage.css"></head><body style="margin:0">'+
    `<main class="nm-unit-view" data-learning-band="${band}" lang="${lang}"><div class="nm-bubble">${ctx.numiDialogueHtml(text)}</div></main></body></html>`}));
   const page=await context.newPage();await page.goto(base+'/number_magic/__numi-dialogue.html');await page.evaluate(()=>document.fonts.ready);
   const result=await page.locator('.nm-bubble').evaluate(e=>{
    const speech=e.querySelector('.nm-numi-dialogue')||e;
    return {text:e.textContent,font:getComputedStyle(speech).fontFamily,
     figures:[...e.querySelectorAll('.nm-dialog-figure')].map(n=>({text:n.textContent,font:getComputedStyle(n).fontFamily})),
     overflow:document.documentElement.scrollWidth>innerWidth,images:e.querySelectorAll('img').length};
   });
   assert.equal(result.text,text,'original dialogue preserved');assert.equal(result.images,0,'escaped input');
   assert.equal(result.font.includes('NM Lesson Hand'),pen,'age/language/long-text font');
   assert(result.figures.every(f=>!f.font.includes('NM Lesson Hand')),'numbers/operators sans');assert.equal(result.overflow,false);
   if(pen){
    const cdp=await context.newCDPSession(page);await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root}=await cdp.send('DOM.getDocument');
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'.nm-numi-dialogue'});
    const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    assert(fonts.some(f=>f.familyName==='NM Lesson Hand'&&f.glyphCount>0),'actual handwriting glyphs');
    await cdp.detach();
   }
   if(out)await page.screenshot({path:path.join(out,`${band}-${lang}-${text.length}.png`)});
   await page.emulateMedia({media:'print'});
   assert(!(await page.locator('.nm-numi-dialogue,.nm-bubble').first().evaluate(e=>getComputedStyle(e).fontFamily)).includes('NM Lesson Hand'),'screen-only font');
   await context.close();console.log(`PASS — ${band}/${lang}, ${text.length} characters`);
  }
 }finally{await browser.close();server.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
