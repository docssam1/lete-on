/* Views for the user-confirmed counselling case. All dates come from PlannerCase. */
(function(global){
'use strict';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=()=>global.PlannerCase;
const date=x=>C().dateAt(x)?.label||'시기 확인 전';
const span=b=>b.end==null?date(b.start)+' 시작 · 이후 기간 미정':date(b.start)+' → '+date(b.end);
const axis=id=>id==='algebra'?'deep':id;
const allBlocks=m=>m.lanes.flatMap(l=>l.blocks);
const pick=(m,id)=>allBlocks(m).find(b=>b.id===id)||m.events.find(e=>e.id===id);
const rangeNote=b=>b.end==null?'권별 기간 미정':Number.isInteger(b.end-b.start)?(b.end-b.start)+'개월':(b.end-b.start)+'개월';
function summary(m){
 return `<div class="workspace-summary case-summary" role="status" aria-live="polite"><div><small>${esc(m.label)}</small><strong>교과·사고력·심화를 함께 이어갑니다.</strong></div><div class="workspace-summary-meta"><span>${m.state.algebra==='overlap'?'초3 5~6월 병행':'6-2 이후 초등 계통 대수심화'}</span><small>${esc(date(m.middleStart))} 중등 시작</small></div></div>`;
}
const CHOICES=[
 {id:'algebra',title:'초등 계통 대수심화를 언제 연결할까요?',options:[['overlap','5~6월, 6-2와 병행','확인한 계획 · 초등 계통 대수심화는 총 6개월'],['after','6-2를 마친 뒤 시작','중등 시작과 종료가 두 달 뒤로 이동']]},
 {id:'depthBook',title:'함께 공부할 심화 교재',options:[['highestS','최상위 S 4-1','현재 사례의 교재를 유지'],['highestMath','최상위 수학 4-1','심화 교재 변경안 · 기간은 풀이를 보고 조정']]},
 {id:'gifted',title:'초3 말에 살펴볼 기회',options:[['review','교육청 영재원 지원 검토','지역·해당 연도 모집요강 확인'],['later','학습을 이어가며 나중에 검토','다음 시험 시기를 임의로 정하지 않음']]},
 {id:'academy',title:'학원 이동을 함께 살펴볼까요?',options:[['consider','황소·누테학원 검토','편입과 중등 전환 시점을 지도에 표시'],['defer','현재 계획을 이어가며 보류','교과·사고력·심화 일정은 유지']]}
];
function choices(m){
 return `<div class="case-choices"><p class="case-choice-intro">이 상담 사례의 계획에서 우리 아이에게 필요한 부분을 조정합니다.</p>${CHOICES.map((g,i)=>`<details class="case-choice-group"${i===0?' open':''}><summary><span>${esc(g.title)}</span><small>${esc(g.options.find(o=>o[0]===m.state[g.id])?.[1])}</small></summary><div class="case-choice-grid" role="group" aria-label="${esc(g.title)}">${g.options.map(o=>`<button type="button" data-case-kind="${g.id}" data-case-value="${o[0]}" aria-pressed="${m.state[g.id]===o[0]}"><span class="case-choice-check" aria-hidden="true">${m.state[g.id]===o[0]?'✓':''}</span><span><strong>${esc(o[1])}</strong><small>${esc(o[2])}</small></span></button>`).join('')}</div></details>`).join('')}</div>`;
}
function groups(m){
 const rows=[];m.months.forEach((d,i)=>{const key=d.gradeLabel+' · '+d.quarter+'분기';if(rows.at(-1)?.key===key)rows.at(-1).count++;else rows.push({key,start:i,count:1});});return rows;
}
function timeline(m){
 const total=m.horizon;
 const bars=l=>l.blocks.filter(b=>b.end!=null).map((b,i)=>`<button type="button" class="case-period" data-case-block="${esc(b.id)}" data-course-tone="${i%2}" style="left:${b.start/total*100}%;width:${(Math.min(total,b.end)-b.start)/total*100}%" aria-label="${esc(l.label+' · '+b.title+' · '+span(b))}"><strong>${esc(b.title)}</strong><small>${esc(rangeNote(b))}${b.durationBasis==='18-month-total-even-split-assumption'?' · 배분 예시':''}</small></button>`).join('');
 const unknown=l=>l.id==='deep'?`<div class="case-unknown-range"><span>4-1 이후 교재·기간은 풀이를 확인해 연결</span></div><button type="button" class="case-start-marker" data-case-block="${esc(l.blocks[0].id)}" style="left:${l.blocks[0].start/total*100}%"><i aria-hidden="true"></i><span><strong>${esc(l.blocks[0].title)}</strong><small>초2 9월 중순 시작 · 종료 미정</small></span></button>`:l.id==='calc'?'<div class="case-unknown-range"><span>현재 연산 교재와 범위를 확인한 뒤 이어갑니다.</span></div>':'';
 return `<section class="case-month-plan" aria-label="사례의 월별 병행 계획"><header class="case-section-heading"><div><small>교과 · 심화 · 사고력 · 초등 계통 대수심화 · 연산</small><h3>한 달 안에 함께 공부하는 과정</h3></div><span>초2 9월부터 36개월</span></header><div class="case-timeline-scroll" tabindex="0" role="region" aria-label="학년과 월에 따른 가로 과정표"><div class="case-timeline" style="--case-months:${total}"><div class="case-quarter-axis">${groups(m).map(g=>`<span style="grid-column:${g.start+1}/span ${g.count}">${esc(g.key)}</span>`).join('')}</div><div class="case-month-axis">${m.months.map(d=>`<span><small>${esc(d.gradeLabel)}</small><b>${d.month}월</b></span>`).join('')}</div>${m.lanes.map(l=>`<section class="case-lane" data-study-area="${axis(l.id)}" data-case-lane="${l.id}"><header><strong>${esc(l.label)}</strong><small>${l.id==='deep'?'9월 중순 시작':l.id==='calc'?'현재 진도 확인 전':l.id==='algebra'?'6개월':l.id==='thinking'?'각 과정 6개월':'초등 2.5개월/학기'}</small></header><div class="case-lane-track">${bars(l)}${unknown(l)}${l.id==='school'&&m.algebraPhase.end>m.elementaryEnd?`<div class="case-gap-label" style="left:${m.elementaryEnd/total*100}%;width:${(m.algebraPhase.end-m.elementaryEnd)/total*100}%"><span>초등 계통 대수심화 집중</span><small>아래 행에서 이어짐</small></div>`:''}${l.id==='thinking'?`<div class="case-after-label" style="left:50%;width:50%"><span>다음 사고력 과정은 풀이 수준을 보고 결정</span></div>`:''}${l.id==='school'?`<div class="case-after-label" style="left:${m.middleEnd/total*100}%;width:${(total-m.middleEnd)/total*100}%"><span>다음 과정 검토</span></div>`:''}</div></section>`).join('')}</div></div><p class="case-calendar-note">과정은 시작일을 포함하고 다음 과정이 시작되는 지점까지 표시합니다. 학기 중간 전환은 중순으로 표시하며, 빗금은 기간을 정하지 않은 부분입니다.</p></section>`;
}
function map(m,routeMap=''){
 const school=allBlocks(m).find(b=>b.id==='case-school-5-1'),algebra=allBlocks(m).find(b=>b.id==='case-algebra'),middle=allBlocks(m).find(b=>b.id==='case-school-중1-1');
 const late=m.events.find(e=>e.id==='case-middle-academy')||m.events.at(-1);
 const stops=[{id:school.id,kicker:'현재 교과',title:'응용 5-1',when:'초2 9월',pos:'one'},{id:algebra.id,kicker:'초등 마무리와 연결',title:'초등 계통 대수심화',when:date(m.algebraPhase.start)+'부터',pos:'two'},{id:middle.id,kicker:'새 과정으로',title:'중등 시작',when:date(m.middleStart),pos:'three'},{id:late.id,kicker:m.state.academy==='consider'?'다음 이동 검토':'학습 계획 유지',title:m.state.academy==='consider'?'황소·누테학원':'학원 검토 보류',when:'초5 3월',pos:'four'}];
 return `<section class="case-map" aria-label="강남권 소마 A 중위권 사례 학습 로드맵"><div class="case-landscape"><img src="assets/learning-landscape-20261023.png" alt="배움의 공간을 연결하는 길" width="1536" height="1024"><div class="case-landscape-caption"><span>교과와 깊이를 나란히</span><strong>${m.state.algebra==='overlap'?'6-2를 이어가며 초등 계통 대수심화를 시작합니다.':'6-2를 마친 뒤 초등 계통 대수심화로 이어갑니다.'}</strong></div><svg class="case-map-path" viewBox="0 0 1000 470" preserveAspectRatio="none" aria-hidden="true"><path class="case-route-base" d="M130 340 C250 360 280 200 380 235 S560 310 620 165 S770 180 865 110"/><path class="case-route-line" d="M130 340 C250 360 280 200 380 235 S560 310 620 165 S770 180 865 110"/></svg><ol class="case-map-stops">${stops.map((s,i)=>`<li class="case-map-stop ${s.pos}"><button type="button" data-case-block="${esc(s.id)}"><small>${esc(s.kicker)}</small><strong>${esc(s.title)}</strong><span>${esc(s.when)}</span><b aria-hidden="true">${i+1}</b></button></li>`).join('')}</ol><div class="case-map-annotation"><span aria-hidden="true">↗</span><p>${m.state.algebra==='overlap'?'5~6월은 6-2와 병행하고, 초등 계통 대수심화는 10월까지 이어갑니다.':'교과와 심화를 순서대로 이어가면 중등 시작이 두 달 늦어집니다.'}</p></div></div>${routeMap}${timeline(m)}${milestones(m)}</section>`;
}
function milestones(m){
 return `<section class="case-events"><h3>시기가 오면 함께 살펴볼 길</h3><div class="case-event-list">${m.events.map(e=>`<button type="button" data-case-block="${esc(e.id)}" class="case-event ${e.active?'':'is-deferred'}"><small>${esc(e.date?.label||date(e.at))}</small><strong>${esc(e.title)}</strong><span>${e.active?'검토 계획':'검토 보류'}${Number.isFinite(e.middleRemaining)?' · 중등 '+e.middleRemaining+'개월 남음':''}</span></button>`).join('')}</div></section>`;
}
function table(m){
 return `<section class="case-table-view">${timeline(m)}<details class="case-study-details" open><summary>교재별 공부 방법과 기간 근거</summary><div class="case-detail-table-scroll" tabindex="0" role="region" aria-label="교재별 기간과 공부 방법"><table><caption>선택한 교재와 병행 계획 · 같은 월별 일정 기준</caption><thead><tr><th scope="col">영역·교재</th><th scope="col">기간</th><th scope="col">공부 방법·확인할 점</th></tr></thead><tbody>${m.lanes.flatMap(l=>l.blocks.length?l.blocks.map((b,i)=>`<tr data-study-area="${axis(l.id)}" data-course-tone="${i%2}"><th scope="row">${esc(l.label)}<strong>${esc(b.title)}</strong></th><td>${esc(span(b))}<small>${esc(rangeNote(b))}${b.durationBasis==='18-month-total-even-split-assumption'?' · 총 18개월의 균등 배분':''}</small></td><td>${esc(b.method)}${b.durationBasis==='18-month-total-even-split-assumption'?'<small>학기별 3개월과 교재는 확정된 개별 진도가 아닙니다.</small>':''}</td></tr>`):[`<tr data-study-area="${axis(l.id)}"><th scope="row">${esc(l.label)}</th><td>현재 진도 확인 전</td><td>${esc(l.note)}</td></tr>`]).join('')}</tbody></table></div></details>${milestones(m)}${records(m)}</section>`;
}
const stageLabels={8:'5-1',9:'5-2',10:'6-1',11:'6-2',12:'중1-1',13:'중1-2',14:'중2-1',15:'중2-2',16:'중3-1',17:'중3-2',18:'공통수학1',19:'공통수학2',20:'공통수학2 마침'};
function graph(m){
 const series=[{id:'case',title:'이 사례의 계획',points:m.graph.points},...m.graph.references],width=1120,height=540,left=104,right=1030,top=36,bottom=440;
 const ymax=Math.max(18,...series.flatMap(s=>s.points.map(p=>Math.ceil(p.y)))),ymin=8;
 const x=v=>left+(right-left)*v/m.horizon,y=v=>bottom-(v-ymin)/(ymax-ymin)*(bottom-top);
 const path=pts=>pts.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)).map((p,i)=>(i?'L':'M')+x(p.x).toFixed(2)+' '+y(p.y).toFixed(2)).join(' ');
 const title=s=>s.id==='case'?'이 사례 · 응용 5-1에서 시작':s.id+' (초2 9월 교과 '+(stageLabels[Math.floor(s.points[0]?.y)]||'진도')+' 참고)';
 const ticks=Array.from({length:ymax-ymin+1},(_,i)=>i+ymin);
 const milestoneOffsets=[0,6,8,10,m.middleStart,18,24,30,m.middleEnd].filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b);
 return `<section class="case-graph"><header class="case-section-heading"><div><small>같은 학년·월에서 비교</small><h3>교과 진도와 심화 기간을 함께 봅니다.</h3></div><span>L9 기준 사례 · 상위 예시 2개</span></header><ul class="case-graph-legend">${series.map(s=>`<li class="series-${s.id}"><i aria-hidden="true"></i>${esc(title(s))}</li>`).join('')}</ul><div class="case-chart-scroll" tabindex="0" role="region" aria-label="36개월 교과 진도 비교 그래프"><svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="caseGraphTitle caseGraphDesc"><title id="caseGraphTitle">이 사례와 L8·L7의 교과 진도 비교</title><desc id="caseGraphDesc">${esc(m.graph.note)} 이 사례는 ${esc(date(m.middleStart))}에 중등을 시작합니다. 초등 계통 대수심화 기간에는 교과 단계가 유지될 수 있습니다.</desc><rect x="${x(m.algebraPhase.start)}" y="${top}" width="${x(m.algebraPhase.end)-x(m.algebraPhase.start)}" height="${bottom-top}" class="case-algebra-band"/>${ticks.map(v=>`<g class="case-chart-grid"><line x1="${left}" y1="${y(v)}" x2="${right}" y2="${y(v)}"/><text x="${left-14}" y="${y(v)+4}" text-anchor="end">${v===18?'중3-2 마침':esc(stageLabels[v]||String(v))}</text></g>`).join('')}${Array.from({length:13},(_,i)=>i*3).map(v=>`<g class="case-chart-month"><line x1="${x(v)}" y1="${top}" x2="${x(v)}" y2="${bottom}"/><text x="${x(v)}" y="${bottom+24}" text-anchor="middle"><tspan x="${x(v)}">${esc(C().dateAt(v).gradeLabel)}</tspan><tspan x="${x(v)}" dy="18">${C().dateAt(v).month}월</tspan></text></g>`).join('')}${[...series].reverse().map(s=>`<path class="case-chart-line series-${s.id}" d="${path(s.points)}"/>`).join('')}<circle class="case-chart-pin" cx="${x(m.middleEnd)}" cy="${y(18)}" r="6"/><text class="case-chart-callout" x="${x(m.middleEnd)-12}" y="${y(18)+25}" text-anchor="end">중등 18개월 마침 · 이후 계획 미정</text><line class="case-middle-start" x1="${x(m.middleStart)}" y1="${y(12)}" x2="${x(m.middleStart)}" y2="${bottom}"/><circle class="case-chart-pin" cx="${x(m.middleStart)}" cy="${y(12)}" r="6"/><text class="case-chart-callout" x="${x(m.middleStart)+12}" y="${y(12)+26}">${esc(date(m.middleStart))} 중등 시작</text><text class="case-chart-label" x="${x(m.algebraPhase.start)+10}" y="${top+20}"><tspan x="${x(m.algebraPhase.start)+10}">초등 계통 대수심화</tspan><tspan x="${x(m.algebraPhase.start)+10}" dy="17">6개월</tspan></text><text class="case-chart-foot" x="${left}" y="${height-16}">세로축: 교과 과정의 순서 · 가로축: 이 사례와 같은 학년·월</text></svg></div><div class="case-graph-comment"><strong>${m.state.algebra==='overlap'?'6-2와 두 달 병행':'6-2 종료 뒤 시작'} → ${esc(date(m.middleStart))} 중등</strong><p>초등 계통 대수심화를 공부하는 동안 교과 단계가 그대로인 구간도 있습니다. 교과 선만으로 사고력·심화·연산의 학습량을 판단하지 않습니다.</p><p>상위 두 예시는 기존 진도표의 흐름을 계속 이어갑니다. 이 사례를 상위 예시에 맞춰 합류시키거나 교재 변경만으로 속도를 높이지 않았습니다.</p></div><details class="case-study-details"><summary>시점별 그래프 값과 비교 기준</summary><div class="case-detail-table-scroll" tabindex="0"><table><caption>교과 단계 수치 · 8은 5-1 시작, 12는 중1-1 시작, 18은 중3-2 마침</caption><thead><tr><th scope="col">시점</th>${series.map(s=>`<th scope="col">${esc(s.title)}</th>`).join('')}</tr></thead><tbody>${milestoneOffsets.map(v=>`<tr><th scope="row">${esc(date(v))}</th>${series.map(s=>`<td>${pointValue(s.points,v,s.id==='case'?m:null)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p>${esc(m.graph.note)}</p><p>L8·L7은 기존 교과 진도표에서 동일한 학년·월을 가져온 예시입니다. 소마 반의 석차나 전국 백분위를 나타내지 않습니다.</p><p>중등 총 18개월은 여섯 학기에 3개월씩 나눈 표시 가정입니다. 실제 학기별 기간·교재는 풀이를 보고 조정합니다.</p></details>${records(m)}</section>`;
}
function pointValue(points,v,caseModel=null){
 if(!points.length||v<points[0].x||v>points.at(-1).x)return '이후 계획 미정';
 if(caseModel&&v>=caseModel.elementaryEnd&&v<caseModel.middleStart)return '6-2 마침 · 초등 계통 대수심화 중';
 if(caseModel&&v===points.at(-1).x)return '중3-2 마침 · 이후 계획 미정';
 let value=points.at(-1).y;for(let i=1;i<points.length;i++)if(v<=points[i].x){const a=points[i-1],b=points[i];value=a.y+(b.y-a.y)*(v-a.x)/(b.x-a.x||1);break;}
 const label=stageLabels[Math.floor(value)]||'교과 과정';return esc(label+' · '+value.toFixed(2));
}
function records(m,open=false){
 return `<details class="case-records"${open?' open':''}><summary>이 계획에 반영한 상담 내용과 가정</summary><dl>${m.lanes.map(l=>`<div data-study-area="${axis(l.id)}"><dt>${esc(l.label)}</dt><dd>${esc(l.note)}</dd></div>`).join('')}</dl><ul>${m.assumptions.map(a=>`<li>${esc(a)}</li>`).join('')}</ul></details>`;
}
function questions(m,extra=[]){
 return `<section class="pathway-parent-questions case-questions"><h3>이 계획에서 부모님이 궁금한 점</h3>${[...extra,...m.questions].filter((q,i,a)=>a.findIndex(x=>x.question===q.question)===i).map(q=>`<details><summary>${esc(q.question)}</summary><p>${esc(q.answer)}</p></details>`).join('')}</section>`;
}
function parallelStudy(l,b){
 if(l.id==='calc')return l.current;
 if(l.id==='deep')return l.blocks[0].title+'부터 시작 · 후속 교재와 권별 기간은 확인 필요';
 const end=Number.isFinite(b.end)?b.end:b.start+.001;
 const parallel=l.blocks.filter(other=>other.start<end&&other.end>b.start);
 if(parallel.length)return parallel.map(other=>other.title+' ('+span(other)+')').join(' → ');
 if(l.id==='thinking')return '3% 이후 과정은 풀이를 확인한 뒤 결정';
 if(l.id==='algebra')return b.start<l.blocks[0].start?date(l.blocks[0].start)+'부터 6개월 예정':'초등 계통 대수심화 6개월 이후의 과정';
 return '이 구간의 추가 교과 과정은 배정하지 않음';
}
function detail(m,id){
 const b=typeof id==='object'?id:pick(m,id);if(!b)return '<p>선택한 과정의 내용을 찾지 못했습니다.</p>';
 if(b.at!=null)return `<div class="case-course-detail"><p class="case-detail-date">${esc(b.date?.label||date(b.at))} · ${b.active?'검토 계획':'검토 보류'}</p><h3>${esc(b.title)}</h3><p>${esc(b.note)}</p>${Number.isFinite(b.middleRemaining)?`<p>이 시점에는 중등 과정이 ${b.middleRemaining}개월 남아 있습니다. 학원 이동 검토와 과정 완료를 구분해 봅니다.</p>`:''}<p>실제 지원 시기와 전형은 해당 학원 또는 지역·해당 연도 모집요강을 확인합니다.</p></div>`;
 const lane=m.lanes.find(l=>l.blocks.some(item=>item.id===b.id));
 return `<div class="case-course-detail" data-study-area="${axis(lane?.id)}"><p class="case-detail-date">${esc(span(b))} · ${esc(rangeNote(b))}</p><h3>${esc(b.title)}</h3><p>${esc(b.method)}</p>${b.overlap?'<p class="case-detail-emphasis">초3 5~6월에는 교과 6-2와 병행합니다. 초등 계통 대수심화는 총 6개월이며 6-2를 마친 뒤에도 이어갑니다.</p>':''}${b.durationBasis==='18-month-total-even-split-assumption'?'<p>중등 총 18개월을 여섯 학기에 3개월씩 나눈 표시 가정입니다. 교재와 실제 학기별 기간은 아직 확정하지 않았습니다.</p>':''}${b.openEnded?'<p>이 교재의 시작 시점만 확인됐습니다. 한 권을 전체 표시 기간 동안 공부한다는 뜻이 아니며, 다음 권과 종료 시기는 실제 풀이를 보고 연결합니다.</p>':''}<h4>함께 이어갈 공부</h4><dl>${m.lanes.filter(l=>l.id!==lane?.id).map(l=>`<div><dt>${esc(l.label)}</dt><dd>${esc(parallelStudy(l,b))}</dd></div>`).join('')}</dl></div>`;
}
global.PlannerCaseView=Object.freeze({summary,choices,map,table,graph,records,questions,detail,timeline});
})(window);
