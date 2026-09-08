import { estimateProblems, rightAngleProblems, rightAngleSolutions, basicPrompt, basicHint, basicSolution, gradeBasic, readNumber } from "./basic.js?v=angle-1";
import { polygonProblems, polygonPrompt, polygonHint, polygonSolution, polygonAnswer } from "./polygon.js?v=angle-1";
import { parallelProblems, parallelPrompt, parallelHint, parallelSolution, parallelAnswer } from "./parallel.js?v=angle-1";

export const domains = [
  { id: "estimate", level: 1, names: { ko: "각도 어림하기", en: "Estimate angles", zh: "估测角度", ja: "角度の見積もり" } },
  { id: "right-angle", level: 2, names: { ko: "점판에서 직각 만들기", en: "Make right angles", zh: "点阵画直角", ja: "点の板で直角作り" } },
  { id: "polygon", level: 3, names: { ko: "다각형의 각도", en: "Polygon angles", zh: "多边形的角", ja: "多角形の角度" } },
  { id: "parallel", level: 4, names: { ko: "평행선과 각", en: "Parallel lines and angles", zh: "平行线与角", ja: "平行線と角" } }
];
const pools = { estimate: estimateProblems, "right-angle": rightAngleProblems, polygon: polygonProblems, parallel: parallelProblems };
export function problemsFor(id) { return pools[id] || []; }
export function promptFor(p, lang = "ko") { return p.domain === "polygon" ? polygonPrompt(p, lang) : p.domain === "parallel" ? parallelPrompt(p, lang) : basicPrompt(p, lang); }
export function hintFor(p, lang = "ko") { return p.domain === "polygon" ? polygonHint(p, lang) : p.domain === "parallel" ? parallelHint(p, lang) : basicHint(p, lang); }
export function solutionFor(p, lang = "ko", response) { return p.domain === "polygon" ? polygonSolution(p, lang) : p.domain === "parallel" ? parallelSolution(p, lang) : basicSolution(p, lang, response); }
export function answerFor(p) { return p.domain === "estimate" ? p.angle : p.domain === "right-angle" ? rightAngleSolutions(p) : p.domain === "polygon" ? polygonAnswer(p) : parallelAnswer(p); }
export function grade(p, response) {
  if (p.domain === "estimate" || p.domain === "right-angle") return gradeBasic(p, response);
  const value = readNumber(response);
  if (value === null || value < 0 || !Number.isInteger(value)) return { valid: false, kind: "invalid" };
  return { valid: true, correct: value === answerFor(p), kind: value === answerFor(p) ? "correct" : "retry", value };
}
