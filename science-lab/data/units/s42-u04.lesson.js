import { quakeReading } from '../reading/s42-u04.reading.js';
export const lesson = {
  "unitId": "s42-u04",
  "grade": 4,
  "title": "화산과 지진",
  "hero": "지층 모형 지진 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "단단한 땅은 왜 흔들릴까요?" }],
    "scene": "quake-layers",
    "question": "겹친 우드락을 양쪽에서 계속 세게 밀면 어떻게 될까요?",
    "predictions": [
      { "id": "0", "text": "휘어지다가 끊어진다" },
      { "id": "1", "text": "그대로 평평하다" },
      { "id": "2", "text": "점점 두꺼워진다" }
    ],
    "answer": "0",
    "wrongNote": "실험 결과와 비교하며 지층에 힘이 쌓이는 모습을 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "미는 힘만 바꾸고 우드락의 수와 크기는 그대로 둬요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "quake",
      "goal": "미는 힘과 집을 고르고 밀기 → 관찰 → 표에 적기 순으로 해 보세요.",
      "columns": ["미는 힘", "집", "관찰한 모습"]
    },
    "home": {
      "title": "우리 집 지진 대비 점검",
      "minutes": 10,
      "guardian": true,
      "materials": [
        { "name": "점검표(기록지)", "qty": "1장", "have": "home" },
        { "name": "필기도구", "qty": "1개", "have": "home" }
      ],
      "steps": [
        "보호자와 함께 높은 곳의 무거운 물건, 고정되지 않은 가구를 찾아 표시해요.",
        "흔들릴 때 숨을 곳(튼튼한 탁자)과 대피 장소(가까운 운동장·공원)를 정해 기록해요."
      ],
      "safety": ["무거운 물건을 옮기는 일은 보호자가 해요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s42-u04/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "지층이 큰 힘을 받아 끊어질 때 땅이 흔들려요." }],
    "analogy": "나무젓가락을 양손으로 구부리면 휘다가 '딱' 부러지며 손이 떨려요. 땅속 지층도 그래요.",
    "principle": "지층은 힘을 받아 휘어지고(습곡) 끊어지며(단층), 끊어질 때 지진이 일어나요.",
    "cards": ["s42-u04-b01", "s42-u04-b02", "s42-u04-b03", "s42-u04-b04"],
    "table": "s42-u04-b05",
    "miniTest": ["s42-u04-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "지진이 나면 어떻게 몸을 지킬까요?" }],
    "items": ["s42-u04-b07", "s42-u04-b08", "s42-u04-b09"],
    "reading": {
      "magazine": quakeReading,
      "title": "땅이 흔들리면 어디로 가야 할까?",
      "text": "지진은 막을 수 없지만, 미리 알고 대비하면 피해를 크게 줄일 수 있어요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "지진이 일어나는 까닭을 설명할 수 있나요?" }],
    "items": ["s42-u04-b10", "s42-u04-b11", "s42-u04-b12"],
    "pass": 2
  },
  "report": {
    "title": "지진 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "지층 모형을 미는 힘만 바꾸어 지층의 변화를 관찰하고, 지진이 일어나는 까닭을 설명해 보자." },
      { "key": "hypothesis", "label": "② 가설", "hint": "세게 밀수록 우드락은 어떻게 될까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "미는 힘만 바꾸고, 우드락의 수·크기·순서는 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "모형의 변화와 실제 지층을 나누어요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "지진이 일어나는 까닭을 지층의 끊어짐과 이어 설명해요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "결과를 표에 남겼나요?", "관찰 사실과 생각을 나누었나요?", "모형과 실제 지층의 차이를 말했나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.force} · ${r.house} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 미는 힘에 따라 지층이 어떻게 달라졌나요?` : "";
