import { repeatingPatternModel, equalQuotientRemainderModel } from "./course-learning-models.js";
import { book02Markup } from "./book02-renderers.js?v=20260913a";
import { course02PolygonConceptMarkup } from "./golden-bell-course02-polygon-lesson.js";
import { course02StoneGrowthConceptMarkup } from "./golden-bell-course02-stone-growth-lesson.js";
import { counterfeitConceptMarkup } from "./golden-bell-course02-counterfeit-lesson.js";
import { course02MultiPatternConceptMarkup } from "./golden-bell-course02-multi-pattern-lesson.js";
import { course02WindmillConceptMarkup } from "./golden-bell-course02-windmill-pattern-lesson.js";
import { course02CycleTotalConceptMarkup } from "./golden-bell-course02-cycle-total-lesson.js";
import { course03RemainderConceptMarkup } from "./golden-bell-course03-remainder-lesson.js";
import { course03LcmRemainderConceptMarkup } from "./golden-bell-course03-lcm-remainder-lesson.js";
import { course03ComplexFractionConceptMarkup } from "./golden-bell-course03-complex-fraction-lesson.js";
import { course23A2ConceptMarkup } from "./golden-bell-course23-a2-lessons.js";
import { course23A3ConceptMarkup } from "./golden-bell-course23-a3-lessons.js";
import { course02A4ConceptMarkup } from "./golden-bell-course02-a4-lessons.js";
import { course02G4ConceptMarkup } from "./golden-bell-course02-g4-lessons.js?v=20260918a";

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const names = { triangle: "세모", square: "네모", circle: "동그라미", star: "별" };

function patternMarkup(visual) {
  const model = repeatingPatternModel(visual);
  const phase = visual.phase || "problem";
  const solved = phase === "verify";
  const group = (label, { highlighted = false, values = model.cycle, partial = false } = {}) => `<div class="course-cycle-group ${phase === "group" ? "grouped" : ""} ${partial ? "partial" : ""} ${highlighted ? `slot-${model.slot}` : ""}" data-cycle-part="${partial ? "partial" : "full"}"><strong>${esc(label)}</strong>${book02Markup({ kind: "book2", subtype: "sequence", values })}</div>`;
  const initial = ["problem", "group"].includes(phase);
  const repeatedPreview = group("첫째 마디") + group("둘째 마디") + group("다음 마디의 앞 2개", { values: model.cycle.slice(0, 2), partial: true }) + '<b class="course-ellipsis" aria-label="같은 순서로 계속 반복">…</b>';
  return `<div class="course-pattern" data-course-phase="${phase}">
    <div class="course-cycle-groups">${initial ? repeatedPreview : group("한 마디 안의 자리", { highlighted: solved })}</div>
    ${phase === "divide" || solved ? `<p class="course-equation">${model.position} ÷ ${model.size} = ${model.quotient}<span>나머지 ${model.remainder}</span></p>` : ""}
    <p class="course-target">${model.position}번째 ${solved ? `→ ${esc(names[model.answer] || model.answer)} · 마디의 ${model.slot}번째` : "모양은?"}</p>
  </div>`;
}

function divisionMarkup(visual) {
  const model = equalQuotientRemainderModel(visual);
  const phase = visual.phase || "problem";
  if (model.divisor > 12) throw new RangeError("The course concept diagram supports divisors up to 12");
  const range = `<p class="course-number-range">${model.minimum} 이상 ${model.maximum} 이하의 자연수</p>`;
  if (phase === "problem") return `<div class="course-division">${range}<p class="course-equation">어떤 수 ÷ ${model.divisor}</p><div class="course-equal-slots"><span>몫<br><b>같은 수</b></span><strong>=</strong><span>나머지<br><b>같은 수</b></span></div></div>`;
  if (phase === "group") {
    const sample = Math.min(2, model.divisor - 1);
    const dots = Array.from({ length: sample }, () => '<i class="course-unit-dot" aria-hidden="true"></i>').join("");
    return `<div class="course-division"><p>몫과 나머지를 ${sample}로 놓아 보면</p><div class="course-division-groups"><div class="course-equal-groups">${Array.from({ length: model.divisor }, () => `<span class="course-unit-group" aria-label="${sample}개 묶음">${dots}</span>`).join("")}</div><b>+</b><span class="course-unit-group remainder" aria-label="남은 ${sample}개">${dots}</span></div><p class="course-equation">${model.divisor} × ${sample} + ${sample} = ${model.factor * sample}</p><p>${model.divisor}묶음에 남은 ${sample}개를 더해요.</p></div>`;
  }
  const rows = Array.from({ length: model.divisor - 1 }, (_, index) => {
    const same = index + 1;
    const number = model.factor * same;
    const inside = number >= model.minimum && number <= model.maximum;
    const calculation = phase === "verify" ? `${number} ÷ ${model.divisor}<br>몫 ${same} · 나머지 ${same}` : `${model.divisor} × ${same} + ${same} = ${number}`;
    return `<tr class="${phase === "verify" && !inside ? "outside" : ""}"><td>${same}</td><td>${calculation}</td>${phase === "verify" ? `<td>${inside ? "조건에 맞음" : "범위 밖"}</td>` : ""}</tr>`;
  }).join("");
  return `<div class="course-division" data-course-phase="${phase}">${range}<p>나머지는 ${model.divisor}보다 작아요. 0은 제외해요.</p><table class="course-candidate-table"><caption>몫과 나머지에 같은 수를 넣어요</caption><thead><tr><th>같은 수</th><th>${phase === "verify" ? "나눗셈 검산" : "만든 자연수"}</th>${phase === "verify" ? "<th>범위 확인</th>" : ""}</tr></thead><tbody>${rows}</tbody></table>${phase === "verify" ? `<p class="course-target">조건에 맞는 수는 모두 ${model.count}개</p>` : ""}</div>`;
}

export function courseConceptMarkup(visual) {
  if (visual?.kind === "course-pattern") return patternMarkup(visual);
  if (visual?.kind === "course-division") return divisionMarkup(visual);
  const course02 = course02PolygonConceptMarkup(visual);
  if (course02) return course02;
  const course02Growth = course02StoneGrowthConceptMarkup(visual);
  if (course02Growth) return course02Growth;
  const course02Counterfeit = counterfeitConceptMarkup(visual);
  if (course02Counterfeit) return course02Counterfeit;
  const course02MultiPattern = course02MultiPatternConceptMarkup(visual);
  if (course02MultiPattern) return course02MultiPattern;
  const course02Windmill = course02WindmillConceptMarkup(visual);
  if (course02Windmill) return course02Windmill;
  const course02CycleTotal = course02CycleTotalConceptMarkup(visual);
  if (course02CycleTotal) return course02CycleTotal;
  const course03 = course03RemainderConceptMarkup(visual);
  if (course03) return course03;
  const course03Lcm = course03LcmRemainderConceptMarkup(visual);
  if (course03Lcm) return course03Lcm;
  const course03Fraction = course03ComplexFractionConceptMarkup(visual);
  if (course03Fraction) return course03Fraction;
  const course23A2 = course23A2ConceptMarkup(visual);
  if (course23A2) return course23A2;
  const course23A3 = course23A3ConceptMarkup(visual);
  if (course23A3) return course23A3;
  const course02A4 = course02A4ConceptMarkup(visual);
  if (course02A4) return course02A4;
  const course02G4 = course02G4ConceptMarkup(visual);
  if (course02G4) return course02G4;
  return "";
}

export function courseConceptPrintPages(lesson, book, student) {
  if (/(?:-a2|-a3|-a4|-g4)$/.test(book.id)) {
    const trackGroups = [];
    for (let index = 0; index < lesson.experience.tracks.length; index += 2) {
      trackGroups.push(lesson.experience.tracks.slice(index, index + 2));
    }
    return trackGroups.map((tracks, pageIndex) => `<article class="gold-print-page course-concept-print-page course-a2-concept-sheet" data-print-book="${esc(book.id)}" data-print-lesson="${esc(lesson.id)}" data-print-part="concept-${pageIndex + 1}" data-watermark="${esc(student)} · GFIELD">
      <header class="gold-print-head"><div><span>${esc(book.courseId === "course-02" ? "2과정" : "3과정")} · 개념 학습</span><h1>${esc(book.label)} · ${esc(lesson.title)}</h1></div><dl><div><dt>이름</dt><dd>${esc(student)}</dd></div></dl></header>
      <div class="course-a2-print-tracks">${tracks.map((track, trackIndex) => `<section class="course-a2-print-track"><h2>${pageIndex * 2 + trackIndex + 1}. ${esc(track.title)}</h2><p class="course-print-problem">${esc(track.openingPrompt)}</p><div class="course-print-frames">${track.beats.map((beat, beatIndex) => `<section class="course-print-frame"><h3>${beatIndex + 1}단계</h3>${courseConceptMarkup(beat.visual)}<p>${esc(beat.caption)}</p></section>`).join("")}</div></section>`).join("")}</div>
      <footer class="gold-print-footer">${esc(book.label)} · ${esc(lesson.unit)}</footer></article>`).join("");
  }
  return lesson.experience.tracks.flatMap((track, trackIndex) => {
    const pages = ["course-02-a1-multi-pattern-activity", "course-02-a1-windmill-pattern"].includes(lesson.id)
      ? [track.beats.slice(0, 2), track.beats.slice(2, 4)]
      : [track.beats];
    return pages.map((beats, pageIndex) => {
      const firstStep = pageIndex * 2;
      const suffix = pages.length > 1 ? ` · ${pageIndex + 1}/${pages.length}` : "";
      return `<article class="gold-print-page course-concept-print-page" data-print-book="${esc(book.id)}" data-print-lesson="${esc(lesson.id)}" data-print-part="concept-${trackIndex + 1}-${pageIndex + 1}" data-watermark="${esc(student)} · GFIELD">
        <header class="gold-print-head"><div><span>${esc(book.courseId === "course-02" ? "2과정" : "3과정")} · 개념 학습</span><h1>${esc(book.label)} · ${esc(track.title)}${suffix}</h1></div><dl><div><dt>이름</dt><dd>${esc(student)}</dd></div></dl></header>
        <p class="course-print-problem">${esc(track.openingPrompt)}</p>
        <div class="course-print-frames">${beats.map((beat, i) => `<section class="course-print-frame"><h2>${firstStep + i + 1}단계</h2>${courseConceptMarkup(beat.visual)}<p>${esc(beat.caption)}</p></section>`).join("")}</div>
        <footer class="gold-print-footer">${esc(book.label)} · ${esc(lesson.unit)}</footer></article>`;
    });
  }).join("");
}

export function courseAnswerPrintPages(lesson, book, student, { quick = false } = {}) {
  const courseLabels = { "course-01": "1과정", "course-02": "2과정", "course-03": "3과정" };
  if (!Object.hasOwn(courseLabels, book.courseId)) throw new Error("A supported courseId is required for answer printing");

  const hasText = (value) => typeof value === "string" && value.trim() !== "";
  const validAnswer = (value) => Array.isArray(value)
    ? value.length > 0 && value.every((entry) => !Array.isArray(entry) && validAnswer(entry))
    : typeof value === "number" ? Number.isFinite(value) : hasText(value);
  const answerText = (value) => Array.isArray(value) ? value.map(String).join(" / ") : String(value);
  const printableText = (value) => esc(value).replace(/\r?\n/g, "<br>");
  const partLabel = (part, index) => hasText(part?.label) ? part.label.trim() : `(${index + 1})`;
  const combineParts = (item, field) => {
    if (!Array.isArray(item.parts) || item.parts.length === 0) return null;
    const complete = field === "answer"
      ? item.parts.every((part) => validAnswer(part?.answer))
      : item.parts.every((part) => hasText(part?.solution));
    if (!complete) return null;
    return item.parts.map((part, index) => {
      const value = field === "answer" ? answerText(part.answer) : part.solution.trim();
      const unit = field === "answer" && hasText(part.unit) ? part.unit.trim() : "";
      return `${partLabel(part, index)} ${value}${unit}`;
    }).join("\n");
  };
  const protectedContent = (item) => {
    const answer = validAnswer(item?.answer) ? answerText(item.answer) : combineParts(item || {}, "answer");
    const solution = hasText(item?.solution) ? item.solution.trim()
      : hasText(item?.explanation) && item.explanation.trim() !== answer ? item.explanation.trim()
        : combineParts(item || {}, "solution");
    if (!answer || !quick && !solution) throw new Error(`Protected worked answers are required for printing (${item?.id || "unknown item"})`);
    const verificationCandidates = [item.verification, item.check, item.explanation]
      .filter((value) => hasText(value) && value.trim() !== solution);
    const partVerification = Array.isArray(item.parts) ? item.parts.map((part, index) => {
      const value = [part?.verification, part?.check, part?.explanation]
        .find((candidate) => hasText(candidate) && candidate.trim() !== part?.solution?.trim());
      return value ? `${partLabel(part, index)} ${value.trim()}` : "";
    }).filter(Boolean).join("\n") : "";
    return { answer, solution, verification: verificationCandidates[0]?.trim() || partVerification };
  };
  const conditionText = (item) => [item?.prompt, ...(Array.isArray(item?.conditions) ? item.conditions : [])]
    .filter(hasText).map((value) => value.trim()).join("\n");
  const verifyVisual = (item) => {
    if (!item?.visual || typeof item.visual !== "object" || Array.isArray(item.visual)) return "";
    const markup = courseConceptMarkup({ ...item.visual, phase: "verify" });
    return hasText(markup) ? `<div class="course-solution-visual">${markup}</div>` : "";
  };

  const items = [
    ...(lesson.original?.items || []).map((item, index) => ({ item, label: `연습 ${index + 1}` })),
    ...[lesson.extension, ...(lesson.similarPractice || [])].filter(Boolean)
      .map((item, index) => ({ item, label: `추가 학습 ${index + 1}` }))
  ];
  return items.map(({ item, label }, index) => {
    const content = protectedContent(item);
    const number = index + 1;
    const body = quick
      ? `<h2><span>${number}</span>답 ${printableText(content.answer)}</h2>`
      : `<h2><span>${number}</span>${esc(label)}</h2>${conditionText(item) ? `<p class="course-answer-condition"><strong>조건</strong><br>${printableText(conditionText(item))}</p>` : ""}<p class="course-answer-working"><strong>실제 수를 사용한 풀이</strong><br>${printableText(content.solution)}</p><p class="course-answer-result"><strong>답과 확인</strong><br>답 ${printableText(content.answer)}${content.verification ? `<br>${printableText(content.verification)}` : ""}</p>${verifyVisual(item)}`;
    return `<article class="gold-print-page course-answer-page" data-print-book="${esc(book.id)}" data-print-lesson="${esc(lesson.id)}" data-print-part="answers-${number}" data-watermark="${esc(student)} · GFIELD"><header class="gold-print-head"><div><span>${esc(courseLabels[book.courseId])} · ${quick ? "빠른 정답" : "답안과 풀이"}</span><h1>${esc(book.label)} · ${esc(lesson.title)}</h1></div></header><section class="gold-print-block"><section class="gold-print-source-item course-answer-item" data-answer-item="${esc(item.id || `answer-${number}`)}">${body}</section></section><footer class="gold-print-footer">${esc(book.label)} · ${esc(lesson.unit)}</footer></article>`;
  }).join("");
}
