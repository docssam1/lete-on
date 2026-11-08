import{withClimateReadableWorkbook}from'./c22-s42-u04.rail-notes.js?v=20261106-climate-readable-workbook';
import{withClimateUpperScience}from'./c22-s42-u04.rail-notes.js?v=20261105-climate-upper-science';
import{withStudentGuideLanguage}from'./student-opening-language.js?v=20261105-student-guide';
import {withStudentOpeningLanguage} from './student-opening-language.js';
import {withClimateVisuals} from './c22-s42-u04.workbook-visuals.js';
import {withClimateRails} from './c22-s42-u04.rail-notes.js';
// 검수 원고: 문항·쪽 구성·이전 원고와 편집 변환을 함께 보관한다.
// 그리는 곳: v2/think-workbook-paper.js → #/c22-s42-u04/workbook/student|teacher|answers|quick
const baseWorkbook = {
 "unit": "c22-s42-u04",
 "title": "기후변화와 우리 생활",
 "semester": "4-2",
 "no": 4,
 "theme": "#2456c4",
 "richText": true,
 "questions": [
  {
   "id": "c22-s42-u04-w001",
   "no": 1,
   "form": "choice",
   "topic": "날씨와 기후",
   "prompt": "다음 중 「기후」를 말한 것은?",
   "answer": "③ 우리나라 여름은 해마다 덥고 비가 많다",
   "explanation": "한 지역에서 오랜 기간 되풀이되는 여름의 평균적인 모습을 고르세요. 오늘·어제의 관찰과 내일 예보는 특정 때의 날씨예요. 기후라는 말도 모든 해·모든 날이 같다는 뜻은 아니에요.",
   "misconception": "해마다라는 낱말만 보고 모든 날이 같다고 생각하지 않았나요?",
   "criteria": "오랜 기간의 지역 모습을 설명한③을 골라요.",
   "choices": [
    "오늘 아침에는 안개가 짙게 끼고 꽤 쌀쌀했다",
    "어제 오후에 한 시간 동안 소나기가 내렸다",
    "우리나라 여름은 해마다 덥고 비가 많다",
    "내일은 바닷가에 바람이 강하게 불 것이다",
    "지난 일요일은 하루 종일 하늘이 맑고 따뜻했다"
   ],
   "key": 2,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "날씨와 기후",
    "concept": "날씨와 기후",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     2
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w002",
   "no": 2,
   "form": "short",
   "topic": "해수면 상승",
   "prompt": "바닷물의 높이가 높아지면 바닷가에서 어떤 곳이 가장 먼저 물에 잠길까요? 처음 생각과 그렇게 생각한 까닭을 써요.",
   "answer": "땅이 가장 낮은 곳(바다와의 거리보다 땅의 높이가 낮은 곳)",
   "explanation": "처음 예상과 까닭을 남기고 배운 뒤 모형 근거와 비교하는 문항이에요. 지금의 생각을 모형 결과나 실제 해안의 안전 확인으로 세지 않아요. 실제로는 물길·지형·시설도 더 살펴야 해요.",
   "misconception": "처음 예상과 관찰 뒤 설명을 같은 기록으로 쓰지 않았나요?",
   "criteria": "예상과 그 이유가 있으면 인정해요. 처음부터 정답과 같은지로 판단하지 않고 단원 끝에서 보완해요.",
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "처음 예상",
     "그렇게 생각한 까닭"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해수면 상승",
    "concept": "해수면 상승",
    "standard": "4과16-02",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w003",
   "no": 3,
   "form": "multi",
   "topic": "기후변화 사례",
   "prompt": "같은 지역과 조사 기준으로 여러 해의 변화를 살펴본 가상 사례예요. 기후변화와 관련해 더 살펴볼 수 있는 일을 모두 고르세요.",
   "answer": "①, ③, ⑤",
   "explanation": "여러 해에 걸친 폭염 일수·꽃피는 때·재배 지역의 변화를 살펴요. 오늘 비와 이번 주 미세 먼지 두 날만으로 같은 범위의 변화를 확인하지 못해요. 생물·재배 변화의 원인이 기온 하나라고 확정하는 뜻도 아니에요.",
   "misconception": "변화 사례와 원인을 하나로 확정한 설명을 구별했나요?",
   "criteria": "폭염 일수·평균 개화 시기·재배 지역의 변화 세 보기를 모두 골라요.",
   "choices": [
    "여름에 폭염이 나타나는 날이 해마다 늘었다",
    "오늘 갑자기 비가 와서 우산을 샀다",
    "봄꽃이 피는 때가 예전보다 빨라졌다",
    "이번 주에 미세 먼지가 많은 날이 이틀 있었다",
    "사과를 기르는 곳이 예전보다 북쪽으로 옮겨 갔다"
   ],
   "key": [
    0,
    2,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기후변화 사례",
    "concept": "기후변화 사례",
    "standard": "4과16-01",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      2,
      4
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w004",
   "no": 4,
   "form": "blank",
   "topic": "평년",
   "prompt": "기후가 변했는지 알아볼 때는 오늘 하루가 아니라 [ ] 동안의 평균과 비교해요.",
   "answer": "여러 해(30년)",
   "explanation": "현재 비교에 쓰는 평년은1991~2020년30년 평균이에요. 같은 지역·기상요소·같은 계절이나 기간 기준으로 사례를 읽어요. 오늘 하루만으로 긴 기간의 변화를 정하지 않아요.",
   "misconception": "오늘 하루나 지난해 한 해를30년 평년과 같은 기간으로 보지 않았나요?",
   "criteria": "여러 해·30년·오랜 기간처럼 장기간을 나타내면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "평년",
    "concept": "평년",
    "standard": "4과16-01",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "accepted": [
     "여러 해(30년)"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w005",
   "no": 5,
   "form": "match",
   "topic": "날씨와 기후",
   "prompt": "날씨를 말한 것이면 「날씨」, 기후를 말한 것이면 「기후」를 써요.",
   "answer": "(1) 날씨 (2) 기후 (3) 날씨",
   "explanation": "오늘 최고기온과 이번 주말 예보는 특정 때의 날씨예요. 여름·겨울에 오랜 기간 되풀이되는 지역 모습은 기후예요. 여름이라는 계절 이름만으로 나누지 말고 설명의 기간을 읽어요.",
   "misconception": "특정 날의 여름 기온도 모두 기후라고 쓰지 않았나요?",
   "criteria": "(1)날씨/(2)기후/(3)날씨를 각 부분에 맞춰 써요.",
   "parts": [
    "(1) 오늘 서울은 낮 최고 기온이 31 ℃였다.",
    "(2) 우리나라는 여름이 덥고 습하며 겨울은 춥고 건조하다.",
    "(3) 이번 주말에는 비가 올 것이다."
   ],
   "answerPerPart": true,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "날씨와 기후",
    "concept": "날씨와 기후",
    "standard": "4과16-01",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "accepted": [
     "(1) 날씨 (2) 기후 (3) 날씨"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w006",
   "no": 6,
   "form": "choice",
   "topic": "평년",
   "prompt": "기상청이 쓰는 평년값에 대한 설명으로 알맞은 것은?",
   "answer": "⑤ 1991~2020년 30년 동안의 값을 평균한 것이다",
   "explanation": "이 문항의 평년값은1991~2020년30년 자료를 평균한 기준이에요. 특정 하루나 가장 더운 날만 골라 모은 값과 달라요. 다른 한 해 값도 비교 자료가 될 수 있지만 그것을 이30년 평년값이라고 부르지는 않아요.",
   "misconception": "한 해의 자료는 어떤 비교에도 못 쓴다고 넓히지 않았나요?",
   "criteria": "1991~2020년30년의 평균이라는⑤를 골라요.",
   "choices": [
    "지난해 한 해 동안 잰 기온을 평균한 것이다",
    "30년 동안 가장 더웠던 날의 기온만 모은 것이다",
    "전국에서 가장 높은 곳의 기온을 잰 것이다",
    "올해 1월 1일 하루의 기온을 적은 것이다",
    "1991~2020년 30년 동안의 값을 평균한 것이다"
   ],
   "key": 4,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "평년",
    "concept": "평년",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     4
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w007",
   "no": 7,
   "form": "short",
   "topic": "평년 비교",
   "prompt": "어느 도시의 지난해 연평균 기온은 15.3 ℃, 같은 도시의 평년값은 13.6 ℃였어요. 지난해는 평년보다 몇 ℃ 높았나요?",
   "answer": "1.7 ℃",
   "explanation": "같은 도시의 연평균끼리15.3−13.6=1.7(℃)을 구해요. 지난해 한 해 평균이 제시한 평년보다 높다는 뜻이에요. 모든 날이1.7℃씩 높았다고 읽지는 않아요.",
   "misconception": "값을 더하거나 마지막 값15.3을 차이로 쓰지 않았나요?",
   "criteria": "1.7℃와 단위를 쓰면 인정해요. 단위가 빠지면 무엇의 차이인지 보완하게 해요.",
   "given": [
    "가상 학습값 · 어느 도시의 연평균 기온",
    "지난해 15.3 ℃ · 평년값(1991~2020년) 13.6 ℃"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "평년 비교",
    "concept": "평년 비교",
    "standard": "4과16-01",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "short",
    "teacherRequired": false,
    "accepted": [
     "1.7 ℃"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w008",
   "no": 8,
   "form": "written",
   "topic": "날씨와 기후",
   "prompt": "「오늘은 추우니까 기후변화는 일어나지 않고 있다.」 이 말이 알맞지 않은 까닭을 써요.",
   "answer": "오늘 하루 추웠다는 관찰은 그때의 날씨이다. 그것만으로 오랜 기간의 기후변화를 부정할 수 없고 같은 지역·요소의 여러 해 자료와 평년 비교를 더 살펴야 한다.",
   "explanation": "오늘의 추위와 여러 해에 걸친 변화는 기간 범위가 달라요. 같은 지역·요소의 여러 해 자료와 평년 비교를 더 살펴야 해요. 추운 하루가 관찰됐다는 사실은 남기되 그것만으로 변화가 없다고 정하지 않아요.",
   "misconception": "추운 하루가 있다는 사실을 부정하거나 장기 변화가 끝났다고 보지 않았나요?",
   "criteria": "하루의 관찰 범위와 장기간 자료가 더 필요하다는 까닭을 연결하면 인정해요. 정의를 외운 문장만 요구하지 않아요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "날씨와 기후",
    "concept": "날씨와 기후",
    "standard": "4과16-01",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "responseContract": {
    "type": "written",
    "teacherRequired": true,
    "criteria": "하루의 관찰 범위와 장기간 자료가 더 필요하다는 까닭을 연결하면 인정해요. 정의를 외운 문장만 요구하지 않아요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w009",
   "no": 9,
   "form": "choice",
   "topic": "기후변화 사례",
   "prompt": "짧은 시간에 많은 비가 내리는 일이 잦아질 때 생길 수 있는 일로 알맞은 것은?",
   "answer": "② 낮은 길과 지하 공간에 물이 갑자기 차오른다",
   "explanation": "짧은 시간에 많은 비가 오면 배수가 따라가지 못해 낮은 길 등에 물이 찰 수 있어요. 지형·물길·시설 상태에 따라 영향은 달라요. 한 번의 침수로 장기 기후변화나 특정 원인을 모두 확인한 것은 아니에요.",
   "misconception": "많은 비가 오면 모든 장소가 같은 깊이로 잠긴다고 넓히지 않았나요?",
   "criteria": "물의 집중과 낮은 길·지하 공간의 침수를 연결한②를 골라요.",
   "choices": [
    "비가 많으면 배수 조건과 관계없이 모든 길이 같은 깊이로 잠긴다",
    "낮은 길과 지하 공간에 물이 갑자기 차오른다",
    "한 번 침수되면 그곳은 앞으로도 매년 같은 날 잠긴다",
    "도로에 물이 보이면 마실 수 있는 물인지도 알 수 있다",
    "기온 자료가 같으면 지형이 달라도 침수 영향이 같다"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기후변화 사례",
    "concept": "기후변화 사례",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     1
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w010",
   "no": 10,
   "form": "multi",
   "topic": "기후변화 사례",
   "prompt": "다음 가상 조사 자료를 그대로 읽은 설명을 모두 고르세요.",
   "answer": "②, ③, ⑤",
   "explanation": "같은 기준의 가상 조사에서 꽃은 평균3일 일찍 피고 곤충 활동은5일 길어졌어요. 재배 지역 북쪽 확대도 기록돼 있어요. 모든 생물·다른 지역이나 기온만의 원인으로 확대하지 않아요.",
   "misconception": "관찰한 생물의 결과를 모든 생물이나 확정 원인으로 바꾸지 않았나요?",
   "criteria": "개화3일·활동5일·재배 지역 세 기록에 해당하는 보기를 모두 골라요.",
   "choices": [
    "자료만으로 모든 생물의 변화를 확정할 수 있다",
    "관찰한 봄꽃은 예전보다 평균3일 일찍 피었다",
    "관찰한 곤충은 활동 기간이 평균5일 길어졌다",
    "기온 이외의 조건은 조사할 필요가 없다",
    "사과 재배 지역의 북쪽 확대 사례가 기록되었다"
   ],
   "key": [
    1,
    2,
    4
   ],
   "given": [
    "가상 학습 자료: 같은 조사 기준으로 앞뒤10년을 비교했어요. 관찰한 봄꽃의 평균 개화일은3일 빨라졌고, 관찰한 곤충의 활동 기간은5일 길어졌어요. 사과 재배 지역이 북쪽으로 확대된 사례도 기록했어요. 다른 지역·생물과 재배 방법 등은 조사하지 않았어요."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기후변화 사례",
    "concept": "기후변화 사례",
    "standard": "4과16-01",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      2,
      4
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w011",
   "no": 11,
   "form": "match",
   "topic": "기후변화 사례",
   "prompt": "기후변화로 나타나는 일과 그 영향을 〈보기〉에서 골라 기호를 써요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "더위는 건강·활동, 물 부족은 식수·농사, 높아진 바다는 낮은 해안에 영향을 줄 수 있어요. 주어진 대표적인 연결을 골라요. 실제 영향은 지역과 필요한 도움을 더 조사해요.",
   "misconception": "한 현상은 오직 한 가지 생활 영향만 준다고 생각하지 않았나요?",
   "criteria": "(1)ㄴ/(2)ㄱ/(3)ㄷ를 각 상황에 맞게 연결해요.",
   "parts": [
    "(1) 폭염",
    "(2) 가뭄",
    "(3) 해수면 상승"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 마실 물과 농사지을 물이 모자란다",
    "ㄴ. 더위로 몸이 아픈 사람이 늘어난다",
    "ㄷ. 바닷가의 낮은 땅이 물에 잠긴다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기후변화 사례",
    "concept": "기후변화 사례",
    "standard": "4과16-01",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "accepted": [
     "(1) ㄴ (2) ㄱ (3) ㄷ"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w012",
   "no": 12,
   "form": "choice",
   "topic": "기후변화 사례",
   "prompt": "지역의 여러 해 변화와 특정 때 관찰을 구별하려 해요. 주어진 내용만으로 여러 해 변화 사례라 보기 어려운 것은?",
   "answer": "① 어제 오후 한 시간 동안 소나기가 내렸다",
   "explanation": "어제 한 시간의 소나기는 그때의 날씨 기록이에요. 다른 보기들은 여러 해의 평균·계절·활동 변화 사례로 제시됐어요. 한 사건의 관찰도 자료가 되지만 그것만으로 긴 변화나 원인을 확정할 수는 없어요.",
   "misconception": "하루의 관찰은 가치가 없다는 뜻으로 읽지 않았나요?",
   "criteria": "주어진 보기 중 한 시간의 관찰만 제시한①을 골라요.",
   "choices": [
    "어제 오후 한 시간 동안 소나기가 내렸다",
    "여름에 열대야가 나타나는 날이 늘어났다",
    "겨울이 예전보다 짧아지고 봄이 빨리 온다",
    "우리 바다의 평균 수온이 예전보다 높아졌다",
    "농작물을 기르는 곳이 북쪽으로 옮겨 가고 있다"
   ],
   "key": 0,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기후변화 사례",
    "concept": "기후변화 사례",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     0
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w013",
   "no": 13,
   "form": "blank",
   "topic": "생활과 사람의 활동",
   "prompt": "사람이 물건을 만들고 이동하며 전기를 쓰는 생활은 기후변화와 [ ]이 있어요.",
   "answer": "관련",
   "explanation": "물건 생산·이동·에너지 이용 같은 인간 활동과 기후변화의 관련성을 자료로 토의해요. 생활 사례와 가능한 대응을 연결할 수 있어요. 한 학생의 행동이 특정 날 비의 원인 전부라고 정하는 문장은 아니에요.",
   "misconception": "관련이 있다는 말을 한 사람 탓이나 즉시 날씨 변화로 바꾸지 않았나요?",
   "criteria": "관련·관계처럼 연결을 나타내는 같은 뜻의 말을 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "생활과 사람의 활동",
    "concept": "생활과 사람의 활동",
    "standard": "4과16-01",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "accepted": [
     "관련"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w014",
   "no": 14,
   "form": "order",
   "topic": "자료 조사와 토의",
   "prompt": "사람의 생활과 기후변화의 관련성을 토의할 과정을 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
   "explanation": "먼저 조사할 질문을 정한 뒤 출처·생활 사례를 살펴요. 확인한 근거로 의견을 나누고 친구 근거를 들은 뒤 보완해요. 원하는 결론을 먼저 정하고 자료를 맞추는 순서가 아니에요.",
   "misconception": "근거를 확인하기 전에 결론을 정하지 않았나요?",
   "criteria": "ㄷ→ㄱ→ㄹ→ㄴ의 순서와 각 단계의 역할을 확인해요.",
   "given": [
    "ㄱ. 자료의 출처와 생활 사례를 확인한다",
    "ㄴ. 친구의 근거를 듣고 생각을 보완한다",
    "ㄷ. 조사할 질문을 정한다",
    "ㄹ. 확인한 사례를 근거로 의견을 나눈다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "자료 조사와 토의",
    "concept": "자료 조사와 토의",
    "standard": "4과16-01",
    "itemType": "order",
    "inquirySkill": "조사·비교 과정 구성하기"
   },
   "responseContract": {
    "type": "order",
    "teacherRequired": false,
    "accepted": [
     "ㄷ → ㄱ → ㄹ → ㄴ"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w015",
   "no": 15,
   "form": "choice",
   "topic": "생활의 변화",
   "prompt": "기후변화와 사람의 생활을 함께 살펴볼 조사 질문으로 알맞은 것은?",
   "answer": "④ 우리 학교의 전기 낭비를 어떻게 줄일까",
   "explanation": "우리 학교의 불필요한 전기 사용은 실제 사용 조건을 살펴 조사할 수 있어요. 필요한 밝기·냉방 등은 유지하면서 가능한 방법을 찾아요. 하루나 사진 하나로 미래 기후·원인을 확정하는 질문과 구별해요.",
   "misconception": "전기를 쓴 모든 상황을 낭비라고 정하지 않았나요?",
   "criteria": "학교의 전기 낭비를 줄일 구체적인 조사 질문인④를 골라요.",
   "choices": [
    "어제 비가 왔으니 우리 학교의 전등이 원인이라고 정할까",
    "평년보다 높은 전국 평균을 모든 교실의 매일 값으로 쓸까",
    "전기 사용량만으로 우리 동네의 다음 홍수를 예측할까",
    "우리 학교의 전기 낭비를 어떻게 줄일까",
    "한 교실이 비었으니 학교의 모든 전등을 꺼도 될까"
   ],
   "key": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "생활의 변화",
    "concept": "생활의 변화",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     3
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w016",
   "no": 16,
   "form": "multi",
   "topic": "생활과 실천",
   "prompt": "사람의 생활을 살피고 실천 방법을 정하는 태도로 알맞은 것을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "불필요한 사용과 공동 역할을 살피고 실제 행동과 계획을 나누어요. 필요한 사용·개인 여건을 고려해야 가능한 방법을 정할 수 있어요. 한 사람에게 모두 맡기거나 효과를 즉시 확정하지 않아요.",
   "misconception": "좋은 뜻의 약속이면 누구에게나 같은 행동을 강요해도 된다고 보지 않았나요?",
   "criteria": "낭비 확인·공동 의논·계획과 실제 구별의 세 보기를 모두 골라요.",
   "choices": [
    "불필요하게 쓰는 전기와 물건을 살핀다",
    "어린이와 어른이 함께 할 일을 의논한다",
    "서로의 필요가 달라도 모두 같은 행동만 하게 한다",
    "실천한 일과 아직 계획인 일을 나눈다",
    "실천할 계획을 세웠으므로 실제 사용량도 줄었다고 정한다"
   ],
   "key": [
    0,
    1,
    3
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "생활과 실천",
    "concept": "생활과 실천",
    "standard": "4과16-01",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      1,
      3
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w017",
   "no": 17,
   "form": "short",
   "topic": "해수면 모형",
   "prompt": "표의 땅 높이를 보고, 방파제가 없을 때 물높이 3 cm에서 물에 닿는 집을 모두 써요.",
   "answer": "B, C",
   "explanation": "모든 집이 같은 물과 연결되고 벽이 없는 조건이에요. 땅 높이가3cm 이하인B1.5·C2.5cm를 고르면 두 채예요. 바다와의 거리만으로 순서를 정하거나 실제 지역에 그대로 적용하지 않아요.",
   "misconception": "거리만 보고A를 넣거나3cm보다 높은D를 넣지 않았나요?",
   "criteria": "B와C를 모두 쓰면 인정하며 두 이름의 순서는 달라도 돼요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해수면 모형",
    "concept": "해수면 모형",
    "standard": "4과16-02",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "short",
    "teacherRequired": false,
    "accepted": [
     "B, C"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w018",
   "no": 18,
   "form": "choice",
   "topic": "해수면 모형",
   "prompt": "물높이를 1 cm에서 4 cm까지 높일 때의 결과를 바르게 말한 것은?",
   "answer": "③ 물높이가 높아질수록 물에 닿은 집의 수가 늘었다",
   "explanation": "고정한 모형에서 물1·2·3·4cm의 결과가0·1·2·3채예요. 이 네 조건에서는 물이 닿은 집 수가 늘었어요. A는땅4.5cm로 더 높아4cm에서도 젖지 않았으며 모든 높이의 결과를 확인한 것은 아니에요.",
   "misconception": "모든 물높이에서 반드시 한 채씩 늘어난다고 넓히지 않았나요?",
   "criteria": "주어진1~4cm 범위의 집 수 증가를 나타낸③을 골라요.",
   "choices": [
    "물높이와 상관없이 물에 닿은 집의 수가 같았다",
    "물높이가 높아질수록 물에 닿은 집의 수가 줄었다",
    "물높이가 높아질수록 물에 닿은 집의 수가 늘었다",
    "물높이가 2 cm일 때 모든 집이 한꺼번에 젖었다",
    "바다에서 가까운 집부터 차례로 물에 닿았다"
   ],
   "key": 2,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해수면 모형",
    "concept": "해수면 모형",
    "standard": "4과16-02",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     2
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w019",
   "no": 19,
   "form": "written",
   "topic": "해수면 모형",
   "prompt": "집 A와 집 E는 물높이 4 cm에서도 젖지 않았어요. 두 집의 공통점을 땅의 높이와 이어 써요.",
   "answer": "두 집 모두 땅의 높이(A 4.5 cm, E 6 cm)가 물높이 4 cm보다 높은 언덕 위에 있다.",
   "explanation": "물4cm보다A땅4.5cm와E땅6cm가 모두 높아요. 바다와 거리는 달라도 고정한 모형에서 두 집에 물이 닿지 않은 공통 이유예요. 실제 해안의 모든 위험을 확인한 결과는 아니에요.",
   "misconception": "가까운A와 먼E를 거리만으로 다르게 판단하지 않았나요?",
   "criteria": "두 집의 땅 높이가4cm 물보다 높다는 비교를 쓰면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해수면 모형",
    "concept": "해수면 모형",
    "standard": "4과16-02",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "responseContract": {
    "type": "written",
    "teacherRequired": true,
    "criteria": "두 집의 땅 높이가4cm 물보다 높다는 비교를 쓰면 인정해요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w020",
   "no": 20,
   "form": "short",
   "topic": "방파제",
   "prompt": "방파제(높이 3.5 cm)를 세운 모형에서 물높이가 3 cm일 때 물에 닿은 집은 몇 채인가요?",
   "answer": "0채",
   "explanation": "물3cm는벽3.5cm보다 낮아요. 이 모형에서는 벽 안쪽으로 넘어오지 않아 닿은 집0채예요. 관찰한0채를 미기록이나 어떤 물높이에도 안전하다는 뜻으로 바꾸지 않아요.",
   "misconception": "0채와 관찰하지 않은 상태를 같은 것으로 보지 않았나요?",
   "criteria": "이 모형 조건의0채를 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "방파제",
    "concept": "방파제",
    "standard": "4과16-02",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "short",
    "teacherRequired": false,
    "accepted": [
     "0채"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w021",
   "no": 21,
   "form": "choice",
   "topic": "방파제",
   "prompt": "방파제가 있는데도 물높이 4 cm에서 집 B·C·D가 젖은 까닭은?",
   "answer": "⑤ 물높이가 방파제의 높이보다 높아져 물이 넘쳤기 때문에",
   "explanation": "물4cm가벽3.5cm보다 높아 넘어오고 B·C·D땅은4cm 이하예요. 벽을 없앤 것이 아니라 같은 벽을 넘어온 결과예요. 벽이 있다는 사실만으로 모든 물높이에서 같은 결과라 정하지 않아요.",
   "misconception": "물이 높아진 것과 벽을 치운 것을 혼동하지 않았나요?",
   "criteria": "물높이와 벽 높이의 비교를 설명한⑤를 골라요.",
   "choices": [
    "벽이 있는 조건의 물높이는 늘 벽보다 낮다고 보았기 때문에",
    "벽 높이가 같으므로 물이 높아져도 결과는 같아야 하기 때문에",
    "물높이 대신 바다와의 거리만 비교했기 때문에",
    "집이 안 젖도록 매번 땅 높이까지 함께 바꾸었기 때문에",
    "물높이가 방파제의 높이보다 높아져 물이 넘쳤기 때문에"
   ],
   "key": 4,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "방파제",
    "concept": "방파제",
    "standard": "4과16-02",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     4
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w022",
   "no": 22,
   "form": "written",
   "topic": "방파제",
   "prompt": "「방파제가 있으면 어떤 물높이에서도 모든 집이 안전하다」는 말을 모형 결과로 고쳐 쓰세요.",
   "answer": "이 모형에서는 물높이3 cm일 때 안쪽 집에 물이 닿지 않았지만4 cm에서는 방파제3.5 cm를 넘어 B·C·D에 물이 닿았다. 실제 마을의 안전은 이 모형만으로 정하지 않고 경보·지형·이동 길 등을 어른과 확인해야 한다.",
   "explanation": "같은 벽에서 물3cm는0채, 물4cm는B·C·D로 달라요. 따라서 벽이 있으면 언제나 안전하다는 말은 자료와 맞지 않아요. 실제 지형·시설·파도·현재 안내는 어른과 더 확인해요.",
   "misconception": "모형에서0채였다는 사실로 실제 마을 안전을 보장하지 않았나요?",
   "criteria": "서로 다른 물높이의 결과와 실제에 더 필요한 조건을 함께 설명하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "방파제",
    "concept": "방파제",
    "standard": "4과16-02",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "responseContract": {
    "type": "written",
    "teacherRequired": true,
    "criteria": "서로 다른 물높이의 결과와 실제에 더 필요한 조건을 함께 설명하면 인정해요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w023",
   "no": 23,
   "form": "match",
   "topic": "필요와 실천",
   "prompt": "생활의 어려움과 도움이 되는 행동을 〈보기〉로 연결하세요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄹ (4) ㄴ",
   "explanation": "빈 교실은 전등 사용, 더운 활동은 시간·장소, 새 구입은 물건의 계속 사용과 연결해요. 많은 비의 이동은 현재 안내와 어른 도움을 확인해요. 같은 목적이라도 상황마다 필요한 행동이 달라요.",
   "misconception": "낭비 줄이기와 위험한 길에 직접 들어가 확인하는 일을 섞지 않았나요?",
   "criteria": "(1)ㄷ/(2)ㄱ/(3)ㄹ/(4)ㄴ을 연결해요.",
   "parts": [
    "(1) 아무도 없는 교실의 전등이 켜져 있다.",
    "(2) 한낮의 바깥 활동이 더위 때문에 어렵다.",
    "(3) 필요한 물건이 있는데 새 물건을 또 사려 한다.",
    "(4) 비가 많이 올 때 낮은 길을 이용하려 한다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 교사와 활동 장소·시간을 의논한다  ㄴ. 현재 안내와 안전한 이동 길을 어른과 확인한다",
    "ㄷ. 사용하지 않는 전등을 끈다  ㄹ. 가지고 있는 물건을 더 쓸 수 있는지 살핀다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "필요와 실천",
    "concept": "필요와 실천",
    "standard": "4과16-03",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "accepted": [
     "(1) ㄷ (2) ㄱ (3) ㄹ (4) ㄴ"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w024",
   "no": 24,
   "form": "choice",
   "topic": "건강과 에너지",
   "prompt": "교실에서 필요한 환경을 지키면서 낭비를 줄일 방법으로 알맞은 것은?",
   "answer": "② 교사와 필요한 냉방·환기를 하고 낭비를 줄인다",
   "explanation": "필요한 냉방·환기는 건강과 배움을 위해 유지해요. 교사와 현재 교실 상태·학교 안내를 살피며 불필요한 사용을 줄여요. 전기 절약을 이유로 필요한 공기 교환·밝기까지 없애지 않아요.",
   "misconception": "사용량을 무조건0으로 만드는 것이 실천이라고 생각하지 않았나요?",
   "criteria": "필요한 환경과 낭비 감소를 함께 고려한②를 골라요.",
   "choices": [
    "더워도 필요한 냉방과 환기를 모두 멈춘다",
    "교사와 필요한 냉방·환기를 하고 낭비를 줄인다",
    "사람이 없어도 모든 기기를 계속 켜 둔다",
    "창문 상태와 무관하게 냉방을 가장 세게 한다",
    "교실 상태를 보지 않고 매일 같은 방법만 쓴다"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "건강과 에너지",
    "concept": "건강과 에너지",
    "standard": "4과16-03",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     1
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w025",
   "no": 25,
   "form": "multi",
   "topic": "생활 조건과 실천",
   "prompt": "사람의 생활에 도움이 될 실천으로 알맞은 것을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "필요한 냉방·환기를 의논하고 쓰지 않는 기기와 물건 오래 쓰기를 살펴요. 실제 조건과 교사의 도움을 연결하면 가능한 실천이 돼요. 필요한 사용을 없애거나 학생 혼자 설비를 고치게 하지 않아요.",
   "misconception": "기기 확인은 언제나 그 기기를 끄라는 뜻으로 보지 않았나요?",
   "criteria": "냉방·환기 의논/쓰지 않는 기기 확인/물건 오래 쓰기의 세 보기를 골라요.",
   "choices": [
    "교사와 필요한 냉방·환기를 의논한다",
    "도움이 필요한 상황은 빼고 가능한 친구의 조건만 적용한다",
    "쓰지 않는 전등과 기기를 확인한다",
    "가지고 있는 물건을 오래 쓸 방법을 찾는다",
    "고장 난 설비도 학생이 직접 고쳐 절약 횟수를 채운다"
   ],
   "key": [
    0,
    2,
    3
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "생활 조건과 실천",
    "concept": "생활 조건과 실천",
    "standard": "4과16-03",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      2,
      3
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w026",
   "no": 26,
   "form": "written",
   "topic": "실천 계획",
   "prompt": "우리 반에서 할 수 있는 행동 한 가지와 필요한 도움, 실제로 해 보았는지 확인할 방법을 써요.",
   "answer": "마지막에 나가는 사람이 교사와 함께 빈 교실의 전등을 확인한다. 필요한 기기까지 끄지 않도록 사용 여부를 물어보고, 실제로 확인한 날과 놓친 때를 간단히 남긴다.",
   "explanation": "행동 한 가지에 누가·언제·어떤 사용을 확인할지 정해요. 필요한 기기 여부는 교사에게 묻고 실제 한 날과 놓친 때를 남겨요. 계획·도구 준비와 실제 실천 완료를 구별해요.",
   "misconception": "가능한 행동만 쓰고 필요한 조건이나 확인 기준을 빼지 않았나요?",
   "criteria": "실행할 행동·조건 또는 도움·실제로 했는지 확인할 방법이 이어지면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "실천 계획",
    "concept": "실천 계획",
    "standard": "4과16-03",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "responseContract": {
    "type": "written",
    "teacherRequired": true,
    "criteria": "실행할 행동·조건 또는 도움·실제로 했는지 확인할 방법이 이어지면 인정해요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w027",
   "no": 27,
   "form": "choice",
   "topic": "자료 해석",
   "prompt": "표에서 알 수 있는 것으로 알맞은 것은?",
   "answer": "① 뒤의 10년일수록 폭염 일수가 많아졌다",
   "explanation": "같은 표의 세 기간 평균이8→11→15일로 늘었어요. 기간별 평균의 차이는 읽을 수 있지만 특정 날짜의 폭염 여부는 알 수 없어요. 표가 재는 요소도 폭염 일수이므로 겨울 눈까지 정하지 않아요.",
   "misconception": "평균 일수를 특정한 달력 날짜의 관찰로 바꾸지 않았나요?",
   "criteria": "뒤의 기간으로 갈수록 제시된 폭염 일수가 늘었다는①을 골라요.",
   "choices": [
    "뒤의 10년일수록 폭염 일수가 많아졌다",
    "평균 폭염 일수로2015년7월1일의 폭염 여부도 알 수 있다",
    "앞뒤 기간의 평균 폭염 일수는15→11→8일로 줄었다",
    "같은 기간 평균이면 매년 폭염 날짜도 모두 같다",
    "평균 일수 차이가 있으므로 측정 장소·기준은 확인할 필요가 없다"
   ],
   "key": 0,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "자료 해석",
    "concept": "자료 해석",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     0
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w028",
   "no": 28,
   "form": "written",
   "topic": "자료 해석",
   "prompt": "위 표만 보고 「이 마을의 기후가 변했다」고 말하려면 무엇을 더 확인해야 할까요? 한 가지를 쓰고 까닭을 써요.",
   "answer": "세 기간 모두 같은 장소와 같은 관측·집계 기준인지 확인한다. 장소나 폭염을 세는 기준이 바뀌면 일수 차이의 뜻이 달라질 수 있으므로 다른 기간의 자료도 함께 살핀다.",
   "explanation": "같은 장소·같은 방법으로 센 값인지 확인해야 비교 뜻을 알 수 있어요. 측정 장소나 폭염을 세는 기준이 바뀌면 수가 달라질 수 있기 때문이에요. 표를 버리기보다 비교 조건과 다른 기간 자료를 더 살펴요.",
   "misconception": "기간이 길다는 것만으로 측정 기준도 같다고 보지 않았나요?",
   "criteria": "같은 장소·관측/집계 방법 등 조건 하나와 확인할 까닭을 쓰면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "자료 해석",
    "concept": "자료 해석",
    "standard": "4과16-01",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "responseContract": {
    "type": "written",
    "teacherRequired": true,
    "criteria": "같은 장소·관측/집계 방법 등 조건 하나와 확인할 까닭을 쓰면 인정해요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w029",
   "no": 29,
   "form": "choice",
   "topic": "자료 적용",
   "prompt": "가상 자료의 다섯 곳이 모두 바닷물과 연결되고 장벽이 없다고 할 때, 물높이가 올라가면 가장 먼저 물에 닿을 곳은?",
   "answer": "② 나 — 바다에서 500 m, 땅 높이 1 m",
   "explanation": "모두 같은 바닷물과 연결되고 장벽이 없다는 가상 조건이에요. 땅1m인나가 다른 곳보다 낮아 먼저 물에 닿아요. 실제 지형·물길·시설을 조사한 안전 지도로 해석하지 않아요.",
   "misconception": "바다와20m로 가장 가까운다의 땅8m를 놓치지 않았나요?",
   "criteria": "조건에서 가장 낮은나를 골라요.",
   "key": 1,
   "choices": [
    "가 — 바다에서 50 m, 땅 높이 2 m",
    "나 — 바다에서 500 m, 땅 높이 1 m",
    "다 — 바다에서 20 m, 땅 높이 8 m",
    "라 — 바다에서 1 km, 땅 높이 15 m",
    "마 — 바다에서 200 m, 땅 높이 4 m"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "자료 적용",
    "concept": "자료 적용",
    "standard": "4과16-02",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     1
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w030",
   "no": 30,
   "form": "draw",
   "topic": "자료 적용",
   "prompt": "29번의 다섯 곳을 땅 높이 순서의 막대그래프로 나타내고3 m 물높이 선을 그으세요. 자료의 조건에서 물에 닿을 곳을 표시하세요.",
   "answer": "높이 순서로 나1 m·가2 m·마4 m·다8 m·라15 m의 막대를 나타내고3 m선 아래인 나·가를 표시한다.",
   "explanation": "높이 작은 순서는나1·가2·마4·다8·라15m예요. 같은 눈금에서3m선을 그으면나·가가 그 아래예요. 이름을 높이 순서로 놓은 그래프이며 실제 해안 위치나 단면은 아니에요.",
   "misconception": "막대 이름을 높이 순서로 놓은 것을 실제 땅 배치로 보지 않았나요?",
   "criteria": "이름·다섯 높이·같은 눈금/단위·3m선과나·가 표시가 맞으면 인정해요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "자료 적용",
    "concept": "자료 적용",
    "standard": "4과16-02",
    "itemType": "draw",
    "inquirySkill": "자료와 근거를 그림으로 표현하기"
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "criteria": "이름·다섯 높이·같은 눈금/단위·3m선과나·가 표시가 맞으면 인정해요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w031",
   "no": 31,
   "form": "blank",
   "topic": "정리",
   "prompt": "날씨는 그날그날의 기온·비·바람 등의 [ ]이고, 기후는 한 지역에서 오랜 기간 나타나는 [ ]적인 날씨예요.",
   "answer": "상태 / 평균",
   "explanation": "특정 날의 기온·비·바람은 그때의 상태예요. 기후는 한 지역의 오랜 기간 평균적인 날씨 모습이에요. 평균적이라는 말은 매일 같다는 뜻과 달라요.",
   "misconception": "상태와 평균을 빈칸의 앞뒤 순서와 맞췄나요?",
   "criteria": "상태/평균을 순서대로 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "정리",
    "concept": "정리",
    "standard": "4과16-01",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "accepted": [
     "상태 / 평균"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w032",
   "no": 32,
   "form": "blank",
   "topic": "정리",
   "prompt": "사람의 생활과 기후변화는 서로 [ ]되어 있으므로, 할 수 있는 일을 자료로 살펴봐요.",
   "answer": "관련",
   "explanation": "인간의 생활과 기후변화의 관련성을 자료로 살펴요. 사례·생활 영향·가능한 대응을 근거로 이어 설명해요. 같은 시기 두 일이 있었다는 것만으로 원인 전부가 밝혀진 것은 아니에요.",
   "misconception": "관련성을 조사하는 일과 원인을 하나로 단정하는 일을 나눴나요?",
   "criteria": "관련·관계처럼 같은 뜻의 말을 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "정리",
    "concept": "정리",
    "standard": "4과16-01",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "accepted": [
     "관련"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w033",
   "no": 33,
   "form": "blank",
   "topic": "정리",
   "prompt": "모든 집이 같은 물과 연결된 해안 모형에서는 바다와의 [ ]만 보지 않고 땅의 [ ]도 비교해요.",
   "answer": "거리 / 높이",
   "explanation": "이 모형의 모든 집은 같은 물과 연결돼 있어요. 가까운A도 땅4.5cm로 높아 물4cm에서 안 젖었으므로 거리만으로 정할 수 없어요. 거리와 함께 땅 높이를 비교해요.",
   "misconception": "가까운 집이 언제나 먼저 젖는다고 생각하지 않았나요?",
   "criteria": "거리/높이를 제시 순서로 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "정리",
    "concept": "정리",
    "standard": "4과16-02",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "accepted": [
     "거리 / 높이"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w034",
   "no": 34,
   "form": "blank",
   "topic": "정리",
   "prompt": "앞으로 하려는 일은 [ ], 실제로 한 행동은 실천 기록으로 구별해요.",
   "answer": "계획",
   "explanation": "앞으로 할 시기·행동을 정한 것은 계획이에요. 행동한 뒤 실제로 한 일·어려움을 확인한 기록과 구별해요. 계획을 적었다는 사실만으로 그 횟수를 실적으로 세지 않아요.",
   "misconception": "할 마음이나 준비가 있었다는 것과 실제 실행을 같게 보지 않았나요?",
   "criteria": "계획을 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "정리",
    "concept": "정리",
    "standard": "4과16-03",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "accepted": [
     "계획"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w035",
   "no": 35,
   "form": "choice",
   "topic": "날씨와 기후",
   "prompt": "「우리 지역은 여러 해에 걸쳐 겨울에 바람이 강하고 눈이 적은 모습이 되풀이된다.」 이 설명의 범위에 알맞은 말은?",
   "answer": "④ 기후",
   "explanation": "여러 해 겨울에 되풀이되는 지역의 모습을 설명했어요. 오늘 하루의 기온·바람을 잰 기록과 다른 범위예요. 이 지역의 모든 겨울날에 바람과 눈이 항상 같다는 뜻은 아니에요.",
   "misconception": "겨울이라는 말 하나만으로 기후를 골라 버리지 않았나요?",
   "criteria": "오랜 기간 지역 모습을 나타내는기후를 골라요.",
   "choices": [
    "날씨",
    "계절",
    "기온",
    "기후",
    "해수면"
   ],
   "key": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "날씨와 기후",
    "concept": "날씨와 기후",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     3
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w036",
   "no": 36,
   "form": "choice",
   "topic": "평년",
   "prompt": "같은 지역·같은 기상요소에서 긴 기간의 기후변화를 살펴보려 합니다. 가장 알맞은 방법은?",
   "answer": "③ 평년값과 최근 여러 해의 평균을 비교한다",
   "explanation": "같은 지역·기상요소에서 평년과 최근 여러 해 자료를 비교해요. 오늘·어제나 한 달 기록도 관찰 자료지만 그것만으로 긴 변화 전체를 정하기에는 부족해요. 서로 다른 지역의 당일 값을 비교하는 것과도 달라요.",
   "misconception": "하루나 한 달 관찰은 아무 가치가 없다고 넓히지 않았나요?",
   "criteria": "같은 지역·요소를 전제로 평년과 여러 해 평균을 비교하는③을 골라요.",
   "choices": [
    "오늘 기온과 어제 기온을 비교한다",
    "올해 가장 추운 날의 기온만 살펴본다",
    "평년값과 최근 여러 해의 평균을 비교한다",
    "다른 나라의 오늘 날씨와 우리 날씨를 비교한다",
    "이번 달에 비가 온 날이 며칠인지 센다"
   ],
   "key": 2,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "평년",
    "concept": "평년",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     2
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w037",
   "no": 37,
   "form": "order",
   "topic": "해안 모형의 비교",
   "prompt": "모형에서 물높이에 따른 변화를 확인할 순서로 기호를 쓰세요.",
   "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
   "explanation": "땅·집·읽는 기준을 먼저 같게 정해요. 물을 정한 높이까지 넣고 안정되면 높이와 닿은 집을 기록한 뒤 비교해요. 결과를 미리 정해 맞추거나 물이 높아지는 원인 전체를 재현한 것은 아니에요.",
   "misconception": "관찰할 집 수까지 미리 같게 두는 조건으로 넣지 않았나요?",
   "criteria": "ㄷ→ㄹ→ㄱ→ㄴ을 순서대로 써요.",
   "given": [
    "ㄱ. 정한 물높이에서 물이 차분해지면 기록한다",
    "ㄴ. 기록한 물높이와 물에 닿은 집을 비교한다",
    "ㄷ. 땅·집 위치와 읽는 자리를 같게 정한다",
    "ㄹ. 정한 높이까지 물을 조금씩 넣는다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해안 모형의 비교",
    "concept": "해안 모형의 비교",
    "standard": "4과16-02",
    "itemType": "order",
    "inquirySkill": "조사·비교 과정 구성하기"
   },
   "responseContract": {
    "type": "order",
    "teacherRequired": false,
    "accepted": [
     "ㄷ → ㄹ → ㄱ → ㄴ"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w038",
   "no": 38,
   "form": "short",
   "topic": "해수면 모형",
   "prompt": "해안 마을 모형에서 방파제가 없을 때 물높이 2 cm에서 물에 닿은 집은 몇 채이고, 어느 집인가요?",
   "answer": "1채(B)",
   "explanation": "벽 없이 물2cm와 각 땅 높이를 비교해요. B1.5cm만2cm 이하이므로1채(B)예요. 집 수와 집 이름을 함께 밝혀 다른 조건의 결과와 구별해요.",
   "misconception": "C2.5cm도2cm에서 젖는다고 넣지 않았나요?",
   "criteria": "1채와B를 함께 쓰면 인정해요.",
   "given": [
    "땅 높이(모형 값): A 4.5 cm · B 1.5 cm · C 2.5 cm · D 3.5 cm · E 6 cm"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해수면 모형",
    "concept": "해수면 모형",
    "standard": "4과16-02",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "short",
    "teacherRequired": false,
    "accepted": [
     "1채(B)"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w039",
   "no": 39,
   "form": "choice",
   "topic": "모형의 한계",
   "prompt": "해안 마을 모형실험의 한계로 알맞은 것은?",
   "answer": "⑤ 실제 바다의 파도와 밀물·썰물은 나타내지 못한다",
   "explanation": "이 모형은 물·땅 높이와 벽 유무에 따른 집의 젖음을 비교해요. 실제 파도·밀물과 썰물 같은 움직임까지 나타내지 못해요. 할 수 있는 비교를 전부 불가능하다고 하거나 실제 안전을 확정하지 않아요.",
   "misconception": "일부 한계가 있다는 것을 모형의 모든 결과가 쓸모없다는 뜻으로 보지 않았나요?",
   "criteria": "실제 파도·밀물과 썰물을 나타내지 못한다는⑤를 골라요.",
   "choices": [
    "같은 수조의 결과이므로 실제 마을의 안전도 모두 확정한다",
    "모형 물1cm를 축척 확인 없이 실제 바다1m로 바꾼다",
    "모형에서 안 젖은 집은 실제 어떤 파도에도 안전하다",
    "일부 실제 조건이 없으므로 모형의 높이 비교도 모두 쓸모없다",
    "실제 바다의 파도와 밀물·썰물은 나타내지 못한다"
   ],
   "key": 4,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "모형의 한계",
    "concept": "모형의 한계",
    "standard": "4과16-02",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     4
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w040",
   "no": 40,
   "form": "multi",
   "topic": "기후변화의 영향",
   "prompt": "기후변화로 우리 생활에 생길 수 있는 일을 모두 고르세요.",
   "answer": "②, ④, ⑤",
   "explanation": "폭염·가뭄·짧은 시간 많은 비는 건강·물 이용·이동에 어려움을 줄 수 있어요. 같은 현상도 지역·시설·사람의 필요에 따라 영향이 달라요. 전국 평균 상승이 모든 추운 날의 소멸이나 같은 비의 양을 뜻하지 않아요.",
   "misconception": "모든 지역·모든 날에 같은 영향이라고 넓히지 않았나요?",
   "criteria": "건강·물 부족·낮은 길 침수의 세 보기를 모두 골라요.",
   "choices": [
    "기온이 오르면 어느 지역에도 추운 날이 없어져요",
    "폭염 때 더위로 아픈 사람이 늘어난다",
    "비는 모든 지역에서 늘 같은 양만큼 내려요",
    "가뭄으로 마실 물과 농사지을 물이 모자란다",
    "짧은 시간에 내린 많은 비로 낮은 길이 잠긴다"
   ],
   "key": [
    1,
    3,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기후변화의 영향",
    "concept": "기후변화의 영향",
    "standard": "4과16-01",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      3,
      4
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w041",
   "no": 41,
   "form": "match",
   "topic": "실천에 필요한 도움",
   "prompt": "행동과 함께 확인할 것을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "기기 끄기 전에는 지금 필요한지, 이동 전에는 현재 안내·도움을 확인해요. 오래 쓰려는 물건은 수선·공유 가능성을 살펴요. 방법 이름만 같다고 모든 상황에 같은 행동을 적용하지 않아요.",
   "misconception": "좋은 뜻의 실천이면 필요한 기기까지 꺼도 된다고 보지 않았나요?",
   "criteria": "(1)ㄴ/(2)ㄷ/(3)ㄱ을 각각 연결해요.",
   "parts": [
    "(1) 사용하지 않는 기기를 끄려 한다.",
    "(2) 비가 많이 올 때의 이동 방법을 정한다.",
    "(3) 물건을 더 오래 쓰려 한다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 고쳐 쓰거나 함께 쓸 수 있는가  ㄴ. 지금 꼭 써야 하는 기기는 아닌가  ㄷ. 현재 안내와 어른의 도움이 있는가"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "실천에 필요한 도움",
    "concept": "실천에 필요한 도움",
    "standard": "4과16-03",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "accepted": [
     "(1) ㄴ (2) ㄷ (3) ㄱ"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w042",
   "no": 42,
   "form": "choice",
   "topic": "해수면 상승",
   "prompt": "물이 드나드는 낮고 평평한 해안(장벽 없음)에서 피해가 넓어질 수 있는 까닭은?",
   "answer": "② 물이 닿을 수 있는 낮은 땅의 범위가 넓어서",
   "explanation": "물이 드나들고 장벽이 없다는 조건을 먼저 읽어요. 낮고 평평한 땅이 넓으면 높아진 물이 닿을 범위가 넓어질 수 있어요. 실제 피해는 파도·시설·물길을 함께 확인해야 해요.",
   "misconception": "낮은 땅의 범위 대신 바다와의 거리만 비교하지 않았나요?",
   "criteria": "주어진 연결 조건과 낮은 땅 범위를 연결한②를 골라요.",
   "choices": [
    "물높이만 같으면 땅 높이는 관계없어서",
    "물이 닿을 수 있는 낮은 땅의 범위가 넓어서",
    "바다와 멀면 낮은 땅에도 물이 안 닿아서",
    "한 곳의 결과가 모든 해안에도 같아서",
    "물길이 끊겨도 가까우면 물이 들어와서"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해수면 상승",
    "concept": "해수면 상승",
    "standard": "4과16-02",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     1
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w043",
   "no": 43,
   "form": "blank",
   "topic": "모형과 실제",
   "prompt": "학습을 위해 정한 땅 높이는 [ ] 값이며, 실제 우리 마을의 높이를 잰 값과는 달라요.",
   "answer": "모형",
   "explanation": "학습을 위해 정한 높이는 모형 값이에요. 실제 마을의 높이를 직접 측정한 자료는 아니에요. 그 수를 실제 지형·피해 시점·안전 높이로 바꾸지 않아요.",
   "misconception": "모형 숫자에 실제 지명만 붙이면 현장 자료가 된다고 보지 않았나요?",
   "criteria": "모형을 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "모형과 실제",
    "concept": "모형과 실제",
    "standard": "4과16-02",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "accepted": [
     "모형"
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w044",
   "no": 44,
   "form": "written",
   "topic": "해수면 모형",
   "prompt": "친구가 「바닷가 집은 모두 위험하고 먼 집은 모두 안전해」라고 말했어요. 모형의 집A·D를 근거로 고치고 실제 마을에서 더 확인할 것도 쓰세요.",
   "answer": "이 모형에서 가까운 집A는4.5 cm의 높은 땅에 있어4 cm에서 젖지 않았고 더 먼 집D는3.5 cm라 물에 닿았다. 거리 하나로 정할 수 없다. 실제 마을은 물이 들어오는 길·장벽·경보·이동 길 등도 어른과 확인해야 한다.",
   "explanation": "물4cm에서A땅4.5cm는안젖고 D땅3.5cm는젖어요. 거리는 달라도 이 모형에서는 땅 높이가 결과를 설명하는 근거예요. 실제 마을은 물길·장벽·시설·현재 안내를 더 확인해요.",
   "misconception": "가까운A와 먼D의 서로 다른 실제 모형 결과를 함께 썼나요?",
   "criteria": "A·D의 결과와 높이 근거, 실제에 더 확인할 조건을 함께 쓰면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "해수면 모형",
    "concept": "해수면 모형",
    "standard": "4과16-02",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "responseContract": {
    "type": "written",
    "teacherRequired": true,
    "criteria": "A·D의 결과와 높이 근거, 실제에 더 확인할 조건을 함께 쓰면 인정해요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w045",
   "no": 45,
   "form": "draw",
   "topic": "함께 하는 실천",
   "prompt": "우리 학교나 동네의 상황을 하나 골라 도움이 되는 행동 두 가지를 안내문으로 그리세요. 행동·까닭·필요한 어른의 도움을 짧게 붙이세요.",
   "answer": "예: 교사와 빈 교실 전등의 사용 여부를 확인하고, 가진 물건을 계속 쓸 방법을 살피는 두 그림. 필요한 밝기 유지와 낭비 감소의 까닭, 수선이나 기기 확인에 필요한 도움을 붙이며 실제 실행 여부는 따로 적는다.",
   "explanation": "두 행동이 어떤 낭비나 생활 어려움에 도움이 되는지 연결해요. 따라 할 수 있는 상황·필요한 도움을 그림과 짧은 글로 보여 줘요. 안내문 제작과 실제 실천·의견 확인은 별도예요.",
   "misconception": "그림을 만들었다는 이유로 실제 행동이나 전달까지 끝났다고 쓰지 않았나요?",
   "criteria": "행동2개·각 까닭·도움이나 조건이 드러나면 인정해요. 그림 솜씨로 판단하지 않아요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "함께 하는 실천",
    "concept": "함께 하는 실천",
    "standard": "4과16-03",
    "itemType": "draw",
    "inquirySkill": "자료와 근거를 그림으로 표현하기"
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "criteria": "행동2개·각 까닭·도움이나 조건이 드러나면 인정해요. 그림 솜씨로 판단하지 않아요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w046",
   "no": 46,
   "form": "written",
   "topic": "함께 하는 실천",
   "prompt": "해수면이 높아질 수 있는 가상의 바닷가 마을에 의견을 보내려고 해요. 모형에서 배운 점과 어린이가 할 수 있는 행동, 어른과 함께 정할 일을 써요.",
   "answer": "모형에서는 땅 높이와 물높이를 함께 봐야 했다. 실제 마을의 경보와 안전한 길은 어른과 확인하고, 어린이는 물건과 전기를 낭비하지 않는 행동이나 현재 안내를 알리는 일을 한다. 실제로 한 일과 계획을 나눈다.",
   "explanation": "모형에서 땅·물 높이를 비교한 근거를 생활의 질문으로 이어요. 실제 이동·시설은 현재 안내와 어른 도움을 확인하고 어린이는 가능한 낭비 감소·정보 확인 역할을 찾아요. 계획과 실제 행동을 나눠요.",
   "misconception": "어린이 실천만으로 실제 해안 시설이나 안전도 모두 해결된다고 보지 않았나요?",
   "criteria": "모형 근거·가능한 행동·공동 도움과 실제 조건이 연결되면 인정해요.",
   "lines": 5,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "함께 하는 실천",
    "concept": "함께 하는 실천",
    "standard": "4과16-03",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "responseContract": {
    "type": "written",
    "teacherRequired": true,
    "criteria": "모형 근거·가능한 행동·공동 도움과 실제 조건이 연결되면 인정해요."
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w047",
   "no": 47,
   "form": "choice",
   "topic": "기온 자료 비교",
   "prompt": "2024년과 2025년의 전국 연평균 기온을 제시된 평년과 함께 비교한 설명으로 알맞은 것은?",
   "answer": "① 두 해 모두 제시된 평년보다 높았다",
   "explanation": "2024년14.5와2025년13.7은 모두평년12.5℃보다 높아요. 2025년이2024년보다 낮다는 사실과 두 해 모두 평년보다 높다는 사실은 함께 맞아요. 비교 대상을 먼저 밝혀요.",
   "misconception": "앞선 해보다 낮다는 말과 평년보다 낮다는 말을 섞지 않았나요?",
   "criteria": "두 해 모두 제시된 평년보다 높다는①을 골라요.",
   "choices": [
    "두 해 모두 제시된 평년보다 높았다",
    "2024년만 제시된 평년보다 높았다",
    "2025년만 제시된 평년보다 높았다",
    "두 해 모두 제시된 평년보다 낮았다",
    "두 해의 전국 연평균 기온은 같았다"
   ],
   "key": 0,
   "contextRef": "annual-temperature-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기온 자료 비교",
    "concept": "기온 자료 비교",
    "standard": "4과16-01",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     0
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w048",
   "no": 48,
   "form": "multi",
   "topic": "기온 자료의 범위",
   "prompt": "자료를 바르게 읽은 설명을 모두 고르세요.",
   "answer": "②, ④",
   "explanation": "전국·한 해 평균13.7℃와1991~2020년30년 평년을 읽어요. 우리 학교 매일 값을 직접 측정한 자료는 아니에요. 두 해만으로 모든 미래 기온을 정하지 않아요.",
   "misconception": "전국 한 해 평균을 학교의 매일 기온과 같게 보지 않았나요?",
   "criteria": "2025년13.7℃와30년 평년 기간에 해당하는 두 보기를 골라요.",
   "choices": [
    "2025년의 모든 날은 2024년보다 추웠다",
    "2025년 전국 연평균 기온은 13.7 ℃이다",
    "우리 학교의 2025년 기온을 직접 잰 값이다",
    "평년은 1991~2020년 30년 평균이다",
    "두 해의 값만으로 이후 모든 해의 기온을 정할 수 있다"
   ],
   "key": [
    1,
    3
   ],
   "contextRef": "annual-temperature-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기온 자료의 범위",
    "concept": "기온 자료의 범위",
    "standard": "4과16-01",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      3
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w049",
   "no": 49,
   "form": "blank",
   "topic": "평균의 기준",
   "prompt": "평년은 [ ]년 평균이고, 2024년과 2025년의 값은 각각 [ ]년 동안의 평균이에요.",
   "answer": "30 / 1",
   "explanation": "평년은30년 자료의 평균이고2024·2025는각각1년 평균이에요. 뒤 두 값을 하나로 합친2년 평균이 아니에요. 평년을 연속된 바로 앞 한 해로 놓지 않아요.",
   "misconception": "평년·2024·2025를 연속된 세 해처럼 읽지 않았나요?",
   "criteria": "30/1을 빈칸 순서대로 쓰면 인정해요.",
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "30",
      "1"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "annual-temperature-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "평균의 기준",
    "concept": "평균의 기준",
    "standard": "4과16-01",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w050",
   "no": 50,
   "form": "short",
   "topic": "두 해의 비교",
   "prompt": "2025년의 전국 연평균 기온은 2024년보다 몇 ℃ 낮았나요?",
   "answer": "0.8 ℃",
   "explanation": "두 한 해 평균의 차이는14.5−13.7=0.8(℃)이에요. 2025년이2024년보다 낮은 정도를 물었어요. 평년과의 차이나 날짜별 기온 감소량으로 답하지 않아요.",
   "misconception": "평년12.5℃를 빼거나0.8℃를 모든 날의 차이로 쓰지 않았나요?",
   "criteria": "0.8℃와 단위를 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "0.8 ℃"
    ],
    "teacherRequired": false,
    "value": 0.8,
    "unit": "℃",
    "unitRequired": true
   },
   "contextRef": "annual-temperature-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "두 해의 비교",
    "concept": "두 해의 비교",
    "standard": "4과16-01",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w051",
   "no": 51,
   "form": "match",
   "topic": "자료의 종류",
   "prompt": "설명과 알맞은 자료를 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "12.5℃는30년 전국 기준,13.7℃는2025전국 한 해 평균이에요. 학교 오늘 낮 기온은 대상·기간이 달라 이 자료에 없어요. 아는 숫자를 다른 범위의 빈칸에 옮기지 않아요.",
   "misconception": "전국 한 해 평균13.7을 학교 오늘 값으로 쓰지 않았나요?",
   "criteria": "(1)ㄴ/(2)ㄷ/(3)ㄱ을 연결해요.",
   "parts": [
    "(1) 30년 동안의 전국 연평균 기온 기준",
    "(2) 2025년 전국의 한 해 평균",
    "(3) 우리 학교의 오늘 낮 기온"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 이 자료에 없는 정보  ㄴ.12.5 ℃  ㄷ.13.7 ℃"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄴ",
      "ㄷ",
      "ㄱ"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "annual-temperature-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "자료의 종류",
    "concept": "자료의 종류",
    "standard": "4과16-01",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w052",
   "no": 52,
   "form": "order",
   "topic": "기온 자료 읽는 순서",
   "prompt": "자료를 비교하고 설명하는 순서로 기호를 쓰세요.",
   "answer": "ㄱ → ㄹ → ㄴ → ㄷ",
   "explanation": "기관·지역·기간·단위를 확인한 뒤 비교할 두 값을 정해요. 같은 지표의 차이를 구하고 그 차이로 말할 수 있는 범위를 설명해요. 숫자부터 빼면 다른 기간·요소를 섞을 수 있어요.",
   "misconception": "아무 두 숫자를 빼고 나서 무엇을 잰 자료인지 확인하지 않았나요?",
   "criteria": "ㄱ→ㄹ→ㄴ→ㄷ를 순서대로 써요.",
   "given": [
    "ㄱ. 자료의 기관·지역·기간·단위를 확인한다.",
    "ㄴ. 같은 기준끼리 차이를 구한다.",
    "ㄷ. 알 수 있는 것과 없는 것을 나누어 설명한다.",
    "ㄹ. 비교할 두 값을 고른다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄱ",
      "ㄹ",
      "ㄴ",
      "ㄷ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기온 자료 읽는 순서",
    "concept": "기온 자료 읽는 순서",
    "standard": "4과16-01",
    "itemType": "order",
    "inquirySkill": "조사·비교 과정 구성하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w053",
   "no": 53,
   "form": "written",
   "topic": "한 해와 기후변화",
   "prompt": "친구가 「2025년은 2024년보다 낮으니 기후변화가 끝났어」라고 했어요. 이 자료로 확인한 사실과 더 알아볼 것을 나누어 답하세요.",
   "answer": "2025년의 전국 한 해 평균은 2024년보다 0.8 ℃ 낮다. 하지만 두 해의 비교만으로 장기 변화가 끝났다고 판단할 수 없다. 같은 지역·요소의 여러 해 자료와 평년 비교를 더 살펴야 한다.",
   "explanation": "2025년이앞해보다0.8℃낮은 것은 자료의 사실이에요. 두 해 모두 평년보다 높고 두 값만으로 긴 변화의 끝을 확인하지 못해요. 같은 지역·요소의 여러 해 자료를 더 살펴요.",
   "misconception": "낮아진 한 해의 사실을 지우거나 그것만으로 장기 결론을 내리지 않았나요?",
   "criteria": "두 해 차이·장기 판단의 한계·더 볼 자료를 연결하면 인정해요.",
   "lines": 5,
   "given": [
    "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
   ],
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "두 해의 실제 차이",
     "장기 변화 종료 단정 불가",
     "같은 기준의 여러 해 자료"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "한 해와 기후변화",
    "concept": "한 해와 기후변화",
    "standard": "4과16-01",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w054",
   "no": 54,
   "form": "draw",
   "topic": "기온 자료의 그림",
   "prompt": "평년·2024년·2025년의 기온을 같은 눈금의 막대 3개로 그리세요. 세로축은 0~16 ℃로 하고, 평년이 30년 기준임을 표시하세요.",
   "answer": "평년 12.5·2024년 14.5·2025년 13.7의 막대를 0 ℃ 기준 같은 눈금으로 그린다. 평년(1991~2020년 30년 평균)과 각 한 해 평균을 구별해 적는다.",
   "explanation": "0~16℃의 같은 눈금에서12.5·14.5·13.7을 표시해요. 평년은30년 기준이고 뒤의 두 막대는각1년 평균이에요. 길이뿐 아니라 이름·단위·기간도 있어야 비교 뜻이 분명해요.",
   "misconception": "세 막대를 연속된 세 해로 적거나 시작점을 다르게 하지 않았나요?",
   "criteria": "세 값·같은0/눈금·℃·평년 기간을 표현하면 인정해요. 그림 솜씨는 따지지 않아요.",
   "drawing": "large",
   "given": [
    "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
   ],
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "세 값",
     "같은 0기준과눈금",
     "단위",
     "평년의 기간"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-01",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기온 자료의 그림",
    "concept": "기온 자료의 그림",
    "standard": "4과16-01",
    "itemType": "draw",
    "inquirySkill": "자료와 근거를 그림으로 표현하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w055",
   "no": 55,
   "form": "choice",
   "topic": "방파제 효과의 비교",
   "prompt": "이 자료에서 방파제 유무만 달리한 관찰 결과를 비교하려면 어느 둘을 골라야 하나요?",
   "answer": "④ 가와 나",
   "explanation": "가·나는물3cm와땅·집·읽기 조건이 같고 벽 유무만 달라요. 가·다는 물과 벽이 함께 달라 벽만의 비교가 아니에요. 라는 실제 결과가 미기록이라 관찰 비교의 값으로 채울 수 없어요.",
   "misconception": "라를 나와 같은 조건이라는 이유로 같은 관찰 결과라고 채우지 않았나요?",
   "criteria": "관찰한 두 조건 중 벽만 달리한가와나를 골라요.",
   "choices": [
    "가와 다",
    "나와 라",
    "다와 라",
    "가와 나",
    "가와 라"
   ],
   "key": 3,
   "contextRef": "sea-comparison-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "방파제 효과의 비교",
    "concept": "방파제 효과의 비교",
    "standard": "4과16-02",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     3
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w056",
   "no": 56,
   "form": "multi",
   "topic": "모형 결과의 조건",
   "prompt": "제시 자료에서 바르게 판단한 것을 모두 고르세요.",
   "answer": "①, ②, ③, ⑤",
   "explanation": "가·나의 물은3cm, 나·다의 벽은3.5cm예요. 다의물4cm는벽보다 높고 라의 실제 결과는 미기록이에요. 이 네 사실로 실제 모든 지역의 안전까지 확인한 것은 아니에요.",
   "misconception": "설정 조건이 같다는 이유로 미기록 결과를 아는 값으로 바꾸지 않았나요?",
   "criteria": "물/벽 비교와라의 미기록에 해당하는 네 보기를 모두 골라요.",
   "choices": [
    "가와 나의 물높이는 같다",
    "나와 다는 방파제 높이가 같다",
    "다에서는 물이 방파제보다 높다",
    "이 모형으로 실제 모든 마을의 안전을 확정한다",
    "라의 실제 관찰 결과는 적히지 않았다"
   ],
   "key": [
    0,
    1,
    2,
    4
   ],
   "contextRef": "sea-comparison-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "모형 결과의 조건",
    "concept": "모형 결과의 조건",
    "standard": "4과16-02",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      1,
      2,
      4
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w057",
   "no": 57,
   "form": "blank",
   "topic": "관찰과 예상",
   "prompt": "다에서 물에 닿은 집은 [ ]채예요. 라의 실제 관찰 결과는 「0채」로 채우지 않고 「[ ]」으로 남겨요.",
   "answer": "3 / 미기록",
   "explanation": "다는B·C·D의3채가 젖은 결과예요. 라는 관찰 계획만 있어 실제 결과는 미기록이에요. 같은 조건에서 예상은 가능해도 예상한0채가 실제 기록을 대신하지 않아요.",
   "misconception": "라의 예상값과 실제 관찰값을 같은 것으로 쓰지 않았나요?",
   "criteria": "3/미기록을 순서대로 쓰면 인정해요.",
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "3",
      "미기록"
     ]
    ],
    "teacherRequired": false,
    "acceptedEquivalent": "관찰 기록 없음"
   },
   "contextRef": "sea-comparison-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "관찰과 예상",
    "concept": "관찰과 예상",
    "standard": "4과16-02",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w058",
   "no": 58,
   "form": "short",
   "topic": "피해 수 비교",
   "prompt": "가보다 나에서 물에 닿은 집이 몇 채 적었나요?",
   "answer": "2채",
   "explanation": "가의B·C2채와나의0채를 비교하면2−0=2채 적어요. 물3cm와고정 배치에서 벽 유무를 달리한 모형 비교예요. 실제 마을에서 줄 피해 가구 수나 모든 물높이의 효과는 아니에요.",
   "misconception": "두 결과 차이를 실제 가구 감소 수로 바꾸지 않았나요?",
   "criteria": "이 모형의 차이2채를 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "2채"
    ],
    "teacherRequired": false,
    "value": 2,
    "unit": "채",
    "unitRequired": true
   },
   "contextRef": "sea-comparison-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "피해 수 비교",
    "concept": "피해 수 비교",
    "standard": "4과16-02",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w059",
   "no": 59,
   "form": "match",
   "topic": "공정한 비교의 역할",
   "prompt": "가와 나를 비교할 때 각 조건의 역할을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄹ (3) ㄱ (4) ㄷ",
   "explanation": "벽은 바꿀 조건, 물3cm와땅·집 배치는 같게 둘 조건이에요. 물에 닿은 집 수는 관찰하여 비교할 결과예요. 결과까지 미리 같게 맞추면 차이를 살필 수 없어요.",
   "misconception": "젖은 집 수를 같게 할 조건으로 넣지 않았나요?",
   "criteria": "(1)ㄴ/(2)ㄹ/(3)ㄱ/(4)ㄷ를 연결해요.",
   "parts": [
    "(1) 방파제 유무",
    "(2) 물높이 3 cm",
    "(3) 물에 닿은 집의 수",
    "(4) 땅 모양과 집 위치"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 비교할 결과  ㄴ. 바꿀 조건  ㄷ. 같게 둘 육지·집 조건  ㄹ. 같게 둘 물 조건"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄴ",
      "ㄹ",
      "ㄱ",
      "ㄷ"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "sea-comparison-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "공정한 비교의 역할",
    "concept": "공정한 비교의 역할",
    "standard": "4과16-02",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w060",
   "no": 60,
   "form": "order",
   "topic": "방파제 비교 순서",
   "prompt": "다음 비교 실험의 순서로 기호를 쓰세요.",
   "answer": "ㄹ → ㄴ → ㄷ → ㄱ",
   "explanation": "같게 할 조건을 정하고 벽 없는3cm결과를 기록해요. 처음 상태로 맞춘 뒤 벽을 세운3cm결과를 얻어 비교해요. 첫 시행의 상태가 남아 있으면 벽만의 차이가 아닐 수 있어요.",
   "misconception": "벽을 세우기만 하면 처음 상태 확인은 필요 없다고 보지 않았나요?",
   "criteria": "ㄹ→ㄴ→ㄷ→ㄱ을 순서대로 써요.",
   "given": [
    "ㄱ. 두 결과를 같은 기준으로 비교한다.",
    "ㄴ. 방파제 없이 3 cm에서 물에 닿은 집을 기록한다.",
    "ㄷ. 처음 상태로 되돌리고 벽을 세워 3 cm에서 기록한다.",
    "ㄹ. 땅·집·읽는 위치와 기록 기준을 같게 정한다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄹ",
      "ㄴ",
      "ㄷ",
      "ㄱ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "방파제 비교 순서",
    "concept": "방파제 비교 순서",
    "standard": "4과16-02",
    "itemType": "order",
    "inquirySkill": "조사·비교 과정 구성하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w061",
   "no": 61,
   "form": "written",
   "topic": "모형에서 실제로",
   "prompt": "「나에서 0채였으니 방파제가 있는 실제 마을은 늘 안전하다」는 발표를 고쳐 쓰세요. 나·다의 결과와 실제 지역에서 확인할 것을 넣으세요.",
   "answer": "나에서는 물 3 cm로 0채였지만 다에서는 물 4 cm로 벽 3.5 cm를 넘어B·C·D가 젖었다. 실제 마을은 파도·물이 들어올 길·지형·시설 상태·현재 안내 등을 어른과 더 확인해야 하므로 늘 안전하다고 할 수 없다.",
   "explanation": "나의물3cm에서는0채, 다의물4cm에서는같은벽3.5cm를넘어B·C·D가젖어요. 벽이 있어도 물높이 조건에 따라 결과가 달라요. 실제 파도·시설·물길과 현재 안내는 별도 확인해야 해요.",
   "misconception": "0채 한 결과로 실제 마을이 늘 안전하다고 정하지 않았나요?",
   "criteria": "나/다 결과·물과벽 비교·실제 추가 조건을 함께 설명하면 인정해요.",
   "lines": 5,
   "given": [
    "연습용 해안 모형 자료예요. 땅 높이는A4.5·B1.5·C2.5·D3.5·E6 cm이고 모든 집이 같은 물과 연결되어 있어요. 가: 물 3 cm·벽 없음→B, C. 나: 물 3 cm·벽 3.5 cm→물에 닿은 집 0채. 다: 물 4 cm·벽 3.5 cm→B, C, D. 라: 물 3 cm·벽 3.5 cm로 관찰할 계획이나 결과는 미기록이에요. 나머지 조건은 같고 실제 마을의 기록이 아니에요."
   ],
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "나 0채와다 3채",
     "물높이와벽높이",
     "실제추가조건"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "모형에서 실제로",
    "concept": "모형에서 실제로",
    "standard": "4과16-02",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w062",
   "no": 62,
   "form": "draw",
   "topic": "비교 그림",
   "prompt": "가와 나의 통을 나란히 그려 물높이·방파제 높이와 물에 닿은 집을 표시하세요. 두 결과를 실제 마을의 안전으로 단정하지 않는 설명도 붙이세요.",
   "answer": "두 통 모두 물 3 cm. 가는 벽 없음/B·C에 표식, 나는 벽 3.5 cm/젖은 집 없음. 같은 땅·집 조건의 모형 비교이며 실제 안전은 더 확인해야 한다고 적는다.",
   "explanation": "두 통의 물을 모두3cm로 표시해 같은 조건임을 보여 줘요. 가는벽없음/B·C, 나는벽3.5cm/0채를 나란히 나타내요. 실제 마을 안전의 그림이나 축척으로 바꾸지 않아요.",
   "misconception": "두 물높이를 다르게 그려 벽만의 비교 조건을 깨지 않았나요?",
   "criteria": "같은 물3cm·벽 차이·두 결과·모형 한계를 표현하면 인정해요.",
   "drawing": "large",
   "given": [
    "연습용 모형: 가는 물 3 cm·벽 없음→B, C에 물이 닿음. 나는 물 3 cm·벽 3.5 cm→젖은 집 0채. 땅·집·읽는 조건은 같고 실제 마을의 관찰이 아니에요."
   ],
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "같은물높이",
     "벽차이",
     "두결과",
     "실제와한계"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-02",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "비교 그림",
    "concept": "비교 그림",
    "standard": "4과16-02",
    "itemType": "draw",
    "inquirySkill": "자료와 근거를 그림으로 표현하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w063",
   "no": 63,
   "form": "choice",
   "topic": "조건에 맞는 실천",
   "prompt": "이번 주 자료의 조건에서 바로 의논하여 시작할 수 있는 실천은?",
   "answer": "③ 교사와 빈 교실 전등의 사용 여부를 확인한다",
   "explanation": "자료에서 이번 주 가능한 일은 교사와 빈 교실 사용을 확인하는 것이에요. 필요한 전등은 유지하고 구입 보류·학생 수리 금지를 지켜요. 가장 큰 목표보다 현재 가능한 조건과 도움을 먼저 읽어요.",
   "misconception": "구입 보류나 고장 조건을 무시하고 목표만 크게 세우지 않았나요?",
   "criteria": "교사와 빈 교실 사용을 확인하는③을 골라요.",
   "choices": [
    "구입이 보류됐어도 새 조명 교체만 이번 주 실행으로 정한다",
    "빈 구역을 찾았으므로 수업 준비 구역도 함께 끈다",
    "교사와 빈 교실 전등의 사용 여부를 확인한다",
    "목표 횟수를 채우려고 학생끼리 고장 스위치를 고친다",
    "필요한 냉방·환기도 전기 사용이므로 모두 낭비로 센다"
   ],
   "key": 2,
   "contextRef": "school-constraints-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "조건에 맞는 실천",
    "concept": "조건에 맞는 실천",
    "standard": "4과16-03",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     2
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w064",
   "no": 64,
   "form": "multi",
   "topic": "함께 실천할 조건",
   "prompt": "계획에 반영할 내용으로 알맞은 것을 모두 고르세요.",
   "answer": "①, ④, ⑤",
   "explanation": "필요한 사용·서로 다른 이동 여건·교사 도움을 함께 살펴요. 좋은 목적이어도 같은 행동을 모두에게 강요할 수는 없어요. 새 구입이나 수리는 실제 끝난 것으로 쓰지 않아요.",
   "misconception": "같은 목적이면 모든 사람의 필요도 같다고 보지 않았나요?",
   "criteria": "필요한 사용·친구 상황·고장 처리 의논의 세 보기를 골라요.",
   "choices": [
    "생활에 필요한 전기 사용은 지킨다",
    "새 설비 구입을 이미 완료했다고 적는다",
    "모두 같은 이동 방법만 쓰도록 강요한다",
    "도움이 필요한 친구의 상황을 듣는다",
    "교사와 고장 난 곳의 처리를 의논한다"
   ],
   "key": [
    0,
    3,
    4
   ],
   "contextRef": "school-constraints-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "함께 실천할 조건",
    "concept": "함께 실천할 조건",
    "standard": "4과16-03",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      3,
      4
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w065",
   "no": 65,
   "form": "blank",
   "topic": "실천에 필요한 도움",
   "prompt": "고장 난 스위치를 발견하면 학생끼리 고치지 않고 [ ]에게 알려요.",
   "answer": "교사",
   "explanation": "고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 발견·알림·실제 수리 완료는 각각 다른 일이에요. 알렸다는 이유로 설비가 이미 안전해졌다고 정하지 않아요.",
   "misconception": "도움을 요청한 사실과 수리 완료를 같게 적지 않았나요?",
   "criteria": "교사·선생님처럼 이 학교의 도움 대상이면 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "교사",
     "선생님"
    ],
    "teacherRequired": false
   },
   "contextRef": "school-constraints-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "실천에 필요한 도움",
    "concept": "실천에 필요한 도움",
    "standard": "4과16-03",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w066",
   "no": 66,
   "form": "short",
   "topic": "필요한 사용 구별",
   "prompt": "교실 3곳 중 2곳은 수업 준비로 전등이 필요하고 1곳은 비어 있어요. 자료의 기준에서 불필요한 전등 사용을 확인할 우선 대상은 몇 곳인가요?",
   "answer": "1곳",
   "explanation": "세 곳 중 두 곳은 수업 준비로 필요하고 한 곳이 비어 있어요. 우선 그1곳의 실제 사용 여부를 교사와 확인해요. 비어 있다는 사실만으로 모든 기기를 무조건 끄는 것은 아니에요.",
   "misconception": "필요한 두 곳까지 낭비 확인 대상으로 같은 방식으로 세지 않았나요?",
   "criteria": "우선 확인할빈1곳을 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "1곳"
    ],
    "teacherRequired": false,
    "value": 1,
    "unit": "곳",
    "unitRequired": true
   },
   "contextRef": "school-constraints-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "필요한 사용 구별",
    "concept": "필요한 사용 구별",
    "standard": "4과16-03",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w067",
   "no": 67,
   "form": "match",
   "topic": "상황과 도움",
   "prompt": "상황에 맞는 다음 행동을 연결하세요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "구입 보류에는 가진 물건 활용, 고장에는교사알림, 이동 지원에는친구 필요와도움을 연결해요. 어려움마다 필요한 다음 행동이 달라요. 학생에게 수리나 같은 이동을 강요하지 않아요.",
   "misconception": "지원이 필요한 상황은 실천을 모두 포기할 이유라고 보지 않았나요?",
   "criteria": "(1)ㄷ/(2)ㄱ/(3)ㄴ을 연결해요.",
   "parts": [
    "(1) 새 설비 구입이 보류되었다.",
    "(2) 스위치가 고장 났다.",
    "(3) 친구에게 이동 지원이 필요하다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 교사에게 알리고 학생이 직접 수리하지 않기  ㄴ. 친구의 필요를 듣고 가능한 이동 지원 의논  ㄷ. 가진 물건으로 가능한 실천 먼저 찾기"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄴ"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "school-constraints-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "상황과 도움",
    "concept": "상황과 도움",
    "standard": "4과16-03",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w068",
   "no": 68,
   "form": "order",
   "topic": "실천과 돌아보기",
   "prompt": "확인한 뒤 실천을 고치는 순서로 기호를 쓰세요.",
   "answer": "ㄴ → ㄱ → ㄷ → ㄹ",
   "explanation": "사용 필요·교사 도움을 먼저 확인하고 정한 조건에서 행동해요. 실제 한 일과 어려움을 남긴 뒤 다음 방법을 보완해요. 결과를 보기 전에 성공으로 정하거나 계획을 완료로 세지 않아요.",
   "misconception": "어려움 기록을 지우면 개선할 근거도 없어짐을 살폈나요?",
   "criteria": "ㄴ→ㄱ→ㄷ→ㄹ의 순서로 써요.",
   "given": [
    "ㄱ. 의논한 조건에서 사용하지 않는 전등을 확인한다.",
    "ㄴ. 사용 필요와 교사의 도움을 먼저 확인한다.",
    "ㄷ. 실제로 한 일과 어려움을 남긴다.",
    "ㄹ. 기록을 보고 다음 방법을 보완한다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄴ",
      "ㄱ",
      "ㄷ",
      "ㄹ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "실천과 돌아보기",
    "concept": "실천과 돌아보기",
    "standard": "4과16-03",
    "itemType": "order",
    "inquirySkill": "조사·비교 과정 구성하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w069",
   "no": 69,
   "form": "written",
   "topic": "서로 다른 필요",
   "prompt": "친구가 「기후변화에 대응하려면 모두 매일 같은 방법으로 걸어와야 해」라고 했어요. 학교 자료의 조건을 근거로 더 실행 가능한 의견을 써요.",
   "answer": "이동에 도움이 필요한 친구가 있으므로 모두에게 같은 방법을 강요하지 않는다. 친구의 필요와 안전한 이동을 교사·보호자와 의논하고, 교실 전등의 낭비 확인이나 물건 오래 쓰기처럼 각자 가능한 행동을 함께 찾는다.",
   "explanation": "이동에 도움이 필요한 친구가 있다는 조건을 읽어요. 안전한 이동 지원과 각자 가능한 절약 행동을 어른과 의논할 수 있어요. 모두 같은 방법을 강요하거나 실천 자체를 포기하지 않아요.",
   "misconception": "좋은 목적이라도 개인의 필요를 무시해도 된다고 보지 않았나요?",
   "criteria": "서로 다른 필요·가능한 대안·교사/보호자 도움을 연결하면 인정해요.",
   "lines": 5,
   "given": [
    "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
   ],
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "서로다른필요",
     "가능한대안",
     "필요한도움"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "서로 다른 필요",
    "concept": "서로 다른 필요",
    "standard": "4과16-03",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w070",
   "no": 70,
   "form": "draw",
   "topic": "실행 가능한 안내",
   "prompt": "이번 주 조건에 맞는 안내를 세 칸으로 그려요. 내가 할 수 있는 행동, 교사에게 요청할 도움, 실제로 했는지 확인할 기준을 넣으세요.",
   "answer": "1칸: 교사와 빈 교실 사용 여부 확인. 2칸: 고장이나 필요한 전등은 교사에게 알리기. 3칸: 실제 확인한 때와 어려움을 살피는 기준. 새 구입·수리가 끝났다고 표시하지 않는다.",
   "explanation": "내가 할 확인·교사에게 요청할 도움·실제 여부의 기준을 구별해요. 필요한 사용은 유지하고 고장 설비는 직접 고치지 않아요. 안내 그림을 만든 일은 실제 확인·지원·수리 완료와 달라요.",
   "misconception": "세 칸을 그린 것으로 세 행동도 모두 실행했다고 쓰지 않았나요?",
   "criteria": "조건에 맞는 행동/도움/확인 기준 세 칸이 드러나면 인정해요.",
   "drawing": "large",
   "given": [
    "가상 조건: 이번 주 새 설비 구입은 보류. 필요한 전등·냉방·환기는 유지. 빈 교실 확인은 교사와 가능. 고장 난 스위치는 교사에게 알리고 학생이 수리하지 않아요."
   ],
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "가능한행동",
     "교사도움",
     "실제확인기준"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "실행 가능한 안내",
    "concept": "실행 가능한 안내",
    "standard": "4과16-03",
    "itemType": "draw",
    "inquirySkill": "자료와 근거를 그림으로 표현하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w071",
   "no": 71,
   "form": "choice",
   "topic": "기회와 기록",
   "prompt": "목요일의 기록을 바르게 읽은 것은?",
   "answer": "⑤ 확인할 기회가 없었고 확인 횟수는 0회였다",
   "explanation": "목요일에는기회0회·확인0회가 명시돼 있어요. 계획3회는 실제3회가 아니며 기록된0은 미기록과 달라요. 이 수로 노력 여부나 기회를 더 만들 책임을 판단하지 않아요.",
   "misconception": "0회와 모르는 상태, 기회 없음을 한 가지 뜻으로 읽지 않았나요?",
   "criteria": "기회 없고 확인0회라는⑤를 골라요.",
   "choices": [
    "계획이3회이므로 기회가 없어도 실제 확인은3회로 센다",
    "확인0회가 적혀 있어도 미기록과 같은 뜻으로 읽는다",
    "기회0회는 실제로 하지 않았다는 확인 없이 적은 추정값이다",
    "다른 날의 확인 횟수를 가져와 목요일 계획3회를 채운다",
    "확인할 기회가 없었고 확인 횟수는 0회였다"
   ],
   "key": 4,
   "contextRef": "action-records-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기회와 기록",
    "concept": "기회와 기록",
    "standard": "4과16-03",
    "itemType": "choice",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "accepted": [
     4
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w072",
   "no": 72,
   "form": "multi",
   "topic": "기록으로 알 수 있는 것",
   "prompt": "기록으로 확인할 수 있는 내용을 모두 고르세요.",
   "answer": "②, ③, ④",
   "explanation": "화요일은기회2중확인1, 수요일은미기록, 금요일은기회2/확인2예요. 계획은각3회지만 실제 기록과 달라요. 확인 횟수는 학교 전력량 측정값이 아니에요.",
   "misconception": "기회 수나 계획 수를 실제 확인 수로 옮기지 않았나요?",
   "criteria": "화/수/금의 기록을 그대로 읽은 세 보기를 골라요.",
   "choices": [
    "계획 3회는 요일마다 실제 확인 3회를 뜻한다",
    "화요일에는 기회 2회 중 확인 1회가 기록되었다",
    "수요일 실제 확인 횟수는 이 자료만으로 모른다",
    "금요일에는 기회 2회와 확인 2회가 기록되었다",
    "이 기록만으로 학교 전력량의 감소를 정확히 안다"
   ],
   "key": [
    1,
    2,
    3
   ],
   "contextRef": "action-records-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기록으로 알 수 있는 것",
    "concept": "기록으로 알 수 있는 것",
    "standard": "4과16-03",
    "itemType": "multi",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      2,
      3
     ]
    ]
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w073",
   "no": 73,
   "form": "blank",
   "topic": "0과 미기록",
   "prompt": "수요일의 실제 확인 횟수는 [ ]이에요. 〈보기:0회 / 3회 / 알 수 없음〉",
   "answer": "알 수 없음",
   "explanation": "수요일은 실제 확인 횟수가 적혀 있지 않아요. 기회3회나계획3회가 있어도 실제 몇 번 했는지는 모르는 상태예요. 미기록을0이나3회로 채우지 않아요.",
   "misconception": "빈 기록을 하지 않은0회로 확정하지 않았나요?",
   "criteria": "알 수 없음·미기록·기록으로 확인 불가 등 같은 뜻이면 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "알 수 없음",
     "미기록",
     "기록으로 확인 불가"
    ],
    "teacherRequired": false
   },
   "contextRef": "action-records-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "0과 미기록",
    "concept": "0과 미기록",
    "standard": "4과16-03",
    "itemType": "blank",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w074",
   "no": 74,
   "form": "short",
   "topic": "확인된 실천 합계",
   "prompt": "월~금에 실제로 확인했다고 기록된 횟수만 합하면 몇 회인가요? 미기록은 더하지 않아요.",
   "answer": "6회",
   "explanation": "확인된 월3+화1+목0+금2=6회만 합해요. 수요일은 모르는 상태로 남겨요. 확인된6회를 그 주 실제 행동 전체나 확인할 기회 전체와 같게 정하지 않아요.",
   "misconception": "미기록을0으로 바꾸고 한 주 총실제 횟수를 확정하지 않았나요?",
   "criteria": "확인된 기록의합6회를 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "6회"
    ],
    "teacherRequired": false,
    "value": 6,
    "unit": "회",
    "unitRequired": true
   },
   "contextRef": "action-records-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "확인된 실천 합계",
    "concept": "확인된 실천 합계",
    "standard": "4과16-03",
    "itemType": "short",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w075",
   "no": 75,
   "form": "match",
   "topic": "기록의 상태",
   "prompt": "문장과 기록의 상태를 연결하세요.",
   "answer": "(1) ㄹ (2) ㄴ (3) ㄷ (4) ㄱ",
   "explanation": "하기로 한 계획·미기록·기회 없음·확인한 행동은 뜻이 달라요. 수요일의 빈 칸과 목요일의기회0/확인0을 구별해요. 금요일2회는 실제 확인됐다고 제시한 기록이에요.",
   "misconception": "미기록과 기회 없음을 둘 다0으로 연결하지 않았나요?",
   "criteria": "(1)ㄹ/(2)ㄴ/(3)ㄷ/(4)ㄱ을 연결해요.",
   "parts": [
    "(1) 요일마다 3회 하기로 정했다.",
    "(2) 수요일의 실제 횟수를 적지 않았다.",
    "(3) 목요일에는 빈 교실 확인 기회가 없었다.",
    "(4) 금요일에는 실제 2회를 확인했다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 확인한 행동  ㄴ. 미기록  ㄷ. 기회 없음  ㄹ. 계획"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄹ",
      "ㄴ",
      "ㄷ",
      "ㄱ"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "action-records-v1",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기록의 상태",
    "concept": "기록의 상태",
    "standard": "4과16-03",
    "itemType": "match",
    "inquirySkill": "자료·생활 조건 해석하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w076",
   "no": 76,
   "form": "order",
   "topic": "실천 기록 비교 순서",
   "prompt": "실천 기록을 공정하게 비교하는 순서로 기호를 쓰세요.",
   "answer": "ㄱ → ㄷ → ㄹ → ㄴ",
   "explanation": "무엇을 기회·확인1회로 셀지 먼저 정해요. 같은 기준으로 상황을 남기고 기록 상태를 나눈 뒤 차이와 모르는 점을 설명해요. 기준이 다른 횟수는 숫자만 바로 비교하지 않아요.",
   "misconception": "확인 기준 없이 횟수부터 합하지 않았나요?",
   "criteria": "ㄱ→ㄷ→ㄹ→ㄴ을 순서대로 써요.",
   "given": [
    "ㄱ. 무엇을 기회와 확인 1회로 셀지 정한다.",
    "ㄴ. 자료로 확인한 차이와 모르는 점을 설명한다.",
    "ㄷ. 같은 기준으로 실제 상황을 기록한다.",
    "ㄹ. 계획·기회·확인·미기록을 구분해 비교한다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄱ",
      "ㄷ",
      "ㄹ",
      "ㄴ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "실천 기록 비교 순서",
    "concept": "실천 기록 비교 순서",
    "standard": "4과16-03",
    "itemType": "order",
    "inquirySkill": "조사·비교 과정 구성하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w077",
   "no": 77,
   "form": "written",
   "topic": "실천과 결과의 원인",
   "prompt": "이 기록으로 「전등 확인을 6회 했기 때문에 이번 주 학교 전력량이 줄었다」고 확정할 수 있을까요? 까닭과 더 확인할 것을 쓰세요.",
   "answer": "확정할 수 없다. 기록에는 확인 횟수만 있고 학교 전력량은 없다. 같은 기간의 전력량과 교실 사용 시간·사람 수·날씨·필요한 냉방 등의 조건도 더 확인해야 한다.",
   "explanation": "제시된6회는 확인 행동의 기록이며 학교 전력량 값은 없어요. 전력량을 더 알아도 날씨·인원·시간·필요한 사용 등이 달라졌는지 봐야 해요. 행동 횟수를 실천만의 효과나 기후 전체 변화량으로 바꾸지 않아요.",
   "misconception": "확인1회가 언제나 같은 전력량 감소라고 보지 않았나요?",
   "criteria": "전력량 자료 없음·다른 사용 조건·원인 확정 불가를 연결하면 인정해요.",
   "lines": 5,
   "given": [
    "가상의 반에서 사용하지 않는 전등 확인을 계획했어요. 월: 계획 3회·기회 3회·확인 3회. 화: 계획 3회·기회 2회·확인 1회. 수: 계획 3회·기회 3회·실제 확인은 미기록. 목: 계획 3회·기회 0회·확인 0회. 금: 계획 3회·기회 2회·확인 2회. 기회는 필요한 전등을 끄지 않고 빈 교실을 확인할 수 있었던 때예요. 목요일에는 그 기회가 없었어요. 실제 학교의 실천 기록이나 전력량 측정값은 아니에요."
   ],
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "전력량자료없음",
     "다른사용조건",
     "원인단정불가"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "실천과 결과의 원인",
    "concept": "실천과 결과의 원인",
    "standard": "4과16-03",
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w078",
   "no": 78,
   "form": "draw",
   "topic": "기록을 그림으로 읽기",
   "prompt": "월·수·목의 기록을 세 칸 카드로 나타내세요. 확인 횟수, 미기록 표시, 기회 없음을 서로 다르게 보여 주세요.",
   "answer": "월: 기회 3/확인 3. 수: 기회 3/실제 확인은물음표 또는 미기록. 목: 기회 0/확인 0와 기회 없음을 표시. 수를 0으로 바꾸지 않는다.",
   "explanation": "월은기회3/확인3, 수는기회3/확인미기록, 목은기회0/확인0이에요. 수요일은 물음표 등으로 모름을 표시하고 목요일은 기회 없음의 뜻을 적어요. 실제 우리 반의 수행 증거가 아닌 제공 자료의 그림이에요.",
   "misconception": "수요일을0으로 그리거나 목요일과 같은 상태로 나타내지 않았나요?",
   "criteria": "세 요일의 기회/확인·미기록과0의 구별·제공 자료임이 드러나면 인정해요.",
   "drawing": "large",
   "given": [
    "연습용 가상 기록: 월 기회 3회·확인 3회 / 수 기회 3회·실제 확인 미기록 / 목 기회 0회·확인 0회(확인할 기회가 없었음)."
   ],
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "월 3",
     "수미기록",
     "목기회 0확인 0",
     "제공자료표시"
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "기록을 그림으로 읽기",
    "concept": "기록을 그림으로 읽기",
    "standard": "4과16-03",
    "itemType": "draw",
    "inquirySkill": "자료와 근거를 그림으로 표현하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w079",
   "no": 79,
   "form": "written",
   "topic": "자료를 연결해 설명하기",
   "prompt": "가상 게시판에 「한 해가 덜 더웠으니 변화는 끝났고, 모형에서 안 젖은 곳은 실제로도 안전해. 어린이가 전부 해결해야 해」라고 썼어요. 자료·모형·실천을 연결한 글로 고치세요.",
   "answer": "한 해 평균의 차이와 장기 기후변화를 구분하고 여러 해 자료를 더 살핀다. 모형에서 젖지 않은 것은 정한 물높이·땅·장벽 조건의 결과이며 실제 지역은 지형과 현재 안내 등을 더 확인한다. 어린이는 가능한 행동을 하고 필요한 지원과 시설 문제는 어른과 함께 의논한다.",
   "explanation": "한 해 비교와 장기 판단, 모형 조건과 실제 안전, 가능한 행동과 공동 도움을 각각 이어 설명해요. 확인한 사실은 남기되 과장한 세 결론을 고쳐요. 글을 쓴 것만으로 실제 조사·시설 대응까지 끝난 것은 아니에요.",
   "misconception": "세 주장 중 하나만 고치고 나머지 과장을 그대로 두지 않았나요?",
   "criteria": "자료 범위·모형 조건/한계·가능한 실천/도움 세 부분에 근거가 있으면 인정해요.",
   "lines": 6,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "자료의범위",
     "모형의조건과한계",
     "가능한실천과도움"
    ]
   },
   "standards": [
    "4과16-01",
    "4과16-02",
    "4과16-03"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "자료를 연결해 설명하기",
    "concept": "자료를 연결해 설명하기",
    "standard": "4과16-03",
    "standards": [
     "4과16-01",
     "4과16-02",
     "4과16-03"
    ],
    "itemType": "written",
    "inquirySkill": "근거와 조건으로 설명하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  },
  {
   "id": "c22-s42-u04-w080",
   "no": 80,
   "form": "draw",
   "topic": "한 장으로 연결하기",
   "prompt": "교실에서 나눌 설명판을 세 구역으로 설계하세요. 기온 자료의 사실 하나, 해안 모형의 결과와 한계, 가능한 실천과 도움을 각각 그림·짧은 글로 넣으세요.",
   "answer": "1구역: 출처·전국 한 해 평균14.5℃와13.7℃의 비교/기간. 2구역: 물3cm·벽3.5cm는0채, 물4cm는B·C·D와 실제 안전 단정 불가. 3구역: 교사와 빈 구역의 사용 확인·필요한 밝기 유지·도움과 계획/실제 구별.",
   "explanation": "세 구역에 기온의 지역·기간, 모형의 물/벽 조건과 결과·한계, 가능한 행동과 도움을 담아요. 수치만 옮기지 말고 그 수가 뜻하는 범위도 설명해요. 설계 그림과 실제 공유·실천 완료를 구별해요.",
   "misconception": "자료의 숫자만 쓰고 조건이나 생활의 도움을 빼지 않았나요?",
   "criteria": "세 구역의 사실·조건/한계·실천/도움과 계획 구별이 자료에 맞으면 인정해요.",
   "drawing": "large",
   "given": [
    "사용할 수 있는 자료: 전국 연평균 2024년 14.5 ℃·2025년 13.7 ℃ / 모형에서 물 3 cm·벽 3.5 cm는 0채, 물 4 cm에서는B·C·D / 교사와 빈 교실의 불필요한 사용 확인 가능. 실제 지역의 안전이나 내 실천 완료를 뜻하지 않아요."
   ],
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "기온자료사실",
     "모형결과와한계",
     "실천과도움",
     "계획실제구별"
    ]
   },
   "standards": [
    "4과16-01",
    "4과16-02",
    "4과16-03"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "edition": "2022 개정",
    "unit": "c22-s42-u04",
    "standard": "4과16-03",
    "note": "독립 창작 교재 문항. 단원평가 원문과 일대일로 검증한 문항이 아님."
   },
   "taxonomy": {
    "grade": 4,
    "semester": 2,
    "unit": "u04",
    "domain": "과학과 사회",
    "topic": "한 장으로 연결하기",
    "concept": "한 장으로 연결하기",
    "standard": "4과16-03",
    "standards": [
     "4과16-01",
     "4과16-02",
     "4과16-03"
    ],
    "itemType": "draw",
    "inquirySkill": "자료와 근거를 그림으로 표현하기"
   },
   "evidence": {
    "reviewedBy": "Codex",
    "date": "2026-10-22",
    "scope": "현행 교육과정 범위·문항/예시 답·모형 조건 대조. 실제 학생 수행이나 원문 대조 완료를 뜻하지 않음."
   }
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "물이 차오르는 해안 마을",
   "blocks": [
    {
     "type": "diagram",
     "key": "hero"
    },
    {
     "type": "text",
     "text": "2024년 우리나라 전국의 한 해 평균 기온은 14.5 ℃로, 30년 평균(평년) 12.5 ℃보다 2.0 ℃ 높았어요. 기온이 높아지면 우리 생활은 어떻게 달라질까요?"
    },
    {
     "type": "heading",
     "text": "미리 보는 낱말"
    },
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻"
     ],
     "rows": [
      [
       "기후",
       "한 지역에서 오랜 기간 나타나는 평균적인 날씨"
      ],
      [
       "평년값",
       "기후를 비교하는 기준. 지금은 1991~2020년 30년의 평균"
      ],
      [
       "기후변화",
       "오랜 기간에 걸쳐 기온·비·눈 등의 모습이 달라지는 것"
      ],
      [
       "해수면",
       "바닷물의 높이"
      ]
     ]
    },
    {
     "type": "heading",
     "text": "이 단원에서 할 일"
    },
    {
     "type": "list",
     "items": [
      "날씨와 기후를 구별하고 평년과 비교해 기후변화를 알아봐요.",
      "기후변화의 사례와 사람의 활동이 어떤 관계인지 알아봐요.",
      "해안 마을 모형으로 해수면이 높아질 때 어느 곳부터 잠기는지 실험해요.",
      "생활에 도움이 될 행동을 조사하고, 할 수 있는 일부터 실천해요."
     ],
     "ordered": true
    }
   ],
   "rail": [
    {
     "title": "핵심 질문",
     "text": "바닷물이 높아지면 바다와 가까운 집부터 잠길까, 땅이 낮은 집부터 잠길까?"
    },
    {
     "title": "3D 실험실",
     "text": "사이언스 랩 v2 → 「4-2 Ⅳ 기후변화와 우리 생활」 → 스스로 공부하기에서 물높이를 직접 바꿔 봐요."
    },
    {
     "title": "내 처음 생각",
     "text": "",
     "write": 6
    }
   ],
   "lead": "자료를 보고 질문하고, 모형으로 확인하고, 개념으로 설명해요.",
   "kind": "opener",
   "teacherNote": "첫 질문에 대한 예상만 받고 답은 말하지 않아요. 「해안 마을 모형」의 결과와 비교하게 해요."
  },
  {
   "section": "단원의 길잡이",
   "title": "사례에서 생활과 실천으로",
   "blocks": [
    {
     "type": "text",
     "text": "사례를 읽고 생활의 변화를 생각해요. 모형에서는 조건과 결과를 비교하고, 실제 생활에서는 필요한 정보와 도움을 찾아요. 조사한 것·예상한 것·실제로 해 본 일을 구별하며 배움을 이어 가요."
    },
    {
     "type": "table",
     "heads": [
      "배울 줄기",
      "살필 근거",
      "이어지는 문항"
     ],
     "rows": [
      [
       "기후변화의 사례",
       "기관·지역·기간·평년 비교",
       "5~12,47~54"
      ],
      [
       "사람의 활동과 생활",
       "사례 자료와 생활의 여러 조건",
       "13~16,27~28"
      ],
      [
       "해수면 상승 피해 모형",
       "물높이·땅 높이·벽·물길",
       "17~22,29~30,55~62"
      ],
      [
       "가능한 대응과 협력",
       "안전·필요한 사용·사람마다 다른 여건",
       "23~26,63~70"
      ],
      [
       "설명하고 돌아보기",
       "자료의 범위·실제 행동·도움·다음 방법",
       "31~46,71~80"
      ]
     ]
    },
    {
     "type": "heading",
     "text": "이 단원을 마치며 할 설명"
    },
    {
     "type": "list",
     "items": [
      "사례에 나온 수치와 그 수치가 뜻하는 범위를 말해요.",
      "모형에서 바꾼 것·같게 둔 것·본 결과를 연결해요.",
      "생활에 미칠 수 있는 영향과 가능한 대응을 근거로 설명해요.",
      "혼자 하기 어려운 일은 필요한 도움을 함께 정해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "처음 떠오르는 연결",
     "hint": "사례 하나에서 생활의 어떤 부분과 어떤 도움을 생각할 수 있을까요?",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사례→생활의 영향→비교 모형→가능한 실천을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "문제를 푼 기록과 실제로 조사·실천한 기록은 역할이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "단원 끝에 더 분명해진 연결과 남은 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "준비 점검",
   "title": "처음 생각을 남겨요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w001",
      "c22-s42-u04-w002",
      "c22-s42-u04-w003",
      "c22-s42-u04-w004"
     ]
    },
    {
     "type": "field",
     "title": "2번 생각의 까닭",
     "hint": "어느 조건을 보고 그렇게 예상했는지 적어요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "아직 배우기 전",
     "text": "맞힌 개수보다 처음 생각과 그 까닭을 남기는 것이 중요해요."
    },
    {
     "title": "끝나고 비교",
     "text": "단원을 마치면 2번 답을 다시 읽고 바뀐 생각을 적어요.",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "틀려도 괜찮아요. 처음 생각을 그대로 써요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "① 날씨와 기후",
   "title": "하루의 상태와 오랜 기간의 평균",
   "blocks": [
    {
     "type": "text",
     "text": "그날그날의 기온·비·눈·바람·구름의 상태를 **날씨**라고 해요. 한 지역에서 오랜 기간(보통 30년) 나타나는 평균적인 날씨는 **기후**라고 해요."
    },
    {
     "type": "text",
     "text": "기후가 변했는지는 같은 지역·같은 요소(예: 연평균 기온)를 평년값과 비교해서 알아봐요. 기상청은 1991~2020년의 30년 평균을 **평년값**으로 써요."
    },
    {
     "type": "diagram",
     "key": "temps",
     "caption": "전국 연평균 기온: 평년(1991~2020) 12.5 ℃와 2024년 14.5 ℃ (기상청)"
    },
    {
     "type": "example",
     "question": "2024년 전국 연평균 기온은 평년과 비교해 어떠했나요?",
     "steps": [
      [
       "같은 기준 확인",
       "두 값 모두 「전국」의 「연평균 기온」이에요."
      ],
      [
       "빼서 비교",
       "14.5 − 12.5 = 2.0(℃)"
      ],
      [
       "해석",
       "한 해 평균이 높았다는 뜻이지, 날마다 2 ℃씩 더웠다는 뜻은 아니에요."
      ]
     ],
     "answer": "2024년은 평년보다 2.0 ℃ 높았어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "날씨 = 그날의 상태 · 기후 = 오랜 기간의 평균"
    },
    {
     "title": "더 알아보기",
     "text": "평년값은 10년마다 새로 계산해요. 지금 쓰는 값은 1991~2020년의 평균이에요."
    },
    {
     "title": "오개념 메모",
     "text": "「오늘 추우니 지구가 더워지지 않는다」는 날씨로 기후를 판단한 잘못이에요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "어느 지역의 어떤 기간인가요?",
   "blocks": [
    {
     "type": "text",
     "text": "기온·비·눈 등의 사례를 비교할 때는 **지역·기간·요소·비교 기준**을 먼저 읽어요. 전국의 한 해 평균을 학교의 어느 하루 기온으로 바꾸어 말하지 않아요. 한 해의 평균이 앞선 해보다 낮아도 오랜 기간의 변화가 끝났다고 단정할 수는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "자료에 붙여 읽을 말",
      "살필 까닭"
     ],
     "rows": [
      [
       "전국·같은 도시·학교",
       "범위가 다른 장소의 값을 섞지 않아요."
      ],
      [
       "하루·한 해·30년 평년",
       "평균을 낸 기간이 무엇인지 밝혀요."
      ],
      [
       "기온·강수량 등과 단위",
       "서로 다른 요소를 같은 크기로 비교하지 않아요."
      ],
      [
       "자료의 출처와 발표 시점",
       "원래 자료와 비교 기준을 다시 확인할 수 있어요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "기상청의2025년 전국 연평균 기온13.7 ℃를 제시된 평년12.5 ℃와 비교해 설명해요.",
     "steps": [
      [
       "조건 읽기",
       "전국 연평균 기온끼리 비교해요. 평년은1991~2020년30년 기준이에요."
      ],
      [
       "차이 구하기",
       "13.7−12.5=1.2(℃)이므로2025년 한 해 평균이 제시된 평년보다 높아요."
      ],
      [
       "뜻 한정하기",
       "전국 한 해 평균의 비교예요. 학교의 모든 날이1.2 ℃씩 더웠다는 뜻은 아니에요."
      ]
     ],
     "answer": "2025년 전국 한 해 평균은 제시된 평년보다1.2 ℃ 높았어요. 기간과 지역을 함께 말해요."
    },
    {
     "type": "text",
     "text": "내용 근거: 기상청 「2025년 연 기후특성」(2026-01-06). 자세한 출처는 자료를 읽는 법 지면에서 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "숫자와 함께 지역·기간·요소·기준을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 해 평균은 그해의 여러 날을 모은 값이에요. 모든 날의 상태가 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "서로 섞어 비교하면 안 되는 두 자료와 그 까닭을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "① 날씨와 기후 · 유형 연습",
   "title": "날씨와 기후를 구별해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w005",
      "c22-s42-u04-w006",
      "c22-s42-u04-w007",
      "c22-s42-u04-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "풀이 메모",
     "text": "「해마다」「여름은」처럼 되풀이되는 말이 있으면 기후, 「오늘」「이번 주」면 날씨예요."
    },
    {
     "title": "계산할 때",
     "text": "같은 지역·같은 요소끼리 빼요. 단위 ℃를 꼭 써요."
    },
    {
     "title": "헷갈린 문제",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "② 기후변화의 사례",
   "title": "여러 해에 걸쳐 달라진 모습",
   "blocks": [
    {
     "type": "text",
     "text": "**기후변화**는 오랜 기간에 걸쳐 기온·비·눈 같은 기후의 평균적인 모습이 달라지는 것이에요. 우리나라에서도 여러 가지 변화가 나타나고 있어요."
    },
    {
     "type": "table",
     "heads": [
      "달라진 것",
      "나타나는 모습",
      "우리 생활에 주는 영향"
     ],
     "rows": [
      [
       "더위",
       "폭염과 열대야가 나타나는 날이 늘어나요.",
       "더위로 몸이 아픈 사람이 늘고 냉방에 쓰는 에너지가 늘어요."
      ],
      [
       "비",
       "짧은 시간에 많은 비가 내리거나 오래 비가 오지 않아요.",
       "낮은 곳이 물에 잠기거나 물이 모자라요."
      ],
      [
       "생물",
       "봄꽃이 일찍 피고 농작물을 기르는 곳이 북쪽으로 옮겨 가요.",
       "기르는 작물과 잡히는 물고기가 달라져요."
      ],
      [
       "바다",
       "바닷물의 온도와 높이가 높아져요.",
       "바닷가의 낮은 땅이 잠길 위험이 커져요."
      ]
     ]
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-heatwave.webp",
       "alt": "햇볕이 강한 여름 거리",
       "cap": "폭염"
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-downpour.webp",
       "alt": "많은 비로 물에 잠긴 낮은 길",
       "cap": "집중호우"
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-drought.webp",
       "alt": "물이 말라 갈라진 저수지 바닥",
       "cap": "가뭄"
      }
     ],
     "numbered": false,
     "cols": 3,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "한 번의 소나기나 하루의 추위만으로 기후변화를 판단하지 않아요. 평년과 다른 사례를 여러 해의 자료와 함께 살펴봐요. 생물·농작물의 변화에는 지역과 재배 방법 등 다른 조건도 영향을 줄 수 있어요."
    },
    {
     "type": "heading",
     "text": "확인 문제"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기후변화 = 여러 해에 걸쳐 기후의 평균적인 모습이 달라지는 것"
    },
    {
     "title": "더 알아보기",
     "text": "생물과 농작물의 변화는 기후 이외에 지역 환경과 재배 방법 등의 조건도 함께 살펴요."
    },
    {
     "title": "오개념 메모",
     "text": "평년과 크게 다른 사례를 찾아도 원인과 장기 변화를 그것 하나로 확정하지 않아요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "비가 많이 올 때 생활의 어느 부분이 달라질까요?",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-downpour.webp",
       "alt": "비가 내려 도로에 물이 고인 모습을 떠올리는 설명 그림",
       "cap": "설명용 그림 · 실제 지역의 관측 사진이 아니에요. 물이 찬 길에 들어가 확인하지 않아요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "짧은 시간에 많은 비가 내리면 물이 빠져나가는 길, 낮은 땅, 사람들이 사용하는 시설에 따라 생활의 영향이 달라질 수 있어요. 비가 많이 왔다는 사실만으로 모든 장소의 피해가 같다고 정하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "살펴볼 생활",
      "더 필요한 정보"
     ],
     "rows": [
      [
       "학교에 오가는 길",
       "낮은 길·지하 공간과 통제 안내"
      ],
      [
       "집과 가게의 생활 공간",
       "땅 높이·배수·시설 상태"
      ],
      [
       "논밭과 물 이용",
       "비가 내린 때·양과 물이 빠지는 조건"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상의 마을 자료예요. 같은 비가 내린 날 낮은 길은 통제됐고 높은 길은 통제되지 않았어요. 무엇을 말할 수 있나요?",
     "steps": [
      [
       "자료 확인",
       "비가 같아도 두 길의 위치와 통제 결과가 다르게 제시됐어요."
      ],
      [
       "생활 연결",
       "평소 이용하던 길을 바꿔야 하는 사람이 있을 수 있어요."
      ],
      [
       "확인과 도움",
       "높은 길도 언제나 안전하다고 정하지 않고 어른과 현재 통제 안내를 확인해요."
      ]
     ],
     "answer": "제공된 상황에서 이용 조건이 달라졌다고 설명하고, 실제 이동은 현재 안내와 어른의 도움으로 정해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 비라도 지형·물길·시설·이용 상황에 따라 영향이 달라질 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 번의 비와 피해 기록만으로 장기 기후변화의 원인을 모두 확인한 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생활의 영향 하나와 더 확인할 정보 하나를 이어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "생물의 변화를 볼 때 무엇을 같게 살필까요?",
   "blocks": [
    {
     "type": "text",
     "text": "꽃 피는 때나 생물이 활동하는 기간도 생활·환경 변화를 살피는 단서가 돼요. 어떤 생물을 어디에서 같은 기준으로 관찰했는지와 함께 읽어야 해요. 자료에 나온 변화와 그 변화의 원인을 바로 같은 말로 쓰지는 않아요."
    },
    {
     "type": "table",
     "heads": [
      "학습용 가상 꽃 관찰",
      "앞10년 평균",
      "뒤10년 평균"
     ],
     "rows": [
      [
       "같은 학교의 같은 종류 꽃·같은 개화 기준",
       "4월12일",
       "4월10일"
      ],
      [
       "함께 남긴 관찰 조건",
       "물주기 기록 있음",
       "물주기 방법 바뀜"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 가상 자료로 「모든 꽃이 기온 때문에2일 일찍 핀다」고 말해도 될까요?",
     "steps": [
      [
       "관찰한 사실",
       "이 학교에서 관찰한 꽃의 평균 개화일은 제시된 두 기간 사이2일 빨라졌어요."
      ],
      [
       "조건 대조",
       "물주기 방법도 달라졌다고 적혀 있어요. 기온만을 원인으로 분리한 비교가 아니에요."
      ],
      [
       "추가 확인",
       "같은 종류·장소·관찰 기준의 여러 해 자료와 물주기 등 달라진 조건을 더 살펴요."
      ]
     ],
     "answer": "관찰한 꽃과 기간의 변화는 말할 수 있지만 모든 꽃·모든 지역이나 원인 하나로 넓혀 말하지 않아요."
    },
    {
     "type": "field",
     "title": "주장을 보완해요",
     "hint": "관찰한 사실과 아직 확인하지 못한 원인을 나누어 두 문장으로 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "어떤 생물을 같은 기준으로 보았는지 밝히고 관찰과 원인을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "평균 날짜가 달라졌어도 모든 해·모든 개체가 같은 날짜만큼 변했다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료에 더 남기면 좋을 관찰 조건을 하나와 그 까닭을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "② 기후변화의 사례 · 유형 연습",
   "title": "사례와 영향을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w010",
      "c22-s42-u04-w011",
      "c22-s42-u04-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "풀이 메모",
     "text": "「무엇이 달라졌나 → 누구에게 어떤 영향」 순서로 이어 생각해요."
    },
    {
     "title": "〈보기〉 문제",
     "text": "먼저 각 보기가 어떤 변화의 결과인지 적어 두고 짝지어요."
    },
    {
     "title": "헷갈린 문제",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "③ 기후변화와 사람의 활동",
   "title": "우리 생활과 어떤 관련이 있을까요?",
   "blocks": [
    {
     "type": "text",
     "text": "물건 만들기·이동·전기 사용 같은 **사람의 활동**과 기후변화의 관련성을 믿을 만한 자료와 생활 사례로 살펴봐요."
    },
    {
     "type": "table",
     "heads": [
      "살펴볼 생활",
      "조사할 질문",
      "토의할 점"
     ],
     "rows": [
      [
       "전기 사용",
       "쓰지 않는 곳에도 전등이 켜져 있나요?",
       "꼭 필요한 사용과 낭비를 어떻게 구별할까요?"
      ],
      [
       "물건 사용",
       "가지고 있는 물건을 더 쓸 수 있나요?",
       "고쳐 쓰거나 함께 쓸 때 필요한 도움은 무엇일까요?"
      ],
      [
       "이동",
       "어떤 이동 방법을 이용할 수 있나요?",
       "거리·안전·이동이 불편한 사람의 필요도 살펴요."
      ]
     ]
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-smokestack.webp",
       "alt": "발전 시설의 굴뚝과 주변 모습",
       "cap": "발전 시설을 떠올리는 설명 그림 — 보이는 흰 기둥만으로 기체의 종류를 알 수 없어요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "example",
     "question": "빈 교실의 불을 끄자는 의견을 어떻게 구체적으로 만들까요?",
     "steps": [
      [
       "사례 확인",
       "비어 있는 교실에서 전등이 켜져 있는 때가 있는지 살펴요."
      ],
      [
       "조건 확인",
       "청소나 수업 준비에 필요한 전등은 아닌지 교사에게 물어요."
      ],
      [
       "의견 보완",
       "필요한 사용을 지키면서 사용하지 않는 전등만 확인하자고 제안해요."
      ]
     ],
     "answer": "관련 자료와 생활 조건을 근거로 가능한 실천을 의논해요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사람의 활동과 기후변화의 관련성을 자료로 살펴보고 토의해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 행동도 장소와 사람의 필요에 따라 실천 방법이 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 사례와 아직 더 알아볼 점을 나누어요.",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "③ 사람의 활동 · 유형 연습",
   "title": "근거를 찾아 의견을 나누어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w014",
      "c22-s42-u04-w015",
      "c22-s42-u04-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "질문 → 출처와 사례 확인 → 근거로 토의 → 생각 보완"
    },
    {
     "title": "더 알아보기",
     "text": "다른 의견을 들으면 처음 계획에서 놓친 조건을 찾을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 생활에서 조사할 질문을 하나 적어요.",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "④ 해수면 상승 모형",
   "title": "해안 마을 모형으로 실험해요",
   "blocks": [
    {
     "type": "text",
     "text": "바닷물의 높이를 **해수면**이라고 해요. 물높이가 높아질 때 바닷가에 어떤 피해가 생길 수 있는지 모형으로 살펴봐요. 이 모형은 물이 높아지는 과학적 원인을 증명하는 실험은 아니에요."
    },
    {
     "type": "text",
     "text": "모든 집 주변은 같은 물과 연결되어 있고 방파제가 없으면 물을 막는 장벽이 없다고 정해요. 파도·밀물과 썰물·실제 지형은 나타내지 않았어요. 땅 높이와 물높이는 비교를 위해 정한 **모형 값**이에요."
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-setup.webp",
       "alt": "점토로 만든 해안 마을 모형",
       "cap": "통에 점토 땅을 만들고 집 A~E를 붙여요."
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-pour.webp",
       "alt": "통에 물을 붓는 모습",
       "cap": "물높이 1 cm(모형의 시작)에서 시작해 물을 조금씩 부어요."
      },
      {
       "src": "../assets/book/c22-s42-u04-sea-start.webp",
       "alt": "물높이 눈금을 읽는 모형",
       "cap": "물이 차분해지면 같은 자리의 눈금을 읽고 젖은 집을 세어요."
      },
      {
       "src": "../assets/book/c22-s42-u04-sea-wall.webp",
       "alt": "방파제를 세운 모형",
       "cap": "방파제를 세우고 같은 실험을 되풀이해요."
      }
     ],
     "numbered": true,
     "cols": 2,
     "credit": "3D 모형 렌더(모형 값) · 설명용 그림(실제 사진 아님)"
    },
    {
     "type": "table",
     "heads": [
      "집",
      "자리",
      "땅 높이(모형 값)"
     ],
     "rows": [
      [
       "A",
       "바다 바로 옆 · 언덕 위",
       "4.5 cm"
      ],
      [
       "B",
       "바다 가까이 · 낮은 모래땅",
       "1.5 cm"
      ],
      [
       "C",
       "강가 · 낮은 땅",
       "2.5 cm"
      ],
      [
       "D",
       "마을 안쪽 · 평지",
       "3.5 cm"
      ],
      [
       "E",
       "바다에서 멀리 · 높은 언덕",
       "6 cm"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "바꿀 조건",
     "text": "물높이 하나만 바꿔요."
    },
    {
     "title": "같게 할 조건",
     "text": "통·땅 모양·집 위치·물높이를 읽는 자리"
    },
    {
     "title": "모형 값",
     "text": "땅 높이는 비교를 위해 정한 값이에요. 실제 마을의 높이가 아니에요."
    }
   ],
   "lead": "바꿀 조건은 하나, 나머지는 모두 같게.",
   "kind": "learn",
   "teacherNote": "3D 실험실에서 학생이 직접 물높이를 바꿔 보게 한 뒤 다음 쪽을 풀어요."
  },
  {
   "section": "개념을 잇는 수업",
   "title": "한 조건만 달리해 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "같은 모형 통·땅 높이·집 위치·물길·읽는 기준에서 **벽의 효과**를 비교하려면 물높이를 같게 두고 벽 유무만 달리해요. 물높이의 효과를 비교하려면 벽 조건을 같게 두어요. 아래는 실제 마을의 기록이 아닌 정해진 모형 조건의 결과예요."
    },
    {
     "type": "table",
     "heads": [
      "비교 모형",
      "물높이",
      "벽 높이",
      "물에 닿은 집"
     ],
     "rows": [
      [
       "가",
       "2 cm",
       "없음",
       "B"
      ],
      [
       "나",
       "2 cm",
       "3.5 cm",
       "0채"
      ],
      [
       "다",
       "4 cm",
       "3.5 cm",
       "B·C·D"
      ]
     ]
    },
    {
     "type": "example",
     "question": "벽 유무의 차이를 보려면 어느 두 모형을 비교할까요?",
     "steps": [
      [
       "비교할 조건",
       "벽이 있고 없는 경우를 찾되 물높이는 같아야 해요."
      ],
      [
       "짝 고르기",
       "가는 물2 cm·벽 없음, 나는 물2 cm·벽3.5 cm이므로 가와 나를 비교해요."
      ],
      [
       "다른 짝 구별",
       "나와 다는 벽이 같고 물높이가 달라요. 가와 다는 두 조건이 함께 달라 벽만의 비교가 아니에요."
      ]
     ],
     "answer": "가와 나를 비교해요. 물에 닿은 집은 관찰할 결과이며 미리 같게 정할 조건이 아니에요."
    },
    {
     "type": "field",
     "title": "다른 비교 만들기",
     "hint": "벽은 같게 두고 물높이만 달리한 두 모형과 그 까닭을 적어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 조건 하나와 같게 둘 조건을 정하고 결과를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 집이 같은 물과 연결된 모형이에요. 실제 파도·배수·시설 상태까지 넣은 실험은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것·같게 둔 것·읽은 결과를 각각 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 해수면 상승 모형 · 결과 읽기",
   "title": "어느 집이 먼저 물에 닿았나요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "start"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w017",
      "c22-s42-u04-w018",
      "c22-s42-u04-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "결과 읽는 법",
     "text": "물높이와 집의 땅 높이를 비교해요. 땅 높이 ≤ 물높이면 물에 닿아요."
    },
    {
     "title": "핵심 정리",
     "text": "이 모형의 연결 조건에서는 땅 높이와 물높이를 비교해요."
    },
    {
     "title": "내 결과 메모",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "정답 확인: 1 cm 0채 · 2 cm 1채(B) · 3 cm 2채(B·C) · 4 cm 3채(B·C·D)"
  },
  {
   "section": "④ 해수면 상승 모형 · 방파제",
   "title": "방파제가 있으면 언제나 안전할까요?",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-sea-wall.webp",
       "alt": "방파제를 세운 모형",
       "cap": "모형의 방파제(3.5 cm)"
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-seawall.webp",
       "alt": "파도를 막는 바닷가의 콘크리트 방파제",
       "cap": "실제 바닷가의 방파제"
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "3D 모형 렌더(모형 값) · 설명용 그림(실제 사진 아님)"
    },
    {
     "type": "text",
     "text": "방파제(3.5 cm)를 세우면 물높이 1·2·3 cm에서는 안쪽 집이 하나도 젖지 않아요. 물높이가 방파제보다 높아지면 어떻게 될까요?"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w020",
      "c22-s42-u04-w021",
      "c22-s42-u04-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 모형의 3 cm에서는 안쪽 집이 젖지 않았지만 4 cm에서는 물이 넘었어요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 바닷가에서는 방파제와 함께 높은 곳에 대피 장소를 정하고, 낮은 땅의 개발을 줄이는 계획도 세워요."
    },
    {
     "title": "오개념 메모",
     "text": "「방파제만 있으면 안전하다」는 생각은 4 cm 결과로 고칠 수 있어요."
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "방파제 있음: 1·2·3 cm 0채 · 4 cm 3채(B·C·D)"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "낮은 바닷가에서 함께 지킬 생활",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-atoll.webp",
       "alt": "낮은 섬과 바다를 떠올리는 설명 그림",
       "cap": "낮은 바닷가를 떠올리는 설명용 그림 · 특정 섬의 실제 사진이나 높이 측정 자료가 아니에요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "해수면이 높아질 때 낮은 생활 공간에 어떤 어려움이 생길지 모형을 근거로 예상해 볼 수 있어요. 하지만 실제 피해를 알려면 그곳의 높이·물길·시설·현재 안내를 더 확인해야 해요. 어려움만 나열하기보다 누구의 생활에 어떤 지원이 필요한지 함께 생각해요."
    },
    {
     "type": "table",
     "heads": [
      "학습용 가상 마을의 의논",
      "함께 확인할 점"
     ],
     "rows": [
      [
       "통학로를 이용하는 학생과 교사",
       "길의 통제 안내와 안전한 이동 방법"
      ],
      [
       "생활용 물을 관리하는 어른",
       "물 이용 상태와 안전 확인·공급 방법"
      ],
      [
       "집·공공시설을 관리하는 사람",
       "지형·시설 상태와 필요한 보호·지원"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상 마을에서 「모형에서 집이 안 젖었으니 통학로와 생활용 물도 모두 안전해」라고 했어요. 어떻게 보완할까요?",
     "steps": [
      [
       "모형의 범위",
       "집이 물에 닿는 조건을 비교한 결과이며 길과 생활용 물을 검사한 것은 아니에요."
      ],
      [
       "생활의 필요",
       "학교에 오가는 일과 물을 이용하는 일에는 서로 다른 정보가 필요해요."
      ],
      [
       "협력할 일",
       "학생은 걱정과 필요한 도움을 알리고, 교사·보호자·담당 어른과 현재 정보를 확인해요."
      ]
     ],
     "answer": "모형에서 확인한 것과 실제 생활에 더 확인할 것을 나누고 필요한 지원을 함께 정해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형으로 피해 가능성을 생각하고 실제 정보와 도움으로 대응을 보완해요."
    },
    {
     "title": "더 알아보기",
     "text": "어린이가 혼자 시설을 점검하거나 위험한 곳에 들어가야 하는 활동이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "누구의 어떤 생활을 돕고 싶은지와 더 필요한 정보를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "⑤ 생활 속 실천",
   "title": "우리에게 가능한 일을 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "**기후변화 대응**은 생활과 환경에 도움이 되는 행동을 조사하고 실제로 해 보는 일이에요. **필요한 사용**을 지키면서 낭비를 줄이고, 어려움에는 함께 도움을 찾아요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "생각해 볼 행동",
      "함께 확인할 것"
     ],
     "rows": [
      [
       "빈 교실의 전등",
       "사용하지 않는 전등 확인하기",
       "청소·수업 준비에 필요한 전등인지 교사에게 물어요."
      ],
      [
       "더운 날의 바깥 활동",
       "장소·시간과 쉬는 방법 의논하기",
       "현재 학교 안내와 도움이 필요한 친구를 살펴요."
      ],
      [
       "새 물건 구입",
       "고쳐 쓰거나 함께 쓸 방법 찾기",
       "고칠 수 있는지, 누가 도와줄 수 있는지 확인해요."
      ],
      [
       "비가 많이 올 때 이동",
       "현재 안내와 이동 길 확인하기",
       "어른과 의논하고 물이 찬 곳에 직접 들어가지 않아요."
      ]
     ]
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-lightswitch.webp",
       "alt": "사용하지 않는 전등의 스위치를 확인하는 손",
       "cap": "꼭 필요한 사용인지 먼저 확인해요."
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-seawall.webp",
       "alt": "바닷가의 방파제",
       "cap": "마을의 시설은 전문가와 어른이 실제 조건을 살펴 계획해요."
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "실제 사진 아님"
    },
    {
     "type": "example",
     "question": "전기를 아끼려면 더운 날에도 필요한 냉방과 환기를 모두 멈춰야 할까요?",
     "steps": [
      [
       "사람의 필요",
       "교실의 생활 환경을 먼저 살펴요."
      ],
      [
       "낭비 확인",
       "사람이 없는 곳의 전등처럼 불필요한 사용을 찾아요."
      ],
      [
       "함께 조정",
       "필요한 냉방·환기는 교사와 의논하고 낭비를 줄여요."
      ]
     ],
     "answer": "사람의 필요를 지키면서 실행 가능한 방법을 정해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황 → 가능한 행동 → 필요한 도움 → 실제 확인"
    },
    {
     "title": "더 알아보기",
     "text": "어린이 혼자 모든 문제를 해결할 수는 없어요. 함께 의논하고 할 수 있는 일을 찾아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "누가 언제 어떤 도움을 받아 할 수 있나요?",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "필요를 지키면서 낭비를 줄여요",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-lightswitch.webp",
       "alt": "교실의 전등 스위치를 누르는 모습을 떠올리는 설명 그림",
       "cap": "교실 전등 사용을 생각하는 설명용 그림 · 실제 절약 전력량을 측정한 자료가 아니에요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "생활에서 필요 없는 사용을 줄이되 건강·안전·배움에 필요한 사용은 지켜요. 사람마다 이동·건강·생활 여건이 다르므로 같은 행동을 모두에게 강요하기보다 가능한 방법과 필요한 도움을 함께 의논해요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "가능한 행동과 도움"
     ],
     "rows": [
      [
       "비어 있는 교실에 불이 켜져 있음",
       "교사와 필요한 사용인지 확인한 뒤 불필요한 사용을 줄여요."
      ],
      [
       "더운 교실에서 수업을 해야 함",
       "필요한 냉방·환기를 유지하며 불필요한 사용을 살펴요."
      ],
      [
       "걷기 어려운 친구가 있음",
       "걷기를 강요하지 않고 함께 참여할 다른 행동을 찾아요."
      ],
      [
       "스위치가 고장 남",
       "학생이 고치지 않고 교사에게 알려요."
      ]
     ]
    },
    {
     "type": "field",
     "title": "우리에게 가능한 제안",
     "hint": "지킬 필요·줄일 낭비·도움을 구할 사람을 한 가지씩 넣어 제안을 써요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "text",
     "text": "계획한 행동을 실제로 해 본 뒤 무엇을 했고 어려움은 무엇이었는지 돌아봐요. 한 번의 행동 횟수로 절약 전력량이나 기후의 변화를 계산하지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 사용과 사람마다 다른 여건을 지키면서 가능한 행동을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "개인의 행동과 함께 학교·마을의 시설과 지원도 의논할 수 있어요. 혼자 전부 해결해야 하는 과제가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "실제로 해 본 뒤 바뀐 점과 더 필요한 도움을 나누어 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "⑤ 생활 속 실천 · 유형 연습",
   "title": "상황에 맞는 실천을 골라요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w023",
      "c22-s42-u04-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "무엇에 도움이 되는 행동인지 구체적으로 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획을 세운 것과 실제로 해 본 것은 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 반에서 실천하고 싶은 일과 필요한 도움",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "⑤ 생활 속 실천 · 계획",
   "title": "가능한 행동과 도움을 구체적으로 정해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w025",
      "c22-s42-u04-w026"
     ]
    },
    {
     "type": "field",
     "title": "실천 뒤 다시 생각하기",
     "hint": "실제로 해 본 뒤 행동·어려움·다음 방법을 비교해요. 아직 하지 않았다면 계획으로 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 사용과 낭비를 구별하고 도움이 되는 행동을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "어린이의 행동과 어른의 도움이 함께 필요할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어려움이 생기면 누구에게 어떤 도움을 요청할까요?",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 1",
   "title": "표가 말해 주는 것과 말해 주지 않는 것",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "기간",
      "한 해 평균 폭염 일수(가상 학습값)"
     ],
     "rows": [
      [
       "1991~2000년",
       "8일"
      ],
      [
       "2001~2010년",
       "11일"
      ],
      [
       "2011~2020년",
       "15일"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w027",
      "c22-s42-u04-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "자료의 성격",
     "text": "이 표의 수치는 연습을 위해 지은 가상 학습값이에요. 실제 측정 기록이 아니에요."
    },
    {
     "title": "자료 읽는 순서",
     "text": "제목 → 단위 → 늘었나 줄었나 → 표에 없는 것은 말하지 않기"
    },
    {
     "title": "내 생각",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2",
   "title": "모형의 생각을 새 바닷가에 써 봐요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "장소",
      "바다와의 거리",
      "땅 높이"
     ],
     "rows": [
      [
       "가",
       "50 m",
       "2 m"
      ],
      [
       "나",
       "500 m",
       "1 m"
      ],
      [
       "다",
       "20 m",
       "8 m"
      ],
      [
       "라",
       "1 km",
       "15 m"
      ],
      [
       "마",
       "200 m",
       "4 m"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "자료의 성격",
     "text": "다섯 곳의 거리와 높이는 가상 학습값이에요."
    },
    {
     "title": "적용하기",
     "text": "모두 바닷물과 연결되고 장벽이 없다는 가상 조건에서만 높이를 비교해요."
    },
    {
     "title": "그리기 도움",
     "text": "가로축에 장소, 세로축에 높이를 두고 3 m 물높이 선을 그어요."
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2 · 그림",
   "title": "높이를 비교한 그래프로 나타내요",
   "blocks": [
    {
     "type": "text",
     "text": "가상 자료 · 다섯 곳은 모두 같은 바닷물과 연결되고 장벽은 없어요."
    },
    {
     "type": "table",
     "heads": [
      "장소",
      "가",
      "나",
      "다",
      "라",
      "마"
     ],
     "rows": [
      [
       "땅 높이(m)",
       "2",
       "1",
       "8",
       "15",
       "4"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "29번의 가상 자료를 높이 순서로 나타내요."
    },
    {
     "title": "더 알아보기",
     "text": "높이 순서의 그래프는 실제 지형의 단면이나 지도와 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 자료의 조건에서 말할 수 있는 것과 없는 것",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "빈칸으로 정리",
   "title": "단원의 핵심을 한눈에",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w031",
      "c22-s42-u04-w032",
      "c22-s42-u04-w033",
      "c22-s42-u04-w034"
     ]
    },
    {
     "type": "field",
     "title": "한 문장으로 정리",
     "hint": "사례·생활 영향·가능한 실천을 근거와 함께 한 문장으로 이어 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "다시 읽을 쪽",
     "text": "빈칸이 막히면 그 개념 쪽(①~⑤)으로 돌아가요."
    },
    {
     "title": "스스로 점검",
     "text": "사례와 자료 / 모형의 결과와 한계 / 생활 영향 / 가능한 실천을 설명할 수 있나요?"
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "단원평가 1",
   "title": "개념과 자료로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w035",
      "c22-s42-u04-w036",
      "c22-s42-u04-w037",
      "c22-s42-u04-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "스스로 점검",
     "text": "물음이 「알맞은 것」인지 「알맞지 않은 것」인지 먼저 표시해요."
    },
    {
     "title": "검토 메모",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "단원평가 2",
   "title": "모형과 생활을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w039",
      "c22-s42-u04-w040",
      "c22-s42-u04-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "스스로 점검",
     "text": "모두 고르기는 맞는 보기를 모두 골랐는지 다시 확인해요."
    },
    {
     "title": "검토 메모",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "단원평가 3",
   "title": "읽고 설명해요",
   "blocks": [
    {
     "type": "heading",
     "text": "읽기 자료 · 낮은 섬나라"
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-atoll.webp",
       "alt": "바다 높이와 거의 같은 낮고 평평한 산호섬",
       "cap": "낮은 섬을 떠올리는 설명 그림(특정 장소의 실제 사진 아님)"
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "유엔개발계획(UNDP)은 태평양의 섬나라 투발루에서 해수면 상승이 지하수와 농작물 재배 등에 어려움을 줄 수 있다고 설명해요. 투발루에서는 실제 땅 높이와 해안 정보를 조사하고 생활 공간을 보호할 방법을 계획해 왔어요. 피해만 생각하며 포기하기보다 사람들이 어떤 자료와 도움으로 대응하는지도 살펴봐요."
    },
    {
     "type": "text",
     "text": "자료: UNDP 「Notes from Tuvalu: Leading the way in adapting to sea-level rise」. 위 그림은 특정 섬을 촬영한 사진이 아닌 낮은 섬을 떠올리는 설명 그림이에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w042",
      "c22-s42-u04-w043",
      "c22-s42-u04-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "읽기 메모",
     "text": "글에서 「땅이 낮다」를 알려 주는 낱말에 밑줄을 그어요."
    },
    {
     "title": "서술형 쓰는 법",
     "text": "주장 → 모형 근거(집 A·D) → 결론 순서로 써요."
    },
    {
     "title": "검토 메모",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "서술형 · 창의",
   "title": "상황에 도움이 되는 안내문을 그려요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "가능한 행동 두 가지와 까닭·필요한 도움을 나타내요."
    },
    {
     "title": "더 알아보기",
     "text": "그림 솜씨보다 행동을 이해하고 따라 할 수 있는지가 중요해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 계획인 일과 실제로 한 일을 구분해요.",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "서술형 · 마무리",
   "title": "모형의 근거와 생활의 실천을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w046"
     ]
    },
    {
     "type": "field",
     "title": "처음 생각과 비교",
     "hint": "2번에 쓴 처음 생각에서 바뀌거나 더 확인하고 싶은 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 주어진 조건에서만 결과를 말해 줘요."
    },
    {
     "title": "더 알아보기",
     "text": "현재 안내와 어른의 도움으로 함께 계획을 보완해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다음에 실제로 해 볼 일과 확인 방법",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "자료를 읽는 법",
   "title": "출처·모형·가상 기록을 구별해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "table",
     "heads": [
      "자료",
      "알 수 있는 범위"
     ],
     "rows": [
      [
       "기상청 기온 자료",
       "정해진 지역·기간의 평균 비교"
      ],
      [
       "해안 마을 모형",
       "정한 연결·땅 높이·물높이 조건의 결과"
      ],
      [
       "가상 표와 그림 설계",
       "읽기와 설명 연습, 실제 학생 측정 기록은 아님"
      ]
     ]
    },
    {
     "type": "text",
     "text": "현행 교육과정의 사례·생활 영향·대응 실천을 중심으로 공부해요. 자료를 읽거나 계획을 만든 것과 실제로 해 본 것을 나누어 남겨요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관·자료 제목·발표 시점과 비교 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주지 않는 사실은 별도로 확인해야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "더 확인할 자료나 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "생각을 잇는 개념",
   "title": "기간과 지역이 같은가요?",
   "blocks": [
    {
     "type": "text",
     "text": "평년은 비교 기준이고 각 한 해 평균은 그해의 자료예요. 한 해가 앞선 해보다 낮아져도 오랜 기간의 변화가 끝났다고 바로 정할 수는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "먼저 읽을 것",
      "확인할 까닭"
     ],
     "rows": [
      [
       "기관·지역",
       "전국 평균과 학교 값을 섞지 않아요."
      ],
      [
       "기간·단위",
       "한 해·30년·하루와℃를 구별해요."
      ],
      [
       "비교와 한계",
       "두 값의 차이와 장기 변화 판단을 나눠요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상 도시 자료: 평년 12.0 ℃, 최근 10년 연평균 13.1 ℃예요. 어떻게 설명할까요?",
     "steps": [
      [
       "비교 조건",
       "같은 도시의 연평균 기온인지 확인해요."
      ],
      [
       "차이",
       "13.1−12.0=1.1(℃)"
      ],
      [
       "뜻",
       "그 기간의 평균이 1.1 ℃ 높았다는 뜻이며 모든 날이 같다는 뜻은 아니에요."
      ]
     ],
     "answer": "지역·기간·평균과 비교 범위를 함께 말해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "숫자만 빼기 전에 무엇의 평균인지 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각을 잇는 개념",
   "title": "모형의 결과를 실제에 쓸 때",
   "blocks": [
    {
     "type": "text",
     "text": "모형은 정한 조건에서 비교를 돕지만 실제의 모든 조건을 담지는 못해요. 모형에서 안 젖은 집을 찾은 것과 실제 지역이 안전하다고 확인한 것은 달라요."
    },
    {
     "type": "table",
     "heads": [
      "모형에서 비교한 것",
      "실제에 더 필요한 정보"
     ],
     "rows": [
      [
       "물높이·땅 높이·벽 유무",
       "지형·물길·파도·시설 상태·현재 안내"
      ],
      [
       "같게 둔 통·집 위치",
       "실제 장소마다 달라지는 환경"
      ],
      [
       "제시된 모형 값",
       "현장에서 확인한 실제 자료"
      ]
     ]
    },
    {
     "type": "field",
     "title": "설명을 보완하기",
     "hint": "모형에서 확인한 조건 하나와 실제에 더 확인할 조건 하나를 이어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 근거가 되지만 실제 안전을 전부 결정하지는 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각을 잇는 개념",
   "title": "계획·기회·실천을 나누어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상태",
      "뜻",
      "읽을 때 주의"
     ],
     "rows": [
      [
       "계획",
       "하기로 정한 것",
       "이미 행동한 횟수로 세지 않아요."
      ],
      [
       "기회",
       "정한 행동을 할 수 있었던 때",
       "기회가 없는 날도 있어요."
      ],
      [
       "확인한 실천",
       "실제로 했다고 확인한 행동",
       "확인 기준과 기록 범위를 밝혀요."
      ],
      [
       "미기록",
       "실제 결과를 적지 않은 것",
       "0이나 계획의 수로 채우지 않아요."
      ]
     ]
    },
    {
     "type": "text",
     "text": "실천이 어려웠다면 누구를 탓하기보다 필요한 도움과 다음 방법을 의논해요. 행동 횟수만으로 전력량 감소나 기후의 변화 원인까지 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "우리 말로 구별하기",
     "hint": "계획과 실제 행동이 다른 예를 하나 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "정직한 빈 기록도 다음 계획을 고치는 데 도움이 돼요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ①",
   "title": "전국 한 해 평균을 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "기관 자료를 읽는 활동이에요. 평년은 30년 평균이며 날짜별 기온이나 학교에서 직접 잰 값은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "자료",
      "전국 연평균 기온(℃)"
     ],
     "rows": [
      [
       "평년(1991~2020)",
       "12.5"
      ],
      [
       "2024년",
       "14.5"
      ],
      [
       "2025년",
       "13.7"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w047",
      "c22-s42-u04-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전국·한 해 평균·평년의 기간을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "annual-temperature-v1",
    "text": "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ①",
   "title": "값의 차이와 자료의 범위",
   "blocks": [
    {
     "type": "text",
     "text": "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w049",
      "c22-s42-u04-w050",
      "c22-s42-u04-w051",
      "c22-s42-u04-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "어느 두 값을 비교했는지 먼저 밝혀요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "annual-temperature-v1",
    "text": "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ① · 설명",
   "title": "한 해가 낮아졌다면?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w053"
     ]
    },
    {
     "type": "field",
     "title": "의견을 듣고 보완하기",
     "hint": "친구에게 자료로 아는 것과 더 볼 것을 설명해요. 아직 듣지 않은 의견을 실제 의견처럼 쓰지 않아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "짧은 비교와 오랜 기간의 판단은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ① · 그림",
   "title": "세 값과 기간을 함께 보여 줘요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 눈금과 0 기준·단위·자료의 기간을 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ②",
   "title": "벽의 효과만 비교한 것은?",
   "blocks": [
    {
     "type": "text",
     "text": "모든 집은 같은 물과 연결되어 있고 땅·집 위치·읽는 기준은 각 모형에서 같아요. 학습용 모형 자료이며 라는 관찰할 계획만 있고 실제 결과는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "모형",
      "물높이",
      "벽",
      "물에 닿은 집"
     ],
     "rows": [
      [
       "가",
       "3 cm",
       "없음",
       "B·C"
      ],
      [
       "나",
       "3 cm",
       "3.5 cm",
       "0채"
      ],
      [
       "다",
       "4 cm",
       "3.5 cm",
       "B·C·D"
      ],
      [
       "라",
       "3 cm",
       "3.5 cm",
       "미기록"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w055",
      "c22-s42-u04-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물높이·벽 유무·관찰 여부를 따로 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sea-comparison-v1",
    "text": "연습용 해안 모형 자료예요. 땅 높이는A4.5·B1.5·C2.5·D3.5·E6 cm이고 모든 집이 같은 물과 연결되어 있어요. 가: 물 3 cm·벽 없음→B, C. 나: 물 3 cm·벽 3.5 cm→물에 닿은 집 0채. 다: 물 4 cm·벽 3.5 cm→B, C, D. 라: 물 3 cm·벽 3.5 cm로 관찰할 계획이나 결과는 미기록이에요. 나머지 조건은 같고 실제 마을의 기록이 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ②",
   "title": "조건·결과·미관찰을 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 해안 모형 자료예요. 땅 높이는A4.5·B1.5·C2.5·D3.5·E6 cm이고 모든 집이 같은 물과 연결되어 있어요. 가: 물 3 cm·벽 없음→B, C. 나: 물 3 cm·벽 3.5 cm→물에 닿은 집 0채. 다: 물 4 cm·벽 3.5 cm→B, C, D. 라: 물 3 cm·벽 3.5 cm로 관찰할 계획이나 결과는 미기록이에요. 나머지 조건은 같고 실제 마을의 기록이 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w057",
      "c22-s42-u04-w058",
      "c22-s42-u04-w059",
      "c22-s42-u04-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상할 수 있어도 실제 기록이 생기는 것은 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sea-comparison-v1",
    "text": "연습용 해안 모형 자료예요. 땅 높이는A4.5·B1.5·C2.5·D3.5·E6 cm이고 모든 집이 같은 물과 연결되어 있어요. 가: 물 3 cm·벽 없음→B, C. 나: 물 3 cm·벽 3.5 cm→물에 닿은 집 0채. 다: 물 4 cm·벽 3.5 cm→B, C, D. 라: 물 3 cm·벽 3.5 cm로 관찰할 계획이나 결과는 미기록이에요. 나머지 조건은 같고 실제 마을의 기록이 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ② · 설명",
   "title": "조건이 달라지면 결과도 달라요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w061"
     ]
    },
    {
     "type": "field",
     "title": "모형 비교를 해 본다면",
     "hint": "교사와 처음 상태·읽는 자리·기준을 정해요. 실제로 해 본 결과와 제공 자료를 구별해 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 지역의 안전은 모형 값만으로 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ② · 그림",
   "title": "같게 둔 것과 바꾼 것을 보여 줘요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 물높이를 같게 그리고 벽 차이와 결과를 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ③",
   "title": "이번 주에 할 수 있는 일",
   "blocks": [
    {
     "type": "text",
     "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w063",
      "c22-s42-u04-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 사용·보류된 구입·도움 조건을 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "school-constraints-v1",
    "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "실천에 필요한 도움과 순서",
   "blocks": [
    {
     "type": "text",
     "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w065",
      "c22-s42-u04-w066",
      "c22-s42-u04-w067",
      "c22-s42-u04-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "혼자 하기 어려운 일을 실제로 할 수 있는 도움과 이어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "school-constraints-v1",
    "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③ · 설명",
   "title": "서로 다른 필요를 고려해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w069"
     ]
    },
    {
     "type": "field",
     "title": "의논할 질문",
     "hint": "각자 할 수 있는 행동과 공통으로 필요한 도움을 하나씩 물어요. 실제 대화를 하지 않았다면 예상 질문으로 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 행동을 강요하기보다 가능한 방법을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ③ · 그림",
   "title": "행동·도움·확인 기준을 담아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안내를 만든 것과 실제 행동한 것을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "기회가 없는 날과 미기록",
   "blocks": [
    {
     "type": "text",
     "text": "가상의 반에서 사용하지 않는 전등을 확인할 계획과 실제 기회·확인 횟수를 비교해요. 전력량을 잰 기록은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "요일",
      "계획",
      "기회",
      "확인"
     ],
     "rows": [
      [
       "월",
       "3회",
       "3회",
       "3회"
      ],
      [
       "화",
       "3회",
       "2회",
       "1회"
      ],
      [
       "수",
       "3회",
       "3회",
       "미기록"
      ],
      [
       "목",
       "3회",
       "0회",
       "0회"
      ],
      [
       "금",
       "3회",
       "2회",
       "2회"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w071",
      "c22-s42-u04-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 전등을 끄지 않고 확인할 수 있었던 때를 기회로 세었어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "action-records-v1",
    "text": "가상의 반에서 사용하지 않는 전등 확인을 계획했어요. 월: 계획 3회·기회 3회·확인 3회. 화: 계획 3회·기회 2회·확인 1회. 수: 계획 3회·기회 3회·실제 확인은 미기록. 목: 계획 3회·기회 0회·확인 0회. 금: 계획 3회·기회 2회·확인 2회. 기회는 필요한 전등을 끄지 않고 빈 교실을 확인할 수 있었던 때예요. 목요일에는 그 기회가 없었어요. 실제 학교의 실천 기록이나 전력량 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ④",
   "title": "확인된 만큼만 합하고 설명해요",
   "blocks": [
    {
     "type": "text",
     "text": "가상의 반에서 사용하지 않는 전등 확인을 계획했어요. 월: 계획 3회·기회 3회·확인 3회. 화: 계획 3회·기회 2회·확인 1회. 수: 계획 3회·기회 3회·실제 확인은 미기록. 목: 계획 3회·기회 0회·확인 0회. 금: 계획 3회·기회 2회·확인 2회. 기회는 필요한 전등을 끄지 않고 빈 교실을 확인할 수 있었던 때예요. 목요일에는 그 기회가 없었어요. 실제 학교의 실천 기록이나 전력량 측정값은 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w073",
      "c22-s42-u04-w074",
      "c22-s42-u04-w075",
      "c22-s42-u04-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "미기록을 0으로 바꾸거나 계획 수를 실제 수로 세지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "action-records-v1",
    "text": "가상의 반에서 사용하지 않는 전등 확인을 계획했어요. 월: 계획 3회·기회 3회·확인 3회. 화: 계획 3회·기회 2회·확인 1회. 수: 계획 3회·기회 3회·실제 확인은 미기록. 목: 계획 3회·기회 0회·확인 0회. 금: 계획 3회·기회 2회·확인 2회. 기회는 필요한 전등을 끄지 않고 빈 교실을 확인할 수 있었던 때예요. 목요일에는 그 기회가 없었어요. 실제 학교의 실천 기록이나 전력량 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ④ · 설명",
   "title": "행동과 결과의 원인을 구별해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w077"
     ]
    },
    {
     "type": "field",
     "title": "추가로 확인할 자료",
     "hint": "어떤 자료와 조건을 더 보면 판단을 보완할지 적어요. 실제 전력량 자료가 있다고 꾸미지 않아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "확인 횟수와 전력량은 서로 다른 자료예요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④ · 그림",
   "title": "0·미기록·기회 없음을 나타내요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "정해진 숫자와 모르는 상태를 구별해 표현해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "종합 사고력 · 설명",
   "title": "근거의 범위를 지키며 의견을 고쳐요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료·모형·실천의 서로 다른 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "종합 사고력 · 그림",
   "title": "세 구역 설명판으로 연결해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·조건·도움을 함께 보여 주고 실행 여부를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~4",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w001",
      "c22-s42-u04-w002",
      "c22-s42-u04-w003",
      "c22-s42-u04-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 5~7",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w005",
      "c22-s42-u04-w006",
      "c22-s42-u04-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 8~10",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w008",
      "c22-s42-u04-w009",
      "c22-s42-u04-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 11~14",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w011",
      "c22-s42-u04-w012",
      "c22-s42-u04-w013",
      "c22-s42-u04-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 15~18",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w015",
      "c22-s42-u04-w016",
      "c22-s42-u04-w017",
      "c22-s42-u04-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
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
      "c22-s42-u04-w019",
      "c22-s42-u04-w020",
      "c22-s42-u04-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
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
      "c22-s42-u04-w022",
      "c22-s42-u04-w023",
      "c22-s42-u04-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
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
      "c22-s42-u04-w025",
      "c22-s42-u04-w026",
      "c22-s42-u04-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
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
      "c22-s42-u04-w028",
      "c22-s42-u04-w029",
      "c22-s42-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 31~34",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w031",
      "c22-s42-u04-w032",
      "c22-s42-u04-w033",
      "c22-s42-u04-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 35~38",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w035",
      "c22-s42-u04-w036",
      "c22-s42-u04-w037",
      "c22-s42-u04-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 39~42",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w039",
      "c22-s42-u04-w040",
      "c22-s42-u04-w041",
      "c22-s42-u04-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
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
      "c22-s42-u04-w043",
      "c22-s42-u04-w044",
      "c22-s42-u04-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
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
      "c22-s42-u04-w046",
      "c22-s42-u04-w047",
      "c22-s42-u04-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 49~52",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w049",
      "c22-s42-u04-w050",
      "c22-s42-u04-w051",
      "c22-s42-u04-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 53~55",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w053",
      "c22-s42-u04-w054",
      "c22-s42-u04-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 56~59",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w056",
      "c22-s42-u04-w057",
      "c22-s42-u04-w058",
      "c22-s42-u04-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 60~62",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w060",
      "c22-s42-u04-w061",
      "c22-s42-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 63~66",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w063",
      "c22-s42-u04-w064",
      "c22-s42-u04-w065",
      "c22-s42-u04-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 67~69",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w067",
      "c22-s42-u04-w068",
      "c22-s42-u04-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 70~72",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w070",
      "c22-s42-u04-w071",
      "c22-s42-u04-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 73~76",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w073",
      "c22-s42-u04-w074",
      "c22-s42-u04-w075",
      "c22-s42-u04-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
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
      "c22-s42-u04-w077",
      "c22-s42-u04-w078",
      "c22-s42-u04-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 80~80",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~16번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "1",
       "객관식 · 날씨와 기후",
       "③"
      ],
      [
       "2",
       "단답 · 해수면 상승",
       "교사 확인(처음 생각)"
      ],
      [
       "3",
       "모두 고르기 · 기후변화 사례",
       "①, ③, ⑤"
      ],
      [
       "4",
       "빈칸 · 평년",
       "여러 해(30년)"
      ],
      [
       "5",
       "연결 · 날씨와 기후",
       "(1) 날씨 (2) 기후 (3) 날씨"
      ],
      [
       "6",
       "객관식 · 평년",
       "⑤"
      ],
      [
       "7",
       "단답 · 평년 비교",
       "1.7 ℃"
      ],
      [
       "8",
       "서술 · 날씨와 기후",
       "교사 확인(해설 쪽)"
      ],
      [
       "9",
       "객관식 · 기후변화 사례",
       "②"
      ],
      [
       "10",
       "모두 고르기 · 기후변화 사례",
       "②, ③, ⑤"
      ],
      [
       "11",
       "연결 · 기후변화 사례",
       "(1) ㄴ (2) ㄱ (3) ㄷ"
      ],
      [
       "12",
       "객관식 · 기후변화 사례",
       "①"
      ],
      [
       "13",
       "빈칸 · 생활과 사람의 활동",
       "관련"
      ],
      [
       "14",
       "순서 · 자료 조사와 토의",
       "ㄷ → ㄱ → ㄹ → ㄴ"
      ],
      [
       "15",
       "객관식 · 생활의 변화",
       "④"
      ],
      [
       "16",
       "모두 고르기 · 생활과 실천",
       "①, ②, ④"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "17~32번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "17",
       "단답 · 해수면 모형",
       "B, C"
      ],
      [
       "18",
       "객관식 · 해수면 모형",
       "③"
      ],
      [
       "19",
       "서술 · 해수면 모형",
       "교사 확인(해설 쪽)"
      ],
      [
       "20",
       "단답 · 방파제",
       "0채"
      ],
      [
       "21",
       "객관식 · 방파제",
       "⑤"
      ],
      [
       "22",
       "서술 · 방파제",
       "교사 확인(해설 쪽)"
      ],
      [
       "23",
       "연결 · 필요와 실천",
       "(1) ㄷ (2) ㄱ (3) ㄹ (4) ㄴ"
      ],
      [
       "24",
       "객관식 · 건강과 에너지",
       "②"
      ],
      [
       "25",
       "모두 고르기 · 생활 조건과 실천",
       "①, ③, ④"
      ],
      [
       "26",
       "서술 · 실천 계획",
       "교사 확인(해설 쪽)"
      ],
      [
       "27",
       "객관식 · 자료 해석",
       "①"
      ],
      [
       "28",
       "서술 · 자료 해석",
       "교사 확인(해설 쪽)"
      ],
      [
       "29",
       "객관식 · 자료 적용",
       "②"
      ],
      [
       "30",
       "그림 · 자료 적용",
       "교사 확인(해설 쪽)"
      ],
      [
       "31",
       "빈칸 · 정리",
       "상태 / 평균"
      ],
      [
       "32",
       "빈칸 · 정리",
       "관련"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "33~48번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "33",
       "빈칸 · 정리",
       "거리 / 높이"
      ],
      [
       "34",
       "빈칸 · 정리",
       "계획"
      ],
      [
       "35",
       "객관식 · 날씨와 기후",
       "④"
      ],
      [
       "36",
       "객관식 · 평년",
       "③"
      ],
      [
       "37",
       "순서 · 해안 모형의 비교",
       "ㄷ → ㄹ → ㄱ → ㄴ"
      ],
      [
       "38",
       "단답 · 해수면 모형",
       "1채(B)"
      ],
      [
       "39",
       "객관식 · 모형의 한계",
       "⑤"
      ],
      [
       "40",
       "모두 고르기 · 기후변화의 영향",
       "②, ④, ⑤"
      ],
      [
       "41",
       "연결 · 실천에 필요한 도움",
       "(1) ㄴ (2) ㄷ (3) ㄱ"
      ],
      [
       "42",
       "객관식 · 해수면 상승",
       "②"
      ],
      [
       "43",
       "빈칸 · 모형과 실제",
       "모형"
      ],
      [
       "44",
       "서술 · 해수면 모형",
       "교사 확인(해설 쪽)"
      ],
      [
       "45",
       "그림 · 함께 하는 실천",
       "교사 확인(해설 쪽)"
      ],
      [
       "46",
       "서술 · 함께 하는 실천",
       "교사 확인(해설 쪽)"
      ],
      [
       "47",
       "객관식 · 기온 자료 비교",
       "①"
      ],
      [
       "48",
       "모두 고르기 · 기온 자료의 범위",
       "②, ④"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "49~64번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "49",
       "빈칸 · 평균의 기준",
       "30 / 1"
      ],
      [
       "50",
       "단답 · 두 해의 비교",
       "0.8 ℃"
      ],
      [
       "51",
       "연결 · 자료의 종류",
       "(1) ㄴ (2) ㄷ (3) ㄱ"
      ],
      [
       "52",
       "순서 · 기온 자료 읽는 순서",
       "ㄱ → ㄹ → ㄴ → ㄷ"
      ],
      [
       "53",
       "서술 · 한 해와 기후변화",
       "교사 확인(해설 쪽)"
      ],
      [
       "54",
       "그림 · 기온 자료의 그림",
       "교사 확인(해설 쪽)"
      ],
      [
       "55",
       "객관식 · 방파제 효과의 비교",
       "④"
      ],
      [
       "56",
       "모두 고르기 · 모형 결과의 조건",
       "①, ②, ③, ⑤"
      ],
      [
       "57",
       "빈칸 · 관찰과 예상",
       "3 / 미기록"
      ],
      [
       "58",
       "단답 · 피해 수 비교",
       "2채"
      ],
      [
       "59",
       "연결 · 공정한 비교의 역할",
       "(1) ㄴ (2) ㄹ (3) ㄱ (4) ㄷ"
      ],
      [
       "60",
       "순서 · 방파제 비교 순서",
       "ㄹ → ㄴ → ㄷ → ㄱ"
      ],
      [
       "61",
       "서술 · 모형에서 실제로",
       "교사 확인(해설 쪽)"
      ],
      [
       "62",
       "그림 · 비교 그림",
       "교사 확인(해설 쪽)"
      ],
      [
       "63",
       "객관식 · 조건에 맞는 실천",
       "③"
      ],
      [
       "64",
       "모두 고르기 · 함께 실천할 조건",
       "①, ④, ⑤"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "65~80번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "65",
       "빈칸 · 실천에 필요한 도움",
       "교사"
      ],
      [
       "66",
       "단답 · 필요한 사용 구별",
       "1곳"
      ],
      [
       "67",
       "연결 · 상황과 도움",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "68",
       "순서 · 실천과 돌아보기",
       "ㄴ → ㄱ → ㄷ → ㄹ"
      ],
      [
       "69",
       "서술 · 서로 다른 필요",
       "교사 확인(해설 쪽)"
      ],
      [
       "70",
       "그림 · 실행 가능한 안내",
       "교사 확인(해설 쪽)"
      ],
      [
       "71",
       "객관식 · 기회와 기록",
       "⑤"
      ],
      [
       "72",
       "모두 고르기 · 기록으로 알 수 있는 것",
       "②, ③, ④"
      ],
      [
       "73",
       "빈칸 · 0과 미기록",
       "알 수 없음"
      ],
      [
       "74",
       "단답 · 확인된 실천 합계",
       "6회"
      ],
      [
       "75",
       "연결 · 기록의 상태",
       "(1) ㄹ (2) ㄴ (3) ㄷ (4) ㄱ"
      ],
      [
       "76",
       "순서 · 실천 기록 비교 순서",
       "ㄱ → ㄷ → ㄹ → ㄴ"
      ],
      [
       "77",
       "서술 · 실천과 결과의 원인",
       "교사 확인(해설 쪽)"
      ],
      [
       "78",
       "그림 · 기록을 그림으로 읽기",
       "교사 확인(해설 쪽)"
      ],
      [
       "79",
       "서술 · 자료를 연결해 설명하기",
       "교사 확인(해설 쪽)"
      ],
      [
       "80",
       "그림 · 한 장으로 연결하기",
       "교사 확인(해설 쪽)"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  }
 ],
 "figures": {
  "hero": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s42-u04-photo-setup.webp\" alt=\"투명한 통 속에 점토로 만든 해안 마을 모형과 작은 집들, 세워 둔 자\" loading=\"eager\"><p class=\"ed-photo-note\">바다 바로 옆 언덕 위의 집과 안쪽 낮은 땅의 집 — 어느 집이 먼저 물에 닿을까요?</p><small class=\"ed-photo-credit\">실제 사진 아님</small></div>",
  "build": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s42-u04-sea-build.webp\" alt=\"점토로 만든 해안 마을 모형과 눈금자\" loading=\"eager\"><p class=\"ed-photo-note\">통·점토 땅·집 위치는 그대로 두고 물높이만 바꿔요.</p><small class=\"ed-photo-credit\">3D 모형 렌더 · 모형 값(실제 측정이 아님)</small></div>",
  "start": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s42-u04-sea-start.webp\" alt=\"물높이 1 cm에서 시작하는 해안 마을 모형\" loading=\"eager\"><p class=\"ed-photo-note\">물높이 1 cm(모형의 시작)에서 시작해 1 cm씩 높여요. 집 A~E의 땅 높이는 앞쪽 표를 봐요.</p><small class=\"ed-photo-credit\">3D 모형 렌더 · 모형 값(실제 측정이 아님)</small></div>",
  "over": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s42-u04-sea-over.webp\" alt=\"물이 방파제를 넘어 안쪽 낮은 땅까지 들어온 모형\" loading=\"eager\"><p class=\"ed-photo-note\">방파제(3.5 cm)보다 물이 높아지면 넘쳐 들어와요.</p><small class=\"ed-photo-credit\">3D 모형 렌더 · 모형 값(실제 측정이 아님)</small></div>",
  "wall": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s42-u04-sea-wall.webp\" alt=\"바닷가를 따라 방파제를 세운 모형\" loading=\"eager\"><p class=\"ed-photo-note\">방파제 높이 3.5 cm(모형 값).</p><small class=\"ed-photo-credit\">3D 모형 렌더 · 모형 값(실제 측정이 아님)</small></div>",
  "sources": "<div class=\"climate-sources\"><p><a href=\"https://www.weather.go.kr/kma/flexer/html/press/2025/01/09/ATC202501090914272_ecf71522-0d6b-4881-925a-8330dd5407bb.hwp.files/Sections1.html\">기상청 · 2024년 연 기후특성(2025-01-09)</a><br>전국 연평균 기온14.5 ℃와 평년12.5 ℃의 비교에 사용했어요. 하루하루의 기온을 뜻하지 않아요.</p><p><a href=\"https://www.undp.org/blog/notes-tuvalu-leading-way-adapting-sea-level-rise\">UNDP · Notes from Tuvalu(2023)</a><br>지하수·농작물의 어려움과 해안 자료 조사·대응 계획을 읽었어요. 지금의 공사 진행률을 뜻하지 않아요.</p><p><a href=\"https://www.weather.go.kr/kmadev/news/press_01.jsp?mode=view&amp;num=1194586\">기상청 · 2025년 연 기후특성(2026-01-06)</a><br>2025년 전국 연평균13.7 ℃를2024년14.5 ℃와 비교했어요. 두 해만으로 장기 변화나 이후 기온을 확정하지 않아요.</p></div>"
 },
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "물이 차오르는 해안 마을",
   "blocks": [
    {
     "type": "diagram",
     "key": "hero"
    },
    {
     "type": "text",
     "text": "2024년 우리나라 전국의 한 해 평균 기온은 14.5 ℃로, 30년 평균(평년) 12.5 ℃보다 2.0 ℃ 높았어요. 기온이 높아지면 우리 생활은 어떻게 달라질까요?"
    },
    {
     "type": "heading",
     "text": "미리 보는 낱말"
    },
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻"
     ],
     "rows": [
      [
       "기후",
       "한 지역에서 오랜 기간 나타나는 평균적인 날씨"
      ],
      [
       "평년값",
       "기후를 비교하는 기준. 지금은 1991~2020년 30년의 평균"
      ],
      [
       "기후변화",
       "오랜 기간에 걸쳐 기온·비·눈 등의 모습이 달라지는 것"
      ],
      [
       "해수면",
       "바닷물의 높이"
      ]
     ]
    },
    {
     "type": "heading",
     "text": "이 단원에서 할 일"
    },
    {
     "type": "list",
     "items": [
      "날씨와 기후를 구별하고 평년과 비교해 기후변화를 알아봐요.",
      "기후변화의 사례와 사람의 활동이 어떤 관계인지 알아봐요.",
      "해안 마을 모형으로 해수면이 높아질 때 어느 곳부터 잠기는지 실험해요.",
      "생활에 도움이 될 행동을 조사하고, 할 수 있는 일부터 실천해요."
     ],
     "ordered": true
    }
   ],
   "rail": [
    {
     "title": "핵심 질문",
     "text": "바닷물이 높아지면 바다와 가까운 집부터 잠길까, 땅이 낮은 집부터 잠길까?"
    },
    {
     "title": "3D 실험실",
     "text": "사이언스 랩 v2 → 「4-2 Ⅳ 기후변화와 우리 생활」 → 스스로 공부하기에서 물높이를 직접 바꿔 봐요."
    },
    {
     "title": "내 처음 생각",
     "text": "",
     "write": 6
    }
   ],
   "lead": "자료를 보고 질문하고, 모형으로 확인하고, 개념으로 설명해요.",
   "kind": "opener",
   "teacherNote": "첫 질문에 대한 예상만 받고 답은 말하지 않아요. 「해안 마을 모형」의 결과와 비교하게 해요."
  },
  {
   "section": "단원의 길잡이",
   "title": "사례에서 생활과 실천으로",
   "blocks": [
    {
     "type": "text",
     "text": "사례를 읽고 생활의 변화를 생각해요. 모형에서는 조건과 결과를 비교하고, 실제 생활에서는 필요한 정보와 도움을 찾아요. 조사한 것·예상한 것·실제로 해 본 일을 구별하며 배움을 이어 가요."
    },
    {
     "type": "table",
     "heads": [
      "배울 줄기",
      "살필 근거",
      "이어지는 문항"
     ],
     "rows": [
      [
       "기후변화의 사례",
       "기관·지역·기간·평년 비교",
       "5~12,47~54"
      ],
      [
       "사람의 활동과 생활",
       "사례 자료와 생활의 여러 조건",
       "13~16,27~28"
      ],
      [
       "해수면 상승 피해 모형",
       "물높이·땅 높이·벽·물길",
       "17~22,29~30,55~62"
      ],
      [
       "가능한 대응과 협력",
       "안전·필요한 사용·사람마다 다른 여건",
       "23~26,63~70"
      ],
      [
       "설명하고 돌아보기",
       "자료의 범위·실제 행동·도움·다음 방법",
       "31~46,71~80"
      ]
     ]
    },
    {
     "type": "heading",
     "text": "이 단원을 마치며 할 설명"
    },
    {
     "type": "list",
     "items": [
      "사례에 나온 수치와 그 수치가 뜻하는 범위를 말해요.",
      "모형에서 바꾼 것·같게 둔 것·본 결과를 연결해요.",
      "생활에 미칠 수 있는 영향과 가능한 대응을 근거로 설명해요.",
      "혼자 하기 어려운 일은 필요한 도움을 함께 정해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "처음 떠오르는 연결",
     "hint": "사례 하나에서 생활의 어떤 부분과 어떤 도움을 생각할 수 있을까요?",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사례→생활의 영향→비교 모형→가능한 실천을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "문제를 푼 기록과 실제로 조사·실천한 기록은 역할이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "단원 끝에 더 분명해진 연결과 남은 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "준비 점검",
   "title": "처음 생각을 남겨요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w001",
      "c22-s42-u04-w002",
      "c22-s42-u04-w003",
      "c22-s42-u04-w004"
     ]
    },
    {
     "type": "field",
     "title": "2번 생각의 까닭",
     "hint": "어느 조건을 보고 그렇게 예상했는지 적어요.",
     "lines": 2,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "아직 배우기 전",
     "text": "맞힌 개수보다 처음 생각과 그 까닭을 남기는 것이 중요해요."
    },
    {
     "title": "끝나고 비교",
     "text": "단원을 마치면 2번 답을 다시 읽고 바뀐 생각을 적어요.",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "틀려도 괜찮아요. 처음 생각을 그대로 써요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "① 날씨와 기후",
   "title": "하루의 상태와 오랜 기간의 평균",
   "blocks": [
    {
     "type": "text",
     "text": "그날그날의 기온·비·눈·바람·구름의 상태를 **날씨**라고 해요. 한 지역에서 오랜 기간(보통 30년) 나타나는 평균적인 날씨는 **기후**라고 해요."
    },
    {
     "type": "text",
     "text": "기후가 변했는지는 같은 지역·같은 요소(예: 연평균 기온)를 평년값과 비교해서 알아봐요. 기상청은 1991~2020년의 30년 평균을 **평년값**으로 써요."
    },
    {
     "type": "diagram",
     "key": "temps",
     "caption": "전국 연평균 기온: 평년(1991~2020) 12.5 ℃와 2024년 14.5 ℃ (기상청)"
    },
    {
     "type": "example",
     "question": "2024년 전국 연평균 기온은 평년과 비교해 어떠했나요?",
     "steps": [
      [
       "같은 기준 확인",
       "두 값 모두 「전국」의 「연평균 기온」이에요."
      ],
      [
       "빼서 비교",
       "14.5 − 12.5 = 2.0(℃)"
      ],
      [
       "해석",
       "한 해 평균이 높았다는 뜻이지, 날마다 2 ℃씩 더웠다는 뜻은 아니에요."
      ]
     ],
     "answer": "2024년은 평년보다 2.0 ℃ 높았어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "날씨 = 그날의 상태 · 기후 = 오랜 기간의 평균"
    },
    {
     "title": "더 알아보기",
     "text": "평년값은 10년마다 새로 계산해요. 지금 쓰는 값은 1991~2020년의 평균이에요."
    },
    {
     "title": "오개념 메모",
     "text": "「오늘 추우니 지구가 더워지지 않는다」는 날씨로 기후를 판단한 잘못이에요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "어느 지역의 어떤 기간인가요?",
   "blocks": [
    {
     "type": "text",
     "text": "기온·비·눈 등의 사례를 비교할 때는 **지역·기간·요소·비교 기준**을 먼저 읽어요. 전국의 한 해 평균을 학교의 어느 하루 기온으로 바꾸어 말하지 않아요. 한 해의 평균이 앞선 해보다 낮아도 오랜 기간의 변화가 끝났다고 단정할 수는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "자료에 붙여 읽을 말",
      "살필 까닭"
     ],
     "rows": [
      [
       "전국·같은 도시·학교",
       "범위가 다른 장소의 값을 섞지 않아요."
      ],
      [
       "하루·한 해·30년 평년",
       "평균을 낸 기간이 무엇인지 밝혀요."
      ],
      [
       "기온·강수량 등과 단위",
       "서로 다른 요소를 같은 크기로 비교하지 않아요."
      ],
      [
       "자료의 출처와 발표 시점",
       "원래 자료와 비교 기준을 다시 확인할 수 있어요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "기상청의2025년 전국 연평균 기온13.7 ℃를 제시된 평년12.5 ℃와 비교해 설명해요.",
     "steps": [
      [
       "조건 읽기",
       "전국 연평균 기온끼리 비교해요. 평년은1991~2020년30년 기준이에요."
      ],
      [
       "차이 구하기",
       "13.7−12.5=1.2(℃)이므로2025년 한 해 평균이 제시된 평년보다 높아요."
      ],
      [
       "뜻 한정하기",
       "전국 한 해 평균의 비교예요. 학교의 모든 날이1.2 ℃씩 더웠다는 뜻은 아니에요."
      ]
     ],
     "answer": "2025년 전국 한 해 평균은 제시된 평년보다1.2 ℃ 높았어요. 기간과 지역을 함께 말해요."
    },
    {
     "type": "text",
     "text": "내용 근거: 기상청 「2025년 연 기후특성」(2026-01-06). 자세한 출처는 자료를 읽는 법 지면에서 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "숫자와 함께 지역·기간·요소·기준을 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 해 평균은 그해의 여러 날을 모은 값이에요. 모든 날의 상태가 같다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "서로 섞어 비교하면 안 되는 두 자료와 그 까닭을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "① 날씨와 기후 · 유형 연습",
   "title": "날씨와 기후를 구별해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w005",
      "c22-s42-u04-w006",
      "c22-s42-u04-w007",
      "c22-s42-u04-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "풀이 메모",
     "text": "「해마다」「여름은」처럼 되풀이되는 말이 있으면 기후, 「오늘」「이번 주」면 날씨예요."
    },
    {
     "title": "계산할 때",
     "text": "같은 지역·같은 요소끼리 빼요. 단위 ℃를 꼭 써요."
    },
    {
     "title": "헷갈린 문제",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "② 기후변화의 사례",
   "title": "여러 해에 걸쳐 달라진 모습",
   "blocks": [
    {
     "type": "text",
     "text": "**기후변화**는 오랜 기간에 걸쳐 기온·비·눈 같은 기후의 평균적인 모습이 달라지는 것이에요. 우리나라에서도 여러 가지 변화가 나타나고 있어요."
    },
    {
     "type": "table",
     "heads": [
      "달라진 것",
      "나타나는 모습",
      "우리 생활에 주는 영향"
     ],
     "rows": [
      [
       "더위",
       "폭염과 열대야가 나타나는 날이 늘어나요.",
       "더위로 몸이 아픈 사람이 늘고 냉방에 쓰는 에너지가 늘어요."
      ],
      [
       "비",
       "짧은 시간에 많은 비가 내리거나 오래 비가 오지 않아요.",
       "낮은 곳이 물에 잠기거나 물이 모자라요."
      ],
      [
       "생물",
       "봄꽃이 일찍 피고 농작물을 기르는 곳이 북쪽으로 옮겨 가요.",
       "기르는 작물과 잡히는 물고기가 달라져요."
      ],
      [
       "바다",
       "바닷물의 온도와 높이가 높아져요.",
       "바닷가의 낮은 땅이 잠길 위험이 커져요."
      ]
     ]
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-heatwave.webp",
       "alt": "햇볕이 강한 여름 거리",
       "cap": "폭염"
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-downpour.webp",
       "alt": "많은 비로 물에 잠긴 낮은 길",
       "cap": "집중호우"
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-drought.webp",
       "alt": "물이 말라 갈라진 저수지 바닥",
       "cap": "가뭄"
      }
     ],
     "numbered": false,
     "cols": 3,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "한 번의 소나기나 하루의 추위만으로 기후변화를 판단하지 않아요. 평년과 다른 사례를 여러 해의 자료와 함께 살펴봐요. 생물·농작물의 변화에는 지역과 재배 방법 등 다른 조건도 영향을 줄 수 있어요."
    },
    {
     "type": "heading",
     "text": "확인 문제"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기후변화 = 여러 해에 걸쳐 기후의 평균적인 모습이 달라지는 것"
    },
    {
     "title": "더 알아보기",
     "text": "생물과 농작물의 변화는 기후 이외에 지역 환경과 재배 방법 등의 조건도 함께 살펴요."
    },
    {
     "title": "오개념 메모",
     "text": "평년과 크게 다른 사례를 찾아도 원인과 장기 변화를 그것 하나로 확정하지 않아요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "비가 많이 올 때 생활의 어느 부분이 달라질까요?",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-downpour.webp",
       "alt": "비가 내려 도로에 물이 고인 모습을 떠올리는 설명 그림",
       "cap": "설명용 그림 · 실제 지역의 관측 사진이 아니에요. 물이 찬 길에 들어가 확인하지 않아요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "짧은 시간에 많은 비가 내리면 물이 빠져나가는 길, 낮은 땅, 사람들이 사용하는 시설에 따라 생활의 영향이 달라질 수 있어요. 비가 많이 왔다는 사실만으로 모든 장소의 피해가 같다고 정하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "살펴볼 생활",
      "더 필요한 정보"
     ],
     "rows": [
      [
       "학교에 오가는 길",
       "낮은 길·지하 공간과 통제 안내"
      ],
      [
       "집과 가게의 생활 공간",
       "땅 높이·배수·시설 상태"
      ],
      [
       "논밭과 물 이용",
       "비가 내린 때·양과 물이 빠지는 조건"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상의 마을 자료예요. 같은 비가 내린 날 낮은 길은 통제됐고 높은 길은 통제되지 않았어요. 무엇을 말할 수 있나요?",
     "steps": [
      [
       "자료 확인",
       "비가 같아도 두 길의 위치와 통제 결과가 다르게 제시됐어요."
      ],
      [
       "생활 연결",
       "평소 이용하던 길을 바꿔야 하는 사람이 있을 수 있어요."
      ],
      [
       "확인과 도움",
       "높은 길도 언제나 안전하다고 정하지 않고 어른과 현재 통제 안내를 확인해요."
      ]
     ],
     "answer": "제공된 상황에서 이용 조건이 달라졌다고 설명하고, 실제 이동은 현재 안내와 어른의 도움으로 정해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 비라도 지형·물길·시설·이용 상황에 따라 영향이 달라질 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "한 번의 비와 피해 기록만으로 장기 기후변화의 원인을 모두 확인한 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생활의 영향 하나와 더 확인할 정보 하나를 이어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "생물의 변화를 볼 때 무엇을 같게 살필까요?",
   "blocks": [
    {
     "type": "text",
     "text": "꽃 피는 때나 생물이 활동하는 기간도 생활·환경 변화를 살피는 단서가 돼요. 어떤 생물을 어디에서 같은 기준으로 관찰했는지와 함께 읽어야 해요. 자료에 나온 변화와 그 변화의 원인을 바로 같은 말로 쓰지는 않아요."
    },
    {
     "type": "table",
     "heads": [
      "학습용 가상 꽃 관찰",
      "앞10년 평균",
      "뒤10년 평균"
     ],
     "rows": [
      [
       "같은 학교의 같은 종류 꽃·같은 개화 기준",
       "4월12일",
       "4월10일"
      ],
      [
       "함께 남긴 관찰 조건",
       "물주기 기록 있음",
       "물주기 방법 바뀜"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 가상 자료로 「모든 꽃이 기온 때문에2일 일찍 핀다」고 말해도 될까요?",
     "steps": [
      [
       "관찰한 사실",
       "이 학교에서 관찰한 꽃의 평균 개화일은 제시된 두 기간 사이2일 빨라졌어요."
      ],
      [
       "조건 대조",
       "물주기 방법도 달라졌다고 적혀 있어요. 기온만을 원인으로 분리한 비교가 아니에요."
      ],
      [
       "추가 확인",
       "같은 종류·장소·관찰 기준의 여러 해 자료와 물주기 등 달라진 조건을 더 살펴요."
      ]
     ],
     "answer": "관찰한 꽃과 기간의 변화는 말할 수 있지만 모든 꽃·모든 지역이나 원인 하나로 넓혀 말하지 않아요."
    },
    {
     "type": "field",
     "title": "주장을 보완해요",
     "hint": "관찰한 사실과 아직 확인하지 못한 원인을 나누어 두 문장으로 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "어떤 생물을 같은 기준으로 보았는지 밝히고 관찰과 원인을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "평균 날짜가 달라졌어도 모든 해·모든 개체가 같은 날짜만큼 변했다는 뜻은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료에 더 남기면 좋을 관찰 조건을 하나와 그 까닭을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "② 기후변화의 사례 · 유형 연습",
   "title": "사례와 영향을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w010",
      "c22-s42-u04-w011",
      "c22-s42-u04-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "풀이 메모",
     "text": "「무엇이 달라졌나 → 누구에게 어떤 영향」 순서로 이어 생각해요."
    },
    {
     "title": "〈보기〉 문제",
     "text": "먼저 각 보기가 어떤 변화의 결과인지 적어 두고 짝지어요."
    },
    {
     "title": "헷갈린 문제",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "③ 기후변화와 사람의 활동",
   "title": "우리 생활과 어떤 관련이 있을까요?",
   "blocks": [
    {
     "type": "text",
     "text": "물건 만들기·이동·전기 사용 같은 **사람의 활동**과 기후변화의 관련성을 믿을 만한 자료와 생활 사례로 살펴봐요."
    },
    {
     "type": "table",
     "heads": [
      "살펴볼 생활",
      "조사할 질문",
      "토의할 점"
     ],
     "rows": [
      [
       "전기 사용",
       "쓰지 않는 곳에도 전등이 켜져 있나요?",
       "꼭 필요한 사용과 낭비를 어떻게 구별할까요?"
      ],
      [
       "물건 사용",
       "가지고 있는 물건을 더 쓸 수 있나요?",
       "고쳐 쓰거나 함께 쓸 때 필요한 도움은 무엇일까요?"
      ],
      [
       "이동",
       "어떤 이동 방법을 이용할 수 있나요?",
       "거리·안전·이동이 불편한 사람의 필요도 살펴요."
      ]
     ]
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-smokestack.webp",
       "alt": "발전 시설의 굴뚝과 주변 모습",
       "cap": "발전 시설을 떠올리는 설명 그림 — 보이는 흰 기둥만으로 기체의 종류를 알 수 없어요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "example",
     "question": "빈 교실의 불을 끄자는 의견을 어떻게 구체적으로 만들까요?",
     "steps": [
      [
       "사례 확인",
       "비어 있는 교실에서 전등이 켜져 있는 때가 있는지 살펴요."
      ],
      [
       "조건 확인",
       "청소나 수업 준비에 필요한 전등은 아닌지 교사에게 물어요."
      ],
      [
       "의견 보완",
       "필요한 사용을 지키면서 사용하지 않는 전등만 확인하자고 제안해요."
      ]
     ],
     "answer": "관련 자료와 생활 조건을 근거로 가능한 실천을 의논해요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사람의 활동과 기후변화의 관련성을 자료로 살펴보고 토의해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 행동도 장소와 사람의 필요에 따라 실천 방법이 달라질 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 사례와 아직 더 알아볼 점을 나누어요.",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "③ 사람의 활동 · 유형 연습",
   "title": "근거를 찾아 의견을 나누어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w014",
      "c22-s42-u04-w015",
      "c22-s42-u04-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "질문 → 출처와 사례 확인 → 근거로 토의 → 생각 보완"
    },
    {
     "title": "더 알아보기",
     "text": "다른 의견을 들으면 처음 계획에서 놓친 조건을 찾을 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 생활에서 조사할 질문을 하나 적어요.",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "④ 해수면 상승 모형",
   "title": "해안 마을 모형으로 실험해요",
   "blocks": [
    {
     "type": "text",
     "text": "바닷물의 높이를 **해수면**이라고 해요. 물높이가 높아질 때 바닷가에 어떤 피해가 생길 수 있는지 모형으로 살펴봐요. 이 모형은 물이 높아지는 과학적 원인을 증명하는 실험은 아니에요."
    },
    {
     "type": "text",
     "text": "모든 집 주변은 같은 물과 연결되어 있고 방파제가 없으면 물을 막는 장벽이 없다고 정해요. 파도·밀물과 썰물·실제 지형은 나타내지 않았어요. 땅 높이와 물높이는 비교를 위해 정한 **모형 값**이에요."
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-setup.webp",
       "alt": "점토로 만든 해안 마을 모형",
       "cap": "통에 점토 땅을 만들고 집 A~E를 붙여요."
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-pour.webp",
       "alt": "통에 물을 붓는 모습",
       "cap": "물높이 1 cm(모형의 시작)에서 시작해 물을 조금씩 부어요."
      },
      {
       "src": "../assets/book/c22-s42-u04-sea-start.webp",
       "alt": "물높이 눈금을 읽는 모형",
       "cap": "물이 차분해지면 같은 자리의 눈금을 읽고 젖은 집을 세어요."
      },
      {
       "src": "../assets/book/c22-s42-u04-sea-wall.webp",
       "alt": "방파제를 세운 모형",
       "cap": "방파제를 세우고 같은 실험을 되풀이해요."
      }
     ],
     "numbered": true,
     "cols": 2,
     "credit": "3D 모형 렌더(모형 값) · 설명용 그림(실제 사진 아님)"
    },
    {
     "type": "table",
     "heads": [
      "집",
      "자리",
      "땅 높이(모형 값)"
     ],
     "rows": [
      [
       "A",
       "바다 바로 옆 · 언덕 위",
       "4.5 cm"
      ],
      [
       "B",
       "바다 가까이 · 낮은 모래땅",
       "1.5 cm"
      ],
      [
       "C",
       "강가 · 낮은 땅",
       "2.5 cm"
      ],
      [
       "D",
       "마을 안쪽 · 평지",
       "3.5 cm"
      ],
      [
       "E",
       "바다에서 멀리 · 높은 언덕",
       "6 cm"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "바꿀 조건",
     "text": "물높이 하나만 바꿔요."
    },
    {
     "title": "같게 할 조건",
     "text": "통·땅 모양·집 위치·물높이를 읽는 자리"
    },
    {
     "title": "모형 값",
     "text": "땅 높이는 비교를 위해 정한 값이에요. 실제 마을의 높이가 아니에요."
    }
   ],
   "lead": "바꿀 조건은 하나, 나머지는 모두 같게.",
   "kind": "learn",
   "teacherNote": "3D 실험실에서 학생이 직접 물높이를 바꿔 보게 한 뒤 다음 쪽을 풀어요."
  },
  {
   "section": "개념을 잇는 수업",
   "title": "한 조건만 달리해 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "같은 모형 통·땅 높이·집 위치·물길·읽는 기준에서 **벽의 효과**를 비교하려면 물높이를 같게 두고 벽 유무만 달리해요. 물높이의 효과를 비교하려면 벽 조건을 같게 두어요. 아래는 실제 마을의 기록이 아닌 정해진 모형 조건의 결과예요."
    },
    {
     "type": "table",
     "heads": [
      "비교 모형",
      "물높이",
      "벽 높이",
      "물에 닿은 집"
     ],
     "rows": [
      [
       "가",
       "2 cm",
       "없음",
       "B"
      ],
      [
       "나",
       "2 cm",
       "3.5 cm",
       "0채"
      ],
      [
       "다",
       "4 cm",
       "3.5 cm",
       "B·C·D"
      ]
     ]
    },
    {
     "type": "example",
     "question": "벽 유무의 차이를 보려면 어느 두 모형을 비교할까요?",
     "steps": [
      [
       "비교할 조건",
       "벽이 있고 없는 경우를 찾되 물높이는 같아야 해요."
      ],
      [
       "짝 고르기",
       "가는 물2 cm·벽 없음, 나는 물2 cm·벽3.5 cm이므로 가와 나를 비교해요."
      ],
      [
       "다른 짝 구별",
       "나와 다는 벽이 같고 물높이가 달라요. 가와 다는 두 조건이 함께 달라 벽만의 비교가 아니에요."
      ]
     ],
     "answer": "가와 나를 비교해요. 물에 닿은 집은 관찰할 결과이며 미리 같게 정할 조건이 아니에요."
    },
    {
     "type": "field",
     "title": "다른 비교 만들기",
     "hint": "벽은 같게 두고 물높이만 달리한 두 모형과 그 까닭을 적어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 조건 하나와 같게 둘 조건을 정하고 결과를 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "모든 집이 같은 물과 연결된 모형이에요. 실제 파도·배수·시설 상태까지 넣은 실험은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것·같게 둔 것·읽은 결과를 각각 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 해수면 상승 모형 · 결과 읽기",
   "title": "어느 집이 먼저 물에 닿았나요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "start"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w017",
      "c22-s42-u04-w018",
      "c22-s42-u04-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "결과 읽는 법",
     "text": "물높이와 집의 땅 높이를 비교해요. 땅 높이 ≤ 물높이면 물에 닿아요."
    },
    {
     "title": "핵심 정리",
     "text": "이 모형의 연결 조건에서는 땅 높이와 물높이를 비교해요."
    },
    {
     "title": "내 결과 메모",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "정답 확인: 1 cm 0채 · 2 cm 1채(B) · 3 cm 2채(B·C) · 4 cm 3채(B·C·D)"
  },
  {
   "section": "④ 해수면 상승 모형 · 방파제",
   "title": "방파제가 있으면 언제나 안전할까요?",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-sea-wall.webp",
       "alt": "방파제를 세운 모형",
       "cap": "모형의 방파제(3.5 cm)"
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-seawall.webp",
       "alt": "파도를 막는 바닷가의 콘크리트 방파제",
       "cap": "실제 바닷가의 방파제"
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "3D 모형 렌더(모형 값) · 설명용 그림(실제 사진 아님)"
    },
    {
     "type": "text",
     "text": "방파제(3.5 cm)를 세우면 물높이 1·2·3 cm에서는 안쪽 집이 하나도 젖지 않아요. 물높이가 방파제보다 높아지면 어떻게 될까요?"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w020",
      "c22-s42-u04-w021",
      "c22-s42-u04-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 모형의 3 cm에서는 안쪽 집이 젖지 않았지만 4 cm에서는 물이 넘었어요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 바닷가에서는 방파제와 함께 높은 곳에 대피 장소를 정하고, 낮은 땅의 개발을 줄이는 계획도 세워요."
    },
    {
     "title": "오개념 메모",
     "text": "「방파제만 있으면 안전하다」는 생각은 4 cm 결과로 고칠 수 있어요."
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "방파제 있음: 1·2·3 cm 0채 · 4 cm 3채(B·C·D)"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "낮은 바닷가에서 함께 지킬 생활",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-atoll.webp",
       "alt": "낮은 섬과 바다를 떠올리는 설명 그림",
       "cap": "낮은 바닷가를 떠올리는 설명용 그림 · 특정 섬의 실제 사진이나 높이 측정 자료가 아니에요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "해수면이 높아질 때 낮은 생활 공간에 어떤 어려움이 생길지 모형을 근거로 예상해 볼 수 있어요. 하지만 실제 피해를 알려면 그곳의 높이·물길·시설·현재 안내를 더 확인해야 해요. 어려움만 나열하기보다 누구의 생활에 어떤 지원이 필요한지 함께 생각해요."
    },
    {
     "type": "table",
     "heads": [
      "학습용 가상 마을의 의논",
      "함께 확인할 점"
     ],
     "rows": [
      [
       "통학로를 이용하는 학생과 교사",
       "길의 통제 안내와 안전한 이동 방법"
      ],
      [
       "생활용 물을 관리하는 어른",
       "물 이용 상태와 안전 확인·공급 방법"
      ],
      [
       "집·공공시설을 관리하는 사람",
       "지형·시설 상태와 필요한 보호·지원"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상 마을에서 「모형에서 집이 안 젖었으니 통학로와 생활용 물도 모두 안전해」라고 했어요. 어떻게 보완할까요?",
     "steps": [
      [
       "모형의 범위",
       "집이 물에 닿는 조건을 비교한 결과이며 길과 생활용 물을 검사한 것은 아니에요."
      ],
      [
       "생활의 필요",
       "학교에 오가는 일과 물을 이용하는 일에는 서로 다른 정보가 필요해요."
      ],
      [
       "협력할 일",
       "학생은 걱정과 필요한 도움을 알리고, 교사·보호자·담당 어른과 현재 정보를 확인해요."
      ]
     ],
     "answer": "모형에서 확인한 것과 실제 생활에 더 확인할 것을 나누고 필요한 지원을 함께 정해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형으로 피해 가능성을 생각하고 실제 정보와 도움으로 대응을 보완해요."
    },
    {
     "title": "더 알아보기",
     "text": "어린이가 혼자 시설을 점검하거나 위험한 곳에 들어가야 하는 활동이 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "누구의 어떤 생활을 돕고 싶은지와 더 필요한 정보를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "⑤ 생활 속 실천",
   "title": "우리에게 가능한 일을 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "**기후변화 대응**은 생활과 환경에 도움이 되는 행동을 조사하고 실제로 해 보는 일이에요. **필요한 사용**을 지키면서 낭비를 줄이고, 어려움에는 함께 도움을 찾아요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "생각해 볼 행동",
      "함께 확인할 것"
     ],
     "rows": [
      [
       "빈 교실의 전등",
       "사용하지 않는 전등 확인하기",
       "청소·수업 준비에 필요한 전등인지 교사에게 물어요."
      ],
      [
       "더운 날의 바깥 활동",
       "장소·시간과 쉬는 방법 의논하기",
       "현재 학교 안내와 도움이 필요한 친구를 살펴요."
      ],
      [
       "새 물건 구입",
       "고쳐 쓰거나 함께 쓸 방법 찾기",
       "고칠 수 있는지, 누가 도와줄 수 있는지 확인해요."
      ],
      [
       "비가 많이 올 때 이동",
       "현재 안내와 이동 길 확인하기",
       "어른과 의논하고 물이 찬 곳에 직접 들어가지 않아요."
      ]
     ]
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-lightswitch.webp",
       "alt": "사용하지 않는 전등의 스위치를 확인하는 손",
       "cap": "꼭 필요한 사용인지 먼저 확인해요."
      },
      {
       "src": "../assets/book/c22-s42-u04-photo-seawall.webp",
       "alt": "바닷가의 방파제",
       "cap": "마을의 시설은 전문가와 어른이 실제 조건을 살펴 계획해요."
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "실제 사진 아님"
    },
    {
     "type": "example",
     "question": "전기를 아끼려면 더운 날에도 필요한 냉방과 환기를 모두 멈춰야 할까요?",
     "steps": [
      [
       "사람의 필요",
       "교실의 생활 환경을 먼저 살펴요."
      ],
      [
       "낭비 확인",
       "사람이 없는 곳의 전등처럼 불필요한 사용을 찾아요."
      ],
      [
       "함께 조정",
       "필요한 냉방·환기는 교사와 의논하고 낭비를 줄여요."
      ]
     ],
     "answer": "사람의 필요를 지키면서 실행 가능한 방법을 정해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황 → 가능한 행동 → 필요한 도움 → 실제 확인"
    },
    {
     "title": "더 알아보기",
     "text": "어린이 혼자 모든 문제를 해결할 수는 없어요. 함께 의논하고 할 수 있는 일을 찾아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "누가 언제 어떤 도움을 받아 할 수 있나요?",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념을 잇는 수업",
   "title": "필요를 지키면서 낭비를 줄여요",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-lightswitch.webp",
       "alt": "교실의 전등 스위치를 누르는 모습을 떠올리는 설명 그림",
       "cap": "교실 전등 사용을 생각하는 설명용 그림 · 실제 절약 전력량을 측정한 자료가 아니에요."
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "생활에서 필요 없는 사용을 줄이되 건강·안전·배움에 필요한 사용은 지켜요. 사람마다 이동·건강·생활 여건이 다르므로 같은 행동을 모두에게 강요하기보다 가능한 방법과 필요한 도움을 함께 의논해요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "가능한 행동과 도움"
     ],
     "rows": [
      [
       "비어 있는 교실에 불이 켜져 있음",
       "교사와 필요한 사용인지 확인한 뒤 불필요한 사용을 줄여요."
      ],
      [
       "더운 교실에서 수업을 해야 함",
       "필요한 냉방·환기를 유지하며 불필요한 사용을 살펴요."
      ],
      [
       "걷기 어려운 친구가 있음",
       "걷기를 강요하지 않고 함께 참여할 다른 행동을 찾아요."
      ],
      [
       "스위치가 고장 남",
       "학생이 고치지 않고 교사에게 알려요."
      ]
     ]
    },
    {
     "type": "field",
     "title": "우리에게 가능한 제안",
     "hint": "지킬 필요·줄일 낭비·도움을 구할 사람을 한 가지씩 넣어 제안을 써요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "text",
     "text": "계획한 행동을 실제로 해 본 뒤 무엇을 했고 어려움은 무엇이었는지 돌아봐요. 한 번의 행동 횟수로 절약 전력량이나 기후의 변화를 계산하지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 사용과 사람마다 다른 여건을 지키면서 가능한 행동을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "개인의 행동과 함께 학교·마을의 시설과 지원도 의논할 수 있어요. 혼자 전부 해결해야 하는 과제가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "실제로 해 본 뒤 바뀐 점과 더 필요한 도움을 나누어 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "⑤ 생활 속 실천 · 유형 연습",
   "title": "상황에 맞는 실천을 골라요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w023",
      "c22-s42-u04-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "무엇에 도움이 되는 행동인지 구체적으로 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "계획을 세운 것과 실제로 해 본 것은 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "우리 반에서 실천하고 싶은 일과 필요한 도움",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "⑤ 생활 속 실천 · 계획",
   "title": "가능한 행동과 도움을 구체적으로 정해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w025",
      "c22-s42-u04-w026"
     ]
    },
    {
     "type": "field",
     "title": "실천 뒤 다시 생각하기",
     "hint": "실제로 해 본 뒤 행동·어려움·다음 방법을 비교해요. 아직 하지 않았다면 계획으로 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 사용과 낭비를 구별하고 도움이 되는 행동을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "어린이의 행동과 어른의 도움이 함께 필요할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "어려움이 생기면 누구에게 어떤 도움을 요청할까요?",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 1",
   "title": "표가 말해 주는 것과 말해 주지 않는 것",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "기간",
      "한 해 평균 폭염 일수(가상 학습값)"
     ],
     "rows": [
      [
       "1991~2000년",
       "8일"
      ],
      [
       "2001~2010년",
       "11일"
      ],
      [
       "2011~2020년",
       "15일"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w027",
      "c22-s42-u04-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "자료의 성격",
     "text": "이 표의 수치는 연습을 위해 지은 가상 학습값이에요. 실제 측정 기록이 아니에요."
    },
    {
     "title": "자료 읽는 순서",
     "text": "제목 → 단위 → 늘었나 줄었나 → 표에 없는 것은 말하지 않기"
    },
    {
     "title": "내 생각",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2",
   "title": "모형의 생각을 새 바닷가에 써 봐요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "장소",
      "바다와의 거리",
      "땅 높이"
     ],
     "rows": [
      [
       "가",
       "50 m",
       "2 m"
      ],
      [
       "나",
       "500 m",
       "1 m"
      ],
      [
       "다",
       "20 m",
       "8 m"
      ],
      [
       "라",
       "1 km",
       "15 m"
      ],
      [
       "마",
       "200 m",
       "4 m"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "자료의 성격",
     "text": "다섯 곳의 거리와 높이는 가상 학습값이에요."
    },
    {
     "title": "적용하기",
     "text": "모두 바닷물과 연결되고 장벽이 없다는 가상 조건에서만 높이를 비교해요."
    },
    {
     "title": "그리기 도움",
     "text": "가로축에 장소, 세로축에 높이를 두고 3 m 물높이 선을 그어요."
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2 · 그림",
   "title": "높이를 비교한 그래프로 나타내요",
   "blocks": [
    {
     "type": "text",
     "text": "가상 자료 · 다섯 곳은 모두 같은 바닷물과 연결되고 장벽은 없어요."
    },
    {
     "type": "table",
     "heads": [
      "장소",
      "가",
      "나",
      "다",
      "라",
      "마"
     ],
     "rows": [
      [
       "땅 높이(m)",
       "2",
       "1",
       "8",
       "15",
       "4"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "29번의 가상 자료를 높이 순서로 나타내요."
    },
    {
     "title": "더 알아보기",
     "text": "높이 순서의 그래프는 실제 지형의 단면이나 지도와 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 자료의 조건에서 말할 수 있는 것과 없는 것",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "빈칸으로 정리",
   "title": "단원의 핵심을 한눈에",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w031",
      "c22-s42-u04-w032",
      "c22-s42-u04-w033",
      "c22-s42-u04-w034"
     ]
    },
    {
     "type": "field",
     "title": "한 문장으로 정리",
     "hint": "사례·생활 영향·가능한 실천을 근거와 함께 한 문장으로 이어 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "다시 읽을 쪽",
     "text": "빈칸이 막히면 그 개념 쪽(①~⑤)으로 돌아가요."
    },
    {
     "title": "스스로 점검",
     "text": "사례와 자료 / 모형의 결과와 한계 / 생활 영향 / 가능한 실천을 설명할 수 있나요?"
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "단원평가 1",
   "title": "개념과 자료로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w035",
      "c22-s42-u04-w036",
      "c22-s42-u04-w037",
      "c22-s42-u04-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "스스로 점검",
     "text": "물음이 「알맞은 것」인지 「알맞지 않은 것」인지 먼저 표시해요."
    },
    {
     "title": "검토 메모",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "단원평가 2",
   "title": "모형과 생활을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w039",
      "c22-s42-u04-w040",
      "c22-s42-u04-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "스스로 점검",
     "text": "모두 고르기는 맞는 보기를 모두 골랐는지 다시 확인해요."
    },
    {
     "title": "검토 메모",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 확인한 근거와 더 알아볼 점",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "단원평가 3",
   "title": "읽고 설명해요",
   "blocks": [
    {
     "type": "heading",
     "text": "읽기 자료 · 낮은 섬나라"
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s42-u04-photo-atoll.webp",
       "alt": "바다 높이와 거의 같은 낮고 평평한 산호섬",
       "cap": "낮은 섬을 떠올리는 설명 그림(특정 장소의 실제 사진 아님)"
      }
     ],
     "numbered": false,
     "cols": 1,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "유엔개발계획(UNDP)은 태평양의 섬나라 투발루에서 해수면 상승이 지하수와 농작물 재배 등에 어려움을 줄 수 있다고 설명해요. 투발루에서는 실제 땅 높이와 해안 정보를 조사하고 생활 공간을 보호할 방법을 계획해 왔어요. 피해만 생각하며 포기하기보다 사람들이 어떤 자료와 도움으로 대응하는지도 살펴봐요."
    },
    {
     "type": "text",
     "text": "자료: UNDP 「Notes from Tuvalu: Leading the way in adapting to sea-level rise」. 위 그림은 특정 섬을 촬영한 사진이 아닌 낮은 섬을 떠올리는 설명 그림이에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w042",
      "c22-s42-u04-w043",
      "c22-s42-u04-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "읽기 메모",
     "text": "글에서 「땅이 낮다」를 알려 주는 낱말에 밑줄을 그어요."
    },
    {
     "title": "서술형 쓰는 법",
     "text": "주장 → 모형 근거(집 A·D) → 결론 순서로 써요."
    },
    {
     "title": "검토 메모",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "서술형 · 창의",
   "title": "상황에 도움이 되는 안내문을 그려요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "가능한 행동 두 가지와 까닭·필요한 도움을 나타내요."
    },
    {
     "title": "더 알아보기",
     "text": "그림 솜씨보다 행동을 이해하고 따라 할 수 있는지가 중요해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 계획인 일과 실제로 한 일을 구분해요.",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "서술형 · 마무리",
   "title": "모형의 근거와 생활의 실천을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w046"
     ]
    },
    {
     "type": "field",
     "title": "처음 생각과 비교",
     "hint": "2번에 쓴 처음 생각에서 바뀌거나 더 확인하고 싶은 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 주어진 조건에서만 결과를 말해 줘요."
    },
    {
     "title": "더 알아보기",
     "text": "현재 안내와 어른의 도움으로 함께 계획을 보완해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다음에 실제로 해 볼 일과 확인 방법",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "자료를 읽는 법",
   "title": "출처·모형·가상 기록을 구별해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "table",
     "heads": [
      "자료",
      "알 수 있는 범위"
     ],
     "rows": [
      [
       "기상청 기온 자료",
       "정해진 지역·기간의 평균 비교"
      ],
      [
       "해안 마을 모형",
       "정한 연결·땅 높이·물높이 조건의 결과"
      ],
      [
       "가상 표와 그림 설계",
       "읽기와 설명 연습, 실제 학생 측정 기록은 아님"
      ]
     ]
    },
    {
     "type": "text",
     "text": "현행 교육과정의 사례·생활 영향·대응 실천을 중심으로 공부해요. 자료를 읽거나 계획을 만든 것과 실제로 해 본 것을 나누어 남겨요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관·자료 제목·발표 시점과 비교 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주지 않는 사실은 별도로 확인해야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "더 확인할 자료나 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "생각을 잇는 개념",
   "title": "기간과 지역이 같은가요?",
   "blocks": [
    {
     "type": "text",
     "text": "평년은 비교 기준이고 각 한 해 평균은 그해의 자료예요. 한 해가 앞선 해보다 낮아져도 오랜 기간의 변화가 끝났다고 바로 정할 수는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "먼저 읽을 것",
      "확인할 까닭"
     ],
     "rows": [
      [
       "기관·지역",
       "전국 평균과 학교 값을 섞지 않아요."
      ],
      [
       "기간·단위",
       "한 해·30년·하루와℃를 구별해요."
      ],
      [
       "비교와 한계",
       "두 값의 차이와 장기 변화 판단을 나눠요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상 도시 자료: 평년 12.0 ℃, 최근 10년 연평균 13.1 ℃예요. 어떻게 설명할까요?",
     "steps": [
      [
       "비교 조건",
       "같은 도시의 연평균 기온인지 확인해요."
      ],
      [
       "차이",
       "13.1−12.0=1.1(℃)"
      ],
      [
       "뜻",
       "그 기간의 평균이 1.1 ℃ 높았다는 뜻이며 모든 날이 같다는 뜻은 아니에요."
      ]
     ],
     "answer": "지역·기간·평균과 비교 범위를 함께 말해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "숫자만 빼기 전에 무엇의 평균인지 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각을 잇는 개념",
   "title": "모형의 결과를 실제에 쓸 때",
   "blocks": [
    {
     "type": "text",
     "text": "모형은 정한 조건에서 비교를 돕지만 실제의 모든 조건을 담지는 못해요. 모형에서 안 젖은 집을 찾은 것과 실제 지역이 안전하다고 확인한 것은 달라요."
    },
    {
     "type": "table",
     "heads": [
      "모형에서 비교한 것",
      "실제에 더 필요한 정보"
     ],
     "rows": [
      [
       "물높이·땅 높이·벽 유무",
       "지형·물길·파도·시설 상태·현재 안내"
      ],
      [
       "같게 둔 통·집 위치",
       "실제 장소마다 달라지는 환경"
      ],
      [
       "제시된 모형 값",
       "현장에서 확인한 실제 자료"
      ]
     ]
    },
    {
     "type": "field",
     "title": "설명을 보완하기",
     "hint": "모형에서 확인한 조건 하나와 실제에 더 확인할 조건 하나를 이어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 근거가 되지만 실제 안전을 전부 결정하지는 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각을 잇는 개념",
   "title": "계획·기회·실천을 나누어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상태",
      "뜻",
      "읽을 때 주의"
     ],
     "rows": [
      [
       "계획",
       "하기로 정한 것",
       "이미 행동한 횟수로 세지 않아요."
      ],
      [
       "기회",
       "정한 행동을 할 수 있었던 때",
       "기회가 없는 날도 있어요."
      ],
      [
       "확인한 실천",
       "실제로 했다고 확인한 행동",
       "확인 기준과 기록 범위를 밝혀요."
      ],
      [
       "미기록",
       "실제 결과를 적지 않은 것",
       "0이나 계획의 수로 채우지 않아요."
      ]
     ]
    },
    {
     "type": "text",
     "text": "실천이 어려웠다면 누구를 탓하기보다 필요한 도움과 다음 방법을 의논해요. 행동 횟수만으로 전력량 감소나 기후의 변화 원인까지 확정하지 않아요."
    },
    {
     "type": "field",
     "title": "우리 말로 구별하기",
     "hint": "계획과 실제 행동이 다른 예를 하나 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "정직한 빈 기록도 다음 계획을 고치는 데 도움이 돼요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ①",
   "title": "전국 한 해 평균을 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "기관 자료를 읽는 활동이에요. 평년은 30년 평균이며 날짜별 기온이나 학교에서 직접 잰 값은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "자료",
      "전국 연평균 기온(℃)"
     ],
     "rows": [
      [
       "평년(1991~2020)",
       "12.5"
      ],
      [
       "2024년",
       "14.5"
      ],
      [
       "2025년",
       "13.7"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w047",
      "c22-s42-u04-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전국·한 해 평균·평년의 기간을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "annual-temperature-v1",
    "text": "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ①",
   "title": "값의 차이와 자료의 범위",
   "blocks": [
    {
     "type": "text",
     "text": "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w049",
      "c22-s42-u04-w050",
      "c22-s42-u04-w051",
      "c22-s42-u04-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "어느 두 값을 비교했는지 먼저 밝혀요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "annual-temperature-v1",
    "text": "기상청 자료: 전국 연평균 기온은 평년(1991~2020년) 12.5 ℃, 2024년 14.5 ℃, 2025년 13.7 ℃예요. 평년은 30년 평균이고 뒤의 두 값은 각각 한 해 평균이에요. 날짜별 기온이나 우리 학교의 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ① · 설명",
   "title": "한 해가 낮아졌다면?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w053"
     ]
    },
    {
     "type": "field",
     "title": "의견을 듣고 보완하기",
     "hint": "친구에게 자료로 아는 것과 더 볼 것을 설명해요. 아직 듣지 않은 의견을 실제 의견처럼 쓰지 않아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "짧은 비교와 오랜 기간의 판단은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ① · 그림",
   "title": "세 값과 기간을 함께 보여 줘요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 눈금과 0 기준·단위·자료의 기간을 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ②",
   "title": "벽의 효과만 비교한 것은?",
   "blocks": [
    {
     "type": "text",
     "text": "모든 집은 같은 물과 연결되어 있고 땅·집 위치·읽는 기준은 각 모형에서 같아요. 학습용 모형 자료이며 라는 관찰할 계획만 있고 실제 결과는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "모형",
      "물높이",
      "벽",
      "물에 닿은 집"
     ],
     "rows": [
      [
       "가",
       "3 cm",
       "없음",
       "B·C"
      ],
      [
       "나",
       "3 cm",
       "3.5 cm",
       "0채"
      ],
      [
       "다",
       "4 cm",
       "3.5 cm",
       "B·C·D"
      ],
      [
       "라",
       "3 cm",
       "3.5 cm",
       "미기록"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w055",
      "c22-s42-u04-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물높이·벽 유무·관찰 여부를 따로 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sea-comparison-v1",
    "text": "연습용 해안 모형 자료예요. 땅 높이는A4.5·B1.5·C2.5·D3.5·E6 cm이고 모든 집이 같은 물과 연결되어 있어요. 가: 물 3 cm·벽 없음→B, C. 나: 물 3 cm·벽 3.5 cm→물에 닿은 집 0채. 다: 물 4 cm·벽 3.5 cm→B, C, D. 라: 물 3 cm·벽 3.5 cm로 관찰할 계획이나 결과는 미기록이에요. 나머지 조건은 같고 실제 마을의 기록이 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ②",
   "title": "조건·결과·미관찰을 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 해안 모형 자료예요. 땅 높이는A4.5·B1.5·C2.5·D3.5·E6 cm이고 모든 집이 같은 물과 연결되어 있어요. 가: 물 3 cm·벽 없음→B, C. 나: 물 3 cm·벽 3.5 cm→물에 닿은 집 0채. 다: 물 4 cm·벽 3.5 cm→B, C, D. 라: 물 3 cm·벽 3.5 cm로 관찰할 계획이나 결과는 미기록이에요. 나머지 조건은 같고 실제 마을의 기록이 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w057",
      "c22-s42-u04-w058",
      "c22-s42-u04-w059",
      "c22-s42-u04-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상할 수 있어도 실제 기록이 생기는 것은 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sea-comparison-v1",
    "text": "연습용 해안 모형 자료예요. 땅 높이는A4.5·B1.5·C2.5·D3.5·E6 cm이고 모든 집이 같은 물과 연결되어 있어요. 가: 물 3 cm·벽 없음→B, C. 나: 물 3 cm·벽 3.5 cm→물에 닿은 집 0채. 다: 물 4 cm·벽 3.5 cm→B, C, D. 라: 물 3 cm·벽 3.5 cm로 관찰할 계획이나 결과는 미기록이에요. 나머지 조건은 같고 실제 마을의 기록이 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ② · 설명",
   "title": "조건이 달라지면 결과도 달라요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w061"
     ]
    },
    {
     "type": "field",
     "title": "모형 비교를 해 본다면",
     "hint": "교사와 처음 상태·읽는 자리·기준을 정해요. 실제로 해 본 결과와 제공 자료를 구별해 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 지역의 안전은 모형 값만으로 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ② · 그림",
   "title": "같게 둔 것과 바꾼 것을 보여 줘요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "두 물높이를 같게 그리고 벽 차이와 결과를 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ③",
   "title": "이번 주에 할 수 있는 일",
   "blocks": [
    {
     "type": "text",
     "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w063",
      "c22-s42-u04-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 사용·보류된 구입·도움 조건을 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "school-constraints-v1",
    "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "실천에 필요한 도움과 순서",
   "blocks": [
    {
     "type": "text",
     "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w065",
      "c22-s42-u04-w066",
      "c22-s42-u04-w067",
      "c22-s42-u04-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "혼자 하기 어려운 일을 실제로 할 수 있는 도움과 이어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "school-constraints-v1",
    "text": "가상 학교의 이번 주 조건: 새 설비 구입은 보류해요. 수업 준비에 필요한 전등·냉방·환기는 유지해요. 교사와 빈 교실 전등의 사용 여부를 확인할 수 있어요. 고장 난 스위치는 학생이 고치지 않고 교사에게 알려요. 이동에 도움이 필요한 친구가 있어 모두에게 한 가지 이동 방법을 강요하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③ · 설명",
   "title": "서로 다른 필요를 고려해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w069"
     ]
    },
    {
     "type": "field",
     "title": "의논할 질문",
     "hint": "각자 할 수 있는 행동과 공통으로 필요한 도움을 하나씩 물어요. 실제 대화를 하지 않았다면 예상 질문으로 남겨요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 행동을 강요하기보다 가능한 방법을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ③ · 그림",
   "title": "행동·도움·확인 기준을 담아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "안내를 만든 것과 실제 행동한 것을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "기회가 없는 날과 미기록",
   "blocks": [
    {
     "type": "text",
     "text": "가상의 반에서 사용하지 않는 전등을 확인할 계획과 실제 기회·확인 횟수를 비교해요. 전력량을 잰 기록은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "요일",
      "계획",
      "기회",
      "확인"
     ],
     "rows": [
      [
       "월",
       "3회",
       "3회",
       "3회"
      ],
      [
       "화",
       "3회",
       "2회",
       "1회"
      ],
      [
       "수",
       "3회",
       "3회",
       "미기록"
      ],
      [
       "목",
       "3회",
       "0회",
       "0회"
      ],
      [
       "금",
       "3회",
       "2회",
       "2회"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w071",
      "c22-s42-u04-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "필요한 전등을 끄지 않고 확인할 수 있었던 때를 기회로 세었어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "action-records-v1",
    "text": "가상의 반에서 사용하지 않는 전등 확인을 계획했어요. 월: 계획 3회·기회 3회·확인 3회. 화: 계획 3회·기회 2회·확인 1회. 수: 계획 3회·기회 3회·실제 확인은 미기록. 목: 계획 3회·기회 0회·확인 0회. 금: 계획 3회·기회 2회·확인 2회. 기회는 필요한 전등을 끄지 않고 빈 교실을 확인할 수 있었던 때예요. 목요일에는 그 기회가 없었어요. 실제 학교의 실천 기록이나 전력량 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ④",
   "title": "확인된 만큼만 합하고 설명해요",
   "blocks": [
    {
     "type": "text",
     "text": "가상의 반에서 사용하지 않는 전등 확인을 계획했어요. 월: 계획 3회·기회 3회·확인 3회. 화: 계획 3회·기회 2회·확인 1회. 수: 계획 3회·기회 3회·실제 확인은 미기록. 목: 계획 3회·기회 0회·확인 0회. 금: 계획 3회·기회 2회·확인 2회. 기회는 필요한 전등을 끄지 않고 빈 교실을 확인할 수 있었던 때예요. 목요일에는 그 기회가 없었어요. 실제 학교의 실천 기록이나 전력량 측정값은 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w073",
      "c22-s42-u04-w074",
      "c22-s42-u04-w075",
      "c22-s42-u04-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "미기록을 0으로 바꾸거나 계획 수를 실제 수로 세지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "action-records-v1",
    "text": "가상의 반에서 사용하지 않는 전등 확인을 계획했어요. 월: 계획 3회·기회 3회·확인 3회. 화: 계획 3회·기회 2회·확인 1회. 수: 계획 3회·기회 3회·실제 확인은 미기록. 목: 계획 3회·기회 0회·확인 0회. 금: 계획 3회·기회 2회·확인 2회. 기회는 필요한 전등을 끄지 않고 빈 교실을 확인할 수 있었던 때예요. 목요일에는 그 기회가 없었어요. 실제 학교의 실천 기록이나 전력량 측정값은 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ④ · 설명",
   "title": "행동과 결과의 원인을 구별해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w077"
     ]
    },
    {
     "type": "field",
     "title": "추가로 확인할 자료",
     "hint": "어떤 자료와 조건을 더 보면 판단을 보완할지 적어요. 실제 전력량 자료가 있다고 꾸미지 않아요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "확인 횟수와 전력량은 서로 다른 자료예요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④ · 그림",
   "title": "0·미기록·기회 없음을 나타내요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "정해진 숫자와 모르는 상태를 구별해 표현해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "종합 사고력 · 설명",
   "title": "근거의 범위를 지키며 의견을 고쳐요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료·모형·실천의 서로 다른 근거를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "종합 사고력 · 그림",
   "title": "세 구역 설명판으로 연결해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "출처·조건·도움을 함께 보여 주고 실행 여부를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료의 조건과 실제로 해 본 범위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인한 근거와 남은 질문",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  }
 ]
};

export const studentGuidePriorWorkbook=withStudentOpeningLanguage(withClimateRails(withClimateVisuals(baseWorkbook)));
export const climateUpperPriorWorkbook=withStudentGuideLanguage(studentGuidePriorWorkbook);
export const climateReadablePriorWorkbook=withClimateUpperScience(climateUpperPriorWorkbook);
export const workbook=withClimateReadableWorkbook(climateReadablePriorWorkbook);
