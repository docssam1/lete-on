// A1-2 2단원 입체도형 · 2차시 (원본 36~41쪽)
//  36 정육면체·원기둥: 동물들의 궁금증 — 직접 3D로 굴려 보고(원기둥), 올려 보고(둘 다 됨), 위에서 보기(네모·동그라미)
//  37 사각뿔·원뿔: 뿔 모양 · 올릴 수 없음 · 위에서 보면 네모·동그라미
//  38 「입체도형 수수께끼」 4문제 · 39 기둥/뿔/공 모양으로 나누기
//  40 똑같이 쌓기(판·원기둥·원판·정육면체, 원뿔·연필 모양은 필요 없음) · 41 「모양을 만들자!」 기억하여 쌓기 3판
import { scene, onHit } from "../numbers.js?v=20261117a";
import { solidIcon, sortToBins, chooseAll, solidArt } from "../shapes.js?v=20261117a";
import { createSolidStage, solidTools } from "../solids3d.js?v=20261117a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;
// 동물 얼굴(원본 36~39쪽 말하는 동물들) — 코드로 그림
const FACE = {
  사슴: `<ellipse cx="0" cy="6" rx="22" ry="26" fill="#a0724a"/><path d="M-14 -16 l-10 -22 M-20 -30 l-8 -4 M14 -16 l10 -22 M20 -30 l8 -4" stroke="#f08a3c" stroke-width="4" stroke-linecap="round"/><circle cx="-8" cy="0" r="3" fill="#25324a"/><circle cx="8" cy="0" r="3" fill="#25324a"/><ellipse cx="0" cy="16" rx="8" ry="6" fill="#5a3a22"/>`,
  사자: `<circle r="32" fill="#e0902a"/><circle r="22" fill="#ffd28a"/><circle cx="-8" cy="-4" r="3" fill="#25324a"/><circle cx="8" cy="-4" r="3" fill="#25324a"/><ellipse cx="0" cy="6" rx="6" ry="4" fill="#7a4a22"/>`,
  곰: `<circle cx="-18" cy="-18" r="10" fill="#a0724a"/><circle cx="18" cy="-18" r="10" fill="#a0724a"/><circle r="26" fill="#b5835a"/><ellipse cx="0" cy="8" rx="11" ry="8" fill="#f1d3b0"/><circle cx="-9" cy="-4" r="3" fill="#25324a"/><circle cx="9" cy="-4" r="3" fill="#25324a"/><ellipse cx="0" cy="4" rx="4" ry="3" fill="#25324a"/>`,
  판다: `<circle cx="-19" cy="-19" r="10" fill="#25324a"/><circle cx="19" cy="-19" r="10" fill="#25324a"/><circle r="26" fill="#fff" stroke="#c9cfd8" stroke-width="2"/><ellipse cx="-10" cy="-2" rx="7" ry="9" fill="#25324a"/><ellipse cx="10" cy="-2" rx="7" ry="9" fill="#25324a"/><circle cx="-9" cy="-3" r="2" fill="#fff"/><circle cx="9" cy="-3" r="2" fill="#fff"/><ellipse cx="0" cy="10" rx="4" ry="3" fill="#25324a"/>`,
  개구리: `<circle cx="-14" cy="-18" r="10" fill="#7bd36a"/><circle cx="14" cy="-18" r="10" fill="#7bd36a"/><ellipse cx="0" cy="4" rx="28" ry="22" fill="#7bd36a"/><circle cx="-14" cy="-19" r="4" fill="#25324a"/><circle cx="14" cy="-19" r="4" fill="#25324a"/><path d="M-12 10 q12 8 24 0" stroke="#2f7a28" stroke-width="3" fill="none"/>`,
  펭귄: `<ellipse cx="0" cy="4" rx="24" ry="28" fill="#25324a"/><ellipse cx="0" cy="10" rx="16" ry="20" fill="#fff"/><circle cx="-7" cy="-8" r="3" fill="#fff"/><circle cx="7" cy="-8" r="3" fill="#fff"/><path d="M-5 -2 l5 6 l5 -6z" fill="#ffb627"/>`,
  코알라: `<circle cx="-22" cy="-12" r="13" fill="#b6bccb"/><circle cx="22" cy="-12" r="13" fill="#b6bccb"/><circle r="24" fill="#c8ced8"/><ellipse cx="0" cy="4" rx="7" ry="9" fill="#3b4252"/><circle cx="-10" cy="-6" r="3" fill="#25324a"/><circle cx="10" cy="-6" r="3" fill="#25324a"/>`
};
export const face = (who, size = 70) => `<svg width="${size}" height="${size}" viewBox="-40 -40 80 80" aria-hidden="true">${FACE[who]}</svg>`;
// 무대 위에 3D를 놓을 칸 + 말풍선 줄
function stage3d(ctx) {
  ctx.stage.innerHTML = `<div class="u2-3d" style="position:absolute;inset:0"></div>`;
  return ctx.stage.querySelector(".u2-3d");
}
const bubble = (who, text) => `<div class="u2-bub">${face(who, 56)}<span>${text}</span></div>`;

// ── 36·37 관찰하기(공통) ──
async function observe(ctx, no, a, b, cfg) {
  const pg = await ctx.source(no);
  const host = stage3d(ctx);
  const S = createSolidStage(host, { items: [{ kind: a.kind, color: a.color, x: -1.3 }, { kind: b.kind, color: b.color, x: 1.3 }] });
  ctx.onDispose(() => S?.dispose());
  const bub = pg?.bubbles || [];
  const ask = async (i, run, choices, correct, praise) => {
    ctx.setSource(bub[i] || "");
    ctx.dock.innerHTML = `<div class="u2-ask">${bubble(["사슴", "사자", "곰", "판다"][i], bub[i] || "")}</div>`;
    await ctx.guide.think(bub[i] || "");
    if (run) await run();
    const tray = document.createElement("div"); tray.className = "sm-tray"; ctx.dock.append(tray);
    await ctx.choose(choices, { correct, host: tray, wrongSay: "3D 그림을 다시 보세요. 단추로 한 번 더 해 볼 수 있어요.", praise });
    await ctx.wait(400);
  };
  // 사슴: 모두 ○○ 모양이야
  ctx.dock.innerHTML = `<div class="u2-ask">${bubble("사슴", bub[0] || "")}</div>`;
  await ctx.guide.think(bub[0] || "");
  if (S) await Promise.all([S.spin(S.objects[0]), S.spin(S.objects[1])]);
  await ctx.guide.say(cfg.family);
  await ask(1, cfg.q1run ? () => cfg.q1run(S) : null, cfg.q1.choices, cfg.q1.correct, cfg.q1.praise);
  // 곰: 올려 보기
  const tools = S ? solidTools(host, [{ key: "stack", label: "⬇ 위에 올려 보기" }], async (_, btn) => { btn.disabled = true; S.clearExtras(S.objects.slice(0, 2)); await Promise.all([S.stackTest(S.objects[0]), S.stackTest(S.objects[1])]); btn.disabled = false; }) : null;
  await ask(2, async () => { if (S) { S.clearExtras(S.objects.slice(0, 2)); await Promise.all([S.stackTest(S.objects[0]), S.stackTest(S.objects[1])]); } }, cfg.q2.choices, cfg.q2.correct, cfg.q2.praise);
  tools?.remove();
  // 판다: 위에서 보기
  if (S) S.clearExtras(S.objects.slice(0, 2));
  const tools2 = S ? solidTools(host, [{ key: "top", label: "👀 위에서 보기" }, { key: "home", label: "↺ 처음 보기" }], (k) => (k === "top" ? S.topView() : S.home())) : null;
  await ask(3, async () => { if (S) { S.topView(); await ctx.wait(1400); } }, cfg.q3.choices, cfg.q3.correct, cfg.q3.praise);
  tools2?.remove();
  await ctx.next("다음");
}
const shapeBtn = (svg, name) => ({ art: `<svg width="70" height="70" viewBox="-40 -40 80 80">${svg}</svg>`, name });
async function p36(ctx) {
  await observe(ctx, "36", { kind: "cube", color: "#f2475a" }, { kind: "cylinder", color: "#2f6fe0" }, {
    family: "정육면체와 원기둥은 위아래가 똑같이 생긴 기둥 모양이에요.",
    q1run: async (S) => { if (S) await Promise.all([S.roll(S.objects[0]), S.roll(S.objects[1])]); },
    q1: { choices: [{ value: "cube", art: solidIcon("cube", "#f2475a", 70), name: "정육면체" }, { value: "cyl", art: solidIcon("cylinder", "#2f6fe0", 70), name: "원기둥" }], correct: "cyl", praise: "맞아요! 원기둥은 눕히면 데굴데굴 잘 굴러가요." },
    q2: { choices: [{ value: "both", art: "⭕", name: "둘 다 올릴 수 있어요" }, { value: "none", art: "❌", name: "올릴 수 없어요" }], correct: "both", praise: "맞아요! 윗면이 평평해서 둘 다 올릴 수 있어요." },
    q3: { choices: [{ value: "a", ...shapeBtn(`<rect x="-36" y="-14" width="30" height="30" fill="#f2475a"/><circle cx="20" cy="1" r="16" fill="#2f6fe0"/>`, "네모와 동그라미") }, { value: "b", ...shapeBtn(`<polygon points="0,-28 28,22 -28,22" fill="#9aa6b8"/>`, "세모") }], correct: "a", praise: "맞아요! 위에서 보면 정육면체는 네모, 원기둥은 동그라미예요." }
  });
}
async function p37(ctx) {
  await observe(ctx, "37", { kind: "sqPyramid", color: "#f2475a" }, { kind: "cone", color: "#ffd23f" }, {
    family: "사각뿔과 원뿔은 위로 갈수록 뾰족해지는 뿔 모양이에요.",
    q1: { choices: [{ value: "pillar", art: solidIcon("cylinder", "#2f6fe0", 64), name: "기둥 모양" }, { value: "cone", art: solidIcon("cone", "#ffd23f", 64), name: "뿔 모양" }, { value: "ball", art: solidIcon("sphere", "#7bd36a", 64), name: "공 모양" }], correct: "cone", praise: "맞아요! 위쪽이 뾰족한 모양을 뿔 모양이라고 해요." },
    q2: { choices: [{ value: "both", art: "⭕", name: "올릴 수 있어요" }, { value: "none", art: "❌", name: "올릴 수 없어요" }], correct: "none", praise: "맞아요! 위가 뾰족해서 올려놓으면 미끄러져 떨어져요." },
    q3: { choices: [{ value: "a", ...shapeBtn(`<rect x="-36" y="-14" width="30" height="30" fill="#f2475a"/><path d="M-36 -14 L-6 16 M-6 -14 L-36 16" stroke="#fff" stroke-width="2"/><circle cx="20" cy="1" r="16" fill="#ffd23f"/><circle cx="20" cy="1" r="2.5" fill="#25324a"/>`, "네모와 동그라미") }, { value: "b", ...shapeBtn(`<polygon points="0,-28 28,22 -28,22" fill="#9aa6b8"/>`, "세모") }], correct: "a", praise: "맞아요! 위에서 보면 사각뿔은 네모, 원뿔은 동그라미예요. 가운데에 뾰족한 점이 보여요." }
  });
}

// ── 38 수수께끼 ──
const SET = [["cube", "#f2475a", "정육면체"], ["cylinder", "#2f6fe0", "원기둥"], ["cone", "#ffd23f", "원뿔"], ["sqPyramid", "#f08a3c", "사각뿔"], ["sphere", "#7bd36a", "공"], ["triPrism", "#b28cf0", "삼각기둥"]];
const pick = (k) => { const s = SET.find((x) => x[0] === k); return { value: k, art: solidIcon(k, s[1], 66), name: s[2] }; };
async function p38(ctx) {
  const pg = await ctx.source("38");
  const Q = [
    [pg?.bubbles?.[0] || "기둥 모양이고 잘 굴러가는 입체도형은?", "cylinder"],
    ["뿔 모양이고 잘 굴러가는 입체도형은?", "cone"],
    ["어느 쪽으로 굴려도 잘 굴러가는 공 모양은?", "sphere"],
    ["기둥 모양이고 위에서 보면 세모인 입체도형은?", "triPrism"]
  ];
  let score = 0;
  for (const [q, a] of Q) {
    scene(ctx, "0 0 900 200", `<rect x="40" y="20" width="820" height="160" rx="30" fill="#fffbe0" stroke="#e6c84a" stroke-width="3"/><foreignObject x="60" y="30" width="780" height="140"><div xmlns="http://www.w3.org/1999/xhtml" style="height:140px;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:800;color:#25324a;text-align:center">${q}</div></foreignObject>${T(850, 50, `${score}점`, { size: 26, fill: "#2fb67c", anchor: "end" })}`);
    await ctx.guide.say(q);
    let first = true; const orig = ctx.mistake; ctx.mistake = () => { first = false; orig(); };
    await ctx.choose(SET.map(([k]) => pick(k)), { correct: a, wrongSay: "설명을 다시 들어 볼까요? 기둥인지 뿔인지 공인지 생각해요." });
    ctx.mistake = orig;
    if (first) { score++; ctx.fx.sound.good(); await ctx.guide.praise("맞혔어요! 1점!"); } else await ctx.guide.praise("맞아요!");
  }
  await ctx.next("다음");
}

// ── 39 기둥/뿔/공 모양으로 나누기 ──
async function p39(ctx) {
  const pg = await ctx.source("39");
  const bub = pg?.bubbles || ["기둥 모양을 찾아봐.", "뿔 모양을 모두 찾아봐.", "공처럼 생긴 공 모양을 찾아봐."];
  const items = [["cube", "#f2475a", "pillar"], ["cone", "#ffd23f", "cone"], ["cylinder", "#2f6fe0", "pillar"], ["sphere", "#7bd36a", "ball"], ["sqPyramid", "#f08a3c", "cone"], ["hexPrism", "#b28cf0", "pillar"], ["triPyramid", "#ff8fbf", "cone"], ["cuboid", "#7fd0f0", "pillar"]];
  const rows = [["pillar", "개구리", bub[0]], ["cone", "펭귄", bub[1]], ["ball", "코알라", bub[2]]];
  const svg = scene(ctx, "0 0 960 560", `${rows.map(([bin, who, t], i) => `<g class="sb-bin nm-hit" data-bin="${bin}"><rect x="20" y="${20 + i * 140}" width="660" height="120" rx="18" fill="#fff" stroke="#f0b8c8" stroke-width="3"/><g transform="translate(70 ${80 + i * 140})">${FACE[who]}</g><foreignObject x="110" y="${30 + i * 140}" width="170" height="100"><div xmlns="http://www.w3.org/1999/xhtml" style="height:100px;display:flex;align-items:center;font-size:18px;font-weight:800;color:#25324a">${t}</div></foreignObject></g>`).join("")}
    ${items.map(([k, c], i) => `<g class="sb-item nm-hit" data-k="i${i}" transform="translate(${740 + (i % 2) * 110} ${60 + Math.floor(i / 2) * 120}) scale(.9)">${solidArt(k, c)}</g>`).join("")}`);
  await sortToBins(ctx, svg, items.map(([, , bin], i) => ({ k: `i${i}`, bin })), { placeAt: (bin, n) => [330 + n * 85, 80 + ["pillar", "cone", "ball"].indexOf(bin) * 140], say: "입체도형을 누르고, 알맞은 친구의 줄을 눌러요!", wrongSay: "위가 뾰족하면 뿔, 둥글면 공, 위아래가 같으면 기둥 모양이에요." });
  await ctx.guide.praise("기둥 모양, 뿔 모양, 공 모양으로 모두 나누었어요!");
  await ctx.next("다음");
}

// ── 40 똑같이 쌓기 ──
async function p40(ctx) {
  await ctx.source("40");
  const host = stage3d(ctx);
  const S = createSolidStage(host, { items: [{ kind: "board", color: "#7fb2e8", x: 0 }] });
  ctx.onDispose(() => S?.dispose());
  if (S) { S.add("cylinder", "#2fa35a", { y: 0.18, s: 0.7 }); S.add("disc", "#ffd23f", { y: 0.18 + 0.7, s: 1.0 }); S.add("cube", "#ff8a3c", { y: 0.18 + 0.7 + 0.16, s: 0.45 }); }
  ctx.guide.say("보영이가 쌓은 모양이에요. 어떤 입체도형이 필요할까요?");
  await chooseAll(ctx, [["cylinder", "#2fa35a", "원기둥"], ["disc", "#ffd23f", "원판"], ["cone", "#f2475a", "원뿔"], ["board", "#7fb2e8", "판"], ["pencil", "#b28cf0", "연필 모양"], ["cube", "#ff8a3c", "정육면체"]].map(([k, c, n]) => ({ value: k, art: solidIcon(k, c, 64), name: n })), ["cylinder", "disc", "board", "cube"],
    { say: "필요한 입체도형을 모두 누르고, 다 골랐으면 아래 단추를 눌러요!", wrongSay: "쌓은 모양을 아래부터 하나씩 봐요." });
  await ctx.guide.praise("판, 원기둥, 원판, 정육면체가 필요해요!");
  await ctx.next("다음");
}

// ── 41 기억하여 쌓기 ──
const BUILDS = [
  [["cube", "#f2475a", 0, 1], ["cylinder", "#2f6fe0", 1, 0.8], ["hemi", "#ffd23f", 1.8, 0.9]],
  [["board", "#7fb2e8", 0, 1], ["cube", "#7bd36a", 0.18, 0.7], ["sqPyramid", "#f08a3c", 0.88, 0.7]],
  [["cylinder", "#b28cf0", 0, 0.9], ["disc", "#ffd23f", 0.9, 0.9], ["cone", "#f2475a", 1.04, 0.7]]
];
const MEM_SET = [["cube", "#f2475a"], ["cylinder", "#2f6fe0"], ["hemi", "#ffd23f"], ["board", "#7fb2e8"], ["sqPyramid", "#f08a3c"], ["disc", "#ffd23f"], ["cone", "#f2475a"], ["sphere", "#7bd36a"]];
async function p41(ctx) {
  await ctx.source("41");
  let score = 0;
  for (const [i, b] of BUILDS.entries()) {
    const host = stage3d(ctx);
    const S = createSolidStage(host, {});
    if (S) for (const [k, c, y, s] of b) S.add(k, c, { y, s });
    ctx.dock.innerHTML = `<p class="sm-docknote">👀 쌓은 모양을 잘 기억해요! (${score}점)</p>`;
    await ctx.guide.say(i === 0 ? "독쌤이 쌓은 모양이에요. 잘 보고 기억해요! 곧 가림판으로 가릴게요." : "새 모양이에요. 잘 기억해요!");
    await ctx.wait(3500);
    S?.dispose();
    ctx.stage.innerHTML = `<div style="position:absolute;inset:8%;border-radius:24px;background:repeating-linear-gradient(45deg,#c8955f 0 18px,#b5834f 18px 36px);display:grid;place-items:center;font-size:40px;font-weight:900;color:#fff">가림판</div>`;
    let first = true; const orig = ctx.mistake; ctx.mistake = () => { first = false; orig(); };
    await chooseAll(ctx, MEM_SET.map(([k, c]) => ({ value: k, art: solidIcon(k, c, 60) })), b.map((x) => x[0]), { say: "어떤 입체도형으로 쌓았는지 모두 골라요!", wrongSay: "기억을 떠올려 봐요. 아래부터 차례로 생각해요." });
    ctx.mistake = orig;
    if (first) { score += 10; ctx.fx.sound.good(); await ctx.guide.praise("모두 맞혔어요! 10점!"); } else await ctx.guide.praise("맞아요!");
  }
  await ctx.next("끝");
}

export const LESSON = {
  title: "입체도형 관찰하기",
  subtitle: "굴려 보고, 올려 보고, 위에서 보며 기둥·뿔·공 모양을 알아봐요",
  coverArt: "🧊",
  doneTitle: "입체도형 2차시 끝!",
  doneText: "기둥 모양은 위가 평평하고, 뿔 모양은 위가 뾰족하고, 공 모양은 어느 쪽으로나 잘 굴러가요.",
  steps: [
    { page: "36쪽", run: p36 },
    { page: "37쪽", run: p37 },
    { page: "38쪽 · 활동", run: p38 },
    { page: "39쪽", run: p39 },
    { page: "40쪽", run: p40 },
    { page: "41쪽 · 활동", run: p41 }
  ]
};
void onHit;
