(function(root){
 'use strict';
 const typeFor={
  'shape-nth':'SQ03','shape-count':'SQ07','number-nth':'SQ03','number-sum':'SQ08','lighter-coin':'BL01',
  'ratio-number':'QR12','ratio-price':'QR12','fraction-sum':'QR11','fraction-difference':'QR12',
  'fraction-sum-difference':'QR03','fraction-quotient-sum':'QR17','fraction-quotient-difference':'QR18','mixed-numerator':'FR01',
  'quotient-sum':'QR17','quotient-difference':'QR18','cut-count':'IC01','cut-length-time':'IC02','cut-time-scale':'IC02',
  'cut-rest-time':'IC03','chime-duration':'IC04','road-count':'IC05','road-length':'IC06','road-between':'IC07'
 };
 function variantFor(problem,nativeTypeId){
  const m=problem.meta||{},p=problem.prompt||'';
  switch(nativeTypeId){
   case 'c2-period-nth':return Object.hasOwn(m,'item')?'shape-nth':Object.hasOwn(m,'count')?'shape-count':null;
   case 'c2-period-number-sum':return Object.hasOwn(m,'v')?'number-nth':Object.hasOwn(m,'total')?'number-sum':null;
   case 'c2-fake-coin':return /1개만.*가볍/.test(p)?'lighter-coin':null;
   case 'c2-ratio-difference':return Object.hasOwn(m,'px')?'ratio-price':'ratio-number';
   case 'c2-fraction-ratio-split':return /합하면/.test(p)?'fraction-sum':'fraction-difference';
   case 'c2-improper-fraction':return /자연수 부분/.test(p)?'mixed-numerator':/몫/.test(p)?(/합은/.test(p)?'fraction-quotient-sum':'fraction-quotient-difference'):'fraction-sum-difference';
   case 'c2-quotient-remainder-pair':return /합이/.test(p)?'quotient-sum':'quotient-difference';
   case 'c2-log-cut-time':return Object.hasOwn(m,'times')?'chime-duration':Object.hasOwn(m,'rest')?'cut-rest-time':Object.hasOwn(m,'p1')?'cut-time-scale':Object.hasOwn(m,'seg')?'cut-length-time':null;
   case 'c2-road-trees':return Object.hasOwn(m,'flowers')?'road-between':/몇 m/.test(p)?'road-length':'road-count';
   case 'derived-cut-count':return 'cut-count';
   default:return null;
  }
 }
 function textKey(text,wildcard=false){let s=String(text).normalize('NFKC').toLowerCase().replace(/\s+/g,'').replace(/[，,。.!?]/g,'');return wildcard?s.replace(/\d+/g,'#'):s;}
 function matchExamples(data,text){
  const pool=[...(data.specimens||[]),...(data.providerSpecimens||[]),...(data.normalizationExamples||[])].filter(s=>s.normalization);
  return pool.filter(s=>textKey(s.problem.prompt,true)===textKey(text,true)).filter(s=>s.profileId!=='lighter-coin'||/가운데\s*1개만/.test(text)).flatMap(s=>(s.thinkingTypeIds||[s.proposedTypeId]).map(typeId=>({typeId,profileId:s.profileId,instanceId:s.instanceId,exact:textKey(s.problem.prompt)===textKey(text),normalization:s.normalization})));
 }
 root.GFieldA1={typeFor,variantFor,textKey,matchExamples};
})(globalThis);
