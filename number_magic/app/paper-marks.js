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
  const rows=d.plan.items.map((it,i)=>`<div class="pd-mark-row" role="group" aria-label="${i+1}${t('번 문항',' question','号题')}"><b>${i+1}</b>${['o','x'].map(mark=>`<button type="button" data-paper-item="${esc(it.id)}" data-mark="${mark}" aria-pressed="${d.paperMarks[it.id]===mark}" aria-label="${i+1} ${mark==='o'?t('맞음','Correct','正确'):t('틀림','Wrong','错误')}">${mark==='o'?'○':'X'}</button>`).join('')}</div>`).join('');
  ctx.shell(t('종이 진단 채점','Mark paper assessment','纸上测评评分'),`<header class="pd-header"><p class="pd-kicker">${t('답지와 비교해 체크해 주세요.','Check against the answer key.','请对照答案勾选。')}</p><h1>${t('맞으면 ○, 틀리면 X','Correct ○, wrong X','答对○，答错X')}</h1><p>${t('모르면 아무것도 체크하지 마세요. 체크한 버튼을 다시 누르면 표시가 지워져요.','Leave unknown answers unmarked. Tap a selected button again to clear it.','不会的题不勾选。再次点击已选按钮可清除标记。')}</p><a class="pd-secondary pd-paper" href="placement-sheet.html?${esc(d.paperQuery)}" target="_blank" rel="noopener">${t('문제·답지 인쇄하기','Print questions and answer key','打印试卷和答案')}</a></header><details class="pd-answer-key"><summary>${t('답지 보기','View answer key','查看答案')}</summary><p class="pd-note">${t('문항 번호는 인쇄지와 같아요. 여러 칸의 답은 왼쪽부터 순서대로 적었어요.','Numbers match the printed sheet. Multiple answers are listed from left to right.','题号与打印卷一致。多格答案按从左到右列出。')}</p><table><thead><tr><th>${t('문항','Question','题号')}</th><th>${t('정답','Answer','答案')}</th></tr></thead><tbody>${d.plan.items.map((it,i)=>`<tr><th scope="row">${i+1}</th><td>${esc(answer(it))}</td></tr>`).join('')}</tbody></table></details><form id="pdPaperForm"><div class="pd-marks-grid">${rows}</div><p class="pd-note">${t('미표시 문항은 모름으로 기록하며 오답과 구분해요.','Unmarked questions are recorded as unknown, separately from wrong answers.','未勾选的题记录为不会，与错答区分。')}</p><button class="pd-primary" type="submit">${t('결과·로드맵 보기','See results and roadmap','查看结果和路线图')}</button></form><button class="pd-text-button" id="pdPaperOnline" type="button">${t('화면에서 한 문제씩 풀기','Answer one at a time on screen','在屏幕上逐题作答')}</button>`,'paper');
  all('[data-mark]').forEach(button=>button.onclick=()=>{
    const id=button.dataset.paperItem,mark=button.dataset.mark;
    d.paperMarks[id]=d.paperMarks[id]===mark?'':mark;
    all('[data-paper-item]').filter(x=>x.dataset.paperItem===id).forEach(x=>x.setAttribute('aria-pressed',String(d.paperMarks[id]===x.dataset.mark)));
    ctx.save();
  });
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
