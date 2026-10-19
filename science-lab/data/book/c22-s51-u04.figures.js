// 정적 AI 실사형 설명 자료. 실제 기관 사진·측정값·학생 수행의 증거가 아니다.
const photo=(key,alt,labels=[],note='',columns='')=>`<div class="ed-photo ed-body-photo"><img src="../assets/activities/c22-s51-u04/${key}-model-photo-v1.webp" width="1536" height="1024" alt="${alt}" decoding="async">${labels.length?`<div class="ed-photo-labels" style="--photo-cols:${labels.length}${columns?';grid-template-columns:'+columns:''}">${labels.map(t=>`<div>${t}</div>`).join('')}</div>`:''}${note?`<p class="ed-photo-note">${note}</p>`:''}<small class="ed-photo-credit">AI 실사형 설명 이미지 · 실제 기관/측정 사진 아님</small></div>`;
export const model={exercise:{unit:'1분 동안 센 횟수',rows:[['쉬고 난 뒤',72,18],['가벼운 걷기 직후',98,27],['잠시 쉰 뒤',78,20]],actualStudentData:false},pump:{observationSeconds:10,amountPerStrokeMl:4,strokeCounts:[8,12],actualMeasurement:false},urineRoute:['콩팥','오줌관','방광','요도','몸 밖'],foodRoute:['입','식도','위','작은창자','큰창자','항문']};
export const art={
 torso:photo('torso','두 폐 사이의 심장, 그 아래 간과 위, 아래쪽 창자들을 보여 주는 플라스틱 인체 교육 모형',[],'앞에서 본 교육 모형이에요. 실제 몸에서의 기관 색·크기·거리와 같지 않으며, 사진 밖 설명과 함께 읽어요.'),
 arm:photo('arm','같은 종류의 팔 교육 모형 두 자세. 왼쪽은 펼친 팔, 오른쪽은 팔꿈치를 굽힌 팔',['<b>팔을 폈을 때</b><br>안쪽 근육이 더 길게 나타남','<b>팔을 굽혔을 때</b><br>안쪽 근육이 짧고 두껍게 나타남'],'대표적인 팔 근육의 작용을 표현한 모형이에요. 사진에서 길이·힘의 정확한 값을 재지 않아요.','2fr 1fr'),
 heart:photo('heart','받침 위에 놓인 심장 겉모양 교육 모형. 위쪽에 혈관 연결 부분과 아래로 향한 끝이 보임',[],'심장 겉모양을 읽는 모형이에요. 혈관의 빨강·파랑은 구분 표시이며 실제 혈액이 파란색이라는 뜻이 아니에요.'),
 breathing:photo('breathing','밀폐된 병 속 두 풍선과 아래 고무막. 왼쪽은 작은 풍선, 오른쪽은 고무막이 내려가고 커진 풍선',['<b>막을 놓은 쪽</b><br>풍선이 작게 나타남','<b>막을 아래로 당긴 쪽</b><br>안 공간이 커지고 풍선이 커짐'],'병·관·풍선의 연결과 아래 막을 비교해요. 위쪽 관은 공기와 통하는 구조를 전제로 한 설명이며 기체 교환을 측정한 사진은 아니에요.'),
 urinary:photo('urinary','콩팥 두 개에서 각각 오줌관이 내려와 하나의 방광에 이어지고 방광 아래로 요도가 나오는 교육 모형',[],'위쪽 두 기관은 콩팥, 내려오는 두 가는 길은 오줌관, 아래 주머니는 방광, 그 아래 짧은 길은 요도예요. 연결을 간단히 표현해 실제 크기·거리와 다르게 배치했어요.'),
 pulse:photo('pulse','손바닥을 위로 놓은 반대쪽 손목의 엄지손가락 아래쪽에 검지와 중지 끝을 가볍게 댄 자세와 숫자가 없는 초시계',[],'맥박을 살피는 자세의 설명이에요. 표시된 관찰값은 없으며 실제 수치는 교사가 정한 방법으로 관찰한 뒤 적어요.'),
 health:photo('health','흐르는 물과 비누 거품으로 두 손을 문지르는 손씻기 장면',[],'한 순간의 자세 예시예요. 사진 한 장으로 손씻기 전체 과정이나 소요 시간·실제 실천 여부를 확인할 수는 없어요.'),
 exercise:`<div class="ed-photo-data"><p><b>연습 자료</b> · 실제 학생의 건강 기록 아님</p><table class="ed-table"><thead><tr><th>시점</th><th>맥박 · 1분 횟수</th><th>호흡 · 1분 횟수</th></tr></thead><tbody>${model.exercise.rows.map(r=>`<tr>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table><p>같은 사람·같은 방법·각각1분인 모형 자료예요. 건강의 정상/이상 기준이나 친구 간 순위로 사용하지 않아요.</p></div>`
};
