/* ============================================================
   초등 이후 로드맵 — 원장님 원본 표 4장을 칸 위치 그대로 옮긴 것
   - 각 표는 자기 원본의 학년·월 머리를 그대로 쓴다(표끼리 축을 합치지 않는다).
   - 칸: [시작 열, 끝 열(포함), 글자, 행 수(기본 1), 표시]
   - 교재 이름은 원본 그대로. 팩토는 초등팩토 1까지만 두기로 해서(원장님 2026-10-19),
     그 뒤에 남은 팩토 칸은 'swap'으로 표시만 하고 임의로 바꾸지 않는다.
   ============================================================ */
(function(){
'use strict';

function months(spec){ // [['초1',[7,8,...]], ...] → 머리 두 줄
  const cols=[]; spec.forEach(([y,ms])=>ms.forEach(m=>cols.push({y,m}))); return {spec,cols};
}

const TABLES=[
 {
  key:'std',
  button:'기본 · GFIELD 표준 Class',
  title:'GFIELD 표준 Class (초1~초3)',
  source:'원본: 로드맵 (2023-06).pdf',
  axis:months([['초1',[7,8,9,10,11,12,1,2]],['초2',[3,4,5,6,7,8,9,10,11,12,1,2]],['초3',[3,4,5,6,7,8,9,10,11,12,1,2,3]]]),
  groups:[
   {label:'연산<br>교과',rows:[
     [[0,1,'&lt;3-1&gt;',2],[2,3,'&lt;3-2&gt;',2],[4,5,'4-1 응용'],[6,7,'4-2 응용'],[8,9,'5-1 응용'],[10,11,'5-2 응용'],[12,13,'6-1 응용'],[14,15,'6-2 응용'],[16,20,'계통 5개월<br>(5,6 심화/중1)',2],[21,24,'중1<br>(원리해설 + 개플 파워 + 최상위)',2],[25,28,'중2',2],[29,32,'중3',2]],
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
     [[0,3,'파워업 JUMP 1,2<br><small>(초등기하)</small>'],[4,6,'팩토 lv.3 A,B','','swap'],[7,8,'최상위 3-1'],[9,9,'성대<br>경시'],[10,11,'최상위 3-2'],[12,14,'최상위 4-1,2'],[15,15,'성대<br>경시'],[16,16,'최상위<br>4-2'],[17,20,'최상위 &lt;5-1&gt;,&lt;5-2&gt;'],[21,21,'성대<br>경시'],[22,25,'최상위 6-1,2'],[26,26,'중<br>1-1'],[27,27,'성대<br>경시'],[28,29,'중 1-1'],[30,33,'중 2-1']]
   ]},
   {label:'방특',rows:[
     [[19,20,'3% 1과정'],[26,26,'중등'],[31,32,'3% 2과정']]
   ]},
   {label:'GFIELD 표준<br>연산·교과',rows:[
     [[0,1,'&lt;3-2&gt; 응용',2],[2,3,'4-1 응용<br>3-1 최상위 레벨업 및 유사',2],[4,5,'4-2 응용<br>3-2 최상위 레벨업 및 유사',2],[6,7,'4-1 최상위<br>또는 같은 급 / 문해길 3',2],[8,9,'4-2 최상위<br>또는 같은 급 / 문해길 3',2],[10,11,'5-1 응용'],[12,13,'5-2 응용'],[14,15,'6-1 응용'],[16,17,'6-2 응용'],[18,21,'계통 5개월<br>(5,6 심화/중1)<br><small>수행률에 따라 중등으로 진행(중1연산 완료)</small>',2],[22,25,'중1<br>(원리해설 + 최상위 또는 센)',2],[26,27,'중2-1',2],[28,29,'황소<br>실전<br>모의',2],[30,31,'중 2-2',2],[32,33,'중 3-1',2]],
     [[10,17,'초등 대수,기하 중급']]
   ]},
   {label:'추천 경시<br>문제 해결력<br><small>(+ 수업)</small>',rows:[
     [[0,1,'1031 입문 +<br>workbook',2],[2,5,'필즈 초급 하 + 1031 초급 미션<br>팩토 3 핵심문항','','swap'],[6,8,'필즈 초급 상<br>+ 1031 초급 미션'],[9,10,'성대 전기<br>대비'],[11,15,'필즈 중급 상,하<br>+ 1031 중급'],[16,19,'3% 1과정 / 성대 후기'],[20,22,'왕수학 응용 4 / 황소 개념'],[23,26,'황소 심화 개념 및<br>중급 모의고사',2],[27,29,'3% 2과정<br>핵심 개념<br>및 실전 모의',2]],
     [[2,6,'성대 후기 모의고사 및 권별 테스트'],[7,17,'P 중급 개념'],[18,19,'1031 초급 심화'],[20,22,'왕수학 올림피아드 3<br>+ 대비 문항']]
   ]}
  ],
  notes:[
   '필즈 초급 / 1031 초급 시작 전 반드시 기적의 계산법 7권 완료 후 3-1 최상위 또는 4-1 응용 학습이 가능하도록 만들어야 합니다.',
   '7세와 초1의 1031 또는 필즈 초급 과정은 지문 이해와 스킬에 초점을 맞춰 공부하고, 초1 겨울에 초급 심화 문제만 압축하여 공부합니다. (황소 시험 3개월 전 수행률 75% 이상 만들기)',
   '교과는 소마에서 최상위를 진행하기 전 예습한다는 느낌으로 진행하다가 5-1 과정부터 빠르게 진행합니다. 연산과 지문 이해가 되어 있으면 계통 수업 없이 중등 기본으로, 안 되어 있으면 계통으로 초5,6·중1을 진행하고 중등 응용을 진행합니다.',
   '황소 개념 및 대비 시기에는 유형별보다 여러 유형을 혼합하여 공부해야 수행률을 높일 수 있습니다.'
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
     [[0,0,'6-1,2 응용 완료',2],[1,3,'대수 계통'],[4,5,'중 1-1 개념+유형'],[6,7,'중 1-2 개념+유형'],[8,10,'중 2-1 개념+유형'],[11,12,'중 2-1 원리해설'],[13,14,'중 2-2 원리해설'],[15,16,'중 3-1 원리해설'],[17,18,'중 3-2 원리해설'],[19,20,'3-1 최상위']],
     [[1,3,'5-1,2 심화'],[4,6,'6-1,2 심화'],[7,8,'TOT 3단계'],[9,10,'왕수학 응용 4'],[11,12,'중 1-1 최상위'],[13,14,'중 1-2 최상위'],[15,16,'중 2-1 최상위'],[17,18,'중 2-2 최상위'],[19,20,'3-2 최상위']]
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
     [[0,0,'중 1-1 응용<br>원리해설+<br>개플 파워'],[1,4,'중 2-1 응용'],[5,6,'중 2-2 응용'],[7,8,'3-1 응용'],[9,10,'3-2 응용'],[11,12,'3-2 심화',2],[13,15,'수학 상 정석<br>+ RPM',2],[16,18,'수학 하 정석<br>+ RPM',2],[19,27,'진로 확정 KMO 입문 또는 이과커리<br>(EX 실력 정석 + 중등 심화+평기하)',2]],
     [[1,2,'1-1 심화'],[3,4,'1-2 응용'],[5,6,'2-1 심화'],[7,8,'2-2 심화'],[9,10,'3-1 심화']]
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
  if(hasSwap) items.push('‘교재 교체 예정’ 칸: 팩토는 초등팩토 1까지만 두고, 이후는 PRE 1031 또는 다른 교재로 바꿀 예정입니다.');
  notes.innerHTML=items.length?'<ul>'+items.map(x=>`<li>${x}</li>`).join('')+'</ul>':'';
}

function init(){
  const box=document.getElementById('srTabs');
  if(!box) return;
  box.innerHTML=TABLES.map(t=>`<button type="button" class="sr-tab" data-key="${t.key}">${t.button}</button>`).join('');
  box.addEventListener('click',e=>{ const b=e.target.closest('.sr-tab'); if(b) show(b.dataset.key); });
  show('std');
}
window.SchoolRoadmap={TABLES,show,init};
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
