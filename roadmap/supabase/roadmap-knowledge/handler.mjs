// 상담 지식 관리(원장님 2026-11-13). DOCSSAM 관리자만 목록·작성·승인·보관을 한다. 삭제 대신 보관한다.
const ORIGINS = new Set(['https://lete-on.gfieldacademy.net','https://roadmap.gfieldacademy.net','https://docssam1.github.io',
  'http://localhost:57608','http://127.0.0.1:57608','http://localhost:57615','http://127.0.0.1:57615',
  'http://localhost:57616','http://127.0.0.1:57616']);
export const KINDS = ['knowhow','site','news','drive'], STAGES = ['all','preschool','elementary','middle','high'], STATUSES = ['candidate','approved','archived'];
const COLUMNS = 'id,kind,title,body,source,stage,status,checked_on,origin,created_at,updated_at,approved_at,supersedes_id';
class HttpError extends Error { constructor(status,code){super(code);this.status=status;} }
const checked = async promise => {const r=await promise;if(r.error)throw new HttpError(503,'service_unavailable');return r;};
function claims(token){try{return JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));}catch{return{};}}
const text = (v,max) => String(v??'').normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').replace(/\n{3,}/g,'\n\n').trim();
export function cleanEntry(raw={}){
  const title=text(raw.title),body=text(raw.body),source=text(raw.source),kind=raw.kind,stage=raw.stage||'all';
  if(!title||title.length>120)throw new HttpError(400,'title_invalid');
  if(!body||body.length>4000)throw new HttpError(400,'body_invalid');
  if(source.length>500)throw new HttpError(400,'source_invalid');
  if(!KINDS.includes(kind)||!STAGES.includes(stage))throw new HttpError(400,'kind_invalid');
  const checkedOn=raw.checkedOn?String(raw.checkedOn):null;
  if(checkedOn&&(!/^20\d\d-\d\d-\d\d$/.test(checkedOn)||Number.isNaN(Date.parse(checkedOn))))throw new HttpError(400,'date_invalid');
  return {kind,stage,title,body,source,checked_on:checkedOn};
}
const ID = /^[a-f0-9-]{36}$/i;

export function createHandler({service,now=()=>Date.now()}) {
  async function admin(req){
    const token=(req.headers.get('authorization')||'').replace(/^Bearer\s+/i,'');
    if(!token)throw new HttpError(401,'admin_required');
    const {data,error}=await service.auth.getUser(token);const u=data?.user;
    if(error||!u?.id||!u.email_confirmed_at||u.is_anonymous)throw new HttpError(401,'admin_required');
    const c=claims(token);
    if(c.sub!==u.id||!/^[a-f0-9-]{36}$/i.test(c.session_id||''))throw new HttpError(401,'admin_required');
    const {data:active}=await checked(service.rpc('roadmap_email_session_active',{p_user_id:u.id,p_session_id:c.session_id}));
    if(active!==true)throw new HttpError(401,'admin_required');
    const {data:a}=await checked(service.from('hs_accounts').select('role,active,student').eq('user_id',u.id).maybeSingle());
    if(!a?.active||a.role!=='admin'||String(a.student).toUpperCase()!=='DOCSSAM'||u.app_metadata?.role!=='admin')throw new HttpError(403,'admin_required');
    return u;
  }
  return async function handler(req){
    const origin=req.headers.get('origin')||'';
    const h={'Content-Type':'application/json; charset=utf-8','Cache-Control':'private, no-store','Vary':'Origin','X-Content-Type-Options':'nosniff',
      'Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
    if(ORIGINS.has(origin))h['Access-Control-Allow-Origin']=origin;
    const reply=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:h});
    if(origin&&!ORIGINS.has(origin))return reply({error:'origin_not_allowed'},403);
    if(req.method==='OPTIONS')return new Response(null,{status:204,headers:h});
    if(req.method!=='POST')return reply({error:'method_not_allowed'},405);
    try{
      const raw=await req.text();if(raw.length>20000)throw new HttpError(413,'request_too_large');
      let b;try{b=JSON.parse(raw);}catch{throw new HttpError(400,'request_invalid');}
      if(!b||typeof b!=='object'||Array.isArray(b))throw new HttpError(400,'request_invalid');
      await admin(req);
      const stamp=new Date(now()).toISOString();
      if(b.action==='list'){
        const status=STATUSES.includes(b.status)?b.status:'candidate';
        const {data}=await checked(service.from('roadmap_knowledge').select(COLUMNS).eq('status',status).order('updated_at',{ascending:false}).limit(300));
        const {data:counts}=await checked(service.from('roadmap_knowledge').select('status'));
        const tally={candidate:0,approved:0,archived:0};for(const r of counts||[])if(r.status in tally)tally[r.status]++;
        return reply({items:data||[],counts:tally});
      }
      if(b.action==='save'){
        const entry=cleanEntry(b.entry);
        if(b.id!=null){
          if(!ID.test(String(b.id)))throw new HttpError(400,'request_invalid');
          const {data:original}=await checked(service.from('roadmap_knowledge').select(COLUMNS).eq('id',b.id).maybeSingle());
          if(!original)throw new HttpError(404,'not_found');
          if(original.status==='approved'){
            const {data}=await checked(service.from('roadmap_knowledge').insert({...entry,origin:'admin',status:'candidate',supersedes_id:original.id,updated_at:stamp}).select(COLUMNS).maybeSingle());
            return reply({item:data,pending:true});
          }
          const {data}=await checked(service.from('roadmap_knowledge').update({...entry,status:'candidate',approved_at:null,updated_at:stamp}).eq('id',b.id).neq('status','approved').select(COLUMNS).maybeSingle());
          if(!data)throw new HttpError(404,'not_found');return reply({item:data});
        }
        const {data}=await checked(service.from('roadmap_knowledge').insert({...entry,origin:'admin',status:'candidate',updated_at:stamp}).select(COLUMNS).maybeSingle());
        return reply({item:data});
      }
      if(b.action==='status'){
        if(!ID.test(String(b.id||''))||!STATUSES.includes(b.status))throw new HttpError(400,'request_invalid');
        const response=await service.rpc('roadmap_knowledge_status',{p_id:b.id,p_status:b.status});
        if(response.error?.message?.includes('revision_conflict'))throw new HttpError(409,'revision_conflict');
        const {data}=await checked(Promise.resolve(response));
        if(!data)throw new HttpError(404,'not_found');return reply({item:data});
      }
      throw new HttpError(400,'action_invalid');
    }catch(e){
      return reply({error:e instanceof HttpError?e.message:'service_unavailable'},e instanceof HttpError?e.status:503);
    }
  };
}
export { HttpError };
