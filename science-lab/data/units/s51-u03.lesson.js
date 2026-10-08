import { skyReading } from '../reading/s51-u03.reading.js';
export const lesson = {
  "unitId": "s51-u03",
  "grade": 5,
  "title": "태양계와 별",
  "hero": "떠오르는 태양 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "태양과 행성은 처음에 어떻게 생겨났을까요?" }],
    "scene": "rising-sun",
    "question": "에탄올 바닥에 가라앉은 붉은 식용유 덩어리에 스포이트로 물을 조금씩 떨어뜨리면 덩어리는 어떻게 될까요?",
    "predictions": [
      { "id": "0", "text": "위로 떠올라 둥근 공 모양이 된다" },
      { "id": "1", "text": "더 납작하게 바닥에 붙는다" },
      { "id": "2", "text": "물에 녹아 사라진다" }
    ],
    "answer": "0",
    "wrongNote": "물을 넣은 양에 따라 덩어리가 뜬 높이를 비교하며, 둘레 액체의 무게가 어떻게 달라졌는지 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "에탄올과 식용유의 양은 그대로, 넣는 물의 양만 바꿔요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "sun",
      "goal": "넣을 물 고르기 → 떨어뜨리기 → 눈금 읽기 → 표에 적기 순으로 해 보세요. 마지막에 흔들기도 해 봐요.",
      "columns": ["넣은 물", "눈금", "덩어리 모양"]
    },
    "home": {
      "title": "부엌 속 떠오르는 방울",
      "minutes": 15,
      "guardian": true,
      "materials": [
        { "name": "투명한 컵", "qty": "1개", "have": "home" },
        { "name": "물과 소금", "qty": "물 반 컵, 소금 2숟가락", "have": "home" },
        { "name": "식용유", "qty": "1숟가락", "have": "home" }
      ],
      "steps": [
        "컵에 물을 반쯤 붓고 식용유를 한 숟가락 넣어 물 위에 뜨는 것을 확인해요. 이번엔 반대로, 식용유를 바닥에 가라앉히려면 무엇이 필요할지 이야기해요.",
        "다른 컵에 진한 소금물을 만들고 그 위에 맹물을 살살 부어 두 층을 만든 뒤, 작은 방울 토마토나 포도알을 넣어 어느 층에 멈추는지 관찰해요."
      ],
      "safety": ["에탄올은 집에서 쓰지 않아요. 물·소금·식용유만 써요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s51-u03/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "태양은 스스로 빛나는 별, 그 둘레를 행성 여덟 개가 돌아요." }],
    "analogy": "운동장 한가운데 커다란 모닥불(태양)이 있고, 친구들(행성)이 저마다 다른 거리에서 같은 방향으로 빙글빙글 돌고 있다고 생각해 봐요. 가까운 친구는 짧게, 먼 친구는 아주 큰 원을 그리며 돌아요.",
    "principle": "태양계는 태양과 행성 8개, 위성 등으로 이루어져 있어요. 행성은 크기와 태양까지의 거리가 제각각이고, 스스로 빛을 내는 별과 달리 햇빛을 반사해 빛나요. 북쪽 하늘의 별자리는 북극성을 중심으로 시계 반대 방향으로 돌아 보여요.",
    "cards": ["s51-u03-b01", "s51-u03-b02", "s51-u03-b03", "s51-u03-b04"],
    "table": "s51-u03-b05",
    "miniTest": ["s51-u03-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "왜 계절마다 보이는 별자리가 다를까요?" }],
    "items": ["s51-u03-b07", "s51-u03-b08", "s51-u03-b09"],
    "reading": {
      "magazine": skyReading,
      "title": "왜 계절마다 보이는 별자리가 다를까?",
      "text": "겨울밤의 오리온자리는 여름밤에는 보이지 않아요. 별자리가 사라진 걸까요?"
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "행성의 크기와 거리, 북극성 찾는 법을 설명할 수 있나요?" }],
    "items": ["s51-u03-b10", "s51-u03-b11", "s51-u03-b12"],
    "pass": 2
  },
  "report": {
    "title": "떠오르는 태양 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "넣은 물의 양에 따라 식용유 덩어리가 뜨는 높이는 어떻게 달라질까?" },
      { "key": "hypothesis", "label": "② 가설", "hint": "물을 넣을수록 덩어리는 어떻게 될까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "넣은 물의 양만 바꾸고, 에탄올·식용유의 양과 병은 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "물의 양마다 덩어리가 뜬 눈금과 모양을 써요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "물의 양과 덩어리 높이의 관계, 흔들기와 성운설을 나누어 써요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "결과를 표에 남겼나요?", "관찰 사실과 생각을 나누었나요?", "모형과 실제 태양계를 구별했나요?"]
  }
};
lesson.explore.lab.rowText = r => `물 ${r.ml} mL · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 넣은 물의 양에 따라 덩어리의 높이가 어떻게 달라졌나요?` : "";
