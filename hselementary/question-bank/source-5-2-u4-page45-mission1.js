(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE45_MISSION1 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u4-e2-mission-1";
  const key = "source52DecimalMixedOperationsPage45Mission1";
  const pools = Object.freeze([
    Object.freeze({ a:[420,150,320], b:[176,235,56,235], c:[34,19,950,210,950], d:[426,530,426,410,60] }),
    Object.freeze({ a:[540,120,250], b:[345,126,125,126], c:[38,23,620,180,620], d:[428,550,428,250,40] }),
    Object.freeze({ a:[360,250,180], b:[284,175,104,175], c:[47,29,730,170,730], d:[352,650,352,410,70] })
  ]);
  const num = n => Number(n);
  const fmtScaled = (value, scale) => {
    let whole = Math.floor(value / scale), rem = value % scale;
    if (!rem) return String(whole);
    let digits = String(rem).padStart(String(scale).length - 1, "0").replace(/0+$/, "");
    return `${whole}.${digits}`;
  };
  const decimal = (hundredths) => fmtScaled(hundredths, 100);
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  function compute(pool) {
    if (!pool || !Array.isArray(pool.a) || !Array.isArray(pool.b) || !Array.isArray(pool.c) || !Array.isArray(pool.d)) throw new TypeError("확인된 네 계산식만 사용할 수 있습니다.");
    const [a1,a2,a3]=pool.a, [b1,b2,b3,b4]=pool.b, [c1,c2,c3,c4,c5]=pool.c, [d1,d2,d3,d4,d5]=pool.d;
    const scaled = [a1*a2*a3, b1*b2-b3*b4, (c1-c2)*c3*100+c4*c5, d1*(d2-d4)*d5];
    const scales = [1000000,10000,10000,1000000];
    if (scaled.some(x => !Number.isSafeInteger(x))) throw new RangeError("계산 범위를 벗어났습니다.");
    const answers = scaled.map((v,i) => fmtScaled(v,scales[i]));
    const expressions = [
      `${decimal(a1)}×${decimal(a2)}×${decimal(a3)}`,
      `${decimal(b1)}×${decimal(b2)}−${decimal(b3)}×${decimal(b4)}`,
      `(${c1}−${c2})×${decimal(c3)}+${decimal(c4)}×${decimal(c5)}`,
      `(${decimal(d1)}×${decimal(d2)}−${decimal(d3)}×${decimal(d4)})×${decimal(d5)}`
    ];
    const steps = [
      `${expressions[0]} = ${fmtScaled(a1*a2,10000)}×${decimal(a3)} = ${answers[0]}`,
      `${expressions[1]} = (${decimal(b1)}−${decimal(b3)})×${decimal(b2)} = ${decimal(b1-b3)}×${decimal(b2)} = ${answers[1]}`,
      `${expressions[2]} = (${c1}−${c2}+${decimal(c4)})×${decimal(c3)} = ${decimal((c1-c2)*100+c4)}×${decimal(c3)} = ${answers[2]}`,
      `${expressions[3]} = ${decimal(d1)}×(${decimal(d2)}−${decimal(d4)})×${decimal(d5)} = ${fmtScaled(d1*(d2-d4),10000)}×${decimal(d5)} = ${answers[3]}`
    ];
    return { answers, expressions, steps };
  }
  function build(poolIndex=0, difficultyOffset=0) {
    if (!Number.isSafeInteger(poolIndex)||poolIndex<0||poolIndex>=pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1,0,1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const data=compute(pools[poolIndex]);
    const prompt=`<div class="source52-u4-p45-m1-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>다음 식을 계산하여라.</p><ol>${data.expressions.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>${difficultyOffset<0?'<p class="source52-u4-p45-m1-hint">도움말: 같은 수가 곱해진 항을 먼저 묶어 보세요.</p>':""}</div>`;
    const solution=`<div class="source52-u4-p45-m1-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${data.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><p class="source52-u4-p45-m1-answer">답: ${data.answers.join(", ")}</p></div>`;
    return Object.freeze({ prompt, answer:`(${data.answers.join(", ")})`, solution, sourceItemId:id, generator:key, generationMode:"fixed-verified-pool", verifiedPoolIndex:poolIndex, verifiedVariantCount:pools.length, verifiedVariantTarget:pools.length, verifiedVariantId:`${id}:v${poolIndex}`, variantProvenance:"synthetic-source-structure", difficultyOffset, difficultyLevel:difficultyOffset+1, difficultyRank:difficultyOffset+1, sourceDifficultyRank:1, difficultyDesign:["common-factor-hints","common-factor-calculation","four-expression-fluency"][difficultyOffset+1], reasoningSteps:4, sourceStepCount:4, difficultyStepDelta:difficultyOffset, sourceStructurePreserved:true, sourcePdfPage:41, sourcePrintedPage:45, questionModel:{expressions:data.expressions}, answerModel:{orderedAnswers:data.answers}, answerVisualRequired:false, answerVisualStatus:"not-required", publisherKeyVerified:false, publisherAnswerVerified:false, handwrittenAnswerVerified:false, answerVerification:"exact-scaled-integer-decimal-operations" });
  }
  function belongs(type){return Boolean(type&&(type.id===id||type.sourceItemId===id||type.generatorKey===key));}
  function resolves(type){return Boolean(type&&type.id===id&&type.sourceItemId===id&&type.generatorKey===key&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type))return null;if(!Number.isSafeInteger(variant)||variant<0)throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");return build(variant%pools.length,[-1,0,1].includes(difficulty)?difficulty:0);}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U4Page45Mission1Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?key:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(key))bank.names.push(key);Object.defineProperty(bank,"__source52U4Page45Mission1Installed",{value:true});return true;}
  return Object.freeze({id,key,pools,compute,build,generate,belongs,resolves,install});
});
