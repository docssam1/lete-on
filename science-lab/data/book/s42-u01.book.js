// GFIELD 실험 과학 영재 — 4-2 · 실험 1 「둥둥 부레옥잠의 비밀」 (교과 연계: 4-2 Ⅰ 식물의 생활)
// 단원 3D 실험실(연못 식물 심기 · 부레옥잠 누르기 · 잎자루 자르기)과 이어지는 실험이다.
// 지필드 실험편(4-C 뿌리의 역할 — 물에 떠서 사는 식물의 뿌리, 비유하기 영재성)의 흐름을 참고해 글과 그림을 새로 만들었다.
// 단원평가 원문은 쓰지 않는다. 교과 확인 문제·형성평가는 우리 유사문항(s42-u01.similar.js)에서 고른다.
// a: 교사용에만 보이는 예시 답·해설. rubric: 채점 기준.

const S = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" font-family="Pretendard, 'Noto Sans KR', sans-serif">${body}</svg>`;

// ── 식물 그리기(원본 도형) ──
// 부레옥잠 잎 하나: 밑동(0,0)에서 볼록한 잎자루가 부풀었다가 가늘어지고, 그 끝에 둥근 잎몸이 달린다.
const HLEAF = (a, k = 1) => `<g transform="rotate(${a}) scale(${k})">
  <path d="M-3 0 C-13 -6 -13 -27 -4 -35 L-2 -46 L2 -46 L4 -35 C13 -27 13 -6 3 0Z" fill="#9fd06f" stroke="#4f8a3a" stroke-width="1.4"/>
  <path d="M-5 -10 C-7 -18 -6 -25 -3 -30" fill="none" stroke="#d6efb8" stroke-width="2" stroke-linecap="round"/>
  <path d="M0 -45 C-6 -49 -22 -48 -22 -62 C-22 -74 -10 -80 0 -80 C10 -80 22 -74 22 -62 C22 -48 6 -49 0 -45Z" fill="#3d8b3a" stroke="#2a6128" stroke-width="1.4"/>
  <path d="M0 -46 C-12 -52 -14 -68 -4 -78 M0 -46 C-5 -54 -6 -68 -1 -79 M0 -46 C5 -54 6 -68 1 -79 M0 -46 C12 -52 14 -68 4 -78" fill="none" stroke="#86c86a" stroke-width=".9"/>
  <path d="M-15 -66 C-14 -72 -9 -76 -4 -77" fill="none" stroke="#b9e3a3" stroke-width="2" stroke-linecap="round" opacity=".8"/></g>`;
// 부레옥잠 한 포기: (x,y)=물 위 밑동, s=크기. roots: 물속 뿌리, flower: 꽃대
const HYA = (x, y, s = 1, { roots = true, flower = false, leaves = [-58, -26, 6, 36, 64] } = {}) => `<g transform="translate(${x} ${y}) scale(${s})">
  ${roots ? `<g fill="none" stroke="#6b4a5e" stroke-width="1.6" stroke-linecap="round">
    <path d="M-6 2 C-12 18 -16 32 -14 52"/><path d="M-2 3 C-4 22 -6 40 -2 60"/><path d="M3 3 C6 20 8 38 5 56"/><path d="M7 2 C14 16 18 30 17 46"/>
    <path d="M-14 22 l-6 3 M-15 34 l-6 2 M-4 26 l-6 3 M-4 42 l6 2 M6 20 l6 2 M7 36 l-6 3 M15 26 l6 1 M17 38 l6 2" stroke-width="1"/></g>
    <ellipse cx="0" cy="30" rx="16" ry="24" fill="#7d5a6e" opacity=".18"/>` : ''}
  <ellipse cx="0" cy="1" rx="9" ry="3" fill="#6f9e4f"/>
  ${flower ? `<path d="M0 0 C1 -30 -1 -60 1 -92" stroke="#5f9a45" stroke-width="3" fill="none"/>
    <g fill="#b99ae0" stroke="#8d6bc0" stroke-width=".8"><ellipse cx="-7" cy="-86" rx="7" ry="5"/><ellipse cx="7" cy="-90" rx="7" ry="5"/><ellipse cx="-6" cy="-100" rx="7" ry="5"/><ellipse cx="7" cy="-104" rx="7" ry="5"/><ellipse cx="0" cy="-112" rx="6" ry="5"/></g>
    <g fill="#f4d24a"><circle cx="7" cy="-90" r="1.6"/><circle cx="-6" cy="-100" r="1.6"/></g>` : ''}
  ${leaves.map((a, i) => HLEAF(a, i % 2 ? 0.92 : 1)).join('')}</g>`;
// 수련: 바닥(xb,yb)에 뿌리, 긴 잎자루로 물 위(y)에 잎을 띄운다.
const LILY = (xb, yb, y) => `<g>
  <ellipse cx="${xb}" cy="${yb}" rx="16" ry="6" fill="#8a6a4a"/>
  <g fill="none" stroke="#6b4a36" stroke-width="1.3"><path d="M${xb - 10} ${yb + 3} l-8 10 M${xb - 2} ${yb + 5} l-2 12 M${xb + 8} ${yb + 4} l7 10 M${xb + 14} ${yb + 2} l10 6"/></g>
  <g fill="none" stroke="#6aa050" stroke-width="2.2"><path d="M${xb - 4} ${yb - 4} C${xb - 18} ${yb - 40} ${xb - 44} ${y + 30} ${xb - 50} ${y + 2}"/><path d="M${xb + 2} ${yb - 5} C${xb + 8} ${yb - 40} ${xb + 30} ${y + 34} ${xb + 42} ${y + 2}"/><path d="M${xb} ${yb - 5} C${xb - 2} ${yb - 50} ${xb - 4} ${y + 30} ${xb - 2} ${y - 6}"/></g>
  <path d="M${xb - 74} ${y} a24 5 0 1 0 48 0 l-18 -1 z" fill="#3f8f3a" stroke="#2a6128"/>
  <path d="M${xb + 20} ${y} a22 5 0 1 0 44 0 l-18 -1 z" fill="#4a9a40" stroke="#2a6128"/>
  <g transform="translate(${xb - 2} ${y - 6})"><path d="M0 0 C-14 -2 -16 -12 -12 -18 C-6 -12 -2 -6 0 0Z M0 0 C14 -2 16 -12 12 -18 C6 -12 2 -6 0 0Z" fill="#f6c6d8" stroke="#d98aa8"/><path d="M0 0 C-6 -8 -5 -20 0 -24 C5 -20 6 -8 0 0Z" fill="#fbe0ea" stroke="#d98aa8"/><circle cx="0" cy="-4" r="2.5" fill="#f4d24a"/></g></g>`;
// 부들: 물가 땅(x,yb)에 뿌리, 곧은 줄기와 소시지 모양 이삭.
const CATTAIL = (x, yb, h = 120) => `<g>
  <g fill="#6aa050" stroke="#4f8a3a" stroke-width=".8"><path d="M${x - 6} ${yb} C${x - 14} ${yb - h * 0.5} ${x - 20} ${yb - h * 0.8} ${x - 30} ${yb - h * 0.95} C${x - 18} ${yb - h * 0.75} ${x - 10} ${yb - h * 0.45} ${x - 2} ${yb}Z"/>
    <path d="M${x + 6} ${yb} C${x + 12} ${yb - h * 0.5} ${x + 18} ${yb - h * 0.75} ${x + 26} ${yb - h * 0.9} C${x + 14} ${yb - h * 0.7} ${x + 8} ${yb - h * 0.4} ${x + 2} ${yb}Z"/></g>
  <path d="M${x - 3} ${yb} L${x - 3} ${yb - h}" stroke="#5f9a45" stroke-width="2.4"/><path d="M${x + 5} ${yb} L${x + 5} ${yb - h * 0.85}" stroke="#5f9a45" stroke-width="2.4"/>
  <rect x="${x - 7.5}" y="${yb - h * 0.82}" width="9" height="${h * 0.24}" rx="4.5" fill="#7a4a2a"/><rect x="${x + 0.5}" y="${yb - h * 0.7}" width="9" height="${h * 0.22}" rx="4.5" fill="#86552f"/>
  <g fill="#b98a55"><path d="M${x - 5} ${yb - h * 0.6} v6 M${x + 4} ${yb - h * 0.5} v6" stroke="#b98a55"/></g>
  <g fill="none" stroke="#6b4a36" stroke-width="1.2"><path d="M${x - 4} ${yb} l-7 9 M${x} ${yb} l0 11 M${x + 4} ${yb} l7 9"/></g></g>`;
// 검정말: 바닥(x,yb)에서 물속으로 자라는 가는 줄기와 돌려난 작은 잎.
const HYDRILLA = (x, yb, h = 90) => {
  const stem = (dx, hh, bend) => {
    let g = `<path d="M${x + dx} ${yb} C${x + dx + bend} ${yb - hh * 0.4} ${x + dx - bend} ${yb - hh * 0.7} ${x + dx + bend * 0.6} ${yb - hh}" fill="none" stroke="#2f6e3a" stroke-width="1.6"/>`;
    for (let t = 0.14; t < 1; t += 0.14) {
      const px = x + dx + bend * Math.sin(t * 5) * 0.6, py = yb - hh * t;
      g += `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)})" fill="#3f8a45">${[-60, -20, 20, 60].map((a) => `<ellipse cx="0" cy="-5" rx="1.4" ry="5" transform="rotate(${a})"/>`).join('')}</g>`;
    }
    return g;
  };
  return `<g>${stem(-8, h * 0.85, 6)}${stem(0, h, -5)}${stem(9, h * 0.7, 5)}<g fill="none" stroke="#6b4a36" stroke-width="1.1"><path d="M${x - 8} ${yb} l-5 6 M${x} ${yb} l1 7 M${x + 9} ${yb} l5 6"/></g></g>`;
};
// 개구리밥: 물 위(x,y)의 작은 잎과 가는 뿌리 한 가닥.
const DUCK = (x, y) => `<g><path d="M${x} ${y + 1} v10" stroke="#8a6a7a" stroke-width=".8"/><ellipse cx="${x}" cy="${y}" rx="5" ry="1.8" fill="#6cc24a" stroke="#3f8a2a" stroke-width=".6"/></g>`;
// 가위
const SCISSORS = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M0 0 L34 -8 M0 0 L34 8" stroke="#8b949c" stroke-width="4" stroke-linecap="round"/><circle cx="-8" cy="-7" r="6" fill="none" stroke="#E23B2E" stroke-width="3"/><circle cx="-8" cy="7" r="6" fill="none" stroke="#E23B2E" stroke-width="3"/><circle cx="4" cy="0" r="1.8" fill="#555"/></g>`;
// 투명 수조(앞에서 본 모습)
const TANK = (x, y, w, h, wy) => `<rect x="${x}" y="${wy}" width="${w}" height="${y + h - wy}" fill="#bfe3f7" opacity=".75"/><path d="M${x} ${wy} h${w}" stroke="#4f9fdc" stroke-width="2"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="none" stroke="#8a9aad" stroke-width="2.5"/>`;
// 물 앞면(식물의 잠긴 부분을 물빛으로 덮는다)
const WFRONT = (x, wy, w, bot) => `<rect x="${x}" y="${wy}" width="${w}" height="${bot - wy}" fill="#9fd3f0" opacity=".32"/>`;
// 떼어 낸 잎자루 한 개(잎몸 없이, 가로로 누운 모습)
const PET = (x, y, r = 0, k = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${k})"><path d="M-22 -2 C-16 -8 -6 -10 4 -10 C14 -10 20 -5 22 -1 L22 2 C20 6 14 10 4 10 C-6 10 -16 8 -22 2Z" fill="#9fd06f" stroke="#4f8a3a" stroke-width="1.3"/><ellipse cx="22" cy="0" rx="1.6" ry="2.6" fill="#e3f4cf" stroke="#4f8a3a" stroke-width=".8"/></g>`;
// 잎자루를 모두 떼어 낸 부레옥잠(밑동·자른 자국·뿌리)
const CUTPLANT = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <g fill="none" stroke="#6b4a5e" stroke-width="1.6" stroke-linecap="round"><path d="M-6 2 C-12 18 -16 32 -14 52"/><path d="M-2 3 C-4 22 -6 40 -2 60"/><path d="M3 3 C6 20 8 38 5 56"/><path d="M7 2 C14 16 18 30 17 46"/>
    <path d="M-14 22 l-6 3 M-15 34 l-6 2 M-4 26 l-6 3 M-4 42 l6 2 M6 20 l6 2 M7 36 l-6 3 M15 26 l6 1 M17 38 l6 2" stroke-width="1"/></g>
  <ellipse cx="0" cy="30" rx="16" ry="24" fill="#7d5a6e" opacity=".18"/>
  <ellipse cx="0" cy="0" rx="12" ry="4" fill="#6f9e4f" stroke="#4f8a3a"/>
  <g fill="#9fd06f" stroke="#4f8a3a" stroke-width="1.2">${[-40, -14, 12, 38].map((a) => `<g transform="rotate(${a})"><path d="M-3 -1 L-3 -9 L3 -9 L3 -1Z"/><ellipse cx="0" cy="-9" rx="3" ry="1.3" fill="#e3f4cf"/></g>`).join('')}</g></g>`;
// 잎자루 가로 단면(속이 스펀지처럼 작은 구멍이 가득)
const SECTION = (cx, cy, r) => {
  let holes = '';
  for (let yy = -r + 6; yy < r - 3; yy += 7) for (let xx = -r + 6; xx < r - 3; xx += 7) {
    const ox = (Math.round((yy + r) / 7) % 2) * 3.5, px = xx + ox;
    if (px * px + yy * yy < (r - 6) * (r - 6)) holes += `<ellipse cx="${(cx + px).toFixed(1)}" cy="${(cy + yy).toFixed(1)}" rx="2.8" ry="2.5"/>`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c9e8a8" stroke="#4f8a3a" stroke-width="2.5"/><g fill="#fdfdf6" stroke="#8cbf6a" stroke-width=".6">${holes}</g>`;
};

export const art = {
  // 연못 풍경(도입 그림)
  opener: S(640, 300, `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe6f7"/><stop offset="1" stop-color="#f3f8fc"/></linearGradient>
      <linearGradient id="pw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fcbe9"/><stop offset="1" stop-color="#4f93c4"/></linearGradient></defs>
    <rect width="640" height="300" fill="url(#sky)"/>
    <path d="M0 120 Q160 96 320 116 T640 110 L640 170 L0 170Z" fill="#9cc47e"/>
    <g fill="#6f9e58"><ellipse cx="520" cy="112" rx="60" ry="22"/><ellipse cx="590" cy="104" rx="40" ry="26"/><ellipse cx="80" cy="112" rx="50" ry="18"/></g>
    <path d="M0 160 Q320 140 640 160 L640 300 L0 300Z" fill="url(#pw)"/>
    <path d="M40 200 q30 -4 60 0 M420 250 q40 -5 80 0 M250 280 q30 -4 60 0" stroke="#d6eefb" stroke-width="2" fill="none"/>
    ${CATTAIL(40, 172, 110)}${CATTAIL(82, 170, 96)}
    <path d="M170 196 a34 8 0 1 0 68 0 l-24 -2z" fill="#3f8f3a" stroke="#2a6128"/><path d="M236 214 a28 7 0 1 0 56 0 l-20 -2z" fill="#4a9a40" stroke="#2a6128"/>
    <g transform="translate(212 190)"><path d="M0 0 C-16 -2 -18 -14 -13 -21 C-7 -14 -2 -7 0 0Z M0 0 C16 -2 18 -14 13 -21 C7 -14 2 -7 0 0Z" fill="#f6c6d8" stroke="#d98aa8"/><path d="M0 0 C-7 -9 -6 -23 0 -28 C6 -23 7 -9 0 0Z" fill="#fbe0ea" stroke="#d98aa8"/></g>
    ${HYA(390, 200, 0.95, { roots: false, flower: true })}${HYA(470, 222, 0.8, { roots: false })}${HYA(548, 196, 0.75, { roots: false, flower: true })}${HYA(330, 240, 0.7, { roots: false, leaves: [-40, -8, 26, 56] })}
    ${[[120, 250], [134, 256], [150, 248], [110, 262], [600, 262], [614, 270], [590, 276]].map(([x, y]) => DUCK(x, y)).join('')}
    <g font-size="15" font-weight="700" fill="#1E3A78"><text x="410" y="80">부레옥잠</text><text x="160" y="160">수련</text><text x="10" y="44">부들</text></g>
    <path d="M440 84 L430 120" stroke="#1E3A78" stroke-width="1.5"/>
    <g font-size="12" fill="#5B6577"><text x="496" y="76">물 위에 둥둥 떠서 살아요</text><text x="96" y="296" fill="#fff">개구리밥</text></g>`),

  step1: S(300, 170, `${TANK(40, 22, 220, 138, 84)}${HYA(150, 90, 0.8, { leaves: [-50, -18, 16, 48] })}${WFRONT(40, 84, 220, 160)}
    <g font-size="12" fill="#1E3A78" font-weight="700"><text x="210" y="34">잎몸</text><text x="214" y="76">잎자루</text><text x="206" y="140">뿌리</text></g>
    <path d="M208 30 L184 30 M212 72 L176 78 M204 136 L168 128" stroke="#E23B2E" stroke-width="1.3"/>
    <text x="8" y="16" font-size="12" fill="#5B6577">물에 띄우고 생김새를 살펴요</text>`),
  step2: S(300, 170, `<path d="M114 156 C96 144 86 120 90 98 C94 78 106 62 114 42 L124 42 C132 62 144 78 148 98 C152 120 142 144 124 156Z" fill="#9fd06f" stroke="#4f8a3a" stroke-width="2"/>
    <path d="M100 120 C98 104 102 90 108 78" fill="none" stroke="#d6efb8" stroke-width="4" stroke-linecap="round"/>
    <path d="M70 104 L168 104" stroke="#E23B2E" stroke-width="2.5" stroke-dasharray="6 4"/><text x="174" y="108" font-size="12" font-weight="700" fill="#E23B2E">① 가로로 자르기</text>
    <path d="M119 30 L119 166" stroke="#1E3A78" stroke-width="2.5" stroke-dasharray="6 4"/><text x="8" y="62" font-size="12" font-weight="700" fill="#1E3A78">② 세로로</text><text x="8" y="78" font-size="12" font-weight="700" fill="#1E3A78">자르기</text>
    ${SCISSORS(206, 56, 160)}
    <circle cx="252" cy="140" r="15" fill="#eaf5fd" stroke="#5B6577" stroke-width="3"/><path d="M263 151 L278 165" stroke="#5B6577" stroke-width="5" stroke-linecap="round"/>
    <text x="8" y="16" font-size="12" fill="#5B6577">볼록한 잎자루를 잘라 돋보기로 봐요</text>`),
  step3: S(300, 170, `${TANK(20, 30, 260, 134, 50)}
    ${PET(196, 146, 0, 1.6)}
    <path d="M186 22 L186 126 C186 138 208 138 208 126 L208 22Z" fill="#f2c9a5" stroke="#c58f68" stroke-width="1.5"/>
    <path d="M190 122 C190 130 204 130 204 122 L204 114 L190 114Z" fill="#f8ddd0" stroke="#d9a68a" stroke-width="1"/>
    ${WFRONT(20, 50, 260, 164)}
    <path d="M170 116 l-10 -4 M168 132 h-12 M226 114 l10 -4 M228 130 h12" stroke="#E23B2E" stroke-width="2" stroke-linecap="round"/>
    <text x="216" y="44" font-size="15" font-weight="700" fill="#E23B2E">꾹!</text><text x="34" y="96" font-size="13" font-weight="700" fill="#1E3A78">무엇이 나올까?</text>
    <text x="8" y="16" font-size="12" fill="#5B6577">자른 잎자루를 물속에서 눌러요</text>`),
  step4: S(300, 170, `${HYA(64, 82, 0.6)}${CUTPLANT(182, 82, 0.6)}
    ${PET(256, 112, -20, 0.9)}${PET(266, 128, 10, 0.9)}${PET(250, 140, -4, 0.9)}
    ${SCISSORS(116, 44, 30)}
    <g font-size="13" font-weight="700" fill="#1E3A78"><text x="64" y="164" text-anchor="middle">가: 그대로</text><text x="182" y="164" text-anchor="middle">나: 잎자루를 떼어 냄</text></g>
    <text x="258" y="100" font-size="10" fill="#5B6577" text-anchor="middle">떼어 낸 잎자루</text>
    <text x="8" y="16" font-size="12" fill="#5B6577">크기가 비슷한 두 포기를 골라요</text>`),
  step5: S(300, 170, `${TANK(16, 108, 268, 58, 124)}
    ${HYA(84, 66, 0.5, { leaves: [-44, -12, 20, 50] })}${CUTPLANT(212, 66, 0.5)}
    <g stroke="#E23B2E" stroke-width="2.5" fill="#E23B2E"><path d="M120 56 L120 90"/><path d="M114 86 L120 96 L126 86Z"/><path d="M246 56 L246 90"/><path d="M240 86 L246 96 L252 86Z"/></g>
    <g font-size="20" font-weight="700" fill="#1E3A78"><text x="78" y="154">?</text><text x="206" y="154">?</text></g>
    <g font-size="13" font-weight="700" fill="#1E3A78"><text x="30" y="44">가</text><text x="168" y="44">나</text></g>
    <text x="8" y="16" font-size="12" fill="#5B6577">같은 수조에 살며시 띄워 비교해요</text>`),

  // 결과 기록 칸: 자른 면을 직접 그린다(답은 그리지 않는다)
  result: S(520, 200, `<rect x="20" y="30" width="230" height="160" rx="10" fill="#fff" stroke="#8a9aad" stroke-width="2" stroke-dasharray="7 5"/>
    <rect x="270" y="30" width="230" height="160" rx="10" fill="#fff" stroke="#8a9aad" stroke-width="2" stroke-dasharray="7 5"/>
    <circle cx="135" cy="112" r="56" fill="none" stroke="#c9d3e3" stroke-width="2"/>
    <rect x="345" y="50" width="80" height="120" rx="36" fill="none" stroke="#c9d3e3" stroke-width="2"/>
    <g font-size="15" font-weight="700" fill="#1E3A78"><text x="30" y="20">① 가로로 자른 면</text><text x="280" y="20">② 세로로 자른 면</text></g>
    <g font-size="11" fill="#8a9aad"><text x="135" y="182" text-anchor="middle">여기에 그려요</text><text x="385" y="182" text-anchor="middle">여기에 그려요</text></g>`),

  // 개념 노트: 연못 단면 — 물에 사는 식물의 네 가지 모습 + 잎자루 단면
  pond: S(640, 260, `<rect width="640" height="260" fill="#eef6fb"/>
    <path d="M0 96 L96 96 C130 100 150 130 176 150 C220 186 300 212 400 220 C480 226 560 224 640 222 L640 260 L0 260Z" fill="#9a7a58"/>
    <path d="M0 92 L96 92 C112 94 122 100 132 108" fill="none" stroke="#7fae5f" stroke-width="8"/>
    <path d="M118 96 L640 96 L640 222 C560 224 480 226 400 220 C300 212 220 186 176 150 C150 130 130 104 118 96Z" fill="#a8d6ef" opacity=".85"/>
    <path d="M118 96 L640 96" stroke="#4f9fdc" stroke-width="2.5"/>
    ${CATTAIL(146, 124, 120)}
    ${LILY(262, 186, 96)}
    ${HYDRILLA(402, 218, 100)}
    ${[[462, 96], [476, 97], [488, 95]].map(([x, y]) => DUCK(x, y)).join('')}
    ${HYA(556, 102, 0.72, { leaves: [-48, -16, 16, 48] })}${WFRONT(430, 96, 210, 124)}
    <g font-size="15" font-weight="700" fill="#1E3A78"><text x="104" y="22">물가</text><text x="220" y="22">잎이 떠서</text><text x="346" y="22">물속에 잠겨</text><text x="476" y="22">물에 떠서</text></g>
    <g font-size="12" fill="#5B6577"><text x="100" y="38">부들</text><text x="232" y="38">수련</text><text x="366" y="38">검정말</text><text x="466" y="38">개구리밥·부레옥잠</text></g>
    <path d="M598 146 L574 90" stroke="#E23B2E" stroke-width="1.5" stroke-dasharray="4 3"/><circle cx="572" cy="86" r="7" fill="none" stroke="#E23B2E" stroke-width="1.5"/>${SECTION(606, 170, 24)}
    <text x="606" y="210" font-size="12" font-weight="700" fill="#E23B2E" text-anchor="middle">잎자루 단면</text>`),

  // 개념 플러스: 사막과 극지방의 식물
  lands: S(320, 200, `<rect width="160" height="200" fill="#fbecc8"/><rect x="160" width="160" height="200" fill="#e3f0fa"/>
    <circle cx="130" cy="30" r="14" fill="#f7c948"/>
    <path d="M0 168 Q80 156 160 168 L160 200 L0 200Z" fill="#e2c07c"/><path d="M160 168 Q240 160 320 168 L320 200 L160 200Z" fill="#fff" stroke="#c9d9e8"/>
    <g fill="#5fa050" stroke="#3d7a35" stroke-width="1.5"><rect x="64" y="56" width="30" height="116" rx="15"/><path d="M64 122 h-18 a8 8 0 0 1 -8 -8 v-30 a8 8 0 0 1 16 0 v22 h10z"/><path d="M94 108 h16 v-28 a8 8 0 0 1 16 0 v36 a8 8 0 0 1 -8 8 h-24z"/></g>
    <path d="M72 64 v100 M79 60 v108 M86 64 v100" stroke="#8cc47a" stroke-width="1"/>
    <g stroke="#6b5a2a" stroke-width="1">${[[72, 74], [86, 90], [72, 110], [86, 128], [72, 146], [46, 90], [118, 86], [79, 58], [86, 156], [104, 116], [54, 116]].map(([x, y]) => `<path d="M${x} ${y} l-4 -4 M${x} ${y} l4 -4 M${x} ${y} l0 -6 M${x} ${y} l-5 1 M${x} ${y} l5 1"/>`).join('')}</g>
    <g fill="#4f8a3a">${[184, 197, 210, 223, 236, 249, 262, 275, 288, 301].map((x, i) => `<ellipse cx="${x}" cy="${163 - (i % 2) * 3}" rx="6" ry="3.5"/>`).join('')}</g>
    <path d="M178 167 C220 162 260 163 308 165" stroke="#7a5a3a" stroke-width="3" fill="none"/>
    <g fill="#e8b0c8"><ellipse cx="216" cy="152" rx="3" ry="6"/><ellipse cx="268" cy="151" rx="3" ry="6"/></g>
    <g fill="#fff" stroke="#c9d9e8">${[[186, 58], [226, 86], [296, 52], [262, 112], [200, 120], [304, 128]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3"/>`).join('')}</g>
    <path d="M308 82 h-44 M308 94 h-30" stroke="#8fb4d6" stroke-width="3" stroke-linecap="round"/><text x="232" y="74" font-size="15" fill="#5B6577">바람</text>
    <g font-size="20" font-weight="700" fill="#1E3A78"><text x="8" y="26">사막</text><text x="168" y="26">극지방</text></g>
    <g font-size="16" font-weight="700" fill="#5B6577"><text x="8" y="192">선인장</text><text x="206" y="192">북극버들</text></g>
    <path d="M118 80 L130 62" stroke="#E23B2E" stroke-width="1.5"/><text x="100" y="56" font-size="15" font-weight="700" fill="#E23B2E">가시=잎</text>`),
};

export const chapter = {
  unit: 's42-u01', book: 'GFIELD 실험 과학 영재', vol: '4-2', no: 1, title: '둥둥 부레옥잠의 비밀', theme: '#2B7A62',
  link: { course: '4학년 2학기', unit: 'Ⅰ. 식물의 생활', topics: ['강이나 연못에 사는 식물', '식물의 생김새와 사는 곳', '환경에 적응한 식물과 생체 모방'] },
  skills: ['가설 설정', '변인 통제', '관찰', '분류', '결론 도출'],
  qr: { scene: '../assets/qr-s42-u01-scene.svg', lab: '../assets/qr-s42-u01-lab.svg', kit: '../assets/qr-s42-u01-kit.svg' },
  intro: [
    '연못에 가면 동글동글한 잎을 세우고 물 위에 둥둥 떠 있는 풀을 볼 수 있어요. 부레옥잠이에요. 뿌리가 바닥 흙에 닿지 않는데도 가라앉지 않고, 바람이 불면 물 위를 이리저리 떠다녀요.',
    '연못에는 부레옥잠 말고도 여러 식물이 살아요. 물가에 곧게 선 부들, 바닥 흙에 뿌리를 내리고 잎만 물 위에 띄운 수련, 몸 전체가 물속에 잠긴 검정말처럼 사는 모습이 저마다 달라요. 오늘은 부레옥잠의 볼록한 잎자루를 잘라 보고 눌러 보며, 물에 떠서 사는 비밀을 풀어 봐요.',
  ],
  think: [
    { q: '물놀이할 때 튜브나 구명조끼를 입으면 몸이 잘 뜨는 까닭은 무엇일까요?', a: '튜브와 구명조끼 속에 공기가 들어 있어서 물에 잘 뜬다 등' },
    { q: '연못이나 강가에서 본 식물을 떠올려 보세요. 어디에서 어떤 모습으로 자라고 있었나요?', a: '물가에 키 큰 풀이 곧게 서 있었다, 동그란 잎이 물 위에 떠 있었다, 물속에 가는 풀이 흔들리고 있었다 등' },
  ],
  goal: '부레옥잠의 잎자루를 관찰하고, 잎자루가 있을 때와 없을 때 물에 뜨는 모습을 비교해 부레옥잠이 물에 떠서 사는 까닭을 알아보자.',
  materials: {
    kit: ['부레옥잠 3포기(크기가 비슷한 것)', '투명한 수조', '돋보기', '어린이용 가위', '물에 사는 식물 카드 9장'],
    student: ['물', '키친타월', '신문지', '색연필'],
  },
  hypothesis: { hint: '볼록한 잎자루 속에 무엇이 들어 있을지, 잎자루를 떼어 내면 뜨는 모습이 어떻게 달라질지 예상해 보세요.', a: '볼록한 잎자루 속에 공기가 들어 있어서, 잎자루가 있는 부레옥잠이 잎자루를 떼어 낸 부레옥잠보다 물에 더 잘 뜰 것이다.' },
  design: {
    change: { q: '바꿀 조건', a: '잎자루가 있는가, 없는가(가: 그대로 둔 부레옥잠 / 나: 볼록한 잎자루를 모두 떼어 낸 부레옥잠)' },
    same: { q: '같게 할 조건', a: '부레옥잠의 크기와 뿌리 길이, 수조와 물의 양, 물에 놓는 방법(살며시 띄우기), 관찰하는 시간' },
    measure: { q: '관찰할 것', a: '물 위로 나온 정도와 기울어진 모습, 눌렀다 놓았을 때 다시 떠오르는지, 잎자루를 자른 면의 모습과 물속에서 눌렀을 때 나오는 것' },
  },
  steps: [
    { art: 'step1', text: '투명한 수조에 물을 담고 부레옥잠 한 포기를 띄워요. 잎몸, 볼록한 잎자루, 물속 뿌리가 어떻게 생겼는지 관찰하고, 잎자루를 손가락으로 살짝 눌러 느낌을 적어요.', tip: '잎자루는 가운데가 볼록해요. 볼록한 곳과 가느다란 곳을 번갈아 눌러 보세요.' },
    { art: 'step2', text: '보호자와 함께 볼록한 잎자루 하나를 잘라 내어, 한 조각은 가로로, 다른 조각은 세로로 잘라요. 자른 면을 돋보기로 관찰해요.', tip: '가로로 자른 면은 동그랗고, 세로로 자른 면은 길쭉해요. 두 면을 모두 그려 두세요.' },
    { art: 'step3', text: '잘라 낸 잎자루 조각을 수조 물속에 넣고 손가락으로 꾹 눌러요. 무엇이 나오는지 관찰하고, 손을 떼면 조각이 어떻게 되는지도 봐요.', tip: '눈높이를 물 높이에 맞추면 작은 것도 잘 보여요.' },
    { art: 'step4', text: '크기와 뿌리 길이가 비슷한 부레옥잠 두 포기를 골라요. 가는 그대로 두고, 나는 볼록한 잎자루를 가위로 모두 떼어 내요.', tip: '떼어 낸 잎자루는 버리지 말고 모아 두었다가 물에 띄워 보세요.' },
    { art: 'step5', text: '가와 나를 같은 수조에 살며시 띄우고 물 위로 나온 정도와 기울어진 모습을 비교해요. 두 포기를 손가락으로 물속까지 살짝 눌렀다 놓아 보기도 해요.', tip: '기다리는 동안 식물 카드를 사는 모습에 따라 나누어 보세요.' },
  ],
  wonder: { q: '잘라 낸 잎자루 조각을 손으로 여러 번 꼭 짜서 공기를 뺀 뒤 다시 물에 넣으면 어떻게 될까요?', a: '속에 있던 공기가 빠지고 그 자리에 물이 들어가, 처음보다 물에 덜 뜨거나 가라앉을 수 있다.' },
  caution: ['두 포기를 비교할 때는 잎자루 말고 다른 조건은 모두 같게 해요.', '가위는 보호자와 함께 쓰고, 자른 면이 손을 향하지 않게 해요.', '관찰한 부레옥잠은 하천이나 저수지에 버리지 않아요.'],
  results: [
    { q: '잎자루를 가로와 세로로 자른 면을 그리고, 물속에서 눌렀을 때 나온 것을 쓰세요.', art: 'result',
      a: '(예시) 가로로 자른 면: 스펀지처럼 작은 구멍이 빽빽하다. 세로로 자른 면: 작은 방이 길게 줄지어 있다. 물속에서 누르면 공기방울이 나왔다.' },
    { q: '가(그대로)와 나(잎자루를 떼어 냄)를 물에 띄웠을 때를 비교해 쓰세요.', table: ['', '물에 뜬 모습', '눌렀다 놓았을 때'], rows: ['가: 그대로', '나: 잎자루 없음'],
      a: '(예시) 가: 잎을 세우고 똑바로 떠 있었고, 눌렀다 놓으니 바로 떠올랐다. 나: 물속에 더 깊이 잠기고 기울었으며, 눌렀다 놓으니 천천히 올라오거나 잘 떠오르지 않았다.' },
    { q: '식물 카드 9장을 사는 모습에 따라 네 무리로 나누어 쓰세요.', table: ['', '식물 이름'], rows: ['물에 떠서', '잎이 물에 떠서', '물속에 잠겨서', '물가에서'],
      a: '물에 떠서: 부레옥잠, 개구리밥, 물상추 / 잎이 물에 떠서: 수련, 연꽃 / 물속에 잠겨서: 검정말, 나사말 / 물가에서: 부들, 갈대' },
  ],
  conclusion: [
    { q: '부레옥잠이 물에 떠서 살 수 있는 까닭을 잎자루의 생김새와 관련지어 쓰세요.', a: '볼록한 잎자루 속에 스펀지처럼 작은 공기주머니가 많아 공기가 가득 들어 있기 때문이다.' },
    { q: '잎자루가 있는지 없는지만 다르게 한 실험에서 알 수 있는 것을 쓰세요.', a: '잎자루를 떼어 내면 잘 뜨지 못하므로, 공기가 든 잎자루가 부레옥잠을 물에 뜨게 한다는 것을 알 수 있다.' },
    { q: '부레옥잠과 수련은 둘 다 잎이 물 위에 있지만 사는 모습이 달라요. 무엇이 다른지 쓰세요.', a: '부레옥잠은 뿌리를 땅에 내리지 않고 물에 떠서 떠다니고, 수련은 뿌리를 물 바닥 흙에 내리고 긴 잎자루로 잎만 물 위에 띄운다.' },
  ],
  note: {
    title: '강이나 연못에 사는 식물',
    art: 'pond',
    table: {
      head: ['사는 모습', '예', '생김새의 특징'],
      rows: [
        ['물에 떠서', '부레옥잠, 개구리밥, 물상추', '잎자루에 공기주머니가 있거나 몸이 가볍다. 뿌리는 물속에 늘어져 있다.'],
        ['잎이 물에 떠서', '수련, 연꽃', '뿌리는 물 바닥 흙에 내리고, 긴 잎자루로 넓은 잎을 물 위에 띄운다.'],
        ['물속에 잠겨서', '검정말, 나사말', '줄기와 잎이 가늘고 부드러워 물살에 잘 휘어진다.'],
        ['물가에서', '부들, 갈대', '물가 땅에 뿌리를 내리고, 줄기가 곧고 단단하며 키가 크다.'],
      ],
    },
    points: ['식물은 사는 곳의 환경에 알맞은 생김새를 가지고 있어요. 이것을 적응이라고 해요.', '부레옥잠의 볼록한 잎자루는 구명조끼처럼 속에 공기가 가득해서 물에 떠요.'],
    plus: { title: '사막과 극지방의 식물', art: 'lands', text: '건조한 사막의 선인장은 잎이 가시 모양이라 물이 덜 빠져나가고, 굵은 줄기에 물을 저장해요. 매우 춥고 바람이 강한 극지방의 북극버들은 키가 아주 작아 땅에 붙어 자라요. 사는 곳이 다르면 식물의 생김새도 달라요.' },
  },
  discuss: {
    q: '관찰을 마친 부레옥잠을 가까운 하천이나 저수지에 놓아주어도 될까요? 부레옥잠이 물 위에서 빠르게 늘어나는 식물이라는 점과 물속에 사는 식물을 함께 생각해 이야기해 보세요.',
    a: '예) 놓아주면 안 된다. 부레옥잠이 빠르게 늘어나 물 위를 빽빽하게 덮으면 물속에 햇빛이 덜 들어가 검정말 같은 물속 식물이 자라기 어렵고, 물고기가 살기 힘들어질 수 있다. 관찰 뒤에는 수조에서 기르거나 말려서 버린다.',
  },
  creative: {
    q: '부레옥잠 잎자루의 특징을 본떠, 물에 빠진 사람을 도울 수 있는 물건을 설계해 보세요. 어떤 모양과 재료로 만들지, 부레옥잠의 어떤 특징을 본떴는지 함께 쓰세요.',
    a: '예) 작은 공기 방이 많은 스펀지 같은 재료로 만든 구명 띠. 한 곳이 찢어져도 다른 방의 공기가 남아 계속 뜬다. 잎자루 속에 작은 공기주머니가 많은 특징을 본떴다.',
  },
  gifted: {
    title: '생각 넓히기 — 공기의 힘으로 물에 뜨는 것은?',
    lead: '부레옥잠은 잎자루 속 공기 덕분에 물에 떠요. 이처럼 속에 든 공기 덕분에 물에 뜨는 것을 되도록 많이, 서로 다른 갈래로 찾아 써 보세요.',
    rows: ['우리 생활', '자연(동물·식물)', '놀이·운동'],
    a: { '우리 생활': '구명조끼, 구명 튜브, 스티로폼 부표, 빈 페트병 뗏목, 공기 주머니가 든 배', '자연(동물·식물)': '물고기의 부레, 물새 깃털 사이의 공기, 부레옥잠 잎자루, 속이 가벼운 야자 열매', '놀이·운동': '물놀이 튜브, 비치볼, 물놀이 매트, 수영 보조 킥판' },
    rubric: [
      '유창성: 알맞은 생각의 개수(3~5개 1점, 6~8개 2점, 9개 이상 3점)',
      '융통성: 생각이 속한 서로 다른 갈래의 수(생활·자연·놀이·안전 등 2갈래 1점, 3갈래 2점, 4갈래 이상 3점)',
      '독창성: 다른 친구들이 잘 떠올리지 못한 생각(1~2개 1점, 3개 이상 2점)',
    ],
  },
  flow: [['볼록한 잎자루', '자르면 작은 구멍', '스펀지 같은 속'], ['공기주머니', '공기가 가득', '누르면 공기방울'], ['물에 뜬다', '물 위에서 산다', '환경에 적응']],
  // 개념 정리(빈칸 {{답}} — 학생용은 ⓐ____, 답은 옆날개 아래 작은 글씨로)
  concept: [
    { tag: 'A', title: '물에 떠서 사는 부레옥잠', lines: [
      ['잎자루', '부레옥잠의 잎자루는 가운데가 {{볼록}}하고, 속에 스펀지 같은 {{공기주머니}}가 많다'],
      ['물속에서 누르면', '잎자루에서 {{공기방울}}이 나오고, 손을 떼면 다시 떠오른다'],
      ['뿌리', '땅에 내리지 않고 {{물속}}에 늘어져 있다'],
      ['적응', '생물이 오랜 기간에 걸쳐 사는 곳의 {{환경}}에 알맞게 변해 가는 것'],
    ] },
    { tag: 'B', title: '강이나 연못에 사는 식물', table: {
      head: ['사는 모습', '예', '생김새'],
      rows: [
        ['물에 떠서', '부레옥잠, {{개구리밥}}', '잎자루에 공기주머니, 뿌리는 물속에'],
        ['잎이 물에 떠서', '수련, 연꽃', '뿌리는 물 바닥 {{흙}}에, 긴 잎자루'],
        ['물속에 잠겨서', '검정말, 나사말', '줄기·잎이 가늘고 {{부드러워}} 잘 휘어짐'],
        ['물가에서', '부들, 갈대', '줄기가 곧고 단단하며 키가 {{크다}}'],
      ],
    } },
    { tag: 'C', title: '들과 산, 사막과 극지방의 식물', lines: [
      ['잎과 분류 기준', '잎몸·잎자루·잎맥을 비교해, 누가 해도 {{같은}} 결과가 나오는 기준으로 나눈다'],
      ['풀과 나무', '나무는 줄기가 굵고 단단하며 모두 {{여러해살이}}, 벼·강아지풀은 한해살이 풀'],
      ['사막', '선인장은 잎이 {{가시}} 모양이라 물이 덜 빠져나가고, 굵은 줄기에 물을 저장한다'],
      ['극지방', '북극버들은 키가 {{작아}} 땅에 붙어 자라며 추위와 강한 바람을 견딘다'],
    ] },
  ],
  more: { title: '더 알아보기 · 식물에게 배운 발명(생체 모방)', text: '도꼬마리 열매의 갈고리 가시를 본떠 찍찍이 테이프를, 물방울이 굴러떨어지는 연잎을 본떠 물이 스며들지 않는 옷감을, 빙글빙글 돌며 떨어지는 단풍나무 열매를 본떠 드론 날개를 만들었어요. 부레옥잠의 공기주머니처럼 식물의 생김새에는 사는 곳에 알맞은 비밀이 숨어 있어요.' },
  glossary: [
    ['잎자루', '우리말', '잎 + 자루', '잎몸과 줄기를 이어 주는 자루 부분'],
    ['단면', '斷面', '끊을 단 · 낯 면', '물체를 잘랐을 때 드러나는 면'],
    ['공기주머니', '우리말', '공기 + 주머니', '식물이나 동물의 몸속에서 공기가 들어 있는 작은 빈 곳'],
    ['분류', '分類', '나눌 분 · 무리 류', '기준을 정해 같은 것끼리 무리 지어 나눔'],
    ['환경', '環境', '고리 환 · 지경 경', '생물이 사는 곳을 둘러싼 물·햇빛·온도·흙 같은 조건'],
    ['적응', '適應', '맞을 적 · 응할 응', '생물이 사는 곳의 환경에 알맞게 변해 가는 것'],
    ['모방', '模倣', '본뜰 모 · 본뜰 방', '다른 것을 본떠서 따라 함'],
  ],
  // 옆날개(쪽마다) — 플러스 노트
  rail: {
    1: [{ h: '교과서 연결', t: '4학년 2학기 Ⅰ. 식물의 생활 · 강이나 연못에 사는 식물, 환경에 적응한 식물' }, { g: ['잎자루'] }],
    2: [{ h: '조건 정하기', t: '크기가 다른 부레옥잠을 쓰면, 뜨는 모습이 달라진 까닭이 잎자루 때문인지 크기 때문인지 알 수 없어요.' }, { g: ['단면'] }],
    3: [{ h: '이름 속 힌트', t: '“부레”는 물고기 몸속에 있는 공기주머니의 이름이에요. 이름에 뜨는 비밀이 숨어 있어요.' }, { g: ['공기주머니'] }],
    4: [{ h: '재료 바꾸기', t: '부레옥잠이 없으면 시장에서 파는 연근(연꽃의 땅속줄기)을 잘라 봐도 공기가 지나는 구멍을 볼 수 있어요.' }, { h: '안전', t: '실험이 끝난 물과 식물은 하수구나 하천에 버리지 않아요.' }],
    5: [{ g: ['분류'] }, { h: '분류 기준', t: '“어디에서, 어떻게 사는가?”처럼 누가 해도 같은 결과가 나오는 기준으로 나눠요.' }],
    6: [{ h: '실험과 잇기', t: '실험의 가(그대로)와 나(잎자루 없음)를 비교한 결과가 적응의 증거예요.' }, { g: ['환경', '적응'] }],
    7: [{ h: '생각을 넓히는 법', t: '“어디에 쓰일까? 누구에게 도움이 될까? 부족한 점은?”처럼 갈래를 바꿔 보세요.' }, { g: ['모방'] }],
    8: [{ h: '확인 문제', t: '4학년 2학기 단원평가 유형과 같은 모양으로 새로 쓴 문제예요.' }],
  },
  report: {
    sections: [
      { label: '① 탐구 문제', hint: '무엇을 알아보려고 했나요?', a: '부레옥잠이 물에 떠서 살 수 있는 까닭은 무엇일까?', lines: 2 },
      { label: '② 가설', hint: '“~하면 ~할 것이다”로 써요.', a: '잎자루 속에 공기가 들어 있어서, 잎자루를 떼어 내면 잘 뜨지 못할 것이다.', lines: 2 },
      { label: '③ 바꿀 조건 / 같게 할 조건', a: '바꿀 조건: 잎자루가 있는가 없는가 / 같게 할 조건: 부레옥잠 크기, 수조와 물의 양, 띄우는 방법', lines: 1 },
      { label: '④ 준비물', a: '부레옥잠, 투명한 수조, 돋보기, 어린이용 가위, 식물 카드, 물', lines: 1 },
      { label: '⑤ 실험 과정', hint: '순서대로 번호를 붙여 써요.', a: '① 부레옥잠 관찰하기 ② 잎자루 가로·세로로 자르기 ③ 물속에서 눌러 보기 ④ 잎자루 떼어 낸 것 만들기 ⑤ 두 포기 띄워 비교하기', lines: 2 },
      { label: '⑥ 결과', hint: '자른 면, 눌렀을 때, 두 포기의 차이를 그림이나 표로.', a: '자른 면에 작은 구멍이 많았고, 누르면 공기방울이 나왔다. 잎자루를 떼어 낸 부레옥잠은 더 깊이 잠기고 기울었다.', lines: 3 },
      { label: '⑦ 결론', a: '부레옥잠은 잎자루 속 공기주머니 덕분에 물에 떠서 산다. 물 위에서 사는 환경에 적응한 생김새이다.', lines: 2 },
      { label: '⑧ 다른 식물과 이어 보기', hint: '수련·검정말·부들과 무엇이 다른가요?', a: '수련은 바닥 흙에 뿌리를 내리고, 검정말은 물속에 잠겨 살고, 부들은 물가 땅에 뿌리를 내린다.', lines: 1 },
      { label: '⑨ 더 알고 싶은 점 · 아쉬운 점', lines: 1 },
    ],
    checks: ['바꾼 조건이 잎자루 하나뿐이었나요?', '자른 면을 그림으로 남겼나요?', '결론이 관찰 결과에서 나왔나요?', '다른 물 식물과 비교해 생각했나요?'],
  },
  formative: {
    items: ['2-8', '4-9', '4-10', '3-17'],
    standards: ['부레옥잠이 물에 떠서 사는 까닭을 잎자루의 생김새로 설명할 수 있다.', '강이나 연못에 사는 식물을 사는 모습에 따라 분류할 수 있다.', '사막·극지방 식물의 생김새를 사는 곳의 환경과 관련지어 설명할 수 있다.'],
  },
  // 교과 확인 문제: 우리 유사문항 id(sourceRef 세트-번호로 고름)
  check: ['3-10', '4-15', '1-7', '1-3', '2-11', '4-19'],
};

// 수업 교안(가르치기 화면) — 90분 한 차시. phase 순서대로 슬라이드가 나뉘고, say는 강사 발문(학생 화면엔 안 나옴).
export const plan = {
  minutes: 90,
  phases: [
    { id: 'open', name: '도입', min: 10, aim: '튜브·구명조끼 경험 떠올리기 → 3D 연못에서 부레옥잠 먼저 보기' },
    { id: 'design', name: '탐구 설계', min: 15, aim: '가설 세우기, 바꿀 조건(잎자루 유무)·같게 할 조건 정하기' },
    { id: 'lab', name: '실험', min: 25, aim: '잎자루 자르기·누르기 → 두 포기 띄워 비교 → 3D 실험실에서 연못 곳곳에 심어 보기' },
    { id: 'result', name: '결과·결론', min: 15, aim: '자른 면 그리기, 비교표 쓰기, 식물 카드 분류 → 공기주머니로 설명' },
    { id: 'concept', name: '개념', min: 10, aim: '물에 사는 식물의 네 가지 모습, 사막·극지방 식물과 적응' },
    { id: 'extend', name: '확장', min: 10, aim: '토의 · 창의력 · 영재성(유창성·융통성·독창성)' },
    { id: 'check', name: '확인', min: 5, aim: '교과 확인 문제 풀고 함께 채점' },
  ],
  say: {
    cover: '오늘은 물 위에 둥둥 떠 있는 부레옥잠의 비밀을 직접 잘라 보고 눌러 보며 풀어 봐요.',
    think: '두세 명에게 발표시키고, "공기" 낱말이 나오면 칠판에 크게 적어 두세요. 실험 끝에 다시 돌아옵니다.',
    scene: '재생 전에 "뿌리가 바닥에 안 닿는데 어떻게 뜰까?"를 먼저 묻고, 예상을 두세 개 받은 뒤 재생합니다.',
    hypo: '"~하면 ~할 것이다" 꼴로 쓰게 하세요. "잎자루를 떼어 내면"으로 시작하게 하면 설계로 자연스럽게 이어집니다.',
    design: '크기가 다른 두 포기를 고르려는 학생이 있어요. "크기도 다르고 잎자루도 다르면 무엇 때문인지 알 수 있을까?"로 되물으세요.',
    step1: '잎자루를 누를 때 너무 세게 누르면 터집니다. 말랑말랑한 느낌을 말로 표현하게 하세요.',
    step2: '자르기는 강사가 시범을 보이고, 모둠마다 보호자 역할 한 명이 가위를 맡게 합니다.',
    step3: '물속에서 누를 때 수조 옆에서 눈높이를 맞추게 하세요. 나온 것이 무엇인지는 학생 말로 먼저 듣습니다.',
    step5: '두 포기를 동시에 살며시 놓게 하세요. 던지듯 넣으면 비교가 흐려집니다. 기다리는 동안 식물 카드 분류를 합니다.',
    lab: '연못의 땅·물가·깊은 물에 네 식물을 심어 보게 하고, 잘 산 곳과 시든 곳을 표에 적게 하세요. 부레옥잠 누르기와 잎자루 자르기도 여기서 다시 확인합니다.',
    wonder: '공기를 짜낸 조각은 실제로 해 보면 좋아요. 처음 조각과 나란히 띄워 비교합니다.',
    res: '모둠별 비교표를 칠판에 모으면 "잎자루가 없으면 덜 뜬다"가 뚜렷해집니다. 결과는 모둠마다 조금씩 달라도 괜찮아요.',
    concl: '공기주머니 → 뜬다 → 물 위에서 산다 → 적응, 이 순서로 낱말을 붙여 줍니다.',
    note: '부레옥잠과 수련을 헷갈리는 학생이 많아요. "수련은 뿌리가 어디에 있지?"를 꼭 짚어 주세요.',
    plus: '물에 사는 식물 → 사막 → 극지방 순서로 "사는 곳이 다르면 생김새가 다르다"를 한 문장으로 정리하게 하세요.',
    discuss: '정답은 "놓아주지 않는다" 쪽이지만, 까닭이 물속 식물·햇빛과 이어지는지를 봐 주세요.',
    gifted: '3분 동안 개수 경쟁 → 생활·자연·놀이 갈래로 묶어 보며 융통성을 짚어 줍니다.',
    test: '1분 풀이 → 손들기 → 정답 공개 순서로 진행합니다.',
  },
};
