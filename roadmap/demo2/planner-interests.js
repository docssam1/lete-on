/* 관심 활동에서 공부를 탐색한다. 성향·직업·실력·진도 배정과 분리한다. */
(function(global){
'use strict';
const roots=['make','puzzle','observe','express','together','visual'];
const nodes={
 make:{title:'만들고 고치기',summary:'손으로 만들거나 작동 방식을 바꿔보는 활동이에요.',next:['bridge','game']},
 puzzle:{title:'규칙과 퍼즐 찾기',summary:'어떤 규칙이 있는지, 다른 방법으로도 풀리는지 살펴봐요.',next:['pattern','logic']},
 observe:{title:'관찰하고 실험하기',summary:'달라지는 것을 관찰하고 이유를 비교해요.',next:['plants','weather']},
 express:{title:'읽고 설명하기',summary:'궁금한 것을 읽고 다른 사람이 이해하도록 표현해요.',next:['explain','story']},
 together:{title:'함께 기획하기',summary:'사람들의 생각을 듣고 필요한 일을 함께 정해봐요.',next:['event','survey']},
 visual:{title:'그림과 공간 다루기',summary:'모양과 배치를 바꾸며 생각을 눈에 보이게 나타내요.',next:['room','poster']},
 bridge:{title:'모형 다리 만들기',summary:'종이 다리의 모양과 길이를 바꿔 튼튼함을 비교해요.',next:['measure','shape'],try:'같은 재료로 모양이 다른 다리를 만들어 봐요. 무엇을 같게 두고 무엇을 바꿨는지 이야기해요.'},
 game:{title:'작은 게임 규칙 만들기',summary:'종이나 간단한 코드로 순서와 조건이 있는 게임을 생각해요.',next:['order','reason'],try:'주사위나 카드로 움직이는 규칙을 정하고 친구가 같은 규칙으로 할 수 있는지 확인해요. 코딩 도구 구매는 필요하지 않아요.'},
 pattern:{title:'수와 모양의 규칙 찾기',summary:'이어지는 수나 무늬에서 같은 점과 달라지는 점을 찾아요.',next:['reason','shape'],try:'내가 만든 규칙을 다른 사람에게 설명하고, 그 규칙이 계속 성립하는지 예를 바꿔봐요.'},
 logic:{title:'조건이 있는 퍼즐 풀기',summary:'조건을 빠짐없이 살피고 가능한 경우를 정리해요.',next:['reason','order'],try:'어떤 조건을 썼는지 표시하고 표나 그림으로 가능한 경우를 나누어 봐요.'},
 plants:{title:'식물의 변화를 비교하기',summary:'빛이나 물 등 한 조건을 달리했을 때의 변화를 관찰해요.',next:['experiment','data'],try:'안전하게 돌볼 수 있는 식물로 한 조건만 다르게 해봐요. 예상과 관찰 결과가 같은지 살펴봐요.'},
 weather:{title:'날씨 자료 살펴보기',summary:'기온이나 비의 변화를 표와 그래프로 읽어봐요.',next:['data','measure'],try:'이미 공개된 간단한 날씨 표를 보며 어떤 날이 달랐는지와 단위의 뜻을 설명해요.'},
 explain:{title:'궁금한 원리를 설명하기',summary:'읽고 이해한 내용을 그림·식·말로 다른 사람에게 알려줘요.',next:['write','reason'],try:'새로 알게 된 것 하나를 골라 예와 그림을 곁들여 설명하고 질문을 받아봐요.'},
 story:{title:'배운 내용으로 이야기 만들기',summary:'수학이나 과학에서 알게 된 내용을 짧은 이야기로 표현해요.',next:['write','data'],try:'사실과 상상을 구분하고, 이야기에서 쓴 수나 자료가 무엇을 뜻하는지 함께 설명해요.'},
 event:{title:'작은 행사 계획하기',summary:'필요한 재료·순서·예산을 생각하고 역할을 나누어 봐요.',next:['measure','order'],try:'가족 놀이처럼 작은 행사를 골라 필요한 수량과 비용을 비교해요. 돈을 쓰거나 실제 행사를 열 필요는 없어요.'},
 survey:{title:'여러 사람의 생각 비교하기',summary:'질문을 같은 방식으로 묻고 서로 다른 생각을 정리해요.',next:['data','write'],try:'가상의 응답이나 가족의 가벼운 선호를 비교해 봐요. 이름·연락처 등 개인정보를 모으지 않아도 돼요.'},
 room:{title:'방이나 놀이터 배치 그리기',summary:'길이와 모양을 살피며 쓰기 편한 공간을 그려봐요.',next:['shape','measure'],try:'가상의 방을 종이에 그리고 어떤 배치가 편리할지 비교해요. 실제 집의 주소나 도면은 필요하지 않아요.'},
 poster:{title:'설명이 잘 보이는 그림 만들기',summary:'글·그림·표를 어떻게 배치하면 이해하기 쉬울지 생각해요.',next:['write','data'],try:'하나의 정보를 글로만, 그림과 표로 각각 나타내고 어느 부분이 더 잘 전달되는지 이야기해요.'},
 measure:{title:'측정과 비율 공부',summary:'길이·단위·수량을 비교하고 비율로 관계를 설명해요.',subjects:['수학 · 측정과 단위','비·비율과 계산'],try:'활동에서 바꾼 길이나 수량을 같은 단위로 비교해요. 두 배로 바꾼 것이 무엇인지 식과 그림으로 설명해요.',next:[]},
 shape:{title:'도형과 공간 공부',summary:'모양의 성질과 넓이·배치의 관계를 그림으로 살펴봐요.',subjects:['수학 · 도형과 공간','그림·모형으로 설명'],try:'모양이나 배치를 한 가지 바꾸고 무엇이 달라지는지 그림과 말로 비교해요.',next:[]},
 reason:{title:'규칙과 논리 공부',summary:'규칙이 맞는 이유를 설명하고 다른 경우에서도 확인해요.',subjects:['수학 · 규칙과 경우 나누기','근거를 연결하는 설명'],try:'몇 가지 예에서 맞았다는 것과 항상 맞는다는 것은 어떻게 다른지 살펴봐요.',next:[]},
 order:{title:'조건과 순서 공부',summary:'일을 작은 단계로 나누고 조건에 따라 다른 방법을 골라요.',subjects:['수학 · 조건과 논리','순서·알고리즘의 기초'],try:'친구가 그대로 따라 할 수 있게 순서를 설명하고, 잘되지 않는 조건을 바꿔봐요.',next:[]},
 experiment:{title:'관찰과 실험 설계 공부',summary:'비교할 조건을 정하고 관찰에서 알 수 있는 것을 설명해요.',subjects:['과학 · 관찰과 비교','예상과 근거 설명'],try:'바꿀 조건 하나와 같게 둘 조건을 구분하고 관찰로 확인할 수 있는 질문을 골라요.',next:[]},
 data:{title:'자료와 그래프 공부',summary:'자료를 표·그림·그래프로 나타내고 무엇을 알 수 있는지 읽어요.',subjects:['수학 · 자료 해석','과학·사회 · 자료 비교'],try:'자료에서 알 수 있는 것과 아직 알 수 없는 것을 나눠 이야기해요. 그래프의 단위와 눈금도 확인해요.',next:[]},
 write:{title:'읽기와 설명 글쓰기',summary:'핵심 내용과 근거를 골라 말·글·그림으로 전달해요.',subjects:['국어·영어 · 읽기와 설명','수학·과학 · 풀이와 근거'],try:'알려주고 싶은 내용 → 쓴 근거 → 예 → 다시 확인할 점의 순서로 설명해 봐요.',next:[]}
};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function normalize(value){if(!Array.isArray(value)||!roots.includes(value[0]))return [];const out=[];for(const id of value.slice(0,3)){if(!Object.hasOwn(nodes,id)||out.includes(id)||out.length&&!nodes[out.at(-1)].next.includes(id))break;out.push(id);}return out;}
function select(value,from,to){const trail=normalize(value);if(from===null)return roots.includes(to)?[to]:trail;const at=trail.indexOf(from);return at>=0&&nodes[from].next.includes(to)?[...trail.slice(0,at+1),to]:trail;}
function detail(value,active){const trail=normalize(value),id=active===null?null:trail.includes(active)?active:trail.at(-1);if(!id)return {id:null,title:'어떤 활동이 궁금한가요?',summary:'아이가 직접 해보고 싶은 활동을 골라보세요. 성향 결과가 달라도 같은 선택지를 볼 수 있어요.',next:roots.map(id=>({id,title:nodes[id].title}))};return {id,...nodes[id],next:nodes[id].next.map(to=>({id:to,title:nodes[to].title}))};}
function renderTrail(value,active){const trail=normalize(value);if(!trail.length)return '';const selected=trail.includes(active)?active:trail.at(-1);return `<section class="pathway-trail interest-trail" aria-labelledby="interestTrailTitle"><div class="pathway-heading"><h3 id="interestTrailTitle">관심 활동에서 이어진 공부</h3><p>직접 고른 활동과 공부예요. 이전 지점도 다시 고를 수 있어요.</p></div><ol>${trail.map((id,i)=>`<li><button type="button" data-interest-open="${id}" ${selected===id?'aria-current="step"':''}><span class="pathway-point" aria-hidden="true"></span><small>${['관심 활동','해보고 싶은 일','연결해 볼 공부'][i]}</small><strong>${esc(nodes[id].title)}</strong><span class="pathway-point-summary">${esc(nodes[id].summary)}</span></button></li>`).join('')}</ol></section>`;}
function renderQuestions(value){if(!normalize(value).length)return '';const rows=[['성향 결과와 다른 활동을 좋아해도 괜찮나요?','관심 활동은 성향 결과와 별개로 직접 고를 수 있어요. 어떤 유형에도 같은 선택지를 보여줘요. 해보며 관심이 바뀌면 다른 갈림길로 돌아가도 괜찮아요.'],['이 활동을 좋아하면 관련 직업을 준비해야 하나요?','지금은 어떤 활동과 공부를 즐기는지 탐색하는 단계예요. 한 활동을 직업·전공·학교 선택으로 확정하지 않아요. 다른 활동과 학교 공부를 함께 경험할 수 있어요.'],['활동이 재미있으면 학교 공부 대신 해도 되나요?','활동과 연결되는 개념을 현재 학교 단원에서 찾아볼 수 있어요. 활동 선택만으로 교재·진도·학습량을 바꾸지 않고 학교 과제와 휴식도 함께 고려해요.']];return `<section class="pathway-parent-questions" aria-labelledby="interestQuestionsTitle"><h3 id="interestQuestionsTitle">관심 활동을 고를 때 궁금한 점</h3><div>${rows.map(([q,a])=>`<details><summary>${esc(q)}<span aria-hidden="true">+</span></summary><div class="parent-answer"><p>${esc(a)}</p></div></details>`).join('')}</div></section>`;}
Object.values(nodes).forEach(n=>{Object.freeze(n.next);if(n.subjects)Object.freeze(n.subjects);Object.freeze(n);});Object.freeze(nodes);Object.freeze(roots);
global.PlannerInterests=Object.freeze({roots,nodes,normalize,select,detail,renderTrail,renderQuestions});
})(window);
