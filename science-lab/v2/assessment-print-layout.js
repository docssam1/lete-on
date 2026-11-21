const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export function assessmentStudentPages(items,renderQuestion,heading,{form='' }={}){
 const total=Math.ceil(items.length/2);
 return Array.from({length:total},(_,i)=>`<section class="exam-page" aria-label="${esc(form)} ${i+1}쪽">${heading}<div class="exam-page-questions">${items.slice(i*2,i*2+2).map(renderQuestion).join('')}</div><footer class="exam-page-footer"><span>GFIELD · 지필드</span><span>${esc(form)} · ${i+1} / ${total}</span></footer></section>`).join('');
}
