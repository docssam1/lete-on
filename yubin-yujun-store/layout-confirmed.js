(()=>{
const KEY='yubinYujunStore.items.v2',LEGACY='yubinYujunStore.items.v1',FIX='yubinYujunStore.layoutConfirmed.2026-07-24.v3',SNAP='yubinYujunStore.beforeLayoutConfirmed.2026-07-24.v3';
const UDON_FIX='yubinYujunStore.addKitsuneUdon.2026-07-24.v1',UDON_SNAPSHOT='yubinYujunStore.beforeAddKitsuneUdon.2026-07-24.v1';
const JAPAN_BOX_FIX='yubinYujunStore.addJapanBoxes.2026-07-24.v1',JAPAN_BOX_SNAPSHOT='yubinYujunStore.beforeAddJapanBoxes.2026-07-24.v1';
const SECOND_FLOOR_FIX='yubinYujunStore.addSecondFloorBatch.2026-07-24.v1',SECOND_FLOOR_SNAPSHOT='yubinYujunStore.beforeAddSecondFloorBatch.2026-07-24.v1';
const now='2026-07-24T00:00:00.000Z';
const seed=(id,name,category,shelf,expiry='',quantity=1,unit='봉',remaining=1,opened=false,needsReview=false,note='')=>({id,name,category,shelf,expiry,quantity,unit,remaining,opened,needsReview,note,createdAt:now,updatedAt:now});
const kitsuneUdon=seed('seed-kitsune-udon','마루짱 아카이 키츠네 우동','기타',1,'2026-12-11',3,'개',1,false,false,'일본 컵우동 · 조리 5분');
const japanBoxes=[
seed('seed-ritz-choco-sand','리츠 초코 샌드','쿠키',1,'2027-03-31',1,'박스',1,false,false,'포장 표기 2027.03 · 6개×2팩 · 월말 기준 입력'),
seed('seed-popin-ice','크라시에 포핀쿠킨 아이스크림 만들기','기타',1,'2028-06-30',1,'박스',1,false,false,'포장 표기 2028.06 · 월말 기준 입력'),
seed('seed-popin-pizza','크라시에 포핀쿠킨 피자 만들기','기타',1,'2027-10-31',1,'박스',1,false,false,'포장 표기 2027.10 · 월말 기준 입력'),
seed('seed-popin-sushi','크라시에 포핀쿠킨 초밥 만들기','기타',1,'2027-11-30',1,'박스',1,false,false,'포장 표기 2027.11 · 월말 기준 입력'),
seed('seed-kikori-kirikabu','부르봉 키코리노 키리카부 초코 스낵','초콜릿',1,'2027-03-31',1,'박스',1,false,false,'きこりの切株 · 포장 표기 2027.03 · 월말 기준 입력')
];
const secondFloorBatch=[
seed('seed-umaibo-assorted','우마이봉 14종 모둠팩','스낵',2,'2026-09-30',1,'봉',1,false,false,'14가지 맛 모둠'),
seed('seed-shinchan-lemon-cola','짱구 나리키리 드링크 레몬콜라맛','기타',2,'2027-03-18',1,'봉',1,false,false,'BANDAI NAMCO · 물에 타서 만드는 음료'),
seed('seed-seafood-mix-7','7종 해산물 믹스 크래커','스낵',2,'2026-11-04',1,'봉',1,false,false,'7 Types of Assorted Seafood Flavored Crackers · 58g')
];
const desired=[
seed('seed-goraebab','고래밥','스낵',1),seed('seed-oreo','오레오','쿠키',1,'2027-06-08',1,'박스'),seed('seed-kunna','코코넛 초코','초콜릿',1,'2027-12-02',1,'박스',1,false,false,'기존 KUNNA 코코넛 크리스피 롤'),kitsuneUdon,...japanBoxes,
seed('seed-turtle','꼬북칩','스낵',2),seed('seed-nacho','나쵸','스낵',2),seed('seed-muji','무인양품 초코과자','초콜릿',2,'',1,'봉',.8,true,false,'약 4/5 남음'),seed('seed-cornpop','옥수수스프맛 팝콘','스낵',2),seed('seed-tofu','두부과자','스낵',2,'2026-10-08'),seed('seed-rice','쌀과자','스낵',2),seed('seed-ansung','안성탕면','기타',2,'',1,'개'),seed('seed-jjol','쫄병','스낵',2),seed('seed-chickenpop','치킨팝','스낵',2),...secondFloorBatch,
seed('seed-hardtak','건빵','쿠키',4,'2027-04-06',12,'개'),seed('seed-gangnaengi','강냉이','스낵',4,'',1,'봉',1,false,true,'수량과 유통기한 확인 필요'),seed('seed-butterpop','버터맛 팝콘','스낵',4,'2026-10-09',1,'봉',.2,true,false,'기존 HBAF 메가 버터 솔트 팝콘'),seed('seed-banana','구운 바나나칩','스낵',4,'2027-02-20',1,'봉',.33,true),
seed('seed-milkstick','매일 추억의 자판기 우유맛 분말스틱','음료',5,'2027-07-19',9,'개',1,false,false,'처음 10개에서 1개 먹음'),seed('seed-kadayif','Crispy Kadayif','기타',5,'',1,'봉',1,false,true,'유통기한 약 3개월 남음')
];
const rules=[
[5,'매일 추억의 자판기 우유맛 분말스틱',['분말스틱','우유맛분말스틱','매일추억의자판기우유맛분말스틱']],[5,'Crispy Kadayif',['카다이프','crispykadayif']],
[1,'고래밥',['고래밥']],[1,'오레오',['오레오','oreo']],[1,'코코넛 초코',['코코넛초코','kunna코코넛크리스피롤','코코넛크리스피롤']],[1,'마루짱 아카이 키츠네 우동',['마루짱아카이키츠네우동','아카이키츠네우동','빨간키츠네우동','赤いきつねうどん']],[1,'리츠 초코 샌드',['리츠초코샌드','리츠초코샌드위치','ritzchocosand','ritzchocolatesandwich']],[1,'크라시에 포핀쿠킨 아이스크림 만들기',['포핀쿠킨아이스크림','아이스크림만들기','たのしいアイスやさん']],[1,'크라시에 포핀쿠킨 피자 만들기',['포핀쿠킨피자','피자만들기','たのしいピザやさん']],[1,'크라시에 포핀쿠킨 초밥 만들기',['포핀쿠킨초밥','초밥만들기','たのしいおすしやさん']],[1,'부르봉 키코리노 키리카부 초코 스낵',['키코리노키리카부','きこりの切株','부르봉나무그루터기초코']],
[2,'꼬북칩',['꼬북칩','거북칩','거북찹']],[2,'나쵸',['나쵸','나초','nacho']],[2,'무인양품 초코과자',['무인양품초코과자','무인초코과자','무인초커과자','무인양품비스킷','무인양품바나나칩']],[2,'옥수수스프맛 팝콘',['옥수수스프맛팝콘','옥수수수프맛팝콘','코옥수수스프맛팝콘']],[2,'두부과자',['두부과자']],[2,'쌀과자',['쌀과자']],[2,'안성탕면',['안성탕면']],[2,'쫄병',['쫄병']],[2,'치킨팝',['치킨팝']],[2,'우마이봉 14종 모둠팩',['우마이봉14종모둠팩','우마이봉모둠','umaiboassorted']],[2,'짱구 나리키리 드링크 레몬콜라맛',['짱구나리키리드링크레몬콜라맛','나리키리드링크','레몬콜라맛','なりきりドリンク']],[2,'7종 해산물 믹스 크래커',['7종해산물믹스크래커','해산물믹스','7種の海鮮ミックス']],
[4,'건빵',['건빵','건방']],[4,'강냉이',['강냉이']],[4,'버터맛 팝콘',['버터맛팝콘','hbaf메가버터솔트팝콘','메가버터솔트팝콘']],[4,'구운 바나나칩',['구운바나나칩','바나나칩']]
];
const norm=s=>String(s||'').toLowerCase().replace(/[^0-9a-z가-힣]/g,'');
const ruleFor=name=>{const n=norm(name);return rules.find(r=>r[2].some(a=>n.includes(norm(a))||norm(a).includes(n)));};
const canon=name=>norm(ruleFor(name)?.[1]||name);
const parse=k=>{try{const v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch{return[]}};
let items=parse(KEY);if(!items.length)items=parse(LEGACY);if(!localStorage.getItem(FIX)){localStorage.setItem(SNAPSHOT,JSON.stringify(items));items=items.map(x=>({...x,shelf:3}));for(const x of items){const r=ruleFor(x.name);if(r){x.shelf=r[0];x.name=r[1];x.updatedAt=new Date().toISOString();}}const seen=new Set(items.map(x=>canon(x.name)));for(const x of desired){const k=canon(x.name);if(!seen.has(k)){items.push({...x});seen.add(k);}}const dedup=new Map();for(const x of items){const k=canon(x.name),old=dedup.get(k);if(!old){dedup.set(k,x);continue;}const keep=(x.expiry&&!old.expiry)||(Number(x.quantity)>Number(old.quantity))?x:old;dedup.set(k,keep);}items=[...dedup.values()];localStorage.setItem(KEY,JSON.stringify(items));localStorage.setItem(FIX,'done');}
if(!localStorage.getItem(UDON_FIX)){
  items=parse(KEY);localStorage.setItem(UDON_SNAPSHOT,JSON.stringify(items));
  const existing=items.find(x=>canon(x.name)===canon(kitsuneUdon.name));
  if(existing){existing.name=kitsuneUdon.name;existing.category='기타';existing.shelf=1;existing.expiry='2026-12-11';existing.quantity=3;existing.unit='개';existing.remaining=1;existing.opened=false;existing.needsReview=false;existing.note='일본 컵우동 · 조리 5분';existing.updatedAt=new Date().toISOString();}
  else items.push({...kitsuneUdon,updatedAt:new Date().toISOString()});
  localStorage.setItem(KEY,JSON.stringify(items));localStorage.setItem(UDON_FIX,'done');
}
if(!localStorage.getItem(JAPAN_BOX_FIX)){
  items=parse(KEY);localStorage.setItem(JAPAN_BOX_SNAPSHOT,JSON.stringify(items));
  for(const product of japanBoxes){const existing=items.find(x=>canon(x.name)===canon(product.name));if(existing){Object.assign(existing,{name:product.name,category:product.category,shelf:1,expiry:product.expiry,quantity:Math.max(1,Number(existing.quantity||0)),unit:'박스',remaining:Number(existing.remaining||1),needsReview:false,note:product.note,updatedAt:new Date().toISOString()});}else items.push({...product,updatedAt:new Date().toISOString()});}
  localStorage.setItem(KEY,JSON.stringify(items));localStorage.setItem(JAPAN_BOX_FIX,'done');
}
if(!localStorage.getItem(SECOND_FLOOR_FIX)){
  items=parse(KEY);localStorage.setItem(SECOND_FLOOR_SNAPSHOT,JSON.stringify(items));
  for(const product of secondFloorBatch){const existing=items.find(x=>canon(x.name)===canon(product.name));if(existing){Object.assign(existing,{name:product.name,category:product.category,shelf:2,expiry:product.expiry,quantity:Math.max(1,Number(existing.quantity||0)),unit:'봉',remaining:Number(existing.remaining||1),needsReview:false,note:product.note,updatedAt:new Date().toISOString()});}else items.push({...product,updatedAt:new Date().toISOString()});}
  localStorage.setItem(KEY,JSON.stringify(items));localStorage.setItem(SECOND_FLOOR_FIX,'done');
}
try{if(typeof SEED_ITEMS!=='undefined'){SEED_ITEMS.splice(0,SEED_ITEMS.length,...desired,...items.filter(x=>!desired.some(d=>canon(d.name)===canon(x.name))));}}catch{}
})();