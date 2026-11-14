import {clean,selectKnowledge,answerFromSources} from './search.mjs';
const ORIGINS=new Set(['https://roadmap.gfieldacademy.net','https://lete-on.gfieldacademy.net','https://docssam1.github.io','http://127.0.0.1:57616','http://localhost:57616']);
export class HttpError extends Error{constructor(status,code){super(code);this.status=status;}}
const checked=async promise=>{const r=await promise;if(r.error)throw new HttpError(503,'service_unavailable');return r;};
async function hash(text){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),b=>b.toString(16).padStart(2,'0')).join('');}
function customerSource(row){
 const {status,...source}=row;
 if(row.kind==='drive'||/https:\/\/(?:drive|docs)\.google\.com\//i.test(row.source||'')){
  source.source='원장님 승인 상담 자료';
 }
 return source;
}
export function createHandler({service,ask,aiAvailable=false,now=()=>Date.now()}){
 const cache=new Map(),pending=new Map();
 async function authenticate(req){
  const token=req.headers.get('x-roadmap-session')||'';
  if(!/^[a-f0-9]{64}$/.test(token))throw new HttpError(401,'login_required');
  const tokenHash=await hash(token),stamp=new Date(now()).toISOString();
  for(const review of [false,true]){
   const {data:s}=await checked(service.from(review?'roadmap_review_sessions':'roadmap_sessions').select('user_id,session_version,expires_at').eq('token_hash',tokenHash).gt('expires_at',stamp).maybeSingle());
   if(!s)continue;
   const {data:m}=await checked(service.from(review?'roadmap_review_accounts':'roadmap_members').select(review?'user_id,active,session_version':'user_id,student_name,session_version').eq('user_id',s.user_id).maybeSingle());
   if(!m||m.session_version!==s.session_version||(review&&!m.active))throw new HttpError(401,'login_required');
   return m;
  }
  throw new HttpError(401,'login_required');
 }
 async function approved(){
  const rows=[];
  for(let offset=0;;offset+=1000){
   const {data}=await checked(service.from('roadmap_knowledge').select('id,kind,stage,title,body,source,checked_on,status,updated_at').eq('status','approved').order('id').range(offset,offset+999));
   rows.push(...(data||[]));if(!data||data.length<1000)return rows;
  }
 }
 return async req=>{
  const origin=req.headers.get('origin')||'';
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','Vary':'Origin','X-Content-Type-Options':'nosniff','Access-Control-Allow-Headers':'apikey,content-type,x-roadmap-session','Access-Control-Allow-Methods':'POST,OPTIONS'};
  if(ORIGINS.has(origin))headers['Access-Control-Allow-Origin']=origin;
  const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers});
  if(origin&&!ORIGINS.has(origin))return reply({error:'origin_not_allowed'},403);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
  try{
   const raw=await req.text();if(raw.length>9000)throw new HttpError(413,'request_too_large');
   let b;try{b=JSON.parse(raw);}catch{throw new HttpError(400,'request_invalid');}
   if(!b||!['lookup','explain'].includes(b.action))throw new HttpError(400,'request_invalid');
   const member=await authenticate(req);
   const sanitize=value=>{
    let text=clean(value);if(member.student_name?.length>=2)text=text.split(member.student_name).join('학생');return text;
   };
   const context={question:sanitize(b.question).slice(0,1000),progress:sanitize(b.progress),stage:['preschool','elementary','middle','high'].includes(b.stage)?b.stage:'all'};
   if(typeof b.previous==='string'&&b.previous.trim())context.previous=sanitize(b.previous).slice(0,600);
   if(context.question.length<2)throw new HttpError(400,'question_missing');
   const rows=await approved(),sources=selectKnowledge(rows,context);
   const revision=await hash(JSON.stringify(rows));
   const approvedSources=sources.map(customerSource);
   const answer=answerFromSources(approvedSources,context);
   const result={...answer,sources:approvedSources,revision,aiAvailable:aiAvailable&&sources.length>0,generated:false};
   if(b.action==='lookup')return reply(result);
   if(!sources.length)throw new HttpError(422,'sources_missing');
   if(!aiAvailable)throw new HttpError(503,'ai_not_configured');
   const key=await hash(JSON.stringify([member.user_id,context,revision]));
   const saved=cache.get(key);
   if(saved&&saved.expires>now())return reply({...result,detail:saved.text,generated:true,reused:true});
   if(!pending.has(key)){
    const work=(async()=>{
     const {data:allowed}=await checked(service.rpc('roadmap_counsel_take_daily',{p_subject:await hash(member.user_id),p_limit:40}));
     if(allowed!==true)throw new HttpError(429,'too_many_attempts');
     const detail=clean(await ask({context,sources:approvedSources}),6000);
     if(!detail)throw new HttpError(502,'ai_empty');
     if(cache.size>=64)cache.delete(cache.keys().next().value);
     cache.set(key,{text:detail,expires:now()+300000});return detail;
    })();
    pending.set(key,work);
   }
   let detail;try{detail=await pending.get(key);}finally{pending.delete(key);}
   return reply({...result,detail,generated:true,reused:false});
  }catch(e){return reply({error:e instanceof HttpError?e.message:'service_unavailable'},e instanceof HttpError?e.status:503);}
 };
}
