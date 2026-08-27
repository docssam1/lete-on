/* ============================================================
   Numbers of Magic — 개념 계보 (과정-로드맵.md §6 · §13 기반)
   과정표(course/curriculum)는 "언제 배우나"만 답한다. 이 파일은
   "같은 생각이 자라나는 줄기"를 따로 정의해, 스토리 모드·학년별
   교실에서 유닛마다 "이 마법의 다음 진화"를 보여주기 위한 것이다.

   chain은 §6 서술 순서를 그대로 따르되, 그 문장을 실제로 구현한
   유닛만 골라 담았다(스레드 전용 단계·유닛 미존재 단계는 건너뜀).
   §6은 명시적으로 "과정은 가로줄, 계보는 세로줄"이라 부른다 — 즉
   체인은 실제 학습 순서(course)를 그대로 좇지 않고, 개념이 나중에
   어떤 모습으로 자라는지를 보여주는 별도의 세로 줄기다. 그래서 몇몇
   체인 노드는 실제 커리큘럼상 서로 다른 학년(tier)에 걸쳐 있어도
   §6 문장의 순서를 그대로 따른다.

   unit.lineage 배열은 이 파일과 별개로 카드 배지(§6 규칙2) 표시에도
   쓰인다 — 이미 다른 세션에서 붙은 태그 중 이 chain에 없는 것(예:
   H-13·H-11·C-12)은 배지는 계속 뜨지만 진화 링크/완주 판정에는
   포함하지 않는다(§6 서술에 없는 확장이라 자의적으로 넣지 않음).
   ============================================================ */
(function(){
'use strict';

window.NM_LINEAGES = {

  /* 계보 1 · 2와 5는 친구 (10의 혈통) — §6 "원장 예시 그대로" */
  'ten-friends': {
    name:{ ko:'2와 5는 친구', en:'2 and 5 Are Friends', zh:'2和5是朋友' },
    tagline:{ ko:'10의 혈통 — 곱해서 10, 100, 1000을 만드는 마법',
      en:'The lineage of 10 — the magic of multiplying to make 10, 100, 1000',
      zh:'10的血脉——凑成10、100、1000的魔法' },
    emblem:'🔟',
    color:'#f59e0b',
    chain:['N-07','C-02','C-16','C-28','C-04','C-17','C-29','C-34','C-03','C-35','M-08']
  },

  /* 계보 2 · 반과 배 (2의 혈통) */
  'halves-doubles': {
    name:{ ko:'반과 배', en:'Halves & Doubles', zh:'一半与两倍' },
    tagline:{ ko:'2의 혈통 — 두 배 하고 반으로 나누며 곱을 옮기는 마법',
      en:'The lineage of 2 — doubling, halving, and shifting a product between two numbers',
      zh:'2的血脉——翻倍、减半，把乘积在两数间转移的魔法' },
    emblem:'🪞',
    color:'#38bdf8',
    chain:['B-01','B-02','H-01','H-03']
  },

  /* 계보 3 · 9는 10의 옆집 (보수의 혈통) */
  'nine-next-door': {
    name:{ ko:'9는 10의 옆집', en:'9 Lives Next Door to 10', zh:'9是10的邻居' },
    tagline:{ ko:'보수의 혈통 — 10에서 하나 모자란(또는 하나 넘치는) 수의 마법',
      en:'The lineage of complements — the magic of numbers just one short of (or over) 10',
      zh:'补数的血脉——比10少一(或多一)的数的魔法' },
    emblem:'🏠',
    color:'#f97316',
    chain:['A-03','C-06','C-27','H-02','H-05','M-09','C-13','H-04']
  },

  /* 계보 4 · 무지개 덧셈법 (평균의 혈통) — 아이 눈높이 이름 확정(원장, 2026-08-25) */
  'rainbow-sum': {
    name:{ ko:'무지개 덧셈법', en:'The Rainbow-Sum Method', zh:'彩虹加法法' },
    tagline:{ ko:'평균의 혈통 — 짝을 지어 더하고 곱하는 가우스의 마법',
      en:'The lineage of averages — Gauss\'s magic of pairing numbers to add and multiply',
      zh:'平均值的血脉——配对相加相乘的高斯魔法' },
    emblem:'🌈',
    color:'#ec4899',
    chain:['A-28','C-05','C-24','M-19']
  },

  /* 계보 5 · 자리의 마법 (자릿값의 혈통) */
  'place-magic': {
    name:{ ko:'자리의 마법', en:'The Magic of Place Value', zh:'位值的魔法' },
    tagline:{ ko:'자릿값의 혈통 — 수를 앞·뒤로 쪼개어 다루는 마법',
      en:'The lineage of place value — splitting a number into front and back to handle it',
      zh:'位值的血脉——把数拆成前后两半来处理的魔法' },
    emblem:'🏗️',
    color:'#6366f1',
    chain:['C-15','C-26','H-09','M-13','M-22','M-25','M-10']
  }

};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_LINEAGES;
})();
