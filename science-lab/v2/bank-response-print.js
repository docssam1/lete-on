// Shared print presentation for answer contracts; question and grading data stay unchanged.
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const circles='①②③④⑤⑥⑦⑧⑨⑩';
export function bankAnswerText(contract){
 if(contract.type==='single-choice')return circles[contract.answer];
 if(contract.type==='multi-choice')return contract.answers.map(i=>circles[i]).join(', ');
 if(contract.type==='cloze')return contract.blanks.map((blank,i)=>`${circles[i]||i+1} ${blank.answer}`).join(' · ');
 if(contract.type==='table-fill')return contract.rows.map(row=>`${row.label}: ${row.answer.map((value,i)=>contract.columns.length>1?`${contract.columns[i]} ${value}`:value).join(' / ')}`).join(' · ');
 return contract.sample??contract.answer;
}
export function bankPromptHtml(text,contract,{show=false,only=false}={}){
 if(contract.type!=='cloze'||only)return esc(text);
 let index=0;
 return esc(text).replace(/\(\s*([①②③④⑤⑥⑦⑧⑨⑩])\s*\)/g,(match,label)=>{
  const blank=contract.blanks[index],key=index++;if(!blank)return match;
  return `<span class="bank-blank-label">${label}</span> <span class="bank-print-blank${show?' bank-print-answer':''}" data-bank-blank="${key}">${show?esc(blank.answer):'&nbsp;'}</span>`;
 });
}
export function bankResponseTableHtml(contract,{show=false,className=''}={}){
 if(contract.type!=='table-fill')return '';
 return `<table class="${esc(className)} bank-response-table" aria-label="표 채우기 ${show?'정답':'답란'}"><thead><tr><th scope="col">${esc(contract.rowHead||'항목')}</th>${contract.columns.map(column=>`<th scope="col">${esc(column)}</th>`).join('')}</tr></thead><tbody>${contract.rows.map((row,ri)=>`<tr><th scope="row">${esc(row.label)}</th>${contract.columns.map((_,ci)=>`<td data-bank-response-cell="${ri}-${ci}">${show?`<span class="bank-response-answer">${esc(row.answer[ci])}</span>`:'<span class="bank-empty-cell">&nbsp;</span>'}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
