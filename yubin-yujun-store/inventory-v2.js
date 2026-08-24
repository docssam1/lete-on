const SEED_ITEMS=[{"id":"snack-01","floor":3,"category":"건과일","name":"KingKong Mart Soft & Juicy Mango (500g)","qty":1,"unit":"개","expiry":"2027-02-06","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-02","floor":3,"category":"건과일","name":"Soft Dried Mango (주황색 포장)","qty":1,"unit":"개","expiry":"2027-04-12","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-03","floor":3,"category":"초콜릿","name":"See's Candies Toffee-ettes (142g)","qty":1,"unit":"상자","expiry":"2026-09-20","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-04","floor":4,"category":"스낵","name":"건빵","qty":12,"unit":"개","expiry":"2027-02-23","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-05","floor":3,"category":"젤리","name":"TOP FRU FUDGE 망고 젤리","qty":1,"unit":"개","expiry":"2026-12-01","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-06","floor":3,"category":"건과일","name":"MANGO STRIPS","qty":1,"unit":"개","expiry":"2027-01-20","expiryLabel":"","remain":0.3333333333333333,"opened":true,"note":""},{"id":"snack-07","floor":2,"category":"스낵","name":"오리온 꼬북칩 초코맛","qty":1,"unit":"봉","expiry":"2026-10-21","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-08","floor":2,"category":"스낵","name":"오리온 도도한 나쵸 치즈맛","qty":1,"unit":"봉","expiry":"2026-11-30","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-09","floor":2,"category":"스낵","name":"크라운 참쌀선과","qty":6,"unit":"개","expiry":"2026-08-24","expiryLabel":"","remain":null,"opened":true,"note":"개봉 · 6개 남음"},{"id":"snack-10","floor":2,"category":"스낵","name":"치킨팝 닭강정맛","qty":1,"unit":"봉","expiry":"2026-10-29","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-11","floor":3,"category":"젤리","name":"Okio Strawberry Gummy","qty":1,"unit":"봉","expiry":"2027-05-04","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-12","floor":3,"category":"건과일","name":"Delight Project 상큼한 딸기칩","qty":1,"unit":"봉","expiry":"2026-12-05","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-13","floor":2,"category":"스낵","name":"농심 쫄병 안성탕면맛","qty":1,"unit":"봉","expiry":"2026-12-26","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-14","floor":1,"category":"기타","name":"마루짱 아카이 키츠네 우동","qty":3,"unit":"개","expiry":"2026-12-11","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-15","floor":1,"category":"쿠키","name":"리츠 초코 샌드","qty":1,"unit":"상자","expiry":"2027-03-31","expiryLabel":"2027년 3월","remain":1,"opened":false,"note":"월 단위 표기"},{"id":"snack-16","floor":1,"category":"기타","name":"포핀쿠킨 아이스크림 만들기","qty":1,"unit":"상자","expiry":"2028-06-30","expiryLabel":"2028년 6월","remain":1,"opened":false,"note":"월 단위 표기"},{"id":"snack-17","floor":1,"category":"기타","name":"포핀쿠킨 피자 만들기","qty":1,"unit":"상자","expiry":"2027-10-31","expiryLabel":"2027년 10월","remain":1,"opened":false,"note":"월 단위 표기"},{"id":"snack-18","floor":1,"category":"기타","name":"포핀쿠킨 초밥 만들기","qty":1,"unit":"상자","expiry":"2027-11-30","expiryLabel":"2027년 11월","remain":1,"opened":false,"note":"월 단위 표기"},{"id":"snack-19","floor":1,"category":"초콜릿","name":"부르봉 키코리노 키리카부 초코 스낵","qty":1,"unit":"상자","expiry":"2027-03-31","expiryLabel":"2027년 3월","remain":1,"opened":false,"note":"월 단위 표기"},{"id":"snack-20","floor":2,"category":"스낵","name":"오뚜기 콘크림 스프팝콘","qty":1,"unit":"봉","expiry":"2026-10-14","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-21","floor":3,"category":"스낵","name":"올리브영 레인보우 치즈 베이글칩","qty":1,"unit":"봉","expiry":"2026-11-11","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-22","floor":3,"category":"초콜릿","name":"MUJI 포도 구미 초콜릿","qty":1,"unit":"봉","expiry":"2027-04-08","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-23","floor":3,"category":"기타","name":"MUJI 캐러멜 푸딩 만들기 키트","qty":1,"unit":"개","expiry":"2027-01-21","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-24","floor":3,"category":"사탕","name":"MUJI 유자&금귤 캔디","qty":1,"unit":"봉","expiry":"2026-11-24","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-25","floor":2,"category":"스낵","name":"강냉이","qty":1,"unit":"봉","expiry":"2027-04-14","expiryLabel":"","remain":0.8,"opened":true,"note":""},{"id":"snack-26","floor":2,"category":"스낵","name":"HBAF 메가사이즈 버터솔트 팝콘","qty":1,"unit":"봉","expiry":"","expiryLabel":"","remain":0.2,"opened":true,"note":"유통기한 확인 필요"},{"id":"snack-27","floor":1,"category":"쿠키","name":"오레오 초콜릿 샌드위치 쿠키","qty":1,"unit":"상자","expiry":"2027-05-08","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-28","floor":1,"category":"스낵","name":"오리온 고래밥 볶음양념맛","qty":1,"unit":"봉","expiry":"2026-11-18","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-29","floor":3,"category":"사탕","name":"카멜레온 캔디 (KIKKO)","qty":1,"unit":"봉","expiry":"2027-07-24","expiryLabel":"","remain":0.6666666666666666,"opened":true,"note":""},{"id":"snack-30","floor":3,"category":"사탕","name":"Cand'Art 체리맛 롤리팝","qty":4,"unit":"개","expiry":"2027-05-14","expiryLabel":"","remain":1,"opened":false,"note":"낱개 4개"},{"id":"snack-31","floor":3,"category":"육포","name":"세븐셀렉트 진화육포","qty":1,"unit":"봉","expiry":"2027-04-20","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-32","floor":2,"category":"초콜릿","name":"MUJI 초코과자","qty":1,"unit":"봉","expiry":"2026-12-04","expiryLabel":"","remain":0.8,"opened":true,"note":""},{"id":"snack-33","floor":2,"category":"스낵","name":"두부과자","qty":1,"unit":"봉","expiry":"2026-10-08","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-34","floor":4,"category":"건과일","name":"구운 바나나칩","qty":1,"unit":"봉","expiry":"2027-02-20","expiryLabel":"","remain":0.3333333333333333,"opened":true,"note":""},{"id":"snack-35","floor":3,"category":"초콜릿","name":"Crunky Devil 코코몬드 (코코넛 & 아몬드 초콜릿)","qty":1,"unit":"개","expiry":"2026-12-21","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-36","floor":1,"category":"쿠키","name":"KUNNA 코코넛 크리스피 롤(초코)","qty":1,"unit":"상자","expiry":"2027-12-02","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-37","floor":5,"category":"음료","name":"매일 추억의 자판기 우유맛 분말스틱","qty":8,"unit":"개","expiry":"2027-07-19","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-38","floor":5,"category":"기타","name":"크리스피 카다이프 (프리미엄 레시피)","qty":1,"unit":"봉","expiry":"2027-03-31","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-39","floor":3,"category":"젤리","name":"유니버설 스튜디오 싱가포르 젤리(별 모양)","qty":1,"unit":"통","expiry":"2026-12-31","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-40","floor":2,"category":"스낵","name":"우마이봉 14종 모둠팩","qty":1,"unit":"봉","expiry":"2026-09-30","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-41","floor":2,"category":"기타","name":"짱구 나리키리 드링크 레몬콜라맛","qty":1,"unit":"봉","expiry":"2027-03-18","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-42","floor":2,"category":"스낵","name":"7종 해산물 믹스 크래커","qty":1,"unit":"봉","expiry":"2026-11-04","expiryLabel":"","remain":1,"opened":false,"note":""},{"id":"snack-43","floor":2,"category":"기타","name":"글리코 쵸콧토 푸칭푸딩 커스터드","qty":3,"unit":"팩","expiry":"2026-11-08","expiryLabel":"","remain":1,"opened":false,"note":""}];
const STORAGE_KEY='yubinYujunStore.cleanInventory.v2';
const VERSION_KEY='yubinYujunStore.cleanInventory.version';
const VERSION='2026-07-24-user-confirmed-v2';
const BACKUP_KEY='yubinYujunStore.beforeCleanInventory.2026-07-24-v2';

const icons={건과일:'🥭',초콜릿:'🍫',젤리:'🍬',사탕:'🍭',스낵:'🥨',쿠키:'🍪',육포:'🥩',음료:'🥛',기타:'📦'};
const colors={건과일:'#f0a23b',초콜릿:'#7a4c36',젤리:'#ed6c8d',사탕:'#d85283',스낵:'#ee8b2d',쿠키:'#bc7b45',육포:'#a83c37',음료:'#4b95e9',기타:'#7464cf'};

let items=[];
let category='전체';
let query='';
let openedOnly=false;
let editingId=null;

const $=id=>document.getElementById(id);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

function initialize(){
  if(localStorage.getItem(VERSION_KEY)!==VERSION){
    const backup={createdAt:new Date().toISOString(),previous:{
      oldItemsV2:localStorage.getItem('yubinYujunStore.items.v2'),
      oldConfirmed:localStorage.getItem('yubinYujunStore.confirmed.v1'),
      currentClean:localStorage.getItem(STORAGE_KEY)
    }};
    localStorage.setItem(BACKUP_KEY,JSON.stringify(backup));
    localStorage.setItem(STORAGE_KEY,JSON.stringify(SEED_ITEMS));
    localStorage.setItem(VERSION_KEY,VERSION);
  }
  try{const parsed=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');items=Array.isArray(parsed)?parsed:SEED_ITEMS;}catch{items=SEED_ITEMS.map(x=>({...x}));}
}

function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(items));}
function daysUntil(date){if(!date)return null;return Math.ceil((new Date(date+'T23:59:59')-new Date())/86400000);}
function expiryMeta(item){
  if(!item.expiry)return {label:'날짜 확인 필요',tone:'review',short:'확인 필요'};
  const days=daysUntil(item.expiry);
  const label=item.expiryLabel||item.expiry.replaceAll('-','.');
  if(days<0)return {label,detail:'기한 지남',tone:'danger',short:'기한 지남'};
  if(days<=30)return {label,detail:`D-${days}`,tone:'danger',short:`D-${days}`};
  if(days<=90)return {label,detail:`D-${days}`,tone:'warning',short:`D-${days}`};
  return {label,detail:`D-${days}`,tone:'safe',short:`D-${days}`};
}
function remainingLabel(item){
  if(!item.opened)return '새 상품';
  if(item.remain==null)return '개봉';
  const pairs=[[.8,'4/5 남음'],[.67,'2/3 남음'],[.5,'절반 남음'],[.33,'1/3 남음'],[.2,'1/5 남음']];
  const found=pairs.find(([n])=>Math.abs(Number(item.remain)-n)<.02);
  return found?`개봉 · ${found[1]}`:`개봉 · ${Math.round(Number(item.remain)*100)}% 남음`;
}
function isVisible(item){
  if(Number(item.qty)<=0)return false;
  const categoryMatch=category==='전체'||item.category===category||(category==='사탕·젤리'&&(item.category==='사탕'||item.category==='젤리'));
  const queryMatch=!query||`${item.name} ${item.category} ${item.note||''}`.toLowerCase().includes(query);
  return categoryMatch&&queryMatch&&(!openedOnly||item.opened);
}
function sortedFloorItems(floor){
  return items.filter(item=>Number(item.floor)===floor&&isVisible(item)).sort((a,b)=>{
    if(!a.expiry&&!b.expiry)return a.name.localeCompare(b.name,'ko');
    if(!a.expiry)return 1;if(!b.expiry)return -1;
    return a.expiry.localeCompare(b.expiry);
  });
}
function render(){renderStats();renderFloorJumps();renderPriority();renderCabinet();}
function renderStats(){
  const active=items.filter(x=>Number(x.qty)>0);
  $('kindCount').textContent=active.length;
  $('unitCount').textContent=active.reduce((sum,x)=>sum+Number(x.qty||0),0);
  $('urgentCount').textContent=active.filter(x=>{const d=daysUntil(x.expiry);return d!=null&&d<=90;}).length;
  $('openedCount').textContent=active.filter(x=>x.opened).length;
}
function renderFloorJumps(){
  $('floorJumps').innerHTML=[5,4,3,2,1].map(f=>{
    const list=items.filter(x=>Number(x.floor)===f&&Number(x.qty)>0);
    const nearest=list.filter(x=>x.expiry).sort((a,b)=>a.expiry.localeCompare(b.expiry))[0];
    return `<button class="floor-jump" data-floor="${f}" type="button"><strong>${f}층 · ${list.length}종</strong><span>${nearest?`가장 빠름 ${nearest.expiryLabel||nearest.expiry.replaceAll('-','.')}`:'등록된 날짜 없음'}</span></button>`;
  }).join('');
  document.querySelectorAll('.floor-jump').forEach(btn=>btn.onclick=()=>document.querySelector(`[data-floor-section="${btn.dataset.floor}"]`)?.scrollIntoView({block:'start'}));
}
function renderPriority(){
  const list=items.filter(x=>Number(x.qty)>0&&x.expiry).sort((a,b)=>a.expiry.localeCompare(b.expiry)).slice(0,5);
  $('priorityList').innerHTML=list.map(x=>{
    const meta=expiryMeta(x);
    return `<button class="priority-item" data-edit="${x.id}" type="button"><b>${escapeHtml(x.name)}</b><span>${x.floor}층 · ${x.qty}${escapeHtml(x.unit)}</span><em>${escapeHtml(meta.label)} · ${meta.short}</em></button>`;
  }).join('');
  document.querySelectorAll('[data-edit]').forEach(btn=>btn.onclick=()=>openDialog(btn.dataset.edit));
}
function renderCabinet(){
  $('cabinet').innerHTML=[5,4,3,2,1].map(floor=>{
    const list=sortedFloorItems(floor);
    const position=floor===5?'맨 위':floor===1?'맨 아래':'';
    return `<section class="floor" data-floor-section="${floor}"><div class="floor-head"><span class="floor-badge">${floor}층</span><span class="floor-position">${position}</span><span class="floor-count">${list.length}종</span></div><div class="cards">${list.length?list.map(cardTemplate).join(''):'<div class="empty">현재 필터에 맞는 상품이 없습니다.</div>'}</div></section>`;
  }).join('');
  document.querySelectorAll('[data-action="edit"]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();openDialog(btn.dataset.id);});
  document.querySelectorAll('[data-action="eat"]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();consumeOne(btn.dataset.id);});
  document.querySelectorAll('.card').forEach(card=>card.onclick=()=>openDialog(card.dataset.id));
}
function cardTemplate(item){
  const meta=expiryMeta(item);
  const statusClass=!item.expiry?'review':item.opened?'opened':'';
  const progress=item.remain==null?'':`<div class="progress"><i style="width:${Math.max(0,Math.min(1,Number(item.remain)))*100}%"></i></div>`;
  return `<article class="card" data-id="${item.id}" style="--cat:${colors[item.category]||'#777'}"><span class="status ${statusClass}">${escapeHtml(remainingLabel(item))}</span><div class="card-top"><span class="icon">${icons[item.category]||'📦'}</span><div><div class="card-name">${escapeHtml(item.name)}</div><div class="category">${escapeHtml(item.category)}</div></div></div><div class="card-mid"><div class="expiry"><strong>${escapeHtml(meta.label)}</strong>${meta.detail||''}</div><div class="qty">${item.qty}${escapeHtml(item.unit)}</div></div>${progress}<div class="card-actions"><button data-action="eat" data-id="${item.id}" type="button">1개 먹음</button><button data-action="edit" data-id="${item.id}" type="button">수정</button></div></article>`;
}
function consumeOne(id){
  const item=items.find(x=>x.id===id);if(!item)return;
  if(Number(item.qty)<=1){if(!confirm(`${item.name}을(를) 모두 먹은 것으로 0개 처리할까요?`))return;item.qty=0;}
  else item.qty=Number(item.qty)-1;
  persist();render();showToast(`${item.name} 수량을 줄였습니다.`);
}
function openDialog(id=null){
  editingId=id;
  const item=id?items.find(x=>x.id===id):{floor:1,category:'스낵',name:'',qty:1,unit:'개',expiry:'',expiryLabel:'',remain:1,opened:false,note:''};
  $('dialogTitle').textContent=id?'상품 수정':'새 상품 등록';$('itemId').value=id||'';$('nameInput').value=item.name||'';$('floorInput').value=item.floor||1;$('categoryInput').value=item.category||'스낵';$('qtyInput').value=item.qty??1;$('unitInput').value=item.unit||'개';$('expiryInput').value=item.expiry||'';$('expiryLabelInput').value=item.expiryLabel||'';$('remainInput').value=item.remain==null?'':String(item.remain);$('openedInput').checked=Boolean(item.opened);$('noteInput').value=item.note||'';$('deleteBtn').style.visibility=id?'visible':'hidden';$('itemDialog').showModal();
}
function closeDialog(){$('itemDialog').close();}
function saveForm(event){
  event.preventDefault();
  const record={id:editingId||`custom-${Date.now()}`,floor:Number($('floorInput').value),category:$('categoryInput').value,name:$('nameInput').value.trim(),qty:Number($('qtyInput').value||0),unit:$('unitInput').value.trim()||'개',expiry:$('expiryInput').value,expiryLabel:$('expiryLabelInput').value.trim(),remain:$('remainInput').value===''?null:Number($('remainInput').value),opened:$('openedInput').checked,note:$('noteInput').value.trim()};
  if(editingId){const index=items.findIndex(x=>x.id===editingId);if(index>=0)items[index]=record;}else items.push(record);
  persist();closeDialog();render();showToast('저장했습니다.');
}
function deleteCurrent(){
  if(!editingId)return;if(!confirm('이 상품을 삭제할까요?'))return;
  items=items.filter(x=>x.id!==editingId);persist();closeDialog();render();showToast('삭제했습니다.');
}
function exportBackup(){
  const blob=new Blob([JSON.stringify({version:VERSION,exportedAt:new Date().toISOString(),items},null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='유빈유준편의점_재고백업.json';a.click();URL.revokeObjectURL(url);
}
function importBackup(event){
  const file=event.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(reader.result);const incoming=Array.isArray(parsed)?parsed:parsed.items;if(!Array.isArray(incoming))throw new Error();items=incoming;persist();render();showToast('백업을 불러왔습니다.');}catch{alert('올바른 백업 파일이 아닙니다.');}};reader.readAsText(file);event.target.value='';
}
let toastTimer;function showToast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),1800);}

$('searchInput').oninput=e=>{query=e.target.value.trim().toLowerCase();render();};
document.querySelectorAll('[data-category]').forEach(btn=>btn.onclick=()=>{category=btn.dataset.category;document.querySelectorAll('[data-category]').forEach(x=>x.classList.toggle('active',x===btn));render();});
$('openedFilter').onclick=()=>{openedOnly=!openedOnly;$('openedFilter').textContent=openedOnly?'전체 보기':'개봉만 보기';render();};
$('addBtn').onclick=()=>openDialog();$('closeBtn').onclick=closeDialog;$('cancelBtn').onclick=closeDialog;$('itemForm').onsubmit=saveForm;$('deleteBtn').onclick=deleteCurrent;$('exportBtn').onclick=exportBackup;$('importInput').onchange=importBackup;

initialize();render();
if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js?v=21').catch(()=>{});
