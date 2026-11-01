/* Reproducible motion graphics. Start a local static server first; no remote API. */
const {chromium}=require('playwright');
const {spawn,execFileSync}=require('node:child_process');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {once}=require('node:events');
const ffmpeg=process.env.FFMPEG||'ffmpeg';
const base=process.env.REEL_BASE||'http://127.0.0.1:57615/roadmap/demo2/tools/promo-reel/story.html';
const assets=path.resolve(__dirname,'../../assets');
const work=fs.mkdtempSync(path.join(os.tmpdir(),'gfield-promo-'));
const fps=24, duration=25;
(async()=>{
 const browser=await chromium.launch({headless:true});
 const audio=path.join(work,'music.wav');
 execFileSync(process.env.PYTHON||'python3',[path.join(__dirname,'soundtrack.py'),audio]);
 for(const [name,width,height] of [['wide',1280,720],['vertical',720,1280]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  await page.route('https://**',r=>r.abort());
  await page.goto(base);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
  const silent=path.join(work,`${name}.mp4`);
  const encoder=spawn(ffmpeg,['-y','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','22','-pix_fmt','yuv420p',silent],{stdio:['pipe','ignore','inherit']});
  const done=once(encoder,'exit');
  for(let frame=0;frame<fps*duration;frame++){
   const t=frame/fps;
   await page.evaluate(t=>window.renderFrame(t),t);
   const buffer=await page.screenshot({type:'jpeg',quality:94});
   if(!encoder.stdin.write(buffer))await once(encoder.stdin,'drain');
   if([36,150,252,360,462,552].includes(frame))await page.screenshot({path:path.join(work,`${name}-${frame}.png`)});
   if(frame%120===0)console.log(`${name}: ${frame/fps}/${duration}s`);
  }
  encoder.stdin.end();const [code]=await done;if(code!==0)throw new Error(`ffmpeg ${code}`);
  const file=path.join(assets,`roadmap-promo-${name}-20261101.mp4`);
  execFileSync(ffmpeg,['-y','-loglevel','error','-i',silent,'-i',audio,'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','96k','-shortest','-movflags','+faststart',file]);
  if(name==='wide'){await page.evaluate(()=>renderFrame(1.5));await page.screenshot({path:path.join(assets,'roadmap-promo-poster-20261101.jpg'),type:'jpeg',quality:92});}
  console.log(`${file} ${fs.statSync(file).size} bytes`);await page.close();
 }
 await browser.close();console.log(`Review frames and original music: ${work}`);
})().catch(e=>{console.error(e);process.exitCode=1;});
