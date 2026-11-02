import { createClient } from 'npm:@supabase/supabase-js@2.95.3';
import bank from './bank-private.json' with {type:'json'};
import {publicExam,publicQuestions,makeSelfReport,applyReview,validGrant,fixedEqual} from './core.mjs';
const origins=new Set(['https://lete-on.gfieldacademy.net','https://docssam1.github.io','http://127.0.0.1:8879']);
const encoder=new TextEncoder();
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
const random=()=>hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
const digest=async(s:string)=>hex(await crypto.subtle.digest('SHA-256',encoder.encode(s)));
function secret(){let named={};try{named=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');}catch{}return named['default']||Deno.env.get('SUPABASE_SECRET_KEY')||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';}
const serviceKey=secret();
const db=createClient(Deno.env.get('SUPABASE_URL')||'',serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
const hmacKey=crypto.subtle.importKey('raw',encoder.encode(serviceKey),{name:'HMAC',hash:'SHA-256'},false,['sign']);
async function signature(s:string){return hex(await crypto.subtle.sign('HMAC',await hmacKey,encoder.encode(s)));}
async function codeHash(code:string,salt:string){const k=await crypto.subtle.importKey('raw',encoder.encode(code),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',salt:encoder.encode(salt),iterations:100000,hash:'SHA-256'},k,256));}
function headers(req:Request,type='application/json; charset=utf-8'){
 const h=new Headers({'Content-Type':type,'Cache-Control':'private, no-store','Pragma':'no-cache','X-Content-Type-Options':'nosniff','Vary':'Origin','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'GET, POST, PATCH, OPTIONS','Access-Control-Max-Age':'600'});
 const origin=req.headers.get('origin');if(origin&&origins.has(origin))h.set('Access-Control-Allow-Origin',origin);return h;
}
const json=(req:Request,v:unknown,status=200)=>new Response(JSON.stringify(v),{status,headers:headers(req)});
function fail(code:string,status=400):never{throw Object.assign(new Error(code),{status});}
async function body(req:Request){if(!req.headers.get('content-type')?.startsWith('application/json'))fail('json_required',415);if(Number(req.headers.get('content-length')||0)>30000)fail('request_too_large',413);const reader=req.body?.getReader();if(!reader)fail('request_invalid');let text='',size=0;const decoder=new TextDecoder();while(true){const part=await reader.read();if(part.done)break;size+=part.value.byteLength;if(size>30000){await reader.cancel();fail('request_too_large',413);}text+=decoder.decode(part.value,{stream:true});}text+=decoder.decode();try{const value=JSON.parse(text);if(!value||typeof value!=='object'||Array.isArray(value))fail('request_invalid');return value;}catch{fail('request_invalid');}}
function checked(result:any){if(result.error)fail('storage_unavailable',503);return result.data;}
async function session(hash:string){const s=checked(await db.from('highselect_sessions').select('student_id,expires_at').eq('token_hash',hash).maybeSingle());if(!s||Date.parse(s.expires_at)<=Date.now())fail('login_required',401);const student=checked(await db.from('highselect_students').select('id,name,active,exam_grants,expires_at').eq('id',s.student_id).maybeSingle());if(!student?.active||Date.parse(student.expires_at)<=Date.now())fail('login_required',401);return student;}
async function student(req:Request){const token=req.headers.get('authorization')?.replace(/^Bearer /,'')||'';if(!/^[a-f0-9]{64}$/.test(token))fail('login_required',401);return {account:await session(await digest(token)),hash:await digest(token)};}
async function admin(req:Request){const token=req.headers.get('authorization')?.replace(/^Bearer /,'')||'';const {data,error}=await db.auth.getUser(token);if(error||!data.user||data.user.is_anonymous)fail('admin_required',403);const role=data.user.app_metadata?.role||data.user.app_metadata?.gfield_role;if(!['admin','teacher'].includes(role))fail('admin_required',403);const account=checked(await db.from('hs_accounts').select('role,active').eq('user_id',data.user.id).maybeSingle());if(!account?.active||!['admin','teacher'].includes(account.role))fail('admin_required',403);return data.user.id;}
function exam(id:string){const e=bank.exams.find((x:any)=>x.id===id);if(!e)fail('exam_not_found',404);return e;}
Deno.serve(async req=>{
 try{
  const origin=req.headers.get('origin');if(origin&&!origins.has(origin))return json(req,{error:'origin_not_allowed'},403);
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:headers(req)});
  const url=new URL(req.url),action=url.searchParams.get('action')||'status';
  if(action==='status'&&req.method==='GET')return json(req,{ready:true,exams:bank.exams.map(publicExam)});
  if(action==='login'&&req.method==='POST'){
   const b=await body(req),name=String(b.name||'').normalize('NFC').trim(),code=String(b.code||'').trim();
   if(!name||name.length>80||code.length<8||code.length>80)fail('login_failed',401);
   const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';
   for(const key of ['name:'+name,'ip:'+ip]){const allowed=checked(await db.rpc('highselect_take_login_attempt',{limit_key:key.split(':')[0]+':'+await digest(key)}));if(!allowed)fail('try_later',429);}
   const candidates=checked(await db.from('highselect_students').select('id,name,code_salt,code_hash,active,expires_at').eq('name',name).eq('active',true).limit(5));
   let found=null;for(const account of candidates){if(Date.parse(account.expires_at)>Date.now()&&fixedEqual(await codeHash(code,account.code_salt),account.code_hash))found=account;}
   if(!found){await codeHash(code,'invalid-account-padding');fail('login_failed',401);}
   const token=random(),expires=new Date(Date.now()+4*3600000).toISOString();checked(await db.from('highselect_sessions').insert({token_hash:await digest(token),student_id:found.id,expires_at:expires}));
   return json(req,{token,expiresAt:expires,name:found.name});
  }
  if(action==='logout'&&req.method==='POST'){const s=await student(req);checked(await db.from('highselect_sessions').update({expires_at:new Date().toISOString()}).eq('token_hash',s.hash));return json(req,{ok:true});}
  if(action==='admin-list'&&req.method==='GET'){await admin(req);const students=checked(await db.from('highselect_students').select('id,name,active,exam_grants,expires_at,created_at').eq('is_test',false).order('created_at',{ascending:false}).limit(200));return json(req,{exams:bank.exams.map(publicExam),students});}
  if(action==='admin-grant'&&req.method==='POST'){
   const by=await admin(req),b=await body(req),name=String(b.name||'').normalize('NFC').trim();
   const grants=Array.isArray(b.exams)?[...new Set(b.exams)]:[];if(!name||name.length>80||grants.length<1||grants.some(x=>!bank.exams.some(e=>e.id===x)))fail('grant_invalid');
   const expires=Date.parse(String(b.expiresAt));if(!Number.isFinite(expires)||expires<Date.now()||expires>Date.now()+366*86400000)fail('expiry_invalid');
   const code=random().slice(0,12).toUpperCase(),salt=random();
   const row=checked(await db.from('highselect_students').insert({name,code_hash:await codeHash(code,salt),code_salt:salt,exam_grants:grants,expires_at:new Date(expires).toISOString(),created_by:by}).select('id,name,exam_grants,expires_at').single());
   return json(req,{student:row,approvalCode:code},201);
  }
  if(action==='admin-attempts'&&req.method==='GET'){await admin(req);const rows=checked(await db.from('highselect_attempts').select('id,exam_id,created_at,report,revision,student:highselect_students!inner(name,is_test)').eq('student.is_test',false).order('created_at',{ascending:false}).limit(100));return json(req,{attempts:rows});}
  if(action==='admin-attempt'&&req.method==='GET'){await admin(req);const id=url.searchParams.get('id');if(!id||!/^[a-f0-9-]{36}$/.test(id))fail('attempt_invalid');const row=checked(await db.from('highselect_attempts').select('id,exam_id,created_at,responses,report,revision,review_history,student:highselect_students(name)').eq('id',id).maybeSingle());if(!row)fail('attempt_not_found',404);return json(req,row);}
  if(action==='admin-review'&&req.method==='POST'){
   const by=await admin(req),b=await body(req);if(!/^[a-f0-9-]{36}$/.test(b.id)||!Number.isSafeInteger(b.revision))fail('review_invalid');
   const row=checked(await db.from('highselect_attempts').select('id,report,revision,review_history').eq('id',b.id).maybeSingle());if(!row)fail('attempt_not_found',404);if(row.revision!==b.revision)fail('review_changed',409);
   let report;try{report=applyReview(row.report,b.number,b.decision);}catch{fail('review_invalid');}
   const history=[...(row.review_history||[]),{number:b.number,decision:b.decision,reviewedBy:by,reviewedAt:new Date().toISOString()}];
   const updated=checked(await db.from('highselect_attempts').update({report,revision:row.revision+1,review_history:history}).eq('id',b.id).eq('revision',row.revision).select('id,report,revision').maybeSingle());if(!updated)fail('review_changed',409);return json(req,updated);
  }
  if(action==='admin-disable'&&req.method==='POST'){await admin(req);const b=await body(req);if(!/^[a-f0-9-]{36}$/.test(b.id))fail('student_invalid');checked(await db.from('highselect_students').update({active:false}).eq('id',b.id));return json(req,{ok:true});}
  if(action==='asset'&&req.method==='GET'){
   const id=url.searchParams.get('exam')||'',sub=url.searchParams.get('sub')||'',kind=url.searchParams.get('kind')||'paper',page=Number(url.searchParams.get('page')),exp=Number(url.searchParams.get('exp')),sig=url.searchParams.get('sig')||'';
   if(!['paper','answers'].includes(kind))fail('page_invalid',403);
   if(!/^[a-f0-9]{64}$/.test(sub)||!Number.isSafeInteger(page)||!Number.isSafeInteger(exp)||exp<Math.floor(Date.now()/1000)||exp>Math.floor(Date.now()/1000)+600)fail('page_expired',403);
   if(!fixedEqual(await signature([id,sub,kind,page,exp].join('|')),sig))fail('page_invalid',403);
   const s=await session(sub),e=exam(id);if(!validGrant(s,id))fail('exam_not_approved',403);
   if(e.assetFunction)fail('page_not_found',404);
   const asset=(kind==='answers'?e.answerPages:e.pages)?.[page-1];if(!asset)fail('page_not_found',404);
   const bytes=Uint8Array.from(atob(asset),c=>c.charCodeAt(0));return new Response(bytes,{headers:headers(req,'image/jpeg')});
  }
  const s=await student(req);
  if(action==='exams'&&req.method==='GET')return json(req,{name:s.account.name,exams:bank.exams.filter(e=>validGrant(s.account,e.id)).map(publicExam)});
  if(action==='attempts'&&req.method==='GET'){const rows=checked(await db.from('highselect_attempts').select('id,exam_id,report,created_at').eq('student_id',s.account.id).order('created_at',{ascending:false}).limit(30));return json(req,{attempts:rows.filter(row=>validGrant(s.account,row.exam_id))});}
  if(action==='attempt'&&req.method==='GET'){
   const id=url.searchParams.get('id');if(!id||!/^[a-f0-9-]{36}$/.test(id))fail('attempt_invalid');const row=checked(await db.from('highselect_attempts').select('id,report,created_at,exam_id').eq('id',id).eq('student_id',s.account.id).maybeSingle());if(!row||!validGrant(s.account,row.exam_id))fail('attempt_not_found',404);return json(req,row);
  }
  const e=exam(url.searchParams.get('exam')||'');if(!validGrant(s.account,e.id))fail('exam_not_approved',403);
  if(['manifest','answers'].includes(action)&&req.method==='GET'){
   const kind=action==='answers'?'answers':'paper',assets=kind==='answers'?e.answerPages:e.pages;if(!assets?.length)fail('pages_unavailable',404);
   const exp=Math.floor(Date.now()/1000)+600;const pages=await Promise.all(assets.map(async(_:string,i:number)=>{
    const q=new URLSearchParams({action:'asset',exam:e.id,sub:s.hash,kind,page:String(i+1),exp:String(exp),sig:await signature([e.id,s.hash,kind,i+1,exp].join('|'))});return {number:i+1,url:(Deno.env.get('SUPABASE_URL')||url.origin).replace(/\/$/,'')+'/functions/v1/'+(e.assetFunction||'highselect-exams')+'?'+q};
   }));return json(req,{exam:publicExam(e),questions:publicQuestions(e),pages,expiresAt:new Date(exp*1000).toISOString()});
  }
  if(action==='submit'&&req.method==='POST'){
   const b=await body(req);if(b.version!==e.version)fail('exam_version_changed',409);
   if(b.method!=='self-check')fail('self_check_required',409);
   let report;try{report=makeSelfReport(e,b.responses);}catch{fail('response_invalid');}
   const row=checked(await db.from('highselect_attempts').insert({student_id:s.account.id,exam_id:e.id,exam_version:e.version,mode:e.mode,responses:b.responses,report}).select('id,created_at').single());return json(req,{...row,report},201);
  }
  return json(req,{error:'route_not_found'},404);
 }catch(error){return json(req,{error:error?.status?error.message:'service_unavailable'},error?.status||503);}
});
