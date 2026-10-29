/* Current parent guidance. This module only returns data and HTML. */
(function(g){
'use strict';
const updatedAt='2026-10-29';
const guides={
 preschool:{
  stage:'preschool',updatedAt,
  label:'지금 5·6·7세라면 무엇이 달라졌을까요?',
  intro:'반 이름보다 실제 수업과 집에서 소화할 공부를 함께 살펴보세요.',
  policy:{
   effectiveAt:'2026-10-01',
   headline:'2026년 10월 1일부터 유아 모집이나 수준별 반 배정을 위한 시험·평가는 금지됩니다. 등록 후에는 보호자의 사전 동의를 받고 교육활동 지원을 위한 관찰·면담 방식의 진단을 할 수 있습니다.',
   sources:[
    {label:'학원법 제12조의2 · 2026년 10월 1일 시행',url:'https://www.law.go.kr/LSW/lsSideInfoP.do?docCls=jo&joBrNo=02&joNo=0012&lsiSeq=285147&urlMode=lsScJoRltInfoR'},
    {label:'교육부 시행령 안내 · 2026년 9월 22일',url:'https://www.korea.kr/news/customizedNewsView.do?newsId=148972427'},
    {label:'교육부 현장 점검 안내 · 2026년 10월 14일',url:'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=107424&lev=0&m=020402&s=moe'}
   ]
  },
  items:[
   {id:'registration',question:'입학시험이 없으면 무엇을 확인해야 하나요?',answer:'등록 전 선발과 등록 후 배움을 돕는 관찰은 목적이 다릅니다. 수업에서 배우는 내용, 과제량, 설명과 피드백을 확인하고 교과·연산을 챙길 시간도 함께 보세요.',options:['등록 방식과 동의 내용 확인','수업·과제·피드백 비교','현재 교과·연산 시간 유지']},
   {id:'pre-course',question:'프리 수업을 두 곳 다녀야 할까요?',answer:'놓칠까 불안해 수업을 늘리기보다 영어·수학·이동·숙제·휴식을 한 주에 놓아 보세요. 한 곳을 경험한 뒤 복습할 여력이 있는지 보고, 추가 여부를 골라도 됩니다.',options:['현재 공부를 유지하며 기다리기','한 곳 경험한 뒤 부담 비교','다른 과목과 휴식부터 조정']},
   {id:'enrollment',question:'프리에 등록하면 정규 수업도 정해지나요?',answer:'체험 수강, 우선 신청, 응시 기회 안내와 정규 등록은 서로 다릅니다. 향후 절차는 대상 연령과 목적도 확인하고, 지금 수강으로 무엇이 정해지는지 문서로 살펴보세요.',options:['체험하는 내용 확인','우선 신청의 범위 확인','정규 등록 조건 확인']},
   {id:'actual-books',question:'같은 7세반이면 진도도 비슷할까요?',answer:'지점과 반에 따라 책과 배우는 범위가 다를 수 있습니다. 실제 교재·단원·부교재를 보고, 혼자 푸는 부분과 도움을 받는 부분을 나누어 다음 공부를 고르세요.',options:['현재 책과 단원 살펴보기','어려운 개념 다시 설명하기','부교재와 가정 과제량 비교']},
   {id:'home-support',question:'어려운 문제를 집에서 매번 설명해야 하나요?',answer:'설명을 못 해준다고 새 수업을 바로 더할 필요는 없습니다. 질문할 문제를 표시하고 교사 설명이나 풀이 영상을 활용해 보세요. 답을 본 뒤 혼자 다시 적용하는지도 살펴봅니다.',options:['교사에게 질문할 부분 고르기','영상 뒤 비슷한 문제 다시 보기','새 문제보다 복습 시간 확보']},
   {id:'announcements',question:'설명회나 반 편성 안내가 아직 없어요.',answer:'다른 지점 이야기나 예상 날짜로 시간표를 확정하지 마세요. 해당 지점의 공식 안내를 기다리며 현재 공부를 이어가고, 공지가 나오면 수업 목적·시간·과제를 함께 비교하세요.',options:['공식 안내와 대기 상태 확인','현재 공부와 생활 유지','안내 후 실제 시간표 비교']}
  ]
 },
 elementary:{
  stage:'elementary',updatedAt,
  label:'초등에서 다음 공부를 고를 때',
  intro:'다음 반과 새 교재를 고르기 전에 현재 풀이와 한 주의 공부량을 함께 봅니다.',
  items:[
   {id:'move-or-keep',question:'황소에 합격하면 바로 옮기는 게 좋을까요?',answer:'합격과 실제 수강 선택은 나누어 보세요. 지금 공부와 겹치는 범위, 필요한 반복, 숙제와 오답 관리, 이동시간을 비교하면 유지할지 옮길지 판단하기 쉽습니다. 시험 직전에는 새 문제를 늘리기보다 컨디션과 익숙한 풀이를 챙겨도 좋습니다.',options:['현재 수업과 교재 유지','수업·과제를 경험하며 비교','교과·심화를 다른 방식으로 연결']},
   {id:'depth-or-next',question:'공통수학 쎈을 더 복습할까요, 대수로 갈까요?',answer:'현재 범위에서 혼자 설명하고 해결하는 부분과 반복해서 막히는 유형을 나누어 보세요. 같은 반 이름이어도 기본·실력 병행, 심화 문제, 클리닉과 오답 관리가 다를 수 있습니다. 다음 과정의 선수 개념과 실제 과제량을 확인해 고릅니다.',options:['쎈의 어려운 유형·오답 보완','다음 과정의 개념 수업 비교','교재·과제·클리닉 확인 후 결정']},
   {id:'calculation-or-reading',question:'틀리는 이유가 계산인지 문제 읽기인지 모르겠어요.',answer:'연산의 진도가 앞서 있어도 정확하게 적용하는지는 따로 봅니다. 문제의 조건을 그림이나 식으로 옮긴 뒤 계산하고 답을 확인하는 과정을 살펴보세요. 개념을 모르는 문제와 읽다가 조건을 빠뜨린 문제도 필요한 복습이 다릅니다.',options:['교과 개념을 말로 설명','계산의 정확성과 속도 점검','조건을 그림·식으로 옮기기']},
   {id:'language-load',question:'국어·영어와 수학을 함께 챙기기 벅차요.',answer:'새 수업의 횟수만 비교하기보다 독서·쓰기·단어·수학 오답에 드는 시간을 함께 보세요. 중학교 준비를 더한다면 배정 학교와 현재 독서·언어 공부의 역할도 나누어 볼 수 있습니다. 한 과목을 늘릴 때 다른 과목의 복습이 사라지지 않는지 살펴보세요.',options:['현재 독서·언어 공부 유지','학교 내신 준비를 필요한 만큼 연결','총 과제량을 보고 횟수 조정']},
   {id:'contest-or-course',question:'교과가 앞서면 경시나 KMO도 시작해야 할까요?',answer:'앞선 진도만으로 경시 수업을 정할 필요는 없습니다. 아이가 어려운 문제를 생각하고 설명하는 경험을 원하는지, 국어·영어·과학과 휴식을 유지할 수 있는지 함께 보세요. 장거리 수업을 고를 때는 이동뿐 아니라 집에서 오답을 챙길 시간도 포함합니다.',options:['기존 과목을 유지하며 경시 경험','개념·서술형 풀이부터 보완','수업·이동·복습 시간을 비교']}
  ]
 },
 middle:{
  stage:'middle',updatedAt,
  label:'중등에서 진도와 내신을 함께 살필 때',
  intro:'학교 공부, 다음 과정, 과목별 복습 시간을 나누어 현재 생활에 맞는 선택을 살펴봅니다.',
  items:[
   {id:'school-priority',question:'학기 중에는 내신과 국·영·수를 먼저 챙길까요?',answer:'학교에서 배운 내용을 소화하고 과제와 시험 준비를 할 시간을 먼저 놓아 보세요. 새 선행 수업을 추가했을 때 현재 교과의 오답과 국어·영어 복습이 밀린다면 시기나 횟수를 조정할 수 있습니다. 학기 중과 방학의 공부량이 같을 필요도 없습니다.',options:['학교 교과와 국·영·수부터 안정','추가 수업의 횟수 조정','방학에 다음 과정 경험']},
   {id:'math-depth',question:'중등수학을 한 번 봤으면 다음 진도로 갈까요?',answer:'어느 범위를 공부했는지와 개념을 설명하고 서술형으로 풀 수 있는지는 따로 봅니다. 다음 진도, 현재 범위 심화, 개별 보완 중 필요한 역할을 골라 보세요. 누적테스트가 있는 수업도 오답을 누가 어떻게 챙기는지 확인하는 편이 좋습니다.',options:['현재 개념·서술형 보완','다음 과정의 개념 수업','오답 관리와 가정 복습 확인']},
   {id:'science-next',question:'중등과학 다음에 무엇을 공부하면 좋을까요?',answer:'통합과학, 물리·화학의 연결 과정, 개별 과학 과목은 배우는 목적이 다릅니다. 현재 과학의 이해와 목표, 국·영·수 부담을 함께 놓고 비교해 보세요. 이름만으로 순서를 고정하기보다 수업에서 실제로 다루는 단원과 필요한 개념을 확인합니다.',options:['중등의 약한 영역 복습','통합과학·연결 과정 비교','관심 과목을 방학에 경험']},
   {id:'science-math',question:'과학 진도를 수학에 맞춰 늦춰야 하나요?',answer:'수학과 과학의 진도를 한꺼번에 올리거나 내리기보다 다음 과학 단원에 필요한 계산·식·그래프를 살펴보세요. 부족한 수학 개념만 함께 보완할 수도 있습니다. 지금 배우는 과학 교재와 수업의 범위를 기준으로 다음 단계를 고릅니다.',options:['필요한 수학 개념 함께 보완','현재 과학 범위 복습','다음 단원의 준비 정도 확인']},
   {id:'sustainable-plan',question:'좋다는 수업이 멀어도 옮기는 게 좋을까요?',answer:'수업의 교재와 설명, 숙제, 클리닉뿐 아니라 왕복 이동과 집에서 다시 풀 시간을 함께 비교해 보세요. 지역 수업에 부족한 부분만 보완하는 방법도 있습니다. 수업 뒤 아이가 혼자 적용하고 질문할 수 있는지가 선택을 돌아보는 기준이 됩니다.',options:['지역 수업과 개별 보완 병행','새 수업의 관리 방식 확인','이동·과제·복습의 총시간 비교']}
  ]
 }
};
function freeze(value){
 if(value&&typeof value==='object'&&!Object.isFrozen(value)){
  Object.values(value).forEach(freeze);
  Object.freeze(value);
 }
 return value;
}
freeze(guides);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function data(stage){return typeof stage==='string'&&Object.hasOwn(guides,stage)?guides[stage]:null;}
function render(stage,{compact=false,historical=false}={}){
 const guide=data(stage);
 if(!guide)return '';
 const history=historical?'<span class="cnu-history">합격까지의 과거 공부를 참고하되 지금은 등록·수업 선택을 따로 봅니다.</span>':'';
 const policy=guide.policy?`<div class="cnu-policy"><p>${esc(guide.policy.headline)}</p><details class="cnu-sources"><summary>현재 제도 안내와 공식 자료</summary><div class="cnu-source-body"><p>수업의 이름보다 모집·배정의 목적과 실제 진행 방식을 확인해 보세요.</p><ul>${guide.policy.sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}<span class="cnu-link-hint">새 창</span></a></li>`).join('')}</ul></div></details></div>`:'';
 return `<details class="cnu${compact?' cnu-compact':''}${historical?' cnu-historical':''}" data-cnu-stage="${esc(stage)}"><summary class="cnu-summary"><span class="cnu-summary-label">${esc(guide.label)}</span>${history}</summary><div class="cnu-body"><p class="cnu-intro">${esc(guide.intro)}</p>${policy}<div class="cnu-items">${guide.items.map(item=>`<details class="cnu-item"><summary>${esc(item.question)}</summary><div class="cnu-answer"><p>${esc(item.answer)}</p><p class="cnu-options-label">이렇게 살펴볼 수 있어요</p><ul class="cnu-options">${item.options.map(option=>`<li>${esc(option)}</li>`).join('')}</ul></div></details>`).join('')}</div><p class="cnu-updated"><time datetime="${updatedAt}">2026.10.29 기준</time></p></div></details>`;
}
g.PlannerCounsellingUpdates=Object.freeze({data,render});
})(window);
