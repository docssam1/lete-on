// 4권 묶음 4: 원본 28~29쪽 등식의 성질 8문항(새 단원) + 31(3)·32·33쪽 바꾸어 넣기 5문항. 정답은 비공개 DB에만.
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
const file = process.argv[2];
const original = await readFile(file, "utf8");
const { GOLDEN_BELL_BOOKS } = await import(`${pathToFileURL(file).href}?patch=${Date.now()}`);
const books = JSON.parse(JSON.stringify(GOLDEN_BELL_BOOKS));
const book = books.find((b) => b.id === "book-04");
if (book.lessons.some((l) => l.id === "balance-equality-source")) throw new Error("already patched");
const STAGE = "7세 8월부터 초등 1학년 초반 · FC 1과정 4권";
const PROMPT = "다음 그림의 양팔 저울은 모두 평형을 이루고 있습니다.";
const eq = (left, right) => ({ left, right });
// targetText: 물음을 「● 1개 = ▲ ?개」 줄로. targetBalance: 물음 왼쪽이 앞 저울과 같아도 「?」 저울을 따로 그린다(29-(1)).
const vis = (equations, target, targetText, targetBalance) => ({ kind: "book4", subtype: "source-balance-equations", equations, target, ...(targetText ? { targetText: true } : {}), ...(targetBalance ? { targetBalance: true } : {}) });
const ask = (left, unit) => ({ left, right: { [unit]: null } });

// ── 새 단원: 양쪽에서 같은 것을 지워요 (28~29쪽)
const E = (n, page, q, printGroup, prompt, visual) => ({ id: `balance-equality-${n}`, sourceNo: `${page}-(${q})`, typeLabel: "등식의 성질로 무게 비교", sourceLocator: `학생용 ${page}쪽 활동 02 ① Q${q}`, printGroup, prompt, visual, answerMode: "input", inputMode: "numeric", answerRef: `/books/book-04/lessons/14/original/items/${n}` });
const eqItems = [
  E(0, 28, 1, 1, `${PROMPT} 동그라미 1개는 세모 몇 개의 무게와 같습니까?`, vis([eq({ "동그라미": 2 }, { "세모": 4 })], ask({ "동그라미": 1 }, "세모"), true)),
  E(1, 28, 2, 1, `${PROMPT} 동그라미 1개와 세모 1개는 네모 몇 개의 무게와 같습니까?`, vis([eq({ "동그라미": 2, "세모": 2 }, { "네모": 6 })], ask({ "동그라미": 1, "세모": 1 }, "네모"), true)),
  E(2, 28, 3, 1, `${PROMPT} 동그라미 1개는 네모 몇 개의 무게와 같습니까?`, vis([eq({ "동그라미": 2, "네모": 3 }, { "네모": 6, "동그라미": 1 })], ask({ "동그라미": 1 }, "네모"), true)),
  E(3, 28, 4, 1, `${PROMPT} 네모 1개는 세모 몇 개의 무게와 같습니까?`, vis([eq({ "동그라미": 1, "네모": 3, "세모": 4 }, { "네모": 4, "세모": 2, "동그라미": 1 })], ask({ "네모": 1 }, "세모"), true)),
  E(4, 29, 1, 2, `${PROMPT} 마지막 저울의 빈칸에 네모 몇 개를 놓아야 합니까?`, vis([eq({ "동그라미": 1 }, { "세모": 2 }), eq({ "세모": 1 }, { "네모": 3 })], ask({ "동그라미": 1 }, "네모"), false, true)),
  E(5, 29, 2, 2, `${PROMPT} 동그라미 1개는 네모 몇 개의 무게와 같습니까?`, vis([eq({ "동그라미": 1 }, { "세모": 1, "네모": 1 }), eq({ "세모": 2 }, { "네모": 4 })], ask({ "동그라미": 1 }, "네모"), true)),
  E(6, 29, 3, 2, `${PROMPT} 동그라미 1개는 네모 몇 개의 무게와 같습니까?`, vis([eq({ "동그라미": 1 }, { "세모": 2, "네모": 1 }), eq({ "세모": 4 }, { "네모": 6 })], ask({ "동그라미": 1 }, "네모"), true)),
  E(7, 29, 4, 2, `${PROMPT} 동그라미 1개는 세모 몇 개의 무게와 같습니까?`, vis([eq({ "동그라미": 2, "세모": 2 }, { "네모": 2 }), eq({ "네모": 1, "세모": 1 }, { "동그라미": 2 })], ask({ "동그라미": 1 }, "세모"), true))
];
eqItems.forEach((item) => { item.sourceDiscrepancy = "원본은 물음 문장 없이 「1개 = □개」 빈칸만 있어 같은 뜻의 물음 문장을 붙임"; });

const lessonEq = {
  id: "balance-equality-source",
  unit: "양팔저울과 바꾸어 넣기",
  title: "양쪽에서 같은 것을 지워요",
  sourceLocator: "학생용 28~30쪽 활동 02 ① 등식의 성질 이해하기",
  sourceTypeIds: ["balance-equality-source"],
  representativeConcept: "평형인 양팔저울의 양쪽에 똑같은 것을 더하거나 빼도 평형은 유지됨",
  experience: {
    kind: "guided-concept", family: "book4-balance-equality", title: "양쪽에서 같은 것을 지워 한 개의 무게를 찾아요",
    hint: "양쪽 접시에 똑같이 있는 것은 함께 지워도 저울이 평형입니다.", learnerStage: STAGE,
    model: { visual: { kind: "book4", subtype: "balance-equality-model", left: { square: 2, triangle: 1 }, right: { triangle: 7 }, unit: "square", per: "triangle" } },
    beats: [
      { id: "book4-balance-equality-1", action: "draw", caption: "평형인 저울의 양쪽 물건을 봅니다." },
      { id: "book4-balance-equality-2", action: "transform", caption: "양쪽에 똑같이 있는 세모를 함께 지웁니다." },
      { id: "book4-balance-equality-3", action: "verify", caption: "남은 것끼리 비교해 네모 1개의 무게를 찾습니다." }
    ],
    check: { prompt: "가 2개와 나 1개가 나 5개와 평형이면, 가 1개는 나 몇 개와 같을까요?", options: ["2", "4", "5"], answerRef: "/books/book-04/lessons/14/experience/check" },
    finalStill: { standsAlone: true }
  },
  story: { title: "저울은 기울지 않아요", text: "평형인 저울의 양쪽에 똑같은 것을 더하거나 빼도 저울은 평형을 유지합니다.", mission: "양쪽에 똑같이 있는 것을 먼저 지우고 남은 것끼리 비교하세요." },
  explanation: { headline: "양쪽에서 같은 것을 지웁니다.", steps: ["양쪽 접시에 똑같이 있는 물건을 찾습니다.", "똑같은 것을 양쪽에서 함께 지워도 평형은 그대로입니다.", "남은 것끼리 비교해 한 개가 몇 개와 같은지 나누어 구합니다."] },
  original: { title: "골든벨 4권", mode: "paged", sourceQuestionCount: eqItems.length, structureKey: "balance-equality-source-structure", prompt: PROMPT, items: eqItems },
  extension: { title: "추가 학습", structureKey: "balance-equality-source-structure", story: "저울 왼쪽에 동그라미 3개와 세모 1개, 오른쪽에 동그라미 1개와 세모 5개가 있고 평형입니다.", prompt: "동그라미 1개는 세모 몇 개의 무게와 같을까요?", visual: vis([eq({ "동그라미": 3, "세모": 1 }, { "동그라미": 1, "세모": 5 })], ask({ "동그라미": 1 }, "세모"), true), answerMode: "input", inputMode: "numeric", extensionKind: "source-structured-authored", answerRef: "/books/book-04/lessons/14/extension" }
};
book.lessons.splice(book.lessons.findIndex((l) => l.id === "balance-substitution"), 0, lessonEq);

// ── 기존 단원에 31(3)·32·33쪽 5문항
{
  const lesson = book.lessons.find((l) => l.id === "balance-substitution");
  const o = lesson.original;
  if (o.items.length !== 2) throw new Error("unexpected balance-substitution items");
  const S = (n, page, q, printGroup, prompt, visual) => ({ id: `balance-substitute-${page}-${q}`, sourceNo: `${page}-(${q})`, typeLabel: "양팔저울 바꾸어 넣기", sourceLocator: `학생용 ${page}쪽 활동 02 ② Q${q}`, printGroup, prompt, visual, answerMode: "input", inputMode: "numeric", answerRef: `/books/book-04/lessons/5/original/items/${n}` });
  o.items.push(
    S(2, 31, 3, 3, `${PROMPT} 빈 접시에 가 구슬을 몇 개를 놓아야 하는가?`, vis([eq({ "가": 2 }, { "나": 1 }), eq({ "가": 1, "나": 1 }, { "다": 1 })], ask({ "나": 1, "다": 1 }, "가"), false)),
    S(3, 32, 1, 4, `${PROMPT} 빈 접시에 별 몇 개를 놓아야 하는가?`, vis([eq({ "별": 2 }, { "동그라미": 1 }), eq({ "동그라미": 1, "별": 2 }, { "네모": 1 })], ask({ "네모": 1, "동그라미": 1 }, "별"), false)),
    S(4, 32, 2, 4, `${PROMPT} 네모 1개는 별 몇 개의 무게와 같습니까?`, vis([eq({ "네모": 3 }, { "동그라미": 1 }), eq({ "네모": 2, "별": 3 }, { "동그라미": 1 })], ask({ "네모": 1 }, "별"), true)),
    S(5, 33, 1, 5, `${PROMPT} 세모 1개는 마름모 몇 개의 무게와 같습니까?`, vis([eq({ "네모": 1 }, { "동그라미": 2 }), eq({ "동그라미": 3 }, { "마름모": 2 }), eq({ "동그라미": 1, "네모": 1 }, { "세모": 1 })], ask({ "세모": 1 }, "마름모"), true)),
    S(6, 33, 2, 5, `${PROMPT} 별 1개는 세모 몇 개의 무게와 같습니까?`, vis([eq({ "네모": 1 }, { "세모": 3 }), eq({ "네모": 1, "세모": 1 }, { "마름모": 2 }), eq({ "마름모": 1, "네모": 1 }, { "별": 1 })], ask({ "별": 1 }, "세모"), true))
  );
  o.sourceQuestionCount = o.items.length;
  o.mode = "paged";
  delete lesson.sourceHold;
}

// 보류 메모와 쪽별 상태표
book.sourceHold = book.sourceHold.filter((h) => !/28 ~30/.test(h.sourceLocator));
const h34 = book.sourceHold.find((h) => /32 ~34/.test(h.sourceLocator));
if (!h34) throw new Error("hold 32~34 not found");
h34.sourceLocator = "교사용 슬라이드 34의 △n 빈칸";
h34.reason = "학생용에 조건 없이 빈칸만 있어 문항으로 확정할 수 없음";
const cov = book.sourceCoverage;
const replace = (pages, entries) => {
  const i = cov.findIndex((e) => e.pages.join() === pages.join());
  if (i < 0) throw new Error(`coverage ${pages} not found`);
  cov.splice(i, 1, ...entries);
};
replace([28, 29, 30], [{ pages: [28, 29, 30], lessonId: "balance-equality-source", status: "implemented" }]);
replace([31], [{ pages: [31], lessonId: "balance-substitution", status: "implemented" }]);
replace([32, 33, 34], [{ pages: [32, 33], lessonId: "balance-substitution", status: "implemented" }, { pages: [34], status: "held", holdCount: 1 }]);

const header = original.slice(0, original.indexOf("export const GOLDEN_BELL_BOOKS"));
const tail = original.slice(original.indexOf("\n\nexport const goldenBellBookById"));
await writeFile(file, `${header}export const GOLDEN_BELL_BOOKS = Object.freeze(${JSON.stringify(books)});${tail}`, "utf8");
console.log("batch4 patched; lessons:", book.lessons.map((l) => l.id).join(" "));
