/* Numbers of Magic — 캐릭터 꾸미기 화면
   window.screenCloset(container, opts)
   opts = { char, unlocked, coins, lang, onSave(newChar, newUnlocked, coinsSpent) } */
(function(){
'use strict';

window.screenCloset = function(container, opts){
  opts = opts || {};
  const av  = window.NM_AVATAR  || {};
  const rndr = window.renderNumiChar;
  const lang = opts.lang || 'ko';
  const L = (item) => item[lang] || item.ko || item.en || '';

  let cur = Object.assign({number:3,color:'blue',bg:'plain'}, opts.char || {});
  let unlocked = Object.assign({}, opts.unlocked || {});
  let coins = +(opts.coins || 0);
  let dirty = 0;  // 소비한 코인 누적

  const TABS = [
    {key:'number',ko:'캐릭터',en:'Character',zh:'角色'},
    {key:'color', ko:'오라',  en:'Aura',     zh:'光环'},
    {key:'bg',    ko:'배경',  en:'BG',       zh:'背景'},
  ];
  let activeTab = 'number';

  /* ── 잠금 해제 확인 ── */
  function ulKey(type, id){ return type+'_'+id; }
  function isUnlocked(type, id){
    const items = av[type+'s'] || av[type] || [];
    const item = items.find(x=>x.id===id);
    return !item || item.free || !!unlocked[ulKey(type,id)];
  }

  /* ── 저장 ── */
  function save(){
    if(opts.onSave) opts.onSave(Object.assign({},cur), Object.assign({},unlocked), dirty);
  }

  /* ── 토스트 ── */
  function toast(msg){
    let t = container.querySelector('.nmc-toast');
    if(t) t.remove();
    t = document.createElement('div');
    t.className='nmc-toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(()=>{ if(t.parentNode) t.remove(); }, 2000);
  }

  /* ── 구매 ── */
  function buy(type, id){
    const items = av[type+'s'] || av[type] || [];
    const item = items.find(x=>x.id===id);
    if(!item || item.free) return true;
    if(coins < item.price){
      toast(lang==='en'?`Need 🪙${item.price} coins!`:lang==='zh'?`需要🪙${item.price}金币！`:`🪙${item.price} 코인이 필요해요!`);
      return false;
    }
    coins -= item.price;
    dirty += item.price;
    unlocked[ulKey(type,id)] = true;
    save();
    return true;
  }

  /* ── 선택 ── */
  function select(type, val){
    if(type==='number'){
      cur.number = +val;
    } else {
      if(!isUnlocked(type, val)){
        if(!buy(type, val)) return;
      }
      cur[type] = val;
    }
    save();
    redraw();
  }

  /* ── 미니 프리뷰 (항목용) ── */
  function miniPreview(overrides, sz){
    if(!rndr) return '';
    return rndr(Object.assign({}, cur, overrides), sz||52);
  }

  /* ── 탭 항목 HTML ── */
  function tabItemsHTML(){
    if(activeTab==='number'){
      return [0,1,2,3,4,5,6,7,8,9].map(n=>{
        const sel = cur.number===n ? 'sel' : '';
        return `<button class="nmc-num-btn ${sel}" data-n="${n}">
          ${rndr ? rndr({...cur,number:n},54) : n}
        </button>`;
      }).join('');
    }
    const typeItems = {color:'colors',bg:'bgs'};
    const items = av[typeItems[activeTab]] || [];
    return items.map(item=>{
      const unl = isUnlocked(activeTab, item.id);
      const sel = cur[activeTab]===item.id ? 'sel' : '';
      const overrides = {[activeTab]: item.id};
      return `<button class="nmc-item ${sel}${unl?'':' locked'}" data-type="${activeTab}" data-id="${item.id}">
        <div class="nmc-thumb">${miniPreview(overrides,52)}</div>
        <div class="nmc-iname">${L(item)}</div>
        ${unl?'':item.price?`<div class="nmc-iprice">🪙${item.price}</div>`:''}
      </button>`;
    }).join('');
  }

  /* ── 전체 재렌더 ── */
  function redraw(){
    // 미리보기
    const pv = container.querySelector('#nmc-preview');
    if(pv && rndr) pv.innerHTML = rndr(cur, 110);
    // 코인
    const ci = container.querySelector('#nmc-coins');
    if(ci) ci.textContent = '🪙 '+coins;
    // 탭 active
    container.querySelectorAll('.nmc-tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===activeTab));
    // 항목
    const grid = container.querySelector('#nmc-grid');
    if(grid){ grid.innerHTML = tabItemsHTML(); bindItems(); }
  }

  /* ── 항목 이벤트 바인딩 ── */
  function bindItems(){
    container.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>select('number',b.dataset.n));
    container.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>select(b.dataset.type, b.dataset.id));
  }

  /* ── 초기 HTML ── */
  const tabsHTML = TABS.map(t=>`<button class="nmc-tab${t.key===activeTab?' active':''}" data-tab="${t.key}">${L(t)}</button>`).join('');
  const titleTxt = lang==='en'?'My Character':lang==='zh'?'我的角色':'내 캐릭터';

  container.innerHTML = `
<div class="nmc-wrap">
  <div class="nmc-head">
    <div class="nmc-title">✨ ${titleTxt}</div>
    <div id="nmc-coins" class="nmc-coins">🪙 ${coins}</div>
  </div>
  <div class="nmc-preview-area">
    <div id="nmc-preview">${rndr ? rndr(cur,110) : ''}</div>
    <div class="nmc-preview-label">${lang==='en'?'Tap items below to customize!':lang==='zh'?'点击下方项目来定制！':'아래에서 꾸며보세요!'}</div>
  </div>
  <div class="nmc-tab-bar">${tabsHTML}</div>
  <div id="nmc-grid" class="nmc-grid">${tabItemsHTML()}</div>
</div>`;

  /* ── 탭 바인딩 ── */
  container.querySelectorAll('.nmc-tab').forEach(b=>b.onclick=()=>{
    activeTab = b.dataset.tab;
    redraw();
  });
  bindItems();
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.screenCloset;
})();
