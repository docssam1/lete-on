/* ============================================================
   Numbers of Magic — 과정(Course) 편성 데이터
   CURRICULUM_DESIGN.md §3 기반 전 과정 정의.
   구조: tier → course(4세션) → session
   세션 1~3 = 새 마법(concept) + 복습 드릴 / 세션 4 = Test
   ============================================================ */
(function(){
'use strict';

window.NM_COURSES = {

/* ══════════════════════════════════════════════════════════
   BASIC — 수의 나라 (B1~B5)
   ══════════════════════════════════════════════════════════ */

B1:{
  tier:'basic', order:1,
  title:{ ko:'수의 나라 첫 걸음', en:'First Steps in Number Land', zh:'数字王国第一步' },
  sessions:[
    { magic:'B1-NS1',
      drills:[] },
    { magic:'B1-NS2',
      drills:[{t:'NS1',lv:1,n:6}] },
    { magic:null,
      drills:[{t:'NS1',lv:1,n:6},{t:'NS2',lv:1,n:8}] },
    { test:true,
      pool:[{t:'NS1',lv:1,n:8},{t:'NS2',lv:1,n:8},{t:'NS2',lv:2,n:4}],
      passRate:0.8 }
  ]
},

B2:{
  tier:'basic', order:2,
  title:{ ko:'짝꿍 수 (보수 5·10)', en:'Number Bonds 5 & 10', zh:'数字好朋友(凑5·凑10)' },
  sessions:[
    { magic:'B2-NS3',
      drills:[{t:'NS2',lv:1,n:6},{t:'NS1',lv:1,n:4}] },
    { magic:'B2-NS3:deepen',
      drills:[{t:'NS3',lv:1,n:6},{t:'NS2',lv:2,n:6}] },
    { magic:null,
      drills:[{t:'NS3',lv:1,n:6},{t:'NS3',lv:2,n:6},{t:'NS2',lv:2,n:6}] },
    { test:true,
      pool:[{t:'NS3',lv:1,n:8},{t:'NS3',lv:2,n:8},{t:'NS2',lv:2,n:4}],
      passRate:0.8 }
  ]
},

B3:{
  tier:'basic', order:3,
  title:{ ko:'더하기와 빼기', en:'Addition & Subtraction', zh:'加法与减法' },
  sessions:[
    { magic:'B3-AD1',
      drills:[{t:'NS2',lv:2,n:6},{t:'NS3',lv:2,n:6}] },
    { magic:'B3-SB1',
      drills:[{t:'AD1',lv:1,n:6},{t:'NS3',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:6},{t:'NS3',lv:2,n:4}] },
    { test:true,
      pool:[{t:'AD1',lv:1,n:8},{t:'SB1',lv:1,n:8},{t:'NS3',lv:2,n:4}],
      passRate:0.8 }
  ]
},

B4:{
  tier:'basic', order:4,
  title:{ ko:'두 배 수 (twin)', en:'Doubles (twin numbers)', zh:'翻倍数' },
  sessions:[
    { magic:'B4-NS5',
      drills:[{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:4},{t:'NS3',lv:2,n:4}] },
    { magic:'B4-NS5:deepen',
      drills:[{t:'NS5',lv:1,n:6},{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'NS5',lv:1,n:6},{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:6}] },
    { test:true,
      pool:[{t:'NS5',lv:1,n:8},{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:6}],
      passRate:0.8 }
  ]
},

B5:{
  tier:'basic', order:5,
  title:{ ko:'짝수·홀수와 크기 비교', en:'Even, Odd & Comparing Numbers', zh:'奇偶数与大小比较' },
  sessions:[
    { magic:'B5-CMP',
      drills:[{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:6},{t:'NS5',lv:1,n:4}] },
    { magic:'B5-CMP:deepen',
      drills:[{t:'NS1',lv:1,n:6},{t:'AD1',lv:1,n:6},{t:'NS3',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'NS1',lv:1,n:8},{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:6},{t:'NS5',lv:1,n:4}] },
    { test:true,
      pool:[{t:'NS1',lv:1,n:8},{t:'AD1',lv:1,n:6},{t:'SB1',lv:1,n:6},{t:'NS5',lv:1,n:4}],
      passRate:0.8 }
  ]
},

/* ══════════════════════════════════════════════════════════
   PRIME — 초급 마법 (P1~P10)
   ══════════════════════════════════════════════════════════ */

P1:{
  tier:'beginner', order:1,
  title:{ ko:'더해서 10이 되는 수', en:'Find the Ten', zh:'找出凑十的数' },
  sessions:[
    { magic:'A-01',
      drills:[{t:'NS2',lv:2,n:6},{t:'NS3',lv:2,n:6},{t:'AD1',lv:1,n:6}] },
    { magic:'A-01:deepen',
      drills:[{t:'AD8',lv:1,n:6},{t:'NS3',lv:2,n:4},{t:'AD1',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'AD8',lv:1,n:8},{t:'AD8',lv:2,n:4},{t:'NS3',lv:2,n:4},{t:'AD1',lv:1,n:4}] },
    { test:true,
      pool:[{t:'AD8',lv:1,n:10},{t:'AD8',lv:2,n:4},{t:'NS3',lv:2,n:6},{t:'AD1',lv:1,n:4}],
      passRate:0.8 }
  ]
},

P2:{
  tier:'beginner', order:2,
  title:{ ko:'수 이사의 마법', en:'Moving Numbers', zh:'搬数字魔法' },
  sessions:[
    { magic:'A-02',
      drills:[{t:'NS3',lv:2,n:6},{t:'AD8',lv:1,n:6},{t:'AD1',lv:1,n:4},{t:'NS5',lv:1,n:4}] },
    { magic:'A-02:deepen',
      drills:[{t:'AD2',lv:1,n:6},{t:'NS3',lv:2,n:4},{t:'AD8',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'AD2',lv:1,n:8},{t:'AD8',lv:1,n:6},{t:'NS3',lv:2,n:4},{t:'NS5',lv:1,n:4}] },
    { test:true,
      pool:[{t:'AD2',lv:1,n:10},{t:'NS3',lv:2,n:6},{t:'AD8',lv:1,n:6},{t:'NS5',lv:1,n:4}],
      passRate:0.8 }
  ]
},

P3:{
  tier:'beginner', order:3,
  title:{ ko:'우선 10을 더해요', en:'Add 10 First', zh:'先加十法' },
  sessions:[
    { magic:'A-03',
      drills:[{t:'AD2',lv:1,n:6},{t:'AD8',lv:1,n:6},{t:'NS4',lv:1,n:4},{t:'SB2',lv:1,n:4}] },
    { magic:'A-03:deepen',
      drills:[{t:'AD3',lv:1,n:6},{t:'AD2',lv:1,n:4},{t:'NS4',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'AD3',lv:2,n:8},{t:'AD8',lv:2,n:4},{t:'SB2',lv:1,n:4},{t:'AD2',lv:1,n:4}] },
    { test:true,
      pool:[{t:'AD3',lv:1,n:8},{t:'AD3',lv:2,n:4},{t:'AD2',lv:1,n:6},{t:'AD8',lv:1,n:4}],
      passRate:0.8 }
  ]
},

P4:{
  tier:'beginner', order:4,
  title:{ ko:'계단식 덧셈', en:'Staircase Addition', zh:'阶梯加法' },
  sessions:[
    { magic:'A-04',
      drills:[{t:'AD3',lv:2,n:6},{t:'AD4',lv:1,n:6},{t:'AD2',lv:1,n:4},{t:'SB3',lv:1,n:4}] },
    { magic:'A-04:deepen',
      drills:[{t:'AD5',lv:1,n:6},{t:'AD3',lv:2,n:4},{t:'AD4',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'AD5',lv:1,n:8},{t:'AD3',lv:2,n:4},{t:'SB3',lv:2,n:4},{t:'AD4',lv:2,n:4}] },
    { test:true,
      pool:[{t:'AD5',lv:1,n:10},{t:'AD3',lv:2,n:6},{t:'AD4',lv:1,n:4},{t:'SB3',lv:1,n:4}],
      passRate:0.8 }
  ]
},

P5:{
  tier:'beginner', order:5,
  title:{ ko:'보정 빼기 마법', en:'Compensation Subtraction', zh:'补偿减法魔法' },
  sessions:[
    { magic:'A-05',
      drills:[{t:'AD5',lv:1,n:6},{t:'SB3',lv:2,n:6},{t:'SB4',lv:1,n:4},{t:'AD8',lv:1,n:4}] },
    { magic:'A-05:deepen',
      drills:[{t:'SB5',lv:1,n:6},{t:'SB3',lv:2,n:4},{t:'AD5',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'SB5',lv:1,n:8},{t:'AD5',lv:2,n:4},{t:'SB4',lv:2,n:4},{t:'AD8',lv:2,n:4}] },
    { test:true,
      pool:[{t:'SB5',lv:1,n:10},{t:'AD5',lv:2,n:4},{t:'SB3',lv:2,n:4},{t:'AD8',lv:1,n:4}],
      passRate:0.8 }
  ]
},

P6:{
  tier:'beginner', order:6,
  title:{ ko:'식의 변형 마법', en:'Expression Transformation', zh:'算式变形魔法' },
  sessions:[
    { magic:'A-06',
      drills:[{t:'SB5',lv:1,n:6},{t:'SB4',lv:2,n:6},{t:'AD5',lv:2,n:4},{t:'AD6',lv:1,n:4}] },
    { magic:'A-06:deepen',
      drills:[{t:'SB7',lv:1,n:6},{t:'SB5',lv:1,n:4},{t:'AD6',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'SB7',lv:2,n:8},{t:'SB5',lv:1,n:4},{t:'AD6',lv:1,n:4},{t:'SB4',lv:2,n:4}] },
    { test:true,
      pool:[{t:'SB7',lv:1,n:8},{t:'SB7',lv:2,n:4},{t:'SB5',lv:1,n:6},{t:'AD5',lv:2,n:4}],
      passRate:0.8 }
  ]
},

P7:{
  tier:'beginner', order:7,
  title:{ ko:'배와 반, 구구 2~5단', en:'Doubles, Halves & Tables 2-5', zh:'翻倍与减半·乘法口诀2~5' },
  sessions:[
    { magic:'A-07',
      drills:[{t:'AD6',lv:1,n:6},{t:'SB6',lv:1,n:6},{t:'AD8',lv:2,n:4},{t:'NS5',lv:2,n:4}] },
    { magic:'A-07:deepen',
      drills:[{t:'ML1',lv:1,n:6},{t:'ML2',lv:1,n:6},{t:'AD6',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'ML2',lv:2,n:6},{t:'ML2',lv:3,n:6},{t:'SB6',lv:1,n:4},{t:'AD6',lv:2,n:4}] },
    { test:true,
      pool:[{t:'ML1',lv:1,n:6},{t:'ML2',lv:1,n:6},{t:'ML2',lv:2,n:6},{t:'ML2',lv:3,n:6}],
      passRate:0.8 }
  ]
},

P8:{
  tier:'beginner', order:8,
  title:{ ko:'구구 6~9단과 역구구', en:'Times Tables 6-9 & Reverse', zh:'乘法口诀6~9与逆运算' },
  sessions:[
    { magic:'P8-ML3',
      drills:[{t:'ML2',lv:3,n:8},{t:'SB6',lv:1,n:4},{t:'AD7',lv:1,n:4},{t:'DV1',lv:1,n:4}] },
    { magic:'P8-ML4',
      drills:[{t:'ML3',lv:2,n:6},{t:'ML2',lv:3,n:4},{t:'DV1',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'ML4',lv:2,n:8},{t:'ML3',lv:3,n:4},{t:'DV1',lv:2,n:4},{t:'AD7',lv:1,n:4}] },
    { test:true,
      pool:[{t:'ML3',lv:1,n:6},{t:'ML3',lv:2,n:4},{t:'ML4',lv:1,n:6},{t:'ML4',lv:2,n:4}],
      passRate:0.8 }
  ]
},

P9:{
  tier:'beginner', order:9,
  title:{ ko:'몇십 곱과 첫 나눗셈', en:'Multiplying Tens & First Division', zh:'整十乘法与初识除法' },
  sessions:[
    { magic:'A-08',
      drills:[{t:'ML4',lv:2,n:6},{t:'AD7',lv:1,n:4},{t:'SB6',lv:2,n:4},{t:'DV1',lv:2,n:4}] },
    { magic:'A-08:deepen',
      drills:[{t:'ML5',lv:1,n:6},{t:'DV2',lv:1,n:6},{t:'ML4',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'ML5',lv:2,n:6},{t:'DV2',lv:1,n:6},{t:'AD7',lv:2,n:4},{t:'DV1',lv:2,n:4}] },
    { test:true,
      pool:[{t:'ML5',lv:1,n:8},{t:'ML5',lv:2,n:4},{t:'DV2',lv:1,n:6},{t:'ML4',lv:2,n:4}],
      passRate:0.8 }
  ]
},

P10:{
  tier:'beginner', order:10,
  title:{ ko:'분배 암산과 나머지 나눗셈', en:'Distributive Mental Math & Remainders', zh:'分配心算与余数除法' },
  sessions:[
    { magic:'A-09',
      drills:[{t:'ML5',lv:2,n:6},{t:'DV2',lv:1,n:6},{t:'ML4',lv:2,n:4},{t:'AD7',lv:2,n:4}] },
    { magic:'A-09:deepen',
      drills:[{t:'ML6',lv:1,n:6},{t:'DV3',lv:1,n:6},{t:'ML5',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'ML6',lv:2,n:6},{t:'DV3',lv:1,n:6},{t:'SB6',lv:2,n:4},{t:'AD7',lv:2,n:4}] },
    { test:true,
      pool:[{t:'ML6',lv:1,n:6},{t:'ML6',lv:2,n:4},{t:'DV3',lv:1,n:8},{t:'ML5',lv:2,n:4}],
      passRate:0.8 }
  ]
},

/* ══════════════════════════════════════════════════════════
   ADVANCE — 중급 마법 (M1~M6)
   ══════════════════════════════════════════════════════════ */

M1:{
  tier:'advance', order:1,
  title:{ ko:'큰 수 곱하기', en:'Multiplying Big Numbers', zh:'大数乘法' },
  sessions:[
    { magic:'M-01',
      drills:[{t:'ML6',lv:2,n:6},{t:'DV3',lv:1,n:6},{t:'AD7',lv:2,n:4},{t:'SB6',lv:2,n:4}] },
    { magic:'M-01:deepen',
      drills:[{t:'ML7',lv:1,n:6},{t:'ML8',lv:1,n:6},{t:'ML6',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'ML8',lv:2,n:6},{t:'ML7',lv:2,n:4},{t:'DV3',lv:1,n:4},{t:'ML6',lv:2,n:4}] },
    { test:true,
      pool:[{t:'ML7',lv:1,n:6},{t:'ML7',lv:2,n:4},{t:'ML8',lv:1,n:6},{t:'ML8',lv:2,n:4}],
      passRate:0.8 }
  ]
},

M2:{
  tier:'advance', order:2,
  title:{ ko:'밀어서 나누기', en:'Long Division', zh:'推步除法' },
  sessions:[
    { magic:'M-02',
      drills:[{t:'ML8',lv:2,n:6},{t:'ML7',lv:2,n:4},{t:'DV3',lv:1,n:6},{t:'ML4',lv:2,n:4}] },
    { magic:'M-02:deepen',
      drills:[{t:'DV4',lv:1,n:6},{t:'ML8',lv:2,n:4},{t:'ML7',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'DV4',lv:2,n:8},{t:'ML8',lv:2,n:4},{t:'DV3',lv:1,n:4},{t:'ML7',lv:2,n:4}] },
    { test:true,
      pool:[{t:'DV4',lv:1,n:8},{t:'DV4',lv:2,n:6},{t:'ML8',lv:2,n:4},{t:'ML7',lv:2,n:4}],
      passRate:0.8 }
  ]
},

M3:{
  tier:'advance', order:3,
  title:{ ko:'분수 나라 입문', en:'Introduction to Fractions', zh:'分数王国入门' },
  sessions:[
    { magic:'M-03',
      drills:[{t:'DV4',lv:2,n:6},{t:'ML8',lv:2,n:4},{t:'ML7',lv:2,n:4},{t:'DV3',lv:1,n:4}] },
    { magic:'M-03:deepen',
      drills:[{t:'FR1',lv:1,n:6},{t:'FR2',lv:1,n:6},{t:'DV4',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'FR1',lv:1,n:8},{t:'FR2',lv:1,n:6},{t:'ML8',lv:2,n:4},{t:'DV4',lv:2,n:4}] },
    { test:true,
      pool:[{t:'FR1',lv:1,n:8},{t:'FR2',lv:1,n:8},{t:'DV4',lv:2,n:4},{t:'ML8',lv:2,n:4}],
      passRate:0.8 }
  ]
},

M4:{
  tier:'advance', order:4,
  title:{ ko:'대분수 마법과 세 자리 곱', en:'Mixed Numbers & 3-digit Multiplication', zh:'带分数魔法与三位数乘法' },
  sessions:[
    { magic:'M-04',
      drills:[{t:'FR2',lv:1,n:6},{t:'ML8',lv:2,n:6},{t:'DV4',lv:2,n:4}] },
    { magic:'M-04:deepen',
      drills:[{t:'FR3',lv:1,n:6},{t:'ML9',lv:1,n:6},{t:'FR2',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'FR3',lv:2,n:6},{t:'ML9',lv:1,n:6},{t:'ML8',lv:2,n:4},{t:'FR2',lv:1,n:4}] },
    { test:true,
      pool:[{t:'FR3',lv:1,n:6},{t:'FR3',lv:2,n:4},{t:'ML9',lv:1,n:6},{t:'FR2',lv:1,n:4},{t:'ML8',lv:2,n:4}],
      passRate:0.8 }
  ]
},

M5:{
  tier:'advance', order:5,
  title:{ ko:'두 자리 수로 나누기', en:'Dividing by 2-digit Numbers', zh:'除以两位数' },
  sessions:[
    { magic:'M-05',
      drills:[{t:'ML9',lv:1,n:6},{t:'FR3',lv:2,n:4},{t:'FR1',lv:1,n:4},{t:'ML8',lv:2,n:4}] },
    { magic:'M-05:deepen',
      drills:[{t:'DV5',lv:1,n:6},{t:'ML9',lv:1,n:4},{t:'FR3',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'DV5',lv:2,n:6},{t:'ML9',lv:1,n:4},{t:'FR3',lv:2,n:4},{t:'ML8',lv:2,n:4}] },
    { test:true,
      pool:[{t:'DV5',lv:1,n:6},{t:'DV5',lv:2,n:6},{t:'ML9',lv:1,n:4},{t:'FR3',lv:2,n:4},{t:'ML8',lv:2,n:4}],
      passRate:0.8 }
  ]
},

M6:{
  tier:'advance', order:6,
  title:{ ko:'혼합 계산과 배수 판별', en:'Order of Operations & Divisibility', zh:'混合运算与整除判别' },
  sessions:[
    { magic:'M-06',
      drills:[{t:'DV5',lv:2,n:6},{t:'ML9',lv:1,n:4},{t:'FR3',lv:2,n:4},{t:'ML8',lv:2,n:4}] },
    { magic:'M-06:deepen',
      drills:[{t:'MX1',lv:1,n:6},{t:'DV6',lv:1,n:6},{t:'DV5',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'MX1',lv:2,n:6},{t:'DV6',lv:2,n:6},{t:'DV5',lv:2,n:4},{t:'ML9',lv:1,n:4}] },
    { test:true,
      pool:[{t:'MX1',lv:1,n:6},{t:'MX1',lv:2,n:6},{t:'DV6',lv:1,n:4},{t:'DV6',lv:2,n:4},{t:'DV5',lv:2,n:4}],
      passRate:0.8 }
  ]
},

/* ══════════════════════════════════════════════════════════
   CHALLENGE — 고급 마법 (H1~H9)
   ══════════════════════════════════════════════════════════ */

H1:{
  tier:'challenge', order:1,
  title:{ ko:'소수 덧뺄셈과 분수↔소수', en:'Decimal ± & Fraction↔Decimal', zh:'小数加减与分数小数互换' },
  sessions:[
    { magic:'H-01',
      drills:[{t:'MX1',lv:2,n:6},{t:'DV6',lv:2,n:6},{t:'DV5',lv:2,n:4},{t:'ML9',lv:1,n:4}] },
    { magic:'H-01:deepen',
      drills:[{t:'DC1',lv:1,n:6},{t:'FR8',lv:1,n:6},{t:'MX1',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'DC1',lv:2,n:6},{t:'FR8',lv:1,n:6},{t:'DV6',lv:2,n:4},{t:'MX1',lv:2,n:4}] },
    { test:true,
      pool:[{t:'DC1',lv:1,n:6},{t:'DC1',lv:2,n:4},{t:'FR8',lv:1,n:6},{t:'MX1',lv:2,n:4}],
      passRate:0.8 }
  ]
},

H2:{
  tier:'challenge', order:2,
  title:{ ko:'소수 곱셈과 19단 입문', en:'Decimal Multiplication & 11-19 Tables', zh:'小数乘法与19段入门' },
  sessions:[
    { magic:'H-02',
      drills:[{t:'DC1',lv:2,n:6},{t:'ML11',lv:1,n:4},{t:'MX1',lv:2,n:4}] },
    { magic:'H-02:deepen',
      drills:[{t:'DC2',lv:1,n:6},{t:'ML10',lv:1,n:6},{t:'DC1',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'DC2',lv:1,n:8},{t:'ML10',lv:1,n:6},{t:'ML11',lv:1,n:4},{t:'DC1',lv:2,n:4}] },
    { test:true,
      pool:[{t:'DC2',lv:1,n:8},{t:'ML10',lv:1,n:8},{t:'DC1',lv:2,n:6}],
      passRate:0.8 }
  ]
},

H3:{
  tier:'challenge', order:3,
  title:{ ko:'소수 나눗셈과 99단·기준곱', en:'Decimal Division & 99-table', zh:'小数除法与99段·基准乘' },
  sessions:[
    { magic:'H-03',
      drills:[{t:'DC2',lv:1,n:6},{t:'ML10',lv:1,n:6},{t:'ML11',lv:2,n:4}] },
    { magic:'H-03:deepen',
      drills:[{t:'DC3',lv:1,n:6},{t:'ML10',lv:2,n:6},{t:'DC2',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'DC3',lv:1,n:8},{t:'ML10',lv:2,n:6},{t:'ML11',lv:2,n:4},{t:'DC2',lv:1,n:4}] },
    { test:true,
      pool:[{t:'DC3',lv:1,n:8},{t:'ML10',lv:2,n:8},{t:'DC2',lv:1,n:6}],
      passRate:0.8 }
  ]
},

H4:{
  tier:'challenge', order:4,
  title:{ ko:'약수·배수·최대공약수·최소공배수', en:'Factors, GCD & LCM', zh:'因数倍数·最大公因数·最小公倍数' },
  sessions:[
    { magic:'H-04',
      drills:[{t:'ML10',lv:2,n:6},{t:'DC1',lv:2,n:4},{t:'DC2',lv:1,n:4},{t:'ML11',lv:3,n:4}] },
    { magic:'H-04:deepen',
      drills:[{t:'DV7',lv:1,n:6},{t:'DV7',lv:2,n:4},{t:'ML10',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'DV7',lv:3,n:6},{t:'ML10',lv:3,n:4},{t:'ML11',lv:3,n:4},{t:'DC3',lv:1,n:4}] },
    { test:true,
      pool:[{t:'DV7',lv:1,n:6},{t:'DV7',lv:2,n:4},{t:'DV7',lv:3,n:4},{t:'ML10',lv:2,n:4}],
      passRate:0.8 }
  ]
},

H5:{
  tier:'challenge', order:5,
  title:{ ko:'이분모 분수 덧뺄셈', en:'Unlike Denominators ±', zh:'异分母分数加减' },
  sessions:[
    { magic:'H-05',
      drills:[{t:'DV7',lv:3,n:6},{t:'MX4',lv:1,n:4},{t:'ML10',lv:3,n:4}] },
    { magic:'H-05:deepen',
      drills:[{t:'FR4',lv:1,n:6},{t:'FR5',lv:1,n:6},{t:'DV7',lv:3,n:4}] },
    { magic:null,
      drills:[{t:'FR4',lv:2,n:6},{t:'FR5',lv:1,n:6},{t:'MX4',lv:2,n:4},{t:'DV7',lv:3,n:4}] },
    { test:true,
      pool:[{t:'FR4',lv:1,n:6},{t:'FR4',lv:2,n:4},{t:'FR5',lv:1,n:6},{t:'DV7',lv:3,n:4}],
      passRate:0.8 }
  ]
},

H6:{
  tier:'challenge', order:6,
  title:{ ko:'분수 곱셈과 거듭제곱', en:'Fraction Multiplication & Powers', zh:'分数乘法与乘方' },
  sessions:[
    { magic:'H-06',
      drills:[{t:'FR4',lv:2,n:6},{t:'FR5',lv:1,n:6},{t:'ML10',lv:3,n:4}] },
    { magic:'H-06:deepen',
      drills:[{t:'FR6',lv:1,n:6},{t:'ML11',lv:2,n:4},{t:'FR4',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'FR6',lv:2,n:6},{t:'ML11',lv:3,n:4},{t:'FR5',lv:1,n:4},{t:'ML10',lv:3,n:4}] },
    { test:true,
      pool:[{t:'FR6',lv:1,n:6},{t:'FR6',lv:2,n:4},{t:'ML11',lv:2,n:4},{t:'FR4',lv:2,n:4},{t:'FR5',lv:1,n:4}],
      passRate:0.8 }
  ]
},

H7:{
  tier:'challenge', order:7,
  title:{ ko:'분수 나눗셈과 분해 기법', en:'Fraction Division', zh:'分数除法' },
  sessions:[
    { magic:'H-07',
      drills:[{t:'FR6',lv:2,n:6},{t:'ML11',lv:3,n:4},{t:'ML10',lv:3,n:4}] },
    { magic:'H-07:deepen',
      drills:[{t:'FR7',lv:1,n:6},{t:'FR6',lv:2,n:4},{t:'ML11',lv:3,n:4}] },
    { magic:null,
      drills:[{t:'FR7',lv:1,n:8},{t:'FR6',lv:2,n:4},{t:'ML10',lv:3,n:4},{t:'ML11',lv:3,n:4}] },
    { test:true,
      pool:[{t:'FR7',lv:1,n:10},{t:'FR6',lv:2,n:6},{t:'ML11',lv:3,n:4},{t:'ML10',lv:3,n:4}],
      passRate:0.8 }
  ]
},

H8:{
  tier:'challenge', order:8,
  title:{ ko:'수열의 합과 비와 비율', en:'Series Sums & Ratios', zh:'数列求和与比例' },
  sessions:[
    { magic:'H-08',
      drills:[{t:'FR7',lv:1,n:6},{t:'FR8',lv:1,n:4},{t:'ML11',lv:3,n:4}] },
    { magic:'H-08:deepen',
      drills:[{t:'MX2',lv:1,n:6},{t:'MX3',lv:1,n:6},{t:'FR7',lv:1,n:4}] },
    { magic:null,
      drills:[{t:'MX2',lv:2,n:6},{t:'MX3',lv:2,n:6},{t:'FR8',lv:1,n:4},{t:'FR7',lv:1,n:4}] },
    { test:true,
      pool:[{t:'MX2',lv:1,n:6},{t:'MX2',lv:2,n:4},{t:'MX3',lv:1,n:6},{t:'MX3',lv:2,n:4},{t:'FR7',lv:1,n:4}],
      passRate:0.8 }
  ]
},

H9:{
  tier:'challenge', order:9,
  title:{ ko:'소인수분해와 총정리', en:'Prime Factorization & Final Review', zh:'质因数分解与综合总结' },
  sessions:[
    { magic:'H-09',
      drills:[{t:'MX3',lv:2,n:6},{t:'MX2',lv:2,n:4},{t:'FR7',lv:1,n:4}] },
    { magic:'H-09:deepen',
      drills:[{t:'DV8',lv:1,n:4},{t:'DV8',lv:2,n:4},{t:'MX5',lv:1,n:4},{t:'MX3',lv:2,n:4}] },
    { magic:null,
      drills:[{t:'DV8',lv:3,n:4},{t:'MX5',lv:1,n:6},{t:'MX2',lv:2,n:4},{t:'MX3',lv:2,n:4}] },
    { test:true,
      pool:[{t:'DV8',lv:2,n:4},{t:'DV8',lv:3,n:4},{t:'MX5',lv:1,n:6},{t:'MX3',lv:2,n:4},{t:'MX2',lv:2,n:4}],
      passRate:0.8 }
  ]
}

}; // end NM_COURSES

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_COURSES;
})();
