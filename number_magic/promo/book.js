/* Numbers of Magic 홍보 책 — 3판 엔진 (2026-09-29)
   원장 지적(2판): 책 넘김이 이상함 · 홈페이지 내용이 안 담김 · 실험실이 그림 · 로드맵 그림 없음 · 스크롤됨.
   그래서:
   - 쪽은 <template> 안의 <article class="pg"> 하나하나다. 데스크톱은 두 쪽씩 펼치고(왼쪽·오른쪽), 휴대폰은 한 쪽씩.
   - 넘기는 종이는 N개의 띠(segment)를 경첩처럼 이어 붙인 3D 종이다. 띠마다 각도가 조금씩 달라 종이가 휘고,
     각도에 따라 명암과 아래 쪽에 떨어지는 그림자가 바뀐다. 모서리를 끌면 종이 끝이 손가락을 따라온다.
   - 쪽 내용은 기준 크기(500 / 390 px 폭)로 짜고 --s 로 확대·축소한다. 그래도 넘치면 글자 배율(--fit)을 줄인다.
     → 어느 화면에서도 쪽 안 스크롤이 없다.
   - 실험실(미분·적분·무지개 덧셈)은 그림이 아니라 쪽 안에서 직접 움직이는 캔버스/SVG 이다. */
(function(){
'use strict';

var DICT=window.NM_PROMO_I18N||{ko:{}};
var STAGES=window.NM_STAGES||[];
var LANGS=['ko','en','zh'];
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduceMQ=window.matchMedia('(prefers-reduced-motion: reduce)');
function reduced(){return reduceMQ.matches}
function clamp(v,a,b){return v<a?a:v>b?b:v}
function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}

/* ───────── 언어 ───────── */
function pickLang(){
  var q=new URLSearchParams(location.search).get('lang');
  if(q&&LANGS.indexOf(q)>=0)return q;
  var s=store('nm_landing_lang');if(s&&LANGS.indexOf(s)>=0)return s;
  try{var st=JSON.parse(store('nm_state_v1')||'null');if(st&&LANGS.indexOf(st.lang)>=0)return st.lang}catch(e){}
  var n=(navigator.language||'ko').slice(0,2);return LANGS.indexOf(n)>=0?n:'ko';
}
var lang=pickLang();
function t(k,vars){
  var d=DICT[lang]||{},s=d[k];if(s==null)s=(DICT.ko||{})[k];if(s==null)s='';
  if(vars)s=s.replace(/\{(\w+)\}/g,function(m,n){return vars[n]!=null?vars[n]:m});
  return s;
}
function L(o){if(o==null)return'';if(typeof o==='string')return o;return o[lang]||o.ko||o.en||''}

/* ───────── 요소 ───────── */
var bookEl=$('#bookEl'),slotL=$('.slot-l',bookEl),slotR=$('.slot-r',bookEl),host=$('.leaf-host',bookEl);
var castL=$('.cast-l',bookEl),castR=$('.cast-r',bookEl),cover=$('#cover'),coverBack=$('.cover-back',cover);
var dock=$('#dock'),btnPrev=$('#btnPrev'),btnNext=$('#btnNext'),where=$('#where');
var peelNext=$('#peelNext'),peelPrev=$('#peelPrev');
var prep=document.createElement('div');prep.className='slot slot-prep';prep.setAttribute('aria-hidden','true');bookEl.appendChild(prep);

var tpl=$('#pageTpl');
var PAGES=Array.prototype.slice.call(tpl.content.querySelectorAll('.pg')).map(function(el){return document.importNode(el,true)});
var byId={};PAGES.forEach(function(p){byId[p.dataset.page]=p});
var NUMBERED=PAGES.filter(function(p){return !p.hasAttribute('data-desk-only')});
function pageNo(p){return NUMBERED.indexOf(p)+1}

/* ───────── 배치 상태 ───────── */
var mode='spread',views=[],vi=0,isOpen=false,busy=false,drag=null,G={pw:480,ph:620,refW:500,refH:581,s:1};

function buildViews(){
  var list=mode==='spread'?PAGES:NUMBERED;views=[];
  if(mode==='spread'){for(var i=0;i<list.length;i+=2)views.push([list[i],list[i+1]||null])}
  else list.forEach(function(p){views.push([p])});
}
function viewOf(page){for(var i=0;i<views.length;i++)if(views[i].indexOf(page)>=0)return i;return 0}

function layout(){
  var vw=document.documentElement.clientWidth,vh=window.innerHeight;
  var single=vw<=700;
  var barH=single?48:54,dockH=single?58:60;
  var availH=vh-barH-dockH-(single?14:30),availW=vw-(single?16:84);
  var pw,ph;
  if(single){pw=Math.min(availW,540);ph=Math.min(availH,pw*1.95)}
  else{ph=Math.min(availH,940);pw=Math.min(availW/2,ph*.86);if(pw<ph*.66)ph=pw/.66}
  pw=Math.floor(pw);ph=Math.floor(ph);
  var refW=single?390:500,minRefH=single?600:560,s=pw/refW,refH=ph/s;
  if(refH<minRefH){s=ph/minRefH;refH=minRefH}
  G={pw:pw,ph:ph,refW:refW,refH:Math.floor(refH),s:s};
  var R=document.documentElement.style;
  R.setProperty('--barH',barH+'px');R.setProperty('--dockH',dockH+'px');
  R.setProperty('--pw',pw+'px');R.setProperty('--ph',ph+'px');R.setProperty('--refW',refW);R.setProperty('--refH',G.refH);R.setProperty('--s',s.toFixed(4));
  var newMode=single?'single':'spread';
  bookEl.classList.toggle('is-single',single);
  document.body.classList.toggle('is-single',single);document.body.classList.toggle('is-spread',!single);
  PAGES.forEach(function(p){p.classList.toggle('is-single',single);p.classList.toggle('is-spread',!single)});
  if(newMode!==mode||!views.length){
    var keep=views.length?(views[vi][0]&&!views[vi][0].hasAttribute('data-desk-only')?views[vi][0]:views[vi][1]):null;
    mode=newMode;buildViews();vi=keep?viewOf(keep):0;
    if(road)road.draw();
  }
  fitCache={};
  if(isOpen)place();
}

/* ───────── 쪽 넘침 방지: 글자 배율을 줄인다 ───────── */
var fitCache={};
function fit(pg){
  var box=pg.querySelector('.pad')||pg.querySelector('.pg-in');if(!box)return;
  var key=pg.dataset.page+'|'+lang+'|'+mode+'|'+G.refH+'|'+(pg.dataset.state||'');
  if(fitCache[key]){box.style.setProperty('--fit',fitCache[key]);return}
  var f=1;box.style.setProperty('--fit',f);
  var n=0;while(over(box)&&f>.72&&n++<16){f=Math.round((f-.025)*1000)/1000;box.style.setProperty('--fit',f)}
  fitCache[key]=f;
}
function over(box){return box.scrollHeight>box.clientHeight+1||box.scrollWidth>box.clientWidth+1}
function refit(pg){pg.dataset.state=(pg.dataset.state||'')+'';delete fitCache[pg.dataset.page+'|'+lang+'|'+mode+'|'+G.refH+'|'+(pg.dataset.state||'')];fit(pg)}

/* ───────── 쪽 꽂기 ───────── */
function setSide(pg,side){if(!pg)return;pg.classList.toggle('is-left',side==='left');pg.classList.toggle('is-right',side==='right')}
function put(slot,pg,side){
  if(!pg){return}
  setSide(pg,side);
  if(pg.parentNode!==slot)slot.appendChild(pg);
}
function clearSlot(slot,keep){Array.prototype.slice.call(slot.children).forEach(function(c){if(keep.indexOf(c)<0)slot.removeChild(c)})}
function prepare(pg,side){ // 화면 밖에서 한 번 배치해 크기·그림·맞춤을 끝낸다
  if(!pg)return;
  if(!pg.isConnected||pg.parentNode===prep){setSide(pg,side);prep.appendChild(pg)}
  fit(pg);hook(pg,'show');
}
function place(){
  var v=views[vi]||[];
  if(mode==='spread'){
    clearSlot(slotL,[v[0]]);clearSlot(slotR,[v[1]]);
    put(slotL,v[0],'left');put(slotR,v[1],'right');
  }else{clearSlot(slotL,[]);clearSlot(slotR,[v[0]]);put(slotR,v[0],'right')}
  v.forEach(function(p){if(p){fit(p);hook(p,'show')}});
  clearSlot(prep,[]);
  afterPlace();
}
function afterPlace(){
  var n=views.length,v=views[vi]||[];
  btnPrev.disabled=vi<=0;btnNext.disabled=vi>=n-1;
  peelNext.hidden=vi>=n-1;peelPrev.hidden=vi<=0;
  var nums=v.filter(function(p){return p&&!p.hasAttribute('data-desk-only')}).map(pageNo);
  var total=NUMBERED.length;
  $('#dockCount').textContent=(nums.length?(nums.length>1?nums[0]+'–'+nums[nums.length-1]:nums[0]):'·')+' / '+total;
  $('#dockFill').style.width=(n>1?vi/(n-1)*100:100)+'%';
  var ch=chapterOf(v[1]||v[0]);
  where.textContent=ch?ch:'';
  btnPrev.setAttribute('aria-label',t('ui.prev'));btnNext.setAttribute('aria-label',t('ui.next'));
  var prog=n>1?vi/(n-1):0;
  bookEl.style.setProperty('--edgeL',(mode==='spread'?2+prog*9:0)+'px');
  bookEl.style.setProperty('--edgeR',(2+(1-prog)*9)+'px');
  if(isOpen&&views[vi]){var id=(v[0]&&v[0].hasAttribute('data-desk-only')&&v[1]?v[1]:v[0]).dataset.page;try{history.replaceState(null,'',location.pathname+location.search+'#'+id)}catch(e){}}
  PAGES.forEach(function(p){if(v.indexOf(p)<0)hook(p,'hide')});
}
var TOC_PAGES=['contents','welcome','philosophy','dna','road','placement','calcA','rainbow','app','sheet','start','consult'];
function chapterOf(pg){
  if(!pg)return'';
  var idx=PAGES.indexOf(pg),best=null;
  for(var i=0;i<=idx;i++){var p=PAGES[i];if(p.hasAttribute('data-toc'))best=p.getAttribute('data-toc')}
  if(best==null)return t('ep.k');
  return best==='0'?t('ui.contents'):t('toc.'+best);
}

/* ───────── 복제본(넘기는 종이 면) ───────── */
function cloneFor(pg,side){
  var c=pg.cloneNode(true);
  c.classList.add('is-clone');setSide(c,side);c.setAttribute('inert','');c.setAttribute('aria-hidden','true');
  var src=pg.querySelectorAll('canvas'),dst=c.querySelectorAll('canvas');
  for(var i=0;i<src.length;i++){try{dst[i].width=src[i].width;dst[i].height=src[i].height;dst[i].getContext('2d').drawImage(src[i],0,0)}catch(e){}}
  $$('video',c).forEach(function(v){v.removeAttribute('src');v.preload='none';v.load&&v.load()});
  $$('[id]',c).forEach(function(n){n.removeAttribute('id')});
  return c;
}

/* ───────── 3D 종이 ─────────
   seg[i] 는 seg[i-1] 의 자식이라 각도가 누적된다. phi[i] 는 띠 i 의 절대 각도(0 = 오른쪽에 누움, π = 왼쪽에 누움). */
var leaf=null;
function buildLeaf(front,back,N){
  host.replaceChildren();
  var W=G.pw,sw=W/N,parent=host,segs=[];
  host.style.setProperty('--pw',W+'px');
  for(var i=0;i<N;i++){
    var seg=document.createElement('div');seg.className='seg';
    seg.style.width=(sw+(i<N-1?1.5:0))+'px';seg.style.left=(i===0?0:sw)+'px';
    var ff=document.createElement('div');ff.className='face face-front';
    var fb=document.createElement('div');fb.className='face face-back';
    if(front){var cf=cloneFor(front,'right');cf.style.setProperty('--off',(-i*sw)+'px');ff.appendChild(cf)}else ff.classList.add('face-blank');
    if(back){var cb=cloneFor(back,'left');cb.style.setProperty('--off',(-(N-1-i)*sw)+'px');fb.appendChild(cb)}else fb.classList.add('face-blank');
    var sf=document.createElement('i');sf.className='sh';ff.appendChild(sf);
    var sb=document.createElement('i');sb.className='sh';fb.appendChild(sb);
    seg.appendChild(ff);seg.appendChild(fb);parent.appendChild(seg);parent=seg;
    segs.push({seg:seg,sf:sf,sb:sb});
  }
  return {segs:segs,N:N,sw:sw};
}
function phis(theta,p,lead,N,bendK){
  var B=(bendK==null?1:bendK)*.95*Math.sin(p*Math.PI),out=[];
  for(var i=0;i<N;i++){var s=(i+.5)/N;out.push(clamp(theta+lead*B*Math.pow(s,1.6),0,Math.PI))}
  return out;
}
function tipOf(ph,sw){var x=0,z=0;for(var i=0;i<ph.length;i++){x+=sw*Math.cos(ph[i]);z+=sw*Math.sin(ph[i])}return {x:x,z:z}}
function dark(a){var s=Math.sin(a);return .5*Math.pow(s,1.25)}
function renderLeaf(turn,p){
  var lf=turn.leaf,N=lf.N,lead=turn.dir>0?1:-1;
  var theta=turn.dir>0?p*Math.PI:(1-p)*Math.PI;
  var ph=phis(theta,p,lead,N,turn.bendK);
  var prev=0;
  for(var i=0;i<N;i++){
    lf.segs[i].seg.style.transform='rotateY('+(-(ph[i]-prev))+'rad)';prev=ph[i];
  }
  // 명암: 띠 경계의 각도로 그라디언트를 이어 붙인다
  var bd=[];for(var j=0;j<=N;j++){bd.push(j===0?ph[0]:j===N?ph[N-1]:(ph[j-1]+ph[j])/2)}
  for(var k=0;k<N;k++){
    var a=dark(bd[k]),b=dark(bd[k+1]);
    var glint=Math.max(0,(ph[Math.min(k+1,N-1)]-ph[k]))*1.6; // 휘는 곳의 반사광
    lf.segs[k].sf.style.background='linear-gradient(90deg,rgba(38,24,4,'+a.toFixed(3)+'),rgba(38,24,4,'+b.toFixed(3)+'))'+(glint>.02?',linear-gradient(90deg,transparent 40%,rgba(255,252,240,'+Math.min(.35,glint).toFixed(3)+'),transparent)':'');
    lf.segs[k].sb.style.background='linear-gradient(90deg,rgba(38,24,4,'+(b*.8).toFixed(3)+'),rgba(38,24,4,'+(a*.8).toFixed(3)+'))';
  }
  // 아래 쪽에 떨어지는 그림자
  var tip=tipOf(ph,lf.sw),W=G.pw,lift=clamp(tip.z/(W*.55),0,1);
  var sa=(.42*lift).toFixed(3),sw=Math.round(18+W*.28*lift);
  if(tip.x>=0){
    castR.style.opacity=1;castL.style.opacity=0;
    castR.style.background='linear-gradient(90deg,transparent '+Math.max(0,tip.x-2)+'px,rgba(20,12,0,'+sa+') '+tip.x+'px,transparent '+(tip.x+sw)+'px)';
  }else if(mode==='spread'){
    var X=W+tip.x;
    castL.style.opacity=1;castR.style.opacity=0;
    castL.style.background='linear-gradient(90deg,transparent '+(X-sw)+'px,rgba(20,12,0,'+sa+') '+X+'px,transparent '+(X+2)+'px)';
  }else{castR.style.opacity=0}
  turn.p=p;
}
function thetaForTip(target,turn){ // 손가락 위치(종이 끝 x)에 맞는 각도를 이분법으로 찾는다
  var lead=turn.dir>0?1:-1,N=turn.leaf.N,sw=turn.leaf.sw,lo=0,hi=Math.PI;
  for(var it=0;it<24;it++){
    var mid=(lo+hi)/2,p=turn.dir>0?mid/Math.PI:1-mid/Math.PI;
    var x=tipOf(phis(mid,p,lead,N,turn.bendK),sw).x;
    if(x>target)lo=mid;else hi=mid;
  }
  var th=(lo+hi)/2;return turn.dir>0?th/Math.PI:1-th/Math.PI;
}

function beginTurn(target){
  var dir=target>vi?1:-1,cur=views[vi],tgt=views[target];
  var front,back,N=mode==='spread'?10:8;
  var turn={dir:dir,target:target,from:vi,p:0,bendK:1};
  if(mode==='spread'){
    if(dir>0){front=cur[1];back=tgt[0];prepare(tgt[0],'left');prepare(tgt[1],'right')}
    else{front=tgt[1];back=cur[0];prepare(tgt[0],'left');prepare(tgt[1],'right')}
  }else{front=dir>0?cur[0]:tgt[0];back=null;prepare(tgt[0],'right')}
  turn.leaf=buildLeaf(front,back,N);
  // 드러날 쪽을 미리 깐다
  if(mode==='spread'){
    if(dir>0){clearSlot(slotR,[]);if(tgt[1])put(slotR,tgt[1],'right')}
    else{clearSlot(slotL,[]);if(tgt[0])put(slotL,tgt[0],'left')}
  }else if(dir>0){clearSlot(slotR,[]);put(slotR,tgt[0],'right')}
  busy=true;bookEl.classList.add('is-turning');document.body.classList.add('is-turning');
  pauseMedia();
  renderLeaf(turn,0);
  return turn;
}
function endTurn(turn,done){
  host.replaceChildren();castL.style.opacity=0;castR.style.opacity=0;
  bookEl.classList.remove('is-turning');document.body.classList.remove('is-turning');busy=false;
  if(done)vi=turn.target;
  place();
}
function animate(turn,from,to,ms,cb){
  // 시계는 첫 프레임이 그려진 뒤부터 가고, 한 프레임이 길어도 40ms 이상 건너뛰지 않는다
  // (느린 기기에서 첫 프레임이 무거워 종이가 한 번에 '툭' 넘어가 버리지 않게).
  var el=0,last=null;
  function ease(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
  function step(now){
    if(last===null){last=now;requestAnimationFrame(step);return}
    el+=Math.min(now-last,40);last=now;
    var k=clamp(el/ms,0,1),e=turn.easeOut?1-Math.pow(1-k,3):ease(k);
    renderLeaf(turn,from+(to-from)*e);
    if(k<1)requestAnimationFrame(step);else cb();
  }
  requestAnimationFrame(step);
}
function go(target,opts){
  opts=opts||{};
  if(!isOpen||busy||target===vi||target<0||target>=views.length)return;
  if(reduced()){vi=target;place();return}
  var turn=beginTurn(target);sound();
  animate(turn,0,1,mode==='spread'?1050:850,function(){endTurn(turn,true);if(opts.focus)focusView()});
}
function next(){go(vi+1)}
function prev(){go(vi-1)}
function goPage(id){var p=byId[id];if(p)go(viewOf(p))}
function focusView(){var v=views[vi],el=v&&(v[0]||v[1]);var h=el&&el.querySelector('.h2,button,a');if(h&&h.focus){if(!h.hasAttribute('tabindex')&&h.classList.contains('h2'))h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}

/* ───────── 끌어서 넘기기 ───────── */
var NO_TURN='[data-no-turn],a,button:not(.peel),input,select,textarea,video,label,[role="slider"]';
bookEl.addEventListener('pointerdown',function(e){
  if(!isOpen||busy||e.button>0)return;
  if(e.target.closest(NO_TURN))return;
  var r=bookEl.getBoundingClientRect();
  drag={id:e.pointerId,x0:e.clientX,y0:e.clientY,x:e.clientX,t:performance.now(),hist:[],turn:null,rect:r,peel:!!e.target.closest('.peel')};
});
window.addEventListener('pointermove',function(e){
  if(!drag||e.pointerId!==drag.id)return;
  var dx=e.clientX-drag.x0,dy=e.clientY-drag.y0;
  drag.x=e.clientX;drag.hist.push([performance.now(),e.clientX]);if(drag.hist.length>8)drag.hist.shift();
  if(!drag.turn){
    if(Math.abs(dx)<8||Math.abs(dx)<Math.abs(dy)*1.15)return;
    var r=drag.rect,spine=mode==='spread'?r.left+G.pw:r.left,dir;
    if(mode==='spread')dir=drag.x0>spine?(dx<0?1:0):(dx>0?-1:0);else dir=dx<0?1:-1;
    var target=vi+dir;
    if(!dir||target<0||target>=views.length){drag=null;return}
    drag.turn=beginTurn(target);drag.turn.bendK=1.15;drag.spine=spine;sound();
    try{bookEl.setPointerCapture(e.pointerId)}catch(err){}
  }
  var tn=drag.turn,W=G.pw,sp=drag.spine,x0=drag.x0,tip,g;
  if(tn.dir>0){g=(mode==='spread'?2*W:1.25*W)/Math.max(40,x0-(mode==='spread'?sp-W:sp));tip=W+(e.clientX-x0)*g}
  else{g=2*W/Math.max(40,(mode==='spread'?sp+W:sp+W)-x0);tip=-W+(e.clientX-x0)*g}
  renderLeaf(tn,clamp(thetaForTip(clamp(tip,-W,W),tn),0,1));
  e.preventDefault();
},{passive:false});
function endDrag(e){
  if(!drag||(e&&e.pointerId!==drag.id))return;
  var d=drag;drag=null;
  if(!d.turn){if(d.peel&&e&&e.type==='pointerup'){(e.target.closest('.peel-prev')?prev:next)()}return}
  var h=d.hist,v=0;if(h.length>1){var a=h[0],b=h[h.length-1];v=(b[1]-a[1])/Math.max(1,b[0]-a[0])}
  var tn=d.turn,fwd=tn.dir>0,flick=fwd?v<-.35:v>.35,back=fwd?v>.35:v<-.35;
  var done=!back&&(tn.p>.42||flick);
  tn.easeOut=true;tn.bendK=1;
  animate(tn,tn.p,done?1:0,Math.max(220,(done?1-tn.p:tn.p)*700),function(){endTurn(tn,done)});
}
window.addEventListener('pointerup',endDrag);window.addEventListener('pointercancel',endDrag);
peelNext.addEventListener('click',function(e){if(e.detail===0)next()});
peelPrev.addEventListener('click',function(e){if(e.detail===0)prev()});

/* ───────── 소리 ───────── */
var soundOn=store('nm_promo_sound')!=='0',actx=null;
function sound(){
  if(!soundOn||reduced())return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==='suspended')actx.resume();
    var dur=.42,sr=actx.sampleRate,buf=actx.createBuffer(1,Math.floor(sr*dur),sr),d=buf.getChannelData(0);
    for(var i=0;i<d.length;i++){var x=i/d.length;d[i]=(Math.random()*2-1)*Math.pow(Math.sin(Math.PI*Math.min(1,x*1.4)),2)*(1-x*.6)}
    var src=actx.createBufferSource();src.buffer=buf;
    var bp=actx.createBiquadFilter();bp.type='bandpass';bp.Q.value=.8;
    bp.frequency.setValueAtTime(2600,actx.currentTime);bp.frequency.exponentialRampToValueAtTime(700,actx.currentTime+dur);
    var g=actx.createGain();g.gain.value=.16;
    src.connect(bp);bp.connect(g);g.connect(actx.destination);src.start();
  }catch(e){}
}
function syncSound(){var b=$('#btnSound');b.setAttribute('aria-pressed',soundOn?'true':'false');b.setAttribute('aria-label',t(soundOn?'ui.soundOff':'ui.soundOn'))}
$('#btnSound').addEventListener('click',function(){soundOn=!soundOn;store('nm_promo_sound',soundOn?'1':'0');syncSound();if(soundOn)sound()});

/* ───────── 표지 열고 닫기 ───────── */
function openBook(instant){
  if(isOpen||busy)return;
  isOpen=true;busy=!instant&&!reduced();
  document.body.classList.add('is-open');
  var v=views[vi];
  if(mode==='spread'){put(slotR,v[1],'right');if(v[0]){if(!instant&&!reduced()&&vi===0){setSide(v[0],'left');coverBack.appendChild(v[0])}else put(slotL,v[0],'left')}}
  else put(slotR,v[0],'right');
  v.forEach(function(p){if(p){fit(p);hook(p,'show')}});
  if(!instant&&!reduced()){bookEl.classList.add('is-anim');void bookEl.offsetWidth}
  bookEl.classList.remove('is-closed');bookEl.classList.add('is-open');
  dock.hidden=false;$('#btnClose').hidden=false;
  if(instant||reduced()){bookEl.classList.add('is-settled');busy=false;place();return}
  sound();
  setTimeout(function(){bookEl.classList.add('is-settled');bookEl.classList.remove('is-anim');busy=false;place();focusView()},1280);
}
function closeBook(){
  if(!isOpen||busy)return;
  pauseMedia();
  busy=!reduced();
  if(!reduced())bookEl.classList.add('is-anim');
  bookEl.classList.remove('is-settled');
  // 한 프레임 뒤에 표지를 되돌린다(보이게 한 다음 회전)
  requestAnimationFrame(function(){
    bookEl.classList.remove('is-open');bookEl.classList.add('is-closed');
    document.body.classList.remove('is-open');dock.hidden=true;$('#btnClose').hidden=true;where.textContent='';
    if(!reduced())sound();
    setTimeout(function(){bookEl.classList.remove('is-anim');busy=false;isOpen=false;vi=0;clearSlot(slotL,[]);clearSlot(slotR,[]);clearSlot(coverBack,[]);try{history.replaceState(null,'',location.pathname+location.search)}catch(e){}$('#openBook').focus({preventScroll:true})},reduced()?0:1250);
  });
}
// 3D 표지 안의 버튼은 크롬에서 클릭 대상이 표지 면으로 잡히는 경우가 있어 표지 전체에서 받는다(키보드 Enter 는 버튼 → 거품으로 올라옴)
cover.addEventListener('click',function(){if(!isOpen)openBook(false)});
$('#btnClose').addEventListener('click',closeBook);
btnPrev.addEventListener('click',prev);btnNext.addEventListener('click',next);
document.addEventListener('keydown',function(e){
  if(!$('#zoom').hidden){if(e.key==='Escape'){closeZoom()}return}
  if(!isOpen){return}
  var tg=e.target,tag=(tg.tagName||'').toLowerCase();
  if(tag==='input'||tag==='textarea'||tag==='select'||tag==='video')return;
  if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(vi+1,{focus:tg===document.body})}
  else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(vi-1,{focus:tg===document.body})}
  else if(e.key==='Home'){e.preventDefault();go(0)}
  else if(e.key==='End'){e.preventDefault();go(views.length-1)}
});
document.addEventListener('click',function(e){
  var g=e.target.closest('[data-go]');if(g&&isOpen){e.preventDefault();goPage(g.getAttribute('data-go'));return}
  if(e.target.closest('[data-close]')){closeBook()}
});

/* ───────── 쪽마다의 움직임(hook) ───────── */
var HOOKS={};
function hook(pg,ev){var h=HOOKS[pg.dataset.page];if(h&&h[ev])try{h[ev](pg)}catch(err){console.error(err)}}

/* 차례 */
HOOKS.contents={lang:function(pg){
  var ol=$('#tocList',pg)||pg.querySelector('.toc');
  ol.innerHTML='';
  for(var i=1;i<=11;i++){
    var id=TOC_PAGES[i],li=document.createElement('li'),b=document.createElement('button');
    b.type='button';b.setAttribute('data-go',id);
    b.innerHTML='<span class="toc-n">'+(i<10?'0'+i:i)+'</span><span class="toc-t"></span><span class="toc-dots" aria-hidden="true"></span><span class="toc-p"></span>';
    b.querySelector('.toc-t').textContent=t('toc.'+i);
    b.querySelector('.toc-p').textContent=pageNo(byId[id]);
    li.appendChild(b);ol.appendChild(li);
  }
}};

/* 8 + 7 펼치기 */
var unfoldStep=0;
var UNFOLD=['8 + 7','8 + <span class="hl">2 + 5</span>','<span class="hl">10</span> + 5','<span class="ans">15</span>'];
function drawUnfold(pg,animateIt){
  var eq=$('#unfoldEq',pg)||pg.querySelector('.unfold-eq span');if(!eq)return;
  var box=eq.parentNode;
  box.innerHTML='<span id="unfoldEq">'+UNFOLD[unfoldStep]+'</span>';
  if(animateIt){box.classList.remove('pop');void box.offsetWidth;box.classList.add('pop')}
  $('#unfoldCap',pg).textContent=t('ph.s'+unfoldStep);
  $('#unfoldBtn',pg).textContent=unfoldStep>=3?t('ph.again'):t('ph.btn');
}
HOOKS.philosophy={
  init:function(pg){$('#unfoldBtn',pg).addEventListener('click',function(){unfoldStep=unfoldStep>=3?0:unfoldStep+1;drawUnfold(pg,true)})},
  lang:function(pg){drawUnfold(pg,false)}
};

/* 기호 카드 */
var SYMS=[['sprout','+'],['sprout','='],['sprout','□'],['middle','x'],['middle','√'],['common1','f(x)'],['algebra','Σ'],['calculus1','∫']];
function stageBy(key){for(var i=0;i<STAGES.length;i++)if(STAGES[i].key===key)return STAGES[i];return null}
function shortName(st){return L(st.name).split(/\s+[—–-]\s+/)[0]}
HOOKS.symbols={lang:function(pg){
  var box=$('#symCards',pg);if(!box)return;
  var open={};$$('.symcard',box).forEach(function(c,i){if(c.getAttribute('aria-pressed')==='true')open[i]=1});
  box.innerHTML='';
  SYMS.forEach(function(pair,i){
    var st=stageBy(pair[0]);if(!st)return;
    var sy=(st.symbols||[]).filter(function(s){return s.sym===pair[1]})[0];if(!sy)return;
    var b=document.createElement('button');b.type='button';b.className='symcard';b.setAttribute('aria-pressed',open[i]?'true':'false');
    b.innerHTML='<span class="symcard-in"><span class="symcard-f"><b></b><small></small></span><span class="symcard-b"><b></b><span></span><small></small></span></span>';
    $('.symcard-f b',b).textContent=sy.sym;$('.symcard-f small',b).textContent=shortName(st);
    $('.symcard-b b',b).textContent=sy.sym;$('.symcard-b span',b).textContent=L(sy.tr);
    $('.symcard-b small',b).textContent=t('sym.stage',{s:shortName(st)});
    b.setAttribute('aria-label',sy.sym+' — '+L(sy.tr));
    b.addEventListener('click',function(){b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true')});
    box.appendChild(b);
  });
}};

/* 로드맵 — 길 그림 + 단계 상세 */
var selStage=0,road=null;
function weeks2(st){var m=(st.meta&&st.meta.en)||'';var r=m.match(/(\d+)\s*weeks at two/);return r?+r[1]:0}
function roadGeometry(){
  // 기준 좌표계(휴대폰은 세로로 긴 뱀길, 데스크톱은 세 줄 뱀길)
  if(mode==='single'){
    var w=340,h=330,pts=[],rows=[[0,1,2],[3,4,5],[6,7],[8,9]],ys=[40,125,210,290];
    rows.forEach(function(r,ri){r.forEach(function(k,ci){var n=r.length,x=n===3?[55,170,285][ci]:[95,245][ci];if(ri%2===1)x=w-x;pts[k]=[x,ys[ri]]})});
    return {w:w,h:h,pts:pts};
  }
  var W=440,H=280,P=[],R=[[0,1,2,3],[4,5,6],[7,8,9]],Y=[42,142,236];
  R.forEach(function(r,ri){r.forEach(function(k,ci){var n=r.length,x=n===4?[50,160,280,392][ci]:[80,220,360][ci];if(ri%2===1)x=W-x;P[k]=[x,Y[ri]]})});
  return {w:W,h:H,pts:P};
}
function roadPath(pts){
  var d='M'+pts[0][0]+' '+pts[0][1],segs=[];
  for(var i=1;i<pts.length;i++){
    var a=pts[i-1],b=pts[i],c1,c2;
    if(Math.abs(a[1]-b[1])<1){c1=[a[0]+(b[0]-a[0])/3,a[1]];c2=[a[0]+2*(b[0]-a[0])/3,b[1]]}
    else{ // 줄 끝에서 바깥으로 도는 굽이
      var half=mode==='single'?170:220,bulge=mode==='single'?50:58;
      var outX=a[0]>half?Math.max(a[0],b[0])+bulge:Math.min(a[0],b[0])-bulge;
      c1=[outX,a[1]];c2=[outX,b[1]];}
    d+=' C'+c1[0]+' '+c1[1]+' '+c2[0]+' '+c2[1]+' '+b[0]+' '+b[1];
    segs.push([a,c1,c2,b]);
  }
  return {d:d,segs:segs};
}
function bez(s,u){var m=1-u;return [m*m*m*s[0][0]+3*m*m*u*s[1][0]+3*m*u*u*s[2][0]+u*u*u*s[3][0],m*m*m*s[0][1]+3*m*m*u*s[1][1]+3*m*u*u*s[2][1]+u*u*u*s[3][1]]}
function makeRoad(){
  var walker={pos:0,raf:0};
  function draw(){
    var pg=byId.road,box=$('#road',pg)||pg.querySelector('.road');if(!box)return;
    var geo=roadGeometry(),rp=roadPath(geo.pts),pts=geo.pts;
    var ns='http://www.w3.org/2000/svg';
    var svg='<svg viewBox="-10 -6 '+(geo.w+20)+' '+(geo.h+20)+'" preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+esc(t('rm.alt'))+'">';
    svg+='<defs><linearGradient id="rdg" x1="0" x2="1"><stop offset="0" stop-color="#6fa85b"/><stop offset=".45" stop-color="#16417c"/><stop offset=".7" stop-color="#1b6e5b"/><stop offset="1" stop-color="#5b3a8f"/></linearGradient></defs>';
    // 풍경: 언덕과 나무 몇 그루(장식)
    svg+='<g opacity=".55"><ellipse cx="'+(geo.w*.18)+'" cy="'+(geo.h*.93)+'" rx="'+(geo.w*.3)+'" ry="22" fill="#e6dcbf"/><ellipse cx="'+(geo.w*.8)+'" cy="'+(geo.h*.08)+'" rx="'+(geo.w*.25)+'" ry="16" fill="#e9dfc5"/></g>';
    svg+='<path d="'+rp.d+'" fill="none" stroke="#e7d8b4" stroke-width="20" stroke-linecap="round"/>';
    svg+='<path d="'+rp.d+'" fill="none" stroke="#fffaf0" stroke-width="14" stroke-linecap="round"/>';
    svg+='<path d="'+rp.d+'" fill="none" stroke="url(#rdg)" stroke-width="2.4" stroke-dasharray="1 7" stroke-linecap="round"/>';
    svg+='<text x="'+(geo.w-4)+'" y="'+(pts[9][1]-24)+'" text-anchor="end" font-size="16">🏔️</text>';
    var deco=mode==='single'?[[18,82,'🌳'],[322,168,'🌲'],[20,252,'🌲'],[330,330,'🌳']]:[[8,94,'🌳'],[436,92,'🌲'],[14,190,'🌲'],[250,190,'🌳'],[150,94,'🌷']];
    deco.forEach(function(d){svg+='<text class="road-deco" x="'+d[0]+'" y="'+d[1]+'" text-anchor="middle">'+d[2]+'</text>'});
    pts.forEach(function(p,i){
      var st=STAGES[i];if(!st)return;
      var below=mode==='single'?true:true,ly=p[1]+26;
      svg+='<g class="st'+(i===selStage?' is-on':'')+'" data-i="'+i+'" tabindex="0" role="button" aria-label="'+esc((i+1)+'. '+L(st.name)+' — '+L(st.band))+'" style="--ac:'+st.accent+'">';
      svg+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="20" fill="transparent"/>';
      svg+='<circle class="dot" cx="'+p[0]+'" cy="'+p[1]+'" r="12.5"/>';
      svg+='<text class="num" x="'+p[0]+'" y="'+p[1]+'">'+(i+1)+'</text>';
      svg+='<text class="ico" x="'+(p[0]+17)+'" y="'+(p[1]-14)+'">'+esc(st.icon)+'</text>';
      svg+='<text class="lbl" x="'+p[0]+'" y="'+ly+'">'+esc(shortName(st))+'</text>';
      svg+='</g>';
    });
    svg+='<image class="walker" href="../assets/characters/numi-0.png" width="26" height="33" x="0" y="0"/>';
    svg+='</svg>';
    box.innerHTML=svg;
    walker.rp=rp;walker.svg=box.querySelector('svg');
    $$('.st',box).forEach(function(g){
      var i=+g.getAttribute('data-i');
      g.addEventListener('click',function(){select(i)});
      g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i)}});
    });
    walker.pos=selStage;placeWalker(selStage);
  }
  function posAt(f){ // f: 0..9 (정거장 번호, 소수 = 사이)
    var rp=walker.rp;if(!rp)return [0,0];
    var i=Math.min(Math.floor(f),rp.segs.length-1),u=clamp(f-i,0,1);
    if(f>=rp.segs.length){return rp.segs[rp.segs.length-1][3]}
    return bez(rp.segs[i],u);
  }
  function placeWalker(f){
    var svg=walker.svg;if(!svg)return;var w=svg.querySelector('.walker');if(!w)return;
    var p=posAt(f);w.setAttribute('x',p[0]-13);w.setAttribute('y',p[1]-44);
  }
  function walkTo(i){
    cancelAnimationFrame(walker.raf);
    var from=walker.pos,to=i;if(reduced()||!byId.road.isConnected){walker.pos=to;placeWalker(to);return}
    var t0=performance.now(),ms=Math.min(1600,300+Math.abs(to-from)*170);
    function st(now){var k=clamp((now-t0)/ms,0,1),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;walker.pos=from+(to-from)*e;placeWalker(walker.pos);if(k<1)walker.raf=requestAnimationFrame(st)}
    walker.raf=requestAnimationFrame(st);
  }
  function select(i){
    selStage=i;
    $$('.st',byId.road).forEach(function(g){g.classList.toggle('is-on',+g.getAttribute('data-i')===i)});
    walkTo(i);drawStageNow();drawStage();
  }
  return {draw:draw,select:select};
}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function drawStageNow(){
  var st=STAGES[selStage],el=byId.road&&$('#roadNow',byId.road);if(!st||!el)return;
  el.innerHTML='<b>'+(selStage+1)+'. '+esc(L(st.name))+'</b> · '+esc(L(st.band));
}
function drawStage(){
  var pg=byId.stage,box=pg&&$('#stageCard',pg);if(!box)return;
  var st=STAGES[selStage];if(!st)return;
  var c=st.courses.from===st.courses.to?String(st.courses.from):st.courses.from+'–'+st.courses.to;
  var h='<p class="kicker">'+esc(t('st.k',{n:selStage+1,c:c}))+'</p>';
  h+='<div class="st-head"><span class="st-icon" style="background:'+st.accent+'">'+esc(st.icon)+'</span><div><h2 class="h2">'+esc(L(st.name))+'</h2><p class="st-band">'+esc(L(st.band))+'</p></div></div>';
  if(st.status==='partial')h+='<p class="st-tag">'+esc(t('st.partial'))+'</p>';
  h+='<section class="st-sec"><h3>'+esc(t('st.learn'))+'</h3><p>'+esc(L(st.learn))+'</p></section>';
  h+='<p class="st-ex">'+esc(st.example)+'</p>';
  h+='<section class="st-sec"><h3>'+esc(t('st.how'))+'</h3><p>'+esc(L(st.how))+'</p></section>';
  if(st.symbols&&st.symbols.length){h+='<section class="st-sec"><h3>'+esc(t('st.sym'))+'</h3><ul class="st-syms">'+st.symbols.map(function(s){return '<li><b>'+esc(s.sym)+'</b>'+esc(L(s.tr))+'</li>'}).join('')+'</ul></section>'}
  var aside=st.aheadNote||st.freeNote;
  h+='<p class="st-meta">'+esc(L(st.meta))+'</p>';
  if(aside)h+='<p class="st-aside">'+esc(L(aside))+'</p>';
  box.innerHTML=h;
  var a=0,tot=0;STAGES.forEach(function(s){var w=weeks2(s);tot+=w;if(s.courses.to<=25)a+=w});
  $('#stageTotal',pg).innerHTML=t('st.total',{a:a,t:tot});
  var dots=$('#stageDots',pg);if(dots)dots.innerHTML=STAGES.map(function(x,i){return '<i'+(i===selStage?' class="on"':'')+'></i>'}).join('');
  $('#stPrev',pg).disabled=selStage<=0;$('#stNext',pg).disabled=selStage>=STAGES.length-1;
  pg.dataset.state='s'+selStage;
  if(pg.isConnected&&pg.parentNode!==null)fit(pg);
}
HOOKS.road={
  init:function(){road=makeRoad();$('#roadMore',byId.road).addEventListener('click',function(){goPage('stage')})},
  lang:function(){road&&road.draw();drawStageNow()},
  show:function(){if(road&&!$('#road svg',byId.road))road.draw()}
};
HOOKS.stage={lang:function(){drawStage()},init:function(pg){
  $('#stPrev',pg).addEventListener('click',function(){if(selStage>0&&road)road.select(selStage-1)});
  $('#stNext',pg).addEventListener('click',function(){if(selStage<STAGES.length-1&&road)road.select(selStage+1)});
}};
HOOKS.pace={show:function(pg){var f=pg.querySelector('.pacechart');if(!f||reduced())return;f.classList.remove('is-live');void f.offsetWidth;f.classList.add('is-live')}};

/* ───────── 실험실: 미분(할선 → 접선) ───────── */
function setupCanvas(cv){
  var w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return null;
  var k=G.s*(window.devicePixelRatio||1);
  var W=Math.round(w*k),H=Math.round(h*k);
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H}
  var c=cv.getContext('2d');c.setTransform(k,0,0,k,0,0);return {c:c,w:w,h:h};
}
function worldMap(g,x0,x1,y0,y1,pad){
  pad=pad||{l:30,r:14,t:14,b:26};
  var sx=(g.w-pad.l-pad.r)/(x1-x0),sy=(g.h-pad.t-pad.b)/(y1-y0);
  return {X:function(x){return pad.l+(x-x0)*sx},Y:function(y){return g.h-pad.b-(y-y0)*sy},ix:function(px){return x0+(px-pad.l)/sx},x0:x0,x1:x1,y0:y0,y1:y1,pad:pad};
}
function axes(c,g,m,xt,yt){
  c.clearRect(0,0,g.w,g.h);
  c.strokeStyle='rgba(60,50,20,.08)';c.lineWidth=1;
  xt.forEach(function(x){c.beginPath();c.moveTo(m.X(x),m.Y(m.y0));c.lineTo(m.X(x),m.Y(m.y1));c.stroke()});
  yt.forEach(function(y){c.beginPath();c.moveTo(m.X(m.x0),m.Y(y));c.lineTo(m.X(m.x1),m.Y(y));c.stroke()});
  c.strokeStyle='rgba(30,42,40,.55)';c.lineWidth=1.3;
  c.beginPath();c.moveTo(m.X(m.x0),m.Y(0));c.lineTo(m.X(m.x1),m.Y(0));c.stroke();
  c.beginPath();c.moveTo(m.X(0),m.Y(m.y0));c.lineTo(m.X(0),m.Y(m.y1));c.stroke();
  c.fillStyle='rgba(30,42,40,.6)';c.font='600 10px Pretendard Variable, sans-serif';c.textAlign='center';c.textBaseline='top';
  xt.forEach(function(x){if(x)c.fillText(x,m.X(x),m.Y(0)+4)});
  c.textAlign='right';c.textBaseline='middle';
  yt.forEach(function(y){if(y)c.fillText(y,m.X(0)-5,m.Y(y))});
}
function curve(c,m,f,a,b,color,w){c.strokeStyle=color;c.lineWidth=w||2.6;c.beginPath();for(var i=0;i<=120;i++){var x=a+(b-a)*i/120,y=f(x);i?c.lineTo(m.X(x),m.Y(y)):c.moveTo(m.X(x),m.Y(y))}c.stroke()}
var tanState={v:62,won:false,pulse:0};
function hOf(v){return v<=0?0:1.2*Math.pow(v/100,1.6)}
function vOfH(h){return h<=0?0:100*Math.pow(h/1.2,1/1.6)}
function drawTan(pg){
  var cv=$('#cvTan',pg);if(!cv)return;var g=setupCanvas(cv);if(!g)return;var c=g.c;
  var m=worldMap(g,-.3,2.3,-.4,5);
  axes(c,g,m,[0,1,2],[0,1,2,3,4]);
  var f=function(x){return x*x};
  curve(c,m,f,-.25,2.2,'#17665a',2.6);
  var h=hOf(tanState.v),px=1,py=1,qx=1+h,qy=qx*qx,slope=h>0?(qy-py)/h:2;
  // 직선
  c.strokeStyle=h===0?'#b8862f':'#d09a3a';c.lineWidth=2.2;c.setLineDash(h===0?[]:[]);
  var xa=-.3,xb=2.3;c.beginPath();c.moveTo(m.X(xa),m.Y(py+slope*(xa-px)));c.lineTo(m.X(xb),m.Y(py+slope*(xb-px)));c.stroke();
  if(h>.08){ // 기울기 삼각형
    c.setLineDash([4,4]);c.strokeStyle='rgba(30,42,40,.45)';c.lineWidth=1.2;
    c.beginPath();c.moveTo(m.X(px),m.Y(py));c.lineTo(m.X(qx),m.Y(py));c.lineTo(m.X(qx),m.Y(qy));c.stroke();c.setLineDash([]);
    c.fillStyle='rgba(30,42,40,.7)';c.font='600 10px Pretendard Variable, sans-serif';c.textAlign='center';c.textBaseline='top';
    c.fillText('h',m.X(px+h/2),m.Y(py)+3);
  }
  c.setLineDash([]);
  // 점
  c.fillStyle='#1e2a28';c.beginPath();c.arc(m.X(px),m.Y(py),5,0,7);c.fill();
  c.font='700 12px Fraunces, serif';c.textAlign='right';c.textBaseline='bottom';c.fillText('P',m.X(px)-6,m.Y(py)-4);
  if(h>0){
    var qX=m.X(qx),qY=m.Y(qy);
    c.fillStyle='rgba(208,154,58,.22)';c.beginPath();c.arc(qX,qY,13+3*Math.sin(tanState.pulse),0,7);c.fill();
    c.fillStyle='#d09a3a';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(qX,qY,7.5,0,7);c.fill();c.stroke();
    c.fillStyle='#8a6420';c.textAlign='left';c.fillText('Q',qX+10,qY-4);
    if(!tanState.touched){c.font='700 11px Pretendard Variable, sans-serif';c.fillStyle='#17665a';c.textAlign='right';c.fillText('← '+t('ca.drag'),Math.min(g.w-6,qX+60),qY+26)}
  }else{
    c.fillStyle='#b8862f';c.font='700 11px Pretendard Variable, sans-serif';c.textAlign='left';c.fillText('y = 2x − 1',m.X(1.55),m.Y(2.1+.2));
  }
  c.fillStyle='#17665a';c.font='italic 600 12px Fraunces, serif';c.textAlign='left';c.textBaseline='middle';c.fillText('y = x²',m.X(1.62),m.Y(4.6));
  var rd=$('#readTan',pg);
  if(h===0){rd.innerHTML=esc(t('ca.tan'));rd.classList.add('is-win')}
  else{rd.classList.remove('is-win');rd.innerHTML=esc(t('ca.gap',{h:h.toFixed(h<.1?3:2)}))+' · '+esc(t('ca.slope'))+' = <b>'+slope.toFixed(h<.1?3:2)+'</b>'}
  tanState.map=m;
}
HOOKS.calcA={
  init:function(pg){
    var rg=$('#rgTan',pg),cv=$('#cvTan',pg);
    rg.value=tanState.v;
    rg.addEventListener('input',function(){tanState.touched=true;tanState.v=+rg.value;drawTan(pg)});
    var dragging=false;
    function fromEvt(e){tanState.touched=true;var r=cv.getBoundingClientRect(),m=tanState.map;if(!m)return;var px=(e.clientX-r.left)/r.width*cv.clientWidth,x=m.ix(px);var h=clamp(x-1,0,1.2);if(h<.012)h=0;tanState.v=Math.round(vOfH(h));rg.value=tanState.v;drawTan(pg)}
    cv.addEventListener('pointerdown',function(e){dragging=true;try{cv.setPointerCapture(e.pointerId)}catch(err){}fromEvt(e);e.preventDefault()});
    cv.addEventListener('pointermove',function(e){if(dragging){fromEvt(e);e.preventDefault()}});
    cv.addEventListener('pointerup',function(){dragging=false});cv.addEventListener('pointercancel',function(){dragging=false});
  },
  show:function(pg){drawTan(pg);startPulse(pg)},
  hide:function(){stopPulse()},
  lang:function(pg){if(pg.isConnected)drawTan(pg)}
};
var pulseRaf=0;
function startPulse(pg){if(reduced())return;cancelAnimationFrame(pulseRaf);var last=0;(function loop(now){if(!pg.isConnected||busy&&0){return}if(now-last>60){tanState.pulse+=.35;if(!busy)drawTan(pg);last=now}pulseRaf=requestAnimationFrame(loop)})(0)}
function stopPulse(){cancelAnimationFrame(pulseRaf)}

/* ───────── 실험실: 적분(직사각형) ───────── */
var areaN=4;
function drawArea(pg){
  var cv=$('#cvArea',pg);if(!cv)return;var g=setupCanvas(cv);if(!g)return;var c=g.c;
  var m=worldMap(g,-.15,2.25,-.3,4.5);
  axes(c,g,m,[0,1,2],[0,1,2,3,4]);
  var n=areaN,dx=2/n,sum=0;
  for(var i=0;i<n;i++){
    var x=i*dx,y=x*x;sum+=y*dx;
    var hue=165-i/n*40;
    c.fillStyle='hsla('+hue+',45%,42%,.30)';c.strokeStyle='hsla('+hue+',50%,30%,.55)';c.lineWidth=n>40?.5:1;
    c.fillRect(m.X(x),m.Y(y),m.X(x+dx)-m.X(x),m.Y(0)-m.Y(y));
    if(n<=40)c.strokeRect(m.X(x),m.Y(y),m.X(x+dx)-m.X(x),m.Y(0)-m.Y(y));
  }
  curve(c,m,function(x){return x*x},-.1,2.15,'#17665a',2.6);
  c.fillStyle='#17665a';c.font='italic 600 12px Fraunces, serif';c.textAlign='left';c.textBaseline='middle';c.fillText('y = x²',m.X(1.5),m.Y(3.6));
  var rd=$('#readArea',pg),err=Math.abs(sum-8/3);
  if(err<.06){rd.innerHTML=esc(t('cb.done'));rd.classList.add('is-win')}
  else{rd.classList.remove('is-win');rd.innerHTML=esc(t('cb.n',{n:n}))+' · '+esc(t('cb.sum'))+' = <b>'+sum.toFixed(3)+'</b> <small style="color:var(--ink-3);font-weight:600">('+esc(t('cb.true'))+')</small>'}
  $('#areaMeter',pg).style.width=clamp(sum/(8/3)*100,0,100)+'%';
}
HOOKS.calcB={
  init:function(pg){
    var rg=$('#rgArea',pg);rg.value=areaN;
    rg.addEventListener('input',function(){areaN=+rg.value;drawArea(pg)});
    $('#areaMore',pg).addEventListener('click',function(){areaN=Math.min(80,areaN<10?areaN+2:areaN+10);rg.value=areaN;drawArea(pg)});
    $('#areaLess',pg).addEventListener('click',function(){areaN=Math.max(1,areaN<=10?areaN-2:areaN-10);if(areaN<1)areaN=1;rg.value=areaN;drawArea(pg)});
    var cv=$('#cvArea',pg),dragging=false,x0=0,n0=0;
    cv.addEventListener('pointerdown',function(e){dragging=true;x0=e.clientX;n0=areaN;try{cv.setPointerCapture(e.pointerId)}catch(err){}e.preventDefault()});
    cv.addEventListener('pointermove',function(e){if(!dragging)return;var r=cv.getBoundingClientRect();areaN=clamp(Math.round(n0+(e.clientX-x0)/r.width*80),1,80);rg.value=areaN;drawArea(pg);e.preventDefault()});
    cv.addEventListener('pointerup',function(){dragging=false});cv.addEventListener('pointercancel',function(){dragging=false});
  },
  show:function(pg){drawArea(pg)},lang:function(pg){if(pg.isConnected)drawArea(pg)}
};

/* ───────── 실험실: 무지개 덧셈 ───────── */
var RB={N:10,done:{},sel:0,big:false,anim:0};
var RAINBOW=['#e85d5d','#f09a3e','#e9c34a','#5fb876','#5b8dd9','#6c63c7','#b15fc1'];
function rbCells(){if(RB.N<=20){var a=[];for(var i=1;i<=RB.N;i++)a.push(i);return a}return [1,2,3,4,5,0,96,97,98,99,100]}
function rbX(v){return (v-.5)/RB.N*600}
function drawRainbow(pg){
  var row=$('#rbRow',pg),svg=$('#rbArcs',pg);if(!row)return;
  $$('.rb-picks .chip',pg).forEach(function(b){b.classList.toggle('is-on',+b.dataset.n===RB.N);b.setAttribute('aria-pressed',+b.dataset.n===RB.N?'true':'false')});
  row.innerHTML='';
  var S=RB.N+1,mid=RB.N%2?(RB.N+1)/2:0,pairsDone=Object.keys(RB.done).length/2,allPairs=Math.floor(RB.N/2);
  rbCells().forEach(function(v){
    var b=document.createElement('button');b.type='button';b.className='rb-cell';
    if(!v){b.className+=' is-gap';b.textContent='…';b.disabled=true;b.setAttribute('aria-hidden','true')}
    else{b.textContent=v;b.dataset.v=v;
      if(RB.done[v])b.classList.add('is-done');if(RB.sel===v)b.classList.add('is-sel');if(v===mid&&pairsDone===allPairs)b.classList.add('is-mid');
      if(RB.N>20)b.disabled=true;
    }
    row.appendChild(b);
  });
  // 무지개
  var html='',k=0;
  if(RB.N<=20){for(var gi=1;gi<=Math.floor(RB.N/2);gi++){if(RB.done[gi])continue;var gx1=rbX(gi),gx2=rbX(S-gi),grx=(gx2-gx1)/2;html+='<path d="M'+gx1.toFixed(1)+' 168 A'+grx.toFixed(1)+' '+Math.min(grx*.95,160).toFixed(1)+' 0 0 1 '+gx2.toFixed(1)+' 168" stroke="rgba(30,42,40,.12)" stroke-width="2" stroke-dasharray="3 6"/>'}}
  var keys=Object.keys(RB.done).map(Number).filter(function(v){return v<S-v}).sort(function(a,b){return a-b});
  keys.forEach(function(a){var b=S-a,x1=rbX(RB.N>20?a:a),x2=rbX(b),rx=(x2-x1)/2,ry=Math.min(rx*.95,160);
    var col=RAINBOW[(a-1)%RAINBOW.length],w=RB.N>20?2.2:7;
    html+='<path d="M'+x1.toFixed(1)+' 168 A'+rx.toFixed(1)+' '+ry.toFixed(1)+' 0 0 1 '+x2.toFixed(1)+' 168" stroke="'+col+'" stroke-width="'+w+'" opacity=".9"/>';k++});
  svg.innerHTML=html;
  var rd=$('#rbRead',pg);rd.classList.remove('is-win');
  if(RB.N>20){
    if(pairsDone>=50){rd.textContent=t('rb.bigDone');rd.classList.add('is-win')}
    else if(RB.anim){rd.textContent=t('rb.drawing')+' '+pairsDone+' / 50'}
    else{rd.innerHTML='<button class="btn btn-gold" type="button" id="rbBig">'+esc(t('rb.big'))+'</button>'}
  }else if(pairsDone===allPairs){
    var total=RB.N*(RB.N+1)/2;
    rd.textContent=mid?t('rb.pairsMid',{k:allPairs,s:S,m:mid,t:total}):t('rb.pairs',{k:allPairs,s:S,t:total});rd.classList.add('is-win');
  }else if(RB.msg){rd.textContent=RB.msg}
  else rd.textContent=t('rb.tap');
}
function rbTap(pg,v){
  if(RB.N>20||RB.done[v])return;
  var S=RB.N+1;
  if(!RB.sel){RB.sel=v;RB.msg='';drawRainbow(pg);return}
  if(RB.sel===v){RB.sel=0;drawRainbow(pg);return}
  if(RB.sel+v===S){RB.done[RB.sel]=1;RB.done[v]=1;RB.msg=RB.sel+' + '+v+' = '+S;RB.sel=0;drawRainbow(pg)}
  else{var bad=v;RB.msg=t('rb.wrong',{s:S});RB.sel=0;drawRainbow(pg);var cell=pg.querySelector('.rb-cell[data-v="'+bad+'"]');if(cell)cell.classList.add('is-bad')}
}
function rbBig(pg){
  if(RB.anim)return;RB.done={};
  if(reduced()){for(var i=1;i<=100;i++)RB.done[i]=1;drawRainbow(pg);return}
  var k=0;RB.anim=1;
  (function stepAnim(){k++;RB.done[k]=1;RB.done[101-k]=1;drawRainbow(pg);if(k<50&&byId.rainbow.isConnected)setTimeout(stepAnim,34);else{RB.anim=0;for(var j=k+1;j<=50;j++){RB.done[j]=1;RB.done[101-j]=1}drawRainbow(pg)}})();
}
HOOKS.rainbow={
  init:function(pg){
    $('#rbRow',pg).addEventListener('click',function(e){var b=e.target.closest('.rb-cell');if(b&&b.dataset.v)rbTap(pg,+b.dataset.v)});
    $$('.rb-picks .chip',pg).forEach(function(b){b.addEventListener('click',function(){RB.N=+b.dataset.n;RB.done={};RB.sel=0;RB.msg='';RB.anim=0;drawRainbow(pg)})});
    $('#rbReset',pg).addEventListener('click',function(){RB.done={};RB.sel=0;RB.msg='';RB.anim=0;drawRainbow(pg)});
    $('#rbRead',pg).addEventListener('click',function(e){if(e.target.closest('#rbBig'))rbBig(pg)});
  },
  lang:function(pg){drawRainbow(pg)}
};

/* ───────── 영상(선택) ───────── */
var FILMS={lesson:['online-learning.mp4','poster-online-learning.jpg','vd.d1'],full:['showreel-full.mp4','poster-full.jpg','vd.d2'],short:['showreel-60s.mp4','poster-60s.jpg','vd.d3']},film='lesson';
function setFilm(pg,key){
  film=key;var v=$('#film',pg),f=FILMS[key];
  v.pause();v.setAttribute('poster','../assets/promo/video/'+f[1]);v.src='../assets/promo/video/'+f[0];v.preload='none';
  $$('.film-picks .chip',pg).forEach(function(b){var on=b.dataset.film===key;b.classList.toggle('is-on',on);b.setAttribute('aria-pressed',on?'true':'false')});
  $('#filmDesc',pg).textContent=t(f[2]);
}
HOOKS.films={
  init:function(pg){$$('.film-picks .chip',pg).forEach(function(b){b.addEventListener('click',function(){setFilm(pg,b.dataset.film)})});setFilm(pg,film)},
  lang:function(pg){$('#filmDesc',pg).textContent=t(FILMS[film][2])},
  hide:function(pg){var v=$('#film',pg);if(v&&!v.paused)v.pause()}
};
function pauseMedia(){$$('video').forEach(function(v){if(!v.paused)v.pause()})}

/* ───────── 실제 학습지 ───────── */
var sheetI=0;
function drawSheet(pg,anim){
  var img=$('#sheetImg',pg);if(!img)return;
  var src='../assets/promo/sample/page-'+(sheetI+1)+'.webp',alt=t('ws.alt',{i:sheetI+1,p:t('ws.p'+(sheetI+1))});
  function set(){img.src=src;img.alt=alt;img.classList.remove('is-swap')}
  if(anim&&!reduced()&&img.getAttribute('src')!==src){img.classList.add('is-swap');setTimeout(set,180)}else set();
  $('#sheetOpen',pg).setAttribute('aria-label',t('ws.zoom')+' — '+alt);
  $('#sheetPrev',pg).disabled=sheetI<=0;$('#sheetNext',pg).disabled=sheetI>=5;
  var tabs=$('#sheetTabs',pg);tabs.innerHTML='';
  for(var i=0;i<6;i++){var li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='chip'+(i===sheetI?' is-on':'');b.textContent=(i+1)+' '+t('ws.p'+(i+1));b.dataset.i=i;b.setAttribute('aria-pressed',i===sheetI?'true':'false');li.appendChild(b);tabs.appendChild(li)}
}
function openZoom(src,alt){var z=$('#zoom');$('#zoomImg').src=src;$('#zoomImg').alt=alt;z.hidden=false;$('#zoomClose').focus()}
function closeZoom(){$('#zoom').hidden=true;var o=byId.sheet&&$('#sheetOpen',byId.sheet);if(o&&o.isConnected)o.focus({preventScroll:true})}
$('#zoomClose').addEventListener('click',closeZoom);$('#zoom').addEventListener('click',function(e){if(e.target.id==='zoom')closeZoom()});
HOOKS.sheet={
  init:function(pg){
    $('#sheetPrev',pg).addEventListener('click',function(){if(sheetI>0){sheetI--;drawSheet(pg,true)}});
    $('#sheetNext',pg).addEventListener('click',function(){if(sheetI<5){sheetI++;drawSheet(pg,true)}});
    $('#sheetTabs',pg).addEventListener('click',function(e){var b=e.target.closest('.chip');if(b){sheetI=+b.dataset.i;drawSheet(pg,true)}});
    $('#sheetOpen',pg).addEventListener('click',function(){var img=$('#sheetImg',pg);openZoom(img.getAttribute('src'),img.alt)});
  },
  lang:function(pg){drawSheet(pg,false)}
};

/* ───────── 묻고 답하기 ───────── */
var faqOpen=0;
HOOKS.faq={lang:function(pg){
  var box=$('#faq',pg);box.innerHTML='';
  for(var i=1;i<=6;i++){
    var q=document.createElement('button');q.type='button';q.className='faq-q';q.id='fq'+i;q.textContent=t('q'+i);
    q.setAttribute('aria-expanded',i===faqOpen+1?'true':'false');q.setAttribute('aria-controls','fa'+i);q.dataset.i=i-1;
    box.appendChild(q);
    if(i===faqOpen+1){var a=document.createElement('p');a.className='faq-a';a.id='fa'+i;a.textContent=t('a'+i);box.appendChild(a)}
  }
},init:function(pg){
  $('#faq',pg).addEventListener('click',function(e){var q=e.target.closest('.faq-q');if(!q)return;var i=+q.dataset.i;faqOpen=faqOpen===i?-1:i;HOOKS.faq.lang(pg);pg.dataset.state='q'+faqOpen;fit(pg);var nq=$('#fq'+(i+1),pg);if(nq)nq.focus({preventScroll:true})});
  pg.dataset.state='q'+faqOpen;
}};

/* ───────── 언어 적용 ───────── */
function stats(){var max=0;STAGES.forEach(function(s){if(s.courses&&s.courses.to>max)max=s.courses.to});return {n:max+1,s:STAGES.length}}
function applyLang(){
  var html=document.documentElement;html.lang=lang==='zh'?'zh-Hans':lang;
  var roots=[document].concat(PAGES);
  roots.forEach(function(r){
    $$('[data-t]',r).forEach(function(el){var k=el.getAttribute('data-t');el.textContent=el.hasAttribute('data-fill')?t(k,stats()):t(k)});
    $$('[data-h]',r).forEach(function(el){el.innerHTML=t(el.getAttribute('data-h'))});
    $$('[data-ta]',r).forEach(function(el){el.getAttribute('data-ta').split(';').forEach(function(pair){var i=pair.indexOf(':');if(i>0)el.setAttribute(pair.slice(0,i),t(pair.slice(i+1)))})});
    $$('[data-limg]',r).forEach(function(el){el.src='../assets/landing/'+(lang==='ko'?'':lang+'/')+el.getAttribute('data-limg')});
    $$('[data-lablink]',r).forEach(function(a){var base=a.getAttribute('href').split('?')[0];a.setAttribute('href',base+'?lang='+lang);a.setAttribute('aria-label',(a.textContent||'').trim()+' ('+t('ui.newTab')+')')});
    $$('[data-hide-empty]',r).forEach(function(el){el.hidden=!el.textContent.trim()});
  });
  $('[data-contact="kakao"]',byId.consult).setAttribute('aria-label',t('ct.btn')+' ('+t('ui.newTab')+')');
  document.title=lang==='zh'?'Numbers of Magic · 数的魔法':lang==='en'?'Numbers of Magic':'Numbers of Magic · 수의 마법';
  var md=$('meta[name="description"]');if(md)md.setAttribute('content',t('meta.desc'));
  $$('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.lang===lang?'true':'false')});
  $('#dockHint').textContent=t(mode==='single'?'ui.hintM':'ui.hintD');
  peelNext.setAttribute('aria-label',t('ui.next'));peelPrev.setAttribute('aria-label',t('ui.prev'));
  syncSound();
  PAGES.forEach(function(p){hook(p,'lang')});
  fitCache={};
  if(isOpen){afterPlace();views[vi].forEach(function(p){if(p)fit(p)})}
}
$$('.lang button').forEach(function(b){b.addEventListener('click',function(){
  if(busy)return;lang=b.dataset.lang;store('nm_landing_lang',lang);
  try{var u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u.pathname+u.search+u.hash)}catch(e){}
  applyLang();if(isOpen)place();
})});

/* ───────── 시작 ───────── */
PAGES.forEach(function(p){
  var inn=p.querySelector('.pg-in');
  if(!p.hasAttribute('data-desk-only')){var f=document.createElement('p');f.className='folio';f.setAttribute('aria-hidden','true');f.innerHTML='<b>'+pageNo(p)+'</b>';inn.appendChild(f)}
});
PAGES.forEach(function(p){hook(p,'init')});
layout();
applyLang();
var rt=0;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(busy)return;var m=mode;layout();$('#dockHint').textContent=t(mode==='single'?'ui.hintM':'ui.hintD');if(m!==mode)applyLang()},120)});
// 공유 링크 #road 처럼 쪽 이름이 있으면 표지를 건너뛰고 그 쪽을 연다
var startId=location.hash.replace('#','');
if(startId&&byId[startId]){vi=viewOf(byId[startId]);openBook(true)}
// 그림은 미리 풀어 둔다(넘기는 종이 복제본이 비어 보이지 않게)
setTimeout(function(){PAGES.forEach(function(p){$$('img',p).forEach(function(im){if(im.decode)im.decode().catch(function(){})})})},600);
window.NM_PROMO={go:go,goPage:goPage,next:next,prev:prev,open:openBook,close:closeBook,get view(){return vi},get views(){return views.length},get mode(){return mode},get busy(){return busy},get isOpen(){return isOpen},get lang(){return lang},pages:PAGES,selectStage:function(i){road&&road.select(i)},fit:fit};
})();
