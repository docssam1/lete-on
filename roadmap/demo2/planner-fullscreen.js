/* Move the live map into a native modal; never copy learner state or chart data. */
(function(global){
'use strict';
const dialog=document.getElementById('atlasFullscreen'),host=document.getElementById('atlasFullscreenBody'),panel=document.getElementById('journeyPanel');
let slot=null,origin=null,scroll=0,pageY=0;
function restore(){
 if(!slot)return;
 slot.replaceWith(panel);slot=null;panel.scrollTop=scroll;
 document.body.classList.remove('atlas-is-fullscreen');global.scrollTo({top:pageY,behavior:'instant'});
 (origin?.isConnected?origin:document.getElementById('atlasExpand')).focus({preventScroll:true});origin=null;
}
function close(){if(dialog.open)dialog.close();restore();}
function open(view='map',button){
 if(dialog.open)return;
 origin=button||document.activeElement;scroll=panel.scrollTop;pageY=global.scrollY;
 slot=document.createComment('live learning map');panel.before(slot);host.append(panel);
 dialog.dataset.view=view==='graph'?'graph':'map';
 document.getElementById('atlasFullscreenTitle').textContent=view==='graph'?'진도와 속도 비교':'우리 아이의 공부 지도';
 document.body.classList.add('atlas-is-fullscreen');dialog.showModal();host.scrollTop=0;
 document.getElementById('atlasFullscreenClose').focus({preventScroll:true});
}
function leaveForAction(button){
 if(!dialog.open||button.dataset.atlasFull||button.dataset.atlasJump||button.closest('.faq-orbit')||button.dataset.transitionKind==='axis')return;
 close();
}
document.addEventListener('click',e=>{const button=e.target.closest('[data-atlas-full]');if(button)open(button.dataset.atlasFull,button);});
document.getElementById('atlasFullscreenClose').addEventListener('click',close);
dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
dialog.addEventListener('close',restore);
global.PlannerFullscreen=Object.freeze({open,close,leaveForAction,isOpen:()=>dialog.open,container:()=>dialog.open?host:panel});
})(window);
