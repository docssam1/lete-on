/* Sign-in and sign-up fields: a mistake is named under the field it belongs to, and a new login number
   shows how guessable it is while it is typed. Sends nothing, stores nothing, and changes no request. */
(function(root,factory){
 const api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else api.mount(root);
})(typeof window==='object'?window:null,()=>{
 'use strict';
 /* 을/를 for the word before it. */
 function object(word){
  const last=String(word).trim().slice(-1),code=last.charCodeAt(0);
  if(code>=0xac00&&code<=0xd7a3)return (code-0xac00)%28?'을':'를';
  return /[013678]$/.test(last)?'을':'를';
 }
 function dateLike(v){
  if(!/^(19|20)\d{6}$/.test(v))return false;
  const m=Number(v.slice(4,6)),d=Number(v.slice(6,8));
  return m>=1&&m<=12&&d>=1&&d<=31;
 }
 function sequence(v){
  let up=true,down=true;
  for(let i=1;i<v.length;i++){const step=(Number(v[i])-Number(v[i-1])+10)%10;if(step!==1)up=false;if(step!==9)down=false;}
  return up||down;
 }
 function repeats(v){
  for(const size of [1,2,3,4])if(v.length%size===0&&v.length>size&&v.slice(0,size).repeat(v.length/size)===v)return true;
  return false;
 }
 /* level 0 nothing typed, 1 not yet usable, 2 easy to guess, 3 fine. A guide only: the server decides. */
 function pinStrength(value){
  const v=String(value??'');
  if(!v)return {level:0,text:''};
  if(!/^\d+$/.test(v))return {level:1,text:'숫자만 입력해 주세요.'};
  if(v.length<8)return {level:1,text:`8자리 이상이어야 해요. 지금 ${v.length}자리입니다.`};
  if(v.length>12)return {level:1,text:'12자리까지 쓸 수 있어요.'};
  if(repeats(v))return {level:2,text:'추측하기 쉬워요. 같은 숫자가 반복됩니다.'};
  if(sequence(v))return {level:2,text:'추측하기 쉬워요. 이어지는 숫자입니다.'};
  if(dateLike(v))return {level:2,text:'추측하기 쉬워요. 생년월일 같은 날짜 모양입니다.'};
  if(/^01[016789]\d{7,8}$/.test(v))return {level:2,text:'추측하기 쉬워요. 휴대폰 번호 모양입니다.'};
  if(new Set(v).size<=2)return {level:2,text:'추측하기 쉬워요. 숫자 종류가 너무 적습니다.'};
  return {level:3,text:'쓰기 좋은 번호예요.'};
 }
 /* What to say under one field, from the browser's own validity report. */
 function messageFor(field,label){
  const v=field.validity;if(!v||v.valid)return '';
  const name=label||'이 칸';
  if(v.customError)return field.validationMessage||'';
  if(v.valueMissing){
   if(field.type==='checkbox')return '동의해야 진행할 수 있습니다.';
   return `${name}${object(name)} ${field.tagName==='SELECT'?'선택':'입력'}해 주세요.`;
  }
  if(v.typeMismatch&&field.type==='email')return '이메일 형식을 확인해 주세요. 예: name@example.com';
  if(v.patternMismatch||v.tooShort||v.tooLong){
   const range=/\[0-9\]\{(\d+),(\d+)\}/.exec(field.getAttribute('pattern')||'');
   if(range)return `숫자 ${range[1]}~${range[2]}자리로 입력해 주세요.`;
  }
  return `${name}${object(name)} 다시 확인해 주세요.`;
 }
 function mount(win){
  const doc=win&&win.document,root=doc&&doc.getElementById('memberContent');
  if(!root||typeof root.addEventListener!=='function')return null;
  let serial=0,firstInvalid=null;
  const isField=el=>el&&/^(INPUT|SELECT)$/.test(el.tagName)&&root.contains(el);
  function labelOf(field){
   const wrap=field.closest('label');if(!wrap||field.type==='checkbox')return '';
   const named=wrap.querySelector('span[id]');if(named)return named.textContent.trim();
   for(const node of wrap.childNodes)if(node.nodeType===3&&node.textContent.trim())return node.textContent.trim();
   return '';
  }
  function slot(field,create){
   const wrap=field.closest('label');if(!wrap)return null;
   const check=field.type==='checkbox';
   let note=check?(wrap.nextElementSibling&&wrap.nextElementSibling.classList.contains('member-field-error')?wrap.nextElementSibling:null):wrap.querySelector('.member-field-error');
   if(!note&&create){
    note=doc.createElement(check?'p':'span');note.className='member-field-error';note.id='memberFieldError'+(++serial);note.setAttribute('role','alert');
    if(check)wrap.after(note);else wrap.append(note);
   }
   return note;
  }
  function describe(field,id,on){
   const ids=(field.getAttribute('aria-describedby')||'').split(/\s+/).filter(x=>x&&x!==id);if(on)ids.push(id);
   if(ids.length)field.setAttribute('aria-describedby',ids.join(' '));else field.removeAttribute('aria-describedby');
  }
  function show(field){
   const text=messageFor(field,labelOf(field)),note=slot(field,Boolean(text));
   if(!text){if(note){describe(field,note.id,false);note.remove();}field.removeAttribute('aria-invalid');return;}
   note.textContent=text;field.setAttribute('aria-invalid','true');describe(field,note.id,true);
  }
  /* The two login numbers are compared as they are typed, so the difference is named under the second one. */
  function matchPins(form){
   const pin=form&&form.elements&&form.elements.pin,again=form&&form.elements&&form.elements.pinAgain;if(!pin||!again)return;
   again.setCustomValidity(again.value&&pin.value!==again.value?'로그인 번호가 서로 다릅니다.':'');
   if(again.hasAttribute('aria-invalid')||(again.value&&!again.validity.valid&&again.value.length>=pin.value.length))show(again);
  }
  function meter(field){
   if(field.name!=='pin'||field.getAttribute('autocomplete')!=='new-password')return;
   const wrap=field.closest('label');let box=wrap.nextElementSibling&&wrap.nextElementSibling.classList.contains('member-strength')?wrap.nextElementSibling:null;
   const state=pinStrength(field.value);
   if(!state.level){if(box)box.remove();return;}
   if(!box){box=doc.createElement('div');box.className='member-strength';box.innerHTML='<span></span><span></span><span></span><p aria-live="polite"></p>';wrap.after(box);}
   box.dataset.level=String(state.level);const p=box.querySelector('p');if(p.textContent!==state.text)p.textContent=state.text;
  }
  root.addEventListener('invalid',e=>{
   if(!isField(e.target))return;
   e.preventDefault();show(e.target);
   if(!firstInvalid){firstInvalid=e.target;win.setTimeout(()=>{const el=firstInvalid;firstInvalid=null;if(el&&el.isConnected)el.focus();},0);}
  },true);
  root.addEventListener('input',e=>{
   if(!isField(e.target))return;
   meter(e.target);matchPins(e.target.form);
   if(e.target.hasAttribute('aria-invalid'))show(e.target);
  });
  root.addEventListener('change',e=>{if(isField(e.target)&&e.target.hasAttribute('aria-invalid'))show(e.target);});
  root.addEventListener('focusout',e=>{
   if(!isField(e.target)||e.target.type==='checkbox')return;
   if(e.target.value||e.target.hasAttribute('aria-invalid'))show(e.target);
  });
  return {show};
 }
 return {object,pinStrength,messageFor,mount};
});
