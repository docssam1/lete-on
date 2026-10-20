// 4-2 Ⅰ 밤하늘 관찰(2022 개정) — 교과 연결 사고력 수업(5단계 화면 구성). 문항 id는 c22-s42-u01.think.js(t01~t12)와 문제은행(b) 참조.
// 예전 기본 수업이던 탐구 기록 앱(9활동)은 explore.records(선택 기능, #/c22-s42-u01/records)로 옮겼다 — 저장 키 sciLab.inquiry.c22-s42-u01은 그대로.
import { recordsLesson } from './c22-s42-u01.records.js';
const t = (n) => `c22-s42-u01-t${String(n).padStart(2, '0')}`;
export const lesson = {
  unitId: 'c22-s42-u01', grade: 4, title: '밤하늘 관찰', hero: '같은 시각 달 관찰',
  engage: {
    say: [{ mood: 'thinking', text: '며칠 뒤 같은 시각에 본 달은 같은 자리에 있을까요?' }, { mood: 'talk', text: '같은 곳에서 남쪽 하늘을 바라보며 달을 관찰해 봐요.' }],
    scene: 'moon-sky',
    question: '음력 3일 저녁 7시쯤 서쪽 하늘에서 초승달을 보았어요. 12일 뒤(음력 15일) 같은 시각, 같은 곳에서 보면 달은 어떻게 보일까요?',
    predictions: [{ id: '0', text: '서쪽 하늘에 초승달 그대로' }, { id: '1', text: '동쪽 하늘에 둥근 보름달' }, { id: '2', text: '남쪽 하늘에 가느다란 그믐달' }],
    answer: '1',
    wrongNote: '관찰 결과와 비교하며 날마다 달이 보인 방향과 밝은 부분을 차례로 읽어 봐요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '관찰하는 날만 바꾸고, 시각·장소·바라보는 방향은 같게 해요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: { kind: 'moon', rowsKey: 'moonRows', goal: '음력 날짜를 고르고 「관찰하기」 → 달의 모양과 방향을 읽고 「표에 적기」를 눌러요. 3일·7일·15일을 차례로 비교해 봐요.',
      notice: '날짜·시각·방향은 대표적인 모형 값이에요. 실제 달은 날마다·계절마다 조금씩 다른 시각과 방향에 보여요.',
      columns: ['음력', '관찰 시각', '달의 이름', '모양', '보이는 방향'], rowText: (r) => `${r.day}일 ${r.time} → ${r.name} · ${r.side} · ${r.dir}` },
    home: {
      title: '집에서 사흘 간격 달 그리기', minutes: 10, guardian: true,
      materials: [{ name: '기록지(동·남·서와 건물을 미리 그림)', qty: '1장', have: 'home' }, { name: '시계', qty: '1개', have: 'home' }, { name: '색연필', qty: '1자루', have: 'home' }],
      steps: ['해가 진 뒤 늘 같은 시각, 같은 곳에서 남쪽을 바라보고 서요.',
        '달의 모양과 위치를 기록지에 그리고 날짜·시각을 적어요. 못 본 날은 「못 봄」이라고 써요.',
        '사흘쯤 뒤 같은 시각에 다시 그려, 달의 모양과 위치가 어떻게 달라졌는지 비교해요.'],
      safety: ['밤 관찰은 보호자와 함께 안전한 곳에서 해요. 도로·옥상·난간 근처는 피해요.'], qr: null,
    },
    // 선택 기능: 예전 탐구 기록 앱(달 표면·여러 날 달·태양·행성 조사·모형 설계와 제작·북쪽 별자리·공유 기록). 수업 흐름에는 넣지 않는다.
    records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '실제 여러 날 달 관찰·행성 모형 만들기·북쪽 별자리 관찰과 의견을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' },
  },
  explain: {
    say: [{ mood: 'talk', text: '달은 태양 빛을 받은 쪽만 밝게 보여요.' }],
    analogy: '어두운 방에서 친구가 손전등을 들고 공을 비추면, 공은 스스로 빛나지 않아도 손전등 쪽이 밝아요. 내가 서 있는 자리에 따라 밝은 부분이 가늘게도, 둥글게도 보여요.',
    principle: '같은 시각에 보면 달은 날마다 서쪽에서 동쪽으로 옮겨 가고, 밝게 보이는 부분은 초승달 → 상현달 → 보름달 → 하현달 → 그믐달로 약 30일마다 되풀이돼요. 달은 태양 빛을 받아 밝게 보이고, 태양계에는 스스로 빛을 내는 태양과 여덟 행성이 있어요.',
    cards: [t(1), t(2), t(3), t(4)],
    table: t(5),
    miniTest: [t(6), t(7)],
    fromData: (rows) => {
      if (!rows.length) return '';
      return `네 기록: ${rows.map((r) => `${r.day}일 ${r.name}(${r.dir})`).join(', ')}. 날이 지날수록 달이 보이는 방향과 밝은 부분은 어떻게 달라졌나요?`;
    },
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '밤하늘에서 밝게 보이는 것은 모두 별일까요?' }],
    items: [t(8), t(12), 'c22-s42-u01-b35'],
    reading: { title: '북극성 찾기', text: '북두칠성 국자 끝의 두 별을 이은 길이의 약 다섯 배만큼 가면 북극성이 있어요. 카시오페이아자리의 W 모양에서도 찾을 수 있어요. 북극성은 가장 밝은 별은 아니지만 늘 북쪽 하늘에 있어 옛날부터 방향을 찾는 데 썼어요.' },
    report: false,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '달의 모양과 위치가 달라지는 규칙을 설명할 수 있나요?' }],
    items: [t(9), t(10), t(11)],
    pass: 2,
  },
  // 보고서 화면(#/c22-s42-u01/report)은 선택 기능인 탐구 기록장과 이어진다.
  report: recordsLesson.report,
};
