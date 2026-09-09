(function(root){
 'use strict';
 root.HFChallengeSecureDocument=async function(){
  const kind=document.body.dataset.documentKind,main=document.querySelector('main'),round=document.getElementById('round'),note=document.getElementById('documentAccessStatus');let version=0,questions='',answers='',loadedKey='',contentVersion='';
  const key=()=>`challenge-${kind}-${round.value}`;
  function clear(){version++;questions='';answers='';loadedKey='';contentVersion='';main.replaceChildren();}
  function update(){main.innerHTML=questions+answers;root.HFChallengeContent.stamp(main);if(kind==='concept'){const unit=document.getElementById('unit').value;main.querySelectorAll('.concept-page').forEach(p=>{p.classList.remove('hidden-round');p.classList.toggle('hidden-unit',unit!=='all'&&p.dataset.chapter!==unit);});document.body.classList.toggle('show-answers',document.getElementById('answers').checked);}const name=document.getElementById('studentName');if(name)name.value=root.HFChallengeAccess.approvedStudentName();}
  async function load(part='questions'){
   const productKey=key();if(!root.HFChallengeAccess.allow(productKey)){clear();return;}
   const current=version;const data=await root.HFChallengeContent.request({action:'document',productKey,part});
   if(current!==version||productKey!==key())return;
   if(part==='questions'){questions=data.document.html;answers='';loadedKey=productKey;contentVersion=data.contentVersion;}else{if(loadedKey!==productKey)return;if(data.contentVersion!==contentVersion)throw Error('교재가 갱신되었습니다. 문제와 답안을 같은 버전으로 다시 열어 주세요.');answers=data.document.html;}update();
  }
  async function withError(fn){try{await fn();}catch(e){clear();note.textContent=e.message;}}
  round.addEventListener('change',()=>{clear();if(kind==='concept'){document.getElementById('unit').value='all';document.getElementById('answers').checked=false;}else document.body.dataset.print='exam';withError(()=>load());});
  root.addEventListener('hfchallengeaccesschange',()=>{clear();withError(()=>load());});
  root.addEventListener('beforeprint',()=>{if(!root.HFChallengeAccess.allow(key()))clear();});
  if(kind==='concept'){
   const unit=document.getElementById('unit');for(let n=1;n<=8;n++)unit.add(new Option(n+'단원',String(n)));unit.add(new Option('REVIEW','review'));unit.addEventListener('change',()=>{if(questions)update();});
   document.getElementById('answers').addEventListener('change',e=>withError(async()=>{if(e.target.checked&&!answers)await load('answers');else update();}));
   document.getElementById('print').addEventListener('click',()=>{if(root.HFChallengeAccess.allow(key())&&questions)root.print();else clear();});
  }else{
   document.getElementById('regenerateExam').textContent='시험지 다시 확인';document.getElementById('regenerateExam').addEventListener('click',()=>withError(()=>load()));
   document.getElementById('printExam').addEventListener('click',()=>{if(root.HFChallengeAccess.allow(key())&&questions){document.body.dataset.print='exam';root.print();}else clear();});
   document.getElementById('printAnswers').addEventListener('click',()=>withError(async()=>{if(!answers)await load('answers');if(root.HFChallengeAccess.allow(key())&&answers){document.body.dataset.print='answers';root.print();}}));
  }
  await withError(()=>load());
 };
})(window);
