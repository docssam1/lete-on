(() => {
  "use strict";
  const api = window.HSE_GENERATORS;
  const models = window.HSE_SOURCE_GRADE6_STACK_MODELS || (typeof module !== "undefined" ? require("./source-6-2-stack-models.js") : null);
  if (!api || !models) throw new Error("쌓기나무 생성기의 연결이 필요합니다.");
  const check = (value,message) => { if (!value) throw new Error(message); };
  const sum = values => values.reduce((s,n)=>s+n,0);
  const definitions = models.definitions.map((d,index)=>Object.freeze({...d,key:index===0 ? "sourceGrade6SecondSpaceE1StackExample4" : "sourceGrade6SecondSpaceE1StackMission3",steps:[2,4,5]}));
  function view(pool, name, cue, hideRight) {
    const top=name==="위", values=top ? pool.top : name==="앞" ? pool.front : pool.right;
    const n=top ? 5 : Math.max(5,Math.max(...values)+2), c=18, left=10, y0=10, width=110, height=n*c+20+(hideRight ? 22 : 0);
    const cells=[];
    if(top) values.forEach((row,r)=>row.forEach((filled,col)=>{if(filled)cells.push(`<rect class="stack-view-cell" x="${left+(col+1)*c}" y="${y0+(r+1)*c}" width="${c}" height="${c}"/>`);}));
    else values.forEach((v,col)=>{if(hideRight&&col===1)return;for(let z=0;z<v;z++)cells.push(`<rect class="stack-view-cell" x="${left+(col+1)*c}" y="${y0+(n-2-z)*c}" width="${c}" height="${c}"/>`);});
    const grid=[];
    for(let i=0;i<=5;i++)grid.push(`<line x1="${left+i*c}" y1="${y0}" x2="${left+i*c}" y2="${y0+n*c}"/>`);
    for(let i=0;i<=n;i++)grid.push(`<line x1="${left}" y1="${y0+i*c}" x2="${left+5*c}" y2="${y0+i*c}"/>`);
    const marker=top&&cue ? `<text x="${left+(cue[1]+1.5)*c}" y="${y0+(cue[0]+1.5)*c}" dominant-baseline="central">㉠</text>` : hideRight ? `<text x="${left+2.5*c}" y="${height-10}" dominant-baseline="central">□</text>` : "";
    return `<figure><figcaption>${name}</figcaption><svg class="source62-stack-view" data-view="${name}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${name}에서 본 모양">${cells.join("")}${grid.join("")}${marker}</svg>${top ? '<figcaption class="stack-front-direction">앞쪽</figcaption>' : ""}</figure>`;
  }
  function dots() {
    const width=332,height=176,margin=16,sx=15,sy=sx/Math.sqrt(3),circles=[];
    for(let r=0; margin+r*sy<=height-margin; r++)for(let x=margin+(r%2)*sx; x<=width-margin; x+=2*sx)circles.push(`<circle cx="${x}" cy="${(margin+r*sy).toFixed(6)}" r="1.1"/>`);
    return `<svg class="source62-stack-dotgrid" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="입체 모양을 그리는 빈 등각 점격자"><rect x="1" y="1" width="${width-2}" height="${height-2}" rx="4"/>${circles.join("")}</svg>`;
  }
  function build(d,poolIndex,level) {
    const pool=d.pools[poolIndex], h=pool.heights, total=sum(h.flat()), floor=sum(pool.top.flat()), cue=level===0 ? d.countGiven ? [1,0] : [0,0] : null;
    let condition=d.countGiven ? level===2 ? `위 그림처럼 바닥에 한 층을 놓은 다음 그 위에 ${total-floor}개를 더 쌓았습니다.` : `사용한 쌓기나무는 모두 ${pool.total}개입니다.` : "";
    if(cue)condition+=` 위 그림의 ㉠칸에는 쌓기나무 ${h[cue[0]][cue[1]]}개가 쌓여 있습니다.`;
    const hiddenFront=!d.countGiven&&level===2;
    if(hiddenFront)condition=`앞에서 본 두 세로줄에 색칠할 칸 수의 합은 ${sum(pool.front)}칸입니다. □에 알맞은 높이를 먼저 구하세요.`;
    const prompt=`위, 앞, 오른쪽에서 본 모양이 그림과 같도록 쌓기나무를 쌓았습니다. ${condition ? condition+" " : ""}쌓은 모양을 점격자에 그리세요.<div class="source62-stack-projections">${view(pool,"위",cue,false)}${view(pool,"앞",null,hiddenFront)}${view(pool,"오른쪽",null,false)}</div>${dots()}`;
    const equation=value=>`<span class="math-inline-expression">${value}</span>`;
    const prelim=level===2 ? d.countGiven ? `바닥의 ${floor}개에 더 쌓은 ${total-floor}개를 더하면 ${equation(`${floor}+${total-floor}=${total}`)}개입니다. ` : `□의 높이는 ${equation(`${sum(pool.front)}-${pool.front[0]}=${pool.front[1]}`)}칸입니다. ` : "";
    const solution=d.countGiven ? `${prelim}뒤쪽 한 칸에는 ${h[0][0]}개, 맨 앞 칸에는 ${h[2][1]}개, 가운데 오른쪽 칸에는 ${h[1][2]}개가 쌓입니다. 나머지 두 칸에는 모두 ${equation(`${total}-${h[0][0]}-${h[2][1]}-${h[1][2]}=${h[1][0]+h[1][1]}`)}개가 필요합니다. 앞과 오른쪽의 모양에 맞게 쌓으면 정답 그림과 같습니다.` : `${prelim}앞에서 본 오른쪽 세로줄은 ${pool.front[1]}칸이므로 뒤쪽 오른쪽 칸에 ${h[0][1]}개가 쌓입니다. 오른쪽에서 본 가운데 줄은 ${h[1][0]}칸, 앞쪽 줄은 ${h[2][0]}칸입니다. 뒤쪽 왼쪽 칸에 ${h[0][0]}개를 쌓으면 세 모양이 모두 조건과 같습니다.`;
    return {prompt,answer:"그림 참조",answerKeyVisual:true,solution,
      answerVisual:`<div class="source62-stack-answer" data-answer-source="${d.sourceItemId}" data-print-weight="compact"><img src="./assets/source-6-2-stacks/${d.sourceItemId}-v${poolIndex}.png" width="1280" height="1040" alt="앞쪽과 오른쪽이 표시된 정답 입체 그림"></div>`,
      model:{heights:h.map(row=>[...row]),cue,hiddenFront},difficultyDesign:level===0 ? "given-one-cell-height" : level===1 ? "source-three-projections" : d.countGiven ? "floor-plus-added-count" : "missing-front-height-from-sum"};
  }
  const previousKey=api.generatorKey, previousGenerate=api.generate;
  const ownsKey=type=>definitions.some(d=>d.key===type?.generatorKey);
  const resolve=type=>definitions.find(d=>d.sourceItemId===type?.sourceItemId&&(!ownsKey(type)||d.key===type.generatorKey));
  api.generatorKey=type=>{const d=resolve(type);return d ? type.reviewLocked ? "" : d.key : ownsKey(type) ? "" : previousKey(type);};
  api.generate=(type,rank,offset,seed,variant=0)=>{
    const d=resolve(type);
    if(!d)return ownsKey(type) ? null : previousGenerate(type,rank,offset,seed,variant);
    if(type.reviewLocked)return null;
    offset??=0;
    check([-1,0,1].includes(offset),"난이도는 -1, 0, +1이어야 합니다.");
    check(Number.isSafeInteger(variant)&&variant>=0,"고정 변형 번호가 올바르지 않습니다.");
    const level=offset+1,poolIndex=variant%3,item=build(d,poolIndex,level);
    return {...item,sourceItemId:d.sourceItemId,generator:d.key,generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,verifiedPoolIndex:poolIndex,verifiedVariantId:`${d.sourceItemId}:v${poolIndex}`,
      variantProvenance:poolIndex===0&&level===1 ? "source-values" : "source-structure-variant",difficultyLevel:level,difficultyRank:level,difficultyOffset:offset,levelRank:rank,sourceDifficultyRank:1,reasoningSteps:d.steps[level],sourceStepCount:d.steps[1],difficultyStepDelta:d.steps[level]-d.steps[1],publisherAnswerVerified:false,handwrittenAnswerVerified:false};
  };
  for(const d of definitions)if(!api.names.includes(d.key))api.names.push(d.key);
  window.HSE_SOURCE_GRADE6_STACK_QUESTIONS=Object.freeze({definitions,registrationOnly:true});
})();
