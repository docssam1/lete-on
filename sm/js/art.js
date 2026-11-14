// 사람 그림 — 원장 2026-11-12 「노란 얼굴 안돼, 무서워」: 노란 얼굴 이모지(👦👧 등)를 쓰지 않고
// 살구색 피부의 부드러운 아이 그림을 코드로 그린다(원본 삽화는 쓰지 않음). 동그란 얼굴·볼터치·웃는 입.
const SKIN = "#ffe1cc", SKIN_LINE = "#e9b99a", CHEEK = "#ffb3b3", EYE = "#3a2a22";
// opts: { hair: "boy"|"girl"|"bob", hairColor, shirt, bottom, dress }
export function kid({ hair = "boy", hairColor = "#4a3326", shirt = "#5aa0f0", bottom = "#4a5a7a", dress = false, collar = "", dots = "", size = 120, label = "" } = {}) {
  const w = size, h = size * 1.35;
  const hairShape = hair === "girl"
    ? `<path d="M28 60 C24 20 96 20 92 60 C88 44 78 38 60 38 C42 38 32 44 28 60Z" fill="${hairColor}"/><circle cx="26" cy="58" r="11" fill="${hairColor}"/><circle cx="94" cy="58" r="11" fill="${hairColor}"/><circle cx="26" cy="49" r="4" fill="#ff7aa8"/><circle cx="94" cy="49" r="4" fill="#ff7aa8"/>`
    : hair === "bob"
      ? `<path d="M28 60 C24 20 96 20 92 60 L92 70 C88 56 86 44 60 40 C34 44 32 56 28 70Z" fill="${hairColor}"/>`
      : `<path d="M31 50 C30 24 90 22 90 50 C84 38 72 34 60 36 C50 34 40 38 31 50Z" fill="${hairColor}"/><path d="M52 34 Q60 26 70 33" stroke="${hairColor}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const body = dress
    ? `<path d="M40 96 L80 96 L92 140 L28 140Z" fill="${shirt}" stroke="#e6cfd5" stroke-width="1.5"/>${dots ? [[48, 116], [62, 110], [74, 124], [54, 132], [80, 136], [40, 134]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${dots}"/>`).join("") : ""}${collar ? `<path d="M46 96 h28 v10 q-14 8 -28 0z" fill="${collar}"/>` : ""}<rect x="44" y="140" width="9" height="12" rx="4" fill="${SKIN}"/><rect x="67" y="140" width="9" height="12" rx="4" fill="${SKIN}"/>`
    : `<rect x="38" y="94" width="44" height="34" rx="12" fill="${shirt}"/><rect x="42" y="124" width="15" height="24" rx="6" fill="${bottom}"/><rect x="63" y="124" width="15" height="24" rx="6" fill="${bottom}"/>`;
  return `<svg viewBox="0 0 120 162" width="${w}" height="${h}" role="img" aria-label="${label}">
    <ellipse cx="60" cy="156" rx="30" ry="5" fill="rgba(0,0,0,.08)"/>
    ${body}
    <rect x="28" y="98" width="12" height="26" rx="6" fill="${dress ? SKIN : shirt}"/><rect x="80" y="98" width="12" height="26" rx="6" fill="${dress ? SKIN : shirt}"/>
    <circle cx="34" cy="124" r="6" fill="${SKIN}"/><circle cx="86" cy="124" r="6" fill="${SKIN}"/>
    <rect x="53" y="84" width="14" height="12" rx="5" fill="${SKIN}"/>
    <circle cx="60" cy="60" r="30" fill="${SKIN}" stroke="${SKIN_LINE}" stroke-width="1.5"/>
    ${hairShape}
    <ellipse cx="49" cy="62" rx="3.6" ry="4.4" fill="${EYE}"/><ellipse cx="71" cy="62" rx="3.6" ry="4.4" fill="${EYE}"/>
    <circle cx="50.2" cy="60.6" r="1.3" fill="#fff"/><circle cx="72.2" cy="60.6" r="1.3" fill="#fff"/>
    <ellipse cx="42" cy="71" rx="5.5" ry="3.5" fill="${CHEEK}" opacity=".75"/><ellipse cx="78" cy="71" rx="5.5" ry="3.5" fill="${CHEEK}" opacity=".75"/>
    <path d="M53 73 Q60 80 67 73" stroke="#c0564b" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </svg>`;
}
// 교재 등장인물(이름만 원본에서). 옷 색은 원본 삽화 느낌을 따름.
export const PEOPLE = {
  민수: { hair: "boy", hairColor: "#22201f", shirt: "#3c78c8", bottom: "#a8642c" },
  민지: { hair: "bob", hairColor: "#5a3a2a", shirt: "#fff4f6", dress: true, collar: "#ffe066", dots: "#ffc2d1" },
  민석: { hair: "boy", hairColor: "#8a5a32", shirt: "#ffd84a", bottom: "#2f4a72" },
  지환: { hair: "boy", shirt: "#e8eef7", bottom: "#4aa39a" }
};
export const person = (name, size = 120) => kid({ ...(PEOPLE[name] || {}), size, label: name });

// 동물 그림(서 있는 모습, 발끝이 바닥) — 원본 11쪽처럼 키를 칸 수로 비교하므로 높이를 정확히 맞춘다.
// vb: 그림 비율. 키(px)를 주면 폭은 비율대로.
const ANIMALS = {
  cow: { vb: [100, 130], svg: `
    <rect x="30" y="58" width="40" height="52" rx="16" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/>
    <ellipse cx="42" cy="78" rx="8" ry="7" fill="#3a2a22"/><ellipse cx="60" cy="96" rx="7" ry="6" fill="#3a2a22"/>
    <rect x="34" y="104" width="10" height="24" rx="4" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/><rect x="56" y="104" width="10" height="24" rx="4" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/>
    <path d="M28 18 L22 6 M72 18 L78 6" stroke="#c9a46a" stroke-width="6" stroke-linecap="round"/>
    <ellipse cx="50" cy="34" rx="28" ry="24" fill="#ffd84d" stroke="#3a2a22" stroke-width="2.5"/>
    <ellipse cx="20" cy="30" rx="10" ry="6" fill="#ffd84d" stroke="#3a2a22" stroke-width="2.5"/><ellipse cx="80" cy="30" rx="10" ry="6" fill="#ffd84d" stroke="#3a2a22" stroke-width="2.5"/>
    <ellipse cx="50" cy="46" rx="18" ry="11" fill="#f7a35c" stroke="#3a2a22" stroke-width="2"/><circle cx="44" cy="46" r="2.5" fill="#3a2a22"/><circle cx="56" cy="46" r="2.5" fill="#3a2a22"/>
    <circle cx="40" cy="28" r="3.5" fill="#3a2a22"/><circle cx="60" cy="28" r="3.5" fill="#3a2a22"/>` },
  duck: { vb: [100, 175], svg: `
    <path d="M38 160 l-10 12 h18z M62 160 l-6 12 h18z" fill="#ff8a1f"/>
    <rect x="40" y="148" width="6" height="16" fill="#ff8a1f"/><rect x="56" y="148" width="6" height="16" fill="#ff8a1f"/>
    <ellipse cx="50" cy="112" rx="30" ry="42" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/>
    <path d="M24 112 q-8 18 6 28" stroke="#3a2a22" stroke-width="2.5" fill="#fff"/><path d="M76 112 q8 18 -6 28" stroke="#3a2a22" stroke-width="2.5" fill="#fff"/>
    <rect x="38" y="44" width="24" height="40" rx="12" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/>
    <circle cx="50" cy="34" r="22" fill="#fff" stroke="#3a2a22" stroke-width="2.5"/><path d="M50 10 q4 -8 8 -4" stroke="#3a2a22" stroke-width="2.5" fill="none"/>
    <path d="M36 44 q14 14 28 0 q-14 -6 -28 0z" fill="#ff8a1f" stroke="#c45a00" stroke-width="2"/>
    <circle cx="42" cy="30" r="3.5" fill="#3a2a22"/><circle cx="58" cy="30" r="3.5" fill="#3a2a22"/>` },
  sheep: { vb: [100, 90], svg: `
    <rect x="32" y="66" width="8" height="22" rx="3" fill="#6b5a4e"/><rect x="60" y="66" width="8" height="22" rx="3" fill="#6b5a4e"/>
    <g fill="#fff7ef" stroke="#c9b9a6" stroke-width="2">${[[30, 46], [50, 40], [70, 46], [24, 60], [44, 62], [64, 62], [78, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16"/>`).join("")}</g>
    <ellipse cx="50" cy="32" rx="16" ry="18" fill="#fff" stroke="#c9b9a6" stroke-width="2"/>
    <path d="M32 22 q-10 4 -4 14 q6 -2 4 -8" fill="#c9a46a"/><path d="M68 22 q10 4 4 14 q-6 -2 -4 -8" fill="#c9a46a"/>
    <circle cx="44" cy="30" r="2.6" fill="#3a2a22"/><circle cx="56" cy="30" r="2.6" fill="#3a2a22"/>
    <ellipse cx="42" cy="38" rx="4" ry="2.5" fill="#ffb3b3" opacity=".8"/><ellipse cx="58" cy="38" rx="4" ry="2.5" fill="#ffb3b3" opacity=".8"/>
    <path d="M46 42 q4 4 8 0" stroke="#3a2a22" stroke-width="2" fill="none" stroke-linecap="round"/>` }
};
// 독립 svg(단추용)
export const animal = (kind, height = 72) => { const a = ANIMALS[kind]; const w = height * a.vb[0] / a.vb[1]; return `<svg viewBox="0 0 ${a.vb[0]} ${a.vb[1]}" width="${w}" height="${height}" aria-hidden="true">${a.svg}</svg>`; };
// 큰 그림 안에 넣는 조각: 바닥 가운데(cx, baseY)에 키 h로 세운다
export const animalAt = (kind, cx, baseY, h) => { const a = ANIMALS[kind]; const w = h * a.vb[0] / a.vb[1]; return `<svg x="${cx - w / 2}" y="${baseY - h}" width="${w}" height="${h}" viewBox="0 0 ${a.vb[0]} ${a.vb[1]}">${a.svg}</svg>`; };

// 빨간 리본 — 원본 8쪽 그림처럼: 납작하고 넓은 띠 고리 두 개 + 가운데 매듭 + 끝이 V자로 갈라진 끈 두 가닥이 비스듬히 늘어짐.
// 원장 2026-11-12 「리본이 한쪽이 긴 모양 아니야? 저렇게 크기 차이 나는게 아니라」 → 고리는 같고 끈(꼬리) 길이·벌어짐만 다르게.
export function bow({ tail = 55, spread = 0.75, width = 160 } = {}) {
  const RED = "#e02531", DARK = "#a90f19", MID = "#c81822";
  const band = (sx, sy, dx, dy, len, w, fill) => {
    const L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    const ex = sx + ux * len, ey = sy + uy * len, h = w / 2;
    const pts = [[sx + nx * h, sy + ny * h], [ex + nx * h, ey + ny * h], [ex - ux * w * 0.75, ey - uy * w * 0.75], [ex - nx * h, ey - ny * h], [sx - nx * h, sy - ny * h]];
    const stripe = `<line x1="${sx + nx * (h - 3)}" y1="${sy + ny * (h - 3)}" x2="${ex + nx * (h - 3) - ux * 4}" y2="${ey + ny * (h - 3) - uy * 4}" stroke="#fff" stroke-width="1.6" opacity=".75"/>`;
    return `<path d="M${pts.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L")}Z" fill="${fill}" stroke="${DARK}" stroke-width="1.2" stroke-linejoin="round"/>${stripe}`;
  };
  const tails = band(72, 44, -spread, 1, tail, 15, MID) + band(78, 44, spread, 1, tail, 15, RED);
  const loop = (m) => `<g transform="${m}">
      <path d="M74 38 C60 22 40 10 22 10 C10 10 4 18 6 28 C8 38 20 46 36 48 C50 50 62 48 74 44Z" fill="${RED}" stroke="${DARK}" stroke-width="1.4"/>
      <path d="M70 41 C58 32 40 24 26 26 C18 28 16 34 22 39 C32 44 52 45 70 43Z" fill="${DARK}" opacity=".45"/>
      <path d="M22 13 C36 12 52 20 66 32" stroke="#fff" stroke-width="2" fill="none" opacity=".7" stroke-linecap="round"/></g>`;
  const loops = loop("") + loop("translate(150 0) scale(-1 1)");
  const knot = `<rect x="65" y="30" width="20" height="22" rx="6" fill="${MID}" stroke="${DARK}" stroke-width="1.4"/><path d="M69 34 L81 34" stroke="#fff" stroke-width="1.6" opacity=".6"/>`;
  return `<svg viewBox="-10 0 170 150" width="${width}" height="${width * 150 / 170}" aria-hidden="true">${tails}${loops}${knot}</svg>`;
}

// ── 1단원 2차시(14~18쪽) 그림 — 원본 쪽 그림처럼 납작한 교재 그림. 모두 상자(x,y,w,h)에 꽉 맞춰 그린다(길이를 정확히 맞추기 위해).
const fit = (x, y, w, h, vb, body) => `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${vb[0]} ${vb[1]}" preserveAspectRatio="none" overflow="visible">${body}</svg>`;
// 지오큐브(원본처럼 네모 안에 작은 네모 4개). dashed: 빈 자리 점선
export function geocube(x, y, s, color = "#ff8a73", { dashed = false, bad = false } = {}) {
  if (dashed) return `<g fill="none" stroke="#8a93a3" stroke-dasharray="4 3" stroke-width="1.5"><rect x="${x + 1}" y="${y + 1}" width="${s - 2}" height="${s - 2}"/>${[[0.15, 0.15], [0.55, 0.15], [0.15, 0.55], [0.55, 0.55]].map(([a, b]) => `<rect x="${x + s * a}" y="${y + s * b}" width="${s * 0.3}" height="${s * 0.3}"/>`).join("")}</g>`;
  const dark = { "#ff8a73": "#f05a45", "#7f8fd1": "#5f6fb8", "#ffd862": "#f6be2a", "#f4a3c4": "#e06f9e", "#8bd17c": "#55b047" }[color] || "rgba(0,0,0,.18)";
  return `<g class="geo"><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${color}" stroke="${bad ? "#e11d48" : "rgba(0,0,0,.18)"}" stroke-width="${bad ? 4 : 1.5}"/>${[[0.12, 0.12], [0.56, 0.12], [0.12, 0.56], [0.56, 0.56]].map(([a, b]) => `<rect x="${x + s * a}" y="${y + s * b}" width="${s * 0.32}" height="${s * 0.32}" rx="2" fill="${dark}" opacity=".85"/>`).join("")}</g>`;
}
export const OBJ = {
  toothbrush: (x, y, w, h) => fit(x, y, w, h, [300, 40], `<path d="M4 22 Q4 16 12 16 L200 14 Q214 14 222 20 L236 22 L282 20 Q296 20 296 28 L292 34 L236 33 L222 30 Q214 34 200 33 L12 32 Q4 32 4 26Z" fill="#5cc7d6" stroke="#2a9bab" stroke-width="1.5"/><circle cx="14" cy="24" r="2.5" fill="#2a9bab"/><path d="M14 20 L196 18" stroke="#fff" stroke-width="2" opacity=".6"/>${Array.from({ length: 12 }, (_, i) => `<path d="M${242 + i * 4} 21 L${240 + i * 4 + (i % 3)} ${2 + (i % 4) * 3}" stroke="#b8bec7" stroke-width="3" stroke-linecap="round"/>`).join("")}`),
  pencil: (x, y, w, h) => fit(x, y, w, h, [200, 36], `<rect x="0" y="2" width="154" height="32" fill="#7f8fd1"/><rect x="0" y="12" width="154" height="10" fill="#9aa8e3"/><path d="M154 2 L194 18 L154 34Z" fill="#ffe08a"/><path d="M154 2 L170 8 L170 28 L154 34Z" fill="#ffd34d"/><path d="M182 13 L198 18 L182 23Z" fill="#2f6fe0"/>`),
  sunflower: (x, y, w, h) => fit(x, y, w, h, [330, 180], `<rect x="105" y="96" width="225" height="7" fill="#4caf50"/><path d="M168 98 C150 70 160 40 182 20 C196 50 190 80 168 98Z" fill="#2e7d32"/><path d="M175 100 C190 118 190 140 178 156 C162 140 162 118 175 100Z" fill="#2e7d32"/>${Array.from({ length: 18 }, (_, i) => `<ellipse cx="60" cy="58" rx="9" ry="34" fill="${i % 2 ? "#ffc107" : "#ffb300"}" transform="rotate(${i * 20} 60 100)"/>`).join("")}<circle cx="60" cy="100" r="28" fill="#6d4c2f"/><circle cx="60" cy="100" r="20" fill="#8a6440" opacity=".7"/>`),
  giraffe: (x, y, w, h) => fit(x, y, w, h, [80, 200], `<path d="M16 120 C10 150 12 190 16 198 M28 130 L28 198 M46 130 L46 198 M58 120 C62 150 60 190 56 198" stroke="#e8b33a" stroke-width="7" stroke-linecap="round"/><ellipse cx="38" cy="125" rx="26" ry="20" fill="#ffd25a"/><path d="M48 112 C52 80 52 50 50 30 L62 30 C64 60 62 90 60 118Z" fill="#ffd25a"/><ellipse cx="58" cy="22" rx="16" ry="11" fill="#ffd25a"/><ellipse cx="68" cy="26" rx="8" ry="6" fill="#f2c27a"/><circle cx="58" cy="18" r="3" fill="#3a2a22"/><path d="M52 10 L50 2 M60 10 L62 2" stroke="#8a5a32" stroke-width="3" stroke-linecap="round"/>${[[30, 120], [44, 132], [22, 132], [52, 60], [54, 90], [40, 116]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="5" fill="#c97a2a"/>`).join("")}`),
  rabbit: (x, y, w, h) => fit(x, y, w, h, [60, 80], `<ellipse cx="22" cy="18" rx="6" ry="18" fill="#ffd84d" stroke="#d9a400" stroke-width="1.5"/><ellipse cx="38" cy="18" rx="6" ry="18" fill="#ffd84d" stroke="#d9a400" stroke-width="1.5"/><ellipse cx="30" cy="62" rx="16" ry="17" fill="#ffd84d" stroke="#d9a400" stroke-width="1.5"/><circle cx="30" cy="42" r="14" fill="#ffd84d" stroke="#d9a400" stroke-width="1.5"/><circle cx="25" cy="40" r="2" fill="#3a2a22"/><circle cx="35" cy="40" r="2" fill="#3a2a22"/><path d="M27 47 Q30 50 33 47" stroke="#3a2a22" stroke-width="1.5" fill="none"/><ellipse cx="22" cy="78" rx="7" ry="3" fill="#ffd84d" stroke="#d9a400"/><ellipse cx="38" cy="78" rx="7" ry="3" fill="#ffd84d" stroke="#d9a400"/>`),
  dinosaur: (x, y, w, h) => fit(x, y, w, h, [200, 170], `<path d="M40 110 C40 80 80 70 120 78 C150 84 170 60 185 20 C195 40 190 90 160 115 C140 132 90 135 60 128 Z" fill="#43a047" stroke="#2e7d32" stroke-width="2"/><path d="M55 112 C45 60 30 30 18 18 C10 10 0 16 6 24 C14 32 30 40 36 100" fill="#43a047" stroke="#2e7d32" stroke-width="2"/><circle cx="12" cy="20" r="2.5" fill="#1b1b1b"/><path d="M60 120 L56 166 M80 126 L80 166 M130 124 L134 166 M150 118 L156 166" stroke="#43a047" stroke-width="12" stroke-linecap="round"/><path d="M60 110 C80 122 120 124 150 110" stroke="#e8f5e9" stroke-width="10" fill="none" opacity=".7"/>`)
};

// ── 1단원 3차시(푸리수리·길 만들기) 그림 ─────────────────────
Object.assign(OBJ, {
  brush: (x, y, w, h) => fit(x, y, w, h, [300, 40], `<path d="M2 20 C40 10 150 8 200 12 L206 28 C150 32 40 30 2 20Z" fill="#4a3a35"/><rect x="200" y="10" width="44" height="20" rx="4" fill="#d9dde3" stroke="#8a93a3"/><path d="M244 8 L292 6 Q298 20 292 34 L244 32Z" fill="#c8963e" stroke="#8a5a1a"/>`),
  pencilY: (x, y, w, h) => fit(x, y, w, h, [300, 30], `<rect x="0" y="3" width="14" height="24" rx="4" fill="#d9705a"/><rect x="14" y="3" width="16" height="24" fill="#7a7a7a"/><rect x="30" y="3" width="216" height="24" fill="#f3a33a"/><rect x="30" y="11" width="216" height="5" fill="#ffd27a"/><path d="M246 3 L292 15 L246 27Z" fill="#f6dfb5"/><path d="M280 12 L298 15 L280 18Z" fill="#3a3a3a"/>`),
  spoon: (x, y, w, h) => fit(x, y, w, h, [300, 60], `<rect x="2" y="26" width="190" height="10" rx="5" fill="#eceff3" stroke="#aab3bf"/><ellipse cx="248" cy="30" rx="50" ry="26" fill="#f4f6f9" stroke="#aab3bf" stroke-width="2"/>`),
  comb: (x, y, w, h) => fit(x, y, w, h, [300, 60], `<path d="M2 34 C2 20 30 18 80 22 L170 30 L170 18 L298 18 L298 50 L80 52 C30 54 2 48 2 34Z" fill="#7a4a2a"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${176 + i * 7.6}" y="2" width="3.2" height="18" fill="#7a4a2a"/>`).join("")}`)
});
// 서 있는 동물(24쪽: 여우·원숭이·고양이). 상자에 꽉 맞춰 그린다.
const STAND = {
  fox: `<path d="M64 60 C90 40 98 90 74 112" fill="#ffd84d" stroke="#c99a00" stroke-width="2"/><rect x="30" y="64" width="34" height="42" rx="10" fill="#e8504a"/><rect x="34" y="104" width="10" height="16" fill="#ffd84d"/><rect x="50" y="104" width="10" height="16" fill="#ffd84d"/><path d="M28 30 L36 6 L44 26 M52 26 L60 6 L66 30" fill="#ffd84d" stroke="#c99a00" stroke-width="2"/><ellipse cx="47" cy="40" rx="20" ry="22" fill="#ffd84d" stroke="#c99a00" stroke-width="2"/><circle cx="40" cy="38" r="2.6" fill="#222"/><circle cx="54" cy="38" r="2.6" fill="#222"/><ellipse cx="47" cy="52" rx="4" ry="3" fill="#222"/>`,
  monkey: `<path d="M70 70 C96 60 96 20 82 14" fill="none" stroke="#b5652b" stroke-width="5"/><ellipse cx="46" cy="84" rx="20" ry="22" fill="#b5652b"/><ellipse cx="46" cy="80" rx="16" ry="14" fill="#3a8fe0"/><rect x="34" y="100" width="10" height="20" rx="4" fill="#b5652b"/><rect x="50" y="100" width="10" height="20" rx="4" fill="#b5652b"/><circle cx="22" cy="38" r="9" fill="#b5652b"/><circle cx="70" cy="38" r="9" fill="#b5652b"/><circle cx="46" cy="40" r="24" fill="#b5652b"/><ellipse cx="46" cy="46" rx="17" ry="15" fill="#ffe1cc"/><circle cx="40" cy="40" r="2.6" fill="#222"/><circle cx="52" cy="40" r="2.6" fill="#222"/><path d="M40 52 Q46 57 52 52" stroke="#222" stroke-width="2" fill="none"/>`,
  cat: `<path d="M64 96 C84 92 88 70 78 62" fill="none" stroke="#f28c28" stroke-width="5"/><rect x="30" y="66" width="34" height="40" rx="12" fill="#f6a03a"/><rect x="34" y="102" width="10" height="18" fill="#f6a03a"/><rect x="50" y="102" width="10" height="18" fill="#f6a03a"/><path d="M26 34 L30 12 L42 26 M52 26 L64 12 L68 34" fill="#f6a03a" stroke="#c96a10" stroke-width="2"/><circle cx="47" cy="42" r="22" fill="#f6a03a" stroke="#c96a10" stroke-width="2"/>${[[38, 70], [46, 76], [54, 70]].map(([a, b]) => `<path d="M${a} ${b} l6 4" stroke="#c96a10" stroke-width="3"/>`).join("")}<circle cx="40" cy="40" r="3" fill="#222"/><circle cx="54" cy="40" r="3" fill="#222"/><path d="M44 50 Q47 53 50 50" stroke="#222" stroke-width="2" fill="none"/>`
};
// 그림 맨 위에서 머리(귀) 꼭대기까지의 빈 곳(122 중). 키 h = 발바닥~머리 꼭대기가 되도록 맞춘다.
const STAND_TOP = { fox: 6, monkey: 16, cat: 12 };
export const standAt = (kind, cx, baseY, h) => { const H = h * 120 / (120 - STAND_TOP[kind]), w = H * 96 / 122; return `<svg x="${cx - w / 2}" y="${baseY - H * 120 / 122}" width="${w}" height="${H}" viewBox="0 0 96 122">${STAND[kind]}</svg>`; };
export const stand = (kind, h = 70) => `<svg width="${h * 96 / 122}" height="${h}" viewBox="0 0 96 122" aria-hidden="true">${STAND[kind]}</svg>`;
