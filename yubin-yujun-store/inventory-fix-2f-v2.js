(()=>{
  const KEY='yubinYujunStore.items.v2';
  const FIX='yubinYujunStore.forceSecondFloorItems.2026-07-24.v2';
  const SNAP='yubinYujunStore.beforeForceSecondFloorItems.2026-07-24.v2';
  const now=new Date().toISOString();
  const required=[
    {id:'seed-umaibo-assorted',name:'우마이봉 14종 모둠팩',category:'스낵',shelf:2,expiry:'2026-09-30',quantity:1,unit:'봉',remaining:1,opened:false,needsReview:false,note:'14가지 맛 모둠'},
    {id:'seed-shinchan-lemon-cola',name:'짱구 나리키리 드링크 레몬콜라맛',category:'기타',shelf:2,expiry:'2027-03-18',quantity:1,unit:'봉',remaining:1,opened:false,needsReview:false,note:'BANDAI NAMCO · 물에 타서 만드는 음료'},
    {id:'seed-seafood-mix-7',name:'7종 해산물 믹스 크래커',category:'스낵',shelf:2,expiry:'2026-11-04',quantity:1,unit:'봉',remaining:1,opened:false,needsReview:false,note:'7 Types of Assorted Seafood Flavored Crackers · 58g'}
  ];
  const norm=(value='')=>String(value).toLowerCase().replace(/[^0-9a-z가-힣]/g,'');
  const aliases={
    '우마이봉14종모둠팩':['우마이봉14종모둠팩','우마이봉모둠','umaiboassorted'],
    '짱구나리키리드링크레몬콜라맛':['짱구나리키리드링크레몬콜라맛','나리키리드링크','레몬콜라맛'],
    '7종해산물믹스크래커':['7종해산물믹스크래커','해산물믹스','7typesofassortedseafoodflavoredcrackers']
  };
  const matches=(item,product)=>{
    if(item.id===product.id)return true;
    const target=norm(product.name);
    const names=aliases[target]||[target];
    const current=norm(item.name);
    return names.some(name=>current.includes(norm(name))||norm(name).includes(current));
  };
  let items=[];
  try{const parsed=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(parsed))items=parsed;}catch{}
  if(!localStorage.getItem(FIX)){
    localStorage.setItem(SNAP,JSON.stringify(items));
    for(const product of required){
      const existing=items.find(item=>matches(item,product));
      if(existing){Object.assign(existing,{...product,createdAt:existing.createdAt||now,updatedAt:now});}
      else items.push({...product,createdAt:now,updatedAt:now});
    }
    localStorage.setItem(KEY,JSON.stringify(items));
    localStorage.setItem(FIX,'done');
  }
  window.YUBIN_YUJUN_REQUIRED_2F=required;
})();
