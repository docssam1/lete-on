(function(global){
  'use strict';

  var SUPABASE_URL='https://fgahqumaldheqettmvqg.supabase.co';
  var PUBLISHABLE_KEY='sb_publishable_OsjJG92BLMaZrc2jTClt0g_ecdTtf_I';
  var SESSION_KEY='gfield_hs_admin_session_v1';
  var DEVICE_KEY='gfield_hs_admin_device_v1';
  var refreshing=null;

  function read(key){try{return localStorage.getItem(key)||''}catch(e){return ''}}
  function write(key,value){try{localStorage.setItem(key,value);return true}catch(e){return false}}
  function remove(key){try{localStorage.removeItem(key)}catch(e){}}
  function session(){try{var value=JSON.parse(read(SESSION_KEY)||'null');return value&&value.access_token&&value.refresh_token?value:null}catch(e){return null}}
  function saveSession(value,name){
    if(!value||!value.access_token||!value.refresh_token)throw new Error('로그인 정보를 받지 못했습니다.');
    var saved=Object.assign({},value,{login_name:String(name||'DOCSSAM'),expires_at:value.expires_at||Math.floor(Date.now()/1000)+Number(value.expires_in||3600)});
    if(!write(SESSION_KEY,JSON.stringify(saved)))throw new Error('브라우저가 로그인 정보 저장을 차단했습니다.');
    return saved;
  }
  async function parse(response){var body=null;try{body=await response.json()}catch(e){}if(!response.ok){var error=new Error((body&&(body.message||body.error))||('요청 실패 ('+response.status+')'));error.status=response.status;throw error}return body}
  async function refresh(force){
    if(refreshing)return refreshing;
    refreshing=(async function(){
      var current=session();
      if(!current)return null;
      if(!force&&Number(current.expires_at||0)-Math.floor(Date.now()/1000)>=90)return current;
      var response=await fetch(SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:current.refresh_token})});
      if(!response.ok){remove(SESSION_KEY);await parse(response)}
      return saveSession(await response.json(),current.login_name);
    })();
    try{return await refreshing}finally{refreshing=null}
  }
  async function getSession(){return refresh(false)}
  async function signIn(name,approvalCode){
    var response=await fetch(SUPABASE_URL+'/functions/v1/hs-admin-session',{method:'POST',headers:{apikey:PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({action:'login',name:String(name||'').trim(),approvalCode:String(approvalCode||'').trim(),deviceToken:read(DEVICE_KEY)})});
    var result=await parse(response);
    var role=result&&result.session&&result.session.user&&result.session.user.app_metadata&&result.session.user.app_metadata.role;
    if(role!=='admin'&&role!=='teacher')throw new Error('관리자 권한을 확인하지 못했습니다.');
    if(result.deviceToken&&!write(DEVICE_KEY,String(result.deviceToken)))throw new Error('관리자 기기 정보를 저장하지 못했습니다.');
    return saveSession(result.session,name);
  }
  async function functionCall(slug,body){
    async function send(current){return fetch(SUPABASE_URL+'/functions/v1/'+encodeURIComponent(slug),{method:'POST',headers:{apikey:PUBLISHABLE_KEY,Authorization:'Bearer '+current.access_token,'Content-Type':'application/json'},body:JSON.stringify(body||{})})}
    var current=await getSession();
    if(!current)throw new Error('관리자 로그인이 필요합니다.');
    var response=await send(current);
    if(response.status===401){current=await refresh(true);if(current)response=await send(current)}
    return parse(response);
  }
  async function signOut(){
    var current=session();remove(SESSION_KEY);
    if(!current)return;
    try{await fetch(SUPABASE_URL+'/auth/v1/logout',{method:'POST',headers:{apikey:PUBLISHABLE_KEY,Authorization:'Bearer '+current.access_token,'Content-Type':'application/json'},body:'{}'})}catch(e){}
  }

  global.GFIELD_FIELDS_ADMIN_AUTH={signIn:signIn,signOut:signOut,getSession:getSession,functionCall:functionCall};
})(window);
