import {createClient} from 'npm:@supabase/supabase-js@2.95.3';
import bank from './bank-private.json' with {type:'json'};
// Same protected asset contract as the exam function. Image bundles are split
// for the platform size limit; no public bucket or original PDF endpoint exists.
const origins=new Set(['https://lete-on.gfieldacademy.net','https://docssam1.github.io','http://127.0.0.1:8879']);
const encode=new TextEncoder();
const hex=(bytes:ArrayBuffer)=>Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
let named={};try{named=JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}');}catch{}
const secret=named['default']||Deno.env.get('SUPABASE_SECRET_KEY')||Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
const db=createClient(Deno.env.get('SUPABASE_URL')||'',secret,{auth:{persistSession:false,autoRefreshToken:false}});
const key=crypto.subtle.importKey('raw',encode.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
function equal(a:string,b:string){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0;}
Deno.serve(async req=>{
 const origin=req.headers.get('origin'),headers=new Headers({'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','Pragma':'no-cache','X-Content-Type-Options':'nosniff','Vary':'Origin','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'GET, OPTIONS'});
 if(origin&&origins.has(origin))headers.set('Access-Control-Allow-Origin',origin);
 const fail=(code:string,status=403)=>new Response(JSON.stringify({error:code}),{status,headers});
 if(origin&&!origins.has(origin))return fail('origin_not_allowed');
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 try{
  const q=new URL(req.url).searchParams;if(req.method!=='GET'||q.get('action')!=='asset')return fail('route_not_found',404);
  const id=q.get('exam')||'',sub=q.get('sub')||'',kind=q.get('kind')||'',page=Number(q.get('page')),exp=Number(q.get('exp')),sig=q.get('sig')||'';
  if(!/^[a-f0-9]{64}$/.test(sub)||!['paper','answers','analysis'].includes(kind)||!Number.isSafeInteger(page)||page<1||!Number.isSafeInteger(exp)||exp<Math.floor(Date.now()/1000)||exp>Math.floor(Date.now()/1000)+600)return fail('page_expired');
  const expected=hex(await crypto.subtle.sign('HMAC',await key,encode.encode([id,sub,kind,page,exp].join('|'))));if(!equal(expected,sig))return fail('page_invalid');
  const s=await db.from('highselect_sessions').select('student_id,expires_at').eq('token_hash',sub).maybeSingle();if(s.error)return fail('storage_unavailable',503);if(!s.data||Date.parse(s.data.expires_at)<=Date.now())return fail('login_required',401);
  const a=await db.from('highselect_students').select('active,expires_at,exam_grants').eq('id',s.data.student_id).maybeSingle();if(a.error)return fail('storage_unavailable',503);if(!a.data?.active||Date.parse(a.data.expires_at)<=Date.now())return fail('login_required',401);if(!a.data.exam_grants.includes(id))return fail('exam_not_approved');
  const exam=bank.exams.find(e=>e.id===id),asset=({paper:exam?.pages,answers:exam?.answerPages,analysis:exam?.analysisPages})[kind]?.[page-1];if(!asset)return fail('page_not_found',404);
  headers.set('Content-Type','image/jpeg');return new Response(Uint8Array.from(atob(asset),c=>c.charCodeAt(0)),{headers});
 }catch{return fail('service_unavailable',503);}
});
