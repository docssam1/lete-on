import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const PERMISSION_KEYS = new Set(["hyperfocus-bank-q01","hyperfocus-bank-q02","hyperfocus-bank-q03","hyperfocus-bank-q04","hyperfocus-bank-q05","hyperfocus-bank-q06","hyperfocus-bank-q07","hyperfocus-bank-q08","hyperfocus-bank-q09","hyperfocus-bank-q18","hyperfocus-bank-q10","hyperfocus-bank-q11","hyperfocus-bank-q12","hyperfocus-bank-q13","hyperfocus-bank-q14","hyperfocus-bank-q15","hyperfocus-bank-q16","hyperfocus-bank-q17","hyperfocus-bank-q19","hyperfocus-bank-q32","hyperfocus-bank-q38","hyperfocus-bank-q22","hyperfocus-bank-q23","hyperfocus-bank-q24","hyperfocus-bank-q25","hyperfocus-bank-q27","hyperfocus-bank-q34","hyperfocus-bank-q40","hyperfocus-bank-q21","hyperfocus-bank-q29","hyperfocus-bank-q31","hyperfocus-bank-q35","hyperfocus-bank-q37","hyperfocus-bank-q39","hyperfocus-bank-q41","hyperfocus-bank-q20","hyperfocus-bank-q30","hyperfocus-bank-q42","hyperfocus-bank-q43","hyperfocus-bank-q44","hyperfocus-bank-q45","hyperfocus-bank-q26","hyperfocus-bank-q28","hyperfocus-bank-q36","hyperfocus-bank-q50","hyperfocus-bank-q51","hyperfocus-bank-q52","hyperfocus-bank-q54","hyperfocus-bank-q33","hyperfocus-bank-q46","hyperfocus-bank-q47","hyperfocus-bank-q48","hyperfocus-bank-q49","hyperfocus-bank-q53","hyperfocus-bank-individual-mode"]);
const BASE_KEYS = new Set(["hyperfocus","hyperfocus-extra","problem-bank"]);
const ORIGINS=new Set(["https://lete-on.gfieldacademy.net","http://localhost:4177","http://127.0.0.1:4177","http://localhost:41873","http://127.0.0.1:41873"]);
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type ObjectMap=Record<string,unknown>;
function envKey(map:string,single:string,legacy:string){try{const parsed=JSON.parse(Deno.env.get(map)||"{}");if(typeof parsed.default==="string")return parsed.default;}catch{}return Deno.env.get(single)||Deno.env.get(legacy)||"";}
function respond(req:Request,status:number,body:ObjectMap){const origin=req.headers.get("origin")||"";return new Response(JSON.stringify(body),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","vary":"Origin","access-control-allow-origin":ORIGINS.has(origin)?origin:"https://lete-on.gfieldacademy.net","access-control-allow-headers":"authorization, apikey, content-type, x-client-info","access-control-allow-methods":"POST, OPTIONS"}});}
function claimsOf(token:string):ObjectMap|null{try{const s=token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(s.padEnd(Math.ceil(s.length/4)*4,"=")));}catch{return null;}}
function exactKeys(body:ObjectMap,keys:string[]){return Object.keys(body).length===keys.length&&Object.keys(body).every(k=>keys.includes(k));}
async function readBody(req:Request):Promise<ObjectMap|null>{
 if(!req.body||!/^application\/json(?:;|$)/i.test(req.headers.get("content-type")||""))return null;
 const reader=req.body.getReader();let size=0;const chunks:Uint8Array[]=[];
 try{while(true){const{done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return null;}chunks.push(value);}}finally{reader.releaseLock();}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
 try{const data=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));return data&&typeof data==="object"&&!Array.isArray(data)?data:null;}catch{return null;}
}
function activeEntitlements(rows:ObjectMap[],now:number){return rows.filter(e=>(PERMISSION_KEYS.has(String(e.permission_key))||BASE_KEYS.has(String(e.permission_key)))&&!e.revoked_at&&Number.isFinite(Date.parse(String(e.starts_at)))&&Date.parse(String(e.starts_at))<=now&&(!e.expires_at||(Number.isFinite(Date.parse(String(e.expires_at)))&&Date.parse(String(e.expires_at))>now)));}
export async function handleRequest(request:Request):Promise<Response>{
 try{
  const origin=request.headers.get("origin")||"";
  if(request.method==="OPTIONS")return respond(request,ORIGINS.has(origin)?200:403,{});
  if(request.method!=="POST"||(origin&&!ORIGINS.has(origin)))return respond(request,403,{error:"request_not_allowed"});
  const auth=request.headers.get("authorization")||"",token=auth.startsWith("Bearer ")?auth.slice(7):"";
  const url=Deno.env.get("SUPABASE_URL")||"",publicKey=envKey("SUPABASE_PUBLISHABLE_KEYS","SUPABASE_PUBLISHABLE_KEY","SUPABASE_ANON_KEY"),secret=envKey("SUPABASE_SECRET_KEYS","SUPABASE_SECRET_KEY","SUPABASE_SERVICE_ROLE_KEY");
  if(!token||!url||!publicKey||!secret)return respond(request,401,{error:"authentication_required"});
  const userClient=createClient(url,publicKey,{global:{headers:{Authorization:auth}},auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:authData,error:authError}=await userClient.auth.getUser(token);
  const claims=claimsOf(token),user=authData?.user,now=Date.now();
  if(authError||!user||user.is_anonymous||!claims||Number(claims.exp)*1000<=now||!Number.isFinite(Number(claims.exp)))return respond(request,401,{error:"authentication_required"});
  const body=await readBody(request);if(!body)return respond(request,400,{error:"invalid_request"});
  if(body.action==="self"){
   if(!exactKeys(body,["action"])||user.app_metadata?.hf_role!=="student")return respond(request,403,{error:"student_access_required"});
   // RLS enforces the current auth.sessions row, active profile, login version and credential rotation.
   const {data:profile,error:profileError}=await userClient.from("hf_students").select("id,display_name,account_status").eq("id",user.id).maybeSingle();
   if(profileError||!profile||profile.account_status!=="active"||!String(profile.display_name||"").trim())return respond(request,403,{error:"active_student_required"});
   const {data:rows,error}=await userClient.from("hf_entitlements").select("permission_key,starts_at,expires_at,revoked_at").eq("student_id",user.id);
   if(error)return respond(request,503,{error:"permissions_unavailable"});
   const active=activeEntitlements(rows||[],now),validUntil=Math.min(now+60000,Number(claims.exp)*1000,...active.filter(e=>e.expires_at).map(e=>Date.parse(String(e.expires_at))));
   return respond(request,200,{verified:true,studentId:profile.id,approvedStudentName:profile.display_name,accountStatus:"active",permissionKeys:active.filter(e=>PERMISSION_KEYS.has(String(e.permission_key))).map(e=>e.permission_key),basePermissions:active.filter(e=>BASE_KEYS.has(String(e.permission_key))).map(e=>e.permission_key),verifiedAt:now,validUntil,catalogVersion:"hf-type-access-v1"});
  }
  if(body.action!=="set")return respond(request,400,{error:"invalid_action"});
  if(!exactKeys(body,["action","studentId","permissionKey","enabled"])||!UUID.test(String(body.studentId))||!PERMISSION_KEYS.has(String(body.permissionKey))||typeof body.enabled!=="boolean")return respond(request,400,{error:"invalid_permission_request"});
  if(claims.aal!=="aal2"||user.app_metadata?.hf_role!=="admin"||(claims.app_metadata as ObjectMap|undefined)?.hf_role!=="admin")return respond(request,403,{error:"admin_access_required"});
  // Use the caller-scoped RLS read: an active auth session, current staff role and aal2 are required by existing HF policy.
  const {data:staff,error:staffError}=await userClient.from("hf_admin_accounts").select("role,account_status,authorization_changed_at").eq("user_id",user.id).maybeSingle();
  if(staffError||staff?.role!=="admin"||staff.account_status!=="active"||!Number.isFinite(Number(claims.iat))||!Number.isFinite(Date.parse(String(staff.authorization_changed_at)))||Number(claims.iat)*1000<Date.parse(String(staff.authorization_changed_at)))return respond(request,403,{error:"admin_access_required"});
  const service=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const {data:student,error:studentError}=await service.from("hf_students").select("id,account_status").eq("id",String(body.studentId)).maybeSingle();
  if(studentError||!student)return respond(request,404,{error:"student_not_available"});
  if(body.enabled&&student.account_status!=="active")return respond(request,409,{error:"student_not_active"});
  const {data:catalog,error:catalogError}=await service.from("hf_permission_catalog").select("permission_key").eq("permission_key",String(body.permissionKey)).maybeSingle();
  if(catalogError||!catalog)return respond(request,503,{error:"catalog_not_installed"});
  const {data:changed,error:changeError}=await service.rpc("hf_set_student_entitlement",{p_student_id:body.studentId,p_permission_key:body.permissionKey,p_enabled:body.enabled,p_granted_by:user.id});
  if(changeError||changed!==true)return respond(request,503,{error:"permission_change_failed"});
  return respond(request,200,{ok:true,studentId:body.studentId,permissionKey:body.permissionKey,enabled:body.enabled});
 }catch{return respond(request,503,{error:"server_not_ready"});}
}
Deno.serve(handleRequest);
