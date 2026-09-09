(function(root){
 'use strict';
 let epoch=0,serial=0;
 const levels=new Set(['easy','same','hard']);
 const identity=()=>root.HFTypeAccess?.watermarkIdentity?.();
 const sameIdentity=(a,b)=>!!a&&!!b&&a.studentId===b.studentId&&a.name===b.name;
 const validString=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.length<=max;
 function validateRequest(input){
  if(!input||input.action!=='practice'||!['questions','answers'].includes(input.part)||!['free','paid'].includes(input.accessTier)||!Number.isInteger(input.seed)||input.seed<0||input.seed>4294967295||!Number.isInteger(input.countPerType)||input.countPerType<1||input.countPerType>(input.accessTier==='free'?2:20)||!Array.isArray(input.types)||!input.types.length||input.types.length>20)throw Error('요청한 유형과 문제 수를 확인하세요.');
  const seen=new Set();
  for(const row of input.types){if(!row||!Number.isInteger(row.typeId)||row.typeId<1||row.typeId>54||seen.has(row.typeId)||!levels.has(row.difficulty))throw Error('요청한 유형과 난이도를 확인하세요.');seen.add(row.typeId);}
  return {action:'practice',types:input.types.map(r=>({typeId:r.typeId,difficulty:r.difficulty})),countPerType:input.countPerType,seed:input.seed,accessTier:input.accessTier,part:input.part};
 }
 function permitted(body,student){
  if(root.GFIELD_HF_SUPABASE_CONFIG?.features?.securePracticeDelivery!==true||!sameIdentity(student,identity()))return false;
  return body.types.every(row=>root.HFTypeAccess?.allowType(row.typeId,{paid:body.accessTier==='paid'})===true);
 }
 function assertPools(body){
  const catalog=root.HFPracticeCatalog;
  if(!validString(catalog?.contentVersion,160)||!Array.isArray(catalog?.types))throw Error('검수된 문제 목록을 불러오지 못했습니다.');
  for(const row of body.types){const pool=catalog.types.find(t=>t.typeId===row.typeId)?.pools?.[row.difficulty]?.[body.accessTier];if(pool?.releaseStatus!=='verified'||!Number.isInteger(pool.count)||pool.count<body.countPerType)throw Error('선택한 유형·난이도는 비공개 전달 검수 중이거나 준비된 문제 수가 부족합니다.');}
 }
 // Use an inert template. Never attach unsanitized markup, load remote images, or preserve executable SVG.
 function safeHtml(value){
  if(typeof value!=='string'||value.length>2500000)throw Error('그림 자료의 형식을 확인하지 못했습니다.');
  const template=root.document.createElement('template');template.innerHTML=value;
  const tags=new Set('div span p br b strong em i small sub sup table thead tbody tfoot tr td th colgroup col figure figcaption ul ol li img svg g path rect circle ellipse line polyline polygon text tspan defs clipPath mask pattern symbol use image linearGradient radialGradient stop marker title desc'.toLowerCase().split(' '));
  const attrs=new Set('class style id role aria-label xmlns viewbox preserveaspectratio width height x y x1 x2 y1 y2 cx cy r rx ry d points fill fill-opacity fill-rule stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray stroke-dashoffset stroke-opacity opacity transform text-anchor dominant-baseline font-size font-family font-weight dx dy clip-path clip-rule mask marker-start marker-mid marker-end gradientunits gradienttransform offset stop-color stop-opacity patternunits patterncontentunits patterntransform refx refy markerwidth markerheight orient colspan rowspan scope alt src href xlink:href'.split(' '));
  const css=new Set('display align-items justify-content flex-direction flex-wrap gap row-gap column-gap grid-template-columns grid-template-rows width height min-width max-width min-height max-height margin margin-top margin-right margin-bottom margin-left padding padding-top padding-right padding-bottom padding-left border border-top border-right border-bottom border-left border-radius border-color border-width border-style color background background-color font-size font-family font-weight line-height text-align vertical-align white-space word-break overflow object-fit aspect-ratio position top right bottom left box-sizing'.split(' '));
  const prefix='hfpc-'+(++serial)+'-',ids=new Map();
  for(const el of [...template.content.querySelectorAll('*')]){
   if(!tags.has(el.localName.toLowerCase())){el.remove();continue;}
   if(el.hasAttribute('id')){const old=el.getAttribute('id');if(/^[a-zA-Z][\w:.-]{0,100}$/.test(old)){ids.set(old,prefix+old);el.setAttribute('id',prefix+old);}else el.removeAttribute('id');}
  }
  for(const el of template.content.querySelectorAll('*'))for(const attr of [...el.attributes]){
   const name=attr.name.toLowerCase(),v=attr.value.trim();
   if(!attrs.has(name)||name.startsWith('on')){el.removeAttribute(attr.name);continue;}
   if(name==='style'){
    const declarations=v.split(';').flatMap(pair=>{const i=pair.indexOf(':');if(i<0)return [];const k=pair.slice(0,i).trim().toLowerCase(),val=pair.slice(i+1).trim();if(!css.has(k)||/[\\@<>]|url\s*\(|expression|image-set|behavior|javascript|!important/i.test(val)||(k==='position'&&!/^(static|relative)$/.test(val)))return [];return [k+':'+val];});el.setAttribute('style',declarations.join(';'));
   }else if(['src','href','xlink:href'].includes(name)){
    if(v.startsWith('#')&&ids.has(v.slice(1)))el.setAttribute(attr.name,'#'+ids.get(v.slice(1)));
    else if(['img','image'].includes(el.localName.toLowerCase())&&/^data:image\/(png|jpeg|webp);base64,[a-z\d+/=\s]+$/i.test(v))el.setAttribute(attr.name,v);
    else el.removeAttribute(attr.name);
   }else if(/url\s*\(/i.test(v)){
    const match=v.match(/^url\(\s*#([\w:.-]+)\s*\)$/);if(match&&ids.has(match[1]))el.setAttribute(attr.name,'url(#'+ids.get(match[1])+')');else el.removeAttribute(attr.name);
   }
  }
  return template.innerHTML;
 }
 function rowIdentity(row){return JSON.stringify([row.id,row.number,row.typeId,row.difficulty]);}
 function validateEnvelope(data,body,student,expected){
  const now=Date.now();
  const envelopeKeys=['verified','studentId','approvedStudentName','validUntil','contentVersion','part','accessTier',body.part];
  if(!data||Object.keys(data).some(key=>!envelopeKeys.includes(key)))throw Error('전달된 자료에 허용되지 않은 정보가 포함되어 있습니다.');
  if(!data||data.verified!==true||data.studentId!==student.studentId||data.approvedStudentName!==student.name||data.part!==body.part||data.accessTier!==body.accessTier||!Number.isFinite(data.validUntil)||data.validUntil<=now||data.validUntil>now+65000||data.contentVersion!==root.HFPracticeCatalog.contentVersion)throw Error('승인 학생과 문제 자료를 안전하게 확인하지 못했습니다.');
  if(body.part==='questions'&&Object.hasOwn(data,'answers')||body.part==='answers'&&Object.hasOwn(data,'questions'))throw Error('문제와 답안의 전달 구분이 올바르지 않습니다.');
  const rows=data[body.part],expectedCount=body.types.length*body.countPerType;
  if(!Array.isArray(rows)||rows.length!==expectedCount)throw Error('요청한 문제 수와 받은 자료가 일치하지 않습니다.');
  if(body.part==='answers'&&(!expected||expected.contentVersion!==data.contentVersion||!Array.isArray(expected.questions)||expected.questions.length!==rows.length))throw Error('먼저 문제를 확인한 뒤 정답을 열어 주세요.');
  const ids=new Set(),clean=rows.map((row,i)=>{
   const target=body.types[Math.floor(i/body.countPerType)];
   const keys=body.part==='questions'?['id','number','typeId','difficulty','prompt','problemHtml']:['id','number','typeId','difficulty','answerHtml','solution','solutionDiagram'];
   if(!row||Object.keys(row).some(k=>!keys.includes(k)))throw Error('문제 또는 답안에 허용되지 않은 정보가 포함되어 있습니다.');
   if(!row||!validString(row.id,160)||ids.has(row.id)||row.number!==i+1||row.typeId!==target.typeId||row.difficulty!==target.difficulty)throw Error('문항의 유형 또는 순서가 일치하지 않습니다.');ids.add(row.id);
   const result={id:row.id,number:row.number,typeId:row.typeId,difficulty:row.difficulty};
   if(body.part==='questions'){
    if(!validString(row.prompt,50000)||typeof row.problemHtml!=='string'||['answer','answerHtml','answerText','solution','solutionDiagram'].some(k=>Object.hasOwn(row,k)))throw Error('문제 자료의 형식이 올바르지 않습니다.');
    result.prompt=row.prompt;result.problemHtml=safeHtml(row.problemHtml);
   }else{
    if(rowIdentity(row)!==rowIdentity(expected.questions[i])||typeof row.answerHtml!=='string'||typeof row.solution!=='string'||row.solution.length>50000)throw Error('문제와 정답이 일치하지 않습니다.');
    result.answerHtml=safeHtml(row.answerHtml);result.solution=row.solution;if(row.solutionDiagram!==undefined)result.solutionDiagram=safeHtml(row.solutionDiagram);
   }
   return Object.freeze(result);
  });
  return Object.freeze({verified:true,studentId:data.studentId,approvedStudentName:data.approvedStudentName,validUntil:data.validUntil,contentVersion:data.contentVersion,part:body.part,accessTier:body.accessTier,[body.part]:Object.freeze(clean)});
 }
 async function request(input,expected){
  const body=validateRequest(input),student=identity(),requestEpoch=epoch;
  if(!permitted(body,student))throw Error('선택한 유형의 이용 승인을 확인하세요.');
  assertPools(body);
  if(body.part==='answers'&&!expected)throw Error('먼저 문제를 확인한 뒤 정답을 열어 주세요.');
  const client=await root.GFieldHFSupabase?.ready();
  if(!client||requestEpoch!==epoch||!permitted(body,student))throw Error('승인 학생 또는 이용 상태가 바뀌었습니다.');
  const {data,error}=await client.functions.invoke('hyperfocus-practice-content',{body});
  if(requestEpoch!==epoch||!permitted(body,student))throw Error('승인 학생 또는 이용 상태가 바뀌었습니다.');
  if(error)throw Error('비공개 문제를 불러오지 못했습니다. 이용 승인과 검수 상태를 확인하세요.');
  return validateEnvelope(data,body,student,expected);
 }
 root.addEventListener('hf-type-access-change',()=>{epoch++;});
 root.HFPracticeContent=Object.freeze({request,safeHtml,validateRequest,sameIdentity,rowIdentity});
})(window);
