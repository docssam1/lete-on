/* ============================================================
   Numbers of Magic — 유형별 정답률 추적 + 정체 감지 (app/progress-stats.js)
   과정-로드맵.md §2-4 "정체 감지 → 보강 루프" 구현.

   기존에 유형(스레드)별 정답률을 저장하는 곳이 없었다(검색 확인, 2026-08-27
   Phase 3 착수 전) — 유일하게 "스레드+레벨 단위로 문제를 한 세트 풀고
   채점"하는 지점은 app/exam.js의 그리드 학습지(온라인 채점, '채점하기' 버튼)
   뿐이라, 여기에 세션 1회 기록을 남기는 방식으로 새로 만든다(exam.js가 이
   모듈의 record()를 호출 — app/exam.js 참고).

   저장: main.js가 bind한 학습자 스코프별 localStorage 키. 프로필을 바꾸면
   모든 읽기·기록도 현재 스코프를 따라간다. 소유자를 알 수 없는 예전 전역
   기록은 보존하며 새 개인 기록으로 옮기지 않는다. bind하지 않은 독립
   화면에서는 이전 전역 키 계약을 유지한다.

   계약:
     NM_STATS.bind({scope:()=>string|null})
       — main.js가 현재 학습자의 안정된 키를 제공한다. null·예외는 읽기와
         기록을 차단한다. 바인딩 이후에는 매 호출 최신 저장본을 읽는다.
     NM_STATS.record(threadId, level, correct, total, opts?)
       — 그 스레드에서 "세션 1회"(문항 여러 개를 한 번에 풀고 채점)의 결과를
         기록한다. opts.boost=true면 보강 세션임을 표시(리포트용, 감지 로직
         자체는 boost 세션도 똑같이 "그 유형의 최근 세션"으로 취급한다 —
         보강을 잘 풀면 자연히 다음 감지에서 해제되게 하기 위함).
         opts.sessionId가 있으면 같은 스레드의 보관 중인 동일 세션을 다시
         기록하지 않는다. 저장 성공·이미 기록됨은 true, 저장 실패는 false.
         실패하면 메모리도 바꾸지 않아 같은 세션을 안전하게 재시도할 수 있다.
     NM_STATS.needsBoost(threadId)
       — 그 스레드의 "최근 2회 세션"이 모두 존재하고 둘 다 60% 미만이면 true.
         저장된 기록만 보는 순수 함수라 같은 저장 상태에선 항상 같은 결과
         (결정적) — 로드맵 §2-4 "감지는 자연히 결정적"이 요구하는 성질 그대로.
     NM_STATS.boostList()
       — 보강이 필요한 스레드id 목록, 최근 2회 평균 정답률이 낮은 순.
     NM_STATS.sessionsOf(threadId) — 디버그/테스트용 원본 기록 열람.
   ============================================================ */
(function(){
'use strict';

const KEY = 'nm_thread_stats_v1';
const MAX_SESSIONS = 8;      // 스레드당 보관 세션 수(오래된 것부터 버림)
const BOOST_THRESHOLD = 0.6; // §2-4 "정답률 60% 미만"

function load(key){
  try{ const r = JSON.parse(localStorage.getItem(key||KEY)); return (r && typeof r==='object'&&!Array.isArray(r)) ? r : {}; }
  catch(e){ return {}; }
}
function persist(data,key){
  try{ localStorage.setItem(key||KEY, JSON.stringify(data)); return true; }catch(e){ return false; }
}
let DATA = load();
let scopeReader=null;
function bind(options){
  // An invalid binding must not silently fall back to the ownerless legacy key.
  scopeReader=options&&typeof options.scope==='function'?options.scope:()=>null;
}
function current(){
  if(!scopeReader)return {key:KEY,data:DATA};
  try{
    const scope=scopeReader();
    if(typeof scope!=='string'||!scope.trim())return null;
    const key=KEY+'_scope_'+encodeURIComponent(scope);
    return {key,data:load(key)};
  }catch(e){return null;}
}
function listOf(data,threadId){return Array.isArray(data[threadId])?data[threadId]:[];}

function record(threadId, level, correct, total, opts){
  const state=current();
  if(!state)return false;
  if(!threadId || !total) return;
  const previous = listOf(state.data,threadId);
  const sessionId = opts && typeof opts.sessionId==='string' && opts.sessionId ? opts.sessionId : null;
  if(sessionId && previous.some(session=>session.sessionId===sessionId)) return true;
  const list = previous.slice();
  const c = Math.max(0, Math.min(total, correct|0));
  const session = {
    level: level!=null ? level : 1,
    correct: c, total: total,
    rate: total ? c/total : 0,
    ts: Date.now(),
    boost: !!(opts && opts.boost)
  };
  if(sessionId) session.sessionId = sessionId;
  list.push(session);
  if(list.length > MAX_SESSIONS) list.splice(0, list.length - MAX_SESSIONS);
  const next = Object.assign({}, state.data, { [threadId]: list });
  if(!persist(next,state.key)) return false;
  if(!scopeReader)DATA = next;
  return true;
}

function sessionsOf(threadId){
  const state=current();
  return state?listOf(state.data,threadId).slice():[];
}

/* 최근 2회 세션이 존재하고 "둘 다" 60% 미만이면 보강 필요.
   세션이 1개 이하면 아직 판단하지 않는다(§2-4 "2회 연속 미달"). */
function needsBoost(threadId){
  return listNeedsBoost(sessionsOf(threadId));
}
function listNeedsBoost(list){
  if(list.length < 2) return false;
  const last2 = list.slice(-2);
  return last2.every(s => s.rate < BOOST_THRESHOLD);
}

/* 보강이 필요한 스레드 전부 — 최근 2회 평균 정답률이 낮은 순으로 정렬.
   가장 급한 것부터 보강 세션에 올리기 위함(§2-4 booster 삽입에서 top1 사용). */
function boostList(){
  const state=current();
  if(!state)return [];
  return Object.keys(state.data)
    .filter(id=>listNeedsBoost(listOf(state.data,id)))
    .map(id=>{
      const last2 = listOf(state.data,id).slice(-2);
      const avgRate = last2.reduce((s,x)=>s+x.rate,0) / last2.length;
      return { thread:id, avgRate, lastTs: last2[last2.length-1].ts };
    })
    .sort((a,b)=> a.avgRate - b.avgRate || a.lastTs - b.lastTs);
}

window.NM_STATS = { bind, record, sessionsOf, needsBoost, boostList, THRESHOLD: BOOST_THRESHOLD, _KEY: KEY };
if(typeof module !== 'undefined' && module.exports) module.exports = window.NM_STATS;
})();
