import{withMixtureReadableWorkbook}from'./c22-s52-u01.editorial.js?v=20261106-mixture-readable-workbook';
import{withObservationLanguage}from'./observation-language.js';
import{withMixtureEditorial}from'./c22-s52-u01.editorial.js?v=20261104-mixture-book';
// 혼합물96문항. scripts/gen-science-workbook-c22s52u01.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s52-u01",
 "title": "혼합물의 분리",
 "semester": "5-2",
 "no": 1,
 "theme": "#2456c4",
 "book": "지필드 실험 과학",
 "richText": true,
 "questions": [
  {
   "id": "mixture-book-01",
   "no": 1,
   "status": "authored",
   "form": "choice",
   "topic": "혼합물",
   "prompt": "모래와 자갈을 섞은 뒤 손으로 자갈을 골랐습니다. 바른 설명은?",
   "answer": "①",
   "explanation": "혼합물은 구성 물질의 성질을 이용해 필요한 물질로 분리할 수 있다.",
   "misconception": "혼합과 새 물질 생성의 뜻을 같게 보지 않는다.",
   "criteria": "섞인 뒤에도 모래·자갈의 성질을 이용해 나눌 수 있다는 보기를 고른다.",
   "choices": [
    "섞였어도 모래와 자갈의 성질을 이용해 나눌 수 있다.",
    "섞는 순간 모래와 자갈이 모두 새 물질로 바뀐다.",
    "섞은 뒤에는 두 물질의 성질이 모두 바뀌어 다시 나눌 수 없다.",
    "두 물질은 섞이는 순간 모두 물에 녹아 사라진다.",
    "손으로 고르면 자갈이 모래로 변해 아래에 모인다."
   ],
   "key": 0,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-02",
   "no": 2,
   "status": "authored",
   "form": "blank",
   "topic": "분리의 성질",
   "prompt": "모래와 자갈을 체로 나눌 때 주로 이용하는 것은 알갱이의 [ ] 차이이다.",
   "answer": "크기",
   "explanation": "체 구멍보다 작은 것은 통과하고 큰 것은 남는 조건을 이용한다.",
   "misconception": "색이나 이름이 체 통과 여부를 정하지 않는다.",
   "criteria": "체의 통과·남음을 정하는 알갱이 크기를 넣는다. 색·이름과 구별한다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-03",
   "no": 3,
   "status": "authored",
   "form": "match",
   "topic": "방법 고르기",
   "prompt": "혼합물과 알맞은 방법을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "서로 다른 성질을 확인하고 그 성질에 맞는 방법을 선택한다.",
   "misconception": "체 한 가지로 모든 혼합물을 분리하지 않는다.",
   "criteria": "물/기름=층과 스포이트, 소금물=증발, 모래/자갈=체를 각 기호에 연결한다.",
   "given": [
    "ㄱ 체 사용  ㄴ 층을 살펴 스포이트 사용  ㄷ 물을 증발시킴"
   ],
   "parts": [
    "(1) 물과 기름 [ ]",
    "(2) 소금물에서 소금 얻기 [ ]",
    "(3) 마른 모래와 자갈 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-04",
   "no": 4,
   "status": "authored",
   "form": "written",
   "topic": "근거 구별",
   "prompt": "사진처럼 맑아진 물을 보고 “마셔도 안전하다.”고 했습니다. 이 말에 필요한 근거가 충분한가요?",
   "answer": "충분하지 않다. 맑아 보여도 녹은 물질이나 눈에 보이지 않는 성분이 있을 수 있어 적절한 처리와 수질 확인이 필요하다.",
   "explanation": "겉모습 관찰과 음용 안전 확인은 다르다. 교실 실험물은 마시지 않는다.",
   "misconception": "맑음과 순수함·음용 안전을 같게 보지 않는다.",
   "criteria": "맑음만으로 안전을 판단할 근거가 부족함과 녹은/보이지 않는 성분 또는 처리·수질 확인을 함께 설명한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-05",
   "no": 5,
   "status": "authored",
   "form": "blank",
   "topic": "혼합물",
   "prompt": "두 가지 이상의 물질이 각각의 성질을 유지하며 섞인 것을 [ ]이라고 한다.",
   "answer": "혼합물",
   "explanation": "구성 물질의 성질이 분리 방법을 정하는 단서다.",
   "misconception": "섞인 것은 모두 새 물질이라고 하지 않는다.",
   "criteria": "각 성질을 유지하며 두 가지 이상이 섞인 혼합물을 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-06",
   "no": 6,
   "status": "authored",
   "form": "choice",
   "topic": "혼합의 관찰",
   "prompt": "마른 쌀과 콩을 섞었습니다. 관찰로 확인할 수 있는 것은?",
   "answer": "②",
   "explanation": "섞기 전후에도 각 재료의 모양 같은 특징을 살필 수 있다.",
   "misconception": "관찰하지 않은 성질 변화를 만들어 말하지 않는다.",
   "criteria": "섞여 있어도 쌀과 콩의 모양을 각각 관찰할 수 있다는 보기를 고른다.",
   "choices": [
    "콩은 섞인 뒤에 반드시 물에 녹는다.",
    "쌀과 콩의 모양을 각각 구별할 수 있다.",
    "쌀과 콩은 섞인 뒤 모두 같은 크기가 된다.",
    "콩은 새 물질로 변해 자석에 붙게 된다.",
    "쌀은 섞인 뒤 물질이 아닌 빈 공간이 된다."
   ],
   "key": 1,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-07",
   "no": 7,
   "status": "authored",
   "form": "match",
   "topic": "분리의 목적",
   "prompt": "상황과 얻으려는 것을 연결하세요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "분리는 필요한 물질을 얻거나 원치 않는 물질을 제거하는 데 쓰인다.",
   "misconception": "분리 뒤 어느 쪽을 쓰는지 목적을 확인한다.",
   "criteria": "소금물 증발=소금, 모래/자갈 체질=굵은 자갈, 국 거름=건더기를 뺀 국물을 연결한다.",
   "given": [
    "ㄱ 굵은 자갈  ㄴ 건더기를 뺀 국물  ㄷ 소금"
   ],
   "parts": [
    "(1) 소금물의 물을 증발시킴 [ ]",
    "(2) 모래·자갈을 체질함 [ ]",
    "(3) 국을 고운 망에 거름 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-08",
   "no": 8,
   "status": "authored",
   "form": "multi",
   "topic": "분리 계획",
   "prompt": "분리 방법을 정하기 전에 살필 것을 모두 고르세요.",
   "answer": "①, ②, ③, ⑤",
   "explanation": "목적·성질·도구·안전과 남은 물질 처리를 함께 정한다.",
   "misconception": "기록 지우기는 좋은 실험 계획이 아니다.",
   "criteria": "구성 물질·얻을 물질·성질·도구/처리를 모두 고르고 나쁜 기록 지우기는 제외한다.",
   "choices": [
    "어떤 물질이 섞였는지",
    "얻으려는 물질이 무엇인지",
    "재료마다 어떤 성질이 있는지",
    "결과가 나쁜 기록을 지울지",
    "사용할 도구와 처리 방법"
   ],
   "key": [
    0,
    1,
    2,
    4
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-09",
   "no": 9,
   "status": "authored",
   "form": "short",
   "topic": "생활 사례",
   "prompt": "건더기는 남기고 국물만 받고 싶습니다. 망의 위와 아래 중 어느 쪽의 물질이 필요한가요?",
   "answer": "아래",
   "explanation": "국물은 망을 지나 아래 용기에 모이며 건더기는 망 위에 남는다.",
   "misconception": "분리한 양쪽 중 목적에 맞는 쪽을 고른다.",
   "criteria": "국물이 망을 통과해 모이는 아래쪽 또는 같은 뜻을 쓴다.",
   "accepted": [
    "망 아래",
    "아래쪽",
    "통과한 쪽"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-10",
   "no": 10,
   "status": "authored",
   "form": "written",
   "topic": "목적과 방법",
   "prompt": "모래 속 자갈을 얻으려는 사람과 소금물 속 소금을 얻으려는 사람이 같은 도구만 써도 될까요? 성질을 넣어 설명하세요.",
   "answer": "그렇지 않다. 모래·자갈은 크기 차이로 체를 쓰고 소금물은 물을 증발시켜 소금을 얻는다.",
   "explanation": "목적뿐 아니라 크기·용해 등 구성 물질의 성질에 맞춰 방법을 달리한다.",
   "misconception": "그냥 손으로 전부 고르면 된다고 일반화하지 않는다.",
   "criteria": "동일한 도구만으로는 안 됨과 모래/자갈의 크기·체, 소금물의 물 증발을 각각 연결한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-11",
   "no": 11,
   "status": "authored",
   "form": "blank",
   "topic": "체의 조건",
   "prompt": "체 구멍은 통과시킬 알갱이보다 [ ], 남길 알갱이보다 [ ]야 한다.",
   "answer": "커야, 작아",
   "explanation": "두 종류의 크기 사이에 해당하는 구멍이 필요하다.",
   "misconception": "구멍이 무조건 작을수록 좋은 것은 아니다.",
   "criteria": "통과시킬 알갱이보다 커야, 남길 알갱이보다 작아를 제시 순서로 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-12",
   "no": 12,
   "status": "authored",
   "form": "choice",
   "topic": "구멍 크기",
   "prompt": "가상 모형: 둥근 알갱이 A는 지름2mm, B는8mm입니다. 모양이 변하지 않을 때 A만 통과시킬 둥근 구멍은?",
   "answer": "③",
   "explanation": "2mm보다 크고8mm보다 작은4mm가 두 크기를 나누는 조건이다.",
   "misconception": "정확히 같은 크기의 구멍을 통과한다고 단정하는 경계 조건을 피한다.",
   "criteria": "모양이 변하지 않는 둥근 모형의 2mm<4mm<8mm 조건으로 지름4mm를 고른다.",
   "choices": [
    "지름1mm",
    "지름9mm",
    "지름4mm",
    "지름10mm",
    "지름12mm"
   ],
   "key": 2,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-13",
   "no": 13,
   "status": "authored",
   "form": "match",
   "topic": "체질 결과",
   "prompt": "마른 모래는 체를 통과하고 큰 자갈은 남았습니다. 위치와 물질을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ",
   "explanation": "통과/남음은 체 구멍과 알갱이 크기의 관계로 읽는다.",
   "misconception": "체 아래를 무조건 버리는 곳으로 보지 않는다.",
   "criteria": "체 위 큰 자갈·체 아래 마른 모래를 각각 연결한다.",
   "given": [
    "ㄱ 큰 자갈  ㄴ 마른 모래"
   ],
   "parts": [
    "(1) 체 위 [ ]",
    "(2) 체 아래 받침 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-14",
   "no": 14,
   "status": "authored",
   "form": "order",
   "topic": "체질 절차",
   "prompt": "순서대로 기호를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ → ㄹ",
   "explanation": "재료를 살핀 뒤 도구를 정하고 분리 후 양쪽을 확인한다.",
   "misconception": "받침 없이 흔들어 재료를 흘리지 않는다.",
   "criteria": "재료 확인→도구 준비→조금씩 체질→양쪽 관찰의 기호 순서를 확인한다.",
   "given": [
    "ㄱ 알맞은 체와 받침 준비  ㄴ 크기와 섞인 재료 확인  ㄷ 조금씩 넣고 체질  ㄹ 양쪽 재료 관찰·기록"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-15",
   "no": 15,
   "status": "authored",
   "form": "multi",
   "topic": "체질의 조건",
   "prompt": "크기가 뚜렷이 다른 마른 모래·자갈을 나눌 때 알맞은 방법을 모두 고르세요.",
   "answer": "①, ②, ③, ⑤",
   "explanation": "적당량과 받침은 흘림·막힘·날림을 줄인다.",
   "misconception": "빠르게 흔드는 것만을 좋은 방법의 기준으로 삼지 않는다.",
   "criteria": "알맞은 구멍·받침/소량·위와 아래 확인·모래 날림 방지를 모두 고른다.",
   "choices": [
    "알맞은 구멍의 체를 고른다.",
    "받침 위에서 조금씩 체질한다.",
    "체 위와 아래에 무엇이 있는지 확인한다.",
    "한 번에 가득 눌러 담아 무조건 세게 흔든다.",
    "모래를 날리지 않게 조심한다."
   ],
   "key": [
    0,
    1,
    2,
    4
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-16",
   "no": 16,
   "status": "authored",
   "form": "written",
   "topic": "실패 고치기",
   "prompt": "작은 모래도 큰 자갈도 모두 체 위에 남았습니다. 체 구멍이 너무 작다는 가설을 어떻게 확인할까요?",
   "answer": "같은 마른 재료와 비슷한 양을 쓰되 구멍이 더 큰 체로 바꾸고 위·아래에 모이는 재료를 비교한다.",
   "explanation": "한 조건을 바꾸고 재료·양·체질 방법 등은 가능한 같게 한다.",
   "misconception": "재료까지 동시에 바꾸면 구멍 크기의 영향을 알기 어렵다.",
   "criteria": "구멍 크기만 바꾸고 같은 종류·양·마른 재료와 같은 체질 방법으로 위/아래를 비교하는 설계를 설명한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-17",
   "no": 17,
   "status": "authored",
   "form": "blank",
   "topic": "액체 혼합물",
   "prompt": "물과 기름을 흔든 뒤 충분히 두었을 때, 골고루 섞이지 않고 두 [ ]으로 나뉘는 모습을 볼 수 있다.",
   "answer": "층",
   "explanation": "이 활동에서는 충분히 둔 뒤의 층을 관찰해 분리한다.",
   "misconception": "흔든 직후 흐려진 모습을 영구히 녹은 것으로 보지 않는다.",
   "criteria": "충분히 둔 물과 기름이 이루는 두 층을 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-18",
   "no": 18,
   "status": "authored",
   "form": "choice",
   "topic": "층 관찰",
   "prompt": "제공 자료: 비커 아래에 물, 위에 기름이 있습니다. 기름을 먼저 덜어 내는 알맞은 방법은?",
   "answer": "④",
   "explanation": "원하는 층에 끝을 두고 경계면이 가까워지면 천천히 다룬다.",
   "misconception": "모든 액체에서 기름이 무조건 위에 있다는 규칙으로 확대하지 않는다.",
   "criteria": "제공된 위 기름층에 스포이트 끝을 두고 조금씩 옮기는 보기를 고른다.",
   "choices": [
    "스포이트 끝을 아래 물에 두고 물만 먼저 기름통에 옮긴다.",
    "비커를 계속 세게 흔들며 두 층을 한꺼번에 옮긴다.",
    "마른 체에 부으면 물만 통과하고 기름은 모두 남는다.",
    "스포이트 끝을 위층 기름에 두고 조금씩 옮긴다.",
    "설탕을 넣으면 기름이 소금으로 바뀌어 저절로 남는다."
   ],
   "key": 3,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-19",
   "no": 19,
   "status": "authored",
   "form": "match",
   "topic": "관찰과 해석",
   "prompt": "표현과 성격을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ",
   "explanation": "관찰 시점과 실제 본 것을 적고 예상은 별도로 남긴다.",
   "misconception": "미래 예상은 과거의 실제 결과가 아니다.",
   "criteria": "실제로 본10분 뒤 두 층과 아직 확인하지 않은 내일의 예상을 구분해 연결한다.",
   "given": [
    "ㄱ 실제 관찰 기록  ㄴ 아직 확인할 예상"
   ],
   "parts": [
    "(1) “10분 뒤 두 층이 보였다.”라고 실제로 적음 [ ]",
    "(2) “내일은 완전히 나뉠 것이다.”라고 생각함 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-20",
   "no": 20,
   "status": "authored",
   "form": "order",
   "topic": "층 분리",
   "prompt": "기호를 순서대로 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "흔든 직후 서두르지 않고 층이 나타나는지 먼저 살핀다.",
   "misconception": "경계가 불분명할 때 완전 분리라고 쓰지 않는다.",
   "criteria": "교사와 준비/처리→충분히 둠→층/경계 확인→옮긴 양쪽 기록의 순서를 확인한다.",
   "given": [
    "ㄱ 두 층과 경계면 관찰  ㄴ 교사와 재료·도구·처리 정하기  ㄷ 충분히 가만히 두기  ㄹ 위층을 조금씩 옮겨 두 용기의 상태 기록"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-21",
   "no": 21,
   "status": "authored",
   "form": "multi",
   "topic": "경계면 가까이",
   "prompt": "기름을 옮기다 스포이트 끝이 경계면에 가까워졌습니다. 알맞은 행동을 모두 고르세요.",
   "answer": "①, ②, ③",
   "explanation": "섞임·잔류를 확인하며 지정된 폐액 용기에 모은다.",
   "misconception": "기름을 배수구로 흘려보내지 않는다.",
   "criteria": "천천히 옮기기·물 혼입 확인·불분명한 경계 기록과 교사 확인을 모두 고른다.",
   "choices": [
    "속도를 줄여 조금씩 옮긴다.",
    "옮긴 액체에 물이 섞였는지 확인한다.",
    "경계가 불분명하면 그대로 기록하고 교사와 확인한다.",
    "남은 기름은 물과 함께 싱크대에 모두 버린다.",
    "아래층까지 한꺼번에 빨아들여 분리 완료라고 쓴다."
   ],
   "key": [
    0,
    1,
    2
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-22",
   "no": 22,
   "status": "authored",
   "form": "written",
   "topic": "관찰의 범위",
   "prompt": "“물과 기름이 나뉘었으니 모든 두 액체는 가만히 두면 두 층이 된다.”를 고치세요.",
   "answer": "관찰한 물과 기름은 두 층으로 나뉘지만 모든 액체가 그런 것은 아니다. 다른 액체 조합은 따로 확인해야 한다.",
   "explanation": "특정 조합의 관찰을 모든 액체의 공통 성질로 넓히지 않는다.",
   "misconception": "물과 잘 섞이는 액체까지 같은 결과로 가정하지 않는다.",
   "criteria": "관찰한 물과 기름에서의 층 분리로 범위를 한정하고 다른 액체 조합은 따로 확인해야 함을 쓴다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-23",
   "no": 23,
   "status": "authored",
   "form": "blank",
   "topic": "소금과 모래",
   "prompt": "소금과 모래에 충분한 물을 넣어 저으면 소금은 물에 [ ], 모래는 대부분 [ ]는다.",
   "answer": "녹고, 녹지 않",
   "explanation": "소금은 용해되어 눈으로 알갱이가 안 보여도 물속에 있다.",
   "misconception": "안 보인다는 것과 없어진다는 것은 다르다.",
   "criteria": "소금은 녹고, 모래는 녹지 않음을 문장에 맞게 각각 완성한다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-24",
   "no": 24,
   "status": "authored",
   "form": "choice",
   "topic": "소금의 위치",
   "prompt": "깨끗한 소금과 모래에 충분한 물을 넣어 소금 알갱이가 모두 안 보일 때까지 저었습니다. 바른 설명은?",
   "answer": "⑤",
   "explanation": "물에 녹는 성질의 차이를 다음 거름 과정에 활용한다.",
   "misconception": "물의 양이 부족해 소금이 남는 상황과 구별한다.",
   "criteria": "안 보이는 소금도 물속에 녹아 있다는 보기를 고른다. 물질 소멸과 구별한다.",
   "choices": [
    "소금은 눈에 안 보이므로 물질 자체가 없어졌다.",
    "소금과 모래 모두 반드시 기체로 바뀌어 날아갔다.",
    "모래는 소금으로 바뀌어 물 위에 모두 떠 있다.",
    "소금은 새 자갈이 되어 바닥에만 모여 있다.",
    "소금은 물에 녹아 있고 모래는 녹지 않고 남는다."
   ],
   "key": 4,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-25",
   "no": 25,
   "status": "authored",
   "form": "match",
   "topic": "물에 넣은 뒤",
   "prompt": "이 활동의 물질과 상태를 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ",
   "explanation": "충분한 물과 소금이 모두 녹았다는 조건이 있다.",
   "misconception": "모든 흰 가루가 소금처럼 녹는다고 보지 않는다.",
   "criteria": "충분히 저은 소금=녹아 있음·모래=녹지 않고 남음을 각각 연결한다.",
   "given": [
    "ㄱ 물에 녹아 있음  ㄴ 물에 녹지 않고 남음"
   ],
   "parts": [
    "(1) 충분히 저은 소금 [ ]",
    "(2) 모래 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-26",
   "no": 26,
   "status": "authored",
   "form": "order",
   "topic": "소금·모래 분리",
   "prompt": "교사와 안전을 확인한 뒤의 과정을 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "용해→거름→증발을 연결해야 모래와 녹은 소금을 나누어 얻을 수 있다.",
   "misconception": "증발을 거름보다 먼저 해서 재료를 다시 섞지 않는다.",
   "criteria": "충분한 용해→모래 거름→거른 소금물의 물 증발→각 과정/고체 확인의 기호를 쓴다.",
   "given": [
    "ㄱ 거른 소금물의 물을 증발시킴  ㄴ 물을 넣고 소금을 충분히 녹임  ㄷ 거름 장치로 모래를 분리함  ㄹ 남은 고체와 각 과정 기록을 확인함"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-27",
   "no": 27,
   "status": "authored",
   "form": "multi",
   "topic": "충분히 녹이기",
   "prompt": "거르기 전 소금이 덜 녹아 남으면 생길 수 있는 일을 모두 고르세요.",
   "answer": "①, ②, ③",
   "explanation": "용해 단계가 덜 끝나면 거름 단계의 분리 결과에도 영향을 준다.",
   "misconception": "고체 소금과 물에 녹은 소금의 상태를 구별한다.",
   "criteria": "종이 위 소금 잔류·모래에 소금 혼입·거른 물에 든 소금 양의 차이 가능성을 모두 고른다.",
   "choices": [
    "소금 일부가 모래와 함께 종이에 남을 수 있다.",
    "모래 쪽에 소금이 섞여 분리가 덜 될 수 있다.",
    "거른 물에 들어간 소금의 양이 예상과 다를 수 있다.",
    "덜 녹은 소금은 반드시 자석에 붙게 된다.",
    "거름종이가 소금을 모두 새로 만들어 낸다."
   ],
   "key": [
    0,
    1,
    2
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-28",
   "no": 28,
   "status": "authored",
   "form": "written",
   "topic": "계획의 근거",
   "prompt": "소금과 모래의 색이 비슷해 손으로 고르기 어렵습니다. 물에 녹는 성질을 이용한 계획과 까닭을 설명하세요.",
   "answer": "충분한 물을 넣어 소금만 녹인 뒤 거르면 모래는 종이에 남고 소금물은 통과한다. 이어 물을 증발시키면 소금을 얻을 수 있다.",
   "explanation": "겉모양보다 서로 다른 용해 성질과 각 단계의 역할을 연결한다.",
   "misconception": "물을 넣기만 하면 마른 소금까지 바로 분리된 것은 아니다.",
   "criteria": "충분한 물로 소금 용해→모래 거름→소금물 증발의 순서와 서로 다른 용해 성질을 함께 설명한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-29",
   "no": 29,
   "status": "authored",
   "form": "blank",
   "topic": "거름 결과",
   "prompt": "모래와 소금물을 거르면 거름종이 위에는 [ ], 아래 용기에는 [ ]이 모인다.",
   "answer": "모래, 소금물",
   "explanation": "녹은 소금은 물과 함께 종이를 지나므로 아래 물은 순수한 물이 아니다.",
   "misconception": "거름이 녹은 소금까지 모두 제거한다고 하지 않는다.",
   "criteria": "거름종이 위 모래·아래 소금물을 제시한 순서대로 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-30",
   "no": 30,
   "status": "authored",
   "form": "choice",
   "topic": "거른 물",
   "prompt": "소금이 모두 녹은 모래 혼합물을 거른 뒤 아래에 맑은 액체가 모였습니다. 그 액체는?",
   "answer": "①",
   "explanation": "소금은 물에 녹은 상태로 거름종이를 통과한다.",
   "misconception": "액체를 맛보아 확인하지 않는다.",
   "criteria": "녹은 소금이 함께 통과한 아래 액체인 소금물을 고른다.",
   "choices": [
    "소금이 녹아 있는 물",
    "소금이 전혀 없는 순수한 물",
    "모래만 액체로 변한 물질",
    "거름종이가 녹아 만든 기름",
    "맛을 보아야만 확인 가능한 물"
   ],
   "key": 0,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-31",
   "no": 31,
   "status": "authored",
   "form": "match",
   "topic": "거름 장치",
   "prompt": "부분과 역할을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "각 도구가 연결된 상태에서 역할을 구별한다.",
   "misconception": "깔때기만으로 물에 녹은 소금을 걸러 낸다고 하지 않는다.",
   "criteria": "아래 비커=액체 모음·깔때기=종이/통로 받침·거름종이=모래 남김을 각각 연결한다.",
   "given": [
    "ㄱ 모래 알갱이를 남김  ㄴ 거른 액체를 모음  ㄷ 종이와 통로를 받침"
   ],
   "parts": [
    "(1) 아래 비커 [ ]",
    "(2) 깔때기 [ ]",
    "(3) 거름종이 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-32",
   "no": 32,
   "status": "authored",
   "form": "order",
   "topic": "거르기 준비",
   "prompt": "안전한 준비부터 기록까지 배열하세요.",
   "answer": "ㄹ → ㄴ → ㄱ → ㄷ",
   "explanation": "흘러넘침·찢어진 종이·잘못된 설치를 점검한다.",
   "misconception": "액체가 종이 위로 넘으면 거른 것으로 보기 어렵다.",
   "criteria": "소금 용해 확인→장치 점검→높이를 넘지 않게 붓기→양쪽 기록의 기호 순서를 쓴다.",
   "given": [
    "ㄱ 종이 높이를 넘지 않게 천천히 붓기  ㄴ 교사와 고정·종이·받는 용기 점검  ㄷ 위에 남은 것과 아래 액체 확인·기록  ㄹ 소금이 충분히 녹았는지 확인"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-33",
   "no": 33,
   "status": "authored",
   "form": "multi",
   "topic": "장치 점검",
   "prompt": "거른 액체에 눈에 보이는 모래 알갱이가 들어갔습니다. 점검할 것을 모두 고르세요.",
   "answer": "①, ②, ③",
   "explanation": "재료가 종이를 우회한 경로와 종이 상태부터 확인한다.",
   "misconception": "무조건 거름 원리가 틀렸다고 결론 내리지 않는다.",
   "criteria": "종이 찢어짐·넘침·바깥 틈으로 흐름을 점검할 보기로 고른다.",
   "choices": [
    "거름종이가 찢어졌는지",
    "액체가 종이 높이를 넘어갔는지",
    "종이 바깥 틈으로 혼합물이 흘렀는지",
    "모래가 모두 소금으로 변했는지",
    "비커 이름표 색이 진한지"
   ],
   "key": [
    0,
    1,
    2
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-34",
   "no": 34,
   "status": "authored",
   "form": "written",
   "topic": "맑음의 뜻",
   "prompt": "거른 소금물이 맑아 보입니다. “소금까지 제거되었다.”는 결론을 왜 고쳐야 하나요?",
   "answer": "녹은 소금은 물과 함께 종이를 지나므로 맑아 보여도 소금물이기 때문이다. 적절히 물을 증발시켜 남는 소금을 확인할 수 있다.",
   "explanation": "눈에 보이는 모래 제거와 녹은 물질 제거를 구별한다.",
   "misconception": "맑은 액체를 순수함이나 음용 가능의 증거로 쓰지 않는다.",
   "criteria": "녹은 소금은 물과 종이를 통과하므로 맑아도 소금물임을 설명한다. 증발 관찰을 추가 근거로 제안할 수 있다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-35",
   "no": 35,
   "status": "authored",
   "form": "blank",
   "topic": "증발",
   "prompt": "소금물에서 물이 공기 중으로 [ ]하면 접시에 [ ]이 남을 수 있다.",
   "answer": "증발, 소금",
   "explanation": "물을 기체 상태로 공기 중에 보내고 녹아 있던 소금을 남긴다.",
   "misconception": "증발 뒤 액체 물까지 따로 모였다고 하지 않는다.",
   "criteria": "물의 증발과 접시에 남는 소금을 각각 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-36",
   "no": 36,
   "status": "authored",
   "form": "choice",
   "topic": "소금 얻기",
   "prompt": "모래를 거른 소금물에서 소금을 얻는 알맞은 과정은?",
   "answer": "②",
   "explanation": "자연 증발이나 교사 시범 등 안전한 방법으로 물을 줄여 남는 소금을 살핀다.",
   "misconception": "학생 직접 가열과 맛보기를 절차로 넣지 않는다.",
   "criteria": "교사와 안전하게 물을 증발시키고 남는 고체를 관찰하는 과정을 고른다.",
   "choices": [
    "고운 체만 통과시켜 녹은 소금을 모두 체에 남긴다.",
    "교사와 물을 증발시켜 남은 고체를 관찰한다.",
    "액체를 마셔 보며 소금이 남는지 입에서 확인한다.",
    "비커 이름표를 바꾸면 물이 소금으로 변한다.",
    "종이를 한 장 더 쓰면 소금이 반드시 전부 걸린다."
   ],
   "key": 1,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-37",
   "no": 37,
   "status": "authored",
   "form": "short",
   "topic": "시간의 기록",
   "prompt": "가상 기록: 월요일 접시에 소금물을 놓았고 목요일 관찰 때 흰 고체를 처음 확인했습니다. “언제 처음 확인했는가”의 답은?",
   "answer": "목요일",
   "explanation": "처음 관찰한 날짜이지 결정이 생기기 시작한 정확한 순간을 뜻하지 않는다.",
   "misconception": "관찰 간격 사이의 일을 본 것처럼 적지 않는다.",
   "criteria": "고체를 처음 확인한 목요일을 쓴다. 생성 시작 시각이나 미관찰일을 확정하지 않는다.",
   "accepted": [
    "목요일 관찰 때"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-38",
   "no": 38,
   "status": "authored",
   "form": "order",
   "topic": "자연 증발 기록",
   "prompt": "기호를 순서대로 배열하세요.",
   "answer": "ㄱ → ㄴ → ㄷ → ㄹ",
   "explanation": "안전한 실온 관찰에서 실제 날짜와 미관찰 기간을 구별한다.",
   "misconception": "책의 예상 시간을 내 실제 소요 시간으로 쓰지 않는다.",
   "criteria": "장소/표시 준비→소금물 놓기→날짜별 실제 관찰→남은 물질/범위 정리의 순서를 쓴다.",
   "given": [
    "ㄱ 교사와 장소·표시·오염 방지 방법 정하기  ㄴ 얕은 접시에 거른 소금물 놓기  ㄷ 날짜와 실제 상태를 여러 번 기록  ㄹ 남은 물질과 확인 범위 정리"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-39",
   "no": 39,
   "status": "authored",
   "form": "multi",
   "topic": "남은 고체 해석",
   "prompt": "깨끗한 소금·물만 쓴 소금물의 증발을 관찰했습니다. 바른 설명을 모두 고르세요.",
   "answer": "①, ②, ③",
   "explanation": "사용한 재료와 실제 관찰의 범위 안에서 해석한다.",
   "misconception": "정체 모를 흰 고체를 색만으로 식용 소금이라고 하지 않는다.",
   "criteria": "물 감소와 소금 잔류·맛보지 않기·미관찰 중간 시점 보존을 모두 고른다.",
   "choices": [
    "물이 줄며 녹아 있던 소금이 남을 수 있다.",
    "흰 고체가 남아도 맛을 보지 않는다.",
    "관찰하지 않은 중간 시점은 미확인으로 둔다.",
    "흰색이므로 어떤 혼합물에서든 전부 먹는 소금이다.",
    "증발만으로 액체 물도 다른 병에 저절로 모인다."
   ],
   "key": [
    0,
    1,
    2
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-40",
   "no": 40,
   "status": "authored",
   "form": "written",
   "topic": "분리의 한계",
   "prompt": "“소금물을 증발시키면 소금과 액체 물을 둘 다 따로 얻는다.”를 이 활동에 맞게 고치세요.",
   "answer": "이 활동에서는 물이 공기 중으로 증발하고 소금이 접시에 남는다. 액체 물을 따로 모으는 장치는 쓰지 않았다.",
   "explanation": "증발로 남은 소금 얻기와 물까지 모으는 다른 장치를 구별한다.",
   "misconception": "증류의 세부 원리·장치를 필수 답으로 요구하지 않는다.",
   "criteria": "이 활동에서는 물이 공기 중으로 증발하고 소금이 남으며 액체 물 수집 장치는 없었음을 모두 설명한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-41",
   "no": 41,
   "status": "authored",
   "form": "blank",
   "topic": "기술과 조사",
   "prompt": "분리 장치를 소개할 때 분리하는 물질·이용한 성질과 함께 자료의 제목·제공처·주소와 [ ] 날짜를 적는다.",
   "answer": "확인",
   "explanation": "출처를 남겨 다른 사람이 근거를 다시 살필 수 있게 한다.",
   "misconception": "검색 제목만 본 것을 실제 본문 조사라고 하지 않는다.",
   "criteria": "자료를 실제로 확인한 날짜를 넣는다. 제작·미래 계획 날짜와 구별한다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-42",
   "no": 42,
   "status": "authored",
   "form": "choice",
   "topic": "장치 선택",
   "prompt": "두 지역에 분리 장치를 제안할 때 먼저 확인할 사항으로 알맞은 것은?",
   "answer": "③",
   "explanation": "지역의 환경·경제·사회적 조건과 유지관리를 함께 고려한다.",
   "misconception": "모든 지역에 한 장치가 항상 최선이라고 단정하지 않는다.",
   "criteria": "지역의 물 상태·전력·관리 등 실제 사용 조건을 확인하는 보기를 고른다.",
   "choices": [
    "광고 사진이 더 멋진 장치를 어느 지역에나 바로 설치한다.",
    "처리할 물질은 보지 않고 용기 색만 맞추어 고른다.",
    "물의 상태·처리량·전력·관리 조건을 확인한다.",
    "필터를 갈 수 없는 곳일수록 교체 조건은 빼고 고른다.",
    "사용 뒤 남는 물질은 어떤 경우에도 모두 하천에 버린다."
   ],
   "key": 2,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-43",
   "no": 43,
   "status": "authored",
   "form": "match",
   "topic": "기술의 여러 역할",
   "prompt": "기능과 확인할 내용을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "큰 찌꺼기 분리와 위생 확인·유지관리는 다른 역할이다.",
   "misconception": "교실 체질이나 거름만으로 정수장 모든 기능을 재현했다고 하지 않는다.",
   "criteria": "큰 망=큰 찌꺼기, 소독/수질검사=위생 관련 처리/확인, 부품/관리/비용=지속 사용을 연결한다.",
   "given": [
    "ㄱ 눈에 보이는 큰 찌꺼기 걸러 냄  ㄴ 위생 관련 처리와 확인  ㄷ 지속 사용 가능성"
   ],
   "parts": [
    "(1) 큰 구멍의 망 [ ]",
    "(2) 소독·수질 검사 [ ]",
    "(3) 교체 부품·관리 인력·비용 조사 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-44",
   "no": 44,
   "status": "authored",
   "form": "multi",
   "topic": "자료 비교",
   "prompt": "정수 장치를 조사할 때 타당한 확인을 모두 고르세요.",
   "answer": "①, ②, ③, ⑤",
   "explanation": "성능 주장의 대상·조건과 실제 관리까지 살핀다.",
   "misconception": "정량 성능·가격을 근거 없이 만들어 쓰지 않는다.",
   "criteria": "분리 성분·처리와 남는 물질·전력/부품/관리·서로 다른 자료의 근거를 모두 확인한다.",
   "choices": [
    "분리하려는 성분이 무엇인지",
    "처리 과정과 남는 물질을 어떻게 다루는지",
    "전력·교체 부품·관리 조건이 무엇인지",
    "맑은 사진 한 장으로 모든 유해 성분 제거를 보장할지",
    "서로 다른 자료가 어떤 근거를 제시하는지"
   ],
   "key": [
    0,
    1,
    2,
    4
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-45",
   "no": 45,
   "status": "authored",
   "form": "written",
   "topic": "제안의 근거",
   "prompt": "전력 공급이 불안정하고 교체 부품 배송이 늦는 지역에 장치를 제안합니다. 조사에 꼭 넣을 두 조건과 까닭을 설명하세요.",
   "answer": "전력 없이도 가능한 기능인지와 부품 교체·현지 관리 가능성을 확인한다. 작동과 지속 사용에 영향을 주기 때문이다.",
   "explanation": "물의 오염 상태·처리량도 함께 살피며 자료로 실제 가능성을 확인한다.",
   "misconception": "조건을 확인하지 않고 무조건 사용 가능하다고 보장하지 않는다.",
   "criteria": "전력 조건과 부품 교체/현지 관리 두 조건을 작동·지속 사용의 까닭과 연결한다. 타당한 같은 범위의 조건을 인정한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-46",
   "no": 46,
   "status": "authored",
   "form": "written",
   "topic": "실제 공유",
   "prompt": "조사 보고서를 저장했지만 누구에게도 보여 주지 않았습니다. 공유 기록은 어떻게 써야 하나요?",
   "answer": "자료 제작·저장 날짜는 적되 아직 미공유라고 쓰고 실제 전달 날짜·방법·받은 의견은 전달 뒤 기록한다.",
   "explanation": "제작과 실제 공유·질문 수신·수정은 다른 행동이다.",
   "misconception": "예상 질문을 실제 받은 질문으로 바꾸지 않는다.",
   "criteria": "실제 제작/저장은 표시하되 미공유 상태를 보존하고 실제 전달/의견은 그 뒤의 사실로 기록함을 설명한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-47",
   "no": 47,
   "status": "authored",
   "form": "choice",
   "topic": "크기 자료",
   "prompt": "가상 자료: 마른 둥근 알갱이 A3mm, B7mm, C12mm. 구멍5mm 체로 흔들 때 남는 것은?",
   "answer": "④",
   "explanation": "5mm보다 큰7mm와12mm가 남는다. 형태 변형이 없는 모형 조건이다.",
   "misconception": "실제 불규칙 모양의 통과를 지름 하나로 무조건 단정하지 않는다.",
   "criteria": "구멍5mm보다 큰 B7mm와 C12mm가 남는 보기를 고른다. A3mm와 구별한다.",
   "choices": [
    "A만",
    "B만",
    "C만",
    "B와 C",
    "A와 B"
   ],
   "key": 3,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-48",
   "no": 48,
   "status": "authored",
   "form": "short",
   "topic": "회수 자료",
   "prompt": "가상 체질 기록: 처음 자갈10개, 체 위에서9개, 받침 밖에서1개를 찾았습니다. 체 위에서 찾은 자갈은 처음보다 몇 개 적나요?",
   "answer": "1개",
   "explanation": "10-9=1개이며 받침 밖에서 찾은 기록을 함께 확인해야 한다.",
   "misconception": "회수 위치와 실제 분실을 구별한다.",
   "criteria": "체 위 수량의 차이10−9=1개를 쓴다. 받침 밖1개를 소멸한 물질로 보지 않는다.",
   "accepted": [
    "1",
    "한 개"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-49",
   "no": 49,
   "status": "authored",
   "form": "written",
   "topic": "공정 비교",
   "prompt": "A모둠은 구멍만 다른 두 체를 비교하려고 재료 종류와 양, 흔드는 횟수도 모두 바꿨습니다. 계획을 고치세요.",
   "answer": "구멍 크기만 다르게 하고 같은 종류·비슷한 양의 마른 재료와 같은 체질 방법을 써 양쪽 결과를 비교한다.",
   "explanation": "여러 조건이 동시에 바뀌면 구멍 크기의 영향만 설명하기 어렵다.",
   "misconception": "두 번 했다는 이유만으로 공정 비교가 되지 않는다.",
   "criteria": "체 구멍만 다르게 하고 재료 종류·양·마른 상태·체질 방법을 가능한 같게 고친 설계를 쓴다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-50",
   "no": 50,
   "status": "authored",
   "form": "written",
   "topic": "층 분리 자료",
   "prompt": "가상 기록: 옮긴 기름 용기 바닥에 작은 물방울이 보였습니다. 이 관찰로 분리 결과와 다음 방법을 설명하세요.",
   "answer": "기름에 물이 일부 섞여 완전 분리가 아니었다. 경계 가까이에서는 천천히 옮기고 실제 섞임을 다시 확인한다.",
   "explanation": "원치 않는 성분이 함께 옮겨졌다는 근거를 보존한다.",
   "misconception": "좋아 보이는 결과로 기록을 고쳐 쓰지 않는다.",
   "criteria": "물방울이 함께 옮겨져 완전 분리가 아님과 경계 가까이 천천히 옮긴 뒤 다시 확인할 방법을 연결한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-51",
   "no": 51,
   "status": "authored",
   "form": "choice",
   "topic": "거름 후 예측",
   "prompt": "가상 실험 조건: 깨끗한 소금4g과 모래6g을 충분한 물에 넣어 소금을 모두 녹여 거릅니다. 올바른 예측은?",
   "answer": "⑤",
   "explanation": "거름은 녹지 않은 모래를 남기며 녹은 소금은 통과한다. 실제 회수 질량은 손실·물기 등을 따로 봐야 한다.",
   "misconception": "4g/6g을 무조건 정확한 실제 회수량으로 쓰지 않는다.",
   "criteria": "충분히 녹은 소금은 소금물로 통과하고 모래는 종이에 남는 예측을 고른다.",
   "choices": [
    "종이에는 소금만 남고 아래에는 모래물이 모인다.",
    "소금과 모래 모두 녹아 아래에 순수한 물만 모인다.",
    "종이에는 아무것도 남지 않고 두 고체는 모두 사라진다.",
    "소금물이 통과하면 녹은 소금은 모두 공기 중으로 간다.",
    "종이에는 모래가 남고 아래에는 소금물이 모인다."
   ],
   "key": 4,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-52",
   "no": 52,
   "status": "authored",
   "form": "short",
   "topic": "회수율 아닌 차이",
   "prompt": "가상 자료: 처음 소금5g, 실험 뒤 충분히 말려 회수한 소금4g입니다. 처음보다 몇 g 적나요?",
   "answer": "1g",
   "explanation": "5-4=1g이다. 이 차이만으로 어느 단계에서 잃었는지는 알 수 없다.",
   "misconception": "회수량 차이를 물질이 사라졌다는 증거로 쓰지 않는다.",
   "criteria": "말린 소금의 처음/회수 질량 차이5−4=1g을 단위와 함께 쓴다.",
   "accepted": [
    "1",
    "1 g",
    "일 그램"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-53",
   "no": 53,
   "status": "authored",
   "form": "written",
   "topic": "손실 해석",
   "prompt": "앞 자료의 소금이1g 적었던 까닭을 “소금이 모두 물로 변해서”라고 했습니다. 가능한 다른 원인과 확인 방법을 쓰세요.",
   "answer": "옮길 때 흘리거나 종이·용기에 소금물이 남았을 수 있다. 각 단계의 흘림·남은 액체 기록을 확인한다.",
   "explanation": "측정·옮김·잔류 조건을 함께 봐야 원인을 좁힐 수 있다.",
   "misconception": "가능한 원인을 이미 확인된 사실이라고 말하지 않는다.",
   "criteria": "흘림·종이/용기 잔류 등 가능한 원인 하나와 각 단계 관찰/기록으로 확인할 방법 하나를 연결한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-54",
   "no": 54,
   "status": "authored",
   "form": "written",
   "topic": "질량 비교 조건",
   "prompt": "가상 자료: 젖은 모래8g과 마른 모래6g을 보고 모래가2g 생겼다고 했습니다. 무엇을 확인해야 하나요?",
   "answer": "남아 있는 물기와 용기 무게·측정 방법을 확인하고 같은 건조 조건에서 비교해야 한다.",
   "explanation": "물기가 포함된 질량과 마른 모래 질량은 그대로 비교할 수 없다.",
   "misconception": "소금·모래의 증감을 젖은 질량만으로 정하지 않는다.",
   "criteria": "물기·용기 무게·측정 조건을 살피고 같은 건조 조건으로 비교해야 함을 설명한다. 모래 생성으로 단정하지 않는다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-55",
   "no": 55,
   "status": "authored",
   "form": "match",
   "topic": "정수 자료 읽기",
   "prompt": "공공 자료에 여러 처리 단계가 소개되어 있습니다. 구별할 것을 연결하세요.",
   "answer": "(1) ㄱ (2) ㄷ (3) ㄴ",
   "explanation": "처리 설명·검사 자료·사용 여건은 서로 다른 근거다.",
   "misconception": "사진만으로 실제 수질 수치를 만들어 내지 않는다.",
   "criteria": "대상 물질=처리 기능, 전력/부품/인력=지역 조건, 날짜/시료 수질 수치=실제 검사로 연결한다.",
   "given": [
    "ㄱ 처리 기능 설명  ㄴ 실제 검사 결과  ㄷ 지역 사용 조건"
   ],
   "parts": [
    "(1) 여과 장치의 대상 물질 [ ]",
    "(2) 전력·부품·관리 인력 [ ]",
    "(3) 특정 날짜·시료의 수질 수치 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-56",
   "no": 56,
   "status": "authored",
   "form": "written",
   "topic": "교실 모형의 한계",
   "prompt": "모래 섞인 물을 거르는 교실 모형으로 실제 정수장의 모든 기능을 보여 주었다고 할 수 있나요?",
   "answer": "없다. 일부 눈에 보이는 고체 분리를 보여 줄 뿐, 실제 시설의 여러 처리·관리·수질 검사를 모두 구현하지 않았다.",
   "explanation": "모형이 보여 주는 역할과 구현하지 않은 기능을 구별한다.",
   "misconception": "교실 모형에서 나온 물을 마시지 않는다.",
   "criteria": "교실 모형의 눈에 보이는 고체 분리 범위와 실제 시설의 여러 처리·관리·검사를 구별한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-57",
   "no": 57,
   "status": "authored",
   "form": "draw",
   "topic": "흐름 나타내기",
   "prompt": "소금·모래 혼합물에서 두 물질을 얻는 흐름을 글상자·화살표로 나타내세요. 물을 넣기·거름·증발과 각 단계의 남는 물질 이름을 붙이세요.",
   "answer": "혼합물→충분한 물로 소금 용해→거름(모래 남음/소금물 통과)→소금물의 물 증발(소금 남음)을 나타낸다.",
   "explanation": "단계 이름만이 아니라 물질이 어디로 가는지 연결한다.",
   "misconception": "정교한 장치 그림보다 과정·물질 이름과 방향이 중요하다.",
   "criteria": "물 넣어 소금 용해→거름의 모래/소금물 두 갈래→소금물의 물 증발/소금 잔류를 이름표와 화살표로 나타낸다.",
   "drawing": "large",
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-58",
   "no": 58,
   "status": "authored",
   "form": "written",
   "topic": "결과와 소통",
   "prompt": "친구가 “거른 물은 왜 소금물인지 모르겠어.”라고 물었습니다. 자료를 어떻게 고치고 기록할까요?",
   "answer": "녹은 소금이 물과 함께 종이를 통과한다는 설명과 물질 이름을 보완하고 받은 질문·실제 수정·다시 설명했는지 기록한다.",
   "explanation": "실제로 받은 의견을 근거로 설명을 구체화한다.",
   "misconception": "재설명 전이면 계획이라고 표시한다.",
   "criteria": "녹은 소금이 물과 종이를 통과한다는 설명/이름표를 보완하고 실제 질문·수정·재설명 여부를 구별한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-59",
   "no": 59,
   "status": "authored",
   "form": "blank",
   "topic": "혼합과 분리",
   "prompt": "혼합물의 분리에는 구성 물질의 [ ]을 이용한다.",
   "answer": "성질",
   "explanation": "크기·물에 녹음·두 층으로 나뉨 등 서로 다른 특징을 이용한다.",
   "misconception": "물질 이름만으로 아무 도구나 고르지 않는다.",
   "criteria": "분리에 이용하는 구성 물질의 성질을 넣는다. 방법 이름만 쓰는 것과 구별한다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-60",
   "no": 60,
   "status": "authored",
   "form": "blank",
   "topic": "체의 양쪽",
   "prompt": "알맞은 체로 모래·자갈을 나누면 작은 [ ]는 통과하고 큰 [ ]은 남는다.",
   "answer": "모래, 자갈",
   "explanation": "알갱이 크기가 체 구멍의 양쪽으로 나뉘는 조건이다.",
   "misconception": "체질로 녹은 소금을 걸러 내지 않는다.",
   "criteria": "작아 통과하는 모래와 커서 남는 자갈을 순서대로 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-61",
   "no": 61,
   "status": "authored",
   "form": "blank",
   "topic": "층과 도구",
   "prompt": "물과 기름을 충분히 두어 층을 확인한 뒤 위층을 조금씩 옮길 도구로 [ ]를 쓸 수 있다.",
   "answer": "스포이트",
   "explanation": "경계면과 옮긴 액체의 상태도 확인한다.",
   "misconception": "도구를 쓴 사실만으로 완전 분리라고 보지 않는다.",
   "criteria": "층을 확인한 뒤 조금씩 옮기는 스포이트를 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-62",
   "no": 62,
   "status": "authored",
   "form": "blank",
   "topic": "거름의 양쪽",
   "prompt": "소금을 모두 녹인 모래 혼합물을 거르면 종이에는 [ ], 아래에는 [ ]이 모인다.",
   "answer": "모래, 소금물",
   "explanation": "녹은 소금은 종이에서 분리되지 않고 물과 함께 통과한다.",
   "misconception": "맑음을 순수함과 같게 보지 않는다.",
   "criteria": "소금이 모두 녹았다는 조건에서 종이의 모래와 아래 소금물을 각각 완성한다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-63",
   "no": 63,
   "status": "authored",
   "form": "blank",
   "topic": "증발과 회수",
   "prompt": "소금물의 물을 증발시킬 때 접시에 남겨 얻는 물질은 [ ]이다.",
   "answer": "소금",
   "explanation": "물은 공기 중으로 가고 별도 장치 없이 액체로 모이지 않는다.",
   "misconception": "증발로 물이 소금으로 변하는 것이 아니다.",
   "criteria": "물을 증발시킨 뒤 접시에 남겨 얻는 소금을 쓴다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-64",
   "no": 64,
   "status": "authored",
   "form": "blank",
   "topic": "기술의 조건",
   "prompt": "분리 장치를 지속적으로 쓰려면 성능 외에 전력·부품 교체·[ ] 등의 조건도 조사한다.",
   "answer": "유지관리",
   "explanation": "현지에서 계속 작동·관리 가능한지를 확인한다.",
   "misconception": "장치 구입만으로 지속 사용을 보장하지 않는다.",
   "criteria": "전력·부품 교체와 함께 지속 사용에 필요한 유지관리를 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-65",
   "no": 65,
   "status": "authored",
   "form": "choice",
   "topic": "혼합물 판단",
   "prompt": "마른 좁쌀과 큰 콩을 섞었습니다. 분리 방법의 근거로 알맞은 것은?",
   "answer": "①",
   "explanation": "서로 다른 크기와 체 구멍의 관계를 이용할 수 있다.",
   "misconception": "재료에 없는 성질을 방법의 근거로 삼지 않는다.",
   "criteria": "좁쌀·콩의 알갱이 크기 차이와 알맞은 체를 연결한 보기를 고른다.",
   "choices": [
    "두 알갱이의 크기 차이를 이용한다.",
    "콩이 섞이며 반드시 기체로 변하는 점을 이용한다.",
    "두 재료가 같은 색이 되는 점을 이용한다.",
    "둘 다 자석에 강하게 붙는다고 가정한다.",
    "섞이면 서로의 성질이 모두 사라진다고 가정한다."
   ],
   "key": 0,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-66",
   "no": 66,
   "status": "authored",
   "form": "blank",
   "topic": "체 조건 적용",
   "prompt": "가상 둥근 알갱이2mm와9mm를 나눌 때 체 구멍5mm라면 [ ]mm 알갱이가 통과한다.",
   "answer": "2",
   "explanation": "2<5<9의 관계로 작은 알갱이만 통과한다.",
   "misconception": "구멍보다 큰 것이 통과하는 것으로 바꾸지 않는다.",
   "criteria": "2mm<5mm<9mm 조건에서 통과하는 알갱이 지름2를 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-67",
   "no": 67,
   "status": "authored",
   "form": "match",
   "topic": "분리 결과",
   "prompt": "분리한 곳과 모이는 물질을 연결하세요.",
   "answer": "(1) ㄷ (2) ㄴ (3) ㄱ",
   "explanation": "어떤 성질을 이용한 단계인지 읽어 물질을 추적한다.",
   "misconception": "같은 “위”라는 위치만 보고 물질을 같게 답하지 않는다.",
   "criteria": "체 위 자갈·거름종이 위 모래·증발 뒤 소금을 각 위치에 연결한다.",
   "given": [
    "ㄱ 소금  ㄴ 모래  ㄷ 자갈"
   ],
   "parts": [
    "(1) 알맞은 체 위 [ ]",
    "(2) 소금·모래 용해 후 거름종이 위 [ ]",
    "(3) 거른 소금물 증발 뒤 접시 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-68",
   "no": 68,
   "status": "authored",
   "form": "written",
   "topic": "체 선택 이유",
   "prompt": "지름3mm와10mm인 마른 둥근 알갱이를 나눌 때 구멍6mm가 구멍1mm보다 적절한 까닭을 설명하세요.",
   "answer": "6mm는3mm보다 커서 작은 알갱이를 통과시키고10mm보다 작아 큰 알갱이를 남긴다.1mm는 둘 다 남긴다.",
   "explanation": "구멍 크기와 두 알갱이 크기를 각각 비교한다.",
   "misconception": "“더 커서”만 쓰고 무엇과 비교했는지 빼지 않는다.",
   "criteria": "3mm<6mm<10mm로 작은 것만 통과함과 구멍1mm에서는 둘 다 남음을 비교해 설명한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-69",
   "no": 69,
   "status": "authored",
   "form": "choice",
   "topic": "액체 분리 판단",
   "prompt": "물과 기름을 흔든 직후 경계가 불분명합니다. 다음 행동은?",
   "answer": "②",
   "explanation": "관찰할 시점을 확보하고 실제 층의 상태를 확인한다.",
   "misconception": "즉시 보이지 않는 경계를 영구적 혼합의 증거로 삼지 않는다.",
   "criteria": "흔든 직후 불분명한 경계를 더 가만히 두어 확인하는 보기를 고른다.",
   "choices": [
    "경계가 없으니 두 물질 모두 사라졌다고 쓴다.",
    "충분히 두고 층이 나뉘는지 다시 관찰한다.",
    "맛을 보아 어느 쪽이 기름인지 구별한다.",
    "세게 계속 흔들며 완전 분리되었다고 쓴다.",
    "종이 색을 바꾸어 액체가 분리됐다고 쓴다."
   ],
   "key": 1,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-70",
   "no": 70,
   "status": "authored",
   "form": "order",
   "topic": "기름 분리 절차",
   "prompt": "기호를 순서대로 쓰세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "층 확인 전에 옮기지 않고 결과까지 살핀다.",
   "misconception": "옮긴 액체가 순수하다고 자동 확정하지 않는다.",
   "criteria": "충분히 둠→층/경계 확인→위층 옮김→양쪽 섞임 기록의 기호 순서를 쓴다.",
   "given": [
    "ㄱ 위층을 조금씩 옮김  ㄴ 충분히 둠  ㄷ 양쪽 액체에 섞인 것이 있는지 기록  ㄹ 층과 경계면 확인"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-71",
   "no": 71,
   "status": "authored",
   "form": "multi",
   "topic": "기름 활동 기록",
   "prompt": "좋은 기록을 모두 고르세요.",
   "answer": "①, ②, ③, ⑤",
   "explanation": "날짜·시간·관찰·처리와 실패·불분명을 남긴다.",
   "misconception": "교재의 설명 사진을 실제 결과로 베끼지 않는다.",
   "criteria": "실제 대기 시간·층/경계·동반된 물방울·남는 물질 처리의 관찰 기록을 모두 고른다.",
   "choices": [
    "가만히 둔 실제 시간",
    "실제로 보인 층·경계의 상태",
    "옮긴 액체에 섞인 물방울 여부",
    "보지 않은 결과를 책과 똑같이 채운 값",
    "분리하고 남은 물질 처리 방법"
   ],
   "key": [
    0,
    1,
    2,
    4
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-72",
   "no": 72,
   "status": "authored",
   "form": "written",
   "topic": "층과 도구 이유",
   "prompt": "물 위 기름층을 스포이트로 옮길 때 경계 가까이에서 천천히 하는 까닭은?",
   "answer": "아래 물까지 함께 옮겨 섞이는 것을 줄이고 경계와 옮긴 액체 상태를 확인하기 위해서다.",
   "explanation": "서로 다른 층을 구별하며 원하는 물질을 옮기는 목적과 연결한다.",
   "misconception": "빠르면 반드시 더 잘 분리된다고 하지 않는다.",
   "criteria": "물까지 함께 옮기는 것을 줄이려는 목적과 경계/옮긴 액체 상태 확인을 연결한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-73",
   "no": 73,
   "status": "authored",
   "form": "choice",
   "topic": "소금 용해",
   "prompt": "소금·모래 혼합물에 충분한 물을 넣어 저었더니 모래만 보입니다. 바른 해석은?",
   "answer": "③",
   "explanation": "용해된 물질이 눈에 안 보여도 혼합물 속에 있다.",
   "misconception": "눈으로 보임과 물질의 존재를 같게 보지 않는다.",
   "criteria": "모래만 보여도 소금은 녹아 물속에 있다는 보기를 고른다.",
   "choices": [
    "소금은 없어졌으니 다시 얻을 가능성이 없다.",
    "모래가 녹은 소금을 모두 새로운 물로 바꾸었다.",
    "소금은 물속에 녹아 있고 모래는 녹지 않았다.",
    "물은 없어지고 소금만 투명한 고체가 되었다.",
    "눈에 안 보이면 어떤 물질도 물속에 있을 수 없다."
   ],
   "key": 2,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-74",
   "no": 74,
   "status": "authored",
   "form": "blank",
   "topic": "용해 차이 이용",
   "prompt": "소금과 모래를 물로 나누는 데 이용한 것은 물에 [ ] 성질의 차이이다.",
   "answer": "녹는",
   "explanation": "충분한 물에서 소금은 녹고 모래는 녹지 않는 차이다.",
   "misconception": "색 차이나 자석 성질을 이 과정의 주된 근거로 쓰지 않는다.",
   "criteria": "소금·모래를 구분하는 물에 녹는 성질을 문장에 맞게 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-75",
   "no": 75,
   "status": "authored",
   "form": "match",
   "topic": "단계와 목적",
   "prompt": "단계와 역할을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "단계가 달라지면 이용하는 성질과 얻는 쪽도 달라진다.",
   "misconception": "거름만으로 마른 소금까지 얻었다고 하지 않는다.",
   "criteria": "물 넣고 저음=소금 용해·거름=모래 남김·물 증발=접시에 소금 남김을 각각 연결한다.",
   "given": [
    "ㄱ 모래를 남김  ㄴ 소금을 물에 녹임  ㄷ 소금을 접시에 남김"
   ],
   "parts": [
    "(1) 물 넣고 저음 [ ]",
    "(2) 거름 [ ]",
    "(3) 거른 액체의 물 증발 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-76",
   "no": 76,
   "status": "authored",
   "form": "written",
   "topic": "분리 순서 검토",
   "prompt": "소금·모래 혼합물에 물을 넣고 거르지 않은 채 물부터 증발시키면 두 고체가 잘 분리될까요?",
   "answer": "잘 분리되지 않는다. 녹지 않은 모래가 함께 남아 소금과 다시 섞이므로 먼저 모래를 거르고 소금물만 증발시켜야 한다.",
   "explanation": "원하는 물질을 단계별로 따로 모으는 순서를 설명한다.",
   "misconception": "물만 줄이면 두 고체가 저절로 다른 곳에 모인다고 하지 않는다.",
   "criteria": "모래를 거르지 않으면 증발 뒤 소금과 함께 남음을 설명하고 먼저 모래 거름→소금물 증발로 고친다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-77",
   "no": 77,
   "status": "authored",
   "form": "choice",
   "topic": "거름종이 통과",
   "prompt": "소금이 모두 녹은 혼합물을 정상적으로 걸렀습니다. 종이를 통과하는 것은?",
   "answer": "④",
   "explanation": "녹은 소금이 물과 함께 통과하는 조건을 읽는다.",
   "misconception": "거름종이가 모든 녹은 물질을 제거한다고 보지 않는다.",
   "criteria": "소금이 모두 녹은 조건에서 물과 녹은 소금이 함께 종이를 통과하는 보기를 고른다.",
   "choices": [
    "큰 모래 알갱이만 모인 것",
    "물 없는 마른 소금 알갱이만 모인 것",
    "모든 소금이 제거된 순수한 물",
    "소금이 녹아 있는 물",
    "소금이 새로 만든 식용유"
   ],
   "key": 3,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-78",
   "no": 78,
   "status": "authored",
   "form": "short",
   "topic": "차이 읽기",
   "prompt": "가상 실험: 처음 모래12g, 같은 방법으로 말려 회수한 모래11g입니다. 처음보다 얼마나 적나요?",
   "answer": "1g",
   "explanation": "12-11=1g이다. 손실의 구체적 원인은 별도 기록이 필요하다.",
   "misconception": "적게 얻었다는 수치만으로 모래가 소금으로 변했다고 하지 않는다.",
   "criteria": "같은 방법으로 말린 모래의12−11=1g 차이를 단위와 함께 쓴다.",
   "accepted": [
    "1",
    "1 g",
    "일 그램"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-79",
   "no": 79,
   "status": "authored",
   "form": "multi",
   "topic": "거름 실패 점검",
   "prompt": "거른 액체에 눈에 보이는 모래가 섞였습니다. 직접 점검할 조건을 모두 고르세요.",
   "answer": "①, ②, ③, ④",
   "explanation": "종이·넘침·우회 경로·고정은 실제 분리 경로와 관련 있다.",
   "misconception": "실패를 지우기보다 원인 후보를 확인한다.",
   "criteria": "종이 상태·붓는 높이·틈과 경로 등 실제로 점검할 보기만 모두 고른다.",
   "choices": [
    "찢어진 거름종이",
    "종이 높이 위로 넘친 액체",
    "종이 바깥으로 흐른 혼합물",
    "실제로 확인한 장치 고정 상태",
    "이름표 글씨체만의 차이"
   ],
   "key": [
    0,
    1,
    2,
    3
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-80",
   "no": 80,
   "status": "authored",
   "form": "written",
   "topic": "거름의 한계 설명",
   "prompt": "물을 거르는 장치 소개에 “종이를 통과했으니 소금도 없고 바로 마셔도 된다.”라고 썼습니다. 두 주장을 고치세요.",
   "answer": "녹은 소금은 통과할 수 있으며, 거름 후 맑아 보이는 것만으로 음용 안전을 확인할 수 없다. 실험물은 마시지 않는다.",
   "explanation": "녹은 성분 제거 여부와 음용 안전이라는 두 주장을 각각 검토한다.",
   "misconception": "단순 거름을 소독·모든 성분 제거와 같게 보지 않는다.",
   "criteria": "녹은 소금 통과와 맑음만으로 음용 안전을 확인할 수 없음의 두 주장을 각각 고친다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-81",
   "no": 81,
   "status": "authored",
   "form": "choice",
   "topic": "증발 결과",
   "prompt": "깨끗한 소금물의 물을 안전하게 증발시켰습니다. 이 활동에서 얻는 결과는?",
   "answer": "⑤",
   "explanation": "사용 재료와 물의 증발을 근거로 남은 소금을 설명한다.",
   "misconception": "맛보기·학생 직접 가열을 답의 절차로 삼지 않는다.",
   "criteria": "물이 증발하고 소금이 남는 이 활동의 결과를 고른다. 액체 물 회수와 구별한다.",
   "choices": [
    "물 전체가 접시 안에서 소금으로 변한다.",
    "소금이 모두 공기 중으로 사라진다.",
    "액체 물이 별도 장치 없이 다른 병에 모인다.",
    "남은 고체는 맛보아야만 기록할 수 있다.",
    "접시에 녹아 있던 소금이 남는다."
   ],
   "key": 4,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-82",
   "no": 82,
   "status": "authored",
   "form": "blank",
   "topic": "중간 관찰",
   "prompt": "화요일 이후 금요일에야 접시를 다시 보았습니다. 수·목요일 상태는 직접 [ ]하지 않은 것으로 남긴다.",
   "answer": "관찰",
   "explanation": "미관찰 기간을 결과로 채우지 않는다.",
   "misconception": "나중에 본 사진으로 이전 날짜의 실제 값을 만들지 않는다.",
   "criteria": "수·목요일 상태는 직접 관찰하지 않았다는 사실을 완성한다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-83",
   "no": 83,
   "status": "authored",
   "form": "draw",
   "topic": "물질 흐름 평가",
   "prompt": "소금·모래→물 넣고 저음→거름→소금물의 물 증발을 네 칸으로 그리세요. 거름 뒤 양쪽 물질과 물이 간 곳을 이름표로 붙이세요.",
   "answer": "거름종이의 모래/아래 소금물, 증발 뒤 소금/공기 중 물을 구별해 연결한다.",
   "explanation": "물질 이름·위치·방향이 일치하는지 확인한다.",
   "misconception": "사진 같은 그림 실력보다 과학적 연결을 평가한다.",
   "criteria": "네 단계의 흐름과 거름 뒤 모래/소금물·증발 뒤 소금/공기 중 물을 이름표로 구별해 그린다.",
   "drawing": "large",
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-84",
   "no": 84,
   "status": "authored",
   "form": "written",
   "topic": "완전 회수 주장",
   "prompt": "“분리가 잘되면 언제나 처음과 정확히 같은 질량의 마른 소금을 얻는다.”라는 말에서 실험 조건을 더 확인해야 하는 까닭은?",
   "answer": "옮길 때 흘림·용기와 종이에 남은 소금물·건조 정도·측정 조건 때문에 실제 회수 질량이 달라질 수 있다.",
   "explanation": "이상적인 물질 보존과 실제 회수·측정의 손실 조건을 구별한다.",
   "misconception": "회수량 부족을 곧바로 물질 소멸로 해석하지 않는다.",
   "criteria": "흘림·잔류·건조·측정 등 실제 회수 질량에 영향을 줄 조건을 근거로 설명한다. 반드시 같은 값이라 강요하지 않는다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-85",
   "no": 85,
   "status": "authored",
   "form": "choice",
   "topic": "지역 맞춤 조사",
   "prompt": "분리 장치를 오래 사용하기 위한 조사 질문으로 가장 알맞은 것은?",
   "answer": "①",
   "explanation": "유지관리와 환경·경제·사회 조건이 지속 사용에 연결된다.",
   "misconception": "광고 문구를 검증된 결과로 대신하지 않는다.",
   "criteria": "부품·관리·지역 조건을 확인해 오래 쓸 수 있는지 묻는 조사 질문을 고른다.",
   "choices": [
    "현지에서 부품 교체와 관리·전력 공급을 계속 할 수 있는가?",
    "그림 속 용기가 가장 화려한 색인가?",
    "처리할 성분을 몰라도 사진이 맑으면 실제 수질 검사 결과는 모두 생략해도 되는가?",
    "광고에서 좋다니 모든 지역에 같은 성능을 보장하는가?",
    "설치 뒤 남는 물질은 확인 없이 모두 버려도 되는가?"
   ],
   "key": 0,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-86",
   "no": 86,
   "status": "authored",
   "form": "match",
   "topic": "조사와 공유 구별",
   "prompt": "행동과 상태를 연결하세요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "각 행동의 실제 날짜·방법·자료를 따로 남긴다.",
   "misconception": "저장만 하고 전달했다고 쓰지 않는다.",
   "criteria": "자료 완성=제작·설명/질문 받음=실제 전달·질문 때문에 고침=의견을 이용한 수정을 연결한다.",
   "given": [
    "ㄱ 제작  ㄴ 실제 전달  ㄷ 의견을 이용한 수정"
   ],
   "parts": [
    "(1) 출처를 넣어 자료를 완성함 [ ]",
    "(2) 친구에게 설명하고 질문을 받음 [ ]",
    "(3) 받은 질문 때문에 설명을 고침 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-87",
   "no": 87,
   "status": "authored",
   "form": "multi",
   "topic": "근거 있는 발표",
   "prompt": "발표 자료에 넣을 내용을 모두 고르세요.",
   "answer": "①, ②, ③, ⑤",
   "explanation": "자료의 성격과 실제 조사·제작·전달의 범위를 밝혀야 한다.",
   "misconception": "사진처럼 보인다는 이유로 실험 증거라고 쓰지 않는다.",
   "criteria": "성질·실제 읽은 출처·조건/한계/남는 물질·실제 의견 또는 미수신을 모두 고른다.",
   "choices": [
    "분리할 물질과 이용한 성질",
    "실제로 읽은 자료의 출처",
    "사용 조건·한계·남는 물질 처리",
    "AI 설명 이미지를 내 실험 사진이라고 한 설명",
    "실제로 받은 의견 또는 아직 미수신이라는 표시"
   ],
   "key": [
    0,
    1,
    2,
    4
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-88",
   "no": 88,
   "status": "authored",
   "form": "written",
   "topic": "제안과 근거 연결",
   "prompt": "분리 장치 하나를 골라 이용한 성질·도움 되는 점·사용 조건 하나를 근거와 연결해 설명하세요. 실제 조사 전이면 그 사실도 쓰세요.",
   "answer": "예: 큰 찌꺼기를 거르는 망은 크기 차이를 이용하며 뒤 장치로 들어가는 큰 고체를 줄일 수 있다. 망의 막힘과 청소 조건을 확인해야 한다. 실제 읽은 출처/미조사를 표시한다.",
   "explanation": "장치의 대상 물질·성질·기여·조건을 연결한 타당한 대안을 인정한다.",
   "misconception": "모든 성분 제거·음용 가능을 근거 없이 보장하지 않는다.",
   "criteria": "선택한 장치의 성질·도움·사용 조건을 근거로 연결하고 실제 출처 또는 아직 미조사임을 밝힌다. 타당한 다른 장치를 인정한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-89",
   "no": 89,
   "status": "authored",
   "form": "blank",
   "topic": "구멍 다시 보기",
   "prompt": "두 알갱이가 모두 체를 통과했다면 남겨야 할 큰 알갱이보다 구멍이 너무 [ ] 가능성을 확인한다.",
   "answer": "큰",
   "explanation": "크기 외에 모양·방향·파손도 실제 상황에서 확인할 수 있다.",
   "misconception": "체만 썼다고 분리가 끝난 것은 아니다.",
   "criteria": "둘 다 통과한 결과에서 큰 알갱이보다 구멍이 너무 클 가능성을 넣는다.",
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-01",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-90",
   "no": 90,
   "status": "authored",
   "form": "choice",
   "topic": "소금물 다시 보기",
   "prompt": "소금이 모두 녹은 혼합물을 거른 뒤의 액체를 바르게 설명한 것은?",
   "answer": "②",
   "explanation": "거름종이 통과와 녹은 소금 존재를 함께 읽는다.",
   "misconception": "맛보기 대신 재료·과정·안전한 관찰을 근거로 쓴다.",
   "criteria": "거른 아래 액체에도 녹은 소금이 있음을 나타낸 보기를 고른다.",
   "choices": [
    "투명하므로 어떤 성분도 없는 빈 공간이다.",
    "녹은 소금이 들어 있으므로 맑아도 소금물이다.",
    "거름종이가 녹아 있는 소금을 새 물로 바꾸어 모두 순수해졌다.",
    "물질은 눈에 보여야만 있으므로 소금은 없다.",
    "마셔 보지 않으면 어떤 기록도 남길 수 없다."
   ],
   "key": 1,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-91",
   "no": 91,
   "status": "authored",
   "form": "short",
   "topic": "실제 날짜",
   "prompt": "가상 기록에서 월요일은 계획, 화·수요일은 실제 관찰, 목요일은 관찰하지 않았습니다. 실제 관찰한 날은 며칠인가요?",
   "answer": "2일",
   "explanation": "화요일과 수요일만 실제 관찰로 기록됐다.",
   "misconception": "계획이나 빈 날짜를 실측 일수에 더하지 않는다.",
   "criteria": "월요일 계획·목요일 미관찰을 빼고 실제 화/수요일의2일을 센다.",
   "accepted": [
    "2",
    "이틀",
    "2 일"
   ],
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-92",
   "no": 92,
   "status": "authored",
   "form": "written",
   "topic": "AI 자료 구별",
   "prompt": "실사형 설명 사진을 붙여 “내가 오늘 실험하여 나온 결과”라고 썼습니다. 기록을 고치세요.",
   "answer": "AI 설명 자료라고 표시하고 내 실제 수행 여부를 따로 적는다. 직접 했다면 날짜·재료·방법·실제 관찰과 실패/불분명을 남긴다.",
   "explanation": "이미지의 사실감은 실제 학생 수행의 증거가 아니다.",
   "misconception": "예시 사진을 내 수행 증거로 바꾸지 않는다.",
   "criteria": "설명 자료의 성격과 내 실제 수행 여부를 나누고 직접 했다면 실제 날짜·재료·방법·관찰/불분명으로 고친다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-03",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-93",
   "no": 93,
   "status": "authored",
   "form": "match",
   "topic": "방법 다시 묶기",
   "prompt": "분리할 성질과 방법을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "방법 이름뿐 아니라 해당 단계의 목적과 성질을 확인한다.",
   "misconception": "체와 거름종이를 모든 혼합물의 만능 도구로 보지 않는다.",
   "criteria": "크기 차이=체·용해 차이=거름 전 물에 녹임·소금물에서 소금=물 증발을 연결한다.",
   "given": [
    "ㄱ 거름 전 물에 녹이기  ㄴ 알맞은 체 사용  ㄷ 물 증발시키기"
   ],
   "parts": [
    "(1) 고체 알갱이 크기 차이 [ ]",
    "(2) 소금·모래의 용해 차이 [ ]",
    "(3) 소금물에서 소금 얻기 [ ]"
   ],
   "answerPerPart": true,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-94",
   "no": 94,
   "status": "authored",
   "form": "choice",
   "topic": "증발과 물",
   "prompt": "증발 접시에 소금이 남았습니다. 액체 물을 따로 받는 장치는 쓰지 않았습니다. 바른 결론은?",
   "answer": "③",
   "explanation": "활동에서 실제 사용한 장치와 관찰 범위를 지킨다.",
   "misconception": "응결·증류 장치를 쓰지 않았는데 물도 얻었다고 쓰지 않는다.",
   "criteria": "소금은 남았지만 액체 물을 따로 모으지 않았다는 결론을 고른다.",
   "choices": [
    "물은 전부 고체 소금이 되어 질량이 늘었다.",
    "물은 보이지 않는 다른 비커에 액체 상태로 저절로 모였다.",
    "물은 공기 중으로 증발했고 접시에 소금이 남았다.",
    "소금도 모두 기체로 변해 접시가 완전히 비었다.",
    "그 접시는 앞으로 물이 절대 증발하지 않게 한다."
   ],
   "key": 2,
   "previousCriteria": "각 응답의 뜻·조건을 확인한다. 동등한 과학적 표현을 인정한다.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-95",
   "no": 95,
   "status": "authored",
   "form": "written",
   "topic": "설명 수정",
   "prompt": "친구가 “체와 거름종이가 하는 일이 헷갈려.”라고 했습니다. 공통점과 이 단원에서의 차이를 넣어 자료를 고치세요.",
   "answer": "둘 다 통과/남음을 이용한다. 체는 크기가 다른 마른 고체를 나누고, 거름종이는 이 활동에서 소금물과 녹지 않은 모래를 나누며 녹은 소금은 통과한다.",
   "explanation": "장치의 공통 역할과 대상 혼합물·녹은 성분의 차이를 비교한다.",
   "misconception": "거름종이가 녹은 소금까지 남긴다는 설명은 고친다.",
   "criteria": "통과/남음이라는 공통점과 마른 크기 다른 고체의 체·소금물/모래의 거름 차이를 연결해 보완한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-02",
   "origin": "previous96"
  },
  {
   "id": "mixture-book-96",
   "no": 96,
   "status": "authored",
   "form": "written",
   "topic": "처음 생각과 비교",
   "prompt": "처음 답 하나를 골라 지금 설명과 비교하세요. 이용한 성질·과정의 근거와 아직 모르는 점을 넣으세요.",
   "answer": "예: 맑으면 순수한 물이라 생각했지만 녹은 소금이 종이를 통과한다는 근거로 고쳤다. 다른 녹은 성분의 분리 방법은 더 조사하겠다.",
   "explanation": "처음 생각·근거로 고친 설명·남은 질문을 연결한다. 타당한 다른 사례도 인정한다.",
   "misconception": "맞은 개수만 적고 근거를 생략하지 않는다.",
   "criteria": "처음/현재 설명의 비교와 이용한 성질·과정의 근거·남은 의문을 연결한다. 과학적으로 타당한 다른 사례를 인정한다.",
   "lines": 8,
   "previousCriteria": "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인.",
   "standard": "6과05-03",
   "origin": "previous96"
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "혼합물의 분리",
   "blocks": [
    {
     "type": "diagram",
     "key": "mixture",
     "caption": "섞인 재료의 성질을 살피는 설명 장면이에요. 사진 속 크기·개수를 측정값으로 쓰지 않아요."
    },
    {
     "type": "text",
     "text": "작은 모래와 큰 자갈, 물과 식용유, 소금과 모래는 같은 방법으로 나눌 수 있을까요? 무엇을 얻을지 정하고 성질에 맞는 도구를 골라요. 실제 분리와 도구 조합을 시험한 뒤 생활 기술의 조건도 살펴요."
    },
    {
     "type": "field",
     "title": "나의 시작 질문",
     "hint": "나누어 얻고 싶은 물질과 궁금한 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구성 물질·서로 다른 성질·도구·얻을 물질을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "설명 장면과 가상 연습 값은 나의 실제 결과와 구별해요.",
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
   "title": "성질을 찾아 분리하고 생활에 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "학습 길",
      "함께 할 일"
     ],
     "rows": [
      [
       "혼합물과 목적",
       "섞기 전후 성질·얻을 물질 정하기"
      ],
      [
       "크기와 층",
       "체질·물과 식용유 분리·양쪽 확인"
      ],
      [
       "용해·거름·증발",
       "소금과 모래의 서로 다른 길 추적"
      ],
      [
       "실제 도구 조합",
       "설계→실제 배치/제작→시험→개선"
      ],
      [
       "생활 기술과96문항",
       "지역 조건 조사·자료 제작/공유·8유형 연습"
      ]
     ]
    },
    {
     "type": "text",
     "text": "개념과 예제에서 근거를 읽고 여러 유형으로 확인해요. 오른쪽에서 핵심·더 알아보기·내 메모를 연결해요. 자연 증발은 다음 날짜에도 이어 관찰하며 긴 보고서 대신 필요한 근거를 짧게 남길 수 있어요."
    },
    {
     "type": "field",
     "title": "교사와 준비하기",
     "hint": "안전한 도구·소량의 재료·참여 방법과 처리를 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "답을 맞힌 일과 실제 분리·제작·공유한 일은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "교사 준비 체와 안정된 장치를 써요. 학생 직접 가열·송곳 사용·실험물 맛보기는 하지 않아요.",
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
   "title": "혼합물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-01",
      "mixture-book-02"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "준비 점검 3~4",
   "title": "방법 고르기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-03",
      "mixture-book-04"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "혼합물과 분리",
   "title": "섞기 전 성질을 분리의 단서로 삼아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "mixture",
     "caption": ""
    },
    {
     "type": "text",
     "text": "혼합물은 두 가지 이상의 물질이 성질이 변하지 않고 섞여 있는 상태로 다뤄요. 마른 모래와 자갈을 섞어도 각각의 크기·모양은 분리의 단서가 돼요."
    },
    {
     "type": "example",
     "question": "국에서 건더기는 남기고 국물만 받으려면?",
     "steps": [
      [
       "목적",
       "필요한 것은 건더기를 뺀 국물이에요."
      ],
      [
       "물질의 길",
       "국물은 망을 통과해 아래 용기에 모여요."
      ],
      [
       "확인",
       "망 위와 아래를 모두 보고 필요한 쪽을 골라요."
      ]
     ],
     "answer": "무엇을 얻을지에 따라 같은 분리에서도 쓸 물질이 달라요."
    },
    {
     "type": "field",
     "title": "생활 속 분리",
     "hint": "어떤 혼합물에서 무엇을 얻고 싶은지 성질과 연결해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "혼합물→분리 목적→이용할 성질→도구→양쪽 결과를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실제 재료가 무엇인지 모르면 이름·성질을 교사 자료로 확인해요. 모르는 가루를 맛보지 않아요.",
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
   "section": "혼합물과 목적 5~6",
   "title": "혼합물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-05",
      "mixture-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "혼합물과 목적 7~8",
   "title": "분리의 목적",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-07",
      "mixture-book-08"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "혼합물과 목적 9~10",
   "title": "생활 사례",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-09",
      "mixture-book-10"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "크기와 체",
   "title": "두 알갱이 사이의 구멍을 골라요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sieve",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "구멍의 조건",
      "모형에서 예상되는 결과"
     ],
     "rows": [
      [
       "작은 알갱이보다도 작음",
       "두 종류 모두 남을 수 있음"
      ],
      [
       "작은 것보다 크고 큰 것보다 작음",
       "작은 것은 통과·큰 것은 남음"
      ],
      [
       "큰 알갱이보다도 큼",
       "두 종류 모두 통과할 수 있음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "실제 알갱이의 모양·방향·물기·막힘도 결과에 영향을 줘요. 구멍을 무조건 작게 고르지 말고 위·아래에 무엇이 모였는지 확인해요."
    },
    {
     "type": "field",
     "title": "구멍과 알갱이 비교하기",
     "hint": "위와 아래에 나뉜 재료를 구멍 크기의 근거와 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "알갱이의 크기와 체 구멍의 관계를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 크기 경계에서는 통과를 단정하지 않아요. 모양이 변하는 실제 재료와 둥근 모형도 구별해요.",
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
   "section": "체의 모형 값",
   "title": "2mm와8mm를 나눌 구멍은?",
   "blocks": [
    {
     "type": "text",
     "text": "제공된 연습 자료예요. 모양이 변하지 않는 마른 둥근 알갱이를 가정해요."
    },
    {
     "type": "table",
     "heads": [
      "대상",
      "지름"
     ],
     "rows": [
      [
       "작은 알갱이",
       "2mm"
      ],
      [
       "구멍",
       "4mm"
      ],
      [
       "큰 알갱이",
       "8mm"
      ]
     ]
    },
    {
     "type": "example",
     "question": "왜4mm 구멍이 적절할까요?",
     "steps": [
      [
       "통과",
       "2mm보다 커서 작은 알갱이가 통과해요."
      ],
      [
       "남음",
       "8mm보다 작아 큰 알갱이는 남아요."
      ]
     ],
     "answer": "2mm<4mm<8mm의 관계를 이용해요. 실제 모래의 모든 모양을 이 모형과 같게 보지는 않아요."
    },
    {
     "type": "field",
     "title": "다른 구멍과 비교",
     "hint": "1mm 또는9mm 구멍을 썼을 때와 까닭을 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "크기 사이의 관계로 통과와 남음을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림이나 사진의 눈대중 길이 대신 제시한 단위와 가정을 읽어요.",
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
   "section": "실제 체질과 재시험",
   "title": "위·아래·흘린 곳을 함께 봐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사 준비 체와 넓은 받침에 적은 양의 마른 모래·큰 자갈을 올려 천천히 체질해요.",
      "체 위·아래와 받침 밖 재료, 막힘·물기를 살펴 실제 상태를 보존해요.",
      "한 조건을 고쳐 다시 시험하고 실제 달라진 점을 비교해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "체 구멍을 비교할 때 바꿀 것",
      "가능한 같게 둘 것"
     ],
     "rows": [
      [
       "구멍 크기",
       "재료 종류·양·마른 상태·흔드는 방법"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 혼합물을 계속 체질하면 이미 일부가 빠져 처음과 다른 시료가 돼요. 체 구멍의 효과를 비교하려면 같은 양의 새 시료를 준비해요."
    },
    {
     "type": "field",
     "title": "실제 시험과 고친 근거",
     "hint": "관찰한 위/아래 재료·고친 조건·재시험 결과를 짧게 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 사용만으로 완전 분리라고 하지 않고 양쪽 결과를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모래가 날리지 않게 하고 직접 송곳으로 구멍을 내지 않아요. 남은 재료는 교사가 정한 방법으로 모아요.",
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
   "section": "크기와 체 11~12",
   "title": "체의 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-11",
      "mixture-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구멍·알갱이 크기·위와 아래의 실제 결과를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "크기와 체 13~14",
   "title": "체질 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-13",
      "mixture-book-14"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구멍·알갱이 크기·위와 아래의 실제 결과를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "크기와 체 15~16",
   "title": "체질의 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-15",
      "mixture-book-16"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구멍·알갱이 크기·위와 아래의 실제 결과를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "물과 식용유",
   "title": "충분히 둔 뒤 층과 경계를 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "oil",
     "caption": ""
    },
    {
     "type": "text",
     "text": "교사와 준비한 적은 양의 물·식용유를 안내에 따라 섞은 뒤 충분히 가만히 두어요. 이 조합에서는 골고루 섞이지 않고 두 층을 이루는 모습을 관찰할 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "관찰할 것",
      "구별할 것"
     ],
     "rows": [
      [
       "위층·아래층의 실제 상태",
       "사진의 설명과 직접 관찰"
      ],
      [
       "경계가 뚜렷한가?",
       "불분명·더 기다림·관찰하지 못함"
      ],
      [
       "실제로 둔 시간",
       "예상한 내일 결과와 실제 확인"
      ]
     ]
    },
    {
     "type": "field",
     "title": "층의 관찰",
     "hint": "실제로 본 층·경계와 불분명한 점을 짧게 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 물·식용유 사례의 층 분리를 이용해 옮겨요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모든 액체가 두 층을 이루는 것은 아니에요. 골고루 섞이지 않는 원인·밀도 계산은 필수 설명이 아니에요.",
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
   "section": "실제 층 분리",
   "title": "위층을 조금씩 옮기고 양쪽을 봐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사와 안정된 용기·스포이트·옮길 용기·폐액 용기를 준비해요.",
      "스포이트 끝을 위 기름층에 두고 조금씩 옮겨요. 경계 가까이에서는 천천히 해요.",
      "옮긴 용기와 남은 용기의 액체를 모두 보고 물방울 동반·남은 기름을 확인해요."
     ]
    },
    {
     "type": "example",
     "question": "옮긴 기름 아래에 작은 물방울이 보이면?",
     "steps": [
      [
       "관찰",
       "물 일부가 함께 옮겨졌다고 남겨요."
      ],
      [
       "확인",
       "실제 끝 위치·속도·경계를 살펴요."
      ],
      [
       "개선",
       "교사와 고쳐 재시험하며 완전 분리로 바꾸어 쓰지 않아요."
      ]
     ],
     "answer": "실패와 불분명한 결과도 다음 방법의 근거가 돼요."
    },
    {
     "type": "field",
     "title": "실제 옮김과 보완",
     "hint": "양쪽 상태·함께 온 물질·다음에 고칠 조건을 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "경계와 옮긴 액체를 함께 보고 분리 범위를 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "입으로 빨아 옮기지 않아요. 기름 섞인 물은 지정 용기에 모으며 배수구에 붓지 않아요.",
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
   "section": "층과 옮김 17~18",
   "title": "액체 혼합물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-17",
      "mixture-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·경계·옮긴 액체와 실제 관찰/예상을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "층과 옮김 19~20",
   "title": "관찰과 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-19",
      "mixture-book-20"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·경계·옮긴 액체와 실제 관찰/예상을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "층과 옮김 21~22",
   "title": "경계면 가까이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-21",
      "mixture-book-22"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·경계·옮긴 액체와 실제 관찰/예상을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소금과 모래",
   "title": "물에 녹는 성질의 차이를 이용해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "dissolve",
     "caption": ""
    },
    {
     "type": "text",
     "text": "충분한 물에 소금·모래를 넣고 저으면 소금은 물에 녹고 모래는 녹지 않고 남아요. 안 보이는 소금도 물속에 있으므로 없어진 것이 아니에요."
    },
    {
     "type": "example",
     "question": "물에 넣기만 하면 분리가 끝났을까요?",
     "steps": [
      [
       "상태",
       "모래와 소금물이 한 용기에 함께 있어요."
      ],
      [
       "다음",
       "모래를 거른 뒤 소금물의 물을 증발시켜요."
      ]
     ],
     "answer": "용해→거름→증발을 이어 각각의 고체를 얻어요."
    },
    {
     "type": "field",
     "title": "물질을 추적하기",
     "hint": "소금과 모래가 각 단계에서 어디에 있는지 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "색이 비슷해도 물에 녹는 성질이 다르면 분리에 이용할 수 있어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "생활의 다른 가루가 모두 소금·모래와 같지는 않아요. 모르는 물질은 교사와 확인해요.",
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
   "section": "충분한 용해",
   "title": "물은 무조건 적게 쓰는 게 좋을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상황",
      "다음에 확인할 것"
     ],
     "rows": [
      [
       "물이 너무 적거나 덜 저어 소금이 남음",
       "남은 알갱이가 무엇인지·용해 조건"
      ],
      [
       "소금이 충분히 녹음",
       "모래와 소금물을 거름으로 나누기"
      ],
      [
       "남은 고체를 구별하기 어려움",
       "교사와 확인하거나 제공 기록으로 참여"
      ]
     ]
    },
    {
     "type": "text",
     "text": "소금이 덜 녹으면 모래와 함께 종이에 남아 분리가 불완전해질 수 있어요. 적은 양의 재료를 쓰되 소금을 충분히 녹일 물을 준비해요. 물을 더 넣거나 방법이 달라졌다면 그 조건을 남겨요."
    },
    {
     "type": "field",
     "title": "관찰과 해석",
     "hint": "눈으로 확인한 것과 소금이 녹아 있다는 설명을 나누어 적어요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "충분한 용해가 다음 거름에서 물질을 나누는 조건이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물에 넣음·충분히 녹음·두 고체 회수 완료는 서로 다른 상태예요.",
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
   "section": "용해 차이 23~24",
   "title": "소금과 모래",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-23",
      "mixture-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물에 넣기 전후 물질의 상태와 이어 할 과정을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "용해 차이 25~26",
   "title": "물에 넣은 뒤",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-25",
      "mixture-book-26"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물에 넣기 전후 물질의 상태와 이어 할 과정을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "용해 차이 27~28",
   "title": "충분히 녹이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-27",
      "mixture-book-28"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물에 넣기 전후 물질의 상태와 이어 할 과정을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거름 장치",
   "title": "종이 위와 아래의 물질을 연결해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "filter",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "기능과 확인"
     ],
     "rows": [
      [
       "거름종이",
       "모래를 남김·찢어짐 확인"
      ],
      [
       "깔때기·고정대",
       "종이와 통로를 받침·안정된 배치"
      ],
      [
       "아래 용기",
       "통과한 소금물을 모음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사와 종이·고정·받는 용기를 점검하고 소금이 충분히 녹은 혼합물을 천천히 부어요. 종이 높이를 넘기지 않고 깔때기 끝이 받는 액체에 잠기지 않게 해요."
    },
    {
     "type": "field",
     "title": "물질의 길 설명하기",
     "hint": "종이 위와 아래의 물질이 남거나 통과한 까닭을 연결해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모래는 종이에 남고 물에 녹은 소금은 물과 함께 통과해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거름종이로 모든 녹은 물질을 제거하거나 물의 안전을 보장하는 것은 아니에요.",
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
   "section": "맑음과 거름의 한계",
   "title": "맑은 액체에 왜 소금이 있을까요?",
   "blocks": [
    {
     "type": "example",
     "question": "아래 액체가 맑으니 소금도 없어졌을까요?",
     "steps": [
      [
       "분리 전",
       "소금은 물에 녹아 있어요."
      ],
      [
       "거름 경로",
       "녹은 소금이 물과 함께 종이를 지나가요."
      ],
      [
       "다음 확인",
       "거른 소금물의 물을 안전하게 증발시켜 남은 고체를 관찰해요."
      ]
     ],
     "answer": "겉모습의 맑음·순수함·음용 안전은 같은 판단이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "아래에 모래가 보일 때",
      "점검할 근거"
     ],
     "rows": [
      [
       "종이 찢어짐",
       "찢어진 곳·구멍"
      ],
      [
       "넘침",
       "실제 부은 높이·흔적"
      ],
      [
       "바깥 틈으로 흐름",
       "종이를 지나지 않은 경로"
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 점검과 보완",
     "hint": "확인한 원인 후보·고친 부분·다시 거른 결과를 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "거름 결과는 도구 이름보다 실제 흐른 경로를 근거로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "원인을 하나로 미리 정하지 않아요. 실험물은 마시지 않고 남은 액체는 교사가 정한 방법으로 처리해요.",
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
   "section": "거름과 물질의 길 29~30",
   "title": "거름 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-29",
      "mixture-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이 위와 아래의 물질이 실제로 지나간 길을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거름과 물질의 길 31~32",
   "title": "거름 장치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-31",
      "mixture-book-32"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이 위와 아래의 물질이 실제로 지나간 길을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거름과 물질의 길 33~34",
   "title": "장치 점검",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-33",
      "mixture-book-34"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이 위와 아래의 물질이 실제로 지나간 길을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "물의 증발과 소금",
   "title": "실온에서 다른 날짜에도 이어 봐요",
   "blocks": [
    {
     "type": "diagram",
     "key": "evaporate",
     "caption": ""
    },
    {
     "type": "text",
     "text": "거른 소금물을 교사와 얕은 접시에 놓고 실제 날짜·시각별 상태를 관찰해요. 물은 공기 중으로 이동하고 소금이 접시에 남을 수 있어요. 사진의 두 상태만으로 경과 시간이나 회수량을 정하지 않아요."
    },
    {
     "type": "list",
     "items": [
      "안전한 장소·이름표·관찰 방법과 남은 물질 처리를 교사와 정해요.",
      "실온에서 실제로 본 액체·고체 상태를 짧게 적고 다음 날짜에도 이어 봐요.",
      "아직 액체가 남았거나 관찰하지 못했으면 대기·미확인으로 남겨요."
     ]
    },
    {
     "type": "field",
     "title": "이어 볼 방법",
     "hint": "다음 날짜의 관찰 방법과 확인하지 못한 상태를 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증발은 액체의 표면에서 기체로 변하는 현상이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "학생은 직접 불을 켜거나 뜨거운 기구를 만지지 않아요. 가열은 교사 시범으로만 살피고 남은 고체는 맛보지 않아요.",
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
   "section": "여러 날짜의 관찰",
   "title": "처음 본 때와 생긴 때는 같을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "연습 기록",
      "확인할 수 있는 범위"
     ],
     "rows": [
      [
       "월요일",
       "소금물을 놓음"
      ],
      [
       "화·수요일",
       "관찰하지 않음"
      ],
      [
       "목요일",
       "흰 고체를 처음 확인함"
      ]
     ]
    },
    {
     "type": "example",
     "question": "흰 고체는 정확히 언제 생겼을까요?",
     "steps": [
      [
       "확인한 때",
       "목요일에 처음 보았어요."
      ],
      [
       "미확인",
       "중간 상태를 보지 않아 정확히 언제 생기기 시작했는지는 몰라요."
      ]
     ],
     "answer": "못 본 날을 상상으로 채우지 않고 실제 확인한 범위만 말해요."
    },
    {
     "type": "field",
     "title": "나의 관찰과 다음 확인",
     "hint": "실제 날짜별 상태와 관찰하지 못한 날을 나누어 남겨요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관찰한 날·처음 확인한 때·생성 시작 시각을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "수업 시간에 놓은 접시를 다음 날짜에도 이어 보는 계획을 정해요. 대기 중을 회수 완료로 바꾸지 않아요.",
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
   "section": "회수량과 장치의 범위",
   "title": "덜 얻었다고 소금이 사라졌을까요?",
   "blocks": [
    {
     "type": "text",
     "text": "제공된 연습 자료예요. 처음 소금5g을 넣고 말려 회수한 소금은4g이에요."
    },
    {
     "type": "example",
     "question": "1g 적게 얻은 까닭을 바로 알 수 있을까요?",
     "steps": [
      [
       "차이",
       "5−4=1g 적게 얻었어요."
      ],
      [
       "확인",
       "흘림·종이/용기 잔류·건조·측정 조건을 더 살펴요."
      ]
     ],
     "answer": "차이만으로 소금이 물로 변했거나 소멸했다고 하지 않아요."
    },
    {
     "type": "text",
     "text": "열린 접시에서는 소금을 얻지만 물은 공기 중으로 이동해요. 액체 물까지 따로 모으는 장치를 쓰지 않았다면 둘을 각각 모았다고 할 수 없어요."
    },
    {
     "type": "field",
     "title": "회수량 설명",
     "hint": "측정 범위와 더 확인할 원인·방법을 하나 연결해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 넣은 질량·마른 회수량·물기가 남은 질량을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물을 액체로 모으는 별도 장치는 더 알아볼 수 있지만 증류의 세부 조작은 필수 과제가 아니에요.",
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
   "section": "증발과 확인 범위 35~36",
   "title": "증발",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-35",
      "mixture-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물질이 간 곳·실제 날짜·확인 범위와 장치를 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "증발과 확인 범위 37~38",
   "title": "시간의 기록",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-37",
      "mixture-book-38"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물질이 간 곳·실제 날짜·확인 범위와 장치를 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "증발과 확인 범위 39~40",
   "title": "남은 고체 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-39",
      "mixture-book-40"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물질이 간 곳·실제 날짜·확인 범위와 장치를 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "도구 조합 설계",
   "title": "자갈·모래·소금의 길을 나누어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "단계",
      "분리할 물질·이용할 성질",
      "다음 물질"
     ],
     "rows": [
      [
       "체질",
       "큰 자갈·알갱이 크기",
       "작은 모래와 소금"
      ],
      [
       "물에 충분히 녹이기",
       "소금과 모래의 용해 차이",
       "소금물과 모래"
      ],
      [
       "거름",
       "녹지 않은 모래를 종이에 남김",
       "아래 소금물"
      ],
      [
       "물 증발",
       "접시에 소금 남김",
       "공기 중으로 이동한 물"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사 준비 체·받침·거름 장치·이름표·용기를 조합해 각 물질을 얻는 경로를 설계해요. 설계 그림에서 끝내지 않고 실제 배치를 만들고 시험해요."
    },
    {
     "type": "field",
     "title": "설계의 근거",
     "hint": "각 도구가 필요한 성질과 얻을 물질을 연결해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "순서를 외우기보다 각 단계의 물질이 간 곳을 추적해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모래를 거르지 않고 먼저 증발시키면 소금과 함께 남아 다시 섞일 수 있어요.",
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
   "section": "실제 조합·시험·개선",
   "title": "만든 배치로 조금씩 시험해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "체와 받침·거름 장치·받는 용기를 실제로 배치하고 교사와 안정성을 확인해요.",
      "이름표를 붙인 용기로 재료를 옮기며 각 단계의 위/아래 물질을 살펴요.",
      "막힘·흘림·불안정한 부분을 실제로 고쳐 다시 시험해요. 소금물은 다음 날짜의 증발 관찰로 이어요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "실제 문제의 예",
      "바꿀 조건",
      "재시험에서 볼 것"
     ],
     "rows": [
      [
       "한꺼번에 많이 올려 막힘",
       "같은 체에 올리는 양",
       "위/아래 분리 상태"
      ],
      [
       "받는 용기가 흔들림",
       "교사와 배치/고정 보완",
       "안정성·흘림·흐른 길"
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 시험에서 고친 점",
     "hint": "관찰 근거와 실제 수정·재시험을 연결해요. 미실행은 계획으로 남겨요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부품 배치·실제 시험·수정·재시험은 각각 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 번에 여러 조건을 바꾸면 어느 하나 때문이라고 단정하지 않아요. 직접 송곳·불꽃을 사용하는 제작은 하지 않아요.",
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
   "section": "지속가능한 분리 기술",
   "title": "교실 거름과 정수장 전체를 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "technology",
     "caption": ""
    },
    {
     "type": "text",
     "text": "분리 기술은 필요한 자원을 얻거나 원치 않는 물질을 줄이는 데 쓰여요. 실제 시설에는 여러 처리·검사·유지관리가 있으며 교실 모형의 거름 하나가 모든 기능을 구현하지는 않아요."
    },
    {
     "type": "table",
     "heads": [
      "실제 기관 자료",
      "본문에서 읽은 내용"
     ],
     "rows": [
      [
       "K-water 동화정수장 안내",
       "섞고 뭉치게 하기·가라앉히기·여과·소독 등 여러 처리"
      ],
      [
       "서울아리수본부 검사 안내",
       "시료의 수질 검사·결과 분석/공표"
      ]
     ]
    },
    {
     "type": "field",
     "title": "기능과 검사를 구별하기",
     "hint": "교실 모형에서 확인한 범위와 실제 시설에서 더 확인할 일을 나누어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 대상·이용한 성질·처리 기능·검사를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "설명 장면은 특정 정수장의 실제 사진/정확한 배치도가 아니에요. 현재 수질과 성능은 사진으로 정하지 않아요.",
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
   "section": "경제·사회·지역 조건",
   "title": "어디에서 오래 쓸 장치인가요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "지역과 사용자의 조건",
      "조사할 질문"
     ],
     "rows": [
      [
       "처리 대상과 필요한 양",
       "무엇을 어느 수준까지 분리할까?"
      ],
      [
       "전력·부품·경제 여건",
       "작동·설치/교체·지속 공급은 가능한가?"
      ],
      [
       "관리 인력과 사용 방법",
       "누가 청소·점검 방법을 익히고 맡을까?"
      ],
      [
       "남는 물질 처리",
       "걸러 낸 찌꺼기·폐액은 어떻게 관리할까?"
      ]
     ]
    },
    {
     "type": "example",
     "question": "전력이 불안정한 지역에 전기 장치를 권하려면?",
     "steps": [
      [
       "근거",
       "대상 물질·성능과 전력·부품·현지 관리 조건을 함께 확인해요."
      ],
      [
       "한계",
       "자료에서 확인한 조건과 아직 모르는 것을 나누어요."
      ]
     ],
     "answer": "전기를 쓰거나 쓰지 않는다는 사실만으로 효과와 안전을 보장하지 않아요."
    },
    {
     "type": "field",
     "title": "지역에 맞는 조사 질문",
     "hint": "비교할 장치와 실제로 더 확인할 조건을 정해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "성능 이름만 보고 모든 지역에 같은 장치를 권하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "경제·사회·지역의 맥락을 근거로 기술의 기여와 한계를 설명해요.",
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
   "section": "조사 자료 제작·공유",
   "title": "근거를 넣어 만들고 질문으로 고쳐요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "소개할 내용",
      "함께 넣을 근거"
     ],
     "rows": [
      [
       "혼합물·목적·성질",
       "어떤 물질을 어디로 나누는가?"
      ],
      [
       "기여·조건·한계",
       "읽은 본문과 확인할 범위"
      ],
      [
       "사진·자료 출처",
       "제공처·제목·주소·확인 날짜"
      ],
      [
       "새 제안·실제 공유",
       "예상과 사실·제작과 전달을 구별"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "종이 카드나 디지털 자료를 실제로 만들어 짝·모둠 또는 교사가 정한 학급 공간에서 보여 줘요.",
      "질문을 듣고 물질 이름·과정·까닭과 출처 위치를 보완해요.",
      "아직 전달하지 못하거나 의견을 못 받았다면 그대로 두고 다음 기회를 정해요."
     ]
    },
    {
     "type": "field",
     "title": "받은 질문과 고친 근거",
     "hint": "실제 의견·수정과 앞으로 할 계획을 나누어 짧게 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료 저장·실제 전달·질문을 이용한 수정은 다른 행동이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "설명 사진이나 가상 값을 내가 수행한 결과로 바꾸지 않아요. 실제 수치는 예상에 맞춰 고치지 않아요.",
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
   "section": "기술과 지역 사용 조건 41~42",
   "title": "기술과 조사",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-41",
      "mixture-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지역의 사용 조건·자료 근거·공유 상태를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "기술과 지역 사용 조건 43~44",
   "title": "기술의 여러 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-43",
      "mixture-book-44"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지역의 사용 조건·자료 근거·공유 상태를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "기술과 지역 사용 조건 45~46",
   "title": "제안의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-45",
      "mixture-book-46"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지역의 사용 조건·자료 근거·공유 상태를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 47~48",
   "title": "크기 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-47",
      "mixture-book-48"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 49~50",
   "title": "공정 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-49",
      "mixture-book-50"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 51~52",
   "title": "거름 후 예측",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-51",
      "mixture-book-52"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 53~54",
   "title": "손실 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-53",
      "mixture-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 55~56",
   "title": "정수 자료 읽기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-55",
      "mixture-book-56"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 57",
   "title": "흐름 나타내기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-57"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 58",
   "title": "결과와 소통",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-58"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "한눈에 정리",
   "title": "성질 → 도구 → 물질의 길 → 사용 조건",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배운 내용",
      "다시 볼 근거"
     ],
     "rows": [
      [
       "혼합물·분리 목적",
       "구성 물질·얻을 물질·유지된 성질"
      ],
      [
       "크기와 층 분리",
       "구멍/알갱이·층/경계·양쪽 상태"
      ],
      [
       "용해·거름·증발",
       "모래·소금물·소금·공기 중 물"
      ],
      [
       "도구 조합·생활 기술",
       "실제 시험/개선·지역 조건·조사/공유"
      ]
     ]
    },
    {
     "type": "field",
     "title": "핵심 설명 한 문장",
     "hint": "성질과 분리 방법을 물질의 길에 연결해 설명해요.",
     "lines": 9,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 도구를 썼다는 것과 실제로 잘 나뉘었다는 근거를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "정답 수·기록 입력만으로 실제 제작·소통이나 공식 성적을 확정하지 않아요.",
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
   "section": "빈칸 핵심 정리 59~64",
   "title": "혼합과 분리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-59",
      "mixture-book-60",
      "mixture-book-61",
      "mixture-book-62",
      "mixture-book-63",
      "mixture-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈칸 앞뒤 문맥에 맞는 과학 용어를 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 65~66",
   "title": "혼합물 판단",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-65",
      "mixture-book-66"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 67~68",
   "title": "분리 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-67",
      "mixture-book-68"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 69~70",
   "title": "액체 분리 판단",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-69",
      "mixture-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 71~72",
   "title": "기름 활동 기록",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-71",
      "mixture-book-72"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 73~74",
   "title": "소금 용해",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-73",
      "mixture-book-74"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 75~76",
   "title": "단계와 목적",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-75",
      "mixture-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 77~78",
   "title": "거름종이 통과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-77",
      "mixture-book-78"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 79~80",
   "title": "거름 실패 점검",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-79",
      "mixture-book-80"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 81~82",
   "title": "증발 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-81",
      "mixture-book-82"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 83",
   "title": "물질 흐름 평가",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-83"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 84~85",
   "title": "완전 회수 주장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-84",
      "mixture-book-85"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 86~87",
   "title": "조사와 공유 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-86",
      "mixture-book-87"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 88",
   "title": "제안과 근거 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-88"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 89~90",
   "title": "구멍 다시 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-89",
      "mixture-book-90"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 91~92",
   "title": "실제 날짜",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-91",
      "mixture-book-92"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 93~94",
   "title": "방법 다시 묶기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-93",
      "mixture-book-94"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 95~96",
   "title": "설명 수정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-95",
      "mixture-book-96"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
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
     "title": "분리의 까닭 설명하기",
     "hint": "이용한 성질·물질의 이동·자료/실험의 한계 중 필요한 것을 넣어요.",
     "lines": 9,
     "draw": false
    },
    {
     "type": "field",
     "title": "다음 실제 활동",
     "hint": "더 확인할 조건이나 증발 대기·재시험·공유 계획을 정해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 생각이 같아도 근거를 밝히면 의미 있는 설명이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "하지 않은 실험·못 본 시점·미공유를 완료한 일로 바꾸지 않아요.",
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
     "text": "교육부 2022 개정 과학과 교육과정 [6과05-01~03] 본문·해설·적용 고려 사항을 바탕으로 세 분리 탐구와 지속가능한 장치 조사/공유를 연결했어요. 지필드 이론3-2-2 4/14/15쪽·실험3-E19/27/28/32쪽 본문을 대조했어요."
    },
    {
     "type": "heading",
     "text": "자료를 읽고 질문으로 보완하기"
    },
    {
     "type": "text",
     "text": "2009 초등학교 과학탐구토론 지도자료27쪽의 발표/질문/개선 원칙을 참고했어요. 혼합물 전용 실험 절차의 출처로 삼지는 않았어요. K-water 동화정수장 견학안내의 처리 방식과 서울아리수본부 수돗물 수질검사결과 안내의 검사/공표 설명을 확인했어요."
    },
    {
     "type": "heading",
     "text": "사진·수치·문항의 구분"
    },
    {
     "type": "text",
     "text": "승인된 설명 사진7개와 기존96문항을 재사용했어요. 문항의 발문·보기·자료·답·풀이·오개념을 보존하고 문항별 기준과 쓸 공간을 보강했어요. 연습 수치는 실제 측정값이 아니며 현행 단원평가 원문 세트는 확보 대기 중이에요."
    },
    {
     "type": "field",
     "title": "다시 볼 자료와 질문",
     "hint": "문항 번호와 필요한 개념·출처·다음 확인 방법을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료 제목·제공처·본문 범위와 실제 확인 날짜를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옛5-2Ⅰ 재미있는 나의 탐구(s52-u01)는 다른 주제예요. 이 현행 단원의 원문 시험지로 대신하지 않아요.",
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
   "title": "혼합물의 분리",
   "blocks": [
    {
     "type": "diagram",
     "key": "mixture",
     "caption": "섞인 재료의 성질을 살피는 설명 장면이에요. 사진 속 크기·개수를 측정값으로 쓰지 않아요."
    },
    {
     "type": "text",
     "text": "작은 모래와 큰 자갈, 물과 식용유, 소금과 모래는 같은 방법으로 나눌 수 있을까요? 무엇을 얻을지 정하고 성질에 맞는 도구를 골라요. 실제 분리와 도구 조합을 시험한 뒤 생활 기술의 조건도 살펴요."
    },
    {
     "type": "field",
     "title": "나의 시작 질문",
     "hint": "나누어 얻고 싶은 물질과 궁금한 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구성 물질·서로 다른 성질·도구·얻을 물질을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "설명 장면과 가상 연습 값은 나의 실제 결과와 구별해요.",
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
   "title": "성질을 찾아 분리하고 생활에 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "학습 길",
      "함께 할 일"
     ],
     "rows": [
      [
       "혼합물과 목적",
       "섞기 전후 성질·얻을 물질 정하기"
      ],
      [
       "크기와 층",
       "체질·물과 식용유 분리·양쪽 확인"
      ],
      [
       "용해·거름·증발",
       "소금과 모래의 서로 다른 길 추적"
      ],
      [
       "실제 도구 조합",
       "설계→실제 배치/제작→시험→개선"
      ],
      [
       "생활 기술과96문항",
       "지역 조건 조사·자료 제작/공유·8유형 연습"
      ]
     ]
    },
    {
     "type": "text",
     "text": "개념과 예제에서 근거를 읽고 여러 유형으로 확인해요. 오른쪽에서 핵심·더 알아보기·내 메모를 연결해요. 자연 증발은 다음 날짜에도 이어 관찰하며 긴 보고서 대신 필요한 근거를 짧게 남길 수 있어요."
    },
    {
     "type": "field",
     "title": "교사와 준비하기",
     "hint": "안전한 도구·소량의 재료·참여 방법과 처리를 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "답을 맞힌 일과 실제 분리·제작·공유한 일은 따로 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "교사 준비 체와 안정된 장치를 써요. 학생 직접 가열·송곳 사용·실험물 맛보기는 하지 않아요.",
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
   "title": "혼합물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-01",
      "mixture-book-02"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "준비 점검 3~4",
   "title": "방법 고르기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-03",
      "mixture-book-04"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "혼합물과 분리",
   "title": "섞기 전 성질을 분리의 단서로 삼아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "mixture",
     "caption": ""
    },
    {
     "type": "text",
     "text": "혼합물은 두 가지 이상의 물질이 성질이 변하지 않고 섞여 있는 상태로 다뤄요. 마른 모래와 자갈을 섞어도 각각의 크기·모양은 분리의 단서가 돼요."
    },
    {
     "type": "example",
     "question": "국에서 건더기는 남기고 국물만 받으려면?",
     "steps": [
      [
       "목적",
       "필요한 것은 건더기를 뺀 국물이에요."
      ],
      [
       "물질의 길",
       "국물은 망을 통과해 아래 용기에 모여요."
      ],
      [
       "확인",
       "망 위와 아래를 모두 보고 필요한 쪽을 골라요."
      ]
     ],
     "answer": "무엇을 얻을지에 따라 같은 분리에서도 쓸 물질이 달라요."
    },
    {
     "type": "field",
     "title": "생활 속 분리",
     "hint": "어떤 혼합물에서 무엇을 얻고 싶은지 성질과 연결해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "혼합물→분리 목적→이용할 성질→도구→양쪽 결과를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실제 재료가 무엇인지 모르면 이름·성질을 교사 자료로 확인해요. 모르는 가루를 맛보지 않아요.",
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
   "section": "혼합물과 목적 5~6",
   "title": "혼합물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-05",
      "mixture-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "혼합물과 목적 7~8",
   "title": "분리의 목적",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-07",
      "mixture-book-08"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "혼합물과 목적 9~10",
   "title": "생활 사례",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-09",
      "mixture-book-10"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 목적·구성 물질의 성질과 도구를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "크기와 체",
   "title": "두 알갱이 사이의 구멍을 골라요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sieve",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "구멍의 조건",
      "모형에서 예상되는 결과"
     ],
     "rows": [
      [
       "작은 알갱이보다도 작음",
       "두 종류 모두 남을 수 있음"
      ],
      [
       "작은 것보다 크고 큰 것보다 작음",
       "작은 것은 통과·큰 것은 남음"
      ],
      [
       "큰 알갱이보다도 큼",
       "두 종류 모두 통과할 수 있음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "실제 알갱이의 모양·방향·물기·막힘도 결과에 영향을 줘요. 구멍을 무조건 작게 고르지 말고 위·아래에 무엇이 모였는지 확인해요."
    },
    {
     "type": "field",
     "title": "구멍과 알갱이 비교하기",
     "hint": "위와 아래에 나뉜 재료를 구멍 크기의 근거와 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "알갱이의 크기와 체 구멍의 관계를 비교해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "같은 크기 경계에서는 통과를 단정하지 않아요. 모양이 변하는 실제 재료와 둥근 모형도 구별해요.",
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
   "section": "체의 모형 값",
   "title": "2mm와8mm를 나눌 구멍은?",
   "blocks": [
    {
     "type": "text",
     "text": "제공된 연습 자료예요. 모양이 변하지 않는 마른 둥근 알갱이를 가정해요."
    },
    {
     "type": "table",
     "heads": [
      "대상",
      "지름"
     ],
     "rows": [
      [
       "작은 알갱이",
       "2mm"
      ],
      [
       "구멍",
       "4mm"
      ],
      [
       "큰 알갱이",
       "8mm"
      ]
     ]
    },
    {
     "type": "example",
     "question": "왜4mm 구멍이 적절할까요?",
     "steps": [
      [
       "통과",
       "2mm보다 커서 작은 알갱이가 통과해요."
      ],
      [
       "남음",
       "8mm보다 작아 큰 알갱이는 남아요."
      ]
     ],
     "answer": "2mm<4mm<8mm의 관계를 이용해요. 실제 모래의 모든 모양을 이 모형과 같게 보지는 않아요."
    },
    {
     "type": "field",
     "title": "다른 구멍과 비교",
     "hint": "1mm 또는9mm 구멍을 썼을 때와 까닭을 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "크기 사이의 관계로 통과와 남음을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "그림이나 사진의 눈대중 길이 대신 제시한 단위와 가정을 읽어요.",
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
   "section": "실제 체질과 재시험",
   "title": "위·아래·흘린 곳을 함께 봐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사 준비 체와 넓은 받침에 적은 양의 마른 모래·큰 자갈을 올려 천천히 체질해요.",
      "체 위·아래와 받침 밖 재료, 막힘·물기를 살펴 실제 상태를 보존해요.",
      "한 조건을 고쳐 다시 시험하고 실제 달라진 점을 비교해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "체 구멍을 비교할 때 바꿀 것",
      "가능한 같게 둘 것"
     ],
     "rows": [
      [
       "구멍 크기",
       "재료 종류·양·마른 상태·흔드는 방법"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 혼합물을 계속 체질하면 이미 일부가 빠져 처음과 다른 시료가 돼요. 체 구멍의 효과를 비교하려면 같은 양의 새 시료를 준비해요."
    },
    {
     "type": "field",
     "title": "실제 시험과 고친 근거",
     "hint": "관찰한 위/아래 재료·고친 조건·재시험 결과를 짧게 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 사용만으로 완전 분리라고 하지 않고 양쪽 결과를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모래가 날리지 않게 하고 직접 송곳으로 구멍을 내지 않아요. 남은 재료는 교사가 정한 방법으로 모아요.",
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
   "section": "크기와 체 11~12",
   "title": "체의 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-11",
      "mixture-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구멍·알갱이 크기·위와 아래의 실제 결과를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "크기와 체 13~14",
   "title": "체질 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-13",
      "mixture-book-14"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구멍·알갱이 크기·위와 아래의 실제 결과를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "크기와 체 15~16",
   "title": "체질의 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-15",
      "mixture-book-16"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구멍·알갱이 크기·위와 아래의 실제 결과를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "물과 식용유",
   "title": "충분히 둔 뒤 층과 경계를 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "oil",
     "caption": ""
    },
    {
     "type": "text",
     "text": "교사와 준비한 적은 양의 물·식용유를 안내에 따라 섞은 뒤 충분히 가만히 두어요. 이 조합에서는 골고루 섞이지 않고 두 층을 이루는 모습을 관찰할 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "관찰할 것",
      "구별할 것"
     ],
     "rows": [
      [
       "위층·아래층의 실제 상태",
       "사진의 설명과 직접 관찰"
      ],
      [
       "경계가 뚜렷한가?",
       "불분명·더 기다림·관찰하지 못함"
      ],
      [
       "실제로 둔 시간",
       "예상한 내일 결과와 실제 확인"
      ]
     ]
    },
    {
     "type": "field",
     "title": "층의 관찰",
     "hint": "실제로 본 층·경계와 불분명한 점을 짧게 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 물·식용유 사례의 층 분리를 이용해 옮겨요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모든 액체가 두 층을 이루는 것은 아니에요. 골고루 섞이지 않는 원인·밀도 계산은 필수 설명이 아니에요.",
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
   "section": "실제 층 분리",
   "title": "위층을 조금씩 옮기고 양쪽을 봐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사와 안정된 용기·스포이트·옮길 용기·폐액 용기를 준비해요.",
      "스포이트 끝을 위 기름층에 두고 조금씩 옮겨요. 경계 가까이에서는 천천히 해요.",
      "옮긴 용기와 남은 용기의 액체를 모두 보고 물방울 동반·남은 기름을 확인해요."
     ]
    },
    {
     "type": "example",
     "question": "옮긴 기름 아래에 작은 물방울이 보이면?",
     "steps": [
      [
       "관찰",
       "물 일부가 함께 옮겨졌다고 남겨요."
      ],
      [
       "확인",
       "실제 끝 위치·속도·경계를 살펴요."
      ],
      [
       "개선",
       "교사와 고쳐 재시험하며 완전 분리로 바꾸어 쓰지 않아요."
      ]
     ],
     "answer": "실패와 불분명한 결과도 다음 방법의 근거가 돼요."
    },
    {
     "type": "field",
     "title": "실제 옮김과 보완",
     "hint": "양쪽 상태·함께 온 물질·다음에 고칠 조건을 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "경계와 옮긴 액체를 함께 보고 분리 범위를 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "입으로 빨아 옮기지 않아요. 기름 섞인 물은 지정 용기에 모으며 배수구에 붓지 않아요.",
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
   "section": "층과 옮김 17~18",
   "title": "액체 혼합물",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-17",
      "mixture-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·경계·옮긴 액체와 실제 관찰/예상을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "층과 옮김 19~20",
   "title": "관찰과 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-19",
      "mixture-book-20"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·경계·옮긴 액체와 실제 관찰/예상을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "층과 옮김 21~22",
   "title": "경계면 가까이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-21",
      "mixture-book-22"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·경계·옮긴 액체와 실제 관찰/예상을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "소금과 모래",
   "title": "물에 녹는 성질의 차이를 이용해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "dissolve",
     "caption": ""
    },
    {
     "type": "text",
     "text": "충분한 물에 소금·모래를 넣고 저으면 소금은 물에 녹고 모래는 녹지 않고 남아요. 안 보이는 소금도 물속에 있으므로 없어진 것이 아니에요."
    },
    {
     "type": "example",
     "question": "물에 넣기만 하면 분리가 끝났을까요?",
     "steps": [
      [
       "상태",
       "모래와 소금물이 한 용기에 함께 있어요."
      ],
      [
       "다음",
       "모래를 거른 뒤 소금물의 물을 증발시켜요."
      ]
     ],
     "answer": "용해→거름→증발을 이어 각각의 고체를 얻어요."
    },
    {
     "type": "field",
     "title": "물질을 추적하기",
     "hint": "소금과 모래가 각 단계에서 어디에 있는지 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "색이 비슷해도 물에 녹는 성질이 다르면 분리에 이용할 수 있어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "생활의 다른 가루가 모두 소금·모래와 같지는 않아요. 모르는 물질은 교사와 확인해요.",
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
   "section": "충분한 용해",
   "title": "물은 무조건 적게 쓰는 게 좋을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상황",
      "다음에 확인할 것"
     ],
     "rows": [
      [
       "물이 너무 적거나 덜 저어 소금이 남음",
       "남은 알갱이가 무엇인지·용해 조건"
      ],
      [
       "소금이 충분히 녹음",
       "모래와 소금물을 거름으로 나누기"
      ],
      [
       "남은 고체를 구별하기 어려움",
       "교사와 확인하거나 제공 기록으로 참여"
      ]
     ]
    },
    {
     "type": "text",
     "text": "소금이 덜 녹으면 모래와 함께 종이에 남아 분리가 불완전해질 수 있어요. 적은 양의 재료를 쓰되 소금을 충분히 녹일 물을 준비해요. 물을 더 넣거나 방법이 달라졌다면 그 조건을 남겨요."
    },
    {
     "type": "field",
     "title": "관찰과 해석",
     "hint": "눈으로 확인한 것과 소금이 녹아 있다는 설명을 나누어 적어요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "충분한 용해가 다음 거름에서 물질을 나누는 조건이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물에 넣음·충분히 녹음·두 고체 회수 완료는 서로 다른 상태예요.",
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
   "section": "용해 차이 23~24",
   "title": "소금과 모래",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-23",
      "mixture-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물에 넣기 전후 물질의 상태와 이어 할 과정을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "용해 차이 25~26",
   "title": "물에 넣은 뒤",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-25",
      "mixture-book-26"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물에 넣기 전후 물질의 상태와 이어 할 과정을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "용해 차이 27~28",
   "title": "충분히 녹이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-27",
      "mixture-book-28"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물에 넣기 전후 물질의 상태와 이어 할 과정을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거름 장치",
   "title": "종이 위와 아래의 물질을 연결해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "filter",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "기능과 확인"
     ],
     "rows": [
      [
       "거름종이",
       "모래를 남김·찢어짐 확인"
      ],
      [
       "깔때기·고정대",
       "종이와 통로를 받침·안정된 배치"
      ],
      [
       "아래 용기",
       "통과한 소금물을 모음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사와 종이·고정·받는 용기를 점검하고 소금이 충분히 녹은 혼합물을 천천히 부어요. 종이 높이를 넘기지 않고 깔때기 끝이 받는 액체에 잠기지 않게 해요."
    },
    {
     "type": "field",
     "title": "물질의 길 설명하기",
     "hint": "종이 위와 아래의 물질이 남거나 통과한 까닭을 연결해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모래는 종이에 남고 물에 녹은 소금은 물과 함께 통과해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거름종이로 모든 녹은 물질을 제거하거나 물의 안전을 보장하는 것은 아니에요.",
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
   "section": "맑음과 거름의 한계",
   "title": "맑은 액체에 왜 소금이 있을까요?",
   "blocks": [
    {
     "type": "example",
     "question": "아래 액체가 맑으니 소금도 없어졌을까요?",
     "steps": [
      [
       "분리 전",
       "소금은 물에 녹아 있어요."
      ],
      [
       "거름 경로",
       "녹은 소금이 물과 함께 종이를 지나가요."
      ],
      [
       "다음 확인",
       "거른 소금물의 물을 안전하게 증발시켜 남은 고체를 관찰해요."
      ]
     ],
     "answer": "겉모습의 맑음·순수함·음용 안전은 같은 판단이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "아래에 모래가 보일 때",
      "점검할 근거"
     ],
     "rows": [
      [
       "종이 찢어짐",
       "찢어진 곳·구멍"
      ],
      [
       "넘침",
       "실제 부은 높이·흔적"
      ],
      [
       "바깥 틈으로 흐름",
       "종이를 지나지 않은 경로"
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 점검과 보완",
     "hint": "확인한 원인 후보·고친 부분·다시 거른 결과를 적어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "거름 결과는 도구 이름보다 실제 흐른 경로를 근거로 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "원인을 하나로 미리 정하지 않아요. 실험물은 마시지 않고 남은 액체는 교사가 정한 방법으로 처리해요.",
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
   "section": "거름과 물질의 길 29~30",
   "title": "거름 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-29",
      "mixture-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이 위와 아래의 물질이 실제로 지나간 길을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거름과 물질의 길 31~32",
   "title": "거름 장치",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-31",
      "mixture-book-32"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이 위와 아래의 물질이 실제로 지나간 길을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거름과 물질의 길 33~34",
   "title": "장치 점검",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-33",
      "mixture-book-34"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이 위와 아래의 물질이 실제로 지나간 길을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "물의 증발과 소금",
   "title": "실온에서 다른 날짜에도 이어 봐요",
   "blocks": [
    {
     "type": "diagram",
     "key": "evaporate",
     "caption": ""
    },
    {
     "type": "text",
     "text": "거른 소금물을 교사와 얕은 접시에 놓고 실제 날짜·시각별 상태를 관찰해요. 물은 공기 중으로 이동하고 소금이 접시에 남을 수 있어요. 사진의 두 상태만으로 경과 시간이나 회수량을 정하지 않아요."
    },
    {
     "type": "list",
     "items": [
      "안전한 장소·이름표·관찰 방법과 남은 물질 처리를 교사와 정해요.",
      "실온에서 실제로 본 액체·고체 상태를 짧게 적고 다음 날짜에도 이어 봐요.",
      "아직 액체가 남았거나 관찰하지 못했으면 대기·미확인으로 남겨요."
     ]
    },
    {
     "type": "field",
     "title": "이어 볼 방법",
     "hint": "다음 날짜의 관찰 방법과 확인하지 못한 상태를 구별해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "증발은 액체의 표면에서 기체로 변하는 현상이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "학생은 직접 불을 켜거나 뜨거운 기구를 만지지 않아요. 가열은 교사 시범으로만 살피고 남은 고체는 맛보지 않아요.",
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
   "section": "여러 날짜의 관찰",
   "title": "처음 본 때와 생긴 때는 같을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "연습 기록",
      "확인할 수 있는 범위"
     ],
     "rows": [
      [
       "월요일",
       "소금물을 놓음"
      ],
      [
       "화·수요일",
       "관찰하지 않음"
      ],
      [
       "목요일",
       "흰 고체를 처음 확인함"
      ]
     ]
    },
    {
     "type": "example",
     "question": "흰 고체는 정확히 언제 생겼을까요?",
     "steps": [
      [
       "확인한 때",
       "목요일에 처음 보았어요."
      ],
      [
       "미확인",
       "중간 상태를 보지 않아 정확히 언제 생기기 시작했는지는 몰라요."
      ]
     ],
     "answer": "못 본 날을 상상으로 채우지 않고 실제 확인한 범위만 말해요."
    },
    {
     "type": "field",
     "title": "나의 관찰과 다음 확인",
     "hint": "실제 날짜별 상태와 관찰하지 못한 날을 나누어 남겨요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관찰한 날·처음 확인한 때·생성 시작 시각을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "수업 시간에 놓은 접시를 다음 날짜에도 이어 보는 계획을 정해요. 대기 중을 회수 완료로 바꾸지 않아요.",
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
   "section": "회수량과 장치의 범위",
   "title": "덜 얻었다고 소금이 사라졌을까요?",
   "blocks": [
    {
     "type": "text",
     "text": "제공된 연습 자료예요. 처음 소금5g을 넣고 말려 회수한 소금은4g이에요."
    },
    {
     "type": "example",
     "question": "1g 적게 얻은 까닭을 바로 알 수 있을까요?",
     "steps": [
      [
       "차이",
       "5−4=1g 적게 얻었어요."
      ],
      [
       "확인",
       "흘림·종이/용기 잔류·건조·측정 조건을 더 살펴요."
      ]
     ],
     "answer": "차이만으로 소금이 물로 변했거나 소멸했다고 하지 않아요."
    },
    {
     "type": "text",
     "text": "열린 접시에서는 소금을 얻지만 물은 공기 중으로 이동해요. 액체 물까지 따로 모으는 장치를 쓰지 않았다면 둘을 각각 모았다고 할 수 없어요."
    },
    {
     "type": "field",
     "title": "회수량 설명",
     "hint": "측정 범위와 더 확인할 원인·방법을 하나 연결해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 넣은 질량·마른 회수량·물기가 남은 질량을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물을 액체로 모으는 별도 장치는 더 알아볼 수 있지만 증류의 세부 조작은 필수 과제가 아니에요.",
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
   "section": "증발과 확인 범위 35~36",
   "title": "증발",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-35",
      "mixture-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물질이 간 곳·실제 날짜·확인 범위와 장치를 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "증발과 확인 범위 37~38",
   "title": "시간의 기록",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-37",
      "mixture-book-38"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물질이 간 곳·실제 날짜·확인 범위와 장치를 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "증발과 확인 범위 39~40",
   "title": "남은 고체 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-39",
      "mixture-book-40"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물질이 간 곳·실제 날짜·확인 범위와 장치를 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "도구 조합 설계",
   "title": "자갈·모래·소금의 길을 나누어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "단계",
      "분리할 물질·이용할 성질",
      "다음 물질"
     ],
     "rows": [
      [
       "체질",
       "큰 자갈·알갱이 크기",
       "작은 모래와 소금"
      ],
      [
       "물에 충분히 녹이기",
       "소금과 모래의 용해 차이",
       "소금물과 모래"
      ],
      [
       "거름",
       "녹지 않은 모래를 종이에 남김",
       "아래 소금물"
      ],
      [
       "물 증발",
       "접시에 소금 남김",
       "공기 중으로 이동한 물"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사 준비 체·받침·거름 장치·이름표·용기를 조합해 각 물질을 얻는 경로를 설계해요. 설계 그림에서 끝내지 않고 실제 배치를 만들고 시험해요."
    },
    {
     "type": "field",
     "title": "설계의 근거",
     "hint": "각 도구가 필요한 성질과 얻을 물질을 연결해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "순서를 외우기보다 각 단계의 물질이 간 곳을 추적해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "모래를 거르지 않고 먼저 증발시키면 소금과 함께 남아 다시 섞일 수 있어요.",
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
   "section": "실제 조합·시험·개선",
   "title": "만든 배치로 조금씩 시험해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "체와 받침·거름 장치·받는 용기를 실제로 배치하고 교사와 안정성을 확인해요.",
      "이름표를 붙인 용기로 재료를 옮기며 각 단계의 위/아래 물질을 살펴요.",
      "막힘·흘림·불안정한 부분을 실제로 고쳐 다시 시험해요. 소금물은 다음 날짜의 증발 관찰로 이어요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "실제 문제의 예",
      "바꿀 조건",
      "재시험에서 볼 것"
     ],
     "rows": [
      [
       "한꺼번에 많이 올려 막힘",
       "같은 체에 올리는 양",
       "위/아래 분리 상태"
      ],
      [
       "받는 용기가 흔들림",
       "교사와 배치/고정 보완",
       "안정성·흘림·흐른 길"
      ]
     ]
    },
    {
     "type": "field",
     "title": "실제 시험에서 고친 점",
     "hint": "관찰 근거와 실제 수정·재시험을 연결해요. 미실행은 계획으로 남겨요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "부품 배치·실제 시험·수정·재시험은 각각 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 번에 여러 조건을 바꾸면 어느 하나 때문이라고 단정하지 않아요. 직접 송곳·불꽃을 사용하는 제작은 하지 않아요.",
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
   "section": "지속가능한 분리 기술",
   "title": "교실 거름과 정수장 전체를 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "technology",
     "caption": ""
    },
    {
     "type": "text",
     "text": "분리 기술은 필요한 자원을 얻거나 원치 않는 물질을 줄이는 데 쓰여요. 실제 시설에는 여러 처리·검사·유지관리가 있으며 교실 모형의 거름 하나가 모든 기능을 구현하지는 않아요."
    },
    {
     "type": "table",
     "heads": [
      "실제 기관 자료",
      "본문에서 읽은 내용"
     ],
     "rows": [
      [
       "K-water 동화정수장 안내",
       "섞고 뭉치게 하기·가라앉히기·여과·소독 등 여러 처리"
      ],
      [
       "서울아리수본부 검사 안내",
       "시료의 수질 검사·결과 분석/공표"
      ]
     ]
    },
    {
     "type": "field",
     "title": "기능과 검사를 구별하기",
     "hint": "교실 모형에서 확인한 범위와 실제 시설에서 더 확인할 일을 나누어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 대상·이용한 성질·처리 기능·검사를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "설명 장면은 특정 정수장의 실제 사진/정확한 배치도가 아니에요. 현재 수질과 성능은 사진으로 정하지 않아요.",
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
   "section": "경제·사회·지역 조건",
   "title": "어디에서 오래 쓸 장치인가요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "지역과 사용자의 조건",
      "조사할 질문"
     ],
     "rows": [
      [
       "처리 대상과 필요한 양",
       "무엇을 어느 수준까지 분리할까?"
      ],
      [
       "전력·부품·경제 여건",
       "작동·설치/교체·지속 공급은 가능한가?"
      ],
      [
       "관리 인력과 사용 방법",
       "누가 청소·점검 방법을 익히고 맡을까?"
      ],
      [
       "남는 물질 처리",
       "걸러 낸 찌꺼기·폐액은 어떻게 관리할까?"
      ]
     ]
    },
    {
     "type": "example",
     "question": "전력이 불안정한 지역에 전기 장치를 권하려면?",
     "steps": [
      [
       "근거",
       "대상 물질·성능과 전력·부품·현지 관리 조건을 함께 확인해요."
      ],
      [
       "한계",
       "자료에서 확인한 조건과 아직 모르는 것을 나누어요."
      ]
     ],
     "answer": "전기를 쓰거나 쓰지 않는다는 사실만으로 효과와 안전을 보장하지 않아요."
    },
    {
     "type": "field",
     "title": "지역에 맞는 조사 질문",
     "hint": "비교할 장치와 실제로 더 확인할 조건을 정해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "성능 이름만 보고 모든 지역에 같은 장치를 권하지 않아요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "경제·사회·지역의 맥락을 근거로 기술의 기여와 한계를 설명해요.",
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
   "section": "조사 자료 제작·공유",
   "title": "근거를 넣어 만들고 질문으로 고쳐요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "소개할 내용",
      "함께 넣을 근거"
     ],
     "rows": [
      [
       "혼합물·목적·성질",
       "어떤 물질을 어디로 나누는가?"
      ],
      [
       "기여·조건·한계",
       "읽은 본문과 확인할 범위"
      ],
      [
       "사진·자료 출처",
       "제공처·제목·주소·확인 날짜"
      ],
      [
       "새 제안·실제 공유",
       "예상과 사실·제작과 전달을 구별"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "종이 카드나 디지털 자료를 실제로 만들어 짝·모둠 또는 교사가 정한 학급 공간에서 보여 줘요.",
      "질문을 듣고 물질 이름·과정·까닭과 출처 위치를 보완해요.",
      "아직 전달하지 못하거나 의견을 못 받았다면 그대로 두고 다음 기회를 정해요."
     ]
    },
    {
     "type": "field",
     "title": "받은 질문과 고친 근거",
     "hint": "실제 의견·수정과 앞으로 할 계획을 나누어 짧게 적어요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료 저장·실제 전달·질문을 이용한 수정은 다른 행동이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "설명 사진이나 가상 값을 내가 수행한 결과로 바꾸지 않아요. 실제 수치는 예상에 맞춰 고치지 않아요.",
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
   "section": "기술과 지역 사용 조건 41~42",
   "title": "기술과 조사",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-41",
      "mixture-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지역의 사용 조건·자료 근거·공유 상태를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "기술과 지역 사용 조건 43~44",
   "title": "기술의 여러 역할",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-43",
      "mixture-book-44"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지역의 사용 조건·자료 근거·공유 상태를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "기술과 지역 사용 조건 45~46",
   "title": "제안의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-45",
      "mixture-book-46"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지역의 사용 조건·자료 근거·공유 상태를 확인해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 47~48",
   "title": "크기 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-47",
      "mixture-book-48"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 49~50",
   "title": "공정 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-49",
      "mixture-book-50"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 51~52",
   "title": "거름 후 예측",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-51",
      "mixture-book-52"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 53~54",
   "title": "손실 해석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-53",
      "mixture-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 55~56",
   "title": "정수 자료 읽기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-55",
      "mixture-book-56"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 57",
   "title": "흐름 나타내기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-57"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "모형·자료·과정으로 깊이 풀기 58",
   "title": "결과와 소통",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-58"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 가정·단위·측정 범위와 더 확인할 것을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "한눈에 정리",
   "title": "성질 → 도구 → 물질의 길 → 사용 조건",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배운 내용",
      "다시 볼 근거"
     ],
     "rows": [
      [
       "혼합물·분리 목적",
       "구성 물질·얻을 물질·유지된 성질"
      ],
      [
       "크기와 층 분리",
       "구멍/알갱이·층/경계·양쪽 상태"
      ],
      [
       "용해·거름·증발",
       "모래·소금물·소금·공기 중 물"
      ],
      [
       "도구 조합·생활 기술",
       "실제 시험/개선·지역 조건·조사/공유"
      ]
     ]
    },
    {
     "type": "field",
     "title": "핵심 설명 한 문장",
     "hint": "성질과 분리 방법을 물질의 길에 연결해 설명해요.",
     "lines": 9,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분리 도구를 썼다는 것과 실제로 잘 나뉘었다는 근거를 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "정답 수·기록 입력만으로 실제 제작·소통이나 공식 성적을 확정하지 않아요.",
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
   "section": "빈칸 핵심 정리 59~64",
   "title": "혼합과 분리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-59",
      "mixture-book-60",
      "mixture-book-61",
      "mixture-book-62",
      "mixture-book-63",
      "mixture-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈칸 앞뒤 문맥에 맞는 과학 용어를 넣어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 65~66",
   "title": "혼합물 판단",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-65",
      "mixture-book-66"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 67~68",
   "title": "분리 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-67",
      "mixture-book-68"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 69~70",
   "title": "액체 분리 판단",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-69",
      "mixture-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 71~72",
   "title": "기름 활동 기록",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-71",
      "mixture-book-72"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 73~74",
   "title": "소금 용해",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-73",
      "mixture-book-74"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 75~76",
   "title": "단계와 목적",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-75",
      "mixture-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 77~78",
   "title": "거름종이 통과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-77",
      "mixture-book-78"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 79~80",
   "title": "거름 실패 점검",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-79",
      "mixture-book-80"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 81~82",
   "title": "증발 결과",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-81",
      "mixture-book-82"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 83",
   "title": "물질 흐름 평가",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-83"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 84~85",
   "title": "완전 회수 주장",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-84",
      "mixture-book-85"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 86~87",
   "title": "조사와 공유 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-86",
      "mixture-book-87"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 88",
   "title": "제안과 근거 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-88"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 89~90",
   "title": "구멍 다시 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-89",
      "mixture-book-90"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 91~92",
   "title": "실제 날짜",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-91",
      "mixture-book-92"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 93~94",
   "title": "방법 다시 묶기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-93",
      "mixture-book-94"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "오개념 다시 보기 95~96",
   "title": "설명 수정",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "mixture-book-95",
      "mixture-book-96"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비교 조건·순서·실제 관찰 범위에서 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "질문의 조건과 응답 형식을 읽고 한 번의 결과로 확인하지 않은 원인까지 단정하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "헷갈린 번호와 고친 설명의 근거를 남겨요.",
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
     "title": "분리의 까닭 설명하기",
     "hint": "이용한 성질·물질의 이동·자료/실험의 한계 중 필요한 것을 넣어요.",
     "lines": 9,
     "draw": false
    },
    {
     "type": "field",
     "title": "다음 실제 활동",
     "hint": "더 확인할 조건이나 증발 대기·재시험·공유 계획을 정해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 생각이 같아도 근거를 밝히면 의미 있는 설명이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "하지 않은 실험·못 본 시점·미공유를 완료한 일로 바꾸지 않아요.",
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
     "text": "교육부 2022 개정 과학과 교육과정 [6과05-01~03] 본문·해설·적용 고려 사항을 바탕으로 세 분리 탐구와 지속가능한 장치 조사/공유를 연결했어요. 지필드 이론3-2-2 4/14/15쪽·실험3-E19/27/28/32쪽 본문을 대조했어요."
    },
    {
     "type": "heading",
     "text": "자료를 읽고 질문으로 보완하기"
    },
    {
     "type": "text",
     "text": "2009 초등학교 과학탐구토론 지도자료27쪽의 발표/질문/개선 원칙을 참고했어요. 혼합물 전용 실험 절차의 출처로 삼지는 않았어요. K-water 동화정수장 견학안내의 처리 방식과 서울아리수본부 수돗물 수질검사결과 안내의 검사/공표 설명을 확인했어요."
    },
    {
     "type": "heading",
     "text": "사진·수치·문항의 구분"
    },
    {
     "type": "text",
     "text": "승인된 설명 사진7개와 기존96문항을 재사용했어요. 문항의 발문·보기·자료·답·풀이·오개념을 보존하고 문항별 기준과 쓸 공간을 보강했어요. 연습 수치는 실제 측정값이 아니며 현행 단원평가 원문 세트는 확보 대기 중이에요."
    },
    {
     "type": "field",
     "title": "다시 볼 자료와 질문",
     "hint": "문항 번호와 필요한 개념·출처·다음 확인 방법을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료 제목·제공처·본문 범위와 실제 확인 날짜를 함께 읽어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옛5-2Ⅰ 재미있는 나의 탐구(s52-u01)는 다른 주제예요. 이 현행 단원의 원문 시험지로 대신하지 않아요.",
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
      "mixture-book-01",
      "mixture-book-02",
      "mixture-book-03"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-04",
      "mixture-book-05",
      "mixture-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-07",
      "mixture-book-08",
      "mixture-book-09"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-10",
      "mixture-book-11",
      "mixture-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-13",
      "mixture-book-14",
      "mixture-book-15"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-16",
      "mixture-book-17",
      "mixture-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-19",
      "mixture-book-20",
      "mixture-book-21"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-22",
      "mixture-book-23",
      "mixture-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-25",
      "mixture-book-26",
      "mixture-book-27"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-28",
      "mixture-book-29",
      "mixture-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-31",
      "mixture-book-32",
      "mixture-book-33"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-34",
      "mixture-book-35",
      "mixture-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-37",
      "mixture-book-38",
      "mixture-book-39"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-40",
      "mixture-book-41",
      "mixture-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-43",
      "mixture-book-44",
      "mixture-book-45"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-46",
      "mixture-book-47",
      "mixture-book-48"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-49",
      "mixture-book-50",
      "mixture-book-51"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-52",
      "mixture-book-53",
      "mixture-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-55",
      "mixture-book-56",
      "mixture-book-57"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-58",
      "mixture-book-59",
      "mixture-book-60"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-61",
      "mixture-book-62",
      "mixture-book-63",
      "mixture-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-65",
      "mixture-book-66",
      "mixture-book-67"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-68",
      "mixture-book-69",
      "mixture-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-71",
      "mixture-book-72",
      "mixture-book-73"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-74",
      "mixture-book-75",
      "mixture-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-77",
      "mixture-book-78",
      "mixture-book-79"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-80",
      "mixture-book-81",
      "mixture-book-82"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-83",
      "mixture-book-84",
      "mixture-book-85"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-86",
      "mixture-book-87",
      "mixture-book-88"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-89",
      "mixture-book-90",
      "mixture-book-91"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-92",
      "mixture-book-93",
      "mixture-book-94"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
      "mixture-book-95",
      "mixture-book-96"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "뜻이 같은 표현과 조건·물질의 길·근거를 충족하는 타당한 그림/대안을 인정해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "문항별 기준과 오개념 점검에서 헷갈린 조건·경로를 찾아 설명해요.",
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
     "key": "mixture-quick-0",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·물질의 길·근거와 인정 기준을 함께 확인해요.",
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
     "key": "mixture-quick-24",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·물질의 길·근거와 인정 기준을 함께 확인해요.",
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
     "key": "mixture-quick-48",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·물질의 길·근거와 인정 기준을 함께 확인해요.",
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
     "key": "mixture-quick-72",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 조건·물질의 길·근거와 인정 기준을 함께 확인해요.",
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
  "mixture": "<div class=\"ed-photo ed-mixture-photo\"><img src=\"../assets/activities/c22-s52-u01/mixture-photo-v1.png\" width=\"1448\" height=\"1086\" alt=\"낮은 쟁반에 작은 모래와 큰 회색 자갈이 섞여 있고 옆 접시에 각각의 재료가 놓인 설명 장면.\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:1\"><div>작은 모래와 큰 자갈의 혼합물</div></div><p class=\"ed-photo-note\">크기·모양을 보고 두 재료를 구별해요. 사진 속 개수·크기를 측정 자료로 쓰지 않아요.</p><small class=\"ed-photo-credit\">실제 실험/측정 사진 아님</small></div>",
  "sieve": "<div class=\"ed-photo ed-mixture-photo\"><img src=\"../assets/activities/c22-s52-u01/sieve-photo-v1.png\" width=\"1448\" height=\"1086\" alt=\"받침 위의 금속 체에는 큰 자갈이 남고 아래 받침에 모래가 모인 설명 장면.\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:2\"><div>체 위: 큰 자갈</div><div>받침: 통과한 모래</div></div><p class=\"ed-photo-note\">구멍은 작은 알갱이보다 크고 큰 알갱이보다 작아야 해요. 실제 재료는 모양·물기·막힘도 확인해요.</p><small class=\"ed-photo-credit\">실제 실험/측정 사진 아님</small></div>",
  "oil": "<div class=\"ed-photo ed-mixture-photo\"><img src=\"../assets/activities/c22-s52-u01/oil-photo-v1.png\" width=\"1448\" height=\"1086\" alt=\"눈금 없는 투명 비커에 아래 무색 액체와 위 옅은 노란 액체가 한 경계면으로 나뉘고 옆에 스포이트가 놓임.\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:2\"><div>위층: 식용유</div><div>아래층: 물</div></div><p class=\"ed-photo-note\">물과 기름을 충분히 두었을 때의 설명 장면이에요. 층의 실제 양·대기 시간은 사진으로 정하지 않아요.</p><small class=\"ed-photo-credit\">실제 실험/측정 사진 아님</small></div>",
  "dissolve": "<div class=\"ed-photo ed-mixture-photo\"><img src=\"../assets/activities/c22-s52-u01/dissolve-photo-v1.png\" width=\"1448\" height=\"1086\" alt=\"왼쪽 비커에는 흰 알갱이와 모래 혼합물, 오른쪽에는 맑은 액체 아래 모래가 남은 설명 장면.\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:2\"><div>물 넣기 전: 소금+모래</div><div>충분히 녹인 뒤: 소금물+모래</div></div><p class=\"ed-photo-note\">서로 다른 상태를 설명하려고 배치한 AI 장면이에요. 같은 시료의 실측 전후 사진이 아니며, 녹은 소금은 눈에 안 보여도 물속에 있어요.</p><small class=\"ed-photo-credit\">실제 실험/측정 사진 아님</small></div>",
  "filter": "<div class=\"ed-photo ed-mixture-photo\"><img src=\"../assets/activities/c22-s52-u01/filter-photo-v1.png\" width=\"1448\" height=\"1086\" alt=\"무거운 받침의 고정대와 고리에 놓인 깔때기, 흰 거름종이에 남은 모래와 아래 비커에 모인 맑은 액체의 설명 장면.\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:2\"><div>거름종이: 모래 남음</div><div>아래 비커: 소금물</div></div><p class=\"ed-photo-note\">깔때기 끝은 받는 액체에 잠기지 않게 해요. 설치는 교사와 확인하고 종이 높이를 넘지 않게 천천히 부어요. 녹은 소금은 통과해요.</p><small class=\"ed-photo-credit\">실제 실험/측정 사진 아님</small></div>",
  "evaporate": "<div class=\"ed-photo ed-mixture-photo\"><img src=\"../assets/activities/c22-s52-u01/evaporate-photo-v1.png\" width=\"1448\" height=\"1086\" alt=\"같은 모양의 얕은 흰 접시 두 개. 왼쪽에는 맑은 액체, 오른쪽에는 흰 결정이 놓인 설명 장면.\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:2\"><div>왼쪽: 소금물</div><div>오른쪽: 물이 증발한 뒤 소금</div></div><p class=\"ed-photo-note\">설명을 위한 두 상태의 배치예요. 실제 경과 시간·회수량을 증명하지 않아요. 실온 자연 증발이나 교사 시범으로 관찰하고 맛보지 않아요.</p><small class=\"ed-photo-credit\">실제 실험/측정 사진 아님</small></div>",
  "technology": "<div class=\"ed-photo ed-mixture-photo\"><img src=\"../assets/activities/c22-s52-u01/technology-photo-v1.png\" width=\"1448\" height=\"1086\" alt=\"난간과 통로가 있는 야외 수처리 시설의 여러 콘크리트 수조·배관을 담은 일반화된 AI 설명 장면.\" decoding=\"async\"><div class=\"ed-photo-labels\" style=\"--photo-cols:1\"><div>여러 처리와 관리가 필요한 시설</div></div><p class=\"ed-photo-note\">특정 정수장의 실제 사진·정확한 배치도가 아니에요. 이 장면만으로 처리 순서·성능·수질을 확인할 수 없어요. 공공기관의 실제 자료와 비교해요.</p><small class=\"ed-photo-credit\">실제 실험/측정 사진 아님</small></div>",
  "mixture-quick-0": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">2</th><td>빈칸</td><td>크기</td></tr><tr><th scope=\"row\">3</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">4</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">5</th><td>빈칸</td><td>혼합물</td></tr><tr><th scope=\"row\">6</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">7</th><td>연결</td><td>(1) ㄷ (2) ㄱ (3) ㄴ</td></tr><tr><th scope=\"row\">8</th><td>복수</td><td>①, ②, ③, ⑤</td></tr><tr><th scope=\"row\">9</th><td>단답</td><td>아래</td></tr><tr><th scope=\"row\">10</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">11</th><td>빈칸</td><td>커야, 작아</td></tr><tr><th scope=\"row\">12</th><td>객관식</td><td>③</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">13</th><td>연결</td><td>(1) ㄱ (2) ㄴ</td></tr><tr><th scope=\"row\">14</th><td>순서</td><td>ㄴ → ㄱ → ㄷ → ㄹ</td></tr><tr><th scope=\"row\">15</th><td>복수</td><td>①, ②, ③, ⑤</td></tr><tr><th scope=\"row\">16</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>빈칸</td><td>층</td></tr><tr><th scope=\"row\">18</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">19</th><td>연결</td><td>(1) ㄱ (2) ㄴ</td></tr><tr><th scope=\"row\">20</th><td>순서</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">21</th><td>복수</td><td>①, ②, ③</td></tr><tr><th scope=\"row\">22</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">23</th><td>빈칸</td><td>녹고, 녹지 않</td></tr><tr><th scope=\"row\">24</th><td>객관식</td><td>⑤</td></tr></tbody></table></div>",
  "mixture-quick-24": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">25</th><td>연결</td><td>(1) ㄱ (2) ㄴ</td></tr><tr><th scope=\"row\">26</th><td>순서</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">27</th><td>복수</td><td>①, ②, ③</td></tr><tr><th scope=\"row\">28</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">29</th><td>빈칸</td><td>모래, 소금물</td></tr><tr><th scope=\"row\">30</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">31</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">32</th><td>순서</td><td>ㄹ → ㄴ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">33</th><td>복수</td><td>①, ②, ③</td></tr><tr><th scope=\"row\">34</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">35</th><td>빈칸</td><td>증발, 소금</td></tr><tr><th scope=\"row\">36</th><td>객관식</td><td>②</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">37</th><td>단답</td><td>목요일</td></tr><tr><th scope=\"row\">38</th><td>순서</td><td>ㄱ → ㄴ → ㄷ → ㄹ</td></tr><tr><th scope=\"row\">39</th><td>복수</td><td>①, ②, ③</td></tr><tr><th scope=\"row\">40</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">41</th><td>빈칸</td><td>확인</td></tr><tr><th scope=\"row\">42</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">43</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">44</th><td>복수</td><td>①, ②, ③, ⑤</td></tr><tr><th scope=\"row\">45</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">46</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">47</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">48</th><td>단답</td><td>1개</td></tr></tbody></table></div>",
  "mixture-quick-48": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">49</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">50</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">51</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">52</th><td>단답</td><td>1g</td></tr><tr><th scope=\"row\">53</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">54</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">55</th><td>연결</td><td>(1) ㄱ (2) ㄷ (3) ㄴ</td></tr><tr><th scope=\"row\">56</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">57</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">58</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">59</th><td>빈칸</td><td>성질</td></tr><tr><th scope=\"row\">60</th><td>빈칸</td><td>모래, 자갈</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">61</th><td>빈칸</td><td>스포이트</td></tr><tr><th scope=\"row\">62</th><td>빈칸</td><td>모래, 소금물</td></tr><tr><th scope=\"row\">63</th><td>빈칸</td><td>소금</td></tr><tr><th scope=\"row\">64</th><td>빈칸</td><td>유지관리</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">66</th><td>빈칸</td><td>2</td></tr><tr><th scope=\"row\">67</th><td>연결</td><td>(1) ㄷ (2) ㄴ (3) ㄱ</td></tr><tr><th scope=\"row\">68</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">69</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">70</th><td>순서</td><td>ㄴ → ㄹ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">71</th><td>복수</td><td>①, ②, ③, ⑤</td></tr><tr><th scope=\"row\">72</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>",
  "mixture-quick-72": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">73</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">74</th><td>빈칸</td><td>녹는</td></tr><tr><th scope=\"row\">75</th><td>연결</td><td>(1) ㄴ (2) ㄱ (3) ㄷ</td></tr><tr><th scope=\"row\">76</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">78</th><td>단답</td><td>1g</td></tr><tr><th scope=\"row\">79</th><td>복수</td><td>①, ②, ③, ④</td></tr><tr><th scope=\"row\">80</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">82</th><td>빈칸</td><td>관찰</td></tr><tr><th scope=\"row\">83</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">84</th><td>서술</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">86</th><td>연결</td><td>(1) ㄱ (2) ㄴ (3) ㄷ</td></tr><tr><th scope=\"row\">87</th><td>복수</td><td>①, ②, ③, ⑤</td></tr><tr><th scope=\"row\">88</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">89</th><td>빈칸</td><td>큰</td></tr><tr><th scope=\"row\">90</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">91</th><td>단답</td><td>2일</td></tr><tr><th scope=\"row\">92</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">93</th><td>연결</td><td>(1) ㄴ (2) ㄱ (3) ㄷ</td></tr><tr><th scope=\"row\">94</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">95</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>"
 }
};

export const observationPriorWorkbook=withMixtureEditorial(baseWorkbook);
export const mixtureReadablePriorWorkbook=withObservationLanguage(observationPriorWorkbook);
export const workbook=withMixtureReadableWorkbook(mixtureReadablePriorWorkbook);
