(function (root) {
  "use strict";
  const IDS = ["6-2-u2-e6-exploration-1", "6-2-u2-e6-example-3"];
  const KEYS = ["sourceGrade6DecimalE6Stairs", "sourceGrade6DecimalE6Pond"];
  const pools = [
    [{ initial: 180, rate: 80, steps: [20, 35, 20] }, { initial: 192, rate: 75, steps: [16, 24, 18] }, { initial: 250, rate: 60, steps: [15, 25, 15] }],
    [{ length: 300, a: 60, b: 75 }, { length: 240, a: 50, b: 80 }, { length: 360, a: 40, b: 65 }]
  ];
  const fmt = n => String(Math.round(n * 1000000) / 1000000);
  const coord = n => Number(n.toFixed(4));
  const line = (x1, y1, x2, y2, owner, dashed = false) => `<line x1="${coord(x1)}" y1="${coord(y1)}" x2="${coord(x2)}" y2="${coord(y2)}" data-owner-id="${owner}"${dashed ? ' class="e6-guide"' : ""}/>`;
  const text = (x, y, content, owner) => `<text x="${coord(x)}" y="${coord(y)}" data-label-for="${owner}">${content}</text>`;
  const dimension = (x, y1, y2, owner) => line(x, y1, x, y2, owner) + line(x - 5, y1, x + 5, y1, owner) + line(x - 5, y2, x + 5, y2, owner);
  const board = rows => `<div class="source61-math-board e6-solution-board">${rows.map(([label, expression]) => `<div class="source61-math-row"><span>${label}</span><b>${expression}</b></div>`).join("")}</div>`;

  function stairFacts(d) {
    const rate = d.rate / 100;
    const bounce1 = d.initial * rate;
    const bounce2 = (bounce1 + d.steps[0]) * rate;
    const bounce3 = (bounce2 + d.steps[1]) * rate;
    return { bounce1, bounce2, bounce3, final: bounce3 + d.steps[2] };
  }
  function stairModel(d) {
    const f = stairFacts(d), [s1, s2, s3] = d.steps;
    const floors = [s1 + s2 + s3, s2 + s3, s3, 0];
    const scale = 258 / (floors[0] + d.initial), y = z => 331 - z * scale;
    const impacts = [160, 270, 390, 527].map((x, i) => ({ x, z: floors[i], y: y(floors[i]) }));
    const arcs = [f.bounce1, f.bounce2, f.bounce3].map((h, i) => {
      const start = impacts[i], end = impacts[i + 1], drop = start.z - end.z;
      const apexX = start.x + (end.x - start.x) * Math.sqrt(h) / (Math.sqrt(h) + Math.sqrt(h + drop));
      const controlZ = (start.z + end.z + (Math.sqrt(h) + Math.sqrt(h + drop)) ** 2) / 2;
      return { start, end, apex: { x: apexX, z: start.z + h, y: y(start.z + h) }, control: { x: (start.x + end.x) / 2, y: y(controlZ) } };
    });
    return { floors, impacts, arcs, scale, y, release: { x: 120, z: floors[0] + d.initial, y: y(floors[0] + d.initial) } };
  }
  function stairSvg(d, level, solved, pool) {
    const f = stairFacts(d), m = stairModel(d);
    const p = m.release, end = m.impacts[0];
    const path = `M${p.x},${coord(p.y)} Q${(p.x + end.x) / 2},${coord(p.y)} ${end.x},${coord(end.y)}`;
    const arcPaths = m.arcs.map((a, i) => `<path data-owner-id="bounce-${i + 1}" d="M${a.start.x},${coord(a.start.y)} Q${coord(a.control.x)},${coord(a.control.y)} ${a.end.x},${coord(a.end.y)}"/>`).join("");
    const stair = `M60,${coord(m.y(m.floors[0]))} H245 V${coord(m.y(m.floors[1]))} H365 V${coord(m.y(m.floors[2]))} H420 V331 H590`;
    const stepLabels = d.steps.map((s, i) => {
      const edgeX = [245, 365, 420][i], labelX = [230, 355, 460][i];
      const edgeY = m.y((m.floors[i] + m.floors[i + 1]) / 2);
      return `<path class="e6-guide" data-owner-id="step-${i + 1}" d="M${edgeX},${coord(edgeY)} L${labelX},351 V357"/>${text(labelX, 381, `${s}cm`, `step-${i + 1}`)}`;
    }).join("");
    const initial = solved || level === 0 ? fmt(d.initial) : "□";
    const third = solved || level !== 0 ? fmt(f.final) : "□";
    const peak = m.arcs[2].apex;
    return `<svg class="geometry-diagram e6-geometry" viewBox="0 0 640 405" role="img" aria-label="세 계단 위에서 세 번 튀는 공의 높이" data-source-item="${IDS[0]}" data-phase="${solved ? "answer" : "problem"}" data-model="stair-bounce" data-pool="${pool}" data-height-datum="lowest-floor">
      <path data-owner-id="stairs" d="${stair}"/><path data-owner-id="initial-drop" d="${path}"/>${arcPaths}
      <circle cx="${p.x}" cy="${coord(p.y)}" r="5" fill="#fff"/>
      ${dimension(100, p.y, end.y, "initial-height")}${text(45, (p.y + end.y) / 2, `${initial}cm`, "initial-height")}
      ${line(peak.x, peak.y, 575, peak.y, "third-height", true)}${dimension(575, peak.y, 331, "third-height")}
      ${text(548, peak.y - 20, `${third}cm`, "third-height")}${stepLabels}
    </svg>`;
  }
  function pondFacts(d) {
    return { depthA: d.length * d.a / 100, depthB: d.length * d.b / 100, gap: d.length * (d.b - d.a) / 100 };
  }
  function pondModel(d) {
    const f = pondFacts(d), scale = 235 / d.length;
    const waterY = 100 + (100 - d.a) / 100 * 235;
    const rods = [d.a, d.b].map((fraction, i) => ({ x: 205 + i * 195, top: waterY - d.length * (100 - fraction) / 100 * scale, bottom: waterY + d.length * fraction / 100 * scale }));
    return { scale, waterY, rods, slope: (rods[1].bottom - rods[0].bottom) / 195, f };
  }
  function pondSvg(d, level, solved, pool) {
    const m = pondModel(d), [a, b] = m.rods;
    const bottomAt = x => a.bottom + (x - a.x) * m.slope;
    const bed = `M135,${coord(bottomAt(135))} L490,${coord(bottomAt(490))}`;
    const rods = m.rods.map((r, i) => `<rect x="${r.x - 5}" y="${coord(r.top)}" width="10" height="235" data-owner-id="rod-${i ? "B" : "A"}"/>${text(r.x, r.top - 22, i ? "B" : "A", `rod-${i ? "B" : "A"}`)}`).join("");
    const ratios = m.rods.map((r, i) => dimension(r.x + 38, m.waterY, r.bottom, `submerged-${i ? "B" : "A"}`) + text(r.x + 76, (m.waterY + r.bottom) / 2, fmt((i ? d.b : d.a) / 100), `submerged-${i ? "B" : "A"}`)).join("");
    const known = level === 0 ? dimension(120, a.top, a.bottom, "whole-rod") + text(71, (a.top + a.bottom) / 2, `${d.length}cm`, "whole-rod")
      : line(a.x - 7, a.top, 163, a.top, "tip-gap", true) + line(b.x - 7, b.top, 163, b.top, "tip-gap", true) + dimension(163, a.top, b.top, "tip-gap") + text(115, (a.top + b.top) / 2, `${fmt(m.f.gap)}cm`, "tip-gap");
    const results = solved ? text(217, 480, `A 깊이 ${fmt(m.f.depthA)}cm`, "answer-A") + (level === 2 ? text(435, 480, `B 깊이 ${fmt(m.f.depthB)}cm`, "answer-B") : "") : "";
    return `<svg class="geometry-diagram e6-geometry" viewBox="0 0 600 510" role="img" aria-label="같은 길이의 두 막대로 잰 A와 B 지점의 연못 깊이" data-source-item="${IDS[1]}" data-phase="${solved ? "answer" : "problem"}" data-model="equal-pond-rods" data-pool="${pool}" data-height-datum="water-surface">
      ${line(135, m.waterY, 510, m.waterY, "water-surface")}<path data-owner-id="pond-bed" d="${bed}"/>
      ${rods}${ratios}${known}${results}
    </svg>`;
  }
  function generate(index, level, variant) {
    if (!Number.isInteger(variant) || ![0, 1, 2].includes(level)) throw new Error("고정 변형 번호와 난이도를 확인하세요.");
    const pool = ((variant % 3) + 3) % 3, d = pools[index][pool];
    const sourceItemId = IDS[index], generator = KEYS[index];
    let prompt, answer, solution, diagram, rows;
    if (index === 0) {
      const f = stairFacts(d), rate = fmt(d.rate / 100);
      prompt = `떨어진 높이의 ${rate}배만큼 튀어 오르는 공이 있습니다. `;
      if (level === 0) prompt += `그림과 같이 공을 ${d.initial}cm 높이에서 떨어뜨렸습니다. 세 번째로 튀어 오른 공의 바닥으로부터의 높이는 몇 cm인지 구하세요.`;
      else prompt += `그림과 같이 계단 위에서 공을 떨어뜨렸더니 세 번째로 튀어 오른 공의 높이가 바닥으로부터 ${fmt(f.final)}cm였습니다. ` + (level === 2 ? "□ 안에 알맞은 수와 맨 아래 바닥에서 처음 공까지의 높이를 각각 구하세요." : "□ 안에 알맞은 수를 구하세요.");
      const releaseHeight = d.initial + d.steps.reduce((sum, step) => sum + step, 0);
      answer = level === 0 ? `${fmt(f.final)}cm` : level === 2 ? `처음 ${d.initial}cm, 바닥에서 처음 공까지 ${releaseHeight}cm` : `${d.initial}cm`;
      rows = level === 0 ? [
        ["첫 번째", `${d.initial}×${rate}=${fmt(f.bounce1)}cm`],
        ["두 번째", `(${fmt(f.bounce1)}+${d.steps[0]})×${rate}=${fmt(f.bounce2)}cm`],
        ["세 번째", `(${fmt(f.bounce2)}+${d.steps[1]})×${rate}+${d.steps[2]}=${fmt(f.final)}cm`]
      ] : [
        ["세 번째", `${fmt(f.final)}-${d.steps[2]}=${fmt(f.bounce3)}cm`],
        ["두 번째", `${fmt(f.bounce3)}÷${rate}-${d.steps[1]}=${fmt(f.bounce2)}cm`],
        ["첫 번째", `${fmt(f.bounce2)}÷${rate}-${d.steps[0]}=${fmt(f.bounce1)}cm`],
        ["처음 높이", `${fmt(f.bounce1)}÷${rate}=${d.initial}cm`]
      ];
      if (level === 2) rows.push(["바닥에서 처음", `${d.initial}+${d.steps.join("+")}=${releaseHeight}cm`]);
      solution = level === 0 ? "튀어 오른 높이에 다음 계단까지의 높이 차를 더한 뒤 다시 튀는 비율을 곱합니다. 마지막에는 바닥까지의 높이 차를 더합니다." : "바닥까지의 높이 차를 빼고, 튀는 비율로 나누어 거꾸로 처음 높이를 구합니다. 각 높이는 그때 공이 닿았던 계단을 기준으로 합니다.";
      if (level === 2) solution += " 맨 아래 바닥에서 처음 공까지의 높이는 처음 떨어뜨린 높이에 세 계단의 높이 차를 모두 더합니다.";
      diagram = (solved) => stairSvg(d, level, solved, pool);
    } else {
      const f = pondFacts(d), a = fmt(d.a / 100), b = fmt(d.b / 100);
      prompt = level === 0 ? `길이가 ${d.length}cm로 같은 막대 2개로 연못의 깊이를 쟀습니다. ` : "길이가 같은 막대 2개로 A, B 두 지점의 연못 깊이를 쟀습니다. ";
      prompt += `A 지점에서는 막대의 ${a}만큼, B 지점에서는 ${b}만큼 물에 잠겼습니다. `;
      if (level !== 0) prompt += `수면 위로 나온 막대 길이의 차는 ${fmt(f.gap)}cm입니다. `;
      prompt += level === 2 ? "A, B 두 지점의 깊이의 평균을 구하세요." : "A 지점에서 연못의 깊이를 구하세요.";
      answer = `${fmt(level === 2 ? (f.depthA + f.depthB) / 2 : f.depthA)}cm`;
      rows = level === 0 ? [] : [["잠긴 비율의 차", `${b}-${a}=${fmt((d.b - d.a) / 100)}`], ["막대 길이", `${fmt(f.gap)}÷${fmt((d.b - d.a) / 100)}=${d.length}cm`]];
      rows.push(["A 깊이", `${d.length}×${a}=${fmt(f.depthA)}cm`]);
      if (level === 2) rows.push(["B 깊이", `${d.length}×${b}=${fmt(f.depthB)}cm`], ["평균", `(${fmt(f.depthA)}+${fmt(f.depthB)})÷2=${fmt((f.depthA + f.depthB) / 2)}cm`]);
      solution = level === 0 ? "막대 전체 길이에 물에 잠긴 비율을 곱하면 A 지점의 깊이가 됩니다." : "막대 길이가 같으므로 수면 위 길이의 차와 물에 잠긴 길이의 차가 같습니다. 비율의 차로 막대 길이를 구한 뒤 각 깊이를 구합니다.";
      diagram = (solved) => pondSvg(d, level, solved, pool);
    }
    return { prompt: prompt + diagram(false), answer, solution, answerVisual: `<div class="verified-answer-diagram" data-answer-source="${sourceItemId}">${diagram(true)}${board(rows)}</div>`, sourceItemId, generator, generationMode: "fixed-verified-pool", verifiedPoolIndex: pool, verifiedVariantCount: 3, variantProvenance: pool === 0 && level === 1 ? "source-values" : "source-structure-variant", difficultyDesign: ["forward-or-given-whole", "source", "extra-derived-target"][level] };
  }
  const api = root.HSE_GENERATORS;
  if (api) {
    const originalKey = api.generatorKey, originalGenerate = api.generate;
    api.generatorKey = type => {
      const i = IDS.indexOf(type?.sourceItemId);
      return i < 0 ? originalKey(type) : type.reviewLocked ? "" : KEYS[i];
    };
    api.generate = (type, rank, offset, seed, variant = 0) => {
      const i = IDS.indexOf(type?.sourceItemId);
      if (i < 0) return originalGenerate(type, rank, offset, seed, variant);
      if (type.reviewLocked) throw new Error(`${type.sourceItemId}: 검수 대기`);
      return generate(i, Math.max(0, Math.min(2, 1 + Number(offset || 0))), variant);
    };
    for (const key of KEYS) if (!api.names.includes(key)) api.names.push(key);
  }
  if (typeof module !== "undefined") module.exports = { IDS, KEYS, pools, stairFacts, stairModel, pondFacts, pondModel, generate };
})(typeof window !== "undefined" ? window : globalThis);
