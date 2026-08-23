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

/* NM_TGEN 브리지: 레거시 NM_GEN + 스레드 생성기(NM_TGEN) 통합. params 전달 포함. */
function genProblem(cfg, level){
  const key=cfg.generator;
  const g=(GEN||{})[key];
  if(g) return g({level});
  const tg=(window.NM_TGEN||{})[key];
  if(tg){
    const rng=NM_RNG.mulberry32((Math.random()*2147483647)|0);
    return tg(Object.assign({level},cfg.params||{}),rng);
  }
  return {prompt:{ko:'생성기 없음',en:'No generator',zh:'无生成器'},tex:'?',answer:0,answerType:'number'};
}

/* ---------- i18n ---------- */
const I18N={
  ko:{ appName:'수의 마법', start:'시작하기', back:'← 뒤로', next:'다음 →',
    coins:'누미 코인', locked:'준비 중', enter:'입장', mapTitle:'수의 마법 마을',
    skipAsk:'이 부분, 이미 잘하니?', skipYes:'바로 넘어갈래!', skipNo:'한번 볼래',
    ruleLabel:'마법의 규칙', tryAgain:'다시 해볼까?', correct:'정답!',
    checkTitle:'핵심 체크', openTitle:'생각해 보기', submit:'확인', myAnswer:'내 생각 적어보기(선택)',
    arenaGo:'배틀 시작!', timeUp:'시간 종료!', score:'점수', stampGet:'도장 획득!',
    doneUnit:'유닛 완료!', toMap:'마을로', numpadHint:'숫자를 눌러 답해요', pairHint:'짝꿍 두 수를 골라요',
    picked:'골랐어요!', langName:'한국어',
    obTitle:'나만의 숫자 친구', obSub:'캐릭터를 고르고 이름을 알려주세요!',
    obNamePh:'이름을 적어주세요', obGo:'짜잔! 시작하기 ✨', obNeedName:'이름을 알려줘야 시작할 수 있어요!',
    obWelcome:n=>`환영해요, ${n}!` },
  en:{ appName:'Numbers of Magic', start:'Start', back:'← Back', next:'Next →',
    coins:'Numi Coins', locked:'Coming soon', enter:'Enter', mapTitle:'Magic Number Town',
    skipAsk:'Already good at this?', skipYes:'Skip ahead!', skipNo:"Let's see it",
    ruleLabel:'Magic Rule', tryAgain:'Try again?', correct:'Correct!',
    checkTitle:'Key Check', openTitle:'Think about it', submit:'Check', myAnswer:'Write your idea (optional)',
    arenaGo:'Start Battle!', timeUp:"Time's up!", score:'Score', stampGet:'Stamp earned!',
    doneUnit:'Unit complete!', toMap:'To Town', numpadHint:'Tap numbers to answer', pairHint:'Pick two that make the target',
    picked:'Picked!', langName:'English',
    obTitle:'Your Number Friend', obSub:'Pick a character and tell us your name!',
    obNamePh:'Enter your name', obGo:'Ta-da! Start ✨', obNeedName:'Tell us your name first!',
    obWelcome:n=>`Welcome, ${n}!` },
  zh:{ appName:'数字魔法', start:'开始', back:'← 返回', next:'下一个 →',
    coins:'努米金币', locked:'即将推出', enter:'进入', mapTitle:'数字魔法小镇',
    skipAsk:'这部分已经会了吗？', skipYes:'直接跳过！', skipNo:'看一看',
    ruleLabel:'魔法规则', tryAgain:'再试一次？', correct:'答对了！',
    checkTitle:'核心检查', openTitle:'想一想', submit:'确认', myAnswer:'写下你的想法（可选）',
    arenaGo:'开始对战！', timeUp:'时间到！', score:'分数', stampGet:'获得印章！',
    doneUnit:'单元完成！', toMap:'回小镇', numpadHint:'点击数字作答', pairHint:'选出凑成目标的两个数',
    picked:'选好了！', langName:'中文',
    obTitle:'我的数字朋友', obSub:'选一个角色，告诉我你的名字！',
    obNamePh:'请输入名字', obGo:'哇！开始吧 ✨', obNeedName:'请先告诉我你的名字！',
    obWelcome:n=>`欢迎，${n}！` }
};
const t=k=>(I18N[S.lang]&&I18N[S.lang][k])??I18N.ko[k]??k;
const L=(obj)=>obj?(obj[S.lang]??obj.ko??obj.en):'';   // 다국어 필드 픽

/* ---------- 상태 + 저장 ---------- */
const KEY='nm_state_v1';
/* onboarded는 defaults()에 넣지 않음(항상 undefined로 시작) —
   완전 신규 설치(hadSave===false)일 때만 온보딩을 요구하기 위한 표식.
   defaults()에 박아두면 구버전 저장본(onboarded 필드 없음)과 병합 시에도
   항상 값이 채워져 있어 "미설정" 여부를 구분할 수 없게 된다. */
function defaults(){return{ lang:'ko', view:'town', coins:0, range:'oneDigit',
  tierId:null, unit:null, step:null, sub:{}, progress:{}, name:'',
  character:{number:3,color:'blue',bg:'plain',cape:'none'},
  character_unlocked:{} };}
function load(){try{const r=JSON.parse(localStorage.getItem(KEY));return r?{...defaults(),...r}:defaults();}catch(e){return defaults();}}
const hadSave=!!localStorage.getItem(KEY); // 온보딩은 "완전 신규 설치"에서만 요구
let S=load();
if(S.view==='map')S.view='town'; // 구버전 상태 마이그레이션
// 기존 저장본에 character 필드 없으면 기본값 채움
if(!S.character)S.character={number:3,color:'blue',bg:'plain',cape:'none'};
if(!S.character_unlocked)S.character_unlocked={};
if(typeof S.onboarded!=='boolean')S.onboarded=hadSave; // 이미 쓰던 사용자는 온보딩 화면 스킵
if(S.name===undefined)S.name='';
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}cloudPushSoon();}
function unitDone(id){return !!(S.progress[id]&&S.progress[id].done);}

/* ---------- 클라우드 프로필 (Supabase nm_profiles) ----------
   캐릭터 이름 = 고유 아이디. 온보딩에서 이름이 비어 있지 않고 중복이 아니면
   그 이름으로 클레임(insert)되고, 이후 진행상황(S 전체)이 이름 아래로 동기화된다.
   같은 이름이 이미 있으면 "이건 나예요(이어하기) / 다른 이름 쓸래요"를 고른다.
   네트워크가 안 되면 조용히 로컬 전용으로 동작(앱 사용을 막지 않음).
   cloudLinked가 true인 프로필만 push — 클레임 절차 없이 이름만 같은 옛 로컬
   사용자가 남의 클라우드 저장본을 덮어쓰는 사고를 막는다. */
const SB_URL='https://fgahqumaldheqettmvqg.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
const sbHdr=()=>({apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json'});
async function cloudGet(name){
  const url=`${SB_URL}/rest/v1/nm_profiles?name=eq.${encodeURIComponent(name)}&select=name,state`;
  const r=await fetch(url,{headers:sbHdr()});
  if(!r.ok)throw new Error('cloudGet '+r.status);
  const rows=await r.json();
  return rows[0]||null;
}
async function cloudClaim(name,state){
  const r=await fetch(`${SB_URL}/rest/v1/nm_profiles`,{
    method:'POST',headers:sbHdr(),
    body:JSON.stringify({name,state,updated_at:new Date().toISOString()})});
  if(r.status===409)return false;           // 그 사이 누가 선점 (중복)
  if(!r.ok)throw new Error('cloudClaim '+r.status);
  return true;
}
let cloudTimer=null;
function cloudPushSoon(){
  if(!S.cloudLinked||!S.name)return;
  clearTimeout(cloudTimer);
  cloudTimer=setTimeout(()=>{
    fetch(`${SB_URL}/rest/v1/nm_profiles?name=eq.${encodeURIComponent(S.name)}`,{
      method:'PATCH',headers:sbHdr(),
      body:JSON.stringify({state:S,updated_at:new Date().toISOString()})
    }).catch(()=>{});                       // 오프라인이면 다음 save 때 재시도
  },1500);
}
function markStepDone(unit,step){S.progress[unit]=S.progress[unit]||{steps:{}};S.progress[unit].steps[step]=true;save();}
function stepDone(unit,step){return !!(S.progress[unit]&&S.progress[unit].steps&&S.progress[unit].steps[step]);}

/* ---------- 유틸 ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function math(tex,el){try{katex.render(tex,el,{throwOnError:false,displayMode:false});}catch(e){el.textContent=tex;}}
function renderMath(root){(root||document).querySelectorAll('[data-tex]').forEach(el=>{if(el.dataset.done)return;math(el.getAttribute('data-tex'),el);el.dataset.done='1';});}
let _ttsCache={};
function say(text){
  if(!text)return;
  const lang=S.lang||'ko';
  const map=window.NM_TTS_MAP;
  if(map&&map[lang]&&map[lang][text]){
    const url=map[lang][text];
    try{
      speechSynthesis.cancel();
      let a=_ttsCache[url];
      if(!a){a=new Audio(url);_ttsCache[url]=a;}
      a.currentTime=0;
      a.play().catch(()=>_sayWeb(text,lang));
      return;
    }catch(e){}
  }
  _sayWeb(text,lang);
}
function _sayWeb(text,lang){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=lang==='zh'?'zh-CN':lang==='en'?'en-US':'ko-KR';u.rate=1;u.pitch=1.2;speechSynthesis.speak(u);}catch(e){}}
window.NM_SAY=say;   // widgets.js(storyCard 🔊 다시듣기 버튼)에서 재낭독용으로 사용
window.NM_L=L;        // widgets.js에서 다국어 필드(problem.prompt 등) 읽기용
function toast(msg,ok){const el=document.createElement('div');el.className='nm-toast '+(ok?'ok':'no');el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),1100);}
function confetti(){const cols=['#16417C','#EAC996','#C9A063','#2E9E6B','#3768ad'];for(let i=0;i<64;i++){const el=document.createElement('div');el.className='nm-confetti';el.style.left=Math.random()*100+'vw';el.style.background=cols[i%cols.length];document.body.appendChild(el);el.animate([{transform:'translateY(-20px) rotate(0)',opacity:1},{transform:`translateY(${innerHeight+40}px) rotate(${Math.random()*720}deg)`,opacity:.9}],{duration:1600+Math.random()*1200,easing:'cubic-bezier(.3,.6,.4,1)'}).onfinish=()=>el.remove();}}
function coinAdd(n){S.coins+=n;save();}
function pickVoice(arr){return L(arr[Math.floor(Math.random()*arr.length)]);}

/* ---------- Web Audio 앰비언스 (신비한 배경음악 + 물소리, 외부 파일 없이 합성) ---------- */
let actx=null;
function getCtx(){
  if(!actx)actx=new (window.AudioContext||window.webkitAudioContext)();
  if(actx.state==='suspended')actx.resume();
  return actx;
}
function startAmbience(){
  const ctx=getCtx();
  const master=ctx.createGain();master.gain.value=.55;master.connect(ctx.destination);

  /* 물소리: 브라운노이즈를 대역통과 필터로 걸러 시냇물/분수 느낌 + 느린 볼륨 요동으로 보글거림 */
  const bufSize=ctx.sampleRate*4;
  const buf=ctx.createBuffer(1,bufSize,ctx.sampleRate);
  const data=buf.getChannelData(0);
  let last=0;
  for(let i=0;i<bufSize;i++){const white=Math.random()*2-1;last=(last+.02*white)/1.02;data[i]=last*3.2;}
  const noiseSrc=ctx.createBufferSource();noiseSrc.buffer=buf;noiseSrc.loop=true;
  const waterFilter=ctx.createBiquadFilter();waterFilter.type='bandpass';waterFilter.frequency.value=950;waterFilter.Q.value=.7;
  const waterGain=ctx.createGain();waterGain.gain.value=.14;
  noiseSrc.connect(waterFilter).connect(waterGain).connect(master);
  noiseSrc.start();
  const lfo=ctx.createOscillator();lfo.frequency.value=.16;
  const lfoGain=ctx.createGain();lfoGain.gain.value=.05;
  lfo.connect(lfoGain).connect(waterGain.gain);
  lfo.start();

  /* 신비한 마법 벨 아르페지오: 딜레이 피드백으로 반짝이는 잔향 */
  const delay=ctx.createDelay();delay.delayTime.value=.34;
  const feedback=ctx.createGain();feedback.gain.value=.36;
  const musicGain=ctx.createGain();musicGain.gain.value=.2;
  delay.connect(feedback).connect(delay);
  musicGain.connect(delay);delay.connect(master);musicGain.connect(master);
  const scale=[261.6,293.7,329.6,392.0,440.0,523.3]; // C D E G A C (오음계, 신비로운 울림)
  let noteTimer=null;
  function pluck(){
    const freq=scale[Math.floor(Math.random()*scale.length)];
    const osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=freq;
    const g=ctx.createGain();g.gain.value=0;
    osc.connect(g).connect(musicGain);
    const now=ctx.currentTime;
    g.gain.linearRampToValueAtTime(.5,now+.6);
    g.gain.exponentialRampToValueAtTime(.0001,now+2.6);
    osc.start(now);osc.stop(now+2.8);
    noteTimer=setTimeout(pluck,1800+Math.random()*1600);
  }
  pluck();

  return function stopAmbience(){
    clearTimeout(noteTimer);
    try{noiseSrc.stop();}catch(e){}
    try{lfo.stop();}catch(e){}
    try{master.disconnect();}catch(e){}
  };
}

/* ---------- 최상단 렌더 ---------- */
let townCleanup=null;
function charChipHTML(){
  const mini = window.renderNumiChar ? window.renderNumiChar(S.character, 30) : '🪄';
  const label = S.name ? esc(S.name) : ('#'+S.character.number);
  return `<button class="nm-char-chip" id="charChipBtn">${mini}<span class="nm-char-chip-name">${label}</span></button>`;
}
function render(){
  if(townCleanup){townCleanup();townCleanup=null;}
  if(S.view!=='minigame'&&mgTimer){clearInterval(mgTimer);mgTimer=null;}
  if(!S.onboarded){
    app.innerHTML='<div id="screen"></div>';
    screenWelcome();
    return;
  }
  app.innerHTML=`<div class="nm-top">
    <div class="nm-brand">${charChipHTML()}</div>
    <div class="nm-top-right">
      <span class="nm-coins">🪙 <b>${S.coins}</b></span>
      <button class="nm-lang" id="langBtn">${t('langName')}</button>
    </div>
  </div><div id="screen"></div>`;
  $('#langBtn').onclick=cycleLang;
  $('#charChipBtn').onclick=()=>{S.view='closet';save();render();};
  if(S.view==='town')screenTown();
  else if(S.view==='roadmap')screenRoadmap();
  else if(S.view==='minigame')screenMiniGame(S.miniGameId||'make10');
  else if(S.view==='gradecourse')screenGradeCourse();
  else if(S.view==='tier')screenTier();
  else if(S.view==='unit')screenUnit();
  else if(S.view==='exam')screenExam();
  else if(S.view==='closet')screenCloset();
  else screenTown();
  renderMath();
}
function cycleLang(){const o=['ko','en','zh'];S.lang=o[(o.indexOf(S.lang)+1)%3];save();render();}

/* ============================================================
   온보딩 — 캐릭터+이름 선택 → "짠!" 구름 등장 연출 → 마을 입장
   완전 신규 설치(localStorage 없던 상태)에서만 1회 등장(hadSave 참고)
   ============================================================ */
function screenWelcome(){
  const scr=$('#screen');
  const ob = { number:S.character.number||3, color:S.character.color||'blue',
    bg:S.character.bg||'plain', cape:S.character.cape||'none', name:'' };
  const NUMS=[0,1,2,3,4,5,6,7,8,9];

  function draw(){
    scr.innerHTML=`
    <div class="nm-ob">
      <div class="nm-ob-card">
        <h1 class="nm-ob-title">${t('obTitle')}</h1>
        <p class="nm-ob-sub">${t('obSub')}</p>
        <div class="nm-ob-stage" id="obStage">
          <div class="nm-ob-pick" id="obChar">${window.renderNumiChar?window.renderNumiChar(ob,120):''}</div>
        </div>
        <div class="nm-ob-nav">
          <button class="nm-ob-arrow" id="obPrev">‹</button>
          <span class="nm-ob-num">#${ob.number}</span>
          <button class="nm-ob-arrow" id="obNext">›</button>
        </div>
        <input class="nm-ob-input" id="obName" placeholder="${t('obNamePh')}" maxlength="8" value="${esc(ob.name)}">
        <button class="nm-btn nm-ob-go" id="obGo">${t('obGo')}</button>
      </div>
    </div>`;
    $('#obPrev').onclick=()=>{ob.number=(ob.number+9)%10;drawChar();};
    $('#obNext').onclick=()=>{ob.number=(ob.number+1)%10;drawChar();};
    $('#obName').oninput=e=>{ob.name=e.target.value;};
    $('#obName').addEventListener('keydown',e=>{if(e.key==='Enter')go();});
    $('#obGo').onclick=go;
  }
  function drawChar(){
    $('#obChar').innerHTML = window.renderNumiChar?window.renderNumiChar(ob,120):'';
    $('.nm-ob-num').textContent='#'+ob.number;
  }

  async function go(){
    const name=(ob.name||'').trim();
    if(!name){ toast(t('obNeedName'),false); return; }
    ob.name=name;
    /* 이름 중복 확인: 유일하면 이 이름이 곧 아이디가 되어 클라우드에 기억된다 */
    const btn=$('#obGo');
    btn.disabled=true;
    btn.textContent=S.lang==='ko'?'이름 확인 중…':S.lang==='en'?'Checking name…':'检查名字中…';
    let existing=null, online=true;
    try{ existing=await cloudGet(name); }
    catch(e){ online=false; }               // 오프라인 → 로컬 전용으로 진행
    if(!online){ reveal(name); return; }
    if(existing){ askResume(name, existing); return; }
    /* 유일한 이름 → 클레임 */
    try{
      const okClaim=await cloudClaim(name,{});
      if(!okClaim){ const again=await cloudGet(name).catch(()=>null); askResume(name, again||{state:{}}); return; }
      ob.claimed=true;
      reveal(name);
    }catch(e){ reveal(name); }              // 클레임 실패 시에도 앱은 계속
  }

  /* 같은 이름이 이미 있을 때: 이어하기 / 다른 이름 */
  function askResume(name, existing){
    scr.innerHTML=`
    <div class="nm-ob">
      <div class="nm-ob-card">
        <div class="nm-ob-dupico">🧙</div>
        <h1 class="nm-ob-title">${S.lang==='ko'?`'${esc(name)}' 친구가 이미 있어요!`:S.lang==='en'?`'${esc(name)}' already exists!`:`已经有叫'${esc(name)}'的朋友了！`}</h1>
        <p class="nm-ob-sub">${S.lang==='ko'?'예전에 만든 내 캐릭터라면 이어서 할 수 있어요.':S.lang==='en'?'If that was you, you can continue your adventure.':'如果那是你，可以继续冒险。'}</p>
        <button class="nm-btn nm-ob-go" id="obResume">${S.lang==='ko'?'이건 나예요! 이어하기 ▶':S.lang==='en'?"That's me! Continue ▶":'是我！继续 ▶'}</button>
        <button class="nm-btn ghost nm-ob-go" id="obRename">${S.lang==='ko'?'다른 이름 쓸래요':S.lang==='en'?'Pick another name':'换个名字'}</button>
      </div>
    </div>`;
    $('#obResume').onclick=()=>{
      const st=existing&&existing.state?existing.state:{};
      S={...defaults(),...st};
      S.name=name; S.onboarded=true; S.cloudLinked=true;
      if(!S.character)S.character={number:3,color:'blue',bg:'plain',cape:'none'};
      save(); render();
      toast(t('obWelcome')(name),true);
    };
    $('#obRename').onclick=()=>{ ob.name=''; draw(); };
  }

  /* 구름 뒤에서 캐릭터가 "짠!" 등장하는 연출 */
  function reveal(name){
    const puffs=[
      {w:140,h:140,l:-70,  tp:-80,  dx:-20, dy:-90},
      {w:100,h:100,l:-145, tp:-40,  dx:-110,dy:-50},
      {w:95, h:95, l:47.5, tp:-42.5,dx:120, dy:-55},
      {w:80, h:80, l:-95,  tp:15,   dx:-90, dy:60},
      {w:80, h:80, l:20,   tp:20,   dx:95,  dy:65},
      {w:70, h:70, l:-35,  tp:35,   dx:10,  dy:100},
    ];
    const puffHtml=puffs.map(p=>`<span class="puff" style="width:${p.w}px;height:${p.h}px;left:${p.l}px;top:${p.tp}px;--dx:${p.dx}px;--dy:${p.dy}px"></span>`).join('');
    scr.innerHTML=`
    <div class="nm-ob">
      <div class="nm-ob-card">
        <div class="nm-ob-reveal" id="obReveal">
          <div class="ncloud nm-ob-rcloud" id="obCloud">${puffHtml}</div>
          <div class="nm-ob-rchar" id="obRchar">${window.renderNumiChar?window.renderNumiChar(ob,140):''}</div>
          <div class="nm-ob-welcome" id="obWelcomeMsg">${esc(t('obWelcome')(name))}</div>
        </div>
      </div>
    </div>`;
    requestAnimationFrame(()=>{
      $('#obCloud').classList.add('burst');
      $('#obRchar').classList.add('pop');
      $('#obWelcomeMsg').classList.add('show');
    });
    setTimeout(finish, 1900);
  }

  function finish(){
    S.character = {number:ob.number,color:ob.color,bg:ob.bg,cape:ob.cape};
    S.name = ob.name;
    S.onboarded = true;
    if(ob.claimed)S.cloudLinked = true;   // 이름 클레임 성공 → 이후 진행상황 자동 동기화
    save();
    render();
  }

  draw();
}

/* ============================================================
   마을(Living Town) — map.jpg 위 드래그/줌 + 구름/분수/걸어다니는 숫자친구
   건물↔등급 배치(확정): 책건물=BASIC · 타운홀=PRIME ·
   우하단 집=ADVANCE · 정자=CHALLENGE · Magic Theater=영상관(별도, 등급 아님)
   ============================================================ */
const TOWN_SPOTS=[
  { tier:'numberland',   pos:'left:8%;top:13%;width:24%;height:28%',  tag:'📖 BASIC',     sub:{ko:'수의 나라',en:'Number Land',zh:'数字王国'} },
  { tier:'beginner',     pos:'left:36%;top:19%;width:16%;height:22%', tag:'🏛️ PRIME',     sub:{ko:'초급',en:'Beginner',zh:'初级'} },
  { tier:'advanced',     pos:'left:73%;top:24%;width:11%;height:14%', tag:'⛰️ CHALLENGE', sub:{ko:'고급',en:'Advanced',zh:'高级'} },
  { tier:'intermediate', pos:'left:74%;top:58%;width:13%;height:16%', tag:'🏠 ADVANCE',   sub:{ko:'중급',en:'Intermediate',zh:'中级'} },
  { tier:'_theater',     pos:'left:53%;top:19%;width:13%;height:22%', tag:'🎬 극장',       sub:{ko:'영상',en:'Videos',zh:'视频'}, lockIcon:'🎬' },
  { tier:'_closet',      pos:'left:8%;top:62%;width:15%;height:20%',  tag:'🪄 꾸미기',      sub:{ko:'마법사 옷장',en:"Wizard's Closet",zh:'魔法师衣橱'} }
];
function tierById(id){return CUR.tiers.find(x=>x.id===id);}
function tierOpen(tier){return !!(tier&&tier.levels.some(l=>l.available&&(l.units||[]).some(u=>UNITS[u])));}

/* 건물 5곳을 모두 포함하는 콘텐츠 영역(bbox) 계산 — 카메라 피팅에 사용 */
function parsePos(posStr){
  const o={};
  posStr.split(';').forEach(kv=>{
    const parts=kv.split(':');
    if(parts.length===2)o[parts[0].trim()]=parseFloat(parts[1]);
  });
  return o;
}
function computeContentBBox(W,H,pad){
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  TOWN_SPOTS.forEach(sp=>{
    const p=parsePos(sp.pos);
    const x1=p.left/100*W, y1=p.top/100*H;
    const x2=x1+p.width/100*W, y2=y1+p.height/100*H;
    if(x1<minX)minX=x1; if(y1<minY)minY=y1;
    if(x2>maxX)maxX=x2; if(y2>maxY)maxY=y2;
  });
  const padX=W*pad, padY=H*pad;
  const x=Math.max(0,minX-padX), y=Math.max(0,minY-padY);
  const w=Math.min(W,maxX+padX)-x, h=Math.min(H,maxY+padY)-y;
  return {x,y,w,h};
}

function screenTown(){
  if(townCleanup){townCleanup();townCleanup=null;}
  const scr=$('#screen');
  let zones='';
  TOWN_SPOTS.forEach(sp=>{
    const tier=tierById(sp.tier);
    const open=sp.tier==='_theater'?false:sp.tier==='_closet'?true:tierOpen(tier);
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
        <div class="nb nb-player" id="nbNumi"><div class="speech"></div>
          <div class="nb-name">${S.name?esc(S.name):'#'+S.character.number}</div>
          <div class="nb-img nb-svg">${window.renderNumiChar?window.renderNumiChar(S.character,52):'<img src="assets/characters/numi-0.png" alt="Numi">'}</div>
          <div class="shadow"></div></div>
        <div class="nb" id="nbPoco"><div class="speech"></div>
          <div class="nb-img nb-svg">${window.renderNumiChar?window.renderNumiChar({number:3,color:'gold',bg:'plain'},52):'<img src="assets/characters/poco-3.png" alt="Poco">'}</div>
          <div class="shadow"></div></div>
        <div class="nb" id="nbMomo"><div class="speech"></div>
          <div class="nb-img nb-svg">${window.renderNumiChar?window.renderNumiChar({number:8,color:'pink',bg:'plain'},52):'<img src="assets/characters/momo-8.png" alt="Momo">'}</div>
          <div class="shadow"></div></div>
      </div>
    </div>
    <div class="nm-town-hud brand">${t('mapTitle')}</div>
    <div class="nm-road-banner" id="roadBanner">
      <button class="nm-road-banner-btn" id="roadEnter">
        🗺️ ${S.lang==='ko'?'학습 여행':S.lang==='en'?'Learning Journey':'学习之旅'}
        <span class="nm-road-next">${roadmapNextLabel()}</span>
      </button>
      <button class="nm-road-banner-btn" id="gradeEnter" style="margin-top:6px;background:#e8f0f8;color:#2a4a7a;font-size:13px;padding:7px 16px">
        🏫 ${S.lang==='ko'?'학년별 교실':S.lang==='en'?'Grade Rooms':'按年级'}
      </button>
    </div>
    <div class="nm-town-hud info"><a class="nm-philobtn" href="about.html">✦ ${S.lang==='ko'?'철학':S.lang==='en'?'Philosophy':'理念'}</a></div>
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
  const rb=$('#roadEnter');if(rb)rb.onclick=()=>{S.view='roadmap';save();render();};
  const gb=$('#gradeEnter');if(gb)gb.onclick=()=>{S.view='gradecourse';save();render();};
}

/* ─── roadmap 헬퍼 ─── */
function roadmapNextLabel(){
  if(!window.NM_ROADMAP)return '';
  const chapters=NM_ROADMAP.chapters;
  for(const ch of chapters){
    for(const uid of (ch.units||[])){   /* 게임 챕터(G0·G1)는 units 없음 */
      if(!stepDone(uid,'stamp')) return S.lang==='ko'?`이어서: ${UNITS[uid]?L(UNITS[uid].title):'...'}`:S.lang==='en'?`Continue: ${UNITS[uid]?L(UNITS[uid].title):'...'}`:S.lang==='zh'?`继续: ${UNITS[uid]?L(UNITS[uid].title):'...'}`:'';
    }
  }
  return S.lang==='ko'?'🏆 전체 완료!':S.lang==='en'?'🏆 All done!':'🏆 全部完成！';
}

/* ─── screenRoadmap: 징검다리 길 ─── */
function screenRoadmap(){
  if(townCleanup){townCleanup();townCleanup=null;}
  const scr=$('#screen');
  if(!window.NM_ROADMAP){scr.innerHTML='<div class="nm-card">roadmap.js 없음</div>';return;}
  const road=NM_ROADMAP;
  const nextId=findNextRoadUnit();
  let html=`<div class="nm-road-wrap">
    <div class="nm-road-header">
      <button class="nm-back" id="roadBack">← ${t('back')}</button>
      <div class="nm-unit-title">🗺️ ${L(road.title)}</div>
      <div class="nm-road-sub">${L(road.subtitle)}</div>
    </div>
    <div class="nm-road-path">`;

  road.chapters.forEach((ch,ci)=>{
    /* 미니게임 챕터 */
    if(ch.game){
      const played=S.gamesPlayed&&S.gamesPlayed[ch.game];
      html+=`<div class="nm-road-gamestone ${played?'played':''}" data-game="${ch.game}">
        <div class="nm-road-gamestone-icon">${ch.icon}</div>
        <div class="nm-road-gamestone-title">${L(ch.theme)}</div>
        ${ch.tip?`<div class="nm-road-gamestone-tip">💡 ${L(ch.tip)}</div>`:''}
      </div>`;
      if(ci<road.chapters.length-1)html+=`<div class="nm-road-arrow">↓</div>`;
      return;
    }
    const chapDone=(ch.units||[]).every(uid=>stepDone(uid,'stamp'));
    html+=`<div class="nm-road-chapter ${chapDone?'done':''}">
      <div class="nm-road-ch-head">${ch.icon} <span>${L(ch.theme)}</span>
        ${ch.edu?`<span class="nm-edu-badge">${L(ch.edu)}</span>`:''}
      </div>`;
    (ch.units||[]).forEach((uid,ui)=>{
      const u=UNITS[uid];
      if(!u)return;
      const done=stepDone(uid,'stamp');
      const isNext=uid===nextId;
      const cls='nm-road-stone'+(done?' done':isNext?' next':'');
      html+=`<div class="${cls}" data-uid="${uid}" style="margin-left:${(ui%2)*32}px">
        ${done?'⭐':''}
        <div class="nm-road-stone-title">${L(u.title)}</div>
        ${isNext?`<div class="nm-road-next-lbl">${S.lang==='ko'?'여기부터!':S.lang==='en'?"Start here!":"从这里！"}</div>`:''}
      </div>`;
    });
    if(ch.tip){
      html+=`<div class="nm-road-tip">💡 ${L(ch.tip)}</div>`;
    }
    html+=`</div>`;
    if(ci<road.chapters.length-1)html+=`<div class="nm-road-arrow">↓</div>`;
  });

  html+=`</div></div>`;
  scr.innerHTML=html;

  $('#roadBack').onclick=()=>{S.view='town';save();render();};

  scr.querySelectorAll('.nm-road-stone[data-uid]').forEach(el=>{
    el.onclick=()=>{
      const uid=el.dataset.uid;
      const done=stepDone(uid,'stamp');
      const isNext=uid===findNextRoadUnit();
      if(done||isNext){enterRoadUnit(uid);return;}
      /* 건너뛰기 확인 */
      const u=UNITS[uid];
      const msg=S.lang==='ko'?`먼저 앞 걸음을 추천해요.\n그래도 "${L(u.title)}"를 할래요?`:
        S.lang==='en'?`We recommend the earlier steps first.\nStill want to do "${L(u.title)}"?`:
        `建议先完成前面的步骤。\n还是要做"${L(u.title)}"吗？`;
      if(confirm(msg))enterRoadUnit(uid);
    };
  });
  /* 미니게임 스톤 클릭 */
  scr.querySelectorAll('.nm-road-gamestone[data-game]').forEach(el=>{
    el.onclick=()=>{
      S.miniGameId=el.dataset.game;S.miniGame=null;
      S._fromRoadmap=true;S.view='minigame';save();render();
    };
  });
}

function findNextRoadUnit(){
  if(!window.NM_ROADMAP)return null;
  for(const ch of NM_ROADMAP.chapters){
    if(!ch.units)continue;
    for(const uid of ch.units){
      if(!stepDone(uid,'stamp'))return uid;
    }
  }
  return null;
}

function enterRoadUnit(uid){
  S.unit=uid;S.step=null;S.sub={};S.tierId=null;S.view='unit';
  S._fromRoadmap=true;
  save();render();
}

/* ─── Make-10 미니게임 ─── */
let mgTimer=null;

function _mgInit(id){
  if(id==='make10'){
    const vals=[1,9,2,8,3,7,4,6];
    for(let i=vals.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]];}
    return{id:'make10',tiles:vals.map((v,i)=>({id:i,val:v,state:'idle'})),selected:null,pairs:0,timer:60,startTs:Date.now(),done:false};
  }
  if(id==='make10_3'){
    /* 합이 10인 서로 다른 세 수 조합 4세트: 1+2+7, 1+3+6, 1+4+5, 2+3+5 */
    const vals=[1,2,7,1,3,6,1,4,5,2,3,5];
    for(let i=vals.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[vals[i],vals[j]]=[vals[j],vals[i]];}
    return{id:'make10_3',tiles:vals.map((v,i)=>({id:i,val:v,state:'idle'})),selected:[],triples:0,total:4,timer:90,startTs:Date.now(),done:false,wrongFlash:false};
  }
  return{id,tiles:[],done:false};
}

function screenMiniGame(gameId){
  if(townCleanup){townCleanup();townCleanup=null;}
  if(!S.miniGame||S.miniGame.id!==gameId||S.miniGame.fresh){S.miniGame=_mgInit(gameId);}
  _renderMiniGame();
}

function _renderMiniGame(){
  const scr=$('#screen');
  const mg=S.miniGame;
  if(!mg){return;}
  const lang=S.lang;
  const lk=(ko,en,zh)=>lang==='ko'?ko:lang==='en'?en:zh;

  if(mg.id==='make10'){
    const remaining=mg.done?0:Math.max(0,mg.timer-Math.floor((Date.now()-mg.startTs)/1000));
    if(remaining===0&&!mg.done){mg.done=true;save();}

    const tilesHtml=mg.tiles.map(tl=>{
      if(tl.state==='matched')return`<div class="nm-mg-tile matched">✓</div>`;
      const sel=tl.state==='selected';
      return`<div class="nm-mg-tile${sel?' sel':''}" data-tid="${tl.id}">${tl.val}</div>`;
    }).join('');

    scr.innerHTML=`<div class="nm-mg-wrap">
      <div class="nm-mg-header">
        <button class="nm-back" id="mgBack">← ${t('back')}</button>
        <div class="nm-mg-title">🎮 Make 10 — ${lk('짝 찾기','Pair Up','配对游戏')}</div>
        <div class="nm-mg-meta">
          ${mg.done?'':`<span class="nm-mg-timer${remaining<=10?' warn':''}">⏱ ${remaining}s</span>`}
          <span class="nm-mg-score">⭐ ${mg.pairs}/4 ${lk('쌍','pairs','对')}</span>
        </div>
      </div>
      ${mg.done?`<div class="nm-mg-done">
        <div class="nm-mg-done-icon">${mg.pairs===4?'🏆':'🌟'}</div>
        <div class="nm-mg-done-msg">${mg.pairs===4?lk('완벽! 4쌍 모두 맞췄어요!','Perfect! All 4 pairs!','完美！全部配对！'):lk(`${mg.pairs}쌍 맞췄어요! 다시 도전해볼까요?`,`Got ${mg.pairs} pairs! Try again?`,`配对了${mg.pairs}对！再试一次？`)}</div>
        <div class="nm-mg-done-coins">🪙 +${mg.pairs*3}</div>
        <div class="nm-mg-done-btns">
          <button class="nm-mg-btn" id="mgRetry">${lk('다시 하기','Play Again','再玩')}</button>
          <button class="nm-mg-btn" id="mgContinue">${lk('계속 공부','Keep Learning','继续学习')}</button>
        </div>
      </div>`:`<div class="nm-mg-board" id="mgBoard">
        <div class="nm-mg-hint">${lk('합이 10이 되는 두 수를 눌러요!','Tap two numbers that add up to 10!','点击两个加起来等于10的数！')}</div>
        <div class="nm-mg-tiles">${tilesHtml}</div>
      </div>`}
    </div>`;

    $('#mgBack').onclick=()=>{
      clearInterval(mgTimer);mgTimer=null;
      const back=S._fromRoadmap?'roadmap':'town';
      S.view=back;S._fromRoadmap=false;save();render();
    };

    if(mg.done){
      const rb=$('#mgRetry');if(rb)rb.onclick=()=>{clearInterval(mgTimer);mgTimer=null;S.miniGame=_mgInit('make10');save();_renderMiniGame();};
      const cb=$('#mgContinue');if(cb)cb.onclick=()=>{
        clearInterval(mgTimer);mgTimer=null;
        S.coins+=(mg.pairs*3);
        S.gamesPlayed=S.gamesPlayed||{};S.gamesPlayed['make10']=true;
        const back=S._fromRoadmap?'roadmap':'town';
        S.view=back;S._fromRoadmap=false;save();render();
      };
    } else {
      const board=$('#mgBoard');
      if(board)board.querySelectorAll('.nm-mg-tile[data-tid]').forEach(el=>{
        el.onclick=()=>{
          const tid=+el.dataset.tid;
          const tl=mg.tiles.find(x=>x.id===tid);
          if(!tl||tl.state==='matched')return;
          if(mg.selected===null){
            if(tl.state==='selected'){tl.state='idle';mg.selected=null;}
            else{tl.state='selected';mg.selected=tid;}
          } else {
            const prev=mg.tiles.find(x=>x.id===mg.selected);
            if(!prev){tl.state='selected';mg.selected=tid;}
            else if(prev.id===tl.id){tl.state='idle';mg.selected=null;}
            else if(prev.val+tl.val===10){
              prev.state='matched';tl.state='matched';mg.selected=null;mg.pairs++;
              if(mg.pairs===4){mg.done=true;clearInterval(mgTimer);mgTimer=null;save();}
            } else {
              prev.state='idle';tl.state='selected';mg.selected=tid;
            }
          }
          _renderMiniGame();
        };
      });
      if(!mgTimer&&!mg.done){
        mgTimer=setInterval(()=>{
          if(!S.miniGame||S.miniGame.done){clearInterval(mgTimer);mgTimer=null;return;}
          const rem=Math.max(0,S.miniGame.timer-Math.floor((Date.now()-S.miniGame.startTs)/1000));
          if(rem===0){S.miniGame.done=true;clearInterval(mgTimer);mgTimer=null;save();}
          _renderMiniGame();
        },1000);
      }
    }
  }

  /* ─── 3수 합이 10 게임 ─── */
  else if(mg.id==='make10_3'){
    const remaining=mg.done?0:Math.max(0,mg.timer-Math.floor((Date.now()-mg.startTs)/1000));
    if(remaining===0&&!mg.done){mg.done=true;save();}

    const selSet=new Set(mg.selected);
    const tilesHtml=mg.tiles.map(tl=>{
      if(tl.state==='matched')return`<div class="nm-mg-tile matched">✓</div>`;
      const sel=selSet.has(tl.id);
      return`<div class="nm-mg-tile${sel?' sel':''}${sel&&mg.wrongFlash?' wrong':''}" data-tid="${tl.id}">${tl.val}</div>`;
    }).join('');
    const selSum=mg.selected.reduce((s,tid)=>{const tl=mg.tiles.find(x=>x.id===tid);return s+(tl?tl.val:0);},0);

    scr.innerHTML=`<div class="nm-mg-wrap">
      <div class="nm-mg-header">
        <button class="nm-back" id="mgBack">← ${t('back')}</button>
        <div class="nm-mg-title">🎯 3수 Make 10 — ${lk('세 수로 10 만들기','3 Numbers → 10','三数凑10')}</div>
        <div class="nm-mg-meta">
          ${mg.done?'':`<span class="nm-mg-timer${remaining<=10?' warn':''}">⏱ ${remaining}s</span>`}
          <span class="nm-mg-score">⭐ ${mg.triples}/4 ${lk('세트','sets','组')}</span>
          ${mg.selected.length>0?`<span style="font-size:12px;font-weight:800;padding:3px 10px;border-radius:10px;background:#e8f0fa;color:#2a5a9a">합 ${selSum}</span>`:''}
        </div>
      </div>
      ${mg.done?`<div class="nm-mg-done">
        <div class="nm-mg-done-icon">${mg.triples===4?'🏆':'🌟'}</div>
        <div class="nm-mg-done-msg">${mg.triples===4?lk('완벽! 4세트 모두 찾았어요!','Perfect! All 4 sets!','完美！全部找到！'):lk(`${mg.triples}세트 찾았어요! 다시 도전?`,`Got ${mg.triples} sets! Try again?`,`找到${mg.triples}组！再试？`)}</div>
        <div class="nm-mg-done-coins">🪙 +${mg.triples*5}</div>
        <div class="nm-mg-done-btns">
          <button class="nm-mg-btn" id="mgRetry">${lk('다시 하기','Play Again','再玩')}</button>
          <button class="nm-mg-btn" id="mgContinue">${lk('계속 공부','Keep Learning','继续学习')}</button>
        </div>
      </div>`:`<div class="nm-mg-board" id="mgBoard">
        <div class="nm-mg-hint">${lk('합이 10인 세 수를 골라요!','Pick 3 numbers that sum to 10!','选三个加起来等于10的数！')} &nbsp;<small style="color:#9aa">1+2+7 / 1+3+6 / 1+4+5 / 2+3+5</small></div>
        <div class="nm-mg-tiles" style="grid-template-columns:repeat(4,1fr)">${tilesHtml}</div>
      </div>`}
    </div>`;

    $('#mgBack').onclick=()=>{clearInterval(mgTimer);mgTimer=null;const back=S._fromRoadmap?'roadmap':'town';S.view=back;S._fromRoadmap=false;save();render();};

    if(mg.done){
      const rb=$('#mgRetry');if(rb)rb.onclick=()=>{clearInterval(mgTimer);mgTimer=null;S.miniGame=_mgInit('make10_3');save();_renderMiniGame();};
      const cb=$('#mgContinue');if(cb)cb.onclick=()=>{
        clearInterval(mgTimer);mgTimer=null;S.coins+=(mg.triples*5);
        S.gamesPlayed=S.gamesPlayed||{};S.gamesPlayed['make10_3']=true;
        const back=S._fromRoadmap?'roadmap':'town';S.view=back;S._fromRoadmap=false;save();render();
      };
    } else {
      const board=$('#mgBoard');
      if(board)board.querySelectorAll('.nm-mg-tile[data-tid]').forEach(el=>{
        el.onclick=()=>{
          if(mg.wrongFlash)return;
          const tid=+el.dataset.tid;
          const tl=mg.tiles.find(x=>x.id===tid);
          if(!tl||tl.state==='matched')return;

          if(tl.state==='selected'){
            tl.state='idle';mg.selected=mg.selected.filter(id=>id!==tid);
          } else if(mg.selected.length<3){
            tl.state='selected';mg.selected.push(tid);
          }

          if(mg.selected.length===3){
            const sum=mg.selected.reduce((s,id)=>{const x=mg.tiles.find(t=>t.id===id);return s+(x?x.val:0);},0);
            if(sum===10){
              mg.selected.forEach(id=>{const x=mg.tiles.find(t=>t.id===id);if(x)x.state='matched';});
              mg.selected=[];mg.triples++;
              if(mg.triples===4){mg.done=true;clearInterval(mgTimer);mgTimer=null;save();}
            } else {
              mg.wrongFlash=true;
              _renderMiniGame();
              setTimeout(()=>{
                mg.selected.forEach(id=>{const x=mg.tiles.find(t=>t.id===id);if(x&&x.state==='selected')x.state='idle';});
                mg.selected=[];mg.wrongFlash=false;_renderMiniGame();
              },600);
              return;
            }
          }
          _renderMiniGame();
        };
      });
      if(!mgTimer&&!mg.done){
        mgTimer=setInterval(()=>{
          if(!S.miniGame||S.miniGame.done){clearInterval(mgTimer);mgTimer=null;return;}
          const rem=Math.max(0,S.miniGame.timer-Math.floor((Date.now()-S.miniGame.startTs)/1000));
          if(rem===0){S.miniGame.done=true;clearInterval(mgTimer);mgTimer=null;save();}
          _renderMiniGame();
        },1000);
      }
    }
  }
}

/* ─── 학년별 교실 ─── */
function screenGradeCourse(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  if(!window.NM_ROADMAP){$('#screen').innerHTML='<div class="nm-card">roadmap.js 없음</div>';return;}

  const GRADES=[
    {key:'유아',label:{ko:'유아',en:'Ages 5–7',zh:'幼儿'}},
    {key:'초1',label:{ko:'초1',en:'Grade 1',zh:'一年级'}},
    {key:'초2',label:{ko:'초2',en:'Grade 2',zh:'二年级'}},
    {key:'초3',label:{ko:'초3',en:'Grade 3',zh:'三年级'}},
    {key:'초4',label:{ko:'초4',en:'Grade 4',zh:'四年级'}},
    {key:'초5',label:{ko:'초5',en:'Grade 5',zh:'五年级'}},
    {key:'창의',label:{ko:'창의수연',en:'Creative',zh:'创意'}},
  ];
  S._gcGrade=S._gcGrade||'초1';

  function chaptersForGrade(g){
    return NM_ROADMAP.chapters.filter(ch=>ch.grade===g);
  }
  function unitProgress(chs){
    let done=0,total=0;
    chs.forEach(ch=>{(ch.units||[]).forEach(uid=>{total++;if(stepDone(uid,'stamp'))done++;});});
    return{done,total};
  }

  const lang=S.lang;
  const lk=(ko,en,zh)=>lang==='ko'?ko:lang==='en'?en:zh;
  const scr=$('#screen');

  function draw(){
    const curGrade=S._gcGrade;
    const chs=chaptersForGrade(curGrade);
    const nextId=findNextRoadUnit();

    const tabsHtml=GRADES.map(g=>{
      const cg=chaptersForGrade(g.key);
      const prog=unitProgress(cg);
      return`<button class="nm-gc-tab${g.key===curGrade?' active':''}" data-g="${g.key}">${L(g.label)}${prog.total>0?` <small>${prog.done}/${prog.total}</small>`:''}</button>`;
    }).join('');

    let bodyHtml='';
    chs.forEach(ch=>{
      if(ch.game){
        const played=S.gamesPlayed&&S.gamesPlayed[ch.game];
        bodyHtml+=`<div class="nm-gc-game-row" data-game="${ch.game}">
          <span style="font-size:20px">${ch.icon}</span>
          <span style="font-size:12px;font-weight:800;flex:1">${L(ch.theme)}</span>
          ${played?`<span class="nm-gc-badge">✓ ${lk('완료','Done','完成')}</span>`:`<span class="nm-gc-badge">🎮 ${lk('게임','Game','游戏')}</span>`}
        </div>`;
        return;
      }
      const units=ch.units||[];
      const chapDone=units.every(uid=>stepDone(uid,'stamp'));
      const prog=units.filter(uid=>stepDone(uid,'stamp')).length;
      bodyHtml+=`<div class="nm-gc-chapter">
        <div class="nm-gc-chapter-head">${ch.icon} ${L(ch.theme)}
          ${ch.edu?`<span class="nm-gc-badge">${L(ch.edu)}</span>`:''}
        </div>`;
      units.forEach(uid=>{
        const u=UNITS[uid];if(!u)return;
        const done=stepDone(uid,'stamp');
        const isNext=uid===nextId;
        bodyHtml+=`<div class="nm-gc-unit-row" data-uid="${uid}">
          <div class="nm-gc-unit-dot${done?' done':isNext?' next':''}"></div>
          <div class="nm-gc-unit-name${done?' done':''}">${L(u.title)}</div>
          ${done?'<span style="font-size:11px">⭐</span>':isNext?`<span class="nm-gc-badge">${lk('다음','Next','下一个')}</span>`:''}
        </div>`;
      });
      if(units.length>0)bodyHtml+=`<div class="nm-gc-prog">${prog}/${units.length} ${lk('완료','done','完成')}</div>`;
      bodyHtml+=`</div>`;
    });
    if(!bodyHtml)bodyHtml=`<div style="padding:40px;text-align:center;color:#aaa;font-size:13px">${lk('이 학년 유닛이 없어요.','No units for this grade yet.','此年级暂无单元。')}</div>`;

    scr.innerHTML=`<div class="nm-gc-wrap">
      <div class="nm-gc-header">
        <button class="nm-back" id="gcBack">← ${t('back')}</button>
        <div class="nm-gc-title">🏫 ${lk('학년별 교실','Grade Classroom','按年级学习')}</div>
      </div>
      <div class="nm-gc-tabs">${tabsHtml}</div>
      <div class="nm-gc-body">${bodyHtml}</div>
    </div>`;

    $('#gcBack').onclick=()=>{S.view='town';S._gcGrade=null;save();render();};
    scr.querySelectorAll('.nm-gc-tab[data-g]').forEach(el=>{
      el.onclick=()=>{S._gcGrade=el.dataset.g;draw();};
    });
    scr.querySelectorAll('.nm-gc-unit-row[data-uid]').forEach(el=>{
      el.onclick=()=>{enterRoadUnit(el.dataset.uid);};
    });
    scr.querySelectorAll('.nm-gc-game-row[data-game]').forEach(el=>{
      el.onclick=()=>{S.miniGameId=el.dataset.game;S.miniGame=null;S._fromRoadmap=false;S.view='minigame';save();render();};
    });
  }
  draw();
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

/* 마을 상호작용(드래그/핀치줌/구름/분수/숫자친구/배경음) — 화면을 나갈 때 반드시 cleanup() 호출 */
function initTownWorld(scr){
  const vp=scr.querySelector('#townVp'), world=scr.querySelector('#townWorld');
  const modal=scr.querySelector('#tmodal');
  const W=1024,H=687;
  let cam={x:0,y:0,scale:1},minS=1,maxS=3;
  const BBOX=computeContentBBox(W,H,.04);

  /* 화면 꽉 채우기(cover)와 "건물 5곳 항상 보이기(bbox contain)" 중 더 작은(=더 안전한) 배율 선택.
     데스크탑처럼 화면비가 지도와 비슷하면 cover와 같은 값이라 화면이 꽉 참.
     세로로 매우 긴 모바일처럼 화면비가 크게 다르면 bbox 쪽이 이겨서 건물이 절대 화면 밖으로 안 밀림. */
  function fit(){
    const coverS=Math.max(vp.clientWidth/W,vp.clientHeight/H);
    const bboxS=Math.min(vp.clientWidth/BBOX.w,vp.clientHeight/BBOX.h);
    minS=Math.min(coverS,bboxS);
    if(cam.scale<minS)cam.scale=minS;
  }
  function apply(){world.style.transform=`translate(${cam.x}px,${cam.y}px) scale(${cam.scale})`;}
  function bound(){
    const mx=vp.clientWidth-W*cam.scale, my=vp.clientHeight-H*cam.scale;
    cam.x = mx>=0 ? Math.min(mx,Math.max(0,cam.x)) : Math.min(0,Math.max(mx,cam.x));
    cam.y = my>=0 ? Math.min(my,Math.max(0,cam.y)) : Math.min(0,Math.max(my,cam.y));
  }
  function center(){
    cam.scale=minS;
    const bcx=BBOX.x+BBOX.w/2, bcy=BBOX.y+BBOX.h/2;
    cam.x=vp.clientWidth/2-bcx*cam.scale;
    cam.y=vp.clientHeight/2-bcy*cam.scale;
    bound();apply();
  }

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
  function pdUp(e){pts.delete(e.pointerId);if(pts.size<2){pd=0;pinched=false;}}
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
        const examLabel=S.lang==='ko'?'📝 학습지 & 시험':S.lang==='en'?'📝 Worksheet & Exam':'📝 学习单 & 考试';
        const examDesc=S.lang==='ko'?'시드 학습지를 인쇄하거나 타이머 시험을 볼 수 있어요.':
          S.lang==='en'?'Print a seeded worksheet or take a timed exam.':'打印带种子的学习单，或进行限时考试。';
        showTownModal(examLabel, examDesc, ()=>{S.view='exam';save();render();});
        return;
      }
      if(id==='_closet'){
        const cl=S.lang==='ko'?'🪄 마법사 옷장':S.lang==='en'?"🪄 Wizard's Closet":'🪄 魔法师衣橱';
        const cd=S.lang==='ko'?'숫자·색·표정·모자·배경을 골라 내 캐릭터를 꾸며요!':
          S.lang==='en'?'Customize your number character!':'选择数字、颜色、表情、帽子和背景，打造专属角色！';
        showTownModal(cl, cd, ()=>{S.view='closet';save();render();});
        return;
      }
      const tier=tierById(id);
      if(tierOpen(tier)) showTownModal(`${tier.grade} · ${L(tier.subtitle)}`,L(tier.desc),()=>enterTier(id));
      else showTownModal(`${tier.grade} · ${L(tier.subtitle)}`,L(tier.desc)+' — '+t('locked'),null);
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

  /* 걸어다니는 숫자친구 — nbNumi는 "내가 만든 캐릭터"(플레이어): 지도를 탭하면
     그 자리로 걸어간다. Poco/Momo는 NPC로 계속 자유 배회. */
  const myName=S.name?S.name:('#'+S.character.number);
  const nbs=[
    {el:scr.querySelector('#nbNumi'),x:40,y:62,tx:40,ty:62,spd:.22,player:true,
      lines:[`안녕! 난 ${myName}(이)야 ✨`,'지도를 콕 찍으면 내가 걸어가!','오늘은 어떤 마법을 배울까?']},
    {el:scr.querySelector('#nbPoco'),x:55,y:66,tx:55,ty:66,spd:.14,lines:['안녕! 난 3이야 ✨','7이랑 만나면 10! 🔟','게임하러 가자!']},
    {el:scr.querySelector('#nbMomo'),x:30,y:70,tx:30,ty:70,spd:.08,lines:['안녕! 난 8이야 💖','2랑 만나면 10! 🔟','실수는 괜찮아!']}
  ];
  nbs.forEach(n=>{n.el.style.left=n.x+'%';n.el.style.top=n.y+'%';});
  function pick(n){const sp=[[38,60],[52,64],[30,72],[46,74],[60,68],[24,66]];const p=sp[Math.random()*sp.length|0];n.tx=p[0]+Math.random()*6;n.ty=p[1]+Math.random()*4;}
  nbs.forEach(n=>{if(!n.player)pick(n);});
  let walkRAF;
  let muted=true;
  let stopAmbience=null;
  function walk(){
    nbs.forEach(n=>{
      const dx=n.tx-n.x,dy=n.ty-n.y,d=Math.hypot(dx,dy);
      if(d<.3){if(!n.player&&Math.random()<.012)pick(n);return;}   // 플레이어는 도착하면 그 자리에 머문다
      n.x+=dx/d*n.spd;n.y+=dy/d*n.spd;
      n.el.style.left=n.x+'%';n.el.style.top=n.y+'%';
      n.el.querySelector('.nb-img').style.transform=dx<0?'scaleX(-1)':'scaleX(1)';
    });
    walkRAF=requestAnimationFrame(walk);
  }
  walkRAF=requestAnimationFrame(walk);

  /* 탭 → 내 캐릭터 이동. 카메라 드래그(moved)·핀치줌·건물/친구 탭(stopPropagation)과
     충돌하지 않도록: 드래그하지 않은 "가벼운 탭"일 때만 목적지로 삼는다. */
  let pinched=false;
  vp.addEventListener('pointermove',()=>{if(pts.size>=2)pinched=true;});
  vp.addEventListener('pointerup',e=>{
    if(moved){return;}
    if(pinched){pinched=false;return;}
    if(modal.classList.contains('on'))return;
    const r=vp.getBoundingClientRect();
    const wx=(e.clientX-r.left-cam.x)/cam.scale;   // 월드 px
    const wy=(e.clientY-r.top -cam.y)/cam.scale;
    let px=wx/W*100, py=wy/H*100;                  // 월드 %
    if(px<2||px>98||py<4||py>96)return;            // 지도 밖 무시
    const me=nbs[0];
    me.tx=px; me.ty=py;
    /* 목적지 표시(잠깐 반짝) */
    const ping=document.createElement('div');
    ping.className='nb-ping';
    ping.style.left=px+'%';ping.style.top=py+'%';
    world.appendChild(ping);
    setTimeout(()=>ping.remove(),700);
  });
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

  /* 음소거 버튼: 배경음악+물소리(Web Audio)와 숫자친구 TTS를 함께 켜고 끔 */
  const mb=scr.querySelector('#townMute');
  mb.textContent=muted?'🔇':'🔈';
  mb.onclick=()=>{
    muted=!muted;
    mb.textContent=muted?'🔇':'🔈';
    if(muted){
      speechSynthesis.cancel();
      if(stopAmbience){stopAmbience();stopAmbience=null;}
    }else{
      if(!stopAmbience)stopAmbience=startAmbience();
    }
  };

  return function cleanup(){
    clearInterval(fountainTimer);
    clearInterval(sparkTimer);
    cancelAnimationFrame(walkRAF);
    removeEventListener('resize',onResize);
    if(stopAmbience){stopAmbience();stopAmbience=null;}
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
      <div class="nm-unit-title">${tier.title}<small>${L(tier.subtitle)} · ${tier.ageLabel}</small></div>
    </div>
    <div class="nm-tier">
      <p class="nm-tier-desc">${L(tier.desc)}</p>
      <div class="nm-levels">`;
  tier.levels.forEach(lvl=>{
    const units=(lvl.units||[]).filter(u=>UNITS[u]);
    const open=lvl.available&&units.length;
    if(open){
      html+=`<div class="nm-level open">
        <div class="nm-level-t">${L(lvl.title)}</div>
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
      html+=`<div class="nm-level locked"><div class="nm-level-t">${L(lvl.title)}</div><span class="nm-lock">🔒 ${t('locked')}</span></div>`;
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
function enterUnit(uid){
  S.view='unit';S.unit=uid;S.sub={};
  const u=UNITS[uid];
  const introSeen=!!(S.progress[uid]&&S.progress[uid].introSeen);
  S.step=(u.introVideo&&!introSeen)?'intro':(u.ranges?'range':'practice');
  save();render();
}
function pickRange(rk){S.range=rk;S.step='practice';S.sub={};save();render();}
function exitUnit(){
  const back=S._fromRoadmap?'roadmap':S.tierId?'tier':'town';
  S.view=back;S._fromRoadmap=false;S.unit=null;S.step=null;S.sub={};save();render();
}
function finishUnitIntro(u){
  S.progress[S.unit]=S.progress[S.unit]||{steps:{}};
  S.progress[S.unit].introSeen=true;
  S.step=u.ranges?'range':'practice';
  save();screenUnit();
}

/* 수의 나라(tier:'basic') 유아 유닛은 경량 플로우 — check(서술형)·arena(타이머) 생략 */
const BASIC_FLOW_KEYS=['practice','discover','lab','stamp'];
function unitFlowOf(u){
  if(u&&u.tier==='basic')return CUR.unitFlow.filter(f=>BASIC_FLOW_KEYS.includes(f.key));
  return CUR.unitFlow;
}
function afterLabKey(u){return (u&&u.tier==='basic')?'stamp':'arena';}

function flowBar(){
  const u=S.unit;
  return `<div class="nm-flow">`+unitFlowOf(UNITS[u]).map((f,i)=>{
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
    ${(S.step==='range'||S.step==='intro')?'':flowBar()}
    <div id="stepBody" class="nm-step-body"></div>
  </div>`;
  $('#backMap').onclick=exitUnit;
  scr.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{S.step=b.dataset.step;save();screenUnit();});
  const body=$('#stepBody');
  if(S.step==='intro'){stepUnitIntro(body,u);return;}
  if(S.step==='range'){stepRange(body,u);renderMath(body);return;}
  ({practice:stepPractice,discover:stepDiscover,check:stepCheck,lab:stepLab,arena:stepArena,stamp:stepStamp}[S.step]||stepDiscover)(body,u);
  renderMath(body);
}

/* ---------- STEP0 유닛 인트로 영상 (선택적: u.introVideo 있을 때만) ----------
   각 유닛 영상은 나중에 개별 제작해 unit 데이터의 introVideo 필드에 넣으면 자동 재생됨.
   영상 없으면 이 스텝 자체를 건너뛰므로(enterUnit) 지금 당장은 아무 유닛에도 영향 없음. */
function stepUnitIntro(body,u){
  body.innerHTML=`<div class="nm-uintro">
    <video class="nm-uintro-vid" src="${u.introVideo}" autoplay muted playsinline preload="auto"></video>
    <button class="nm-uintro-skip">${t('next')}</button>
  </div>`;
  const vid=body.querySelector('.nm-uintro-vid');
  const done=()=>finishUnitIntro(u);
  body.querySelector('.nm-uintro-skip').onclick=done;
  vid.addEventListener('ended',done);
  vid.addEventListener('error',done);
  setTimeout(done,15000);
}

function gotoStep(k){S.step=k;save();screenUnit();}
function nextStepKey(){const ks=unitFlowOf(UNITS[S.unit]).map(f=>f.key);const i=ks.indexOf(S.step);return ks[Math.min(i+1,ks.length-1)];}

/* ---------- STEP1 프랙티스 (진단스킵 + 숫자패드 대화형) ---------- */
function stepPractice(body,u){
  // 진단 스킵(B안): 아직 이 단계 안 했고 스킵 물어보기 전이면
  if(!S.sub.skipAsked && !stepDone(S.unit,'practice')){
    body.innerHTML=`<div class="nm-skip">
      <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
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
  S.sub.pIdx=S.sub.pIdx||0;S.sub.cur=S.sub.cur||genProblem(cfg,'practice');
  const cur=S.sub.cur;
  const first=S.sub.pIdx===0&&!S.sub.started;
  /* 조작 위젯 문제(유아 tapCount 등)는 넘패드 대신 위젯 렌더 */
  if(cur.widget&&cur.widget!=='numpad'&&window.NM_WIDGETS){runPracticeWidget(body,u,cur,first,need);return;}
  const pracTex=cur.tex?`<div class="nm-lab-expr"><span data-tex="${esc(cur.tex)}"></span></div>`:'';
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.pIdx)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble" id="bub">${first?esc(L(cfg.intro))+'<br><br>'+esc(L(cur.prompt)):esc(L(cur.prompt))}</div>
    ${pracTex}
    <div class="nm-numpad-screen" id="pscreen">&nbsp;</div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-hint">${t('numpadHint')}</div>
  </div>`;
  S.sub.started=true;
  renderMath(body);
  const isDecAns=cur&&!Number.isInteger(cur.answer);
  buildNumpad($('#pad'),val=>handlePractice(val,body,u),{decimal:isDecAns});
  say(first?L(cfg.intro):L(cur.prompt));
}
function runPracticeWidget(body,u,cur,first,need){
  const cfg=u.practice;
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.pIdx)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble" id="bub">${first?esc(L(cfg.intro))+'<br><br>'+esc(L(cur.prompt)):esc(L(cur.prompt))}</div>
    <div id="pracWidget" class="nm-lab-widget"></div>
  </div>`;
  S.sub.started=true;
  say(first?L(cfg.intro):L(cur.prompt));
  NM_WIDGETS.render(cur,$('#pracWidget'),val=>{
    if(+val===cur.answer){
      toast(t('correct'),true);numiHappy();
      S.sub.pIdx++;S.sub.cur=null;
      if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');setTimeout(()=>gotoStep('discover'),700);return;}
      S.sub.cur=genProblem(cfg,'practice');save();
      setTimeout(()=>runPractice(body,u),650);
    }else{
      toast(t('tryAgain'),false);
    }
  });
}
function handlePractice(val,body,u){
  const cur=S.sub.cur;const need=u.practice.count||5;
  if(val==='ok'){
    const inp=S.sub.inp||'';if(inp==='')return;
    if(parseFloat(inp)===cur.answer){
      toast(t('correct'),true);numiHappy();
      S.sub.pIdx++;S.sub.inp='';S.sub.cur=null;
      if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');setTimeout(()=>gotoStep('discover'),700);return;}
      S.sub.cur=genProblem(u.practice,'practice');save();
      setTimeout(()=>runPractice(body,u),650);
    }else{toast(t('tryAgain'),false);S.sub.inp='';$('#pscreen').textContent=' ';}
    return;
  }
  if(val==='del'){S.sub.inp=(S.sub.inp||'').slice(0,-1);}
  else if((S.sub.inp||'').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.'))){S.sub.inp=(S.sub.inp||'')+val;}
  $('#pscreen').textContent=S.sub.inp||' ';
}

/* ---------- STEP2 디스커버 (마법 노트) ---------- */
function stepRange(body,u){
  if(!u.ranges){ pickRange('oneDigit'); return; }
  body.innerHTML=`<div class="nm-skip">
    <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-skip-q">${S.lang==='ko'?'수 범위를 골라요':S.lang==='en'?'Choose number range':'选择数字范围'}</div>
    <div class="nm-range-btns">`+u.ranges.map(r=>`
      <button class="nm-range-card" data-rk="${r.key}">
        <b>${L({ko:r.ko,en:r.en,zh:r.zh})}</b><small>${L(r.desc)}</small></button>`).join('')+`
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
  // 두 자리 범위 토글이 있는 유닛(A-01처럼 u.ranges 있을 때)만 kind:'one'/'two'/'mix'로 걸러냄.
  // 범위 선택 자체가 없는 유닛(A-02~04)은 모든 단계를 그대로 보여줌.
  const two = S.range==='twoDigit';
  const stages = u.ranges ? d.stages.filter(s=> two || s.kind==='one') : d.stages;
  const kid = u.tier==='basic';
  body.innerHTML=`<div class="nm-card${kid?' kid-note':''}">
    ${kid?`<div class="nm-kid-hero">${u.icon||'📓'}</div>`:''}
    <div class="nm-card-h">📓 ${L(d.title)}</div><div id="cstages"></div>
    <div class="nm-rule"><b>${t('ruleLabel')}</b><p>${L(d.rule)}</p></div>
    <button class="nm-btn full" id="toCheck">${t('next')}</button></div>`;
  const host=body.querySelector('#cstages');
  stages.forEach(s=>{
    const wrap=document.createElement('div');wrap.className='nm-cstage';
    wrap.innerHTML=`<span class="nm-ctag ${s.kind||''}">${L(s.tag)}</span>
      <div class="nm-ch">${L(s.head)}</div>
      <div class="nm-cdesc">${L(s.desc)}</div>`;
    host.appendChild(wrap);
    if(s.terms)conceptExpr(wrap, s.terms);
    else if(s.mathSteps)mathStepsExpr(wrap, s.mathSteps, kid);
    const res=document.createElement('div');res.className='nm-cresult';res.textContent=L(s.result);wrap.appendChild(res);
    if(s.book){const bk=document.createElement('div');bk.className='nm-cbook';bk.innerHTML='📖 '+L(s.book);wrap.appendChild(bk);}
  });
  $('#toCheck').onclick=()=>{markStepDone(S.unit,'discover');gotoStep(u.tier==='basic'?'lab':'check');};
}

/* 개념 렌더(계단식): 세로로 이어지는 수식 스텝(mathSteps: tex 문자열 배열), 화살표로 연결 */
function mathStepsExpr(container, steps, kid){
  const box=document.createElement('div');box.className='nm-mstep-box'+(kid?' kid':'');
  steps.forEach((tex,i)=>{
    if(i){const arrow=document.createElement('div');arrow.className='nm-mstep-arrow';arrow.textContent='↓';box.appendChild(arrow);}
    const line=document.createElement('div');line.className='nm-mstep-line'+(kid?' kid':'');
    // 유아 노트: 한글 문장을 KaTeX 수식 폰트로 그리면 어색 → 앱 폰트 텍스트 칩으로 표시
    if(kid)line.textContent=tex; else line.setAttribute('data-tex',tex);
    box.appendChild(line);
  });
  container.appendChild(box);
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
  renderMath(body);
  buildNumpad($('#pad'),val=>{
    if(val==='ok'){const inp=S.sub.inp||'';if(inp==='')return;
      if(parseFloat(inp)===fill.answer){
        toast(t('correct'),true);numiHappy();
        S.sub.fi++;S.sub.inp='';
        if(S.sub.fi>=c.fills.length){markStepDone(S.unit,'check');S.sub={};setTimeout(()=>openQuestion(body,u),700);}
        else setTimeout(()=>stepCheck(body,u),700);
      }
      else{toast(t('tryAgain'),false);$('#fhint').textContent='💡 '+L(fill.hint);S.sub.inp='';$('#pscreen').textContent=' ';}
      return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
    else if((S.sub.inp||'').length<6&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
  },{decimal:!Number.isInteger(fill.answer)});
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

/* ---------- STEP4 매직랩 (대화형) ----------
   pair10(짝 고르기, answerType:'selectPairs')는 타일 선택 UI,
   나머지 생성기(move10/add10sub/stairAdd, answerType:'number')는 숫자패드 UI. */
function stepLab(body,u){
  const cfg=u.lab;
  S.sub.cur=S.sub.cur||genProblem(cfg,'main');
  if(S.sub.cur.answerType==='selectPairs')stepLabPairs(body,u);
  else if(S.sub.cur.widget&&S.sub.cur.widget!=='numpad'&&window.NM_WIDGETS)stepLabWidget(body,u);
  else stepLabNumpad(body,u);
}
/* 매직랩 — 교구/단계 위젯 (계산기 대신 전략의 중간 과정을 직접 입력) */
function stepLabWidget(body,u){
  const cfg=u.lab;const need=cfg.count||4;
  S.sub.li=S.sub.li||0;
  const cur=S.sub.cur;const first=S.sub.li===0&&!S.sub.labStarted;
  const origLbl=S.lang==='zh'?'怎么算？':S.lang==='en'?'How do we solve?':'어떻게 구할까?';
  const origTex=cur.tex?`${esc(cur.tex.split('=')[0].trim())} = \\square`:'';
  /* steps(단계 카드) 위젯은 세로 공간을 많이 쓰므로 모바일 압축용 클래스를 단다 */
  body.innerHTML=`<div class="nm-dialog${cur.widget==='steps'?' steps-mode':''}">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    ${origTex?`<div class="nm-lab-orig"><span class="nm-lab-orig-lbl">${origLbl}</span><span data-tex="${origTex}"></span></div>`:''}
    <div class="nm-bubble">${first?esc(L(cfg.intro)):esc(L(cur.prompt))}</div>
    <div id="labWidget" class="nm-lab-widget"></div>
    <div class="nm-memo-wrap"><label>📝</label><input type="text" class="nm-memo" placeholder="메모…" autocomplete="off" spellcheck="false"></div>
  </div>`;
  S.sub.labStarted=true;
  renderMath(body);
  say(first?L(cfg.intro):L(cur.prompt));
  NM_WIDGETS.render(cur,$('#labWidget'),val=>{
    if(+val===cur.answer){
      toast(pickVoice(u.voice.correct),true);numiHappy();
      S.sub.li++;S.sub.cur=null;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep(afterLabKey(u)),700);return;}
      S.sub.cur=genProblem(u.lab,'main');save();
      setTimeout(()=>stepLab(body,u),650);
    }else{
      toast(pickVoice(u.voice.wrong),false);
    }
  });
}
function stepLabPairs(body,u){
  const cfg=u.lab;const need=cfg.count||4;
  S.sub.li=S.sub.li||0;S.sub.picked=S.sub.picked||[];
  const cur=S.sub.cur;const first=S.sub.li===0&&!S.sub.labStarted;
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble">${first?esc(L(cfg.intro)):esc(L(cur.prompt))}</div>
    <div class="nm-expr" id="expr"></div>
    <button class="nm-btn full" id="pick" disabled>${t('picked')}</button>
    <div class="nm-hint">${t('pairHint')}</div>
  </div>`;
  S.sub.labStarted=true;S.sub.picked=[];
  say(first?L(cfg.intro):L(cur.prompt));
  const expr=$('#expr');
  cur.nums.forEach((n,i)=>{
    if(i)expr.insertAdjacentHTML('beforeend','<span class="nm-plus">+</span>');
    const b=document.createElement('button');b.className='nm-tile';b.textContent=n;b.dataset.i=i;
    b.onclick=()=>pickTile(b,i,n,body,u);expr.appendChild(b);
  });
}
function stepLabNumpad(body,u){
  const cfg=u.lab;const need=cfg.count||4;
  S.sub.li=S.sub.li||0;
  const cur=S.sub.cur;const first=S.sub.li===0&&!S.sub.labStarted;
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble">${first?esc(L(cfg.intro)):esc(L(cur.prompt))}</div>
    <div class="nm-lab-expr"><span data-tex="${esc(cur.tex.split('=')[0].trim())} = \\square"></span></div>
    <div class="nm-numpad-screen" id="pscreen">&nbsp;</div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-memo-wrap"><label>📝</label><input type="text" class="nm-memo" placeholder="메모…" autocomplete="off" spellcheck="false"></div>
    <div class="nm-hint">${t('numpadHint')}</div>
  </div>`;
  S.sub.labStarted=true;
  renderMath(body);
  say(first?L(cfg.intro):L(cur.prompt));
  buildNumpad($('#pad'),val=>handleLabNumpad(val,body,u),{decimal:!Number.isInteger(cur.answer)});
}
function handleLabNumpad(val,body,u){
  const cur=S.sub.cur;const need=u.lab.count||4;
  if(val==='ok'){
    const inp=S.sub.inp||'';if(inp==='')return;
    if(parseFloat(inp)===cur.answer){
      toast(pickVoice(u.voice.correct),true);numiHappy();
      S.sub.li++;S.sub.inp='';S.sub.cur=null;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep(afterLabKey(u)),700);return;}
      S.sub.cur=genProblem(u.lab,'main');save();
      setTimeout(()=>stepLab(body,u),650);
    }else{toast(pickVoice(u.voice.wrong),false);S.sub.inp='';$('#pscreen').textContent=' ';}
    return;
  }
  if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
  else if((S.sub.inp||'').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
  $('#pscreen').textContent=S.sub.inp||' ';
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
      if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep(afterLabKey(u)),800);return;}
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
  const cur=genProblem(u.arena,'main');S.sub.cur=cur;S.sub.inp='';
  body.innerHTML=`<div class="nm-arena">
    <div class="nm-arena-top"><span class="nm-arena-q">${S.sub.ai+1} / ${need}</span><span class="nm-arena-time" id="atime">${fmt(S.sub.left)}</span></div>
    <div class="nm-arena-expr"><span data-tex="${esc(cur.tex.split('=')[0].trim())} = \\square"></span></div>
    <div class="nm-numpad-screen" id="pscreen">&nbsp;</div>
    <div class="nm-numpad" id="pad"></div>
  </div>`;
  renderMath(body);
  buildNumpad($('#pad'),val=>{
    if(val==='ok'){const inp=S.sub.inp||'';if(inp==='')return;
      if(parseFloat(inp)===S.sub.cur.answer){S.sub.score++;numiHappyToast();}else toast('✗',false);
      S.sub.ai++;
      if(S.sub.ai>=need){clearInterval(window._nmTimer);arenaEnd(body,u);return;}
      nextArena(body,u,need);return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
    else if((S.sub.inp||'').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
  },{decimal:!Number.isInteger(cur.answer)});
}
function arenaEnd(body,u){
  const need=u.arena.count||10;const sc=S.sub.score;
  markStepDone(S.unit,'arena');
  body.innerHTML=`<div class="nm-card center">
    <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-card-h">${t('score')}</div>
    <div class="nm-score">${sc} / ${need}</div>
    <button class="nm-btn full" id="toStamp">${t('next')}</button>
  </div>`;
  $('#toStamp').onclick=()=>gotoStep('stamp');
}

/* ---------- STEP6 도장 ---------- */
function stepStamp(body,u){
  /* 도장은 이전 단계(기본연산~아레나)를 실제로 다 마쳐야 받을 수 있음.
     플로우바 탭으로 건너뛰어 곧장 여기로 오면 안 되므로, 안 끝난 단계가
     있으면 그 단계로 돌려보내고 코인은 절대 지급하지 않는다. */
  const requiredKeys=unitFlowOf(u).map(f=>f.key).filter(k=>k!=='stamp');
  const missing=requiredKeys.find(k=>!stepDone(S.unit,k));
  if(missing){gotoStep(missing);return;}
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
function buildNumpad(pad,cb,opts){
  opts=opts||{};
  pad.innerHTML='';
  const keys=opts.decimal
    ?['1','2','3','4','5','6','7','8','9','.','0','del','ok']
    :['1','2','3','4','5','6','7','8','9','del','0','ok'];
  if(opts.decimal) pad.classList.add('dec'); else pad.classList.remove('dec');
  keys.forEach(k=>{
    const b=document.createElement('button');b.className='nm-key'+(k==='ok'?' ok':k==='del'?' del':k==='.'?' dot':'');
    b.textContent=k==='del'?'←':k==='ok'?'✓':k;b.onclick=()=>cb(k);pad.appendChild(b);
  });
}
function dots(n,cur){let h='';for(let i=0;i<n;i++)h+=`<span class="nm-dot ${i<cur?'on':i===cur?'now':''}"></span>`;return h;}
function fmt(s){s=Math.max(0,s);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');}
function numiHappy(){const n=document.querySelector('.nm-numi');if(n){n.classList.remove('happy');void n.offsetWidth;n.classList.add('happy');}}
function numiHappyToast(){toast('✓',true);}

/* ---------- 캐릭터 꾸미기 화면 ---------- */
function screenCloset(){
  const scr=$('#screen');
  const titleTxt=S.lang==='en'?'My Character':S.lang==='zh'?'我的角色':'내 캐릭터';
  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="backCloset">← ${t('back')}</button>
    <div class="nm-unit-title">🪄 ${titleTxt}</div>
  </div>
  <div id="nm-idcard-slot"></div>
  <div id="nm-closet-cnt" class="nm-step-body" style="padding:0"></div>`;
  $('#backCloset').onclick=()=>{S.view='town';save();render();};
  renderIdCard();
  if(window.screenCloset){
    window.screenCloset(document.getElementById('nm-closet-cnt'),{
      char: S.character,
      unlocked: S.character_unlocked,
      coins: S.coins,
      lang: S.lang,
      onSave(newChar, newUnlocked, coinsSpent){
        S.character = newChar;
        S.character_unlocked = newUnlocked;
        if(coinsSpent) S.coins = Math.max(0, S.coins - coinsSpent);
        save();
        // 상단 칩만 업데이트
        const chip=$('#charChipBtn');
        if(chip&&window.renderNumiChar){
          chip.innerHTML=window.renderNumiChar(S.character,30)+`<span class="nm-char-chip-name">#${S.character.number}</span>`;
        }
        const ci=$('.nm-coins b');
        if(ci)ci.textContent=S.coins;
      }
    });
  }
}

/* ---------- 아이디 등록 카드 (옷장 상단) ----------
   온보딩을 이미 지난 기존 사용자도 여기서 이름을 아이디로 등록할 수 있다.
   등록된 뒤에는 상태 표시만 남는다. */
function renderIdCard(){
  const slot=$('#nm-idcard-slot');
  if(!slot)return;
  const ko=S.lang==='ko', en=S.lang==='en';
  if(S.cloudLinked){
    slot.innerHTML=`<div class="nm-idcard linked">☁️ ${ko?'아이디':en?'ID':'账号'}: <b>${esc(S.name)}</b> · ${ko?'자동 저장 중':en?'Auto-saving':'自动保存中'} ✓</div>`;
    return;
  }
  slot.innerHTML=`<div class="nm-idcard">
    <div class="nm-idcard-t">☁️ ${ko?'아이디 등록':en?'Register your ID':'注册账号'}</div>
    <div class="nm-idcard-row">
      <input id="idName" maxlength="8" placeholder="${t('obNamePh')}" value="${esc(S.name||'')}">
      <button class="nm-btn" id="idClaim">${ko?'등록':en?'Register':'注册'}</button>
    </div>
    <div class="nm-idcard-msg" id="idMsg">${ko?'이름이 곧 아이디! 등록하면 다른 기기에서도 이름만 치면 이어서 할 수 있어요.':en?'Your name becomes your ID — continue on any device by typing it.':'名字就是账号！在任何设备上输入名字即可继续。'}</div>
  </div>`;
  $('#idClaim').onclick=claimFromCloset;
  $('#idName').addEventListener('keydown',e=>{if(e.key==='Enter')claimFromCloset();});

  async function claimFromCloset(){
    const inp=$('#idName'), msg=$('#idMsg'), btn=$('#idClaim');
    const name=(inp.value||'').trim();
    if(!name){msg.textContent=t('obNeedName');return;}
    btn.disabled=true;
    msg.textContent=ko?'이름 확인 중…':en?'Checking…':'检查中…';
    let existing=null;
    try{ existing=await cloudGet(name); }
    catch(e){
      btn.disabled=false;
      const detail=/cloudGet (\d+)/.test(e.message)?` (${e.message.replace('cloudGet','HTTP')})`:'';
      msg.textContent=(ko?'연결에 실패했어요. 인터넷을 확인하고 다시 시도해 주세요.':en?'Connection failed — please try again.':'连接失败，请重试。')+detail;
      return;
    }
    if(!existing){
      try{
        const okClaim=await cloudClaim(name,S);
        if(okClaim){
          S.name=name; S.cloudLinked=true; save();
          toast(ko?'아이디 등록 완료! ✨':en?'ID registered! ✨':'注册成功！✨',true);
          render(); S.view='closet';  // 칩 이름 갱신 후 옷장 유지
          return;
        }
        existing=await cloudGet(name).catch(()=>null)||{state:{}};
      }catch(e){ btn.disabled=false; msg.textContent=ko?'등록에 실패했어요. 잠시 후 다시!':en?'Failed — try again soon.':'注册失败，请稍后再试。'; return; }
    }
    /* 이미 있는 이름 → 이어하기 / 다른 이름 */
    btn.disabled=false;
    msg.innerHTML=`${ko?`'${esc(name)}'는 이미 있는 이름이에요. 예전에 내가 만든 거라면 이어서 할 수 있어요.`:en?`'${esc(name)}' is taken. If that was you, continue below.`:`'${esc(name)}'已被使用。如果是你，可以继续。`}
      <div class="nm-idcard-row" style="margin-top:8px">
        <button class="nm-btn" id="idResume">${ko?'이건 나예요! 이어하기 ▶':en?"That's me! Continue ▶":'是我！继续 ▶'}</button>
        <button class="nm-btn ghost" id="idOther">${ko?'다른 이름 쓸게요':en?'Try another':'换个名字'}</button>
      </div>`;
    $('#idResume').onclick=()=>{
      const st=existing&&existing.state?existing.state:{};
      S={...defaults(),...st};
      S.name=name; S.onboarded=true; S.cloudLinked=true;
      if(!S.character)S.character={number:3,color:'blue',bg:'plain',cape:'none'};
      S.view='closet';
      save(); render();
      toast(t('obWelcome')(name),true);
    };
    $('#idOther').onclick=()=>{ inp.value=''; inp.focus(); renderIdCard(); };
  }
}

/* ---------- 시험 / 학습지 화면 ---------- */
function screenExam(){
  const scr=$('#screen');
  if(!window.NM_EXAM||!window.examScreen){
    scr.innerHTML=`<div class="nm-unit-bar"><button class="nm-back" id="backExam">${t('back')}</button></div>
      <p style="padding:40px;text-align:center">시험 모듈 로딩 실패</p>`;
    $('#backExam').onclick=()=>{S.view='town';save();render();};
    return;
  }
  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="backExam">${t('back')}</button>
    <div class="nm-unit-title">📝 ${S.lang==='ko'?'학습지 & 시험':S.lang==='en'?'Worksheet & Exam':'学习单 & 考试'}</div>
  </div><div id="nm-exam-cnt" class="nm-step-body"></div>`;
  $('#backExam').onclick=()=>{S.view='town';save();render();};
  window.examScreen(document.getElementById('nm-exam-cnt'));
}

/* ---------- 시작 ---------- */
function boot(){
  if(!GEN||!CUR||!UNITS){app.innerHTML='<p style="padding:40px;text-align:center">데이터 로딩 실패 — 스크립트 순서를 확인하세요.</p>';return;}
  render();
}
if(window.katex)boot(); else{const t2=setInterval(()=>{if(window.katex){clearInterval(t2);boot();}},60);setTimeout(()=>{if(!window.katex)boot();},1500);}
})();
