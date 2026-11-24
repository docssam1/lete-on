(function(){
 'use strict';const settings=DATA.somaParameterGeneration;if(!settings||!window.SomaVariants)return;
 const schemas=new Map(settings.manifest.parameterSchema.types.map(t=>[t.typeId,t])), samples=new Map(settings.examples.map(s=>[s.proposedTypeId,s]));
 const states=new Map();const local=location.protocol==='http:'&&['127.0.0.1','localhost'].includes(location.hostname);
 el('stats').insertAdjacentHTML('beforeend','<br>입력 조건으로 만들기 44유형 · 추가 확인 예시 '+settings.examples.filter(s=>!s.equivalentExistingInstanceId).length+'개');
 const launch=document.getElementById('open-textbook-items');const visibility=new IntersectionObserver(entries=>{if(launch)launch.style.visibility=entries.some(e=>e.target===document.getElementById('soma-parameter-form')&&e.isIntersecting)?'hidden':'';});
 function state(tid){if(!states.has(tid))states.set(tid,{values:Object.fromEntries(schemas.get(tid).fields.map(f=>[f.key,f.default])),errors:{},message:'',pending:false,profile:null});return states.get(tid);}
 function draw(){
  visibility.disconnect();if(launch)launch.style.visibility='';
  const panel=document.getElementById('soma-variant-panel');if(!panel||panel.hidden)return;const tid=el('type').value,def=schemas.get(tid);if(!def)return;const st=state(tid);
  const form=document.createElement('form');form.className='soma-parameter-form no-print';form.id='soma-parameter-form';form.noValidate=true;
  const heading=document.createElement('h4');heading.textContent='조건을 바꿔 만들기';form.append(heading);
  const note=document.createElement('p');note.className='meta';note.textContent=def.note;form.append(note);
  if(!local){const message=document.createElement('p');message.textContent='새 조건으로 만드는 기능은 Mac 실행 화면에서 사용할 수 있습니다. 확인한 예시는 여기에서도 볼 수 있습니다.';const link=document.createElement('a');link.href=settings.localURL;link.textContent='Mac 실행 화면 열기';message.append(' ',link);form.append(message);}
  const grid=document.createElement('div');grid.className='soma-parameter-fields';form.append(grid);
  for(const field of def.fields){
   const wrap=document.createElement(field.kind==='grid'||field.kind==='digits'?'fieldset':'div');wrap.className='soma-parameter-field';const id='soma-param-'+field.key;const lab=document.createElement(wrap.tagName==='FIELDSET'?'legend':'label');lab.textContent=field.label;if(lab.tagName==='LABEL')lab.htmlFor=id;wrap.append(lab);
   let input;
   if(field.kind==='select'){
    input=document.createElement('select');input.id=id;
    for(const option of field.options){const opt=document.createElement('option');opt.value=JSON.stringify(option.value);opt.textContent=option.label;opt.selected=option.value===st.values[field.key];input.append(opt);}
    input.onchange=()=>{st.values[field.key]=JSON.parse(input.value);};wrap.append(input);
   }else if(field.kind==='number'){
    input=document.createElement('input');input.type='number';input.id=id;input.min=field.min;input.max=field.max;input.step=field.step;input.value=st.values[field.key]??'';input.oninput=()=>{st.values[field.key]=input.value===''?null:Number(input.value);};wrap.append(input);
    const range=document.createElement('small');range.textContent=`${field.min}〜${field.max}${field.step===1?'':' · '+field.step+' 간격'}`;wrap.append(range);
   }else{
    const board=document.createElement('div');board.className=field.kind==='grid'?'soma-input-grid':'soma-input-digits';
    for(let i=0;i<field.cells;i++){
     const cell=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=!!(st.values[field.key]&(1<<i));check.dataset.bit=String(i);check.setAttribute('aria-label',field.kind==='grid'?`${Math.floor(i/3)+1}행 ${i%3+1}열`:`숫자 ${i}`);
     check.onchange=()=>{st.values[field.key]=check.checked?st.values[field.key]|(1<<i):st.values[field.key]&~(1<<i);};cell.append(check);if(field.kind==='digits')cell.append(String(i));board.append(cell);
    }wrap.append(board);
   }
   if(st.errors[field.key]){const error=document.createElement('p');error.id=id+'-error';error.className='soma-parameter-error';error.textContent=st.errors[field.key];wrap.append(error);const target=input||wrap;target.setAttribute('aria-invalid','true');target.setAttribute('aria-describedby',error.id);}
   grid.append(wrap);
  }
  const controls=document.createElement('div');controls.className='variant-controls';const submit=document.createElement('button');submit.type='submit';submit.className='primary';submit.id='soma-parameter-generate';submit.textContent=st.pending?'문제를 확인하고 있어요':'이 조건으로 문제 만들기';submit.disabled=!local||st.pending;const example=document.createElement('button');example.type='button';example.id='soma-parameter-example';example.textContent='예시 조건으로 보기';example.disabled=st.pending;
  example.onclick=()=>{const s=samples.get(tid);st.values={...s.generationParameters};st.errors={};st.profile=s.computationalProfile;st.message=s.equivalentExistingInstanceId?'같은 조건의 기존 문항을 열었습니다.':'확인한 예시 문항을 열었습니다.';SomaVariants.addGenerated(s);};controls.append(submit,example);form.append(controls);
  const status=document.createElement('p');status.className=Object.keys(st.errors).length?'soma-parameter-error':'meta';status.id='soma-parameter-status';status.setAttribute('role','status');status.textContent=st.message;form.append(status);
  if(st.profile){const prep=document.createElement('div');prep.className='soma-parameter-preparation';const title=document.createElement('b');title.textContent='이 조건에 필요한 연산·준비';const range=document.createElement('p');range.textContent=st.profile.numberRangeNote;const ops=document.createElement('p');ops.textContent=st.profile.operations.length?st.profile.operations.join(' · '):'모양·위치·분류·조건 설명을 사용합니다.';prep.append(title,range,ops);form.append(prep);}
  form.onsubmit=async event=>{
   event.preventDefault();if(st.pending||!local)return;st.pending=true;st.errors={};st.message='문제의 조건과 답·그림을 확인하고 있습니다.';const parameters={...st.values};SomaVariants.refresh();
   try{
    const response=await fetch('/api/generation/soma',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({typeId:tid,parameters})});const result=await response.json();
    if(!response.ok){st.errors=result.fields||{};throw new Error(result.error||'문제를 만들지 못했습니다. 조건을 다시 확인해 주세요.');}
    st.profile=result.example.computationalProfile;st.message=result.receipt.reusedExistingVariant?'같은 조건의 기존 문항을 열었습니다.':'문제와 답·그림 확인을 마쳤습니다. 문제지에 담아 사용할 수 있습니다.';st.pending=false;SomaVariants.addGenerated(result.example);
   }catch(error){st.pending=false;st.message=error.message&&error.message!=='Failed to fetch'?error.message:'Mac 실행 화면에 연결하지 못했습니다. 실행 주소를 확인해 주세요.';SomaVariants.refresh();}
  };
  panel.append(form);visibility.observe(form);
 }
 window.addEventListener('soma-variant-refreshed',draw);
 const css=document.createElement('style');css.textContent='.soma-parameter-form{margin-top:24px;padding-top:20px;border-top:1px solid #c4cec4}.soma-parameter-form h4{margin-top:0;font-size:18px}.soma-parameter-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:16px 0}.soma-parameter-field{display:flex;flex-direction:column;gap:7px;min-width:0}.soma-parameter-field label,.soma-parameter-field legend{font-weight:600}.soma-parameter-field input[type=number],.soma-parameter-field select{box-sizing:border-box;width:100%;min-height:44px}.soma-parameter-field small{color:var(--muted)}.soma-parameter-field fieldset{border:0}.soma-input-grid{display:grid;grid-template-columns:repeat(3,48px);gap:2px}.soma-input-grid label,.soma-input-digits label{display:flex;align-items:center;justify-content:center;gap:5px;min-width:44px;min-height:44px;border:1px solid #aebfb5;cursor:pointer}.soma-input-grid label:has(input:checked){background:#d3e5dc}.soma-input-grid input{width:22px;height:22px}.soma-input-digits{display:flex;flex-wrap:wrap;gap:6px}.soma-parameter-error{color:#9f3028;font-weight:600;line-height:1.6}.soma-parameter-preparation{border-left:3px solid var(--green);padding-left:14px;margin-top:18px;line-height:1.7}.soma-parameter-preparation p{margin:7px 0}@media(max-width:600px){.soma-parameter-fields{grid-template-columns:1fr}.soma-parameter-form .variant-controls button{white-space:normal}}';document.head.append(css);draw();
}());
