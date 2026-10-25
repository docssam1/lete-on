// 쌓기나무·입체 문제(geometry/worksheet 엔진, 유형의 worksheetCode) — 문제은행 화면 app.js와 연습 공방 drill.js가 함께 쓴다.
// app.js에 있던 문제 만들기·풀이 글·그림을 그대로 옮겨 왔다(2026-10-27). 페이지에 geometry/worksheet 스크립트(GW_GEN·GW_RENDER·GW_CARD)가 있어야 한다.

export function geometryWorksheetSolution(problem) {
  const answer = problem.answer || {};
  switch (problem.type) {
    case "TC":
      return answer.askTotal === false
        ? "앞과 오른쪽 옆에서는 각 줄에서 가장 높이 쌓인 층까지 칸을 그립니다."
        : `바탕그림의 각 칸에 적힌 수를 모두 더하면 ${answer.total}개입니다.${answer.drawViews ? " 앞과 옆에서는 각 줄에서 가장 높이 쌓인 층까지 칸을 그립니다." : ""}${answer.askHeight ? ` 가장 높은 곳은 ${answer.height}층입니다.` : ""}`;
    case "VC": {
      const values = (answer.numbers || []).flat().filter((value) => value > 0);
      return `위에서 본 모양의 각 자리에 앞·옆에서 본 가장 높은 층수를 맞춰 쓰고 더합니다. ${values.join(" + ")} = ${answer.count}이므로 ${answer.count}개입니다.`;
    }
    case "VM":
      return `세 방향의 모양을 모두 지키면서 각 자리에 놓을 수를 정합니다. 가장 많이 놓으면 ${answer.max}개, 가장 적게 놓으면 ${answer.min}개입니다.`;
    case "VP":
      return `위에서 본 모양으로 쌓은 자리를 찾고, 주어진 방향에서 보이는 가장 높은 층을 맞추면 ${answer.hiddenLabel}에서 본 모양이 정해집니다.`;
    case "IC":
      return `아래에서부터 층별로 보이는 칸과 가려진 칸을 빠짐없이 세면 모두 ${answer.total}개입니다.${answer.askFloor ? ` 그중 1층에는 ${answer.floor}개가 놓여 있습니다.` : ""}${answer.askUpper ? ` 2층 이상에는 ${answer.upper}개가 있습니다.` : ""}`;
    case "IH":
    case "IN":
      return `전체 ${answer.total}개에서 겉에서 보이는 ${answer.visible}개를 빼면 ${answer.total} - ${answer.visible} = ${answer.hidden}개입니다.`;
    case "FB":
    case "CU":
      return `상자를 가득 채우면 ${answer.total}개입니다. 지금 놓인 ${answer.placed}개를 빼면 ${answer.total} - ${answer.placed} = ${answer.need}개가 더 필요합니다.`;
    case "PN":
      return answer.variant === "faces"
        ? `겉에서 보이는 면을 방향별로 빠짐없이 세면 모두 ${answer.faces}면입니다.`
        : `쌓기나무를 하나씩 떼어 색칠된 면의 수대로 나누어 세면, ${answer.askFaces}면이 색칠된 쌓기나무는 ${answer.count}개입니다.`;
    case "BW":
      return `한 쌓기나무의 색을 정하면 맞닿은 쌓기나무는 반대색입니다. 차례로 세면 흰색 ${answer.white}개, 검은색 ${answer.black}개입니다.`;
    case "HL":
      return `가득 채운 ${answer.total}개에서 구멍으로 빠진 ${answer.removed}개를 빼면 ${answer.total} - ${answer.removed} = ${answer.remaining}개입니다.`;
    case "SQ": {
      const steps = (answer.stageTotals || []).map((value, index) => `${index + 1}번째 ${value}개`).join(" → ");
      return `${steps}${steps ? ". " : ""}규칙을 이어 보면 답은 ${problem.answerText}입니다.`;
    }
    default:
      return `그림의 조건을 차례로 확인하면 답은 ${problem.answerText}입니다.`;
  }
}

export function makeGeometryWorksheetProblem(item, intensity, sequence, fixedSeed, attempt) {
  const worksheet = globalThis.GW_GEN;
  const info = worksheet?.typeInfo(item.worksheetCode);
  if (!worksheet || !info) return null;
  const requestedLevel = item.worksheetLevel || info.levels[0];
  const baseLevel = worksheet.typeSupportsLevel(item.worksheetCode, requestedLevel) ? requestedLevel : info.levels[0];
  const baseIndex = Math.max(0, info.levels.indexOf(baseLevel));
  const levelIndex = intensity === 3
    ? Math.min(info.levels.length - 1, baseIndex + 1)
    : intensity === 1
      ? Math.max(0, baseIndex - 1)
      : baseIndex;
  const randomPart = fixedSeed || `${Date.now()}:${Math.random()}`;
  // 한 단계 내리거나 올린 수준을 그 모양(worksheetOptions.kind)이 받지 않으면 유형의 기본 수준으로 만든다
  //   (삼각 계단 쌓기나무는 L4부터라 「쉬움」이 L3로 내려가면 늘 빈 문제가 됐다)
  let made;
  for (const level of new Set([info.levels[levelIndex], baseLevel])) {
    const rng = worksheet.createRng(`FIELDS-QB:${item.id}:${level}:${intensity}:${randomPart}:${sequence}:${attempt}`);
    try {
      made = worksheet.make(item.worksheetCode, rng, level, intensity, item.worksheetOptions || null);
      break;
    } catch (_error) {
      made = null;
    }
  }
  if (!made) return null;
  const answerVisualTypes = new Set(["VC", "VM", "VP", "HL"]);
  const hasAnswerVisual = answerVisualTypes.has(made.type) || (made.type === "TC" && made.answer.drawViews);
  const icPromptMode = made.type === "IC" ? item.worksheetOptions?.promptMode : null;
  if (icPromptMode === "total" || icPromptMode === "minimum") {
    made.answer.askFloor = false;
    made.answer.askUpper = false;
    made.answerText = `${made.answer.total}개`;
  }
  const prompt = icPromptMode === "total"
    ? "다음은 쌓기나무를 쌓아 만든 입체 모양입니다. 사용된 쌓기나무는 모두 몇 개입니까?"
    : icPromptMode === "minimum"
      ? "쌓기나무로 쌓은 모양입니다. 사용된 쌓기나무는 최소 몇 개입니까?"
      : made.prompt;
  return {
    prompt,
    visual: { kind: "geometry-worksheet", problem: made, figures: made.figures },
    answer: made.answerText,
    answerVisual: hasAnswerVisual ? { kind: "geometry-worksheet-answer", problem: made } : null,
    solution: geometryWorksheetSolution(made),
    responseKind: made.type === "VP" || (made.type === "TC" && made.answer.askTotal === false) ? "drawing" : "text",
    meta: { worksheetType: made.type, worksheetLevel: made.level, intensity, ...made.answer }
  };
}

export function geometryWorksheetMarkup(visual) {
  const renderer = globalThis.GW_RENDER;
  const card = globalThis.GW_CARD;
  const problem = visual.problem || { figures: visual.figures };
  const figures = problem.figures;
  if (!renderer || !figures) return "";
  if (card?.renderFigures) {
    const method = problem.methodHint ? `<p class="geometry-method">${problem.methodHint}</p>` : "";
    const solveArea = problem.type === "HL"
      ? `<div class="geometry-hole-solve">${renderer.renderHoleLayers(problem, { blank: true })}</div>`
      : "";
    return `${method}<div class="ws-figures">${card.renderFigures(problem)}</div>${solveArea}`;
  }
  if (figures.kind === "sequence") {
    return `<div class="geometry-sequence">${figures.shapes.map((shape) => `
      <figure><div>${renderer.renderIso(shape.map, shape.width, shape.depth)}</div><figcaption>${shape.n}단계</figcaption></figure>
    `).join("")}<strong aria-hidden="true">…</strong></div>`;
  }
  if (figures.kind === "iso-box") {
    return `<figure class="geometry-box"><div>${renderer.renderIsoBox(figures.map, figures.width, figures.depth, figures.boxH)}</div><figcaption>점선은 상자 테두리입니다.</figcaption></figure>`;
  }
  if (figures.kind === "iso-walled") {
    return `<figure class="geometry-hidden"><div>${renderer.renderIsoWalled(figures.map, figures.width, figures.depth)}</div><figcaption>뒤와 왼쪽의 회색 면은 벽입니다.</figcaption></figure>`;
  }
  return "";
}
