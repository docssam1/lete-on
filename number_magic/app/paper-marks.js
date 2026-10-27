/* Parent-marked paper diagnosis: correct, wrong, or unmarked (unknown). */
(function(){
'use strict';
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(ctx){
  const {root,state:d,lang}=ctx;
  const t=(ko,en,zh)=>lang==='en'?en:lang==='zh'?zh:ko;
  const $=s=>root.querySelector(s),all=s=>Array.from(root.querySelectorAll(s));
  if(!d.paperMarks){
    // Migrate only submitted answers, never infer marks from unsent drafts.
    const profile=d.responses.length?window.NM_PLACEMENT_PLAN.summarize(d.plan,d.responses).profile:[];
    d.paperMarks=Object.fromEntries(d.plan.items.map(it=>{const row=profile.find(x=>x.id===it.id);return[it.id,row&&!row.skipped?(row.ok?'o':'x'):''];}));
  }
  const answer=it=>{
    if(it.responseMode==='match-number')return String(it.answer+1)+t('번 보기',' (option)','号选项');
    if(it.responseMode==='compare')return it.answer===1?t('왼쪽','Left','左边'):t('오른쪽','Right','右边');
    if(it.responseMode==='count-tap')return String(it.answer)+t('개 · 목표 그림만 ○',' · circle target objects only','个 · 只圈目标图形');
    return Array.isArray(it.answer)?it.answer.join(', '):String(it.answer);
  };
  // 한 칸 = 번호·정답·○X. 누를 때마다 ○ → X → 비움 (2026-10-27 원장 「아래로 쭉 내리게 하지 말고 좀 간결하게」).
  const short=it=>it.responseMode==='count-tap'?String(it.answer)+t('개','','个'):answer(it);
  const state={'':t('채점 안 함','not marked','未评分'),o:t('맞음','correct','正确'),x:t('틀림','wrong','错误')};
  const cellLabel=(it,i)=>`${i+1}${t('번 · 정답 ',' · answer ',' · 答案 ')}${short(it)} · ${state[d.paperMarks[it.id]||'']}`;
  const rows=d.plan.items.map((it,i)=>`<button type="button" class="pd-mark-cell" data-paper-item="${esc(it.id)}" data-state="${esc(d.paperMarks[it.id]||'')}" aria-label="${esc(cellLabel(it,i))}"><b>${i+1}</b><span>${esc(short(it))}</span><i aria-hidden="true">${d.paperMarks[it.id]==='o'?'○':d.paperMarks[it.id]==='x'?'X':''}</i></button>`).join('');
  ctx.shell(t('종이 진단 채점','Mark paper assessment','纸上测评评分'),`<header class="pd-header"><p class="pd-kicker">${t('답지와 비교해 체크해 주세요.','Check against the answer key.','请对照答案勾选。')}</p><h1>${t('맞으면 ○, 틀리면 X','Correct ○, wrong X','答对○，答错X')}</h1><p>${t('칸을 한 번 누르면 ○, 두 번 누르면 X, 한 번 더 누르면 지워져요. 모르는 문제는 비워 두세요. 칸의 작은 글씨가 정답이에요.','Tap a cell once for ○, twice for X, again to clear. Leave unknown answers blank. The small text in each cell is the answer.','点一次为○，两次为X，再点一次清除。不会的题留空。格子里的小字是正确答案。')}</p><a class="pd-secondary pd-paper" href="placement-sheet.html?${esc(d.paperQuery)}" target="_blank" rel="noopener">${t('문제·답지 인쇄하기','Print questions and answer key','打印试卷和答案')}</a></header><details class="pd-answer-key"><summary>${t('답지 보기','View answer key','查看答案')}</summary><p class="pd-note">${t('문항 번호는 인쇄지와 같아요. 여러 칸의 답은 왼쪽부터 순서대로 적었어요.','Numbers match the printed sheet. Multiple answers are listed from left to right.','题号与打印卷一致。多格答案按从左到右列出。')}</p><table><thead><tr><th>${t('문항','Question','题号')}</th><th>${t('정답','Answer','答案')}</th></tr></thead><tbody>${d.plan.items.map((it,i)=>`<tr><th scope="row">${i+1}</th><td>${esc(answer(it))}</td></tr>`).join('')}</tbody></table></details><form id="pdPaperForm"><div class="pd-mark-tools"><button type="button" data-mark-all="o">${t('모두 ○로 채우기','Mark all ○','全部标○')}</button><button type="button" data-mark-all="">${t('모두 지우기','Clear all','全部清除')}</button></div><div class="pd-marks-grid" role="group" aria-label="${t('문항별 채점','Marks by question','逐题评分')}">${rows}</div><p class="pd-mark-count" aria-live="polite"></p><p class="pd-note">${t('미표시 문항은 모름으로 기록하며 오답과 구분해요.','Unmarked questions are recorded as unknown, separately from wrong answers.','未勾选的题记录为不会，与错答区分。')}</p><button class="pd-primary" type="submit">${t('결과·로드맵 보기','See results and roadmap','查看结果和路线图')}</button></form><button class="pd-text-button" id="pdPaperOnline" type="button">${t('화면에서 한 문제씩 풀기','Answer one at a time on screen','在屏幕上逐题作答')}</button>`,'paper');
  const paint=cell=>{const id=cell.dataset.paperItem,i=d.plan.items.findIndex(x=>x.id===id),m=d.paperMarks[id]||'';
    cell.dataset.state=m;cell.querySelector('i').textContent=m==='o'?'○':m==='x'?'X':'';cell.setAttribute('aria-label',cellLabel(d.plan.items[i],i));};
  const tally=()=>{const v=d.plan.items.map(it=>d.paperMarks[it.id]||''),o=v.filter(x=>x==='o').length,x=v.filter(x=>x==='x').length;const el=$('.pd-mark-count');if(el)el.textContent=t(`○ ${o} · X ${x} · 비움 ${20-o-x}`,`○ ${o} · X ${x} · blank ${20-o-x}`,`○ ${o} · X ${x} · 空 ${20-o-x}`);};
  all('[data-paper-item]').forEach(cell=>cell.onclick=()=>{
    const id=cell.dataset.paperItem,m=d.paperMarks[id]||'';
    d.paperMarks[id]=m===''?'o':m==='o'?'x':'';
    paint(cell);tally();ctx.save();
  });
  all('[data-mark-all]').forEach(button=>button.onclick=()=>{
    d.plan.items.forEach(it=>{d.paperMarks[it.id]=button.dataset.markAll;});all('[data-paper-item]').forEach(paint);tally();ctx.save();
  });
  tally();
  $('#pdPaperOnline').onclick=ctx.onOnline;
  let submitted=false;
  $('#pdPaperForm').onsubmit=e=>{
    e.preventDefault();if(submitted)return;
    const marks=d.plan.items.map(it=>d.paperMarks[it.id]||'');
    const analysis=window.NM_PLACEMENT_PATHS.paperAnalysis(d.plan,marks,d.selection);
    submitted=true;
    // Keep reported marks as evidence, not invented numeric student answers.
    d.responses=d.plan.items.map((it,i)=>({id:it.id,manualMark:marks[i],skipped:marks[i]==='',sec:null}));
    d.index=d.plan.items.length;d.result=analysis.result;d.phase='result';d.responseSource='paper-marks';
    ctx.onSubmit();
  };
}
window.NM_PAPER_MARKS={render};
})();
