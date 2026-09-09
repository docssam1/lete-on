(function(root){'use strict';
 const catalog=root.HFChallengePublicCatalog;
 const describe=ref=>catalog.variants.find(r=>r.round===Number(ref.round)&&r.section===(ref.section||'main')&&r.number===Number(ref.number));
 const sourceRequest=(ref,part)=>({action:'source',round:Number(ref.round),section:ref.section||'main',number:Number(ref.number),part});
 async function getSource(ref){const body=sourceRequest(ref,'questions'),data=await root.HFChallengeContent.request(body);return {...data.question,remoteReference:{...body,contentVersion:data.contentVersion}};}
 async function generate(ref){try{const row=describe(ref);if(!row?.eligibility[ref.difficulty])return {status:'held',reason:'이 난이도의 준비된 문항이 없습니다.'};const body={action:'bank',typeId:row.typeId,difficulty:ref.difficulty,seed:ref.seed,part:'questions'},data=await root.HFChallengeContent.request(body);return {status:'verified',question:{...data.question,remoteReference:{...body,contentVersion:data.contentVersion}},source:{round:row.round,section:row.section,number:row.number,typeId:row.typeId}};}catch(e){return {status:'held',reason:e.message};}}
 async function answers(question){if(!question.remoteReference)return question;const {contentVersion,...body}=question.remoteReference;body.part='answers';const data=await root.HFChallengeContent.request(body),answer=data.answer||data.question;if(data.contentVersion!==contentVersion||answer?.id!==question.id)throw Error('문제와 답안의 버전이 다릅니다. 학습지를 다시 구성하세요.');return {...question,...answer};}
 root.HFChallengeVariants=Object.freeze({list:()=>catalog.variants,describe,getSource,generate,answers});
})(window);
