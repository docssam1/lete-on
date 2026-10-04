// Approval-number gate, same Apps Script as /roadmap/ (GET ?code=). Like the existing page it
// fails open: the lookup result does not block entry. Only the code is sent; name and phone stay local and are not stored.
const STORE_URL='https://script.google.com/macros/s/AKfycbxRXHH9eeU9Z970AknGXK2IAfODIcWbElwc_CnUMqUV2Kfs5eCNOrsqTrqKZCRA_G1p2g/exec';
const OK='gf_gate_ok',KEY='gf_gate_key';
const read=name=>{try{return sessionStorage.getItem(name);}catch{return null;}};
async function digest(code){
  try{const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(code));return [...new Uint8Array(bytes)].map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,32);}
  catch{return 'c'+[...code].reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7).toString(16);}
}
async function lookup(code){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  try{const res=await fetch(STORE_URL+'?code='+encodeURIComponent(code),{signal:controller.signal});await res.json();}
  catch{/* 확인 서버가 응답하지 않아도 기존 로드맵처럼 계속 진행 */}
  finally{clearTimeout(timer);}
}
export function passGate(){
  const known=read(KEY);
  if(read(OK)==='1'&&known)return Promise.resolve(known);
  return new Promise(resolve=>{
    const overlay=document.createElement('div');
    overlay.id='approval-gate';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','gate-title');
    overlay.innerHTML=`<style>#approval-gate{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:16px;background:#f5f6f8;font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif;color:#182230}#approval-gate form{width:min(420px,100%);background:#fff;border:1px solid #d8dee8;border-radius:12px;padding:24px;display:grid;gap:14px}#approval-gate h1{margin:0;font-size:1.25rem}#approval-gate label{display:grid;gap:6px;font-weight:600}#approval-gate input{font:inherit;min-height:44px;padding:8px 10px;border:1px solid #566274;border-radius:8px}#approval-gate button{font:inherit;min-height:44px;border:0;border-radius:8px;background:#2456c4;color:#fff;font-weight:700;cursor:pointer}#approval-gate small{color:#566274}#approval-gate [role=alert]{color:#b42318;min-height:1.2em}</style>
<form><h1 id="gate-title">승인번호 확인</h1><p>우리 아이 기준 로드맵은 승인번호로 입장합니다.</p>
<label>승인번호<input name="code" autocomplete="off" required></label>
<label>학생 이름<input name="name" autocomplete="off" required></label>
<label>연락처<input name="phone" type="tel" autocomplete="off" required></label>
<p role="alert" id="gate-error"></p><button type="submit">입장하기</button>
<small>승인번호는 확인을 위해 지필드 확인 서버로 보내고, 입력한 내용은 이 기기의 브라우저에만 저장됩니다. 이름과 연락처는 저장하거나 보내지 않습니다.</small></form>`;
    document.body.append(overlay);
    const form=overlay.querySelector('form'),error=overlay.querySelector('#gate-error');
    form.elements.code.focus();
    form.addEventListener('submit',async event=>{
      event.preventDefault();
      const code=form.elements.code.value.trim();
      if(!code||!form.elements.name.value.trim()||!form.elements.phone.value.trim()){error.textContent='승인번호, 학생 이름, 연락처를 모두 입력해 주세요.';return;}
      form.querySelector('button').disabled=true;error.textContent='확인 중…';
      await lookup(code);
      const key=await digest(code);
      try{sessionStorage.setItem(OK,'1');sessionStorage.setItem(KEY,key);}catch{}
      overlay.remove();resolve(key);
    });
  });
}
