// 4-1 Ⅲ. 땅의 변화 — 단원 파일(창작 문항). 5E 화면(개념 카드·정리표·확장·점검)이 쓰는 문항.
// 단원평가 원문·정답은 Supabase public.science_bank_source (unit_id='s41-u03')에만 있다. git 금지.

export const unit = {
  id: 's41-u03', course: '4-1', no: 3, title: '땅의 변화', domain: '지구와 우주',
  sources: { bank: ['supabase:science_bank_source:s41-u03'] },
};

const LEVEL = { 1: '기본', 2: '심화', 3: '영재' };
const T = (element, type, concept, level, track = '교과') =>
  ({ curriculum: '2022 개정', domain: '지구와 우주', area: '지구와 우주', course: '4-1', grade: 4, unit: 'u03', element, type, concept, level: LEVEL[level], track });
const base = (no, t, prompt, extra = {}) => ({
  id: `s41-u03-b${String(no).padStart(2, '0')}`, status: 'authored', sourceRef: { sourceId: 'authored', course: '4-1', unit: 'u03', originalNo: no },
  taxonomy: t, prompt, givens: extra.givens ?? null, choices: null, visualModel: null, variantRules: null,
  evidence: { checkedBy: 'Claude', date: '2026-09-20', gates: ['science', 'answer'] },
});
const cloze = (no, t, text, blanks, explanation) => ({ ...base(no, t, text), responseContract: 'cloze', answerContract: { type: 'cloze', blanks }, explanation });
const choice = (no, t, prompt, choices, answer, explanation, extra) => ({ ...base(no, t, prompt, extra), choices,
  responseContract: 'single-choice', answerContract: { type: 'single-choice', answer, accepted: [answer] }, explanation });
const written = (no, t, prompt, required, sample, explanation, extra) => ({ ...base(no, t, prompt, extra),
  responseContract: 'written-explanation', answerContract: { type: 'written-explanation', sample, rubric: { required, pass: '채점 기준을 모두 담으면 정답', ...(extra?.bonus ? { bonus: extra.bonus } : {}) } }, explanation });

export const items = [
  // ── ③ 개념 카드 ──
  cloze(1, T('E1', 'T02', '침식·운반·퇴적', 1),
    '흐르는 물이 바위나 흙을 깎는 것을 ( ① ) 작용, 깎인 흙을 옮기는 것을 ( ② ) 작용, 옮긴 흙을 쌓는 것을 ( ③ ) 작용이라고 해요.',
    [{ answer: '침식', accepted: ['침식', '침식 작용'] }, { answer: '운반', accepted: ['운반', '운반 작용'] }, { answer: '퇴적', accepted: ['퇴적', '퇴적 작용'] }],
    '흙 언덕에 물을 흘려보내면 위쪽은 깎이고(침식), 흙이 물을 따라 옮겨져(운반), 아래쪽에 쌓여요(퇴적).'),
  cloze(2, T('E2', 'T03', '강 상류와 하류', 1),
    '경사가 급한 강 상류에서는 ( ① ) 작용이, 경사가 완만한 강 하류에서는 ( ② ) 작용이 활발해요.',
    [{ answer: '침식', accepted: ['침식', '침식 작용'] }, { answer: '퇴적', accepted: ['퇴적', '퇴적 작용'] }],
    '상류는 물이 빠르게 흘러 바위를 깎아 큰 바위와 계곡이 많고, 하류는 물이 느려져 모래와 진흙이 쌓인 넓은 땅이 많아요.'),
  cloze(3, T('E3', 'T05', '화산 분출물의 상태', 1),
    '화산 분출물 중 기체인 것은 ( ① ), 액체인 것은 ( ② )(이)에요.',
    [{ answer: '화산 가스', accepted: ['화산 가스', '화산가스'] }, { answer: '용암', accepted: ['용암'] }],
    '마그마가 땅 위로 흘러나온 것이 용암이에요. 화산재와 화산 암석 조각은 고체예요.'),
  cloze(4, T('E4', 'T07', '화강암과 현무암', 1),
    '마그마가 땅속 깊은 곳에서 천천히 식어 알갱이가 큰 암석은 ( ① ), 땅 표면 가까이에서 빨리 식어 알갱이가 작은 암석은 ( ② )(이)에요.',
    [{ answer: '화강암', accepted: ['화강암'] }, { answer: '현무암', accepted: ['현무암'] }],
    '천천히 식을수록 알갱이가 크게 자랄 시간이 많아요. 화강암은 밝은색, 현무암은 어두운색이에요.'),
  // ── ③ 정리표 ──
  { ...base(5, T('E3', 'T05', '화산 분출물 분류', 1), '화산 분출물이 어떤 상태인지 골라 표를 채워 보세요.'),
    responseContract: 'table-fill',
    answerContract: { type: 'table-fill', rowHead: '화산 분출물', columns: ['상태'],
      options: { '상태': ['고체', '액체', '기체'] },
      rows: [
        { label: '화산 가스', answer: ['기체'] },
        { label: '용암', answer: ['액체'] },
        { label: '화산재', answer: ['고체'] },
        { label: '화산 암석 조각', answer: ['고체'] },
      ] },
    explanation: '화산 가스는 대부분 수증기이고, 용암은 녹은 마그마가 흘러나온 것이에요. 화산재는 아주 작은 알갱이, 화산 암석 조각은 크기가 큰 돌이에요.' },
  // ── ③ 잠깐 확인 ──
  choice(6, T('E2', 'T03', '하류에 모래와 진흙이 쌓이는 까닭', 1),
    '강 하류에 모래와 진흙이 많이 쌓이는 까닭으로 가장 알맞은 것은 어느 것입니까?',
    ['경사가 급해서 물이 빠르게 흐르며 바닥을 깎기 때문', '강폭이 좁아서 물이 한곳으로 세차게 모이기 때문', '경사가 완만해서 물이 느리게 흘러 흙이 쌓이기 때문', '바닷물이 거꾸로 올라와 큰 바위를 옮겨 오기 때문', '물이 얼었다 녹으며 땅이 부풀어 올라오기 때문'], 2,
    '하류는 경사가 완만해 물이 느리게 흘러요. 물이 느려지면 옮기던 모래와 진흙을 내려놓아 퇴적 작용이 활발해요.'),
  // ── ④ 확장(영재성) ──
  choice(7, T('E1', 'T01', '경사가 급하면 더 많이 깎인다', 2),
    '흙 언덕 실험에서 물의 양은 그대로 두고 언덕의 경사만 더 급하게 만들었어요. 결과로 알맞은 것은 어느 것입니까?',
    ['위쪽이 더 많이 깎이고 아래쪽에 더 많이 쌓인다', '위쪽이 덜 깎이고 아래쪽에도 거의 쌓이지 않는다', '위쪽에 흙이 더 쌓이고 아래쪽은 더 많이 깎인다', '경사와 상관없이 깎이고 쌓이는 양이 똑같다', '물이 흙 속으로 스며들어 아무 변화가 없다'], 0,
    '경사가 급하면 물이 더 빠르게 흘러 위쪽을 더 많이 깎아요. 깎인 흙은 옮겨져 아래쪽에 더 많이 쌓여요.'),
  written(8, T('E2', 'T03', '굽은 강의 바깥쪽과 안쪽', 3, '영재성'),
    '강이 크게 휘어 흐르는 곳이 있어요. 휘어진 곳의 바깥쪽과 안쪽 중 어느 쪽이 더 깎이고 어느 쪽에 흙이 쌓일지, 물이 흐르는 빠르기와 관련지어 쓰세요.',
    ['바깥쪽은 물이 빠르게 흘러 더 깎인다', '안쪽은 물이 느리게 흘러 흙이 쌓인다'],
    '휘어진 곳의 바깥쪽은 물이 빠르게 흘러 침식 작용이 활발하고, 안쪽은 물이 느리게 흘러 모래와 흙이 쌓이는 퇴적 작용이 활발하다.',
    '물이 빠른 곳은 깎이고, 물이 느린 곳은 쌓여요. 흙 언덕의 위쪽·아래쪽과 같은 원리예요.'),
  written(9, T('E5', 'T09', '같은 규모라도 피해가 다른 까닭', 3, '영재성'),
    '규모가 같은 지진이 두 도시에서 일어났는데, 한 도시는 피해가 훨씬 적었어요. 그 까닭이 될 수 있는 것을 두 가지 쓰세요.',
    ['건물을 지진에 잘 견디게 지었다', '사람들이 대처 방법을 알고 훈련했다 또는 지진이 일어난 곳에서 더 멀리 떨어져 있었다'],
    '건물과 다리를 지진에 잘 견디도록 튼튼하게 지었고, 사람들이 평소에 지진 대피 훈련을 해서 빠르게 대처했기 때문이다.',
    '규모는 지진 자체의 세기예요. 피해는 건물이 얼마나 튼튼한지, 사람들이 어떻게 대처하는지에 따라 달라질 수 있어요.'),
  // ── ⑤ 점검 ──
  choice(10, T('E1', 'T02', '운반 작용', 1),
    '흐르는 물의 작용 중 운반 작용을 바르게 설명한 것은 어느 것입니까?',
    ['흐르는 물이 바위나 돌을 깎아 내는 것', '옮겨 온 흙이 낮은 곳에 쌓이는 것', '땅속의 마그마가 땅 위로 나오는 것', '깎인 돌이나 흙을 다른 곳으로 옮기는 것', '땅이 흔들리며 갈라지고 무너지는 것'], 3,
    '운반 작용은 흐르는 물이 깎인 돌이나 흙을 다른 곳으로 옮기는 거예요. 깎는 것은 침식, 쌓는 것은 퇴적이에요.'),
  choice(11, T('E3', 'T04', '화산의 특징', 1),
    '화산에 대한 설명으로 알맞은 것은 어느 것입니까?',
    ['흐르는 물이 흙을 쌓아 만든 높은 산이다', '꼭대기에 마그마가 분출한 분화구가 있기도 하다', '우리나라에는 화산이 하나도 없다', '화산은 모두 지금도 용암이 흘러나오고 있다', '화산은 모두 뾰족하고 높은 모양이다'], 1,
    '화산은 땅속 마그마가 분출해 생긴 지형이에요. 꼭대기에 분화구가 있기도 하고, 우리나라의 한라산·백두산도 화산이에요.'),
  choice(12, T('E6', 'T11', '지진 대처 방법', 1),
    '지진이 일어났을 때의 대처 방법으로 알맞은 것은 어느 것입니까?',
    ['흔들리는 동안 승강기를 타고 빨리 내려간다', '흔들림이 멈추기 전에 창문 옆으로 가서 밖을 본다', '건물 밖에서는 높은 건물 벽에 바짝 붙어 선다', '흔들리는 동안 계단으로 뛰어 내려간다', '흔들릴 때는 튼튼한 탁자 아래에 들어가 몸을 보호한다'], 4,
    '흔들릴 때는 탁자 아래에서 머리를 보호하고, 흔들림이 멈추면 계단으로 나가 넓은 곳으로 대피해요. 승강기는 타지 않아요.'),
  // ── 화산 실험실(두 번째 5단계 수업)용 — E3~E6 ──
  choice(13, T('E5', 'T08', '화산 활동의 이로운 점', 1),
    '화산 활동이 우리 생활에 주는 이로운 점은 어느 것입니까?',
    ['화산재가 날려 비행기가 뜨지 못한다', '용암이 흘러 집과 밭을 덮는다', '땅속의 열로 온천과 지열 발전을 한다', '화산 가스가 공기를 더럽힌다', '지진이 함께 일어나 건물이 무너진다'], 2,
    '화산 근처의 뜨거운 땅속 열은 온천과 지열 발전에 쓰이고, 화산재가 쌓인 땅은 시간이 지나면 양분이 많아져요. 나머지는 화산이 주는 피해예요.'),
  choice(14, T('E6', 'T10', '화산재 대처', 1),
    '화산재가 날리는 곳에 있을 때 알맞은 행동은 어느 것입니까?',
    ['창문을 활짝 열어 바람이 통하게 한다', '마스크를 쓰고 되도록 실내에 머무른다', '밖으로 나가 화산재를 만져 관찰한다', '자동차를 타고 화산 가까이로 간다', '우산 없이 밖에서 놀아도 괜찮다'], 1,
    '화산재는 아주 작은 알갱이라 숨 쉴 때 몸에 들어와요. 창문을 닫고 실내에 머물며, 밖에 나가야 하면 마스크를 써요.'),
  choice(15, T('E4', 'T07', '식는 빠르기와 결정 크기', 2),
    '뜨거운 백반 물을 두 컵에 나눠 하나는 얼음물에 담가 빨리 식히고, 하나는 상자에 넣어 천천히 식혔어요. 결과와 암석을 바르게 짝지은 것은 어느 것입니까?',
    ['천천히 식힌 컵 — 큰 결정 — 화강암', '빨리 식힌 컵 — 큰 결정 — 화강암', '빨리 식힌 컵 — 큰 결정 — 현무암', '천천히 식힌 컵 — 작은 결정 — 현무암', '두 컵 모두 — 작은 결정 — 현무암'], 0,
    '천천히 식을수록 결정이 자랄 시간이 많아 커져요. 땅속 깊은 곳에서 천천히 식은 화강암은 알갱이가 크고, 땅 위에서 빨리 식은 현무암은 알갱이가 작아요.'),
  choice(16, T('E3', 'T06', '화산 모형 실험과 실제 화산', 2),
    '마시멜로를 알루미늄 포일로 싼 화산 모형을 가열했더니 연기가 나고, 녹은 마시멜로가 흘러나와 굳었어요. 실제 화산과 바르게 짝지은 것은 어느 것입니까?',
    ['연기 — 용암, 흘러나온 마시멜로 — 화산 가스', '연기 — 화산재, 굳은 마시멜로 — 마그마', '흘러나온 마시멜로 — 화산 가스, 굳은 것 — 화산재', '알루미늄 포일 — 용암, 마시멜로 — 화산 가스', '연기 — 화산 가스, 흘러나온 마시멜로 — 용암'], 4,
    '연기는 기체인 화산 가스, 흘러나온 마시멜로는 액체인 용암, 굳은 마시멜로는 용암이 식어 굳은 화산 암석에 해당해요.'),
  choice(17, T('E5', 'T09', '지진과 규모', 1),
    '지진에 대한 설명으로 알맞은 것은 어느 것입니까?',
    ['규모가 작을수록 더 강한 지진이다', '지진은 우리나라에서 일어나지 않는다', '지진은 비가 올 때만 일어난다', '규모가 클수록 강한 지진이다', '지진이 나도 건물은 흔들리지 않는다'], 3,
    '지진의 세기는 규모로 나타내고, 규모가 클수록 강한 지진이에요. 우리나라에서도 경주·포항처럼 지진이 일어나요.'),
  written(18, T('E6', 'T11', '교실에서 지진 대처', 2),
    '학교 교실에서 수업 중에 지진이 났어요. 흔들리는 동안과 흔들림이 멈춘 뒤에 해야 할 행동을 각각 한 가지씩 쓰세요.',
    ['흔들리는 동안: 책상 아래로 들어가 머리를 보호한다', '멈춘 뒤: 선생님 안내에 따라 계단으로 운동장 같은 넓은 곳으로 나간다'],
    '흔들리는 동안에는 책상 아래로 들어가 머리를 보호하고, 흔들림이 멈추면 선생님의 안내에 따라 계단을 이용해 운동장으로 대피한다.',
    '흔들릴 때 뛰어나가면 떨어지는 물건에 다칠 수 있어요. 멈춘 뒤에 승강기가 아닌 계단으로 넓은 곳으로 나가요.'),
];

// ── 2026-10-18 문항 검수 ──
unit.sources.bank=['data/units/s41-u03.source.js'];
for(const patch of [
  {
    "id": "s41-u03-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 1,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E1",
      "type": "T02",
      "concept": "침식·운반·퇴적",
      "level": "기본",
      "track": "교과",
      "format": "단답형",
      "standard": "4과11-01",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "흐르는 물이 바위나 흙을 깎는 것을 ( ① ) 작용, 깎인 흙을 옮기는 것을 ( ② ) 작용, 옮긴 흙을 쌓는 것을 ( ③ ) 작용이라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "침식",
          "accepted": [
            "침식",
            "침식 작용"
          ]
        },
        {
          "answer": "운반",
          "accepted": [
            "운반",
            "운반 작용"
          ]
        },
        {
          "answer": "퇴적",
          "accepted": [
            "퇴적",
            "퇴적 작용"
          ]
        }
      ]
    },
    "explanation": "흙 언덕에 물을 흘려보내면 위쪽은 깎이고(침식), 흙이 물을 따라 옮겨져(운반), 아래쪽에 쌓여요(퇴적)."
  },
  {
    "id": "s41-u03-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 2,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E2",
      "type": "T03",
      "concept": "강 상류와 하류",
      "level": "기본",
      "track": "교과",
      "format": "단답형",
      "standard": "4과11-01",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "경사가 급한 강 상류에서는 ( ① ) 작용이, 경사가 완만한 강 하류에서는 ( ② ) 작용이 활발해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "침식",
          "accepted": [
            "침식",
            "침식 작용"
          ]
        },
        {
          "answer": "퇴적",
          "accepted": [
            "퇴적",
            "퇴적 작용"
          ]
        }
      ]
    },
    "explanation": "상류는 물이 빠르게 흘러 바위를 깎아 큰 바위와 계곡이 많고, 하류는 물이 느려져 모래와 진흙이 쌓인 넓은 땅이 많아요."
  },
  {
    "id": "s41-u03-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 3,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E3",
      "type": "T05",
      "concept": "화산 분출물의 상태",
      "level": "기본",
      "track": "교과",
      "format": "단답형",
      "standard": "4과11-02",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "화산 분출물 중 기체인 것은 ( ① ), 액체인 것은 ( ② )(이)에요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "화산 가스",
          "accepted": [
            "화산 가스",
            "화산가스"
          ]
        },
        {
          "answer": "용암",
          "accepted": [
            "용암"
          ]
        }
      ]
    },
    "explanation": "마그마가 땅 위로 흘러나온 것이 용암이에요. 화산재와 화산 암석 조각은 고체예요."
  },
  {
    "id": "s41-u03-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 4,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E4",
      "type": "T07",
      "concept": "화강암과 현무암",
      "level": "기본",
      "track": "교과",
      "format": "단답형",
      "standard": "4과11-03",
      "inquirySkill": "개념·자료 해석",
      "curriculumRole": "연계 심화 자료; 관찰·분류 필수 범위와 구별"
    },
    "prompt": "마그마가 땅속 깊은 곳에서 천천히 식어 알갱이가 큰 암석은 ( ① ), 땅 표면 가까이에서 빨리 식어 알갱이가 작은 암석은 ( ② )(이)에요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "화강암",
          "accepted": [
            "화강암"
          ]
        },
        {
          "answer": "현무암",
          "accepted": [
            "현무암"
          ]
        }
      ]
    },
    "explanation": "제시한 두 암석 중 화강암은 보통 큰 알갱이가 보이고 현무암은 작아요. 대체로 화강암은 밝고 현무암은 어둡지만 실제 표본을 함께 관찰해요. 냉각 과정의 원인 설명은 연계 심화 자료예요."
  },
  {
    "id": "s41-u03-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 5,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E3",
      "type": "T05",
      "concept": "화산 분출물 분류",
      "level": "기본",
      "track": "교과",
      "format": "단답형",
      "standard": "4과11-02",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "화산 분출물이 어떤 상태인지 골라 표를 채워 보세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "화산 분출물",
      "columns": [
        "상태"
      ],
      "options": {
        "상태": [
          "고체",
          "액체",
          "기체"
        ]
      },
      "rows": [
        {
          "label": "화산 가스",
          "answer": [
            "기체"
          ]
        },
        {
          "label": "용암",
          "answer": [
            "액체"
          ]
        },
        {
          "label": "화산재",
          "answer": [
            "고체"
          ]
        },
        {
          "label": "화산 암석 조각",
          "answer": [
            "고체"
          ]
        }
      ]
    },
    "explanation": "화산 가스는 대부분 수증기이고, 용암은 녹은 마그마가 흘러나온 것이에요. 화산재는 아주 작은 알갱이, 화산 암석 조각은 크기가 큰 돌이에요."
  },
  {
    "id": "s41-u03-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 6,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E2",
      "type": "T03",
      "concept": "하류에 모래와 진흙이 쌓이는 까닭",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-01",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "강 하류에 모래와 진흙이 많이 쌓이는 까닭으로 가장 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "경사가 급해서 물이 빠르게 흐르며 바닥을 깎기 때문",
      "강폭이 좁아서 물이 한곳으로 세차게 모이기 때문",
      "경사가 완만해서 물이 느리게 흘러 흙이 쌓이기 때문",
      "바닷물이 거꾸로 올라와 큰 바위를 옮겨 오기 때문",
      "물이 얼었다 녹으며 땅이 부풀어 올라오기 때문"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "하류는 경사가 완만해 물이 느리게 흘러요. 물이 느려지면 옮기던 모래와 진흙을 내려놓아 퇴적 작용이 활발해요."
  },
  {
    "id": "s41-u03-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 7,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E1",
      "type": "T01",
      "concept": "경사가 급하면 더 많이 깎인다",
      "level": "심화",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-01",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "가상 비교 기록에서 언덕 경사만 급하게 바꾼 경우에 해당하는 결과를 고르세요.",
    "givens": {
      "가상 비교 기록": {
        "caption": "가상 비교 기록",
        "머리": [
          "조건",
          "위쪽 흙이 깎인 정도",
          "아래쪽 쌓인 흙"
        ],
        "행": [
          [
            "완만한 경사",
            "적음",
            "적음"
          ],
          [
            "급한 경사",
            "많음",
            "많음"
          ]
        ]
      },
      "같게 둔 조건": "처음 흙과 모양·물의 양·붓는 시간/위치"
    },
    "choices": [
      "위쪽이 더 많이 깎이고 아래쪽에 더 많이 쌓인다",
      "위쪽이 덜 깎이고 아래쪽에도 거의 쌓이지 않는다",
      "위쪽에 흙이 더 쌓이고 아래쪽은 더 많이 깎인다",
      "경사와 상관없이 깎이고 쌓이는 양이 똑같다",
      "물이 흙 속으로 스며들어 아무 변화가 없다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "이 가상 기록의 급한 경사에서는 위쪽이 더 많이 깎이고 아래쪽에 더 많이 쌓였어요. 모든 흙이나 실제 강에서 언제나 같은 양이 변한다고 정하지 않아요."
  },
  {
    "id": "s41-u03-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 8,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E2",
      "type": "T03",
      "concept": "굽은 강의 바깥쪽과 안쪽",
      "level": "영재",
      "track": "영재성",
      "format": "서술형",
      "standard": "4과11-01",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "강이 크게 휘어 흐르는 곳이 있어요. 휘어진 곳의 바깥쪽과 안쪽 중 어느 쪽이 더 깎이고 어느 쪽에 흙이 쌓일지, 물이 흐르는 빠르기와 관련지어 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "휘어진 곳의 바깥쪽은 물이 빠르게 흘러 침식 작용이 활발하고, 안쪽은 물이 느리게 흘러 모래와 흙이 쌓이는 퇴적 작용이 활발하다.",
      "rubric": {
        "required": [
          "바깥쪽은 물이 빠르게 흘러 더 깎인다",
          "안쪽은 물이 느리게 흘러 흙이 쌓인다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "물이 빠른 곳은 깎이고, 물이 느린 곳은 쌓여요. 흙 언덕의 위쪽·아래쪽과 같은 원리예요."
  },
  {
    "id": "s41-u03-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 9,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E5",
      "type": "T09",
      "concept": "같은 규모라도 피해가 다른 까닭",
      "level": "영재",
      "track": "영재성",
      "format": "서술형",
      "standard": "4과11-04",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "규모가 같은 지진이 두 도시에서 일어났는데, 한 도시는 피해가 훨씬 적었어요. 그 까닭이 될 수 있는 것을 두 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "건물과 다리를 지진에 잘 견디도록 튼튼하게 지었고, 사람들이 평소에 지진 대피 훈련을 해서 빠르게 대처했기 때문이다.",
      "rubric": {
        "required": [
          "건물·거리·지반·대비 등 타당한 요인 두 가지를 근거와 관련지어 설명"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "피해는 지진 자체의 규모 외에도 거리·지반·건물·대비 등에 영향을 받아요. 서로 다른 타당한 요인 두 가지를 선생님과 확인해요. 실제 사례의 원인은 별도 자료가 필요해요."
  },
  {
    "id": "s41-u03-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 10,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E1",
      "type": "T02",
      "concept": "운반 작용",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-01",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "흐르는 물의 작용 중 운반 작용을 바르게 설명한 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "흐르는 물이 바위나 돌을 깎아 내는 것",
      "옮겨 온 흙이 낮은 곳에 쌓이는 것",
      "땅속의 마그마가 땅 위로 나오는 것",
      "깎인 돌이나 흙을 다른 곳으로 옮기는 것",
      "땅이 흔들리며 갈라지고 무너지는 것"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "운반 작용은 흐르는 물이 깎인 돌이나 흙을 다른 곳으로 옮기는 거예요. 깎는 것은 침식, 쌓는 것은 퇴적이에요."
  },
  {
    "id": "s41-u03-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 11,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E3",
      "type": "T04",
      "concept": "화산의 특징",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-02",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "화산에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "흐르는 물이 흙을 쌓아 만든 높은 산이다",
      "꼭대기에 마그마가 분출한 분화구가 있기도 하다",
      "우리나라에는 화산이 하나도 없다",
      "화산은 모두 지금도 용암이 흘러나오고 있다",
      "화산은 모두 뾰족하고 높은 모양이다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "화산은 땅속 마그마가 분출해 생긴 지형이에요. 꼭대기에 분화구가 있기도 하고, 우리나라의 한라산·백두산도 화산이에요."
  },
  {
    "id": "s41-u03-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 12,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E6",
      "type": "T11",
      "concept": "지진 대처 방법",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-04",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "지진이 일어났을 때의 대처 방법으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "흔들리는 동안 승강기를 타고 빨리 내려간다",
      "흔들림이 멈추기 전에 창문 옆으로 가서 밖을 본다",
      "건물 밖에서는 높은 건물 벽에 바짝 붙어 선다",
      "흔들리는 동안 계단으로 뛰어 내려간다",
      "흔들릴 때는 튼튼한 탁자 아래에 들어가 몸을 보호한다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "흔들릴 때는 탁자 아래에서 머리를 보호하고, 흔들림이 멈추면 계단으로 나가 넓은 곳으로 대피해요. 승강기는 타지 않아요."
  },
  {
    "id": "s41-u03-b13",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 13,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E5",
      "type": "T08",
      "concept": "화산 활동의 이로운 점",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-04",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "화산 활동이 우리 생활에 주는 이로운 점은 어느 것입니까?",
    "givens": null,
    "choices": [
      "화산재가 날려 비행기가 뜨지 못한다",
      "용암이 흘러 집과 밭을 덮는다",
      "땅속의 열로 온천과 지열 발전을 한다",
      "화산 가스가 공기를 더럽힌다",
      "지진이 함께 일어나 건물이 무너진다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "화산 근처의 뜨거운 땅속 열은 온천과 지열 발전에 쓰이고, 화산재가 쌓인 땅은 시간이 지나면 양분이 많아져요. 나머지는 화산이 주는 피해예요."
  },
  {
    "id": "s41-u03-b14",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 14,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E6",
      "type": "T10",
      "concept": "화산재 대처",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-04",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "화산재가 날리는 곳에 있을 때 알맞은 행동은 어느 것입니까?",
    "givens": null,
    "choices": [
      "창문을 활짝 열어 바람이 통하게 한다",
      "마스크를 쓰고 되도록 실내에 머무른다",
      "밖으로 나가 화산재를 만져 관찰한다",
      "자동차를 타고 화산 가까이로 간다",
      "우산 없이 밖에서 놀아도 괜찮다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "화산재는 아주 작은 알갱이라 숨 쉴 때 몸에 들어와요. 창문을 닫고 실내에 머물며, 밖에 나가야 하면 마스크를 써요."
  },
  {
    "id": "s41-u03-b15",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 15,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E4",
      "type": "T07",
      "concept": "식는 빠르기와 결정 크기",
      "level": "심화",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-03",
      "inquirySkill": "개념·자료 해석",
      "curriculumRole": "연계 심화 자료; 관찰·분류 필수 범위와 구별"
    },
    "prompt": "교사 자료의 가상 백반 결정 관찰에서 천천히 식힌 컵의 결정이 더 컸습니다. 자료와 화성암의 생성 설명을 대응시킨 것으로 맞는 것은?",
    "givens": null,
    "choices": [
      "천천히 식힌 컵 — 큰 결정 — 화강암",
      "빨리 식힌 컵 — 큰 결정 — 화강암",
      "빨리 식힌 컵 — 큰 결정 — 현무암",
      "천천히 식힌 컵 — 작은 결정 — 현무암",
      "두 컵 모두 — 작은 결정 — 현무암"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "가상 관찰의 천천히 식은 큰 결정과 천천히 식어 알갱이가 큰 화강암을 비교한 자료예요. 백반 결정은 실제 암석과 재료·과정이 다르며 학생이 뜨거운 용액을 다루는 절차가 아니에요."
  },
  {
    "id": "s41-u03-b16",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 16,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E3",
      "type": "T06",
      "concept": "화산 모형 실험과 실제 화산",
      "level": "심화",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-02",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "교사가 제공한 화산 모형 영상에는 연기처럼 보이는 것이 나오고 녹은 재료가 흘러나왔습니다. 원문 모형과 실제 화산을 비교한 설명으로 맞는 것은?",
    "givens": null,
    "choices": [
      "연기 — 용암, 흘러나온 마시멜로 — 화산 가스",
      "연기 — 화산재, 굳은 마시멜로 — 마그마",
      "흘러나온 마시멜로 — 화산 가스, 굳은 것 — 화산재",
      "알루미늄 포일 — 용암, 마시멜로 — 화산 가스",
      "연기 — 화산 가스, 흘러나온 마시멜로 — 용암"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "영상의 나오는 모습은 화산 가스의 나오는 모습과, 흐르는 녹은 재료는 용암의 흐름과 비교해요. 재료·성분·온도·분출 원리까지 같다는 뜻이 아니며 학생이 가열을 따라 하지 않아요."
  },
  {
    "id": "s41-u03-b17",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 17,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E5",
      "type": "T09",
      "concept": "지진과 규모",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "standard": "4과11-04",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "지진에 대한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "규모가 작을수록 더 강한 지진이다",
      "지진은 우리나라에서 일어나지 않는다",
      "지진은 비가 올 때만 일어난다",
      "규모가 클수록 강한 지진이다",
      "지진이 나도 건물은 흔들리지 않는다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "규모는 지진 자체의 크기를 나타내는 수치예요. 한 장소의 흔들림이나 피해는 거리·지반·건물·대비 등도 살펴야 해요. 우리나라에서도 지진 대비가 필요해요."
  },
  {
    "id": "s41-u03-b18",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u03",
      "originalNo": 18,
      "type": "authored-practice",
      "edition": "수업 창작 연습"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "지구와 우주",
      "area": "지구와 우주",
      "course": "4-1",
      "grade": 4,
      "unit": "u03",
      "element": "E6",
      "type": "T11",
      "concept": "교실에서 지진 대처",
      "level": "심화",
      "track": "교과",
      "format": "서술형",
      "standard": "4과11-04",
      "inquirySkill": "개념·자료 해석"
    },
    "prompt": "학교 교실에서 수업 중에 지진이 났어요. 흔들리는 동안과 흔들림이 멈춘 뒤에 해야 할 행동을 각각 한 가지씩 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ]
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "흔들리는 동안에는 책상 아래로 들어가 머리를 보호하고, 흔들림이 멈추면 선생님의 안내에 따라 계단을 이용해 운동장으로 대피한다.",
      "rubric": {
        "required": [
          "흔들리는 동안: 책상 아래로 들어가 머리를 보호한다",
          "멈춘 뒤: 선생님 안내에 따라 계단으로 운동장 같은 넓은 곳으로 나간다"
        ],
        "pass": "채점 기준을 모두 담으면 정답"
      }
    },
    "explanation": "흔들릴 때 뛰어나가면 떨어지는 물건에 다칠 수 있어요. 멈춘 뒤에 승강기가 아닌 계단으로 넓은 곳으로 나가요."
  }
]){const q=items.find(q=>q.id===patch.id);if(!q)throw Error(patch.id);Object.assign(q,patch);}
items.push(...[
  {
    "id": "s41-u03-b19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "언덕의 기울기에 따른 차이를 비교하려고 합니다. 두 통에서 다르게 할 조건은 무엇인가요?",
    "givens": null,
    "choices": [
      "처음 넣는 흙의 종류",
      "물을 흘리는 전체 양",
      "물을 붓기 시작하는 위치",
      "흙 언덕을 받치는 높이",
      "흙을 처음 눌러 담는 정도"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "기울기 비교에서는 받치는 높이를 달리하고 흙·물·붓는 위치 등 다른 조건을 맞춰요. 받침은 교사가 안정하게 준비해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물 100mL를 같은 위치에서 흘릴 때 붓는 시간까지 기록하는 까닭은 무엇인가요?",
    "givens": null,
    "choices": [
      "시간만으로 같은100mL를 썼는지 확인하려고",
      "시간만으로 깎인 흙의 무게를 정하려고",
      "기울기가 기록 없이 같아졌는지 보려고",
      "붓는 빠르기 조건을 맞추려고",
      "한 번 잰 시간으로 반복 비교를 생략하려고"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "총 물 양이 같아도 붓는 시간이 다르면 흐르는 빠르기 조건이 달라질 수 있어요. 실제 비교 조건과 시간도 기록해야 해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 언덕에 물을 연달아 부은 두 결과를 비교했습니다. 두 번째 결과의 한계는 무엇인가요?",
    "givens": null,
    "choices": [
      "이미 젖고 파인 언덕에서 시작했다.",
      "언덕의 이름표가 그대로 붙어 있었다.",
      "처음과 같은 물을 다시 사용했다.",
      "첫 결과를 관찰 기록에 남겨 두었다.",
      "두 차례의 시행 날짜를 함께 적었다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "두 번째에는 초기 모양과 젖은 정도가 달라져요. 같은 조건 반복을 하려면 별도의 같은 처음 상태를 준비하거나 달라진 조건을 밝혀요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실험 전·후 사진을 정확하게 비교하기 좋은 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "앞 사진은 위에서 뒤 사진은 옆에서 찍는다.",
      "같은 위치와 기준자로 두 번 촬영한다.",
      "뒤 사진에서 파인 부분만 확대해 찍는다.",
      "앞 사진 없이 기억나는 모습만 그린다.",
      "흙을 다시 보탠 다음 뒤 사진을 찍는다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "사진 위치·방향·기준자를 맞추면 같은 부분의 변화를 비교하기 쉬워요. 사진만으로 알 수 없는 값은 실제로 잰 것과 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가상 비교 기록을 보고 자료가 직접 뒷받침하는 결론을 고르세요.",
    "givens": {
      "가상 비교 기록": {
        "caption": "가상 비교 기록",
        "머리": [
          "받침 조건",
          "홈 깊이"
        ],
        "행": [
          [
            "A 낮은 받침",
            "1cm"
          ],
          [
            "B 높은 받침",
            "2cm"
          ]
        ]
      },
      "같게 둔 조건": "흙·처음 모양·물의 양과 붓는 시간"
    },
    "choices": [
      "기울기가 두 배면 언제나 홈도 두 배다.",
      "모든 흙 언덕은 한 번에 같은 깊이로 파인다.",
      "이 조건에서는 B의 홈이 더 깊었다.",
      "강 하류에는 앞으로 침식이 일어나지 않는다.",
      "홈의 깊이를 재면 흙의 무게도 알 수 있다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "가상 자료의 B는2cm, A는1cm예요. 제시한 조건의 차이는 읽을 수 있지만 모든 흙·강·반복의 결과까지 확정하지는 못해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕을 안전하고 공정하게 비교할 계획 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "교사가 안정된 받침과 낮은 쟁반을 확인한다.",
      "흙탕물을 손으로 튀겨 먼 곳까지 보낸다.",
      "한쪽 언덕에만 새 흙을 더 넣고 비교한다.",
      "흙·물의 조건과 처음 상태를 기록한다.",
      "물을 붓는 시간은 기록하지 않고 바꾼다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "받침과 물 넘침을 교사와 확인하고 비교 조건을 기록해요. 사용한 물·흙은 교사가 정한 방법으로 정리해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    }
  },
  {
    "id": "s41-u03-b25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "기울기 비교에서 두 통에 넣는 물의 양을 다르게 했다면 무엇이 잘 통제되지 않은 건가요? 두 낱말로 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "기울기를 비교할 때 물의 양도 달라졌다면 차이를 기울기 하나의 영향으로 정하기 어려워요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "물의 양",
      "accepted": [
        "물의 양",
        "물 양",
        "물양"
      ]
    }
  },
  {
    "id": "s41-u03-b26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E1",
      "type": "T12",
      "standard": "4과11-01",
      "topic": "흙 언덕의 공정한 비교",
      "concept": "흙 언덕의 공정한 비교",
      "inquirySkill": "변인 통제",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "언덕 A·B에서 결과가 달랐습니다. 비교를 다시 하려고 같게 둘 조건 두 가지와 결과 기록 방법을 설계하세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "계획이 타당한지 교사와 확인해요. 계획을 쓴 것만으로 실제 실험을 했다고 표시하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "기울기만 달리하고 같은 흙과 같은 물 양·붓는 시간을 맞춘다. 처음과 나중의 홈 깊이를 같은 기준자로 기록하고 처음 상태를 맞춰 반복한다.",
      "rubric": {
        "required": [
          "비교 목표를 밝힘",
          "다른 조건 두 가지 이상을 같게 둠",
          "결과를 기록/재확인할 방법"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  },
  {
    "id": "s41-u03-b27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물길 사진에서 침식의 직접적인 근거가 되는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "다른 장소에서 쓰던 흙을 사진 옆에 놓았다.",
      "물을 붓기 전 흙의 이름표를 다시 붙였다.",
      "모형을 본 학생이 재미있었다고 말하였다.",
      "처음 표시한 흙 표면보다 깊은 홈이 생겼다.",
      "물길의 예상 그림에 깊은 홈을 그려 넣었다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "처음 기준보다 실제 흙 표면이 깎인 변화가 침식의 근거예요. 예상·소감·별도 흙은 그 변화의 관찰 근거가 아니에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "한 강의 하류에서도 물살이 빠른 좁은 지점을 보았습니다. 알맞은 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "하류라고 적었으니 관찰한 좁은 폭은 지워 버린다.",
      "하류에서는 침식이 없으니 바위 흔적은 없다고 쓴다.",
      "전형적인 하류 특징과 다른 이 지점 조건도 적는다.",
      "한 지점이 다르므로 모든 강의 설명이 틀렸다고 쓴다.",
      "사진에서 넓은 강처럼 보이도록 가장자리를 자른다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "상류·하류의 전형적인 특징과 모든 지점의 모습은 같지 않아요. 실제 위치·폭·경사·물살과 근거를 함께 기록해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "물이 지나간 뒤 바닥에 새 모래층이 생겼습니다. 직접 확인한 작용은 무엇인가요?",
    "givens": null,
    "choices": [
      "침식 작용",
      "화산 활동",
      "퇴적 작용",
      "지진의 흔들림",
      "마그마 분출"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "옮겨 온 모래가 쌓인 모습은 퇴적의 근거예요. 그 이전의 이동은 운반, 원래 흙이 깎인 장면은 침식이에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "강 사진 한 장만으로 알기 어려운 것을 고르세요.",
    "givens": null,
    "choices": [
      "사진에 보이는 큰 바위의 존재",
      "사진에 보이는 모래밭의 위치",
      "그 장소에서 한 해 동안 깎인 흙의 양",
      "사진에 드러난 물길의 생김새",
      "사진 속 물가 주변에 나무가 있는지"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "한 해 동안의 변화량은 서로 다른 시점의 조사와 측정이 필요해요. 사진에서 보이는 특징과 시간에 따른 측정값을 나누어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 모래가 A에서 떨어져 B로 이동하고 C에 쌓였습니다. B 장면의 작용은 무엇인가요?",
    "givens": null,
    "choices": [
      "운반 작용",
      "퇴적 작용",
      "침식 작용",
      "화산 활동",
      "지진의 흔들림"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "B에서는 알갱이가 다른 곳으로 이동하고 있으므로 운반이에요. 떨어져 깎이는 A와 멈춰 쌓인 C를 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사진과 지형 설명을 관련지을 때 타당한 방법 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "자료가 없는 흙의 무게를 실제 값처럼 적는다.",
      "사진의 바위·모래·강폭 등 관찰 근거를 적는다.",
      "침식 사진이면 운반은 전혀 없었다고 적는다.",
      "사진의 색만으로 강의 정확한 속도를 적는다.",
      "전형적인 상류·하류 특징과 다른 점도 적는다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "사진에 보이는 근거를 먼저 적고 알 수 없는 측정값은 비워 두어요. 한 지점에서 여러 작용이 함께 나타날 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    }
  },
  {
    "id": "s41-u03-b33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료에는 좁고 급한 골짜기, 큰 바위, 깎인 흔적이 있습니다. 상류·하류 중 전형적인 모습에 맞는 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "좁은 폭·급한 경사·큰 바위·침식 근거가 함께 제시되어 상류의 전형적인 모습에 대응해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "상류",
      "accepted": [
        "상류",
        "강 상류"
      ]
    }
  },
  {
    "id": "s41-u03-b34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E2",
      "type": "T13",
      "standard": "4과11-01",
      "topic": "물의 작용과 지형 근거",
      "concept": "물의 작용과 지형 근거",
      "inquirySkill": "자료 해석",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흙 언덕 모형에서 본 변화와 강 주변 사진을 연결하되, 같다고 할 수 없는 점도 하나 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "대응하는 현상과 모형의 한계를 함께 설명해요. 실제 강가의 위험한 곳에 직접 가서 확인하는 과제가 아니에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "모형 아래쪽에 모래가 쌓인 모습과 사진의 모래밭을 퇴적과 연결했다. 다만 작은 모형의 몇 분 기록으로 실제 강이 변하는 시간이나 양을 정할 수는 없다.",
      "rubric": {
        "required": [
          "모형 관찰과 사진의 구체적 근거를 연결",
          "모형의 크기·시간·조건 한계 한 가지"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  },
  {
    "id": "s41-u03-b35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실온 물을 작은 산 모형의 열린 곳으로 흘려보냈습니다. 이 모형이 표현할 수 있는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "땅속 마그마가 만들어지는 실제 과정",
      "실제 용암의 높은 온도를 재현한 값",
      "열린 곳에서 액체가 흘러나오는 모습",
      "화산재가 사람에게 주는 실제 피해",
      "실제 화산의 모든 분출물을 만드는 일"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "작은 물 모형은 액체가 나와 흐르는 모습만 표현해요. 물은 실제 용암이 아니며 온도·원리·분출물을 같다고 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모형의 파란 물을 실제 용암처럼 빨간색으로 칠했습니다. 색을 바꾸어도 여전히 다른 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "물의 종류와 온도 등 실제 물질의 성질",
      "모형을 설명할 때 붙인 이름표의 글자",
      "그림 설명에서 사용한 화살표의 색깔",
      "관찰 기록에서 새로 고른 색연필 이름",
      "발표 자료에서 바꾼 표지 그림의 색깔"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "색을 비슷하게 표현해도 재료와 온도가 실제 용암처럼 변하지 않아요. 보이는 표현과 물질의 성질을 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "작은 모형에서 물이 흘렀지만 식어서 굳지는 않았습니다. 알맞은 결론을 고르세요.",
    "givens": null,
    "choices": [
      "모형 물이 굳지 않았으므로 실제 용암도 굳지 않는다.",
      "흐름은 표현했지만 용암의 굳음은 표현하지 못했다.",
      "물에 색을 넣었으므로 물이 실제 용암으로 바뀌었다.",
      "모형의 한 장면으로 실제 분출 원리를 모두 확인했다.",
      "모형이 작으므로 어떤 모습도 실제와 비교하지 못한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "한 모형은 일부 특징만 보여 줄 수 있어요. 표현한 흐름과 표현하지 못한 굳음·높은 온도 등을 나누어 기록해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 모형 영상에서 연기처럼 보인 것이 화산 가스와 같다고 써도 될까요? 가장 알맞은 설명을 고르세요.",
    "givens": null,
    "choices": [
      "겉모습이 닮았으므로 성분도 모두 같다고 정한다.",
      "나오는 모습만 비교하고 같은 물질로 보지 않는다.",
      "흰색으로 보였으므로 전부 화산재라고 정한다.",
      "모형에서 나왔으므로 실제 온도까지 같다고 정한다.",
      "움직이고 있으므로 액체 용암이라고 정한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "모형의 시각적 대응과 실제 성분·온도를 구별해요. 영상에 없는 성분 측정 결과를 만들어 쓰지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "교실 모형을 준비할 때 학생이 할 활동으로 적절한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "분출을 보려고 닫힌 병을 직접 가열한다.",
      "교사가 준비한 실온 물 모형의 흐름을 기록한다.",
      "뜨거운 모형 재료를 손으로 눌러 확인한다.",
      "연기가 나는 곳에 얼굴을 가까이 대어 본다.",
      "모형을 진짜처럼 보이게 하려고 불을 붙인다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "학생은 교사가 안전을 확인한 실온 모형이나 제공 자료를 관찰해요. 가열·불·밀폐·뜨거운 재료나 연기에 접근하는 활동을 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "모형과 실제 화산 비교 보고서에 들어갈 타당한 두 문장을 고르세요.",
    "givens": null,
    "choices": [
      "모형에서 표현한 흐름을 실제 용암의 흐름과 비교했다.",
      "모형 물이 실제 용암이 되었다고 결론 내렸다.",
      "모형 한 번으로 모든 화산 피해를 예측했다.",
      "크기·재료·온도처럼 표현하지 못한 점을 따로 적었다.",
      "기록에 없는 분출량을 실제 값으로 써 넣었다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "모형의 대응과 한계를 함께 쓰면 무엇을 확인했는지 분명해져요. 가상 수치와 실제 측정값을 섞지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    }
  },
  {
    "id": "s41-u03-b41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실제 현상의 일부를 다른 재료나 작은 크기로 표현한 것을 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "모형은 일부 특징을 표현한 것이며 실제 물질이나 모든 원리를 그대로 재현한 것은 아니에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "모형",
      "accepted": [
        "모형"
      ]
    }
  },
  {
    "id": "s41-u03-b42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T14",
      "standard": "4과11-02",
      "topic": "화산 모형의 표현과 한계",
      "concept": "화산 모형의 표현과 한계",
      "inquirySkill": "모형 비교",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실온 물을 쓰는 화산 모형을 계획하세요. 무엇을 표현할지, 표현하지 못하는 점, 안전하게 확인할 방법을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "설계는 여러 가지가 가능해요. 가열하거나 닫힌 용기를 가압하는 방법을 요구하지 않으며 계획과 실제 관찰 기록을 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "열린 곳에서 액체가 흐르는 모습을 물로 표현한다. 물은 용암과 온도·재료가 다르고 굳는 모습은 나타내지 못한다. 교사가 준비한 낮은 쟁반에서 넘침을 확인하고 흐름만 기록한다.",
      "rubric": {
        "required": [
          "표현 목표",
          "실제와 다른 점",
          "교사가 확인할 안전 조건과 관찰 방법"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  },
  {
    "id": "s41-u03-b43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산재가 공중에 날리고 있습니다. 물질의 상태를 판단할 때 알맞은 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "공중에 있으므로 알갱이는 모두 기체가 되었다.",
      "바람에 날리므로 고체 알갱이는 존재할 수 없다.",
      "움직이는 모습이 있으므로 전부 액체가 되었다.",
      "작은 고체 알갱이가 공기 중에 퍼져 있다.",
      "멀리 이동했으므로 마그마로 바뀐 것이다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "위치와 이동은 물질의 상태와 같지 않아요. 화산재는 작은 고체 알갱이이며 공중에 날릴 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흘러나오는 물질과 나중에 굳은 표본을 구별해 적으려 합니다. 알맞은 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "흘러나올 때 기체, 충분히 식어 굳은 뒤 액체",
      "흘러나올 때 고체, 충분히 식어 굳은 뒤 기체",
      "흘러나올 때 액체, 충분히 식어 굳은 뒤 고체",
      "흘러나올 때 액체, 굳은 뒤에도 반드시 액체",
      "움직임이 있으면 처음과 나중 모두 기체"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "용암이 흘러나오는 때와 식어 굳은 뒤의 상태를 시간에 맞춰 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "분출물의 상태를 확인하는 수업에서 적절한 자료 사용 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "화산재 가루를 맨손으로 만져 상태를 확인한다.",
      "교사가 제공한 영상과 표본 설명을 읽는다.",
      "화산 가스를 가까이에서 냄새 맡아 확인한다.",
      "뜨거운 용암 사진을 보고 직접 다가가 확인한다.",
      "모르는 가루를 입에 넣어 물질을 확인한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "분출물은 제공된 영상·사진·안전한 표본 자료로 확인해요. 실제 뜨거운 분출물이나 유해 물질에 접근하는 활동이 아니에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "설명에서 화산 분출물과 다른 지형 이름이 섞였습니다. 지형의 이름을 고르세요.",
    "givens": null,
    "choices": [
      "분화구",
      "화산재",
      "용암",
      "화산 가스",
      "화산 암석 조각"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "분화구는 움푹 파인 지형의 이름이에요. 용암·가스·재·암석 조각은 분출물의 이름이에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "영상에 분출물의 움직임만 보이고 성분 자료는 없습니다. 아직 확정할 수 없는 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "영상에서 물질이 나오는 위치",
      "기체의 성분별 정확한 양",
      "영상에서 액체가 흐르는 방향",
      "영상에 고체 조각이 보이는지",
      "영상 속 분출 장면의 순서"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "정확한 성분별 양은 별도 측정 자료가 필요해요. 영상으로 본 모습과 성분 측정을 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "분출물의 상태를 바르게 짝지은 두 설명을 고르세요.",
    "givens": null,
    "choices": [
      "화산 가스는 작은 고체 가루이다.",
      "흘러나오는 용암은 액체이다.",
      "화산재는 날리므로 기체이다.",
      "흘러나오는 용암은 모두 고체이다.",
      "화산재와 화산 암석 조각은 고체이다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "용암은 액체, 가스는 기체, 화산재와 화산 암석 조각은 고체로 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    }
  },
  {
    "id": "s41-u03-b49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "기체인 화산 분출물을 가리키는 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "화산 가스에는 수증기 등 여러 기체가 섞여 있어요. 작은 고체 가루인 화산재와 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "화산 가스",
      "accepted": [
        "화산 가스",
        "화산가스"
      ]
    }
  },
  {
    "id": "s41-u03-b50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E3",
      "type": "T15",
      "standard": "4과11-02",
      "topic": "분출물의 상태와 관찰",
      "concept": "분출물의 상태와 관찰",
      "inquirySkill": "관찰·추론 구별",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "분출물의 이름과 상태를 설명하는 안내 카드를 설계하세요. 관찰 자료와 안전하게 자료를 얻는 방법도 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "그림·표 등 여러 표현이 가능해요. 분출물을 직접 채집하거나 냄새 맡는 과제로 만들지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "용암은 액체, 화산 가스는 기체, 화산재·암석 조각은 고체로 적는다. 공공 영상과 교사가 제공한 안전한 사진의 출처를 기록하고 실제 분출물에 접근하지 않는다.",
      "rubric": {
        "required": [
          "이름과 상태의 올바른 대응",
          "자료 출처/관찰 근거",
          "직접 접근하지 않는 방법"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  },
  {
    "id": "s41-u03-b51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 암석의 알갱이를 공정하게 비교하는 방법을 고르세요.",
    "givens": null,
    "choices": [
      "한 표본만 돋보기로 보고 다른 것은 멀리서 본다.",
      "밝은 표본에만 빛을 비추고 어두운 것은 가린다.",
      "색연필로 알갱이를 그린 뒤 실제 모습이라고 쓴다.",
      "같은 조명과 같은 확대 조건에서 살펴본다.",
      "한 표본만 물에 적시고 원래 색이었다고 기록한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "조명·거리·확대 조건을 맞춰 색·알갱이·구멍을 비교해요. 건조/젖은 상태도 구별하여 기록해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "암석 관찰 기록 중 추측을 관찰 사실처럼 쓴 것을 고르세요.",
    "givens": null,
    "choices": [
      "표본의 사진만 보고 땅속 온도를 실제 값으로 적었다.",
      "밝은 바탕에 흰색·검은색 알갱이가 보인다고 적었다.",
      "돋보기로 보아 작은 구멍 두 곳이 보인다고 적었다.",
      "맨눈으로 알갱이 경계가 잘 안 보인다고 적었다.",
      "처음 표본 이름을 모르므로 미확인이라고 적었다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "사진이나 표본에서 직접 본 특징과 생성 당시의 온도 추정은 달라요. 측정하지 않은 온도를 실제 값처럼 쓰지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b53",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "표본이 어두운데 구멍이 보이지 않습니다. 적절한 다음 행동은 무엇인가요?",
    "givens": null,
    "choices": [
      "구멍이 없으므로 현무암은 절대 아니라고 정한다.",
      "알갱이 등 다른 특징과 표본 정보를 함께 확인한다.",
      "어두운 색 하나만 보고 모든 암석을 현무암으로 정한다.",
      "구멍을 직접 만들고 처음부터 있었다고 기록한다.",
      "자료와 다르므로 관찰한 구멍 없음 기록을 지운다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "현무암에는 구멍이 없는 것도 있어요. 색·알갱이·구멍과 제공된 표본 정보를 함께 보고 모르면 확인을 남겨요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b54",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "알갱이 크기를 말로만 비교한 기록을 더 분명하게 만드는 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "다른 크기로 인쇄한 사진 두 장을 바로 비교한다.",
      "크게 보이도록 한 표본 사진만 확대하여 바꾼다.",
      "모든 알갱이의 크기를 재지 않고 같은 수로 적는다.",
      "비교가 어려운 부분을 지우고 이름만 남겨 둔다.",
      "같은 확대 사진과 기준 크기를 함께 남긴다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "확대 정도와 기준이 있어야 보이는 크기를 비교할 수 있어요. 정확히 재지 않은 수치를 측정값으로 만들지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b55",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "암석 표본 관찰에서 안전하게 할 행동을 고르세요.",
    "givens": null,
    "choices": [
      "표본을 깨서 날카로운 새 면을 손으로 문지른다.",
      "돌 가루를 얼굴 가까이 불어 날리며 본다.",
      "교사가 준비한 표본을 쟁반에서 돋보기로 본다.",
      "표본의 맛으로 종류를 정하려고 입에 넣는다.",
      "단단함을 비교하려고 친구 쪽으로 던진다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "표본은 교사가 준비하고 쟁반에서 관찰해요. 깨기·가루 날리기·맛보기·던지기를 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b56",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 암석의 관찰표에 직접 본 특징으로 적을 항목 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "같은 조건에서 본 표면 색과 알갱이 모습",
      "보지 않은 땅속의 온도를 실제 측정값으로 기록",
      "표본 이름만 보고 관찰하지 않은 구멍을 그려 넣기",
      "돋보기로 확인한 구멍의 있음·없음",
      "두 암석의 형성 연대를 근거 없이 같은 값으로 적기"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "관찰표에는 직접 본 색·알갱이·구멍을 적고, 자료로 알아낸 생성 설명은 별도 칸에 적어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    }
  },
  {
    "id": "s41-u03-b57",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화강암과 현무암을 비교할 때 색뿐 아니라 암석을 이루는 작은 낱개의 크기도 살펴봅니다. 이 낱개를 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "색·알갱이 크기와 모습·구멍을 같은 조건에서 함께 관찰해요. 암석을 부수어 가루를 만드는 활동은 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "알갱이",
      "accepted": [
        "알갱이",
        "암석 알갱이"
      ]
    }
  },
  {
    "id": "s41-u03-b58",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T16",
      "standard": "4과11-03",
      "topic": "암석의 비교 관찰",
      "concept": "암석의 비교 관찰",
      "inquirySkill": "관찰·측정",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "표본 A·B를 아직 분류하지 않았습니다. 비교 관찰표에 넣을 특징 세 가지와 같게 볼 조건을 설계하세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "관찰을 실제로 했는지와 관찰 계획만 세웠는지를 구별해요. 표본의 안전한 사용과 정리는 교사 안내를 따라요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "색·알갱이 크기·구멍 유무를 적고 같은 조명과 돋보기로 본다. 잘 보이지 않는 특징은 미확인으로 남기고 교사 표본 정보와 대조한다.",
      "rubric": {
        "required": [
          "관찰 특징 세 가지",
          "같게 둘 관찰 조건",
          "모르는 점을 남기는 방법"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  },
  {
    "id": "s41-u03-b59",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "현무암·화강암 각 하나인 표본 두 개 중 큰 알갱이가 여러 색으로 보이는 것은 어느 암석에 가깝나요?",
    "givens": null,
    "choices": [
      "현무암",
      "화산 가스",
      "용암이 흐르는 중",
      "화강암",
      "작은 화산재 가루"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "두 표본의 관찰 조건에서 큰 여러 색 알갱이가 보이는 것은 화강암에 대응해요. 모르는 모든 암석을 한 특징으로 정하는 규칙은 아니에요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b60",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "표본을 분류하는 기준으로 적절하지 않은 것을 고르세요.",
    "givens": null,
    "choices": [
      "같은 조명에서 관찰한 표면의 색깔",
      "같은 확대 조건에서 본 알갱이의 모습",
      "여러 면을 살펴 확인한 구멍의 유무",
      "관찰표와 대조한 교사 제공 표본 정보",
      "표본을 본 학생이 더 예쁘다고 고른 것"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "예쁘다는 느낌은 관찰한 암석 특징에 근거한 분류 기준이 아니에요. 특징을 확인하고 같은 기준을 적용해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b61",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "한 학생은 색, 다른 학생은 구멍만 보고 서로 다르게 분류했습니다. 다음으로 할 일을 고르세요.",
    "givens": null,
    "choices": [
      "첫 학생의 이름이 앞이므로 그 분류를 따른다.",
      "같은 특징들을 함께 관찰하여 기준을 맞춘다.",
      "구멍이 더 많아 보이는 사진만 남겨 결론 낸다.",
      "두 표본의 이름을 바꾸고 관찰 결과도 바꾼다.",
      "표본을 보지 않고 다수결로 암석 종류를 정한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "같은 기준과 조건으로 색·알갱이·구멍을 재확인하고 표본 자료와 대조해요. 다수결 자체가 암석 종류의 근거가 되지는 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    }
  },
  {
    "id": "s41-u03-b62",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "밝은색이지만 알갱이가 잘 보이지 않는 미확인 돌을 발견했습니다. 가장 타당한 결론은 무엇인가요?",
    "givens": null,
    "choices": [
      "밝은 돌은 모두 화강암이므로 이름을 바로 확정한다.",
      "이름을 모르므로 관찰한 색도 틀렸다고 지운다.",
      "분류표의 빈칸을 없애려고 아무 이름이나 쓴다.",
      "돋보기 없이 본 뒤 정확한 알갱이 크기를 적는다.",
      "현재 관찰만으로 종류를 확정하지 않고 더 확인한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "주어진 두 표본을 비교하는 기준을 모든 미확인 암석에 그대로 적용하지 않아요. 부족한 근거를 남겨 추가 확인해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b63",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "관찰한 특징에 맞게 이름표를 수정한 뒤 필요한 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "바꾼 기준과 그 근거를 수정 전 기록과 함께 남긴다.",
      "처음 기록을 지워 처음부터 맞혔다고 표시한다.",
      "수정한 날짜 없이 암석 이름만 다른 것으로 바꾼다.",
      "정답 이름만 쓰고 본 특징은 기록에서 모두 지운다.",
      "기준이 달라진 이유 대신 친구 이름만 기록한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "분류 기준을 보완한 이유·관찰 근거·다시 확인한 점을 남기면 판단 과정을 살펴볼 수 있어요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b64",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "현무암·화강암 관찰과 분류에 타당한 설명 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "구멍이 있는 돌은 모두 현무암이다.",
      "현무암은 표면 구멍이 없는 표본도 있다.",
      "밝은색인 모든 물체는 화강암이다.",
      "두 표본은 보지 않고 이름표만으로 관찰을 끝낸다.",
      "화강암은 보통 여러 색 큰 알갱이가 보인다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "두 암석의 전형적인 특징을 비교하되 한 가지 특징을 모든 돌에 적용하지 않아요. 실제 본 특징과 제공 표본 정보를 함께 확인해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    }
  },
  {
    "id": "s41-u03-b65",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "제시한 두 표본 중 어둡고 알갱이가 작으며 교사 표본 정보와 일치한 암석 이름을 쓰세요.",
    "givens": {
      "표본 정보": "비교하는 두 표본은 현무암·화강암이다."
    },
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "두 표본의 특징과 표본 정보를 함께 확인했으므로 현무암으로 분류할 수 있어요. 구멍 유무 하나만으로 판단하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "현무암",
      "accepted": [
        "현무암"
      ]
    }
  },
  {
    "id": "s41-u03-b66",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E4",
      "type": "T17",
      "standard": "4과11-03",
      "topic": "암석 분류 기준과 재확인",
      "concept": "암석 분류 기준과 재확인",
      "inquirySkill": "분류·근거 검토",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 표본을 분류한 친구와 의견이 다릅니다. 비교 기준을 맞추고 결론을 다시 확인하는 절차를 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "대화·재관찰·수정의 실제 근거가 있는지는 교사가 확인해요. 계획을 써서 실제 소통이 완료됐다고 표시하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "어떤 특징 때문에 이름이 달랐는지 듣고 같은 조명·돋보기로 알갱이와 구멍을 다시 본다. 관찰표와 교사 표본 정보를 대조하고 바뀐 이유나 아직 모르는 점을 남긴다.",
      "rubric": {
        "required": [
          "의견이 다른 특징",
          "공통 기준과 조건",
          "추가 관찰과 수정/미확인 기록"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  },
  {
    "id": "s41-u03-b67",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 활동의 영향을 조사할 자료를 고를 때 먼저 확인할 것을 고르세요.",
    "givens": null,
    "choices": [
      "자료의 출처·날짜·지역과 설명의 근거",
      "제목에 무서운 단어가 가장 많이 들어 있는지",
      "사진이 가장 크고 선명하게 보이는지만",
      "친구들이 모두 같은 그림을 골랐는지만",
      "글의 길이가 가장 짧아 외우기 쉬운지만"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "어느 지역·시점·조건을 설명하는 신뢰할 수 있는 자료인지 확인해야 해요. 제목이나 인기도만으로 근거를 대신하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b68",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산재가 농작물을 덮은 피해와 오랜 뒤 토양이 비옥해진 사례를 함께 읽었습니다. 타당한 정리는 무엇인가요?",
    "givens": null,
    "choices": [
      "영향이 나타난 시점과 조건을 나누어 적는다.",
      "같은 화산재이므로 두 자료는 모두 지워 버린다.",
      "비옥해진 사례가 있으니 당장의 피해는 없다고 쓴다.",
      "당장 피해가 있으니 오랜 뒤 이로움도 없다고 쓴다.",
      "자료를 하나만 골라 모든 지역의 결과로 단정한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "화산재의 피해와 장기간 뒤 일부 토양의 변화는 시점·조건이 달라요. 한 사례로 다른 영향을 지워 버리지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    }
  },
  {
    "id": "s41-u03-b69",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "지진 피해 표에는 규모만 있습니다. 피해 차이를 더 조사할 방법으로 가장 알맞은 것은?",
    "givens": null,
    "choices": [
      "같은 규모의 도시들은 피해도 같다고 가정한다.",
      "작은 모형의 결과를 실제 도시의 피해로 바꾼다.",
      "도시 하나의 사진으로 다른 지역 조건도 정한다.",
      "규모 순서를 다시 쓰고 다른 조건은 조사하지 않는다.",
      "거리·건물·대비 자료를 함께 확인한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "같은 규모라도 거리·지반·건물·대비 등 조건에 따라 피해가 달라질 수 있어요. 규모만으로 피해 순서를 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b70",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "기사 사진에 무너진 건물이 보입니다. 이 사진만으로 확정하기 어려운 것을 고르세요.",
    "givens": null,
    "choices": [
      "사진에 무너진 건물이 보인다는 사실",
      "사진 속에 사람이나 차량이 보이는지",
      "사진의 범위 안에 드러난 주변 모습",
      "그 지역에 생긴 모든 피해의 전체 규모",
      "사진에 포함된 건물의 보이는 형태"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "사진 한 장의 범위와 전체 지역의 피해 조사는 달라요. 출처·시점·조사 범위를 추가로 확인해야 해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b71",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산이 만든 지형을 관광에 이용한 사례가 있습니다. 보고서 결론으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "관광객이 있으므로 화산 주변에는 위험이 없다.",
      "관광에 쓰이면 모든 화산의 피해가 사라진다.",
      "이로운 사례는 화산 영향에 넣으면 안 된다.",
      "사진 한 장이면 모든 화산을 방문해도 안전하다.",
      "이로운 사례와 함께 위험·피해 자료도 살펴본다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "화산의 이로움과 피해를 함께 다루고 방문·대피 등 안전 판단은 공식 안내에 따라요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b72",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "영향 조사 기록에 포함할 근거 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "출처·확인 날짜와 자료가 다루는 지역",
      "자료에 없는 수치를 실제 측정값처럼 추가",
      "모형 피해를 실제 도시의 사건 통계로 작성",
      "피해와 이로운 사례가 나타난 조건·시점",
      "한 사진만으로 모든 지역이 같다고 확정"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "근거의 출처와 범위를 적어야 서로 다른 사례를 비교할 수 있어요. 가상 자료를 실제 통계로 바꾸지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        3
      ]
    }
  },
  {
    "id": "s41-u03-b73",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 주변의 뜨거운 땅속 열을 이용한 휴식 시설의 대표적인 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "온천 이용은 화산과 관련된 땅속 열의 이로운 사례예요. 그 사례만으로 모든 온천이나 화산 주변의 안전을 단정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "온천",
      "accepted": [
        "온천"
      ]
    }
  },
  {
    "id": "s41-u03-b74",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E5",
      "type": "T18",
      "standard": "4과11-04",
      "topic": "영향 자료 조사와 결론",
      "concept": "영향 자료 조사와 결론",
      "inquirySkill": "근거 평가",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산 또는 지진의 생활 영향을 조사하는 계획을 쓰세요. 자료 두 종류, 출처 확인 방법, 결론의 범위를 포함하세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "계획과 실제 조사 결과를 구별해요. 실제 피해 수치나 사건을 지어내지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "공공기관의 피해 사례와 화산의 이로운 이용 자료를 찾아 출처·날짜·지역을 적는다. 서로 다른 시점과 조건을 비교하고 조사한 사례 범위에서만 결론을 쓴다.",
      "rubric": {
        "required": [
          "자료 두 종류와 출처 확인",
          "지역·날짜·조건",
          "확인한 범위에 맞춘 결론"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  },
  {
    "id": "s41-u03-b75",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "안전 훈련 계획표와 실제 연습 기록을 구별할 수 있는 근거는 무엇인가요?",
    "givens": null,
    "choices": [
      "계획표의 제목에 안전이라는 말이 있는지",
      "문제은행에서 대처 문항을 맞혔는지",
      "훈련 모습을 상상하여 그림으로 그렸는지",
      "교재의 예시 답을 그대로 옮겨 썼는지",
      "한 날짜·장소·실제 행동과 확인한 점"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "실제로 한 시간·장소·행동과 확인한 점을 남겨야 실천 기록과 계획을 구별할 수 있어요. 문제 정답만으로 실천을 확정하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b76",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학교에서 지진으로 흔들릴 때 먼저 할 행동을 고르세요.",
    "givens": null,
    "choices": [
      "승강기를 새로 타고 빨리 아래층으로 간다.",
      "창문 옆으로 달려가 바깥 상황을 본다.",
      "흔들리는 동안 계단으로 뛰어 내려간다.",
      "책상 아래에서 몸을 보호하고 다리를 잡는다.",
      "떨어지는 물건을 가까이에서 모아 정리한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "흔들릴 때는 몸을 보호하고, 멈춘 뒤 학교 안내에 따라 질서를 지켜 대피해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    }
  },
  {
    "id": "s41-u03-b77",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "흔들림이 멈춘 뒤 학교 대피 계획에 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "승강기가 빠르므로 학생끼리 먼저 타고 간다.",
      "건물 벽에 바짝 붙어 반 친구를 기다린다.",
      "창문 아래에 서서 모두 모일 때까지 기다린다.",
      "가스레인지를 켜서 냄새가 나는지 확인한다.",
      "교사 안내에 따라 계단으로 지정된 곳에 간다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "승강기·창문·외벽의 위험을 피하고 학교의 지정 경로와 대피장소 안내를 따라요. 학생에게 설비 조작을 요구하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b78",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "화산재가 날리는 상황을 가정한 안전한 수업 활동은 무엇인가요?",
    "givens": null,
    "choices": [
      "실제 화산재 가루를 교실에 뿌려 훈련한다.",
      "연기를 피워 학생이 잘 피하는지 시험한다.",
      "카드로 실내 보호 행동을 연습하고 확인한다.",
      "지붕에 올라가 청소하는 속도를 경쟁한다.",
      "재난 안내를 끄고 학생끼리 위험 지역에 간다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "위험한 물질이나 상황을 만들어 훈련하지 않아요. 교사 확인 아래 카드·안내 자료와 안전한 역할 연습을 사용해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    }
  },
  {
    "id": "s41-u03-b79",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "연습에서 계단 입구에 모여 길이 막혔습니다. 개선 기록으로 알맞은 것을 고르세요.",
    "givens": null,
    "choices": [
      "계획이 완벽했다고 쓰고 실제 막힌 기록은 지운다.",
      "가장 빠른 학생만 보내고 나머지는 기록하지 않는다.",
      "다음에는 승강기를 타면 된다고 학생끼리 바꾼다.",
      "통로가 막힌 상태 그대로 속도 경쟁을 계속한다.",
      "문제 지점과 교사 확인을 남기고 다음 연습을 보완한다."
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "연습에서 확인한 문제를 교사와 검토하고 경로·순서·도움이 필요한 점을 보완해요. 속도 경쟁이나 임의 경로 변경을 하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    }
  },
  {
    "id": "s41-u03-b80",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실제 대처 연습 후 기록에 넣을 타당한 내용 두 가지를 고르세요.",
    "givens": null,
    "choices": [
      "연습하지 않은 행동도 모두 완료했다고 표시",
      "실제로 한 행동과 안전하게 확인한 점",
      "문항 정답률을 실제 대피 능력 점수로 확정",
      "자료 읽기를 실제 대피 훈련으로 바꾸어 기록",
      "어려웠던 지점과 교사와 정한 다음 보완"
    ],
    "visualModel": null,
    "variantRules": null,
    "explanation": "실제 수행·어려움·확인·보완을 구별해요. 가상 응답이나 자료 읽기만으로 실제 훈련이나 공식 성적을 만들지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        4
      ]
    }
  },
  {
    "id": "s41-u03-b81",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "대피할 때 새로 타면 안 되며 계단 대신 사용하지 않는 시설의 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "지진 때 대피하려고 승강기를 새로 타지 않아요. 이미 안에 있었다면 먼저 열리는 층에서 내린 뒤 계단을 이용하는 상황과 구별해요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "승강기",
      "accepted": [
        "승강기",
        "엘리베이터"
      ]
    }
  },
  {
    "id": "s41-u03-b82",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "땅의 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u03",
      "area": "지구와 우주",
      "element": "E6",
      "type": "T19",
      "standard": "4과11-04",
      "topic": "대처 실천의 기록과 개선",
      "concept": "대처 실천의 기록과 개선",
      "inquirySkill": "실천·결과 검토",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "교사가 확인한 안전한 연습을 계획하세요. 실제 행동을 기록할 칸과 의견을 받아 보완할 칸도 설계하세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "explanation": "실제로 연습하지 않았다면 미실천으로 남겨요. 문제를 풀었다고 실제 행동이나 친구와의 소통을 완료 처리하지 않아요.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과11-01~04·자체 이론411/422·실험4A/4D 확인 본문·공공 행동요령",
      "note": "독립 창작. 제시한 가상 자료·계획 응답을 실제 학생 수행·소통·실천이나 공식 성적으로 확정하지 않는다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "학교 지진 상황을 카드로 정하고 교사와 경로를 확인한다. 실제로 한 날짜·장소·몸 보호와 이동 행동을 적고, 어려웠던 지점을 듣고 경로나 순서를 보완한 뒤 다시 확인할 계획을 적는다.",
      "rubric": {
        "required": [
          "상황·교사 확인과 안전한 행동",
          "날짜·장소·실제 수행 기록",
          "의견·보완·재확인"
        ],
        "pass": "근거·조건·한계를 선생님과 함께 확인"
      }
    }
  }
]);
