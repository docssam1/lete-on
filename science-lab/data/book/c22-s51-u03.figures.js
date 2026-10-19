// AI 실사형 설명 이미지. 실제 촬영·측정·학생 수행의 증거가 아니다.
// 정확한 수치는 사진 바깥의 연습 자료로 읽는다.
const photo=(key,alt,labels=[],note='')=>`<div class="ed-photo ed-photo-${key}"><img src="../assets/activities/c22-s51-u03/${key}-photo-v1.webp" width="1536" height="1024" alt="${alt}" decoding="async">${labels.length?`<div class="ed-photo-labels" style="--photo-cols:${labels.length}">${labels.map(x=>`<div>${x}</div>`).join('')}</div>`:''}${note?`<p class="ed-photo-note">${note}</p>`:''}<small class="ed-photo-credit">AI 실사형 설명 이미지 · 실제 측정 사진 아님</small></div>`;
export const model={mass:{water:80,sugar:12,cup:46,paper:1},kind:{waterMl:50,tempC:20,rows:[['A',4,true],['A',8,true],['B',4,true],['B',8,false]]},concentration:[{label:'A',water:60,sugar:3},{label:'B',water:60,sugar:9},{label:'C',water:120,sugar:9}],floating:{sameObject:true,sameTemperature:true,states:['완전히 잠겨 자유롭게 떠 있음','수면 위로 조금 드러남','수면 위로 더 많이 드러남']}};
export const art={
 mixing:photo('mixing','왼쪽 설탕, 가운데 물, 오른쪽 맑은 설탕물을 나란히 보여 주는 실사형 장면',['<b>설탕</b><br>용질 · 녹는 물질','<b>물</b><br>용매 · 녹이는 물질','<b>설탕물</b><br>용액 · 고르게 녹은 것']),
 observation:photo('residue','왼쪽 용기 바닥에는 흰 고체가 일부 남고 오른쪽 용기의 액체는 바닥까지 맑은 모습',['<b>고체 일부 남음</b><br>맑은 윗액과 남은 고체','<b>모두 녹음</b><br>남은 고체가 보이지 않음']),
 mass:photo('mass','왼쪽 저울에 물과 컵 및 설탕이 담긴 약포지, 오른쪽 저울에 설탕물과 컵 및 빈 약포지를 함께 올린 모습. 저울 숫자는 표시하지 않음',['<b>용해 전 · 연습 값</b><br>물 80 + 컵 46 + 설탕 12 + 약포지 1<br><b>전체 139 g</b>','<b>용해 후 · 연습 값</b><br>설탕물 92 + 컵 46 + 빈 약포지 1<br><b>전체 139 g</b>'],'같은 물건 전체 · 흘림과 증발이 없다는 조건의 계산이에요.'),
 kind:`<div class="ed-photo-data"><p><b>연습 자료</b> · 물 50 mL, 20 ℃ · 직접 측정값 아님</p><table class="ed-table"><thead><tr><th scope="col">용질</th><th scope="col">4 g 넣음</th><th scope="col">8 g 넣음</th></tr></thead><tbody><tr><th scope="row">A</th><td>모두 녹음</td><td>모두 녹음</td></tr><tr><th scope="row">B</th><td>모두 녹음</td><td>일부 남음</td></tr></tbody></table><p>넣은 양과 남은 고체를 함께 확인해요.</p></div>`,
 temperature:photo('temperature','같은 모양 용기 두 개에 온도 탐침이 담겨 있고 왼쪽에만 흰 고체가 남은 실사형 장면',['<b>차가운 물인 조건</b><br>백반 고체가 일부 남음','<b>따뜻한 물인 조건</b><br>백반이 모두 녹음'],'같은 백반 · 같은 물 양 · 같은 투입량과 관찰 방법인 설명용 사례예요. 실제 온도는 따로 재어요.'),
 concentration:photo('concentration','왼쪽과 가운데는 액면이 비슷하고 오른쪽은 액체가 더 많은 세 개의 무색 맑은 설탕물',model.concentration.map(d=>`<b>${d.label}</b><br>물 ${d.water} g<br>설탕 ${d.sugar} g`),'모두 녹고 고르게 섞인 설탕물 · 같은 온도. 정확한 양은 위의 연습 값을 읽어요.'),
 floating:photo('floating','같은 크기의 방울토마토가 왼쪽에서는 완전히 잠겨 떠 있고 가운데와 오른쪽에서는 수면 위로 차례로 더 많이 드러난 실사형 장면',model.floating.states.map((s,i)=>`<b>${['가','나','다'][i]}</b><br>${s}`),'같은 물체를 차례로 넣는 비교를 나란히 표현했어요. 벽·바닥 접촉 없이 수면과의 관계를 보아요.'),
 communication:photo('communication','물감과 붓 옆에서 사진 두 장이 담긴 설명 카드를 연필로 작성하는 손의 실사형 장면',[],'<b>조사 → 자료 제작 → 실제 설명 → 의견·보완</b><br>사진은 자료 제작 단계의 예예요. 전달 여부와 받은 의견은 실제 행동 뒤 기록해요.')
};
