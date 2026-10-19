// 4-1 Ⅰ. 자석의 이용 — 단원 파일 = 문제은행 (DESIGN.md §문제은행)
// 문항 계약: 스킬 gfield-science-question-bank. 이 파일의 문항은 전부 status:'authored'(창작).
// 단원평가 원문은 s41-u01.source.js의 정적 파일로 연결한다. 이전 DB는 읽기 대조에만 사용한다.

export const unit = {
  id: 's41-u01', course: '4-1', no: 1, title: '자석의 이용', domain: '운동과 에너지',
  sources: { theory: ['3-1-1:Ⅳ', '3-1-2:Ⅰ', '3-1-2:Ⅱ'], lab: ['3-A-4', '3-B-1', '3-B-2'], bank: ['static:science-lab/data/units/s41-u01.source.js'] },
};

const LEVEL = { 1: '기본', 2: '심화', 3: '영재' };
const T = (topic, concept, inquirySkill, itemType, level, track = '교과') =>
  ({ domain: '운동과 에너지', course: '4-1', grade: 4, unit: 'u01', topic, concept, inquirySkill, itemType, level: LEVEL[level] ?? level, track });
const A = (no) => ({ sourceId: 'authored', course: '4-1', unit: 'u01', originalNo: no });

// ── 그림(창작, 초기 상태만 — 정답 방향은 그리지 않는다) ──
const needle = (cx, cy, ang, r) => `<g transform="translate(${cx},${cy}) rotate(${ang})"><polygon points="0,${-r} 5,0 -5,0" fill="#E24B4A"/><polygon points="0,${r} 5,0 -5,0" fill="#3A6BC6"/></g>`;
const compass = (cx, cy, ang) => `<g><circle cx="${cx}" cy="${cy}" r="52" fill="#f2f2f2" stroke="#888" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="44" fill="#fff" stroke="#bbb"/>
<text x="${cx}" y="${cy - 26}" font-size="12" font-weight="700" text-anchor="middle" fill="#E24B4A">북</text><text x="${cx}" y="${cy + 36}" font-size="12" font-weight="700" text-anchor="middle" fill="#3A6BC6">남</text>
<text x="${cx + 32}" y="${cy + 4}" font-size="12" font-weight="700" text-anchor="middle">동</text><text x="${cx - 32}" y="${cy + 4}" font-size="12" font-weight="700" text-anchor="middle">서</text>
${ang === null ? `<text x="${cx}" y="${cy + 7}" font-size="20" font-weight="800" text-anchor="middle">?</text>` : needle(cx, cy, ang, 26) + `<circle cx="${cx}" cy="${cy}" r="3" fill="#666"/>`}</g>`;
const bar = (x, y, left, right) => {
  const c = { N: '#E24B4A', S: '#3A6BC6' };
  return `<rect x="${x}" y="${y}" width="80" height="32" fill="${c[left]}"/><rect x="${x + 80}" y="${y}" width="80" height="32" fill="${c[right]}"/><rect x="${x}" y="${y}" width="160" height="32" fill="none" stroke="#222" stroke-width="2"/>
<text x="${x + 12}" y="${y + 23}" fill="#fff" font-size="18" font-weight="800">${left}</text><text x="${x + 136}" y="${y + 23}" fill="#fff" font-size="18" font-weight="800">${right}</text>`;
};
const svg = (w, h, label, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" font-family="Pretendard,'Noto Sans KR',sans-serif">${body}</svg>`;
const arrow = (x, y, dir) => dir === 'right'
  ? `<polygon points="${x + 50},${y} ${x + 30},${y - 15} ${x + 30},${y - 7} ${x},${y - 7} ${x},${y + 7} ${x + 30},${y + 7} ${x + 30},${y + 15}" fill="#7ED36B" stroke="#2f7a22" stroke-width="2"/>`
  : `<polygon points="${x},${y} ${x + 20},${y - 15} ${x + 20},${y - 7} ${x + 50},${y - 7} ${x + 50},${y + 7} ${x + 20},${y + 7} ${x + 20},${y + 15}" fill="#7ED36B" stroke="#2f7a22" stroke-width="2"/>`;

export const figures = {
  // 나침반(바늘 북쪽) 서쪽에서 막대자석 N극을 가까이 가져감
  'west-n-approach': svg(420, 140, '나침반의 서쪽에서 막대자석의 N극을 가까이 가져가는 모습',
    bar(10, 54, 'S', 'N') + arrow(190, 70, 'right') + compass(330, 70, 0)),
  // 막대자석 S극 오른쪽(동쪽)에 놓은 나침반, 바늘은 ?로 가림
  'east-of-s': svg(360, 130, '막대자석의 S극 오른쪽에 놓인 나침반, 바늘은 가려져 있음',
    bar(20, 49, 'N', 'S') + compass(270, 65, null)),
};

const choice = (no, t, prompt, choices, answerIndex, explanation, extra = {}) => ({
  id: `s41-u01-a${String(no).padStart(2, '0')}`, status: 'authored', sourceRef: A(no), taxonomy: t,
  prompt, givens: extra.givens ?? null, choices, visualModel: extra.figure ? { kind: 'authored-svg', figure: extra.figure } : null,
  responseContract: 'single-choice', answerContract: { type: 'single-choice', answer: answerIndex, accepted: [answerIndex] },
  explanation, variantRules: extra.variantRules ?? null, evidence: { checkedBy: 'Claude', date: '2026-09-19', gates: ['science', 'answer'] },
});
const cloze = (no, t, text, blanks, explanation) => ({
  id: `s41-u01-a${String(no).padStart(2, '0')}`, status: 'authored', sourceRef: A(no), taxonomy: t,
  prompt: text, givens: null, choices: null, visualModel: null,
  responseContract: 'cloze', answerContract: { type: 'cloze', blanks }, explanation, variantRules: null,
  evidence: { checkedBy: 'Claude', date: '2026-09-19', gates: ['science', 'answer'] },
});
const written = (no, t, prompt, rubric, sample, explanation, givens = null) => ({
  id: `s41-u01-a${String(no).padStart(2, '0')}`, status: 'authored', sourceRef: A(no), taxonomy: t,
  prompt, givens, choices: null, visualModel: null,
  responseContract: 'written-explanation', answerContract: { type: 'written-explanation', rubric, sample }, explanation, variantRules: null,
  evidence: { checkedBy: 'Claude', date: '2026-09-19', gates: ['science', 'answer'] },
});

export const items = [
  // ── cloze 6 (③ 개념 카드) ──
  cloze(1, T('자석에 붙는 물체', '철로 만든 물체가 자석에 붙는다', 'concept and terminology', 'cloze', 1),
    '쇠못·옷핀·클립처럼 ( ① )(으)로 만든 물체는 자석에 붙고, 유리·고무·종이로 만든 물체는 붙지 않아요.',
    [{ answer: '철', accepted: ['철', '쇠'] }],
    '자석은 철로 만든 물체를 끌어당겨요. 쇠못·옷핀·클립은 모두 철이에요.'),
  cloze(2, T('자석의 극', '극의 정의와 위치', 'concept and terminology', 'cloze', 1),
    '자석에서 철로 만든 물체가 가장 많이 붙는 부분을 ( ① )(이)라고 해요. 막대자석에서는 ( ② )에 있어요.',
    [{ answer: '극', accepted: ['극', '자석의 극'] }, { answer: '양쪽 끝', accepted: ['양쪽 끝', '양 끝', '양끝', '두 끝'] }],
    '막대자석을 클립 더미에 넣었다 들면 양쪽 끝에 클립이 가장 많이 매달려요. 그곳이 극이에요.'),
  cloze(3, T('극 사이의 힘', '같은 극은 밀고 다른 극은 당긴다', 'cause and effect', 'cloze', 1),
    '두 자석을 가까이 하면 같은 극끼리는 서로 ( ① ), 다른 극끼리는 서로 ( ② ).',
    [{ answer: '밀어 내요', accepted: ['밀어 내요', '밀어낸다', '밀어 낸다', '밀어내요', '밀어 냄'] },
     { answer: '끌어당겨요', accepted: ['끌어당겨요', '끌어당긴다', '당긴다', '당겨요'] }],
    'N극과 N극, S극과 S극은 밀어 내고, N극과 S극은 끌어당겨요.'),
  cloze(4, T('자석이 가리키는 방향', 'N극·S극의 이름', 'concept and terminology', 'cloze', 1),
    '물에 띄운 막대자석이 멈추면 ( ① )쪽을 가리키는 극을 N극, ( ② )쪽을 가리키는 극을 S극이라고 해요.',
    [{ answer: '북', accepted: ['북', '북쪽'] }, { answer: '남', accepted: ['남', '남쪽'] }],
    '자유롭게 움직이는 자석은 늘 북쪽과 남쪽을 가리키며 멈춰요. 북쪽 극이 N극이에요.'),
  cloze(5, T('나침반', '나침반 바늘은 자석이다', 'concept and terminology', 'cloze', 1),
    '나침반 바늘은 ( ① )(이)라서, 가까이에 막대자석을 가져가면 바늘이 ( ② ).',
    [{ answer: '자석', accepted: ['자석', '작은 자석'] }, { answer: '움직여요', accepted: ['움직여요', '움직인다', '돌아가요', '돌아간다'] }],
    '나침반 바늘도 N극과 S극이 있는 자석이라 다른 자석의 극에 끌리거나 밀려요.'),
  cloze(6, T('자석의 힘', '물체를 사이에 두어도, 떨어져 있어도 힘이 작용한다', 'evidence-based conclusion', 'cloze', 2),
    '자석과 클립 사이에 얇은 종이를 끼워도 클립이 ( ① ). 자석과 클립 사이가 멀어질수록 끌어당기는 힘은 ( ② ).',
    [{ answer: '끌려와요', accepted: ['끌려와요', '붙어요', '붙는다', '끌려온다'] }, { answer: '약해져요', accepted: ['약해져요', '약해진다', '작아진다', '작아져요'] }],
    '자석의 힘은 종이·플라스틱을 사이에 두어도 작용하지만, 거리가 멀어질수록 약해져요.'),

  // ── table-fill 1 (③ 정리표) ──
  { id: 's41-u01-a07', status: 'authored', sourceRef: A(7),
    taxonomy: T('자석에 붙는 물체', '재료에 따라 자석에 붙는지가 정해진다', 'classification by observable properties', 'table-fill', 1),
    prompt: '물체마다 만든 재료와 자석에 붙는지를 골라 표를 채워 보세요.', givens: null, choices: null, visualModel: null,
    responseContract: 'table-fill',
    answerContract: { type: 'table-fill',
      columns: ['재료', '자석에 붙나요?'],
      options: { '재료': ['철', '유리', '고무', '나무'], '자석에 붙나요?': ['붙는다', '붙지 않는다'] },
      rows: [
        { label: '쇠못', answer: ['철', '붙는다'] },
        { label: '유리컵', answer: ['유리', '붙지 않는다'] },
        { label: '고무줄', answer: ['고무', '붙지 않는다'] },
        { label: '나무젓가락', answer: ['나무', '붙지 않는다'] },
        { label: '옷핀', answer: ['철', '붙는다'] },
      ] },
    explanation: '재료가 철인 쇠못과 옷핀만 자석에 붙어요. 모양이나 크기가 아니라 재료가 결정해요.',
    variantRules: '행 순서 섞기 허용. 철 2~3행 유지.', evidence: { checkedBy: 'Claude', date: '2026-09-19', gates: ['science', 'answer'] } },

  // ── single-choice (정답 위치 분포·보기 길이는 bank/audit.mjs가 검사) ──
  choice(8, T('자석에 붙는 물체', '알루미늄은 자석에 붙지 않는다', 'classification by observable properties', 'single-choice', 1),
    '자석을 가까이 했을 때 자석에 붙지 않는 물체는 어느 것인가요?',
    ['쇠로 된 병뚜껑', '철사 한 토막', '알루미늄 포일', '쇠 숟가락', '스테이플러 심'], 2,
    '알루미늄은 금속이지만 철이 아니라서 자석에 붙지 않아요. 나머지는 모두 철로 만들었어요.'),
  choice(9, T('자석의 극', '철가루는 양 끝에 많이 붙는다', 'observation', 'single-choice', 1),
    '막대자석을 철가루 접시에 굴린 뒤 들어 올렸어요. 철가루가 가장 많이 붙은 곳은 어디인가요?',
    ['막대자석의 양쪽 끝', '막대자석의 한가운데', '막대자석의 한쪽 끝만', '막대자석 전체에 고르게', '막대자석의 옆면 가운데'], 0,
    '철가루는 극이 있는 양쪽 끝에 가장 많이 붙고 가운데는 거의 붙지 않아요.'),
  choice(10, T('자석의 극', '자석을 잘라도 조각마다 두 극이 생긴다', 'prediction with stated conditions', 'single-choice', 2),
    '막대자석을 가운데에서 반으로 잘랐어요. 잘린 두 조각은 어떻게 될까요?',
    ['한 조각은 N극, 다른 조각은 S극만 갖는다', '두 조각 모두 자석의 성질을 잃는다', '잘린 면에서만 철을 끌어당긴다', '원래 N극이 있던 조각만 자석이 된다', '조각마다 N극과 S극이 모두 생긴다'], 4,
    '자석은 아무리 잘라도 조각마다 N극과 S극이 함께 생겨요. 극이 하나만 있는 자석은 없어요.'),
  choice(11, T('극 사이의 힘', '떠 있는 고리 자석 = 같은 극 마주 봄', 'cause and effect', 'single-choice', 2),
    '막대에 고리 자석 두 개를 끼웠더니 위쪽 자석이 아래쪽 자석 위에 떠 있었어요. 그 까닭은 무엇인가요?',
    ['두 자석의 크기가 서로 달라서', '마주 보는 면이 같은 극이라서', '마주 보는 면이 다른 극이라서', '막대가 위 자석을 끌어당겨서', '위 자석이 아래 자석보다 가벼워서'], 1,
    '같은 극끼리 밀어 내는 힘이 위쪽 자석을 받쳐서 떠 있어요. 다른 극이었다면 딱 붙었을 거예요.'),
  choice(12, T('나침반과 자석', '다른 극끼리 끌어당겨 바늘이 돈다', 'prediction with stated conditions', 'single-choice', 2),
    '북쪽을 가리키던 나침반의 서쪽에서 막대자석의 N극을 가까이 가져갔어요. 나침반 바늘은 어떻게 될까요?',
    ['바늘이 전혀 움직이지 않는다', '빨간색 부분이 북쪽을 계속 가리킨다', '바늘이 쉬지 않고 빙글빙글 돈다', '빨간색 부분이 동쪽을 가리킨다', '파란색 부분이 남쪽을 가리킨다'], 3,
    '바늘의 파란색(S극)이 서쪽의 N극에 끌려가 서쪽을 가리키고, 빨간색(N극)은 반대인 동쪽을 가리켜요.',
    { figure: 'west-n-approach', givens: { 실험: '나침반 서쪽에서 막대자석의 N극을 가까이 가져간다.' } }),
  choice(13, T('자석의 극', '양 끝과 가운데를 대어 보면 자석을 가릴 수 있다', 'evidence-based conclusion', 'single-choice', 3, '영재성'),
    '생김새가 같은 쇠막대 A, B가 있어요. A의 끝을 B의 가운데에 대면 붙고, B의 끝을 A의 가운데에 대면 붙지 않았어요. 알맞은 것은 어느 것인가요?',
    ['B만 자석이다', 'A만 자석이다', 'A와 B 모두 자석이다', 'A와 B 모두 자석이 아니다', '이 실험으로는 알 수 없다'], 1,
    '자석의 가운데는 힘이 거의 없어요. A의 끝(극)이 B를 끌어당겼고, B의 끝은 A를 당기지 못했으니 A만 자석이에요.',
    { givens: { 결과: 'A 끝 → B 가운데: 붙음 / B 끝 → A 가운데: 붙지 않음' } }),
  choice(14, T('자석의 이용', '생활 속 자석', 'real-world application', 'single-choice', 1),
    '우리 생활에서 자석을 이용한 물건이 아닌 것은 어느 것인가요?',
    ['냉장고 메모꽂이', '가방의 자석 단추', '자석 칠판', '나침반', '고무지우개'], 4,
    '고무지우개에는 자석이 없어요. 나머지는 자석이 철이나 다른 자석을 끌어당기는 성질을 이용해요.'),
  choice(15, T('자석의 힘', '바꾸는 조건과 같게 할 조건', 'manipulated, responding, and controlled variables', 'single-choice', 2),
    '종이를 몇 장 끼우느냐에 따라 자석이 클립을 끌어당기는 힘이 달라지는지 알아보려고 해요. 실험에서 다르게 해야 하는 조건은 어느 것인가요?',
    ['끼우는 종이의 장수', '사용하는 막대자석', '매다는 클립의 종류', '끼우는 종이의 종류', '자석을 가까이 하는 방법'], 0,
    '알아보려는 것이 종이 장수의 영향이므로 종이 장수만 바꾸고, 자석·클립·종이 종류·방법은 같게 해야 공정한 실험이에요.'),
  choice(16, T('자석이 가리키는 방향', '북쪽을 가리키는 극 = N극', 'evidence-based conclusion', 'single-choice', 1),
    '극 표시가 지워진 막대자석을 물에 띄웠더니 한쪽 끝이 북쪽을 가리키며 멈췄어요. 이 끝은 무슨 극인가요?',
    ['S극', '극이 아니다', 'N극', 'N극과 S극 모두', '알 수 없다'], 2,
    '자석이 멈췄을 때 북쪽을 가리키는 극을 N극이라고 해요. 표시가 없어도 이렇게 극을 알아낼 수 있어요.'),
  choice(17, T('나침반과 자석', '막대자석 S극 옆 나침반', 'diagram interpretation', 'single-choice', 2),
    '막대자석 S극의 오른쪽에 나침반을 놓았어요. 나침반 바늘은 어떻게 멈출까요?',
    ['빨간색 부분이 동쪽을 가리킨다', '파란색 부분이 서쪽을 가리킨다', '빨간색 부분이 북쪽을 가리킨다', '빨간색 부분이 서쪽을 가리킨다', '파란색 부분이 북쪽을 가리킨다'], 3,
    '바늘의 빨간색(N극)이 막대자석의 S극에 끌려 서쪽(자석 쪽)을 가리키고, 파란색은 동쪽을 가리켜요.',
    { figure: 'east-of-s' }),

  // ── written-explanation 3 (④ 확장) ──
  written(18, T('자석이 가리키는 방향', '극 표시 없는 자석의 극 찾기', 'experiment purpose or hypothesis', 'written-explanation', 2),
    '극 표시가 지워진 막대자석이 있어요. 이 자석의 N극이 어느 쪽인지 알아내는 방법을 한 가지 쓰세요.',
    { required: ['방법(나침반·물에 띄우기·극 표시된 자석 중 하나)', '관찰 결과로 극을 판단하는 근거'],
      pass: '방법과 판단 근거가 모두 있으면 정답',
      accepted: ['물에 띄워 북쪽을 가리키는 끝이 N극', '나침반에 가까이 해 바늘의 S극(파란색)이 끌려오는 끝이 N극', '극 표시된 자석의 N극에 대어 밀어 내는 끝이 N극'] },
    '자석을 물에 띄운 접시에 올려 두고, 멈췄을 때 북쪽을 가리키는 끝이 N극이에요.',
    '자석은 북쪽을 가리키는 성질, 같은 극은 밀고 다른 극은 당기는 성질이 있어요. 이 가운데 하나를 쓰고 근거를 함께 적으면 돼요.'),
  written(19, T('자석의 이용', '자석 방충망의 원리', 'real-world application', 'written-explanation', 2),
    '자석 방충망은 가운데 틈에 자석이 들어 있어 손을 떼면 저절로 닫혀요. 어떤 자석의 성질을 이용했는지 설명하세요.',
    { required: ['양쪽 자석이 서로 끌어당긴다', '다른 극끼리(또는 자석과 철이) 마주 본다'],
      pass: '끌어당기는 성질 + 마주 보는 극(또는 철) 언급 시 정답' },
    '양쪽 틈에 다른 극끼리 마주 보도록 자석을 넣어서, 서로 끌어당기는 힘으로 닫혀요.',
    '다른 극끼리는 끌어당기므로, 틈 양쪽에 다른 극이 마주 보게 넣으면 가까워질 때 서로 붙어 닫혀요.'),
  written(20, T('자석의 힘', '자석 세기 비교 실험 설계', 'manipulated, responding, and controlled variables', 'written-explanation', 3, '영재성'),
    '크기가 다른 두 막대자석 중 어느 쪽 힘이 센지 클립을 이용해 비교하려고 해요. 실험 방법을 쓰고, 공정하게 비교하려면 같게 해야 할 조건을 두 가지 쓰세요.',
    { required: ['매달리는 클립 수(또는 끌려오는 거리)로 비교', '같게 할 조건 2개(클립 종류·매다는 방법·자석의 같은 부분(극) 사용 등)'],
      pass: '측정 방법 1 + 통제 조건 2 모두 있으면 정답' },
    '각 자석의 극에 같은 클립을 하나씩 이어 매달아 몇 개까지 매달리는지 센다. 같은 클립을 쓰고, 두 자석 모두 극 부분에 같은 방법으로 매단다.',
    '비교하려는 것(자석) 말고는 모두 같게 해야 차이가 자석 때문이라고 말할 수 있어요.'),
  // ── 영재성 (4학년 눈높이 — 중등 용어는 쓰지 않고 풀어서, 미리보기 한 줄만) ──
  written(21, T('자석의 힘', '자석의 힘이 미치는 공간(철가루 무늬)', 'observation versus inference', 'written-explanation', 3, '영재성'),
    '막대자석 위에 종이를 덮고 철가루를 골고루 뿌린 뒤 종이를 톡톡 두드렸더니 철가루가 무늬를 만들었어요. 무늬를 보고 알 수 있는 것을 두 가지 쓰세요.',
    { required: ['관찰: 양쪽 끝(극) 근처에 철가루가 많이 모인다', '추론: 자석에서 떨어진 곳에도 힘이 미친다 / 극에서 극으로 이어지는 선 모양'],
      pass: '관찰 1 + 추론 1 이상이면 정답', preview: '중학교에서는 자석의 힘이 미치는 공간을 "자기장"이라고 불러요.' },
    '양쪽 끝에 철가루가 가장 많이 모이고, 끝과 끝을 잇는 둥근 선 모양이 생긴다. 자석에 닿지 않은 철가루도 움직였으니 자석의 힘은 떨어진 곳까지 미친다.',
    '보이는 것(철가루가 모인 곳, 선 모양)과 그것으로 알 수 있는 것(떨어진 곳에도 힘이 미침)을 나누어 써요.'),
  choice(22, T('극 사이의 힘', '같은 극끼리 밀어 내는 힘으로 뜨는 물체', 'real-world application', 'single-choice', 3, '영재성'),
    '자기부상 열차 장난감은 레일과 열차 바닥에 자석이 있어서 열차가 레일 위에 살짝 떠서 달려요. 열차가 뜨려면 레일과 열차 바닥의 자석을 어떻게 놓아야 할까요?',
    ['레일과 열차 바닥이 서로 다른 극으로 마주 보게', '레일에만 자석을 두고 열차에는 철판을 붙이게', '레일과 열차 바닥이 서로 같은 극으로 마주 보게', '열차 바닥의 자석을 나무판으로 모두 감싸게', '레일의 자석을 가운데 부분만 열차 쪽으로 향하게'], 2,
    '같은 극끼리 밀어 내는 힘이 열차를 위로 받쳐 줘요. 고리 자석 탑이 떠 있는 것과 같은 원리예요.',
    { variantRules: '정답 위치는 배포 시 섞음(정답 letter 재계산).' }),
  written(23, T('자석의 이용', '자석의 성질로 생활 속 불편 해결하기', 'real-world application', 'written-explanation', 3, '영재성'),
    '자석의 성질을 이용해 우리 생활의 불편한 점을 해결하는 물건을 떠올려 보세요. 되도록 많이 쓰고, 각각 어떤 성질을 이용했는지 함께 쓰세요.',
    { required: ['물건 아이디어 3개 이상(유창성)', '각 아이디어에 이용한 성질(철을 끌어당김 / 같은 극은 밀고 다른 극은 당김 / 일정한 방향을 가리킴)'],
      pass: '3개 이상 + 성질 연결', bonus: '남들이 잘 떠올리지 않는 아이디어(독창성), 서로 다른 성질을 골고루 사용(융통성)' },
    '예) 떨어진 압정을 한 번에 줍는 자석 빗자루(철을 끌어당김), 저절로 닫히는 자석 문(다른 극끼리 당김), 서로 밀어 내서 흔들리지 않는 자석 받침(같은 극끼리 밀어 냄).',
    '영재성 채점 기준(지필드 실험편 "영재성 기르기")으로 아이디어 수(유창성), 새로움(독창성), 성질의 다양함(융통성)을 봐요.'),
  choice(24, T('자석의 극', '철 클립만으로 극 찾기', 'evidence-based conclusion', 'single-choice', 2),
    '극 표시가 없는 둥근기둥 모양 자석이 있어요. 철 클립이 든 상자에 넣었다가 꺼냈을 때 극이 있는 곳은 어떻게 알 수 있을까요?',
    ['철 클립이 하나도 붙지 않는 곳', '철 클립이 고르게 조금씩 붙은 곳', '자석의 색깔이 진하게 칠해진 곳', '철 클립이 가장 많이 붙어 있는 곳', '자석이 가장 무겁게 느껴지는 곳'], 3,
    '철로 만든 물체가 가장 많이 붙는 곳이 자석의 극이에요. 모양이 달라도 극은 두 곳이에요.'),
  written(25, T('나침반과 자석', '나침반으로 자석 주위 방향 알아보기', 'experiment design', 'written-explanation', 3, '영재성'),
    '나침반 하나와 막대자석 하나가 있어요. 막대자석 주위의 여러 곳에서 나침반 바늘이 어느 쪽을 가리키는지 알아보는 방법을 순서대로 쓰세요.',
    { required: ['막대자석을 움직이지 않게 놓는다', '나침반을 자석 주위의 여러 자리로 옮기며 바늘 방향을 기록한다(그림·화살표)', '자석에서 떨어진 곳과 가까운 곳을 비교한다'],
      pass: '고정 + 여러 자리 기록 포함 시 정답' },
    '막대자석을 종이 위에 고정하고 둘레를 따라 나침반을 조금씩 옮기면서, 자리마다 빨간 바늘이 가리키는 방향을 화살표로 그린다.',
    '바꾸는 것은 나침반의 자리 하나뿐이고, 자석은 그대로 두어야 비교할 수 있어요.'),
  cloze(26, T('나침반과 자석', '가까운 자석이 나침반 바늘 방향을 바꾼다', 'cause and effect', 'cloze', 2),
    '나침반은 보통 ( ① )쪽을 가리키지만, 가까이에 자석이 있으면 바늘이 ( ② ) 쪽을 가리켜서 방향을 잘못 알 수 있어요.',
    [{ answer: '북', accepted: ['북', '북쪽'] }, { answer: '자석', accepted: ['자석', '자석 있는'] }],
    '나침반 바늘도 자석이라서, 가까이 있는 자석에 끌리거나 밀려 방향이 바뀌어요. 방향을 찾을 때는 자석을 멀리 두어요.'),
];

// ── 2026-10-18 문항 검수 ──
Object.assign(unit.sources,{bank:['data/units/s41-u01.source.js']});
for(const patch of [
  {
    "id": "s41-u01-a01",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 1,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "쇠못·옷핀·클립처럼 ( ① )(으)로 만든 물체는 자석에 붙고, 유리·고",
      "concept": "철로 만든 물체가 자석에 붙는다",
      "inquirySkill": "concept and terminology",
      "itemType": "cloze",
      "level": "기본",
      "track": "교과",
      "type": "T01",
      "element": "E1",
      "format": "빈칸",
      "standard": "4과09-01",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "쇠못·옷핀·클립처럼 ( ① )(으)로 만든 물체는 자석에 붙고, 유리·고무·종이로 만든 물체는 붙지 않아요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "철",
          "accepted": [
            "철",
            "쇠"
          ]
        }
      ]
    },
    "explanation": "자석은 철로 만든 물체를 끌어당겨요. 쇠못·옷핀·클립은 모두 철이에요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a02",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 2,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 ( ① )(이)라고 해",
      "concept": "극의 정의와 위치",
      "inquirySkill": "concept and terminology",
      "itemType": "cloze",
      "level": "기본",
      "track": "교과",
      "type": "T05",
      "element": "E2",
      "format": "빈칸",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "자석에서 철로 만든 물체가 가장 많이 붙는 부분을 ( ① )(이)라고 해요. 막대자석에서는 ( ② )에 있어요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "극",
          "accepted": [
            "극",
            "자석의 극"
          ]
        },
        {
          "answer": "양쪽 끝",
          "accepted": [
            "양쪽 끝",
            "양 끝",
            "양끝",
            "두 끝"
          ]
        }
      ]
    },
    "explanation": "막대자석을 클립 더미에 넣었다 들면 양쪽 끝에 클립이 가장 많이 매달려요. 그곳이 극이에요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a03",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 3,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "두 자석을 가까이 하면 같은 극끼리는 서로 ( ① ), 다른 극끼리는 서",
      "concept": "같은 극은 밀고 다른 극은 당긴다",
      "inquirySkill": "cause and effect",
      "itemType": "cloze",
      "level": "기본",
      "track": "교과",
      "type": "T07",
      "element": "E3",
      "format": "빈칸",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "두 자석을 가까이 하면 같은 극끼리는 서로 ( ① ), 다른 극끼리는 서로 ( ② ).",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "밀어 내요",
          "accepted": [
            "밀어 내요",
            "밀어낸다",
            "밀어 낸다",
            "밀어내요",
            "밀어 냄"
          ]
        },
        {
          "answer": "끌어당겨요",
          "accepted": [
            "끌어당겨요",
            "끌어당긴다",
            "당긴다",
            "당겨요"
          ]
        }
      ]
    },
    "explanation": "N극과 N극, S극과 S극은 밀어 내고, N극과 S극은 끌어당겨요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a04",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 4,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "물에 띄운 막대자석이 멈추면 ( ① )쪽을 가리키는 극을 N극, ( ② ",
      "concept": "N극·S극의 이름",
      "inquirySkill": "concept and terminology",
      "itemType": "cloze",
      "level": "기본",
      "track": "교과",
      "type": "T10",
      "element": "E4",
      "format": "빈칸",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "물에 띄운 막대자석이 멈추면 ( ① )쪽을 가리키는 극을 N극, ( ② )쪽을 가리키는 극을 S극이라고 해요.",
    "givens": {
      "조건": "주변의 다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 교구입니다."
    },
    "choices": null,
    "visualModel": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "북",
          "accepted": [
            "북",
            "북쪽"
          ]
        },
        {
          "answer": "남",
          "accepted": [
            "남",
            "남쪽"
          ]
        }
      ]
    },
    "explanation": "이 조건에서 북쪽을 가리키는 극을 N극, 남쪽을 가리키는 극을 S극이라고 합니다. 다른 자석의 영향을 받으면 방향이 달라질 수 있습니다.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a05",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 5,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "나침반 바늘은 ( ① )(이)라서, 가까이에 막대자석을 가져가면 바늘이 ",
      "concept": "나침반 바늘은 자석이다",
      "inquirySkill": "concept and terminology",
      "itemType": "cloze",
      "level": "기본",
      "track": "교과",
      "type": "T11",
      "element": "E4",
      "format": "빈칸",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "나침반 바늘은 ( ① )(이)라서, 가까이에 막대자석을 가져가면 바늘이 ( ② ).",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "자석",
          "accepted": [
            "자석",
            "작은 자석"
          ]
        },
        {
          "answer": "움직여요",
          "accepted": [
            "움직여요",
            "움직인다",
            "돌아가요",
            "돌아간다"
          ]
        }
      ]
    },
    "explanation": "나침반 바늘도 N극과 S극이 있는 자석이라 다른 자석의 극에 끌리거나 밀려요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a06",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 6,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "자석과 클립 사이에 얇은 종이를 끼워도 클립이 ( ① ). 자석과 클립 ",
      "concept": "물체를 사이에 두어도, 떨어져 있어도 힘이 작용한다",
      "inquirySkill": "evidence-based conclusion",
      "itemType": "cloze",
      "level": "심화",
      "track": "교과",
      "type": "T03",
      "element": "E1",
      "format": "빈칸",
      "standard": "4과09-01",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "자석과 클립 사이에 얇은 종이를 끼워도 클립이 ( ① ). 자석과 클립 사이가 멀어질수록 끌어당기는 힘은 ( ② ).",
    "givens": {
      "조건": "같은 자석·철 클립을 가까이 놓고 얇은 종이만 끼우는 교구 비교입니다."
    },
    "choices": null,
    "visualModel": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "끌려와요",
          "accepted": [
            "끌려와요",
            "붙어요",
            "붙는다",
            "끌려온다"
          ]
        },
        {
          "answer": "약해져요",
          "accepted": [
            "약해져요",
            "약해진다",
            "작아진다",
            "작아져요"
          ]
        }
      ]
    },
    "explanation": "자석의 힘은 종이·플라스틱을 사이에 두어도 작용하지만, 거리가 멀어질수록 약해져요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a07",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 7,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "재료를 확인한 철 못·철 옷핀·유리컵·고무줄·나무젓가락 시료를 같은 자석",
      "concept": "재료에 따라 자석에 붙는지가 정해진다",
      "inquirySkill": "classification by observable properties",
      "itemType": "table-fill",
      "level": "기본",
      "track": "교과",
      "type": "T01",
      "element": "E1",
      "format": "표 채우기",
      "standard": "4과09-01",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "재료를 확인한 철 못·철 옷핀·유리컵·고무줄·나무젓가락 시료를 같은 자석에 가까이했습니다. 이 시료의 재료와 결과를 표에 골라 넣으세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "table-fill",
    "answerContract": {
      "type": "table-fill",
      "columns": [
        "재료",
        "자석에 붙나요?"
      ],
      "options": {
        "재료": [
          "철",
          "유리",
          "고무",
          "나무"
        ],
        "자석에 붙나요?": [
          "붙는다",
          "붙지 않는다"
        ]
      },
      "rows": [
        {
          "label": "쇠못",
          "answer": [
            "철",
            "붙는다"
          ]
        },
        {
          "label": "유리컵",
          "answer": [
            "유리",
            "붙지 않는다"
          ]
        },
        {
          "label": "고무줄",
          "answer": [
            "고무",
            "붙지 않는다"
          ]
        },
        {
          "label": "나무젓가락",
          "answer": [
            "나무",
            "붙지 않는다"
          ]
        },
        {
          "label": "옷핀",
          "answer": [
            "철",
            "붙는다"
          ]
        }
      ]
    },
    "explanation": "재료가 철인 쇠못과 옷핀만 자석에 붙어요. 모양이나 크기가 아니라 재료가 결정해요.",
    "variantRules": "행 순서 섞기 허용. 철 2~3행 유지.",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a08",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 8,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "자석을 가까이 했을 때 자석에 붙지 않는 물체는 어느 것인가요?",
      "concept": "알루미늄은 자석에 붙지 않는다",
      "inquirySkill": "classification by observable properties",
      "itemType": "single-choice",
      "level": "기본",
      "track": "교과",
      "type": "T01",
      "element": "E1",
      "format": "선택형",
      "standard": "4과09-01",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "자석을 가까이 했을 때 자석에 붙지 않는 물체는 어느 것인가요?",
    "givens": null,
    "choices": [
      "쇠로 된 병뚜껑",
      "철사 한 토막",
      "알루미늄 포일",
      "쇠 숟가락",
      "스테이플러 심"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "알루미늄은 금속이지만 철이 아니라서 자석에 붙지 않아요. 나머지는 모두 철로 만들었어요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a09",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 9,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "선생님이 준비한 밀폐 관찰 상자에서 막대자석 주위의 철가루를 살폈어요. ",
      "concept": "철가루는 양 끝에 많이 붙는다",
      "inquirySkill": "observation",
      "itemType": "single-choice",
      "level": "기본",
      "track": "교과",
      "type": "T05",
      "element": "E2",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "선생님이 준비한 밀폐 관찰 상자에서 막대자석 주위의 철가루를 살폈어요. 철가루가 가장 많이 붙은 곳은 어디인가요?",
    "givens": {
      "안전": "학생이 철가루를 꺼내거나 뿌리는 활동이 아닙니다."
    },
    "choices": [
      "막대자석의 양쪽 끝",
      "막대자석의 한가운데",
      "막대자석의 한쪽 끝만",
      "막대자석 전체에 고르게",
      "막대자석의 옆면 가운데"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "철가루는 극이 있는 양쪽 끝에 가장 많이 붙고 가운데는 거의 붙지 않아요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a10",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 10,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "막대자석을 둘로 나눈 설명 자료입니다. 각 조각에도 N/S극이 있다는 설",
      "concept": "자석을 잘라도 조각마다 두 극이 생긴다",
      "inquirySkill": "prediction with stated conditions",
      "itemType": "single-choice",
      "level": "심화",
      "track": "교과",
      "type": "T06",
      "element": "E2",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "막대자석을 둘로 나눈 설명 자료입니다. 각 조각에도 N/S극이 있다는 설명에 맞는 것은 무엇인가요? 실제로 자석을 자르는 활동은 하지 않습니다.",
    "givens": null,
    "choices": [
      "한 조각은 N극, 다른 조각은 S극만 갖는다",
      "두 조각 모두 자석의 성질을 잃는다",
      "잘린 면에서만 철을 끌어당긴다",
      "원래 N극이 있던 조각만 자석이 된다",
      "조각마다 N극과 S극이 모두 생긴다"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "자석은 아무리 잘라도 조각마다 N극과 S극이 함께 생겨요. 극이 하나만 있는 자석은 없어요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a11",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 11,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "막대에 고리 자석 두 개를 끼웠더니 위쪽 자석이 아래쪽 자석 위에 떠 있",
      "concept": "떠 있는 고리 자석 = 같은 극 마주 봄",
      "inquirySkill": "cause and effect",
      "itemType": "single-choice",
      "level": "심화",
      "track": "교과",
      "type": "T09",
      "element": "E3",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "막대에 고리 자석 두 개를 끼웠더니 위쪽 자석이 아래쪽 자석 위에 떠 있었어요. 그 까닭은 무엇인가요?",
    "givens": null,
    "choices": [
      "두 자석의 크기가 서로 달라서",
      "마주 보는 면이 같은 극이라서",
      "마주 보는 면이 다른 극이라서",
      "막대가 위 자석을 끌어당겨서",
      "위 자석이 아래 자석보다 가벼워서"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "같은 극끼리 밀어 내는 힘이 위쪽 자석을 받쳐서 떠 있어요. 다른 극이었다면 딱 붙었을 거예요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a12",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 12,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "북쪽을 가리키던 나침반의 서쪽에서 막대자석의 N극을 가까이 가져갔어요. ",
      "concept": "다른 극끼리 끌어당겨 바늘이 돈다",
      "inquirySkill": "prediction with stated conditions",
      "itemType": "single-choice",
      "level": "심화",
      "track": "교과",
      "type": "T12",
      "element": "E4",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "북쪽을 가리키던 나침반의 서쪽에서 막대자석의 N극을 가까이 가져갔어요. 나침반 바늘은 어떻게 될까요?",
    "givens": {
      "실험": "나침반 서쪽에서 막대자석의 N극을 가까이 가져간다.",
      "조건": "가까운 막대자석의 영향이 크게 나타나는 평면 설명 모형이며 실제 측정 결과는 아닙니다. N극은 빨간색, S극은 파란색입니다."
    },
    "choices": [
      "바늘이 전혀 움직이지 않는다",
      "빨간색 부분이 북쪽을 계속 가리킨다",
      "바늘이 쉬지 않고 빙글빙글 돈다",
      "빨간색 부분이 동쪽을 가리킨다",
      "파란색 부분이 남쪽을 가리킨다"
    ],
    "visualModel": {
      "kind": "authored-svg",
      "figure": "west-n-approach"
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "바늘의 파란색(S극)이 서쪽의 N극에 끌려가 서쪽을 가리키고, 빨간색(N극)은 반대인 동쪽을 가리켜요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a13",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 13,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "한 개는 막대자석이고 다른 한 개는 자석의 성질을 띠지 않는 철 막대입니",
      "concept": "양 끝과 가운데를 대어 보면 자석을 가릴 수 있다",
      "inquirySkill": "evidence-based conclusion",
      "itemType": "single-choice",
      "level": "영재",
      "track": "영재성",
      "type": "T05",
      "element": "E2",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "한 개는 막대자석이고 다른 한 개는 자석의 성질을 띠지 않는 철 막대입니다. A의 끝을 B의 가운데에 대면 붙고, B의 끝을 A의 가운데에 대면 붙지 않는 가상 관찰에 맞는 것은 무엇인가요?",
    "givens": {
      "결과": "A 끝 → B 가운데: 붙음 / B 끝 → A 가운데: 붙지 않음"
    },
    "choices": [
      "B만 자석이다",
      "A만 자석이다",
      "A와 B 모두 자석이다",
      "A와 B 모두 자석이 아니다",
      "이 실험으로는 알 수 없다"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 1,
      "accepted": [
        1
      ]
    },
    "explanation": "제시한 두 후보와 관찰 조건에서는 A가 자석이라는 근거가 됩니다. 자석의 가운데에서 힘이 언제나 완전히0이라고 일반화하지 않습니다.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a14",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 14,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "우리 생활에서 자석을 이용한 물건이 아닌 것은 어느 것인가요?",
      "concept": "생활 속 자석",
      "inquirySkill": "real-world application",
      "itemType": "single-choice",
      "level": "기본",
      "track": "교과",
      "type": "T13",
      "element": "E4",
      "format": "선택형",
      "standard": "4과09-03",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "우리 생활에서 자석을 이용한 물건이 아닌 것은 어느 것인가요?",
    "givens": null,
    "choices": [
      "냉장고 메모꽂이",
      "가방의 자석 단추",
      "자석 칠판",
      "나침반",
      "고무지우개"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 4,
      "accepted": [
        4
      ]
    },
    "explanation": "고무지우개에는 자석이 없어요. 나머지는 자석이 철이나 다른 자석을 끌어당기는 성질을 이용해요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a15",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 15,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "종이를 몇 장 끼우느냐에 따라 자석이 클립을 끌어당기는 힘이 달라지는지 ",
      "concept": "바꾸는 조건과 같게 할 조건",
      "inquirySkill": "manipulated, responding, and controlled variables",
      "itemType": "single-choice",
      "level": "심화",
      "track": "교과",
      "type": "T03",
      "element": "E1",
      "format": "선택형",
      "standard": "4과09-01",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "종이를 몇 장 끼우느냐에 따라 자석이 클립을 끌어당기는 힘이 달라지는지 알아보려고 해요. 실험에서 다르게 해야 하는 조건은 어느 것인가요?",
    "givens": null,
    "choices": [
      "끼우는 종이의 장수",
      "사용하는 막대자석",
      "매다는 클립의 종류",
      "끼우는 종이의 종류",
      "자석을 가까이 하는 방법"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 0,
      "accepted": [
        0
      ]
    },
    "explanation": "알아보려는 것이 종이 장수의 영향이므로 종이 장수만 바꾸고, 자석·클립·종이 종류·방법은 같게 해야 공정한 실험이에요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a16",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 16,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "극 표시가 지워진 막대자석을 물에 띄웠더니 한쪽 끝이 북쪽을 가리키며 멈",
      "concept": "북쪽을 가리키는 극 = N극",
      "inquirySkill": "evidence-based conclusion",
      "itemType": "single-choice",
      "level": "기본",
      "track": "교과",
      "type": "T10",
      "element": "E4",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "극 표시가 지워진 막대자석을 물에 띄웠더니 한쪽 끝이 북쪽을 가리키며 멈췄어요. 이 끝은 무슨 극인가요?",
    "givens": {
      "조건": "다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 교구입니다."
    },
    "choices": [
      "S극",
      "극이 아니다",
      "N극",
      "N극과 S극 모두",
      "알 수 없다"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "자석이 멈췄을 때 북쪽을 가리키는 극을 N극이라고 해요. 표시가 없어도 이렇게 극을 알아낼 수 있어요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a17",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 17,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "막대자석 S극의 오른쪽에 나침반을 놓았어요. 나침반 바늘은 어떻게 멈출까",
      "concept": "막대자석 S극 옆 나침반",
      "inquirySkill": "diagram interpretation",
      "itemType": "single-choice",
      "level": "심화",
      "track": "교과",
      "type": "T12",
      "element": "E4",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "막대자석 S극의 오른쪽에 나침반을 놓았어요. 나침반 바늘은 어떻게 멈출까요?",
    "givens": {
      "조건": "가까운 막대자석의 영향이 크게 나타나는 평면 설명 모형이며 실제 측정 결과는 아닙니다. N극은 빨간색, S극은 파란색입니다."
    },
    "choices": [
      "빨간색 부분이 동쪽을 가리킨다",
      "파란색 부분이 서쪽을 가리킨다",
      "빨간색 부분이 북쪽을 가리킨다",
      "빨간색 부분이 서쪽을 가리킨다",
      "파란색 부분이 북쪽을 가리킨다"
    ],
    "visualModel": {
      "kind": "authored-svg",
      "figure": "east-of-s"
    },
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "바늘의 빨간색(N극)이 막대자석의 S극에 끌려 서쪽(자석 쪽)을 가리키고, 파란색은 동쪽을 가리켜요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a18",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 18,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "극 표시가 지워진 막대자석이 있어요. 이 자석의 N극이 어느 쪽인지 알아",
      "concept": "극 표시 없는 자석의 극 찾기",
      "inquirySkill": "experiment purpose or hypothesis",
      "itemType": "written-explanation",
      "level": "심화",
      "track": "교과",
      "type": "T08",
      "element": "E3",
      "format": "서술형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "극 표시가 지워진 막대자석이 있어요. 이 자석의 N극이 어느 쪽인지 알아내는 방법을 한 가지 쓰세요.",
    "givens": {
      "조건": "다른 자석·쇠붙이를 멀리하고 수평으로 자유롭게 돌아 멈추는 교구입니다."
    },
    "choices": null,
    "visualModel": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "rubric": {
        "required": [
          "방법(나침반·물에 띄우기·극 표시된 자석 중 하나)",
          "관찰 결과로 극을 판단하는 근거"
        ],
        "pass": "방법과 판단 근거가 모두 있으면 정답",
        "accepted": [
          "물에 띄워 북쪽을 가리키는 끝이 N극",
          "나침반에 가까이 해 바늘의 S극(파란색)이 끌려오는 끝이 N극",
          "극 표시된 자석의 N극에 대어 밀어 내는 끝이 N극"
        ]
      },
      "sample": "자석을 물에 띄운 접시에 올려 두고, 멈췄을 때 북쪽을 가리키는 끝이 N극이에요."
    },
    "explanation": "자석은 북쪽을 가리키는 성질, 같은 극은 밀고 다른 극은 당기는 성질이 있어요. 이 가운데 하나를 쓰고 근거를 함께 적으면 돼요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a19",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 19,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "자석 방충망은 가운데 틈에 자석이 들어 있어 손을 떼면 저절로 닫혀요. ",
      "concept": "자석 방충망의 원리",
      "inquirySkill": "real-world application",
      "itemType": "written-explanation",
      "level": "심화",
      "track": "교과",
      "type": "T13",
      "element": "E4",
      "format": "서술형",
      "standard": "4과09-03",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "자석 방충망은 가운데 틈에 자석이 들어 있어 손을 떼면 저절로 닫혀요. 어떤 자석의 성질을 이용했는지 설명하세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "rubric": {
        "required": [
          "양쪽 자석이 서로 끌어당긴다",
          "다른 극끼리(또는 자석과 철이) 마주 본다"
        ],
        "pass": "끌어당기는 성질 + 마주 보는 극(또는 철) 언급 시 정답"
      },
      "sample": "양쪽 틈에 다른 극끼리 마주 보도록 자석을 넣어서, 서로 끌어당기는 힘으로 닫혀요."
    },
    "explanation": "다른 극끼리는 끌어당기므로, 틈 양쪽에 다른 극이 마주 보게 넣으면 가까워질 때 서로 붙어 닫혀요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a20",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 20,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "크기가 다른 두 막대자석 중 어느 쪽 힘이 센지 클립을 이용해 비교하려고",
      "concept": "자석 세기 비교 실험 설계",
      "inquirySkill": "manipulated, responding, and controlled variables",
      "itemType": "written-explanation",
      "level": "영재",
      "track": "영재성",
      "type": "T03",
      "element": "E1",
      "format": "서술형",
      "standard": "4과09-01",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "크기가 다른 두 막대자석 중 어느 쪽 힘이 센지 클립을 이용해 비교하려고 해요. 실험 방법을 쓰고, 공정하게 비교하려면 같게 해야 할 조건을 두 가지 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "rubric": {
        "required": [
          "매달리는 클립 수(또는 끌려오는 거리)로 비교",
          "같게 할 조건 2개(클립 종류·매다는 방법·자석의 같은 부분(극) 사용 등)"
        ],
        "pass": "측정 방법 1 + 통제 조건 2 모두 있으면 정답"
      },
      "sample": "각 자석의 극에 같은 클립을 하나씩 이어 매달아 몇 개까지 매달리는지 센다. 같은 클립을 쓰고, 두 자석 모두 극 부분에 같은 방법으로 매단다."
    },
    "explanation": "비교하려는 것(자석) 말고는 모두 같게 해야 차이가 자석 때문이라고 말할 수 있어요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a21",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 21,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "선생님이 밀폐 관찰 상자로 보여 준 가상 자료입니다. 막대자석의 두 끝에",
      "concept": "자석의 힘이 미치는 공간(철가루 무늬)",
      "inquirySkill": "observation versus inference",
      "itemType": "written-explanation",
      "level": "영재",
      "track": "영재성",
      "type": "T05",
      "element": "E2",
      "format": "서술형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "선생님이 밀폐 관찰 상자로 보여 준 가상 자료입니다. 막대자석의 두 끝에 철가루가 더 많이 모였고, 종이 위 떨어진 철가루도 움직였습니다. 관찰 사실과 이를 근거로 설명할 수 있는 점을 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "rubric": {
        "required": [
          "관찰: 양쪽 끝(극) 근처에 철가루가 많이 모인다",
          "추론: 자석에서 떨어진 곳에도 힘이 미친다 / 극에서 극으로 이어지는 선 모양"
        ],
        "pass": "관찰 1 + 추론 1 이상이면 정답"
      },
      "sample": "양쪽 끝에 철가루가 가장 많이 모이고, 끝과 끝을 잇는 둥근 선 모양이 생긴다. 자석에 닿지 않은 철가루도 움직였으니 자석의 힘은 떨어진 곳까지 미친다."
    },
    "explanation": "보이는 것(철가루가 모인 곳, 선 모양)과 그것으로 알 수 있는 것(떨어진 곳에도 힘이 미침)을 나누어 써요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a22",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 22,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "자기부상 열차 장난감은 레일과 열차 바닥에 자석이 있어서 열차가 레일 위",
      "concept": "같은 극끼리 밀어 내는 힘으로 뜨는 물체",
      "inquirySkill": "real-world application",
      "itemType": "single-choice",
      "level": "영재",
      "track": "영재성",
      "type": "T07",
      "element": "E3",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "자기부상 열차 장난감은 레일과 열차 바닥에 자석이 있어서 열차가 레일 위에 살짝 떠서 달려요. 열차가 뜨려면 레일과 열차 바닥의 자석을 어떻게 놓아야 할까요?",
    "givens": null,
    "choices": [
      "레일과 열차 바닥이 서로 다른 극으로 마주 보게",
      "레일에만 자석을 두고 열차에는 철판을 붙이게",
      "레일과 열차 바닥이 서로 같은 극으로 마주 보게",
      "열차 바닥의 자석을 나무판으로 모두 감싸게",
      "레일의 자석을 가운데 부분만 열차 쪽으로 향하게"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 2,
      "accepted": [
        2
      ]
    },
    "explanation": "같은 극끼리 밀어 내는 힘이 열차를 위로 받쳐 줘요. 고리 자석 탑이 떠 있는 것과 같은 원리예요.",
    "variantRules": "정답 위치는 배포 시 섞음(정답 letter 재계산).",
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a23",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 23,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "자석의 성질을 이용해 우리 생활의 불편한 점을 해결하는 물건을 떠올려 보",
      "concept": "자석의 성질로 생활 속 불편 해결하기",
      "inquirySkill": "real-world application",
      "itemType": "written-explanation",
      "level": "영재",
      "track": "영재성",
      "type": "T13",
      "element": "E4",
      "format": "서술형",
      "standard": "4과09-03",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "자석의 성질을 이용해 우리 생활의 불편한 점을 해결하는 물건을 떠올려 보세요. 되도록 많이 쓰고, 각각 어떤 성질을 이용했는지 함께 쓰세요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "rubric": {
        "required": [
          "물건 아이디어 3개 이상(유창성)",
          "각 아이디어에 이용한 성질(철을 끌어당김 / 같은 극은 밀고 다른 극은 당김 / 일정한 방향을 가리킴)"
        ],
        "pass": "3개 이상 + 성질 연결",
        "bonus": "남들이 잘 떠올리지 않는 아이디어(독창성), 서로 다른 성질을 골고루 사용(융통성)"
      },
      "sample": "예) 흩어진 철 클립을 모으는 손잡이 도구(철을 끌어당김), 서로 다른 극을 마주 둔 덮개(끌어당김), 곧은 막대에 고리를 끼워 간격을 띄우는 받침(같은 극끼리 밀어 냄)을 구상하겠다. 실제 안전·고정·사용 편의는 추가 확인한다."
    },
    "explanation": "학습용 아이디어 활동입니다. 해결할 불편과 자석의 성질·부품 위치를 연결하고 실제 제작·사용 결과와 구별합니다. 단순히 밀어 낸다는 이유로 가이드 없이 안정되게 떠 있다고 주장하지 않습니다. 공식 학교 배점표가 아닙니다.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a24",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 24,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "극 표시가 없는 둥근기둥 모양 자석이 있어요. 철 클립이 든 상자에 넣었",
      "concept": "철 클립만으로 극 찾기",
      "inquirySkill": "evidence-based conclusion",
      "itemType": "single-choice",
      "level": "심화",
      "track": "교과",
      "type": "T05",
      "element": "E2",
      "format": "선택형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "극 표시가 없는 둥근기둥 모양 자석이 있어요. 철 클립이 든 상자에 넣었다가 꺼냈을 때 극이 있는 곳은 어떻게 알 수 있을까요?",
    "givens": null,
    "choices": [
      "철 클립이 하나도 붙지 않는 곳",
      "철 클립이 고르게 조금씩 붙은 곳",
      "자석의 색깔이 진하게 칠해진 곳",
      "철 클립이 가장 많이 붙어 있는 곳",
      "자석이 가장 무겁게 느껴지는 곳"
    ],
    "visualModel": null,
    "responseContract": "single-choice",
    "answerContract": {
      "type": "single-choice",
      "answer": 3,
      "accepted": [
        3
      ]
    },
    "explanation": "철로 만든 물체가 가장 많이 붙는 곳이 자석의 극이에요. 모양이 달라도 극은 두 곳이에요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a25",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 25,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "나침반 하나와 막대자석 하나가 있어요. 막대자석 주위의 여러 곳에서 나침",
      "concept": "나침반으로 자석 주위 방향 알아보기",
      "inquirySkill": "experiment design",
      "itemType": "written-explanation",
      "level": "영재",
      "track": "영재성",
      "type": "T12",
      "element": "E4",
      "format": "서술형",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "나침반 하나와 막대자석 하나가 있어요. 막대자석 주위의 여러 곳에서 나침반 바늘이 어느 쪽을 가리키는지 알아보는 방법을 순서대로 쓰세요.",
    "givens": {
      "조건": "바늘은 수평으로 자유롭게 움직이고 다른 자석·쇠붙이는 멀리 둡니다. 빨간색으로 정한 N극의 방향을 비교합니다."
    },
    "choices": null,
    "visualModel": null,
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "rubric": {
        "required": [
          "자석을 고정하고 나침반을 여러 자리로 옮겨 방향을 기록하는 계획"
        ],
        "pass": "고정 + 여러 자리 기록 포함 시 정답"
      },
      "sample": "막대자석을 종이 위에 고정하고 둘레를 따라 나침반을 조금씩 옮기면서, 자리마다 빨간 바늘이 가리키는 방향을 화살표로 그린다."
    },
    "explanation": "바꾸는 것은 나침반의 자리 하나뿐이고, 자석은 그대로 두어야 비교할 수 있어요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  },
  {
    "id": "s41-u01-a26",
    "status": "authored",
    "sourceRef": {
      "sourceId": "authored",
      "course": "4-1",
      "unit": "u01",
      "originalNo": 26,
      "type": "authored-practice"
    },
    "taxonomy": {
      "domain": "운동과 에너지",
      "course": "4-1",
      "grade": 4,
      "unit": "u01",
      "topic": "주변의 다른 자석·쇠붙이를 멀리하면 나침반 바늘의 N극은 보통 ( ① )",
      "concept": "가까운 자석이 나침반 바늘 방향을 바꾼다",
      "inquirySkill": "cause and effect",
      "itemType": "cloze",
      "level": "심화",
      "track": "교과",
      "type": "T12",
      "element": "E4",
      "format": "빈칸",
      "standard": "4과09-02",
      "curriculum": "2022 개정",
      "semester": 1
    },
    "prompt": "주변의 다른 자석·쇠붙이를 멀리하면 나침반 바늘의 N극은 보통 ( ① )쪽을 가리켜요. 가까이에 막대자석이 있으면 바늘이 움직여 그 ( ② )의 영향을 받아요.",
    "givens": null,
    "choices": null,
    "visualModel": null,
    "responseContract": "cloze",
    "answerContract": {
      "type": "cloze",
      "blanks": [
        {
          "answer": "북",
          "accepted": [
            "북",
            "북쪽"
          ]
        },
        {
          "answer": "자석",
          "accepted": [
            "자석",
            "자석 있는"
          ]
        }
      ]
    },
    "explanation": "나침반 바늘도 자석이라서, 가까이 있는 자석에 끌리거나 밀려 방향이 바뀌어요. 방향을 찾을 때는 자석을 멀리 두어요.",
    "variantRules": null,
    "evidence": {
      "checkedBy": "Claude",
      "date": "2026-09-19",
      "gates": [
        "science",
        "answer"
      ]
    }
  }
]){const item=items.find(q=>q.id===patch.id);if(!item)throw Error(patch.id);Object.assign(item,patch);}
items.push(...[
  {
    "id": "s41-u01-b01",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "재료를 확인한 시료를 자석에 가까이했습니다. 붙는 후보는 무엇인가요?",
    "givens": null,
    "choices": [
      "나무로 만든 집게",
      "플라스틱 집게",
      "고무로 만든 집게",
      "철로 만든 집게",
      "종이만 접은 집게"
    ],
    "explanation": "제시한 재료 중 철 집게가 붙는 후보이다. 같은 물체 이름이어도 재료가 다르면 결과가 다를 수 있다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b02",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "반짝이는 시료라는 이유만으로 자석에 붙는다고 했습니다. 먼저 확인할 점은 무엇인가요?",
    "givens": null,
    "choices": [
      "재료와 실제 붙는 결과",
      "겉면의 반짝이는 정도만",
      "물체 이름의 글자 수만",
      "사진을 저장한 날짜만",
      "시료를 고른 사람의 키"
    ],
    "explanation": "광택은 자석에 붙는 모든 재료를 구분하는 기준이 아니다. 실제 재료·시료를 확인하고 같은 조건에서 비교한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b03",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "철 테두리와 플라스틱 가운데판으로 된 물체를 조사할 때 알맞은 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "가운데판 결과를 전체로 넓힌다.",
      "한 곳만 대고 모두 같다고 쓴다.",
      "물체 색으로 철인 부분을 정한다.",
      "붙을 것 같은 부분만 기록한다.",
      "부분별로 결과를 나누어 적는다."
    ],
    "explanation": "여러 재료를 쓴 물체는 위치별 재료와 반응을 기록한다. 한 부분의 결과를 전체로 바꾸지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b04",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 모양의 두 시료가 다른 결과를 보였습니다. 자료에 맞는 해석은 무엇인가요?",
    "givens": {
      "비교 표": {
        "caption": "가상 관찰 자료",
        "머리": [
          "확인한 재료",
          "같은 자석에 가까이한 결과"
        ],
        "행": [
          [
            "철",
            "붙음"
          ],
          [
            "알루미늄",
            "붙지 않음"
          ]
        ]
      }
    },
    "choices": [
      "같은 모양이면 재료도 늘 같다.",
      "모양만으로 결과를 정할 수 없다.",
      "반응이 다르면 기록을 버려야 한다.",
      "한 시료의 결과로 모두를 정한다.",
      "새 시료는 살피지 않아도 된다."
    ],
    "explanation": "같은 모양이라도 재료나 상태가 다를 수 있다. 제시한 관찰 범위를 넘어 재료를 확정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b05",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "겉면을 종이로 감싼 물체가 붙었습니다. 자료만으로 할 수 있는 말은 무엇인가요?",
    "givens": {
      "조건": "종이 이외의 부분은 아직 확인하지 않았습니다."
    },
    "choices": [
      "겉의 종이는 모두 자석이 되었다.",
      "속이 무엇인지 보지 않아도 안다.",
      "안쪽 재료는 추가 확인이 필요하다.",
      "붙는 물체의 속은 늘 같은 금속이다.",
      "종이 색이 자석의 극을 정했다."
    ],
    "explanation": "겉의 종이와 내부를 구별한다. 붙는다는 사실만으로 내부 전체의 물질 종류를 단정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b06",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "여러 물체의 재료와 자석 반응을 비교할 때 지킬 일을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "같은 자석과 비슷한 접근 방법을 쓴다.",
      "철 시료에만 다른 자석을 쓴다.",
      "물체 이름이 같으면 결과를 복사한다.",
      "반응하지 않은 시료도 결과를 기록한다.",
      "예상과 다른 관찰은 지워 버린다."
    ],
    "explanation": "비교 조건을 맞추고 실제 결과를 남긴다. 같은 이름·예상만으로 결과를 만들지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b07",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "철 못과 나무 막대 중 자석에 붙는 후보의 재료 이름을 쓰세요.",
    "givens": null,
    "choices": null,
    "explanation": "확인한 두 재료 중 철 시료가 붙는다. 실제 시료는 같은 조건에서 확인한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "철",
      "accepted": [
        "철",
        "쇠"
      ]
    }
  },
  {
    "id": "s41-u01-b08",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T14",
      "standard": "4과09-01",
      "topic": "실제 재료와 부분별 분류",
      "concept": "실제 재료와 부분별 분류",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 부분을 어떻게 조사·기록할지 설명하세요.",
    "givens": {
      "상황": "새 집게의 손잡이는 고무로 감싸져 있고 집게 끝은 금속처럼 보이지만 정확한 재료를 모릅니다."
    },
    "choices": null,
    "explanation": "부분별 근거와 모르는 부분을 구별한다. 조사 계획을 실제 관찰 완료로 세지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "손잡이와 집게 끝을 같은 자석에 같은 방법으로 가까이하여 위치별 재료와 붙는 결과를 따로 적겠다. 안쪽은 보지 못했다고 남기겠다.",
      "rubric": {
        "required": [
          "부분·비교 방법·확인 못 한 범위를 구별한 계획"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u01-b09",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석과 철 클립 사이 거리만 비교하려면 무엇을 같게 해야 하나요?",
    "givens": null,
    "choices": [
      "가까울 때만 클립 종류",
      "멀 때만 쓰는 자석의 수",
      "거리에 따라 바꾸는 바닥",
      "자석·클립·놓는 방법",
      "예상에 맞춰 고치는 결과"
    ],
    "explanation": "거리에 따른 비교에서는 같은 자석·철 클립·방향·바닥 등 나머지 조건을 맞춘다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b10",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료에서 직접 알 수 있는 것은 무엇인가요?",
    "givens": {
      "가상 관찰": "같은 자석과 철 클립을 가까이 놓고 얇은 종이를 사이에 넣어도 클립이 자석 쪽으로 움직였습니다."
    },
    "choices": [
      "얇은 종이가 있어도 당겨졌다.",
      "종이는 어떤 두께여도 모두 같다.",
      "클립이 보이지 않으면 힘이 없다.",
      "먼 거리에서도 반드시 붙는다.",
      "종이가 클립을 밀어 낸 것이다."
    ],
    "explanation": "제시한 가까운 거리와 얇은 종이 조건의 결과를 해석한다. 모든 두께·거리로 일반화하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b11",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두꺼운 판을 넣자 철 클립이 움직이지 않았습니다. 타당한 다음 생각은 무엇인가요?",
    "givens": null,
    "choices": [
      "그 판은 어떤 자석도 막는다고 한다.",
      "자석의 힘이 완전히0이라고 쓴다.",
      "붙지 않은 기록은 모두 지워 버린다.",
      "판의 색만 바꿔 결론을 확정한다.",
      "거리·두께 조건을 더 확인한다."
    ],
    "explanation": "움직임이 없었다는 관찰과 힘이 전혀 없다는 결론은 다르다. 바뀐 간격·판 두께·고정 상태 등을 확인한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b12",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석 종류와 종이 장수를 함께 바꾸면 생기는 문제는 무엇인가요?",
    "givens": null,
    "choices": [
      "조건이 늘어날수록 원인이 확정된다.",
      "무엇에 따른 차이인지 가리기 어렵다.",
      "어느 결과든 종이 때문이라고 안다.",
      "기록하지 않아도 원인을 알 수 있다.",
      "관찰 횟수만 쓰면 조건은 필요 없다."
    ],
    "explanation": "두 조건을 함께 바꾸면 어느 차이가 결과와 관련되는지 분리하기 어렵다. 알아보려는 조건 외에는 같게 한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b13",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "철 클립을 끌어당긴 거리를 비교한 기록으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "잘 붙은 한 번만 골라 적는다.",
      "재지 않은 값을 같은 수로 채운다.",
      "같은 기준점과 실제 단위를 적는다.",
      "눈금 대신 자석의 색만 적는다.",
      "다른 클립 결과를 내 결과로 쓴다."
    ],
    "explanation": "기준점·단위·실제 측정과 반복 결과를 확인한다. 재지 않은 값을 만들어 내지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b14",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "얇은 판 유무만 비교하는 계획에서 필요한 일을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "판이 있을 때만 더 센 자석을 쓴다.",
      "같은 자석·클립과 접근 방법을 쓴다.",
      "판이 없을 때는 결과를 예상으로 적는다.",
      "붙지 않은 경우는 시험 횟수에서 뺀다.",
      "판 두께와 실제 관찰을 함께 남긴다."
    ],
    "explanation": "시료·방법·간격을 확인하고 판의 조건과 실제 결과를 기록한다. 물체에 닿지 않아도 힘이 작용할 수 있다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b15",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석을 더 가까이 또는 더 멀리 놓는 비교에서 바꾸는 조건은 자석과 클립 사이의 무엇인가요?",
    "givens": null,
    "choices": null,
    "explanation": "자석·클립을 같게 두고 사이 거리를 바꾸는 비교이다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "거리",
      "accepted": [
        "거리"
      ]
    }
  },
  {
    "id": "s41-u01-b16",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E1",
      "type": "T15",
      "standard": "4과09-01",
      "topic": "거리·사이 판의 비교 조건",
      "concept": "거리·사이 판의 비교 조건",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료에 맞는 결론과 더 확인할 점을 설명하세요.",
    "givens": {
      "비교 표": {
        "caption": "가상 관찰 자료",
        "머리": [
          "같은 자석·클립·가까운 거리",
          "관찰"
        ],
        "행": [
          [
            "종이 없음",
            "움직임"
          ],
          [
            "얇은 종이 한 장",
            "움직임"
          ]
        ]
      }
    },
    "choices": null,
    "explanation": "한 결과를 모든 두께로 넓히지 않는다. 가상 자료를 학생의 실제 관찰로 바꾸어 기록하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "이 조건에서는 종이 한 장을 넣어도 클립이 움직였다. 같은 자석과 클립을 유지하고 종이 장수를 바꾸며 거리와 실제 움직임을 다시 기록하겠다.",
      "rubric": {
        "required": [
          "자료 조건의 결론과 추가 비교 계획"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u01-b17",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "N극과 N극을 가까이한 두 막대자석 사이에 나타나는 힘은 무엇인가요?",
    "givens": null,
    "choices": [
      "서로 녹여 버리는 힘",
      "색을 같게 바꾸는 힘",
      "항상 붙게 하는 힘",
      "서로 밀어 내는 힘",
      "극 하나를 없애는 힘"
    ],
    "explanation": "같은 극끼리는 서로 밀어 낸다. 제시한 두 극 교구의 가까운 두 끝을 비교한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b18",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "S극에 밀려난 막대자석의 끝은 어떤 극인가요?",
    "givens": null,
    "choices": [
      "S극",
      "N극",
      "극이 없는 부분",
      "색을 보아야만 아는 극",
      "두 극이 사라진 부분"
    ],
    "explanation": "같은 극끼리 밀어 내므로 S극과 마주한 끝은 S극이다. 색만으로 극을 정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b19",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "막대에 끼운 같은 고리 자석이 떠 있는 까닭으로 알맞은 것은 무엇인가요?",
    "givens": {
      "조건": "넓은 위·아래 면이 N/S극인 고리 자석과 비자성 막대를 사용합니다."
    },
    "choices": [
      "다른 극이 서로 밀어 내기 때문이다.",
      "색이 밝은 고리만 뜨기 때문이다.",
      "가운데 구멍에서 바람이 나기 때문이다.",
      "막대가 모든 자석을 끌어당기기 때문이다.",
      "마주 보는 같은 극이 밀어 낸다."
    ],
    "explanation": "같은 극의 밀어 내는 힘이 위 고리를 받치고 막대가 옆 움직임을 제한하는 교구이다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b20",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "탑 높이를 마주 보는 극에 따라 비교할 때 고칠 계획은 무엇인가요?",
    "givens": null,
    "choices": [
      "높은 탑에만 고리를 더 넣는다.",
      "고리 수와 받침을 같게 한다.",
      "낮은 탑에만 받침을 더 높인다.",
      "두 탑의 고리를 다른 크기로 바꾼다.",
      "예상한 높이만 쓰고 자를 쓰지 않는다."
    ],
    "explanation": "극 배치에 따른 높이를 보려면 같은 고리·개수·받침·기준점을 사용한다. 개수나 받침 높이를 섞지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b21",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고리의 바깥 색만으로 N극을 정할 수 있나요?",
    "givens": null,
    "choices": [
      "빨갛지 않은 제품에는 극이 없다.",
      "노란 고리는 모두 같은 극이다.",
      "알려진 극과 힘을 비교해야 한다.",
      "구멍이 큰 쪽은 언제나N극이다.",
      "같은 색이면 확인 없이N극이다."
    ],
    "explanation": "색상은 제품 표시 방식일 수 있다. 극이 표시된 기준 자석과 반응하거나 올바른 방향 관찰로 확인한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b22",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 두 극 교구의 극을 알아볼 때 맞는 생각을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "자석 색이 같으면 비교를 생략한다.",
      "어느 면이든 가까이하면 늘 밀어 낸다.",
      "기준 자석과 밀어 내면 같은 극이다.",
      "기준 자석과 끌어당기면 다른 극이다.",
      "자석을 깨뜨려야만 극을 알 수 있다."
    ],
    "explanation": "극을 아는 기준 자석과 비교한다. 실제 절단·파손이나 색만으로 판단하는 활동은 요구하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
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
    "id": "s41-u01-b23",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "N극-N극 또는 S극-S극처럼 이름이 같은 두 극을 무엇이라고 하나요?",
    "givens": null,
    "choices": null,
    "explanation": "같은 극끼리는 밀어 내고 다른 극끼리는 끌어당긴다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "같은 극",
      "accepted": [
        "같은 극",
        "같은극"
      ]
    }
  },
  {
    "id": "s41-u01-b24",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T16",
      "standard": "4과09-02",
      "topic": "극의 상호작용과 고리 탑",
      "concept": "극의 상호작용과 고리 탑",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "고리 하나를 뒤집어 비교하려고 합니다. 무엇을 기록하고 어떻게 설명할지 쓰세요.",
    "givens": null,
    "choices": null,
    "explanation": "실제 관찰 전에는 결과를 수행 기록으로 채우지 않는다. 가이드가 있는 고리 탑의 조건으로 설명한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "같은 고리와 막대를 쓰고 뒤집기 전후에 마주 보는 극·틈·높이를 같은 기준에서 적겠다. 밀어 내는 배치와 붙는 배치를 자료에 연결하겠다.",
      "rubric": {
        "required": [
          "같은 교구의 극 배치·관찰·설명을 연결한 비교 계획"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u01-b25",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "방향을 찾으려고 나침반을 놓을 장소로 알맞은 곳은 어디인가요?",
    "givens": null,
    "choices": [
      "자석 필통에 바싹 붙인 좁은 자리",
      "자석 두 개 사이에 끼운 기울어진 곳",
      "철 집게로 바늘을 잡아 둔 책상 위",
      "자석·쇠붙이에서 떨어진 평평한 곳",
      "손으로 계속 흔들며 이동하는 자리"
    ],
    "explanation": "바늘이 수평으로 자유롭게 돌아 멈추게 하고 가까운 자석·쇠붙이의 영향을 줄인다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b26",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "빨간색으로 정한 N극이 있는 바늘을 봅니다. 무엇을 확인해야 색의 뜻을 알 수 있나요?",
    "givens": null,
    "choices": [
      "그 교구의 극 표시와 범례",
      "빨간색인 모든 물체의 무게",
      "그림을 인쇄한 종이의 향기",
      "나침반을 산 사람의 생년월일",
      "바늘과 관계없는 손잡이 모양"
    ],
    "explanation": "이 교구의 색상과 극 표시를 확인한다. 모든 제품에 같은 색 규칙이 있다고 단정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b27",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "막대자석을 가까이하자 바늘 방향이 달라졌습니다. 그 까닭은 무엇인가요?",
    "givens": null,
    "choices": [
      "바늘은 종이이므로 늘 가벼워진다.",
      "막대자석이 모든 바늘을 밀기만 한다.",
      "바늘의 색만 공중에서 이동한 것이다.",
      "다른 방향이면 고장이 확정된 것이다.",
      "바늘도 자석이어서 힘을 받는다."
    ],
    "explanation": "바늘도 작은 자석이므로 가까운 자석과 밀거나 당기는 힘이 작용한다. 실제 각도는 조건별로 관찰한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b28",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "막대자석 주위의 자리별 바늘 방향을 비교하려면 무엇을 해야 하나요?",
    "givens": null,
    "choices": [
      "자석과 나침반을 함께 돌려 버린다.",
      "자석을 고정하고 나침반만 옮긴다.",
      "자리마다 자석의 극을 바꾸어 놓는다.",
      "멈추기 전에 예상 화살표를 적는다.",
      "한 자리의 기록을 전부에 복사한다."
    ],
    "explanation": "바꾸는 위치와 고정할 자석을 구별한다. 바늘이 멈춘 실제 방향을 자리와 함께 기록한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b29",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "설명 그림의 바늘 각도가 실제 관찰과 조금 달랐습니다. 알맞은 기록은 무엇인가요?",
    "givens": null,
    "choices": [
      "그림과 맞게 관찰을 고쳐 적는다.",
      "다른 각도는 항상 실험 실패다.",
      "실제 각도와 주변 조건을 적는다.",
      "그림의 화살표만 내 결과로 옮긴다.",
      "각도가 다르면 모든 자석은 가짜다."
    ],
    "explanation": "단순한 설명 모형과 실제 관찰을 구별한다. 놓은 자리·거리·쇠붙이 등 조건을 확인한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b30",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나침반 자료를 해석한 설명으로 맞는 것을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "가까운 다른 자석이 방향에 영향을 준다.",
      "N극의 색은 모든 제품에서 반드시 같다.",
      "방향이 다르면 건강 상태를 알 수 있다.",
      "같은 바늘은 어디서나 한 각도만 나온다.",
      "바늘의 실제 방향은 멈춘 뒤 기록한다."
    ],
    "explanation": "바늘은 자석이며 가까운 자석과의 상호작용과 실제 관찰 조건을 함께 본다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
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
    "id": "s41-u01-b31",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "나침반 바늘은 작은 무엇이어서 다른 자석의 영향을 받나요?",
    "givens": null,
    "choices": null,
    "explanation": "바늘도 자석이므로 가까운 자석과 밀거나 끌어당기는 힘이 작용한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "자석",
      "accepted": [
        "자석",
        "작은 자석"
      ]
    }
  },
  {
    "id": "s41-u01-b32",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T17",
      "standard": "4과09-02",
      "topic": "나침반의 조건과 설명 모형",
      "concept": "나침반의 조건과 설명 모형",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "친구가 바늘 방향을 그림과 같게 고쳐 쓰자고 합니다. 어떻게 답하겠어요?",
    "givens": null,
    "choices": null,
    "explanation": "예상과 다른 결과도 증거로 남긴다. 결과를 꾸며 그림과 일치시키지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "그림은 설명 자료이므로 내 관찰을 바꾸지 않겠다. 자석과 나침반의 자리·거리·다른 쇠붙이를 기록하고 다시 놓아 관찰한 방향을 따로 비교하겠다.",
      "rubric": {
        "required": [
          "설명 모형과 실제 관찰을 구별한 재확인 계획"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u01-b33",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "철 클립을 바닥에서 한꺼번에 모으는 도구의 설계 목적은 무엇인가요?",
    "givens": null,
    "choices": [
      "클립의 색만 무조건 바꾸기",
      "철 클립을 모두 나무로 만들기",
      "관찰하지 않고 성공 사진 만들기",
      "흩어진 클립을 편리하게 모으기",
      "자석이란 말을 크게 적어 놓기"
    ],
    "explanation": "해결할 생활의 불편과 사용자 행동을 목적에 연결한다. 단어·외형만으로 편리함을 판단하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b34",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "설계에 앞서 사용자에게 물을 내용으로 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "언제 무엇을 다루기 불편한가요?",
      "정답 예시를 그대로 써 줄까요?",
      "내 그림은 무조건 좋다고 할까요?",
      "쓰지 않아도 성공이라고 할까요?",
      "자석의 색만 정하면 끝날까요?"
    ],
    "explanation": "사용 상황·어려움·필요를 확인해야 목적에 맞는 장치를 구상할 수 있다. 실제로 받은 의견만 기록한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b35",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "사진을 붙이는 메모 도구의 목적과 성질을 연결한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "종이 색이 같으면 스스로 고정된다.",
      "나무판은 어떤 자석에도 꼭 붙는다.",
      "철판을 그리면 실제로 붙게 된다.",
      "자석을 적기만 하면 설계는 끝난다.",
      "철판에 붙는 힘으로 종이를 잡는다."
    ],
    "explanation": "철판과 자석 사이 끌어당김을 종이 고정에 이용하는 구조이다. 실제 두께·힘·고정 안전은 더 확인한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b36",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석 장치를 설계했다는 기록으로 타당한 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "실제로 만들지 않아도 시험했다고 썼다.",
      "배치·성질·쓸 상황을 설명했다.",
      "친구가 쓴 횟수를 내 제작으로 바꿨다.",
      "아직 없던 사용자 의견을 채워 넣었다.",
      "성질 없이 예쁜 이름만 적어 끝냈다."
    ],
    "explanation": "설계는 목적·구조·성질의 연결을 설명하는 일이다. 이 성취기준의 설계가 반드시 실제 제작까지 요구하는 것은 아니다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b37",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "교실의 불편을 설계 문제로 바르게 바꾼 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "친구가 자석을 좋아한다고 정할까?",
      "색이 같으면 같은 장치라고 할까?",
      "철 클립을 흘리지 않게 모으려면?",
      "성공한 것처럼 보고서를 꾸밀까?",
      "장치 이름을 길게만 늘여 볼까?"
    ],
    "explanation": "생활 상황의 구체적인 불편을 해결할 질문으로 바꾼다. 사용자의 요구를 확인하고 적합한 성질을 고른다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b38",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석 장치의 설계 목적에 포함하면 좋은 내용을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "사용하지 않은 결과를 성공으로 적기",
      "도구를 쓰는 사람이 겪는 불편",
      "어떤 상황에서 어떻게 쓸지",
      "근거 없는 친구 반응으로 점수 정하기",
      "물체 이름의 글자 수만 늘리기"
    ],
    "explanation": "대상·상황·불편과 기대 쓰임새를 연결해 목적을 정한다. 실제 수행이나 평가 결과를 만들지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
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
    "id": "s41-u01-b39",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "장치를 쓰는 사람이 겪는 어려움을 “생활의 □을 줄인다”라고 표현할 때 □에 들어갈 말을 쓰세요.",
    "givens": null,
    "choices": null,
    "explanation": "생활을 편리하게 하는 장치는 사용자·상황의 구체적인 불편을 해결하도록 구상한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "불편",
      "accepted": [
        "불편"
      ]
    }
  },
  {
    "id": "s41-u01-b40",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T18",
      "standard": "4과09-03",
      "topic": "생활의 불편과 설계 목적",
      "concept": "생활의 불편과 설계 목적",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "교실에서 해결할 불편 하나와 자석을 이용한 장치 아이디어를 연결해 쓰세요.",
    "givens": null,
    "choices": null,
    "explanation": "타당한 여러 설계를 선생님과 확인한다. 설계를 실제 제작 성공이나 공식 점수로 바꾸지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "정리할 때 철 클립이 흩어지는 불편을 줄이려고, 손잡이 끝에 자석을 고정한 수거 도구를 구상하겠다. 작은 부품이 빠지지 않는지와 놓는 방법은 더 확인하겠다.",
      "rubric": {
        "required": [
          "생활의 불편·사용 장면·자석 성질이 연결된 아이디어"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u01-b41",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "철 메모판에 종이를 잡는 도구에서 자석과 짝이 되는 부품은 무엇인가요?",
    "givens": null,
    "choices": [
      "나무만으로 만든 판",
      "종이만으로 접은 판",
      "고무만으로 만든 판",
      "철로 만든 메모판",
      "플라스틱만 만든 판"
    ],
    "explanation": "제시한 후보에서는 철판이 자석에 붙어 종이를 잡는 구조의 후보이다. 실제 제품은 재료를 확인한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b42",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석 두 개로 맞붙는 덮개를 구상했습니다. 마주 보게 할 극은 무엇인가요?",
    "givens": null,
    "choices": [
      "서로 다른 극",
      "두N극만 같은 쪽",
      "두S극만 같은 쪽",
      "자석 색이 같은 면만",
      "극 표시 없는 부분만"
    ],
    "explanation": "다른 극끼리 끌어당기는 성질을 이용한다. 두 자석 대신 자석과 철판을 쓰는 구조와 구별한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b43",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "설계도에 자석만 그리고 종이를 붙일 판은 적지 않았습니다. 보완할 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "도구 이름의 글자 수만",
      "그림 테두리의 무늬만",
      "확인하지 않은 사용자 점수",
      "예상한 성공 횟수의 합계",
      "붙일 판의 재료와 위치"
    ],
    "explanation": "성질이 작용할 상대 물체의 재료·배치가 있어야 힘과 쓰임새의 연결을 검토할 수 있다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b44",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "같은 극끼리 밀어 내는 장치에서 가이드를 넣는 이유는 무엇인가요?",
    "givens": {
      "구조": "곧은 막대에 고리 자석을 끼운 설명 모형입니다."
    },
    "choices": [
      "자석이 어떤 물체에나 붙게 한다.",
      "옆으로 벗어나는 움직임을 잡는다.",
      "같은 극을 다른 극으로 바꾼다.",
      "자석의 크기를 저절로 키운다.",
      "표시한N극을 완전히 없앤다."
    ],
    "explanation": "가이드는 옆 움직임을 제한한다. 밀어 내는 힘만으로 가이드 없는 안정한 공중 부양이 보장되지는 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b45",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "재료 이름이 같아도 붙는 정도가 달라질 수 있습니다. 설계에 알맞은 판단은 무엇인가요?",
    "givens": null,
    "choices": [
      "재료 이름만 같으면 강도도 늘 같다.",
      "두꺼운 종이도 무조건 붙는다고 한다.",
      "쓸 시료와 배치를 실제로 확인한다.",
      "실제 조건은 기록하지 않아도 된다.",
      "붙지 않은 시험은 몰래 제외한다."
    ],
    "explanation": "자석 세기·간격·시료·고정·마찰 등 실제 조건을 확인한다. 이름만으로 기능 성공을 확정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b46",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자석 덮개의 부품 배치를 설명할 때 필요한 내용을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "양쪽에 자석인지 철판인지 구별한다.",
      "색이 같으면 재료 설명을 생략한다.",
      "붙지 않아도 결과를 성공으로 고친다.",
      "끌어당길 두 부분의 위치를 표시한다.",
      "자석을 손가락 사이에서 세게 충돌시킨다."
    ],
    "explanation": "실제 재료와 힘이 작용하는 상대·위치를 설명해야 설계를 검토할 수 있다. 손 끼임·파손을 줄이는 구조도 고려한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b47",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "N극과 S극처럼 서로 이름이 다른 두 극은 “□끼리 끌어당긴다”의 □에 무엇이라고 쓰나요?",
    "givens": null,
    "choices": null,
    "explanation": "서로 다른 극끼리 끌어당기는 성질을 덮개 등 장치에 연결할 수 있다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "다른 극",
      "accepted": [
        "다른 극",
        "다른극"
      ]
    }
  },
  {
    "id": "s41-u01-b48",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T19",
      "standard": "4과09-03",
      "topic": "부품·재료와 힘의 연결",
      "concept": "부품·재료와 힘의 연결",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "두 후보 중 하나를 골라 힘이 작용하는 두 부분과 추가 확인점을 설명하세요.",
    "givens": {
      "후보": "가: 자석+철판. 나: 서로 다른 극을 마주 놓은 자석 두 개. 둘 다 종이를 잡는 구조를 구상합니다."
    },
    "choices": null,
    "explanation": "여러 타당한 후보를 허용한다. 두 부품이 자석인지 철인지 구별하고 제시 조건 밖 성공을 단정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "철판과 자석을 마주 놓는 후보를 고르겠다. 자석이 철판을 끌어당겨 종이를 잡을 수 있다. 종이 두께와 자석 고정·손 끼임을 실제로 더 확인하겠다.",
      "rubric": {
        "required": [
          "부품·상대 물체·자석 성질을 연결한 근거와 확인점"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u01-b49",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "배치 메모를 읽고 더 필요한 내용을 고르세요.",
    "givens": {
      "설계 메모": "철판 앞에 종이를 놓고 그 위에 작은 자석을 대어 메모를 고정합니다. 자석의 고정·보관 방법은 아직 쓰지 않았습니다."
    },
    "choices": [
      "실제로 못 들은 칭찬",
      "아직 재지 않은 성공 시간",
      "사용하지 않은 횟수 기록",
      "자석을 고정할 방법",
      "다른 사람의 제작 사진"
    ],
    "explanation": "기능을 구상하려면 부품이 빠지거나 움직이지 않도록 고정할 방법이 필요하다. 실제 결과와 계획을 구별한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b50",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "설계에 화살표를 붙일 때 알맞은 설명은 무엇인가요?",
    "givens": null,
    "choices": [
      "움직일 부분과 방향을 함께 쓴다.",
      "화살표만 그리면 시험을 마친다.",
      "관찰 전 모든 방향을 성공으로 적는다.",
      "자석 색과 같은 방향만 허용한다.",
      "쓸 상황을 지우고 무늬만 더한다."
    ],
    "explanation": "배치·상대 물체·움직일 방향을 언어와 그림으로 연결한다. 화살표는 구상이며 실제 운동 기록을 대신하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b51",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "학생이 작은 자석을 입에 물고 고정하자고 했습니다. 보완할 내용은 무엇인가요?",
    "givens": null,
    "choices": [
      "입에 넣은 뒤 시험 여부를 정하기",
      "작은 자석이면 먹어도 된다고 쓰기",
      "친구 입속에서 붙는지 비교하기",
      "입에 문 사진을 성공 자료로 쓰기",
      "입에 넣지 않는 안전한 고정 방법"
    ],
    "explanation": "작은 자석을 입·코·귀에 넣지 않고 교사와 안전한 고정·보관을 계획한다. 설계가 위험 행동을 요구해서는 안 된다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b52",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "뜨는 고리 장치 그림에서 빠진 부품을 고르세요.",
    "givens": {
      "설계 메모": "같은 극이 마주 보는 고리 두 개를 그렸지만, 옆으로 벗어나지 않게 할 구조는 없습니다."
    },
    "choices": [
      "색만 바꾼 자석 이름표",
      "옆 움직임을 잡는 가이드",
      "고리와 관계없는 꽃 그림",
      "재지 않은 높이를 적은 숫자",
      "확인하지 않은 칭찬 스티커"
    ],
    "explanation": "같은 극의 밀어 내는 힘과 옆 움직임을 제한하는 구조를 함께 설명한다. 실제 안정성을 시험하지 않고 확정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b53",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "용도에 맞는 설계 설명으로 가장 알맞은 것은 무엇인가요?",
    "givens": null,
    "choices": [
      "자석이라는 단어만 크게 적는다.",
      "친구에게 예쁘다는 말만 받는다.",
      "부분·재료·위치·성질을 잇는다.",
      "확인하지 않은 결과를 먼저 쓴다.",
      "만든 사람 이름만 남기고 지운다."
    ],
    "explanation": "생활 장치의 목적과 각 부품에 이용한 자석의 성질을 연결하면 다른 사람이 구상을 검토할 수 있다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b54",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "장치의 설계 설명에 포함할 내용을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "가짜 사용자 의견을 실제 말로 쓰기",
      "철이나 자석이 놓일 자리",
      "그림만 보고 공식 성적을 확정하기",
      "위험한 충돌을 성공 조건으로 쓰기",
      "실제 사용할 때의 안전한 고정·보관"
    ],
    "explanation": "설계는 부품 배치·기능·안전을 검토하도록 구체적으로 설명한다. 예쁘게 그렸다는 것만으로 기능이 검증되지는 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b55",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "목적과 부품 배치·성질을 구상해 설명하는 일은 장치의 무엇인가요?",
    "givens": null,
    "choices": null,
    "explanation": "교육부 성취기준은 자석의 성질을 이용한 생활 장치 설계를 다룬다. 모든 설계가 반드시 실제 제작으로 이어져야 하는 것은 아니다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "설계",
      "accepted": [
        "설계"
      ]
    }
  },
  {
    "id": "s41-u01-b56",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T20",
      "standard": "4과09-03",
      "topic": "배치·안전·설계 설명",
      "concept": "배치·안전·설계 설명",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "설계 메모를 다른 사람이 검토할 수 있도록 보완해 쓰세요.",
    "givens": {
      "초안": "상자에 자석을 넣어서 클립을 편리하게 쓸 수 있게 한다."
    },
    "choices": null,
    "explanation": "여러 타당한 배치를 허용하며 계획과 실제 시험 결과를 구별한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "상자 입구 가까이에 자석을 단단히 고정하고 철 클립을 잡는 구조라고 쓰겠다. 입구 크기·클립을 떼는 방법·작은 자석이 빠지지 않게 보관할 방법도 표시하겠다.",
      "rubric": {
        "required": [
          "목적·부품 위치·힘의 연결과 안전을 설명한 보완"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  },
  {
    "id": "s41-u01-b57",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "제작 전 설계의 타당성을 확인하는 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "실제 제작 성공으로 먼저 기록한다.",
      "그림을 저장한 횟수를 시험으로 센다.",
      "친구가 써 본 것처럼 의견을 만든다.",
      "목적과 부품·성질 연결을 검토한다.",
      "자석을 적으면 모든 검토를 생략한다."
    ],
    "explanation": "설계 단계에서도 목적·구조·성질과 안전을 검토할 수 있다. 아직 하지 않은 제작·사용을 수행 완료로 세지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b58",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "재료의 배치를 바꾼 두 후보를 비교하려면 무엇이 필요한가요?",
    "givens": null,
    "choices": [
      "같은 사용 조건과 판단 기준",
      "후보마다 다른 물체와 다른 방법",
      "잘 나온 한 결과만 남기는 규칙",
      "예상과 맞게 고친 성공 횟수만",
      "다른 친구가 만든 결과를 복사하기"
    ],
    "explanation": "같은 종이·클립·사용 방법 등 조건과 비교할 기능을 정한다. 실제 시험이 없다면 확인 계획으로 남긴다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b59",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "자료에 맞는 개선 의견은 무엇인가요?",
    "givens": {
      "비교 표": {
        "caption": "가상 관찰 자료",
        "머리": [
          "같은 자석·철판 배치",
          "가상 관찰"
        ],
        "행": [
          [
            "얇은 종이",
            "잡혀 있음"
          ],
          [
            "더 두꺼운 종이",
            "떨어짐"
          ]
        ]
      }
    },
    "choices": [
      "모든 두께에서 성공했다고 발표한다.",
      "작동하지 않은 기록을 버려 버린다.",
      "두꺼운 종이를 이름만 바꿔 성공시킨다.",
      "재료 확인 없이 실제 판매를 시작한다.",
      "두께 조건과 붙는 결과를 더 확인한다."
    ],
    "explanation": "같은 두께 조건에서 얻은 실제 결과의 범위를 지키며 다음 비교와 고정 방법을 검토한다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b60",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "그림은 완성했지만 시험하지 않았습니다. 기록 방법은 무엇인가요?",
    "givens": null,
    "choices": [
      "그림을 만들면 사용 성공으로 적는다.",
      "설계 완료와 시험 계획을 구별한다.",
      "계획한 횟수를 실제 시험으로 바꾼다.",
      "다른 날의 결과를 오늘 기록에 넣는다.",
      "시험하지 않은 것을 실패로 확정한다."
    ],
    "explanation": "설계·제작·시험·미실행을 나누어 기록한다. 아직 하지 않았다는 사실을 성공이나 실패로 바꾸지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b61",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "친구가 고정 방법을 더 알려 달라고 질문했습니다. 다음 행동은 무엇인가요?",
    "givens": {
      "자료": "학습용으로 만든 가상 질문입니다."
    },
    "choices": [
      "묻지 않은 반응을 추가해 채운다.",
      "질문이 있으니 친구가 틀렸다고 한다.",
      "질문과 보완할 배치를 연결한다.",
      "설명 없이 모두 이해했다고 적는다.",
      "듣기 어려운 질문을 기록에서 지운다."
    ],
    "explanation": "실제 질문을 설계 설명과 연결해 보완한다. 가상 질문이면 실제 협력적 소통을 마친 증거로 세지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
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
    "id": "s41-u01-b62",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "선택형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "설계를 검토하고 고칠 때 타당한 기록을 고르세요. (정답2개)",
    "givens": null,
    "choices": [
      "미기록을 무조건 미실천으로 바꾼다.",
      "설계 저장 횟수를 사용자 수로 센다.",
      "실제로 확인한 점과 모르는 점을 나눈다.",
      "시험 결과 없이 안전을 보장한다.",
      "변경 이유와 다음 확인 방법을 적는다."
    ],
    "explanation": "알고 있는 근거와 미확인·계획을 구별해야 검토와 개선 과정을 설명할 수 있다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "multi-choice",
    "answerContract": {
      "type": "multi-choice",
      "answers": [
        2,
        4
      ]
    }
  },
  {
    "id": "s41-u01-b63",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "단답형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "실제로 시험하기 전에 적은 앞으로의 확인 방법은 시험 “결과”와 “계획” 중 무엇인가요?",
    "givens": null,
    "choices": null,
    "explanation": "앞으로 할 일과 이미 관찰한 결과를 구별한다. 계획이 있다는 이유로 실제 수행을 완료했다고 쓰지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "short-text",
    "answerContract": {
      "type": "short-text",
      "answer": "계획",
      "accepted": [
        "계획",
        "시험 계획"
      ]
    }
  },
  {
    "id": "s41-u01-b64",
    "status": "authored",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "현재 범위 보충 학습",
      "course": "초등4-1",
      "unit": "자석의 이용"
    },
    "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 4,
      "semester": 1,
      "unit": "u01",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T21",
      "standard": "4과09-03",
      "topic": "확인 계획과 근거 있는 개선",
      "concept": "확인 계획과 근거 있는 개선",
      "inquirySkill": "조건·관찰 근거와 설계 이유를 연결해 설명하기",
      "format": "서술형",
      "level": "기본",
      "track": "교과"
    },
    "prompt": "가상 기록을 근거로 확인된 단계와 다음 보완을 설명하세요.",
    "givens": {
      "가상 기록": "설계 그림을 완성했습니다. 자료 속 친구가 고정 방법을 물었습니다. 아직 만들거나 시험하지 않았습니다."
    },
    "choices": null,
    "explanation": "열린 설명을 선생님과 확인한다. 가상 자료의 답을 실제 학생 제작·소통·공식 성적으로 확정하지 않는다.",
    "evidence": {
      "checkedBy": "창작 문항 검수",
      "date": "2026-10-18",
      "gates": [
        "science",
        "answer"
      ],
      "against": "교육부4과09-01~03·자체 이론/실험 확인 본문",
      "note": "가상 자료 응답·설계 계획이며 실제 수행과 공식 배점표가 아니다."
    },
    "responseContract": "written-explanation",
    "answerContract": {
      "type": "written-explanation",
      "sample": "설계 그림을 완성했고 고정 방법을 질문받은 것만 자료에서 확인된다. 실제 시험은 아직 하지 않았다. 고정 부품과 작은 자석 보관을 보완하고, 실제 확인한다면 같은 조건에서 작동과 안전을 기록하겠다.",
      "rubric": {
        "required": [
          "설계·가상 의견·미시험·다음 확인을 구별한 개선 설명"
        ],
        "criteria": [
          "직접 작성한 학습용 확인 기준이며 공식 배점표가 아니다."
        ],
        "pass": "선생님과 근거·조건·설명의 연결을 확인한다."
      }
    }
  }
]);
