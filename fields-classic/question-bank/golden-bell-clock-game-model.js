import { HANDS_ON_ACTIVITIES, clockValueAfterQuarterTurns } from "./golden-bell-hands-on-models.js?v=20261004a";

// 1권 「시계 바늘 돌리기」 게임의 규칙. 화면과 검사가 같은 함수를 쓴다.
// 돌리는 양은 원본이 쓰는 세 가지(반의 반 바퀴·반 바퀴·한 바퀴)만 쓰고 분수 표기는 쓰지 않는다.
// 양수 = 시계 방향, 단위 = 반의 반 바퀴.

export const AMOUNT_NAMES = Object.freeze({ 1: "반의 반 바퀴", 2: "반 바퀴", 4: "한 바퀴" });
export const MAX_FREE_TURNS = 8;

// 문제 종류. 레벨은 이 종류들을 섞어 만든다.
export const STAGES = Object.freeze([
  { id: "turn", title: "직접 돌리기", short: "돌리기" },
  { id: "predict", title: "어디를 가리킬까?", short: "예측" },
  { id: "reverse", title: "어떻게 돌렸을까?", short: "거꾸로" },
  { id: "chain", title: "이어서 돌리기", short: "연속" }
]);

// 레벨: 연습할수록 늘어난다. 1~10은 정해진 길, 11부터는 끝없는 도전(깰 때마다 문제가 2개씩 늘고
// 바늘 가리기가 잦아진다). 틀린 종류는 섞는 레벨에서 더 자주 나온다.
export const LEVELS = Object.freeze([
  { title: "첫 바퀴", rule: "명령대로 빨간 바늘을 돌려요. 반의 반 바퀴씩 딸깍딸깍!", count: 6, mix: { turn: 1 }, amounts: [1, 2, 4], authored: true },
  { title: "방향 바꾸기", rule: "시계 방향과 반대 방향이 섞여 나와요. 방향부터 확인!", count: 6, mix: { turn: 1 }, amounts: [1, 2] },
  { title: "머릿속으로", rule: "바늘은 그대로! 도착할 숫자를 먼저 맞혀요.", count: 6, mix: { predict: 1 }, amounts: [1, 2] },
  { title: "한 바퀴는 제자리", rule: "한 바퀴를 돌면 어디로 올까요? 섞어서 나와요.", count: 6, mix: { predict: 1 }, amounts: [1, 2, 4] },
  { title: "거꾸로 찾기", rule: "출발과 도착을 보고 어떤 명령이었는지 골라요.", count: 6, mix: { reverse: 1 }, amounts: [1, 2] },
  { title: "두 번 돌리기", rule: "명령이 두 개! 차례대로 돌린 뒤 도착할 숫자를 맞혀요.", count: 6, mix: { chain: 1 }, steps: 2, amounts: [1, 2, 4] },
  { title: "골고루 섞기", rule: "돌리기·예측·거꾸로가 섞여 나와요.", count: 8, mix: { turn: 1, predict: 1, reverse: 1 }, amounts: [1, 2, 4] },
  { title: "바늘 없이", rule: "빨간 바늘이 숨어요. 출발 숫자만 보고 맞혀요.", count: 8, mix: { predict: 2, chain: 1 }, steps: 2, hidden: 1, amounts: [1, 2, 4] },
  { title: "세 번 돌리기", rule: "명령이 세 개! 한 번씩 차근차근 따라가요.", count: 8, mix: { chain: 1 }, steps: 3, amounts: [1, 2, 4] },
  { title: "시계 마스터", rule: "모든 종류가 섞이고 바늘도 가끔 숨어요.", count: 10, mix: { turn: 1, predict: 1, reverse: 1, chain: 1 }, steps: 3, hidden: 0.4, amounts: [1, 2, 4] }
]);
export const MASTER_LEVEL = LEVELS.length;

export function levelSpec(level) {
  if (level <= LEVELS.length) return { level, ...LEVELS[level - 1] };
  const extra = level - LEVELS.length;
  return {
    level, endless: true, title: `끝없는 도전 ${extra}`,
    rule: `문제가 ${10 + extra * 2}개! 깰 때마다 2개씩 늘어나요.`,
    count: Math.min(30, 10 + extra * 2), mix: { turn: 1, predict: 1, reverse: 1, chain: 2 },
    steps: 3, hidden: Math.min(0.75, 0.4 + extra * 0.05), amounts: [1, 2, 4]
  };
}

export const landing = clockValueAfterQuarterTurns;
export const landingAfter = (start, ops) => landing(start, ops.reduce((sum, op) => sum + op, 0));
export const directionName = (op) => (op < 0 ? "시계 반대 방향" : "시계 방향");
// 숫자를 우리말로 읽었을 때 받침에 맞는 조사. 2(이)·4(사)·5(오)·9(구)·12(십이)는 받침이 없고 1·7·8·11은 ㄹ 받침.
export function josa(n, kind) {
  const d = n % 10, vowel = n !== 10 && [2, 4, 5, 9].includes(d), rieul = n !== 10 && [1, 7, 8].includes(d);
  if (kind === "을") return `${n}${vowel ? "를" : "을"}`;
  if (kind === "이") return `${n}${vowel ? "" : "이"}`;
  return `${n}${vowel || rieul ? "로" : "으로"}`;
}
export const opText = (op) => `${directionName(op)}으로 ${AMOUNT_NAMES[Math.abs(op)]}`;

// 돌린 양을 말로 읽는다. 1~8까지 원본 표현만 조합한다.
export function turnAmountText(quarters) {
  const n = Math.abs(quarters);
  if (!n) return "아직 안 돌렸어요";
  const full = Math.floor(n / 4), rest = n % 4;
  const parts = [];
  if (full) parts.push(full === 1 ? "한 바퀴" : "두 바퀴");
  if (rest === 2) parts.push("반 바퀴");
  else if (rest === 1) parts.push("반의 반 바퀴");
  else if (rest === 3) parts.push("반 바퀴", "반의 반 바퀴");
  return `${directionName(quarters)}으로 ${parts.join("와 ")}`;
}

export function seededRandom(seed) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shuffle = (items, rand) => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

function starts(count, rand, avoid = []) {
  const pool = shuffle(Array.from({ length: 12 }, (_, i) => i + 1).filter((n) => !avoid.includes(n)), rand);
  return pool.slice(0, count);
}

// 거꾸로 단계의 보기: 정답 하나와, 같은 출발점에서 다른 곳에 닿는 보기 셋.
// 반 바퀴는 어느 방향이든 같은 곳에 닿으므로 반대 방향 반 바퀴는 보기에 넣지 않는다.
export function reverseChoices(op, rand) {
  const pool = Math.abs(op) === 2 ? [1, -1, 4] : [-op, op > 0 ? 2 : -2, op > 0 ? 4 : -4];
  return shuffle([op, ...pool], rand);
}

const pick = (items, rand) => items[Math.floor(rand() * items.length)];
const keyOf = (p) => `${p.stage}:${p.start}:${p.ops.join(",")}:${p.hidden ? 1 : 0}`;

function chainOps(steps, amounts, rand) {
  for (;;) {
    const ops = Array.from({ length: steps }, () => pick(amounts, rand) * (rand() < 0.5 ? -1 : 1));
    // 한 바퀴는 한 번까지, 모두 같은 명령은 피한다(따라가는 연습이 되도록).
    if (ops.filter((op) => Math.abs(op) === 4).length <= 1 && new Set(ops).size > 1) return ops;
  }
}

// 섞는 레벨에서는 많이 틀린 종류의 비중을 늘린다(최대 3배).
function weightedKinds(mix, weak = {}) {
  return Object.entries(mix).map(([kind, w]) => [kind, w * Math.min(3, 1 + (weak[kind] || 0) * 0.5)]);
}

export function buildLevel(level, { seed = Date.now(), weak = {}, recent = [] } = {}) {
  const spec = levelSpec(level);
  const rand = seededRandom(seed);
  const kinds = weightedKinds(spec.mix, Object.keys(spec.mix).length > 1 ? weak : {});
  const total = kinds.reduce((sum, [, w]) => sum + w, 0);
  const drawKind = () => { let r = rand() * total; for (const [kind, w] of kinds) if ((r -= w) <= 0) return kind; return kinds[0][0]; };
  const seen = new Set(recent);
  const out = [];
  if (spec.authored) for (const round of HANDS_ON_ACTIVITIES["turn-clock"].rounds) {
    const p = { stage: "turn", start: round.start, ops: [round.turns] };
    seen.add(keyOf(p));
    out.push(p);
  }
  let guard = 0;
  while (out.length < spec.count && guard++ < 500) {
    const stage = drawKind();
    const sign = rand() < 0.5 ? -1 : 1;
    const amounts = stage === "reverse" ? spec.amounts.filter((a) => a !== 4) : spec.amounts;
    const ops = stage === "chain" ? chainOps(spec.steps || 2, spec.amounts, rand) : [pick(amounts, rand) * sign];
    const p = { stage, start: 1 + Math.floor(rand() * 12), ops };
    if (stage !== "turn" && stage !== "reverse" && rand() < (spec.hidden || 0)) p.hidden = true;
    if (stage === "reverse") p.choices = reverseChoices(ops[0], rand);
    const key = keyOf(p);
    if (seen.has(key) && guard < 400) continue;
    // 바로 앞 문제와 출발점이 같으면 다시 뽑는다.
    if (out.length && out.at(-1).start === p.start && guard < 400) continue;
    seen.add(key);
    out.push(p);
  }
  return out.map((p, index) => ({ ...p, index, level, answer: landingAfter(p.start, p.ops), key: keyOf(p) }));
}

// 점수: 문제당 첫 시도 2점, 두 번째 1점. 60% 이상이면 통과(다음 레벨 열림).
export function levelResult(points, count) {
  const ratio = count ? points / (count * 2) : 0;
  return { passed: ratio >= 0.6, stars: ratio >= 0.95 ? 3 : ratio >= 0.8 ? 2 : ratio >= 0.6 ? 1 : 0, ratio };
}

// 직접 돌리기는 도착 숫자가 같아도 돌린 양과 방향이 달라야 틀린다(원본 판정 그대로).
export function checkTurn(problem, quarters) {
  return quarters === problem.ops[0];
}

export function checkNumber(problem, value) {
  return value === problem.answer;
}

// 같은 곳에 닿는 보기는 모두 정답이다(보기는 reverseChoices가 하나만 남기지만 판정은 위치로 한다).
export function checkChoice(problem, op) {
  return landing(problem.start, op) === problem.answer;
}

export function missionText(problem) {
  if (problem.stage === "turn") return `${problem.start}에서 ${opText(problem.ops[0])} 돌리세요.`;
  if (problem.stage === "predict") return `${problem.start}에서 ${opText(problem.ops[0])} 돌리면 어디를 가리킬까요?`;
  if (problem.stage === "reverse") return `${problem.start}에서 ${problem.answer}까지 어떻게 돌렸을까요?`;
  return `${problem.start}에서 ${problem.ops.map(opText).join(", 이어서 ")} 돌리면 어디를 가리킬까요?`;
}

// 처음 틀렸을 때 독쌤이 주는 힌트. 답을 말하지 않고 생각할 길만 준다.
export function hintText(problem, attempt) {
  if (problem.stage === "turn") {
    if (attempt !== undefined && attempt !== 0 && landing(problem.start, attempt) === problem.answer) return "도착한 숫자는 같아. 그런데 돌린 양이나 방향이 달라. 한 칸씩 다시 세어 봐.";
    if (attempt !== undefined && Math.sign(attempt) !== Math.sign(problem.ops[0]) && attempt !== 0) return "방향을 다시 봐. 시계 방향은 숫자가 커지는 쪽이야.";
    return "반의 반 바퀴는 숫자 세 칸이야. 반 바퀴는 두 번, 한 바퀴는 네 번 돌려.";
  }
  if (problem.stage === "reverse") return "출발한 바늘에서 도착한 바늘까지 몇 번 꺾였는지, 어느 쪽으로 갔는지 봐.";
  if (problem.stage === "chain") return "한 번에 하지 말고, 첫 번째로 돌린 자리를 먼저 찾아. 거기서 다음 명령으로 돌려.";
  if (problem.hidden) return "바늘이 숨어 있어도 출발 숫자에서 세면 돼. 반의 반 바퀴는 숫자 세 칸이야.";
  return Math.abs(problem.ops[0]) === 4 ? "한 바퀴를 돌면 처음 자리로 돌아와." : "반의 반 바퀴는 숫자 세 칸, 반 바퀴는 여섯 칸이야.";
}

export function successText(problem, choiceOp) {
  if (problem.stage === "reverse" && Math.abs(problem.ops[0]) === 2) return `맞았어! ${choiceOp < 0 ? "시계 방향" : "시계 반대 방향"}으로 반 바퀴 돌려도 똑같이 ${problem.answer}에 와.`;
  if (problem.stage === "chain") {
    const stops = problem.ops.map((_, i) => landingAfter(problem.start, problem.ops.slice(0, i + 1)));
    return `맞았어! ${problem.start} → ${stops.join(" → ")} 순서로 왔어.`;
  }
  if (Math.abs(problem.ops[0]) === 4) return `맞았어! 한 바퀴를 돌면 다시 ${josa(problem.answer, "으로")} 돌아와.`;
  return `맞았어! ${problem.start}에서 ${opText(problem.ops[0])} 돌리면 ${josa(problem.answer, "이")}야.`;
}

// 첫 시도에 맞히면 별 2개, 두 번째에 맞히면 1개, 정답을 보고 넘어가면 0개.
export const starsFor = (wrongTries, revealed) => (revealed ? 0 : wrongTries === 0 ? 2 : 1);
