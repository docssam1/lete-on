(()=>{
  const normalize=value=>String(value||'').toLowerCase().replace(/[^0-9a-z가-힣]/g,'');
  const targets=[
    {aliases:['건빵'],floor:4},
    {aliases:['강냉이'],floor:4},
    {aliases:['MUJI 초코과자','무인양품 비스킷'],floor:4,name:'무인양품 비스킷',note:'기존 MUJI 초코과자'},
    {aliases:['두부과자'],floor:4},
    {aliases:['HBAF 메가사이즈 버터솔트 팝콘','HBAF 팝콘'],floor:4},
    {aliases:['구운 바나나칩'],floor:4}
  ];
  if(typeof items==='undefined'||!Array.isArray(items))return;
  let changed=false;
  for(const target of targets){
    const found=items.find(item=>target.aliases.some(alias=>{
      const a=normalize(alias),n=normalize(item.name);
      return n===a||n.includes(a)||a.includes(n);
    }));
    if(!found)continue;
    if(Number(found.floor)!==4){found.floor=4;changed=true;}
    if(target.name&&found.name!==target.name){found.name=target.name;changed=true;}
    if(target.note&&!String(found.note||'').includes(target.note)){
      found.note=[found.note,target.note].filter(Boolean).join(' · ');
      changed=true;
    }
  }
  if(changed){persist();render();}
})();
