/* ============================================================
   Numbers of Magic — 본체 엔진 (app/main.js)
   reading-world 아키텍처 미러링(상태/저장/i18n t()/STEP flow).
   의존: window.NM_GEN, NM_CURRICULUM, NM_UNITS, katex
   흐름: 살아있는 마을(드래그/줌+구름/분수/숫자친구, 건물 클릭)
        → 등급 유닛목록 → 유닛[프랙티스→디스커버→핵심체크→랩→아레나→도장]
   진단 스킵(B안): 프랙티스 진입 시 "바로 넘어갈래? / 한번 볼래?"
   ============================================================ */
(async()=>{
'use strict';
if(!window.NM_ENTRY||window.NM_ENTRY.mode==='blocked'){
  if(!window.NM_ENTRY)location.replace('access.html');
  return;
}
// Review is a separately authenticated, learning-only session. A URL/local flag
// alone never activates it; failed verification returns to the login page.
const reviewRequested=new URLSearchParams(location.search).get('review')==='1';
if(reviewRequested&&NM_ENTRY.mode!=='review'){location.replace('access.html');return;}
const review=reviewRequested&&window.NM_REVIEW_SESSION?await NM_REVIEW_SESSION.ready():null;
if(reviewRequested&&!review){location.replace('access.html?reason=expired');return;}
const REVIEW=!!review;
if(REVIEW)NM_REVIEW_SESSION.guard();
const app=document.getElementById('app');
const GEN=window.NM_GEN, CUR=window.NM_CURRICULUM, UNITS=window.NM_UNITS;
const membership=REVIEW?null:window.NM_MEMBERSHIP;

/* NM_TGEN 브리지: 레거시 NM_GEN + 스레드 생성기(NM_TGEN) 통합. params 전달 포함. */
function genProblem(cfg, level){
  const key=cfg.generator;
  const g=(GEN||{})[key];
  /* NM_GEN(레거시)도 cfg.params를 받게 한다(2026-09-09, C-02 곱해서 10 만들기를
     pairMul(targets:[10])로 묶으려면 필요) — 전엔 NM_TGEN만 params를 받아서
     A/B권 유닛(NM_GEN)은 어떤 params를 적어도 조용히 무시됐다. 기존 유닛 중
     NM_GEN 생성기에 params를 적어 둔 곳이 없어(전수 확인) 동작이 안 바뀐다. */
  if(g) return g(Object.assign({level},cfg.params||{}));
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
    skipAsk:'이미 배운 내용인가요?', skipYes:'다음 단계로 가기', skipNo:'먼저 배워 보기',
    ruleLabel:'마법의 규칙', tryAgain:'다시 해볼까?', correct:'정답!',
    checkTitle:'핵심 체크', openTitle:'생각해 보기', submit:'확인', myAnswer:'내 생각 적어보기(선택)',
    arenaGo:'배틀 시작!', timeUp:'시간 종료!', score:'점수', stampGet:'도장 획득!',
    doneUnit:'학습 단원 완료!', toMap:'마을로', numpadHint:'숫자를 눌러 답해요', pairHint:'짝꿍 두 수를 골라요',
    picked:'골랐어요!', langName:'한국어', onePairMore:'정답! 하나 더 있어',
    obTitle:'나만의 숫자 친구', obSub:'캐릭터를 고르고 이름을 알려주세요!',
    obNamePh:'이름을 적어주세요', obGo:'짜잔! 시작하기 ✨', obNeedName:'사용할 이름을 입력해 주세요.',
    obWelcome:n=>`환영해요, ${n}!`, titleCourse:'과정' },
  en:{ appName:'Numbers of Magic', start:'Start', back:'← Back', next:'Next →',
    coins:'Numi Coins', locked:'Coming soon', enter:'Enter', mapTitle:'Magic Number Town',
    skipAsk:'Already good at this?', skipYes:'Skip ahead!', skipNo:"Let's see it",
    ruleLabel:'Magic Rule', tryAgain:'Try again?', correct:'Correct!',
    checkTitle:'Key Check', openTitle:'Think about it', submit:'Check', myAnswer:'Write your idea (optional)',
    arenaGo:'Start Battle!', timeUp:"Time's up!", score:'Score', stampGet:'Stamp earned!',
    doneUnit:'Unit complete!', toMap:'To Town', numpadHint:'Tap numbers to answer', pairHint:'Pick two that make the target',
    picked:'Picked!', langName:'English', onePairMore:'Correct! One more to find',
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
    picked:'选好了！', langName:'中文', onePairMore:'答对了！还有一对',
    obTitle:'我的数字朋友', obSub:'选一个角色，告诉我你的名字！',
    obNamePh:'请输入名字', obGo:'哇！开始吧 ✨', obNeedName:'请先告诉我你的名字！',
    obWelcome:n=>`欢迎，${n}！`, titleCourse:'课程' }
};
/* ---------- 나이·진도 적응형 밴드 (적응형-타이포-말투-설계.md) ----------
   인쇄의 printAgeBand(young/mid/senior)와 같은 3밴드를 앱 화면·말투에 확장.
   나이 입력 없이 연산 진도(현재 과정의 티어)로 판정 — render()가 매번 갱신. */
let NM_BAND='young';
function computeBand(){
  try{
    const recent=mostRecentTouchedUnit();
    if(recent&&/^N-/.test(recent))return 'young';       // 유아 유닛 진행 중
    const c=(window.NM_COURSES||{})[currentCourseKey()];
    if(c){
      if(c.tier==='level0')return 'young';              // 수의 나라(과정 0)
      if(c.tier==='level2')return 'mid';
      if(c.tier&&c.tier!=='level1')return 'senior';     // level3·경시의 탑
    }
  }catch(e){}
  return 'young';
}
/* ============================================================
   학령(school age) — 원장 지시 2026-09-16
   "나이도 입력해야 돼 … 초1 8월 정도라면 중등 연산 열려도 되지만 그 전에는
    무리일 수 있어. 열리더라도 안내 정도는 해야 돼. 고등은 초3 3월"
   ------------------------------------------------------------
   왜 학년을 그대로 저장하지 않는가: 3월이 지나면 틀린 값이 된다. 바뀌지 않는
   기준은 "초1 3월에 들어간 해" 하나뿐이라 그것만 저장하고(S.schoolAge.entryYear)
   학년·학령개월은 오늘 날짜에서 매번 계산한다. 학기는 3월 시작으로 센다.
   학령개월 0 = 초1 3월. 그래서 초1 8월 = 5, 초3 3월 = 24.
   ============================================================ */
/* 오늘이 속한 학년도(3월 시작). 1·2월은 아직 앞 학년도다. */
function academicYearNow(d){ d=d||new Date(); const y=d.getFullYear(); return (d.getMonth()+1)>=3?y:y-1; }
/* 3월=0 … 2월=11 */
function academicMonthIdx(d){ d=d||new Date(); const m=d.getMonth()+1; return (m-3+12)%12; }
/* 학년(초1=1 … 초6=6, 중1=7 … 중3=9, 고1=10 … 고3=12). 1 미만이면 미취학. */
function schoolGradeNum(d){
  const sa=S.schoolAge;
  if(!sa||!sa.entryYear) return null;
  return academicYearNow(d)-sa.entryYear+1;
}
/* 학령개월 — 초1 3월을 0으로 센다. 미취학이면 음수. */
function schoolMonths(d){
  const g=schoolGradeNum(d);
  if(g==null) return null;
  return (g-1)*12 + academicMonthIdx(d);
}
/* 사람이 읽는 학년 이름. 미취학은 학년 대신 "미취학"으로만 적는다 — 몇 살인지는
   묻지 않았으므로 지어내지 않는다. */
function schoolGradeLabel(d){
  const g=schoolGradeNum(d);
  if(g==null) return null;
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  if(g<1) return lk('미취학','Preschool','学龄前');
  if(g<=6) return lk('초'+g,'Grade '+g,'小'+g);
  if(g<=9) return lk('중'+(g-6),'Grade '+g,'初'+(g-6));
  if(g<=12) return lk('고'+(g-9),'Grade '+g,'高'+(g-9));
  return lk('졸업','Graduated','已毕业');
}
/* "초1 8월"처럼 학년과 달을 같이 — 안내 문구가 기준을 말할 때 쓴다. */
function schoolNowLabel(d){
  d=d||new Date();
  const g=schoolGradeLabel(d);
  if(!g) return null;
  const m=d.getMonth()+1;
  const ko=S.lang==='ko', en=S.lang==='en';
  return ko?`${g} ${m}월`:en?`${g}, month ${m}`:`${g} ${m}月`;
}
/* 학령개월 → "초1 8월" 꼴. 기준선을 사람 말로 적는 데 쓴다. */
function schoolMonthsLabel(mo){
  const ko=S.lang==='ko', en=S.lang==='en';
  const g=Math.floor(mo/12)+1;
  const month=((mo%12)+2)%12+1;   // 학년도 0번째 달 = 3월
  const gl=g<=6?(ko?'초'+g:en?'Grade '+g:'小'+g)
          :g<=9?(ko?'중'+(g-6):en?'Grade '+g:'初'+(g-6))
          :(ko?'고'+(g-9):en?'Grade '+g:'高'+(g-9));
  return ko?`${gl} ${month}월`:en?`${gl}, month ${month}`:`${gl} ${month}月`;
}
/* 인쇄용 학년 키 — exam.js printAgeBand가 앞 글자로 나이 밴드를 정한다('1'·'2' → young, '3'·'4' → mid).
   미취학은 '1'로(초1과 같은 크기), 학년을 모르면 undefined(학습지가 문항으로 추정). */
function printGradeKey(){
  const g=schoolGradeNum();
  if(g==null) return undefined;
  return String(Math.max(1, Math.min(12, g)));
}
window.NM_PRINT_GRADE=printGradeKey;
/* 학년을 고르면 입학 연도로 환산해 저장 — 고른 학년은 "지금" 기준이다. */
function setSchoolGrade(gradeNum,birthYear){
  const birth=Number(birthYear||S.schoolAge?.birthYear)||null;
  S.schoolAge={...(birth?{birthYear:birth}:{}),
    entryYear:gradeNum<1&&birth?Math.max(academicYearNow()+1,birth+7):academicYearNow()-(gradeNum-1),setAt:Date.now()};
}
/* 실제 학년 목록. 미취학은 0이며 출생연도로 입학 연도를 정한다. */
function schoolGradeOptions(){
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const out=[{g:0,label:lk('미취학','Preschool','学龄前')}];
  for(let i=1;i<=6;i++) out.push({g:i,label:lk('초'+i,'G'+i,'小'+i)});
  for(let i=1;i<=3;i++) out.push({g:6+i,label:lk('중'+i,'G'+(6+i),'初'+i)});
  for(let i=1;i<=3;i++) out.push({g:9+i,label:lk('고'+i,'G'+(9+i),'高'+i)});
  return out;
}

/* 자릿값 색 힌트를 줄 대상인가 (2026-09-16 원장 "어린 아이들은 자릿수의 개념이 없어서").
   기준은 학령 24개월(초3 3월) 미만 — 원장이 고등 기준선으로 준 그 자리를 그대로 쓴다.
   학년을 모르면 진도로 대신 본다(NM_BAND가 young이면 어린 쪽으로 친다). */
function placeHintWanted(){
  const mo=schoolMonths();
  if(mo==null) return NM_BAND==='young';
  return mo<24;
}

/* ── 티어별 권장 학령 (원장이 준 두 기준선만 쓴다 — 나머지는 지어내지 않는다) ──
   중등 연산 = 초1 8월(5) · 고등 = 초3 3월(24).
   이건 잠금이 아니다. 로드맵은 어떤 과정도 잠그지 않는다는 원칙 그대로이고,
   여기서 하는 일은 "열리더라도 안내 정도는 해야 돼"에 해당하는 안내뿐이다. */
const TIER_READY_MONTHS={ middle1:5, middle2:5, middle3:5,
  highmath1:24, highmath2:24, algebra:24, calculus1:24 };
/* 이 티어에 대해 지금 학령이 기준선을 넘었는가.
   null = 기준선이 없는 티어이거나 학령을 아직 모름(=안내할 근거가 없음). */
function tierReadiness(tierKey){
  const need=TIER_READY_MONTHS[tierKey];
  if(need==null) return null;
  const have=schoolMonths();
  if(have==null) return {need, have:null, ready:false, unknown:true};
  return {need, have, ready:have>=need, unknown:false};
}
/* 안내 문구 한 덩어리 — 과정 시트와 티어 표지가 같은 말을 쓰게 한 곳에서 만든다.
   계산만 된다고 되는 게 아니라는 것(문장제·개념 이해)이 이 안내의 요지다. */
function readinessNote(tierKey){
  const r=tierReadiness(tierKey);
  if(!r||r.ready) return null;
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const line=schoolMonthsLabel(r.need);
  if(r.unknown){
    return { kind:'unknown',
      text:lk(`이 구간은 보통 ${line}부터 권해요. 학년을 알려 주면 지금 시작해도 될지 같이 봐 드릴게요.`,
              `This stretch is usually recommended from ${line}. Tell us the grade and we can say whether now is a good time.`,
              `这一段通常建议从${line}开始。告诉我们年级，就能一起看现在是否合适。`) };
  }
  return { kind:'early',
    text:lk(`이 구간은 보통 ${line}부터 권해요. 지금은 ${schoolNowLabel()}이라 계산은 따라가더라도 문장제와 개념을 읽어 내기가 아직 벅찰 수 있어요. 시작해도 막지 않아요 — 다만 어려우면 실력이 모자라서가 아니라 아직 때가 이른 것뿐이에요.`,
            `This stretch is usually recommended from ${line}. Right now it is ${schoolNowLabel()}, so the arithmetic may keep up while the word problems and concepts are still a stretch. You can start anyway — if it feels hard, that is timing, not ability.`,
            `这一段通常建议从${line}开始。现在是${schoolNowLabel()}，计算也许跟得上，但应用题和概念的理解可能还吃力。可以开始，不会阻止——如果觉得难，那是时候未到，不是能力不足。`) };
}

/* 말투 오버레이 — ko 전용. 시스템 문자열만 바꾸고 유닛 콘텐츠는 손대지 않는다.
   young=반말·같이하자, mid=해요체(기존 I18N.ko가 이미 이 톤), senior=간결체. */
const VOICE_BANDS={
  young:{ tryAgain:'괜찮아! 한 번 더 해보자', correct:'딩동댕! 맞았어 🎉',
    timeUp:'시간이 다 됐어!', stampGet:'도장 쾅! 받았어!', doneUnit:'와, 다 했다! 최고야!',
    skipAsk:'이미 배운 내용인가요?', numpadHint:'숫자를 눌러서 답해 보자', submit:'됐어!' },
  senior:{ tryAgain:'다시 시도', correct:'정답', timeUp:'시간 종료', stampGet:'도장 획득',
    doneUnit:'학습 단원 완료', skipAsk:'이미 배운 내용인가요?', numpadHint:'숫자 입력' }
};
const t=k=>{
  if(S.lang==='ko'){const b=VOICE_BANDS[NM_BAND];if(b&&b[k]!==undefined)return b[k];}
  return (I18N[S.lang]&&I18N[S.lang][k])??I18N.ko[k]??k;
};
const L=(obj)=>obj?(obj[S.lang]??obj.ko??obj.en):'';   // 다국어 필드 픽

/* ---------- 상태 + 저장 ---------- */
// One verified login owns one learner. Account, preview and review records have
// separate keys; legacy device/slot data is only read by the migration helper.
if(!REVIEW&&!window.NM_LEARNER_STORAGE){
  document.getElementById('app').textContent='학생 기록을 불러오지 못했어요. 새로고침해 주세요.';return;
}
const stateOwnerId=REVIEW?null:(window.NM_ENTRY.guardianUserId||null);
const KEY=REVIEW?'nm_review_state_v1_'+review.username:NM_LEARNER_STORAGE.keyFor(stateOwnerId);
window.NM_STATE_KEY=KEY;
let learnerTransition=false;
/* onboarded는 defaults()에 넣지 않음(항상 undefined로 시작) —
   완전 신규 설치(hadSave===false)일 때만 온보딩을 요구하기 위한 표식.
   defaults()에 박아두면 구버전 저장본(onboarded 필드 없음)과 병합 시에도
   항상 값이 채워져 있어 "미설정" 여부를 구분할 수 없게 된다. */
function defaults(){return{ lang:'ko', view:'town', coins:0, range:'oneDigit',
  tierId:null, unit:null, step:null, sub:{}, progress:{}, name:'',
  character:{number:3,color:'blue',bg:'plain',cape:'none',hat:'none'},
  character_unlocked:{}, mailbox:{opened:{}},
  boost:{doneWeeks:{},log:[]}, /* 정체 감지→보강 루프(§2-4) 기록 — 부모 리포트용 */
  roadCadence:'w1', /* 연산 로드맵 주차 보기: 'w1'=주 1회반, 'w2'=주 2회반 */
  roadView:'road', /* 같은 연산 로드맵의 길 보기 / 그림 지도 보기 */
  /* 연산 로드맵 목표 기준(속도) — 값은 ROAD_PACES의 key.
     기본값을 '표준'(p2)으로 둔다: 처음 보는 사람에게 가장 빠른 기준의 주차를
     보여 주면 그 자체가 과약속 쪽으로 기운다(원장 지시로 넣은 "연산 트랙만
     센 주차" 단서와 같은 원칙). 더 빠른 기준을 원하면 직접 고르면 된다. */
  roadPace:'p2',
  /* 속도·양 배수(2026-09-25, 원장 "고정하고 속도 양 조절하기 기능 추가하자 기본값을 두고 1.5배까지").
     기본 1배 = 정해 둔 편성(회차 30분·중2·중3 40분) 그대로. 둘은 따로 고른다. 줄이기는 30%(0.7배)까지.
     roadSpeed — 같은 기간에 회차를 더 많이 나감: 로드맵의 주차·개월을 1/배수로 줄인다(회차·내용은 그대로).
     roadAmount — 한 회차 교과 드릴 문항 수를 배수만큼(exam.js getAmount, 6의 배수·상한 지킴). */
  roadSpeed:1, roadAmount:1,
  /* roadManual records a manual planning choice. Since 2026-10-15, diagnosis
     preserves workload regardless of this flag; observe before gradual changes. */
  roadManual:false,
  roadPrints:{}, /* 연산 로드맵 세션 인쇄 회수(2026-09-04) — {'C5-0':2, 'C7-3':1, ...}
    key=courseKey+'-'+sessionIdx. exam.js showRoadPick의 "인쇄 N장" 표시·재인쇄 버튼용,
    잠금과 무관한 순수 카운터라 지워져도 학습에 지장 없음. */
  lineageBadges:{}, /* 계보 완주 배지(§6 규칙4) — {lineageKey:{earnedAt}} */
  symbolDex:{}, /* 기호 도감 수집(§13) — {sym:{unitId,earnedAt}} */
  seenUnlocks:{}, /* 과정 진도로 새로 연 캐릭터 토스트 재알림 방지(캐릭터-승급-설계.md §3) — {'number_42':true,'symbol_pi':true} */
  seenR0Banner:false, /* N-15 완료 시 R0 추천 배너 — 프로필당 1회만(2차 디자인 패스) */
  pendingR0Banner:false, /* stepStamp에서 세우고 다음 마을 진입 때 소비하는 1회성 표시 플래그 */
  /* ── 학령(2026-09-16 원장 "나이도 입력해야 돼") ──
     {entryYear:2025, setAt:...} = 초등 1학년 3월에 들어간(또는 들어갈) 해.
     학년을 그대로 저장하면 3월이 지날 때마다 틀린 값이 되므로, 바뀌지 않는
     기준 하나(입학 연도)만 저장하고 학년·개월은 오늘 날짜에서 매번 계산한다.
     null = 아직 안 알려 줌(그래도 앱은 전부 그대로 동작한다 — 안내만 못 할 뿐). */
  schoolAge:null,
  /* ── 연산 점검 기록(2026-09-16 원장 "중간에 연산 점검 모드도 3단계 정도마다") ──
     {'C3':{at, calcOk, calcTotal, wpOk, wpTotal}} — 계산과 문장제를 따로 센다.
     원장 지시의 핵심이 "계산이 되는 것과 문장제를 이해하는 것은 다르다"이므로
     한 점수로 합치지 않는다. 어떤 것도 잠그지 않고 안내에만 쓴다. */
  checkups:{} };}
let attendanceCleanup=null, symbolCardsCleanup=null, symbolAcquisitionCleanup=null;
let pendingAttendanceDay=null, attendanceSaveFailed=false;
let hadSave=false; // 파싱에 성공한 프로필만 기존 사용자로 취급한다.
const SLOT_COUNT=3, SLOT_ACTIVE_KEY=REVIEW?'nm_review_active_slot_'+review.username:KEY+'_active_slot';
// Each tab may save only the profile and revision it actually loaded. A sibling
// switch or a newer write in another tab must never be overwritten by stale S.
let stateStorageRaw=null,stateStorageSlot=null,stateStorageReady=false,stateStorageBlocked=false;
function load(){
  let raw=null;
  try{
    const selected=REVIEW?{ok:true,raw:localStorage.getItem(KEY)}:NM_LEARNER_STORAGE.read(localStorage,stateOwnerId);
    if(!selected.ok){stateStorageReady=false;return defaults();}
    raw=selected.raw;
    stateStorageRaw=raw;stateStorageSlot=localStorage.getItem(SLOT_ACTIVE_KEY);stateStorageReady=true;
    const r=JSON.parse(raw);
    if(r&&typeof r==='object'&&!Array.isArray(r)){
      hadSave=true;
      return {...defaults(),...r};
    }
  }catch(e){}
  // 손상된 원본을 보존하고 새 체험 프로필의 온보딩으로 복구한다.
  if(raw!==null)try{
    if(localStorage.getItem(KEY+'_recovery')===null)localStorage.setItem(KEY+'_recovery',raw);
  }catch(e){}
  return defaults();
}
let S=load();
const requestedLang=new URLSearchParams(location.search).get('lang');
if(['ko','en','zh'].includes(requestedLang))S.lang=requestedLang;
if(REVIEW){
  S.onboarded=true;S.name='학습 점검';S.cloudLinked=false;S.cloudOwnerId=null;S.guardianManaged=false;
  S.account={status:'active',code:null,checkedAt:0};
  if(!hadSave){S.coins=1000;S.avatar={kind:'boy',name:'점검 마법사'};}
  document.body.classList.add('nm-review-mode');
  const bar=document.createElement('div');bar.className='nm-review-banner';
  const label=document.createElement('span');label.textContent='학습 점검 · '+review.username;
  const exit=document.createElement('button');exit.type='button';exit.id='nmReviewLogout';exit.textContent='점검 로그아웃';
  exit.onclick=async()=>{exit.disabled=true;await NM_REVIEW_SESSION.logout();location.replace('access.html');};
  bar.append(label,exit);document.body.appendChild(bar);
}
const ROAD_MULTS_LIST=[0.7,0.85,1,1.25,1.5];
normalizeLoadedState(hadSave);
function normalizeLoadedState(existingLocalProfile){
if(S.view==='map')S.view='town'; // 구버전 상태 마이그레이션
// 기존 저장본에 character 필드 없으면 기본값 채움
if(!S.character)S.character={number:3,color:'blue',bg:'plain',cape:'none',hat:'none'};
if(S.character.hat===undefined)S.character.hat='none'; // 기존 저장본 하위호환
if(!S.character_unlocked)S.character_unlocked={};
if(window.NM_CHARACTER_STATE){S.coins=NM_CHARACTER_STATE.balance(S);NM_CHARACTER_STATE.normalizeAvatars(S,window.NM_HUMANS);}
if(!S.seenUnlocks)S.seenUnlocks={};
if(!S.mailbox||!S.mailbox.opened)S.mailbox={opened:(S.mailbox&&S.mailbox.opened)||{}};
if(!S.boost)S.boost={doneWeeks:{},log:[]};
if(!S.boost.doneWeeks)S.boost.doneWeeks={};
if(!S.boost.log)S.boost.log=[];
if(S.roadCadence!=='w1'&&S.roadCadence!=='w2')S.roadCadence='w1';
if(S.roadView!=='road'&&S.roadView!=='map')S.roadView='road';
if(!S.roadPrints||typeof S.roadPrints!=='object')S.roadPrints={};
/* 목표 기준(속도) 검증 — 값은 ROAD_PACES의 key와 같아야 한다. ROAD_PACES는 이 줄보다
   아래에서 const로 선언되므로(TDZ) 여기서는 키 목록을 그대로 적는다. 기준을 늘리면
   이 줄도 같이 늘릴 것 — 모르는 키가 남아도 roadPaceDef()가 첫 기준으로 되돌린다. */
if(['p0','p1','p2','p3','p4'].indexOf(S.roadPace)<0)S.roadPace='p2';
/* 속도·양 배수 — 줄이기 30%(0.7)부터 늘리기 1.5배까지(원장 2026-09-25) */
if(ROAD_MULTS_LIST.indexOf(S.roadSpeed)<0)S.roadSpeed=1;
if(ROAD_MULTS_LIST.indexOf(S.roadAmount)<0)S.roadAmount=1;
if(typeof S.onboarded!=='boolean')S.onboarded=existingLocalProfile; // 이미 쓰던 사용자는 온보딩 화면 스킵
if(S.name===undefined)S.name='';
/* account(체험 게이트, Phase 2B)도 onboarded와 같은 이유로 defaults()에 넣지 않는다 —
   hadSave(저장본이 이미 있었는지)로만 "신규 설치 vs 기존 프로필"을 구분해야
   병합 후에도 미설정 여부를 알 수 있다. 기존 프로필(이미 쓰던 사용자)은 승인번호 없이도
   자동 active(grandfather) — 재원생이 게이트 도입으로 잠기면 안 된다는 원장 지시. */
/* 2026-09-06 원장 지시 "이제 접속 승인번호 연결하자" — 게이트를 켠다.
   완전 신규 설치(hadSave===false)만 체험으로 시작하고, 이미 쓰던 프로필은 승인번호 없이도
   active 로 남긴다(위 주석의 grandfather — 재원생이 게이트 도입으로 잠기면 안 된다).
   전에는 이 줄이 무조건 'active' 였다가 잠깐 무조건 'trial' 이었는데, 둘 다 한쪽을 깨뜨린다. */
if(!S.account)S.account={status:existingLocalProfile?'active':'trial',code:null,checkedAt:0};
/* 소급 마이그레이션: 과거 완료(done) 유닛에 steps.stamp가 빠져 로드맵 별이 안 켜지던 버그 —
   기존 프로필의 완료 기록에 stamp 단계를 채워 넣는다(1회성, 멱등) */
(function(){let mig=false;Object.keys(S.progress||{}).forEach(uid=>{const p=S.progress[uid];if(p&&p.done){p.steps=p.steps||{};if(!p.steps.stamp){p.steps.stamp=true;mig=true;}}});if(mig)persistState();})();
if(!S.firstWeek)S.firstWeek=weekKeyFor(new Date()); // 편지함 첫 방문 주 — 이전 주 봉투는 안 보여줌(§10)
}

function stateStorageConflict(){
  if(!stateStorageBlocked){stateStorageBlocked=true;location.reload();}
  return false;
}
function stateStorageCurrent(){
  if(stateStorageBlocked||!stateStorageReady||learnerTransition)return false;
  if(!REVIEW&&(window.NM_PROFILE_AUTH?.peek()?.user.id||null)!==stateOwnerId)return false;
  try{
    if(localStorage.getItem(KEY)!==stateStorageRaw||localStorage.getItem(SLOT_ACTIVE_KEY)!==stateStorageSlot)return stateStorageConflict();
    return true;
  }catch(e){return false;}
}
function persistState(){
  if(REVIEW&&!NM_REVIEW_SESSION.active())return false;
  if(!stateStorageCurrent())return false;
  try{const raw=JSON.stringify(S);localStorage.setItem(KEY,raw);stateStorageRaw=raw;return true;}
  catch(e){return false;}
}
function save(){if(REVIEW&&!NM_REVIEW_SESSION.active())return false;applyAdminSettings();if(!persistState())return false;cloudPushSoon();if(membership)membership.refreshIfDue();if(booted&&S.view==='courseroad')Promise.resolve().then(renderPersonalPlan);return true;}
// The existing profile/slot and state backup own this data; no global sibling log.
if(window.NM_STUDY_RECORDS)window.NM_STUDY_RECORDS.bind({state:()=>S,save});
if(window.NM_STATS?.bind)NM_STATS.bind({scope:()=>{
  if(!stateStorageCurrent())return null;
  if(REVIEW)return 'review:'+review.username;
  if(stateOwnerId){
    if(window.NM_PROFILE_AUTH?.peek()?.user.id!==stateOwnerId)return null;
    if(S.cloudLinked&&S.cloudOwnerId===stateOwnerId)return 'guardian:'+stateOwnerId+':'+S.name;
    return 'guardian:'+stateOwnerId+':local';
  }
  return 'preview';
}});

window.addEventListener('nm:study-record-error',()=>toast(S.lang==='en'?'Your score is unchanged, but the study record could not be saved. Check device storage.':S.lang==='zh'?'成绩不变，但未能保存学习记录。请检查设备存储。':'채점은 유지되지만 학습 기록을 저장하지 못했습니다. 기기 저장 공간을 확인해 주세요.',false));
/* 학습량 배수는 인쇄 쪽(exam.js)이 읽는 자리에 옮겨 둔다 — 학생을 바꾸면 그 학생 값으로 */
function syncAmount(){ try{ if(window.NM_EXAM&&NM_EXAM.setAmount) NM_EXAM.setAmount(S.roadAmount||1); }catch(e){} }
function unitDone(id){return !!(S.progress[id]&&S.progress[id].done);}

/* ---------- 이전 3슬롯 저장본 호환 ----------
   정식 가입은 학생마다 별도 아이디다. 아래 함수는 기존 백업의 형식 호환을
   위해 보존하며, 학생 전환 UI는 별도 아이디 로그인으로 대체했다.
   옛 nm_state_v1/nm_state_slot1~3 원본은 계정별 저장 이관에서 지우지 않는다. */
function slotKey(n){ return (REVIEW?'nm_review_slot_'+review.username+'_':'nm_state_slot')+n; }
function activeSlot(){
  try{ const n=parseInt(localStorage.getItem(SLOT_ACTIVE_KEY),10); return (n>=1&&n<=SLOT_COUNT)?n:1; }
  catch(e){ return 1; }
}
/* 비활성 슬롯 저장본 읽기(활성 슬롯은 항상 메모리 S를 읽어야 하므로 이 함수는 안 씀).
   깨진 JSON은 빈 슬롯 취급 — 목록 화면이 죽지 않게. */
function readSlotState(n){
  try{
    const raw=localStorage.getItem(slotKey(n));
    if(!raw) return null;
    const parsed=JSON.parse(raw);
    return (parsed && typeof parsed==='object') ? parsed : null;
  }catch(e){ return null; }
}
/* 슬롯 전환: 지금 슬롯을 백업하고 대상 슬롯을 활성 자리로 승격한 뒤 새로고침.
   메모리 S가 아니라 localStorage[KEY]를 그대로 옮긴다 — "지금 저장돼 있는 그대로"가
   전환 절차의 정의이므로(옷장에서의 모든 변경은 이미 save()를 거쳐 KEY에 반영돼 있다). */
function switchToSlot(target){
  target=+target;
  if(!stateStorageCurrent())return false;
  const cur=activeSlot();
  if(!(target>=1&&target<=SLOT_COUNT)||target===cur)return false;
  const originals=new Map();
  try{
    for(const key of [KEY,slotKey(cur),SLOT_ACTIVE_KEY])originals.set(key,localStorage.getItem(key));
    const targetRaw=localStorage.getItem(slotKey(target));
    const curRaw=originals.get(KEY);
    if(curRaw!=null)localStorage.setItem(slotKey(cur),curRaw);
    else localStorage.removeItem(slotKey(cur));
    if(targetRaw!=null)localStorage.setItem(KEY,targetRaw);
    else localStorage.removeItem(KEY);
    localStorage.setItem(SLOT_ACTIVE_KEY,String(target));
  }catch(e){
    // Restore only keys that changed. An unchanged failing marker needs no write,
    // including the valid legacy case where slot 1 has no explicit marker yet.
    let restored=true;
    for(const [key,raw]of [...originals].reverse())try{
      if(localStorage.getItem(key)!==raw){if(raw===null)localStorage.removeItem(key);else localStorage.setItem(key,raw);}
    }catch(error){restored=false;}
    if(!restored)stateStorageBlocked=true;
    toast(S.lang==='en'?'Could not switch learners. Check device storage and try again.':S.lang==='zh'?'未能切换学习者，请检查设备存储后重试。':'학습자를 바꾸지 못했어요. 기기 저장 공간을 확인하고 다시 시도해 주세요.',false);
    return false;
  }
  stateStorageBlocked=true;location.reload();return true;
}

/* ---------- 체험 게이트 (Phase 2B) ----------
   승인번호 없이는 각 티어의 대표 유닛만 플레이 가능. 대표 유닛 선정은
   과정-로드맵.md §10 "체험 유닛 선정" 그대로: 유아 N-01·N-09, 초급 A-01, 창의 C-06.
   난이도 잠금(자유 선택 원칙)과는 무관한 별개의 축 — active면 이 체크는 전부 통과. */
/* 체험 범위 (2026-09-06, 원장 지시 "유치 초등 중등 고등 2개씩과 게임마을 2개 챕터씩").
   두 축의 합집합을 연다 — 유닛 목록을 손으로 박지 않고 데이터에서 계산하므로
   커리큘럼이 바뀌어도 따라온다.
   ① 학년 밴드: data/roadmap.js 의 chapter.grade 를 유치/초등/중등/고등으로 묶어
      밴드마다 앞에서 2유닛 (로드맵·학년교실 화면의 축).
   ② 마을 등급: data/curriculum.js 의 tier 마다 열려 있는 앞 2개 레벨(=챕터) 전체
      (마을에서 건물에 들어갔을 때의 축). screenTier 가 3번째 레벨부터 자물쇠로 그린다. */
const TRIAL_BANDS=[
  {key:'유치', grades:['유아']},
  {key:'초등', grades:['초1','초2','초3','초4','초5','창의']},
  {key:'중등', grades:['중1','중2','중3']},
  {key:'고등', grades:['공통수학1','공통수학2','대수','미적분Ⅰ']}
];
const TRIAL_PER_BAND=2;
const TRIAL_LEVELS_PER_TIER=2;
let _trialSet=null;
function trialUnitSet(){
  if(_trialSet)return _trialSet;
  const set=new Set();
  const chapters=(window.NM_ROADMAP&&NM_ROADMAP.chapters)||[];
  TRIAL_BANDS.forEach(band=>{
    let n=0;
    chapters.forEach(ch=>{
      if(n>=TRIAL_PER_BAND||band.grades.indexOf(ch.grade)<0)return;
      (ch.units||[]).forEach(uid=>{ if(n<TRIAL_PER_BAND&&UNITS[uid]){set.add(uid);n++;} });
    });
  });
  /* 마을 축은 '마을에 실제로 서 있는 건물'(TOWN_SPOTS)만 센다. curriculum.js 에는 중·고등
     등급도 tier 로 들어 있지만 마을 지도에는 없다 — 전부 세면 체험이 199유닛 중 70개가 된다. */
  const townTiers=TOWN_SPOTS.map(sp=>sp.tier).filter(id=>id.charAt(0)!=='_');
  townTiers.forEach(id=>{
    const tier=(CUR&&CUR.tiers||[]).find(t=>t.id===id);
    if(!tier)return;
    (tier.levels||[]).filter(l=>l.available&&(l.units||[]).some(u=>UNITS[u]))
      .slice(0,TRIAL_LEVELS_PER_TIER)
      .forEach(l=>(l.units||[]).forEach(uid=>{ if(UNITS[uid])set.add(uid); }));
  });
  if(set.size)_trialSet=set;   // 데이터 미로딩(스크립트 순서)이면 캐시하지 않는다
  return set;
}
function isTrialUnit(uid){if(membership&&guardianAuth?.peek()&&['expired','revoked'].includes(membership.snapshot().membership?.status))return false;return trialUnitSet().has(uid);}
/* 체험에서 열리는 마을 챕터인가(등급 안 레벨 index, 0부터) */
function trialLevelOpen(tierId,idx){
  if(accountActive())return true;
  if(membership&&guardianAuth?.peek()&&['expired','revoked'].includes(membership.snapshot().membership?.status))return false;
  const isTown=TOWN_SPOTS.some(sp=>sp.tier===tierId);
  return isTown ? idx<TRIAL_LEVELS_PER_TIER : true;  // 마을 건물만 2챕터 제한
}
/* 체험 중에는 마을 밖(도형 나라·탐험대 등 다른 서비스)으로 나가지 않는다 —
   원장 지시 2026-09-06 "지오메트리나 외부로 나가는 마을은 막기". 앱 안 화면(view)은 그대로. */
function externalBlocked(){return !accountActive();}
/* 검증 하네스(Playwright)가 화면을 헤집지 않고 게이트 판정을 확인할 수 있게 — 읽기 전용 조회만.
   window.feedbackFx 와 같은 목적의 훅이다. */
window.NM_GATE={trialUnitSet,isTrialUnit,unitLocked,accountActive,externalBlocked,trialLevelOpen};
/* 체험 범위 밖의 유닛은 학원 승인 상태를 확인한다. */
function accountActive(){
  if(REVIEW)return NM_REVIEW_SESSION.active();
  if(window.NM_ENTRY?.mode==='preview')return false;
  if(membership&&guardianAuth?.peek())return S.cloudLinked&&S.cloudOwnerId===guardianAuth.peek().user.id&&!guardianAuth.requiresPassword()&&membership.contactReady()&&membership.canUse();
  return !S.guardianManaged&&!!(S.account&&S.account.status==='active'); // preserve local approvals only until guardian enrollment
}
function unitLocked(uid){return !accountActive()&&!isTrialUnit(uid);}

/* ---------- 클라우드 프로필 (Supabase nm_profiles) ----------
   보호자 이메일 인증 뒤 owner_id와 이름을 함께 확인한다.
   같은 이름만으로 다른 보호자의 기록을 읽거나 덮어쓰지 못하게 서버 RLS도 제한한다.
   네트워크가 안 되면 조용히 로컬 전용으로 동작(앱 사용을 막지 않음).
   cloudLinked가 true인 프로필만 push — 클레임 절차 없이 이름만 같은 옛 로컬
   사용자가 남의 클라우드 저장본을 덮어쓰는 사고를 막는다. */
const SB_URL='https://fgahqumaldheqettmvqg.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
const sbHdr=()=>({apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json'});
const guardianAuth=REVIEW?null:window.NM_PROFILE_AUTH;
let guardianEntry=!REVIEW&&(new URLSearchParams(location.search).get('auth')==='1'||!!window.NM_ENTRY?.guardianUserId),booted=false,guardianContactEditing=false;
if(guardianAuth){
  guardianAuth.configure({url:SB_URL,anonKey:SB_KEY,freshEntry:['guardian','preview'].includes(window.NM_ENTRY?.mode),entryUserId:window.NM_ENTRY?.guardianUserId});
  const refreshGuardianUI=()=>{
    const owner=guardianAuth.peek()?.user.id||null;
    if(owner!==stateOwnerId){
      if(learnerTransition)return;
      try{
        if(owner)sessionStorage.setItem('nm_entry_once_v1',JSON.stringify({mode:'guardian',at:Date.now(),userId:owner}));
      }catch(e){
        app.textContent=S.lang==='en'?'Could not open learner records. Check browser storage and sign in again.':'학생 기록을 열지 못했어요. 브라우저 저장 공간을 확인하고 다시 로그인해 주세요.';return;
      }
      learnerTransition=true;stopVoice();
      app.textContent=S.lang==='en'?'Opening your learner records…':'학생 기록을 불러오고 있어요…';
      location.replace(owner?'index.html?enter=1&lang='+encodeURIComponent(S.lang):'access.html?lang='+encodeURIComponent(S.lang));
      return;
    }
    if(!booted)return;
    if(guardianAuth.pendingLink&&guardianAuth.pendingLink()){
      guardianEntry=!S.onboarded;S.view='closet';render();
      const details=$('.nm-closet-settings');if(details)details.open=true;
    }
    renderIdCard();renderNotifyCard();
    refreshEntryContinue();renderConsentBanner();
  };
  /* ready()가 늦게 끝나 한 번 더 그릴 때, 이미 입력 중인 이메일·인증번호·비밀번호 칸을 지우지 않는다.
     (인증 성공·로그아웃 같은 실제 변화는 onChange가 따로 그린다.) */
  guardianAuth.ready().then(()=>{
    const typing=['#nmGuardEmail','#nmGuardToken','#nmGuardLoginPassword','#nmGuardNewPassword','#nmGuardConfirmPassword','#nmGuardPhone']
      .some(sel=>{const el=document.querySelector(sel);return !!el&&(el.value!==''||document.activeElement===el);});
    if(!typing)refreshGuardianUI();
  }).catch(()=>{});
  guardianAuth.onChange(refreshGuardianUI);
}
if(membership&&guardianAuth){
  membership.configure({url:SB_URL,anonKey:SB_KEY,auth:guardianAuth,profileName:()=>S.cloudLinked?S.name:null});
  membership.onChange(()=>{
    if(!booted)return;
    const changed=applyAdminSettings();
    if(changed){persistState();syncAmount();}
    renderIdCard();renderAccountCard();renderNotifyCard();
    refreshEntryContinue();renderConsentBanner();
    if(S.view==='courseroad')renderPersonalPlan();
  });
}
/* 동의서 갱신 안내(2026-10-22) — 번호는 있지만 현재 동의서 버전에 동의하지 않은 보호자에게
   맨 위 배너로 알린다. 갱신 전에는 체험 밖 학습과 기록 저장이 멈추므로 이유를 숨기지 않는다.
   양식이 이미 보이는 보호자 화면·옷장에서는 배너를 내린다. */
function renderConsentBanner(){
  const old=document.getElementById('nmConsentBanner');
  const contact=membership&&membership.snapshot().contact;
  const need=!REVIEW&&booted&&!!membership&&!!guardianAuth?.peek()&&!(guardianAuth.requiresPassword&&guardianAuth.requiresPassword())
    &&contact?.registered===true&&!membership.contactReady()&&!guardianEntry&&S.view!=='closet';
  if(!need){if(old)old.remove();document.documentElement.style.removeProperty('--nm-consent-h');return;}
  const lk=(k,e,z)=>S.lang==='ko'?k:S.lang==='en'?e:z;
  const bar=old||document.createElement('div');
  bar.id='nmConsentBanner';bar.className='nm-consent-banner';bar.setAttribute('role','region');
  bar.setAttribute('aria-label',lk('개인정보 동의 갱신 안내','Privacy consent renewal','个人信息同意更新提示'));
  bar.innerHTML=`<p>${lk('개인정보 동의서가 새로 바뀌었어요. 동의를 갱신해야 학습 기록이 저장돼요.','The personal data notice has changed. Renew consent to keep saving learning records.','个人信息同意书已更新。更新同意后才能保存学习记录。')}</p><button type="button" class="nm-btn" id="nmConsentRenew">${lk('동의 갱신하기','Renew consent','更新同意')}</button>`;
  if(!old)document.body.appendChild(bar);
  document.documentElement.style.setProperty('--nm-consent-h',(bar.offsetHeight+12)+'px');
  bar.querySelector('#nmConsentRenew').onclick=()=>{
    guardianContactEditing=false;S.view='closet';save();render();
    const details=$('.nm-closet-settings');if(details)details.open=true;
    $('#nm-guardian-slot')?.scrollIntoView({block:'start'});
  };
}
function applyAdminSettings(){
  const record=membership&&membership.snapshot();const p=record&&record.settings;
  let changed=false;
  if(record?.contact?.registered&&S.cloudLinked&&record.owner===S.cloudOwnerId&&record.owner===guardianAuth?.peek()?.user.id&&!S.guardianManaged){S.guardianManaged=true;changed=true;}
  if(!p||p.profileName!==S.name||record.owner!==S.cloudOwnerId)return changed;
  changed=changed||!S.adminPlan||S.adminPlan.version!==p.version;
  S.adminPlan={...p};S.roadSpeed=p.speed;S.roadAmount=p.amount;S.roadCadence=p.cadence;S.roadPace='p2';
  if(p.entryYear)S.schoolAge={...S.schoolAge,entryYear:p.entryYear,setAt:Date.parse(p.updatedAt)||Date.now()};
  return changed;
}
async function cloudCredentials(){
  if(REVIEW)throw new Error('learning_review_only');
  if(!guardianAuth)throw new Error('guardian_auth_required');
  await guardianAuth.ready();
  if(guardianAuth.requiresPassword&&guardianAuth.requiresPassword())throw new Error('password_setup_required');
  if(membership&&!membership.contactReady())throw new Error('contact_required');
  const session=await guardianAuth.getSession();
  if(!session||!session.user||!session.user.id)throw new Error('guardian_auth_required');
  if(session.user.id!==stateOwnerId||!stateStorageCurrent())throw new Error('learner_state_changed');
  return {owner:session.user.id,headers:{...sbHdr(),Authorization:'Bearer '+session.access_token}};
}
async function cloudGet(name){
  const auth=await cloudCredentials();
  const url=`${SB_URL}/rest/v1/nm_profiles?name=eq.${encodeURIComponent(name)}&owner_id=eq.${encodeURIComponent(auth.owner)}&select=name,state,owner_id`;
  const r=await fetch(url,{headers:auth.headers});
  if(!r.ok)throw new Error('cloudGet '+r.status);
  const rows=await r.json();
  if(!isGuardianOwner(auth.owner))throw new Error('guardian_changed');
  return rows[0]||null;
}
function isGuardianOwner(owner){
  const current=guardianAuth&&guardianAuth.peek();
  return !!(current&&current.user.id===owner);
}
function backupBeforeCloudResume(owner){
  if(!isGuardianOwner(owner))return false;
  try{
    const backup=JSON.stringify(S);localStorage.setItem(KEY+'_preresume',backup);
    if(localStorage.getItem(KEY+'_preresume')!==backup)throw new Error('storage');
    return true;
  }catch(e){
    toast(S.lang==='ko'?'이 기기의 기록을 보관하지 못해 이어하기를 멈췄어요. 저장 공간을 확인해 주세요.':S.lang==='en'?'Could not back up this device’s progress. Check storage before continuing.':'无法备份本设备的进度，请检查存储空间后重试。',false);
    return false;
  }
}
async function cloudClaim(name,state){
  const auth=await cloudCredentials();
  const r=await fetch(`${SB_URL}/rest/v1/nm_profiles`,{
    method:'POST',headers:auth.headers,
    body:JSON.stringify({name,state:{...state,cloudOwnerId:auth.owner},owner_id:auth.owner,updated_at:new Date().toISOString()})});
  if(r.status===409)return false;           // 그 사이 누가 선점 (중복)
  if(!r.ok)throw new Error('cloudClaim '+r.status);
  if(!isGuardianOwner(auth.owner))throw new Error('guardian_changed');
  return {owner:auth.owner};
}
/* ---------- 승인번호 (nm_codes, Phase 2B) ----------
   RLS가 이미 "active=true 행만 select 가능"으로 걸려 있으므로, code로만 조회해서
   행이 오면 유효(=active)한 것이고 안 오면 오타든 비활성이든 똑같이 "없음"이다 —
   회수(재검증)도 같은 함수 재사용: 비활성화된 코드는 RLS가 그 순간부터 숨겨준다. */
async function nmCheckCode(code){
  /* 2026-09-06: 예전에는 여기서 nm_codes 를 anon 키로 직접 SELECT 했다. RLS 가 active=true 라
     "코드를 알아야만 조회된다"고 봤지만 그건 행 필터일 뿐이라 select=code 한 번이면 유효 코드가
     전부 나왔다(실측 200 + 목록). 검증을 Edge Function 으로 옮기고 표의 anon SELECT 는 지웠다.
     함수는 코드 존재 여부만 돌려주고(오타·회수 구분 안 함) IP 기준 속도 제한을 건다. */
  const r=await fetch(`${SB_URL}/functions/v1/nm-auth`,{
    method:'POST',headers:sbHdr(),
    body:JSON.stringify({action:'verify',code})});
  if(r.status===429)throw new Error('nmCheckCode rate_limited');
  if(!r.ok)throw new Error('nmCheckCode '+r.status);
  const j=await r.json();
  return !!(j&&j.ok);
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
    /* 같은 IP 에서 10분에 12회를 넘기면 nm-auth 가 429 를 준다 — 오타 반복과 구분해서 알린다. */
    if(/rate_limited/.test(String(e&&e.message)))return{ok:false,reason:'rate'};
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

let cloudTimer=null,cloudSyncError=false,cloudPending=null,cloudSending=false,cloudTarget=null,cloudGeneration=0;
function cloudPushSoon(){
  if(REVIEW)return;
  clearTimeout(cloudTimer);
  cloudTimer=null;
  const target=S.cloudLinked&&S.name&&S.cloudOwnerId?JSON.stringify([S.cloudOwnerId,S.name]):null;
  if(target!==cloudTarget){cloudTarget=target;cloudGeneration++;cloudSyncError=false;}
  if(!target){cloudPending=null;return;}
  cloudPending={name:S.name,owner:S.cloudOwnerId,state:JSON.parse(JSON.stringify(S)),generation:cloudGeneration};
  const sameTarget=job=>job.generation===cloudGeneration&&S.cloudLinked&&S.name===job.name&&S.cloudOwnerId===job.owner;
  const current=job=>sameTarget(job)&&isGuardianOwner(job.owner);
  async function flush(){
    if(cloudSending||!cloudPending)return;
    // Include credential reads in the lock: two PATCHes must never overtake
    // each other. Saves during a request replace just one pending snapshot.
    cloudSending=true;
    try{
      while(cloudPending){
        clearTimeout(cloudTimer);cloudTimer=null;
        const job=cloudPending;cloudPending=null;
        if(!sameTarget(job)||!stateStorageCurrent())continue;
        try{
          const auth=await cloudCredentials();
          if(auth.owner!==job.owner||!current(job)||!stateStorageCurrent())continue;
          const response=await fetch(`${SB_URL}/rest/v1/nm_profiles?name=eq.${encodeURIComponent(job.name)}&owner_id=eq.${encodeURIComponent(job.owner)}&select=name`,{
            method:'PATCH',headers:{...auth.headers,Prefer:'return=representation'},
            body:JSON.stringify({state:job.state,updated_at:new Date().toISOString()})
          });
          if(!response.ok||!(await response.json()).length)throw new Error('cloud_save_failed');
          if(current(job)&&cloudSyncError){cloudSyncError=false;renderIdCard();}
        }catch(e){if(current(job)){cloudSyncError=true;renderIdCard();}} // 기기 저장은 유지하며 다음 save 때 재시도한다.
      }
    }finally{cloudSending=false;}
  }
  cloudTimer=setTimeout(flush,1500);
}
/* 주간 요약 — 알림 발송(Edge Function weekly-notify)이 프로필 state에서 읽는다.
   현재 과정이 바뀔 때만 저장(렌더마다 save 폭주 방지). 알림서비스-설계.md 참조. */
function highWeeklySchedule(courseKey){
  if(!window.NM_HIGH_PACING)return null;
  const managed=S.adminPlan;
  if(!managed&&S.learningPlan){
    return (window.NM_COURSES||{})[S.learningPlan.courseKey]?.studyPlan
      ? {...S.learningPlan} : null;
  }
  const anchorKey=managed?.courseKey||S.highSchedule?.courseKey||courseKey;
  if(!managed&&!S.roadManual&&!S.middleCadenceDefaultVersion&&/^middle[123]$/.test((window.NM_COURSES||{})[anchorKey]?.tier||'')){
    S.roadCadence='w2';S.middleCadenceDefaultVersion='20261023-core10';
  }
  if(!managed&&!S.roadManual&&!S.calculusCadenceDefaultVersion&&(window.NM_COURSES||{})[anchorKey]?.tier==='calculus1'){
    S.roadCadence='w2';S.calculusCadenceDefaultVersion='20261024-calculus3m';
  }
  if(managed&&(window.NM_COURSES||{})[managed.courseKey]?.studyPlan&&managed.startDate)
    return {courseKey:managed.courseKey,sessionIndex:managed.sessionIndex||1,startDate:managed.startDate,speed:managed.speed||1,cadence:managed.cadence||'w2'};
  if(S.highSchedule&&(window.NM_COURSES||{})[S.highSchedule.courseKey]?.studyPlan)
    return {...S.highSchedule,speed:S.roadSpeed||1,cadence:S.roadCadence||'w1'};
  const course=(window.NM_COURSES||{})[courseKey];
  if(!course?.studyPlan)return null;
  // Anchor once; viewing another week never changes the student's completion record.
  S.highSchedule={courseKey,sessionIndex:1,startDate:new Date(Date.now()+9*3600000).toISOString().slice(0,10)};
  return {...S.highSchedule,speed:S.roadSpeed||1,cadence:S.roadCadence||'w1'};
}
/* A chosen plan is separate from completed work and the diagnostic result. All
   plan controls use this anchor; opening a lesson never rewrites it. */
function effectiveLearningSettings(weekKey){
  const managed=S.adminPlan,courses=window.NM_COURSES||{};
  if(managed&&courses[managed.courseKey])return {...managed,pace:'p2'};
  if(S.learningPlan&&courses[S.learningPlan.courseKey]){
    const historical=weekKey&&window.NM_PLAN_CONTROL?.forWeek(S.learningPlanHistory,weekKey);
    return {...(historical||S.learningPlan)};
  }
  const key=currentCourseKey(),high=highWeeklySchedule(key);
  return {...(high||{courseKey:key,sessionIndex:1,startDate:new Date(Date.now()+9*3600000).toISOString().slice(0,10)}),
    speed:S.roadSpeed||1,amount:S.roadAmount||1,cadence:S.roadCadence||'w1',pace:S.roadPace||'p2'};
}
function applyLearningSettings(patch,guidanceChoice){
  applyAdminSettings();
  if(S.adminPlan||!window.NM_PLAN_CONTROL||!stateStorageCurrent())return false;
  const keys=['learningPlan','learningPlanHistory','roadSpeed','roadAmount','roadCadence','roadPace','roadManual','_roadFocus','highSchedule','middleCadenceDefaultVersion','calculusCadenceDefaultVersion','middleStudyGuidanceChoices'];
  const before=Object.fromEntries(keys.map(k=>[k,{present:Object.prototype.hasOwnProperty.call(S,k),value:S[k]}]));
  try{
    const weekKey=weekKeyFor(new Date()),current=effectiveLearningSettings();
    const next=NM_PLAN_CONTROL.change(NM_COURSES,current,patch,{now:new Date(),weekKey});
    S.learningPlanHistory=NM_PLAN_CONTROL.record(S.learningPlanHistory,{...current,legacy:!S.learningPlan},next,weekKey);
    S.learningPlan=next;S.roadSpeed=next.speed;S.roadAmount=next.amount;
    S.roadCadence=next.cadence;S.roadPace=next.pace;S.roadManual=true;S._roadFocus=next.courseKey;
    if(guidanceChoice)S.middleStudyGuidanceChoices={...S.middleStudyGuidanceChoices,[guidanceChoice.key]:guidanceChoice.value};
    if(!save())throw new Error('plan_save_failed');
    syncAmount();return true;
  }catch(e){
    keys.forEach(k=>{if(before[k].present)S[k]=before[k].value;else delete S[k];});
    return false;
  }
}
function updateWeeklyDigest(){
  try{
    const current=currentCourseKey(),plan=highWeeklySchedule(current),key=plan?plan.courseKey:current;
    const c=(window.NM_COURSES||{})[key];
    if(!c)return;
    const fields={courseKey:key,courseNum:c.order,
      courseTitle:(c.title&&c.title.ko)||key,cadence:plan?plan.cadence:S.roadCadence,
      ...(plan?{sessionIndex:plan.sessionIndex,highPlanVersion:c.studyPlan.version,highStartDate:plan.startDate,highSpeed:plan.speed}:{})};
    const d=S.weeklyDigest||{};
    if(Object.keys(fields).every(k=>d[k]===fields[k])&&!!d.highStartDate===!!fields.highStartDate)return;
    S.weeklyDigest={...fields,at:Date.now()};
    save();
  }catch(e){}
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
function math(tex,el){const t=(window.NM_TEX&&window.NM_TEX.tidy)?window.NM_TEX.tidy(tex):tex;try{katex.render(t,el,{throwOnError:false,displayMode:false});}catch(e){el.textContent=t;}}
function renderMath(root){(root||document).querySelectorAll('[data-tex]').forEach(el=>{if(el.dataset.done)return;math(el.getAttribute('data-tex'),el);el.dataset.done='1';});}
/* □ 자리에 입력값을 바로 써 넣기(2026-09-09, 원장 "?에 수를 쓰면 실제 답의 위치에 답이
   써져야지"). 그동안 타이핑한 값은 수식 밑 별도 화면(.nm-numpad-screen)에만 떴고, 수식의
   \square는 정답을 맞힐 때까지 그대로였다 — 눈이 문제와 입력칸 두 곳을 오가야 했다.
   이제 키를 누를 때마다 그 문제의 \square를 파란 숫자로 바꿔 같은 자리에 다시 그린다.
   여러 칸(배열 답)은 순서대로 \square를 채운다. 빈 값은 \square 그대로 둔다(칸 표시가
   사라지면 안 되니까). */
function fillLiveTex(tex,vals){
  vals=Array.isArray(vals)?vals:[vals];
  let i=0;
  return String(tex||'').replace(/\\square/g,()=>{
    const v=vals[i++];
    return (v===undefined||v===''||v==='-')?'\\square':('\\textcolor{#1c56b3}{'+v+'}');
  });
}
/* sel 안에서 \square가 있는 data-tex 스팬을 찾아 vals로 채워 다시 그린다. 스팬이 여러 개
   (labExprHtml이 \Rightarrow로 줄을 나눈 경우)면 건너뛴다 — 어느 줄의 빈칸인지 확정할 수
   없어서다(안전한 쪽으로 아무것도 안 함). renderMath의 1회 캐시를 우회해 매 입력마다 부른다. */
function updateLiveFill(sel,vals){
  const el=$(sel);if(!el)return;
  const spans=[].slice.call(el.querySelectorAll('[data-tex]'));
  if(spans.length!==1)return;
  const tex=spans[0].getAttribute('data-tex')||'';
  if(!/\\square/.test(tex))return;
  math(fillLiveTex(tex,vals),spans[0]);
}
let lessonVersion=0;
function lessonLater(fn,ms){
  const version=lessonVersion,body=ms<=2000?document.getElementById('stepBody'):null,started=Date.now();
  // A correct answer has already advanced state. Keep its controls inactive until
  // the full feedback sentence finishes, so the old screen cannot submit again.
  if(body){body.inert=true;body.setAttribute('aria-busy','true');}
  const advance=()=>{
    if(version!==lessonVersion)return;
    if(ms<=2000&&window.NM_VOICE?.isSpeaking()&&Date.now()-started<30000){setTimeout(advance,80);return;}
    if(body){body.inert=false;body.removeAttribute('aria-busy');}
    fn();
  };
  return setTimeout(advance,ms);
}
function stopVoice(){
  window.NM_VOICE?.stop();
}
function say(text){
  if(text)window.NM_VOICE?.say(text,S.lang||'ko');
}
/* 파일 없는 짧은 효과음은 WebAudio로 합성 — tap(숫자판)·stamp(도장)·wrong(오답). 아주 작게. */
let _actx=null;
function beep(seq,gain){
  try{
    _actx=_actx||new (window.AudioContext||window.webkitAudioContext)();
    const t0=_actx.currentTime;
    seq.forEach(([f,at,dur])=>{
      const o=_actx.createOscillator(),g=_actx.createGain();
      o.type='sine';o.frequency.value=f;
      g.gain.setValueAtTime(0,t0+at);g.gain.linearRampToValueAtTime(gain,t0+at+.01);g.gain.exponentialRampToValueAtTime(.0001,t0+at+dur);
      o.connect(g).connect(_actx.destination);o.start(t0+at);o.stop(t0+at+dur+.02);
    });
  }catch(e){}
}
function playSfx(kind){
  if(kind==='tap'){beep([[880,0,.05]],.12);return;}
  stopVoice();
  if(kind==='stamp'){beep([[523,0,.12],[784,.12,.18]],.25);return;}
  if(kind==='wrong'){beep([[220,0,.16]],.15);return;}
  // Feedback is a short wordless chime, so it cannot introduce an older speaker.
  beep([[523,0,.08],[659,.08,.08],[784,.16,.12]],.12);
}
window.NM_SFX=playSfx;
/* The legacy API stays compatible; feedback now contains no spoken words or delayed callbacks. */
function sayAfterSfx(sfxAudio,text){
  say(text);
}
window.NM_SAY=say;   // widgets.js(storyCard 🔊 다시듣기 버튼)에서 재낭독용으로 사용
window.NM_L=L;        // widgets.js에서 다국어 필드(problem.prompt 등) 읽기용
function toast(msg,ok){if(!ok&&(msg===t('tryAgain')||msg==='✗'))logDaily(false);const el=document.createElement('div');el.className='nm-toast '+(ok?'ok':'no');el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),1100);feedbackFx(ok);}
/* 디자인 패스 1(§1) — 정답이면 동행 옆 스파클, 오답이면 마법판이 흔들림. toast()는
   practice/check/lab/arena 정오답 경로가 전부 거치는 지점이라 여기 한 곳에서만
   클래스를 토글한다(로직 변경 없음, 순수 시각 효과). 대상이 화면에 없으면
   querySelector가 null이라 조용히 아무 일도 없다(예: 아레나엔 .nm-numi가 없음). */
let _numiMoodTimer=null;
function feedbackFx(ok){
  if(ok){
    const n=document.querySelector('.nm-numi');
    if(n){n.classList.remove('sparkle');void n.offsetWidth;n.classList.add('sparkle');}
    /* 표정 갈아입기(학습무대-작화지시서.md §3) — 정답이면 -happy로, 1.3초 뒤 -think로
       되돌린다. data-mood-base(파일 stem)로만 자기 자신을 다시 찾으므로, 그 사이
       화면이 다음 문제로 넘어가 새 img(같은 캐릭터면 이미 think)가 서 있어도 안전하고,
       캐릭터 자체가 바뀌었거나 그 화면에 동행이 없어졌으면 조용히 아무 일도 안 한다. */
    clearTimeout(_numiMoodTimer);
    const img=document.querySelector('.nm-numi img[data-mood]');
    if(img&&img.dataset.moodBase){
      const base=window.NM_CHAR_BASE||'assets/characters/';
      const stem=img.dataset.moodBase;
      img.dataset.mood='happy';img.src=base+stem+'-happy.png';
      _numiMoodTimer=setTimeout(()=>{
        const cur=document.querySelector('.nm-numi img[data-mood-base="'+stem+'"]');
        if(cur){cur.dataset.mood='think';cur.src=base+stem+'-think.png';}
      },1300);
    }
  }else{
    playSfx('wrong');
    const board=document.querySelector('.nm-board,.nm-arena-expr');
    if(board){board.classList.remove('nm-shake');void board.offsetWidth;board.classList.add('nm-shake');}
  }
}
window.feedbackFx=feedbackFx; // 검증 하네스(Playwright)가 실제 정답 없이도 표정 스와핑을 확인할 수 있게
function confetti(){const cols=['#16417C','#EAC996','#C9A063','#2E9E6B','#3768ad'];for(let i=0;i<64;i++){const el=document.createElement('div');el.className='nm-confetti';el.style.left=Math.random()*100+'vw';el.style.background=cols[i%cols.length];document.body.appendChild(el);el.animate([{transform:'translateY(-20px) rotate(0)',opacity:1},{transform:`translateY(${innerHeight+40}px) rotate(${Math.random()*720}deg)`,opacity:.9}],{duration:1600+Math.random()*1200,easing:'cubic-bezier(.3,.6,.4,1)'}).onfinish=()=>el.remove();}}
function coinAdd(n,reason,claimKey){
  coinAdd.saveFailed=false;
  const previous={coins:S.coins,coinLedger:S.coinLedger,coinRewards:S.coinRewards};
  const before=NM_CHARACTER_STATE.balance(S);
  if(!NM_CHARACTER_STATE.reward(S,n,reason,claimKey))return 0;
  const awarded=NM_CHARACTER_STATE.balance(S)-before;
  if(!save()){
    Object.keys(previous).forEach(k=>{if(previous[k]===undefined)delete S[k];else S[k]=previous[k];});
    coinAdd.saveFailed=true;
    if(typeof toast==='function')toast(S.lang==='en'?'Could not save your reward. Check device storage and try again.':S.lang==='zh'?'未能保存奖励，请检查设备存储后重试。':'보상을 저장하지 못했어요. 기기 저장 공간을 확인하고 다시 시도해 주세요.',false);
    return 0;
  }
  /* 화면 전환 없이 코인이 바뀌는 경우(출석 카드 등) 상단 🪙 표시를 바로 맞춘다 */
  document.querySelectorAll('.nm-coins b').forEach(b=>{b.textContent=S.coins;});
  return awarded;
}

/* ============================================================
   포인트 §6 — 출석 + 주간 보너스 (마을세계관-설계.md §6, 연속 배수 없음)
   ============================================================ */
/* 일별 보상과 출석 날짜를 모두 한국 시각(KST)으로 맞춘다. */
function todayKey(){
  return new Date(Date.now()+9*3600000).toISOString().slice(0,10);
}
/* 출석 체크 — S.attend는 defaults()에 없다(지시사항): 기존 저장본에 필드가
   없다가 오늘 처음 생기는 것도 "출석 1일째"로 자연스럽게 시작해야 하므로,
   여기서 있으면 쓰고 없으면 지금 막 만든다(그 자체가 마이그레이션). 오늘 이미
   기록돼 있으면 아무 것도 하지 않고 null 반환 — 하루 두 번 이상 안 준다. */
function checkAttendance(){
  if(!window.NM_ATTENDANCE)return null;
  const previous={attend:S.attend,coins:S.coins,coinLedger:S.coinLedger,coinRewards:S.coinRewards};
  const marked=NM_ATTENDANCE.mark(S.attend,new Date());
  if(JSON.stringify(marked.attend)===JSON.stringify(S.attend))return null;
  S.attend=marked.attend;
  if(marked.firstToday){
    const before=NM_CHARACTER_STATE.balance(S);
    NM_CHARACTER_STATE.reward(S,1,'attendance','attendance:'+S.attend.last);
    S.attend.reward=NM_CHARACTER_STATE.balance(S)-before;
  }
  if(!save()){
    Object.keys(previous).forEach(k=>{if(previous[k]===undefined)delete S[k];else S[k]=previous[k];});
    attendanceSaveFailed=true;
    return null;
  }
  attendanceSaveFailed=false;
  return marked.firstToday?S.attend.days:null;
}
function showAttendanceBook(opener){
  if(!window.NM_ATTENDANCE)return;
  checkAttendance();
  if(attendanceCleanup)attendanceCleanup();
  attendanceCleanup=NM_ATTENDANCE.mount({attend:S.attend,lang:S.lang,opener:opener||document.activeElement,
    onClose:()=>{attendanceCleanup=null;}});
  if(attendanceSaveFailed)toast(S.lang==='en'?'Attendance could not be saved. Check device storage and try again.':S.lang==='zh'?'未能保存出勤。请检查设备存储后重试。':'출석을 저장하지 못했어요. 기기 저장 공간을 확인하고 다시 열어 주세요.',false);
}
/* 주간 보너스 — "그 주 봉투를 다 풀었다"의 정의(마을세계관-설계.md §6):
   ① 봉투를 열었을 것(S.mailbox.opened[weekKey])
   ② 이 앱엔 주간 드릴별 "완료" 상태가 없다 — 드릴은 인쇄해서 종이로 풀기
      때문(mailbox·wsh·thread 완료 플래그를 전부 찾아봤지만 없음, CLAUDE
      지시사항의 폴백 규칙 적용 대상). 대신 정체 감지→보강 루프의 "그 주
      몸풀기 완료"(boosterDoneThisWeek)를 그 주 해야 할 일의 완료 신호로 쓴다.
   ③ 다만 그 주에 보강이 아예 필요 없었던 아이(boosterPick()===null, 약점
      스레드 없음)까지 보강을 요구하면 잘하고 있는 아이가 영영 주간 보너스를
      못 받는 역설이 생긴다 — 그래서 "지금 시점에 보강이 필요 없다"도 완료로
      인정한다. boosterPick()은 주 단위 스냅샷이 아니라 항상 최신 통계를
      보므로 완벽하진 않지만(과거 주를 소급 판정), 종이 학습지 채점 자체가
      앱에 없는 이상 이게 가장 단순하고 방어 가능한 근사치다. */
function weekFullyDone(weekKey){
  if(!weekKey) return false;
  if(!(S.mailbox && S.mailbox.opened && S.mailbox.opened[weekKey])) return false;
  const needsBoost = !boosterDoneThisWeek(weekKey) && !!boosterPick();
  return !needsBoost;
}
function maybeAwardWeeklyBonus(weekKey){
  if(!weekFullyDone(weekKey)) return;
  if(!S.weeklyBonus) S.weeklyBonus={};
  if(S.weeklyBonus[weekKey]) return;
  S.weeklyBonus[weekKey]=true;
  const awarded=coinAdd(3,'weekly','weekly:'+weekKey);
  if(coinAdd.saveFailed){delete S.weeklyBonus[weekKey];return;}
  save();
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  toast(lk('한 주를 다 마쳤어요!','You finished the week!','完成了一周！')+(awarded?` 🪙 +${awarded}`:''), true);
}

function pickVoice(arr){return L(arr[Math.floor(Math.random()*arr.length)]);}
/* 유아(tier basic)는 글을 못 읽으니 정답/오답 코멘트도 음성으로 — MP3(tts-map) 있으면 실음성 */
/* opts.afterSfx — 직전에 playSfx()가 돌려준 Audio를 넘기면 그게 끝난 뒤에 말한다
   (2026-09-14, success/great-job 음성과 겹쳐 들리던 문제 수정). opts.force는 tier
   와 무관하게 항상 말하게 한다(매직 랩 짝 찾기가 씀 — pickTile 참고). */
function voiceLine(u,arr,ok,opts){
  opts=opts||{};
  const line=pickVoice(arr);toast(line,ok);
  if(opts.force||(u&&u.tier==='basic'))sayAfterSfx(opts.afterSfx,line);
  return line;
}

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
/* 지도에서 학습·도감을 다녀와도 같은 장소로 돌아온다. 학생 진도와는 별개인
   이번 방문의 시점만 기억하며, localStorage·클라우드 저장에는 넣지 않는다. */
let townVisitSnapshot=S.townVisitSnapshot||null;
let roadVisitSnapshot=null;
let restoreRoadVisit=false;
let hqPuzzle=null; /* 수학사 퀴즈(§3 남쪽 항구) — 현재 화면의 퍼즐 상태. S.histQuiz(큐·done)와
  달리 저장하지 않는다(재입장 시 같은 만화면 새로 섞임) — mgTimer·townCleanup과 같은 성격의
  전환용 모듈 변수. */
/* 사람 아바타 kind — S.avatar는 onboarded와 같은 이유로 defaults()에 없다(§ 위 주석
   "onboarded는 defaults()에 넣지 않음" 참고): 기존 저장본(온보딩 이전)과 병합돼도
   "아직 안 골랐음"을 구분해야 마을 이주 모달이 뜬다. 읽을 땐 항상 이 헬퍼로. */
function avatarKind(){ return (S.avatar&&S.avatar.kind)||'boy'; }
function avatarProfile(){return window.NM_HUMANS?NM_HUMANS.clean(S.avatar||{kind:'boy'}):{kind:avatarKind()};}
function avatarName(){return avatarProfile().name||S.name||charIdLabel(S.character);}
/* 캐릭터 라벨(이름 없을 때 표시) — 기호 캐릭터는 숫자 대신 글리프로. */
function charIdLabel(ch){
  if(ch && ch.symbol){
    const item=(window.NM_AVATAR&&window.NM_AVATAR.symbols||[]).find(s=>s.id===ch.symbol);
    return item ? item.glyph : ch.symbol;
  }
  return '#'+(ch&&ch.number!=null?ch.number:3);
}
/* 상단 칩의 내용물(사람 아바타 미니 렌더 + 이름표) — 옷장에서 라이브 패치할 때도
   이 함수로 innerHTML만 갈아끼운다(버튼 요소 자체는 유지해 onclick이 안 끊긴다). */
function charChipInner(){
  const mini = window.renderHumanChar ? window.renderHumanChar(avatarProfile(), 30) : '🪄';
  const label = esc(avatarName());
  return `${mini}<span class="nm-char-chip-name">${label}</span>`;
}
function charChipHTML(){
  return `<button class="nm-char-chip" id="charChipBtn">${charChipInner()}</button>`;
}
/* 지금 화면 뒤에 깔 사진 (2026-09-16, 원장 "우리 맵이나 방 이미지를 흐리게 넣어 줘").
   학습 화면(.nm-unit-view)은 자기 방 사진을 선명하게 깔고 있으므로 여기서는 손대지
   않는다 — 흐린 배경은 그 밖의 설명·안내 화면을 위한 것이다.
   지금 과정의 방을 고르고, 과정을 아직 모르면 마을 지도. */
function bgKeyForView(){
  try{
    /* 마을·타이틀은 자기 배경이 있다 — 지도로 둔다(흐린 층이 보일 일이 없다) */
    if(S.view==='town'||S.view==='title') return 'map';
    if(S.unit) return stageKeyForUnit(S.unit);
    const c=(window.NM_COURSES||{})[currentCourseKey()];
    if(c&&c.tier) return stageKeyForTier(c.tier);
  }catch(e){}
  return 'map';
}

function render(){
  if(attendanceCleanup){attendanceCleanup();attendanceCleanup=null;}
  if(symbolCardsCleanup){symbolCardsCleanup.destroy();symbolCardsCleanup=null;}
  clearSymbolAcquisition();
  if(window.NM_YOUNG_NUMBERS)NM_YOUNG_NUMBERS.stop();
  lessonVersion++;
  stopVoice();
  syncAmount();
  window.NM_LANG=S.lang;
  if(REVIEW){
    const label=document.querySelector('.nm-review-banner span'),exit=document.getElementById('nmReviewLogout');
    if(label)label.textContent=(S.lang==='en'?'Learning review':S.lang==='zh'?'学习检查':'학습 점검')+' · '+review.username;
    if(exit)exit.textContent=S.lang==='en'?'Review logout':S.lang==='zh'?'退出检查':'점검 로그아웃';
  }
  document.documentElement.lang=S.lang==='zh'?'zh-CN':S.lang;
  NM_BAND=computeBand();                                  // 적응형 밴드 — 진도 오르면 다음 렌더부터 반영
  document.documentElement.dataset.nmBand=NM_BAND;
  document.documentElement.dataset.nmBg=bgKeyForView();   // 설명·안내 화면 뒤에 깔 사진(styles.css body::before)
  if(S.onboarded)updateWeeklyDigest();                    // 알림용 주간 요약(변화 있을 때만 저장)
  window.NM_CURRENT_UNIT=S.unit||null;                    // widgets.js가 "N-* 유닛인가"를 판정할 때 씀(오답 소리·표정 등, 유아 전용 반응)
  if(townCleanup){townCleanup();townCleanup=null;}
  window.NM_MAGIC_NOTE_PLAYER?.close();
  renderConsentBanner();
  if(S.view!=='minigame'&&mgTimer){clearInterval(mgTimer);mgTimer=null;}
  if(wsHelperId&&!guardianEntry){
    app.innerHTML='<div id="screen"></div>';
    screenWorksheetHelper(wsHelperId);
    return;
  }
  if(guardianEntry){
    app.innerHTML='<div id="screen"></div>';
    screenGuardianEntry();return;
  }
  if(!S.onboarded){
    app.innerHTML='<div id="screen"></div>';
    screenWelcome();
    return;
  }
  const attended=checkAttendance();if(attended!=null)pendingAttendanceDay=attended;
  if(S.view==='title'){
    app.innerHTML='<div id="screen"></div>';
    screenTitle();
    return;
  }
  syncProgressUnlocks();                                   // 과정 진도 → 캐릭터 해금(멱등, 새로 열리면 토스트)
  app.innerHTML=`<div class="nm-top">
    <div class="nm-brand">${charChipHTML()}</div>
    <div class="nm-top-right">
      <span class="nm-coins">🪙 <b>${S.coins}</b></span>
      <button class="nm-attendance-open" id="attendanceBtn" aria-label="${S.lang==='ko'?'출석 도장':S.lang==='en'?'Attendance stamps':'出勤印章'}">${S.lang==='ko'?'출석':S.lang==='en'?'Stamps':'出勤'}</button>
      <button class="nm-lang" id="langBtn">${t('langName')}</button>
    </div>
  </div><div id="screen"></div>`;
  $('#langBtn').onclick=cycleLang;
  $('#attendanceBtn').onclick=e=>showAttendanceBook(e.currentTarget);
  $('#charChipBtn').onclick=()=>{S.view='closet';save();render();};
  if(S.view==='town')screenTown();
  else if(S.view==='roadmap')screenRoadmap();
  else if(S.view==='courseroad')screenCourseRoad();
  else if(S.view==='checkup')screenCheckup();
  else if(S.view==='placement')screenPlacement();
  else if(S.view==='startpick')screenStartPick();
  else if(S.view==='minigame')screenMiniGame(S.miniGameId||'make10');
  else if(S.view==='gradecourse')screenGradeCourse();
  else if(S.view==='mailbox')screenMailbox();
  else if(S.view==='boost')screenBoost();
  else if(S.view==='tier')screenTier();
  else if(S.view==='unit')screenUnit();
  else if(S.view==='exam')screenExam();
  else if(S.view==='closet')screenCloset();
  else if(S.view==='symboldex')screenSymbolDex();
  else if(S.view==='magazine')screenMagazine();
  else if(S.view==='histquiz')screenHistQuiz();
  else if(S.view==='report')screenReport();
  else screenTown();
  renderMath();
}
function cycleLang(){stopVoice();const o=['ko','en','zh'];S.lang=o[(o.indexOf(S.lang)+1)%3];save();render();}

/* ============================================================
   온보딩 — 캐릭터+이름 선택 → "짠!" 구름 등장 연출 → 마을 입장
   완전 신규 설치(localStorage 없던 상태)에서만 1회 등장(hadSave 참고)
   ============================================================ */
function screenGuardianEntry(){
  const lk=(ko,en,zh)=>S.lang==='en'?en:S.lang==='zh'?zh:ko;
  $('#screen').innerHTML=`<div class="nm-step-body nm-closet-wrap"><button class="nm-btn ghost" id="nmGuardBack">${lk('학습 화면으로','Learning screen','学习界面')}</button><h1>${lk('보호자 이메일로 이어하기','Continue with guardian email','使用监护人邮箱继续')}</h1><div id="nm-guardian-slot"></div><div id="nm-idcard-slot"></div><div id="nm-account-slot"></div></div>`;
  const canContinue=()=>stateStorageReady&&!learnerTransition&&!!stateOwnerId&&guardianAuth?.peek()?.user.id===stateOwnerId&&!guardianAuth.requiresPassword()&&membership?.contactReady();
  if(!canContinue())$('#nmGuardBack').textContent=lk('승인·로그인으로','Approval / login','审批·登录');
  $('#nmGuardBack').onclick=()=>{if(!canContinue()){location.assign('access.html');return;}guardianEntry=false;S.view='title';render();};
  renderIdCard();renderAccountCard();
}
function refreshEntryContinue(){
  const b=document.getElementById('nmGuardBack');if(!b)return;
  const ready=stateStorageReady&&!learnerTransition&&!!stateOwnerId&&guardianAuth?.peek()?.user.id===stateOwnerId&&!guardianAuth.requiresPassword()&&membership?.contactReady();
  b.textContent=ready?(S.lang==='ko'?'학습 화면으로':S.lang==='en'?'Learning screen':'学习界面'):(S.lang==='ko'?'승인·로그인으로':S.lang==='en'?'Approval / login':'审批·登录');
}
function screenWelcome(){
  const scr=$('#screen');
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const ob = { number:S.character.number||3, color:S.character.color||'blue',
    bg:S.character.bg||'plain', cape:S.character.cape||'none',
    hat:S.character.hat||'none', name:'', avatar:(S.avatar&&(S.avatar.look||S.avatar.kind))||null, grade:null, birthYear:'' };
  const NUMS=[0,1,2,3,4,5,6,7,8,9];

  /* 1단계 — 나(사람 아바타) 고르기. 고를 때까지 "다음"이 비활성. */
  function stepAvatar(){
    scr.innerHTML=`
    <div class="nm-ob">
      <div class="nm-ob-card">
        <h1 class="nm-ob-title">${lk('내 캐릭터를 골라요','Who are you?','你是谁？')}</h1>
        <p class="nm-ob-sub">${lk('마법 마을에 들어갈 나를 골라요','Pick yourself for the magic village','选一个进入魔法村的你')}</p>
        <div class="nm-av-row">
          ${(window.NM_HUMANS?NM_HUMANS.looks:[]).map(look=>`<button class="nm-av-card${ob.avatar===look.id?' sel':''}" data-av="${look.id}" aria-pressed="${ob.avatar===look.id}">
            ${window.renderHumanChar?window.renderHumanChar(NM_HUMANS.clean({look:look.id}),90):''}
            <span>${esc(L(look))}</span></button>`).join('')}
        </div>
        <p class="nm-ob-sub">${lk('이름은 직접 정하고, 옷장에서 캐릭터를 더 만들 수 있어요.','Choose a name and add more characters in the closet.','可以自己取名，也可以在衣橱添加更多角色。')}</p>
        <button class="nm-btn nm-ob-go" id="obAvNext"${ob.avatar?'':' disabled'}>${lk('다음 ›','Next ›','下一步 ›')}</button>
        <button class="nm-btn ghost nm-ob-go" id="obGuardian">${lk('가입 · 보호자 이메일로 이어하기','Register · Continue with guardian email','注册 · 使用监护人邮箱继续')}</button>
      </div>
    </div>`;
    scr.querySelectorAll('[data-av]').forEach(b=>{
      b.onclick=()=>{ ob.avatar=b.dataset.av; stepAvatar(); };
    });
    $('#obAvNext').onclick=()=>{ if(ob.avatar) stepGrade(); };
    $('#obGuardian').onclick=()=>{guardianEntry=true;render();};
  }

  /* 2단계 — 학년(2026-09-16 원장 "나이도 입력해야 돼").
     건너뛸 수 있게 둔다. 학년은 잠금에 쓰지 않고 안내에만 쓰므로, 모른다고
     해서 앱이 막히면 안 된다(모르면 안내를 안 할 뿐이다). */
  function stepGrade(){
    const opts=schoolGradeOptions();
    const year=new Date().getFullYear();
    scr.innerHTML=`
    <div class="nm-ob">
      <div class="nm-ob-card">
        <h1 class="nm-ob-title">${lk('아이에 대해 알려 주세요','Tell us about the learner','请告诉我们孩子的信息')}</h1>
        <p class="nm-ob-sub">${lk('나이와 실제 학년으로 진단의 시작 범위와 월별 계획을 준비해요. 배우는 내용은 따로 고를 수 있어요.',
          'Age and school grade help prepare a diagnostic scope and monthly plan. You can choose a different study topic.',
          '年龄和实际年级用于准备测评范围与月度计划，学习内容可以另外选择。')}</p>
        <label class="nm-ob-birth">${lk('출생연도','Birth year','出生年份')}<select id="obBirthYear"><option value="">${lk('선택해 주세요','Select year','请选择')}</option>${Array.from({length:16},(_,i)=>year-3-i).map(y=>`<option value="${y}"${String(y)===ob.birthYear?' selected':''}>${lk(y+'년생',String(y),y+'年出生')}</option>`).join('')}</select></label>
        <p class="nm-ob-grade-label">${lk('지금 다니는 학년','Current school grade','当前实际年级')}</p>
        <div class="nm-ob-grades">${opts.map(o=>
          `<button class="nm-ob-grade${ob.grade===o.g?' sel':''}" data-g="${o.g}" aria-pressed="${ob.grade===o.g}">${esc(o.label)}</button>`).join('')}</div>
        <button class="nm-btn nm-ob-go" id="obGrNext"${ob.grade==null||!ob.birthYear?' disabled':''}>${lk('다음 ›','Next ›','下一步 ›')}</button>
        <button class="nm-btn ghost nm-ob-go" id="obGrSkip">${lk('나중에 할래요','Later','以后再说')}</button>
      </div>
    </div>`;
    scr.querySelectorAll('[data-g]').forEach(b=>{
      b.onclick=()=>{ ob.grade=+b.dataset.g; stepGrade(); };
    });
    $('#obBirthYear').onchange=e=>{ob.birthYear=e.target.value;$('#obGrNext').disabled=ob.grade==null||!ob.birthYear;};
    $('#obGrNext').onclick=()=>{ if(ob.grade!=null&&ob.birthYear) draw(); };
    $('#obGrSkip').onclick=()=>{ ob.grade=null;ob.birthYear=''; draw(); };
  }

  function draw(){
    scr.innerHTML=`
    <div class="nm-ob">
      <div class="nm-ob-card">
        <h1 class="nm-ob-title">${lk('함께 갈 숫자 친구를 골라요','Pick a number friend to go with you','选一个一起走的数字朋友')}</h1>
        <p class="nm-ob-sub">${t('obSub')}</p>
        <div class="nm-ob-stage" id="obStage">
          <div class="nm-ob-pick" id="obChar">${window.renderPartyHtml?window.renderPartyHtml(NM_HUMANS.clean({look:ob.avatar}),ob,120):(window.renderNumiChar?window.renderNumiChar(ob,120):'')}</div>
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
    $('#obChar').innerHTML = window.renderPartyHtml?window.renderPartyHtml(NM_HUMANS.clean({look:ob.avatar}),ob,120):(window.renderNumiChar?window.renderNumiChar(ob,120):'');
    $('.nm-ob-num').textContent='#'+ob.number;
  }

  async function go(){
    const name=(ob.name||'').trim();
    if(!name){ toast(t('obNeedName'),false); return; }
    ob.name=name;
    /* 보호자 인증 상태에서만 클라우드 이름을 확인한다. 미인증이면 기기에 저장한다. */
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
      if(!okClaim){
        const again=await cloudGet(name).catch(()=>null);
        if(again){askResume(name,again);return;}
        btn.disabled=false;btn.textContent=t('obGo');
        toast(S.lang==='ko'?'기존 기록은 학원에 보호자 연결을 요청하거나 다른 이름을 사용해 주세요.':S.lang==='en'?'Ask your academy to link the existing profile, or choose another name.':'请联系学院关联原有记录，或使用其他名字。',false);
        return;
      }
      ob.claimedOwner=okClaim.owner;
      reveal(name);
    }catch(e){ reveal(name); }              // 클레임 실패 시에도 앱은 계속
  }

  /* 같은 이름이 이미 있을 때: 이어하기 / 다른 이름 */
  function askResume(name, existing){
    scr.innerHTML=`
    <div class="nm-ob">
      <div class="nm-ob-card">
        <div class="nm-ob-dupico"><img src="${window.NM_CHAR_BASE||'assets/characters/'}numi-wizard.png" alt="" draggable="false" style="height:64px;width:auto;vertical-align:middle"></div>
        <h1 class="nm-ob-title">${S.lang==='ko'?`'${esc(name)}' 친구가 이미 있어요!`:S.lang==='en'?`'${esc(name)}' already exists!`:`已经有叫'${esc(name)}'的朋友了！`}</h1>
        <p class="nm-ob-sub">${S.lang==='ko'?'예전에 만든 내 캐릭터라면 이어서 할 수 있어요.':S.lang==='en'?'If that was you, you can continue your adventure.':'如果那是你，可以继续冒险。'}</p>
        <button class="nm-btn nm-ob-go" id="obResume">${S.lang==='ko'?'이건 나예요! 이어하기 ▶':S.lang==='en'?"That's me! Continue ▶":'是我！继续 ▶'}</button>
        <button class="nm-btn ghost nm-ob-go" id="obRename">${S.lang==='ko'?'다른 이름 쓸래요':S.lang==='en'?'Pick another name':'换个名字'}</button>
      </div>
    </div>`;
    $('#obResume').onclick=()=>{
      if(!backupBeforeCloudResume(existing.owner_id))return;
      guardianEntry=false;
      const st=existing&&existing.state?existing.state:{};
      S={...defaults(),...st};
      S.name=name; S.onboarded=true; S.cloudLinked=true;
      S.cloudOwnerId=existing.owner_id;
      if(!S.account||!S.account.status)S.account={status:'trial',code:null,checkedAt:0};
      normalizeLoadedState(false);
      // 보호자 인증은 기록 소유권만 확인한다. 학원 승인 상태는 별도로 유지한다.

      if(!S.character)S.character={number:3,color:'blue',bg:'plain',cape:'none',hat:'none'};
      if(S.character.hat===undefined)S.character.hat='none'; // 기존 저장본 하위호환
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
          <div class="nm-ob-rchar" id="obRchar">${window.renderPartyHtml?window.renderPartyHtml(NM_HUMANS.clean({look:ob.avatar}),ob,140):(window.renderNumiChar?window.renderNumiChar(ob,140):'')}</div>
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
    S.character = {number:ob.number,color:ob.color,bg:ob.bg,cape:ob.cape,hat:ob.hat};
    S.avatar = NM_HUMANS.clean({id:'avatar-1',look:ob.avatar});
    S.avatarCollection=[S.avatar];
    S.name = ob.name;
    if(ob.grade!=null) setSchoolGrade(ob.grade,ob.birthYear);
    S.onboarded = true;
    if(ob.claimedOwner&&isGuardianOwner(ob.claimedOwner)){S.cloudLinked=true;S.cloudOwnerId=ob.claimedOwner;}
    save();
    render();
  }

  stepAvatar();
}

/* ============================================================
   마을(Living Town) — map.jpg 위 드래그/줌 + 구름/분수/걸어다니는 숫자친구
   지도: 2026-09-02 town-map-v2(2000×1342, 3/4 시점 그림책 삽화, 마을지도-작화지시서.md).
   건물↔등급 배치: 서쪽 아기 마을(버섯집·모래밭·그네)=BASIC 수의 나라 · 책 지붕 도서관=PRIME ·
   남쪽 집 2채=ADVANCE · 북쪽 언덕 위 탑=CHALLENGE(경시의 탑) · 필름 릴 극장=영상관 ·
   서쪽 천막 시장=마법사 옷장(꾸미기). 정자=분수 연출 자리. 동쪽 다리·학교, 호숫가 선착장은
   관문(연결)용으로 비워 둠 — 나중에.
   좌표는 % — 원본 px를 2000×1342로 나눈 값. 지도가 바뀌면 여기와 #townFountain·
   sparkle·walker 스폰만 다시 재면 된다(styles.css #townWorld 크기도 함께). */
const TOWN_WORLD_W=2000, TOWN_WORLD_H=1342;
const TOWN_SPOTS=[
  { tier:'numberland',   pos:'left:4.5%;top:65%;width:31%;height:15%',   tag:'📖 BASIC',     sub:{ko:'베이직',en:'Basic',zh:'BASIC'} },
  { tier:'beginner',     pos:'left:42%;top:37%;width:14%;height:21%',    tag:'🏛️ PRIME',     sub:{ko:'프라임',en:'Prime',zh:'PRIME'} },
  { tier:'advanced',     pos:'left:29.5%;top:4%;width:7%;height:16%',    tag:'⛰️ CHALLENGE', sub:{ko:'챌린지',en:'Challenge',zh:'CHALLENGE'} },
  { tier:'intermediate', pos:'left:46%;top:60%;width:19%;height:16%',    tag:'🏠 ADVANCE',   sub:{ko:'어드밴스',en:'Advance',zh:'ADVANCE'} },
  { tier:'_theater',     pos:'left:56.5%;top:31.5%;width:13.5%;height:19%', tag:{ko:'🎬 극장',en:'🎬 Theater',zh:'🎬 剧场'},    sub:{ko:'영상',en:'Videos',zh:'视频'}, lockIcon:'🎬' },
  { tier:'_closet',      pos:'left:5%;top:35%;width:21%;height:15%',     tag:{ko:'🪄 꾸미기',en:'🪄 Dress Up',zh:'🪄 装扮'},      sub:{ko:'마법사 옷장',en:"Wizard's Closet",zh:'魔法师衣橱'} }
];
function tierById(id){return CUR.tiers.find(x=>x.id===id);}
function tierOpen(tier){return !!(tier&&tier.levels.some(l=>l.available&&(l.units||[]).some(u=>UNITS[u])));}
const TOWN_ALWAYS_OPEN=['_closet','_theater']; // 잠금 아이콘 없이 항상 열리는 스팟(등급 무관)

/* 마을세계관-설계.md §3 — 형제 서비스로 나가는 관문(표지판). 절대 잠그지 않는다
   (자유 선택 원칙) — 열려 있으면 새 탭으로 나가고, 아직 없으면 "준비 중"으로만
   보여 준다. 각 link는 {name, url, open:true} 또는 {name, soon:true}.
   2026-09-03 원장 지시: 넘버스 마을에선 필즈·하이퍼포커스는 연결하지 않는다 —
   동쪽 관문은 탐험대(지도 맞히기 게임) 하나만. */
const TOWN_GATES=[
  { id:'west',  pos:'left:1.5%;top:47%', icon:'🧭',
    name:{ko:'도형 나라',en:'Geometry World',zh:'图形王国'},
    links:[
      {name:{ko:'지오메트리 월드',en:'Geometry World',zh:'几何世界'}, url:'../geometry/', open:true}
    ] },
  { id:'east',  pos:'left:84%;top:42%', icon:'🗺️',
    name:{ko:'탐험대 — 지도 맞히기',en:'Explorer — Map Quiz',zh:'探险队 — 认地图'},
    links:[
      {name:{ko:'세계 지도 맞히기 게임',en:'World Map Quiz Game',zh:'世界地图问答游戏'}, url:'../world-explorer/', open:true}
    ] },
  { id:'south', pos:'left:75%;top:83%', icon:'⛵',
    name:{ko:'바깥 세상 항구',en:'Harbor to the World',zh:'通往世界的港口'},
    links:[
      /* 2026-09-03: 만화 95편(data/story-comics.js)에 문항(네 컷 순서 맞히기)을 얹어 열림.
         url이 아니라 view — 새 탭이 아니라 이 앱 안의 화면(S.view='histquiz')으로 이동한다. */
      {name:{ko:'수학사 퀴즈',en:'Math History Quiz',zh:'数学史问答'}, view:'histquiz'},
      {name:{ko:'NCP',en:'NCP',zh:'NCP'}, soon:true}
    ] }
];
/* 링크가 열려 있는지 — open:true(새 탭 url) 또는 view(앱 내 화면 전환)면 열림.
   (설정 파일 조회 없음, 원장 지시로 단순화). */
function gateLinkOpen(link){ return !!(link&&(link.open||link.view)); }
/* 관문 탭 → 링크 목록 모달. showTownModal(#tmodal, 단일 버튼)과 달리 링크가
   여러 개일 수 있어 body에 직접 붙였다 뗀다(gateModalHtml과 같은 패턴) —
   .nm-tmodal/.nm-tmcard CSS는 그대로 재사용해 같은 톤을 낸다. */
function showGateLinksModal(gate){
  if($('#nmGateLinksModal'))return;
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const rows=(gate.links||[]).map(link=>{
    if(gateLinkOpen(link)){
      if(link.view){
        return `<button class="nm-btn full" data-view="${esc(link.view)}">${esc(L(link.name))} →</button>`;
      }
      /* 체험 중에는 다른 서비스로 나가지 않는다 — 앱 안 화면(view)은 그대로 둔다. */
      if(externalBlocked()){
        return `<button class="nm-btn full ghost" data-gatecode="1">🔒 ${esc(L(link.name))} · ${lk('승인 후 이용','Needs an approval code','授权后可用')}</button>`;
      }
      return `<button class="nm-btn full" data-url="${esc(link.url)}">${esc(L(link.name))} →</button>`;
    }
    return `<button class="nm-btn full ghost" disabled>${esc(L(link.name))} · ${lk('준비 중','Coming soon','准备中')}</button>`;
  }).join('');
  const wrap=document.createElement('div');
  wrap.className='nm-tmodal on';
  wrap.id='nmGateLinksModal';
  wrap.innerHTML=`<div class="nm-tmcard">
    <h3>${gate.icon} ${esc(L(gate.name))}</h3>
    <p>${lk('마을 밖으로 나가요. 돌아오면 이 자리예요.','Leaving the village. You come back right here.','走出村庄，回来时还在这里。')}</p>
    <div class="nm-gatelinks-list">${rows}</div>
    <button class="close" id="nmGateLinksClose">${lk('닫기','Close','关闭')}</button>
  </div>`;
  document.body.appendChild(wrap);
  const close=()=>wrap.remove();
  wrap.querySelectorAll('[data-url]').forEach(b=>{
    b.onclick=()=>{ window.open(b.dataset.url,'_blank','noopener'); };
  });
  wrap.querySelectorAll('[data-gatecode]').forEach(b=>{
    b.onclick=()=>{ close(); showGateModal(); };
  });
  /* view 링크 — 새 탭이 아니라 이 앱 안의 화면으로 이동(마을 밖으로 안 나감) */
  wrap.querySelectorAll('[data-view]').forEach(b=>{
    b.onclick=()=>{ close(); S.view=b.dataset.view; save(); render(); };
  });
  $('#nmGateLinksClose').onclick=close;
  wrap.addEventListener('click',e=>{ if(e.target===wrap) close(); });
}

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
    const open=TOWN_ALWAYS_OPEN.indexOf(sp.tier)>=0?true:tierOpen(tier);
    zones+=`<button class="nm-zone ${open?'':'locked'}" style="${sp.pos}" data-spot="${sp.tier}" aria-label="${esc(townDestinationLabel(sp.tier))} · ${esc(S.lang==='ko'?'들어가기':S.lang==='en'?'Enter':'进入')}">
      ${open?'<div class="nm-halo"></div>':`<div class="nm-lockico">${sp.lockIcon||'🔒'}</div>`}
      <span class="nm-zlabel">${esc(townDestinationLabel(sp.tier))}${tier?`<small>${esc(L(tier.subtitle).split(' · ')[0])}</small>`:''}</span>
    </button>`;
  });
  let gates='';
  TOWN_GATES.forEach(g=>{
    gates+=`<button class="nm-gate" style="${g.pos}" data-gate="${g.id}">${g.icon} <span>${esc(L(g.name))}</span></button>`;
  });
  scr.classList.add('nm-town','nm-town-illustrated');
  scr.dataset.characterMode='2d';
  scr.innerHTML=`
    <div id="townVp" class="is-illustrated" tabindex="0" aria-label="${S.lang==='ko'?'마을 지도':S.lang==='en'?'Village map':'村庄地图'}">
      <div id="townWorld">
        <div class="ncloud a"><span class="puff" style="width:64px;height:64px;left:0;top:-8px"></span><span class="puff" style="width:48px;height:48px;left:44px;top:0"></span><span class="puff" style="width:40px;height:40px;left:78px;top:6px"></span><span class="num">7</span></div>
        <div class="ncloud b"><span class="puff" style="width:70px;height:70px;left:0;top:-10px"></span><span class="puff" style="width:50px;height:50px;left:50px;top:2px"></span><span class="num">10</span></div>
        <div class="ncloud c"><span class="puff" style="width:56px;height:56px;left:0;top:-6px"></span><span class="puff" style="width:44px;height:44px;left:40px;top:2px"></span><span class="num">5</span></div>
        <div id="townFountain"></div>
        ${zones}
        ${gates}
        <div class="nb nb-player nb-walker" id="nbNumi"><div class="speech"></div>
          <div class="nb-name">${esc(avatarName())}</div>
          <div class="nb-img nb-svg">${window.renderWalker?window.renderWalker(avatarProfile(),60):(window.renderHumanChar?window.renderHumanChar(avatarProfile(),56):'<img src="assets/characters/kid-boy.png" alt="">')}</div>
          <div class="shadow"></div></div>
        <div class="nb nb-buddy" id="nbBuddy"><div class="speech"></div>
          <div class="nb-img nb-svg">${window.renderNumiChar?window.renderNumiChar(S.character,44):''}</div>
          <div class="shadow"></div></div>
        <div class="nb nb-elder nb-walker" id="nbElder"><div class="speech"></div>
          <div class="nb-name">${S.lang==='ko'?'안내 마법사':S.lang==='en'?'Guide Wizard':'向导魔法师'}</div>
          <div class="nb-img nb-svg">${window.renderWalker?window.renderWalker('elder',56):(window.renderHumanChar?window.renderHumanChar('elder',52):'')}</div>
          <div class="shadow"></div></div>
        <div class="nb nb-doc nb-walker" id="nbDoc"><div class="speech"></div>
          <div class="nb-name">${S.lang==='ko'?'독쌤':S.lang==='en'?'Doc-T':'独先生'}</div>
          <div class="nb-img nb-svg">${window.renderWalker?window.renderWalker('doc',56):(window.renderHumanChar?window.renderHumanChar('doc',52):'')}</div>
          <div class="shadow"></div></div>
        <div class="nb" id="nbPoco"><div class="speech"></div>
          <div class="nb-img nb-svg">${window.renderNumiChar?window.renderNumiChar({number:3,color:'gold',bg:'plain'},52):'<img src="assets/characters/poco-3.png" alt="Poco">'}</div>
          <div class="shadow"></div></div>
        <div class="nb" id="nbMomo"><div class="speech"></div>
          <div class="nb-img nb-svg">${window.renderNumiChar?window.renderNumiChar({number:8,color:'pink',bg:'plain'},52):'<img src="assets/characters/momo-8.png" alt="Momo">'}</div>
          <div class="shadow"></div></div>
      </div>
    </div>
    <div class="nm-town-hud brand"><span>${t('mapTitle')}</span><button type="button" class="nm-back" id="townLeave">← ${S.lang==='ko'?'마을 나가기':S.lang==='en'?'Leave village':'离开村庄'}</button></div>
    <p class="nm-town-walk-hint">${S.lang==='ko'?'지도의 빈 곳을 누르면 걸어요.':S.lang==='en'?'Tap an empty spot to walk.':'点地图空白处即可行走。'}</p>
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
      <button class="nm-iconbtn nm-mzbtn" id="townMagazine" title="${S.lang==='ko'?'매거진':S.lang==='en'?'Magazine':'杂志'}">📰</button>
      <button class="nm-iconbtn nm-mailbtn" id="townMail" title="${S.lang==='ko'?'편지함':S.lang==='en'?'Mailbox':'信箱'}">📬${mailboxUnreadCount()>0?`<span class="nm-mb-dot">${mailboxUnreadCount()}</span>`:''}</button>
      <button class="nm-iconbtn nm-rpbtn" id="townReport" title="${S.lang==='ko'?'리포트':S.lang==='en'?'Report':'学习报告'}">📊</button>
    </div>
    <div class="nm-town-hud ctrls">
      <button class="nm-iconbtn" id="townMute">🔇</button>
      <button class="nm-iconbtn" id="townMe" title="${S.lang==='ko'?'내 위치 따라가기':S.lang==='en'?'Follow my position':'跟随我的位置'}" aria-pressed="false">◎</button>
      <button class="nm-iconbtn" id="townZin" aria-label="${S.lang==='ko'?'확대':S.lang==='en'?'Zoom in':'放大'}">＋</button>
      <button class="nm-iconbtn" id="townZout" aria-label="${S.lang==='ko'?'축소':S.lang==='en'?'Zoom out':'缩小'}">－</button>
    </div>
    <div class="nm-tmodal" id="tmodal">
      <div class="nm-tmcard">
        <h3 id="tmTitle"></h3><p id="tmDesc"></p>
        <button class="go" id="tmGo"></button>
        <button class="close" id="tmClose">${S.lang==='ko'?'닫기':S.lang==='en'?'Close':'关闭'}</button>
      </div>
    </div>`;
  const tools=scr.querySelector('.nm-town-hud.info'),toolbox=document.createElement('details');
  toolbox.className='nm-town-toolbox';
  toolbox.innerHTML=`<summary>${S.lang==='ko'?'마을 메뉴':S.lang==='en'?'Village menu':'村庄菜单'} ☰</summary><div class="nm-town-tool-list"></div>`;
  const panel=toolbox.querySelector('div'), more=document.createElement('details');
  more.className='nm-town-more';
  more.innerHTML=`<summary>${S.lang==='ko'?'더 보기':S.lang==='en'?'More':'更多'}</summary><div class="nm-town-extra-list"></div>`;
  const list=more.querySelector('div');
  const places=document.createElement('nav');places.className='nm-town-place-list';places.setAttribute('aria-label',S.lang==='ko'?'지도 속 장소':S.lang==='en'?'Map locations':'地图地点');
  TOWN_SPOTS.forEach(sp=>{const b=document.createElement('button');b.type='button';b.className='nm-iconbtn';b.dataset.place=sp.tier;b.textContent=townDestinationLabel(sp.tier);b.onclick=()=>enterTownDestination(sp.tier);places.appendChild(b);});list.appendChild(places);
  while(tools.firstChild)list.appendChild(tools.firstChild);
  panel.appendChild(scr.querySelector('#roadBanner'));panel.appendChild(more);tools.appendChild(toolbox);
  toolbox.open=matchMedia('(min-width:760px), (min-width:600px) and (max-height:500px)').matches;
  ['townCourseRoad','townDex','townMagazine','townMail','townReport'].forEach(id=>{const button=scr.querySelector('#'+id);const label=document.createElement('span');label.textContent=button.title;button.appendChild(label);});
  TOWN_GATES.forEach(g=>{const button=document.createElement('button');button.type='button';button.className='nm-iconbtn';button.dataset.townGate=g.id;button.textContent=g.icon+' '+L(g.name);button.onclick=()=>showGateLinksModal(g);list.appendChild(button);});
  list.appendChild(scr.querySelector('.nm-town-hud.ctrls'));
  toolbox.addEventListener('keydown',e=>{if(e.key==='Escape'){toolbox.open=false;toolbox.querySelector('summary').focus();}});
  $('#townLeave').onclick=()=>{S.view='title';S.unitReturn=null;S._fromRoadmap=false;S._fromCourseRoad=false;save();render();};
  townCleanup=initTownWorld(scr);
  // Buildings open directly; tapping empty map space optionally moves the avatar.
  const rb=$('#roadEnter');if(rb)rb.onclick=()=>{S.view='roadmap';save();render();};
  const gb=$('#gradeEnter');if(gb)gb.onclick=()=>{S.view='gradecourse';save();render();};
  const mb=$('#townMail');if(mb)mb.onclick=()=>{S._mbWeek=null;S.view='mailbox';save();render();};
  const cr=$('#townCourseRoad');if(cr)cr.onclick=()=>{S._roadFocus=null;S.view='courseroad';save();render();};
  const db=$('#townDex');if(db)db.onclick=()=>{S._dexFrom='town';S.view='symboldex';save();render();};
  const mz=$('#townMagazine');if(mz)mz.onclick=()=>{S._mzOpen=null;S.view='magazine';save();render();};
  const rp=$('#townReport');if(rp)rp.onclick=()=>{S.view='report';save();render();};
  maybeShowR0Banner(scr);
  if(S.onboarded && !S.avatar){
    showAvatarMigrateModal();
  }else{
    /* 출석(§6) — 아바타 이주 모달을 띄우는 참(아직 사람을 안 골랐을 때)엔
       건드리지 않는다. 사람을 이미 골랐으면(온보딩 완료 프로필의 정상 경로)
       그날 처음 마을에 들어온 순간에만 카드가 뜬다(checkAttendance가 하루
       한 번만 값을 반환). */
    if(pendingAttendanceDay!=null){showAttendCard(scr,pendingAttendanceDay);pendingAttendanceDay=null;}
  }
}
/* 출석 카드 — 자동 소멸(약 3.5초) + 탭하면 즉시 닫힘. 잠금 없는 비차단 알림이라
   render()를 다시 부르지 않고 DOM만 직접 붙였다 뗀다(재렌더로 지워지면 화면 전환
   중 사라져 버려 "오늘 왔구나" 메시지를 놓칠 수 있다). */
function showAttendCard(scr,days){
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const card=document.createElement('div');
  card.className='nm-attend-card';
  card.innerHTML=`${window.renderHumanChar?window.renderHumanChar('doc',48):''}
    <div class="nm-attend-text">
      <b>${lk('오늘도 왔구나!','You came today!','今天也来了！')}${S.attend.reward?` 🪙 +${S.attend.reward}`:''}</b>
      <span>${lk(`출석 ${days}일째`,`Day ${days}`,`第${days}天`)}</span>
    </div>`;
  scr.appendChild(card);
  const hide=()=>{ if(!card.parentNode)return; card.classList.add('hide'); setTimeout(()=>card.remove(),260); };
  card.onclick=hide;
  setTimeout(hide,3500);
}

/* ── 마을 이주 모달(§1) — 온보딩 이전(구버전)에 만들어진 저장본은 S.avatar가 없다.
   마을에 들어올 때 딱 한 번, 사람 아바타를 고르게 한다(닫기 버튼 없음 — 반드시 골라야 함).
   #tmodal(등급 소개용 텍스트 모달)과는 별개 오버레이 — body에 직접 붙였다 뗀다
   (gateModalHtml/showGateModal과 같은 패턴). */
function showAvatarMigrateModal(){
  if($('#nmAvMigrate'))return;
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const wrap=document.createElement('div');
  wrap.className='nm-gate-overlay';
  wrap.id='nmAvMigrate';
  wrap.innerHTML=`<div class="nm-gate-card">
    <h3>${lk('너는 누구야?','Who are you?','你是谁？')}</h3>
    <p>${lk('마법 마을에 들어갈 나를 골라요','Pick yourself for the magic village','选一个进入魔法村的你')}</p>
    <div class="nm-av-row">${NM_HUMANS.looks.map(look=>`<button class="nm-av-card" data-av="${look.id}">${window.renderHumanChar?window.renderHumanChar(NM_HUMANS.clean({look:look.id}),90):''}<span>${esc(L(look))}</span></button>`).join('')}</div>
  </div>`;
  document.body.appendChild(wrap);
  wrap.querySelectorAll('[data-av]').forEach(b=>{
    b.onclick=()=>{
      S.avatar=NM_HUMANS.clean({id:'avatar-1',look:b.dataset.av});S.avatarCollection=[S.avatar];
      save();
      wrap.remove();
      render();
    };
  });
}

/* ── R0 추천 배너 — N-15(수의 나라) 최초 완주 직후 다음 마을 진입 때 1회 ──
   stepStamp()가 S.pendingR0Banner를 세운다. 여기서 소비(끔)하고 seenR0Banner를
   영구히 켜 프로필당 한 번만 뜨게 한다. 잠금 아님 — [나중에]로 그냥 닫아도 되고,
   다음에 또 마을에 들어와도 다시 뜨지 않는다(추천은 1회, 강요 아님). */
function maybeShowR0Banner(scr){
  if(!S.pendingR0Banner)return;
  S.pendingR0Banner=false;S.seenR0Banner=true;save();
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const wrap=document.createElement('div');
  wrap.className='nm-r0-overlay';
  wrap.innerHTML=`<div class="nm-r0-card">
    <div class="nm-r0-ico">🌱</div>
    <div class="nm-r0-title">${lk('수의 나라를 다 여행했어요!','You’ve explored all of Number Land!','你游遍了数字王国！')}</div>
    <p class="nm-r0-body">${lk('이제 연산 첫걸음(R0)으로 떠나볼까요?','Ready to set off on First Steps (R0)?','现在要出发去计算第一步(R0)了吗？')}</p>
    <button class="nm-r0-go" id="r0BannerGo">🌱 ${lk('연산 첫걸음 보러가기','See First Steps','看看第一步')}</button>
    <button class="nm-r0-later" id="r0BannerLater">${lk('나중에','Later','以后再说')}</button>
  </div>`;
  scr.appendChild(wrap);
  wrap.querySelector('#r0BannerGo').onclick=()=>{wrap.remove();S._roadFocusChapter='R0';S.view='roadmap';save();render();};
  wrap.querySelector('#r0BannerLater').onclick=()=>{wrap.remove();};
}

/* ─── roadmap 헬퍼 ─── */
function roadmapNextLabel(){
  if(!window.NM_ROADMAP)return '';
  /* 지도 화면의 "여기부터!"와 같은 유닛을 가리켜야 한다 — 같은 함수를 쓴다(2026-09-23) */
  const uid=findNextRoadUnit();
  if(uid){
    const nm=UNITS[uid]?L(UNITS[uid].title):'...';
    return S.lang==='ko'?`이어서: ${nm}`:S.lang==='en'?`Continue: ${nm}`:`继续: ${nm}`;
  }
  if(hasRoadCourseContext())return S.lang==='ko'?'선택한 시작점 이후 스토리 완료':S.lang==='en'?'Stories from your starting point complete':'所选起点之后的故事已完成';
  return S.lang==='ko'?'🏆 전체 완료!':S.lang==='en'?'🏆 All done!':'🏆 全部完成！';
}

/* ─── screenRoadmap: 징검다리 길 ─── */
function screenRoadmap(){
  if(townCleanup){townCleanup();townCleanup=null;}
  const scr=$('#screen');
  if(!window.NM_ROADMAP){scr.innerHTML='<div class="nm-card">roadmap.js 없음</div>';return;}
  const road=NM_ROADMAP;
  const nextId=findNextRoadUnit();
  /* 3D 여행 그림책(app/story3d, 2026-09-26)과 그 2D 대체(단계 꼬리표 줄)가 같이 쓰는 단계 목록 —
     아래 단계 머리와 같은 계산(도장 받은 유닛 비율). 잠그지 않는다. */
  const storyStages=roadStoryStages(road);
  const storyCur=roadStoryCurrentStage(road,nextId);
  let html=`<div class="nm-road-wrap nm-storyroad">
    <div class="nm-road-header">
      <button class="nm-back" id="roadBack">← ${navigationLabel('town')}</button>
      <div class="nm-unit-title"><span class="nm-road-title-ic" aria-hidden="true">🗺️</span> ${L(road.title)}</div>
      <div class="nm-road-sub">${L(road.subtitle)}</div>
      <div class="nm-road-nav">
        <button class="nm-btn nm-btn-secondary" id="roadSuggested" ${nextId?'':'disabled'}>${S.lang==='ko'?'추천 위치':S.lang==='en'?'Suggested start':'推荐位置'}</button>
        <button class="nm-btn nm-btn-secondary" id="roadBrowseStart">${S.lang==='ko'?'처음부터 둘러보기':S.lang==='en'?'Browse from the beginning':'从头浏览'}</button>
      </div>
    </div>
    <div class="nm-story-hero" id="storyHero">
      <nav class="nm-story-stages" aria-label="${esc(S.lang==='ko'?'학습 단계':S.lang==='en'?'Stages':'学习阶段')}">${storyStages.map(s=>`<button type="button" class="nm-story-chip${s.key===storyCur?' here':''}" data-stage="${esc(s.key)}" style="--st:${esc(s.accent)}"><span aria-hidden="true">${s.icon||''}</span><b>${esc(s.name)}</b><small>${s.pct}%</small></button>`).join('')}</nav>
    </div>
    <div class="nm-road-path">`;

  /* 단계 머리(2026-09-08) — 챕터 60개가 평평하게 늘어서 있어 "지금 어느 단계인지"가 안 보였다.
     data/stages.js 의 단계(2026-09-29 고등을 과목별로 나눠 열 단계)로 묶어 준다. 광고·주간 학습지 표지와 같은 이름을 쓴다.
     stages.js 가 없으면(옛 캐시) 조용히 건너뛴다 — 화면이 죽지 않게. */
  let lastStageKey=null;
  const stageOf=window.NM_STAGE_OF_CHAPTER||null;
  road.chapters.forEach((ch,ci)=>{
    if(stageOf&&ch.id){
      const st=stageOf(ch.id);
      if(st&&st.key!==lastStageKey){
        lastStageKey=st.key;
        /* 그 단계 유닛의 진도 — 완료 비율만 보여 주고 잠그지 않는다(자유 선택 원칙). */
        let tot=0,don=0;
        st.chapters.forEach(cid=>{
          const c2=road.chapters.find(x=>x.id===cid);
          (c2&&c2.units||[]).forEach(uid=>{ if(UNITS[uid]){tot++; if(stepDone(uid,'stamp'))don++;} });
        });
        const pct=tot?Math.round(don/tot*100):0;
        /* 이야기 장 번호 + 한 줄 이야기(2026-09-26, 원장 "스토리가 있어야지") — 3D 그림책과 같은 글 */
        const chN=storyStages.findIndex(x=>x.key===st.key)+1;
        const beat=STORY_BEATS[st.key]?L(STORY_BEATS[st.key]):'';
        html+=`<div class="nm-road-stage" data-stage="${esc(st.key)}" style="--st:${esc(st.accent||'#0E2C57')}">
          ${chN>0?`<div class="nm-road-stage-eb">${esc(S.lang==='ko'?`제${chN}장`:S.lang==='en'?`Chapter ${chN}`:`第${chN}章`)}</div>`:''}
          <div class="nm-road-stage-top"><span class="nm-road-stage-ic">${st.icon||''}</span>
            <b>${esc(L(st.name).split(' — ')[0])}</b>
            <span class="nm-road-stage-band">${esc(L(st.band))}</span></div>
          ${beat?`<p class="nm-road-stage-beat">${esc(beat)}</p>`:''}
          <div class="nm-road-stage-bar"><i style="width:${pct}%"></i></div>
          <div class="nm-road-stage-meta">${esc(L(st.meta))} · ${pct}%</div>
        </div>`;
      }
    }
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
    html+=`<div class="nm-road-chapter ${chapDone?'done':''}" data-chid="${esc(ch.id||'')}">
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
  const goSuggested=(focus)=>{
    const el=scr.querySelector('.nm-road-stone.next');
    if(el){el.scrollIntoView({block:'center'});if(focus)el.focus({preventScroll:true});}
  };
  scr.querySelectorAll('.nm-road-stone,.nm-road-gamestone').forEach(el=>{
    el.setAttribute('role','button');el.tabIndex=0;
    el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}};
  });
  $('#roadSuggested').onclick=()=>goSuggested(true);
  $('#roadBrowseStart').onclick=()=>{
    scr.querySelector('.nm-road-wrap').scrollTop=0;
    const first=scr.querySelector('.nm-road-stone,.nm-road-gamestone');
    if(first)first.focus({preventScroll:true});
  };

  /* R0 배너의 "보러가기"가 세운 챕터 포커스 — courseroad의 scrollIntoView와 같은 패턴.
     한 번 쓰고 지운다(다음 재렌더 때 다시 스크롤 튀지 않게). */
  /* 3D 그림책이 서면 첫 화면은 그림책(아이가 추천 단계 옆에 서 있다)이고, 목록으로 자동으로 내려가지 않는다.
     3D 를 못 쓰면 예전처럼 추천 위치로 바로 내려간다. */
  let autoSuggest=false;
  const returning=restoreRoadVisit&&roadVisitSnapshot;
  restoreRoadVisit=false;
  if(returning){
    /* 아래 3D 머리의 자리를 먼저 잡은 뒤 복귀한다. 먼저 scrollTop을 넣으면
       머리 높이가 늘어날 때 브라우저의 스크롤 고정이 다시 위치를 밀어 버린다. */
  }else if(S._roadFocusChapter){
    const chEl=scr.querySelector(`.nm-road-chapter[data-chid="${S._roadFocusChapter}"]`);
    if(chEl)chEl.scrollIntoView({block:'start'});
    S._roadFocusChapter=null;
  }else if(hasRoadCourseContext())autoSuggest=true;
  const goStage=key=>roadScrollToStage(scr,key);
  scr.querySelectorAll('.nm-story-chip[data-stage]').forEach(b=>{b.onclick=()=>goStage(b.dataset.stage);});
  mountStory3DInto(scr,storyStages,storyCur,nextId,{
    onStage:goStage,
    onHere:()=>goSuggested(true),
    onFail:()=>{ if(autoSuggest)goSuggested(false); }
  });
  if(returning){
    const wrap=scr.querySelector('.nm-road-wrap');
    const selected=scr.querySelector(`.nm-road-stone[data-uid="${returning.uid}"]`);
    wrap.scrollTop=returning.scrollTop;
    if(selected)selected.focus({preventScroll:true});
  }

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
    el.onclick=()=>{
      /* '../' 로 시작하면 넘버스 밖(다른 서비스)이다 — 체험 중에는 막는다.
         labs/*.html 같은 앱 안 링크는 그대로 열린다. */
      if(externalBlocked()&&/^\.\.\//.test(el.dataset.link||'')){showGateModal();return;}
      window.open(el.dataset.link,'_blank','noopener');
    };
  });
}

/* ── 스토리 모드의 장(章)마다 한 줄 이야기 (2026-09-26, 원장 "스토리가 있어야지") ──
   마을 세계관(마을세계관-설계.md — 북쪽 경시의 탑, 동쪽 다리 건너 중등·고등)과 data/stages.js 의
   단계 설명(□가 자라 x, 해발과 해저 …)에서만 가져온 분위기 글이다. 새 수학 내용을 지어내지 않는다. */
const STORY_BEATS={
  numberland:{ko:'여행은 병아리들이 사는 수의 나라에서 시작돼요. 톡톡 짚으며 하나, 둘, 셋 — 마지막 수가 전체 개수예요.',
    en:'The journey begins in Number Land, where the chicks live. Tap and count one, two, three — the last number tells how many.',
    zh:'旅程从小鸡们住的数字之国开始。点一点，数一、二、三——最后的数就是总数。'},
  sprout:{ko:'마을 밭에 새싹이 돋았어요. 숫자 친구와 짝을 지어 10을 만들면 계산이 쑥쑥 자라요.',
    en:'Sprouts are coming up in the village field. Pair up with your number friend to make 10, and your sums start to grow.',
    zh:'村子的田里冒出了新芽。和数字朋友配对凑成10，计算就会一点点长大。'},
  leap:{ko:'새싹이 로켓처럼 뛰어올라요. 큰 수도 조각조각 쪼개면 곱셈이 가벼워져요.',
    en:'The sprout leaps up like a rocket. Split a big number into pieces and multiplication gets light.',
    zh:'新芽像火箭一样跃起。把大数拆成小块，乘法就变轻了。'},
  mastery:{ko:'수와 수 사이의 비밀 관계를 찾으면 왕관이 반짝여요. 계산을 줄이는 마법을 모아요.',
    en:'Find the secret links between numbers and the crown begins to shine. Collect the magic that makes calculating shorter.',
    zh:'找到数与数之间的秘密关系，王冠就会闪闪发光。收集让计算变短的魔法吧。'},
  tower:{ko:'마을 북쪽, 어려운 문제를 좋아하는 아이들이 오르는 탑이에요. 건너뛰어도 괜찮아요 — 언제든 돌아올 수 있어요.',
    en:'North of the village stands the tower for children who love hard puzzles. You may skip it and come back any time.',
    zh:'村子北边，是喜欢难题的孩子们攀登的塔。跳过也没关系——随时都可以回来。'},
  middle:{ko:'동쪽 다리를 건너면 기호가 바뀌는 땅이에요. 초등의 □가 자라 x가 되고, 해발과 해저가 음수가 돼요.',
    en:'Cross the east bridge into the land where symbols change. The □ from Grade 1 grows into x, and altitude and depth become negative numbers.',
    zh:'走过东边的桥，就是符号改变的土地。小学的□长成了x，海拔和海底变成了负数。'},
  /* 고등 네 과목(2026-09-29 — 'high' 한 장을 과목별 네 장으로). 글은 data/curriculum.js 의 같은 tier desc 에서 */
  common1:{ko:'다항식의 탑에 올라요. 괄호 두 개를 곱하는 것부터 판별식·근의 공식·행렬까지 — 다항식을 다루는 손이 한 단계 더 정교해져요.',
    en:'Climb the Tower of Polynomials. From multiplying two brackets to the discriminant, the quadratic formula and matrices — handling polynomials gets a level more precise.',
    zh:'登上多项式之塔。从两括号相乘到判别式、求根公式、矩阵——处理多项式的手法更进一层。'},
  common2:{ko:'도형의 방정식 나라예요. 두 점 사이의 거리부터 직선·원의 방정식까지 — 좌표평면 위의 도형을 식으로 붙잡아요.',
    en:'This is the Land of Coordinate Geometry. From the distance between two points to lines and circles — pin down shapes on the plane with equations.',
    zh:'这里是图形方程之国。从两点间的距离到直线、圆的方程——用方程把坐标平面上的图形定住。'},
  algebra:{ko:'기호의 탑에서 새 기호들이 기다려요. 지수 사다리를 거꾸로 읽는 log, 이미 아는 마법에 새 옷을 입힌 Σ — 새 기호를 하나씩 만나요.',
    en:'New symbols are waiting in the Tower of Symbols. log reads the exponent ladder backward, Σ dresses old magic in new clothes — meet the new symbols one by one.',
    zh:'符号之塔里，新的符号在等你。反着读指数梯子的log，给旧魔法换新衣的Σ——一个个认识新符号。'},
  calculus1:{ko:'구름 걸린 변화의 정상이에요. x가 다가가는 값부터 순간의 기울기, 잘게 쪼개 다 더하기까지 — 로드맵의 마지막 봉우리예요.',
    en:'The cloud-wrapped Summit of Change. From the value x approaches to the instantaneous slope and adding up thin pieces — the final peak of the roadmap.',
    zh:'云雾缭绕的变化之巅。从x趋近的值到瞬时斜率，再到把细小碎片全部加起来——路线图的最后一座山峰。'}
};
/* ── 스토리 모드 3D 그림책(app/story3d) 도우미 (2026-09-26) ──
   단계 목록: 지도 챕터에 처음 나오는 순서대로, 단계 머리와 같은 진도 계산(잠금 없음). */
function roadStoryStages(road){
  const stageOf=window.NM_STAGE_OF_CHAPTER; if(!stageOf||!road)return[];
  const out=[],seen={};
  road.chapters.forEach(ch=>{
    const st=ch.id&&stageOf(ch.id); if(!st||seen[st.key])return; seen[st.key]=1;
    let tot=0,don=0;
    st.chapters.forEach(cid=>{const c2=road.chapters.find(x=>x.id===cid);(c2&&c2.units||[]).forEach(uid=>{if(UNITS[uid]){tot++;if(stepDone(uid,'stamp'))don++;}});});
    out.push({key:st.key,icon:st.icon||'',accent:st.accent||'#0E2C57',name:L(st.name).split(' — ')[0],band:L(st.band),pct:tot?Math.round(don/tot*100):0,
      beat:STORY_BEATS[st.key]?L(STORY_BEATS[st.key]):''});
  });
  return out;
}
/* 아이가 서 있는 단계 — "여기부터!" 유닛의 단계, 없으면 과정 시작 챕터의 단계 */
function roadStoryCurrentStage(road,nextId){
  const stageOf=window.NM_STAGE_OF_CHAPTER; if(!stageOf||!road)return null;
  let ch=nextId?road.chapters.find(c=>(c.units||[]).indexOf(nextId)>=0):null;
  if(!ch)ch=road.chapters[roadStartChapterIdx()]||road.chapters[0];
  const st=ch&&ch.id&&stageOf(ch.id);
  return st?st.key:null;
}
/* 단계 머리로 스크롤(끈적이는 머리 띠 밑에 오게) + 잠깐 금빛으로 알려 준다 */
function roadScrollToStage(scr,key){
  const wrap=scr.querySelector('.nm-road-wrap');
  const el=scr.querySelector(`.nm-road-stage[data-stage="${key}"]`);
  if(!wrap||!el)return;
  const hd=scr.querySelector('.nm-road-header');
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  const top=wrap.scrollTop+el.getBoundingClientRect().top-wrap.getBoundingClientRect().top-(hd?hd.offsetHeight:0)-10;
  /* 멀리 뛰면(화면 세 장 넘게) 부드럽게 굴리지 않고 바로 간다 — 긴 목록을 몇 초씩 굴러가지 않게 */
  const far=Math.abs(top-wrap.scrollTop)>wrap.clientHeight*3;
  if(wrap.scrollTo)wrap.scrollTo({top:Math.max(0,top),behavior:reduce||far?'auto':'smooth'});else wrap.scrollTop=Math.max(0,top);
  el.classList.remove('is-flash');void el.offsetWidth;el.classList.add('is-flash');
  if(!el.hasAttribute('tabindex'))el.tabIndex=-1;
  el.focus({preventScroll:true});
}
/* 스토리 모드 머리에 3D 여행 그림책을 세운다 — 못 세우면 2D 단계 꼬리표 줄이 그대로 남는다.
   정리는 mountTitle3DInto·road3d 와 같이 townCleanup 사슬에 건다(render()가 화면을 떠날 때 부른다). */
function mountStory3DInto(scr,stages,current,nextId,o){
  const hero=scr.querySelector('#storyHero');
  if(!hero||!stages.length){ if(o.onFail)o.onFail(); return; }
  const box=document.createElement('div');
  box.className='nm-story3d';
  hero.appendChild(box);
  hero.classList.add('is-3d');   /* 자리를 먼저 잡는다(3D 가 서는 동안 목록이 튀지 않게). 실패하면 되돌린다 */
  const u=nextId&&UNITS[nextId];
  const here=u?{label:S.lang==='ko'?'여기부터!':S.lang==='en'?'Start here!':'从这里！',sub:L(u.title)}:null;
  const fail=()=>{ box.remove(); hero.classList.remove('is-3d'); if(hero.isConnected&&o.onFail)o.onFail(); };
  import('./story3d/story3d.js?v=20261021-characters1').then(m=>m.mountStory3D(box,{
    lang:S.lang, stages, current, here, avatar:avatarProfile(),
    onStage:o.onStage, onHere:o.onHere
  })).then(ctl=>{
    if(!ctl){ fail(); return; }
    if(!box.isConnected){ ctl.dispose(); return; }
    const prev=townCleanup;
    townCleanup=()=>{ if(prev)prev(); ctl.dispose(); };
  }).catch(e=>{ console.warn('[story3d]',e); fail(); });
}

/* 학생의 현재 과정이 앱 지도의 어느 챕터에서 시작하는가 (2026-09-23)
   전에는 지도 맨 앞(유아 수 세기)부터 도장 안 받은 첫 유닛을 "여기부터!"로 찍었다. 그래서
   진단이나 시작점 고르기로 과정 35(제곱근의 세계)에 선 중3 학생에게도 앱 지도와 마을
   "이어서:" 배너는 「수 세기」를 권했다 — 학습지·과정 지도와 앱 지도가 서로 다른 아이를 봤다.
   S.placement.course 의 마법 유닛이 처음 나오는 챕터를 시작점으로 삼는다. */
function roadStartChapterIdx(){
  const key=S.placement&&S.placement.course;
  const c=key&&(window.NM_COURSES||{})[key];
  if(!c||!window.NM_ROADMAP)return 0;
  const mine=new Set();
  (c.sessions||[]).forEach(s=>(s.magic||[]).forEach(u=>mine.add(u)));
  const chs=NM_ROADMAP.chapters;
  for(let i=0;i<chs.length;i++) if((chs[i].units||[]).some(u=>mine.has(u))) return i;
  return 0;
}
function findNextRoadUnit(){
  if(!window.NM_ROADMAP)return null;
  const roadIds=new Set(NM_ROADMAP.chapters.flatMap(ch=>ch.units||[]));
  /* 명시된 시작점/실제 학습이 있으면 과정 지도의 위치를 재사용한다.
     기본 C1을 신규 학생의 진도로 간주하지 않는다. 저장값·해금은 바꾸지 않는다. */
  if(hasRoadCourseContext()){
    const course=NM_COURSES[currentCourseKey()];
    if(course){
      const courses=Object.values(NM_COURSES).filter(c=>c.order>=course.order).sort((a,b)=>a.order-b.order);
      for(const c of courses)for(const session of c.sessions||[])for(const uid of session.magic||[]){
        if(roadIds.has(uid)&&UNITS[uid]&&!stepDone(uid,'stamp'))return uid;
      }
      return null; // 시작점 이전은 자유 탐색으로만 연다. 유아 첫 유닛으로 되돌리지 않는다.
    }
  }
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
  const wrap=document.querySelector('.nm-road-wrap');
  roadVisitSnapshot={uid,scrollTop:wrap?wrap.scrollTop:0};
  S.unit=uid;S.step=null;S.sub={};S.tierId=null;S.view='unit';
  S._fromRoadmap=true;S._fromCourseRoad=false;S.unitReturn={view:'roadmap'};
  save();render();
}
function hasRoadCourseContext(){
  return !!(window.NM_COURSES&&(mostRecentTouchedUnit()||(S.placement&&NM_COURSES[S.placement.course])));
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

/* ============================================================
   상황별 진행 캐릭터 (호스트) — 원장 지시 2026-09-02
   "상황에 맞게 각 게임에도 캐릭터가 있어야 돼"
   ------------------------------------------------------------
   게임·아레나·진단마다 그 내용에 맞는 기호 마법단이 나와 한 줄 거든다.
   배정 기준은 **그 활동이 다루는 연산** — 10 만들기는 모으는 일이니 플러스,
   구구단은 증폭 전사 곱하기, 제곱근은 루트 숲의 현자… 하는 식이다.
   새 게임이 늘면 HOST_LINES에 한 줄만 추가하면 된다(그림은 기호 PNG 재사용).
   ============================================================ */
const HOST_LINES={
  plus:{ko:'같이 모으면 10이 돼! 짝을 찾아보자.',en:"Put them together and you get 10 — find the pairs!",zh:'凑在一起就是10！来找搭档吧。'},
  minus:{ko:'필요 없는 만큼만 덜어내면 돼.',en:'Just take away what you do not need.',zh:'把不需要的减掉就好。'},
  times:{ko:'같은 걸 여러 번! 힘차게 가자.',en:'The same thing, many times — go strong!',zh:'相同的东西重复多次，加油！'},
  divide:{ko:'똑같이 나누면 모두 기분이 좋아져.',en:'Share it evenly and everyone feels good.',zh:'分得一样多，大家都开心。'},
  equal:{ko:'양쪽이 똑같아질 때까지 천천히.',en:'Take it slow until both sides are the same.',zh:'慢慢来，直到两边一样。'},
  sqrt:{ko:'뿌리를 찾으면 답이 보인단다.',en:'Find the root and the answer appears.',zh:'找到根，答案就出现了。'},
  percent:{ko:'비율만 바꾸면 새로운 답이 나와!',en:'Change the ratio and a new answer appears!',zh:'改变比例就有新答案！'},
  pi:{ko:'둥근 것엔 언제나 내가 있지.',en:'Wherever something is round, I am there.',zh:'凡是圆的地方都有我。'},
  sigma:{ko:'흩어진 걸 모아 한 번에 정리하자.',en:'Gather what is scattered and sum it at once.',zh:'把散的聚起来，一次算完。'},
  infinity:{ko:'끝은 없어. 천천히, 멀리 가 보자.',en:'There is no end — go slow, go far.',zh:'没有尽头。慢慢来，走得远一点。'},
  numi:{ko:'같이 해보자! 천천히 해도 괜찮아.',en:"Let's do it together — slow is fine!",zh:'一起来吧！慢一点也没关系。'}
};
/* 도장·편지함처럼 '축하하고 건네는' 자리에 쓰는 대사 — 게임 중 거드는 말(HOST_LINES)과
   어조를 달리한다(그쪽은 풀이 힌트, 이쪽은 격려).
   ★ 낱말 수준은 **그 캐릭터가 등장하는 과정의 나이**에 맞춘다. 플러스·이퀄·마이너스·
     곱하기·나누기는 과정 1~8(6~7세)이라 아주 쉬운 말만 쓴다 — 처음엔 '군더더기·기세·
     침착·자유자재' 같은 어른 낱말을 넣었다가 원장 지적으로 전부 고쳤다. 루트·파이·
     시그마·무한은 과정 20~42(초3 이상)라 그 수준의 말이 맞다. */
const HOST_CHEERS={
  plus:{ko:'네가 모은 힘, 내가 다 봤어. 잘했어!',en:'I saw all the strength you gathered. Well done!',zh:'你聚起的力量我都看见了。做得好！'},
  minus:{ko:'필요 없는 걸 쏙 빼냈구나. 멋지다!',en:'You took out just what was not needed. Nicely done!',zh:'把不需要的干脆地拿掉了。真棒！'},
  times:{ko:'대단해! 이대로 쭉 가자!',en:'Amazing! Keep going just like that!',zh:'太厉害了！就这样一直走下去！'},
  divide:{ko:'하나도 안 남기고 똑같이 나눴구나!',en:'You shared it out evenly with nothing left over!',zh:'分得一样多，一点都没剩！'},
  equal:{ko:'양쪽이 딱 맞았어. 차분하게 잘했어!',en:'Both sides matched exactly. Nice and steady!',zh:'两边刚好相等。稳稳地做得好！'},
  sqrt:{ko:'뿌리까지 파고들었구나. 훌륭해.',en:'You dug all the way to the root. Excellent.',zh:'一直挖到了根部。了不起。'},
  percent:{ko:'비율을 마음대로 다뤘는걸!',en:'You handled the ratios just as you wanted!',zh:'比例被你随心所欲地用起来了！'},
  pi:{ko:'끝까지 매끄럽게 돌았어. 훌륭한 곡선이야.',en:'You came round smoothly to the end — a fine curve.',zh:'一路顺畅地转到终点，漂亮的曲线。'},
  sigma:{ko:'흩어진 걸 다 모아 정리했구나.',en:'You gathered everything scattered and summed it up.',zh:'把散落的都聚起来整理好了。'},
  infinity:{ko:'멀리까지 왔구나. 그 길은 계속 이어져.',en:'You have come far — and the road keeps going.',zh:'你已经走得很远，这条路还会继续。'},
  numi:{ko:'와, 해냈다! 정말 잘했어!',en:'Wow, you did it! Really well done!',zh:'哇，你做到了！真棒！'}
};
/* 미니게임 id → 호스트. 지금 게임은 둘 다 '모아서 10 만들기'라 플러스가 맡는다. */
const HOST_GAMES={ make10:'plus', make10_3:'plus' };
/* 스레드 접두어 → 호스트. 유닛의 generator나 스레드 id 앞글자로 고른다. */
const HOST_THREADS=[
  [/^(MD4[3-9]|MD5[0-9]|MD6[0-2]|calc|lim)/i,'infinity'],  /* 극한·미적분 */
  [/^(MX2|gauss|series|seq)/i,'sigma'],                    /* 수열의 합 */
  [/^(MX4|sqrt|root)/i,'sqrt'],                            /* 제곱근 */
  [/^(circle|pi)/i,'pi'],
  [/^(DC|ratio|percent|rate)/i,'percent'],                 /* 소수·비율 */
  [/^(DV|div)/i,'divide'],
  [/^(ML|mul|times)/i,'times'],
  [/^(SB|sub|minus)/i,'minus'],
  [/^(EL|check|inverse)/i,'equal'],                        /* 역연산·검산 */
  [/^(AD|NS|add|pair|make)/i,'plus'],
  [/^N-/,'numi']                                           /* 유아 유닛 */
];
function hostIdFor(kind,key){
  key=String(key||'');
  if(kind==='game')return HOST_GAMES[key]||'plus';
  if(kind==='placement')return 'equal';                    /* 진단 = 공정한 판단 */
  for(const [re,id] of HOST_THREADS){ if(re.test(key))return id; }
  return 'numi';
}
function hostImgSrc(id){
  const base=window.NM_CHAR_BASE||'assets/characters/';
  return id==='numi' ? base+'numi-0.png' : base+'sym-'+id+'.png';
}
/* 호스트 띠 — 캐릭터 그림 + 말풍선 한 줄. 그림이 없으면 그림만 숨고 말은 남는다. */
function hostStripHtml(kind,key,mode){
  const id=hostIdFor(kind,key);
  const sym=((window.NM_AVATAR&&window.NM_AVATAR.symbols)||[]).find(s=>s.id===id);
  const name=sym?L(sym):(S.lang==='ko'?'누미':S.lang==='en'?'Numi':'努米');
  const book=(mode==='cheer')?HOST_CHEERS:HOST_LINES;
  const line=L(book[id]||book.numi);
  return `<div class="nm-host">
    <img class="nm-host-img" src="${hostImgSrc(id)}" alt="${esc(name)}" onerror="this.style.display='none'">
    <div class="nm-host-bubble"><b>${esc(name)}</b><span>${esc(line)}</span></div>
  </div>`;
}

/* ── 독쌤(doc) 띠 — 사람 캐릭터(renderHumanChar)를 쓰는 호스트 띠.
   hostStripHtml()은 숫자·기호 캐릭터(PNG 파일)용이라 그대로 못 쓴다 — 같은
   .nm-host 골격에 사람 SVG/PNG(renderHumanChar)를 얹는 버전. .doc 수정자만
   더해 CSS는 대부분 .nm-host를 그대로 상속한다. */
function docStripHtml(size,lineHtml){
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  return `<div class="nm-host doc">
    ${window.renderHumanChar?window.renderHumanChar('doc',size||44):''}
    <div class="nm-host-bubble"><b>${lk('독쌤','Doc-T','独先生')}</b><span>${lineHtml}</span></div>
  </div>`;
}
/* 유닛 화면 상단의 독쌤 학습 안내 — 유닛의 "첫 스텝"에서만 뜬다(연습/도장 등은 X). */
function docUnitStripHtml(u){
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const title=L(u.title);
  const line=esc(lk(`오늘은 "${title}"을(를) 배워요. 천천히 해도 괜찮아!`,`Today we learn "${title}". Take your time!`,`今天学习"${title}"，慢慢来！`));
  return docStripHtml(44,line);
}

function screenMiniGame(gameId){
  if(townCleanup){townCleanup();townCleanup=null;}
  if(!S.miniGame||S.miniGame.id!==gameId||S.miniGame.fresh){S.miniGame=_mgInit(gameId);}
  _renderMiniGame();
}

function settleMiniGameReward(mg,count){
  if(!mg.done || mg.rewardCoins!=null)return;
  mg.rewardCoins=coinAdd(count>0?1:0,'game',mg.id+':'+mg.startTs);
  if(coinAdd.saveFailed){delete mg.rewardCoins;return;}
  save();
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
    settleMiniGameReward(mg,mg.pairs);

    const tilesHtml=mg.tiles.map(tl=>{
      if(tl.state==='matched')return`<div class="nm-mg-tile matched">✓</div>`;
      const sel=tl.state==='selected';
      return`<div class="nm-mg-tile${sel?' sel':''}" data-tid="${tl.id}">${tl.val}</div>`;
    }).join('');

    scr.innerHTML=`<div class="nm-mg-wrap">
      <div class="nm-mg-header">
        <button class="nm-back" id="mgBack">← ${navigationLabel(S._fromRoadmap?'roadmap':'town')}</button>
        <div class="nm-mg-title">🎮 Make 10 — ${lk('짝 찾기','Pair Up','配对游戏')}</div>
        <div class="nm-mg-meta">
          ${mg.done?'':`<span class="nm-mg-timer${remaining<=10?' warn':''}">⏱ ${remaining}s</span>`}
          <span class="nm-mg-score">⭐ ${mg.pairs}/4 ${lk('쌍','pairs','对')}</span>
        </div>
      </div>
      ${mg.done?`<div class="nm-mg-done">
        <div class="nm-mg-done-icon">${mg.pairs===4?'🏆':'🌟'}</div>
        <div class="nm-mg-done-msg">${mg.pairs===4?lk('완벽! 4쌍 모두 맞췄어요!','Perfect! All 4 pairs!','完美！全部配对！'):lk(`${mg.pairs}쌍 맞췄어요! 다시 도전해볼까요?`,`Got ${mg.pairs} pairs! Try again?`,`配对了${mg.pairs}对！再试一次？`)}</div>
        <div class="nm-mg-done-coins">🪙 +${mg.rewardCoins||0}</div>
        <div class="nm-mg-done-btns">
          <button class="nm-mg-btn" id="mgRetry">${lk('다시 하기','Play Again','再玩')}</button>
          <button class="nm-mg-btn" id="mgContinue">${lk('계속 공부','Keep Learning','继续学习')}</button>
        </div>
      </div>`:`<div class="nm-mg-board" id="mgBoard">
        ${hostStripHtml('game',mg.id)}
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
    settleMiniGameReward(mg,mg.triples);

    const selSet=new Set(mg.selected);
    const tilesHtml=mg.tiles.map(tl=>{
      if(tl.state==='matched')return`<div class="nm-mg-tile matched">✓</div>`;
      const sel=selSet.has(tl.id);
      return`<div class="nm-mg-tile${sel?' sel':''}${sel&&mg.wrongFlash?' wrong':''}" data-tid="${tl.id}">${tl.val}</div>`;
    }).join('');
    const selSum=mg.selected.reduce((s,tid)=>{const tl=mg.tiles.find(x=>x.id===tid);return s+(tl?tl.val:0);},0);

    scr.innerHTML=`<div class="nm-mg-wrap">
      <div class="nm-mg-header">
        <button class="nm-back" id="mgBack">← ${navigationLabel(S._fromRoadmap?'roadmap':'town')}</button>
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
        <div class="nm-mg-done-coins">🪙 +${mg.rewardCoins||0}</div>
        <div class="nm-mg-done-btns">
          <button class="nm-mg-btn" id="mgRetry">${lk('다시 하기','Play Again','再玩')}</button>
          <button class="nm-mg-btn" id="mgContinue">${lk('계속 공부','Keep Learning','继续学习')}</button>
        </div>
      </div>`:`<div class="nm-mg-board" id="mgBoard">
        ${hostStripHtml('game',mg.id)}
        <div class="nm-mg-hint">${lk('합이 10인 세 수를 골라요!','Pick 3 numbers that sum to 10!','选三个加起来等于10的数！')} &nbsp;<small style="color:#9aa">1+2+7 / 1+3+6 / 1+4+5 / 2+3+5</small></div>
        <div class="nm-mg-tiles" style="grid-template-columns:repeat(4,1fr)">${tilesHtml}</div>
      </div>`}
    </div>`;

    $('#mgBack').onclick=()=>{clearInterval(mgTimer);mgTimer=null;const back=S._fromRoadmap?'roadmap':'town';S.view=back;S._fromRoadmap=false;save();render();};

    if(mg.done){
      const rb=$('#mgRetry');if(rb)rb.onclick=()=>{clearInterval(mgTimer);mgTimer=null;S.miniGame=_mgInit('make10_3');save();_renderMiniGame();};
      const cb=$('#mgContinue');if(cb)cb.onclick=()=>{
        clearInterval(mgTimer);mgTimer=null;
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
    {key:'창의',label:{ko:'독셈',en:'Doc-T Math',zh:'巧算'}},
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
    if(!bodyHtml)bodyHtml=`<div style="padding:40px;text-align:center;color:#aaa;font-size:13px">${lk('아직 준비된 학습 단원이 없어요. 다른 학년을 선택해 주세요.','No units for this grade yet.','此年级暂无单元。')}</div>`;

    scr.innerHTML=`<div class="nm-gc-wrap">
      <div class="nm-gc-header">
        <button class="nm-back" id="gcBack">← ${navigationLabel('town')}</button>
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

/* 유닛id → 그 등급(tier id, 'beginner'·'middle1' 등). 먼저 courseForUnit()으로 과정을
   찾아 그 과정의 tier를 쓰고(NM_COURSES), 못 찾으면(교과연산 밖 유닛) NM_CURRICULUM의
   levels[].units 목록을 훑어 그 유닛을 담은 tier를 찾는다. 둘 다 없으면 null. */
function tierIdForUnit(unitId){
  const cid = courseForUnit(unitId);
  const C = window.NM_COURSES || {};
  if(cid && C[cid] && C[cid].tier) return C[cid].tier;
  const tiers = (CUR && CUR.tiers) || [];
  for(const tier of tiers){
    for(const lv of (tier.levels||[])){
      if((lv.units||[]).indexOf(unitId) >= 0) return tier.id;
    }
  }
  return null;
}
/* 학습 무대 배경(학습무대-작화지시서.md) — 등급 → 배경 키 4종.
   미확인 등급은 'prime'으로 폴백(가장 낮은 학습 등급이라 안전). */
function stageKeyForTier(tierId){
  if(tierId==='numberland' || tierId==='level0') return 'numberland';
  if(tierId==='level1' || tierId==='level2' || tierId==='beginner') return 'prime';
  if(tierId==='level3' || tierId==='intermediate') return 'advance';
  if(tierId==='challenge' || tierId==='advanced' || /^middle/.test(tierId||'') ||
     /^highmath/.test(tierId||'') || tierId==='algebra' || /^calculus/.test(tierId||'')) return 'challenge';
  return 'prime';
}
function stageKeyForUnit(unitId){
  /* 수의 나라 유닛(N-*)은 과정1(level1)에 얹혀 있어도 배경은 버섯집 놀이방 — 유닛 id가 곧 세계다. */
  if(/^N-/.test(String(unitId||''))) return 'numberland';
  return stageKeyForTier(tierIdForUnit(unitId));
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
  if(S.learningPlan&&!S.adminPlan){
    const at=window.NM_PLAN_CONTROL?.position(NM_COURSES,S.learningPlan,weekKeyFor(new Date()));
    if(at?.extensionAnchor)return S.lang==='en'?`Grade ${at.extensionAnchor.grade+6} optional deeper study · ${at.extensionAnchor.index+1}/12`:S.lang==='zh'?`初${at.extensionAnchor.grade}可选进阶 · ${at.extensionAnchor.index+1}/12`:`중${at.extensionAnchor.grade} 선택 심화 · ${at.extensionAnchor.index+1}/12묶음`;
    const key=currentCourseKey(),course=(window.NM_COURSES||{})[key];
    if(course)return `${t('titleCourse')} ${key.slice(1)} · ${L(course.title)}`;
  }
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
  S.unitReturn={view:fromCourseRoad?'courseroad':S.view==='title'?'title':'town'};
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
   - 주 2회 주차  = 올림(세션 수 ÷ 2)

   ★ 2026-09-25 원장 "일주일에 2번 기준인거야" — 주 2회는 **한 주에 두 회차**를 나간다.
     전에는 세 번째 만남마다 보강으로 빼서 ceil(세션×2/3)로 셌는데, 중등 진도 보기(ceil(회차/2))와
     화면마다 주차가 달랐다. 전 화면을 ceil(회차/2) 하나로 맞췄다. 보강은 속도·양 조절(0.7배 등)로 한다.

   ★ 주차는 연산 트랙만 센 것이다. 원장이 준 GFIELD 로드맵 리포트는 교과·사고력1·
     사고력2·연산을 나란히 놓고 연산 줄에 "연산병행"이라고 적는다. 즉 실제 학원
     시간표에서 아이는 이 길만 걷지 않는다. 그 말을 화면에 적지 않으면 여기 숫자가
     학부모에게 "이만큼이면 끝난다"로 읽힌다 — 그래서 카드에 한 줄로 밝혀 둔다.
   ============================================================ */

/* ── 목표 기준(속도) ─────────────────────────────────────────
   같은 연산 책 순서를 몇 년에 걸쳐 걷느냐는 목표에 따라 다르다. 원장이 준
   GFIELD 사고력 진단 로드맵 리포트(연산 트랙)에는 동일한 책 순서를 서로 다른
   시기에 배치한 다섯 기준이 있고, 가장 빠른 기준을 0으로 놓으면 월 오프셋이
   0 · 3 · 7 · 12 · 17(개월)이다. 즉 가장 빠른 기준과 가장 여유 있는 기준
   사이가 같은 내용으로 약 17개월 차이다.

   ※ 리포트의 기준 이름은 바깥 학원·프로그램 이름이라 앱에 쓰지 않는다.
     아이의 상황을 그대로 말하는 중립적인 이름으로 바꿔 적었다(원장이 학원용
     이름으로 되돌리고 싶으면 아래 name만 고치면 된다).
   ※ 배수는 박아 두지 않는다 — 렌더할 때 courses.js에서 잰 "연산 구간"의
     주 1회 기간을 기준 길이로 삼아 (기준길이+오프셋)/기준길이로 만든다. */
const ROAD_PACES=[
 {key:'p0', off:0,  name:{ko:'빠른 선행',en:'Accelerated',zh:'快速先修'}},
 {key:'p1', off:3,  name:{ko:'선행',en:'Ahead',zh:'先修'}},
 {key:'p2', off:7,  name:{ko:'표준',en:'Standard',zh:'标准'}},
 {key:'p3', off:12, name:{ko:'차근차근',en:'Steady',zh:'稳步'}},
 {key:'p4', off:17, name:{ko:'여유 있게',en:'Relaxed',zh:'宽松'}}
];
/* 연산 구간의 마지막 과정 번호 — 합계 카드가 "연산 구간 과정 1~N"으로 쓰던
   경계 그대로다. 기준 길이도 같은 구간에서 재야 화면의 숫자와 어긋나지 않는다. */
const ROAD_OP_LAST=25;

/* 등급(티어) 표시 정보 — 이름·학년대는 사람이 읽는 말로만 쓴다. */
const ROAD_TIERS=[
 {key:'level0',accent:'#6FA85B',
  name:{ko:'수의 나라',en:'Number Land',zh:'数字之国'},
  band:{ko:'유아 5~7세 · 수와 문장제와 친해지기',en:'Ages 5–7 · Befriending numbers & word problems',zh:'幼儿5~7岁 · 与数和应用题交朋友'}},
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
/* 목록·유닛 연결은 data/labs.js(window.NM_LABS)로 옮겼다 — 학습지(exam.js)가 main.js 없이
   그려지는 ws.html·drill.html 에서도 같은 데이터를 써야 하기 때문이다(2026-09-06). */
const ROAD_LABS=(window.NM_LABS&&window.NM_LABS.list)||[];

/* 개념 노트 ↔ 실험실 연결 — 여기 등록된 유닛은 개념 노트 하단에 실험실 버튼이 뜬다.
   실험실이 "따로 가야 있는 것"이 아니라 그 개념을 배우는 자리에서 바로 열리게. */
const UNIT_LABS=(window.NM_LABS&&window.NM_LABS.byUnit)||{};
/* 유닛에 걸린 실험실 목록 — 값이 문자열이든 배열이든 배열로 돌려준다 */
function unitLabsFor(id){
  const v=UNIT_LABS[id];
  return v?(Array.isArray(v)?v:[v]):[];
}
/* 파일 경로로 ROAD_LABS 항목 찾기(아이콘·3언어 이름을 그대로 씀) */
function labMetaOf(file){ return ROAD_LABS.find(l=>l.file===file)||null; }

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
/* 주차 — 주 1회는 세션 수 그대로, 주 2회는 절반(올림) — 한 주에 두 회차 */
function courseLessonCount(c){ return window.NM_HIGH_PACING?NM_HIGH_PACING.length(c):(c.sessions||[]).length; }
function courseWeeks(nSessions, cadence){
  return cadence==='w2' ? Math.ceil(nSessions/2) : nSessions;
}
/* ── 목표 기준 배수 ──
   기준 길이 = 연산 구간(과정 1~ROAD_OP_LAST)의 주 1회 개월. courses.js에서
   그때그때 재므로 세션 총합을 어디에도 박아 두지 않는다. */
function roadPaceDef(key){ return ROAD_PACES.find(p=>p.key===key)||ROAD_PACES[0]; }
function roadBaseMonths(){
  let w=0;
  roadCourseList().forEach(x=>{
    if(x.num>ROAD_OP_LAST) return;
    w+=courseWeeks((x.c.sessions||[]).length,'w1');
  });
  return w/4;
}
function roadPaceMult(key){
  if(window.NM_LEARNING_PLAN)return NM_LEARNING_PLAN.paceMultiplier(window.NM_COURSES,key);
  const base=roadBaseMonths();
  if(!base) return 1;
  return (base+roadPaceDef(key).off)/base;
}
/* 한 과정의 주차에 목표 기준을 반영한다 — 세션 수학(위 courseWeeks)은 그대로
   두고 배수만 곱한다. 고등 묶음은 속도에 따른 소수 주수를 누적한다. */
function coursePaceWeeks(course, cadence, mult, speed){
  const n=typeof course==='number'?course:courseLessonCount(course);
  if(course&&course.studyPlan)return NM_HIGH_PACING.durationUnits(course)/(cadence==='w2'?2:1)/(speed||S.roadSpeed||1);
  return Math.max(1, Math.round(courseWeeks(n,cadence)*(mult||1)));
}
/* 구간 합계 {sessions, weeks} — from~to는 과정 번호(포함).
   합계 주차는 과정별로 반올림한 값을 더하지 않고 구간 전체에 배수를 한 번
   곱해 반올림한다 — 과정마다 생기는 반올림 오차가 쌓이지 않게. */
function roadTotals(from, to, cadence, mult, speed){
  let sessions=0, weeks=0, courses=0, hasHigh=false;
  roadCourseList().forEach(x=>{
    if(x.num<from||x.num>to) return;
    const n=courseLessonCount(x.c);hasHigh=hasHigh||!!x.c.studyPlan;
    sessions+=n; weeks+=x.c.studyPlan?NM_HIGH_PACING.durationUnits(x.c)/(cadence==='w2'?2:1)/(speed||S.roadSpeed||1):courseWeeks(n,cadence)*(mult||1); courses++;
  });
  weeks=hasHigh?Math.ceil(weeks-1e-9):Math.round(weeks);
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
  const position=S.learningPlan&&!S.adminPlan&&window.NM_PLAN_CONTROL
    ? NM_PLAN_CONTROL.position(NM_COURSES,effectiveLearningSettings(),weekKeyFor(new Date())) : null;
  if(position?.extensionAnchor&&position.courseKey===key){S._mbWeek=weekKeyFor(new Date());S.view='mailbox';save();render();return;}
  const selected=position?.courseKey===key?c.sessions[position.sessionIndex-1]:null;
  const ids=selected?(selected.magic||[]).filter(id=>UNITS[id]):courseUnitIds(c);
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

/* ============================================================
   과정 노드 시트 — 로드맵에서 과정을 누르면 바로 들어가지 않고 먼저 묻는다
   (2026-09-16 원장 지시: "연산 로드맵 들어가면 클릭하고 여기서부터 시작하기가
   있어야 하지 않아? 둘러보기나").
   예전엔 노드를 누르는 순간 유닛으로 들어가 버려서, 앞으로 뭘 배우는지 구경만
   하려다 학습이 시작되는 일이 생겼다. 이제 셋 중에 고른다:
     ① 여기서부터 시작하기 — 별도 학습 계획 시작점을 정하고 들어간다.
        진단 결과와 완료 기록은 변경하지 않는다.
     ② 둘러보기 — 세션 편성(배우는 것·연습하는 것)만 펼쳐 본다. 학습은 시작 안 함
     ③ 닫기
   지금 있는 과정이면 ①의 말이 "이어서 하기"가 된다 — 시작점을 다시 찍을 일이 없다.
   ============================================================ */
function courseOutlineHtml(c){
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const TH=window.NM_THREADS||{};
  const nameOf=(id)=>{ const u=UNITS[id]; if(u) return esc(L(u.title)); const th=TH[id]; return th?esc(L(th.name)):esc(id); };
  if(c.studyPlan){
    const rows=c.studyPlan.lessons.map((group,i)=>{
      const source=group.sourceIndices.map(j=>c.sessions[j]);
      const units=[...new Set(source.flatMap(s=>s.magic||[]))].map(nameOf);
      const topics=[...new Set(source.flatMap(s=>(s.drills||s.pool||[]).map(d=>d.t)).concat((group.extraPractice||[]).map(d=>d.t)))].map(nameOf);
      const names=[...new Set([...units,...topics])],check=source.some(s=>s.test);
      return `<li class="nm-cs-ses"><span class="nm-cs-sesno">${i+1}</span><span class="nm-cs-sestxt"><b>${check?lk('과정 점검','Course check','课程检查'):names[0]||lk('계산 연습','Calculation practice','计算练习')}</b>${check?`<small>${names.join(' · ')}</small>`:names.length>1?`<small>${names.slice(1).join(' · ')}</small>`:''}</span></li>`;
    }).join('');
    return `<ul class="nm-cs-list">${rows}</ul>`;
  }
  const rows=(c.sessions||[]).map((ses,i)=>{
    const no=`<span class="nm-cs-sesno">${i+1}</span>`;
    if(ses.test){
      return `<li class="nm-cs-ses test">${no}<span class="nm-cs-sestxt">
        <b>${lk('확인 세션','Check session','检查课')}</b>
        <small>${lk('그동안 배운 것을 모아서 확인해요.','A round-up of everything so far.','把学过的内容集中检查一次。')}</small></span></li>`;
    }
    const magic=(ses.magic||[]).map(nameOf);
    const drills=(ses.drills||[]).map(d=>nameOf(d.t));
    const uniqDrills=drills.filter((v,ix)=>drills.indexOf(v)===ix);
    return `<li class="nm-cs-ses">${no}<span class="nm-cs-sestxt">
      <b>${magic.length?magic.join(' · '):lk('연습 회차','Practice session','练习课')}</b>
      ${uniqDrills.length?`<small>${lk('연습','Drills','练习')} — ${uniqDrills.join(' · ')}</small>`:''}
    </span></li>`;
  }).join('');
  return rows?`<ul class="nm-cs-list">${rows}</ul>`
    :`<p class="nm-cs-empty">${lk('이 과정의 편성은 아직 준비 중이에요.','This course is still being put together.','这个课程还在编排中。')}</p>`;
}

/* 기존 과정/인쇄횟수/통과 기록은 그대로 두고, 중등 1학기 권장 편성표를 별도로 펼친다.
   이 표에서 인쇄했다고 기존 세션을 완료 처리하지 않으며, 날짜로 진도를 추정하지 않는다. */
function middlePacingHtml(tier){
  const match=/^middle([123])$/.exec(tier||'');
  const data=window.NM_MIDDLE_PACING;
  if(!match||!data||!data.grades||S.lang!=='ko') return '';
  const grade=+match[1], plan=data.grades[grade];
  if(!plan) return '';
  const blockLabel=b=>{
    if(b.kind==='drawing') return `${b.title} ${b.n}문항`;
    const th=(window.NM_THREADS||{})[b.t];
    const lv=th&&(th.levels||[]).find(l=>l.id===b.lv);
    return `${th?L(th.name):b.t} · ${lv?L(lv.label):'L'+b.lv} ${b.n}문항`;
  };
  return `<details class="nm-middle-pacing" id="middlePacing${grade}">
    <summary><span class="nm-mp-sumt"><small>정규 과정 학습 묶음</small>${esc(plan.title)}</span><span class="nm-mp-summeta">기본 10주 · 속진 8주 · <span class="nm-cr-tnum">${plan.sessions.length}</span>묶음 · 펼쳐 보기</span></summary>
    <!-- 2026-09-25 통합: 이 표는 정규 과정의 회차를 학년별로 모은 것이다(따로 편성하지 않는다) -->
    <p class="nm-mp-intro"><b>${esc(plan.scope)}.</b> 같은 정규 회차를 묶어 학년별 20묶음으로 보인 표입니다. 각 학년의 1학기 연산은 기본 약 2.5개월이며, 심화를 선택하면 기본을 포함해 총 약 4개월입니다. 2학기 도형 기간을 더하지 않습니다.</p>
    <ul class="nm-mp-facts">
      <li>한 묶음을 여러 날로 나누어 <strong>교과 연산 → 독셈 → 적용</strong> 순서로 공부해요.</li>
      <li>쉬운 유형은 12문항, 어려운 유형은 18~24문항(뒤쪽은 한 단계 위)으로 더 연습합니다.</li>
      <li>시간은 개인차가 있습니다. 어려운 회차는 나누어 풀고, 주차에 맞추려고 이해를 건너뛰지 마세요.</li>
    </ul>
    <ol class="nm-mp-sessions">${plan.sessions.map(s=>{
      const count=s.blocks.reduce((n,b)=>n+b.n,0);
      const draw=s.blocks.filter(b=>b.kind==='drawing').reduce((n,b)=>n+b.n,0);
      return `<li class="nm-mp-session">
        <span class="nm-mp-date"><b>${S.roadCadence==='w2'?s.week:plan.sessions.indexOf(s)+1}주</b>${S.roadCadence==='w2'?s.day:1}묶음</span>
        <div><h4>${esc(s.title)}${s.checkpoint?'<span class="nm-mp-check">확인</span>':''}</h4>
          <p>${esc(s.blocks.map(blockLabel).join(' / '))}</p>
          <p>총 ${count}문항${draw?` · 손으로 그리기 ${draw}문항 포함`:''} · ${esc(s.timeNote)}</p></div>
        <button type="button" data-middle-grade="${grade}" data-middle-session="${s.id}" aria-label="${s.week}주 ${s.day}회 ${esc(s.title)} 학습지 미리보기">학습지 보기</button>
      </li>`;
    }).join('')}</ol>
    <p class="nm-mp-notes">${plan.notes.map(esc).join('<br>')}
      ${(plan.supplementary||[]).map(b=>{const th=(window.NM_THREADS||{})[b.t];const lv=th&&(th.levels||[]).find(l=>l.id===b.lv);return `<br>추천 보충: ${esc(th?L(th.name):b.t)} · ${esc(lv?L(lv.label):'L'+b.lv)} — ${esc(b.reason)}`;}).join('')}
      학습 기록은 정규 과정 회차에 그대로 남습니다. 이 표는 자동 진급·완주 판정이 아닙니다.</p>
  </details>`;
}

function openCourseSheet(key){
  const c=(window.NM_COURSES||{})[key];
  if(!c) return;
  if(document.getElementById('nmCourseSheet')) return;
  const previousFocus=document.activeElement;
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const num=String(key).replace(/^C/,'');
  const tierDef=roadTierInfo(c.tier);
  const built=courseBuilt(c);
  const prog=courseProgress(c);
  const isNow=key===currentCourseKey();
  const isDone=courseConquered(c);
  const pct=prog.total?Math.round(prog.done/prog.total*100):0;
  const stateTxt=isDone?`🏳️ ${lk('정복함','Conquered','已征服')}`
    :isNow?`📍 ${lk('지금 여기','You are here','当前位置')}`
    :!built?`📦 ${lk('준비 중','Coming soon','准备中')}`:'';
  const startTxt=isNow?`▶ ${lk('이어서 하기','Continue','继续')}`
    :`🚩 ${lk('여기서부터 시작하기','Start from here','从这里开始')}`;
  /* 준비도 안내(중등·고등 구간) — 잠그지 않는다. 안내만 얹고 버튼은 그대로 둔다. */
  const ready=readinessNote(c.tier);

  const html=`<div class="nm-gate-overlay nm-cs-overlay" id="nmCourseSheet">
    <div class="nm-gate-card nm-cs-card" role="dialog" aria-modal="true" aria-labelledby="csTitle" aria-describedby="csNote" style="--acc:${tierDef.accent}">
      <button class="nm-gate-x" id="csX" aria-label="${lk('닫기','Close','关闭')}">✕</button>
      <div class="nm-cs-eyebrow">${esc(L(tierDef.name))} · ${esc(L(tierDef.band))}</div>
      <h3 class="nm-cs-title" id="csTitle"><span class="nm-cs-num">${lk('과정','Course','课程')} ${num}</span>${esc(L(c.title))}</h3>
      ${stateTxt?`<div class="nm-cs-state">${stateTxt}</div>`:''}
      ${prog.total?`<div class="nm-cs-prog">
        <div class="nm-cs-bar"><span style="width:${pct}%"></span></div>
        <div class="nm-cs-progtxt">${lk('마법','Magic','魔法')} ${prog.done} / ${prog.total}</div>
      </div>`:''}
      ${ready?`<div class="nm-cs-ready ${ready.kind}">
        <b>${ready.kind==='unknown'?`🎒 ${lk('학년을 아직 몰라요','Grade not set yet','还不知道年级')}`
          :`⏳ ${lk('아직 이를 수 있어요','This may be early','可能还早')}`}</b>
        <span>${ready.text}</span>
        ${ready.kind==='unknown'?`<button class="nm-cs-readybtn" id="csAge">${lk('학년 알려주기','Tell us the grade','告诉我们年级')}</button>`:''}
      </div>`:''}
      <div class="nm-cs-peek" id="csPeek" hidden>
        <div class="nm-cs-peek-h">${lk('이 과정에서 배우는 것','What this course covers','这个课程学什么')}</div>
        ${courseOutlineHtml(c)}
      </div>
      <div class="nm-cs-btns">
        ${built?`<button class="nm-btn full" id="csStart">${startTxt}</button>`
          :`<button class="nm-btn full" id="csStart" disabled>📦 ${lk('아직 준비 중이에요','Not ready yet','还在准备中')}</button>`}
        <button class="nm-btn full ghost" id="csPeekBtn" aria-expanded="false" aria-controls="csPeek">👀 ${lk('둘러보기','Take a look','看一看')}</button>
      </div>
      <p class="nm-cs-note" id="csNote">${lk('둘러봐도 학습은 시작되지 않아요. 시작점은 언제든 다시 고를 수 있어요.',
        'Looking around does not start anything. You can pick a different start any time.',
        '只是看一看不会开始学习。起点随时可以重新选择。')}</p>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
  const modal=document.getElementById('nmCourseSheet');
  const close=()=>{ modal.remove();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true}); };
  modal.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key!=='Tab')return;
    const buttons=[...modal.querySelectorAll('button:not([disabled]),a[href],input,select,[tabindex="0"]')].filter(el=>el.getClientRects().length);
    const first=buttons[0],last=buttons[buttons.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  });
  document.getElementById('csX').onclick=close;
  document.getElementById('nmCourseSheet').addEventListener('click', e=>{ if(e.target.id==='nmCourseSheet') close(); });
  const peekBtn=document.getElementById('csPeekBtn'), peek=document.getElementById('csPeek');
  peekBtn.onclick=()=>{
    const open=peek.hidden;
    peek.hidden=!open;
    peekBtn.setAttribute('aria-expanded',String(open));
    peekBtn.textContent=open?`👀 ${lk('접기','Hide','收起')}`:`👀 ${lk('둘러보기','Take a look','看一看')}`;
    if(open) peek.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  document.getElementById('csX').focus({preventScroll:true});
  const ageBtn=document.getElementById('csAge');
  if(ageBtn) ageBtn.onclick=()=>{ close(); openAgeSheet(()=>{ render(); openCourseSheet(key); }); };
  const startBtn=document.getElementById('csStart');
  if(built) startBtn.onclick=()=>{
    roadAssessmentReturn=null;
    close();
    /* Explicitly choose this learning position without rewriting the diagnosis. */
    if(!isNow&&!applyLearningSettings({courseKey:key,sessionIndex:1})){
      toast(lk(S.adminPlan?'학원에서 정한 진도예요. 변경은 학원에 요청해 주세요.':'저장하지 못했어요. 다시 시도해 주세요.',
        S.adminPlan?'Ask your academy to change the assigned plan.':'Could not save. Please try again.',
        S.adminPlan?'请联系学院更改学习计划。':'未能保存，请重试。'),true);return;
    }
    enterCourseNode(key);
  };
}

/* 학생 바꾸기 시트 — 옷장의 "우리 집 마법사들"(renderSlotCards)과 같은 슬롯을
   로드맵에서도 고를 수 있게 한 것. 전환 절차는 switchToSlot() 하나만 쓴다
   (지금 저장본을 백업하고 대상 슬롯을 활성 자리로 올린 뒤 새로고침) — 여기서
   따로 상태를 옮기지 않는다. 빈 슬롯은 새 프로필이 되므로 온보딩이 뜬다. */
/* ============================================================
   연산 점검 (S.view==='checkup') — 원장 지시 2026-09-16
   "중간에 연산 점검 모드도 3단계 정도마다 꼭. 그게 아니라도 문장제 이해 정도도,
    인지 능력이라는 것이 있잖아"
   ------------------------------------------------------------
   과정 3개마다(과정 3·6·9…) 한 번, 그 직전 세 과정에서 실제로 쓴 드릴 재료로만
   문제를 낸다 — 새 문제를 지어내지 않고 기존 생성기(NM_TGEN)를 그대로 쓴다.
   ★ 계산과 문장제를 따로 센다. 이게 이 기능의 요지다. 계산이 되는 것과 문장을
   읽어 내는 것은 다른 능력이라, 한 점수로 합치면 정확히 원장이 지적한
   "계산은 되는데 문장제가 안 되는 상태"가 숫자 뒤로 숨는다.
   ★ 어떤 것도 잠그지 않는다. 결과는 안내와 기록일 뿐이다.
   ============================================================ */
const CHECKUP_EVERY=3;
/* 과정 하나당 계산 문항 수. 처음엔 세 과정을 통틀어 6문제였는데 원장이 "과정 점검
   너무 적어"라고 했다 — 세 과정(12~18세션)을 6문제로 재는 건 실제로 표본이 아니다.
   과정마다 4문제씩 = 계산 12문제로 올리고, 재료가 4개보다 적은 과정은 같은 재료를
   다시 쓰되 문항 번호가 씨앗에 들어가므로 같은 문제가 두 번 나오지는 않는다. */
const CHECKUP_PER_COURSE=4;
/* ── 문장제를 과정에 맞춰 고르기 (2026-09-16) ──
   원장 지시 "문장제도 과정마다 다르게 나오게 해 줘". 곱셈을 배우는 과정에서
   덧셈 문장제가 나오면 그 과정을 점검하는 게 아니다. 그 과정이 실제로 연습하는
   스레드의 머리글자로 의미 유형을 정해 wp 생성기에 params.kinds로 넘긴다
   (engine/threads/wp.js의 weightsFor·narrow 참고 — 그 형식이 못 쓰는 유형이면
   그 형식 자체를 뺀다). range는 나눗셈이 있으면 B, 분수·소수가 있으면 C. */
const WP_KINDS_BY_PREFIX={
  NS:['합병','첨가'], AD:['합병','첨가'], SB:['구잔','구차'],
  ML:['배수'], DV:['등분','포함'],
  FR:['합병','첨가','구잔','구차'], DC:['합병','첨가','구잔','구차'],
  EL:['구잔','구차'], MX:['합병','첨가','구잔','구차','배수','등분','포함']
};
function wpPlanForCourses(nums){
  const C=window.NM_COURSES||{};
  const pre={}, kinds=[];
  nums.forEach(n=>{
    const c=C['C'+n]; if(!c) return;
    (c.sessions||[]).forEach(ses=>(ses.drills||[]).forEach(d=>{
      const m=String(d.t||'').match(/^[A-Z]+/); if(m) pre[m[0]]=true;
    }));
  });
  Object.keys(pre).forEach(k=>{
    (WP_KINDS_BY_PREFIX[k]||[]).forEach(v=>{ if(kinds.indexOf(v)<0) kinds.push(v); });
  });
  const range = (pre.FR||pre.DC) ? 'C' : (pre.DV||pre.MX) ? 'B' : 'A';
  return { range, kinds };
}
function checkupKeyFor(num){ return 'C'+num; }
function isCheckupPoint(num){ return num>0 && num%CHECKUP_EVERY===0; }
function checkupRecord(num){ return (S.checkups||{})[checkupKeyFor(num)]||null; }
/* 점검이 볼 과정 세 개(과정 3이면 1·2·3) */
/* 점검 화면의 셋째 칸 이름(2026-09-19) — 초등은 '독셈', 중·고는 '적용'이다.
   중·고에 독셈이라는 범주가 없어서다(courses.js 과정 29 위 주석 참조).
   과정 번호로 가른다 — 중등이 과정 29부터다(stages.js). */
const CHECKUP_CRE_FROM_MIDDLE = 29;
function checkupCreLabel(num){
  return num >= CHECKUP_CRE_FROM_MIDDLE
    ? lk('적용','Applying','应用')
    : lk('독셈','Doc-T Math','巧算');
}
function checkupCourseNums(num){
  const out=[];
  for(let n=num-CHECKUP_EVERY+1;n<=num;n++) if(n>=1) out.push(n);
  return out;
}
/* 이 점검을 지금 할 차례인가 — 세 과정을 다 정복했고 아직 안 봤으면. */
function checkupDue(num){
  if(!isCheckupPoint(num)) return false;
  if(checkupRecord(num)) return false;
  const C=window.NM_COURSES||{};
  return checkupCourseNums(num).every(n=>{
    const c=C['C'+n];
    return c && (courseUnitIds(c).length===0 || courseConquered(c));
  });
}
/* 문항 목록 — 계산은 그 세 과정의 드릴 재료에서, 문장제는 WP 스레드에서.
   문장제는 첫 점검(과정 3)에서 '문제 이해' 하나만 낸다. 이제 막 두 자리
   덧뺄셈을 뗀 아이에게 연산 고르기·식 세우기까지 물으면 측정이 아니라 벌이 된다. */
function buildCheckupItems(num){
  const C=window.NM_COURSES||{}, TH=window.NM_THREADS||{};
  const picked=[];
  /* 계산 — 과정마다 따로 뽑는다. 세 과정을 한 통에 부어 놓고 고르면 재료가 많은
     과정이 표본을 다 차지해 어떤 과정은 한 문제도 안 나온다. */
  checkupCourseNums(num).forEach(n=>{
    const c=C['C'+n]; if(!c) return;
    const pool=[];
    (c.sessions||[]).forEach(ses=>{
      (ses.drills||[]).forEach(d=>{
        if(!TH[d.t]) return;
        if(pool.some(x=>x.t===d.t)) return;
        const lv=(TH[d.t].levels||[]).some(l=>l.id===d.lv)?d.lv:1;
        pool.push({t:d.t, lv, kind:'calc', from:n});
      });
    });
    if(!pool.length) return;
    for(let i=0;i<CHECKUP_PER_COURSE;i++){
      /* 재료 전체에 고루 퍼지게 — 앞에서부터 4개만 집으면 뒤쪽 재료를 영영 안 묻는다 */
      picked.push(Object.assign({}, pool[Math.min(pool.length-1, Math.floor(i*pool.length/CHECKUP_PER_COURSE))]));
    }
  });
  /* ── 독셈 (2026-09-16 원장 "그런데 독셈은 같이 점검 안 해?") ──
     그 세 과정의 창의 회차(courses.js의 session.creative)에서 뽑는다. 원장의 다음
     문장이 요지다 — "무조건 계산하는 것이 아니라 푸는 과정에 대한 연습도 되어야지.
     독셈 때 한 문제는 빈칸 넣기도 있어야 하지 않겠어."
     그래서 **과정을 채우는 문항(steps)을 맨 앞에 세운다.** 생성기가 steps를 내면
     widgets.js의 steps 위젯이 단계마다 빈칸을 받는다(답만 쓰는 게 아니라 푸는
     과정을 채운다). 어떤 스레드가 steps를 내는지는 미리 적어 두지 않고 한 번
     생성해서 확인한다 — 생성기가 바뀌면 적어 둔 표가 조용히 틀리기 때문이다. */
  const cre=[];
  checkupCourseNums(num).forEach(n=>{
    const c=C['C'+n]; if(!c) return;
    (c.sessions||[]).forEach(ses=>(ses.creative||[]).forEach(d=>{
      if(!TH[d.t]) return;
      if(cre.some(x=>x.t===d.t&&x.lv===d.lv)) return;
      cre.push({t:d.t, lv:d.lv||1, kind:'creative', from:n});
    }));
  });
  if(cre.length){
    const hasSteps=x=>{
      try{
        const q=placementProblem({thread:x.t, level:x.lv}, 0, 'probe');
        return !!(q && Array.isArray(q.steps) && q.steps.length);
      }catch(e){ return false; }
    };
    const withSteps=cre.filter(hasSteps), without=cre.filter(x=>!withSteps.includes(x));
    const order=withSteps.concat(without);
    /* 창의는 3문제. 첫 자리는 되도록 과정을 채우는 문항(빈칸)으로 둔다. */
    for(let i=0;i<3;i++) picked.push(Object.assign({}, order[i % order.length]));
  }
  /* 문장제 — 계산만큼은 아니어도 판단이 설 만큼은 낸다(1문제로는 맞고 틀림이 곧
     운이다). 첫 점검은 '문제 이해'만, 그다음부터 '연산 찾기'와 '식으로 나타내기'. */
  const wpIds = num<=3?['WP1','WP1','WP1']
              : num<=9?['WP1','WP1','WP3','WP3']
              : ['WP1','WP1','WP3','WP3','WP4','WP4'];
  const wpLv  = num<=10?1 : num<=20?2 : 3;
  const wpPlan= wpPlanForCourses(checkupCourseNums(num));
  wpIds.forEach(t=>{
    const th=TH[t]; if(!th) return;
    /* 레벨은 range를 정하므로 계획의 range와 어긋나지 않게 맞춘다 */
    const wantLv = wpPlan.range==='C' ? 3 : wpPlan.range==='B' ? Math.max(2,wpLv) : wpLv;
    const lv=(th.levels||[]).some(l=>l.id===wantLv)?wantLv:1;
    picked.push({t, lv, kind:'wp', kinds:wpPlan.kinds});
  });
  return picked;
}
/* 중간에 나간 점검이 남아 있으면 그것 — 문항이 15~18개로 길어졌으니 한 번에 다
   못 끝내는 게 정상이다. 나갔다 와도 처음부터 다시 풀게 하면 아무도 안 끝낸다. */
function checkupInProgress(num){
  const k=S._checkup;
  return (k && k.num===num && k.stage!=='result' && k.i>0) ? k : null;
}
function startCheckup(num, fresh){
  if(!fresh){
    const k=checkupInProgress(num);
    if(k){ S.view='checkup'; save(); render(); return; }
  }
  const items=buildCheckupItems(num);
  if(!items.length){ toast(S.lang==='ko'?'점검할 재료가 아직 없어요':'Nothing to check yet',false); return; }
  S._checkup={ run:Date.now(), num, items, i:0, stage:'intro',
    calcOk:0, calcTotal:items.filter(x=>x.kind==='calc').length,
    creOk:0,  creTotal:items.filter(x=>x.kind==='creative').length,
    wpOk:0,   wpTotal:items.filter(x=>x.kind==='wp').length,
    cur:null, qStart:null, log:[] };
  S.view='checkup'; save(); render();
}
function finishCheckup(k){
  if(!S.checkups) S.checkups={};
  const previous=S.checkups[checkupKeyFor(k.num)],prevRewarded=!!previous;
  delete k.rewardSavePending;
  S.checkups[checkupKeyFor(k.num)]={ at:Date.now(),
    calcOk:k.calcOk, calcTotal:k.calcTotal,
    creOk:k.creOk||0, creTotal:k.creTotal||0,
    wpOk:k.wpOk, wpTotal:k.wpTotal };
  k.stage='result';
  /* 보상은 맞힌 수만큼 — 점수로 가르지 않는다. 점검은 시험이 아니라 지금 어디가
     막혔는지 보는 자리라, 결과가 나쁘면 손해를 보는 구조로 만들면 안 된다.
     한 점검당 한 번만 준다(다시 점검하기로 코인을 반복해서 벌 수 없게). */
  if(!k.rewarded){
    k.rewarded=true;
    const got=k.calcOk+(k.creOk||0)+k.wpOk;
    const attempt=got>0&&!prevRewarded;
    k.rewardCoins=attempt?coinAdd(got,'checkup','checkup:'+k.num):0;
    if(attempt&&coinAdd.saveFailed){
      if(previous===undefined)delete S.checkups[checkupKeyFor(k.num)];else S.checkups[checkupKeyFor(k.num)]=previous;
      k.rewarded=false;k.rewardSavePending=true;delete k.rewardCoins;return;
    }
  }
  save();
}

/* 문장제 한 문항을 제대로 그리기 (2026-09-16 원장 "문제를 줄 바뀜도 정리하고 제대로 만들어").
   생성기(engine/threads/wp.js)는 이야기·물음·보기·식틀을 따로 준다(word·wordAsk·
   choices·wordEqn). 그런데 화면은 그것들을 한 줄로 이어 붙인 prompt만 찍고 있었다.
   그래서 "…모두 몇 개일까요? 지우가 더 받은 쿠키는 몇 개일까요? 문제에서 찾아 쓰세요"
   처럼 이야기와 물음이 한 덩어리로 흘러 어디까지가 상황이고 어디부터가 묻는 말인지
   가려지지 않았다. 인쇄(exam.js)는 이미 세 조각을 따로 그린다 — 화면을 거기에 맞춘다.
   ── 줄 바꿈 ──
   한국어는 낱말 가운데서 끊기면 안 되므로 word-break:keep-all(.nm-wq-*)을 쓰고,
   이야기는 문장 단위로 쪼개 한 문장씩 줄을 준다. 문장이 길면 그 안에서만 접힌다. */
function wpBlockHtml(cur, lang){
  const L2=o=>o?(o[lang]??o.ko??o.en??''):'';
  const story=L2(cur.word), ask=L2(cur.wordAsk);
  if(!story&&!ask) return null;
  /* 문장 끝(. ? !)에서 자른다. 중국어는 。？！도 함께. 끝 부호는 붙여 남긴다. */
  const sents=String(story).split(/(?<=[.?!。？！])\s+/).filter(Boolean);
  const storyHtml=sents.length
    ? `<p class="nm-wq-story">${sents.map(x=>`<span>${esc(x)}</span>`).join('')}</p>` : '';
  const askHtml=ask?`<p class="nm-wq-ask">${esc(ask)}</p>`:'';
  let choicesHtml='';
  const ch=cur.choices&&(cur.choices[lang]||cur.choices.ko);
  if(ch&&ch.length){
    choicesHtml=`<ol class="nm-wq-choices">${ch.map((c,i)=>
      `<li><b>${i+1}</b><span>${esc(String(c))}</span></li>`).join('')}</ol>`;
  }
  const eqn=cur.wordEqn?`<div class="nm-wq-eqn">${esc(String(cur.wordEqn))}</div>`:'';
  return `<div class="nm-wq">${storyHtml}${askHtml}${choicesHtml}${eqn}</div>`;
}

function screenCheckup(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const k=S._checkup;
  if(!k){ S.view='courseroad'; save(); render(); return; }
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(a,b,c)=>ko?a:en?b:c;
  /* 뒤로 나가도 진행분을 지우지 않는다(끝난 점검만 치운다) — 정거장에서 "이어서
     하기"로 다시 들어온다. 다시 처음부터 풀고 싶으면 결과 화면의 '다시 점검하기'. */
  const back=()=>{ if(S._checkup&&S._checkup.stage==='result') S._checkup=null;
    S.view='courseroad'; save(); render(); };

  if(k.stage==='intro'){
    const nums=checkupCourseNums(k.num);
    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="cuBack">← ${navigationLabel('courseroad')}</button>
      <div class="nm-unit-title">🩺 ${lk('연산 점검','Check-up','运算检查')}</div>
    </div>
    <div class="nm-step-body"><div class="nm-dialog"><div class="nm-cu-wrap">
      <div class="nm-cu-hero">🩺</div>
      <h2 class="nm-cu-h">${lk(`과정 ${nums[0]}~${nums[nums.length-1]} 점검`,`Check-up for courses ${nums[0]}–${nums[nums.length-1]}`,`课程${nums[0]}~${nums[nums.length-1]}检查`)}</h2>
      <p class="nm-cu-p">${lk('지금까지 배운 것에서만 물어봐요. 새로 배우는 건 없어요.',
        'Only what you have already learned. Nothing new here.','只问学过的内容，不会出新东西。')}</p>
      <div class="nm-cu-parts three">
        <div class="nm-cu-part"><b>🔢 ${lk('계산','Calculating','计算')}</b><span>${k.calcTotal}${lk('문제','questions','题')}</span></div>
        <div class="nm-cu-part cre"><b>✨ ${esc(checkupCreLabel(k.num))}</b><span>${k.creTotal||0}${lk('문제','questions','题')}</span></div>
        <div class="nm-cu-part wp"><b>📖 ${lk('문장제 이해','Reading','应用题理解')}</b><span>${k.wpTotal}${lk('문제','questions','题')}</span></div>
      </div>
      <p class="nm-cu-count">${lk(`모두 ${k.items.length}문제예요. 중간에 나가도 풀던 자리에서 이어서 할 수 있어요.`,
        `${k.items.length} questions in all. You can leave and pick up where you stopped.`,
        `一共${k.items.length}题。中途离开也能从停下的地方继续。`)}</p>
      <p class="nm-cu-why">${lk('셋을 따로 세요. 빨리 계산하는 것, 푸는 길을 세우는 것, 문장을 읽어 내는 것은 서로 다른 힘이라, 합쳐 버리면 어느 쪽이 막혔는지 안 보여요. 독셈에는 답만 쓰는 게 아니라 <b>푸는 과정의 빈칸</b>을 채우는 문제가 들어 있어요.',
        'We score the three separately. Computing fast, building a route through a problem, and reading a problem are different abilities — one combined score hides which one is stuck. The creative part includes questions where you fill in <b>the steps</b>, not just the answer.',
        '三项分开计分。算得快、想出解法路径、读懂题是不同的能力，合成一个分数就看不出卡在哪里。巧算里有需要填<b>解题步骤空格</b>的题，不只是写答案。')}</p>
      <button class="nm-btn full" id="cuGo">${lk('시작하기','Start','开始')}</button>
    </div></div></div>`;
    $('#cuBack').onclick=back;
    $('#cuGo').onclick=()=>{ k.stage='q'; save(); screenCheckup(); };
    return;
  }

  if(k.stage==='result'){
    if(k.rewardSavePending)finishCheckup(k);
    const rec=checkupRecord(k.num);
    const calcPct=k.calcTotal?Math.round(k.calcOk/k.calcTotal*100):null;
    const crePct=k.creTotal?Math.round(k.creOk/k.creTotal*100):null;
    const wpPct=k.wpTotal?Math.round(k.wpOk/k.wpTotal*100):null;
    const calcGood=calcPct!=null&&calcPct>=70;
    const creGood=crePct==null||crePct>=60;   /* 창의가 없는 과정이면 발목 잡지 않는다 */
    const wpGood=wpPct!=null&&wpPct>=60;
    /* 읽어 주는 말은 네 경우로 갈린다. 원장이 말한 그 상태(계산 ○·문장제 ✕)가
       가장 중요한 칸이라 거기에 가장 구체적인 처방을 붙인다. */
    const verdict = calcGood&&wpGood
      ? lk('계산도 문장제도 잘 따라가고 있어요. 다음 과정으로 가도 좋아요.',
           'Both the computing and the reading are holding up. Good to move on.',
           '计算和应用题都跟得上，可以继续下一个课程。')
      : calcGood&&!wpGood
      ? lk('계산은 잘 돼요. 그런데 문장을 읽어 내는 쪽이 아직 덜 여물었어요. 이건 연산을 더 시킨다고 따라오지 않아요 — 문제를 소리 내어 읽고 "무엇을 알려 줬고 무엇을 묻는지"를 먼저 갈라 보는 연습이 필요해요. 진도를 서두르면 뒤에서 더 크게 걸려요.',
           'The computing is fine, but reading the problem is not there yet. More drills will not fix this — read the problem aloud and separate what is given from what is asked. Rushing ahead makes this bite harder later.',
           '计算没问题，但读题还没成熟。多做计算练习解决不了——要把题读出声，先分清"给了什么"和"问什么"。赶进度以后会更吃力。')
      : !calcGood&&wpGood
      ? lk('무엇을 묻는지는 잘 읽어 내요. 계산이 아직 손에 안 붙었을 뿐이라, 같은 자리를 조금만 더 반복하면 돼요.',
           'You read the problem well; the computing just needs more time in the hand. A little more repetition at the same spot.',
           '题读得很好，只是计算还不够熟。在同一处多练一点就好。')
      : lk('두 가지 다 한 번 더 다지고 가요. 앞으로 가는 것보다 지금 자리를 단단히 하는 편이 빨라요.',
           'Both could use another pass. Firming up here beats pushing ahead.',
           '两项都再巩固一次。把现在这一步走稳比往前赶更快。');
    /* 창의(푸는 과정)만 따로 처진 경우는 위 네 갈래로는 안 보인다 — 계산도 문장제도
       되는데 길을 세우는 데서 막히는 아이가 있다. 한 줄을 덧붙여 그 자리를 짚는다. */
    const creNote = (k.creTotal && !creGood)
      ? (k.num >= CHECKUP_CRE_FROM_MIDDLE
      ? lk('적용(배운 것을 문제에 쓰는 자리)이 따로 처져요. 계산은 되는데 적용에서 멈춘다면, 문제를 더 푸는 것보다 <b>이 문제가 어느 개념을 부르는지</b>를 먼저 말해 보는 연습이 필요해요.',
           'Applying what was learned lags on its own. If the computing works but applying stalls, practise naming <b>which idea the problem is calling for</b> before solving more of them.',
           '应用（把学过的用到题目上）单独落后。如果计算没问题却卡在应用，比起多做题，先练习说出<b>这道题在叫哪个概念</b>。')
      : lk('독셈(푸는 길 세우기)이 따로 처져요. 답은 나오는데 과정의 빈칸에서 멈춘다면, 답을 맞히는 연습이 아니라 <b>왜 그 순서로 푸는지</b>를 소리 내어 말해 보는 연습이 필요해요.',
           'The creative part — building a route — lags on its own. If the answer comes but the step blanks stall, practise saying <b>why</b> the steps go in that order, not more answer drills.',
           '巧算（想出解法路径）单独落后。如果答案能算出来却卡在步骤空格，需要练习说出<b>为什么按这个顺序解</b>，而不是多做计算。'))
      : (k.creTotal && creGood && !calcGood)
      ? lk('푸는 길은 잘 세워요. 그 길 위에서 손이 느릴 뿐이에요.',
           'You build the route well — the hand on that route is just still slow.',
           '解法路径想得好，只是在这条路上手还慢。')
      : '';
    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="cuBack">← ${navigationLabel('courseroad')}</button>
      <div class="nm-unit-title">🩺 ${lk('연산 점검','Check-up','运算检查')}</div>
    </div>
    <div class="nm-step-body"><div class="nm-dialog"><div class="nm-cu-wrap">
      <h2 class="nm-cu-h">${lk('점검 결과','Check-up result','检查结果')}</h2>
      <div class="nm-cu-scores${k.creTotal?' three':''}">
        <div class="nm-cu-score${calcGood?' good':''}">
          <b>🔢 ${lk('계산','Calculating','计算')}</b>
          <span class="nm-cu-num">${k.calcOk}<i>/${k.calcTotal}</i></span>
        </div>
        ${k.creTotal?`<div class="nm-cu-score cre${crePct>=60?' good':''}">
          <b>✨ ${lk('독셈','Doc-T Math','巧算')}</b>
          <span class="nm-cu-num">${k.creOk}<i>/${k.creTotal}</i></span>
        </div>`:''}
        <div class="nm-cu-score wp${wpGood?' good':''}">
          <b>📖 ${lk('문장제 이해','Reading','应用题理解')}</b>
          <span class="nm-cu-num">${k.wpOk}<i>/${k.wpTotal}</i></span>
        </div>
      </div>
      <p class="nm-cu-verdict">${verdict}</p>
      ${creNote?`<p class="nm-cu-verdict cre">${creNote}</p>`:''}
      <button class="nm-btn full" id="cuDone">${navigationLabel('courseroad')}</button>
      <button class="nm-btn full ghost" id="cuAgain">${lk('다시 점검하기','Check again','再检查一次')}</button>
    </div></div></div>`;
    $('#cuBack').onclick=back; $('#cuDone').onclick=back;
    $('#cuAgain').onclick=()=>startCheckup(k.num, true);
    if(rec&&calcGood&&wpGood) confetti();
    return;
  }

  /* ── 문항 ── */
  if(k.i>=k.items.length){ finishCheckup(k); screenCheckup(); return; }
  const item=k.items[k.i];
  const TH=window.NM_THREADS||{};
  const th=TH[item.t];
  if(!k.cur){
    /* item.kinds — 문장제만 넘어온다(그 과정이 연습하는 의미 유형). 없으면 예전 그대로. */
    k.cur=placementProblem({thread:item.t, level:item.lv}, k.i, 'chk'+k.run,
      item.kinds?{kinds:item.kinds}:null);
    k.qStart=Date.now();
  }
  const cur=k.cur;
  const isMulti=Array.isArray(cur.answer);
  const hasTex=!!cur.tex;
  /* 독셈만 steps 위젯으로 보낸다 — tex가 같이 있어도.
     원장 지시의 "빈칸 넣기"가 바로 그 위젯이라, 창의 문항을 tex 한 줄로 떨어뜨리면
     푸는 과정이 사라지고 답만 묻는 문제가 된다.
     반대로 **계산 문항은 steps가 있어도 위젯으로 보내지 않는다.** 필산 스레드도
     상당수가 steps를 내는데(예: 세 자리×한 자리), 그것까지 단계 입력으로 바꾸면
     계산 12문항이 전부 여러 단계짜리가 되어 점검이 학습이 되어 버린다. */
  const hasSteps=Array.isArray(cur.steps)&&cur.steps.length;
  /* processFirst(threads.js, DV12~15) — 뜻을 묻는 나눗셈은 계산 회차여도 배열·단계 위젯으로
     과정을 밟는다(2026-09-17). 숫자패드로 답만 찍으면 "몇 명에게 몇 개씩"이 사라진다. */
  const processFirst=!!(th && th.processFirst);
  const useWidget=!!(window.NM_WIDGETS && cur.widget && cur.widget!=='numpad'
    && (!hasTex || processFirst || (item.kind==='creative' && (hasSteps || cur.widget==='steps'))));
  /* 자릿값 색 힌트 — 어린 학습자에게만, 그리고 세 문제에 하나만(원장 "몇 문제는").
     전부 칠하면 색이 배경이 되어 힌트가 아니게 된다.
     ★ 문항 번호가 아니라 **색을 칠할 수 있는 문항**을 센다. 번호로 세면 그 자리가
     마침 자릿값이 없는 문제(한 자리 덧셈·자릿값 읽기)일 때 힌트가 통째로 날아간다 —
     실제로 첫 시안이 18문항 중 한 번도 안 칠했다.
     판정은 문항에 한 번만 박아 둔다(다시 그려도 색이 켜졌다 꺼졌다 하지 않게). */
  const PV=window.NM_PLACE_COLOR;
  if(item.pv===undefined){
    const can=!!PV && item.kind==='calc' && !processFirst && placeHintWanted() && PV.eligible(cur.tex);
    if(can){ k.pvCount=(k.pvCount||0); item.pv=(k.pvCount%3===0); k.pvCount++; }
    else item.pv=false;
    save();
  }
  const wantHint=!!item.pv && !!PV;
  const texForShow=wantHint?PV.tint(cur.tex):cur.tex;
  /* 문장제는 이야기·물음·보기를 따로 그린다(말풍선 한 덩어리 대신) */
  const wpHtml=(item.kind==='wp'||(cur.word&&cur.choices))?wpBlockHtml(cur, S.lang):null;   // 보기 고르기 문항도 이야기·보기를 따로
  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="cuBack">← ${navigationLabel('courseroad')}</button>
    <div class="nm-unit-title">🩺 ${lk('연산 점검','Check-up','运算检查')}</div>
  </div>
  <div class="nm-step-body"><div class="nm-dialog">
    <div class="nm-dg-step">${item.kind==='wp'?`📖 ${lk('문장제 이해','Reading word problems','应用题理解')}`
      :item.kind==='creative'?`✨ ${lk('독셈','Doc-T Math','巧算')}`
      :`🔢 ${lk('계산','Calculating','计算')}`}${th?` · ${esc(L(th.name))}`:''}</div>
    <div class="nm-prog">${dots(k.items.length,k.i)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
    ${wpHtml||`<div class="nm-bubble">${esc(L(cur.prompt))}</div>`}
    ${useWidget?`<div id="cuWidget" class="nm-lab-widget"></div>`:`
    ${hasTex?`<div class="nm-lab-expr">${labExprHtml(texForShow)}</div>`:''}
    ${(wantHint&&PV.kind(cur.tex)==='place')?PV.legendHtml(S.lang, PV.placesUsed(cur.tex)):''}
    ${isMulti?`<p class="nm-dg-multihint">${lk('답이 여러 개면 쉼표(,)로 나눠 써요','Separate multiple answers with commas','多个答案用逗号分开')}</p>`:''}
    <div class="nm-numpad-screen" id="cuScreen">&nbsp;</div>
    <div class="nm-numpad" id="cuPad"></div>`}
  </div></div>`;
  $('#cuBack').onclick=back;
  renderMath(scr);

  let submitted=false;
  const answerIndex=k.i;
  const submit=ok=>{
    if(submitted||S.view!=='checkup'||S._checkup!==k||k.i!==answerIndex)return;
    submitted=true;
    if(item.kind==='wp'){ if(ok) k.wpOk++; }
    else if(item.kind==='creative'){ if(ok) k.creOk=(k.creOk||0)+1; }
    else { if(ok) k.calcOk++; }
    k.log.push({t:item.t, lv:item.lv, kind:item.kind, ok,
      sec:Math.max(0,Math.round((Date.now()-(k.qStart||Date.now()))/1000))});
    k.i++; k.cur=null; k.qStart=null;
    save();
    if(ok) playSfx('success');
    lessonLater(()=>{if(S.view==='checkup'&&S._checkup===k)screenCheckup();},ok?520:820);
  };
  if(useWidget){
    NM_WIDGETS.render(cur,$('#cuWidget'),val=>{
      const ok=isMulti
        ? Array.isArray(val)&&val.length===cur.answer.length&&val.every((v,i)=>+v===cur.answer[i])
        : +val===cur.answer;
      submit(ok);
    });
    return;
  }
  const screenEl=$('#cuScreen');
  let inp='';
  buildNumpad($('#cuPad'),val=>{
    if(val==='ok'){
      if(inp===''||inp==='-') return;
      if(isMulti){
        const parts=inp.split(',').map(x=>x.trim()).filter(x=>x!=='');
        const nums=parts.map(parseFloat);
        submit(nums.length===cur.answer.length&&nums.every((v,i)=>v===cur.answer[i]));
      } else submit(parseFloat(inp)===cur.answer);
      return;
    }
    if(val==='del') inp=inp.slice(0,-1);
    else if(val==='-') inp=applyMinusKey(inp);
    else if(val===','){ if(inp!==''&&!inp.endsWith(',')) inp+=','; }
    else if(inp.replace(/[-,]/g,'').length<(isMulti?16:6)&&!(val==='.'&&inp.split(',').pop().includes('.'))) inp+=val;
    screenEl.textContent=inp||' ';
  },{decimal:isMulti?true:!Number.isInteger(cur.answer), negative:isMulti?true:!!cur.negative, comma:isMulti});
}

function middleExtensionProposal(grade,phase,enabled){
  const base=effectiveLearningSettings(),weekKey=weekKeyFor(new Date());
  const at=NM_PLAN_CONTROL.position(NM_COURSES,base,weekKey),map={...base.middleExtensions};
  const endKey='C'+({1:31,2:34,3:37}[grade]),nextKey='C'+({1:32,2:35,3:38}[grade]);
  const selected=!!map[grade];
  if(enabled)map[grade]=NM_MIDDLE_EXTENSION.version;else delete map[grade];
  const patch={middleExtensions:map};
  if(enabled&&phase==='end'&&!selected){
    patch.courseKey=endKey;patch.sessionIndex=NM_COURSES[endKey].sessions.length;
    patch.extensionAnchor={grade,index:0};
    if(at.courseKey===nextKey&&at.sessionIndex>1)patch.extensionAnchor.resume={courseKey:nextKey,sessionIndex:at.sessionIndex};
  }else if(!enabled&&at.extensionAnchor?.grade===grade){
    patch.courseKey=nextKey;patch.sessionIndex=at.extensionAnchor.resume?.sessionIndex||1;patch.extensionAnchor=null;
  }
  return {patch,next:NM_PLAN_CONTROL.change(NM_COURSES,base,patch,{now:new Date(),weekKey})};
}
function openMiddleExtensionSheet(guidance){
  if(document.getElementById('nmMiddleExtensionSheet')||!window.NM_MIDDLE_EXTENSION)return;
  const {grade,phase}=guidance,lk=(ko,en,zh)=>S.lang==='en'?en:S.lang==='zh'?zh:ko;
  const current=effectiveLearningSettings(),selected=!!current.middleExtensions?.[grade],managed=!!S.adminPlan;
  const previousFocus=document.activeElement,course=NM_MIDDLE_EXTENSION.course(grade);
  document.body.insertAdjacentHTML('beforeend',`<div class="nm-gate-overlay nm-cs-overlay" id="nmMiddleExtensionSheet"><div class="nm-gate-card nm-cs-card nm-plan-sheet" role="dialog" aria-modal="true" aria-labelledby="middleExtensionTitle" aria-describedby="middleExtensionNote">
    <button class="nm-gate-x" id="middleExtensionX" aria-label="${lk('닫기','Close','关闭')}">✕</button>
    <span class="nm-cr-eyebrow">${lk('선택 심화','Optional deeper study','可选进阶')}</span>
    <h3 class="nm-cs-title" id="middleExtensionTitle">${lk('중'+grade+' 심화 포함 계획','Grade '+(grade+6)+' plan with deeper study','初'+grade+'含进阶计划')}</h3>
    <p id="middleExtensionNote">${lk('기본 과정 뒤에 심화·적용 12묶음을 이어 공부해요. 완료 기록과 진단 결과는 유지해요.','Twelve deeper-study and application bundles follow the core course. Completed work and assessment results are kept.','基础课程后继续学习12组进阶与应用，保留完成记录及测评结果。')}</p>
    ${managed?`<p class="nm-plan-managed" id="middleExtensionManaged">${lk('학원에서 정한 계획이에요. 심화 선택은 학원에 요청해 주세요.','Your academy manages this plan. Ask your academy to add deeper study.','此计划由学院设置，请联系学院添加进阶学习。')}</p>`:''}
    <div class="nm-plan-preview" id="middleExtensionPreview" aria-live="polite"></div>
    <details class="nm-plan-extra"><summary>${lk('심화 12묶음 살펴보기','Explore the 12 deeper-study bundles','查看12组进阶内容')}</summary><ol class="nm-extension-topics">${(course?.sessions||[]).map(s=>`<li>${esc(L(s.title))}</li>`).join('')}</ol><p class="nm-plan-help">${lk('고급 계산 유형을 골라 종합·적용 연습과 다음 과정 연결 학습으로 편성했어요.','Advanced calculation types are combined into application practice and connections to the next course.','选取高阶运算类型，组合为综合应用练习及下一课程衔接。')}</p></details>
    <p id="middleExtensionError" class="nm-plan-error" role="alert" hidden></p>
    <div class="nm-plan-actions"><button class="nm-btn ghost" id="middleExtensionCancel">${lk('취소','Cancel','取消')}</button><button class="nm-btn" id="middleExtensionConfirm"${managed?' disabled':''}>${lk(selected?'선택한 계획 유지':'심화 포함 계획 적용',selected?'Keep selected plan':'Apply plan with deeper study',selected?'保留已选计划':'应用含进阶计划')}</button></div>
    ${selected?`<button class="nm-btn full ghost" id="middleExtensionRemove"${managed?' disabled':''}>${lk('선택 심화 빼고 기본 경로로','Remove optional deeper study','移除可选进阶')}</button>`:''}
  </div></div>`);
  const modal=document.getElementById('nmMiddleExtensionSheet'),find=id=>modal.querySelector('#'+id);
  const close=()=>{modal.remove();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});};
  try{
    const {next}=middleExtensionProposal(grade,phase,true);
    const p=NM_LEARNING_PLAN.project(NM_COURSES,{...next,entryYear:S.schoolAge?.entryYear,birthYear:S.schoolAge?.birthYear},{lang:S.lang,now:new Date()});
    const goal=p.milestones.find(m=>m.key==='M'+grade+'E');
    find('middleExtensionPreview').innerHTML=`<span>${lk('표준 속도 기준','At standard pace','标准速度基准')}</span><b>${lk('기본 10주 + 선택 심화 6주 = 총 16주','10 core weeks + 6 optional weeks = 16 weeks total','基础10周 + 可选进阶6周 = 合计16周')}</b><p>${lk('심화 선택 시에만 기본 포함 약 4개월이에요.','About 4 months total only when deeper study is selected.','仅在选择进阶时含基础合计约4个月。')}</p>${goal?`<p>${lk('현재 진도·속도에서 심화 완료 예상','Deeper-study finish at your current progress and pace','按当前进度和速度预计完成进阶')}<time datetime="${esc(goal.date)}">${esc(goal.date)}</time><small>${esc(goal.schoolLabel)}</small></p>`:''}<small>${lk('주 2묶음·1배 속도 기준이에요. 이미 공부한 기간과 개인 속도에 따라 남은 기간은 달라져요.','The reference is two bundles per week at 1×. Time remaining depends on prior study and your selected pace.','基准为每周2组、1倍速度，剩余时间随已学进度及个人速度改变。')}</small>`;
    if(!goal)throw new Error('missing_extension_milestone');
  }catch(e){find('middleExtensionError').textContent=lk('계획을 확인하지 못했어요. 진도·속도 조절에서 시작점을 확인해 주세요.','Could not preview this plan. Check your starting position in Progress & pace.','未能预览计划，请在进度与速度中确认起点。');find('middleExtensionError').hidden=false;find('middleExtensionConfirm').disabled=true;}
  function apply(enabled){
    if(managed)return;
    try{
      const {patch}=middleExtensionProposal(grade,phase,enabled);
      if(!applyLearningSettings(patch,{key:guidance.key,value:enabled?'enrolled':'continue'}))throw new Error('extension_save_failed');
      close();render();toast(lk(enabled?'선택 심화 계획을 적용했어요.':'기본 경로로 바꿨어요.',enabled?'Optional deeper study added.':'Returned to the core route.',enabled?'已添加可选进阶计划。':'已切换为基础路线。'));
    }catch(e){find('middleExtensionError').textContent=lk('저장하지 못했어요. 다시 시도해 주세요.','Could not save. Please try again.','未能保存，请重试。');find('middleExtensionError').hidden=false;}
  }
  find('middleExtensionConfirm').onclick=()=>apply(true);const remove=find('middleExtensionRemove');if(remove)remove.onclick=()=>apply(false);
  find('middleExtensionX').onclick=close;find('middleExtensionCancel').onclick=close;
  modal.onclick=e=>{if(e.target===modal)close();};
  modal.onkeydown=e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key!=='Tab')return;
    const items=[...modal.querySelectorAll('button,summary')].filter(x=>!x.disabled&&x.getClientRects().length),first=items[0],last=items.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  find('middleExtensionX').focus({preventScroll:true});
}

function openLearningPlanSheet(initial){
  if(document.getElementById('nmPlanSheet')||!window.NM_PLAN_CONTROL)return;
  const lk=(ko,en,zh)=>S.lang==='en'?en:S.lang==='zh'?zh:ko;
  const courses=window.NM_COURSES||{},base=effectiveLearningSettings(),weekKey=weekKeyFor(new Date());
  const at=NM_PLAN_CONTROL.position(courses,base,weekKey)||base;
  const draft={courseKey:initial?.courseKey||at.courseKey,sessionIndex:initial?.sessionIndex||at.sessionIndex,
    speed:base.speed||1,amount:base.amount||1,cadence:base.cadence||'w1',pace:base.pace||'p2',
    ...(!initial?.courseKey&&at.extensionAnchor?{extensionAnchor:{...at.extensionAnchor,...(at.extensionAnchor.resume?{resume:{...at.extensionAnchor.resume}}:{})}}:{})};
  const list=roadCourseList().filter(x=>courseBuilt(x.c)&&NM_PLAN_CONTROL.choices(x.c).length);
  const managed=!!S.adminPlan,previousFocus=document.activeElement;
  const speedNames=[lk('천천히','Slow','慢速'),lk('여유 있게','Steady','从容'),lk('표준','Standard','标准'),lk('빠르게','Fast','快速'),lk('더 빠르게','Faster','更快')];
  document.body.insertAdjacentHTML('beforeend',`<div class="nm-gate-overlay nm-cs-overlay" id="nmPlanSheet">
    <div class="nm-gate-card nm-cs-card nm-plan-sheet" role="dialog" aria-modal="true" aria-labelledby="planTitle" aria-describedby="planNote">
      <button class="nm-gate-x" id="planX" aria-label="${lk('닫기','Close','关闭')}">✕</button>
      <span class="nm-cr-eyebrow">${lk('나에게 맞는 계획','A plan for you','适合我的计划')}</span>
      <h3 class="nm-cs-title" id="planTitle">${lk('진도·속도 조절','Progress & pace','进度与速度')}</h3>
      <p id="planNote">${lk('다시 공부할 곳이나 앞서 배울 곳을 골라요. 완료 기록과 진단 결과는 그대로 남아요.',
        'Choose where to review or move ahead. Completed work and assessment results are kept.',
        '选择复习或继续学习的位置，完成记录和测评结果都会保留。')}</p>
      ${managed?`<p class="nm-plan-managed" id="planManaged">${lk('학원에서 정한 개인별 계획이에요. 진도·속도 변경은 학원에 요청해 주세요.','Your academy manages this plan. Ask your academy to change progress or pace.','此计划由学院设置，请联系学院调整进度或速度。')}</p>`:''}
      <fieldset class="nm-plan-fields"${managed?' disabled':''}>
        <legend>${lk('학습할 위치','Learning position','学习位置')}</legend>
        <label for="planCourse">${lk('과정','Course','课程')}</label>
        <select id="planCourse">${list.map(x=>`<option value="${x.key}">${lk('과정','Course','课程')} ${x.num} · ${esc(L(x.c.title))}</option>`).join('')}</select>
        <div class="nm-plan-stepper"><button type="button" id="planPrev">← ${lk('이전 과정','Previous course','上一课程')}</button><button type="button" id="planNext">${lk('다음 과정','Next course','下一课程')} →</button></div>
        <label for="planSession">${lk('시작할 회차','Starting lesson','起始课次')}</label><select id="planSession"></select>
        <div class="nm-plan-speed-title">${lk('학습 속도 · 5단계','Learning pace · 5 levels','学习速度 · 5档')}</div>
        <div class="nm-plan-speeds" role="group" aria-label="${lk('학습 속도','Learning pace','学习速度')}">${ROAD_MULTS_LIST.map((v,i)=>`<button type="button" data-plan-speed="${v}" aria-pressed="${v===draft.speed}"><span>${i+1}</span><b>${speedNames[i]}</b><small>${v}${lk('배','×','倍')}</small></button>`).join('')}</div>
        <p class="nm-plan-help">${lk('속도를 낮추면 더 오래 다지고, 높이면 같은 내용을 더 빨리 배워요.','A slower pace gives more time; a faster pace covers the same content sooner.','放慢速度可多巩固，提高速度可更早学完相同内容。')}</p>
        <details class="nm-plan-extra"><summary>${lk('주당 학습 횟수·문항 수','Weekly frequency & question count','每周次数与题量')}</summary>
          <label for="planCadence">${lk('주당 학습 묶음','Study bundles per week','每周学习组')}</label><select id="planCadence"><option value="w1">${lk('주 1묶음','1 bundle per week','每周1组')}</option><option value="w2">${lk('주 2묶음','2 bundles per week','每周2组')}</option></select>
          <label for="planAmount">${lk('계산 문항 수','Calculation question count','运算题量')}</label><select id="planAmount">${ROAD_MULTS_LIST.map(v=>`<option value="${v}">${v===1?lk('기본','Standard','标准'):v+lk('배','×','倍')}</option>`).join('')}</select>
          <p class="nm-plan-help">${lk('문항 수는 연습량만 바꿔요. 진도와 완료 예상일은 속도·주당 묶음 수로 정해요.','Question count changes practice volume. Pace and weekly bundles set the schedule.','题量只改变练习量，速度和每周组数决定进度。')}</p>
        </details>
      </fieldset>
      <div class="nm-plan-preview" id="planPreview" aria-live="polite" aria-atomic="true"></div>
      <p class="nm-plan-error" id="planError" role="alert" hidden></p>
      <div class="nm-plan-actions"><button class="nm-btn ghost" id="planCancel">${lk('취소','Cancel','取消')}</button><button class="nm-btn" id="planApply"${managed?' disabled':''}>${lk('이 계획 적용','Apply this plan','应用此计划')}</button></div>
    </div></div>`);
  const modal=document.getElementById('nmPlanSheet'),find=id=>modal.querySelector('#'+id);
  const close=()=>{modal.remove();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});};
  function fillSessions(){
    const course=courses[draft.courseKey],choices=NM_PLAN_CONTROL.choices(course);
    if(draft.extensionAnchor){
      const grade=draft.extensionAnchor.grade;
      find('planSession').innerHTML=Array.from({length:NM_MIDDLE_EXTENSION.length(grade)},(_,i)=>`<option value="e${i}" data-display="${i+1}">${lk('중'+grade+' 선택 심화','Grade '+(grade+6)+' optional deeper study','初'+grade+'可选进阶')} ${i+1}</option>`).join('');
      find('planSession').value='e'+draft.extensionAnchor.index;find('planCourse').value=draft.courseKey;
      const i=list.findIndex(x=>x.key===draft.courseKey);find('planPrev').disabled=managed||i<=0;find('planNext').disabled=managed||i>=list.length-1;
      return;
    }
    if(course.studyPlan&&!choices.some(x=>x.sessionIndex===draft.sessionIndex)){
      const group=NM_HIGH_PACING.lessonIndex(course,draft.sessionIndex);
      choices.splice(group+1,0,{index:group+1,sessionIndex:draft.sessionIndex,partial:true});
    }
    const chosen=choices.find(x=>x.sessionIndex===draft.sessionIndex)||choices.slice().reverse().find(x=>x.sessionIndex<=draft.sessionIndex)||choices[0];
    draft.sessionIndex=chosen?.sessionIndex||1;
    find('planSession').innerHTML=choices.map(x=>`<option value="${x.sessionIndex}" data-display="${x.index}">${course?.studyPlan?lk('학습 묶음','Study bundle','学习组'):lk('회차','Lesson','课次')} ${x.index}${x.partial?lk(' · 이어서',' · continue',' · 继续'):''}</option>`).join('');
    find('planSession').value=String(draft.sessionIndex);
    find('planCourse').value=draft.courseKey;
    const i=list.findIndex(x=>x.key===draft.courseKey);
    find('planPrev').disabled=managed||i<=0;find('planNext').disabled=managed||i>=list.length-1;
  }
  function preview(){
    try{
      const next=NM_PLAN_CONTROL.change(courses,base,draft,{now:new Date(),weekKey});
      const result=NM_LEARNING_PLAN.project(courses,{...next,entryYear:S.schoolAge?.entryYear,birthYear:S.schoolAge?.birthYear},{lang:S.lang,now:new Date()});
      const tier=courses[draft.courseKey].tier,last=list.filter(x=>x.c.tier===tier).at(-1);
      const grade=/^middle([123])$/.exec(tier)?.[1];
      const goal=(grade&&next.middleExtensions?.[grade]?result.milestones.find(m=>m.key==='M'+grade+'E'):null)||result.milestones.find(m=>m.key===last?.key)||result.milestones[0];
      find('planPreview').innerHTML=`<span>${lk('적용 후 예상','After applying','应用后预计')}</span><b>${lk('과정','Course','课程')} ${draft.courseKey.slice(1)} · ${esc(find('planSession').selectedOptions[0]?.textContent||'')} · ${draft.speed}${lk('배 속도','× pace','倍速度')}</b>${goal?`<p>${esc(goal.title)} ${lk('완료','finish','完成')} <time datetime="${esc(goal.date)}">${esc(goal.date)}</time><small>${esc(goal.schoolLabel)}</small></p>`:''}<small>${lk('이번 주부터 새 계획을 적용해요. 완료 날짜는 실제 학습에 따라 달라질 수 있어요.','The new plan starts this week. Finish dates may change with actual study.','从本周开始应用新计划，完成日期可能随实际学习调整。')}</small>`;
      find('planError').hidden=true;
    }catch(e){find('planError').textContent=lk('계획을 확인하지 못했어요. 과정과 회차를 다시 골라 주세요.','Could not preview this plan. Choose a course and lesson again.','未能预览计划，请重新选择课程与课次。');find('planError').hidden=false;}
  }
  fillSessions();find('planCadence').value=draft.cadence;find('planAmount').value=String(draft.amount);preview();
  find('planCourse').onchange=e=>{delete draft.extensionAnchor;draft.courseKey=e.target.value;draft.sessionIndex=1;fillSessions();preview();};
  find('planSession').onchange=e=>{if(draft.extensionAnchor)draft.extensionAnchor.index=+e.target.value.slice(1);else draft.sessionIndex=+e.target.value;preview();};
  ['Prev','Next'].forEach((name,i)=>{find('plan'+name).onclick=()=>{const at=list.findIndex(x=>x.key===draft.courseKey),item=list[at+(i?1:-1)];if(!item)return;delete draft.extensionAnchor;draft.courseKey=item.key;draft.sessionIndex=1;fillSessions();preview();};});
  modal.querySelectorAll('[data-plan-speed]').forEach(b=>{b.onclick=()=>{draft.speed=+b.dataset.planSpeed;modal.querySelectorAll('[data-plan-speed]').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.planSpeed===draft.speed)));preview();};});
  find('planCadence').onchange=e=>{draft.cadence=e.target.value;preview();};
  find('planAmount').onchange=e=>{draft.amount=+e.target.value;preview();};
  find('planApply').onclick=()=>{
    if(managed)return;
    if(!applyLearningSettings(draft)){find('planError').textContent=lk('저장하지 못했어요. 다시 시도해 주세요.','Could not save. Please try again.','未能保存，请重试。');find('planError').hidden=false;return;}
    close();render();toast(lk('진도와 속도를 적용했어요.','Progress and pace updated.','已应用进度与速度。'));
  };
  find('planCancel').onclick=close;find('planX').onclick=close;
  modal.onclick=e=>{if(e.target===modal)close();};
  modal.onkeydown=e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key!=='Tab')return;
    const targets=[...modal.querySelectorAll('button,select,summary')].filter(el=>!el.disabled&&!el.closest('fieldset[disabled]')&&el.getClientRects().length),first=targets[0],last=targets.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  find('planX').focus({preventScroll:true});
}

/* 학년 고치기 시트 — 온보딩에서 건너뛰었거나 학년이 바뀐 경우.
   저장은 setSchoolGrade() 하나만 쓴다(입학 연도로 환산해 넣는다). */
function openAgeSheet(after){
  if(document.getElementById('nmAgeSheet')) return;
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const cur=schoolGradeNum();
  const opts=schoolGradeOptions();
  document.body.insertAdjacentHTML('beforeend',`<div class="nm-gate-overlay nm-cs-overlay" id="nmAgeSheet">
    <div class="nm-gate-card nm-cs-card">
      <button class="nm-gate-x" id="ageX" aria-label="${lk('닫기','Close','关闭')}">✕</button>
      <h3 class="nm-cs-title">🎒 ${lk('몇 학년인가요?','What grade?','几年级？')}</h3>
      <p class="nm-cs-lead">${lk('학년은 어떤 과정도 잠그지 않아요. 중등·고등 구간을 열 때 지금 시작해도 될지 안내하는 데만 써요.',
        'Grade never locks a course. We only use it to advise when you open the middle- and high-school stretches.',
        '年级不会锁住任何课程，只在打开初中、高中区间时用来提示现在是否合适。')}</p>
      <div class="nm-ob-grades sheet">${opts.map(o=>
        `<button class="nm-ob-grade${cur!=null&&Math.max(0,cur)===o.g?' sel':''}" data-g="${o.g}" aria-pressed="${cur!=null&&Math.max(0,cur)===o.g}">${esc(o.label)}</button>`).join('')}</div>
      ${S.schoolAge?.entryYear?`<button class="nm-btn full ghost" id="ageClear">${lk('학년 지우기','Clear grade','清除年级')}</button>`:''}
    </div>
  </div>`);
  const close=()=>{ const m=document.getElementById('nmAgeSheet'); if(m)m.remove(); };
  document.getElementById('ageX').onclick=close;
  document.getElementById('nmAgeSheet').addEventListener('click',e=>{ if(e.target.id==='nmAgeSheet') close(); });
  document.querySelectorAll('#nmAgeSheet .nm-ob-grade').forEach(b=>{
    b.onclick=()=>{ setSchoolGrade(+b.dataset.g); save(); close(); if(after)after(); else render(); };
  });
  const clr=document.getElementById('ageClear');
  if(clr) clr.onclick=()=>{ S.schoolAge=S.schoolAge?.birthYear?{birthYear:S.schoolAge.birthYear,setAt:Date.now()}:null; save(); close(); if(after)after(); else render(); };
}

function openStudentSwitch(){
  if(document.getElementById('nmWhoSheet'))return;
  const lk=(k,e,z)=>S.lang==='ko'?k:S.lang==='en'?e:z;
  document.body.insertAdjacentHTML('beforeend',`<div class="nm-gate-overlay nm-cs-overlay" id="nmWhoSheet">
    <div class="nm-gate-card nm-cs-card"><button class="nm-gate-x" id="whoX" aria-label="${lk('닫기','Close','关闭')}">✕</button>
      <h3 class="nm-cs-title">${lk('내 학습 정보','My learning details','我的学习信息')}</h3>
      <p>${lk('학생마다 별도 아이디(이메일)로 로그인해요. 형제는 보호자 전화번호가 같아도 돼요.','Each learner signs in with a separate email account. Siblings may share a guardian phone number.','每位学生使用独立邮箱账号登录，兄弟姐妹可共用监护人手机号。')}</p>
      <button class="nm-btn full ghost" id="whoAge">🎒 ${schoolGradeLabel()?lk(`학년 — ${schoolNowLabel()} · 고치기`,`Grade — ${schoolNowLabel()} · change`,`年级 — ${schoolNowLabel()} · 修改`):lk('학년 알려주기','Tell us the grade','告诉我们年级')}</button>
      <a class="nm-btn full" href="access.html?lang=${encodeURIComponent(S.lang)}" id="whoLogin">${lk('다른 아이디로 로그인','Sign in to another account','登录其他账号')}</a>
    </div></div>`);
  const close=()=>document.getElementById('nmWhoSheet')?.remove();
  document.getElementById('whoX').onclick=close;
  document.getElementById('nmWhoSheet').addEventListener('click',e=>{if(e.target.id==='nmWhoSheet')close();});
  document.getElementById('whoAge').onclick=()=>{close();openAgeSheet(()=>render());};
}

/* 연산 로드맵의 선 아이콘(2026-09-26 v2 "밝은 신비") — 제목 앞 이모지 대신 1.6px 선 그림.
   색은 currentColor(잉크 남색 또는 가는 금선) — 글자와 같은 무게로 읽힌다. */
function crIc(name){
  const P={
    flag:'<path d="M6 21V4"/><path d="M6 4.5h11l-2.6 3.8L17 12H6"/>',
    pin:'<path d="M12 21s-6.5-6.9-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 14.1 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.2"/>',
    target:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".9" fill="currentColor"/>',
    compass:'<circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.8l-1.9 4.5-4.5 1.9 1.9-4.5z"/>',
    check:'<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.3l2.6 2.5 5-5.4"/>',
    clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.2"/><circle cx="12" cy="7.8" r=".6" fill="currentColor"/>',
    crown:'<path d="M4.5 17.5h15l1-9-5 3.5L12 6l-3.5 6-5-3.5z"/>',
    tower:'<path d="M8 21V9h8v12"/><path d="M7 9l5-5 5 5"/><path d="M11 21v-4h2v4"/>',
    flask:'<path d="M9.5 3.5h5"/><path d="M10.5 3.5v5.2L5.6 17.6A2 2 0 0 0 7.4 20.5h9.2a2 2 0 0 0 1.8-2.9l-4.9-8.9V3.5"/><path d="M7.8 15h8.4"/>',
    steps:'<path d="M4 19.5h4.5v-4.5H13v-4.5h4.5V6H21"/>',
    star:'<path d="M12 3.8l1.9 5.3 5.3 1.9-5.3 1.9L12 18.2l-1.9-5.3L4.8 11l5.3-1.9z"/>',
    arrow:'<path d="M5 12h13"/><path d="M13 7l5 5-5 5"/>',
    pack:'<path d="M4.5 8.5L12 4.5l7.5 4v8L12 20.5l-7.5-4z"/><path d="M4.5 8.5L12 12.5l7.5-4"/><path d="M12 12.5v8"/>'
  };
  return `<svg class="nm-cr-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[name]||''}</svg>`;
}
/* ============================================================
   속도 비교 진단 (2026-09-26, 원장 "지금 속도면 S학원 A반 / S학원 프리미어 / KMO 속도를
   알 수 있고, 상위 레벨이 되려면 어떻게 해야 하고 기간을 줄여야 하는지").
   기준표·마일스톤 대응·판정은 app/pace-compare.js(출처 주석 포함). 여기서는 주차 계산을
   새로 하지 않고 이 화면이 이미 쓰는 roadTotals()/coursePaceWeeks()/roadPaceMult() 를 넘긴다.
   아무것도 잠그지 않는다 — 안내뿐이다.
   ============================================================ */
/* 설정 하나(cad·pace·speed)에서 "지금 자리 → 과정 N 시작"까지 주. 지금 과정에서 끝낸 몫은 뺀다. */
function paceWeeksToFn(curNum, curFrac, cad, pace, speed){
  const mult=roadPaceMult(pace)/(speed||1);
  const cur=roadCourseList().find(x=>x.num===curNum);
  const curW=cur?coursePaceWeeks(cur.c,cad,mult,speed):0;
  return target=>{
    if(target<=curNum) return 0;
    return Math.max(0, roadTotals(curNum,target-1,cad,mult,speed).weeks - curFrac*curW);
  };
}
/* For an explicit plan, map labels use the same dated milestones as the
   monthly plan, including partial starts. Hypothetical speeds rebase this week. */
function selectedPlanWeeksTo(cad,pace,speed){
  if(!S.learningPlan||S.adminPlan||!window.NM_PLAN_CONTROL||!window.NM_LEARNING_PLAN)return null;
  try{
    const base=effectiveLearningSettings(),options={now:new Date(),weekKey:weekKeyFor(new Date())};
    const changed=base.cadence!==cad||base.pace!==pace||base.speed!==speed;
    const rebased=NM_PLAN_CONTROL.change(NM_COURSES,base,{cadence:cad,pace,speed},options);
    const result=NM_LEARNING_PLAN.project(NM_COURSES,changed?rebased:base,{now:options.now});
    const monday=Date.parse(rebased.startDate+'T00:00:00Z'),cur=+currentCourseKey().slice(1);
    return target=>{
      if(target<=cur)return 0;
      const goal=result.milestones.filter(m=>{
        const extension=/^M([123])E$/.exec(m.key);
        return (extension?({1:31,2:34,3:37}[extension[1]])+.5:+m.key.slice(1))<target;
      }).at(-1);
      return goal?Math.max(0,(Date.parse(goal.date+'T00:00:00Z')-monday)/(7*86400000)):0;
    };
  }catch(e){return null;}
}
/* 판정 한 벌 — 화면과 검사기(window.NM_PACE_DIAG)가 같은 것을 쓴다.
   o 로 설정·과정·나이를 바꿔 볼 수 있다(검사기용). 나이를 모르면 null. */
function paceCompareResult(o){
  const PC=window.NM_PACE_COMPARE;
  if(!PC) return null;
  o=o||{};
  const smNow=o.smNow!=null?o.smNow:schoolMonths();
  if(smNow==null) return null;
  const curKey=o.curKey||currentCourseKey();
  const c=(window.NM_COURSES||{})[curKey];
  const curNum=parseInt(String(curKey).replace(/^C/,''),10);
  let curFrac=o.curFrac;
  if(curFrac==null){ const p=c?courseProgress(c):{done:0,total:0}; curFrac=p.total?p.done/p.total:0; }
  const cur={cad:o.cad||S.roadCadence, pace:o.pace||roadPaceDef(S.roadPace).key, speed:o.speed||S.roadSpeed||1};
  const selected=!o.curKey&&o.curFrac==null;
  const ctx={curNum, curFrac, smNow, weeksTo:(selected&&selectedPlanWeeksTo(cur.cad,cur.pace,cur.speed))||paceWeeksToFn(curNum,curFrac,cur.cad,cur.pace,cur.speed)};
  const ev=PC.evaluate(ctx);
  let sugg=[];
  if(ev.target){
    const settings=[];
    ['w1','w2'].forEach(cad=>ROAD_PACES.forEach(p=>ROAD_MULTS_LIST.forEach(speed=>{
      settings.push({cad, pace:p.key, speed, weeksTo:(selected&&selectedPlanWeeksTo(cad,p.key,speed))||paceWeeksToFn(curNum,curFrac,cad,p.key,speed)});
    })));
    sugg=PC.suggest(ctx, ev.target.key, cur, settings, ROAD_PACES.map(p=>p.key));
  }
  return {ctx, cur, curKey, ev, sugg};
}
window.NM_PACE_DIAG=paceCompareResult;
/* ── 로드맵 시기(2026-09-28, 원장 "각 과정이 언제 시작하고 언제 끝나는지") ──
   과정마다 시작·끝 학령개월. 계산은 **속도 비교 카드와 똑같은 것**을 쓴다 —
   paceWeeksToFn(지금 자리 → 과정 N 시작까지 주) + NM_PACE_COMPARE.childSmAt.
   과정 N 의 끝 = 과정 N+1 의 시작이라 과정 사이에 빈틈이 없다(check-road-timing.js).
   지금 과정은 시작이 "지금"이고, 앞의 과정은 지났다. 나이를 모르면 sm 값은 null(주차만). */
function roadTiming(o){
  o=o||{};
  const PC=window.NM_PACE_COMPARE;
  const smNow=o.smNow!==undefined?o.smNow:schoolMonths();
  const curKey=o.curKey||currentCourseKey();
  const c=(window.NM_COURSES||{})[curKey];
  const curNum=parseInt(String(curKey).replace(/^C/,''),10);
  let curFrac=o.curFrac;
  if(curFrac==null){ const p=c?courseProgress(c):{done:0,total:0}; curFrac=p.total?p.done/p.total:0; }
  const cad=o.cad||S.roadCadence, pace=o.pace||roadPaceDef(S.roadPace).key, speed=o.speed||S.roadSpeed||1;
  const weeksTo=(!o.curKey&&o.curFrac==null&&selectedPlanWeeksTo(cad,pace,speed))||paceWeeksToFn(curNum,curFrac,cad,pace,speed);
  const ctx={curNum, curFrac, smNow, weeksTo};
  const WPM=PC?PC.WEEKS_PER_MONTH:52/12;
  const at=n=>smNow==null?null:(PC?PC.childSmAt(ctx,n):(n<=curNum?null:smNow+weeksTo(n)/WPM));
  const rows={};
  roadCourseList().forEach(x=>{
    const past=x.num<curNum, cur=x.num===curNum;
    rows[x.key]={ num:x.num, past, cur,
      startWeeks: past?null:weeksTo(x.num), endWeeks: past?null:weeksTo(x.num+1),
      startSm: past||cur?null:at(x.num), endSm: past?null:at(x.num+1) };
  });
  return {smNow, curNum, curFrac, cad, pace, speed, rows};
}
window.NM_ROAD_TIMING=roadTiming;
/* 3D 지도 이름표용 — 과정 키 → 시작 시기 한 마디("초1 5월" · "지금" · 지난 과정은 빈 문자열). 나이를 모르면 전부 빈 문자열 */
function roadStartLabels(){
  const ko=S.lang==='ko', en=S.lang==='en';
  const tm=roadTiming(), out={};
  Object.keys(tm.rows).forEach(k=>{
    const r=tm.rows[k];
    out[k]=tm.smNow==null||r.past?'':r.cur?(ko?'지금':en?'Now':'现在'):pcAgeLabel(r.startSm);
  });
  return out;
}
/* 길 위의 이정표 — 중등·중2·고등·미적분이 시작되는 과정. 번호는 데이터에서 찾는다
   (중등·고등 = 속도 비교 마일스톤, 중2·미적분 = 그 tier 의 첫 과정). */
function roadMilestones(){
  const PC=window.NM_PACE_COMPARE;
  const firstOf=tier=>{ const x=roadCourseList().find(x=>x.c.tier===tier); return x?x.num:null; };
  const ms=m=>m?m.course:null;
  return [
    {id:'MID',  course:PC?ms(PC.milestone('MID')):firstOf('middle1'),   name:PC&&PC.milestone('MID')?PC.milestone('MID').name:{ko:'중등 연산 시작',en:'Start of middle-school arithmetic',zh:'开始初中运算'}},
    {id:'M2',   course:firstOf('middle2'),   name:{ko:'중2 연산 시작',en:'Start of Grade 8 arithmetic',zh:'开始初二运算'}},
    {id:'HIGH', course:PC?ms(PC.milestone('HIGH')):firstOf('highmath1'), name:PC&&PC.milestone('HIGH')?PC.milestone('HIGH').name:{ko:'고등 연산 시작',en:'Start of high-school arithmetic',zh:'开始高中运算'}},
    {id:'CAL',  course:firstOf('calculus1'), name:{ko:'미적분 시작',en:'Start of calculus',zh:'开始微积分'}}
  ].filter(m=>m.course!=null);
}
/* 한 과정의 시기 문구 — "초1 5월 시작 → 초1 8월 끝" / 지금 / 지났어요 / (나이 모름) null */
function roadWhenHtml(r){
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  if(!r) return '';
  if(r.past) return `<span class="nm-cr-when past">${lk('지났어요','Already past','已经过了')}</span>`;
  if(r.endSm==null) return '';
  const e=esc(pcAgeLabel(r.endSm));
  if(r.cur) return `<span class="nm-cr-when cur"><span class="t">${lk('지금','Now','现在')}</span> → <span class="t nm-cr-tnum">${e}</span> ${lk('끝','end','结束')}</span>`;
  const s=esc(pcAgeLabel(r.startSm));
  if(s===e) return `<span class="nm-cr-when"><span class="t nm-cr-tnum">${s}</span> · ${lk('한 달 안에 끝나요','done within the month','一个月内完成')}</span>`;
  return `<span class="nm-cr-when"><span class="t nm-cr-tnum">${s}</span> ${lk('시작','start','开始')} → <span class="t nm-cr-tnum">${e}</span> ${lk('끝','end','结束')}</span>`;
}
/* 과정 설명(한 번 눌러 펼침) — 전부 데이터에서 만든다(courses.js 회차 · threads.js 이름 · 유닛 제목 · hero3d).
   무엇을 배우나(교과 연산 스레드) · 독셈 · 문장제·적용 · 마법 개념(3D 그림 표시) · 마치면 할 수 있는 것. */
function courseExplainHtml(c){
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const TH=window.NM_THREADS||{}, H3=window.NM_HERO3D||{};
  const uniq=a=>a.filter((v,i)=>a.indexOf(v)===i);
  const school=[], top={}, creative=[], apply=[];
  (c.sessions||[]).forEach(s=>{
    if(s.test) return;
    (s.school||s.drills||[]).forEach(d=>{ if(d.review) return; school.push(d.t); top[d.t]=Math.max(top[d.t]||0,d.lv||1); });
    ((s.strategy&&s.strategy.practice)||[]).forEach(d=>creative.push(d.t));
    (s.application||[]).forEach(d=>{ if(d.review) return; apply.push(d.kind==='drawing'&&d.title?L(d.title):(TH[d.t]?L(TH[d.t].name):d.t)); });
  });
  const nm=t=>TH[t]?L(TH[t].name):t;
  const schoolIds=uniq(school), creIds=uniq(creative).filter(t=>schoolIds.indexOf(t)<0);
  const units=courseUnitIds(c);
  const li=(h,body)=>body?`<div class="nm-cr-ex-row"><b>${h}</b><span>${body}</span></div>`:'';
  const join=a=>a.map(esc).join(' · ');
  const unitHtml=units.map(u=>`<span class="nm-cr-ex-unit">${esc(L(UNITS[u].title))}${H3[u]?`<i class="nm-cr-ex-3d" title="${lk('3D 그림이 있어요','Has a 3D picture','有3D图')}">3D</i>`:''}</span>`).join('');
  /* 마치면 — 그 과정에서 닿는 가장 높은 레벨의 이름표(threads.js levels.label) */
  const after=schoolIds.map(t=>{
    const th=TH[t]; const lv=th&&(th.levels||[]).find(l=>l.id===top[t]);
    return esc(nm(t))+(lv&&lv.label?` <small>(${esc(L(lv.label))})</small>`:'');
  }).join(' · ');
  const body=li(lk('교과 연산','School arithmetic','教材运算'),join(schoolIds.map(nm)))
    +li(lk('독셈','Doc-T Math','巧算'),join(creIds.map(nm)))
    +li(lk('문장제 · 적용','Word problems · applying','应用题 · 应用'),join(uniq(apply)))
    +(units.length?`<div class="nm-cr-ex-row"><b>${lk('마법 개념','Magic concepts','魔法概念')}</b><span class="nm-cr-ex-units">${unitHtml}</span></div>`:'')
    +(after?`<p class="nm-cr-ex-after">${lk('마치면 스스로 풀 수 있어요','Afterwards you can solve on your own','学完后能独立完成')} — ${after}</p>`:'');
  return body||`<p class="nm-cr-ex-after">${lk('이 과정의 편성은 아직 준비 중이에요.','This course is still being put together.','这个课程还在编排中。')}</p>`;
}
/* 학령개월 → 사람 말. 미취학은 한국 나이 "6세 9월", 취학 뒤는 "초1 11월"(schoolMonthsLabel). */
function pcAgeLabel(sm){
  sm=Math.round(sm);
  const ko=S.lang==='ko', en=S.lang==='en';
  const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  if(sm<0){
    const t=sm+98, a=Math.floor(t/12), m=t%12+1;
    return ko?`${a}세 ${m}월`:en?`Age ${a} · ${MON[m-1]}`:`${a}岁${m}月`;
  }
  if(en){ const g=Math.floor(sm/12)+1, m=((sm%12)+2)%12+1; return `G${g} · ${MON[m-1]}`; }
  return schoolMonthsLabel(sm);
}
function pcTickLabel(sm){
  const ko=S.lang==='ko', en=S.lang==='en';
  if(sm<0){ const a=8+Math.round(sm/12); return ko?`${a}세`:en?`Age ${a}`:`${a}岁`; }
  const g=Math.round(sm/12)+1;
  return g<=6?(ko?'초'+g:en?'G'+g:'小'+g):g<=9?(ko?'중'+(g-6):en?'G'+g:'初'+(g-6)):(ko?'고'+(g-9):en?'G'+g:'高'+(g-9));
}
function paceCompareHtml(){
  const PC=window.NM_PACE_COMPARE;
  if(!PC) return '';
  const T=k=>L(PC.STR[k]);
  const F=(k,v)=>PC.fmt(L(PC.STR[k]),v);
  const ko=S.lang==='ko';
  const head=`<span class="nm-cr-eyebrow">${T('eyebrow')}</span>
    <div class="nm-cr-cad-h big">${T('title')}</div>
    <p class="nm-cr-cadlead">${T('lead')}</p>`;
  const R=paceCompareResult();
  if(!R){
    return `<div class="nm-cr-pc" id="crPaceCmp">${head}
      <div class="nm-pc-needage">${crIc('info')}<span>${T('needAge')}</span>
        <button class="nm-pc-agebtn" id="pcAge">${T('needAgeBtn')}</button></div></div>`;
  }
  const {ctx, ev, sugg, cur}=R;
  const rowOf=k=>ev.rows.find(r=>r.key===k);
  const bName=k=>esc(L(PC.bench(k).name));
  const mo=v=>Math.max(1,Math.round(Math.abs(v)));
  const deltaTxt=r=>{
    if(r.status==='out') return T('outShort');
    if(Math.abs(r.delta)<0.5) return T('even');
    return r.delta<0?F('ahead',{n:mo(r.delta)}):F('behind',{n:mo(r.delta)});
  };
  /* 나이 줄 */
  const ageRow=`<div class="nm-pc-age"><span>${T('ageNow')}</span><b class="nm-cr-tnum">${esc(pcAgeLabel(ctx.smNow))}</b>
    <em>${T('today')}</em><button class="nm-pc-agebtn sm" id="pcAge">${T('change')}</button></div>`;

  /* 판정 + 세 단 사다리 게이지 */
  const vKey=ev.verdict?ev.verdict.key:null;
  const vRank=vKey?PC.bench(vKey).rank:0;
  let verdictHtml;
  if(ev.out){
    verdictHtml=`<div class="nm-pc-verdict out"><b class="nm-pc-vt">${T('outTitle')}</b><p>${T('outBody')}</p></div>`;
  } else {
    const fast=vKey==='p'&&ev.verdict.fastDelta!=null&&ev.verdict.fastDelta<=PC.TOL;
    verdictHtml=`<div class="nm-pc-verdict${vKey?'':' none'}">
      <span class="nm-pc-vpre">${T('verdictPre')}</span>
      ${vKey?`<b class="nm-pc-vt">${ko?`${bName(vKey)} ${T('verdictPost')}`:S.lang==='en'?`${bName(vKey)} ${T('verdictPost')}`:`${bName(vKey)}${T('verdictPost')}`}</b>`
        :`<b class="nm-pc-vt">${T('verdictNone')}</b>`}
      ${fast?`<p class="nm-pc-vsub">${T('verdictFast')}</p>`:''}
      ${vKey==='k'?`<p class="nm-pc-vsub">${T('verdictTop')}</p>`:''}
    </div>`;
  }
  /* 비교 범위 밖(초3 6월 이후)이면 사다리를 그리지 않는다 — "늦어요"를 빨갛게 보여 줄 근거가 없다 */
  const ladder=ev.out?'':`<ol class="nm-pc-ladder" aria-label="${T('eyebrow')}">${['a','p','k'].map(k=>{
    const r=rowOf(k), rank=PC.bench(k).rank;
    const cls=r.status==='out'?'out':rank<=vRank?'on':'off';
    return `<li class="nm-pc-rung ${cls}${k===vKey?' cur':''}" data-bench="${k}">
      <span class="nm-pc-dot" aria-hidden="true">${cls==='on'?crIc('check'):''}</span>
      <b>${bName(k)}</b><small class="nm-cr-tnum">${esc(deltaTxt(r))}</small></li>`;
  }).join('')}</ol>`;

  /* 마일스톤별 타임라인 — x = 나이(학령개월), 네 줄 공통 눈금 */
  const rowsDef=['G6','MID','HIGH'].map(id=>{
    const m=PC.milestone(id);
    const a=PC.bench('a').anchors.find(x=>x.id===id);
    const p=PC.bench('p').anchors.find(x=>x.id===id);
    const pf=(PC.bench('p').fast||[]).find(x=>x.id===id);
    const k=PC.bench('k').anchors.find(x=>x.id===id);
    const passed=ctx.curNum>=m.course;
    const you=passed?null:PC.childSmAt(ctx,m.course);
    return {m,a,p,pf,k,passed,you};
  });
  const vals=[ctx.smNow];
  rowsDef.forEach(r=>{ [r.a,r.p,r.pf,r.k].forEach(x=>{ if(x) vals.push(x.sm); }); if(r.you!=null) vals.push(r.you); });
  const x0=Math.floor((Math.min.apply(null,vals)-2)/12)*12;
  const x1=Math.ceil((Math.max.apply(null,vals)+2)/12)*12;
  const X=v=>((v-x0)/(x1-x0)*100).toFixed(2)+'%';
  const ticks=[]; for(let v=x0; v<=x1; v+=12) ticks.push(v);
  const tickEvery=ticks.length>9?2:1;
  const axis=`<div class="nm-pc-axis" aria-hidden="true">${ticks.map((v,i)=>
    `<span style="left:${X(v)}"${i%tickEvery?' class="minor"':''}>${i%tickEvery?'':esc(pcTickLabel(v))}</span>`).join('')}</div>`;
  const mk=(cls,sm,label)=>`<span class="nm-pc-mk ${cls}" style="left:${X(sm)}" title="${esc(label)} · ${esc(pcAgeLabel(sm))}"></span>`;
  const rowsHtml=rowsDef.map(r=>{
    const facts=[];
    facts.push(r.passed?`<span class="you">${T('you')} <b>${T('passedTxt')}</b></span>`
      :`<span class="you">${T('you')} <b class="nm-cr-tnum">${esc(pcAgeLabel(r.you))}</b></span>`);
    if(r.a) facts.push(`<span class="a">${bName('a')} <b class="nm-cr-tnum">${esc(pcAgeLabel(r.a.sm))}</b>${r.a.beyondGrid?'<sup>†</sup>':''}</span>`);
    if(r.p) facts.push(`<span class="p">${bName('p')} <b class="nm-cr-tnum">${esc(pcAgeLabel(r.p.sm))}</b>${r.pf?` <i class="nm-cr-tnum">(~${esc(pcAgeLabel(r.pf.sm))})</i>`:''}</span>`);
    if(r.k) facts.push(`<span class="k">${bName('k')} <b class="nm-cr-tnum">${esc(pcAgeLabel(r.k.sm))}</b></span>`);
    const band=(r.p&&r.pf)?`<span class="nm-pc-band" style="left:${X(r.pf.sm)};width:calc(${X(r.p.sm)} - ${X(r.pf.sm)})" title="${esc(T('legendBand'))}"></span>`:'';
    return `<li class="nm-pc-row${r.passed?' passed':''}" data-ms="${r.m.id}">
      <div class="nm-pc-rowh"><b>${esc(L(r.m.name))}</b><small>${T('course')} ${r.m.course}</small></div>
      <div class="nm-pc-track">
        <span class="nm-pc-now" style="left:${X(ctx.smNow)}"></span>
        ${band}
        ${r.a?mk('a',r.a.sm,L(PC.bench('a').name)):''}
        ${r.p?mk('p',r.p.sm,L(PC.bench('p').name)):''}
        ${r.k?mk('k',r.k.sm,L(PC.bench('k').name)):''}
        ${r.you!=null?mk('you',r.you,T('you')):''}
      </div>
      <div class="nm-pc-facts">${facts.join('')}</div>
    </li>`;
  }).join('');
  const legend=`<div class="nm-pc-legend">
    <span class="you"><i></i>${T('you')}</span><span class="a"><i></i>${bName('a')}</span>
    <span class="p"><i></i>${bName('p')}</span><span class="k"><i></i>${bName('k')}</span></div>`;
  const timeline=`<div class="nm-pc-tl">
    <div class="nm-cr-cad-h sub">${T('rowsHead')}</div>${legend}
    <ul class="nm-pc-rows">${rowsHtml}</ul>${axis}</div>`;

  /* 상위 레벨이 되려면 */
  let upHtml='';
  if(!ev.out && ev.target){
    const t=ev.target;
    const pName=k=>{ const p=ROAD_PACES.find(x=>x.key===k); return p?L(p.name):k; };
    const optTxt=s=>{
      const parts=[];
      if(s.cad!==cur.cad) parts.push(s.cad==='w2'?T('optCad'):T('optCadBack'));
      if(s.pace!==cur.pace) parts.push(F('optPace',{v:esc(pName(s.pace))}));
      if(s.speed!==cur.speed) parts.push(F('optSpeed',{v:s.speed}));
      return parts.join(' + ');
    };
    upHtml=`<div class="nm-pc-up">
      <div class="nm-cr-cad-h sub">${crIc('steps')}${T('upHead')}</div>
      <p class="nm-pc-need">${F('upNeed',{name:bName(t.key), milestone:esc(L(PC.milestone(t.horizon.id)?PC.milestone(t.horizon.id).name:{ko:'',en:'',zh:''})), n:`<b class="nm-cr-tnum">${mo(t.delta)}</b>`})}</p>
      ${sugg.length?`<ul class="nm-pc-opts">${sugg.map((s,i)=>`<li class="nm-pc-opt">
          <span class="nm-pc-opttxt"><b>${optTxt(s)}</b>${s.saved!=null?`<small class="nm-cr-tnum">${F('saved',{n:mo(s.saved)})}</small>`:''}</span>
          <button class="nm-pc-apply" data-pc-apply="${i}" data-cad="${s.cad}" data-pace="${s.pace}" data-speed="${s.speed}">${T('apply')}</button>
        </li>`).join('')}</ul>
        <p class="nm-pc-fine">${T('amountNote')}</p>`
      :`<p class="nm-pc-fine">${T('upNone')}</p>`}
    </div>`;
  }

  /* 기준표·대응 (접힘) — 숫자가 어디서 왔는지 부모가 직접 볼 수 있게 */
  const srcRows=PC.MILESTONES.map(m=>{
    const cell=k=>{ const a=PC.bench(k).anchors.find(x=>x.id===m.id); return a?esc(pcAgeLabel(a.sm))+(a.beyondGrid?'†':''):'—'; };
    return `<tr><th scope="row">${esc(L(m.name))}</th><td class="nm-cr-tnum">${m.course}</td><td>${cell('a')}</td><td>${cell('p')}</td><td>${cell('k')}</td></tr>`;
  }).join('');
  const srcHtml=`<details class="nm-cr-more nm-pc-src"><summary>${T('srcHead')}</summary>
    <div class="nm-pc-tablewrap"><table class="nm-pc-table"><thead><tr><th>${T('srcMilestone')}</th><th>${T('srcOurs')}</th><th>${bName('a')}</th><th>${bName('p')}</th><th>${bName('k')}</th></tr></thead>
    <tbody>${srcRows}</tbody></table></div>
    <p class="nm-pc-fine">† ${T('beyondGrid')} · ${bName('k')} ${T('course')} 2 = ${esc(pcAgeLabel(PC.bench('k').anchors[0].sm))} (${T('derived')})</p></details>`;

  return `<div class="nm-cr-pc" id="crPaceCmp">${head}${ageRow}${verdictHtml}${ladder}${timeline}${upHtml}
    <ul class="nm-pc-scope"><li>${T('scope1')}</li><li>${T('scope2')}</li><li>${T('scope3')}</li></ul>${srcHtml}</div>`;
}

function middleStudyGuidanceState(){
  const courses=window.NM_COURSES||{},current=courses[currentCourseKey()];
  if(!current)return null;
  const match=/^middle([123])$/.exec(current.tier||''),candidates=[];
  const previous={32:1,35:2,38:3}[current.order];
  if(previous)candidates.push(previous);
  if(match)candidates.push(+match[1]);
  for(const grade of candidates){
    const ids=[...new Set(Object.values(courses).filter(c=>c.tier==='middle'+grade).flatMap(courseUnitIds))];
    const done=ids.filter(id=>stepDone(id,'stamp')).length;
    if(!ids.length||done<Math.ceil(ids.length/2))continue;
    const phase=done===ids.length?'end':'mid';
    if(grade===previous&&phase!=='end')continue;
    const key=grade+':'+phase,choice=S.middleStudyGuidanceChoices?.[key]||null;
    const selected=!!(S.adminPlan?.middleExtensions||S.learningPlan?.middleExtensions)?.[grade];
    if(choice==='continue'&&!selected)continue;
    if(selected&&current.order>({1:31,2:34,3:37}[grade]))continue;
    return {grade,phase,key,choice,selected};
  }
  return null;
}
function renderPersonalPlan(){
  if(S.view!=='courseroad'||!window.NM_LEARNING_PLAN||!window.NM_COURSES)return;
  const body=document.getElementById('crBody');if(!body)return;
  let zone=document.getElementById('nmRoadPlanZone');
  if(!zone){zone=document.createElement('div');zone.id='nmRoadPlanZone';body.querySelector('.nm-cr-view-switch').insertAdjacentElement('afterend',zone);}
  zone.hidden=!document.getElementById('crVisual').hidden;
  let box=document.getElementById('nmPersonalPlan');
  if(!box){box=document.createElement('details');box.id='nmPersonalPlan';box.className='nm-personal-plan';}
  const lk=(ko,en,zh)=>S.lang==='en'?en:S.lang==='zh'?zh:ko;
  const p=S.adminPlan,now=new Date(),today=new Date(+now+9*3600000).toISOString().slice(0,10);
  const settings={...effectiveLearningSettings(),entryYear:S.schoolAge?.entryYear};
  let result;try{result=NM_LEARNING_PLAN.project(NM_COURSES,{...settings,birthYear:S.schoolAge?.birthYear},{months:12,lang:S.lang,now});}catch(e){return;}
  const reference=NM_LEARNING_PLAN.recommend(NM_COURSES,settings,{lang:S.lang});
  let standardBox=document.getElementById('nmStandardPlan');
  if(!standardBox){standardBox=document.createElement('section');standardBox.id='nmStandardPlan';standardBox.className='nm-personal-plan';standardBox.setAttribute('aria-labelledby','nmStandardPlanTitle');}
  zone.append(standardBox,box);
  const standard=NM_LEARNING_PLAN.standard(NM_COURSES,{...settings,birthYear:S.schoolAge?.birthYear},{months:12,lang:S.lang,now});
  const gradeEnds=new Set([0,7,16,25,28,31,34,37,48,57,69,73]);
  const standardEnds=standard.milestones.filter(m=>gradeEnds.has(+m.key.slice(1)));
  const horizonOpen=!!standardBox.querySelector('.nm-plan-horizon')?.open;
  const milestone=m=>`<li><span class="nm-plan-date">${esc(m.date)}<small>${esc(m.schoolLabel)}</small></span><span class="nm-plan-course">${esc(m.title)}<small>${lk('과정','Course','课程')} ${esc(m.key.slice(1))} · ${lk('완료 예상','Estimated finish','预计完成')}</small></span></li>`;
  const first=standardEnds[0],rest=standardEnds.slice(1),from=NM_COURSES[settings.courseKey];
  const middle=/^middle/.test(from.tier),secondary=!!from.studyPlan;
  const scope=middle?lk('중등 기본 약 2.5개월 · 심화 선택 시 총 약 4개월','Middle-school core: about 2.5 months · about 4 months with deeper study','初中基础约2.5个月 · 含进阶合计约4个月'):secondary?lk('고등 연산은 과목마다 기본 약 3개월이에요.','Each high-school arithmetic subject targets about 3 months.','高中运算每科基础约3个月。'):lk('현재 시작점에서 표준 속도로 이어가는 계획이에요.','A standard-pace plan from your current starting point.','从当前起点按标准速度继续的计划。');
  standardBox.innerHTML=`<div class="nm-personal-plan-body"><div class="nm-plan-heading"><span class="nm-cr-eyebrow">${lk('앞으로의 학습','Your learning ahead','接下来的学习')}</span><h3 id="nmStandardPlanTitle">${lk('표준 로드맵','Standard roadmap','标准路线')}</h3></div><p class="nm-plan-origin">${lk('시작점','Starting point','起点')} · ${lk('과정','Course','课程')} ${esc(settings.courseKey.slice(1))} ${esc(L(from.title))}</p>${first?`<ol class="nm-plan-milestones" aria-label="${lk('다음 완료 예상','Next estimated finish','下一预计完成')}">${milestone(first)}</ol>`:''}<p class="nm-plan-scope">${scope}</p>${rest.length?`<details class="nm-plan-horizon"${horizonOpen?' open':''}><summary>${lk('이후 완료 예상일 보기','See later finish dates','查看之后的完成日期')}</summary><ol class="nm-plan-milestones">${rest.map(milestone).join('')}</ol></details>`:''}<p class="nm-plan-note">${lk('실제 학습에 따라 날짜는 달라질 수 있어요. 속도를 바꿔도 완료 기록은 그대로예요.','Dates may change with actual study. Changing pace preserves completed work.','日期随实际学习调整，更改速度不会改变完成记录。')}</p></div>`;
  const guidance=middleStudyGuidanceState();
  if(guidance&&window.NM_MIDDLE_STUDY_GUIDANCE){
    const host=document.createElement('div');host.id='nmMiddleStudyGuidance';standardBox.querySelector('.nm-personal-plan-body h3').insertAdjacentElement('afterend',host);
    NM_MIDDLE_STUDY_GUIDANCE.mount(host,{...guidance,lang:S.lang,onChoice:choice=>{
      S.middleStudyGuidanceChoices=S.middleStudyGuidanceChoices||{};S.middleStudyGuidanceChoices[guidance.key]=choice;save();
    },onContinue:()=>{if(guidance.phase==='end')openCourseSheet('C'+({1:32,2:35,3:38}[guidance.grade]));},
    onApply:()=>openMiddleExtensionSheet(guidance)});
  }
  box.innerHTML=`<summary>${lk('나의 월별 로드맵 · 12개월','My monthly roadmap · 12 months','我的月度路线图 · 12个月')}</summary><div class="nm-personal-plan-body"><p>${p?lk('학원에서 정한 개인별 시작점과 속도를 적용했어요.','Your academy’s individual starting point and pace are applied.','已应用学院设置的个人起点和速度。'):lk('현재 선택한 시작점과 속도로 예상했어요.','Estimated from your selected starting point and pace.','根据所选起点和速度估算。')} ${lk('실제 학습에 따라 달라질 수 있어요. 학년은 매년 3월에 바뀌어요.','Actual progress may vary. Grades change each March.','实际进度可能不同，年级每年3月变更。')}</p><p>${lk('시작','Start','开始')}: ${esc(settings.startDate)} · ${settings.speed}${lk('배 속도','× pace','倍速度')} · ${lk('주','Per week','每周')} ${settings.cadence==='w2'?2:1}${lk('회',' sessions','次')}</p><div class="nm-personal-plan-grid" role="list">${result.rows.map(row=>`<article role="listitem"><h4>${esc(row.month)} <small>${esc(row.schoolLabel)}</small></h4>${row.courseLabels.length?row.courseLabels.map((label,i)=>`<p><b>${esc(label)}</b><span>${esc(row.sessionLabels[i])}</span></p>`).join(''):`<p>${lk('예상 과정 없음','No course projected','暂无预计课程')}</p>`}</article>`).join('')}</div>${+settings.courseKey.slice(1)<29?`<aside><h4>${esc(reference.title)}</h4><p>${esc(reference.advice)}</p><p>${esc(reference.reference)}</p>${reference.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a>`).join(' · ')}</aside>`:""}</div>`;
}
function screenCourseRoad(){
  highWeeklySchedule(currentCourseKey());
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;

  if(!window.NM_COURSES||!window.NM_THREADS){
    scr.innerHTML=`<div class="nm-unit-bar"><button class="nm-back" id="crBack">← ${navigationLabel('town')}</button>
      <div class="nm-unit-title">🛤️ ${lk('연산 로드맵','Course Road','运算路线图')}</div></div>
      <div class="nm-step-body"><div class="nm-card">${lk('과정 자료를 아직 불러오지 못했어요.','Course data is not ready yet.','课程数据还没准备好。')}</div></div>`;
    $('#crBack').onclick=()=>{S.view='town';save();render();};
    return;
  }

  const curKey=currentCourseKey();
  const fromAssessment=!!roadAssessmentReturn&&roadAssessmentReturn===S._diag&&S._diag.phase==='result';
  const list=roadCourseList();
  const lastNum=list.length?list[list.length-1].num:0;
  const curNum=Number(String(curKey).replace(/^C/,''));
  /* 진단으로 정한 시작점과 실제 학습 기록은 다른 사실이라 지도에서 분리한다. */
  const touchedUid=mostRecentTouchedUnit();
  const learnedCourseKey=touchedUid?courseForUnit(touchedUid):null;
  const learnedCourseNum=learnedCourseKey?Number(String(learnedCourseKey).replace(/^C/,'')):null;
  const recommendationKey=S.placement&&S.placement.course&&(window.NM_COURSES||{})[S.placement.course]?S.placement.course:null;
  const recommendationNum=recommendationKey?Number(String(recommendationKey).replace(/^C/,'')):null;
  const recommendationLabel=S.placement&&S.placement.self
    ? lk('내가 고른 시작점','My chosen start','我选择的起点')
    : lk('진단 추천 시작점','Assessment starting point','测评推荐起点');
  const allStages=window.NM_STAGES||[];
  const mapGroups=[
    {key:'first', title:{ko:'수의 출발',en:'First numbers',zh:'数字起点'}, stages:['numberland','sprout'], x:13,y:75,
      guide:{image:'numi-0-happy.png',name:{ko:'누미',en:'Numi',zh:'努米'},say:{
        ko:'먼저 수를 세고 10을 만들어요. 덧셈·뺄셈을 지나 구구단과 나눗셈도 만나요!',
        en:'Count, make 10, then learn addition, subtraction, times tables, and division!',
        zh:'先数数、凑十，再学加减、乘法口诀和除法！'}}},
    {key:'arithmetic', title:{ko:'계산의 성장',en:'Growing calculation',zh:'计算进阶'}, stages:['leap','mastery'], x:32,y:54,
      guide:{image:'poco-3-happy.png',name:{ko:'포코',en:'Poco',zh:'波可'},say:{
        ko:'큰 수를 곱하고 나누어요. 분수·소수·비율까지 계산을 넓혀 볼까요?',
        en:'Multiply and divide bigger numbers, then explore fractions, decimals, and ratios!',
        zh:'学习大数乘除，再探索分数、小数和比率！'}}},
    {key:'challenge', title:{ko:'경시의 탑',en:'Tower of Challenge',zh:'竞赛之塔'}, stages:['tower'], x:51,y:38,
      guide:{image:'momo-8-happy.png',name:{ko:'모모',en:'Momo',zh:'莫莫'},say:{
        ko:'수의 숨은 규칙을 찾으면 계산이 짧아져요. 곱셈·진법·제곱에 도전해요!',
        en:'Find number patterns to shorten calculations. Try multiplication, number bases, and squares!',
        zh:'找到数字规律，计算就更简便。来挑战乘法、进位制和平方！'}}},
    {key:'middle', title:{ko:'중학교',en:'Middle school',zh:'初中'}, stages:['middle'], x:70,y:28,
      guide:{image:'sym-sqrt.png',name:{ko:'루트',en:'Root',zh:'根号'},say:{
        ko:'음수와 x를 만나 수의 관계를 식과 그래프로 나타내요. 제곱근도 탐험해요!',
        en:'Meet negative numbers and x, show connections with equations and graphs, and explore square roots!',
        zh:'认识负数和 x，用方程与图像表示关系，再探索平方根！'}}},
    {key:'high', title:{ko:'고등 수학',en:'High school maths',zh:'高中数学'}, stages:['common1','common2','algebra','calculus1'], x:89,y:16,
      guide:{image:'sym-infinity.png',name:{ko:'무한',en:'Infinity',zh:'无穷大'},say:{
        ko:'다항식·좌표·로그와 수열을 배우고, 변화율과 넓이까지 살펴봐요!',
        en:'Explore polynomials, coordinates, logs, and sequences, then rates of change and area!',
        zh:'学习多项式、坐标、对数与数列，再研究变化率和面积！'}}}
  ].map(g=>({...g, entries:g.stages.map(k=>allStages.find(s=>s.key===k)).filter(Boolean)}))
    .filter(g=>g.entries.length);
  const mapGroupFor=n=>n==null?null:mapGroups.find(g=>g.entries.some(s=>n>=s.courses.from&&n<=s.courses.to));
  const mapRange=g=>`${lk('과정','Courses','课程')} ${g.entries[0].courses.from}~${g.entries[g.entries.length-1].courses.to}`;
  let selectedMapGroup=(mapGroupFor(S.learningPlan?curNum:null)||mapGroupFor(learnedCourseNum)||mapGroupFor(recommendationNum)||mapGroups[0]||{}).key;
  let roadView=S._roadFocus?'road':S.roadView;
  const mapButtons=mapGroups.map((g,i)=>{
    const learned=g===mapGroupFor(learnedCourseNum), recommended=g===mapGroupFor(recommendationNum);
    const status=(learned?lk('실제 학습 위치','studied location','实际学习位置')+' ':'')+(recommended?recommendationLabel:'');
    return `<button class="nm-vmap-stop${g.key===selectedMapGroup?' is-selected':''}${learned?' is-learning':''}${recommended?' is-recommendation':''}" type="button" data-map-group="${g.key}" style="left:${g.x}%;top:${g.y}%" aria-pressed="${g.key===selectedMapGroup}" aria-label="${esc(L(g.title))}, ${mapRange(g)}${status?', '+esc(status):''}">
      <span class="nm-vmap-stop-top"><i>${i+1}</i><b>${esc(L(g.title))}</b></span><small>${mapRange(g)}</small>
      ${learned?`<em class="learning">${lk('학습 위치','Studied','已学习')}</em>`:''}
      ${recommended?`<em class="recommendation">${recommendationLabel}</em>`:''}
    </button><button class="nm-vmap-character${g.key===selectedMapGroup?' is-selected':''}" type="button" data-map-group="${g.key}" style="left:${g.x}%;top:${g.y}%" aria-pressed="${g.key===selectedMapGroup}" aria-label="${esc(L(g.guide.name))}: ${esc(L(g.title))} ${lk('과정 설명 보기','course explanation','课程说明')}">
      <img src="assets/characters/${g.guide.image}" width="80" height="80" alt="" loading="lazy" decoding="async"><span>${lk('설명 보기','See explanation','查看介绍')}</span>
    </button>`;
  }).join('');

  /* 2026-09-26 원장 "로드맵도 이제 이런 느낌으로" — 머리에 3D 길 지도(app/road3d)를 얹고, 아래 목록은
     모드 선택 3D 책상과 같은 재질(나무 책상 · 종이 카드 · 가죽+금박 · 놋쇠 꼬리표)로 입힌다.
     헤더는 한 줄(뒤로 · 제목 · 진단하기 · 🎯)만 고정하고, 학생 칩·안내·철학은 스크롤 안으로 옮겼다
     — 폰에서 고정 머리가 화면의 3분의 1을 먹던 것을 풀어 3D 지도와 목록이 자리를 얻게. */
  scr.innerHTML=`<div class="nm-cr-wrap nm-cr-desk">
    <div class="nm-cr-header">
      <div class="nm-cr-titlerow">
        <button class="nm-back" id="crBack">← ${fromAssessment?lk('진단 결과로','Back to assessment result','返回测评结果'):navigationLabel('town')}</button>
        <div class="nm-cr-title"><span class="nm-cr-title-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 20.5c0-4.6 9.5-3.2 9.5-7.6 0-3.6-6.2-3.2-6.2-6.6" stroke-dasharray="2.4 2.2"/><circle cx="5.5" cy="20" r="1.4" fill="currentColor" stroke="none"/><path d="M15.6 3.2v8M15.6 3.6h4.6l-1.5 2 1.5 2h-4.6"/></svg></span><span class="nm-cr-title-t">${lk('연산 로드맵','Course Road','运算路线图')}</span></div>
        <button class="nm-cr-diagbtn" id="crDiag">${crIc('compass')}<span>${lk('진단하기','Level Check','水平测评')}</span></button>
        <button class="nm-cr-pickbtn" id="crPick">${crIc('target')}<span>${lk('진도·속도 조절','Progress & pace','进度与速度')}</span></button>
      </div>
    </div>
    <div class="nm-cr-body" id="crBody">
      <div class="nm-cr-view-switch" role="group" aria-label="${lk('로드맵 보기 방식','Roadmap view','路线图视图')}">
        <button id="crViewRoad" type="button" aria-pressed="${roadView==='road'}">${crIc('steps')}${lk('길 로드맵','Course road','课程道路')}</button>
        <button id="crViewMap" type="button" aria-pressed="${roadView==='map'}" ${mapGroups.length?'':'disabled'}>${crIc('compass')}${lk('그림 지도','Illustrated map','图画地图')}</button>
        <button class="nm-cr-locate" id="crCurrent" type="button" title="${lk('내 과정으로 이동','Go to my course','前往我的课程')}" aria-label="${lk('내 과정으로 이동','Go to my course','前往我的课程')}">${crIc('target')}</button>
      </div>
      <div class="nm-cr-hero" id="crHero"></div>
      <section class="nm-vmap" id="crVisual" aria-labelledby="crVisualTitle" hidden>
        <div class="nm-vmap-head">
          <span class="nm-cr-eyebrow">${lk('한눈에 보는 성장 단계','The stages at a glance','成长阶段一览')}</span>
          <h2 id="crVisualTitle">${lk('그림으로 보는 연산 지도','Illustrated arithmetic map','图画运算地图')}</h2>
          <p>${lk('표지판 아래 캐릭터가 과정들을 소개해요. 자세한 과정은 길 로드맵에서 살펴보세요.',
                   'The guides below the signs introduce each group of courses. Explore the details on the course road.',
                   '路标下的角色会介绍各组课程。具体课程可在课程道路中查看。')}</p>
        </div>
        <nav class="nm-vmap-jumps" aria-label="${lk('지도 단계 바로가기','Map stage shortcuts','地图阶段快捷入口')}">
          ${mapGroups.map((g,i)=>`<button type="button" data-map-group="${g.key}" aria-pressed="${g.key===selectedMapGroup}"><span>${i+1}</span>${esc(L(g.title))}</button>`).join('')}
        </nav>
        <div class="nm-vmap-legend" aria-label="${lk('지도 표식 설명','Map marker legend','地图标记说明')}">
          ${learnedCourseNum!=null?`<span class="nm-vmap-legend-item learning"><i aria-hidden="true"></i>${lk('실제 학습 위치','Studied location','实际学习位置')}</span>`:''}
          ${recommendationNum!=null?`<span class="nm-vmap-legend-item recommendation"><i aria-hidden="true"></i>${recommendationLabel}</span>`:''}
          ${learnedCourseNum==null&&recommendationNum==null?`<span class="nm-vmap-legend-note">${lk('학습 기록이나 시작점을 정하면 지도에 표시돼요.','Your studied location or chosen start appears here when available.','有学习记录或选定起点后会显示在地图上。')}</span>`:''}
        </div>
        <div class="nm-vmap-scroll" id="crMapScroll" role="region" tabindex="0" aria-label="${lk('연산 단계 그림 지도, 좌우로 이동할 수 있음','Illustrated arithmetic map, horizontally scrollable','运算阶段图画地图，可左右滚动')}">
          <div class="nm-vmap-canvas">
            <img class="nm-vmap-art" src="assets/growth-map-20261017.webp" width="1672" height="941" alt="" decoding="async">
            ${mapButtons}
          </div>
        </div>
        <p class="nm-vmap-scrollhint">${lk('지도는 좌우로 움직일 수 있어요. 표지판이나 캐릭터를 누르면 아래에 설명과 단계가 나와요.',
          'Scroll the map sideways. Choose a sign or guide to see the explanation and stages below.',
          '地图可左右滚动。点击路标或角色，下方会显示介绍与阶段。')}</p>
        <div class="nm-vmap-detail" id="crMapDetail" tabindex="-1"></div>
        <span class="nm-vmap-live" id="crMapLive" aria-live="polite" aria-atomic="true"></span>
      </section>
      <div class="nm-cr-intro">
      <!-- 누구의 로드맵인지 (2026-09-16 원장 "선택한 학생의 연산 로드맵이 나와야지").
           한 기기를 형제가 같이 쓰므로 슬롯 3개가 이미 있는데, 로드맵에는 누구 것인지
           표시가 없어 남의 진도를 자기 것으로 읽을 수 있었다. 칩을 누르면 바로 바꾼다. -->
      <button class="nm-cr-who" id="crWho">
        <span class="nm-cr-who-fig">${window.renderPartyHtml?window.renderPartyHtml(avatarProfile(),S.character,34):''}</span>
        <span class="nm-cr-who-txt"><small>${lk('이 학생의 로드맵','Roadmap for','此学生的路线图')}</small><b>${S.name?esc(S.name):'#'+S.character.number}${schoolNowLabel()?` <em class="nm-cr-who-gr">${esc(schoolNowLabel())}</em>`:''}</b></span>
        <span class="nm-cr-who-sw">${lk('바꾸기','Switch','切换')}</span>
      </button>
      <div class="nm-cr-sub"><span class="nm-cr-eyebrow">${lk('나의 연산 로드맵','My arithmetic roadmap','我的运算路线图')}</span>
        <span class="nm-cr-lead">${lk('어디까지 왔고 다음에 무엇을 배우는지 살펴봐요.','See where you are and what you will learn next.','看看现在学到哪里，接下来学习什么。')}</span></div>
      <!-- 정복의 뜻은 about.html의 철학과 같은 것이어야 한다("수를 정복하기 위한
           DOCSSAM의 철학" · "어려운 수를 내가 다루기 쉬운 수로 펼쳐서"). 로드맵이
           따로 노는 은유를 만들지 않도록 그 문장을 여기서 다시 말하고 원문으로 잇는다. -->
      <div class="nm-cr-philo">
        <span>${lk('수를 정복한다는 건 빨리 푸는 게 아니라, 어려운 수를 <b>내가 다루기 쉽게 펼칠</b> 수 있게 되는 거예요.',
             'Conquering numbers isn\'t about speed — it\'s being able to <b>unfold</b> a hard number into ones you handle easily.',
             '征服数字不是算得快，而是能把难的数<b>展开</b>成自己好处理的数。')}</span>
        <a class="nm-philobtn nm-cr-philolink" href="about.html">${lk('철학 읽기','Our philosophy','阅读理念')}${crIc('arrow')}</a>
      </div>
      </div>
      <div id="crList"></div>
    </div>
  </div>`;
  $('#crBack').onclick=()=>{S._roadFocus=null;S.view=fromAssessment?'placement':'town';roadAssessmentReturn=null;save();render();};
  $('#crDiag').onclick=()=>startPlacement();
  $('#crPick').onclick=()=>openLearningPlanSheet();
  $('#crWho').onclick=()=>openStudentSwitch();

  const body=$('#crBody');
  const listEl=$('#crList');
  const heroEl=$('#crHero');
  const visualEl=$('#crVisual');
  const mapDetailEl=$('#crMapDetail');
  const mapScrollEl=$('#crMapScroll');
  /* 3D 지도가 처음 비출 과정 — draw(false)가 S._roadFocus 를 지우기 전에 잡아 둔다 */
  const heroFocus=S._roadFocus||null;
  const hero3dLikely=!!heroEl && road3dLikely();
  const openEx={};          /* 펼친 과정 설명(다시 그려도 유지) */
  let road3dCtl=null;       /* 3D 지도 — 설정이 바뀌면 시작 달 이름표를 다시 쓴다 */
  let road3dStarted=false;
  function syncRoad3dTimes(){ if(road3dCtl&&road3dCtl.setTimes) road3dCtl.setTimes(roadStartLabels()); }

  function drawMapDetail(){
    const g=mapGroups.find(x=>x.key===selectedMapGroup);
    if(!g||!mapDetailEl)return;
    mapDetailEl.innerHTML=`<div class="nm-vmap-detail-head">
      <span class="nm-cr-eyebrow">${lk('선택한 지도 지점','Selected map stop','选中的地图地点')} · ${mapRange(g)}</span>
      <h3>${esc(L(g.title))}</h3>
      <p>${lk('단계를 누르면 길 로드맵의 해당 과정으로 이동해요.',
               'Choose a stage to find its course on the course road.',
               '选择阶段后，将前往课程道路中的对应课程。')}</p>
    </div><div class="nm-vmap-talk">
      <img src="assets/characters/${g.guide.image}" width="80" height="80" alt="" aria-hidden="true" loading="lazy" decoding="async">
      <div class="nm-vmap-talk-bubble">
        <b>${esc(L(g.guide.name))}${lk('의 설명',"'s explanation",'的介绍')}</b>
        <p>${esc(L(g.guide.say))}</p>
      </div>
    </div><div class="nm-vmap-stages">${g.entries.map(s=>{
      const learned=learnedCourseNum!=null&&learnedCourseNum>=s.courses.from&&learnedCourseNum<=s.courses.to;
      const recommended=recommendationNum!=null&&recommendationNum>=s.courses.from&&recommendationNum<=s.courses.to;
      const range=`${lk('과정','Courses','课程')} ${s.courses.from}${s.courses.from===s.courses.to?'':'~'+s.courses.to}`;
      const status=(learned?lk('실제 학습 위치','studied location','实际学习位置')+' ':'')+(recommended?recommendationLabel:'');
      return `<button class="nm-vmap-stage${learned?' is-learning':''}${recommended?' is-recommendation':''}" type="button" data-map-stage="${s.key}" aria-label="${esc(L(s.name))}, ${range}${status?', '+esc(status):''}, ${lk('길 로드맵에서 보기','view on course road','在课程道路中查看')}">
        <span class="nm-vmap-stage-heading"><b>${esc(L(s.name))}</b>${learned?`<em class="learning">${lk('학습 위치','Studied','已学习')}</em>`:''}${recommended?`<em class="recommendation">${recommendationLabel}</em>`:''}</span>
        <span class="nm-vmap-stage-meta">${range} · ${esc(L(s.band))}${s.status==='partial'?` · ${lk('일부 준비 중','Some lessons in preparation','部分内容准备中')}`:''}</span>
        <span class="nm-vmap-stage-learn">${esc(L(s.learn))}</span>
        <span class="nm-vmap-stage-go">${lk('길에서 보기','View on road','在道路中查看')} ${crIc('arrow')}</span>
      </button>`;
    }).join('')}</div>`;
    mapDetailEl.querySelectorAll('[data-map-stage]').forEach(el=>{
      el.onclick=()=>{
        const stage=g.entries.find(s=>s.key===el.dataset.mapStage);
        if(!stage)return;
        const anchorNum=learnedCourseNum||recommendationNum||curNum;
        const targetNum=anchorNum>=stage.courses.from&&anchorNum<=stage.courses.to?anchorNum:stage.courses.from;
        setRoadView('road',true);
        const node=listEl.querySelector(`.nm-cr-node[data-c="C${targetNum}"]`);
        if(node)roadFlashRow(node,body);
      };
    });
    visualEl.querySelectorAll('[data-map-group]').forEach(el=>{
      const on=el.dataset.mapGroup===selectedMapGroup;
      el.classList.toggle('is-selected',on);
      el.setAttribute('aria-pressed',String(on));
    });
  }
  function centerMapStop(){
    if(!mapScrollEl||visualEl.hidden)return;
    const stop=visualEl.querySelector(`.nm-vmap-stop[data-map-group="${selectedMapGroup}"]`);
    if(stop)mapScrollEl.scrollLeft=Math.max(0,stop.offsetLeft+stop.offsetWidth/2-mapScrollEl.clientWidth/2);
  }
  function startRoadHero(){
    if(!heroEl||!heroEl.isConnected||!hero3dLikely||road3dStarted)return;
    road3dStarted=true;
    mountRoad3DInto(heroEl,{curKey,focus:heroFocus,listEl,body,onCtl:ctl=>{ road3dCtl=ctl; }});
  }
  function setRoadView(mode,persist){
    roadView=mode==='map'&&mapGroups.length?'map':'road';
    if(persist){S.roadView=roadView;save();}
    const isMap=roadView==='map';
    visualEl.hidden=!isMap;
    if(heroEl&&heroEl.isConnected)heroEl.hidden=isMap;
    listEl.hidden=isMap;
    const plans=$('#nmRoadPlanZone');if(plans)plans.hidden=isMap;
    $('#crViewRoad').setAttribute('aria-pressed',String(!isMap));
    $('#crViewMap').setAttribute('aria-pressed',String(isMap));
    if(!isMap)startRoadHero();
    if(persist||isMap)body.scrollTop=0;
    if(isMap)requestAnimationFrame(centerMapStop);
  }
  $('#crViewRoad').onclick=()=>setRoadView('road',true);
  $('#crViewMap').onclick=()=>setRoadView('map',true);
  $('#crCurrent').onclick=()=>{
    setRoadView('road',true);
    const node=listEl.querySelector(`.nm-cr-node[data-c="${curKey}"]`);
    if(node){roadFlashRow(node,body);node.focus({preventScroll:true});}
  };
  visualEl.querySelectorAll('[data-map-group]').forEach(el=>{
    el.onclick=ev=>{
      selectedMapGroup=el.dataset.mapGroup;
      drawMapDetail();
      centerMapStop();
      const guide=mapGroups.find(g=>g.key===selectedMapGroup).guide;
      $('#crMapLive').textContent=`${L(guide.name)}: ${L(guide.say)}`;
      body.scrollTo({top:body.scrollTop+mapDetailEl.getBoundingClientRect().top-body.getBoundingClientRect().top-56,behavior:window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
      if(ev.detail===0)mapDetailEl.focus({preventScroll:true});
    };
  });
  drawMapDetail();

  function draw(keepScroll){
    const cad=S.roadCadence;
    const pace=roadPaceDef(S.roadPace).key;
    const speed=S.roadSpeed||1;
    const mult=roadPaceMult(pace)/speed;
    const opTotals=roadTotals(0,ROAD_OP_LAST,cad,mult);
    const allTotals=roadTotals(0,lastNum,cad,mult);
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
    const middleGrade=/^middle([123])$/.exec(curC?.tier||'')?.[1];
    const extensionGuide=middleStudyGuidanceState()||(middleGrade?{grade:+middleGrade,phase:'mid',key:middleGrade+':mid'}:null);
    const fresh=!mostRecentTouchedUnit()&&!S.learningPlan&&!S.placement?.course;
    const extensionAt=S.learningPlan&&!S.adminPlan?NM_PLAN_CONTROL.position(NM_COURSES,S.learningPlan,weekKeyFor(new Date()))?.extensionAnchor:null;
    const courseLine=(key,c)=>extensionAt&&key===curKey
      ?`${esc(L(NM_MIDDLE_EXTENSION.course(extensionAt.grade).title))} · ${extensionAt.index+1}/12${lk('묶음',' bundles','组')}`
      :`${lk('과정','Course','课程')} ${String(key).replace(/^C/,'')} · ${esc(L(c.title))}`;

    let html=`<div class="nm-cr-conq">
      <div class="nm-cr-conq-top">
        <span class="nm-cr-conq-hd"><span class="nm-cr-eyebrow">${lk('정복 현황','Progress','征服进度')}</span>
          <span class="nm-cr-conq-lbl">${lk('정복한 과정','Courses conquered','已征服课程')}</span></span>
        <span class="nm-cr-conq-num"><b>${conq.done}</b><i>/ ${conq.total}</i></span>
      </div>
      <div class="nm-cr-bar"><span style="width:${conq.pct}%"></span></div>
      <div class="nm-cr-conq-sub">${lk('계산의 새싹부터 경시의 탑까지','From the first sprouts to the Tower of Challenge','从计算的新芽到竞赛之塔')} · ${lk('과정','Course','课程')} 1~${conqLast}</div>
      ${fresh
        ? `<div class="nm-cr-conq-line start">${crIc('flag')}<span>${lk('과정 1에서 출발해요.','Starting at course 1.','从课程1出发。')}</span></div>`
        : `<div class="nm-cr-conq-line now">${crIc('pin')}<span><em>${lk('지금 여기','You are here','当前位置')}</em>${curC?courseLine(curKey,curC):''}</span></div>
           ${goalC?`<div class="nm-cr-conq-line goal">${crIc('flag')}<span><em>${lk('다음 목표','Next goal','下一个目标')}</em>${courseLine(goalKey,goalC)}</span></div>`:''}`}
      <div class="nm-cr-conq-all"><span>${lk('전체 길','Whole path','整条路')}</span><b>${conqAll.done} / ${conqAll.total}</b></div>
    </div>`;

    /* ── 주차 보기 전환 + 합계 (부가 정보 — 주인공 자리가 아니다) ── */
    const speedName=({0.7:lk('1 · 천천히','1 · Slow','1 · 慢速'),0.85:lk('2 · 여유 있게','2 · Steady','2 · 从容'),1:lk('3 · 표준','3 · Standard','3 · 标准'),1.25:lk('4 · 빠르게','4 · Fast','4 · 快速'),1.5:lk('5 · 더 빠르게','5 · Faster','5 · 更快')})[speed];
    html+=`<section class="nm-cr-cad nm-cr-plan-control" id="crPace" aria-labelledby="crPlanControlTitle">
      <span class="nm-cr-eyebrow">${lk('나의 학습 계획','My learning plan','我的学习计划')}</span>
      <h3 id="crPlanControlTitle">${lk('진도와 속도를 맞춰요','Adjust progress and pace','调整进度与速度')}</h3>
      <p>${curC?courseLine(curKey,curC):''}</p>
      <div class="nm-plan-current"><b>${speedName}</b><span>${speed}${lk('배','×','倍')} · ${lk('주','Weekly','每周')} ${cad==='w2'?2:1}${lk('묶음',' bundles','组')}</span></div>
      <p class="nm-plan-help">${S.adminPlan?lk('학원에서 정한 개인별 계획을 적용하고 있어요.','Your academy’s individual plan is applied.','已应用学院设置的个人计划。'):lk('이전·다음 과정이나 시작할 회차를 고르고, 속도를 5단계로 조절해요.','Choose an earlier or later course and starting lesson, then set one of five pace levels.','选择之前或之后的课程及起始课次，再调整五档速度。')}</p>
      <button type="button" class="nm-btn full" id="crAdjust">${lk('진도·속도 조절','Progress & pace','进度与速度')}</button>
      ${extensionGuide?`<button type="button" class="nm-btn full ghost" id="crExtension">${lk('중'+extensionGuide.grade+' 선택 심화 계획','Grade '+(extensionGuide.grade+6)+' optional deeper-study plan','初'+extensionGuide.grade+'可选进阶计划')}</button>`:''}
      <details class="nm-plan-extra nm-plan-references"><summary>${lk('기준과 전체 기간 보기','Reference & whole-path estimates','参考标准与全程时间')}</summary>
      <div class="nm-cr-step nm-cr-pace">
        <div class="nm-cr-cad-h">${lk('유아·초등 계획 기준','Preschool & elementary reference','学前与小学参考标准')}</div>
        <div class="nm-cr-pacegrid" role="group" aria-label="${lk('유아·초등 계획 기준','Preschool & elementary reference','学前与小学参考标准')}">
          ${ROAD_PACES.map(p=>{
            const mo=roadTotals(0,ROAD_OP_LAST,cad,roadPaceMult(p.key)/speed).months;
            return `<button class="nm-cr-pacebtn${p.key===pace?' on':''}" data-pace="${p.key}" aria-pressed="${p.key===pace?'true':'false'}">
              <b>${esc(L(p.name))}</b><small>${lk('약','about','约')} <span class="nm-cr-tnum">${mo}</span>${lk('개월','mo','个月')}</small></button>`;
          }).join('')}
        </div>
        <p class="nm-cr-pacenote">${lk('길은 같고 걷는 빠르기만 달라요. 언제든 바꿀 수 있어요.',
             'Same road, only the walking speed changes. Switch any time.',
             '路是同一条，只是走的速度不同。随时可以切换。')}</p>
      </div>
      <div class="nm-cr-step nm-cr-est">
        <div class="nm-cr-cad-h sub">${lk('이 빠르기로 걸리는 시간','How long that takes','按这个速度需要多久')}</div>
        <div class="nm-cr-totals">
          <div class="nm-cr-total">
            <b>${lk('연산 구간','Arithmetic stretch','运算区间')} <small>${lk('과정','Course','课程')} 1~${ROAD_OP_LAST}</small></b>
            <span><em class="nm-cr-tnum">${opTotals.weeks}</em>${lk('주','wk','周')} <i>·</i> ${lk('약','about','约')} <em class="nm-cr-tnum">${opTotals.months}</em>${lk('개월','mo','个月')}</span>
          </div>
          <div class="nm-cr-total">
            <b>${lk('전체 길','Whole path','整条路')} <small>${lk('과정','Course','课程')} 1~${lastNum}</small></b>
            <span><em class="nm-cr-tnum">${allTotals.weeks}</em>${lk('주','wk','周')} <i>·</i> ${lk('약','about','约')} <em class="nm-cr-tnum">${allTotals.months}</em>${lk('개월','mo','个月')}</span>
          </div>
        </div>
        <div class="nm-cr-built">${builtCount===list.length
          ? `${crIc('check')}<span>${lk(`과정 ${list.length}개 모두 배울 내용이 준비돼 있어요.`,`All ${list.length} courses have their content ready.`,`全部${list.length}个课程的内容都已备妥。`)}</span>`
          : `${crIc('pack')}<span>${lk(`과정 ${list.length}개 중 ${builtCount}개가 준비됐어요.`,`${builtCount} of ${list.length} courses are ready.`,`${list.length}个课程中已备妥${builtCount}个。`)}</span>`}</div>
        <p class="nm-cr-cadfoot">${lk('4주를 한 달로 셌어요.','Counted as 4 weeks per month.','按4周为一个月计算。')}
          ${lk('권장 학습 시간은 한 회 40~50분','Recommended study time: 40–50 minutes a class','建议学习时间：每次40~50分钟')}
          — ${cad==='w2'
            ? lk('주 2회면 한 주에 80~100분이에요.','about 80–100 minutes a week.','每周约80~100分钟。')
            : lk('주 1회면 한 주에 40~50분이에요.','about 40–50 minutes a week.','每周约40~50分钟。')}</p>
      </div>
      </details>
    </section>`;
    /* 속도 비교 진단 — 위에서 고른 빠르기 그대로 세 기준과 견준다(2026-09-26) */
    html+=paceCompareHtml();

    if(S.placement&&S.placement.course){
      const pc=(window.NM_COURSES||{})[S.placement.course];
      const pnum=String(S.placement.course).replace(/^C/,'');
      if(pc){
        const weak=S.placement.weak||[];
        const bookSelection=S.placement.selection||{},books=window.NM_PLACEMENT_BOOKS;
        // Old results have one recorded book; only an explicit completed status
        // confirms it. A school-route result must never show stale book fields.
        const multipleBooks=Array.isArray(bookSelection.completedBooks);
        const savedBooks=bookSelection.route==='book'&&books
          ?(multipleBooks?bookSelection.completedBooks.slice(0,8):[bookSelection]):[];
        const recordedBooks=savedBooks.map(item=>{
          if(!item||typeof item!=='object')return null;
          const series=books.series.find(x=>x.id===item.series);
          if(!series)return null;
          const editions=typeof books.getEditions==='function'?books.getEditions(item.series):[];
          const edition=editions.find(x=>x.id===item.editionId);
          if(item.editionId&&!edition)return null;
          const step=books.getSteps(item.series,item.editionId||undefined).find(x=>x.id===item.step);
          if(!step)return null;
          const courses=books.getBookCourses(item.series,step.id);
          const course=courses.includes(item.bookCourseNumber)?item.bookCourseNumber:null;
          if(courses.length&&!course)return null;
          const text=[L(series.label),edition&&item.editionId?L(edition.label):'',L(step.label),
            course?lk('교재 과정','book course','教材课程')+' '+course:''].filter(Boolean).map(esc).join(' · ');
          return {text,completed:item.bookStatus==='completed'};
        }).filter(row=>row&&(!multipleBooks||row.completed));
        const label=S.placement.self
          ? `${crIc('target')}<b>${lk('내가 고른 시작점','My chosen start','我选的起点')}</b>`
          : `${crIc('compass')}<b>${lk('진단 추천','Check-up suggests','测评建议')}</b>`;
        let suffix='';
        if(!S.placement.self && weak.length){
          const names=weak.slice(0,3).map(tid=>{
            const th=(window.NM_THREADS||{})[tid];
            return th?esc(L(th.name)):esc(tid);
          });
          suffix=` · ${lk('연습 필요','needs practice','需要练习')} ${weak.length}: ${names.join(', ')}`;
        }
        html+=`<div class="nm-cr-diagchip">${label}<span>${lk('수의 마법 과정','App course','本应用课程')} ${pnum} · ${esc(L(pc.title))}${suffix}</span></div>`;
        const gp=S.placement.pathRecommendation;
        if(gp&&gp.version==='goal-path-v1'){
          const support=(gp.support||[]), wrong=support.filter(x=>x.kind==='practice').length, recheck=support.filter(x=>x.kind==='recheck').length;
          html+=`<section class="pd-road-goal" aria-label="${lk('진단 목표와 학습 경로','Assessment goal and study path','测评目标与学习路径')}">
            <h3>${esc(L(gp.goal.label))}</h3>${gp.target?`<p>${esc(L(gp.target.label))} · ${lk('목표 대응 확인 필요','Target mapping needs verification','目标对应需要确认')}</p>`:''}
            ${recordedBooks.map((book,index)=>`<p>${book.completed
              ?(multipleBooks?lk('완료한 교재','Completed book','已完成的教材')+' '+(index+1):lk('마지막으로 완료한 교재','Last completed book','最后完成的教材'))
              :lk('기록된 교재 · 완료 여부 미확인','Recorded book · completion unconfirmed','记录的教材 · 完成情况未确认')}: ${book.text}</p>`).join('')}
            ${recordedBooks.length?`<p class="pd-note">${lk('진단 범위는 별도로 선택한 수의 마법 내용입니다.','The diagnostic scope was selected separately in Numbers of Magic.','测评范围是另行选择的数之魔法内容。')}</p>`:''}
            <p>${lk('진단 때 선택한 본진도','Main study selected for this check','测评时选择的主要进度')}: ${esc(L(gp.main.label))}</p>
            <p>${lk('보강 후보','Practice candidates','补充练习候选')} ${wrong} · ${lk('재확인 후보','Recheck candidates','再确认候选')} ${recheck}</p>
            <p>${esc(L(gp.goal.focus))}</p><p class="pd-note">${lk('진단 직후에는 현재 속도·분량·학습 횟수를 유지합니다. 학습 기록을 관찰한 뒤 조금씩 조정합니다.','Keep the current pace, amount and frequency after diagnosis. Observe study records before gradual changes.','测评后保持当前速度、分量与次数。观察学习记录后再逐步调整。')}</p>${(()=>{const a=gp.autoPlan||S.placement.autoPlan;if(!a)return '';if(a.version!=='observe-plan-v2')return `<p class="pd-note">${lk('이전 자동 편성 제안은 기록으로 보관합니다. 새 진단부터는 유지·관찰 원칙을 적용합니다.','Earlier automatic suggestions are retained as history. New checks use the maintain-and-observe policy.','早期自动建议保留为记录，新测评采用保持并观察的原则。')}</p>`;const same=(S.roadSpeed===a.speed&&S.roadAmount===a.amount);
              return `<div class="pd-auto"><h4>${lk('유지 · 관찰','Maintain · observe','保持 · 观察')}</h4>
                <p><b>${lk('속도','Speed','速度')} ${a.speed}${lk('배','×','倍')} · ${lk('양','Amount','分量')} ${a.amount}${lk('배','×','倍')} · ${a.cadence==='w1'?lk('주 1회','once a week','每周1次'):lk('주 2회','twice a week','每周2次')}</b></p>
                <ul>${(a.reasons||[]).map(r=>`<li>${esc(L(r))}</li>`).join('')}</ul>
                <p class="pd-note">${esc(L(a.note))} ${S.roadManual&&!same?lk('지금은 직접 고른 값을 쓰고 있어요.','You are currently using values you set yourself.','当前使用的是你自己设置的值。'):''}</p>
                </div>`;})()}
            <div class="pd-road-actions"><button type="button" class="pd-support-link" data-placement-course="${esc(gp.main.course)}">${lk('본진도 위치','Main-study location','主要进度位置')}</button>${support.length?`<button type="button" class="pd-support-link" data-placement-course="${esc(support[0].course)}">${lk('첫 보강·재확인 위치','First practice/recheck location','首个补充练习或再确认位置')}</button>`:''}</div>
          <div data-study-route></div></section>`;
        }
      }
    }

    /* ── 진단하기 입구(2026-09-28) — 아직 시작점을 안 정했으면 길 바로 위에 크게 ── */
    if(!(S.placement&&S.placement.course)){
      html+=`<button class="nm-cr-diagcta" id="crDiagCta">
        <span class="nm-cr-diagcta-ic">${crIc('compass')}</span>
        <span class="nm-cr-diagcta-txt"><b>${lk('진단하기','Level Check','水平测评')}</b>
          <small>${lk('지금 몇 학년 연산인지 알려 주거나, 몇 문제로 나에게 맞는 시작점을 찾아요.',
            'Tell us which grade’s arithmetic you are on, or find your start with a few questions.',
            '告诉我们现在做几年级的运算，或做几道题找到适合的起点。')}</small></span>
        ${crIc('arrow')}
      </button>`;
    }
    /* ── 시기 — 과정마다 언제 시작하고 끝나는지(속도 비교 카드와 같은 계산) ── */
    const tm=roadTiming();
    const ageKnown=tm.smNow!=null;
    const MS=roadMilestones();
    if(!ageKnown){
      html+=`<button class="nm-cr-agecue" id="crAgeCue">${crIc('clock')}<span>${lk('나이를 알려 주면 과정마다 언제 시작하고 끝나는지 나와요.',
        'Tell us the age and each course shows when it starts and ends.',
        '告诉我们年龄，就能看到每个课程何时开始、何时结束。')}</span><b>${lk('나이 알려주기','Set age','填写年龄')}</b></button>`;
    } else {
      html+=`<p class="nm-cr-whenlead">${crIc('clock')}<span>${lk('과정마다 적힌 시기는 위에서 고른 빠르기로 지금부터 쉬지 않고 갔을 때예요.',
        'The dates on each course assume the pace chosen above, starting now, with no breaks.',
        '每个课程标注的时间，是按上面选的速度从现在开始不间断地学习时的估算。')}</span></p>`;
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
          :segState==='won'?`<span class="nm-cr-stwin">${crIc('flag')}${lk('정복함','Conquered','已征服')}</span>`
          :segState==='climbing'?`<span class="nm-cr-stclimb">${segDone}/${segAll}</span>`:'';
        html+=`<div class="nm-cr-station ${segState}" style="--acc:${tierDef.accent}">
          <span class="nm-cr-strow">
            <span class="nm-cr-stname">${esc(L(tierDef.name))}${again?` <em class="nm-cr-again">${lk('이어서','continued','续')}</em>`:''}</span>
            ${segLabel}
          </span>
          ${again?'':`<span class="nm-cr-stband">${esc(L(tierDef.band))}</span>`}
          <span class="nm-cr-strange">${lk('과정','Course','课程')} <span class="nm-cr-tnum">${rangeTxt}</span>${embHtml}</span>
          ${(()=>{ /* 이 구간의 시작 → 끝(2026-09-28) */
            if(!ageKnown) return '';
            const a=tm.rows[runItems[0].key], b=tm.rows[runItems[runItems.length-1].key];
            if(!a||!b) return '';
            if(b.past) return `<span class="nm-cr-stwhen past">${lk('지났어요','Already past','已经过了')}</span>`;
            const e=esc(pcAgeLabel(b.endSm));
            const s=a.past||a.cur?lk('지금','Now','现在'):esc(pcAgeLabel(a.startSm));
            return `<span class="nm-cr-stwhen">${crIc('clock')}<b class="nm-cr-tnum">${s}</b> → <b class="nm-cr-tnum">${e}</b></span>`; })()}
          ${(()=>{ const r=tierReadiness(c.tier); if(!r||r.ready) return '';
            /* 한국어는 "초1 8월부터"처럼 붙여 써야 한다 — 조사 앞에 빈칸을 두면 어색하다 */
            return `<span class="nm-cr-stready">${crIc(r.unknown?'info':'clock')}${ko?`보통 ${schoolMonthsLabel(r.need)}부터 권해요`
              :en?`Usually from ${schoolMonthsLabel(r.need)}`:`通常从${schoolMonthsLabel(r.need)}起`}</span>`; })()}
        </div>`;
        if(!again) html+=middlePacingHtml(c.tier);
        if(!again&&c.studyPlan&&c.tier==='calculus1') html+=`<p class="nm-cr-cadfoot">${lk('미적분Ⅰ 20회차 · 기본 12주(약 3개월). 과정 점검 4회를 포함해 매주 1~2회차를 나누어 공부해요.','Calculus I: 20 sessions over 12 weeks (about 3 months), including four course checks. One or two sessions are scheduled each week.','微积分Ⅰ20课次，基础12周（约3个月），包含4次课程检查，每周安排1~2课次。')}</p>`;
        else if(!again&&c.studyPlan&&!/^middle/.test(c.tier)) html+=`<p class="nm-cr-cadfoot">${lk('교과 연산 24묶음 · 주 2회 기준 12주(약 3개월). 기존 회차를 합쳐 주당 학습량을 늘렸어요.','24 curriculum-practice bundles · 12 weeks at two bundles a week. Existing sessions are combined into a larger weekly workload.','24组课内运算 · 每周2组共12周（约3个月）。合并原课次，增加每周学习量。')}</p>`;
        prevTier=c.tier;
      }
      const tierDef=roadTierInfo(c.tier);
      {
        const n=courseLessonCount(c);
        const wk=Math.ceil(coursePaceWeeks(c,cad,mult)-1e-9);
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
        const stateLabel=isDone?`${crIc('flag')}${lk('정복함','Conquered','已征服')}`
          :isNow?`${crIc('pin')}${lk('지금 여기','You are here','当前位置')}`
          :isGoal?`${crIc('flag')}${lk('다음 목표','Next goal','下一个目标')}`
          :c.boss?lk('마무리 관문','Final gate','最后关卡')
          :isDoing?`${prog.done}/${prog.total}`
          :'';
        /* 이정표(중등·중2·고등·미적분 시작) — 그 과정 바로 앞에 깃발 한 줄 */
        const ms=MS.find(m=>m.course===x.num);
        if(ms){
          const r=tm.rows[x.key];
          const when=!ageKnown||!r?'':r.past?lk('지났어요','Already past','已经过了')
            :r.cur?lk('지금','Now','现在'):esc(pcAgeLabel(r.startSm));
          html+=`<div class="nm-cr-msrow" data-ms="${ms.id}"><span class="nm-cr-ms">${crIc('flag')}<b>${esc(L(ms.name))}</b>${when?`<em class="nm-cr-tnum">${when}</em>`:''}</span></div>`;
        }
        const isPlaced=!!(S.placement&&S.placement.course===x.key);
        const placedChip=isPlaced?`<span class="nm-cr-placed">${S.placement.self?lk('내가 고른 시작점','My chosen start','我选的起点'):lk('진단 추천','Check-up pick','测评推荐')}</span>`:'';
        html+=`<div class="nm-cr-row ${ci%2?'right':'left'}${isPlaced?' placed':''}">
          ${isNow?`<div class="nm-cr-here">${window.renderHumanChar?window.renderHumanChar(avatarProfile(),44):'🪄'}<span>${lk('지금 여기','You are here','当前位置')}</span></div>`:''}
          <button class="nm-cr-node ${st}${locked?' trial-locked':''}" data-c="${x.key}" style="--acc:${tierDef.accent}"${isNow?' id="crNow"':''}>
            <span class="nm-cr-num">${x.num}${isDone?`<i class="nm-cr-flag">${crIc('check')}</i>`:''}</span>
            <span class="nm-cr-nbody">
              <b>${esc(L(c.title))}${c.boss?`<span class="nm-cr-tt" title="${lk('마무리 관문','Final gate','最后关卡')}">${crIc('crown')}</span>`:isTower?`<span class="nm-cr-tt">${crIc('tower')}</span>`:''}</b>
              <span class="nm-cr-meta">${ko?`수업 ${n}회 · ${wk}주`:en?`${n} lessons · ${wk} wk`:`${n}次课 · ${wk}周`}</span>
              ${ageKnown?roadWhenHtml(tm.rows[x.key]):''}
              ${placedChip}
              ${!built?`<span class="nm-cr-soon">${lk('준비 중','Coming soon','准备中')}</span>`:''}
            </span>
            <span class="nm-cr-state">${locked?`<span aria-label="${lk('잠김','Locked','已锁定')}">🔒</span>`:stateLabel}</span>
          </button>
          <details class="nm-cr-explain" style="--acc:${tierDef.accent}" data-c="${x.key}">
            <summary>${lk('무엇을 배우나요','What you learn','学什么')}</summary>
            <div class="nm-cr-ex-body"></div>
          </details>
        </div>`;
        ci++;
        /* ── 세 과정마다 연산 점검 정거장(2026-09-16) ──
           길 위에 그대로 얹어야 "중간에 꼭"이 된다 — 따로 있는 메뉴로 빼면
           지나쳐 버린다. 지나가는 것을 막지는 않는다(잠금 아님). */
        if(isCheckupPoint(x.num)){
          const rec=checkupRecord(x.num);
          const due=checkupDue(x.num);
          const going=checkupInProgress(x.num);
          const cls=going?'due':rec?'done':due?'due':'ahead';
          const nums=checkupCourseNums(x.num);
          const qN=buildCheckupItems(x.num).length;
          const scoreTxt=going
            ? `${lk('이어서 하기','Continue','继续')} · ${going.i}/${going.items.length}`
            : rec
            ? `${lk('계산','Calc','计算')} ${rec.calcOk}/${rec.calcTotal} · ${lk('문장제','Word problems','应用题')} ${rec.wpOk}/${rec.wpTotal}`
            : `${due?lk('지금 할 차례','Your turn now','轮到你了'):lk('과정 3개마다','every 3 courses','每3个课程')} · ${qN}${lk('문제','questions','题')}`;
          html+=`<div class="nm-cr-checkrow">
            <button class="nm-cr-check ${cls}" data-chk="${x.num}">
              <span class="nm-cr-check-ic">${crIc(cls==='done'?'check':'steps')}</span>
              <span class="nm-cr-check-body">
                <b>${lk('연산 점검','Check-up','运算检查')} · ${lk('과정','Course','课程')} ${nums[0]}~${nums[nums.length-1]}</b>
                <span class="nm-cr-check-meta">${scoreTxt}</span>
              </span>
            </button>
          </div>`;
        }
      }
    });
    html+=`</div>`;

    /* ── 수학 실험실 ── */
    html+=`<div class="nm-cr-labs">
      <span class="nm-cr-eyebrow">${lk('언제든 열어 보기','Open any time','随时打开')}</span>
      <div class="nm-cr-labs-h">${crIc('flask')}${lk('수학 실험실','Math Lab','数学实验室')}</div>
      <p class="nm-cr-labs-sub">${lk('과정과 상관없이 열 수 있어요. 새 창에서 열려요.','Whatever course you are on. They open in a new tab.','不论在哪个课程都能打开，会在新窗口打开。')}</p>
      <div class="nm-cr-lab-grid">${ROAD_LABS.map(lab=>`
        <button class="nm-cr-lab" data-lab="${esc(lab.file)}">
          <span class="nm-cr-lab-ic">${lab.icon}</span>
          <span class="nm-cr-lab-txt"><b>${esc(L(lab.name))}</b><small>${esc(L(lab.desc))}</small></span>
        </button>`).join('')}</div>
    </div>`;

    const keep=keepScroll?body.scrollTop:0;
    listEl.innerHTML=html;
    if(curC?.studyPlan){const preschoolPaces=listEl.querySelector('.nm-cr-step.nm-cr-pace');if(preschoolPaces)preschoolPaces.hidden=true;}
    body.querySelector('#crAdjust').onclick=()=>openLearningPlanSheet();
    const extensionButton=body.querySelector('#crExtension');if(extensionButton)extensionButton.onclick=()=>openMiddleExtensionSheet(extensionGuide);
    if(S.adminPlan)body.querySelectorAll('[data-pace],[data-pc-apply]').forEach(b=>b.disabled=true);
    if(window.NM_STUDY_ROUTE){
      const gp=S.placement&&S.placement.pathRecommendation;
      if(!listEl.querySelector('[data-study-route]'))listEl.insertAdjacentHTML('afterbegin','<section class="nm-card"><div data-study-route></div></section>');
      listEl.querySelectorAll('[data-study-route]').forEach(el=>window.NM_STUDY_ROUTE.mount(el,{lang:S.lang,course:gp?gp.main.course:currentCourseKey(),session:gp?gp.main.session:1,cadence:S.roadCadence}));
    }
    body.querySelectorAll('.nm-cr-pacebtn[data-pace]').forEach(el=>{
      el.onclick=()=>{ if(applyLearningSettings({pace:el.dataset.pace}))render(); };
    });
    body.querySelectorAll('.nm-cr-node[data-c]').forEach(el=>{
      el.onclick=()=>openCourseSheet(el.dataset.c);
    });
    body.querySelectorAll('[data-placement-course]').forEach(el=>{
      el.onclick=()=>{
        const key=el.dataset.placementCourse;
        if(!(window.NM_COURSES||{})[key])return;
        const node=listEl.querySelector(`.nm-cr-node[data-c="${key}"]`);
        if(node)roadFlashRow(node,body);
      };
    });
    /* 과정 설명 — 펼칠 때 채운다. 설정을 바꿔 다시 그려도 펼친 것은 펼친 채로 */
    body.querySelectorAll('.nm-cr-explain[data-c]').forEach(el=>{
      const fill=()=>{ const b=el.querySelector('.nm-cr-ex-body'); if(b&&!b.childElementCount){ const c=(window.NM_COURSES||{})[el.dataset.c]; if(c) b.innerHTML=courseExplainHtml(c); } };
      if(openEx[el.dataset.c]){ el.open=true; fill(); }
      el.addEventListener('toggle',()=>{ openEx[el.dataset.c]=el.open; if(el.open) fill(); });
    });
    const ageCue=body.querySelector('#crAgeCue');
    if(ageCue) ageCue.onclick=()=>openAgeSheet(()=>{ draw(true); syncRoad3dTimes(); });
    const diagCta=body.querySelector('#crDiagCta');
    if(diagCta) diagCta.onclick=()=>startPlacement();
    syncRoad3dTimes();
    const pcAge=body.querySelector('#pcAge');
    if(pcAge) pcAge.onclick=()=>openAgeSheet(()=>draw(true));
    body.querySelectorAll('[data-pc-apply]').forEach(el=>{
      el.onclick=()=>{
        if(!applyLearningSettings({cadence:el.dataset.cad,pace:el.dataset.pace,speed:+el.dataset.speed}))return;
        render();
        const PC=window.NM_PACE_COMPARE;
        if(PC) toast(L(PC.STR.applied));
      };
    });
    body.querySelectorAll('[data-middle-session]').forEach(el=>{
      el.onclick=()=>{
        if(window.NM_EXAM&&typeof NM_EXAM.openMiddlePacing==='function'){
          NM_EXAM.openMiddlePacing(+el.dataset.middleGrade,el.dataset.middleSession);
        } else toast('학습지 도구를 아직 불러오지 못했어요. 잠시 후 다시 열어 주세요.',true);
      };
    });
    body.querySelectorAll('.nm-cr-check[data-chk]').forEach(el=>{
      el.onclick=()=>startCheckup(+el.dataset.chk);
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
      /* 처음 열 때만 현재 위치(또는 진단이 추천한 과정)로 스크롤.
         3D 지도가 뜰 수 있으면 맨 위(지도)를 보여 주고, 지도가 그 과정을 비춘다.
         단, 다른 화면이 "이 과정을 보여 줘"(S._roadFocus)라고 보냈으면 목록의 그 과정으로 간다. */
      if(roadView==='map'&&!S._roadFocus){
        body.scrollTop=0;
      } else if(S._roadFocus||!hero3dLikely){
        const focusKey=S._roadFocus||curKey;
        const target=listEl.querySelector(`.nm-cr-node[data-c="${focusKey}"]`)||listEl.querySelector('#crNow');
        /* 진단·시작점 고르기에서 왔으면 그 과정을 잠깐 빛나게(2026-09-28) */
        if(target&&S._roadFocus) roadFlashRow(target,body);
        else if(target) target.scrollIntoView({block:'center'});
      } else body.scrollTop=0;
      S._roadFocus=null;
    }
  }
  draw(false);
  if(heroEl&&!hero3dLikely)heroEl.remove();
  setRoadView(roadView,false);
  renderPersonalPlan();
}
/* WebGL 을 쓸 수 있을 것 같은가(없으면 3D 지도 자리를 만들지 않고 옛 동작 그대로) */
function road3dLikely(){
  try{ const c=document.createElement('canvas'); return !!(c.getContext('webgl2')||c.getContext('webgl')); }catch(e){ return false; }
}
/* CSS 변수(var(--blue) 등)로 적힌 등급 색을 3D 가 쓸 #hex 로 */
function roadAccentHex(v){
  const m=/^var\((--[\w-]+)\)$/.exec(String(v||'').trim());
  if(!m) return v||'#8a6a40';
  const got=getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim();
  return got||'#8a6a40';
}
/* 목록에서 한 줄을 찾아 가운데로 보이고 잠깐 빛나게(3D 지도에서 누른 과정·점검) */
function roadFlashRow(el,body){
  if(!el) return;
  const reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* 멀면 바로 옮기고(긴 부드러운 스크롤은 느린 기기에서 한참 걸린다) 가까우면 부드럽게 */
  const far=body?Math.abs(el.getBoundingClientRect().top-body.getBoundingClientRect().top-body.clientHeight/2)>body.clientHeight*1.5:true;
  el.scrollIntoView({block:'center',behavior:reduce||far?'auto':'smooth'});
  el.classList.remove('nm-cr-flash'); void el.offsetWidth; el.classList.add('nm-cr-flash');
  clearTimeout(el._flashT); el._flashT=setTimeout(()=>el.classList.remove('nm-cr-flash'),2600);
  try{ el.focus({preventScroll:true}); }catch(e){}
}
/* 3D 연산 로드맵 지도(2026-09-26) — app/road3d/road3d.js. 목록(2D)이 먼저 서 있고, 3D 는 그 위 머리 자리에 선다.
   이정표를 누르면 목록의 그 과정으로 스크롤해 빛나게 한다(과정 시트는 목록의 버튼을 눌러 연다 — 여는 길은 한 곳).
   WebGL 이 없거나 실패하면 머리 자리를 치우고 옛 화면 그대로(현재 과정으로 스크롤). */
function mountRoad3DInto(heroEl, o){
  const list=roadCourseList();
  const curKey=o.curKey, goalKey=nextGoalKey(curKey);
  const whenMap=roadStartLabels();
  const courses=list.map(x=>{
    const c=x.c, isDone=courseConquered(c), isNow=x.key===curKey;
    const isGoal=!isDone&&!isNow&&x.key===goalKey;
    const prog=courseProgress(c);
    return { id:x.key, num:x.num, title:L(c.title), band:c.tier, sessions:courseLessonCount(c),
      state:isNow?'now':isDone?'done':isGoal?'goal':(prog.done>0?'doing':'ahead'),
      boss:!!c.boss, tower:c.tier==='challenge', when:whenMap[x.key]||'' };
  });
  const bands={};
  list.forEach(x=>{ if(bands[x.c.tier]) return; const d=roadTierInfo(x.c.tier); bands[x.c.tier]={name:L(d.name), sub:L(d.band), color:roadAccentHex(d.accent)}; });
  const checkups=[];
  list.forEach(x=>{
    if(!isCheckupPoint(x.num)) return;
    const nums=checkupCourseNums(x.num);
    const going=checkupInProgress(x.num), rec=checkupRecord(x.num), due=checkupDue(x.num);
    checkups.push({num:x.num, from:nums[0], to:nums[nums.length-1], state:going||due?'due':rec?'done':'ahead'});
  });
  const failBack=()=>{
    heroEl.remove();
    /* 지도가 안 섰다 — 아무도 스크롤하지 않았으면 옛 화면처럼 지금 과정으로 */
    if(o.body&&o.body.isConnected&&o.body.scrollTop===0){
      const t=o.listEl.querySelector(`.nm-cr-node[data-c="${o.focus||curKey}"]`)||o.listEl.querySelector('#crNow');
      if(t) t.scrollIntoView({block:'center'});
    }
  };
  import('./road3d/road3d.js?v=20261021-characters1').then(m=>m.mountRoad3D(heroEl,{
    lang:S.lang, courses, bands, checkups, current:curKey, goal:goalKey, focus:o.focus,
    avatar:avatarProfile(),
    onCourse:id=>roadFlashRow(o.listEl.querySelector(`.nm-cr-node[data-c="${id}"]`),o.body),
    onCheckup:num=>roadFlashRow(o.listEl.querySelector(`.nm-cr-check[data-chk="${num}"]`),o.body)
  })).then(ctl=>{
    if(!ctl){ if(heroEl.isConnected) failBack(); return; }
    if(!heroEl.isConnected){ ctl.dispose(); return; }
    heroEl.classList.add('is-3d');
    if(o.onCtl) o.onCtl(ctl);
    const prev=townCleanup;
    townCleanup=()=>{ if(prev)prev(); ctl.dispose(); };
  }).catch(e=>{ console.warn('[road3d]',e); if(heroEl.isConnected) failBack(); });
}

/* ============================================================
   진단하기 v2 (S.view==='placement') — 세밀한 레벨 확인 + 세부 스킬 체크
   ------------------------------------------------------------
   원장 지시 두 가지: ①"진단을 더 세밀하게" — 47개 과정(C1~C47) 전부를
   사다리에 얹고, 경계를 찾은 뒤에는 그 근처 과정들의 스킬을 하나씩 더
   물어 "어느 스킬이 익숙하고, 어느 게 맞혔지만 느리고, 어느 게 연습이
   필요한지"까지 알려준다. ②"시작을 스스로 고를 수도 있게" — 진단 없이
   과정을 직접 골라 시작하는 화면(S.view==='startpick', screenStartPick)을
   더했다.

   세 단계로 진행된다(d=S._diag, d.stage):
   1. age    — 나이를 고른다(원장 지시: "현재 나이에 따라 연산 정도를
      물어보는 설문이 달라야 해"). 나이마다 사다리의 다른 칸에서 시작한다.
   2. q      — 위아래로 좁히기(bracketing). 맞히면 위로(맞힐 때마다 도약
      폭이 커진다: 4→8→12칸), 틀리면 아래로 절반씩. 최대 9문항
      (PLACEMENT-CORE.MAX_Q). scripts/sim-placement.js가 나이×실력 전
      조합을 돌려 최대 문항 수·경계 오차를 검증한다(0건이어야 통과).
   3. fine   — 경계 과정 K를 찾으면 K와 K-1 두 과정의 자기 드릴 재료를
      모아 하나씩 더 묻는다(최대 8문항, 이미 2단계에서 물어본 스레드는
      다시 안 묻고 그 결과를 재활용). 25초 기준으로 익숙함(✅)·맞혔지만
      느림(🟡)·연습 필요(❌)를 가른다.
   → 결과: 추천 과정(K, 단 K-1 자기 재료 중 오답 2개 이상이면 K-1로 낮춤)
     + 영역별(수와 덧셈·뺄셈·곱셈·나눗셈·분수·소수·혼합응용·경시·중고등)
     스킬 칩 목록. "직접 고를래요" 버튼으로 언제든 startpick으로 갈 수
     있다 — 결과는 권유일 뿐 어떤 과정도 잠그지 않는다.

   사다리 만들기·좁히기 순수 로직은 app/placement-core.js에 있다(node
   시뮬레이터도 같이 쓴다 — main.js는 DOM이 있어야 로드되므로 못 부른다).
   문항은 전부 기존 생성기(NM_TGEN)가 만든다 — 새 문제를 지어내지 않는다.
   ============================================================ */
/* 사다리·좁히기(bracketing) 순수 로직은 app/placement-core.js에 있다(node
   시뮬레이터 scripts/sim-placement.js가 같이 쓴다 — main.js는 DOM이 있어야
   로드되므로 거기서는 못 부른다). 여기서는 한 번 만들어 캐시만 한다(과정
   데이터는 페이지 켜져 있는 동안 안 바뀐다).
   47개 과정(C1~C47) 전부를 사다리에 한 칸씩 얹는다 — 예전엔 16칸짜리
   손으로 고른 표였지만, 이제 buildLadder()가 courseBuilt인 과정마다
   "그 과정 자기 드릴 재료 중 생성기 답이 숫자 하나인 첫 스레드"를 데이터에서
   직접 고른다(전부 배열 답이면 첫 재료로 대체). 수의 나라(유아) 4칸은
   그대로 맨 앞에 고정. */
let _placementLadder=null;
function placementLadder(){
  if(!_placementLadder) _placementLadder=window.NM_PLACEMENT_CORE?window.NM_PLACEMENT_CORE.buildLadder():[];
  return _placementLadder;
}

/* 나이 선택지. 이름·나이 문구는 지어내지 않고 이 앱이 이미 쓰는 것을
   그대로 가져온다 — 교과연산·중등·고등 구간은 ROAD_TIERS의 name/band를,
   유아 구간은 data/curriculum.js 수의 나라 tier의 ageLabel을 쓴다.
   entry(사다리 칸)는 course 키로 매 렌더 때 사다리에서 찾는다(하드코딩 인덱스
   없음) — placementAgeEntry() 참고. */
const PLACEMENT_AGES=[
  {key:'pre', emoji:'🌱', tier:'level0',    course:'C0'},
  {key:'g1',  emoji:'🌿', tier:'level1',    course:'C1'},
  {key:'g2',  emoji:'🌳', tier:'level2',    course:'C11'},
  {key:'g3',  emoji:'⛰️', tier:'level3',    course:'C17'},
  {key:'adv', emoji:'🗼', tier:'challenge', course:'C26'},
  {key:'m1',  emoji:'📘', tier:'middle1',   course:'C29'},
  {key:'m2',  emoji:'📗', tier:'middle2',   course:'C32'},
  {key:'m3',  emoji:'📙', tier:'middle3',   course:'C35'},
  {key:'hi',  emoji:'🎓', tier:'highmath1', course:'C38'}
];
/* ── "지금 몇 학년 연산을 하고 있어요?" — 학교 학년 → 시작 과정 (2026-09-28) ──
   원장 "진단하기는 지금 몇 학년 연산을 하는지 말하거나 그냥 진행할 수 있게".
   과정 번호를 새로 정하지 않는다. 행마다 근거가 되는 데이터를 적어 두고, 가능한 곳은
   실행할 때 데이터에서 직접 찾는다(tier 의 첫 과정 · 속도 비교 마일스톤).
     tier      : data/courses.js 에서 그 tier 의 **첫 과정**(번호가 가장 작은 것)
     milestone : app/pace-compare.js MILESTONES 의 course (출처: 기적의 계산법 권별 주제 —
                 CURRICULUM-SOURCES.md §9)
     course    : 위 둘로 못 짚는 초5·초6 — CURRICULUM-SOURCES.md §9 권별 주제와
                 data/courses.js 과정 제목이 같은 자리(scripts/check-road-timing.js 가 제목을 대조)
   | 학년        | 근거                                                                 | 과정 |
   | 유아(5~6세) | tier level0 (stages.js 수의 나라 "유아 5~7세")                         | 0   |
   | 초1         | milestone K = 수 감각 끝 → 과정 1 (§9 1·2권 초1 자연수 덧뺄)            | 1   |
   | 초2         | milestone G2 = 한 자리 덧뺄 끝 → 과정 3 (§9 3·4권 초2 덧뺄 고급·구구단)   | 3   |
   | 초3         | milestone G4 = 구구단 끝 → 과정 8 (§9 5·6권 초3 곱셈·나눗셈)             | 8   |
   | 초4         | milestone G6 = "초3 연산 끝" → 과정 13 (§9 7·8권 초4 곱나눗 고급·분수)   | 13  |
   | 초5         | §9 9권 "약수배수·약분통분·이분모 분수(초5)" = 과정 19 「약수와 배수…」    | 19  |
   | 초6         | §9 11권 "분수·소수 나눗셈(초6)" = 과정 22 「분수 나눗셈」                 | 22  |
   | 중1·중2·중3 | tier middle1·middle2·middle3 첫 과정                                 | 29·32·35 |
   | 고등        | tier highmath1 첫 과정(공통수학1 — 공통수학2 는 그 뒤 40)               | 38  |
   | 대수·미적분Ⅰ | tier algebra·calculus1 첫 과정                                       | 41·45 |
   학기(1·2학기) 구분은 넣지 않았다 — 학기마다 과정을 가를 근거가 데이터에 없다. */
const PLACEMENT_GRADES=[
  {key:'pre', tier:'level0',     label:{ko:'유아 (5~6세)',en:'Preschool (ages 5–6)',zh:'幼儿（5~6岁）'}},
  {key:'e1',  milestone:'K',     label:{ko:'초1',en:'Grade 1',zh:'小1'}},
  {key:'e2',  milestone:'G2',    label:{ko:'초2',en:'Grade 2',zh:'小2'}},
  {key:'e3',  milestone:'G4',    label:{ko:'초3',en:'Grade 3',zh:'小3'}},
  {key:'e4',  milestone:'G6',    label:{ko:'초4',en:'Grade 4',zh:'小4'}},
  {key:'e5',  course:19,         label:{ko:'초5',en:'Grade 5',zh:'小5'}},
  {key:'e6',  course:22,         label:{ko:'초6',en:'Grade 6',zh:'小6'}},
  {key:'m1',  tier:'middle1',    label:{ko:'중1',en:'Grade 7',zh:'初1'}},
  {key:'m2',  tier:'middle2',    label:{ko:'중2',en:'Grade 8',zh:'初2'}},
  {key:'m3',  tier:'middle3',    label:{ko:'중3',en:'Grade 9',zh:'初3'}},
  {key:'hi',  tier:'highmath1',  label:{ko:'고등 (공통수학1·2)',en:'High school (Common Math 1·2)',zh:'高中（共同数学1·2）'}},
  {key:'alg', tier:'algebra',    label:{ko:'대수',en:'Algebra',zh:'代数'}},
  {key:'cal', tier:'calculus1',  label:{ko:'미적분Ⅰ',en:'Calculus I',zh:'微积分Ⅰ'}}
];
/* 학년 행 → 과정 번호(데이터에서 찾는다). 못 찾으면 null */
function placementGradeCourseNum(g){
  if(g.course!=null) return g.course;
  if(g.milestone){ const PC=window.NM_PACE_COMPARE, m=PC&&PC.milestone(g.milestone); return m?m.course:null; }
  if(g.tier){ const x=roadCourseList().find(x=>x.c.tier===g.tier); return x?x.num:null; }
  return null;
}
function placementGradeCourseKey(g){ const n=placementGradeCourseNum(g); return n==null?null:'C'+n; }
/* 과정 → "학교로 치면 몇 학년 연산" — 표의 행 가운데 시작 과정이 그 과정 이하인 마지막 행 */
function gradeBandOfCourse(key){
  const num=parseInt(String(key).replace(/^C/,''),10);
  let hit=null;
  PLACEMENT_GRADES.forEach(g=>{ const n=placementGradeCourseNum(g); if(n!=null&&n<=num) hit=g; });
  return hit;
}
window.NM_PLACEMENT_GRADES=()=>PLACEMENT_GRADES.map(g=>({key:g.key, label:g.label, course:placementGradeCourseNum(g)}));
/* 수의 나라 구간의 이름·나이 — curriculum.js에서 읽고, 없으면 같은 문구로 적는다. */
function placementPreLabel(){
  const tiers=(window.NM_CURRICULUM&&window.NM_CURRICULUM.tiers)||[];
  const nl=tiers.find(x=>x.id==='numberland');
  const age=(nl&&nl.ageLabel)||'5~6세';
  return {
    name:{ko:'수의 나라',en:'Number Land',zh:'数字王国'},
    band:{ko:age, en:'Ages 5–6', zh:'5~6岁'}
  };
}
function placementAgeLabel(opt){
  if(!opt.tier) return placementPreLabel();
  const info=roadTierInfo(opt.tier);
  return {name:info.name, band:info.band};
}
/* 나이가 가리키는 사다리 칸 — course가 없으면(수의 나라) 0번 칸, 있으면
   사다리에서 그 과정의 칸을 찾는다(못 찾으면 안전하게 0). */
function placementAgeEntry(opt){
  if(!opt.course) return 0;
  const CORE=window.NM_PLACEMENT_CORE;
  if(!CORE) return 0;
  const idx=CORE.rungIndexOfCourse(placementLadder(), opt.course);
  return idx>=0?idx:0;
}

let assessmentChooseMethod=true;
let roadAssessmentReturn=null;
function startPlacement(){
  roadAssessmentReturn=null;
  const ui=window.NM_PLACEMENT_UI,paths=window.NM_PLACEMENT_PATHS;
  if(!ui)S._diag=null;
  else if(!S._diag||S._diag.version!==ui.version||S._diag.phase==='result'){
    assessmentChooseMethod=false;
    const previous=S._diag&&S._diag.version===ui.version&&S._diag.selection
      ?S._diag.selection:S.placement&&S.placement.selection;
    const previousConfig=S.placement&&S.placement.pathRecommendation&&S.placement.pathRecommendation.config;
    S._diag=ui.initial();
    if(previous)Object.assign(S._diag.selection,JSON.parse(JSON.stringify(previous)));
    if(paths)Object.assign(S._diag.selection,paths.normalize(previous||previousConfig));
    // A grade entered earlier (sign-up or profile) fills the setup, so the matching scope is preselected.
    const sel=S._diag&&S._diag.selection,sa=S.schoolAge;
    if(sel&&sa){
      const at=new Date(Number.isFinite(sa.setAt)?sa.setAt:Date.now());
      sel.entryYear=sa.entryYear||null;sel.profileGrade='';sel.gradeInferred=false;
      sel.profileAt=(Number.isNaN(at.getTime())?new Date():at).toISOString().slice(0,10);
      if(sa.birthYear)sel.birthYear=sa.birthYear;
      if(sel.scopeSource==='grade'){sel.baselineId='';sel.studyBand='';}
    }
  }else assessmentChooseMethod=['question','paper'].includes(S._diag.phase);
  // Re-entry resumes a compatible fixed plan/setup; it never regenerates
  // answered questions or reinterprets a legacy adaptive run.
  S.view='placement'; save(); render();
}
/* 진단 천장(2026-09-28, 원장 "말도 안되지, 연산 테스트가 5살한테 미적 줄꺼야?").
   전에는 누구든 다 맞히면 사다리 끝(고등 미적분)까지 올라갔다. 이제 시작 과정이 속한 로드맵 단계의
   **다음 단계 끝**까지만 올라간다(data/stages.js courses.from/to — 번호를 새로 정하지 않는다).
     유아(과정 0) → 과정 10 · 초1~초3(과정 1~10) → 16 · 초4(13) → 25 · 초5·6(19·22) → 28 · 중등 → 39(공통수학1)
     · 공통수학1 → 40 · 공통수학2 → 44 · 대수·미적분Ⅰ → 47 (2026-09-29 고등이 과목별 네 단계가 되며)
   천장까지 다 맞힌 아이는 결과 화면의 "한 단계 더 올라가 보기"로 천장을 다음 단계로 올려 이어서 푼다
   — 빠른 아이를 막지 않되, 처음부터 어려운 문제를 보여 주지 않는다. */
function placementCeilCourse(courseNum){
  const st=(window.NM_STAGES||[]).filter(x=>x.courses);
  const i=st.findIndex(x=>courseNum>=x.courses.from&&courseNum<=x.courses.to);
  if(i<0) return null;
  return st[Math.min(st.length-1,i+1)].courses.to;
}
/* 천장 과정 이하 칸의 개수 = 좁히기가 쓰는 사다리 길이 */
function placementCapFor(ceilNum){
  const ladder=placementLadder();
  if(ceilNum==null) return ladder.length;
  let n=0;
  ladder.forEach((r,i)=>{ if(parseInt(String(r.course).replace(/^C/,''),10)<=ceilNum) n=i+1; });
  return n||ladder.length;
}
function placementSetEntry(d, idx){
  const ladder=placementLadder();
  d.entry=idx;
  const r=ladder[idx]||ladder[0];
  d.ceil=r?placementCeilCourse(parseInt(String(r.course).replace(/^C/,''),10)):null;
  d.cap=placementCapFor(d.ceil);
  d.hi=Math.min(d.hi==null?d.cap:d.hi, d.cap);
}
function placementN(d){ return d.cap||placementLadder().length; }
/* 다음에 물을 칸(bracketing). null이면 경계를 찾은 것 — placement-core.js로 위임. */
function placementNext(d){
  return window.NM_PLACEMENT_CORE.nextRung(d, placementN(d));
}
/* 한 문제의 채점 결과를 위아래 좁히기(lo/hi)에 반영 — placement-core.js로 위임. */
function placementGrade(d, rungIndex, ok){
  window.NM_PLACEMENT_CORE.grade(d, rungIndex, ok, placementN(d));
}
/* 아직 못 넘은 첫 칸 — placement-core.js로 위임. */
function placementBoundary(d){
  return window.NM_PLACEMENT_CORE.boundary(d, placementN(d));
}
/* 물어본 스레드마다 결과를 남긴다(위아래 좁히기 문제든 세부 진단 문제든 공용).
   나중에(finishPlacement) 이 log에서 "구역 스레드 중 이미 물어본 것"을 찾아
   스킬 목록·재활용 판단에 쓴다. */
function placementLog(d, threadId, level, ok, sec){
  d.log=d.log||[];
  d.log.push({t:threadId, lv:level, ok:!!ok, sec:sec});
}
/* extra — 레벨 params 위에 얹는 추가 인자(2026-09-16). 연산 점검이 문장제를
   그 과정에 맞는 의미 유형으로 좁힐 때 쓴다(params.kinds). 안 넘기면 예전 그대로다. */
function placementProblem(rung, i, run, extra){
  const th=(window.NM_THREADS||{})[rung.thread];
  const gen=(window.NM_TGEN||{})[th&&th.gen];
  const params=(th&&(th.levels||[]).find(l=>l.id===rung.level)||{}).params||{};
  const merged=extra?Object.assign({},params,extra):params;
  const rng=NM_RNG.mulberry32(NM_RNG.hashSeed('diag'+run+rung.thread+rung.level+'i'+i));
  return gen ? gen(merged,rng)
             : {prompt:{ko:'',en:'',zh:''},tex:'?',answer:0,answerType:'number'};
}
/* ── 세부 진단(스킬 체크) 단계 ──
   위아래 좁히기가 끝나면(경계를 찾았거나 문항 수가 다 찼으면) 경계 과정 K를
   구하고, K와 K-1(바로 아래 과정) 두 과정의 자기 드릴 재료를 모아 "이 근처를
   더 자세히" 물어본다. 이미 위아래 좁히기에서 물어본 스레드는 다시 안 묻고
   그 결과를 그대로 재활용한다(placementLog가 쌓아 둔 d.log에서 찾는다). */
function placementAfterBracketing(d){
  const ladder=placementLadder();
  const CORE=window.NM_PLACEMENT_CORE;
  const N=placementN(d);
  const b=CORE.boundary(d,N);
  d.capped = N<ladder.length && b>=N;
  const K=CORE.courseAtIndex(ladder,b);
  d.boundaryIdx=b;
  d.K=K;
  d.zone=CORE.fineZoneCourseKeys(ladder,K);
  const already=(d.log||[]).map(l=>l.t);
  const fineThreads=CORE.fineZoneThreads(d.zone, already);
  if(!fineThreads.length){
    placementFinish(d);
  } else {
    d.stage='fine';
    d.fineThreads=fineThreads;
    d.fineIdx=0;
    d.fineAsked=0;
    d.cur=null; d.qStart=null;
  }
}
/* 결과 계산 — 구역(zone) 과정들의 자기 드릴 재료 순서대로, log에 기록이 있는
   것만(=실제로 물어본 것만) 스킬 목록에 올린다. 추천 과정은 K를 기본값으로
   하되, K-1 자기 재료 중 오답이 2개 이상이면 한 칸 낮춘다. */
function placementFinish(d){
  const ladder=placementLadder();
  const CORE=window.NM_PLACEMENT_CORE;
  const zone=d.zone||CORE.fineZoneCourseKeys(ladder,d.K);
  const recommended=CORE.recommendationAdjust(CORE.recommendedCourseKey(ladder,d.K), zone, d.log||[]);
  const spec=window.NM_COURSE_SPEC||[];
  const seen={}, orderedIds=[];
  (zone||[]).forEach(key=>{
    const num=parseInt(String(key).replace(/^C/,''),10);
    const s=spec.find(x=>x.id===num);
    if(!s) return;
    (s.drills||[]).forEach(t=>{ if(!seen[t]){ seen[t]=true; orderedIds.push(t); } });
  });
  const profile=[];
  orderedIds.forEach(t=>{
    const e=(d.log||[]).find(l=>l.t===t);
    if(e) profile.push({t:e.t, lv:e.lv, ok:e.ok, sec:e.sec});
  });
  const weak=profile.filter(p=>!p.ok).map(p=>p.t);
  const slow=profile.filter(p=>p.ok&&p.sec>25).map(p=>p.t);
  S.placement={ at:Date.now(), course:recommended, asked:d.asked||0, correct:d.correct||0,
    age:d.age||null, grade:d.grade||null, cleared:d.boundaryIdx, profile, weak, slow, self:false,
    ceil:d.ceil==null?null:d.ceil, capped:!!d.capped };
  d.stage='result';
  save();
}

/* ── 결과 화면의 스킬 목록 — 스레드 id 접두사로 영역을 가른다 ── */
const PLACEMENT_AREAS=[
  {prefix:['NS','AD'], icon:'➕', name:{ko:'수와 덧셈',en:'Numbers & Addition',zh:'数与加法'}},
  {prefix:['SB'],      icon:'➖', name:{ko:'뺄셈',en:'Subtraction',zh:'减法'}},
  {prefix:['ML'],      icon:'✖️', name:{ko:'곱셈',en:'Multiplication',zh:'乘法'}},
  {prefix:['DV'],      icon:'➗', name:{ko:'나눗셈',en:'Division',zh:'除法'}},
  {prefix:['FR'],      icon:'🍕', name:{ko:'분수',en:'Fractions',zh:'分数'}},
  {prefix:['DC'],      icon:'🔢', name:{ko:'소수',en:'Decimals',zh:'小数'}},
  {prefix:['MX','EL'], icon:'🧮', name:{ko:'혼합·응용',en:'Mixed & Applied',zh:'混合·应用'}},
  {prefix:['CH'],      icon:'🏆', name:{ko:'경시',en:'Challenge',zh:'竞赛'}},
  {prefix:['MD'],      icon:'📐', name:{ko:'중·고등',en:'Middle & High',zh:'中学·高中'}}
];
function placementAreaOf(threadId){
  const pfx=String(threadId).replace(/[0-9]+$/,'');
  return PLACEMENT_AREAS.find(a=>a.prefix.indexOf(pfx)>=0)
    || {prefix:[pfx], icon:'✨', name:{ko:pfx,en:pfx,zh:pfx}};
}
/* ✅ 익숙해요 / 🟡 맞혔지만 느려요 / ❌ 연습이 필요해요 — 25초 기준. */
function placementVerdict(p){
  if(!p.ok) return {kind:'weak', icon:'❌'};
  if(p.sec>25) return {kind:'slow', icon:'🟡'};
  return {kind:'solid', icon:'✅'};
}
function placementVerdictLabel(kind, lk){
  return kind==='weak'?lk('연습이 필요해요','Needs practice','需要练习')
    :kind==='slow'?lk('맞혔지만 느려요','Correct but slow','答对但较慢')
    :lk('익숙해요','Solid','很熟练');
}
function placementSkillListHtml(profile, lk){
  if(!profile||!profile.length) return '';
  const groups=[]; const byIdx={};
  profile.forEach(p=>{
    const a=placementAreaOf(p.t);
    const gkey=a.name.ko;
    if(byIdx[gkey]==null){ byIdx[gkey]=groups.length; groups.push({area:a, items:[]}); }
    groups[byIdx[gkey]].items.push(p);
  });
  return `<div class="nm-dg-skills">
    <div class="nm-dg-skills-h">${lk('세부 결과','Skill details','细项结果')}</div>
    ${groups.map(g=>`<div class="nm-dg-skgroup">
      <div class="nm-dg-skgroup-h">${g.area.icon} ${esc(L(g.area.name))}</div>
      <div class="nm-dg-skchips">${g.items.map(p=>{
        const th=(window.NM_THREADS||{})[p.t];
        const v=placementVerdict(p);
        return `<span class="nm-dg-skchip ${v.kind}" title="${esc(placementVerdictLabel(v.kind,lk))}">${v.icon} ${th?esc(L(th.name)):esc(p.t)}</span>`;
      }).join('')}</div>
    </div>`).join('')}
  </div>`;
}

function screenPlacement(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen'), ui=window.NM_PLACEMENT_UI;
  const close=()=>{S.view='town';save();render();};
  if(!ui){
    scr.innerHTML='<div class="nm-step-body"><p role="alert">'+esc(L({ko:'진단 자료를 불러오지 못했습니다. 새로고침 후 다시 시작해 주세요.',en:'Assessment data could not be loaded. Please reload.',zh:'未能加载测评资料，请刷新。'}))+'</p><button class="nm-btn" id="pdLoadBack">'+t('back')+'</button></div>';
    $('#pdLoadBack').onclick=close;return;
  }
  // A saved adaptive run cannot be interpreted as a fixed 6/10/4 plan.
  if(!S._diag||S._diag.version!==ui.version){S._diag=ui.initial();save();}
  if(S._diag.phase==='setup')assessmentChooseMethod=false;
  ui.render({root:scr,state:S._diag,lang:S.lang,currentCadence:S.roadCadence,save,renderMath,close,
    chooseMethod:assessmentChooseMethod,checkHistory:()=>S.achievementChecks||[],
    onAttemptStart:()=>{assessmentChooseMethod=false;},
    onMethodChoose:phase=>{assessmentChooseMethod=false;S._diag.phase=phase;S._diag.questionStartedAt=Date.now();save();render();},
    planSettings:{speed:S.roadSpeed||1,pace:S.roadPace||'p2',cadence:S.roadCadence||'w1'},
    onProfile:profile=>{S.schoolAge={entryYear:profile.entryYear,birthYear:profile.birthYear,setAt:Date.now()};save();},
    paceManaged:!!S.adminPlan,
    onPaceApply:p=>{if(S.adminPlan||!ROAD_MULTS_LIST.includes(p.speed)||!['w1','w2'].includes(p.cadence))return false;return applyLearningSettings({speed:p.speed,cadence:p.cadence});},
    pick:()=>{S._diag=null;S.view='startpick';save();render();},
    seeCourse:key=>{roadAssessmentReturn=S._diag;S._roadFocus=key;S.view='courseroad';save();render();},
    onResult:(result,run)=>{
      if(run.purpose==='achievement'){
        const record={at:Date.now(),seed:run.seed,source:run.responseSource||'online',baselineId:run.plan.baseline.id,
          asked:result.asked,correct:result.correct,bands:JSON.parse(JSON.stringify(result.bands)),
          domains:JSON.parse(JSON.stringify(result.domains)),profile:JSON.parse(JSON.stringify(result.profile)),
          selection:JSON.parse(JSON.stringify(run.selection))};
        S.achievementChecks=[...(S.achievementChecks||[]).filter(x=>x.seed!==run.seed),record].slice(-20);
        return;
      }
      S.placement={at:Date.now(),version:ui.version,source:run.responseSource||'online',course:result.recommendation.course,
        session:result.recommendation.session,asked:result.asked,correct:result.correct,
        age:run.selection.age||null,grade:run.selection.grade||null,
        baselineId:run.plan.baseline.id,selection:JSON.parse(JSON.stringify(run.selection)),
        bands:result.bands,domains:result.domains,profile:result.profile,
        recommendation:JSON.parse(JSON.stringify(result.recommendation)),
        weak:Array.from(new Set(result.profile.filter(p=>p.ok===false).map(p=>p.t))),slow:[],
        self:false,capped:false};
      if(result.pathRecommendation){
        const path=result.pathRecommendation;
        S.placement.pathRecommendation=JSON.parse(JSON.stringify(path));
        S.placement.course=path.main.course;
        S.placement.session=path.main.session;
        S.placement.weak=Array.from(new Set(path.support.filter(x=>x.wrong>0).map(x=>x.t)));
        // Explicitly chosen frequency is a planning preference, not acceleration.
        // Selection is a preference; diagnosis must not replace the current load.
        // Keep current workload. Goal/score alone cannot authorize an increase.
        try{
          const paths=window.NM_PLACEMENT_PATHS;
          if(paths&&paths.autoPlan){
            const auto=paths.autoPlan(result,run.selection,{speed:S.roadSpeed,amount:S.roadAmount,cadence:S.roadCadence});
            auto.at=Date.now();
            auto.applied=false;
            S.placement.autoPlan=auto;
          }
        }catch(_){/* Planning guidance must not prevent saving diagnosis evidence. */}
      }
    }
  });
}
/* Retained legacy helpers are used by existing paper/simulation tooling only.
 * No app entry routes to this adaptive screen; saved runs restart above. */
function screenLegacyPlacement(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const d=S._diag;
  if(!d){ S.view='town'; save(); render(); return; }
  /* S._diag는 저장된다. 예전 형식(나이 단계 이전, 또는 세부 진단이 없던
     v1)의 진행 중 상태로 돌아오면 새 사다리(49칸)·새 필드(log 등)와 안
     맞으니 처음부터 다시 시작한다. */
  if(d.stage===undefined||typeof d.lo!=='number'||typeof d.hi!=='number'||!Array.isArray(d.log)){ startPlacement(); return; }

  const CORE=window.NM_PLACEMENT_CORE;
  const back=()=>{ S._diag=null; S.view='town'; save(); render(); };

  /* ── 나이 고르기 ── */
  if(d.stage==='age'){
    const opts=PLACEMENT_AGES.map(o=>{
      const lab=placementAgeLabel(o);
      return `<button class="nm-dg-age" data-entry="${placementAgeEntry(o)}" data-age="${o.key}">
        <span class="nm-dg-age-ico">${o.emoji}</span>
        <span class="nm-dg-age-txt"><b>${esc(L(lab.band))}</b><small>${esc(L(lab.name))}</small></span>
      </button>`;}).join('');
    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="dgBack">${t('back')}</button>
      <div class="nm-unit-title">🧭 ${lk('진단하기','Level Check','水平测评')}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap nm-dg-wrap">
      <div class="nm-card center">
        <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
        <div class="nm-card-h">${lk('지금 몇 살이에요?','How old are you now?','现在几岁了呢？')}</div>
        <p class="nm-dg-ask">${lk('나이에 맞는 문제부터 물어볼게요. 몇 문제만 풀면 끝나요.',
          'We will start with questions that fit your age. Just a few questions.',
          '我们从适合你年龄的题目开始，只要几道题就好。')}</p>
        <button class="nm-dg-gradeask" id="dgGradeAsk">
          <span class="nm-dg-gradeask-ic" aria-hidden="true">📚</span>
          <span class="nm-dg-gradeask-txt"><b>${lk('지금 몇 학년 연산을 하고 있어요?','What grade’s arithmetic are you on now?','现在在做几年级的运算？')}</b>
            <small>${lk('학년을 고르면 그 자리에서 시작하거나, 짧게 확인하고 시작해요.','Pick the grade — start right there, or take a short check first.','选好年级，可以直接从那里开始，也可以先简单确认再开始。')}</small></span>
        </button>
        <div class="nm-dg-or">${lk('또는 나이로 고르기','Or choose by age','或按年龄选择')}</div>
        <div class="nm-dg-ages">${opts}</div>
        <a class="nm-dg-selfpick nm-dg-paper" href="level-test.html?lang=${S.lang}" target="_blank" rel="noopener">📝 ${lk('종이로 보는 표준 진단지 (인쇄)','Standard paper test (print)','纸质标准测评卷（打印）')}</a>
        <button class="nm-dg-selfpick" id="dgSelfPick">🎯 ${lk('진단 없이 직접 고를래요','Skip the check — pick myself','不测评，自己选')}</button>
        <button class="nm-dg-again" id="dgSkip">${lk('잘 모르겠어요 · 건너뛰기','Not sure · Skip','不太清楚 · 跳过')}</button>
      </div>
    </div>`;
    $('#dgBack').onclick=back;
    scr.querySelectorAll('.nm-dg-age').forEach(b=>{
      b.onclick=()=>{ d.age=b.dataset.age; placementSetEntry(d, +b.dataset.entry);
        d.stage='q'; save(); screenPlacement(); };
    });
    /* 건너뛰기 = 예전 그대로 맨 아래 칸부터 */
    $('#dgSkip').onclick=()=>{ d.age='skip'; placementSetEntry(d, 0); d.stage='q'; save(); screenPlacement(); };
    $('#dgSelfPick').onclick=()=>{ S._diag=null; S.view='startpick'; save(); render(); };
    $('#dgGradeAsk').onclick=()=>{ d.stage='grade'; d.gradePick=null; save(); screenPlacement(); };
    return;
  }

  /* ── 지금 하는 학교 학년 연산 고르기(2026-09-28) — 고른 뒤 "이 과정부터" 또는 "짧게 확인하고" ── */
  if(d.stage==='grade'){
    const pick=PLACEMENT_GRADES.find(g=>g.key===d.gradePick)||null;
    const chips=PLACEMENT_GRADES.map(g=>{
      const n=placementGradeCourseNum(g);
      if(n==null||!(window.NM_COURSES||{})['C'+n]) return '';
      return `<button class="nm-dg-grade${pick&&pick.key===g.key?' on':''}" data-g="${g.key}" aria-pressed="${pick&&pick.key===g.key?'true':'false'}">${esc(L(g.label))}</button>`;
    }).join('');
    let preview='';
    if(pick){
      const key=placementGradeCourseKey(pick), c=(window.NM_COURSES||{})[key];
      const tierDef=c?roadTierInfo(c.tier):null;
      const num=String(key).replace(/^C/,'');
      preview=`<div class="nm-dg-gradeprev" style="--acc:${tierDef?tierDef.accent:'var(--blue)'}">
        <small>${lk(`${L(pick.label)} 연산이면 여기서 시작해요`,`For ${L(pick.label)} arithmetic, start here`,`${L(pick.label)}的运算，从这里开始`)}</small>
        <b>${lk('과정','Course','课程')} ${num}${c?` · ${esc(L(c.title))}`:''}</b>
        ${tierDef?`<span>${esc(L(tierDef.name))}</span>`:''}
        <em>${lk('우리 과정은 학교 진도보다 앞서 있어서, 단계 이름에 적힌 나이·학년과 다를 수 있어요.',
          'Our courses run ahead of school, so the age or grade in a stage name may differ.',
          '我们的课程比学校进度靠前，阶段名里的年龄·年级可能不同。')}</em>
      </div>
      <button class="nm-btn full" id="dgGradeStart">🚩 ${lk('이 과정부터 시작','Start from this course','从这个课程开始')}</button>
      <button class="nm-btn full ghost" id="dgGradeCheck">🧭 ${lk('짧게 확인하고 시작','Take a short check first','先简单确认再开始')}</button>
      <p class="nm-dg-free">${lk('짧게 확인하면 이 과정 근처부터 몇 문제만 물어봐요. 어느 쪽이든 나중에 자유롭게 바꿀 수 있어요.',
        'The short check asks just a few questions starting near this course. Either way, you can change it freely later.',
        '简单确认只会从这个课程附近问几道题。不管选哪个，以后都可以自由更改。')}</p>`;
    }
    scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="dgBack">${t('back')}</button>
      <div class="nm-unit-title">🧭 ${lk('진단하기','Level Check','水平测评')}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap nm-dg-wrap">
      <div class="nm-card center">
        <div class="nm-card-h">${lk('지금 몇 학년 연산을 하고 있어요?','What grade’s arithmetic are you on now?','现在在做几年级的运算？')}</div>
        <p class="nm-dg-ask">${lk('학교 학년이 아니라, 지금 풀고 있는 연산이 몇 학년 것인지 골라요.',
          'Not your school year — pick the grade of the arithmetic you are working on now.',
          '不是学校的年级，而是现在正在做的运算属于几年级。')}</p>
        <div class="nm-dg-grades" role="group" aria-label="${lk('학년','Grade','年级')}">${chips}</div>
        ${preview}
        <button class="nm-dg-again" id="dgGradeBack">${lk('나이로 고를래요','Choose by age instead','改为按年龄选')}</button>
      </div>
    </div>`;
    $('#dgBack').onclick=back;
    $('#dgGradeBack').onclick=()=>{ d.stage='age'; d.gradePick=null; save(); screenPlacement(); };
    scr.querySelectorAll('.nm-dg-grade').forEach(b=>{
      b.onclick=()=>{ d.gradePick=b.dataset.g; save(); screenPlacement();
        const s=$('#dgGradeStart'); if(s) s.scrollIntoView({block:'nearest'}); };
    });
    if(pick){
      const key=placementGradeCourseKey(pick);
      /* 시작점 고르기(startpick)와 같은 모양으로 저장한다 — 로드맵이 "내가 고른 시작점"으로 표시 */
      $('#dgGradeStart').onclick=()=>{
        S.placement={ at:Date.now(), course:key, self:true, grade:pick.key,
          asked:0, correct:0, profile:[], weak:[], slow:[] };
        S._diag=null; S._roadFocus=key; S.view='courseroad'; save(); render();
      };
      /* 짧게 확인 = 기존 적응형 진단을 그 과정의 사다리 칸에서 시작(유아·못 찾으면 맨 아래 칸) */
      $('#dgGradeCheck').onclick=()=>{
        const CORE=window.NM_PLACEMENT_CORE;
        const idx=CORE?CORE.rungIndexOfCourse(placementLadder(), key):-1;
        d.grade=pick.key; d.age=null; placementSetEntry(d, idx>=0?idx:0); d.stage='q'; save(); screenPlacement();
      };
    }
    return;
  }

  /* ── 위아래로 좁히기(bracketing) — 경계를 찾으면 세부 진단으로 넘어간다 ── */
  if(d.stage==='q'){
    const ladder=placementLadder();
    const nextIdx=placementNext(d);
    if(nextIdx===null || (d.asked-(d.askedBase||0))>=CORE.MAX_Q){
      placementAfterBracketing(d); save(); screenPlacement(); return;
    }
    renderPlacementQuestion(d, ladder[nextIdx], nextIdx, 'q');
    return;
  }

  /* ── 세부 진단(스킬 체크) ── */
  if(d.stage==='fine'){
    if(d.fineIdx>=d.fineThreads.length || d.fineAsked>=CORE.FINE_MAX_Q){
      placementFinish(d); save(); screenPlacement(); return;
    }
    const threadId=d.fineThreads[d.fineIdx];
    const rung={course:(d.zone&&d.zone[d.zone.length-1])||d.K||'C1', thread:threadId, level:1};
    renderPlacementQuestion(d, rung, null, 'fine');
    return;
  }

  /* ── 결과 ── */
  if(d.stage==='result'){
    renderPlacementResult(d);
    return;
  }
  /* 알 수 없는 stage — 안전하게 다시 시작 */
  startPlacement();
}

/* 문항 화면(위아래 좁히기·세부 진단 공용). stage='q'면 idx가 사다리 칸
   번호(위아래 좁히기에 반영), stage='fine'이면 idx는 null(사다리 칸이
   아니라 구역 재료를 그냥 순서대로 묻는 것이라 lo/hi에 반영하지 않는다). */
function renderPlacementQuestion(d, rung, idx, stage){
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const CORE=window.NM_PLACEMENT_CORE;
  const isFine=stage==='fine';
  if(!d.cur){ d.cur=placementProblem(rung, isFine?(1000+d.fineIdx):d.asked, d.run); d.qStart=Date.now(); }
  const cur=d.cur;
  const th=(window.NM_THREADS||{})[rung.thread];
  /* tex가 있으면 예전 그대로 식 + 넘패드. 수의 나라 문제는 tex가 없고 그림을
     만져야 답이 나오므로 기존 위젯 렌더러(runPracticeWidget과 같은 길)를 쓴다. */
  const useWidget = !cur.tex && cur.widget && cur.widget!=='numpad' && window.NM_WIDGETS;
  const isMulti = Array.isArray(cur.answer);

  const stepNum = isFine ? (d.fineAsked+1) : (d.asked-(d.askedBase||0)+1);
  const totalDots = isFine ? Math.min(CORE.FINE_MAX_Q, d.fineThreads.length) : CORE.MAX_Q;
  const curDot = isFine ? d.fineAsked : (d.asked-(d.askedBase||0));
  const headerTitle = isFine ? lk('세부 진단','Skill check','细项测评') : lk('진단하기','Level Check','水平测评');
  const canStop = isFine && d.fineAsked>=3;

  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="dgBack">${t('back')}</button>
    <div class="nm-unit-title">🧭 ${headerTitle}</div>
  </div>
  <div class="nm-step-body">
    <div class="nm-dialog">
      ${isFine?`<p class="nm-dg-finesub">${lk('몇 문제만 더 풀면 어떤 걸 잘하는지 알 수 있어요','A few more and we will know your strong skills','再做几题就能知道你擅长什么')}</p>`:''}
      <div class="nm-dg-step">${lk(`${stepNum}번째 문제`,`Question ${stepNum}`,`第${stepNum}题`)}${th?` · ${esc(L(th.name))}`:''}</div>
      <div class="nm-prog">${dots(totalDots,curDot)}</div>
      <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
      <div class="nm-bubble">${esc(L(cur.prompt))}</div>
      ${useWidget?`<div id="dgWidget" class="nm-lab-widget"></div>`:`
      <div class="nm-lab-expr">${labExprHtml(cur.tex)}</div>
      ${isMulti?`<p class="nm-dg-multihint">${lk('답이 여러 개면 쉼표(,)로 나눠 써요','Separate multiple answers with commas','多个答案用逗号分开')}</p>`:''}
      <div class="nm-numpad-screen" id="dgScreen">&nbsp;</div>
      <div class="nm-numpad" id="dgPad"></div>`}
      ${canStop?`<button class="nm-dg-again" id="dgStop">${lk('그만하고 결과 보기','Stop and see result','结束并看结果')}</button>`:''}
    </div>
  </div>`;
  $('#dgBack').onclick=()=>{ S._diag=null; S.view='town'; save(); render(); };
  if(canStop) $('#dgStop').onclick=()=>{ placementFinish(d); save(); screenPlacement(); };
  renderMath(scr);

  const submit=ok=>{
    const sec=Math.max(0, Math.round((Date.now()-(d.qStart||Date.now()))/1000));
    if(stage==='q'){
      placementGrade(d, idx, ok);
    } else {
      d.fineIdx=(d.fineIdx||0)+1; d.fineAsked=(d.fineAsked||0)+1;
      d.asked=(d.asked||0)+1; if(ok) d.correct=(d.correct||0)+1;
    }
    placementLog(d, rung.thread, rung.level, ok, sec);
    d.cur=null; d.qStart=null;
    save();
    if(ok) playSfx('success');
    setTimeout(()=>screenPlacement(), ok?520:820);
  };
  if(useWidget){
    NM_WIDGETS.render(cur,$('#dgWidget'),val=>{
      const ok = isMulti
        ? Array.isArray(val) && val.length===cur.answer.length && val.every((v,i)=>+v===cur.answer[i])
        : +val===cur.answer;
      submit(ok);
    });
    return;
  }
  const screenEl=$('#dgScreen');
  let inp='';
  buildNumpad($('#dgPad'),val=>{
    if(val==='ok'){
      if(inp===''||inp==='-') return;
      if(isMulti){
        const parts=inp.split(',').map(s=>s.trim()).filter(s=>s!=='');
        const nums=parts.map(parseFloat);
        submit(nums.length===cur.answer.length && nums.every((v,i)=>v===cur.answer[i]));
      } else {
        submit(parseFloat(inp)===cur.answer);
      }
      return;
    }
    if(val==='del') inp=inp.slice(0,-1);
    else if(val==='-') inp=applyMinusKey(inp);
    else if(val===','){ if(inp!==''&&!inp.endsWith(',')) inp+=','; }
    else if(inp.replace(/[-,]/g,'').length<(isMulti?16:6)&&!(val==='.'&&inp.split(',').pop().includes('.'))) inp+=val;
    screenEl.textContent=inp||' ';
  },{decimal:isMulti?true:!Number.isInteger(cur.answer), negative:isMulti?true:!!cur.negative, comma:isMulti});
}

/* 결과 화면 — S.placement는 placementFinish()(진단) 또는 screenStartPick()
   (직접 고르기)가 채운다. */
function renderPlacementResult(d){
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const key=S.placement.course;
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
      ${(function(){ /* 단계 이름(2026-09-08) — 광고·학습지 표지와 같은 말로 "지금 여기"를 찍는다 */
        const f=window.NM_STAGE_OF_COURSE, st=f?f(num):null;
        return st?`<div class="nm-dg-stage">${st.icon||''} ${esc(L(st.name).split(' — ')[0])} · ${esc(L(st.band))}</div>`:'';
      })()}
      ${(function(){ /* 이 과정이 학교로 치면 몇 학년 연산인지(2026-09-28) — PLACEMENT_GRADES 표에서 */
        const g=gradeBandOfCourse(key); if(!g) return '';
        const gl=esc(L(g.label));
        return `<div class="nm-dg-gradeband">📚 ${lk(`학교 진도로 치면 <b>${gl}</b> 연산 무렵이에요`,`In school terms, about <b>${gl}</b> arithmetic`,`按学校进度，大约是<b>${gl}</b>的运算`)}</div>`;
      })()}
      ${placementAgeNoteHtml(S.placement,lk)}
      <div class="nm-score">${S.placement.correct||0} / ${S.placement.asked||0}</div>
      <p class="nm-wsh-sentence">${lk('맞힌 문제까지가 이미 익숙한 곳이에요. 여기서부터 새로 배우면 딱 맞아요.','Everything you answered is already comfortable — starting here fits just right.','答对的部分已经很熟练了，从这里开始正好。')}</p>
      ${placementSkillListHtml(S.placement.profile,lk)}
      ${S.placement.capped&&d&&d.ceil!=null?`<div class="nm-dg-capped">
        <p>${lk(`과정 ${d.ceil}까지 모두 맞혔어요! 더 어려운 문제도 풀어 볼래요?`,`You got everything up to Course ${d.ceil}! Want to try harder ones?`,`到课程${d.ceil}全部答对！想挑战更难的题吗？`)}</p>
        <button class="nm-btn full" id="dgHigher">⛰️ ${lk('한 단계 더 올라가 보기','Go one stage higher','再往上一个阶段')}</button>
      </div>`:''}
      <p class="nm-dg-free">${lk('이건 권유일 뿐이에요. 과정은 언제든 자유롭게 골라도 좋아요.','This is only a suggestion — you can pick any course you like, any time.','这只是建议，任何时候都可以自由选择课程。')}</p>
      <button class="nm-btn full" id="dgGoRoad">🛤️ ${lk('로드맵에서 이 과정 보기','See this course on the road','在路线图上看这个课程')}</button>
      <button class="nm-btn full ghost" id="dgPickInstead">🎯 ${lk('다른 곳에서 시작할래요 · 직접 고르기','Start somewhere else · pick myself','想从别处开始 · 自己选')}</button>
      <button class="nm-dg-again" id="dgAgain">${lk('다시 진단하기','Take it again','再测一次')}</button>
    </div>
  </div>`;
  $('#dgBack').onclick=()=>{ S._diag=null; S.view='town'; save(); render(); };
  $('#dgGoRoad').onclick=()=>{ S._diag=null; S._roadFocus=key; S.view='courseroad'; save(); render(); };
  $('#dgPickInstead').onclick=()=>{ S._diag=null; S.view='startpick'; save(); render(); };
  $('#dgAgain').onclick=()=>startPlacement();
  const hi=$('#dgHigher');
  if(hi) hi.onclick=()=>{
    const nc=placementCeilCourse(d.ceil);
    if(nc==null||nc<=d.ceil) return;
    d.ceil=nc; d.cap=placementCapFor(nc); d.hi=d.cap; d.capped=false;
    d.askedBase=d.asked||0; d.ups=0; d.cur=null; d.qStart=null; d.zone=null; d.stage='q';
    save(); screenPlacement();
  };
}
/* 결과 화면에서 "몇 살이라고 했는지"를 한 줄로 되짚어 준다. 건너뛴/직접
   고른 경우엔 없음(둘 다 age가 없거나 'skip'). */
function placementAgeNoteHtml(d,lk){
  if(d.grade){ /* "지금 몇 학년 연산" 으로 들어온 경우(2026-09-28) */
    const g=PLACEMENT_GRADES.find(x=>x.key===d.grade);
    return g?`<div class="nm-dg-agenote">📚 ${lk('고른 학년 연산','Grade picked','所选年级运算')} · ${esc(L(g.label))}</div>`:'';
  }
  if(!d.age||d.age==='skip')return'';
  const opt=PLACEMENT_AGES.find(o=>o.key===d.age);
  if(!opt)return'';
  const lab=placementAgeLabel(opt);
  return `<div class="nm-dg-agenote">${opt.emoji} ${lk('고른 나이','Age picked','所选年龄')} · ${esc(L(lab.band))}</div>`;
}

/* ============================================================
   시작점 고르기 (S.view==='startpick') — 진단 없이 과정을 직접 골라
   시작한다(원장 지시 "시작 스스로 선택하기"). ROAD_TIERS 순서로 접을 수
   있는 구간마다 과정 카드(제목·드릴 재료 이름·예시 문제·시작 버튼)를
   늘어놓는다. 예시 문제는 고정 시드(pick+과정키)라 새로고침해도 같은
   문제 — "미리보기"라는 인상을 주려는 것이지 실제로 풀 필요는 없다.
   ============================================================ */
function screenStartPick(){
  if(townCleanup){townCleanup();townCleanup=null;}
  clearInterval(mgTimer);mgTimer=null;
  const scr=$('#screen');
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;

  if(!window.NM_COURSES||!window.NM_THREADS){
    scr.innerHTML=`<div class="nm-unit-bar"><button class="nm-back" id="spBack">← ${navigationLabel('town')}</button>
      <div class="nm-unit-title">🎯 ${lk('시작점 고르기','Pick your start','选择起点')}</div></div>
      <div class="nm-step-body"><div class="nm-card">${lk('과정 자료를 아직 불러오지 못했어요.','Course data is not ready yet.','课程数据还没准备好。')}</div></div>`;
    $('#spBack').onclick=()=>{S.view='town';save();render();};
    return;
  }

  const curKey=currentCourseKey();
  const curCourse=(window.NM_COURSES||{})[curKey];
  const curTier=curCourse?curCourse.tier:null;
  const list=roadCourseList();
  const specById={};
  (window.NM_COURSE_SPEC||[]).forEach(s=>{ specById[s.id]=s; });

  /* 과정의 "첫 숫자 답 드릴"로 미리보기 문제 하나(고정 시드) — buildLadder()와
     같은 고르는 기준(생성기 답이 숫자 하나)을 쓴다. tex 없는 문제(수의 나라
     위젯형)는 미리보기를 건너뛴다. */
  function sampleFor(spec, key){
    if(!spec || !window.NM_PLACEMENT_CORE) return null;
    const drills=spec.drills||[];
    for(let i=0;i<drills.length;i++){
      const id=drills[i];
      if(!window.NM_PLACEMENT_CORE.isScalarDrill(id)) continue;
      const th=(window.NM_THREADS||{})[id];
      const gen=(window.NM_TGEN||{})[th&&th.gen];
      if(!gen) continue;
      const lvl=(th.levels||[]).find(l=>l.id===1)||th.levels[0];
      try{
        const rng=NM_RNG.mulberry32(NM_RNG.hashSeed('pick'+key));
        const p=gen(lvl.params||{}, rng);
        if(p && p.tex) return p;
      }catch(e){}
    }
    return null;
  }

  function courseCardHtml(x){
    const key=x.key, c=x.c, spec=specById[x.num];
    const built=courseBuilt(c);
    const names=(spec?spec.drills:[]).slice(0,3).map(id=>{
      const th=(window.NM_THREADS||{})[id];
      return th?esc(L(th.name)):esc(id);
    });
    const sample=built?sampleFor(spec,key):null;
    return `<div class="nm-sp-card${built?'':' off'}">
      <div class="nm-sp-num">${lk('과정','Course','课程')} ${x.num}</div>
      <div class="nm-sp-title">${esc(L(c.title))}</div>
      ${names.length?`<div class="nm-sp-drills">${names.join(' · ')}</div>`:''}
      ${sample?`<div class="nm-sp-sample">${labExprHtml(sample.tex)}</div>`:''}
      ${built
        ? `<button class="nm-btn small full nm-sp-go" data-c="${key}">${lk('여기서 시작','Start here','从这里开始')}</button>`
        : `<span class="nm-sp-soon">${lk('준비 중','Coming soon','准备中')}</span>`}
    </div>`;
  }

  let body='';
  ROAD_TIERS.forEach(tierDef=>{
    const items=list.filter(x=>x.c.tier===tierDef.key);
    if(!items.length) return;
    const open=tierDef.key===curTier;
    body+=`<details class="nm-sp-tier"${open?' open':''} style="--acc:${tierDef.accent}">
      <summary class="nm-sp-tier-h">
        <span class="nm-sp-tier-bar"></span>
        <span class="nm-sp-tier-txt"><b>${esc(L(tierDef.name))}</b><small>${esc(L(tierDef.band))}</small></span>
      </summary>
      <div class="nm-sp-grid">${items.map(courseCardHtml).join('')}</div>
    </details>`;
  });

  scr.innerHTML=`<div class="nm-cr-wrap">
    <div class="nm-cr-header">
      <button class="nm-back" id="spBack">← ${navigationLabel('town')}</button>
      <div class="nm-cr-titlerow"><div class="nm-cr-title">🎯 ${lk('시작점 고르기','Pick your start','选择起点')}</div></div>
      <div class="nm-cr-sub">${lk('진단 없이 원하는 과정에서 바로 시작할 수 있어요. 언제든 바꿔도 돼요.','Start at any course without a check-up. You can change it any time.','不用测评也能从想要的课程开始，随时都可以换。')}</div>
    </div>
    <div class="nm-cr-body nm-sp-body">${body}</div>
  </div>`;
  $('#spBack').onclick=()=>{S.view='town';save();render();};
  scr.querySelectorAll('.nm-sp-go').forEach(b=>{
    b.onclick=()=>{
      const key=b.dataset.c;
      if(!applyLearningSettings({courseKey:key,sessionIndex:1})){
        toast(lk(S.adminPlan?'학원에서 정한 진도예요. 변경은 학원에 요청해 주세요.':'저장하지 못했어요. 다시 시도해 주세요.',
          S.adminPlan?'Ask your academy to change the assigned plan.':'Could not save. Please try again.',
          S.adminPlan?'请联系学院更改学习计划。':'未能保存，请重试。'),true);return;
      }
      S._roadFocus=key; S.view='courseroad'; save(); render();
    };
  });
  renderMath(scr);
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
  <div class="nm-title is-3d-pending" aria-hidden="true">
    <div class="nm-title-card">
      <!-- 로고·캐릭터·인사·칩을 한 덩어리(.nm-title-hero)로 묶는다 — 가로 2단 배치에서 왼쪽 칸이
           오른쪽 메뉴 높이에 맞춰 행이 늘어나며 위아래로 벌어지던 것을 막는다(2026-09-16). -->
      <div class="nm-title-hero">
      <div class="nm-title-logo">
        <!-- data-text는 CSS ::before가 같은 글자를 한 겹 더 찍어 "흰 테두리 뒤 + 그라데이션 앞"을
             만드는 데 쓴다(2026-09-16). 한 요소에 text-stroke와 background-clip:text를 같이 주면
             테두리가 그라데이션을 덮어 흰 글자로 보인다 — 인트로 영상 로고와 같은 결로 맞춘 것. -->
        <div class="nm-title-logo-kr" data-text="${lk('수의 마법','Numbers of Magic','数字魔法')}">${lk('수의 마법','Numbers of Magic','数字魔法')}</div>
        <div class="nm-title-logo-sub">${lk('NUMBERS OF MAGIC','NUMBER VILLAGE · Doc-T','NUMBERS OF MAGIC')}</div>
      </div>
      <!-- 캐릭터 크기 88→136(2026-09-16, 원장 "캐릭터를 더 키워야지"). 원본 해상도로 크게 그려야
           흐려지지 않는다 — CSS 확대가 아니라 렌더 크기 자체를 키운다. -->
      <div class="nm-title-char">${window.renderPartyHtml?window.renderPartyHtml(avatarProfile(),S.character,136):''}</div>
      <div class="nm-title-hello">${S.name?esc(S.name)+' — ':''}${lk('다시 만나서 반가워요!','Welcome back!','欢迎回来！')}</div>
      <div class="nm-title-stats">
        <span class="nm-title-chip">🪙 ${S.coins}</span>
        <button type="button" class="nm-title-chip nm-attendance-open" id="ttAttendance">📅 ${lk(`출석 ${S.attend?.days||0}일`,`Stamps · ${S.attend?.days||0} days`,`出勤 ${S.attend?.days||0}天`)}</button>
        ${badge?`<span class="nm-title-chip gold">🏅 ${esc(badge.label)}</span>`:''}
      </div>
      ${lineageBadgeRowHtml()}
      </div>
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
            <small>${lk('수를 체험해요','Experience numbers','体验数字')}</small>
          </button>
          <button class="nm-title-blk nm-gloss" id="ttSheet">
            <span class="nm-title-blk-ico">📄</span>
            <b>${lk('학습지 모드','Worksheet Mode','学习单模式')}</b>
            <small>${lk('종이로 공부해요','Study on paper','用纸来学习')}</small>
          </button>
          <button class="nm-title-blk nm-gloss" id="ttRoad">
            <span class="nm-title-blk-ico">🛤️</span>
            <b>${lk('연산 로드맵','Course Road','运算路线图')}</b>
            <small>${lk('순서대로 공부해요','Study in order','按顺序学习')}</small>
          </button>
        </div>
        <div class="nm-title-sub-row">
          <button class="nm-title-pill" id="ttStory">🗺 ${lk('스토리 모드','Story Mode','故事模式')}</button>
          <button class="nm-title-pill" id="ttDex">📖 ${lk('기호 도감','Symbol Dex','符号图鉴')}</button>
          <button class="nm-title-pill" id="ttHist">🏛️ ${lk('수학사 퀴즈','Math History Quiz','数学史问答')}</button>
          <button class="nm-title-pill" id="ttMz">📰 ${lk('매거진','Magazine','杂志')}</button>
        </div>
      </div>
    </div>
  </div>`;
  $('#ttAttendance')?.addEventListener('click',e=>showAttendanceBook(e.currentTarget));
  $('#ttContinue').onclick=()=>S.learningPlan&&!S.adminPlan?enterCourseNode(currentCourseKey()):enterContinueUnit(uid);
  $('#ttDiag').onclick=()=>startPlacement();
  $('#ttGame').onclick=()=>{ S.view='town'; save(); render(); };
  $('#ttSheet').onclick=()=>{ S.view='exam'; save(); render(); };
  $('#ttRoad').onclick=()=>{ S.view='courseroad'; save(); render(); };
  $('#ttStory').onclick=()=>{ S.view='roadmap'; save(); render(); };
  $('#ttDex').onclick=()=>{ S._dexFrom='title'; S.view='symboldex'; save(); render(); };
  $('#ttHist').onclick=()=>{ S.view='histquiz'; save(); render(); };
  $('#ttMz').onclick=()=>{ S._mzOpen=null; S.view='magazine'; save(); render(); };
  mountTitle3DInto(scr, summary, badge);
}
/* 3D 모드 선택 화면(2026-09-26, 원장 "학습지 모드, 게임모드 이런것들 고르는 화면서 3d로 제대로 구현") — app/title3d/title3d.js.
   정상 로딩 중에는 옛 2D 타이틀을 숨기고 준비 화면만 보인다. 고르면 2D 버튼을 그대로 누른다 —
   이동 규칙(이어서 모험·진단·게임·학습지 …)이 한 곳(위 onclick)에만 있게. WebGL 이 없을 때만 2D 를 드러낸다. */
/* 모험 책상 배경음 — promo 미리보기(showreel-15s-vertical)와 같은 음악을 뽑아 반복한다.
   브라우저가 자동 재생을 막으면 책상을 처음 누를 때 시작한다. 끈 선택은 이 기기에 기억한다. */
const DESK_MUSIC_KEY='nm_desk_music_v1';
function mountDeskMusic(box){
  let on=true;try{on=localStorage.getItem(DESK_MUSIC_KEY)!=='off';}catch(e){}
  const audio=new Audio('assets/audio/desk/promo-ambience.m4a?v=20261022');
  audio.loop=true;audio.volume=0;audio.preload='auto';
  // Pause during narration (also works when iOS ignores volume writes).
  // Guard pending play promises so leaving the desk cannot restart its music.
  let fade=0,disposed=false,pending=false,playRun=0,needsGesture=false;
  const blocked=()=>disposed||!on||document.hidden||!!window.NM_VOICE?.isSpeaking();
  const fadeIn=()=>{clearInterval(fade);let step=0;fade=setInterval(()=>{if(blocked()){stop();return;}step++;audio.volume=Math.min(.35,step*.035);if(step>=10)clearInterval(fade);},60);};
  const stop=()=>{playRun++;pending=false;clearInterval(fade);audio.pause();audio.volume=0;};
  const start=()=>{if(blocked()||needsGesture||pending||!audio.paused)return;const ticket=++playRun;pending=true;audio.volume=0;Promise.resolve(audio.play()).then(()=>{if(ticket!==playRun)return;if(blocked()){stop();return;}pending=false;fadeIn();}).catch(()=>{if(ticket===playRun){pending=false;needsGesture=true;}});};
  const lk=(k,e,z)=>S.lang==='ko'?k:S.lang==='en'?e:z;
  const btn=document.createElement('button');btn.type='button';btn.className='nm-desk-music';
  btn.setAttribute('aria-label',lk('배경음','Background music','背景音乐'));
  const sync=()=>{btn.textContent=on?'♪':'×♪';btn.setAttribute('aria-pressed',String(on));btn.setAttribute('aria-label',on?lk('배경음 끄기','Turn off background music','关闭背景音乐'):lk('배경음 켜기','Turn on background music','开启背景音乐'));};
  btn.onclick=()=>{on=!on;needsGesture=false;try{localStorage.setItem(DESK_MUSIC_KEY,on?'on':'off');}catch(e){}sync();if(on)start();else stop();};
  sync();box.appendChild(btn);
  const first=e=>{if(e.target!==btn){needsGesture=false;start();}};
  const visible=()=>{if(document.hidden)stop();else start();};
  box.addEventListener('pointerdown',first);box.addEventListener('keydown',first);
  document.addEventListener('visibilitychange',visible);
  const speechWatch=setInterval(()=>{if(blocked()){if(!audio.paused||pending)stop();}else start();},150);
  start();
  return ()=>{disposed=true;clearInterval(speechWatch);stop();audio.removeAttribute('src');audio.load();
    box.removeEventListener('pointerdown',first);box.removeEventListener('keydown',first);
    document.removeEventListener('visibilitychange',visible);btn.remove();};
}
function mountTitle3DInto(scr, summary, badge){
  const card=scr.querySelector('.nm-title');
  if(!card)return;
  const BTN={continue:'ttContinue',diag:'ttDiag',game:'ttGame',sheet:'ttSheet',road:'ttRoad',story:'ttStory',dex:'ttDex',hist:'ttHist',magazine:'ttMz'};
  const box=document.createElement('div');
  box.className='nm-title3d';
  box.innerHTML=`<div class="nm-3d-loading title" role="status">
    <span class="nm-3d-loading-mark" aria-hidden="true">✦</span>
    <b>${S.lang==='ko'?'모험 책상을 여는 중…':S.lang==='en'?'Opening your adventure desk…':'正在打开冒险桌面…'}</b>
  </div>`;
  scr.appendChild(box);
  const revealFallback=()=>{
    box.remove();
    card.classList.remove('is-3d-pending');
    card.removeAttribute('aria-hidden');
  };
  const chips=[];   /* 동전은 모듈이 coins 로 따로 그린다 */
  chips.push({action:'attendance',icon:'📅',text:{ko:`출석 ${S.attend?.days||0}일`,en:`Stamps · ${S.attend?.days||0} days`,zh:`出勤 ${S.attend?.days||0}天`}});
  if(badge)chips.push({icon:'🏅',text:badge.label,gold:true});
  import('./title3d/title3d.js?v=20261024-cardbook1').then(m=>{
    const choices=m.DEFAULT_CHOICES.map(c=>c.id==='continue'&&summary?Object.assign({},c,{sub:summary}):c);
    return m.mountTitle3D(box,{
      lang:S.lang, choices,
      onPick:id=>{const b=document.getElementById(BTN[id]);if(b)b.click();},
      onChipPick:(action,button)=>{if(action==='attendance')showAttendanceBook(button);},
      player:px=>window.renderPartyHtml?window.renderPartyHtml(avatarProfile(),S.character,px):'',
      name:avatarName(), coins:S.coins, chips, extraHtml:lineageBadgeRowHtml()
    });
  }).then(ctl=>{
    if(!ctl){revealFallback();return;}
    if(!box.isConnected){ctl.dispose();return;}
    const loading=box.querySelector('.nm-3d-loading');
    if(loading)loading.remove();
    card.classList.remove('is-3d-pending');
    card.classList.add('is-3d-covered');
    card.setAttribute('aria-hidden','true');
    const prev=townCleanup,stopMusic=mountDeskMusic(box);
    townCleanup=()=>{ if(prev)prev(); stopMusic(); ctl.dispose(); box.remove(); };
  }).catch(revealFallback);
}
/* 타이틀 화면 배지 줄(§6 규칙4) — 완주한 계보의 문장(紋章)을 나열, 하나도 없으면 빈 문자열. */
function lineageBadgeRowHtml(){
  const keys=Object.keys(S.lineageBadges||{});
  if(!keys.length)return'';
  const map=lineagesMap();
  const chips=keys.map(k=>{const line=map[k];return line?`<span class="nm-lin-chip big" title="${esc(L(line.name))}">${line.emblem}</span>`:'';}).join('');
  return chips?`<div class="nm-title-lin-row">${chips}</div>`:'';
}
/* The explicit learning plan has its own position. Without one, retain the
   legacy admin/recent-study/diagnostic precedence. Completed work stays separate. */
function currentCourseKey(){
  if(!S.adminPlan&&S.learningPlan&&window.NM_PLAN_CONTROL){
    const at=NM_PLAN_CONTROL.position(window.NM_COURSES||{},S.learningPlan,weekKeyFor(new Date()));
    if(at&&(window.NM_COURSES||{})[at.courseKey])return at.courseKey;
  }
  const uid = mostRecentTouchedUnit();
  if(S.adminPlan&&(window.NM_COURSES||{})[S.adminPlan.courseKey]){
    const changed=Date.parse(S.adminPlan.updatedAt)||0;
    const recent=uid&&S.progress[uid];
    const actual=uid&&courseForUnit(uid);
    if(!recent||recent.touchedAt<=changed||!actual||+actual.slice(1)<+S.adminPlan.courseKey.slice(1))return S.adminPlan.courseKey;
  }
  if(uid){
    const cid = courseForUnit(uid);
    if(cid) return cid;
  }
  /* 진도가 전혀 없는데 진단(또는 직접 고르기)이 시작점을 정해 뒀으면 그 과정을
     "지금 여기"로 삼는다 — 로드맵의 지금 여기·다음 목표, 시작점 고르기의
     기본 펼침 탭이 이 값을 따른다. syncProgressUnlocks()는 캐릭터 해금 판정이라
     진단 시작점만으로 선물이 지급되지 않게 실제 완료 기록을 따로 확인한다. */
  if(S.placement && S.placement.course && (window.NM_COURSES||{})[S.placement.course]) return S.placement.course;
  return 'C1';
}
/* 미래 무료 선물은 네 과정의 실제 완료에만 지급한다. 기존 보유 항목은
   되잠그지 않으며 진단 시작점 선택·과정 방문만으로 새 항목을 열지 않는다. */
function syncProgressUnlocks(){
  if(!window.NM_COURSES || !window.NM_AVATAR) return;
  if(!S.character_unlocked) S.character_unlocked = {};
  if(!S.seenUnlocks) S.seenUnlocks = {};
  const newNumbers = [], newSymbols = [];
  (NM_CHARACTER_STATE.gifts||[]).forEach(gift=>{
    const course=NM_COURSES['C'+gift.course];
    if(!course||!courseConquered(course))return;
    const items=gift.type==='number'?NM_AVATAR.numbers:NM_AVATAR.symbols;
    const item=(items||[]).find(x=>String(x.id)===String(gift.id));
    const key=gift.type+'_'+gift.id;
    if(!item||S.character_unlocked[key])return;
    S.character_unlocked[key]=true;
    (gift.type==='number'?newNumbers:newSymbols).push(item);
  });
  if(!newNumbers.length && !newSymbols.length) return;
  save();
  /* 승급 순간(캐릭터-승급-설계.md §3, HANDOFF "캐릭터를 학습 흐름 더 넓게
     쓰기" §2) — 예전엔 toast() 한 줄로만 알렸다. 아이가 새로 온 친구를
     실제로 보게(내 아바타 옆에 나란히, renderPartyHtml) 마을 모달(§
     lineageBadgeOverlayHtml과 같은 #nm-gate-overlay 패턴)로 승격.
     seenUnlocks로 유닛당 1회만 — 로직은 그대로, 표시 방식만 바뀐다. */
  const toShow=[];
  newNumbers.forEach(item => {
    const sk = 'number_' + item.id;
    if(S.seenUnlocks[sk]) return;
    S.seenUnlocks[sk] = true;
    toShow.push({type:'number', id:item.id});
  });
  newSymbols.forEach(item => {
    const sk = 'symbol_' + item.id;
    if(S.seenUnlocks[sk]) return;
    S.seenUnlocks[sk] = true;
    toShow.push({type:'symbol', id:item.id});
  });
  save();
  if(toShow.length) showUnlockOverlay(toShow);
}
/* 새 친구 도착 모달 — 큐를 하나씩(동시에 여럿 열려도 겹쳐 뜨지 않게) 보여준다.
   #nmUnlockOverlay가 이미 떠 있으면 아무 것도 안 함(닫힐 때 스스로 다음 걸 연다). */
function unlockPreviewChar(item){
  const base=Object.assign({}, S.character);
  if(item.type==='number'){ base.number=item.id; delete base.symbol; }
  else { base.symbol=item.id; delete base.number; }
  return base;
}
function unlockOverlayHtml(item){
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const previewChar=unlockPreviewChar(item);
  const partyHtml=window.renderPartyHtml?window.renderPartyHtml(avatarProfile(),previewChar,96)
    :(window.renderNumiChar?window.renderNumiChar(previewChar,96):'');
  const line=esc(lk('새 친구가 왔어! 옷장에서 고르면 나랑 같이 다니는 친구가 돼.','A new friend arrived! Pick them in the closet and they will walk with you.','新朋友来了！在衣橱里选它，它就会陪你一起走。'));
  return `<div class="nm-gate-overlay nm-unlock-overlay" id="nmUnlockOverlay">
    <div class="nm-gate-card nm-unlock-card">
      <h3>${lk('새 친구가 도착했어요! ✨','A new friend arrived! ✨','新朋友到啦！✨')}</h3>
      <div class="nm-unlock-party">${partyHtml}</div>
      ${docStripHtml(40,line)}
      <button class="nm-btn full" id="nmUnlockOverlayClose">${lk('좋아요!','Nice!','太棒了！')}</button>
    </div>
  </div>`;
}
function showUnlockOverlay(queue){
  if(!queue || !queue.length) return;
  if($('#nmUnlockOverlay')) return; // 이미 하나 떠 있으면 닫힐 때 스스로 이어서 연다
  const item=queue.shift();
  document.body.insertAdjacentHTML('beforeend', unlockOverlayHtml(item));
  confetti(); playSfx('great-job');
  const close=()=>{ const m=$('#nmUnlockOverlay'); if(m)m.remove(); showUnlockOverlay(queue); };
  $('#nmUnlockOverlayClose').onclick=close;
  $('#nmUnlockOverlay').addEventListener('click', e=>{ if(e.target.id==='nmUnlockOverlay') close(); });
}
/* 그 과정에서 봉투에 담을 세션 — 마법이 있는 첫 세션(없으면 첫 세션). */
function primarySessionOf(course,courseKey,weekKey,scheduleOverride){
  const plan=scheduleOverride===undefined?highWeeklySchedule(courseKey):scheduleOverride;
  if(plan&&weekKey){
    const assigned=NM_HIGH_PACING.assignment(NM_COURSES,{...plan,startSession:plan.sessionIndex,weekKey});
    if(!assigned)return null;
    const source=assigned.weekLessons.flatMap(ref=>ref.sourceIndices.map(i=>NM_COURSES[ref.courseKey].sessions[i]));
    return {magic:[...new Set(source.flatMap(s=>s.magic||[]))],drills:source.flatMap(s=>s.test?s.pool||[]:s.drills||[]).concat(assigned.weekLessons.flatMap(ref=>ref.extraPractice||[])),assignedLessons:assigned.weekLessons};
  }
  if(course.studyPlan&&window.NM_HIGH_PACING){
    const start=S.adminPlan?.courseKey===courseKey?S.adminPlan.sessionIndex:null;
    const group=NM_HIGH_PACING.select(course,{startSession:start});
    if(group){
      const source=group.sourceIndices.map(i=>course.sessions[i]);
      return {magic:[...new Set(source.flatMap(s=>s.magic||[]))],drills:source.flatMap(s=>s.test?s.pool||[]:s.drills||[]).concat(group.extraPractice||[]),sourceIndices:group.sourceIndices};
    }
  }

  if(!course || !course.sessions) return null;
  const p=S.adminPlan;
  if(p&&p.courseKey===courseKey&&course.sessions[p.sessionIndex-1]){
    const s=course.sessions[p.sessionIndex-1];
    return s.test?{...s,drills:s.pool||[],magic:[]}:s;
  }
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
  const manual=!S.adminPlan&&S.learningPlan&&window.NM_PLAN_CONTROL;
  const settings=manual?effectiveLearningSettings(weekKey):null;
  const at=settings&&!settings.legacy?NM_PLAN_CONTROL.position(NM_COURSES,settings,weekKey):null;
  if(at&&!at.weekLessons.length)return null;
  const current=settings?settings.courseKey:currentCourseKey();
  const highPlan=settings?(NM_COURSES[settings.courseKey]?.studyPlan?settings:null):highWeeklySchedule(current);
  const courseKey = at?at.courseKey:highPlan?highPlan.courseKey:current;
  const course = NM_COURSES[courseKey];
  if(!course) return null;
  const source=at?.weekLessons.flatMap(ref=>ref.kind==='middle-extension'
    ?[NM_MIDDLE_EXTENSION.course(ref.grade).sessions[ref.extensionIndex]]
    :ref.sourceIndices.map(i=>NM_COURSES[ref.courseKey].sessions[i]));
  const session=source?{magic:[...new Set(source.flatMap(s=>s.magic||[]))],drills:source.flatMap(s=>s.test?s.pool||[]:s.drills||[]).concat(at.weekLessons.flatMap(ref=>ref.extraPractice||[])),assignedLessons:at.weekLessons}
    :primarySessionOf(course,courseKey,weekKey,settings?highPlan:undefined);
  if(!session) return null;
  const placements = (session.drills||[]).map((d,i) => ({
    order: i+1, thread: d.t, level: d.lv, count: d.n,
    seed: envItemSeed(weekKey, courseKey, i)
  }));
  const extensionGrades=[...new Set((at?.weekLessons||[]).filter(ref=>ref.kind==='middle-extension').map(ref=>ref.grade))];
  const learningTitle=extensionGrades.length?[...new Set(at.weekLessons.map(ref=>L(ref.kind==='middle-extension'?NM_MIDDLE_EXTENSION.course(ref.grade).title:NM_COURSES[ref.courseKey].title)))].join(' · '):L(course.title);
  return { wsId: `W${weekKey}-${courseKey}`, weekKey, courseKey, course, learningTitle, session, highPlan, planSettings:settings,
    plannedRefs:at?.weekLessons, magic: session.magic||null, placements };
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
  S._boost = { threadId, level, weekKey, sessionId:'boost:'+Date.now()+':'+Math.random().toString(36).slice(2), i:0, need:BOOST_NEED, score:0, cur:null };
  S._boostRewarded=false;
  S.view='boost'; save(); render();
}
function boostProblem(threadId, level, weekKey, i){
  const rng = NM_RNG.mulberry32(NM_RNG.hashSeed('boost'+weekKey+threadId+level+'i'+i));
  const th = (window.NM_THREADS||{})[threadId];
  const params = (th && th.levels[level-1] && th.levels[level-1].params) || {};
  const gen = (window.NM_TGEN||{})[th && th.gen];
  if(!gen) return {prompt:{ko:'',en:'',zh:''},tex:'?',answer:0,answerType:'number'};
  const pr=gen(params, rng);
  /* 레벨이 세로셈으로 지정한 유형은 앱에서도 세로 위젯으로(2026-09-19) */
  if(pr && params && params.orient){ pr.orient=params.orient; if(params.orient==='v' && !pr.widget) pr.widget='vertical'; }
  return pr;
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
    if(!b.completedAt&&!b.sessionId&&S._boostRewarded){
      const previous=[...S.boost.log].reverse().find(x=>x.weekKey===b.weekKey&&x.thread===b.threadId&&x.level===b.level&&x.score===b.score&&x.need===b.need);
      // The learner's own old result is already complete. Do not append it again
      // when upgrading; ownerless legacy statistics remain preserved separately.
      if(previous){b.completedAt=previous.ts||Date.now();b.statsRecorded=true;}
    }
    if(!b.sessionId)b.sessionId='boost:legacy:'+b.weekKey+':'+b.threadId+':'+b.level;
    if(!b.completedAt){
      b.completedAt=Date.now();
      S.boost.doneWeeks[b.weekKey]=true;
      S.boost.log.push({weekKey:b.weekKey, thread:b.threadId, level:b.level, score:b.score, need:b.need, ts:b.completedAt});
      if(S.boost.log.length>30)S.boost.log.splice(0,S.boost.log.length-30);
    }
    if(!b.statsRecorded&&window.NM_STATS)b.statsRecorded=NM_STATS.record(b.threadId,b.level,b.score,b.need,{boost:true,sessionId:b.sessionId})!==false;
    const already = !!S._boostRewarded;
    if(!already){b.rewardCoins=coinAdd(2,'boost','boost:'+b.weekKey);S._boostRewarded=!coinAdd.saveFailed;}
    maybeAwardWeeklyBonus(b.weekKey); /* §6 — 몸풀기까지 끝나면 그 주가 완료됐을 수 있다 */
    scr.innerHTML=`<div class="nm-unit-bar">
      <div class="nm-unit-title">🌟 ${lk('몸풀기 완료!','Warm-up Complete!','热身完成！')}</div>
    </div>
    <div class="nm-step-body">
      <div class="nm-card center">
        <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56):''}</div>
        <div class="nm-card-h">${lk('오늘도 한 걸음 더 튼튼해졌어요!','You just got a little stronger!','今天又变得更棒了！')}</div>
        <div class="nm-score">${b.score} / ${b.need}</div>
        <div class="nm-stamp-coins">🪙 +${b.rewardCoins||0} ${t('coins')}</div>
        <button class="nm-btn full" id="boostToMailbox">${lk('선택한 학습지로','Back to selected worksheet','返回所选学习单')}</button>
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
    <button class="nm-back" id="boostBack">← ${lk('선택한 학습지로','Back to selected worksheet','返回所选学习单')}</button>
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

  let submitted=false;
  const answerIndex=b.i;
  function canAnswer(){return !submitted&&S.view==='boost'&&S._boost===b&&b.i===answerIndex;}
  function advance(correct){
    if(!canAnswer())return;
    submitted=true;
    if(correct)b.score++;
    b.i++;b.cur=null;save();
    lessonLater(()=>{if(S.view==='boost'&&S._boost===b)screenBoost();},correct?600:900);
  }

  if(useWidget){
    NM_WIDGETS.render(cur,$('#boostWidget'),val=>{
      if(!canAnswer())return;
      const ok = Array.isArray(cur.answer)
        ? Array.isArray(val) && val.length===cur.answer.length && val.every((v,i)=>+v===cur.answer[i])
        : +val===cur.answer;
      if(ok)playSfx("success");
      logDaily(ok);
      advance(ok);
    });
  } else {
    /* widgets.js의 numpadState는 그 파일 내부 클로저라 여기선 못 쓴다 —
       stepArena/stepCheck과 같은 방식(S.sub.inp 대신 지역 inp)으로 인라인 처리. */
    const screen=$('#boostScreen');
    let inp='';
    buildNumpad($('#boostPad'),val=>{
      if(!canAnswer())return;
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
      <button class="nm-back" id="mbBack">← ${navigationLabel(S._mbWeek?'mailbox':'town')}</button>
      <div class="nm-unit-title">📬 ${lk('편지함','Mailbox','信箱')}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap">
      <div class="nm-card nm-gate-card-inline">
        <div class="nm-card-h">🔒 ${lk('가입·이용기간을 확인해 주세요','Check registration and membership','请确认注册和使用期限')}</div>
        <p class="nm-wsh-sentence">${lk('가입 후 30일 체험할 수 있어요. 이후에는 학원에서 6개월·1년 이용을 승인해요.','Registration includes a 30-day trial. Your academy can then approve 6 months or 1 year.','注册后可体验30天，之后可由学院开通6个月或1年。')}</p>
        <button class="nm-btn full" id="mbGate">${lk('가입·이용 상태 보기','View registration and membership','查看注册及使用状态')}</button>
      </div>
    </div>`;
    $('#mbBack').onclick=()=>{S.view='town';save();render();};
    $('#mbGate').onclick=showGateModal;
    return;
  }

  if(S._mbWeek){
    const env = envelopeForWeek(S._mbWeek);
    if(!env){
      scr.innerHTML=`<div class="nm-unit-bar"><button class="nm-back" id="mbBack">← ${navigationLabel(S._mbWeek?'mailbox':'town')}</button>
        <div class="nm-unit-title">📬 ${lk('편지함','Mailbox','信箱')}</div></div>
        <div class="nm-step-body"><div class="nm-card">${lk('이 주에 배정된 학습지가 없어요. 시작일과 학습 속도를 확인해 주세요.','No worksheet is scheduled for this week. Check the start date and pace.','本周未安排学习单，请确认开始日期和学习速度。')}</div></div>`;
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
    }).join('') || `<p class="nm-wsh-sentence">${(env.plannedRefs||[]).some(ref=>ref.kind==='middle-extension')
      ?lk('이번 주는 선택 심화·적용 문제를 풀어요.','This week focuses on optional deeper-study and application problems.','本周学习可选进阶与应用题。')
      :lk('이번 세션은 드릴 복습 위주예요.','This session is mostly review drills.','这次以复习为主。')}</p>`;
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
      <button class="nm-back" id="mbBack">← ${navigationLabel(S._mbWeek?'mailbox':'town')}</button>
      <div class="nm-unit-title">📬 ${esc(env.wsId)}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap">
      ${boostCardHtml}
      <div class="nm-card">
        <div class="nm-card-h">${lk('이번 주 학습지 봉투','This Week’s Worksheet Envelope','本周学习单信封')}</div>
        ${/* 이번 주 첫 드릴의 스레드로 호스트를 고른다 — 그 주에 실제로 하는 연산의 캐릭터가 건네준다 */''}
        ${hostStripHtml('unit',(env.placements&&env.placements[0]&&env.placements[0].thread)||env.courseKey||'')}
        <p class="nm-wsh-sentence">${esc(env.learningTitle||L(env.course.title))}</p>
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
        S.unitReturn={view:'mailbox',weekKey:S._mbWeek};
        S.unit=goUnit;S.step=null;S.sub={};S.tierId=null;S.view='unit';S._fromRoadmap=false;S._fromCourseRoad=false;
        save();render();
      };
    }
    $('#mbPrint').onclick=()=>{
      /* 로드맵 세션 인쇄와 같은 20문항/페이지 경로(2026-09-04) — 드릴별 count를
         그대로 가중치(n)로 써서 한 세션을 한 장에 이어붙인다(exam.js
         buildMixedProblemSet 참조). */
      /* "발송 말고 고를 때는 제너레이터로"(2026-09-05) — 바로 인쇄하지 않고
         편집기를 먼저 연다(문항 스왑·유형 교체·인쇄는 편집기 안에서). */
      /* 링크 학습지(ws.html)와 같은 구성(2026-09-08 파리티) — 필산 회차 + 독셈 + 문장제, 표지·
         마법 유닛까지 exam.js weeklyEnvelope 하나가 만든다. 편집기에서 문항을 바꿔도 회차 구성은 같다. */
      const wk = env.plannedRefs&&window.NM_EXAM?.plannedEnvelope
        ? NM_EXAM.plannedEnvelope(env.plannedRefs,env.weekKey,{name:S.name,cad:env.planSettings.cadence,amount:env.planSettings.amount,grade:printGradeKey()})
        : (window.NM_EXAM && NM_EXAM.weeklyEnvelope)
        ? NM_EXAM.weeklyEnvelope(env.course, env.courseKey, env.weekKey, { name:S.name, cad:env.planSettings?.cadence||S.roadCadence, amount:env.planSettings?.amount, grade:printGradeKey(), compactHigh:true,
            startSession:env.highPlan?env.highPlan.sessionIndex:S.adminPlan?.courseKey===env.courseKey?S.adminPlan.sessionIndex:null,
            highStartDate:env.highPlan?.startDate,highSpeed:env.highPlan?.speed,highWholeWeek:true,
            /* 몇 번째 회차인가 = 이 주 전에 연 봉투 수(2026-09-30, 언어사고력 주제 순환·유아 중반 판정) */
            sessionIdx: Object.keys((S.mailbox && S.mailbox.opened) || {}).filter(function(wk){ return wk < env.weekKey; }).length }) : null;
      const items = wk ? wk.items : env.placements.map(p=>({thread:p.thread, level:p.level, n:p.count, seed:p.seed}));
      if(window.NM_EXAM && NM_EXAM.openPrintEditor) NM_EXAM.openPrintEditor(items, env.wsId,
        wk ? {mixed:20, cover:wk.cover, units:wk.units, courseKey:env.courseKey, courseSessions:wk.courseSessions} : {mixed:20});
    };
    if(!S.mailbox.opened) S.mailbox.opened={};
    if(!S.mailbox.opened[S._mbWeek]){ S.mailbox.opened[S._mbWeek]=Date.now(); save(); }
    maybeAwardWeeklyBonus(S._mbWeek); /* §6 주간 보너스 — 열 때마다 확인, 중복 지급은 내부에서 막음 */
    renderMath(scr);
    return;
  }

  const weeks = mailboxWeeks();
  const fromDoc = `<span class="nm-mb-env-from">${lk('From. 독쌤','From. Doc-T','来自 独先生')}</span>`;
  const rows = weeks.map(w=>`<button class="nm-mb-env-card${w.opened?' opened':''}" data-week="${w.weekKey}">
    <span class="nm-mb-env-icon">${w.opened?'📭':'📬'}</span>
    <span class="nm-mb-env-body">
      <span class="nm-mb-env-label">${esc(w.weekKey)}${w.isCurrent?` · ${lk('이번 주','This week','本周')}`:''}</span>
      ${fromDoc}
    </span>
    ${w.opened?`<span class="nm-mb-env-badge done">${lk('읽음','Read','已读')}</span>`:`<span class="nm-mb-env-badge new">${lk('새 봉투','New','新')}</span>`}
  </button>`).join('');

  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="mbBack">← ${navigationLabel(S._mbWeek?'mailbox':'town')}</button>
    <div class="nm-unit-title">📬 ${lk('편지함','Mailbox','信箱')}</div>
  </div>
  <div class="nm-step-body nm-wsh-wrap">
    <div class="nm-doc-strip">
      ${window.renderHumanChar?window.renderHumanChar('doc',64):''}
      <div class="nm-doc-strip-bubble">${lk('독쌤이 이번 주 편지를 보냈어요. 봉투를 열어 볼까?',"Doc-T sent this week's letter. Open the envelope?","独先生寄来了本周的信，打开看看？")}</div>
    </div>
    <p class="nm-wsh-sentence" style="margin-bottom:12px">${lk('매주 월요일, 지금 배우는 곳에 맞춘 학습지 봉투가 도착해요.','Every Monday, a worksheet envelope arrives matched to what you’re learning.','每周一，会收到一份配合学习进度的学习单信封。')}</p>
    <div class="nm-mb-env-list">${rows || `<div class="nm-card">${lk('봉투가 없어요.','No envelopes yet.','暂无信封。')}</div>`}</div>
  </div>`;
  $('#mbBack').onclick=()=>{S.view='town';save();render();};
  scr.querySelectorAll('.nm-mb-env-card[data-week]').forEach(el=>{
    el.onclick=()=>{ S._mbWeek=el.dataset.week; screenMailbox(); };
  });
}

function showTownModal(title,desc,onGo,goText){
  const modal=$('#tmodal');
  $('#tmTitle').textContent=title;
  $('#tmDesc').textContent=desc;
  const go=$('#tmGo');
  if(onGo){go.style.display='block';go.textContent=goText||(S.lang==='ko'?'학습 단원 보러가기 →':S.lang==='en'?'See units →':'查看单元 →');go.onclick=()=>{modal.classList.remove('on');onGo();};}
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
      <div class="nm-gate-ico doc">${window.renderHumanChar?window.renderHumanChar('doc',64):'🔒'}<span class="nm-gate-ico-lock">🔒</span></div>
      <h3>${ko?'승인번호가 있으면 모두 열려요':en?'Unlock everything with your academy code':'输入学院授权码即可解锁全部'}</h3>
      <p>${ko?'지금은 체험 모드예요. 유치·초등·중등·고등에서 2개씩, 마을 건물마다 앞 2챕터를 둘러볼 수 있어요.':en?'You’re in trial mode — two units from each school band, plus the first two chapters in every village building.':'当前为体验模式：幼儿·小学·初中·高中各2个单元，村庄每栋建筑前2章。'}</p>
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
  if(membership&&guardianAuth){
    S.view='closet';save();render();
    const details=$('.nm-closet-settings');if(details)details.open=true;
    const card=$('#nm-guardian-slot');if(card)card.scrollIntoView({block:'start'});
    return;
  }
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
    }else if(res.reason==='rate'){
      msg.textContent=ko?'시도가 너무 많아요. 10분 뒤에 다시 해 주세요.':en?'Too many tries — please wait 10 minutes.':'尝试次数过多，请10分钟后再试。';
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

/* 3D 마을(2026-09-26, 원장 "마을 지도야 … 3d로 제대로 구현") — app/town3d/town3d.js.
   정상 로딩 중에는 옛 2D 지도를 숨기고 준비 화면만 보이며, 3D 를 못 쓸 때만 2D 를 드러낸다.
   건물·관문을 누르면 2D 와 같은 안내(townSpotAction·showGateLinksModal). 잠금 규칙도 2D 와 같다. */
function mountTown3DInto(scr){
  const vp=scr.querySelector('#townVp');
  if(!vp)return;
  const lang=S.lang;
  const spots=TOWN_SPOTS.map(sp=>{
    const open=sp.tier==='_theater'?false:TOWN_ALWAYS_OPEN.indexOf(sp.tier)>=0?true:tierOpen(tierById(sp.tier));
    return { id:sp.tier, open, label:sp.tag, sub:sp.sub, lockIcon:sp.lockIcon };
  });
  const gates=TOWN_GATES.map(g=>({ id:g.id, icon:g.icon, name:g.name }));
  const walker=(k,n)=>window.renderWalker?window.renderWalker(k,n):'';
  const numi=(c,n)=>window.renderNumiChar?window.renderNumiChar(c,n):'';
  const myName=avatarName();
  /* 진짜 3D 캐릭터(app/char3d) 모델 — html 은 모델을 못 만들 때의 빌보드 대체용으로 그대로 둔다.
     버디: 기호 캐릭터는 S.character.symbol(id), 숫자는 number. char3d 는 0~10 과 기호 10종만 빚으므로
     그 밖의 숫자(11·20·42…)는 모델 없이 옛 그림으로 보여 준다(엉뚱한 숫자가 서 있지 않게). */
  const C3_SYMS=['plus','minus','times','divide','equal','percent','pi','sigma','infinity','sqrt'];
  const buddyModel=(()=>{
    const c=S.character||{};
    if(window.NM_COSMETICS&&NM_COSMETICS.needsSprite(c))return null;
    let id=c.symbol!=null?c.symbol:c.number;
    if(typeof id==='string'&&/^\d+$/.test(id))id=+id;
    const ok=(typeof id==='number'&&id>=0&&id<=10&&Math.floor(id)===id)||C3_SYMS.indexOf(id)>=0;
    return ok?{kind:'buddy',buddy:{number:id,color:c.color,hat:c.hat||'none',cape:c.cape||'none'}}:null;
  })();
  const characters=[
    { id:'player', role:'player', html:walker(avatarProfile(),60), model:NM_HUMANS.model(avatarProfile()), name:myName, at:'plaza',
      lines:[{ko:`안녕! 난 ${myName}(이)야 ✨`,en:`Hi! I'm ${myName} ✨`,zh:`你好！我是${myName} ✨`},{ko:'길을 콕 찍으면 내가 걸어가!',en:'Tap a path and I will walk there!',zh:'点一下小路，我就走过去！'}] },
    { id:'buddy', role:'buddy', html:numi(S.character,44), model:buddyModel||undefined,
      lines:[{ko:'오늘은 어떤 마법을 배울까?',en:'What magic shall we learn today?',zh:'今天学什么魔法呢？'},{ko:'내가 옆에서 도와줄게!',en:'I will help you right here!',zh:'我在旁边帮你！'}] },
    { id:'elder', role:'npc', html:walker('elder',56), model:{kind:'elder'}, name:{ko:'안내 마법사',en:'Guide Wizard',zh:'向导魔法师'}, at:'gazebo', still:true,
      lines:[{ko:'허허, 마을에 온 걸 환영하네',en:'Ho ho, welcome to the village',zh:'呵呵，欢迎来到村庄'},{ko:'정자에 앉아 숫자 이야기 들려줄까?',en:'Shall I tell you a number story at the gazebo?',zh:'在凉亭坐下，听我讲讲数字的故事？'},{ko:'천천히 해도 괜찮단다',en:'It is fine to take your time',zh:'慢慢来也没关系'},{ko:'항구에 가면 수학 이야기 퀴즈가 있단다',en:'There is a math-story quiz down at the harbor',zh:'去港口有数学故事问答哦'}] },
    { id:'doc', role:'npc', html:walker('doc',56), model:{kind:'doc'}, name:{ko:'독쌤',en:'Doc-T',zh:'独先生'}, at:'academy', still:true,
      lines:[{ko:'안녕! 나는 독쌤이야 📚',en:'Hi! I am Doc-T 📚',zh:'你好！我是独先生 📚'},{ko:'오늘 배울 마법은 도서관에 있어',en:"Today's magic is in the library",zh:'今天要学的魔法在图书馆里'},{ko:'모르면 언제든 물어봐!',en:'Ask me anything, any time!',zh:'不懂随时问我！'}] },
    { id:'poco', role:'npc', html:numi({number:3,color:'gold',bg:'plain'},52), model:{kind:'buddy',buddy:{number:3,color:'gold'}}, at:'plaza', wander:true,
      lines:[{ko:'안녕! 난 3이야 ✨',en:'Hi! I am 3 ✨',zh:'你好！我是3 ✨'},{ko:'7이랑 만나면 10! 🔟',en:'With 7 we make 10! 🔟',zh:'和7在一起就是10！🔟'},{ko:'게임하러 가자!',en:"Let's go play!",zh:'去玩游戏吧！'}] },
    { id:'momo', role:'npc', html:numi({number:8,color:'pink',bg:'plain'},52), model:{kind:'buddy',buddy:{number:8,color:'pink'}}, at:'numberland', wander:true,
      lines:[{ko:'안녕! 난 8이야 💖',en:'Hi! I am 8 💖',zh:'你好！我是8 💖'},{ko:'2랑 만나면 10! 🔟',en:'With 2 we make 10! 🔟',zh:'和2在一起就是10！🔟'},{ko:'실수는 괜찮아!',en:'Mistakes are okay!',zh:'出错也没关系！'}] }
  ];
  const box=document.createElement('div');
  box.className='nm-town3d';
  box.innerHTML=`<div class="nm-3d-loading town" role="status">
    <span class="nm-3d-loading-mark" aria-hidden="true">✦</span>
    <b>${S.lang==='ko'?'마법 마을을 여는 중…':S.lang==='en'?'Opening the magic village…':'正在打开魔法村…'}</b>
  </div>`;
  /* 3D 층 안의 끌기·휠·탭이 아래 2D 지도의 처리기(지도 이동·탭 이동)로 새지 않게 */
  ['pointerdown','pointermove','pointerup','pointercancel','wheel'].forEach(ev=>box.addEventListener(ev,e=>e.stopPropagation()));
  box.style.pointerEvents='none';   /* 준비 중에는 옛 지도도, 아직 덜 선 3D 도 누르지 못하게 */
  vp.appendChild(box);
  const revealFallback=()=>{
    box.remove();
    vp.classList.remove('is-3d-pending');
    vp.removeAttribute('aria-busy');
  };
  const muted=()=>{const mb=scr.querySelector('#townMute');return !mb||mb.textContent.indexOf('🔇')>=0;};
  import('./town3d/town3d.js?v=20261021-characters1').then(m=>{
    if(!box.isConnected)return null;
    return m.mountTown3D(box,{
    lang, spots, gates, characters, snapshot:townVisitSnapshot,
    onSpot:id=>townSpotAction(id),
    onGate:id=>{const g=TOWN_GATES.find(x=>x.id===id);if(g)showGateLinksModal(g);},
    onSay:text=>{if(!muted()&&S.lang==='ko')say(text);}
    });
  }).then(async ctl=>{
    if(!ctl){revealFallback();return;}
    if(!box.isConnected){ctl.dispose();return;}
    /* 모듈 생성 완료와 첫 화면 그리기는 다르다. 첫 프레임까지 준비 화면을
       유지해야 돌아올 때 잠깐 빈 하늘/바닥이나 덜 배치된 캐릭터가 보이지 않는다. */
    if(ctl.ready)await ctl.ready;
    if(!box.isConnected){ctl.dispose();return;}
    /* 3D 가 섰다 — 2D 지도의 움직임(분수·반짝임·걷기)을 멈추고 숨긴다. 음소거·배경음은 2D 쪽 버튼 그대로 */
    const prev=townCleanup;
    if(prev)prev();
    const loading=box.querySelector('.nm-3d-loading');
    if(loading)loading.remove();
    vp.classList.remove('is-3d-pending');
    vp.classList.add('is-3d');
    vp.removeAttribute('aria-busy');
    box.style.pointerEvents='';
    const zi=scr.querySelector('#townZin'), zo=scr.querySelector('#townZout'), me=scr.querySelector('#townMe');
    if(zi)zi.onclick=()=>ctl.zoomIn();
    if(zo)zo.onclick=()=>ctl.zoomOut();
    if(me)me.onclick=()=>ctl.focusPlayer();
    townCleanup=()=>{
      if(ctl.snapshot){townVisitSnapshot=ctl.snapshot();S.townVisitSnapshot=townVisitSnapshot;save();}
      if(prev)prev();
      ctl.dispose();
    };
    scr.addEventListener('click',e=>{if(e.target.closest('button,a')&&!e.target.closest('.t3d-joystick'))ctl.stopMovement?.();},{capture:true});
  }).catch(revealFallback);
}
/* 마을 건물 탭 → 안내 모달(2D 지도·3D 마을 공통) */
function townDestinationLabel(id){
  if(id==='_theater')return S.lang==='ko'?'학습지·시험':S.lang==='en'?'Worksheets':'学习单';
  if(id==='_closet')return S.lang==='ko'?'옷장':S.lang==='en'?'Closet':'衣橱';
  const sp=TOWN_SPOTS.find(x=>x.tier===id);return sp?L(sp.sub):((tierById(id)||{}).title||'');
}
function enterTownDestination(id){
  if(id==='_closet'||id==='_theater'){S.view=id==='_closet'?'closet':'exam';save();render();return;}
  const tier=tierById(id);if(tierOpen(tier))enterTier(id);else townSpotAction(id);
}
function townSpotAction(id){
  if(id==='_theater'){
    const examLabel=S.lang==='ko'?'📝 학습지 & 시험':S.lang==='en'?'📝 Worksheet & Exam':'📝 学习单 & 考试';
    const examDesc=S.lang==='ko'?'학습지를 인쇄하거나 시간을 정해 시험을 볼 수 있어요.':
      S.lang==='en'?'Print a seeded worksheet or take a timed exam.':'打印带种子的学习单，或进行限时考试。';
    showTownModal(examLabel, examDesc, ()=>{S.view='exam';save();render();},S.lang==='ko'?'학습지 · 시험 열기 →':S.lang==='en'?'Open worksheets & tests →':'打开学习单和测试 →');
    return;
  }
  if(id==='_closet'){
    const cl=S.lang==='ko'?'🪄 마법사 옷장':S.lang==='en'?"🪄 Wizard's Closet":'🪄 魔法师衣橱';
    const cd=S.lang==='ko'?'캐릭터를 더 만들고 이름·옷·숫자 친구를 골라 꾸며요!':
      S.lang==='en'?'Customize your number character!':'选择数字、颜色、表情、帽子和背景，打造专属角色！';
    showTownModal(cl, cd, ()=>{S.view='closet';save();render();},S.lang==='ko'?'옷장 들어가기 →':S.lang==='en'?'Enter closet →':'进入衣橱 →');
    return;
  }
  const tier=tierById(id);
  if(tierOpen(tier)) showTownModal(`${tier.grade} · ${L(tier.subtitle)}`,L(tier.desc),()=>enterTier(id));
  else showTownModal(`${tier.grade} · ${L(tier.subtitle)}`,L(tier.desc)+' — '+t('locked'),null);
}
/* 마을 상호작용(드래그/핀치줌/구름/분수/숫자친구/배경음) — 화면을 나갈 때 반드시 cleanup() 호출 */
function initTownWorld(scr){
  const vp=scr.querySelector('#townVp'), world=scr.querySelector('#townWorld');
  const modal=scr.querySelector('#tmodal');
  const W=TOWN_WORLD_W,H=TOWN_WORLD_H;
  let cam={x:0,y:0,scale:1},minS=1,maxS=3;
  const BBOX=computeContentBBox(W,H,.04);

  /* 지도를 화면 가득 채운다. 좁은 세로 화면의 바깥 건물은 드래그하거나
     측면 메뉴의 장소 목록으로 입장한다. 캐릭터 이동은 필요하지 않다. */
  function fit(){
    const coverS=Math.max(vp.clientWidth/W,vp.clientHeight/H);
    minS=coverS;
    if(cam.scale<minS)cam.scale=minS;
  }
  function apply(){world.style.setProperty('--town-map-scale',String(cam.scale));world.style.transform=`translate(${cam.x}px,${cam.y}px) scale(${cam.scale})`;}
  function bound(){
    const mx=vp.clientWidth-W*cam.scale, my=vp.clientHeight-H*cam.scale;
    cam.x = mx>=0 ? Math.min(mx,Math.max(0,cam.x)) : Math.min(0,Math.max(mx,cam.x));
    cam.y = my>=0 ? Math.min(my,Math.max(0,cam.y)) : Math.min(0,Math.max(my,cam.y));
  }
  function center(){
    cam.scale=minS;
    cam.x=(vp.clientWidth-W*cam.scale)/2;
    cam.y=(vp.clientHeight-H*cam.scale)/2;
    bound();apply();
  }
  /* 그림 지도와 사람·기호는 같은 2D 좌표계다. 걷기를 시작하면 현재 확대율에서
     화면 중앙 안전영역만 따라가고 수동 드래그/확대는 자유 둘러보기로 전환한다. */
  let follow=false, centerOnPlayer=false;
  const reduceCamera=!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  function playerWorld(){return {x:player.x/100*W,y:player.y/100*H};}
  function setFollow(value){
    follow=value;
    const button=scr.querySelector('#townMe');if(button)button.setAttribute('aria-pressed',String(value));
  }
  function focusPlayer(immediate,dt){
    const pw=playerWorld(),px=pw.x*cam.scale+cam.x,py=pw.y*cam.scale+cam.y;
    const left=vp.clientWidth*.25,right=vp.clientWidth*.75,top=vp.clientHeight*.25,bottom=vp.clientHeight*.75;
    let tx=cam.x,ty=cam.y;
    if(centerOnPlayer){tx=vp.clientWidth/2-pw.x*cam.scale;ty=vp.clientHeight/2-pw.y*cam.scale;}
    else{if(px<left)tx+=left-px;else if(px>right)tx+=right-px;
      if(py<top)ty+=top-py;else if(py>bottom)ty+=bottom-py;}
    const alpha=immediate||reduceCamera?1:1-Math.exp(-7*(dt||1/60));
    cam.x+=(tx-cam.x)*alpha;cam.y+=(ty-cam.y)*alpha;
    bound();apply();
    if(centerOnPlayer&&Math.abs(tx-cam.x)+Math.abs(ty-cam.y)<1)centerOnPlayer=false;
  }

  let drag=false,moved=false,sx,sy,cx,cy;
  function onDown(e){
    if(!pts.size)pinched=false;
    drag=true;moved=false;vp.classList.add('drag');sx=e.clientX;sy=e.clientY;cx=cam.x;cy=cam.y;
    if(!e.target.closest('button,a,.nb'))try{vp.setPointerCapture(e.pointerId);}catch(_){}
  }
  function onMove(e){if(!drag)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)+Math.abs(dy)>6){moved=true;setFollow(false);centerOnPlayer=false;}cam.x=cx+dx;cam.y=cy+dy;bound();apply();}
  function onUp(e){drag=false;vp.classList.remove('drag');try{if(vp.hasPointerCapture(e.pointerId))vp.releasePointerCapture(e.pointerId);}catch(_){}}
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
  function pdUp(e){pts.delete(e.pointerId);if(pts.size<2){pd=0;}}
  vp.addEventListener('pointerdown',pdDown);
  vp.addEventListener('pointermove',pdMove);
  vp.addEventListener('pointerup',pdUp);
  vp.addEventListener('pointercancel',pdUp);

  function zoomTo(ns,ox,oy){
    setFollow(false);centerOnPlayer=false;
    ns=Math.min(maxS,Math.max(minS,ns));
    const r=vp.getBoundingClientRect();
    const lx=ox-r.left, ly=oy-r.top;
    const wx=(lx-cam.x)/cam.scale, wy=(ly-cam.y)/cam.scale;
    cam.scale=ns;cam.x=lx-wx*ns;cam.y=ly-wy*ns;bound();apply();
  }
  const zin=scr.querySelector('#townZin'), zout=scr.querySelector('#townZout');
  zin.onclick=()=>{const r=vp.getBoundingClientRect();zoomTo(cam.scale*1.25,r.left+r.width/2,r.top+r.height/2);};
  zout.onclick=()=>{const r=vp.getBoundingClientRect();zoomTo(cam.scale/1.25,r.left+r.width/2,r.top+r.height/2);};
  const meBtn=scr.querySelector('#townMe');
  if(meBtn)meBtn.onclick=()=>{setFollow(true);centerOnPlayer=true;};
  function onWheel(e){e.preventDefault();zoomTo(cam.scale*(e.deltaY<0?1.1:.9),e.clientX,e.clientY);}
  vp.addEventListener('wheel',onWheel,{passive:false});

  const fitRAF=requestAnimationFrame(()=>{fit();center();});
  function onResize(){fit();if(follow)focusPlayer(true);else{bound();apply();}}
  addEventListener('resize',onResize);

  /* 건물 클릭 */
  scr.querySelectorAll('.nm-zone').forEach(z=>{
    z.addEventListener('click',e=>{
      if(moved)return;e.stopPropagation();
      enterTownDestination(z.dataset.spot);
    });
  });
  scr.querySelector('#tmClose').onclick=()=>modal.classList.remove('on');
  modal.onclick=e=>{if(e.target===modal)modal.classList.remove('on');};

  /* 관문 표지판 탭(§3) — .nm-zone과 같은 패턴(드래그면 무시, 지도 탭-이동과 충돌
     안 하게 stopPropagation). */
  scr.querySelectorAll('.nm-gate').forEach(g=>{
    g.addEventListener('click',e=>{
      if(moved)return;e.stopPropagation();
      const gate=TOWN_GATES.find(x=>x.id===g.dataset.gate);
      if(gate)showGateLinksModal(gate);
    });
  });

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
    s.style.left=(25+Math.random()*12)+'%';s.style.top=(42+Math.random()*10)+'%';
    s.style.animationDuration=(4+Math.random()*3)+'s';
    world.appendChild(s);setTimeout(()=>s.remove(),8000);
  },600);

  /* 걸어다니는 숫자친구 — nbNumi는 "나"(사람 아바타, 플레이어): 지도를 탭하면
     그 자리로 걸어간다. nbBuddy(동행 숫자/기호 캐릭터)는 플레이어를 살짝 뒤에서
     따라다닌다(pick() 대상 아님). nbElder·nbDoc는 정자·도서관 앞에 서 있는 정지
     NPC(spd:0, still:true — walk()에서 아예 움직이지 않는다). Poco/Momo는 계속 자유 배회. */
  const myName=avatarName();
  const nbs=[
    {el:scr.querySelector('#nbNumi'),x:40,y:62,tx:40,ty:62,spd:.22,player:true,
      lines:[L({ko:`안녕! 난 ${myName}(이)야 ✨`,en:`Hi! I'm ${myName} ✨`,zh:`你好！我是${myName} ✨`}),L({ko:'건물을 누르면 바로 들어갈 수 있어!',en:'Tap a building to enter!',zh:'点击建筑就能进入！'})]},
    {el:scr.querySelector('#nbBuddy'),x:37,y:63,tx:37,ty:63,spd:.22,buddy:true,
      lines:[L({ko:'오늘은 어떤 마법을 배울까?',en:'What magic shall we learn today?',zh:'今天学什么魔法呢？'}),L({ko:'내가 옆에서 도와줄게!',en:'I will help you right here!',zh:'我在旁边帮你！'})]},
    {el:scr.querySelector('#nbElder'),x:31,y:52,tx:31,ty:52,spd:0,still:true,
      lines:[L({ko:'허허, 마을에 온 걸 환영하네',en:'Ho ho, welcome to the village',zh:'呵呵，欢迎来到村庄'}),L({ko:'정자에 앉아 숫자 이야기 들려줄까?',en:'Shall I tell you a number story at the gazebo?',zh:'在凉亭坐下，听我讲讲数字的故事？'}),L({ko:'천천히 해도 괜찮단다',en:'It is fine to take your time',zh:'慢慢来也没关系'}),L({ko:'항구에 가면 수학 이야기 퀴즈가 있단다',en:'There is a math-story quiz down at the harbor',zh:'去港口有数学故事问答哦'})]},
    {el:scr.querySelector('#nbDoc'),x:47,y:60,tx:47,ty:60,spd:0,still:true,
      lines:[L({ko:'안녕! 나는 독쌤이야 📚',en:'Hi! I am Doc-T 📚',zh:'你好！我是独先生 📚'}),L({ko:'오늘 배울 마법은 도서관에 있어',en:'Today\'s magic is in the library',zh:'今天要学的魔法在图书馆里'}),L({ko:'모르면 언제든 물어봐!',en:'Ask me anything, any time!',zh:'不懂随时问我！'})]},
    {el:scr.querySelector('#nbPoco'),x:45,y:60,tx:45,ty:60,spd:.14,lines:[L({ko:'안녕! 난 3이야 ✨',en:'Hi! I am 3 ✨',zh:'你好！我是3 ✨'}),L({ko:'7이랑 만나면 10! 🔟',en:'With 7 we make 10! 🔟',zh:'和7在一起就是10！🔟'}),L({ko:'게임하러 가자!',en:'Let\'s go play!',zh:'去玩游戏吧！'})]},
    {el:scr.querySelector('#nbMomo'),x:37,y:66,tx:37,ty:66,spd:.08,lines:[L({ko:'안녕! 난 8이야 💖',en:'Hi! I am 8 💖',zh:'你好！我是8 💖'}),L({ko:'2랑 만나면 10! 🔟',en:'With 2 we make 10! 🔟',zh:'和2在一起就是10！🔟'}),L({ko:'실수는 괜찮아!',en:'Mistakes are okay!',zh:'出错也没关系！'})]}
  ];
  nbs.forEach(n=>{n.el.style.left=n.x+'%';n.el.style.top=n.y+'%';});
  function pick(n){const sp=[[38,58],[44,62],[36,66],[42,68],[48,57],[34,60]];const p=sp[Math.random()*sp.length|0];n.tx=p[0]+Math.random()*6;n.ty=p[1]+Math.random()*4;}
  nbs.forEach(n=>{if(!n.player&&!n.buddy&&!n.still)pick(n);});
  let walkRAF;
  let muted=true;
  let stopAmbience=null;
  const player=nbs[0];
  let lastTick=0;
  function walk(now){
    const dt=lastTick?Math.min(.05,Math.max(0,(now-lastTick)/1000)):0;lastTick=now;
    nbs.forEach(n=>{
      n.el.style.zIndex=20+Math.round(n.y);
      const root=n.el.querySelector('.nm-walker');
      if(n.still){if(root)root.classList.remove('walking');return;}
      if(n.buddy){
        const gap=48/cam.scale;
        n.tx=Math.min(98,Math.max(2,player.x-gap/W*100));
        n.ty=Math.min(98,Math.max(2,player.y+1));
      }
      const dx=(n.tx-n.x)*W/100,dy=(n.ty-n.y)*H/100,d=Math.hypot(dx,dy);
      if(d<.8){
        n.x=n.tx;n.y=n.ty;n.velocity=0;
        n.el.style.left=n.x+'%';n.el.style.top=n.y+'%';
        if(root)root.classList.remove('walking');
        if(!n.player&&!n.buddy&&Math.random()<1-Math.exp(-.7*dt))pick(n);
        return;
      }
      // Acceleration and braking are measured in real time, independent of Hz.
      const desired=Math.min(n.spd*1000,d*5);
      n.velocity=(n.velocity||0)+(desired-(n.velocity||0))*(1-Math.exp(-10*dt));
      const step=Math.min(d,n.velocity*dt);
      n.x+=dx/d*step/W*100;n.y+=dy/d*step/H*100;
      n.el.style.left=n.x+'%';n.el.style.top=n.y+'%';
      if(root){root.classList.add('walking');root.dataset.dir='s';}
    });
    if(follow&&!drag&&pts.size<2)focusPlayer(false,dt);
    walkRAF=requestAnimationFrame(walk);
  }
  walkRAF=requestAnimationFrame(walk);

  /* 탭 → 내 캐릭터 이동. 카메라 드래그(moved)·핀치줌·건물/친구 탭(stopPropagation)과
     충돌하지 않도록: 드래그하지 않은 "가벼운 탭"일 때만 목적지로 삼는다. */
  let pinched=false;
  vp.addEventListener('pointermove',()=>{if(pts.size>=2)pinched=true;});
  let ping=null,pingTimer=null;
  function onTapWalk(e){
    if(moved||pinched||e.isPrimary===false||e.button!==0||e.target.closest('button,a,.nb'))return;
    const r=world.getBoundingClientRect();
    const x=(e.clientX-r.left)/cam.scale,y=(e.clientY-r.top)/cam.scale;
    player.tx=Math.min(98,Math.max(2,x/W*100));player.ty=Math.min(98,Math.max(2,y/H*100));
    centerOnPlayer=false;setFollow(true);
    if(ping)ping.remove();clearTimeout(pingTimer);
    ping=document.createElement('div');ping.className='nb-ping';ping.style.left=player.tx+'%';ping.style.top=player.ty+'%';world.appendChild(ping);
    pingTimer=setTimeout(()=>{if(ping)ping.remove();ping=null;},800);
  }
  vp.addEventListener('pointerup',onTapWalk);
  function onWalkKey(event){
    if(event.target!==vp||event.altKey||event.ctrlKey||event.metaKey)return;
    const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
    if(!direction)return;event.preventDefault();centerOnPlayer=false;setFollow(true);
    player.tx=Math.min(98,Math.max(2,player.tx+direction[0]*70/cam.scale/W*100));
    player.ty=Math.min(98,Math.max(2,player.ty+direction[1]*70/cam.scale/H*100));
  }
  vp.addEventListener('keydown',onWalkKey);
  function onMapFocus(event){
    const button=event.target.closest('.nm-zone,.nm-gate');
    if(!button||!button.matches(':focus-visible'))return;
    const r=button.getBoundingClientRect(),v=vp.getBoundingClientRect();
    const dx=r.left<v.left+12?v.left+12-r.left:r.right>v.right-12?v.right-12-r.right:0;
    const dy=r.top<v.top+12?v.top+12-r.top:r.bottom>v.bottom-12?v.bottom-12-r.bottom:0;
    if(dx||dy){setFollow(false);cam.x+=dx;cam.y+=dy;bound();apply();}
  }
  vp.addEventListener('focusin',onMapFocus);



  nbs.forEach(n=>{
    n.el.addEventListener('pointerup',e=>{
      onUp(e);pdUp(e);if(moved||pinched)return;e.stopPropagation();
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
  mb.setAttribute('aria-label',S.lang==='ko'?(muted?'마을 소리 켜기':'마을 소리 끄기'):S.lang==='en'?(muted?'Turn village sound on':'Turn village sound off'):(muted?'开启村庄声音':'关闭村庄声音'));
  mb.onclick=()=>{
    muted=!muted;
    mb.textContent=muted?'🔇':'🔈';
  mb.setAttribute('aria-label',S.lang==='ko'?(muted?'마을 소리 켜기':'마을 소리 끄기'):S.lang==='en'?(muted?'Turn village sound on':'Turn village sound off'):(muted?'开启村庄声音':'关闭村庄声音'));
    if(muted){
      stopVoice();
      if(stopAmbience){stopAmbience();stopAmbience=null;}
    }else{
      if(!stopAmbience)stopAmbience=startAmbience();
    }
  };

  return function cleanup(){
    clearInterval(fountainTimer);
    clearInterval(sparkTimer);
    stopVoice();
    cancelAnimationFrame(walkRAF);cancelAnimationFrame(fitRAF);vp.removeEventListener('keydown',onWalkKey);vp.removeEventListener('focusin',onMapFocus);clearTimeout(pingTimer);if(ping)ping.remove();nbs.forEach(n=>clearTimeout(n._t));
    removeEventListener('resize',onResize);
    if(stopAmbience){stopAmbience();stopAmbience=null;}
  };
}

/* ============================================================
   학습선택 — 선택한 등급의 단계/유닛 목록
   ============================================================ */
/* 레벨 제목 " · "로 나눠 짧은 이름/긴 설명으로 분리(모바일=짧은 쪽만, 데스크탑=둘 다).
   구분자가 없으면(드묾) 그냥 전체를 짧은 쪽으로 보여준다 — CSS만으로 숨기지 않는다. */
function splitLevelTitle(str){
  const i=str.indexOf(' · ');
  if(i<0)return{main:str,sub:''};
  return{main:str.slice(0,i),sub:str.slice(i+3)};
}
function screenTier(){
  const scr=$('#screen');
  const tier=tierById(S.tierId);
  if(!tier){exitTier();return;}
  const accent=tier.color||'#16417C';
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  /* "다음" 유닛 — 이 등급 안에서 처음 만나는 미완료·비잠금 유닛 하나(findNextRoadUnit과
     같은 발상, 전체 로드맵이 아니라 이 등급 범위로만 계산) */
  let nextUid=null, doneN=0, totalN=0;
  tier.levels.forEach(lvl=>{
    (lvl.units||[]).filter(u=>UNITS[u]).forEach(uid=>{
      totalN++;
      const done=unitDone(uid);
      if(done)doneN++;
      if(!nextUid&&!done&&!unitLocked(uid))nextUid=uid;
    });
  });
  const pct=totalN?Math.round(doneN/totalN*100):0;
  let html=`<div class="nm-map">
    <div class="nm-unit-bar">
      <button class="nm-back" id="backTown">← ${navigationLabel('town')}</button>
      <div class="nm-unit-title">${esc(townDestinationLabel(tier.id))}<small>${L(tier.subtitle)} · ${tier.ageLabel}</small></div>
    </div>
    <div class="nm-tier-progress-wrap">
      <div class="nm-tier-progress"><div class="nm-tier-progress-bar" style="width:${pct}%;background:${esc(accent)}"></div></div>
      <span class="nm-tier-progress-n">${doneN}/${totalN}</span>
    </div>
    <div class="nm-tier" style="--tier-accent:${esc(accent)}">
      <p class="nm-tier-desc">${L(tier.desc)}</p>
      <div class="nm-levels">`;
  /* 체험 중에는 등급마다 앞 2챕터만 연다(원장 지시 2026-09-06). availIdx 는 '열려 있는
     레벨' 기준 순번 — trialUnitSet 이 쓰는 filter(available).slice(0,2) 와 같은 셈법이라야
     여기서 열어 준 챕터와 실제로 풀리는 유닛이 어긋나지 않는다. */
  let availIdx=-1;
  tier.levels.forEach(lvl=>{
    const units=(lvl.units||[]).filter(u=>UNITS[u]);
    if(lvl.available&&units.length)availIdx++;
    const trialOpen=trialLevelOpen(tier.id,availIdx);
    if(lvl.available&&units.length&&!trialOpen){
      html+=`<div class="nm-level locked trial-locked" data-trial-level="1"><div class="nm-level-t">${L(lvl.title)}</div><span class="nm-lock">🔒 ${esc(lk('승인번호가 있으면 열려요','Unlocks with an approval code','有授权码即可解锁'))}</span></div>`;
      return;
    }
    const open=lvl.available&&units.length;
    if(open){
      const lt=splitLevelTitle(L(lvl.title));
      html+=`<div class="nm-level open">
        <div class="nm-level-t">${esc(lt.main)}${lt.sub?`<span class="nm-level-t-sub"> · ${esc(lt.sub)}</span>`:''}</div>
        <div class="nm-unit-row">`;
      units.forEach(uid=>{
        const u=UNITS[uid];const done=unitDone(uid);const locked=unitLocked(uid);
        const isNext=!locked&&!done&&uid===nextUid;
        html+=`<button class="nm-unit ${done?'done':''} ${locked?'trial-locked':''} ${isNext?'next':''}" data-unit="${uid}">
          <span class="nm-unit-ic" style="background:${esc(accent)}1f">${u.icon?iconArt(u.icon):'✦'}</span>
          <span class="nm-unit-name">${L(u.title)}${lineageBadgeSpan(uid)}</span>
          ${locked?'<span class="nm-unit-lock">🔒</span>':done?'<span class="nm-unit-check">✓</span>':isNext?`<span class="nm-unit-next-pill">${esc(lk('다음','Next','下一个'))}</span>`:''}
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
  scr.querySelectorAll('[data-trial-level]').forEach(b=>b.onclick=()=>showGateModal());
}

/* ============================================================
   유닛 — 6단계 STEP 흐름
   ============================================================ */
function navigationLabel(view){
  const labels={town:{ko:'마을로 돌아가기',en:'Back to village',zh:'返回村庄'},title:{ko:'모드 선택으로',en:'Back to mode selection',zh:'返回模式选择'},roadmap:{ko:'스토리 지도로',en:'Back to story map',zh:'返回故事地图'},courseroad:{ko:'연산 로드맵으로',en:'Back to course roadmap',zh:'返回运算路线图'},tier:{ko:'단원 목록으로',en:'Back to unit list',zh:'返回单元列表'},mailbox:{ko:'학습지 목록으로',en:'Back to worksheets',zh:'返回学习单列表'},worksheethelper:{ko:'학습지 도우미로',en:'Back to worksheet helper',zh:'返回学习单助手'}};
  return L(labels[view]||labels.town);
}
function unitReturnTarget(){
  const target=S.unitReturn;
  if(target&&['title','town','roadmap','courseroad','tier','mailbox','worksheethelper'].includes(target.view))return target;
  return {view:S._fromCourseRoad?'courseroad':S._fromRoadmap?'roadmap':S.tierId?'tier':'town'};
}
function unitReturnLabel(){
  const target=unitReturnTarget();
  if(target.view==='mailbox'&&target.weekKey)return L({ko:'선택한 학습지로',en:'Back to selected worksheet',zh:'返回所选学习单'});
  if(target.view==='tier'&&tierById(target.tierId||S.tierId)){
    const name=townDestinationLabel(target.tierId||S.tierId);
    return L({ko:`${name} 단원 목록으로`,en:`Back to ${name} unit list`,zh:`返回${name}单元列表`});
  }
  return navigationLabel(target.view);
}
function enterUnit(uid){
  if(unitLocked(uid)){showGateModal();return;}
  S.unitReturn={view:S.tierId?'tier':'town',tierId:S.tierId||null};
  S._fromCourseRoad=false;S._fromRoadmap=false;
  S.view='unit';S.unit=uid;S.sub={};
  const u=UNITS[uid];
  const introSeen=!!(S.progress[uid]&&S.progress[uid].introSeen);
  S.step=(u.introVideo&&!introSeen)?'intro':(u.ranges?'range':'practice');
  if(window.preloadNumiMoodImgs)window.preloadNumiMoodImgs(S.character);
  save();render();
}
function pickRange(rk){S.range=rk;S.step='practice';S.sub={};save();render();}
function exitUnit(){
  const target=unitReturnTarget(),back=target.view;
  restoreRoadVisit=back==='roadmap';
  if(back==='mailbox')S._mbWeek=target.weekKey||null;
  if(back==='tier'&&target.tierId)S.tierId=target.tierId;
  if(back==='worksheethelper'&&target.wsId){
    wsHelperId=target.wsId;
    const url=new URL(location.href);url.searchParams.set('ws',target.wsId);history.replaceState(null,'',url);
  }
  S.view=back==='worksheethelper'?'town':back;
  S.unitReturn=null;S._fromRoadmap=false;S._fromCourseRoad=false;S.unit=null;S.step=null;S.sub={};save();render();
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
    const active=(S.step||'discover')===f.key, done=stepDone(u,f.key);
    return `${i?'<span class="nm-flow-arrow">→</span>':''}<button class="nm-flow-step ${active?'active':''} ${done?'done':''}" data-step="${f.key}">
      <span class="nm-flow-ic">${f.icon}</span><small>${L({ko:f.ko,en:f.en,zh:f.zh})}${done?' ✓':''}</small></button>`;
  }).join('')+`</div>`;
}

function screenUnit(){
  lessonVersion++;
  stopVoice();
  const scr=$('#screen');const u=UNITS[S.unit];
  /* Video/range selection keeps the host strip. Practice now has a separate
     explanation screen, so it does not repeat that strip above the question. */
  const isFirstUnitStep = S.step==='range' || S.step==='intro';
  const learningBand=u.tier==='basic'?'preschool':(/^(middle|high)/.test(u.tier||'')||['algebra','calculus1'].includes(u.tier))?'secondary':'elementary';
  scr.innerHTML=`<div class="nm-unit-view" lang="${esc(S.lang)}" data-learning-step="${S.step}" data-young-numbers="${schoolGradeNum()!=null?schoolGradeNum()<3:NM_BAND==='young'}" data-learning-band="${learningBand}" data-stage="${stageKeyForUnit(S.unit)}"><div class="nm-unit-inner">
    <div class="nm-unit-bar">
      <button class="nm-back" id="backMap" aria-label="${esc(unitReturnLabel())}">← ${esc(unitReturnLabel())}</button>
      <div class="nm-unit-title">${L(u.title)}<small>${L(u.subtitle)}</small></div>
    </div>
    ${isFirstUnitStep?docUnitStripHtml(u):''}
    ${(S.step==='range'||S.step==='intro')?'':flowBar()}
    <div id="stepBody" class="nm-step-body"></div>
  </div></div>`;
  $('#backMap').onclick=exitUnit;
  scr.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{S.step=b.dataset.step;save();screenUnit();});
  const body=$('#stepBody');
  if(window.NM_YOUNG_NUMBERS)NM_YOUNG_NUMBERS.start(scr.querySelector('.nm-unit-view'));
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
  lessonLater(done,15000);
}

function gotoStep(k){S.step=k;save();screenUnit();}
function nextStepKey(){const ks=unitFlowOf(UNITS[S.unit]).map(f=>f.key);const i=ks.indexOf(S.step);return ks[Math.min(i+1,ks.length-1)];}

/* ---------- STEP1 프랙티스 (진단스킵 + 숫자패드 대화형) ---------- */
function stepPractice(body,u){
  // 진단 스킵(B안): 아직 이 단계 안 했고 스킵 물어보기 전이면
  if(!S.sub.skipAsked && !stepDone(S.unit,'practice')){
    body.innerHTML=`<div class="nm-skip">
      <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56,{mood:'think'}):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
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
  if(first&&L(cfg.intro)){
    body.innerHTML=`<div class="nm-practice-intro"><div class="nm-practice-explanation">${numiDialogueHtml(L(cfg.intro))}</div><div class="nm-practice-intro-actions"><button class="nm-btn ghost" id="nmLessonReplay">${L({ko:'설명 다시 듣기',en:'Replay explanation',zh:'重听说明'})}</button><button class="nm-btn" id="nmLessonBegin">${L({ko:'문제 풀기',en:'Try the question',zh:'开始答题'})}</button></div></div>`;
    $('#nmLessonReplay').onclick=()=>say(L(cfg.intro));
    $('#nmLessonBegin').onclick=()=>{stopVoice();S.sub.started=true;runPractice(body,u);};
    say(L(cfg.intro));return;
  }
  if(cur.widget&&cur.widget!=='numpad'&&window.NM_WIDGETS){runPracticeWidget(body,u,cur,first,need);return;}
  const splitQuestion=cur.gen==='splitNum'&&(schoolGradeNum()!=null?schoolGradeNum()<3:NM_BAND==='young');
  const pracTex=cur.tex?`<div class="nm-lab-expr"><span data-tex="${esc(cur.tex)}"></span></div>`:'';
  const isMulti=Array.isArray(cur.answer);
  if(isMulti)ensureMultiState(cur.answer,cur.answerShape);
  const shapeCls=isMulti&&cur.answerShape?' nm-multi-shape':'';
  body.innerHTML=`<div class="nm-dialog nm-answer-dialog${splitQuestion?' nm-split-question':''}">
    <div class="nm-prog">${dots(need,S.sub.pIdx)}</div>
    <div class="nm-answer-guide"><div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56,{mood:'think'}):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble" id="bub">${first?numiDialogueHtml(L(cfg.intro))+'<br><br>'+numiDialogueHtml(L(cur.prompt),splitQuestion?cur:null):numiDialogueHtml(L(cur.prompt),splitQuestion?cur:null)}</div>
    </div><div class="nm-answer-work"><div class="nm-board">
      ${splitQuestion?splitNumberEquation(cur):`${pracTex}<div class="nm-numpad-screen${isMulti?' nm-multi':''}${shapeCls}" id="pscreen">${isMulti?multiScreenHtml():'&nbsp;'}</div>`}
    </div>
    <div class="nm-numpad" id="pad"></div>
    <div class="nm-hint">${t('numpadHint')}</div></div>
  </div>`;
  S.sub.started=true;
  renderMath(body);
  if(isMulti)bindMultiBoxes($('#pscreen'));
  const isDecAns=cur&&(isMulti?cur.answer.some(a=>!Number.isInteger(a)):!Number.isInteger(cur.answer));
  buildNumpad($('#pad'),val=>handlePractice(val,body,u),{decimal:isDecAns,negative:!!cur.negative});
  say(first?L(cfg.intro):L(cur.prompt));
}
/* Pointer-based bounded manipulatives also accept native keyboard activation.
   Delegate on their host so rerendered plates/tokens keep the same handlers. */
function wireManipulativeKeys(host){
  const names={ko:'교구',en:'Piece',zh:'教具'},checks={ko:'답 확인',en:'Check answer',zh:'确认答案'};
  host.querySelectorAll('button').forEach((b,i)=>{
    if(!b.getAttribute('aria-label')&&!b.textContent.trim())b.setAttribute('aria-label',`${names[S.lang]||names.ko} ${i+1}`);
    if(b.matches('.nm-tm-done,.nm-nb-done'))b.setAttribute('aria-label',checks[S.lang]||checks.ko);
    if(b.closest('.nm-g46-srow.locked'))b.disabled=true;
  });
  const ask=host.querySelector('.nm-nb-node.ask');
  if(ask){ask.tabIndex=0;ask.setAttribute('role','button');ask.setAttribute('aria-label',L({ko:'빈 원 채우기. 지우기는 Backspace',en:'Fill the empty circle. Backspace removes one',zh:'填空圆，退格键可删除一个'}));}
  const rows=host.querySelector('.nm-g46-srows');
  if(rows){rows.tabIndex=0;rows.setAttribute('role','region');rows.setAttribute('aria-label',L({ko:'가르기 방법',en:'Different splitting methods',zh:'不同的分法'}));}
  host.addEventListener('keydown',e=>{
    const b=e.target.closest('button,[role="button"]');
    if(!b||!host.contains(b)||b.disabled)return;
    if(b.classList.contains('nm-g79-tickbtn')&&['ArrowLeft','ArrowRight'].includes(e.key)){
      e.preventDefault();const ticks=[...host.querySelectorAll('.nm-g79-tickbtn')],i=ticks.indexOf(b);
      ticks[Math.max(0,Math.min(ticks.length-1,i+(e.key==='ArrowLeft'?-1:1)))].focus();return;
    }
    if(['Backspace','Delete'].includes(e.key)&&b.matches('.nm-nb-node.ask,.nm-g46-plate,.nm-g46-half')){
      e.preventDefault();if(e.repeat)return;
      const tokens=b.querySelectorAll('.nm-nb-fill,.nm-g46-tk'),last=tokens[tokens.length-1];
      if(last)last.dispatchEvent(new Event('pointerup',{bubbles:true}));return;
    }
    if(e.key==='Enter'||e.key===' '){e.preventDefault();if(!e.repeat)b.dispatchEvent(new Event('pointerup',{bubbles:true}));}
  });
}
function runPracticeWidget(body,u,cur,first,need){
  const cfg=u.practice;
  const gridFit=cur.widget==='g13Grid'&&cur.cols<=5;
  const widgetFit=true; // Every widget keeps its guide separate from its work area.
  body.innerHTML=`<div class="nm-dialog${widgetFit?' nm-widget-dialog '+(gridFit?'nm-grid-dialog':'nm-manipulative-dialog'):''}">
    <div class="nm-prog">${dots(need,S.sub.pIdx)}</div>
    ${widgetFit?'<div class="nm-widget-guide">':''}
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56,{mood:'think'}):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble" id="bub">${first&&!widgetFit?numiDialogueHtml(L(cfg.intro))+'<br><br>'+numiDialogueHtml(L(cur.prompt)):numiDialogueHtml(L(cur.prompt))}</div>
    ${widgetFit?'</div><div class="nm-widget-work">':''}
    <div id="pracWidget" class="nm-lab-widget nm-board"></div>
    ${widgetFit?'</div>':''}
  </div>`;
  S.sub.started=true;
  say(first?L(cfg.intro):L(cur.prompt));
  NM_WIDGETS.render(cur,$('#pracWidget'),val=>{
    if(+val===cur.answer){
      if(NM_WIDGETS._isYoungBand&&NM_WIDGETS._isYoungBand())NM_WIDGETS._correctTone();
      toast(t('correct'),true);numiHappy();
      S.sub.pIdx++;S.sub.cur=null;
      if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');lessonLater(()=>gotoStep('discover'),700);return;}
      S.sub.cur=genProblem(cfg,'practice');save();
      lessonLater(()=>runPractice(body,u),650);
    }else{
      toast(t('tryAgain'),false);
    }
  });
  if(widgetFit&&!gridFit)wireManipulativeKeys($('#pracWidget'));
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
        if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');lessonLater(()=>gotoStep('discover'),700);return;}
        S.sub.cur=genProblem(u.practice,'practice');save();
        lessonLater(()=>runPractice(body,u),650);
      }else{toast(t('tryAgain'),false);multiClear(cur.answer);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);updateLiveFill('.nm-lab-expr',S.sub.mvals);}
      return;
    }
    const inp=S.sub.inp||'';if(inp===''||inp==='-')return;
    if(parseFloat(inp)===cur.answer){
      toast(t('correct'),true);numiHappy();
      S.sub.pIdx++;S.sub.inp='';S.sub.cur=null;
      if(S.sub.pIdx>=need){markStepDone(S.unit,'practice');lessonLater(()=>gotoStep('discover'),700);return;}
      S.sub.cur=genProblem(u.practice,'practice');save();
      lessonLater(()=>runPractice(body,u),650);
    }else{toast(t('tryAgain'),false);S.sub.inp='';$('#pscreen').textContent=$('.nm-split-equation')?'□':' ';updateLiveFill('.nm-lab-expr','');}
    return;
  }
  if(isMulti){
    applyMultiKey(val);
    const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);
    updateLiveFill('.nm-lab-expr',S.sub.mvals);
    return;
  }
  if(val==='del'){S.sub.inp=(S.sub.inp||'').slice(0,-1);}
  else if(val==='-'){S.sub.inp=applyMinusKey(S.sub.inp||'');}
  else if((S.sub.inp||'').replace('-','').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.'))){S.sub.inp=(S.sub.inp||'')+val;}
  $('#pscreen').textContent=S.sub.inp||($('.nm-split-equation')?'□':' ');
  updateLiveFill('.nm-lab-expr',S.sub.inp||'');
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
  const living=window.NM_LIVING_LESSONS&&NM_LIVING_LESSONS.has(u.id);
  const strategy=living&&['A-02','M-02','T-DV4'].includes(u.id);
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
  /* 수학사 네 컷 만화(data/story-comics.js) — 등록된 유닛은 🏛 한 줄 대신 만화.
     캡션이 이야기를 다 전하므로 산문 history는 그 유닛에선 그리지 않는다. */
  const comic=window.NM_COMICS&&NM_COMICS[u.id];
  const histHtml=comic
    ?`<div class="nm-comic-h">${kid?'📖 '+(S.lang==='ko'?'네 컷 이야기':S.lang==='en'?'A Story in 4 Panels':'四格故事')
        :'🏛 '+(S.lang==='ko'?'네 컷 수학사':S.lang==='en'?'Math History in 4 Panels':'四格数学史')}</div>
      <div class="nm-comic">${comic.panels.map((p,i)=>`<figure class="nm-comic-panel">
        <span class="nm-comic-no">${i+1}</span>
        <div class="nm-comic-art">${p.art}</div>
        <figcaption class="nm-comic-cap">${L(p.text)}</figcaption>
      </figure>`).join('')}</div>`
    :(st&&st.history?`<div class="nm-story-hist">🏛 ${L(st.history)}</div>`:'');
  const storyHtml=st?`${artHtml}<div class="nm-story${isMidHigh?' doc':''}">
      ${isMidHigh?`<img class="nm-story-char" src="assets/docssam.png" alt="">`:`<img class="nm-story-numi" src="assets/images/characters/numi.png" alt="">`}
      <div class="nm-story-bubble">${L(st.hook)}</div>
    </div>${histHtml}`:(comic?histHtml:'');   /* 이야기 훅이 없는 유닛(N-02·03·05 등)도 만화는 보인다(2026-10-05) */
  /* 이 개념과 짝인 실험실이 있으면(UNIT_LABS) 노트 하단에서 바로 연다.
     두 개 이상 걸린 유닛도 있어(M-15·C-05) 실험실마다 제 이름으로 버튼을 낸다. */
  /* 마법 노트 짧은 영상(data/magic-note-videos.js, 2026-10-23) — 등록된 유닛만. 글 단계는 그대로 둔다. */
  const videoBtnHtml=window.NM_MAGIC_NOTE_VIDEOS&&NM_MAGIC_NOTE_VIDEOS.has(u.id)&&window.NM_MAGIC_NOTE_PLAYER?.available(u.id,S.lang)
    ?`<button class="nm-btn full nm-mnv-open" id="mnvOpen" type="button">▶ ${S.lang==='ko'?'영상으로 보기':S.lang==='en'?'Watch the video':'看视频'}</button>`:'';
  const unitLabs=unitLabsFor(u.id);
  const labLead=S.lang==='ko'?'실험실에서 직접 해보기':S.lang==='en'?'Try it in the lab':'去实验室动手试试';
  const labBtnHtml=unitLabs.length
    ?`<div class="nm-lab-links"><div class="nm-lab-lead">🧪 ${labLead}</div>${
      unitLabs.map(file=>{
        const m=labMetaOf(file);
        return `<button class="nm-btn full nm-lab-link" data-lab="${esc(file)}">${
          m?`${m.icon} ${esc(L(m.name))}`:'🧪 '+labLead}</button>`;
      }).join('')}</div>`
    :'';
  /* 매거진형(2026-09-25, 원장 "이런 식으로 매거진 형으로 … 풀고 싶게" · "이렇게 디자인 둘 다") — 인쇄의
     수학 이야기·개념 노트와 같은 짜임: 키커 · 큰 제목 · 여는 물음 · 이야기 카드(두 컷 + 역사 문단) · 네 컷 띠 ·
     개념 노트. 유아(kid-note)는 예전 그림책 모양 그대로. 내용은 전부 유닛·만화 데이터. */
  /* 3D 대표 그림(data/hero3d.js · assets/hero3d, 2026-09-26 원장 "실사 느낌 … 막대도 실제 막대처럼 정 안되면 3d로") —
     등록된 유닛만. 제목 바로 아래 가장 크게, alt 는 그림에 놓인 것(3개 언어). */
  const hero=(window.NM_HERO3D||{})[u.id];
  const heroHtml=hero?`<figure class="nm-mzu-hero"><img src="assets/hero3d/${esc(u.id)}.webp" alt="${esc(L(hero.alt))}" loading="lazy" width="1600" height="1000">
    <figcaption class="nm-mzu-hero-hint">${S.lang==='ko'?'끌어서 돌려 보세요':S.lang==='en'?'Drag to turn':'拖动可以旋转'}</figcaption></figure>`:'';
  const mzKick=(ko,en,zh)=>`<div class="nm-mzu-kick">${S.lang==='ko'?ko:S.lang==='en'?en:zh}</div>`;
  const mzStory=(!kid&&st)?`<div class="nm-mzu">
      ${mzKick('MATH STORY · 수학 이야기','MATH STORY','MATH STORY · 数学故事')}
      <div class="nm-mzu-top"><div><h2 class="nm-mzu-title">${esc(L(u.title))}</h2>
        ${st.hook?`<p class="nm-mzu-sub">${L(st.hook)}</p>`:''}</div>
        <img class="nm-mzu-char" src="${isMidHigh?'assets/docssam.png':'assets/characters/numi-0-happy.png'}" alt=""></div>
      ${heroHtml}${artHtml}
      ${comic?`<div class="nm-mzu-story"><div class="nm-mzu-story-art">${comic.panels.slice(0,2).map(p=>`<div>${p.art}</div>`).join('')}</div>
        <div class="nm-mzu-story-txt"><div class="nm-mzu-mini">${S.lang==='ko'?'그때 이야기':S.lang==='en'?'Back then':'那时的故事'}</div>
        ${st.history?`<p>${L(st.history)}</p>`:''}</div></div>
      <div class="nm-mzu-sec"><span>01—0${Math.min(4,comic.panels.length)}</span>${S.lang==='ko'?'네 컷으로 읽기':S.lang==='en'?'The story in four frames':'四格读故事'}</div>
      <div class="nm-mzu-strip">${comic.panels.slice(0,4).map((p,i)=>`<figure><div class="nm-mzu-strip-art">${p.art}</div><figcaption><i>${i+1}</i>${L(p.text)}</figcaption></figure>`).join('')}</div>`
      :(st.history?`<div class="nm-mzu-story solo"><div class="nm-mzu-story-txt"><div class="nm-mzu-mini">${S.lang==='ko'?'그때 이야기':S.lang==='en'?'Back then':'那时的故事'}</div><p>${L(st.history)}</p></div></div>`:'')}
      ${mzKick('CONCEPT · '+L(d.title),'CONCEPT · '+L(d.title),'CONCEPT · '+L(d.title))}
    </div>`:'';
  body.innerHTML=`<div class="nm-card${kid&&!living?' kid-note':''}${mzStory?' nm-mzu-card':''}${living?' nm-live-card':''}">
    ${kid&&!living?`<div class="nm-kid-hero">${u.icon?iconArt(u.icon):'📓'}</div>`:''}
    ${living?`<div id="livingLesson"></div>${kid&&comic?histHtml:''}${!kid&&!strategy&&st&&st.history?`<details class="nm-live-history"><summary>${S.lang==='ko'?(kid?'수 이야기 더 보기':'이 교구의 수학 이야기'):S.lang==='en'?'The story behind the pieces':'教具里的数学故事'}</summary><p>${L(st.history)}</p></details>`:''}`:mzStory||`<div class="nm-card-h">📓 ${L(d.title)}</div>${storyHtml}`}${videoBtnHtml}<div id="cstages"></div>
    ${!strategy?`<div class="nm-rule"><b>${t('ruleLabel')}</b><p>${L(d.rule)}</p></div>`:''}
    ${labBtnHtml}<button class="nm-btn full" id="toCheck">${t('next')}</button></div>`;
  /* 3D 대표 그림을 직접 띄워 움직인다(app/hero3d/live.js, 원장 "동작도 하는거야?" → "1"). 3D 라이브러리는 이 단계에서만
     불러온다(약 2MB — 첫 화면에 싣지 않는다). 못 띄우면 정지 그림이 그대로 남는다. */
  const mnvBtn=body.querySelector('#mnvOpen');
  if(mnvBtn)mnvBtn.onclick=()=>{stopVoice();NM_MAGIC_NOTE_PLAYER.open(u.id,{lang:S.lang,onTry:()=>{const n=$('#toCheck');if(n&&!n.disabled)n.click();}});};
  const heroFig=body.querySelector('.nm-mzu-hero');
  if(heroFig) import('./hero3d/live.js').then(m=>m.mount(heroFig,u.id,S.lang)).catch(()=>{});
  const livingHost=body.querySelector('#livingLesson');
  if(livingHost){
    const lang=S.lang;
    livingHost.textContent=lang==='ko'?'교구를 준비하고 있어요':lang==='en'?'Preparing the pieces':'正在准备教具';
    if(strategy)$('#toCheck').disabled=true;
    const journeyOptions=strategy?{
      saved:S.conceptJourneys?.[u.id],
      save:state=>{
        const old=S.conceptJourneys;S.conceptJourneys={...(old||{}),[u.id]:state};
        if(!persistState()){S.conceptJourneys=old;throw new Error('concept_journey_save_failed');}
        cloudPushSoon();
      },
      onStatus:status=>{const next=body.querySelector('#toCheck');if(next)next.disabled=!(status.complete&&status.saved);},
      onTown:()=>{S.view='town';save();render();}
    }:{};
    import('./living-lesson.js?v=20261014-arrival').then(m=>m.mount(livingHost,u.id,lang,journeyOptions)).catch(()=>{
      if(livingHost.isConnected)livingHost.textContent=lang==='ko'?'교구를 불러오지 못했습니다. 아래 개념으로 계속 학습할 수 있습니다.':lang==='en'?'The pieces could not load. Continue with the concept below.':'教具加载失败。可以继续学习下方概念。';
    });
  }
  body.querySelectorAll('.nm-lab-link[data-lab]').forEach(el=>{
    el.onclick=()=>{window.open(el.dataset.lab,'_blank','noopener');};
  });
  const host=body.querySelector('#cstages');
  (strategy?[]:stages).forEach(s=>{
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
    mountConceptScene(wrap,u,d.stages.indexOf(s));
  });
  $('#toCheck').onclick=()=>{if($('#toCheck').disabled)return;markStepDone(S.unit,'discover');gotoStep(u.tier==='basic'?'lab':'check');};
}

/* 개념 애니메이션 붙이기 (개념애니-설계.md 2단계) — mathSteps 아래에 "움직이는 예"를 얹는다.
   기존 mathSteps·result·book은 그대로 두고 덧붙이기만 한다(원칙 3: 승격이지 폐기가 아님).
   장면의 수는 유닛 파일의 산문이 아니라 **생성기 반환값**에서만 나온다 — 매번 다른 수가
   나오므로 "다른 수로" 버튼이 그대로 새 예가 된다. 매핑이 없는 유닛(현재 184개)은 조용히 통과. */
function mountConceptScene(wrap,u,stageIndex){
  if(!window.NM_SCENE||!window.NM_CANIM)return;
  const cfg=NM_SCENE.configFor(u.id,stageIndex);
  if(!cfg)return;
  const host=document.createElement('div');wrap.appendChild(host);
  try{
    NM_CANIM.mount(host,{
      lang:S.lang,
      title:L(cfg.title),
      make:()=>NM_SCENE.buildFor(u.id,stageIndex,
        genProblem({generator:cfg.generator,params:cfg.params},(cfg.params&&cfg.params.level)||'main'),
        L(u.title))
    });
  }catch(e){
    /* 조용히 사라지면 "그림이 원래 없는 유닛"과 구별이 안 된다 — 화면에 남긴다. */
    console.error('[concept-scene]',u.id,stageIndex,e);
    host.className='nm-cscene-err';
    host.textContent=(S.lang==='ko'?'개념 애니메이션을 만들지 못했어요: ':S.lang==='en'?'Could not build the concept animation: ':'无法生成概念动画：')+e.message;
  }
}

/* ============================================================
   기호 도감 (과정-로드맵.md §13) — 수집 모달 + 도감 화면
   unit.symbols:[{sym,read,translate,birth}] (기존 5유닛은 한글 단일 문자열,
   L()도 typeof string이면 그대로 문자열을 돌려주므로 symText가 둘 다 받는다).
   ============================================================ */
function symText(v){return typeof v==='string'?v:L(v);}
/* 도감 카드의 기호 친구 — 젤리 SVG 캐릭터(app/jelly-char.js). 기호 마법단 PNG(sym-*.png)가 있으면 그것을 위에 덮고,
   없으면(대부분) SVG 가 그대로 보인다. 0 은 누미. 둘 다 없는 글자는 예전처럼 글자만. */
const DEX_PNG={'+':'plus','=':'equal','−':'minus','×':'times','÷':'divide','√':'sqrt','%':'percent','π':'pi','Σ':'sigma','∞':'infinity'};
const DEX_HUES=['#2f7fd8','#e8742a','#2fa36b','#8a5fd0','#d94f7a','#16a0b8'];
/* 이모지 아이콘 자리에 쓰는 그림 — 젤리 물건(object-art.js)이 있으면 SVG, 없으면 글자 그대로 */
function iconArt(ic){
  if(window.NM_OBJECTS&&ic&&window.NM_OBJECTS.has(ic)){const o=window.NM_OBJECTS.svg(ic);if(o)return`<span class="nm-art-obj" aria-hidden="true">${o}</span>`;}
  return esc(ic||'');
}
function dexFigure(sym,px){
  const base=window.NM_CHAR_BASE||'assets/characters/';
  if(sym==='0')return`<span class="nm-dex-fig" style="height:${px}px"><img src="${base}numi-0.png" alt="0" draggable="false" class="solo"></span>`;
  const J=window.NM_JELLY;
  if(!J||!J.has(sym))return`<div class="nm-dex-sym">${esc(sym)}</div>`;
  const hue=DEX_HUES[Math.abs([...String(sym)].reduce((a,c)=>a*31+c.charCodeAt(0),7))%DEX_HUES.length];
  const png=DEX_PNG[sym];
  return`<span class="nm-dex-fig" style="height:${px}px" role="img" aria-label="${esc(sym)}">${J.svg(sym,{color:hue,size:Math.round(px/1.25),label:sym})}${png?`<img src="${base}sym-${png}.png" alt="" draggable="false" onload="var f=this.parentNode&&this.parentNode.querySelector('svg');if(f)f.style.visibility='hidden'" onerror="this.style.display='none'">`:''}</span>`;
}
/* "새 기호 카드!" 모달 — 앞면(기호+읽는 법) 탭하면 뒤집혀 뒷면(번역+탄생 이야기).
   닫으면(=수집하기) S.symbolDex에 저장하고 목록의 다음 기호(있으면)를 이어서 띄운다. */
function symbolCardModalHtml(sy){
  if(window.NM_SYMBOL_CARDS){const registry=orderedUnitSymbols();return NM_SYMBOL_CARDS.acquisitionHtml(sy,{lang:S.lang,figure:dexFigure,index:registry.findIndex(x=>x.sym===sy.sym)+1,total:registry.length});}
  const ko=S.lang==='ko',en=S.lang==='en';
  return`<div class="nm-gate-overlay nm-symmodal-overlay" id="nmSymModal">
    <div class="nm-gate-card nm-symmodal-card">
      <div class="nm-symmodal-badge">✨ ${ko?'새 기호 카드!':en?'New Symbol Card!':'新符号卡！'}</div>
      <div class="nm-dex-card big" id="nmSymFlip">
        <div class="nm-dex-flip">
          <div class="nm-dex-face front">
            ${dexFigure(sy.sym,118)}
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
function clearSymbolAcquisition(){
  if(symbolAcquisitionCleanup){symbolAcquisitionCleanup();symbolAcquisitionCleanup=null;}
  document.querySelectorAll('#nmSymModal').forEach(modal=>modal.remove());
}
function showSymbolCardModal(list,idx,u){
  clearSymbolAcquisition();
  if(idx>=list.length)return;
  const sy=list[idx],owner=S;
  document.body.insertAdjacentHTML('beforeend',symbolCardModalHtml(sy));
  const modal=$('#nmSymModal');
  const collect=()=>{
    if(S!==owner||!modal.isConnected)return false;
    const old=S.symbolDex[sy.sym];S.symbolDex[sy.sym]={unitId:u.id,earnedAt:Date.now()};
    if(!save()){if(old===undefined)delete S.symbolDex[sy.sym];else S.symbolDex[sy.sym]=old;return false;}
    clearSymbolAcquisition();showSymbolCardModal(list,idx+1,u);return true;
  };
  if(window.NM_SYMBOL_CARDS){
    symbolAcquisitionCleanup=NM_SYMBOL_CARDS.bindAcquisition(modal,{onCollect:collect});return;
  }
  const flip=$('#nmSymFlip');
  flip.onclick=()=>flip.classList.toggle('flipped');
  $('#nmSymClose').onclick=()=>{
    if(!collect())toast(S.lang==='en'?'Could not save the card. Please try again.':S.lang==='zh'?'未能保存卡片，请重试。':'카드를 저장하지 못했어요. 다시 시도해 주세요.',false);
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
function orderedUnitSymbols(){
  const rankOf=uid=>{const m=/^([A-Z])-(\d+)/.exec(uid)||[];return ({N:0,A:1,B:2,C:3,H:4,M:5}[m[1]]??9)*1000+(+m[2]||0);};
  return allUnitSymbols().sort((a,b)=>rankOf(a.unitId)-rankOf(b.unitId));
}
function symDexCardHtml(sym,real){
  const ko=S.lang==='ko',en=S.lang==='en';
  /* 빈 자리(§3): 물음표 대신 그 기호 자체를 20% 흐리게(실루엣)로 미리 보여준다 —
     실제 문구는 SYMBOL_DEX_CANON의 glyph(sym 인자) 그대로, 진짜 뜻은 만나야 열린다. */
  const notMet=`<div class="nm-dex-card unknown"><div class="nm-dex-flip"><div class="nm-dex-face front">
    ${dexFigure(sym,70)}<div class="nm-dex-read">${ko?'아직 만나지 못한 기호':en?'Not met yet':'尚未遇到的符号'}</div>
  </div></div></div>`;
  if(!real)return notMet;
  const collected=!!S.symbolDex[real.sym];
  if(!collected)return notMet.replace('nm-dex-card unknown','nm-dex-card silhouette');
  return`<div class="nm-dex-card collected" data-sym="${esc(real.sym)}">
    <div class="nm-dex-flip">
      <div class="nm-dex-face front">${dexFigure(real.sym,70)}<div class="nm-dex-read">${esc(symText(real.read))}</div></div>
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
  /* 도감 순서(2026-10-01) — 배우는 순서대로: 유아(N)→초등(A·B·C)→고급(H)→중등(M). 유닛에 연결된 기호만
     센다(이전엔 틀 10칸 중 5칸이 어느 유닛에도 연결되지 않아 영원히 빈칸이었다). */
  const ordered=orderedUnitSymbols();
  if(window.NM_SYMBOL_CARDS){
    symbolCardsCleanup=NM_SYMBOL_CARDS.mount(scr,{symbols:ordered,collected:S.symbolDex,lang:S.lang,figure:dexFigure,backLabel:'← '+navigationLabel(S._dexFrom==='title'?'title':'town'),
      onBack:()=>{const back=S._dexFrom||'town';S._dexFrom=null;S.view=back;save();render();}});return;
  }
  const canonCards=ordered.map(sy=>symDexCardHtml(sy.sym,sy)).join('');
  const extraCards='';
  const collectedCount=Object.keys(S.symbolDex||{}).length;
  scr.innerHTML=`<div class="nm-gc-wrap nm-dex-wrap">
    <div class="nm-gc-header">
      <button class="nm-back" id="dexBack">← ${navigationLabel(S._dexFrom==='title'?'title':'town')}</button>
      <div class="nm-gc-title">📖 ${ko?'기호 도감':en?'Symbol Dex':'符号图鉴'} <small>${collectedCount}</small></div>
    </div>
    <div class="nm-gc-body">
      <p class="nm-dex-sub">${ko?'배운 기호를 모아보세요. 카드를 탭하면 뒤집혀요.':en?"Collect the symbols you've learned — tap a card to flip it.":'收集你学过的符号——点击卡片可以翻面。'}</p>
      <div class="nm-dex-grid">${canonCards}</div>
      <p class="nm-dex-hint">${ko?`기호 친구는 단원을 마칠 때마다 한 명씩 찾아와요 · 전체 ${all.length}명`:en?'Symbol friends arrive as you climb the course':'符号朋友会随课程提升一个个到来'}</p>
      ${extraCards?`<div class="nm-dex-sec-h">${ko?'더 만난 기호':en?'More symbols met':'更多遇到的符号'}</div><div class="nm-dex-grid">${extraCards}</div>`:''}
    </div>
  </div>`;
  $('#dexBack').onclick=()=>{const back=S._dexFrom||'town';S._dexFrom=null;S.view=back;save();render();};
  bindDexCards(scr);
}

/* ============================================================
   매거진(읽을거리) — 마을 가판대 (2026-09-20)
   원장: "도형이 여기 있을 리는 없어 — 매거진인 거야." / "이 파트도 마을에 있어야지."

   「수의 마법」은 연산 앱이라 평균·도형·확률 이야기는 붙일 유닛이 없다. 억지로 유닛에
   넣으면 유닛이 망가지므로 **유닛 밖 읽을거리는 매거진 기사**로 싣는다. 데이터는
   data/magazine.js 하나이고, 같은 글이 학습지(app/exam.js w2MagazinePageHtml)에도 나간다 —
   한 벌을 두 군데서 쓴다. 읽은 기사는 S.magazine.read 에 남겨 목록에 표시한다.
   상태: S._mzOpen(지금 펼친 기사 id, 저장 안 함) · S.magazine.read(영구)
   ============================================================ */
function mzArticles(){ return (window.NM_MAGAZINE && window.NM_MAGAZINE.articles) || []; }
function mzRead(id){ return !!((S.magazine||{}).read||{})[id]; }
function mzMarkRead(id){
  if(!S.magazine) S.magazine={read:{}};
  if(!S.magazine.read) S.magazine.read={};
  S.magazine.read[id]=true;
}
function screenMagazine(){
  const scr=$('#screen'), ko=S.lang==='ko', en=S.lang==='en';
  const list=mzArticles();
  const open=S._mzOpen ? list.find(a=>a.id===S._mzOpen) : null;
  const M=window.NM_MAGAZINE||{};
  const head=(title,backId)=>`<div class="nm-gc-header">
      <button class="nm-back" id="${backId}">← ${navigationLabel('town')}</button>
      <div class="nm-gc-title">📰 ${esc(title)}</div>
    </div>`;

  if(!open){
    const cards=list.map(a=>`
      <button class="nm-mzl-card" data-mz="${esc(a.id)}">
        <div class="nm-mzl-art">${a.art||''}</div>
        <div class="nm-mzl-txt">
          <span class="nm-mzl-kicker">${esc(L(a.kicker))}</span>
          <div class="nm-mzl-title">${esc(L(a.title))}</div>
          <div class="nm-mzl-lede">${esc(L(a.lede))}</div>
          ${mzRead(a.id)?`<span class="nm-mzl-read">${ko?'✓ 읽었어요':en?'✓ Read':'✓ 已读'}</span>`:''}
        </div>
      </button>`).join('');
    scr.innerHTML=`<div class="nm-gc-wrap">
      ${head(L(M.name)||(ko?'매거진':en?'Magazine':'杂志'),'mzBack')}
      <div class="nm-gc-body">
        <p class="nm-mzl-sub">${esc(L(M.tagline)||'')}</p>
        <div class="nm-mzl-grid">${cards}</div>
      </div>
    </div>`;
    $('#mzBack').onclick=()=>{S.view='town';save();render();};
    scr.querySelectorAll('[data-mz]').forEach(b=>{
      b.onclick=()=>{S._mzOpen=b.getAttribute('data-mz');render();};
    });
    return;
  }

  /* 기사 — 읽으러 들어온 순간 읽음으로 남긴다(끝까지 내렸는지는 묻지 않는다) */
  mzMarkRead(open.id); save();
  const idx=list.indexOf(open), next=list[(idx+1)%list.length];
  const secs=(open.body||[]).map(b=>`
    <div class="nm-mza-sec">
      <h4>${esc(L(b.h))}</h4>
      <p>${esc(L(b.p))}</p>
      <div class="nm-mza-fig">${b.art||''}</div>
    </div>`).join('');
  scr.innerHTML=`<div class="nm-gc-wrap">
    ${head(L(M.name)||(ko?'매거진':en?'Magazine':'杂志'),'mzBack')}
    <div class="nm-gc-body">
      <article class="nm-mza">
        <div class="nm-mza-kicker">${esc(L(open.kicker))}</div>
        <h3 class="nm-mza-title">${esc(L(open.title))}</h3>
        <p class="nm-mza-lede">${esc(L(open.lede))}</p>
        <div class="nm-mza-hero">${open.art||''}</div>
        ${secs}
        <div class="nm-mza-close">${esc(L(open.close))}</div>
        <p class="nm-mza-src">${esc(L(open.source))}</p>
        <div class="nm-mza-nav">
          <button class="nm-btn ghost" id="mzList">${ko?'매거진 목록으로':en?'Back to magazine list':'返回杂志目录'}</button>
          ${list.length>1?`<button class="nm-btn" id="mzNext">${ko?'다음 기사':en?'Next article':'下一篇'} →</button>`:''}
        </div>
      </article>
    </div>
  </div>`;
  $('#mzBack').onclick=()=>{S._mzOpen=null;S.view='town';save();render();};
  $('#mzList').onclick=()=>{S._mzOpen=null;render();};
  const nx=$('#mzNext');
  if(nx)nx.onclick=()=>{S._mzOpen=next.id;scr.scrollTop=0;window.scrollTo(0,0);render();};
}

/* ============================================================
   수학사 퀴즈 — 네 컷 순서 맞히기 (마을세계관-설계.md §3 남쪽 항구 · §5 step5)
   data/story-comics.js의 window.NM_COMICS[유닛id]={panels:[{art,text},×4]}를 그대로 쓴다.
   문항을 새로 안 쓰고 "이미 있는 만화 95편의 순서를 섞어 되맞히기"만 하는 게임형 퀴즈.
   S.histQuiz={queue:[유닛id,…],done:{유닛id:true}}만 저장(정답 큐·완료 기록) — 화면에
   떠 있는 현재 퍼즐의 섞인 순서·고른 순서는 hqPuzzle(모듈 변수, 저장 안 함)에 둔다.
   ============================================================ */
function shuffleArr(a){for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}
/* 큐가 비면 새로 짠다 — 이미 끝난 유닛(stepDone(uid,'stamp'))을 먼저, 그 다음 나머지.
   done(이번 라운드에서 이미 맞힌 만화)에 없는 것만 대상으로 삼고, 전부 done이면
   done을 비우고 전체로 다시 돈다(스펙: "skip ones in done until all are done, then reset"). */
function histQuizEnsure(){
  if(!S.histQuiz)S.histQuiz={queue:[],done:{}};
  if(!S.histQuiz.done)S.histQuiz.done={};
  if(S.histQuiz.queue&&S.histQuiz.queue.length)return;
  const ids=Object.keys(window.NM_COMICS||{});
  if(!ids.length){S.histQuiz.queue=[];return;}
  let remain=ids.filter(id=>!S.histQuiz.done[id]);
  if(!remain.length){S.histQuiz.done={};remain=ids.slice();}
  const finished=shuffleArr(remain.filter(id=>stepDone(id,'stamp')));
  const rest=shuffleArr(remain.filter(id=>!stepDone(id,'stamp')));
  S.histQuiz.queue=finished.concat(rest);
  save();
}
/* 새 퍼즐 — 패널 4장의 원래 인덱스(0~3=정답 순서)를 섞는다. 이미 섞은 게 우연히
   정답 순서([0,1,2,3])와 같으면(1/24 확률) 재섞음 — 탭 한 번으로 끝나는 퍼즐 방지. */
function histQuizNewPuzzle(uid){
  let order=[0,1,2,3];
  for(let tries=0;tries<6;tries++){
    order=shuffleArr([0,1,2,3]);
    if(order.some((v,i)=>v!==i))break;
  }
  return {uid,order,picked:[],checked:null};
}
function hqOrderRowHtml(comic){
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const slots=[0,1,2,3].map(i=>{
    const oi=hqPuzzle.picked[i];
    if(oi===undefined)return `<div class="nm-hq-slot empty">${i+1}</div>`;
    const p=comic.panels[oi];
    return `<div class="nm-hq-slot filled"><span class="nm-hq-badge">${i+1}</span><div class="nm-hq-slot-art">${p.art}</div></div>`;
  }).join('');
  return `<div class="nm-hq-order-h">${lk('내 순서','My order','我的顺序')}</div>
    <div class="nm-hq-order-row">${slots}</div>`;
}
function hqGridHtml(comic){
  const pickedIdx={};hqPuzzle.picked.forEach((oi,i)=>{pickedIdx[oi]=i+1;});
  return `<div class="nm-hq-grid">${hqPuzzle.order.map(oi=>{
    const p=comic.panels[oi];
    const badge=pickedIdx[oi];
    return `<button class="nm-hq-panel${badge?' picked':''}" data-i="${oi}">
      ${badge?`<span class="nm-hq-badge">${badge}</span>`:''}
      <div class="nm-comic-art">${p.art}</div>
      <div class="nm-comic-cap">${L(p.text)}</div>
    </button>`;
  }).join('')}</div>`;
}
function hqPuzzleBodyHtml(uid,comic){
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const unitTitle=UNITS[uid]?L(UNITS[uid].title):uid;
  const canCheck=hqPuzzle.picked.length===4;
  return `<div class="nm-hq-unit-hint">${esc(unitTitle)}</div>
    ${hqOrderRowHtml(comic)}
    <div class="nm-hq-grid-h">${lk('네 컷을 순서대로 탭해 보세요','Tap the panels in order','按顺序点击四格')}</div>
    ${hqGridHtml(comic)}
    ${hqPuzzle.checked==='no'?`<div class="nm-hq-wrong">${lk('음, 순서가 조금 달라. 다시 볼까?','Hmm, the order is a bit off. Look again?','嗯，顺序有点不对，再看看？')}</div>`:''}
    <div class="nm-hq-btns">
      <button class="nm-btn ghost" id="hqReset">${lk('다시','Reset','重来')}</button>
      <button class="nm-btn full" id="hqCheck"${canCheck?'':' disabled'}>${lk('확인','Check','确认')}</button>
    </div>`;
}
function hqSuccessBodyHtml(comic){
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const panelsHtml=comic.panels.map((p,i)=>`<div class="nm-comic-panel">
      <span class="nm-comic-no">${i+1}</span>
      <div class="nm-comic-art">${p.art}</div>
      <div class="nm-comic-cap">${L(p.text)}</div>
    </div>`).join('');
  return `<div class="nm-card-h">${lk('맞았어! 이야기가 이렇게 흘렀어요','Right! That is how the story went','答对了！故事就是这样发展的')}</div>
    <div class="nm-comic">${panelsHtml}</div>
    <div class="nm-hq-btns">
      <button class="nm-btn full" id="hqNext">${lk('다음 이야기 →','Next story →','下一个故事 →')}</button>
      <button class="nm-btn ghost" id="hqToTown">${lk('마을로','Back to town','回村庄')}</button>
    </div>`;
}
function bindHistQuizPuzzle(scr,uid,comic){
  scr.querySelectorAll('.nm-hq-panel[data-i]').forEach(b=>{
    b.onclick=()=>{
      const oi=+b.dataset.i;
      const idx=hqPuzzle.picked.indexOf(oi);
      if(idx>=0)hqPuzzle.picked.splice(idx,1);           // 이미 고른 패널 다시 탭 → 취소
      else{ if(hqPuzzle.picked.length>=4)return; hqPuzzle.picked.push(oi); }
      hqPuzzle.checked=null;
      screenHistQuiz();
    };
  });
  const rb=scr.querySelector('#hqReset');
  if(rb)rb.onclick=()=>{ hqPuzzle.picked=[]; hqPuzzle.checked=null; screenHistQuiz(); };
  const cb=scr.querySelector('#hqCheck');
  if(cb)cb.onclick=()=>{
    if(hqPuzzle.picked.length!==4)return;
    const ok=hqPuzzle.picked.every((oi,i)=>oi===i);
    if(ok){
      if(!S.histQuiz.done)S.histQuiz.done={};
      const already=!!S.histQuiz.done[uid];
      S.histQuiz.done[uid]=true;
      hqPuzzle.checked='ok';
      if(!already){
        const awarded=coinAdd(1,'training','training:'+uid);
        if(coinAdd.saveFailed){delete S.histQuiz.done[uid];hqPuzzle.checked=null;screenHistQuiz();return;}
        if(awarded)toast('🪙 +'+awarded,true);
      }
      save();screenHistQuiz();
    }else{
      hqPuzzle.checked='no';                              // 고른 순서는 그대로 둔다 — 다시 보고 고치게
      screenHistQuiz();
    }
  };
}
function bindHistQuizSuccess(scr,uid){
  const nb=scr.querySelector('#hqNext');
  if(nb)nb.onclick=()=>{
    S.histQuiz.queue=(S.histQuiz.queue||[]).filter(x=>x!==uid);
    save();
    hqPuzzle=null;
    screenHistQuiz();
  };
  const tb=scr.querySelector('#hqToTown');
  if(tb)tb.onclick=()=>{S.view='town';save();render();};
}
function screenHistQuiz(){
  if(townCleanup){townCleanup();townCleanup=null;}
  const scr=$('#screen');
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const titleHtml=`🏛️ ${lk('수학사 퀴즈','Math History Quiz','数学史问答')}`;
  histQuizEnsure();
  const uid=S.histQuiz.queue[0];
  if(!uid){
    scr.innerHTML=`<div class="nm-unit-bar">
        <button class="nm-back" id="hqBack">← ${navigationLabel('town')}</button>
        <div class="nm-unit-title">${titleHtml}</div>
      </div>
      <div class="nm-step-body nm-hq-wrap"><div class="nm-card center">
        <div class="nm-card-h">${lk('아직 준비된 이야기가 없어요','No stories are ready yet','还没有准备好的故事')}</div>
      </div></div>`;
    $('#hqBack').onclick=()=>{S.view='town';save();render();};
    return;
  }
  if(!hqPuzzle||hqPuzzle.uid!==uid)hqPuzzle=histQuizNewPuzzle(uid);
  const comic=NM_COMICS[uid];
  const success=hqPuzzle.checked==='ok';
  scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="hqBack">← ${navigationLabel('town')}</button>
      <div class="nm-unit-title">${titleHtml}</div>
    </div>
    <div class="nm-step-body nm-hq-wrap">
      ${docStripHtml(44,esc(lk('네 컷의 순서를 맞춰 봐. 이야기가 어떻게 흘렀을까?','Put the four panels in order. How did the story go?','把四格排好顺序，故事是怎么发展的？')))}
      <div class="nm-card${success?' center':(hqPuzzle.checked==='no'?' nm-hq-shake':'')}">
        ${success?hqSuccessBodyHtml(comic):hqPuzzleBodyHtml(uid,comic)}
      </div>
    </div>`;
  $('#hqBack').onclick=()=>{S.view='town';save();render();};
  if(success)bindHistQuizSuccess(scr,uid);
  else bindHistQuizPuzzle(scr,uid,comic);
}

/* ============================================================
   리포트 (S.view==='report') — HANDOFF.md "캐릭터를 학습 흐름 더 넓게
   쓰기" §1. 부모·아이가 같이 보는 진도 요약. 맨 위 독쌤 띠는 실제 데이터를
   반영한다: 정체 감지→보강 루프(§2-4, boosterPick())가 잡아낸 약한
   스레드가 있으면 그 이름을 짚어 주고, 없으면 격려 한 줄만. 새 분석
   로직을 만들지 않고 이미 있는 boosterPick()·NM_STATS·courseProgress를
   그대로 읽기만 한다. */
function screenReport(){
  if(townCleanup){townCleanup();townCleanup=null;}
  const scr=$('#screen');
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  const titleHtml=`📊 ${lk('리포트','Report','学习报告')}`;

  const boostThread=boosterPick();
  const boostTh=boostThread&&(window.NM_THREADS||{})[boostThread];
  const docLine=boostTh
    ? esc(lk(`이번 주는 "${L(boostTh.name)}"에서 조금 막혔어요. 편지함의 몸풀기부터 해 보자.`,
             `You've been a bit stuck on "${L(boostTh.name)}" lately — let's start with the warm-up in the mailbox.`,
             `最近在"${L(boostTh.name)}"上有点卡住，先从信箱的热身开始吧。`))
    : esc(lk('잘 가고 있어요. 이대로 한 걸음씩!','Going well. One step at a time!','很顺利，继续一步一步来！'));

  const cid=currentCourseKey();
  const course=(window.NM_COURSES||{})[cid];
  const prog=course?courseProgress(course):null;
  const totalUnitsDone=Object.keys(S.progress||{}).filter(id=>unitDone(id)).length;

  const weakRows=(window.NM_STATS?NM_STATS.boostList():[]).slice(0,3).map(w=>{
    const th=(window.NM_THREADS||{})[w.thread];
    return `<div class="nm-rp-row"><span>${esc(th?L(th.name):w.thread)}</span><span>${Math.round(w.avgRate*100)}%</span></div>`;
  }).join('');

  /* 빈 상태(§3) — 0유닛일 땐 크게 찍힌 "0 유닛 완료" 대신 아바타 + 시작 권유 +
     마을로 가는 기본 버튼. 1개 이상이면 기존 숫자 그대로(다만 40px→36px로 축소 —
     아레나 점수 등 다른 화면의 .nm-score는 그대로 두기 위해 리포트 전용 클래스로 분리). */
  const scoreHtml = totalUnitsDone===0
    ? `<div class="nm-rp-empty">
        <div class="nm-rp-empty-ava">${window.renderPartyHtml?window.renderPartyHtml(avatarProfile(),S.character,72):''}</div>
        <p class="nm-rp-empty-msg">${lk('첫 학습 단원을 시작해 볼까요?','Shall we start the first unit?','开始第一个单元吧？')}</p>
        <button class="nm-btn full" id="rpToTown">${lk('마을로 가기','Go to town','前往小镇')}</button>
      </div>`
    : `<div class="nm-rp-score">${lk(`학습 단원 ${totalUnitsDone}개 완료`,`${totalUnitsDone} units done`,`${totalUnitsDone} 个单元完成`)}</div>`;
  /* 주간 그래프 — 최근 7일, 막대 높이=푼 문제 수, 색=정답률(60% 미만 주황). 데이터 없으면 안내 한 줄. */
  const DAYS={ko:['일','월','화','수','목','금','토'],en:['S','M','T','W','T','F','S'],zh:['日','一','二','三','四','五','六']}[S.lang]||['일','월','화','수','목','금','토'];
  const days=[];for(let i=6;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');const v=(S.daily&&S.daily[k])||{n:0,ok:0};days.push({k,dow:DAYS[d.getDay()],n:v.n,ok:v.ok,today:i===0});}
  const maxN=Math.max(1,...days.map(d=>d.n)); const wkN=days.reduce((a,d)=>a+d.n,0), wkOk=days.reduce((a,d)=>a+d.ok,0);
  const weekHtml=`<div class="nm-mb-section-h">${lk('최근 7일','Last 7 days','最近7天')}</div>
    <div class="nm-rp-week" role="img" aria-label="${lk('주간 활동','Weekly activity','每周活动')}">
      ${days.map(d=>{const h=d.n?Math.max(8,Math.round(d.n/maxN*72)):3;const rate=d.n?d.ok/d.n:0;const cls=d.n?(rate<.6?' low':' good'):'';
        return `<div class="nm-rp-day${d.today?' today':''}"><div class="nm-rp-bar-wrap"><div class="nm-rp-bar${cls}" style="height:${h}px" title="${d.n}"></div></div><span class="nm-rp-dow">${d.dow}</span></div>`;}).join('')}
    </div>
    <p class="nm-wsh-sentence">${wkN?lk(`최근 7일간 ${wkN}문제 · 정답률 ${Math.round(wkOk/wkN*100)}%`,`${wkN} problems in the last 7 days · ${Math.round(wkOk/wkN*100)}% correct`,`最近7天${wkN}题 · 正确率${Math.round(wkOk/wkN*100)}%`):lk('문제를 풀면 여기에 하루하루가 쌓여요.','Solve problems and the days will fill in here.','做题后这里会一天天累积。')}</p>`;
  scr.innerHTML=`<div class="nm-unit-bar">
      <button class="nm-back" id="rpBack">← ${navigationLabel('town')}</button>
      <div class="nm-unit-title">${titleHtml}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap">
      ${docStripHtml(44,docLine)}
      <div class="nm-card">
        <div class="nm-card-h">${lk('지금까지 걸어온 길','How far you have come','走过的路')}</div>
        ${scoreHtml}
        ${weekHtml}
        ${course?`<p class="nm-wsh-sentence">${esc(L(course.title))} · ${prog.done}/${prog.total}</p>`:''}
        ${weakRows?`<div class="nm-mb-section-h">${lk('요즘 조금 어려운 곳','A bit tricky lately','最近有点难的地方')}</div>${weakRows}`:`<p class="nm-wsh-sentence">${lk('아직 보강이 필요한 곳이 없어요.','No weak spots detected yet.','暂时没有需要加强的地方。')}</p>`}
        <button class="nm-btn full" id="rpToMail">📬 ${lk('편지함 열기','Open mailbox','打开信箱')}</button>
      </div>
    </div>`;
  $('#rpBack').onclick=()=>{S.view='town';save();render();};
  $('#rpToMail').onclick=()=>{S._mbWeek=null;S.view='mailbox';save();render();};
  const toTownBtn=$('#rpToTown');
  if(toTownBtn)toTownBtn.onclick=()=>{S.view='town';save();render();};
}

/* 개념 렌더(계단식): 세로로 이어지는 수식 스텝(mathSteps: tex 문자열 배열), 화살표로 연결 */
function mathStepsExpr(container, steps, kid){
  const box=document.createElement('div');box.className='nm-mstep-box'+(kid?' kid':'');
  steps.forEach((step,i)=>{
    /* 항목은 문자열(언어 중립 수식) 또는 {ko,en,zh}(한국어 주석이 있던 줄).
       2026-08-30에 372줄을 3언어화했다 — 문자열이면 그대로, 객체면 L()로 고른다. */
    const tex=typeof step==='string'?step:L(step);
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
  /* fill.tex는 문자열(언어 중립) 또는 {ko,en,zh} — 한글 \text 주석이 있던
     31건을 2026-08-30에 3언어화했다(check-unit-lang.js가 지킨다). */
  const fillTex=typeof fill.tex==='string'?fill.tex:L(fill.tex);
  const isMulti=Array.isArray(fill.answer);
  if(isMulti)ensureMultiState(fill.answer,fill.answerShape);
  const shapeCls=isMulti&&fill.answerShape?' nm-multi-shape':'';
  body.innerHTML=`<div class="nm-card">
    <div class="nm-card-h">✅ ${t('checkTitle')}</div>
    <div class="nm-board">
      <div class="nm-fill"><span data-tex="${esc(fillTex)}"></span></div>
      <div class="nm-numpad-screen${isMulti?' nm-multi':''}${shapeCls}" id="pscreen">${isMulti?multiScreenHtml():'&nbsp;'}</div>
    </div>
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
          if(S.sub.fi>=c.fills.length){markStepDone(S.unit,'check');S.sub={};lessonLater(()=>openQuestion(body,u),700);}
          else lessonLater(()=>stepCheck(body,u),700);
        }else{toast(t('tryAgain'),false);$('#fhint').textContent='💡 '+L(fill.hint);multiClear(fill.answer);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);updateLiveFill('.nm-fill',S.sub.mvals);}
        return;
      }
      const inp=S.sub.inp||'';if(inp===''||inp==='-')return;
      if(parseFloat(inp)===fill.answer){
        toast(t('correct'),true);numiHappy();
        S.sub.fi++;S.sub.inp='';
        if(S.sub.fi>=c.fills.length){markStepDone(S.unit,'check');S.sub={};lessonLater(()=>openQuestion(body,u),700);}
        else lessonLater(()=>stepCheck(body,u),700);
      }
      else{toast(t('tryAgain'),false);$('#fhint').textContent='💡 '+L(fill.hint);S.sub.inp='';$('#pscreen').textContent=' ';updateLiveFill('.nm-fill','');}
      return;}
    if(isMulti){applyMultiKey(val);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);updateLiveFill('.nm-fill',S.sub.mvals);return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
    else if(val==='-')S.sub.inp=applyMinusKey(S.sub.inp||'');
    else if((S.sub.inp||'').replace('-','').length<6&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
    updateLiveFill('.nm-fill',S.sub.inp||'');
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
  const gridFit=cur.widget==='g13Grid'&&cur.cols<=5;
  const widgetFit=true; // Every widget keeps its guide separate from its work area.
  body.innerHTML=`<div class="nm-dialog${widgetFit?' nm-widget-dialog '+(gridFit?'nm-grid-dialog':'nm-manipulative-dialog'):''}${cur.widget==='steps'?' steps-mode':''}">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    ${widgetFit?'<div class="nm-widget-guide">':''}
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56,{mood:'think'}):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    ${!widgetFit&&origTexHtml?`<div class="nm-lab-orig"><span class="nm-lab-orig-lbl">${origLbl}</span>${origTexHtml}</div>`:''}
    <div class="nm-bubble">${numiDialogueHtml(first&&!widgetFit?L(cfg.intro):L(cur.prompt))}</div>
    ${widgetFit?'</div><div class="nm-widget-work">':''}
    ${widgetFit&&origTexHtml?`<div class="nm-lab-orig"><span class="nm-lab-orig-lbl">${origLbl}</span>${origTexHtml}</div>`:''}
    <div id="labWidget" class="nm-lab-widget nm-board"></div>
    ${widgetFit?'</div>':''}
    <div class="nm-memo-wrap"><label>📝</label><input type="text" class="nm-memo" placeholder="메모…" autocomplete="off" spellcheck="false"></div>
  </div>`;
  S.sub.labStarted=true;
  renderMath(body);
  say(first?L(cfg.intro):L(cur.prompt));
  NM_WIDGETS.render(cur,$('#labWidget'),val=>{
    if(+val===cur.answer){
      if(NM_WIDGETS._isYoungBand&&NM_WIDGETS._isYoungBand())NM_WIDGETS._correctTone();
      {const sfx=playSfx("success");voiceLine(u,u.voice.correct,true,{afterSfx:sfx});numiHappy();}
      S.sub.li++;S.sub.cur=null;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');lessonLater(()=>gotoStep(afterLabKey(u)),700);return;}
      S.sub.cur=genProblem(u.lab,'main');save();
      lessonLater(()=>stepLab(body,u),650);
    }else{
      voiceLine(u,u.voice.wrong,false);
    }
  });
  if(widgetFit&&!gridFit)wireManipulativeKeys($('#labWidget'));
}
function stepLabPairs(body,u){
  const cfg=u.lab;const need=cfg.count||4;
  S.sub.li=S.sub.li||0;S.sub.picked=S.sub.picked||[];S.sub.pairsFound=S.sub.pairsFound||0;
  const cur=S.sub.cur;const first=S.sub.li===0&&!S.sub.labStarted;
  body.innerHTML=`<div class="nm-dialog">
    <div class="nm-prog">${dots(need,S.sub.li)}</div>
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56,{mood:'think'}):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble">${numiDialogueHtml(first?L(cfg.intro):L(cur.prompt))}</div>
    <div class="nm-expr nm-board" id="expr"></div>
    <button class="nm-btn full" id="pick" disabled>${t('picked')}</button>
    <div class="nm-hint">${t('pairHint')}</div>
  </div>`;
  S.sub.labStarted=true;S.sub.picked=[];
  say(first?L(cfg.intro):L(cur.prompt));
  const expr=$('#expr');
  const opSign=cur.op==='mul'?'×':'+';   // 곱셈 짝 찾기(B-16, 2026-09-09)는 + 대신 ×
  expr.dataset.op=opSign;   // CSS가 연산자를 타일 왼쪽에 붙여 그린다 — 세로에서 줄이 꺾여도 '+'가 줄 끝에 안 매달림(2026-09-16)
  cur.nums.forEach((n,i)=>{
    if(i)expr.insertAdjacentHTML('beforeend',`<span class="nm-plus">${opSign}</span>`);
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
/* Short spoken lines have character; long explanations and formula source
   remain ordinary reading text. Escape each original token, never rewrite it. */
function splitNumberEquation(problem){
  // Display only the two givens. The missing value is never put into markup.
  return `<div class="nm-split-equation"><span data-number-role="whole">${esc(problem.n)}</span><span class="nm-split-sign">=</span><span data-number-role="part">${esc(problem.p)}</span><span class="nm-split-sign">+</span><span data-number-role="unknown" class="nm-numpad-screen" id="pscreen" aria-live="polite" aria-label="${esc(L({ko:'찾을 수',en:'Missing number',zh:'待填数字'}))}">□</span></div>`;
}
function numiDialogueHtml(text,problem){
  text=String(text||'');
  if(problem&&problem.gen==='splitNum'){
    const parts=text.split(/([0-9]+|얼마|how much more|多少)/);
    return '<span class="nm-numi-dialogue nm-split-dialogue">'+parts.map((part,i)=>{
      if(i%2===0)return esc(part);
      const role=part===String(problem.n)?'whole':part===String(problem.p)?'part':'unknown';
      return '<span class="nm-dialog-figure" data-number-role="'+role+'">'+esc(part)+'</span>';
    }).join('')+'</span>';
  }
  if([...text].length>90||/[\\\n]/.test(text))return esc(text);
  const parts=text.split(/([0-9]+(?:[.,][0-9]+)?|얼마|몇|how many|how much|多少|几|[+\-−×÷=<>≤≥□√π^%])/i);
  return '<span class="nm-numi-dialogue">'+parts.map((s,i)=>i%2?`<span class="nm-dialog-figure${/^(얼마|몇|how many|how much|多少|几)$/i.test(s)?' nm-number-word':''}">${esc(s)}</span>`:esc(s)).join('')+'</span>';
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
    <div class="nm-numi">${window.renderNumiChar?window.renderNumiChar(S.character,56,{mood:'think'}):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
    <div class="nm-bubble">${numiDialogueHtml(first?L(cfg.intro):L(cur.prompt))}</div>
    <div class="nm-board">
      <div class="nm-lab-expr">${labExprHtml(cur.tex)}</div>
      <div class="nm-numpad-screen${isMulti?' nm-multi':''}${shapeCls}" id="pscreen">${isMulti?multiScreenHtml():'&nbsp;'}</div>
    </div>
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
        {const sfx=playSfx("success");voiceLine(u,u.voice.correct,true,{afterSfx:sfx});numiHappy();}
        S.sub.li++;S.sub.mvals=null;S.sub.cur=null;
        if(S.sub.li>=need){markStepDone(S.unit,'lab');lessonLater(()=>gotoStep(afterLabKey(u)),700);return;}
        S.sub.cur=genProblem(u.lab,'main');save();
        lessonLater(()=>stepLab(body,u),650);
      }else{voiceLine(u,u.voice.wrong,false);multiClear(cur.answer);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);updateLiveFill('.nm-lab-expr',S.sub.mvals);}
      return;
    }
    const inp=S.sub.inp||'';if(inp===''||inp==='-')return;
    if(parseFloat(inp)===cur.answer){
      {const sfx=playSfx("success");voiceLine(u,u.voice.correct,true,{afterSfx:sfx});numiHappy();}
      S.sub.li++;S.sub.inp='';S.sub.cur=null;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');lessonLater(()=>gotoStep(afterLabKey(u)),700);return;}
      S.sub.cur=genProblem(u.lab,'main');save();
      lessonLater(()=>stepLab(body,u),650);
    }else{voiceLine(u,u.voice.wrong,false);S.sub.inp='';$('#pscreen').textContent=' ';updateLiveFill('.nm-lab-expr','');}
    return;
  }
  if(isMulti){applyMultiKey(val);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);updateLiveFill('.nm-lab-expr',S.sub.mvals);return;}
  if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
  else if(val==='-')S.sub.inp=applyMinusKey(S.sub.inp||'');
  else if((S.sub.inp||'').replace('-','').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
  $('#pscreen').textContent=S.sub.inp||' ';
  updateLiveFill('.nm-lab-expr',S.sub.inp||'');
}
function pickTile(el,i,n,body,u){
  if(el.classList.contains('paired'))return;   // 이미 짝을 찾은 타일은 다시 못 고른다
  const p=S.sub.picked;const at=p.findIndex(x=>x.i===i);
  if(at>=0){p.splice(at,1);el.classList.remove('sel');}
  else{if(p.length>=2){const f=p.shift();const fe=document.querySelector(`.nm-tile[data-i="${f.i}"]`);if(fe)fe.classList.remove('sel');}p.push({i,n});el.classList.add('sel');}
  const pk=$('#pick');pk.disabled=p.length!==2;
  pk.onclick=()=>{
    const cur=S.sub.cur;
    /* op:'mul'(B-16 구구단 짝 찾기, 2026-09-09) — 더하기 대신 곱해서 목표수를 맞춘다.
       op가 없으면(A-01·A-05 등 기존 유닛) 그대로 더한다 — 기존 동작 그대로. */
    const sum=(cur.op==='mul')?p[0].n*p[1].n:p[0].n+p[1].n;
    if(sum===(cur.target||10)){
      const sfx=playSfx("success");numiHappy();
      p.forEach(x=>{const e=document.querySelector(`.nm-tile[data-i="${x.i}"]`);if(e){e.classList.remove('sel');e.classList.add('paired');}});
      S.sub.picked=[];pk.disabled=true;
      S.sub.pairsFound=(S.sub.pairsFound||0)+1;
      /* 이 문제(cur)에 짝이 둘이면(교재처럼 남는 수도 섞인 문제) 하나 찾았다고 곧바로
         새 문제로 넘기지 않는다 — 원장 지시(2026-09-09) "3+7+4+5+6일 때 6+4를 고르면
         하나 더 있어 라고 나오고 3, 7도 고를 수 있도록". 남은 짝을 다 찾아야 이
         라운드가 끝난다. 화면은 그대로 두면 된다 — 방금 지운 .sel/.paired 클래스이
         이미 남은 타일을 다시 고를 수 있는 상태로 만들어 준다.
         voiceLine을 여기선 안 부른다 — 그것도 toast를 띄워서 방금 뜬 onePairMore
         토스트와 겹쳐 버린다(2026-09-09 실기기 확인, "대단해!"와 "하나 더 있어"가
         동시에 뜸). 라운드가 완전히 끝났을 때만(아래) voiceLine을 부른다.
         sayAfterSfx(sfx,...) — "success" 음성 클립과 안내 음성이 동시에 겹쳐
         들리던 문제도 2026-09-14에 같이 고쳤다: sfx가 끝난 뒤에 말한다. */
      if(S.sub.pairsFound<(cur.pairCount||1)){
        toast(t('onePairMore'),true);sayAfterSfx(sfx,t('onePairMore'));
        return;
      }
      voiceLine(u,u.voice.correct,true,{force:true,afterSfx:sfx});
      S.sub.li++;S.sub.cur=null;S.sub.pairsFound=0;
      const need=u.lab.count||4;
      if(S.sub.li>=need){markStepDone(S.unit,'lab');lessonLater(()=>gotoStep(afterLabKey(u)),800);return;}
      lessonLater(()=>stepLab(body,u),900);
    }else{voiceLine(u,u.voice.wrong,false,{force:true});p.forEach(x=>{const e=document.querySelector(`.nm-tile[data-i="${x.i}"]`);if(e)e.classList.remove('sel');});S.sub.picked=[];pk.disabled=true;}
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
    ${hostStripHtml('unit',(u.arena&&u.arena.generator)||u.generator||u.id)}
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
    if(isMulti){applyMultiKey(val);const sc=$('#pscreen');sc.innerHTML=multiScreenHtml();bindMultiBoxes(sc);updateLiveFill('.nm-arena-expr',S.sub.mvals);return;}
    if(val==='del')S.sub.inp=(S.sub.inp||'').slice(0,-1);
    else if(val==='-')S.sub.inp=applyMinusKey(S.sub.inp||'');
    else if((S.sub.inp||'').replace('-','').length<8&&!(val==='.'&&(S.sub.inp||'').includes('.')))S.sub.inp=(S.sub.inp||'')+val;
    $('#pscreen').textContent=S.sub.inp||' ';
    updateLiveFill('.nm-arena-expr',S.sub.inp||'');
  },{decimal:decAny,negative:!!cur.negative});
}
function arenaEnd(body,u){
  const need=u.arena.count||10;const sc=S.sub.score;
  markStepDone(S.unit,'arena');
  body.innerHTML=`<div class="nm-card center">
    <div class="nm-numi big">${window.renderNumiChar?window.renderNumiChar(S.character,56,{mood:'think'}):'<img src="assets/characters/numi-wizard.png" alt="Numi">'}</div>
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
  let newLineageBadge=null, awarded=0;
  if(!already){awarded=coinAdd(s.coins||20,'unit','unit:'+S.unit);
    if(coinAdd.saveFailed){
      body.innerHTML=`<div class="nm-card"><p>${S.lang==='en'?'Your reward could not be saved. Check device storage and try again.':S.lang==='zh'?'未能保存奖励，请检查设备存储后重试。':'보상을 저장하지 못했어요. 기기 저장 공간을 확인하고 다시 시도해 주세요.'}</p><button class="nm-btn full" id="stampRetry">${S.lang==='en'?'Save again':S.lang==='zh'?'重新保存':'다시 저장하기'}</button><button class="nm-btn ghost full" id="toMap">${esc(unitReturnLabel())}</button></div>`;
      $('#stampRetry').onclick=()=>stepStamp(body,u);$('#toMap').onclick=exitUnit;return;
    }
    S.progress[S.unit]=S.progress[S.unit]||{steps:{}};S.progress[S.unit].done=true;
    S.progress[S.unit].steps=S.progress[S.unit].steps||{};S.progress[S.unit].steps.stamp=true; /* 로드맵 별점이 stepDone('stamp')를 보므로 반드시 기록(기존 누락 버그 수정) */
    S.progress[S.unit].touchedAt=Date.now();
    /* N-15(수의 나라 마지막 유닛) 최초 완주 — R0 추천 배너를 다음 마을 진입 때 1회 띄우도록 예약.
       잠금 아님(자유 선택 원칙) — 추천만, seenR0Banner로 프로필당 한 번만. */
    if(S.unit==='N-15'&&!S.seenR0Banner)S.pendingR0Banner=true;
    save();
    newLineageBadge=checkLineageCompletion();}
  const evo=lineageEvoCardHtml(S.unit);
  body.innerHTML=`<div class="nm-card center stamp">
    ${hostStripHtml('unit',(u.arena&&u.arena.generator)||u.generator||u.id,'cheer')}
    <div class="nm-stamp-seal">🏅</div>
    <div class="nm-card-h">${t('stampGet')}</div>
    <div class="nm-stamp-label">${L(s.label)}</div>
    <div class="nm-stamp-coins">🪙 +${awarded} ${t('coins')}</div>
    ${evo}
    <button class="nm-btn full" id="toMap">${esc(unitReturnLabel())}</button>
  </div>`;
  playSfx('stamp');confetti();const sfx=playSfx("great-job");sayAfterSfx(sfx,L(u.voice.finish));
  bindLineageEvoCard(body);
  $('#toMap').onclick=exitUnit;
  if(newLineageBadge)lessonLater(()=>showLineageBadgeOverlay(newLineageBadge),700);
}

/* ---------- 공통 UI 조각 ---------- */
function buildNumpad(pad,cb,opts){
  opts=opts||{};
  pad.innerHTML='';
  /* comma: 답이 배열(여러 칸)인 진단 문항용 — 쉼표로 나눠 입력받는다(§진단하기 v2).
     기존 decimal/negative 세 조합은 순서·구성 그대로(회귀 없음), comma는
     그 뒤에 덧붙이기만 한다. */
  const wide=opts.decimal||opts.negative||opts.comma;
  let keys;
  if(!wide){
    keys=['1','2','3','4','5','6','7','8','9','del','0','ok'];
  } else {
    keys=['1','2','3','4','5','6','7','8','9'];
    if(opts.decimal) keys.push('.');
    if(opts.negative) keys.push('-');
    if(opts.comma) keys.push(',');
    keys.push('0','del','ok');
  }
  /* 소수·음수·쉼표 중 하나라도 있으면 4열 레이아웃(기존 .dec CSS 재사용) */
  if(wide) pad.classList.add('dec'); else pad.classList.remove('dec');
  keys.forEach(k=>{
    const b=document.createElement('button');b.className='nm-key'+(k==='ok'?' ok':k==='del'?' del':k==='.'?' dot':k==='-'?' neg':k===','?' comma':'');
    b.textContent=k==='del'?'←':k==='ok'?'✓':k==='-'?'−':k;b.onclick=()=>{playSfx('tap');cb(k);};pad.appendChild(b);
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
/* 일별 활동 기록 — 리포트 주간 그래프용. 정답/오답 한 번마다 {n,ok} 누적(마을세계관 §0 경계: 압박용 아님).
   기록 지점: 정답=numiHappy()/numiHappyToast(), 오답=toast(t('tryAgain'))·toast('✗'), 몸풀기=advance(ok). */
function todayKeyLocal(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function logDaily(ok){
  try{ if(!S.daily)S.daily={}; const k=todayKeyLocal(); const d=S.daily[k]=S.daily[k]||{n:0,ok:0}; d.n++; if(ok)d.ok++;
    const keys=Object.keys(S.daily).sort(); while(keys.length>60){delete S.daily[keys.shift()];} save(); }catch(e){}
}
function numiHappy(){logDaily(true);const n=document.querySelector('.nm-numi');if(n){n.classList.remove('happy');void n.offsetWidth;n.classList.add('happy');}}
function numiHappyToast(){logDaily(true);toast('✓',true);}

/* ---------- 캐릭터 꾸미기 화면 ---------- */
function screenCloset(){
  const scr=$('#screen');
  const titleTxt=S.lang==='en'?'My Character':S.lang==='zh'?'我的角色':'내 캐릭터';
  const lk=(ko,en,zh)=>S.lang==='ko'?ko:S.lang==='en'?en:zh;
  /* 디자인 패스 1(§4) — 큰 프리뷰(옷장 안, closet.js가 그림) → 탭+그리드 순서는
     closet.js 자체가 담당. 여기(main.js)는 그 아래에 오는 카드들의 순서만 바꾼다:
     "우리 집 마법사들"(프로필 전환)은 자주 쓰는 기능이라 그대로 남기고, 아이디 등록·
     학부모 알림·승인번호 3장만 접이식 "설정"으로 내린다. id/핸들러는 그대로 유지
     (renderIdCard 등은 querySelector로 같은 id를 찾아 채운다). */
  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="backCloset">← ${navigationLabel('town')}</button>
    <div class="nm-unit-title">🪄 ${titleTxt}</div>
  </div>
  <div class="nm-step-body nm-closet-wrap">
    <div id="nm-closet-cnt"></div>
    ${REVIEW?'':`    <div id="nm-slots-slot"></div>
    <details class="nm-closet-settings">
      <summary>${lk('계정 · 알림 설정','Account & notifications','账号·通知设置')}</summary>
      <div id="nm-guardian-slot"></div>
      <div id="nm-idcard-slot"></div>
      <div id="nm-account-slot"></div>
    </details>
`}
  </div>`;
  $('#backCloset').onclick=()=>{S.view='town';save();render();};
  renderIdCard();
  renderSlotCards();
  renderAccountCard();
  renderNotifyCard();
  if(window.screenCloset){
    window.screenCloset(document.getElementById('nm-closet-cnt'),{
      char: S.character,
      avatarKind: avatarKind(),
      unlocked: S.character_unlocked,
      coins: S.coins,
      lang: S.lang,
      human: avatarProfile(),
      avatars: S.avatarCollection || [avatarProfile()],
      ledger: S.coinLedger || [],
      onSave(newChar){
        const before=S.character;S.character=newChar;
        if(!save()){S.character=before;return false;}
        const chip=$('#charChipBtn');if(chip)chip.innerHTML=charChipInner();
        return true;
      },
      onPurchase(type,id){
        if(!stateStorageCurrent())return {ok:false,message:S.lang==='ko'?'다른 화면의 기록으로 새로고침해요. 다시 골라 주세요.':S.lang==='en'?'Reloading the other window’s record. Please choose again.':'正在刷新另一窗口的记录，请重新选择。'};
        const before={coins:S.coins,coinLedger:S.coinLedger,character_unlocked:S.character_unlocked};
        const result=NM_CHARACTER_STATE.purchase(S,type,id,window.NM_AVATAR,window.NM_HUMANS);
        if(!result.ok)return result;
        if(result.spent&&!save()){Object.assign(S,before);return {ok:false};}
        document.querySelectorAll('.nm-coins b').forEach(el=>{el.textContent=S.coins;});
        return {...result,ledger:S.coinLedger||[]};
      },
      onSaveHuman(active,all){
        const before={avatar:S.avatar,avatarCollection:S.avatarCollection};
        if(!NM_CHARACTER_STATE.humans(S,active,all,NM_HUMANS))return false;
        if(!save()){Object.assign(S,before);return false;}
        const chip=$('#charChipBtn');if(chip)chip.innerHTML=charChipInner();
        return true;
      }
    });
  }
}

/* ---------- 학생별 별도 아이디 안내 (옷장) ---------- */
function renderSlotCards(){
  if(REVIEW)return;
  const slot=$('#nm-slots-slot');if(!slot)return;
  const lk=(k,e,z)=>S.lang==='ko'?k:S.lang==='en'?e:z;
  slot.innerHTML=`<div class="nm-idcard"><h3 class="nm-idcard-t">${lk('학생별 아이디','One account per learner','每位学生独立账号')}</h3>
    <p>${lk('형제도 각자 다른 아이디(이메일)로 가입해요. 보호자 전화번호는 같아도 되고, 진도·포인트·이용기간은 각각 관리해요.','Siblings register with separate email accounts. They may share a guardian phone number; progress, coins and membership stay separate.','兄弟姐妹分别使用不同邮箱注册，可共用监护人手机号，进度、积分和使用期独立管理。')}</p>
    <a class="nm-btn ghost" href="access.html?lang=${encodeURIComponent(S.lang)}" id="nmOtherAccount">${lk('다른 아이디로 로그인','Sign in to another account','登录其他账号')}</a></div>`;
}

/* ---------- 승인번호 카드 (옷장, Phase 2B) ----------
   설정/프로필 화면 쪽 코드 입력 지점. 게이트 모달과 로직(applyAccountCode)을 공유. */
/* ── 학부모 알림 등록 카드 (알림서비스-설계.md §5-1) ──
   번호는 nm_contacts에만 insert(anon은 조회 불가 — nm_profiles와 분리).
   등록 여부는 로컬 플래그(S.notifyReg)로만 표시(번호 원문은 로컬에도 안 남김). */
function renderNotifyCard(){
  if(REVIEW)return;
  const slot=$('#nm-account-slot');
  if(!slot)return;
  slot.querySelectorAll('.nm-notify-card').forEach(el=>el.remove());
  const ko=S.lang==='ko', en=S.lang==='en';
  const lk=(k,e,z)=>ko?k:en?e:z;
  const div=document.createElement('div');
  div.className='nm-idcard nm-notify-card';
  const guardian=guardianAuth&&guardianAuth.peek();
  if(!guardian||(guardianAuth.requiresPassword&&guardianAuth.requiresPassword())||!S.cloudLinked||S.cloudOwnerId!==guardian.user.id){
    div.textContent=lk('문자 알림은 보호자 이메일과 학생 기록을 연결한 뒤 등록할 수 있어요.','Connect a guardian email and learner profile before registering text alerts.','关联监护人邮箱和学生记录后，即可登记短信通知。');
    slot.appendChild(div);return;
  }
  if(membership){
    const contact=membership.snapshot().contact;
    const text=document.createElement('p');text.textContent=contact?.registered
      ?(contact.phoneMasked||'')+' · '+(contact.smsConsent?lk('학습지 문자 수신 동의','Worksheet texts enabled','已同意接收学习单短信'):lk('문자 수신 미동의','Worksheet texts disabled','未同意接收短信'))
      :lk('가입 화면에서 보호자 전화번호를 등록해 주세요.','Register a guardian phone to complete signup.','请在注册界面填写监护人手机号。');
    const edit=document.createElement('button');edit.className='nm-btn ghost';edit.textContent=lk('휴대폰·문자 동의 변경','Change phone or text consent','修改手机号或短信同意');
    edit.onclick=()=>{guardianContactEditing=true;renderIdCard();$('#nm-guardian-slot')?.scrollIntoView({block:'start'});};
    div.append(text,edit);slot.appendChild(div);return;
  }
  if(S.notifyReg){
    div.innerHTML=`📱 ${lk('학부모 알림 등록됨','Parent alerts registered','家长通知已登记')} (${esc(S.notifyReg)}) · ${lk('해지는 학원에 문의','Contact academy to opt out','退订请联系学院')}`;
    slot.appendChild(div);
    return;
  }
  div.innerHTML=`
    <div class="nm-notify-head">📱 ${lk('학부모 알림 받기','Parent Alerts','家长通知')}</div>
    <p class="nm-notify-desc">${lk('매주 학습지·진도 안내를 문자로 보내드려요.','Get weekly worksheet & progress texts.','每周通过短信发送学习单和进度通知。')}</p>
    <div class="nm-notify-row">
      <input id="nmNotifyPhone" type="tel" inputmode="numeric" maxlength="13"
        placeholder="${lk('학부모 휴대폰 번호','Parent phone number','家长手机号')}">
      <button class="nm-btn small" id="nmNotifyGo">${lk('등록','Register','登记')}</button>
    </div>
    <div class="nm-notify-row nm-notify-dow">
      <span>${S.roadCadence==='w2'?lk('1회차 요일','1st day','第1次'):lk('받는 요일','Send on','发送日')}</span>
      <select id="nmNotifyDow">
        <option value="">${lk('학원 기본(월요일)','Academy default (Monday)','学院默认（周一）')}</option>
        ${[1,2,3,4,5,6,0].map(d=>`<option value="${d}">${lk(['일','월','화','수','목','금','토'][d]+'요일',['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d],['周日','周一','周二','周三','周四','周五','周六'][d])}</option>`).join('')}
      </select>
    </div>
    ${S.roadCadence==='w2'?`<div class="nm-notify-row nm-notify-dow">
      <span>${lk('2회차 요일','2nd day','第2次')}</span>
      <select id="nmNotifyDow2">
        <option value="">${lk('학원 기본(목요일)','Academy default (Thursday)','学院默认（周四）')}</option>
        ${[1,2,3,4,5,6,0].map(d=>`<option value="${d}">${lk(['일','월','화','수','목','금','토'][d]+'요일',['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d],['周日','周一','周二','周三','周四','周五','周六'][d])}</option>`).join('')}
      </select>
    </div>`:''}
    <label class="nm-notify-consent">
      <input type="checkbox" id="nmNotifyConsent">
      <span>${lk('학습 안내 발송을 위한 전화번호 수집·이용에 동의합니다(수신 해지 시까지 보관).',
        'I agree to the collection and use of this number for learning notifications (kept until opt-out).',
        '同意为发送学习通知收集并使用该号码（保留至退订）。')}</span>
    </label>
    <div class="nm-notify-msg" id="nmNotifyMsg"></div>`;
  slot.appendChild(div);
  $('#nmNotifyGo').onclick=async()=>{
    const msgEl=$('#nmNotifyMsg');
    const raw=($('#nmNotifyPhone').value||'').replace(/\D/g,'');
    if(!/^01\d{8,9}$/.test(raw)){
      msgEl.textContent=lk('휴대폰 번호를 확인해 주세요 (01로 시작).','Please check the phone number.','请检查手机号。');
      return;
    }
    if(!$('#nmNotifyConsent').checked){
      msgEl.textContent=lk('동의에 체크해 주세요.','Please check the consent box.','请勾选同意。');
      return;
    }
    msgEl.textContent='…';
    try{
      const auth=await cloudCredentials();
      if(auth.owner!==S.cloudOwnerId)throw new Error('guardian_auth_required');
      const r=await fetch(`${SB_URL}/rest/v1/nm_contacts`,{
        method:'POST',headers:auth.headers,
        body:JSON.stringify({profile_name:S.name||('#'+(S.character&&S.character.number)),
          phone:raw,consent:true,consent_at:new Date().toISOString(),
          send_dow:($('#nmNotifyDow').value==='')?null:Number($('#nmNotifyDow').value),
          send_dow2:(!$('#nmNotifyDow2')||$('#nmNotifyDow2').value==='')?null:Number($('#nmNotifyDow2').value)})});
      if(r.ok||r.status===409){ /* 409=이미 등록(같은 프로필·번호) — 성공 취급 */
        S.notifyReg=raw.slice(0,3)+'-****-'+raw.slice(-4);
        save();
        if(div.parentNode)div.parentNode.removeChild(div);
        renderNotifyCard();
      }else{
        msgEl.textContent=lk('등록에 실패했어요. 잠시 후 다시 시도해 주세요.','Failed — please try again later.','登记失败，请稍后再试。');
      }
    }catch(e){
      msgEl.textContent=lk('네트워크 오류 — 다시 시도해 주세요.','Network error — try again.','网络错误，请重试。');
    }
  };
}
function renderAccountCard(){
  if(REVIEW)return;
  const slot=$('#nm-account-slot');
  if(!slot)return;
  if(membership&&!guardianAuth?.peek()&&(S.guardianManaged||S.account?.status!=='active')){
    const lk=(ko,en,zh)=>S.lang==='en'?en:S.lang==='zh'?zh:ko;
    slot.innerHTML=`<div class="nm-idcard"><div class="nm-idcard-t">${lk('이메일 가입 · 이용권','Email registration · Membership','邮箱注册 · 使用权')}</div><p>${lk('위에서 이메일로 로그인해 주세요. 처음 가입하면 30일 체험하고, 이후에는 6개월·1년 이용권을 학원에서 승인해 드려요.','Sign in above with your email. New registration includes a 30-day trial; your academy then approves a 6-month or 1-year plan.','请在上方使用邮箱登录。首次注册可体验30天，之后由学院开通6个月或1年使用权。')}</p></div>`;
    return;
  }
  const ko=S.lang==='ko', en=S.lang==='en';
  if(membership&&guardianAuth?.peek()){
    const state=membership.snapshot(),m=state.membership;
    const lk=(a,b,c)=>ko?a:en?b:c;
    const label=!m?lk('가입 정보 확인','Checking registration','确认注册信息'):m.status==='trial'?lk('30일 무료 체험','30-day free trial','30天免费体验'):m.status==='paid'?(m.plan==='six_month'?lk('6개월 이용권','6-month plan','6个月使用权'):lk('1년 이용권','1-year plan','1年使用权')):m.status==='revoked'?lk('이용권 해지','Plan revoked','使用权已撤销'):lk('이용 기간 만료','Access period ended','使用期已结束');
    const end=m&&(m.status==='trial'?m.trialEndsAt:m.endsAt);
    const until=end?new Date(end).toLocaleString(ko?'ko-KR':en?'en-US':'zh-CN',{timeZone:'Asia/Seoul'}):'';
    slot.innerHTML=`<div class="nm-idcard"><div class="nm-idcard-t">${esc(label)}</div>${until?`<p>${lk('이용 기한','Valid until','有效期至')}: ${esc(until)} (KST)</p>`:''}<p>${lk('정식 이용권은 6개월·1년 중 학원에서 승인해 드려요. 학습 기록은 이용 기간이 끝나도 보존돼요.','Your academy approves a 6-month or 1-year plan. Study records are kept after access ends.','学院可开通6个月或1年使用权。使用期结束后仍保留学习记录。')}</p><button class="nm-btn ghost" id="nmMemberRefresh">${lk('이용권 다시 확인','Refresh membership','刷新使用权')}</button></div>`;
    $('#nmMemberRefresh').onclick=()=>membership.refresh(true);return;
  }
  const acc=S.account||{status:'trial'};
  if(acc.status==='active'){
    slot.innerHTML=`<div class="nm-idcard linked">🔓 ${ko?'학원 승인 완료':en?'Academy approved':'学院已授权'}${acc.code?` · <b>${esc(acc.code)}</b>`:''} · ${ko?'모든 학습 단원 이용 가능':en?'All units unlocked':'全部单元已解锁'} ✓</div>`;
    return;
  }
  slot.innerHTML=`<div class="nm-idcard">
    <div class="nm-idcard-t">🔒 ${ko?'체험 모드':en?'Trial mode':'体验模式'}</div>
    <div class="nm-idcard-row">
      <input id="accCode" maxlength="24" placeholder="${ko?'승인번호 입력':en?'Enter code':'输入授权码'}" autocomplete="off">
      <button class="nm-btn" id="accSubmit">${ko?'확인':en?'Apply':'确认'}</button>
    </div>
    <div class="nm-idcard-msg" id="accMsg">${ko?'학원에서 받은 승인번호를 입력하면 모든 학습 단원·편지함·인쇄가 열려요.':en?'Enter the code from your academy to unlock every unit, the mailbox, and printing.':'输入学院提供的授权码即可解锁全部单元、信箱与打印。'}</div>
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
    }else if(res.reason==='rate'){
      msg.textContent=ko?'시도가 너무 많아요. 10분 뒤에 다시 해 주세요.':en?'Too many tries — please wait 10 minutes.':'尝试次数过多，请10分钟后再试。';
    }else if(res.reason==='network'){
      msg.textContent=ko?'연결에 실패했어요. 잠시 후 다시 시도해 주세요.':en?'Connection failed — try again soon.':'连接失败，请稍后重试。';
    }else{
      msg.textContent=ko?'코드를 확인해 주세요.':en?'Please check your code.':'请确认授权码。';
    }
  }
}

/* ---------- 보호자 이메일 인증·학생 기록 연결 (설정) ---------- */
function renderGuardianContact(slot,lk){
  if(!membership)return false;
  const state=membership.snapshot();
  if(membership.contactReady()&&!guardianContactEditing)return false;
  const logout=async()=>{guardianContactEditing=false;save();try{await guardianAuth.signOut();}catch(e){toast(lk('로그아웃 정보를 확인해 주세요.','Check browser sign-out data.','请检查浏览器退出信息。'),false);}};
  if(state.loading||!state.membership){
    slot.innerHTML=`<div class="nm-idcard"><p role="status">${state.error?lk('회원 정보를 불러오지 못했어요. 연결을 확인하고 다시 시도해 주세요.','Could not load membership. Check your connection and retry.','无法加载会员信息，请检查网络后重试。'):lk('가입 정보를 확인하고 있어요…','Checking registration…','正在确认注册信息…')}</p><button class="nm-btn" id="nmGuardContactRetry">${lk('다시 확인','Retry','重试')}</button><button class="nm-btn ghost" id="nmGuardOut">${lk('로그아웃','Sign out','退出')}</button></div>`;
    $('#nmGuardContactRetry').onclick=()=>membership.refresh(true);$('#nmGuardOut').onclick=logout;return true;
  }
  // registered = a phone is already on file (current or legacy); ready = consent is on the current notice version.
  const registered=state.contact?.registered===true,ready=membership.contactReady(),masked=state.contact?.phoneMasked||'';
  const title=ready?lk('휴대폰·문자 동의 변경','Change phone or text consent','修改手机号或短信同意')
    :registered?lk('개인정보 동의 갱신','Renew privacy consent','更新个人信息同意'):lk('보호자 휴대폰 번호 · 가입 완료','Guardian phone · Complete registration','监护人手机号 · 完成注册');
  const intro=registered&&!ready
    ?lk('개인정보 수집·이용 동의서가 새로 마련됐어요. 동의를 갱신하면 학습 기록 저장이 다시 이어져요.','We have a new personal data notice. Renew consent to keep saving learning records.','个人信息同意书已更新。更新同意后即可继续保存学习记录。')
    :lk('이메일은 학생별로 구분하고, 형제는 같은 보호자 전화번호를 사용할 수 있어요.','Each learner uses a separate email. Siblings may share a guardian phone number.','每位学生使用不同邮箱，兄弟姐妹可共用监护人手机号。');
  const keep=registered&&masked?`<p class="nm-privacy-note">${lk(`번호를 비워 두면 지금 번호(${masked})를 그대로 써요.`,`Leave it blank to keep the current number (${masked}).`,`留空则继续使用当前号码（${masked}）。`)}</p>`:'';
  slot.innerHTML=`<div class="nm-idcard nm-guard-card"><h3 class="nm-idcard-t">${title}</h3><p>${intro}</p>
    <form id="nmGuardContactForm" novalidate><div class="nm-guard-field"><label for="nmGuardPhone">${lk('보호자 휴대폰 번호','Guardian mobile number','监护人手机号')}</label><input id="nmGuardPhone" type="tel" inputmode="tel" autocomplete="tel" maxlength="13" placeholder="${esc(registered&&masked?masked:'010-0000-0000')}">${keep}</div>
    ${window.NM_PRIVACY?window.NM_PRIVACY.fields(S.lang,"nmContact",true,{current:ready}):""}
    <button class="nm-btn" id="nmGuardContactSave" type="submit">${registered?lk('동의 저장','Save consent','保存同意'):lk('저장하고 가입 완료','Save and complete registration','保存并完成注册')}</button><button class="nm-btn ghost" id="nmGuardOut" type="button">${lk('로그아웃','Sign out','退出')}</button>
    <p class="nm-idcard-msg" id="nmGuardContactMsg" role="status" aria-live="polite"></p></form></div>`;
  $('#nmGuardOut').onclick=logout;
  // Only an edit of a consent on the current notice shows the saved text choice; new and renewed consent start unchecked.
  if($('#nmContactSms'))$('#nmContactSms').checked=ready&&state.contact?.smsConsent===true;
  $('#nmGuardContactForm').onsubmit=async event=>{
    event.preventDefault();const button=$('#nmGuardContactSave'),msg=$('#nmGuardContactMsg');if(button.disabled)return;
    const phone=$('#nmGuardPhone').value.replace(/\D/g,'')||(registered?null:'');
    if(phone!==null&&!/^01\d{8,9}$/.test(phone)){msg.textContent=lk('휴대폰 번호를 확인해 주세요.','Check the mobile number.','请检查手机号。');return;}
    if(!window.NM_PRIVACY||!$('#nmContactPrivacy')?.checked||!$('#nmContactGuardian')?.checked){msg.textContent=lk('필수 개인정보 동의와 본인·법정대리인 확인을 선택해 주세요.','Confirm required privacy consent and your learner/guardian role.','请选择必选隐私同意及本人或法定代理人确认。');return;}
    button.disabled=true;guardianContactEditing=false;
    try{await membership.registerContact(phone,true,$('#nmContactSms').checked,{version:window.NM_PRIVACY.VERSION,guardianConsent:$('#nmContactGuardian').checked});}
    catch(e){const current=$('#nmGuardContactMsg');if(current)current.textContent=lk('저장하지 못했어요. 연결을 확인하고 다시 시도해 주세요.','Could not save. Check the connection and retry.','无法保存，请检查网络后重试。');}
    finally{button.disabled=false;}
  };
  return true;
}
function renderGuardianCard(){
  const slot=$('#nm-guardian-slot');if(!slot)return;
  const lk=(ko,en,zh)=>S.lang==='en'?en:S.lang==='zh'?zh:ko;
  const session=guardianAuth&&guardianAuth.peek();
  const pending=guardianAuth&&guardianAuth.pendingLink&&guardianAuth.pendingLink();
  if(pending&&!session){
    slot.innerHTML=`<div class="nm-idcard"><div class="nm-idcard-t">${lk('이 이메일로 로그인할까요?','Sign in with this email?','使用此邮箱登录？')}</div><p><b>${esc(pending.email||'')}</b></p><p>${lk('내 보호자 이메일인지 확인해 주세요. 학생 기록을 연결하면 이 이메일로 다른 기기에서 이어할 수 있어요.','Check that this is your guardian email. Connected learner records can be accessed with this email on other devices.','请确认这是您的监护人邮箱。关联后，可使用此邮箱在其他设备上查看学生记录。')}</p><div class="nm-idcard-row"><button class="nm-btn" id="nmGuardAccept">${lk('내 이메일이 맞아요','This is my email','这是我的邮箱')}</button><button class="nm-btn ghost" id="nmGuardCancel">${lk('취소','Cancel','取消')}</button></div><p id="nmGuardLinkMsg" role="status"></p></div>`;
    $('#nmGuardAccept').onclick=async()=>{try{await guardianAuth.confirmLink();}catch(e){$('#nmGuardLinkMsg').textContent=lk('로그인 정보를 저장하지 못했어요. 브라우저 저장 설정을 확인해 주세요.','Could not save sign-in. Check browser storage settings.','无法保存登录信息，请检查浏览器存储设置。');}};
    $('#nmGuardCancel').onclick=()=>{guardianAuth.cancelLink();renderIdCard();};
    return;
  }
  if(session&&guardianAuth.requiresPassword&&guardianAuth.requiresPassword()){
    /* 이메일 인증(OTP·메일 링크) 직후: 비밀번호를 만들기 전에는 학생 기록 연결·이어하기를 열지 않는다.
       비밀번호는 입력칸 값으로만 쓰고 상태·저장소에 남기지 않는다. 화면 갱신은 onChange가 맡는다. */
    slot.innerHTML=`<div class="nm-idcard nm-guard-card"><div class="nm-idcard-t">${lk('비밀번호를 만들어 주세요','Create a password','请设置密码')}</div>
      <p>${esc(session.user.email||'')}</p>
      <p id="nmGuardPasswordHint">${lk('이메일 인증이 끝났어요. 다음부터 이메일과 비밀번호로 로그인할 수 있게 비밀번호를 만들어 주세요. 비밀번호를 저장하기 전에는 학생 기록을 연결할 수 없어요.','Your email is verified. Create a password so you can sign in with your email and password next time. Learner records stay locked until the password is saved.','邮箱已验证。请设置密码，以后可用邮箱和密码登录。保存密码之前，无法关联学生记录。')}</p>
      <form class="nm-guard-form" id="nmGuardPasswordForm" novalidate>
        <div class="nm-guard-field"><label for="nmGuardNewPassword">${lk('새 비밀번호 (8자 이상)','New password (8+ characters)','新密码（至少8位）')}</label>
          <input id="nmGuardNewPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password" aria-describedby="nmGuardPasswordHint" required></div>
        <div class="nm-guard-field"><label for="nmGuardConfirmPassword">${lk('비밀번호 확인','Confirm password','确认密码')}</label>
          <input id="nmGuardConfirmPassword" type="password" minlength="8" maxlength="128" autocomplete="new-password" required></div>
        <div class="nm-idcard-row"><button class="nm-btn" type="submit" id="nmGuardPasswordSave">${lk('비밀번호 저장','Save password','保存密码')}</button>
          <button class="nm-btn ghost" type="button" id="nmGuardOut">${lk('이메일 로그아웃','Sign out of email','退出邮箱登录')}</button></div>
        <p class="nm-idcard-msg" id="nmGuardPasswordMsg" role="status" aria-live="polite"></p>
      </form></div>`;
    const passwordError=e=>{
      const c=e&&e.code,s=e&&e.status;
      if(c==='invalid_password')return lk('비밀번호는 8자 이상 128자 이하로 입력해 주세요.','Use a password of 8 to 128 characters.','密码需为8至128位。');
      if(c==='mismatch')return lk('비밀번호가 서로 달라요. 다시 확인해 주세요.','The passwords do not match. Check them and try again.','两次输入的密码不一致，请检查后重试。');
      if(c==='storage')return lk('이 기기에 로그인 정보를 저장하지 못했어요. 브라우저의 저장 공간·설정을 확인해 주세요.','Could not save sign-in on this device. Check this browser’s storage and settings.','无法在本设备保存登录信息，请检查浏览器的存储和设置。');
      if(c==='cancelled')return lk('로그인 상태가 바뀌어 비밀번호를 적용하지 않았어요. 다시 시도해 주세요.','Your sign-in changed, so the password was not applied. Try again.','登录状态已变化，密码未生效。请重试。');
      if(c==='network')return lk('연결에 실패했어요. 인터넷을 확인하고 다시 시도해 주세요.','Connection failed. Check your internet and try again.','连接失败，请检查网络后重试。');
      if(s===429)return lk('요청이 많아요. 잠시 후 다시 시도해 주세요.','Too many attempts. Try again later.','请求过多，请稍后重试。');
      if(s===422)return lk('이 비밀번호는 사용할 수 없어요. 다른 비밀번호를 입력해 주세요.','That password was not accepted. Try a different one.','该密码不可用，请换一个密码。');
      if(c==='nosession'||s===401||s===403)return lk('로그인이 만료됐어요. 로그아웃한 뒤 이메일 인증을 다시 해 주세요.','Your sign-in expired. Sign out and verify your email again.','登录已过期。请退出后重新验证邮箱。');
      return lk('비밀번호를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.','Could not save the password. Try again later.','无法保存密码，请稍后重试。');
    };
    $('#nmGuardPasswordForm').onsubmit=async ev=>{
      ev.preventDefault();
      const pwEl=$('#nmGuardNewPassword'),cfEl=$('#nmGuardConfirmPassword'),btn=$('#nmGuardPasswordSave'),msg=$('#nmGuardPasswordMsg');
      if(btn.disabled)return;
      const pw=pwEl.value,cf=cfEl.value;
      if(pw.length<8||pw.length>128){msg.textContent=passwordError({code:'invalid_password'});return;}
      if(pw!==cf){msg.textContent=passwordError({code:'mismatch'});return;}
      btn.disabled=true;
      msg.textContent=lk('비밀번호를 저장하고 있어요…','Saving your password…','正在保存密码…');
      try{await guardianAuth.setPassword(pw,cf);}
      catch(e){
        if(!msg.isConnected)return;
        pwEl.value='';cfEl.value='';
        msg.textContent=passwordError(e);btn.disabled=false;
        return;
      }
      // 성공하면 onChange가 이미 화면을 다시 그렸다. 여기서 또 그리지 않는다.
      if(msg.isConnected){pwEl.value='';cfEl.value='';btn.disabled=false;}
    };
    $('#nmGuardOut').onclick=async()=>{
      save();
      try{await guardianAuth.signOut();}
      catch(e){toast(lk('로그인 정보를 지우지 못했어요. 이 브라우저의 사이트 데이터를 확인해 주세요.','Could not remove sign-in. Check this browser’s site data.','无法清除登录信息，请检查浏览器的网站数据。'),false);}
    };
    return;
  }
  if(session&&renderGuardianContact(slot,lk))return;
  if(session){
    slot.innerHTML=`<div class="nm-idcard"><div class="nm-idcard-t">${lk('보호자 이메일 인증 완료','Guardian email verified','监护人邮箱已验证')}</div><p>${esc(session.user.email||'')}</p><button class="nm-btn ghost" id="nmGuardOut">${lk('이메일 로그아웃','Sign out of email','退出邮箱登录')}</button></div>`;
    $('#nmGuardOut').onclick=async()=>{
      save();
      try{await guardianAuth.signOut();}
      catch(e){toast(lk('로그인 정보를 지우지 못했어요. 이 브라우저의 사이트 데이터를 확인해 주세요.','Could not remove sign-in. Check this browser’s site data.','无法清除登录信息，请检查浏览器的网站数据。'),false);}
      // onChange가 즉시 갱신한다. 늦은 로그아웃 응답이 새 로그인 입력을 지우지 않는다.
    };
    const notice=document.createElement('a');notice.className='nm-btn ghost';notice.href='privacy.html?lang='+encodeURIComponent(S.lang);notice.target='_blank';notice.rel='noopener';notice.textContent=lk('개인정보 수집·이용 동의서','Personal data notice','个人信息同意书');slot.firstElementChild.appendChild(notice);
    const contact=membership&&membership.snapshot().contact;
    if(contact&&contact.registered){
      const line=document.createElement('p');line.textContent=(contact.phoneMasked||'')+' · '+(contact.smsConsent?lk('학습지 문자 수신 동의','Worksheet texts enabled','已同意接收学习单短信'):lk('문자 수신 미동의','Worksheet texts disabled','未同意接收短信'));slot.firstElementChild.appendChild(line);
      const edit=document.createElement('button');edit.className='nm-btn ghost';edit.textContent=lk('휴대폰·문자 동의 변경','Change phone or text consent','修改手机号或短信同意');edit.onclick=()=>{guardianContactEditing=true;renderIdCard();};slot.firstElementChild.appendChild(edit);
    }
    return;
  }
  slot.innerHTML=`<div class="nm-idcard nm-guard-card"><div class="nm-idcard-t">${lk('보호자 이메일로 기록 연결','Connect records with a guardian email','用监护人邮箱关联记录')}</div>
    <p>${lk('학생마다 이메일을 따로 사용해요. 형제는 보호자 전화번호가 같아도 돼요. 가입 후 30일 동안 체험할 수 있어요.','Use a separate email for each learner. Siblings may share a guardian phone. Registration includes a 30-day trial.','每位学生使用不同邮箱，兄弟姐妹可共用监护人手机号。注册后可体验30天。')}</p>
    <div class="nm-guard-field"><label for="nmGuardEmail">${lk('보호자 이메일','Guardian email','监护人邮箱')}</label>
    <input id="nmGuardEmail" type="email" autocomplete="email" placeholder="name@example.com"></div>
    <section class="nm-guard-sec" aria-labelledby="nmGuardLoginTitle"><h4 id="nmGuardLoginTitle">${lk('비밀번호가 있어요','I already have a password','我已有密码')}</h4>
    <form class="nm-guard-form" id="nmGuardLoginForm" novalidate>
      <div class="nm-guard-field"><label for="nmGuardLoginPassword">${lk('비밀번호','Password','密码')}</label>
      <input id="nmGuardLoginPassword" type="password" maxlength="128" autocomplete="current-password"></div>
      <div class="nm-idcard-row"><button class="nm-btn" type="submit" id="nmGuardLogin">${lk('이메일·비밀번호로 로그인','Sign in with email and password','用邮箱和密码登录')}</button></div>
      <p class="nm-idcard-msg" id="nmGuardLoginMsg" role="status" aria-live="polite"></p>
    </form></section>
    <section class="nm-guard-sec" aria-labelledby="nmGuardOtpTitle"><h4 id="nmGuardOtpTitle">${lk('처음이거나 비밀번호를 잊었어요','First visit or forgot password','首次使用或忘记密码')}</h4>
    <p>${lk('위 이메일로 인증번호를 받아 본인 확인을 한 뒤, 새 비밀번호를 만들어요.','Get a code at the email above, verify it, then create a new password.','通过上方邮箱获取验证码并验证后，再设置新密码。')}</p>
    <p class="nm-privacy-note">${lk('개인정보 수집·이용 동의는 이메일 인증 뒤 휴대폰 번호 단계에서 받아요.','Personal data consent is collected at the phone step after email verification.','邮箱验证后，在手机号步骤中征求个人信息同意。')}</p>
    <div class="nm-idcard-row"><button class="nm-btn" id="nmGuardSend">${lk('인증 메일 받기','Send verification email','发送验证邮件')}</button></div>
    <div class="nm-guard-field"><label for="nmGuardToken">${lk('메일 인증번호','Email verification code','邮箱验证码')}</label>
    <div class="nm-idcard-row"><input id="nmGuardToken" inputmode="numeric" autocomplete="one-time-code" maxlength="12"><button class="nm-btn" id="nmGuardVerify">${lk('이메일 인증','Verify email','验证邮箱')}</button></div></div>
    <p class="nm-idcard-msg" id="nmGuardMsg" role="status" aria-live="polite"></p></section></div>`;
  const message=()=>$('#nmGuardMsg');
  const loginError=e=>{
    const c=e&&e.code,s=e&&e.status;
    if(c==='invalid_email')return lk('이메일 주소를 확인해 주세요.','Enter a valid email address.','请输入有效的邮箱地址。');
    if(c==='invalid_password')return lk('비밀번호를 입력해 주세요.','Enter your password.','请输入密码。');
    if(c==='storage')return lk('이 기기에 로그인 정보를 저장하지 못했어요. 브라우저의 저장 공간·설정을 확인해 주세요.','Could not save sign-in on this device. Check this browser’s storage and settings.','无法在本设备保存登录信息，请检查浏览器的存储和设置。');
    if(c==='cancelled')return lk('로그인이 취소됐어요. 다시 시도해 주세요.','Sign-in was cancelled. Try again.','登录已取消，请重试。');
    if(c==='network')return lk('연결에 실패했어요. 인터넷을 확인하고 다시 시도해 주세요.','Connection failed. Check your internet and try again.','连接失败，请检查网络后重试。');
    if(s===429)return lk('시도가 너무 많아요. 잠시 후 다시 해 주세요.','Too many attempts. Try again later.','尝试次数过多，请稍后再试。');
    if(s===400||s===401||s===403)return lk('이메일 또는 비밀번호가 맞지 않아요. 처음이거나 비밀번호를 잊었다면 아래 인증번호로 로그인해 주세요.','Email or password is incorrect. If this is your first visit or you forgot it, use the email code below.','邮箱或密码不正确。若首次使用或忘记密码，请使用下方验证码。');
    return lk('로그인하지 못했어요. 잠시 후 다시 시도해 주세요.','Could not sign in. Try again later.','无法登录，请稍后重试。');
  };
  $('#nmGuardLoginForm').onsubmit=async ev=>{
    ev.preventDefault();
    const btn=$('#nmGuardLogin'),pwEl=$('#nmGuardLoginPassword'),msg=$('#nmGuardLoginMsg');
    if(btn.disabled)return;
    if(!guardianAuth){msg.textContent=lk('인증 도구를 불러오지 못했어요. 새로고침해 주세요.','Reload to load email sign-in.','请刷新页面以加载邮箱登录。');return;}
    const email=$('#nmGuardEmail').value.trim(),pw=pwEl.value;
    if(!email){msg.textContent=loginError({code:'invalid_email'});return;}
    if(!pw){msg.textContent=loginError({code:'invalid_password'});return;}
    btn.disabled=true;
    msg.textContent=lk('로그인하고 있어요…','Signing in…','正在登录…');
    try{await guardianAuth.signInWithPassword(email,pw);}
    catch(e){
      if(!msg.isConnected)return;
      pwEl.value='';msg.textContent=loginError(e);btn.disabled=false;
      return;
    }
    // 성공하면 onChange가 이미 화면을 다시 그렸다. 여기서 또 그리지 않는다.
    if(msg.isConnected){pwEl.value='';btn.disabled=false;}
  };
  async function request(verify){
    const btn=$(verify?'#nmGuardVerify':'#nmGuardSend'),email=$('#nmGuardEmail').value.trim(),token=$('#nmGuardToken').value.trim();
    if(!guardianAuth){message().textContent=lk('인증 도구를 불러오지 못했어요. 새로고침해 주세요.','Reload to load email verification.','请刷新页面以加载邮箱验证。');return;}
    btn.disabled=true;
    message().textContent=lk('이메일 인증을 확인하고 있어요…','Processing email verification…','正在处理邮箱验证…');
    try{
      if(verify){await guardianAuth.verifyEmail(email,token);}
      else{await guardianAuth.sendEmail(email);message().textContent=lk('메일로 받은 인증번호를 위에 입력하고 ‘이메일 인증’을 눌러 주세요.','Enter the code from your email above, then select Verify email.','请在上方输入邮件中的验证码，然后点击验证邮箱。');}
    }catch(e){
      const msg=message();if(msg)msg.textContent=e.code==='storage'?lk('이 기기에 인증 정보를 저장하지 못했어요. 브라우저의 저장 공간·설정을 확인해 주세요.','Could not save sign-in. Check this browser’s storage and settings.','无法保存登录信息，请检查浏览器的存储和设置。'):e.status===429?lk('요청이 많아요. 잠시 후 다시 시도해 주세요.','Too many requests. Try again later.','请求过多，请稍后重试。'):lk('이메일·인증번호 또는 연결 상태를 확인하고 다시 시도해 주세요.','Check your email, code and connection, then try again.','请检查邮箱、验证码和网络连接，然后重试。');
    }finally{btn.disabled=false;}
  }
  $('#nmGuardSend').onclick=()=>request(false);
  $('#nmGuardVerify').onclick=()=>request(true);
}
function renderIdCard(){
  if(REVIEW)return;
  const slot=$('#nm-idcard-slot');
  if(!slot)return;
  renderGuardianCard();
  const ko=S.lang==='ko', en=S.lang==='en';
  const guardian=guardianAuth&&guardianAuth.peek();
  if(!guardian){
    slot.innerHTML=`<div class="nm-idcard">${ko?'학습 기록은 이 기기에 저장돼요. 보호자 이메일을 인증하면 기록을 연결할 수 있어요.':en?'Learning records are saved on this device. Verify a guardian email to connect them.':'学习记录保存在本设备上。验证监护人邮箱后即可关联记录。'}</div>`;
    return;
  }
  if(guardianAuth.requiresPassword&&guardianAuth.requiresPassword()){
    slot.innerHTML=`<div class="nm-idcard">${ko?'비밀번호 설정을 마치면 학생 기록을 연결할 수 있어요.':en?'Finish setting your password to connect learner records.':'完成密码设置后即可关联学生记录。'}</div>`;
    return;
  }
  if(membership&&!membership.contactReady()){
    slot.innerHTML=`<div class="nm-idcard">${ko?'휴대폰 등록을 마치면 학생 기록을 연결할 수 있어요.':en?'Finish phone registration to connect learner records.':'完成手机号登记后即可关联学生记录。'}</div>`;
    return;
  }
  if(S.cloudLinked&&S.cloudOwnerId===guardian.user.id){
    slot.innerHTML=`<div class="nm-idcard linked">☁️ ${ko?'연결된 학생':en?'Connected learner':'已关联学生'}: <b>${esc(S.name)}</b> · ${ko?'보호자 이메일에 연결됨':en?'Connected to guardian email':'已关联监护人邮箱'}${cloudSyncError?`<p role="status">${ko?'이 기기에 저장했어요. 클라우드 저장에 실패해 다음 저장 때 다시 시도해요.':en?'Saved on this device. Cloud save failed; it will retry on the next save.':'已保存在本设备上，云端保存失败，将在下次保存时重试。'}</p>`:''}</div>`;
    return;
  }
  slot.innerHTML=`<div class="nm-idcard">
    <div class="nm-idcard-t">☁️ ${S.onboarded?(ko?'학생 기록 연결':en?'Connect learner records':'关联学生记录'):(ko?'이어할 학생 이름':en?'Learner name to continue':'继续学习的学生姓名')}</div>
    <div class="nm-idcard-row">
      <input id="idName" maxlength="8" placeholder="${t('obNamePh')}" value="${esc(S.name||'')}">
      <button class="nm-btn" id="idClaim">${S.onboarded?(ko?'연결':en?'Connect':'关联'):(ko?'이어하기':en?'Continue':'继续')}</button>
    </div>
    <div class="nm-idcard-msg" id="idMsg" role="status">${ko?'이 학생의 기록을 인증한 보호자 이메일에 연결해요. 예전 기록의 보호자 연결은 학원에 요청해 주세요.':en?'Connect this learner to the verified guardian email. Ask your academy to link an older profile.':'将学生记录关联到已验证的监护人邮箱。旧记录请联系学院关联。'}</div>
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
      if(!S.onboarded){btn.disabled=false;msg.textContent=ko?'이 이메일에 연결된 학생을 찾지 못했어요. 예전 기록은 학원에 연결을 요청하거나 처음부터 시작해 주세요.':en?'No learner with this name is linked to this email. Ask your academy to link an older record, or start a new learner.':'未找到与此邮箱关联的学生。请联系学院关联旧记录，或新建学生。';return;}
      try{
        const okClaim=await cloudClaim(name,S);
        if(okClaim){
          S.name=name; S.cloudLinked=true; S.cloudOwnerId=okClaim.owner; save();
          toast(ko?'아이디 등록 완료! ✨':en?'ID registered! ✨':'注册成功！✨',true);
          render(); S.view='closet';  // 칩 이름 갱신 후 옷장 유지
          return;
        }
        existing=await cloudGet(name).catch(()=>null);
        if(!existing){btn.disabled=false;msg.textContent=ko?'이 이메일에 이미 학생이 있으면 기존 학생 이름으로 이어해 주세요. 다른 학생은 별도 이메일을 사용해 주세요. 기존 기록 연결은 학원에 문의해 주세요.':en?'If this email already has a learner, continue with that learner’s name. Use a separate email for another learner. Contact your academy to link older records.':'若此邮箱已关联学生，请使用原学生姓名继续。其他学生请使用不同邮箱。关联旧记录请联系学院。';return;}
      }catch(e){ btn.disabled=false; msg.textContent=ko?'학생을 등록하지 못했어요. 잠시 후 다시 시도해 주세요.':en?'Failed — try again soon.':'注册失败，请稍后再试。'; return; }
    }
    /* 이미 있는 이름 → 이어하기 / 다른 이름 */
    btn.disabled=false;
    msg.innerHTML=`${ko?`'${esc(name)}'는 이미 있는 이름이에요. 예전에 내가 만든 거라면 이어서 할 수 있어요.`:en?`'${esc(name)}' is taken. If that was you, continue below.`:`'${esc(name)}'已被使用。如果是你，可以继续。`}
      <div class="nm-idcard-row" style="margin-top:8px">
        <button class="nm-btn" id="idResume">${ko?'이건 나예요! 이어하기 ▶':en?"That's me! Continue ▶":'是我！继续 ▶'}</button>
        <button class="nm-btn ghost" id="idOther">${ko?'다른 이름 쓸게요':en?'Try another':'换个名字'}</button>
      </div>`;
    $('#idResume').onclick=()=>{
      if(!backupBeforeCloudResume(existing.owner_id))return;
      guardianEntry=false;
      const st=existing&&existing.state?existing.state:{};
      S={...defaults(),...st};
      S.name=name; S.onboarded=true; S.cloudLinked=true;
      S.cloudOwnerId=existing.owner_id;
      if(!S.account||!S.account.status)S.account={status:'trial',code:null,checkedAt:0};
      normalizeLoadedState(false);
      // 보호자 인증은 기록 소유권만 확인한다. 학원 승인 상태는 별도로 유지한다.

      if(!S.character)S.character={number:3,color:'blue',bg:'plain',cape:'none',hat:'none'};
      if(S.character.hat===undefined)S.character.hat='none'; // 기존 저장본 하위호환
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
      <button class="nm-back" id="backExam">← ${navigationLabel('town')}</button>
      <div class="nm-unit-title">📝 ${ko?'학습지 & 시험':en?'Worksheet & Exam':'学习单 & 考试'}</div>
    </div>
    <div class="nm-step-body nm-wsh-wrap">
      <div class="nm-card nm-gate-card-inline">
        <div class="nm-card-h">🔒 ${ko?'가입·이용기간을 확인해 주세요':en?'Check registration and membership':'请确认注册和使用期限'}</div>
        <p class="nm-wsh-sentence">${ko?'이메일 인증 후 30일 체험할 수 있어요. 이후에는 학원에서 6개월 또는 1년 이용을 승인해요.':en?'Verify your email for a 30-day trial. Your academy can then approve 6 months or 1 year.':'验证邮箱后可体验30天，之后可由学院批准6个月或1年的使用期。'}</p>
        <button class="nm-btn full" id="examGate">${ko?'가입·이용 상태 보기':en?'View registration and membership':'查看注册及使用状态'}</button>
      </div>
    </div>`;
    $('#backExam').onclick=()=>{S.view='town';save();render();};
    $('#examGate').onclick=showGateModal;
    return;
  }
  if(!window.NM_EXAM||!window.examScreen){
    scr.innerHTML=`<div class="nm-unit-bar"><button class="nm-back" id="backExam">← ${navigationLabel('town')}</button></div>
      <p style="padding:40px;text-align:center">시험 화면을 불러오지 못했어요. 새로고침해 주세요.</p>`;
    $('#backExam').onclick=()=>{S.view='town';save();render();};
    return;
  }
  scr.innerHTML=`<div class="nm-unit-bar">
    <button class="nm-back" id="backExam">← ${navigationLabel('town')}</button>
    <div class="nm-unit-title">📝 ${S.lang==='ko'?'학습지 & 시험':S.lang==='en'?'Worksheet & Exam':'学习单 & 考试'}</div>
  </div><div id="nm-exam-cnt" class="nm-step-body"></div>`;
  $('#backExam').onclick=()=>{S.view='town';save();render();};
  window.examScreen(document.getElementById('nm-exam-cnt'), {
    currentCourse: currentCourseKey(), tiers: ROAD_TIERS,
    /* 주차 라벨용 — 연산 로드맵 화면(courseroad)과 같은 설정을 공유한다 */
    cadence: S.roadCadence,
    onCadence: c => {
      if(!['w1','w2'].includes(c)||!applyLearningSettings({cadence:c})){
        toast(S.lang==='en'?'Could not change the plan. Check whether your academy manages it.':S.lang==='zh'?'未能更改计划，请确认是否由学院设置。':'계획을 바꾸지 못했어요. 학원에서 정한 계획인지 확인해 주세요.',true);return false;
      }
      return true;
    },
    /* 세션 인쇄 회수(2026-09-04, "웹페이지 들어가면 추가로 계속 인쇄") — 참조를 그대로
       넘긴다(같은 객체를 exam.js가 읽고, onPrinted로 쓰기만 요청). */
    roadPrints: S.roadPrints,
    onPrinted: key => { S.roadPrints[key]=(S.roadPrints[key]||0)+1; save(); }
  });
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
  try{const url=new URL(location.href);url.searchParams.delete('ws');history.replaceState(null,'',url);}catch(e){}
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
    /* 수학 팁 — QR 을 찍고 들어온 자리에서도 같은 기억 고리를 본다(2026-09-08, 원장
       "팁이 잘 녹아들어갈 수 있도록"). 학습지·정답지와 같은 함수라 문구가 어긋나지 않는다. */
    const tipBox = (NM_EXAM.mathTipHtml && NM_EXAM.mathTipHtml(cfg.thread)) || '';
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
      ${tipBox}
      ${ruleBox}
      ${unitBtn}
    </div>`;
  }

  scr.innerHTML = `<div class="nm-unit-bar">
    <button class="nm-back" id="wshBack">← ${navigationLabel('town')}</button>
    <div class="nm-unit-title">${ko?'학습지 도우미':en?'Worksheet Helper':'学习单助手'}</div>
  </div>
  <div class="nm-step-body nm-wsh-wrap">${bodyHtml}</div>`;

  $('#wshBack').onclick = () => {exitWsHelper();S.view='town';S.unitReturn=null;S._fromRoadmap=false;S._fromCourseRoad=false;save();render();};
  const goBtn = $('#wshGoUnit');
  if(goBtn) goBtn.onclick = () => {
    S.unitReturn={view:'worksheethelper',wsId:wsHelperId};
    exitWsHelper();
    S.unit = info.unitId; S.step = null; S.sub = {}; S.tierId = null; S.view = 'unit'; S._fromRoadmap = false; S._fromCourseRoad = false;
    save(); render();
  };
  renderMath(scr);
}

/* A deliberate login/preview entry opens the mode selector. Reloads are handled
   by entry.js and always return to approval/login. */
function maybeShowTitle(){
  if(S.onboarded)S.view='title';
}
/* ---------- 시작 ---------- */
function boot(){
  if(booted)return;
  if(!GEN||!CUR||!UNITS){app.innerHTML='<p style="padding:40px;text-align:center">학습 화면을 불러오지 못했어요. 새로고침해 주세요.</p>';return;}
  booted=true;
  if(!stateStorageReady){
    app.innerHTML='<div class="nm-step-body"><p role="alert">학생 기록을 불러오지 못했어요. 브라우저 저장 공간을 확인하고 다시 열어 주세요.</p><a class="nm-btn" href="access.html">로그인 화면으로</a></div>';return;
  }
  if(guardianAuth&&guardianAuth.pendingLink&&guardianAuth.pendingLink()){guardianEntry=!S.onboarded;S.view='closet';}
  else maybeShowTitle();
  render();
  const details=$('.nm-closet-settings');if(details&&guardianAuth&&guardianAuth.pendingLink&&guardianAuth.pendingLink())details.open=true;
  reverifyAccountIfNeeded(); // 승인번호 회수 동기화 — 실패해도 조용히 무시(오프라인에서 안 잠금)
}
if(window.katex)boot(); else{const t2=setInterval(()=>{if(window.katex){clearInterval(t2);boot();}},60);setTimeout(()=>{if(!window.katex)boot();},1500);}
})();
