// 4-1 Ⅳ 다양한 생물과 우리 생활(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 s41-u04.think.js(t01~t12)와 문제은행(b) 참조.
// 예전 기본 수업이던 탐구 기록 앱(8활동)은 explore.records(선택 기능, #/s41-u04/records)로 옮겼다 — 저장 키 sciLab.inquiry.s41-u04는 그대로.
// 3D 실험실은 이미 있던 효모빵 반죽 실험실(v2/lab-bread.js · scenes/bread-dough.js)을 쓴다.
import { recordsLesson } from './s41-u04.records.js';
const t = (n) => `s41-u04-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 's41-u04', grade: 4, title: '다양한 생물과 우리 생활', hero: '부푸는 효모빵 반죽',
  engage: {
    say: [{ mood: 'thinking', text: '빵은 어떻게 폭신하게 부풀까요?' }, { mood: 'talk', text: '반죽 속 작은 생물, 효모를 만나 봐요.' }],
    scene: 'bread-dough',
    question: '같은 재료에 찬물·따뜻한 물·뜨거운 물을 넣어 반죽하고 40분 두면, 어느 반죽이 가장 많이 부풀까요?',
    predictions: [{ id: '0', text: '찬물 반죽' }, { id: '1', text: '따뜻한 물 반죽' }, { id: '2', text: '뜨거운 물 반죽' }],
    answer: '1',
    wrongNote: '실험 결과와 비교하며 효모가 생물이라는 점을 떠올려 봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '물의 온도만 다르게, 재료의 양과 시간은 똑같이 해요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'bread', rowsKey: 'breadRows', goal: '물을 고르고 발효를 시작해요 → 40분 뒤 부피를 읽고 「표에 적기」를 눌러요. 세 물을 모두 비교해 봐요.',
      notice: '부피(mL)는 모형 값이에요. 뜨거운 물(70 ℃)은 3D 모형에서만 비교하고 실제로는 쓰지 않아요.',
      columns: ['반죽한 물', '40분 뒤 부피', '모습'], rowText: (r) => `${r.water} → ${r.result}` },
    home: {
      title: '집에서 효모 풍선 만들기', minutes: 30, guardian: true,
      materials: [{ name: '작은 페트병 2개', qty: '2개', have: 'home' }, { name: '설탕·건조 효모', qty: '1숟가락씩', have: 'home' }, { name: '풍선 2개', qty: '2개', have: 'home' }, { name: '찬물과 따뜻한 물(목욕물 정도)', qty: '각 100 mL', have: 'home' }],
      steps: ['두 병에 설탕과 효모를 똑같이 넣고, 한 병에는 찬물, 다른 병에는 따뜻한 물을 넣어요.',
        '병 입구에 풍선을 씌우고 30분 동안 풍선이 부푸는 정도를 비교해요.',
        '효모가 만든 기체가 풍선을 부풀린 것이라는 것을 이야기해요.'],
      safety: ['뜨거운 물은 쓰지 않아요. 보호자와 함께 하고, 효모 물은 마시지 않아요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(관찰·조사·발표·소개 자료 제작·공유 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '실제 표본 관찰·생활 영향 조사 발표·소개 자료 공유를 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '효모는 생물이라 따뜻할 때 가장 활발해요.' }],
    analogy: '효모는 반죽 속 작은 일꾼이에요. 따뜻하면 부지런히 설탕을 먹고 기체를 내뿜지만, 너무 추우면 느릿느릿, 너무 뜨거우면 쓰러져 버려요.',
    principle: '버섯·곰팡이·효모는 균류, 짚신벌레·해캄은 원생생물, 아주 작은 세균도 있어요. 효모는 따뜻할 때 이산화탄소를 만들어 빵을 부풀리고, 균류·세균은 생활에 이로운 일도 해로운 일도 해요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      if (!rows.length) return '';
      const best = rows.reduce((a, b) => (b.vol > a.vol ? b : a));
      return `네 기록: ${rows.map((r) => `${r.water} ${r.vol} mL`).join(', ')} · 가장 많이 부푼 반죽은 ${best.water}이에요. 왜 그럴까요?`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '작은 생물은 우리 생활에서 또 어떤 일을 할까요?' }],
    items: [t(8), t(12), 's41-u04-b36'],
    reading: { title: '곰팡이가 세균을 막은 접시', text: '세균을 기르던 접시에 푸른곰팡이가 자라자 곰팡이 둘레에 세균이 자라지 못한 맑은 고리가 생겼어요. 곰팡이가 만든 물질이 세균의 자람을 막았기 때문이에요. 이 물질을 연구해 항생제를 만들었어요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '효모가 빵을 부풀리는 까닭을 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/s41-u04/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
