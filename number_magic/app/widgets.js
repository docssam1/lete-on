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

function buildNumpad(container, cb, opts){
  opts=opts||{};
  container.innerHTML='';
  const keys=opts.decimal
    ?['1','2','3','4','5','6','7','8','9','.','0','del','ok']
    :['1','2','3','4','5','6','7','8','9','del','0','ok'];
  if(opts.decimal)container.classList.add('dec');else container.classList.remove('dec');
  keys.forEach(k=>{
    const b=document.createElement('button');
    b.className='nm-key'+(k==='ok'?' ok':k==='del'?' del':k==='.'?' dot':'');
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
      else if(val==='.'&&inp.includes('.')){ /* 소수점 중복 방지 */ }
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
    case 'missing':      return renderMissing(problem,container,onAnswer);
    case 'selectPairs':  return renderSelectPairs(problem,container,onAnswer);
    case 'tapCount':     return renderTapCount(problem,container,onAnswer);
    case 'tapMake':      return renderTapMake(problem,container,onAnswer);
    case 'numberBond':   return renderNumberBond(problem,container,onAnswer);
    case 'seqFill':      return renderSeqFill(problem,container,onAnswer);
    case 'dotToDot':     return renderDotToDot(problem,container,onAnswer);
    case 'pyramid':      return renderPyramid(problem,container,onAnswer);
    case 'matchLine':    return renderMatchLine(problem,container,onAnswer);
    default:             return renderFallback(problem,container,onAnswer);
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

  function lang(){return(window.S&&window.S.lang)||'ko';}
  function t(ko,en,zh){const l=lang();return l==='en'?en:l==='zh'?zh:ko;}

  function show(){
    const s=steps[stepIdx];
    const totalSteps=steps.length;
    let wrongCount=0;

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
        <div class="nm-w-feedback" id="wsFeedback"></div>
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
    const feedback=root.querySelector('#wsFeedback');
    const decStep=!Number.isInteger(s.blank);
    const ns=numpadState(screen,decStep?6:4);

    function showHintBtn(){
      feedback.innerHTML=`<button class="nm-w-hint-btn">💡 ${t('힌트 보기','Show Hint','查看提示')}</button>`;
      feedback.querySelector('.nm-w-hint-btn').addEventListener('pointerup',e=>{
        e.stopPropagation();
        feedback.innerHTML=`<span class="nm-w-hint-reveal">${t('이 단계 답:','Answer:','答案：')} <b>${s.blank}</b> — ${t('입력해봐!','Type it in!','输入试试！')}</span>`;
      });
    }

    buildNumpad(root.querySelector('#wsPad'),val=>{
      if(val==='ok'){
        const inp=ns.get();
        if(!inp)return;
        if(parseFloat(inp)===s.blank){
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
              feedback.textContent='🎉 '+t('완성!','Done!','完成！');
              feedback.className='nm-w-feedback ok';
              setTimeout(()=>onAnswer(problem.answer!=null?problem.answer:s.blank),700);
            } else {
              show();
            }
          }
        } else {
          wrongCount++;
          shake(screen);
          ns.clear();
          const card=root.querySelector('#wsActive');
          if(card){card.classList.add('nm-w-step-err');setTimeout(()=>card.classList.remove('nm-w-step-err'),600);}
          if(wrongCount>=2){
            showHintBtn();
          } else {
            feedback.className='nm-w-feedback err';
            feedback.textContent=t('틀렸어요! 다시 해봐 💡','Not quite! Try again 💡','不对！再试一次 💡');
            setTimeout(()=>{feedback.className='nm-w-feedback';feedback.textContent='';},1400);
          }
        }
        return;
      }
      ns.handle(val);
    },{decimal:decStep});
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
      onAnswer(parseFloat(inp));
      return;
    }
    ns.handle(val);
    root.querySelector('#wvAns').textContent=ns.get()||'?';
  },{decimal:problem.answer!=null&&!Number.isInteger(problem.answer)});
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
      onAnswer(parseFloat(inp));
      return;
    }
    ns.handle(val);
  },{decimal:problem.answer!=null&&!Number.isInteger(problem.answer)});
}

/* ─────────────────────────────────────────
   SELECT-PAIRS  widget:'selectPairs'
   problem.nums   = [2,3,8,7,4]
   problem.target = 10
   problem.pairCount = 1|2
   problem.answer = total sum (numpad phase)

   Phase 1: Tap two chips that sum to target → both float up green.
            Wrong pair → red shake 600ms then reset.
            Repeat until all pairCount pairs are found.
   Phase 2: Numpad to enter total sum.
───────────────────────────────────────── */
function renderSelectPairs(problem, container, onAnswer){
  const nums=problem.nums||[];
  const target=problem.target||10;
  const pairCount=problem.pairCount||1;

  const chips=nums.map((v,i)=>({id:i,val:v,state:'idle'}));
  let selId=null;
  let foundPairs=0;
  let shaking=false;
  let submitted=false;

  const root=document.createElement('div');
  root.className='nm-sp-wrap';
  const promptText=problem.prompt&&problem.prompt.ko
    ?problem.prompt.ko
    :'합이 '+target+'이 되는 짝을 찾아요!';
  root.innerHTML=`
    <div class="nm-sp-prompt">${esc(promptText)}</div>
    <div class="nm-sp-chips"></div>
    <div class="nm-sp-sum-phase" style="display:none">
      <div class="nm-sp-done-hint">🎉 짝을 모두 찾았어요! 전체 합을 써요.</div>
      <div class="nm-sp-sum-eq"></div>
      <div class="nm-numpad-screen" id="spScreen">&nbsp;</div>
      <div class="nm-numpad" id="spPad"></div>
    </div>
  `;
  container.appendChild(root);

  const chipsEl=root.querySelector('.nm-sp-chips');
  const sumPhase=root.querySelector('.nm-sp-sum-phase');

  function paint(){
    chipsEl.innerHTML='';
    chips.forEach(c=>{
      const el=document.createElement('div');
      el.className='nm-sp-chip'+(c.state==='sel'?' sel':c.state==='paired'?' paired':c.state==='wrong'?' wrong':'');
      el.textContent=c.val;
      el.addEventListener('pointerup',e=>{
        e.stopPropagation();
        if(submitted||shaking)return;
        tap(c.id);
      });
      chipsEl.appendChild(el);
    });
  }

  function tap(id){
    const chip=chips[id];
    if(!chip||chip.state==='paired')return;
    if(selId===null){
      chips[id].state='sel';
      selId=id;
      paint();
    } else if(selId===id){
      chips[id].state='idle';
      selId=null;
      paint();
    } else {
      const a=chips[selId],b=chips[id];
      if(a.val+b.val===target){
        a.state='paired';
        b.state='paired';
        selId=null;
        foundPairs++;
        paint();
        if(foundPairs>=pairCount){
          setTimeout(()=>{sumPhase.style.display='';},350);
        }
      } else {
        a.state='wrong';
        b.state='wrong';
        paint();
        shaking=true;
        setTimeout(()=>{
          a.state='idle';
          b.state='idle';
          selId=null;
          shaking=false;
          paint();
        },600);
      }
    }
  }

  paint();

  root.querySelector('.nm-sp-sum-eq').innerHTML=renderKaTeX(problem.tex||'\\square');
  const screen=root.querySelector('#spScreen');
  const ns=numpadState(screen,4);
  buildNumpad(root.querySelector('#spPad'),val=>{
    if(submitted)return;
    if(val==='ok'){
      const inp=ns.get();
      if(!inp)return;
      submitted=true;
      onAnswer(parseFloat(inp));
      return;
    }
    ns.handle(val);
  });
}

/* ─────────────────────────────────────────
   TAPCOUNT  widget:'tapCount'  (유아 · 수의 나라)
   problem.items = [{e:'🍎',t:true}, ...] 섞인 장면
   대상을 탭하면 순서 배지(1,2,3…)가 찍히며 세어짐 →
   아래 큰 숫자 보기 중 정답 선택. onAnswer(선택값).
───────────────────────────────────────── */
function renderTapCount(problem, container, onAnswer){
  const items=(problem.items||[]).map((it,i)=>({...it,id:i}));
  const answer=problem.answer;
  const step=problem.step||1;   /* 뛰어세기 배지: 10이면 10,20,30… (동전) */
  const marked=[];          /* 탭한 순서대로 id 저장 */
  let lock=false;

  const root=document.createElement('div');
  root.className='nm-tc-wrap';
  root.innerHTML=`
    <div class="nm-tc-scene"></div>
    <div class="nm-tc-counter"><span class="nm-tc-cnt">0</span></div>
    <div class="nm-tc-choices"></div>`;
  container.appendChild(root);

  const scene=root.querySelector('.nm-tc-scene');
  const cnt=root.querySelector('.nm-tc-cnt');

  function paint(){
    scene.innerHTML='';
    items.forEach(it=>{
      const el=document.createElement('button');
      const ord=marked.indexOf(it.id);
      el.className='nm-tc-item'+(ord>=0?' on':'');
      el.innerHTML=`<span class="nm-tc-emoji">${it.e}</span>`+
        (ord>=0?`<span class="nm-tc-ord">${(ord+1)*step}</span>`:'');
      el.addEventListener('pointerup',e=>{
        e.stopPropagation();
        const at=marked.indexOf(it.id);
        if(at>=0)marked.splice(at,1); else marked.push(it.id);
        cnt.textContent=marked.length*step;
        paint();
      });
      scene.appendChild(el);
    });
  }
  paint();

  /* 큰 숫자 보기 3개 (정답 포함, step~9·step 범위) */
  const cand=[answer-2*step,answer-step,answer+step,answer+2*step].filter(n=>n>=step&&n<=9*step&&n!==answer);
  const picks=[answer];
  while(picks.length<3&&cand.length){picks.push(cand.splice(Math.floor(Math.random()*cand.length),1)[0]);}
  picks.sort(()=>Math.random()-.5);
  const ch=root.querySelector('.nm-tc-choices');
  picks.forEach(n=>{
    const b=document.createElement('button');
    b.className='nm-tc-choice';b.textContent=n;
    b.addEventListener('pointerup',e=>{
      e.stopPropagation();
      if(lock)return;
      lock=true;setTimeout(()=>{lock=false;},700);
      if(n!==answer)shake(b);
      onAnswer(n);
    });
    ch.appendChild(b);
  });
}

/* ─────────────────────────────────────────
   TAPMAKE  widget:'tapMake'  (유아 · 수의 나라)
   problem.target 만큼 판을 탭해 이모지를 만든 뒤
   "다 됐어요!" 버튼으로 제출. 스탬프 탭 = 지우기.
   onAnswer(현재 개수).
───────────────────────────────────────── */
function renderTapMake(problem, container, onAnswer){
  const em=problem.emoji||'⭐';
  const target=problem.target||3;
  let stamps=0, lock=false;

  const root=document.createElement('div');
  root.className='nm-tm-wrap';
  root.innerHTML=`
    <div class="nm-tm-goal"><span class="nm-tm-goal-em">${em}</span><span class="nm-tm-goal-x">×</span><span class="nm-tm-goal-n">${target}</span></div>
    <div class="nm-tm-board"></div>
    <div class="nm-tm-counter"><span class="nm-tm-cnt">0</span></div>
    <button class="nm-tm-done">✔</button>`;
  container.appendChild(root);

  const board=root.querySelector('.nm-tm-board');
  const cnt=root.querySelector('.nm-tm-cnt');

  board.addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(e.target.classList.contains('nm-tm-stamp')){   /* 스탬프 탭 = 지우기 */
      e.target.remove();stamps--;cnt.textContent=stamps;return;
    }
    if(stamps>=12)return;                              /* 판이 꽉 참 */
    const s=document.createElement('span');
    s.className='nm-tm-stamp';s.textContent=em;
    board.appendChild(s);stamps++;cnt.textContent=stamps;
  });

  root.querySelector('.nm-tm-done').addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(lock||stamps===0)return;
    lock=true;setTimeout(()=>{lock=false;},700);
    if(stamps!==target)shake(board);
    onAnswer(stamps);
  });
}

/* ─────────────────────────────────────────
   NUMBERBOND  widget:'numberBond'  (유아 · 수의 나라)
   모으기·가르기 트리 — 위 원(전체) + 아래 원 2개(부분).
   dir:'join'  아래 두 원 제시 → 위 원을 톡톡 채움
   dir:'split' 위 원+왼쪽 원 제시 → 오른쪽 원을 톡톡 채움
   빈 원 탭 = 이모지 추가, 채운 이모지 탭 = 지우기, ✔ = 제출.
   onAnswer(채운 개수). 0도 정답이 될 수 있음(0 개념).
───────────────────────────────────────── */
function renderNumberBond(problem, container, onAnswer){
  const em=problem.emoji||'🍬';
  const dir=problem.dir||'split';
  let fill=0, lock=false;

  /* 알려진 원 내용: 이모지 나열 + 숫자 (0이면 숫자만) */
  const known=n=>`<div class="nm-nb-dots">${em.repeat(n)}</div><div class="nm-nb-num">${n}</div>`;
  const askHtml=`<div class="nm-nb-dots" id="nbAskDots"></div><div class="nm-nb-num ask" id="nbAskNum">?</div>`;

  const top   = dir==='join' ? askHtml : known(problem.whole);
  const left  = dir==='join' ? known(problem.a) : known(problem.a);
  const right = dir==='join' ? known(problem.b) : askHtml;
  const topAsk=dir==='join';

  const root=document.createElement('div');
  root.className='nm-nb-wrap';
  root.innerHTML=`
    <div class="nm-nb-tree">
      <div class="nm-nb-node top ${topAsk?'ask':''}" data-ask="${topAsk?'1':''}">${top}</div>
      <svg class="nm-nb-links" viewBox="0 0 120 26" aria-hidden="true">
        <line x1="60" y1="2" x2="28" y2="24"/><line x1="60" y1="2" x2="92" y2="24"/>
      </svg>
      <div class="nm-nb-row">
        <div class="nm-nb-node">${left}</div>
        <div class="nm-nb-node ${topAsk?'':'ask'}" data-ask="${topAsk?'':'1'}">${right}</div>
      </div>
    </div>
    <button class="nm-nb-done">✔</button>`;
  container.appendChild(root);

  const askNode=root.querySelector('[data-ask="1"]');
  const askDots=root.querySelector('#nbAskDots');
  const askNum=root.querySelector('#nbAskNum');

  askNode.addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(e.target.classList.contains('nm-nb-fill')){   /* 채운 이모지 탭 = 지우기 */
      e.target.remove();fill--;askNum.textContent=fill;return;
    }
    if(fill>=9)return;
    const s=document.createElement('span');
    s.className='nm-nb-fill';s.textContent=em;
    askDots.appendChild(s);fill++;askNum.textContent=fill;
  });

  root.querySelector('.nm-nb-done').addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(lock)return;
    lock=true;setTimeout(()=>{lock=false;},700);
    if(fill!==problem.answer)shake(askNode);
    onAnswer(fill);
  });
}

/* ─────────────────────────────────────────
   SEQFILL  widget:'seqFill'  (유아 · 수의 나라)
   problem.seq = [3,4,5,6,7], problem.blank = 빈 칸 index
   수열 칩 한 줄 + 빈 칩, 아래 큰 숫자 보기 3개.
   onAnswer(선택값).
───────────────────────────────────────── */
function renderSeqFill(problem, container, onAnswer){
  const seq=problem.seq||[];
  const blank=problem.blank||1;
  const answer=problem.answer;
  let lock=false;

  const root=document.createElement('div');
  root.className='nm-sf-wrap';
  root.innerHTML=`<div class="nm-sf-row"></div><div class="nm-sf-choices"></div>`;
  container.appendChild(root);

  const row=root.querySelector('.nm-sf-row');
  seq.forEach((v,i)=>{
    const c=document.createElement('div');
    if(i===blank){c.className='nm-sf-chip blank';c.id='sfBlank';c.textContent='?';}
    else{c.className='nm-sf-chip';c.textContent=v;}
    row.appendChild(c);
    if(i<seq.length-1){
      const a=document.createElement('span');a.className='nm-sf-arr';a.textContent='→';
      row.appendChild(a);
    }
  });

  /* 보기 3개: 정답 + 이웃 수 함정 */
  const step=seq.length>1?seq[1]-seq[0]:1;
  const cand=[answer-step,answer+step,answer-1,answer+1].filter(n=>n>=0&&n<=20&&n!==answer);
  const uniq=[...new Set(cand)];
  const picks=[answer];
  while(picks.length<3&&uniq.length){picks.push(uniq.splice(Math.floor(Math.random()*uniq.length),1)[0]);}
  picks.sort(()=>Math.random()-.5);

  const ch=root.querySelector('.nm-sf-choices');
  picks.forEach(n=>{
    const b=document.createElement('button');
    b.className='nm-tc-choice';b.textContent=n;
    b.addEventListener('pointerup',e=>{
      e.stopPropagation();
      if(lock)return;
      lock=true;setTimeout(()=>{lock=false;},700);
      if(n===answer){const bl=root.querySelector('#sfBlank');if(bl){bl.textContent=n;bl.classList.add('found');}}
      else shake(b);
      onAnswer(n);
    });
    ch.appendChild(b);
  });
}

/* ─────────────────────────────────────────
   DOTTODOT  widget:'dotToDot'  (유아 · 수의 나라)
   problem.pts = [[x,y]...] (0~100), problem.close = 마지막→첫 점 닫기
   1부터 차례로 점을 탭 — 맞으면 선이 그어지고, 틀리면 흔들림.
   전부 이으면 자동 제출 onAnswer(problem.answer).
───────────────────────────────────────── */
function renderDotToDot(problem, container, onAnswer){
  const pts=problem.pts||[];
  const close=!!problem.close;
  let next=0, done=false;
  const NS='http://www.w3.org/2000/svg';

  const root=document.createElement('div');
  root.className='nm-dd-wrap';
  root.innerHTML=`<svg class="nm-dd-svg" viewBox="0 0 100 100"><g id="ddLines"></g><g id="ddDots"></g></svg>
    <div class="nm-dd-hint">1️⃣ 부터 차례대로!</div>`;
  container.appendChild(root);

  const lines=root.querySelector('#ddLines');
  const dots=root.querySelector('#ddDots');

  function drawLine(a,b){
    const l=document.createElementNS(NS,'line');
    l.setAttribute('x1',a[0]);l.setAttribute('y1',a[1]);
    l.setAttribute('x2',b[0]);l.setAttribute('y2',b[1]);
    lines.appendChild(l);
  }

  pts.forEach((p,i)=>{
    const g=document.createElementNS(NS,'g');
    g.setAttribute('class','nm-dd-dot');
    const hit=document.createElementNS(NS,'circle');   /* 큰 투명 히트존 */
    hit.setAttribute('cx',p[0]);hit.setAttribute('cy',p[1]);hit.setAttribute('r',11);
    hit.setAttribute('class','nm-dd-hit');
    const c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r',6.5);
    const t=document.createElementNS(NS,'text');
    t.setAttribute('x',p[0]);t.setAttribute('y',p[1]);
    t.textContent=i+1;
    g.appendChild(hit);g.appendChild(c);g.appendChild(t);
    g.addEventListener('pointerup',e=>{
      e.stopPropagation();
      if(done)return;
      if(i===next){
        g.classList.add('on');
        if(next>0)drawLine(pts[next-1],pts[next]);
        next++;
        if(next>=pts.length){
          done=true;
          if(close)drawLine(pts[pts.length-1],pts[0]);
          root.querySelector('.nm-dd-hint').textContent='🎉 완성!';
          setTimeout(()=>onAnswer(problem.answer!=null?problem.answer:pts.length),600);
        }
      }else{
        g.classList.add('no');
        setTimeout(()=>g.classList.remove('no'),450);
      }
    });
    dots.appendChild(g);
  });
}

/* ─────────────────────────────────────────
   PYRAMID  widget:'pyramid'  (유아 · 수의 나라)
   problem.rows = [[top],[m1,m2],[a,b,c]] — 빈 칸은 null
   이웃 두 돌의 합 = 위 돌. 아래 큰 숫자 보기 3개로 답 선택.
   onAnswer(선택값).
───────────────────────────────────────── */
function renderPyramid(problem, container, onAnswer){
  const rows=problem.rows||[[null],[1,1],[1,1,1]];
  const answer=problem.answer;
  let lock=false;

  const root=document.createElement('div');
  root.className='nm-py-wrap';
  root.innerHTML=`<div class="nm-py-tower"></div><div class="nm-py-choices"></div>`;
  container.appendChild(root);

  const tower=root.querySelector('.nm-py-tower');
  rows.forEach(row=>{
    const r=document.createElement('div');r.className='nm-py-row';
    row.forEach(v=>{
      const c=document.createElement('div');
      if(v===null){c.className='nm-py-cell ask';c.id='pyAsk';c.textContent='?';}
      else{c.className='nm-py-cell';c.textContent=v;}
      r.appendChild(c);
    });
    tower.appendChild(r);
  });

  const cand=[answer-2,answer-1,answer+1,answer+2].filter(n=>n>=1&&n<=9&&n!==answer);
  const picks=[answer];
  while(picks.length<3&&cand.length){picks.push(cand.splice(Math.floor(Math.random()*cand.length),1)[0]);}
  picks.sort(()=>Math.random()-.5);

  const ch=root.querySelector('.nm-py-choices');
  picks.forEach(n=>{
    const b=document.createElement('button');
    b.className='nm-tc-choice';b.textContent=n;
    b.addEventListener('pointerup',e=>{
      e.stopPropagation();
      if(lock)return;
      lock=true;setTimeout(()=>{lock=false;},700);
      if(n===answer){const a=root.querySelector('#pyAsk');if(a){a.textContent=n;a.classList.add('found');}}
      else shake(b);
      onAnswer(n);
    });
    ch.appendChild(b);
  });
}

/* ─────────────────────────────────────────
   MATCHLINE  widget:'matchLine'  (유아 · 수의 나라)
   problem.left  = 숫자 배열(셔플), problem.right = 점 그림 수 배열(셔플)
   왼쪽 숫자 카드 탭 → 선택(금색), 오른쪽 점 그림 카드 탭 → 짝 맞추기.
   맞으면 초록 선 + matched, 틀리면 shake. 전부 맞으면 onAnswer(N).
───────────────────────────────────────── */
function renderMatchLine(problem, container, onAnswer){
  const left  = problem.left  || [];
  const right = problem.right || [];
  const N     = left.length;
  let selL    = -1;
  const matchedL = new Set();
  const matchedR = new Set();
  let remaining  = N;

  /* 1~9 점 배치 (viewBox 0~60) */
  const DOT_POS = {
    1:[[30,30]],
    2:[[18,30],[42,30]],
    3:[[18,20],[42,20],[30,44]],
    4:[[18,18],[42,18],[18,42],[42,42]],
    5:[[18,18],[42,18],[30,30],[18,42],[42,42]],
    6:[[18,14],[42,14],[18,30],[42,30],[18,46],[42,46]],
    7:[[18,12],[42,12],[18,26],[42,26],[18,40],[42,40],[30,52]],
    8:[[14,12],[30,12],[46,12],[14,28],[46,28],[14,44],[30,44],[46,44]],
    9:[[14,12],[30,12],[46,12],[14,28],[30,28],[46,28],[14,44],[30,44],[46,44]]
  };
  function dotSvg(n){
    const pts = DOT_POS[n] || DOT_POS[1];
    const circles = pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" fill="currentColor"/>`).join('');
    return `<svg viewBox="0 0 60 60" class="nm-ml-dots" aria-hidden="true">${circles}</svg>`;
  }

  const root = document.createElement('div');
  root.className = 'nm-ml-wrap';
  const arena = document.createElement('div');
  arena.className = 'nm-ml-arena';
  root.appendChild(arena);
  container.appendChild(root);

  /* SVG 오버레이 — 연결선 그리기 */
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.className = 'nm-ml-lines';
  arena.appendChild(svg);

  /* 왼쪽: 숫자 카드 */
  const colL = document.createElement('div');
  colL.className = 'nm-ml-col';
  left.forEach((num, i)=>{
    const card = document.createElement('button');
    card.className = 'nm-ml-card nm-ml-num';
    card.textContent = num;
    card.addEventListener('pointerup', e=>{
      e.stopPropagation();
      if(matchedL.has(i)) return;
      if(selL === i){ selL=-1; card.classList.remove('sel'); return; }
      colL.querySelectorAll('.nm-ml-card').forEach(c=>c.classList.remove('sel'));
      selL = i;
      card.classList.add('sel');
    });
    colL.appendChild(card);
  });
  arena.appendChild(colL);

  /* 오른쪽: 점 그림 카드 */
  const colR = document.createElement('div');
  colR.className = 'nm-ml-col';
  right.forEach((num, j)=>{
    const card = document.createElement('button');
    card.className = 'nm-ml-card nm-ml-dot';
    card.innerHTML = dotSvg(num);
    card.addEventListener('pointerup', e=>{
      e.stopPropagation();
      if(matchedR.has(j)) return;
      if(selL === -1) return;
      if(left[selL] === num){
        const lCard = colL.children[selL];
        lCard.classList.remove('sel');
        lCard.classList.add('matched');
        card.classList.add('matched');
        matchedL.add(selL);
        matchedR.add(j);
        drawLine(selL, j);
        selL = -1;
        remaining--;
        if(remaining === 0) setTimeout(()=>onAnswer(N), 600);
      } else {
        shake(colL.children[selL]);
        shake(card);
      }
    });
    colR.appendChild(card);
  });
  arena.appendChild(colR);

  function drawLine(li, ri){
    const ar = arena.getBoundingClientRect();
    const lR = colL.children[li].getBoundingClientRect();
    const rR = colR.children[ri].getBoundingClientRect();
    const aw = ar.width, ah = ar.height;
    svg.setAttribute('viewBox',`0 0 ${aw} ${ah}`);
    svg.setAttribute('width', aw);
    svg.setAttribute('height', ah);
    const x1 = lR.right  - ar.left;
    const y1 = lR.top    + lR.height/2 - ar.top;
    const x2 = rR.left   - ar.left;
    const y2 = rR.top    + rR.height/2 - ar.top;
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1',x1); line.setAttribute('y1',y1);
    line.setAttribute('x2',x2); line.setAttribute('y2',y2);
    line.setAttribute('class','nm-ml-line');
    svg.appendChild(line);
  }
}

/* ─────────────────────────────────────────
   FALLBACK — tex display + numpad
   Used for 'numpad' or any unknown widget type.
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
      onAnswer(parseFloat(inp));
      return;
    }
    ns.handle(val);
  },{decimal:problem.answer!=null&&!Number.isInteger(problem.answer)});
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
  renderSelectPairs,
  renderTapCount,
  renderTapMake,
  renderNumberBond,
  renderSeqFill,
  renderDotToDot,
  renderPyramid,
  renderMatchLine,
  // expose helpers for testing
  _buildNumpad:buildNumpad,
  _shake:shake
};

})();
