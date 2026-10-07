// Rendered pilot regression. Run against a local static server; browser dependency is external.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.SCIENCE_PLAYWRIGHT||'playwright');
const base=process.env.PILOT_URL||'http://127.0.0.1:39246/science-lab/popcorn/fabre-09/current/';
const out=process.env.PILOT_SHOTS; if(out)await mkdir(out,{recursive:true});
const browser=await chromium.launch({args:process.env.PILOT_GPU==='hardware'?[]:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
let count=0;const notes=[],errors=[];const ok=(v,label)=>{assert.ok(v,label);count++;notes.push(label);console.log("PASS",label);};
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.addInitScript(()=>{globalThis.SL_QUALITY='low';});
 page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
 await page.goto(base,{waitUntil:'networkidle'});
 const snap=async name=>{if(process.env.PILOT_CAPTURE==='0')return;await page.waitForTimeout(120);if(out)await page.screenshot({path:out+'/'+name+'.png'});};
 ok(await page.locator('[data-start]').count()===3,'three clear entry modes');
 ok(await page.locator('.avatar-menu').count()===0,'fixed character, no avatar selection');
 await snap('home');await page.locator('[data-start=self]').click();
 ok(await page.locator('[data-action=next]').isDisabled(),'learner action required, no timed advance');
 await page.locator('[data-action=confirm]').click();await page.locator('[data-action=next]').click();
 ok(await page.locator('[data-action=next]').isDisabled(),'safety confirmation required');
 for(const c of await page.locator('[data-safe]').all())await c.check();
 await page.locator('[data-action=next]').click();await page.locator('[data-predict]').first().click();await page.locator('[data-action=next]').click();
 for(const mode of ['one','series','parallel']){await page.locator(`[data-compare=${mode}]`).click();await page.locator('[data-action=observe]').click();}
 await page.locator('[data-cell="1"]').uncheck();
 ok((await page.locator('#reading').textContent()).includes('1.5 V'),'parallel remaining cell keeps voltage');
 await page.locator('[data-action=observe]').click();await snap('parallel');
 await page.locator('[data-compare=series]').click();await page.locator('[data-cell="1"]').uncheck();
 ok((await page.locator('#reading').textContent()).includes('꺼짐'),'series cell removal opens circuit');
 ok(await page.locator('[data-action=next]').isDisabled(),'both series and parallel removal observations are required');
 await page.locator('[data-action=observe]').click();
 await page.locator('[data-action=next]').click();
 for(let index=4;index<=13;index++){
   if([4,8,12,13].includes(index))await snap('assembly-'+index);
   await page.locator('[data-action=confirm][data-kind=screen]').click();await page.locator('[data-action=next]').click();
 }
 for(const [p,v] of [['off','0 V'],['low','1.5 V'],['high','3 V']]){await page.locator(`[data-position=${p}]`).click();ok((await page.locator('#reading').textContent()).includes(v),'switch '+p+' voltage');}
 await snap('stand-on');await page.locator('[data-action=help]').click();await page.locator('[data-helper="3"]').click();
 ok(await page.locator('[data-position=high]').isDisabled(),'hot battery stops experiment');
 await page.locator('[data-close]').click();ok(await page.locator('[data-action=next]').isDisabled(),'closing warning does not clear stop');
 await page.locator('[data-action=help]').click();await page.locator('[data-helper="3"]').click();await page.locator('[data-help-done]').click();
 await page.locator('[data-action=next]').click();
 for(const [p,v] of [['off','off'],['low','dim'],['high','bright']])await page.locator(`[data-record=${p}]`).selectOption(v);
 await page.locator('[data-action=next]').click();await page.locator('[data-action=confirm]').click();await page.locator('[data-action=next]').click();
 for(const [i,v] of [[0,1],[1,2],[2,2]]){await page.locator(`input[name=q${i}][value="${v}"]`).check();await page.locator(`[data-quiz="${i}"]`).click();}
 ok(await page.locator('[data-action=next]').isEnabled(),'all three checked quiz answers');
 await page.locator('[data-action=next]').click();await page.locator('#draft').fill('1단은 전지 한 개, 2단은 전지 두 개의 직렬 길이에요. 가운데에서는 길이 끊겨요.');
 await page.locator('[data-action=selfcheck]').click();ok((await page.locator('#report-feedback').textContent()).includes('자동 채점 결과가 아니에요'),'self check does not claim automatic grading');
 await page.locator('#reviewed').check();await page.locator('[data-action=next]').click();await snap('finish');
 // Leaving the comparison through the step menu must restore cells just like Next.
 const jump=async index=>{await page.locator('[data-action=steps]').click();await page.locator(`[data-step="${index}"]`).click();};
 await jump(3);await page.locator('[data-compare=parallel]').click();await page.locator('[data-cell="1"]').uncheck();
 await jump(13);
 const cells=()=>page.evaluate(async()=>{const {Stage}=await import('../../../engine.js');const s=[...Stage.live].find(s=>s.canvas.id==='model'&&s.canvas.isConnected);const counts=[];s.root.traverse(o=>{if(o.userData.cellParts)counts.push(o.userData.cellParts.filter(c=>c.visible).length);});return counts;});
 ok((await cells()).every(n=>n===0),'step menu keeps assembly holders empty after comparison');
 await jump(14);ok((await cells()).every(n=>n===3),'step menu restores both cells for completed experiment');
 await page.locator('[data-position=high]').click();ok((await page.locator('#reading').textContent()).includes('3 V'),'restored cells supply 2-stage voltage');
 await jump(19);
 const before=await page.evaluate(()=>localStorage.getItem('popcorn.fabre09.current.v1'));
 await page.locator('[data-action=home]').click();await page.locator('[data-start=teacher]').click();
 ok(await page.locator('#guide').count()===0,'teacher has no automatic character voice');
 await page.locator('[data-action=next]').click();await page.locator('[data-action=home]').click();
 ok(before===await page.evaluate(()=>localStorage.getItem('popcorn.fabre09.current.v1')),'teacher navigation preserves learner record');
 const live=await page.evaluate(async()=>{const {Stage}=await import('../../../engine.js');return Stage.live.size;});ok(live===1,'one live 3D stage after repeated navigation');
 const physics=await page.evaluate(async()=>{const {circuitState}=await import('./model.js');return [circuitState({mode:'series',cell1:false}),circuitState({mode:'parallel',cell1:false}),circuitState({mode:'stand',position:'low',cell2:false}),circuitState({mode:'stand',position:'high',cell2:false})];});
 ok(physics[0].volts===0&&physics[1].volts===1.5&&physics[2].volts===1.5&&physics[3].volts===0,'source-derived circuit invariants');
 const voices=await page.evaluate(async()=>{const m=await(await fetch('assets/audio/voices.json')).json();return Object.keys(m.lines).length;});ok(voices===24,'24 actual Numi voice files');
 await page.locator('[data-guide=play]').click();await page.waitForFunction(()=>document.querySelector('.mentor')?.classList.contains('speaking'));
 ok(await page.locator('.mentor.speaking').count()===1,'mouth motion starts on actual audio playing');await snap('talking');
 await page.locator('[data-guide=play]').click();ok(await page.locator('.mentor.speaking').count()===0,'mouth motion stops immediately on pause');
 await page.locator('[data-guide=play]').click();await page.waitForTimeout(200);await page.locator('[data-guide=mute]').click();ok(await page.locator('.mentor.speaking').count()===0,'mute stops speaking motion');
 await page.setViewportSize({width:390,height:844});await snap('mobile-home');ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile no horizontal overflow');
 await page.locator('[data-start=helper]').click();await snap('mobile-helper');ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile helper no horizontal overflow');
 await page.evaluate(async()=>{if(document.fullscreenElement)await document.exitFullscreen();});await page.waitForFunction(()=>!document.fullscreenElement);await page.setViewportSize({width:360,height:740});ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'small phone no horizontal overflow');await page.locator('[data-action=model-fullscreen]').click();await page.waitForFunction(()=>document.fullscreenElement?.classList.contains('viewport'));ok(await page.evaluate(()=>!!document.fullscreenElement),'3D fullscreen');ok(await page.locator('.viewport #guide').count()===1,'guide stays with enlarged experiment');await page.locator('[data-action=model-exit]').click();await page.waitForFunction(()=>!document.fullscreenElement);ok(await page.evaluate(()=>!document.fullscreenElement),'visible fullscreen exit');
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await reduced.addInitScript(()=>{globalThis.SL_QUALITY='low';});await reduced.goto(base);ok(await reduced.locator('.sprite').evaluate(e=>getComputedStyle(e).animationName==='none'),'reduced motion suppresses body animation');await reduced.close();
 ok(errors.length===0,'no browser errors or missing assets: '+errors.join('\n'));
 console.log(JSON.stringify({passed:count,failed:0,notes},null,2));if(out)await writeFile(out+'/qa.json',JSON.stringify({passed:count,failed:0,notes},null,2));
}finally{await browser.close();}
