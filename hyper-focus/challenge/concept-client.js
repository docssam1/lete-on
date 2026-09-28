(function(root){
 'use strict';

 const catalog=()=>Array.isArray(root.HFChallengePublicCatalog?.variants)?root.HFChallengePublicCatalog.variants:[];
 const taxonomy=()=>root.HFChallengeTaxonomy;
 const copy=value=>JSON.parse(JSON.stringify(value));
 const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
 const plain=(value,max)=>typeof value==='string'&&value.trim()&&value.length<=max&&!/[<>\u0000]/.test(value);
 const exact=(value,keys)=>!!value&&typeof value==='object'&&!Array.isArray(value)&&keys.every(key=>Object.hasOwn(value,key))&&Object.keys(value).every(key=>keys.includes(key));

 function described(row){
  if(!row||typeof row!=='object')return null;
  const sourceTypeId=typeof row.typeId==='string'&&row.typeId?row.typeId:row.taxonomy?.sourceTypeId;
  const source=catalog().find(item=>item.typeId===sourceTypeId);
  if(!source)return null;
  let classified=row.taxonomy;
  if(!classified){try{classified=taxonomy()?.getTaxonomy(source,source.round,source.section);}catch{return null;}}
  return {source,classified};
 }

 function has(typeId){
  if(typeof typeId!=='string'||!typeId)return false;
  return catalog().some(source=>{
   if(source.typeId===typeId)return true;
   try{return taxonomy()?.getTaxonomy(source,source.round,source.section)?.typeId===typeId;}catch{return false;}
  });
 }

 function validate(value,expected){
  const keys=['typeId','title','hierarchy','rule','steps','commonMistake','selfCheck','evidenceLabel','status','evidenceStatus'];
  if(!exact(value,keys)||value.typeId!==expected.typeId||value.status!=='verified'||value.evidenceStatus!=='verified')throw Error('이 소유형의 개념 설명을 안전하게 확인하지 못했습니다.');
  if(![value.title,value.rule,value.commonMistake,value.selfCheck,value.evidenceLabel].every(item=>plain(item,1200))||!Array.isArray(value.steps)||value.steps.length!==3||!value.steps.every(item=>plain(item,1200)))throw Error('이 소유형의 개념 설명을 검수해야 합니다.');
  const hierarchy=value.hierarchy;
  if(!exact(hierarchy,['area','majorType','subtype'])||!exact(hierarchy.area,['id','label'])||!exact(hierarchy.majorType,['id','label'])||!exact(hierarchy.subtype,['id','label']))throw Error('이 소유형의 분류 설명을 검수해야 합니다.');
  for(const item of [hierarchy.area,hierarchy.majorType,hierarchy.subtype])if(!plain(item.id,120)||!plain(item.label,200))throw Error('이 소유형의 분류 설명을 검수해야 합니다.');
  if(hierarchy.area.id!==expected.areaId||hierarchy.majorType.id!==expected.subareaId||hierarchy.subtype.id!==expected.typeId)throw Error('요청한 소유형과 개념 설명이 다릅니다.');
  return freeze(copy(value));
 }

 async function forRow(row){
  const description=described(row);if(!description)throw Error('AI 개념보기 미등록 소유형입니다.');
  const {source,classified}=description;
  if(!root.HFChallengeAccess?.allow?.('challenge-bank',source.typeId))throw Error('이 소유형의 이용 승인이 필요합니다.');
  const data=await root.HFChallengeContent?.request?.({action:'concept',typeId:source.typeId});
  if(!data||!data.concept)throw Error('개념 설명을 불러오지 못했습니다.');
  return validate(data.concept,classified);
 }

 const api=freeze({version:'hf-challenge-concept-client-v1',has,forRow});
 root.HFChallengeConceptClient=api;
 root.HFChallengeConceptGuide=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
