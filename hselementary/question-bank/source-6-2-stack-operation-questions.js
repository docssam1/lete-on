(() => {
  "use strict";
  const api = window.HSE_GENERATORS;
  const contracts = window.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTION_CONTRACTS;
  const names = {top:"위",front:"앞",right:"오른쪽",back:"뒤",left:"왼쪽"};
  const definitions = Object.freeze([
    {sourceItemId:"6-2-u3-e1-example-2",key:"sourceGrade6SecondSpaceE1StackRemovalLabels"},
    {sourceItemId:"6-2-u3-e1-mission-5",key:"sourceGrade6SecondSpaceE1StackAddViews"},
    {sourceItemId:"6-2-u3-e1-mission-6",key:"sourceGrade6SecondSpaceE1StackRemoveBlackViews"}
  ].map(Object.freeze));
  if (!api || !contracts) throw new Error("쌓기나무 연산과 문제 조건을 먼저 불러와야 합니다.");
  function grid(values, name, filled) {
    const top = name === "top", rows = top ? values.length : Math.max(...values)+1;
    const cols = top ? values[0].length : values.length, c = 24, start = 9;
    const w = cols*c+18, h = rows*c+18, shapes = [];
    if (filled) for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) {
      if (top ? values[y][x] : rows-y <= values[x]) shapes.push(`<rect class="stack-view-cell" x="${start+x*c}" y="${start+y*c}" width="${c}" height="${c}"/>`);
    }
    for (let x=0;x<=cols;x++) shapes.push(`<line x1="${start+x*c}" y1="${start}" x2="${start+x*c}" y2="${start+rows*c}"/>`);
    for (let y=0;y<=rows;y++) shapes.push(`<line x1="${start}" y1="${start+y*c}" x2="${start+cols*c}" y2="${start+y*c}"/>`);
    return `<figure><figcaption>${names[name]}</figcaption><svg class="source62-stack-view" data-view="${names[name]}" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${names[name]}에서 본 모양을 ${filled ? "나타낸" : "그리는 빈"} 격자">${shapes.join("")}</svg>${top ? '<figcaption>앞쪽</figcaption>' : ""}</figure>`;
  }
  function panels(views, phase) {
    return `<div class="source62-operation-grids" data-phase="${phase}">${Object.entries(views).map(([name,value])=>grid(value,name,phase!=="problem")).join("")}</div>`;
  }
  function picture(id, variant, phase) {
    return `<div class="source62-operation-${phase === "before" ? "picture" : "after"}"><img src="./assets/source-6-2-operations-v3/${id}-v${variant}-${phase}.png" width="1280" height="1040" alt="${phase === "before" ? "기호 또는 검은색 블록과 방향이 표시된 쌓기나무" : "문제의 조건대로 바꾼 뒤의 쌓기나무"} 입체 그림"></div>`;
  }
  function build(d, pool, level) {
    const q = contracts.generate(d.sourceItemId,pool,level);
    const given = Object.keys(q.givenViews).length ? panels(q.givenViews,"given") : "";
    const blanks = q.answerKind === "views" ? panels(q.answerViews,"problem") : "";
    const labels = q.answerKind === "labels" ? `<p class="source62-operation-label-answer">${level === 2 ? "(1) " : ""}${q.answerLabels.join(", ")}${level === 2 ? `<br>(2) ${q.secondaryAnswerLabels.join(", ")}` : ""}</p>` : "";
    const after = q.answerKind === "views" ? picture(d.sourceItemId,pool,"after") : "";
    return {
      prompt:q.promptText+picture(d.sourceItemId,pool,"before")+given+blanks,
      answer:q.answerKind === "labels" ? q.answerLabels.join(", ")+(level===2 ? ` / ${q.secondaryAnswerLabels.join(", ")}` : "") : "그림 참조",
      answerKeyVisual:true,
      answerVisual:`<div class="source62-operation-answer" data-answer-source="${d.sourceItemId}" data-print-weight="compact">${labels}${after}${panels(q.answerViews,"answer")}</div>`,
      solution:q.solutionText,
      difficultyDesign:q.difficultyDesign,
      difficultyLevel:level,difficultyRank:level,difficultyOffset:level-1,sourceDifficultyRank:1,
      reasoningSteps:q.reasoningSteps.length,sourceStepCount:q.sourceStepCount,difficultyStepDelta:q.reasoningSteps.length-q.sourceStepCount,
      publisherAnswerVerified:false,handwrittenAnswerVerified:false
    };
  }
  const previousKey=api.generatorKey, previousGenerate=api.generate;
  const owned = type => definitions.some(d=>d.sourceItemId===type?.sourceItemId || d.key===type?.generatorKey);
  const resolve = type => definitions.find(d=>d.sourceItemId===type?.sourceItemId && (!type.generatorKey || type.generatorKey===d.key));
  api.generatorKey = type => { const d=resolve(type);return d ? type.reviewLocked ? "" : d.key : owned(type) ? "" : previousKey(type); };
  api.generate = (type,rank,offset,seed,variant=0) => {
    const d=resolve(type);
    if (!d) return owned(type) ? null : previousGenerate(type,rank,offset,seed,variant);
    if (type.reviewLocked) return null;
    offset ??= 0;
    if (![-1,0,1].includes(offset) || !Number.isSafeInteger(variant) || variant<0) throw new Error("쌓기나무 문항의 난이도 또는 변형 번호가 올바르지 않습니다.");
    const level=offset+1,pool=variant%3;
    return {...build(d,pool,level),sourceItemId:d.sourceItemId,generator:d.key,levelRank:rank,generationMode:"fixed-verified-pool",
      verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:pool,verifiedVariantId:`${d.sourceItemId}:v${pool}`,
      variantProvenance:pool===0 && level===1 ? "source-values" : "source-structure-variant"};
  };
  for (const d of definitions) if (!api.names.includes(d.key)) api.names.push(d.key);
  window.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTIONS=Object.freeze({definitions,grid,panels,registrationOnly:true});
})();
