(function(){
  'use strict';
  let cfg=null,value=null,owner=null,pending=false,error=false,version=0,lastCheck=0,lastProfile=null,inflight=null;
  let serverAt=0,receivedAt=0;
  const stamp=()=>typeof performance!=='undefined'?performance.now():Date.now();
  const listeners=[];
  function emit(){listeners.slice().forEach(fn=>{try{fn(snapshot());}catch(e){}});}
  function snapshot(){return {owner,loading:pending,error,membership:value&&value.membership,settings:value&&value.settings,contact:value&&value.contact};}
  function clear(){version++;value=null;owner=null;pending=false;error=false;lastCheck=0;inflight=null;emit();}
  function profile(){try{return cfg.profileName()||null;}catch(e){return null;}}
  async function request(action,data){
    if(!cfg)throw new Error('membership_not_configured');
    const session=await cfg.auth.getSession();
    if(!session||cfg.auth.requiresPassword())throw new Error('guardian_required');
    const response=await fetch(cfg.url+'/functions/v1/nm-membership',{method:'POST',headers:{apikey:cfg.key,Authorization:'Bearer '+session.access_token,'Content-Type':'application/json'},body:JSON.stringify({action,...data})});
    let result;try{result=await response.json();}catch(e){throw new Error('invalid_response');}
    if(!response.ok||result.error){const e=new Error('membership_request_failed');e.status=response.status;e.code=result.error;throw e;}
    if(cfg.auth.peek()?.user.id!==session.user.id)throw new Error('guardian_changed');
    return {result,userId:session.user.id};
  }
  function configure(config){
    cfg={url:config.url,key:config.anonKey,auth:config.auth,profileName:config.profileName||(()=>null)};
    cfg.auth.onChange(()=>{const user=cfg.auth.peek();if(!user||cfg.auth.requiresPassword()){clear();return;}refresh(true);});
    cfg.auth.ready().then(()=>refresh(true)).catch(()=>{});
    if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')refreshIfDue();});
  }
  function refresh(force){
    if(!cfg)return Promise.resolve(null);
    const user=cfg.auth.peek();
    if(!user||cfg.auth.requiresPassword()){if(value||owner)clear();return Promise.resolve(null);}
    const name=profile();
    if(inflight&&owner===user.user.id&&lastProfile===name)return inflight;
    if(!force&&owner===user.user.id&&lastProfile===name&&Date.now()-lastCheck<300000)return Promise.resolve(snapshot());
    const generation=++version;owner=user.user.id;lastProfile=name;pending=true;error=false;
    if(value&&value.membership.userId!==owner)value=null;
    emit();
    const mine=request('status',name?{profileName:name}:{}).then(({result,userId})=>{
      if(generation!==version)return null;
      const member=result.membership;
      if(!member||member.userId!==userId||typeof member.canUse!=='boolean'||!Number.isFinite(Date.parse(member.serverNow)))throw new Error('invalid_membership');
      const c=result.contact;
      value={membership:member,settings:result.settings||null,contact:c?{registered:c.registered===true,smsConsent:c.smsConsent===true,privacyVersion:typeof c.privacyVersion==='string'?c.privacyVersion:null,consentedAt:typeof c.consentedAt==='string'?c.consentedAt:null,phoneMasked:/^\d{3}-\*{4}-\d{4}$/.test(c.phoneMasked)?c.phoneMasked:null}:null};
      serverAt=Date.parse(member.serverNow);receivedAt=stamp();lastCheck=Date.now();pending=false;error=false;emit();return snapshot();
    }).catch(()=>{if(generation===version){pending=false;error=true;value=null;lastCheck=Date.now()-270000;emit();}return null;}).finally(()=>{if(inflight===mine)inflight=null;});
    inflight=mine;return mine;
  }
  function refreshIfDue(){return refresh(false);}
  function canUse(){
    if(!value||error||cfg.auth.requiresPassword()||owner!==cfg.auth.peek()?.user.id||!value.membership.canUse)return false;
    const m=value.membership,end=m.status==='trial'?m.trialEndsAt:m.endsAt;
    return Number.isFinite(Date.parse(end))&&serverAt+Math.max(0,stamp()-receivedAt)<Date.parse(end);
  }
  async function registerContact(phone,collectionConsent,smsConsent,consent){
    if(!consent||consent.version!==window.NM_PRIVACY?.VERSION||consent.guardianConsent!==true||collectionConsent!==true)throw new Error('consent_required');
    // phone null = keep the number already on file (renewal or text-consent change).
    const body={collectionConsent:collectionConsent===true,smsConsent:smsConsent===true,privacyVersion:consent.version,guardianConsent:true};
    if(phone!==null)body.phone=phone;
    const data=await request('register_contact',body);
    // A same-account status refresh may finish while this request is in flight.
    if(cfg.auth.peek()?.user.id!==data.userId)throw new Error('guardian_changed');
    if(inflight)await inflight;
    await refresh(true);return data.result;
  }
  function contactReady(){return value?.contact?.registered===true&&!!window.NM_PRIVACY&&value.contact.privacyVersion===window.NM_PRIVACY.VERSION;}
  window.NM_MEMBERSHIP={configure,refresh,refreshIfDue,snapshot,canUse,contactReady,registerContact,onChange(fn){listeners.push(fn);return()=>{const i=listeners.indexOf(fn);if(i>=0)listeners.splice(i,1);};}};
})();
