// 4-1 Ⅱ. 물의 상태 변화 — 단원 파일(창작 문항). 5E 화면(개념 카드·정리표·확장·점검)이 쓰는 문항.
// 단원평가 원문·정답은 s41-u02.source.js에서 정적으로 읽는다.

export const unit = {
  id: 's41-u02', course: '4-1', no: 2, title: '물의 상태 변화', domain: '물질',
  sources: { bank: ['data/units/s41-u02.source.js'] },
};

const LEVEL = { 1: '기본', 2: '심화', 3: '영재' };
const T = (element, type, concept, level, track = '교과') =>
  ({ curriculum: '2022 개정', domain: '물질', area: '물질', course: '4-1', grade: 4, unit: 'u02', element, type, concept, level: LEVEL[level], track });
const base = (no, t, prompt, extra = {}) => ({
  id: `s41-u02-b${String(no).padStart(2, '0')}`, status: 'authored', sourceRef: { sourceId: 'authored', course: '4-1', unit: 'u02', originalNo: no },
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
  cloze(1, T('E1', 'T01', '물의 세 가지 상태', 1),
    '물은 고체인 ( ① ), 액체인 물, 기체인 ( ② ), 이렇게 세 가지 상태로 있어요.',
    [{ answer: '얼음', accepted: ['얼음'] }, { answer: '수증기', accepted: ['수증기'] }],
    '얼음은 모양이 일정하고, 물은 흐르며 담는 그릇에 따라 모양이 바뀌고, 수증기는 눈에 보이지 않아요.'),
  cloze(2, T('E2', 'T03', '얼 때 부피는 늘고 무게는 그대로', 1),
    '물이 얼어 얼음이 되면 부피는 ( ① ), 무게는 ( ② ).',
    [{ answer: '늘어나요', accepted: ['늘어나요', '늘어난다', '늘어남', '커진다', '커져요'] },
     { answer: '변하지 않아요', accepted: ['변하지 않아요', '변하지 않는다', '그대로', '그대로예요', '같다', '같아요'] }],
    '물의 양은 그대로라 무게는 같아요. 얼음이 되면서 차지하는 공간만 늘어나요.'),
  cloze(3, T('E3', 'T08', '증발과 끓음', 1),
    '물 표면에서 물이 수증기로 천천히 변하는 것을 ( ① ), 물 표면과 물속에서 물이 수증기로 빠르게 변하는 것을 ( ② )(이)라고 해요.',
    [{ answer: '증발', accepted: ['증발'] }, { answer: '끓음', accepted: ['끓음', '끓는 것'] }],
    '빨래가 마르는 것은 증발, 냄비 속 물에서 기포가 올라오는 것은 끓음이에요.'),
  cloze(4, T('E4', 'T09', '응결', 1),
    '공기 중의 ( ① )이/가 차가운 물체에 닿아 물로 변하는 것을 ( ② )(이)라고 해요.',
    [{ answer: '수증기', accepted: ['수증기'] }, { answer: '응결', accepted: ['응결'] }],
    '차가운 컵 바깥에 물방울이 맺히는 것, 풀잎의 이슬이 응결이에요.'),
  // ── ③ 정리표 ──
  { ...base(5, T('E1', 'T02', '생활 속 상태 변화 분류', 1), '생활 속 현상이 어떤 상태 변화인지 골라 표를 채워 보세요.'),
    responseContract: 'table-fill',
    answerContract: { type: 'table-fill', rowHead: '현상', columns: ['어떤 변화?'],
      options: { '어떤 변화?': ['얼기', '녹기', '증발', '끓음', '응결'] },
      rows: [
        { label: '젖은 빨래가 마른다', answer: ['증발'] },
        { label: '추운 날 수도관이 얼어 터진다', answer: ['얼기'] },
        { label: '냉동실에서 꺼낸 얼음이 녹는다', answer: ['녹기'] },
        { label: '라면을 끓이는 냄비에서 기포가 올라온다', answer: ['끓음'] },
        { label: '이른 아침 풀잎에 이슬이 맺힌다', answer: ['응결'] },
      ] },
    explanation: '고체→액체는 녹기, 액체→고체는 얼기, 액체→기체는 증발과 끓음, 기체→액체는 응결이에요.' },
  // ── ③ 잠깐 확인 ──
  choice(6, T('E2', 'T05', '얼 때 부피가 늘어 병이 깨진다', 1),
    '음료수를 가득 채운 유리병을 냉동실에 넣으면 안 되는 까닭은 무엇입니까?',
    ['음료수가 얼면 무게가 늘어나 병이 무거워지기 때문', '음료수가 얼면 부피가 늘어나 병이 깨질 수 있기 때문', '음료수가 얼면 부피가 줄어 병이 찌그러지기 때문', '유리병은 차가워지면 스스로 녹아내리기 때문', '음료수가 얼면 수증기가 되어 새어 나가기 때문'], 1,
    '물이 얼면 무게는 그대로지만 부피가 늘어나요. 가득 찬 병은 늘어난 부피를 견디지 못해 깨질 수 있어요.'),
  // ── ④ 확장(영재성) ──
  choice(7, T('E2', 'T03', '같은 부피일 때 얼음이 물보다 가볍다', 3, '영재성'),
    '얼음 조각을 물에 넣으면 가라앉지 않고 떠요. 물이 얼 때의 변화로 이 까닭을 가장 잘 설명한 것은 어느 것입니까?',
    ['얼음은 물보다 온도가 낮아서 차가운 쪽이 위로 올라가기 때문', '얼음 속에 수증기가 가득 들어 있어서 풍선처럼 떠오르기 때문', '얼음은 물과 전혀 다른 물질이라 물과 서로 섞이지 않기 때문', '부피가 늘어서 같은 크기로 비교하면 얼음이 물보다 가볍기 때문', '얼음은 모양이 일정해서 물 위에 판처럼 걸쳐 있을 수 있기 때문'], 3,
    '무게가 같은데 부피가 커졌으니, 같은 부피끼리 비교하면 얼음이 물보다 가벼워요. 그래서 얼음이 물 위에 떠요.'),
  written(8, T('E4', 'T12', '응결을 이용해 물 모으기', 3, '영재성'),
    '비가 거의 오지 않지만 밤에는 공기가 차가워지는 사막 마을이 있어요. 전기를 쓰지 않고 공기에서 물을 모으는 장치를 떠올려, 어떤 상태 변화를 이용하는지와 장치의 모습을 쓰세요.',
    ['응결(수증기가 차가운 곳에 닿아 물이 됨)을 이용한다', '물방울이 맺히는 차가운 면과 물을 모으는 통이 있다'],
    '밤에 차가워지는 넓은 그물이나 금속판을 세워 두면 공기 중의 수증기가 응결해 물방울이 맺히고, 그 물이 아래 통으로 흘러 모이게 한다.',
    '와카워터처럼 차가운 면에 수증기가 응결하면 물방울이 생겨요. 물방울이 흘러내려 모일 길과 통을 함께 설계하면 좋아요.',
    { bonus: '물이 다시 증발하지 않도록 통에 뚜껑을 덮는 아이디어' }),
  written(9, T('E3', 'T06', '증발이 빠른 조건 찾기 실험 설계', 3, '영재성'),
    '젖은 수건이 빨리 마르는 조건을 알아보려고 해요. 바람의 세기가 증발에 주는 영향을 알아보는 실험에서 바꿀 조건과 같게 할 조건을 쓰세요.',
    ['바꿀 조건: 바람의 세기(선풍기를 켬/끔)', '같게 할 조건: 수건의 크기·젖은 정도·온도·놓는 곳 등 두 가지 이상'],
    '바꿀 조건은 바람의 세기이고, 수건의 크기와 물에 적신 정도, 방의 온도, 걸어 두는 시간은 같게 한다.',
    '알아보려는 조건 하나만 바꾸고 나머지는 모두 같게 해야 결과의 차이가 바람 때문인지 알 수 있어요.'),
  // ── ⑤ 점검 ──
  choice(10, T('E2', 'T03', '얼 때 무게는 그대로', 1),
    '물 100 g이 든 병을 얼렸습니다. 다 얼었을 때 병 속 얼음의 무게는 어떻게 됩니까?',
    ['100 g 그대로이다', '110 g으로 늘어난다', '90 g으로 줄어든다', '0 g이 된다', '얼릴 때마다 달라진다'], 0,
    '물이 얼어도 물의 양은 그대로라서 무게는 변하지 않아요. 부피만 늘어나요.'),
  choice(11, T('E3', 'T08', '증발과 끓음의 차이', 1),
    '증발과 끓음을 비교한 설명으로 알맞은 것은 어느 것입니까?',
    ['증발은 물 표면이 아닌 물속에서만 일어난다', '끓음은 물 표면에서만 아주 천천히 일어난다', '증발할 때가 끓을 때보다 물이 빠르게 줄어든다', '증발은 액체인 물이 고체인 얼음으로 변하는 것이다', '끓음은 물 표면과 물속에서 빠르게 일어난다'], 4,
    '증발은 물 표면에서 천천히, 끓음은 물 표면과 물속에서 빠르게 물이 수증기로 변해요.'),
  choice(12, T('E4', 'T10', '생활 속 응결', 1),
    '다음 중 응결과 관련된 현상은 어느 것입니까?',
    ['햇볕에 널어 둔 빨간 고추가 바싹 마른다', '냄비의 물이 끓어 물의 양이 점점 줄어든다', '추운 날 방에 들어가면 안경이 흐려진다', '냉동실에 넣어 둔 물이 단단한 얼음이 된다', '더운 날 얼음과자가 녹아 막대로 흘러내린다'], 2,
    '차가운 안경알에 따뜻한 방의 수증기가 닿아 작은 물방울로 변해 뿌옇게 흐려져요.'),
  // ── 소단원 5 물의 이용과 물 부족(빈 곳 보충) ──
  choice(13, T('E5', 'T11', '물 부족과 아껴 쓰기', 1),
    '물을 아껴 쓰는 방법으로 알맞은 것은 어느 것입니까?',
    ['양치할 때 수도꼭지를 계속 틀어 둔다', '샤워 시간을 줄이고 물을 받아서 쓴다', '빨래는 한 벌씩 자주 돌린다', '설거지할 때 물을 계속 흘려보낸다', '화분에 물을 하루에 여러 번 듬뿍 준다'], 1,
    '지구의 물 중 우리가 바로 쓸 수 있는 민물은 아주 적어요. 물을 받아서 쓰고, 쓰는 시간을 줄이면 아낄 수 있어요.'),
  choice(14, T('E5', 'T12', '물 부족 해결 장치와 상태 변화', 2),
    '비가 적은 곳에 세운 그물 탑은 밤에 공기 중의 수증기가 차가운 그물에 닿아 물방울로 맺히게 해 물을 모아요. 이 장치가 이용한 물의 상태 변화는 어느 것입니까?',
    ['얼음이 녹아 물이 되는 융해', '물이 얼어 얼음이 되는 응고', '물이 수증기가 되는 증발', '수증기가 물이 되는 응결', '물이 끓어 수증기가 되는 끓음'], 3,
    '기체인 수증기가 차가운 곳에 닿아 액체인 물이 되는 것이 응결이에요. 차가운 컵 겉면에 물방울이 맺히는 것과 같은 원리예요.'),
];

// ── 2026-10-18 현행 보충 검수 ──
for(const patch of [
  {
    "id": "s41-u02-b01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 1,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E1",
      "type": "T01",
      "concept": "물의 세 가지 상태",
      "level": "기본",
      "track": "교과",
      "format": "빈칸형",
      "topic": "물의 세 가지 상태",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "물은 고체인 ( ① ), 액체인 물, 기체인 ( ② ), 이렇게 세 가지 상태로 있어요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "얼음",
          "accepted": [
            "얼음"
          ]
        },
        {
          "answer": "수증기",
          "accepted": [
            "수증기"
          ]
        }
      ]
    },
    "explanation": "얼음은 모양이 일정하고, 물은 흐르며 담는 그릇에 따라 모양이 바뀌고, 수증기는 눈에 보이지 않아요."
  },
  {
    "id": "s41-u02-b02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 2,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E2",
      "type": "T03",
      "concept": "얼 때 부피는 늘고 무게는 그대로",
      "level": "기본",
      "track": "교과",
      "format": "빈칸형",
      "topic": "얼 때 부피는 늘고 무게는 그대로",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "물의 출입이 없는 같은 용기에서 물이 얼면 부피는 ( ① ), 무게는 ( ② ).",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "늘어나요",
          "accepted": [
            "늘어나요",
            "늘어난다",
            "늘어남",
            "커진다",
            "커져요"
          ]
        },
        {
          "answer": "변하지 않아요",
          "accepted": [
            "변하지 않아요",
            "변하지 않는다",
            "그대로",
            "그대로예요",
            "같다",
            "같아요"
          ]
        }
      ]
    },
    "explanation": "물의 출입 없이 같은 물과 용기를 비교하면 무게는 같고 얼면서 차지하는 부피가 늘어난다. 겉 물기·다른 용기·쏟은 물이 무게 비교에 섞이지 않게 한다."
  },
  {
    "id": "s41-u02-b03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 3,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E3",
      "type": "T08",
      "concept": "증발과 끓음",
      "level": "기본",
      "track": "교과",
      "format": "빈칸형",
      "topic": "증발과 끓음",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "물 표면에서 물이 수증기로 천천히 변하는 것을 ( ① ), 물 표면과 물속에서 물이 수증기로 빠르게 변하는 것을 ( ② )(이)라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "증발",
          "accepted": [
            "증발"
          ]
        },
        {
          "answer": "끓음",
          "accepted": [
            "끓음",
            "끓는 것"
          ]
        }
      ]
    },
    "explanation": "증발과 끓음은 모두 물이 수증기가 되는 변화이다. 증발은 표면에서, 충분히 끓는 동안에는 물속과 표면에서 변화한다. 가열 초기의 작은 기포 하나만으로 충분히 끓는다고 판단하지 않는다."
  },
  {
    "id": "s41-u02-b04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 4,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E4",
      "type": "T09",
      "concept": "응결",
      "level": "기본",
      "track": "교과",
      "format": "빈칸형",
      "topic": "응결",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "공기 중의 ( ① )이/가 차가운 물체에 닿아 물로 변하는 것을 ( ② )(이)라고 해요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "수증기",
          "accepted": [
            "수증기"
          ]
        },
        {
          "answer": "응결",
          "accepted": [
            "응결"
          ]
        }
      ]
    },
    "explanation": "차가운 컵 바깥에 물방울이 맺히는 것, 풀잎의 이슬이 응결이에요."
  },
  {
    "id": "s41-u02-b05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 5,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E1",
      "type": "T02",
      "concept": "생활 속 상태 변화 분류",
      "level": "기본",
      "track": "교과",
      "format": "표완성형",
      "topic": "생활 속 상태 변화 분류",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "생활 속 현상이 어떤 상태 변화인지 골라 표를 채워 보세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "rowHead": "현상",
      "columns": [
        "어떤 변화?"
      ],
      "options": {
        "어떤 변화?": [
          "얼기",
          "녹기",
          "증발",
          "끓음",
          "응결"
        ]
      },
      "rows": [
        {
          "label": "젖은 빨래가 마른다",
          "answer": [
            "증발"
          ]
        },
        {
          "label": "추운 날 수도관이 얼어 터진다",
          "answer": [
            "얼기"
          ]
        },
        {
          "label": "냉동실에서 꺼낸 얼음이 녹는다",
          "answer": [
            "녹기"
          ]
        },
        {
          "label": "물이 충분히 끓는 냄비에서 기포가 계속 올라온다",
          "answer": [
            "끓음"
          ]
        },
        {
          "label": "이른 아침 풀잎에 이슬이 맺힌다",
          "answer": [
            "응결"
          ]
        }
      ]
    },
    "explanation": "고체→액체는 녹기, 액체→고체는 얼기, 액체→기체는 증발과 끓음, 기체→액체는 응결이에요."
  },
  {
    "id": "s41-u02-b06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 6,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E2",
      "type": "T05",
      "concept": "얼 때 부피가 늘어 병이 깨진다",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "topic": "얼 때 부피가 늘어 병이 깨진다",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "음료수를 가득 채운 유리병을 냉동실에 넣으면 안 되는 까닭은 무엇입니까?",
    "givens": null,
    "choices": [
      "음료수가 얼면 무게가 늘어나 병이 무거워지기 때문",
      "음료수가 얼면 부피가 늘어나 병이 깨질 수 있기 때문",
      "음료수가 얼면 부피가 줄어 병이 찌그러지기 때문",
      "유리병은 차가워지면 스스로 녹아내리기 때문",
      "음료수가 얼면 수증기가 되어 새어 나가기 때문"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "물이 얼면 무게는 그대로지만 부피가 늘어나요. 가득 찬 병은 늘어난 부피를 견디지 못해 깨질 수 있어요."
  },
  {
    "id": "s41-u02-b07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 7,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E2",
      "type": "T03",
      "concept": "같은 부피일 때 얼음이 물보다 가볍다",
      "level": "영재",
      "track": "영재성",
      "format": "선택형",
      "topic": "같은 부피일 때 얼음이 물보다 가볍다",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "얼음 조각을 물에 넣으면 가라앉지 않고 떠요. 물이 얼 때의 변화로 이 까닭을 가장 잘 설명한 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "얼음은 물보다 온도가 낮아서 차가운 쪽이 위로 올라가기 때문",
      "얼음 속에 수증기가 가득 들어 있어서 풍선처럼 떠오르기 때문",
      "얼음은 물과 전혀 다른 물질이라 물과 서로 섞이지 않기 때문",
      "부피가 늘어서 같은 크기로 비교하면 얼음이 물보다 가볍기 때문",
      "얼음은 모양이 일정해서 물 위에 판처럼 걸쳐 있을 수 있기 때문"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "무게가 같은데 부피가 커졌으니, 같은 부피끼리 비교하면 얼음이 물보다 가벼워요. 그래서 얼음이 물 위에 떠요."
  },
  {
    "id": "s41-u02-b08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 8,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E5",
      "type": "T12",
      "concept": "응결을 이용해 물 모으기",
      "level": "영재",
      "track": "영재성",
      "format": "서술형",
      "topic": "응결을 이용해 물 모으기",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "밤에 차가워지는 판에 수증기가 응결하여 물방울이 맺히는 조건을 이용하려 합니다. 물방울이 모이는 길과 통이 있는 장치를 설계하고, 실제로 물을 얻는지 확인할 점을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "밤에 차가워지는 판을 비스듬히 고정하고 아래에 통을 둔다. 수증기가 판에서 응결해 생긴 물방울이 통으로 흐르도록 한다. 판에 실제 물방울이 생기고 통에 모이는지 날짜·조건·시간과 함께 기록한다.",
      "rubric": {
        "required": [
          "수증기→물의 응결을 이용하는 면과 모으는 길·통의 연결",
          "실제 물방울과 수집 여부를 시험할 조건"
        ],
        "pass": "선생님과 설계·조건·근거를 확인한다.",
        "bonus": "물이 다시 증발하지 않도록 통에 뚜껑을 덮는 아이디어"
      }
    },
    "explanation": "보이지 않는 수증기가 차가운 판에서 물방울이 되는 응결을 이용하는 설계이다. 이미 액체인 안개 물방울을 그물로 붙잡는 과정과 구별한다. 주변 수증기·판의 차가운 정도에 따라 결과가 다르므로 실제 시험이 필요하다."
  },
  {
    "id": "s41-u02-b09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 9,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E3",
      "type": "T06",
      "concept": "증발이 빠른 조건 찾기 실험 설계",
      "level": "영재",
      "track": "영재성",
      "format": "서술형",
      "topic": "증발이 빠른 조건 찾기 실험 설계",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "젖은 수건이 빨리 마르는 조건을 알아보려고 해요. 바람의 세기가 증발에 주는 영향을 알아보는 실험에서 바꿀 조건과 같게 할 조건을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "바꿀 조건은 바람의 세기이고, 수건의 크기와 물에 적신 정도, 방의 온도, 걸어 두는 시간은 같게 한다.",
      "rubric": {
        "required": [
          "바꿀 조건: 바람의 세기(선풍기를 켬/끔)",
          "같게 할 조건: 수건의 크기·젖은 정도·온도·놓는 곳 등 두 가지 이상"
        ],
        "pass": "선생님과 바꿀 조건·같게 할 조건을 확인한다."
      }
    },
    "explanation": "알아보려는 조건 하나만 바꾸고 나머지는 모두 같게 해야 결과의 차이가 바람 때문인지 알 수 있어요."
  },
  {
    "id": "s41-u02-b10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 10,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E2",
      "type": "T03",
      "concept": "얼 때 무게는 그대로",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "topic": "얼 때 무게는 그대로",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "물 100g이 든 병을 닫아 물이 새거나 드나들지 않게 얼렸습니다. 병 속 물이 모두 얼었을 때 얼음만의 무게는 얼마인가요?",
    "givens": null,
    "choices": [
      "100 g 그대로이다",
      "110 g으로 늘어난다",
      "90 g으로 줄어든다",
      "0 g이 된다",
      "얼릴 때마다 달라진다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "물의 출입이 없다면 같은 물 100g이 얼어도 얼음 무게는 100g이다. 병까지 잰 전체 무게와 얼음만의 무게를 구별한다."
  },
  {
    "id": "s41-u02-b11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 11,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E3",
      "type": "T08",
      "concept": "증발과 끓음의 차이",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "topic": "증발과 끓음의 차이",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "증발과 끓음을 비교한 설명으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "증발은 물 표면이 아닌 물속에서만 일어난다",
      "끓음은 물 표면에서만 아주 천천히 일어난다",
      "증발할 때가 끓을 때보다 물이 빠르게 줄어든다",
      "증발은 액체인 물이 고체인 얼음으로 변하는 것이다",
      "끓음은 물 표면과 물속에서 빠르게 일어난다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "증발과 끓음 모두 물이 수증기로 변한다. 증발은 물 표면에서, 충분히 끓을 때는 물속과 표면에서 변화가 일어난다. 무조건 빠르기만으로 현상을 구별하지 않는다."
  },
  {
    "id": "s41-u02-b12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 12,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E4",
      "type": "T10",
      "concept": "생활 속 응결",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "topic": "생활 속 응결",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "다음 중 응결과 관련된 현상은 어느 것입니까?",
    "givens": null,
    "choices": [
      "햇볕에 널어 둔 빨간 고추가 바싹 마른다",
      "냄비의 물이 끓어 물의 양이 점점 줄어든다",
      "추운 날 방에 들어가면 안경이 흐려진다",
      "냉동실에 넣어 둔 물이 단단한 얼음이 된다",
      "더운 날 얼음과자가 녹아 막대로 흘러내린다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "차가운 안경알에 따뜻한 방의 수증기가 닿아 작은 물방울로 변해 뿌옇게 흐려져요."
  },
  {
    "id": "s41-u02-b13",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 13,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E5",
      "type": "T11",
      "concept": "물 부족과 아껴 쓰기",
      "level": "기본",
      "track": "교과",
      "format": "선택형",
      "topic": "물 부족과 아껴 쓰기",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "물을 아껴 쓰는 방법으로 알맞은 것은 어느 것입니까?",
    "givens": null,
    "choices": [
      "양치할 때 수도꼭지를 계속 틀어 둔다",
      "샤워 시간을 줄이고 물을 받아서 쓴다",
      "빨래는 한 벌씩 자주 돌린다",
      "설거지할 때 물을 계속 흘려보낸다",
      "화분에 물을 하루에 여러 번 듬뿍 준다"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "지구의 물 중 우리가 바로 쓸 수 있는 민물은 아주 적어요. 물을 받아서 쓰고, 쓰는 시간을 줄이면 아낄 수 있어요."
  },
  {
    "id": "s41-u02-b14",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u02",
      "originalNo": 14,
      "type": "authored-practice"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "domain": "물질",
      "area": "물질",
      "course": "4-1",
      "grade": 4,
      "unit": "u02",
      "element": "E5",
      "type": "T12",
      "concept": "물 부족 해결 장치와 상태 변화",
      "level": "심화",
      "track": "교과",
      "format": "선택형",
      "topic": "물 부족 해결 장치와 상태 변화",
      "inquirySkill": "관찰·상태 변화·비교 조건에 근거해 설명하기"
    },
    "prompt": "덮개가 있는 그릇 속에서 물이 수증기로 변했습니다. 그 수증기가 차가운 덮개에 닿아 물방울이 되었고 아래 빈 컵에 모였습니다. 덮개에서 물방울이 생기는 상태 변화는 무엇인가요?",
    "givens": null,
    "choices": [
      "얼음이 녹아 물이 되는 융해",
      "물이 얼어 얼음이 되는 응고",
      "물이 수증기가 되는 증발",
      "수증기가 물이 되는 응결",
      "물이 끓어 수증기가 되는 끓음"
    ],
    "visualModel": null,
    "variantRules": null,
    "evidence": {
      "checkedBy": "수업 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "note": "기존 ID·응답 형식 보존. 실제 수행·공식 성적 검증이 아니다."
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "덮개에서 기체인 수증기가 액체 물방울이 되는 변화는 응결이다. 앞서 그릇의 물이 수증기로 된 단계와 구별한다."
  }
]){const item=items.find(q=>q.id===patch.id);if(!item)throw Error(patch.id);Object.assign(item,patch);}
items.push(...[
  {
    "id": "s41-u02-b15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "고체에서 액체로 변했다",
      "액체에서 고체로 변했다",
      "고체에서 기체로 변했다",
      "기체에서 액체로 변했다",
      "액체에서 기체로 변했다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "냉동실에서 꺼낸 얼음이 접시에서 녹았습니다. 상태의 순서가 맞는 것은?",
    "explanation": "처음의 얼음은 고체이고 녹은 물은 액체이다. 녹기는 고체인 물이 액체인 물이 되는 변화이다.",
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
    "id": "s41-u02-b16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "물이 수증기로 변해 공기 중으로 갔다",
      "물이 얼음으로 변해 바닥에 남았다",
      "물이 스스로 없어져 물질이 사라졌다",
      "바닥의 공기가 액체인 물로 바뀌었다",
      "물방울이 줄면서 물의 종류가 바뀌었다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "마른 바닥에 놓은 물 한 방울이 줄었습니다. 쏟거나 닦지 않았다면 어떤 설명을 먼저 살펴볼까요?",
    "explanation": "주어진 조건에서는 물이 수증기가 되는 증발을 살펴본다. 보이지 않게 됐다는 관찰만으로 물질이 없어졌다고 결론 내리지 않는다.",
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
    "id": "s41-u02-b17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "수증기가 응결한 작은 물방울",
      "공중에 떠 있는 큰 얼음 덩어리",
      "눈에 보이는 기체 상태의 물",
      "공중에서 불에 타고 있는 물",
      "주전자에서 나온 소금 가루"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "물을 끓이는 교사 시범을 멀리서 보니 주전자 위에 흰 김이 보입니다. 흰 김은 무엇인가요?",
    "explanation": "기체인 수증기는 눈에 보이지 않는다. 흰 김은 수증기가 응결해 생긴 작은 액체 물방울이다.",
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
    "id": "s41-u02-b18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "컵을 기울여도 모양이 늘 똑같다",
      "흐르며 담긴 부분의 모양이 달라진다",
      "기울이는 순간 물이 기체로 변한다",
      "컵에 닿은 물이 모두 고체로 변한다",
      "모양이 바뀌면 물의 종류도 바뀐다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "같은 물을 담은 투명한 컵을 기울였습니다. 액체인 물의 성질로 관찰할 수 있는 것은?",
    "explanation": "액체인 물은 흐르고 그릇에 따라 모양이 달라진다. 기울였다는 사실만으로 상태 변화나 다른 물질로의 변화를 말하지 않는다.",
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
    "id": "s41-u02-b19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "처음부터 끝까지 고체의 모양만 달라진다",
      "얼음→수증기의 한 변화만 관찰한 셈이다",
      "물이 마르면 얼음이 다시 생긴 것으로 본다",
      "물과 수증기는 서로 다른 물질이라고 본다",
      "얼음→물→수증기의 두 변화를 구별한다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "창문에 있던 얼음이 녹고 그 물이 마르는 상황에서 빠뜨리지 않은 설명은?",
    "explanation": "녹아서 물이 된 뒤 증발해 수증기가 되는 두 단계를 구별한다. 이 사례를 얼음에서 곧바로 수증기가 된 것으로 바꾸지 않는다.",
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
    "id": "s41-u02-b20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "젖은 바닥이 마르면 물질이 없어진다",
      "얼음은 고체인 물이다",
      "수증기는 기체인 물이다",
      "흰 김은 눈에 보이는 수증기다",
      "녹은 물은 얼음과 다른 물질이다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "상태와 관찰을 바르게 연결한 두 가지를 고르세요.",
    "explanation": "얼음과 수증기는 각각 고체·기체인 물이다. 김은 작은 물방울이며 상태 변화로 물의 종류가 달라지지 않는다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    }
  },
  {
    "id": "s41-u02-b21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "공기 중에 있어 눈에 보이지 않는 기체 상태의 물을 무엇이라고 하나요?",
    "explanation": "기체 상태의 물은 수증기이다. 흰 김과 구별한다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "수증기",
      "accepted": [
        "수증기"
      ]
    }
  },
  {
    "id": "s41-u02-b22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E1",
      "type": "T13",
      "standard": "4과10-01",
      "topic": "세 상태와 관찰·추론",
      "concept": "세 상태와 관찰·추론",
      "inquirySkill": "관찰·추론 구별",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "자료: 얼음이 녹아 물이 되었고, 시간이 지나 그 물이 말랐습니다. 관찰된 두 변화와 보이지 않게 된 물의 행방을 설명하세요.",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "얼음이 녹아 액체인 물이 되었고, 그 물이 증발해 기체인 수증기가 되어 공기 중으로 갔다. 없어진 것이 아니라 상태가 바뀐 것이다.",
      "rubric": {
        "required": [
          "녹기·증발의 방향과 물의 행방을 자료에 연결한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u02-b23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "얼린 병에 묻은 물방울도 함께 잰다",
      "얼리기 전에 물을 조금 더 넣는다",
      "얼린 뒤 병뚜껑을 빼고 무게를 잰다",
      "겉 물기를 닦고 같은 저울로 잰다",
      "처음 병과 다른 병으로 바꾸어 잰다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "물을 반쯤 담은 같은 병을 닫아 얼리기 전후의 무게를 비교합니다. 비교를 위해 먼저 할 일은?",
    "explanation": "물과 병을 같은 범위로 비교해야 한다. 바깥 물방울이나 용기 변경은 물이 얼면서 무게가 달라진 것처럼 보이게 할 수 있다.",
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
    "id": "s41-u02-b24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "같은 곧은 용기의 얼기 전후 높이",
      "좁은 병의 물과 넓은 접시의 얼음 높이",
      "물의 색과 얼음의 투명한 정도",
      "빈 용기의 무게와 얼음의 높이",
      "물이 든 병의 너비와 얼음의 색"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "물기둥의 높이로 얼 때의 부피 변화를 보려 합니다. 가장 알맞은 비교는?",
    "explanation": "같은 곧은 용기에 표시한 높이 변화를 비교한다. 용기 모양을 바꾸면 높이 차이를 부피 변화 때문이라고 해석하기 어렵다.",
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
    "id": "s41-u02-b25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "얼음만의 무게는 반드시 180g이다",
      "어떤 열린 그릇도 무게가 늘 같다",
      "물의 부피도 처음과 반드시 같다",
      "병 밖 물방울은 무게가 전혀 없다",
      "이 조건의 병 전체 무게는 같았다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 새거나 흘린 물이 없는 닫힌 병 전체가 얼기 전 180g, 얼고 난 뒤 180g입니다. 이 기록이 뒷받침하는 것은?",
    "explanation": "180g은 병을 포함한 전체 값이다. 같은 전체의 무게가 같다는 결론은 가능하지만 얼음만의 값이나 부피는 이 자료만으로 알 수 없다.",
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
    "id": "s41-u02-b26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "녹으며 부피가 줄고 전체 무게는 같았다",
      "녹으며 물이 새어 전체 무게가 줄었다",
      "녹으며 부피와 전체 무게가 함께 늘었다",
      "높이가 낮으니 물질이 사라진 것이다",
      "무게가 같으니 높이 기록은 틀린 것이다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 밀폐된 곧은 용기에서 얼음이 다 녹자 높이가 낮아졌고 전체 무게는 같았습니다. 알맞은 해석은?",
    "explanation": "닫힌 같은 용기에서 물의 출입 없이 녹은 조건이다. 높이 감소는 부피 감소와 연결되고, 같은 무게와 모순되지 않는다.",
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
    "id": "s41-u02-b27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "유리병에 물을 가득 채워 단단히 닫아 둔다",
      "얼음이 든 병을 세게 두드려 빨리 꺼낸다",
      "얼음이 얼도록 병을 불꽃 바로 위에 둔다",
      "저울 위에 쏟은 물은 그대로 두고 작동한다",
      "플라스틱 용기에 여유 공간을 둔다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "얼리는 활동을 준비하는 모둠에 필요한 안내는?",
    "explanation": "물은 얼면서 부피가 늘어난다. 교사의 안내로 적절한 플라스틱 용기에 여유 공간을 두고, 유리 파손·미끄러짐·전기 기구의 물기를 피한다.",
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
    "id": "s41-u02-b28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "병뚜껑을 빼고 다시 잰다",
      "얼린 용기를 더 큰 것으로 바꾼다",
      "같은 저울을 사용한다",
      "용기 겉의 물기를 닦는다",
      "얼린 뒤 물을 더 붓는다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "물의 출입이 없는 같은 용기의 얼기 전후를 비교할 때 지킬 두 가지는?",
    "explanation": "같은 물·용기·저울과 마른 겉면을 유지한다. 물이나 용기의 출입이 있으면 상태만 바꾼 비교가 아니다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    }
  },
  {
    "id": "s41-u02-b29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "같은 곧은 용기에 물 높이를 표시했습니다. 물이 완전히 얼면 높이는 보통 높아지나요, 낮아지나요?",
    "explanation": "물은 얼 때 부피가 커지므로 같은 곧은 용기의 높이는 높아진다. 용기가 달라진 높이 비교와 구별한다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "높아진다",
      "accepted": [
        "높아진다",
        "높아져요",
        "높아짐",
        "올라간다",
        "높아진다."
      ]
    }
  },
  {
    "id": "s41-u02-b30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E2",
      "type": "T14",
      "standard": "4과10-02",
      "topic": "얼기·녹기의 공정한 측정",
      "concept": "얼기·녹기의 공정한 측정",
      "inquirySkill": "공정한 측정·자료 해석",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 같은 병 전체가 물일 때 162g, 얼음일 때 168g이었습니다. 얼음 병 겉에 물방울이 많았다고 합니다. 바로 무게 증가 법칙으로 결론 내릴 수 있을까요? 확인 방법과 함께 쓰세요.",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "바로 결론 내리지 않는다. 병 겉에 붙은 물방울 무게가 더해졌을 수 있다. 겉을 닦고 물이나 병·뚜껑의 출입이 없는지 확인한 뒤 같은 저울로 다시 비교한다.",
      "rubric": {
        "required": [
          "물의 출입·겉 물기·같은 측정 범위를 점검하고 자료가 지지하는 결론을 구별한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u02-b31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "물 표면에서만 변화가 일어난다",
      "반드시 불꽃으로 물을 가열해야 한다",
      "물이 고체가 되어 그릇에 남는다",
      "액체인 물이 기체인 수증기로 변한다",
      "기포가 없는 곳에서는 변화가 없다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "젖은 천이 마르는 것과 냄비의 물이 충분히 끓는 것의 공통점은?",
    "explanation": "증발과 끓음은 모두 물이 수증기로 변하는 현상이다. 일어나는 곳이나 가열 조건의 차이보다 이 공통 상태 변화를 먼저 확인한다.",
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
    "id": "s41-u02-b32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "끓이지 않아도 물이 증발할 수 있다",
      "가열하지 않았으니 증발은 아니다",
      "보이지 않게 된 물은 모두 얼었다",
      "접시가 물을 전부 다른 물질로 바꿨다",
      "물이 낮아졌으니 접시 부피가 줄었다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "새거나 흘리지 않은 얕은 접시의 물 높이가 하루 뒤 낮아졌습니다. 가열하지 않았습니다. 알맞은 설명은?",
    "explanation": "일상적인 온도에서도 물 표면에서 증발이 일어날 수 있다. 끓여야만 수증기가 된다고 생각하지 않는다.",
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
    "id": "s41-u02-b33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "물이 사라졌다는 결론만 적은 한 문장",
      "친구가 쓴 숫자를 그대로 옮긴 최종 값",
      "처음·나중 높이와 시간·놓은 조건",
      "기대한 결과와 같도록 바꾼 나중 높이",
      "그릇 이름만 적고 높이와 시간은 생략"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "증발 관찰 기록을 남기려 합니다. 날짜와 함께 기록할 내용으로 적절한 것은?",
    "explanation": "증발을 판단하려면 변화와 경과 조건을 비교할 수 있어야 한다. 실제로 보지 못한 수치나 결론만으로 관찰을 대신하지 않는다.",
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
    "id": "s41-u02-b34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "물속의 물이 고체로 변하고 있다",
      "물속과 표면에서 수증기로 변한다",
      "모든 기포는 밖에서 들어온 공기다",
      "흰 김만이 기체인 물에 해당한다",
      "물 표면에서는 변화가 일어나지 않는다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "교사 시범에서 물이 충분히 끓는 동안 바닥에서 큰 기포가 계속 올라옵니다. 이때의 변화를 가장 잘 설명한 것은?",
    "explanation": "충분히 끓는 조건에서 물속과 표면의 물이 수증기로 변한다. 가열 초기의 작은 기포 하나만으로 충분히 끓는다고 판정하지 않는다.",
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
    "id": "s41-u02-b35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "안내된 거리에서 보고 만지지 않는다",
      "기포를 가까이 보려고 얼굴을 들이민다",
      "뜨거운 용기를 맨손으로 들어 비교한다",
      "수증기 나오는 입구를 손으로 막는다",
      "가열 중인 물에 차가운 유리병을 넣는다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "끓는 물을 관찰하는 수업에서 학생이 할 행동은?",
    "explanation": "가열은 교사가 담당하고 학생은 안전거리를 지켜 관찰한다. 뜨거운 용기·김·수증기에 손이나 얼굴을 가까이 대지 않는다. 사고나 불편이 생기면 바로 교사에게 알린다.",
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
    "id": "s41-u02-b36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "끓음은 물이 얼음이 되는 현상이다",
      "증발은 물속에서만 일어난다",
      "수증기는 흰색으로 또렷하게 보인다",
      "두 현상 모두 물이 수증기로 변한다",
      "증발은 물을 끓이지 않아도 일어난다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "증발과 끓음에 대한 바른 설명 두 가지는?",
    "explanation": "두 현상은 액체에서 기체로 바뀌는 공통점이 있다. 증발에는 반드시 끓이는 과정이 필요하지 않다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    }
  },
  {
    "id": "s41-u02-b37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "끓이지 않은 물도 표면에서 수증기로 변합니다. 이 현상의 이름은?",
    "explanation": "액체인 물이 표면에서 수증기로 변하는 현상을 증발이라고 한다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "증발",
      "accepted": [
        "증발"
      ]
    }
  },
  {
    "id": "s41-u02-b38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E3",
      "type": "T15",
      "standard": "4과10-02",
      "topic": "증발·끓음의 공통점과 관찰",
      "concept": "증발·끓음의 공통점과 관찰",
      "inquirySkill": "변화 비교·안전 관찰",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 젖은 천이 마르고, 다른 장면에서는 교사가 물을 끓였습니다. 두 장면의 공통 상태 변화와 관찰할 차이를 설명하세요.",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "두 장면 모두 액체인 물이 기체인 수증기로 변한다. 천에서는 표면의 물이 증발하고, 충분히 끓는 물에서는 물속 기포와 표면에서 변화가 관찰된다. 천을 끓였다고 말하지 않는다.",
      "rubric": {
        "required": [
          "공통 상태 변화를 먼저 말하고 관찰 가능한 차이를 설명한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u02-b39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "컵 속 물이 컵 벽을 통과해 나왔다",
      "컵 자체가 녹아 액체인 물로 변했다",
      "공기 중 수증기가 컵 겉에서 물로 변했다",
      "바깥 공기가 얼어 단단한 얼음이 됐다",
      "컵 속 색소가 수증기로 빠져나왔다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "구멍 없는 차가운 컵 겉을 닦았습니다. 잠시 뒤 바깥에 물방울이 맺혔습니다. 먼저 살펴볼 설명은?",
    "explanation": "차가운 컵 겉에서 공기 중 수증기가 물로 변하는 응결을 살펴본다. 실제 관찰에서는 물을 흘리거나 컵이 새지 않았는지도 확인한다.",
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
    "id": "s41-u02-b40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "각 컵 안의 물의 차가운 정도",
      "컵 재질·놓는 곳·관찰 시간",
      "물방울이 생기도록 고른 정답",
      "한쪽 컵에만 바깥에서 뿌린 물",
      "한쪽 컵만 닦지 않고 남긴 물기"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "같은 재질의 컵 두 개 겉을 닦고 한쪽에만 얼음물을 담았습니다. 비교에서 같게 할 조건은?",
    "explanation": "차가운 정도를 달리해 비교한다면 컵·장소·시간 등 다른 조건은 같게 한다. 밖에서 뿌린 물이나 닦지 않은 물기는 응결의 근거가 되지 않는다.",
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
    "id": "s41-u02-b41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "차가운 컵은 반드시 구멍이 생긴다",
      "실온 물 컵 주변에는 수증기가 전혀 없다",
      "모든 장소에서 같은 양의 물방울이 생긴다",
      "차가운 컵 겉에서 응결이 더 잘 보였다",
      "컵 안 얼음이 유리를 통과해 나온 것이다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 관찰: 밀폐한 얼음물 컵은 겉에 물방울이 많고 같은 장소의 실온 물 컵은 거의 없습니다. 자료에 맞는 해석은?",
    "explanation": "같은 장소·시간의 차가운 컵에서 물방울이 더 관찰됐다는 결과이다. 이것만으로 실온 컵 주변 수증기가 없거나 모든 조건에서 물방울 수가 같다고 말하지 않는다.",
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
    "id": "s41-u02-b42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "안경의 물방울이 기체가 되어 흐려진다",
      "안경 유리가 녹아 액체 물이 생긴다",
      "방의 수증기가 차가운 안경에서 물이 된다",
      "안경 안의 얼음이 바깥으로 흘러나온다",
      "방 안 공기가 고체로 얼어붙은 것이다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "겨울 바깥에서 쓰던 안경을 낀 채 따뜻한 방으로 들어오니 안경알이 흐려졌습니다. 상태 변화는?",
    "explanation": "공기 중 수증기가 차가운 안경알에서 응결해 작은 물방울이 된다. 안경 재료 자체가 물로 변한 것이 아니다.",
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
    "id": "s41-u02-b43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "기체 수증기가 그물에서 새로 액체가 되는 과정이다",
      "이미 액체인 물방울을 붙잡는 과정이다",
      "그물과 부딪힌 물방울이 모두 얼음으로 바뀐다",
      "그물의 구멍은 물방울이 지나갈 수 없어야 한다",
      "기체 수증기를 눈으로 보고 건져 내는 과정이다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "안개가 자주 지나는 곳의 그물이 공중의 작은 물방울을 붙잡아 모읍니다. 이 과정에 대한 이해로 알맞은 것은?",
    "explanation": "안개는 이미 작은 액체 물방울로 이루어져 있다. 그물에 붙잡히는 과정 자체는 수증기가 액체가 되는 응결과 구별한다.",
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
    "id": "s41-u02-b44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "욕실의 차가운 거울에 서린 김",
      "젖은 양말에서 줄어든 물",
      "냉동실에서 굳어진 물",
      "따뜻한 방에서 녹은 얼음",
      "차가운 컵 겉에 새로 맺힌 물방울"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "응결로 해석할 수 있는 두 가지를 고르세요.",
    "explanation": "컵 겉 물방울과 거울의 김은 수증기가 작은 물방울로 변한 예이다. 나머지는 증발·얼기·녹기에 해당한다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        4
      ]
    }
  },
  {
    "id": "s41-u02-b45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "기체인 수증기가 액체인 물로 변하는 현상을 무엇이라고 하나요?",
    "explanation": "수증기→물의 상태 변화는 응결이다. 물→수증기인 증발과 방향이 반대이다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결",
      "accepted": [
        "응결"
      ]
    }
  },
  {
    "id": "s41-u02-b46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E4",
      "type": "T16",
      "standard": "4과10-02",
      "topic": "응결의 근거와 물방울의 출처",
      "concept": "응결의 근거와 물방울의 출처",
      "inquirySkill": "대안 검토·조건 비교",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 차가운 컵을 꺼내자 겉에 물방울이 생겼습니다. 컵 속 물이 새었다는 주장과 응결이라는 설명을 비교하려면 무엇을 확인할까요?",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "컵의 구멍·뚜껑·흘린 물이 없는지 확인하고 겉을 닦은 같은 컵을 같은 장소와 시간에 비교한다. 차가운 컵과 실온 컵의 바깥 변화를 관찰해 공기 중 수증기의 응결이라는 설명을 검토한다.",
      "rubric": {
        "required": [
          "물의 출처에 대한 대안과 공정한 비교·관찰 근거를 연결한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u02-b47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "큰 그릇 바깥의 햇빛 없는 바닥",
      "덮개를 뚫어 올려 수증기 위쪽",
      "덮개 물방울이 떨어질 자리 아래",
      "큰 그릇 물속에 입구까지 잠기게",
      "물이 담긴 큰 그릇을 뒤집은 위"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "큰 그릇의 물을 증발시켜 수증기를 만든 뒤 덮개 안쪽 물방울을 빈 컵에 모으려 합니다. 빈 컵은 어디에 놓을까요?",
    "explanation": "수증기가 덮개 안쪽에서 응결한 물방울이 컵으로 떨어지는 길이 필요하다. 원래 물이 컵 입구로 직접 들어가면 상태 변화로 얻은 물과 구별할 수 없다.",
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
    "id": "s41-u02-b48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "수증기를 모두 바깥으로 내보낸다",
      "큰 그릇 물을 컵으로 직접 쏟는다",
      "모인 물을 그릇 속 물과 다시 섞는다",
      "응결한 물방울을 컵 쪽으로 이끈다",
      "그릇 안 물을 전부 얼음으로 만든다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "햇빛을 이용한 물 모으기 장치에 투명 덮개를 씌웁니다. 물을 얻기 위해 필요한 기능은?",
    "explanation": "증발한 수증기가 액체로 돌아오고 그 물방울을 따로 받는 구조가 필요하다. 덮개가 있어도 물방울이 컵으로 가지 않으면 잘 모이지 않는다.",
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
    "id": "s41-u02-b49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "예쁘게 칠할 색 이름과 모둠 이름",
      "물·수증기·물방울의 이동 경로",
      "완성됐다고 쓸 점수와 시상 문구",
      "만들지 않아도 성공이라고 할 날짜",
      "모든 날에 같은 물이 모일 시간표"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "상태 변화로 물을 얻는 장치 계획에 꼭 표시할 내용은?",
    "explanation": "어디서 증발하고 어디서 응결하며 어디로 모이는지 표시해야 설계가 상태 변화를 이용하는지 검토할 수 있다. 장식이나 예상 성공 수치는 작동 근거가 아니다.",
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
    "id": "s41-u02-b50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "판이 크면 어느 곳에서도 같은지",
      "실제로 판에 물방울이 맺히는지",
      "밤이면 습기와 관계없이 성공하는지",
      "물방울은 모두 바로 마셔도 되는지",
      "차갑다는 생각만으로 시험을 마쳤는지"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "밤에 차가워지는 판으로 공기 중 수증기를 물방울로 모으는 설계에서 확인할 조건은?",
    "explanation": "온도·주변 수증기 등 조건에 따라 결과가 다르다. 밤의 차가운 판이라는 아이디어만으로 언제나 물이 얻어진다고 단정하지 않고 실제로 확인한다.",
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
    "id": "s41-u02-b51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "통의 이름을 응결 장치라고 바꾸어 붙인다",
      "빗물을 그대로 더 큰 통에 많이 받아 놓는다",
      "증발한 물이 응결해 따로 모이는 부분을 만든다",
      "거름망으로 큰 먼지만 골라내는 부분을 단다",
      "완성 그림에 수증기라는 글자만 크게 쓴다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "빗물을 통에 받는 계획을 상태 변화 장치로 보완하려 합니다. 가장 직접적인 보완은?",
    "explanation": "빗물 받기나 거르기만으로 장치 안에서 상태 변화가 일어났다는 근거가 되지 않는다. 실제 증발·응결·수집 부분을 연결해야 한다.",
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
    "id": "s41-u02-b52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "수증기가 물방울이 되는 면",
      "물방울을 따로 받는 빈 컵",
      "그릇 물을 컵에 직접 붓는 관",
      "수증기가 모두 빠져나가는 큰 구멍",
      "컵 물을 매번 큰 그릇에 붓는 장치"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "증발·응결로 물을 모으는 설계에 필요한 두 가지를 고르세요.",
    "explanation": "액체가 수증기로 변한 뒤 다시 물방울이 되고 그 물을 따로 받아야 한다. 원래 물을 옮기는 것과 구별한다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        0,
        1
      ]
    }
  },
  {
    "id": "s41-u02-b53",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치에서 물이 수증기가 된 뒤 덮개에서 물방울이 되는 변화의 이름은?",
    "explanation": "덮개에서 일어나는 수증기→물방울의 변화는 응결이다. 앞 단계의 증발과 구별한다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "응결",
      "accepted": [
        "응결"
      ]
    }
  },
  {
    "id": "s41-u02-b54",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T17",
      "standard": "4과10-03",
      "topic": "물을 얻는 장치의 구조 설계",
      "concept": "물을 얻는 장치의 구조 설계",
      "inquirySkill": "구조와 기능 설계",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "큰 그릇·물·빈 컵·투명 덮개로 물을 얻는 장치를 설계하세요. 증발하는 곳, 응결하는 곳, 모으는 곳과 물이 직접 섞이지 않게 할 방법을 쓰세요.",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "큰 그릇의 물이 증발하고 투명 덮개 안쪽에서 수증기가 응결하도록 한다. 덮개 물방울이 가운데 빈 컵으로 떨어지도록 경사를 만든다. 컵 입구를 원래 물 높이보다 높이고 장치가 넘어지지 않게 고정한다.",
      "rubric": {
        "required": [
          "증발·응결·수집의 연결과 원래 물의 직접 혼입을 막는 구조를 설명한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u02-b55",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "완성됐다고 먼저 결과 표를 채운다",
      "칼로 단단한 용기 구멍을 혼자 뚫는다",
      "뜨거운 물을 맨손으로 급하게 붓는다",
      "재료와 고정 방법을 교사와 확인한다",
      "사용한 물을 맛봐 성능을 비교한다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "설계한 장치를 실제로 만들려고 합니다. 시작 전에 할 일은?",
    "explanation": "설계와 실제 제작은 별도 단계이다. 쉽게 구할 수 있는 안전한 재료와 안정된 고정을 확인하고 교사의 안내로 만든다. 뜨거운 물·날카로운 가공을 학생 혼자 하지 않는다.",
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
    "id": "s41-u02-b56",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "덮개가 빠지지 않고 컵도 서 있는지",
      "장치 그림에 정답 표시가 있는지",
      "모둠 이름이 가장 크게 적혔는지",
      "기대한 양을 결과 칸에 채웠는지",
      "물을 만들었다는 사진 제목이 있는지"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "투명 덮개를 큰 그릇 위에 고정하는 단계입니다. 실제로 점검할 것은?",
    "explanation": "부품이 실제로 고정되고 수집 컵이 안정되어 있어야 시험할 수 있다. 그림·이름·예상 수치는 제작 확인을 대신하지 않는다.",
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
    "id": "s41-u02-b57",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "컵 속 물을 모두 응결로 얻었다고 기록한다",
      "그릇을 더 흔들어 물을 많이 넣어 준다",
      "섞였다는 사실을 기록에서 지우고 진행한다",
      "멈추고 컵을 비운 뒤 안정되게 다시 놓는다",
      "컵이 찬 모습을 성공 사진으로만 남긴다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "제작 중 빈 컵이 기울어져 원래 물이 컵 안으로 들어갔습니다. 다음 행동은?",
    "explanation": "직접 들어간 원래 물은 응결해 모인 물과 구별해야 한다. 혼입을 기록하고 빈 컵·안정된 배치로 다시 준비한다.",
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
    "id": "s41-u02-b58",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "무거운 벽돌을 컵 위 덮개에 급히 올린다",
      "가벼운 둥근 물체로 찢어지지 않게 조절한다",
      "날카로운 못을 끝이 아래로 가도록 꽂는다",
      "물이 담긴 장치를 손으로 들고 흔들어 본다",
      "고정된 컵을 빼고 덮개 위에 올라서 누른다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "덮개 가운데를 조금 낮춰 물방울을 컵 쪽으로 보내려 합니다. 안전한 제작 방법은?",
    "explanation": "교사와 확인한 작고 가벼운 둥근 물체를 써 덮개와 컵이 무너지지 않게 한다. 뾰족하거나 무거운 물체·장치를 흔드는 행동은 피한다.",
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
    "id": "s41-u02-b59",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "맑아 보이면 모두 마셔도 된다고 한다",
      "덮개에서 왔으니 손 씻기 없이 나눈다",
      "모인 양을 늘리려고 세제를 섞어 둔다",
      "맛보지 않고 관찰·측정용으로만 쓴다",
      "음료 컵에 옮겨 두고 실험 표시를 뗀다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치를 만든 뒤 물이 모였는지 살펴봅니다. 수업용으로 모은 물의 취급은?",
    "explanation": "교실 장치는 물의 상태 변화와 수집을 살펴보는 도구이다. 재료·오염 여부·수질을 확인하지 않은 물을 마실 물로 판단하지 않는다. 실험 물임을 표시한다.",
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
    "id": "s41-u02-b60",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "모은 물을 마셔서 잘 됐는지 본다",
      "용기가 넘어지지 않게 고정한다",
      "원래 물이 수집 컵에 안 들어가게 한다",
      "뜨거운 용기를 맨손으로 옮긴다",
      "칼로 덮개 구멍을 혼자 만든다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치를 만드는 중 안전하게 확인할 두 가지는?",
    "explanation": "기울어짐과 혼입을 막는 고정은 안전과 결과 해석 모두에 필요하다. 가열·가공은 교사 안내를 따르고 실험 물을 맛보지 않는다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        1,
        2
      ]
    }
  },
  {
    "id": "s41-u02-b61",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "설계 그림만 완성한 뒤 아직 장치를 조립하지 않았습니다. “설계”와 “제작 완료” 중 확인된 단계는?",
    "explanation": "그림은 설계의 근거이다. 실제 재료로 만들지 않았으므로 제작 완료라고 표시하지 않는다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "설계",
      "accepted": [
        "설계",
        "설계 단계"
      ]
    }
  },
  {
    "id": "s41-u02-b62",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T18",
      "standard": "4과10-03",
      "topic": "간단한 장치 만들기와 안전",
      "concept": "간단한 장치 만들기와 안전",
      "inquirySkill": "안전한 조립·만들기",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "설계도를 실제 장치로 만드는 과정을 네 단계 정도로 적으세요. 교사와 확인할 부분과 원래 물이 수집 컵에 들어가지 않게 할 점도 포함하세요.",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "교사와 재료·고정을 확인한다. 큰 그릇 가운데 빈 컵을 세우고 컵 입구 아래까지만 물을 담는다. 투명 덮개를 고정하고 가벼운 둥근 물체로 컵 쪽 경사를 조절한다. 넘어짐·찢어짐·직접 혼입이 없는지 확인한 뒤 관찰을 시작한다.",
      "rubric": {
        "required": [
          "만들기의 순서·부품 고정·안전·혼입 방지를 구체적으로 설명한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u02-b63",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "제작했으므로 물이 충분히 모였다고 적음",
      "다른 모둠이 얻은 양을 우리 값으로 적음",
      "설계 예시의 물방울을 실제 사진이라 적음",
      "장치를 만들었으니 마실 물 확보라고 적음",
      "제작함, 물방울과 모인 양은 아직 미관찰"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치를 만든 뒤 아직 관찰하지 않았습니다. 결과 기록으로 적절한 것은?",
    "explanation": "제작한 사실과 물이 모였다는 관찰은 다르다. 아직 관찰하지 않은 결과는 미관찰로 남긴다.",
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
    "id": "s41-u02-b64",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "컵에 물이 없으므로 물방울도 없었던 셈이다",
      "응결만 보았으니 제작 없이 설계만 한 것이다",
      "물이 보였으므로 수집까지 모두 성공한 것이다",
      "물방울은 보였고 컵 수집은 확인되지 않았다",
      "컵이 비었으니 물의 상태 변화는 불가능하다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 덮개 안쪽에 물방울이 보였지만 수집 컵은 비어 있었습니다. 확인된 것은?",
    "explanation": "응결 관찰과 컵에 모으기는 별도이다. 관찰된 물방울을 부정하거나 수집 성공을 덧붙이지 않는다.",
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
    "id": "s41-u02-b65",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "두 장치의 관찰 시간이 달랐다는 사실",
      "두 관찰을 같은 조건으로 다시 할 필요",
      "기록에 날씨와 경과 시간을 적을 필요",
      "관찰한 양을 각각 따로 보관할 필요",
      "장치 모양 하나 때문에 양이 달랐다는 결론"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 두 장치를 다른 날·다른 시간 동안 놓았더니 모인 양이 달랐습니다. 곧바로 말하기 어려운 것은?",
    "explanation": "날짜·시간 등 여러 조건이 달랐기 때문에 모양 하나가 원인이라고 분리할 수 없다. 관찰된 차이는 남기고 조건을 맞추어 확인한다.",
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
    "id": "s41-u02-b66",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "성공이라고 쓴 별표 다섯 개만의 기록",
      "컵 모양과 관찰 시간을 뺀 높이 하나",
      "같은 컵의 처음·나중 높이와 경과 시간",
      "보고 싶었던 결과로 고친 나중 값",
      "아직 만들지 않은 장치의 실제 수집량"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치 시험에서 수집 컵의 물 높이를 비교합니다. 다음 기록 중 가장 쓸모 있는 것은?",
    "explanation": "같은 컵에서 처음과 나중을 비교하고 시간·놓은 조건을 함께 남긴다. 예상·평가 표시를 실제 측정값으로 대체하지 않는다.",
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
    "id": "s41-u02-b67",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "비어 있는 결과 칸에 예시 양을 채운다",
      "물이 없었다는 사진은 모두 지워 버린다",
      "이 장치는 모든 곳에서 실패한다고 적는다",
      "다음 모둠 값을 우리 관찰 결과로 적는다",
      "거의 없음과 당시 조건을 그대로 적는다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "시험한 장치에서 오늘 물이 거의 모이지 않았습니다. 바른 기록 태도는?",
    "explanation": "적거나 없는 결과도 실제 관찰이다. 조건과 한계를 남겨 다음 시험에 이용한다. 한 번의 결과를 모든 장소·날짜에 일반화하지 않는다.",
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
    "id": "s41-u02-b68",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "보지 못한 결과도 성공으로 채움",
      "실패한 결과를 뺀 좋은 사진만 남김",
      "관찰 날짜와 경과 시간",
      "물방울 위치와 수집 여부",
      "다른 모둠 값을 우리 측정값으로 바꿈"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치 시험을 비교할 때 함께 남길 두 가지를 고르세요.",
    "explanation": "조건과 실제 변화·수집 여부가 비교의 근거이다. 관찰하지 않은 값이나 선택한 성공 사진만으로 결과를 대신하지 않는다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        3
      ]
    }
  },
  {
    "id": "s41-u02-b69",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록에서 덮개 물방울은 봤지만 컵의 물은 확인하지 못했습니다. “확인”과 “미확인” 중 컵의 수집 상태는?",
    "explanation": "덮개의 물방울이 보였어도 컵으로 모였다는 관찰이 없으면 수집은 미확인이다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "미확인",
      "accepted": [
        "미확인",
        "확인하지 못함"
      ]
    }
  },
  {
    "id": "s41-u02-b70",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T19",
      "standard": "4과10-03",
      "topic": "시험 기록과 증거의 한계",
      "concept": "시험 기록과 증거의 한계",
      "inquirySkill": "시험 기록·증거 평가",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 같은 장소에서 30분 관찰한 장치 A는 덮개에 물방울, 컵은 비어 있음으로 적혔습니다. 무엇을 확인했고 무엇은 아직 확인하지 못했는지, 다음 기록을 제안하세요.",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "A의 덮개에서 물방울이 관찰됐지만 컵에 모이는 것은 확인되지 않았다. 덮개 경사와 컵 위치를 점검하고, 조건과 시간을 기록하며 물방울이 어디로 흐르는지와 컵의 처음·나중 상태를 다시 본다.",
      "rubric": {
        "required": [
          "관찰과 미확인을 구별하고 원인을 단정하지 않은 다음 확인을 제안한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u02-b71",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "장치 이름만 더 멋있게 바꾼다",
      "수집 컵을 원래 물로 미리 채운다",
      "컵 위치와 덮개 경사를 조절한다",
      "관찰 기록에서 빈 컵 부분을 뺀다",
      "물방울이 안 보이도록 덮개를 치운다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "덮개 물방울이 컵 옆으로 떨어졌습니다. 결과에 직접 연결한 첫 개선은?",
    "explanation": "관찰된 문제는 물방울의 이동 경로이다. 컵 위치·경사를 검토하되 무엇을 바꿨는지 기록하고 다시 확인해야 개선 효과를 말할 수 있다.",
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
    "id": "s41-u02-b72",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "의견을 적으면 시험도 끝난 것으로 친다",
      "친구 말을 근거로 수질 검사를 통과했다고 쓴다",
      "의견을 지우고 양이 늘었다는 값만 남긴다",
      "물을 직접 부어 튀어 들어간 양을 늘린다",
      "그 경로를 확인하고 혼입을 막도록 고친다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "친구가 “컵 입구로 원래 물이 튀어 들어갈 수 있어요”라고 말했습니다. 알맞은 대응은?",
    "explanation": "실제 받은 의견은 설계 검토의 자료이다. 혼입 가능성을 점검하고 고친 뒤 관찰해야 작동 결과를 확인할 수 있다.",
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
    "id": "s41-u02-b73",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "위치를 바꿨으니 수집량이 늘었다고 발표한다",
      "수정했으니 물 부족 문제가 해결됐다고 한다",
      "시험하지 않아도 모든 날 효과가 같다고 한다",
      "친구가 좋다고 해서 실제 성공으로 표시한다",
      "위치를 바꿨고 효과는 다음 시험에서 확인한다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 기록: 컵 위치를 고친 뒤 아직 다시 시험하지 않았습니다. 적절한 발표는?",
    "explanation": "수정한 사실과 효과는 별개이다. 재시험 전에는 예상과 다음 확인으로 표현한다.",
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
    "id": "s41-u02-b74",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "그림 색이 더 진한 설계가 물을 더 만든다",
      "상태 변화 경로·안전·수집 가능성을 비교한다",
      "가장 멋진 이름이면 시험을 생략해도 된다",
      "값을 적지 않은 설계는 언제나 실패한 것이다",
      "친구 수가 많은 모둠의 설계가 항상 옳다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "모둠이 물을 얻는 두 설계 중 하나를 골랐습니다. 선택 근거로 적절한 것은?",
    "explanation": "목적에 맞는 경로와 실제 제작·안전·확인 가능성을 비교한다. 인기·색·이름만으로 과학적 작동을 판단하지 않는다.",
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
    "id": "s41-u02-b75",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "예시 그림을 우리 모둠의 실제 실험 사진이라 말한다",
      "물방울을 한 번 봤으면 모든 날 성공이라고 말한다",
      "설계·제작 사진·실제 관찰·미확인을 나누어 말한다",
      "교사가 읽어 주면 공동 실천도 끝났다고 말한다",
      "친구 의견은 결과와 관계없다며 기록하지 않는다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치 발표에서 실제로 만들고 시험한 범위를 분명하게 알리는 방법은?",
    "explanation": "계획·제작·시험·받은 의견·미확인 범위를 구별해 전달해야 다른 사람이 근거를 검토할 수 있다. 가상 자료 응답을 실제 수행으로 세지 않는다.",
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
    "id": "s41-u02-b76",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "복수선택형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": [
      "수정 전의 기록을 모두 지운다",
      "예상한 양을 실제 결과로 넣는다",
      "친구가 칭찬하면 수질 확인도 끝낸다",
      "바꾼 부분과 까닭을 기록한다",
      "가능한 같은 조건에서 다시 시험한다"
    ],
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치를 개선한 뒤 타당하게 확인할 두 가지를 고르세요.",
    "explanation": "바꾼 내용과 재시험 조건·결과를 연결해야 개선 효과를 검토할 수 있다. 이전 자료와 미확인 범위도 남긴다.",
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        3,
        4
      ]
    }
  },
  {
    "id": "s41-u02-b77",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "단답형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "장치를 고친 뒤 효과를 확인하려고 같은 조건에서 다시 해 보는 일을 무엇이라고 하나요?",
    "explanation": "개선한 효과는 가능한 같은 조건에서 다시 시험하여 확인한다.",
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "재시험",
      "accepted": [
        "재시험",
        "다시 시험",
        "다시 실험",
        "재실험"
      ]
    }
  },
  {
    "id": "s41-u02-b78",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "물의 상태 변화"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u02",
      "area": "물질",
      "element": "E5",
      "type": "T20",
      "standard": "4과10-03",
      "topic": "개선·의견 교환과 다시 확인",
      "concept": "개선·의견 교환과 다시 확인",
      "inquirySkill": "의견에 따른 개선·재확인",
      "format": "서술형",
      "level": "심화",
      "track": "교과"
    },
    "givens": null,
    "choices": null,
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과10-01~03·자체 이론412/실험4B·6B 확인 본문",
      "note": "가상 자료·계획 응답을 실제 학생 수행·제작·시험·소통이나 공식 성적으로 확정하지 않는다."
    },
    "prompt": "가상 의견: “물방울이 컵 옆으로 흘러요.” 아직 장치를 고치지는 않았습니다. 개선 계획과 다시 확인할 방법을 설명하세요.",
    "explanation": "제시한 조건·관찰을 근거로 설명하고 선생님과 확인한다. 예시와 다른 타당한 설계·측정·개선도 검토한다.",
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "컵과 덮개의 낮은 부분을 맞추고 안전하게 고정할 계획이다. 실제 수정 후 같은 장소·관찰 시간에서 물방울 경로와 컵의 물을 기록해 비교한다. 현재는 의견과 계획만 있고 수정 효과는 미확인이라고 알린다.",
      "rubric": {
        "required": [
          "의견→개선 계획→실제 수정·재시험→효과 확인의 단계를 구별한다."
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 조건·근거·설명의 연결을 확인한다."
      }
    }
  }
]);
