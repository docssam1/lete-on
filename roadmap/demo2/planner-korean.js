/* Korean curriculum: editorial adaptation of the supplied EBS middle-school
 * roadmap. Dates describe study periods, never completed books or predicted
 * scores. Book stages are examples to place after checking actual reading.
 * No lecture counts or copyrighted passages are copied into the product. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SOURCES={
 ebsLiterature:{title:'EBS · 필독 중학 국어 문학',url:'https://mid.ebs.co.kr/course/view?courseId=100004452&left=series'},
 ebsButterfly:{title:'EBSi · 개념의 나비효과 입문편',url:'https://www.ebsi.co.kr/ebs/lms/lmsx/retrieveSbjtDtl.ebs?courseId=S20240000822'},
 summaReading:{title:'이룸이앤비 · 중학 국어 비문학 독해',url:'https://www.erumenb.com/book/?code=S200K01001000015&school=2&section=1'}
};
const BOOKS={
 koreanThought:{subject:'korean',title:'EBS 중학 국어 생각독해 · 현재 난도에 맞는 한 권',note:'1~5권 가운데 새 지문을 혼자 읽고 근거를 찾을 수 있는 범위부터 고릅니다. 학년이 바뀌었다고 앞 권을 마친 것으로 처리하지 않습니다.'},
 koreanLiterature:{subject:'korean',title:'EBS 필독 중학 국어 문학 · 현재 난도에 맞는 한 권',source:'ebsLiterature',note:'현대시·현대소설·고전시가·고전소설을 다루는 한 과정입니다. 영역마다 같은 책을 따로 추가하지 않고, 배운 개념을 새 작품에 적용합니다.'},
 koreanSumma:{subject:'korean',title:'숨마주니어 중학 국어 비문학 독해 연습 · 한 권 선택',source:'summaReading',note:'현재 독해서 대신 고를 수 있는 대안입니다. 같은 역할의 생각독해·필독 비문학을 모두 더하지 않습니다. 지문 읽기·근거 확인·오답 수정 시간을 함께 잡습니다.'},
 koreanButterfly:{subject:'korean',title:'윤혜정의 개념의 나비효과 입문편·워크북',source:'ebsButterfly',note:'중등 개념을 낯선 글에 적용할 수 있을 때 고등 입문으로 연결합니다. 필요한 개념을 공부하고 워크북으로 확인하며, 전 강좌를 정해진 두 달 안에 몰아 듣지 않습니다.'}
};
const PERIODS={regular:'학기 중',vacation:'방학',exam:'학교 시험 준비',transition:'중3 기말 이후'};
const area=(material,scope,method,check,weekly)=>({material,scope,method,check,weekly});
function supported(c){return !c.foreignCalendar&&Number.isInteger(Number(c.grade))&&Number(c.grade)>=7&&Number(c.grade)<=9;}
function at(c,offset=0){
 const y=Number(c.year),m=Number(c.mon),grade=Number(c.grade);
 if(!Number.isInteger(y)||y<2020||y>2100||!Number.isInteger(m)||m<1||m>12||!Number.isInteger(grade))return null;
 const serial=y*12+m-1+offset,year=Math.floor(serial/12),month=serial%12+1;
 const schoolYear=year-(month<3?1:0),baseSchoolYear=y-(m<3?1:0),n=grade+schoolYear-baseSchoolYear;
 return {offset,year,month,grade:n,label:year+'년 '+month+'월 · '+(n<=9?'중'+(n-6):'고'+(n-9)),semester:month>=3&&month<=8?1:2};
}
function periodOptions(c){return ['regular','vacation','exam',...(Number(c.grade)===9&&[11,12,1,2].includes(Number(c.mon))?['transition']:[])];}
function effectivePeriod(row,c,d){
 if(d.offset===0&&periodOptions(c).includes(row.period))return row.period;
 if(d.offset===0&&!row.period&&row.rhythm==='exam')return 'exam';
 return [1,2,7,8].includes(d.month)?'vacation':'regular';
}
function areas(row,c,d,period){
 const n=Math.min(3,Math.max(1,d.grade-6)),foundation=row.current==='starting',unknown=row.current==='unknown',transition=period==='transition'||d.grade===10;
 const thought=n===1?'1권 시작편':n===2?'2~3권 중 한 권':'4~5권 중 한 권';
 const alternative=row.book==='koreanSumma';
 let reading=foundation?'지금 혼자 읽을 수 있는 짧은 독해 지문':unknown?'현재 독해서의 새 지문으로 출발 범위 확인':alternative?'숨마주니어 중학 국어 비문학 독해 연습 · 현재 단계':'EBS 중학 국어 생각독해 '+thought+' · 난도 확인 후 선택';
 let literature=foundation?'짧은 이야기·학교 작품':unknown?'학교 작품·현재 문학 교재':'EBS 필독 중학 국어 문학 '+n+' · 난도 확인 후 선택';
 if(transition&&!foundation&&!unknown){reading='개념의 나비효과 입문편 독서·워크북';literature='개념의 나비효과 입문편 문학·워크북';}
 const a={
  vocabulary:area('학교 교과서·읽던 글 + 국어사전','낯선 어휘·문학 개념어·문맥 속 뜻','독해와 작품에서 막힌 말을 골라 뜻을 확인하고 자기 문장을 만듭니다. 며칠 뒤 다른 문장에서 다시 확인합니다.','새 문맥에서 뜻을 구분하고 예를 들어 설명하나요?','주 3회 · 읽던 글에서 3~5개씩'),
  grammar:area('학교 국어 교과서·문법 정리 노트','학교 진도에 맞춘 음운·품사·문장·맞춤법','학교에서 배우는 순서에 맞춰 한 개념과 예·반례를 정리합니다. 설명이 막히는 부분만 관련 강의로 확인하고 새 문장에 적용합니다.','용어만 외우지 않고 새 예문을 분류하고 이유를 말하나요?','주 1회 · 개념 하나와 새 예문'),
  evidence:area(reading,'문단의 중심 내용·구조·추론·선택지 근거','한 지문을 읽고 문단별 핵심을 짧게 적습니다. 정답 근거와 오답의 틀린 표현을 표시하고, 다음에는 새 지문에서 도움을 줄입니다.','낯선 지문에서 글의 흐름과 선택지의 근거를 혼자 설명하나요?','주 2회 · 회당 한 지문부터'),
  literature:area(literature,'현대시·현대소설·고전시가·고전소설','시의 화자·상황·표현, 소설의 서술자·인물·갈등을 작품 속 구절과 연결합니다. 고전 어휘는 문맥과 함께 정리합니다.','새 작품에서도 표현이나 장면을 근거로 해석하나요?',period==='vacation'?'주 2~3회 · 한 작품씩 나누어':'주 1회 · 한 작품과 배운 개념'),
  writing:area('학교 서술형·수행평가 또는 읽은 지문의 짧은 답','요구 조건·근거·설명·고쳐 쓰기','답해야 할 조건을 표시하고 근거를 붙여 짧게 씁니다. 첨삭한 한 부분을 고친 뒤 다른 질문에도 스스로 적용합니다.','답의 조건과 지문 근거를 빠뜨리지 않나요?','주 1회 · 초안과 다른 날 수정'),
  school:area('학교 국어 교과서·수업 자료·평가 자료','현재 학교 작품·문법·서술형','교과서와 수업 필기를 먼저 확인합니다. 시험이 가까워지면 학교 범위의 작품·문법·서술형과 오답을 우선하고, 시험 뒤 새 지문으로 돌아옵니다.','작품 해석과 문법 적용을 답을 가리고 설명할 수 있나요?','학교 과제와 겹친 공부는 한 번만')
 };
 const selected={summary:'evidence',foundation:'evidence'}[row.focus]||row.focus;
 const savedMaterials={ebsReading:'EBS 필독 중학 국어 비문학 독해 1',ebsMiddle:'EBS 어휘가 독해다! 중학 국어 어휘',school:'학교 교과서·수업 자료',reader:'현재 읽는 책'};
 if(savedMaterials[row.book]&&a[selected])a[selected].material=savedMaterials[row.book];
 if(BOOKS[row.book]&&!['koreanThought','koreanSumma','koreanButterfly'].includes(row.book)&&a[selected])a[selected].material=BOOKS[row.book].title;
 // A saved high-school book remains visible in the custom record. It never
 // silently replaces middle-school prerequisites or every parallel strand.
 if(row.book==='koreanButterfly'&&transition&&!foundation&&!unknown)a[selected||'evidence'].material=BOOKS.koreanButterfly.title;
 if(period==='exam'){
  a.evidence.material='학교 시험 범위의 독서 지문·이전 독해 오답';
  a.evidence.scope='학교 지문·선택지의 근거와 이전 독해 오답';
  a.evidence.weekly='학교 범위 독해로 대체 · 별도 새 책 추가 없음';
  a.literature.material='학교 시험 범위의 작품·기존 문학 오답';
  a.literature.weekly='학교 수업·서술형 복습에 포함';
  a.writing.weekly='학교 서술형·수행평가로 대체';
 }
 return a;
}
function build(row,c){
 if(!supported(c))return null;
 const first=at(c);if(!first)return {months:[],standardStages:[],issues:['학년과 기준 연월을 확인해 주세요.'],ready:false};
 const months=Array.from({length:6},(_,i)=>{
  const d=at(c,i),period=effectivePeriod(row,c,d),a=areas(row,c,d,period);
  const title=period==='exam'?'학교 범위·서술형을 먼저':period==='transition'||d.grade===10?'고등 입문 개념에서 새 지문 적용으로':period==='vacation'?'문학·문법 보완과 독해 병행':'학교 공부와 낯선 글 읽기 병행';
  const talk=period==='exam'?'이번에는 학교 시험 범위를 먼저 정리하겠습니다. 새 독해서 분량을 겹쳐 늘리지 않고, 시험이 끝나면 원래 독해와 문학 공부로 돌아옵니다.':period==='transition'||d.grade===10?'중등에서 배운 문학·독서 개념을 새 글에 적용할 수 있는지 먼저 보겠습니다. 준비가 되면 고등 입문 개념과 워크북을 연결하고, 그다음 예비 고1 기출에서 막히는 부분을 확인하겠습니다.':period==='vacation'?'방학에는 문학을 묶어서 공부하고 헷갈리는 문법을 정리하겠습니다. 독해와 어휘는 계속 이어가되, 같은 역할의 교재를 여러 권 동시에 더하지는 않겠습니다.':'학교 작품과 문법을 충실히 배우면서, 평소에는 처음 보는 글의 근거를 찾는 연습도 이어가겠습니다. 읽은 내용을 짧게 쓰고 고치는 과정까지 함께 보겠습니다.';
  return {...d,date:d.label,period,periodLabel:PERIODS[period],title,talk,areas:a,check:'정답을 가리고 새 지문의 핵심·근거를 설명하고, 며칠 뒤 비슷한 새 문제에서도 혼자 적용하는지 봅니다.',completion:'학습 기간 · 교재 완료일은 별도 확인'};
 });
 const standardStages=[];
 for(const m of months){const key=[m.grade,m.semester,m.period].join('-'),last=standardStages.at(-1);
  if(last?.key===key){last.end=m.offset+1;last.endDate=m.date;last.date=last.startDate+' ~ '+m.date;}
  else standardStages.push({...m,key,label:(m.grade<=9?'중'+(m.grade-6):'고'+(m.grade-9))+' · '+m.periodLabel,start:m.offset,end:m.offset+1,startDate:m.date,endDate:m.date});
 }
 const checkpoints=[{title:'첫 2주 · 시작할 난도와 분량',date:first.label,text:'지문 하나와 작품 하나를 혼자 읽어 보게 합니다. 뜻을 모르는 어휘, 문장 이해, 답의 근거 중 어디에서 막히는지 보고 교재 단계를 정합니다.'},{title:'두 달 뒤 · 새 글에서 다시 확인',date:at(c,2).label,text:'풀었던 문제의 답을 기억하는지보다 같은 난도의 새 지문에서도 핵심과 근거를 설명하는지 봅니다. 어려웠던 개념만 보완하고 재확인합니다.'},{title:'다음 기간으로 넘어가기 전',date:at(c,6).label,text:'처음 보는 작품·독서 지문에서 배운 개념을 적용하고 조건에 맞게 쓸 수 있으면 범위를 넓힙니다. 교재를 끝낸 날짜만으로 다음 단계 이수를 정하지 않습니다.'}];
 const result={months,standardStages,checkpoints,ready:!!row.current,issues:[],period:months[0].period,title:'학교 공부에서 고등 국어 준비까지',talk:months[0].talk,workload:'지문 읽기·문제 풀이·오답 수정까지 포함해 분량을 정합니다. 강의는 설명이 필요한 부분에만 붙이고, 같은 강좌가 여러 영역에 쓰여도 한 번만 계산합니다.',later:[{date:'중3 마지막 학교 시험 이후 ~ 고등 입학 전',title:'개념·워크북 → 예비 고1 기출',text:'중등 독해와 문학 개념을 적용할 수 있을 때 나비효과 입문편·워크북의 필요한 범위를 공부합니다. 그다음 예비 고1 3월 학력평가 기출 한 회로 읽기·시간 배분·오답 원인을 확인합니다. 기초가 흔들리면 그 부분부터 보완하고, 이 시기에 수능 국어를 완성했다고 보지는 않습니다.'}]};
 result.issues=validate(result);return result;
}
function validate(plan){
 const issues=[];let end=0;
 for(const p of plan.standardStages||[]){if(p.start!==end||!Number.isInteger(p.end)||p.end<=p.start)issues.push('학습 기간의 빈칸·겹침을 확인해 주세요.');end=p.end;
  for(const id of ['vocabulary','grammar','evidence','literature','writing','school'])if(!p.areas?.[id]?.material||!p.areas[id].check)issues.push('병행할 영역의 교재와 확인 기준을 확인해 주세요.');
 }
 if(end!==6)issues.push('여섯 달의 학습 기간을 확인해 주세요.');
 return [...new Set(issues)];
}
const NAMES={vocabulary:'어휘·개념어',grammar:'문법',evidence:'독서·비문학',literature:'문학',writing:'서술·쓰기',school:'학교 내신'};
function table(plan){return `<div class="language-table-scroll" tabindex="0" role="region" aria-label="국어 시기별 교재와 공부 방법"><table class="language-table language-standard-table korean-standard-table" style="--language-period-count:${plan.standardStages.length}"><thead><tr><th scope="col">병행할 공부</th>${plan.standardStages.map(p=>`<th scope="col">${esc(p.label)}<small>${esc(p.date)}</small></th>`).join('')}</tr></thead><tbody>${Object.entries(NAMES).map(([id,title])=>`<tr><th scope="row">${title}</th>${plan.standardStages.map((p,i)=>`<td class="language-phase phase-${i%3}"><strong>${esc(p.areas[id].material)}</strong><span>${esc(p.areas[id].scope)}</span><span>${esc(p.areas[id].weekly)}</span></td>`).join('')}</tr>`).join('')}<tr><th scope="row">다음 과정 전</th>${plan.standardStages.map(p=>`<td>${esc(p.check)}</td>`).join('')}</tr></tbody></table></div>`;}
function render(m,view){
 const p=m.koreanPlan;if(!p)return '';
 if(p.issues.length)return `<section class="language-plan" data-language-plan="korean"><p>${esc(p.issues.join(' '))}</p><button type="button" data-language-open="korean">현재 공부 다시 확인</button></section>`;
 const map=`<div class="language-standard-landscape"><ol class="language-standard-stops">${p.standardStages.map((s,i)=>`<li class="${i===0?'is-current':''}"><span class="language-marker">${i===0?'현재':i+1}</span><small>${esc(s.label)}</small><strong>${esc(s.title)}</strong><time>${esc(s.date)}</time><span class="korean-map-books">독서 · ${esc(s.areas.evidence.material)}<br>문학 · ${esc(s.areas.literature.material)}</span><span class="language-concurrent">학교 공부 · 독서 · 문학 · 문법 · 쓰기</span></li>`).join('')}</ol></div>`;
 const details=p.standardStages.map(s=>`<details class="korean-period-detail"><summary>${esc(s.label+' · '+s.date)}</summary><p class="language-speech">${esc(s.talk)}</p><div class="language-track-cards">${Object.entries(s.areas).map(([id,a])=>`<article><small>${NAMES[id]}</small><strong>${esc(a.material)}</strong><p>${esc(a.scope)}</p><p>${esc(a.method)}</p><span>${esc(a.weekly)}</span><span>확인 · ${esc(a.check)}</span></article>`).join('')}</div></details>`).join('');
 const custom=m.route?`<details class="language-custom-overlay"><summary>우리 아이에게 맞춘 보완 · ${esc(m.route.title)}</summary><p>${esc(m.route.method+' '+m.route.practice)}</p><p>선택한 교재 · ${esc(m.book?.title||'현재 교재에서 필요한 부분 활용')}</p><p>${esc(m.rhythm)}${m.row.rhythm==='extra'?' · 첫 달 주 1회 15분, 부담이 없으면 이후 주 2회':''}</p><p>${esc(m.route.check)}</p></details>`:'';
 return `<section class="language-plan" data-language-plan="korean"><header class="language-plan-heading"><div><small>국어 · 학기·방학·내신 기간별 병행 계획</small><h3>${esc(p.title)}</h3></div><button type="button" data-language-open="korean" data-language-start="current">선택 바꾸기</button></header><p class="language-current">${esc(m.current)}</p><p class="language-speech">${esc(p.talk)}</p>${view==='map'?map+`<details><summary>시기별 교재와 학습량을 표로 보기</summary>${table(p)}</details>`:table(p)}${custom}${details}<section class="language-checkpoints"><h4>교재를 끝낸 뒤, 무엇을 확인할까요?</h4>${p.checkpoints.map(c=>`<div><strong>${esc(c.title)}</strong><small>${esc(c.date)}</small><p>${esc(c.text)}</p></div>`).join('')}</section><details><summary>고등 입학 전까지 이어갈 국어</summary><p>${esc(p.later[0].text)}</p></details><details><summary>강의와 교재 분량은 이렇게 잡습니다</summary><p>${esc(p.workload)}</p><p>학기·방학 표시는 달력에 따른 예시입니다. 학교의 실제 방학·시험일에 맞춰 바꾸고, 이번에 선택한 시험 준비는 이번 달에만 적용합니다. 교재 단계는 확인할 후보이며, 이전 권을 마쳤다는 기록이 아닙니다.</p></details></section>`;
}
g.PlannerKorean=Object.freeze({BOOKS,SOURCES,PERIODS,NAMES,supported,at,periodOptions,build,validate,table,render});
})(window);
