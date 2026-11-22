// 6학년 원문 구조 유형 공개 등록 (2026-11-22). source-inventory-grade6.js 바로 뒤, curriculum.js 앞에서 읽습니다.
(function(root){'use strict';
const inv=root.HSE_SOURCE_INVENTORY_GRADE6;if(!inv||!Array.isArray(inv.items))return;
const R=root.HSE_GRADE6_RELEASE_20261122||{};
let n=0;inv.items.forEach(item=>{const r=R[item.sourceItemId];if(!r)return;
 Object.assign(item,{generatorKey:r.key,reviewLocked:false,reviewReason:'',sourceVerified:true,variant:0,generationMode:'fixed-verified-pool',
  verifiedVariantTarget:3,verifiedVariantCount:r.count||3,problemVisualRequired:!!r.problemVisual,answerVisualRequired:!!r.answerVisual,
  answerVisualStatus:r.answerVisual?'verified':'not-required',originalGivensIndependentlyRead:true,originalAnswersIndependentlyCalculated:true,
  sourceExact:false,officialAnswerVerified:false,publisherAnswerVerified:false,release20261122:true},r.typeLabel?{typeLabel:r.typeLabel}:{});n++;});
if(inv.totals)inv.totals.unlocked=inv.items.filter(i=>!i.reviewLocked).length;
inv.release20261122Count=n;
})(typeof window!=='undefined'?window:globalThis);
