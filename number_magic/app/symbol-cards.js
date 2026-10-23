/* Symbol collection presentation. Source wording, collection records, coins and
 * learning progress belong to the caller and are never written here. */
(function(W){
'use strict';
const E=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=(v,lang)=>typeof v==='string'?v:v&&(v[lang]||v.ko||v.en)||'';
const tr=(lang,ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
const GROUPS={
  number:{ko:'수와 수의 표현',en:'Numbers and notation',zh:'数与数的表示',icon:'○'},
  operation:{ko:'연산과 계산',en:'Operations',zh:'运算',icon:'+'},
  relation:{ko:'관계와 집합',en:'Relations and sets',zh:'关系与集合',icon:'='},
  algebra:{ko:'문자와 대수',en:'Algebra',zh:'代数',icon:'x'},
  function:{ko:'함수와 변화',en:'Functions and change',zh:'函数与变化',icon:'∿'},
  geometry:{ko:'도형과 위치',en:'Geometry and position',zh:'几何与位置',icon:'◇'},
  data:{ko:'자료와 통계',en:'Data and statistics',zh:'数据与统计',icon:'⋮'},
  notation:{ko:'수학의 표현',en:'Mathematical notation',zh:'数学表示',icon:'✦'}
};
function category(sym){
  if(['0','Ⅹ','.','½','π','e','∞'].includes(sym)||/^\d+$/.test(sym))return 'number';
  if(['+','−','-','×','÷','√','ⁿ√','²','!','%','Σ','log'].includes(sym))return 'operation';
  if(['=','<','>','≤','≥','≈','≠','∈','∪','∩','∴'].includes(sym))return 'relation';
  if(['x','aⁿ','D','αβ','i','|x|','ₙCᵣ'].includes(sym))return 'algebra';
  if(['f(x)','lim',"f'",'f′','d/dx','∫','f⁻¹','sin'].includes(sym))return 'function';
  if(['⊥','∥','°','θ','(x, y)'].includes(sym))return 'geometry';
  if(['x̄','σ'].includes(sym))return 'data';
  return 'notation';
}
function model(symbols,collected){
  const seen=new Set(),entries=[],owned=collected&&typeof collected==='object'?collected:{};
  (Array.isArray(symbols)?symbols:[]).forEach(source=>{
    if(!source||source.sym==null)return;
    const sym=String(source.sym);if(!sym.trim()||seen.has(sym))return;seen.add(sym);
    entries.push({source,sym,index:entries.length+1,category:category(sym),owned:Object.prototype.hasOwnProperty.call(owned,sym)&&!!owned[sym]});
  });
  return {entries,total:entries.length,collected:entries.filter(e=>e.owned).length};
}
function relation(sy,lang){
  const unit=(W.NM_UNITS||{})[sy.unitId],unitTitle=text(sy.unitTitle,lang)||text(unit&&unit.title,lang);
  let courseLabel=text(sy.courseLabel,lang);
  if(!courseLabel&&sy.unitId){
    const found=Object.values(W.NM_COURSES||{}).find(c=>(c.sessions||[]).some(s=>(s.magic||[]).flat().includes(sy.unitId)));
    if(found)courseLabel=tr(lang,'과정 ','Course ','课程')+(found.order==null?found.id:found.order);
  }
  return {courseLabel,unitTitle};
}
function art(entry,opts,size){
  try{if(typeof opts.figure==='function'){const html=opts.figure(entry.sym,size);if(html)return html;}}catch(e){}
  return '<span class="nmsc-glyph">'+E(entry.sym)+'</span>';
}
const emblem='<span class="nmsc-emblem" aria-hidden="true">✦</span>';
function face(entry,opts,acquiring){
  const lang=opts.lang,sy=entry.source,group=GROUPS[entry.category],rel=relation(sy,lang);
  const name=entry.owned||acquiring?text(sy.read,lang)||entry.sym:tr(lang,'아직 만나기 전','Not collected yet','尚未收集');
  return '<span class="nmsc-card-top"><span class="nmsc-number">No. '+String(entry.index).padStart(3,'0')+'</span>'+emblem+'</span>'
    +'<span class="nmsc-scene"><span class="nmsc-orbit" aria-hidden="true"></span><span class="nmsc-figure" aria-hidden="true">'+art(entry,opts,144)+'</span><span class="nmsc-spark nmsc-spark-a" aria-hidden="true">✧</span><span class="nmsc-spark nmsc-spark-b" aria-hidden="true">✦</span></span>'
    +'<span class="nmsc-symbol-mark">'+E(entry.sym)+'</span><span class="nmsc-name">'+E(name)+'</span>'
    +'<span class="nmsc-category"><span aria-hidden="true">'+group.icon+'</span> '+E(text(group,lang))+'</span>'
    +'<span class="nmsc-card-foot">'+(entry.owned||acquiring?'<span class="nmsc-owned-seal">'+(acquiring?tr(lang,'새로운 기호 카드','New symbol card','新符号卡'):tr(lang,'수집 완료','Collected','已收集'))+'</span>':E(rel.courseLabel||rel.unitTitle||tr(lang,'연결된 단원에서 만나요','Meet it in its lesson','在关联单元中认识它')))+'</span>';
}
function dateLabel(value,lang){
  const d=new Date(value);return value!=null&&Number.isFinite(+d)?d.toLocaleDateString(lang==='en'?'en-US':lang==='zh'?'zh-CN':'ko-KR',{year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Seoul'}):tr(lang,'수집일 기록 없음','Collection date not recorded','未记录收集日期');
}
function facts(entry,opts,record,acquiring){
  const sy=entry.source,lang=opts.lang,rel=relation(sy,lang);
  if(!entry.owned&&!acquiring)return '<div class="nmsc-lock-note"><span aria-hidden="true">✦</span><h3>'+tr(lang,'이 기호를 만날 곳','Where to meet this symbol','在哪里认识这个符号')+'</h3>'
    +'<p>'+E([rel.courseLabel,rel.unitTitle].filter(Boolean).join(' · ')||tr(lang,'이 기호와 연결된 학습 단원','The lesson linked to this symbol','与此符号关联的学习单元'))+'</p>'
    +'<p>'+tr(lang,'이 단원에서 기호를 배우고, 나의 도감에 카드를 모아요.','Learn this symbol in its lesson and add its card to your collection.','在这个单元中学习符号，把它的卡片收进自己的图鉴。')+'</p></div>';
  return '<div class="nmsc-facts">'
    +'<section><h3>'+tr(lang,'읽는 이름','Read it as','读作')+'</h3><p class="nmsc-read-name">'+E(text(sy.read,lang)||entry.sym)+'</p></section>'
    +'<section><h3>'+tr(lang,'기호의 뜻','What it means','符号含义')+'</h3><p data-nmsc-source="translate">'+E(text(sy.translate,lang))+'</p></section>'
    +'<section><h3>'+tr(lang,'기호가 태어난 이야기','Its story','符号的故事')+'</h3><p data-nmsc-source="birth">'+E(text(sy.birth,lang))+'</p></section>'
    +([rel.courseLabel,rel.unitTitle].some(Boolean)?'<section class="nmsc-lesson-note"><h3>'+tr(lang,'함께 배운 단원','Its learning chapter','相关单元')+'</h3><p>'+E([rel.courseLabel,rel.unitTitle].filter(Boolean).join(' · '))+'</p></section>':'')
    +(!acquiring?'<p class="nmsc-date">'+tr(lang,'수집일 · ','Collected · ','收集日期 · ')+E(dateLabel(record&&record.earnedAt,lang))+'</p>':'')+'</div>';
}
function trap(modal,close){
  const previous=document.activeElement;
  const key=e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();close();return;}
    if(e.key!=='Tab')return;
    const all=[...modal.querySelectorAll('button:not([disabled]),a[href],input,select,[tabindex="0"]')].filter(el=>el.getClientRects().length);
    if(!all.length){e.preventDefault();modal.focus();return;}
    const first=all[0],last=all[all.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  };
  modal.addEventListener('keydown',key);modal.querySelector('button:not([disabled])')?.focus({preventScroll:true});
  return ()=>{
    modal.removeEventListener('keydown',key);
    const restore=()=>{if(previous?.isConnected&&!document.querySelector('.nmsc-overlay'))previous.focus({preventScroll:true});};
    if(document.querySelector('.nmsc-overlay'))queueMicrotask(restore);else restore();
  };
}
function mount(root,options){
  const opts={lang:'ko',...options};if(!['ko','en','zh'].includes(opts.lang))opts.lang='ko';
  let collected=opts.collected||{},filter='all',view=model(opts.symbols,collected),dialog=null,release=null;
  const lang=opts.lang,T=(ko,en,zh)=>tr(lang,ko,en,zh),figOpts={...opts,lang};
  function close(){const old=dialog;dialog=null;if(old)old.remove();if(release){const done=release;release=null;done();}}
  function show(entry,trigger){
    close();
    const sy=entry.source,overlay=document.createElement('div');overlay.className='nmsc-overlay';
    overlay.innerHTML='<section class="nmsc-dialog" role="dialog" aria-modal="true" aria-labelledby="nmsc-detail-title" tabindex="-1"><header class="nmsc-detail-head"><div><span class="nmsc-eyebrow">No. '+String(entry.index).padStart(3,'0')+' · '+E(text(GROUPS[entry.category],lang))+'</span><h2 id="nmsc-detail-title">'+E(entry.owned?text(sy.read,lang)||entry.sym:T('아직 만나지 않은 기호','A symbol to meet','尚未认识的符号'))+'</h2></div><button type="button" class="nmsc-close" aria-label="'+T('닫기','Close','关闭')+'">×</button></header><div class="nmsc-detail-layout"><div class="nmsc-card-shell nmsc-kind-'+entry.category+(entry.owned?' is-collected':' is-uncollected')+'">'+face(entry,figOpts,false)+'</div>'+facts(entry,figOpts,collected[entry.sym],false)+'</div></section>';
    document.body.appendChild(overlay);dialog=overlay;
    overlay.querySelector('.nmsc-close').onclick=close;overlay.onclick=e=>{if(e.target===overlay)close();};
    release=trap(overlay,close);if(trigger&&!overlay.contains(document.activeElement))overlay.querySelector('.nmsc-close').focus();
  }
  function render(){
    const scroll=root.querySelector('.nmsc-content')?.scrollTop||0,focus=document.activeElement?.dataset.nmscSymbol;
    view=model(opts.symbols,collected);const rows=view.entries.filter(e=>filter==='collected'?e.owned:filter==='missing'?!e.owned:true);
    root.innerHTML='<div class="nmsc-page"><header class="nmsc-header"><button type="button" class="nmsc-back">'+E(opts.backLabel||T('← 뒤로','← Back','← 返回'))+'</button><h1>'+T('기호 도감','Symbol collection','符号图鉴')+'</h1><span class="nmsc-header-count">'+view.collected+' / '+view.total+'</span></header><main class="nmsc-content"><section class="nmsc-hero"><span class="nmsc-hero-star" aria-hidden="true">✦</span><div><p class="nmsc-eyebrow">'+T('배움으로 채우는 나의 컬렉션','A collection filled by learning','用学习填满我的收藏')+'</p><h2>'+T('기호 친구들을 모아요','Meet your symbol friends','收集符号朋友')+'</h2><p>'+T('배운 기호는 소장 카드로 남아요. 카드를 열면 뜻과 이야기를 다시 볼 수 있어요.','The symbols you learn become keepsake cards. Open one to revisit its meaning and story.','学过的符号会成为收藏卡。打开卡片，重温它的含义和故事。')+'</p></div><div class="nmsc-collection-count"><b>'+view.collected+'<small> / '+view.total+'</small></b><span>'+T('수집한 기호','symbols collected','已收集符号')+'</span><progress max="'+(view.total||1)+'" value="'+view.collected+'" aria-label="'+T('기호 수집 현황','Symbol collection progress','符号收集进度')+'"></progress></div></section><div class="nmsc-toolbar" role="group" aria-label="'+T('기호 카드 필터','Symbol card filters','符号卡筛选')+'">'+[['all',T('전체','All','全部')],['collected',T('수집','Collected','已收集')],['missing',T('미수집','Not collected','未收集')]].map(([key,label])=>'<button type="button" data-nmsc-filter="'+key+'" aria-pressed="'+(filter===key)+'">'+label+'</button>').join('')+'<span aria-live="polite">'+rows.length+T('장',' cards','张')+'</span></div><div class="nmsc-grid">'+rows.map(entry=>'<button type="button" class="nmsc-card nmsc-kind-'+entry.category+(entry.owned?' is-collected':' is-uncollected')+'" data-nmsc-symbol="'+entry.index+'" aria-label="'+E(entry.sym+' · '+(entry.owned?text(entry.source.read,lang):T('수집 조건 보기','View collection condition','查看收集条件')))+'">'+face(entry,figOpts,false)+'</button>').join('')+'</div>'+(!rows.length?'<p class="nmsc-empty">'+T('이 조건에 맞는 기호 카드가 아직 없어요.','No symbol cards match this filter yet.','还没有符合筛选条件的符号卡。')+'</p>':'')+'<p class="nmsc-footnote">'+T('새로운 기호를 배울 때마다 나만의 도감을 채워 보세요.','Fill your collection one new symbol at a time.','每学会一个新符号，就让自己的图鉴更丰富。')+'</p></main></div>';
    root.querySelector('.nmsc-content').scrollTop=scroll;
    root.querySelector('.nmsc-back').onclick=()=>{close();opts.onBack?.();};
    root.querySelectorAll('[data-nmsc-filter]').forEach(button=>button.onclick=()=>{filter=button.dataset.nmscFilter;render();root.querySelector('[data-nmsc-filter="'+filter+'"]').focus({preventScroll:true});});
    root.querySelectorAll('[data-nmsc-symbol]').forEach(button=>button.onclick=()=>show(view.entries[Number(button.dataset.nmscSymbol)-1],button));
    if(focus)root.querySelector('[data-nmsc-symbol="'+focus+'"]')?.focus({preventScroll:true});
  }
  render();return {destroy:()=>{close();root.replaceChildren();},refresh:value=>{collected=value||{};render();},model:()=>({total:view.total,collected:view.collected,shown:root.querySelectorAll('.nmsc-card').length,filter})};
}
function acquisitionHtml(symbol,options){
  const opts={lang:'ko',...options},index=Number.isInteger(opts.index)&&opts.index>0?opts.index:1,entry={source:symbol,sym:String(symbol.sym),index,category:category(String(symbol.sym)),owned:true},lang=opts.lang;
  return '<div class="nmsc-overlay nmsc-acquisition" id="nmSymModal" lang="'+E(lang)+'"><section class="nmsc-dialog nmsc-acquisition-dialog" role="dialog" aria-modal="true" aria-labelledby="nmsc-acquisition-title"><header class="nmsc-detail-head"><div><span class="nmsc-eyebrow">'+tr(lang,'새로운 배움의 기록','A new learning keepsake','新的学习记录')+'</span><h2 id="nmsc-acquisition-title">'+tr(lang,'새 기호 카드가 도착했어요','A new symbol card has arrived','新符号卡到了')+'</h2></div></header><div class="nmsc-acquisition-inner"><button type="button" id="nmSymFlip" class="nmsc-card nmsc-kind-'+entry.category+' is-collected" aria-expanded="false" aria-controls="nmsc-acquisition-facts">'+face(entry,opts,true)+'<span class="nmsc-turn-hint">'+tr(lang,'카드의 이야기 펼치기','Open the card’s story','展开卡片故事')+'</span></button><div id="nmsc-acquisition-facts" hidden>'+facts(entry,opts,null,true)+'</div><button type="button" id="nmSymClose" class="nmsc-collect">'+tr(lang,'도감에 수집하기','Add to my collection','收进图鉴')+'</button><p class="nmsc-acquisition-note">'+tr(lang,'배운 기호를 도감에 기록해요. 코인은 사용하지 않아요.','Record the symbol you learned in your collection. No coins are spent.','把学过的符号记录到图鉴，不消耗金币。')+'</p><p class="nmsc-acquisition-error" role="alert"></p></div></section></div>';
}
function bindAcquisition(root,options){
  const opts=options||{},lang=opts.lang||root.lang||document.documentElement.lang,button=root.querySelector('#nmSymClose'),flip=root.querySelector('#nmSymFlip'),factsBox=root.querySelector('#nmsc-acquisition-facts'),error=root.querySelector('.nmsc-acquisition-error');let busy=false;
  const commit=()=>{
    if(busy||typeof opts.onCollect!=='function')return;busy=true;button.disabled=true;if(error)error.textContent='';
    const failed=()=>{busy=false;button.disabled=false;if(error)error.textContent=tr(lang,'수집하지 못했어요. 다시 눌러 주세요.','Could not collect the card. Please try again.','未能收集，请重试。');};
    try{if(opts.onCollect()===false)failed();}catch(e){failed();}
  };
  flip.onclick=()=>{factsBox.hidden=!factsBox.hidden;flip.setAttribute('aria-expanded',String(!factsBox.hidden));root.classList.toggle('is-open',!factsBox.hidden);};
  button.onclick=commit;
  // The original acquisition dialog records its already-earned symbol when
  // closed. Escape follows that same caller-owned collection action.
  const cleanup=trap(root,commit);return ()=>{cleanup();flip.onclick=null;button.onclick=null;};
}
const api={mount,model,category,groups:GROUPS,acquisitionHtml,bindAcquisition};
W.NM_SYMBOL_CARDS=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
