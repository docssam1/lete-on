// 태양계와 별 교재의 별자리 도판(SVG). 별 위치는 실제 적경(시)·적위(도)·밝기(등급)로 계산한다 — 손으로 찍은 점이 아니다.
// 북쪽 하늘: 북극성을 가운데 둔 방위 투영(7월 15일 서울, 지방 항성시 21시 ≈ 16.05시). 계절 별자리: 별자리 가운데를 기준으로 한 평면 투영.
const S = (w, h, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" font-family="Pretendard, sans-serif">${body}</svg>`;
const NAVY = '#0f1d3d', NAVY2 = '#1d3266', LINE = '#8fb4ff', STAR = '#fffaf0', TXT = '#dfe8ff';
const rad = (m) => Math.max(1.5, Math.min(6.2, 5.4 - 1.25 * m));          // 등급 → 점 반지름(밝을수록 크게)
const dot = (x, y, m, glow = false) => `${glow ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rad(m) * 2.6).toFixed(1)}" fill="url(#glow)"/>` : ''}<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad(m).toFixed(1)}" fill="${STAR}"/>`;
const DEFS = `<defs><radialGradient id="glow"><stop offset="0" stop-color="#fff6d8" stop-opacity=".55"/><stop offset="1" stop-color="#fff6d8" stop-opacity="0"/></radialGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY2}"/></linearGradient></defs>`;

// [이름, 적경(시), 적위(도), 등급]
const ST = {
  polaris: [2.530, 89.26, 2.0],
  dubhe: [11.062, 61.75, 1.8], merak: [11.031, 56.38, 2.4], phecda: [11.897, 53.69, 2.4], megrez: [12.257, 57.03, 3.3], alioth: [12.900, 55.96, 1.8], mizar: [13.399, 54.93, 2.2], alkaid: [13.792, 49.31, 1.9],
  caph: [0.153, 59.15, 2.3], schedar: [0.675, 56.54, 2.2], gcas: [0.945, 60.72, 2.2], ruchbah: [1.430, 60.24, 2.7], segin: [1.907, 63.67, 3.4],
  kochab: [14.845, 74.16, 2.1], pherkad: [15.345, 71.83, 3.0], yildun: [17.537, 86.59, 4.4], eumi: [16.766, 82.04, 4.2], zumi: [15.734, 77.79, 4.3], etaumi: [16.292, 75.76, 5.0],
  regulus: [10.140, 11.97, 1.4], etaleo: [10.122, 16.76, 3.5], algieba: [10.333, 19.84, 2.0], adhafera: [10.278, 23.42, 3.4], rasalas: [9.880, 26.0, 3.9], epsleo: [9.764, 23.77, 3.0], zosma: [11.235, 20.52, 2.6], chertan: [11.237, 15.43, 3.3], denebola: [11.818, 14.57, 2.1],
  vega: [18.616, 38.78, 0.0], zlyr: [18.746, 37.6, 4.3], dlyr: [18.908, 36.9, 4.2], glyr: [18.982, 32.69, 3.2], blyr: [18.835, 33.36, 3.5],
  deneb: [20.690, 45.28, 1.3], sadr: [20.370, 40.26, 2.2], albireo: [19.512, 27.96, 3.1], dcyg: [19.750, 45.13, 2.9], gienah: [20.770, 33.97, 2.5],
  altair: [19.846, 8.87, 0.8], tarazed: [19.771, 10.61, 2.7], alshain: [19.922, 6.41, 3.7], zaql: [19.090, 13.86, 3.0], daql: [19.425, 3.11, 3.4], taql: [20.188, -0.82, 3.2], laql: [19.104, -4.88, 3.4],
  markab: [23.079, 15.21, 2.5], scheat: [23.063, 28.08, 2.4], algenib: [0.220, 15.18, 2.8], alpheratz: [0.140, 29.09, 2.1], dand: [0.655, 30.86, 3.3], mirach: [1.162, 35.62, 2.1], almach: [2.065, 42.33, 2.1],
  betelgeuse: [5.919, 7.41, 0.5], bellatrix: [5.419, 6.35, 1.6], rigel: [5.242, -8.2, 0.1], saiph: [5.796, -9.67, 2.1], alnitak: [5.679, -1.94, 1.8], alnilam: [5.604, -1.2, 1.7], mintaka: [5.533, -0.3, 2.2], meissa: [5.585, 9.93, 3.4],
  sirius: [6.752, -16.72, -1.5], procyon: [7.655, 5.22, 0.4],
};

// ── 북쪽 하늘의 일주 운동 ─────────────────────────────────────────────
// 북쪽을 바라볼 때: 시간각 H(서쪽이 +)만큼 북극성 둘레를 시계 반대 방향으로 돈다. x = -ρ sin H, 위 = ρ cos H (ρ = 90° - 적위)
export function northSky() {
  const W = 640, H = 430, cx = 330, cy = 176, k = 3.9, LAT = 37.5;
  const pos = (id, lst) => { const [ra, dec] = ST[id], rho = 90 - dec, h = ((lst - ra) * 15) * Math.PI / 180; return [cx - k * rho * Math.sin(h), cy - k * rho * Math.cos(h)]; };
  const fig = (ids, lines, lst, op = 1, bright = true) => `<g opacity="${op}">${lines.map(([a, b]) => { const [x1, y1] = pos(a, lst), [x2, y2] = pos(b, lst); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${LINE}" stroke-width="1.6" stroke-opacity=".75"/>`; }).join('')}
    ${ids.map((id) => { const [x, y] = pos(id, lst); return dot(x, y, ST[id][2], bright && ST[id][2] < 2); }).join('')}</g>`;
  const DIP = ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'], DIPL = [['dubhe', 'merak'], ['merak', 'phecda'], ['phecda', 'megrez'], ['megrez', 'dubhe'], ['megrez', 'alioth'], ['alioth', 'mizar'], ['mizar', 'alkaid']];
  const UMI = ['polaris', 'yildun', 'eumi', 'zumi', 'kochab', 'pherkad', 'etaumi'], UMIL = [['polaris', 'yildun'], ['yildun', 'eumi'], ['eumi', 'zumi'], ['zumi', 'kochab'], ['kochab', 'pherkad'], ['pherkad', 'etaumi'], ['etaumi', 'zumi']];
  const CAS = ['caph', 'schedar', 'gcas', 'ruchbah', 'segin'], CASL = [['caph', 'schedar'], ['schedar', 'gcas'], ['gcas', 'ruchbah'], ['ruchbah', 'segin']];
  const T = [[16.05, '밤 9시'], [19.06, '밤 12시'], [22.07, '새벽 3시']];
  const hz = cy + k * LAT;                                                    // 지평선: 북극성 고도(위도)만큼 아래
  const labelAt = (lst, t, dy, dx = -34) => { const [x, y] = pos('alioth', lst); return `<text x="${(x + dx).toFixed(0)}" y="${(y + dy).toFixed(0)}" font-size="18" font-weight="800" fill="#ffd36a" text-anchor="middle">${t}</text>`; };
  return S(W, H, `${DEFS}<rect width="${W}" height="${H}" rx="22" fill="url(#sky)"/>
    <circle cx="${cx}" cy="${cy}" r="${(k * 38).toFixed(0)}" fill="none" stroke="#c8d8ff" stroke-opacity=".35" stroke-width="1.6" stroke-dasharray="5 6"/>
    <path d="M${cx + 70} ${cy - 128} A 148 148 0 0 0 ${cx - 70} ${cy - 128}" fill="none" stroke="#ffd36a" stroke-width="2.4" stroke-opacity=".9"/><path d="M${cx - 70} ${cy - 128} l 14 -10 l -2 16z" fill="#ffd36a"/>
    ${T.map(([lst], i) => fig(DIP, DIPL, lst, [1, 0.72, 0.5][i], i === 0)).join('')}
    ${fig(UMI, UMIL, 16.05, 0.55, false)}${fig(CAS, CASL, 16.05, 0.85, false)}
    ${(() => { const [x, y] = pos('polaris', 16.05); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="url(#glow)"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5.2" fill="${STAR}"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="none" stroke="#ffd36a" stroke-width="1.6"/>`; })()}
    ${T.map(([lst, t], i) => labelAt(lst, t, [-18, -16, 26][i], [-34, -62, -40][i])).join('')}
    <g font-size="16.5" font-weight="700" fill="${TXT}"><text x="${(pos('polaris', 16.05)[0] + 16).toFixed(0)}" y="${(pos('polaris', 16.05)[1] + 5).toFixed(0)}" fill="#ffd36a" font-size="18" font-weight="800">북극성</text>
      <text x="${(pos('caph', 16.05)[0] + 26).toFixed(0)}" y="${(pos('caph', 16.05)[1] + 22).toFixed(0)}">카시오페이아자리</text>
      <text x="${(pos('kochab', 16.05)[0] + 4).toFixed(0)}" y="${(pos('kochab', 16.05)[1] - 16).toFixed(0)}" fill-opacity=".8" text-anchor="middle">작은곰자리</text>
      <text x="${(pos('dubhe', 16.05)[0] + 4).toFixed(0)}" y="${(pos('dubhe', 16.05)[1] - 12).toFixed(0)}">북두칠성</text></g>
    <text x="${cx}" y="${cy - 156}" font-size="15" font-weight="700" fill="#ffd36a" text-anchor="middle">1시간에 약 15°씩 시계 반대 방향</text>
    <path d="M0 ${hz.toFixed(0)} q 60 -18 120 -6 t 120 -10 t 110 8 t 120 -14 t 170 10 V ${H} H 0z" fill="#0a1226"/>
    <text x="24" y="${H - 18}" font-size="16" font-weight="700" fill="#9fb2d8">북쪽 하늘 · 7월 15일 · 서울(북위 37.5°)</text>`);
}

// ── 계절별 별자리(저녁 9시경 남쪽 하늘의 대표 별자리) ──────────────────────
const PANELS = {
  spring: { t: '봄 · 사자자리', ra0: 10.8, dec0: 19, k: 9.5,
    ids: ['regulus', 'etaleo', 'algieba', 'adhafera', 'rasalas', 'epsleo', 'zosma', 'chertan', 'denebola'],
    lines: [['epsleo', 'rasalas'], ['rasalas', 'adhafera'], ['adhafera', 'algieba'], ['algieba', 'etaleo'], ['etaleo', 'regulus'], ['algieba', 'zosma'], ['zosma', 'denebola'], ['denebola', 'chertan'], ['chertan', 'regulus'], ['zosma', 'chertan']],
    names: [['regulus', '레굴루스', 0, 22], ['denebola', '데네볼라', 6, 22, 'start']] },
  summer: { t: '여름 · 여름철 대삼각형', ra0: 19.65, dec0: 22, k: 4.8,
    ids: ['vega', 'zlyr', 'dlyr', 'glyr', 'blyr', 'deneb', 'sadr', 'albireo', 'dcyg', 'gienah', 'altair', 'tarazed', 'alshain', 'zaql', 'daql', 'taql', 'laql'],
    lines: [['vega', 'zlyr'], ['zlyr', 'dlyr'], ['dlyr', 'glyr'], ['glyr', 'blyr'], ['blyr', 'zlyr'], ['deneb', 'sadr'], ['sadr', 'albireo'], ['dcyg', 'sadr'], ['sadr', 'gienah'], ['zaql', 'tarazed'], ['tarazed', 'altair'], ['altair', 'alshain'], ['alshain', 'taql'], ['altair', 'daql'], ['daql', 'laql']],
    tri: ['vega', 'deneb', 'altair'], rowNames: [['deneb', '데네브', 0, -14], ['vega', '직녀성', 0, -16], ['altair', '견우성', 14, 5, 'start']], names: [['vega', '직녀성(거문고)', 12, 5, 'start'], ['deneb', '데네브(백조)', -12, 5, 'end'], ['altair', '견우성(독수리)', 12, 4, 'start']] },
  autumn: { t: '가을 · 페가수스자리', ra0: 0.35, dec0: 26, k: 7.2,
    ids: ['markab', 'scheat', 'algenib', 'alpheratz', 'dand', 'mirach', 'almach'],
    lines: [['markab', 'scheat'], ['scheat', 'alpheratz'], ['alpheratz', 'algenib'], ['algenib', 'markab'], ['alpheratz', 'dand'], ['dand', 'mirach'], ['mirach', 'almach']],
    names: [['markab', '페가수스 사각형', 0, 22, 'end'], ['mirach', '안드로메다자리', -4, 26, 'end']], rowNames: [['markab', '페가수스 사각형', 0, 24, 'end'], ['almach', '안드로메다자리', 0, -14]] },
  winter: { t: '겨울 · 오리온자리', ra0: 6.3, dec0: -2, k: 6.0,
    ids: ['betelgeuse', 'bellatrix', 'rigel', 'saiph', 'alnitak', 'alnilam', 'mintaka', 'meissa', 'sirius', 'procyon'],
    lines: [['meissa', 'betelgeuse'], ['meissa', 'bellatrix'], ['betelgeuse', 'alnitak'], ['bellatrix', 'mintaka'], ['mintaka', 'alnilam'], ['alnilam', 'alnitak'], ['alnitak', 'saiph'], ['mintaka', 'rigel']],
    tri: ['betelgeuse', 'sirius', 'procyon'], rowNames: [['betelgeuse', '베텔게우스', 0, -14], ['rigel', '리겔', 12, 5, 'start'], ['sirius', '시리우스', 14, 5, 'start'], ['procyon', '프로키온', 0, -14]], names: [['betelgeuse', '베텔게우스', 0, -12], ['rigel', '리겔', 12, 4, 'start'], ['sirius', '시리우스(큰개)', 14, 4, 'start'], ['procyon', '프로키온(작은개)', 0, -14]] },
};
function panel(key, ox, oy, w, h, fz = 1, row = false) {
  const T0 = 24, top = 40, mb = 30;
  const P = PANELS[key], cos = Math.cos(P.dec0 * Math.PI / 180);
  // 도 단위 평면 좌표(남쪽 하늘을 볼 때 동쪽=왼쪽) → 판 안에 꼭 맞게 자동 축척
  const raw = (id) => { const [ra, dec] = ST[id]; let d = ra - P.ra0; if (d > 12) d -= 24; if (d < -12) d += 24; return [-d * 15 * cos, -(dec - P.dec0)]; };
  const pts = P.ids.map(raw), xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const mx = 46, k = Math.min((w - 2 * mx) / (x1 - x0), (h - top - mb - 14) / (y1 - y0));
  const cx = ox + w / 2, cy = oy + top + 8 + (h - top - mb - 8) / 2;
  const pos = (id) => { const [x, y] = raw(id); return [cx + (x - (x0 + x1) / 2) * k, cy + (y - (y0 + y1) / 2) * k]; };
  const ln = (a, b, dash) => { const [x1, y1] = pos(a), [x2, y2] = pos(b); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${dash ? '#ffd36a' : LINE}" stroke-width="${dash ? 1.6 : 1.5}" stroke-opacity="${dash ? 0.9 : 0.75}"${dash ? ' stroke-dasharray="5 5"' : ''}/>`; };
  const tri = P.tri ? [[0, 1], [1, 2], [2, 0]].map(([a, b]) => ln(P.tri[a], P.tri[b], true)).join('') : '';
  // 별 이름: 판 밖으로 나가면 별의 반대쪽에 붙이고(가운데 정렬은 판 안으로 민다) — 좁은 판에서도 잘리지 않게
  const fs = 12.5 * fz, tw = (n) => [...n].reduce((a, c) => a + (/[()·\s]/.test(c) ? 0.4 : /[0-9A-Za-z]/.test(c) ? 0.6 : 1), 0) * fs, L0 = ox + 6, R0 = ox + w - 6;
  const name = ([id, n, dx, dy, anc = 'middle']) => {
    const [x, y] = pos(id), wd = tw(n); let a = anc, tx = x + dx;
    if (a === 'start' && tx + wd > R0) { a = 'end'; tx = x - Math.abs(dx); }
    else if (a === 'end' && tx - wd < L0) { a = 'start'; tx = x + Math.abs(dx); }
    if (a === 'middle') tx = Math.min(R0 - wd / 2, Math.max(L0 + wd / 2, tx));
    if (a === 'start') tx = Math.min(tx, R0 - wd); if (a === 'end') tx = Math.max(tx, L0 + wd);
    return `<text x="${tx.toFixed(0)}" y="${(y + dy).toFixed(0)}" text-anchor="${a}">${n}</text>`;
  };
  return `<g><clipPath id="cp-${key}"><rect x="${ox}" y="${oy}" width="${w}" height="${h}" rx="16"/></clipPath><g clip-path="url(#cp-${key})">
    <rect x="${ox}" y="${oy}" width="${w}" height="${h}" fill="url(#sky)"/>${tri}${P.lines.map(([a, b]) => ln(a, b)).join('')}
    ${P.ids.map((id) => { const [x, y] = pos(id); return dot(x, y, ST[id][2], ST[id][2] < 1.6); }).join('')}
    <g font-size="${fs.toFixed(1)}" font-weight="700" fill="${TXT}">${((row && P.rowNames) || P.names).map(name).join('')}</g>
    <text x="${ox + 14}" y="${oy + T0}" font-size="${(15 * fz).toFixed(1)}" font-weight="800" fill="#ffd36a">${P.t}</text></g></g>`;
}
// row: 읽을거리 머리 그림처럼 가로로 긴 자리(2.4:1)에는 네 계절을 한 줄로
export function seasonSky({ row = false } = {}) {
  if (row) {
    const W = 960, H = 400, w = 234, h = 392;
    return S(W, H, `${DEFS}<rect width="${W}" height="${H}" fill="#fff"/>${['spring', 'summer', 'autumn', 'winter'].map((k, i) => panel(k, 4 + i * 239, 4, w, h, 1.12, true)).join('')}`);
  }
  const W = 640, H = 470, w = 312, h = 226;
  return S(W, H, `${DEFS}<rect width="${W}" height="${H}" fill="#fff"/>${panel('spring', 4, 4, w, h)}${panel('summer', 324, 4, w, h)}${panel('autumn', 4, 240, w, h)}${panel('winter', 324, 240, w, h)}`);
}
