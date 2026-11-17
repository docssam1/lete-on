// A1-2 2단원 입체도형 · 3차시 (원본 42~50쪽) — 푸리수리 1~8 + 창의력 Game 「주사위 만들기」
//  42 구→수박, 정육면체→주사위, 원기둥→통조림 · 43 정육면체→선물 상자, 원기둥→양초, 구→축구공
//  44 다른 하나(주사위·지구본·고깔모자) · 45 규칙 색칠(기둥 파랑·뿔 노랑·공 초록) · 46 기둥→①, 뿔→③ · 47 공 모양 → 노란 구
//  48 필요한 것 모두(사각뿔·정육면체·원기둥·판) · 49 주어진 도형을 모두 쓴 모양 → ③ · 50 펼친 그림을 접어 주사위 만들기
import { scene, onHit, matchLines } from "../numbers.js?v=20261117a";
import { solidArt, solidIcon, objIcon, OBJ_PIC, chooseAll, paintByRule } from "../shapes.js?v=20261117a";
import { createSolidStage, createCubeNet, createTetraNet, solidTools } from "../solids3d.js?v=20261117a";
import { kid } from "../art.js?v=20261117a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;
const stage3d = (ctx) => { ctx.stage.innerHTML = `<div style="position:absolute;inset:0"></div>`; return ctx.stage.firstElementChild; };

async function p42(ctx) {
  await ctx.source("42");
  const L = [["sphere", "#ffd6e6", "a"], ["cube", "#fff3b0", "b"], ["disc", "#d6f5c4", "c"]].map(([k, c, id], i) => ({ id, x: 220, y: 90 + i * 150, html: `<g transform="translate(150 ${90 + i * 150}) scale(1.1)">${solidArt(k, c)}</g>` }));
  const R = [["tomatoCan", "c"], ["dicePink", "b"], ["watermelon", "a"]].map(([o, id], i) => ({ id: `r${i}`, ans: id, x: 650, y: 90 + i * 150, html: `<g transform="translate(730 ${90 + i * 150}) scale(1.1)">${OBJ_PIC[o]}</g>` }));
  await matchLines(ctx, { vb: "0 0 900 470", left: L, right: R, pairs: { a: "r2", b: "r1", c: "r0" }, dx: 70, say: "비슷한 모양끼리 선으로 이어요!", wrongSay: "둥근지, 네모난지, 기둥 모양인지 봐요." });
  await ctx.guide.praise("구는 수박, 정육면체는 주사위, 원기둥은 통조림과 비슷해요!");
  await ctx.next("다음");
}
async function p43(ctx) {
  await ctx.source("43");
  const P = [["cube", "#f2475a", ["basketball", "box", "pyramid"], "box"], ["cylinder", "#2f6fe0", ["eraser", "apple", "candle"], "candle"], ["sphere", "#ffd23f", ["box", "cone", "sphere"], "sphere"]];
  for (const [i, [k, c, opts, ans]] of P.entries()) {
    scene(ctx, "0 0 900 220", `${T(20, 40, `(${i + 1})`, { size: 26, fill: "#4a5a78", anchor: "start" })}<rect x="370" y="20" width="160" height="180" rx="18" fill="#fff0f4"/><g transform="translate(450 110) scale(1.5)">${solidArt(k, c)}</g>`);
    ctx.guide.say("왼쪽 입체도형과 비슷한 모양을 찾아 눌러요.");
    await ctx.choose(opts.map((o) => ({ value: o, art: objIcon(o, 86), name: "" })), { correct: ans, wrongSay: "모양을 다시 비교해 봐요.", praise: "맞아요! 모양이 비슷해요." });
    await ctx.wait(300);
  }
  await ctx.next("다음");
}
async function p44(ctx) {
  await ctx.source("44");
  const P = [[["sphere", "baseball", "dicePink", "watermelon"], "dicePink", "나머지는 모두 공 모양이에요."], [["tomatoCan", "glue", "candle", "globe"], "globe", "나머지는 모두 기둥 모양이에요."], [["cone", "cube", "brick", "box"], "cone", "나머지는 모두 상자 모양이에요."]];
  for (const [i, [opts, ans, why]] of P.entries()) {
    scene(ctx, "0 0 900 120", `${T(20, 70, `(${i + 1})`, { size: 28, fill: "#4a5a78", anchor: "start" })}<rect x="100" y="10" width="760" height="100" rx="16" fill="#fffbea" stroke="#f0d070" stroke-width="3"/>`);
    ctx.guide.say("다른 모양 하나를 찾아 눌러요.");
    await ctx.choose(opts.map((o) => ({ value: o, art: objIcon(o, 84), name: "" })), { correct: ans, wrongSay: "공 모양, 기둥 모양, 상자 모양 중 무엇인지 봐요.", praise: "맞아요! 그것만 모양이 달라요." });
    await ctx.guide.say(why);
    await ctx.wait(300);
  }
  await ctx.next("다음");
}
// 45 선 그림(흰색)을 규칙대로 색칠
async function p45(ctx) {
  await ctx.source("45");
  const S = [["cone", "y"], ["cube", "b"], ["sphere", "g"], ["hexPrism", "b"], ["cylinder", "b"], ["sqPyramid", "y"]];
  const svg = scene(ctx, "0 0 900 440", S.map(([k], i) => `<g class="nm-hit sp-item" data-k="s${i}" transform="translate(${170 + (i % 3) * 280} ${120 + Math.floor(i / 3) * 210}) scale(1.6)"><g data-paint-grp>${solidArt(k, "#ffffff")}</g></g>`).join(""));
  // 흰 선 그림의 면에 색을 칠할 수 있게 data-paint 표시
  svg.querySelectorAll("[data-paint-grp] path, [data-paint-grp] circle, [data-paint-grp] ellipse").forEach((el) => { if (el.getAttribute("fill") !== "none" && el.getAttribute("opacity") == null) el.setAttribute("data-paint", ""); el.setAttribute("stroke", "#25324a"); });
  await paintByRule(ctx, svg, S.map(([, w], i) => ({ k: `s${i}`, want: w })), [{ key: "b", color: "#4a90e2", name: "기둥 모양" }, { key: "y", color: "#ffd23f", name: "뿔 모양" }, { key: "g", color: "#5ec04e", name: "공 모양" }],
    { say: "규칙: 기둥 모양은 파란색, 뿔 모양은 노란색, 공 모양은 초록색! 색을 고르고 도형을 눌러요.", wrongSay: "위가 뾰족하면 뿔, 둥글면 공, 위아래가 같으면 기둥 모양이에요." });
  await ctx.guide.praise("규칙대로 모두 색칠했어요!");
  await ctx.next("다음");
}
async function p46(ctx) {
  const pg = await ctx.source("46");
  const bub = pg?.bubbles || ["기둥 모양이에요!", "뿔 모양이에요!"];
  scene(ctx, "0 0 900 260", `<rect x="150" y="20" width="600" height="200" rx="16" fill="#fff" stroke="#c9cfd8" stroke-width="3"/>${[["cube", "#f2475a"], ["sphere", "#ffd23f"], ["sqPyramid", "#f2475a"]].map(([k, c], i) => `<g transform="translate(${270 + i * 180} 110) scale(1.3)">${solidArt(k, c)}</g>${T(270 + i * 180, 205, ["①", "②", "③"][i], { size: 26 })}`).join("")}`);
  for (const [i, b] of bub.entries()) {
    ctx.dock.innerHTML = `<div class="u2-ask"><div class="u2-bub">${kid({ hair: i ? "bob" : "girl", hairColor: "#5a3a2a", shirt: i ? "#ffd84a" : "#c0564b", dress: true, size: 50 })}<span>${b}</span></div></div><div class="sm-tray" data-c></div>`;
    await ctx.guide.say(b);
    await ctx.choose(["①", "②", "③"].map((n, j) => ({ value: String(j + 1), art: n, name: "" })), { correct: i ? "3" : "1", host: ctx.dock.querySelector("[data-c]"), wrongSay: "친구가 말한 모양을 찾아봐요.", praise: i ? "맞아요! ③ 사각뿔은 뿔 모양이에요." : "맞아요! ① 정육면체는 기둥 모양이에요." });
    await ctx.wait(300);
  }
  await ctx.next("다음");
}
async function p47(ctx) {
  await ctx.source("47");
  const svg = scene(ctx, "0 0 900 500", `<rect width="900" height="500" fill="#bfe6ff"/><path d="M0 260 Q450 160 900 260 V500 H0Z" fill="#7fce6a"/><ellipse cx="450" cy="330" rx="200" ry="80" fill="none" stroke="#c8f0b0" stroke-width="10"/>
    <g transform="translate(380 230)">${kid({ hair: "boy", shirt: "#8a9a3c", size: 90 })}</g><g transform="translate(470 230)">${kid({ hair: "girl", shirt: "#f2786b", dress: true, size: 90 })}</g>
    <rect x="80" y="400" width="190" height="56" rx="8" fill="#c8955f" stroke="#7a4a22" stroke-width="3"/>${T(175, 437, "입체도형 나라", { size: 24, fill: "#fff" })}
    ${[["triPrism", "#4a7fd0", 150, 130], ["sqPyramid", "#f2475a", 760, 140], ["sphere", "#ffd23f", 760, 380]].map(([k, c, x, y]) => `<g class="nm-hit ball" data-k="${k}"><circle cx="${x}" cy="${y}" r="88" fill="#fff" stroke="#f05a8a" stroke-width="6"/><g transform="translate(${x} ${y}) scale(1.6)">${solidArt(k, c)}</g></g>`).join("")}`);
  ctx.guide.say("공 모양을 찾아 눌러요!");
  await new Promise((r) => { const off = onHit(svg, ".ball", (el) => { if (el.dataset.k === "sphere") { off(); ctx.fx.cheer(el); r(); } else { ctx.mistake(); ctx.fx.sound.bad(); el.classList.remove("nm-no"); void el.getBoundingClientRect(); el.classList.add("nm-no"); ctx.guide.encourage("어느 쪽으로나 데굴데굴 굴러가는 모양을 찾아요."); } }); });
  await ctx.guide.praise("맞아요! 노란 공이 공 모양이에요.");
  await ctx.next("다음");
}
async function p48(ctx) {
  await ctx.source("48");
  const S = createSolidStage(stage3d(ctx), { items: [{ kind: "board", color: "#f2785a", x: 0 }] });
  ctx.onDispose(() => S?.dispose());
  if (S) { S.add("cube", "#9be08a", { x: -0.45, y: 0.18, s: 0.6 }); S.add("sqPyramid", "#4a7fd0", { x: -0.45, y: 0.78, s: 0.6 }); S.add("cylinder", "#ffd23f", { x: 0.5, y: 0.18, s: 0.55 }); }
  ctx.guide.say("이 모양을 똑같이 쌓으려면 어떤 입체도형이 필요할까요?");
  await chooseAll(ctx, [["sqPyramid", "#4a7fd0", "사각뿔"], ["hexPrism", "#b28cf0", "육각기둥"], ["cube", "#9be08a", "정육면체"], ["board", "#f2785a", "판"], ["sphere", "#ffd23f", "공"], ["cylinder", "#ffd23f", "원기둥"]].map(([k, c, n]) => ({ value: k, art: solidIcon(k, c, 62), name: n })), ["sqPyramid", "cube", "board", "cylinder"],
    { say: "필요한 입체도형을 모두 누르고, 아래 단추를 눌러요!", wrongSay: "쌓은 모양을 아래부터 하나씩 봐요." });
  await ctx.guide.praise("판, 정육면체, 사각뿔, 원기둥이 필요해요!");
  await ctx.next("다음");
}
// 49 주어진 도형(정육면체·판·사각뿔)을 모두 쓴 모양
const BUILD49 = [
  [["cylinder", "#ffb3c8", 0, 0, 0.6], ["board", "#ffa94d", 0, 0.6, 0.8], ["sqPyramid", "#7fd0f0", 0, 0.75, 0.6]],
  [["board", "#ffa94d", 0, 0, 0.8], ["cylinder", "#b28cf0", -0.3, 0.15, 0.45], ["cone", "#b6c8f0", -0.3, 0.6, 0.45], ["cuboid", "#9be08a", 0.35, 0.15, 0.35]],
  [["board", "#ffa94d", 0, 0, 0.8], ["cube", "#b8a8e8", 0, 0.15, 0.5], ["sqPyramid", "#7fd0f0", 0, 0.65, 0.5]],
  [["cylinder", "#ffb3c8", -0.3, 0, 0.5], ["cuboid", "#9be08a", 0.3, 0, 0.36], ["board", "#ffa94d", 0, 0.5, 0.8], ["cone", "#b6c8f0", 0, 0.65, 0.45]]
];
async function p49(ctx) {
  await ctx.source("49");
  const host = stage3d(ctx);
  const S = createSolidStage(host, { theta: 0.35 });
  ctx.onDispose(() => S?.dispose());
  if (S) BUILD49.forEach((b, i) => { const ox = (i - 1.5) * 2.4; for (const [k, c, x, y, s] of b) S.add(k, c, { x: ox + x, y, s }); });
  const lbl = document.createElement("div"); lbl.style.cssText = "position:absolute;left:0;right:0;bottom:6px;display:flex;justify-content:space-around;font-size:28px;font-weight:900;color:#25324a;pointer-events:none"; lbl.innerHTML = "<span>①</span><span>②</span><span>③</span><span>④</span>"; host.append(lbl);
  ctx.dock.innerHTML = `<div class="u2-ask"><div class="u2-bub">주어진 도형: ${solidIcon("cube", "#b8a8e8", 44)}${solidIcon("board", "#ffa94d", 44)}${solidIcon("sqPyramid", "#7fd0f0", 44)}</div></div><div class="sm-tray" data-c></div>`;
  await ctx.guide.say("정육면체, 판, 사각뿔을 모두 써서 만든 모양을 골라요.");
  await ctx.choose(["①", "②", "③", "④"].map((n, i) => ({ value: String(i + 1), art: n, name: "" })), { correct: "3", host: ctx.dock.querySelector("[data-c]"), wrongSay: "다른 도형이 섞이지 않고, 세 가지를 모두 쓴 모양을 찾아요.", praise: "맞아요! ③은 판 위에 정육면체와 사각뿔을 쌓았어요." });
  await ctx.next("다음");
}

// 50 주사위 만들기
async function p50(ctx) {
  await ctx.source("50");
  for (const [i, make] of [createCubeNet, createTetraNet].entries()) {
    const host = stage3d(ctx);
    const N = make(host);
    ctx.dock.innerHTML = "";
    await ctx.guide.say(i === 0 ? "정육면체 주사위의 펼친 그림이에요. 접어서 주사위를 만들어 볼까요?" : "이번엔 세모 4개로 된 정사면체 주사위를 접어 봐요!");
    await ctx.next("접기", { icon: "📦" });
    if (N) await N.fold();
    ctx.fx.sound.good(); ctx.fx.cheer(null, { big: true });
    if (i === 0 && N) { await ctx.guide.praise("정육면체 주사위 완성! 마주 보는 두 면의 점을 더하면 모두 7이에요."); await ctx.next("굴려 보기", { icon: "🎲" }); await N.roll(); }
    else await ctx.guide.praise("정사면체 주사위 완성! 세모 4개로 만들었어요.");
    await ctx.next(i === 0 ? "다음 주사위" : "끝");
    N?.dispose();
  }
}

export const LESSON = {
  title: "푸리수리와 주사위 만들기",
  subtitle: "기둥·뿔·공 모양을 찾고, 펼친 그림을 접어 주사위를 만들어요",
  coverArt: "🎲",
  doneTitle: "입체도형 3차시 끝!",
  doneText: "주변 물건에서 기둥·뿔·공 모양을 찾을 수 있어요. 펼친 그림을 접으면 주사위가 돼요.",
  steps: [
    { page: "42쪽 · 푸리수리 1", run: p42 },
    { page: "43쪽 · 푸리수리 2", run: p43 },
    { page: "44쪽 · 푸리수리 3", run: p44 },
    { page: "45쪽 · 푸리수리 4", run: p45 },
    { page: "46쪽 · 푸리수리 5", run: p46 },
    { page: "47쪽 · 푸리수리 6", run: p47 },
    { page: "48쪽 · 푸리수리 7", run: p48 },
    { page: "49쪽 · 푸리수리 8", run: p49 },
    { page: "50쪽 · 창의력 Game", run: p50 }
  ]
};
void solidTools;
