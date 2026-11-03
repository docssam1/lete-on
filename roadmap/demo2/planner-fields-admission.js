/* 2027 preschool intake: official guide (3 pages), supplied SMS, and separate
 * Docssam teaching guidance from the supplied pre-change seminar. No test prep. */
(function(g){
'use strict';
const info={year:2027,birthYear:2021,checkedAt:'2026-11-03',center:'대치센터',
 applicationStart:'2026-11-02',applicationEnd:'2026-12-11',contactStart:'2026-12-14',classStart:'2027-01-04',
 source:'https://fieldsgood.co.kr/etc/2027_7year_Guide.pdf',apply:'https://fieldsgood.co.kr/fet/index.php?fc_ccode=F001&type=2'};
function status(day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())){
 return day>=info.classStart?'모집 종료 · 2027년 입학 안내':day<info.applicationStart?'접수 전':day<=info.applicationEnd?'접수 기간':day<info.contactStart?'접수 마감 · 상담 연락 대기':'접수 마감 · 상담 후 반 확정';
}
const posts=[
 {id:'fields-2027-entry',stage:'preschool',tag:'필즈 · 2027 입학',title:'예비7세 필즈, 별도 입학 테스트 없이 상담으로 정합니다.',focus:'2021년생 · 11/2~12/11 접수 · 12/14부터 개별 연락 · 1/4 수업 시작',body:'2027년 예비7세는 별도 입학 테스트를 진행하지 않습니다. 홈페이지에 접수하고 문자로 받은 설문을 작성한 뒤 상담으로 시간표와 입학반을 정합니다. 이 안내는 대치센터의 이번 모집에 해당합니다.',advice:'들어갈 수 있는지보다 들어간 뒤 따라갈 준비가 되었는지를 보세요. 주2회는 한글 독해와 덧뺄셈이 익숙하고, 부교재까지 공부할 시간이 있는 학생이 고려할 과정입니다. 읽기나 연산이 아직 불안하다면 그 부분부터 채우고 주1회에서 적응하는 방법도 있습니다.',questions:['주1회와 주2회 중 수업 뒤 과제까지 할 수 있는 쪽은 어느 쪽인가요?','문제를 혼자 읽고 받아올림·받아내림을 설명하며 계산하나요?','수업 중 관찰 뒤 반을 조정하는 절차와 시간표는 어떤가요?'],fieldsGuide:'entry'},
 {id:'fields-readiness',stage:'preschool',tag:'필즈 · 수업 준비',title:'테스트는 없어도, 부교재와 연산을 따라갈 준비는 해야 합니다.',focus:'지문 읽기 · 덧뺄셈 · 부교재를 혼자 풀기 · 과제 마무리',body:'필즈에서 무슨 본교재를 쓰는지만 보지 마세요. 수업을 따라가려면 부교재 문제를 읽고 풀 수 있어야 하고, 그 문제에 필요한 연산도 되어 있어야 합니다. 입학 절차가 바뀌어도 배울 내용을 감당할 준비는 남습니다.',advice:'소마와 필즈의 과제를 마치고 예습할 여력이 있다면 병행할 수 있습니다. 연산도 더 해야 하고 복습할 시간도 부족하다면 두 곳을 붙잡을 때가 아닙니다. 소마 과정에 맞춰 단단히 공부할지, 소마를 쉬고 필즈의 부교재와 연산부터 준비할지 정하세요.',questions:['지문을 읽고 무엇을 구하는지 자기 말로 설명하나요?','두 자리 수의 받아올림·받아내림을 혼자 할 수 있나요?','배운 사고력 문제의 숫자나 조건이 달라도 다시 풀 수 있나요?'],fieldsGuide:'readiness'}
];
function entryMarkup(){return `<section class="ast-fields-entry" aria-label="2027년 필즈더클래식 예비7세 입학 안내">
 <header><span>2027 예비7세 · 2021년생 · 대치센터</span><h3>별도 입학 테스트는 없습니다.</h3><p>확인일 ${info.checkedAt} · <strong>${status()}</strong></p></header>
 <ol class="ast-fields-dates"><li><strong>2026.11.2~12.11</strong><span>홈페이지 접수 → 문자로 받은 설문 작성</span></li><li><strong>2026.12.14부터</strong><span>개별 연락·상담 → 시간표와 입학반 확정</span></li><li><strong>2027.1.4</strong><span>배정반의 로드맵으로 수업 시작</span></li></ol>
 <h3>같은 본교재, 다른 수업 구성</h3><div class="ast-fields-frequency"><article><h4>주1회 · 회당 2시간</h4><p>더클래식 1~4과정의 핵심 개념을 익힙니다. 읽기나 혼자 생각할 시간이 더 필요한 학생은 수업 적응부터 잡습니다.</p></article><article><h4>주2회 · 회당 2시간</h4><p>같은 본교재에 필즈수학 부교재·경시 수업·학년별 대수 특강을 더합니다. 독해와 받아올림·받아내림이 익숙한지 봅니다. 구구단·곱셈은 선택 준비로 안내합니다.</p></article></div>
 <p>7세는 반별 약 8명이며 평일 16시 또는 18시10분 시작입니다. 정규 연습·복습에 더클셈·부교재와 선택 교과 과제가 있습니다. 결석 보완은 제공 영상으로 안내합니다.</p>
 <h3>입학 후 한 달도 준비 기간입니다.</h3><p>입학 직후 약 한 달간 수업 태도·반응·적응을 관찰하고 상담으로 반을 조정할 수 있습니다. 수업의 워밍업 활동은 서열이나 반을 정하는 주된 평가가 아닙니다.</p>
 <details><summary>공식 안내에서 제시한 준비 교재</summary><p>연산: 더클셈 1~4권.<br>사고력: 필즈 킨더 상·중·하, 이후 베이직.<br>수가르기·모으기, 덧뺄셈의 뜻, 규칙·조건·도형, 지문 읽기와 생각을 표현하는 연습을 함께 봅니다.</p></details>
 <nav class="ast-fields-links" aria-label="필즈 공식 입학 안내"><a href="${info.source}" target="_blank" rel="noopener noreferrer">공식 안내문 3쪽 보기 ↗</a><a href="${info.apply}" target="_blank" rel="noopener noreferrer">대치센터 입학예약 페이지 ↗</a><a href="tel:025667853">상담실 02-566-7853</a></nav><p>상담실 운영: 평일 13:00~21:00</p><p class="ast-fields-source">접수·설문·연락 기간은 전달받은 학원 문자, 수업 구성·준비·반 이동은 공식 안내문을 함께 확인했습니다. 다른 센터·기수는 해당 안내를 확인하세요.</p>
 </section>`;}
function readinessMarkup(){return `<section class="ast-fields-readiness" aria-label="독쌤의 필즈 수업 준비 조언">
 <h3>지금 어디까지 해야 할까요?</h3><ol class="ast-fields-checks"><li><strong>문제를 혼자 읽는 것부터입니다.</strong><p>초등 2-1 교과의 지문을 읽고 무엇을 구하는지 설명해 보세요. 숫자와 식만 보고 풀거나, 문제를 매번 읽어줘야 한다면 이 부분부터 채워야 합니다.</p></li><li><strong>부교재보다 연산이 뒤처지면 수업이 버겁습니다.</strong><p>기적의 계산법 3·4권 정도의 두 자리 덧뺄셈, 특히 받아내림을 혼자 해야 합니다. 곱셈은 구구단을 외우는 데서 끝내지 말고 같은 수를 묶고 나누는 뜻까지 연결하세요.</p></li><li><strong>배웠다는 것과 혼자 푸는 것은 다릅니다.</strong><p>초등 팩토 1·pre1031·필즈 베이직 등 현재 공부한 범위에서 조건을 바꿔도 풀 수 있는지 보세요. 규칙의 마디 끊기, 도형이 나타내는 수, 주고받기를 그림과 식으로 설명해 봅니다.</p></li></ol>
 <h3>사고력은 이 순서로 연결합니다.</h3><div class="ast-fields-route"><span>초등 팩토 1·pre1031</span><b aria-hidden="true">→</b><span>필즈 베이직</span><b aria-hidden="true">→</b><span>1031 입문·필즈 입문</span></div><p>독쌤이 제시한 준비 흐름입니다. 전부 한꺼번에 풀라는 뜻은 아닙니다. 현재 교재의 빈틈을 채우고 다음 단계로 이어가세요. 지필드 정규 과정은 베이직을 마친 뒤 1031 입문 B부터 시작하고, 입문 다음에는 1031 초급으로 연결합니다.</p>
 <aside class="ast-fields-example"><h4>교과 2-1 진행 · 기적의 계산법 3권 완료라면</h4><p>교과를 더 빨리 나가기 전에 4권의 받아내림을 다지고, 베이직의 남은 범위를 혼자 풀게 합니다. 소마와 필즈를 모두 다녀야 하는 상황은 아닙니다. 필즈를 선택한다면 소마 휴원도 고려하고, 부교재·연산·복습할 시간을 먼저 확보하세요.</p></aside>
 <h3>빠른 반을 원한다면 필요한 연산 수준을 맞추세요.</h3><p>독쌤의 E1 참고 기준은 더클셈 5권·기적의 계산법 5권 정도의 초3-1 연산입니다. 필즈 입문 부교재를 풀 때 계산에서 막히지 않도록 준비하는 수준입니다. 모든 주2회반의 공식 입학 조건으로 묶지 않고, E1처럼 빠른 학습을 원할 때 필요한 수업 준비 기준으로 봅니다.</p>
 <h3>소마와 필즈, 둘 다 해야 하나요?</h3><p>수업 과제와 예습을 마치고 국어·영어·휴식까지 가능하면 병행할 수 있습니다. 그렇지 않다면 한 곳을 중심으로 잡으세요. 소마의 반 이름을 올리는 것보다 과정에 맞춰 단단히 공부하고, 필즈를 원한다면 먼저 부교재와 연산의 수준을 맞추는 것이 좋겠습니다.</p>
 <p class="ast-fields-source">위 준비 기준은 독쌤의 설명과 상담 조언입니다. 테스트가 있던 시기의 점수·기출·모의시험 대비는 이번 입학 준비에 적용하지 않습니다. 공식 준비 안내와 주1회·주2회 선택도 함께 보세요.</p>
 </section>`;}
Object.freeze(info);posts.forEach(x=>{Object.freeze(x.questions);Object.freeze(x);});Object.freeze(posts);
g.PlannerFieldsAdmission=Object.freeze({info,posts,status,render:kind=>kind==='entry'?entryMarkup():kind==='readiness'?readinessMarkup():''});
})(window);
