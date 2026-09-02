/* ===== 진입 ===== */
function render(d){
  questionNumber += 1;
  const cv=document.getElementById('cv'), ctx=cv.getContext('2d');
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,cv.width,cv.height);
  if(d.kind==='paper-turn') renderTurnGame(ctx,d); else if(d.kind==='game-level') renderSharedGame(ctx,d); else if(d.kind==='hole') renderHole(ctx,d); else if(d.kind==='stack') renderStack(ctx,d); else if(d.kind==='fold-top') renderFoldTop(ctx,d); else if(d.kind==='diag-number') renderDiagNumber(ctx,d); else if(d.kind==='pieces') renderPieces(ctx,d); else if(d.kind==='punch') renderPunch(ctx,d); else if(d.kind==='num-inverse') renderNumInverse(ctx,d); else if(d.kind==='unfold-shape') renderUnfoldShape(ctx,d); else renderNumber(ctx,d);
  document.getElementById('info').textContent=d.info+' · 정답 '+d.answer;
  document.getElementById('src').textContent=d.src;
  return d;
}
function selectedDifficulty(){
  return document.querySelector('input[name="difficulty"]:checked')?.value||'mid';
}
function buildProblem(mode,difficulty){
  if(mode.startsWith('turn-l')){
    const shared=buildTurnProblem(mode);
    return shared?render(shared):render(genHole(false,difficulty));
  }
  if(mode.startsWith('game-l')){
    const shared=buildSharedProblem(mode);
    return shared?render(shared):render(genHole(false,difficulty));
  }
  if(mode==='hole2')  return render(genHole(false,difficulty));
  if(mode==='hole3d') return render(genHole(true,difficulty));
  if(mode==='foldtop') return render(genFoldTop(difficulty));
  if(mode==='numdiag')    return render(genDiagNumber(Math.random()<0.7,difficulty));
  if(mode==='pieces')     return render(genPieces());
  if(mode==='punch')      return render(genPunch());
  if(mode==='numinv')     return render(genNumInverse());
  if(mode==='unfoldshape') return render(genUnfoldShape());
  if(mode==='stackfind')  return render(genStack(false));
  if(mode==='stackorder') return render(genStack(true));
  if(mode==='numsum') return render(genNumber(false,null,difficulty));
  return render(genNumber(true,null,difficulty));
}

function answerText(problem){
  if(problem.kind==='paper-turn') return String(problem.answer);
  if(problem.kind==='game-level') return String(problem.answer);
  if(problem.kind==='fold-top') return `${problem.answer}`;
  if(problem.kind==='stack' && Array.isArray(problem.answer)) return problem.answer.join(' → ');
  if(problem.kind==='punch' && typeof problem.answer==='object') return Object.entries(problem.answer).map(([k,v])=>`${k} ${v}개`).join(', ');
  return String(problem.answer);
}

const modeSelect=document.getElementById('mode');
const modeOptions=Array.from(modeSelect.options).map(option=>({value:option.value,label:option.textContent}));
let selectedModes=[modeOptions[0].value];
let previewMode=selectedModes[0];

function syncModeButtons(){
  const host=document.getElementById('modeButtons');
  const selected=selectedModes.map(value=>modeOptions.find(option=>option.value===value)).filter(Boolean);
  const rest=modeOptions.filter(option=>!selectedModes.includes(option.value));
  host.innerHTML='';
  selected.concat(rest).forEach(option=>{
    const button=document.createElement('button');
    const active=selectedModes.includes(option.value);
    button.type='button';
    button.className='mode-button'+(active?' active':'');
    button.textContent=option.label;
    button.setAttribute('aria-pressed',String(active));
    button.addEventListener('click',()=>{
      if(selectedModes.includes(option.value)){
        if(selectedModes.length===1) return;
        selectedModes=selectedModes.filter(value=>value!==option.value);
        if(previewMode===option.value) previewMode=selectedModes[0];
      }else{
        selectedModes=[option.value].concat(selectedModes);
        previewMode=option.value;
      }
      modeSelect.value=previewMode;
      syncModeButtons();
      generateSheet();
    });
    host.appendChild(button);
  });
}

function solutionText(problem){
  if(problem.kind==='paper-turn'){
    const names=problem.source.operations.map(operation=>turnOperations[operation]?.ko||operation).join(' → ');
    return `${names} 순서로 시작 모양을 움직입니다. 각 동작을 한 번씩 적용한 마지막 모양은 ${problem.answer}입니다. (${problem.source.id})`;
  }
  if(problem.kind==='game-level'){
    const p=problem.source;
    const folds=(p.folds||[p.fold]).map(step=>sharedAxisLabel[step.axis]).join(' → ');
    if(problem.gameLevel<=3) return `${folds} 순서를 거꾸로 펼치며 표시를 대칭 이동합니다. 정답 위치는 ${problem.answer}입니다. (${p.id})`;
    if(problem.gameLevel===4) return `${folds} 순서를 거꾸로 펼쳐 잘려 나간 칸을 찾으면 ${p.answer.cells.map(sharedRegionLabel).join(', ')}입니다. ${p.answer.expression} = ${p.answer.sum}입니다. (${p.id})`;
    return `${folds} 순서로 움직이는 종이 층을 뒤집어 포개면 맨 위의 수는 ${p.answer}입니다. (${p.id})`;
  }
  if(problem.kind==='hole'){
    const counts=[problem.nHoles];
    for(let i=0;i<problem.dirs.length;i++) counts.push(counts[counts.length-1]*2);
    return `접은 순서를 거꾸로 펼치면 ${counts.join(' → ')}개가 됩니다. 따라서 ${problem.answer}개입니다.`;
  }
  if(problem.kind==='fold-top') return `마지막 접힌 묶음을 거꾸로 펼쳐 각 칸의 위아래 순서를 추적하면 맨 위의 수는 ${problem.answer}입니다.`;
  if(problem.kind==='stack') return `겹친 부분의 위아래 관계를 차례로 비교하면 ${answerText(problem)}입니다.`;
  if(problem.kind==='punch') return `접힌 선을 기준으로 구멍을 대칭 이동해 펼친 뒤 모양별로 세면 ${answerText(problem)}입니다.`;
  if(problem.kind==='pieces') return `접힌 종이의 선과 자른 선이 만나는 위치를 모두 펼쳐 세면 ${answerText(problem)}입니다.`;
  return `접는 방향에 따라 겹치는 칸을 대응시켜 계산하면 정답은 ${answerText(problem)}입니다.`;
}

function solutionImage(problem,problemImage){
  if(problem.kind==='paper-turn'){
    const canvas=document.getElementById('cv');
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);renderTurnGame(ctx,problem,true);
    return canvas.toDataURL('image/jpeg',.92);
  }
  if(problem.kind==='game-level'){
    const canvas=document.getElementById('cv');
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);renderSharedGame(ctx,problem,true);
    return canvas.toDataURL('image/jpeg',.92);
  }
  if(problem.kind!=='hole') return problemImage;
  const canvas=document.getElementById('cv');
  renderHoleSolution(canvas.getContext('2d'),problem);
  return canvas.toDataURL('image/jpeg',.92);
}

function previewProblem(){
  questionNumber=0;
  modeSelect.value=previewMode;
  return buildProblem(previewMode,selectedDifficulty());
}

function pageHtml(items,pageNo,totalPages,title,answers){
  return `<section class="sheet-page${answers?' answer-page':''}"><header class="sheet-head"><h2>${title}${answers?' · 정답과 풀이':''}</h2><div class="sheet-meta">${pageNo} / ${totalPages}</div></header><div class="problem-grid">${items.map(item=>`<article class="problem-card"><img src="${answers?item.solutionImage:item.image}" alt="${item.no}번 색종이 접기 문제"><div class="answer-line">${answers?`정답: <span class="answer-value">${item.answer}</span>`:'답: __________'}</div>${answers?`<div class="solution-text"><strong>${item.no}번 풀이</strong> ${item.solution}</div>`:''}</article>`).join('')}</div></section>`;
}

function generateSheet(){
  const difficulty=selectedDifficulty();
  const count=Number(document.getElementById('count').value)||10;
  const labels=selectedModes.map(value=>modeOptions.find(option=>option.value===value)?.label).filter(Boolean);
  const title=labels.length===1?labels[0]:`${labels.length}개 유형 혼합`;
  const canvas=document.getElementById('cv');
  const items=[];
  const modeQueue=Array.from({length:count},(_,i)=>selectedModes[i%selectedModes.length]);
  for(let i=modeQueue.length-1;i>0;i--){ const j=R(0,i); [modeQueue[i],modeQueue[j]]=[modeQueue[j],modeQueue[i]]; }
  for(let i=0;i<count;i++){
    questionNumber=i;
    const mode=modeQueue[i];
    const problem=buildProblem(mode,difficulty);
    const image=canvas.toDataURL('image/jpeg',.9);
    items.push({no:i+1,problem,answer:answerText(problem),solution:solutionText(problem),image,solutionImage:solutionImage(problem,image)});
  }
  const perPage=3, pages=[];
  const pageCount=Math.ceil(items.length/perPage);
  for(let i=0;i<items.length;i+=perPage) pages.push(pageHtml(items.slice(i,i+perPage),i/perPage+1,pageCount,`GFIELD 색종이 접기 · ${title}`,false));
  if(document.getElementById('answers').checked){
    const answerPerPage=6, answerPages=Math.ceil(items.length/answerPerPage);
    for(let i=0;i<items.length;i+=answerPerPage) pages.push(pageHtml(items.slice(i,i+answerPerPage),i/answerPerPage+1,answerPages,`GFIELD 색종이 접기 · ${title}`,true));
  }
  document.getElementById('sheetRoot').innerHTML=pages.join('');
  previewProblem();
}
/* HF variation 어댑터: machineReadable → 엔진 파라미터, 확정 재현 */
const HF_FOLD_MAP = { vertical_half:'v', horizontal_half:'h',
                      diagonal_main:'d1', diagonal_anti:'d2' };

function hfBuildHole(mr){
  const dirs = (mr.foldSequence||[]).map(f=>HF_FOLD_MAP[f]||f);
  const nHoles = mr.punchCount || 1;
  let poly=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  const stages=[];
  for(const d of dirs){ stages.push({poly, fold:d}); poly=clipHalfPlane(poly, FOLDS[d].keep); }
  stages.push({poly, fold:null});
  const holes=[]; const cx=centroid(poly); const spread=0.12;
  for(let i=0;i<nHoles;i++){
    const ang=(i/nHoles)*Math.PI*2;
    holes.push({x:Math.min(0.9,Math.max(0.1,cx.x+Math.cos(ang)*spread*(nHoles>1?1:0))),
                y:Math.min(0.9,Math.max(0.1,cx.y+Math.sin(ang)*spread*(nHoles>1?1:0)))});
  }
  let pts=holes.map(h=>({...h}));
  for(let i=dirs.length-1;i>=0;i--){
    const mirror=FOLDS[dirs[i]].mirror; const next=[...pts];
    for(const p of pts){ const r=mirror(p);
      if(!next.some(q=>Math.hypot(q.x-r.x,q.y-r.y)<1e-6)) next.push(r); }
    pts=next;
  }
  const times=['','한 번','두 번','세 번'][dirs.length];
  const diagonal = dirs.some(d=>d==='d1'||d==='d2');
  return { kind:'hole', dirs, stages, holes, unfolded:pts, nHoles, answer:pts.length,
    text:[`아래와 같이 색종이를 ${diagonal?'대각선을 따라':'반으로'} ${times} 접은 다음 구멍을 ${nHoles}개 뚫었습니다.`,
          '색종이를 펼쳤을 때, 구멍은 모두 몇 개입니까?'],
    info:`접기 ${dirs.length}회 · 구멍 ${nHoles}개`, src:'' };
}
function hfBuildNumber(mr){
  const grid = mr.grid?.values || mr.grid;
  const hDir = mr.hDir || 'up', vDir = mr.vDir || 'left';
  return genNumber(false, { grid, hDir, vDir, cell:{r:0,c:0} });
}
function hfRenderVariation(variation){
  const q = variation.baseQuestionId, mr = variation.machineReadable;
  let d;
  if(q==='q12') d = hfBuildHole(mr);
  else if(q==='q11') d = hfBuildNumber(mr);
  else { console.warn('미지원 유형', q); return; }
  render(d); return d;
}
window.hfRenderVariation = hfRenderVariation;
document.querySelectorAll('input[name="difficulty"]').forEach(input=>input.addEventListener('change',generateSheet));
document.getElementById('count').addEventListener('change',generateSheet);
document.getElementById('answers').addEventListener('change',generateSheet);
/* 지오메트리 랩의 딥링크(?mode=&difficulty=&count=)를 화면 상태로 옮긴다.
   값은 모두 이 페이지에 실제로 있는 선택지로만 좁혀 받는다 — 주소창에서 손으로
   고친 값이 화면에 없는 상태를 만들면, 보이는 설정과 뽑히는 문제가 어긋난다.
   엔진에는 손대지 않고 컨트롤만 미리 맞춰 두는 배선이다. */
function applyLabParams(){
  let params;
  try{ params=new URLSearchParams(window.location.search); }catch(e){ return; }
  const mode=params.get('mode');
  if(mode && modeOptions.some(option=>option.value===mode)){
    selectedModes=[mode];
    previewMode=mode;
    modeSelect.value=mode;
  }
  const difficulty=params.get('difficulty');
  if(difficulty){
    const radio=document.querySelector(`input[name="difficulty"][value="${CSS.escape(difficulty)}"]`);
    if(radio) radio.checked=true;
  }
  const count=params.get('count');
  if(count && document.getElementById('count').querySelector(`option[value="${CSS.escape(count)}"]`)){
    document.getElementById('count').value=count;
  }
}
applyLabParams();
syncModeButtons();
previewProblem();
generateSheet();
loadSharedGameLevels();
loadTurnGameLevels();
