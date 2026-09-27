/* Original, source-grounded pencil-and-paper graph activities.
 * This is NOT an NM_TGEN numeric-answer generator. Student graphs are blank;
 * yValues, solutionGraph and rubric are teacher-only data for a separate key.
 * Source locators describe learning actions, not copied questions or artwork.
 */
(function (w) {
'use strict';

const SOURCES = Object.freeze({
  direct: '디딤돌수학 개념연산 1-1B · 정비례 그래프 (134쪽)',
  inverse: '디딤돌수학 개념연산 1-1B · 반비례 그래프 그리기 (146–147쪽)',
  linear: '디딤돌수학 개념연산 2-1B · 절편을 이용하여 그래프 그리기 (106쪽)',
  quadratic: '디딤돌수학 개념연산 3-1B · 이차함수 그래프 그리기 (74·76·93쪽)'
});
const MODES = Object.freeze(Object.keys(SOURCES));
const TITLE = {direct:'정비례 그래프 직접 그리기', inverse:'반비례 그래프 직접 그리기', linear:'일차함수 그래프 직접 그리기', quadratic:'이차함수 그래프 직접 그리기'};

function coefficient(a, variable) {
  return (a === 1 ? '' : a === -1 ? '-' : a === 0.5 ? '\\frac{1}{2}' : a === -0.5 ? '-\\frac{1}{2}' : String(a)) + variable;
}
function signed(n) { return n > 0 ? '+' + n : n < 0 ? String(n) : ''; }
function equation(mode, c) {
  if (mode === 'inverse') return 'y=' + (c.a < 0 ? '-' : '') + '\\frac{' + Math.abs(c.a) + '}{x}';
  if (mode === 'quadratic') return 'y=' + coefficient(c.a, c.p ? '(x' + signed(-c.p) + ')^2' : 'x^2') + signed(c.q);
  return 'y=' + coefficient(c.a, 'x') + signed(c.b);
}
function valueAt(mode, c, x) {
  if (mode === 'inverse') return c.a / x;
  if (mode === 'quadratic') return c.a * (x - c.p) * (x - c.p) + c.q;
  return c.a * x + c.b;
}
function rubrics(mode) {
  const common = ['표의 y값이 주어진 식을 만족하는가?', '가로축 x와 세로축 y를 구분하여 점을 정확한 눈금에 표시했는가?'];
  if (mode === 'inverse') return common.concat([
    'x<0인 점 3개와 x>0인 점 3개를 모두 표시했는가?',
    'a>0이면 제1·3사분면, a<0이면 제2·4사분면에 두 갈래 곡선을 그렸는가?',
    '각 갈래를 매끄럽게 잇고, 원점을 가로질러 잇거나 x축·y축에 닿게 그리지 않았는가?'
  ]);
  if (mode === 'quadratic') return common.concat([
    '꼭짓점과 대칭축을 찾고, 대칭인 점을 올바르게 표시했는가?',
    'a의 부호에 맞는 방향으로 열린 매끄러운 포물선을 그렸는가?'
  ]);
  if (mode === 'linear') return common.concat(['x절편과 y절편을 확인했는가?', '표시한 점들을 지나는 하나의 직선을 그렸는가?']);
  return common.concat(['원점과 표시한 점들을 지나는 하나의 직선을 그렸는가?']);
}

function createProblem(mode, c, id, variant) {
  let xValues;
  if (mode === 'inverse') {
    const positive = {4:[1,2,4],6:[1,2,3],8:[1,2,4],12:[2,3,6],24:[3,4,6]}[Math.abs(c.a)];
    xValues = positive.slice().reverse().map(x => -x).concat(positive);
  } else if (mode === 'quadratic') {
    const offsets = Math.abs(c.a) === 0.5 ? [-4,-2,0,2,4] : [-2,-1,0,1,2];
    xValues = offsets.map(x => x + c.p);
  } else xValues = [-2,-1,0,1,2];
  const yValues = xValues.map(x => valueAt(mode,c,x));
  // Keep every requested point inside the grid, with one complete cell spare.
  const radius = Math.max(5, Math.ceil(Math.max(...xValues.map(Math.abs), ...yValues.map(Math.abs))) + 1);
  const graph = {kind:'points', pts:[], xr:[-radius,radius], yr:[-radius,radius]};
  const solutionGraph = Object.assign({}, graph, {pts:xValues.map((x,i) => [x,yValues[i]])},
    mode === 'inverse' ? {kind:'hyperbola',k:c.a} :
      mode === 'quadratic' ? {kind:'parabola',a:c.a,p:c.p,q:c.q} : {kind:'line',m:c.a,b:c.b});
  // No fake numeric answer: completion requires a teacher to inspect the drawing.
  return {id, mode, variant:variant || 'basic', title:TITLE[mode], tex:equation(mode,c), coefficients:Object.assign({},c),
    prompt:'표의 빈칸을 채우고, 좌표평면에 점을 찍어 그래프를 직접 그리세요.',
    answerType:'rubric', assessment:'teacher-review', medium:'paper-pencil',
    xValues, yValues, graph, solutionGraph, rubric:rubrics(mode), source:SOURCES[mode],
    features: mode === 'inverse' ? {quadrants:c.a > 0 ? [1,3] : [2,4], product:c.a} :
      mode === 'quadratic' ? {vertex:[c.p,c.q],axis:c.p,opens:c.a > 0 ? 'up' : 'down'} :
        {xIntercept:-c.b/c.a,yIntercept:c.b}
  };
}

// A graph's identity is its mathematical variant, never its render id or seed.
// Keep the key public so a mixed worksheet can reserve variants across rounds.
function getProblemKey(problem) {
  const mode = problem && problem.mode, variant = problem && problem.variant || 'basic';
  if (!MODES.includes(mode)) throw new RangeError('Unknown graph-drawing mode: ' + mode);
  if (variant !== 'basic' && !(mode === 'quadratic' && variant === 'shifted')) throw new RangeError('Unsupported graph activity variant.');
  const c = problem.coefficients || {};
  const values = mode === 'quadratic' ? [c.a,c.p,c.q] : mode === 'inverse' ? [c.a] : [c.a,c.b];
  if (!values.every(Number.isFinite)) throw new TypeError('A graph identity requires finite numeric coefficients.');
  return 'graph-drawing:v1:' + mode + ':' + variant + ':' + values.join(':');
}

function coefficientPool(mode, variant) {
  const magnitudes = mode === 'inverse' ? [4,6,8,12] : mode === 'quadratic' ? [0.5,1,2] : [1,2,3];
  const bs = mode === 'linear' ? [-2,-1,1,2] : [0];
  const shifts = mode === 'quadratic' && variant === 'shifted' ? [-1,1] : [0];
  const pool = [];
  for (const sign of [1,-1]) for (const a of magnitudes) for (const b of bs) for (const p of shifts) for (const q of shifts) {
    pool.push({a:sign*a,b,p,q});
  }
  return pool;
}

function makeSet(options) {
  options = options || {};
  const mode = options.mode || 'inverse';
  if (!MODES.includes(mode)) throw new RangeError('Unknown graph-drawing mode: ' + mode);
  const count = options.count == null ? 6 : options.count;
  if (!Number.isInteger(count) || count < 1 || count > 60) throw new RangeError('Graph activity count must be an integer from 1 to 60.');
  const variant = options.variant || 'basic';
  if (variant !== 'basic' && !(mode === 'quadratic' && variant === 'shifted')) throw new RangeError('Unsupported graph activity variant.');
  const exclude = options.exclude == null ? new Set() : options.exclude;
  if (Object.prototype.toString.call(exclude) !== '[object Set]') throw new TypeError('Graph activity exclude must be a Set of problem keys.');
  const keyOf = c => getProblemKey({mode,variant,coefficients:c});
  const fullPool = coefficientPool(mode,variant);
  const available = fullPool.filter(c => !Set.prototype.has.call(exclude,keyOf(c)));
  if (count > available.length) {
    const error = new RangeError('Not enough unique graph variants: requested ' + count + ', available ' + available.length + '.');
    Object.assign(error,{code:'NM_UNIQUE_POOL_EXHAUSTED',requested:count,available:available.length,capacity:fullPool.length,mode,variant});
    throw error;
  }
  const api = w.NM_RNG;
  if (!api || !api.mulberry32 || !api.hashSeed) throw new Error('NM_RNG must be loaded before graph-drawing.js is used.');
  const seed = String(options.seed == null ? 'graph-drawing' : options.seed);
  const rng = api.mulberry32(api.hashSeed('graph-drawing:v1:' + mode + ':' + variant + ':' + seed));
  // Preserve the old first six seeded tasks as a preference order only. They
  // are members of the finite pool, not a bank that can be cycled or refilled.
  const magnitudes = mode === 'inverse' ? [4,6,8,12] : mode === 'quadratic' ? [0.5,1,2] : [1,2,3];
  const pos = api.shuffle(rng,magnitudes).slice(0,3), neg = api.shuffle(rng,magnitudes).slice(0,3).map(a => -a);
  const preferred = api.shuffle(rng,pos.concat(neg)).map(a => {
    const c = {a,b:0,p:0,q:0};
    if (mode === 'linear') c.b = api.pick(rng,[-2,-1,1,2]);
    if (mode === 'quadratic' && variant === 'shifted') {c.p=api.pick(rng,[-1,1]);c.q=api.pick(rng,[-1,1]);}
    return c;
  });
  const preferredKeys = new Set(preferred.map(keyOf));
  let remaining = preferred.filter(c => !Set.prototype.has.call(exclude,keyOf(c)))
    .concat(api.shuffle(rng,available.filter(c => !preferredKeys.has(keyOf(c)))));
  const result = [];
  // Select and REMOVE pool members. Preserve 3+/3- in each full six-task block
  // whenever those signs remain; exclusions never trigger duplicate fallback.
  while (result.length < count) {
    const blockSize = Math.min(6,count-result.length);
    const positive = remaining.filter(c => c.a > 0), negative = remaining.filter(c => c.a < 0);
    const selected = blockSize === 6 && positive.length >= 3 && negative.length >= 3
      ? new Set(positive.slice(0,3).concat(negative.slice(0,3)).map(keyOf))
      : new Set(remaining.slice(0,blockSize).map(keyOf));
    for (const c of remaining.filter(c => selected.has(keyOf(c)))) {
      result.push(createProblem(mode,c,'GD-' + mode + '-' + variant + '-' + api.hashSeed(seed).toString(36) + '-' + (result.length+1),variant));
    }
    remaining = remaining.filter(c => !selected.has(keyOf(c)));
  }
  // Reserve only after the complete set exists. Capacity/validation failures
  // leave a caller's worksheet-wide exclusion set exactly as it was.
  for (const problem of result) Set.prototype.add.call(exclude,getProblemKey(problem));
  return result;
}

function lesson(mode, variant) {
  if (!MODES.includes(mode)) throw new RangeError('Unknown graph-drawing mode: ' + mode);
  variant = variant || 'basic';
  if (variant !== 'basic' && !(mode === 'quadratic' && variant === 'shifted')) throw new RangeError('Unsupported graph activity variant.');
  const content = {
    direct:{why:'정비례 y=ax를 만족하는 점을 모으면 원점을 지나는 직선이 됩니다.',steps:['표의 x를 식에 넣어 y를 구합니다.','원점과 표의 점을 찍습니다.','자를 이용해 점들을 지나는 직선을 긋습니다.'],tip:'한 점의 y좌표를 x좌표로 나누면 비례상수 a입니다. 단, x=0에서는 나눌 수 없습니다.',caution:'점만 찍고 끝내지 마세요. 그래프는 표시한 점 밖으로도 이어지는 직선입니다.'},
    inverse:{why:'반비례 y=a/x에서는 한 점의 두 좌표를 곱한 xy가 항상 a입니다. 양쪽의 점들이 각각 하나의 곡선을 만듭니다.',steps:['0이 아닌 x를 식에 넣어 y를 구합니다.','x가 음수인 점 3개, 양수인 점 3개를 찍습니다.','각쪽의 점을 매끄럽게 이어 두 갈래 곡선을 그립니다.'],tip:'한 점의 x좌표 × y좌표 = 비례상수 a. 예: (−2, 3)이면 a=−6입니다.',caution:'a>0이면 제1·3사분면, a<0이면 제2·4사분면입니다. 두 갈래를 원점에서 잇지 않고, 곡선은 x축·y축에 닿지 않습니다.'},
    linear:{why:'일차함수 y=ax+b를 만족하는 점들은 한 직선 위에 있습니다. 두 절편은 직선의 위치를 찾는 단서입니다.',steps:['x=0일 때 y절편, y=0일 때 x절편을 구합니다.','표의 y값을 구하고 점들을 표시합니다.','두 절편과 점들을 지나는 직선을 긋습니다.'],tip:'y절편은 b, x절편은 −b/a입니다. 절편을 (0,b), (−b/a,0)이라는 점으로 바꾸어 표시하세요.',caution:'x절편과 y절편은 수이고, 그래프 위에 찍는 것은 좌표를 가진 점입니다.'},
    quadratic:{why:'이차함수의 그래프는 대칭축을 기준으로 양쪽 모양이 같은 포물선입니다. 꼭짓점에서 같은 거리의 x는 같은 y를 만듭니다.',steps:['식에서 꼭짓점과 대칭축을 찾습니다.','표를 채우고 꼭짓점 양쪽의 점을 찍습니다.','대칭을 살려 점들을 매끄러운 포물선으로 잇습니다.'],tip:'y=a(x−p)²+q의 꼭짓점은 (p,q), 대칭축은 x=p입니다. y=ax²에서는 (p,q)=(0,0)입니다.',caution:'점을 꺾인 선으로 잇지 마세요. a>0이면 위로, a<0이면 아래로 열린 포물선입니다.'}
  }[mode];
  if (mode === 'quadratic' && variant === 'basic') content.tip = 'y=ax²의 꼭짓점은 (0,0), 대칭축은 x=0입니다. x의 부호만 반대인 두 점은 y가 같습니다.';
  // Worked examples use coefficients outside every practice bank: students must
  // construct a new graph, not trace the exact answer from the teaching page.
  const c = {a:mode === 'inverse' ? -24 : mode === 'quadratic' ? 3 : 4,b:mode === 'linear' ? -2 : 0,p:variant === 'shifted' ? 1 : 0,q:variant === 'shifted' ? -1 : 0};
  return Object.assign({title:TITLE[mode],source:SOURCES[mode],example:createProblem(mode,c,'GD-example-' + mode + '-' + variant,variant)},content);
}

w.NM_GRAPH_DRAWING = Object.freeze({version:2,modes:MODES,makeSet,lesson,getProblemKey});
})(typeof window !== 'undefined' ? window : globalThis);
