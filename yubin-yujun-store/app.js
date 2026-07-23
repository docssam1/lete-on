const STORAGE_KEY = 'yubinYujunStore.items.v1';
const DB_NAME = 'yubinYujunStore.images';
const DB_VERSION = 1;
const IMAGE_STORE = 'images';

const state = {
  items: loadItems(),
  shelf: 'all',
  category: 'all',
  query: '',
  sort: 'expiry',
  pendingFront: null,
  pendingExpiry: null,
  editingId: null,
};

const $ = (id) => document.getElementById(id);
const els = {};
let dbPromise;

window.addEventListener('DOMContentLoaded', async () => {
  Object.assign(els, {
    openAddBtn: $('openAddBtn'), emptyAddBtn: $('emptyAddBtn'), snackDialog: $('snackDialog'), snackForm: $('snackForm'),
    closeDialogBtn: $('closeDialogBtn'), cancelBtn: $('cancelBtn'), deleteBtn: $('deleteBtn'), snackId: $('snackId'),
    dialogTitle: $('dialogTitle'), frontPhotoInput: $('frontPhotoInput'), expiryPhotoInput: $('expiryPhotoInput'),
    frontPreview: $('frontPreview'), expiryPreview: $('expiryPreview'), frontPlaceholder: $('frontPlaceholder'),
    expiryPlaceholder: $('expiryPlaceholder'), recognitionStatus: $('recognitionStatus'), nameInput: $('nameInput'),
    categoryInput: $('categoryInput'), shelfInput: $('shelfInput'), expiryInput: $('expiryInput'), quantityInput: $('quantityInput'),
    initialQuantityInput: $('initialQuantityInput'), remainingInput: $('remainingInput'), noteInput: $('noteInput'),
    dateCandidates: $('dateCandidates'), inventoryGrid: $('inventoryGrid'), inventoryEmpty: $('inventoryEmpty'),
    priorityList: $('priorityList'), urgentCount: $('urgentCount'), totalCount: $('totalCount'), unitCount: $('unitCount'),
    halfCount: $('halfCount'), resultCount: $('resultCount'), categorySummary: $('categorySummary'), inventoryTitle: $('inventoryTitle'),
    searchInput: $('searchInput'), categoryFilter: $('categoryFilter'), sortSelect: $('sortSelect'), shelfTabs: $('shelfTabs'),
    shelfOverview: $('shelfOverview'), shelfPhoto: $('shelfPhoto'), shelfPhotoEmpty: $('shelfPhotoEmpty'), shelfPhotoInput: $('shelfPhotoInput'),
    shelfTitle: $('shelfTitle'), shelfStats: $('shelfStats'), exportBtn: $('exportBtn'), importInput: $('importInput'), toast: $('toast'),
    showAllBtn: $('showAllBtn'),
  });

  bindEvents();
  await render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
});

function bindEvents() {
  els.openAddBtn.addEventListener('click', () => openForm());
  els.emptyAddBtn.addEventListener('click', () => openForm());
  els.closeDialogBtn.addEventListener('click', closeForm);
  els.cancelBtn.addEventListener('click', closeForm);
  els.snackForm.addEventListener('submit', saveSnack);
  els.deleteBtn.addEventListener('click', deleteCurrentSnack);
  els.frontPhotoInput.addEventListener('change', (e) => handlePhoto(e, 'front'));
  els.expiryPhotoInput.addEventListener('change', (e) => handlePhoto(e, 'expiry'));
  els.quantityInput.addEventListener('input', keepInitialQuantityValid);
  els.initialQuantityInput.addEventListener('input', keepInitialQuantityValid);
  els.searchInput.addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); renderInventory(); });
  els.categoryFilter.addEventListener('change', (e) => { state.category = e.target.value; renderInventory(); });
  els.sortSelect.addEventListener('change', (e) => { state.sort = e.target.value; renderInventory(); });
  els.shelfTabs.addEventListener('click', async (e) => {
    const button = e.target.closest('button[data-shelf]'); if (!button) return;
    state.shelf = button.dataset.shelf;
    [...els.shelfTabs.querySelectorAll('button')].forEach((b) => b.classList.toggle('active', b === button));
    await renderShelfOverview(); renderInventory();
  });
  els.shelfPhotoInput.addEventListener('change', saveShelfPhoto);
  els.inventoryGrid.addEventListener('click', handleCardAction);
  els.exportBtn.addEventListener('click', exportBackup);
  els.importInput.addEventListener('change', importBackup);
  els.showAllBtn.addEventListener('click', () => {
    state.shelf = 'all'; state.category = 'all'; state.query = ''; state.sort = 'expiry';
    els.searchInput.value = ''; els.categoryFilter.value = 'all'; els.sortSelect.value = 'expiry';
    [...els.shelfTabs.querySelectorAll('button')].forEach((b) => b.classList.toggle('active', b.dataset.shelf === 'all'));
    renderShelfOverview(); renderInventory(); window.scrollTo({top: 450, behavior: 'smooth'});
  });
}

function loadItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function persistItems() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); }

function openDb() {
  if (!dbPromise) dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => request.result.createObjectStore(IMAGE_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return dbPromise;
}
async function putImage(key, data) { const db = await openDb(); return txPromise(db, 'readwrite', (s) => s.put(data, key)); }
async function getImage(key) { const db = await openDb(); return txPromise(db, 'readonly', (s) => s.get(key)); }
async function deleteImage(key) { const db = await openDb(); return txPromise(db, 'readwrite', (s) => s.delete(key)); }
function txPromise(db, mode, fn) { return new Promise((resolve, reject) => { const tx = db.transaction(IMAGE_STORE, mode); const req = fn(tx.objectStore(IMAGE_STORE)); req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); }); }

async function render() {
  renderSummary(); renderPriority(); await renderShelfOverview(); await renderInventory(); renderCategorySummary();
}

function renderSummary() {
  const today = startOfToday();
  const urgent = state.items.filter((i) => daysBetween(today, parseDate(i.expiry)) <= 30).length;
  const units = state.items.reduce((sum, i) => sum + Number(i.quantity || 0), 0);
  const half = state.items.filter((i) => Number(i.remaining) <= .5 || Number(i.quantity) <= Number(i.initialQuantity) / 2).length;
  els.urgentCount.textContent = urgent; els.totalCount.textContent = state.items.length; els.unitCount.textContent = `총 ${units}개`; els.halfCount.textContent = half;
}

function renderPriority() {
  const sorted = [...state.items].sort((a,b) => parseDate(a.expiry)-parseDate(b.expiry)).slice(0,4);
  if (!sorted.length) { els.priorityList.className = 'priority-list empty-box'; els.priorityList.textContent = '등록된 과자가 없습니다.'; return; }
  els.priorityList.className = 'priority-list';
  els.priorityList.innerHTML = sorted.map((item) => {
    const d = daysBetween(startOfToday(), parseDate(item.expiry));
    const expired = d < 0;
    return `<button type="button" class="priority-item ${expired?'expired':''}" data-edit="${item.id}"><b>${escapeHtml(item.name)}</b><span>${item.shelf}층 · ${escapeHtml(item.category)} · ${item.quantity}개</span><strong>${expiryPhrase(d)}</strong></button>`;
  }).join('');
  els.priorityList.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => openForm(b.dataset.edit)));
}

async function renderShelfOverview() {
  if (state.shelf === 'all') { els.shelfOverview.classList.add('hidden'); return; }
  els.shelfOverview.classList.remove('hidden');
  const n = Number(state.shelf); const items = state.items.filter((i) => Number(i.shelf) === n);
  els.shelfTitle.textContent = `${n}층${n===1?' (맨 위)':n===5?' (맨 아래)':''}`;
  els.shelfStats.textContent = `${items.length}종 · ${items.reduce((s,i)=>s+Number(i.quantity||0),0)}개`;
  const data = await getImage(`shelf-${n}`);
  if (data) { els.shelfPhoto.src = data; els.shelfPhoto.classList.add('ready'); els.shelfPhotoEmpty.classList.add('hidden'); }
  else { els.shelfPhoto.removeAttribute('src'); els.shelfPhoto.classList.remove('ready'); els.shelfPhotoEmpty.classList.remove('hidden'); }
}

async function renderInventory() {
  const filtered = getFilteredItems();
  els.resultCount.textContent = `${filtered.length}종`;
  els.inventoryTitle.textContent = state.shelf === 'all' ? '전체 과자' : `${state.shelf}층 과자`;
  els.inventoryGrid.innerHTML = filtered.map(cardTemplate).join('');
  els.inventoryEmpty.classList.toggle('hidden', filtered.length > 0);
  els.inventoryGrid.classList.toggle('hidden', filtered.length === 0);
  await Promise.all(filtered.map(async (item) => {
    const img = document.querySelector(`[data-image-id="${item.id}"]`);
    if (!img) return; const data = await getImage(`front-${item.id}`);
    if (data) { img.src = data; img.classList.remove('hidden'); img.nextElementSibling?.classList.add('hidden'); }
  }));
}

function getFilteredItems() {
  const list = state.items.filter((i) => {
    const shelfOk = state.shelf === 'all' || String(i.shelf) === state.shelf;
    const catOk = state.category === 'all' || i.category === state.category;
    const qOk = !state.query || `${i.name} ${i.note||''}`.toLowerCase().includes(state.query);
    return shelfOk && catOk && qOk;
  });
  return list.sort((a,b) => {
    if (state.sort === 'shelf') return Number(a.shelf)-Number(b.shelf) || parseDate(a.expiry)-parseDate(b.expiry);
    if (state.sort === 'name') return a.name.localeCompare(b.name, 'ko');
    if (state.sort === 'recent') return new Date(b.createdAt)-new Date(a.createdAt);
    return parseDate(a.expiry)-parseDate(b.expiry);
  });
}

function cardTemplate(item) {
  const d = daysBetween(startOfToday(), parseDate(item.expiry));
  const half = Number(item.remaining) <= .5 || Number(item.quantity) <= Number(item.initialQuantity)/2;
  return `<article class="snack-card">
    <div class="snack-photo"><img class="hidden" data-image-id="${item.id}" alt="${escapeHtml(item.name)} 사진"><span class="no-photo">${categoryEmoji(item.category)}</span>${d<=30?`<span class="status-chip ${d<0?'expired':'soon'}">${expiryPhrase(d)}</span>`:''}</div>
    <div class="snack-body"><div class="snack-top"><h3 title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h3><button class="edit-btn" data-action="edit" data-id="${item.id}" aria-label="수정">✎</button></div>
    <div class="meta"><span class="pill">${item.shelf}층</span><span class="pill">${escapeHtml(item.category)}</span>${half?'<span class="pill half">절반 이하</span>':''}</div>
    <p class="expiry-text">유통기한 <strong>${formatDate(item.expiry)}</strong> · ${expiryPhrase(d)}</p>
    <div class="card-actions"><span class="qty">${item.quantity}개</span><button class="mini-btn" data-action="eat" data-id="${item.id}">1개 먹음</button><button class="mini-btn" data-action="half" data-id="${item.id}">절반 표시</button></div></div>
  </article>`;
}

function renderCategorySummary() {
  const cats = ['쿠키','사탕','초콜릿','스낵','젤리','기타'];
  els.categorySummary.innerHTML = cats.map((cat) => {
    const items = state.items.filter((i) => i.category === cat); const qty = items.reduce((s,i)=>s+Number(i.quantity||0),0);
    return `<button class="category-item" data-category="${cat}" type="button"><span>${categoryEmoji(cat)}</span><b>${cat}</b><small>${items.length}종 · ${qty}개</small></button>`;
  }).join('');
  els.categorySummary.querySelectorAll('[data-category]').forEach((b)=>b.addEventListener('click',()=>{state.category=b.dataset.category;els.categoryFilter.value=state.category;renderInventory();}));
}

async function openForm(id = null) {
  resetForm(); state.editingId = id;
  if (id) {
    const item = state.items.find((i) => i.id === id); if (!item) return;
    els.dialogTitle.textContent = '과자 정보 수정'; els.snackId.value = item.id; els.nameInput.value = item.name;
    els.categoryInput.value = item.category; els.shelfInput.value = item.shelf; els.expiryInput.value = item.expiry;
    els.quantityInput.value = item.quantity; els.initialQuantityInput.value = item.initialQuantity; els.remainingInput.value = String(item.remaining);
    els.noteInput.value = item.note || ''; els.deleteBtn.classList.remove('hidden');
    await showStoredPreview(`front-${id}`, els.frontPreview, els.frontPlaceholder);
    await showStoredPreview(`expiry-${id}`, els.expiryPreview, els.expiryPlaceholder);
  }
  els.snackDialog.showModal();
}
function closeForm() { els.snackDialog.close(); resetForm(); }
function resetForm() {
  state.pendingFront = null; state.pendingExpiry = null; state.editingId = null; els.snackForm.reset();
  els.quantityInput.value = 1; els.initialQuantityInput.value = 1; els.remainingInput.value = '1'; els.snackId.value = '';
  els.dialogTitle.textContent = '과자 등록'; els.deleteBtn.classList.add('hidden'); els.recognitionStatus.classList.add('hidden'); els.dateCandidates.classList.add('hidden');
  [els.frontPreview,els.expiryPreview].forEach((img)=>{img.removeAttribute('src');img.classList.remove('ready')});
  els.frontPlaceholder.classList.remove('hidden'); els.expiryPlaceholder.classList.remove('hidden');
}
async function showStoredPreview(key, img, placeholder) { const data=await getImage(key); if(data){img.src=data;img.classList.add('ready');placeholder.classList.add('hidden');} }

async function handlePhoto(event, kind) {
  const file = event.target.files?.[0]; if (!file) return;
  const data = await compressImage(file, 1100, .78);
  const isFront = kind === 'front';
  if (isFront) state.pendingFront = data; else state.pendingExpiry = data;
  const img = isFront ? els.frontPreview : els.expiryPreview; const placeholder = isFront ? els.frontPlaceholder : els.expiryPlaceholder;
  img.src = data; img.classList.add('ready'); placeholder.classList.add('hidden');
  await recognizeImage(data, kind);
}

async function recognizeImage(data, kind) {
  if (!window.Tesseract) { showRecognition('사진은 저장되지만 자동 인식 도구를 불러오지 못했습니다. 직접 입력해 주세요.'); return; }
  showRecognition(kind === 'expiry' ? '유통기한을 읽는 중이에요…' : '과자 이름과 종류를 읽는 중이에요…');
  try {
    const result = await Tesseract.recognize(data, 'kor+eng', { logger: (m) => { if (m.status === 'recognizing text') showRecognition(`사진 인식 중… ${Math.round((m.progress||0)*100)}%`); } });
    const text = result.data.text || '';
    if (kind === 'expiry') {
      const dates = extractDateCandidates(text);
      if (dates.length) { els.expiryInput.value = dates[0]; showDateCandidates(dates); showRecognition(`날짜 ${dates.length}개를 찾았습니다. 맞는지 확인해 주세요.`); }
      else showRecognition('날짜를 찾지 못했습니다. 날짜 부분을 더 가까이 찍거나 직접 입력해 주세요.');
    } else {
      const guessedName = guessProductName(text); if (guessedName && !els.nameInput.value) els.nameInput.value = guessedName;
      const category = guessCategory(text); if (category) els.categoryInput.value = category;
      showRecognition(guessedName ? `“${guessedName}”로 인식했습니다. 이름과 종류를 확인해 주세요.` : '글자를 일부 읽었습니다. 이름과 종류를 확인해 주세요.');
    }
  } catch (error) { console.error(error); showRecognition('자동 인식에 실패했습니다. 사진은 저장되므로 내용을 직접 입력해 주세요.'); }
}
function showRecognition(message) { els.recognitionStatus.textContent = message; els.recognitionStatus.classList.remove('hidden'); }
function showDateCandidates(dates) {
  els.dateCandidates.innerHTML = `<b>인식된 날짜</b> ${dates.map((d)=>`<button type="button" data-date="${d}">${formatDate(d)}</button>`).join('')}`;
  els.dateCandidates.classList.remove('hidden');
  els.dateCandidates.querySelectorAll('[data-date]').forEach((b)=>b.addEventListener('click',()=>{els.expiryInput.value=b.dataset.date;showToast('유통기한을 선택했습니다.')}));
}

function extractDateCandidates(text) {
  const normalized = text.replace(/[Oo]/g,'0').replace(/[Il]/g,'1');
  const matches = [];
  const regexes = [
    /\b(20\d{2})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})\s*일?/g,
    /\b(\d{2})\s*[.\-/]\s*(\d{1,2})\s*[.\-/]\s*(\d{1,2})\b/g,
    /\b(20\d{2})(\d{2})(\d{2})\b/g,
  ];
  regexes.forEach((re, index) => { let m; while ((m = re.exec(normalized))) { let y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]); if(index===1)y+=y<70?2000:1900; if(validDate(y,mo,d))matches.push(`${y}-${pad(mo)}-${pad(d)}`); } });
  return [...new Set(matches)].sort((a,b)=>parseDate(a)-parseDate(b));
}
function validDate(y,m,d){const x=new Date(y,m-1,d);return y>=2020&&y<=2100&&x.getFullYear()===y&&x.getMonth()===m-1&&x.getDate()===d}
function guessProductName(text) {
  const blacklist = /유통|소비|기한|까지|원재료|영양|내용량|kcal|제조|보관|주의|barcode|exp|best|before|product|품목|식품유형/i;
  const lines = text.split(/\n+/).map((s)=>s.replace(/[^0-9A-Za-z가-힣&+\- ]/g,' ').replace(/\s+/g,' ').trim()).filter((s)=>s.length>=2&&!blacklist.test(s)&&!/^\d+[ gkml%]*$/i.test(s));
  return lines.sort((a,b)=>scoreName(b)-scoreName(a))[0]?.slice(0,60) || '';
}
function scoreName(s){return Math.min(s.length,22)+(s.match(/[가-힣A-Za-z]/g)||[]).length-(s.match(/\d/g)||[]).length*2}
function guessCategory(text) {
  const t=text.toLowerCase(); const groups=[['초콜릿',/초콜릿|chocolate|choco|카카오|cacao/],['쿠키',/쿠키|cookie|비스킷|biscuit|크래커|cracker|파이|wafer|웨하스/],['사탕',/사탕|캔디|candy|mint|민트|카라멜|caramel/],['젤리',/젤리|gummy|gummi|jelly/],['스낵',/스낵|snack|칩|chips|chip|감자|콘|꼬깔|팝콘|pretzel/]];
  return groups.find(([,re])=>re.test(t))?.[0] || '기타';
}

async function saveSnack(event) {
  event.preventDefault();
  const existing = state.items.find((i)=>i.id===state.editingId);
  const id = state.editingId || crypto.randomUUID();
  const item = { id, name:els.nameInput.value.trim(), category:els.categoryInput.value, shelf:Number(els.shelfInput.value), expiry:els.expiryInput.value,
    quantity:Number(els.quantityInput.value), initialQuantity:Math.max(Number(els.initialQuantityInput.value),Number(els.quantityInput.value)), remaining:Number(els.remainingInput.value), note:els.noteInput.value.trim(),
    createdAt:existing?.createdAt||new Date().toISOString(), updatedAt:new Date().toISOString() };
  if (existing) state.items = state.items.map((i)=>i.id===id?item:i); else state.items.push(item);
  if (state.pendingFront) await putImage(`front-${id}`,state.pendingFront);
  if (state.pendingExpiry) await putImage(`expiry-${id}`,state.pendingExpiry);
  persistItems(); closeForm(); await render(); showToast(existing?'수정했습니다.':'과자를 등록했습니다.');
}
async function deleteCurrentSnack() {
  const id=state.editingId; if(!id||!confirm('이 과자를 삭제할까요?'))return;
  state.items=state.items.filter((i)=>i.id!==id);persistItems();await Promise.all([deleteImage(`front-${id}`),deleteImage(`expiry-${id}`)]);closeForm();await render();showToast('삭제했습니다.');
}
async function handleCardAction(e) {
  const button=e.target.closest('[data-action]');if(!button)return;const item=state.items.find((i)=>i.id===button.dataset.id);if(!item)return;
  if(button.dataset.action==='edit')return openForm(item.id);
  if(button.dataset.action==='eat'){item.quantity=Math.max(0,Number(item.quantity)-1);if(item.quantity===0)item.remaining=.1;}
  if(button.dataset.action==='half')item.remaining=.5;
  item.updatedAt=new Date().toISOString();persistItems();await render();showToast(button.dataset.action==='eat'?'1개 먹은 것으로 기록했습니다.':'절반 남음으로 표시했습니다.');
}
function keepInitialQuantityValid(){if(Number(els.initialQuantityInput.value)<Number(els.quantityInput.value))els.initialQuantityInput.value=els.quantityInput.value}

async function saveShelfPhoto(e) { const file=e.target.files?.[0];if(!file||state.shelf==='all')return;const data=await compressImage(file,1300,.78);await putImage(`shelf-${state.shelf}`,data);await renderShelfOverview();showToast(`${state.shelf}층 사진을 저장했습니다.`);e.target.value=''; }
async function compressImage(file,maxSize=1100,quality=.78){return new Promise((resolve,reject)=>{const img=new Image();const url=URL.createObjectURL(file);img.onload=()=>{let{width,height}=img;const scale=Math.min(1,maxSize/Math.max(width,height));width=Math.round(width*scale);height=Math.round(height*scale);const c=document.createElement('canvas');c.width=width;c.height=height;c.getContext('2d').drawImage(img,0,0,width,height);URL.revokeObjectURL(url);resolve(c.toDataURL('image/jpeg',quality));};img.onerror=reject;img.src=url;});}

async function exportBackup() {
  const images={}; for(const item of state.items){for(const prefix of ['front','expiry']){const key=`${prefix}-${item.id}`;const data=await getImage(key);if(data)images[key]=data;}}
  for(let i=1;i<=5;i++){const key=`shelf-${i}`;const data=await getImage(key);if(data)images[key]=data;}
  const blob=new Blob([JSON.stringify({version:1,exportedAt:new Date().toISOString(),items:state.items,images},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`유빈유준-편의점-백업-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);showToast('백업 파일을 저장했습니다.');
}
async function importBackup(e) { const file=e.target.files?.[0];if(!file)return;try{const data=JSON.parse(await file.text());if(!Array.isArray(data.items))throw new Error('형식 오류');if(!confirm('현재 재고를 백업 내용으로 바꿀까요?'))return;state.items=data.items;persistItems();for(const[key,value]of Object.entries(data.images||{}))await putImage(key,value);await render();showToast('백업을 불러왔습니다.');}catch{alert('올바른 유빈유준 편의점 백업 파일이 아닙니다.');}finally{e.target.value='';} }

function categoryEmoji(cat){return({쿠키:'🍪',사탕:'🍬',초콜릿:'🍫',스낵:'🥨',젤리:'🧸',기타:'🛍️'})[cat]||'🛍️'}
function parseDate(s){const [y,m,d]=(s||'9999-12-31').split('-').map(Number);return new Date(y,m-1,d)}
function startOfToday(){const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function daysBetween(a,b){return Math.ceil((b-a)/86400000)}
function expiryPhrase(d){if(d<0)return `${Math.abs(d)}일 지남`;if(d===0)return '오늘까지';if(d===1)return '내일까지';return `${d}일 남음`}
function formatDate(s){if(!s)return'-';const[y,m,d]=s.split('-');return `${y}.${m}.${d}`}
function pad(n){return String(n).padStart(2,'0')}
function escapeHtml(s=''){return s.replace(/[&<>'"]/g,(c)=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'})[c])}
let toastTimer;function showToast(message){els.toast.textContent=message;els.toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>els.toast.classList.remove('show'),2200)}
