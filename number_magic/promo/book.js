/* Promo presentation only. Course data and generators are read-only. */
(function () {
'use strict';
const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
const app=$('.magic-book-app'), cover=$('[data-scene="cover"]'), reader=$('[data-scene="reader"]'), content=$('#bookContent');
const panels=new Map($$('.book-content > [data-panel]').map(p=>[p.dataset.panel,p]));
const order=['video','menu','labs','village','worksheet','roadmap'];
const reduced=matchMedia('(prefers-reduced-motion:reduce)'), narrow=matchMedia('(max-width:700px)');
const I=window.NMPromoI18n, tr=(ko,en,zh)=>I?I.text(ko,en,zh):ko, localized=value=>I?I.pick(value):value.ko;
let view='cover',turning=false,hero=null,lab=null,highLab=null,level='middle',sample='preschool',sheetIndex=0,sampleOpen=false,activeCut='full',allCourses=false,stageIndex=0;
let tourTimer=0,exampleTimer=0,tourStep=0;
let pace=2;
const teaser=$('#teaserVideo'),film=$('#introVideo'),frame=$('#villageFrame');
const cuts={full:['showreel-full.mp4','poster-full.jpg'],short:['showreel-60s.mp4','poster-60s.jpg']};
const modes={
 preschool:{title:'두 친구에게 똑같이 나누어 주세요.',meaning:'옮기며 관계를 찾고, 조건에 맞게 해결해요.'},
 elementary:{title:'곱해서 10이 되는 짝을 찾아요.',meaning:'같은 수를 묶어 보는 힘, 곱셈.'},
 middle:{title:'한 수가 바뀌면, 다른 수는?',meaning:'곱이 일정한 두 수의 관계를 발견합니다.'},
 high:{title:'잘게 나눌수록, 넓이가 보입니다.',meaning:'눈으로 본 변화를 수와 식으로 다룹니다.'}
};
const samples={
 preschool:{pages:6,topic:'가르기와 모으기',headline:'손으로 나눈 수를,<br>내 힘으로 풀어요.',copy:'나누고 모으던 경험을 그림과 수로 옮깁니다. 짧은 이야기를 읽고 분류하는 문제까지 이어집니다.',source:'과정 0 · 6회차 발췌',word:4,caption:'가르기 · 연산 연습 · 분류하고 세기'},
 elementary:{pages:8,topic:'곱하여 10 · 나눗셈 문장제',headline:'계산한 답을 넘어,<br>이야기 속 관계까지.',copy:'곱하여 10의 원리를 익히고, 같은 회차의 나눗셈에서는 읽고 식을 세우는 문장형 문제 24문항을 연습합니다.',source:'과정 8 · 1회차 발췌',word:3,caption:'1–3쪽 곱하여 10 · 4–8쪽 나눗셈 문장형 연습'},
 middle:{pages:6,topic:'비례와 반비례',headline:'외운 공식이 아니라,<br>이해한 관계로.',copy:'두 수의 관계를 식과 그래프로 연결합니다. 개념을 확인한 뒤 직접 계산하고 그래프를 읽어 식으로 나타냅니다.',source:'과정 31 · 5회차 발췌',word:null,caption:'비례 개념 · 반비례 그래프 · 연산 연습'},
 high:{pages:6,topic:'미분과 적분',headline:'눈으로 본 변화를,<br>수학의 언어로.',copy:'접선의 기울기와 곡선 아래 넓이. 움직이는 모형에서 발견한 개념을 식으로 다루며 연습합니다.',source:'과정 43 · 4회차 발췌',word:null,caption:'미분·접선 · 실전 연습 · 적분'}
};
const sampleTranslations={
 en:{
 preschool:{topic:'Sharing and combining',headline:'Numbers you shared.<br>Problems you can solve.',copy:'Move from hands-on sharing to pictures and numbers, then read short stories to sort and count.',source:'Course 0 · Session 6 extract',caption:'Sharing · number practice · sorting and counting'},
 elementary:{topic:'Multiply to 10 · division word problems',headline:'Beyond the answer.<br>Find the relationships.',copy:'Explore multiplying to ten. In the same session, practise 24 division word problems by reading and forming equations.',source:'Course 8 · Session 1 extract',caption:'Pages 1–3: multiply to 10 · 4–8: division word problems'},
 middle:{topic:'Direct and inverse proportion',headline:'Not just a formula.<br>A relationship you understand.',copy:'Connect two numbers with equations and graphs. Check the concept, calculate, then read a graph and express its relationship.',source:'Course 31 · Session 5 extract',caption:'Proportion · inverse-proportion graphs · practice'},
 high:{topic:'Differentiation and integration',headline:'See the change.<br>Express it mathematically.',copy:'The slope of a tangent and the area under a curve. Practise expressing discoveries from moving models as equations.',source:'Course 43 · Session 4 extract',caption:'Derivatives and tangents · practice · integrals'}},
 zh:{
 preschool:{topic:'分一分，合一合',headline:'动手分过的数字，<br>自己也能解答。',copy:'把动手分合的经验转化为图画和数字，再通过简短故事练习分类与计数。',source:'课程0 · 第6次课节选',caption:'分与合 · 运算练习 · 分类与计数'},
 elementary:{topic:'乘积为10 · 除法应用题',headline:'不只算出答案，<br>还要读懂数量关系。',copy:'理解乘积为10的原理。同一次课的除法部分，通过阅读和列式练习24道文字题。',source:'课程8 · 第1次课节选',caption:'第1–3页：乘积为10 · 第4–8页：除法文字题'},
 middle:{topic:'正比例与反比例',headline:'不只记住公式，<br>更要理解关系。',copy:'用式子与图像连接两个数的关系。确认概念后，亲自计算、读图并列式。',source:'课程31 · 第5次课节选',caption:'比例概念 · 反比例图像 · 运算练习'},
 high:{topic:'微分与积分',headline:'把看到的变化，<br>化为数学语言。',copy:'切线的斜率与曲线下的面积。用式子表达动态模型中发现的概念，并加以练习。',source:'课程43 · 第4次课节选',caption:'导数与切线 · 综合练习 · 积分'}}
};
function currentSample(){return Object.assign({},samples[sample],sampleTranslations[I?.getLanguage()]?.[sample]||{});}
function labText(){
 const middleLabel=$('[data-lab-page="middle"] .lab-stage-label'),highLabel=$('[data-lab-page="high"] .lab-stage-label');
 if(middleLabel)middleLabel.textContent=tr('중등 · 반비례','Middle school · inverse proportion','初中 · 反比例');
 if(highLabel)highLabel.textContent=tr('고등 · 미적분','High school · calculus','高中 · 微积分');
 $('#labsTitle').textContent=tr(modes.middle.title,'When one number changes, what happens to the other?','一个数变了，另一个数会怎样？');
 $('#labMeaning').textContent=tr(modes.middle.meaning,'Discover two numbers whose product stays constant.','发现乘积保持不变的两个数。');
 if($('#labsHighTitle'))$('#labsHighTitle').textContent=tr(modes.high.title,'Smaller pieces. A clearer area.','分得越细，面积越清楚。');
 if($('#highLabMeaning'))$('#highLabMeaning').textContent=tr(modes.high.meaning,'Describe a changing model with numbers and equations.','用数字与式子描述模型中的变化。');
 $('#labToSheet').textContent=tr('중등 학습지 보기 →','Middle-school worksheets →','查看初中学习单 →');
 if($('#highLabToSheet'))$('#highLabToSheet').textContent=tr('고등 학습지 보기 →','High-school worksheets →','查看高中学习单 →');
}
function syncLabs(){if(lab)lab.setActive(!document.hidden&&view==='labs'&&(!narrow.matches||level==='middle'));if(highLab)highLab.setActive(!document.hidden&&view==='labs'&&(!narrow.matches||level==='high'));}
function play(v){const p=v.play();if(p)p.catch(()=>syncMedia());}
function mediaSource(v,name,poster){const src='../assets/promo/video/'+name;if(v.getAttribute('src')!==src){v.src=src;if(poster)v.poster='../assets/promo/video/'+poster;v.load();}}
function syncMedia(){
 $('#teaserPlay').textContent=teaser.paused?'▶':'Ⅱ';$('#teaserPlay').setAttribute('aria-label',teaser.paused?tr('미리보기 재생','Play preview','播放预览'):tr('미리보기 일시정지','Pause preview','暂停预览'));
 $('#teaserSound').textContent=teaser.muted?'×♪':'♪';$('#teaserSound').setAttribute('aria-label',teaser.muted?tr('배경음 켜기','Unmute preview','开启预览声音'):tr('배경음 끄기','Mute preview','关闭预览声音'));
 $('#cinemaPlay').hidden=!film.paused||film.ended;$('#cinemaPlay').setAttribute('aria-label',tr('소개 영상 재생','Play the film','播放介绍视频'));$('#playToggle').textContent=film.paused?'▶':'Ⅱ';$('#playToggle').setAttribute('aria-label',film.paused?tr('재생','Play','播放'):tr('일시정지','Pause','暂停'));
 $('#muteToggle').textContent=film.muted?'×♪':'♪';$('#muteToggle').setAttribute('aria-label',film.muted?tr('소리 켜기','Unmute','开启声音'):tr('음소거','Mute','静音'));
}
function setCut(key,autoplay){if(!cuts[key])return;activeCut=key;const c=cuts[key];mediaSource(film,c[0],c[1]);$$('[data-cut]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cut===key)));$('#videoFinish').hidden=true;if(autoplay)play(film);}
function frameActive(active){if(frame.getAttribute('src')){frame.contentWindow.postMessage({type:'nm-promo-language',lang:I?.getLanguage()||'ko'},location.origin);frame.contentWindow.postMessage({type:'nm-promo-active',active},location.origin);}}
function prepare(next,autoplay){
 if(window.NMCoverMath)window.NMCoverMath.setActive(next==='cover');
 $('#cinemaControls').hidden=next!=='video';
 teaser.pause();film.pause();
 stopTour();clearInterval(exampleTimer);
 if(hero)hero.setActive(false);if(lab)lab.setActive(false);if(highLab)highLab.setActive(false);frameActive(false);
 if(next==='menu'){
   if(!hero)hero=window.NMPromoExperience.create($('#heroExperience'),{mode:'preschool',compact:true});
   hero.setActive(!document.hidden);mediaSource(teaser,'showreel-15s-vertical.mp4');teaser.volume=.6;
   if(autoplay&&!reduced.matches)play(teaser);
 }
 if(next==='video'){setCut(activeCut,autoplay);}
 if(next==='labs'){if(!lab)lab=window.NMPromoExperience.create($('#labExperience'),{mode:'middle'});if(!highLab&&$('#highLabExperience'))highLab=window.NMPromoExperience.create($('#highLabExperience'),{mode:'high'});labText();syncLabs();}
 if(next==='village'){if(!frame.getAttribute('src')){const url=new URL(frame.dataset.src,location.href);url.searchParams.set('lang',I?.getLanguage()||'ko');frame.src=url.href;}else frameActive(!document.hidden);}
 if(next==='worksheet')renderSample();
 if(next==='roadmap')renderRoadmap();
 syncMedia();
}
function snapshot(panel){
 const clone=panel.cloneNode(true);clone.removeAttribute('hidden');clone.removeAttribute('inert');clone.removeAttribute('data-panel');clone.removeAttribute('aria-labelledby');clone.classList.add('turn-snapshot');clone.setAttribute('aria-hidden','true');clone.inert=true;
 [clone,...clone.querySelectorAll('[id]')].forEach(n=>n.removeAttribute('id'));
 clone.querySelectorAll('button,a,input,iframe').forEach(n=>n.tabIndex=-1);
 const originals=panel.querySelectorAll('canvas');
 clone.querySelectorAll('canvas').forEach((n,i)=>{const im=document.createElement('img');try{const ctl=originals[i].closest('#heroExperience')?hero:originals[i].closest('#highLabExperience')?highLab:lab;im.src=(ctl&&ctl.capture&&ctl.capture())||originals[i].toDataURL();}catch(e){}im.alt='';im.style.cssText=n.style.cssText;im.style.width='100%';im.style.height='100%';n.replaceWith(im);});
 const videos=panel.querySelectorAll('video');
 clone.querySelectorAll('video').forEach((n,i)=>{const original=videos[i],im=document.createElement('img');im.src=n.poster;try{if(original.readyState>=2){const c=document.createElement('canvas');c.width=original.videoWidth;c.height=original.videoHeight;c.getContext('2d').drawImage(original,0,0);im.src=c.toDataURL('image/jpeg',.88);}}catch(e){}im.alt='';im.style.cssText='width:100%;height:100%;object-fit:'+getComputedStyle(original).objectFit;im.dataset.mediaSnapshot='true';n.replaceWith(im);});
 clone.querySelectorAll('iframe').forEach(n=>{const im=document.createElement('img');im.src='../assets/promo/shots/village.webp';im.alt='';im.style.cssText='width:100%;height:100%;object-fit:cover';n.replaceWith(im);});
 return clone;
}
function turn(from,to,direction,done){
 if(reduced.matches){done();return;}
 turning=true;content.classList.add('is-turning');updateNav();
 // Keep the outgoing spread visible while the incoming local WebGL scene renders.
 const hold=snapshot(from);hold.classList.add('curl-staging');
 hold.style.setProperty('display',from.classList.contains('panel-menu')?'grid':from.classList.contains('panel-video')||from.classList.contains('panel-village')?'block':'flex','important');
 content.append(hold);
 requestAnimationFrame(()=>{
   const finish=()=>{hold.remove();content.classList.remove('is-turning');done();};
   window.NMPageCurl.turn({container:content,from,to:snapshot(to),direction,narrow:narrow.matches,duration:1400,onComplete:finish});
   hold.remove();
 });
}
// Freeze the physical spread while a sheet turns. Only after it settles does the
// whole bound book ease into the destination aspect ratio (especially 16:9 film).
function lockSpread(){
 const book=$('.open-book'),r=book.getBoundingClientRect(),c=content.getBoundingClientRect();
 const state={book,width:r.width,height:r.height,top:c.top-r.top,contentHeight:c.height,header:$('.book-toolbar').getBoundingClientRect().height,footer:$('.book-footer').getBoundingClientRect().height};
 book.style.width=r.width+'px';book.style.height=r.height+'px';
 book.style.setProperty('--turn-content-top',state.top+'px');book.style.setProperty('--turn-content-height',state.contentHeight+'px');book.style.setProperty('--turn-header-height',state.header+'px');book.style.setProperty('--turn-footer-height',state.footer+'px');book.classList.add('is-shared-turn');return state;
}
function settleSpread(s,done){
 if(!s){turning=false;updateNav();done();return;}
 const b=s.book;b.classList.remove('is-shared-turn');b.style.removeProperty('width');b.style.removeProperty('height');
 const r=b.getBoundingClientRect(),c=content.getBoundingClientRect(),top=c.top-r.top;
 if(Math.abs(r.width-s.width)<1&&Math.abs(r.height-s.height)<1){turning=false;updateNav();done();return;}
 b.classList.add('is-shared-turn');b.style.setProperty('--turn-content-top',top+'px');b.style.setProperty('--turn-content-height',c.height+'px');b.style.setProperty('--turn-header-height',$('.book-toolbar').getBoundingClientRect().height+'px');
 const options={duration:620,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'};
 const resize=b.animate([{width:s.width+'px',height:s.height+'px'},{width:r.width+'px',height:r.height+'px'}],options);
 const page=content.animate([{top:s.top+'px',height:s.contentHeight+'px'},{top:top+'px',height:c.height+'px'}],options);
 Promise.all([resize.finished,page.finished]).catch(()=>{}).then(()=>{resize.cancel();page.cancel();b.classList.remove('is-shared-turn');turning=false;updateNav();done();});
}
function updateNav(){
 const i=order.indexOf(view);$('#bookBack').disabled=turning;$('#bookNext').disabled=turning||i===order.length-1;
 $$('[data-promo-language]').forEach(select=>select.disabled=turning);
 $$('.chapter-nav [data-route]').forEach(b=>{if(b.dataset.route===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');b.disabled=turning;});
}
function go(next,{historyMode='push',animate=true,autoplay=false,focus=true}={}){
 if(turning)return;if(!order.includes(next)&&next!=='cover')next='cover';if(view===next&&next!=='cover')return;
 const from=view,fromPanel=panels.get(from),toPanel=panels.get(next);let fromSnapshot,spread;
 if(animate&&fromPanel&&toPanel&&!reduced.matches){fromSnapshot=snapshot(fromPanel);spread=lockSpread();}
 view=next;app.dataset.view=next;const closed=next==='cover';
 cover.classList.toggle('is-active',closed);cover.setAttribute('aria-hidden',String(!closed));cover.inert=!closed;
 reader.classList.toggle('is-active',!closed);reader.setAttribute('aria-hidden',String(closed));reader.inert=closed;
 panels.forEach((p,id)=>{const on=id===next;p.hidden=!on;p.inert=!on;p.setAttribute('aria-hidden',String(!on));});
 prepare(next,autoplay);
 if(historyMode==='push'&&location.hash!=='#'+next)history.pushState({nmBook:true,view:next},'','#'+next);
 if(historyMode==='replace')history.replaceState({nmBook:true,view:next},'','#'+next);
 const finish=()=>{if(focus){const t=closed?$('#openBook'):(toPanel.querySelector('h1,h2')||$('#bookContent'));t.focus({preventScroll:true});}};
 if(fromSnapshot){turn(fromSnapshot,toPanel,order.indexOf(next)>=order.indexOf(from)?1:-1,()=>settleSpread(spread,finish));}else finish();
 updateNav();
}
function previous(){const i=order.indexOf(view);go(i>0?order[i-1]:'cover',{autoplay:false});}
function next(){const i=order.indexOf(view),target=order[i+1];if(target)go(target,{autoplay:target==='video'||target==='menu'});}
$('#openBook').addEventListener('click',()=>{
 if(turning)return;
 const source=$('#openBook').getBoundingClientRect(),face=$('.book-cover-face').cloneNode(true);
 [face,...face.querySelectorAll('[id]')].forEach(n=>n.removeAttribute('id'));
 face.querySelectorAll('canvas').forEach((n,i)=>{const im=document.createElement('img');im.src=$('.book-cover-face').querySelectorAll('canvas')[i].toDataURL();im.className=n.className;n.replaceWith(im);});
 // The first spread is the full two-minute film, never the split teaser page.
 // Start from the explicit click so mobile browsers allow its audio to play.
 teaser.pause();setCut('full',false);film.currentTime=0;play(film);
 if(window.NMCoverMath)window.NMCoverMath.setActive(false);
 if(reduced.matches){go('video',{animate:false,autoplay:true});return;}
 app.classList.add('is-book-opening');cover.classList.add('is-opening');
 go('video',{animate:false,autoplay:true,focus:false});turning=true;updateNav();
 const book=$('.open-book'),target=book.getBoundingClientRect(),stage=document.createElement('div'),board=document.createElement('div'),back=document.createElement('span');
 stage.className='cover-opening-stage';stage.inert=true;stage.setAttribute('aria-hidden','true');board.className='cover-opening-board';back.className='cover-opening-back';board.style.width=source.width+'px';board.style.height=source.height+'px';board.append(face,back);stage.append(board);app.append(stage);
 let start=null,raf=0,finished=false;
 const smooth=p=>p*p*(3-2*p),mix=(a,b,p)=>a+(b-a)*p;
 function finish(){if(finished)return;finished=true;cancelAnimationFrame(raf);stage.remove();book.style.removeProperty('transform');book.style.removeProperty('transform-origin');book.style.removeProperty('clip-path');app.classList.remove('is-book-opening');cover.classList.remove('is-opening');turning=false;updateNav();content.focus({preventScroll:true});window.removeEventListener('resize',finish);document.removeEventListener('visibilitychange',hidden);}
 function hidden(){if(document.hidden)finish();}
 function draw(now){if(start===null)start=now;const p=Math.min(1,(now-start)/1400),e=smooth(p),hingeX=mix(source.left,target.left+target.width/2,e),y=mix(source.top,target.top,e),w=mix(source.width,target.width/2,e),h=mix(source.height,target.height,e),angle=-180*smooth(Math.min(1,p/0.93));
  stage.dataset.progress=p.toFixed(3);stage.dataset.hingeX=hingeX.toFixed(2);board.style.transform='translate3d('+hingeX+'px,'+y+'px,0) scale('+w/source.width+','+h/source.height+') rotateY('+angle+'deg)';board.style.opacity=String(1-smooth(Math.max(0,(p-.86)/.14)));
  book.style.transformOrigin='0 0';book.style.transform='translate('+(hingeX-w-target.left)+'px,'+(y-target.top)+'px) scale('+(2*w/target.width)+','+(h/target.height)+')';book.style.clipPath='inset(0 0 0 '+(50*(1-smooth(Math.max(0,Math.min(1,(p-.45)/.45)))) )+'%)';
  if(p<1)raf=requestAnimationFrame(draw);else finish();
 }
 draw(performance.now());window.addEventListener('resize',finish,{once:true});document.addEventListener('visibilitychange',hidden);
});
$('#bookHome').addEventListener('click',()=>go('cover'));$('#bookBack').addEventListener('click',previous);$('#bookNext').addEventListener('click',next);
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.route,{autoplay:b.dataset.route==='video'})));
$$('[data-cut]').forEach(b=>b.addEventListener('click',()=>setCut(b.dataset.cut,true)));
$('#teaserPlay').addEventListener('click',()=>teaser.paused?play(teaser):teaser.pause());
$('#teaserSound').addEventListener('click',()=>{teaser.muted=!teaser.muted;syncMedia();});
[$('#cinemaPlay'),$('#playToggle'),film].forEach(b=>b.addEventListener('click',()=>{if(film.paused){$('#videoFinish').hidden=true;play(film);}else film.pause();}));
$('#muteToggle').addEventListener('click',()=>{film.muted=!film.muted;syncMedia();});
[film,teaser].forEach(v=>{v.addEventListener('play',syncMedia);v.addEventListener('pause',syncMedia);v.addEventListener('volumechange',syncMedia);v.addEventListener('contextmenu',e=>e.preventDefault());v.addEventListener('error',syncMedia);});
film.addEventListener('timeupdate',()=>{$('#videoProgress').value=film.duration?Math.round(film.currentTime/film.duration*1000):0;const t=film.currentTime||0;$('#videoTime').textContent=Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');});
$('#videoProgress').addEventListener('input',e=>{if(Number.isFinite(film.duration))film.currentTime=+e.target.value/1000*film.duration;});
film.addEventListener('ended',()=>{$('#videoFinish').hidden=false;syncMedia();});
function changeLevel(id){if(!['middle','high'].includes(id))return;level=id;app.dataset.labPage=id;$$('[data-lab-select]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.labSelect===id)));labText();syncLabs();}
$$('[data-lab-select]').forEach(b=>b.addEventListener('click',()=>changeLevel(b.dataset.labSelect)));
function labToSheet(id){sample=id;sheetIndex=0;sampleOpen=false;go('worksheet');}
$('#labToSheet').addEventListener('click',()=>labToSheet('middle'));
$('#highLabToSheet')?.addEventListener('click',()=>labToSheet('high'));
frame.addEventListener('load',()=>frameActive(view==='village'));
window.addEventListener('message',e=>{
 if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data)return;
 if(e.data.type==='nm-promo-ready')frameActive(view==='village');
 if(e.data.type==='nm-promo-route'&&['labs','worksheet','roadmap'].includes(e.data.view))go(e.data.view);
});
function samplePath(i){return '../assets/promo/samples-v4/'+sample+'/page-'+(i+1)+'.webp';}
function renderSample(){
 const s=currentSample();$$('[data-sample]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sample===sample)));
 $('#sampleTopic').textContent=s.topic;$('#sampleHeadline').innerHTML=s.headline;$('#sampleCopy').textContent=s.copy;$('#sampleSource').textContent=s.source+tr(' · 실제 학습지',' · real worksheet',' · 真实学习单');
 $('#sampleCover').src=samplePath(0);$('#sampleCover').alt=s.topic+tr(' 실제 학습지',' — original Korean worksheet',' — 韩语原版学习单');
 $('#wordPreview').hidden=s.word===null;$('#sampleEditorial').hidden=sampleOpen;$('#sampleReader').hidden=!sampleOpen;$('#sampleCaption').textContent=s.caption;
 renderSheets();
}
function renderSheets(){const total=samples[sample].pages,step=narrow.matches?1:2,s=currentSample();sheetIndex=Math.max(0,Math.min(sheetIndex,total-step));$('#sheetA').src=samplePath(sheetIndex);$('#sheetA').alt=s.topic+tr(' 발췌 ',' extract, page ',' 节选，第')+(sheetIndex+1)+tr('쪽','','页');$('#sheetB').src=samplePath(Math.min(sheetIndex+1,total-1));$('#sheetB').alt=s.topic+tr(' 발췌 ',' extract, page ',' 节选，第')+Math.min(sheetIndex+2,total)+tr('쪽','','页');$('#sheetCounter').textContent=(sheetIndex+1)+(step===2?'–'+Math.min(total,sheetIndex+2):'')+' / '+total;$('#sheetPrev').disabled=sheetIndex===0;$('#sheetNext').disabled=sheetIndex>=total-step;}
$$('[data-sample]').forEach(b=>b.addEventListener('click',()=>{sample=b.dataset.sample;sheetIndex=0;sampleOpen=false;renderSample();}));
function openSample(index=0){sheetIndex=index;sampleOpen=true;renderSample();}
$('#openSamples').addEventListener('click',()=>openSample());$('#samplePreview').addEventListener('click',()=>openSample());
$('#wordPreview').addEventListener('click',()=>openSample(samples[sample].word||0));$('#closeSamples').addEventListener('click',()=>{sampleOpen=false;renderSample();});
function turnSheet(d){const step=narrow.matches?1:2;sheetIndex+=d*step;renderSheets();const spread=$('.sheet-spread');spread.classList.remove('is-changing');requestAnimationFrame(()=>spread.classList.add('is-changing'));}
$('#sheetPrev').addEventListener('click',()=>turnSheet(-1));$('#sheetNext').addEventListener('click',()=>turnSheet(1));
function zoom(offset=0){$('#zoomImage').src=samplePath(Math.min(sheetIndex+offset,samples[sample].pages-1));$('#sheetZoom').showModal();}
$$('[data-zoom]').forEach(b=>b.addEventListener('click',()=>zoom(+b.dataset.zoom)));$('#zoomSheet').addEventListener('click',()=>zoom());$('#zoomClose').addEventListener('click',()=>$('#sheetZoom').close());
narrow.addEventListener('change',()=>{if(sampleOpen)renderSheets();syncLabs();});
function escapeHTML(t){return String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderRoadmap(){
 const stages=window.NM_STAGES||[],specs=window.NM_COURSE_SPEC||[];
 if(!$('#roadmapRows').children.length){stages.forEach((s,i)=>{const b=document.createElement('button');b.className='roadmap-stop';b.dataset.stage=s.key;b.innerHTML='<span class="station">'+(i+1)+'</span><strong></strong><small></small>';b.addEventListener('click',()=>{stopTour();stageIndex=i;allCourses=false;renderRoadmap();});$('#roadmapRows').append(b);});const traveller=document.createElement('span');traveller.className='roadmap-traveller';traveller.setAttribute('aria-hidden','true');traveller.textContent='✦';$('#roadmapRows').append(traveller);}
 $$('.roadmap-stop').forEach((b,i)=>{const s=stages[i];b.querySelector('strong').textContent=localized(s.name).split(' — ')[0];b.querySelector('small').textContent=tr('과정 ','Courses ','课程 ')+s.courses.from+(s.courses.to!==s.courses.from?'–'+s.courses.to:'');});
 $$('.roadmap-stop').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===stageIndex&&!allCourses)));
 const selected=stages[stageIndex];if(!selected)return;
 $('#stageTitle').textContent=allCourses?tr('전체 '+specs.length+'과정','All '+specs.length+' courses','全部'+specs.length+'门课程'):localized(selected.name);
 $('#stageLearn').textContent=allCourses?tr('과정 번호순으로 전체 학습 내용을 확인하세요.','Browse every course in order.','按课程编号查看全部学习内容。'):localized(selected.learn);
 updatePace(selected);
 const filtered=allCourses?specs:specs.filter(s=>s.id>=selected.courses.from&&s.id<=selected.courses.to);
 $('#courseRows').innerHTML=filtered.map(s=>'<article class="course-row" data-course="'+s.id+'"><strong>'+String(s.id).padStart(2,'0')+'</strong><b>'+escapeHTML(localized(s.title))+'</b></article>').join('');
 $('#courseRows').scrollTop=0;$('#allCourses').setAttribute('aria-pressed',String(allCourses));$('#allCourses').textContent=allCourses?tr('단계별로 보기 ↗','View by stage ↗','按阶段查看 ↗'):tr('전체 과정표 보기 ↗','All courses ↗','全部课程 ↗');
 const pin=$('.roadmap-traveller');pin.hidden=allCourses;
 requestAnimationFrame(()=>{const station=$$('.roadmap-stop .station')[stageIndex],r=station.getBoundingClientRect(),rail=$('#roadmapRows').getBoundingClientRect();pin.style.transform='translate('+(r.left-rail.left+r.width-5)+'px,'+(r.top-rail.top-6)+'px)';});
 clearInterval(exampleTimer);$('#stageExample').hidden=allCourses;
 const steps=selected.example.split('→').map(s=>s.trim());let exampleStep=0;
 function example(){const el=$('#stageExpression');el.textContent=steps[exampleStep];el.classList.remove('is-revealing');requestAnimationFrame(()=>el.classList.add('is-revealing'));exampleStep=(exampleStep+1)%steps.length;}
 example();$('#stageExample').classList.toggle('is-multi',steps.length>1&&!reduced.matches);
 if(!allCourses&&!reduced.matches&&steps.length>1)exampleTimer=setInterval(example,2400);
}
function tourLabel(){const b=$('#roadmapPlay');b.setAttribute('aria-pressed',String(Boolean(tourTimer)));b.textContent=tourTimer?tr('여정 멈춤 Ⅱ','Pause journey Ⅱ','暂停旅程 Ⅱ'):tr('여정 재생 ▶','Play journey ▶','播放旅程 ▶');}
function stopTour(){clearInterval(tourTimer);tourTimer=0;tourLabel();}
$('#roadmapPlay').addEventListener('click',()=>{if(tourTimer){stopTour();return;}allCourses=false;stageIndex=0;tourStep=0;renderRoadmap();tourTimer=setInterval(()=>{tourStep++;if(tourStep>=window.NM_STAGES.length){stopTour();return;}stageIndex=tourStep;renderRoadmap();},3000);tourLabel();});
$('#allCourses').addEventListener('click',()=>{stopTour();allCourses=!allCourses;renderRoadmap();});
function updatePace(stage){const match=(stage.meta&&stage.meta.ko||'').match(/주 2회 기준\s*(\d+)주/),weeks=pace===1?stage.weeks:(match?Number(match[1]):null);$('#paceEstimate').textContent=!allCourses&&weeks?tr('선택한 단계 · 약 '+weeks+'주','Selected stage · about '+weeks+' weeks','所选阶段 · 约'+weeks+'周'):'';$$('[data-pace]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.pace===pace)));}
$$('[data-pace]').forEach(b=>b.addEventListener('click',()=>{pace=+b.dataset.pace;updatePace(window.NM_STAGES[stageIndex]);}));
window.addEventListener('resize',()=>{if(view==='roadmap')renderRoadmap();});
function hashView(){const v=location.hash.slice(1);return order.includes(v)?v:({story1:'labs',story2:'village',story3:'worksheet'}[v]||'cover');}
window.addEventListener('popstate',()=>{if(turning){setTimeout(()=>go(hashView(),{historyMode:'none',animate:false}),2200);return;}go(hashView(),{historyMode:'none'});});
window.addEventListener('hashchange',()=>{const v=hashView();if(v!==view&&!turning)go(v,{historyMode:'none'});});
window.addEventListener('keydown',e=>{
 if($('#sheetZoom').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
 if(e.key==='Escape'&&view!=='cover'){e.preventDefault();previous();}
 if(e.key==='PageDown'){e.preventDefault();next();}
 if(e.key==='PageUp'){e.preventDefault();previous();}
});
document.addEventListener('visibilitychange',()=>{if(hero)hero.setActive(!document.hidden&&view==='menu');syncLabs();frameActive(!document.hidden&&view==='village');if(document.hidden){teaser.pause();film.pause();stopTour();clearInterval(exampleTimer);}else if(view==='roadmap')renderRoadmap();});
window.addEventListener('nm-promo-languagechange',()=>{labText();syncMedia();renderSample();if(view==='roadmap')renderRoadmap();tourLabel();frameActive(!document.hidden&&view==='village');});
changeLevel('middle');labText();renderSample();
const initial=hashView();go(initial,{historyMode:'replace',animate:false,focus:false});
window.NMPromoBook={getState:()=>({view,level,sample,sheetIndex,sampleOpen,turning}),go,experience:()=>({hero,lab,highLab})};
})();
