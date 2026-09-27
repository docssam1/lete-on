(async function(){'use strict';
 const sources=['public-catalog.js','challenge-taxonomy.js','diagnosis-core.js','content-client.js','remote-variants.js','question-identity.js','concept-client.js','studio.js'];
 const versioned=new Set(['public-catalog.js','question-identity.js','concept-client.js','studio.js']);
 for(const src of sources)await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src+(versioned.has(src)?'?v=20260924-three-level-concept':'');script.onload=resolve;script.onerror=()=>reject(Error('학습 자료를 불러오지 못했습니다.'));document.body.append(script);});
})().catch(e=>{document.getElementById('studioMessage').textContent=e.message;document.getElementById('makeDiagnosis').disabled=true;});
