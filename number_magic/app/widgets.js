(function(){
'use strict';

/* ── shared helpers ── */
function esc(s){
  return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

/* it.e / problem.emoji 등에 담긴 문자열을 그린다.
   'animal:kind' 형태면 NM_ANIMALS(animal-art.js, widgets.js보다 먼저 로드)의
   SVG로, 그 외엔 기존처럼 이모지 문자 그대로. 비동물 이모지 경로는 절대 안 건드림.
   반환값은 innerHTML로 삽입 가능한 HTML 문자열(플레인 이모지도 안전하게 escape). */
function art(e){
  if(typeof e==='string'&&e.indexOf('animal:')===0){
    var kind=e.slice(7);
    if(window.NM_ANIMALS&&typeof window.NM_ANIMALS.svg==='function'){
      var svg=window.NM_ANIMALS.svg(kind);
      if(svg) return '<span class="nm-art-animal">'+svg+'</span>';
    }
  }
  return esc(e);
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
  const keys=opts.decimal&&opts.negative
    ?['1','2','3','4','5','6','7','8','9','.','-','0','del','ok']
    :opts.decimal
    ?['1','2','3','4','5','6','7','8','9','.','0','del','ok']
    :opts.negative
    ?['1','2','3','4','5','6','7','8','9','-','0','del','ok']
    :['1','2','3','4','5','6','7','8','9','del','0','ok'];
  /* 소수·음수 어느 쪽이든 4열 레이아웃(기존 .dec CSS 재사용 — 13~14키가 3열에 안 맞음) */
  if(opts.decimal||opts.negative)container.classList.add('dec');else container.classList.remove('dec');
  keys.forEach(k=>{
    const b=document.createElement('button');
    b.className='nm-key'+(k==='ok'?' ok':k==='del'?' del':k==='.'?' dot':k==='-'?' neg':'');
    b.textContent=k==='del'?'←':k==='ok'?'✓':k==='-'?'−':k;
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
      else if(val==='-'){ inp=inp===''?'-':(inp==='-'?'':inp); /* 선두 - 1회만: 빈칸→'-', '-'→취소 */ }
      else if(val==='.'&&inp.includes('.')){ /* 소수점 중복 방지 */ }
      else if(inp.replace('-','').length<(maxLen||4)){ inp+=val; }
      if(screenEl) screenEl.textContent=inp||' ';
      return inp;
    },
    get(){ return inp; },
    clear(){ inp=''; if(screenEl) screenEl.textContent=' '; }
  };
}

/* ── 다칸 답(배열 answer) 화면 HTML — 가로 나열(shape 없음) 또는 분수 모양 ──
   shape:'fraction' → 분자 박스(0) / 가로줄 / 분모 박스(1), 채움 순서 분자→분모.
   shape:'mixed'    → 자연수 박스(0) 왼쪽 + 분수 스택(분자 1 / 가로줄 / 분모 2) 오른쪽.
   shape 없음(undefined) → 기존 콤마 나열("77, 41").
   widgets.js(multiPadState)·main.js(multiScreenHtml) 양쪽이 이 한 함수를 공유해
   두 렌더 경로의 모양이 갈라지지 않게 한다. */
function multiBoxesHtml(vals, focus, shape){
  const box=i=>`<span class="nm-ans-box${i===focus?' cur':''}" data-i="${i}">${vals[i]!==''?esc(vals[i]):'?'}</span>`;
  if(shape==='fraction'){
    return `<span class="nm-frac">${box(0)}<span class="nm-frac-bar"></span>${box(1)}</span>`;
  }
  if(shape==='mixed'){
    return `<span class="nm-mixed">${box(0)}<span class="nm-frac">${box(1)}<span class="nm-frac-bar"></span>${box(2)}</span></span>`;
  }
  /* 2×2 행렬 — 가로 나열(a, b, c, d) 대신 실제 행렬 모양으로.
     칸 순서는 행 우선(a11,a12,a21,a22)이라 문제 tex의 pmatrix와 같다. */
  if(shape==='matrix2'&&vals.length===4){
    return `<span class="nm-mat2"><span class="nm-mat2-br left"></span>`+
      `<span class="nm-mat2-grid">${box(0)}${box(1)}${box(2)}${box(3)}</span>`+
      `<span class="nm-mat2-br right"></span></span>`;
  }
  return vals.map((_,i)=>box(i)).join('<span class="nm-ans-sep">,</span>');
}

/* ── 다칸 답(배열 answer) 공용 상태 — numpad 화면에 답칸 N개, 탭으로 포커스 이동 ──
   answerArr: 정답 배열(길이 N). shape: problem.answerShape('fraction'|'mixed'|undefined).
   screenEl에 칸을 렌더링, buildNumpad 콜백에서 handle(val) 호출.
   ok 판정은 호출부가 isFull()/equals()로 확인. */
function multiPadState(screenEl, answerArr, shape){
  const n=answerArr.length;
  let vals=new Array(n).fill('');
  let focus=0;
  function paint(){
    if(!screenEl)return;
    screenEl.classList.add('nm-multi');
    screenEl.classList.toggle('nm-multi-shape', !!shape);
    const lg=(window.S&&window.S.lang)||'ko';
    /* 칸이 3개 이상이면(행렬·삼차식 계수 등) 이동 방법을 명시 — 자동 이동은 답 자릿수를
       흘리므로 하지 않는다. 눌러서 옮기는 방식임을 한 줄로 안내. */
    const hint=n>=3?`<span class="nm-multi-hint">${lg==='en'?'Tap a box to move':lg==='zh'?'点击方格切换':'칸을 눌러 옮겨요'}</span>`:'';
    screenEl.innerHTML=multiBoxesHtml(vals,focus,shape)+hint;
    screenEl.querySelectorAll('.nm-ans-box').forEach(b=>{
      b.addEventListener('pointerup',e=>{e.stopPropagation();focus=+b.dataset.i;paint();});
    });
  }
  paint();
  return {
    handle(val){
      let cur=vals[focus];
      if(val==='del'){ cur=''; }
      else if(val==='-'){ cur=cur===''?'-':(cur==='-'?'':cur); }
      else if(val==='.'){ if(!cur.includes('.'))cur+='.'; }
      else if(cur.replace('-','').length<6){ cur+=val; }
      vals[focus]=cur;
      paint();
    },
    isFull(){ return vals.every(v=>v!==''&&v!=='-'); },
    values(){ return vals.slice(); },
    equals(){ return vals.length===n&&vals.every((v,i)=>parseFloat(v)===answerArr[i]); },
    clear(){ vals=new Array(n).fill('');focus=0;paint(); },
    shake(){ shake(screenEl); }
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
    case 'gridPaint':    return renderGridPaint(problem,container,onAnswer);
    case 'storyCard':    return renderStoryCard(problem,container,onAnswer);
    case 'balanceScale': return renderBalanceScale(problem,container,onAnswer);
    case 'numberMachine':return renderNumberMachine(problem,container,onAnswer);
    case 'crossSum':     return renderCrossSum(problem,container,onAnswer);
    case 'sortBasket':   return renderSortBasket(problem,container,onAnswer);
    case 'tallyBuild':   return renderTallyBuild(problem,container,onAnswer);
    case 'numline':      return renderNumline(problem,container,onAnswer);
    case 'base10':       return renderBase10(problem,container,onAnswer);
    case 'compareSteps': return renderCompareSteps(problem,container,onAnswer);
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
    },{decimal:decStep,negative:s.blank<0||!!s.negative||!!problem.negative});
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
  },{decimal:problem.answer!=null&&!Number.isInteger(problem.answer),negative:!!problem.negative});
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
  },{decimal:problem.answer!=null&&!Number.isInteger(problem.answer),negative:!!problem.negative});
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
      el.innerHTML=`<span class="nm-tc-emoji">${art(it.e)}</span>`+
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
    <div class="nm-tm-goal"><span class="nm-tm-goal-em">${art(em)}</span><span class="nm-tm-goal-x">×</span><span class="nm-tm-goal-n">${target}</span></div>
    <div class="nm-tm-board"></div>
    <div class="nm-tm-counter"><span class="nm-tm-cnt">0</span></div>
    <button class="nm-tm-done">✔</button>`;
  container.appendChild(root);

  const board=root.querySelector('.nm-tm-board');
  const cnt=root.querySelector('.nm-tm-cnt');

  board.addEventListener('pointerup',e=>{
    e.stopPropagation();
    const hitStamp=e.target.closest('.nm-tm-stamp');   /* 스탬프(또는 그 안 SVG) 탭 = 지우기 */
    if(hitStamp&&board.contains(hitStamp)){
      hitStamp.remove();stamps--;cnt.textContent=stamps;return;
    }
    if(stamps>=12)return;                              /* 판이 꽉 참 */
    const s=document.createElement('span');
    s.className='nm-tm-stamp';s.innerHTML=art(em);
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
  const known=n=>`<div class="nm-nb-dots">${art(em).repeat(n)}</div><div class="nm-nb-num">${n}</div>`;
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
    const hitFill=e.target.closest('.nm-nb-fill');   /* 채운 이모지(또는 그 안 SVG) 탭 = 지우기 */
    if(hitFill&&askDots.contains(hitFill)){
      hitFill.remove();fill--;askNum.textContent=fill;return;
    }
    if(fill>=9)return;
    const s=document.createElement('span');
    s.className='nm-nb-fill';s.innerHTML=art(em);
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

  /* 탤리(산가지) 그림: 4개 세로줄 + 5번째는 대각선으로 묶음 */
  function tallySvg(n){
    const groups = Math.floor(n/5), rem = n%5, spacing = 6.2;
    let slot = 0;
    const lines = [];
    for(let g=0; g<groups; g++){
      const startSlot = slot;
      for(let i=0;i<4;i++){ const x=5+slot*spacing; lines.push(`<line x1="${x}" y1="10" x2="${x}" y2="50"/>`); slot++; }
      const x1=5+startSlot*spacing, x2=5+(slot-1)*spacing;
      lines.push(`<line x1="${x1}" y1="50" x2="${x2}" y2="10"/>`);
    }
    for(let i=0;i<rem;i++){ const x=5+slot*spacing; lines.push(`<line x1="${x}" y1="10" x2="${x}" y2="50"/>`); slot++; }
    return `<svg viewBox="0 0 60 60" class="nm-ml-tally" aria-hidden="true">${lines.join('')}</svg>`;
  }
  const rightSvg = problem.rightType === 'tally' ? tallySvg : dotSvg;

  const root = document.createElement('div');
  root.className = 'nm-ml-wrap';
  const arena = document.createElement('div');
  arena.className = 'nm-ml-arena';
  root.appendChild(arena);
  container.appendChild(root);

  /* SVG 오버레이 — 연결선 그리기 */
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('class', 'nm-ml-lines');
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
    card.innerHTML = rightSvg(num);
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
    /* 유아 리딩앱 레퍼런스처럼 굵은 곡선 점선으로 연결(직선 대신 아래로 살짝 활 모양) */
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', `M ${x1} ${y1} Q ${mx} ${my + 18} ${x2} ${y2}`);
    path.setAttribute('class','nm-ml-line');
    svg.appendChild(path);
  }
}

/* ─────────────────────────────────────────
   GRIDPAINT  widget:'gridPaint'  (유아 · 수의 나라)
   problem.gridMode:
     'single' — 서수 위치 콕 짚기. 한 칸 탭 = 즉시 판정(onAnswer(index)).
                dir:'left'|'right' 방향 화살표 표시.
     'count'  — 정확히 target개만 칠하기. 탭=토글, ✔ 로 제출(onAnswer(칠한 개수)).
───────────────────────────────────────── */
function renderGridPaint(problem, container, onAnswer){
  const total = problem.total || 6;
  const mode  = problem.gridMode || 'count';
  let lock=false;

  const root=document.createElement('div');
  root.className='nm-gp-wrap';
  if(mode==='count'){
    const goal=document.createElement('div');
    goal.className='nm-gp-goal';
    goal.innerHTML=`🎯 <span class="nm-gp-goal-n">${problem.target}</span>`;
    root.appendChild(goal);
  }
  const line=document.createElement('div');
  line.className='nm-gp-rowline';
  if(mode==='single' && problem.dir==='left'){
    const a=document.createElement('span');a.className='nm-gp-arrow';a.textContent='👉';line.appendChild(a);
  }
  const row=document.createElement('div');
  // 서수(single) 모드는 "왼쪽에서 몇째"가 의미를 가지므로 절대 줄바꿈되면 안 됨 → 한 줄 고정
  row.className='nm-gp-row'+(mode==='single'?' oneline':'');
  line.appendChild(row);
  if(mode==='single' && problem.dir==='right'){
    const a=document.createElement('span');a.className='nm-gp-arrow flip';a.textContent='👈';line.appendChild(a);
  }
  root.appendChild(line);
  container.appendChild(root);

  const cells=[];
  for(let i=0;i<total;i++){
    const c=document.createElement('button');
    c.className='nm-gp-cell';
    row.appendChild(c);
    cells.push(c);
  }

  if(mode==='single'){
    cells.forEach((c,i)=>{
      c.addEventListener('pointerup',e=>{
        e.stopPropagation();
        if(lock)return;
        lock=true;setTimeout(()=>{lock=false;},700);
        if(i===problem.targetIndex) c.classList.add('on');
        else shake(c);
        onAnswer(i);
      });
    });
    return;
  }

  /* count mode */
  let painted=0;
  const foot=document.createElement('div');
  foot.className='nm-gp-counter';
  foot.innerHTML='<span class="nm-gp-cnt">0</span>';
  root.appendChild(foot);
  const done=document.createElement('button');
  done.className='nm-gp-done';done.textContent='✔';
  root.appendChild(done);

  const cnt=foot.querySelector('.nm-gp-cnt');
  cells.forEach(c=>{
    c.addEventListener('pointerup',e=>{
      e.stopPropagation();
      if(c.classList.contains('on')){ c.classList.remove('on'); painted--; }
      else{ c.classList.add('on'); painted++; }
      cnt.textContent=painted;
    });
  });

  done.addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(lock||painted===0)return;
    lock=true;setTimeout(()=>{lock=false;},700);
    if(painted!==problem.target) shake(row);
    onAnswer(painted);
  });
}

/* ─────────────────────────────────────────
   STORYCARD  widget:'storyCard'  (유아 · 수의 나라 · 생활 서수 문장제)
   problem.interaction:
     'tap'    — problem.layout:'row'. problem.chars(이모지 배열) 한 줄 표시.
                한 칸 탭 = 즉시 판정(onAnswer(index)), targetIndex 정답.
     'numpad' — problem.layout:'stairs'. 계단(세로) 중 problem.mark번째(0-base,
                아래부터)에 problem.emoji 캐릭터. 숫자패드로 답 입력(onAnswer(number)).
   🔊 다시 듣기 버튼 — window.NM_SAY/NM_L(main.js에서 노출)로 problem.prompt 재낭독.
   유아는 글을 못 읽으므로 문장을 몇 번이고 다시 들을 수 있어야 함.
───────────────────────────────────────── */
function renderStoryCard(problem, container, onAnswer){
  const total       = problem.total || 6;
  const interaction = problem.interaction || 'tap';
  const layout      = problem.layout || 'row';
  let lock=false;

  const root=document.createElement('div');
  root.className='nm-sc-wrap';

  const replay=document.createElement('button');
  replay.className='nm-sc-replay';
  replay.textContent='🔊';
  replay.addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(window.NM_SAY&&window.NM_L) window.NM_SAY(window.NM_L(problem.prompt));
  });
  root.appendChild(replay);

  const scene=document.createElement('div');
  scene.className='nm-sc-scene '+(layout==='stairs'?'nm-sc-stairs':'nm-sc-row');
  root.appendChild(scene);

  if(layout==='stairs'){
    /* 왼쪽(낮음)→오른쪽(높음)으로 오르는 계단 옆모습. i=0이 아래(왼쪽) 첫 계단.
       세로로 쌓지 않고 가로로 배치해 화면 높이를 적게 차지함(스크롤 없는 고정 화면 요건). */
    for(let i=0;i<total;i++){
      const col=document.createElement('div');
      col.className='nm-sc-stairq';
      if(i===problem.mark){
        const em=document.createElement('div');
        em.className='nm-sc-stairq-em';
        em.innerHTML=art(problem.emoji||'🐿️');
        col.appendChild(em);
      }
      const bar=document.createElement('div');
      bar.className='nm-sc-stairq-bar'+(i===problem.mark?' has':'');
      bar.style.height=(10+i*6)+'px';
      col.appendChild(bar);
      scene.appendChild(col);
    }
  }else{
    const chars=problem.chars||[];
    chars.forEach((em,i)=>{
      const c=document.createElement('button');
      c.className='nm-sc-char';
      c.innerHTML=art(em);
      if(interaction==='tap'){
        c.addEventListener('pointerup',e=>{
          e.stopPropagation();
          if(lock)return;
          lock=true;setTimeout(()=>{lock=false;},700);
          if(i===problem.targetIndex) c.classList.add('on');
          else shake(c);
          onAnswer(i);
        });
      }else{
        c.disabled=true;
      }
      scene.appendChild(c);
    });
  }
  container.appendChild(root);

  if(interaction==='numpad'){
    const screen=document.createElement('div');
    screen.className='nm-numpad-screen nm-sc-screen';screen.innerHTML='&nbsp;';
    root.appendChild(screen);
    const pad=document.createElement('div');
    pad.className='nm-numpad nm-sc-pad';
    root.appendChild(pad);
    const ns=numpadState(screen,2);
    buildNumpad(pad,val=>{
      if(lock)return;
      if(val==='ok'){
        const inp=ns.get();
        if(!inp)return;
        lock=true;setTimeout(()=>{lock=false;},700);
        onAnswer(parseInt(inp,10));
        ns.clear();
        return;
      }
      ns.handle(val);
    });
  }
}

/* ─────────────────────────────────────────
   BALANCESCALE  widget:'balanceScale'  (유아 · 수의 나라)
   problem.left/right = 접시별 개수(서로 다름), problem.emoji = 접시 위 아이템.
   접시(왼쪽=0/오른쪽=1) 탭 = 즉시 판정(onAnswer(index)). 빔이 무거운 쪽으로 기움.
───────────────────────────────────────── */
function renderBalanceScale(problem, container, onAnswer){
  const left  = problem.left  || 3;
  const right = problem.right || 5;
  const em    = problem.emoji || '🍎';
  let lock=false;

  /* 무거운(개수 많은) 쪽이 아래로 내려가도록 기울기 계산. 최대 ±12deg */
  const diff  = right - left;
  const angle = Math.max(-12, Math.min(12, diff * 2));

  const root=document.createElement('div');
  root.className='nm-bs-wrap';
  root.innerHTML=`
    <div class="nm-bs-scale">
      <div class="nm-bs-post"></div>
      <div class="nm-bs-beam" style="transform:rotate(${angle}deg)">
        <button class="nm-bs-pan" data-side="0"><span class="nm-bs-items"></span></button>
        <button class="nm-bs-pan" data-side="1"><span class="nm-bs-items"></span></button>
      </div>
    </div>`;
  container.appendChild(root);

  const pans=root.querySelectorAll('.nm-bs-pan');
  const counts=[left,right];
  pans.forEach((pan,i)=>{
    pan.querySelector('.nm-bs-items').innerHTML=art(em).repeat(counts[i]);
    pan.addEventListener('pointerup',e=>{
      e.stopPropagation();
      if(lock)return;
      lock=true;setTimeout(()=>{lock=false;},700);
      if(i===problem.answer) pan.classList.add('on');
      else shake(pan);
      onAnswer(i);
    });
  });
}

/* ─────────────────────────────────────────
   NUMBERMACHINE  widget:'numberMachine'  (유아 · 수의 나라)
   problem.mmode:
     'apply' — problem.rule('+n'/'-n' 표시) + problem.input. 규칙이 보임,
               나오는 수를 numpad로 답.
     'guess' — problem.examples([in,out] 2쌍, 규칙 숨김) + problem.target.
               예시로 규칙을 추리해 target 입력 시 나오는 수를 numpad로 답.
───────────────────────────────────────── */
function renderNumberMachine(problem, container, onAnswer){
  const mmode = problem.mmode || 'apply';
  let lock=false;

  const root=document.createElement('div');
  root.className='nm-nm-wrap';

  function makeRow(inp, out, opts){
    opts=opts||{};
    const r=document.createElement('div');
    r.className='nm-nm-row'+(opts.ask?' ask':'');
    r.innerHTML=
      `<div class="nm-nm-io in">${inp}</div>`+
      `<div class="nm-nm-arrow">→</div>`+
      `<div class="nm-nm-machine">${opts.rule?`<span class="nm-nm-rule">${opts.rule}</span>`:'⚙️'}</div>`+
      `<div class="nm-nm-arrow">→</div>`+
      `<div class="nm-nm-io out${opts.ask?' ask':''}">${opts.ask?'?':out}</div>`;
    return r;
  }

  if(mmode==='guess'){
    (problem.examples||[]).forEach(pair=>root.appendChild(makeRow(pair[0],pair[1],{})));
    root.appendChild(makeRow(problem.target,null,{ask:true}));
  }else{
    root.appendChild(makeRow(problem.input,null,{ask:true,rule:problem.rule}));
  }
  container.appendChild(root);

  const screen=document.createElement('div');
  screen.className='nm-numpad-screen nm-nm-screen';screen.innerHTML='&nbsp;';
  root.appendChild(screen);
  const pad=document.createElement('div');
  pad.className='nm-numpad nm-nm-pad';
  root.appendChild(pad);
  const ns=numpadState(screen,2);
  buildNumpad(pad,val=>{
    if(lock)return;
    if(val==='ok'){
      const inp=ns.get();
      if(!inp)return;
      lock=true;setTimeout(()=>{lock=false;},700);
      onAnswer(parseInt(inp,10));
      ns.clear();
      return;
    }
    ns.handle(val);
  });
}

/* ─────────────────────────────────────────
   CROSSSUM  widget:'crossSum'  (유아 · 수의 나라)
   problem.cells = {top,bottom,left,right}(한 칸은 null), problem.askKey = 빈 칸 키.
   위+아래 = 왼쪽+오른쪽 규칙. 아래 큰 숫자 보기 3개 중 정답 선택.
   onAnswer(선택값).
───────────────────────────────────────── */
function renderCrossSum(problem, container, onAnswer){
  const cells  = problem.cells || {};
  const answer = problem.answer;
  let lock=false;

  const root=document.createElement('div');
  root.className='nm-cs-wrap';
  const cell=(key)=>{
    const v=cells[key];
    return `<div class="nm-cs-cell ${key}${v===null?' ask':''}">${v===null?'?':v}</div>`;
  };
  root.innerHTML=`
    <div class="nm-cs-cross">
      ${cell('top')}
      <div class="nm-cs-mid">${cell('left')}<div class="nm-cs-plus">+</div>${cell('right')}</div>
      ${cell('bottom')}
    </div>
    <div class="nm-cs-choices"></div>`;
  container.appendChild(root);

  const cand=[answer-2,answer-1,answer+1,answer+2].filter(n=>n>=1&&n<=9&&n!==answer);
  const picks=[answer];
  while(picks.length<3&&cand.length){picks.push(cand.splice(Math.floor(Math.random()*cand.length),1)[0]);}
  picks.sort(()=>Math.random()-.5);

  const ch=root.querySelector('.nm-cs-choices');
  picks.forEach(n=>{
    const b=document.createElement('button');
    b.className='nm-tc-choice';b.textContent=n;
    b.addEventListener('pointerup',e=>{
      e.stopPropagation();
      if(lock)return;
      lock=true;setTimeout(()=>{lock=false;},700);
      if(n===answer){const a=root.querySelector('.nm-cs-cell.ask');if(a){a.textContent=n;a.classList.add('found');}}
      else shake(b);
      onAnswer(n);
    });
    ch.appendChild(b);
  });
}

/* ─────────────────────────────────────────
   SORTBASKET  widget:'sortBasket'  (유아 · 수의 나라)
   problem.items = [{e,type:'A'|'B'}...](셔플), problem.basketA/basketB = {emoji}.
   섞인 칩을 탭하면 자기 종류의 바구니로 들어감(카운트 증가). 다 나뉘면
   3지선다 보기 등장(askType 바구니 개수 정답). onAnswer(선택값).
───────────────────────────────────────── */
function renderSortBasket(problem, container, onAnswer){
  const items    = problem.items || [];
  const askMode  = problem.askMode || 'count';
  let lock=false, remaining=items.length, sortedA=0, sortedB=0;

  const root=document.createElement('div');
  root.className='nm-sb-wrap';
  root.innerHTML=`
    <div class="nm-sb-scatter"></div>
    <div class="nm-sb-baskets">
      <div class="nm-sb-basket" data-side="0"><span class="nm-sb-basket-em">${art(problem.basketA.emoji)}</span><span class="nm-sb-basket-cnt">0</span></div>
      <div class="nm-sb-basket" data-side="1"><span class="nm-sb-basket-em">${art(problem.basketB.emoji)}</span><span class="nm-sb-basket-cnt">0</span></div>
    </div>
    <div class="nm-sb-choices"></div>`;
  container.appendChild(root);

  const scatter = root.querySelector('.nm-sb-scatter');
  const basketEls = root.querySelectorAll('.nm-sb-basket');
  const cntA = basketEls[0].querySelector('.nm-sb-basket-cnt');
  const cntB = basketEls[1].querySelector('.nm-sb-basket-cnt');
  const choicesBox = root.querySelector('.nm-sb-choices');

  items.forEach(it=>{
    const chip=document.createElement('button');
    chip.className='nm-sb-chip';
    chip.innerHTML=art(it.e);
    chip.addEventListener('pointerup',e=>{
      e.stopPropagation();
      chip.remove();
      if(it.type==='A'){ sortedA++; cntA.textContent=sortedA; }
      else{ sortedB++; cntB.textContent=sortedB; }
      remaining--;
      if(remaining===0) askMode==='compare' ? enableBasketTap() : showChoices();
    });
    scatter.appendChild(chip);
  });

  function enableBasketTap(){
    basketEls.forEach((el,i)=>{
      el.classList.add('tappable');
      el.addEventListener('pointerup',e=>{
        e.stopPropagation();
        if(lock)return;
        lock=true;setTimeout(()=>{lock=false;},700);
        if(i===problem.answer) el.classList.add('on');
        else shake(el);
        onAnswer(i);
      });
    });
  }

  function showChoices(){
    const answer=problem.answer;
    const cand=[answer-2,answer-1,answer+1,answer+2].filter(n=>n>=1&&n<=9&&n!==answer);
    const picks=[answer];
    while(picks.length<3&&cand.length){picks.push(cand.splice(Math.floor(Math.random()*cand.length),1)[0]);}
    picks.sort(()=>Math.random()-.5);
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
      choicesBox.appendChild(b);
    });
  }
}

/* ─────────────────────────────────────────
   TALLYBUILD  widget:'tallyBuild'  (유아 · 수의 나라)
   problem.target 만큼 판을 탭해 탤리(산가지) 막대를 그림(4개+대각선 묶음).
   ↩ 되돌리기(마지막 막대 지우기), ✔ 제출. onAnswer(현재 막대 수).
───────────────────────────────────────── */
function renderTallyBuild(problem, container, onAnswer){
  const target = problem.target || 3;
  const interaction = problem.interaction || 'build';
  const isRead = interaction === 'read';
  let count = isRead ? target : 0, lock=false;

  const root=document.createElement('div');
  root.className='nm-tb-wrap';
  root.innerHTML = isRead
    ? `<button class="nm-tb-board" disabled><svg viewBox="0 0 130 60" class="nm-tb-svg"></svg></button>`
    : `<div class="nm-tb-goal">🎯 <span class="nm-tb-goal-n">${target}</span></div>
       <button class="nm-tb-board"><svg viewBox="0 0 130 60" class="nm-tb-svg"></svg></button>
       <div class="nm-tb-controls">
         <button class="nm-tb-undo">↩</button>
         <button class="nm-tb-done">✔</button>
       </div>`;
  container.appendChild(root);

  const svg=root.querySelector('.nm-tb-svg');
  const board=root.querySelector('.nm-tb-board');

  function draw(){
    const groups=Math.floor(count/5), rem=count%5, spacing=11;
    let slot=0; const lines=[];
    for(let g=0; g<groups; g++){
      const startSlot=slot;
      for(let i=0;i<4;i++){ const x=10+slot*spacing; lines.push(`<line x1="${x}" y1="15" x2="${x}" y2="50"/>`); slot++; }
      const x1=10+startSlot*spacing, x2=10+(slot-1)*spacing;
      lines.push(`<line x1="${x1}" y1="50" x2="${x2}" y2="15"/>`);
      slot++;
    }
    for(let i=0;i<rem;i++){ const x=10+slot*spacing; lines.push(`<line x1="${x}" y1="15" x2="${x}" y2="50"/>`); slot++; }
    svg.innerHTML=lines.join('');
  }
  draw();

  if(isRead){
    const screen=document.createElement('div');
    screen.className='nm-numpad-screen nm-tb-screen';screen.innerHTML='&nbsp;';
    root.appendChild(screen);
    const pad=document.createElement('div');
    pad.className='nm-numpad nm-tb-pad';
    root.appendChild(pad);
    const ns=numpadState(screen,2);
    buildNumpad(pad,val=>{
      if(lock)return;
      if(val==='ok'){
        const inp=ns.get();
        if(!inp)return;
        lock=true;setTimeout(()=>{lock=false;},700);
        onAnswer(parseInt(inp,10));
        ns.clear();
        return;
      }
      ns.handle(val);
    });
    return;
  }

  board.addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(count>=9)return;
    count++; draw();
  });
  root.querySelector('.nm-tb-undo').addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(count>0){ count--; draw(); }
  });
  root.querySelector('.nm-tb-done').addEventListener('pointerup',e=>{
    e.stopPropagation();
    if(lock||count===0)return;
    lock=true;setTimeout(()=>{lock=false;},700);
    if(count!==target) shake(board);
    onAnswer(count);
  });
}

/* ─────────────────────────────────────────
   NUMLINE  widget:'numline'  (§4 다함식 위젯 1/3, 2026-08-27 Phase 3)
   problem.numline = {start, step, seq, blank}
   수직선 위에 seq의 마디를 점으로 찍고, 마디 사이를 점프 아치(SVG)로 잇는다.
   blank 위치는 '?'로 가려두고, 넘패드로 답을 입력한다.
───────────────────────────────────────── */
function renderNumline(problem, container, onAnswer){
  const cfg = problem.numline || {};
  const seq = cfg.seq || [0,0];
  const blank = cfg.blank!=null ? cfg.blank : seq.length-1;
  const answer = problem.answer;
  const NS='http://www.w3.org/2000/svg';
  const W=320, H=132, padX=26, baseY=90;
  const minV=Math.min(...seq), maxV=Math.max(...seq);
  const span=Math.max(1, maxV-minV);
  const px = v => padX + (v-minV)/span*(W-padX*2);

  const lang0=(window.S&&window.S.lang)||'ko';
  const hint0 = lang0==='en' ? 'Fill in the blank!' : lang0==='zh' ? '填出空格里的数！' : '빈 칸을 채워요!';
  const root=document.createElement('div');
  root.className='nm-w-numline';
  root.innerHTML=`
    <div class="nm-nl-hint">${esc(hint0)}</div>
    <svg class="nm-nl-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet">
      <line x1="${padX}" y1="${baseY}" x2="${W-padX}" y2="${baseY}" class="nm-nl-line"/>
      <g id="nlArcs"></g>
      <g id="nlDots"></g>
    </svg>
    <div class="nm-numpad-screen" id="nlScreen">&nbsp;</div>
    <div class="nm-numpad" id="nlPad"></div>
  `;
  container.appendChild(root);

  const arcs=root.querySelector('#nlArcs');
  const dots=root.querySelector('#nlDots');

  /* 점프 아치 먼저(점보다 아래 레이어) — 마디마다 살짝 지연시켜 순서대로 튀어나오게 */
  for(let i=0;i<seq.length-1;i++){
    const x1=px(seq[i]), x2=px(seq[i+1]);
    const mx=(x1+x2)/2, my=baseY-34;
    const path=document.createElementNS(NS,'path');
    path.setAttribute('d',`M${x1} ${baseY} Q${mx} ${my} ${x2} ${baseY}`);
    path.setAttribute('class','nm-nl-arc');
    path.style.animationDelay=(i*0.28)+'s';
    arcs.appendChild(path);
    const stepLbl=document.createElementNS(NS,'text');
    stepLbl.setAttribute('x',mx); stepLbl.setAttribute('y',my-6);
    stepLbl.setAttribute('class','nm-nl-step');
    stepLbl.style.animationDelay=(i*0.28)+'s';
    stepLbl.textContent='+'+(seq[i+1]-seq[i]);
    arcs.appendChild(stepLbl);
  }

  const dotEls=[];
  seq.forEach((v,i)=>{
    const g=document.createElementNS(NS,'g');
    g.setAttribute('class','nm-nl-dot'+(i===blank?' nm-nl-blank':''));
    const c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',px(v)); c.setAttribute('cy',baseY); c.setAttribute('r',7);
    const lbl=document.createElementNS(NS,'text');
    lbl.setAttribute('x',px(v)); lbl.setAttribute('y',baseY+22);
    lbl.setAttribute('class','nm-nl-lbl');
    lbl.textContent = i===blank ? '?' : v;
    g.appendChild(c); g.appendChild(lbl);
    dots.appendChild(g);
    dotEls.push(g);
  });

  const screen=root.querySelector('#nlScreen');
  const ns=numpadState(screen,4);
  let submitted=false;
  buildNumpad(root.querySelector('#nlPad'), val=>{
    if(submitted)return;
    if(val==='ok'){
      const inp=ns.get();
      if(!inp)return;
      if(parseFloat(inp)===answer){
        submitted=true;
        const blankDot=dotEls[blank];
        if(blankDot){ blankDot.querySelector('text').textContent=String(answer); blankDot.classList.add('found'); }
        setTimeout(()=>onAnswer(answer),500);
      } else {
        shake(screen); ns.clear();
      }
      return;
    }
    ns.handle(val);
  },{decimal:false,negative:false});
}

/* ─────────────────────────────────────────
   BASE10  widget:'base10'  (§4 다함식 위젯 2/3, 2026-08-27 Phase 3)
   problem.base10 = {h,tens,ones,mode:'read'} — 읽기(백판/십막대/낱개 → 수)
                  = {a:{tens,ones}, b:{tens,ones}, mode:'add'} — 두 수 더하기
───────────────────────────────────────── */
function b10FlatHtml(){
  const cell=4, n=10, size=cell*n;
  let inner='';
  for(let r=0;r<n;r++)for(let c=0;c<n;c++) inner+=`<rect x="${c*cell}" y="${r*cell}" width="${cell}" height="${cell}"/>`;
  return `<svg class="nm-b10-flat" viewBox="0 0 ${size} ${size}">${inner}</svg>`;
}
function b10RodHtml(){
  const cell=4, n=10;
  let inner='';
  for(let i=0;i<n;i++) inner+=`<rect x="0" y="${i*cell}" width="${cell}" height="${cell}"/>`;
  return `<svg class="nm-b10-rod" viewBox="0 0 ${cell} ${cell*n}">${inner}</svg>`;
}
function b10CubeHtml(){
  return `<svg class="nm-b10-cube" viewBox="0 0 4 4"><rect x="0" y="0" width="4" height="4"/></svg>`;
}
function b10GroupHtml(g){
  const h=g.h||0, tens=g.tens||0, ones=g.ones||0;
  let html='<div class="nm-b10-row">';
  for(let i=0;i<h;i++)    html+=b10FlatHtml();
  for(let i=0;i<tens;i++) html+=b10RodHtml();
  for(let i=0;i<ones;i++) html+=b10CubeHtml();
  html+='</div>';
  return html;
}
function renderBase10(problem, container, onAnswer){
  const cfg = problem.base10 || {};
  const mode = cfg.mode || 'read';
  const answer = problem.answer;
  const lang=(window.S&&window.S.lang)||'ko';
  const t3=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;

  const stageHtml = mode==='add'
    ? `<div class="nm-b10-stage nm-b10-two">
        <div class="nm-b10-group">${b10GroupHtml(cfg.a||{})}</div>
        <span class="nm-b10-plus">+</span>
        <div class="nm-b10-group">${b10GroupHtml(cfg.b||{})}</div>
      </div>`
    : `<div class="nm-b10-stage"><div class="nm-b10-group">${b10GroupHtml(cfg)}</div></div>`;

  const root=document.createElement('div');
  root.className='nm-w-base10';
  root.innerHTML=`
    <div class="nm-b10-hint">${mode==='add' ? t3('두 그림을 더하면 얼마일까요?','What is the total of both groups?','两组加起来一共是多少？') : t3('그림이 나타내는 수는 얼마일까요?','What number do the blocks show?','积木表示的数是多少？')}</div>
    ${stageHtml}
    <div class="nm-numpad-screen" id="b10Screen">&nbsp;</div>
    <div class="nm-numpad" id="b10Pad"></div>
  `;
  container.appendChild(root);

  const screen=root.querySelector('#b10Screen');
  const ns=numpadState(screen,4);
  let submitted=false;
  buildNumpad(root.querySelector('#b10Pad'), val=>{
    if(submitted)return;
    if(val==='ok'){
      const inp=ns.get();
      if(!inp)return;
      if(parseFloat(inp)===answer){
        submitted=true;
        root.classList.add('nm-b10-ok');
        setTimeout(()=>onAnswer(answer),400);
      } else {
        shake(screen); ns.clear();
      }
      return;
    }
    ns.handle(val);
  },{decimal:false,negative:false});
}

/* ─────────────────────────────────────────
   COMPARESTEPS  widget:'compareSteps'  (§4 다함식 위젯 3/3, 2026-08-27 Phase 3)
   problem.compareSteps = {
     a,
     left:  { n, steps:[{tex,blank}] },                     // 예: 24+10
     right: { n, delta, steps:[{tex,blank},{tex,blank}] }    // 예: 24+10(이어받음) → ±delta
   }
   왼쪽 열을 먼저 풀어야 오른쪽 열이 열리고, 오른쪽의 1단계는 왼쪽 답을 그대로
   이어받아 보여준 뒤(입력 없이) 2단계(±delta)만 채우게 한다.
───────────────────────────────────────── */
function renderCompareSteps(problem, container, onAnswer){
  const cfg = problem.compareSteps || {a:0,left:{steps:[]},right:{steps:[]}};
  const left = cfg.left, right = cfg.right;
  const lang=(window.S&&window.S.lang)||'ko';
  const t3=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;

  let leftDone=false, leftVal=null, rightDone=false;

  const root=document.createElement('div');
  root.className='nm-w-cmp';
  container.appendChild(root);

  function adjHint(){
    if(right.delta==null)return '';
    return right.delta<0
      ? t3(`10 더하고 ${Math.abs(right.delta)} 빼기`,`Add 10, then subtract ${Math.abs(right.delta)}`,`加10再减${Math.abs(right.delta)}`)
      : t3(`10 더하고 ${right.delta} 더하기`,`Add 10, then add ${right.delta}`,`加10再加${right.delta}`);
  }

  function paint(){
    root.innerHTML=`
      <div class="nm-cmp-cols">
        <div class="nm-cmp-col nm-cmp-left${leftDone?' done':''}">
          <div class="nm-cmp-h">${cfg.a} + ${left.n}</div>
          <div class="nm-cmp-eq">${renderKaTeX(left.steps[0].tex+' = '+(leftDone?leftVal:'\\square'))}</div>
          ${leftDone?'':`<div class="nm-numpad-screen" id="cmpLScreen">&nbsp;</div><div class="nm-numpad" id="cmpLPad"></div>`}
        </div>
        <div class="nm-cmp-arrow${leftDone?' ok':''}">${leftDone?'✓':'→'}</div>
        <div class="nm-cmp-col nm-cmp-right${!leftDone?' locked':''}${rightDone?' done':''}">
          <div class="nm-cmp-h">${cfg.a} + ${right.n}</div>
          ${!leftDone
            ? `<div class="nm-cmp-lock">🔒 ${t3('왼쪽을 먼저!','Left side first!','先算左边！')}</div>`
            : `<div class="nm-cmp-eq nm-cmp-step0">${renderKaTeX(right.steps[0].tex+' = '+leftVal)}</div>
               <div class="nm-cmp-hint">💡 ${esc(adjHint())}</div>
               <div class="nm-cmp-eq">${renderKaTeX(right.steps[1].tex+' = '+(rightDone?right.steps[1].blank:'\\square'))}</div>
               ${rightDone?'':`<div class="nm-numpad-screen" id="cmpRScreen">&nbsp;</div><div class="nm-numpad" id="cmpRPad"></div>`}`
          }
        </div>
      </div>
    `;
    if(!leftDone){
      const screen=root.querySelector('#cmpLScreen');
      const ns=numpadState(screen,4);
      buildNumpad(root.querySelector('#cmpLPad'), val=>{
        if(val==='ok'){
          const inp=ns.get(); if(!inp)return;
          if(parseFloat(inp)===left.steps[0].blank){
            leftVal=left.steps[0].blank; leftDone=true; paint();
          } else { shake(screen); ns.clear(); }
          return;
        }
        ns.handle(val);
      },{decimal:false,negative:false});
    } else if(!rightDone){
      const screen=root.querySelector('#cmpRScreen');
      const ns=numpadState(screen,4);
      buildNumpad(root.querySelector('#cmpRPad'), val=>{
        if(val==='ok'){
          const inp=ns.get(); if(!inp)return;
          if(parseFloat(inp)===right.steps[1].blank){
            rightDone=true; paint();
            setTimeout(()=>onAnswer(problem.answer),500);
          } else { shake(screen); ns.clear(); }
          return;
        }
        ns.handle(val);
      },{decimal:false,negative:false});
    }
  }
  paint();
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
  const isMulti=Array.isArray(problem.answer);
  let submitted=false;

  if(isMulti){
    const mp=multiPadState(screen,problem.answer,problem.answerShape);
    const decAny=problem.answer.some(a=>!Number.isInteger(a));
    buildNumpad(root.querySelector('#wfPad'),val=>{
      if(submitted)return;
      if(val==='ok'){
        if(!mp.isFull())return;
        submitted=true;
        onAnswer(mp.values().map(Number)); // 원본 numpad 위젯들과 동일하게 '사용자 입력값'을 그대로 넘긴다 — 채점은 호출부 책임
        return;
      }
      mp.handle(val);
    },{decimal:decAny,negative:!!problem.negative});
    return;
  }

  const ns=numpadState(screen,4);
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
  },{decimal:problem.answer!=null&&!Number.isInteger(problem.answer),negative:!!problem.negative});
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
  renderGridPaint,
  renderStoryCard,
  renderBalanceScale,
  renderNumberMachine,
  renderCrossSum,
  renderSortBasket,
  renderTallyBuild,
  renderNumline,
  renderBase10,
  renderCompareSteps,
  // 다칸 답 화면 HTML — main.js의 multiScreenHtml()이 재사용(분수 모양 렌더 공유)
  multiBoxesHtml,
  // expose helpers for testing
  _buildNumpad:buildNumpad,
  _shake:shake
};

})();
