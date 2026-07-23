const STORAGE_KEY = 'yubinYujunStore.items.v2';
const LEGACY_STORAGE_KEY = 'yubinYujunStore.items.v1';
const FLOOR_MIGRATION_KEY = 'yubinYujunStore.floorOrder.bottomIs1.v1';
const ORIGINAL_SNAPSHOT_KEY = 'yubinYujunStore.preMigrationSnapshot.v1';
const SEED_SNAPSHOT_KEY = 'yubinYujunStore.intakeSnapshot.2026-07-24';
const DB_NAME = 'yubinYujunStore.images';
const DB_VERSION = 1;
const IMAGE_STORE = 'images';

const SEED_ITEMS = [
  item('seed-goraebab','고래밥','스낵',5,'',1,'봉',1,false,false,'유통기한 미확인'),
  item('seed-oreo','오레오','쿠키',5,'2027-06-08',1,'박스',1,false,false,''),
  item('seed-kunna','KUNNA 코코넛 크리스피 롤','쿠키',5,'2027-12-02',1,'박스',1,false,false,''),
  item('seed-hardtak','건빵','쿠키',4,'2027-04-06',12,'개',1,false,false,'선반 방향을 바로잡아 4층으로 정리'),
  item('seed-muji','무인양품 비스킷','쿠키',4,'',1,'봉',0.8,true,false,'약 4/5 남음'),
  item('seed-tofu','두부과자','스낵',4,'2026-10-08',1,'봉',1,false,false,''),
  item('seed-gangnaengi','강냉이','스낵',4,'',1,'봉',1,false,true,'세부 수량과 유통기한 확인 필요'),
  item('seed-hbaf','HBAF 메가 버터 솔트 팝콘','스낵',4,'2026-10-09',1,'봉',0.2,true,true,'강냉이 옆 · 약 1/5 남음'),
  item('seed-chameleon','Happy Chameleon 캔디','사탕',3,'2027-07-24',1,'봉',0.67,true,false,'약 2/3 남음'),
  item('seed-candart',"Cand'Art 딸기 캔디",'사탕',3,'2027-05-14',4,'개',1,true,false,'낱개 4개'),
  item('seed-jerky','직화육포','육포',3,'2027-04-20',1,'봉',1,false,false,''),
  item('seed-cocomond','Crunchy Devil 코코몬드','스낵',3,'2026-12-21',1,'개',1,false,false,''),
  item('seed-jp-strawberry','일본 딸기 초콜릿 과자','초콜릿',3,'',1,'박스',1,false,true,'사진이 흐려 유통기한 미확정'),
  item('seed-uss-gummy','유니버설 스튜디오 싱가포르 별통 젤리','젤리',3,'2026-12-31',1,'통',1,false,false,''),
  item('seed-blurry-3f','3층 흐린 사진 품목','기타',3,'',1,'개',1,false,true,'제품명과 유통기한을 다시 확인해야 함'),
  item('seed-banana','구운 바나나칩','스낵',2,'2027-02-20',1,'봉',0.33,true,false,'약 1/3 남음'),
  item('seed-milkstick','매일 추억의 자판기 우유맛 분말스틱','음료',1,'2027-07-19',9,'개',1,false,false,'처음 10개에서 1개 먹음'),
  item('seed-kadayif','Crispy Kadayif','기타',1,'',1,'봉',1,false,true,'유통기한 약 3개월 남음으로 임시 기록'),
  item('seed-toi','TOI 과일주스 캔디','사탕',null,'2026-12-01',1,'봉',1,false,true,'제조 2025-12-03 · 층 확인 필요'),
  item('seed-mango-a','망고 과자 A','기타',null,'',1,'개',1,false,true,'망고 제품 2종 중 첫 번째 · 제품명과 층 확인 필요'),
  item('seed-mango-b','망고 과자 B','기타',null,'',1,'개',1,false,true,'망고 제품 2종 중 두 번째 · 제품명과 층 확인 필요'),
  item('seed-orange-a','오렌지 포장 과자 A','기타',null,'2026-12-26',1,'개',1,false,true,'제품명과 층 확인 필요'),
  item('seed-orange-b','오렌지 포장 과자 B','기타',null,'2026-10-14',1,'개',1,false,true,'제품명·날짜·층 재확인 필요')
];

function item(id,name,category,shelf,expiry,quantity,unit,remaining,opened,needsReview,note){
  return {id,name,category,shelf,expiry,quantity,unit,remaining,opened,needsReview,note,createdAt:'2026-07-24T00:00:00.000Z',updatedAt:'2026-07-24T00:00:00.000Z'};
}

const state = {
  items: [],
  query: '',
  category: 'all',
  sort: 'position',
  view: 'all',
  pendingFront: null,
  pendingExpiry: null,
  editingId: null
};

const $ = (id) => document.getElementById(id);
const els = {};
let dbPromise;

window.addEventListener('DOMContentLoaded', async () => {
  Object.assign(els, {
    openAddBtn:$('openAddBtn'),floatingAddBtn:$('floatingAddBtn'),snackDialog:$('snackDialog'),snackForm:$('snackForm'),
    closeDialogBtn:$('closeDialogBtn'),cancelBtn:$('cancelBtn'),deleteBtn:$('deleteBtn'),snackId:$('snackId'),dialogTitle:$('dialogTitle'),
    frontPhotoInput:$('frontPhotoInput'),expiryPhotoInput:$('expiryPhotoInput'),frontPreview:$('frontPreview'),expiryPreview:$('expiryPreview'),
    frontPlaceholder:$('frontPlaceholder'),expiryPlaceholder:$('expiryPlaceholder'),recognitionStatus:$('recognitionStatus'),
    nameInput:$('nameInput'),categoryInput:$('categoryInput'),shelfInput:$('shelfInput'),expiryInput:$('expiryInput'),
    quantityInput:$('quantityInput'),unitInput:$('unitInput'),remainingInput:$('remainingInput'),openedInput:$('openedInput'),
    reviewInput:$('reviewInput'),noteInput:$('noteInput'),dateCandidates:$('dateCandidates'),searchInput:$('searchInput'),
    categoryFilter:$('categoryFilter'),sortSelect:$('sortSelect'),priorityList:$('priorityList'),cabinet:$('cabinet'),
    unassignedPanel:$('unassignedPanel'),unassignedGrid:$('unassignedGrid'),unassignedCount:$('unassignedCount'),
    totalCount:$('totalCount'),unitCount:$('unitCount'),urgentCount:$('urgentCount'),reviewCount:$('reviewCount'),
    showAllBtn:$('showAllBtn'),restoreSeedBtn:$('restoreSeedBtn'),exportBtn:$('exportBtn'),importInput:$('importInput'),toast:$('toast')
  });

  state.items = loadAndProtectItems();
  bindEvents();
  await render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
});

function loadAndProtectItems(){
  localStorage.setItem(SEED_SNAPSHOT_KEY, JSON.stringify(SEED_ITEMS));
  const current = safeParse(localStorage.getItem(STORAGE_KEY));
  if (Array.isArray(current) && current.length) return current.map(normalizeItem);

  const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
  const legacy = safeParse(legacyRaw);
  if (Array.isArray(legacy) && legacy.length) {
    if (!localStorage.getItem(ORIGINAL_SNAPSHOT_KEY)) localStorage.setItem(ORIGINAL_SNAPSHOT_KEY, legacyRaw);
    const shouldInvert = !localStorage.getItem(FLOOR_MIGRATION_KEY);
    const migrated = legacy.map((entry) => {
      const normalized = normalizeItem(entry);
      if (shouldInvert && Number.isInteger(Number(normalized.shelf))) normalized.shelf = 6 - Number(normalized.shelf);
      return normalized;
    });
    localStorage.setItem(FLOOR_MIGRATION_KEY,'done');
    const merged = mergeItems(migrated, SEED_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  const seeded = SEED_ITEMS.map((entry)=>({...entry}));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  localStorage.setItem(FLOOR_MIGRATION_KEY,'done');
  return seeded;
}

function safeParse(raw){try{return raw?JSON.parse(raw):null}catch{return null}}
function normalizeItem(entry){
  return {
    id:entry.id||crypto.randomUUID(),name:String(entry.name||'이름 확인 필요'),category:entry.category||'기타',
    shelf:entry.shelf===''||entry.shelf==null?null:Number(entry.shelf),expiry:entry.expiry||'',quantity:Number(entry.quantity??1),
    unit:entry.unit||'개',remaining:Number(entry.remaining??1),opened:Boolean(entry.opened),needsReview:Boolean(entry.needsReview),
    note:entry.note||'',createdAt:entry.createdAt||new Date().toISOString(),updatedAt:entry.updatedAt||new Date().toISOString()
  };
}
function normalizeName(value=''){return value.toLowerCase().replace(/[^0-9a-z가-힣]/g,'')}
function mergeItems(base, additions){
  const existing = new Set(base.map((entry)=>normalizeName(entry.name)));
  const merged = [...base];
  additions.forEach((entry)=>{if(!existing.has(normalizeName(entry.name))){merged.push({...entry});existing.add(normalizeName(entry.name));}});
  return merged;
}
function persistItems(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state.items))}

function bindEvents(){
  els.openAddBtn.addEventListener('click',()=>openForm());
  els.floatingAddBtn.addEventListener('click',()=>openForm());
  els.closeDialogBtn.addEventListener('click',closeForm);
  els.cancelBtn.addEventListener('click',closeForm);
  els.snackForm.addEventListener('submit',saveSnack);
  els.deleteBtn.addEventListener('click',deleteCurrentSnack);
  els.frontPhotoInput.addEventListener('change',(e)=>handlePhoto(e,'front'));
  els.expiryPhotoInput.addEventListener('change',(e)=>handlePhoto(e,'expiry'));
  els.searchInput.addEventListener('input',(e)=>{state.query=e.target.value.trim().toLowerCase();render();});
  els.categoryFilter.addEventListener('change',(e)=>{state.category=e.target.value;render();});
  els.sortSelect.addEventListener('change',(e)=>{state.sort=e.target.value;render();});
  document.querySelectorAll('[data-view]').forEach((button)=>button.addEventListener('click',()=>{state.view=button.dataset.view;render();scrollToCabinet();}));
  els.showAllBtn.addEventListener('click',()=>{state.view='all';state.query='';state.category='all';els.searchInput.value='';els.categoryFilter.value='all';render();scrollToCabinet();});
  els.cabinet.addEventListener('click',handleCardAction);
  els.unassignedGrid.addEventListener('click',handleCardAction);
  els.restoreSeedBtn.addEventListener('click',restoreSeedItems);
  els.exportBtn.addEventListener('click',exportBackup);
  els.importInput.addEventListener('change',importBackup);
}

async function render(){renderSummary();renderPriority();await renderCabinet();await renderUnassigned();}
function renderSummary(){
  const visible = state.items.filter((entry)=>entry.quantity>0);
  const units = visible.reduce((sum,entry)=>sum+Number(entry.quantity||0),0);
  const urgent = visible.filter(isUrgent).length;
  const review = visible.filter((entry)=>entry.needsReview||!entry.expiry||!entry.shelf).length;
  els.totalCount.textContent=visible.length;els.unitCount.textContent=`총 ${units}개`;els.urgentCount.textContent=urgent;els.reviewCount.textContent=review;
}
function renderPriority(){
  const items=state.items.filter((entry)=>entry.quantity>0&&entry.expiry).sort((a,b)=>parseDate(a.expiry)-parseDate(b.expiry)).slice(0,4);
  if(!items.length){els.priorityList.innerHTML='<div class="priority-empty">유통기한이 등록된 과자가 없습니다.</div>';return;}
  els.priorityList.innerHTML=items.map((entry)=>{
    const days=daysUntil(entry.expiry);return `<button class="priority-item ${days<0?'expired':''}" type="button" data-action="edit" data-id="${entry.id}"><b>${escapeHtml(entry.name)}</b><span>${shelfLabel(entry.shelf)} · ${displayQuantity(entry)}</span><strong>${expiryPhrase(days)}</strong></button>`;
  }).join('');
  els.priorityList.querySelectorAll('[data-action="edit"]').forEach((button)=>button.addEventListener('click',()=>openForm(button.dataset.id)));
}

async function renderCabinet(){
  const filtered=getFilteredItems().filter((entry)=>entry.shelf&&entry.quantity>0);
  els.cabinet.innerHTML=[5,4,3,2,1].map((floor)=>{
    const items=sortItems(filtered.filter((entry)=>Number(entry.shelf)===floor));
    const position=floor===5?'맨 위':floor===1?'맨 아래':'';
    return `<section class="shelf-row" data-floor="${floor}"><div class="shelf-heading"><span class="floor-badge">${floor}층</span><small>${position}</small><span class="shelf-count">${items.length}종</span></div><div class="shelf-items">${items.length?items.map(cardTemplate).join(''):'<div class="shelf-empty">이 층에는 표시할 과자가 없습니다.</div>'}</div></section>`;
  }).join('');
  await hydrateImages(filtered);
}
async function renderUnassigned(){
  const items=sortItems(getFilteredItems().filter((entry)=>(!entry.shelf||entry.needsReview)&&entry.quantity>0));
  els.unassignedCount.textContent=`${items.length}종`;
  els.unassignedGrid.innerHTML=items.length?items.map(cardTemplate).join(''):'<div class="unassigned-empty">확인할 항목이 없습니다.</div>';
  els.unassignedPanel.classList.toggle('hidden',items.length===0&&state.view!=='review');
  await hydrateImages(items);
}
function getFilteredItems(){
  return state.items.filter((entry)=>{
    const queryOk=!state.query||`${entry.name} ${entry.note}`.toLowerCase().includes(state.query);
    const categoryOk=state.category==='all'||entry.category===state.category;
    const viewOk=state.view==='all'||(state.view==='urgent'&&isUrgent(entry))||(state.view==='review'&&(entry.needsReview||!entry.expiry||!entry.shelf));
    return queryOk&&categoryOk&&viewOk;
  });
}
function sortItems(items){
  return [...items].sort((a,b)=>{
    if(state.sort==='expiry')return dateValue(a.expiry)-dateValue(b.expiry)||a.name.localeCompare(b.name,'ko');
    if(state.sort==='name')return a.name.localeCompare(b.name,'ko');
    if(state.sort==='recent')return new Date(b.updatedAt)-new Date(a.updatedAt);
    return Number(b.shelf||0)-Number(a.shelf||0)||a.name.localeCompare(b.name,'ko');
  });
}
function cardTemplate(entry){
  const days=entry.expiry?daysUntil(entry.expiry):null;
  const expiryChip=days!==null&&days<=90?`<span class="expiry-chip ${days<0?'expired':''}">${expiryPhrase(days)}</span>`:'';
  const reviewChip=(entry.needsReview||!entry.expiry||!entry.shelf)?'<span class="review-chip">확인</span>':'';
  return `<article class="snack-card" data-id="${entry.id}"><div class="snack-visual"><img class="hidden" data-image-id="${entry.id}" alt="${escapeHtml(entry.name)} 사진"><span class="snack-emoji">${categoryEmoji(entry.category)}</span>${expiryChip}${reviewChip}</div><div class="snack-info"><h3 title="${escapeHtml(entry.name)}">${escapeHtml(entry.name)}</h3><div class="snack-meta"><span>${escapeHtml(entry.category)}</span><span class="quantity-text">${displayQuantity(entry)}</span></div><p class="expiry-text">${entry.expiry?`유통기한 ${formatDate(entry.expiry)}`:'유통기한 확인 필요'}</p><div class="remaining-bar" title="남은 양 ${remainingLabel(entry.remaining)}"><span style="width:${Math.max(5,Math.min(100,entry.remaining*100))}%"></span></div></div><div class="quick-actions"><button type="button" data-action="eat" data-id="${entry.id}">1${escapeHtml(entry.unit)} 먹음</button><button class="edit" type="button" data-action="edit" data-id="${entry.id}">수정</button></div></article>`;
}
async function hydrateImages(items){
  await Promise.all(items.map(async(entry)=>{
    const nodes=document.querySelectorAll(`[data-image-id="${entry.id}"]`);if(!nodes.length)return;
    const data=await getImage(`front-${entry.id}`);if(!data)return;
    nodes.forEach((img)=>{img.src=data;img.classList.remove('hidden');img.nextElementSibling?.classList.add('hidden');});
  }));
}

async function handleCardAction(event){
  const button=event.target.closest('[data-action]');if(!button)return;
  const entry=state.items.find((item)=>item.id===button.dataset.id);if(!entry)return;
  if(button.dataset.action==='edit'){openForm(entry.id);return;}
  if(button.dataset.action==='eat'){
    entry.quantity=Math.max(0,Number(entry.quantity)-1);entry.updatedAt=new Date().toISOString();persistItems();await render();showToast(entry.quantity===0?'다 먹은 것으로 기록했습니다.':'1개 먹은 것으로 기록했습니다.');
  }
}

async function openForm(id=null){
  resetForm();state.editingId=id;
  if(id){
    const entry=state.items.find((item)=>item.id===id);if(!entry)return;
    els.dialogTitle.textContent='과자 정보 수정';els.snackId.value=entry.id;els.nameInput.value=entry.name;els.categoryInput.value=entry.category;
    els.shelfInput.value=entry.shelf??'';els.expiryInput.value=entry.expiry||'';els.quantityInput.value=entry.quantity;els.unitInput.value=entry.unit||'개';
    els.remainingInput.value=String(closestRemaining(entry.remaining));els.openedInput.checked=entry.opened;els.reviewInput.checked=entry.needsReview;els.noteInput.value=entry.note||'';
    els.deleteBtn.classList.remove('hidden');await showStoredPreview(`front-${id}`,els.frontPreview,els.frontPlaceholder);await showStoredPreview(`expiry-${id}`,els.expiryPreview,els.expiryPlaceholder);
  }
  els.snackDialog.showModal();
}
function closeForm(){els.snackDialog.close();resetForm()}
function resetForm(){
  state.pendingFront=null;state.pendingExpiry=null;state.editingId=null;els.snackForm.reset();els.quantityInput.value=1;els.unitInput.value='개';els.remainingInput.value='1';els.snackId.value='';
  els.dialogTitle.textContent='과자 등록';els.deleteBtn.classList.add('hidden');els.recognitionStatus.classList.add('hidden');els.dateCandidates.classList.add('hidden');
  [els.frontPreview,els.expiryPreview].forEach((img)=>{img.removeAttribute('src');img.classList.remove('ready')});els.frontPlaceholder.classList.remove('hidden');els.expiryPlaceholder.classList.remove('hidden');
}
async function saveSnack(event){
  event.preventDefault();const existing=state.items.find((item)=>item.id===state.editingId);const id=state.editingId||crypto.randomUUID();
  const entry=normalizeItem({id,name:els.nameInput.value.trim(),category:els.categoryInput.value,shelf:els.shelfInput.value||null,expiry:els.expiryInput.value,
    quantity:Number(els.quantityInput.value||0),unit:els.unitInput.value.trim()||'개',remaining:Number(els.remainingInput.value),opened:els.openedInput.checked,
    needsReview:els.reviewInput.checked,note:els.noteInput.value.trim(),createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()});
  if(existing)state.items=state.items.map((item)=>item.id===id?entry:item);else state.items.push(entry);
  if(state.pendingFront)await putImage(`front-${id}`,state.pendingFront);if(state.pendingExpiry)await putImage(`expiry-${id}`,state.pendingExpiry);
  persistItems();closeForm();await render();showToast(existing?'수정했습니다.':'과자를 등록했습니다.');
}
async function deleteCurrentSnack(){
  const id=state.editingId;if(!id||!confirm('이 과자를 재고에서 삭제할까요?'))return;
  state.items=state.items.filter((item)=>item.id!==id);persistItems();await Promise.all([deleteImage(`front-${id}`),deleteImage(`expiry-${id}`)]);closeForm();await render();showToast('삭제했습니다.');
}

async function handlePhoto(event,kind){
  const file=event.target.files?.[0];if(!file)return;const data=await compressImage(file,1100,.78);const isFront=kind==='front';
  if(isFront)state.pendingFront=data;else state.pendingExpiry=data;const img=isFront?els.frontPreview:els.expiryPreview;const placeholder=isFront?els.frontPlaceholder:els.expiryPlaceholder;
  img.src=data;img.classList.add('ready');placeholder.classList.add('hidden');await recognizeImage(data,kind);
}
async function recognizeImage(data,kind){
  if(!window.Tesseract){showRecognition('사진은 저장되지만 자동 인식 도구를 불러오지 못했습니다. 직접 입력해 주세요.');return;}
  showRecognition(kind==='expiry'?'유통기한을 읽는 중이에요…':'과자 이름과 종류를 읽는 중이에요…');
  try{
    const result=await Tesseract.recognize(data,'kor+eng',{logger:(m)=>{if(m.status==='recognizing text')showRecognition(`사진 인식 중… ${Math.round((m.progress||0)*100)}%`);}});const text=result.data.text||'';
    if(kind==='expiry'){
      const dates=extractDateCandidates(text);if(dates.length){els.expiryInput.value=dates[0];showDateCandidates(dates);showRecognition(`날짜 ${dates.length}개를 찾았습니다. 맞는지 확인해 주세요.`);}else showRecognition('날짜를 찾지 못했습니다. 날짜 부분을 더 가까이 찍거나 직접 입력해 주세요.');
    }else{
      const guessedName=guessProductName(text);if(guessedName&&!els.nameInput.value)els.nameInput.value=guessedName;els.categoryInput.value=guessCategory(text);showRecognition(guessedName?`“${guessedName}”로 인식했습니다. 확인해 주세요.`:'글자를 일부 읽었습니다. 이름을 확인해 주세요.');
    }
  }catch(error){console.error(error);showRecognition('자동 인식에 실패했습니다. 사진은 저장되므로 내용을 직접 입력해 주세요.');}
}
function showRecognition(message){els.recognitionStatus.textContent=message;els.recognitionStatus.classList.remove('hidden')}
function showDateCandidates(dates){els.dateCandidates.innerHTML=`<b>인식된 날짜</b> ${dates.map((date)=>`<button type="button" data-date="${date}">${formatDate(date)}</button>`).join('')}`;els.dateCandidates.classList.remove('hidden');els.dateCandidates.querySelectorAll('[data-date]').forEach((button)=>button.addEventListener('click',()=>{els.expiryInput.value=button.dataset.date;showToast('유통기한을 선택했습니다.');}));}
function extractDateCandidates(text){
  const normalized=text.replace(/[Oo]/g,'0').replace(/[Il]/g,'1');const matches=[];const regexes=[/\b(20\d{2})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})\s*일?/g,/\b(\d{2})\s*[.\-/]\s*(\d{1,2})\s*[.\-/]\s*(\d{1,2})\b/g,/\b(20\d{2})(\d{2})(\d{2})\b/g];
  regexes.forEach((regex,index)=>{let match;while((match=regex.exec(normalized))){let year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);if(index===1)year+=year<70?2000:1900;if(validDate(year,month,day))matches.push(`${year}-${pad(month)}-${pad(day)}`);}});return[...new Set(matches)].sort((a,b)=>parseDate(a)-parseDate(b));
}
function validDate(year,month,day){const value=new Date(year,month-1,day);return year>=2020&&year<=2100&&value.getFullYear()===year&&value.getMonth()===month-1&&value.getDate()===day}
function guessProductName(text){const blacklist=/유통|소비|기한|까지|원재료|영양|내용량|kcal|제조|보관|주의|barcode|exp|best|before|product|품목|식품유형/i;const lines=text.split(/\n+/).map((line)=>line.replace(/[^0-9A-Za-z가-힣&+\- ]/g,' ').replace(/\s+/g,' ').trim()).filter((line)=>line.length>=2&&!blacklist.test(line)&&!/^\d+[ gkml%]*$/i.test(line));return lines.sort((a,b)=>scoreName(b)-scoreName(a))[0]?.slice(0,70)||''}
function scoreName(value){return Math.min(value.length,22)+(value.match(/[가-힣A-Za-z]/g)||[]).length-(value.match(/\d/g)||[]).length*2}
function guessCategory(text){const value=text.toLowerCase();const groups=[['초콜릿',/초콜릿|chocolate|choco|카카오|cacao/],['쿠키',/쿠키|cookie|비스킷|biscuit|크래커|cracker|파이|wafer|웨하스|건빵/],['사탕',/사탕|캔디|candy|mint|민트|카라멜|caramel/],['젤리',/젤리|gummy|gummi|jelly/],['육포',/육포|jerky/],['음료',/우유|분말|drink|milk/],['스낵',/스낵|snack|칩|chips|chip|감자|콘|팝콘|pretzel|강냉이/]];return groups.find(([,regex])=>regex.test(value))?.[0]||'기타'}

function restoreSeedItems(){
  const before=state.items.length;state.items=mergeItems(state.items,SEED_ITEMS);persistItems();render();const added=state.items.length-before;showToast(added?`정리본에서 ${added}종을 복구했습니다.`:'정리본이 이미 모두 들어 있습니다.');
}
async function exportBackup(){
  const images={};for(const entry of state.items){for(const prefix of['front','expiry']){const key=`${prefix}-${entry.id}`;const data=await getImage(key);if(data)images[key]=data;}}
  const payload={version:2,exportedAt:new Date().toISOString(),floorRule:'맨 아래 1층 / 맨 위 5층',items:state.items,images,deletedItems:['프링글스','리츠']};
  const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const anchor=document.createElement('a');anchor.href=URL.createObjectURL(blob);anchor.download=`유빈유준-편의점-백업-${new Date().toISOString().slice(0,10)}.json`;anchor.click();URL.revokeObjectURL(anchor.href);showToast('백업 파일을 저장했습니다.');
}
async function importBackup(event){
  const file=event.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.items))throw new Error('형식 오류');if(!confirm('현재 재고를 백업 내용으로 바꿀까요?'))return;state.items=data.items.map(normalizeItem);persistItems();for(const[key,value]of Object.entries(data.images||{}))await putImage(key,value);await render();showToast('백업을 불러왔습니다.');}catch{alert('올바른 유빈유준 편의점 백업 파일이 아닙니다.');}finally{event.target.value='';}
}

function openDb(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const request=indexedDB.open(DB_NAME,DB_VERSION);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(IMAGE_STORE))request.result.createObjectStore(IMAGE_STORE)};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});return dbPromise}
async function putImage(key,data){const db=await openDb();return txPromise(db,'readwrite',(store)=>store.put(data,key))}
async function getImage(key){const db=await openDb();return txPromise(db,'readonly',(store)=>store.get(key))}
async function deleteImage(key){const db=await openDb();return txPromise(db,'readwrite',(store)=>store.delete(key))}
function txPromise(db,mode,fn){return new Promise((resolve,reject)=>{const transaction=db.transaction(IMAGE_STORE,mode);const request=fn(transaction.objectStore(IMAGE_STORE));request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function showStoredPreview(key,img,placeholder){const data=await getImage(key);if(data){img.src=data;img.classList.add('ready');placeholder.classList.add('hidden')}}
async function compressImage(file,maxSize=1100,quality=.78){return new Promise((resolve,reject)=>{const img=new Image();const url=URL.createObjectURL(file);img.onload=()=>{let{width,height}=img;const scale=Math.min(1,maxSize/Math.max(width,height));width=Math.round(width*scale);height=Math.round(height*scale);const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;canvas.getContext('2d').drawImage(img,0,0,width,height);URL.revokeObjectURL(url);resolve(canvas.toDataURL('image/jpeg',quality));};img.onerror=reject;img.src=url;});}

function isUrgent(entry){if(!entry.expiry||entry.quantity<=0)return false;return daysUntil(entry.expiry)<=90}
function dateValue(value){return value?parseDate(value).getTime():Number.MAX_SAFE_INTEGER}
function parseDate(value){const[year,month,day]=(value||'9999-12-31').split('-').map(Number);return new Date(year,month-1,day)}
function startOfToday(){const date=new Date();return new Date(date.getFullYear(),date.getMonth(),date.getDate())}
function daysUntil(value){return Math.ceil((parseDate(value)-startOfToday())/86400000)}
function expiryPhrase(days){if(days<0)return`${Math.abs(days)}일 지남`;if(days===0)return'오늘까지';if(days===1)return'내일까지';return`${days}일 남음`}
function formatDate(value){if(!value)return'-';const[year,month,day]=value.split('-');return`${year}.${month}.${day}`}
function shelfLabel(shelf){if(!shelf)return'위치 확인';return`${shelf}층${Number(shelf)===5?'(맨 위)':Number(shelf)===1?'(맨 아래)':''}`}
function displayQuantity(entry){return`${Number(entry.quantity||0)}${entry.unit||'개'}`}
function remainingLabel(value){const options=[[1,'가득'],[.8,'약 4/5'],[.75,'약 3/4'],[.67,'약 2/3'],[.5,'절반'],[.33,'약 1/3'],[.25,'약 1/4'],[.2,'약 1/5'],[.1,'거의 없음']];return options.reduce((best,current)=>Math.abs(current[0]-value)<Math.abs(best[0]-value)?current:best,options[0])[1]}
function closestRemaining(value){return String(remainingLabelValue(value))}
function remainingLabelValue(value){const options=[1,.8,.75,.67,.5,.33,.25,.2,.1];return options.reduce((best,current)=>Math.abs(current-value)<Math.abs(best-value)?current:best,1)}
function categoryEmoji(category){return({쿠키:'🍪',사탕:'🍬',초콜릿:'🍫',스낵:'🥨',젤리:'⭐',육포:'🥩',음료:'🥛',기타:'🛍️'})[category]||'🛍️'}
function pad(number){return String(number).padStart(2,'0')}
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,(char)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[char])}
function scrollToCabinet(){document.querySelector('.cabinet-section')?.scrollIntoView({behavior:'smooth',block:'start'})}
let toastTimer;function showToast(message){els.toast.textContent=message;els.toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>els.toast.classList.remove('show'),2400)}
