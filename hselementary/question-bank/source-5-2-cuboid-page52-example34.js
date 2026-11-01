(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.HSE_SOURCE52_P52_E34 = api;
  api.install(root);
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const sourceItemId = "5-2-u5-e3-example-3-4", generatorKey = "source52CubeNetChoicesPage52Example34";
  const cells = [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]];
  const marks = [ [[0,1],[1,0]], [[0,.5],[1,.5]], [[.5,0],[.5,1]],
                  [[0,0],[1,1]], [[0,.5],[1,.5]], [[0,1],[1,0]] ];
  const choices = [ ['H','\\','\\'], ['H','\\','/'], ['\\','V','/'], ['V','V','\\'], ['\\','H','H'] ];
  function netSvg() {
    const side=52, ox=18, oy=18;
    const squares=cells.map(([x,y])=>`<rect x="${ox+x*side}" y="${oy+y*side}" width="${side}" height="${side}"/>`).join('');
    const strokes=cells.map(([x,y],i)=>{const [a,b]=marks[i];return `<line x1="${ox+(x+a[0])*side}" y1="${oy+(y+a[1])*side}" x2="${ox+(x+b[0])*side}" y2="${oy+(y+b[1])*side}"/>`}).join('');
    return `<svg class="p52e34-net" viewBox="0 0 246 192" role="img" aria-label="여섯 칸의 계단 모양 전개도. 왼쪽 위부터 각 칸의 선은 대각선, 가로선, 세로선, 대각선, 가로선, 대각선입니다."><g class="face">${squares}</g><g class="mark">${strokes}</g></svg>`;
  }
  const paths={
    T:{H:'M16 16 L96 16', V:'M40 32 L72 0', '\\':'M32 0 L80 32', '/':'M0 32 L112 0'},
    F:{H:'M0 72 L80 72', V:'M40 32 L40 112', '\\':'M0 32 L80 112', '/':'M0 112 L80 32'},
    R:{H:'M80 72 L112 40', V:'M96 16 L96 96', '\\':'M80 32 L112 80', '/':'M80 112 L112 0'}
  };
  function cubeSvg(index) {
    const [t,f,r]=choices[index];
    return `<svg class="p52e34-cube" viewBox="-5 -5 122 122" role="img" aria-label="보기 ${index+1}: 윗면 ${t}, 앞면 ${f}, 오른쪽 면 ${r} 선"><g class="face"><path d="M0 32 L32 0 H112 L80 32 Z"/><path class="front" d="M0 32 H80 V112 H0 Z"/><path class="right" d="M80 32 L112 0 V80 L80 112 Z"/></g><g class="mark"><path d="${paths.T[t]}"/><path d="${paths.F[f]}"/><path d="${paths.R[r]}"/></g></svg>`;
  }
  function questionFigure() {
    return `<div class="p52e34-figure">${netSvg()}<div class="p52e34-choices">${choices.map((_,i)=>`<div class="p52e34-choice"><span>${['①','②','③','④','⑤'][i]}</span>${cubeSvg(i)}</div>`).join('')}</div></div>`;
  }
  function build() {
    const prompt=`<div class="p52e34-question" data-source-item-id="5-2-u5-e3-example-3-4" data-pool-index="0"><p>다음 중 전개도를 접었을 때 나올 수 없는 모양은 어느 것인가?</p>${questionFigure()}</div>`;
    const solution=`<div class="p52e34-solution" data-source-answer="5-2-u5-e3-example-3-4"><p>전개도를 접을 때 대각선 세 개의 양 끝을 살펴보면 여섯 끝점이 모두 서로 다른 정육면체의 꼭짓점에 놓입니다. 따라서 대각선 두 개가 한 꼭짓점에서 만날 수 없습니다.</p><p>②는 앞면과 오른쪽 면의 대각선이 같은 아래 꼭짓점에서 만나므로 만들 수 없습니다. ①, ③, ④, ⑤는 전개도를 접은 뒤 적절히 돌리면 만들 수 있습니다.</p><p><strong>답: ②</strong></p></div>`;
    return Object.freeze({prompt,solution,answer:'②',publisherKeyVerified:false,publisherAnswerVerified:false,
      sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,
      verifiedVariantId:`${sourceItemId}:outward-fold-choices-2`,generationMode:'fixed-verified-pool',
      verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,
      sourceStructurePreserved:true,answerVisualRequired:false,answerVisualStatus:'not-required',
      sourcePdfPage:48,sourcePrintedPage:52,answerVerification:'independent-24-rotations-and-distinct-diagonal-endpoints'});
  }
  function belongs(type) { return Boolean(type && (type.id===sourceItemId || type.sourceItemId===sourceItemId || type.generatorKey===generatorKey)); }
  function resolves(type) { return Boolean(type && type.id===sourceItemId && type.sourceItemId===sourceItemId && type.generatorKey===generatorKey && type.sourceVerified===true && type.reviewLocked===false); }
  function install(target) {
    const bank=target?.HSE_GENERATORS;
    if(!bank||typeof bank.generatorKey!=='function'||typeof bank.generate!=='function') return false;
    if(bank.__source52P52E34Installed) return true;
    const oldKey=bank.generatorKey.bind(bank), oldGenerate=bank.generate.bind(bank);
    bank.generatorKey=type=>belongs(type)?(resolves(type)?generatorKey:''):oldKey(type);
    bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?(resolves(type)&&Number(variant)===0?build():null):oldGenerate(type,user,difficulty,seed,variant);
    if(Array.isArray(bank.names)&&!bank.names.includes(generatorKey)) bank.names.push(generatorKey);
    Object.defineProperty(bank,'__source52P52E34Installed',{value:true});return true;
  }
  return Object.freeze({sourceItemId,generatorKey,cells,marks,choices,netSvg,cubeSvg,questionFigure,build,belongs,resolves,install});
});
