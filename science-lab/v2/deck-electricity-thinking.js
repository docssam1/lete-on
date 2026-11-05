import{findLifeItem}from'./book-life.js';
import{thinkingCheckQuestion}from'./thinking-check-question.js?v=20261102-material';
import{workbook}from'../data/book/c22-s62-u03.workbook.js?v=20261104-student-science-language';
import{electricitySources}from'../data/activities/c22-s62-u03.resources.js';
import{seasonAnswerHint as electricityAnswerHint}from'./season-answer-hint.js?v=20261104-season-book';
import{electricityCase}from'./electricity-compare-model.js?v=20261104-student-science-language';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=s=>`<p>${esc(s)}</p>`;
const program=id=>{if(id!=='sources')throw Error('전기의 이용 자료 링크 없음 '+id);return `<section class="electricity-program" aria-label="전기의 이용 참고 자료"><ul class="electricity-source-links">${electricitySources.map(r=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title)}</a><p>${esc(r.publisher+' · '+r.scope)}</p><p>${esc(r.summary)}</p><small>자료 확인: ${esc(r.readOn)}</small></li>`).join('')}</ul><p>이용 사례와 제품 안내를 알아볼 자료예요. 직접 실험할 때는 교육용 키트 설명서와 학교의 실험 방법을 따라요.</p></section>`;};
const table=(heads,rows)=>`<table class="dk-tbl"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table>`;
function electricityQuestion(q,n,teach){let html=thinkingCheckQuestion(q,n,teach,q.contentVersion?{recordKey:`test:item:${q.id}:version:${q.contentVersion}`}:{ });if(q.visualModel?.kind==='authored-svg')html=html.replace('</p>','</p>'+(workbook.figures[q.visualModel.figure]||q.visualModel.html));if(q.responseContract?.kind==='drawing')html=html.replace('</p>','</p>'+p('종이에 그림이나 표를 그리고 이름표와 설명을 남겨요. 그림은 선생님과 함께 확인해요.')+'<div class="electricity-draw-space" role="group" aria-label="그림 구성을 생각하는 칸"></div>');if(!teach&&electricityAnswerHint(q.answerContract))html=html.replace('</p>','</p>'+`<p class="electricity-answer-hint">${esc(electricityAnswerHint(q.answerContract))}</p>`);return html;}
export function buildElectricityThinkingSlides(ch,art,plan,pool,mode){
 const teach=mode==='teach',S=[],phases=Object.fromEntries(plan.phases.map(p=>[p.id,p]));let ses=1;
 const add=(id,phase,title,body,extra={})=>S.push({id,phase,phaseObj:phases[phase],title,body,kind:'read',ses,...extra});
 const peek=text=>teach?`<div class="dk-ans rv">${esc(text)}</div>`:`<div class="dk-peekw"><button type="button" class="dk-peek">생각한 뒤 설명 보기</button><div class="dk-ans" hidden>${esc(text)}</div></div>`;
 for(const page of ch.electricityFlow){
  if(page.id==='recall')ses=2;
  let body=page.text.map(p).join('');
  if(page.figure){const figure=workbook.figures[page.figure];if(!figure)throw Error(`전기의 이용 그림 없음 ${page.figure}`);body=figure+body;}
  if(page.caseId){const m=electricityCase(page.caseId);body+=p(m.conditions)+table(m.heads,m.rows)+peek(m.reason);}
  if(page.program)body+=program(page.program);
  if(page.kind==='activity')body+=`<ol>${page.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`+p('교재나 종이에 관찰한 것을 남겨요. 활동을 마치면 다음 화면으로 넘겨요. 자세한 기록장은 필요할 때 선택하여 써요.');
  if(page.kind==='predict'){const options=ch.electricityInteraction.predict.options;body=(teach?`<ol class="dk-tally">${options.map((s,j)=>`<li data-j="${j}"><span class="dk-tn">${j+1}</span><span class="dk-tt">${esc(s)}</span><button type="button" data-t="-" aria-label="${j+1}번 한 명 빼기">−</button><b class="dk-tc">0</b><button type="button" data-t="+" aria-label="${j+1}번 한 명 더하기">+</button></li>`).join('')}</ol>`:`<ol class="dk-choices dk-mc predict">${options.map((s,j)=>`<li><button type="button" data-j="${j}"><span>${'①②③'[j]}</span>${esc(s)}</button></li>`).join('')}</ol>`)+body;}
  if(page.kind==='break')body+='<button type="button" class="btn" data-a2="cont">뒷부분으로 이어 가기</button>';
  if(page.kind==='lab')body+='<div class="dk-lab" data-mount="lab"></div>';
  if(page.kind==='conclusion')body=(teach?'':'<div class="dk-pred-summary" hidden><b>내 처음 생각</b><p data-prediction-summary></p></div>')+body+'<div class="dk-mylab" hidden></div>';
  add(page.id,page.phase,page.title,body,{kind:page.kind==='conclusion'?'think':page.kind,...(page.standards?{standards:page.standards}:{}),...(page.kind==='lab'?{mount:'lab'}:{})});
  if(page.id==='cover'&&teach)add('plan','open','회로 만들기 → 전지의 직렬연결 → 전자석 → 생활 속 실천',`<ol class="dk-plan">${plan.phases.map(p=>`<li><b>${esc(p.name)}</b><span>${p.min}분</span><em>${esc(p.aim)}</em></li>`).join('')}</ol>`+p(plan.note));
 }
 ch.check.forEach((id,i)=>{const q=findLifeItem(pool,id);if(!q)throw Error(`전기의 이용 확인 문항 없음 ${id}`);add(`test${i+1}`,'check',`배운 내용 확인하기 ${i+1}/${ch.check.length}`,electricityQuestion(q,i+1,teach),{kind:q.choices?'test':'write',item:q.id,standards:[workbook.questions.find(w=>w.id===q.bookQuestionId).standard],...(q.contentVersion?{questionVersion:q.contentVersion}:{}),layout:'dense'});});
 add('end','check','전기의 이용을 설명하고 실천해요',`<ul>${['전구에 불이 켜지는 회로의 특징 설명하기','전지 한 개와 두 개의 직렬연결에서 밝기 비교하기','전자석을 만들어 성질과 쓰임 설명하기','전기를 효율적이고 안전하게 사용하는 방법 실천하기'].map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`+p('직접 관찰한 것과 자료로 알아본 것, 생활 속에서 실천한 것을 들어 설명해 보아요.')+'<a class="btn" href="#/c22-s62-u03/daily">Daily Test</a>',{kind:'end'});
 S.forEach((s,i)=>s.n=i+1);return S;
}
