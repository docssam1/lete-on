/* Coordinate responses for existing scatter-plot tasks; no generator changes. */
(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr=(ko,en,zh)=>{const l=(document.documentElement.lang||'ko').slice(0,2);return l==='en'?en:l==='zh'?zh:ko;};
function isPlot(p){return !!(p&&p.scatterPlot&&p.scatterPlot.mode==='plot');}
function bounds(p){return {x:p.graph&&p.graph.xr||[0,10],y:p.graph&&p.graph.yr||[0,10]};}
function points(raw,p){
  if(typeof raw!=='string'||!raw.trim())return null;
  let a;try{a=JSON.parse(raw);}catch(e){return null;}
  if(!Array.isArray(a))return null;
  const b=bounds(p),seen=new Set();
  for(const pt of a){
    if(!Array.isArray(pt)||pt.length!==2||!pt.every(Number.isSafeInteger))return null;
    if(pt[0]<b.x[0]||pt[0]>b.x[1]||pt[1]<b.y[0]||pt[1]>b.y[1])return null;
    const k=pt.join(',');if(seen.has(k))return null;seen.add(k);
  }
  return a;
}
function matches(raw,p){
  if(!isPlot(p))return false;
  const a=points(raw,p),expected=p.scatterPlot.points;
  if(!a||!a.length||!Array.isArray(expected)||a.length!==expected.length)return false;
  const keys=new Set(a.map(pt=>pt.join(',')));
  return expected.every(pt=>keys.has(pt.join(',')));
}
const css=`<style>.nm-scatter-answer{max-width:100%;font-size:16px}.nm-scatter-entry{display:flex;flex-wrap:wrap;align-items:end;gap:8px;margin:12px 0}.nm-scatter-entry label{display:flex;flex-direction:column;gap:4px}.nm-scatter-answer input,.nm-scatter-answer button{font:inherit;box-sizing:border-box;min-height:44px;min-width:44px;border:1px solid var(--gf-control-border,#566274);border-radius:4px;background:var(--gf-paper,#fff);color:var(--gf-text,#182230);padding:8px}.nm-scatter-answer input{width:80px}.nm-scatter-answer button{cursor:pointer}.nm-scatter-answer :focus-visible{outline:3px solid var(--gf-focus,#2456c4);outline-offset:2px}.nm-scatter-points{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:8px 0}.nm-scatter-status{min-height:1.5em;margin:8px 0}.nm-scatter-preview{max-width:100%;overflow-x:auto}</style>`;
function list(a){return a.map((pt,j)=>`<li><button type="button" data-scatter-remove="${j}" aria-label="${esc(tr('점 제거','Remove point','删除点'))} (${pt[0]}, ${pt[1]})">(${pt[0]}, ${pt[1]}) · ${esc(tr('제거','Remove','删除'))}</button></li>`).join('');}
function count(a){return a.length?tr(`${a.length}개 점을 찍었어요.`,`${a.length} points plotted.`,`已描${a.length}个点。`):tr('아직 찍은 점이 없어요.','No points plotted yet.','还没有描点。');}
function html(p,raw,index,renderGraph){
  if(!isPlot(p))return '';
  const a=points(raw,p)||[],b=bounds(p),id=`nm-scatter-${Number(index)}`;
  return `${css}<section class="nm-scatter-answer" data-scatter-index="${Number(index)}" aria-label="${esc(tr('산점도 좌표 답','Scatter plot response','散点图作答'))}">
    <div class="nm-scatter-preview">${renderGraph(p,a)}</div>
    <p id="${id}-help">${esc(tr('표의 순서쌍을 하나씩 입력하고 점 추가를 누르세요.','Enter each ordered pair from the table and select Add point.','依次输入表中的有序数对，然后选择添加点。'))}</p>
    <div class="nm-scatter-entry"><label>x<input data-scatter-x type="number" step="1" min="${b.x[0]}" max="${b.x[1]}" aria-describedby="${id}-help ${id}-status"></label><label>y<input data-scatter-y type="number" step="1" min="${b.y[0]}" max="${b.y[1]}" aria-describedby="${id}-help ${id}-status"></label><button type="button" data-scatter-add>${esc(tr('점 추가','Add point','添加点'))}</button><button type="button" data-scatter-clear>${esc(tr('전체 지우기','Clear all','全部清除'))}</button></div>
    <ul class="nm-scatter-points" aria-label="${esc(tr('내가 찍은 점','My plotted points','我描的点'))}">${list(a)}</ul><p class="nm-scatter-status" id="${id}-status" role="status" aria-live="polite" aria-atomic="true">${count(a)}</p></section>`;
}
function bind(container,problems,answers,renderGraph,onChange){
  container.querySelectorAll('[data-scatter-index]').forEach(el=>{
    const i=Number(el.dataset.scatterIndex),p=problems[i];if(!isPlot(p))return;
    if(el._nmScatterCleanup)el._nmScatterCleanup();
    const x=el.querySelector('[data-scatter-x]'),y=el.querySelector('[data-scatter-y]'),status=el.querySelector('.nm-scatter-status');
    const get=()=>points(answers[i],p)||[];
    function save(a,message){
      const raw=JSON.stringify(a);answers[i]=raw;
      el.querySelector('.nm-scatter-preview').innerHTML=renderGraph(p,a);
      el.querySelector('.nm-scatter-points').innerHTML=list(a);
      status.textContent=message||count(a);
      x.removeAttribute('aria-invalid');y.removeAttribute('aria-invalid');
      if(onChange)onChange(i,raw);
    }
    function add(){
      const b=bounds(p),inputs=[x,y],ranges=[b.x,b.y];
      for(let j=0;j<2;j++){
        const input=inputs[j],value=input.value.trim(),n=Number(value);
        if(!/^[+-]?\d+$/.test(value)||!Number.isSafeInteger(n)||n<ranges[j][0]||n>ranges[j][1]){
          input.setAttribute('aria-invalid','true');
          status.textContent=tr(`${j?'y':'x'}에 ${ranges[j][0]}부터 ${ranges[j][1]}까지의 정수를 입력하세요.`,`Enter an integer from ${ranges[j][0]} to ${ranges[j][1]} for ${j?'y':'x'}.`,`${j?'y':'x'}请输入${ranges[j][0]}到${ranges[j][1]}之间的整数。`);input.focus();return;
        }
        input.removeAttribute('aria-invalid');
      }
      const a=get(),pt=[Number(x.value),Number(y.value)];
      if(a.some(v=>v[0]===pt[0]&&v[1]===pt[1])){status.textContent=tr('이미 찍은 점이에요. 다른 좌표를 입력하세요.','This point is already plotted. Enter another pair.','这个点已经描过，请输入其他坐标。');x.focus();return;}
      a.push(pt);save(a);x.value='';y.value='';x.focus();
    }
    function click(e){
      const button=e.target.closest('button');if(!button||!el.contains(button))return;
      if(button.hasAttribute('data-scatter-add'))add();
      else if(button.hasAttribute('data-scatter-clear')){save([]);x.focus();}
      else if(button.hasAttribute('data-scatter-remove')){const a=get(),j=Number(button.dataset.scatterRemove);a.splice(j,1);save(a);const next=el.querySelectorAll('[data-scatter-remove]');(next[Math.min(j,next.length-1)]||x).focus();}
    }
    function key(e){if(e.key==='Enter'&&(e.target===x||e.target===y)){e.preventDefault();add();}}
    el.addEventListener('click',click);el.addEventListener('keydown',key);
    el._nmScatterCleanup=()=>{el.removeEventListener('click',click);el.removeEventListener('keydown',key);};
  });
}
window.NM_SCATTER_ANSWER={isPlot,matches,html,bind};
})();
