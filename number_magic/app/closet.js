/* Numbers of Magic — 캐릭터 꾸미기 화면
   window.screenCloset(container, opts)
   opts = { char, avatarKind, unlocked, coins, lang,
            onSave(newChar, newUnlocked, coinsSpent), onSaveAvatar(kind) }
   'me' 탭(사람 아바타 boy/girl)은 동행 캐릭터(char)와 별개 축 — 항상 무료,
   unlocked/coins를 안 타고 onSaveAvatar로 바로 저장(마을세계관-설계.md §1). */
(function(){
'use strict';

window.screenCloset = function(container, opts){
  opts = opts || {};
  const av  = window.NM_AVATAR  || {};
  const rndr = window.renderNumiChar;
  const lang = opts.lang || 'ko';
  const L = (item) => item[lang] || item.ko || item.en || '';

  let cur = Object.assign({number:3,color:'blue',bg:'plain',cape:'none',hat:'none'}, opts.char || {});
  let unlocked = Object.assign({}, opts.unlocked || {});
  let coins = +(opts.coins || 0);
  let dirty = 0;  // 소비한 코인 누적
  /* 사람 아바타(나) — 동행 캐릭터(cur)와는 별개 축. 무료 2종(boy/girl)뿐이라
     unlocked/coins 흐름을 안 타고 'me' 탭에서 바로 select()로 전환한다(마을세계관-설계.md §1). */
  let avatarKind = opts.avatarKind || 'boy';

  const TABS = [
    {key:'me',    ko:'나',    en:'Me',       zh:'我'},
    {key:'number',ko:'캐릭터',en:'Character',zh:'角色'},
    {key:'symbol',ko:'기호',  en:'Symbols',  zh:'符号'},
    {key:'color', ko:'색',    en:'Color',    zh:'颜色'},
    {key:'cape',  ko:'망토',  en:'Cape',     zh:'斗篷'},
    {key:'hat',   ko:'모자',  en:'Hat',      zh:'帽子'},
    {key:'bg',    ko:'배경',  en:'BG',       zh:'背景'},
  ];
  let activeTab = 'number';

  /* 잠금 안내(코인 가격과 병기) · 과정 보상 배지 — 캐릭터-승급-설계.md §4 */
  function courseNote(n){
    return lang==='en' ? `Course ${n}` : lang==='zh' ? `第${n}阶段解锁` : `과정 ${n} 도달 시`;
  }
  const rewardBadgeTxt = lang==='en' ? '✨ Course Reward' : lang==='zh' ? '✨ 进度奖励' : '✨ 과정 보상';

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
    if(type==='avatar'){                       // 사람 아바타 — 동행(cur)과 별개 축, 항상 무료
      avatarKind = val;
      if(opts.onSaveAvatar) opts.onSaveAvatar(avatarKind);
      redraw();
      return;
    }
    if(!isUnlocked(type, val)){
      if(!buy(type, val)) return;
    }
    if(type==='number'){ cur.number = +val; delete cur.symbol; }      // 숫자를 고르면 기호 해제(둘 중 하나만)
    else if(type==='symbol') cur.symbol = val;
    else cur[type] = val;
    save();
    redraw();
  }

  /* ── 미니 프리뷰 (항목용) ── */
  function miniPreview(overrides, sz){
    if(!rndr) return '';
    return rndr(Object.assign({}, cur, overrides), sz||52);
  }

  /* 잠금/보상 안내 한 줄(가격 칩 + 도달 안내 칩, 잠긴 특별 항목 공용) */
  function lockInfoHTML(item, unl){
    if(unl) return item.course!=null ? `<div class="nmc-ibadge">${rewardBadgeTxt}</div>` : '';
    let h = '';
    if(item.price) h += `<div class="nmc-iprice">🪙${item.price}</div>`;
    if(item.course!=null) h += `<div class="nmc-icourse">${courseNote(item.course)}</div>`;
    return h;
  }

  /* ── 탭 항목 HTML ── */
  function tabItemsHTML(){
    if(activeTab==='me'){
      const kinds=[
        {id:'boy', ko:'남자아이',en:'Boy', zh:'男孩'},
        {id:'girl',ko:'여자아이',en:'Girl',zh:'女孩'},
      ];
      return kinds.map(k=>{
        const sel = avatarKind===k.id ? 'sel' : '';
        return `<button class="nmc-item ${sel}" data-type="avatar" data-id="${k.id}">
          <div class="nmc-thumb">${window.renderHumanChar?window.renderHumanChar(k.id,64):''}</div>
          <div class="nmc-iname">${L(k)}</div>
        </button>`;
      }).join('');
    }
    if(activeTab==='number'){
      const items = av.numbers || [];
      const singles = items.filter(it=>+it.id < 10);
      const specials = items.filter(it=>+it.id >= 10);
      let html = singles.map(item=>{
        const n = +item.id;
        const sel = (cur.number===n && !cur.symbol) ? 'sel' : '';
        return `<button class="nmc-num-btn ${sel}" data-type="number" data-id="${item.id}">
          ${rndr ? rndr({...cur,number:n,symbol:undefined},54) : n}
        </button>`;
      }).join('');
      if(specials.length){
        const hdr = lang==='en'?'✨ Special Rewards · Two-Digit':lang==='zh'?'✨ 特别奖励 · 两位数':'✨ 특별 보상 · 두 자리 수';
        html += `<div class="nmc-section-title">${hdr}</div>`;
        html += specials.map(item=>{
          const n = +item.id;
          const unl = isUnlocked('number', item.id);
          const sel = (cur.number===n && !cur.symbol) ? 'sel' : '';
          return `<button class="nmc-item ${sel}${unl?'':' locked'}" data-type="number" data-id="${item.id}">
            <div class="nmc-thumb">${miniPreview({number:n,symbol:undefined},52)}</div>
            <div class="nmc-iname">${n}</div>
            ${lockInfoHTML(item, unl)}
          </button>`;
        }).join('');
      }
      return html;
    }
    if(activeTab==='symbol'){
      const items = av.symbols || [];
      return items.map(item=>{
        const unl = isUnlocked('symbol', item.id);
        const sel = cur.symbol===item.id ? 'sel' : '';
        return `<button class="nmc-item ${sel}${unl?'':' locked'}" data-type="symbol" data-id="${item.id}">
          <div class="nmc-thumb">${miniPreview({symbol:item.id},52)}</div>
          <div class="nmc-iname">${item.glyph} ${L(item)}</div>
          ${lockInfoHTML(item, unl)}
        </button>`;
      }).join('');
    }
    const typeItems = {color:'colors',bg:'bgs',cape:'capes',hat:'hats'};
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

  /* 큰 미리보기(사람 아바타 + 동행 합성) — renderPartyHtml 없으면 동행만이라도 보여준다.
     디자인 패스 1(§1): 140px로 키우고 하늘 그라데이션 무대 위에 세운다(세계관을
     여기까지 끌고 오기 — 위쪽 sidebar가 아니라 화면 맨 위 정면 프리뷰). */
  function bigPreview(){
    if(window.renderPartyHtml) return window.renderPartyHtml(avatarKind, cur, 140);
    return rndr ? rndr(cur, 140) : '';
  }

  /* ── 전체 재렌더 ── */
  function redraw(){
    // 미리보기
    const pv = container.querySelector('#nmc-preview');
    if(pv) pv.innerHTML = bigPreview();
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
    container.querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>select(b.dataset.type, b.dataset.id));
  }

  /* ── 초기 HTML ── */
  const tabsHTML = TABS.map(t=>`<button class="nmc-tab${t.key===activeTab?' active':''}" data-tab="${t.key}">${L(t)}</button>`).join('');
  const titleTxt = lang==='en'?'My Character':lang==='zh'?'我的角色':'내 캐릭터';

  /* 디자인 패스 1(§4) — 순서를 "큰 프리뷰 먼저, 그 다음 탭+목록"으로 재배치.
     기존엔 미리보기가 오른쪽 사이드에 고정된 2단 레이아웃이라 목록이 화면 밖으로
     밀리는 문제가 있었는데(주석 참고), 세로 1단으로 바꾸고 프리뷰를 무대 위 정면에
     세워 세계관을 옷장까지 끌고 온다. 요소 id/class는 그대로 — main.js·redraw()가
     그대로 찾아 갱신한다. */
  const hintTxt = lang==='en'?'Decorate your friend with 🪙 from attendance & learning'
    :lang==='zh'?'用出勤和学习得到的🪙装饰朋友'
    :'출석·학습으로 모은 🪙로 내 친구를 꾸며요';
  container.innerHTML = `
<div class="nmc-wrap">
  <div class="nmc-head">
    <div class="nmc-title">✨ ${titleTxt}</div>
    <div id="nmc-coins" class="nmc-coins">🪙 ${coins}</div>
  </div>
  <div class="nmc-hint">${hintTxt}</div>
  <div class="nmc-preview-area">
    <div class="nmc-stage"><div id="nmc-preview">${bigPreview()}</div></div>
    <div class="nmc-preview-label">${lang==='en'?'Tap items to customize!':lang==='zh'?'点击项目来定制！':'골라서 꾸며보세요!'}</div>
  </div>
  <div class="nmc-main">
    <div class="nmc-left">
      <div class="nmc-tab-bar">${tabsHTML}</div>
      <div id="nmc-grid" class="nmc-grid">${tabItemsHTML()}</div>
    </div>
  </div>
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
