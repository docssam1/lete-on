// Reuse the deployed, existing A-02 controller unchanged. No new math, scored
// questions, learner profile, curriculum, grading or cloud persistence is added.
let controller=null,sessionState=null;
const status=document.querySelector('#status'),retry=document.querySelector('#retry');
async function start(){
  retry.hidden=true;status.hidden=false;status.textContent='기존 입체 마법 노트를 준비하고 있습니다.';
  try{
    const {mount}=await import('https://lete-on.gfieldacademy.net/number_magic/app/activity-journey.js');
    controller=await mount(document.querySelector('#livingLesson'),'A-02','ko',{saved:sessionState,save:async state=>{sessionState=structuredClone(state);},onTown:()=>{}});
    if(!controller)throw Error('Lesson did not mount');status.hidden=true;
  }catch(e){controller?.dispose();controller=null;status.textContent='체험을 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 불러와 주세요.';retry.hidden=false;console.error('Existing A-02 trial unavailable',e);}
}
retry.addEventListener('click',start);window.addEventListener('pagehide',()=>controller?.dispose());
start();
