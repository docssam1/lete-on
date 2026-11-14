// 원자료는 영구 업로드하지 않는다. 정리한 상담 항목만 후보로 저장한다.
import {cleanEntry,HttpError} from './handler.mjs';
const MAX_FILE=12*1024*1024;
const checked=async p=>{const r=await p;if(r.error)throw new HttpError(503,'service_unavailable');return r;};
const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
const plain=s=>String(s??'').normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').trim();
const compact=s=>plain(s).replace(/\s/g,'');
export function driveReference(input){
 let u;try{u=new URL(input);}catch{throw new HttpError(400,'drive_url_invalid');}
 if(u.protocol!=='https:'||u.username||u.password||u.port||!['drive.google.com','docs.google.com'].includes(u.hostname))throw new HttpError(400,'drive_url_invalid');
 const native=u.pathname.match(/^\/(document|presentation|spreadsheets)\/d\/([\w-]{10,200})(?:\/|$)/);
 const file=u.pathname.match(/^\/file\/d\/([\w-]{10,200})(?:\/|$)/);
 const id=native?.[2]||file?.[1]||(/^\/(open|uc)$/.test(u.pathname)?u.searchParams.get('id'):null);
 if(!/^[\w-]{10,200}$/.test(id||''))throw new HttpError(400,'drive_url_invalid');
 const type=native?.[1]||'file';
 const source=type==='file'?`https://drive.google.com/file/d/${id}/view`:`https://docs.google.com/${type}/d/${id}/edit`;
 let download=type==='document'?`https://docs.google.com/document/d/${id}/export?format=txt`:
 type==='presentation'?`https://docs.google.com/presentation/d/${id}/export/pdf`:
 type==='spreadsheets'?`https://docs.google.com/spreadsheets/d/${id}/export?format=pdf`:`https://drive.google.com/uc?export=download&id=${id}`;
 const resource=u.searchParams.get('resourcekey');
 if(resource&&/^[\w-]{1,200}$/.test(resource))download+='&resourcekey='+encodeURIComponent(resource);
 return {id,type,source,download};
}
function downloadHost(url){
 const u=new URL(url);
 return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&
 (['docs.google.com','drive.google.com','drive.usercontent.google.com','drive.googleusercontent.com'].includes(u.hostname)||/^[a-z0-9-]+\.googleusercontent\.com$/.test(u.hostname));
}
export async function fetchDrive(input,fetcher=fetch){
 const ref=driveReference(input),controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),30000);
 try{
  let url=ref.download,response;
  for(let hops=0;hops<6;hops++){
   if(!downloadHost(url))throw new HttpError(403,'drive_access_required');
   response=await fetcher(url,{redirect:'manual',signal:controller.signal});
   if([301,302,303,307,308].includes(response.status)){
    const next=response.headers.get('location');await response.body?.cancel();
    if(!next)throw new HttpError(403,'drive_access_required');url=new URL(next,url).href;continue;
   }
   break;
  }
  if(!response?.ok)throw new HttpError(403,'drive_access_required');
  const mime=(response.headers.get('content-type')||'').split(';')[0];
  if(Number(response.headers.get('content-length')||0)>MAX_FILE)throw new HttpError(413,'file_too_large');
  const reader=response.body?.getReader();if(!reader)throw new HttpError(400,'file_empty');
  const chunks=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>MAX_FILE){await reader.cancel();throw new HttpError(413,'file_too_large');}chunks.push(value);}
  const data=new Uint8Array(size);let offset=0;for(const c of chunks){data.set(c,offset);offset+=c.length;}
  if(!size)throw new HttpError(400,'file_empty');
  const title='Drive 자료 '+ref.id.slice(0,12);
  if(mime==='application/pdf'||new TextDecoder().decode(data.slice(0,5))==='%PDF-'){
   if(new TextDecoder().decode(data.slice(0,5))!=='%PDF-')throw new HttpError(400,'file_type_invalid');
   let bin='';for(let i=0;i<data.length;i+=32768)bin+=String.fromCharCode(...data.subarray(i,i+32768));
   return {title,source:ref.source,type:'pdf',base64:btoa(bin)};
  }
  const text=new TextDecoder().decode(data);
  if(mime!=='text/plain'||/^\s*</.test(text))throw new HttpError(403,'drive_access_required');
  if(text.length>60000)throw new HttpError(413,'text_too_large');
  return {title,source:ref.source,type:'text',text};
 }catch(e){if(e instanceof HttpError)throw e;throw new HttpError(503,'drive_unavailable');}finally{clearTimeout(timer);}
}
export function prepareDocument(raw){
 if(!raw||!['pdf','drive'].includes(raw.type)||!['ai','extract'].includes(raw.mode))throw new HttpError(400,'document_invalid');
 if(raw.consent!==true)throw new HttpError(400,'consent_required');
 const title=plain(raw.title),stage=raw.stage||'all',checkedOn=raw.checkedOn||null;
 if(!title||title.length>120||!Array.isArray(raw.pages)||!raw.pages.length||raw.pages.length>12)throw new HttpError(400,'document_invalid');
 const source=raw.type==='drive'?driveReference(raw.source).source:plain(raw.source||title);
 cleanEntry({title,body:'검증',source,kind:raw.type==='drive'?'drive':'knowhow',stage,checkedOn});
 let textSize=0,imageSize=0;const seen=new Set();
 const pages=raw.pages.map(p=>{
  const page=Number(p.page),text=plain(p.text),image=p.image||null;
  if(!Number.isInteger(page)||page<1||page>10000||seen.has(page))throw new HttpError(400,'pages_invalid');seen.add(page);
  textSize+=text.length;
  if(image){
   if(raw.mode!=='ai'||typeof image!=='string'||image.length>700000||!/^[A-Za-z0-9+/]+={0,2}$/.test(image)||!image.startsWith('/9j/'))throw new HttpError(400,'image_invalid');
   imageSize+=image.length;
  }
  if(!text&&!image)throw new HttpError(400,'page_empty');
  return {page,text,...(image?{image}:{})};
 }).sort((a,b)=>a.page-b.page);
 if(textSize>60000||imageSize>6_000_000)throw new HttpError(413,'text_too_large');
 const location=raw.location==='text'?'text':'pages';
 if(location==='text'&&pages.some(p=>p.image))throw new HttpError(400,'document_invalid');
 return {type:raw.type,mode:raw.mode,title,source,stage,checkedOn,pages,location};
}
export function candidateEntries(result,doc){
 if(!Array.isArray(result?.items)||!result.items.length||result.items.length>6)throw new HttpError(422,'draft_invalid');
 return result.items.map(item=>{
  if(!Array.isArray(item.evidence)||!item.evidence.length||item.evidence.length>3)throw new HttpError(422,'evidence_missing');
  let scanned=false;
  const evidence=item.evidence.map(e=>{
   const page=doc.pages.find(p=>p.page===Number(e.page)),quote=plain(e.quote);
   if(!page||quote.length<8||quote.length>300||(!page.image&&!compact(page.text).includes(compact(quote))))throw new HttpError(422,'evidence_invalid');
   if(page.image)scanned=true;
   return `${doc.location==='text'?'본문 구간 '+page.page:'원문 '+page.page+'쪽'}: ${quote}`;
  });
  const fields=['summary','advice','nextCheck'];
  if(fields.some(k=>typeof item[k]!=='string'||!plain(item[k])||plain(item[k]).length>900))throw new HttpError(422,'draft_invalid');
  const body=`요약\n${plain(item.summary)}\n\n상담 안내\n${plain(item.advice)}\n\n다음 점검\n${plain(item.nextCheck)}\n\n근거 발췌\n${evidence.join('\n')}\n\n${scanned?'이미지 자료: 승인 전 원문과 숫자·일정·표를 대조하세요.':'자동 정리 초안: 승인 전 원문과 적용 대상을 확인하세요.'}`;
  return {...cleanEntry({title:plain(item.title),body,kind:doc.type==='drive'?'drive':'knowhow',stage:doc.stage,source:doc.source,checkedOn:doc.checkedOn}),status:'candidate',approved_at:null,origin:doc.type==='drive'?'drive':'admin'};
 });
}
export function extractEntries(doc){
 if(doc.pages.some(p=>p.image))throw new HttpError(400,'scan_needs_ai');
 const parts=[];
 for(const p of doc.pages){
  for(let i=0;i<p.text.length;i+=2800){parts.push({page:p.page,text:p.text.slice(i,i+2800)});}
 }
 if(parts.length>6)throw new HttpError(413,'extract_too_large');
 return parts.map((p,i)=>{
  const locator=doc.location==='text'?'본문 구간 '+p.page:'원문 '+p.page+'쪽';
  return {...cleanEntry({title:`${doc.title.slice(0,95)} · ${locator}${parts.length>1?' ('+(i+1)+')':''}`,body:`원문 발췌 · 자동 요약 아님\n${p.text}\n\n${locator}. 승인 전에 상담에 필요한 부분만 남기고 적용 대상과 표현을 확인하세요.`,source:doc.source,kind:doc.type==='drive'?'drive':'knowhow',stage:doc.stage,checkedOn:doc.checkedOn}),origin:doc.type==='drive'?'drive':'admin',status:'candidate',approved_at:null};
 });
}
export function createImports({service,organize,fetcher=fetch,aiAvailable=false}){
 const pending=new Map();
 return async({body,user,recheck})=>{
  if(body.action==='drive-source')return fetchDrive(body.url,fetcher);
  const doc=prepareDocument(body.document);
  const prefix='import:'+await hash(JSON.stringify(doc))+':';
  const existing=async()=>{
   const {data}=await checked(service.from('roadmap_knowledge').select('id,status,title').like('seed_key',prefix+'%'));
   return data||[];
  };
  const old=await existing();if(old.length)return {count:old.length,duplicate:true,items:old};
  const key=user.id+':'+prefix;
  if(pending.has(key))return pending.get(key);
  const job=(async()=>{
   let entries;
   if(doc.mode==='ai'){
    if(!aiAvailable)throw new HttpError(503,'ai_not_configured');
    const {data:allowed}=await checked(service.rpc('roadmap_counsel_take_daily',{p_subject:await hash('knowledge-import:'+user.id),p_limit:20}));
    if(allowed!==true)throw new HttpError(429,'import_limit');
    entries=candidateEntries(await organize(doc),doc);
   }else entries=extractEntries(doc);
   await recheck();
   const stamp=new Date().toISOString();
   // 한 요청의 모든 초안을 한 SQL 문으로 넣는다. 재전송은 기존 승인 상태까지 보존한다.
   await checked(service.from('roadmap_knowledge').upsert(entries.map((e,i)=>({...e,seed_key:prefix+i,updated_at:stamp})),{onConflict:'seed_key',ignoreDuplicates:true}));
   const saved=await existing();return {count:saved.length,duplicate:false,items:saved};
  })();
  pending.set(key,job);
  try{return await job;}finally{pending.delete(key);}
 };
}
