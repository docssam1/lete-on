/*
 * 컨설팅 모드(원장님 2026-11-12). 서버에서 확인한 검수 아이디(아이디+승인번호)로 들어왔을 때만
 * membership-gate.js가 이 파일을 불러온다. 쿼리 문자열이나 로컬 표시만으로는 열리지 않는다.
 * - 학생별 새 계획: 학생마다 별도 저장 소유자(owner)를 써서 기존 PlannerStorage 구조를 그대로 나눈다.
 *   첫 학생은 계정 아이디 그대로 써서 이전에 만든 검수 계정 설계를 잃지 않는다.
 * - 상담 코멘트: 총평·인쇄 본문 맨 앞 총평 다음에 원장님이 직접 쓰는 쪽을 넣는다.
 * - 학생 목록·코멘트는 이 기기에만 둔다. 계정 클라우드 저장은 컨설팅 모드에서 쓰지 않는다.
 */
(function(g){
 'use strict';
 const PREFIX='gfield.consult.v1.',FIRST='main',MAX_IMAGE=1200,MAX_NAME=20;
 let account='',state=null;
 const store=()=>{try{return g.localStorage||null;}catch{return null;}};
 const get=k=>{try{return store()?.getItem(k)??null;}catch{return null;}};
 const put=(k,v)=>{try{const s=store();if(!s)return false;s.setItem(k,v);return true;}catch{return false;}};
 const listKey=()=>PREFIX+account;
 const commentKey=id=>PREFIX+account+'.comment.'+id;
 const cleanName=v=>String(v??'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,MAX_NAME);
 const ownerOf=(acc,id)=>id===FIRST?acc:acc+'.c.'+id;
 const newId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

 function restore(raw){
  let v=null;try{v=JSON.parse(raw||'null');}catch{}
  const students=Array.isArray(v?.students)?v.students.filter(s=>s&&typeof s.id==='string'&&/^[a-z0-9]{1,24}$/.test(s.id)).map(s=>({id:s.id,name:cleanName(s.name)})):[];
  if(!students.some(s=>s.id===FIRST))students.unshift({id:FIRST,name:''});
  const current=students.some(s=>s.id===v?.current)?v.current:students[0].id;
  return {students,current};
 }
 function save(){return put(listKey(),JSON.stringify(state));}
 function current(){return state.students.find(s=>s.id===state.current);}

 // 게이트가 학습 자료를 불러오기 전에 부른다. 반환한 owner가 RoadmapMember.user_id가 된다.
 function prepare(member){
  account=String(member.user_id);state=restore(get(listKey()));save();
  const s=current();
  return {owner:ownerOf(account,s.id),name:s.name,student:s.id};
 }

 // ----- 붙여넣은 코멘트를 저장·표시하기 전에 허용한 서식만 남긴다 -----
 const TAGS=new Set(['P','DIV','BR','B','STRONG','I','EM','U','SPAN','FONT','UL','OL','LI','IMG']);
 const COLOR=/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|transparent)$/i;
 function sanitize(html,doc=g.document){
  const box=doc.createElement('div');box.innerHTML=String(html||'');
  const walk=node=>{
   for(const child of [...node.childNodes]){
    if(child.nodeType===3)continue;
    if(child.nodeType!==1||!TAGS.has(child.tagName)){if(child.nodeType===1&&!['SCRIPT','STYLE','IFRAME','OBJECT','EMBED'].includes(child.tagName)){walk(child);child.replaceWith(...child.childNodes);}else child.remove();continue;}
    const keep={};
    if(child.tagName==='IMG'){const src=child.getAttribute('src')||'';if(!/^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i.test(src)){child.remove();continue;}keep.src=src;keep.alt='상담 사진';}
    const color=child.style?.color,bg=child.style?.backgroundColor,fcolor=child.tagName==='FONT'?child.getAttribute('color'):null;
    const style=[color&&COLOR.test(color)?'color:'+color:'',bg&&COLOR.test(bg)?'background-color:'+bg:'',fcolor&&COLOR.test(fcolor)?'color:'+fcolor:''].filter(Boolean).join(';');
    for(const a of [...child.attributes])child.removeAttribute(a.name);
    for(const [k,v] of Object.entries(keep))child.setAttribute(k,v);
    if(style)child.setAttribute('style',style);
    walk(child);
   }
  };
  walk(box);return box.innerHTML;
 }

 // ----- 학생 바 -----
 function el(doc,tag,attrs={},text){const n=doc.createElement(tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(text!=null)n.textContent=text;return n;}
 function switchTo(id){state.current=id;save();g.location.reload();}
 function mountBar(doc){
  const bar=el(doc,'section',{class:'consult-bar','aria-label':'컨설팅 모드 · 학생 선택'});
  const label=el(doc,'strong',{class:'consult-mode'},'컨설팅 모드');
  const pick=el(doc,'label',{class:'consult-field'});pick.append(el(doc,'span',{},'학생'));
  const select=el(doc,'select',{id:'consultStudent'});
  for(const s of state.students){const o=el(doc,'option',{value:s.id},s.name||'이름 없는 학생');if(s.id===state.current)o.selected=true;select.append(o);}
  select.onchange=()=>switchTo(select.value);pick.append(select);
  const form=el(doc,'form',{class:'consult-name'});
  const nameLabel=el(doc,'label',{class:'consult-field'});nameLabel.append(el(doc,'span',{},'이름'));
  const input=el(doc,'input',{id:'consultName',type:'text',maxlength:String(MAX_NAME),autocomplete:'off',placeholder:'학생 이름'});input.value=current().name;nameLabel.append(input);
  form.append(nameLabel,el(doc,'button',{type:'submit'},'이름 적용'));
  form.onsubmit=e=>{e.preventDefault();const s=current();s.name=cleanName(input.value);save();g.location.reload();};
  const add=el(doc,'button',{type:'button',class:'consult-add'},'새 학생');
  add.onclick=()=>{const id=newId();state.students.push({id,name:''});switchTo(id);};
  const comment=el(doc,'button',{type:'button',class:'consult-comment-open'},'상담 코멘트');
  const status=el(doc,'p',{class:'consult-status',role:'status','aria-live':'polite'},'학생별 설계와 코멘트는 이 기기에만 저장됩니다.');
  comment.onclick=()=>{const open=doc.getElementById('openReport');if(!open||open.hidden){status.textContent='학습 로드맵을 끝까지 만들면 총평·인쇄 화면에서 코멘트를 쓸 수 있습니다.';return;}open.click();g.setTimeout(()=>{const ed=doc.getElementById('consultEditor');ed?.scrollIntoView({block:'center'});ed?.focus();},60);};
  bar.append(label,pick,form,add,comment,status);
  const top=doc.querySelector('.top');top?top.after(bar):doc.body.prepend(bar);
  doc.body.classList.add('consult-active');
 }

 // ----- 총평·인쇄 안의 상담 코멘트 쪽 -----
 function shrink(file){
  return new Promise((resolve,reject)=>{
   const reader=new FileReader();reader.onerror=()=>reject(reader.error);
   reader.onload=()=>{const img=new Image();img.onerror=()=>reject(new Error('image'));img.onload=()=>{const r=Math.min(1,MAX_IMAGE/Math.max(img.width,img.height));const c=g.document.createElement('canvas');c.width=Math.round(img.width*r);c.height=Math.round(img.height*r);c.getContext('2d').drawImage(img,0,0,c.width,c.height);resolve(c.toDataURL('image/jpeg',.82));};img.src=reader.result;};
   reader.readAsDataURL(file);
  });
 }
 // ----- 총평과 메모를 채팅창에 붙여넣기 위한 상담 요청문으로 정리한다 -----
 function reportText(doc,names,max=30000){
  const host=doc.getElementById('plannerReportContent');if(!host)return '';
  let text=[...host.children].filter(n=>!n.classList.contains('pr-consult')).map(n=>(n.innerText||n.textContent||'').trim()).filter(Boolean).join('\n\n');
  for(const n of names)if(n&&n.length>=2)text=text.split(n).join('학생');
  return text.slice(0,max);
 }
 function draftHtml(doc,text){
  const box=doc.createElement('div');
  for(const para of String(text).split(/\n{2,}|\n/).map(t=>t.trim()).filter(Boolean)){const p=doc.createElement('p');p.textContent=para;box.append(p);}
  return box.innerHTML;
 }
 function consultationText(report,memo,names=[]){
  let text=[
   '아래 학생의 현재 로드맵과 상담 메모를 바탕으로 학습 프로그램을 짜 주세요.',
   '현재 진도와 혼자 풀 수 있는 범위를 출발점으로 삼고, 교과·심화·사고력·연산의 병행과 주간 학습량을 구체적으로 정리해 주세요.',
   '학부모에게 전할 친절한 상담 요약, 우선 보완할 내용, 이번 주 공부와 다음 점검 기준을 적어 주세요.',
   '자료에 없는 성적·기간·일정은 지어내지 말고 추가로 확인할 질문으로 남겨 주세요.',
   '',
   '[로드맵 총평]',report.trim(),'',
   '[원장님 상담 메모]',memo.trim()||'(메모 없음)'
  ].join('\n');
  for(const name of names)if(name&&name.length>=2)text=text.split(name).join('학생');
  return text.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[이메일 제외]')
   .replace(/(?:\+82[ -]?)?0?1[016789][ -]?\d{3,4}[ -]?\d{4}\b/g,'[연락처 제외]');
 }
 function copyPanel(doc,s,ed){
  const panel=el(doc,'section',{class:'consult-export','aria-labelledby':'consultExportTitle'});
  const heading=el(doc,'div',{class:'consult-export-heading'});
  heading.append(el(doc,'h3',{id:'consultExportTitle'},'채팅창에서 학습 계획 이어가기'),
   el(doc,'p',{},'총평과 상담 메모를 함께 복사해 원하는 학습 프로그램을 요청하세요.'));
  const actions=el(doc,'div',{class:'consult-export-actions'});
  const b=el(doc,'button',{type:'button',class:'ct-copy',title:'총평과 메모를 복사해 채팅창에서 학습 계획을 요청할 수 있습니다.'},'상담 내용 복사');
  const note=el(doc,'p',{class:'consult-copy-status',role:'status','aria-live':'polite'});
  const preview=el(doc,'details',{class:'consult-copy-preview'});
  const summary=el(doc,'summary',{},'복사할 내용 미리보기');
  const hint=el(doc,'p',{id:'consultCopyHint',class:'consult-copy-hint'},'등록된 학생 이름과 휴대폰·이메일 형식은 가립니다. 보내기 전에 내용을 확인해 주세요.');
  const textBox=el(doc,'textarea',{class:'consult-copy-text',readonly:'','aria-label':'채팅창에 붙여넣을 상담 내용','aria-describedby':'consultCopyHint',rows:'9'});
  const contents=()=>{
   const names=[s.name,g.RoadmapMember?.student_name];
   return consultationText(reportText(doc,names,Infinity),(ed.innerText||ed.textContent||'').trim(),names);
  };
  preview.append(summary,hint,textBox);
  preview.addEventListener('toggle',()=>{if(preview.open)textBox.value=contents();});
  ed.addEventListener('input',()=>{if(preview.open)textBox.value=contents();});
  b.onmousedown=e=>e.preventDefault();
  b.onclick=async()=>{
   const text=contents();textBox.value=text;
   b.disabled=true;b.setAttribute('aria-busy','true');
   try{
    await g.navigator.clipboard.writeText(text);
    note.textContent='복사했습니다. 채팅창에 붙여넣어 학습 계획을 요청해 주세요.';
   }catch{
    preview.open=true;textBox.focus();textBox.select();
    note.textContent='아래 내용을 선택했습니다. 복사한 뒤 채팅창에 붙여넣어 주세요.';
   }finally{b.disabled=false;b.removeAttribute('aria-busy');}
  };
  actions.append(b);panel.append(heading,actions,note,preview);
  return panel;
 }
 function commentPage(doc){
  const s=current(),id=s.id;
  const page=el(doc,'section',{class:'pr-page pr-consult','aria-labelledby':'consultTitle'});
  const head=el(doc,'header',{class:'pr-section-heading'});head.append(el(doc,'h2',{class:'pr-section-title',id:'consultTitle'},'원장님 상담 코멘트'));
  const tools=el(doc,'div',{class:'consult-tools',role:'toolbar','aria-label':'코멘트 서식'});
  const ed=el(doc,'div',{id:'consultEditor',class:'consult-editor',contenteditable:'true',role:'textbox','aria-multiline':'true','aria-labelledby':'consultTitle'});
  ed.innerHTML=sanitize(get(commentKey(id))||'');
  const note=el(doc,'p',{class:'consult-saved',role:'status','aria-live':'polite'});
  let timer=0;
  const persist=()=>{g.clearTimeout(timer);const html=sanitize(ed.innerHTML);note.textContent=put(commentKey(id),html)?'이 기기에 저장했습니다.':'저장하지 못했습니다. 사진 크기나 브라우저 저장 공간을 확인해 주세요.';page.classList.toggle('consult-empty',!ed.textContent.trim()&&!ed.querySelector('img'));};
  const later=()=>{g.clearTimeout(timer);timer=g.setTimeout(persist,800);};
  const cmd=(c,v=null)=>{ed.focus();try{doc.execCommand('styleWithCSS',false,true);}catch{}doc.execCommand(c,false,v);later();};
  const tool=(text,title,fn,cls)=>{const b=el(doc,'button',{type:'button',title,'aria-label':title},text);if(cls)b.className=cls;b.onmousedown=e=>e.preventDefault();b.onclick=fn;tools.append(b);};
  tool('굵게','굵게',()=>cmd('bold'),'ct-bold');
  tool('밑줄','밑줄',()=>cmd('underline'),'ct-under');
  tool('형광펜','노란 형광펜',()=>cmd('hiliteColor','#fef08a'),'ct-mark');
  tool('빨강','빨간 글씨',()=>cmd('foreColor','#c62828'),'ct-red');
  tool('파랑','파란 글씨',()=>cmd('foreColor','#2456c4'),'ct-blue');
  tool('서식 지우기','서식 지우기',()=>{cmd('removeFormat');cmd('hiliteColor','transparent');});
  const photo=el(doc,'label',{class:'consult-photo'});photo.append(doc.createTextNode('사진 넣기'));
  const file=el(doc,'input',{type:'file',accept:'image/png,image/jpeg,image/webp'});
  file.onchange=async()=>{const f=file.files?.[0];file.value='';if(!f)return;try{const src=await shrink(f);cmd('insertImage',src);persist();}catch{note.textContent='사진을 넣지 못했습니다.';}};
  photo.append(file);tools.append(photo);
  ed.addEventListener('input',later);ed.addEventListener('blur',persist);
  ed.addEventListener('paste',e=>{const html=e.clipboardData?.getData('text/html');if(!html)return;e.preventDefault();doc.execCommand('insertHTML',false,sanitize(html));later();});
  const lead=el(doc,'p',{class:'pr-lead consult-lead'},(s.name?s.name+' 학생의 ':'')+'상담에서 확인한 내용과 다음 공부 방향을 적어 주세요.');
  const writing=el(doc,'div',{class:'consult-writing'});writing.append(tools,ed);
  page.append(head,lead,writing,note,copyPanel(doc,s,ed));
  page.classList.toggle('consult-empty',!ed.textContent.trim()&&!ed.querySelector('img'));
  return page;
 }
 function watchReport(doc){
  const host=doc.getElementById('plannerReportContent');if(!host)return;
  const place=()=>{if(host.querySelector('.pr-consult'))return;const front=host.querySelector('.pr-front');if(!front)return;front.after(commentPage(doc));};
  new MutationObserver(place).observe(host,{childList:true});place();
 }

 function mount(doc=g.document){mountBar(doc);watchReport(doc);}
 g.RoadmapConsult=Object.freeze({prepare,mount,sanitize,restore,ownerOf,reportText,draftHtml,consultationText});
})(typeof window!=='undefined'?window:globalThis);
