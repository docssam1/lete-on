/* Whole-paper observations use the existing 30 item statuses. No answer key,
 * original problem text, score cutoffs or inferred percentiles are stored here. */
(function(g){'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STATES={correct:'혼자 해결',helped:'도움 참고',wrong:'틀림',unanswered:'미응답',unlearned:'미학습'};
const NUMBERS=Array.from({length:30},(_,i)=>i+1);
const counts=()=>({correct:0,helped:0,wrong:0,unanswered:0,unlearned:0});
const paper=v=>g.PlannerMockSchedule?.resolvePaper(v)||g.PlannerMockLibrary?.find(v)||null;
const clean=(v,n=160)=>typeof v==='string'?v.trim().slice(0,n):'';
function selection(value,learnedUnitIds=[]){const p=paper(value);if(!p)return null;return{version:1,paperId:p.id,metadataVersion:g.PlannerMockItems?.VERSION||'whole-1',mode:'whole',projected:false,selected:NUMBERS.slice(),excludedUnlearned:[],excludedOther:[],unmapped:[],learnedUnitIds:g.PlannerMockItems?.validUnits(learnedUnitIds)||[],targetUnitIds:[]};}
function prefill(value,learnedUnitIds=[]){const p=paper(value),s=selection(p,learnedUnitIds);return p&&s?{id:'',paperId:p.id,exam:p.exam,level:p.level,scope:('고'+p.level+' 수학 전체 30문항'+(p.scope?' · '+p.scope:'')).slice(0,160),attempt:'first',rangeMode:'whole',questionSelection:s,total:30,unlearned:0,correct:0,helped:0}:null;}
function fullRecord(r){
 const p=paper(r),raw=r?.questionSelection;if(!p||!raw||raw.mode!=='whole'||raw.projected===true||raw.paperId!==p.id)return null;
 const s=g.PlannerMockItems?.restoreSelection(raw,r);if(!s||s.projected||s.selected.length!==30||!NUMBERS.every(n=>s.selected.includes(n))||['excludedUnlearned','excludedOther','unmapped'].some(k=>s[k].length))return null;
 if(!r.answers||typeof r.answers!=='object'||Array.isArray(r.answers)||Object.keys(r.answers).length!==30||!NUMBERS.every(n=>Object.hasOwn(r.answers,n)&&Object.hasOwn(STATES,r.answers[n])))return null;
 const answers=Object.fromEntries(NUMBERS.map(n=>[n,r.answers[n]])),c=counts();for(const n of NUMBERS)c[answers[n]]++;
 const totals={total:30,unlearned:c.unlearned,correct:c.correct,helped:c.helped};if(Object.entries(totals).some(([k,v])=>r[k]!==undefined&&r[k]!==v))return null;
 return{paper:p,selection:s,answers,counts:c};
}
function restoreRecord(r){const f=fullRecord(r);return f?{fullPaper:{version:1,paperId:f.paper.id}}:{};}
function verifiedPoints(p,value){
 if(!value||value.verified!==true||!value.points||typeof value.points!=='object'||Array.isArray(value.points)||Object.keys(value.points).length!==30)return null;
 let url;try{url=new URL(value.sourceUrl);if(url.protocol!=='https:'||url.hostname!=='wdown.ebsi.co.kr'||url.username||url.password||url.port||!/^\/W\d+\/.*\.pdf$/i.test(url.pathname)||![p.files?.problem,p.files?.explanation].includes(url.href))return null;}catch{return null;}
 if(!NUMBERS.every(n=>Object.hasOwn(value.points,n)&&Number.isInteger(value.points[n])&&value.points[n]>0&&value.points[n]<=10))return null;
 const points=Object.fromEntries(NUMBERS.map(n=>[n,value.points[n]]));if(Object.values(points).reduce((n,v)=>n+v,0)!==100)return null;
 return{points,sourceUrl:url.href};
}
function finishGroup(group){const learned=group.total-group.counts.unlearned;return{...group,learned,percent:learned?Math.round(group.counts.correct/learned*100):null,missed:group.counts.wrong+group.counts.unanswered,helped:group.counts.helped};}
function analyze(r,scoring){
 const f=fullRecord(r);if(!f)return null;const MI=g.PlannerMockItems,rows=MI.items(f.paper),byNumber=new Map();for(const q of rows){if(!Number.isInteger(q?.number)||q.number<1||q.number>30)continue;const list=byNumber.get(q.number)||[];list.push(q);byNumber.set(q.number,list);}
 const units=new Map(),unknown={unitId:null,title:'단원 확인 대기',course:null,numbers:[],total:0,counts:counts()};
 for(const n of NUMBERS){const list=byNumber.get(n)||[],q=list.length===1?list[0]:null,u=q&&!q.unverified&&Array.isArray(q.requires)&&q.requires.length&&q.requires.every(id=>MI.UNIT[id])?MI.UNIT[q.unitId]:null;
  const row=u?(units.get(u.id)||{unitId:u.id,title:clean(u.title,80),course:clean(u.course,80),numbers:[],total:0,counts:counts()}):unknown;
  row.numbers.push(n);row.total++;row.counts[f.answers[n]]++;if(u)units.set(u.id,row);
 }
 const byUnit=[...units.values()].map(finishGroup),unmapped=finishGroup(unknown),learned=30-f.counts.unlearned,cause=Object.hasOwn(g.PlannerMockEvidence?.CAUSES||{},r.cause)?r.cause:'unknown',weights=verifiedPoints(f.paper,scoring===undefined?g.PlannerMockScoreData?.[f.paper.id]:scoring);
 let score={available:false,reason:'official-points-unverified'};
 if(weights){const byState=counts();for(const n of NUMBERS)byState[f.answers[n]]+=weights.points[n];score={available:true,earned:byState.correct,max:100,byState,sourceUrl:weights.sourceUrl};}
 return{paperId:f.paper.id,title:clean(f.paper.title),exam:f.paper.exam,level:f.paper.level,total:30,counts:f.counts,learned,percent:learned?Math.round(f.counts.correct/learned*100):null,pending:f.counts.wrong+f.counts.unanswered,byUnit,unmapped,score,
  units:byUnit.filter(u=>u.missed+u.helped>0).map(u=>({unitId:u.unitId,title:u.title,missed:u.missed,helped:u.helped,cause})),coveredUnitIds:byUnit.filter(u=>u.learned>0).map(u=>u.unitId),
  attempt:r.attempt==='retry'?'retry':'first',timing:r.timing==='timed'?'timed':'untimed',minutes:Number.isFinite(r.minutes)&&r.minutes>0?r.minutes:null,limit:r.timing==='timed'&&Number.isFinite(r.limit)&&r.limit>0?r.limit:null};
}
function notes(r,scoring){const a=analyze(r,scoring);if(!a)return[];return[
 `${a.title} · 전체 30문항 · ${a.attempt==='retry'?'재풀이':'초견'}`,
 a.score.available?`공식 배점 기준 혼자 해결 점수 ${a.score.earned}/100점 · 도움·미학습 문항은 득점에 포함하지 않음`:'공식 배점 확인 전 · 100점 총점을 계산하지 않음',
 a.learned?`배운 범위 수행률 ${a.counts.correct}/${a.learned}문항 (${a.percent}%) · 미학습 ${a.counts.unlearned}문항 제외`:'배운 범위 없음 · 수행률을 계산하지 않음',
 `혼자 해결 ${a.counts.correct} · 도움 참고 ${a.counts.helped} · 틀림 ${a.counts.wrong} · 미응답 ${a.counts.unanswered} · 미학습 ${a.counts.unlearned}`,
 ...a.byUnit.map(u=>`${u.title} · ${u.numbers.join(', ')}번 · ${u.learned?'배운 범위 '+u.counts.correct+'/'+u.learned+'문항 ('+u.percent+'%)':'배운 범위 없음'} · 미해결 ${u.missed} · 도움 ${u.helped}`),
 ...(a.unmapped.total?[`단원 확인 대기 ${a.unmapped.numbers.join(', ')}번 · 전체 결과에는 포함하며 자동 단원 보완에는 넣지 않음`]:[])
 ];}
function summary(r,scoring){
 const a=analyze(r,scoring);if(!a)return'';
 const rate=u=>u.learned?u.counts.correct+'/'+u.learned+' ('+u.percent+'%)':'배운 범위 없음';
 return `<section class="mock-full-analysis" data-mock-full-analysis><h4>전체 시험 결과 분석</h4><p>${esc(a.title)} · 30문항 · ${a.attempt==='retry'?'같은 문항 재풀이':'처음 보는 문항'}</p><div class="mock-full-metrics"><p><strong>${a.score.available?'공식 배점 기준 '+a.score.earned+' / 100점':'공식 배점 확인 전'}</strong><br>${a.score.available?'혼자 맞힌 문항의 배점만 합산했습니다. 도움·미학습 문항은 득점에 포함하지 않습니다.':'문항별 공식 배점 30개가 확인된 경우에만 총점을 표시합니다.'}</p><p><strong>${a.learned?'배운 범위 수행률 '+a.percent+'%':'배운 범위 없음'}</strong><br>${a.learned?a.counts.correct+' / '+a.learned+'문항 혼자 해결 · 미학습 '+a.counts.unlearned+'문항 제외':'미학습 30문항으로 수행률을 계산하지 않습니다.'}</p></div><p class="mock-full-counts">혼자 해결 ${a.counts.correct} · 도움 참고 ${a.counts.helped} · 틀림 ${a.counts.wrong} · 미응답 ${a.counts.unanswered} · 미학습 ${a.counts.unlearned}</p>${a.byUnit.length?`<div class="mock-full-table-wrap"><table class="mock-full-table"><caption>검수한 단원별 결과 · 복합 문항은 대표 단원으로 집계</caption><thead><tr><th scope="col">단원·문항</th><th scope="col">혼자</th><th scope="col">도움</th><th scope="col">미해결</th><th scope="col">미학습</th><th scope="col">배운 범위 수행률</th></tr></thead><tbody>${a.byUnit.map(u=>`<tr><th scope="row">${esc(u.title)}<br><small>${esc(u.numbers.join(', '))}번</small></th><td>${u.counts.correct}</td><td>${u.helped}</td><td>${u.missed}</td><td>${u.counts.unlearned}</td><td>${esc(rate(u))}</td></tr>`).join('')}</tbody></table></div>`:''}${a.unmapped.total?`<div class="mock-full-unmapped"><h5>단원 확인 대기 · ${a.unmapped.total}문항</h5><p>${esc(a.unmapped.numbers.join(', '))}번 · 혼자 ${a.unmapped.counts.correct} / 도움 ${a.unmapped.helped} / 미해결 ${a.unmapped.missed} / 미학습 ${a.unmapped.counts.unlearned}</p><p>전체 결과에는 포함합니다. 단원 연결을 확인하기 전에는 자동 보완 단원을 만들지 않습니다.</p></div>`:''}<p>표시한 문항 결과를 바탕으로 계산합니다. 배웠지만 못 풀거나 남긴 문항은 수행률의 분모에 포함합니다.</p>${a.score.available?`<p class="mock-full-score-source"><a href="${esc(a.score.sourceUrl)}" target="_blank" rel="noopener noreferrer">문항 배점의 공식 출처 확인 (새 창)</a></p>`:''}</section>`;
}
g.PlannerMockFull=Object.freeze({selection,prefill,restoreRecord,analyze,summary,notes});
})(window);
