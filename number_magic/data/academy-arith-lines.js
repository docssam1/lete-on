/* ============================================================
   소마·필즈 반별 연산 진도선 — 8세 이하 진단 결과의 비교 그래프(2026-11-17)
   원장 2026-11-09~10 설계(「필즈 E1·E2·S, 소마 A1·A2(B)·챌린지·프리미어 진도에 따른 연산 로드맵」
   「꺾은선 그래프」「지금 속도면, 주 2회면 언제」) → 2026-11-17 「8세 이하라면 소마와 필즈 진도 레벨별
   연산 로드맵과 비교하는 그래프를 주기로 했는데」.

   ■ 가로(m): 달. 0 = 7세(한국 나이) 해의 1월, 12 = 초1 1월, 24 = 초2 1월. 음수는 6세.
   ■ 세로(v): 연산 내용의 학년. 1 = 1학년 1학기 시작, 1.5 = 1학년 2학기, … 6.5 = 6학년 2학기, 7 = 중등.
       더클셈·기적의 계산법은 원장 판단대로 「N권 = 한 학기」(v = 1 + (N−1)/2): 5권 = 3학년 1학기.
   ■ end = 원표(또는 계산한 줄)가 끝나는 달. 그 뒤는 「표 밖」.
   ■ 점 = 그 달에 그 책을 시작한다. 점과 점 사이는 곧은 선(그 책을 푸는 동안).
   ■ source 'table' = 원장이 보낸 원표 사진에서 옮긴 달(칸 경계는 눈으로 읽어 한 달쯤 어긋날 수 있음).
     source 'shift' = 원장 말대로 다른 반 줄을 몇 달 밀거나 당겨 계산한 달(원표 아님).
   ■ 소마는 학원 사고력 과정이 아니라 「연산 교재」 줄만(원장 2026-11-09 「소마는 학원과 연산 교재 달라」 「연산만」).
   ■ 화면: app/academy-compare.js. 원표·계산 방식이 바뀌면 이 파일만 고친다.
   ============================================================ */
(function(root){
  'use strict';
  const T=(ko,en,zh)=>({ko,en,zh});
  /* 필즈 E1 연산 책(원표: 「2026 7세 E1반 운영 로드맵」). 응용UP 7·8권(초1 4~8월)은 4학년 연산 다지기라
     선을 4.5에서 9권(5.0)까지 천천히 잇는다. 중학도형(초2 9~11월)은 도형이라 선에 넣지 않는다. */
  const E1=[
    [0,1.5,T('더클셈 2권','The Classic Calc vol. 2','The Classic Calc 第2册')],
    [2,2,T('더클셈 3권','The Classic Calc vol. 3','The Classic Calc 第3册')],
    [4,2.5,T('더클셈 4권','The Classic Calc vol. 4','The Classic Calc 第4册')],
    [6,3,T('더클셈 5권','The Classic Calc vol. 5','The Classic Calc 第5册')],
    [8,3.5,T('더클셈 6권','The Classic Calc vol. 6','The Classic Calc 第6册')],
    [10,4,T('더클셈 7권','The Classic Calc vol. 7','The Classic Calc 第7册')],
    [12,4.5,T('더클셈 8권 → 기적 응용UP 7·8권','The Classic Calc vol. 8 → Miracle Applied 7–8','The Classic Calc 第8册 → 奇迹应用UP 7·8册')],
    [20,5,T('더클셈 9권','The Classic Calc vol. 9','The Classic Calc 第9册')],
    [23,5.5,T('더클셈 10권','The Classic Calc vol. 10','The Classic Calc 第10册')],
    [26,6,T('더클셈 11권','The Classic Calc vol. 11','The Classic Calc 第11册')],
    [29,6.5,T('더클셈 12권','The Classic Calc vol. 12','The Classic Calc 第12册')],
    [35,7,T('중학연산 1AB','Middle-school arithmetic 1AB','初中运算1AB')]
  ];
  /* 소마 챌린지반 연산 교재(원표: 「2026 7세 Challenge 로드맵 (2026.06)」, 7세 5월~초2 2월만 있음).
     「소마연산 N학년」은 교재 이름 — 반년에 한 학년씩. 경시 달(3·9월)은 원표대로 쉬는 달이 있다. */
  const CH=[
    [4,2,T('두 자리·세 자리 덧뺄셈','2- and 3-digit addition/subtraction','两位·三位加减')],
    [7,3,T('소마연산 3학년','SOMA Arithmetic Grade 3','SOMA运算3年级')],
    [12,4,T('소마연산 4학년','SOMA Arithmetic Grade 4','SOMA运算4年级')],
    [18,5,T('소마연산 5학년','SOMA Arithmetic Grade 5','SOMA运算5年级')],
    [24,6,T('소마연산 6학년','SOMA Arithmetic Grade 6','SOMA运算6年级')]
  ];
  /* 소마 A반 연산 교재(원표: A반 운영표 · 6세 로드맵, 초1 7월까지). 소마셈 A5~A8 = 두 자리와 한 자리(1학년 2학기),
     B1~B4 = 두·세 자리 덧뺄셈(2학년 1학기), B5~B8 = 곱셈·나눗셈(2학년 2학기). 권당 4주. */
  const SA=[
    [-2,1.5,T('소마셈 A5','SOMA-sem A5','SOMA算 A5')],
    [2,2,T('소마셈 B1','SOMA-sem B1','SOMA算 B1')],
    [6,2.5,T('소마셈 B5','SOMA-sem B5','SOMA算 B5')],
    [10,3,T('소마연산 3학년','SOMA Arithmetic Grade 3','SOMA运算3年级')],
    [15,4,T('소마연산 4학년','SOMA Arithmetic Grade 4','SOMA运算4年级')]
  ];
  const shift=(pts,d)=>pts.map(p=>[p[0]+d,p[1],p[2]]);
  const CLASSES=[
    {id:'fields-s',  academy:'fields',name:T('필즈 S','Fields S','Fields S'),source:'shift',basis:T('필즈 E1보다 3개월 빠르게 계산','E1 shifted 3 months earlier','按E1提前3个月计算'),points:shift(E1,-3),end:44},
    {id:'fields-e1', academy:'fields',name:T('필즈 E1','Fields E1','Fields E1'),source:'table',basis:T('7세 E1반 운영 로드맵','7-year-old E1 class roadmap','7岁E1班运营路线图'),points:E1,end:47},
    {id:'fields-e2', academy:'fields',name:T('필즈 E2','Fields E2','Fields E2'),source:'shift',basis:T('필즈 E1보다 2개월 느리게 계산','E1 shifted 2 months later','按E1推后2个月计算'),points:shift(E1,2),end:49},
    {id:'soma-premier',academy:'soma',name:T('소마 프리미어','SOMA Premier','SOMA Premier'),source:'shift',basis:T('소마 챌린지보다 3개월 빠르게 계산','Challenge shifted 3 months earlier','按挑战班提前3个月计算'),points:shift(CH,-3),end:22},
    {id:'soma-challenge',academy:'soma',name:T('소마 챌린지','SOMA Challenge','SOMA Challenge'),source:'table',basis:T('2026 7세 챌린지 로드맵','2026 7-year-old Challenge roadmap','2026 7岁挑战班路线图'),points:CH,end:25},
    {id:'soma-a',    academy:'soma',name:T('소마 A반','SOMA A','SOMA A班'),source:'table',basis:T('A반 운영표','A-class schedule','A班运营表'),points:SA,end:18},
    {id:'soma-b',    academy:'soma',name:T('소마 A2(B)반','SOMA A2 (B)','SOMA A2(B)班'),source:'shift',basis:T('소마 A반보다 2개월 느리게 계산','A class shifted 2 months later','按A班推后2个月计算'),points:shift(SA,2),end:20}
  ];
  /* 수의 마법 과정이 끝날 때의 연산 학년(v). 기적의 계산법 초등 1~12권 각 권의 새 계산이 수의 마법 어느 과정에서
     처음 나오는지(data/consult-ladder.js, placement-books.js 권별 범위에서 자동 생성)를 누적해, 「N권 내용을 다 만난
     과정의 끝 = N+1권 시작」으로 읽은 값. scripts/check-academy-compare.js 가 단계표와 어긋나지 않는지 지킨다.
     사이 과정은 회차 수로 고르게 나눈다. C0 시작 = 0.5(유아). C24 끝 = 초등 연산 끝(7). */
  const COURSE_END={C0:1,C3:2,C6:3,C10:3.5,C11:4,C12:4.5,C16:5,C18:5.5,C20:6,C23:6.5,C24:7};
  root.NM_ACADEMY_LINES={version:'2026-11-17',classes:CLASSES,courseEnd:COURSE_END,startLevel:0.5,
    goalClass:{'soma-a':'soma-a','fields-e1':'fields-e1','fields-s':'fields-s','premier':'soma-premier'},
    maxAgeLevel:['a5','a6','a7','e1']};
})(typeof window!=='undefined'?window:globalThis);
