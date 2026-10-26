/* C0 AD1 teaching aid. Uses approved bead PNGs; never changes problems or RNG.
 * Caller must gate this renderer to C0, since the generator payload itself has
 * no course identity. Returns two counted groups with + and = answer/blank;
 * do not repeat the original identical equation beneath this concrete example.
 */
(function(W){
'use strict';
const script=document.currentScript;
const assetBase=script&&script.src?new URL('../assets/images/real/',script.src).href:'assets/images/real/';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const css=`<style>.nm-c0-concrete{font-family:inherit;max-width:100%;break-inside:avoid;page-break-inside:avoid;margin:12px 0;color:#182230}.nm-c0-concrete-row{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:8px;align-items:center;max-width:440px;margin:auto}.nm-c0-bead-group{min-width:0;text-align:center}.nm-c0-bead-label{font-size:15px;line-height:1.5;margin-bottom:8px}.nm-c0-beads{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;align-content:start;min-height:64px;max-width:180px;margin:auto}.nm-c0-beads img{display:block;width:100%;max-width:32px;height:auto;aspect-ratio:1;object-fit:contain;margin:auto}.nm-c0-bead-number{font-size:30px;font-weight:700;line-height:1.3;margin-top:8px}.nm-c0-bead-number.first{color:#9c2634}.nm-c0-bead-number.second{color:#234e93}.nm-c0-concrete-sign{font-size:32px;font-weight:700}.nm-c0-concrete-total{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:12px;font-size:28px;font-weight:700}.nm-c0-concrete-box{display:inline-flex;align-items:center;justify-content:center;width:84px;height:68px;border:2px solid #566274;border-radius:5px;background:#fff}.nm-c0-concrete-total-label{font-size:18px;font-weight:500}@media print{.nm-c0-concrete{margin:3mm 0}.nm-c0-beads{min-height:17mm}.nm-c0-concrete-box{width:22mm;height:18mm}}</style>`;
function html(p,solved,threadId,lang){
  if(threadId!=='AD1'||!p||!p.cubes||!Array.isArray(p.cubes.piles)||p.cubes.piles.length!==2)return '';
  const [a,b]=p.cubes.piles,sum=a+b;
  if(![a,b].every(n=>Number.isInteger(n)&&n>=0&&n<=10)||sum>10||p.cubes.moveTo!==sum||p.answer!==sum)return '';
  const tr=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
  function group(n,color,label,cl){
    return `<div class="nm-c0-bead-group"><div class="nm-c0-bead-label">${esc(label)}</div><div class="nm-c0-beads" aria-label="${esc(tr(`구슬 ${n}개`,`${n} beads`,`${n}颗珠子`))}">${Array.from({length:n},()=>`<img src="${esc(assetBase+'bead-'+color+'.png')}" alt="" width="32" height="32" loading="eager" decoding="sync">`).join('')}</div><div class="nm-c0-bead-number ${cl}">${n}</div></div>`;
  }
  return `${css}<div class="nm-c0-concrete"><div class="nm-c0-concrete-row">${group(a,'red',tr('첫째 묶음','First group','第一组'),'first')}<span class="nm-c0-concrete-sign">+</span>${group(b,'blue',tr('둘째 묶음','Second group','第二组'),'second')}</div><div class="nm-c0-concrete-total"><span class="nm-c0-concrete-total-label">${esc(tr('모두','In all','一共'))}</span><span>=</span><span class="nm-c0-concrete-box" aria-label="${esc(solved?tr(`모두 ${sum}개`,`${sum} in all`,`一共${sum}个`):tr('답을 쓰는 칸','Answer box','答案栏'))}">${solved?sum:''}</span></div></div>`;
}
W.NM_C0_CONCRETE={html};
})(window);
