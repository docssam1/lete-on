// A1-2 2단원 입체도형 · 1차시 (원본 32~35쪽)
//  32·33 피노키오와 제퍼트 할아버지: 나무 조각 12개(막대·작은 원기둥 2·원판·반원기둥 2·작은 직육면체·큰 직육면체·통나무 4)를 조립
//        (피노키오 스티커 A1-2-4는 책에 없는 스티커지라, 조각을 누르면 제자리로 날아가는 조립으로 만들었다)
//  34 토순이의 방 물건 살펴보기 · 35 입체도형과 비슷한 물건 찾기(정육면체→주사위, 삼각기둥→연필꽂이, 원기둥→휴지통,
//     육각기둥→선물 상자, 사각뿔→피라미드, 구→지구본, 원뿔→고깔모자, 반구→스노볼)
import { scene, onHit } from "../numbers.js?v=20261117a";
import { solidArt, solidIcon, OBJ_PIC } from "../shapes.js?v=20261117a";

const T = (x, y, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle" } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${t}</text>`;
const at = (x, y, s, body) => `<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;

// ── 32·33 피노키오 ──
const OL = "#b7b04a", OR = "#f0a060", GR = "#9aa1ad";
// 조각: 처음 자리(더미)와 피노키오에서의 자리, 그림
const PIECES = [
  { k: "body", art: solidArt("cuboid", OL), from: [120, 120, 1.0], to: [640, 300, 1.45], name: "몸통" },
  { k: "head", art: `<path d="M-30 10 A30 30 0 0 1 30 10 L30 18 L-30 18Z" fill="${OL}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><ellipse cx="0" cy="14" rx="30" ry="9" fill="#cfc86a" stroke="rgba(0,0,0,.2)"/>`, from: [240, 120, 1.0], to: [640, 168, 1.35], name: "머리" },
  { k: "hat", art: `<path d="M-26 14 A26 26 0 0 1 26 14Z" fill="${OR}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`, from: [360, 120, 1.0], to: [640, 112, 1.1], name: "모자" },
  { k: "brim", art: solidArt("disc", OR), from: [480, 120, 0.9], to: [640, 130, 1.0], name: "모자 챙" },
  { k: "nose", art: `<rect x="-36" y="-4" width="72" height="8" rx="4" fill="${OL}" stroke="rgba(0,0,0,.25)"/>`, from: [120, 230, 1.0], to: [700, 190, 0.9], name: "코" },
  { k: "eye1", art: solidArt("cylinder", GR), from: [220, 230, 0.4], to: [626, 175, 0.28], name: "눈" },
  { k: "eye2", art: solidArt("cylinder", GR), from: [280, 230, 0.4], to: [656, 175, 0.28], name: "눈" },
  { k: "neck", art: solidArt("cube", OL), from: [360, 230, 0.5], to: [640, 215, 0.42], name: "목" },
  { k: "armL", art: `<path d="M-40 -9 L40 -9 A9 9 0 0 1 40 9 L-40 9Z" fill="${OL}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><ellipse cx="-40" cy="0" rx="5" ry="9" fill="#cfc86a"/>`, from: [470, 230, 0.9], to: [575, 280, 0.9], rot: 70, name: "팔" },
  { k: "armR", art: `<path d="M-40 -9 L40 -9 A9 9 0 0 1 40 9 L-40 9Z" fill="${OL}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><ellipse cx="-40" cy="0" rx="5" ry="9" fill="#cfc86a"/>`, from: [150, 330, 0.9], to: [705, 280, 0.9], rot: -70, name: "팔" },
  { k: "legL", art: `<path d="M-46 -10 L46 -10 A10 10 0 0 1 46 10 L-46 10Z" fill="${OL}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><ellipse cx="-46" cy="0" rx="5" ry="10" fill="#cfc86a"/>`, from: [290, 330, 0.9], to: [620, 420, 0.95], rot: 90, name: "다리" },
  { k: "legR", art: `<path d="M-46 -10 L46 -10 A10 10 0 0 1 46 10 L-46 10Z" fill="${OL}" stroke="rgba(0,0,0,.25)" stroke-width="2"/><ellipse cx="-46" cy="0" rx="5" ry="10" fill="#cfc86a"/>`, from: [430, 330, 0.9], to: [660, 420, 0.95], rot: 90, name: "다리" }
];
async function p32(ctx) {
  await ctx.source("32");
  const svg = scene(ctx, "0 0 900 520", `<rect x="20" y="40" width="530" height="360" rx="20" fill="#fff8e8" stroke="#e6c88a" stroke-width="3"/>${T(285, 30, "나무 조각", { size: 22, fill: "#8a5a32" })}
    <rect x="560" y="40" width="320" height="470" rx="20" fill="#f3f8ff" stroke="#c9d6ea" stroke-width="3" stroke-dasharray="8 6"/>${T(720, 30, "피노키오", { size: 22, fill: "#4a5a78" })}
    <g class="ghost" opacity=".18">${PIECES.map((p) => `<g transform="translate(${p.to[0]} ${p.to[1]}) rotate(${p.rot || 0}) scale(${p.to[2]})">${p.art}</g>`).join("")}</g>
    ${PIECES.map((p) => `<g class="nm-hit pc" data-k="${p.k}" style="transition:transform .6s cubic-bezier(.3,1.3,.5,1)" transform="translate(${p.from[0]} ${p.from[1]}) scale(${p.from[2]})">${p.art}</g>`).join("")}`);
  await ctx.guide.say("나무 조각을 하나씩 눌러 보세요. 피노키오의 어디가 될까요?");
  ctx.dock.innerHTML = `<div class="nm-padwrap"><div class="nm-ask">붙인 조각 <span class="nm-count">0</span> / ${PIECES.length}</div></div>`;
  let n = 0;
  await new Promise((r) => {
    const off = onHit(svg, ".pc", (el) => {
      const p = PIECES.find((x) => x.k === el.dataset.k); el.classList.remove("nm-hit", "pc");
      el.setAttribute("transform", `translate(${p.to[0]} ${p.to[1]}) rotate(${p.rot || 0}) scale(${p.to[2]})`);
      n++; ctx.dock.querySelector(".nm-count").textContent = n; ctx.fx.sound.pop();
      if (n === PIECES.length) { off(); r(); }
    });
  });
  svg.querySelector(".ghost").remove();
  ctx.fx.cheer(null, { big: true });
  await ctx.guide.praise("피노키오 완성! 상자 모양, 통나무 모양, 반쪽 통나무 모양 조각으로 만들었어요.");
  ctx.setSource(ctx.page("33")?.text || "");
  await ctx.next("다음");
}

// ── 34·35 토순이의 방 ──
const ROOM = [
  { k: "cone", obj: "cone", x: 250, y: 205, s: 0.85, name: "고깔모자" },
  { k: "triPrism", obj: "triPrism", x: 375, y: 190, s: 0.8, name: "연필꽂이" },
  { k: "sphere", obj: "globe", x: 560, y: 190, s: 0.9, name: "지구본" },
  { k: "cube", obj: "cube", x: 640, y: 255, s: 0.6, name: "주사위" },
  { k: "sqPyramid", obj: "pyramid", x: 180, y: 285, s: 0.95, name: "피라미드" },
  { k: "hexPrism", obj: "hexPrism", x: 420, y: 345, s: 0.85, name: "선물 상자" },
  { k: "hemi", obj: "snow", x: 720, y: 300, s: 0.85, name: "스노볼" },
  { k: "cylinder", obj: "trash", x: 300, y: 430, s: 0.9, name: "휴지통" }
];
const bunny = `<g><ellipse cx="-10" cy="-62" rx="9" ry="26" fill="#ffe066" stroke="#c9a400" stroke-width="2"/><ellipse cx="12" cy="-62" rx="9" ry="26" fill="#ffe066" stroke="#c9a400" stroke-width="2"/><ellipse cx="0" cy="22" rx="26" ry="30" fill="#ffe066" stroke="#c9a400" stroke-width="2"/><circle cx="0" cy="-22" r="24" fill="#ffe066" stroke="#c9a400" stroke-width="2"/><circle cx="-8" cy="-24" r="3" fill="#25324a"/><circle cx="8" cy="-24" r="3" fill="#25324a"/><ellipse cx="0" cy="-14" rx="4" ry="3" fill="#f47aa8"/></g>`;
function roomSvg() {
  return `<rect x="0" y="0" width="900" height="520" fill="#ffd6e0"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${i * 30}" y="0" width="12" height="300" fill="#f7b8c8" opacity=".55"/>`).join("")}
    <rect x="300" y="20" width="300" height="130" fill="#bfe6ff" stroke="#fff" stroke-width="8"/><path d="M280 15 Q320 90 300 160 L330 160 Q340 80 320 15Z M620 15 Q580 90 600 160 L570 160 Q560 80 580 15Z" fill="#8ac26a"/>
    <rect x="0" y="300" width="900" height="220" fill="#b6e88a"/>${Array.from({ length: 8 }, (_, i) => `<rect x="0" y="${310 + i * 26}" width="900" height="12" fill="#9ad66e"/>`).join("")}
    <path d="M110 230 Q450 150 790 230 L790 330 Q700 320 680 380 L560 380 Q540 290 450 290 Q360 290 340 380 L220 380 Q200 320 110 330Z" fill="#f6c84a" stroke="#c9963a" stroke-width="3"/>
    <rect x="800" y="60" width="50" height="70" fill="#fff" stroke="#c9963a" stroke-width="5"/>
    <g transform="translate(470 410)">${bunny}</g>${T(470, 505, "토순이", { size: 20 })}
    ${ROOM.map((o) => `<g class="nm-hit rm" data-k="${o.k}" transform="translate(${o.x} ${o.y}) scale(${o.s})">${OBJ_PIC[o.obj] || ""}</g>`).join("")}`;
}
async function p34(ctx) {
  await ctx.source("34");
  const svg = scene(ctx, "0 0 900 520", roomSvg());
  ctx.guide.say("토순이의 방을 살펴봐요. 물건을 하나씩 눌러 봐요!");
  ctx.dock.innerHTML = `<div class="nm-padwrap"><div class="nm-ask">찾은 물건 <span class="nm-count">0</span> / ${ROOM.length}</div></div>`;
  const seen = new Set();
  await new Promise((r) => { const off = onHit(svg, ".rm", (el) => { if (seen.has(el.dataset.k)) return; seen.add(el.dataset.k); ctx.fx.sound.pop(); ctx.fx.burstAt(el, { power: 0.5 }); el.classList.add("nm-glow"); ctx.dock.querySelector(".nm-count").textContent = seen.size; if (seen.size === ROOM.length) { off(); r(); } }); });
  await ctx.guide.praise("방 안에 여러 가지 모양의 물건이 있어요!");
  await ctx.next("다음");
}
const SOLID_COL = { cube: "#f2475a", triPrism: "#4a7fd0", cylinder: "#4a7fd0", hexPrism: "#4a7fd0", sqPyramid: "#f2475a", sphere: "#ffd23f", cone: "#ffd23f", hemi: "#ffd23f" };
async function p35(ctx) {
  await ctx.source("35");
  const order = ["cube", "triPrism", "cylinder", "hexPrism", "sqPyramid", "sphere", "cone", "hemi"];
  for (const k of order) {
    const svg = scene(ctx, "0 0 1100 520", `<g transform="scale(1)">${roomSvg()}</g><rect x="910" y="120" width="170" height="200" rx="18" fill="#fff" stroke="#9ad66e" stroke-width="6"/><g transform="translate(995 220) scale(1.4)">${solidArt(k, SOLID_COL[k])}</g>${T(995, 350, "비슷한 물건은?", { size: 20 })}`);
    ctx.guide.say("오른쪽 입체도형과 비슷한 모양의 물건을 방에서 찾아 눌러요!");
    let wrong = 0;
    await new Promise((r) => {
      const off = onHit(svg, ".rm", (el) => {
        if (el.dataset.k === k) { off(); ctx.fx.cheer(null); el.classList.add("nm-glow"); r(); return; }
        wrong++; ctx.mistake(); ctx.fx.sound.bad(); el.classList.remove("nm-no"); void el.getBoundingClientRect(); el.classList.add("nm-no");
        ctx.guide.encourage(wrong >= 2 ? "뾰족한지, 둥근지, 기둥 모양인지 봐요. 반짝이는 물건을 봐요." : "모양을 다시 비교해 봐요.");
        if (wrong >= 2) svg.querySelector(`.rm[data-k="${k}"]`)?.classList.add("nm-glow");
      });
    });
    await ctx.guide.praise("맞아요! 모양이 비슷해요.");
  }
  await ctx.next("끝");
}

export const LESSON = {
  title: "피노키오와 토순이의 방",
  subtitle: "나무 조각으로 피노키오를 만들고, 비슷한 모양의 물건을 찾아요",
  coverArt: "🎁",
  doneTitle: "입체도형 1차시 끝!",
  doneText: "주사위·휴지통·지구본처럼 우리 주변 물건도 여러 가지 입체도형 모양이에요.",
  steps: [
    { page: "32~33쪽 · 커지는 생각", run: p32 },
    { page: "34쪽", run: p34 },
    { page: "35쪽", run: p35 }
  ]
};
void solidIcon;
