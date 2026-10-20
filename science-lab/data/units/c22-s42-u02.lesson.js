// 4-2 Ⅱ 생물과 환경(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 c22-s42-u02.think.js(t01~t12)와 문제은행(b) 참조.
// 예전 기본 수업이던 탐구 기록 앱(9활동)은 explore.records(선택 기능, #/c22-s42-u02/records)로 옮겼다 — 저장 키 sciLab.inquiry.c22-s42-u02는 그대로.
import { recordsLesson } from './c22-s42-u02.records.js';
const t = (n) => `c22-s42-u02-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 'c22-s42-u02', grade: 4, title: '생물과 환경', hero: '풀밭 먹이 관계',
  engage: {
    say: [{ mood: 'thinking', text: '여우가 없으면 토끼가 마음 놓고 살 수 있으니 풀밭이 더 좋아질까요?' }, { mood: 'talk', text: '풀 → 토끼 → 여우만 사는 풀밭에서 알아봐요.' }],
    scene: 'meadow-field',
    question: '풀 → 토끼 → 여우만 사는 풀밭에서 여우가 모두 사라지면, 몇 해 뒤 토끼와 풀은 어떻게 될까요?',
    predictions: [{ id: '0', text: '토끼는 늘고 풀은 줄어요' }, { id: '1', text: '토끼도 풀도 그대로예요' }, { id: '2', text: '토끼는 줄고 풀은 늘어요' }],
    answer: '0',
    wrongNote: '실험 결과와 비교하며 토끼가 늘었을 때 토끼의 먹이인 풀은 어떻게 되었는지 따라가 봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '한 번에 하나만 바꾸고, 「그대로」와 비교해요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'meadow', rowsKey: 'meadowRows', goal: '바꿀 것을 하나 고르고 「몇 해 지켜보기」 → 3년 뒤 풀·토끼·여우의 수를 읽고 「표에 적기」를 눌러요. 「그대로」와 비교해 봐요.',
      notice: '풀·토끼·여우의 수는 경향을 보여 주려고 정한 모형 값이에요. 실제 풀밭에는 더 많은 생물과 먹이 경로가 있어요.',
      columns: ['바꾼 것', '풀', '토끼', '여우', '3년 뒤 달라진 것'], rowText: (r) => `${r.change} → 풀 ${r.grass} · 토끼 ${r.rabbit} · 여우 ${r.fox} (${r.result})` },
    home: {
      title: '집 주변 먹이 사슬 찾기', minutes: 20, guardian: true,
      materials: [{ name: '기록지', qty: '1장', have: 'home' }, { name: '연필·색연필', qty: '1자루', have: 'home' }],
      steps: ['보호자와 함께 화단이나 공원에서 식물과 동물(곤충·새 등)을 찾아요.',
        '누가 누구를 먹는지 조사해 화살표로 먹이 사슬을 그려요(먹히는 쪽 → 먹는 쪽).',
        '그중 한 생물이 사라지면 어떤 생물이 영향을 받을지 화살표를 따라 이야기해요.'],
      safety: ['생물을 잡거나 해치지 않고 눈으로만 관찰해요. 관찰 뒤에는 손을 씻어요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(생태계 조사·요소 분류·역할·먹이 관계·모형 제작·영향·토의·실천·공유 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '실제 생태계 조사·먹이그물 만들기·보전 토의와 실천을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '먹이 관계로 이어진 생물은 서로 영향을 주고받아요.' }],
    analogy: '도미노를 한 줄로 세워 하나를 넘어뜨리면 이어진 도미노가 차례로 넘어가요. 먹이 사슬도 한 생물이 바뀌면 이어진 생물이 차례로 영향을 받아요.',
    principle: '생태계는 생물 요소와 비생물 요소가 서로 영향을 주고받는 곳이에요. 생물은 생산자·소비자·분해자로 나뉘고, 먹고 먹히는 관계는 먹이 사슬과 먹이그물로 나타내요. 한 생물이 사라지거나 줄면 먹이 관계로 이어진 생물도 영향을 받아요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      if (!rows.length) return '';
      return `네 기록: ${rows.map((r) => `${r.change} → 토끼 ${r.rabbit}·풀 ${r.grass}`).join(', ')}. 한 가지를 바꿨을 때 다른 생물은 왜 함께 달라졌을까요?`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '사람의 활동은 생태계에 어떤 영향을 줄까요?' }],
    items: [t(8), t(12), 'c22-s42-u02-b45'],
    reading: { title: '나뉜 숲을 잇는 생태 통로', text: '도로나 개발로 숲이 나뉘면 동물이 먹이와 짝을 찾아 이동하기 어려워지고, 길을 건너다 다치기도 해요. 도로 위나 아래로 동물이 건너가는 길을 만든 것이 생태 통로예요. 만든 뒤에는 무인 카메라로 동물이 실제로 이용하는지 확인하고, 부족한 점을 고쳐 나가요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '한 생물의 변화가 다른 생물에 어떻게 이어지는지 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/c22-s42-u02/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
