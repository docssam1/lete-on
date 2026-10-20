// 3-2 Ⅳ 감염병과 건강한 생활(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 c22-s32-u04.think.js(t01~t12)와 문제은행(b) 참조.
// 예전 기본 수업이던 탐구 기록 앱(7활동)은 explore.records(선택 기능, #/c22-s32-u04/records)로 옮겼다 — 저장 키 sciLab.inquiry.c22-s32-u04는 그대로.
import { recordsLesson } from './c22-s32-u04.records.js';
const t = (n) => `c22-s32-u04-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 'c22-s32-u04', grade: 3, title: '감염병과 건강한 생활', hero: '반짝이 가루 손 모형',
  engage: {
    say: [{ mood: 'thinking', text: '감기는 어떻게 친구에게서 나에게 올까요?' }, { mood: 'talk', text: '눈에 안 보이는 것을 반짝이로 보이게 해 봐요.' }],
    scene: 'glitter-hands',
    question: '아무도 손을 씻지 않고 세 차례 악수하면, 반짝이가 묻은 친구는 몇 명이 될까요?',
    predictions: [{ id: '0', text: '그대로 1명' }, { id: '1', text: '2명' }, { id: '2', text: '6명 모두' }],
    answer: '2',
    wrongNote: '실험 결과와 비교하며 악수할 때마다 반짝이가 어디로 옮겨 가는지 다시 살펴봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '짝과 차례는 그대로 두고 손 씻기 규칙만 바꿔요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'glitter', rowsKey: 'glitterRows', goal: '손 씻기 규칙을 고르고 「악수하기」를 한 차례씩 → 반짝이가 묻은 친구를 세어 표에 적어요.',
      columns: ['손 씻기', '차례', '반짝이가 묻은 친구'], rowText: (r) => `${r.rule} · ${r.round}차례 뒤 → ${r.result}` },
    home: {
      title: '가족과 반짝이 손 씻기', minutes: 15, guardian: true,
      materials: [{ name: '반짝이 가루나 가루 물감(물로 지워지는 것)', qty: '조금', have: 'home' }, { name: '비누와 흐르는 물', qty: '세면대', have: 'home' }, { name: '초시계', qty: '1개', have: 'home' }],
      steps: ['보호자와 한 사람의 손바닥에만 반짝이를 조금 묻히고, 가족끼리 차례로 악수해요. 누구 손까지 반짝이가 옮겨 갔는지 살펴봐요.',
        '한 사람은 물로만 10초, 다른 사람은 비누로 30초 씻어요. 반짝이가 남은 곳(손가락 사이·손톱 밑·엄지)을 비교해요.',
        '우리 집 손 씻기 약속(언제·어떻게)을 정해 세면대 옆에 붙여요.'],
      safety: ['반짝이가 눈이나 입에 들어가지 않게 해요. 보호자와 함께 해요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(활동 7개의 조사·모형·실천 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '모둠 조사·실제 손 씻기 실천·수칙 공유를 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '감염병은 손, 침방울, 공기, 물과 음식으로 옮겨 갈 수 있어요.' }],
    analogy: '병원체는 눈에 안 보이는 반짝이 같아요. 손에서 손으로, 손에서 물건으로 옮겨 가고, 비누로 씻으면 지워져요.',
    principle: '감염병은 여러 길로 옮겨 가요. 손 씻기·기침 예절·환기는 옮겨 갈 가능성을 크게 줄여 줘요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      const no = rows.find((r) => r.rule === '손 씻기 없음' && r.round === 3), yes = rows.find((r) => r.rule !== '손 씻기 없음' && r.round === 3);
      if (!no || !yes) return rows.length ? '두 규칙 모두 3차례까지 적으면 비교해 줄게요.' : '';
      return `네 기록: 3차례 뒤 손을 씻지 않았을 때는 ${no.n}명, B·D·F가 손을 씻었을 때는 ${yes.n}명에게 반짝이가 묻었어요.`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '우리 반에서는 어떻게 하면 좋을까요?' }],
    items: [t(8), t(12), 'c22-s32-u04-b26'],
    reading: { title: '손을 씻자고 한 의사', text: '약 180년 전 의사 제멜바이스는 의사들이 손을 씻고 나서 환자를 돌보자 병으로 목숨을 잃는 엄마들이 크게 줄어든 것을 발견했어요. 지금은 손 씻기가 감염병을 막는 가장 쉬운 방법으로 알려져 있어요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '손 씻기가 왜 도움이 되는지 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/c22-s32-u04/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
