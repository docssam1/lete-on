// A1-2 3단원 수와 숫자의 탄생 · 1차시 (원본 54~57쪽)
//  54·55 생활 속의 숫자(길거리 그림에서 숫자 찾기 — 그림은 원본 장면을 코드로 다시 그림)
//  56 큐브 세기(10개 묶고 남은 것 세기: 보기 13, 문제 15·17·20 — 원본 주머니 그림에서 셈)
//  57 「큐브 세기」 활동: 주머니에서 큐브를 꺼내 세고 수 카드 가져가기, 나 대 독쌤
import { esc, scene, icon, cube, bagSvg, bagCubes, group10, findAll, numCard, onHit, pad, countSay } from "../numbers.js?v=20261115a";
import { kid } from "../art.js?v=20261115a";

// ── 54쪽 길거리(채소 가게·과일 가게·빨간 자동차) ──
const T = (x, y, s, t, { size = 26, fill = "#25324a", weight = 800, anchor = "middle", rot = 0 } = {}) => `<text x="${x}" y="${y}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ""}>${t}</text>`;
const find = (k, body, [x, y, w, h]) => `<g class="nm-hit nm-find" data-k="${k}">${body}<rect class="ring" x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="rgba(255,230,0,.18)" stroke="#e8417f" stroke-width="6"/></g>`;
function streetA() {
  const scallop = Array.from({ length: 12 }, (_, i) => `<path d="M${40 + i * 38} 206 q19 22 38 0" fill="#fff" stroke="#3d5a99" stroke-width="3"/>`).join("");
  const tiles = Array.from({ length: 4 }, (_, r) => Array.from({ length: 13 }, (_, c) => `<path d="M${30 + c * 36 + (r % 2) * 18} ${84 + r * 26} q18 30 36 0" fill="${r % 2 ? "#8ea6dc" : "#6f8ccc"}" stroke="#3d5a99" stroke-width="2"/>`).join("")).join("");
  const cucumbers = Array.from({ length: 14 }, (_, i) => `<rect x="${178 + i * 15}" y="300" width="11" height="44" rx="5" fill="#4fae40" stroke="#2f7a28" stroke-width="1.5" transform="rotate(-6 ${183 + i * 15} 322)"/>`).join("");
  const cabbages = [210, 262, 314].map((x) => `<ellipse cx="${x}" cy="356" rx="26" ry="15" fill="#e9f7d4" stroke="#7fb36a" stroke-width="2"/><path d="M${x - 16} 356 q16 -12 32 0" stroke="#7fb36a" stroke-width="2" fill="none"/>`).join("");
  const onions = Array.from({ length: 8 }, (_, i) => `<circle cx="${370 + (i % 4) * 22}" cy="${336 + Math.floor(i / 4) * 20}" r="10" fill="#fff7e6" stroke="#c9a36a" stroke-width="2"/>`).join("");
  const melons = [[640, 316], [688, 316], [736, 316], [664, 296], [712, 296]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="24" fill="#3c8a3a" stroke="#1f4a1e" stroke-width="2"/><path d="M${x - 12} ${y - 20} q-6 20 0 40 M${x} ${y - 24} v48 M${x + 12} ${y - 20} q6 20 0 40" stroke="#174016" stroke-width="3" fill="none"/>`).join("");
  const fruits = Array.from({ length: 14 }, (_, i) => `<circle cx="${790 + (i % 7) * 18}" cy="${236 + Math.floor(i / 7) * 18}" r="9" fill="${["#f0414f", "#7bd36a", "#ffd23f"][i % 3]}"/>`).join("");
  return `<rect width="1000" height="640" fill="#eef6ff"/>
    <rect x="0" y="40" width="560" height="420" fill="#bfe2ff"/><path d="M10 60 L560 60 L560 140 L10 140Z" fill="#5f7fc4"/>${tiles}<path d="M20 190 L570 190 L540 70 L40 70Z" fill="none"/>
    <rect x="20" y="190" width="540" height="20" fill="#bfe2ff"/>${scallop}
    ${find("veg", `<rect x="22" y="132" width="520" height="62" fill="#bfe2ff"/>${T(70, 180, 0, "야 채", { size: 40, weight: 700 })}${T(330, 180, 0, "454~7000", { size: 44, weight: 700 })}`, [190, 132, 290, 64])}
    <rect x="560" y="0" width="440" height="470" fill="#f3c6ec"/><rect x="520" y="0" width="60" height="470" fill="#d9b8f0"/>
    ${find("fruit", `<rect x="600" y="40" width="390" height="110" fill="#ffe94d" stroke="#25324a" stroke-width="3"/>${T(770, 100, 0, "과 일  가 게", { size: 46, weight: 700 })}${T(880, 136, 0, "457~1234", { size: 32, weight: 700 })}`, [800, 104, 170, 46])}
    <rect x="610" y="170" width="360" height="200" fill="#c9a8e6" stroke="#25324a" stroke-width="3"/>
    <rect x="600" y="300" width="160" height="70" fill="#d9a066" stroke="#25324a" stroke-width="3"/>${melons}
    <path d="M770 220 L940 220 L960 300 L790 300Z" fill="#d9a066" stroke="#25324a" stroke-width="3"/>${fruits}
    ${find("melon", `<path d="M640 176 v18 M720 176 v18" stroke="#8a5a32" stroke-width="3"/><rect x="616" y="194" width="140" height="46" rx="4" fill="#ffa94d" stroke="#25324a" stroke-width="3"/>${T(686, 226, 0, "수박 1개 5000원", { size: 20 })}`, [608, 188, 156, 58])}
    <rect x="0" y="460" width="1000" height="40" fill="#fff3a8"/>
    <path d="M140 300 L520 300 L540 420 L170 420Z" fill="#d9a066" stroke="#25324a" stroke-width="3"/>${cucumbers}${cabbages}${onions}
    ${find("cuke", `<path d="M190 300 l-6 -40" stroke="#8a5a32" stroke-width="5"/><rect x="120" y="200" width="104" height="70" rx="4" fill="#ffa94d" stroke="#25324a" stroke-width="3"/>${T(172, 228, 0, "오이", { size: 22 })}${T(172, 258, 0, "3개 2000원", { size: 20 })}`, [112, 194, 120, 82])}
    <rect x="0" y="500" width="1000" height="140" fill="#efe2c4"/>
    ${Array.from({ length: 4 }, (_, i) => `<path d="M${60 + i * 26} ${512 + i * 32} h150 l-12 16 h-150z" fill="#fff"/>`).join("")}
    <g transform="translate(600 448)">
      <path d="M20 120 L40 60 Q60 20 120 18 L300 14 Q350 14 360 70 L370 130 Q370 150 350 150 L40 150 Q18 150 20 120Z" fill="#e53b3b" stroke="#25324a" stroke-width="3"/>
      <path d="M70 66 L120 30 L190 28 L196 70Z M210 28 L280 26 L300 70 L214 70Z M310 30 L340 30 L352 70 L316 70Z" fill="#d9f5ff" stroke="#25324a" stroke-width="2.5"/>
      <circle cx="90" cy="150" r="30" fill="#25324a"/><circle cx="90" cy="150" r="13" fill="#e8ecf2"/><circle cx="300" cy="150" r="30" fill="#25324a"/><circle cx="300" cy="150" r="13" fill="#e8ecf2"/>
      ${find("car", `<rect x="-6" y="98" width="90" height="38" rx="6" fill="#fff" stroke="#25324a" stroke-width="3"/>${T(39, 126, 0, "8690", { size: 26 })}`, [-14, 92, 106, 50])}
    </g>`;
}
// ── 55쪽 길거리(공사 중인 가게·버스·파란 자동차·아이) ──
function streetB() {
  const boy = kid({ hair: "boy", hairColor: "#7a4a22", shirt: "#3ea65b", bottom: "#5aa0f0", size: 150, label: "아이" });
  return `<rect width="1000" height="640" fill="#eef6ff"/>
    <rect x="0" y="20" width="420" height="300" fill="#cfd3da"/><rect x="0" y="20" width="420" height="16" fill="#fff"/>
    <rect x="40" y="80" width="300" height="240" fill="#9aa1ad" stroke="#25324a" stroke-width="3"/><path d="M190 80 v240" stroke="#25324a" stroke-width="3"/>
    <rect x="70" y="130" width="100" height="90" fill="#fff" stroke="#25324a" stroke-width="3"/>${T(120, 186, 0, "공사중", { size: 28 })}
    <rect x="420" y="0" width="300" height="300" fill="#f39a3c"/>${[480, 560, 640].map((x) => `<path d="M${x} 0 v300" stroke="#c96f1f" stroke-width="3"/>`).join("")}
    ${find("open", `<path d="M360 40 L470 40" stroke="#8a5a32" stroke-width="6"/><path d="M370 44 L462 44 L470 260 Q420 250 380 270Z" fill="#fff" stroke="#25324a" stroke-width="3"/>${T(420, 100, 0, "3월", { size: 32, fill: "#2a4f9c" })}${T(420, 146, 0, "17일", { size: 32, fill: "#2a4f9c" })}${T(424, 200, 0, "open", { size: 32, fill: "#e53b3b" })}`, [366, 44, 112, 226])}
    <path d="M0 320 L1000 300 L1000 340 L0 360Z" fill="#fff3a8"/>
    <rect x="0" y="350" width="1000" height="290" fill="#e6dcc6"/>
    <g transform="translate(560 250)">
      <path d="M10 110 Q0 70 40 60 L80 20 Q100 4 140 4 L230 6 Q270 8 290 40 L320 70 Q340 76 340 100 L336 130 L20 134Z" fill="#4a90e2" stroke="#25324a" stroke-width="3"/>
      <path d="M96 30 L140 14 L170 14 L172 60 L80 62Z M188 14 L226 16 L262 60 L190 60Z" fill="#d9f5ff" stroke="#25324a" stroke-width="2.5"/>
      <circle cx="80" cy="134" r="28" fill="#25324a"/><circle cx="80" cy="134" r="12" fill="#e8ecf2"/><circle cx="270" cy="134" r="28" fill="#25324a"/><circle cx="270" cy="134" r="12" fill="#e8ecf2"/>
      ${find("car2", `<rect x="0" y="84" width="76" height="32" rx="5" fill="#fff" stroke="#25324a" stroke-width="3"/>${T(38, 108, 0, "4130", { size: 22 })}`, [-8, 78, 92, 44])}
    </g>
    <g transform="translate(110 400)">
      <path d="M20 160 L20 60 Q24 10 90 8 L330 10 Q380 14 380 70 L380 160 Q380 176 360 176 L40 176 Q20 176 20 160Z" fill="#ffd84a" stroke="#25324a" stroke-width="3"/>
      <path d="M40 30 Q50 20 80 20 L150 20 L150 100 L40 100Z" fill="#e9f7ff" stroke="#25324a" stroke-width="2.5"/>${[175, 240, 305].map((x) => `<rect x="${x}" y="30" width="52" height="56" rx="8" fill="#e9f7ff" stroke="#25324a" stroke-width="2.5"/>`).join("")}
      <circle cx="110" cy="178" r="30" fill="#25324a"/><circle cx="110" cy="178" r="12" fill="#e8ecf2"/><circle cx="310" cy="178" r="30" fill="#25324a"/><circle cx="310" cy="178" r="12" fill="#e8ecf2"/>
      ${find("bus", `<rect x="52" y="28" width="62" height="34" rx="6" fill="#d7c4f2" stroke="#25324a" stroke-width="2.5"/>${T(83, 54, 0, "8번", { size: 24 })}`, [46, 22, 74, 46])}
      ${find("bus2", `<rect x="40" y="128" width="84" height="34" rx="5" fill="#fff" stroke="#25324a" stroke-width="3"/>${T(82, 154, 0, "7672", { size: 24 })}`, [32, 122, 100, 46])}
    </g>
    <g transform="translate(560 400)">${boy.replace("<svg ", '<svg x="0" y="0" ')}
      <path d="M38 52 Q40 22 75 22 Q110 22 112 52 Z" fill="#5aa0f0" stroke="#25324a" stroke-width="2"/><path d="M104 46 L140 50 L108 56Z" fill="#9b7be0" stroke="#25324a" stroke-width="2"/>
      ${find("shirt", `${T(75, 160, 0, "23", { size: 26, fill: "#fff", weight: 900 })}`, [52, 132, 46, 38])}
    </g>
    ${find("flower", `<g transform="translate(860 576)"><ellipse cx="0" cy="-56" rx="70" ry="30" fill="#3fae49"/><circle cx="-30" cy="-66" r="22" fill="#55b047"/><circle cx="20" cy="-70" r="24" fill="#4fae40"/><path d="M-80 -50 Q-80 40 0 40 Q80 40 80 -50Z" fill="#f2786b" stroke="#25324a" stroke-width="3"/>${T(0, -12, 0, "꽃집 전방", { size: 20 })}${T(-8, 18, 0, "30 m ➜", { size: 22 })}</g>`, [784, 486, 152, 136])}`;
}
const WHAT = {
  veg: "채소 가게 전화번호예요. 전화를 걸 때 써요.",
  fruit: "과일 가게 전화번호예요.",
  cuke: "오이 3개는 2000원! 물건 값이에요.",
  melon: "수박 1개는 5000원! 물건 값이에요.",
  car: "자동차 번호판이에요. 자동차마다 번호가 달라요.",
  open: "3월 17일에 가게 문을 연대요. 날짜예요.",
  car2: "파란 자동차의 번호판이에요.",
  bus: "8번 버스예요. 버스 번호를 보고 타요.",
  bus2: "버스에도 번호판이 있어요.",
  shirt: "옷에 쓰인 번호 23이에요.",
  flower: "꽃집까지 30미터 남았대요. 거리를 나타내요."
};

async function p54(ctx) {
  await ctx.source("54");
  const svg = scene(ctx, "0 0 1000 640", streetA());
  ctx.guide.say("그림 속 숫자를 찾아서 눌러요! 숫자가 다섯 군데 있어요.");
  await findAll(ctx, svg, { total: 5, onFound: (k) => ctx.guide.say(WHAT[k]) });
  await ctx.guide.praise("다 찾았어요! 전화번호, 물건 값, 자동차 번호에도 숫자가 있어요.");
  await ctx.next("다음 그림");
}
async function p55(ctx) {
  if (ctx.page("54")?.text) ctx.setSource(ctx.page("54").text);
  const svg = scene(ctx, "0 0 1000 640", streetB());
  ctx.guide.say("이 그림에도 숫자가 숨어 있어요. 여섯 군데를 찾아요!");
  await findAll(ctx, svg, { total: 6, onFound: (k) => ctx.guide.say(WHAT[k]) });
  await ctx.guide.praise("와, 우리 주변에는 숫자가 정말 많아요!");
  await ctx.next("다음");
}

// ── 56쪽 큐브 세기 ──
const BAGS = [15, 17, 20];
async function p56(ctx) {
  const pg = await ctx.source("56");
  // 보기: 13 — 10개 묶음(둘씩 다섯 쌍)과 3개
  const Y = 40;   // 묶음 위치를 주머니 몸통 안으로
  const pairs = Array.from({ length: 5 }, (_, i) => `<rect x="${262 + i * 76}" y="${118 + Y}" width="62" height="128" rx="14" fill="none" stroke="#e8604f" stroke-width="3"/>${cube(293 + i * 76, 150 + Y, 50, ["blue", "green", "orange", "pink", "green"][i])}<path d="M${293 + i * 76} ${176 + Y} v20" stroke="#25324a" stroke-width="2.5"/>${cube(293 + i * 76, 216 + Y, 50, ["red", "yellow", "brown", "blue", "orange"][i])}`).join("");
  const svg = scene(ctx, "0 0 900 520", `${bagSvg(450, 300, 520)}<rect x="250" y="${108 + Y}" width="400" height="148" rx="20" fill="none" stroke="#e8604f" stroke-width="4"/>${pairs}
    <g class="rest">${["brown", "red", "yellow"].map((c, i) => cube(390 + i * 66, 370, 50, c)).join("")}</g>
    <text x="450" y="440" text-anchor="middle" font-size="30" font-weight="800" fill="#e8417f">보기 · 13개</text>`);
  void svg;
  await ctx.guide.say("보기를 봐요. 큐브 10개를 묶고, 남은 큐브 3개를 이어서 세면 열하나, 열둘, 열셋! 모두 13개예요.");
  if (pg?.text2) { ctx.setSource(pg.text2); await ctx.guide.say(pg.text2, { display: false }); }
  await ctx.next("나도 해 볼래요");
  for (const [i, n] of BAGS.entries()) {
    const items = bagCubes(n, 600, 250, { gap: 64, seed: i * 3 });
    await group10(ctx, { items, vb: "0 0 900 470", size: 52, tray: { x: 24, y: 110 }, back: `${bagSvg(600, 260, 470, ["#3d6fc4", "#e8604f", "#3d6fc4"][i])}<text x="20" y="44" font-size="28" font-weight="800" fill="#4a5a78">주머니 ${i + 1}</text>` });
    await ctx.guide.praise(i === BAGS.length - 1 ? "10개 묶음이 두 개! 모두 20개예요. 정말 잘 세었어요!" : "맞아요! 10개씩 묶으면 세기 쉬워요.");
    await ctx.wait(400);
  }
  await ctx.next("다음");
}

// ── 57쪽 「큐브 세기」 게임: 나 대 독쌤 ──
async function p57(ctx) {
  const pg = await ctx.source("57");
  // 원본 보기: 주머니에서 9개 → 9 카드
  scene(ctx, "0 0 900 380", `${bagSvg(250, 210, 300, "#3d6fc4")}${bagCubes(9, 250, 220, { gap: 62, per: 3 }).map((c) => cube(c.x, c.y, 46, c.c)).join("")}${numCard(500, 210, 9, { w: 76, h: 92, stroke: "#9b7be0", font: 46 })}
    <g transform="translate(640 150)">${kid({ hair: "boy", hairColor: "#5a3a2a", shirt: "#8a9a3c", bottom: "#a5713c", size: 150 })}</g>
    ${pg?.bubbles?.[0] ? `<g><rect x="560" y="20" width="330" height="104" rx="40" fill="#fff" stroke="#25324a" stroke-width="2.5"/><path d="M700 122 l14 26 l10 -27" fill="#fff" stroke="#25324a" stroke-width="2.5"/><foreignObject x="580" y="28" width="290" height="90"><div xmlns="http://www.w3.org/1999/xhtml" style="font-size:21px;font-weight:700;line-height:1.35;display:flex;align-items:center;justify-content:center;height:90px;text-align:center;color:#25324a">${esc(pg.bubbles[0])}</div></foreignObject></g>` : ""}`);
  if (pg?.bubbles?.[0]) await ctx.guide.think(pg.bubbles[0]);
  await ctx.guide.say("주머니에서 큐브를 꺼내 세고, 그 수가 적힌 카드를 가져가요. 카드를 더 많이 가져가면 이겨요!");
  await ctx.next("게임 시작!", { icon: "🎲" });

  const taken = {};              // n → "me" | "doc"
  const draw = () => {
    const cards = Array.from({ length: 20 }, (_, i) => { const n = i + 1, x = 470 + (i % 10) * 42, y = 70 + Math.floor(i / 10) * 56, who = taken[n];
      return numCard(x, y, n, { w: 38, h: 50, font: 22, fill: who === "me" ? "#d8f7e2" : who === "doc" ? "#dbe8ff" : "#fffbe0", stroke: who === "me" ? "#2fb67c" : who === "doc" ? "#2a6fc4" : "#e6c84a", cls: who ? "taken" : "nm-hit nm-pickcard", attrs: `data-n="${n}"` }); }).join("");
    return `${bagSvg(180, 260, 260, "#e8604f", { cls: "nm-hit nm-bagbtn" })}<g class="cards">${cards}</g>
      <g class="pile"></g><text x="470" y="34" font-size="22" font-weight="800" fill="#4a5a78">수 카드</text>
      <text x="40" y="460" font-size="24" font-weight="800" fill="#2fb67c">나 ${Object.values(taken).filter((w) => w === "me").length}장</text>
      <text x="200" y="460" font-size="24" font-weight="800" fill="#2a6fc4">독쌤 ${Object.values(taken).filter((w) => w === "doc").length}장</text>`;
  };
  const free = () => Array.from({ length: 20 }, (_, i) => i + 1).filter((n) => !taken[n]);
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  const spill = (svg, n) => {
    const g = svg.querySelector(".pile"); g.innerHTML = "";
    bagCubes(n, 690, 330, { gap: 56, seed: n }).forEach((c, i) => {
      const el = document.createElementNS("http://www.w3.org/2000/svg", "g"); el.setAttribute("class", "nm-hit nm-cnt"); el.dataset.i = i;
      el.innerHTML = cube(c.x, c.y, 44, c.c); el.style.opacity = "0"; el.style.transition = "opacity .25s"; g.append(el);
      setTimeout(() => { el.style.opacity = "1"; }, 60 * i);
    });
  };
  for (let turn = 0; turn < 6; turn++) {
    const mine = turn % 2 === 0;
    const svg = scene(ctx, "0 0 940 480", draw());
    if (mine) {
      ctx.dock.innerHTML = `<p class="sm-docknote">👉 주머니를 눌러 큐브를 꺼내요</p>`;
      ctx.guide.say("내 차례예요! 주머니를 눌러요.");
      await new Promise((r) => { const off = onHit(svg, ".nm-bagbtn", () => { off(); r(); }); });
      const n = rnd(free().filter((k) => k >= 5 && k <= 15).length ? free().filter((k) => k >= 5 && k <= 15) : free());
      ctx.fx.sound.drop(); spill(svg, n); await ctx.wait(60 * n + 300);
      ctx.dock.innerHTML = `<p class="sm-docknote">👉 큐브를 하나씩 눌러 세어요</p>`;
      ctx.guide.say("큐브를 하나씩 눌러서 세어 봐요.");
      let k = 0;
      await new Promise((r) => {
        const off = onHit(svg, ".nm-cnt", (el) => {
          if (el.dataset.done) return; el.dataset.done = "1"; k++;
          const b = el.getBBox(); el.insertAdjacentHTML("beforeend", `<circle cx="${b.x + b.width - 6}" cy="${b.y + 6}" r="14" fill="#2fb67c" stroke="#fff" stroke-width="3"/><text x="${b.x + b.width - 6}" y="${b.y + 12}" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">${k}</text>`);
          ctx.fx.sound.pop(); countSay(ctx, k);
          if (k === n) { off(); r(); }
        });
      });
      await ctx.wait(500);
      ctx.dock.innerHTML = `<p class="sm-docknote">👉 알맞은 수 카드를 눌러요</p>`;
      ctx.guide.say("몇 개였나요? 그 수가 적힌 카드를 가져가요!");
      let wrong = 0;
      await new Promise((r) => {
        const off = onHit(svg, ".nm-pickcard", (el) => {
          const v = Number(el.dataset.n);
          if (v === n) { off(); taken[n] = "me"; const rc = el.querySelector("rect"); rc.setAttribute("fill", "#d8f7e2"); rc.setAttribute("stroke", "#2fb67c"); ctx.fx.cheer(null); r(); return; }
          wrong++; ctx.mistake(); ctx.fx.sound.bad();
          ctx.guide.encourage(wrong >= 2 ? "마지막으로 센 수가 큐브의 수예요. 초록 번호를 봐요." : "다시 세어 볼까요?");
        });
      });
      await ctx.guide.praise("맞아요! 카드를 가져가요.");
    } else {
      ctx.dock.innerHTML = "";
      await ctx.guide.say("이번엔 독쌤 차례!");
      const n = turn === 3 && Object.keys(taken).length ? Number(rnd(Object.keys(taken))) : rnd(free().filter((k) => k >= 4 && k <= 16).length ? free().filter((k) => k >= 4 && k <= 16) : free());
      ctx.fx.sound.drop(); spill(svg, n); await ctx.wait(60 * n + 300);
      for (let k = 1; k <= n; k++) { const el = svg.querySelector(`.nm-cnt[data-i="${k - 1}"]`); el.classList.add("nm-glow"); countSay(ctx, k); await ctx.wait(560); }
      if (taken[n]) {
        await ctx.guide.encourage("아이고, 그 카드는 벌써 가져갔어요. 이미 가져간 카드는 가져갈 수 없어요!");
      } else {
        taken[n] = "doc"; ctx.fx.sound.good();
        const rc = svg.querySelector(`.nm-pickcard[data-n="${n}"] rect`); if (rc) { rc.setAttribute("fill", "#dbe8ff"); rc.setAttribute("stroke", "#2a6fc4"); }
        await ctx.guide.say("독쌤도 카드를 가져가요.");
      }
    }
  }
  const me = Object.values(taken).filter((w) => w === "me").length, doc = Object.values(taken).filter((w) => w === "doc").length;
  scene(ctx, "0 0 940 480", draw());
  if (me > doc) { ctx.fx.sound.fanfare(); ctx.fx.cheer(null, { big: true }); await ctx.guide.praise("카드를 더 많이 가져갔어요! 내가 이겼어요!"); }
  else if (me === doc) await ctx.guide.say("카드 수가 같아요. 비겼어요!");
  else await ctx.guide.encourage("이번엔 독쌤이 이겼어요. 다음엔 꼭 이길 거예요!");
  await ctx.next("끝");
}

export const LESSON = {
  title: "생활 속의 숫자",
  subtitle: "그림에서 숫자를 찾고, 큐브를 10개씩 묶어 세어요",
  coverArt: "🔢",
  doneTitle: "수와 숫자의 탄생 1차시 끝!",
  doneText: "숫자는 전화번호·값·번호판에도 있어요. 10개씩 묶으면 많은 것도 쉽게 셀 수 있어요.",
  steps: [
    { page: "54쪽 · 커지는 생각", run: p54 },
    { page: "55쪽", run: p55 },
    { page: "56쪽", run: p56 },
    { page: "57쪽 · 활동", run: p57 }
  ]
};
