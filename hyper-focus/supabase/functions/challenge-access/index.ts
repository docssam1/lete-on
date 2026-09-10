import { createClient } from "npm:@supabase/supabase-js@2.112.3";
import { RELEASE_CONFIG } from "./release-config.ts";

const PERMISSION_KEYS = new Set([
 "challenge-concept-1",
 "challenge-concept-2",
 "challenge-mock-1",
 "challenge-mock-2",
 "challenge-mock-3",
 "challenge-mock-4",
 "challenge-bank-replace-count-constraints",
 "challenge-bank-split-merge-chain",
 "challenge-bank-mock-balance-substitution-pictures",
 "challenge-bank-triangle-number-rule",
 "challenge-bank-replace-divided-square-cycle",
 "challenge-bank-total-difference",
 "challenge-bank-rotated-grid-pair",
 "challenge-bank-mountain-digit-count",
 "challenge-bank-apartment-floor-order",
 "challenge-bank-replace-house-between",
 "challenge-bank-card-sum-count",
 "challenge-bank-mock-dice-target-bottom",
 "challenge-bank-arrow-number-move",
 "challenge-bank-mock-object-length-equivalence",
 "challenge-bank-minimum-sum-pyramid",
 "challenge-bank-replace-paper-remainder",
 "challenge-bank-replace-age-chain",
 "challenge-bank-cube-count-fill",
 "challenge-bank-rectangle-count",
 "challenge-bank-four-cell-code",
 "challenge-bank-extra-digit-multiselect",
 "challenge-bank-priority-cube-top-view",
 "challenge-bank-priority-fold-holes",
 "challenge-bank-extra-congruent-partition",
 "challenge-bank-extra-inside-outside-analogy",
 "challenge-bank-extra-digital-mirror",
 "challenge-bank-r2-fruit-equations",
 "challenge-bank-r2-number-machines",
 "challenge-bank-r2-grid-mirror-polygon",
 "challenge-bank-replace-student-queue",
 "challenge-bank-replace-missing-star-combination",
 "challenge-bank-r2-orange-reverse",
 "challenge-bank-r2-digit-constraint",
 "challenge-bank-replace-compound-matrix",
 "challenge-bank-r2-circular-seating",
 "challenge-bank-replace-magic-triangle",
 "challenge-bank-replace-fruit-pair-cancel",
 "challenge-bank-priority-route-count",
 "challenge-bank-r2-domino-side-sums",
 "challenge-bank-replace-line-rotation-series",
 "challenge-bank-r2-bird-departure",
 "challenge-bank-r2-number-reference-reading",
 "challenge-bank-r2-three-balance-order",
 "challenge-bank-priority-diagonal-length",
 "challenge-bank-r2-triangle-enumeration",
 "challenge-bank-r2-fruit-logic-table",
 "challenge-bank-extra-maximum-under-conditions",
 "challenge-bank-priority-card-rank",
 "challenge-bank-extra-card-distribution",
 "challenge-bank-extra-general-quadrilateral-count",
 "challenge-bank-extra-independent-color-shape-period",
 "challenge-bank-extra-circle-bar-code",
 "challenge-bank-r3-main-1",
 "challenge-bank-r3-main-2",
 "challenge-bank-r3-main-3",
 "challenge-bank-r3-main-4",
 "challenge-bank-r3-main-5",
 "challenge-bank-r3-main-6",
 "challenge-bank-r3-main-7",
 "challenge-bank-r3-main-8",
 "challenge-bank-r3-main-9-shortest-path-grid",
 "challenge-bank-r3-main-10",
 "challenge-bank-r3-main-11",
 "challenge-bank-r3-main-12",
 "challenge-bank-r3-main-13",
 "challenge-bank-r3-main-14",
 "challenge-bank-r3-main-15-checker-stack-count",
 "challenge-bank-r3-main-16",
 "challenge-bank-r3-main-17",
 "challenge-bank-r3-main-18-tetra-cube-hole-count",
 "challenge-bank-r3-main-19",
 "challenge-bank-r3-main-20",
 "challenge-bank-r3-extra-1-congruent-marked-partition",
 "challenge-bank-r3-extra-2",
 "challenge-bank-r3-extra-3-block-build-count",
 "challenge-bank-r3-extra-4-object-length-equivalence",
 "challenge-bank-r3-extra-5",
 "challenge-bank-r3-extra-6-stack-box-fill",
 "challenge-bank-r4-main-1",
 "challenge-bank-r4-main-2",
 "challenge-bank-r4-main-3",
 "challenge-bank-r4-main-4",
 "challenge-bank-r4-main-5",
 "challenge-bank-r4-main-6",
 "challenge-bank-r4-main-7",
 "challenge-bank-r4-main-8",
 "challenge-bank-r4-main-9",
 "challenge-bank-r4-main-10",
 "challenge-bank-r4-main-11",
 "challenge-bank-r4-main-12-block-build-count",
 "challenge-bank-r4-main-13",
 "challenge-bank-r4-main-14",
 "challenge-bank-r4-main-15",
 "challenge-bank-r4-main-16",
 "challenge-bank-r4-main-17-balance-substitution-pictures",
 "challenge-bank-r4-main-18-congruent-marked-partition",
 "challenge-bank-r4-main-19",
 "challenge-bank-r4-main-20",
 "challenge-bank-r4-extra-1-object-length-equivalence",
 "challenge-bank-r4-extra-2-checker-stack-count",
 "challenge-bank-r4-extra-3-tetra-cube-hole-count",
 "challenge-bank-r4-extra-4-shortest-path-grid",
 "challenge-bank-r4-extra-5-stack-box-fill",
 "challenge-bank-r4-extra-6-simple-path-network"
]);

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
function activeEntitlements(rows:ObjectMap[],now:number){return rows.filter(e=>PERMISSION_KEYS.has(String(e.permission_key))&&!e.revoked_at&&Number.isFinite(Date.parse(String(e.starts_at)))&&Date.parse(String(e.starts_at))<=now&&(!e.expires_at||(Number.isFinite(Date.parse(String(e.expires_at)))&&Date.parse(String(e.expires_at))>now)));}
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
   const readySetting=Deno.env.get("CHALLENGE_PRIVATE_DELIVERY_READY");
   const deliveryReady=readySetting===undefined?RELEASE_CONFIG.ready===true:readySetting==="true";
   return respond(request,200,{verified:true,studentId:profile.id,approvedStudentName:profile.display_name,accountStatus:"active",permissionKeys:active.map(e=>e.permission_key),verifiedAt:now,validUntil,deliveryReady,catalogVersion:"challenge-access-v1"});
  }
  if(body.action!=="set")return respond(request,400,{error:"invalid_action"});
  if(!exactKeys(body,["action","studentId","permissionKey","enabled"])||!UUID.test(String(body.studentId))||!PERMISSION_KEYS.has(String(body.permissionKey))||typeof body.enabled!=="boolean")return respond(request,400,{error:"invalid_permission_request"});
  if(user.app_metadata?.hf_role!=="admin"||(claims.app_metadata as ObjectMap|undefined)?.hf_role!=="admin")return respond(request,403,{error:"admin_access_required"});
  const service=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  // Match the unified admin console: verified Auth identity + immutable app role + active server-side staff record + fresh authorization token.
  const {data:staff,error:staffError}=await service.from("hf_admin_accounts").select("role,account_status,authorization_changed_at").eq("user_id",user.id).maybeSingle();
  if(staffError||staff?.role!=="admin"||staff.account_status!=="active"||!Number.isFinite(Number(claims.iat))||!Number.isFinite(Date.parse(String(staff.authorization_changed_at)))||Number(claims.iat)*1000<Date.parse(String(staff.authorization_changed_at)))return respond(request,403,{error:"admin_access_required"});
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
