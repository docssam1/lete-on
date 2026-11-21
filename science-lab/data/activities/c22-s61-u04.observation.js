// 서울의 같은 남쪽 하늘을 여는 수업 설정. 프로그램 관측과 야외 실측은 별개다.
export const OBSERVER = Object.freeze({name:'서울',latitude:37.56668,longitude:126.97829,azimuth:180,altitude:30,fov:100,timeZone:'Asia/Seoul'});
const view=(id,date,time,label)=>Object.freeze({id,date,time,label});
export const SKY_VIEWS = Object.freeze([
 view('sun-09','2026-03-21','09:00','오전 9시'),view('sun-12','2026-03-21','12:00','낮 12시'),view('sun-15','2026-03-21','15:00','오후 3시'),
 view('spring-21','2026-03-21','21:00','3월 21일 · 밤 9시'),view('spring-22','2026-03-21','22:00','3월 21일 · 밤 10시'),
 view('summer-21','2026-06-21','21:00','6월 21일 · 밤 9시'),view('autumn-21','2026-09-21','21:00','9월 21일 · 밤 9시'),view('winter-21','2026-12-21','21:00','12월 21일 · 밤 9시')
]);
export function skyViewUrl(id){
 const v=SKY_VIEWS.find(v=>v.id===id);if(!v)throw Error('관측 설정이 없습니다: '+id);
 const url=new URL('https://stellarium-web.org/');
 for(const [key,value] of Object.entries({lat:OBSERVER.latitude,lng:OBSERVER.longitude,date:new Date(`${v.date}T${v.time}:00+09:00`).toISOString().replace('.000',''),az:OBSERVER.azimuth,alt:OBSERVER.altitude,fov:OBSERVER.fov}))url.searchParams.set(key,value);
 return url.href;
}
export const SKY_COMPARISONS = Object.freeze({
 sun:{title:'하루 동안 태양의 위치',question:'남쪽을 향해 볼 때 태양의 위치는 어떻게 달라지나요?',views:['sun-09','sun-12','sun-15'],changed:'같은 날의 시각',fixed:'서울·3월 21일·남쪽·확대율',look:'화면 아래 S(남쪽)를 기준으로 태양이 왼쪽, 가운데 쪽, 오른쪽 중 어디에 있는지 비교해요.',core:'남쪽을 볼 때 왼쪽은 동쪽, 오른쪽은 서쪽이에요. 하루 동안 태양은 동쪽 쪽에서 서쪽 쪽으로 움직이는 것처럼 보여요.',more:'시계의 낮 12시와 태양이 정확히 남쪽에 오는 시각은 항상 같지 않아요. 한국에서 태양이 머리 바로 위에 온다고 설명하지 않아요.',memo:'관찰한 위치 변화와 지구의 자전을 한 문장으로 연결해 보세요.'},
 night:{title:'같은 밤 별무리의 이동',question:'한 시간 뒤에도 별무리의 모양과 위치가 모두 같을까요?',views:['spring-21','spring-22'],changed:'같은 밤의 시각',fixed:'서울·3월 21일·남쪽·확대율',look:'두 화면에 함께 보이는 밝은 별과 주변 별 배열을 골라 S에 대한 위치를 비교해요. 별자리 표시를 켜면 같은 대상을 찾기 쉬워요.',core:'별무리의 배열을 대조하며 위치가 달라진 방향을 찾아요. 남쪽 하늘의 하루 위치 변화는 지구의 자전과 연결해 설명해요.',more:'별이 실제로 똑같은 거리에 나란히 붙어 있다는 뜻은 아니에요. 별자리 선은 별을 찾도록 덧붙인 안내예요.',memo:'같은 별무리임을 확인한 근거와 위치가 바뀐 방향을 적어 보세요.'},
 seasons:{title:'계절이 다른 날의 남쪽 하늘',question:'장소와 시각이 같은데도 보이는 별무리가 달라지는 까닭은 무엇일까요?',views:['spring-21','summer-21','autumn-21','winter-21'],changed:'관찰 날짜',fixed:'서울·밤 9시·남쪽·확대율',look:'별자리 이름·선을 켜고 S 주위에서 보이는 별무리의 모양과 위치를 비교해요. 같은 별자리가 다른 날짜에도 보이는지 함께 찾아요.',core:'지구가 태양 둘레를 일 년에 한 바퀴 공전하면서 밤에 바라보는 우주의 방향이 달라져요.',more:'대표 별자리가 그 계절에만 보이는 것은 아니에요. 달의 밝기·지평선·대기 표시도 화면에 영향을 주므로 보이는 점의 개수만 세어 공전의 증거라고 하지 않아요.',memo:'같게 한 조건 → 달라진 별무리 → 공전의 관계로 설명해 보세요.'}
});
export const SKY_PROGRAM_NOTE='Stellarium Web의 계산 화면이에요. 서울의 실제 촬영 사진이나 우리 반의 야외 관측 결과가 아니며, 배경 풍경도 실제 서울 관측 장소를 뜻하지 않아요.';
export const SKY_PROGRAM_STEPS=Object.freeze(['설정 링크를 열고 장소가 서울인지 확인해요. 기기의 시간대가 한국과 다르면 표의 한국 시각과 프로그램 표시가 같은 순간인지 확인해요.','시계 창을 열어 일시 정지(Ⅱ)를 눌러요. 재생 삼각형이 보이고 시각이 멈추는지 확인해요. 비교 기록에 실제 표시 시각을 함께 적어요.','아래 S가 남쪽이에요. 화면을 끌거나 확대하지 않고 같은 방향과 확대율을 유지해요. 별 비교에서는 별자리 이름·선을 두 화면 모두 같은 상태로 맞춰요.','표시된 천체 이름이 모두 맨눈으로 보인다는 뜻은 아니에요. 화면이 안 열리면 관측을 했다고 채우지 말고 교사와 같은 설정을 다시 열어요.']);
