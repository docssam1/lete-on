// 수식 하나로(원장 2026-10-27 「공통화 하자」): 화면·인쇄의 분수·거듭제곱·제곱근은 모두 여기서 만든다 — 브라우저에 들어 있는 MathML.
// 외부 수식 라이브러리를 쓰지 않는다(파일·CDN 없이, 인쇄도 브라우저가 그대로). 분수는 빗금(3/5)으로 쓰지 않고 위아래로 쌓는다.
// 그림(SVG) 안의 수는 SVG 글자로 그대로 둔다(SVG 안에는 MathML을 넣지 않는다). 모양은 math-markup.css.
//
//   frac(3, 5)                 5분의 3
//   frac(box("가"), 5)         빈칸 상자(안에 작은 글자) — box() 만 쓰면 빈 상자, "□" 도 빈 상자
//   mixed(2, 1, 3)             대분수 2와 3분의 1
//   frac(1, part(1, 2))        분자·분모 안에 분수(연분수) — 안쪽은 part()
//   pow(2, 3) · sqrt(16) · root(27, 3) · sub("a", 1)
//   expr(3, "×", part(1, 2), "=", "□")   여러 조각을 한 줄 수식으로(기호는 연산자로)
//   mathText("3/5 + 2^3 = n²")  글 속 빗금 분수·^ 거듭제곱·²³ 글자를 수식으로(날짜처럼 빗금이 이어지면 그대로)
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const MATH = Symbol("math");
const piece = (markup, said) => ({ [MATH]: markup, said });
const OPERATORS = new Set(["+", "-", "−", "×", "÷", "=", "<", ">", "≤", "≥", "≠", "(", ")", "…", "·", ":", ","]);

// 칸 하나: 숫자는 <mn>, 글자 하나는 <mi>, 기호는 <mo>, 빈칸(□·null)은 상자, 그 밖은 <mtext>
function token(value) {
  if (value && value[MATH]) return value[MATH];
  if (value === null || value === undefined) return box()[MATH];
  const text = String(value);
  if (text.startsWith("<math")) return `<mrow>${text.replace(/^<math[^>]*>|<\/math>$/g, "")}</mrow>`;   // 이미 만든 수식(frac·pow…)을 한 줄 수식 안에
  if (text === "□" || text === "?") return box(text === "?" ? "?" : "")[MATH];
  if (/^-?\d+(\.\d+)?$/.test(text)) return `<mn>${esc(text)}</mn>`;
  if (/^[A-Za-z]$/.test(text)) return `<mi>${esc(text)}</mi>`;
  if (OPERATORS.has(text)) return `<mo>${esc(text === "-" ? "−" : text)}</mo>`;
  return `<mtext>${esc(text)}</mtext>`;
}
const said = (value) => (value && value[MATH] ? value.said : value === null || value === undefined || value === "□" ? "빈칸"
  : String(value).startsWith("<math") ? (String(value).match(/aria-label="([^"]*)"/) || [, "수식"])[1] : String(value));
const wrap = (inner, label) => `<math class="mm" aria-label="${esc(label)}">${inner}</math>`;

// ── 조각(다른 수식 안에 넣을 때) ──
export const box = (label = "") => piece(`<mtext class="mm-box">${esc(label) || "&#x2003;"}</mtext>`, label ? `빈칸 ${label}` : "빈칸");
export const part = (numerator, denominator) => piece(`<mfrac>${token(numerator)}${token(denominator)}</mfrac>`, `${said(denominator)}분의 ${said(numerator)}`);
export const powPart = (base, exponent) => piece(`<msup>${token(base)}${token(exponent)}</msup>`, `${said(base)}의 ${said(exponent)}제곱`);
export const sqrtPart = (value) => piece(`<msqrt>${token(value)}</msqrt>`, `루트 ${said(value)}`);
export const rootPart = (value, index) => piece(`<mroot>${token(value)}${token(index)}</mroot>`, `${said(index)}제곱근 ${said(value)}`);
export const rowPart = (...items) => piece(`<mrow>${items.map(token).join("")}</mrow>`, items.map(said).join(" "));
export const subPart = (base, index) => piece(`<msub>${token(base)}${token(index)}</msub>`, `${said(base)} ${said(index)}`);

// ── 완성된 수식(글 속에 바로 넣는다) ──
const whole = (p) => wrap(p[MATH], p.said);
export const frac = (numerator, denominator) => whole(part(numerator, denominator));
export const mixed = (wholeNumber, numerator, denominator) => wrap(`${token(wholeNumber)}${part(numerator, denominator)[MATH]}`, `${said(wholeNumber)}와 ${said(denominator)}분의 ${said(numerator)}`);
export const pow = (base, exponent) => whole(powPart(base, exponent));
export const sqrt = (value) => whole(sqrtPart(value));
export const root = (value, index) => whole(rootPart(value, index));
export const sub = (base, index) => whole(subPart(base, index));
export const expr = (...items) => wrap(`<mrow>${items.map(token).join("")}</mrow>`, items.map(said).join(" "));

// 글 속 수식 → MathML(이미 HTML인 글에 쓴다 — 태그 안의 글자는 건드리지 않는다)
// 분자·분모 글: 수 하나는 그대로, 괄호로 묶은 식((1×2))은 괄호를 벗겨 한 줄 수식으로
const inner = (text) => {
  const body = String(text).replace(/^\((.*)\)$/, "$1");
  return /^\d+$/.test(body) ? body : rowPart(...body.split(/([×÷+\-−])/).map((t) => t.trim()).filter(Boolean));
};
const SUPERSCRIPT = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9" };
export function mathText(html) {
  return String(html ?? "").split(/(<[^>]*>)/).map((chunk) => chunk.startsWith("<") ? chunk : chunk
    .replace(/(^|[^\d/)])(\((?:[^()]+)\)|\d+)\/(\((?:[^()]+)\)|\d+)(?![\d/(])/g, (_, before, n, d) => `${before}${frac(inner(n), inner(d))}`)
    .replace(/(\d+|[A-Za-z])\^(\d+)/g, (_, base, exponent) => pow(base, exponent))
    .replace(/(\d+|[A-Za-z])([⁰¹²³⁴⁵⁶⁷⁸⁹]+)/g, (_, base, sup) => pow(base, [...sup].map((c) => SUPERSCRIPT[c]).join("")))).join("");
}
// 예전 이름(분수만 바꾸던 것) — 같은 일을 한다
export const fractionText = mathText;
