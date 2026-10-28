/* 수의 마법 앱 등록(2026-10-28). 서비스 워커(sw.js)를 켜고, 설치 단추·새 버전 알림·「다 받아 두기」를 다른 화면이 쓰게 window.NM_PWA 로 내놓는다.
 * 자동 검사 브라우저(navigator.webdriver)에서는 켜지 않는다 — 저장본이 검사 결과를 흐리지 않게. 검사에서 켜려면 주소에 ?pwa=1. */
(function(){
'use strict';
const q=new URLSearchParams(location.search);
const base=new URL('../',document.currentScript?document.currentScript.src:location.href).href;   // number_magic/
const force=q.get('pwa')==='1';
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const api={
  supported:'serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1'),
  standalone,
  installEvent:null,          // 안드로이드·윈도우 크롬/엣지가 주는 「설치」 기회
  registration:null,
  listeners:new Set(),
  on(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn);},
  emit(type,data){this.listeners.forEach(fn=>{try{fn(type,data);}catch(_){}});},
  async install(){
    const e=this.installEvent;if(!e)return'unavailable';
    e.prompt();const r=await e.userChoice.catch(()=>({outcome:'dismissed'}));
    this.installEvent=null;this.emit('installable',false);
    return r.outcome;
  },
  async ready(){if(!this.supported)return null;return navigator.serviceWorker.ready;},
  async post(msg){const reg=await this.ready();const w=reg&&(reg.active||reg.waiting||reg.installing);if(w)w.postMessage(msg);return!!w;},
  downloadAll(){navigator.storage&&navigator.storage.persist&&navigator.storage.persist().catch(()=>{});return this.post({type:'download-all'});},
  status(){return this.post({type:'status'});},
  update(){const w=this.registration&&this.registration.waiting;if(w)w.postMessage({type:'skip-waiting'});}
};
window.NM_PWA=api;

addEventListener('beforeinstallprompt',e=>{e.preventDefault();api.installEvent=e;api.emit('installable',true);});
addEventListener('appinstalled',()=>{api.installEvent=null;api.emit('installed',true);});
/* 설치한 앱(홈 화면 앱·APK)의 처음 화면에만: 「앱 설정」으로 가는 작은 단추(다 받아 두기·공부 알림) */
const isApk=/GFIELDNumberMagic/.test(navigator.userAgent);
if((standalone()||isApk)&&/\/access\.html$/.test(location.pathname)){
  addEventListener('DOMContentLoaded',()=>{
    const a=document.createElement('a');
    a.href=base+'install.html';a.id='nm-pwa-settings';
    a.textContent=(document.documentElement.lang||'ko').startsWith('ko')?'앱 설정':'App settings';
    a.style.cssText='position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:2147482000;padding:8px 12px;border-radius:999px;background:rgba(16,46,52,.86);color:#f7f2e7;font:600 13px/1 Pretendard,"Noto Sans KR",system-ui,sans-serif;text-decoration:none;box-shadow:0 4px 14px rgba(0,0,0,.25)';
    document.body.appendChild(a);
  });
}

if(!api.supported||(navigator.webdriver&&!force))return;

navigator.serviceWorker.addEventListener('message',e=>api.emit((e.data&&e.data.type)||'message',e.data||{}));
let reloading=false;
navigator.serviceWorker.addEventListener('controllerchange',()=>{if(api.updating&&!reloading){reloading=true;location.reload();}});

function toast(){
  if(document.getElementById('nm-pwa-update'))return;
  const ko=(document.documentElement.lang||'ko').startsWith('ko'),zh=(document.documentElement.lang||'').startsWith('zh');
  const el=document.createElement('div');
  el.id='nm-pwa-update';el.setAttribute('role','status');
  el.style.cssText='position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483000;display:flex;gap:12px;align-items:center;padding:10px 12px 10px 16px;border-radius:14px;background:#102e34;color:#f7f2e7;font:600 15px/1.3 Pretendard,"Noto Sans KR",system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.28);max-width:calc(100vw - 32px)';
  const t=document.createElement('span');t.textContent=ko?'새 버전이 있어요':zh?'有新版本':'A new version is ready';
  const b=document.createElement('button');b.type='button';b.textContent=ko?'새로 열기':zh?'更新':'Update';
  b.style.cssText='border:0;border-radius:10px;padding:8px 14px;background:#d9a62e;color:#102e34;font:inherit;cursor:pointer';
  b.onclick=()=>{api.updating=true;api.update();el.remove();};
  el.append(t,b);document.body.appendChild(el);
}

addEventListener('load',async()=>{
  try{
    const reg=await navigator.serviceWorker.register(base+'sw.js',{scope:base});
    api.registration=reg;api.emit('registered',reg);
    const watch=w=>w&&w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller){api.emit('update',true);toast();}});
    if(reg.waiting&&navigator.serviceWorker.controller){api.emit('update',true);toast();}
    watch(reg.installing);
    reg.addEventListener('updatefound',()=>watch(reg.installing));
    // 앱을 오래 켜 두는 아이도 있다 — 한 시간마다 새 버전을 본다
    setInterval(()=>reg.update().catch(()=>{}),3600*1000);
  }catch(err){api.emit('error',err);}
});
})();
