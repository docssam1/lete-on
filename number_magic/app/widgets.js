(function(){
'use strict';

/* ── shared helpers ── */
function esc(s){
  return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function renderKaTeX(tex){
  if(window.katex){
    try{ return katex.renderToString(tex,{throwOnError:false,displayMode:false}); }
    catch(e){}
  }
  return '<span>'+esc(tex)+'</span>';
}

function buildNumpad(container, cb){
  container.innerHTML='';
  ['1','2','3','4','5','6','7','8','9','del','0','ok'].forEach(k=>{
    const b=document.createElement('button');
    b.className='nm-key'+(k==='ok'?' ok':k==='del'?' del':'');
    b.textContent=k==='del'?'←':k==='ok'?'✓':k;
    b.addEventListener('pointerup',e=>{e.stopPropagation();cb(k);});
    container.appendChild(b);
  });
}

function shake(el){
  if(!el)return;
  el.classList.remove('nm-w-shake');
  void el.offsetWidth;
  el.classList.add('nm-w-shake');
  el.addEventListener('animationend',()=>el.classList.remove('nm-w-shake'),{once:true});
}

function numpadState(screenEl, maxLen){
  let inp='';
  return {
    handle(val){
      if(val==='del'){ inp=inp.slice(0,-1); }
      else if(inp.length<(maxLen||4)){ inp+=val; }
      if(screenEl) screenEl.textContent=inp||' ';
      return inp;
    },
    get(){ return inp; },
    clear(){ inp=''; if(screenEl) screenEl.textContent=' '; }
  };
}

/* ─────────────────────────────────────────
   DISPATCH
───────────────────────────────────────── */
function render(problem, container, onAnswer){
  container.innerHTML='';
  const w=problem.widget||'numpad';
  switch(w){
    case 'cubes':    return renderCubes(problem,container,onAnswer);
    case 'array':    return renderArray(problem,container,onAnswer);
    case 'tenframe': return renderTenframe(problem,container,onAnswer);
    case 'steps':    return renderSteps(problem,container,onAnswer);
    case 'vertical': return renderVertical(problem,container,onAnswer);
    case 'missing':  return renderMissing(problem,container,onAnswer);
    default:         return renderFallback(problem,container,onAnswer);
  }
}

/* ─────────────────────────────────────────
   CUBES  widget:'cubes'
   problem.cubes = {piles:[a,b], moveTo:n}
   Student taps blue cubes to move them into
   orange pile until it reaches moveTo.
───────────────────────────────────────── */
function renderCubes(problem, container, onAnswer){
  const cfg=problem.cubes||{piles:[5,5],moveTo:10};
  const origA=cfg.piles[0]||0;
  const origB=cfg.piles[1]||0;
  const moveTo=cfg.moveTo||10;
  const need=Math.max(0, moveTo-origA);

  let countA=origA;
  let countB=origB;
  let moved=0;

  const root=document.createElement('div');
  root.className='nm-w-cubes';
  root.innerHTML=`
    <div class="nm-w-cubes-header">
      <span class="nm-w-cubes-goal-text">파란 큐브를 옮겨서 <strong>${moveTo}</strong> 만들기!</span>
    </div>
    <div class="nm-w-cubes-stage">
      <div class="nm-w-cubes-col">
        <div class="nm-w-pile-tag">🟠 주황 더미</div>
        <div class="nm-w-pile nm-w-pile-a" id="wcPileA"></div>
        <div class="nm-w-pile-count" id="wcCountA">${countA}</div>
      </div>
      <div class="nm-w-cubes-mid">
        <div class="nm-w-cubes-target-badge">${moveTo}</div>
        <div class="nm-w-cubes-move-info" id="wcMoved">이동: 0 / 필요: ${need}</div>
      </div>
      <div class="nm-w-cubes-col">
        <div class="nm-w-pile-tag">🔵 파란 더미</div>
        <div class="nm-w-pile nm-w-pile-b" id="wcPileB"></div>
        <div class="nm-w-pile-count" id="wcCountB">${countB}</div>
      </div>
    </div>
    <div class="nm-w-cubes-hint" id="wcHint">파란 큐브를 눌러서 옮겨요 👆</div>
    <button class="nm-btn full nm-w-done" id="wcDone" style="display:none">완성! ✓</button>
  `;
  container.appendChild(root);

  function draw(){
    const pA=root.querySelector('#wcPileA');
    const pB=root.querySelector('#wcPileB');
    pA.innerHTML='';
    pB.innerHTML='';

    for(let i=0;i<countA;i++){
      const c=document.createElement('div');
      c.className='nm-w-cube nm-w-cube-a';
      // highlight newly arrived cubes
      if(i>=origA) c.classList.add('nm-w-cube-new');
      pA.appendChild(c);
    }
    for(let i=0;i<countB;i++){
      const c=document.createElement('div');
      c.className='nm-w-cube nm-w-cube-b';
      c.setAttribute('role','button');
      c.setAttribute('tabindex','0');
      c.title='탭해서 옮기기';
      c.addEventListener('pointerup',e=>{e.stopPropagation();moveCube();});
      c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')moveCube();});
      pB.appendChild(c);
    }

    root.querySelector('#wcCountA').textContent=countA;
    root.querySelector('#wcCountB').textContent=countB;
    root.querySelector('#wcMoved').textContent=`이동: ${moved} / 필요: ${need}`;

    const done=root.querySelector('#wcDone');
    const hint=root.querySelector('#wcHint');
    if(countA>=moveTo){
      done.style.display='block';
      hint.textContent=`🎉 ${moveTo} 완성!${countB>0?' 파란 더미에 '+countB+'개 남음':''}`;
      pB.querySelectorAll('.nm-w-cube-b').forEach(c=>c.style.pointerEvents='none');
    }
  }

  function moveCube(){
    if(countB<=0||countA>=moveTo)return;
    countA++;
    countB--;
    moved++;
    draw();
  }

  root.querySelector('#wcDone').addEventListener('pointerup',e=>{
    e.stopPropagation();
    const total=origA+origB;
    onAnswer(problem.answer!=null?problem.answer:total);
  });

  draw();
}

/* ─────────────────────────────────────────
   ARRAY  widget:'array'
   problem.array = {n:12, rows:3}
   Stepper to choose rows; grid reflows.
───────────────────────────────────────── */
const ARRAY_COLORS=['#60a5fa','#34d399','#f97316','#a78bfa','#f472b6','#facc15','#38bdf8','#4ade80'];

function renderArray(problem, container, onAnswer){
  const cfg=problem.array||{n:12};
  const n=cfg.n||12;
  const targetRows=cfg.rows;    // undefined = free exploration
  let rows=targetRows||2;
  if(rows<1)rows=1;
  if(rows>n)rows=n;

  const root=document.createElement('div');
  root.className='nm-w-array';
  root.innerHTML=`
    <div class="nm-w-array-top">
      <span class="nm-w-array-total">큐브 ${n}개</span>
      <div class="nm-w-array-stepper">
        <button class="nm-w-step-btn" id="waDecr" aria-label="줄 줄이기">−</button>
        <span class="nm-w-rows-display">
          <span class="nm-w-rows-val" id="waRows">${rows}</span>
          <span class="nm-w-rows-lbl">줄</span>
        </span>
        <button class="nm-w-step-btn" id="waIncr" aria-label="줄 늘리기">＋</button>
      </div>
    </div>
    <div class="nm-w-array-grid-wrap">
      <div class="nm-w-array-grid" id="waGrid"></div>
      <div class="nm-w-array-rem" id="waRem" style="display:none"></div>
    </div>
    <div class="nm-w-array-eq" id="waEq"></div>
    <button class="nm-btn full" id="waConfirm">확인 ✓</button>
  `;
  container.appendChild(root);

  function update(){
    const cols=Math.floor(n/rows);
    const rem=n%rows;

    const grid=root.querySelector('#waGrid');
    grid.innerHTML='';
    grid.style.gridTemplateColumns=`repeat(${cols}, 1fr)`;

    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const el=document.createElement('div');
        el.className='nm-w-cube nm-w-cube-arr';
        el.style.background=ARRAY_COLORS[r%ARRAY_COLORS.length];
        grid.appendChild(el);
      }
    }

    const remEl=root.querySelector('#waRem');
    if(rem>0){
      remEl.style.display='flex';
      remEl.innerHTML=`<span class="nm-w-rem-label">나머지 ${rem}개</span>`;
      for(let i=0;i<rem;i++){
        const el=document.createElement('div');
        el.className='nm-w-cube nm-w-cube-rem';
        remEl.appendChild(el);
      }
    } else {
      remEl.style.display='none';
    }

    const eq=root.querySelector('#waEq');
    if(rem===0){
      eq.innerHTML=`<span class="nm-w-array-expr">${rows} × ${cols} = <strong>${n}</strong></span>`;
    } else {
      eq.innerHTML=`<span class="nm-w-array-expr">${rows} × ${cols} = ${rows*cols} … 나머지 ${rem}</span>`;
    }
    root.querySelector('#waRows').textContent=rows;
  }

  root.querySelector('#waDecr').addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(rows>1){rows--;update();}
  });
  root.querySelector('#waIncr').addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(rows<n){rows++;update();}
  });
  root.querySelector('#waConfirm').addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(targetRows===undefined||rows===targetRows){
      onAnswer(problem.answer!=null?problem.answer:Math.floor(n/rows));
    } else {
      shake(root.querySelector('#waGrid'));
      const eq=root.querySelector('#waEq');
      const orig=eq.innerHTML;
      eq.innerHTML=`<span class="nm-w-array-wrong">다시 해봐요! 💡</span>`;
      setTimeout(()=>{eq.innerHTML=orig;},900);
    }
  });

  update();
}

/* ─────────────────────────────────────────
   TENFRAME  widget:'tenframe'
   Uses problem.cubes = {piles:[n, 10-n], moveTo:10}
   2×5 frame; tap empty slots to fill.
───────────────────────────────────────── */
function renderTenframe(problem, container, onAnswer){
  const cfg=problem.cubes||{piles:[7,3],moveTo:10};
  const startFilled=cfg.piles[0]||0;
  const target=cfg.moveTo||10;
  let filled=startFilled;

  const root=document.createElement('div');
  root.className='nm-w-tenframe';
  root.innerHTML=`
    <div class="nm-w-tf-goal">빈 칸을 눌러서 <strong>${target}</strong> 만들어요!</div>
    <div class="nm-w-tf-frame" id="wtfFrame"></div>
    <div class="nm-w-tf-count"><span id="wtfFilled">${filled}</span> / ${target}</div>
  `;
  container.appendChild(root);

  let answered=false;

  function draw(){
    const frame=root.querySelector('#wtfFrame');
    frame.innerHTML='';
    for(let i=0;i<target;i++){
      const slot=document.createElement('button');
      slot.className='nm-w-tf-slot';
      if(i<startFilled){
        slot.classList.add('nm-w-tf-orig');
        slot.disabled=true;
        slot.setAttribute('aria-label',`채워진 칸 ${i+1}`);
      } else if(i<filled){
        slot.classList.add('nm-w-tf-new');
        slot.setAttribute('aria-label',`추가된 칸 ${i+1} (탭하면 취소)`);
        slot.addEventListener('pointerup',e=>{
          e.stopPropagation();
          if(!answered){filled=Math.max(startFilled,filled-1);draw();}
        });
      } else {
        slot.classList.add('nm-w-tf-empty');
        slot.setAttribute('aria-label',`빈 칸 ${i+1}`);
        slot.addEventListener('pointerup',e=>{
          e.stopPropagation();
          if(!answered&&filled<target){filled++;draw();}
        });
      }
      frame.appendChild(slot);
    }
    root.querySelector('#wtfFilled').textContent=filled;

    if(filled>=target&&!answered){
      answered=true;
      const added=filled-startFilled;
      root.querySelector('.nm-w-tf-goal').textContent=`🎉 완성! ${startFilled} + ${added} = ${target}`;
      setTimeout(()=>onAnswer(problem.answer!=null?problem.answer:added),500);
    }
  }

  draw();
}

/* ─────────────────────────────────────────
   STEPS  widget:'steps'
   problem.steps = [{tex, blank}, ...]
   Sequential fill-in; numpad for each blank.
───────────────────────────────────────── */
function renderSteps(problem, container, onAnswer){
  const steps=problem.steps||[];
  if(!steps.length){return renderFallback(problem,container,onAnswer);}

  let stepIdx=0;
  let answered=false;

  function show(){
    const s=steps[stepIdx];
    const totalSteps=steps.length;

    // Build progress dots
    const dotHtml=steps.map((_,i)=>`<span class="nm-w-step-dot${i<stepIdx?' done':i===stepIdx?' cur':''}"></span>`).join('');

    // Build history of done steps with answers filled in
    const histHtml=steps.slice(0,stepIdx).map(st=>{
      const filledTex=st.tex.replace(/\\square/g,String(st.blank));
      return `<div class="nm-w-step-card nm-w-step-done">
        <div class="nm-w-step-ktx">${renderKaTeX(filledTex)}</div>
        <span class="nm-w-step-check">✓</span>
      </div>`;
    }).join('');

    const root=document.createElement('div');
    root.className='nm-w-steps';
    root.innerHTML=`
      <div class="nm-w-steps-prog">${dotHtml}</div>
      <div class="nm-w-steps-scroll" id="wsScroll">
        ${histHtml}
        <div class="nm-w-step-card nm-w-step-active" id="wsActive">
          <div class="nm-w-step-ktx">${renderKaTeX(s.tex)}</div>
        </div>
      </div>
      <div class="nm-w-steps-input">
        <div class="nm-numpad-screen" id="wsScreen">&nbsp;</div>
        <div class="nm-numpad" id="wsPad"></div>
        <div class="nm-hint" id="wsHint">숫자를 눌러 □ 칸을 채워요</div>
      </div>
    `;
    container.innerHTML='';
    container.appendChild(root);

    // Scroll history to bottom
    requestAnimationFrame(()=>{
      const sc=root.querySelector('#wsScroll');
      if(sc)sc.scrollTop=sc.scrollHeight;
    });

    const screen=root.querySelector('#wsScreen');
    const hint=root.querySelector('#wsHint');
    const ns=numpadState(screen,3);

    buildNumpad(root.querySelector('#wsPad'),val=>{
      if(val==='ok'){
        const inp=ns.get();
        if(!inp)return;
        if(parseInt(inp,10)===s.blank){
          // correct
          if(!answered){
            stepIdx++;
            if(stepIdx>=totalSteps){
              answered=true;
              const activeCard=root.querySelector('#wsActive');
              if(activeCard){
                const filledTex=s.tex.replace(/\\square/g,String(s.blank));
                activeCard.innerHTML=`<div class="nm-w-step-ktx">${renderKaTeX(filledTex)}</div><span class="nm-w-step-check">✓</span>`;
                activeCard.classList.remove('nm-w-step-active');
                activeCard.classList.add('nm-w-step-done');
              }
              hint.textContent='🎉 완성!';
              setTimeout(()=>onAnswer(problem.answer!=null?problem.answer:s.blank),700);
            } else {
              show();
            }
          }
        } else {
          shake(screen);
          hint.textContent='다시! 💡';
          ns.clear();
          setTimeout(()=>{hint.textContent='숫자를 눌러 □ 칸을 채워요';},1100);
        }
        return;
      }
      ns.handle(val);
    });
  }

  show();
}

/* ─────────────────────────────────────────
   VERTICAL  widget:'vertical'
   Show a + b stacked, student enters answer.
   Simplified v1: numpad for final answer.
───────────────────────────────────────── */
function renderVertical(problem, container, onAnswer){
  const a=problem.a!=null?problem.a:0;
  const b=problem.b!=null?problem.b:0;
  const op=problem.op||'+';
  const opSym=op==='+'?'＋':op==='-'?'－':op==='*'?'×':'÷';

  const aStr=String(Math.abs(a));
  const bStr=String(Math.abs(b));
  const width=Math.max(aStr.length,bStr.length)+1;

  const root=document.createElement('div');
  root.className='nm-w-vertical';
  root.innerHTML=`
    <div class="nm-w-vert-box">
      <div class="nm-w-vert-row nm-w-vert-top">${aStr}</div>
      <div class="nm-w-vert-row nm-w-vert-bot">
        <span class="nm-w-vert-opsym">${opSym}</span>${bStr}
      </div>
      <div class="nm-w-vert-line"></div>
      <div class="nm-w-vert-row nm-w-vert-ans" id="wvAns">?</div>
    </div>
    <div class="nm-numpad-screen" id="wvScreen">&nbsp;</div>
    <div class="nm-numpad" id="wvPad"></div>
    <div class="nm-hint">세로로 계산해요!</div>
  `;
  container.appendChild(root);

  const screen=root.querySelector('#wvScreen');
  const ns=numpadState(screen,5);
  let submitted=false;

  buildNumpad(root.querySelector('#wvPad'),val=>{
    if(submitted)return;
    if(val==='ok'){
      const inp=ns.get();
      if(!inp)return;
      submitted=true;
      root.querySelector('#wvAns').textContent=inp;
      onAnswer(parseInt(inp,10));
      return;
    }
    ns.handle(val);
    root.querySelector('#wvAns').textContent=ns.get()||'?';
  });
}

/* ─────────────────────────────────────────
   MISSING  widget:'missing'
   Show tex with \square; numpad to fill.
───────────────────────────────────────── */
function renderMissing(problem, container, onAnswer){
  const tex=problem.tex||'\\square = ?';

  const root=document.createElement('div');
  root.className='nm-w-missing';
  root.innerHTML=`
    <div class="nm-w-missing-eq">${renderKaTeX(tex)}</div>
    <div class="nm-numpad-screen" id="wmScreen">&nbsp;</div>
    <div class="nm-numpad" id="wmPad"></div>
    <div class="nm-hint">빈 칸에 들어갈 수를 눌러요</div>
  `;
  container.appendChild(root);

  const screen=root.querySelector('#wmScreen');
  const ns=numpadState(screen,4);
  let submitted=false;

  buildNumpad(root.querySelector('#wmPad'),val=>{
    if(submitted)return;
    if(val==='ok'){
      const inp=ns.get();
      if(!inp)return;
      submitted=true;
      onAnswer(parseInt(inp,10));
      return;
    }
    ns.handle(val);
  });
}

/* ─────────────────────────────────────────
   FALLBACK — tex display + numpad
   Used for 'numpad', 'selectPairs' placeholders,
   or any unknown widget type.
───────────────────────────────────────── */
function renderFallback(problem, container, onAnswer){
  const rawTex=problem.tex||'\\square';
  // Show LHS = □ if tex has '='
  let displayTex=rawTex;
  if(rawTex.includes('=')){
    displayTex=rawTex.split('=')[0].trim()+' = \\square';
  }

  const root=document.createElement('div');
  root.className='nm-w-fallback';
  root.innerHTML=`
    <div class="nm-w-fallback-eq">${renderKaTeX(displayTex)}</div>
    <div class="nm-numpad-screen" id="wfScreen">&nbsp;</div>
    <div class="nm-numpad" id="wfPad"></div>
    <div class="nm-hint">숫자를 눌러 답해요</div>
  `;
  container.appendChild(root);

  const screen=root.querySelector('#wfScreen');
  const ns=numpadState(screen,4);
  let submitted=false;

  buildNumpad(root.querySelector('#wfPad'),val=>{
    if(submitted)return;
    if(val==='ok'){
      const inp=ns.get();
      if(!inp)return;
      submitted=true;
      onAnswer(parseInt(inp,10));
      return;
    }
    ns.handle(val);
  });
}

/* ─────────────────────────────────────────
   EXPORT
───────────────────────────────────────── */
window.NM_WIDGETS={
  render,
  renderCubes,
  renderArray,
  renderTenframe,
  renderSteps,
  renderVertical,
  renderMissing,
  // expose helpers for testing
  _buildNumpad:buildNumpad,
  _shake:shake
};

})();
