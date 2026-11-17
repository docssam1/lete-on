(function(root){
  'use strict';
  const KEY='gfield_hf_report_session_v1';
  const URL_API='https://fgahqumaldheqettmvqg.supabase.co/functions/v1/hs-parent-auth?scope=hyperfocus';
  const UUID=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[0-9a-f]{12}$/i;
  const TOKEN=/^[A-Za-z0-9_-]{43}$/;
  let verified=null,inflight=null,failed=false,notified=false,epoch=0;
  const fragment=root.location?.hash?new URLSearchParams(root.location.hash.slice(1)):null;
  let handoff=fragment?.get('hs_handoff')??null;
  let mode=handoff!==null;
  if(mode){const clean=new URL(root.location.href);clean.hash='';clean.searchParams.delete('gname');root.history.replaceState(null,'',clean.pathname+clean.search);}
  function read(){try{return root.sessionStorage.getItem(KEY)||'';}catch(_){return '';}}
  function forget(){try{root.sessionStorage.removeItem(KEY);}catch(_){}verified=null;}
  function active(){return mode||TOKEN.test(read());}
  function current(){return verified&&Date.parse(verified.expiresAt)>Date.now()?verified:null;}
  async function ready(){
    if(!active()||failed)return null;
    if(inflight)return inflight;
    mode=true;const version=epoch;
    const pending=(async()=>{
      try{
        const token=handoff!==null?handoff:read();
        if(!TOKEN.test(token))throw Error('invalid_link');
        const consume=handoff!==null;
        // Never retain or retry a consumed handoff. Return to the report to renew.
        handoff=null;
        const response=await root.fetch(URL_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:consume?'consume':'resume',token}),cache:'no-store'});
        const data=await response.json(),session=data.session;
        if(version!==epoch)return null;
        if(!response.ok||!session||session.role!=='student'||session.backend!=='hs-report'||!UUID.test(session.userId||'')||typeof session.name!=='string'||!session.name.trim()||!Array.isArray(session.permissions)||session.permissions.length!==1||session.permissions[0]!=='hyperfocus'||Date.parse(session.expiresAt)<=Date.now()||!Number.isFinite(Date.parse(session.expiresAt))||Date.parse(session.expiresAt)>Date.now()+3605000)throw Error('report_access_denied');
        if(consume){if(!TOKEN.test(data.sessionToken||''))throw Error('invalid_session');root.sessionStorage.setItem(KEY,data.sessionToken);}
        mode=true;verified=Object.freeze({...session,permissions:Object.freeze(['hyperfocus'])});return verified;
      }catch(_){if(version!==epoch)return null;failed=true;forget();if(!notified){notified=true;root.alert('자료실 연결이 만료되었거나 승인을 확인하지 못했습니다. 황소 리포트 자료실에서 다시 열어 주세요.');}return null;}
    })().finally(()=>{if(inflight===pending)inflight=null;});inflight=pending;return pending;
  }
  function clear(){epoch++;inflight=null;handoff=null;mode=false;failed=false;notified=false;forget();}
  root.GFieldHFReportAccess=Object.freeze({active,current,ready,clear});
})(window);
