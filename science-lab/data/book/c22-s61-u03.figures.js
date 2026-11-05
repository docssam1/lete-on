const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const figure=(path,alt,note,kind='photo')=>`<figure class="ps-figure ps-${kind}"><img src="../${esc(path)}" alt="${esc(alt)}" decoding="async"><figcaption>${esc(note)}</figcaption></figure>`;
export const art={
 observe:figure('assets/book/s31-u03-photo-observe.webp','두 잎과 돋보기의 설명 장면','잎의 겉모습을 살펴보는 도구예요. 세포 관찰에는 현미경과 표본이 필요해요.'),
 plant:figure('assets/book/s31-u04-photo-seedling.webp','화분에서 줄기와 잎이 자란 어린 식물','뿌리·줄기·잎의 관계를 떠올리는 장면이에요. 흙 아래 뿌리와 물의 이동은 더 관찰해야 해요.'),
 leaf:figure('assets/book/s31-u03-photo-lotus.webp','넓게 펼쳐진 연잎의 설명 장면','잎의 생김새를 생각해요. 이 장면으로 녹말 검출이나 증산 실험을 했다고 정하지 않아요.'),
 cells:figure('assets/bank/c22-s61-u03/s4-q02.webp','작은 경계가 이어진 식물 세포 관찰 자료 그림','관련 자료의 식물 세포 그림이에요. 실제 표본에서 보인 모습과는 구별해요.','source'),
 stem:figure('assets/bank/c22-s61-u03/s3-q09.webp','백합의 색소 물 장치와 세로 단면 비교 자료','관련 자료의 장치와 단면이에요. 실제 수업에서 보인 색 위치·시간을 따로 확인해요.','source'),
 transpiration:figure('assets/bank/c22-s61-u03/s4-q16.webp','잎 유무를 달리하고 봉지를 씌운 두 식물 장치','그림의 잎 유무·입구·봉지를 살펴보고 실제 준비에서는 처음 물기와 같은 조건도 확인해요.','source'),
 flower:figure('assets/bank/c22-s61-u03/s1-q07.webp','사과꽃의 구조와 기호를 나타낸 자료','꽃 구조를 비교하는 자료예요. 꽃 방문·꽃가루받이·씨 형성을 같은 단계로 보지 않아요.','source')
};
