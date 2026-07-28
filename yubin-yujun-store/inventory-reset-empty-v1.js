(()=>{
  const KEY='yubinYujunStore.items.v2';
  const RESET='yubinYujunStore.resetEmpty.2026-07-24.v1';
  const SNAP='yubinYujunStore.beforeResetEmpty.2026-07-24.v1';
  if(!localStorage.getItem(RESET)){
    try{localStorage.setItem(SNAP,localStorage.getItem(KEY)||'[]');}catch{}
    localStorage.setItem(KEY,JSON.stringify([{id:'reset-placeholder',name:'초기화 자리표시자',category:'기타',shelf:null,expiry:'',quantity:0,unit:'개',remaining:1,opened:false,needsReview:false,note:'재고를 새로 받기 위해 비운 상태입니다.',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}]));
    localStorage.setItem(RESET,'done');
  }
})();
