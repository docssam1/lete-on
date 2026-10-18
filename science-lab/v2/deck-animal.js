import { observationQuestion } from './book-animal.js';
import { findLifeItem, lifeQuestion } from './book-life.js';
import { animals,photoCredit } from '../data/activities/s31-u02.animal.js';
import { escapeLife as esc } from './life-records.js';
export function buildAnimalSlides(ch,art,plan,pool,mode) {
  const cards=ch.photoCards||animals,credit=ch.photoCredit||photoCredit;
  const teach=mode==='teach',slides=[],phases=Object.fromEntries(plan.phases.map((p)=>[p.id,p]));let session=1;
  const p=(s)=>`<p>${esc(s)}</p>`;
  const add=(id,phase,title,body,more={})=>slides.push({id,phase,phaseObj:phases[phase],title,body,ses:session,kind:'fieldwork-read',...more});
  add('cover','open',ch.title,ch.intro.map(p).join(''));
  if(teach)add('plan','open','관찰과 설계 수업 계획',p(plan.note)+`<ol class="dk-plan">${plan.phases.map((x)=>`<li><b>${x.name}</b><span>${x.min}분</span><em>${x.aim}</em></li>`).join('')}</ol>`);
  add('goal','open','관찰하고 분류하고 생활을 설계해요',p(ch.goal));
  add('photos','open','사진에서 확인할 수 있는 것은 무엇인가요?',`<div class="${ch.plantwork?'plant':'animal'}-slide-photos">${cards.map((x)=>`<figure><img src="${x.image}" alt="${x.name} 관찰 자료"><figcaption>${x.name}</figcaption></figure>`).join('')}</div>${p(credit)}${p('사진에서 보이지 않는 것과 없는 것은 구별해요.')}`);
  for(const a of ch.activities){
    const phase=({observe:'observe',classify:'observe',habitat:'research',design:'design',share:'design'})[a.id];
    if(a.id==='habitat'){session=2;add('recall','research','내 관찰과 분류 기준을 되짚어요',p('내 관찰에서 확인한 특징과 두 기준의 분류를 설명해요. 보관한 기록을 열어 근거를 가리켜요.'));}
    add(`${a.id}-question`,phase,a.question,p(a.intro));
    add(`${a.id}-method`,phase,`${a.title} · 실제 활동 방법`,`<ol>${a.steps.map((s)=>`<li>${esc(s)}</li>`).join('')}</ol>`);
    add(`${a.id}-prepare`,phase,`${a.title} · 남길 근거`,`<ul>${a.fields.map((f)=>`<li>${esc(f.label)}</li>`).join('')}</ul>`+p('실제로 확인한 내용과 출처를 적고 보관해요.'),{layout:'dense'});
    add(`${a.id}-work`,phase,`${a.title} · 내 탐구 기록`,p(a.question)+'<div data-mount="lab"></div>',{mount:'lab',fieldTab:a.id,kind:'fieldwork',layout:'fieldwork'});
    add(`${a.id}-explain`,phase,`${a.title} · 내 기록으로 설명`,p('기록과 그림을 가리키며 친구에게 설명해요. 확인한 사실과 더 알아볼 점을 나누어요.')+(teach?`<div class="dk-ans rv">${esc(a.teacher)}</div>`:''));
    if(a.id==='classify')add('criterion','observe','기준과 근거를 다시 살펴요',p('관찰할 수 있는 한 가지 생김새 기준인가요? 가려진 부분을 없다고 단정하지 않았나요? 다른 기준의 결과는 별개로 비교해요.'));
    if(a.id==='habitat')add('environment','research',`환경과 생활을 ${ch.plantwork?'식물':'동물'}별로 설명해요`,p(ch.environmentNote||'물에 사는 동물도 생김새와 숨 쉬는 방법이 다양해요. 한 예를 모든 동물에 적용하지 않고 조사한 자료를 근거로 설명해요.'));
    if(a.id==='design')add('design-check','design','특징과 기능이 연결된 설계인가요?',p(`어떤 불편을 해결하나요? ${ch.plantwork?'식물':'동물'}의 어느 특징을 물건의 어느 부분에 이용하나요? 확인할 방법과 실제 실행 여부를 구별해요.`));
  }
  add('report','design','내 탐구보고서 정리',p('관찰·분류·환경 조사·설계와 친구 의견을 가리키며 설명해요.')+`<a class="btn" href="#/${ch.unit}/report">보고서 열기</a>`);
  [...ch.formative.items,...ch.check].forEach((k,i)=>{const q=findLifeItem(pool,k);if(!q)throw Error(`확인 문항 없음: ${k}`);add(`test${i+1}`,'check',`자료로 확인 ${i+1}/11`,lifeQuestion(observationQuestion(q,ch),i+1,teach,'dk'),{kind:q.choices?'test':'write',item:q.id,layout:'dense'});});
  add('end','check','내 활동의 근거를 확인해요',`<ul>${ch.summary.map((s)=>`<li>${esc(s)}</li>`).join('')}</ul>`+p('문제 정답만으로 실제 수행·협력적 소통을 완료 처리하지 않아요.')+`<a class="btn" href="#/${ch.unit}/daily">Daily Test</a>`);
  slides.forEach((s,i)=>{s.n=i+1;});return slides;
}
