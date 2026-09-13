import { COURSE02_A1_POLYGON_LESSON } from "./golden-bell-course02-polygon-lesson.js";
import { COURSE02_A1_STONE_GROWTH_LESSON } from "./golden-bell-course02-stone-growth-lesson.js";
import { COURSE02_A1_COUNTERFEIT_LESSON } from "./golden-bell-course02-counterfeit-lesson.js";
import { COURSE02_A1_MULTI_PATTERN_LESSON } from "./golden-bell-course02-multi-pattern-lesson.js";
import { COURSE02_A1_WINDMILL_PATTERN_LESSON } from "./golden-bell-course02-windmill-pattern-lesson.js";
import { COURSE02_A1_CYCLE_TOTAL_LESSON } from "./golden-bell-course02-cycle-total-lesson.js";
import { COURSE03_A1_REMAINDER_LESSON } from "./golden-bell-course03-remainder-lesson.js";
import { COURSE03_A1_LCM_REMAINDER_LESSON } from "./golden-bell-course03-lcm-remainder-lesson.js";
import { COURSE03_A1_COMPLEX_FRACTION_LESSON } from "./golden-bell-course03-complex-fraction-lesson.js";
import { COURSE02_A2_LESSONS, COURSE03_A2_LESSONS } from "./golden-bell-course23-a2-lessons.js";
import { COURSE02_A3_LESSONS, COURSE03_A3_LESSONS } from "./golden-bell-course23-a3-lessons.js";
import { COURSE02_A4_LESSONS } from "./golden-bell-course02-a4-lessons.js";
import { COURSE02_G4_LESSONS } from "./golden-bell-course02-g4-lessons.js";

const patternCycle = ["triangle", "square", "circle", "square"];

const patternVisual = (position, phase) => ({ kind: "course-pattern", cycle: patternCycle, position, phase });
const divisionVisual = (divisor, minimum, maximum, phase) => ({ kind: "course-division", divisor, minimum, maximum, phase });

const patternItem = (lessonId, position, number, group) => ({
  id: `${lessonId}:practice:${number}`,
  prompt: `${position}번째 모양을 찾아 보세요. 세모, 네모, 동그라미, 네모가 이 순서로 반복됩니다.`,
  hint: "반복되는 네 모양을 한 묶음으로 보고, 목표 자리와 묶음의 마지막 자리를 비교하세요.",
  visual: patternVisual(position, "problem"), answerMode: "input", inputMode: "text",
  typeLabel: "반복 규칙의 자리", sourceNo: String(number), printGroup: group,
  answerRef: `/course23/course-02-a1/${lessonId}:practice:${number}`
});

const divisionItem = (lessonId, divisor, minimum, maximum, number, group) => ({
  id: `${lessonId}:practice:${number}`,
  prompt: `${minimum} 이상 ${maximum} 이하의 자연수 중 ${divisor}로 나눌 때 몫과 나머지가 같은 수가 몇 개인지 구해 보세요.`,
  hint: "몫과 나머지를 같은 수로 놓고, 나머지가 나누는 수보다 작은지 확인하세요.",
  visual: divisionVisual(divisor, minimum, maximum, "problem"), answerMode: "input", inputMode: "numeric",
  typeLabel: "몫과 나머지가 같은 수", sourceNo: String(number), printGroup: group,
  answerRef: `/course23/course-03-a1/${lessonId}:practice:${number}`
});

const makeExperience = (firstTrack, secondTrack) => ({
  kind: "course-concept", tracks: [firstTrack, secondTrack],
  openingPrompt: firstTrack.openingPrompt, hint: firstTrack.hint, beats: firstTrack.beats
});

const c2LessonId = "course-02-a1-cycle-position";
const c2Practice = [9, 12, 15, 20].map((position, i) => patternItem(c2LessonId, position, i + 1, i < 2 ? 1 : 2));
const c2Extension = patternItem(c2LessonId, 25, 5, 1);
const c2Similar = [28, 35, 40, 46, 52].map((position, i) => ({ ...patternItem(c2LessonId, position, i + 6, i % 2 + 1), id: `${c2LessonId}:similar:${i + 1}`, answerRef: `/course23/course-02-a1/${c2LessonId}:similar:${i + 1}` }));
const c2Tracks = [
  { id: "course-02-a1-track-1", title: "반복 묶음 찾기", openingPrompt: "세모, 네모, 동그라미, 네모가 이 순서로 반복될 때 30번째 모양은 무엇일까요?", hint: "4개씩 묶은 뒤 30번째가 묶음의 어느 자리인지 살펴보세요.", beats: [
    { caption: "처음 세모부터 1번째로 세어요. 같은 네 모양이 같은 순서로 계속 반복돼요.", visual: patternVisual(30, "problem") }, { caption: "세모, 네모, 동그라미, 네모의 4개가 한 마디예요. 모양은 세 종류지만 한 마디에 놓인 모양은 4개예요.", visual: patternVisual(30, "group") }, { caption: "30 ÷ 4 = 7, 나머지 2예요. 7마디인 28개를 지나 다음 마디의 두 번째 모양을 봐요.", visual: patternVisual(30, "divide") }, { caption: "한 마디의 두 번째는 네모예요. 여덟째 마디는 29번째부터 시작하므로 29 + 2 - 1 = 30으로 확인해요.", visual: patternVisual(30, "verify") }
  ] },
  { id: "course-02-a1-track-2", title: "나머지가 0인 자리 확인하기", openingPrompt: "세모, 네모, 동그라미, 네모가 이 순서로 반복될 때 32번째 모양은 무엇일까요?", hint: "32를 4로 나누었을 때 나머지가 0이면 한 마디의 마지막 자리를 사용하세요.", beats: [
    { caption: "처음 세모부터 1번째로 세어서 32번째 모양을 찾아요.", visual: patternVisual(32, "problem") }, { caption: "같은 네 모양을 한 마디로 묶어요. 한 마디의 마지막은 네모예요.", visual: patternVisual(32, "group") }, { caption: "32 ÷ 4 = 8, 나머지 0예요. 8마디가 딱 끝나고 남는 모양이 없어요.", visual: patternVisual(32, "divide") }, { caption: "0번째 모양을 찾는 것이 아니에요. 여덟째 마디의 마지막인 네 번째 네모를 봐요. 4 × 8 = 32로 확인해요.", visual: patternVisual(32, "verify") }
  ] }
];

const c3LessonId = "course-03-a1-equal-quotient-remainder";
const c3Practice = [[3, 1, 999], [4, 1, 999], [5, 1, 999], [8, 1, 999]].map(([d, min, max], i) => divisionItem(c3LessonId, d, min, max, i + 1, i < 2 ? 1 : 2));
const c3Extension = divisionItem(c3LessonId, 9, 1, 999, 5, 1);
const c3Similar = [[10, 1, 999], [6, 15, 35], [8, 30, 60], [9, 20, 40], [5, 30, 40]].map(([d, min, max], i) => ({ ...divisionItem(c3LessonId, d, min, max, i + 6, i % 2 + 1), id: `${c3LessonId}:similar:${i + 1}`, answerRef: `/course23/course-03-a1/${c3LessonId}:similar:${i + 1}` }));
const c3Tracks = [
  { id: "course-03-a1-track-1", title: "같은 수로 놓기", openingPrompt: "1 이상 999 이하의 자연수를 6으로 나눌 때 몫과 나머지가 같은 수는 모두 몇 개일까요?", hint: "나머지는 6보다 작고, 1 이상 999 이하라는 전체 범위를 함께 살펴보세요.", beats: [
    { caption: "몫과 나머지가 같은 자연수를 찾아요. 나머지는 나누는 수 6보다 작아야 해요.", visual: divisionVisual(6, 1, 999, "problem") }, { caption: "몫과 나머지를 2로 놓으면 6 × 2 + 2 = 14예요. 같은 수가 달라져도 6 × 같은 수 + 같은 수로 만들어요.", visual: divisionVisual(6, 1, 999, "group") }, { caption: "같은 수는 1부터 5까지예요. 0을 넣으면 자연수가 아니고 6부터는 나머지가 될 수 없어요. 만든 수는 7, 14, 21, 28, 35예요.", visual: divisionVisual(6, 1, 999, "range") }, { caption: "다섯 수가 모두 1 이상 999 이하예요. 각각 6으로 나누어 몫과 나머지가 같은지 확인하면 모두 5개예요.", visual: divisionVisual(6, 1, 999, "verify") }
  ] },
  { id: "course-03-a1-track-2", title: "범위에서 골라 검산하기", openingPrompt: "20 이상 30 이하의 자연수를 6으로 나눌 때 몫과 나머지가 같은 수는 모두 몇 개일까요?", hint: "같은 몫과 나머지로 만든 후보 중 20 이상 30 이하에 들어가는 것만 남기세요.", beats: [
    { caption: "이번에는 20 이상 30 이하라는 조건도 있어요. 몫과 나머지가 같다는 조건만으로 끝내면 안 돼요.", visual: divisionVisual(6, 20, 30, "problem") }, { caption: "같은 수를 2로 놓으면 6 × 2 + 2 = 14예요. 하지만 14는 범위 밖이에요. 다른 같은 수도 살펴봐요.", visual: divisionVisual(6, 20, 30, "group") }, { caption: "같은 수 1부터 5까지 넣으면 7, 14, 21, 28, 35가 나와요. 이제 20 이상 30 이하인 것만 남겨요.", visual: divisionVisual(6, 20, 30, "range") }, { caption: "21 ÷ 6은 몫 3, 나머지 3이고 28 ÷ 6은 몫 4, 나머지 4예요. 둘 다 범위 안이므로 2개예요.", visual: divisionVisual(6, 20, 30, "verify") }
  ] }
];

const commonSource = { origin: "textbook-derived", note: "본 교재의 첫 활동을 바탕으로 만든 개념 학습입니다." };
const buildBook = (bookId, courseId, title, lesson, practice, extension, similarPractice) => ({
  id: bookId, bookId, courseId, label: "A1", title, status: "pilot", source: commonSource,
  dailyPractice: { problemCount: 6, original: 4, extension: 6, estimatedMinutes: null }, lessons: [{ ...lesson,
    learnerStage: `필즈 더 클래식 ${courseId === "course-02" ? "2과정" : "3과정"} A1; 연령 미확정`,
    sourceTypeIds: [], original: { title: "연습", prompt: "개념을 활용해 새 문제를 풀어 보세요.", mode: "paged", separateConceptPrint: true, visual: practice[0].visual, items: practice },
    extension: { ...extension, id: `${lesson.id}:extension`, prompt: extension.prompt, story: "", answerRef: `/course23/${bookId}/${lesson.id}:extension` }, similarPractice
  }]
});

const course02A1 = buildBook("course-02-a1", "course-02", "마디수열과 규칙 찾기", { id: c2LessonId, unit: "마디수열과 규칙 찾기", title: "한 마디로 묶어 멀리 있는 모양을 찾아요", representativeConcept: "반복되는 묶음의 길이와 나머지로 먼 자리의 모양을 찾기", story: { title: "반복 정원", text: "정원의 네 모양 길이 이어져 있어요. 멀리 있는 자리의 모양을 찾아 길을 완성해요.", mission: "반복되는 한 묶음과 목표 자리의 관계를 찾아 보세요." }, explanation: { headline: "반복 단위와 자리의 관계", steps: ["같은 순서로 되풀이되는 모양을 한 묶음으로 봅니다.", "목표 자리를 묶음의 길이와 비교합니다.", "남은 자리로 실제 모양을 확인합니다."] }, experience: makeExperience(c2Tracks[0], c2Tracks[1]) }, c2Practice, c2Extension, c2Similar);
course02A1.lessons.push(COURSE02_A1_POLYGON_LESSON);
course02A1.lessons.push(COURSE02_A1_STONE_GROWTH_LESSON);
course02A1.lessons.push(COURSE02_A1_COUNTERFEIT_LESSON);
course02A1.lessons.push(COURSE02_A1_MULTI_PATTERN_LESSON);
course02A1.lessons.push(COURSE02_A1_WINDMILL_PATTERN_LESSON);
course02A1.lessons.push(COURSE02_A1_CYCLE_TOTAL_LESSON);

const course03A1 = buildBook("course-03-a1", "course-03", "나머지 정리", { id: c3LessonId, unit: "나머지 정리", title: "몫과 나머지가 같은 수를 찾아요", representativeConcept: "몫과 나머지를 같은 수로 두고 나머지의 범위와 수의 범위를 함께 확인하기", story: { title: "수의 자물쇠", text: "자물쇠는 몫과 나머지가 같은 수에서만 열려요. 조건에 맞는 수를 골라 열쇠를 찾아요.", mission: "같은 수 조건과 범위를 함께 확인해 보세요." }, explanation: { headline: "같은 몫과 나머지의 범위", steps: ["나눗셈을 나누는 수, 몫, 나머지로 나누어 봅니다.", "몫과 나머지를 하나의 같은 수로 놓습니다.", "나머지 조건과 문제의 범위로 후보를 확인합니다."] }, experience: makeExperience(c3Tracks[0], c3Tracks[1]) }, c3Practice, c3Extension, c3Similar);
course03A1.lessons.push(COURSE03_A1_REMAINDER_LESSON);
course03A1.lessons.push(COURSE03_A1_LCM_REMAINDER_LESSON);
course03A1.lessons.push(COURSE03_A1_COMPLEX_FRACTION_LESSON);

const course02A2 = Object.freeze({
  id: "course-02-a2", bookId: "course-02-a2", courseId: "course-02", label: "A2",
  title: "복제수와 님게임", status: "pilot", lessons: COURSE02_A2_LESSONS,
  dailyPractice: { problemCount: 40, estimatedMinutes: 30 },
  source: { origin: "textbook-derived", note: "교사용 지도서의 네 단원 활동 구조를 확인하고 수와 문장을 새로 구성한 골든벨입니다." }
});
const course03A2 = Object.freeze({
  id: "course-03-a2", bookId: "course-03-a2", courseId: "course-03", label: "A2",
  title: "순환소수와 수직선좌표", status: "pilot", lessons: COURSE03_A2_LESSONS,
  dailyPractice: { problemCount: 40, estimatedMinutes: 30 },
  source: { origin: "textbook-derived", note: "교사용 지도서의 네 단원 활동 구조를 확인하고 수와 문장을 새로 구성한 골든벨입니다." }
});

const course02A3 = Object.freeze({
  id: "course-02-a3", bookId: "course-02-a3", courseId: "course-02", label: "A3",
  title: "수열과 최단거리", status: "pilot", lessons: COURSE02_A3_LESSONS,
  dailyPractice: { problemCount: 40, estimatedMinutes: 30 },
  source: { origin: "textbook-derived", note: "교사용 지도서의 세부 활동과 권별 테스트를 함께 확인하고 수와 문장을 새로 구성한 골든벨입니다." }
});
const course03A3 = Object.freeze({
  id: "course-03-a3", bookId: "course-03-a3", courseId: "course-03", label: "A3",
  title: "비례식과 속력·농도", status: "pilot", lessons: COURSE03_A3_LESSONS,
  dailyPractice: { problemCount: 40, estimatedMinutes: 30 },
  source: { origin: "textbook-derived", note: "최신 교사용 지도서의 실제 활동과 권별 테스트를 교차 확인하고 새 수와 상황으로 구성한 골든벨입니다." }
});

const course02A4 = Object.freeze({
  id: "course-02-a4", bookId: "course-02-a4", courseId: "course-02", label: "A4",
  title: "마방진·복면산과 비", status: "pilot", lessons: COURSE02_A4_LESSONS,
  dailyPractice: { problemCount: 40, estimatedMinutes: 30 },
  source: { origin: "textbook-derived", note: "학생용 교재와 권별 테스트의 실제 네 단원 및 답 계약을 대조하고 새 수와 상황으로 구성한 골든벨입니다." }
});
const course02G4 = Object.freeze({
  id: "course-02-g4", bookId: "course-02-g4", courseId: "course-02", label: "G4",
  title: "도형의 복원과 측정", status: "pilot", lessons: COURSE02_G4_LESSONS,
  dailyPractice: { problemCount: 40, estimatedMinutes: 30 },
  source: { origin: "textbook-derived", note: "교사용 지도서의 실제 네 단원과 풀이 근거를 확인하고 새 수와 도형으로 구성한 골든벨입니다." }
});

export const COURSE23_PILOT_BOOKS = Object.freeze([course02A1, course02A2, course02A3, course02A4, course02G4, course03A1, course03A2, course03A3]);
