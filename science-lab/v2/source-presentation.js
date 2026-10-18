// 교재 원문은 실제 쪽수·문항 번호로, 기존 단원평가는 기존 세트 표기로 보여 준다.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const bankLabel = (bank) => bank?.label || '단원평가';
export const groupLabel = (bank, n) => bank?.groups?.[n] || `세트${n}`;
export const examHeading = (bank, n) => bank?.label ? `${bank.label} · ${groupLabel(bank, n)}` : `단원평가 세트${n}`;
export const sourceCaption = (ref) => ref?.label ? `${ref.label} · ${ref.page}쪽 ${ref.originalNo}번` : `단원평가 세트${ref?.set} · ${ref?.no}번`;
export function sourceTableHtml(value) {
  if (!value || !Array.isArray(value.머리) || !Array.isArray(value.행)) return '';
  const headers = value.머리;
  return `<table class="tbl source-table">${value.caption ? `<caption>${esc(value.caption)}</caption>` : ''}<thead><tr>${headers.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${value.행.map((row) => `<tr>${headers.map((_, i) => `<td>${esc(row[i] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

// 원문에서 지정한 선택지 밑줄만 안전하게 복원한다. 지정이 없는 기존 문항의 HTML은 같다.
export function sourceChoiceHtml(item, choice, index) {
  const text=String(choice??''), terms=item?.choiceUnderlines?.[index];
  if(!Array.isArray(terms)||!terms.length)return esc(text);
  const marks=terms.filter(t=>typeof t==='string'&&t.length).flatMap(t=>{const start=text.indexOf(t);return start<0?[]:[{start,end:start+t.length}];}).sort((a,b)=>a.start-b.start||b.end-a.end);
  let at=0,out='';for(const m of marks){if(m.start<at)continue;out+=esc(text.slice(at,m.start))+'<u>'+esc(text.slice(m.start,m.end))+'</u>';at=m.end;}return out+esc(text.slice(at));
}
