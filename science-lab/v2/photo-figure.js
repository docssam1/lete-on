// 사진의 기호를 비트맵에 굽지 않고 같은 데이터로 학습·시험·인쇄에 표시한다.
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function photoFigureHtml(q){
 if(!q.figure||!q.photoLabels?.length)return '';
 const labels=q.photoLabels,cols=Math.min(5,Math.max(1,labels.length));
 return `<figure class="bank-photo-figure"><img src="../${esc(q.figure)}" alt="${esc(q.figureNote||'실사형 설명 자료')}"><figcaption><div class="bank-photo-labels" style="--bank-photo-cols:${cols}">${labels.map(label=>`<span>${esc(label)}</span>`).join('')}</div><small>${esc(q.photoCredit)}</small></figcaption></figure>`;
}
