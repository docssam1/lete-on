import { SEMS_2022, contentId2022 } from './curriculum-2022.js?v=20261104-career-class';
import { READY, BOOK_UNITS } from './units-index.js?v=20261104-career-labels';

// 현재 연결된 교재의 워밍업과 기존 사진을 쓰는 홈 안내다.
const details = {
  "s31-u01": {
    "q": "겉모습이 같은 두 물체를 받침점에서 같은 거리에 놓으면 반드시 수평이 될까요?",
    "image": "book/s31-u01-photo-cart.webp",
    "imageAlt": "평평한 바닥의 작은 수레와 실은 물체"
  },
  "s31-u02": {
    "q": "같은 네 동물을 ‘날개가 있는가?’와 ‘몸이 깃털로 덮였는가?’로 나누면 모둠이 같을까요?",
    "image": "book/observation-20261102/duck.jpg",
    "imageAlt": "연못가의 바위에 서 있는 청둥오리의 부리·깃털·물갈퀴"
  },
  "s31-u03": {
    "q": "잎 사진을 나눌 기준만 정하면, 사진만으로 언제나 두 모둠을 정할 수 있을까요?",
    "image": "book/s31-u03-photo-observe.webp",
    "imageAlt": "잎 두 장과 돋보기, 빈 이름표를 놓은 관찰 준비 배치"
  },
  "s31-u04": {
    "q": "물을 준 씨앗은 따뜻한 곳, 물을 주지 않은 씨앗은 차가운 곳에 두었어요. 결과 차이를 물 때문이라고만 설명할 수 있을까요?",
    "image": "book/observation-20261102/seedling.jpg",
    "imageAlt": "흙이 담긴 화분에서 줄기와 잎이 자라는 어린 강낭콩"
  },
  "c22-s32-u01": {
    "q": "모양과 크기가 같고 재료가 다른 네 막대를 같은 방법으로 구부리면 결과도 같을까요?",
    "image": "book/c22-s32-u01-photo-materials.webp",
    "imageAlt": "나무토막·금속 숟가락·투명한 플라스틱 통·고무 지우개"
  },
  "c22-s32-u02": {
    "q": "두 물이 모두 투명해 보여요. 사진만 보고 녹아 있는 물질도 같다고 할 수 있을까요?",
    "image": "book/c22-s32-u02-photo-tidal-flat.webp",
    "imageAlt": "물이 빠진 때의 갯벌과 얕은 물길을 표현한 풍경"
  },
  "c22-s32-u03": {
    "q": "자를 길게 내밀면 소리가 더 커질까요?",
    "image": "book/c22-s32-u03-photo-drum.webp",
    "imageAlt": "작은북 위 종잇조각과 옆의 북채"
  },
  "c22-s32-u04": {
    "q": "일부 카드의 표식을 차례마다 빼면, 매 차례 두 규칙의 카드 수가 달라질까요?",
    "image": "book/c22-s32-u04-photo-glitter-shake.webp",
    "imageAlt": "반짝이 가루가 묻은 두 손이 악수하는 모습"
  },
  "s41-u01": {
    "q": "고리 자석이 붙거나 떠 있는 까닭은 무엇일까요?",
    "image": "book/s41-u01-photo-preparation.webp",
    "imageAlt": "자석·철 클립·나무와 알루미늄 시료를 따로 놓은 준비 모습"
  },
  "s41-u02": {
    "q": "얼음의 높이,마르는 접시,차가운 병의 물방울을 어떻게 함께 설명할까요?",
    "image": "book/s41-u02-photo-preparation.webp",
    "imageAlt": "빈 플라스틱 용기·분리한 뚜껑·얼음·마른 천·펜을 놓은 준비 모습"
  },
  "s41-u03": {
    "q": "물길·화산·암석의 변화는 어떤 근거로 설명할까요?",
    "image": "book/s41-u03-photo-preparation.webp",
    "imageAlt": "모래 쟁반·물컵·두 돌을 놓은 준비 장면"
  },
  "s41-u04": {
    "q": "작은 생물이 우리 생활과 어떻게 관련될까요?",
    "image": "book/s41-u04-photo-preparation.webp",
    "imageAlt": "식용 버섯의 갓 안쪽과 접시에 놓인 빵의 준비 장면"
  },
  "c22-s42-u01": {
    "q": "여러 날 달의 모양과 위치를 비교하려면 어떤 기록을 함께 봐야 할까요?",
    "image": "book/c22-s42-u01-moon-apollo8-nasa.jpg",
    "imageAlt": "아폴로8 우주선에서 촬영한 달의 둥근 윤곽과 밝고 어두운 지형",
    "imageFit": "contain"
  },
  "c22-s42-u02": {
    "q": "풀 → 토끼 → 여우만 사는 풀밭에서 여우가 모두 사라지면, 몇 해 뒤 토끼와 풀은 어떻게 될까요?",
    "image": "book/ecology-20261028/habitat.jpg",
    "imageAlt": "나무와 풀이 자라고 물과 흙이 함께 보이는 연못가"
  },
  "c22-s42-u03": {
    "q": "공기는 보이지 않는데 어떻게 알아볼까요?",
    "image": "book/c22-s42-u03-syringe-nadine90.jpg",
    "imageAlt": "바늘을 끼우지 않은30mL 주사기의 열린 입구·몸통·눈금·피스톤"
  },
  "c22-s42-u04": {
    "q": "높이3.5 cm의 벽이 있으면 모든 물높이에서 젖는 집이 더 적을까요?",
    "image": "book/c22-s42-u04-photo-model-no-wall-v2.webp",
    "imageAlt": "투명한 통의 점토 지형과 모형 집 다섯 채"
  },
  "c22-s51-u01": {
    "q": "자갈은 언제나 맨 아래에 놓일까요?",
    "image": "book/c22-s51-u01-fern-nps.jpg",
    "imageAlt": "줄기 양옆으로 작은 잎 모양이 이어진 고사리 화석"
  },
  "c22-s51-u02": {
    "q": "불을 켜면 상자 속 장난감은 왜 보일까요?",
    "image": "photos/s42-u03-shadow.webp",
    "imageAlt": "손전등과 물체를 놓고 그림자를 비교하는 모습"
  },
  "c22-s51-u03": {
    "q": "설탕이 안 보이고 두 설탕물이 모두 맑다면 무엇을 더 확인할까요?",
    "image": "activities/c22-s51-u03/mixing-photo-v1.webp",
    "imageAlt": "왼쪽 설탕, 가운데 물, 오른쪽 맑은 설탕물을 나란히 보여 주는 실사형 장면"
  },
  "c22-s51-u04": {
    "q": "걸을 때에는 어떤 기관이 함께 일할까요?",
    "image": "activities/c22-s51-u04/torso-model-photo-v1.webp",
    "imageAlt": "두 폐 사이의 심장, 그 아래 간과 위, 아래쪽 창자들을 보여 주는 플라스틱 인체 교육 모형"
  },
  "c22-s52-u01": {
    "q": "모래와 자갈, 소금과 모래를 같은 체로 나눌 수 있을까요?",
    "image": "activities/c22-s52-u01/mixture-photo-v1.png",
    "imageAlt": "낮은 쟁반에 작은 모래와 큰 회색 자갈이 섞여 있고 옆 접시에 각각의 재료가 놓인 설명 장면."
  },
  "c22-s52-u02": {
    "q": "차가운 물병을 수건으로 감싸면 물의 온도는 어떻게 될까요?",
    "image": "activities/c22-s52-u02/measure-photo-v1.webp",
    "imageAlt": "물속 중앙에 온도 탐침이 고정되어 벽·바닥과 떨어져 있는 설명 장면."
  },
  "c22-s52-u03": {
    "q": "아침에 안개가 끼면 오후에는 반드시 비가 올까요?",
    "image": "activities/c22-s52-u03/dew.webp",
    "imageAlt": "두 컵 중 오른쪽 외벽에 물방울이 보이는 설명 장면."
  },
  "c22-s52-u04": {
    "q": "재생에너지는 언제 어디서나 끝없이 쓸 수 있을까요?",
    "image": "activities/c22-s52-u04/resources.webp",
    "imageAlt": "물 든 투명 용기·나무 조각·암석 표본과 금속 숟가락을 분리해 놓은 설명 장면."
  },
  "c22-s61-u01": {
    "q": "맑고 무색이면 성질도 같을까요?",
    "image": "activities/c22-s61-u01/observe.webp",
    "imageAlt": "같은 모양의 닫힌 시료병 세 개에 맑은 무색·옅은 노란색·옅은 푸른색 액체가 따로 담긴 설명 장면."
  },
  "c22-s61-u02": {
    "q": "사진 한 장으로 운동과 빠르기를 알까요?",
    "image": "book/s31-u01-photo-cart.webp",
    "imageAlt": "블록을 실은 작은 나무 수레"
  },
  "c22-s61-u03": {
    "q": "식물의 기관은 어떻게 함께 일할까요?",
    "image": "book/s31-u03-photo-observe.webp",
    "imageAlt": "펼쳐진 잎과 돋보기"
  },
  "c22-s61-u04": {
    "q": "하늘의 위치 변화는 왜 생길까요?",
    "image": "activities/c22-s61-u04/model-preparation.webp",
    "imageAlt": "LED 광원과 빨간 표시가 있는 흰 공을 받침에 놓은 준비 예"
  },
  "c22-s62-u01": {
    "q": "여름과 겨울은 왜 다를까요?",
    "image": "activities/c22-s62-u01/measurement-materials.webp",
    "imageAlt": "흰 받침판·나무 막대·실·테이프·연필의 준비 재료 예"
  },
  "c22-s62-u02": {
    "q": "양초가 녹을 때와 탈 때는 같을까요?",
    "image": "activities/c22-s62-u02/candle-reference.webp",
    "imageAlt": "넓은 도자기 받침에 놓인 흰 양초와 심지의 불꽃"
  },
  "c22-s62-u03": {
    "q": "손전등이 켜지지 않으면 무엇부터 살펴볼까요?",
    "image": "activities/c22-s62-u03/bulb-reference.webp",
    "imageAlt": "작은 전구 밑부분의 옆 금속·절연 부분·바닥 금속 접점"
  },
  "c22-s62-u04": {
    "q": "어떤 일에서 과학을 찾아보고 싶나요?",
    "image": "activities/c22-s62-u04/camera-reference.webp",
    "imageAlt": "뒷면의 화면이 꺼진 카메라와 렌즈의 바깥 모습"
  }
};

export const currentCourses = SEMS_2022.flatMap(semester => semester.units.map(unit => ({ ...unit, sem: semester.sem, id: contentId2022(unit.position) })))
  .filter(unit => READY[unit.id] && READY[unit.id].lesson !== false && !READY[unit.id]?.bankOnly && BOOK_UNITS.has(unit.id) && details[unit.id])
  .map(unit => ({ ...unit, ...details[unit.id], current: true, theme: '#2f6b4a', lab: READY[unit.id].hero, skills: ['관찰·비교', '개념 이해', '설명·토의'] }));
