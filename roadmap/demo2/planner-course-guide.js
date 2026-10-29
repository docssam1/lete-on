/* 과정 안내는 표시 전용이다. 진도·저장값·일정을 변경하지 않는다. */
(function(global){
const guides={
 elem:{summary:'교과 진도와 심화를 나란히 보겠습니다.',books:'표준 교재: 디딤돌 기본+응용 · 디딤돌 응용',other:'기본 개념과 대표 유형을 익힌 뒤 응용으로 연결합니다. 같은 역할의 유형서를 여러 권 겹치기보다, 지금 교재에서 빠뜨린 단원과 오답을 먼저 채워주세요.',advice:'몇 학년 책을 끝냈는지만 보지는 않겠습니다. 문제에서 무엇을 구하는지 말하고, 조건을 빠짐없이 찾아 식을 세울 수 있어야 다음 진도가 남습니다. 설명이 막히는 단원만 보완하면서 진도를 이어가세요.'},
 elemDeep:{summary:'교과에서 배운 개념을 낯선 문제에 적용하는 과정입니다.',books:'심화 교재: 최상위수학S → 필요할 때 최상위수학',other:'최고수준·큐브수학 심화도 같은 역할의 후보입니다. 극심화 교재는 교과와 기본 심화가 안정된 뒤 목표에 맞춰 고릅니다. 책을 바꾸는 것과 학습량을 늘리는 것은 따로 결정하세요.',advice:'교과 5-2를 하면서 최상위수학S 4-1을 병행할 수 있습니다. 선행한 개념으로 앞 학기의 어려운 문제를 깊게 풀어보는 구성이에요. 힌트를 받아 푼 문제는 며칠 뒤 혼자 다시 설명할 수 있는지 보겠습니다.'},
 middle:{summary:'개념·유형을 익힌 뒤 준심화와 서술형 풀이로 연결합니다.',books:'학습 레벨 L0~L2 표준 교재: 원리해설 + A급',other:'개념원리 + 쎈은 개념·유형의 다른 구성이고, 일품은 준심화 점검에 활용할 수 있습니다. A급·블랙라벨은 배운 개념을 활용할 준비가 된 단원부터 선택합니다. 여러 교재를 모두 필수로 더하지는 않습니다.',advice:'중학생이라면 내신 대비 한 달 안팎을 학교 일정에 맞춰 확보하고, 비내신 기간에 선행을 이어가세요. 중등 심화를 마친 뒤에는 고1 3월 수학 학력평가의 배운 범위로 점검할 수 있습니다. 정답률과 풀이 과정을 함께 보겠습니다.'},
 high:{summary:'고등 선행은 개념서와 유형서를 짝지어 공부합니다.',books:'기본: 기본정석 + RPM → 준심화: 실력정석 + 쎈',other:'제공해 주신 강의의 구성은 기본 약 3개월, 준심화 약 3개월입니다. 한 과목을 공부하는 참고 구성으로 보고, 실제 지도에 선택한 기간은 유지합니다. 초·중학생의 고등 선행과 고등학생의 학교 시험 대비는 같은 깊이로 잡지 않습니다.',advice:'공통수학1·2에서 자꾸 막힌다면 더 어려운 책부터 추가하지 않겠습니다. 오답과 비워둔 유형을 먼저 채우고, 풀이를 혼자 이어갈 수 있을 때 대수 등 다음 과목으로 넘어가세요. 중3 이후에는 배운 범위의 학력평가 문제와 학교 평가 방식도 함께 살펴봅니다.'},
 intro:{summary:'경시 입문에서는 네 영역의 기본 발상과 풀이 설명을 익힙니다.',books:'입문 교재 후보: CPG · 평면기하의 아이디어 · 조합의 길잡이 · 정수론 입문 자료',other:'정수·조합·기하·대수 중 필요한 영역의 교재를 골라 시작합니다. 한 번에 네 영역의 모든 교재를 추가할 필요는 없습니다.',advice:'이 로드맵의 입문은 공통수학1·2 완료 후 연결합니다. 기초반 6개월에는 공통수학1·2와 중등 대수·기하 심화의 빈틈도 함께 메웁니다. 이미 공부한 내용은 인정하고, 처음 만나는 문제에서 어떻게 생각하는지 보겠습니다.'},
 basic:{summary:'1차 문제 해결과 2차 증명 풀이를 함께 준비합니다.',books:'영역별 교재 후보: 지름길 중급 하 · 조합의 지름길 · 경시해법 · 바이블 시리즈',other:'틀린 문제를 다시 푸는 데서 끝내지 않고, 핵심 발상을 어느 조건에서 쓸 수 있는지 정리합니다. AMC·AIME는 목표와 맞는 문제만 보조 자료로 활용합니다.',advice:'목표 대회 일정에 맞춰 공부하되, 1차 이후에는 2차 준비·남은 고등 과정·영재학교 준비 중 무엇에 집중할지 다시 정합니다. 수상 여부만으로 교과나 탐구 준비까지 끝났다고 보지는 않습니다.'},
 second:{summary:'심화 문제의 발상과 증명의 빈틈을 점검합니다.',books:'심화 교재 후보: 100 시리즈 · IMTS·ARML · 조합의 원리와 기법 · PSS',other:'교재를 늘리기 전에 현재 영역의 풀이를 끝까지 써보고, 빠뜨린 경우나 성립 조건이 없는지 확인합니다.',advice:'고등 KMO·영재학교 준비·학교 공부 가운데 다음 목표에 맞춰 시간을 나눕니다. 경시 공부를 이어가더라도 학교 교과와 과학, 언어 과목의 빈틈을 함께 살펴주세요.'},
 thinking:{summary:'사고력은 진도와 별도로 꾸준히 이어갈 공부입니다.',books:'선택한 사고력 교재의 현재 단계 → 다음 단계',other:'1031 등 단계형 교재는 앞 단계의 핵심 발상을 스스로 적용하는지 보고 이어갑니다. 학원 반 이름이 같아도 교과·연산의 진도와 설명하는 힘은 따로 확인합니다.',advice:'바로 답이 떠오르지 않는 문제를 충분히 생각할 시간을 주세요. 풀이를 보여주기 전에 문제의 조건을 말하게 하고, 한 가지 방법을 찾으면 다른 방법도 가능한지 이야기해 보세요.'},
 calc:{summary:'계산의 원리와 정확도를 교과 진도에 맞춰 챙깁니다.',books:'현재 연산 교재 → 다음 권 / 중등 연산·도형 교재 교대',other:'초등 과정 이후에는 기적의 중학연산과 기적의 중학도형을 2개월씩 번갈아 공부하는 기준입니다. 지금 배우는 교과에 필요한 계산은 그때그때 짧게 복습합니다.',advice:'식부터 보고 풀어 틀린다면 연산 분량만 늘려서는 해결이 어렵습니다. 구할 것과 조건에 표시하고 식을 세운 뒤, 답의 단위까지 확인하는 순서를 교과 문제에도 적용해 주세요.'},
 science:{summary:'기본 개념을 익힌 뒤 자료 해석과 심화로 연결합니다.',books:'계통별 줄기과학 / 학기별 오투 · 선택한 범위에 맞춰 진행',other:'초등 L6까지는 계통별, L7부터는 학기별을 표준으로 봅니다. 중학생부터는 학교 과학·내신을 중심에 두고 수학 진도에 맞는 과학 선행을 병행합니다.',advice:'중등 기본을 건너뛰고 심화 교재부터 시작하지 않습니다. 기본 이후 심화 브릿지는 전체 6개월로 두고, 하이탑 심화를 반복하며 부족한 단원을 보완합니다. 영재원 대비는 별도로 더하는 준비입니다.'},
 choice:{summary:'현재 공부를 유지하면서 필요한 준비를 골라보겠습니다.',books:'선택한 목표의 교재·준비 과정',other:'모집 분야와 평가 방식이 다르면 준비할 내용도 달라집니다. 지원 지역·학년·올해 요강을 확인한 뒤 필요한 대비를 더하세요.',advice:'교과 진도만으로 합격 가능성을 판단하지는 않겠습니다. 낯선 문제를 생각하는 힘, 풀이를 설명하는 힘, 현재 과제를 감당하는 모습을 함께 살펴보세요.'},
 unknown:{summary:'지금 공부하는 범위를 고르면 다음 과정을 연결할 수 있습니다.',books:'현재 교재와 학기 선택',other:'책 이름뿐 아니라 공부 중인 학기와 완료 여부를 함께 골라주세요.',advice:'정확한 진도가 기억나지 않으면 다음에 정해도 괜찮습니다. 이미 고른 공부는 그대로 남겨두겠습니다.'}
};
const practice={
 elem:{sequence:['개념을 아이의 말로 설명하기','대표 유형을 혼자 풀기','응용 문제에서 조건을 연결하기'],parallel:'교과는 현재 진도, 심화는 선택한 학기, 연산은 필요한 계산 범위로 따로 이어갑니다.',check:'숫자나 조건이 바뀐 문제도 풀이 이유를 설명하면 다음 단원으로 갑니다. 같은 조건을 반복해서 놓치면 그 부분부터 보완하세요.'},
 elemDeep:{sequence:['조건과 구할 것을 구분하기','그림·표·식으로 해결 방법 찾기','힌트 없이 다시 풀고 설명하기'],parallel:'새 교과 진도를 유지하면서 이미 배운 학기의 심화를 병행할 수 있습니다. 연산은 짧게 꾸준히 이어갑니다.',check:'맞힌 개수만 보지 않고 어디까지 혼자 풀었는지 봅니다. 풀이를 외웠다면 비슷한 새 문제에서 다시 확인하세요.'},
 middle:{sequence:['개념을 빈 종이에 정리하기','기본 유형의 정확도와 풀이 속도 점검','서술형으로 풀이 연결하기','학교의 출제 형식에 맞춰 연습','오답과 비워둔 유형 보완'],parallel:'선행·후행 심화·연산을 따로 표시합니다. 예를 들어 중2-1을 배우면서 중1-1 심화를 병행할 수 있습니다.',check:'일품 레벨업 테스트 등 처음 보는 문제를 골라 풀이까지 확인합니다. 제공 강의의 70%·50% 구간은 상담 참고값이며 자동 승급 기준으로 사용하지 않습니다.'},
 high:{sequence:['기본정석의 개념과 예제 + RPM 유형','실력정석의 개념 적용 + 쎈 유형','오답·미완료 문제를 보완한 뒤 다음 과목'],parallel:'공통수학1·2의 약한 단원을 복습하면서 다음 과목을 이어갑니다. 고등학생은 학교의 진도·시험 범위에 맞춰 심화와 기출을 조정합니다.',check:'대표 유형을 설명 없이 풀고, 틀린 문제의 이유를 말할 수 있는지 보세요. 일품·블랙라벨의 추가 여부는 목표 학교와 준비 시점에 맞춰 결정합니다.'},
 thinking:{sequence:['조건을 빠짐없이 읽기','스스로 생각한 방법을 끝까지 시도','풀이의 핵심 발상을 말로 정리'],parallel:'교과·심화·연산을 대신하는 과정은 아닙니다. 사고력 숙제가 다른 공부를 밀어내면 교재 수나 분량부터 조정하세요.',check:'다음 단계로 갈 때는 앞 단계의 비슷한 새 문제에서 발상을 스스로 꺼내는지 확인합니다.'},
 calc:{sequence:['필요한 계산 원리 확인','짧은 분량을 정확하게 풀기','틀린 원인을 고친 뒤 며칠 후 재확인'],parallel:'교과의 분수·소수·문자식 등 현재 필요한 계산을 함께 복습합니다.',check:'단순 계산 오류인지, 조건을 잘못 읽은 것인지 구분합니다. 정확도가 안정된 뒤 속도를 점검하세요.'}
};
function guide(key,group){
 const copy={...guides[key],...(practice[key]||{}),guideKey:key},young=['preschool','lower'].includes(group),elementary=young||group==='upper';
 if(young&&key==='calc')copy.summary='수를 이해하고 계산을 정확하게 이어가는 힘을 기릅니다.';
 if(key==='middle'&&elementary)copy.advice='초등학생의 중등 선행은 새 개념을 설명하고 활용하는 힘부터 봅니다. 중학교에 가면 학교 시험 일정에 맞춰 내신 기간을 따로 확보하세요. 중등 심화를 마친 뒤에는 고1 3월 수학 학력평가의 배운 범위로 확인할 수 있습니다.';
 return copy;
}
const text=v=>String(v||'').replace(/<[^>]*>/g,' ').trim();
function classify(value,axis=''){
 const t=text(value);
 if(!t||/다음 단계 확인|모름|미입력|안 함|안해|하지 않|안 하고|확인 필요/.test(t))return 'unknown';
 if(/영재원|영재학교|고입 준비|선택|갈림길|합류|황소/.test(t))return 'choice';
 if(/과학|오투|생물|화학|물리|지학/.test(t))return 'science';
 if(/KMO|경시/.test(t)){if(/2차|심화|고등/.test(t))return 'second';if(/기본|실전/.test(t))return 'basic';return 'intro';}
 if(axis==='calc'||/연산|계산법|소마셈/.test(t))return 'calc';
 if(axis==='thinking1'||axis==='comp'||/사고력|팩토|1031|필즈 베이직|TOT/.test(t))return 'thinking';
 if(/공통수학|정석|미적분|확률|수능|수Ⅰ|수Ⅱ/.test(t))return 'high';
 if(/중[1-3]|중등|원리해설|A급|에이급|블랙라벨|개념원리/.test(t))return 'middle';
 if(axis==='deep'||axis==='school2'||/심화|최상위|점프왕|우보/.test(t))return 'elemDeep';
 if(axis==='school'||/초등|디딤돌|교과|[1-6]-[12]/.test(t))return 'elem';
 return 'unknown';
}
function detail(node,plan={}){
 const sections=[],group=plan.audience||'general';
 if(node.kind==='now'){
  const rows=plan.sourceProfile?.rows;
  if(rows)for(const row of rows){if(!row.current.completed)sections.push({title:text(row.current.shortText),...guide(classify(row.current.shortText,row.key),group)});}
  else for(const row of plan.rows||[]){if(!['school','school2','comp','calc'].includes(row.key))continue;const b=row.blocks.find(b=>b[1]<=plan.now&&b[2]>=plan.now);if(b)sections.push({title:text(b[0]),...guide(classify(b[0],row.key),group)});}
 }
 if(!sections.length){const key=node.kind==='now'?'unknown':node.guideKey||classify(node.title+' '+node.sub,node.axis);sections.push({title:text(node.title),...guide(key,group)});}
 const summary=node.kind==='now'&&sections.length>1?'교과·사고력·심화·연산을 각각 어디까지 공부하는지 함께 보겠습니다.':sections[0].summary;
 const young=['preschool','lower'].includes(group),academic=young&&node.title==='고등 과정 · 내신·수능';
 return {title:academic?'앞으로의 중·고등학교 공부':text(node.title),context:academic?'지금은 기본기를 쌓고, 학교 공부가 바뀌는 시점에 다음 준비를 정합니다.':text(node.sub),summary,sections};
}
function decorate(ms,plan){return {...ms,main:ms.main.map(n=>{const course=detail(n,plan);return {...n,context:n.sub,sub:course.summary,course};})};}
global.PlannerCourseGuide=Object.freeze({detail,decorate});
})(window);
