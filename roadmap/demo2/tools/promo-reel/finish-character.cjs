/* Finish two generated character-animation scenes. Raw inputs stay outside the public site. */
const {execFileSync}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const sharp=require('sharp');
const ffmpeg=process.env.FFMPEG||'ffmpeg';
const font=process.env.REEL_FONT||'/System/Library/Fonts/AppleSDGothicNeo.ttc';
const [first,second]=process.argv.slice(2);
if(!first)throw Error('Pass an original animation MP4 file, optionally followed by a second scene.');
const filmDuration=second?23:13, animationDuration=filmDuration-3;
const assets=path.resolve(__dirname,'../../assets'),work=fs.mkdtempSync(path.join(os.tmpdir(),'gfield-character-'));
const run=args=>execFileSync(ffmpeg,['-y','-loglevel','error',...args],{stdio:'inherit'});
(async()=>{
 const logo=path.join(work,'logo.png');
 // The canonical SVG wraps a WebP; decode that payload before rasterizing (librsvg omits it).
 const canonical=fs.readFileSync(path.join(assets,'gfield-logo.svg'),'utf8');
 const embedded=canonical.match(/data:image\/webp;base64,([^"']+)/);
 if(!embedded)throw Error('Canonical logo embedded image not found.');
 await sharp(Buffer.from(embedded[1],'base64')).resize(200).png().toFile(logo);
 const music=path.join(work,'music.wav');execFileSync(process.env.PYTHON||'python3',[path.join(__dirname,'soundtrack.py'),music]);
 const captions=[
  [0,2.25,'책을 펼치던 아이가'],
  [2.25,5.25,'어려운 문제 앞에서\n잠시 멈춥니다.'],
  [5.25,7.75,'함께 공부할 순서를 정하고'],
  [7.75,10,'스스로 다시 풀어봅니다.'],
  [10,14,'학년이 올라가도'],
  [14,17,'읽고, 생각하고,\n끝까지 풀어내는 습관'],
  [17,20,'우리 아이에게 맞는\n학습 로드맵']
 ];
 const textFilters=captions.filter(([start])=>start<animationDuration).map(([start,end,text],i)=>{const file=path.join(work,`caption-${i}.txt`);fs.writeFileSync(file,text);return `drawtext=fontfile=${font}:textfile=${file}:fontsize=38:fontcolor=0x32223e:x=48:y=109:line_spacing=9:enable='gte(t,${start})*lt(t,${end})'`;}).join(',');
 const endText=path.join(work,'end.txt');fs.writeFileSync(endText,'성공하는 공부습관');
 const ending=path.join(work,'ending.mp4');
 run(['-f','lavfi','-i','color=c=0xfaf8f4:s=720x1280:r=24:d=3','-loop','1','-i',logo,'-filter_complex',`[1:v]scale=300:-1[l];[0:v][l]overlay=(W-w)/2:390,drawtext=fontfile=${font}:textfile=${endText}:fontsize=43:fontcolor=0x32223e:x=(w-text_w)/2:y=560,drawtext=fontfile=${font}:text='만들기':fontsize=56:fontcolor=0x32223e:x=(w-text_w)/2:y=630,drawtext=fontfile=${font}:text='GFIELD 학습 로드맵':fontsize=25:fontcolor=0x766c7d:x=(w-text_w)/2:y=755[v]`,'-map','[v]','-t','3','-an','-c:v','libx264','-crf','20','-pix_fmt','yuv420p',ending]);
 const joined=path.join(work,'joined.mp4');
 const inputs=['-i',path.resolve(first),...(second?['-i',path.resolve(second)]:[]),'-i',ending];
 const chain=second?'[0:v]scale=720:1280,fps=24,setsar=1,trim=duration=10,setpts=PTS-STARTPTS[a];[1:v]scale=720:1280,fps=24,setsar=1,trim=duration=10,setpts=PTS-STARTPTS[b];[2:v]setsar=1,setpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=1:a=0[v]':'[0:v]scale=720:1280,fps=24,setsar=1,trim=duration=10,setpts=PTS-STARTPTS[a];[1:v]setsar=1,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0[v]';
 run([...inputs,'-filter_complex',chain,'-map','[v]','-an','-c:v','libx264','-crf','20','-pix_fmt','yuv420p',joined]);
 const final=path.join(assets,'roadmap-character-animation-20261101.mp4');
 run(['-i',joined,'-loop','1','-i',logo,'-i',music,'-filter_complex',`[0:v]drawbox=x=0:y=0:w=iw:h=220:color=0xfaf8f4@0.94:t=fill:enable='lt(t,${animationDuration})'[base];[base][1:v]overlay=48:30:enable='lt(t,${animationDuration})',${textFilters}[v];[2:a]atrim=duration=${filmDuration},afade=t=out:st=${filmDuration-2}:d=2[a]`,'-map','[v]','-map','[a]','-t',String(filmDuration),'-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','96k','-movflags','+faststart',final]);
 run(['-ss','0.9','-i',final,'-frames:v','1','-q:v','2',path.join(assets,'roadmap-character-poster-20261101.jpg')]);
 console.log(JSON.stringify({final,work,bytes:fs.statSync(final).size}));
})();
