// 2과정 G5 「도형의 넓이와 비」 교재 유사문제 생성기. 약속은 G1~G4 생성기와 같다.
// 문제는 모두 새로 지은 것이다. 답은 그림을 만든 수에서 계산한다.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const INK = "#24302b", GREEN = "#2f6b52", SOFT = "#e6efe8", MARK = "#b4553f", YELLOW = "#fff1bf";
const R = Math.PI / 180;
const f1 = (v) => Math.round(v * 10) / 10;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const P = (x, y) => ({ x, y });
const at = (c, r, deg) => P(c.x + r * Math.cos(deg * R), c.y - r * Math.sin(deg * R));
const dirOf = (a, b) => Math.atan2(-(b.y - a.y), b.x - a.x) / R;
const mid = (a, b) => P((a.x + b.x) / 2, (a.y + b.y) / 2);
const lerp = (a, b, t) => P(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

function problem({ prompt, subtype, html, answer, solution, family, meta = {} }) {
  return { prompt, visual: { kind: "c2", subtype, html }, answer: String(answer), solution, meta: { family, answer, ...meta } };
}
const svg = (w, h, body, label = "그림") => `<svg class="c2-fig" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="${esc(label)}">${body}</svg>`;
const text = (x, y, value, { size = 15, anchor = "middle", color = INK, weight = 500 } = {}) =>
  `<text x="${f1(x)}" y="${f1(y)}" font-size="${size}" text-anchor="${anchor}" dominant-baseline="central" fill="${color}" font-weight="${weight}">${esc(value)}</text>`;
const line = (a, b, { color = INK, width = 2, dash = "" } = {}) =>
  `<line x1="${f1(a.x)}" y1="${f1(a.y)}" x2="${f1(b.x)}" y2="${f1(b.y)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
const poly = (points, { fill = "none", color = INK, width = 2 } = {}) =>
  `<polygon points="${points.map((p) => `${f1(p.x)},${f1(p.y)}`).join(" ")}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round"/>`;
const dot = (p, r = 3.2, color = INK) => `<circle cx="${f1(p.x)}" cy="${f1(p.y)}" r="${r}" fill="${color}"/>`;
function angleMark(v, a1, a2, r, label, { color = MARK, size = 14 } = {}) {
  let span = a2 - a1;
  while (span <= 0) span += 360;
  if (span > 180) { a1 = a2; span = 360 - span; }
  const p1 = at(v, r, a1), p2 = at(v, r, a1 + span), m = at(v, r + 15, a1 + span / 2);
  return `<path d="M ${f1(p1.x)} ${f1(p1.y)} A ${r} ${r} 0 0 0 ${f1(p2.x)} ${f1(p2.y)}" fill="none" stroke="${color}" stroke-width="1.8"/>`
    + (label ? text(m.x, m.y, label, { size, color }) : "");
}
const tick = (a, b, n = 1) => { const m = mid(a, b), d = dirOf(a, b) + 90; return Array.from({ length: n }, (_, k) => { const c = at(m, (k - (n - 1) / 2) * 5, dirOf(a, b)); return line(at(c, 6, d), at(c, -6, d), { width: 1.8 }); }).join(""); };
const lenLabel = (a, b, value, { offset = 14, color = INK, size = 13 } = {}) => { const m = mid(a, b), p = at(m, offset, dirOf(a, b) + 90); return text(p.x, p.y, value, { size, color }); };
const name = (p, t, dx = 0, dy = 0) => text(p.x + dx, p.y + dy, t, { size: 14, weight: 700 });

// ════ 1단원 정다각별과 나비각 · 삼각형의 합동 · 식을 이용한 각 ════
// 1. 합동인 삼각형 — 대응하는 변·각 찾기, 합동 조건
function c2CongruentTriangle({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "find" : sample(["find", "find", "condition"]);
  const A = P(30, 160), B = P(170, 160), C = P(80, 50);
  // 두 번째 삼각형: 반 바퀴 돌려 옮긴 것(대응 꼭짓점 차례를 섞는다)
  const D = P(360, 50), E = P(220, 50), F = P(310, 160);
  let body = poly([A, B, C], { fill: SOFT }) + poly([D, E, F], { fill: YELLOW });
  body += name(A, "ㄱ", -12, 6) + name(B, "ㄴ", 12, 6) + name(C, "ㄷ", 0, -14) + name(D, "ㄹ", 12, -6) + name(E, "ㅁ", -12, -6) + name(F, "ㅂ", 0, 16);
  if (kind === "find") {
    const ab = randomInt(6, 14), bc = randomInt(5, 12), angB = randomInt(40, 75), angA = randomInt(35, 70);
    const q = sample(["side", "angle", "angleThird"]);
    body += lenLabel(A, B, `${ab}cm`, { offset: -14 }) + lenLabel(B, C, `${bc}cm`, { offset: -14 }) + angleMark(B, 180, dirOf(B, C), 22, `${angB}°`, { color: INK }) + angleMark(A, 0, dirOf(A, C), 24, `${angA}°`, { color: INK });
    const ask = q === "side" ? "변 ㅁㄹ" : q === "angle" ? "각 ㅁ" : "각 ㅂ";
    // 대응: ㄱ↔ㄹ, ㄴ↔ㅁ, ㄷ↔ㅂ
    const ans = q === "side" ? `${ab}cm` : q === "angle" ? `${angB}°` : `${180 - angA - angB}°`;
    return problem({
      prompt: `삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㅂ은 합동이고, 꼭짓점 ㄱ, ㄴ, ㄷ에 각각 ㄹ, ㅁ, ㅂ이 대응합니다. ${ask}${q === "side" ? "의 길이" : "의 크기"}는 얼마인가요?`,
      subtype: "congruent", html: svg(400, 190, body, "합동인 두 삼각형"), answer: ans,
      solution: q === "side" ? `합동인 도형에서 대응하는 변의 길이는 같습니다. 변 ㅁㄹ에 대응하는 변은 변 ㄴㄱ이므로 ${ab}cm입니다.`
        : q === "angle" ? `대응하는 각의 크기는 같습니다. 각 ㅁ에 대응하는 각은 각 ㄴ이므로 ${angB}°입니다.`
          : `각 ㅂ은 각 ㄷ에 대응합니다. 각 ㄷ = 180 − ${angA} − ${angB} = ${180 - angA - angB}°이므로 각 ㅂ도 ${180 - angA - angB}°입니다.`,
      family: `congruent-${q}`, meta: { ab, bc }
    });
  }
  const cond = sample(["sss", "sas", "asa"]);
  if (cond === "sss") body += tick(A, B, 1) + tick(E, D, 1) + tick(B, C, 2) + tick(E, F, 2) + tick(C, A, 3) + tick(F, D, 3);
  if (cond === "sas") body += tick(A, B, 1) + tick(E, D, 1) + tick(B, C, 2) + tick(E, F, 2) + angleMark(B, 180, dirOf(B, C), 20, "", { color: GREEN }) + angleMark(E, 0, dirOf(E, F), 20, "", { color: GREEN });
  if (cond === "asa") body += tick(A, B, 1) + tick(E, D, 1) + angleMark(A, 0, dirOf(A, C), 20, "", { color: GREEN }) + angleMark(D, 180, dirOf(D, F), 20, "", { color: GREEN }) + angleMark(B, 180, dirOf(B, C), 26, "", { color: MARK }) + angleMark(E, 0, dirOf(E, F), 26, "", { color: MARK });
  const ansText = { sss: "세 변의 길이가 각각 같다", sas: "두 변의 길이와 그 끼인각이 같다", asa: "한 변의 길이와 그 양 끝 각이 같다" }[cond];
  return problem({
    prompt: `두 삼각형에서 같은 표시가 있는 변과 각은 서로 같습니다. 두 삼각형이 합동인 까닭으로 알맞은 것을 쓰세요. (세 변 / 두 변과 끼인각 / 한 변과 양 끝 각)`,
    subtype: "congruent", html: svg(400, 190, body, "같은 표시가 있는 두 삼각형"), answer: { sss: "세 변", sas: "두 변과 끼인각", asa: "한 변과 양 끝 각" }[cond],
    solution: `표시를 보면 ${ansText}. 이 조건이면 삼각형의 모양과 크기가 하나로 정해지므로 두 삼각형은 합동입니다.`,
    family: `congruent-${cond}`, meta: {}
  });
}
// 2. 식을 세워 각 구하기
function c2AngleEquation({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "ratio" : sample(["ratio", "isosceles", "exterior"]);
  const A = P(150, 30), B = P(40, 180), C = P(270, 180);
  let body = poly([A, B, C], { fill: SOFT });
  if (kind === "ratio") {
    const r = sample([[1, 2, 3], [2, 3, 4], [1, 1, 2], [2, 3, 5], [3, 4, 5], [1, 3, 5], [4, 5, 6]]);
    const sum = r[0] + r[1] + r[2];
    if (180 % sum) return null;
    const u = 180 / sum, angs = r.map((v) => v * u);
    body += text(A.x, A.y + 30, `${r[0]}`, { size: 14, color: MARK }) + text(B.x + 30, B.y - 12, `${r[1]}`, { size: 14, color: MARK }) + text(C.x - 32, C.y - 12, `${r[2]}`, { size: 14, color: MARK });
    return problem({
      prompt: `삼각형의 세 각의 크기의 비가 ${r.join(" : ")}입니다. 가장 큰 각은 몇 도인가요?`,
      subtype: "angle-equation", html: svg(310, 210, body, "세 각의 비"), answer: `${Math.max(...angs)}°`,
      solution: `세 각을 ${r[0]}칸, ${r[1]}칸, ${r[2]}칸으로 놓으면 모두 ${sum}칸 = 180°이므로 한 칸은 ${u}°입니다. 가장 큰 각은 ${Math.max(...r)} × ${u} = ${Math.max(...angs)}°입니다.`,
      family: "angle-ratio", meta: { r: r.join(":") }
    });
  }
  if (kind === "isosceles") {
    const k = sample([2, 3, 4]);   // 꼭지각 = 밑각 × k → 밑각 × (k + 2) = 180
    if (180 % (k + 2)) return null;
    const base = 180 / (k + 2);
    body += tick(A, B) + tick(A, C) + angleMark(A, dirOf(A, B), dirOf(A, C), 22, "?") + angleMark(B, 0, dirOf(B, A), 24, "", { color: INK }) + angleMark(C, dirOf(C, A), 180, 24, "", { color: INK });
    return problem({
      prompt: `이등변삼각형에서 꼭지각(같은 두 변 사이의 각)이 한 밑각의 ${k}배입니다. 꼭지각 ?는 몇 도인가요?`,
      subtype: "angle-equation", html: svg(310, 210, body, "이등변삼각형"), answer: `${base * k}°`,
      solution: `밑각을 □라 하면 두 밑각은 같으므로 □ + □ + ${k} × □ = 180, □ × ${k + 2} = 180입니다. □ = ${base}°이고 꼭지각은 ${base} × ${k} = ${base * k}°입니다.`,
      family: "angle-isosceles", meta: { k }
    });
  }
  // 바깥 각 = 두 내각의 합으로 식 세우기: 바깥 각 = x + 2x 꼴
  const m = sample([2, 3, 4]), x = randomInt(15, Math.floor(150 / (m + 1)));
  const ext = x * (m + 1);
  body += poly([A, B, C], { fill: SOFT }) + line(C, P(310, 180), { color: "#9aa39e", dash: "5 4" }) + angleMark(A, dirOf(A, B), dirOf(A, C), 22, "□", { color: INK }) + angleMark(B, 0, dirOf(B, A), 24, `□ × ${m}`, { color: INK }) + angleMark(C, 0, dirOf(C, A), 26, `${ext}°`, { color: MARK });
  return problem({
    prompt: `삼각형의 한 바깥 각이 ${ext}°이고, 이웃하지 않은 두 내각이 □와 □ × ${m}입니다. □는 몇 도인가요?`,
    subtype: "angle-equation", html: svg(330, 210, body, "삼각형의 바깥 각"), answer: `${x}°`,
    solution: `삼각형의 바깥 각은 이웃하지 않은 두 내각의 합이므로 □ + □ × ${m} = □ × ${m + 1} = ${ext}입니다. □ = ${ext} ÷ ${m + 1} = ${x}°입니다.`,
    family: "angle-exterior", meta: { m, x }
  });
}

// ════ 2단원 평행선과 등적변형 · 높이가 같은 삼각형 ════
// 3. 등적변형 — 밑변과 높이가 같으면 넓이가 같다(평행선 위로 꼭짓점 옮기기)
function c2EqualAreaShift({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "slide" : sample(["slide", "trapezoid", "product"]);
  if (kind === "slide") {
    const b = randomInt(4, 12) * 2, h = randomInt(3, 10);
    const area = (b * h) / 2;
    const B = P(40, 170), C = P(40 + b * 12, 170), A = P(70, 170 - h * 12), A2 = P(C.x + 40, A.y);
    let body = line(P(20, A.y), P(A2.x + 30, A.y), { color: GREEN, dash: "6 4" }) + line(P(20, 170), P(A2.x + 30, 170), { width: 1.2, color: "#9aa39e" });
    body += poly([A, B, C], { fill: SOFT }) + poly([A2, B, C], { fill: "rgba(255,241,191,.7)" }) + name(A, "가", 0, -14) + name(A2, "나", 0, -14) + lenLabel(B, C, `${b}cm`, { offset: -14 });
    return problem({
      prompt: `밑변이 ${b}cm로 같은 두 삼각형의 꼭짓점 가, 나가 밑변과 평행한 직선(점선) 위에 있습니다. 꼭짓점이 가인 삼각형의 넓이가 ${area}㎠일 때, 꼭짓점이 나인 삼각형의 넓이는 몇 ㎠인가요?`,
      subtype: "equal-area", html: svg(A2.x + 60, 200, body, "평행선 위의 두 꼭짓점"), answer: `${area}㎠`,
      solution: `꼭짓점이 밑변과 평행한 직선 위에 있으면 밑변까지의 거리(높이)가 어디서나 같습니다. 밑변도 같으므로 두 삼각형의 넓이는 같아 ${area}㎠입니다(꼭짓점을 평행선을 따라 옮기는 것을 등적변형이라고 합니다).`,
      family: "equal-area-slide", meta: { b, h }
    });
  }
  // 사다리꼴 ABCD(AD ∥ BC)의 두 대각선이 O에서 만난다: 삼각형 ABO = 삼각형 DCO, ABO × ABO = AOD × BOC
  const [p, q] = sample([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]);   // AD : BC = p : q
  const t = randomInt(1, 4);
  const aod = p * p * t, boc = q * q * t, abo = p * q * t;
  const A = P(110, 40), D = P(110 + p * 40, 40), B = P(60, 170), C = P(60 + q * 40, 170);
  const O = lerp(A, C, p / (p + q));
  let body = poly([A, B, C, D], { fill: "#fff" }) + line(A, C) + line(B, D);
  body += poly([A, O, D], { fill: SOFT }) + poly([B, O, C], { fill: SOFT }) + poly([A, B, O], { fill: YELLOW }) + poly([D, O, C], { fill: kind === "trapezoid" ? "rgba(180,85,63,.18)" : "rgba(255,241,191,.5)" });
  body += name(A, "ㄱ", -10, -10) + name(D, "ㄹ", 10, -10) + name(B, "ㄴ", -10, 10) + name(C, "ㄷ", 10, 10) + name(O, "O", 14, 0);
  body += text(mid(A, D).x, A.y + 18, `${aod}`, { size: 12 }) + text(mid(B, C).x, B.y - 16, `${boc}`, { size: 12 });
  const html = svg(C.x + 50, 200, body, "대각선을 그은 사다리꼴");
  if (kind === "trapezoid") return problem({
    prompt: `사다리꼴 ㄱㄴㄷㄹ(변 ㄱㄹ과 변 ㄴㄷ이 평행)의 두 대각선이 점 O에서 만납니다. 삼각형 ㄱㄴO의 넓이가 ${abo}㎠일 때, 삼각형 ㄹOㄷ의 넓이는 몇 ㎠인가요?`,
    subtype: "equal-area", html, answer: `${abo}㎠`,
    solution: `삼각형 ㄱㄴㄷ과 삼각형 ㄹㄴㄷ은 밑변 ㄴㄷ이 같고, 꼭짓점 ㄱ, ㄹ이 ㄴㄷ과 평행한 변 위에 있어 높이도 같으므로 넓이가 같습니다. 둘에서 똑같이 삼각형 ㄴOㄷ을 빼면 삼각형 ㄱㄴO = 삼각형 ㄹOㄷ = ${abo}㎠입니다.`,
    family: "equal-area-trapezoid", meta: { p, q, t }
  });
  return problem({
    prompt: `사다리꼴(위아래 변이 평행)의 두 대각선이 O에서 만나 네 삼각형으로 나뉘었습니다. 위쪽 삼각형이 ${aod}㎠, 아래쪽 삼각형이 ${boc}㎠일 때, 왼쪽 삼각형(색칠)의 넓이는 몇 ㎠인가요?`,
    subtype: "equal-area", html, answer: `${abo}㎠`,
    solution: `위쪽과 아래쪽 삼각형은 같은 모양의 크기만 다른 꼴(닮음)이라 위아래 변의 길이의 비가 ${p} : ${q}이고, 대각선도 O에서 ${p} : ${q}로 나뉩니다. 높이가 같은 삼각형끼리 넓이의 비는 밑변의 비이므로 왼쪽 삼각형 = 위쪽 ${aod} × ${q} ÷ ${p} = ${abo}㎠입니다(오른쪽 삼각형도 같은 넓이).`,
    family: "equal-area-product", meta: { p, q, t }
  });
}
// 4. 높이가 같은 삼각형 — 넓이의 비 = 밑변의 비
function c2AreaRatioBase({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "one" : sample(["one", "two", "reverse"]);
  const [m, n] = sample([[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5], [1, 4]]);
  const unit = randomInt(2, 8);
  const S = (m + n) * unit;
  const A = P(120, 30), B = P(30, 180), C = P(300, 180), D = lerp(B, C, m / (m + n));
  let body = poly([A, B, C], { fill: "#fff" }) + poly([A, B, D], { fill: YELLOW }) + line(A, D) + name(A, "ㄱ", 0, -14) + name(B, "ㄴ", -12, 8) + name(C, "ㄷ", 12, 8) + name(D, "ㄹ", 0, 16);
  body += lenLabel(B, D, `${m}`, { offset: -26, color: MARK }) + lenLabel(D, C, `${n}`, { offset: -26, color: MARK });
  if (kind === "one") return problem({
    prompt: `삼각형 ㄱㄴㄷ의 넓이는 ${S}㎠이고, 점 ㄹ은 변 ㄴㄷ을 ${m} : ${n}으로 나눕니다. 색칠한 삼각형 ㄱㄴㄹ의 넓이는 몇 ㎠인가요?`,
    subtype: "area-ratio", html: svg(330, 210, body, "밑변을 나눈 삼각형"), answer: `${(S * m) / (m + n)}㎠`,
    solution: `두 삼각형 ㄱㄴㄹ, ㄱㄹㄷ은 꼭짓점 ㄱ이 같아 높이가 같으므로 넓이의 비는 밑변의 비 ${m} : ${n}입니다. 전체 ${S}㎠를 ${m + n}칸으로 나누면 한 칸은 ${S / (m + n)}㎠, 색칠한 부분은 ${m}칸 = ${(S * m) / (m + n)}㎠입니다.`,
    family: "area-ratio-one", meta: { m, n }
  });
  if (kind === "reverse") return problem({
    prompt: `점 ㄹ은 변 ㄴㄷ을 ${m} : ${n}으로 나눕니다. 색칠한 삼각형 ㄱㄴㄹ의 넓이가 ${m * unit}㎠일 때, 삼각형 ㄱㄴㄷ 전체의 넓이는 몇 ㎠인가요?`,
    subtype: "area-ratio", html: svg(330, 210, body, "밑변을 나눈 삼각형"), answer: `${(m + n) * unit}㎠`,
    solution: `높이가 같으므로 넓이의 비가 ${m} : ${n}입니다. ${m}칸이 ${m * unit}㎠이니 한 칸은 ${unit}㎠, 전체 ${m + n}칸은 ${(m + n) * unit}㎠입니다.`,
    family: "area-ratio-reverse", meta: { m, n }
  });
  // 두 번: ㄱㄹ 위의 점 ㅁ이 ㄱㄹ을 1 : 1로 나눈다 → 삼각형 ㅁㄴㄹ = ㄱㄴㄹ의 반
  const total = (m + n) * unit * 2;
  const E = mid(A, D);
  body = poly([A, B, C], { fill: "#fff" }) + poly([E, B, D], { fill: YELLOW }) + line(A, D) + line(B, E) + tick(A, E) + tick(E, D) + name(A, "ㄱ", 0, -14) + name(B, "ㄴ", -12, 8) + name(C, "ㄷ", 12, 8) + name(D, "ㄹ", 0, 16) + name(E, "ㅁ", 12, 0)
    + lenLabel(B, D, `${m}`, { offset: -26, color: MARK }) + lenLabel(D, C, `${n}`, { offset: -26, color: MARK });
  const abd = (total * m) / (m + n);
  return problem({
    prompt: `삼각형 ㄱㄴㄷ의 넓이는 ${total}㎠입니다. 점 ㄹ은 변 ㄴㄷ을 ${m} : ${n}으로 나누고, 점 ㅁ은 선분 ㄱㄹ의 가운데 점입니다. 색칠한 삼각형 ㅁㄴㄹ의 넓이는 몇 ㎠인가요?`,
    subtype: "area-ratio", html: svg(330, 210, body, "두 번 나눈 삼각형"), answer: `${abd / 2}㎠`,
    solution: `먼저 삼각형 ㄱㄴㄹ은 높이가 같은 삼각형 ㄱㄹㄷ과 넓이의 비가 ${m} : ${n}이므로 ${total} ÷ ${m + n} × ${m} = ${abd}㎠입니다. 삼각형 ㅁㄴㄹ과 ㄱㄴㅁ은 꼭짓점 ㄴ이 같고 밑변 ㄱㅁ = ㅁㄹ이라 넓이가 같으므로 색칠한 부분은 ${abd} ÷ 2 = ${abd / 2}㎠입니다.`,
    family: "area-ratio-two", meta: { m, n }
  });
}

// ════ 4단원 닮음과 비 ════
// 5. 닮은 도형 — 길이는 k배, 넓이는 k × k배
function c2SimilarScale({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "side" : sample(["side", "perimeter", "area"]);
  const k = sample([2, 3, 4]);
  const a = randomInt(2, 6), b = randomInt(a + 1, 9), c = randomInt(Math.max(b - a + 1, 3), a + b - 1);
  const s = 14;
  const A = P(30, 170), B = P(30 + b * s, 170);
  const x = (a * a - c * c + b * b) / (2 * b), y = Math.sqrt(Math.max(1, a * a - x * x));
  const C = P(30 + x * s, 170 - y * s);
  const s2 = s * 0.55 * k;
  const off = B.x + 50;
  const A2 = P(off, 170), B2 = P(off + b * s2, 170), C2 = P(off + x * s2, 170 - y * s2);
  let body = poly([A, B, C], { fill: SOFT }) + poly([A2, B2, C2], { fill: YELLOW });
  body += lenLabel(A, B, `${b}cm`, { offset: -14 }) + lenLabel(A, C, `${a}cm`, { offset: 14 });
  const minY = Math.min(C2.y, C.y) - 20;
  const wrap = (bd) => svg(B2.x + 40, 200 - Math.min(0, minY), `<g transform="translate(0 ${f1(Math.max(0, -minY))})">${bd}</g>`, "닮은 두 삼각형");
  if (kind === "side") {
    body += lenLabel(A2, B2, `${b * k}cm`, { offset: -14 }) + lenLabel(A2, C2, "?", { offset: 14, color: MARK });
    return problem({
      prompt: `두 삼각형은 모양이 같고 크기만 다른 닮은 도형입니다. 작은 삼각형의 두 변이 ${a}cm, ${b}cm이고, 큰 삼각형에서 ${b}cm에 대응하는 변이 ${b * k}cm입니다. ?는 몇 cm인가요?`,
      subtype: "similar", html: wrap(body), answer: `${a * k}cm`,
      solution: `${b}cm가 ${b * k}cm가 되었으니 큰 삼각형은 작은 삼각형을 ${k}배 늘린 것입니다. 닮은 도형은 대응하는 길이가 모두 같은 배수로 늘어나므로 ? = ${a} × ${k} = ${a * k}cm입니다.`,
      family: "similar-side", meta: { k }
    });
  }
  if (kind === "perimeter") {
    const per = a + b + c;
    body += lenLabel(A2, B2, `${b * k}cm`, { offset: -14 });
    return problem({
      prompt: `세 변이 ${a}cm, ${b}cm, ${c}cm인 삼각형과 닮은 큰 삼각형에서 ${b}cm에 대응하는 변이 ${b * k}cm입니다. 큰 삼각형의 둘레는 몇 cm인가요?`,
      subtype: "similar", html: wrap(body), answer: `${per * k}cm`,
      solution: `닮음비는 ${b} : ${b * k} = 1 : ${k}입니다. 세 변이 모두 ${k}배가 되므로 둘레도 ${k}배, (${a} + ${b} + ${c}) × ${k} = ${per * k}cm입니다.`,
      family: "similar-perimeter", meta: { k }
    });
  }
  const area = randomInt(2, 9) * 2;
  body += lenLabel(A2, B2, `${b * k}cm`, { offset: -14 });
  return problem({
    prompt: `닮은 두 삼각형에서 작은 삼각형의 한 변 ${b}cm에 대응하는 큰 삼각형의 변이 ${b * k}cm입니다. 작은 삼각형의 넓이가 ${area}㎠일 때, 큰 삼각형의 넓이는 몇 ㎠인가요?`,
    subtype: "similar", html: wrap(body), answer: `${area * k * k}㎠`,
    solution: `길이가 ${k}배이면 밑변도 ${k}배, 높이도 ${k}배이므로 넓이는 ${k} × ${k} = ${k * k}배입니다. ${area} × ${k * k} = ${area * k * k}㎠입니다(작은 삼각형 ${k * k}개가 큰 삼각형을 채웁니다).`,
    family: "similar-area", meta: { k }
  });
}
// 6. 그림자로 높이 재기 — 같은 때의 그림자는 높이에 비례
function c2ShadowHeight({ difficulty = 2 }) {
  const kind = difficulty <= 1 ? "height" : sample(["height", "shadow"]);
  for (let tries = 0; tries < 40; tries += 1) {
    const stick = sample([1, 2, 3]), shadow = sample([2, 3, 4, 5]);
    if (gcd(stick, shadow) !== 1 && stick !== 1) continue;
    const mult = randomInt(3, 12);
    const T = shadow * mult, H = stick * mult;
    const base = 190, sx = 300 / (T + shadow + 4), sy = Math.min(14, 150 / H);
    const tower = P(40, base), top = P(40, base - H * sy), tip = P(40 + T * sx, base);
    const st = P(40 + T * sx + 30, base), stTop = P(st.x, base - stick * sy * 3), stTip = P(st.x + shadow * sx * 3, base);
    let body = line(P(20, base), P(stTip.x + 20, base), { color: "#9aa39e", width: 1.4 });
    body += `<rect x="${f1(tower.x - 9)}" y="${f1(top.y)}" width="18" height="${f1(base - top.y)}" fill="${SOFT}" stroke="${INK}" stroke-width="2"/>` + line(top, tip, { color: "#e0a63c", dash: "5 4", width: 1.6 }) + line(tower, tip, { color: "#6b5b45", width: 5 });
    body += line(st, stTop, { width: 3 }) + line(stTop, stTip, { color: "#e0a63c", dash: "4 3", width: 1.4 }) + line(st, stTip, { color: "#6b5b45", width: 4 });
    body += text(mid(tower, tip).x, base + 14, kind === "height" ? `${T}m` : "?", { size: 13, color: kind === "height" ? INK : MARK }) + text(tower.x - 16, (top.y + base) / 2, kind === "height" ? "?" : `${H}m`, { size: 13, anchor: "end", color: kind === "height" ? MARK : INK });
    body += text(st.x - 8, (stTop.y + base) / 2, `${stick}m`, { size: 12, anchor: "end" }) + text(mid(st, stTip).x, base + 14, `${shadow}m`, { size: 12 });
    const html = svg(stTip.x + 40, base + 30, body, "탑과 막대의 그림자");
    if (kind === "height") return problem({
      prompt: `같은 시각에 길이 ${stick}m인 막대의 그림자는 ${shadow}m이고, 탑의 그림자는 ${T}m입니다. 탑의 높이는 몇 m인가요?`,
      subtype: "shadow", html, answer: `${H}m`,
      solution: `같은 시각에는 햇빛이 같은 기울기로 비추므로 막대와 그림자, 탑과 그림자가 만드는 두 직각삼각형은 닮았습니다. 그림자가 ${shadow}m에서 ${T}m로 ${mult}배이니 높이도 ${stick} × ${mult} = ${H}m입니다.`,
      family: "shadow-height", meta: { stick, shadow, mult }
    });
    return problem({
      prompt: `같은 시각에 길이 ${stick}m인 막대의 그림자가 ${shadow}m입니다. 높이가 ${H}m인 건물의 그림자는 몇 m인가요?`,
      subtype: "shadow", html, answer: `${T}m`,
      solution: `높이와 그림자의 비는 같은 시각에 늘 같습니다(${stick} : ${shadow}). 건물은 막대의 ${H} ÷ ${stick} = ${mult}배이므로 그림자도 ${shadow} × ${mult} = ${T}m입니다.`,
      family: "shadow-length", meta: { stick, shadow, mult }
    });
  }
  return null;
}

export const COURSE2_G5_GENERATORS = { c2CongruentTriangle, c2AngleEquation, c2EqualAreaShift, c2AreaRatioBase, c2SimilarScale, c2ShadowHeight };
export const COURSE2_G5_TYPE_ROWS = [
  ["c2-congruent-triangle", "geometry", "합동", "합동인 삼각형의 대응과 합동 조건", "c2CongruentTriangle"],
  ["c2-angle-equation", "geometry", "각", "식을 세워 각 구하기", "c2AngleEquation"],
  ["c2-equal-area-shift", "geometry", "넓이", "평행선과 등적변형", "c2EqualAreaShift"],
  ["c2-area-ratio-base", "geometry", "넓이와 비", "높이가 같은 삼각형의 넓이의 비", "c2AreaRatioBase"],
  ["c2-similar-scale", "geometry", "닮음", "닮은 도형의 길이·둘레·넓이", "c2SimilarScale"],
  ["c2-shadow-height", "geometry", "닮음", "그림자로 높이 재기", "c2ShadowHeight"]
];
export const COURSE2_G5_GUIDES = Object.freeze({
  "c2-congruent-triangle": "대응하는 꼭짓점의 차례를 먼저 맞추고, 대응하는 변·각이 같다는 것을 씁니다.",
  "c2-angle-equation": "모르는 각을 □로 놓고 세 각의 합 180°(또는 바깥 각 = 두 내각의 합)로 식을 세웁니다.",
  "c2-equal-area-shift": "꼭짓점을 밑변과 평행한 선을 따라 옮겨도 높이가 같아 넓이는 그대로입니다.",
  "c2-area-ratio-base": "꼭짓점이 같은 삼각형은 높이가 같아 넓이의 비 = 밑변의 비입니다.",
  "c2-similar-scale": "닮음비가 1 : k이면 길이·둘레는 k배, 넓이는 k × k배입니다.",
  "c2-shadow-height": "같은 시각의 그림자는 높이에 비례합니다 — 닮은 직각삼각형을 찾습니다."
});
