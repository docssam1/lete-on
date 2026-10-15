(function (root, factory) {
  "use strict";
  if (typeof module === "object" && module.exports) module.exports=factory(require("./source-6-2-stack-count-contracts.js"));
  else root.HSE_SOURCE_GRADE6_STACK_COUNT_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_STACK_COUNT_CONTRACTS);
})(typeof window !== "undefined" ? window : globalThis, function (contracts) {
  "use strict";
  if (!contracts?.generate) throw new Error("Stack count contracts must be loaded first");
  const names={top:"위",front:"앞",right:"오른쪽"},cellSize=26,padding=6;
  function grid(values,view,numbers=null) {
    const top=view==="top",rows=top ? values.length : Math.max(...values),cols=top ? values[0].length : values.length;
    const width=cols*cellSize+2*padding,height=rows*cellSize+2*padding,shapes=[];
    for(let row=0;row<rows;row++) for(let col=0;col<cols;col++) {
      if(!(top ? values[row][col] : rows-row<=values[col])) continue;
      const x=padding+col*cellSize,y=padding+row*cellSize;
      shapes.push(`<rect data-row="${row}" data-col="${col}" x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"/>`);
      if(top && numbers?.[row]?.[col]>0) shapes.push(`<text data-row="${row}" data-col="${col}" x="${x+cellSize/2}" y="${y+cellSize/2}" text-anchor="middle" dominant-baseline="central">${numbers[row][col]}</text>`);
    }
    return `<svg class="source62-count-grid" data-view="${view}" data-rows="${rows}" data-cols="${cols}" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${names[view]}에서 본 모양${numbers ? ', 칸 안의 수는 쌓인 개수' : ''}">${shapes.join("")}</svg>`;
  }
  function figure(values,view,numbers=null,caption=names[view]) {
    return `<figure><figcaption>${caption}</figcaption>${grid(values,view,numbers)}${view==="top" ? '<figcaption class="source62-count-front">앞쪽</figcaption>' : ''}</figure>`;
  }
  function render(sourceItemId,variant,level) {
    const q=contracts.generate(sourceItemId,variant,level);
    const given=Object.entries(q.givenViews).map(([view,values])=>figure(values,view,view==="top" ? q.condition.fixedHeights : null)).join("");
    const visualGroups=q.groups.length<=3 ? q.groups : [q.groups[0],q.groups[Math.floor(q.groups.length/2)],q.groups.at(-1)];
    const answerPictures=visualGroups.map(group=>figure(q.givenViews.top,"top",group.heights,group.label)).join("");
    const rows=q.groups.map(group=>`<tr><th scope="row">${group.label}</th><td>${group.count}가지</td></tr>`).join("");
    const answerText=q.secondary ? `(1) ${q.answer}${q.answerUnit}, (2) ${q.secondary.answer}가지` : `${q.answer}${q.answerUnit}`;
    const secondaryPictures=q.secondary ? `<section class="source62-count-secondary"><h3>추가 조건의 배치</h3><div class="source62-count-witnesses">${q.secondary.witnesses.map(witness=>figure(q.givenViews.top,"top",witness.heights,witness.label)).join("")}</div></section>` : "";
    return Object.freeze({prompt:q.promptText+`<div class="source62-count-given" data-source="${q.sourceItemId}">${given}</div>`,answer:answerText,
      answerKeyVisual:true,answerVisual:`<div class="source62-count-answer" data-source="${q.sourceItemId}"><p class="source62-count-result">${answerText}</p><h3>배치 예</h3><div class="source62-count-witnesses" data-phase="primary">${answerPictures}</div><table><caption>${q.condition.front ? '쌓기나무 수에 따른 방법' : '가장 높은 기둥 수에 따른 방법'}</caption><thead><tr><th scope="col">경우</th><th scope="col">방법 수</th></tr></thead><tbody>${rows}</tbody></table>${secondaryPictures}</div>`,
      solution:q.solutionText,difficultyDesign:q.difficultyDesign,sourceItemId,variant,level,
      registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  return Object.freeze({render,grid,definitions:contracts.definitions,registrationOnly:true,learnerReleaseVerified:false});
});
