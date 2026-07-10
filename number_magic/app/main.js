/* ============================================================
   Numbers of Magic — 본체 엔진 (app/main.js)
   reading-world 아키텍처 미러링(상태/저장/i18n t()/STEP flow).
   의존: window.NM_GEN, NM_CURRICULUM, NM_UNITS, katex
   흐름: 살아있는 마을(드래그/줌+구름/분수/숫자친구, 건물 클릭)
        → 등급 유닛목록 → 유닛[프랙티스→디스커버→핵심체크→랩→아레나→도장]
   진단 스킵(B안): 프랙티스 진입 시 "바로 넘어갈래? / 한번 볼래?"
   ============================================================ */
(()=>{
'use strict';
const app=document.getElementById('app');
const GEN=window.NM_GEN, CUR=window.NM_CURRICULUM, UNITS=window.NM_UNITS;

/* ---------- i18n ---------- */
const I18N={
  ko:{ appName:'수의 마법', start:'시작하기', back:'← 뒤로', next:'다음 →',
    coins:'누미 코인', locked:'준비 중', enter:'입장', mapTitle:'수의 마법 마을',
    skipAsk:'이 부분, 이미 잘하니?', skipYes:'바로 넘어갈래!', skipNo:'한번 볼래',
    ruleLabel:'마법의 규칙', tryAgain:'다시 해볼까?', correct:'정답!',
    checkTitle:'핵심 체크', openTitle:'생각해 보기', submit:'확인', myAnswer:'내 생각 적어보기(선택)',
    arenaGo:'배틀 시작!', timeUp:'시간 종료!', score:'점수', stampGet:'도장 획득!',
    doneUnit:'유닛 완료!', toMap:'마을로', numpadHint:'숫자를 눌러 답해요', pairHint:'짝꿍 두 수를 골라요',
    picked:'골랐어요!', langName:'한국어' },
  en:{ appName:'Numbers of Magic', start:'Start', back:'← Back', next:'Next →',
    coins:'Numi Coins', locked:'Coming soon', enter:'Enter', mapTitle:'Magic Number Town',
    skipAsk:'Already good at this?', skipYes:'Skip ahead!', skipNo:"Let's see it",
    ruleLabel:'Magic Rule', tryAgain:'Try again?', correct:'Correct!',
    checkTitle:'Key Check', openTitle:'Think about it', submit:'Check', myAnswer:'Write your idea (optional)',
    arenaGo:'Start Battle!', timeUp:"Time's up!", score:'Score', stampGet:'Stamp earned!',
    doneUnit:'Unit complete!', toMap:'To Town', numpadHint:'Tap numbers to answer', pairHint:'Pick two that make the target',
    picked:'Picked!', langName:'English' },
  zh:{ appName:'数字魔法', start:'开始', back:'← 返回', next:'下一个 →',
    coins:'努米金币', locked:'即将推出', enter:'进入', mapTitle:'数字魔法小镇',
    skipAsk:'这部分已经会了吗？', skipYes:'直接跳过！', skipNo:'看一看',
    ruleLabel:'魔法规则', tryAgain:'再试一次？', correct:'答对了！',
    checkTitle:'核心检查', openTitle:'想一想', submit:'确认', myAnswer:'写下你的想法（可选）',
    arenaGo:'开始对战！', timeUp:'时间到！', score:'分数', stampGet:'获得印章！',
    doneUnit:'单元完成！', toMap:'回小镇', numpadHint:'点击数字作答', pairHint:'选出凑成目标的两个数',
    picked:'选好了！', langName:'中文' }
};
const t=k=>(I18N[S.lang]&&I18N[S.lang][k])??I18N.ko[k]??k;
const L=(obj)=>obj?(obj[S.lang]??obj.ko??obj.en):'';   // 다국어 필드 픽

/* ---------- 상태 + 저장 ---------- */
const KEY='nm_state_v1';
function defaults(){return{ lang:'ko', view:'town', coins:0, range:'oneDigit',
  tierId:null, unit:null, step:null, sub:{}, progress:{} };}
let S=load();
if(S.view==='map')S.view='town'; // 구버전 상태 마이그레이션
function load(){try{const r=JSON.parse(localStorage.getItem(KEY));return r?{...defaults(),...r}:defaults();}catch(e){return defaults();}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function unitDone(id){return !!(S.progress[id]&&S.progress[id].done);}
function markStepDone(unit,step){S.progress[unit]=S.progress[unit]||{steps:{}};S.progress[unit].steps[step]=true;save();}
function stepDone(unit,step){return !!(S.progress[unit]&&S.progress[unit].steps&&S.progress[unit].steps[step]);}

/* ---------- 유틸 ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function math(tex,el){try{katex.render(tex,el,{throwOnError:false,displayMode:false});}catch(e){el.textContent=tex;}}
function renderMath(root){(root||document).querySelectorAll('[data-tex]').forEach(el=>{if(el.dataset.done)return;math(el.getAttribute('data-tex'),el);el.dataset.done='1';});}
function say(text){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=S.lang==='zh'?'zh-CN':S.lang==='en'?'en-US':'ko-KR';u.rate=1;u.pitch=1.2;speechSynthesis.speak(u);}catch(e){}}
function toast(msg,ok){const el=document.createElement('div');el.className='nm-toast '+(ok?'ok':'no');el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),1100);}
function confetti(){const cols=['#16417C','#EAC996','#C9A063','#2E9E6B','#3768ad'];for(let i=0;i<64;i++){const el=document.createElement('div');el.className='nm-confetti';el.style.left=Math.random()*100+'vw';el.style.background=cols[i%cols.length];document.body.appendChild(el);el.animate([{transform:'translateY(-20px) rotate(0)',opacity:1},{transform:`translateY(${innerHeight+40}px) rotate(${Math.random()*720}deg)`,opacity:.9}],{duration:1600+Math.random()*1200,easing:'cubic-bezier(.3,.6,.4,1)'}).onfinish=()=>el.remove();}}
function coinAdd(n){S.coins+=n;save();}
function pickVoice(arr){return L(arr[Math.floor(Math.random()*arr.length)]);}

/* ---------- 최상단 렌더 ---------- */
let townCleanup=null;
function render(){
  if(townCleanup){townCleanup();townCleanup=null;}
  app.innerHTML=`<div class="nm-top">
    <div class="nm-brand">🪄 ${t('appName')}</div>
    <div class="nm-top-right">
      <span class="nm-coins">🪙 <b>${S.coins}</b></span>
      <button class="nm-lang" id="langBtn">${t('langName')}</button>
    </div>
  </div><div id="screen"></div>`;
  $('#langBtn').onclick=cycleLang;
  if(S.view==='town')screenTown();
  else if(S.view==='tier')screenTier();
  else if(S.view==='unit')screenUnit();
  else screenTown();
  renderMath();
}
function cycleLang(){const o=['ko','en','zh'];S.lang=o[(o.indexOf(S.lang)+1)%3];save();render();}

/* ============================================================
   마을(Living Town) — map.jpg 위 드래그/줌 + 구름/분수/걸어다니는 숫자친구
   건물↔등급 배치(확정): 책건물=BASIC · 타운홀=PRIME · 시계탑=ADVANCE ·
   정자=CHALLENGE · Magic Theater=영상관(별도, 등급 아님)
   ============================================================ */
const TOWN_SPOTS=[
  { tier:'numberland',   pos:'left:8%;top:13%;width:24%;height:28%',  tag:'📖 BASIC',     sub:{ko:'수의 나라',en:'Number Land',zh:'数字王国'} },
  { tier:'beginner',     pos:'left:36%;top:19%;width:16%;height:22%', tag:'🏛️ PRIME',     sub:{ko:'초급',en:'Beginner',zh:'初级'} },
  { tier:'intermediate', pos:'left:29%;top:14%;width:9%;height:16%',  tag:'🕰️ ADVANCE',   sub:{ko:'중급',en:'Intermediate',zh:'中级'} },
  { tier:'advanced',     pos:'left:73%;top:24%;width:11%;height:14%', tag:'⛰️ CHALLENGE', sub:{ko:'고급',en:'Advanced',zh:'高级'} },
  { tier:'_theater',     pos:'left:53%;top:19%;width:13%;height:22%', tag:'🎬 극장',       sub:{ko:'영상',en:'Videos',zh:'视频'}, lockIcon:'🎬' }
];
function tierById(id){return CUR.tiers.find(x=>x.id===id);}
function tierOpen(tier){return !!(tier&&tier.levels.some(l=>l.available&&(l.units||[]).some(u=>UNITS[u])));}

function screenTown(){
  if(townCleanup){townCleanup();townCleanup=null;}
  const scr=$('#screen');
  let zones='';
  TOWN_SPOTS.forEach(sp=>{
    const tier=tierById(sp.tier);
    const open=sp.tier==='_theater'?false:tierOpen(tier);
    zones+=`<button class="nm-zone ${open?'':'locked'}" style="${sp.pos}" data-spot="${sp.tier}">
      ${open?'<div class="nm-halo"></div>':`<div class="nm-lockico">${sp.lockIcon||'🔒'}</div>`}
      <span class="nm-zlabel">${sp.tag}<small>${L(sp.sub)}</small></span>
    </button>`;
  });
  scr.innerHTML=`
    <div id="townVp">
      <div id="townWorld">
        <div class="ncloud a"><span class="puff" style="width:64px;height:64px;left:0;top:-8px"></span><span class="puff" style="width:48px;height:48px;left:44px;top:0"></span><span class="puff" style="width:40px;height:40px;left:78px;top:6px"></span><span class="num">7</span></div>
        <div class="ncloud b"><span class="puff" style="width:70px;height:70px;left:0;top:-10px"></span><span class="puff" style="width:50px;height:50px;left:50px;top:2px"></span><span class="num">10</span></div>
        <div class="ncloud c"><span class="puff" style="width:56px;height:56px;left:0;top:-6px"></span><span class="puff" style="width:44px;height:44px;left:40px;top:2px"></span><span class="num">5</span></div>
        <div id="townFountain"></div>
        ${zones}
        <div class="nb" id="nbNumi"><div class="speech"></div><span class="cap">3</span>
          <div class="stack"><div class="blk n3"><span class="eye l"></span><span class="eye r"></span><span class="mo"></span></div><div class="blk n3"></div><div class="blk n3"></div></div>
          <div class="shadow"></div></div>
        <div class="nb" id="nbPoco"><div class="speech"></div><span class="cap">5</span>
          <div class="stack"><div class="blk n5"><span class="eye l"></span><span class="eye r"></span><span class="mo"></span></div><div class="blk n5"></div><div class="blk n5"></div><div class="blk n5"></div><div class="blk n5"></div></div>
          <div class="shadow"></div></div>
        <div class="nb" id="nbMomo"><div class="speech"></div><span class="cap">2</span>
          <div class="stack"><div class="blk n2"><span class="eye l"></span><span class="eye r"></span><span class="mo"></span></div><div class="blk n2"></div></div>
          <div class="shadow"></div></div>
      </div>
    </div>
    <div class="nm-town-hud brand">${t('mapTitle')}</div>
    <div class="nm-town-hud ctrls">
      <button class="nm-iconbtn" id="townMute">🔇</button>
      <button class="nm-iconbtn" id="townZin">＋</button>
      <button class="nm-iconbtn" id="townZout">－</button>
    </div>
    <div class="nm-tmodal" id="tmodal">
      <div class="nm-tmcard">
        <h3 id="tmTitle"></h3><p id="tmDesc"></p>
        <button class="go" id="tmGo"></button>
        <button class="close" id="tmClose">${S.lang==='ko'?'닫기':S.lang==='en'?'Close':'关闭'}</button>
      </div>
    </div>`;
  townCleanup=initTownWorld(scr);
}

function showTownModal(title,desc,onGo){
  const modal=$('#tmodal');
  $('#tmTitle').textContent=title;
  $('#tmDesc').textContent=desc;
  const go=$('#tmGo');
  if(onGo){go.style.display='block';go.textContent=(S.lang==='ko'?'유닛 보러가기 →':S.lang==='en'?'See units →':'查看单元 →');go.onclick=()=>{modal.classList.remove('on');onGo();};}
  else go.style.display='none';
  modal.classList.add('on');
}
function enterTier(id){S.view='tier';S.tierId=id;save();render();}
function exitTier(){S.view='town';S.tierId=null;save();render();}

/* 마을 상호작용(드래그/핀치줌/구름/분수/숫자친구) — 화면을 나갈 때 반드시 cleanup() 호출 */
function initTownWorld(scr){
  const vp=scr.querySelector('#townVp'), world=scr.querySelector('#townWorld');
  const modal=scr.querySelector('#tmodal');
  const W=1024,H=687;
  let cam={x:0,y:0,scale:1},minS=1,maxS=2.4;
  function fit(){minS=Math.max(vp.clientWidth/W,vp.clientHeight/H);cam.scale=Math.max(cam.scale,minS);}
  function apply(){world.style.transform=`translate(${cam.x}px,${cam.y}px) scale(${cam.scale})`;}
  function bound(){const mx=vp.clientWidth-W*cam.scale,my=vp.clientHeight-H*cam.scale;cam.x=Math.min(0,Math.max(mx,cam.x));cam.y=Math.min(0,Math.max(my,cam.y));}
  function center(){cam.scale=Math.max(minS,1);cam.x=-(W*cam.scale-vp.clientWidth)/2;cam.y=-(H*cam.scale-vp.clientHeight)/2;bound();apply();}

  let drag=false,moved=false,sx,sy,cx,cy;
  function onDown(e){drag=true;moved=false;vp.classList.add('drag');sx=e.clientX;sy=e.clientY;cx=cam.x;cy=cam.y;}
  function onMove(e){if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>6)moved=true;cam.x=cx+dx;cam.y=cy+dy;bound();apply();}
  function onUp(){drag=false;vp.classList.remove('drag');}
  vp.addEventListener('pointerdown',onDown);
  vp.addEventListener('pointermove',onMove);
  vp.addEventListener('pointerup',onUp);
  vp.addEventListener('pointercancel',onUp);

  let pts=new Map(),pd=0;
  function pdDown(e){pts.set(e.pointerId,e);}
  function pdMove(e){
    if(!pts.has(e.pointerId))return;pts.set(e.pointerId,e);
    if(pts.size===2){
      const v=[...pts.values()];
      const d=Math.hypot(v[0].clientX-v[1].clientX,v[0].clientY-v[1].clientY);
      if(pd)zoomTo(cam.scale*(d/pd),(v[0].clientX+v[1].clientX)/2,(v[0].clientY+v[1].clientY)/2);
      pd=d;drag=false;
    }
  }
  function pdUp(e){pts.delete(e.pointerId);if(pts.size<2)pd=0;}
  vp.addEventListener('pointerdown',pdDown);
  vp.addEventListener('pointermove',pdMove);
  vp.addEventListener('pointerup',pdUp);
  vp.addEventListener('pointercancel',pdUp);

  function zoomTo(ns,ox,oy){
    ns=Math.min(maxS,Math.max(minS,ns));
    const r=vp.getBoundingClientRect();
    const lx=ox-r.left, ly=oy-r.top;
    const wx=(lx-cam.x)/cam.scale, wy=(ly-cam.y)/cam.scale;
    cam.scale=ns;cam.x=lx-wx*ns;cam.y=ly-wy*ns;bound();apply();
  }
  const zin=scr.querySelector('#townZin'), zout=scr.querySelector('#townZout');
  zin.onclick=()=>{const r=vp.getBoundingClientRect();zoomTo(cam.scale*1.25,r.left+r.width/2,r.top+r.height/2);};
  zout.onclick=()=>{const r=vp.getBoundingClientRect();zoomTo(cam.scale/1.25,r.left+r.width/2,r.top+r.height/2);};
  function onWheel(e){e.preventDefault();zoomTo(cam.scale*(e.deltaY<0?1.1:.9),e.clientX,e.clientY);}
  vp.addEventListener('wheel',onWheel,{passive:false});

  requestAnimationFrame(()=>{fit();center();});
  function onResize(){fit();bound();apply();}
  addEventListener('resize',onResize);

  /* 건물 클릭 */
  scr.querySelectorAll('.nm-zone').forEach(z=>{
    z.addEventListener('pointerup',e=>{
      if(moved)return;e.stopPropagation();
      const id=z.dataset.spot;
      if(id==='_theater'){
        showTownModal('🎬 '+(S.lang==='ko'?'매직 극장':S.lang==='en'?'Magic Theater':'魔法剧场'),
          S.lang==='ko'?'영상 학습관 — 준비 중이에요!':S.lang==='en'?'Video theater — coming soon!':'视频剧场——即将推出！',null);
        return;
      }
      const tier=tierById(id);
      if(tierOpen(tier)) showTownModal(`${tier.grade} · ${tier.subtitle}`,tier.desc,()=>enterTier(id));
      else showTownModal(`${tier.grade} · ${tier.subtitle}`,tier.desc+' — '+t('locked'),null);
    });
  });
  scr.querySelector('#tmClose').onclick=()=>modal.classList.remove('on');
  modal.onclick=e=>{if(e.target===modal)modal.classList.remove('on');};

  /* 분수(0 뿜기) */
  const f0=scr.querySelector('#townFountain');
  const fountainTimer=setInterval(()=>{
    const z=document.createElement('div');z.className='tzero';z.textContent='0';
    z.style.setProperty('--zx',(Math.random()*30-15)+'px');
    z.style.fontSize=(16+Math.random()*10)+'px';
    z.style.animation='zrise '+(1.6+Math.random()*.8)+'s ease-out forwards';
    f0.appendChild(z);setTimeout(()=>z.remove(),2600);
  },260);

  /* 반짝임 */
  const sparkTimer=setInterval(()=>{
    const s=document.createElement('div');s.className='tspark';
    s.style.left=(28+Math.random()*20)+'%';s.style.top=(42+Math.random()*10)+'%';
    s.style.animationDuration=(4+Math.random()*3)+'s';
    world.appendChild(s);setTimeout(()=>s.remove(),8000);
  },600);

  /* 걸어다니는 숫자친구 */
  const nbs=[
    {el:scr.querySelector('#nbNumi'),x:40,y:62,tx:40,ty:62,spd:.10,lines:['안녕! 난 3이야 ✨','7이랑 만나면 10! 🔟','마법노트 보여줄게!']},
    {el:scr.querySelector('#nbPoco'),x:55,y:66,tx:55,ty:66,spd:.14,lines:['숫자는 재밌어! 🎈','게임하러 가자!','코인 모으는 중~']},
    {el:scr.querySelector('#nbMomo'),x:30,y:70,tx:30,ty:70,spd:.08,lines:['10을 만들어볼까? 📐','실수는 괜찮아!','다시 확인해보자']}
  ];
  nbs.forEach(n=>{n.el.style.left=n.x+'%';n.el.style.top=n.y+'%';});
  function pick(n){const sp=[[38,60],[52,64],[30,72],[46,74],[60,68],[24,66]];const p=sp[Math.random()*sp.length|0];n.tx=p[0]+Math.random()*6;n.ty=p[1]+Math.random()*4;}
  nbs.forEach(pick);
  let walkRAF;
  let muted=true;
  function walk(){
    nbs.forEach(n=>{
      const dx=n.tx-n.x,dy=n.ty-n.y,d=Math.hypot(dx,dy);
      if(d<.3){if(Math.random()<.012)pick(n);return;}
      n.x+=dx/d*n.spd;n.y+=dy/d*n.spd;
      n.el.style.left=n.x+'%';n.el.style.top=n.y+'%';
      n.el.querySelector('.stack').style.transform=dx<0?'scaleX(-1)':'scaleX(1)';
    });
    walkRAF=requestAnimationFrame(walk);
  }
  walkRAF=requestAnimationFrame(walk);
  nbs.forEach(n=>{
    n.el.addEventListener('pointerup',e=>{
      if(moved)return;e.stopPropagation();
      const sp=n.el.querySelector('.speech');
      const line=n.lines[Math.random()*n.lines.length|0];
      sp.textContent=line;sp.classList.add('show');
      if(!muted&&S.lang==='ko')say(line);
      clearTimeout(n._t);n._t=setTimeout(()=>sp.classList.remove('show'),2400);
    });
  });

  /* 음소거(숫자친구 TTS) */
  const mb=scr.querySelector('#townMute');
  mb.textContent=muted?'🔇':'🔈';
  mb.onclick=()=>{muted=!muted;mb.textContent=muted?'🔇':'🔈';if(muted)speechSynthesis.cancel();};

  return function cleanup(){
    clearInterval(fountainTimer);
    clearInterval(sparkTimer);
    cancelAnimationFrame(walkRAF);
    removeEventListener('resize',onResize);
  };
}

/* ============================================================
   학습선택 — 선택한 등급의 단계/유닛 목록
   ============================================================ */
function screenTier(){
  const scr=$('#screen');
  const tier=tierById(S.tierId);
  if(!tier){exitTier();return;}
  let html=`<div class="nm-map">
    <div class="nm-unit-bar">
      <button class="nm-back" id="backTown">${t('back')}</button>
      <div class="nm-unit-title">${tier.title}<small>${tier.subtitle} · ${tier.ageLabel}</small></div>
    </div>
    <div class="nm-tier">
      <p class="nm-tier-desc">${tier.desc}</p>
      <div class="nm-levels">`;
  tier.levels.forEach(lvl=>{
    const units=(lvl.units||[]).filter(u=>UNITS[u]);
    const open=lvl.available&&units.length;
    if(open){
      html+=`<div class="nm-level open">
        <div class="nm-level-t">${lvl.title}</div>
        <div class="nm-unit-row">`;
      units.forEach(uid=>{
        const u=UNITS[uid];const done=unitDone(uid);
        html+=`<button class="nm-unit ${done?'done':''}" data-unit="${uid}">
          <span class="nm-unit-ic">${u.icon||'✦'}</span>
          <span class="nm-unit-name">${L(u.title)}</span>
          ${done?'<span class="nm-unit-check">✓</span>':''}
        </button>`;
      });
      html+=`</div></div>`;
    }else{
      html+=`<div class="nm-level locked"><div class="nm-level-t">${lvl.title}</div><span class="nm-lock">🔒 ${t('locked')}</span></div>`;
    }
  });
  html+=`</div></div></div>`;
  scr.innerHTML=html;
  $('#backTown').onclick=exitTier;
  scr.querySelectorAll('[data-unit]').forEach(b=>b.onclick=()=>enterUnit(b.dataset.unit));
}

/* ============================================================
   유닛 — 6단계 STEP 흐름
   ============================================================ */
function enterUnit(uid){S.view='unit';S.unit=uid;S.step='range';S.sub={};save();render();}
function pickRange(rk){S.range=rk;S.step='practice';S.sub={};save();render();}
function exitUnit(){S.view=S.tierId?'tier':'town';S.unit=null;S.step=null;S.sub={};save();render();}

function flowBar(){
  const u=S.unit;
  return `<div class="nm-flow">`+CUR.unitFlow.map((f,i)=>{
    const active=S.step===f.key, done=stepDone(u,f.key);
    return `${i?'<span class="nm-flow-arrow">→</span>':''}<button class="nm-flow-step ${active?'active':''} ${done?'done':''}" data-step="${f.key}">
      <span class="nm-flow-ic">${f.icon}</span><small>${L({ko:f.ko,en:f.en,zh:f.zh})}${done?' ✓':''}</small></button>`;
  }).join('')+`</div>`;
}

function screenUnit(){
  const scr=$('#screen');const u=UNITS[S.unit];
  scr.innerHTML=`<div class="nm-unit-view">
    <div class="nm-unit-bar">
      <button class="nm-back" id="backMap">${t('back')}</button>
      <div class="nm-unit-title">${L(u.title)}<small>${L(u.subtitle)}</small></div>
    </div>
    ${S.step==='range'?'':flowBar()}
    <div id="stepBody" class="nm-step-body"></div>
  </div>`;
  $('#backMap').onclick=exitUnit;
  scr.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{S.step=b.dataset.step;save();screenUnit();});
  const body=$('#stepBody');
  if(S.step==='range'){stepRange(body,u);renderMath(body);return;}
  ({practice:stepPractice,discover:stepDiscover,check:stepCheck,lab:stepLab,arena:stepArena,stamp:stepStamp}[S.step]||stepDiscover)(body,u);
  renderMath(body);
}

function gotoStep(k){S.step=k;save();screenUnit();}
function nextStepKey(){const ks=CUR.unitFlow.map(f=>f.key);const i=ks.indexOf(S.step);return ks[Math.min(i+1,ks.length-1)];}

/* ---------- STEP1 프랙티스 (진단스킵 + 숫자패드 대화형) ---------- */
function stepPractice(body,u){
  // 진단 스킵(B안): 아직 이 단계 안 했고 스킵 물어보기 전이면
  if(!S.sub.skipAsked && !stepDone(S.unit,'practice')){
    body.innerHTML=`<div class="nm-skip">
      <div class="nm-numi big"><div class="hat"></div></div>
      <div class="nm-skip-q">${t('skipAsk')}</div>
      <div class="nm-skip-btns">
        <button class="nm-btn ghost" id="skipNo">${t('skipNo')}</button>
        <button class="nm-btn" id="skipYes">${t('skipYes')}</button>
      </div></div>`;
    $('#skipYes').onclick=()=>{markStepDone(S.unit,'practice');S.sub={};gotoStep('discover');};
    $('#skipNo').onclick=()=>{S.sub={skipAsked:true};runPractice(body,u);};
    return;
  }
  runPractice(body,u);
}
function runPractice(body,u){
  const cfg=u.practice;const need=cfg.count||5;
  S.sub.pIdx=S.sub.pIdx||0;S.sub.cur=S.sub.cur||GEN[cfg.generator]({level:'practice'});
  const cur=S.sub.cur;
  const first=S.sub.pIdx===0&&!S.sub.started;
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.pIdx)}</div>
    <div class="nm-numi"><div class="hat"></div></div>
    <div class="nm-bubble" id="bub">${first?esc(L(cfg.intro)):esc(cur.prompt_ko)}</div>
    <div class="nm-numpad-screen" id="pscreen">&nbsp;</div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-hint">${t('numpadHint')}</div>
  </div>`;
  S.sub.started=true;
  buildNumpad($('#pad'),val=>handlePractice(val,body,u));
  say(first?L(cfg.intro):cur.prompt_ko);
}
function handlePractice(val,body,u){
  const cur=S.sub.cur;const need=u.practice.count||5;
  if(val==='ok'){
    const inp=S.sub.inp||'';if(inp==='')return;
    if(+inp===cur.answer){
      toast(t('correct'),true);numiHappy();
      S.sub.pIdx++;S.sub.inp='';S.sub.cur=null;
      if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');setTimeout(()=>gotoStep('discover'),700);return;}
      S.sub.cur=GEN[u.practice.generator]({level:'practice'});save();
      setTimeout(()=>runPractice(body,u),650);
    }else{toast(t('tryAgain'),false);S.sub.inp='';$('#pscreen').textContent=' ';}
    return;
  }
  if(val==='del'){S.sub.inp=(S.sub.inp||'').slice(0,-1);}
  else if((S.sub.inp||'').length<3){S.sub.inp=(S.sub.inp||'')+val;}
  $('#pscreen').textContent=S.sub.inp||' ';
}

/* ---------- STEP2 디스커버 (마법 노트) ---------- */
function stepRange(body,u){
  if(!u.ranges){ pickRange('oneDigit'); return; }
  body.innerHTML=`<div class="nm-skip">
    <div class="nm-numi big"><div class="hat"></div></div>
    <div class="nm-skip-q">${S.lang==='ko'?'수 범위를 골라요':S.lang==='en'?'Choose number range':'选择数字范围'}</div>
    <div class="nm-range-btns">`+u.ranges.map(r=>`
      <button class="nm-range-card" data-rk="${r.key}">
        <b>${L({ko:r.ko,en:r.en,zh:r.zh})}</b><small>${r.desc_ko||''}</small></button>`).join('')+`
    </div></div>`;
  body.querySelectorAll('[data-rk]').forEach(b=>b.onclick=()=>pickRange(b.dataset.rk));
}

/* 개념 렌더: 투명표 + 폰트 자동축소 + 짝 연결선(일의자리 색) */
function conceptExpr(container, terms){
  const box=document.createElement('div');box.className='nm-cbox';
  const scroll=document.createElement('div');scroll.className='nm-cscroll';box.appendChild(scroll);
  const table=document.createElement('table');table.className='nm-cexpr';
  const tr=document.createElement('tr');table.appendChild(tr);
  const cells=[];
  terms.forEach((t,i)=>{
    if(i){const op=document.createElement('td');op.className='op';op.textContent='+';tr.appendChild(op);}
    const td=document.createElement('td');td.className=(t.pair?'p'+t.pair:'');
    td.innerHTML=(t.tens!=null?`<span class="tens">${t.tens}</span>`:'')+`<span class="ones">${t.ones}</span>`;
    tr.appendChild(td);cells.push({td,t});
  });
  scroll.appendChild(table);container.appendChild(box);
  const fit=()=>{
    const avail=scroll.clientWidth;let fs=32;table.style.fontSize=fs+'px';
    while(table.scrollWidth>avail&&fs>17){fs--;table.style.fontSize=fs+'px';}
    const old=scroll.querySelector('.nm-clink');if(old)old.remove();
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','nm-clink');
    const sr=scroll.getBoundingClientRect();const cols={1:'#2E9E6B',2:'#E0682F',3:'#8A5CD0'};
    [1,2,3].forEach(pc=>{
      const idx=cells.map((c,i)=>c.t.pair===pc?i:-1).filter(i=>i>=0);
      if(idx.length===2){
        const a=cells[idx[0]].td.querySelector('.ones').getBoundingClientRect();
        const b=cells[idx[1]].td.querySelector('.ones').getBoundingClientRect();
        const x1=a.left+a.width/2-sr.left,x2=b.left+b.width/2-sr.left,dip=42,top=8;
        const p=document.createElementNS('http://www.w3.org/2000/svg','path');
        p.setAttribute('d',`M ${x1} ${dip} C ${x1} ${top}, ${x2} ${top}, ${x2} ${dip}`);
        p.setAttribute('fill','none');p.setAttribute('stroke',cols[pc]);p.setAttribute('stroke-width','2.5');p.setAttribute('stroke-linecap','round');
        svg.appendChild(p);
        const tx=document.createElementNS('http://www.w3.org/2000/svg','text');
        tx.setAttribute('x',(x1+x2)/2);tx.setAttribute('y',top-1);tx.setAttribute('text-anchor','middle');
        tx.setAttribute('fill',cols[pc]);tx.setAttribute('font-size','12');tx.setAttribute('font-weight','800');tx.textContent='10';svg.appendChild(tx);
      }
    });
    svg.setAttribute('width',sr.width);scroll.appendChild(svg);
  };
  requestAnimationFrame(fit);
  try{new ResizeObserver(fit).observe(scroll);}catch(e){}
}

function stepDiscover(body,u){
  const d=u.discover;
  // 두 자리 범위가 아니면 두 자리 단계(kind two/mix)는 접어둠(한 자리만)
  const two = S.range==='twoDigit';
  const stages = d.stages.filter(s=> two || s.kind==='one');
  body.innerHTML=`<div class="nm-card"><div class="nm-card-h">📓 ${L(d.title)}</div><div id="cstages"></div>
    <div class="nm-rule"><b>${t('ruleLabel')}</b><p>${L(d.rule)}</p></div>
    <button class="nm-btn full" id="toCheck">${t('next')}</button></div>`;
  const host=body.querySelector('#cstages');
  stages.forEach(s=>{
    const wrap=document.createElement('div');wrap.className='nm-cstage';
    wrap.innerHTML=`<span class="nm-ctag ${s.kind}">${L(s.tag)}</span>
      <div class="nm-ch">${L(s.head)}</div>
      <div class="nm-cdesc">${L(s.desc)}</div>`;
    host.appendChild(wrap);
    conceptExpr(wrap, s.terms);
    const res=document.createElement('div');res.className='nm-cresult';res.textContent=L(s.result);wrap.appendChild(res);
    if(s.book){const bk=document.createElement('div');bk.className='nm-cbook';bk.innerHTML='📖 '+L(s.book);wrap.appendChild(bk);}
  });
  $('#toCheck').onclick=()=>{markStepDone(S.unit,'discover');gotoStep('check');};
}


function stepCheck(body,u){
  const c=u.check;S.sub.fi=S.sub.fi||0;
  const fill=c.fills[S.sub.fi];
  body.innerHTML=`<div class="nm-card">
    <div class="nm-card-h">✅ ${t('checkTitle')}</div>
    <div class="nm-fill"><span data-tex="${esc(fill.tex)}"></span></div>
    <div class="nm-numpad-screen" id="pscreen">&nbsp;</div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-hint" id="fhint"></div>
  </div>`;
  buildNumpad($('#pad'),val=>{
    if(val==='ok'){const inp=S.sub.inp||'';if(inp==='')return;
      if(+inp===fill.answer){toast(t('correct'),true);numiHappy();markStepDone(S.unit,'check');S.sub={};setTimeout(()=>openQuestion(body,u),700);}
      else{toast(t('tryAgain'),false);$('#fhint').textContent='💡 '+L(fill.hint);S.sub.inp='';$('#pscreen').textContent=' ';}
      return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);else if((S.sub.inp||'').length<4)S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
  });
}
function openQuestion(body,u){
  const c=u.check;
  body.innerHTML=`<div class="nm-card">
    <div class="nm-card-h">💭 ${t('openTitle')}</div>
    <div class="nm-open-q">${esc(L(c.open))}</div>
    <textarea class="nm-open-in" id="openIn" placeholder="${t('myAnswer')}" rows="3"></textarea>
    <div class="nm-open-hint">${esc(L(c.openHint))}</div>
    <button class="nm-btn full" id="toLab">${t('next')}</button>
  </div>`;
  $('#toLab').onclick=()=>gotoStep('lab');
}

/* ---------- STEP4 매직랩 (선택 모드 대화형) ---------- */
function stepLab(body,u){
  const cfg=u.lab;const need=cfg.count||4;
  S.sub.li=S.sub.li||0;S.sub.picked=S.sub.picked||[];
  S.sub.cur=S.sub.cur||GEN[cfg.generator]({level:'main'});
  const cur=S.sub.cur;const first=S.sub.li===0&&!S.sub.labStarted;
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    <div class="nm-numi"><div class="hat"></div></div>
    <div class="nm-bubble">${first?esc(L(cfg.intro)):esc(cur.prompt_ko)}</div>
    <div class="nm-expr" id="expr"></div>
    <button class="nm-btn full" id="pick" disabled>${t('picked')}</button>
    <div class="nm-hint">${t('pairHint')}</div>
  </div>`;
  S.sub.labStarted=true;S.sub.picked=[];
  say(first?L(cfg.intro):cur.prompt_ko);
  const expr=$('#expr');
  cur.nums.forEach((n,i)=>{
    if(i)expr.insertAdjacentHTML('beforeend','<span class="nm-plus">+</span>');
    const b=document.createElement('button');b.className='nm-tile';b.textContent=n;b.dataset.i=i;
    b.onclick=()=>pickTile(b,i,n,body,u);expr.appendChild(b);
  });
}
function pickTile(el,i,n,body,u){
  const p=S.sub.picked;const at=p.findIndex(x=>x.i===i);
  if(at>=0){p.splice(at,1);el.classList.remove('sel');}
  else{if(p.length>=2){const f=p.shift();const fe=document.querySelector(`.nm-tile[data-i="${f.i}"]`);if(fe)fe.classList.remove('sel');}p.push({i,n});el.classList.add('sel');}
  const pk=$('#pick');pk.disabled=p.length!==2;
  pk.onclick=()=>{
    const cur=S.sub.cur;const sum=p[0].n+p[1].n;
    if(sum===(cur.target||10)){
      toast(pickVoice(u.voice.correct),true);numiHappy();
      p.forEach(x=>{const e=document.querySelector(`.nm-tile[data-i="${x.i}"]`);if(e){e.classList.remove('sel');e.classList.add('paired');}});
      S.sub.li++;S.sub.cur=null;
      const need=u.lab.count||4;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep('arena'),800);return;}
      setTimeout(()=>stepLab(body,u),900);
    }else{toast(pickVoice(u.voice.wrong),false);p.forEach(x=>{const e=document.querySelector(`.nm-tile[data-i="${x.i}"]`);if(e)e.classList.remove('sel');});S.sub.picked=[];pk.disabled=true;}
  };
}

/* ---------- STEP5 아레나 (타임 배틀) ---------- */
function stepArena(body,u){
  const cfg=u.arena;const need=cfg.count||10;
  S.sub.ai=0;S.sub.score=0;S.sub.left=cfg.timeLimit||300;
  nextArena(body,u,need);
  clearInterval(window._nmTimer);
  window._nmTimer=setInterval(()=>{
    S.sub.left--;const tm=$('#atime');
    if(tm)tm.textContent=fmt(S.sub.left);
    if(S.sub.left<=0){clearInterval(window._nmTimer);arenaEnd(body,u);}
  },1000);
}
function nextArena(body,u,need){
  const cur=GEN[u.arena.generator]({level:'main'});S.sub.cur=cur;S.sub.inp='';
  body.innerHTML=`<div class="nm-arena">
    <div class="nm-arena-top"><span class="nm-arena-q">${S.sub.ai+1} / ${need}</span><span class="nm-arena-time" id="atime">${fmt(S.sub.left)}</span></div>
    <div class="nm-arena-expr"><span data-tex="${esc(cur.tex.split('=')[0].trim())} = \\square"></span></div>
    <div class="nm-numpad-screen" id="pscreen">&nbsp;</div>
    <div class="nm-numpad" id="pad"></div>
  </div>`;
  renderMath(body);
  buildNumpad($('#pad'),val=>{
    if(val==='ok'){const inp=S.sub.inp||'';if(inp==='')return;
      if(+inp===S.sub.cur.answer){S.sub.score++;numiHappyToast();}else toast('✗',false);
      S.sub.ai++;
      if(S.sub.ai>=need){clearInterval(window._nmTimer);arenaEnd(body,u);return;}
      nextArena(body,u,need);return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);else if((S.sub.inp||'').length<4)S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
  });
}
function arenaEnd(body,u){
  const need=u.arena.count||10;const sc=S.sub.score;
  markStepDone(S.unit,'arena');
  body.innerHTML=`<div class="nm-card center">
    <div class="nm-numi big"><div class="hat"></div></div>
    <div class="nm-card-h">${t('score')}</div>
    <div class="nm-score">${sc} / ${need}</div>
    <button class="nm-btn full" id="toStamp">${t('next')}</button>
  </div>`;
  $('#toStamp').onclick=()=>gotoStep('stamp');
}

/* ---------- STEP6 도장 ---------- */
function stepStamp(body,u){
  const s=u.stamp;const already=unitDone(S.unit);
  if(!already){coinAdd(s.coins||20);S.progress[S.unit]=S.progress[S.unit]||{steps:{}};S.progress[S.unit].done=true;save();}
  body.innerHTML=`<div class="nm-card center stamp">
    <div class="nm-stamp-seal">🏅</div>
    <div class="nm-card-h">${t('stampGet')}</div>
    <div class="nm-stamp-label">${L(s.label)}</div>
    <div class="nm-stamp-coins">🪙 +${s.coins||20} ${t('coins')}</div>
    <button class="nm-btn full" id="toMap">${t('toMap')} →</button>
  </div>`;
  confetti();say(L(u.voice.finish));
  $('#toMap').onclick=exitUnit;
}

/* ---------- 공통 UI 조각 ---------- */
function buildNumpad(pad,cb){
  pad.innerHTML='';
  ['1','2','3','4','5','6','7','8','9','del','0','ok'].forEach(k=>{
    const b=document.createElement('button');b.className='nm-key'+(k==='ok'?' ok':k==='del'?' del':'');
    b.textContent=k==='del'?'←':k==='ok'?'✓':k;b.onclick=()=>cb(k);pad.appendChild(b);
  });
}
function dots(n,cur){let h='';for(let i=0;i<n;i++)h+=`<span class="nm-dot ${i<cur?'on':i===cur?'now':''}"></span>`;return h;}
function fmt(s){s=Math.max(0,s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function numiHappy(){const n=document.querySelector('.nm-numi');if(n){n.classList.remove('happy');void n.offsetWidth;n.classList.add('happy');}}
function numiHappyToast(){toast('✓',true);}

/* ---------- 시작 ---------- */
function boot(){
  if(!GEN||!CUR||!UNITS){app.innerHTML='<p style="padding:40px;text-align:center">데이터 로딩 실패 — 스크립트 순서를 확인하세요.</p>';return;}
  render();
}
if(window.katex)boot(); else{const t2=setInterval(()=>{if(window.katex){clearInterval(t2);boot();}},60);setTimeout(()=>{if(!window.katex)boot();},1500);}
})();
