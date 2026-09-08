const radians = value => value * Math.PI / 180;
const vector = angle => [Math.cos(radians(angle)), Math.sin(radians(angle))];
const add = (a, b, scale = 1) => a.map((value, i) => value + b[i] * scale);
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const positionKinds = ["corresponding-position", "alternate-position"];
const degreeKinds = ["corresponding-angle", "alternate-angle", "same-side-interior-angle", "vertical-transfer-angle", "supplementary-transfer-angle"];
const allKinds = [...positionKinds, ...degreeKinds];
const frame = { left: 20, right: 340, top: 18, bottom: 248 };

function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

// Each crossing has sectors u->t, t->-u, -u->-t, -t->u.
// The crossings lie in order along t, so only [0, 1] and [6, 7] are interior.
const configurations = [
  ["corresponding-position", 58, 17, -12, 0, null, [1, 2, 3, 4, 5, 6, 7, 8]],
  ["corresponding-position", 106, 0, 14, 6, null, [3, 1, 4, 2, 7, 5, 8, 6]],
  ["corresponding-position", 70, -18, 88, 3, null, [6, 5, 4, 3, 2, 1, 8, 7]],
  ["corresponding-position", 121, 16, 0, 5, null, [8, 2, 6, 4, 7, 1, 5, 3]],
  ["corresponding-position", 78, 0, 165, 2, null, [2, 4, 6, 8, 1, 3, 5, 7]],
  ["corresponding-position", 62, -16, 42, 7, null, [5, 3, 1, 7, 6, 4, 2, 8]],
  ["alternate-position", 67, 0, -16, 0, null, [1, 3, 5, 7, 2, 4, 6, 8]],
  ["alternate-position", 112, 18, 28, 1, null, [4, 1, 8, 5, 3, 2, 7, 6]],
  ["alternate-position", 73, -20, 95, 6, null, [2, 7, 4, 1, 8, 5, 6, 3]],
  ["alternate-position", 126, 0, 172, 7, null, [7, 4, 1, 6, 2, 5, 8, 3]],
  ["corresponding-angle", 50, 0, 0, 0, 4],
  ["alternate-angle", 70, 0, -20, 6, 0],
  ["same-side-interior-angle", 60, 0, 24, 1, 6],
  ["corresponding-angle", 65, 0, 92, 7, 3],
  ["alternate-angle", 125, 0, 8, 1, 7],
  ["same-side-interior-angle", 108, 0, 160, 7, 0],
  ["vertical-transfer-angle", 82, 0, 42, 2, 4],
  ["supplementary-transfer-angle", 48, 0, -12, 3, 4],
  ["vertical-transfer-angle", 117, 0, 75, 4, 2],
  ["supplementary-transfer-angle", 96, 0, 178, 5, 2]
];

export const parallelProblems = deepFreeze(configurations.map(([kind, tilt, secondTilt, rotation, source, target, labels], i) => {
  const position = positionKinds.includes(kind);
  return {
    id: `parallel-${String(i + 1).padStart(2, "0")}`, domain: "parallel", kind,
    unit: position ? "count" : "degree", responseKind: position ? "angle-label" : "degree",
    parallel: secondTilt === 0, tilt, secondTilt, rotation, source,
    ...(position ? { labels } : { target, given: source % 2 === 0 ? tilt : 180 - tilt })
  };
}));

function corresponding(index) { return (index + 4) % 8; }
function alternate(index) { return ({ 0: 6, 1: 7, 6: 0, 7: 1 })[index]; }
function coInterior(index) { return ({ 0: 7, 1: 6, 6: 1, 7: 0 })[index]; }
function targetIndex(p) {
  return p.kind === "corresponding-position" ? corresponding(p.source) : p.kind === "alternate-position" ? alternate(p.source) : p.target;
}

function clipLine(center, direction) {
  let min = -Infinity, max = Infinity;
  for (const [axis, low, high] of [[0, frame.left, frame.right], [1, frame.top, frame.bottom]]) {
    if (Math.abs(direction[axis]) < 1e-10) continue;
    const ends = [(low - center[axis]) / direction[axis], (high - center[axis]) / direction[axis]].sort((a, b) => a - b);
    min = Math.max(min, ends[0]);
    max = Math.min(max, ends[1]);
  }
  return { start: add(center, direction, min), end: add(center, direction, max), min, max };
}

function geometry(p) {
  const t = vector(p.rotation + p.tilt), middle = [180, 133];
  const centers = [add(middle, t, -62), add(middle, t, 62)];
  const lines = centers.map((center, i) => {
    const direction = vector(p.rotation + (i ? p.secondTilt : 0));
    return { center, direction, ...clipLine(center, direction) };
  });
  const sectors = centers.flatMap((center, crossing) => {
    const base = p.rotation + (crossing ? p.secondTilt : 0);
    const delta = p.tilt - (crossing ? p.secondTilt : 0);
    const starts = [base, p.rotation + p.tilt, base + 180, p.rotation + p.tilt + 180];
    return starts.map((start, sector) => {
      const sweep = sector % 2 === 0 ? delta : 180 - delta;
      const index = crossing * 4 + sector;
      return {
        index, crossing, sector, center, start, sweep,
        arms: [vector(start), vector(start + sweep)],
        labelPoint: add(center, vector(start + sweep / 2), positionKinds.includes(p.kind) ? 39 : 47),
        ...(p.labels ? { label: p.labels[index] } : {})
      };
    });
  });
  return { lines, transversal: { direction: t, ...clipLine(middle, t) }, sectors };
}

export function validateParallelProblem(p) {
  const invalid = detail => { throw new TypeError(`Invalid parallel problem: ${detail}`); };
  if (!p || p.domain !== "parallel" || typeof p.id !== "string" || !/^parallel-\d{2}$/.test(p.id)) invalid("identity");
  if (!allKinds.includes(p.kind)) invalid("kind");
  if (![p.tilt, p.secondTilt, p.rotation].every(Number.isFinite)) invalid("geometry");
  if (p.tilt < 38 || p.tilt > 142 || Math.abs(p.secondTilt) > 22 || Math.abs(p.rotation) > 360) invalid("geometry bounds");
  const delta = p.tilt - p.secondTilt;
  if (delta < 34 || delta > 146) invalid("degenerate or unreadable angle");
  if (typeof p.parallel !== "boolean" || p.parallel !== (p.secondTilt === 0)) invalid("parallel condition disagrees with lines");
  if (!Number.isInteger(p.source) || p.source < 0 || p.source > 7) invalid("source sector");
  const position = positionKinds.includes(p.kind);
  if (p.unit !== (position ? "count" : "degree") || p.responseKind !== (position ? "angle-label" : "degree")) invalid("response type");
  if (position) {
    if (!Array.isArray(p.labels) || p.labels.length !== 8 || new Set(p.labels).size !== 8 || p.labels.some(n => !Number.isInteger(n) || n < 1 || n > 8)) invalid("unique labels 1 to 8 required");
    if (p.kind === "alternate-position" && alternate(p.source) === undefined) invalid("alternate source must be interior");
    if (p.target !== undefined || p.given !== undefined) invalid("position problem contains calculation data");
  } else {
    if (!p.parallel) invalid("angle computation requires parallel lines");
    if (p.labels !== undefined) invalid("calculation diagram uses degree labels");
    if (!Number.isInteger(p.target) || p.target < 0 || p.target > 7 || p.target === p.source) invalid("target sector");
    if (!Number.isInteger(p.given) || p.given <= 0 || p.given >= 180) invalid("given angle");
    if (Math.abs(p.given - (p.source % 2 === 0 ? p.tilt : 180 - p.tilt)) > 1e-9) invalid("given angle disagrees with geometry");
    const otherCrossing = Math.floor(p.source / 4) !== Math.floor(p.target / 4);
    const sectorChange = (p.target - p.source + 8) % 4;
    if (p.kind === "corresponding-angle" && p.target !== corresponding(p.source)) invalid("corresponding pair");
    if (p.kind === "alternate-angle" && p.target !== alternate(p.source)) invalid("interior alternate pair");
    if (p.kind === "same-side-interior-angle" && p.target !== coInterior(p.source)) invalid("co-interior pair");
    if (p.kind === "vertical-transfer-angle" && (!otherCrossing || sectorChange !== 2)) invalid("vertical transfer pair");
    if (p.kind === "supplementary-transfer-angle" && (!otherCrossing || ![1, 3].includes(sectorChange))) invalid("supplementary transfer pair");
  }
  const g = geometry(p);
  if (!p.parallel) {
    const [a, b] = g.lines, offset = b.center.map((v, i) => v - a.center[i]);
    const intersection = add(a.center, a.direction, cross(offset, b.direction) / cross(a.direction, b.direction));
    if (intersection[0] >= frame.left && intersection[0] <= frame.right && intersection[1] >= frame.top && intersection[1] <= frame.bottom) invalid("extra crossing in diagram");
  }
  if (g.sectors.some(s => s.labelPoint[0] < 34 || s.labelPoint[0] > 326 || s.labelPoint[1] < 22 || s.labelPoint[1] > 244)) invalid("labels outside diagram");
  return true;
}

export function parallelGeometry(p) { validateParallelProblem(p); return geometry(p); }
export function parallelAnswer(p) {
  validateParallelProblem(p);
  if (positionKinds.includes(p.kind)) return p.labels[targetIndex(p)];
  return ["same-side-interior-angle", "supplementary-transfer-angle"].includes(p.kind) ? 180 - p.given : p.given;
}

const copy = {
  ko: {
    title: "두 직선과 가로지르는 직선의 각", parallel: "두 직선 ℓ과 m은 평행합니다.", nonparallel: "두 직선 ℓ과 m은 평행하지 않습니다.",
    corresponding: n => `각 ${n}의 동위각은 몇 번 각인가요?`, alternate: n => `두 직선 사이의 각 ${n}과 엇각인 내부의 각은 몇 번 각인가요?`,
    compute: n => `표시된 ${n}°를 이용해 ? 각의 크기를 구하세요.`,
    positionHint: "두 교점에서 가로지르는 직선의 같은 쪽, 같은 위치를 찾아보세요. 위치 관계만으로 크기가 같다고 할 수는 없어요.",
    alternateHint: "두 직선 사이의 내부에서, 가로지르는 직선의 반대쪽에 있는 각을 찾으세요. 위치와 크기의 조건은 구별해요.",
    equalHint: "평행 표시를 먼저 확인한 뒤 두 각의 위치를 비교하세요.", sameHint: "평행한 두 직선 사이에서 같은 쪽에 있는 두 내각의 합은 180°예요.",
    verticalHint: "한 교점의 맞꼭지각을 먼저 찾고, 다른 교점의 동위각으로 옮겨보세요.", supplementaryHint: "한 직선 위에서 이웃한 두 각의 합은 180°예요. 그다음 동위각을 찾아보세요.",
    correspondingReason: "동위각의 크기는 같습니다.", alternateReason: "엇각의 크기는 같습니다.", sameReason: "동측내각의 합: 180°", verticalReason: "맞꼭지각 다음 동위각", supplementaryReason: "이웃한 각 다음 동위각",
    correspondingName: "동위각", alternateName: "내부 엇각", positionReason: "위치로 짝을 찾습니다.", nonparallelReason: "평행하지 않아도 찾습니다.",
    verticalProof: "맞꼭지각의 크기는 같고, 평행선에서 동위각의 크기도 같습니다.", supplementaryProof: "주어진 각과 한 직선 위에서 이웃한 각의 합은 180°입니다. 이 이웃한 각과 물음표 각은 평행선의 동위각이므로 크기가 같습니다.",
    pair: (name, s, a) => `${name}: ${s} ↔ ${a}`, labelSolution: (s, a, name) => `각 ${s}의 ${name}은 각 ${a}입니다. 각의 위치로 정하며, 평행하지 않아도 이 위치 관계는 성립합니다.`,
    condition: "평행 조건 아래에서", nonparallelShort: "ℓ과 m은 평행하지 않음"
  },
  en: {
    title: "Angles at two lines and a transversal", parallel: "Lines ℓ and m are parallel.", nonparallel: "Lines ℓ and m are not parallel.",
    corresponding: n => `Which numbered angle corresponds to angle ${n}?`, alternate: n => `Which interior angle is alternate to interior angle ${n}?`, compute: n => `Use the marked ${n}° angle to find the angle marked ?.`,
    positionHint: "Compare the same relative position at both crossings, on the same side of the transversal. Position alone does not imply equal sizes.",
    alternateHint: "Stay between the two lines and look on the opposite side of the transversal. Keep positions separate from size conditions.",
    equalHint: "Check the parallel marks first, then compare the positions of the two angles.", sameHint: "Interior angles on the same side of a transversal total 180° when the lines are parallel.",
    verticalHint: "Find the vertically opposite angle at one crossing, then its corresponding angle at the other crossing.", supplementaryHint: "Adjacent angles on a straight line total 180°. Then use corresponding angles.",
    correspondingReason: "Corresponding angles are equal.", alternateReason: "Alternate interior angles are equal.", sameReason: "Co-interior angles total 180°.", verticalReason: "Vertical, then corresponding.", supplementaryReason: "Adjacent, then corresponding.",
    correspondingName: "Corresponding", alternateName: "Alternate interior", positionReason: "Match by relative position.", nonparallelReason: "Parallel lines are not required.",
    verticalProof: "Vertically opposite angles are equal. Corresponding angles on parallel lines are also equal.", supplementaryProof: "The given angle and its adjacent angle on a straight line total 180°. That adjacent angle corresponds to the unknown angle on the parallel line, so their sizes are equal.",
    pair: (name, s, a) => `${name}: ${s} ↔ ${a}`, labelSolution: (s, a, name) => `${name} pair: angles ${s} and ${a}. This describes their positions, even when the lines are not parallel.`,
    condition: "With parallel lines", nonparallelShort: "ℓ and m are not parallel"
  },
  zh: {
    title: "两条直线与截线形成的角", parallel: "直线 ℓ 与 m 平行。", nonparallel: "直线 ℓ 与 m 不平行。",
    corresponding: n => `角 ${n} 的同位角是几号角？`, alternate: n => `在两条直线之间，与内角 ${n} 构成内错角的是几号角？`, compute: n => `利用标出的 ${n}°，求问号所表示的角。`,
    positionHint: "比较两个交点处截线同侧的相同位置。仅凭位置关系不能判断角度相等。", alternateHint: "在两条直线之间，寻找截线另一侧的内角。注意区分位置关系与角度条件。",
    equalHint: "先确认平行标记，再比较两个角的位置。", sameHint: "两直线平行时，截线同侧的两个内角之和为180°。", verticalHint: "先找一个交点处的对顶角，再找另一个交点处的同位角。", supplementaryHint: "直线上相邻的两个角之和为180°，然后利用同位角。",
    correspondingReason: "同位角相等。", alternateReason: "内错角相等。", sameReason: "同旁内角之和：180°", verticalReason: "先对顶角，再同位角", supplementaryReason: "先邻补角，再同位角",
    correspondingName: "同位角", alternateName: "内错角", positionReason: "根据位置配对。", nonparallelReason: "不平行时也能按位置配对。",
    verticalProof: "对顶角相等，两直线平行时同位角也相等。", supplementaryProof: "已知角与它的邻补角之和为180°。这个邻补角与问号角是两条平行线的同位角，因此相等。",
    pair: (name, s, a) => `${name}：${s} ↔ ${a}`, labelSolution: (s, a, name) => `角 ${s} 与角 ${a} 是${name}。这是位置关系，即使两直线不平行也成立。`,
    condition: "在两直线平行的条件下", nonparallelShort: "ℓ 与 m 不平行"
  },
  ja: {
    title: "二直線と横切る直線が作る角", parallel: "直線 ℓ と m は平行です。", nonparallel: "直線 ℓ と m は平行ではありません。",
    corresponding: n => `角 ${n} の同位角は何番の角ですか。`, alternate: n => `二直線の間にある角 ${n} と錯角になる内側の角は何番ですか。`, compute: n => `示された ${n}° を使って、? の角度を求めましょう。`,
    positionHint: "二つの交点で、横切る直線の同じ側の同じ位置を探しましょう。位置だけでは角度が等しいとはいえません。", alternateHint: "二直線の間で、横切る直線の反対側にある角を探しましょう。位置と角度の条件を区別します。",
    equalHint: "平行の印を確かめてから、二つの角の位置を比べましょう。", sameHint: "平行な二直線の間で、横切る直線の同じ側にある内角の和は180°です。", verticalHint: "一つの交点で対頂角を探し、次にもう一つの交点で同位角を探しましょう。", supplementaryHint: "一直線上の隣り合う角の和は180°です。次に同位角を使いましょう。",
    correspondingReason: "同位角の大きさは等しい。", alternateReason: "錯角の大きさは等しい。", sameReason: "同じ側の内角の和：180°", verticalReason: "対頂角から同位角へ", supplementaryReason: "隣り合う角から同位角へ",
    correspondingName: "同位角", alternateName: "内側の錯角", positionReason: "位置で組を見つけます。", nonparallelReason: "平行でなくても見つかります。",
    verticalProof: "対頂角の大きさは等しく、平行な二直線の同位角の大きさも等しくなります。", supplementaryProof: "与えられた角と一直線上で隣り合う角の和は180°です。その隣の角と問われた角は平行線の同位角なので、大きさが等しくなります。",
    pair: (name, s, a) => `${name}：${s} ↔ ${a}`, labelSolution: (s, a, name) => `角 ${s} と角 ${a} は${name}です。角の位置を表す関係なので、二直線が平行でなくても成り立ちます。`,
    condition: "二直線が平行なので", nonparallelShort: "ℓ と m は平行ではない"
  }
};

function words(lang) { return copy[lang] || copy.ko; }
function reason(p, t) {
  return ({ "corresponding-angle": t.correspondingReason, "alternate-angle": t.alternateReason, "same-side-interior-angle": t.sameReason, "vertical-transfer-angle": t.verticalReason, "supplementary-transfer-angle": t.supplementaryReason })[p.kind];
}
function equation(p) {
  const answer = parallelAnswer(p);
  return ["same-side-interior-angle", "supplementary-transfer-angle"].includes(p.kind) ? `180° − ${p.given}° = ${answer}°` : `? = ${p.given}°`;
}
export function parallelPrompt(p, lang = "ko") {
  validateParallelProblem(p);
  const t = words(lang), condition = p.parallel ? t.parallel : t.nonparallel;
  return `${condition} ${p.kind === "corresponding-position" ? t.corresponding(p.labels[p.source]) : p.kind === "alternate-position" ? t.alternate(p.labels[p.source]) : t.compute(p.given)}`;
}
export function parallelHint(p, lang = "ko") {
  validateParallelProblem(p);
  const t = words(lang);
  return ({ "corresponding-position": t.positionHint, "alternate-position": t.alternateHint, "same-side-interior-angle": t.sameHint, "vertical-transfer-angle": t.verticalHint, "supplementary-transfer-angle": t.supplementaryHint })[p.kind] || t.equalHint;
}
export function parallelSolution(p, lang = "ko") {
  const answer = parallelAnswer(p), t = words(lang);
  if (positionKinds.includes(p.kind)) return t.labelSolution(p.labels[p.source], answer, p.kind === "corresponding-position" ? t.correspondingName : t.alternateName);
  const proof = p.kind === "vertical-transfer-angle" ? t.verticalProof : p.kind === "supplementary-transfer-angle" ? t.supplementaryProof : reason(p, t);
  return `${t.condition}: ${proof} ${equation(p)}`;
}

const pointText = p => p.map(v => Number(v.toFixed(4))).join(" ");
function line(a, b, attrs) { return `<path d="M ${pointText(a)} L ${pointText(b)}" fill="none" ${attrs}/>`; }
function label(point, text, attrs = "") { return `<text x="${point[0].toFixed(4)}" y="${point[1].toFixed(4)}" text-anchor="middle" dominant-baseline="middle" font-size="18" font-family="Arial, sans-serif" fill="#182230" ${attrs}>${escape(text)}</text>`; }
function sectorPath(s, radius, fill) {
  const a = add(s.center, s.arms[0], radius), b = add(s.center, s.arms[1], radius);
  return `M ${pointText(fill ? s.center : a)} ${fill ? `L ${pointText(a)}` : ""} A ${radius} ${radius} 0 0 1 ${pointText(b)}${fill ? " Z" : ""}`;
}
function footer(p, t, reveal) {
  if (!reveal) return label([180, 286], p.parallel ? "ℓ ∥ m" : t.nonparallelShort);
  const position = positionKinds.includes(p.kind);
  const first = position ? t.pair(p.kind === "corresponding-position" ? t.correspondingName : t.alternateName, p.labels[p.source], parallelAnswer(p)) : reason(p, t);
  const second = position ? (p.parallel ? t.positionReason : t.nonparallelReason) : equation(p);
  return label([180, 278], first, 'class="parallel-reason"') + label([180, 303], second);
}

export function renderParallel(p, { reveal = false, lang = "ko", interactive = false } = {}) {
  const g = parallelGeometry(p), t = words(lang), target = targetIndex(p), position = positionKinds.includes(p.kind);
  // Number entry works in both modes; the diagram has no fake focusable controls.
  void interactive;
  const highlighted = reveal ? [p.source, target] : position ? [p.source] : [p.source, target];
  let body = g.sectors.filter(s => highlighted.includes(s.index)).map(s => `<path d="${sectorPath(s, 29, true)}" fill="${s.index === p.source ? "#d5ebed" : reveal ? "#d9eedf" : "#f5e5e9"}"/>`).join("");
  body += g.lines.map((l, i) => {
    const point = add(add(l.center, l.direction, l.max - 18), [-l.direction[1], l.direction[0]], -12);
    const namePoint = [Math.max(28, Math.min(332, point[0])), Math.max(30, Math.min(236, point[1]))];
    return line(l.start, l.end, `data-line="${i}" stroke="#465761" stroke-width="2.5"`) + label(namePoint, i ? "m" : "ℓ", 'font-style="italic"');
  }).join("");
  body += line(g.transversal.start, g.transversal.end, 'data-transversal="true" stroke="#24616c" stroke-width="3"');
  if (p.parallel) body += g.lines.map(l => {
    const middle = add(l.center, l.direction, l.min * 0.74), normal = [-l.direction[1], l.direction[0]];
    return `<path data-parallel-mark="true" d="M ${pointText(add(add(middle, l.direction, -5), normal, -5))} L ${pointText(add(middle, l.direction, 4))} L ${pointText(add(add(middle, l.direction, -5), normal, 5))}" fill="none" stroke="#465761" stroke-width="2.5"/>`;
  }).join("");
  body += g.sectors.filter(s => highlighted.includes(s.index)).map(s => `<path data-sector="${s.index}" d="${sectorPath(s, 24, false)}" fill="none" stroke="${s.index === p.source ? "#24616c" : reveal ? "#16734b" : "#a54060"}" stroke-width="2.5"/>`).join("");
  if (position) {
    body += g.sectors.map(s => {
      const source = s.index === p.source, answer = reveal && s.index === target;
      return `<circle cx="${s.labelPoint[0].toFixed(4)}" cy="${s.labelPoint[1].toFixed(4)}" r="12.5" fill="${source ? "#d5ebed" : answer ? "#d9eedf" : "#fff"}" stroke="${source ? "#24616c" : answer ? "#16734b" : "none"}" stroke-width="2"/>${label(s.labelPoint, s.label, `data-angle-label="${s.label}"${source || answer ? ' font-weight="700"' : ""}`)}`;
    }).join("");
  } else {
    body += [p.source, target].map(index => label(g.sectors[index].labelPoint, index === p.source ? `${p.given}°` : reveal ? `${parallelAnswer(p)}°` : "?", `data-angle-role="${index === p.source ? "given" : "target"}" font-weight="700" stroke="#fff" stroke-width="5" paint-order="stroke"`)).join("");
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="problem-svg parallel-svg" viewBox="0 0 360 320" role="img" aria-label="${escape(t.title)}"><title>${escape(t.title)}</title><desc>${escape(parallelPrompt(p, lang))}${reveal ? ` ${escape(parallelSolution(p, lang))}` : ""}</desc>${body}${footer(p, t, reveal)}</svg>`;
}
