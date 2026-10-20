// 3-2 Ⅱ 지구와 바다(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 c22-s32-u02.think.js(t01~t12)와 문제은행(b) 참조.
// 예전 기본 수업이던 탐구 기록 앱(6활동)은 explore.records(선택 기능, #/c22-s32-u02/records)로 옮겼다 — 저장 키 sciLab.inquiry.c22-s32-u02는 그대로.
import { recordsLesson } from './c22-s32-u02.records.js';
import { WATERS } from '../../scenes/seawater-model.js';
const t = (n) => `c22-s32-u02-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 'c22-s32-u02', grade: 3, title: '지구와 바다', hero: '증발 접시 두 개',
  engage: {
    say: [{ mood: 'thinking', text: '바닷물과 수돗물, 둘 다 투명한데 같은 물일까요?' }, { mood: 'talk', text: '맛보지 않고 증발 접시로 알아봐요.' }],
    scene: 'evap-dishes',
    question: '같은 양의 바닷물과 수돗물을 가열해 물을 모두 날려 보내면, 접시에 무엇이 남을까요?',
    predictions: [{ id: '0', text: '두 접시 모두 아무것도 안 남아요' }, { id: '1', text: '두 접시 모두 흰 알갱이가 남아요' }, { id: '2', text: '바닷물 접시에만 흰 알갱이가 남아요' }],
    answer: '2',
    wrongNote: '실험 결과와 비교하며 두 접시에 남은 것을 다시 살펴봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '물의 양과 가열 방법은 같게, 물의 종류만 달라요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'seawater', rowsKey: 'seawaterRows', goal: '물의 양을 고르고 「가열하기」 → 물이 다 마르면 두 접시를 비교해 「표에 적기」를 눌러요. 물의 양을 바꿔서도 해 봐요.',
      columns: ['물의 양', ...WATERS.map((w) => `${w} 접시`)], rowText: (r) => `${r.ml} mL → ${WATERS.map((w) => `${w} ${r[w]}`).join(' · ')}` },
    home: {
      title: '집에서 소금물 말려 보기', minutes: 15, guardian: true, duration: '햇볕 드는 곳에 2~3일 두어요',
      materials: [{ name: '작은 접시 2개', qty: '2개', have: 'home' }, { name: '소금물(물 100 mL에 소금 1숟가락)과 맹물', qty: '각 2숟가락', have: 'home' }, { name: '이름표', qty: '2장', have: 'home' }],
      steps: ['두 접시에 소금물과 맹물을 같은 양 담고 이름표를 붙여요.',
        '햇볕 드는 창가에 두고 날마다 물이 줄어드는 모습을 살펴요.',
        '물이 다 마르면 두 접시에 남은 것을 돋보기로 비교해요. 맛보지 않아요.'],
      safety: ['가스레인지로 가열하지 않아요. 보호자와 함께 해요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(육지·바다 조사·두 물 비교·해안 지형·물 높이·갯벌 조사·설득 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '실제 조사·현장 관찰·갯벌 보전 홍보와 의견을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '바닷물에는 눈에 보이지 않는 소금 같은 물질이 녹아 있어요.' }],
    analogy: '설탕을 녹인 물이 투명해도 단맛이 나듯, 바닷물에도 소금 같은 물질이 보이지 않게 녹아 있어요. 물만 날아가면 녹아 있던 것이 남아요.',
    principle: '지구는 대기로 둘러싸여 있고 바다가 육지보다 넓어요. 바닷물에는 소금 같은 물질이 녹아 있어 증발시키면 흰 알갱이가 남고, 바닷가의 물 높이는 밀물과 썰물로 오르내려요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      if (!rows.length) return '';
      const a = rows.map((r) => `${r.ml} mL에서 바닷물 ${r.seaG} g`).join(', ');
      return `네 기록: ${a} · 수돗물은 거의 남지 않았어요. 물의 양이 늘면 남는 양은 어떻게 달라졌나요?`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '바닷물에 녹아 있는 소금은 어떻게 얻을까요?' }],
    items: [t(8), t(12), 'c22-s32-u02-b25'],
    reading: { title: '바닷물로 소금 얻기', text: '서해안의 염전에서는 넓고 얕은 밭에 바닷물을 가두어 햇볕과 바람에 말려요. 물이 증발하면 바닷물에 녹아 있던 소금이 남아요. 증발 접시에서 본 흰 알갱이와 같은 원리예요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '바닷물과 수돗물이 어떻게 다른지 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/c22-s32-u02/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
