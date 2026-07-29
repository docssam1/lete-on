(()=>{
  const KEY='yubinYujunStore.items.v2';
  const FIX='yubinYujunStore.confirmMangoProducts.2026-07-24.v1';
  const SNAP='yubinYujunStore.beforeConfirmMangoProducts.2026-07-24.v1';
  const now=new Date().toISOString();
  const required=[
    {id:'seed-mango-soft-kingkong-500g',name:'KINGKONG M.A.R.T. 소프트 건조망고 500g',category:'스낵',shelf:3,expiry:'2027-06-02',quantity:1,unit:'봉',remaining:1,opened:false,needsReview:false,note:'새 제품 · Xoài sấy dẻo · EXP 06.02.2027'},
    {id:'seed-mango-vietnam-orange',name:'베트남 소프트 건조망고',category:'스낵',shelf:3,expiry:'2027-02-04',quantity:1,unit:'봉',remaining:1,opened:false,needsReview:false,note:'새 제품 · 스프트 건조망고 · EXP 02.04.2027'}
  ];
  const norm=(value='')=>String(value).toLowerCase().replace(/[^0-9a-z가-힣]/g,'');
  const isOldMango=(item)=>['seed-mango-a','seed-mango-b'].includes(item.id)||['망고과자a','망고과자b'].includes(norm(item.name));
  const matches=(item,product)=>item.id===product.id||norm(item.name)===norm(product.name);
  let items=[];
  try{const parsed=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(parsed))items=parsed;}catch{}
  if(!localStorage.getItem(FIX)){
    localStorage.setItem(SNAP,JSON.stringify(items));
    items=items.filter(item=>!isOldMango(item));
    for(const product of required){
      const existing=items.find(item=>matches(item,product));
      if(existing){Object.assign(existing,{...product,createdAt:existing.createdAt||now,updatedAt:now});}
      else items.push({...product,createdAt:now,updatedAt:now});
    }
    localStorage.setItem(KEY,JSON.stringify(items));
    localStorage.setItem(FIX,'done');
  }
  window.YUBIN_YUJUN_MANGO_3F=required;
})();
