/* Preschool worksheet layout, applied only to items carrying the C0 profile. */
(function(W){
'use strict';
function verbal(value,lang){
  const s=String(value||'');
  if(lang==='en')return s.replace(/[+＋]/g,' and ').replace(/[−－]/g,' take away ').replace(/[=＝]/g,' is the same as ');
  if(lang==='zh')return s.replace(/[+＋]/g,' 和 ').replace(/[−－]/g,' 去掉 ').replace(/[=＝]/g,' 一样多 ');
  const term=x=>{
    const ns=x.split(/[+＋]/).map(t=>t.trim());
    if(ns.length>1)return ns.map((n,i)=>i===ns.length-1?n:W.NM_C0.particle(n,'과','와')).join(' ')+'를 모은 수';
    if(/[−－-]/.test(x)){const [u,v]=x.split(/[−－-]/);return u+'에서 '+W.NM_C0.particle(v,'을','를')+' 덜고 남은 수';}
    return x;
  };
  return s.replace(/[0-9□]+(?:\s*[+＋−－=＝-]\s*[0-9□]+)+/g,expression=>{
    const sides=expression.split(/[=＝]/).map(t=>t.trim());
    if(sides.length===2){
      if(/^\d+$/.test(sides[1])&&/^[0-9□]+(?:\s*[+＋]\s*[0-9□]+)+$/.test(sides[0]))return term(sides[0]).replace(/를 모은 수$/,'를 모으면')+' '+sides[1];
      return sides.map(term).join(' 와 같은 수 ');
    }
    return term(expression);
  }).replace(/[+＋]/g,' 모아 ').replace(/[−－]/g,' 덜어 ').replace(/[=＝]/g,' 같은 수 ').replace(/-(?=\s*[\d□])/g,'덜어 ')
    .replace(/>/g,'더 커요').replace(/</g,'더 작아요');
}
function style(){
  if(document.getElementById('nm-c0-paper-style'))return;
  const el=document.createElement('style');el.id='nm-c0-paper-style';el.textContent=`
  .nm-print-c0 .nm-w2-head-code,.nm-print-c0 .nm-ak-subcode{font-size:6pt!important;color:#9a958b!important;font-weight:400!important}
  .nm-print-c0 .nm-w2-head-top>span:not(:first-child){display:none}
  .nm-print-c0 .nm-w2-foot-code{font-size:6pt!important;color:#aaa59c!important;letter-spacing:0!important}
  .nm-print-c0 .nm-nl-tag,.nm-print-c0 .nm-nl-g13-mc .tag{display:none!important}
  .nm-print-c0 .nm-w2-instr{font-size:16px;line-height:1.55;font-weight:600}
  .nm-print-c0 .nm-c0-verbal{white-space:normal;line-height:1.6;font-size:1em;font-family:inherit}
  .nm-print-c0 .nm-print-ask{font-size:16px!important;line-height:1.5!important}
  .nm-print-c0 .nm-c0-draw .nm-nl-stage{font-size:1.35em}
  .nm-print-c0 .nm-c0-draw .nm-nl-cell{width:12.5mm;height:12.5mm}
  .nm-print-c0 .nm-c0-draw .nm-nl-g46-plate{width:16mm;height:16mm}
  .nm-print-c0 .nm-c0-draw .nm-nl-g46-circle{width:18mm;height:18mm}
  .nm-print-c0 .nm-c0-draw .nm-nl-g46-bars i{width:7mm;height:10mm}
  .nm-print-c0 .nm-c0-draw .nm-nl-ansbox{min-width:14mm;min-height:11mm}
  .nm-print-c0 .nm-c0-guardian{font-size:13px;line-height:1.5;color:#655c50;font-weight:500;margin:3mm 0 0}
  .nm-print-c0 .nm-w2-instr,.nm-print-c0 .nm-nl-prompt,.nm-print-c0 .nm-nl-ask{font-family:'NM Series Sans',Pretendard,sans-serif}
  `;document.head.appendChild(el);
}
function decorate(sheet,profile,lang){
  if(!profile)return;style();sheet.classList.add('nm-print-c0');sheet.dataset.c0Week=profile.week;sheet.dataset.c0Block=profile.block;
  const first=sheet.querySelector('.nm-series-front .nm-series-front-left,.nm-series-front .nm-series-front-meta,.nm-series-front');
  if(first&&!first.querySelector('.nm-c0-guardian')){const p=document.createElement('p');p.className='nm-c0-guardian';p.textContent=lang==='en'?'A parent or guardian can read the instructions aloud.':lang==='zh'?'请家长读一读题目。':'보호자가 안내를 읽어 주세요.';first.append(p);}
  // Convert whole math nodes, never KaTeX's separate visible and accessibility trees.
  if(!profile.symbols)for(const el of sheet.querySelectorAll('[data-tex]')){
    const tex=el.dataset.tex||'';
    if(!/[+＋=＝−－-]/.test(tex))continue;
    el.textContent=verbal(tex.replace(/\\(?:square|Box)/g,'□').replace(/\\(?:text|mathrm|mathbf)\{([^}]+)\}/g,'$1').replace(/[{}]/g,''),lang);
    el.removeAttribute('data-tex');el.classList.remove('nm-w2-tex','nm-cp-tex');el.classList.add('nm-c0-verbal');
  }
  const recurring=['순서가 달라도 같은 방법이에요.','빈 원을 채워요! 빈 접시에 그림도 그려 보세요.','각 접시에 한 개 이상씩 나눠요.','예시를 포함해 방법을 쓰고, 모두 몇 가지인지 써요.'];
  for(const page of sheet.querySelectorAll('.nm-w2-page')){
    const boxes=[...page.querySelectorAll('.nm-w2-item')];
    for(const sentence of recurring){
      if(boxes.filter(x=>x.textContent.includes(sentence)).length<2)continue;
      let guide=page.querySelector('.nm-w2-instr');
      if(!guide){guide=document.createElement('div');guide.className='nm-w2-instr';boxes[0].parentElement.before(guide);}
      const line=document.createElement('span');line.textContent=' '+sentence;guide.append(line);
      for(const box of boxes){const walk=document.createTreeWalker(box,NodeFilter.SHOW_TEXT);while(walk.nextNode())walk.currentNode.textContent=walk.currentNode.textContent.replace(sentence,'');}
    }
  }
  const walker=document.createTreeWalker(sheet,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    if(node.parentElement.closest('style,script,.katex,.nm-w2-head-code,.nm-w2-foot-code,.nm-ak-subcode,.nm-w2-pg'))continue;
    let text=node.textContent;
    if(lang==='ko'&&W.NM_C0)text=NM_C0.korean(text);
    if(!profile.symbols)text=verbal(text,lang);
    if(lang==='ko'&&W.NM_C0)text=NM_C0.korean(text);
    node.textContent=text;
  }
  for(const el of sheet.querySelectorAll('.nm-w2-item,.nm-w2-example')){
    if(/병아리|거북이|물고기|나비|토끼|곰|여우|사슴/.test(el.textContent))for(const u of el.querySelectorAll('.nm-nl-unit'))if(u.textContent==='개')u.textContent='마리';
    if(el.querySelector('[data-c0-draw]'))el.classList.add('nm-c0-draw');
  }
}
W.NM_C0_PAPER={decorate,verbal};
})(window);
