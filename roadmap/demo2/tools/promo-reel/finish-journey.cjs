/* Full character story with illustrated choices. No live model/API calls in this renderer. */
const {chromium}=require('playwright');const {spawn,execFileSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{once}=require('node:events');const sharp=require('sharp');
const ffmpeg=process.env.FFMPEG||'ffmpeg',font=process.env.REEL_FONT||'/System/Library/Fonts/AppleSDGothicNeo.ttc';
const [childSource,secondarySource]=process.argv.slice(2);if(!childSource||!secondarySource)throw Error('Pass child and secondary-school animation sources.');
const assets=path.resolve(__dirname,'../../assets'),work=process.env.REEL_WORK||fs.mkdtempSync(path.join(os.tmpdir(),'gfield-journey-'));
const base=process.env.REEL_BASE||'http://127.0.0.1:57615/roadmap/demo2/tools/promo-reel/inserts-v3.html';
const run=args=>execFileSync(ffmpeg,['-y','-loglevel','error',...args],{stdio:'inherit'});
const fps=24;
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:720,height:1280},deviceScaleFactor:1});
 for(const scene of ['fork','growth']){
  const cached=path.join(work,scene+'.mp4');
  const picture=path.join(assets,scene==='fork'?'roadmap-crossroads-20261101.webp':'roadmap-growing-route-20261101.webp');
  const sourceTime=Math.max(fs.statSync(path.join(__dirname,'inserts-v3.html')).mtimeMs,fs.statSync(picture).mtimeMs);
  if(process.env.REEL_WORK&&fs.existsSync(cached)&&fs.statSync(cached).mtimeMs>=sourceTime){console.log(scene+' current insert reused from supplied work folder');continue;}
  await page.goto(base+'?scene='+scene);await page.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.art').decode();});
  const out=path.join(work,scene+'.mp4');const encoder=spawn(ffmpeg,['-y','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-crf','19','-pix_fmt','yuv420p',out],{stdio:['pipe','ignore','inherit']});const done=once(encoder,'exit');
  for(let i=0;i<fps*3.5;i++){await page.evaluate(t=>renderFrame(t),i/fps);const frame=await page.screenshot({type:'jpeg',quality:96});if(!encoder.stdin.write(frame))await once(encoder.stdin,'drain');if(i===60)await page.screenshot({path:path.join(work,scene+'-review.png')});}
  encoder.stdin.end();const [code]=await done;if(code)throw Error('insert encoder '+code);console.log(scene+' illustrated insert rendered');
 }
 await browser.close();
 const canonical=fs.readFileSync(path.join(assets,'gfield-logo.svg'),'utf8').match(/data:image\/webp;base64,([^"']+)/);if(!canonical)throw Error('Logo payload missing');
 const logo=path.join(work,'logo.png');await sharp(Buffer.from(canonical[1],'base64')).resize(200).png().toFile(logo);
 const music=path.join(work,'music.wav');execFileSync(process.env.PYTHON||'python3',[path.join(__dirname,'soundtrack.py'),music,'29']);
 const end=path.join(work,'ending.mp4');const title=path.join(work,'end-title.txt');fs.writeFileSync(title,'성공하는 공부습관');
 run(['-f','lavfi','-i','color=c=0xfaf8f4:s=720x1280:r=24:d=3','-loop','1','-i',logo,'-filter_complex',`[1:v]scale=300:-1[l];[0:v][l]overlay=(W-w)/2:390,drawtext=fontfile=${font}:textfile=${title}:fontsize=43:fontcolor=0x32223e:x=(w-text_w)/2:y=560,drawtext=fontfile=${font}:text='만들기':fontsize=56:fontcolor=0x32223e:x=(w-text_w)/2:y=630,drawtext=fontfile=${font}:text='GFIELD 학습 로드맵':fontsize=25:fontcolor=0x766c7d:x=(w-text_w)/2:y=755[v]`,'-map','[v]','-t','3','-an','-c:v','libx264','-crf','19','-pix_fmt','yuv420p',end]);
 const normalization='scale=720:1280,setsar=1,format=yuv420p,settb=1/24';
 const segments=[
  ['-ss','0','-t','5','-i',path.resolve(childSource)],['-i',path.join(work,'fork.mp4')],
  ['-ss','5','-t','5','-i',path.resolve(childSource)],['-i',path.join(work,'growth.mp4')],
  ['-t','10','-i',path.resolve(secondarySource)],['-i',end]
 ];
 const chains=segments.map((_,i)=>`[${i}:v]${normalization},setpts=PTS-STARTPTS,fps=24[s${i}]`);
 const offsets=[4.8,8.1,12.9,16.2,26.0];let last='s0';for(let i=1;i<segments.length;i++){const next='x'+i;chains.push(`[${last}][s${i}]xfade=transition=fade:duration=0.2:offset=${offsets[i-1]},fps=24[${next}]`);last=next;}
 const captions=[[0,2.2,'책을 펼치던 아이가'],[2.2,4.8,'어려운 문제 앞에서\n잠시 멈춥니다.'],[4.8,8.1,'지금, 어떤 공부가\n더 필요할까요?'],[8.1,10.8,'함께 공부할 순서를 정하고'],[10.8,12.9,'스스로 다시 풀어봅니다.'],[12.9,16.2,'초등에서 중등,\n고등까지 이어지는 계획'],[16.2,20.2,'조건을 읽고,\n풀이를 정리합니다.'],[20.2,23,'학년이 올라가도,\n공부의 기본은 단단하게'],[23,26,'우리 아이에게 맞는\n학습 로드맵']];
 const texts=captions.map(([start,stop,text],i)=>{const file=path.join(work,'caption-'+i+'.txt');fs.writeFileSync(file,text);return `drawtext=fontfile=${font}:textfile=${file}:fontsize=38:fontcolor=0x32223e:x=48:y=109:line_spacing=9:enable='gte(t,${start})*lt(t,${stop})'`;}).join(',');
 chains.push(`[${last}]drawbox=x=0:y=0:w=iw:h=220:color=0xfaf8f4@0.94:t=fill:enable='lt(t,26)'[base]`);
 chains.push(`[base][6:v]overlay=48:30:enable='lt(t,26)',${texts}[v]`);chains.push('[7:a]atrim=duration=29,afade=t=out:st=27:d=2[a]');
 const final=path.join(assets,'roadmap-growth-journey-20261101.mp4');
 run([...segments.flat(),'-loop','1','-i',logo,'-i',music,'-filter_complex',chains.join(';'),'-map','[v]','-map','[a]','-t','29','-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',final]);
 const poster=path.join(assets,'roadmap-growth-journey-poster-20261101.jpg');run(['-ss','6.3','-i',final,'-frames:v','1','-q:v','2',poster]);
 const manifest={duration:29,fps,dimensions:[720,1280],sources:[path.resolve(childSource),path.resolve(secondarySource)],segments:[{start:0,end:4.8,scene:'child study and question'},{start:4.8,end:8.1,scene:'illustrated crossroads'},{start:8.1,end:12.9,scene:'teacher and study'},{start:12.9,end:16.2,scene:'illustrated growth roadmap'},{start:16.2,end:26,scene:'middle to high school study'},{start:26,end:29,scene:'brand ending'}],captions,final,poster,work};
 fs.writeFileSync(path.join(work,'manifest.json'),JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest));
})().catch(e=>{console.error('Render stopped:',e.status||e.message);process.exitCode=1;});
