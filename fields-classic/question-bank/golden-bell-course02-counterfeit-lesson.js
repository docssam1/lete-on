const esc = (value) => String(value ?? "").replace(/[&<>\"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

export const COUNTERFEIT_KIND = "course02-counterfeit-coins";

const visual = (phase, groups, extra = {}) => ({ kind: COUNTERFEIT_KIND, phase, groups, ...extra });
const ref = (id) => `/course23/course-02-a1/course-02-a1-counterfeit:${id}`;

const item = (id, prompt, task, group, visualData = {}) => ({
  id: `course-02-a1-counterfeit:${id}`, prompt,
  hint: "먼저 세 묶음의 수를 같게 나누고, 저울의 결과가 알려 주는 묶음만 남겨 보세요.",
  visual: visual("problem", visualData.groups || [[1, 2, 3], [4, 5, 6], [7, 8, 9]], { task, ...visualData }),
  answerMode: "input", inputMode: "numeric", typeLabel: "가벼운 가짜 금화 찾기", sourceNo: String(id), printGroup: group,
  answerRef: ref(id)
});

const original = [
  item("practice-1", "금화 9개 중 가벼운 가짜 금화 1개를 찾으려 합니다. 처음에는 금화 몇 개씩을 나누어 비교하면 좋을까요?", "first", 1),
  item("practice-2", "1, 2, 3번 금화와 4, 5, 6번 금화를 비교했더니 수평이었습니다. 가짜 금화 후보는 몇 개인가요?", "level-first", 1, { compare: [0, 1], result: "level" }),
  item("practice-3", "7번과 8번 금화를 비교했더니 7번 쪽 접시가 올라갔습니다. 가벼운 가짜 금화는 몇 번인가요?", "pair-light-left", 2, { groups: [[7], [8], [9]], compare: [0, 1], result: "light-left" }),
  item("practice-4", "첫 비교에서 1, 2, 3번 쪽이 올라가고 4, 5, 6번 쪽이 내려갔습니다. 가짜 금화가 있을 수 있는 묶음의 금화 수는 몇 개인가요?", "tilt-group", 2, { compare: [0, 1], result: "light-left" })
];

const extension = item("additional-1", "첫 비교가 수평이면 남은 후보 3개 중 두 금화를 다시 비교합니다. 두 번째 비교에서 양쪽 접시에 각각 몇 개씩 올리나요?", "remaining-pair", 1, { groups: [[7], [8], [9]], compare: [0, 1] });
const similarPractice = [
  item("additional-2", "가짜 금화 후보가 7, 8, 9번으로 좁혀졌습니다. 7번과 8번이 수평이면 가짜 금화는 몇 번인가요?", "pair-level", 1, { groups: [[7], [8], [9]], compare: [0, 1], result: "level" }),
  item("additional-3", "가짜 금화 후보가 7, 8, 9번으로 좁혀졌습니다. 7번 쪽이 올라가면 가짜 금화는 몇 번인가요?", "pair-light-left", 2, { groups: [[7], [8], [9]], compare: [0, 1], result: "light-left" }),
  item("additional-4", "가짜 금화 후보가 7, 8, 9번으로 좁혀졌습니다. 8번 쪽이 올라가면 가짜 금화는 몇 번인가요?", "pair-light-right", 2, { groups: [[7], [8], [9]], compare: [0, 1], result: "light-right" }),
  item("additional-5", "첫 비교에서 1, 2, 3번 쪽 접시가 내려갔습니다. 가벼운 가짜 금화가 있는 후보는 몇 번째 묶음인가요?", "tilt-right", 2, { compare: [0, 1], result: "left-heavy" }),
  item("additional-6", "9개를 3개씩 나눈 뒤 첫 비교가 수평이었습니다. 남은 3개 중 2개를 다시 비교하면 전체 최소 비교 횟수는 몇 회인가요?", "minimum", 1)
];

const tracks = [
  { id: "course-02-a1-counterfeit-track-1", title: "세 묶음으로 후보 줄이기", openingPrompt: "9개의 금화를 세 묶음으로 나누어 가짜 금화가 있는 묶음을 찾아요.", hint: "같은 개수의 금화를 양쪽에 올리고, 수평인지 기울었는지 관찰하세요.", beats: [
    { caption: "금화 9개를 3개씩 세 묶음으로 나누어 후보를 고르게 만들어요.", visual: visual("group", [[1, 2, 3], [4, 5, 6], [7, 8, 9]]) },
    { caption: "첫 번째 비교에서는 첫 묶음과 둘째 묶음을 저울에 올려요. 셋째 묶음은 잠시 남겨 둬요.", visual: visual("weigh-1", [[1, 2, 3], [4, 5, 6], [7, 8, 9]], { compare: [0, 1] }) },
    { caption: "수평이면 비교하지 않은 셋째 묶음에 있고, 기울면 올라간 쪽 묶음에 있어요. 후보는 3개로 줄어요.", visual: visual("branch", [[1, 2, 3], [4, 5, 6], [7, 8, 9]], { compare: [0, 1] }) },
    { caption: "어느 묶음이 후보인지 알았으면 다음에는 후보 3개 중 2개를 비교할 수 있어요.", visual: visual("candidate", [[7], [8], [9]], { compare: [0, 1] }) }
  ] },
  { id: "course-02-a1-counterfeit-track-2", title: "두 번째 비교로 하나 남기기", openingPrompt: "후보 금화 3개에서 두 번째 비교로 가짜 금화 하나를 확정해요.", hint: "후보 두 개를 비교한 결과가 수평인지 기울었는지에 따라 남는 금화를 확인하세요.", beats: [
    { caption: "후보 3개 중 2개를 골라 양팔 저울에 올려요.", visual: visual("weigh-2", [[7], [8], [9]], { compare: [0, 1] }) },
    { caption: "두 금화가 수평이면 저울에 올리지 않은 금화가 가벼운 가짜예요.", visual: visual("level", [[7], [8], [9]], { compare: [0, 1], result: "level" }) },
    { caption: "한쪽이 올라가면 올라간 쪽의 금화가 더 가벼운 가짜예요.", visual: visual("tilt", [[7], [8], [9]], { compare: [0, 1], result: "light-left" }) },
    { caption: "첫 번째 비교와 두 번째 비교를 합치면 두 번의 비교만으로 가짜 금화를 찾을 수 있어요.", visual: visual("verify", [[7], [8], [9]], { compare: [0, 1], result: "level" }) }
  ] }
];

export function counterfeitConceptMarkup(input) {
  if (!input || input.kind !== COUNTERFEIT_KIND) return "";
  const groups = input.groups || [];
  const scale = (left, right, index) => `<div class="course02-counterfeit-scale" data-scale="${index}" data-result="${esc(input.result || "unknown")}"><div class="course02-counterfeit-pan left">${left.map((value) => `<i>${esc(value)}</i>`).join("")}</div><div class="course02-counterfeit-pan right">${right.map((value) => `<i>${esc(value)}</i>`).join("")}</div><div class="course02-counterfeit-beam"><b></b><b></b></div><div class="course02-counterfeit-stand"></div></div>`;
  const pair = input.compare || [0, 1];
  const left = groups[pair[0]] || [];
  const right = groups[pair[1]] || [];
  const candidate = input.result === "level" ? 2 : ["light-left"].includes(input.result) ? pair[0] : ["light-right", "left-heavy"].includes(input.result) ? pair[1] : -1;
  return `<div class="course02-counterfeit-visual" data-phase="${esc(input.phase || "problem")}"><div class="course02-counterfeit-groups">${groups.map((group, index) => `<div class="course02-counterfeit-group ${index === candidate ? "is-candidate" : ""}" data-group="${index}">${group.map((value) => `<i>${esc(value)}</i>`).join("")}</div>`).join("")}</div>${input.compare && (left.length || right.length) ? scale(left, right, 1) : ""}<p class="course02-counterfeit-note">${input.phase === "verify" ? "첫 비교와 둘째 비교의 결과를 차례로 확인해 후보가 하나인지 검산해요." : "같은 수를 비교하고, 올라간 쪽 또는 남겨 둔 묶음을 확인해요."}</p></div>`;
}

const concept = { kind: "course-concept", tracks };

export const COURSE02_A1_COUNTERFEIT_LESSON = Object.freeze({
  id: "course-02-a1-counterfeit-coins", courseId: "course-02", bookId: "course-02-a1", label: "A1", title: "가벼운 가짜 금화 찾기", unit: "양팔저울과 금화 찾기", status: "pilot",
  learnerStage: "필즈 더 클래식 2과정 A1; 연령 미확정",
  representativeConcept: "같은 개수로 나누어 비교하고, 가벼운 가짜 금화가 있는 후보를 줄여 최소 횟수로 찾기",
  story: { title: "금화 저울", text: "같아 보이는 금화 중 하나만 가벼워요. 양팔 저울의 결과로 후보를 줄여 보세요.", mission: "후보를 세 묶음으로 나누고 두 번의 비교로 하나를 찾아 보세요." },
  explanation: { headline: "후보를 같은 크기로 나누기", steps: ["9개를 3개씩 세 묶음으로 나눕니다.", "첫 비교 결과로 가짜가 있는 3개를 고릅니다.", "후보 3개 중 2개를 비교해 마지막 금화를 확인합니다."] },
  experience: concept,
  original: { title: "연습", prompt: "저울의 결과를 이용해 가벼운 가짜 금화를 찾아 보세요.", mode: "paged", separateConceptPrint: true, items: original },
  extension, similarPractice, dailyPractice: { problemCount: 10, original: 4, extension: 1, similar: 5, estimatedMinutes: null }, sourceTypeIds: [],
  source: { origin: "textbook-derived", note: "양팔 저울과 금화 찾기 활동을 바탕으로 만든 새 개념 학습입니다." }
});
