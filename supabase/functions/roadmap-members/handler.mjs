export const CONSENT_VERSION = 'roadmap-2026-10-30-v1';
const ORIGINS = new Set(['https://lete-on.gfieldacademy.net','https://docssam1.github.io',
  'http://localhost:57608','http://127.0.0.1:57608','http://localhost:57615','http://127.0.0.1:57615']);
// Never select pin_hash, session token/hash or rate-limit buckets for presentation.
const MEMBER_COLUMNS = 'user_id,email,student_name,guardian_phone,school,age,grade,privacy_version,privacy_agreed_at,guardian_agreed_at,email_verified_at,marketing_email,marketing_sms,created_at,updated_at,session_version';
class HttpError extends Error { constructor(status,code){super(code);this.status=status;} }
export function cleanProfile(raw={}) {
  const studentName = String(raw.studentName||'').normalize('NFKC').trim();
  const guardianPhone = String(raw.guardianPhone||'').replace(/[\s()-]/g,'');
  const school = raw.school;
  if(!studentName || studentName.length>30 || /[<>\x00-\x1f]/.test(studentName)) throw new HttpError(400,'name_invalid');
  if(!/^01\d{8,9}$/.test(guardianPhone)) throw new HttpError(400,'phone_invalid');
  const age = school==='preschool'?Number(raw.age):null, grade = school!=='preschool'?Number(raw.grade):null;
  if(!['preschool','elementary','middle','high'].includes(school)
    || (school==='preschool' && (!Number.isInteger(age)||age<3||age>7))
    || (school!=='preschool' && (!Number.isInteger(grade)||grade<1||grade>(school==='elementary'?6:3)))) throw new HttpError(400,'grade_invalid');
  return {studentName,guardianPhone,school,age,grade};
}
export function cleanConsent(raw={}) {
  if(raw.version!==CONSENT_VERSION || raw.privacy!==true || raw.guardian!==true) throw new HttpError(400,'consent_required');
  return {version:CONSENT_VERSION,privacy:true,guardian:true,marketing_email:raw.marketing_email===true,marketing_sms:raw.marketing_sms===true};
}
export function validPin(value){return typeof value==='string' && /^\d{8,12}$/.test(value) && !/^(\d)\1+$/.test(value) && !['12345678','87654321','01234567'].includes(value);}
const emailOf = value => String(value||'').trim().toLowerCase();
const emailOK = value => value.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const hex = bytes => Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
export async function hash(value){return hex(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)));}
async function keyed(value,key){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',k,new TextEncoder().encode(value)));}
function claims(token){try{return JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{return{};}}
function memberView(m){if(!m)return null;const {session_version,...out}=m;return out;}
const checked = async promise => {const r=await promise;if(r.error)throw new HttpError(503,'service_unavailable');return r;};

export function createHandler({service,url,publicKey,rateSecret,send=fetch,now=()=>Date.now()}) {
  async function verified(req,{fresh=false}={}) {
    const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
    if(!token)throw new HttpError(401,'email_required');
    const {data,error}=await service.auth.getUser(token);
    const u=data?.user;
    if(error||!u?.id||!u.email||!u.email_confirmed_at||u.is_anonymous)throw new HttpError(401,'email_required');
    const c=claims(token);
    if(c.sub!==u.id||!/^[a-f0-9-]{36}$/i.test(c.session_id||''))throw new HttpError(401,'email_required');
    const {data:active}=await checked(service.rpc('roadmap_email_session_active',{p_user_id:u.id,p_session_id:c.session_id}));
    if(active!==true)throw new HttpError(401,'email_required');
    if(fresh){
      // getUser verifies the signature first. Password sessions from other apps cannot reset this PIN.
      const seconds=now()/1000;
      if(c.sub!==u.id || !(c.amr||[]).some(x=>x.method==='otp'&&x.timestamp<=seconds+30&&x.timestamp>seconds-600))throw new HttpError(401,'fresh_email_required');
    }
    return {...u,email:emailOf(u.email)};
  }
  async function member(id){const {data}=await checked(service.from('roadmap_members').select(MEMBER_COLUMNS).eq('user_id',id).maybeSingle());return data;}
  async function authenticate(req){
    const token=req.headers.get('x-roadmap-session')||'';
    if(!/^[a-f0-9]{64}$/.test(token))throw new HttpError(401,'login_required');
    const {data:s}=await checked(service.from('roadmap_sessions').select('user_id,session_version,expires_at').eq('token_hash',await hash(token)).gt('expires_at',new Date(now()).toISOString()).maybeSingle());
    if(!s)throw new HttpError(401,'login_required');
    const m=await member(s.user_id);
    if(!m||m.session_version!==s.session_version)throw new HttpError(401,'login_required');
    return m;
  }
  async function issue(m){
    const token=hex(crypto.getRandomValues(new Uint8Array(32))), expiresAt=new Date(now()+8*3600000).toISOString();
    await checked(service.from('roadmap_sessions').delete().lt('expires_at',new Date(now()).toISOString()));
    await checked(service.from('roadmap_sessions').insert({token_hash:await hash(token),user_id:m.user_id,session_version:m.session_version,expires_at:expiresAt}));
    return {token,expiresAt,member:memberView(m)};
  }
  async function attempts(req,email,purpose){
    // Ignore client-supplied forwarding lists beyond the first address. Limits also apply globally per email.
    const ip=(req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim().slice(0,96);
    const results=await Promise.all([
      service.rpc('roadmap_take_attempt',{p_bucket:purpose+':e:'+await keyed(email,rateSecret),p_limit:purpose==='otp'?4:8}),
      service.rpc('roadmap_take_attempt',{p_bucket:purpose+':i:'+await keyed(ip,rateSecret),p_limit:purpose==='otp'?20:40})
    ]);
    if(results.some(r=>r.error))throw new HttpError(503,'service_unavailable');
    if(results.some(r=>r.data!==true))throw new HttpError(429,'too_many_attempts');
  }
  async function admin(req){
    const u=await verified(req);
    const {data:a}=await checked(service.from('hs_accounts').select('role,active,student').eq('user_id',u.id).maybeSingle());
    if(!a?.active||a.role!=='admin'||String(a.student).toUpperCase()!=='DOCSSAM'||u.app_metadata?.role!=='admin')throw new HttpError(403,'admin_required');
    return u;
  }
  return async function handler(req){
    const origin=req.headers.get('origin')||'';
    const h={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','Vary':'Origin','X-Content-Type-Options':'nosniff',
      'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-roadmap-session','Access-Control-Allow-Methods':'POST, OPTIONS'};
    if(ORIGINS.has(origin))h['Access-Control-Allow-Origin']=origin;
    const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:h});
    if(origin&&!ORIGINS.has(origin))return reply({error:'origin_not_allowed'},403);
    if(req.method==='OPTIONS')return new Response(null,{status:204,headers:h});
    if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
    try{
      const text=await req.text();if(text.length>12000)throw new HttpError(413,'request_too_large');
      let b;try{b=JSON.parse(text);}catch{throw new HttpError(400,'request_invalid');}
      if(!b||typeof b!=='object'||Array.isArray(b))throw new HttpError(400,'request_invalid');
      if(b.action==='send-code'){
        const email=emailOf(b.email);if(!emailOK(email))throw new HttpError(400,'email_invalid');
        if(b.emailConsent!==true)throw new HttpError(400,'email_consent_required');
        await attempts(req,email,'otp');
        const r=await send(url+'/auth/v1/otp',{method:'POST',headers:{apikey:publicKey,'Content-Type':'application/json'},body:JSON.stringify({email,create_user:true}),signal:AbortSignal.timeout(15000)});
        if(!r.ok)throw new HttpError(r.status===429?429:503,r.status===429?'too_many_attempts':'mail_unavailable');
        return reply({sent:true});
      }
      if(b.action==='login'){
        const email=emailOf(b.email),pin=String(b.pin||'');
        if(!emailOK(email)||!/^\d{8,12}$/.test(pin))throw new HttpError(401,'credentials_invalid');
        await attempts(req,email,'pin');
        const {data:id}=await checked(service.rpc('roadmap_verify_pin',{p_email:email,p_pin:pin}));
        if(!id)throw new HttpError(401,'credentials_invalid');
        const m=await member(id);if(!m)throw new HttpError(401,'credentials_invalid');
        return reply(await issue(m));
      }
      if(b.action==='email-status'){
        const u=await verified(req,{fresh:true});
        return reply({member:memberView(await member(u.id)),email:u.email});
      }
      if(b.action==='email-login'){
        const u=await verified(req,{fresh:true}),m=await member(u.id);
        if(!m)throw new HttpError(404,'member_missing');
        return reply(await issue(m));
      }
      if(b.action==='register'){
        const u=await verified(req,{fresh:true}), profile=cleanProfile(b.profile),consent=cleanConsent(b.consent);
        if(!validPin(b.pin))throw new HttpError(400,'pin_invalid');
        await checked(service.rpc('roadmap_register',{p_user_id:u.id,p_email:u.email,p_pin:b.pin,p_profile:profile,p_consent:consent}));
        return reply(await issue(await member(u.id)));
      }
      if(b.action==='reset-pin'){
        const u=await verified(req,{fresh:true}),m=await member(u.id);
        if(!m)throw new HttpError(404,'member_missing');
        if(!validPin(b.pin))throw new HttpError(400,'pin_invalid');
        // Rotating a PIN is not a fresh privacy or marketing consent.
        await checked(service.rpc('roadmap_rotate_pin',{p_user_id:u.id,p_pin:b.pin}));
        return reply(await issue(await member(u.id)));
      }
      if(b.action==='withdraw'){
        const u=await verified(req,{fresh:true});
        if(b.confirm!==true)throw new HttpError(400,'confirmation_required');
        // Cascades delete roadmap sessions/consents only; shared GFIELD Auth identity is preserved.
        await checked(service.from('roadmap_members').delete().eq('user_id',u.id));
        return reply({deleted:true});
      }
      if(b.action==='admin-list'){
        await admin(req);
        const page=Math.max(0,Math.min(10000,Math.trunc(Number(b.page)||0))),q=String(b.query||'').trim().slice(0,60).replace(/[%_(),"\\]/g,'');
        let query=service.from('roadmap_members').select(MEMBER_COLUMNS,{count:'exact'}).order('created_at',{ascending:false}).range(page*30,page*30+29);
        if(q)query=query.or(`email.ilike.%${q}%,student_name.ilike.%${q}%,guardian_phone.ilike.%${q}%`);
        const {data,count}=await checked(query);return reply({members:(data||[]).map(memberView),count,page});
      }
      if(b.action==='admin-detail'){
        await admin(req);
        if(!/^[a-f0-9-]{36}$/i.test(String(b.userId||'')))throw new HttpError(400,'request_invalid');
        const m=await member(b.userId);if(!m)throw new HttpError(404,'member_missing');
        const {data:events}=await checked(service.from('roadmap_consent_events').select('kind,agreed,version,recorded_at').eq('user_id',m.user_id).order('recorded_at',{ascending:false}).limit(200));
        return reply({member:memberView(m),events});
      }
      const m=await authenticate(req);
      if(b.action==='status')return reply({member:memberView(m)});
      if(b.action==='update'){
        if(b.version!==CONSENT_VERSION)throw new HttpError(400,'consent_required');
        await checked(service.rpc('roadmap_update_profile',{p_user_id:m.user_id,p_profile:cleanProfile(b.profile),p_marketing:{marketing_email:b.marketing_email===true,marketing_sms:b.marketing_sms===true}}));
        return reply({member:memberView(await member(m.user_id))});
      }
      if(b.action==='logout'){
        await checked(service.from('roadmap_sessions').delete().eq('token_hash',await hash(req.headers.get('x-roadmap-session'))));
        return reply({signedOut:true});
      }
      throw new HttpError(400,'action_invalid');
    }catch(e){
      // Neither credentials nor upstream errors (which can contain personal data) enter logs/responses.
      return reply({error:e instanceof HttpError?e.message:'service_unavailable'},e instanceof HttpError?e.status:503);
    }
  };
}
