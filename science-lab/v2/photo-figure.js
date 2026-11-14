// 사진의 기호를 비트맵에 굽지 않고 같은 데이터로 학습·시험·인쇄에 표시한다.
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function photoFigureHtml(q){
 if(q.observationPhotos?.length){
  const photos=q.observationPhotos;
  if(!Array.isArray(photos)||photos.length>4)throw Error('관찰 사진 수를 확인하세요.');
  const local=src=>typeof src==='string'&&/^assets\/(book|bank|observe)\/[A-Za-z0-9_./-]+\.(jpg|jpeg|png|webp)$/.test(src)&&!src.split('/').includes('..');
  const sourceLink=url=>typeof url==='string'&&(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:[^\s<>"']+$/.test(url)||/^https:\/\/www\.inaturalist\.org\/observations\/(?:[0-9]+|[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/.test(url));
  const licenseLink=url=>typeof url==='string'&&(/^https:\/\/creativecommons\.org\/licenses\/[^\s<>"']+$/.test(url)||url==='https://creativecommons.org/publicdomain/zero/1.0/');
  const owned=p=>p.sourceKind==='owned'&&p.creator==='지필드'&&!p.sourceUrl&&!p.license&&!p.licenseUrl;
  for(const p of photos)if(!local(p.src)||!p.alt?.trim()||!p.label?.trim()||!p.creator?.trim()||(p.sourceKind?!owned(p):!p.license?.trim()||!sourceLink(p.sourceUrl)||!licenseLink(p.licenseUrl)))throw Error('관찰 사진 정보가 빠졌습니다.');
  const credit=p=>owned(p)?`${esc(p.creator)} · 직접 촬영`:`${esc(p.creator)} · <a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener noreferrer">사진 출처</a> · <a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(p.license)}</a>`;
  return `<div class="observation-photos" data-photo-count="${photos.length}">${photos.map(p=>`<figure class="observation-photo"><img src="../${esc(p.src)}" alt="${esc(p.alt)}"><figcaption><b>${esc(p.label)}</b><small>${credit(p)}</small></figcaption></figure>`).join('')}</div>`;
 }
 if(!q.figure||!q.photoLabels?.length)return '';
 const credit=(q.photoCredit||'').replace(/^AI 실사형 설명 이미지(?: · 실제 [가-힣/]+ 사진 아님)?(?= ·|$)/,'문항을 설명하는 그림');
 const labels=q.photoLabels,cols=Math.min(5,Math.max(1,labels.length));
 return `<figure class="bank-photo-figure"><img src="../${esc(q.figure)}" alt="${esc(q.figureNote||'실사형 설명 자료')}"><figcaption><div class="bank-photo-labels" style="--bank-photo-cols:${cols}">${labels.map(label=>`<span>${esc(label)}</span>`).join('')}</div><small>${esc(credit)}</small></figcaption></figure>`;
}
