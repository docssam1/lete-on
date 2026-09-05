/* ============================================================
   Numbers of Magic — 진단하기 v2: 순수 로직 모듈 (app/placement-core.js)
   ------------------------------------------------------------
   main.js는 DOM(document.getElementById('app'))이 있어야 로드되므로 node
   시뮬레이터(scripts/sim-placement.js)가 못 불러온다. 그래서 사다리를 만들고
   위아래로 좁혀 가는(bracketing) 순수 로직만 이 파일로 뺐다 — DOM도 window도
   진짜 브라우저일 필요가 없고, data/courses.js·data/threads.js·엔진 생성기만
   있으면 된다(app/main.js보다 먼저 로드).

   책임:
   - buildLadder()      : NM_COURSE_SPEC(C1~C45) 순서로 사다리를 만든다.
                           0~3번 칸은 예전 그대로 수의 나라(NL) 4칸(전부 과정 C1).
                           그 뒤로 courseBuilt인 과정마다 한 칸씩, 그 과정
                           자기 드릴 재료 중 "생성기 답이 숫자 하나"인 첫 스레드를
                           고른다(전부 배열 답이면 첫 드릴로 대체 — C35·C38처럼).
   - nextRung/grade/boundary : 위아래로 좁히기(bracketing). 계단 폭은 맞힐 때마다
                           커진다(UP_STEPS: 4→8→12칸), 그래도 남은 범위 절반은
                           안 넘는다. scripts/sim-placement.js가 나이×실력
                           전 조합을 돌려 문항 수 상한과 경계 오차를 검증한다.
   - fineZoneCourseKeys/fineZoneThreads : 경계 과정 K를 찾은 뒤 "K−1·K" 두 과정의
                           드릴 재료를 모아 세부 진단(스킬 체크) 문제 목록을 만든다.
                           이미 위아래로 좁히며 물어본 스레드는 다시 안 묻는다
                           (호출하는 쪽이 이미 물은 스레드 id 목록을 넘긴다).

   courseBuilt 판정은 main.js의 courseBuilt()와 같은 조건을 그대로 옮겨 적었다
   (마법 슬롯이 유닛/스레드로 실존하고, 드릴 레벨이 threads.js에 실존하는가).
   main.js는 클로저 IIFE라 이 파일에서 그 함수를 가져다 쓸 수 없어서 그대로
   옮겼다 — 옮긴 조건이 바뀌면(과정 편성 규칙이 바뀌면) 여기도 같이 고칠 것.
   ============================================================ */
(function(){
'use strict';

const W = (typeof window !== 'undefined') ? window : (typeof global !== 'undefined' ? global : {});

const UP_STEPS = [4, 8, 12];   // 맞힐 때마다 커지는 위로 가는 칸 수(첫 도약 4, 그다음 8, 그다음 12)
const MAX_Q = 9;               // 위아래로 좁히기 최대 문항 수(진단은 시험이 아니다)
const FINE_MAX_Q = 8;          // 세부 진단(스킬 체크) 최대 문항 수

/* ── courseBuilt 판정 (main.js courseBuilt()와 동일 조건) ── */
function courseMagicIdsLocal(c){
  const out=[];
  (c.sessions||[]).forEach(s=>{ (s.magic||[]).forEach(id=>{ if(out.indexOf(id)<0) out.push(id); }); });
  return out;
}
function courseBuiltLocal(c){
  const TH=W.NM_THREADS||{}, U=W.NM_UNITS||{};
  const ids=courseMagicIdsLocal(c);
  for(let i=0;i<ids.length;i++){ if(!U[ids[i]]&&!TH[ids[i]]) return false; }
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

/* 스레드의 레벨1 문제를 한 번 만들어 답이 숫자 하나인지 본다(배열이면 false).
   확률성 없이 결정적 시드로만 부르므로(NM_TGEN 계약: Math.random 금지) 몇 번을
   불러도 같은 결과 — 진단 문제 자체를 만드는 게 아니라 "이 스레드를 진단
   칸으로 쓸 수 있는가"만 미리 엿보는 것이라 시드는 실제 문제 시드와 다르다. */
function isScalarDrill(threadId){
  const TH=W.NM_THREADS||{}, TG=W.NM_TGEN||{};
  const th=TH[threadId];
  if(!th) return false;
  const gen=TG[th.gen];
  if(!gen) return false;
  const lvl=(th.levels||[]).find(l=>l.id===1) || (th.levels||[])[0];
  if(!lvl) return false;
  const RNG=W.NM_RNG;
  if(!RNG) return false;
  try{
    const rng=RNG.mulberry32(RNG.hashSeed('nmPlacementScalarProbe'+threadId));
    const p=gen(lvl.params||{}, rng);
    return typeof (p && p.answer) === 'number';
  }catch(e){ return false; }
}

/* 사다리 — 0~3번은 수의 나라 4칸(고정, 전부 과정 C1). 그 뒤로 NM_COURSE_SPEC
   순서(C1…C45)로 courseBuilt인 과정마다 한 칸. */
function buildLadder(){
  const spec = W.NM_COURSE_SPEC || [];
  const courses = W.NM_COURSES || {};
  const ladder = [
    {course:'C1', thread:'NL1', level:1},   /* 수 세기와 개수 */
    {course:'C1', thread:'NL4', level:1},   /* 수의 순서 */
    {course:'C1', thread:'NL2', level:2},   /* 모으기와 가르기 */
    {course:'C1', thread:'NL5', level:1}    /* 이웃 수 더하기 */
  ];
  spec.forEach(s=>{
    const key='C'+s.id;
    const c=courses[key];
    if(!c || !courseBuiltLocal(c)) return;
    const drills = s.drills || [];
    let chosen = null;
    for(let i=0;i<drills.length;i++){ if(isScalarDrill(drills[i])){ chosen=drills[i]; break; } }
    if(!chosen) chosen = drills[0];
    if(!chosen) return;
    ladder.push({course:key, thread:chosen, level:1});
  });
  return ladder;
}

/* 어떤 과정이 사다리에서 (마지막으로) 몇 번 칸인지. C1은 수의 나라 4칸에도
   나오므로 "마지막 등장"을 찾아야 자기 과정 칸(교과연산 칸)을 가리킨다 —
   다른 과정은 한 번만 나오므로 상관없다. */
function rungIndexOfCourse(ladder, key){
  let idx=-1;
  for(let i=0;i<ladder.length;i++){ if(ladder[i].course===key) idx=i; }
  return idx;
}

/* 다음에 물을 칸. null이면 경계를 찾은 것.
   d = {lo, hi, at, entry, ups} — lo=풀 수 있다고 확인된 가장 높은 칸(초기 -1),
   hi=아직 못 푼다고 확인된 가장 낮은 칸(초기 N), ups=아직 한 번도 안 틀리고
   맞힌 연속 상향 이동 횟수(칸 폭을 키우는 데 쓴다). */
function nextRung(d, N){
  if(d.hi - d.lo <= 1) return null;
  if(d.at === null) return Math.min(N-1, Math.max(0, d.entry||0));
  if(d.hi === N){
    const stepIdx = Math.min(d.ups||0, UP_STEPS.length-1);
    const step = UP_STEPS[stepIdx];
    return Math.min(N-1, d.lo+1+Math.min(step-1, Math.floor((N-1-d.lo)/2)));
  }
  if(d.lo === -1) return Math.floor(d.hi/2);
  return Math.floor((d.lo+d.hi)/2);
}
/* 한 문제 채점 결과를 d에 반영한다. */
function grade(d, idx, ok, N){
  d.asked = (d.asked||0) + 1;
  if(ok){
    d.correct = (d.correct||0) + 1;
    d.lo = Math.max(d.lo, idx);
    if(d.hi === N) d.ups = (d.ups||0) + 1;
  } else {
    d.hi = Math.min(d.hi, idx);
  }
  d.at = idx;
}
/* 경계 칸 — 아직 못 넘은 첫 칸. 문항 수가 다 찼는데 못 좁혔으면 확실히 못 푼
   칸(hi)을, 그것도 없으면(한 번도 안 틀림) 다음 칸(lo+1)을 쓴다. */
function boundary(d, N){
  if(d.hi - d.lo <= 1) return d.hi;
  return d.hi < N ? d.hi : d.lo + 1;
}

/* 경계 인덱스가 사다리를 벗어나면(전부 맞힘) null — "맨 위 너머"를 뜻한다. */
function courseAtIndex(ladder, idx){
  if(idx == null || idx >= ladder.length) return null;
  return ladder[idx].course;
}
/* 사다리에 등장하는 과정 키를 순서대로, 중복 없이. */
function builtCourseKeys(ladder){
  const seen={}, out=[];
  ladder.forEach(r=>{ if(!seen[r.course]){ seen[r.course]=true; out.push(r.course); } });
  return out;
}
/* 추천 과정 — K가 없으면(사다리를 전부 통과) 실제로 준비된 마지막 과정.
   PLACEMENT_TOP을 과정 번호로 박아 두지 않고 매번 사다리에서 구한다. */
function recommendedCourseKey(ladder, K){
  if(K) return K;
  const keys=builtCourseKeys(ladder);
  return keys.length ? keys[keys.length-1] : 'C1';
}
/* 세부 진단 구역 = [K-1, K]. K가 C1이면 [C1]만. K가 사다리 밖(전부 통과)이면
   실제로 준비된 마지막 두 과정. */
function fineZoneCourseKeys(ladder, K){
  const keys=builtCourseKeys(ladder);
  if(!K) return keys.slice(-2);
  const i=keys.indexOf(K);
  if(i<=0) return [K];
  return [keys[i-1], keys[i]];
}
/* 구역 과정들의 자기 드릴 재료를 모은다 — 중복 제거, 숫자 답 스레드 먼저(더
   신뢰할 수 있는 채점), 배열 답은 뒤에(쉼표 입력으로 받는다). 이미 위아래로
   좁히며 물어본 스레드(excludeThreadIds)는 다시 안 묻는다. 최대 8문제. */
function fineZoneThreads(zoneCourseKeys, excludeThreadIds){
  const spec = W.NM_COURSE_SPEC || [];
  const exclude={}; (excludeThreadIds||[]).forEach(t=>{ exclude[t]=true; });
  const seen={}; const scalar=[], arr=[];
  (zoneCourseKeys||[]).forEach(key=>{
    const num=parseInt(String(key).replace(/^C/,''), 10);
    const s=spec.find(x=>x.id===num);
    if(!s) return;
    (s.drills||[]).forEach(t=>{
      if(seen[t] || exclude[t]) return;
      seen[t]=true;
      (isScalarDrill(t) ? scalar : arr).push(t);
    });
  });
  return scalar.concat(arr).slice(0, FINE_MAX_Q);
}
/* K-1 과정 자기 드릴 재료 중 확인된(log에 있는) 결과가 2개 이상 오답이면
   한 칸 낮춰 K-1을 권한다. zoneCourseKeys[0]이 K-1(없으면 조정 없음). */
function recommendationAdjust(K, zoneCourseKeys, log){
  if(!zoneCourseKeys || zoneCourseKeys.length<2) return K;
  const prevKey=zoneCourseKeys[0];
  const spec = W.NM_COURSE_SPEC || [];
  const s=spec.find(x=>'C'+x.id===prevKey);
  if(!s) return K;
  let fails=0;
  (s.drills||[]).forEach(t=>{
    const e=(log||[]).find(l=>l.t===t);
    if(e && !e.ok) fails++;
  });
  return fails>=2 ? prevKey : K;
}

W.NM_PLACEMENT_CORE = {
  MAX_Q, FINE_MAX_Q, UP_STEPS,
  buildLadder, rungIndexOfCourse,
  nextRung, grade, boundary,
  courseAtIndex, builtCourseKeys, recommendedCourseKey,
  fineZoneCourseKeys, fineZoneThreads, recommendationAdjust,
  isScalarDrill, courseBuiltLocal
};
if(typeof module!=='undefined' && module.exports) module.exports = W.NM_PLACEMENT_CORE;
})();
