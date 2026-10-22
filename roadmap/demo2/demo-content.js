/*
 * Original demo curriculum, extracted without executing its HTML or DOM script.
 * Source: roadmap/demo/index.html
 * Source SHA-256: 3fca0e5c0742d2e7c68c7d37a8cf1eef08ace0c0334dea5f4e859811afbc629a
 * Preserved: ROAD_L0, LEVELS (shifts 0/3/7/12/17), FIXED_ROWS, rowMeta,
 * question choices, source midpoint/end conversions, original graph stage labels,
 * and source level-comparison arithmetic. These are the original FIVE demo levels,
 * not the later demo2 L0-L13 registry. No academy eligibility or new study duration.
 * Source ranges: 577-653, 781-794, 837, 842-856, 1255-1319, 1509-1522,
 * level comparison 1523-1563; displayed question copy 474-481 and note 494.
 * Adaptations: explicit age/month arguments replace new Date(); pure return values
 * replace DOM writes; monthOf generalizes the existing 5세 January=0 arithmetic
 * axis (including 4세 negative coordinates) without birthday/international-age or
 * school-year rules. Original mm (5/6/7 only) is retained as originalMonthOf.
 * Missing answers remain pending in buildProfile instead of applying the original
 * survey converters' fallback choices. No names, gate, editor, storage or network.
 */
(function(global){
'use strict';
const AGE_START_M = 4, N = 27;
const mm = (age,mon)=>({5:0,6:12,7:24}[age])+(mon-1);
const toIdx = m => m - AGE_START_M;
const cols = (()=>{ let a=[]; for(let i=0;i<N;i++){ const m=i+AGE_START_M; a.push([(5+Math.floor(m/12))+'세',(m%12+1)+'월']); } return a; })();

const B=(text,cls,a1,m1,a2,m2,meta)=>({text,cls,s:mm(a1,m1),e:mm(a2,m2),meta:meta||null});
const ROAD_L0 = {
  school:[
    B('수학 문장 이해','grade-root',5,1,5,4),
    B('지문 이해 ·<br>조건 이해하기','grade-root',5,5,5,9),
    B('1-1 디딤돌<br><span class="sub">기본+응용</span>','grade-12',5,10,5,11),
    B('1-2 디딤돌<br><span class="sub">기본+응용</span>','grade-12',5,12,6,1),
    B('2-1 디딤돌<br><span class="sub">기본+응용</span>','grade-21',6,2,6,3),
    B('2-2 디딤돌<br><span class="sub">기본+응용</span>','grade-21',6,4,6,5),
    B('3-1 디딤돌<br><span class="sub">기본+응용</span>','grade-31',6,6,6,8),
    B('3-2 디딤돌<br><span class="sub">기본+응용</span>','grade-32',6,9,6,11),
    B('2학년 최상위 수학','grade-top2',6,12,7,3),
    B('3학년 최상위 수학','grade-top3',7,4,7,7)
  ],
  thinking1:[
    B('킨더팩토','kinder',5,1,5,4),
    B('키즈팩토<br><span class="sub">원리·탐구·미션</span>','kids',5,5,5,9),
    B('초등팩토 1<br><span class="sub">PRE 1031 기본</span>','elem',5,10,6,2),
    B('필즈 베이직<br><span class="sub">PRE 1031 심화</span>','fields',6,3,6,7),
    B('1031 입문','entry',6,8,7,2),
    B('프리미어 학습 집중','premier',7,3,7,6)
  ],
  thinking2:[
    B('필즈 STEP 1<br><span class="sub">개념 8주</span>','prep',6,3,6,5),
    B('필즈 STEP 2<br><span class="sub">실전 진단</span>','prep',6,6,6,6),
    B('필즈 STEP 3<br><span class="sub">실전 심화+SEMI</span>','prep',6,7,6,7),
    B('필즈 STEP 4<br><span class="sub">S-TOPCLASS+실전</span>','prep',6,8,6,10),
    B('필즈 STEP 5<br><span class="sub">파이널</span>','prep',6,11,6,11),
    B('PREMIER BASE·CORE','premier',6,12,7,1),
    B('GM-초급 12유형','premier',7,2,7,2),
    B('PREMIER DRILL 6회','premier',7,3,7,3),
    B('PREMIER 실전 6회','premier',7,4,7,4),
    B('PREMIER 특강·FINAL','premier',7,5,7,7)
  ],
  home:[
    B('문해길 1<br><span class="sub">심화</span>','home',6,3,6,5),
    B('최상위 사고력<br><span class="sub">TOT 1단계</span>','home',6,6,6,8),
    B('멘사 퍼즐<br><span class="sub">규칙·논리</span>','home',6,9,6,12)
  ],
  calc:[
    B('소마셈 K<br><span class="sub">수 감각·기초 연산</span>','calc',5,1,5,9),
    B('기적의 계산법 2권','calc',5,10,5,11),
    B('기적의 계산법 3권','calc',5,12,6,1),
    B('기적의 계산법 4권','calc',6,2,6,3),
    B('기적의 계산법 5권','calc',6,4,6,5),
    B('기적의 계산법 6권','calc',6,6,6,11),
    B('복합연산·정확도 유지','calc',6,12,7,7)
  ]
};

const LEVELS=[
  {id:'L0',cls:'l0',summary:'선행이 빠른<br>프리미어 합격생',shift:0},
  {id:'L1',cls:'l1',summary:'프리미어<br>표준 진도',shift:3},
  {id:'L2',cls:'l2',summary:'챌린지 합격 후<br>P2·S2 선발 진도',shift:7},
  {id:'L3',cls:'l3',summary:'소마 안정 학습<br>황소 상위권 목표',shift:12},
  {id:'L4',cls:'l4',summary:'황소 심화 목표<br>기초 탄탄히',shift:17}
];
const FIXED_ROWS=['thinking2'];
const rowMeta=[
  ['교과 응용 /<br>교과 심화<br>연산병행','school'],
  ['사고력 1','thinking1'],
  ['사고력 2<br><span class="sub">필즈·프리미어 대비</span>','thinking2'],
  ['추천 가정학습','home'],
  ['연산과정','calc']
];

function blocksFor(shift,key){
  const sh = FIXED_ROWS.includes(key)?0:shift;
  return ROAD_L0[key].map(b=>({...b,s:toIdx(b.s+sh),e:toIdx(b.e+sh)}))
    .filter(b=>b.e>=0&&b.s<=N-1)
    .map(b=>({...b,_s:b.s,_e:b.e,s:Math.max(0,b.s),e:Math.min(N-1,b.e)}));
}

function stripTag(s){return s.replace(/<[^>]+>/g,'');}

const T1_STEPS=[
  {lv:0,key:'키즈팩토',     a1:5,m1:5, a2:5,m2:9},
  {lv:1,key:'초등팩토 1',   a1:5,m1:10,a2:6,m2:2},
  {lv:2,key:'필즈 베이직',  a1:6,m1:3, a2:6,m2:7},
  {lv:3,key:'1031 입문',    a1:6,m1:8, a2:7,m2:2},
  {lv:4,key:'프리미어',     a1:7,m1:3, a2:7,m2:6}
];
// 세로축 3열 라벨 (위=높은단계 lv4 ~ 원점 lv0=키즈팩토)
const Y_ROWS=[
  {lv:4,t1:'프리미어',     sch:['3학년','최상위'], cal:['복합','연산']},
  {lv:3,t1:'1031 입문',   sch:['3-1~','3-2'],    cal:['기적','5~6권']},
  {lv:2,t1:'필즈 베이직',  sch:['2-1~','2-2'],    cal:['기적','3~4권']},
  {lv:1,t1:'초등팩토 1',   sch:['1-1~','1-2'],    cal:['기적','2권']},
  {lv:0,t1:'키즈팩토',     sch:['지문','이해'],    cal:['소마셈','K']}
];

function lineInLevel(L,rowKey,curMeta,levelCls,guide){
  const arr=blocksFor(L.shift,rowKey);
  const b=arr.find(x=>stripTag(x.text).includes(curMeta.key));
  if(!b) return null;
  return {key:curMeta.key, pos:curMeta.pos, levelCls};
}

/* ---------- 설문 → 현재 위치 ---------- */
function currentPositions(d){
  return {
    school: schoolToBlock(d.school),
    thinking1: thinkingToBlock(d.thinking),
    calc: calcToBlock(d.calcRadio)
  };
}
const THINKING_OPTIONS=[
  ['킨더팩토 진행 중',''],['킨더팩토 완료',''],
  ['키즈팩토 진행 중',''],['키즈팩토 완료',''],
  ['초등팩토 진행 중','초등팩토 안하고 PRE 1031 하는 경우'],['초등팩토 완료',''],
  ['PRE 1031 진행 중','필즈 베이직 수준'],['PRE 1031 완료',''],
  ['1031 입문 진행 중',''],['1031 입문 완료',''],
  ['1031 초급 진행 중',''],['1031 초급 완료','']
];
const ORDER=THINKING_OPTIONS.map(x=>x[0]);
function highThinking(arr){return arr.slice().sort((a,b)=>ORDER.indexOf(b)-ORDER.indexOf(a))[0]||'';}
function thinkingToBlock(arr){
  const top=highThinking(arr);
  const done=top.includes('완료');
  const doneOf=v=>arr.includes(v+' 완료');
  if(top.includes('PRE 1031')){
    if(doneOf('초등팩토')) return {key:'필즈 베이직',pos:done?'end':'mid'};
    return {key:'초등팩토 1',pos:done?'end':'mid'};
  }
  if(top.includes('킨더팩토')) return {key:'킨더팩토',pos:done?'end':'mid'};
  if(top.includes('키즈팩토')) return {key:'키즈팩토',pos:done?'end':'mid'};
  if(top.includes('초등팩토')) return {key:'초등팩토 1',pos:done?'end':'mid'};
  if(top.includes('1031 입문')) return {key:'1031 입문',pos:done?'end':'mid'};
  if(top.includes('1031 초급')) return {key:'프리미어 학습 집중',pos:done?'end':'mid'};
  return {key:'키즈팩토',pos:'mid'};
}
const SCHOOL_OPTIONS=['교과 진행 안 함','1-1 진행 중','1-2 진행 중','2-1 진행 중','2-2 진행 중','3-1 진행 중','3-2 진행 중'];
function schoolToBlock(v){
  if(!v||v==='교과 진행 안 함') return {key:'수학 문장 이해',pos:'mid'};
  return {key:v.replace(' 진행 중',''),pos:'mid'};
}
// 연산 라디오 + 설명
const CALC_RADIO=[
  ['소마셈 K 진행 중','예: 5를 2와 3으로 가를 수 있어요.','소마셈 K','mid'],
  ['소마셈 K 완료','가르기와 모으기를 안정적으로 할 수 있어요.','소마셈 K','end'],
  ['기적의 계산법 2권 진행 중','예: 5+8, 8-4, 12-4를 혼자 풀 수 있어요.','기적의 계산법 2권','mid'],
  ['기적의 계산법 2권 완료','한 자리 수 덧셈·뺄셈 필산이 안정적이에요.','기적의 계산법 2권','end'],
  ['기적의 계산법 3권 진행 중','예: 24+18, 42-17 같은 문제를 풀고 있어요.','기적의 계산법 3권','mid'],
  ['기적의 계산법 3권 완료','두 자리 수 받아올림·받아내림 계산이 안정적이에요.','기적의 계산법 3권','end'],
  ['기적의 계산법 4권 진행 중','구구단을 어느 정도 알고 있어요.','기적의 계산법 4권','mid'],
  ['기적의 계산법 4권 완료','구구단을 외우는 데서 끝나지 않고 문제에 활용할 수 있어요.','기적의 계산법 4권','end'],
  ['기적의 계산법 5권 진행 중','예: 24÷6, 곱셈과 나눗셈 기초를 배우고 있어요.','기적의 계산법 5권','mid'],
  ['기적의 계산법 5권 완료','곱셈·나눗셈 기초 계산을 할 수 있어요.','기적의 계산법 5권','end'],
  ['기적의 계산법 6권 진행 중','두 단계 이상 계산을 연이어 연습하고 있어요.','기적의 계산법 6권','mid'],
  ['기적의 계산법 6권 완료','복합 연산 계산이 안정적이고 실수가 적어요.','기적의 계산법 6권','end']
];
function calcToBlock(v){
  const r=CALC_RADIO.find(x=>x[0]===v);
  if(!r) return {key:'소마셈 K',pos:'mid'};
  return {key:r[2],pos:r[3]};
}

function levelStdMonth(shift, rowKey, meta){
  const b=ROAD_L0[rowKey].map(x=>({...x,s:(FIXED_ROWS.includes(rowKey)?x.s:x.s+shift),e:(FIXED_ROWS.includes(rowKey)?x.e:x.e+shift)}))
    .find(x=>stripTag(x.text).includes(meta.key));
  if(!b) return null;
  return meta.pos==='end'?b.e:Math.floor((b.s+b.e)/2);
}
function levelFriendly(id){return {
  L0:'대치 프리미어 선행이 빠른 학생 기준입니다.',
  L1:'대치 프리미어 표준 진도 학생 기준입니다.',
  L2:'챌린지 선발 후 P2·S2 목표 / 타 지역 P1 목표 학생 기준입니다.',
  L3:'소마 안정 학습 기준, 황소 상위권을 바라보는 학생 기준입니다.',
  L4:'황소 심화반 목표 / 기초부터 탄탄히 쌓아가는 학생 기준입니다.'
}[id]||'';}
function fmtSigned(v){const n=Math.round(v);if(n===0)return '표준과 비슷';return n<0?`약 ${-n}개월 빠름`:`약 ${n}개월 느림`;}

function personalShift(rowKey, age, meta, month){
  if(!meta) return 0;
  const now=monthOf(age, month);
  const b=ROAD_L0[rowKey].find(x=>stripTag(x.text).includes(meta.key));
  if(!b) return 0;
  const base = meta.pos==='end' ? b.e : (b.s+b.e)/2;
  return Math.round(now - base);
}
/* 이동량 적용 + 표시idx 변환 + 클리핑 */
function shiftedBlocks(rowKey, sh){
  return ROAD_L0[rowKey].map(b=>({...b,s:toIdx(b.s+sh),e:toIdx(b.e+sh)}))
    .filter(b=>b.e>=0&&b.s<=N-1)
    .map(b=>({...b,s:Math.max(0,b.s),e:Math.min(N-1,b.e)}));
}


// Explicit-coordinate adapters; only the source's existing month axis is used.
function monthOf(age,month){
  const a=typeof age==='string'?parseInt(age,10):age, m=Number(month);
  if(!Number.isInteger(a)||a<4||!Number.isInteger(m)||m<1||m>12)return null;
  return (a-5)*12+m-1;
}
function labelMonth(value){
  if(!Number.isFinite(value))return '';
  const m=Math.floor(value);
  return (5+Math.floor(m/12))+'세 '+(((m%12)+12)%12+1)+'월';
}
function shortText(value){
  return String(value??'').replace(/<br\s*\/?\s*>/gi,' ').replace(/<[^>]*>/g,'')
    .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<')
    .replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/\s+/g,' ').trim();
}
function originalRows(shift=0){
  return rowMeta.map(([title,key])=>({key,title,shortTitle:shortText(title),
    blocks:ROAD_L0[key].map(b=>({...b,s:b.s+(FIXED_ROWS.includes(key)?0:shift),e:b.e+(FIXED_ROWS.includes(key)?0:shift)}))}));
}
function resolveSelections(input={}){
  const pending=[], invalid=[];
  const thinking=Array.isArray(input.thinking)?input.thinking:[];
  const knownThinking=thinking.filter(v=>ORDER.includes(v));
  const positions={school:null,thinking1:null,calc:null};
  if(!thinking.length)pending.push('thinking');
  else if(knownThinking.length!==thinking.length)invalid.push('thinking');
  else positions.thinking1=thinkingToBlock(knownThinking);
  if(!input.school)pending.push('school');
  else if(!SCHOOL_OPTIONS.includes(input.school))invalid.push('school');
  else positions.school=schoolToBlock(input.school);
  if(!input.calcRadio)pending.push('calcRadio');
  else if(!CALC_RADIO.some(r=>r[0]===input.calcRadio))invalid.push('calcRadio');
  else positions.calc=calcToBlock(input.calcRadio);
  return {positions,pending,invalid,ready:!pending.length&&!invalid.length};
}
function compareLevels(positions,now){
  if(!Number.isFinite(now)||!positions||!positions.school||!positions.thinking1||!positions.calc)
    return {ready:false,levels:[],best:null};
  let best={id:null,abs:Infinity,avg:0};
  const levels=LEVELS.map(L=>{
    const lT=levelStdMonth(L.shift,'thinking1',positions.thinking1);
    const lS=levelStdMonth(L.shift,'school',positions.school);
    const lC=levelStdMonth(L.shift,'calc',positions.calc);
    // All buildProfile selections were resolved against actual source blocks.
    if(lT==null||lS==null||lC==null)return {id:L.id,ready:false};
    const dT=now-lT,dS=now-lS,dC=now-lC,avg=(dT+dS+dC)/3;
    const result={id:L.id,ready:true,shift:L.shift,summary:L.summary,
      shortSummary:shortText(L.summary),description:levelFriendly(L.id),avg,dT,dS,dC};
    if(Math.abs(avg)<best.abs)best={...result,abs:Math.abs(avg)};
    return result;
  });
  if(!best.id)return {ready:false,levels,best:null};
  const l2=levels.find(b=>b.id==='L2'),l3=levels.find(b=>b.id==='L3'),l4=levels.find(b=>b.id==='L4');
  best.needRedesign=!!((l2&&Math.abs(l2.avg)>=6&&best.id==='L2')||
    (l3&&Math.abs(l3.avg)>=6&&best.id==='L3')||(l4&&Math.abs(l4.avg)>=6&&best.id==='L4'));
  best.l2avg=l2?l2.avg:0;
  best.schoolOK=best.dS-best.dT<=2;best.calcOK=best.dC-best.dT<=2;
  best.bothOK=best.schoolOK&&best.calcOK;
  best.oneOK=(best.schoolOK||best.calcOK)&&!best.bothOK;
  best.noneOK=!best.schoolOK&&!best.calcOK;
  const l0=levels.find(b=>b.id==='L0');best.aboveL0=!!(l0&&l0.dT < -1);
  return {ready:true,levels,best};
}
function learningRow(rowKey,meta,now){
  if(!meta||!ROAD_L0[rowKey]||!Number.isFinite(now))return null;
  const original=ROAD_L0[rowKey],index=original.findIndex(b=>stripTag(b.text).includes(meta.key));
  if(index<0)return null;
  const anchor=meta.pos==='end'?original[index].e:(original[index].s+original[index].e)/2;
  const shift=Math.round(now-anchor); // Source personalShift midpoint/end arithmetic.
  const blocks=original.map(b=>({...b,s:b.s+shift,e:b.e+shift,shortText:shortText(b.text)}));
  const current={...blocks[index],rowKey,index,choiceKey:meta.key,
    position:meta.pos,completed:meta.pos==='end',sourceAnchor:anchor,alignedMonth:anchor+shift};
  // Completed selections remain visible as completed; future learning starts at
  // the NEXT original block. Midpoint selections retain their original remainder.
  const remaining=blocks.slice(index+(current.completed?1:0)).map((b,i)=>({
    ...b,remainingStart:i===0&&!current.completed?Math.max(now,b.s):b.s,
    sourceCurrent:i===0&&!current.completed
  }));
  const title=rowMeta.find(r=>r[1]===rowKey)?.[0]||rowKey;
  return {key:rowKey,title,shortTitle:shortText(title),shift,current,blocks,remaining,
    next:blocks[index+1]||null,sourceExhausted:index===blocks.length-1};
}
function buildProfile(input={}){
  const selection=resolveSelections(input),now=monthOf(input.age,input.month);
  const pending=[...selection.pending],invalid=[...selection.invalid];
  if(input.age==null||input.age==='')pending.push('age');
  if(input.month==null||input.month==='')pending.push('month');
  if(now==null&&!pending.includes('age')&&!pending.includes('month'))invalid.push('age/month');
  const rows=['school','thinking1','calc'].map(k=>learningRow(k,selection.positions[k],now)).filter(Boolean);
  const comparison=selection.ready&&now!=null?compareLevels(selection.positions,now):{ready:false,levels:[],best:null};
  return {ready:!pending.length&&!invalid.length,now,nowLabel:labelMonth(now),
    pending,invalid,positions:selection.positions,rows,comparison,
    // Supplemental rows are SOURCE LEVEL REFERENCE, not personalized promises.
    referenceRows:comparison.best?originalRows(comparison.best.shift):[],
    sourceScope:'original-demo-L0-L4',coordinate:'5세 1월=0',
    limitations:['원본 유아 예시의 과정·기간만 포함합니다. 마지막 과정 뒤의 새 진도는 만들지 않습니다.',
      '레벨 비교는 원본 다섯 예시와의 진도 차이이며 합격이나 능력 판정이 아닙니다.',
      '진행 중은 원본의 중간 지점 가정입니다. 실제 수행률을 측정한 값이 아닙니다.']};
}
const COPY={
  introTitle:'현재 진도를 확인하겠습니다.',
  introHelp:'완료한 교재와 현재 진행 중인 교재를 함께 선택해 주세요. 현재 과정은 50% 이상 진행했을 때만 선택합니다.',
  ageLabel:'현재 한국 나이',thinkingLabel:'사고력 과정',
  thinkingHelp:'완료한 과정과 현재 진행 중인 과정은 모두 선택할 수 있습니다.',
  schoolLabel:'현재 교과 진도',calcLabel:'혼자 정확하게 풀 수 있는 연산',
  calcHelp:'연산 수준을 가장 잘 설명하는 한 가지를 골라 주세요.',
  sourceNote:'실제 대치 합격생 진도를 바탕으로 한 예시입니다. 아이의 연산력·자기조절력·지문 이해도·학습 성향에 따라 결과는 달라질 수 있습니다.'
};
const SOURCE={path:'roadmap/demo/index.html',sha256:'3fca0e5c0742d2e7c68c7d37a8cf1eef08ace0c0334dea5f4e859811afbc629a',
  originalLevels:true,levelShifts:[0,3,7,12,17],originalDisplay:{startMonth:AGE_START_M,months:N},
  sourceRanges:{curriculum:[577,653],positions:[1263,1319],personalShift:[781,794],
    graphStages:[842,856],levelArithmetic:[1509,1563]},
  adaptations:['monthOf is the algebraic extension of 5세 January=0; no birthday or international-age conversion.',
    'All current-month values are explicit arguments; no DOM, Date, storage, network or original HTML execution.',
    'Original defaulting converters are exposed; buildProfile preserves absent/invalid answers as pending/invalid.']};
function deepFreeze(value){
  if(value&&typeof value==='object'&&!Object.isFrozen(value)){
    Object.values(value).forEach(deepFreeze);Object.freeze(value);
  }return value;
}
const API={SOURCE,COPY,ROAD_L0,LEVELS,FIXED_ROWS,rowMeta,T1_STEPS,Y_ROWS,
  AGE_START_M,N,cols,THINKING_OPTIONS,SCHOOL_OPTIONS,CALC_RADIO,
  ageOptions:['4세','5세','6세','7세'],
  monthOf,labelMonth,shortText,originalMonthOf:mm,toIdx,blocksFor,shiftedBlocks,
  stripTag,highThinking,thinkingToBlock,schoolToBlock,calcToBlock,currentPositions,
  personalShift,levelStdMonth,levelFriendly,fmtSigned,lineInLevel,
  originalRows,resolveSelections,compareLevels,learningRow,buildProfile};
global.DemoContent=deepFreeze(API);
})(window);
