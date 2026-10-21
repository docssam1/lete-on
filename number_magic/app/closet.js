/* Numbers of Magic — 캐릭터 꾸미기 화면
   window.screenCloset(container, opts)
   opts = { char, avatarKind(legacy), human, avatars, unlocked, coins, ledger, lang,
            onSave(newChar, newUnlocked) -> bool        (돈 차감 없음)
            onPurchase(type, id) -> {ok, coins, unlocked, message?}  (루트가 차감·저장)
            onSaveHuman(activeProfile, allProfiles) -> bool }
   - 구매는 항상 [미리보기 → 확인] 2단계. 잔액/보유 목록은 onPurchase 반환값만 신뢰한다.
   - 사람 캐릭터(me 탭)는 학습 계정과 별개: 이름·모습·옷만 저장, 기록/포인트는 그대로. */
(function(){
'use strict';

const MAX_NAME = 16, MAX_CHARS = 24, MAX_LEDGER = 20;

window.screenCloset = function(container, opts){
  opts = opts || {};
  const av  = window.NM_AVATAR || {};
  const H   = window.NM_HUMANS || {};
  const rndr = window.renderNumiChar;
  const lang = (opts.lang==='en' || opts.lang==='zh') ? opts.lang : 'ko';
  const T = (ko,en,zh) => lang==='en' ? en : lang==='zh' ? (zh||en) : ko;
  const L = (item) => (item && (item[lang] || item.ko || item.en)) || '';
  const esc = (s) => String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ── 상태 (구매/저장 성공 전에는 확정 상태를 바꾸지 않는다) ── */
  let cur = Object.assign({number:3,color:'blue',bg:'plain',cape:'none',hat:'none'}, opts.char || {});
  let unlocked = Object.assign({}, opts.unlocked || {});
  let coins = Number.isFinite(+opts.coins) ? +opts.coins : 0;
  const ledger = Array.isArray(opts.ledger) ? opts.ledger.slice() : [];

  /* 사람 캐릭터 모음 */
  const looks   = Array.isArray(H.looks) ? H.looks : [];
  const outfits = Array.isArray(H.outfits) ? H.outfits : [];
  const freeOutfit = (outfits.find(o=>o && o.free) || outfits[0] || {}).id || 'original';
  function cleanP(p){
    try{
      const r = typeof H.clean==='function' ? H.clean(p) : p;
      return (r && r.id) ? r : null;
    }catch(e){ return null; }
  }
  let profiles = [];
  (Array.isArray(opts.avatars) ? opts.avatars : []).forEach(p=>{
    const c = cleanP(p);
    if(c && !profiles.some(x=>x.id===c.id)) profiles.push(c);
  });
  const hu = opts.human ? cleanP(opts.human) : null;
  if(hu){
    const hi = profiles.findIndex(x=>x.id===hu.id);
    if(hi>=0) profiles[hi] = hu; else profiles.unshift(hu);
  }
  let activeId = hu ? hu.id : (profiles[0] && profiles[0].id);
  if(!profiles.length){
    const kind = opts.avatarKind==='girl' ? 'girl' : 'boy';
    const lk = looks.find(l=>l.kind===kind) || looks[0] || {};
    const raw = {id:'h1', name:'', kind:kind, look:lk.id, outfit:freeOutfit};
    const f = cleanP(raw) || raw;
    profiles.push(f); activeId = f.id;
  }
  const active = () => profiles.find(p=>p.id===activeId) || profiles[0];

  let activeTab = 'me';
  let filter = 'all';
  let pending = null;          // {type,id} — 미리보기만, 저장·구매 아님
  let busy = false;
  let pointsOpen = false;
  let nameDraft = active().name || '';
  let newName = '';
  let lookSel = active().look;

  const TABS = [
    {key:'me',     ko:'나',    en:'Me',       zh:'我'},
    {key:'outfit', ko:'옷',    en:'Outfit',   zh:'服装'},
    {key:'number', ko:'캐릭터',en:'Character',zh:'角色'},
    {key:'symbol', ko:'기호',  en:'Symbols',  zh:'符号'},
    {key:'color',  ko:'색',    en:'Color',    zh:'颜色'},
    {key:'cape',   ko:'망토',  en:'Cape',     zh:'斗篷'},
    {key:'hat',    ko:'모자',  en:'Hat',      zh:'帽子'},
    {key:'bg',     ko:'배경',  en:'BG',       zh:'背景'},
  ];
  const LISTS = {number:'numbers',symbol:'symbols',color:'colors',bg:'bgs',cape:'capes',hat:'hats'};
  const listOf = (t) => t==='outfit' ? outfits : (av[LISTS[t]] || []);

  /* 잠금 안내(코인 가격과 병기) · 과정 보상 배지 */
  function courseNote(n){
    return lang==='en' ? `Course ${n}` : lang==='zh' ? `第${n}阶段解锁` : `과정 ${n} 도달 시`;
  }
  const rewardBadgeTxt = T('✨ 과정 보상','✨ Course Reward','✨ 进度奖励');

  const cp = (s) => Array.from(String(s==null?'':s).replace(/[\r\n\t]+/g,' '));
  const cpTrim = (s) => cp(s).slice(0,MAX_NAME).join('').trim();
  const nameOf = (p) => (p && p.name) ? p.name : T('이름 없는 친구','Unnamed friend','未命名朋友');
  function hRender(p, size){
    if(typeof window.renderHumanChar!=='function') return '';
    try{ return window.renderHumanChar(p, size) || ''; }catch(e){ return ''; }
  }
  function newId(){
    let id;
    do{ id = 'h'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
    while(profiles.some(p=>p.id===id));
    return id;
  }

  /* ── 항목 정보 ── */
  function info(type, id){
    const item = listOf(type).find(x=>String(x.id)===String(id));
    if(!item) return null;
    const price = +item.price || 0;
    const free = !!item.free || !(price>0);
    const owned = free || !!unlocked[type+'_'+item.id];
    let equipped;
    if(type==='outfit') equipped = active().outfit===item.id;
    else if(type==='number') equipped = cur.number===+item.id && !cur.symbol;
    else if(type==='symbol') equipped = cur.symbol===item.id;
    else equipped = cur[type]===item.id;
    let name;
    if(type==='symbol') name = (item.glyph?item.glyph+' ':'')+(L(item)||item.id);
    else if(type==='number') name = item.id+(L(item)?' '+L(item):'');
    else name = L(item) || String(item.id);
    return {type, id:String(item.id), item, price, free, owned, equipped, name};
  }
  function applyTo(char, type, id){
    const c = Object.assign({}, char);
    if(type==='number'){ c.number = +id; delete c.symbol; }   // 숫자·기호는 둘 중 하나만
    else if(type==='symbol') c.symbol = id;
    else c[type] = id;
    return c;
  }
  const previewChar = () => (pending && pending.type!=='outfit') ? applyTo(cur, pending.type, pending.id) : cur;
  const previewProfile = () => (pending && pending.type==='outfit')
    ? Object.assign({}, active(), {outfit: pending.id}) : active();

  function thumb(i){
    if(i.type==='outfit') return hRender(Object.assign({}, active(), {outfit:i.id}), 52);
    if(!rndr) return '';
    if(i.type==='number') return rndr(Object.assign({}, cur, {number:+i.id, symbol:undefined}), 52);
    return rndr(Object.assign({}, cur, {[i.type]: i.id}), 52);
  }

  function stateHTML(i){
    let h = '';
    if(i.equipped) h += `<span class="nmc-st nmc-st-on">✓ ${T('착용 중','Equipped','使用中')}</span>`;
    else if(i.free) h += `<span class="nmc-st nmc-st-free">${T('무료','Free','免费')}</span>`;
    else if(i.owned) h += `<span class="nmc-st nmc-st-own">${T('보유','Owned','已拥有')}</span>`;
    else h += `<span class="nmc-st nmc-st-price">🪙 ${i.price}</span>`;
    const c = i.item.course;
    if(c!=null) h += i.owned ? `<span class="nmc-ibadge">${rewardBadgeTxt}</span>` : `<span class="nmc-icourse">${courseNote(c)}</span>`;
    return h;
  }

  function cardHTML(i){
    const sel = pending ? (pending.type===i.type && pending.id===i.id) : i.equipped;
    return `<button type="button" class="nmc-item${sel?' sel':''}${i.owned?'':' locked'}" data-nmc-act="item" data-type="${esc(i.type)}" data-id="${esc(i.id)}" data-k="item-${esc(i.type)}-${esc(i.id)}" aria-pressed="${sel?'true':'false'}">
      <span class="nmc-thumb">${thumb(i)}</span>
      <span class="nmc-iname">${esc(i.name)}</span>
      ${stateHTML(i)}
    </button>`;
  }

  const passFilter = (i) => filter==='owned' ? i.owned
    : filter==='affordable' ? (!i.owned && i.price>0 && i.price<=coins) : true;

  function gridHTML(){
    const infos = listOf(activeTab).map(x=>info(activeTab, x.id)).filter(Boolean);
    if(!infos.length) return `<p class="nmc-empty">${T('표시할 항목이 없어요.','Nothing to show.','没有可显示的项目。')}</p>`;
    const shown = infos.filter(passFilter);
    if(!shown.length) return `<p class="nmc-empty">${T('이 조건에 맞는 항목이 없어요.','No items match this filter.','没有符合条件的项目。')}</p>`;
    if(activeTab==='number'){
      const singles = shown.filter(i=>+i.id<10), specials = shown.filter(i=>+i.id>=10);
      let h = singles.map(cardHTML).join('');
      if(specials.length){
        h += `<div class="nmc-section-title">${T('✨ 특별 보상 · 두 자리 수','✨ Special Rewards · Two-Digit','✨ 特别奖励 · 两位数')}</div>`;
        h += specials.map(cardHTML).join('');
      }
      return h;
    }
    return (activeTab==='bg'?`<p class="nmc-note nmc-section-title">${T('배경은 캐릭터 그림에 보여요. 마을에서는 색·모자·망토가 보여요.','Backgrounds appear in your portrait. Colors, hats and capes appear in town.','背景显示在角色画像中，颜色、帽子和斗篷显示在小镇中。')}</p>`:'')+shown.map(cardHTML).join('');
  }

  /* ── 미리보기 + 구매/적용 확인 패널 ── */
  function bigPreview(){
    const p = previewProfile(), c = previewChar();
    try{
      if(typeof window.renderPartyHtml==='function') return window.renderPartyHtml(p, c, 108) || '';
    }catch(e){}
    return rndr ? rndr(c, 108) : hRender(p, 108);
  }

  function panelHTML(){
    if(!pending){
      return `<div class="nmc-panel nmc-panel-idle">${T('항목을 누르면 미리 입어 볼 수 있어요. 바로 사지 않아요.','Tap an item to preview it. Nothing is bought yet.','点击项目先预览，不会立即购买。')}</div>`;
    }
    const i = info(pending.type, pending.id);
    if(!i) return '';
    const canBuy = !i.owned && i.price>0;
    let lines = '', confirmTxt, disabled = false;
    if(i.equipped){
      lines = `<div class="nmc-pline">✓ ${T('지금 착용 중이에요','Already equipped','正在使用')}</div>`;
      confirmTxt = T('적용','Apply','应用'); disabled = true;
    }else if(i.free){
      lines = `<div class="nmc-pline">${T('무료 · 코인이 들지 않아요','Free · no coins used','免费 · 不消耗金币')}</div>`;
      confirmTxt = T('적용','Apply','应用');
    }else if(i.owned){
      lines = `<div class="nmc-pline">${T('보유 중 · 추가 코인 없음','Owned · no extra coins','已拥有 · 无需金币')}</div>`;
      confirmTxt = T('적용','Apply','应用');
    }else if(canBuy){
      const left = coins - i.price;
      lines = `<div class="nmc-pline">${T('가격','Price','价格')} <b>🪙 ${i.price}</b> · ${T('내 코인','My coins','我的金币')} <b>🪙 ${coins}</b></div>`;
      if(left>=0) lines += `<div class="nmc-pline">${T('사고 나면','After buying','购买后')} <b>🪙 ${left}</b> ${T('남아요','left','剩余')}</div>`;
      else lines += `<div class="nmc-pline nmc-need">${T(`🪙 ${-left} 코인이 더 필요해요`,`Need 🪙 ${-left} more coins`,`还需要 🪙 ${-left} 金币`)}</div>`;
      confirmTxt = T('구매하고 적용','Confirm Purchase','确认购买');
      disabled = left<0 || typeof opts.onPurchase!=='function';
      if(typeof opts.onPurchase!=='function') lines += `<div class="nmc-pline nmc-need">${T('지금은 구매할 수 없어요','Purchasing is unavailable','暂时无法购买')}</div>`;
    }else{
      lines = `<div class="nmc-pline">${i.item.course!=null?courseNote(i.item.course):T('아직 열 수 없어요','Not available yet','暂未开放')}</div>`;
      confirmTxt = T('적용','Apply','应用'); disabled = true;
    }
    return `<div class="nmc-panel">
      <div class="nmc-pname">${esc(i.name)}</div>
      ${lines}
      <div class="nmc-pbtns">
        <button type="button" class="nmc-btn nmc-btn-main" data-nmc-act="confirm" data-k="confirm"${disabled||busy?' disabled':''}>${confirmTxt}</button>
        <button type="button" class="nmc-btn" data-nmc-act="cancel" data-k="cancel">${T('취소','Cancel','取消')}</button>
      </div>
    </div>`;
  }

  /* ── 포인트 ── */
  const REASONS = [
    ['attendance',T('출석','Attendance','出勤')],
    ['weekly',T('주간 봉투·부스터','Weekly envelope & booster','每周信封·加速')],
    ['history',T('학습 기록','Learning history','学习记录')],
    ['boost',T('부스터','Booster','加速')],
    ['training',T('마법 훈련','Magic training','魔法训练')],
    ['unit',T('단원 완료','Unit complete','单元完成')],
    ['purchase',T('꾸미기 구매','Closet purchase','装扮购买')],
    ['game',T('짝 맞추기 게임','Matching game','配对游戏')],
    ['learning',T('학습 보상','Learning reward','学习奖励')],
  ];
  function reasonText(r){
    const s = String(r==null?'':r).toLowerCase();
    const f = REASONS.find(x=>s.indexOf(x[0])>=0);
    return f ? f[1] : T('기타','Other','其他');
  }
  function recentLedger(){
    const rows = ledger.filter(e=>e && Number.isFinite(+e.amount)).map((e,idx)=>{
      const t = typeof e.at==='number' ? e.at : Date.parse(e.at);
      return {e, idx, t: Number.isFinite(t) ? t : null};
    });
    rows.sort((a,b)=> (a.t!=null && b.t!=null && a.t!==b.t) ? b.t-a.t : b.idx-a.idx);
    return rows.slice(0, MAX_LEDGER);
  }
  function pointsHTML(){
    const guide = [
      T('출석하면 🪙 3','Daily attendance: 🪙 3','每日出勤：🪙 3'),
      T('주간 봉투를 열고 필요한 보강을 마치면 🪙 10','Open the weekly envelope and finish any required booster: 🪙 10','打开每周信封并完成所需巩固：🪙 10'),
      T('마법 훈련은 단계마다 한 번 🪙 2','Magic training: 🪙 2, once per step','魔法训练：每一步一次 🪙 2'),
      T('보강 학습 🪙 6','Reinforcement: 🪙 6','巩固学习：🪙 6'),
      T('단원을 마치면 받는 🪙는 단원마다 달라요','Unit completion rewards vary by unit','完成单元的 🪙 因单元而异'),
    ];
    let body = '';
    if(pointsOpen){
      const rows = recentLedger();
      body = `<div class="nmc-pbody" id="nmc-points-body">
        <div class="nmc-bal">${T('내 코인(포인트)','My coins (points)','我的金币（积分）')}: <b>🪙 ${coins}</b></div>
        <ul class="nmc-guide">${guide.map(g=>`<li>${g}</li>`).join('')}</ul>
        <p class="nmc-note">${T('코인은 앱 안에서만 쓰는 포인트예요. 실제 돈으로 결제하지 않아요.','Coins are in-app points only. No real money is ever charged.','金币只是应用内积分，不涉及真实付款。')}</p>
        <h3 class="nmc-h3">${T('최근 기록 (최대 20건)','Recent activity (up to 20)','最近记录（最多20条）')}</h3>
        ${rows.length ? `<ul class="nmc-ledger">${rows.map(({e})=>{
          const a = +e.amount, d = new Date(e.at);
          const split=String(e.label||'').indexOf('_'),type=String(e.label||'').slice(0,split),id=String(e.label||'').slice(split+1);
          const detail=e.reason==='purchase'&&split>0?info(type,id):null;
          const label=detail?detail.name:e.label;
          const ds = isNaN(d.getTime()) ? '' : d.toLocaleDateString(lang==='zh'?'zh-CN':lang==='en'?'en-US':'ko-KR');
          return `<li><span class="nmc-l-r">${esc(reasonText(e.reason))}${label?` · ${esc(label)}`:''}</span>
            <span class="nmc-l-a ${a<0?'neg':'pos'}">${a<0?'−':'+'}${Math.abs(a)} ${T('코인','coins','金币')}</span>
            ${ds?`<span class="nmc-l-d">${esc(ds)}${Number.isSafeInteger(e.balance)?' · '+T('잔액','Balance','余额')+' '+e.balance:''}</span>`:''}</li>`;
        }).join('')}</ul>` : `<p class="nmc-empty">${T('이전 잔액은 유지돼요. 이번 업데이트 이후 변동부터 기록해요.','Your previous balance is retained. Changes are recorded from this update.','原有余额保留，从本次更新起记录变动。')}</p>`}
      </div>`;
    }
    return `<section class="nmc-points">
      <button type="button" class="nmc-ptoggle" data-nmc-act="points" data-k="points" aria-expanded="${pointsOpen?'true':'false'}" aria-controls="nmc-points-body">
        <span>🪙 ${T('코인(포인트) 안내','Coins (points) guide','金币（积分）说明')}</span><span aria-hidden="true">${pointsOpen?'▲':'▼'}</span>
      </button>${body}
    </section>`;
  }

  /* ── 나 탭 ── */
  function meHTML(){
    const a = active();
    const gallery = profiles.map(p=>{
      const on = p.id===activeId;
      return `<button type="button" class="nmc-char${on?' sel':''}" data-nmc-act="pick" data-id="${esc(p.id)}" data-k="pick-${esc(p.id)}" aria-pressed="${on?'true':'false'}">
        <span class="nmc-thumb">${hRender(p,52)}</span>
        <span class="nmc-iname">${esc(nameOf(p))}</span>
        ${on?`<span class="nmc-st nmc-st-on">✓ ${T('선택됨','Selected','已选')}</span>`:''}
      </button>`;
    }).join('');
    const lookCards = looks.map(l=>{
      const on = l.id===lookSel;
      const probe = Object.assign({}, a, {look:l.id, kind:l.kind||a.kind});
      return `<button type="button" class="nmc-char${on?' sel':''}" data-nmc-act="look" data-id="${esc(l.id)}" data-k="look-${esc(l.id)}" aria-pressed="${on?'true':'false'}">
        <span class="nmc-thumb">${hRender(probe,52)}</span>
        <span class="nmc-iname">${esc(L(l)||l.id)}</span>
        ${on?`<span class="nmc-st nmc-st-on">✓ ${T('고름','Picked','已选')}</span>`:''}
      </button>`;
    }).join('');
    const full = profiles.length>=MAX_CHARS;
    return `
    <section class="nmc-sec">
      <h3 class="nmc-h3">${T('내 캐릭터 모음','My characters','我的角色')}</h3>
      <div class="nmc-gal">${gallery}</div>
    </section>
    <section class="nmc-sec">
      <label class="nmc-h3" for="nmc-name">${T('캐릭터 이름','Character name','角色名字')}: <span class="nmc-cur">${esc(nameOf(a))}</span></label>
      <div class="nmc-row">
        <input id="nmc-name" class="nmc-input" type="text" data-nmc-input="name" data-k="name" value="${esc(nameDraft)}" autocomplete="off" placeholder="${esc(T('이름을 적어요','Type a name','输入名字'))}">
        <button type="button" class="nmc-btn nmc-btn-main" data-nmc-act="savename" data-k="savename">${T('이름 저장','Save Name','保存名字')}</button>
      </div>
      <div class="nmc-hintline"><span id="nmc-name-count">${cp(nameDraft).length}</span>/${MAX_NAME}</div>
    </section>
    <section class="nmc-sec">
      <h3 class="nmc-h3">${T('모습 고르기 (모두 무료)','Pick a look (all free)','选择外观（全部免费）')}</h3>
      <div class="nmc-gal nmc-look-gallery">${lookCards || `<p class="nmc-empty">${T('모습을 불러오지 못했어요.','Looks unavailable.','无法加载外观。')}</p>`}</div>
      <div class="nmc-row">
        <button type="button" class="nmc-btn" data-nmc-act="applylook" data-k="applylook">${T('지금 캐릭터에 적용','Apply to current','应用到当前角色')}</button>
      </div>
      <div class="nmc-newbox">
        <label class="nmc-h3" for="nmc-newname">${T('새 캐릭터 이름','New character name','新角色名字')}</label>
        <div class="nmc-row">
          <input id="nmc-newname" class="nmc-input" type="text" data-nmc-input="new" data-k="newname" value="${esc(newName)}" autocomplete="off" placeholder="${esc(T('비워 둬도 돼요','Optional','可留空'))}">
          <button type="button" class="nmc-btn nmc-btn-main" data-nmc-act="add" data-k="add"${full?' disabled':''}>${T('캐릭터 추가','Add Character','添加角色')}</button>
        </div>
        ${full?`<div class="nmc-hintline">${T(`최대 ${MAX_CHARS}명까지 만들 수 있어요`,`Up to ${MAX_CHARS} characters`,`最多 ${MAX_CHARS} 个角色`)}</div>`:''}
      </div>
      <p class="nmc-note">${T('학습 기록과 포인트는 그대로예요. 새 캐릭터는 학습 계정이 아니에요. 옷은 ‘옷’ 탭에서 골라요.','Your learning record and points stay the same. A new character is not a new account. Pick clothes in the Outfit tab.','学习记录和积分不变。新角色不是新账号。服装请在“服装”标签选择。')}</p>
    </section>`;
  }

  /* ── 렌더 ── */
  const wrap = document.createElement('div');
  wrap.className = 'nmc-wrap';
  wrap.innerHTML = '<div class="nmc-body"></div><div class="nmc-msg" role="status" aria-live="polite"></div>';
  const body = wrap.firstChild, msgEl = wrap.lastChild;
  container.innerHTML = '';
  container.appendChild(wrap);

  function setMsg(text, kind){
    msgEl.textContent = text || '';
    msgEl.className = 'nmc-msg' + (kind ? ' nmc-msg-'+kind : '');
  }

  function render(){
    const ae = document.activeElement;
    const fk = (ae && wrap.contains(ae)) ? ae.getAttribute('data-k') : null;
    const a = active();
    const tabsHTML = TABS.map(t=>`<button type="button" class="nmc-tab${t.key===activeTab?' active':''}" data-nmc-act="tab" data-tab="${t.key}" data-k="tab-${t.key}"${t.key===activeTab?' aria-current="true"':''}>${L(t)}</button>`).join('');
    const FILTERS = [['all',T('전체','All','全部')],['owned',T('보유','Owned','已拥有')],['affordable',T('살 수 있는','Affordable','买得起')]];
    const filtersHTML = FILTERS.map(f=>`<button type="button" class="nmc-chip" data-nmc-act="filter" data-f="${f[0]}" data-k="filter-${f[0]}" aria-pressed="${filter===f[0]?'true':'false'}">${filter===f[0]?'✓ ':''}${f[1]}</button>`).join('');
    body.innerHTML = `
  <div class="nmc-head">
    <div class="nmc-title">✨ ${T('내 캐릭터','My Character','我的角色')}</div>
    <div id="nmc-coins" class="nmc-coins" aria-label="${esc(T('코인(포인트)','Coins (points)','金币（积分）'))} ${coins}">🪙 ${coins}</div>
  </div>
  <div class="nmc-preview-area">
    <div class="nmc-stage"><div id="nmc-preview">${bigPreview()}</div></div>
    <div class="nmc-pvname">${esc(nameOf(a))}</div>
    ${panelHTML()}
  </div>
  <div class="nmc-tab-bar">${tabsHTML}</div>
  ${activeTab==='me'
    ? `<div class="nmc-me">${meHTML()}</div>`
    : `<div class="nmc-filters">${filtersHTML}</div><div id="nmc-grid" class="nmc-grid">${gridHTML()}</div>`}
  ${pointsHTML()}`;
    if(fk){
      const el = Array.from(body.querySelectorAll('[data-k]')).find(x=>x.getAttribute('data-k')===fk);
      if(el && !el.disabled){ try{ el.focus({preventScroll:true}); }catch(e){ el.focus(); } }
    }
    const bar = body.querySelector('.nmc-tab-bar'), tb = body.querySelector('.nmc-tab[aria-current="true"]');
    if(bar && tb) bar.scrollLeft = Math.max(0, tb.offsetLeft - (bar.clientWidth - tb.offsetWidth)/2);
  }

  /* ── 사람 캐릭터 저장 (성공해야만 로컬 상태 확정) ── */
  function saveHuman(newActive, newAll){
    if(typeof opts.onSaveHuman!=='function'){
      setMsg(T('지금은 저장할 수 없어요.','Saving is unavailable.','暂时无法保存。'),'err');
      return false;
    }
    let ok = false;
    try{
      ok = opts.onSaveHuman(Object.assign({}, newActive), newAll.map(p=>Object.assign({}, p))) === true;
    }catch(e){ ok = false; }
    if(!ok){
      setMsg(T('저장하지 못했어요. 다시 해 주세요.','Could not save. Please try again.','保存失败，请重试。'),'err');
      return false;
    }
    profiles = newAll; activeId = newActive.id;
    return true;
  }
  const withActive = (patch) => {
    const a = active();
    const np = cleanP(Object.assign({}, a, patch)) || Object.assign({}, a, patch);
    return {np, all: profiles.map(p=>p.id===a.id ? np : p)};
  };
  const syncDrafts = () => { nameDraft = active().name || ''; lookSel = active().look; };

  function pickProfile(id){
    pending = null; setMsg('');
    const p = profiles.find(x=>x.id===id);
    if(!p || id===activeId){ render(); return; }
    if(saveHuman(p, profiles)){ syncDrafts(); setMsg(T('캐릭터를 골랐어요.','Character selected.','已选择角色。'),'ok'); }
    render();
  }
  function saveName(){
    pending = null; setMsg('');
    const name = cpTrim(nameDraft);
    const r = withActive({name});
    if(saveHuman(r.np, r.all)){ nameDraft = active().name || ''; setMsg(T('이름을 저장했어요.','Name saved.','名字已保存。'),'ok'); }
    render();
  }
  function applyLook(){
    pending = null; setMsg('');
    const l = looks.find(x=>x.id===lookSel);
    if(!l){ setMsg(T('모습을 먼저 골라요.','Pick a look first.','请先选择外观。'),'err'); render(); return; }
    const r = withActive({look:l.id, kind:l.kind || active().kind});
    if(saveHuman(r.np, r.all)){ syncDrafts(); setMsg(T('모습을 저장했어요.','Look saved.','外观已保存。'),'ok'); }
    render();
  }
  function addCharacter(){
    pending = null; setMsg('');
    if(profiles.length>=MAX_CHARS){ setMsg(T(`최대 ${MAX_CHARS}명까지예요.`,`Up to ${MAX_CHARS} characters.`,`最多 ${MAX_CHARS} 个角色。`),'err'); render(); return; }
    const l = looks.find(x=>x.id===lookSel);
    if(!l){ setMsg(T('모습을 먼저 골라요.','Pick a look first.','请先选择外观。'),'err'); render(); return; }
    const raw = {id:newId(), name:cpTrim(newName), kind:l.kind || active().kind, look:l.id, outfit:freeOutfit};
    const np = cleanP(raw) || raw;
    if(saveHuman(np, profiles.concat([np]))){
      newName = ''; syncDrafts();
      setMsg(T('새 캐릭터를 만들었어요.','New character added.','已添加新角色。'),'ok');
    }
    render();
  }

  /* ── 구매/적용 확인 — 중복 실행 방지(busy), 잔액은 onPurchase 반환값만 신뢰 ── */
  function confirmPending(){
    if(busy || !pending) return;
    const i = info(pending.type, pending.id);
    if(!i){ pending = null; render(); return; }
    if(i.equipped) return;
    busy = true; setMsg('');
    try{
      if(!i.owned){
        if(!(i.price>0) || typeof opts.onPurchase!=='function'){
          setMsg(T('지금은 구매할 수 없어요.','Purchasing is unavailable.','暂时无法购买。'),'err'); return;
        }
        if(coins < i.price){
          setMsg(T(`🪙 ${i.price-coins} 코인이 더 필요해요.`,`Need 🪙 ${i.price-coins} more coins.`,`还需要 🪙 ${i.price-coins} 金币。`),'err'); return;
        }
        let r = null;
        try{ r = opts.onPurchase(i.type, i.id); }catch(e){ r = null; }
        if(!r || r.ok!==true){
          setMsg((r && r.message) || T('구매하지 못했어요. 코인은 그대로예요.','Purchase failed. Your coins are unchanged.','购买失败，金币不变。'),'err'); return;
        }
        if(r.coins!=null && Number.isFinite(+r.coins)) coins = +r.coins;
        if(Array.isArray(r.ledger))ledger.splice(0,ledger.length,...r.ledger);
        if(r.unlocked && typeof r.unlocked==='object') unlocked = Object.assign({}, r.unlocked);
        if(!info(i.type, i.id).owned){
          setMsg(T('구매 확인이 안 됐어요. 적용하지 않았어요.','Purchase was not confirmed. Not applied.','未确认购买，未应用。'),'err'); return;
        }
      }
      const failNote = i.owned ? '' : T('구매는 끝났어요. 저장하지 못했으니 다시 적용을 눌러요. ','Purchase done. Save failed — press Apply again. ','购买已完成，但保存失败，请再次点击应用。');
      if(i.type==='outfit'){
        const r2 = withActive({outfit:i.id});
        if(saveHuman(r2.np, r2.all)){
          pending = null;
          setMsg(T('옷을 입었어요!','Outfit applied!','已穿上服装！'),'ok');
        }else if(failNote) setMsg(failNote,'err');
      }else{
        if(typeof opts.onSave!=='function'){ setMsg(failNote+T('지금은 저장할 수 없어요.','Saving is unavailable.','暂时无法保存。'),'err'); return; }
        const next = applyTo(cur, i.type, i.id);
        let ok = false;
        try{ ok = opts.onSave(Object.assign({}, next), Object.assign({}, unlocked)) === true; }catch(e){ ok = false; }
        if(ok){
          cur = next; pending = null;
          setMsg(T('적용했어요!','Applied!','已应用！'),'ok');
        }else{
          setMsg(failNote+T('저장하지 못했어요. 원래 모습은 그대로예요.','Could not save. Your previous look is unchanged.','保存失败，原来的样子不变。'),'err');
        }
      }
    }finally{
      busy = false; render();
    }
  }

  /* ── 이벤트 (wrap 안에서만, 위임) ── */
  wrap.addEventListener('click', (ev)=>{
    const b = ev.target.closest && ev.target.closest('[data-nmc-act]');
    if(!b || !wrap.contains(b) || b.disabled) return;
    const act = b.getAttribute('data-nmc-act');
    if(act==='tab'){
      activeTab = b.getAttribute('data-tab'); pending = null; setMsg(''); render();
    }else if(act==='filter'){
      filter = b.getAttribute('data-f'); render();
    }else if(act==='item'){
      const t = b.getAttribute('data-type'), id = b.getAttribute('data-id');
      if(!info(t, id)) return;
      pending = (pending && pending.type===t && pending.id===id) ? null : {type:t, id:id};
      setMsg(''); render();
      const pn = body.querySelector('.nmc-preview-area');
      if(pending && pn && pn.scrollIntoView){ try{ pn.scrollIntoView({block:'nearest'}); }catch(e){} }
    }else if(act==='confirm') confirmPending();
    else if(act==='cancel'){ pending = null; setMsg(''); render(); }
    else if(act==='pick') pickProfile(b.getAttribute('data-id'));
    else if(act==='savename') saveName();
    else if(act==='look'){ lookSel = b.getAttribute('data-id'); render(); }
    else if(act==='applylook') applyLook();
    else if(act==='add') addCharacter();
    else if(act==='points'){ pointsOpen = !pointsOpen; render(); }
  });
  function onNameInput(t, which){
    if(!t.isComposing){
      const arr = cp(t.value);
      if(arr.length>MAX_NAME) t.value = arr.slice(0,MAX_NAME).join('');
    }
    if(which==='name'){
      nameDraft = t.value;
      const c = wrap.querySelector('#nmc-name-count');
      if(c) c.textContent = String(cp(nameDraft).length);
    }else newName = t.value;
  }
  wrap.addEventListener('input', (ev)=>{
    const t = ev.target, w = t && t.getAttribute && t.getAttribute('data-nmc-input');
    if(w) onNameInput(t, w);
  });
  wrap.addEventListener('compositionend', (ev)=>{
    const t = ev.target, w = t && t.getAttribute && t.getAttribute('data-nmc-input');
    if(w) onNameInput(t, w);
  });
  wrap.addEventListener('keydown', (ev)=>{
    const t = ev.target, w = t && t.getAttribute && t.getAttribute('data-nmc-input');
    if(!w || ev.key!=='Enter' || ev.isComposing) return;
    ev.preventDefault();
    if(w==='name') saveName(); else addCharacter();
  });

  render();
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.screenCloset;
})();
