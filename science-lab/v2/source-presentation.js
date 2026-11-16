// 교재 원문은 실제 쪽수·문항 번호로, 기존 단원평가는 기존 세트 표기로 보여 준다.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const assessmentTitle = (title) => String(title || '학습 평가').replace(/\s*·\s*창작$/, '');
export const bankLabel = (bank) => bank?.assessment && bank?.authored ? assessmentTitle(bank.label) : bank?.label || '단원평가';
export const groupLabel = (bank, n) => bank?.groups?.[n] || `세트${n}`;
export const examHeading = (bank, n) => bank?.label ? `${bankLabel(bank)} · ${groupLabel(bank, n)}` : `단원평가 세트${n}`;
export const sourceCaption = (ref) => ref?.label ? `${ref.label} · ${ref.page}쪽 ${ref.originalNo}번` : `단원평가 세트${ref?.set} · ${ref?.no}번`;
// Use a reviewed native-resolution copy while retaining the original path and layout as fallback.
const nativeSourceFigures = {
  'assets/bank/c22-s42-u01/moon-s1-q08.webp': {
    src: 'assets/bank/c22-s42-u01/moon-s1-q08-hd.webp', width: 359, height: 172,
  },
};
export function sourceFigureImageAttrs(src) {
  const base = `src="../${esc(src)}"`;
  const image = Object.hasOwn(nativeSourceFigures, src) ? nativeSourceFigures[src] : null;
  return image ? `${base} srcset="../${image.src} 1x" width="${image.width}" height="${image.height}"` : base;
}
export function sourceTableHtml(value) {
  if (!value || !Array.isArray(value.머리) || !Array.isArray(value.행)) return '';
  const headers = value.머리;
  return `<table class="tbl source-table">${value.caption ? `<caption>${esc(value.caption)}</caption>` : ''}<thead><tr>${headers.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${value.행.map((row) => `<tr>${headers.map((_, i) => `<td>${esc(row[i] ?? '')}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}

// Keep each numbered workbook part on its own line, with its printed number.
export function sourcePartHtml(item, key, value) {
  if (item?.status !== 'authored' || !['authored-supplement', 'authored-pair'].includes(item.sourceRef?.type) || !item.workbookRef?.id || !['문항', '소문항'].includes(key)) return null;
  const parts = Array.isArray(value) ? value : typeof value === 'string' ? value.split('\n') : [];
  if (parts.length < 2 || !parts.every(part => typeof part === 'string' && /^\(\d+\)\s*/.test(part))) return null;
  return `<ol class="source-part-list" aria-label="부분별 문제">${parts.map(part => `<li>${esc(part)}</li>`).join('')}</ol>`;
}

// 원문에서 지정한 선택지 밑줄만 안전하게 복원한다. 지정이 없는 기존 문항의 HTML은 같다.
export function sourceChoiceHtml(item, choice, index) {
  const text=String(choice??''), terms=item?.choiceUnderlines?.[index];
  if(!Array.isArray(terms)||!terms.length)return esc(text);
  const marks=terms.filter(t=>typeof t==='string'&&t.length).flatMap(t=>{const start=text.indexOf(t);return start<0?[]:[{start,end:start+t.length}];}).sort((a,b)=>a.start-b.start||b.end-a.end);
  let at=0,out='';for(const m of marks){if(m.start<at)continue;out+=esc(text.slice(at,m.start))+'<u>'+esc(text.slice(m.start,m.end))+'</u>';at=m.end;}return out+esc(text.slice(at));
}
