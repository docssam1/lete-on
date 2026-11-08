/* Year-based official file catalogue. Historical curricula do not inherit 2026 scopes. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PAPERS=Object.freeze((g.PlannerMockLibraryData||[]).map(row=>{
 const level=String(row.level),variant=({a:'가형',b:'나형'})[row.variant]||row.variant||'',suffix=variant?' · '+variant:'';
 return Object.freeze({...row,level,variant,exam:row.year+'년 '+row.month+'월 학평'+suffix,
  title:row.year+'년 고'+level+' '+row.month+'월 수학 기출'+suffix,
  files:Object.freeze({problem:row.problem,explanation:row.explanation}),
  papers:'https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D'+(level==='1'?'100':'200')});
}));
const YEARS=Object.freeze([...new Set(PAPERS.map(p=>p.year))].sort((a,b)=>b-a));
function find(value){return typeof value==='string'?PAPERS.find(p=>p.id===value)||null:PAPERS.find(p=>p.exam===value?.exam&&p.level===value?.level)||null;}
function selection(value={}){return{year:YEARS.includes(+value.year)?+value.year:YEARS[0],level:['1','2'].includes(value.level)?value.level:'all'};}
function list(value){const s=selection(value);return PAPERS.filter(p=>p.year===s.year&&(s.level==='all'||s.level===p.level)).sort((a,b)=>+a.level-+b.level||a.month-b.month||a.variant.localeCompare(b.variant));}
function prefill(id,m){const p=find(id);if(!p)return null;const current=g.PlannerMockMatching?.sourceFor(p)||g.PlannerMockSchedule?.PAPERS.find(x=>x.exam===p.exam&&x.level===p.level);return{exam:p.exam,level:p.level,scope:current?.scope||'',...(g.PlannerMockItems&&m?.mockCheckPlan?.knowledge?g.PlannerMockItems.forRecord(p,m.mockCheckPlan.knowledge):{})};}
function render(value={},model={},mock={}){
 const s=selection(value),rows=list(s),plan=model.mockCheckPlan?.enabled?model.mockCheckPlan.rows:[],seen=g.PlannerMockMatching?.seen(mock.records,mock.schedule)||new Set(),marked=new Set(mock.schedule?.seenPaperIds||[]);
 const group=level=>{const papers=rows.filter(p=>p.level===level);if(!papers.length)return '';
  return `<section class="mock-library-grade"><h4>고${level} <span>수학 · ${papers.length}개</span></h4><div class="mock-library-grid">${papers.map(p=>{
   const recheck=model.mockFeedback?.plans.find(x=>!x.paper.pending&&x.paper.exam===p.exam&&x.paper.level===p.level);
   const scheduled=plan?.find(r=>r.exam===p.exam&&r.level===p.level&&r.start!==null),count=(mock.records||[]).filter(r=>r.exam===p.exam&&r.level===p.level).length;
   return `<article class="mock-library-card" data-mock-library-paper="${esc(p.id)}"><header><h5>${p.month}월${p.variant?' <span>'+esc(p.variant)+'</span>':''}</h5>${scheduled?.suggested?`<small class="mock-library-badge">내 계획 · ${esc(g.PlannerMockSchedule.approxDate(scheduled.practiceDate||scheduled.suggested))}</small>`:''}${count?`<small class="mock-library-badge">결과 기록 ${count}개</small>`:''}${recheck?`<small class="mock-library-badge">재점검 · ${esc(g.PlannerMockSchedule.approxDate(recheck.recheck))}</small>`:''}${seen.has(p.id)?'<small class="mock-library-badge">이미 푼 회차 · 자동 선정 제외</small>':''}</header>${p.examDate?`<p class="mock-library-date">시행일 ${esc(p.examDate.replaceAll('-','.'))}</p>`:''}${p.note?`<p class="mock-library-note">${esc(p.note)}</p>`:''}${g.PlannerMockSchedule.paperLinks(p)}${g.PlannerMockItems&&model.mockCheckPlan?.knowledge?`<details><summary>현재 진도로 풀 문제 번호</summary>${g.PlannerMockItems.summary(g.PlannerMockItems.select(p,model.mockCheckPlan.knowledge.learned))}</details><button type="button" data-mock-print-library="${esc(p.id)}">선택 문항 학습지 인쇄</button>`:''}<button type="button" data-mock-library-record="${esc(p.id)}" aria-label="${esc(p.title+' 결과 기록')}">이 기출로 결과 기록 <span aria-hidden="true">→</span></button>${!count&&(!seen.has(p.id)||marked.has(p.id))?`<button type="button" data-mock-library-seen="${esc(p.id)}" aria-pressed="${marked.has(p.id)}" aria-label="${esc(p.title+' 이미 푼 기출 표시')}">${marked.has(p.id)?'이미 푼 표시 취소':'이미 푼 기출로 표시'}</button>`:''}</article>`;
  }).join('')}</div></section>`;
 };
 return `<section class="learning-evidence mock-library" data-mock-library><div class="mock-library-heading"><p class="mock-library-eyebrow">${YEARS.at(-1)}–${YEARS[0]} · 고1·고2 수학</p><h3>연도별 기출</h3><p>연도와 학년을 고르면 월별 문제를 바로 열 수 있습니다. 풀이 후 결과를 기록하면 단원 보완과 재점검 일정으로 이어집니다. 이전에 풀었지만 결과를 기록하지 않은 회차는 ‘이미 푼 기출’로 표시하세요. 일부 문항만 풀었어도 자동 선정에서 제외합니다.</p></div><div class="mock-library-filters"><label>기출 연도<select data-mock-library-filter="year">${YEARS.map(y=>`<option value="${y}"${s.year===y?' selected':''}>${y}년</option>`).join('')}</select></label><label>학년<select data-mock-library-filter="level">${[['all','고1·고2 모두'],['1','고1'],['2','고2']].map(([id,t])=>`<option value="${id}"${s.level===id?' selected':''}>${t}</option>`).join('')}</select></label></div><p class="mock-library-count" role="status" aria-live="polite">${s.year}년 · ${s.level==='all'?'고1·고2':'고'+s.level} 기출 ${rows.length}개</p><p class="mock-library-guidance">${s.year===2026?'내 계획에 배치된 기출에는 권장 풀이 시기가 표시됩니다.':'과거 기출은 당시 교육과정의 문제입니다. 문제를 열어 실제 배운 단원과 범위를 확인한 뒤 결과를 기록해 주세요.'} 기출 이름의 연도와 월은 원래 시험 회차입니다.</p>${group('1')}${group('2')}<details class="mock-library-about"><summary>기출 구분과 출처 안내</summary><p>문제지 표제의 연도·월을 기준으로 정리했습니다. 연기된 시험은 시행일을 따로 표시하며, 가형·나형은 각각 구분합니다. 과거 기출에 현재 교육과정의 출제 범위를 적용하지 않습니다.</p><p>문제와 해설은 EBSi 공식 파일을 새 창에서 엽니다. 정답·해설은 펼쳐야 보입니다. 파일이 열리지 않으면 각 해설 아래의 EBSi 검색을 이용해 주세요.</p><p>공식 파일 확인 · 2026.11.06</p></details></section>`;
}
g.PlannerMockLibrary=Object.freeze({PAPERS,YEARS,find,selection,list,prefill,render});
})(window);
