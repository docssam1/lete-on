/* Shared screen-only cues for young learners. Never reads problem.answer.
 * Only already-visible givens are colored; choices/keypads stay neutral. */
(function(){
'use strict';
let observer=null;
const palette=['#16734B','#3d1a5c','#16417C'];
const numeric=/^\d+(?:[.,]\d+)?$/;
const color=value=>palette[Math.abs(Math.round(Number(value.replace(',','.'))*100))%3];
const givens='.nm-dialog-figure,.nm-tm-goal-n,.nm-nb-num,.nm-w-tf-goal strong,.nm-w-pile-count,.nm-w-cubes-target-badge,.nm-gp-goal-n,.nm-tb-goal-n,.nm-sf-chip,.nm-tc-cnt,.nm-tm-cnt,.nm-gp-cnt,.nm-w-tf-count span,.nm-nl-lbl,.nm-g13-nlt,.nm-g13-nlbt,.nm-g13-howmany,.nm-g13-pn,.nm-g46-numcard,.nm-g46-goal b,.nm-g46-left b,.nm-g46-bignum,.nm-g46-mc b,.nm-g79-cap b,.nm-g79-roof b,.nm-g79-rc,.nm-g1012-pf-given,.nm-g1315-num,.nm-g1315-badge';
const excluded='.nm-g46-match,.nm-ml-wrap,button,.nm-numpad,.nm-sf-choices,.nm-tc-choices,.nm-ml-col,.nm-ml-num,.nm-numpad-screen,[data-number-role],.katex-mathml';
function paint(root){
  root.querySelectorAll('.nm-cdesc,.nm-cresult,.nm-rule p,.nm-mstep-line.kid,.nm-g1315-badge').forEach(block=>{
    const walker=document.createTreeWalker(block,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(node.parentElement.closest('.nm-dialog-figure,[data-tex],.katex,svg')||!/[0-9]|얼마|몇|how many|how much|多少|几/i.test(node.textContent))return;
      const parts=node.textContent.split(/([0-9]+(?:[.,][0-9]+)?|얼마|몇|how many|how much|多少|几)/i),frag=document.createDocumentFragment();
      parts.forEach((part,i)=>{if(!i||i%2===0){frag.append(document.createTextNode(part));return;}const span=document.createElement('span');span.className='nm-dialog-figure'+(numeric.test(part)?'':' nm-number-word');span.textContent=part;frag.append(span);});
      node.replaceWith(frag);
    });
  });
  root.querySelectorAll(givens).forEach(el=>{
    if(el.closest(excluded))return;
    const value=el.textContent.trim();
    if(numeric.test(value)){el.style.setProperty('--number-cue',color(value));el.classList.add('nm-number-cue');}
    else if(/^[?□]$/.test(value))el.classList.add('nm-number-unknown');
  });
  // KaTeX keeps its own measured boxes/font metrics. Color visible numeral
  // leaves without splitting TeX, changing values, or touching the math tree.
  root.querySelectorAll('.nm-lab-expr .katex-html .mord').forEach(el=>{
    if(el.closest(excluded)||el.children.length)return;
    if(numeric.test(el.textContent.trim())){el.style.setProperty('--number-cue',color(el.textContent.trim()));el.classList.add('nm-number-cue');}
  });
}
function stop(){if(observer)observer.disconnect();observer=null;}
function start(root){
  stop();if(!root||root.dataset.youngNumbers!=='true')return;
  paint(root);
  observer=new MutationObserver(()=>paint(root));
  observer.observe(root,{childList:true,characterData:true,subtree:true});
}
window.NM_YOUNG_NUMBERS={start,stop};
})();
