(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory(require("./source-6-2-stack-hidden-example3-contracts.js"));
  else root.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_PRESENTATION=factory(root.HSE_SOURCE_GRADE6_STACK_HIDDEN_EXAMPLE3_CONTRACTS);
})(typeof window!=="undefined" ? window : globalThis,function(contracts){
  "use strict";
  function picture(variant,part){return `<figure class="source62-hidden-figure"><img src="./assets/source-6-2-hidden-example3/v${variant}-${part}.png" width="1280" height="1040" alt="${part==="outer" ? "층의 위치가 표시된 쌓기나무 입체" : "어느 한 면도 보이지 않는 쌓기나무만 꺼낸 모양"}">${part==="inner" ? "<figcaption>안쪽 쌓기나무만 꺼낸 모양</figcaption>" : ""}</figure>`;}
  function render(sourceItemId,variant,level){
    const q=contracts.generate(sourceItemId,variant,level),answer=q.secondary ? `(1) ${q.answer}개, (2) ${q.secondary.answer}개` : `${q.answer}개`;
    const table=`<table><caption>원래 입체의 안쪽 개수</caption><thead><tr><th scope="col">층</th>${q.rows.map(row=>`<th scope="col">${row.layer}</th>`).join("")}</tr></thead><tbody><tr><th scope="row">개수</th>${q.rows.map(row=>`<td>${row.hidden}</td>`).join("")}</tr></tbody></table>`;
    return Object.freeze({prompt:q.promptText+`<div class="source62-hidden-given" data-source="${sourceItemId}">${picture(variant,"outer")}</div>`,answer,
      answerVisual:`<div class="source62-hidden-answer" data-source="${sourceItemId}"><p>${answer}</p>${picture(variant,"inner")}${table}</div>`,answerKeyVisual:true,
      solution:q.solutionText,sourceItemId,variant,level,difficultyDesign:q.difficultyDesign,
      registrationOnly:true,learnerReleaseVerified:false,officialAnswerVerified:false});
  }
  return Object.freeze({render,definitions:contracts.definitions,registrationOnly:true,learnerReleaseVerified:false});
});
