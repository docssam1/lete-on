// A1-2 1단원 도형 마을 · 1차시 (원본 8~13쪽)
//  8 소마 나라 세 마을(호호 = 동그라미, 송송 = 세모, 토토 = 네모) · 9 도형과 마을 잇기(세모→송송, 네모→토토, 동그라미→호호)
//  10 이사 온 도형(빨간 사다리꼴·초록 직각삼각형·주황 동그라미) · 11·12 도형 스티커를 마을에 붙이기 + 동그라미·세모·네모 뜻
//  13 이사 온 도형과 마을 잇기. 도형 스티커(A1-2-1)는 책에 없는 스티커지라 여러 모양 도형을 코드로 그렸다.
import { scene, onHit, matchLines } from "../numbers.js?v=20261117a";
import { shape, shapeFriend, villageArt, VILLAGE, FAMILY, sortToBins } from "../shapes.js?v=20261117a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;
const KEYS = ["round", "tri", "quad"];
const somaSign = (x, y) => `<rect x="${x - 70}" y="${y - 26}" width="140" height="52" rx="8" fill="#c8955f" stroke="#7a4a22" stroke-width="3"/>${T(x, y + 10, "소마 나라", { size: 28, fill: "#fff", weight: 900 })}`;

// 8쪽: 세 마을 둘러보기
const ABOUT = { round: "호호 마을에는 동그란 도형들이 살아요.", tri: "송송 마을에는 세모난 도형들이 살아요.", quad: "토토 마을에는 네모난 도형들이 살아요." };
async function p8(ctx) {
  await ctx.source("8");
  const svg = scene(ctx, "0 0 960 520", `<rect width="960" height="520" fill="#dff3ff"/><path d="M0 330 Q240 250 480 300 T960 280 V520 H0Z" fill="#c7ec9e"/>
    <g class="nm-hit vl" data-k="tri">${villageArt("tri", 480, 210, 300)}</g><g class="nm-hit vl" data-k="round">${villageArt("round", 190, 330, 300)}</g><g class="nm-hit vl" data-k="quad">${villageArt("quad", 770, 330, 300)}</g>${somaSign(480, 470)}`);
  ctx.guide.say("마을을 하나씩 눌러서 어떤 도형들이 사는지 알아봐요!");
  const seen = new Set();
  await new Promise((r) => { const off = onHit(svg, ".vl", (el) => { const k = el.dataset.k; ctx.fx.sound.pop(); ctx.fx.burstAt(el, { power: 0.5 }); ctx.guide.say(ABOUT[k]); seen.add(k); if (seen.size === 3) { off(); r(); } }); });
  await ctx.wait(1800);
  await ctx.next("다음");
}

// 9·13쪽: 도형 → 마을 잇기
const villageBox = (k, x, y) => villageArt(k, x + 90, y + 6, 170, { sign: true });
async function matchToVillage(ctx, shapes, say) {
  const L = shapes.map((s, i) => ({ id: s.id, x: 150, y: 90 + i * 150, html: shapeFriend(s.kind, 100, 90 + i * 150, 92, s.fill, s.rot || 0) }));
  const R = KEYS.map((k, i) => ({ id: k, x: 700, y: 90 + i * 150, html: villageBox(k, 700, 90 + i * 150) }));
  await matchLines(ctx, { vb: "0 0 900 470", left: L, right: R, pairs: Object.fromEntries(shapes.map((s) => [s.id, s.v])), dx: 70, say, wrongSay: "곧은 선이 몇 개인지 세어 봐요. 동그란지도 봐요." });
}
async function p9(ctx) {
  await ctx.source("9");
  await matchToVillage(ctx, [{ id: "a", kind: "tri", fill: "#ffc2d6", v: "tri" }, { id: "b", kind: "rect", fill: "#b6d65a", v: "quad" }, { id: "c", kind: "circle", fill: "#4a7fd0", v: "round" }], "도형을 누르고, 그 도형이 사는 마을을 눌러 이어요!");
  await ctx.guide.praise("모양이 비슷한 도형끼리 한 마을에 살아요!");
  await ctx.next("다음");
}

// 10쪽: 이사 온 도형 세 친구를 마을로 보내기
const NEW = [{ k: "trap", kind: "trap", fill: "#f2475a", bin: "quad" }, { k: "rtri", kind: "rtri", fill: "#2fa35a", bin: "tri" }, { k: "circ", kind: "circle", fill: "#ff9a3c", bin: "round" }];
function townScene(extra = "") {
  return `<rect width="960" height="560" fill="#dff3ff"/><path d="M0 300 Q240 230 480 270 T960 260 V560 H0Z" fill="#c7ec9e"/>
    <g class="sb-bin nm-hit" data-bin="round">${villageArt("round", 170, 220, 280)}</g><g class="sb-bin nm-hit" data-bin="tri">${villageArt("tri", 480, 170, 280)}</g><g class="sb-bin nm-hit" data-bin="quad">${villageArt("quad", 790, 220, 280)}</g>${extra}`;
}
const binSpot = { round: [210, 170], tri: [520, 120], quad: [830, 170] };
async function p10(ctx) {
  await ctx.source("10");
  const svg = scene(ctx, "0 0 960 560", townScene(NEW.map((n, i) => `<g class="sb-item nm-hit" data-k="${n.k}">${shapeFriend(n.kind, 280 + i * 200, 450, 100, n.fill)}</g>`).join("")));
  await sortToBins(ctx, svg, NEW, { placeAt: (bin, n) => [binSpot[bin][0] + n * 40, binSpot[bin][1] + 40], say: "새 친구를 누르고, 살아야 할 마을을 눌러요!", wrongSay: "그 마을이 아니에요. 동그란지, 곧은 선이 몇 개인지 봐요." });
  await ctx.guide.praise("사다리꼴은 토토 마을, 뾰족한 세모는 송송 마을, 동그라미는 호호 마을이에요!");
  await ctx.next("다음");
}

// 11·12쪽: 도형 스티커 붙이기 — 마을마다 그 모양 도형을 모두 찾는다
const STICKERS = [
  ["circle", "#ff6b6b", 0], ["tri", "#5aa0f0", 0], ["square", "#ffd23f", 0], ["oval", "#ff9ec7", 0], ["rtri", "#7bd36a", 0], ["trap", "#b28cf0", 0],
  ["circle", "#7bd36a", 0], ["para", "#ffa94d", 0], ["tri", "#ff9ec7", 180], ["rect", "#5aa0f0", 0], ["rtri", "#ffa94d", 90], ["rhombus", "#ff6b6b", 0]
].map(([kind, fill, rot], i) => ({ k: `s${i}`, kind, fill, rot, fam: FAMILY[kind] }));
async function stickerRound(ctx, fam, panelText) {
  if (panelText) { ctx.setSource(panelText); await ctx.guide.say(panelText, { display: false }); }
  const svg = scene(ctx, "0 0 960 520", `<rect x="0" y="0" width="420" height="520" rx="20" fill="#eef9e6"/>${villageArt(fam, 210, 260, 380)}
    <rect x="450" y="10" width="500" height="500" rx="20" fill="#fff" stroke="#d6dbe3" stroke-width="3"/>${T(700, 50, "도형 스티커", { size: 24, fill: "#4a5a78" })}
    ${STICKERS.map((s, i) => `<g class="nm-hit st" data-k="${s.k}">${shape(s.kind, 540 + (i % 4) * 110, 130 + Math.floor(i / 4) * 130, 84, { fill: s.fill, rot: s.rot, stroke: "#fff", sw: 4 })}</g>`).join("")}`);
  const want = STICKERS.filter((s) => s.fam === fam); let got = 0;
  ctx.guide.say(fam === "round" ? "동그란 도형 스티커를 모두 찾아 눌러요!" : fam === "tri" ? "세모난 도형 스티커를 모두 찾아 눌러요!" : "네모난 도형 스티커를 모두 찾아 눌러요!");
  await new Promise((r) => {
    const off = onHit(svg, ".st", (el) => {
      const s = STICKERS.find((x) => x.k === el.dataset.k);
      if (s.fam !== fam) { ctx.mistake(); ctx.fx.sound.bad(); el.classList.remove("nm-no"); void el.getBoundingClientRect(); el.classList.add("nm-no"); ctx.guide.encourage(fam === "round" ? "그건 곧은 선이 있어요. 동그란 것만 찾아요." : fam === "tri" ? "곧은 선이 3개인 것만 찾아요." : "곧은 선이 4개인 것만 찾아요."); return; }
      const bb = el.getBBox(), cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2, tx = 110 + got * 70, ty = 420;
      el.classList.remove("nm-hit", "st"); el.style.transformBox = "view-box"; el.style.transformOrigin = `${cx}px ${cy}px`; el.style.transition = "transform .5s cubic-bezier(.3,1.4,.5,1)"; el.style.transform = `translate(${tx - cx}px, ${ty - cy}px) scale(.62)`;
      got++; ctx.fx.sound.pop();
      if (got === want.length) { off(); r(); }
    });
  });
  ctx.fx.cheer(null, { big: true });
}
async function p11(ctx) {
  const pg = await ctx.source("11", { read: false });
  await stickerRound(ctx, "round", pg?.text || null);
  await ctx.guide.praise("호호 마을에 동그란 친구들이 모였어요!");
  await stickerRound(ctx, "tri", pg?.text2 || null);
  await ctx.guide.praise("송송 마을에 세모난 친구들이 모였어요!");
  await ctx.next("다음");
}
async function p12(ctx) {
  const pg = await ctx.source("12", { read: false });
  await stickerRound(ctx, "quad", pg?.text || null);
  await ctx.guide.praise("토토 마을에 네모난 친구들이 모였어요!");
  // 동그라미·세모·네모의 뜻(원본 말풍선 그대로)
  const bub = pg?.bubbles || [];
  scene(ctx, "0 0 960 440", ["circle", "tri", "square"].map((k, i) => `${shapeFriend(k, 160 + i * 320, 330, 110, ["#ff9a3c", "#4a90e2", "#ff8fbf"][i])}
    <rect x="${30 + i * 320}" y="20" width="260" height="190" rx="24" fill="#fffbe0" stroke="#e6c84a" stroke-width="3"/><foreignObject x="${45 + i * 320}" y="30" width="230" height="170"><div xmlns="http://www.w3.org/1999/xhtml" style="height:170px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:21px;font-weight:700;line-height:1.4;color:#25324a">${(bub[i] || "").replace(/[&<>]/g, "")}</div></foreignObject>`).join(""));
  for (const b of bub) await ctx.guide.say(b);
  await ctx.next("다음");
}
async function p13(ctx) {
  await ctx.source("13");
  await matchToVillage(ctx, [{ id: "a", kind: "trap", fill: "#f2475a", v: "quad" }, { id: "b", kind: "rtri", fill: "#2fa35a", v: "tri" }, { id: "c", kind: "circle", fill: "#ff9a3c", v: "round" }], "이사 온 도형과 살 마을을 선으로 이어요!");
  await ctx.guide.praise("모두 알맞은 마을을 찾았어요!");
  await ctx.next("끝");
}

export const LESSON = {
  title: "도형 마을",
  subtitle: "동그라미·세모·네모 마을에 도형 친구들을 보내요",
  coverArt: "🔺",
  doneTitle: "도형 마을 1차시 끝!",
  doneText: "동그란 모양은 동그라미, 곧은 선 3개는 세모, 곧은 선 4개는 네모예요.",
  steps: [
    { page: "8쪽 · 커지는 생각", run: p8 },
    { page: "9쪽", run: p9 },
    { page: "10쪽", run: p10 },
    { page: "11쪽", run: p11 },
    { page: "12쪽", run: p12 },
    { page: "13쪽", run: p13 }
  ]
};
void VILLAGE;
