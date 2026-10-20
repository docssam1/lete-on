// 3-2 Ⅲ 소리의 성질(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 c22-s32-u03.think.js(t01~t12)와 문제은행(b) 참조.
// 예전 기본 수업이던 탐구 기록 앱(7활동)은 explore.records(선택 기능, #/c22-s32-u03/records)로 옮겼다 — 저장 키 sciLab.inquiry.c22-s32-u03은 그대로.
import { recordsLesson } from './c22-s32-u03.records.js';
const t = (n) => `c22-s32-u03-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 'c22-s32-u03', grade: 3, title: '소리의 성질', hero: '책상 끝 자 튕기기',
  engage: {
    say: [{ mood: 'thinking', text: '소리가 날 때 물체는 어떻게 움직일까요?' }, { mood: 'talk', text: '책상 끝에서 자를 튕겨 알아봐요.' }],
    scene: 'ruler-desk',
    question: '자를 책상 밖으로 길게(15 cm) 내밀고 튕기면, 짧게(5 cm) 내밀 때와 비교해 소리가 어떻게 될까요?',
    predictions: [{ id: '0', text: '더 높은 소리가 나요' }, { id: '1', text: '더 낮은 소리가 나요' }, { id: '2', text: '높낮이는 같고 더 큰 소리가 나요' }],
    answer: '1',
    wrongNote: '실험 결과와 비교하며 길이를 바꿨을 때 달라진 것이 높낮이인지 세기인지 다시 들어 봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '높낮이를 볼 땐 길이만, 세기를 볼 땐 튕기는 세기만 바꿔요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'ruler', rowsKey: 'rulerRows', goal: '내민 길이와 세기를 고르고 「튕기기」 → 떨림을 보고 소리를 들은 뒤 「표에 적기」를 눌러요. 「손으로 잡기」로 떨림도 멈춰 봐요.',
      columns: ['내민 길이', '세기', '높낮이', '소리의 세기', '떨림'], rowText: (r) => `${r.len} cm · ${r.strength} → ${r.pitch} · ${r.loud} · ${r.swing}` },
    home: {
      title: '집에서 고무줄 기타 만들기', minutes: 20, guardian: true,
      materials: [{ name: '빈 상자나 통', qty: '1개', have: 'home' }, { name: '굵기가 같은 고무줄', qty: '3개', have: 'home' }, { name: '연필 2자루(받침)', qty: '2개', have: 'home' }],
      steps: ['상자에 고무줄 세 개를 걸고, 연필 받침 사이의 길이가 서로 다르게 해요.',
        '같은 세기로 튕기며 길이에 따라 높낮이가 어떻게 다른지 들어요.',
        '한 고무줄을 약하게, 세게 튕기며 소리의 세기를 비교해요.'],
      safety: ['고무줄이 얼굴 쪽으로 튀지 않게 조심해요. 보호자와 함께 해요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(떨림·세기·높낮이·전달·관 피리·효과음·소음 실천 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '실제 악기 만들기·효과음·소음 줄이기 실천과 의견을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '크게 떨리면 큰 소리, 빨리 떨리면 높은 소리가 나요.' }],
    analogy: '그네를 크게 밀면 크게 흔들리고(세기), 줄이 짧은 그네는 빨리 왔다 갔다 해요(높낮이). 소리도 떨림의 크기와 빠르기로 달라져요.',
    principle: '소리는 물체가 떨려서 나요. 크게 떨리면 큰 소리, 빨리 떨리면 높은 소리가 나고, 소리는 고체·액체·기체를 통해 전달돼요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      if (!rows.length) return '';
      const s = rows.filter((r) => r.strength === '세게').map((r) => `${r.len} cm ${r.pitch}`).join(', ');
      return `네 기록: ${rows.length}가지 조건${s ? ` · 세게 튕길 때 ${s}` : ''}. 길이를 바꾸면 무엇이, 세기를 바꾸면 무엇이 달라졌나요?`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '악기는 어떻게 높고 낮은 소리를 낼까요?' }],
    items: [t(8), t(12), 'c22-s32-u03-b35'],
    reading: { title: '길이가 다른 관 피리', text: '빨대를 길이가 다르게 잘라 나란히 붙이고 끝을 막아 불면 팬파이프가 돼요. 짧은 빨대는 높은 소리, 긴 빨대는 낮은 소리가 나요. 관 속 공기가 떨리는 길이가 달라서예요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '세기와 높낮이를 구별해 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/c22-s32-u03/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
