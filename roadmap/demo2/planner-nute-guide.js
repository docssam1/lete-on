/* Course-specific parent guidance. Sources and the fixed-cutoff decision: roadmap/README.md. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const academies=[
 {id:'dolpa',name:'돌파수학',courses:[
  {name:'중1 시작반',range:'초5·6 교과 누적',ready:'초등 교과를 끝낸 뒤 응용 문제의 조건을 식으로 옮기고, 풀이를 혼자 마무리하는지 봅니다.'},
  {name:'공통수학1 기본 시작반',range:'중2·3 전과정',ready:'공통수학을 미리 끝내는 준비가 아닙니다. 중등 대수·함수·기하를 섞어 풀면서 비어 있는 단원과 서술을 보완합니다.'},
  {name:'공통수학2 기본 시작반',range:'공통수학1 기본 전범위',ready:'공통수학1의 개념과 유형을 공부한 뒤 살펴봅니다. 중등만 마친 아이가 바로 들어갈 과정과는 구분합니다.',cutoff:{kind:'correct',total:30,pass:20,label:'30문항 중 20문항 합격'}}
 ],advice:'새로 시작하는 반과 중간 편입은 준비할 범위가 다릅니다. 편입이라면 그 반에서 마지막으로 배운 단원까지 확인하고 준비하세요.'},
 {id:'won',name:'원수학',courses:[
  {name:'공통수학1 기본 신입',range:'중2·3 대수 · 기하 · 경우의 수',ready:'대수와 기하를 나눠 준비합니다. 총점만 보지 말고 어느 영역이 부족한지 확인하세요.',cutoff:{kind:'correct',total:50,pass:35,sections:[{name:'대수',minimum:17},{name:'기하',minimum:15}],review:32,label:'50문항 중 35문항 이상 · 대수 17문항 이상 · 기하 15문항 이상',note:'32문항 이상은 풀이 검토 대상입니다. 합격컷과 같은 뜻은 아닙니다.'}},
  {name:'중등 시작·편입',range:'지원하는 반의 현재 학기·단원',ready:'중2-1 시작과 중2-2·중3 과정 편입을 따로 봅니다. 공통수학1 신입의 범위와 컷을 중등반에 적용하지 않습니다.'},
  {name:'중등 심화듀얼 · 고등 실력듀얼',range:'중등 심화 / 공통수학1·2 기본 이후',ready:'중등 심화와 고등 실력 과정은 따로 비교합니다. 기본을 처음 배우려는지, 배운 내용을 심화하려는지부터 정하세요.'}
 ],advice:'한 학기씩 풀 때는 괜찮아도 여러 학기가 섞이면 약한 단원이 드러날 수 있습니다. 대수·기하의 약점을 각각 고친 뒤 누적 범위로 다시 풀어보세요.'},
 {id:'eden',name:'이든수학',courses:[
  {name:'중1 시작반',range:'초5·6 교과 누적',ready:'초등 고학년 개념·응용과 계산을 정리한 뒤 중등 시작반을 살펴봅니다. 초등 과정의 빈틈을 남긴 채 중등 교재만 미리 나가지는 마세요.'},
  {name:'공통수학1 기본 시작반',range:'중2·3 누적 범위',ready:'중등을 한 번 배웠다는 사실보다 혼자 풀고 설명하는 범위를 확인합니다. 중1 시작반과 필요한 준비가 다릅니다.'}
 ],advice:'기본을 처음 배우는 수업인지, 이미 배운 내용을 점검하는 수업인지 확인하세요. 숙제와 누적시험을 마친 뒤 틀린 문제를 다시 풀 시간도 남아야 합니다.'}
];
function freeze(v){if(v&&typeof v==='object'){Object.values(v).forEach(freeze);Object.freeze(v);}return v;}freeze(academies);
function render(){return `<section class="ast-nute" aria-label="누테학원 준비와 선택">
 <div class="ast-nute-route"><span>현재 진도 확인</span><i aria-hidden="true">→</i><span>시작반·편입 선택</span><i aria-hidden="true">→</i><span>부족한 단원 보완</span></div>
 <h3>중등 시작인가요, 공통수학 시작인가요?</h3>
 <div class="ast-nute-starts"><article><small>중등을 처음 배운다면</small><h4>중1 시작반</h4><p>초5·6 교과의 개념·응용·연산을 확인합니다.</p></article><article><small>중등을 공부했다면</small><h4>공통수학1 시작반</h4><p>중등 누적 범위와 혼자 해결하는 심화를 확인합니다.</p></article></div>
 <p>초등학생도 중등을 충분히 공부했다면 공통수학 시작반을 살펴볼 수 있습니다. <strong>학교 학년과 지원할 수학 과정을 따로 놓고 보세요.</strong></p>
 <h3>학원별로 어떤 과정을 살펴볼까요?</h3>
 <p>아래는 시작반과 편입을 비교할 준비 범위입니다. 지금 배우는 교재의 학기·단원과 나란히 놓고 보세요.</p>
 ${academies.map(a=>`<details class="ast-nute-academy"><summary><strong>${esc(a.name)}</strong><span>${a.courses.map(c=>esc(c.name)).join(' · ')}</span></summary><div>${a.courses.map(c=>`<article class="ast-nute-course"><h4>${esc(c.name)}</h4><p class="ast-nute-range"><b>준비 범위</b>${esc(c.range)}</p><p>${esc(c.ready)}</p>${c.cutoff?`<div class="ast-nute-cut"><b>합격 기준</b><p>${esc(c.cutoff.label)}</p>${c.cutoff.note?`<p>${esc(c.cutoff.note)}</p>`:''}</div>`:''}</article>`).join('')}<p class="ast-nute-coaching">${esc(a.advice)}</p></div></details>`).join('')}
 <aside class="ast-nute-cut-policy"><h4>컷라인은 같은 과정의 고정 기준으로 봅니다.</h4><p>해마다 바꾸어 잡지 않습니다. 학원·과정이 다르면 컷도 구분합니다. 모집 일정·시험 범위·잔여 정원은 지원할 반의 안내를 확인하세요.</p><p>합격 기준이 확인된 과정만 숫자를 표시했습니다. 반 이름이 비슷해도 다른 과정의 컷을 옮겨 쓰지 않습니다.</p></aside>
 <details class="ast-nute-hwangso"><summary>황소 고등 선발도 같은 준비인가요?</summary><p>황소 고등 선발은 고등과정에 들어가기 위한 시험입니다. 보유한 대비 시험지는 중등 대수·함수·기하의 누적 범위를 다룹니다. 고등학생만 보는 시험이나 공통수학을 끝내고 보는 시험으로 해석하지 않습니다.</p><p>황소 초등 선발, 황소 중등과정 편입, 고등과정 선발은 각각 나눠 봅니다. 이든·돌파·원수학의 누테 과정과도 별도로 비교하세요.</p></details>
 <h3>합격 준비와 입반 후 공부를 함께 잡으세요.</h3>
 <ol class="ast-nute-checks"><li><strong>지금 혼자 푸는 범위부터</strong><p>현재 교과·심화 교재의 학기와 단원을 적습니다. 틀리는 이유가 개념, 계산, 조건 읽기, 시간 부족 중 무엇인지 나눠 보세요.</p></li><li><strong>시험 범위에 맞춰 보완</strong><p>이미 아는 책을 처음부터 반복하기보다 부족한 단원을 골라 복습합니다. 풀이를 고친 뒤에는 여러 학기가 섞인 문제에서도 적용해 보세요.</p></li><li><strong>입반 뒤 한 주까지 계산</strong><p>수업·누적시험·숙제·이동에 오답을 다시 풀 시간까지 더합니다. 중학생은 내신 준비 기간의 진도와 과제 조정도 확인하세요. 국어·영어·과학과 수면을 지킬 수 있어야 오래 이어갑니다.</p></li></ol>
 </section>`;}
g.PlannerNuteGuide=Object.freeze({academies,render});
})(window);
