import{FORCE_END_GUIDANCE}from'./learner-class-guidance.js?v=20261108-learner-class-guidance';
// 힘 단원의 사고력 기본 수업. 실제 활동/보고서 교재는 records-book 경로에 보존한다.
import {findLifeItem} from './book-life.js';
import {thinkingCheckQuestion as checkQuestion} from './thinking-check-question.js?v=20261102-material';
import {forceBalance} from './force-model.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const p=s=>`<p>${esc(s)}</p>`;
const table=(heads,rows)=>`<table class="dk-tbl"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>`<${i?'td':'th scope="row"'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
export function buildForceThinkingSlides(ch,art,plan,pool,mode,ix){
 ix ||= ch.forceInteraction;
 const teach=mode==='teach',S=[],phases=Object.fromEntries(plan.phases.map(p=>[p.id,p]));let ses=1;
 const add=(id,phase,title,body,extra={})=>S.push({id,phase,phaseObj:phases[phase],title,body,kind:'read',ses,...extra});
 const peek=text=>teach?`<div class="dk-ans rv">${esc(text)}</div>`:`<div class="dk-peekw"><button type="button" class="dk-peek">생각한 뒤 설명 보기</button><div class="dk-ans" hidden>${esc(text)}</div></div>`;
 add('cover','open',ch.title,`<div class="dk-art mid">${art.opener}</div>`+p('밀거나 당길 때의 변화에서 출발해 수평 모형을 비교하고, 저울과 생활 도구의 쓰임을 근거로 설명해요.'));
 if(teach)add('plan','open','예상·비교·적용 수업 계획',`<ol class="dk-plan">${plan.phases.map(x=>`<li><b>${esc(x.name)}</b><span>${x.min}분</span><em>${esc(x.aim)}</em></li>`).join('')}</ol>`);
 add('phenomenon','open','겉모습이 같으면 무게도 같을까요?',p('같은 모양의 통 두 개라도 안에 담은 것이 다를 수 있어요. 사진이나 겉모양만으로 어느 쪽이 무거운지 정하지 말고 비교할 방법을 생각해요.')+p('수레를 밀거나 당기는 것과 저울로 무게를 비교하는 것은 각각 어떤 질문에 답할까요?'));
 const options=ix.predict.options;
 const pick=teach?`<ol class="dk-tally">${options.map((s,j)=>`<li data-j="${j}"><span class="dk-tn">${j+1}</span><span class="dk-tt">${esc(s)}</span><button type="button" data-t="-" aria-label="${j+1}번 한 명 빼기">−</button><b class="dk-tc">0</b><button type="button" data-t="+" aria-label="${j+1}번 한 명 더하기">+</button></li>`).join('')}</ol>`:`<ol class="dk-choices dk-mc predict">${options.map((s,j)=>`<li><button type="button" data-j="${j}"><span>${'①②③'[j]}</span>${esc(s)}</button></li>`).join('')}</ol>`;
 add('predict','open',ix.predict.q,pick+p('예상은 관찰 전 생각이에요. 아직 정답 표시를 하지 않고 실제 비교 뒤에 설명해요.'),{kind:'predict'});
 add('scene','open','관찰 전 수평 모형 살펴보기','<div class="dk-3d" data-mount="scene" data-preview="1"></div>',{mount:'scene',kind:'scene',layout:'media'});
 add('goal','design','네 가지 질문을 연결해요',table(['질문','살필 근거'],[['밀거나 당기면 어떻게 움직일까?','행동 방향·움직임과 비교 조건'],['어느 물체가 더 무거울까?','같은 거리의 수평 비교'],['무게를 정확하게 알려면?','바르게 사용한 저울의 값·단위'],['도구는 어떤 도움을 줄까?','같은 물체·높이에서 드는 힘 비교']]),{standards:['4과01-01','4과01-02','4과01-03','4과01-04']});
 add('design','design','무게 비교와 수평 찾기는 다른 질문이에요',table(['목적','바꿀 것','확인할 조건'],[['무게 비교','비교할 두 물체','빈 수평대 수평·받침점에서 같은 거리'],['수평 찾기','한 물체의 위치','같은 물체·같은 수평대·한 위치씩 변경']])+p('다른 거리에 놓아 수평이 됐다는 사실만으로 두 물체의 무게가 같다고 할 수 있을까요?'));
 add('lab','lab','3D 실험실 · 예상한 뒤 수평 비교',p('먼저 같은 거리에서 예상→잠금 받침 빼기→관찰→표에 적기를 해요. 다음에는 한 위치만 바꿔 비교해요. 모형의 물체와 수치는 설명을 위해 정한 값이에요.')+'<div data-mount="lab"></div>',{mount:'lab',kind:'lab',layout:'fieldwork'});
 const setups=[{pair:'ab',left:3,right:3},{pair:'ab',left:4,right:2},{pair:'ac',left:3,right:3}];
 add('results','result','같은 거리와 다른 거리의 결과 읽기','<div class="dk-mylab" hidden></div>'+p('다음은 설명용 모형 자료예요. 내 표와 같은 설정이 있는지 찾아 비교해요. 실제 물체를 저울로 잰 결과가 아니에요.')+table(['물체','왼쪽 거리','오른쪽 거리','모형 결과'],setups.map(s=>{const r=forceBalance(s);return[`${r.leftName} / ${r.rightName}`,`${s.left}칸`,`${s.right}칸`,r.text]}))+peek('같은 거리에서 기울어진 쪽으로 무게를 비교해요. 가/나를 다른 거리에 놓아 수평이 된 결과는 무게가 같다는 뜻이 아니에요.'),{kind:'think'});
 add('conclusion','result','관찰 전 생각을 어떻게 고칠까요?',p(ix.predict.q)+(teach?p('처음의 손들기 예상과 관찰 근거를 비교해 설명하게 해요.'):'<div class="dk-card"><h3>관찰 전 내 예상</h3><p data-prediction-summary></p></div>')+peek('겉모습만으로 정하지 않아요. 빈 수평대를 먼저 맞추고 같은 거리에서 비교해요. 위치를 바꾼 수평은 같은 거리에서 한 무게 비교와 구별해요.'),{kind:'think'});
 ses=2;
 add('recall','concept','무게와 위치를 나누어 설명해요',p('두 물체가 수평이라는 정보만 있어요. 무게가 같은지 판단하려면 무엇을 더 알아야 할까요?')+peek('받침점에서 떨어진 두 거리와 빈 수평대 상태를 확인해요. 거리가 다르면 수평만으로 무게가 같다고 하지 않아요.'),{kind:'think'});
 add('push','concept','밀고 당길 때 무엇이 달라졌나요?',table(['가상의 같은 수레 비교','조건','관찰한 느낌'],[['가','같은 바닥·빈 수레를 천천히 출발','비교적 쉽게 움직임'],['나','같은 수레에 물건을 더 싣고 천천히 출발','더 큰 힘이 필요하다고 느낌']])+p('이 자료는 조건을 맞춘 가상 비교예요. 같은 수레라도 바퀴·바닥·움직이는 방법이 함께 달라지면 물건의 양만의 영향으로 정하기 어려워요.')+peek('민 방향과 당긴 방향, 실제 움직임을 함께 살펴요. 느낌을 실제로 재지 않은 힘 수치로 바꾸어 쓰지는 않아요.'),{kind:'think',standards:['4과01-01']});
 add('scale','concept','손 어림과 저울 값은 어떻게 다를까요?',table(['설명용 저울 표시','가','나'],[['같은 전자저울에서 확인한 값','100 g','200 g']])+p('빈 저울의 영점과 측정 범위, 물체를 놓는 방법을 확인하고 안정된 표시를 읽어요. 용수철저울은 물체를 매달아 멈춘 표시자와 눈높이를 맞춰요.')+peek('제시한 같은 조건의 표시에서는 나가 더 무거워요. g·kg 같은 단위를 함께 읽고, 실제로 재지 않았다면 내 측정값이라고 하지 않아요.'),{kind:'think',standards:['4과01-03']});
 add('tools','concept','같은 물체를 같은 높이로 옮긴다면?',table(['가상 비교','같게 둔 것','살필 차이'],[['직접 들기 / 안전하게 고정한 빗면 이용','물체·도착 높이·비슷한 속도로 천천히 움직이기','드는 힘과 이동하는 길'],['직접 들기 / 안전하게 준비한 지레 이용','같은 가벼운 물체·목표','드는 힘의 느낌과 도구의 쓰임']])+p('도구를 이용하면 드는 힘이 달라질 수 있어요. 힘이 줄어든다는 말을 움직이는 길이나 모든 일이 사라진다는 뜻으로 바꾸지 않아요.')+peek('생활 도구가 어떤 상황에서 어떤 도움을 주는지 근거를 붙여 설명해요. 무거운 물건·날카로운 도구는 직접 시험하지 않아요.'),{kind:'think',standards:['4과01-04']});
 add('apply','extend','주장을 근거로 고쳐 보세요',p('“수평이면 두 물체는 언제나 같은 무게야.” “큰 물체가 언제나 무거워.” 두 주장 중 하나를 골라 필요한 조건과 반례를 설명해요.')+peek('수평은 거리 조건도 확인해야 해요. 겉크기가 같아도 내용물이나 재료가 달라 무게가 다를 수 있어요. 자료에 없는 측정값을 만들지 않고 비교 방법을 제안해요.'),{kind:'think'});
 const keys=[...ch.formative.items,...ch.check];
 keys.forEach((key,i)=>{const q=findLifeItem(pool,key);if(!q)throw Error(`힘 사고력 확인 문항 없음: ${key}`);add(`test${i+1}`,'check',`근거로 확인하기 ${i+1}/${keys.length}`,checkQuestion(q,i+1,teach),{kind:q.choices?'test':'write',item:q.id,layout:'dense'});});
 add('end','check',FORCE_END_GUIDANCE.title,`<ul>${FORCE_END_GUIDANCE.points.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`+p(FORCE_END_GUIDANCE.afterword)+'<a class="btn" href="#/s31-u01/daily">Daily Test</a>',{kind:'end'});
 S.forEach((s,i)=>s.n=i+1);return S;
}
