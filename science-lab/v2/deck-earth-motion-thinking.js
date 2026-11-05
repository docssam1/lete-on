import{findLifeItem}from'./book-life.js';
import{thinkingCheckQuestion}from'./thinking-check-question.js?v=20261102-material';
import{workbook}from'../data/book/c22-s61-u04.workbook.js?v=20261104-earth-motion-questions';
import{SKY_COMPARISONS,SKY_VIEWS,skyViewUrl,SKY_PROGRAM_STEPS}from'../data/activities/c22-s61-u04.observation.js';
import{earthMotionCase}from'./earth-motion-compare-model.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=s=>`<p>${esc(s)}</p>`;
const program=id=>{const c=SKY_COMPARISONS[id];if(!c)throw Error('하늘 비교 설정 없음 '+id);return `<section class="earth-motion-program" aria-label="${esc(c.title)}"><p>같게 둘 조건: ${esc(c.fixed)} · 바꿀 조건: ${esc(c.changed)}</p><ul class="earth-motion-sky-links">${c.views.map(key=>{const v=SKY_VIEWS.find(v=>v.id===key);return `<li><a href="${esc(skyViewUrl(key))}" target="_blank" rel="noopener noreferrer">${esc(v.date+' · 한국 시각 '+v.time)}</a></li>`;}).join('')}</ul><ol>${SKY_PROGRAM_STEPS.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${p(c.look)}<p class="earth-motion-program-note">천체 관측 프로그램에서 계산한 하늘이에요. 실제 촬영 사진과는 달라요.</p></section>`;};
const table=(heads,rows)=>`<table class="dk-tbl"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table>`;
function earthMotionQuestion(q,n,teach){let html=thinkingCheckQuestion(q,n,teach,q.contentVersion?{recordKey:`test:item:${q.id}:version:${q.contentVersion}`}:{ });if(q.visualModel?.kind==='authored-svg')html=html.replace('</p>','</p>'+(workbook.figures[q.visualModel.figure]||q.visualModel.html));if(q.responseContract?.kind==='drawing')html=html.replace('</p>','</p>'+p('종이에 그림이나 표를 그리고 이름표와 설명을 남겨요. 그림은 선생님과 함께 확인해요.')+'<div class="earth-motion-draw-space" role="group" aria-label="그림 구성을 생각하는 칸"></div>');return html;}
export function buildEarthMotionThinkingSlides(ch,art,plan,pool,mode){
 const teach=mode==='teach',S=[],phases=Object.fromEntries(plan.phases.map(p=>[p.id,p]));let ses=1;
 const add=(id,phase,title,body,extra={})=>S.push({id,phase,phaseObj:phases[phase],title,body,kind:'read',ses,...extra});
 const peek=text=>teach?`<div class="dk-ans rv">${esc(text)}</div>`:`<div class="dk-peekw"><button type="button" class="dk-peek">생각한 뒤 설명 보기</button><div class="dk-ans" hidden>${esc(text)}</div></div>`;
 for(const page of ch.earthMotionFlow){
  if(page.id==='recall')ses=2;
  let body=page.text.map(p).join('');
  if(page.figure){if(!workbook.figures[page.figure])throw Error(`지구의 운동 그림 없음 ${page.figure}`);body=workbook.figures[page.figure]+body;}
  if(page.caseId){const m=earthMotionCase(page.caseId);body+=p(m.conditions)+table(m.heads,m.rows)+peek(m.reason);}
  if(page.program)body+=program(page.program);
  if(page.kind==='activity')body+=`<ol>${page.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`+p('교재나 종이에 관찰한 것을 남겨요. 활동을 마치면 다음 화면으로 넘겨요. 자세한 기록장은 필요할 때 선택하여 써요.');
  if(page.kind==='predict'){const options=ch.earthMotionInteraction.predict.options;body=(teach?`<ol class="dk-tally">${options.map((s,j)=>`<li data-j="${j}"><span class="dk-tn">${j+1}</span><span class="dk-tt">${esc(s)}</span><button type="button" data-t="-" aria-label="${j+1}번 한 명 빼기">−</button><b class="dk-tc">0</b><button type="button" data-t="+" aria-label="${j+1}번 한 명 더하기">+</button></li>`).join('')}</ol>`:`<ol class="dk-choices dk-mc predict">${options.map((s,j)=>`<li><button type="button" data-j="${j}"><span>${'①②③'[j]}</span>${esc(s)}</button></li>`).join('')}</ol>`)+body;}
  if(page.kind==='break')body+='<button type="button" class="btn" data-a2="cont">다음 차시로 이어 가기</button>';
  if(page.kind==='lab')body+='<div class="dk-lab" data-mount="lab"></div>';
  if(page.kind==='conclusion')body=(teach?'':'<div class="dk-pred-summary" hidden><b>내 처음 생각</b><p data-prediction-summary></p></div>')+body+'<div class="dk-mylab" hidden></div>';
  add(page.id,page.phase,page.title,body,{kind:page.kind==='conclusion'?'think':page.kind,...(page.standards?{standards:page.standards}:{}),...(page.kind==='lab'?{mount:'lab'}:{})});
  if(page.id==='cover'&&teach)add('plan','open','남쪽 하늘 관찰 → 자전과 낮밤 → 공전과 계절별 별자리',`<ol class="dk-plan">${plan.phases.map(p=>`<li><b>${esc(p.name)}</b><span>${p.min}분</span><em>${esc(p.aim)}</em></li>`).join('')}</ol>`+p(plan.note));
 }
 ch.check.forEach((id,i)=>{const q=findLifeItem(pool,id);if(!q)throw Error(`지구의 운동 확인 문항 없음 ${id}`);add(`test${i+1}`,'check',`배운 내용 확인하기 ${i+1}/${ch.check.length}`,earthMotionQuestion(q,i+1,teach),{kind:q.choices?'test':'write',item:q.id,...(q.contentVersion?{questionVersion:q.contentVersion}:{}),layout:'dense'});});
 add('end','check','지구의 운동을 설명해요',`<ul>${['남쪽 하늘에서 태양과 별의 하루 위치 변화 관찰하기','기울어진 자전축을 중심으로 도는 자전 알아보기','모형실험으로 낮과 밤이 생기는 까닭 설명하기','공전을 알고 계절별 별자리와 위치 비교하기'].map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`+p('관찰과 모형실험에서 알아낸 내용으로 지구의 자전과 공전을 설명해 보아요.')+'<a class="btn" href="#/c22-s61-u04/daily">Daily Test</a>',{kind:'end'});
 S.forEach((s,i)=>s.n=i+1);return S;
}
