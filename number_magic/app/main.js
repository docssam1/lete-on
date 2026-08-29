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
    obWelcome:n=>`환영해요, ${n}!`, titleCourse:'과정' },
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
    obWelcome:n=>`Welcome, ${n}!`, titleCourse:'Course' },
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
    obWelcome:n=>`欢迎，${n}！`, titleCourse:'课程' }
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
  character_unlocked:{}, mailbox:{opened:{}},
  boost:{doneWeeks:{},log:[]}, /* 정체 감지→보강 루프(§2-4) 기록 — 부모 리포트용 */
  roadCadence:'w1', /* 연산 로드맵 주차 보기: 'w1'=주 1회반, 'w2'=주 2회반 */
  lineageBadges:{}, /* 계보 완주 배지(§6 규칙4) — {lineageKey:{earnedAt}} */
  symbolDex:{} /* 기호 도감 수집(§13) — {sym:{unitId,earnedAt}} */ };}
function load(){try{const r=JSON.parse(localStorage.getItem(KEY));return r?{...defaults(),...r}:defaults();}catch(e){return defaults();}}
const hadSave=!!localStorage.getItem(KEY); // 온보딩은 "완전 신규 설치"에서만 요구
let S=load();
if(S.view==='map')S.view='town'; // 구버전 상태 마이그레이션
// 기존 저장본에 character 필드 없으면 기본값 채움
if(!S.character)S.character={number:3,color:'blue',bg:'plain',cape:'none'};
if(!S.character_unlocked)S.character_unlocked={};
if(!S.mailbox||!S.mailbox.opened)S.mailbox={opened:(S.mailbox&&S.mailbox.opened)||{}};
if(!S.boost)S.boost={doneWeeks:{},log:[]};
if(!S.boost.doneWeeks)S.boost.doneWeeks={};
if(!S.boost.log)S.boost.log=[];
if(S.roadCadence!=='w1'&&S.roadCadence!=='w2')S.roadCadence='w1';
if(typeof S.onboarded!=='boolean')S.onboarded=hadSave; // 이미 쓰던 사용자는 온보딩 화면 스킵
if(S.name===undefined)S.name='';
/* account(체험 게이트, Phase 2B)도 onboarded와 같은 이유로 defaults()에 넣지 않는다 —
   hadSave(저장본이 이미 있었는지)로만 "신규 설치 vs 기존 프로필"을 구분해야
   병합 후에도 미설정 여부를 알 수 있다. 기존 프로필(이미 쓰던 사용자)은 승인번호 없이도
   자동 active(grandfather) — 재원생이 게이트 도입으로 잠기면 안 된다는 원장 지시. */
/* 2026-08-29 원장 지시 "우선 승인 없이 다 되도록 열고" — 신규 프로필도 active로
   시작한다. 게이트 코드(TRIAL_UNITS·unitLocked·안내 모달·승인번호 입력)는 그대로
   살려 두었으므로, 학원이 승인번호를 실제로 발급하기 시작하면 아래 'active'를
   'trial'로 되돌리는 한 줄이면 다시 켜진다. HANDOFF §체험 게이트의 단계 설명
   ("지금(승인 없음) → 승인번호 도입 시 체험 모드 활성화")과 같은 상태다. */
if(!S.account)S.account={status:'active',code:null,checkedAt:0};
/* 소급 마이그레이션: 과거 완료(done) 유닛에 steps.stamp가 빠져 로드맵 별이 안 켜지던 버그 —
   기존 프로필의 완료 기록에 stamp 단계를 채워 넣는다(1회성, 멱등) */
(function(){let mig=false;Object.keys(S.progress||{}).forEach(uid=>{const p=S.progress[uid];if(p&&p.done){p.steps=p.steps||{};if(!p.steps.stamp){p.steps.stamp=true;mig=true;}}});if(mig)try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}})();
if(!S.firstWeek)S.firstWeek=weekKeyFor(new Date()); // 편지함 첫 방문 주 — 이전 주 봉투는 안 보여줌(§10)
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}cloudPushSoon();}
function unitDone(id){return !!(S.progress[id]&&S.progress[id].done);}

/* ---------- 체험 게이트 (Phase 2B) ----------
   승인번호 없이는 각 티어의 대표 유닛만 플레이 가능. 대표 유닛 선정은
   과정-로드맵.md §10 "체험 유닛 선정" 그대로: 유아 N-01·N-09, 초급 A-01, 창의 C-06.
   난이도 잠금(자유 선택 원칙)과는 무관한 별개의 축 — active면 이 체크는 전부 통과. */
const TRIAL_UNITS=['N-01','N-09','A-01','C-06'];
function isTrialUnit(uid){return TRIAL_UNITS.indexOf(uid)>=0;}
function accountActive(){return !!(S.account&&S.account.status==='active');}
function unitLocked(uid){return !accountActive()&&!isTrialUnit(uid);}

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
/* ---------- 승인번호 (nm_codes, Phase 2B) ----------
   RLS가 이미 "active=true 행만 select 가능"으로 걸려 있으므로, code로만 조회해서
   행이 오면 유효(=active)한 것이고 안 오면 오타든 비활성이든 똑같이 "없음"이다 —
   회수(재검증)도 같은 함수 재사용: 비활성화된 코드는 RLS가 그 순간부터 숨겨준다. */
async function nmCheckCode(code){
  const url=`${SB_URL}/rest/v1/nm_codes?code=eq.${encodeURIComponent(code)}&select=code`;
  const r=await fetch(url,{headers:sbHdr()});
  if(!r.ok)throw new Error('nmCheckCode '+r.status);
  const rows=await r.json();
  return rows.length>0;
}
/* 코드 제출(잠금 모달·설정 화면 공용). 성공 시 S.account를 active로 갱신하고 저장까지 한다. */
async function applyAccountCode(code){
  code=(code||'').trim();
  if(!code)return{ok:false,reason:'empty'};
  try{
    const valid=await nmCheckCode(code);
    if(valid){
      S.account={status:'active',code,checkedAt:Date.now()};
      save();
      return{ok:true};
    }
    return{ok:false,reason:'invalid'};
  }catch(e){
    return{ok:false,reason:'network'};
  }
}
/* 회수 동기화: active+code인 프로필만, 하루 1회 재검증. 코드 없는 grandfather는 대상 아님.
   네트워크 실패면 상태를 그대로 두고 조용히 넘어간다(오프라인에서 잠그지 않는다). */
async function reverifyAccountIfNeeded(){
  const acc=S.account;
  if(!acc||acc.status!=='active'||!acc.code)return;
  const DAY=86400000;
  if(acc.checkedAt&&(Date.now()-acc.checkedAt)<DAY)return;
  try{
    const valid=await nmCheckCode(acc.code);
    if(valid){
      S.account.checkedAt=Date.now();save();
    }else{
      S.account={status:'trial',code:null,checkedAt:Date.now()};
      save();
      toast(S.lang==='ko'?'학원 승인이 해제되어 체험 모드로 돌아갔어요.':S.lang==='en'?'Academy approval was removed — back to trial mode.':'学院授权已取消，已恢复体验模式。',false);
      render();
    }
  }catch(e){ /* 오프라인 — 다음에 다시 시도 */ }
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
function markStepDone(unit,step){S.progress[unit]=S.progress[unit]||{steps:{}};S.progress[unit].steps[step]=true;S.progress[unit].touchedAt=Date.now();save();}
function stepDone(unit,step){return !!(S.progress[unit]&&S.progress[unit].steps&&S.progress[unit].steps[step]);}

/* ---------- 계보(lineage) 헬퍼 (과정-로드맵.md §6, data/lineages.js) ----------
   unit.lineage(배지 표시용, 여러 세션에 걸쳐 붙은 태그 포함)와 NM_LINEAGES.chain
   (진화 링크/완주 판정용, §6 서술 순서만 담은 정본)은 분리돼 있다 — 카드 배지는
   unit.lineage만 봐서 항상 뜨지만, "다음 진화"·완주 배지는 chain에 실제로 그
   유닛이 들어있을 때만 계산한다(§6에 없는 확장을 자의적으로 chain에 넣지 않았기
   때문에 unit.lineage 쪽이 더 넓을 수 있다 — 예: H-11·H-13·C-12). */
function lineagesMap(){return window.NM_LINEAGES||{};}
function unitLineageInfo(uid){
  const u=UNITS[uid];if(!u||!u.lineage)return null;
  for(const key of u.lineage){
    const line=lineagesMap()[key];
    if(line&&line.chain&&line.chain.indexOf(uid)>=0)return{key,line};
  }
  return null;
}
function lineageNextStep(uid){
  const info=unitLineageInfo(uid);if(!info)return null;
  const idx=info.line.chain.indexOf(uid);
  const isLast=idx===info.line.chain.length-1;
  return{key:info.key,line:info.line,idx,isLast,nextId:isLast?null:info.line.chain[idx+1]};
}
/* unitDone(=S.progress[uid].done)을 쓴다 — stepDone(uid,'stamp')이 아니다.
   기존 코드 전체(screenRoadmap 등)가 'stamp' 스텝 완료 판정에 stepDone(uid,'stamp')을
   쓰지만, stepStamp()는 어디서도 markStepDone(uid,'stamp')를 호출하지 않아
   steps.stamp가 영영 true가 안 된다(전수 검색으로 확인한 기존 버그 — 이 작업
   범위 밖이라 손대지 않고 보고만 함). 계보 완주 판정이 그 버그를 그대로 물려받으면
   항상 미완주로 나오므로, 실제로 채워지는 .done 플래그(unitDone)로 판정한다. */
function lineageChainDone(key){
  const line=lineagesMap()[key];
  return!!(line&&line.chain&&line.chain.length&&line.chain.every(uid=>unitDone(uid)));
}
/* 계보 완주 배지 판정 — 유닛 도장(완료) 시점에만 호출한다(결정적: 저장된
   진행상황만 보는 순수 함수라 렌더마다 다시 불러도 같은 유닛에서는 같은 답).
   새로 완주한 계보가 있으면 그 key를 배지로 적립하고 반환(오버레이 트리거용). */
function checkLineageCompletion(){
  const map=lineagesMap();
  for(const key of Object.keys(map)){
    if(S.lineageBadges[key])continue;
    if(lineageChainDone(key)){S.lineageBadges[key]={earnedAt:Date.now()};save();return key;}
  }
  return null;
}
/* 한국어 "(으)로" 어미 선택 — 받침 없음 또는 종성이 ㄹ이면 '로', 그 외엔 '으로'. */
function koEuro(word){
  if(!word)return'로';
  const ch=word[word.length-1];const code=ch.charCodeAt(0)-0xAC00;
  if(code<0||code>11171)return'로';
  const jong=code%28;
  return(jong===0||jong===8)?'로':'으로';
}
/* 스토리 모드·학년별 교실 유닛 카드용 작은 문장(紋章) 배지(§6 규칙2). */
function lineageBadgeSpan(uid){
  const u=UNITS[uid];if(!u||!u.lineage||!u.lineage.length)return'';
  const line=lineagesMap()[u.lineage[0]];if(!line)return'';
  return`<span class="nm-lin-chip" title="${esc(L(line.name))}">${line.emblem}</span>`;
}
/* 도장 화면 "🧬 다음 진화" 카드(§6 규칙2) — 계보 chain에 없는 유닛이면 빈 문자열. */
function lineageEvoCardHtml(uid){
  const step=lineageNextStep(uid);if(!step)return'';
  const ko=S.lang==='ko',en=S.lang==='en';
  const line=step.line;
  if(step.isLast){
    return`<button class="nm-evo-card final" data-lin="${step.key}">
      <div class="nm-evo-ico">${line.emblem}</div>
      <div class="nm-evo-txt"><b>🧬 ${ko?'이 계보의 최종 진화예요!':en?'The final evolution of this lineage!':'这是这条家族的最终进化！'}</b>
      <small>${esc(L(line.name))}</small></div>
    </button>`;
  }
  const nu=UNITS[step.nextId];if(!nu)return'';
  const nuTitle=esc(L(nu.title));
  const label=ko?`이 마법은 나중에 <b>${nuTitle}</b>${koEuro(L(nu.title))} 자라요`
    :en?`This magic later grows into <b>${nuTitle}</b>`
    :`这个魔法以后会成长为<b>${nuTitle}</b>`;
  return`<button class="nm-evo-card" data-lin="${step.key}" data-next="${step.nextId}">
    <div class="nm-evo-ico">${nu.icon||line.emblem}</div>
    <div class="nm-evo-txt"><b>🧬 ${label}</b>
    <small>${esc(L(line.name))}</small></div>
  </button>`;
}
function bindLineageEvoCard(root){
  const el=root.querySelector('.nm-evo-card[data-next]');
  if(el)el.onclick=()=>{const uid=el.dataset.next;if(unitLocked(uid)){showGateModal();return;}S.unit=uid;S.step=null;S.sub={};S.view='unit';save();render();};
}
/* 계보 완주 축하 오버레이(기존 confetti 재사용) — 타이틀 화면 배지 줄과 짝. */
function lineageBadgeOverlayHtml(key){
  const line=lineagesMap()[key];if(!line)return'';
  const ko=S.lang==='ko',en=S.lang==='en';
  return`<div class="nm-gate-overlay nm-lin-overlay" id="nmLinOverlay">
    <div class="nm-gate-card nm-lin-card">
      <div class="nm-lin-emblem-big">${line.emblem}</div>
      <h3>${ko?'계보 완주! 🎉':en?'Lineage Complete! 🎉':'家族完成！🎉'}</h3>
      <div class="nm-lin-name">${esc(L(line.name))}</div>
      <p>${esc(L(line.tagline))}</p>
      <button class="nm-btn full" id="nmLinOverlayClose">${ko?'좋아요!':en?'Nice!':'太棒了！'}</button>
    </div>
  </div>`;
}
function showLineageBadgeOverlay(key){
  if($('#nmLinOverlay'))return;
  document.body.insertAdjacentHTML('beforeend',lineageBadgeOverlayHtml(key));
  confetti();playSfx('great-job');
  const close=()=>{const m=$('#nmLinOverlay');if(m)m.remove();};
  $('#nmLinOverlayClose').onclick=close;
  $('#nmLinOverlay').addEventListener('click',e=>{if(e.target.id==='nmLinOverlay')close();});
}

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
/* 성공 효과음 — 지오메트리 큐비와 같은 자체 제작 클립(assets/audio/success/). 실패해도 조용히 무시 */
const _sfxCache={};
function playSfx(kind){
  try{
    const lang=(S.lang==='en'||S.lang==='zh')?S.lang:'ko';
    const url='assets/audio/success/'+lang+'/'+kind+'.mp3';
    let a=_sfxCache[url];
    if(!a){a=new Audio(url);_sfxCache[url]=a;}
    a.currentTime=0;a.volume=.85;
    a.play().catch(()=>{});
  }catch(e){}
}
window.NM_SFX=playSfx;
window.NM_SAY=say;   // widgets.js(storyCard 🔊 다시듣기 버튼)에서 재낭독용으로 사용
window.NM_L=L;        // widgets.js에서 다국어 필드(problem.prompt 등) 읽기용
function toast(msg,ok){const el=document.createElement('div');el.className='nm-toast '+(ok?'ok':'no');el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),1100);}
function confetti(){const cols=['#16417C','#EAC996','#C9A063','#2E9E6B','#3768ad'];for(let i=0;i<64;i++){const el=document.createElement('div');el.className='nm-confetti';el.style.left=Math.random()*100+'vw';el.style.background=cols[i%cols.length];document.body.appendChild(el);el.animate([{transform:'translateY(-20px) rotate(0)',opacity:1},{transform:`translateY(${innerHeight+40}px) rotate(${Math.random()*720}deg)`,opacity:.9}],{duration:1600+Math.random()*1200,easing:'cubic-bezier(.3,.6,.4,1)'}).onfinish=()=>el.remove();}}
function coinAdd(n){S.coins+=n;save();}
function pickVoice(arr){return L(arr[Math.floor(Math.random()*arr.length)]);}
/* 유아(tier basic)는 글을 못 읽으니 정답/오답 코멘트도 음성으로 — MP3(tts-map) 있으면 실음성 */
function voiceLine(u,arr,ok){const line=pickVoice(arr);toast(line,ok);if(u&&u.tier==='basic')say(line);return line;}

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
  if(wsHelperId){
    app.innerHTML='<div id="screen"></div>';
    screenWorksheetHelper(wsHelperId);
    return;
  }
  if(!S.onboarded){
    app.innerHTML='<div id="screen"></div>';
    screenWelcome();
    return;
  }
  if(S.view==='title'){
    app.innerHTML='<div id="screen"></div>';
    screenTitle();
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
  else if(S.view==='courseroad')screenCourseRoad();
  else if(S.view==='placement')screenPlacement();
  else if(S.view==='minigame')screenMiniGame(S.miniGameId||'make10');
  else if(S.view==='gradecourse')screenGradeCourse();
  else if(S.view==='mailbox')screenMailbox();
  else if(S.view==='boost')screenBoost();
  else if(S.view==='tier')screenTier();
  else if(S.view==='unit')screenUnit();
  else if(S.view==='exam')screenExam();
  else if(S.view==='closet')screenCloset();
  else if(S.view==='symboldex')screenSymbolDex();
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
    <div class="nm-town-hud info">
      <a class="nm-philobtn" href="about.html">✦ ${S.lang==='ko'?'철학':S.lang==='en'?'Philosophy':'理念'}</a>
      <button class="nm-iconbtn nm-roadbtn" id="townCourseRoad" title="${S.lang==='ko'?'연산 로드맵':S.lang==='en'?'Course Road':'运算路线图'}">🛤️</button>
      <button class="nm-iconbtn nm-dexbtn" id="townDex" title="${S.lang==='ko'?'기호 도감':S.lang==='en'?'Symbol Dex':'符号图鉴'}">📖</button>
      <button class="nm-iconbtn nm-mailbtn" id="townMail" title="${S.lang==='ko'?'편지함':S.lang==='en'?'Mailbox':'信箱'}">📬${mailboxUnreadCount()>0?`<span class="nm-mb-dot">${mailboxUnreadCount()}</span>`:''}</button>
    </div>
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
  const mb=$('#townMail');if(mb)mb.onclick=()=>{S._mbWeek=null;S.view='mailbox';save();render();};
  const cr=$('#townCourseRoad');if(cr)cr.onclick=()=>{S._roadFocus=null;S.view='courseroad';save();render();};
  const db=$('#townDex');if(db)db.onclick=()=>{S._dexFrom='town';S.view='symboldex';save();render();};
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
    /* 외부 링크 노드(🔬 개념 실험실 등 — MASTER-ROADMAP.md §2) — 새 탭에서 연다.
       기존 게임스톤과 같은 카드를 재사용하는 최소 침습 확장(2026-08-25). */
    if(ch.link){
      html+=`<div class="nm-road-gamestone nm-road-linkstone" data-link="${esc(ch.link)}">
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
      const locked=unitLocked(uid);
      const cls='nm-road-stone'+(done?' done':isNext?' next':'')+(locked?' trial-locked':'');
      html+=`<div class="${cls}" data-uid="${uid}" style="margin-left:${(ui%2)*32}px">
        ${done?'⭐':locked?'🔒':''}
        <div class="nm-road-stone-title">${L(u.title)}${lineageBadgeSpan(uid)}</div>
        ${isNext&&!locked?`<div class="nm-road-next-lbl">${S.lang==='ko'?'여기부터!':S.lang==='en'?"Start here!":"从这里！"}</div>`:''}
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
  /* 외부 링크 스톤 클릭 — 새 탭에서 연다(2026-08-25, 미적분 실험실 이식) */
  scr.querySelectorAll('.nm-road-linkstone[data-link]').forEach(el=>{
    el.onclick=()=>{ window.open(el.dataset.link,'_blank','noopener'); };
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
  if(unitLocked(uid)){showGateModal();return;}
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
    {key:'중1',label:{ko:'중1',en:'Grade 7',zh:'初一'}},
    {key:'중2',label:{ko:'중2',en:'Grade 8',zh:'初二'}},
    {key:'중3',label:{ko:'중3',en:'Grade 9',zh:'初三'}},
    /* 2022 개정 과목명 준수 — "고1"·"고2" 표기 없음(작업지시) */
    {key:'공통수학1',label:{ko:'공통수학1',en:'Math 1',zh:'数学1'}},
    {key:'공통수학2',label:{ko:'공통수학2',en:'Math 2',zh:'数学2'}},
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
        const locked=unitLocked(uid);
        bodyHtml+=`<div class="nm-gc-unit-row${locked?' trial-locked':''}" data-uid="${uid}">
          <div class="nm-gc-unit-dot${done?' done':isNext?' next':''}"></div>
          <div class="nm-gc-unit-name${done?' done':''}">${L(u.title)}${lineageBadgeSpan(uid)}</div>
          ${locked?'<span style="font-size:11px">🔒</span>':done?'<span style="font-size:11px">⭐</span>':isNext?`<span class="nm-gc-badge">${lk('다음','Next','下一个')}</span>`:''}
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

/* ============================================================
   편지함(📬) — 과정-로드맵.md §10·§11·§12
   매주 월요일(ISO 주차) 기준, 학생의 현재 과정 위치에서 "마법 1 + 드릴
   2~3종"을 뽑아 그 주의 학습지 봉투를 만든다. 서버 없이 클라이언트에서
   주차를 계산하고, 문항은 (주차+과정)으로 고정한 시드로 매번 같은 걸
   재생성하므로(§10 "가족 모두 같은 주엔 같은 문제지") 저장이 필요 없다 —
   저장하는 건 "열람 여부"뿐(S.mailbox.opened[weekKey]).
   드릴 각 항목은 기존 학습지 코드 규약(#THREAD-Lx-COUNTxSEED, exam.js
   parseWorksheetCode)을 그대로 따르는 시드를 쓰므로, 인쇄물의 QR/ID는
   이미 있는 ?ws= 도우미 화면에서 그대로 열린다 — 새 규약을 만들지 않았다.
   ============================================================ */

/* ISO-8601 주차: 월요일 시작, 그 주의 목요일이 속한 연도가 기준 연도.
   표준 알고리즘(문서 없이도 재현 가능하도록 직접 구현) — 서버 호출 없음. */
function isoWeekInfo(date){
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // 그 주의 목요일
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((d - firstThursday) / (7*86400000));
  return { year: d.getUTCFullYear(), week };
}
function weekKeyFor(date){
  const wi = isoWeekInfo(date);
  return `${wi.year}-W${String(wi.week).padStart(2,'0')}`;
}
/* 최근 n개 ISO 주차 키(이번 주가 0번째, 과거로 갈수록 뒤) */
function recentWeekKeys(n){
  const out = [];
  const now = new Date();
  for(let i=0;i<n;i++){
    const d = new Date(now.getTime() - i*7*86400000);
    out.push(weekKeyFor(d));
  }
  return out;
}

/* 유닛id → 그 유닛을 마법 슬롯으로 쓰는 과정 키('C4' 등). 없으면 null. */
function courseForUnit(unitId){
  const C = window.NM_COURSES || {};
  for(const cid in C){
    const sessions = C[cid].sessions || [];
    for(const s of sessions){
      if(s.magic && s.magic.indexOf(unitId) >= 0) return cid;
    }
  }
  return null;
}
/* 가장 최근에 손댄 유닛(progress.touchedAt 최대). 없으면 null. */
function mostRecentTouchedUnit(){
  let best=null, bestT=-1;
  Object.keys(S.progress||{}).forEach(uid=>{
    const p = S.progress[uid];
    const ts = (p && p.touchedAt) || 0;
    if(ts > bestT){ bestT = ts; best = uid; }
  });
  return best;
}
/* 가장 최근에 완료(도장)된 유닛 — 타이틀 화면 "최근 배지" 표시용. 없으면 null. */
function mostRecentBadge(){
  let best=null, bestT=-1;
  Object.keys(S.progress||{}).forEach(uid=>{
    const p=S.progress[uid];
    if(p && p.done && (p.touchedAt||0) > bestT){ bestT=p.touchedAt||0; best=uid; }
  });
  if(!best) return null;
  const u=UNITS[best];
  return (u && u.stamp) ? { uid:best, label:L(u.stamp.label) } : null;
}
/* 타이틀 화면 "이어서 모험" 요약 한 줄 — "과정 N · 유닛제목" 형태(§14).
   과정에 안 속한 유닛(예: 유아 레거시 유닛)은 유닛 제목만. */
function progressSummaryLine(){
  const uid = mostRecentTouchedUnit();
  if(!uid) return '';
  const u = UNITS[uid];
  const uTitle = u ? L(u.title) : uid;
  const cid = courseForUnit(uid);
  if(!cid) return uTitle;
  const num = String(cid).replace(/^C/,'');
  return `${t('titleCourse')} ${num} · ${uTitle}`;
}
/* "이어서 모험" 진입 — enterRoadUnit과 같은 체험 게이트 확인을 거친다.
   fromCourseRoad를 주면 유닛을 나갈 때 연산 로드맵으로 돌아온다(exitUnit 참고) —
   진입 경로를 새로 만들지 않고 이 함수 하나만 재사용하기 위한 인자다. */
function enterContinueUnit(uid, fromCourseRoad){
  if(!uid){ S.view='town'; save(); render(); return; }
  if(unitLocked(uid)){ showGateModal(); return; }
  S.unit=uid; S.step=null; S.sub={}; S.tierId=null; S.view='unit'; S._fromRoadmap=false;
  S._fromCourseRoad=!!fromCourseRoad;
  save(); render();
}
/* ============================================================
   연산 로드맵 (S.view==='courseroad')
   ------------------------------------------------------------
   과정 1번부터 마지막 과정까지를 한 줄기 길로 보여 준다. 스토리 로드맵
   (S.view==='roadmap', data/roadmap.js)과는 다른 화면이다 — 저쪽은 이야기
   챕터의 길이고, 이쪽은 연산 진도의 길이다. 둘 다 그대로 둔다.

   화면에 쓰는 숫자는 전부 data/courses.js에서 그때그때 계산한다(하드코딩 없음).
   - 세션 수      = NM_COURSES['C\'+n].sessions.length
   - 주 1회 주차  = 세션 수
   - 주 2회 주차  = 올림(세션 수 × 2 ÷ 3)

   ★ 주 2회는 두 배가 아니다. 주차가 3분의 2로 줄 뿐이고, 그 기간에 두 배로
     만나므로 핵심 세션을 빼고 남는 회차가 생긴다. 그 남는 회차를 창의수연
     개념 보강과 다지기에 쓴다 — "더 빨리"가 아니라 "더 확실히"가 요점이다.
     화면 어디에도 "두 배"라고 쓰지 않는다.
   ============================================================ */

/* 등급(티어) 표시 정보 — 이름·학년대는 사람이 읽는 말로만 쓴다. */
const ROAD_TIERS=[
 {key:'level1',accent:'var(--gold-deep)',
  name:{ko:'계산의 새싹',en:'Sprouts of Calculation',zh:'计算的新芽'},
  band:{ko:'6~7세 · 초등 1학년',en:'Ages 6–7 · Grade 1',zh:'6~7岁 · 小学一年级'}},
 {key:'level2',accent:'var(--blue)',
  name:{ko:'계산의 도약',en:'Leap in Calculation',zh:'计算的飞跃'},
  band:{ko:'초등 1학년 말 ~ 2학년',en:'Late Grade 1 – Grade 2',zh:'小学一年级下 ~ 二年级'}},
 {key:'level3',accent:'var(--blue-deep)',
  name:{ko:'계산의 정복',en:'Mastery of Calculation',zh:'计算的征服'},
  band:{ko:'초등 2학년 말 ~ 3학년',en:'Late Grade 2 – Grade 3',zh:'小学二年级下 ~ 三年级'}},
 {key:'challenge',accent:'var(--purple)',
  name:{ko:'경시의 탑',en:'Tower of Challenge',zh:'竞赛之塔'},
  band:{ko:'초등 심화 · 중등 준비',en:'Elementary Advanced · Pre-Middle',zh:'小学进阶 · 初中准备'}},
 {key:'middle1',accent:'var(--blue)',
  name:{ko:'중학교 1학년',en:'Grade 7',zh:'初一'},
  band:{ko:'정수와 유리수 · 문자와 식',en:'Integers, Rationals & Letters',zh:'整数与有理数 · 字母与式'}},
 {key:'middle2',accent:'var(--blue)',
  name:{ko:'중학교 2학년',en:'Grade 8',zh:'初二'},
  band:{ko:'식의 계산',en:'Calculating with Expressions',zh:'式的计算'}},
 {key:'middle3',accent:'var(--blue)',
  name:{ko:'중학교 3학년',en:'Grade 9',zh:'初三'},
  band:{ko:'제곱근 · 곱셈공식과 인수분해',en:'Square Roots & Factoring',zh:'平方根 · 乘法公式与因式分解'}},
 {key:'highmath1',accent:'var(--purple)',
  name:{ko:'공통수학1',en:'Math 1',zh:'数学1'},
  band:{ko:'다항식 · 이차방정식',en:'Polynomials & Quadratics',zh:'多项式 · 二次方程'}},
 {key:'highmath2',accent:'var(--purple)',
  name:{ko:'공통수학2',en:'Math 2',zh:'数学2'},
  band:{ko:'점과 직선 · 원',en:'Points, Lines & Circles',zh:'点与直线 · 圆'}},
 {key:'algebra',accent:'var(--purple)',
  name:{ko:'대수',en:'Algebra',zh:'代数'},
  band:{ko:'지수·로그 · 삼각함수 · 수열',en:'Exponents, Logs, Trigonometry & Sequences',zh:'指数对数 · 三角函数 · 数列'}},
 {key:'calculus1',accent:'var(--purple)',
  name:{ko:'미적분Ⅰ',en:'Calculus I',zh:'微积分Ⅰ'},
  band:{ko:'극한 · 미분 · 적분',en:'Limits, Derivatives & Integrals',zh:'极限 · 导数 · 积分'}}
];
function roadTierInfo(key){
  return ROAD_TIERS.find(x=>x.key===key)
    || {key, accent:'var(--blue)', name:{ko:key,en:key,zh:key}, band:{ko:'',en:'',zh:''}};
}

/* 수학 실험실 — labs/ 폴더의 다섯 쪽을 한 자리에 모은다. 설명은 각 실험실이
   실제로 하게 하는 활동을 읽고 쓴 것이다(추측 아님). 새 탭에서 연다. */
const ROAD_LABS=[
 {file:'labs/rainbow-sum.html', icon:'🌈',
  name:{ko:'무지개 덧셈법',en:'The Rainbow Sum',zh:'彩虹加法法'},
  desc:{ko:'1부터 100까지 더하기를 무지개처럼 짝지어 순식간에 끝내 봐요.',
        en:'Pair the numbers like a rainbow and finish 1+2+…+100 in seconds.',
        zh:'像彩虹一样把数配成对，几秒钟算完1加到100。'}},
 {file:'labs/square-friends.html', icon:'🟦',
  name:{ko:'사각수 친구들',en:'Square Number Friends',zh:'平方数朋友'},
  desc:{ko:'홀수를 ㄱ자로 한 겹씩 두르면 정사각형이 자라는 걸 직접 만들어 봐요.',
        en:'Wrap odd numbers in L-shapes and watch a square grow, one layer at a time.',
        zh:'把奇数一层层围成直角，亲手看正方形长大。'}},
 {file:'labs/secret-1001.html', icon:'🔢',
  name:{ko:'1001의 비밀',en:'The Secret of 1001',zh:'1001的秘密'},
  desc:{ko:'세 자리 수를 두 번 이어 쓰면 왜 7·11·13으로 나누어떨어지는지 확인해요.',
        en:'Write a 3-digit number twice and see why 7, 11 and 13 always divide it.',
        zh:'把三位数连写两遍，看看为什么7、11、13都能整除它。'}},
 {file:'labs/number-line-hole.html', icon:'🕳️',
  name:{ko:'수직선의 구멍',en:'The Hole in the Number Line',zh:'数轴上的缺口'},
  desc:{ko:'분수를 아무리 촘촘히 찍어도 남는 자리를 10배씩 확대해 찾아봐요.',
        en:'Zoom in 10× at a time to find the spot no fraction ever lands on.',
        zh:'每次放大10倍，找出分数永远填不满的那个位置。'}},
 {file:'labs/why-calculus.html', icon:'🍎',
  name:{ko:'미적분은 왜 태어났나',en:'Why Calculus Was Born',zh:'微积分为何诞生'},
  desc:{ko:'변하는 것을 계산하려고 400년 전에 미적분이 생긴 이야기와 오늘의 쓰임을 봐요.',
        en:'How calculus was invented 400 years ago to measure change — and where it lives today.',
        zh:'400年前为了计算变化而诞生的微积分，以及它今天用在哪里。'}}
];

/* 과정 목록(번호순) — courses.js의 키에서 그대로 만든다. */
function roadCourseList(){
  const C=window.NM_COURSES||{};
  return Object.keys(C)
    .map(k=>({key:k, num:parseInt(String(k).replace(/^C/,''),10), c:C[k]}))
    .filter(x=>!isNaN(x.num))
    .sort((a,b)=>a.num-b.num);
}
/* 한 과정의 마법 슬롯 id 전체(중복 제거) / 그중 실제 플레이 가능한 유닛만 */
function courseMagicIds(c){
  const out=[];
  (c.sessions||[]).forEach(s=>{ (s.magic||[]).forEach(id=>{ if(out.indexOf(id)<0) out.push(id); }); });
  return out;
}
function courseUnitIds(c){ return courseMagicIds(c).filter(id=>UNITS[id]); }
/* 콘텐츠가 실제로 준비돼 있는가 — 마법 슬롯은 유닛이거나 스레드(courses.js가
   허용한 형태, 예: ML10)여야 하고, 드릴은 그 레벨이 threads.js에 실존해야 한다.
   "준비 중"을 미리 박아 두지 않고 매번 데이터에서 확인한다. */
function courseBuilt(c){
  const TH=window.NM_THREADS||{};
  const ids=courseMagicIds(c);
  for(let i=0;i<ids.length;i++){ if(!UNITS[ids[i]]&&!TH[ids[i]]) return false; }
  const ss=c.sessions||[];
  for(let i=0;i<ss.length;i++){
    const ds=ss[i].drills||[];
    for(let j=0;j<ds.length;j++){
      const th=TH[ds[j].t];
      if(!th) return false;
      if(!(th.levels||[]).some(l=>l.id===ds[j].lv)) return false;
    }
    const ps=ss[i].pool||[];
    for(let j=0;j<ps.length;j++){ if(!TH[ps[j].t]) return false; }
  }
  return true;
}
function courseProgress(c){
  const ids=courseUnitIds(c);
  return { done: ids.filter(u=>stepDone(u,'stamp')).length, total: ids.length };
}
/* 주차 — 주 1회는 세션 수 그대로, 주 2회는 그 3분의 2(올림) */
function courseWeeks(nSessions, cadence){
  return cadence==='w2' ? Math.ceil(nSessions*2/3) : nSessions;
}
/* 주 2회반에서 핵심 세션을 뺀 나머지 회차 = 창의수연 개념 보강·다지기 몫 */
function courseExtraMeets(nSessions){
  return Math.max(0, Math.ceil(nSessions*2/3)*2 - nSessions);
}
/* 구간 합계 {sessions, weeks} — from~to는 과정 번호(포함) */
function roadTotals(from, to, cadence){
  let sessions=0, weeks=0, courses=0;
  roadCourseList().forEach(x=>{
    if(x.num<from||x.num>to) return;
    const n=(x.c.sessions||[]).length;
    sessions+=n; weeks+=courseWeeks(n,cadence); courses++;
  });
  return {sessions, weeks, courses, months: Math.round(weeks/4)};
}

/* ── 정복 현황 ──────────────────────────────────────────────
   이 화면은 일정표가 아니라 정복 지도다. 큰 자리는 "얼마나 정복했나"에 주고,
   주차는 노드의 작은 부가 정보로 내린다(원장 지시, 2026-08-29).

   "정복 구간" = 계산의 새싹 → 계산의 도약 → 계산의 정복 → 경시의 탑.
   등급 키로만 정하고 과정 수는 데이터에서 센다 — 28 같은 숫자를 박지 않는다.
   ────────────────────────────────────────────────────────── */
const CONQUEST_TIERS=['level1','level2','level3','challenge'];
/* 한 과정을 정복했다 = 그 과정의 마법 유닛을 전부 도장까지 마쳤다.
   마법 유닛이 없는 과정(과정 25 마무리 관문)은 판정할 근거가 없으므로
   정복으로 세지 않는다 — 없는 진행 상태를 지어내지 않는다. */
function courseConquered(c){
  const p=courseProgress(c);
  return p.total>0 && p.done===p.total;
}
function conquestCount(tierKeys){
  let done=0,total=0;
  roadCourseList().forEach(x=>{
    if(tierKeys && tierKeys.indexOf(x.c.tier)<0) return;
    total++;
    if(courseConquered(x.c)) done++;
  });
  return {done, total, pct: total?Math.round(done/total*100):0};
}
/* 다음 목표 = 현재 과정 뒤에서 아직 정복하지 않은 첫 과정. 없으면 null. */
function nextGoalKey(curKey){
  const l=roadCourseList();
  const ci=l.findIndex(x=>x.key===curKey);
  for(let i=ci+1;i<l.length;i++){ if(!courseConquered(l[i].c)) return l[i].key; }
  return null;
}
/* 한 구간(역)에 걸린 문장(紋章). data/lineages.js의 chain이 그 구간의 마법
   유닛을 포함하면 그 계보를 그 구간의 문장으로 본다. 배지 체계를 새로 만들지
   않고 기존 S.lineageBadges(계보 완주 기록)를 그대로 읽는다. */
function segmentEmblems(courses){
  const units={};
  courses.forEach(x=>courseMagicIds(x.c).forEach(id=>{ units[id]=true; }));
  const map=lineagesMap();
  const out=[];
  Object.keys(map).forEach(k=>{
    const line=map[k];
    if(!(line.chain||[]).some(u=>units[u])) return;
    out.push({key:k, emblem:line.emblem, name:line.name,
      earned: !!(S.lineageBadges && S.lineageBadges[k])});
  });
  return out;
}

/* 과정 노드를 눌렀을 때 — 그 과정의 마법 유닛(아직 안 끝낸 것 우선)으로 들어간다.
   체험 게이트는 enterContinueUnit이 그대로 확인한다(잠긴 유닛이면 같은 안내 모달).
   마법 유닛이 하나도 없는 과정(총정리)은 이 앱에서 그 과정을 여는 길이 학습지·시험
   화면뿐이라 그리로 보낸다 — 없는 유닛을 지어내지 않는다. */
function enterCourseNode(key){
  const c=(window.NM_COURSES||{})[key];
  if(!c) return;
  const ids=courseUnitIds(c);
  if(ids.length){
    const nextId=ids.find(u=>!stepDone(u,'stamp'))||ids[0];
    S._roadFocus=key;
    enterContinueUnit(nextId, true);
    return;
  }
  const ko=S.lang==='ko', en=S.lang==='en';
  toast(ko?'이 과정은 학습지로 풀어요':en?'This course runs as a worksheet':'这个课程用学习单来做', true);
  S.view='exam'; save(); render();
}

function screenCourseRoad(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;

  if(!window.NM_COURSES||!window.NM_THREADS){
    scr.innerHTML=`<div class="nm-unit-bar"><button class="nm-back" id="crBack">${t('back')}</button>
      <div class="nm-unit-title">🛤️ ${lk('연산 로드맵','Course Road','运算路线图')}</div></div>
      <div class="nm-step-body"><div class="nm-card">${lk('과정 자료를 아직 불러오지 못했어요.','Course data is not ready yet.','课程数据还没准备好。')}</div></div>`;
    $('#crBack').onclick=()=>{S.view='town';save();render();};
    return;
  }

  const curKey=currentCourseKey();
  const list=roadCourseList();
  const lastNum=list.length?list[list.length-1].num:0;

  scr.innerHTML=`<div class="nm-cr-wrap">
    <div class="nm-cr-header">
      <button class="nm-back" id="crBack">${t('back')}</button>
      <div class="nm-cr-titlerow">
        <div class="nm-cr-title">🛤️ ${lk('연산 로드맵','Course Road','运算路线图')}</div>
        <button class="nm-cr-diagbtn" id="crDiag">🧭 ${lk('진단하기','Level Check','水平测评')}</button>
      </div>
      <div class="nm-cr-sub">${lk('지금 어디까지 왔고 앞으로 어디로 가는지, 한 길로 보여요.','See the whole path — where you are now and where it leads.','用一条路看清现在走到哪里、接下来去哪里。')}</div>
      <!-- 정복의 뜻은 about.html의 철학과 같은 것이어야 한다("수를 정복하기 위한
           DOCSSAM의 철학" · "어려운 수를 내가 다루기 쉬운 수로 펼쳐서"). 로드맵이
           따로 노는 은유를 만들지 않도록 그 문장을 여기서 다시 말하고 원문으로 잇는다. -->
      <div class="nm-cr-philo">
        ${lk('수를 정복한다는 건 빨리 푸는 게 아니라, 어려운 수를 <b>내가 다루기 쉽게 펼칠</b> 수 있게 되는 거예요.',
             'Conquering numbers isn\'t about speed — it\'s being able to <b>unfold</b> a hard number into ones you handle easily.',
             '征服数字不是算得快，而是能把难的数<b>展开</b>成自己好处理的数。')}
        <a class="nm-philobtn nm-cr-philolink" href="about.html">✦ ${lk('철학','Philosophy','理念')}</a>
      </div>
    </div>
    <div class="nm-cr-body" id="crBody"></div>
  </div>`;
  $('#crBack').onclick=()=>{S._roadFocus=null;S.view='town';save();render();};
  $('#crDiag').onclick=()=>startPlacement();

  const body=$('#crBody');

  function draw(keepScroll){
    const cad=S.roadCadence;
    const opTotals=roadTotals(1,25,cad);
    const allTotals=roadTotals(1,lastNum,cad);
    /* 콘텐츠 준비 현황은 매번 데이터에서 센다 — 숫자를 박아 두지 않는다. */
    const builtCount=list.filter(x=>courseBuilt(x.c)).length;

    /* ── 정복 현황 (이 화면의 주인공) ── */
    const conq=conquestCount(CONQUEST_TIERS);
    const conqAll=conquestCount(null);
    const conqFirst=list.filter(x=>CONQUEST_TIERS.indexOf(x.c.tier)>=0);
    const conqLast=conqFirst.length?conqFirst[conqFirst.length-1].num:0;
    const goalKey=nextGoalKey(curKey);
    const goalC=goalKey?(window.NM_COURSES||{})[goalKey]:null;
    const curC=(window.NM_COURSES||{})[curKey];
    const fresh=!mostRecentTouchedUnit();
    const courseLine=(key,c)=>`${lk('과정','Course','课程')} ${String(key).replace(/^C/,'')} · ${esc(L(c.title))}`;

    let html=`<div class="nm-cr-conq">
      <div class="nm-cr-conq-top">
        <span class="nm-cr-conq-lbl">${lk('정복한 과정','Courses conquered','已征服课程')}</span>
        <span class="nm-cr-conq-num"><b>${conq.done}</b><i>/ ${conq.total}</i></span>
      </div>
      <div class="nm-cr-bar"><span style="width:${conq.pct}%"></span></div>
      <div class="nm-cr-conq-sub">${lk('계산의 새싹부터 경시의 탑까지','From the first sprouts to the Tower of Challenge','从计算的新芽到竞赛之塔')} · ${lk('과정','Course','课程')} 1~${conqLast}</div>
      ${fresh
        ? `<div class="nm-cr-conq-line start">🚩 ${lk('과정 1에서 출발해요.','Starting at course 1.','从课程1出发。')}</div>`
        : `<div class="nm-cr-conq-line now">📍 ${lk('지금 여기','You are here','当前位置')} — ${curC?courseLine(curKey,curC):''}</div>
           ${goalC?`<div class="nm-cr-conq-line goal">🎯 ${lk('다음 목표','Next goal','下一个目标')} — ${courseLine(goalKey,goalC)}</div>`:''}`}
      <div class="nm-cr-conq-all">${lk('전체 길','Whole path','整条路')} ${conqAll.done} / ${conqAll.total}</div>
    </div>`;

    /* ── 주차 보기 전환 + 합계 (부가 정보 — 주인공 자리가 아니다) ── */
    html+=`<div class="nm-cr-cad">
      <div class="nm-cr-cad-h">${lk('한 과정에 걸리는 시간','How long a course takes','一个课程需要多久')}</div>
      <div class="nm-cr-seg" role="group">
        <button class="${cad==='w1'?'on':''}" data-cad="w1">${lk('주 1회반','Once a week','每周1次')}</button>
        <button class="${cad==='w2'?'on':''}" data-cad="w2">${lk('주 2회반','Twice a week','每周2次')}</button>
      </div>
      <p class="nm-cr-cadnote">${cad==='w2'
        ? lk('주 2회라고 두 배 빨라지지는 않아요. 한 과정에 걸리는 주차가 3분의 2로 줄고, 그동안 두 배로 만나니 남는 회차가 생겨요. 그 회차는 창의수연 개념을 더 넣고 다지는 데 써서 더 탄탄해져요.',
             'Meeting twice a week does not make it twice as fast. A course takes about two thirds of the weeks, and the extra meetings go into creative-thinking concepts and consolidation — so it gets sturdier, not just quicker.',
             '每周2次并不会快一倍。一个课程所需的周数约减为三分之二，多出来的课次用来加入创意思维概念和巩固练习——不只是更快，而是更扎实。')
        : lk('한 주에 한 세션씩 나아가요. 과정마다 마지막은 확인 세션이에요.',
             'One session per week. Each course ends with a check session.',
             '每周前进一节课。每个课程最后是一次检查课。')}</p>
      <div class="nm-cr-totals">
        <div class="nm-cr-total">
          <b>${lk('연산 구간','Arithmetic stretch','运算区间')} <small>${lk('과정','Course','课程')} 1~25</small></b>
          <span>${opTotals.weeks}${lk('주','wk','周')} · ${lk('약','about','约')} ${opTotals.months}${lk('개월','mo','个月')}</span>
        </div>
        <div class="nm-cr-total">
          <b>${lk('전체 길','Whole path','整条路')} <small>${lk('과정','Course','课程')} 1~${lastNum}</small></b>
          <span>${allTotals.weeks}${lk('주','wk','周')} · ${lk('약','about','约')} ${allTotals.months}${lk('개월','mo','个月')}</span>
        </div>
      </div>
      <div class="nm-cr-built">${builtCount===list.length
        ? `✅ ${lk(`과정 ${list.length}개 모두 배울 내용이 준비돼 있어요.`,`All ${list.length} courses have their content ready.`,`全部${list.length}个课程的内容都已备妥。`)}`
        : `📦 ${lk(`과정 ${list.length}개 중 ${builtCount}개가 준비됐어요.`,`${builtCount} of ${list.length} courses are ready.`,`${list.length}个课程中已备妥${builtCount}个。`)}`}</div>
      <p class="nm-cr-cadfoot">${lk('4주를 한 달로 셌어요.','Counted as 4 weeks per month.','按4周为一个月计算。')}
        ${lk('권장 학습 시간은 한 세션 40~50분','Recommended study time: 40–50 minutes per session','建议学习时间：每节课40~50分钟')}
        — ${cad==='w2'
          ? lk('주 2회면 한 주에 80~100분(권장)','about 80–100 minutes a week (recommended)','每周约80~100分钟（建议）')
          : lk('주 1회면 한 주에 40~50분(권장)','about 40–50 minutes a week (recommended)','每周约40~50分钟（建议）')}.</p>
    </div>`;

    if(S.placement&&S.placement.course){
      const pc=(window.NM_COURSES||{})[S.placement.course];
      const pnum=String(S.placement.course).replace(/^C/,'');
      if(pc) html+=`<div class="nm-cr-diagchip">🧭 ${lk('진단 추천','Check-up suggests','测评建议')} — ${lk('과정','Course','课程')} ${pnum} · ${esc(L(pc.title))}</div>`;
    }

    /* ── 길 ── */
    /* 등급이 바뀌는 자리마다 역을 세운다 — 과정 번호 순서를 절대 흐트러뜨리지
       않으려고 "같은 등급을 전부 모으기"가 아니라 "연속 구간"으로 끊는다.
       대수·미적분Ⅰ처럼 번호가 번갈아 나오는 등급은 역이 두 번 서고,
       두 번째부터는 '이어서'로 표시한다. */
    html+=`<div class="nm-cr-path"><div class="nm-cr-rail" id="crRail"></div>`;
    let ci=0, prevTier=null;
    const seenTier={};
    list.forEach(x=>{
      const c=x.c;
      if(c.tier!==prevTier){
        const tierDef=roadTierInfo(c.tier);
        const run=[], runItems=[]; let k=list.indexOf(x);
        while(k<list.length&&list[k].c.tier===c.tier){ run.push(list[k].num); runItems.push(list[k]); k++; }
        const again=!!seenTier[c.tier];
        seenTier[c.tier]=true;
        const rangeTxt = run.length>1 ? `${run[0]}~${run[run.length-1]}` : `${run[0]}`;
        /* 이 구간을 정복했는가 — 판정할 수 있는 과정(마법 유닛이 있는 과정)만 센다 */
        const markable=runItems.filter(it=>courseUnitIds(it.c).length>0);
        const segDone=markable.filter(it=>courseConquered(it.c)).length;
        const segAll=markable.length;
        const segState=segAll>0&&segDone===segAll?'won':segDone>0?'climbing':'ahead';
        const embs=segmentEmblems(runItems);
        const embHtml=embs.length?`<span class="nm-cr-stemb">${embs.map(e=>
          `<span class="nm-cr-emb${e.earned?' on':''}" title="${esc(L(e.name))}">${e.emblem}</span>`).join('')}</span>`:'';
        const segLabel=segAll===0?''
          :segState==='won'?`<span class="nm-cr-stwin">🏳️ ${lk('정복함','Conquered','已征服')}</span>`
          :segState==='climbing'?`<span class="nm-cr-stclimb">${segDone}/${segAll}</span>`:'';
        html+=`<div class="nm-cr-station ${segState}" style="--acc:${tierDef.accent}">
          <span class="nm-cr-strow">
            <span class="nm-cr-stname">${esc(L(tierDef.name))}${again?` <em class="nm-cr-again">${lk('이어서','continued','续')}</em>`:''}</span>
            ${segLabel}
          </span>
          ${again?'':`<span class="nm-cr-stband">${esc(L(tierDef.band))}</span>`}
          <span class="nm-cr-strange">${lk('과정','Course','课程')} ${rangeTxt}${embHtml}</span>
        </div>`;
        prevTier=c.tier;
      }
      const tierDef=roadTierInfo(c.tier);
      {
        const n=(c.sessions||[]).length;
        const wk=courseWeeks(n,cad);
        const extra=courseExtraMeets(n);
        const prog=courseProgress(c);
        const built=courseBuilt(c);
        const isNow=x.key===curKey;
        const isDone=courseConquered(c);
        const isGoal=!isDone&&!isNow&&x.key===goalKey;
        const isDoing=!isDone&&prog.done>0;
        const ids=courseUnitIds(c);
        const locked=ids.length>0&&ids.every(u=>unitLocked(u));
        const isTower=c.tier==='challenge';
        const st=(isDone?'done':isNow?'now':isGoal?'goal':isDoing?'doing':'ahead')
          +(isTower?' tower':'')+(c.boss?' boss':'');
        /* 상태 말은 셋뿐이다 — 정복함 / 지금 여기 / 다음 목표.
           나머지는 옅게 두고 굳이 "예정" 같은 시스템 말을 붙이지 않는다.
           과정 25는 정복 판정 근거가 없으므로 마무리 관문으로만 표시한다. */
        const stateLabel=isDone?`🏳️ ${lk('정복함','Conquered','已征服')}`
          :isNow?`📍 ${lk('지금 여기','You are here','当前位置')}`
          :isGoal?`🎯 ${lk('다음 목표','Next goal','下一个目标')}`
          :c.boss?lk('마무리 관문','Final gate','最后关卡')
          :isDoing?`${prog.done}/${prog.total}`
          :'';
        html+=`<div class="nm-cr-row ${ci%2?'right':'left'}">
          ${isNow?`<div class="nm-cr-here">${window.renderNumiChar?window.renderNumiChar(S.character,44):'🪄'}<span>${lk('지금 여기','You are here','当前位置')}</span></div>`:''}
          <button class="nm-cr-node ${st}${locked?' trial-locked':''}" data-c="${x.key}" style="--acc:${tierDef.accent}"${isNow?' id="crNow"':''}>
            <span class="nm-cr-num">${x.num}${isDone?'<i class="nm-cr-flag">🏳️</i>':''}</span>
            <span class="nm-cr-nbody">
              <b>${esc(L(c.title))}${c.boss?' 👑':isTower?' 🗼':''}</b>
              <span class="nm-cr-meta">${lk('세션','Sessions','课节')} ${n} · ${wk}${lk('주','wk','周')}${cad==='w2'&&extra>0?` · ${lk('보강','Extra','加强')} ${extra}${lk('회','','次')}`:''}</span>
              ${!built?`<span class="nm-cr-soon">${lk('준비 중','Coming soon','准备中')}</span>`:''}
            </span>
            <span class="nm-cr-state">${locked?'🔒':stateLabel}</span>
          </button>
        </div>`;
        ci++;
      }
    });
    html+=`</div>`;

    /* ── 수학 실험실 ── */
    html+=`<div class="nm-cr-labs">
      <div class="nm-cr-labs-h">🔬 ${lk('수학 실험실','Math Lab','数学实验室')}</div>
      <p class="nm-cr-labs-sub">${lk('과정과 상관없이 언제든 열어 볼 수 있어요. 새 창에서 열려요.','Open any of these any time, whatever course you are on. They open in a new tab.','不论在哪个课程，随时都能打开。会在新窗口打开。')}</p>
      <div class="nm-cr-lab-grid">${ROAD_LABS.map(lab=>`
        <button class="nm-cr-lab" data-lab="${esc(lab.file)}">
          <span class="nm-cr-lab-ic">${lab.icon}</span>
          <span class="nm-cr-lab-txt"><b>${esc(L(lab.name))}</b><small>${esc(L(lab.desc))}</small></span>
        </button>`).join('')}</div>
    </div>`;

    const keep=keepScroll?body.scrollTop:0;
    body.innerHTML=html;
    body.querySelectorAll('.nm-cr-seg button[data-cad]').forEach(el=>{
      el.onclick=()=>{ S.roadCadence=el.dataset.cad; save(); draw(true); };
    });
    body.querySelectorAll('.nm-cr-node[data-c]').forEach(el=>{
      el.onclick=()=>enterCourseNode(el.dataset.c);
    });
    body.querySelectorAll('.nm-cr-lab[data-lab]').forEach(el=>{
      el.onclick=()=>{ window.open(el.dataset.lab,'_blank','noopener'); };
    });

    /* 지나온 길과 앞길을 레일 색으로 가른다 — 옅은 점선 위에 지금까지 온 만큼만
       금색 레일을 덮는다. 길이는 현재 과정 노드의 위치에서 잰다(추정 없음). */
    const rail=body.querySelector('#crRail');
    const pathEl=body.querySelector('.nm-cr-path');
    const nowRow=body.querySelector('.nm-cr-node.now');
    if(rail&&pathEl){
      if(nowRow){
        const r=nowRow.getBoundingClientRect(), pr=pathEl.getBoundingClientRect();
        rail.style.height=Math.max(0,(r.top-pr.top)+r.height/2)+'px';
      } else rail.style.height='0px';
    }

    if(keepScroll){ body.scrollTop=keep; }
    else {
      /* 처음 열 때만 현재 위치(또는 진단이 추천한 과정)로 스크롤 */
      const focusKey=S._roadFocus||curKey;
      const target=body.querySelector(`.nm-cr-node[data-c="${focusKey}"]`)||body.querySelector('#crNow');
      if(target) target.scrollIntoView({block:'center'});
      S._roadFocus=null;
    }
  }
  draw(false);
}

/* ============================================================
   진단하기 (S.view==='placement') — 짧은 레벨 확인
   ------------------------------------------------------------
   이 앱엔 배치 진단이 없었다(유닛 안의 "진단 스킵"은 그 유닛 한 곳을
   건너뛸지 묻는 것이라 다른 물건이다). 그래서 최소한으로 만든다:
   연산 구간을 대표하는 사다리를 낮은 칸부터 하나씩 올라가며 한 문제씩
   묻고, 한 칸에서 두 번 틀리면 거기서 멈춰 그 과정을 시작점으로 권한다.
   문항은 전부 기존 생성기(NM_TGEN)가 만든다 — 새 문제를 지어내지 않는다.
   결과는 권유일 뿐 어떤 과정도 잠그지 않는다.
   ============================================================ */
const PLACEMENT_LADDER=[
  {course:'C1',  thread:'AD1', level:1},
  {course:'C3',  thread:'AD3', level:1},
  {course:'C4',  thread:'AD5', level:1},
  {course:'C5',  thread:'ML2', level:1},
  {course:'C7',  thread:'ML3', level:1},
  {course:'C9',  thread:'ML6', level:1},
  {course:'C11', thread:'ML8', level:1},
  {course:'C12', thread:'DV3', level:1},
  {course:'C13', thread:'FR1', level:1},
  {course:'C16', thread:'MX1', level:1},
  {course:'C17', thread:'DC1', level:1},
  {course:'C19', thread:'DV7', level:1}
];
const PLACEMENT_TOP='C20'; /* 사다리를 전부 통과했을 때 권하는 시작 과정 */

function startPlacement(){
  S._diag={ run:Date.now(), i:0, attempt:0, asked:0, correct:0, failedAt:null, cur:null };
  S.view='placement'; save(); render();
}
function placementProblem(rung, i, attempt, run){
  const th=(window.NM_THREADS||{})[rung.thread];
  const gen=(window.NM_TGEN||{})[th&&th.gen];
  const params=(th&&(th.levels||[]).find(l=>l.id===rung.level)||{}).params||{};
  const rng=NM_RNG.mulberry32(NM_RNG.hashSeed('diag'+run+rung.thread+rung.level+'i'+i+'a'+attempt));
  return gen ? gen(params,rng)
             : {prompt:{ko:'',en:'',zh:''},tex:'?',answer:0,answerType:'number'};
}
function finishPlacement(){
  const d=S._diag;
  const key=(d.failedAt!=null&&PLACEMENT_LADDER[d.failedAt])
    ? PLACEMENT_LADDER[d.failedAt].course : PLACEMENT_TOP;
  S.placement={ at:Date.now(), course:key, asked:d.asked, correct:d.correct,
    cleared:(d.failedAt==null?PLACEMENT_LADDER.length:d.failedAt) };
  save();
  return key;
}
function screenPlacement(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const d=S._diag;
  if(!d){ S.view='town'; save(); render(); return; }

  /* ── 결과 ── */
  if(d.failedAt!=null || d.i>=PLACEMENT_LADDER.length){
    const key=finishPlacement();
    const c=(window.NM_COURSES||{})[key];
    const num=String(key).replace(/^C/,'');
    const tierDef=c?roadTierInfo(c.tier):null;
    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="dgBack">${t('back')}</button>
      <div class="nm-unit-title">🧭 ${lk('진단 결과','Check-up Result','测评结果')}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap nm-dg-wrap">
      <div class="nm-card center">
        <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
        <div class="nm-card-h">${lk('여기서 시작하면 좋아요!','A good place to start!','从这里开始正合适！')}</div>
        <div class="nm-dg-course">${lk('과정','Course','课程')} ${num}${c?` · ${esc(L(c.title))}`:''}</div>
        ${tierDef?`<div class="nm-dg-tier">${esc(L(tierDef.name))} · ${esc(L(tierDef.band))}</div>`:''}
        <div class="nm-score">${d.correct} / ${d.asked}</div>
        <p class="nm-wsh-sentence">${lk('맞힌 문제까지가 이미 익숙한 곳이에요. 여기서부터 새로 배우면 딱 맞아요.','Everything you answered is already comfortable — starting here fits just right.','答对的部分已经很熟练了，从这里开始正好。')}</p>
        <p class="nm-dg-free">${lk('이건 권유일 뿐이에요. 과정은 언제든 자유롭게 골라도 좋아요.','This is only a suggestion — you can pick any course you like, any time.','这只是建议，任何时候都可以自由选择课程。')}</p>
        <button class="nm-btn full" id="dgGoRoad">🛤️ ${lk('로드맵에서 이 과정 보기','See this course on the road','在路线图上看这个课程')}</button>
        <button class="nm-dg-again" id="dgAgain">${lk('다시 진단하기','Take it again','再测一次')}</button>
      </div>
    </div>`;
    $('#dgBack').onclick=()=>{ S._diag=null; S.view='town'; save(); render(); };
    $('#dgGoRoad').onclick=()=>{ S._diag=null; S._roadFocus=key; S.view='courseroad'; save(); render(); };
    $('#dgAgain').onclick=()=>startPlacement();
    return;
  }

  /* ── 문항 ── */
  const rung=PLACEMENT_LADDER[d.i];
  if(!d.cur) d.cur=placementProblem(rung,d.i,d.attempt,d.run);
  const cur=d.cur;
  const th=(window.NM_THREADS||{})[rung.thread];

  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="dgBack">${t('back')}</button>
    <div class="nm-unit-title">🧭 ${lk('진단하기','Level Check','水平测评')}</div>
  </div>
  <div class="nm-step-body">
    <div class="nm-dialog">
      <div class="nm-dg-step">${lk('단계','Step','阶段')} ${d.i+1} / ${PLACEMENT_LADDER.length}${th?` · ${esc(L(th.name))}`:''}</div>
      <div class="nm-prog">${dots(PLACEMENT_LADDER.length,d.i)}</div>
      <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
      <div class="nm-bubble">${esc(L(cur.prompt))}</div>
      ${d.attempt>0?`<div class="nm-dg-retry">${lk('한 번 더 해볼까요?','One more try?','再试一次？')}</div>`:''}
      <div class="nm-lab-expr">${labExprHtml(cur.tex)}</div>
      <div class="nm-numpad-screen" id="dgScreen">&nbsp;</div>
      <div class="nm-numpad" id="dgPad"></div>
    </div>
  </div>`;
  $('#dgBack').onclick=()=>{ S._diag=null; S.view='town'; save(); render(); };
  renderMath(scr);

  const screenEl=$('#dgScreen');
  let inp='';
  buildNumpad($('#dgPad'),val=>{
    if(val==='ok'){
      if(inp==='') return;
      const ok=parseFloat(inp)===cur.answer;
      d.asked++; if(ok) d.correct++;
      if(ok){ d.i++; d.attempt=0; }
      else if(d.attempt===0){ d.attempt=1; }
      else { d.failedAt=d.i; }
      d.cur=null; save();
      if(ok) playSfx('success');
      setTimeout(()=>screenPlacement(), ok?520:820);
      return;
    }
    if(val==='del') inp=inp.slice(0,-1);
    else if(val==='-') inp=applyMinusKey(inp);
    else if(inp.replace('-','').length<6&&!(val==='.'&&inp.includes('.'))) inp+=val;
    screenEl.textContent=inp||' ';
  },{decimal:!Number.isInteger(cur.answer), negative:!!cur.negative});
}

/* ============================================================
   타이틀 화면 — 게임처럼 모드를 고르고 들어간다 (과정-로드맵.md §14)
   진행 기록이 있는 프로필에서, 인트로 애니메이션 직후(about.html → ?enter=1)
   에만 등장한다(boot()의 maybeShowTitle 참고). 선택은 기억하지 않음 —
   매번 다시 고르는 게 의식(ritual)이라는 게 스펙의 핵심이라, 여기서 고른
   view는 곧바로 실제 화면으로 넘어가며 저장될 뿐 'title' 자체는 저장 상태에
   남기지 않는다.
   ============================================================ */
function screenTitle(){
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const uid = mostRecentTouchedUnit();
  const summary = progressSummaryLine();
  const badge = mostRecentBadge();

  scr.innerHTML=`
  <div class="nm-title">
    <div class="nm-title-card">
      <div class="nm-title-logo">
        <div class="nm-title-logo-kr">${lk('수의 마법','Numbers of Magic','数字魔法')}</div>
        <div class="nm-title-logo-sub">${lk('NUMBERS OF MAGIC','수의 마법','数字魔法')}</div>
      </div>
      <div class="nm-title-char">${window.renderNumiChar?window.renderNumiChar(S.character,88):''}</div>
      <div class="nm-title-hello">${S.name?esc(S.name)+' — ':''}${lk('다시 만나서 반가워요!','Welcome back!','欢迎回来！')}</div>
      <div class="nm-title-stats">
        <span class="nm-title-chip">🪙 ${S.coins}</span>
        ${badge?`<span class="nm-title-chip gold">🏅 ${esc(badge.label)}</span>`:''}
      </div>
      ${lineageBadgeRowHtml()}
      <div class="nm-title-btns">
        <button class="nm-title-btn nm-gloss gold" id="ttContinue">
          <span class="nm-title-btn-ico">▶</span>
          <span class="nm-title-btn-txt">
            <b>${lk('이어서 모험','Continue Adventure','继续冒险')}</b>
            ${summary?`<small>${esc(summary)}</small>`:''}
          </span>
        </button>
        <div class="nm-title-grid">
          <button class="nm-title-blk nm-gloss" id="ttDiag">
            <span class="nm-title-blk-ico">🧭</span>
            <b>${lk('진단하기','Level Check','水平测评')}</b>
            <small>${lk('어디서 시작할지 찾아요','Find where to start','找到起点')}</small>
          </button>
          <button class="nm-title-blk nm-gloss" id="ttGame">
            <span class="nm-title-blk-ico">🎮</span>
            <b>${lk('게임 모드','Game Mode','游戏模式')}</b>
            <small>${lk('마을을 돌아다녀요','Roam the town','在小镇里逛逛')}</small>
          </button>
          <button class="nm-title-blk nm-gloss" id="ttSheet">
            <span class="nm-title-blk-ico">📄</span>
            <b>${lk('학습지 모드','Worksheet Mode','学习单模式')}</b>
            <small>${lk('뽑아서 풀어요','Print and solve','打印后来做')}</small>
          </button>
          <button class="nm-title-blk nm-gloss" id="ttRoad">
            <span class="nm-title-blk-ico">🛤️</span>
            <b>${lk('연산 로드맵','Course Road','运算路线图')}</b>
            <small>${lk('전체 길과 지금 위치','The whole path','整条路与当前位置')}</small>
          </button>
        </div>
        <div class="nm-title-sub-row">
          <button class="nm-title-pill" id="ttStory">🗺 ${lk('스토리 모드','Story Mode','故事模式')}</button>
          <button class="nm-title-pill" id="ttDex">📖 ${lk('기호 도감','Symbol Dex','符号图鉴')}</button>
        </div>
      </div>
    </div>
  </div>`;
  $('#ttContinue').onclick=()=>enterContinueUnit(uid);
  $('#ttDiag').onclick=()=>startPlacement();
  $('#ttGame').onclick=()=>{ S.view='town'; save(); render(); };
  $('#ttSheet').onclick=()=>{ S.view='exam'; save(); render(); };
  $('#ttRoad').onclick=()=>{ S.view='courseroad'; save(); render(); };
  $('#ttStory').onclick=()=>{ S.view='roadmap'; save(); render(); };
  $('#ttDex').onclick=()=>{ S._dexFrom='title'; S.view='symboldex'; save(); render(); };
}
/* 타이틀 화면 배지 줄(§6 규칙4) — 완주한 계보의 문장(紋章)을 나열, 하나도 없으면 빈 문자열. */
function lineageBadgeRowHtml(){
  const keys=Object.keys(S.lineageBadges||{});
  if(!keys.length)return'';
  const map=lineagesMap();
  const chips=keys.map(k=>{const line=map[k];return line?`<span class="nm-lin-chip big" title="${esc(L(line.name))}">${line.emblem}</span>`:'';}).join('');
  return chips?`<div class="nm-title-lin-row">${chips}</div>`:'';
}
/* 학생의 현 과정 위치. courses 진행 상태를 직접 추적하는 저장값은 아직
   없어서(§10 "courses.js의 과정 위치(현재 세션)" — 이 프로필 구조엔 세션
   단위 진행 기록이 없다), 가장 최근에 손댄 마법 유닛이 속한 과정으로
   대신한다(스펙의 "없으면 최근 학습 유닛의 과정" 그대로). 아무 기록도
   없는 완전 신규 학생은 과정1부터. */
function currentCourseKey(){
  const uid = mostRecentTouchedUnit();
  if(uid){
    const cid = courseForUnit(uid);
    if(cid) return cid;
  }
  return 'C1';
}
/* 그 과정에서 봉투에 담을 세션 — 마법이 있는 첫 세션(없으면 첫 세션). */
function primarySessionOf(course){
  if(!course || !course.sessions) return null;
  const withMagic = course.sessions.find(s => !s.test && s.magic && s.magic.length);
  return withMagic || course.sessions.find(s => !s.test) || null;
}
/* 항목 시드 = 주차+과정+항목순서(결정적, Math.random 없음) — 학습지 코드
   규약(parseWorksheetCode)이 요구하는 소문자 영숫자만 남긴다. */
function envItemSeed(weekKey, courseKey, i){
  return (weekKey + courseKey + 'i' + i).toLowerCase().replace(/[^a-z0-9]/g,'');
}
/* weekKey → 그 주 봉투(placements 모델, §12). courses.js/threads.js 미로딩 시 null. */
function envelopeForWeek(weekKey){
  if(!window.NM_COURSES || !window.NM_THREADS) return null;
  const courseKey = currentCourseKey();
  const course = NM_COURSES[courseKey];
  if(!course) return null;
  const session = primarySessionOf(course);
  if(!session) return null;
  const placements = (session.drills||[]).map((d,i) => ({
    order: i+1, thread: d.t, level: d.lv, count: d.n,
    seed: envItemSeed(weekKey, courseKey, i)
  }));
  return { wsId: `W${weekKey}-${courseKey}`, weekKey, courseKey, course, session, magic: session.magic||null, placements };
}
function mailboxEnvelopeCode(env){ return env.wsId; }

/* ============================================================
   정체 감지 → 보강 루프 (과정-로드맵.md §2-4)
   감지: app/progress-stats.js(NM_STATS) — 유형(스레드)별 세션 정답률을
   저장해 두고, 최근 2회 세션이 연속 60% 미만이면 그 유형을 "보강 필요"로
   본다. 감지 자체는 저장된 기록만 보는 순수 함수라 항상 결정적이다.

   삽입: "다음 과정 세션"의 실체가 이 앱에선 편지함의 주간 봉투
   (envelopeForWeek, §10)뿐이라 — 그 봉투를 여는 순간을 "세션 시작"으로
   본다. 보강 대상이 있으면 봉투 화면 맨 위에 "🌟 먼저 몸풀기 마법!" 카드를
   얹는다(placements 자체를 건드리지 않고 화면에서만 앞에 붙인다 — 인쇄
   학습지 구성은 그대로 유지). 아이가 이 카드를 눌러야만 보강 세션이
   시작되고, 누르지 않고 그냥 아래 "이번 주 마법"으로 진행해도 막지 않는다
   (잠금 아님, 자유 선택 원칙). 완료 결과는 S.boost.log에 남겨 부모
   대시보드가 생기면 바로 읽을 수 있게 해 둔다(현재 이 앱엔 부모 대시보드/
   리포트 화면이 없어 — 확인 완료 — UI 표시는 후속 과제로 남긴다).
   ============================================================ */

/* 보강 세션에 쓸 레벨 — 위 §4 다함식 시각화 위젯을 추가해 둔 스레드는
   "가능하면 위 시각화 위젯 레벨"(작업지시) 원칙에 따라 그 레벨을 우선
   쓴다. 그 외 스레드는 "해당 유형 낮은 레벨"(작업지시) 원칙대로 레벨 1. */
const BOOST_VIZ_LEVEL = { NS1:4, AD3:4, AD4:3, AD9:1 };
function boosterLevelFor(threadId){
  return BOOST_VIZ_LEVEL[threadId] || 1;
}
/* 보강이 필요한 스레드 중 가장 급한 것 하나(정답률 최저) — 없으면 null. */
function boosterPick(){
  if(!window.NM_STATS) return null;
  const list = NM_STATS.boostList();
  return list.length ? list[0].thread : null;
}
/* 그 주에 이미 보강을 마쳤는지(완료 시에만 표시 — 카드를 보고도 안 누른
   것은 "아직 안 함"으로 남겨 계속 부드럽게 권한다, 잠금 아님). */
function boosterDoneThisWeek(weekKey){ return !!(S.boost.doneWeeks && S.boost.doneWeeks[weekKey]); }

const BOOST_NEED = 5; /* 보강 세트 문항 수 — 정규 학습지(기본 20)보다 짧게, "몸풀기" */
function startBooster(threadId, weekKey){
  const level = boosterLevelFor(threadId);
  S._boost = { threadId, level, weekKey, i:0, need:BOOST_NEED, score:0, cur:null };
  S._boostRewarded=false;
  S.view='boost'; save(); render();
}
function boostProblem(threadId, level, weekKey, i){
  const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('boost'+weekKey+threadId+level+'i'+i));
  const th = (window.NM_THREADS||{})[threadId];
  const params = (th && th.levels[level-1] && th.levels[level-1].params) || {};
  const gen = (window.NM_TGEN||{})[th && th.gen];
  return gen ? gen(params, rng) : {prompt:{ko:'',en:'',zh:''},tex:'?',answer:0,answerType:'number'};
}
function screenBoost(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const b=S._boost;
  if(!b){ S.view='mailbox'; save(); render(); return; }

  if(b.i>=b.need){
    /* 완료 — 기록 + 살짝 보상 + 리포트용 로그 */
    if(window.NM_STATS) NM_STATS.record(b.threadId, b.level, b.score, b.need, {boost:true});
    S.boost.doneWeeks[b.weekKey]=true;
    S.boost.log.push({weekKey:b.weekKey, thread:b.threadId, level:b.level, score:b.score, need:b.need, ts:Date.now()});
    if(S.boost.log.length>30) S.boost.log.splice(0, S.boost.log.length-30);
    const already = !!S._boostRewarded;
    if(!already){ coinAdd(6); S._boostRewarded=true; }
    scr.innerHTML=`<div class="nm-unit-bar">
      <div class="nm-unit-title">🌟 ${lk('몸풀기 완료!','Warm-up Complete!','热身完成！')}</div>
    </div>
    <div class="nm-step-body">
      <div class="nm-card center">
        <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
        <div class="nm-card-h">${lk('오늘도 한 걸음 더 튼튼해졌어요!','You just got a little stronger!','今天又变得更棒了！')}</div>
        <div class="nm-score">${b.score} / ${b.need}</div>
        <div class="nm-stamp-coins">🪙 +6 ${t('coins')}</div>
        <button class="nm-btn full" id="boostToMailbox">${lk('학습지로 돌아가기','Back to worksheet','返回学习单')}</button>
      </div>
    </div>`;
    save();
    $('#boostToMailbox').onclick=()=>{ S._boost=null; S._boostRewarded=false; S.view='mailbox'; save(); render(); };
    return;
  }

  if(!b.cur){ b.cur = boostProblem(b.threadId, b.level, b.weekKey, b.i); }
  const cur=b.cur;
  const useWidget = cur.widget && cur.widget!=='numpad' && window.NM_WIDGETS;

  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="boostBack">${t('back')}</button>
    <div class="nm-unit-title">🌟 ${lk('먼저 몸풀기 마법!','Warm-up Magic First!','先来热身魔法！')}</div>
  </div>
  <div class="nm-step-body">
    <div class="nm-dialog">
      <div class="nm-prog">${dots(b.need,b.i)}</div>
      <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
      <div class="nm-bubble">${esc(L(cur.prompt))}</div>
      ${useWidget ? `<div id="boostWidget" class="nm-lab-widget"></div>` : `
        <div class="nm-lab-expr">${labExprHtml(cur.tex)}</div>
        <div class="nm-numpad-screen" id="boostScreen">&nbsp;</div>
        <div class="nm-numpad" id="boostPad"></div>`}
    </div>
  </div>`;
  $('#boostBack').onclick=()=>{ S._boost=null; S.view='mailbox'; save(); render(); };
  renderMath(scr);

  function advance(correct){
    if(correct)b.score++;
    b.i++; b.cur=null; save();
    setTimeout(()=>screenBoost(),correct?600:900);
  }

  if(useWidget){
    NM_WIDGETS.render(cur,$('#boostWidget'),val=>{
      const ok = Array.isArray(cur.answer)
        ? Array.isArray(val) && val.length===cur.answer.length && val.every((v,i)=>+v===cur.answer[i])
        : +val===cur.answer;
      if(ok)playSfx("success");
      advance(ok);
    });
  } else {
    /* widgets.js의 numpadState는 그 파일 내부 클로저라 여기선 못 쓴다 —
       stepArena/stepCheck과 같은 방식(S.sub.inp 대신 지역 inp)으로 인라인 처리. */
    const screen=$('#boostScreen');
    let inp='';
    buildNumpad($('#boostPad'),val=>{
      if(val==='ok'){
        if(inp==='')return;
        const ok=parseFloat(inp)===cur.answer;
        advance(ok);
        return;
      }
      if(val==='del')inp=inp.slice(0,-1);
      else if(val==='-')inp=applyMinusKey(inp);
      else if(inp.replace('-','').length<6&&!(val==='.'&&inp.includes('.')))inp+=val;
      screen.textContent=inp||' ';
    },{decimal:!Number.isInteger(cur.answer),negative:!!cur.negative});
  }
}

/* 목록: 이번 주(항상 표시) + 안 연 과거 봉투(최대 8주 보관, 단 firstWeek 이전은 제외 —
   신규 학생이 과거 봉투 8개를 한번에 받지 않도록, Phase 2B §10 잔여) */
function mailboxWeeks(){
  const weeks = recentWeekKeys(8);
  const first = S.firstWeek || weeks[weeks.length-1];
  return weeks.map((wk,i) => ({
    weekKey: wk, isCurrent: i===0,
    opened: !!(S.mailbox.opened && S.mailbox.opened[wk])
  })).filter(w => w.weekKey >= first).filter(w => w.isCurrent || !w.opened);
}
function mailboxUnreadCount(){ return mailboxWeeks().filter(w=>!w.opened).length; }

function screenMailbox(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;

  /* 편지함도 같은 게이트(§10) — trial이면 봉투 목록조차 만들지 않는다 */
  if(!accountActive()){
    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="mbBack">${t('back')}</button>
      <div class="nm-unit-title">📬 ${lk('편지함','Mailbox','信箱')}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap">
      <div class="nm-card nm-gate-card-inline">
        <div class="nm-card-h">🔒 ${lk('편지함은 학원 승인 후 열려요','The mailbox unlocks after academy approval','学院授权后才能开启信箱')}</div>
        <p class="nm-wsh-sentence">${lk('승인번호가 있으면 지금 바로 열 수 있어요.','If you already have a code, you can unlock it right now.','有授权码即可立即解锁。')}</p>
        <button class="nm-btn full" id="mbGate">🔑 ${lk('승인번호 입력','Enter code','输入授权码')}</button>
      </div>
    </div>`;
    $('#mbBack').onclick=()=>{S.view='town';save();render();};
    $('#mbGate').onclick=showGateModal;
    return;
  }

  if(S._mbWeek){
    const env = envelopeForWeek(S._mbWeek);
    if(!env){
      scr.innerHTML=`<div class="nm-unit-bar"><button class="nm-back" id="mbBack">${t('back')}</button>
        <div class="nm-unit-title">📬 ${lk('편지함','Mailbox','信箱')}</div></div>
        <div class="nm-step-body"><div class="nm-card">${lk('학습지 데이터를 아직 불러오지 못했어요.','Worksheet data is not ready yet.','学习单数据还没准备好。')}</div></div>`;
      $('#mbBack').onclick=()=>{S._mbWeek=null;screenMailbox();};
      return;
    }
    const magicHtml = (env.magic||[]).map(id=>{
      const u = UNITS[id];
      if(u){
        return `<div class="nm-wsh-unit-title">✨ ${esc(L(u.title))}</div>`;
      }
      const th=(window.NM_THREADS||{})[id];
      return `<div class="nm-wsh-unit-title">✨ ${esc(th?L(th.name):id)}</div>`;
    }).join('') || `<p class="nm-wsh-sentence">${lk('이번 세션은 드릴 복습 위주예요.','This session is mostly review drills.','这次以复习为主。')}</p>`;
    const goUnit = (env.magic||[]).find(id=>UNITS[id]);
    /* 정체 감지→보강 루프(§2-4) — 이 주의 봉투를 여는 순간이 "다음 과정 세션 시작".
       보강 대상이 있고 이번 주에 아직 안 했다면 맨 위에 부드러운 카드를 얹는다. */
    const boostThread = boosterDoneThisWeek(S._mbWeek) ? null : boosterPick();
    const boostTh = boostThread && (window.NM_THREADS||{})[boostThread];
    const boostCardHtml = boostTh ? `
      <div class="nm-card nm-boost-card">
        <div class="nm-mb-section-h">🌟 ${lk('먼저 몸풀기 마법!','Warm-up Magic First!','先来热身魔法！')}</div>
        <p class="nm-wsh-sentence">${lk(`요즘 ${L(boostTh.name)}이(가) 살짝 어려웠나 봐요. 짧게 5문제만 몸풀고 시작해요!`,`${L(boostTh.name)} has been a bit tricky lately — let's warm up with 5 quick ones!`,`最近${L(boostTh.name)}好像有点难，先来热身5道题吧！`)}</p>
        <button class="nm-btn full" id="mbBoostGo">🌟 ${lk('몸풀기 시작','Start warm-up','开始热身')}</button>
      </div>` : '';
    const drillRows = env.placements.map(p=>{
      const th=(window.NM_THREADS||{})[p.thread];
      const code = NM_EXAM.worksheetCode({thread:p.thread, level:p.level, count:p.count, seed:p.seed});
      return `<div class="nm-mb-drill-row">
        <span class="nm-mb-drill-name">${esc(th?L(th.name):p.thread)}</span>
        <span class="nm-mb-drill-meta">Lv.${p.level} × ${p.count} <code>${esc(code)}</code></span>
      </div>`;
    }).join('');

    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="mbBack">${t('back')}</button>
      <div class="nm-unit-title">📬 ${esc(env.wsId)}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap">
      ${boostCardHtml}
      <div class="nm-card">
        <div class="nm-card-h">${lk('이번 주 학습지 봉투','This Week’s Worksheet Envelope','本周学习单信封')}</div>
        <p class="nm-wsh-sentence">${esc(L(env.course.title))}</p>
        <div class="nm-mb-section-h">${lk('✨ 이번 주 마법','✨ Magic This Week','✨ 本周魔法')}</div>
        ${magicHtml}
        ${goUnit ? `<button class="nm-btn full" id="mbGoUnit">${lk('✨ 이 마법 배우러 가기','✨ Go learn this magic','✨ 去学这个魔法')}</button>` : ''}
        <div class="nm-mb-section-h">${lk('✏️ 드릴 학습지','✏️ Drill Worksheets','✏️ 练习题')}</div>
        <div class="nm-mb-drill-list">${drillRows}</div>
        <button class="nm-btn full nm-btn-secondary" id="mbPrint">🖨️ ${lk('학습지 인쇄','Print worksheets','打印学习单')}</button>
      </div>
    </div>`;
    $('#mbBack').onclick=()=>{S._mbWeek=null;screenMailbox();};
    if(boostTh){
      $('#mbBoostGo').onclick=()=>{ const wk=S._mbWeek; startBooster(boostThread, wk); };
    }
    if(goUnit){
      $('#mbGoUnit').onclick=()=>{
        S._mbWeek=null;
        S.unit=goUnit;S.step=null;S.sub={};S.tierId=null;S.view='unit';S._fromRoadmap=false;
        save();render();
      };
    }
    $('#mbPrint').onclick=()=>{
      const items = env.placements.map(p=>({thread:p.thread, level:p.level, count:p.count, seed:p.seed}));
      if(window.NM_EXAM && NM_EXAM.renderPrintMulti) NM_EXAM.renderPrintMulti(items, env.wsId);
    };
    if(!S.mailbox.opened) S.mailbox.opened={};
    if(!S.mailbox.opened[S._mbWeek]){ S.mailbox.opened[S._mbWeek]=Date.now(); save(); }
    renderMath(scr);
    return;
  }

  const weeks = mailboxWeeks();
  const rows = weeks.map(w=>`<button class="nm-mb-env-card${w.opened?' opened':''}" data-week="${w.weekKey}">
    <span class="nm-mb-env-icon">${w.opened?'📭':'📬'}</span>
    <span class="nm-mb-env-label">${esc(w.weekKey)}${w.isCurrent?` · ${lk('이번 주','This week','本周')}`:''}</span>
    ${w.opened?`<span class="nm-mb-env-badge done">${lk('읽음','Read','已读')}</span>`:`<span class="nm-mb-env-badge new">${lk('새 봉투','New','新')}</span>`}
  </button>`).join('');

  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="mbBack">${t('back')}</button>
    <div class="nm-unit-title">📬 ${lk('편지함','Mailbox','信箱')}</div>
  </div>
  <div class="nm-step-body nm-wsh-wrap">
    <p class="nm-wsh-sentence" style="margin-bottom:12px">${lk('매주 월요일, 지금 배우는 곳에 맞춘 학습지 봉투가 도착해요.','Every Monday, a worksheet envelope arrives matched to what you’re learning.','每周一，会收到一份配合学习进度的学习单信封。')}</p>
    <div class="nm-mb-env-list">${rows || `<div class="nm-card">${lk('봉투가 없어요.','No envelopes yet.','暂无信封。')}</div>`}</div>
  </div>`;
  $('#mbBack').onclick=()=>{S.view='town';save();render();};
  scr.querySelectorAll('.nm-mb-env-card[data-week]').forEach(el=>{
    el.onclick=()=>{ S._mbWeek=el.dataset.week; screenMailbox(); };
  });
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
/* ---------- 체험 게이트 안내 모달 (Phase 2B) ----------
   잠긴 유닛/편지함/인쇄 어디서 열든 항상 같은 모달 하나(§10 "같은 게이트, 같은 안내").
   screenTown()의 #tmodal(등급 소개용)과는 별개 — 그건 render()가 스크린을 통째로
   갈아끼울 때 사라지지만, 이 모달은 town 밖(screenTier/roadmap/mailbox/exam)에서도
   떠야 해서 body에 직접 붙였다 뗀다. */
function gateModalHtml(){
  const ko=S.lang==='ko',en=S.lang==='en';
  return `<div class="nm-gate-overlay" id="nmGateModal">
    <div class="nm-gate-card">
      <button class="nm-gate-x" id="nmGateClose" aria-label="close">✕</button>
      <div class="nm-gate-ico">🔒</div>
      <h3>${ko?'승인번호가 있으면 모두 열려요':en?'Unlock everything with your academy code':'输入学院授权码即可解锁全部'}</h3>
      <p>${ko?'지금은 체험 모드예요. 각 단계 대표 유닛만 먼저 만나볼 수 있어요.':en?'You’re in trial mode — try a taste from each level first.':'当前为体验模式，先体验各阶段的代表单元。'}</p>
      <div class="nm-gate-inputrow">
        <input id="nmGateCode" placeholder="${ko?'승인번호 입력':en?'Enter code':'输入授权码'}" maxlength="24" autocomplete="off">
        <button class="nm-btn" id="nmGateSubmit">${ko?'확인':en?'Apply':'确认'}</button>
      </div>
      <div class="nm-gate-msg" id="nmGateMsg"></div>
      <p class="nm-gate-note">${ko?'승인번호가 없나요? 다니는 학원 선생님께 문의해 주세요.':en?"Don't have a code? Ask your academy for one.":'没有授权码？请咨询所在学院老师。'}</p>
    </div>
  </div>`;
}
function showGateModal(){
  if($('#nmGateModal'))return;
  document.body.insertAdjacentHTML('beforeend',gateModalHtml());
  const close=()=>{const m=$('#nmGateModal');if(m)m.remove();};
  $('#nmGateClose').onclick=close;
  $('#nmGateModal').addEventListener('click',e=>{if(e.target.id==='nmGateModal')close();});
  const inp=$('#nmGateCode'),msg=$('#nmGateMsg'),btn=$('#nmGateSubmit');
  const ko=S.lang==='ko',en=S.lang==='en';
  async function submit(){
    const code=(inp.value||'').trim();
    if(!code){msg.textContent=ko?'코드를 입력해 주세요.':en?'Please enter a code.':'请输入授权码。';return;}
    btn.disabled=true;
    msg.textContent=ko?'확인 중…':en?'Checking…':'检查中…';
    const res=await applyAccountCode(code);
    btn.disabled=false;
    if(res.ok){
      toast(ko?'승인 완료! 모두 열렸어요 ✨':en?'Approved! Everything is unlocked ✨':'授权成功，全部解锁 ✨',true);
      close();
      render();
    }else if(res.reason==='network'){
      msg.textContent=ko?'연결에 실패했어요. 잠시 후 다시 시도해 주세요.':en?'Connection failed — try again soon.':'连接失败，请稍后重试。';
    }else{
      msg.textContent=ko?'코드를 확인해 주세요.':en?'Please check your code.':'请确认授权码。';
    }
  }
  btn.onclick=submit;
  inp.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
  inp.focus();
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
        const u=UNITS[uid];const done=unitDone(uid);const locked=unitLocked(uid);
        html+=`<button class="nm-unit ${done?'done':''} ${locked?'trial-locked':''}" data-unit="${uid}">
          <span class="nm-unit-ic">${u.icon||'✦'}</span>
          <span class="nm-unit-name">${L(u.title)}${lineageBadgeSpan(uid)}</span>
          ${locked?'<span class="nm-unit-lock">🔒</span>':done?'<span class="nm-unit-check">✓</span>':''}
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
  if(unitLocked(uid)){showGateModal();return;}
  S.view='unit';S.unit=uid;S.sub={};
  const u=UNITS[uid];
  const introSeen=!!(S.progress[uid]&&S.progress[uid].introSeen);
  S.step=(u.introVideo&&!introSeen)?'intro':(u.ranges?'range':'practice');
  save();render();
}
function pickRange(rk){S.range=rk;S.step='practice';S.sub={};save();render();}
function exitUnit(){
  const back=S._fromCourseRoad?'courseroad':S._fromRoadmap?'roadmap':S.tierId?'tier':'town';
  S.view=back;S._fromRoadmap=false;S._fromCourseRoad=false;S.unit=null;S.step=null;S.sub={};save();render();
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
  const isMulti=Array.isArray(cur.answer);
  if(isMulti)ensureMultiState(cur.answer,cur.answerShape);
  const shapeCls=isMulti&&cur.answerShape?' nm-multi-shape':'';
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.pIdx)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble" id="bub">${first?esc(L(cfg.intro))+'<br><br>'+esc(L(cur.prompt)):esc(L(cur.prompt))}</div>
    ${pracTex}
    <div class="nm-numpad-screen${isMulti?' nm-multi':''}${shapeCls}" id="pscreen">${isMulti?multiScreenHtml():'&nbsp;'}</div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-hint">${t('numpadHint')}</div>
  </div>`;
  S.sub.started=true;
  renderMath(body);
  if(isMulti)bindMultiBoxes($('#pscreen'));
  const isDecAns=cur&&(isMulti?cur.answer.some(a=>!Number.isInteger(a)):!Number.isInteger(cur.answer));
  buildNumpad($('#pad'),val=>handlePractice(val,body,u),{decimal:isDecAns,negative:!!cur.negative});
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
  const isMulti=Array.isArray(cur.answer);
  if(val==='ok'){
    if(isMulti){
      if(!multiIsFull())return;
      if(multiEquals(cur.answer)){
        toast(t('correct'),true);numiHappy();
        S.sub.pIdx++;S.sub.mvals=null;S.sub.cur=null;
        if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');setTimeout(()=>gotoStep('discover'),700);return;}
        S.sub.cur=genProblem(u.practice,'practice');save();
        setTimeout(()=>runPractice(body,u),650);
      }else{toast(t('tryAgain'),false);multiClear(cur.answer);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);}
      return;
    }
    const inp=S.sub.inp||'';if(inp===''||inp==='-')return;
    if(parseFloat(inp)===cur.answer){
      toast(t('correct'),true);numiHappy();
      S.sub.pIdx++;S.sub.inp='';S.sub.cur=null;
      if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');setTimeout(()=>gotoStep('discover'),700);return;}
      S.sub.cur=genProblem(u.practice,'practice');save();
      setTimeout(()=>runPractice(body,u),650);
    }else{toast(t('tryAgain'),false);S.sub.inp='';$('#pscreen').textContent=' ';}
    return;
  }
  if(isMulti){
    applyMultiKey(val);
    const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);
    return;
  }
  if(val==='del'){S.sub.inp=(S.sub.inp||'').slice(0,-1);}
  else if(val==='-'){S.sub.inp=applyMinusKey(S.sub.inp||'');}
  else if((S.sub.inp||'').replace('-','').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.'))){S.sub.inp=(S.sub.inp||'')+val;}
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
  /* 기호 도감 수집(§13 규칙4) — 이 유닛의 symbols 중 아직 못 모은 게 있으면
     디스커버 본문보다 먼저 "새 기호 카드!" 모달을 띄운다. 이미 다 모았으면
     (S.symbolDex에 다 있으면) uncollected가 비어 조용히 넘어간다 — 재진입 시
     모달 생략(스펙 그대로). */
  const uncollected=(u.symbols||[]).filter(sy=>!S.symbolDex[sy.sym]);
  if(uncollected.length){showSymbolCardModal(uncollected,0,u);}
  const d=u.discover;
  // 두 자리 범위 토글이 있는 유닛(A-01처럼 u.ranges 있을 때)만 kind:'one'/'two'/'mix'로 걸러냄.
  // 범위 선택 자체가 없는 유닛(A-02~04)은 모든 단계를 그대로 보여줌.
  const two = S.range==='twoDigit';
  const stages = u.ranges ? d.stages.filter(s=> two || s.kind==='one') : d.stages;
  const kid = u.tier==='basic';
  /* 개념 스토리 훅(§7·§13): 중등·고등은 docssam 선생님 캐릭터가, 그 외는 누미가 말풍선으로 연다 */
  const st=d.story||u.story;
  /* 중·고 판정 — tier가 "middle*"·"high*"로 시작하는 기존 규칙에 더해
     2022 개정 과목명을 그대로 쓰는 고등 tier(algebra·calculus1, W13·W14,
     2026-08-25)도 명시적으로 포함한다. "고3" 같은 학년 표기 대신 과목명을
     tier id로 쓰라는 작업지시라 접두어 규칙만으로는 안 걸린다 — 정규식을
     넓히는 대신 새 tier를 나열해 실수로 다른 tier까지 걸리지 않게 한다. */
  const isMidHigh=/^(middle|high)/.test(u.tier||'')||u.tier==='algebra'||u.tier==='calculus1';
  /* 스토리 삽화(2026-08-28): assets/images/story/<유닛>.svg 가 있으면 훅 위에 얹는다.
     유닛마다 그림이 다 있는 건 아니라 목록을 따로 들고 다니지 않고, 파일이 없으면
     onerror 로 <figure> 째 지운다 — 새 그림을 추가할 때 코드를 고칠 필요가 없다.
     삽화는 전부 원본 도형이고, 3개 언어 공용이라 글자 대신 숫자·수식만 쓴다. */
  const artHtml=`<figure class="nm-story-art"><img src="assets/images/story/${u.id}.svg" alt=""
      loading="lazy" onerror="this.closest('.nm-story-art').remove()"></figure>`;
  const storyHtml=st?`${artHtml}<div class="nm-story${isMidHigh?' doc':''}">
      ${isMidHigh?`<img class="nm-story-char" src="assets/docssam.png" alt="">`:`<div class="nm-story-numi">🧙</div>`}
      <div class="nm-story-bubble">${L(st.hook)}</div>
    </div>${st.history?`<div class="nm-story-hist">🏛 ${L(st.history)}</div>`:''}`:'';
  body.innerHTML=`<div class="nm-card${kid?' kid-note':''}">
    ${kid?`<div class="nm-kid-hero">${u.icon||'📓'}</div>`:''}
    <div class="nm-card-h">📓 ${L(d.title)}</div>${storyHtml}<div id="cstages"></div>
    <div class="nm-rule"><b>${t('ruleLabel')}</b><p>${L(d.rule)}</p></div>
    <button class="nm-btn full" id="toCheck">${t('next')}</button></div>`;
  const host=body.querySelector('#cstages');
  stages.forEach(s=>{
    const wrap=document.createElement('div');wrap.className='nm-cstage';
    const headTxt=L(s.head);
    wrap.innerHTML=`<span class="nm-ctag ${s.kind||''}">${L(s.tag)}</span>
      <div class="nm-ch">${/\\/.test(headTxt)?`<span data-tex="${headTxt.replace(/"/g,'&quot;')}"></span>`:headTxt}</div>
      <div class="nm-cdesc">${L(s.desc)}</div>`;
    host.appendChild(wrap);
    if(s.terms)conceptExpr(wrap, s.terms);
    else if(s.mathSteps)mathStepsExpr(wrap, s.mathSteps, kid);
    const res=document.createElement('div');res.className='nm-cresult';res.textContent=L(s.result);wrap.appendChild(res);
    if(s.book){const bk=document.createElement('div');bk.className='nm-cbook';bk.innerHTML='📖 '+L(s.book);wrap.appendChild(bk);}
  });
  $('#toCheck').onclick=()=>{markStepDone(S.unit,'discover');gotoStep(u.tier==='basic'?'lab':'check');};
}

/* ============================================================
   기호 도감 (과정-로드맵.md §13) — 수집 모달 + 도감 화면
   unit.symbols:[{sym,read,translate,birth}] (기존 5유닛은 한글 단일 문자열,
   L()도 typeof string이면 그대로 문자열을 돌려주므로 symText가 둘 다 받는다).
   ============================================================ */
function symText(v){return typeof v==='string'?v:L(v);}
/* "새 기호 카드!" 모달 — 앞면(기호+읽는 법) 탭하면 뒤집혀 뒷면(번역+탄생 이야기).
   닫으면(=수집하기) S.symbolDex에 저장하고 목록의 다음 기호(있으면)를 이어서 띄운다. */
function symbolCardModalHtml(sy){
  const ko=S.lang==='ko',en=S.lang==='en';
  return`<div class="nm-gate-overlay nm-symmodal-overlay" id="nmSymModal">
    <div class="nm-gate-card nm-symmodal-card">
      <div class="nm-symmodal-badge">✨ ${ko?'새 기호 카드!':en?'New Symbol Card!':'新符号卡！'}</div>
      <div class="nm-dex-card big" id="nmSymFlip">
        <div class="nm-dex-flip">
          <div class="nm-dex-face front">
            <div class="nm-dex-sym">${esc(sy.sym)}</div>
            <div class="nm-dex-read">${esc(symText(sy.read))}</div>
            <div class="nm-symmodal-tap">👆 ${ko?'탭해서 뒤집기':en?'Tap to flip':'点击翻面'}</div>
          </div>
          <div class="nm-dex-face back">
            <div class="nm-dex-translate">${esc(symText(sy.translate))}</div>
            <div class="nm-dex-birth">${esc(symText(sy.birth))}</div>
          </div>
        </div>
      </div>
      <button class="nm-btn full" id="nmSymClose">${ko?'수집하기':en?'Collect':'收藏'}</button>
    </div>
  </div>`;
}
function showSymbolCardModal(list,idx,u){
  if(idx>=list.length)return;
  const sy=list[idx];
  document.body.insertAdjacentHTML('beforeend',symbolCardModalHtml(sy));
  const flip=$('#nmSymFlip');
  flip.onclick=()=>flip.classList.toggle('flipped');
  $('#nmSymClose').onclick=()=>{
    S.symbolDex[sy.sym]={unitId:u.id,earnedAt:Date.now()};save();
    const m=$('#nmSymModal');if(m)m.remove();
    showSymbolCardModal(list,idx+1,u);
  };
}
/* §13 도감 초안의 전체 기호 목록(x·√·aⁿ·f(x)·Σ·lim·f′·∫·D·αβ) — 실제로 그 기호를
   구현한 유닛이 아직 없어도 "아직 만나지 못한 기호" 자리로 항상 보여준다. */
const SYMBOL_DEX_CANON=['x','√','aⁿ','f(x)','Σ','lim',"f'",'∫','D','αβ'];
function allUnitSymbols(){
  const out=[];
  Object.keys(UNITS).forEach(uid=>{
    const u=UNITS[uid];
    (u.symbols||[]).forEach(sy=>{if(!out.some(o=>o.sym===sy.sym))out.push(Object.assign({unitId:uid},sy));});
  });
  return out;
}
function symDexCardHtml(sym,real){
  const ko=S.lang==='ko',en=S.lang==='en';
  const notMet=`<div class="nm-dex-card unknown"><div class="nm-dex-flip"><div class="nm-dex-face front">
    <div class="nm-dex-sym">?</div><div class="nm-dex-read">${ko?'아직 만나지 못한 기호':en?'Not met yet':'尚未遇到的符号'}</div>
  </div></div></div>`;
  if(!real)return notMet;
  const collected=!!S.symbolDex[real.sym];
  if(!collected)return notMet.replace('nm-dex-card unknown','nm-dex-card silhouette');
  return`<div class="nm-dex-card collected" data-sym="${esc(real.sym)}">
    <div class="nm-dex-flip">
      <div class="nm-dex-face front"><div class="nm-dex-sym">${esc(real.sym)}</div><div class="nm-dex-read">${esc(symText(real.read))}</div></div>
      <div class="nm-dex-face back"><div class="nm-dex-translate">${esc(symText(real.translate))}</div><div class="nm-dex-birth">${esc(symText(real.birth))}</div></div>
    </div>
  </div>`;
}
function bindDexCards(root){
  root.querySelectorAll('.nm-dex-card.collected').forEach(el=>{
    el.onclick=()=>el.classList.toggle('flipped');
  });
}
function screenSymbolDex(){
  const scr=$('#screen');
  const ko=S.lang==='ko',en=S.lang==='en';
  const all=allUnitSymbols();
  const bySym={};all.forEach(sy=>{bySym[sy.sym]=sy;});
  const canonCards=SYMBOL_DEX_CANON.map(sym=>symDexCardHtml(sym,bySym[sym])).join('');
  const extra=all.filter(sy=>SYMBOL_DEX_CANON.indexOf(sy.sym)<0);
  const extraCards=extra.map(sy=>symDexCardHtml(sy.sym,sy)).join('');
  const collectedCount=Object.keys(S.symbolDex||{}).length;
  scr.innerHTML=`<div class="nm-gc-wrap nm-dex-wrap">
    <div class="nm-gc-header">
      <button class="nm-back" id="dexBack">← ${t('back')}</button>
      <div class="nm-gc-title">📖 ${ko?'기호 도감':en?'Symbol Dex':'符号图鉴'} <small>${collectedCount}</small></div>
    </div>
    <div class="nm-gc-body">
      <p class="nm-dex-sub">${ko?'배운 기호를 모아보세요. 카드를 탭하면 뒤집혀요.':en?"Collect the symbols you've learned — tap a card to flip it.":'收集你学过的符号——点击卡片可以翻面。'}</p>
      <div class="nm-dex-grid">${canonCards}</div>
      ${extraCards?`<div class="nm-dex-sec-h">${ko?'더 만난 기호':en?'More symbols met':'更多遇到的符号'}</div><div class="nm-dex-grid">${extraCards}</div>`:''}
    </div>
  </div>`;
  $('#dexBack').onclick=()=>{const back=S._dexFrom||'town';S._dexFrom=null;S.view=back;save();render();};
  bindDexCards(scr);
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
  const isMulti=Array.isArray(fill.answer);
  if(isMulti)ensureMultiState(fill.answer,fill.answerShape);
  const shapeCls=isMulti&&fill.answerShape?' nm-multi-shape':'';
  body.innerHTML=`<div class="nm-card">
    <div class="nm-card-h">✅ ${t('checkTitle')}</div>
    <div class="nm-fill"><span data-tex="${esc(fill.tex)}"></span></div>
    <div class="nm-numpad-screen${isMulti?' nm-multi':''}${shapeCls}" id="pscreen">${isMulti?multiScreenHtml():'&nbsp;'}</div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-hint" id="fhint"></div>
  </div>`;
  renderMath(body);
  if(isMulti)bindMultiBoxes($('#pscreen'));
  buildNumpad($('#pad'),val=>{
    if(val==='ok'){
      if(isMulti){
        if(!multiIsFull())return;
        if(multiEquals(fill.answer)){
          toast(t('correct'),true);numiHappy();
          S.sub.fi++;S.sub.mvals=null;
          if(S.sub.fi>=c.fills.length){markStepDone(S.unit,'check');S.sub={};setTimeout(()=>openQuestion(body,u),700);}
          else setTimeout(()=>stepCheck(body,u),700);
        }else{toast(t('tryAgain'),false);$('#fhint').textContent='💡 '+L(fill.hint);multiClear(fill.answer);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);}
        return;
      }
      const inp=S.sub.inp||'';if(inp===''||inp==='-')return;
      if(parseFloat(inp)===fill.answer){
        toast(t('correct'),true);numiHappy();
        S.sub.fi++;S.sub.inp='';
        if(S.sub.fi>=c.fills.length){markStepDone(S.unit,'check');S.sub={};setTimeout(()=>openQuestion(body,u),700);}
        else setTimeout(()=>stepCheck(body,u),700);
      }
      else{toast(t('tryAgain'),false);$('#fhint').textContent='💡 '+L(fill.hint);S.sub.inp='';$('#pscreen').textContent=' ';}
      return;}
    if(isMulti){applyMultiKey(val);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
    else if(val==='-')S.sub.inp=applyMinusKey(S.sub.inp||'');
    else if((S.sub.inp||'').replace('-','').length<6&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
  },{decimal:isMulti?fill.answer.some(a=>!Number.isInteger(a)):!Number.isInteger(fill.answer),negative:!!fill.negative});
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
  const origTexHtml=cur.tex?labExprHtml(cur.tex):'';
  /* steps(단계 카드) 위젯은 세로 공간을 많이 쓰므로 모바일 압축용 클래스를 단다 */
  body.innerHTML=`<div class="nm-dialog${cur.widget==='steps'?' steps-mode':''}">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    ${origTexHtml?`<div class="nm-lab-orig"><span class="nm-lab-orig-lbl">${origLbl}</span>${origTexHtml}</div>`:''}
    <div class="nm-bubble">${first?esc(L(cfg.intro)):esc(L(cur.prompt))}</div>
    <div id="labWidget" class="nm-lab-widget"></div>
    <div class="nm-memo-wrap"><label>📝</label><input type="text" class="nm-memo" placeholder="메모…" autocomplete="off" spellcheck="false"></div>
  </div>`;
  S.sub.labStarted=true;
  renderMath(body);
  say(first?L(cfg.intro):L(cur.prompt));
  NM_WIDGETS.render(cur,$('#labWidget'),val=>{
    if(+val===cur.answer){
      playSfx("success");voiceLine(u,u.voice.correct,true);numiHappy();
      S.sub.li++;S.sub.cur=null;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep(afterLabKey(u)),700);return;}
      S.sub.cur=genProblem(u.lab,'main');save();
      setTimeout(()=>stepLab(body,u),650);
    }else{
      voiceLine(u,u.voice.wrong,false);
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
/* 문제 수식 표시: 빈칸(\square)이 이미 들어 있는 수식은 원문 그대로 —
   구식 split('=') 규칙은 등호가 여러 개인 중·고등 수식을 첫 등호에서 잘라버린다 */
function labDisplayTex(tex){
  if(!tex)return '';
  return /\\square/.test(tex) ? tex : `${tex.split('=')[0].trim()} = \\square`;
}
/* 긴 문제 수식은 ⟹(\Rightarrow)에서 줄을 갈라 두 줄로 중앙 정렬 —
   좁은 화면에서 'f'(x) =' 뒤에서 어색하게 꺾이는 것 방지(원장 지시: 줄 맞춰) */
function labExprHtml(tex){
  const d=labDisplayTex(tex);
  const parts=d.split(/\\;?\\Rightarrow\\;?/);
  if(parts.length<2)return `<span data-tex="${esc(d)}"></span>`;
  return parts.map((pt,i)=>`<span class="nm-expr-line" data-tex="${esc((i?'\\Rightarrow\\; ':'')+pt.trim())}"></span>`).join('');
}
function stepLabNumpad(body,u){
  const cfg=u.lab;const need=cfg.count||4;
  S.sub.li=S.sub.li||0;
  const cur=S.sub.cur;const first=S.sub.li===0&&!S.sub.labStarted;
  const isMulti=Array.isArray(cur.answer);
  if(isMulti)ensureMultiState(cur.answer,cur.answerShape);
  const shapeCls=isMulti&&cur.answerShape?' nm-multi-shape':'';
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble">${first?esc(L(cfg.intro)):esc(L(cur.prompt))}</div>
    <div class="nm-lab-expr">${labExprHtml(cur.tex)}</div>
    <div class="nm-numpad-screen${isMulti?' nm-multi':''}${shapeCls}" id="pscreen">${isMulti?multiScreenHtml():'&nbsp;'}</div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-memo-wrap"><label>📝</label><input type="text" class="nm-memo" placeholder="메모…" autocomplete="off" spellcheck="false"></div>
    <div class="nm-hint">${t('numpadHint')}</div>
  </div>`;
  S.sub.labStarted=true;
  renderMath(body);
  if(isMulti)bindMultiBoxes($('#pscreen'));
  say(first?L(cfg.intro):L(cur.prompt));
  const decAny=isMulti?cur.answer.some(a=>!Number.isInteger(a)):!Number.isInteger(cur.answer);
  buildNumpad($('#pad'),val=>handleLabNumpad(val,body,u),{decimal:decAny,negative:!!cur.negative});
}
function handleLabNumpad(val,body,u){
  const cur=S.sub.cur;const need=u.lab.count||4;
  const isMulti=Array.isArray(cur.answer);
  if(val==='ok'){
    if(isMulti){
      if(!multiIsFull())return;
      if(multiEquals(cur.answer)){
        playSfx("success");voiceLine(u,u.voice.correct,true);numiHappy();
        S.sub.li++;S.sub.mvals=null;S.sub.cur=null;
        if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep(afterLabKey(u)),700);return;}
        S.sub.cur=genProblem(u.lab,'main');save();
        setTimeout(()=>stepLab(body,u),650);
      }else{voiceLine(u,u.voice.wrong,false);multiClear(cur.answer);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);}
      return;
    }
    const inp=S.sub.inp||'';if(inp===''||inp==='-')return;
    if(parseFloat(inp)===cur.answer){
      playSfx("success");voiceLine(u,u.voice.correct,true);numiHappy();
      S.sub.li++;S.sub.inp='';S.sub.cur=null;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep(afterLabKey(u)),700);return;}
      S.sub.cur=genProblem(u.lab,'main');save();
      setTimeout(()=>stepLab(body,u),650);
    }else{voiceLine(u,u.voice.wrong,false);S.sub.inp='';$('#pscreen').textContent=' ';}
    return;
  }
  if(isMulti){applyMultiKey(val);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);return;}
  if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
  else if(val==='-')S.sub.inp=applyMinusKey(S.sub.inp||'');
  else if((S.sub.inp||'').replace('-','').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
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
      playSfx("success");voiceLine(u,u.voice.correct,true);numiHappy();
      p.forEach(x=>{const e=document.querySelector(`.nm-tile[data-i="${x.i}"]`);if(e){e.classList.remove('sel');e.classList.add('paired');}});
      S.sub.li++;S.sub.cur=null;
      const need=u.lab.count||4;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');setTimeout(()=>gotoStep(afterLabKey(u)),800);return;}
      setTimeout(()=>stepLab(body,u),900);
    }else{voiceLine(u,u.voice.wrong,false);p.forEach(x=>{const e=document.querySelector(`.nm-tile[data-i="${x.i}"]`);if(e)e.classList.remove('sel');});S.sub.picked=[];pk.disabled=true;}
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
  const isMulti=Array.isArray(cur.answer);
  if(isMulti)ensureMultiState(cur.answer,cur.answerShape);
  const shapeCls=isMulti&&cur.answerShape?' nm-multi-shape':'';
  body.innerHTML=`<div class="nm-arena">
    <div class="nm-arena-top"><span class="nm-arena-q">${S.sub.ai+1} / ${need}</span><span class="nm-arena-time" id="atime">${fmt(S.sub.left)}</span></div>
    <div class="nm-arena-expr">${labExprHtml(cur.tex)}</div>
    <div class="nm-numpad-screen${isMulti?' nm-multi':''}${shapeCls}" id="pscreen">${isMulti?multiScreenHtml():'&nbsp;'}</div>
    <div class="nm-numpad" id="pad"></div>
  </div>`;
  renderMath(body);
  if(isMulti)bindMultiBoxes($('#pscreen'));
  const decAny=isMulti?cur.answer.some(a=>!Number.isInteger(a)):!Number.isInteger(cur.answer);
  buildNumpad($('#pad'),val=>{
    if(val==='ok'){
      if(isMulti){
        if(!multiIsFull())return;
        if(multiEquals(S.sub.cur.answer)){S.sub.score++;numiHappyToast();}else toast('✗',false);
        S.sub.mvals=null;S.sub.ai++;
        if(S.sub.ai>=need){clearInterval(window._nmTimer);arenaEnd(body,u);return;}
        nextArena(body,u,need);return;
      }
      const inp=S.sub.inp||'';if(inp===''||inp==='-')return;
      if(parseFloat(inp)===S.sub.cur.answer){S.sub.score++;numiHappyToast();}else toast('✗',false);
      S.sub.ai++;
      if(S.sub.ai>=need){clearInterval(window._nmTimer);arenaEnd(body,u);return;}
      nextArena(body,u,need);return;}
    if(isMulti){applyMultiKey(val);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
    else if(val==='-')S.sub.inp=applyMinusKey(S.sub.inp||'');
    else if((S.sub.inp||'').replace('-','').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
  },{decimal:decAny,negative:!!cur.negative});
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
  let newLineageBadge=null;
  if(!already){coinAdd(s.coins||20);S.progress[S.unit]=S.progress[S.unit]||{steps:{}};S.progress[S.unit].done=true;
    S.progress[S.unit].steps=S.progress[S.unit].steps||{};S.progress[S.unit].steps.stamp=true; /* 로드맵 별점이 stepDone('stamp')를 보므로 반드시 기록(기존 누락 버그 수정) */
    S.progress[S.unit].touchedAt=Date.now();save();
    newLineageBadge=checkLineageCompletion();}
  const evo=lineageEvoCardHtml(S.unit);
  body.innerHTML=`<div class="nm-card center stamp">
    <div class="nm-stamp-seal">🏅</div>
    <div class="nm-card-h">${t('stampGet')}</div>
    <div class="nm-stamp-label">${L(s.label)}</div>
    <div class="nm-stamp-coins">🪙 +${s.coins||20} ${t('coins')}</div>
    ${evo}
    <button class="nm-btn full" id="toMap">${t('toMap')} →</button>
  </div>`;
  confetti();playSfx("great-job");say(L(u.voice.finish));
  bindLineageEvoCard(body);
  $('#toMap').onclick=exitUnit;
  if(newLineageBadge)setTimeout(()=>showLineageBadgeOverlay(newLineageBadge),700);
}

/* ---------- 공통 UI 조각 ---------- */
function buildNumpad(pad,cb,opts){
  opts=opts||{};
  pad.innerHTML='';
  const keys=opts.decimal&&opts.negative
    ?['1','2','3','4','5','6','7','8','9','.','-','0','del','ok']
    :opts.decimal
    ?['1','2','3','4','5','6','7','8','9','.','0','del','ok']
    :opts.negative
    ?['1','2','3','4','5','6','7','8','9','-','0','del','ok']
    :['1','2','3','4','5','6','7','8','9','del','0','ok'];
  /* 소수·음수 어느 쪽이든 4열 레이아웃(기존 .dec CSS 재사용) */
  if(opts.decimal||opts.negative) pad.classList.add('dec'); else pad.classList.remove('dec');
  keys.forEach(k=>{
    const b=document.createElement('button');b.className='nm-key'+(k==='ok'?' ok':k==='del'?' del':k==='.'?' dot':k==='-'?' neg':'');
    b.textContent=k==='del'?'←':k==='ok'?'✓':k==='-'?'−':k;b.onclick=()=>cb(k);pad.appendChild(b);
  });
}
/* 선두 - 1회만 허용: 빈칸→'-', 이미 '-'뿐이면 취소. 숫자 입력은 그대로. */
function applyMinusKey(inp){ return inp===''?'-':(inp==='-'?'':inp); }

/* ── 다칸 답(배열 answer) 공용 헬퍼 — practice/check/lab/arena 넘패드 공용 ──
   S.sub.mvals(문자열 배열)+S.sub.mfocus(포커스 idx)+S.sub.mshape(answerShape)로
   상태 보관(save() 직렬화 안전). answerArr 길이만큼 mvals를 초기화하고,
   화면 HTML과 탭 바인딩을 제공한다. shape 렌더는 widgets.js의 multiBoxesHtml을
   공유해 두 화면(이 파일·widgets.js renderFallback)의 분수 모양이 갈라지지 않게 한다. */
function ensureMultiState(answerArr, shape){
  if(!Array.isArray(S.sub.mvals)||S.sub.mvals.length!==answerArr.length||S.sub.mshape!==shape){
    S.sub.mvals=answerArr.map(()=>'');S.sub.mfocus=0;S.sub.mshape=shape;
  }
}
function multiScreenHtml(){
  const vals=S.sub.mvals,focus=S.sub.mfocus,shape=S.sub.mshape;
  if(window.NM_WIDGETS&&NM_WIDGETS.multiBoxesHtml)return NM_WIDGETS.multiBoxesHtml(vals,focus,shape);
  return vals.map((v,i)=>`<span class="nm-ans-box${i===focus?' cur':''}" data-i="${i}">${v!==''?esc(v):'?'}</span>`)
    .join('<span class="nm-ans-sep">,</span>');
}
function bindMultiBoxes(screenEl){
  screenEl.querySelectorAll('.nm-ans-box').forEach(b=>{
    b.addEventListener('pointerup',e=>{e.stopPropagation();S.sub.mfocus=+b.dataset.i;screenEl.innerHTML=multiScreenHtml();bindMultiBoxes(screenEl);});
  });
}
function applyMultiKey(val){
  const vals=S.sub.mvals;let cur=vals[S.sub.mfocus];
  if(val==='del'){ cur=''; }
  else if(val==='-'){ cur=applyMinusKey(cur); }
  else if(val==='.'){ if(!cur.includes('.'))cur+='.'; }
  else if(cur.replace('-','').length<6){ cur+=val; }
  vals[S.sub.mfocus]=cur;
}
function multiIsFull(){ return S.sub.mvals.every(v=>v!==''&&v!=='-'); }
function multiEquals(answerArr){ return S.sub.mvals.length===answerArr.length&&S.sub.mvals.every((v,i)=>parseFloat(v)===answerArr[i]); }
function multiClear(answerArr){ S.sub.mvals=answerArr.map(()=>'');S.sub.mfocus=0; }
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
  <div id="nm-account-slot"></div>
  <div id="nm-closet-cnt" class="nm-step-body" style="padding:0"></div>`;
  $('#backCloset').onclick=()=>{S.view='town';save();render();};
  renderIdCard();
  renderAccountCard();
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

/* ---------- 승인번호 카드 (옷장, Phase 2B) ----------
   설정/프로필 화면 쪽 코드 입력 지점. 게이트 모달과 로직(applyAccountCode)을 공유. */
function renderAccountCard(){
  const slot=$('#nm-account-slot');
  if(!slot)return;
  const ko=S.lang==='ko', en=S.lang==='en';
  const acc=S.account||{status:'trial'};
  if(acc.status==='active'){
    slot.innerHTML=`<div class="nm-idcard linked">🔓 ${ko?'학원 승인 완료':en?'Academy approved':'学院已授权'}${acc.code?` · <b>${esc(acc.code)}</b>`:''} · ${ko?'모든 유닛 이용 가능':en?'All units unlocked':'全部单元已解锁'} ✓</div>`;
    return;
  }
  slot.innerHTML=`<div class="nm-idcard">
    <div class="nm-idcard-t">🔒 ${ko?'체험 모드':en?'Trial mode':'体验模式'}</div>
    <div class="nm-idcard-row">
      <input id="accCode" maxlength="24" placeholder="${ko?'승인번호 입력':en?'Enter code':'输入授权码'}" autocomplete="off">
      <button class="nm-btn" id="accSubmit">${ko?'확인':en?'Apply':'确认'}</button>
    </div>
    <div class="nm-idcard-msg" id="accMsg">${ko?'학원에서 받은 승인번호를 입력하면 모든 유닛·편지함·인쇄가 열려요.':en?'Enter the code from your academy to unlock every unit, the mailbox, and printing.':'输入学院提供的授权码即可解锁全部单元、信箱与打印。'}</div>
  </div>`;
  $('#accCode').addEventListener('keydown',e=>{if(e.key==='Enter')submitAcc();});
  $('#accSubmit').onclick=submitAcc;
  async function submitAcc(){
    const inp=$('#accCode'),msg=$('#accMsg'),btn=$('#accSubmit');
    const code=(inp.value||'').trim();
    if(!code){msg.textContent=ko?'코드를 입력해 주세요.':en?'Please enter a code.':'请输入授权码。';return;}
    btn.disabled=true;
    msg.textContent=ko?'확인 중…':en?'Checking…':'检查中…';
    const res=await applyAccountCode(code);
    btn.disabled=false;
    if(res.ok){
      toast(ko?'승인 완료! 모두 열렸어요 ✨':en?'Approved! Everything is unlocked ✨':'授权成功，全部解锁 ✨',true);
      renderAccountCard();
    }else if(res.reason==='network'){
      msg.textContent=ko?'연결에 실패했어요. 잠시 후 다시 시도해 주세요.':en?'Connection failed — try again soon.':'连接失败，请稍后重试。';
    }else{
      msg.textContent=ko?'코드를 확인해 주세요.':en?'Please check your code.':'请确认授权码。';
    }
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
  /* 학습지 인쇄도 같은 게이트(§10) */
  if(!accountActive()){
    const ko=S.lang==='ko', en=S.lang==='en';
    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="backExam">${t('back')}</button>
      <div class="nm-unit-title">📝 ${ko?'학습지 & 시험':en?'Worksheet & Exam':'学习单 & 考试'}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap">
      <div class="nm-card nm-gate-card-inline">
        <div class="nm-card-h">🔒 ${ko?'학습지 인쇄는 학원 승인 후 열려요':en?'Worksheet printing unlocks after academy approval':'学院授权后才能打印学习单'}</div>
        <p class="nm-wsh-sentence">${ko?'승인번호가 있으면 지금 바로 열 수 있어요.':en?'If you already have a code, you can unlock it right now.':'有授权码即可立即解锁。'}</p>
        <button class="nm-btn full" id="examGate">🔑 ${ko?'승인번호 입력':en?'Enter code':'输入授权码'}</button>
      </div>
    </div>`;
    $('#backExam').onclick=()=>{S.view='town';save();render();};
    $('#examGate').onclick=showGateModal;
    return;
  }
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

/* ============================================================
   학습지 도우미 화면 (?ws=<학습지ID>) — 과정-로드맵.md §11
   QR로 열리는 독립 화면. 학생 선택/로그인 프로필 없이도 동작한다(부모가 찍는 시나리오
   전제). S(로컬 프로필)에는 남기지 않는 URL 기반 임시 상태라 wsHelperId는 전역 let.
   ID의 스레드 프리픽스(threads.js 키)로 유형을 찾고, 시드가 ID 안에 그대로 있어서
   나중에(Phase 2) 같은 ID로 문항을 다시 만들어 채점 화면을 열 수 있다. */
let wsHelperId = (function(){
  try{ return new URLSearchParams(location.search).get('ws') || null; }catch(e){ return null; }
})();

function exitWsHelper(){
  wsHelperId = null;
  try{ history.replaceState(null,'',location.pathname); }catch(e){}
}

function screenWorksheetHelper(wsId){
  const scr = $('#screen');
  const canParse = window.NM_EXAM && NM_EXAM.parseWorksheetCode && NM_EXAM.resolveConceptUnit;
  const cfg = canParse ? NM_EXAM.parseWorksheetCode(wsId) : null;
  const info = (cfg && (window.NM_THREADS||{})[cfg.thread]) ? NM_EXAM.resolveConceptUnit(cfg.thread, cfg.level) : null;
  const th = info && info.thread;
  const ko=S.lang==='ko', en=S.lang==='en';

  let bodyHtml;
  if(!cfg || !th){
    bodyHtml = `<div class="nm-card">
      <div class="nm-card-h">📄 ${esc(wsId)}</div>
      <p class="nm-wsh-warn">${ko?'이 학습지 ID를 알아볼 수 없어요. 학습지에 인쇄된 코드를 다시 확인해 주세요.':en?"We couldn't recognize this worksheet ID — please check the code printed on the sheet.":'无法识别这个学习单编号，请重新确认单子上印的代码。'}</p>
    </div>`;
  } else {
    const u = info.unit; // {..., discover} 또는 null
    const conceptBody = u
      ? `<div class="nm-wsh-unit-title">${esc(L(u.title))}</div>
         ${(u.discover.stages||[]).slice(0,1).map(s=>`<p class="nm-wsh-sentence">${L(s.desc)}</p>`).join('')}`
      : (th.concept
          ? `<p class="nm-wsh-sentence">${esc(L(th.concept))}</p>`
          : /* 개념 노트가 없는 유형(초등 대부분)에서 이 화면이 "준비되지 않았어요"
               한 줄짜리 막다른 길이었다 — QR을 찍은 학부모가 아무것도 못 한다.
               적어도 이 학습지가 무엇인지와 다시 만드는 방법은 알려 준다.
               2026-08-28. */
            `<p class="nm-wsh-sentence nm-wsh-noconcept">${ko?'이 유형은 아직 개념 설명이 준비되지 않았어요.':en?'A concept note for this type is not ready yet.':'这个类型的概念说明还没准备好。'}</p>
             <p class="nm-wsh-sentence">${ko?'학습지에 인쇄된 코드를 문제은행에 넣으면 같은 문제를 다시 풀거나 인쇄할 수 있어요.':en?'Enter the code printed on the sheet in the problem bank to redo or reprint the same worksheet.':'把单子上印的代码输入题库，就能重做或重新打印同一份学习单。'}</p>
             <a class="nm-btn full nm-wsh-bank" href="drill.html">${ko?'📚 문제은행 열기':en?'📚 Open problem bank':'📚 打开题库'}</a>`);
    const ruleBox = (u && u.discover && u.discover.rule)
      ? `<div class="nm-rule"><b>${t('ruleLabel')}</b><p>${esc(L(u.discover.rule))}</p></div>` : '';
    const unitBtn = info.unitId
      ? (S.onboarded
          ? `<button class="nm-btn full" id="wshGoUnit">${ko?'✨ 이 마법 배우러 가기':en?'✨ Go learn this magic':'✨ 去学这个魔法'}</button>`
          : `<p class="nm-wsh-login-hint">${ko?'앱에서 로그인(캐릭터 선택) 후 이용해 주세요.':en?'Please log in (pick a character) on the app first.':'请先在应用中登录（选择角色）后使用。'}</p>`)
      : '';
    bodyHtml = `<div class="nm-card">
      <div class="nm-card-h">📄 ${esc(wsId)}</div>
      <div class="nm-wsh-name">${esc(L(th.name))}</div>
      ${conceptBody}
      ${ruleBox}
      ${unitBtn}
    </div>`;
  }

  scr.innerHTML = `<div class="nm-unit-bar">
    <button class="nm-back" id="wshBack">${t('back')}</button>
    <div class="nm-unit-title">${ko?'학습지 도우미':en?'Worksheet Helper':'学习单助手'}</div>
  </div>
  <div class="nm-step-body nm-wsh-wrap">${bodyHtml}</div>`;

  $('#wshBack').onclick = () => { exitWsHelper(); render(); };
  const goBtn = $('#wshGoUnit');
  if(goBtn) goBtn.onclick = () => {
    exitWsHelper();
    S.unit = info.unitId; S.step = null; S.sub = {}; S.tierId = null; S.view = 'unit'; S._fromRoadmap = false;
    save(); render();
  };
  renderMath(scr);
}

/* 타이틀 화면 게이트(§14) — "인트로 애니메이션 후"를 이 앱에서는 about.html이
   ?enter=1을 달고 돌아오는 순간으로 본다(index.html의 기존 인트로→about 흐름,
   되돌리지 않음). 진행 기록(mostRecentTouchedUnit)이 있는 온보딩된 프로필에서만
   S.view를 'title'로 바꾼다 — save()는 하지 않는다(타이틀은 저장 상태가 아니라
   "이번 진입"에서만 한 번 보이는 화면이라, 새로고침해도 URL에 enter=1이 없으면
   바로 이전 화면으로 돌아간다). 신규 설치·진행 없음은 그대로 온보딩→마을. */
function maybeShowTitle(){
  if(!S.onboarded) return;
  if(!/[?&]enter=1\b/.test(location.search)) return;
  if(!mostRecentTouchedUnit()) return;
  S.view='title';
}
/* ---------- 시작 ---------- */
function boot(){
  if(!GEN||!CUR||!UNITS){app.innerHTML='<p style="padding:40px;text-align:center">데이터 로딩 실패 — 스크립트 순서를 확인하세요.</p>';return;}
  maybeShowTitle();
  render();
  reverifyAccountIfNeeded(); // 승인번호 회수 동기화 — 실패해도 조용히 무시(오프라인에서 안 잠금)
}
if(window.katex)boot(); else{const t2=setInterval(()=>{if(window.katex){clearInterval(t2);boot();}},60);setTimeout(()=>{if(!window.katex)boot();},1500);}
})();
