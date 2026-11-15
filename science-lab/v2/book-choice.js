import{questionMisconceptions}from'./question-revision.js?v=20261104-energy-class';
const controllers=new WeakMap();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function wireBookChoices(root,{misc=null,onAnswer=null,questions=null}={}){
 const releases=[];
 root.querySelectorAll('.bk-choices[data-key]').forEach(ol=>{
  const previous=controllers.get(ol);previous?.release();
  if(ol.dataset.done)return;
  previous?.tools?.remove();
  const rows=[...ol.querySelectorAll('li')],key=ol.dataset.key.split(',').map(value=>value.trim()).filter(Boolean).map(Number),ids=new Set(rows.map(li=>Number(li.dataset.j)));
  if(!key.length||new Set(key).size!==key.length||key.some(j=>!Number.isInteger(j)||!ids.has(j)))return;
  ol.closest?.('.bk-page')?.classList.add('bk-choice-page');
  const multi=key.length>1,picked=new Set(),listeners=[],controls=[];let active=true,tools=null,status=null,check=null;
  const bind=(el,type,fn)=>{el.addEventListener(type,fn);listeners.push(()=>el.removeEventListener(type,fn));};
  const update=()=>{if(!multi)return;check.disabled=!picked.size;status.textContent=picked.size?`${picked.size}개를 골랐어요.`:'맞는 것을 모두 고른 뒤 확인해요.';};
  const finish=selected=>{
   if(!active||ol.dataset.done||!selected.length)return;
   ol.dataset.done='1';const ok=selected.length===key.length&&key.every(j=>selected.includes(j)),wrong=selected.filter(j=>!key.includes(j));
   rows.forEach(li=>{const j=Number(li.dataset.j);li.classList.remove('bk-selected');if(key.includes(j))li.classList.add('ok');else if(selected.includes(j))li.classList.add('no');});controls.forEach(c=>{c.disabled=true;});
   if(check){check.disabled=true;status.textContent=ok?'맞았어요.':`다시 살펴봐요. 정답은 ${key.map(j=>j+1).join(', ')}번이에요.`;}
   const effective=questionMisconceptions(questions?.[ol.dataset.id],misc),codes=new Set(wrong.map(j=>effective?.distractors?.[ol.dataset.id]?.[j]).filter(Boolean)),fixes=[...codes].map(id=>effective?.misconceptions?.[id]).filter(Boolean);
   if(fixes.length){const d=ol.ownerDocument.createElement('div');d.className='bk-fix';d.innerHTML=fixes.map(m=>`<span class="mis-tag">${esc(m.label)}</span> ${m.fix}`).join(' ');(tools||ol).after(d);}
   onAnswer?.('item',{id:ol.dataset.id,ok,picked:multi?(ok?selected:wrong):selected[0],...(multi?{selected:[...selected]}:{}),el:ol});
  };
  if(multi){
   tools=ol.ownerDocument.createElement('div');tools.className='bk-choice-tools bk-web';status=ol.ownerDocument.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');check=ol.ownerDocument.createElement('button');check.type='button';check.className='bk-choice-check';check.textContent='선택한 답 확인';tools.append(status,check);ol.after(tools);bind(check,'click',e=>{e.stopPropagation();finish([...picked].sort((a,b)=>a-b));});
  }
  rows.forEach(li=>{
   const j=Number(li.dataset.j);li.classList.add('bk-choice-row');
   if(multi){
    let input=li.querySelector('.bk-choice-input'),label=li.querySelector('.bk-choice-option');
    if(!input){label=ol.ownerDocument.createElement('label');label.className='bk-choice-option';input=ol.ownerDocument.createElement('input');input.type='checkbox';input.className='bk-choice-input';const text=ol.ownerDocument.createElement('span');text.className='bk-choice-text';text.append(...li.childNodes);label.append(input,text);li.append(label);}
    input.disabled=false;controls.push(input);if(input.checked)picked.add(j);li.classList.toggle('bk-selected',!!input.checked);bind(label,'click',e=>e.stopPropagation());bind(input,'change',()=>{if(!active||ol.dataset.done)return;if(input.checked)picked.add(j);else picked.delete(j);li.classList.toggle('bk-selected',input.checked);update();});
   }else{
    let button=li.querySelector('.bk-choice-option');if(!button){button=ol.ownerDocument.createElement('button');button.type='button';button.className='bk-choice-option';button.append(...li.childNodes);li.append(button);}button.disabled=false;controls.push(button);bind(button,'click',e=>{e.stopPropagation();finish([j]);});
   }
  });update();
  const release=()=>{if(!active)return;active=false;listeners.forEach(remove=>remove());};controllers.set(ol,{release,tools});releases.push(release);
 });
 return()=>releases.forEach(release=>release());
}
