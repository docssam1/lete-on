// 3-2 Ⅰ 물체와 물질(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 c22-s32-u01.think.js(t01~t12)와 문제은행(b) 참조.
// 예전 기본 수업이던 탐구 기록 앱(6활동)은 explore.records(선택 기능, #/c22-s32-u01/records)로 옮겼다 — 저장 키 sciLab.inquiry.c22-s32-u01은 그대로.
import { recordsLesson } from './c22-s32-u01.records.js';
import { MATERIALS } from '../../scenes/material-model.js';
const t = (n) => `c22-s32-u01-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 'c22-s32-u01', grade: 3, title: '물체와 물질', hero: '같은 모양 막대 네 개',
  engage: {
    say: [{ mood: 'thinking', text: '같은 컵인데 왜 유리로도, 플라스틱으로도 만들까요?' }, { mood: 'talk', text: '모양이 똑같은 막대 네 개로 알아봐요.' }],
    scene: 'material-bars',
    question: '모양과 크기가 같은 네 막대를 물에 넣으면 어떻게 될까요?',
    predictions: [{ id: '0', text: '모두 떠요' }, { id: '1', text: '모두 가라앉아요' }, { id: '2', text: '뜨는 막대와 가라앉는 막대가 있어요' }],
    answer: '2',
    wrongNote: '실험 결과와 비교하며 막대마다 무엇이 달랐는지 다시 살펴봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '막대 모양과 시험 방법은 그대로 두고, 물질만 다른 네 막대를 비교해요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'material', rowsKey: 'materialRows', goal: '시험을 고르고 「시험하기」 → 네 막대의 결과를 읽고 「표에 적기」를 눌러요. 네 가지 시험을 모두 해 봐요.',
      columns: ['시험', ...MATERIALS], rowText: (r) => `${r.test} → ${MATERIALS.map((m) => `${m} ${r[m]}`).join(' · ')}` },
    home: {
      title: '집에서 같은 쓰임·다른 물질 찾기', minutes: 20, guardian: true,
      materials: [{ name: '숟가락 여러 개(금속·플라스틱·나무)', qty: '2~3개', have: 'home' }, { name: '물을 담은 그릇', qty: '1개', have: 'home' }, { name: '줄무늬나 글씨가 있는 종이', qty: '1장', have: 'home' }],
      steps: ['부엌에서 같은 쓰임인데 다른 물질로 만든 물체(숟가락·컵·그릇)를 찾아 물질 이름을 적어요.',
        '숟가락을 하나씩 물에 넣어 뜨는지 가라앉는지, 글씨 종이 앞에 두면 비쳐 보이는지 살펴요.',
        '「이 숟가락은」처럼 시험한 물체만 적고, 같은 물질이라도 다를 수 있다는 것을 함께 이야기해요.'],
      safety: ['칼·유리처럼 위험한 물건은 쓰지 않아요. 보호자와 함께 해요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(재료 관찰·분류·상태 비교·설계·의견 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '실제 시료 관찰·분류·설계와 의견을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '모양이 같아도 물질이 다르면 성질이 달라요.' }],
    analogy: '쌍둥이처럼 똑같이 생긴 막대도 「무엇으로 만들었는지」에 따라 성격이 달라요. 그래서 물체를 만들 때는 할 일에 맞는 물질을 골라요.',
    principle: '물체는 물질로 만들어요. 물질마다 단단한 정도·휘는 정도·물에 뜨는지·투명한지 같은 성질이 다르므로, 쓰임에 필요한 성질을 가진 물질을 골라 물체를 설계해요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      if (!rows.length) return '';
      const w = rows.find((r) => r.test === '물에 넣기');
      return `네 기록: 시험 ${rows.length}가지${w ? ` · 물에 넣기에서 뜬 막대는 ${MATERIALS.filter((m) => w[m] === '떠요').join('·') || '없음'}` : ''}. 같은 모양인데 결과가 다른 칸을 찾아 까닭을 말해 봐요.`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '필요한 성질을 물체의 어느 부분에 쓸까요?' }],
    items: [t(8), t(12), 'c22-s32-u01-b36'],
    reading: { title: '플라스틱은 모두 물에 뜰까?', text: '플라스틱에는 여러 종류가 있어요. 병뚜껑의 플라스틱은 물에 뜨지만, 음료수 병 몸통의 플라스틱이나 투명한 아크릴은 가라앉아요. 그래서 한 번 본 결과를 모든 플라스틱에 넓히지 않고, 시험한 것만 말해요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '물질의 성질로 재료를 고르는 까닭을 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/c22-s32-u01/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
