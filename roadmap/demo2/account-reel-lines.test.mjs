import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');
const M=createRequire(import.meta.url)('./account-reel-lines.js');
const html=read('account.html'),css=read('account-landing.css'),tool=read('tools/promo-reel/finish-journey.cjs');

test('the page lines are the captions the film was rendered with, at the same seconds',()=>{
 const source=tool.match(/const captions=(\[\[.*?\]\]);/s)[1];
 const rendered=Function('return '+source)();
 assert.equal(rendered.length,10);
 assert.deepEqual(M.LINES.slice(0,10),rendered);
 assert.equal(M.LINES[10][0],rendered[9][1]);assert.match(tool,/fs\.writeFileSync\(title,'성공하는 공부습관'\)/);assert.equal(M.LINES[10][2],'성공하는 공부습관\n만들기');
 for(let i=1;i<M.LINES.length;i++)assert.equal(M.LINES[i][0],M.LINES[i-1][1]);
});
test('each second of the film has exactly one line, including the ends',()=>{
 assert.equal(M.lineAt(0),0);assert.equal(M.lineAt(2.19),0);assert.equal(M.lineAt(2.2),1);assert.equal(M.lineAt(6.3),2);
 assert.equal(M.lineAt(34.19),9);assert.equal(M.lineAt(34.2),10);assert.equal(M.lineAt(37.2),10);assert.equal(M.lineAt(999),10);
 assert.equal(M.lineAt(NaN),0);assert.equal(M.lineAt(-1),0);
});
test('before the film plays the page shows the line of the poster frame, also without the script',()=>{
 assert.match(tool,/'-ss','6\.3','-i',final,'-frames:v','1'/);
 const line=html.match(/<p id="reelLine" class="account-film-line">([^<]*)<\/p>/)[1];
 assert.equal(line,M.LINES[M.lineAt(6.3)][2]);
 const listeners={},classes=[];let text=line;
 const video={currentTime:0,paused:true,ended:false,addEventListener:(t,f)=>{listeners[t]=f;}};
 const el={classList:{remove(){},add:c=>classes.push(c)},get offsetWidth(){return 1;},set textContent(v){text=v;},get textContent(){return text;}};
 const win={requestAnimationFrame(){return 1;},document:{getElementById:id=>id==='growthReel'?video:id==='reelLine'?el:null}};
 const api=M.mount(win);api.show();assert.equal(text,line);
 video.paused=false;video.currentTime=0.5;listeners.play();assert.equal(text,'책을 펼치던 아이가');assert.deepEqual(classes,['is-in']);
 video.currentTime=3;listeners.timeupdate();assert.equal(text,'어려운 문제 앞에서\n잠시 멈춥니다.');assert.deepEqual(classes,['is-in','is-out']);
 listeners.timeupdate();assert.equal(classes.length,2);
 video.currentTime=37.2;video.ended=true;listeners.ended();assert.equal(text,'성공하는 공부습관\n만들기');
});
test('missing film or line leaves the page alone',()=>{
 assert.equal(M.mount(null),null);assert.equal(M.mount({document:{getElementById:()=>null}}),null);
});
test('the crop removes exactly the band the film draws over its top, and nothing else is stretched',()=>{
 assert.match(tool,/drawbox=x=0:y=0:w=iw:h=220:/);assert.match(tool,/viewport:\{width:720,height:1280\}/);
 assert.match(css,/\.member-growth-video\{[^}]*aspect-ratio:720\/1060;object-fit:cover;object-position:bottom/);
 assert.doesNotMatch(html+css+read('account-landing.js'),/reelAmbience|account-film-ambience/);
 assert.match(css,/@media\(prefers-reduced-motion:no-preference\)\{\n \.account-film-line\.is-in/);
});
