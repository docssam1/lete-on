(function(root){
 'use strict';

 // These fields describe where/how a task was generated, not the task a child sees.
 // They must never make an otherwise identical fixed variant look unique.
 const volatilePayloadKeys=new Set([
  'seed','difficulty','difficultylabel','sourcetypeid','typeid','answer','answerhtml',
  'answers','answercandidates','solution','solutiondiagram','generatorid','rendererid',
  'variantid','questionid','occurrenceid','remotereference','createdat','generatedat','revision'
 ]);

 function text(value){
  return String(value==null?'':value).normalize('NFC').replace(/\s+/g,' ').trim();
 }

 function canonicalPayload(value,ancestors=new WeakSet()){
  if(value==null||typeof value==='boolean'||typeof value==='number')return value;
  if(typeof value==='string'||typeof value==='bigint')return text(value);
  if(typeof value!=='object')return null;
  if(ancestors.has(value))return '[순환 참조]';
  ancestors.add(value);
  let result;
  if(Array.isArray(value))result=value.map(item=>canonicalPayload(item,ancestors));
  else result=Object.fromEntries(Object.keys(value)
   .filter(key=>!volatilePayloadKeys.has(key.toLocaleLowerCase()))
   .sort()
   .map(key=>[key,canonicalPayload(value[key],ancestors)]));
  ancestors.delete(value);
  return result;
 }

 function visibleMarkup(value){
  return text(value)
   .replace(/\s(?:id|data-(?:seed|variant-id|question-id|generated-id|uid))\s*=\s*(["'])[^"']*\1/gi,'')
   .replace(/\s(?:id|data-(?:seed|variant-id|question-id|generated-id|uid))\s*=\s*[^\s>]+/gi,'')
   .replace(/url\(\s*#[^)]+\)/gi,'url(#volatile)')
   .replace(/\s(?:href|xlink:href|for|aria-labelledby|aria-describedby)\s*=\s*(["'])#?[^"']*\1/gi,'')
   .replace(/>\s+</g,'><')
   .replace(/\s+/g,' ')
   .trim();
 }

 function signatures(question){
  if(!question||typeof question!=='object')throw new TypeError('문항 정보가 필요합니다.');
  const visible=visibleMarkup(`${question.prompt||''}\n${question.problemHtml||''}`);
  const payload=question.payload==null?'':JSON.stringify(canonicalPayload(question.payload));
  const id=text(question.id||'');
  return Object.freeze({
   visible:visible?`visible:${visible}`:'',
   payload:payload&&payload!=='{}'&&payload!=='null'?`payload:${payload}`:'',
   id:id?`id:${id}`:''
  });
 }

 function createRegistry(){
  const seen={visible:new Set(),payload:new Set(),id:new Set()};
  return Object.freeze({
   has(questionOrSignatures){
    const current=questionOrSignatures&&Object.hasOwn(questionOrSignatures,'visible')?questionOrSignatures:signatures(questionOrSignatures);
    return Object.entries(current).some(([kind,signature])=>signature&&seen[kind].has(signature));
   },
   add(questionOrSignatures){
    const current=questionOrSignatures&&Object.hasOwn(questionOrSignatures,'visible')?questionOrSignatures:signatures(questionOrSignatures);
    if(Object.entries(current).some(([kind,signature])=>signature&&seen[kind].has(signature)))return false;
    Object.entries(current).forEach(([kind,signature])=>{if(signature)seen[kind].add(signature);});
    return true;
   },
   size(){return seen.visible.size||seen.payload.size||seen.id.size;}
  });
 }

 const api=Object.freeze({version:'hf-question-identity-v1',signatures,createRegistry});
 root.HFQuestionIdentity=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
