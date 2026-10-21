/* Each document entry starts at approval/login. A login/preview hand-off is single-use. */
(function(){
'use strict';
const key='nm_entry_once_v1',p=new URLSearchParams(location.search);
let grant=null;
try{grant=JSON.parse(sessionStorage.getItem(key)||'null');sessionStorage.removeItem(key);}catch(e){}
const mode=p.get('review')==='1'?'review':p.get('auth')==='1'||grant?.mode==='guardian'?'guardian':'preview';
const fresh=grant&&grant.mode===mode&&Number.isFinite(grant.at)&&Date.now()-grant.at>=0&&Date.now()-grant.at<60000;
const guardian=p.get('auth')==='1'||/^#(?:.*&)?(?:access_token|code)=/.test(location.hash);
window.NM_ENTRY={mode:guardian?'guardian':fresh?mode:'blocked',guardianUserId:fresh&&mode==='guardian'&&typeof grant.userId==='string'?grant.userId:null};
if(!guardian&&!fresh){
  const q=new URLSearchParams();
  for(const name of ['ws','lang'])if(p.get(name))q.set(name,p.get(name));
  location.replace('access.html'+(q.size?'?'+q.toString():''));
}
// A restored history snapshot must not silently revive a signed-in learning page.
addEventListener('pageshow',e=>{if(e.persisted)location.replace('access.html');});
})();
