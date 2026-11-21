import{findLifeItem}from'./book-life.js';
import{thinkingCheckQuestion}from'./thinking-check-question.js?v=20261102-material';
import{workbook}from'../data/book/c22-s61-u02.workbook.js?v=20261105-sound-motion-photo-language';
import{motionCase}from'./motion-compare-model.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=s=>`<p>${esc(s)}</p>`;
const table=(heads,rows)=>`<table class="dk-tbl"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${esc(v)}</td>`:`<th scope="row">${esc(v)}</th>`).join('')}</tr>`).join('')}</tbody></table>`;
function motionQuestion(q,n,teach){let html=thinkingCheckQuestion(q,n,teach,q.contentVersion?{recordKey:`test:item:${q.id}:version:${q.contentVersion}`}:{ });if(q.visualModel?.kind==='authored-svg')html=html.replace('</p>','</p>'+(workbook.figures[q.visualModel.figure]||q.visualModel.html));if(q.bookResponseForm==='draw')html=html.replace('<div class="dk-self"',p('종이에 그림이나 표를 그리고 이름표와 설명을 남겨요. 그림은 선생님과 함께 확인해요.')+'<div class="motion-draw-space" aria-label="그림 구성을 생각하는 칸"></div><div class="dk-self"');return html;}
export function buildMotionThinkingSlides(ch,art,plan,pool,mode){
 const teach=mode==='teach',S=[],phases=Object.fromEntries(plan.phases.map(p=>[p.id,p]));let ses=1;
 const add=(id,phase,title,body,extra={})=>S.push({id,phase,phaseObj:phases[phase],title,body,kind:'read',ses,...extra});
 const peek=text=>teach?`<div class="dk-ans rv">${esc(text)}</div>`:`<div class="dk-peekw"><button type="button" class="dk-peek">생각한 뒤 설명 보기</button><div class="dk-ans" hidden>${esc(text)}</div></div>`;
 for(const page of ch.motionFlow){
  if(page.id==='recall')ses=2;
  let body=page.text.map(p).join('');
  if(page.figure){if(!workbook.figures[page.figure])throw Error(`물체의 운동 그림 없음 ${page.figure}`);body=workbook.figures[page.figure]+body;}
  if(page.caseId){const m=motionCase(page.caseId);body+=p(m.conditions)+table(m.heads,m.rows)+peek(m.reason);}
  if(page.kind==='activity')body+=`<ol>${page.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`+p('활동을 마치면 다음 화면으로 넘겨요. 자세히 남기고 싶은 내용은 선택 기록장에 써도 좋아요.');
  if(page.kind==='predict'){const options=ch.motionInteraction.predict.options;body=(teach?`<ol class="dk-tally">${options.map((s,j)=>`<li data-j="${j}"><span class="dk-tn">${j+1}</span><span class="dk-tt">${esc(s)}</span><button type="button" data-t="-" aria-label="${j+1}번 한 명 빼기">−</button><b class="dk-tc">0</b><button type="button" data-t="+" aria-label="${j+1}번 한 명 더하기">+</button></li>`).join('')}</ol>`:`<ol class="dk-choices dk-mc predict">${options.map((s,j)=>`<li><button type="button" data-j="${j}"><span>${'①②③'[j]}</span>${esc(s)}</button></li>`).join('')}</ol>`)+body;}
  if(page.kind==='break')body+='<button type="button" class="btn" data-a2="cont">다음 차시로 이어 가기</button>';
  if(page.kind==='lab')body+='<div class="dk-lab" data-mount="lab"></div>';
  if(page.kind==='conclusion')body=(teach?'':'<div class="dk-pred-summary" hidden><b>내 처음 생각</b><p data-prediction-summary></p></div>')+body+'<div class="dk-mylab" hidden></div>';
  add(page.id,page.phase,page.title,body,{kind:page.kind==='conclusion'?'think':page.kind,...(page.standards?{standards:page.standards}:{}),...(page.kind==='lab'?{mount:'lab'}:{})});
  if(page.id==='cover'&&teach)add('plan','open','위치 변화 → 속력 비교 → 교통안전',`<ol class="dk-plan">${plan.phases.map(p=>`<li><b>${esc(p.name)}</b><span>${p.min}분</span><em>${esc(p.aim)}</em></li>`).join('')}</ol>`+p(plan.note));
 }
 ch.check.forEach((id,i)=>{const q=findLifeItem(pool,id);if(!q)throw Error(`물체의 운동 확인 문항 없음 ${id}`);add(`test${i+1}`,'check',`배운 내용 확인하기 ${i+1}/${ch.check.length}`,motionQuestion(q,i+1,teach),{kind:q.choices?'test':'write',item:q.id,...(q.contentVersion?{questionVersion:q.contentVersion}:{}),layout:'dense'});});
 add('end','check','운동을 설명하고 교통안전을 실천해요',`<ul>${['시간에 따른 위치 변화를 좌표로 나타내기','거리와 시간을 재어 속력을 구하고 빠르기 비교하기','안전 수칙과 장치의 역할을 조사하여 공유하기','생활 속에서 교통안전 실천하기'].map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`+p('관찰과 측정으로 알아낸 까닭을 설명하고 생활 속 실천을 돌아보아요.')+'<a class="btn" href="#/c22-s61-u02/daily">Daily Test</a>',{kind:'end'});
 S.forEach((s,i)=>s.n=i+1);return S;
}
