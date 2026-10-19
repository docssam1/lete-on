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
     L2를 기준(0)으로 두고 L0 −7 · L1 −4 · L3 +5 · L4 +10개월을 똑같이 민다(같은 속도).
   - 줄마다 데모의 마지막 교재 바로 뒤에서 이어지도록 맞춘 값(OFF)을 쓴다. 기간(칸 수)은 원본 그대로다.
   - 월 값 m: 5세 1월=0, 6세=12, 7세=24, 초1(8세)=36, 초2=48, 초3=60.
   ============================================================ */
const P2={
  school:[['3-1 디딤돌 응용',26,27],['3-2 디딤돌 응용',28,29],['4-1 디딤돌 응용',30,32],['4-2 디딤돌 응용',33,35],['5-1 디딤돌 응용',36,38],['5-2 디딤돌 응용',39,41],['6-1 디딤돌 응용',42,44],['6-2 디딤돌 응용',45,47],['중1-1',48,50],['중1-2',51,52],['중2-1',53,56],['중2-2',57,58]],
  school2:[['3학년 최상위(선택)',36,41],['4학년 최상위 이후 꾸준히',42,47]],
  comp:[['1031 입문 + workbook',26,29],['1031 초급',30,36],['1031 중급',37,43],['3% 1과정 + P 중급 완료',44,47],['왕수학 응용 4',48,50],['3% 2과정 주요 문항',51,53],['황소 대비',54,58]],
  comp2:[['성대경시 대비',36,37],['성대경시 대비',42,43],['왕수학 올림피아드 3<br>+ 대비 문항',48,50]],
  calc:[['기적의 계산법 5',23,25],['기적의 계산법 6',26,28],['기적의 계산법 7',29,31],['기적의 계산법 8',32,34],['기적의 계산법 9',35,37],['기적의 계산법 10',38,40],['기적의 계산법 11',41,43],['기적의 계산법 12',44,46],['중1 연산',47,49]]
};
// 줄별 이음 값(L0 기준): 데모 L0의 마지막 교재 다음 달에 P2 표 첫 칸이 오도록
const OFF={school:-9, comp:-7, calc:-8};
const L_SHIFT={L0:0,L1:3,L2:7,L3:12,L4:17}; // 데모 LEVELS의 shift와 같다
const AX0=4, AX1=71; // 5세 5월 ~ 초3 12월
const ROW_COLORS={school:'#dbeafe',school2:'#e0f2fe',comp:'#ede9fe',comp2:'#fce7f3',calc:'#dcfce7'};

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
const academyOn={soma:false,fields:false};
function levelRows(shift){
  const sh=(arr,d)=>arr.map(([t,s,e])=>[t,s+d,e+d]);
  return [
    {key:'school',label:'교과',blocks:sh(demoPrefix('school','3-1 디딤돌'),shift).concat(sh(P2.school,OFF.school+shift))},
    {key:'school2',label:'교과 심화',blocks:sh(P2.school2,OFF.school+shift)},
    {key:'comp',label:'사고력·경시',blocks:sh(demoPrefix('thinking1','1031 입문'),shift).concat(sh(P2.comp,OFF.comp+shift))},
    {key:'comp2',label:'경시 병행',blocks:sh(P2.comp2,OFF.comp+shift)},
    {key:'calc',label:'연산',blocks:sh(demoPrefix('calc','기적의 계산법 5권'),shift).concat(sh(P2.calc,OFF.calc+shift))}
  ];
}
function axisYears(){
  const names=['5세','6세','7세','초1','초2','초3'], out=[];
  for(let m=AX0;m<=AX1;m++){ const y=Math.floor(m/12); if(!out.length||out[out.length-1].y!==y) out.push({y,name:names[y],n:0}); out[out.length-1].n++; }
  return out;
}
function renderLevels(nowM, bestId, only){
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
  if(academyOn.soma||academyOn.fields) h+=`<tr class="sr-gap"><td colspan="${n+2}"></td></tr>`;
  const levels=(window.LEVELS||LEVELS).filter(L=>!only||only.includes(L.id));
  levels.forEach((L,li)=>{
    const rows=levelRows(L_SHIFT[L.id]||0), best=L.id===bestId;
    rows.forEach((r,ri)=>{
      h+=`<tr class="${best?'lv-best':''}">`;
      if(ri===0) h+=`<th class="sr-group lv-name ${L.cls}" rowspan="${rows.length}">${L.id}<small>${L.summary}</small>${best?'<em>우리 아이</em>':''}</th>`;
      h+=`<th class="lv-row">${r.label}</th>`;
      const cells=r.blocks.map(([t,s,e])=>[t,Math.max(s,AX0),Math.min(e,AX1)]).filter(([,s,e])=>s<=e).sort((a,b)=>a[1]-b[1]);
      let m=AX0;
      for(const [t,s,e] of cells){
        if(s<m) continue; // 겹치면 앞 칸 우선
        for(;m<s;m++) h+=`<td class="sr-empty${m===nowM?' lv-now':''}"></td>`;
        const swap=false;
        h+=`<td class="sr-cell${swap?' sr-swap':''}" colspan="${e-s+1}" style="background:${ROW_COLORS[r.key]}">${t}</td>`;
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
  axisYears().forEach(y=>{ const m0=y.y*12+(y.y===Math.floor(AX0/12)?AX0%12:0); s+=`<line x1="${X(m0)}" x2="${X(m0)}" y1="${pt}" y2="${H-pb}" stroke="#cbd5e1" stroke-dasharray="3 3"/><text x="${X(m0)+4}" y="${H-pb+18}" font-size="12" font-weight="700" fill="#334155">${y.name}</text>`; });
  const colors=['#94a3b8','#7c3aed'];
  pair.forEach((L,i)=>{
    const pts=progressPoints(L_SHIFT[L.id]);
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
function setAcademy(soma,fields){ academyOn.soma=!!soma; academyOn.fields=!!fields; if(lastArgs) showLevels(...lastArgs); }
function showLevels(nowM,bestId,child){
  lastArgs=[nowM,bestId,child];
  const box=document.getElementById('lvTable');
  if(box) box.innerHTML=renderLevels(nowM,bestId);
  const levels=(window.LEVELS||LEVELS), bi=levels.findIndex(L=>L.id===bestId);
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
window.SchoolRoadmap={TABLES,show,init,showLevels,levelRows,setAcademy};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
