// 4-2 Ⅳ 기후변화와 우리 생활(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 c22-s42-u04.think.js(t01~t12)와 문제은행(b·o) 참조.
// 예전 기본 수업이던 탐구 기록 앱(9활동)은 explore.records(선택 기능, #/c22-s42-u04/records)로 옮겼다 — 저장 키 sciLab.inquiry.c22-s42-u04는 그대로.
import { recordsLesson } from './c22-s42-u04.records.js';
const t = (n) => `c22-s42-u04-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 'c22-s42-u04', grade: 4, title: '기후변화와 우리 생활', hero: '물이 차오르는 해안 마을',
  engage: {
    say: [{ mood: 'surprised', text: '2024년은 평년보다 2.0 ℃ 더웠대요!' }, { mood: 'thinking', text: '바닷물이 높아지면 어느 집부터 잠길까요?' }],
    scene: 'sea-town',
    question: '해안 마을 모형에서 물높이를 1 cm에서 4 cm까지 높이면 어떤 집부터 물에 닿을까요?',
    predictions: [{ id: '0', text: '바다와 가장 가까운 집부터' }, { id: '1', text: '땅이 가장 낮은 곳의 집부터' }, { id: '2', text: '크기가 큰 집부터' }],
    answer: '1',
    wrongNote: '실험 결과와 비교하며 집이 놓인 땅의 높이를 다시 살펴봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '땅 모양과 집 위치는 그대로 두고 물높이만 바꿔요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'sealevel', rowsKey: 'seaRows', goal: '물높이와 방파제를 고르고 「물 붓기」 → 물이 차분해지면 물에 닿은 집을 세어 표에 적어요.',
      columns: ['물높이', '방파제', '물에 닿은 집'], rowText: (r) => `물높이 ${r.level} cm · ${r.wall} → ${r.result}` },
    home: {
      title: '쟁반 위의 작은 해안', minutes: 20, guardian: true,
      materials: [{ name: '얕은 쟁반이나 넓은 그릇', qty: '1개', have: 'home' }, { name: '점토나 젖은 모래', qty: '한 줌', have: 'home' }, { name: '병뚜껑·작은 블록(집)', qty: '4~5개', have: 'home' }, { name: '자와 물컵', qty: '1개씩', have: 'home' }],
      steps: ['쟁반 한쪽에 점토로 높은 언덕과 낮은 평지를 만들고, 바다 쪽 가까운 언덕 위와 먼 평지에 집을 하나씩 놓아요.',
        '바다 쪽에 물을 조금 부어 자로 깊이를 재요. 물을 조금씩 더 부으며 어떤 집부터 물에 닿는지 살펴봐요.',
        '바다와의 거리와 땅의 높이 중 무엇이 먼저 닿는 집을 정했는지 이야기해요.'],
      safety: ['물을 흘리면 바로 닦아요. 보호자와 함께 해요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(활동 9개의 조사·모형·실천 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '모둠 조사·실제 모형실험·날짜별 실천을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '하루의 상태는 날씨, 여러 해의 평균은 기후예요.' }],
    analogy: '해안 마을은 계단식 운동장과 같아요. 물이 차오르면 바다와 가까운 칸이 아니라 가장 낮은 칸부터 잠겨요.',
    principle: '기후는 같은 기준의 평년과 비교해요. 해수면이 높아지면 바다와의 거리보다 땅이 낮은 곳부터 잠겨요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      const no = rows.filter((r) => r.wall === '방파제 없음').sort((a, b) => a.level - b.level);
      if (no.length < 2) return rows.length ? '방파제 없이 물높이를 두 가지 이상 적으면 비교해 줄게요.' : '';
      const a = no[0], b = no[no.length - 1];
      return `네 기록: 물높이가 ${a.level} cm에서 ${b.level} cm로 높아지자 물에 닿은 집이 ${a.n}채에서 ${b.n}채가 되었어요.`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '해수면이 높아지면 어떤 곳의 피해가 더 클까요?' }],
    items: [t(8), t(12), 'c22-s42-u04-b67'],
    reading: { title: '섬나라 투발루', text: '남태평양의 섬나라 투발루는 가장 높은 땅도 바다에서 몇 미터밖에 되지 않아요. 바닷물이 높이 들어오는 날이면 땅 위로 넘치고 땅속의 물이 짜게 바뀌어 농사가 어려워졌어요. 낮고 평평한 땅은 해수면이 조금만 높아져도 넓은 곳이 한꺼번에 잠겨요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '어떤 집부터 잠기는지 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/c22-s42-u04/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
