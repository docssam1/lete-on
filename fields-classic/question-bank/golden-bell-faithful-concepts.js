import { faithfulQuestion, FAITHFUL_LESSONS, refreshGoldenBellPracticeCounts } from "./golden-bell-faithful-practice.js?v=20260922a";

const clone = (value) => structuredClone(value);
const escape = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");

// These are worked examples, distinct from both source questions and practice.
export function faithfulConcept(lessonId) {
  if (!FAITHFUL_LESSONS[lessonId]) return null;
  const question = faithfulQuestion(lessonId, 0);
  const visual = question.visual;
  let frames;
  let captions;
  if (lessonId === "cardinal-placement") {
    frames = [{}, { SE: "빵집", SW: "약국" }, { SE: "빵집", SW: "약국", NE: "문구점" }, { SE: "빵집", SW: "약국", NE: "문구점", NW: "공원" }]
      .map((placements) => Object.keys(placements).length ? { ...clone(visual), placements } : clone(visual));
    captions = ["네 칸과 세 조건을 봅니다.", "약국은 빵집의 서쪽이므로 아랫줄은 왼쪽 약국, 오른쪽 빵집입니다. 문구점이 빵집의 북쪽에 있어야 하므로 빵집은 아랫줄입니다.", "빵집의 바로 위에 문구점을 놓습니다.", "문구점은 공원의 동쪽이므로 ㉮는 공원입니다. 약국은 빵집의 서쪽, 문구점은 빵집의 북쪽에도 맞습니다."];
  } else if (lessonId === "checkerboard-product-matrix") {
    const positions = visual.active;
    const values = [4, 7, 8, 9, 6, 3, 2, 5];
    frames = [[], [0, 1, 5, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6, 7]].map((indices) => {
      const frame = clone(visual);
      for (const index of indices) {
        const [row, column] = positions[index];
        frame.cells[row][column] = values[index];
        if (!frame.revealed.some(([r, c]) => r === row && c === column)) frame.revealed.push([row, column]);
      }
      return frame;
    });
    captions = ["색칠된 여덟 칸에 2부터 9까지를 한 번씩 놓습니다.", "첫 가로줄 28은 4×7입니다. 둘째 세로줄 12와 함께 맞는 ㉮는 4이고, 그 아래는 3입니다. 셋째 가로줄은 18÷3=6입니다.", "첫 세로줄은 48÷6=8, 둘째 가로줄은 72÷8=9입니다.", "셋째 세로줄은 14÷7=2, 넷째 세로줄은 45÷9=5입니다. 마지막 가로줄도 2×5=10입니다. ㉮=4, ㉯=6, ㉰=2이고 여덟 카드를 한 번씩 썼습니다."];
  } else if (lessonId === "vertical-shape-cryptarithm") {
    frames = [
      clone(visual),
      { ...visual, top: "79", bottom: "37", carries: ["", "1", ""] },
      { ...visual, top: "79", bottom: "37", result: "116", carries: ["1", "1", ""] },
      { ...visual, top: "79", bottom: "37", result: "116" }
    ];
    captions = ["두 자리 수끼리 더해 세 자리 수가 됩니다. 같은 도형에는 같은 숫자를 넣습니다.", "일의 자리에서 9+□의 끝자리가 6이므로 □=7입니다. 9+7=16에서 1을 받아올립니다.", "십의 자리는 7+3+1=11입니다. 백의 자리로 1을 올리므로 ○=1이고, 십의 자리 ○도 1입니다.", "79+37=116입니다. □=7, ○=1을 원래 세로셈의 모든 도형에 넣어 확인했습니다."];
  } else if (lessonId === "elapsed-time") {
    frames = [
      clone(visual),
      { ...visual, expression: "13시 20분 − 8시 45분" },
      { ...visual, expression: "12시 80분 − 8시 45분 = 4시간 35분" },
      { ...visual, expression: "오전 8시 45분 + 4시간 35분 = 오후 1시 20분" }
    ];
    captions = ["오전 8시 45분부터 오후 1시 20분까지 걸린 시간을 구합니다.", "오후 1시를 13시로 바꾸어 오전과 같은 기준으로 계산합니다.", "20분에서 45분을 뺄 수 없어 1시간을 60분으로 바꿉니다. 80−45=35분, 12−8=4시간입니다.", "시작 시각에 4시간 35분을 더하면 오후 1시 20분입니다. 걸린 시간은 4시간 35분입니다."];
  } else {
    frames = [clone(visual), clone(visual), clone(visual), clone(visual)];
    frames[1].equations[0] = { left: { "세모": 2 }, right: { "네모": 6 } };
    frames[2].equations[0] = { left: { "세모": 1 }, right: { "네모": 3 } };
    frames[2].equations[1] = { left: { "동그라미": 1 }, right: { "네모": 4 } };
    frames[3].equations = [{ left: { "네모": 8 }, right: { "네모": 8 } }, { left: { "동그라미": 1 }, right: { "네모": 4 } }];
    captions = ["모두 평형인 두 저울을 보고 동그라미 한 개의 무게를 네모로 나타냅니다.", "첫 저울의 양쪽에서 네모 2개씩을 덜면 세모 2개=네모 6개입니다.", "세모 1개=네모 3개이므로 동그라미 1개=네모 3+1=4개입니다.", "첫 저울에 넣으면 2×3+2=8입니다. 둘째 저울도 4=3+1로 양쪽 무게가 같습니다."];
  }
  return {
    prompt: question.prompt, visual: clone(visual),
    beats: frames.map((frame, index) => ({ id: `${lessonId}-faithful-${index}`, action: index === 0 ? "reveal" : index === 3 ? "verify" : "highlight", visual: frame, caption: captions[index] }))
  };
}

export function enhanceFaithfulConcepts(books) {
  for (const book of books) for (const lesson of book.lessons || []) {
    if (FAITHFUL_LESSONS[lesson.id]?.bookId !== book.id) continue;
    const example = faithfulConcept(lesson.id);
    if (!example || !lesson.experience) continue;
    lesson.experience.beats = example.beats;
    lesson.experience.workedExample = { prompt: example.prompt, visual: example.visual };
    lesson.original.separateConceptPrint = true;
    lesson.original.printMode = "paged";
    lesson.original.items.forEach((item, index) => {
      item.printGroup ??= index + 1;
      if (!item.visual && lesson.original.visual.panels?.[index]) {
        item.visual = { kind: lesson.original.visual.kind.replace("-set", ""), ...clone(lesson.original.visual.panels[index].visual) };
      }
    });
    if (lesson.id === "checkerboard-product-matrix") {
      lesson.experience.check.prompt = "한 가로줄의 두 수가 3과 4라면 그 줄 끝의 곱은 얼마일까요?";
    }
  }
  for (const book of books) if (book.lessons.some((lesson) => FAITHFUL_LESSONS[lesson.id]?.bookId === book.id)) refreshGoldenBellPracticeCounts(book);
}

export function faithfulVisualMarkup(visual) {
  if (visual.kind === "book4" && visual.subtype === "source-table-logic" && visual.places?.length === 4 && visual.targetPosition) {
    const positions = ["NW", "NE", "SW", "SE"];
    return `<div class="faithful-direction"><ul>${visual.clues.map((clue) => `<li>${escape(clue)}</li>`).join("")}</ul><div class="faithful-compass"><span>북</span><div><i>서</i><div class="faithful-place-grid">${positions.map((position) => `<b data-position="${position}" class="${position === visual.targetPosition ? "target" : ""}">${escape(visual.placements?.[position] || (position === visual.targetPosition ? "㉮" : ""))}</b>`).join("")}</div><i>동</i></div><span>남</span></div></div>`;
  }
  if (visual.kind === "book8" && visual.subtype === "vertical" && visual.carries) {
    const row = (value, operator = "") => `<span>${operator}</span>${String(value).padStart(3, " ").split("").map((cell) => `<b>${escape(cell)}</b>`).join("")}`;
    return `<div class="faithful-vertical" aria-label="받아올림이 표시된 세로셈"><span></span>${visual.carries.map((carry) => `<small>${carry}</small>`).join("")}${row(visual.top)}${row(visual.bottom, visual.operator)}<hr>${row(visual.result)}</div>`;
  }
  return "";
}
