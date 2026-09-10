(function(root){
 'use strict';
 let epoch=0;
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const identity=()=>root.HFChallengeAccess?.watermarkIdentity?.();
 const same=(a,b)=>!!a&&!!b&&a.studentId===b.studentId&&a.name===b.name;
 function permitted(body){const access=root.HFChallengeAccess;if(body.action==='document')return access.allow(body.productKey);if(body.action==='bank')return access.allow('challenge-bank',body.typeId);const source=root.HFChallengePublicCatalog?.variants?.find(v=>v.round===body.round&&v.section===body.section&&v.number===body.number);return !!source&&(access.allow('challenge-mock-'+body.round)||access.allow('challenge-bank',source.typeId));}
 function safeHtml(value){
  const doc=new DOMParser().parseFromString(String(value||''),'text/html');
  doc.querySelectorAll('script,iframe,object,embed,link,meta,base,form,input,button,textarea,select,style').forEach(el=>el.remove());
  for(const el of doc.body.querySelectorAll('*'))for(const attr of [...el.attributes]){
   const key=attr.name.toLowerCase(),value=attr.value.trim();
   if(key.startsWith('on')||key==='srcdoc'||key==='srcset'||(key==='style'&&/url\s*\(|expression|@import/i.test(value)))el.removeAttribute(attr.name);
   else if(['src','href','xlink:href','action','formaction'].includes(key)&&!(/^#[\w-]+$/.test(value)||(/^data:image\/(png|jpeg|webp);base64,[a-z\d+/=\s]+$/i.test(value)&&['img','image'].includes(el.tagName.toLowerCase()))||value==='assets/gfield-logo.png'))el.removeAttribute(attr.name);
  }
  return doc.body.innerHTML;
 }
 async function request(body){
  const requestEpoch=epoch,student=identity();if(!permitted(body)||!student)throw Error('이 자료의 이용 승인을 확인하세요.');
  const client=await root.GFieldHFSupabase?.ready();if(!client)throw Error('자료 서버에 연결할 수 없습니다.');
  const {data,error}=await client.functions.invoke('challenge-content',{body});
  if(requestEpoch!==epoch||!permitted(body)||!same(student,identity()))throw Error('승인 학생 또는 이용 상태가 바뀌었습니다.');
  if(error||!data||data.verified!==true||data.studentId!==student.studentId||data.approvedStudentName!==student.name||!Number.isFinite(data.validUntil)||data.validUntil<=Date.now()||typeof data.contentVersion!=='string')throw Error('승인 자료를 안전하게 확인하지 못했습니다.');
  if(root.HFChallengePublicCatalog?.contentVersion&&data.contentVersion!==root.HFChallengePublicCatalog.contentVersion)throw Error('교재가 갱신되었습니다. 화면을 새로 열어 주세요.');
  const result=JSON.parse(JSON.stringify(data));
  if(result.document)result.document.html=safeHtml(result.document.html);
  for(const obj of [result.question,result.answer])if(obj){if(obj.problemHtml)obj.problemHtml=safeHtml(obj.problemHtml);if(obj.solutionDiagram)obj.solutionDiagram=safeHtml(obj.solutionDiagram);if(obj.answerHtml)obj.answerHtml=safeHtml(obj.answerHtml);}
  return result;
 }
 function stamp(node){const name=identity()?.name;if(!name)throw Error('승인 학생을 확인할 수 없습니다.');
  node.querySelectorAll('.book-watermark,.exam-page > .watermark').forEach(x=>x.remove());
  node.querySelectorAll('.concept-page:not(.book-blank)').forEach(page=>{const mark=document.createElement('div');mark.className='book-watermark';mark.innerHTML=Array(3).fill('<span>'+esc('GFIELD · LETE-ON · '+name)+'</span>').join('');page.append(mark);});
  node.querySelectorAll('.exam-page:not(.blank-page)').forEach(page=>{const mark=document.createElement('div');mark.className='watermark';mark.setAttribute('aria-hidden','true');for(let i=0;i<3;i++){const line=document.createElement('span');line.textContent='GFIELD · LETE-ON · '+name;mark.append(line);}page.append(mark);});
  node.querySelectorAll('.candidate-fields label:first-child span,.name-line span').forEach(x=>x.textContent=name);
 }
 root.addEventListener('hfchallengeaccesschange',()=>{epoch++;});
 root.HFChallengeContent=Object.freeze({request,safeHtml,stamp});
})(window);
