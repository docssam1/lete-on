// GFIELD 실험 과학 영재 — 4-1 · 실험 1 「둥실 고리 자석 탑」 (교과 연계: 4-1 Ⅰ 자석의 이용)
// 단원 3D 실험실(explore.lab kind: 'ring-tower')과 같은 실험을 종이 교재로 옮겼다. 글과 그림은 새로 만들었다.
// 단원평가 원문은 쓰지 않는다. 교과 확인 문제·형성평가는 우리 유사문항(s41-u01.similar.js)에서 고른다.
// a: 교사용에만 보이는 예시 답·해설. rubric: 채점 기준.
// 그림 색 규칙: N극 = 빨강(#E24B4A), S극 = 파랑(#3A6BC6) — 색만으로 뜻을 전하지 않게 늘 N/S 글자를 함께 쓴다.
// 극을 밝히지 않은 고리(도입·과정 그림)는 실제 페라이트 자석처럼 짙은 회색으로 그린다.

const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" font-family="Pretendard, 'Noto Sans KR', sans-serif">${body}</svg>`;
const NC = '#E24B4A', SC = '#3A6BC6', INK = '#1E3A78', SUB = '#5B6577';

// 옆에서 본 고리 자석. up: 윗면의 극('N'|'S'), 비우면 극을 밝히지 않은 회색 고리.
const RING = (cx, y, w, h, up, fs = 12) => {
  const x = cx - w / 2;
  if (!up) return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#4b5361" stroke="#2b313b" stroke-width="1.2"/><rect x="${x + 3}" y="${y + 2}" width="${w - 6}" height="${Math.max(2, h * 0.18)}" rx="1.5" fill="#7a8494"/>`;
  const [t, b] = up === 'N' ? [NC, SC] : [SC, NC], lo = up === 'N' ? 'S' : 'N';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h / 2}" fill="${t}"/><rect x="${x}" y="${y + h / 2}" width="${w}" height="${h / 2}" fill="${b}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="none" stroke="#2b313b" stroke-width="1.2"/>
    <g font-size="${fs}" font-weight="700" fill="#fff" text-anchor="middle"><text x="${cx}" y="${y + h / 4 + fs * 0.36}">${up}</text><text x="${cx}" y="${y + (3 * h) / 4 + fs * 0.36}">${lo}</text></g>`;
};
// 빈칸 고리: 극을 학생이 써 넣는다.
const BLANK_RING = (cx, y, w, h) => {
  const x = cx - w / 2;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#fff" stroke="#2b313b" stroke-width="1.2"/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="#2b313b" stroke-width="1"/>
    <rect x="${cx - 13}" y="${y + 2}" width="26" height="${h / 2 - 4}" rx="2" fill="none" stroke="${SUB}" stroke-dasharray="3 2"/><rect x="${cx - 13}" y="${y + h / 2 + 2}" width="26" height="${h / 2 - 4}" rx="2" fill="none" stroke="${SUB}" stroke-dasharray="3 2"/>`;
};
// 연필(막대)과 받침(지우개)
const PENCIL = (cx, top, bottom, w = 8) => `<rect x="${cx - w / 2}" y="${top + 10}" width="${w}" height="${bottom - top - 10}" fill="#f2c230" stroke="#b58b12" stroke-width="1"/><rect x="${cx - w / 2}" y="${top + 5}" width="${w}" height="6" fill="#b9c0c9"/><rect x="${cx - w / 2}" y="${top}" width="${w}" height="6" rx="2" fill="#f19bb0"/>`;
const BASE = (cx, y, w = 80, h = 16) => `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${h}" rx="3" fill="#f6e3e8" stroke="#c9a3ad" stroke-width="1.2"/><path d="M${cx - w / 2 + 6} ${y} l6 -6 h${w - 12} l6 6" fill="#fbeff2" stroke="#c9a3ad" stroke-width="1.2"/>`;
// 탑: gaps[i] = i번째와 i+1번째 고리 사이 간격(0이면 붙음). 아래에서 위로.
const TOWER = (cx, baseY, w, h, gaps, ups = []) => {
  let y = baseY - h, out = '';
  const rings = [];
  for (let i = 0; i <= gaps.length; i++) { rings.push([y, ups[i]]); if (i < gaps.length) y -= h + gaps[i]; }
  rings.forEach(([ry, up]) => { out += RING(cx, ry, w, h, up); });
  return { svg: out, top: y };
};
// 막대자석(가로). left: 왼쪽 반의 극
const BAR = (x, y, w, h, left, fs = 14) => {
  const [l, r] = left === 'N' ? [NC, SC] : [SC, NC], ro = left === 'N' ? 'S' : 'N';
  return `<rect x="${x}" y="${y}" width="${w / 2}" height="${h}" fill="${l}"/><rect x="${x + w / 2}" y="${y}" width="${w / 2}" height="${h}" fill="${r}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="none" stroke="#2b313b" stroke-width="1.2"/>
    <g font-size="${fs}" font-weight="700" fill="#fff" text-anchor="middle"><text x="${x + w / 4}" y="${y + h / 2 + fs * 0.36}">${left}</text><text x="${x + (3 * w) / 4}" y="${y + h / 2 + fs * 0.36}">${ro}</text></g>`;
};
const CLIP = (x, y, rot = 0) => `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0 v13 a3.5 3.5 0 0 0 7 0 v-9 a2.5 2.5 0 0 0 -5 0 v8" fill="none" stroke="#7d8896" stroke-width="1.6" stroke-linecap="round"/>`;
const ARROW = (id, c) => `<marker id="${id}" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8Z" fill="${c}"/></marker>`;

export const art = {
  // 도입: 떠 있는 탑과 붙은 탑, 그리고 막대자석·나침반
  opener: (() => {
    const hi = TOWER(150, 250, 92, 22, [10, 16, 24]), lo = TOWER(330, 250, 92, 22, [0, 0, 0]);
    return S(640, 300, `<defs><linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8f0fb"/><stop offset="1" stop-color="#f7f9fc"/></linearGradient></defs>
    <rect width="640" height="300" fill="url(#bg1)"/><rect y="266" width="640" height="34" fill="#d8c3a2"/><rect y="266" width="640" height="4" fill="#c4ab86"/>
    ${PENCIL(150, 70, 252)}${BASE(150, 250, 110, 18)}${hi.svg}
    ${PENCIL(330, 130, 252)}${BASE(330, 250, 110, 18)}${lo.svg}
    <g font-size="15" font-weight="700" fill="${INK}" text-anchor="middle"><text x="150" y="52">둥실! 떠 있어요</text><text x="330" y="112">착! 붙어 있어요</text></g>
    <text x="240" y="30" font-size="14" fill="${SUB}" text-anchor="middle">똑같은 고리 자석 4개인데 탑 높이가 달라요</text>
    ${BAR(452, 212, 150, 30, 'N', 15)}
    ${CLIP(456, 242, 8)}${CLIP(466, 242, -6)}${CLIP(476, 242, 10)}${CLIP(580, 242, -8)}${CLIP(590, 242, 6)}
    <circle cx="527" cy="112" r="50" fill="#fff" stroke="#8a95a3" stroke-width="3"/><circle cx="527" cy="112" r="42" fill="none" stroke="#d5dbe3"/>
    <path d="M527 76 L535 112 L519 112Z" fill="${NC}"/><path d="M527 148 L535 112 L519 112Z" fill="${SC}"/><circle cx="527" cy="112" r="4" fill="#2b313b"/>
    <g font-size="13" font-weight="700" text-anchor="middle"><text x="527" y="56" fill="${INK}">북</text><text x="527" y="98" fill="#fff" font-size="10">N</text><text x="527" y="136" fill="#fff" font-size="10">S</text></g>
    <text x="527" y="190" font-size="13" fill="${SUB}" text-anchor="middle">나침반과 막대자석</text>`);
  })(),

  step1: S(300, 170, `${PENCIL(150, 24, 128, 10)}${BASE(150, 126, 110, 22)}
    <line x1="150" y1="14" x2="150" y2="22" stroke="${NC}" stroke-width="1.5"/><line x1="112" y1="120" x2="112" y2="30" stroke="${NC}" stroke-dasharray="4 4"/>
    <path d="M112 30 l-5 9 M112 30 l5 9" stroke="${NC}" stroke-width="1.5" fill="none"/>
    <text x="72" y="70" font-size="13" font-weight="700" fill="${NC}">똑바로</text>
    <text x="210" y="142" font-size="12" fill="${SUB}">지우개·찰흙</text>
    <text x="150" y="164" font-size="13" fill="${INK}" text-anchor="middle">받침에 연필을 똑바로 꽂아요</text>`),

  step2: S(300, 170, `${RING(90, 64, 100, 26)}
    ${[0, 1, 2, 3, 4].map((i) => CLIP(50 + i * 18, 38 - (i % 2) * 4, (i - 2) * 8)).join('')}
    ${[0, 1, 2, 3, 4].map((i) => CLIP(50 + i * 18, 92 + (i % 2) * 3, (i - 2) * 6)).join('')}
    <rect x="198" y="52" width="46" height="46" rx="6" fill="#fff" stroke="${SUB}" stroke-width="1.5"/><text x="221" y="84" font-size="22" font-weight="700" fill="${NC}" text-anchor="middle">N</text>
    <path d="M196 70 C176 66 160 62 146 62" stroke="${SUB}" stroke-width="1.5" fill="none" marker-end="url(#a2)"/><defs>${ARROW('a2', SUB)}</defs>
    <text x="200" y="118" font-size="12" fill="${SUB}">극 스티커</text>
    <text x="150" y="152" font-size="13" fill="${INK}" text-anchor="middle">클립이 많이 붙는 곳을 찾고</text><text x="150" y="167" font-size="13" fill="${INK}" text-anchor="middle">스티커가 붙은 면을 확인해요</text>`),

  step3: (() => {
    const a = TOWER(80, 132, 70, 16, [0]);
    return S(300, 170, `<defs>${ARROW('a3', NC)}</defs>
    ${PENCIL(80, 60, 134)}${BASE(80, 132, 96, 16)}${a.svg}
    <text x="126" y="112" font-size="13" font-weight="700" fill="${INK}">붙었다면?</text>
    ${PENCIL(220, 30, 134)}${BASE(220, 132, 96, 16)}${RING(220, 116, 70, 16)}
    <g transform="rotate(-28 220 62)">${RING(220, 54, 70, 16)}</g>
    <path d="M262 40 C286 50 288 78 266 90" stroke="${NC}" stroke-width="2" fill="none" marker-end="url(#a3)"/>
    <text x="244" y="22" font-size="12" font-weight="700" fill="${NC}">뒤집기</text>
    <text x="150" y="164" font-size="13" fill="${INK}" text-anchor="middle">빼서 뒤집은 뒤 다시 끼워 봐요</text>`);
  })(),

  step4: (() => {
    const a = TOWER(80, 132, 64, 14, [0, 0, 0]), b = TOWER(220, 132, 64, 14, [6, 10, 15]);
    return S(300, 170, `${PENCIL(80, 50, 134)}${BASE(80, 132, 92, 16)}${a.svg}
    ${PENCIL(220, 20, 134)}${BASE(220, 132, 92, 16)}${b.svg}
    <g font-size="12" font-weight="700" fill="${INK}" text-anchor="middle"><text x="80" y="36">가장 낮은 탑</text><text x="150" y="80" font-size="18" fill="${NC}">?</text><text x="220" y="14" font-size="12">가장 높은 탑</text></g>
    <text x="150" y="164" font-size="13" fill="${INK}" text-anchor="middle">고리 4개로 두 가지 탑을 만들어요</text>`);
  })(),

  step5: (() => {
    const t = TOWER(100, 134, 72, 16, [6, 10, 15]);
    const ticks = Array.from({ length: 13 }, (_, i) => `<line x1="176" y1="${134 - i * 9}" x2="${i % 2 ? 184 : 190}" y2="${134 - i * 9}" stroke="#6b5a2a" stroke-width="1"/>`).join('');
    return S(300, 170, `<defs>${ARROW('a5', NC)}${ARROW('a5b', NC)}</defs>
    ${PENCIL(100, 16, 136)}${BASE(100, 134, 100, 16)}${t.svg}
    <rect x="172" y="18" width="24" height="120" fill="#f7e7a8" stroke="#b39b4a"/>${ticks}
    <line x1="210" y1="${t.top}" x2="210" y2="134" stroke="${NC}" stroke-width="2" marker-end="url(#a5)" marker-start="url(#a5b)"/>
    <line x1="138" y1="${t.top}" x2="214" y2="${t.top}" stroke="${NC}" stroke-dasharray="3 3"/>
    <text x="218" y="84" font-size="13" font-weight="700" fill="${NC}">탑 높이</text>
    <path d="M62 62 h-12" stroke="${INK}" stroke-width="1.2"/><text x="6" y="66" font-size="12" fill="${INK}">간격</text>
    <text x="150" y="164" font-size="13" fill="${INK}" text-anchor="middle">받침 윗면부터 맨 위 고리 윗면까지</text>`);
  })(),

  // 결과: 붙은 두 고리와 떠 있는 두 고리 — 위 고리의 극은 학생이 써 넣는다.
  result: S(520, 220, `<defs>${ARROW('ar', SUB)}</defs>
    <rect x="20" y="10" width="230" height="200" rx="10" fill="#f5f7fa"/><rect x="270" y="10" width="230" height="200" rx="10" fill="#f5f7fa"/>
    <g font-size="14" font-weight="700" fill="${INK}" text-anchor="middle"><text x="135" y="34">(가) 붙은 두 고리</text><text x="385" y="34">(나) 떠 있는 두 고리</text></g>
    ${PENCIL(115, 50, 192, 10)}${BASE(115, 190, 120, 16)}${RING(115, 150, 100, 40, 'N', 14)}${BLANK_RING(115, 110, 100, 40)}
    ${PENCIL(365, 50, 192, 10)}${BASE(365, 190, 120, 16)}${RING(365, 150, 100, 40, 'N', 14)}${BLANK_RING(365, 72, 100, 40)}
    <path d="M200 150 h-30" stroke="${SUB}" stroke-width="1.5" marker-end="url(#ar)"/><text x="204" y="146" font-size="12" fill="${SUB}">마주</text><text x="204" y="160" font-size="12" fill="${SUB}">보는 면</text>
    <path d="M450 131 h-30" stroke="${SUB}" stroke-width="1.5" marker-end="url(#ar)"/><text x="454" y="127" font-size="12" fill="${SUB}">마주</text><text x="454" y="141" font-size="12" fill="${SUB}">보는 면</text>`),

  // 개념 노트: 두 막대자석을 가까이 했을 때 (화살표 = 움직이는 방향)
  poles: (() => {
    const row = (y, l1, l2, out) => `${BAR(12, y, 88, 30, l1, 15)}${BAR(140, y, 88, 30, l2, 15)}
      ${out ? `<path d="M52 ${y + 46} h-34" stroke="${INK}" stroke-width="2.5" marker-end="url(#ap)"/><path d="M188 ${y + 46} h34" stroke="${INK}" stroke-width="2.5" marker-end="url(#ap)"/>`
    : `<path d="M58 ${y + 46} h36" stroke="${INK}" stroke-width="2.5" marker-end="url(#ap)"/><path d="M182 ${y + 46} h-36" stroke="${INK}" stroke-width="2.5" marker-end="url(#ap)"/>`}`;
    return S(240, 240, `<defs>${ARROW('ap', INK)}</defs><rect width="240" height="240" fill="#fff"/>
      ${row(10, 'S', 'N', true)}${row(88, 'N', 'S', true)}${row(166, 'S', 'S', false)}
      <line x1="10" y1="76" x2="230" y2="76" stroke="#e1e6ee"/><line x1="10" y1="154" x2="230" y2="154" stroke="#e1e6ee"/>`);
  })(),

  // 개념 플러스: 막대자석 가까이의 나침반
  compass: S(240, 220, `<rect width="240" height="220" fill="#fff"/>
    <circle cx="78" cy="110" r="64" fill="#fff" stroke="#8a95a3" stroke-width="4"/><circle cx="78" cy="110" r="54" fill="none" stroke="#d5dbe3"/>
    <text x="78" y="68" font-size="16" font-weight="700" fill="${INK}" text-anchor="middle">북</text>
    <path d="M26 110 L78 96 L78 124Z" fill="${NC}"/><path d="M130 110 L78 96 L78 124Z" fill="${SC}"/><circle cx="78" cy="110" r="5" fill="#2b313b"/>
    <g font-size="15" font-weight="700" fill="#fff" text-anchor="middle"><text x="54" y="116">N</text><text x="102" y="116">S</text></g>
    ${BAR(150, 96, 84, 28, 'N', 15)}
    <text x="120" y="200" font-size="15" fill="${SUB}" text-anchor="middle">바늘이 자석 쪽으로 돌아가요</text>`),
};

export const chapter = {
  unit: 's41-u01', book: 'GFIELD 실험 과학 영재', vol: '4-1', no: 1, title: '둥실 고리 자석 탑', theme: '#2F5DA8',
  link: { course: '4학년 1학기', unit: 'Ⅰ. 자석의 이용', topics: ['자석의 극과 극 사이의 힘', '자석에 붙는 물체', '자석이 가리키는 방향과 나침반', '생활 속 자석의 이용'] },
  skills: ['가설 설정', '변인 통제', '관찰', '측정', '결론 도출'],
  labTitle: '고리 자석 방향 바꿔 탑 쌓기',
  selfLink: '실험 결과를 생활 속 자석과 이어 생각했나요?',
  summary: ['자석의 <b>극</b>은 철이 가장 많이 붙는 곳이에요. 고리 자석은 윗면과 아랫면이 극이에요.', '<b>같은 극</b>끼리는 밀어 내고, <b>다른 극</b>끼리는 끌어당겨요. 그래서 탑의 고리가 뜨거나 붙어요.', '자유롭게 움직이는 자석은 <b>N극이 북쪽</b>, S극이 남쪽을 가리켜요.'],
  qr: { scene: '../assets/qr-s41-u01-scene.svg', lab: '../assets/qr-s41-u01-lab.svg', kit: '../assets/qr-s41-u01-kit.svg' },
  intro: [
    '가운데에 구멍이 뚫린 고리 자석을 연필에 하나씩 끼워 보면 이상한 일이 생겨요. 어떤 고리는 아래 고리에 착 달라붙는데, 어떤 고리는 아무것도 없는 공중에 둥실 떠 있어요. 손가락으로 살짝 눌렀다 떼면 다시 통 하고 올라와요.',
    '똑같은 고리 자석인데 왜 어떤 것은 붙고 어떤 것은 뜰까요? 오늘은 고리 자석 네 개로 가장 높은 탑과 가장 낮은 탑을 쌓아 보면서, 자석의 극과 극 사이에 어떤 힘이 작용하는지 알아봐요. 나침반이 늘 북쪽을 가리키는 까닭도 함께 찾아봐요.',
  ],
  think: [
    { q: '냉장고 문에 붙이는 자석이나 자석 필통을 떠올려 보세요. 자석은 어떤 물체에 붙고, 어떤 물체에는 붙지 않았나요?', a: '냉장고 문, 철 클립처럼 철로 만든 것에는 붙고, 나무·플라스틱·유리로 만든 것에는 붙지 않았다 등' },
    { q: '자석 두 개를 가까이 가져가 본 적이 있나요? 어떤 느낌이었는지 써 보세요.', a: '어떤 때는 착 달라붙고, 한쪽을 뒤집으면 서로 밀어 내서 잘 붙지 않았다 등' },
  ],
  goal: '고리 자석을 끼우는 방향에 따라 떠 있는 층과 탑 높이가 어떻게 달라지는지 알아보고, 그 까닭을 자석의 극으로 설명해 보자.',
  materials: {
    kit: ['고리 자석 4개(같은 크기)', '극 스티커(N·S)', '막대자석 1개', '나침반 1개', '철 클립 한 줌'],
    student: ['연필 또는 나무젓가락', '지우개 또는 찰흙(받침)', '자', '필기도구'],
  },
  hypothesis: { hint: '이웃한 두 고리의 마주 보는 면이 같은 극일 때와 다른 극일 때, 탑이 어떻게 될지 예상해 보세요.', a: '마주 보는 면이 같은 극인 곳이 많을수록 떠 있는 층이 많아지고 탑이 높아질 것이다.' },
  design: {
    change: { q: '바꿀 조건', a: '고리 자석을 끼우는 방향(이웃한 두 고리의 마주 보는 면이 같은 극인지, 다른 극인지)' },
    same: { q: '같게 할 조건', a: '고리 자석의 개수(4개)·크기·종류, 끼우는 연필, 받침, 높이를 재는 방법' },
    measure: { q: '관찰하고 잴 것', a: '떠 있는 층의 수, 탑 높이(cm), 떠 있는 간격의 모습' },
  },
  steps: [
    { art: 'step1', text: '지우개나 찰흙 받침에 연필을 똑바로 꽂아요.', tip: '연필이 기울면 고리가 연필에 걸려서 제대로 뜨지 못해요.' },
    { art: 'step2', text: '고리 자석을 철 클립 더미에 넣었다 꺼내 클립이 가장 많이 붙는 곳을 찾아요. 그다음 고리마다 극 스티커(N·S)가 붙은 면을 확인해요.', tip: '스티커는 선생님이 미리 극을 알아내 붙여 두었어요. 스티커가 없으면 한쪽 면에만 색 점을 찍어 끼우는 방향을 구별해요.' },
    { art: 'step3', text: '고리 하나를 연필에 끼우고, 둘째 고리를 위에서 끼워요. 붙으면 빼서 뒤집어 다시 끼우고, 어떻게 달라지는지 봐요.', tip: '고리를 뺄 때는 옆으로 비틀지 말고 연필을 따라 위로 들어 올려요.' },
    { art: 'step4', text: '고리 네 개를 모두 끼워 가장 높은 탑과 가장 낮은 탑을 만들어요. 고리마다 윗면의 극을 아래에서부터 차례로 적어요.', tip: '적는 방법 예: N·N·S·N (아래 → 위, 윗면의 극)' },
    { art: 'step5', text: '자로 받침 윗면에서 맨 위 고리의 윗면까지 높이를 재고, 떠 있는 층의 수를 세어 표에 적어요.', tip: '자의 0 눈금을 받침 윗면에 맞추고, 눈높이를 맞춰 읽어요. 두 번 재어 차이가 크면 한 번 더 재요.' },
  ],
  wonder: { q: '맨 위에 떠 있는 고리 위에 지우개 하나를 살짝 올려놓으면 떠 있는 간격은 어떻게 될까요?', a: '간격이 좁아진다(고리가 조금 내려온다). 지우개를 치우면 다시 올라간다. 같은 극끼리 밀어 내는 힘이 위에서 누르는 무게를 받쳐 주고 있기 때문이다.' },
  caution: ['끼우는 방향 말고 고리 개수·연필·받침은 모두 같게 해요.', '고리 자석끼리 세게 부딪치면 깨질 수 있어요. 깨진 조각에 손을 다치지 않게 조심해요.', '자석을 입에 넣지 말고, 휴대폰·교통카드 가까이에 두지 않아요.'],
  results: [
    { q: '고리 두 개가 붙었을 때(가)와 떠 있을 때(나), 위 고리의 두 면에 알맞은 극(N 또는 S)을 그림의 빈칸에 써 넣으세요.', art: 'result',
      a: '(가) 위 고리: 윗면 N, 아랫면 S — 마주 보는 면이 N극과 S극(다른 극). (나) 위 고리: 윗면 S, 아랫면 N — 마주 보는 면이 N극과 N극(같은 극).' },
    { q: '고리 네 개로 쌓은 탑을 비교해 표에 쓰세요.', table: ['', '쌓은 모양(아래→위, 윗면의 극)', '떠 있는 층', '탑 높이(cm)'], rows: ['가장 낮은 탑', '가장 높은 탑', '떠 있는 층이 1개인 탑'],
      a: '가장 낮은 탑: N·N·N·N처럼 모두 같은 방향 — 0층 — 고리 4개 두께만큼. 가장 높은 탑: N·S·N·S처럼 번갈아 뒤집음 — 3층 — 가장 높다. 1층 탑: 예) N·N·N·S — 1층. (높이는 고리 크기에 따라 모둠마다 다르다.)' },
    { q: '가장 높은 탑에서 떠 있는 간격을 자세히 보세요. 아래쪽 간격과 위쪽 간격은 어떻게 보였나요?', a: '관찰한 대로 쓴다. 예) 아래쪽 간격이 위쪽 간격보다 좁아 보였다. 아래쪽 고리일수록 위에 얹힌 고리가 많기 때문일지도 모른다.' },
  ],
  conclusion: [
    { q: '고리 자석이 붙거나 떠 있는 까닭을 “같은 극”, “다른 극”이라는 말을 넣어 쓰세요.', a: '마주 보는 면이 다른 극이면 서로 끌어당겨 붙고, 같은 극이면 서로 밀어 내서 떠 있다.' },
    { q: '고리 자석 네 개로 가장 높은 탑과 가장 낮은 탑을 만드는 방법을 각각 쓰세요.', a: '가장 높은 탑: 고리를 하나씩 뒤집어 끼워 이웃한 면이 모두 같은 극끼리 마주 보게 한다. 가장 낮은 탑: 모두 같은 방향으로 끼워 이웃한 면이 모두 다른 극끼리 마주 보게 한다.' },
    { q: '연필 없이 떠 있는 고리 위에 고리를 그냥 올려놓으면 어떻게 될까요? 연필이 하는 일을 쓰세요.', a: '올려놓은 고리가 옆으로 미끄러지거나 뒤집혀서 붙어 버린다. 연필은 고리가 옆으로 밀려나거나 뒤집히지 않게 잡아 준다.' },
  ],
  note: {
    title: '자석의 극과 극 사이의 힘',
    art: 'poles',
    table: {
      head: ['', '같은 극끼리', '다른 극끼리'],
      rows: [
        ['마주 보는 극', 'N극과 N극, S극과 S극', 'N극과 S극'],
        ['작용하는 힘', '서로 밀어 낸다', '서로 끌어당긴다'],
        ['고리 자석 탑', '떠 있다', '붙는다'],
      ],
    },
    points: ['자석에서 철로 만든 물체가 가장 많이 붙는 곳을 극이라고 해요. 막대자석은 양쪽 끝, 고리 자석은 윗면과 아랫면이 극이에요.', '자석을 자유롭게 움직이게 두면 N극은 북쪽, S극은 남쪽을 가리키며 멈춰요.'],
    plus: { title: '나침반 바늘도 자석이에요', art: 'compass', text: '나침반 바늘은 작은 자석이라서 N극이 북쪽을 가리켜요. 가까이에 막대자석을 가져가면 다른 극끼리는 끌어당기고 같은 극끼리는 밀어 내서 바늘이 돌아가요. 그래서 방향을 찾을 때는 나침반을 자석에서 멀리 두고 써요.' },
  },
  discuss: {
    q: '우리 집과 교실에서 자석이 들어 있는 물건을 찾아보세요. 각 물건이 자석의 어떤 성질(철을 끌어당김, 극끼리 밀고 당김, 방향을 가리킴)을 이용하는지 까닭과 함께 이야기해 보세요.',
    a: '예) 냉장고 메모 자석·자석 칠판: 철을 끌어당기는 성질 / 자석 필통 뚜껑·가방 자석 단추: 다른 극끼리 끌어당기는 성질 / 나침반: 일정한 방향을 가리키는 성질',
  },
  creative: {
    q: '고리 자석이 떠 있는 성질을 이용해 우리 생활의 불편함을 덜어 주는 물건을 발명해 보세요. 어떤 불편함을 해결하는지, 자석을 어떻게 놓는지 쓰세요.',
    a: '예) 서랍 안쪽과 서랍 끝에 같은 극끼리 마주 보는 자석을 달아 서랍이 쾅 닫히지 않게 하는 받침, 떠 있는 고리 위에 컵을 올려 부딪혀도 덜 흔들리는 컵 받침 등. 같은 극끼리 마주 보게 놓았다는 설명이 있으면 된다.',
  },
  gifted: {
    title: '생각 넓히기 — 세상의 자석이 모두 사라진다면?',
    lead: '어느 날 세상의 자석이 모두 사라졌어요. 집·학교·밖에서 무엇이 불편해질지 되도록 많이, 서로 다른 쪽으로 써 보세요.',
    rows: ['집', '학교', '밖(길·산·탈것)'],
    a: { 집: '냉장고 문이 꼭 닫히지 않음, 냉장고에 메모를 붙일 수 없음, 자석 방충망이 안 닫힘, 가방 자석 단추가 안 잠김', 학교: '자석 칠판에 종이를 붙일 수 없음, 자석 필통이 안 닫힘, 과학 시간에 나침반을 못 씀', '밖(길·산·탈것)': '산에서 나침반으로 길을 못 찾음, 떨어진 쇠못을 쉽게 줍지 못함, 자석으로 떠서 달리는 열차가 뜨지 못함' },
    rubric: [
      '유창성: 알맞은 생각의 개수(3~5개 1점, 6~8개 2점, 9개 이상 3점)',
      '융통성: 생각이 속한 서로 다른 갈래의 수(붙이기·닫기·방향 찾기·줍기·탈것 등 2갈래 1점, 3갈래 2점, 4갈래 이상 3점)',
      '독창성: 다른 친구들이 잘 떠올리지 못한 생각(1~2개 1점, 3개 이상 2점)',
    ],
  },
  flow: [['극 찾기', '클립이 많이 붙는 곳', '막대자석은 양쪽 끝'], ['극 사이의 힘', '같은 극은 밀고 다른 극은 당김', '고리 자석 탑'], ['방향', 'N극은 북쪽을 가리킴', '나침반']],
  // 개념 정리(빈칸 {{답}} — 학생용은 ⓐ____, 답은 옆날개 아래 작은 글씨로)
  concept: [
    { tag: 'A', title: '자석의 성질', lines: [
      ['자석에 붙는 물체', '{{철}}로 만든 물체. 나무·유리·고무·플라스틱은 붙지 않는다'],
      ['극', '철로 만든 물체가 가장 많이 붙는 곳. 막대자석은 {{양쪽 끝}}, 고리 자석은 윗면과 아랫면'],
      ['방향', '자유롭게 움직이는 자석이 멈추면 N극은 {{북}}쪽, S극은 {{남}}쪽을 가리킨다'],
      ['나침반', '바늘이 {{자석}}이라서 방향을 찾을 때 쓴다'],
    ] },
    { tag: 'B', title: '극 사이의 힘과 고리 자석 탑', table: {
      head: ['', '같은 극끼리', '다른 극끼리'],
      rows: [['작용하는 힘', '서로 {{밀어 낸다}}', '서로 {{끌어당긴다}}'], ['고리 자석', '{{떠 있다}}', '붙는다'], ['탑 높이', '이런 층이 많을수록 {{높다}}', '이런 층이 많을수록 낮다']],
    } },
  ],
  more: { title: '더 알아보기 · 떠서 달리는 열차', text: '자기부상 열차는 레일과 열차 바닥에 있는 자석이 서로 밀어 내거나 끌어당기는 힘으로 열차를 살짝 띄워서 달려요. 바퀴가 레일에 닿지 않아서 소리가 작고 덜 흔들려요. 우리가 연필에 쌓은 고리 자석 탑의 떠 있는 층과 같은 원리예요.' },
  glossary: [
    ['자석', '磁石', '자석 자 · 돌 석', '철로 만든 물체를 끌어당기는 물체'],
    ['극', '極', '다할 극', '자석에서 철로 만든 물체가 가장 많이 붙는 부분'],
    ['나침반', '羅針盤', '벌일 라 · 바늘 침 · 소반 반', '자석 바늘로 방향을 알아보는 도구'],
    ['방위', '方位', '모 방 · 자리 위', '동서남북을 기준으로 나타낸 방향'],
    ['부상', '浮上', '뜰 부 · 윗 상', '공중이나 물 위로 떠오름'],
  ],
  // 옆날개(쪽마다) — 플러스 노트
  rail: {
    1: [{ h: '교과서 연결', t: '4학년 1학기 Ⅰ. 자석의 이용 · 자석에 붙는 물체, 자석의 극, 극 사이의 힘, 나침반' }, { g: ['자석'] }],
    2: [{ h: '조건 정하기', t: '고리 개수까지 바꾸면 탑 높이가 달라진 까닭이 끼우는 방향 때문인지 개수 때문인지 알 수 없어요.' }, { g: ['극'] }],
    3: [{ h: '고리 자석의 극', t: '고리 자석은 옆면이 아니라 넓은 윗면과 아랫면에 클립이 많이 붙어요. 그래서 뒤집으면 마주 보는 극이 바뀌어요.' }],
    4: [{ h: '안전', t: '작은 자석은 삼키면 매우 위험해요. 실험이 끝나면 고리 자석 개수를 세어 상자에 넣어요.' }],
    5: [{ h: '기록하는 법', t: '윗면의 극을 아래에서 위로 적으면, 이웃한 두 글자가 다를 때 마주 보는 면이 같은 극이에요.' }],
    6: [{ h: '실험과 개념 잇기', t: '떠 있는 층 = 같은 극끼리 마주 봄, 붙은 층 = 다른 극끼리 마주 봄' }, { g: ['나침반', '방위'] }],
    7: [{ h: '생각을 넓히는 법', t: '한 가지 생각이 떠오르면 “붙이는 데는? 닫는 데는? 방향 찾기에는? 탈것에는?”처럼 갈래를 바꿔 보세요.' }, { g: ['부상'] }],
    8: [{ h: '확인 문제', t: '4학년 1학기 단원평가 유형과 같은 모양으로 새로 쓴 문제예요.' }],
  },
  report: {
    sections: [
      { label: '① 탐구 문제', hint: '무엇을 알아보려고 했나요?', a: '고리 자석을 끼우는 방향에 따라 떠 있는 층과 탑 높이는 어떻게 달라질까?', lines: 2 },
      { label: '② 가설', hint: '“~할수록 ~할 것이다”로 써요.', a: '마주 보는 면이 같은 극인 곳이 많을수록 떠 있는 층이 많아지고 탑이 높아질 것이다.', lines: 2 },
      { label: '③ 바꿀 조건 / 같게 할 조건', a: '바꿀 조건: 고리 자석을 끼우는 방향 / 같게 할 조건: 고리 개수·크기, 연필, 받침, 높이 재는 방법', lines: 1 },
      { label: '④ 준비물', a: '고리 자석 4개, 극 스티커, 철 클립, 연필, 지우개(받침), 자', lines: 1 },
      { label: '⑤ 실험 과정', hint: '순서대로 번호를 붙여 써요.', a: '① 받침에 연필 꽂기 ② 고리의 극 확인하기 ③ 두 고리로 붙음·뜸 보기 ④ 네 고리로 가장 높은·낮은 탑 만들기 ⑤ 높이 재고 떠 있는 층 세기', lines: 2 },
      { label: '⑥ 결과', hint: '쌓은 모양, 떠 있는 층, 탑 높이를 표로.', a: '번갈아 뒤집어 끼우면 3층이 떠 가장 높고, 모두 같은 방향으로 끼우면 모두 붙어 가장 낮았다.', lines: 3 },
      { label: '⑦ 결론', a: '같은 극끼리는 밀어 내서 떠 있고, 다른 극끼리는 끌어당겨 붙는다. 같은 극끼리 마주 보는 곳이 많을수록 탑이 높다.', lines: 2 },
      { label: '⑧ 생활과 이어 보기', hint: '같은 원리를 이용한 물건은?', a: '자기부상 열차, 자석 필통 뚜껑, 가방 자석 단추 등', lines: 1 },
      { label: '⑨ 더 알고 싶은 점 · 아쉬운 점', lines: 1 },
    ],
    checks: ['바꾼 조건이 끼우는 방향 하나뿐이었나요?', '쌓은 모양과 높이를 표에 빠짐없이 적었나요?', '결론이 결과에서 나왔나요?', '생활 속 물건과 이어서 생각했나요?'],
  },
  formative: {
    items: ['1-8', '1-10', '2-12', '4-20'],
    standards: ['자석에 붙는 물체와 자석의 극을 설명할 수 있다.', '같은 극과 다른 극 사이의 힘으로 고리 자석 탑을 설명할 수 있다.', '자석이 가리키는 방향과 나침반, 생활 속 이용을 말할 수 있다.'],
  },
  // 교과 확인 문제: 우리 유사문항 id(sourceRef 세트-번호로 고름)
  check: ['1-1', '1-7', '3-12', '1-13', '1-16', '1-19'],
};

// 수업 교안(가르치기 화면) — 90분 한 차시. phase 순서대로 슬라이드가 나뉘고, say는 강사 발문(학생 화면엔 안 나옴).
export const plan = {
  minutes: 90,
  phases: [
    { id: 'open', name: '도입', min: 10, aim: '자석을 가까이 해 본 경험 떠올리기 → 3D로 떠 있는 고리 먼저 보기' },
    { id: 'design', name: '탐구 설계', min: 15, aim: '가설 세우기, 바꿀 조건(끼우는 방향)·같게 할 조건 정하기' },
    { id: 'lab', name: '실험', min: 25, aim: '극 확인 → 두 고리로 붙음·뜸 → 네 고리 탑 쌓고 재기 → 3D 실험실로 확인' },
    { id: 'result', name: '결과·결론', min: 15, aim: '표 정리 → 같은 극은 밀고 다른 극은 당김으로 설명' },
    { id: 'concept', name: '개념', min: 10, aim: '자석에 붙는 물체, 극, 방향, 나침반' },
    { id: 'extend', name: '확장', min: 10, aim: '토의 · 발명 · 영재성(유창성·융통성·독창성)' },
    { id: 'check', name: '확인', min: 5, aim: '교과 확인 문제 풀고 함께 채점' },
  ],
  say: {
    cover: '오늘은 고리 자석으로 가장 높은 탑을 쌓아 보면서 자석의 극을 알아봐요.',
    think: '두세 명에게 발표시키고, "붙는다/밀어 낸다" 낱말이 나오면 칠판에 적어 두세요.',
    scene: '재생 전에 "왜 어떤 고리는 떠 있을까?"를 먼저 묻고, 가벼워서·막대가 잡아서 등 예상을 모두 들은 뒤 재생합니다.',
    hypo: '"~할수록 ~할 것이다" 꼴로 쓰게 하세요. "마주 보는 면"이라는 말을 쓰도록 이끌어 줍니다.',
    design: '고리 개수까지 바꾸려는 학생이 있어요. "개수가 다르면 높이가 달라진 까닭을 알 수 있을까?"로 되물으세요.',
    step1: '연필이 기울면 고리가 걸려 뜨지 않습니다. 받침을 미리 만들어 두어도 됩니다.',
    step3: '고리를 옆으로 비틀어 빼다가 부딪쳐 깨지는 일이 많아요. 위로 들어 올리는 시범을 먼저 보이세요.',
    step5: '0 눈금을 받침 윗면에 맞추는지 모둠마다 확인하세요. 모둠 사이 높이 차이는 고리 크기 차이일 수 있어요.',
    lab: '3D 실험실에서 고리를 눌러 뒤집으며 떠 있는 층과 탑 높이를 표에 적게 하세요. 실제 탑 결과와 같은지 비교합니다.',
    wonder: '실제로 지우개를 올려 보게 하면 좋아요. 간격이 좁아지는 것을 눈높이에서 보게 하세요.',
    res: '모둠별 가장 높은 탑의 쌓은 모양을 칠판에 모으면 "번갈아 뒤집기"가 공통으로 드러납니다.',
    concl: '같은 극·다른 극 낱말을 넣어 한 문장으로 말하게 하세요. 간격 차이는 관찰로만 다루고 까닭은 단정하지 않습니다.',
    note: '막대자석 두 개로 N-N, S-S, N-S를 직접 가까이 해 보게 한 뒤 표를 채웁니다.',
    plus: '나침반을 막대자석 둘레로 옮겨 가며 바늘이 도는 모습을 보여 주세요.',
    discuss: '정답이 하나가 아닙니다. 물건과 성질을 까닭으로 이었는지를 봐 주세요.',
    gifted: '3분 동안 개수 경쟁 → 붙이기·닫기·방향 찾기·줍기 등 갈래로 묶어 보며 융통성을 짚어 줍니다.',
    test: '1분 풀이 → 손들기 → 정답 공개 순서로 진행합니다.',
  },
};
