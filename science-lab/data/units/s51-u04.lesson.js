import { seaReading } from '../reading/s51-u04.reading.js';
export const lesson = {
  "unitId": "s51-u04",
  "grade": 5,
  "title": "용해와 용액",
  "hero": "병 속 눈 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "녹아서 보이지 않는 물질은 어디로 갔을까요?" }],
    "scene": "snow-jar",
    "question": "뜨거운 물에 염화암모늄을 가득 녹인 맑은 용액을 병에 담아 식히면 병 속은 어떻게 될까요?",
    "predictions": [
      { "id": "0", "text": "흰 결정이 눈처럼 생겨 내려앉는다" },
      { "id": "1", "text": "그대로 맑고 투명하다" },
      { "id": "2", "text": "용액이 모두 단단하게 얼어붙는다" }
    ],
    "answer": "0",
    "wrongNote": "식히는 온도에 따라 생긴 결정의 양을 비교하며, 온도에 따라 녹을 수 있는 양이 어떻게 달라지는지 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "물과 녹인 양은 그대로, 식히는 온도만 바꿔요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "snow",
      "goal": "식히는 방법 고르기 → 식히기 → 결정의 양 보기 → 표에 적기 순으로 해 보세요. 마지막에 다시 데우기도 해 봐요.",
      "columns": ["식히는 방법", "결정(눈)의 양", "병 속 모습"]
    },
    "home": {
      "title": "설탕물 무지개 탑",
      "minutes": 20,
      "guardian": true,
      "materials": [
        { "name": "투명한 컵", "qty": "4개", "have": "home" },
        { "name": "설탕", "qty": "1·2·3·4숟가락", "have": "home" },
        { "name": "식용 색소(또는 주스 몇 방울)", "qty": "4가지 색", "have": "home" },
        { "name": "스포이트(또는 숟가락)", "qty": "1개", "have": "home" }
      ],
      "steps": [
        "같은 양의 따뜻한 물이 담긴 컵 4개에 설탕을 1·2·3·4숟가락씩 녹이고 컵마다 다른 색을 떨어뜨려요.",
        "가장 진한 설탕물부터 투명한 컵에 차례로 아주 천천히 부어 층을 쌓고, 왜 섞이지 않고 층이 생기는지 진하기로 설명해요."
      ],
      "safety": ["따뜻한 물은 보호자가 부어요. 염화암모늄은 집에서 쓰지 않아요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s51-u04/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "물의 온도가 높을수록 더 많이 녹아요." }],
    "analogy": "버스에 앉을 자리가 정해져 있듯 물 한 컵에 녹을 수 있는 자리도 정해져 있어요. 뜨거운 물은 자리가 넉넉하고, 식으면 자리가 줄어 앉지 못한 승객(용질)이 내려요 — 그게 결정이에요.",
    "principle": "물질이 다른 물질에 녹아 골고루 섞이는 것이 용해예요. 녹는 양은 물질마다 다르고, 물의 온도가 높을수록 많이 녹아요. 가득 녹인 용액을 식히면 녹지 못한 만큼 결정으로 나와요.",
    "cards": ["s51-u04-b01", "s51-u04-b02", "s51-u04-b03", "s51-u04-b04"],
    "table": "s51-u04-b05",
    "miniTest": ["s51-u04-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "사해에서는 왜 몸이 둥둥 뜰까요?" }],
    "items": ["s51-u04-b07", "s51-u04-b08", "s51-u04-b09"],
    "reading": {
      "magazine": seaReading,
      "title": "사해에서는 왜 몸이 둥둥 뜰까?",
      "text": "수영을 못해도 누워서 신문을 읽을 수 있는 바다가 있어요. 비밀은 물에 녹아 있는 소금의 양이에요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "온도와 녹는 양, 진하기를 설명할 수 있나요?" }],
    "items": ["s51-u04-b10", "s51-u04-b11", "s51-u04-b12"],
    "pass": 2
  },
  "report": {
    "title": "병 속에 내리는 눈 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "식히는 온도에 따라 병 속에 생기는 결정의 양이 달라질까?" },
      { "key": "hypothesis", "label": "② 가설", "hint": "더 차갑게 식히면 결정은 어떻게 될까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "식히는 온도만 바꾸고, 물과 녹인 양·병은 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "식히는 방법마다 생긴 결정의 양을 써요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "온도와 녹을 수 있는 양의 관계를 써요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "결과를 표에 남겼나요?", "관찰 사실과 생각을 나누었나요?", "결정이 얼음이 아니라는 것을 설명했나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.cool} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 식히는 온도에 따라 결정의 양이 어떻게 달라졌나요?` : "";
