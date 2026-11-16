// 선발시험(입학 모의고사) 정답 받기 — 원장 2026-11-16 「답안이 없어」.
// 정답은 git·공개 파일에 없다. 비공개 표 fields_unit_test_answer_keys(book_id selection-<시험 id>) →
// 서버 함수 unit-test-answers(권별 테스트와 같은 「모두에게 열기」)에서 필요할 때만 받는다.
// 7세 2·6차, 초1 1·3·4차는 교사용 답안지, 나머지는 직접 풀어 두 방법으로 검산한 값(초1 2차는 같은 문항이면 교사용 답안).
const ANSWER_API = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/unit-test-answers";
const cache = new Map();
export const SELECTION_ANSWER_IDS = new Set(["k6-2023-02", "k7-2022-04", "k7-2022-06", "k7-2022-08", "k7-2022-12", "g1-2022-03", "g1-2022-05", "g1-2019-08", "g1-2022-02"]);
export function loadSelectionAnswers(examId) {
  if (!SELECTION_ANSWER_IDS.has(examId)) return Promise.resolve(null);
  if (!cache.has(examId)) {
    cache.set(examId, fetch(ANSWER_API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookId: `selection-${examId}` }) })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => data?.answers || null)
      .catch(() => null)
      .then((answers) => { if (!answers) cache.delete(examId); return answers; }));
  }
  return cache.get(examId);
}

// 같은 문제가 이미 해설 영상이 있는 시험지에 들어 있을 때(원장 2026-11-16 「실전·파이널·최종 쪽 모의고사를 봐 · 동일한 시험지가 있을꺼야」
// → 「영상 연결 + 글 풀이」). 원본 쪽 그림을 눈으로 대조해 같은 문제로 확인한 것만 둔다. 정답은 여기 없다.
//   7세 4차 = 실전 모의고사 2회(20문항 차례까지 같음, 영상 하나에 문항 시각 없음)
//   7세 1차 3·4·13·15·18번 = 진단 모의고사 16·17·18·19·24번(문항 시각 있음 — mock/index.html EXPLAIN_TS)
//   7세 6차 19·20번 = 실전 모의고사 1회 19·20번
// 프리미어 활용·파이널·최종 15회는 문장으로 전부 대조해 같은 문제가 없었다.
const MOCK2 = "https://www.youtube.com/watch?v=S-P096L75ps";
const MOCK1 = "https://www.youtube.com/watch?v=41mXpws-gng";
const DIAG = "https://www.youtube.com/watch?v=DRVcC6pCZcw";
const diag = (no, start) => ({ url: DIAG, start, from: `진단 모의고사 ${no}번` });
export const SELECTION_VIDEOS = Object.freeze({
  "k7-2022-08": Object.fromEntries(Array.from({ length: 20 }, (_, i) => [i + 1, { url: MOCK2, start: 0, from: `실전 모의고사 2회 ${i + 1}번` }])),
  "k6-2023-02": { 3: diag(16, 729), 4: diag(17, 775), 13: diag(18, 827), 15: diag(19, 876), 18: diag(24, 1144) },
  "k7-2022-12": { 19: { url: MOCK1, start: 0, from: "실전 모의고사 1회 19번" }, 20: { url: MOCK1, start: 0, from: "실전 모의고사 1회 20번" } },
});
// 같은 시험지 전체가 겹칠 때 시험지 머리에 한 줄
export const SELECTION_SAME_PAPER = Object.freeze({ "k7-2022-08": "실전 모의고사 2회" });
export function selectionVideoHref(examId, number, { student = "학생", title = "" } = {}) {
  const v = SELECTION_VIDEOS[examId]?.[number];
  if (!v) return "";
  const p = new URLSearchParams({ video: v.url, title: title || `${number}번 해설`, student });
  if (v.start) p.set("start", String(v.start));
  return `../video-viewer/?${p}`;
}
export const selectionVideoFrom = (examId, number) => SELECTION_VIDEOS[examId]?.[number]?.from || "";

// 답 그림(원장 2026-11-16 「답안은 텍스트 위주보다 이미지 또는 식 형태」): 답 기록의 answerVisual을 작은 그림으로.
//   grid  {rows:[["3","1"],["7","5"]]} — 칸 배치 · shape {shapes:[{shape,fill}]} — 모양 답 · stack {shape,count,fill} — 쌓은 모양 · list {items:[…]}
const escV = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const FILL = { white: "#fff", black: "#22302a", gray: "#b9b3a6" };
function shapeSvg(shape, fill = "white", size = 30) {
  const f = FILL[fill] || FILL.white, s = size, h = s / 2, st = `fill="${f}" stroke="#22302a" stroke-width="2"`;
  const body = {
    circle: `<circle cx="${h}" cy="${h}" r="${h - 2}" ${st}/>`,
    triangle: `<polygon points="${h},2 ${s - 2},${s - 3} 2,${s - 3}" ${st}/>`,
    square: `<rect x="3" y="3" width="${s - 6}" height="${s - 6}" ${st}/>`,
    diamond: `<polygon points="${h},2 ${s - 2},${h} ${h},${s - 2} 2,${h}" ${st}/>`,
    star: `<polygon points="${[...Array(10)].map((_, i) => { const r = i % 2 ? h * 0.42 : h - 2, a = -Math.PI / 2 + i * Math.PI / 5; return `${(h + r * Math.cos(a)).toFixed(1)},${(h + r * Math.sin(a)).toFixed(1)}`; }).join(" ")}" ${st}/>`,
    heart: `<path d="M${h} ${s - 4} C${-2} ${h} ${4} ${2} ${h} ${h - 3} C${s - 4} ${2} ${s + 2} ${h} ${h} ${s - 4}Z" ${st}/>`,
  }[shape];
  return body ? `<svg class="sa-shape" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" aria-hidden="true">${body}</svg>` : "";
}
export function answerVisualMarkup(v) {
  if (!v || typeof v !== "object") return "";
  if (v.kind === "grid" && Array.isArray(v.rows)) {
    return `<table class="sa-grid">${v.rows.slice(0, 8).map((row) => `<tr>${(Array.isArray(row) ? row : []).slice(0, 8).map((c) => `<td${c === "" || c == null ? ' class="is-empty"' : ""}>${escV(c)}</td>`).join("")}</tr>`).join("")}</table>`;
  }
  if (v.kind === "shape" && Array.isArray(v.shapes)) return `<span class="sa-shapes">${v.shapes.slice(0, 6).map((x) => shapeSvg(x.shape, x.fill)).join("")}</span>`;
  if (v.kind === "stack") return `<span class="sa-stack">${Array.from({ length: Math.min(8, Number(v.count) || 1) }, () => shapeSvg(v.shape, v.fill, 26)).join("")}</span>`;
  if (v.kind === "list" && Array.isArray(v.items)) return `<span class="sa-list">${v.items.slice(0, 6).map((x) => `<b>${escV(x)}</b>`).join("")}</span>`;
  return "";
}
// 답 그림이 목록이면 답 글과 같은 말이 두 번 나오므로 목록만 보인다(원장 2026-11-16 「식 형태」).
export const isListVisual = (v) => !!(v && v.kind === "list" && Array.isArray(v.items) && v.items.length);
export const workMarkup = (work) => (Array.isArray(work) && work.length ? `<div class="sa-work">${work.slice(0, 8).map((line) => `<p>${escV(line)}</p>`).join("")}</div>` : "");
