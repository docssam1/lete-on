/* ============================================================
   초등 이후 로드맵 — 원장님 원본 표 4장을 칸 위치 그대로 옮긴 것
   - 각 표는 자기 원본의 학년·월 머리를 그대로 쓴다(표끼리 축을 합치지 않는다).
   - 칸: [시작 열, 끝 열(포함), 글자, 행 수(기본 1), 표시]
   - 교재 이름은 원본 그대로. 팩토는 초등팩토 1까지만 두기로 해서(원장님 2026-10-19),
     팩토 칸(팩토 lv.3·팩토 3단계 등)은 원본 그대로 둔다(원장님 2026-10-19).
   ============================================================ */
(function(){
'use strict';

function months(spec){ // [['초1',[7,8,...]], ...] → 머리 두 줄
  const cols=[]; spec.forEach(([y,ms])=>ms.forEach(m=>cols.push({y,m}))); return {spec,cols};
}

const TABLES=[
 {
  key:'soma',
  button:'소마 커리큘럼 (6세~7세)',
  title:'2026 소마 6세 로드맵 (6세~7세)',
  source:'원본: 2026 소마 6세 로드맵 사진',
  axis:months([['6세',[4,5,6,7,8,9,10,11,12]],['7세',[1,2,3,4,5,6,7,8,9,10,11,12]]]),
  groups:[
   {label:'사고력<br>진도',rows:[[[0,4,'Ray B단계'],[5,18,'Premier 라이즈 1~8'],[19,20,'초급']]]},
   {label:'사고력<br>부교재',rows:[[[0,4,'키즈팩토 (응용) A, B, C'],[5,13,'초등팩토 (기본+응용) A, B, C (6권)'],[14,16,'디딤돌 2-1'],[17,20,'디딤돌 2-2']]]},
   {label:'연산',rows:[[[0,2,'소마셈 P2 ~ P4<br><small>30까지의 ±5,6,10,9</small>'],[3,6,'소마셈 A1 ~ A4<br><small>덧,뺄셈구구 &amp; 세 수의 ± &amp; □가 있는 ±</small>'],[7,10,'소마셈 A5 ~ A8<br><small>두 자리 ± 한 자리 &amp; □가 있는 두 자리 ±</small>'],[11,14,'소마셈 B1 ~ B4<br><small>두/세자리수의 덧뺄셈</small>'],[15,18,'소마셈 B5 ~ B8<br><small>곱셈, 나눗셈</small>'],[19,20,'소마연산<br>3학년']]]},
   {label:'도형',rows:[[[0,3,'소마도형 P1~P4'],[11,15,'소마도형 A1~A4']]]}
  ],
  notes:[
   '사진 전달사항: Ray 각 호마다 똑똑퀴즈 진행, Ray B2-1 skip · 7월 소마셈 A단계 시작 · 9월 Premier 라이즈 시작, 초등팩토 시작 · 7세 2월 소마도형 A단계 시작.',
   '입학 시기가 시작 진도는 아닙니다. 시작 진도는 배정된 반에 따라 다릅니다.',
   '5세 입문: 2주 공통 1-2 과정 후 1-3 · 2-3 · 3-3 과정으로 배정됩니다(대치소마 설명회 화면). 주제를 뉴소마 세부목차와 대조하면 1-2 = A1-2, 1-3 = A1-3, 2-3 = A2-3, 3-3 = A3-3과 같아, 배정에 따라 A단계 안에서 시작 자리가 다릅니다.',
   '대치소마 설명회 교재 라인업: 5세 A단계(G·H·S) → 6세 A단계 후반 → RISE → 7세 RISE 후반 → 신초급·사고력/교과 병행. 라이즈는 같고, 프리미어 초급 교재는 이번에 6권으로 개편됩니다(기존 교재를 재구성한 것, 원장님 메모 2026-10-19).'
  ]
 },
 {
  key:'hwangso2',
  button:'황소 2월 대비 추천',
  title:'황소 2월 대비 추천 커리 (7세~초2)',
  source:'원본: 원장님 첨부 표 「추천」 (2026-10-19)',
  axis:months([['7세',[3,4,5,6,7,8,9,10,12]],['초1',[1,2,3,4,5,6,7,8,9,10,11,12]],['초2',[1,2,3]]]),
  groups:[
   {label:'교과 응용<br>교과 심화<br>연산병행',rows:[
     [[1,2,'1-2 디딤돌 기본응용<br>1-1 최상위(선택)'],[3,5,'2-1 디딤돌 기본+응용<br>1-2 최상위(선택)'],[6,8,'2-2 디딤돌 기본+응용<br>1 문해길 심화'],[9,11,'3-1 디딤돌 기본+응용<br>2-1 최상위'],[12,14,'3-2 디딤돌 기본+응용<br>2-2 최상위'],[15,16,'3-1 최상위'],[17,18,'3-2 최상위'],[19,23,'4-1,2 꼼꼼히']]
   ]},
   {label:'사고력1',rows:[
     [[0,3,'초등팩토 1 원리+탐구+<br>팩토1과 연계된 PRE 1031 수준 문항'],[4,8,'PRE 1031 + 지필드 미션(pre) + 필즈 베이직'],[9,14,'교과 3-1 수준 이상이라면 1031 입문<br>아직 지문이해가 부족하다면 팩토2로 다지기'],[15,15,'GM A'],[16,16,'GM B'],[17,17,'GM C'],[18,18,'GM D'],[19,23,'1031 초급 + 필즈 초급 + GM 중급']]
   ]},
   {label:'사고력2',rows:[
     [[8,9,'성대 1학년 전기,<br>KAM, MBC 후기 유형<br>+ 지필드 탑 시크릿'],[10,12,'성대경시 전기 대비 경험'],[14,16,'챌린지, 프리미어<br>모의고사 가능'],[17,23,'초2 11월 황소는 무리<br>2월 대비 가능']]
   ]}
  ],
  notes:[
   '최상위는 3학년 기본+응용 끝내고 2학년부터 진행해도 됨.',
   '지필드 미션은 각 교재의 챕터별 유사/심화 추가 문항입니다. 탑시크릿은 지필드의 영역별 경시 교재입니다. GM은 어떤 아이들에게 초급과정을 대체하기 위한 상위 학습을 위한 지필드의 사고력 교재입니다.',
   '필즈 주 2회반 잘 적응하기 위한 진도는 1031 입문 절반, 3-1 시작수준, 3학년 연산완료. 위의 진도가 부담스럽다면 약 4,5개월 정도 천천히 진행해도 됨. 7세 2월까지 PRE 1031 잘 끝내기.',
   '1031 A 시작 전 반드시!! 구구단 + 세자리수 받아내림.',
   '연산과정: 기적의 계산법 3 → 4 → 5 → 6 → 7 → 8 (원본에 칸 경계가 없어 표에는 넣지 않았습니다. 7세 5월 무렵 3권, 초1 1월 무렵 5권, 초1 11월 무렵 8권).'
  ]
 },
 {
  key:'challenge',
  button:'소마 챌린지 수준 · 황소 대비',
  title:'황소 대비 · 소마 챌린지 수준 이상적 로드맵 (7세 12월~초3)',
  source:'원본: 원장님 첨부 표 (GFIELD Class, 2026-10-19)',
  axis:months([['초1',[12,1,2,3,4,5,6,7,8,9,10,11,12,1,2]],['초2',[3,4,5,6,7,8,9,10,11,12,1,2]],['초3',[3,4,5,6,7,8,9,10,11]]]),
  groups:[
   {label:'연산<br>교과',rows:[
     [[3,4,'3-1 디딤돌 응용',2],[5,6,'3-2 디딤돌 응용',2],[7,8,'4-1 디딤돌 응용'],[9,10,'4-2 디딤돌 응용'],[11,12,'4-1 심화'],[13,14,'5-1 디딤돌 응용'],[15,16,'5-2 디딤돌 응용'],[17,18,'6-1 디딤돌 응용'],[19,20,'6-2',2],[21,24,'중1 시작 시기 조정',2]],
     [[7,10,'3-1,2 심화'],[15,18,'5-1,2 심화']]
   ]},
   {label:'추천 경시<br>문제 해결력<br><small>(+ 수업)</small>',rows:[
     [[0,4,'1031 입문 + workbook',2],[5,7,'TOT 2단계'],[8,11,'1031 초급<br>필즈 초급'],[12,16,'1031 중급'],[18,20,'황소 개념'],[21,23,'황소<br>모의고사 실전',2]],
     [[5,7,'팩토 3단계'],[8,10,'문해길 경시편2,3<br>도형 특강'],[15,18,'3% 1과정'],[19,20,'모의고사<br>특강']]
   ]},
   {label:'연산',rows:[
     [[5,9,'기적의 계산법 7,8<br><small>초4,5 연산</small>'],[10,14,'기적의 계산법 9,10<br><small>초5,6 연산</small>'],[15,19,'기적의 계산법 10,11<br><small>초6,중등 방정식</small>'],[20,23,'중1 연산'],[24,27,'중2 연산'],[28,31,'중3 연산']]
   ]}
  ]
 },
 {
  key:'std',
  button:'기본 · GFIELD 표준 Class',
  title:'GFIELD 표준 Class (초1~초3)',
  source:'원본: 로드맵 (2023-06).pdf',
  axis:months([['초1',[7,8,9,10,11,12,1,2]],['초2',[3,4,5,6,7,8,9,10,11,12,1,2]],['초3',[3,4,5,6,7,8,9,10,11,12,1,2,3]]]),
  groups:[
   {label:'연산<br>교과',rows:[
     [[0,1,'3-1 디딤돌 응용',2],[2,3,'3-2 디딤돌 응용',2],[4,5,'4-1 디딤돌 응용'],[6,7,'4-2 디딤돌 응용'],[8,9,'5-1 디딤돌 응용'],[10,11,'5-2 디딤돌 응용'],[12,13,'6-1 디딤돌 응용'],[14,15,'6-2 디딤돌 응용'],[16,20,'계통 5개월<br>(5,6 심화/중1)',2],[21,24,'중1<br>원리해설 + 중등 심화',2],[25,28,'중2',2],[29,32,'중3',2]],
     [[4,7,'4,1-2 심화'],[9,10,'5-1 심화'],[11,12,'5-2 심화'],[13,15,'6-1,2 심화']]
   ]},
   {label:'추천 경시<br>문제 해결력<br><small>(+ 수업)</small>',rows:[
     [[0,1,'1031 입문 +<br>workbook',2],[2,6,'1031 초급'],[8,12,'1031 중급'],[13,15,'3% 1과정',2],[16,19,'모의 고사<br>왕수학 올림3<br>왕수학 응용 4<br>TOT 3',2]],
     [[5,7,'문해길 경시편2,3<br>도형 특강'],[11,12,'도형 2']]
   ]},
   {label:'연산',rows:[
     [[2,6,'기적의 계산법 7,8<br><small>초4,5 연산</small>'],[7,11,'기적의 계산법 9,10<br><small>초5,6 연산</small>'],[12,16,'기적의 계산법 10,11<br><small>초6,중등 방정식</small>'],[17,20,'중1 연산'],[21,24,'중2 연산'],[25,28,'중3 연산']]
   ]}
  ]
 },
 {
  key:'hwangso',
  button:'황소 경시를 희망한다면',
  title:'프리미어에서 황소 경시를 위한 로드맵 (7세~초2)',
  source:'원본: 2023 프리미어에서 황소경시를 위한 로드맵(지필드).pdf',
  axis:months([['7세',[6,7,8,9,10,11,12,1,2]],['초1',[3,4,5,6,7,8,9,10,11,12,1,2]],['초2',[3,4,5,6,7,8,9,10,11,12,1,2,3]]]),
  groups:[
   {label:'Premier Class<br><small>프리미어 진도</small>',rows:[
     [[0,11,'프리미어 초급 8권<br><small>주2회 (2H+2H)</small>'],[12,23,'프리미어 중급 8권<br><small>(3H+3H)</small>'],[24,33,'프리미어 고급<br><small>대수5권 / 기하5권 · 주2회 (3H+3H)</small>']]
   ]},
   {label:'교과 및<br>병행수업',rows:[
     [[0,3,'파워업 JUMP 1,2<br><small>(초등기하)</small>'],[4,6,'팩토 lv.3 A,B'],[7,8,'최상위 3-1'],[9,9,'성대<br>경시'],[10,11,'최상위 3-2'],[12,14,'최상위 4-1,2'],[15,15,'성대<br>경시'],[16,16,'최상위<br>4-2'],[17,20,'최상위 &lt;5-1&gt;,&lt;5-2&gt;'],[21,21,'성대<br>경시'],[22,25,'최상위 6-1,2'],[26,26,'중<br>1-1'],[27,27,'성대<br>경시'],[28,29,'중 1-1'],[30,33,'중 2-1']]
   ]},
   {label:'방특',rows:[
     [[19,20,'3% 1과정'],[26,26,'중등'],[31,32,'3% 2과정']]
   ]},
   {label:'GFIELD 표준<br>연산·교과',rows:[
     [[0,1,'3-2 디딤돌 응용',2],[2,3,'4-1 디딤돌 응용<br>3-1 최상위 레벨업 및 유사',2],[4,5,'4-2 디딤돌 응용<br>3-2 최상위 레벨업 및 유사',2],[6,7,'4-1 최상위<br>또는 같은 급 / 문해길 3',2],[8,9,'4-2 최상위<br>또는 같은 급 / 문해길 3',2],[10,11,'5-1 디딤돌 응용'],[12,13,'5-2 디딤돌 응용'],[14,15,'6-1 디딤돌 응용'],[16,17,'6-2 디딤돌 응용'],[18,21,'계통 5개월<br>(5,6 심화/중1)<br><small>수행률에 따라 중등으로 진행(중1연산 완료)</small>',2],[22,25,'중1<br>원리해설 + 중등 심화',2],[26,27,'중2-1',2],[28,29,'황소<br>실전<br>모의',2],[30,31,'중 2-2',2],[32,33,'중 3-1',2]],
     [[10,17,'초등 대수,기하 중급']]
   ]},
   {label:'추천 경시<br>문제 해결력<br><small>(+ 수업)</small>',rows:[
     [[0,1,'1031 입문 +<br>workbook',2],[2,5,'필즈 초급 하 + 1031 초급 미션<br>팩토 3 핵심문항'],[6,8,'필즈 초급 상<br>+ 1031 초급 미션'],[9,10,'성대 전기<br>대비'],[11,15,'필즈 중급 상,하<br>+ 1031 중급'],[16,19,'3% 1과정 / 성대 후기'],[20,22,'왕수학 응용 4 / 황소 개념'],[23,26,'황소 심화 개념 및<br>중급 모의고사',2],[27,29,'3% 2과정<br>핵심 개념<br>및 실전 모의',2]],
     [[2,6,'성대 후기 모의고사 및 권별 테스트'],[7,17,'P 중급 개념'],[18,19,'1031 초급 심화'],[20,22,'왕수학 올림피아드 3<br>+ 대비 문항']]
   ]}
  ],
  notes:[
   '필즈 초급 / 1031 초급 시작 전 반드시 기적의 계산법 7권 완료 후 3-1 최상위 또는 4-1 응용 학습이 가능하도록 만들어야 합니다.',
   '7세와 초1의 1031 또는 필즈 초급 과정은 아무리 꼼꼼하게 공부해도 수행률을 높이기 쉽지 않기 때문에 쉽게 지문 이해와 스킬에 초점을 맞춰 공부하고 초1 겨울 초급 심화 문제만 압축하여 공부합니다. (황소 시험보기 3개월 전 수행률 75% 이상 만들기)',
   '교과 학습은 소마에서 최상위를 진행하기 전 예습한다는 느낌으로 진행하다가 5-1 과정부터 빠르게 진행합니다. 이후 연산과 지문이해 능력이 되어 있다면 계통 수업 없이 중등 기본으로, 안 되어 있다면 계통으로 초5,6, 중1을 진행하고 중등 응용을 진행합니다.',
   '황소 개념 및 대비 시기에는 유형별로 공부하기보다는 여러 유형을 혼합하여 공부해야 수행률을 높일 수 있습니다.'
  ]
 },
 {
  key:'master',
  button:'빠른 상위반(Master Class)이라면',
  title:'Master Class (초1~초3)',
  source:'원본: 로드맵.pdf (커리 로드맵)',
  axis:months([['초1',[12,1,2]],['초2',[3,4,5,6,7,8,9,10,11,12,1,2]],['초3',[3,4,5,6,7,8,9]]]),
  groups:[
   {label:'교과 1<br>교과 2',rows:[
     [[0,0,'6-1,2 디딤돌 응용 완료',2],[1,3,'대수 계통'],[4,5,'중 1-1 원리해설'],[6,7,'중 1-2 원리해설'],[8,12,'중 2-1 원리해설'],[13,14,'중 2-2 원리해설'],[15,16,'중 3-1 원리해설'],[17,18,'중 3-2 원리해설'],[19,20,'중 3-1 중등 심화']],
     [[1,3,'5-1,2 심화'],[4,6,'6-1,2 심화'],[7,8,'TOT 3단계'],[9,10,'왕수학 응용 4'],[11,12,'중 1-1 중등 심화'],[13,14,'중 1-2 중등 심화'],[15,16,'중 2-1 중등 심화'],[17,18,'중 2-2 중등 심화'],[19,20,'중 3-2 중등 심화']]
   ]},
   {label:'추천 경시<br>문제 해결력<br><small>(+ 수업)</small>',rows:[
     [[0,0,'1031 중급<br>완료'],[1,3,'필즈 중급'],[4,7,'3% 1과정 + P 중급 완료'],[8,10,'왕수학 올림피아드 3<br>+ 대비 문항'],[11,14,'3% 2과정'],[19,21,'교대 영재원','gifted']]
   ]},
   {label:'특강',rows:[
     [[2,4,'성대 경시 대비'],[7,9,'성대경시대비 3학년 수준까지']]
   ]},
   {label:'추천<br>가정학습',rows:[
     [[2,3,'구몬 G 또는 수력충전 중1'],[4,5,'개념+유형 진행 시<br>가능하면 쎈수학 꾸준히'],[6,7,'수력충전 중 2-1']]
   ]}
  ]
 },
 {
  key:'gifted',
  button:'중등 심화·과학 영재원까지 본다면',
  title:'Master Class 중등~고등 심화 (3학년~4학년)',
  source:'원본: 원장님 첨부 표 (중등~고등심화)',
  axis:months([['3학년',[2,3,4,5,6,7,8,9,10,11,12,1]],['4학년',[2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5]]]),
  groups:[
   {label:'연산<br>교과',rows:[
     [[0,0,'중 1-1<br>원리해설'],[1,4,'중 2-1 원리해설'],[5,6,'중 2-2 원리해설'],[7,8,'중 3-1 원리해설'],[9,10,'중 3-2 원리해설'],[11,12,'중 3-2<br>중등 심화',2],[13,15,'수학 상 정석<br>+ RPM',2],[16,18,'수학 하 정석<br>+ RPM',2],[19,27,'진로 확정 KMO 입문 또는 이과커리<br>(EX 실력 정석 + 중등 심화+평기하)',2]],
     [[1,2,'중 1-1 중등 심화'],[3,4,'중 1-2 원리해설'],[5,6,'중 2-1 중등 심화'],[7,8,'중 2-2 중등 심화'],[9,10,'중 3-1 중등 심화']]
   ]},
   {label:'추천 경시<br>문제 해결력<br><small>(+ 수업)</small>',rows:[
     [[0,3,'1031 중급 또는 3% 1과정'],[4,7,'3% 1과정 또는 3% 2과정'],[8,11,'중등 대수 정리'],[12,15,'중등 기하 정리'],[16,20,'지중상'],[21,24,'기하작도']]
   ]},
   {label:'과학',rows:[
     [[7,10,'대학 부설 및 교육청<br>영재원','gifted'],[11,21,'중등 과학'],[22,27,'중등 심화(물화)']]
   ]}
  ]
 }
];

const PALETTE=['#dbeafe','#dcfce7','#fef3c7','#ede9fe','#fce7f3','#cffafe','#fee2e2','#e0e7ff'];

function render(t){
  const n=t.axis.cols.length;
  let h='<table class="sr-table"><colgroup><col class="sr-g"><col class="sr-l">';
  for(let i=0;i<n;i++) h+='<col class="sr-m">';
  h+='</colgroup><thead><tr><th colspan="2" rowspan="2" class="sr-corner"></th>';
  t.axis.spec.forEach(([y,ms])=>{ h+=`<th colspan="${ms.length}" class="sr-year">${y}</th>`; });
  h+='</tr><tr>'+t.axis.cols.map(c=>`<th class="sr-mon">${c.m}</th>`).join('')+'</tr></thead><tbody>';
  let colorIdx=0;
  t.groups.forEach((g,gi)=>{
    g.rows.forEach((row,ri)=>{
      h+='<tr>';
      if(ri===0) h+=`<th class="sr-group" colspan="2" rowspan="${g.rows.length}">${g.label}</th>`;
      const starts={}; row.forEach(c=>{starts[c[0]]=c;});
      // 이 행에서 위 행의 rowspan이 덮은 칸은 건너뛴다
      const coveredAbove=new Array(n).fill(false);
      for(let pr=0;pr<ri;pr++) g.rows[pr].forEach(c=>{ const rs=typeof c[3]==='number'?c[3]:1; if(pr+rs>ri) for(let k=c[0];k<=c[1];k++) coveredAbove[k]=true; });
      for(let k=0;k<n;){
        if(coveredAbove[k]){k++;continue;}
        const c=starts[k];
        if(c){
          const rs=typeof c[3]==='number'?c[3]:1, span=c[1]-c[0]+1;
          const flag=c[4]||(typeof c[3]==='string'?c[3]:'');
          const cls=['sr-cell']; if(flag==='swap') cls.push('sr-swap'); if(flag==='gifted') cls.push('sr-gifted');
          const bg=flag==='gifted'?'':` style="background:${PALETTE[(colorIdx++)%PALETTE.length]}"`;
          h+=`<td class="${cls.join(' ')}" colspan="${span}" rowspan="${rs}"${bg}>${c[2]}${flag==='swap'?'<span class="sr-badge">교재 교체 예정</span>':''}</td>`;
          k+=span;
        } else { h+='<td class="sr-empty"></td>'; k++; }
      }
      h+='</tr>';
    });
    if(gi<t.groups.length-1) h+=`<tr class="sr-gap"><td colspan="${n+2}"></td></tr>`;
  });
  h+='</tbody></table>';
  return h;
}

function show(key){
  const t=TABLES.find(x=>x.key===key)||TABLES[0];
  document.querySelectorAll('#schoolRoadmap .sr-tab').forEach(b=>b.classList.toggle('active',b.dataset.key===t.key));
  document.getElementById('srTitle').textContent=t.title;
  document.getElementById('srSource').textContent=t.source;
  document.getElementById('srTable').innerHTML=render(t);
  const notes=document.getElementById('srNotes');
  const hasSwap=JSON.stringify(t.groups).includes('swap');
  const items=(t.notes||[]).slice();
  notes.innerHTML=items.length?'<ul>'+items.map(x=>`<li>${x}</li>`).join('')+'</ul>':'';
}

function init(){
  const box=document.getElementById('srTabs');
  if(!box) return;
  box.innerHTML=TABLES.map(t=>`<button type="button" class="sr-tab" data-key="${t.key}">${t.button}</button>`).join('');
  box.addEventListener('click',e=>{ const b=e.target.closest('.sr-tab'); if(b) show(b.dataset.key); });
  show('std');
}
/* ============================================================
   L0~L4 같은 속도로 이어 보기
   - 유아 구간: 데모(index.html)의 ROAD_L0 줄을 그대로 쓰고 레벨마다 같은 간격(shift)으로 민다.
   - 초등 구간: 원장님 '프리미어 2반 수준' 표(P2)를 이어 붙인다. 이 표의 시점이 데모 L2와 거의 같아서
     유아 구간은 데모 간격 그대로, 초등 구간은 P2보다 당기지 않는다(L0·L1·L2 = P2, L3 +5, L4 +10).
   - 이어 붙이는 규칙은 아래 joinRow 설명 참고. 기간(칸 수)은 원본 그대로다.
   - 월 값 m: 5세 1월=0, 6세=12, 7세=24, 초1(8세)=36, 초2=48, 초3=60.
   ============================================================ */
const P2={
  school:[['3-1 디딤돌 응용',26,27],['3-2 디딤돌 응용',28,29],['4-1 디딤돌 응용',30,32],['4-2 디딤돌 응용',33,35],['5-1 디딤돌 응용',36,38],['5-2 디딤돌 응용',39,41],['6-1 디딤돌 응용',42,44],['6-2 디딤돌 응용',45,47],['중1-1',48,50],['중1-2',51,52],['중2-1',53,56],['중2-2',57,58]],
  school2:[['3학년 최상위(선택)',36,41],['4학년 최상위 이후 꾸준히',42,47]],
  comp:[['1031 입문 + workbook',26,29],['1031 초급',30,36],['1031 중급',37,43],['3% 1과정 + P 중급 완료',44,47],['왕수학 응용 4',48,50]],
  comp2:[['성대경시 대비',36,37],['성대경시 대비',42,43],['왕수학 올림피아드 3<br>+ 대비 문항',48,50]],
  calc:[['기적의 계산법 5',23,25],['기적의 계산법 6',26,28],['기적의 계산법 7',29,31],['기적의 계산법 8',32,34],['기적의 계산법 9',35,37],['기적의 계산법 10',38,40],['기적의 계산법 11',41,43],['기적의 계산법 12',44,46],['중1 연산',47,49]]
};
// 3개월 단위 레벨(원장님 2026-10-19 "초2 3월에 2-2를 처음 하는 아이도, 5-1을 처음 하는 아이도 있다").
// 모두 같은 속도, 시작만 3개월씩 다르다. L0~L4 설명은 데모 LEVELS, 그 아래는 초2 3월 교과로 자동 설명.
// L0~L11은 3개월 간격, L12는 초2 3월에 2-2를 처음 하도록 2개월 뒤, L13은 그보다 3개월 뒤(원장님 2026-10-19 "2,3개월 단위")
const GRID=[...Array.from({length:12},(_,k)=>3*k),35,38].map((shift,k)=>({id:'L'+k,shift,cls:'l'+(k%5)}));
const L_SHIFT=Object.fromEntries(GRID.map(g=>[g.id,g.shift]));
// 레벨별 공부 강도(원장님 2026-10-19). 비어 있는 레벨은 원장님 기준을 받으면 채운다.
const L_LOAD={L0:'학원 주 4~5일 · 시험 대비 중심',L1:'학원 주 4~5일 · 시험 대비 중심',L6:'사고력 꼼꼼히 + 모의고사 · 황소 미고려도 많음'};
const AX0=4, AX1=83; // 5세 5월 ~ 초4 12월
const ROW_COLORS={school:'#dbeafe',school2:'#e0f2fe',comp:'#ede9fe',comp2:'#fce7f3',calc:'#dcfce7',hwangso:'#fde68a',sci:'#ecfccb',gifted:'#fce7f3'};

function demoPrefix(key, stopText){
  const out=[];
  for(const b of (window.ROAD_L0||ROAD_L0)[key]){
    const t=b.text.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if(t.includes(stopText)) break;
    out.push([b.text.replace(/<br>/g,' '),b.s,b.e]);
  }
  return out;
}
/* 학원 진도 줄(키를 켰을 때만): 데모(index.html)의 소마·필즈 진도 이슈를 그대로 쓴다.
   레벨마다 옮기지 않고 표 맨 위에 한 번만 보인다. 필즈 입학은 6세 12월 관찰평가(원장님 메모). */
const ACADEMY={
  soma:{label:'소마 진도',color:'#e8f2ff',points:[['소마 관찰',10],['RAY B 완료',19],['프리미어<br>RISE 시작',20],['P1 선발 희망 시<br>소마 입학',24],['프리미어 선발<br>(4월)',27]]},
  fields:{label:'필즈 진도',color:'#fff1e6',points:[['필즈<br>관찰평가',23],['1차 승급',25],['2차 승급',27],['3차 승급 ·<br>필즈 S 선발',29]]}
};
/* 황소는 기본 로드맵에 넣지 않는다(원장님 2026-10-19: "황소를 굳이 고려하지 않아도 학습할 수 있는 로드맵").
   '황소 대비 보기' 키를 켜면 레벨마다 황소 개념 3개월 + 황소 모의고사 2개월(5개월)을 시험 달에 끝나도록 붙인다.
   조건: 1031 초급을 마친 다음 달부터 시작. 3% 1과정 완료는 조건이 아니다(3% 2과정은 중1 선행 수준이라 대부분 하지 않음).
   시험 달: 초2 11월 · 초2 2월(겨울방학, 개학 전) · 초3 11월. 11월 시험 → 12월 입학, 2월 시험 → 3월 입학. */
const HWANGSO_EXAMS=[58,61,70];
function hwangsoPlan(compBlocks){
  const c=compBlocks.find(b=>/1031 초급/.test(plain(b[0])));
  if(!c) return [];
  const w=HWANGSO_EXAMS.find(x=>x-4>c[2]);
  if(w==null) return [];
  return [['황소 개념 (3개월)',w-4,w-2],['황소 모의고사 (2개월)',w-1,w]];
}
const academyOn={soma:false,fields:false,hwangso:false};
/* 초등 구간 이어 붙이기 (원장님 2026-10-19 "초1 4월 중등 너무 빨라, 내 자료에 그 정도 근거는 없어")
   - 사고력은 P2(프리미어 2반 수준) 표보다 당기지 않는다(L0·L1·L2 = P2, L3 +5, L4 +10).
   - 교과·연산은 레벨 속도대로 잇되, 중등 시작은 아래 midFloor 바닥(초1 8월)과 여유 달로 조절한다.
   - 유아(데모) 줄은 P2 첫 교재 전까지 그대로 두고, 데모에서 이미 한 교재(같은 교재 이름)는 P2에서 다시 하지 않는다. */
function itemKey(t){
  const x=plain(t);
  let m=x.match(/기적의 계산법\s*(\d+)/); if(m) return 'calc'+m[1];
  m=x.match(/(\d-\d)\s*디딤돌/); if(m) return 'school'+m[1];
  const k=STEP_ORDER.find(k=>x.includes(k)); return k||x;
}
function joinRow(demoKey, demoShift, pBlocks, pShift, demoFilter){
  const D=(window.ROAD_L0||ROAD_L0)[demoKey].filter(b=>!demoFilter||demoFilter(b)).map(b=>[b.text.replace(/<br>/g,' '),b.s+demoShift,b.e+demoShift]);
  let P=pBlocks.map(([t,s,e])=>[t,s+pShift,e+pShift]);
  let Dk=[];
  for(let guard=0;guard<10&&P.length;guard++){
    const start=P[0][1];
    Dk=D.filter(b=>b[1]<start).map(([t,s,e])=>[t,s,Math.min(e,start-1)]);
    const done=new Set(Dk.map(b=>itemKey(b[0])));
    const before=P.length;
    while(P.length&&done.has(itemKey(P[0][0]))) P.shift();
    if(P.length===before) break;
  }
  return Dk.concat(P);
}
/* 중등·과학 규칙 (원장님 2026-10-19)
   - 필즈 S1 ≈ L1, L0는 그보다 조금 빠름. 중등 선행 시작: L0 초1 8월, L1 초1 11월, 그 아래는 레벨 속도대로 계단식(최소 여유 1개월).
   - 중등은 한 번 돌리고 끝이 아니다: 학기마다 원리해설(기본) + 중등 심화(A급)를 4개월에 함께 한다.
   - 중등 뒤: 공통수학1·2와 함께 중등 대수 심화 → 중등 기하 심화를 이어 가고, 그 뒤 KMO 또는 이과 상위권으로 갈린다.
   - 연산이 기준: 쉬지 않고 꾸준히, 중등 시작 달에 중학 연산(S1 표 순서·기간)이 오도록 기적의 계산법 7~12권을 거꾸로 놓는다.
   - 교과는 연산과 같은 학년·학기(필즈: 연산 진도가 곧 교과 진도). 기적 7권 = 4-1 디딤돌 응용 … 12권 = 6-2.
   - 과학: 중2-1(심화 포함)이 끝난 다음 달 중등과학. 그 앞 6개월 초5·6 과학, 그 앞 12개월 실험과학(거꾸로 계산).
     황소 대비를 켜면 L0~L3은 초2 9~10월 과학 쉼표. */
// 중등 시작(교과·중학 연산): L0 초1 8월, L1 초1 11월(원장님), L2~L4는 계단식(앞서 정한 값)
const MID_START=null; // 중등 시작 = 초1 8월(m 43) + 레벨 간격(3개월)
const MID_SEMS=['중1-1','중1-2','중2-1','중2-2','중3-1','중3-2'];
const MID_CALC=[['기적의 중학도형 1권',2],['기적의 중학연산 1AB',5],['기적의 중학도형 2권',2],['기적의 중학연산 2AB',4],['기적의 중학도형 3권',2],['기적의 중학연산 3AB',6]];
function seqFrom(start, items){ const out=[]; let m=start; items.forEach(([t,n])=>{ out.push([t,m,m+n-1]); m+=n; }); return out; }
function sciPlan(mid, comp){
  // 3) 과학: 중2-1 끝(= mid+11) 다음 달 중등과학, 거꾸로 초5·6 과학 6개월, 실험과학 12개월. 황소 대비를 켜면 L0~L3은 초2 9~10월 쉼표.
  const hw=hwangsoPlan(comp), pause=(academyOn.hwangso&&hw.length&&hw[1][2]===58)?[56,57]:[]; // 초2 11월에 보는 레벨만 9~10월 과학 쉼표
  let sciStart=mid+12; if(pause.length&&sciStart>=pause[0]-1&&sciStart<=pause[1]) sciStart=pause[1]+1;
  const label={};
  let m=sciStart-1;
  for(const [t,n] of [['초5·6 과학',6],['실험과학',12]]){ let k=n; while(k>0){ if(pause.includes(m)){ label[m]='쉼표 · 황소 대비'; m--; continue; } label[m]=t; m--; k--; } }
  for(let x=sciStart;x<=AX1;x++) label[x]=pause.includes(x)?'쉼표 · 황소 대비':'중등 과학';
  const sci=[]; Object.keys(label).map(Number).sort((a,b)=>a-b).forEach(x=>{ const t=label[x], last=sci[sci.length-1]; if(last&&last[0]===t&&last[2]===x-1) last[2]=x; else sci.push([t,x,x]); });
  return sci;
}
/* 천천히 가는 레벨(L10~): 원장님 2026-10-19
   "L10부터는 그렇게 교과를 빠르게 할 수가 없어. 방학 때 선행을 좀 더 나가고 평소에는 꼼꼼하게.
    응용 3개월 끝나고 심화 2개월, 연산은 겹치지 않게 5개월씩, 그 진도에 맞춰 사고력도 천천히."
   "같은 진도로 앞에도 해야지. 천천히 하지만 초2에 그렇게 하는 아이들도 있으니까."
   → 레벨은 초2 3월에 하는 학기로 정하고(L10 3-2 · L11 3-1 · L12 2-2 · L13 1-2), 그 학기가 초2 3월에 시작하도록
     앞뒤 모두 한 학기 = 디딤돌 응용 3개월 → 심화(최상위 수학) 2개월, 연산(기적 k권 = k번째 학기) 5개월.
     사고력·경시 병행도 같은 비율(3개월 → 5개월)로 초2 3월을 기준으로 늘린다. */
const SLOW_FROM='L10', SLOW_AT=50, SLOW_SEM=5;
function slowPlan(fast){
  const R=window.ROAD_L0||ROAD_L0, notTop=b=>!/최상위/.test(b.text);
  const now=fast.school.find(b=>b[1]<=SLOW_AT&&b[2]>=SLOW_AT&&/^\d-\d/.test(plain(b[0])));
  const [g0,h0]=plain(now[0]).match(/^(\d)-(\d)/).slice(1).map(Number), k0=2*(g0-1)+h0;
  const semAt=k=>SLOW_AT+(k-k0)*SLOW_SEM;
  // 1-1 앞의 유아 준비(수학 문장 이해 · 지문 이해)는 길이 그대로 1-1 바로 앞에
  const pre=R.school.filter(notTop).filter(b=>!/^\d-\d/.test(plain(b.text)));
  const preLen=pre.reduce((n,b)=>n+(b.e-b.s+1),0);
  const school=seqFrom(semAt(1)-preLen, pre.map(b=>[b.text.replace(/<br>/g,' '),b.e-b.s+1])), school2=[];
  const calc=[[plain(R.calc[0].text),semAt(1)-preLen,semAt(2)-1]];   // 소마셈 K: 1-2(기적 2권) 전까지
  for(let k=1;k<=12;k++){
    const m=semAt(k), g=Math.ceil(k/2), h=k%2?1:2;
    school.push([`${g}-${h} 디딤돌 ${g<=2?'기본+응용':'응용'}`,m,m+2]);
    school2.push([`${g}-${h} 심화<br><small>(최상위 수학)</small>`,m+3,m+4]);
    if(k>=2) calc.push([k>=7?`기적의 계산법 ${k}`:`기적의 계산법 ${k}권`,m,m+SLOW_SEM-1]);
  }
  const mid=semAt(13);
  school.push(...seqFrom(mid, MID_SEMS.map(x=>[x+' 원리해설',4])));
  school2.push(...seqFrom(mid, MID_SEMS.map(x=>[x+' 중등 심화(A급)',4])));
  calc.push(...seqFrom(mid, MID_CALC));
  const stretch=arr=>arr.map(([t,a,e])=>[t,SLOW_AT+Math.round((a-SLOW_AT)*SLOW_SEM/3),SLOW_AT+Math.round((e+1-SLOW_AT)*SLOW_SEM/3)-1]);
  const comp=stretch(fast.comp), comp2=stretch(P2.comp2.map(([t,a,e])=>[t,a+fast.pShift,e+fast.pShift]));
  return {comp,comp2,school,school2,calc,sci:sciPlan(mid,comp),mid,pShift:fast.pShift};
}
function levelPlan(id, shift){
  if(id!=='fast'&&shift>=L_SHIFT[SLOW_FROM]) return slowPlan(levelPlan('fast',shift));
  const pShift=Math.max(0,shift-L_SHIFT.L2);
  const notTop=b=>!/최상위/.test(b.text);
  const mid=43+shift;
  // 1) 유아 줄(데모)은 3-2 디딤돌(3개월)까지 그대로. 원장님 2026-10-19 "3-2 3개월 하고 조금씩 늘리면 되지".
  const demoAll=(window.ROAD_L0||ROAD_L0).school.filter(notTop).map(b=>[b.text.replace(/<br>/g,' '),b.s+shift,b.e+shift]);
  const k32=demoAll.findIndex(b=>/^3-2/.test(plain(b[0])));
  const demoSchool=demoAll.slice(0,k32+1), elemStart=demoSchool[k32][2]+1;
  // 2) 4-1~6-2: 3개월씩 + 남는 달을 뒤 학기부터 1개월씩 늘린다. 6-2 뒤 1개월은 '여유 · 초등 대수 심화'.
  const elemBooks=P2.calc.filter(b=>{const m=plain(b[0]).match(/기적의 계산법\s*(\d+)/); return m&&+m[1]>=7;}).map(b=>b[0]);
  const lens=elemBooks.map(()=>3); let extra=(mid-1)-elemStart-3*lens.length;
  for(let x=lens.length-1;extra>0;x=(x-1+lens.length)%lens.length){ lens[x]++; extra--; }
  const elemCalc=seqFrom(elemStart, elemBooks.map((t,x)=>[t,lens[x]]));
  // 교과는 연산과 같은 학년·학기(필즈: 연산 진도 = 교과 진도): 기적 k권 → (k+1)/2 학년, 홀수 1학기·짝수 2학기
  const derived=elemCalc.map(([t,s,e])=>{const k=+plain(t).match(/(\d+)/)[1]; return [`${Math.ceil(k/2)}-${k%2?1:2} 디딤돌 응용`,s,e];});
  elemCalc[elemCalc.length-1][2]=mid-1;   // 연산은 쉬지 않고 중등 시작 달까지
  const demoCalc=(window.ROAD_L0||ROAD_L0).calc.map(b=>[b.text.replace(/<br>/g,' '),b.s+shift,b.e+shift]).filter(b=>b[1]<elemStart).map(([t,s,e])=>[t,s,Math.min(e,elemStart-1)]);
  const calc=demoCalc.concat(elemCalc, seqFrom(mid, MID_CALC));
  const school=demoSchool.concat(derived,[['여유 · 초등 대수 심화<br><small>(선택)</small>',mid-1,mid-1]])
    .concat(seqFrom(mid, MID_SEMS.map(x=>[x+' 원리해설',4])))
    .concat(seqFrom(mid+24, [['공통수학1',3],['공통수학2',3],['진로: KMO 입문 또는 이과 상위권',12]]));
  const demoTop=(window.ROAD_L0||ROAD_L0).school.filter(b=>!notTop(b)).map(b=>[b.text.replace(/<br>/g,' '),b.s+shift,b.e+shift]);
  const topEnd=demoTop.length?demoTop[demoTop.length-1][2]:0;
  const school2=demoTop
    .concat(derived[0][1]<=mid-1?[['최상위 수학 꾸준히',Math.max(topEnd+1,derived[0][1]),mid-1]]:[])
    .concat(seqFrom(mid, MID_SEMS.map(x=>[x+' 중등 심화(A급)',4])))
    .concat(seqFrom(mid+24, [['중등 대수 심화',4],['중등 기하 심화',4]]));
  const comp=joinRow('thinking1',shift,P2.comp,pShift);
  const sci=sciPlan(mid,comp);
  return {comp,school,school2,calc,sci,mid,pShift};
}
function levelRows(shift){
  const id=(GRID.find(g=>g.shift===shift)||{id:'L2'}).id;
  const P=levelPlan(id,shift);
  const sh=(arr,d)=>arr.map(([t,s,e])=>[t,s+d,e+d]);
  return [
    {key:'school',label:'교과',blocks:P.school},
    {key:'school2',label:'교과 심화',blocks:P.school2},
    {key:'comp',label:'사고력·경시',blocks:P.comp},
    {key:'comp2',label:'경시 병행',blocks:P.comp2||sh(P2.comp2,P.pShift)},
    {key:'calc',label:'연산',blocks:P.calc},
    {key:'sci',label:'과학',blocks:P.sci}
  ].concat(academyOn.hwangso?[{key:'hwangso',label:'황소 대비<br><small>(선택)</small>',blocks:hwangsoPlan(P.comp)}]:[]);
}
// 학년은 3월에 바뀐다(원장님 2026-10-20 "개학 안 한 2월은 2학년"). 초1 입학 전 1·2월은 7세, 초2 1·2월은 초1로 읽는다.
// 유아 5세·6세는 달력 그대로(필즈 S1 표도 7세 1월부터 시작해 다음 해 2월까지 7세).
function schoolYear(m){ const y=Math.floor(m/12); return (y>=3&&m%12<2)?y-1:y; }
function monthLabel(m){ return ['5세','6세','7세','초1','초2','초3','초4','초5','초6'][schoolYear(m)]+' '+(m%12+1)+'월'; }
function axisYears(){
  const names=['5세','6세','7세','초1','초2','초3','초4'], out=[];
  for(let m=AX0;m<=AX1;m++){ const y=schoolYear(m); if(!out.length||out[out.length-1].y!==y) out.push({y,m0:m,name:names[y],n:0}); out[out.length-1].n++; }
  return out;
}
/* 예시 로드맵(원장님 2026-10-20): 초2 9월 5-1 응용부터 2개월 단위, 10월부터 최상위 S 병행,
   초3 5월 대수 정리 → 초3 9월 중등. 사고력은 초2 10월 1031 초급 → 초3 5월 3% 1과정(황소 대비 겸) → 초3 11월 황소.
   영재원 코스도 함께. 초2 8월까지는 L9(초2 3월 4-1)와 같다. */
function conceptRows(){
  const base=levelRows(L_SHIFT.L9), R=k=>(base.find(r=>r.key===k)||{blocks:[]}).blocks;
  const upTo=(arr,cut)=>arr.filter(b=>b[1]<cut).map(([t,a,e])=>[t,a,Math.min(e,cut-1)]);
  const sem=['5-1','5-2','6-1','6-2'], mid=68;
  const school=upTo(R('school'),56).concat(sem.map((x,i)=>[x+' 디딤돌 응용',56+2*i,57+2*i]),[['계통 (5·6학년·중1)<br><small>대수 정리</small>',64,67]],
    seqFrom(mid, MID_SEMS.map(x=>[x+' 원리해설',4])));
  const school2=upTo(R('school2'),57).concat(['4-1','4-2','5-1','5-2'].map((x,i)=>[x+' 최상위 S',57+2*i,58+2*i]),
    seqFrom(mid, MID_SEMS.map(x=>[x+' 중등 심화(A급)',4])));
  const early=R('comp').filter(b=>!/1031 (초급|중급)|3%|왕수학/.test(plain(b[0])));
  const ip=early.findIndex(b=>/1031 입문/.test(plain(b[0])));
  const comp=upTo(early.slice(0,ip),early[ip][1]).concat([['1031 입문 + workbook',early[ip][1],53],['TOT 2단계',54,56],['1031 초급',57,63],
    ['3% 1과정',64,67]]);
  const calc=upTo(R('calc'),56).concat(sem.map((x,i)=>[`기적의 계산법 ${9+i}`,56+2*i,57+2*i]),[['초등연산 보충',64,67]],seqFrom(mid, MID_CALC));
  const hw=[['황소 공부<br><small>(편입 위주)</small>',59,60],['황소 시험',61,61],['황소 4-1 편입<br><small>(합격 시)</small>',62,62],
    ['황소 심화 개념 3개월<br><small>(심화 고려 시)</small>',65,67],['황소 심화 모의고사 2개월<br><small>(심화 고려 시)</small>',68,69],['황소 합격 후 고민<br><small>(중등 라인은 계속)</small>',70,70]]; // 원장님 손그림 2026-10-20
  // 영재원(2026-10-20 확인): 가천대 과학영재교육원 브릿지(장기관찰) — 2026년 기준 2~3월 접수, 3~4월 온라인 과제, 5월 면접, 5~9월 관찰수업(서울·경기 초등).
  // 교육청 영재원 — 강남서초 2027학년도: 11/4~11/11 지원, 12/5 평가(대상 학년은 요강 첨부파일 확인 필요).
  const gifted=[['가천대 브릿지 접수·온라인 과제',61,63],['가천대 브릿지 관찰수업',64,68],['교육청 영재원 지원·평가<br><small>(11월 지원 · 12월 평가)</small>',70,71],['영재원 수업<br><small>(합격 시)</small>',74,83]];
  return [
    {key:'school',label:'교과',blocks:school},
    {key:'school2',label:'교과 심화',blocks:school2},
    {key:'comp',label:'사고력·경시',blocks:comp},
    {key:'hwangso',label:'황소',blocks:hw},
    {key:'calc',label:'연산',blocks:calc},
    {key:'sci',label:'과학',blocks:sciPlan(mid,comp)},
    {key:'gifted',label:'영재원 코스',blocks:gifted}
  ];
}
const CONCEPT={id:'예시',cls:'l2',summary:'초2 9월 5-1부터<br>2개월 단위 → 초3 9월 중등<br>(원장님 손그림)',rows:null};
function renderLevels(nowM, bestId, only, custom){
  const n=AX1-AX0+1, years=axisYears();
  let h='<table class="sr-table lv-table"><colgroup><col class="sr-g"><col class="sr-l">';
  for(let i=0;i<n;i++) h+='<col class="sr-m">';
  h+='</colgroup><thead><tr><th colspan="2" rowspan="2" class="sr-corner"></th>'+years.map(y=>`<th colspan="${y.n}" class="sr-year">${y.name}</th>`).join('')+'</tr><tr>';
  for(let m=AX0;m<=AX1;m++) h+=`<th class="sr-mon${m===nowM?' lv-now':''}">${m%12+1}</th>`;
  h+='</tr></thead><tbody>';
  ['soma','fields'].filter(k=>academyOn[k]).forEach(k=>{
    const A=ACADEMY[k];
    h+=`<tr class="lv-academy"><th class="sr-group" colspan="2">${A.label}</th>`;
    for(let m=AX0;m<=AX1;m++){ const p=A.points.find(x=>x[1]===m); h+=p?`<td class="sr-cell" style="background:${A.color}">${p[0]}</td>`:`<td class="sr-empty${m===nowM?' lv-now':''}"></td>`; }
    h+='</tr>';
  });
  if(academyOn.hwangso){
    h+=`<tr class="lv-academy"><th class="sr-group" colspan="2">황소 시험</th>`;
    // 11월 시험 → 12월 입학, 2월 시험 → 3월 입학(원장님 2026-10-20)
    for(let m=AX0;m<=AX1;m++) h+=HWANGSO_EXAMS.includes(m)?`<td class="sr-cell" style="background:#fde68a">황소<br>시험</td>`:HWANGSO_EXAMS.includes(m-1)?`<td class="sr-cell" style="background:#fef3c7">황소<br>입학</td>`:`<td class="sr-empty${m===nowM?' lv-now':''}"></td>`;
    h+='</tr>';
  }
  // 원장님 자료: 교대 영재원 초3 7~9월, 대학 부설·교육청 영재원 3학년 9~10월 → 칸이 겹치지 않게 7~8월 / 9~10월로 나눠 매년 표시
  const GIFTED=[[66,67,'교대 영재원'],[68,69,'대학 부설·교육청 영재원'],[78,79,'교대 영재원'],[80,81,'대학 부설·교육청 영재원']];
  h+=`<tr class="lv-academy"><th class="sr-group" colspan="2">영재원<br><small>(매년 같은 시기)</small></th>`;
  for(let m=AX0;m<=AX1;){ const g=GIFTED.find(x=>x[0]===m); if(g){ h+=`<td class="sr-cell sr-gifted" colspan="${g[1]-g[0]+1}">${g[2]}</td>`; m=g[1]+1; } else { h+=`<td class="sr-empty${m===nowM?' lv-now':''}"></td>`; m++; } }
  h+='</tr>';
  h+=`<tr class="sr-gap"><td colspan="${n+2}"></td></tr>`;
  const levels=custom||GRID.filter(L=>!only||only.includes(L.id));
  levels.forEach((L,li)=>{
    const rows=L.rows||levelRows(L_SHIFT[L.id]||0), best=L.id===bestId;
    rows.forEach((r,ri)=>{
      h+=`<tr class="${best?'lv-best':''}">`;
      if(ri===0) h+=`<th class="sr-group lv-name ${L.cls}" rowspan="${rows.length}">${L.id}<small>${L.summary}</small>${L_LOAD[L.id]?`<small class="lv-load">${L_LOAD[L.id]}</small>`:''}${best?'<em>우리 아이</em>':''}</th>`;
      h+=`<th class="lv-row">${r.label}</th>`;
      const cells=r.blocks.map(([t,s,e])=>[t,Math.max(s,AX0),Math.min(e,AX1)]).filter(([,s,e])=>s<=e).sort((a,b)=>a[1]-b[1]);
      let m=AX0;
      for(const [t,s,e] of cells){
        if(s<m) continue; // 겹치면 앞 칸 우선
        for(;m<s;m++) h+=`<td class="sr-empty${m===nowM?' lv-now':''}"></td>`;
        const swap=false;
        h+=`<td class="sr-cell${swap?' sr-swap':''}" colspan="${e-s+1}" style="background:${(ROW_COLORS[r.key]||'#f1f5f9')}">${t}</td>`;
        m=e+1;
      }
      for(;m<=AX1;m++) h+=`<td class="sr-empty${m===nowM?' lv-now':''}"></td>`;
      h+='</tr>';
    });
    if(li<levels.length-1) h+=`<tr class="sr-gap"><td colspan="${n+2}"></td></tr>`;
  });
  return h+'</tbody></table>';
}
/* ---------- 우리 아이 레벨 vs 한 단계 위: 표 + 사고력 진도 그래프 ---------- */
const STEP_ORDER=['킨더팩토','키즈팩토','초등팩토 1','필즈 베이직','1031 입문','1031 초급','1031 중급','3% 1과정','왕수학 응용 4','3% 2과정','황소 대비'];
const plain=t=>t.replace(/<[^>]+>/g,' ').replace(/&lt;|&gt;/g,'').replace(/\s+/g,' ').trim();
function stepIndex(text){ const t=plain(text); return STEP_ORDER.findIndex(k=>t.includes(k)); }
function progressPoints(shift){
  const comp=levelRows(shift).find(r=>r.key==='comp');
  const pts=[];
  comp.blocks.forEach(([t,s,e])=>{ const i=stepIndex(t); if(i<0) return; pts.push([s,i],[e+1,i+1]); });
  return pts;
}
function renderGraph(pair, nowM, child){
  const W=960,H=330,pl=110,pr=20,pt=20,pb=46, pw=W-pl-pr, ph=H-pt-pb, n=STEP_ORDER.length;
  const X=m=>pl+(Math.max(AX0,Math.min(AX1+1,m))-AX0)/(AX1+1-AX0)*pw, Y=v=>pt+ph-(v/n)*ph;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="lv-graph" role="img" aria-label="사고력 진도 비교 그래프">`;
  STEP_ORDER.forEach((k,i)=>{ s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(i+0.5)}" y2="${Y(i+0.5)}" stroke="#eef2f7"/><text x="${pl-6}" y="${Y(i+0.5)+4}" text-anchor="end" font-size="11" fill="#64748b">${k}</text>`; });
  axisYears().forEach(y=>{ const m0=y.m0; s+=`<line x1="${X(m0)}" x2="${X(m0)}" y1="${pt}" y2="${H-pb}" stroke="#cbd5e1" stroke-dasharray="3 3"/><text x="${X(m0)+4}" y="${H-pb+18}" font-size="12" font-weight="700" fill="#334155">${y.name}</text>`; });
  const colors=['#94a3b8','#7c3aed'];
  pair.forEach((L,i)=>{
    const pts=progressPoints(L.shift);
    s+=`<polyline fill="none" stroke="${colors[i]}" stroke-width="${i?3:2.5}" ${i?'':'stroke-dasharray="6 4"'} points="${pts.map(([m,v])=>X(m)+','+Y(v)).join(' ')}"/>`;
    const last=pts[pts.length-1]; if(last) s+=`<text x="${Math.min(X(last[0])+4,W-pr-40)}" y="${Y(last[1])-6}" font-size="12" font-weight="800" fill="${colors[i]}">${L.id}</text>`;
  });
  if(child&&nowM!=null){
    const i=stepIndex(child.key); if(i>=0){ const v=i+(child.pos==='end'?1:0.5);
      s+=`<line x1="${X(nowM)}" x2="${X(nowM)}" y1="${pt}" y2="${H-pb}" stroke="#7c3aed" stroke-opacity=".35"/><circle cx="${X(nowM)}" cy="${Y(v)}" r="7" fill="#f59e0b" stroke="#fff" stroke-width="2"/><text x="${X(nowM)+10}" y="${Y(v)+4}" font-size="12" font-weight="900" fill="#b45309">우리 아이</text>`; }
  }
  return s+'</svg>';
}
let lastArgs=null;
function setAcademy(soma,fields,hwangso){ academyOn.soma=!!soma; academyOn.fields=!!fields; academyOn.hwangso=!!hwangso; if(lastArgs) showLevels(...lastArgs); }
function showLevels(nowM,bestId,child){
  lastArgs=[nowM,bestId,child];
  const box=document.getElementById('lvTable');
  if(box) box.innerHTML=renderLevels(nowM,bestId);
  const cbox=document.getElementById('lvConcept');
  if(cbox){ CONCEPT.rows=conceptRows(); cbox.innerHTML=renderLevels(nowM,null,null,[CONCEPT]); }
  const levels=GRID, bi=levels.findIndex(L=>L.id===bestId);
  const cmp=document.getElementById('lvCompare');
  if(!cmp||bi<0) return;
  const pair=bi>0?[levels[bi-1],levels[bi]]:[levels[bi]];
  document.getElementById('lvCompareTitle').textContent=bi>0?`우리 아이(${levels[bi].id})와 한 단계 위(${levels[bi-1].id}) 비교`:`우리 아이(${levels[bi].id}) — 가장 빠른 기준과 같은 흐름입니다`;
  cmp.innerHTML=`<div class="lv-graph-wrap">${renderGraph(pair,nowM,child)}<div class="lv-graph-legend">${bi>0?`<span class="lg-up">— — ${levels[bi-1].id} 한 단계 위</span>`:''}<span class="lg-me">━ ${levels[bi].id} 우리 아이 레벨</span><span class="lg-dot">● 지금 우리 아이</span></div></div><div class="table-wrapper sr-wrap">${renderLevels(nowM,bestId,pair.map(L=>L.id))}</div>`;
}

function renderKeyRules(){
  const box=document.getElementById('keyRules'); if(!box) return;
  const t=TABLES.find(x=>x.key==='hwangso');
  box.innerHTML='<div class="kr-title">7세 후반 ~ 초1 초반 핵심 기준</div><ul>'+t.notes.map(x=>`<li>${x}</li>`).join('')+'</ul><div class="kr-src">원장님 「2023 프리미어에서 황소 경시를 위한 ROADMAP」 메모</div>';
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',renderKeyRules); else renderKeyRules();
// 레벨 설명: L0~L4는 데모 설명, L5부터는 초2 3월(m 50)에 하는 교과
function gridSummaries(){
  GRID.forEach(g=>{
    const L=(window.LEVELS||LEVELS).find(x=>x.id===g.id);
    if(L){ g.summary=L.summary; return; }
    const b=levelPlan(g.id,g.shift).school.find(x=>x[1]<=50&&x[2]>=50);
    g.summary='초2 3월 교과<br>'+(b?plain(b[0]):'—');
  });
}
// 아이 입력(유아 교재)으로 가장 가까운 레벨: 데모와 같은 계산(levelStdMonth)을 3개월 단위 전체에 적용
function bestGrid(d){
  if(typeof currentPositions!=='function') return null;
  const cur=currentPositions(d), now=studentNowMonth(d.age);
  let best=null;
  GRID.forEach(g=>{
    const t=levelStdMonth(g.shift,'thinking1',cur.thinking1), sc=levelStdMonth(g.shift,'school',cur.school), c=levelStdMonth(g.shift,'calc',cur.calc);
    const dT=t!=null?now-t:0, dS=sc!=null?now-sc:0, dC=c!=null?now-c:0, avg=(dT+dS+dC)/3;
    if(!best||Math.abs(avg)<Math.abs(best.avg)) best={id:g.id,dT,dS,dC,avg};
  });
  return best;
}
gridSummaries();
window.SchoolRoadmap={monthLabel,TABLES,show,init,showLevels,levelRows,setAcademy,GRID,bestGrid};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
