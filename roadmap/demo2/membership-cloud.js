/* Verified-owner, opt-in account continuation. Local writes always happen first. */
(function(g){'use strict';
 const prefix='gfield.demo2.',valid=k=>/^gfield\.demo2\.(?!(?:member|saved|guard)\.)[a-z0-9][a-z0-9._-]{0,100}$/.test(k);
 const canonical=d=>JSON.stringify(Object.fromEntries(Object.entries(d).sort(([a],[b])=>a.localeCompare(b))));
 let owner,base=null,remote=null,enabled=false,conflict=false,busy=false,dirty=false,timer,mode='local',button,dialog,applying=false,consentPending=false;
 const live=new Map();
 const storage=n=>{try{return g[n];}catch{return null;}};
 function read(k){try{return JSON.parse(storage('localStorage')?.getItem(k)||'null');}catch{return null;}}
 function put(k,v){try{storage('localStorage')?.setItem(k,JSON.stringify(v));return true;}catch{return false;}}
 const metaKey=()=> 'gfield.roadmap.cloud.base.'+owner;
 function snapshot(){const d={};for(const n of ['localStorage','sessionStorage']){const st=storage(n),physical=(n==='localStorage'?prefix+'saved.member.':prefix+'member.')+owner+'.';try{for(let i=0;i<st.length;i++){const k=st.key(i);if(k?.startsWith(physical)){const logical=prefix+k.slice(physical.length),v=st.getItem(k);if(valid(logical)&&typeof v==='string')d[logical]=v;}}}catch{}}
  try{const st=storage('sessionStorage'),guard=prefix+'saved.guard.member.'+owner+'.';for(let i=0;i<st.length;i++){const k=st.key(i);if(k?.startsWith(guard)){const logical=prefix+k.slice(guard.length),mark=st.getItem(k);if(mark?.startsWith('removed'))delete d[logical];else if(mark==='local-stale'&&!st.getItem(prefix+'member.'+owner+'.'+k.slice(guard.length)))delete d[logical];}}}catch{}
  for(const[k,v]of live)if(v===null)delete d[k];else d[k]=v;return d;
 }
 function safeDocument(d){return d&&typeof d==='object'&&!Array.isArray(d)&&Object.keys(d).length<=80&&Object.entries(d).every(([k,v])=>valid(k)&&typeof v==='string')&&new TextEncoder().encode(canonical(d)).length<=260000;}
 async function digest(d){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(canonical(d)))),x=>x.toString(16).padStart(2,'0')).join('');}
 async function baseline(plan,document){base={revision:plan.revision,hash:await digest(document),updatedAt:plan.updatedAt};put(metaKey(),base);try{storage('sessionStorage')?.setItem(metaKey(),JSON.stringify(base));}catch{}}
 function hydrate(d){if(!safeDocument(d))throw Error('plan_invalid');applying=true;try{const keys=new Set([...Object.keys(snapshot()),...Object.keys(d)]);for(const key of keys){const tail=key.slice(prefix.length),s=prefix+'member.'+owner+'.'+tail,l=prefix+'saved.member.'+owner+'.'+tail;for(const[n,k]of [['sessionStorage',s],['localStorage',l]])try{if(Object.hasOwn(d,key))storage(n)?.setItem(k,d[key]);else storage(n)?.removeItem(k);}catch{}try{storage('sessionStorage')?.removeItem(prefix+'saved.guard.member.'+owner+'.'+tail);}catch{}}live.clear();}finally{applying=false;}}
 function setMode(v){mode=v;if(button)button.textContent=({local:'계정에 저장',saved:'저장됨',saving:'저장 중',offline:'기기에 저장됨',conflict:'다른 계획 확인',unavailable:'저장 연결 확인'})[v];}
 function changed(k,v){if(applying||!valid(k))return;live.set(k,v);dirty=true;if(!enabled||conflict)return;clearTimeout(timer);timer=setTimeout(()=>flush(),1800);}
 async function flush(consent=false){if(busy||conflict||(!enabled&&!consent))return;busy=true;clearTimeout(timer);const document=snapshot();try{if(!safeDocument(document))throw Error('plan_invalid');if(!dirty&&!consent){setMode('saved');return;}setMode('saving');const r=await g.RoadmapMembership.call('plan-save',{revision:base?.revision||0,document,storageConsent:consent||consentPending},undefined,{timeoutMs:12000});
   if(r.conflict){remote=r;conflict=true;setMode('conflict');return;}
   if(r.consentRequired){enabled=false;setMode('local');return;}
   if(!r.saved)throw Error('plan_invalid');remote={...r,document};enabled=true;consentPending=false;await baseline(r,document);dirty=canonical(snapshot())!==canonical(document);setMode(dirty?'saving':'saved');if(dirty)timer=setTimeout(()=>flush(),1800);
  }catch{setMode('offline');}finally{busy=false;}
 }
 async function prepare(member){owner=member.user_id;try{base=JSON.parse(storage('sessionStorage')?.getItem(metaKey())||'null')||read(metaKey());}catch{base=read(metaKey());}const local=snapshot();try{const r=await g.RoadmapMembership.call('plan-get',{},undefined,{timeoutMs:8000});remote=r.plan;if(!remote){base=null;setMode('local');return;}
  if(!safeDocument(remote.document))throw Error('plan_invalid');enabled=true;
  const localHash=await digest(local),remoteHash=await digest(remote.document);
  if(localHash===remoteHash){await baseline(remote,local);setMode('saved');}
  else if(!Object.keys(local).length||base?.hash===localHash){hydrate(remote.document);await baseline(remote,remote.document);setMode('saved');}
  else if(base?.revision===remote.revision){dirty=true;setMode('offline');}
  else{conflict=true;setMode('conflict');}
 }catch{setMode('unavailable');}}
 function stamp(v){try{return new Date(v).toLocaleString('ko-KR',{timeZone:'Asia/Seoul'});}catch{return '';}}
 function details(){const p=dialog.querySelector('[data-cloud-details]');p.replaceChildren();const text=document.createElement('p');text.textContent=conflict?'이 기기와 계정에 서로 다른 계획이 있습니다. 어느 계획을 이어갈까요?':!enabled?'현재 교재·진도·선택과 학습 계획을 계정에 저장하면 다른 기기에서도 이어갈 수 있습니다. Supabase에 보관하며 탈퇴 시 삭제합니다.':mode==='offline'||mode==='unavailable'?'현재 변경은 이 기기에 보관 중입니다. 연결 후 다시 저장하세요.':'계정과 이 기기에 학습 계획이 저장되어 있습니다.';p.append(text);
 if(remote?.updatedAt){const t=document.createElement('small');t.textContent='계정 저장: '+stamp(remote.updatedAt);p.append(t);}
 const actions=document.createElement('div');actions.className='cloud-actions';const action=(label,fn)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=async()=>{b.disabled=true;try{await fn();}finally{b.disabled=false;details();}};actions.append(b);};
 if(conflict){action('계정의 계획 이어가기',async()=>{const backup=snapshot();if(!put('gfield.roadmap.cloud.backup.'+owner,{document:backup,at:new Date().toISOString()})){dialog.querySelector('[role=status]').textContent='기기 계획을 보관하지 못했습니다. 브라우저 저장 공간을 확인해 주세요.';return;}hydrate(remote.document);await baseline(remote,remote.document);g.location.reload();});action('이 기기의 계획 저장',async()=>{base={revision:remote.revision};conflict=false;enabled=true;dirty=true;await flush();});}
 else if(!enabled)action('동의하고 계정에 저장',async()=>{enabled=true;consentPending=true;dirty=true;await flush(true);});
 else action('다시 저장',async()=>{dirty=true;await flush();});
 if(read('gfield.roadmap.cloud.backup.'+owner)?.document)action('보관한 기기 계획 복원',async()=>{const backup=read('gfield.roadmap.cloud.backup.'+owner);if(!safeDocument(backup?.document))return;hydrate(backup.document);const restored={revision:base?.revision||0,hash:'restored-backup'};put(metaKey(),restored);try{storage('sessionStorage')?.setItem(metaKey(),JSON.stringify(restored));}catch{}g.location.reload();});
 p.append(actions);
 }
 function mount(){button=document.createElement('button');button.type='button';button.className='member-account-link cloud-status';button.setAttribute('aria-haspopup','dialog');button.onclick=()=>{details();dialog.showModal();};const menu=document.querySelector('.prn-global-body')||document.querySelector('.top');menu?.append(button);
 dialog=document.createElement('dialog');dialog.className='cloud-dialog';dialog.setAttribute('aria-labelledby','cloudTitle');dialog.innerHTML='<form method="dialog"><h2 id="cloudTitle">학습 계획 저장</h2><button aria-label="저장 안내 닫기">닫기</button></form><div data-cloud-details></div><p role="status" aria-live="polite"></p>';document.body.append(dialog);dialog.addEventListener('close',()=>button.focus());setMode(mode);if(dirty&&enabled&&!conflict)timer=setTimeout(()=>flush(),1800);
 g.addEventListener('online',()=>{if(enabled&&!conflict)flush();});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&enabled&&!conflict)flush();});}
 g.RoadmapCloud=Object.freeze({prepare,mount,changed,snapshot,valid,safeDocument,canonical,flush,status:()=>({mode,enabled,conflict,revision:base?.revision||0})});
})(window);
