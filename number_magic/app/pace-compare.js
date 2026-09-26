/* ============================================================
   Numbers of Magic — 속도 비교 진단 (app/pace-compare.js) · 2026-09-26
   ------------------------------------------------------------
   원장: "연산 단계를 진단하고, 지금 속도면 S학원 A반 속도 / S학원 프리미어 속도 /
          KMO 속도를 알 수 있고, 상위 레벨이 되려면 어떻게 해야 하고 기간을
          줄여야 하는지 알려 줍니다."

   이 파일은 순수 로직 + 기준표 + 문구만 갖는다(DOM 없음, node 에서 require 가능).
   주차 계산은 여기서 하지 않는다 — main.js 의 roadTotals()/coursePaceWeeks()
   (연산 로드맵 화면이 이미 쓰는 그 계산)를 weeksTo 콜백으로 받아 쓴다.
   검사기: scripts/check-pace-compare.js

   ── 좌표 ──
   모든 시점은 "학령개월(sm)" 하나로 적는다: 초1 3월 = 0 (main.js schoolMonths() 와 같은 축).
   한국 나이 a세 m월 → sm = (a−8)·12 + (m−3)   (8세 3월에 초1 입학)
   예: 7세 12월 = −3 · 6세 9월 = −18 · 초1 11월 = 8 · 초3 6월 = 27.

   ── 이름 ──
   원장이 익명으로 적은 그대로만 쓴다: "S학원 A반" · "S학원 프리미어" · "KMO".
   실제 학원 이름은 화면 문구 어디에도 쓰지 않는다(검사기가 막는다).

   ── 어떤 것도 잠그지 않는다. 합격·결과를 약속하지 않는다. 안내만 한다. ──
   ============================================================ */
(function(){
'use strict';
const W = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : {});

/* 한국 나이 a세 m월 → 학령개월 */
function smOfKAge(age, month){ return (age-8)*12 + (month-3); }

/* ── 1. 마일스톤 ↔ 우리 과정(주제로 맞춤) ──────────────────────
   course = "이 과정을 시작했다 = 그 앞 단계까지 끝냈다"는 과정 번호(C 뒤의 수).
   출처가 두 개다.
   ① roadmap/index.html 의 연산 선택지 한 줄 설명(1165~1176행) — 상담 도구가 부모에게
      보여 주는 그 설명.
   ② number_magic/CURRICULUM-SOURCES.md §9 — 기적의 계산법 권별 주제(초1~초3).
   우리 과정 제목은 data/courses.js. 애매하면 **더 많이 끝내야 도달로 치는 쪽(보수적)**. */
const MILESTONES = [
  /* ① "5를 2와 3으로 가를 수 있어요 / 가르기와 모으기를 안정적으로" = 유아 연산 교재 K단계.
     우리 과정 0 「수와 문장제와 친해지기」(수의 나라, 가르기·모으기 N-유닛)가 그 자리 → 과정 1 시작. */
  { id:'K',  course:1,  name:{ko:'수 감각 · 가르기와 모으기',en:'Number sense · split & combine',zh:'数感 · 分与合'} },
  /* ① 2권 "5+8, 8−4, 12−4 … 한 자리 수 덧셈·뺄셈" · ② 1·2권 = 초1 자연수 덧뺄.
     우리 과정 1 「자릿값과 첫 덧셈·뺄셈」 + 과정 2 「받아올림과 두 배 수」 → 과정 3 시작. */
  { id:'G2', course:3,  name:{ko:'한 자리 수 덧셈·뺄셈 (받아올림 포함)',en:'One-digit + and − (with carrying)',zh:'一位数加减（含进位）'} },
  /* ① 3권 "24+18, 42−17 … 두 자리 수 받아올림·받아내림" · ② 3권 = 초2 덧뺄 고급.
     우리 과정 3 「두 자리 덧뺄셈 시작」 + 과정 4 「두 자리 올림 덧뺄셈」 → 과정 5 시작. */
  { id:'G3', course:5,  name:{ko:'두 자리 수 받아올림·받아내림',en:'Two-digit + and − with regrouping',zh:'两位数进位退位加减'} },
  /* ① 4권 "구구단을 … 문제에 활용" · ② 4권 = 초2 구구단.
     우리 과정 5 「구구단 첫걸음」 · 6 「구구단 완성」 · 7 「구구단 종합」 → 과정 8 시작.
     (구구단이 과정 7 까지 이어지므로 7 까지 끝내야 도달 — 보수적) */
  { id:'G4', course:8,  name:{ko:'구구단',en:'Times tables',zh:'九九乘法表'} },
  /* ① 5권 "24÷6, 곱셈과 나눗셈 기초" · ② 5권 = 초3 곱셈·나눗셈 초급.
     우리 과정 8 「몇십 곱과 나눗셈의 시작」 + 과정 9 「두 자리 곱셈 암산과 나머지」 → 과정 10 시작. */
  { id:'G5', course:10, name:{ko:'곱셈·나눗셈 기초',en:'Basic × and ÷',zh:'乘除法基础'} },
  /* ① 6권 "두 단계 이상 계산 … 복합 연산" · ② 6권 = 초3 곱셈·나눗셈 중급.
     두 출처가 다르다(①은 혼합계산, ②는 곱나눗 중급). ②를 따라
     과정 10 「세 자리 곱셈과 검산」 · 11 「두 자리×두 자리 곱셈」 · 12 「나눗셈과 역연산」 → 과정 13 시작.
     ①(혼합계산)을 따르면 과정 16 「혼합계산과 역연산」까지라 더 늦다 — 보고서에 미결로 적음. */
  { id:'G6', course:13, name:{ko:'곱셈·나눗셈 중급 (초3 연산 끝)',en:'Intermediate × and ÷ (end of Grade 3 arithmetic)',zh:'乘除法中级（小三运算结束）'} },
  /* 중등 연산 = 과정 29 「소인수분해와 정수의 세계」(tier middle1)부터. data/courses.js */
  { id:'MID',  course:29, name:{ko:'중등 연산 시작',en:'Start of middle-school arithmetic',zh:'开始初中运算'} },
  /* 고등 연산 = 과정 38 「다항식과 나머지정리」(tier highmath1)부터. data/courses.js */
  { id:'HIGH', course:38, name:{ko:'고등 연산 시작',en:'Start of high-school arithmetic',zh:'开始高中运算'} }
];
function milestone(id){ return MILESTONES.find(m=>m.id===id)||null; }

/* ── 2. 기준표 ─────────────────────────────────────────────
   (가) roadmap/index.html — const ROAD_L0.calc (471~477행)과 const LEVELS 의 shift(482~487행).
        L0 연산 블록(끝나는 달):  K 5세 9월 · 2권 5세 11월 · 3권 6세 1월 · 4권 6세 3월 ·
                                   5권 6세 5월 · 6권 6세 11월  (그 뒤 "복합연산·정확도 유지")
        각 레벨은 L0 을 shift 개월 뒤로 민 것: L0 0 · L1 3 · L2 7 · L3 10 · L4 12.
        "끝난 달의 다음 달 초 = 도달"로 적는다.
        L4 "안정적 상위권 A반" → S학원 A반 · L1 "프리미어 표준 진도" → S학원 프리미어 ·
        L0 "선행이 빠른 프리미어 합격생" → S학원 프리미어의 빠른 쪽 끝(따로 이름 붙이지 않음).
        ⚠ 이 표의 격자는 5세 5월 ~ 7세 7월(sm −8)까지다. L4 의 6권 끝(7세 11월)은 격자 밖이고
          shift 규칙(+12)으로만 나온다 → beyondGrid 로 표시.
   (나) KMO — number_magic/과정-로드맵.md §18 "남은 것" (원장 실측):
        "5살 14+9 → 초1 11월 중등 연산 → 초3 6월 고등 연산 ≈ 4.6년이 최상위".
        · 초1 11월 → sm 8 · 초3 6월 → sm 27.
        · "5살 14+9"의 달은 적혀 있지 않다. 4.6년(≈55개월)을 거꾸로 세면 5세 11월(sm −28).
          14+9(한 자리+두 자리 받아올림)는 우리 과정 2 「받아올림과 두 배 수」 → course 2.
        · 같은 절의 "중1 연산 → 중3 연산 완료 약 12개월"은 구간 길이 설명이라 점으로 쓰지 않았다
          (원장 실측 세 점과 섞으면 서로 어긋난다).  */
const ROADMAP_L0_CALC_END = { K:[5,9], G2:[5,11], G3:[6,1], G4:[6,3], G5:[6,5], G6:[6,11] };
const ROADMAP_GRID_END_SM = smOfKAge(7,7);   // 격자 마지막 칸 7세 7월
function roadmapAnchors(shift){
  return Object.keys(ROADMAP_L0_CALC_END).map(id=>{
    const [a,m]=ROADMAP_L0_CALC_END[id];
    const sm=smOfKAge(a,m)+1+shift;          // 끝난 달 + 1 = 도달
    return { id, course:milestone(id).course, sm, beyondGrid: sm-1>ROADMAP_GRID_END_SM };
  });
}
const BENCH = [
  { key:'a', rank:1, shift:12, src:'roadmap/index.html L4',
    name:{ko:'S학원 A반',en:'Academy S · Class A',zh:'S学院 A班'},
    anchors: roadmapAnchors(12) },
  { key:'p', rank:2, shift:3, src:'roadmap/index.html L1 (빠른 쪽 끝 = L0)',
    name:{ko:'S학원 프리미어',en:'Academy S · Premier',zh:'S学院 Premier'},
    anchors: roadmapAnchors(3), fast: roadmapAnchors(0) },
  { key:'k', rank:3, src:'과정-로드맵.md §18 원장 실측',
    name:{ko:'KMO',en:'KMO',zh:'KMO'},
    anchors: [
      { id:'C2',   course:2,  sm:smOfKAge(5,11), derived:true },  // 4.6년 역산
      { id:'MID',  course:29, sm:8 },                              // 초1 11월
      { id:'HIGH', course:38, sm:27 }                              // 초3 6월
    ] }
];
function bench(key){ return BENCH.find(b=>b.key===key)||null; }
/* 기준선이 끝나는 시점 — 이보다 나이가 많으면 세 기준 모두 비교 범위 밖 */
const LAST_BENCH_SM = Math.max.apply(null, BENCH.map(b=>Math.max.apply(null,b.anchors.map(a=>a.sm))));
const TOL = 1;                 // ±1개월은 "같은 속도"로 본다
const WEEKS_PER_MONTH = 52/12; // 나이와 비교하므로 달력 기준(로드맵 합계의 "4주=한 달"과 다름)

/* ── 3. 계산 ─────────────────────────────────────────────
   ctx = { curNum, curFrac(0~1, 지금 과정에서 끝낸 몫), smNow,
           weeksTo(targetCourseNum) → 지금 자리에서 그 과정 시작까지 주(달력 주, 현재 설정) }
   반환: { rows:[{key, status, delta, lead, horizon, childSm, benchSm, fastDelta}], verdict, target, out } */
function childSmAt(ctx, course){
  if(course<=ctx.curNum) return null;                // 이미 지남
  return ctx.smNow + ctx.weeksTo(course)/WEEKS_PER_MONTH;
}
function passed(ctx, course){ return ctx.curNum>=course; }
function evalBench(ctx, b){
  const ahead=b.anchors.filter(a=>!passed(ctx,a.course));
  if(ahead.length){
    const h=ahead[ahead.length-1];                   // 기준선의 가장 먼 점에서 판정(속도가 드러나는 자리)
    const childSm=childSmAt(ctx,h.course);
    const delta=childSm-h.sm;                        // 음수 = 우리 아이가 먼저
    let fastDelta=null;
    if(b.fast){ const f=b.fast.find(x=>x.id===h.id); if(f) fastDelta=childSm-f.sm; }
    return { key:b.key, status: delta<=TOL?'on':'behind', delta, horizon:h, childSm, benchSm:h.sm, fastDelta };
  }
  const last=b.anchors[b.anchors.length-1];
  /* 기준선의 마지막 점을 이미 지났다: 그 나이보다 어리면 확실히 앞섰다. 더 많으면 언제 지났는지
     모르므로 비교하지 않는다(지어내지 않는다). */
  if(ctx.smNow<=last.sm+TOL){
    let fastDelta=null;
    if(b.fast){ const f=b.fast.find(x=>x.id===last.id); if(f) fastDelta=ctx.smNow-f.sm; }
    return { key:b.key, status:'on', delta:ctx.smNow-last.sm, horizon:last, childSm:null, benchSm:last.sm, passed:true, fastDelta };
  }
  return { key:b.key, status:'out', delta:null, horizon:last, childSm:null, benchSm:last.sm, passed:true };
}
function evaluate(ctx){
  const rows=BENCH.map(b=>evalBench(ctx,b));
  const out = ctx.smNow>LAST_BENCH_SM;               // 초3 6월 이후 = 세 기준 모두 끝난 나이
  const on=rows.filter(r=>r.status==='on');
  const verdict=on.length? on.reduce((a,r)=>bench(r.key).rank>bench(a.key).rank?r:a) : null;
  /* 다음 목표 = 판정보다 한 단계 위, 판정이 없으면 비교 가능한 가장 낮은 기준 */
  let target=null;
  if(!out){
    const cand=rows.filter(r=>r.status==='behind'&&(!verdict||bench(r.key).rank>bench(verdict.key).rank));
    if(cand.length) target=cand.reduce((a,r)=>bench(r.key).rank<bench(a.key).rank?r:a);
  }
  return { rows, verdict, target, out };
}
/* 설정 후보 중 target 기준에 닿는 것 — 바꾸는 손잡이가 적고 덜 무리한 순.
   settings = [{cad, pace, speed, weeksTo}], cur = 지금 설정.
   반환 [{cad,pace,speed, delta, saved(개월, 현재 대비 앞당김), changes}] 최대 3개(손잡이 종류가 다른 것 우선). */
function suggest(ctx, targetKey, cur, settings, paceOrder){
  const b=bench(targetKey); if(!b) return [];
  const pIdx=k=>paceOrder.indexOf(k);                // 0 = 가장 빠름
  const base=evalBench(ctx,b);
  const res=[];
  settings.forEach(s=>{
    const r=evalBench(Object.assign({},ctx,{weeksTo:s.weeksTo}),b);
    if(r.status!=='on') return;
    const changes=(s.cad!==cur.cad?1:0)+(s.pace!==cur.pace?1:0)+(s.speed!==cur.speed?1:0);
    if(!changes) return;
    /* 더 느려지는 쪽은 후보가 아니다(각 손잡이는 지금보다 같거나 빠른 쪽만) */
    if((cur.cad==='w2'&&s.cad==='w1')||pIdx(s.pace)>pIdx(cur.pace)||s.speed<cur.speed) return;
    /* 무리 정도: 주2회 전환 1 · 빠르기 한 칸 0.6 · 속도 한 칸(0.25배) 0.8 — 작을수록 먼저 */
    const strain=(s.cad!==cur.cad?1:0)+(pIdx(cur.pace)-pIdx(s.pace))*0.6+(s.speed-cur.speed)/0.25*0.8;
    res.push({ cad:s.cad, pace:s.pace, speed:s.speed, delta:r.delta,
      saved: (base.childSm!=null&&r.childSm!=null)? base.childSm-r.childSm : null,
      changes, strain,
      kind: changes>1?'combo':s.cad!==cur.cad?'cad':s.pace!==cur.pace?'pace':'speed' });
  });
  res.sort((x,y)=>x.changes-y.changes||x.strain-y.strain);
  const picked=[], seen={};
  res.forEach(r=>{ if(picked.length<3&&!seen[r.kind]){ seen[r.kind]=1; picked.push(r); } });
  return picked;
}

/* ── 4. 문구 (ko 해요체 / en / zh) ── {n} 자리표시 ── */
const STR = {
  eyebrow:{ko:'속도 비교 진단',en:'Pace comparison',zh:'速度对比诊断'},
  title:{ko:'지금 속도라면 어느 기준과 나란할까요?',en:'At this pace, which benchmark do we keep up with?',zh:'按现在的速度，能跟上哪个标准？'},
  lead:{ko:'지금 과정과 위에서 고른 빠르기로 앞으로의 길을 그려, 세 기준과 나란히 놓아 봐요.',
        en:'We project the road ahead from the current course and the pace chosen above, then line it up against three benchmarks.',
        zh:'按照当前课程和上面选的速度推算前面的路，再和三个标准并排比较。'},
  needAge:{ko:'아이의 나이(학년)를 알려 주면 비교할 수 있어요.',en:'Tell us the child’s age or grade to compare.',zh:'告诉我们孩子的年龄（年级）就能比较。'},
  needAgeBtn:{ko:'나이·학년 알려주기',en:'Set age / grade',zh:'填写年龄·年级'},
  ageNow:{ko:'기준 나이',en:'Age used',zh:'所用年龄'},
  today:{ko:'오늘 기준',en:'as of today',zh:'以今天为准'},
  change:{ko:'바꾸기',en:'Change',zh:'修改'},
  verdictPre:{ko:'지금 속도라면',en:'At this pace',zh:'按现在的速度'},
  verdictPost:{ko:'속도예요',en:'pace',zh:'的速度'},
  verdictFast:{ko:'프리미어 중에서도 빠른 쪽(선행이 빠른 합격생 진도)과 나란해요.',en:'Level with the fast end of Premier (early-ahead admits).',zh:'与Premier中较快的一端（超前较快的录取生进度）持平。'},
  verdictNone:{ko:'지금 속도로는 세 기준보다 조금 천천히 가요.',en:'At this pace the road runs a little slower than all three benchmarks.',zh:'按现在的速度，比三个标准都稍慢一些。'},
  verdictTop:{ko:'가장 빠른 기준과 나란해요. 이제는 속도보다 정확도와 문장제를 다지는 게 좋아요.',en:'Level with the fastest benchmark. From here, accuracy and word problems matter more than speed.',zh:'已与最快的标准持平。现在比起速度，更该巩固准确度和应用题。'},
  outTitle:{ko:'이 비교는 유아~초3 선행 기준이에요',en:'These benchmarks cover pre-school to Grade 3',zh:'这些标准只覆盖学龄前到小三'},
  outBody:{ko:'세 기준선은 초3 6월에서 끝나요. 지금 학년에서는 기준선과 견주기보다, 학년 진도를 놓치지 않고 한 과정씩 다지는 것이 기준이에요.',
           en:'All three lines end at Grade 3, June. At this grade the yardstick is steady course-by-course progress, not these lines.',
           zh:'三条标准线在小三6月结束。在现在的年级，稳步按课程推进才是标准。'},
  rowsHead:{ko:'언제 닿을까요',en:'When do we get there?',zh:'什么时候能到？'},
  you:{ko:'우리 아이',en:'Our child',zh:'我家孩子'},
  passedTxt:{ko:'이미 지났어요',en:'Already past',zh:'已经过了'},
  noLine:{ko:'기준 없음',en:'no line',zh:'无标准'},
  course:{ko:'과정',en:'Course',zh:'课程'},
  ahead:{ko:'{n}개월 빨라요',en:'{n} mo earlier',zh:'早{n}个月'},
  behind:{ko:'{n}개월 늦어요',en:'{n} mo later',zh:'晚{n}个月'},
  even:{ko:'나란해요',en:'level',zh:'持平'},
  outShort:{ko:'비교 범위 밖',en:'out of range',zh:'超出比较范围'},
  upHead:{ko:'상위 레벨이 되려면',en:'To reach the next level',zh:'想达到更高一级'},
  upNeed:{ko:'{name} 속도가 되려면 {milestone}에 약 {n}개월 먼저 닿아야 해요.',en:'To keep {name} pace, reach “{milestone}” about {n} months sooner.',zh:'要达到{name}的速度，需要提前约{n}个月到达“{milestone}”。'},
  upNone:{ko:'앱의 빠르기 설정만으로는 닿지 않아요. 기준선이 나이에 묶여 있어서, 지금 필요한 것은 속도보다 꾸준함이에요.',
          en:'The app’s pace settings alone can’t get there — the lines are tied to age. Steady weekly work matters more now.',
          zh:'仅靠应用的速度设置到不了。标准线与年龄挂钩，现在更需要的是坚持。'},
  saved:{ko:'{n}개월 단축',en:'{n} mo sooner',zh:'缩短{n}个月'},
  apply:{ko:'이 설정으로 바꾸기',en:'Use these settings',zh:'改用此设置'},
  applied:{ko:'바꿨어요 — 위 주차와 이 진단이 함께 바뀌었어요.',en:'Done — the weeks above and this check both updated.',zh:'已更改——上面的周数和本诊断都已更新。'},
  optCad:{ko:'주 2회반으로',en:'Twice a week',zh:'改为每周2次'},
  optPace:{ko:'목표 빠르기 “{v}”',en:'Target pace “{v}”',zh:'目标速度“{v}”'},
  optSpeed:{ko:'속도 {v}배',en:'Speed {v}×',zh:'速度{v}倍'},
  optCadBack:{ko:'주 1회반으로',en:'Once a week',zh:'改为每周1次'},
  amountNote:{ko:'“양”은 한 회의 문항 수라 기간은 줄이지 않아요.',en:'“Amount” changes problems per class, not the length of the road.',zh:'“分量”只改变每次题数，不缩短期间。'},
  scope1:{ko:'S학원 A반·프리미어 기준선은 5~7세 상담용 진도표(연산과정 줄)에서 가져왔어요. 7세가 넘으면 KMO 기준선만 근거가 있어요.',
          en:'The Class A and Premier lines come from an ages-5–7 consulting chart (its arithmetic row). Past age 7 only the KMO line is sourced.',
          zh:'A班·Premier标准线取自5~7岁咨询用进度表（运算一行）。7岁以后只有KMO标准线有依据。'},
  scope2:{ko:'연산 트랙만 센 기간이에요 — 사고력·교과는 별도예요. 주차는 빠짐없이 수업했을 때 기준이라 방학·결석·복습이 있으면 그만큼 늦어져요.',
          en:'Counts the arithmetic track only — thinking-math and school-math are separate. Weeks assume no missed classes; holidays, absences and review add time.',
          zh:'只计算运算课程——思维和教材另算。周数按不缺课计算，假期、缺课、复习都会让时间变长。'},
  scope3:{ko:'참고용 안내예요. 합격이나 결과를 약속하지 않고, 어떤 과정도 잠그지 않아요. 나이는 한국 나이(세는 나이) 기준이에요.',
          en:'Advice only — it promises no admission or result and locks nothing. Ages use Korean age counting.',
          zh:'仅供参考——不承诺录取或结果，也不锁定任何课程。年龄按韩国虚岁计算。'},
  srcHead:{ko:'기준표와 과정 대응 보기',en:'See the benchmark table & course mapping',zh:'查看标准表与课程对应'},
  srcMilestone:{ko:'단계',en:'Milestone',zh:'阶段'},
  srcOurs:{ko:'우리 과정',en:'Our course',zh:'我们的课程'},
  beyondGrid:{ko:'진도표 칸 밖(같은 간격으로 이어 계산)',en:'beyond the chart (extended at the same offset)',zh:'超出进度表（按同样间隔推算）'},
  derived:{ko:'4.6년에서 거꾸로 계산',en:'back-calculated from 4.6 years',zh:'由4.6年倒推'},
  legendBand:{ko:'프리미어 표준~빠른 쪽',en:'Premier standard–fast',zh:'Premier 标准~快'}
};
function fmt(s, vars){ return String(s).replace(/\{(\w+)\}/g,(m,k)=>vars&&vars[k]!=null?vars[k]:m); }

const API = { smOfKAge, MILESTONES, milestone, BENCH, bench, ROADMAP_L0_CALC_END, ROADMAP_GRID_END_SM,
  LAST_BENCH_SM, TOL, WEEKS_PER_MONTH, childSmAt, evalBench, evaluate, suggest, STR, fmt };
W.NM_PACE_COMPARE = API;
if(typeof module!=='undefined'&&module.exports) module.exports = API;
})();
