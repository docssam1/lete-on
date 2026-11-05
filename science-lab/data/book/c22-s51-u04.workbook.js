import{withBodyReadableWorkbook}from'./c22-s51-u04.editorial.js?v=20261106-body-readable-workbook';
import{withLearnerExplanations}from'./learner-explanations.js';
import{withObservationLanguage}from'./observation-language.js';
import{withBodyEditorial,withBodyUpperProgression}from'./c22-s51-u04.editorial.js?v=20261105-body-upper-progression';
// 우리 몸96문항. scripts/gen-science-workbook-c22s51u04.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s51-u04",
 "title": "우리 몸의 구조와 기능",
 "semester": "5-1",
 "no": 4,
 "theme": "#2456c4",
 "book": "지필드 실험 과학",
 "richText": true,
 "questions": [
  {
   "id": "body-book-01",
   "no": 1,
   "status": "authored",
   "form": "choice",
   "topic": "기관의 협력",
   "prompt": "걷는 동안 우리 몸에서 일어나는 일로 알맞은 것은?",
   "answer": "②",
   "explanation": "몸의 움직임에는 뼈·근육뿐 아니라 필요한 물질을 얻고 운반하는 여러 기관의 기능이 연결된다.",
   "misconception": "한 기관만 따로 일한다고 생각하지 않는다.",
   "criteria": "뼈·근육과 호흡·순환 등 여러 기관이 함께 일한다는 보기를 고른다.",
   "choices": [
    "다리 근육만 일하므로 호흡과 순환은 변하지 않는다.",
    "뼈·근육과 호흡·순환 등 여러 기관이 함께 일한다.",
    "받아들인 산소는 혈액을 거치지 않고 다리로 간다.",
    "운동 중에는 소화와 배설 기관이 모두 일을 멈춘다."
   ],
   "key": 1,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-02",
   "no": 2,
   "status": "authored",
   "form": "blank",
   "topic": "기관의 역할",
   "prompt": "혈액을 온몸으로 내보내는 펌프 역할의 기관은 [ ], 오줌을 만드는 기관은 [ ]이다.",
   "answer": "심장, 콩팥",
   "explanation": "심장은 혈액을 순환시키며 콩팥은 혈액 속 노폐물과 여분의 물 등을 걸러 오줌을 만든다.",
   "misconception": "방광은 오줌을 만드는 곳이 아니라 저장하는 곳이다.",
   "criteria": "혈액을 내보내는 심장과 오줌을 만드는 콩팥을 각각 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-03",
   "no": 3,
   "status": "authored",
   "form": "match",
   "topic": "두 경로",
   "prompt": "지나가는 물질과 경로를 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ",
   "explanation": "음식물과 오줌은 서로 다른 기관과 길을 거친다.",
   "misconception": "섭취한 물이 곧바로 오줌관으로 떨어진다고 설명하지 않는다.",
   "criteria": "음식물이 지나는 소화 경로와 만들어진 오줌의 이동 경로를 따로 연결한다.",
   "given": [
    "ㄱ 입→식도→위   ㄴ 콩팥→오줌관→방광"
   ],
   "parts": [
    "(1) 음식물이 지나가는 경로 [ ]",
    "(2) 만들어진 오줌이 이동하는 경로 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-04",
   "no": 4,
   "status": "authored",
   "form": "written",
   "topic": "자료와 실제 관찰",
   "prompt": "“표에서 운동 뒤 맥박 수가 늘었다.”는 답만으로 내가 직접 관찰했다고 할 수 있나요?",
   "answer": "없다. 제공된 표를 해석한 것과 내가 관찰한 것은 다르며 실제 날짜·방법·관찰값이 필요하다.",
   "explanation": "수치 문제 풀이와 실제 몸의 변화 관찰은 다른 근거다.",
   "misconception": "정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
   "criteria": "자료/직접 수행 구별1, 실제 관찰 근거1.",
   "lines": 8,
   "previousCriteria": "자료/직접 수행 구별1, 실제 관찰 근거1.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-05",
   "no": 5,
   "status": "authored",
   "form": "blank",
   "topic": "뼈와 관절",
   "prompt": "뼈와 뼈가 연결되는 부분을 [ ]이라고 한다.",
   "answer": "관절",
   "explanation": "움직일 수 있는 관절 덕분에 팔꿈치 등을 굽히거나 펼 수 있다. 모든 뼈 연결이 같은 범위로 움직이지는 않는다.",
   "misconception": "뼈 한가운데가 고무처럼 휜다고 생각하지 않는다.",
   "criteria": "뼈와 뼈가 연결되는 관절을 넣는다. 근육과 구별한다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-06",
   "no": 6,
   "status": "authored",
   "form": "choice",
   "topic": "뼈의 기능",
   "prompt": "갈비뼈의 생김새와 기능을 바르게 연결한 것은?",
   "answer": "③",
   "explanation": "휘어진 갈비뼈들이 가슴을 둘러싸 내부 기관을 보호한다.",
   "misconception": "뼈의 이름만 외우지 않고 형태와 기능을 연결한다.",
   "criteria": "휘어진 여러 뼈가 가슴 공간을 이루어 심장·폐를 보호한다는 보기를 고른다.",
   "choices": [
    "납작한 여러 부분이 머리를 둘러싸 뇌를 보호한다.",
    "짧은 뼈들이 기둥처럼 이어져 척수를 보호한다.",
    "여러 뼈가 휘어 가슴 공간을 이루고 심장·폐를 보호한다.",
    "긴 뼈가 관절로 이어져 팔꿈치를 굽히고 펴게 한다."
   ],
   "key": 2,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-07",
   "no": 7,
   "status": "authored",
   "form": "choice",
   "topic": "팔의 움직임",
   "prompt": "팔꿈치를 굽힐 때 안쪽 근육의 변화로 알맞은 것은?",
   "answer": "①",
   "explanation": "대표적인 팔 굽힘에서 안쪽 근육이 수축하며 뼈를 당긴다. 펴는 동작에서는 바깥쪽 근육의 수축이 관련된다.",
   "misconception": "근육이 뼈를 미는 것과 수축해 당기는 것을 혼동하지 않는다.",
   "criteria": "이 팔 굽힘에서 안쪽 근육이 짧아져 뼈를 당긴다는 보기를 고른다.",
   "choices": [
    "안쪽 근육이 짧아지며 뼈를 당긴다.",
    "안쪽 근육이 없어지고 뼈가 스스로 움직인다.",
    "안쪽 근육이 길어져 뼈를 앞으로 민다.",
    "팔의 뼈 자체가 짧아져 접힌다."
   ],
   "key": 0,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-08",
   "no": 8,
   "status": "authored",
   "form": "match",
   "topic": "뼈의 도움",
   "prompt": "뼈와 하는 일을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "뼈는 몸을 지탱하고 중요한 기관을 보호하며 근육과 함께 움직임에 관여한다.",
   "misconception": "머리뼈를 반드시 하나의 뼈라고 설명하지 않는다.",
   "criteria": "머리뼈의 뇌 보호·갈비뼈의 심장/폐 보호·등뼈의 지탱/척수 보호를 각각 연결한다.",
   "given": [
    "ㄱ 뇌 보호   ㄴ 가슴속 기관 보호   ㄷ 몸 지탱"
   ],
   "parts": [
    "(1) 머리뼈 [ ]",
    "(2) 갈비뼈 [ ]",
    "(3) 등뼈 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-09",
   "no": 9,
   "status": "authored",
   "form": "multi",
   "topic": "모형의 대응",
   "prompt": "막대·연결핀·당기는 실로 팔 모형을 만들었습니다. 알맞은 설명을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "대응하는 기능과 실제 몸과 다른 점을 함께 읽어야 한다. 모형 실은 스스로 수축하지 않는다.",
   "misconception": "모형 재료가 실제 기관과 완전히 같다고 일반화하지 않는다.",
   "criteria": "막대=뼈·연결핀=관절·실 당김=움직임 표현을 고른다. 실이 실제 근육과 모든 성질이 같다는 선택은 제외한다.",
   "choices": [
    "막대는 뼈에 대응한다.",
    "연결핀은 관절에 대응한다.",
    "실은 실제 근육과 모든 성질이 같다.",
    "실을 당겨 굽히는 것은 당김으로 움직임을 표현한다."
   ],
   "key": [
    0,
    1,
    3
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-10",
   "no": 10,
   "status": "authored",
   "form": "written",
   "topic": "모형의 한계",
   "prompt": "손으로 막대를 굽히니 두 용수철의 길이가 바뀌었습니다. 이것만으로 근육이 스스로 수축하는 과정을 재현했다고 할 수 있나요?",
   "answer": "없다. 모형은 손으로 막대를 움직인 뒤 용수철 길이가 변한 것이며, 실제 근육이 수축해 뼈를 당기는 것과 구별해야 한다.",
   "explanation": "모형의 관찰은 자세에 따른 길이 변화에 도움을 주지만 움직임의 원인을 그대로 재현한 것은 아니다.",
   "misconception": "팔이 먼저 움직여서 근육이 수축한다고 원인을 거꾸로 설명하지 않는다.",
   "criteria": "모형에서 실제로 한 일1, 실제 몸과 원인의 차이1.",
   "previousCriteria": "모형에서 실제로 한 일1, 실제 몸과 원인의 차이1.",
   "lines": 8,
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-11",
   "no": 11,
   "status": "authored",
   "form": "blank",
   "topic": "소화의 뜻",
   "prompt": "음식물을 몸에 흡수할 수 있는 작은 형태로 바꾸는 과정을 [ ]라고 한다.",
   "answer": "소화",
   "explanation": "잘게 부수고 소화액의 도움을 받는 등 여러 기관의 작용으로 영양소를 흡수하기 쉬워진다.",
   "misconception": "단순히 위에 잠시 보관하는 것만을 소화라고 하지 않는다.",
   "criteria": "흡수할 수 있는 작은 형태로 바꾸는 소화를 넣는다. 흡수·운반과 나눈다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-12",
   "no": 12,
   "status": "authored",
   "form": "choice",
   "topic": "영양소 흡수",
   "prompt": "소화된 영양소가 주로 몸속으로 흡수되는 기관은?",
   "answer": "④",
   "explanation": "작은창자는 소화를 마무리하고 소화된 영양소를 주로 흡수한다.",
   "misconception": "음식물이 지나간다는 사실만으로 모든 기관의 기능을 같게 보지 않는다.",
   "criteria": "소화된 영양소를 주로 흡수하는 작은창자를 고른다.",
   "choices": [
    "위",
    "간",
    "큰창자",
    "작은창자"
   ],
   "key": 3,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-13",
   "no": 13,
   "status": "authored",
   "form": "order",
   "topic": "음식물의 길",
   "prompt": "음식물이 지나가는 순서를 배열하세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㅁ → ㄷ → ㅂ",
   "explanation": "입에서 들어온 음식물은 식도·위·작은창자·큰창자를 거치고 찌꺼기가 항문으로 나간다.",
   "misconception": "간이나 심장을 음식물이 직접 지나는 길에 넣지 않는다.",
   "criteria": "이 문항 기호로 입→식도→위→작은창자→큰창자→항문의 순서를 확인한다.",
   "given": [
    "ㄱ 위   ㄴ 입   ㄷ 큰창자   ㄹ 식도   ㅁ 작은창자   ㅂ 항문"
   ],
   "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-14",
   "no": 14,
   "status": "authored",
   "form": "match",
   "topic": "소화 기관 기능",
   "prompt": "기관과 기능을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "식도는 음식물을 위로 보내고 작은창자와 큰창자는 주된 기능이 다르다.",
   "misconception": "작은창자/큰창자를 크기 이름만으로 바꾸지 않는다.",
   "criteria": "식도의 이동·작은창자의 영양소 흡수·큰창자의 물 흡수를 각각 연결한다.",
   "given": [
    "ㄱ 음식물 이동   ㄴ 주로 영양소 흡수   ㄷ 남은 내용물의 물 흡수"
   ],
   "parts": [
    "(1) 식도 [ ]",
    "(2) 작은창자 [ ]",
    "(3) 큰창자 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-15",
   "no": 15,
   "status": "authored",
   "form": "multi",
   "topic": "지나는 길과 돕는 기관",
   "prompt": "음식물이 직접 지나는 기관을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "간은 소화를 돕는 물질을 만들지만 음식물이 간 속을 직접 지나가지는 않는다.",
   "misconception": "소화에 도움을 준다는 것과 음식물 통과를 구별한다.",
   "criteria": "위·작은창자·식도를 고른다. 소화를 돕는 간을 음식물이 직접 지나는 길에 넣지 않는다.",
   "choices": [
    "위",
    "간",
    "작은창자",
    "식도"
   ],
   "key": [
    0,
    2,
    3
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-16",
   "no": 16,
   "status": "authored",
   "form": "written",
   "topic": "기관의 모양과 기능",
   "prompt": "작은창자가 길게 이어져 있고 안쪽에 작은 돌기들이 있는 점은 영양소 흡수에 어떤 도움이 되나요?",
   "answer": "음식물과 닿는 면적을 넓혀 소화된 영양소를 흡수하는 데 도움이 된다.",
   "explanation": "기관의 길이와 안쪽 구조를 흡수 기능과 연결한다. 정확한 길이나 현미경 세부 명칭은 요구하지 않는다.",
   "misconception": "큰창자보다 가늘기 때문에 흡수를 못 한다고 생각하지 않는다.",
   "criteria": "표면/면적과 연결1, 영양소 흡수 기능1.",
   "previousCriteria": "표면/면적과 연결1, 영양소 흡수 기능1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-17",
   "no": 17,
   "status": "authored",
   "form": "blank",
   "topic": "순환의 역할",
   "prompt": "심장은 혈액을 내보내는 [ ] 역할을 하고, 혈관은 혈액이 흐르는 [ ]이다.",
   "answer": "펌프, 길",
   "explanation": "심장의 수축과 이완으로 혈액이 혈관을 따라 순환한다.",
   "misconception": "혈관을 공기만 지나는 관이라고 하지 않는다.",
   "criteria": "심장의 펌프 역할과 혈액이 흐르는 혈관의 길 역할을 각각 완성한다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-18",
   "no": 18,
   "status": "authored",
   "form": "choice",
   "topic": "혈액의 운반",
   "prompt": "혈액이 온몸으로 운반하는 물질의 예로 알맞은 것은?",
   "answer": "②",
   "explanation": "폐에서 받아들인 산소와 소화·흡수된 영양소 등이 혈액을 통해 필요한 곳으로 운반된다.",
   "misconception": "심장이 영양소와 산소를 직접 만들어 낸다고 설명하지 않는다.",
   "criteria": "혈액으로 운반되는 산소와 흡수된 영양소를 고른다. 음식 덩어리와 구별한다.",
   "choices": [
    "소화되지 않은 음식물 조각",
    "산소와 흡수된 영양소",
    "혈관 속을 지나는 공기 덩어리",
    "땀과 오줌 전체를 섞은 것"
   ],
   "key": 1,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-19",
   "no": 19,
   "status": "authored",
   "form": "choice",
   "topic": "심장의 위치",
   "prompt": "앞에서 본 몸 모형에서 심장 위치를 설명한 것으로 알맞은 것은?",
   "answer": "③",
   "explanation": "심장은 가슴 가운데 두 폐 사이에서 약간 왼쪽으로 치우쳐 있다. 앞에서 볼 때 모델의 왼쪽은 보는 사람의 오른쪽이다.",
   "misconception": "“왼쪽 가슴 아래”만 외워 배에 있다고 표시하지 않는다.",
   "criteria": "몸 기준 가슴 가운데에서 약간 왼쪽에 있는 심장 위치를 고른다. 그림을 보는 사람의 좌우와 구별한다.",
   "choices": [
    "가슴 가운데에서 약간 몸의 오른쪽",
    "배 윗부분에서 약간 몸의 왼쪽",
    "가슴 가운데에서 약간 몸의 왼쪽",
    "가슴 왼쪽 가장자리에서 팔 쪽"
   ],
   "key": 2,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-20",
   "no": 20,
   "status": "authored",
   "form": "order",
   "topic": "순환의 연결",
   "prompt": "혈액이 산소를 받아 온몸으로 운반하는 순환의 큰 흐름을 배열하세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "폐에서 산소를 받은 혈액은 심장을 거쳐 온몸으로 보내지고 다시 심장으로 돌아오는 순환을 한다.",
   "misconception": "한 번 온몸에 가면 혈액이 사라진다고 생각하지 않는다.",
   "criteria": "폐에서 산소 받기→심장이 온몸으로 보냄→온몸→심장으로 돌아옴의 큰 흐름을 문항 기호로 확인한다.",
   "given": [
    "ㄱ 온몸   ㄴ 폐에서 산소 받기   ㄷ 심장으로 돌아오기   ㄹ 심장에서 온몸으로 보내기"
   ],
   "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-21",
   "no": 21,
   "status": "authored",
   "form": "multi",
   "topic": "혈액이 하는 일",
   "prompt": "혈액의 역할을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "혈액은 필요한 물질과 몸에서 생긴 노폐물 등을 운반한다. 콩팥에서는 혈액 속 물질 일부가 걸러져 오줌이 된다.",
   "misconception": "혈액과 오줌을 같은 전체로 보지 않는다.",
   "criteria": "영양소·산소·이산화탄소 운반을 고른다. 혈액 전체가 오줌으로 바뀐다는 주장은 제외한다.",
   "choices": [
    "흡수된 영양소를 운반한다.",
    "몸에서 생긴 이산화탄소를 폐로 운반한다.",
    "혈액 자체가 콩팥에서 모두 오줌으로 변한다.",
    "산소를 몸의 여러 곳에 운반한다."
   ],
   "key": [
    0,
    1,
    3
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-22",
   "no": 22,
   "status": "authored",
   "form": "written",
   "topic": "모형의 색",
   "prompt": "혈관 모형에서 일부 관을 파란색으로 칠했습니다. 실제 혈액이 파란색이라고 말할 수 있나요?",
   "answer": "없다. 모형의 색은 길이나 상태를 구별하는 표시이며 실제 혈액은 파란색이 아니다.",
   "explanation": "구분을 위한 색과 실제 기관의 색·물질을 나누어 해석한다.",
   "misconception": "파란 관을 보았다는 사실을 실제 혈액 색의 관찰로 바꾸지 않는다.",
   "criteria": "모형의 표시임1, 실제 혈액 색과 구별1.",
   "previousCriteria": "모형의 표시임1, 실제 혈액 색과 구별1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-23",
   "no": 23,
   "status": "authored",
   "form": "blank",
   "topic": "공기의 길",
   "prompt": "코로 들이마신 공기는 기관, [ ]를 거쳐 폐로 이동한다.",
   "answer": "기관지",
   "explanation": "기관에서 갈라진 기관지는 폐로 이어진다. 입으로도 공기가 드나들 수 있다.",
   "misconception": "공기가 음식물과 함께 식도를 거쳐 폐로 간다고 하지 않는다.",
   "criteria": "기관 다음 폐로 이어지는 공기 길인 기관지를 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-24",
   "no": 24,
   "status": "authored",
   "form": "choice",
   "topic": "폐의 역할",
   "prompt": "폐에서 일어나는 일로 알맞은 것은?",
   "answer": "④",
   "explanation": "폐와 혈액 사이에서 산소와 이산화탄소가 교환된다.",
   "misconception": "들숨을 순수한 산소, 날숨을 순수한 이산화탄소라고 생각하지 않는다.",
   "criteria": "폐가 산소를 받아들이고 이산화탄소를 내보내는 데 관여한다는 보기를 고른다.",
   "choices": [
    "들어온 공기의 산소를 전부 이산화탄소로 바꾼다.",
    "혈액을 온몸으로 내보내는 펌프 역할을 한다.",
    "들어온 공기에서 질소만 골라 몸에 받아들인다.",
    "공기 중 산소를 받아들이고 이산화탄소를 내보내는 데 관여한다."
   ],
   "key": 3,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-25",
   "no": 25,
   "status": "authored",
   "form": "choice",
   "topic": "호흡 모형",
   "prompt": "밀폐된 병의 고무막을 아래로 당기자 안의 풍선이 커졌습니다. 이에 대응하는 설명은?",
   "answer": "①",
   "explanation": "모형에서 막을 내리면 병 안 공간이 커져 관을 통해 공기가 풍선으로 들어온다. 실제 들숨에는 가로막과 갈비뼈 움직임이 관련된다.",
   "misconception": "고무막을 내린 것을 날숨과 연결하지 않는다.",
   "criteria": "아래 막 당김·가슴 안 공간 증가·공기 유입의 들숨 대응을 고른다.",
   "choices": [
    "가슴 안 공간이 커지면서 공기가 들어오는 들숨",
    "가슴 안 공간이 작아지면서 공기가 들어오는 들숨",
    "가슴 안 공간이 커지면서 공기가 나가는 날숨",
    "가슴 안 공간이 작아지면서 공기가 나가는 날숨"
   ],
   "key": 0,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-26",
   "no": 26,
   "status": "authored",
   "form": "match",
   "topic": "호흡 모형 대응",
   "prompt": "모형 재료와 대응하는 부분을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "병은 실제 갈비뼈처럼 움직이지 않는 등 모형에는 한계가 있다.",
   "misconception": "겉모양이 같아야만 모형의 대응이 가능한 것은 아니다.",
   "criteria": "풍선=폐·고무막=가로막·병=가슴 공간의 대응을 각각 연결한다. 실제 몸과 완전히 같다는 뜻은 아니다.",
   "given": [
    "ㄱ 폐   ㄴ 가로막   ㄷ 가슴 공간을 둘러싼 부분"
   ],
   "parts": [
    "(1) 풍선 [ ]",
    "(2) 아래 고무막 [ ]",
    "(3) 병 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-27",
   "no": 27,
   "status": "authored",
   "form": "order",
   "topic": "공기가 나가는 길",
   "prompt": "코로 내쉴 때의 공기 이동을 배열하세요.",
   "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
   "explanation": "날숨은 들숨 때와 반대 방향으로 폐에서 기관지·기관을 거쳐 몸 밖으로 나간다.",
   "misconception": "들이쉬는 방향을 그대로 쓰지 않는다.",
   "criteria": "이 문항 기호로 폐→기관지→기관→코의 날숨 공기 순서를 확인한다.",
   "given": [
    "ㄱ 기관   ㄴ 코   ㄷ 폐   ㄹ 기관지"
   ],
   "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-28",
   "no": 28,
   "status": "authored",
   "form": "written",
   "topic": "모형과 실제 몸",
   "prompt": "병과 풍선 모형이 실제 몸의 호흡을 모두 똑같이 보여 주지 못하는 점을 하나 설명하세요.",
   "answer": "병은 실제 갈비뼈처럼 움직이지 않고, 모형 풍선은 실제 폐의 세부 구조나 기체 교환을 보여 주지 못한다.",
   "explanation": "대응하는 점뿐 아니라 구현하지 않은 구조·기능을 밝힌다. 타당한 한계 한 가지면 인정한다.",
   "misconception": "풍선이 커졌다는 것만으로 산소와 이산화탄소 교환을 측정했다고 하지 않는다.",
   "criteria": "구체적인 모형 한계1, 실제 기관과 비교1.",
   "previousCriteria": "구체적인 모형 한계1, 실제 기관과 비교1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-29",
   "no": 29,
   "status": "authored",
   "form": "blank",
   "topic": "오줌 생성과 저장",
   "prompt": "오줌을 만드는 곳은 [ ], 오줌을 잠시 모아 두는 곳은 [ ]이다.",
   "answer": "콩팥, 방광",
   "explanation": "콩팥에서 만들어진 오줌은 오줌관을 지나 방광에 저장된다.",
   "misconception": "방광이 혈액을 직접 걸러 오줌을 만든다고 하지 않는다.",
   "criteria": "오줌 생성 콩팥과 잠시 저장하는 방광을 각각 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-30",
   "no": 30,
   "status": "authored",
   "form": "choice",
   "topic": "콩팥의 기능",
   "prompt": "콩팥이 하는 일로 알맞은 것은?",
   "answer": "①",
   "explanation": "콩팥의 주된 역할을 다른 기관의 역할과 구별한다.",
   "misconception": "오줌은 소화되지 않은 음식물이 그대로 변한 것이라고 하지 않는다.",
   "criteria": "혈액 속 노폐물과 여분의 물 등을 걸러 오줌을 만드는 콩팥의 기능을 고른다.",
   "choices": [
    "혈액 속 노폐물과 여분의 물 등을 걸러 오줌을 만든다.",
    "오줌을 몸 밖으로 내보내기 전에 잠시 모아 둔다.",
    "소화되고 남은 음식물 찌꺼기에서 물을 흡수한다.",
    "받아들인 산소를 혈액으로 온몸에 내보낸다."
   ],
   "key": 0,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-31",
   "no": 31,
   "status": "authored",
   "form": "choice",
   "topic": "물질이 나가는 길",
   "prompt": "콩팥에서 만들어진 오줌이 몸 밖으로 나가는 순서는?",
   "answer": "②",
   "explanation": "오줌관과 요도는 위치와 역할이 다른 길이다.",
   "misconception": "오줌관과 요도를 같은 위치의 한 이름으로 바꾸지 않는다.",
   "criteria": "콩팥→오줌관→방광→요도의 오줌 경로를 고른다.",
   "choices": [
    "콩팥→방광→오줌관→요도",
    "콩팥→오줌관→방광→요도",
    "방광→콩팥→요도→오줌관",
    "콩팥→오줌관→요도→방광"
   ],
   "key": 1,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-32",
   "no": 32,
   "status": "authored",
   "form": "match",
   "topic": "배설 관련 기관",
   "prompt": "부분과 역할을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "만들기·이동·저장은 다른 기관의 역할이며 연결되어 있다.",
   "misconception": "기관 이름이 비슷하다고 기능을 합치지 않는다.",
   "criteria": "방광=저장·오줌관=이동·콩팥=생성으로 각각 연결한다.",
   "given": [
    "ㄱ 오줌 저장   ㄴ 오줌 이동   ㄷ 혈액 속 물질 걸러 오줌 생성"
   ],
   "parts": [
    "(1) 방광 [ ]",
    "(2) 오줌관 [ ]",
    "(3) 콩팥 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-33",
   "no": 33,
   "status": "authored",
   "form": "multi",
   "topic": "배설과 소화 찌꺼기",
   "prompt": "알맞은 설명을 모두 고르세요.",
   "answer": "①, ②, ③",
   "explanation": "오줌 배설 경로와 소화 찌꺼기 배출 경로를 구별한다.",
   "misconception": "모두 몸 밖으로 나온다고 같은 기관을 지난다고 하지 않는다.",
   "criteria": "콩팥의 오줌 생성·항문의 찌꺼기 배출·방광 저장을 고른다. 두 물질의 길을 섞은 선택은 제외한다.",
   "choices": [
    "콩팥에서 오줌이 만들어진다.",
    "소화되고 남은 찌꺼기는 항문으로 나간다.",
    "방광은 오줌을 잠시 저장한다.",
    "콩팥이 음식물 찌꺼기를 통째로 항문으로 보낸다."
   ],
   "key": [
    0,
    1,
    2
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-34",
   "no": 34,
   "status": "authored",
   "form": "written",
   "topic": "땀의 해석",
   "prompt": "땀을 많이 흘리면 무조건 몸속 노폐물이 모두 빠져 건강해진다는 주장을 검토하세요.",
   "answer": "그렇게 단정할 수 없다. 땀은 체온 조절과 관련되며 땀 양만으로 노폐물 제거량이나 건강 상태를 판단할 수 없다.",
   "explanation": "몸속 물질을 처리하는 여러 기관의 역할이 있다. 땀을 내기 위한 무리한 활동을 건강 실천으로 요구하지 않는다.",
   "misconception": "땀을 많이 내는 것을 건강 점수로 바꾸지 않는다.",
   "criteria": "단정 불가1, 땀의 기능/건강 판정 한계1.",
   "previousCriteria": "단정 불가1, 땀의 기능/건강 판정 한계1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-35",
   "no": 35,
   "status": "authored",
   "form": "blank",
   "topic": "기능의 연결",
   "prompt": "폐에서 받아들인 산소와 작은창자에서 흡수한 영양소를 운반하는 것은 [ ]이다.",
   "answer": "혈액",
   "explanation": "소화·호흡으로 얻은 필요한 물질을 순환 기능이 몸의 여러 곳으로 운반한다.",
   "misconception": "기관 하나가 모든 물질을 직접 만든다고 하지 않는다.",
   "criteria": "산소와 흡수한 영양소를 운반하는 혈액을 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-36",
   "no": 36,
   "status": "authored",
   "form": "choice",
   "topic": "운동과 변화",
   "prompt": "가벼운 걷기 전후 몸의 변화를 알아볼 공정한 방법은?",
   "answer": "③",
   "explanation": "비교할 사람·시간·방법을 맞추고 실제 변화와 불분명을 기록한다.",
   "misconception": "관찰을 친구 간 건강 순위 매기기로 바꾸지 않는다.",
   "criteria": "같은 사람·방법·관찰 구간 길이의 전후 비교를 고른다. 다른 사람이나 다른 구간의 횟수를 바로 비교하지 않는다.",
   "choices": [
    "친구마다 다른 시간 동안 센 맥박 횟수를 그대로 비교한다.",
    "숨을 오래 참아 가장 높은 수치를 만든다.",
    "같은 사람에게서 같은 방법·같은 길이의 시간으로 전후를 관찰한다.",
    "예상과 다른 실제 값을 지우고 책의 값으로 바꾼다."
   ],
   "key": 2,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-37",
   "no": 37,
   "status": "authored",
   "form": "short",
   "topic": "관찰 시간",
   "prompt": "연습 자료: 같은 학생에게서 같은 방법으로 맥박을 30초 동안 관찰했다. 걷기 전 38회, 직후 49회였다. 직후는 전보다 30초 동안 몇 회 더 많았나요?",
   "answer": "11회",
   "explanation": "49-38=11이다. 이 답은 같은 30초 동안의 차이이며 1분 실측값이 아니다.",
   "misconception": "시간 단위를 빼고 횟수만 비교하지 않는다.",
   "criteria": "같은30초 조건에서49-38=11회를 쓴다. 이를1분 실제 관찰값으로 바꾸지 않는다.",
   "previousCriteria": "조건에 맞는 동등한 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-38",
   "no": 38,
   "status": "authored",
   "form": "order",
   "topic": "관찰 절차",
   "prompt": "몸의 변화 관찰 순서를 배열하세요.",
   "answer": "ㄴ → ㄱ → ㄷ → ㄹ",
   "explanation": "관찰을 시작하기 전 방법·시간·도움과 참여 방식을 정한다. 관찰 시점도 기록한다.",
   "misconception": "최대 운동 능력을 겨루거나 숨을 참는 활동을 하지 않는다.",
   "criteria": "참여/관찰 조건 정하기→쉰 뒤 관찰→가벼운 걷기 뒤 관찰→쉬며 재관찰·조건 비교의 순서를 확인한다.",
   "given": [
    "ㄱ 충분히 쉰 뒤 같은 방법으로 관찰   ㄴ 교사와 참여 방법·안전·관찰 시간 정하기   ㄷ 무리 없는 걷기 뒤 실제 변화 관찰   ㄹ 쉬며 재관찰하고 조건/한계 비교"
   ],
   "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-39",
   "no": 39,
   "status": "authored",
   "form": "written",
   "topic": "기관의 협력",
   "prompt": "움직일 때 호흡과 맥박이 보통 빨라지는 까닭을 두 기관계의 연결로 설명하세요.",
   "answer": "활동하는 몸에 필요한 산소 등을 얻기 위해 호흡이 빨라지고, 혈액으로 필요한 물질을 운반하기 위해 심장이 더 빨리 뛰는 변화가 나타날 수 있다.",
   "explanation": "호흡으로 받아들인 산소와 혈액 운반을 연결한다. 개인의 상태와 관찰 조건에 따라 실제 기록은 다를 수 있다.",
   "misconception": "한 번의 관찰이 모든 사람에게 같은 숫자로 나타난다고 하지 않는다.",
   "criteria": "산소 필요/호흡 연결1, 혈액 운반/심장 연결1.",
   "previousCriteria": "산소 필요/호흡 연결1, 혈액 운반/심장 연결1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-40",
   "no": 40,
   "status": "authored",
   "form": "written",
   "topic": "건강 판정의 한계",
   "prompt": "한 친구의 운동 뒤 맥박 수가 다른 친구보다 적었습니다. 이것만으로 더 건강하다고 말할 수 없는 까닭은?",
   "answer": "사람과 운동량·쉰 시간·관찰 방법 등이 달라 영향을 주며, 한 번의 맥박 수만으로 건강을 진단할 수 없기 때문이다.",
   "explanation": "같은 사람의 조건을 맞춘 관찰과 개인 간 건강 판정은 다른 문제다.",
   "misconception": "자료 문제의 모형 값을 건강의 정상/이상 기준으로 쓰지 않는다.",
   "criteria": "다른 조건 예1, 건강 판정 불가1.",
   "previousCriteria": "다른 조건 예1, 건강 판정 불가1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-41",
   "no": 41,
   "status": "authored",
   "form": "blank",
   "topic": "조사 근거",
   "prompt": "질병의 예방법을 소개할 때 자료 제목·제공 기관·쪽/주소와 [ ] 날짜를 남긴다.",
   "answer": "확인한",
   "explanation": "정보를 다시 찾아볼 수 있도록 출처와 실제 확인 날짜를 함께 기록한다.",
   "misconception": "출처 이름만 적고 내용을 확인했다고 주장하지 않는다.",
   "criteria": "자료를 다시 찾을 수 있는 확인한 날짜를 넣는다. 미래 계획 날짜와 구별한다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-42",
   "no": 42,
   "status": "authored",
   "form": "choice",
   "topic": "기관과 질병",
   "prompt": "질병 조사 주제와 관련 기관계를 바르게 연결한 것은?",
   "answer": "④",
   "explanation": "장염은 소화 기관 관련 질병의 사례다. 각 질병은 확인한 자료 범위에서 관련 기관과 예방법을 조사한다.",
   "misconception": "증상 한 가지를 보고 친구의 병명을 정하지 않는다.",
   "criteria": "장염과 소화 기관의 관련을 바르게 연결한 보기를 고른다.",
   "choices": [
    "식중독—호흡 기관만",
    "인플루엔자—소화 기관만",
    "방광염—순환 기관만",
    "장염—소화 기관"
   ],
   "key": 3,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-43",
   "no": 43,
   "status": "authored",
   "form": "match",
   "topic": "생활 실천과 근거",
   "prompt": "실천과 직접 관련된 까닭을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ",
   "explanation": "행동을 언제 어떻게 하는지와 예방하려는 경로를 연결한다.",
   "misconception": "한 번 실천하면 모든 질병을 막는다고 보장하지 않는다.",
   "criteria": "식사 전 손씻기와 오염 물질 전파 줄이기, 옷소매로 가리기와 침방울 퍼짐 줄이기를 각각 연결한다.",
   "given": [
    "ㄱ 손에 묻은 오염원이 음식으로 옮겨갈 가능성 줄이기   ㄴ 기침 때 나오는 침방울 퍼짐 줄이기"
   ],
   "parts": [
    "(1) 식사 전 흐르는 물과 비누로 손씻기 [ ]",
    "(2) 기침할 때 옷소매로 입과 코 가리기 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-44",
   "no": 44,
   "status": "authored",
   "form": "multi",
   "topic": "실제 수행 기록",
   "prompt": "정확한 기록을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "계획·실제 행동·받은 의견은 따로 기록한다. 미실행도 보존할 상태다.",
   "misconception": "체크 표시만 채운 것을 실제 실천의 증거로 간주하지 않는다.",
   "criteria": "제작/미전달·의견 미수신·실제 미실천과 보완 기록을 고른다. 계획만으로 실천 완료한 선택은 제외한다.",
   "choices": [
    "자료를 제작했지만 아직 친구에게 보여 주지 않음",
    "실제 받은 질문은 없어서 의견 미수신으로 기록함",
    "손씻기 계획만 세우고 사흘 실천 완료로 표시함",
    "어제 실제로 실천하지 못해 이유와 다음 계획을 적음"
   ],
   "key": [
    0,
    1,
    3
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-45",
   "no": 45,
   "status": "authored",
   "form": "draw",
   "topic": "소개 자료",
   "prompt": "한 기관 관련 질병의 예방법을 알리는 카드 초안을 그리세요. 기관·예방 행동·까닭·출처가 들어갈 곳을 표시하세요.",
   "answer": "제목과 관련 기관, 실제 조사로 확인한 예방 행동과 까닭, 출처/확인 날짜, 아직 미확인인 부분을 배치한다.",
   "explanation": "읽는 사람이 행동과 근거를 연결할 수 있도록 구성한다. 여러 타당한 배치를 인정한다.",
   "misconception": "그림이나 계획을 실제 제작·공유로 바꾸지 않는다.",
   "criteria": "관련 기관/질병1, 행동과 까닭1, 출처/미확인 표시1.",
   "drawing": "large",
   "previousCriteria": "관련 기관/질병1, 행동과 까닭1, 출처/미확인 표시1.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-46",
   "no": 46,
   "status": "authored",
   "form": "written",
   "topic": "실천과 되돌아보기",
   "prompt": "사흘 실천 기록 중 하루는 손을 씻을 기회를 놓쳤습니다. 기록을 지우지 않고 어떻게 보완할까요?",
   "answer": "그날 기회·실제 행동·놓친 까닭을 남기고 다음에 행동하기 쉬운 방법을 정해 실제 결과를 다시 기록한다.",
   "explanation": "결과를 좋은 모습으로 고치지 않고 어려움을 근거로 계획을 개선한다.",
   "misconception": "실천하지 못한 날을 삭제하거나 미래 계획을 과거 실천으로 적지 않는다.",
   "criteria": "실제 미실천 보존1, 구체적 보완/다음 확인1.",
   "previousCriteria": "실제 미실천 보존1, 구체적 보완/다음 확인1.",
   "lines": 8,
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-47",
   "no": 47,
   "status": "authored",
   "form": "choice",
   "topic": "모형 해석",
   "prompt": "풍선 호흡 모형의 아래 막만 당겼는데 풍선이 커지지 않았습니다. 먼저 점검할 일은?",
   "answer": "②",
   "explanation": "모형 장치의 누출·연결 문제와 실제 몸의 원리는 구별한다.",
   "misconception": "모형 실패를 곧바로 실제 기관의 실패로 일반화하지 않는다.",
   "criteria": "밀폐·관/풍선 연결을 확인하고 처음 실패도 남기는 방법을 고른다. 사람 폐의 건강으로 결론내지 않는다.",
   "choices": [
    "풍선이 안 커졌으니 실제 사람도 숨을 못 쉰다고 결론낸다.",
    "밀폐 상태와 관·풍선 연결을 확인하고 처음 결과를 남긴다.",
    "예상 그림처럼 풍선을 크게 그려 결과로 제출한다.",
    "막을 입에 대고 불어 더 세게 시험한다."
   ],
   "key": 1,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-48",
   "no": 48,
   "status": "authored",
   "form": "written",
   "topic": "원인과 모형",
   "prompt": "같은 간격으로 끝까지 눌렀다 놓는 펌프에서 1회에 이동하는 물은 같았습니다. 10초 동안 누른 횟수만 늘렸다면 1회 양과 10초 총량을 구별해 설명하세요.",
   "answer": "1회 양은 같은 조건이고, 같은 10초 동안 누른 횟수가 늘면 그동안 이동한 총량은 늘어난다.",
   "explanation": "단위 시간의 횟수와 한 번의 양을 따로 읽는다. 실제 심장의 1회 양까지 이 모형 값으로 정하지 않는다.",
   "misconception": "빠르게 누르면 반드시 한 번 양도 늘어난다고 말하지 않는다.",
   "criteria": "1회 양 고정1, 같은 시간 총량 증가1.",
   "previousCriteria": "1회 양 고정1, 같은 시간 총량 증가1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-49",
   "no": 49,
   "status": "authored",
   "form": "short",
   "topic": "단위 맞추기",
   "prompt": "연습 자료 A는 20초에 24회, B는 30초에 30회의 맥박 기록입니다. 같은 관찰 시간인가요?",
   "answer": "아니다. A는 20초, B는 30초이다.",
   "explanation": "원래 관찰 시간이 달라 숫자24와30만으로 어느 쪽이 더 빠른지 판단하지 않는다.",
   "misconception": "이 문항은 건강 비교나 정상 수치 판정 문제가 아니다.",
   "criteria": "A20초와B30초가 다른 관찰 구간임을 쓴다. 횟수24/30만 비교하지 않는다.",
   "previousCriteria": "조건에 맞는 동등한 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-50",
   "no": 50,
   "status": "authored",
   "form": "draw",
   "topic": "모형 설계",
   "prompt": "당기는 부분을 움직여 팔꿈치가 굽혀지는 모형을 설계하세요. 뼈·관절·당김에 대응하는 부분과 실제 몸과 다른 점을 표시하세요.",
   "answer": "두 막대와 관절 연결, 당길 줄의 부착점·방향과 굽힘, 모형 줄은 스스로 수축하지 않는다는 한계를 표시한다.",
   "explanation": "움직임의 목적·대응·작동 확인을 연결하고 교사 준비가 필요한 부분을 표시한다.",
   "misconception": "관절을 움직였다는 것만으로 근육의 작용을 완전히 재현했다고 하지 않는다.",
   "criteria": "뼈/관절 대응1, 당김과 움직임1, 모형 한계/안전1.",
   "drawing": "large",
   "previousCriteria": "뼈/관절 대응1, 당김과 움직임1, 모형 한계/안전1.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-51",
   "no": 51,
   "status": "authored",
   "form": "choice",
   "topic": "표의 해석",
   "prompt": "연습 자료: 같은 학생의 1분 호흡 횟수는 쉬기 전18회, 가벼운 걷기 직후27회, 잠시 쉰 뒤20회였다. 이 표로 직접 알 수 있는 것은?",
   "answer": "③",
   "explanation": "같은 관찰 시간 안에서18회와27회를 비교할 수 있다. 산소량이나 건강 상태를 직접 재지는 않았다.",
   "misconception": "관찰한 횟수와 보이지 않은 물질량을 혼동하지 않는다.",
   "criteria": "주어진1분 자료에서 걷기 직후18→27회로 증가한 사실을 고른다. 정상값·산소 질량으로 확대하지 않는다.",
   "choices": [
    "모든 친구가 27회여야 정상이다.",
    "운동 뒤 몸속 산소가 정확히9 g 늘었다.",
    "이 자료에서 걷기 직후 횟수가 관찰 전보다 늘었다.",
    "호흡 횟수가 적으면 무조건 더 건강하다."
   ],
   "key": 2,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-52",
   "no": 52,
   "status": "authored",
   "form": "written",
   "topic": "건강 정보 검토",
   "prompt": "광고가 “특정 음료를 마시면 콩팥의 노폐물이 모두 빠진다.”고 합니다. 소개 자료에 그대로 넣기 전 무엇을 확인해야 할까요?",
   "answer": "공공 보건기관 등 믿을 만한 자료에서 근거·대상·한계를 확인하고 확인되지 않은 효능은 넣지 않는다.",
   "explanation": "콩팥의 기능 설명과 특정 제품의 치료/예방 효과 주장은 다른 종류의 근거가 필요하다.",
   "misconception": "광고 문구나 경험 한 번을 치료 효과의 증거로 보지 않는다.",
   "criteria": "출처/근거 확인1, 미확인 효능 단정하지 않기1.",
   "previousCriteria": "출처/근거 확인1, 미확인 효능 단정하지 않기1.",
   "lines": 8,
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-53",
   "no": 53,
   "status": "authored",
   "form": "order",
   "topic": "물질 이동 구별",
   "prompt": "오줌이 만들어져 나가는 큰 흐름을 배열하세요.",
   "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
   "explanation": "생성·이동·저장·배출을 각 기관에 맞춰 이어 읽는다.",
   "misconception": "음식물이 직접 이 길로 이동한다고 하지 않는다.",
   "criteria": "이 문항 기호로 콩팥 생성→오줌관 이동→방광 저장→요도로 배출을 확인한다.",
   "given": [
    "ㄱ 방광에 잠시 저장   ㄴ 요도로 몸 밖에 나감   ㄷ 콩팥에서 만들어짐   ㄹ 오줌관으로 이동"
   ],
   "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-54",
   "no": 54,
   "status": "authored",
   "form": "written",
   "topic": "기관 연결 보완",
   "prompt": "“폐가 산소를 받아들이므로 몸의 다른 기관은 필요 없다.”는 설명을 소화·순환 기능을 넣어 고치세요.",
   "answer": "폐에서 받아들인 산소는 혈액으로 운반되고, 소화 기관이 소화·흡수한 영양소도 혈액으로 필요한 곳에 전달되므로 여러 기관이 함께 필요하다.",
   "explanation": "물질을 얻는 기관과 운반하는 기관의 역할을 연결한다.",
   "misconception": "한 기관이 중요하다는 말이 다른 기관이 필요 없다는 뜻은 아니다.",
   "criteria": "호흡/소화 역할1, 혈액 운반과 협력1.",
   "previousCriteria": "호흡/소화 역할1, 혈액 운반과 협력1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-55",
   "no": 55,
   "status": "authored",
   "form": "choice",
   "topic": "조사 대상과 범위",
   "prompt": "질병 예방법을 조사할 자료로 가장 알맞은 것은?",
   "answer": "④",
   "explanation": "출처와 확인 가능한 내용을 살피고 주장하는 범위를 읽는다.",
   "misconception": "공공기관 이름만 있다고 실제 내용을 읽지 않아도 되는 것은 아니다.",
   "criteria": "관련 기관·예방 행동·대상을 설명하는 공공 보건기관 자료를 고른다.",
   "choices": [
    "출처·날짜를 모르는 광고 댓글",
    "병명을 찍어 맞히는 친구 사진",
    "개인 경험만 적은 홍보 문구",
    "공공 보건기관이 관련 기관·예방 행동·대상을 설명한 자료"
   ],
   "key": 3,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-56",
   "no": 56,
   "status": "authored",
   "form": "written",
   "topic": "실제 소통",
   "prompt": "발표 자료를 저장했지만 아직 설명하지 않았습니다. 제작과 전달의 상태를 어떻게 적을까요?",
   "answer": "자료 제작/저장은 실제로 했고 전달은 미실행으로 적는다. 누구에게 언제 어떤 방법으로 설명할지 계획은 따로 남긴다.",
   "explanation": "저장·실제 설명·받은 의견은 다른 행동이다.",
   "misconception": "예정일을 실제 전달일로 바꾸지 않는다.",
   "criteria": "제작과 미공유 구별1, 전달 계획 구별1.",
   "previousCriteria": "제작과 미공유 구별1, 전달 계획 구별1.",
   "lines": 8,
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-57",
   "no": 57,
   "status": "authored",
   "form": "multi",
   "topic": "근거의 한계",
   "prompt": "한 번의 수업 관찰보다 지나치게 확대한 주장을 모두 고르세요.",
   "answer": "②, ③",
   "explanation": "예방법 실천과 건강 진단을 한 번의 관찰로 보장하지 못한다.",
   "misconception": "올바른 실천도 결과를100% 보장하는 치료로 쓰지 않는다.",
   "criteria": "한 번 손씻기로 모든 감염병 예방·연습 표로 친구 건강 순위의 두 과잉 주장을 고른다.",
   "choices": [
    "모형 막을 내렸을 때 풍선이 커졌다고 적는다.",
    "한 번 손씻기를 했으니 앞으로 모든 감염병에 걸리지 않는다고 쓴다.",
    "제공된 연습 표의 값으로 친구의 건강 순위를 정한다.",
    "불분명한 맥박은 다시 확인할 점으로 남긴다."
   ],
   "key": [
    1,
    2
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-58",
   "no": 58,
   "status": "authored",
   "form": "draw",
   "topic": "실제 기록 설계",
   "prompt": "가벼운 걷기 전후 관찰을 위한 빈 표를 설계하세요. 날짜·같은 관찰 시간·걷기/쉰 시간·실제 변화·불분명을 적을 칸을 넣고 결과는 비워 두세요.",
   "answer": "관찰 전/직후/쉰 뒤와 맥박·호흡의 관찰 시간/횟수·방법·불분명·조건을 나누어 적을 표를 그린다.",
   "explanation": "아직 관찰하지 않은 결과를 미리 채우지 않는다.",
   "misconception": "연습 표의 값을 내 실제 기록으로 복사하지 않는다.",
   "criteria": "같은 시간/시점1, 실제 변화/조건1, 결과 빈칸/불분명1.",
   "drawing": "large",
   "previousCriteria": "같은 시간/시점1, 실제 변화/조건1, 결과 빈칸/불분명1.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-59",
   "no": 59,
   "status": "authored",
   "form": "blank",
   "topic": "움직임 정리",
   "prompt": "뼈와 뼈의 연결 부분은 [ ], 뼈를 당겨 움직임에 관여하는 것은 [ ]이다.",
   "answer": "관절, 근육",
   "explanation": "구조의 연결과 힘을 내는 작용을 구별한다.",
   "misconception": "뼈만 스스로 움직인다고 하지 않는다.",
   "criteria": "관절과 근육을 각각 뼈의 연결 부분·당김의 역할에 맞게 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-60",
   "no": 60,
   "status": "authored",
   "form": "blank",
   "topic": "소화와 흡수",
   "prompt": "소화된 영양소는 주로 [ ]에서 흡수되고, [ ]을 통해 몸의 여러 곳으로 운반된다.",
   "answer": "작은창자, 혈액",
   "explanation": "소화·흡수와 순환의 연결을 정리한다.",
   "misconception": "흡수 뒤 영양소가 통째 음식물로 돌아간다고 하지 않는다.",
   "criteria": "주 흡수 기관인 작은창자와 운반하는 혈액을 제시한 순서로 각각 쓴다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-61",
   "no": 61,
   "status": "authored",
   "form": "blank",
   "topic": "호흡과 순환",
   "prompt": "폐에서 공기 중 [ ]를 받아들이고, 몸에서 생긴 [ ]를 내보내는 데 관여한다.",
   "answer": "산소, 이산화탄소",
   "explanation": "두 기체의 주된 이동 방향을 구별하되 들숨/날숨은 혼합 공기다.",
   "misconception": "들이쉬는 모든 공기를 산소라고 부르지 않는다.",
   "criteria": "받아들이는 산소와 내보내는 이산화탄소를 각각 맞는 빈칸에 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-62",
   "no": 62,
   "status": "authored",
   "form": "blank",
   "topic": "배설 경로",
   "prompt": "콩팥→[ ]→방광→[ ]→몸 밖의 순서로 오줌이 이동한다.",
   "answer": "오줌관, 요도",
   "explanation": "방광으로 오는 길과 몸 밖으로 나가는 길을 구별한다.",
   "misconception": "두 관 이름을 바꾸지 않는다.",
   "criteria": "콩팥과 방광 사이 오줌관, 방광 뒤 몸 밖으로 이어지는 요도를 각각 쓴다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-63",
   "no": 63,
   "status": "authored",
   "form": "blank",
   "topic": "공정한 관찰",
   "prompt": "같은 사람의 전후 변화를 비교하려면 관찰 방법과 관찰 [ ]을 같게 해야 한다.",
   "answer": "시간",
   "explanation": "같은 길이의 시간 안에서 관찰한 횟수를 비교한다. 시점·활동 상태도 남긴다.",
   "misconception": "관찰 시간을 빼고 횟수만 비교하지 않는다.",
   "criteria": "전후를 비교하는 관찰 시간 또는 같은 뜻의 구간 길이를 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-64",
   "no": 64,
   "status": "authored",
   "form": "blank",
   "topic": "실제 실천",
   "prompt": "건강 생활의 계획과 실제 [ ]을 나누고, 실천하지 못한 날의 까닭과 다음 [ ]도 남긴다.",
   "answer": "행동/실천, 계획",
   "explanation": "실제 행동을 근거로 되돌아보고 계획을 개선한다.",
   "misconception": "계획만 세워 실천 완료라고 쓰지 않는다.",
   "criteria": "계획과 실제 행동/실천, 다음 계획의 두 빈칸을 각각 확인한다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-65",
   "no": 65,
   "status": "authored",
   "form": "choice",
   "topic": "뼈와 근육",
   "prompt": "팔꿈치 관절이 하는 도움으로 알맞은 것은?",
   "answer": "②",
   "explanation": "관절은 뼈와 뼈가 연결되는 곳이며 팔꿈치에서는 굽힘·폄을 돕는다.",
   "misconception": "관절과 근육의 역할을 같게 합치지 않는다.",
   "criteria": "뼈가 연결된 부분에서 굽힘·폄을 돕는 관절의 기능을 고른다.",
   "choices": [
    "팔뼈 사이에서 근육 대신 당기는 힘을 만든다.",
    "뼈가 연결된 부분에서 팔을 굽히고 펴게 한다.",
    "팔뼈가 짧아지고 길어지게 해 팔 길이를 바꾼다.",
    "팔뼈를 서로 붙여 모든 방향의 움직임을 막는다."
   ],
   "key": 1,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-66",
   "no": 66,
   "status": "authored",
   "form": "blank",
   "topic": "근육 변화",
   "prompt": "팔을 굽힐 때 대표적인 안쪽 근육은 길이가 [ ]지며 뼈를 당긴다.",
   "answer": "짧아",
   "explanation": "수축하며 짧아지는 근육의 작용을 뼈의 움직임에 연결한다.",
   "misconception": "뼈 길이가 줄어서 굽는다고 설명하지 않는다.",
   "criteria": "대표적인 안쪽 근육이 짧아지며 뼈를 당긴다는 문장을 완성한다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-67",
   "no": 67,
   "status": "authored",
   "form": "match",
   "topic": "모형과 몸",
   "prompt": "부분을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "모형의 각 부분이 어떤 기능을 나타내는지 확인한다.",
   "misconception": "실은 실제 근육의 모든 성질을 가지지 않는다.",
   "criteria": "모형 막대=뼈·연결핀=관절·당기는 실=근육 당김 표현을 각각 연결한다.",
   "given": [
    "ㄱ 뼈   ㄴ 관절   ㄷ 당김 작용을 나타내는 부분"
   ],
   "parts": [
    "(1) 모형의 막대 [ ]",
    "(2) 막대 연결핀 [ ]",
    "(3) 잡아당기는 실 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-68",
   "no": 68,
   "status": "authored",
   "form": "written",
   "topic": "움직임 설명",
   "prompt": "팔을 굽히고 펴는 두 동작을 안쪽·바깥쪽 근육과 뼈의 연결로 설명하세요.",
   "answer": "굽힐 때 안쪽 근육이 수축해 뼈를 당기고 바깥쪽은 늘어난다. 펼 때 바깥쪽 근육이 수축하는 등 두 근육의 작용이 달라진다.",
   "explanation": "대표적인 팔 근육의 대조 작용을 기초 수준에서 설명한다.",
   "misconception": "늘어나는 근육이 뼈를 밀어낸다고 하지 않는다.",
   "criteria": "굽힘 설명1, 폄 설명1.",
   "lines": 8,
   "previousCriteria": "굽힘 설명1, 폄 설명1.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-69",
   "no": 69,
   "status": "authored",
   "form": "choice",
   "topic": "흡수 기관",
   "prompt": "소화된 영양소를 주로 흡수하는 기관은?",
   "answer": "①",
   "explanation": "작은창자의 구조와 흡수 기능을 연결한다.",
   "misconception": "이름의 작다/크다만으로 기능을 추측하지 않는다.",
   "criteria": "주요 영양소 흡수 기관인 작은창자를 고른다. 위·큰창자·간과 구별한다.",
   "choices": [
    "작은창자",
    "위",
    "큰창자",
    "간"
   ],
   "key": 0,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-70",
   "no": 70,
   "status": "authored",
   "form": "order",
   "topic": "음식물 이동",
   "prompt": "기호를 음식물이 지나가는 순서로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㅂ → ㅁ → ㄴ",
   "explanation": "음식물의 길과 소화를 돕는 기관을 구별한다.",
   "misconception": "위 앞에 작은창자나 큰창자를 놓지 않는다.",
   "criteria": "새로 제시된 기호를 읽어 입→식도→위→작은창자→큰창자→항문의 순서로 쓴다.",
   "given": [
    "ㄱ 식도   ㄴ 항문   ㄷ 입   ㄹ 위   ㅁ 큰창자   ㅂ 작은창자"
   ],
   "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-71",
   "no": 71,
   "status": "authored",
   "form": "multi",
   "topic": "소화와 순환 연결",
   "prompt": "알맞은 설명을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "소화 기관의 서로 다른 역할과 순환의 운반을 함께 읽는다.",
   "misconception": "직접 지나는 기관과 돕는 기관을 구별한다.",
   "criteria": "이의 음식물 잘게 부수기·흡수한 영양소 운반·큰창자 물 흡수를 고른다. 간에 밥알이 직접 지난다는 선택은 제외한다.",
   "choices": [
    "입에서 음식물을 잘게 부수는 데 이가 쓰인다.",
    "간 속으로 밥알이 직접 지나간다.",
    "흡수된 영양소는 혈액으로 운반된다.",
    "큰창자는 남은 내용물에서 물을 흡수한다."
   ],
   "key": [
    0,
    2,
    3
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-72",
   "no": 72,
   "status": "authored",
   "form": "written",
   "topic": "다른 경로",
   "prompt": "친구가 “물은 식도에서 곧바로 오줌관으로 내려간다.”고 합니다. 흡수·혈액·콩팥을 넣어 고치세요.",
   "answer": "마신 물은 소화 기관에서 흡수되어 혈액으로 운반되며, 콩팥에서 혈액 속 물질을 걸러 오줌이 만들어진 뒤 오줌관을 지난다.",
   "explanation": "소화 경로와 배설 경로 사이에 흡수·순환·콩팥 기능이 있다.",
   "misconception": "직접 연결된 하나의 관처럼 그리지 않는다.",
   "criteria": "흡수/혈액 연결1, 콩팥 뒤 오줌관1.",
   "lines": 8,
   "previousCriteria": "흡수/혈액 연결1, 콩팥 뒤 오줌관1.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-73",
   "no": 73,
   "status": "authored",
   "form": "choice",
   "topic": "심장의 작용",
   "prompt": "심장이 하는 일로 알맞은 것은?",
   "answer": "③",
   "explanation": "심장은 혈액을 흐르게 하는 중심 기관이며 필요한 물질은 혈액으로 운반된다.",
   "misconception": "심장이 산소를 직접 만들어 낸다고 하지 않는다.",
   "criteria": "혈액을 혈관으로 내보내 순환시키는 심장의 기능을 고른다.",
   "choices": [
    "혈액의 물질을 걸러 오줌을 만든다.",
    "소화된 영양소를 주로 흡수한다.",
    "혈액을 혈관으로 내보내 순환시킨다.",
    "산소를 받고 이산화탄소를 내보낸다."
   ],
   "key": 2,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-74",
   "no": 74,
   "status": "authored",
   "form": "blank",
   "topic": "순환 구성",
   "prompt": "혈액이 이동하는 길은 [ ], 온몸으로 혈액을 내보내는 기관은 [ ]이다.",
   "answer": "혈관, 심장",
   "explanation": "길과 펌프 기능을 구별한다.",
   "misconception": "혈관을 빈 공기 관이라고 하지 않는다.",
   "criteria": "혈액 이동의 길인 혈관과 내보내는 기관인 심장을 순서대로 각각 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-75",
   "no": 75,
   "status": "authored",
   "form": "short",
   "topic": "혈액의 운반",
   "prompt": "혈액이 온몸으로 운반하는 필요한 물질을 두 가지 쓰세요.",
   "answer": "산소, 흡수된 영양소",
   "explanation": "호흡과 소화·흡수로 얻은 물질이 혈액을 통해 운반된다.",
   "misconception": "밥알이나 들숨 공기 덩어리 자체라고 쓰지 않는다.",
   "criteria": "혈액이 운반하는 필요한 물질로 산소와 흡수된 영양소 두 가지를 쓴다.",
   "previousCriteria": "조건에 맞는 동등한 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-76",
   "no": 76,
   "status": "authored",
   "form": "written",
   "topic": "연습값 해석",
   "prompt": "같은 사람의30초 맥박 기록이 전36회, 걷기 직후45회였습니다. 알 수 있는 변화와 이 표만으로 알 수 없는 것을 나누어 쓰세요.",
   "answer": "같은30초 동안 직후가9회 늘었다. 이것만으로 건강 상태나 모든 사람의 정상 맥박 수를 정할 수는 없다.",
   "explanation": "관찰값의 차이와 결론의 범위를 나눈다.",
   "misconception": "차이를 건강 점수로 바꾸지 않는다.",
   "criteria": "9회/시간 포함1, 건강/일반화 한계1.",
   "lines": 8,
   "previousCriteria": "9회/시간 포함1, 건강/일반화 한계1.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-77",
   "no": 77,
   "status": "authored",
   "form": "choice",
   "topic": "호흡의 경로",
   "prompt": "코로 들이마신 공기의 큰 경로로 알맞은 것은?",
   "answer": "④",
   "explanation": "공기가 드나드는 길과 음식물이 지나는 길은 다르다.",
   "misconception": "기관과 식도의 이름을 바꾸지 않는다.",
   "criteria": "코→기관→기관지→폐의 들숨 공기 경로를 고른다.",
   "choices": [
    "코→기관지→기관→폐",
    "코→기관→폐→기관지",
    "폐→기관지→기관→코",
    "코→기관→기관지→폐"
   ],
   "key": 3,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-78",
   "no": 78,
   "status": "authored",
   "form": "match",
   "topic": "호흡의 대응",
   "prompt": "대응을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ",
   "explanation": "비슷한 역할을 기준으로 모형의 대응을 읽는다.",
   "misconception": "고무막 자체가 공기를 만들어 낸다고 하지 않는다.",
   "criteria": "병 속 풍선과 폐, 아래 막과 가로막의 대응을 각각 연결한다.",
   "given": [
    "ㄱ 폐   ㄴ 가로막"
   ],
   "parts": [
    "(1) 병 속 풍선 [ ]",
    "(2) 아래 고무막 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-79",
   "no": 79,
   "status": "authored",
   "form": "multi",
   "topic": "모형이 보여 주는 범위",
   "prompt": "병·풍선 모형에서 직접 확인할 수 있는 것을 모두 고르세요.",
   "answer": "①, ②",
   "explanation": "실제로 관찰한 조작과 풍선 변화를 근거로 설명하고 실제 기체 교환까지 측정한 것으로 확대하지 않는다.",
   "misconception": "모형이 닮았다는 이유로 모든 기능을 실측했다고 하지 않는다.",
   "criteria": "모형 막의 조작과 풍선 크기 변화만 고른다. 실제 혈액 속 산소량·기체 교환 속도는 제외한다.",
   "choices": [
    "아래 막을 당겼는지",
    "풍선이 커지거나 작아졌는지",
    "실제 혈액 속 산소의 양",
    "실제 폐 속 기체 교환의 속도"
   ],
   "key": [
    0,
    1
   ],
   "previousCriteria": "필요한 보기를 빠짐없이 고르고 다른 보기를 더 고르지 않았는지 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-80",
   "no": 80,
   "status": "authored",
   "form": "written",
   "topic": "연결 설명",
   "prompt": "작은창자·폐·혈액·콩팥이 서로 관련된 까닭을 물질의 이동으로 설명하세요.",
   "answer": "작은창자에서 흡수한 영양소와 폐에서 받아들인 산소는 혈액으로 운반되며, 혈액은 몸에서 생긴 노폐물 등을 콩팥 같은 배설 기관으로 운반한다.",
   "explanation": "물질을 얻기·운반하기·몸 밖으로 내보내기에 여러 기관이 함께 관여한다.",
   "misconception": "혈액 전체가 오줌이 되어 사라진다고 하지 않는다.",
   "criteria": "얻기/운반 연결1, 배설과 연결1.",
   "lines": 8,
   "previousCriteria": "얻기/운반 연결1, 배설과 연결1.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-81",
   "no": 81,
   "status": "authored",
   "form": "choice",
   "topic": "배설 기능",
   "prompt": "오줌을 만드는 기관과 잠시 저장하는 기관을 차례로 짝지은 것은?",
   "answer": "①",
   "explanation": "콩팥이 만들고 방광이 저장하며 그 사이를 오줌관이 잇는다.",
   "misconception": "오줌관과 요도를 혼동하지 않는다.",
   "criteria": "오줌 생성 기관 콩팥과 저장 기관 방광을 차례대로 짝지은 보기를 고른다.",
   "choices": [
    "콩팥—방광",
    "방광—콩팥",
    "오줌관—요도",
    "요도—오줌관"
   ],
   "key": 0,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-82",
   "no": 82,
   "status": "authored",
   "form": "blank",
   "topic": "소화 찌꺼기",
   "prompt": "소화되고 남은 음식물 찌꺼기는 큰창자를 거친 뒤 [ ]으로 몸 밖에 나간다.",
   "answer": "항문",
   "explanation": "소화 찌꺼기의 길은 오줌의 배설 경로와 다르다.",
   "misconception": "오줌이 항문을 통해 나간다고 하지 않는다.",
   "criteria": "남은 음식물 찌꺼기가 나가는 항문을 넣는다. 요도와 구별한다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-83",
   "no": 83,
   "status": "authored",
   "form": "draw",
   "topic": "기관 연결 자료",
   "prompt": "소화·호흡·순환·배설의 기능을 네 칸에 넣고 물질 이동을 글과 화살표로 연결하세요. 혈액·산소·흡수된 영양소·노폐물의 이름을 넣으세요.",
   "answer": "소화/흡수와 호흡에서 얻은 물질이 혈액을 통해 운반되고 노폐물 등이 배설 기관으로 가는 큰 연결을 그린다.",
   "explanation": "화살표가 어떤 물질을 가리키는지 이름을 붙인다. 모든 기관이 하나의 빈 관으로 직렬 연결되는 그림은 고친다.",
   "misconception": "정밀한 해부 그림이나 혈관 이름 암기는 요구하지 않는다.",
   "criteria": "네 기능1, 물질 이름/방향1, 합리적 연결1.",
   "drawing": "large",
   "previousCriteria": "네 기능1, 물질 이름/방향1, 합리적 연결1.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-84",
   "no": 84,
   "status": "authored",
   "form": "written",
   "topic": "질병과 생활",
   "prompt": "소화·순환·호흡·배설 기관 관련 질병 중 하나를 골라 조사한 예방 행동과 까닭을 출처와 함께 설명하세요.",
   "answer": "예: 호흡 기관 관련 인플루엔자 예방을 위해 기침 때 입과 코를 옷소매로 가려 침방울 퍼짐을 줄인다. 질병관리청의 관련 자료 제목·주소·확인 날짜를 함께 남긴다.",
   "explanation": "선택한 질병·관련 기관계·확인한 행동과 까닭을 연결한다. 조사하지 않았다면 예시를 실제 조사로 쓰지 않는다.",
   "misconception": "예방 행동을 치료나100% 예방 보장으로 바꾸지 않는다.",
   "criteria": "기관/질병1, 타당한 예방 행동/까닭1, 실제 확인 출처1.",
   "lines": 8,
   "previousCriteria": "기관/질병1, 타당한 예방 행동/까닭1, 실제 확인 출처1.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-85",
   "no": 85,
   "status": "authored",
   "form": "choice",
   "topic": "건강 행동 선택",
   "prompt": "호흡 기관 관련 감염병의 예방 행동을 알맞게 설명한 것은?",
   "answer": "④",
   "explanation": "기침예절은 침방울이 주변으로 퍼지는 것을 줄이는 데 도움이 된다. 손씻기 등 다른 생활 수칙도 함께 살핀다.",
   "misconception": "예방 행동 한 가지를 모든 질병을 막는 방법으로 보장하지 않는다.",
   "criteria": "옷소매로 입과 코를 가려 침방울 퍼짐을 줄이는 행동을 고른다. 손씻기 불필요 주장은 제외한다.",
   "choices": [
    "마스크만 쓰면 손씻기를 하지 않아도 된다.",
    "기침을 손바닥으로 가린 뒤 그대로 물건을 만진다.",
    "겉으로 깨끗한 손은 식사 전에 씻을 필요 없다.",
    "기침할 때 입과 코를 옷소매로 가린다."
   ],
   "key": 3,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-86",
   "no": 86,
   "status": "authored",
   "form": "short",
   "topic": "실제 실천 일수",
   "prompt": "연습 기록에서 월요일은 계획만 세웠고, 화·수요일에는 실제 식사 전 손씻기를 했습니다. 실제 실천으로 기록된 날은 며칠인가요?",
   "answer": "2일",
   "explanation": "화요일과 수요일 두 날이다. 계획한 월요일은 실제 실천과 구별한다. 이 수치로 건강 효과를 점수화하지 않는다.",
   "misconception": "계획한 날을 실천한 날에 더하지 않는다.",
   "criteria": "계획한 월요일을 제외하고 실제 화·수요일의2일을 센다.",
   "previousCriteria": "조건에 맞는 동등한 표현을 인정한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-87",
   "no": 87,
   "status": "authored",
   "form": "order",
   "topic": "조사부터 보완까지",
   "prompt": "질병 예방법 소개 자료를 만들고 실제로 나누는 순서를 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ → ㄹ",
   "explanation": "확인한 근거로 자료를 만들고 실제 설명 뒤 의견을 받아 보완한다.",
   "misconception": "실제로 받지 않은 의견이나 하지 않은 재전달을 채워 넣지 않는다.",
   "criteria": "기관/질병/예방과 출처 확인→제작→실제 설명·의견→수정/재전달 또는 다음 계획의 순서를 확인한다.",
   "given": [
    "ㄱ 자료 제작   ㄴ 실제 설명하고 받은 의견/미수신 기록   ㄷ 기관·질병·예방법과 출처 확인   ㄹ 실제 수정/재전달 또는 다음 계획 구별"
   ],
   "previousCriteria": "각 단계의 선후 관계를 따로 확인한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-88",
   "no": 88,
   "status": "authored",
   "form": "written",
   "topic": "실천과 효과 구별",
   "prompt": "“사흘 손씻기를 했으므로 앞으로 절대로 장염에 걸리지 않는다.”는 결론을 근거에 맞게 고치세요.",
   "answer": "기록으로 확인한 것은 사흘의 실제 손씻기 행동이며, 이런 실천이 감염 위험을 줄이는 데 도움이 될 수 있지만 모든 장염을100% 막는다고 단정할 수 없다.",
   "explanation": "실제 행동의 근거와 질병 발생을 보장하는 주장은 다르다.",
   "misconception": "생활 실천 기록을 예방 효과의 임상 시험 결과로 바꾸지 않는다.",
   "criteria": "실제 행동 범위1, 예방 보장의 한계1.",
   "lines": 8,
   "previousCriteria": "실제 행동 범위1, 예방 보장의 한계1.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-89",
   "no": 89,
   "status": "authored",
   "form": "blank",
   "topic": "움직임 바로잡기",
   "prompt": "“뼈가 스스로 줄어 팔이 굽는다.”를 고치면, [ ]이 수축해 뼈를 당겨 움직임에 관여한다.",
   "answer": "근육",
   "explanation": "움직임의 원인을 뼈의 길이 변화로 보지 않는다.",
   "misconception": "근육과 관절의 도움을 함께 설명한다.",
   "criteria": "뼈 자체가 아닌 근육의 수축과 당김으로 움직임을 설명하도록 넣는다.",
   "previousCriteria": "빈칸별 뜻을 확인하며 같은 뜻의 과학적 표현을 인정한다.",
   "standard": "6과04-01",
   "origin": "previous96"
  },
  {
   "id": "body-book-90",
   "no": 90,
   "status": "authored",
   "form": "choice",
   "topic": "두 경로 구별",
   "prompt": "오줌과 음식물 찌꺼기의 경로를 바르게 설명한 것은?",
   "answer": "③",
   "explanation": "몸 밖으로 나가더라도 지나가는 기관과 만들어지는 과정이 다르다.",
   "misconception": "배설과 소화 찌꺼기 배출을 구별한다.",
   "criteria": "오줌은 요도, 음식물 찌꺼기는 항문으로 나간다는 보기를 고른다.",
   "choices": [
    "둘 다 위에서 바로 방광으로 간다.",
    "오줌은 항문, 음식물 찌꺼기는 요도로 나간다.",
    "오줌은 요도, 음식물 찌꺼기는 항문으로 나간다.",
    "둘 다 기관지를 거쳐 몸 밖으로 간다."
   ],
   "key": 2,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-91",
   "no": 91,
   "status": "authored",
   "form": "short",
   "topic": "시간 다시 보기",
   "prompt": "맥박 기록을 비교할 때 “30회,40회”라는 숫자만 있습니다. 먼저 확인해야 할 조건 하나는?",
   "answer": "각각 얼마 동안 관찰했는지 확인한다.",
   "explanation": "관찰 시간이 같아야 횟수를 직접 비교할 수 있다. 같은 사람·방법·시점도 확인하면 좋다.",
   "misconception": "시간을 확인하지 않은 채40회 쪽이 더 빠르다고 단정하지 않는다.",
   "criteria": "각 횟수를 얼마 동안 관찰했는지 등 비교 가능한 조건을 하나 쓴다. 숫자만으로 건강을 판단하지 않는다.",
   "previousCriteria": "조건에 맞는 동등한 표현을 인정한다.",
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-92",
   "no": 92,
   "status": "authored",
   "form": "written",
   "topic": "모형과 실측 구별",
   "prompt": "제공된 호흡 모형 사진을 보고 내 실험 결과라고 기록했습니다. 무엇을 고쳐야 하나요?",
   "answer": "제공된 설명 자료를 읽은 것으로 고치고 실제 관찰 여부는 별도로 적는다. 직접 실험했다면 날짜·조작·실제 풍선 변화와 불분명을 남긴다.",
   "explanation": "시각 자료가 사진처럼 보여도 실제 학생 수행 증거가 되는 것은 아니다.",
   "misconception": "AI 이미지의 모형 상태를 내 실측값으로 바꾸지 않는다.",
   "criteria": "자료의 성격 구별1, 실제 수행 근거/미실행1.",
   "previousCriteria": "자료의 성격 구별1, 실제 수행 근거/미실행1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-93",
   "no": 93,
   "status": "authored",
   "form": "match",
   "topic": "기능 다시 묶기",
   "prompt": "기관과 주된 기능을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "각 기관은 다른 기능을 하면서 서로 협력한다.",
   "misconception": "모든 기관의 역할을 하나의 “좋게 한다”로 쓰지 않는다.",
   "criteria": "심장=혈액 내보내기·작은창자=영양소 흡수·콩팥=오줌 생성을 보기 기호에 맞게 각각 연결한다.",
   "given": [
    "ㄱ 오줌 생성   ㄴ 혈액 내보내기   ㄷ 주로 영양소 흡수"
   ],
   "parts": [
    "(1) 심장 [ ]",
    "(2) 작은창자 [ ]",
    "(3) 콩팥 [ ]"
   ],
   "previousCriteria": "소문항마다 연결한 기관과 기능을 확인한다.",
   "answerPerPart": true,
   "standard": "6과04-02",
   "origin": "previous96"
  },
  {
   "id": "body-book-94",
   "no": 94,
   "status": "authored",
   "form": "choice",
   "topic": "실천 기록 고치기",
   "prompt": "손씻기를 계획했지만 실제로 하지 못한 날의 기록으로 가장 알맞은 것은?",
   "answer": "②",
   "explanation": "실제로 한 일과 앞으로 할 일을 나누어 보완한다.",
   "misconception": "빈칸을 줄이려고 미실천을 숨기지 않는다.",
   "criteria": "실제로 놓친 사실·까닭·다음 행동을 남기는 보기를 고른다. 계획·친구의 행동을 내 실천으로 바꾸지 않는다.",
   "choices": [
    "계획을 세웠으니 실천 완료",
    "놓친 사실·까닭과 다음 행동을 기록",
    "건강 실천 점수를 높이려고 그날을 삭제",
    "친구가 했으니 내 실천으로 기록"
   ],
   "key": 1,
   "previousCriteria": "선택한 조건과 과학적 근거를 함께 확인한다.",
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-95",
   "no": 95,
   "status": "authored",
   "form": "written",
   "topic": "자료 보완",
   "prompt": "친구가 “어느 기관과 관련된 예방법인지 모르겠어.”라고 했습니다. 소개 자료를 어떻게 고치고 기록할까요?",
   "answer": "관련 기관/질병 이름과 예방 행동·까닭의 연결을 표시하고, 실제 받은 의견·수정 전후·다시 설명했는지 날짜와 함께 남긴다.",
   "explanation": "의견을 근거로 읽는 사람이 이해할 연결을 보완한다. 재공유 전이면 계획이라고 구분한다.",
   "misconception": "받지 않은 의견이나 하지 않은 재설명을 꾸미지 않는다.",
   "criteria": "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1.",
   "previousCriteria": "기관/행동 연결 보완1, 실제 의견/수정/재전달 구별1.",
   "lines": 8,
   "standard": "6과04-03",
   "origin": "previous96"
  },
  {
   "id": "body-book-96",
   "no": 96,
   "status": "authored",
   "form": "written",
   "topic": "처음 생각과 비교",
   "prompt": "처음 답 중 하나를 골라 지금 설명과 비교하세요. 기관의 기능·연결 또는 실제 근거와 한계를 넣으세요.",
   "answer": "예: 폐만 일하면 된다고 생각했지만 폐가 받은 산소를 혈액이 운반한다는 근거로 여러 기관의 협력이 필요하다고 고쳤다.",
   "explanation": "처음 설명을 지우지 않고 달라진 점과 남은 의문을 연결한다. 타당한 다른 사례를 인정한다.",
   "misconception": "맞은 개수만 적고 설명의 근거를 생략하지 않는다.",
   "criteria": "처음/지금 비교1, 과학적 기능/근거1.",
   "previousCriteria": "처음/지금 비교1, 과학적 기능/근거1.",
   "lines": 8,
   "standard": "6과04-02",
   "origin": "previous96"
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "우리 몸의 구조와 기능",
   "blocks": [
    {
     "type": "diagram",
     "key": "torso",
     "caption": "여러 기관을 나타낸 교육 모형이에요. 실제 기관의 색·거리·크기와 구별해요."
    },
    {
     "type": "text",
     "text": "걷고 숨을 쉬며 생활할 때 몸의 여러 기관이 함께 일해요. 모형을 실제로 만들고 자료·관찰의 조건과 한계를 읽으면 기관의 협력을 근거로 설명할 수 있어요."
    },
    {
     "type": "field",
     "title": "나의 시작 질문",
     "hint": "몸의 움직임과 기관에서 궁금한 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·근육과 소화·호흡·순환·배설의 협력을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진·교육 모형·연습 값과 실제 나의 관찰·실천을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이름·학습 날짜와 처음 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "차례와 사용법",
   "title": "움직이는 모형에서 실제 생활로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "학습 길",
      "함께 할 일"
     ],
     "rows": [
      [
       "뼈·관절·근육",
       "팔 관찰·모형 제작·당김/재시험"
      ],
      [
       "소화·순환·호흡·배설",
       "각 기관의 구조·기능·물질의 길 비교"
      ],
      [
       "기관의 협력과 몸 변화",
       "같은 사람·구간·방법으로 전후 비교"
      ],
      [
       "건강 생활",
       "질병/예방 근거 조사·여러 날 실제 실천"
      ],
      [
       "96문항으로 확인",
       "객관식·빈칸·연결·순서·복수·단답·서술·그림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "개념·예제로 근거를 살핀 뒤 유형 연습을 풀어요. 오른쪽 날개에서 핵심·보충 설명을 읽고 내가 정리할 것을 남겨요. 정답과 실제로 관찰·제작·실천한 일은 따로 확인해요."
    },
    {
     "type": "field",
     "title": "교사와 준비하기",
     "hint": "안전한 모형 재료·관찰 방법·참여 방법을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "불분명한 결과도 지우지 않고 다시 볼 조건을 찾아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "교사가 구멍·날카로운 부분·병 절단을 준비해요. 관절을 억지로 꺾거나 숨참기·목 누르기를 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "준비 점검 1~2",
   "title": "기관의 협력",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-01",
      "body-book-02"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 기관만 따로 일한다고 생각하지 않는다. 방광은 오줌을 만드는 곳이 아니라 저장하는 곳이다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "준비 점검 3~4",
   "title": "두 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-03",
      "body-book-04"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "섭취한 물이 곧바로 오줌관으로 떨어진다고 설명하지 않는다. 정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "뼈와 근육",
   "title": "모양과 위치를 하는 일에 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "구조",
      "살펴볼 특징",
      "하는 일"
     ],
     "rows": [
      [
       "머리뼈",
       "머리를 둘러쌈",
       "뇌 보호"
      ],
      [
       "갈비뼈",
       "가슴 공간을 둘러쌈",
       "심장·폐 보호"
      ],
      [
       "등뼈",
       "여러 뼈가 기둥처럼 연결",
       "지탱·척수 보호"
      ],
      [
       "팔뼈·다리뼈",
       "길고 관절로 연결",
       "지탱·움직임"
      ]
     ]
    },
    {
     "type": "text",
     "text": "뼈와 뼈가 연결되는 부분은 관절이에요. 뼈·관절·근육은 움직임에 함께 관여해요. 뼈가 스스로 줄어 팔을 접는 것은 아니에요."
    },
    {
     "type": "field",
     "title": "구조와 기능",
     "hint": "한 뼈의 생김새·위치와 하는 일을 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모양을 외우는 데서 끝내지 않고 지탱·보호·움직임을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모든 뼈의 연결이 팔꿈치처럼 움직이는 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "팔의 움직임",
   "title": "짧아지는 근육이 뼈를 당겨요",
   "blocks": [
    {
     "type": "diagram",
     "key": "arm",
     "caption": "두 자세를 나타낸 설명 모형이에요. 사진에서 근육 길이·힘을 정밀하게 재지 않아요."
    },
    {
     "type": "example",
     "question": "팔을 굽힐 때 뼈가 짧아질까요?",
     "steps": [
      [
       "관찰",
       "팔꿈치와 안쪽 근육의 변화를 살펴요."
      ],
      [
       "설명",
       "이 굽힘에서는 안쪽 근육이 짧아져 뼈를 당겨요."
      ],
      [
       "구별",
       "뼈 자체가 수축하거나 근육이 뼈를 밀어 접는 것은 아니에요."
      ]
     ],
     "answer": "팔을 펼 때에는 반대편 근육의 작용도 연결해요."
    },
    {
     "type": "field",
     "title": "실제 관찰",
     "hint": "편한 범위에서 팔을 굽히고 펴며 느낀 변화와 불분명한 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "근육의 작용과 관절로 연결된 뼈의 움직임을 이어 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "다른 사람 몸을 허락 없이 만지지 않고 내 팔 관찰이 어려우면 모형·자료로 참여해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 모형 만들기",
   "title": "실을 당겨 움직이고 고쳐 시험해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "재료",
      "대응"
     ],
     "rows": [
      [
       "안전한 두 막대",
       "뼈"
      ],
      [
       "교사 준비 연결 부품",
       "관절"
      ],
      [
       "당길 실과 손의 조작",
       "근육의 당김 표현"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "실을 붙일 위치·당길 방향과 막대 움직임을 설계해요.",
      "교사 준비 재료를 실제로 연결하고 정한 실을 조금씩 당겨요.",
      "안 움직이거나 연결이 빠진 결과도 남기고 한 곳을 고쳐 재시험해요."
     ]
    },
    {
     "type": "field",
     "title": "설계와 실제 시험",
     "hint": "당긴 부분·움직인 막대·고친 곳·재시험 결과를 짧게 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설계 그림만 있다면 실제 제작·시험 전이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "손이나 실이 끼지 않는지 확인하고 무리하게 당기지 않아요. 모형 실은 스스로 수축하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "모형의 한계 읽기",
   "title": "용수철 사진은 무엇을 보여 줄까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceArmPair",
     "caption": ""
    },
    {
     "type": "example",
     "question": "손으로 먼저 굽혀 용수철 길이가 바뀌었다면?",
     "steps": [
      [
       "모형의 조작",
       "손으로 막대 자세를 바꾸었어요."
      ],
      [
       "그 뒤의 변화",
       "용수철 길이가 달라졌어요."
      ],
      [
       "실제 몸과 비교",
       "실제 근육의 능동 수축이 원인인 과정을 모두 재현한 것은 아니에요."
      ]
     ],
     "answer": "자세의 대응과 움직임을 일으킨 원인을 구별해요."
    },
    {
     "type": "field",
     "title": "모형을 고른 까닭",
     "hint": "도움이 된 점과 실제 몸과 다른 점을 하나씩 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "그럴듯한 두 자세만으로 움직임의 원인을 증명하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실을 먼저 당겨 움직인 내 모형과 손으로 먼저 굽힌 수동 모형의 앞뒤를 나누어 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "뼈·관절·근육 5~6",
   "title": "뼈와 관절",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-05",
      "body-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "뼈 한가운데가 고무처럼 휜다고 생각하지 않는다. 뼈의 이름만 외우지 않고 형태와 기능을 연결한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "뼈·관절·근육 7~8",
   "title": "팔의 움직임",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-07",
      "body-book-08"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "근육이 뼈를 미는 것과 수축해 당기는 것을 혼동하지 않는다. 머리뼈를 반드시 하나의 뼈라고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "뼈·관절·근육 9~10",
   "title": "모형의 대응",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-09",
      "body-book-10"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형 재료가 실제 기관과 완전히 같다고 일반화하지 않는다. 팔이 먼저 움직여서 근육이 수축한다고 원인을 거꾸로 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소화와 음식물의 길",
   "title": "음식물이 직접 지나는 기관을 이어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "torso",
     "caption": "몸 기준 앞/뒤·좌/우를 먼저 정하고 이름표와 자료를 대조해요."
    },
    {
     "type": "text",
     "text": "입 → 식도 → 위 → 작은창자 → 큰창자 → 항문"
    },
    {
     "type": "table",
     "heads": [
      "주요 기관",
      "하는 일"
     ],
     "rows": [
      [
       "입·식도",
       "음식물을 잘게 씹고 침과 섞어 위로 보냄"
      ],
      [
       "위·작은창자",
       "소화를 이어 가며 영양소를 주로 흡수"
      ],
      [
       "큰창자·항문",
       "남은 내용물에서 물을 흡수하고 찌꺼기를 내보냄"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "소화는 흡수할 수 있는 작은 형태로 바꾸는 과정이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "간은 소화를 돕지만 음식물 덩어리가 간 속을 직접 지나는 길에 넣지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "소화와 흡수",
   "title": "구조가 하는 일에 어떤 도움이 될까요?",
   "blocks": [
    {
     "type": "example",
     "question": "작은창자가 길고 안쪽에 작은 돌기가 있다면?",
     "steps": [
      [
       "구조",
       "내용물과 닿을 수 있는 면적이 넓어져요."
      ],
      [
       "기능",
       "소화된 영양소를 흡수하는 데 도움이 돼요."
      ]
     ],
     "answer": "영양소를 흡수하는 일과 혈액이 운반하는 일을 연결해요."
    },
    {
     "type": "table",
     "heads": [
      "물질",
      "연결할 길"
     ],
     "rows": [
      [
       "음식물",
       "소화 기관을 지남"
      ],
      [
       "흡수한 영양소",
       "혈액을 통해 몸의 여러 곳으로 운반"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "식도·작은창자·큰창자의 역할을 구별해 설명해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "크거나 길다는 말만 쓰지 말고 어떤 기능에 도움이 되는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "먹은 음식 덩어리가 심장·콩팥으로 그대로 흘러간다고 연결하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "소화와 흡수 11~12",
   "title": "소화의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-11",
      "body-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "음식물의 길과 소화·흡수의 역할을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "단순히 위에 잠시 보관하는 것만을 소화라고 하지 않는다. 음식물이 지나간다는 사실만으로 모든 기관의 기능을 같게 보지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소화와 흡수 13~14",
   "title": "음식물의 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-13",
      "body-book-14"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "음식물의 길과 소화·흡수의 역할을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "간이나 심장을 음식물이 직접 지나는 길에 넣지 않는다. 작은창자/큰창자를 크기 이름만으로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소화와 흡수 15~16",
   "title": "지나는 길과 돕는 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-15",
      "body-book-16"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "음식물의 길과 소화·흡수의 역할을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "소화에 도움을 준다는 것과 음식물 통과를 구별한다. 큰창자보다 가늘기 때문에 흡수를 못 한다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "순환 기관",
   "title": "심장·혈관·혈액의 역할을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "heart",
     "caption": "심장 겉모양 교육 모형이에요. 빨강/파랑은 구분 표시이며 실제 피가 파란색이라는 뜻이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "역할"
     ],
     "rows": [
      [
       "심장",
       "펌프처럼 혈액을 내보냄"
      ],
      [
       "혈관",
       "온몸에 이어진 혈액의 길"
      ],
      [
       "혈액",
       "영양소·산소·이산화탄소·노폐물 등을 운반"
      ]
     ]
    },
    {
     "type": "text",
     "text": "심장은 두 폐 사이 가슴 가운데에서 약간 몸의 왼쪽에 있어요. 모형을 보는 나의 좌우와 몸 기준 좌우를 먼저 구별해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름과 운반 역할을 함께 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 색·거리·크기를 실제 기관과 똑같다고 보지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "순환과 기관의 연결",
   "title": "얻은 물질을 필요한 곳으로 운반해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "얻거나 옮길 물질",
      "기관의 협력"
     ],
     "rows": [
      [
       "흡수한 영양소",
       "소화 기관 → 혈액으로 운반"
      ],
      [
       "산소",
       "폐 → 혈액으로 받아 운반"
      ],
      [
       "이산화탄소",
       "몸의 여러 곳 → 혈액 → 폐"
      ],
      [
       "노폐물 등",
       "혈액 → 콩팥 같은 배설 기관"
      ]
     ]
    },
    {
     "type": "example",
     "question": "폐에서 산소를 받으면 다른 기관은 필요 없을까요?",
     "steps": [
      [
       "호흡",
       "폐에서 산소를 받아들여요."
      ],
      [
       "소화",
       "소화·흡수로 영양소를 얻어요."
      ],
      [
       "순환",
       "혈액이 필요한 물질을 운반해요."
      ]
     ],
     "answer": "여러 기관이 서로 연결되어 일해요."
    },
    {
     "type": "field",
     "title": "협력의 근거",
     "hint": "물질 하나가 어디서 어디로 가는지 기관을 넣어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "폐·심장·온몸으로 이어지는 순환의 큰 흐름을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구분 화살표의 뜻을 읽고 음식물·공기 덩어리가 그대로 혈관 속을 도는 것처럼 그리지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "펌프 자료 해석",
   "title": "한 번의 양과 같은 시간 총량은 달라요",
   "blocks": [
    {
     "type": "text",
     "text": "실제 측정값이 아닌 연습 가정이에요. 각10초, 한 번4mL가 같다고 가정해요."
    },
    {
     "type": "table",
     "heads": [
      "횟수",
      "1회량 가정",
      "총량"
     ],
     "rows": [
      [
       "8회",
       "4mL",
       "32mL"
      ],
      [
       "12회",
       "4mL",
       "48mL"
      ]
     ]
    },
    {
     "type": "example",
     "question": "12번 누른 쪽은 한 번의 양도 더 커졌을까요?",
     "steps": [
      [
       "같게 둠",
       "이 표에서는1회량을4mL로 같게 두었어요."
      ],
      [
       "달라짐",
       "같은10초의 횟수가8→12회로 늘었어요."
      ],
      [
       "판단",
       "총량32→48mL가 늘어도1회량 증가를 뜻하지 않아요."
      ]
     ],
     "answer": "실제 펌프라면 누르는 깊이·복귀·물 높이와 따로 잰1회량도 확인해요."
    },
    {
     "type": "field",
     "title": "교사 준비 펌프와 비교",
     "hint": "확인할 조건과 모형이 실제 심장과 다른 점을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "총량·횟수·한 번의 양을 각각 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물 펌프는 운반을 설명하는 모형이에요. 입으로 물을 빨지 않고 혈액 순환의 모든 작용을 재현했다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "순환과 운반 17~18",
   "title": "순환의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-17",
      "body-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "심장·혈관·혈액의 서로 다른 역할과 운반을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "혈관을 공기만 지나는 관이라고 하지 않는다. 심장이 영양소와 산소를 직접 만들어 낸다고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "순환과 운반 19~20",
   "title": "심장의 위치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-19",
      "body-book-20"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "심장·혈관·혈액의 서로 다른 역할과 운반을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "“왼쪽 가슴 아래”만 외워 배에 있다고 표시하지 않는다. 한 번 온몸에 가면 혈액이 사라진다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "순환과 운반 21~22",
   "title": "혈액이 하는 일",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-21",
      "body-book-22"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "심장·혈관·혈액의 서로 다른 역할과 운반을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "혈액과 오줌을 같은 전체로 보지 않는다. 파란 관을 보았다는 사실을 실제 혈액 색의 관찰로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "호흡 기관",
   "title": "공기 길과 폐의 일을 연결해요",
   "blocks": [
    {
     "type": "text",
     "text": "코 → 기관 → 기관지 → 폐"
    },
    {
     "type": "table",
     "heads": [
      "하는 일",
      "설명"
     ],
     "rows": [
      [
       "들이쉬기",
       "공기 중 산소를 혈액으로 받아들이는 데 관여"
      ],
      [
       "내쉬기",
       "혈액이 운반해 온 이산화탄소를 내보내는 데 관여"
      ]
     ]
    },
    {
     "type": "text",
     "text": "가로막과 갈비뼈 움직임 등으로 가슴 안 공간이 변하며 공기가 드나들어요. 들숨에서 가로막이 내려가 공간이 커지는 변화를 교사 준비 모형과 비교해요."
    },
    {
     "type": "field",
     "title": "서로 다른 길",
     "hint": "음식물 길과 공기 길이 다른 까닭을 기관 이름으로 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "들이마신 산소가 전부 이산화탄소로 바뀐다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "호흡의 부피 변화와 폐·혈액 사이의 기체 교환은 서로 관련되지만 다른 설명이에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "호흡 모형",
   "title": "막·공간·풍선의 변화를 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "breathing",
     "caption": "병·풍선·아래 막의 설명 장면. 실제 연결·밀폐·공기 통로는 교사와 확인해요."
    },
    {
     "type": "table",
     "heads": [
      "모형",
      "대응해 살필 부분"
     ],
     "rows": [
      [
       "풍선",
       "폐의 부피 변화"
      ],
      [
       "아래 고무막",
       "가로막 움직임과 공간 변화"
      ],
      [
       "병·위쪽 관",
       "가슴 공간·공기 드나드는 길"
      ]
     ]
    },
    {
     "type": "text",
     "text": "아래 막을 당겨 공간이 커지면 관을 통해 공기가 들어와 풍선이 커질 수 있어요. 이 장치는 위쪽 관이 공기와 통하고 병과 막이 제대로 밀폐된 경우예요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형과 실제 몸의 대응을 읽고 한계도 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "풍선이 커져도 실제 혈액 속 산소량이나 기체 교환 속도를 직접 본 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 모형 관찰",
   "title": "기대한 모습과 달라도 그대로 살펴요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 절단·구멍·연결을 준비한 장치와 참여 조건을 확인해요.",
      "아래 막을 조금 당겼다가 놓으며 실제 막 위치와 풍선 크기를 살펴요.",
      "안 커지면 그대로 남기고 누출·관/풍선 연결을 교사와 확인해 재시험해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "실제 조작",
      "풍선의 실제 변화",
      "불분명·더 볼 조건"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "모형의 한계",
     "hint": "기체 교환·갈비뼈 움직임 중 이 장치가 직접 보여 주지 못하는 점을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "장치 실패를 사람 폐의 건강에 대한 결과로 바꾸지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "입으로 장치에 불거나 숨을 참지 않아요. 풍선 재료와 날카로운 부분은 교사와 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "호흡과 모형 23~24",
   "title": "공기의 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-23",
      "body-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 길·모형 변화·실제 기체 교환을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공기가 음식물과 함께 식도를 거쳐 폐로 간다고 하지 않는다. 들숨을 순수한 산소, 날숨을 순수한 이산화탄소라고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "호흡과 모형 25~26",
   "title": "호흡 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-25",
      "body-book-26"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 길·모형 변화·실제 기체 교환을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "고무막을 내린 것을 날숨과 연결하지 않는다. 겉모양이 같아야만 모형의 대응이 가능한 것은 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "호흡과 모형 27~28",
   "title": "공기가 나가는 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-27",
      "body-book-28"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 길·모형 변화·실제 기체 교환을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "들이쉬는 방향을 그대로 쓰지 않는다. 풍선이 커졌다는 것만으로 산소와 이산화탄소 교환을 측정했다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "배설 기관",
   "title": "만드는 곳·길·모으는 곳을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "urinary",
     "caption": "콩팥·오줌관·방광·요도의 연결 모형. 실제 크기·거리와 다르게 배치했어요."
    },
    {
     "type": "text",
     "text": "콩팥 → 오줌관 → 방광 → 요도 → 몸 밖"
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "주된 기능"
     ],
     "rows": [
      [
       "콩팥",
       "혈액 속 노폐물과 여분의 물 등을 걸러 오줌 생성"
      ],
      [
       "오줌관",
       "만들어진 오줌이 내려오는 길"
      ],
      [
       "방광·요도",
       "잠시 저장·몸 밖으로 배출"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "방광은 오줌을 만드는 곳이 아니라 저장하는 곳이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "콩팥에서 혈액 전체가 통째로 오줌으로 바뀐다는 뜻은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "세 가지 경로 비교",
   "title": "무엇이 어디로 이동할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "물질",
      "구별할 경로"
     ],
     "rows": [
      [
       "음식물 찌꺼기",
       "큰창자 → 항문"
      ],
      [
       "만들어진 오줌",
       "콩팥 → 오줌관 → 방광 → 요도"
      ],
      [
       "혈액 속 노폐물",
       "혈액으로 콩팥 등 배설 기관에 운반"
      ]
     ]
    },
    {
     "type": "example",
     "question": "마신 물이 식도에서 오줌관으로 바로 내려갈까요?",
     "steps": [
      [
       "흡수",
       "소화 기관에서 흡수되어 혈액으로 운반돼요."
      ],
      [
       "오줌 생성",
       "콩팥에서 걸러 만들어진 오줌이 오줌관을 지나요."
      ]
     ],
     "answer": "음식물 길과 흡수 뒤 물질의 길을 나누어요."
    },
    {
     "type": "field",
     "title": "경로를 고쳐 설명하기",
     "hint": "식도·혈액·콩팥·오줌관의 관계를 글과 화살표로 나타내요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름을 나열하기 전에 이동하는 물질을 정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "땀은 체온 조절과 관련돼요. 땀 양만으로 노폐물이 모두 빠졌다거나 건강하다고 판단하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "배설과 경로 29~30",
   "title": "오줌 생성과 저장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-29",
      "body-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오줌 생성·이동·저장과 음식물 찌꺼기의 길을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "방광이 혈액을 직접 걸러 오줌을 만든다고 하지 않는다. 오줌은 소화되지 않은 음식물이 그대로 변한 것이라고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "배설과 경로 31~32",
   "title": "물질이 나가는 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-31",
      "body-book-32"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오줌 생성·이동·저장과 음식물 찌꺼기의 길을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "오줌관과 요도를 같은 위치의 한 이름으로 바꾸지 않는다. 기관 이름이 비슷하다고 기능을 합치지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "배설과 경로 33~34",
   "title": "배설과 소화 찌꺼기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-33",
      "body-book-34"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오줌 생성·이동·저장과 음식물 찌꺼기의 길을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모두 몸 밖으로 나온다고 같은 기관을 지난다고 하지 않는다. 땀을 많이 내는 것을 건강 점수로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "여러 기관의 협력",
   "title": "걷는 동안 몸은 어떻게 함께 일할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "하는 일",
      "함께 연결할 기관"
     ],
     "rows": [
      [
       "움직임",
       "뼈·관절·근육"
      ],
      [
       "영양소 얻기",
       "소화·흡수 기관"
      ],
      [
       "산소 받아들이기",
       "폐 등 호흡 기관"
      ],
      [
       "필요한 물질 운반",
       "심장·혈관·혈액"
      ],
      [
       "노폐물 내보내기",
       "콩팥 등 배설 기관"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 연결 설명",
     "hint": "필요한 물질·기관·이동 방향을 넣어 네 기관계의 협력을 설명해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 기관의 기능으로 몸 전체의 일을 대신하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "정답을 맞힌 것과 실제로 관찰·만들어 설명한 것은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "몸 변화 연습 자료",
   "title": "같은1분 자료에서 달라진 것을 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "exercise",
     "caption": ""
    },
    {
     "type": "example",
     "question": "걷기 직후와 잠시 쉰 뒤를 비교하면?",
     "steps": [
      [
       "직후",
       "맥박98회·호흡27회예요."
      ],
      [
       "쉰 뒤",
       "맥박78회·호흡20회예요."
      ],
      [
       "범위",
       "이 연습 자료에서 줄었다는 사실을 읽어요."
      ]
     ],
     "answer": "이 값을 모든 친구의 정상값이나 실제 나의 관찰값으로 쓰지 않아요."
    },
    {
     "type": "field",
     "title": "조건을 먼저 확인해요",
     "hint": "같은 사람·방법·구간 길이와 시작 시점을 확인해야 하는 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료마다 제시한 관찰 구간·시점을 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "뒤 문항의30초 기록은 별도 자료예요. 여기의1분 기록과 섞어 건강 순위를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 몸 변화 관찰",
   "title": "같은 사람·구간·방법으로 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사와 무리 없는 참여 방법·가벼운 활동·관찰 시간을 정해요.",
      "쉰 뒤와 걷기 뒤 같은 길이의 구간에서 손목 맥박·호흡을 살펴요.",
      "다시 쉰 뒤 관찰하고 실제 시작 지연·잘 못 셈·불분명을 남겨요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "시점",
      "관찰 구간·실제 횟수",
      "걷기/쉰 시간·시작 지연·불분명"
     ],
     "rows": [
      [
       "전",
       "",
       ""
      ],
      [
       "직후",
       "",
       ""
      ],
      [
       "쉰 뒤",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "내가 확인한 범위",
     "hint": "조건과 실제 변화·더 확인할 점을 짧게 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 값을 책의 예상값으로 고치지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "몸이 불편하면 멈추고 교사에게 알려요. 직접 참여가 어려우면 시범/자료로 비교해요. 숨참기·목 누르기·강한 운동은 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "관찰 방법 예제",
   "title": "30초와1분의 횟수를 바로 비교할까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "pulse",
     "caption": "손목 관찰 자세의 설명이에요. 사진에 관찰 수치는 없어요."
    },
    {
     "type": "example",
     "question": "A20초24회, B30초30회라면 누가 더 건강할까요?",
     "steps": [
      [
       "조건",
       "관찰 구간 길이가 달라요."
      ],
      [
       "확인",
       "같은 사람·방법·시점인지도 확인해요."
      ],
      [
       "한계",
       "이 두 횟수만으로 건강을 진단하지 않아요."
      ]
     ],
     "answer": "짧은 구간에서 환산했다면 실제1분 관찰과 구별해요."
    },
    {
     "type": "field",
     "title": "비교 방법을 고쳐요",
     "hint": "두 자료를 같은 조건에서 살피기 위해 확인할 것을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "검지·중지로 반대쪽 손목 엄지 아래 부분을 가볍게 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "내가 잘 못 셌다면 숨기지 않고 다시 확인할 점으로 남겨요. 다른 친구와 횟수를 겨루지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "협력과 관찰 조건 35~36",
   "title": "기능의 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-35",
      "body-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 사람·방법·관찰 구간과 실제 시작 시점을 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "기관 하나가 모든 물질을 직접 만든다고 하지 않는다. 관찰을 친구 간 건강 순위 매기기로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "협력과 관찰 조건 37~38",
   "title": "관찰 시간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-37",
      "body-book-38"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 사람·방법·관찰 구간과 실제 시작 시점을 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "시간 단위를 빼고 횟수만 비교하지 않는다. 최대 운동 능력을 겨루거나 숨을 참는 활동을 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "협력과 관찰 조건 39~40",
   "title": "기관의 협력",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-39",
      "body-book-40"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 사람·방법·관찰 구간과 실제 시작 시점을 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 번의 관찰이 모든 사람에게 같은 숫자로 나타난다고 하지 않는다. 자료 문제의 모형 값을 건강의 정상/이상 기준으로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "질병과 예방 조사",
   "title": "관련 기관·행동·까닭을 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "조사 질문",
      "확인할 내용"
     ],
     "rows": [
      [
       "어느 기관과 관련되나요?",
       "소화·호흡·순환·배설 중 관련과 범위"
      ],
      [
       "어떤 행동이 도움이 되나요?",
       "예방 행동·과학적 까닭·대상"
      ],
      [
       "다시 찾아볼 수 있나요?",
       "자료 제목·기관·쪽/주소·확인 날짜"
      ]
     ]
    },
    {
     "type": "text",
     "text": "예를 들어 노로바이러스 장염과 소화기관, 인플루엔자와 호흡기관의 관련을 교사 확인 자료에서 살펴요. 여러 모둠의 사례를 모아 네 기관계의 질문을 비교할 수 있어요."
    },
    {
     "type": "field",
     "title": "내가 조사한 근거",
     "hint": "관련 기관·질병과 실제 읽은 자료의 예방 행동·까닭을 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처 없는 광고·댓글을 효능의 근거로 쓰지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "개인 병력·약 복용 정보를 모으거나 치료법을 시험하지 않아요. 자료의 대상과 확인한 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "여러 날 실제 실천",
   "title": "기회·실제 행동·보완을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "health",
     "caption": "한 순간의 설명 장면이에요. 사진 한 장이 전체 과정·시간·실제 생활 실천을 증명하지는 않아요."
    },
    {
     "type": "text",
     "text": "질병관리청은 물과 비누로30초 이상 꼼꼼하게 손씻기를 안내해요. 감염 전파 위험을 줄이는 데 도움을 줄 수 있지만 모든 질병의 완전 예방을 보장하는 것은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "날짜·실제 기회",
      "한 행동/못한 행동·까닭",
      "다음에 보완할 점"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "계속할 행동",
     "hint": "교사와 읽은 근거에서 내가 실제로 할 행동 하나를 정하고 다음 날에도 돌아보아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획만 세운 날과 실제로 한 날, 기회가 없었던 날을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "못한 날을 지우거나 미래 결과를 미리 채우지 않아요. 실천 횟수로 모든 질병 예방을 증명하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "자료 제작과 나누기",
   "title": "기관과 예방 행동이 연결되게 만들어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "자료에 넣을 것",
      "설명"
     ],
     "rows": [
      [
       "기관·질병",
       "교사 자료에서 확인한 관련"
      ],
      [
       "행동·까닭",
       "언제·어떻게·왜 도움이 되는가"
      ],
      [
       "그림·이름표·출처",
       "대상이 이해할 관련 부분과 다시 볼 자료"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "종이나 디지털 도구로 카드/포스터를 실제로 만들어요.",
      "짝이나 정한 대상에게 실제로 보여 주고 질문을 들어요.",
      "이름표·까닭 설명을 보완하고 아직 안 나눈 것은 다음 계획으로 남겨요."
     ]
    },
    {
     "type": "field",
     "title": "받은 질문과 고칠 근거",
     "hint": "실제 의견과 내가 예상한 질문을 나누어 짧게 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료 저장과 실제 전달은 다른 행동이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "긴 보고서를 채우지 않아도 관련 기관·행동·까닭과 고친 근거를 짧게 남길 수 있어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 41~42",
   "title": "조사 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-41",
      "body-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "출처 이름만 적고 내용을 확인했다고 주장하지 않는다. 증상 한 가지를 보고 친구의 병명을 정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 43~44",
   "title": "생활 실천과 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-43",
      "body-book-44"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 번 실천하면 모든 질병을 막는다고 보장하지 않는다. 체크 표시만 채운 것을 실제 실천의 증거로 간주하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 45",
   "title": "소개 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-45"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림이나 계획을 실제 제작·공유로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 46",
   "title": "실천과 되돌아보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-46"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실천하지 못한 날을 삭제하거나 미래 계획을 과거 실천으로 적지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 47~48",
   "title": "모형 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-47",
      "body-book-48"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형 실패를 곧바로 실제 기관의 실패로 일반화하지 않는다. 빠르게 누르면 반드시 한 번 양도 늘어난다고 말하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 49",
   "title": "단위 맞추기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-49"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이 문항은 건강 비교나 정상 수치 판정 문제가 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 50",
   "title": "모형 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-50"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관절을 움직였다는 것만으로 근육의 작용을 완전히 재현했다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 51~52",
   "title": "표의 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-51",
      "body-book-52"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰한 횟수와 보이지 않은 물질량을 혼동하지 않는다. 광고 문구나 경험 한 번을 치료 효과의 증거로 보지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 53~54",
   "title": "물질 이동 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-53",
      "body-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "음식물이 직접 이 길로 이동한다고 하지 않는다. 한 기관이 중요하다는 말이 다른 기관이 필요 없다는 뜻은 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 55~56",
   "title": "조사 대상과 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-55",
      "body-book-56"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공공기관 이름만 있다고 실제 내용을 읽지 않아도 되는 것은 아니다. 예정일을 실제 전달일로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 57",
   "title": "근거의 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-57"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "올바른 실천도 결과를100% 보장하는 치료로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 58",
   "title": "실제 기록 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-58"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "연습 표의 값을 내 실제 기록으로 복사하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "한눈에 정리",
   "title": "구조 → 기능 → 물질의 길 → 협력",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배운 내용",
      "연결할 근거"
     ],
     "rows": [
      [
       "뼈·관절·근육",
       "당김·실제 모형 제작·원인과 결과"
      ],
      [
       "소화·호흡·순환·배설",
       "음식물·흡수한 영양소·기체·혈액·오줌"
      ],
      [
       "몸 변화",
       "같은 사람·방법·관찰 구간·시점"
      ],
      [
       "건강 생활",
       "질병/예방 근거·여러 날 실제 행동·보완"
      ]
     ]
    },
    {
     "type": "field",
     "title": "핵심 설명 한 문장",
     "hint": "한 기관의 기능을 다른 기관과 연결해 설명해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름을 외우는 데서 끝내지 않고 연결을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형·제공 자료·직접 관찰·생활 행동의 근거는 서로 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "빈칸 핵심 정리 59~60",
   "title": "움직임 정리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-59",
      "body-book-60"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름·기능·길과 계획/실제의 뜻을 문맥에 맞게 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "뼈만 스스로 움직인다고 하지 않는다. 흡수 뒤 영양소가 통째 음식물로 돌아간다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빈칸 핵심 정리 61~62",
   "title": "호흡과 순환",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-61",
      "body-book-62"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름·기능·길과 계획/실제의 뜻을 문맥에 맞게 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "들이쉬는 모든 공기를 산소라고 부르지 않는다. 두 관 이름을 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빈칸 핵심 정리 63~64",
   "title": "공정한 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-63",
      "body-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름·기능·길과 계획/실제의 뜻을 문맥에 맞게 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰 시간을 빼고 횟수만 비교하지 않는다. 계획만 세워 실천 완료라고 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 65~66",
   "title": "뼈와 근육",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-65",
      "body-book-66"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관절과 근육의 역할을 같게 합치지 않는다. 뼈 길이가 줄어서 굽는다고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 67~68",
   "title": "모형과 몸",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-67",
      "body-book-68"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실은 실제 근육의 모든 성질을 가지지 않는다. 늘어나는 근육이 뼈를 밀어낸다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 69~70",
   "title": "흡수 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-69",
      "body-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이름의 작다/크다만으로 기능을 추측하지 않는다. 위 앞에 작은창자나 큰창자를 놓지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 71~72",
   "title": "소화와 순환 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-71",
      "body-book-72"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "직접 지나는 기관과 돕는 기관을 구별한다. 직접 연결된 하나의 관처럼 그리지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 73~74",
   "title": "심장의 작용",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-73",
      "body-book-74"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "심장이 산소를 직접 만들어 낸다고 하지 않는다. 혈관을 빈 공기 관이라고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 75~76",
   "title": "혈액의 운반",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-75",
      "body-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "밥알이나 들숨 공기 덩어리 자체라고 쓰지 않는다. 차이를 건강 점수로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 77~78",
   "title": "호흡의 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-77",
      "body-book-78"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "기관과 식도의 이름을 바꾸지 않는다. 고무막 자체가 공기를 만들어 낸다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 79~80",
   "title": "모형이 보여 주는 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-79",
      "body-book-80"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형이 닮았다는 이유로 모든 기능을 실측했다고 하지 않는다. 혈액 전체가 오줌이 되어 사라진다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 81~82",
   "title": "배설 기능",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-81",
      "body-book-82"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "오줌관과 요도를 혼동하지 않는다. 오줌이 항문을 통해 나간다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 83",
   "title": "기관 연결 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-83"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "정밀한 해부 그림이나 혈관 이름 암기는 요구하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 84~85",
   "title": "질병과 생활",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-84",
      "body-book-85"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "예방 행동을 치료나100% 예방 보장으로 바꾸지 않는다. 예방 행동 한 가지를 모든 질병을 막는 방법으로 보장하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 86~87",
   "title": "실제 실천 일수",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-86",
      "body-book-87"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "계획한 날을 실천한 날에 더하지 않는다. 실제로 받지 않은 의견이나 하지 않은 재전달을 채워 넣지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 88",
   "title": "실천과 효과 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-88"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "생활 실천 기록을 예방 효과의 임상 시험 결과로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 89~90",
   "title": "움직임 바로잡기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-89",
      "body-book-90"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "근육과 관절의 도움을 함께 설명한다. 배설과 소화 찌꺼기 배출을 구별한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 91~92",
   "title": "시간 다시 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-91",
      "body-book-92"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "시간을 확인하지 않은 채40회 쪽이 더 빠르다고 단정하지 않는다. AI 이미지의 모형 상태를 내 실측값으로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 93~94",
   "title": "기능 다시 묶기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-93",
      "body-book-94"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모든 기관의 역할을 하나의 “좋게 한다”로 쓰지 않는다. 빈칸을 줄이려고 미실천을 숨기지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 95~96",
   "title": "자료 보완",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-95",
      "body-book-96"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "받지 않은 의견이나 하지 않은 재설명을 꾸미지 않는다. 맞은 개수만 적고 설명의 근거를 생략하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "설명 보완",
   "title": "처음 생각과 지금의 근거를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "처음 생각",
      "확인한 근거",
      "고친 설명"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "기관의 협력으로 설명하기",
     "hint": "기관 기능·물질 이동·모형/관찰의 한계 중 필요한 것을 넣어요.",
     "lines": 9,
     "draw": false
    },
    {
     "type": "field",
     "title": "다음 실제 활동",
     "hint": "더 확인할 조건이나 계속할 생활 행동과 방법을 정해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 생각이 그대로여도 근거를 밝히면 의미 있는 설명이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "문제의 답과 실제 수행은 따로 확인해요. 하지 못한 일은 다음 계획으로 남겨요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "자료와 찾아보기",
   "title": "필요한 근거로 돌아가요",
   "blocks": [
    {
     "type": "heading",
     "text": "현행 범위와 원교재"
    },
    {
     "type": "text",
     "text": "교육부 2022 개정 과학과 교육과정 [6과04-01~03]의 뼈·근육 모형, 네 기관계의 기능/관계, 몸 변화 관찰, 관련 질병/예방 조사와 실제 건강 생활을 연결했어요. 지필드 이론5-2-1 21~25쪽과 실험5-C 18~21/24~25쪽의 본문을 대조했어요."
    },
    {
     "type": "heading",
     "text": "건강·기관의 1차자료"
    },
    {
     "type": "text",
     "text": "질병관리청 국가건강정보포털 「손씻기」와 「2월에 주의해야 할 바이러스, 이렇게 예방하세요!」(2026-01), NIDDK의 소화·콩팥, NHLBI의 호흡, MedlinePlus의 손목 맥박 안내에서 관련 본문을 확인했어요. 성인 정상 수치·치료/약물·소독 약품 절차는 학생 실천으로 옮기지 않았어요."
    },
    {
     "type": "heading",
     "text": "사진·그림·문항"
    },
    {
     "type": "text",
     "text": "기존 교육 모형/설명 사진과 실험5-C 19쪽 원사진2장을 사용했어요. 원촬영 조건은 미확인이며 모형과 연습 값을 실제 학생 수행으로 바꾸지 않아요. 96문항은 기존 발문·자료·답·풀이·오개념을 모두 보존했어요."
    },
    {
     "type": "field",
     "title": "다시 볼 자료와 질문",
     "hint": "문항 번호와 필요한 개념·다음 관찰/실천 계획을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관·예방 출처의 제목·제공처·대상·확인 날짜를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옛6-2 관련 원문 발췌58·짝58·창작96의 은행212문항은 별도예요. 현행 전체 시험지 확보와 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  }
 ],
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "우리 몸의 구조와 기능",
   "blocks": [
    {
     "type": "diagram",
     "key": "torso",
     "caption": "여러 기관을 나타낸 교육 모형이에요. 실제 기관의 색·거리·크기와 구별해요."
    },
    {
     "type": "text",
     "text": "걷고 숨을 쉬며 생활할 때 몸의 여러 기관이 함께 일해요. 모형을 실제로 만들고 자료·관찰의 조건과 한계를 읽으면 기관의 협력을 근거로 설명할 수 있어요."
    },
    {
     "type": "field",
     "title": "나의 시작 질문",
     "hint": "몸의 움직임과 기관에서 궁금한 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·근육과 소화·호흡·순환·배설의 협력을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진·교육 모형·연습 값과 실제 나의 관찰·실천을 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이름·학습 날짜와 처음 질문을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "차례와 사용법",
   "title": "움직이는 모형에서 실제 생활로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "학습 길",
      "함께 할 일"
     ],
     "rows": [
      [
       "뼈·관절·근육",
       "팔 관찰·모형 제작·당김/재시험"
      ],
      [
       "소화·순환·호흡·배설",
       "각 기관의 구조·기능·물질의 길 비교"
      ],
      [
       "기관의 협력과 몸 변화",
       "같은 사람·구간·방법으로 전후 비교"
      ],
      [
       "건강 생활",
       "질병/예방 근거 조사·여러 날 실제 실천"
      ],
      [
       "96문항으로 확인",
       "객관식·빈칸·연결·순서·복수·단답·서술·그림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "개념·예제로 근거를 살핀 뒤 유형 연습을 풀어요. 오른쪽 날개에서 핵심·보충 설명을 읽고 내가 정리할 것을 남겨요. 정답과 실제로 관찰·제작·실천한 일은 따로 확인해요."
    },
    {
     "type": "field",
     "title": "교사와 준비하기",
     "hint": "안전한 모형 재료·관찰 방법·참여 방법을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "불분명한 결과도 지우지 않고 다시 볼 조건을 찾아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "교사가 구멍·날카로운 부분·병 절단을 준비해요. 관절을 억지로 꺾거나 숨참기·목 누르기를 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "준비 점검 1~2",
   "title": "기관의 협력",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-01",
      "body-book-02"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 기관만 따로 일한다고 생각하지 않는다. 방광은 오줌을 만드는 곳이 아니라 저장하는 곳이다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "준비 점검 3~4",
   "title": "두 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-03",
      "body-book-04"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "섭취한 물이 곧바로 오줌관으로 떨어진다고 설명하지 않는다. 정답이나 기록칸 수를 실제 수행으로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "뼈와 근육",
   "title": "모양과 위치를 하는 일에 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "구조",
      "살펴볼 특징",
      "하는 일"
     ],
     "rows": [
      [
       "머리뼈",
       "머리를 둘러쌈",
       "뇌 보호"
      ],
      [
       "갈비뼈",
       "가슴 공간을 둘러쌈",
       "심장·폐 보호"
      ],
      [
       "등뼈",
       "여러 뼈가 기둥처럼 연결",
       "지탱·척수 보호"
      ],
      [
       "팔뼈·다리뼈",
       "길고 관절로 연결",
       "지탱·움직임"
      ]
     ]
    },
    {
     "type": "text",
     "text": "뼈와 뼈가 연결되는 부분은 관절이에요. 뼈·관절·근육은 움직임에 함께 관여해요. 뼈가 스스로 줄어 팔을 접는 것은 아니에요."
    },
    {
     "type": "field",
     "title": "구조와 기능",
     "hint": "한 뼈의 생김새·위치와 하는 일을 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모양을 외우는 데서 끝내지 않고 지탱·보호·움직임을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모든 뼈의 연결이 팔꿈치처럼 움직이는 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "팔의 움직임",
   "title": "짧아지는 근육이 뼈를 당겨요",
   "blocks": [
    {
     "type": "diagram",
     "key": "arm",
     "caption": "두 자세를 나타낸 설명 모형이에요. 사진에서 근육 길이·힘을 정밀하게 재지 않아요."
    },
    {
     "type": "example",
     "question": "팔을 굽힐 때 뼈가 짧아질까요?",
     "steps": [
      [
       "관찰",
       "팔꿈치와 안쪽 근육의 변화를 살펴요."
      ],
      [
       "설명",
       "이 굽힘에서는 안쪽 근육이 짧아져 뼈를 당겨요."
      ],
      [
       "구별",
       "뼈 자체가 수축하거나 근육이 뼈를 밀어 접는 것은 아니에요."
      ]
     ],
     "answer": "팔을 펼 때에는 반대편 근육의 작용도 연결해요."
    },
    {
     "type": "field",
     "title": "실제 관찰",
     "hint": "편한 범위에서 팔을 굽히고 펴며 느낀 변화와 불분명한 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "근육의 작용과 관절로 연결된 뼈의 움직임을 이어 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "다른 사람 몸을 허락 없이 만지지 않고 내 팔 관찰이 어려우면 모형·자료로 참여해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 모형 만들기",
   "title": "실을 당겨 움직이고 고쳐 시험해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "재료",
      "대응"
     ],
     "rows": [
      [
       "안전한 두 막대",
       "뼈"
      ],
      [
       "교사 준비 연결 부품",
       "관절"
      ],
      [
       "당길 실과 손의 조작",
       "근육의 당김 표현"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "실을 붙일 위치·당길 방향과 막대 움직임을 설계해요.",
      "교사 준비 재료를 실제로 연결하고 정한 실을 조금씩 당겨요.",
      "안 움직이거나 연결이 빠진 결과도 남기고 한 곳을 고쳐 재시험해요."
     ]
    },
    {
     "type": "field",
     "title": "설계와 실제 시험",
     "hint": "당긴 부분·움직인 막대·고친 곳·재시험 결과를 짧게 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설계 그림만 있다면 실제 제작·시험 전이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "손이나 실이 끼지 않는지 확인하고 무리하게 당기지 않아요. 모형 실은 스스로 수축하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "모형의 한계 읽기",
   "title": "용수철 사진은 무엇을 보여 줄까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceArmPair",
     "caption": ""
    },
    {
     "type": "example",
     "question": "손으로 먼저 굽혀 용수철 길이가 바뀌었다면?",
     "steps": [
      [
       "모형의 조작",
       "손으로 막대 자세를 바꾸었어요."
      ],
      [
       "그 뒤의 변화",
       "용수철 길이가 달라졌어요."
      ],
      [
       "실제 몸과 비교",
       "실제 근육의 능동 수축이 원인인 과정을 모두 재현한 것은 아니에요."
      ]
     ],
     "answer": "자세의 대응과 움직임을 일으킨 원인을 구별해요."
    },
    {
     "type": "field",
     "title": "모형을 고른 까닭",
     "hint": "도움이 된 점과 실제 몸과 다른 점을 하나씩 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "그럴듯한 두 자세만으로 움직임의 원인을 증명하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실을 먼저 당겨 움직인 내 모형과 손으로 먼저 굽힌 수동 모형의 앞뒤를 나누어 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "뼈·관절·근육 5~6",
   "title": "뼈와 관절",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-05",
      "body-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "뼈 한가운데가 고무처럼 휜다고 생각하지 않는다. 뼈의 이름만 외우지 않고 형태와 기능을 연결한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "뼈·관절·근육 7~8",
   "title": "팔의 움직임",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-07",
      "body-book-08"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "근육이 뼈를 미는 것과 수축해 당기는 것을 혼동하지 않는다. 머리뼈를 반드시 하나의 뼈라고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "뼈·관절·근육 9~10",
   "title": "모형의 대응",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-09",
      "body-book-10"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뼈·관절·근육의 대응과 실제 당김의 앞뒤를 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형 재료가 실제 기관과 완전히 같다고 일반화하지 않는다. 팔이 먼저 움직여서 근육이 수축한다고 원인을 거꾸로 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소화와 음식물의 길",
   "title": "음식물이 직접 지나는 기관을 이어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "torso",
     "caption": "몸 기준 앞/뒤·좌/우를 먼저 정하고 이름표와 자료를 대조해요."
    },
    {
     "type": "text",
     "text": "입 → 식도 → 위 → 작은창자 → 큰창자 → 항문"
    },
    {
     "type": "table",
     "heads": [
      "주요 기관",
      "하는 일"
     ],
     "rows": [
      [
       "입·식도",
       "음식물을 잘게 씹고 침과 섞어 위로 보냄"
      ],
      [
       "위·작은창자",
       "소화를 이어 가며 영양소를 주로 흡수"
      ],
      [
       "큰창자·항문",
       "남은 내용물에서 물을 흡수하고 찌꺼기를 내보냄"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "소화는 흡수할 수 있는 작은 형태로 바꾸는 과정이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "간은 소화를 돕지만 음식물 덩어리가 간 속을 직접 지나는 길에 넣지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "소화와 흡수",
   "title": "구조가 하는 일에 어떤 도움이 될까요?",
   "blocks": [
    {
     "type": "example",
     "question": "작은창자가 길고 안쪽에 작은 돌기가 있다면?",
     "steps": [
      [
       "구조",
       "내용물과 닿을 수 있는 면적이 넓어져요."
      ],
      [
       "기능",
       "소화된 영양소를 흡수하는 데 도움이 돼요."
      ]
     ],
     "answer": "영양소를 흡수하는 일과 혈액이 운반하는 일을 연결해요."
    },
    {
     "type": "table",
     "heads": [
      "물질",
      "연결할 길"
     ],
     "rows": [
      [
       "음식물",
       "소화 기관을 지남"
      ],
      [
       "흡수한 영양소",
       "혈액을 통해 몸의 여러 곳으로 운반"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "식도·작은창자·큰창자의 역할을 구별해 설명해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "크거나 길다는 말만 쓰지 말고 어떤 기능에 도움이 되는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "먹은 음식 덩어리가 심장·콩팥으로 그대로 흘러간다고 연결하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "소화와 흡수 11~12",
   "title": "소화의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-11",
      "body-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "음식물의 길과 소화·흡수의 역할을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "단순히 위에 잠시 보관하는 것만을 소화라고 하지 않는다. 음식물이 지나간다는 사실만으로 모든 기관의 기능을 같게 보지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소화와 흡수 13~14",
   "title": "음식물의 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-13",
      "body-book-14"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "음식물의 길과 소화·흡수의 역할을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "간이나 심장을 음식물이 직접 지나는 길에 넣지 않는다. 작은창자/큰창자를 크기 이름만으로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소화와 흡수 15~16",
   "title": "지나는 길과 돕는 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-15",
      "body-book-16"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "음식물의 길과 소화·흡수의 역할을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "소화에 도움을 준다는 것과 음식물 통과를 구별한다. 큰창자보다 가늘기 때문에 흡수를 못 한다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "순환 기관",
   "title": "심장·혈관·혈액의 역할을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "heart",
     "caption": "심장 겉모양 교육 모형이에요. 빨강/파랑은 구분 표시이며 실제 피가 파란색이라는 뜻이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "역할"
     ],
     "rows": [
      [
       "심장",
       "펌프처럼 혈액을 내보냄"
      ],
      [
       "혈관",
       "온몸에 이어진 혈액의 길"
      ],
      [
       "혈액",
       "영양소·산소·이산화탄소·노폐물 등을 운반"
      ]
     ]
    },
    {
     "type": "text",
     "text": "심장은 두 폐 사이 가슴 가운데에서 약간 몸의 왼쪽에 있어요. 모형을 보는 나의 좌우와 몸 기준 좌우를 먼저 구별해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름과 운반 역할을 함께 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형의 색·거리·크기를 실제 기관과 똑같다고 보지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "순환과 기관의 연결",
   "title": "얻은 물질을 필요한 곳으로 운반해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "얻거나 옮길 물질",
      "기관의 협력"
     ],
     "rows": [
      [
       "흡수한 영양소",
       "소화 기관 → 혈액으로 운반"
      ],
      [
       "산소",
       "폐 → 혈액으로 받아 운반"
      ],
      [
       "이산화탄소",
       "몸의 여러 곳 → 혈액 → 폐"
      ],
      [
       "노폐물 등",
       "혈액 → 콩팥 같은 배설 기관"
      ]
     ]
    },
    {
     "type": "example",
     "question": "폐에서 산소를 받으면 다른 기관은 필요 없을까요?",
     "steps": [
      [
       "호흡",
       "폐에서 산소를 받아들여요."
      ],
      [
       "소화",
       "소화·흡수로 영양소를 얻어요."
      ],
      [
       "순환",
       "혈액이 필요한 물질을 운반해요."
      ]
     ],
     "answer": "여러 기관이 서로 연결되어 일해요."
    },
    {
     "type": "field",
     "title": "협력의 근거",
     "hint": "물질 하나가 어디서 어디로 가는지 기관을 넣어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "폐·심장·온몸으로 이어지는 순환의 큰 흐름을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "구분 화살표의 뜻을 읽고 음식물·공기 덩어리가 그대로 혈관 속을 도는 것처럼 그리지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "펌프 자료 해석",
   "title": "한 번의 양과 같은 시간 총량은 달라요",
   "blocks": [
    {
     "type": "text",
     "text": "실제 측정값이 아닌 연습 가정이에요. 각10초, 한 번4mL가 같다고 가정해요."
    },
    {
     "type": "table",
     "heads": [
      "횟수",
      "1회량 가정",
      "총량"
     ],
     "rows": [
      [
       "8회",
       "4mL",
       "32mL"
      ],
      [
       "12회",
       "4mL",
       "48mL"
      ]
     ]
    },
    {
     "type": "example",
     "question": "12번 누른 쪽은 한 번의 양도 더 커졌을까요?",
     "steps": [
      [
       "같게 둠",
       "이 표에서는1회량을4mL로 같게 두었어요."
      ],
      [
       "달라짐",
       "같은10초의 횟수가8→12회로 늘었어요."
      ],
      [
       "판단",
       "총량32→48mL가 늘어도1회량 증가를 뜻하지 않아요."
      ]
     ],
     "answer": "실제 펌프라면 누르는 깊이·복귀·물 높이와 따로 잰1회량도 확인해요."
    },
    {
     "type": "field",
     "title": "교사 준비 펌프와 비교",
     "hint": "확인할 조건과 모형이 실제 심장과 다른 점을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "총량·횟수·한 번의 양을 각각 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물 펌프는 운반을 설명하는 모형이에요. 입으로 물을 빨지 않고 혈액 순환의 모든 작용을 재현했다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "순환과 운반 17~18",
   "title": "순환의 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-17",
      "body-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "심장·혈관·혈액의 서로 다른 역할과 운반을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "혈관을 공기만 지나는 관이라고 하지 않는다. 심장이 영양소와 산소를 직접 만들어 낸다고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "순환과 운반 19~20",
   "title": "심장의 위치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-19",
      "body-book-20"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "심장·혈관·혈액의 서로 다른 역할과 운반을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "“왼쪽 가슴 아래”만 외워 배에 있다고 표시하지 않는다. 한 번 온몸에 가면 혈액이 사라진다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "순환과 운반 21~22",
   "title": "혈액이 하는 일",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-21",
      "body-book-22"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "심장·혈관·혈액의 서로 다른 역할과 운반을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "혈액과 오줌을 같은 전체로 보지 않는다. 파란 관을 보았다는 사실을 실제 혈액 색의 관찰로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "호흡 기관",
   "title": "공기 길과 폐의 일을 연결해요",
   "blocks": [
    {
     "type": "text",
     "text": "코 → 기관 → 기관지 → 폐"
    },
    {
     "type": "table",
     "heads": [
      "하는 일",
      "설명"
     ],
     "rows": [
      [
       "들이쉬기",
       "공기 중 산소를 혈액으로 받아들이는 데 관여"
      ],
      [
       "내쉬기",
       "혈액이 운반해 온 이산화탄소를 내보내는 데 관여"
      ]
     ]
    },
    {
     "type": "text",
     "text": "가로막과 갈비뼈 움직임 등으로 가슴 안 공간이 변하며 공기가 드나들어요. 들숨에서 가로막이 내려가 공간이 커지는 변화를 교사 준비 모형과 비교해요."
    },
    {
     "type": "field",
     "title": "서로 다른 길",
     "hint": "음식물 길과 공기 길이 다른 까닭을 기관 이름으로 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "들이마신 산소가 전부 이산화탄소로 바뀐다고 하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "호흡의 부피 변화와 폐·혈액 사이의 기체 교환은 서로 관련되지만 다른 설명이에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "호흡 모형",
   "title": "막·공간·풍선의 변화를 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "breathing",
     "caption": "병·풍선·아래 막의 설명 장면. 실제 연결·밀폐·공기 통로는 교사와 확인해요."
    },
    {
     "type": "table",
     "heads": [
      "모형",
      "대응해 살필 부분"
     ],
     "rows": [
      [
       "풍선",
       "폐의 부피 변화"
      ],
      [
       "아래 고무막",
       "가로막 움직임과 공간 변화"
      ],
      [
       "병·위쪽 관",
       "가슴 공간·공기 드나드는 길"
      ]
     ]
    },
    {
     "type": "text",
     "text": "아래 막을 당겨 공간이 커지면 관을 통해 공기가 들어와 풍선이 커질 수 있어요. 이 장치는 위쪽 관이 공기와 통하고 병과 막이 제대로 밀폐된 경우예요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형과 실제 몸의 대응을 읽고 한계도 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "풍선이 커져도 실제 혈액 속 산소량이나 기체 교환 속도를 직접 본 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 모형 관찰",
   "title": "기대한 모습과 달라도 그대로 살펴요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 절단·구멍·연결을 준비한 장치와 참여 조건을 확인해요.",
      "아래 막을 조금 당겼다가 놓으며 실제 막 위치와 풍선 크기를 살펴요.",
      "안 커지면 그대로 남기고 누출·관/풍선 연결을 교사와 확인해 재시험해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "실제 조작",
      "풍선의 실제 변화",
      "불분명·더 볼 조건"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "모형의 한계",
     "hint": "기체 교환·갈비뼈 움직임 중 이 장치가 직접 보여 주지 못하는 점을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "장치 실패를 사람 폐의 건강에 대한 결과로 바꾸지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "입으로 장치에 불거나 숨을 참지 않아요. 풍선 재료와 날카로운 부분은 교사와 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "호흡과 모형 23~24",
   "title": "공기의 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-23",
      "body-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 길·모형 변화·실제 기체 교환을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공기가 음식물과 함께 식도를 거쳐 폐로 간다고 하지 않는다. 들숨을 순수한 산소, 날숨을 순수한 이산화탄소라고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "호흡과 모형 25~26",
   "title": "호흡 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-25",
      "body-book-26"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 길·모형 변화·실제 기체 교환을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "고무막을 내린 것을 날숨과 연결하지 않는다. 겉모양이 같아야만 모형의 대응이 가능한 것은 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "호흡과 모형 27~28",
   "title": "공기가 나가는 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-27",
      "body-book-28"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 길·모형 변화·실제 기체 교환을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "들이쉬는 방향을 그대로 쓰지 않는다. 풍선이 커졌다는 것만으로 산소와 이산화탄소 교환을 측정했다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "배설 기관",
   "title": "만드는 곳·길·모으는 곳을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "urinary",
     "caption": "콩팥·오줌관·방광·요도의 연결 모형. 실제 크기·거리와 다르게 배치했어요."
    },
    {
     "type": "text",
     "text": "콩팥 → 오줌관 → 방광 → 요도 → 몸 밖"
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "주된 기능"
     ],
     "rows": [
      [
       "콩팥",
       "혈액 속 노폐물과 여분의 물 등을 걸러 오줌 생성"
      ],
      [
       "오줌관",
       "만들어진 오줌이 내려오는 길"
      ],
      [
       "방광·요도",
       "잠시 저장·몸 밖으로 배출"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "방광은 오줌을 만드는 곳이 아니라 저장하는 곳이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "콩팥에서 혈액 전체가 통째로 오줌으로 바뀐다는 뜻은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "세 가지 경로 비교",
   "title": "무엇이 어디로 이동할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "물질",
      "구별할 경로"
     ],
     "rows": [
      [
       "음식물 찌꺼기",
       "큰창자 → 항문"
      ],
      [
       "만들어진 오줌",
       "콩팥 → 오줌관 → 방광 → 요도"
      ],
      [
       "혈액 속 노폐물",
       "혈액으로 콩팥 등 배설 기관에 운반"
      ]
     ]
    },
    {
     "type": "example",
     "question": "마신 물이 식도에서 오줌관으로 바로 내려갈까요?",
     "steps": [
      [
       "흡수",
       "소화 기관에서 흡수되어 혈액으로 운반돼요."
      ],
      [
       "오줌 생성",
       "콩팥에서 걸러 만들어진 오줌이 오줌관을 지나요."
      ]
     ],
     "answer": "음식물 길과 흡수 뒤 물질의 길을 나누어요."
    },
    {
     "type": "field",
     "title": "경로를 고쳐 설명하기",
     "hint": "식도·혈액·콩팥·오줌관의 관계를 글과 화살표로 나타내요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름을 나열하기 전에 이동하는 물질을 정해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "땀은 체온 조절과 관련돼요. 땀 양만으로 노폐물이 모두 빠졌다거나 건강하다고 판단하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "배설과 경로 29~30",
   "title": "오줌 생성과 저장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-29",
      "body-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오줌 생성·이동·저장과 음식물 찌꺼기의 길을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "방광이 혈액을 직접 걸러 오줌을 만든다고 하지 않는다. 오줌은 소화되지 않은 음식물이 그대로 변한 것이라고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "배설과 경로 31~32",
   "title": "물질이 나가는 길",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-31",
      "body-book-32"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오줌 생성·이동·저장과 음식물 찌꺼기의 길을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "오줌관과 요도를 같은 위치의 한 이름으로 바꾸지 않는다. 기관 이름이 비슷하다고 기능을 합치지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "배설과 경로 33~34",
   "title": "배설과 소화 찌꺼기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-33",
      "body-book-34"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "오줌 생성·이동·저장과 음식물 찌꺼기의 길을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모두 몸 밖으로 나온다고 같은 기관을 지난다고 하지 않는다. 땀을 많이 내는 것을 건강 점수로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "여러 기관의 협력",
   "title": "걷는 동안 몸은 어떻게 함께 일할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "하는 일",
      "함께 연결할 기관"
     ],
     "rows": [
      [
       "움직임",
       "뼈·관절·근육"
      ],
      [
       "영양소 얻기",
       "소화·흡수 기관"
      ],
      [
       "산소 받아들이기",
       "폐 등 호흡 기관"
      ],
      [
       "필요한 물질 운반",
       "심장·혈관·혈액"
      ],
      [
       "노폐물 내보내기",
       "콩팥 등 배설 기관"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 연결 설명",
     "hint": "필요한 물질·기관·이동 방향을 넣어 네 기관계의 협력을 설명해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "한 기관의 기능으로 몸 전체의 일을 대신하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "정답을 맞힌 것과 실제로 관찰·만들어 설명한 것은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "몸 변화 연습 자료",
   "title": "같은1분 자료에서 달라진 것을 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "exercise",
     "caption": ""
    },
    {
     "type": "example",
     "question": "걷기 직후와 잠시 쉰 뒤를 비교하면?",
     "steps": [
      [
       "직후",
       "맥박98회·호흡27회예요."
      ],
      [
       "쉰 뒤",
       "맥박78회·호흡20회예요."
      ],
      [
       "범위",
       "이 연습 자료에서 줄었다는 사실을 읽어요."
      ]
     ],
     "answer": "이 값을 모든 친구의 정상값이나 실제 나의 관찰값으로 쓰지 않아요."
    },
    {
     "type": "field",
     "title": "조건을 먼저 확인해요",
     "hint": "같은 사람·방법·구간 길이와 시작 시점을 확인해야 하는 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료마다 제시한 관찰 구간·시점을 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "뒤 문항의30초 기록은 별도 자료예요. 여기의1분 기록과 섞어 건강 순위를 정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 몸 변화 관찰",
   "title": "같은 사람·구간·방법으로 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사와 무리 없는 참여 방법·가벼운 활동·관찰 시간을 정해요.",
      "쉰 뒤와 걷기 뒤 같은 길이의 구간에서 손목 맥박·호흡을 살펴요.",
      "다시 쉰 뒤 관찰하고 실제 시작 지연·잘 못 셈·불분명을 남겨요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "시점",
      "관찰 구간·실제 횟수",
      "걷기/쉰 시간·시작 지연·불분명"
     ],
     "rows": [
      [
       "전",
       "",
       ""
      ],
      [
       "직후",
       "",
       ""
      ],
      [
       "쉰 뒤",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "내가 확인한 범위",
     "hint": "조건과 실제 변화·더 확인할 점을 짧게 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 값을 책의 예상값으로 고치지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "몸이 불편하면 멈추고 교사에게 알려요. 직접 참여가 어려우면 시범/자료로 비교해요. 숨참기·목 누르기·강한 운동은 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "관찰 방법 예제",
   "title": "30초와1분의 횟수를 바로 비교할까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "pulse",
     "caption": "손목 관찰 자세의 설명이에요. 사진에 관찰 수치는 없어요."
    },
    {
     "type": "example",
     "question": "A20초24회, B30초30회라면 누가 더 건강할까요?",
     "steps": [
      [
       "조건",
       "관찰 구간 길이가 달라요."
      ],
      [
       "확인",
       "같은 사람·방법·시점인지도 확인해요."
      ],
      [
       "한계",
       "이 두 횟수만으로 건강을 진단하지 않아요."
      ]
     ],
     "answer": "짧은 구간에서 환산했다면 실제1분 관찰과 구별해요."
    },
    {
     "type": "field",
     "title": "비교 방법을 고쳐요",
     "hint": "두 자료를 같은 조건에서 살피기 위해 확인할 것을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "검지·중지로 반대쪽 손목 엄지 아래 부분을 가볍게 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "내가 잘 못 셌다면 숨기지 않고 다시 확인할 점으로 남겨요. 다른 친구와 횟수를 겨루지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "협력과 관찰 조건 35~36",
   "title": "기능의 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-35",
      "body-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 사람·방법·관찰 구간과 실제 시작 시점을 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "기관 하나가 모든 물질을 직접 만든다고 하지 않는다. 관찰을 친구 간 건강 순위 매기기로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "협력과 관찰 조건 37~38",
   "title": "관찰 시간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-37",
      "body-book-38"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 사람·방법·관찰 구간과 실제 시작 시점을 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "시간 단위를 빼고 횟수만 비교하지 않는다. 최대 운동 능력을 겨루거나 숨을 참는 활동을 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "협력과 관찰 조건 39~40",
   "title": "기관의 협력",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-39",
      "body-book-40"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 사람·방법·관찰 구간과 실제 시작 시점을 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 번의 관찰이 모든 사람에게 같은 숫자로 나타난다고 하지 않는다. 자료 문제의 모형 값을 건강의 정상/이상 기준으로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "질병과 예방 조사",
   "title": "관련 기관·행동·까닭을 확인해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "조사 질문",
      "확인할 내용"
     ],
     "rows": [
      [
       "어느 기관과 관련되나요?",
       "소화·호흡·순환·배설 중 관련과 범위"
      ],
      [
       "어떤 행동이 도움이 되나요?",
       "예방 행동·과학적 까닭·대상"
      ],
      [
       "다시 찾아볼 수 있나요?",
       "자료 제목·기관·쪽/주소·확인 날짜"
      ]
     ]
    },
    {
     "type": "text",
     "text": "예를 들어 노로바이러스 장염과 소화기관, 인플루엔자와 호흡기관의 관련을 교사 확인 자료에서 살펴요. 여러 모둠의 사례를 모아 네 기관계의 질문을 비교할 수 있어요."
    },
    {
     "type": "field",
     "title": "내가 조사한 근거",
     "hint": "관련 기관·질병과 실제 읽은 자료의 예방 행동·까닭을 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처 없는 광고·댓글을 효능의 근거로 쓰지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "개인 병력·약 복용 정보를 모으거나 치료법을 시험하지 않아요. 자료의 대상과 확인한 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "여러 날 실제 실천",
   "title": "기회·실제 행동·보완을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "health",
     "caption": "한 순간의 설명 장면이에요. 사진 한 장이 전체 과정·시간·실제 생활 실천을 증명하지는 않아요."
    },
    {
     "type": "text",
     "text": "질병관리청은 물과 비누로30초 이상 꼼꼼하게 손씻기를 안내해요. 감염 전파 위험을 줄이는 데 도움을 줄 수 있지만 모든 질병의 완전 예방을 보장하는 것은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "날짜·실제 기회",
      "한 행동/못한 행동·까닭",
      "다음에 보완할 점"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ],
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "계속할 행동",
     "hint": "교사와 읽은 근거에서 내가 실제로 할 행동 하나를 정하고 다음 날에도 돌아보아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획만 세운 날과 실제로 한 날, 기회가 없었던 날을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "못한 날을 지우거나 미래 결과를 미리 채우지 않아요. 실천 횟수로 모든 질병 예방을 증명하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "자료 제작과 나누기",
   "title": "기관과 예방 행동이 연결되게 만들어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "자료에 넣을 것",
      "설명"
     ],
     "rows": [
      [
       "기관·질병",
       "교사 자료에서 확인한 관련"
      ],
      [
       "행동·까닭",
       "언제·어떻게·왜 도움이 되는가"
      ],
      [
       "그림·이름표·출처",
       "대상이 이해할 관련 부분과 다시 볼 자료"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "종이나 디지털 도구로 카드/포스터를 실제로 만들어요.",
      "짝이나 정한 대상에게 실제로 보여 주고 질문을 들어요.",
      "이름표·까닭 설명을 보완하고 아직 안 나눈 것은 다음 계획으로 남겨요."
     ]
    },
    {
     "type": "field",
     "title": "받은 질문과 고칠 근거",
     "hint": "실제 의견과 내가 예상한 질문을 나누어 짧게 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료 저장과 실제 전달은 다른 행동이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "긴 보고서를 채우지 않아도 관련 기관·행동·까닭과 고친 근거를 짧게 남길 수 있어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 41~42",
   "title": "조사 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-41",
      "body-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "출처 이름만 적고 내용을 확인했다고 주장하지 않는다. 증상 한 가지를 보고 친구의 병명을 정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 43~44",
   "title": "생활 실천과 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-43",
      "body-book-44"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 번 실천하면 모든 질병을 막는다고 보장하지 않는다. 체크 표시만 채운 것을 실제 실천의 증거로 간주하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 45",
   "title": "소개 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-45"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림이나 계획을 실제 제작·공유로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "생활 실천과 자료 46",
   "title": "실천과 되돌아보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-46"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 근거와 실제 생활 행동·기회·보완을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실천하지 못한 날을 삭제하거나 미래 계획을 과거 실천으로 적지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 47~48",
   "title": "모형 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-47",
      "body-book-48"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형 실패를 곧바로 실제 기관의 실패로 일반화하지 않는다. 빠르게 누르면 반드시 한 번 양도 늘어난다고 말하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 49",
   "title": "단위 맞추기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-49"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이 문항은 건강 비교나 정상 수치 판정 문제가 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 50",
   "title": "모형 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-50"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관절을 움직였다는 것만으로 근육의 작용을 완전히 재현했다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 51~52",
   "title": "표의 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-51",
      "body-book-52"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰한 횟수와 보이지 않은 물질량을 혼동하지 않는다. 광고 문구나 경험 한 번을 치료 효과의 증거로 보지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 53~54",
   "title": "물질 이동 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-53",
      "body-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "음식물이 직접 이 길로 이동한다고 하지 않는다. 한 기관이 중요하다는 말이 다른 기관이 필요 없다는 뜻은 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 55~56",
   "title": "조사 대상과 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-55",
      "body-book-56"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공공기관 이름만 있다고 실제 내용을 읽지 않아도 되는 것은 아니다. 예정일을 실제 전달일로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 57",
   "title": "근거의 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-57"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "올바른 실천도 결과를100% 보장하는 치료로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·그림으로 깊이 풀기 58",
   "title": "실제 기록 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-58"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형·자료·관찰의 범위에서만 판단해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "연습 표의 값을 내 실제 기록으로 복사하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "한눈에 정리",
   "title": "구조 → 기능 → 물질의 길 → 협력",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배운 내용",
      "연결할 근거"
     ],
     "rows": [
      [
       "뼈·관절·근육",
       "당김·실제 모형 제작·원인과 결과"
      ],
      [
       "소화·호흡·순환·배설",
       "음식물·흡수한 영양소·기체·혈액·오줌"
      ],
      [
       "몸 변화",
       "같은 사람·방법·관찰 구간·시점"
      ],
      [
       "건강 생활",
       "질병/예방 근거·여러 날 실제 행동·보완"
      ]
     ]
    },
    {
     "type": "field",
     "title": "핵심 설명 한 문장",
     "hint": "한 기관의 기능을 다른 기관과 연결해 설명해요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름을 외우는 데서 끝내지 않고 연결을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형·제공 자료·직접 관찰·생활 행동의 근거는 서로 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "빈칸 핵심 정리 59~60",
   "title": "움직임 정리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-59",
      "body-book-60"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름·기능·길과 계획/실제의 뜻을 문맥에 맞게 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "뼈만 스스로 움직인다고 하지 않는다. 흡수 뒤 영양소가 통째 음식물로 돌아간다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빈칸 핵심 정리 61~62",
   "title": "호흡과 순환",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-61",
      "body-book-62"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름·기능·길과 계획/실제의 뜻을 문맥에 맞게 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "들이쉬는 모든 공기를 산소라고 부르지 않는다. 두 관 이름을 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빈칸 핵심 정리 63~64",
   "title": "공정한 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-63",
      "body-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 이름·기능·길과 계획/실제의 뜻을 문맥에 맞게 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰 시간을 빼고 횟수만 비교하지 않는다. 계획만 세워 실천 완료라고 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 65~66",
   "title": "뼈와 근육",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-65",
      "body-book-66"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관절과 근육의 역할을 같게 합치지 않는다. 뼈 길이가 줄어서 굽는다고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 67~68",
   "title": "모형과 몸",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-67",
      "body-book-68"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실은 실제 근육의 모든 성질을 가지지 않는다. 늘어나는 근육이 뼈를 밀어낸다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 69~70",
   "title": "흡수 기관",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-69",
      "body-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이름의 작다/크다만으로 기능을 추측하지 않는다. 위 앞에 작은창자나 큰창자를 놓지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 71~72",
   "title": "소화와 순환 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-71",
      "body-book-72"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "직접 지나는 기관과 돕는 기관을 구별한다. 직접 연결된 하나의 관처럼 그리지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 73~74",
   "title": "심장의 작용",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-73",
      "body-book-74"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "심장이 산소를 직접 만들어 낸다고 하지 않는다. 혈관을 빈 공기 관이라고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 75~76",
   "title": "혈액의 운반",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-75",
      "body-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "밥알이나 들숨 공기 덩어리 자체라고 쓰지 않는다. 차이를 건강 점수로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 77~78",
   "title": "호흡의 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-77",
      "body-book-78"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "기관과 식도의 이름을 바꾸지 않는다. 고무막 자체가 공기를 만들어 낸다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 79~80",
   "title": "모형이 보여 주는 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-79",
      "body-book-80"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모형이 닮았다는 이유로 모든 기능을 실측했다고 하지 않는다. 혈액 전체가 오줌이 되어 사라진다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 81~82",
   "title": "배설 기능",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-81",
      "body-book-82"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "오줌관과 요도를 혼동하지 않는다. 오줌이 항문을 통해 나간다고 하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 83",
   "title": "기관 연결 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-83"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "정밀한 해부 그림이나 혈관 이름 암기는 요구하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 84~85",
   "title": "질병과 생활",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-84",
      "body-book-85"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "예방 행동을 치료나100% 예방 보장으로 바꾸지 않는다. 예방 행동 한 가지를 모든 질병을 막는 방법으로 보장하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 86~87",
   "title": "실제 실천 일수",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-86",
      "body-book-87"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "계획한 날을 실천한 날에 더하지 않는다. 실제로 받지 않은 의견이나 하지 않은 재전달을 채워 넣지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 88",
   "title": "실천과 효과 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-88"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "생활 실천 기록을 예방 효과의 임상 시험 결과로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 89~90",
   "title": "움직임 바로잡기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-89",
      "body-book-90"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "근육과 관절의 도움을 함께 설명한다. 배설과 소화 찌꺼기 배출을 구별한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 91~92",
   "title": "시간 다시 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-91",
      "body-book-92"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "시간을 확인하지 않은 채40회 쪽이 더 빠르다고 단정하지 않는다. AI 이미지의 모형 상태를 내 실측값으로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 93~94",
   "title": "기능 다시 묶기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-93",
      "body-book-94"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모든 기관의 역할을 하나의 “좋게 한다”로 쓰지 않는다. 빈칸을 줄이려고 미실천을 숨기지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 95~96",
   "title": "자료 보완",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "body-book-95",
      "body-book-96"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관의 구조·기능·협력과 실제 근거를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "받지 않은 의견이나 하지 않은 재설명을 꾸미지 않는다. 맞은 개수만 적고 설명의 근거를 생략하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명을 근거와 함께 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "설명 보완",
   "title": "처음 생각과 지금의 근거를 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "처음 생각",
      "확인한 근거",
      "고친 설명"
     ],
     "rows": [
      [
       "",
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "기관의 협력으로 설명하기",
     "hint": "기관 기능·물질 이동·모형/관찰의 한계 중 필요한 것을 넣어요.",
     "lines": 9,
     "draw": false
    },
    {
     "type": "field",
     "title": "다음 실제 활동",
     "hint": "더 확인할 조건이나 계속할 생활 행동과 방법을 정해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 생각이 그대로여도 근거를 밝히면 의미 있는 설명이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "문제의 답과 실제 수행은 따로 확인해요. 하지 못한 일은 다음 계획으로 남겨요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "자료와 찾아보기",
   "title": "필요한 근거로 돌아가요",
   "blocks": [
    {
     "type": "heading",
     "text": "현행 범위와 원교재"
    },
    {
     "type": "text",
     "text": "교육부 2022 개정 과학과 교육과정 [6과04-01~03]의 뼈·근육 모형, 네 기관계의 기능/관계, 몸 변화 관찰, 관련 질병/예방 조사와 실제 건강 생활을 연결했어요. 지필드 이론5-2-1 21~25쪽과 실험5-C 18~21/24~25쪽의 본문을 대조했어요."
    },
    {
     "type": "heading",
     "text": "건강·기관의 1차자료"
    },
    {
     "type": "text",
     "text": "질병관리청 국가건강정보포털 「손씻기」와 「2월에 주의해야 할 바이러스, 이렇게 예방하세요!」(2026-01), NIDDK의 소화·콩팥, NHLBI의 호흡, MedlinePlus의 손목 맥박 안내에서 관련 본문을 확인했어요. 성인 정상 수치·치료/약물·소독 약품 절차는 학생 실천으로 옮기지 않았어요."
    },
    {
     "type": "heading",
     "text": "사진·그림·문항"
    },
    {
     "type": "text",
     "text": "기존 교육 모형/설명 사진과 실험5-C 19쪽 원사진2장을 사용했어요. 원촬영 조건은 미확인이며 모형과 연습 값을 실제 학생 수행으로 바꾸지 않아요. 96문항은 기존 발문·자료·답·풀이·오개념을 모두 보존했어요."
    },
    {
     "type": "field",
     "title": "다시 볼 자료와 질문",
     "hint": "문항 번호와 필요한 개념·다음 관찰/실천 계획을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관·예방 출처의 제목·제공처·대상·확인 날짜를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옛6-2 관련 원문 발췌58·짝58·창작96의 은행212문항은 별도예요. 현행 전체 시험지 확보와 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 사용한 근거와 설명을 연결하고 더 확인할 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-01",
      "body-book-02",
      "body-book-03"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 4~6",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-04",
      "body-book-05",
      "body-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 7~9",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-07",
      "body-book-08",
      "body-book-09"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 10~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-10",
      "body-book-11",
      "body-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 13~15",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-13",
      "body-book-14",
      "body-book-15"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 16~18",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-16",
      "body-book-17",
      "body-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 19~21",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-19",
      "body-book-20",
      "body-book-21"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 22~24",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-22",
      "body-book-23",
      "body-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 25~27",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-25",
      "body-book-26",
      "body-book-27"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 28~30",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-28",
      "body-book-29",
      "body-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 31~33",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-31",
      "body-book-32",
      "body-book-33"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 34~36",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-34",
      "body-book-35",
      "body-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 37~39",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-37",
      "body-book-38",
      "body-book-39"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 40~42",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-40",
      "body-book-41",
      "body-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 43~45",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-43",
      "body-book-44",
      "body-book-45"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 46~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-46",
      "body-book-47",
      "body-book-48"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 49~51",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-49",
      "body-book-50",
      "body-book-51"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 52~54",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-52",
      "body-book-53",
      "body-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 55~57",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-55",
      "body-book-56",
      "body-book-57"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 58~60",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-58",
      "body-book-59",
      "body-book-60"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 61~64",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-61",
      "body-book-62",
      "body-book-63",
      "body-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 65~67",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-65",
      "body-book-66",
      "body-book-67"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 68~70",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-68",
      "body-book-69",
      "body-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 71~73",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-71",
      "body-book-72",
      "body-book-73"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 74~76",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-74",
      "body-book-75",
      "body-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 77~79",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-77",
      "body-book-78",
      "body-book-79"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 80~82",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-80",
      "body-book-81",
      "body-book-82"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 83~85",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-83",
      "body-book-84",
      "body-book-85"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 86~88",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-86",
      "body-book-87",
      "body-book-88"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 89~91",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-89",
      "body-book-90",
      "body-book-91"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 92~94",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-92",
      "body-book-93",
      "body-book-94"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 95~96",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "body-book-95",
      "body-book-96"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 기관·조건·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 경로·조건을 찾아 설명해요.",
     "write": 0
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~24번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "body-quick-0",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·기관 연결·근거와 인정 기준을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "다시 볼 근거",
     "text": "틀린 번호와 헷갈린 개념을 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "25~48번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "body-quick-24",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·기관 연결·근거와 인정 기준을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "다시 볼 근거",
     "text": "틀린 번호와 헷갈린 개념을 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "49~72번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "body-quick-48",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·기관 연결·근거와 인정 기준을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "다시 볼 근거",
     "text": "틀린 번호와 헷갈린 개념을 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "73~96번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "body-quick-72",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·기관 연결·근거와 인정 기준을 함께 확인해요.",
     "write": 0
    },
    {
     "title": "다시 볼 근거",
     "text": "틀린 번호와 헷갈린 개념을 적어요.",
     "write": 5
    }
   ]
  }
 ],
 "figures": {
  "torso": "<div class=\"ed-photo ed-body-photo\"><img src=\"../assets/activities/c22-s51-u04/torso-model-photo-v1.webp\" width=\"1536\" height=\"1024\" alt=\"두 폐 사이의 심장, 그 아래 간과 위, 아래쪽 창자들을 보여 주는 플라스틱 인체 교육 모형\" decoding=\"async\"><p class=\"ed-photo-note\">앞에서 본 교육 모형이에요. 실제 몸에서의 기관 색·크기·거리와 같지 않으며, 사진 밖 설명과 함께 읽어요.</p><small class=\"ed-photo-credit\">실제 기관/측정 사진 아님</small></div>",
  "arm": "<div class=\"ed-photo ed-body-photo\"><img src=\"../assets/activities/c22-s51-u04/arm-model-photo-v1.webp\" width=\"1536\" height=\"1024\" alt=\"같은 종류의 팔 교육 모형 두 자세. 왼쪽은 펼친 팔, 오른쪽은 팔꿈치를 굽힌 팔\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:2;grid-template-columns:2fr 1fr\"><div><b>팔을 폈을 때</b><br>안쪽 근육이 더 길게 나타남</div><div><b>팔을 굽혔을 때</b><br>안쪽 근육이 짧고 두껍게 나타남</div></div><p class=\"ed-photo-note\">대표적인 팔 근육의 작용을 표현한 모형이에요. 사진에서 길이·힘의 정확한 값을 재지 않아요.</p><small class=\"ed-photo-credit\">실제 기관/측정 사진 아님</small></div>",
  "heart": "<div class=\"ed-photo ed-body-photo\"><img src=\"../assets/activities/c22-s51-u04/heart-model-photo-v1.webp\" width=\"1536\" height=\"1024\" alt=\"받침 위에 놓인 심장 겉모양 교육 모형. 위쪽에 혈관 연결 부분과 아래로 향한 끝이 보임\" decoding=\"async\"><p class=\"ed-photo-note\">심장 겉모양을 읽는 모형이에요. 혈관의 빨강·파랑은 구분 표시이며 실제 혈액이 파란색이라는 뜻이 아니에요.</p><small class=\"ed-photo-credit\">실제 기관/측정 사진 아님</small></div>",
  "breathing": "<div class=\"ed-photo ed-body-photo\"><img src=\"../assets/activities/c22-s51-u04/breathing-model-photo-v1.webp\" width=\"1536\" height=\"1024\" alt=\"밀폐된 병 속 두 풍선과 아래 고무막. 왼쪽은 작은 풍선, 오른쪽은 고무막이 내려가고 커진 풍선\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:2\"><div><b>막을 놓은 쪽</b><br>풍선이 작게 나타남</div><div><b>막을 아래로 당긴 쪽</b><br>안 공간이 커지고 풍선이 커짐</div></div><p class=\"ed-photo-note\">병·관·풍선의 연결과 아래 막을 비교해요. 위쪽 관은 공기와 통하는 구조를 전제로 한 설명이며 기체 교환을 측정한 사진은 아니에요.</p><small class=\"ed-photo-credit\">실제 기관/측정 사진 아님</small></div>",
  "urinary": "<div class=\"ed-photo ed-body-photo\"><img src=\"../assets/activities/c22-s51-u04/urinary-model-photo-v1.webp\" width=\"1536\" height=\"1024\" alt=\"콩팥 두 개에서 각각 오줌관이 내려와 하나의 방광에 이어지고 방광 아래로 요도가 나오는 교육 모형\" decoding=\"async\"><p class=\"ed-photo-note\">위쪽 두 기관은 콩팥, 내려오는 두 가는 길은 오줌관, 아래 주머니는 방광, 그 아래 짧은 길은 요도예요. 연결을 간단히 표현해 실제 크기·거리와 다르게 배치했어요.</p><small class=\"ed-photo-credit\">실제 기관/측정 사진 아님</small></div>",
  "pulse": "<div class=\"ed-photo ed-body-photo\"><img src=\"../assets/activities/c22-s51-u04/pulse-model-photo-v1.webp\" width=\"1536\" height=\"1024\" alt=\"손바닥을 위로 놓은 반대쪽 손목의 엄지손가락 아래쪽에 검지와 중지 끝을 가볍게 댄 자세와 숫자가 없는 초시계\" decoding=\"async\"><p class=\"ed-photo-note\">맥박을 살피는 자세의 설명이에요. 표시된 관찰값은 없으며 실제 수치는 교사가 정한 방법으로 관찰한 뒤 적어요.</p><small class=\"ed-photo-credit\">실제 기관/측정 사진 아님</small></div>",
  "health": "<div class=\"ed-photo ed-body-photo\"><img src=\"../assets/activities/c22-s51-u04/health-model-photo-v1.webp\" width=\"1536\" height=\"1024\" alt=\"흐르는 물과 비누 거품으로 두 손을 문지르는 손씻기 장면\" decoding=\"async\"><p class=\"ed-photo-note\">한 순간의 자세 예시예요. 사진 한 장으로 손씻기 전체 과정이나 소요 시간·실제 실천 여부를 확인할 수는 없어요.</p><small class=\"ed-photo-credit\">실제 기관/측정 사진 아님</small></div>",
  "exercise": "<div class=\"ed-photo-data\"><p><b>연습 자료</b> · 실제 학생의 건강 기록 아님</p><table class=\"ed-table\"><thead><tr><th>시점</th><th>맥박 · 1분 횟수</th><th>호흡 · 1분 횟수</th></tr></thead><tbody><tr><td>쉬고 난 뒤</td><td>72</td><td>18</td></tr><tr><td>가벼운 걷기 직후</td><td>98</td><td>27</td></tr><tr><td>잠시 쉰 뒤</td><td>78</td><td>20</td></tr></tbody></table><p>같은 사람·같은 방법·각각1분인 모형 자료예요. 건강의 정상/이상 기준이나 친구 간 순위로 사용하지 않아요.</p></div>",
  "sourceArmPair": "<div style=\"display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4mm\"><figure class=\"ed-photo\" style=\"margin:0\"><img style=\"width:100%;max-height:55mm;object-fit:contain\" src=\"../assets/book/c22-s51-u04-source-arm-straight.png\" alt=\"모형을 폈을 때의 나무 막대·연결·용수철\"><figcaption>모형을 폈을 때</figcaption></figure><figure class=\"ed-photo\" style=\"margin:0\"><img style=\"width:100%;max-height:55mm;object-fit:contain\" src=\"../assets/book/c22-s51-u04-source-arm-bent.png\" alt=\"모형을 굽혔을 때의 나무 막대·연결·용수철\"><figcaption>모형을 굽혔을 때</figcaption></figure></div><p>지필드 실험5-C 19쪽의 원사진이에요. 막대 자세와 용수철 길이의 관계를 살펴요.</p>",
  "body-quick-0": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">2</th><td>빈칸</td><td>심장, 콩팥</td></tr><tr><th scope=\"row\">3</th><td>연결</td><td>(1) ㄱ (2) ㄴ</td></tr><tr><th scope=\"row\">4</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">5</th><td>빈칸</td><td>관절</td></tr><tr><th scope=\"row\">6</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">7</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">8</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">9</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">10</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">11</th><td>빈칸</td><td>소화</td></tr><tr><th scope=\"row\">12</th><td>객관식</td><td>④</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">13</th><td>순서</td><td>ㄴ → ㄹ → ㄱ → ㅁ → ㄷ → ㅂ</td></tr><tr><th scope=\"row\">14</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">15</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">16</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>빈칸</td><td>펌프, 길</td></tr><tr><th scope=\"row\">18</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">19</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">20</th><td>순서</td><td>ㄴ → ㄹ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">21</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">22</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">23</th><td>빈칸</td><td>기관지</td></tr><tr><th scope=\"row\">24</th><td>객관식</td><td>④</td></tr></tbody></table></div>",
  "body-quick-24": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">25</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">26</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">27</th><td>순서</td><td>ㄷ → ㄹ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">28</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">29</th><td>빈칸</td><td>콩팥, 방광</td></tr><tr><th scope=\"row\">30</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">31</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">32</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">33</th><td>복수</td><td>①, ②, ③</td></tr><tr><th scope=\"row\">34</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">35</th><td>빈칸</td><td>혈액</td></tr><tr><th scope=\"row\">36</th><td>객관식</td><td>③</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">37</th><td>단답</td><td>같은30초에서11회 증가</td></tr><tr><th scope=\"row\">38</th><td>순서</td><td>ㄴ → ㄱ → ㄷ → ㄹ</td></tr><tr><th scope=\"row\">39</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">40</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">41</th><td>빈칸</td><td>확인한</td></tr><tr><th scope=\"row\">42</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">43</th><td>연결</td><td>(1) ㄱ (2) ㄴ</td></tr><tr><th scope=\"row\">44</th><td>복수</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">45</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">46</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">47</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">48</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>",
  "body-quick-48": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">49</th><td>단답</td><td>아니다:20초/30초</td></tr><tr><th scope=\"row\">50</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">51</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">52</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">53</th><td>순서</td><td>ㄷ → ㄹ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">54</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">55</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">56</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">57</th><td>복수</td><td>②, ③</td></tr><tr><th scope=\"row\">58</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">59</th><td>빈칸</td><td>관절, 근육</td></tr><tr><th scope=\"row\">60</th><td>빈칸</td><td>작은창자, 혈액</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">61</th><td>빈칸</td><td>산소, 이산화탄소</td></tr><tr><th scope=\"row\">62</th><td>빈칸</td><td>오줌관, 요도</td></tr><tr><th scope=\"row\">63</th><td>빈칸</td><td>시간</td></tr><tr><th scope=\"row\">64</th><td>빈칸</td><td>행동/실천, 계획</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">66</th><td>빈칸</td><td>짧아</td></tr><tr><th scope=\"row\">67</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">68</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">69</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">70</th><td>순서</td><td>ㄷ → ㄱ → ㄹ → ㅂ → ㅁ → ㄴ</td></tr><tr><th scope=\"row\">71</th><td>복수</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">72</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>",
  "body-quick-72": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">73</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">74</th><td>빈칸</td><td>혈관, 심장</td></tr><tr><th scope=\"row\">75</th><td>단답</td><td>산소·흡수된 영양소</td></tr><tr><th scope=\"row\">76</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">78</th><td>연결</td><td>(1) ㄱ (2) ㄴ</td></tr><tr><th scope=\"row\">79</th><td>복수</td><td>①, ②</td></tr><tr><th scope=\"row\">80</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">82</th><td>빈칸</td><td>항문</td></tr><tr><th scope=\"row\">83</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">84</th><td>서술</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">86</th><td>단답</td><td>2일</td></tr><tr><th scope=\"row\">87</th><td>순서</td><td>ㄷ → ㄱ → ㄴ → ㄹ</td></tr><tr><th scope=\"row\">88</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">89</th><td>빈칸</td><td>근육</td></tr><tr><th scope=\"row\">90</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">91</th><td>단답</td><td>관찰 구간 길이 등 확인</td></tr><tr><th scope=\"row\">92</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">93</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">94</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">95</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>"
 }
};

export const observationPriorWorkbook=withBodyEditorial(baseWorkbook);
export const learnerPriorWorkbook=withObservationLanguage(observationPriorWorkbook);
export const bodyUpperPriorWorkbook=withLearnerExplanations(learnerPriorWorkbook);
export const bodyReadablePriorWorkbook=withBodyUpperProgression(bodyUpperPriorWorkbook);
export const workbook=withBodyReadableWorkbook(bodyReadablePriorWorkbook);
