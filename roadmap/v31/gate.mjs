// Entry screen for the static build: a child's name tag, not a login. Records stay in this browser and are
// keyed by a hash of the tag, so several children can share one device. Optional
// AI requests send only the reviewed safe learning fields, never this name tag.
const KEY='gf_v31_profile_key',NAMES='gf_v31_profiles';
let beforeProfileSwitch=null;
export function setBeforeProfileSwitch(handler){beforeProfileSwitch=handler;}
const read=name=>{try{return sessionStorage.getItem(name);}catch{return null;}};
const normalize=text=>text.normalize('NFC').trim().replace(/\s+/g,' ');
async function digest(text){
  try{const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,32);}
  catch{return 'p'+[...text].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7).toString(16);}
}
const profiles=()=>{try{const v=JSON.parse(localStorage.getItem(NAMES)||'[]');return Array.isArray(v)?v.filter(x=>typeof x==='string'&&x).slice(0,10):[];}catch{return [];}};
const remember=name=>{try{localStorage.setItem(NAMES,JSON.stringify([name,...profiles().filter(x=>x!==name)].slice(0,10)));}catch{}};
const escapeHtml=text=>text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function switcher(){
  const button=document.createElement('button');
  button.id='profile-switch';button.type='button';button.textContent='아이 바꾸기';
  button.className='quiet';
  button.style.cssText='min-height:44px;font:inherit;cursor:pointer';
  const style=document.createElement('style');style.textContent='@media print{#profile-switch{display:none}}';
  button.addEventListener('click',async()=>{
    button.disabled=true;
    try{
      await beforeProfileSwitch?.();
      try{sessionStorage.removeItem(KEY);sessionStorage.setItem('gf_v31_choose_profile','1');}catch{}
      location.reload();
    }catch(error){
      const message=document.querySelector('#error-message');
      if(message){message.textContent=error.message;message.hidden=false;}
      else {button.title=error.message;button.setAttribute('aria-label',error.message);}
      button.disabled=false;
    }
  });
  document.body.append(style,button);
}
export async function passGate(){
  const known=read(KEY);
  if(known){switcher();return Promise.resolve(known);}
  if(!read('gf_v31_choose_profile')){const name=profiles()[0]||'우리 아이',key=await digest(name.toLowerCase());remember(name);try{sessionStorage.setItem(KEY,key);}catch{}switcher();return key;}
  try{sessionStorage.removeItem('gf_v31_choose_profile');}catch{}
  return new Promise(resolve=>{
    const saved=profiles();
    const overlay=document.createElement('div');
    overlay.id='profile-gate';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','gate-title');
    overlay.innerHTML=`<style>#profile-gate{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:16px;background:#f5f6f8;font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif;color:#182230;overflow:auto}#profile-gate form{width:min(420px,100%);background:#fff;border:1px solid #d8dee8;border-radius:12px;padding:24px;display:grid;gap:14px}#profile-gate h1{margin:0;font-size:1.25rem}#profile-gate p{margin:0}#profile-gate label{display:grid;gap:6px;font-weight:600}#profile-gate input{font:inherit;min-height:44px;padding:8px 10px;border:1px solid #566274;border-radius:8px}#profile-gate button{font:inherit;min-height:44px;border:0;border-radius:8px;background:#2456c4;color:#fff;font-weight:700;cursor:pointer}#profile-gate .saved{display:flex;flex-wrap:wrap;gap:8px}#profile-gate .saved button{background:#fff;color:#182230;border:1px solid #566274;padding:0 14px}#profile-gate small{color:#566274}#profile-gate [role=alert]{color:#b42318;min-height:1.2em}</style>
<form><h1 id="gate-title">우리 아이 기준 로드맵</h1><p>아이 이름이나 별명으로 기록을 구분합니다. 로그인이 아닙니다.</p>
${saved.length?`<div><p><b>이전에 쓴 이름</b></p><div class="saved">${saved.map(n=>`<button type="button" data-profile="${escapeHtml(n)}">${escapeHtml(n)}</button>`).join('')}</div></div>`:''}
<label>아이 이름 또는 별명<input name="profile" autocomplete="off" maxlength="30" required></label>
<p role="alert" id="gate-error"></p><button type="submit">시작하기</button>
<small>지금 AI 도움말은 외부 전송 없는 가상 응답 시험이에요. 이름과 전체 학습 기록은 이 기기의 브라우저에 저장됩니다. 다른 기기에서는 기록 파일 가져오기로 이어갈 수 있어요. 같은 이름을 쓰면 같은 기록으로 이어집니다.</small></form>`;
    document.body.append(overlay);
    const form=overlay.querySelector('form'),error=overlay.querySelector('#gate-error');
    async function enter(raw){
      const name=normalize(raw);
      if(!name){error.textContent='아이 이름이나 별명을 입력해 주세요.';return;}
      const key=await digest(name.toLowerCase());
      remember(name);
      try{sessionStorage.setItem(KEY,key);}catch{}
      overlay.remove();switcher();resolve(key);
    }
    form.elements.profile.focus();
    form.addEventListener('submit',event=>{event.preventDefault();enter(form.elements.profile.value);});
    overlay.querySelectorAll('[data-profile]').forEach(b=>b.addEventListener('click',()=>enter(b.dataset.profile)));
  });
}
