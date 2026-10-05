import { cycleReading } from '../reading/s42-u05.reading.js';
export const lesson = {
  "unitId": "s42-u05",
  "grade": 4,
  "title": "물의 여행",
  "hero": "수조 속 작은 지구 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "오늘 내리는 비는 어디에서 왔을까요?" }],
    "scene": "water-cycle",
    "question": "뚜껑 덮은 수조 속 바다를 전등으로 데우면 어떻게 될까요?",
    "predictions": [
      { "id": "0", "text": "뚜껑 아래에 물방울이 맺혀 떨어진다" },
      { "id": "1", "text": "아무 일도 일어나지 않는다" },
      { "id": "2", "text": "바닷물이 수조 밖으로 넘친다" }
    ],
    "answer": "0",
    "wrongNote": "실험 결과와 비교하며 데워진 물이 어디로 갔는지 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "한 번에 한 조건만 바꾸고, 바닷물의 양과 관찰 시간은 그대로 둬요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "cycle",
      "goal": "전등 세기와 뚜껑 위 얼음을 고르고 전등 켜기 → 관찰 → 표에 적기 순으로 해 보세요.",
      "columns": ["전등", "뚜껑 위", "관찰한 모습"]
    },
    "home": {
      "title": "컵 속에 내리는 비",
      "minutes": 15,
      "guardian": true,
      "materials": [
        { "name": "투명한 컵", "qty": "1개", "have": "home" },
        { "name": "따뜻한 물(수돗물 온수)", "qty": "컵의 1/3", "have": "home" },
        { "name": "얼음을 올린 접시", "qty": "1개", "have": "home" }
      ],
      "steps": [
        "보호자가 투명한 컵에 따뜻한 물을 1/3쯤 부어요.",
        "얼음을 올린 접시로 컵을 덮고, 5분 동안 컵 안과 접시 아래를 관찰해 그림으로 남겨요."
      ],
      "safety": ["뜨거운 물은 보호자가 다뤄요. 끓는 물은 쓰지 않아요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s42-u05/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "물은 증발하고 응결하며 돌고 돌아요." }],
    "analogy": "추운 날 버스 창문에 김이 서리는 것처럼, 하늘 높은 곳의 찬 공기를 만난 수증기도 물방울이 돼요.",
    "principle": "물은 햇빛을 받아 증발하고, 찬 곳에서 응결해 구름·비가 되며, 다시 바다로 돌아와요(물의 순환).",
    "cards": ["s42-u05-b01", "s42-u05-b02", "s42-u05-b03", "s42-u05-b04"],
    "table": "s42-u05-b05",
    "miniTest": ["s42-u05-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "물이 부족한 곳에서는 어떻게 물을 얻을까요?" }],
    "items": ["s42-u05-b07", "s42-u05-b08", "s42-u05-b09"],
    "reading": {
      "magazine": cycleReading,
      "title": "바다가 이렇게 넓은데 왜 물이 모자랄까?",
      "text": "지구는 물의 행성이지만, 우리가 바로 마실 수 있는 물은 생각보다 아주 적어요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "바다의 물이 비가 되어 돌아오는 과정을 설명할 수 있나요?" }],
    "items": ["s42-u05-b10", "s42-u05-b11", "s42-u05-b12"],
    "pass": 2
  },
  "report": {
    "title": "물의 순환 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "뚜껑 덮은 수조 속 바다를 데우고 뚜껑을 차갑게 하여, 물이 비가 되어 돌아오는 과정을 관찰해 보자." },
      { "key": "hypothesis", "label": "② 가설", "hint": "전등을 세게 켜면 뚜껑 아래 물방울과 비는 어떻게 될까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "전등 세기만 바꾸고, 바닷물의 양·얼음·관찰 시간은 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "모형에서 본 것과 실제 지구를 나누어요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "증발과 응결로 물의 여행을 설명해요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "결과를 표에 남겼나요?", "관찰 사실과 생각을 나누었나요?", "수조 모형과 실제 지구의 차이를 말했나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.sun} · ${r.lid} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 전등과 얼음에 따라 비가 어떻게 달라졌나요?` : "";
