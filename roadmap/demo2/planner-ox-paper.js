// Open a learner's copy of the assigned worksheet without transferring it.
(function (g) {
  'use strict';
  const levels = {m:'중',h:'상',x:'최상'};
  const files = new Map();
  let dialog, current;
  function filename(unit, set) {
    return unit.fileStem+'_'+levels[set]+'세트_25문항_문제지.pdf';
  }
  function create() {
    const el=document.createElement('dialog');
    el.className='ox-paper-dialog';
    el.setAttribute('aria-labelledby','oxPaperTitle');
    el.innerHTML='<form method="dialog"><h3 id="oxPaperTitle">내 문제지 열기</h3><button aria-label="닫기">닫기</button></form><p data-paper-caption></p>'+
      '<label>기기에서 문제지 PDF 선택<input data-paper-file type="file" accept=".pdf,application/pdf"></label>'+
      '<p data-paper-status role="status"></p><a data-paper-open target="_blank" rel="noopener" hidden>PDF 보기 (새 창)</a>';
    const input=el.querySelector('input'), status=el.querySelector('[data-paper-status]'), link=el.querySelector('a');
    input.addEventListener('change',async()=>{
      const file=input.files[0], key=current;
      link.hidden=true;
      if (!file || !key) return;
      try {
        if (file.name.normalize('NFC').replace(/\s/g,'')!==key || await file.slice(0,5).text()!=='%PDF-') throw Error();
        if (current!==key || input.files[0]!==file) return;
        if (!files.has(key)) {
          if (files.size>=3) {
            const oldest=files.keys().next().value;
            URL.revokeObjectURL(files.get(oldest)); files.delete(oldest);
          }
          files.set(key,URL.createObjectURL(file.slice(0,file.size,'application/pdf')));
        }
        link.href=files.get(key); link.hidden=false;
        status.textContent='선택한 문제지를 열 수 있어요.'; link.focus();
      } catch {
        if (current===key) status.textContent='위에 표시된 학기·단원·난이도의 문제지 PDF를 선택해 주세요.';
      }
    });
    document.body.append(el);
    return el;
  }
  function open(unit,set) {
    if (!levels[set] || !unit) return;
    dialog ||= create();
    current=filename(unit,set).normalize('NFC').replace(/\s/g,'');
    dialog.querySelector('[data-paper-caption]').textContent=current;
    dialog.querySelector('input').value='';
    const link=dialog.querySelector('a');
    link.hidden=!files.has(current);
    if (link.hidden) link.removeAttribute('href'); else link.href=files.get(current);
    dialog.querySelector('[data-paper-status]').textContent=link.hidden?'수업 때 받은 문제지를 이 기기에서 열어요.':'이 창에서 선택한 문제지가 있어요.';
    if (!dialog.open) dialog.showModal();
  }
  g.PlannerOxPaper=Object.freeze({open,filename});
})(typeof window==='object'?window:globalThis);
