/* 선택형 I-Dentify 연결. 문항·계산은 기존 personality/identify-core.js와 공유한다. */
(function(global){
'use strict';
const C=global.IdentifyCore;
const groups={young:'7~9세',middle:'10~12세',high:'13~15세'};
const profiles={
 A:{title:'신중하고 꼼꼼하게 살펴보는 모습',method:'작게 나누고, 충분히 생각한 뒤 마무리해요.',actions:['익숙한 문제에서 핵심 조건과 풀이 이유를 짧게 정리해 봐요.','모르는 지점을 편하게 묻고 도움받은 뒤 다시 풀어보는 시간을 줘요.'],parent:'빠르기보다 아이가 시도한 방법과 바꾼 부분을 구체적으로 짚어 주세요.',routes:['studySolo','repair'],question:'풀이가 너무 오래 걸려요. 무조건 속도를 높여야 할까요?',answer:'개념을 생각하느라 오래 걸리는지, 알고 있는 풀이를 지나치게 길게 적는지 나누어 봐요. 익숙한 문제에서는 꼭 필요한 근거만 남기는 연습을 할 수 있어요. 성향만으로 시간 제한이나 진도 변경을 정하지 않아요.'},
 B:{title:'차분하게 관계 속에서 배우는 모습',method:'시작할 일을 작게 정하고, 배운 내용을 함께 설명해요.',actions:['시작할 문제와 마무리할 범위를 아이와 구체적으로 골라봐요.','친구나 부모에게 배운 내용을 설명하고 혼자 다시 풀어보는 공부를 비교해요.'],parent:'다른 아이와 경쟁시키기보다 아이가 이어간 작은 실천과 관심을 살펴봐 주세요.',routes:['studyTalk','studySolo'],question:'경쟁심이 적고 시작이 느린데 심화를 해도 될까요?',answer:'경쟁심과 수학 이해는 따로 살펴봐요. 시작할 일을 작게 고르고, 함께 이야기한 뒤 혼자 풀어보는 흐름을 시도할 수 있어요. 심화의 깊이는 실제 풀이와 흥미·부담을 보고 정해요.'},
 C:{title:'새로운 시도를 즐기며 움직이는 모습',method:'시도한 방법을 말하고, 짧게 확인하며 마무리해요.',actions:['여러 풀이를 시도한 뒤 조건과 계산을 다시 확인해요.','암산 뒤에는 중요한 식과 틀린 이유를 말·그림·짧은 글로 남겨봐요.'],parent:'의욕을 살리면서 시작과 마무리, 쉬는 시점을 아이와 함께 조정해 주세요.',routes:['studyTalk','repair'],question:'암산은 빠른데 풀이를 쓰지 않고 실수가 잦아요.',answer:'모든 계산을 길게 쓰도록 하기보다 답을 확인하는 데 필요한 식과 조건부터 남겨봐요. 틀렸을 때는 빠뜨린 조건·계산·설명 중 무엇을 바꿀지 짧게 이야기해요. 어려운 교재를 더하는 것만으로 해결됐다고 보지 않아요.'},
 D:{title:'이유와 원리를 깊이 알아보는 모습',method:'궁금한 이유에서 시작하고, 다른 상황에도 적용해요.',actions:['공식이 왜 성립하는지 식·그림·예로 설명해 봐요.','관심 있는 한 문제를 탐구한 뒤 다른 조건에서도 같은 방법이 되는지 비교해요.'],parent:'질문을 받아주되 학교 과제와 다른 공부를 함께 이어갈 이유도 이야기해 주세요.',routes:['inquiry','studySolo'],question:'왜 해야 하는지 납득하지 않으면 반복을 거부해요.',answer:'반복에서 무엇을 확인하려는지 먼저 이야기하고, 이미 아는 부분과 다시 확인할 부분을 나누어 봐요. 관심 있는 탐구와 필요한 기본 연습을 함께 이어갈 수 있어요. 성향 결과만으로 학교 과제나 기본기를 빼지는 않아요.'}
};
const routeMap={studySolo:['study','studySolo'],studyTalk:['study','studyTalk'],repair:['academic','balance','repair'],inquiry:['science','inquiry']};
const routeLabels={studySolo:'스스로 생각하며 공부',studyTalk:'설명하고 함께 이야기하기',repair:'필요한 부분 보완하기',inquiry:'작은 탐구에서 설명으로'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function empty(phase='idle'){return {version:1,sourceVersion:C.sourceVersion,phase,group:null,answers:[],index:0};}
function validGroup(g){return Object.hasOwn(groups,g);}
function restore(v){
 if(!v||v.version!==1||v.sourceVersion!==C.sourceVersion)return empty();
 if(['idle','group','skipped'].includes(v.phase))return empty(v.phase);
 if(!['survey','complete'].includes(v.phase)||!validGroup(v.group)||!Array.isArray(v.answers)||v.answers.length>10||v.answers.some(n=>!Number.isInteger(n)||n<0||n>3))return empty();
 if(v.phase==='complete')return C.score(v.group,v.answers)?{...empty('complete'),group:v.group,answers:v.answers.slice(),index:9}:empty();
 if(v.answers.length>=10||!Number.isInteger(v.index)||v.index<0||v.index>v.answers.length)return empty();
 return {...empty('survey'),group:v.group,answers:v.answers.slice(),index:v.index};
}
function selectGroup(v,g){return validGroup(g)?{...empty('survey'),group:g}:restore(v);}
function choose(v,n){const s=restore(v);if(s.phase!=='survey'||!Number.isInteger(n)||n<0||n>3)return s;const answers=[...s.answers.slice(0,s.index),n];return {...s,answers,index:Math.min(9,answers.length),phase:answers.length===10?'complete':'survey'};}
function previous(v){const s=restore(v);if(s.phase!=='survey')return s;return s.index>0?{...s,index:s.index-1}:empty('group');}
function result(v){const s=restore(v);return s.phase==='complete'?C.score(s.group,s.answers):null;}
function methods(v){const r=result(v);return r?[r.primaryType,...(r.isMixed?[r.secondaryType]:[])].map(type=>({type,...profiles[type]})):[];}
function route(id){return Object.hasOwn(routeMap,id)?routeMap[id].slice():null;}
function render(v,notice=''){
 const s=restore(v),r=result(s),intro='<p class="personality-intro">검사는 선택이에요. 결과 없이도 같은 로드맵을 계속 볼 수 있어요.</p>';
 let body='';
 if(s.phase==='group')body=`<h4 id="personalityFocus" tabindex="-1">기존 검사의 연령 구간을 골라주세요.</h4><p>실제 나이에 맞춰 골라주세요. 학년이나 선행 진도로 추정하지 않아요.</p><div class="personality-choices">${Object.entries(groups).map(([id,label])=>`<button type="button" data-personality-group="${id}">${label}</button>`).join('')}</div><button type="button" class="personality-quiet" data-personality-action="skip">해당 연령이 아니에요 · 검사 없이 보기</button>`;
 else if(s.phase==='survey'){
  const q=C.questions[s.group][s.index];
  body=`<p class="personality-progress">${groups[s.group]} · ${s.index+1} / 10문항</p><h4 id="personalityFocus" tabindex="-1">${esc(q.q)}</h4><div class="personality-choices">${q.options.map((o,i)=>`<button type="button" data-personality-choice="${i}" aria-pressed="${s.answers[s.index]===i}">${esc(o.text)}</button>`).join('')}</div><div class="personality-actions"><button type="button" data-personality-action="previous">${s.index?'이전 문항':'연령 구간 다시 고르기'}</button><button type="button" data-personality-action="skip">검사 없이 계속 보기</button></div>`;
 }else if(r){
  const list=methods(s),routes=[...new Set(list.flatMap(m=>m.routes))];
  body=`<p class="personality-progress">기존 I-Dentify ${groups[s.group]} · 10문항 응답</p><h4 id="personalityFocus" tabindex="-1">${r.isMixed?'두 가지 모습이 함께 나타났어요.':'이번 응답에서 이런 모습이 나타났어요.'}</h4><p class="personality-result-label">${esc(r.label)}</p><div class="personality-actions"><button type="button" data-career-open="interests">관심에서 공부·진로 연결</button><button type="button" data-flow-overview="goals">로드맵 방향 정하기</button></div><div class="personality-methods">${list.map(m=>`<article><h5>${esc(m.title)}</h5><p class="personality-method">${esc(m.method)}</p><ul>${m.actions.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p><strong>부모의 도움</strong> ${esc(m.parent)}</p></article>`).join('')}</div><p class="personality-note">유형으로 아이를 단정하지 않아요. 실제 풀이와 관심·부담을 함께 살펴보며 맞는 방법을 골라봐요.</p><h5>로드맵에서 공부 방법 살펴보기</h5><div class="personality-route-choices">${routes.map(id=>`<button type="button" data-personality-route="${id}">${esc(routeLabels[id])}</button>`).join('')}</div><p class="personality-note">누르면 공부 방법을 살펴보는 길로 이동해요. 실제 교재·진도·학습 레벨·일정은 바뀌지 않아요.</p><div class="personality-actions"><button type="button" data-personality-action="start">다시 살펴보기</button><button type="button" data-personality-action="skip">결과 연결 없이 보기</button></div>`;
 }else body=`${s.phase==='skipped'?'<p id="personalityFocus" tabindex="-1">검사 없이 로드맵을 이어보고 있어요.</p>':'<p>기존 성향분석의 10문항으로 공부를 시작하고, 생각하고, 설명하는 모습을 함께 살펴봐요.</p>'}<div class="personality-actions"><button type="button" data-personality-action="start">선택 검사 시작</button>${s.phase!=='skipped'?'<button type="button" data-personality-action="skip">검사 없이 계속 보기</button>':''}</div><p class="personality-note">기존 검사는 7~15세 구간을 제공해요. 지원 연령 밖에서도 검사 없이 공부 방법을 살펴볼 수 있어요.</p>`;
 return `<section id="personalityPanel" class="personality-panel" aria-labelledby="personalityTitle"><div class="personality-panel-heading"><h3 id="personalityTitle" tabindex="-1">우리 아이의 성향 파악</h3><span>선택</span></div>${intro}${body}${!r?'<div class="personality-actions"><button type="button" data-career-open="interests">관심에서 공부·진로 연결</button><button type="button" data-flow-overview="goals">로드맵 방향 정하기</button></div>':''}<p class="personality-status" role="status">${esc(notice)}</p></section>`;
}
function renderMap(v){
 const s=restore(v),r=result(s);if(s.phase==='idle')return '';
 const text=r?r.label:s.phase==='skipped'?'검사 없이 이어보기':s.phase==='group'?'연령 구간 선택 중':`성향 문항 ${s.answers.length} / 10 선택`;
 return `<section class="pathway-trail personality-map" aria-label="성향 참고"><div class="pathway-heading"><h3>공부 방법을 위한 성향 참고</h3></div><ol><li><button type="button" data-flow-personality><span class="pathway-point" aria-hidden="true"></span><small>${r?'선택 검사 응답에서 살펴본 모습':'검사는 선택이에요'}</small><strong>${esc(text)}</strong></button></li></ol></section>`;
}
function renderQuestions(v,trail=[]){
 const r=result(v);if(!r)return '';
 const rows=methods(v).map(m=>({q:m.question,a:m.answer}));
 if(r.isMixed)rows.push({q:'두 성향이 함께 나오면 공부 방법은 어떻게 고르나요?',a:'두 방법을 동시에 모두 적용할 필요는 없어요. 같은 단원에서 하나씩 시도하고 실제 풀이·관심·부담을 비교해 봐요. 혼합형을 평균 수준이나 능력 점수로 바꾸지 않아요.'});
 if(['boarding','international'].includes(trail[0]))rows.push({q:'이 성향이면 보딩이나 국제학교에 잘 맞는 아이인가요?',a:'성향 응답만으로 학교 적합성을 판단하지 않아요. 수업에서 질문하고 도움받는 경험, 실제 학습과 생활 부담, 아이의 관심을 함께 살펴봐요. 학교 선택이나 과목 배치는 따로 확인해요.'});
 rows.push({q:'이 결과에 맞춰 진도나 심화 수준도 바뀌나요?',a:'이 결과만으로 진도·학습 레벨·교재·학교 경로·완료 시기를 바꾸지 않아요. 실제 학습과 가능한 분량은 유지하며 먼저 공부 방법을 비교해 봐요.'});
 return `<section class="pathway-parent-questions personality-parent-questions" aria-labelledby="personalityQuestionsTitle"><h3 id="personalityQuestionsTitle">성향을 함께 살펴볼 때 궁금한 점</h3><p>이번 응답에서 나타난 모습과 현재 선택한 로드맵을 함께 살펴봐요.</p><div>${rows.map(q=>`<details><summary>${esc(q.q)}<span aria-hidden="true">+</span></summary><div class="parent-answer"><p>${esc(q.a)}</p></div></details>`).join('')}</div></section>`;
}
global.PlannerPersonality=Object.freeze({empty,restore,selectGroup,choose,previous,result,methods,route,render,renderMap,renderQuestions});
})(window);
