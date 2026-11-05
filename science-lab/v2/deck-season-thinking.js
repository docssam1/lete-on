import{findLifeItem}from'./book-life.js';
import{thinkingCheckQuestion}from'./thinking-check-question.js?v=20261102-material';
import{workbook}from'../data/book/c22-s62-u01.workbook.js?v=20261104-season-book';
import{seasonData,location,dataNotes}from'../data/activities/c22-s62-u01.observation.js';
import{seasonAnswerHint}from'./season-answer-hint.js?v=20261104-season-book';
import{seasonCase}from'./season-compare-model.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=s=>`<p>${esc(s)}</p>`;
const classroomFigures={modelPreparation:'<figure class="ps-figure"><img src="../assets/activities/c22-s61-u04/model-preparation.webp" alt="태양 역할의 광원과 한 지역을 표시한 구 모형의 준비 장면"><figcaption>광원과 구 모형의 준비 예예요. 공전 실험에서는 자전축의 기울기와 방향을 조절할 수 있는 지구의를 준비해요.</figcaption></figure>'};
const program=id=>{if(id!=='sources')throw Error('계절 자료 링크 없음 '+id);return `<section class="season-program" aria-label="계절별 계산 자료"><p>${esc(location.name+' · '+location.display+' · '+location.timeZone)}</p><ul class="season-source-links">${seasonData.map(r=>`<li><b>${esc(r.season+' · '+r.date)}</b><a href="${esc(r.sourceUrl)}" target="_blank" rel="noopener noreferrer">일출·일몰·남중 시각</a><a href="${esc(r.altitudeUrl)}" target="_blank" rel="noopener noreferrer">${esc(r.noon)} 무렵 고도</a></li>`).join('')}</ul><p>링크를 연 뒤 결과의 날짜·좌표·요청 시각을 확인해요. 아래 사전 자료의 확인일은 ${esc(dataNotes.readOn)}이에요.</p></section>`;};
const table=(heads,rows)=>`<table class="dk-tbl"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table>`;
function seasonQuestion(q,n,teach){let html=thinkingCheckQuestion(q,n,teach,q.contentVersion?{recordKey:`test:item:${q.id}:version:${q.contentVersion}`}:{ });if(q.visualModel?.kind==='authored-svg')html=html.replace('</p>','</p>'+(workbook.figures[q.visualModel.figure]||q.visualModel.html));if(q.responseContract?.kind==='drawing')html=html.replace('</p>','</p>'+p('종이에 그림이나 표를 그리고 이름표와 설명을 남겨요. 그림은 선생님과 함께 확인해요.')+'<div class="season-draw-space" role="group" aria-label="그림 구성을 생각하는 칸"></div>');if(!teach&&seasonAnswerHint(q.answerContract))html=html.replace('</p>','</p>'+`<p class="season-answer-hint">${esc(seasonAnswerHint(q.answerContract))}</p>`);return html;}
export function buildSeasonThinkingSlides(ch,art,plan,pool,mode){
 const teach=mode==='teach',S=[],phases=Object.fromEntries(plan.phases.map(p=>[p.id,p]));let ses=1;
 const add=(id,phase,title,body,extra={})=>S.push({id,phase,phaseObj:phases[phase],title,body,kind:'read',ses,...extra});
 const peek=text=>teach?`<div class="dk-ans rv">${esc(text)}</div>`:`<div class="dk-peekw"><button type="button" class="dk-peek">생각한 뒤 설명 보기</button><div class="dk-ans" hidden>${esc(text)}</div></div>`;
 for(const page of ch.seasonFlow){
  if(page.id==='recall')ses=2;
  let body=page.text.map(p).join('');
  if(page.figure){const figure=workbook.figures[page.figure]||classroomFigures[page.figure];if(!figure)throw Error(`계절의 변화 그림 없음 ${page.figure}`);body=figure+body;}
  if(page.dataTable==='season')body+=table(['날짜','일출(KST)','남중 표시(KST)','일몰(KST)','남중 무렵 고도(°)'],seasonData.map(r=>[r.date,r.sunrise,r.noon,r.sunset,r.altitude.toFixed(1)]))+p(dataNotes.precision);
  if(page.caseId){const m=seasonCase(page.caseId);body+=p(m.conditions)+table(m.heads,m.rows)+peek(m.reason);}
  if(page.program)body+=program(page.program);
  if(page.kind==='activity')body+=`<ol>${page.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`+p('교재나 종이에 관찰한 것을 남겨요. 활동을 마치면 다음 화면으로 넘겨요. 자세한 기록장은 필요할 때 선택하여 써요.');
  if(page.kind==='predict'){const options=ch.seasonInteraction.predict.options;body=(teach?`<ol class="dk-tally">${options.map((s,j)=>`<li data-j="${j}"><span class="dk-tn">${j+1}</span><span class="dk-tt">${esc(s)}</span><button type="button" data-t="-" aria-label="${j+1}번 한 명 빼기">−</button><b class="dk-tc">0</b><button type="button" data-t="+" aria-label="${j+1}번 한 명 더하기">+</button></li>`).join('')}</ol>`:`<ol class="dk-choices dk-mc predict">${options.map((s,j)=>`<li><button type="button" data-j="${j}"><span>${'①②③'[j]}</span>${esc(s)}</button></li>`).join('')}</ol>`)+body;}
  if(page.kind==='break')body+='<button type="button" class="btn" data-a2="cont">다음 차시로 이어 가기</button>';
  if(page.kind==='lab')body+='<div class="dk-lab" data-mount="lab"></div>';
  if(page.kind==='conclusion')body=(teach?'':'<div class="dk-pred-summary" hidden><b>내 처음 생각</b><p data-prediction-summary></p></div>')+body+'<div class="dk-mylab" hidden></div>';
  add(page.id,page.phase,page.title,body,{kind:page.kind==='conclusion'?'think':page.kind,...(page.standards?{standards:page.standards}:{}),...(page.kind==='lab'?{mount:'lab'}:{})});
  if(page.id==='cover'&&teach)add('plan','open','측정 → 하루의 관계 → 계절 자료 → 공전 모형',`<ol class="dk-plan">${plan.phases.map(p=>`<li><b>${esc(p.name)}</b><span>${p.min}분</span><em>${esc(p.aim)}</em></li>`).join('')}</ol>`+p(plan.note));
 }
 ch.check.forEach((id,i)=>{const q=findLifeItem(pool,id);if(!q)throw Error(`계절의 변화 확인 문항 없음 ${id}`);add(`test${i+1}`,'check',`배운 내용 확인하기 ${i+1}/${ch.check.length}`,seasonQuestion(q,i+1,teach),{kind:q.choices?'test':'write',item:q.id,...(q.contentVersion?{questionVersion:q.contentVersion}:{}),layout:'dense'});});
 add('end','check','계절의 변화를 설명해요',`<ul>${['태양 고도 측정기를 만들고 하루의 고도·그림자 길이·기온 관계 찾기','같은 장소의 계절별 남중 고도와 낮의 길이 관계 추론하기','지구가 자전축이 기울어진 채 공전하여 계절이 변하는 까닭 설명하기'].map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`+p('직접 측정한 관계와 계절 자료, 공전 모형에서 알아낸 내용을 연결해 설명해 보아요.')+'<a class="btn" href="#/c22-s62-u01/daily">Daily Test</a>',{kind:'end'});
 S.forEach((s,i)=>s.n=i+1);return S;
}
