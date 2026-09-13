const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[ch]));

export const COMPLEX_FRACTION_KIND = "course03-complex-fraction";

const gcd = (a, b) => {
  let x = Math.abs(a); let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
};

export const reduceFraction = (numerator, denominator) => {
  if (!Number.isInteger(numerator) || !Number.isInteger(denominator) || denominator === 0) throw new RangeError("fraction must contain integers and a nonzero denominator");
  const sign = denominator < 0 ? -1 : 1;
  const factor = gcd(numerator, denominator);
  return Object.freeze({ numerator: sign * numerator / factor, denominator: sign * denominator / factor });
};

export const divideFractions = (top, bottom) => reduceFraction(top.numerator * bottom.denominator, top.denominator * bottom.numerator);

export const continuedFractionTerms = (numerator, denominator) => {
  const value = reduceFraction(numerator, denominator);
  if (value.numerator <= 0 || value.denominator <= 0) throw new RangeError("continued fraction lesson supports positive fractions");
  const terms = [];
  let a = value.numerator; let b = value.denominator;
  while (b) {
    const quotient = Math.floor(a / b);
    terms.push(quotient);
    [a, b] = [b, a - quotient * b];
  }
  return Object.freeze(terms);
};

export const fractionFromContinuedTerms = (terms) => {
  if (!Array.isArray(terms) || !terms.length || terms.some((term) => !Number.isInteger(term) || term < 0)) throw new RangeError("continued fraction terms must be nonnegative integers");
  let numerator = terms.at(-1);
  let denominator = 1;
  for (let index = terms.length - 2; index >= 0; index -= 1) [numerator, denominator] = [terms[index] * numerator + denominator, numerator];
  return reduceFraction(numerator, denominator);
};

export const formatFraction = ({ numerator, denominator }) => denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
export const formatContinuedTerms = (numerator, denominator) => continuedFractionTerms(numerator, denominator).filter((term, index) => index > 0 || term !== 0).join(",");

const divideVisual = (top, bottom, phase = "problem") => ({ kind: COMPLEX_FRACTION_KIND, task: "divide", top, bottom, phase });
const convertVisual = (numerator, denominator, phase = "problem") => ({ kind: COMPLEX_FRACTION_KIND, task: "convert", numerator, denominator, phase });

const lessonId = "course-03-a1-complex-fraction";
const answerRef = (id) => `/course23/course-03-a1/${lessonId}:${id}`;
const item = (id, prompt, visual, group, typeLabel) => ({
  id: `${lessonId}:${id}`, prompt,
  hint: visual.task === "divide"
    ? "큰 분수선을 나눗셈 기호로 바꾸고, 아래 분수를 뒤집어 곱하세요."
    : "분모를 분자로 나눈 몫과 나머지를 적고, 나머지로 같은 나눗셈을 반복하세요.",
  visual, answerMode: "input", inputMode: "text", typeLabel,
  sourceNo: id.startsWith("practice-") ? String(Number(id.slice("practice-".length))) : "",
  printGroup: group, answerRef: answerRef(id)
});

const original = [
  item("practice-1", "(2/3) ÷ (4/5)의 값을 기약분수로 나타내세요.", divideVisual({ numerator: 2, denominator: 3 }, { numerator: 4, denominator: 5 }), 1, "번분수를 나눗셈으로 계산하기"),
  item("practice-2", "(7/10) ÷ (14/15)의 값을 기약분수로 나타내세요.", divideVisual({ numerator: 7, denominator: 10 }, { numerator: 14, denominator: 15 }), 1, "번분수를 나눗셈으로 계산하기"),
  item("practice-3", "7/16을 연분수로 바꿀 때 바깥에서 안쪽으로 나타나는 수를 쉼표로 구분해 쓰세요. 맨 앞의 0은 쓰지 않습니다.", convertVisual(7, 16), 2, "분수를 연분수로 바꾸기"),
  item("practice-4", "47/14를 연분수로 바꿀 때 바깥에서 안쪽으로 나타나는 수를 쉼표로 구분해 쓰세요.", convertVisual(47, 14), 2, "분수를 연분수로 바꾸기")
];

const extension = item("additional-1", "11/26을 연분수로 바꿀 때 바깥에서 안쪽으로 나타나는 수를 쉼표로 구분해 쓰세요. 맨 앞의 0은 쓰지 않습니다.", convertVisual(11, 26), 1, "분수를 연분수로 바꾸기");
const similarPractice = [
  item("additional-2", "(3/5) ÷ (9/10)의 값을 기약분수로 나타내세요.", divideVisual({ numerator: 3, denominator: 5 }, { numerator: 9, denominator: 10 }), 1, "번분수를 나눗셈으로 계산하기"),
  item("additional-3", "4 ÷ (5/6)의 값을 기약분수로 나타내세요.", divideVisual({ numerator: 4, denominator: 1 }, { numerator: 5, denominator: 6 }), 1, "자연수가 들어 있는 번분수"),
  item("additional-4", "23/17을 연분수로 바꿀 때 바깥에서 안쪽으로 나타나는 수를 쉼표로 구분해 쓰세요.", convertVisual(23, 17), 2, "분수를 연분수로 바꾸기"),
  item("additional-5", "(5/12) ÷ (25/18)의 값을 기약분수로 나타내세요.", divideVisual({ numerator: 5, denominator: 12 }, { numerator: 25, denominator: 18 }), 2, "번분수를 나눗셈으로 계산하기"),
  item("additional-6", "19/43을 연분수로 바꿀 때 바깥에서 안쪽으로 나타나는 수를 쉼표로 구분해 쓰세요. 맨 앞의 0은 쓰지 않습니다.", convertVisual(19, 43), 2, "분수를 연분수로 바꾸기")
];

const tracks = [
  {
    id: "course-03-a1-complex-fraction-track-1", title: "큰 분수선을 나눗셈으로 바꿔요",
    openingPrompt: "분수 위와 아래에 다시 분수가 있을 때, 큰 분수선은 어떤 계산을 뜻할까요?",
    hint: "위 분수를 아래 분수로 나눈다고 읽으세요.",
    beats: [
      { caption: "분수 위에 2/3, 아래에 4/5가 놓인 번분수를 살펴봐요.", visual: divideVisual({ numerator: 2, denominator: 3 }, { numerator: 4, denominator: 5 }, "problem") },
      { caption: "큰 분수선은 나눗셈을 뜻하므로 (2/3) ÷ (4/5)로 바꿔요.", visual: divideVisual({ numerator: 2, denominator: 3 }, { numerator: 4, denominator: 5 }, "rewrite") },
      { caption: "나누는 분수 4/5를 5/4로 뒤집어 곱해요.", visual: divideVisual({ numerator: 2, denominator: 3 }, { numerator: 4, denominator: 5 }, "reciprocal") },
      { caption: "2 × 5와 3 × 4를 계산해 10/12를 만들고, 5/6으로 약분해 확인해요.", visual: divideVisual({ numerator: 2, denominator: 3 }, { numerator: 4, denominator: 5 }, "verify") }
    ]
  },
  {
    id: "course-03-a1-complex-fraction-track-2", title: "나눗셈을 반복해 연분수를 만들어요",
    openingPrompt: "7/16을 단위분수가 겹친 연분수로 바꾸려면 어떤 수부터 찾을까요?",
    hint: "16을 7로 나눈 몫부터 적고, 나머지를 새 나누는 수로 사용하세요.",
    beats: [
      { caption: "7/16은 1보다 작으므로 맨 앞의 0은 쓰지 않고 16 ÷ 7부터 시작해요.", visual: convertVisual(7, 16, "problem") },
      { caption: "16 = 7 × 2 + 2, 7 = 2 × 3 + 1, 2 = 1 × 2로 몫을 차례로 찾아요.", visual: convertVisual(7, 16, "divide") },
      { caption: "찾은 몫 2, 3, 2를 바깥에서 안쪽으로 놓아 1/(2 + 1/(3 + 1/2))를 만들어요.", visual: convertVisual(7, 16, "build") },
      { caption: "안쪽부터 다시 계산하면 7/16이 되어 처음 분수와 같아요.", visual: convertVisual(7, 16, "verify") }
    ]
  }
];

export const COURSE03_A1_COMPLEX_FRACTION_LESSON = Object.freeze({
  id: lessonId, bookId: "course-03-a1", courseId: "course-03", label: "A1",
  title: "번분수와 연분수를 한 층씩 계산해요", unit: "번분수와 부분분수",
  representativeConcept: "큰 분수선을 나눗셈으로 바꾸고, 유클리드 나눗셈으로 연분수의 층을 만들기",
  story: { title: "분수 계단", text: "분수 안의 계산을 한 층씩 정리해 하나의 값으로 만들어요.", mission: "큰 분수선, 뒤집어 곱하기, 몫의 순서를 차례로 확인하세요." },
  explanation: { headline: "번분수 계산과 연분수 변환", steps: ["큰 분수선을 나눗셈으로 바꾸고 아래 분수를 뒤집어 곱합니다.", "분수를 연분수로 바꿀 때는 몫과 나머지를 반복해 찾습니다.", "완성한 식을 안쪽부터 계산해 원래 값과 같은지 확인합니다."] },
  learnerStage: "필즈 더 클래식 3과정 A1; 연령 미확정", status: "pilot",
  source: { origin: "textbook-derived", note: "번분수와 연분수의 계산 원리를 바탕으로 새 수와 문장으로 구성한 개념 학습입니다." },
  experience: { kind: "course-concept", tracks, openingPrompt: tracks[0].openingPrompt, hint: tracks[0].hint, beats: tracks[0].beats },
  dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null },
  original: { title: "연습", prompt: "큰 분수선과 연분수의 층을 차례로 계산해 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension, similarPractice
});

const fractionMarkup = ({ numerator, denominator }) => `<span class="course03-fraction"><span>${esc(numerator)}</span><span>${esc(denominator)}</span></span>`;
const tailMarkup = (terms, index = 0) => index === terms.length - 1
  ? `<b>${esc(terms[index])}</b>`
  : `<span class="course03-continued-whole">${esc(terms[index])} + <span class="course03-fraction"><span>1</span><span>${tailMarkup(terms, index + 1)}</span></span></span>`;
const continuedMarkup = (terms) => {
  const visible = terms[0] === 0 ? terms.slice(1) : terms;
  const nested = tailMarkup(visible);
  return terms[0] === 0 ? `<span class="course03-fraction"><span>1</span><span>${nested}</span></span>` : nested;
};

const divisionSteps = (numerator, denominator) => {
  const rows = [];
  let a = denominator; let b = numerator;
  while (b) {
    const quotient = Math.floor(a / b); const remainder = a % b;
    rows.push(`<span>${esc(a)} = ${esc(b)} × ${esc(quotient)} + ${esc(remainder)}</span>`);
    [a, b] = [b, remainder];
  }
  return rows.join("");
};

export function course03ComplexFractionConceptMarkup(visual) {
  if (!visual || visual.kind !== COMPLEX_FRACTION_KIND) return "";
  const phase = visual.phase || "problem";
  if (visual.task === "divide") {
    const result = divideFractions(visual.top, visual.bottom);
    const compound = `<span class="course03-compound-fraction">${fractionMarkup(visual.top)}${fractionMarkup(visual.bottom)}</span>`;
    const body = phase === "problem" ? compound
      : phase === "rewrite" ? `${fractionMarkup(visual.top)}<b>÷</b>${fractionMarkup(visual.bottom)}`
        : phase === "reciprocal" ? `${fractionMarkup(visual.top)}<b>×</b>${fractionMarkup({ numerator: visual.bottom.denominator, denominator: visual.bottom.numerator })}`
          : `${fractionMarkup({ numerator: visual.top.numerator * visual.bottom.denominator, denominator: visual.top.denominator * visual.bottom.numerator })}<b>=</b>${fractionMarkup(result)}`;
    return `<div class="course03-complex-visual" data-task="divide" data-phase="${esc(phase)}"><div class="course03-complex-expression">${body}</div><p>${phase === "verify" ? "분자끼리, 분모끼리 곱한 뒤 기약분수인지 확인해요." : "큰 분수선은 위의 수를 아래의 수로 나누는 뜻이에요."}</p></div>`;
  }
  if (visual.task === "convert") {
    const value = reduceFraction(visual.numerator, visual.denominator);
    const terms = continuedFractionTerms(value.numerator, value.denominator);
    const body = phase === "divide"
      ? `<div class="course03-euclid-steps">${divisionSteps(value.numerator, value.denominator)}</div>`
      : phase === "build" || phase === "verify"
        ? `${fractionMarkup(value)}<b>=</b>${continuedMarkup(terms)}`
        : fractionMarkup(value);
    const note = phase === "verify"
      ? `몫 ${esc(formatContinuedTerms(value.numerator, value.denominator))}을 안쪽부터 계산하면 처음 분수로 돌아와요.`
      : "나눈 몫을 바깥에서 안쪽 순서로 놓아요.";
    return `<div class="course03-complex-visual" data-task="convert" data-phase="${esc(phase)}"><div class="course03-complex-expression">${body}</div><p>${note}</p></div>`;
  }
  return "";
}
