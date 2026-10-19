(() => {
  "use strict";
  const api = window.HSE_GENERATORS;
  const sourceItemId = "6-2-u3-e1-example-1", key = "sourceGrade6SecondSpaceE1StackObservation";
  const freeze = value => {
    if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  };
  // Rows run from back to front. The original six columns account for all ten cubes.
  const pools = freeze([
    [[0,0,2],[3,1,2],[1,0,1]],
    [[0,0,2],[4,1,2],[1,0,1]],
    [[0,0,2],[2,1,2],[1,0,1]]
  ]);
  const definitions = freeze([
    {sourceItemId,key,pools,names:["위","앞","오른쪽"],hardNames:["위","앞","오른쪽","뒤","왼쪽"],given:"위",steps:[2,3,5]},
    {sourceItemId:"6-2-u3-e1-mission-1",key:"sourceGrade6SecondSpaceE1StackObservationMission1",
      pools:[[[0,2,1],[2,1,0],[0,1,0],[0,3,0]],[[0,3,1],[2,1,0],[0,1,0],[0,3,0]],[[0,2,1],[2,1,0],[0,1,0],[0,2,0]]],
      names:["앞","오른쪽"],hardNames:["앞","오른쪽","뒤","왼쪽"],given:"앞",steps:[1,2,4]}
  ]);
  function views(h) {
    const front = h[0].map((_,x) => Math.max(...h.map(row => row[x])));
    const right = h.map(row => Math.max(...row)).reverse();
    return { top:h.map(row => row.map(n => +!!n)), front, right, back:[...front].reverse(), left:[...right].reverse() };
  }
  function grid(values, name, filled) {
    const top = name === "위", rows = top ? values.length : Math.max(...values)+1, cols = top ? values[0].length : values.length;
    const c = 24, start = 9, w = cols*c+18, height = rows*c+18;
    const shapes = [];
    if (filled) for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) {
      if (top ? values[y][x] : rows-y <= values[x]) shapes.push(`<rect class="stack-view-cell" x="${start+x*c}" y="${start+y*c}" width="${c}" height="${c}"/>`);
    }
    for (let x=0;x<=cols;x++) shapes.push(`<line x1="${start+x*c}" y1="${start}" x2="${start+x*c}" y2="${start+rows*c}"/>`);
    for (let y=0;y<=rows;y++) shapes.push(`<line x1="${start}" y1="${start+y*c}" x2="${start+cols*c}" y2="${start+y*c}"/>`);
    return `<figure><figcaption>${name}</figcaption><svg class="source62-stack-view" data-view="${name}" viewBox="0 0 ${w} ${height}" width="${w}" height="${height}" role="img" aria-label="${name}에서 본 모양을 ${filled ? "나타낸" : "그리는 빈"} 격자">${shapes.join("")}</svg>${top ? '<figcaption>앞쪽</figcaption>' : ""}</figure>`;
  }
  function panels(v, names, phase, givenName = null) {
    const namesToKeys = {"위":"top","앞":"front","오른쪽":"right","뒤":"back","왼쪽":"left"};
    return `<div class="source62-observation-grids" data-phase="${phase}">${names.map(name => grid(v[namesToKeys[name]],name,phase === "answer" || name === givenName)).join("")}</div>`;
  }
  function build(definition, poolIndex, level) {
    const h = definition.pools[poolIndex], v = views(h), total = h.flat().reduce((a,b) => a+b,0);
    const names = level === 2 ? definition.hardNames : definition.names;
    const scaffold = level === 0 ? ` ${definition.given}에서 본 모양은 그려져 있습니다.` : "";
    const requested = level === 0 ? names.filter(name=>name!==definition.given) : names;
    return {
      prompt:`쌓기나무 ${total}개로 만든 모양입니다.${scaffold} ${requested.join(", ")}에서 본 모양을${requested.length>1 ? " 각각" : ""} 그리세요.<div class="source62-observation-picture"><img src="./assets/source-6-2-observation/${definition.sourceItemId}-v${poolIndex}.png" width="1280" height="1040" alt="앞쪽과 오른쪽이 표시된 쌓기나무 입체 그림"></div>${panels(v,names,"problem",level===0 ? definition.given : null)}`,
      answer:"그림 참조", answerKeyVisual:true,
      answerVisual:`<div class="source62-observation-answer" data-answer-source="${definition.sourceItemId}" data-print-weight="compact">${panels(v,names,"answer")}</div>`,
      solution:`앞에서는 같은 세로줄에 겹치는 기둥 중 가장 높은 기둥까지 보입니다. 오른쪽에서는 앞쪽 기둥이 왼쪽에 보입니다.${level===2 ? " 뒤쪽과 왼쪽의 모양은 각각 앞쪽과 오른쪽 모양의 좌우가 바뀝니다." : ""}`,
      difficultyDesign:definition.given === "위" ? ["top-view-given","source-solid-to-three-views","solid-to-five-views"][level] : ["front-view-given","source-solid-to-two-views","solid-to-four-views"][level]
    };
  }
  const previousKey = api.generatorKey, previousGenerate = api.generate;
  const ownsKey = type => definitions.some(d=>d.key===type?.generatorKey);
  const ownsSource = type => definitions.some(d=>d.sourceItemId===type?.sourceItemId);
  const resolve = type => definitions.find(d=>d.sourceItemId===type?.sourceItemId && (!type.generatorKey || d.key===type.generatorKey));
  api.generatorKey = type => {const d=resolve(type);return d ? type.reviewLocked ? "" : d.key : ownsKey(type) || ownsSource(type) ? "" : previousKey(type);};
  api.generate = (type,rank,offset,seed,variant=0) => {
    const d=resolve(type);
    if (!d) return ownsKey(type) || ownsSource(type) ? null : previousGenerate(type,rank,offset,seed,variant);
    if (type.reviewLocked) return null;
    offset ??= 0;
    if (![-1,0,1].includes(offset) || !Number.isSafeInteger(variant) || variant < 0) throw new Error("쌓기나무 문항의 난이도 또는 변형 번호가 올바르지 않습니다.");
    const level = offset+1, pool = variant%d.pools.length;
    return {...build(d,pool,level), sourceItemId:d.sourceItemId, generator:d.key, generationMode:"fixed-verified-pool", verifiedVariantCount:3, verifiedVariantTarget:3,
      verifiedPoolIndex:pool, verifiedVariantId:`${d.sourceItemId}:v${pool}`, variantProvenance:pool===0 && level===1 ? "source-values" : "source-structure-variant",
      difficultyLevel:level, difficultyRank:level, difficultyOffset:offset, levelRank:rank, sourceDifficultyRank:1,
      reasoningSteps:d.steps[level], sourceStepCount:d.steps[1], difficultyStepDelta:d.steps[level]-d.steps[1], publisherAnswerVerified:false, handwrittenAnswerVerified:false};
  };
  for(const d of definitions) if (!api.names.includes(d.key)) api.names.push(d.key);
  window.HSE_SOURCE_GRADE6_STACK_OBSERVATION = freeze({sourceItemId,key,pools,definitions,views,registrationOnly:true});
})();
