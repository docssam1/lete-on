/* Parent guidance only: no admissions verdicts, calendar assignments or curriculum mutations. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const posts=[
 ['gifted-start','elementary','영재원 · 처음 준비','영재원 준비, 지금 공부에 무엇을 더할까요?','교과·사고력·심화·연산은 유지하고 대비를 추가합니다.','영재원은 수학·과학·융합 등 관심 분야를 더 깊게 공부하는 기회로 살펴보세요. 학습 레벨이나 선행 진도 하나만으로 지원 여부를 정하지 않고, 현재 풀이와 설명하는 모습부터 보겠습니다.','선행이 빠르더라도 조건을 놓치거나 풀이를 쓰기 어려우면 그 부분을 함께 연습해야 합니다. 반대로 진도가 아주 빠르지 않아도 지금 배운 내용을 깊게 생각하고 설명하는 아이는 해당 기관의 지원 요건을 확인해 볼 수 있습니다.',['현재 학년과 지원할 과정의 학년을 구분했나요?','수학·과학 중 스스로 생각하고 설명하는 분야는 무엇인가요?','기존 공부에 대비 시간을 더할 수 있나요?'],'overview'],
 ['gifted-education','elementary','영재원 · 교육청','교육청 영재원, 어디부터 확인할까요?','지원 학년·지역 → 평가 방식 → 교재와 연습','교육청 영재원도 지역과 분야에 따라 모집 대상과 평가가 다릅니다. 먼저 우리 아이가 지원할 수 있는 기관과 과정을 찾고, 그 과정에서 무엇을 평가하는지 확인하세요.','경쟁률이 낮아 보인다는 이유만으로 과학을 고르기보다, 수학과 과학 중 낯선 문제에도 시도하고 자기 풀이를 설명할 수 있는 분야를 봅니다. 수·과학 융합 과정이라면 한 과목만 준비하지 않도록 평가 구성을 확인하세요.',['현재 재학·거주 지역이 지원 요건에 맞나요?','수학·과학을 함께 평가하나요, 분야별로 평가하나요?','학생 지원과 교사 추천의 마감이 각각 언제인가요?'],'education'],
 ['gifted-university','elementary','영재원 · 대학부설','교육청 다음에는 꼭 대학부설로 가야 할까요?','정해진 승급 순서보다 기관별 지원 요건과 수업','교육청에서 탐구 경험을 쌓고 대학부설로 이어가는 사례가 있습니다. 그렇다고 모든 대학부설 영재원이 교육청 수료를 필수로 요구하는 것은 아닙니다. 희망하는 기관의 신입·심화·사사 과정과 지원 자격을 각각 봅니다.','이름을 올리는 것보다 실제로 어떤 수업과 탐구를 하는지가 중요합니다. 수업일·이동·과제·발표까지 확인하고, 아이가 직접 해보고 설명할 수 있는 공부인지 살펴보세요.',['이전 영재원 수료가 필수인가요, 별도 전형 조건인가요?','서류·선교육·지필·면접 중 무엇을 준비하나요?','학교·학원과 수업일·탐구 과제가 겹치지 않나요?'],'university'],
 ['gifted-books','elementary','영재원 · 교재와 공부','맛있는 영재와 100제, 모두 해야 하나요?','유형 연습과 실전 점검의 역할을 나눕니다.','교재를 여러 권 사기 전에 지원 분야와 평가 방식을 먼저 확인하세요. 지금 풀고 있는 책이 있다면 남은 기간에 끝낼 수 있는 분량과 답안을 쓰는 모습을 보고 다음 책을 고르겠습니다.','100제를 이미 공부했다면 같은 역할의 책을 더 쌓기보다 필요한 모의고사로 적용을 확인할 수 있습니다. 처음 보는 유형이라면 설명을 듣고 예시를 익힌 뒤 다른 문제를 혼자 풀어보세요. 영상 시청만으로 연습을 마친 것으로 보지는 않습니다.',['책의 대상 학년·교육과정·지원 분야가 맞나요?','개념이 부족한가요, 답안을 쓰는 방법이 낯선가요?','실전 점검 뒤 다시 풀고 고칠 시간이 있나요?'],'books'],
 ['gifted-after','elementary','영재원 · 합격 이후','합격 뒤에는 어떤 공부가 남을까요?','교과·사고력과 탐구·발표를 나란히 이어갑니다.','합격이 공부의 끝은 아닙니다. 학교와 학원에서는 교과·심화를 이어가고, 영재원에서는 질문을 만들고 시도한 과정을 설명하는 경험을 쌓습니다.','한 번의 선발 결과로 다음 공부를 닫지는 않겠습니다. 탈락했다면 조건 읽기·개념 적용·서술에서 보완할 부분을 찾고, 합격했다면 수업과 과제를 소화하며 자기 생각을 남기는지 보세요.',['탐구에서 아이가 직접 정한 질문은 무엇인가요?','예상과 달랐을 때 무엇을 바꿔 보았나요?','발표 뒤 새로 궁금해진 내용을 남겼나요?'],'after'],
 ['gifted-middle','middle','영재원 · 영재학교·과학고 준비','중등 영재원, 목표 공부와 어떻게 병행할까요?','내신·수학 선행·과학 기본에 탐구와 설명을 더합니다.','우리 로드맵에서는 중등 영재원을 영재학교·과학고 대비 경로에서 연결합니다. 이는 학습 계획의 기준이며, 실제 기관의 지원 자격을 제한한다는 뜻은 아닙니다.','수상이나 수료 이력을 늘리는 목표로만 잡지는 마세요. 낯선 문제에 접근한 이유, 실험과 자료를 해석한 과정, 실패 뒤 수정한 생각을 자기 말로 설명하는 공부로 연결하겠습니다.',['학교 내신과 수학 선행을 유지할 수 있나요?','현재 과학 기본에서 설명하기 어려운 단원은 무엇인가요?','탐구·서술을 기존 공부에 더할 시간이 있나요?'],'middle'],
 ['gifted-middle-after','middle','영재원 · 탐구와 발표','탐구 보고서, 어려운 주제여야 할까요?','직접 한 질문·시도·해석이 드러나는 기록','어려운 주제를 골랐다는 것보다 학생이 실제로 무엇을 궁금해했고 어떻게 확인했는지가 중요합니다. 알고 있는 개념에서 출발해 바꿔 본 조건과 결과를 기록하세요.','완성된 보고서를 외워 발표하기보다 왜 그 방법을 골랐는지, 예상과 다른 결과는 무엇인지, 다시 한다면 무엇을 바꿀지를 설명해 보세요. 제출물의 형식과 허용 자료는 기관 안내를 따릅니다.',['직접 한 일과 도움받은 일을 설명할 수 있나요?','결과를 뒷받침하는 표·그림·관찰이 있나요?','결과만 나열하지 않고 이유와 한계를 썼나요?'],'after']
].map(([id,stage,tag,title,focus,body,advice,questions,giftedGuide])=>({id,stage,tag,title,focus,body,advice,questions,giftedGuide}));
const books=[
 {title:'안쌤의 맛있는 영재 수학·과학',role:'학년별 교과 개념을 활용한 창의사고력·문제해결 연습',how:'지원 분야에 필요한 책을 고릅니다. 모르는 개념은 정규 교재에서 보완한 뒤 문제로 돌아오세요.',url:'https://anssamedu.com/list.php?category=4&sort_how=brand&sort_product=new_product'},
 {title:'안쌤의 STEAM+창의사고력 수학·과학 100제',role:'다양한 사고력 유형과 설명·서술 연습',how:'전권을 필수로 추가하지 않습니다. 이미 공부 중이라면 부족한 유형과 답안 쓰기를 중심으로 이어갑니다.',url:'https://www.sdedu.co.kr/book/list.php?cat_id=005003010'},
 {title:'맛있는 영재 모의고사 · 영재성검사·창의적 문제해결력 모의고사',role:'평가 형식·시간 배분·답안 작성 점검',how:'기관의 평가 유형과 책의 대상 학년을 맞춥니다. 모의고사 점수를 기관 합격컷으로 바꾸지 않습니다.',url:'https://anssamedu.com/list.php?category=4&sort_how=brand&sort_product=new_product'}
];
const timeline=[
 {when:'지금',title:'현재 공부와 지원 대상 확인',text:'교과·사고력·심화·연산을 그대로 이어갑니다. 지원 학년·지역·분야와 추가로 공부할 시간을 확인합니다.'},
 {when:'모집 공고 확인 후',title:'평가에 맞는 연습 추가',text:'지필·서술이면 문제 접근과 답안 작성, 선교육·과제면 실제 참여와 과제 해결, 면접이면 자신의 생각을 설명하는 연습을 더합니다.'},
 {when:'평가 전',title:'실전 점검과 부족한 부분 보완',text:'처음 보는 문제를 혼자 풀고 시간이 걸린 부분과 빠뜨린 조건을 봅니다. 새 책을 한꺼번에 늘리기보다 틀린 문제를 다시 풀고 답안을 고칩니다.'},
 {when:'결과 확인 후',title:'합격은 수업으로, 탈락은 보완으로',text:'합격했다면 탐구·발표 과제를 기존 공부와 나란히 잡습니다. 탈락했더라도 학습은 이어가며 다음 지원 기회는 새 모집요강을 보고 정합니다.'}
];
const sources=[
 {label:'GED 선발 공고 · 기관별 모집요강',url:'https://ged.kedi.re.kr/slct/noti/slctNotiStat.do'},
 {label:'GED 영재교육기관알리미',url:'https://ged.kedi.re.kr/eduIns/eduInsList.do'},
 {label:'안쌤 영재교육연구소 · 대비 교재 안내',url:'https://anssamedu.com/list.php?category=4&sort_how=brand&sort_product=new_product'},
 {label:'시대에듀 · 100제 교재 안내',url:'https://www.sdedu.co.kr/book/list.php?cat_id=005003010'}
];
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}[posts,books,timeline,sources].forEach(freeze);
function links(){return `<details class="ast-gifted-sources"><summary>모집요강과 교재 안내 열기</summary><ul>${sources.map(s=>`<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)} ↗</a></li>`).join('')}</ul><p>지원 자격·일정은 기관의 해당 모집 학년도 안내를 봅니다. 교재는 대상 학년과 판본을 확인하세요. 링크는 접수·추천을 대신하지 않습니다.</p></details>`;}
function admission(){return `<div class="ast-gifted-checklist"><h3>공고에서 이 네 가지를 확인하세요.</h3><dl><div><dt>지원 대상</dt><dd>현재 학년 · 입학 후 과정 학년 · 재학·거주 지역</dd></div><div><dt>지원 절차</dt><dd>학생 지원 · 교사 추천 · 학교 추천 · 서류 제출</dd></div><div><dt>평가 방식</dt><dd>영재성검사 · 창의적 문제해결력 · 선교육·과제 · 면접</dd></div><div><dt>입학 후 생활</dt><dd>수업일 · 이동 · 탐구 과제 · 출석·수료 기준</dd></div></dl><p>예를 들어 현재 초3이 다음 학년도 초4 과정을 지원할 수 있는지는 기관 요강을 봅니다. ‘초4 과정’이라는 이름만 보고 현재 초4만 지원한다고 해석하지 마세요. 중복지원·이중등록·추천 조건도 기관별로 확인합니다.</p></div>`;}
function bookMarkup(){return `<section class="ast-gifted-books"><h3>교재는 역할을 나눠 고르겠습니다.</h3>${books.map((b,i)=>`<article><small>0${i+1} · ${esc(b.role)}</small><h4>${esc(b.title)}</h4><p>${esc(b.how)}</p><a href="${esc(b.url)}" target="_blank" rel="noopener noreferrer">교재 안내 보기 ↗</a></article>`).join('')}<aside class="ast-gifted-note"><h4>정규 과학과 영재원 대비는 따로 이어갑니다.</h4><p>줄기과학·오투·하이탑·세페이드는 과학 개념과 심화의 흐름입니다. 영재원 문제집이 그 기본 공부를 대신하지 않습니다. 지금 선택한 과학 과정은 유지하고, 지원 분야에 필요한 대비만 추가합니다.</p><p>정보·발명·융합 분야는 해당 평가에 맞는 자료를 고릅니다. 수학·과학 대비책을 모든 분야에 똑같이 배정하지 않습니다.</p></aside></section>`;}
function plan(){return `<section><h3>준비부터 결과 이후까지</h3><ol class="ast-gifted-timeline">${timeline.map(t=>`<li><small>${esc(t.when)}</small><div><h4>${esc(t.title)}</h4><p>${esc(t.text)}</p></div></li>`).join('')}</ol><p>위 순서는 준비할 일을 정리한 상담 흐름입니다. 접수월·시험일이나 교재 완료월을 일괄 배정한 일정은 아닙니다.</p></section>`;}
function comparison(){return `<div class="ast-gifted-compare"><article><small>교육청·교육지원청</small><h4>지역과 지원 분야부터</h4><p>모집 대상과 평가 구성을 확인하고, 교과 적용·사고력·서술을 준비합니다. 모든 지역이 같은 시험을 보는 것으로 묶지 않습니다.</p></article><article><small>대학부설</small><h4>지원 전형과 탐구 과정부터</h4><p>신입·심화·사사 과정의 요건을 각각 봅니다. 서류·선교육·지필·면접의 구성은 기관마다 확인합니다.</p></article></div>`;}
function stages(){return `<section><h3>지금 학년에서는 무엇을 챙길까요?</h3><details><summary>초1·2 · 교과·읽기·사고력의 바탕</summary><p>읽기·교과·사고력의 바탕을 꾸준히 다집니다. 문제를 읽고 조건을 말하는 것, 그림과 식으로 생각을 옮기는 것, 배운 개념을 다른 문제에 쓰는 것을 꾸준히 합니다. 책·관찰·대화에서 생긴 질문도 남겨보세요.</p></details><details><summary>초3·4 · 첫 지원과 답안 쓰기</summary><p>지원 가능한 과정이 있다면 현재 학년의 개념을 적용한 문제와 창의적 문제해결 유형을 접합니다. 정답만 적지 않고 생각한 순서와 근거를 씁니다. 과학은 관찰·실험·자료를 읽고 ‘왜 그렇게 생각했는지’ 설명합니다.</p></details><details><summary>초5·6 · 기관 선택과 탐구의 깊이</summary><p>교과 선행·심화는 이어가며 수학·과학 중 관심과 준비가 있는 분야를 비교합니다. 대학부설을 생각한다면 실제로 해본 탐구와 풀이를 자기 말로 설명하고, 수업·과제까지 기존 공부에 더할 수 있는지 봅니다.</p></details></section>`;}
function after(){return `<section><h3>탐구는 이 순서로 남겨보세요.</h3><div class="ast-gifted-route"><span>궁금한 점</span><span>예상·방법</span><span>관찰·시도</span><span>해석·수정</span><span>다음 질문</span></div><p>수학이라면 조건을 바꿔 규칙이 유지되는지 확인하고, 과학이라면 바꾼 조건과 같게 둔 조건을 구분해 결과를 비교합니다. 예상과 다른 결과도 지우지 말고 이유를 생각해 보세요.</p><p>선배 사례에도 초3 선발에서 탈락한 뒤 교과·사고력과 탐구를 이어가 다음 해 합격한 경우가 있습니다. 특정 기관 수료를 모든 영재학교·과학고의 필수 조건으로 만들지는 않습니다.</p></section>`;}
function render(mode='overview'){
 if(!['overview','education','university','books','after','middle'].includes(mode))return '';
 const policy='<aside class="ast-gifted-policy"><strong>기존 공부는 그대로, 영재원 대비는 추가로.</strong><p>교과·사고력·심화·연산의 진도와 진행 속도는 유지합니다. 대비 교재·탐구·서술 준비는 별도 시간에 더합니다.</p></aside>';
 let body='';
 if(mode==='overview')body=comparison()+stages()+plan();
 if(mode==='education')body=admission()+`<h3>문제 수보다 답안을 확인하세요.</h3><p>수학은 조건을 정리하고 풀이의 이유를, 과학은 개념과 자료에 근거한 설명을 연습합니다. 면접·창의인성 평가가 있다면 실제 형식에 맞춰 준비하세요. ‘면접’이 항상 말로만 답하는 평가라는 뜻은 아닙니다.</p>`+plan();
 if(mode==='university')body=admission()+`<h3>교육청 → 교대 → 연대, 정해진 순서는 아닙니다.</h3><p>기관을 옮겨 가며 탐구를 이어간 선배는 있지만 모든 학생이 같은 순서를 밟을 필요는 없습니다. 현재 수업에서 충분히 배우고 있다면 유지할 수 있고, 다른 기관을 원한다면 해당 신입 과정이나 수료 요건을 확인합니다.</p>`+after();
 if(mode==='books')body=bookMarkup()+`<h3>평가까지 한 달 남았다면</h3><p>100제와 맛있는 영재 전권을 새로 시작하는 계획은 피합니다. 이미 공부한 유형을 점검하고, 평가에 맞는 모의고사를 풀어본 뒤 막힌 개념과 답안 표현을 보완하세요. 강의를 볼 때도 필요한 설명만 듣고 다른 문제를 혼자 풀어봅니다.</p>`;
 if(mode==='after')body=after()+`<h3>합격 뒤 첫 학기</h3><p>수업 후 알게 된 점과 새 질문을 짧게 남깁니다. 탐구·발표 과제는 별도 시간에 잡고 교과·심화·사고력·연산은 이어갑니다. 과제를 대신 완성해 주기보다 아이가 질문하고 도움받은 뒤 스스로 설명하게 해주세요.</p>`;
 if(mode==='middle')body=`<div class="ast-gifted-middle"><h3>중등에서는 이렇게 병행합니다.</h3><dl><div><dt>학교 내신</dt><dd>시험 준비 기간에는 학교 수업·서술형·수행평가를 챙깁니다.</dd></div><div><dt>수학</dt><dd>현재 교과 선행과 심화를 유지하고, 낯선 문제의 접근·근거·풀이를 점검합니다.</dd></div><div><dt>과학</dt><dd>기본 개념과 실험·자료 해석을 먼저 다집니다. 중등 기본이 남아 있으면 세페이드부터 시작하지 않습니다.</dd></div><div><dt>영재원 대비</dt><dd>기관 평가에 맞는 문제해결·탐구·서술·면접을 별도로 추가합니다.</dd></div></dl><p>영재학교·과학고를 목표로 한다고 모든 영재원에 지원할 필요는 없습니다. KMO 수상이나 영재원 수료를 합격 보장으로 설명하지 않습니다.</p></div>`+admission()+after();
 return `<section class="ast-gifted" aria-label="영재원 준비와 선택">${policy}${body}${links()}</section>`;
}
g.PlannerGiftedGuide=Object.freeze({posts,books,timeline,sources,render});
})(window);
