import { heatReading } from '../reading/s51-u02.reading.js';
export const lesson = {
  "unitId": "s51-u02",
  "grade": 5,
  "title": "온도와 열",
  "hero": "시온 스티커 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "손난로의 열은 어디로 갔을까요?" }],
    "scene": "heat-strips",
    "question": "구리·알루미늄·OHP 필름 띠를 뜨거운 물에 함께 담그면 어느 띠의 스티커 색이 가장 빨리 위로 올라갈까요?",
    "predictions": [
      { "id": "0", "text": "구리" },
      { "id": "1", "text": "OHP 필름" },
      { "id": "2", "text": "셋 다 똑같다" }
    ],
    "answer": "0",
    "wrongNote": "띠마다 색이 변한 칸을 비교하며 물질에 따라 열이 전달되는 빠르기를 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "물의 온도와 담그는 시간은 그대로, 띠의 재료만 바꿔요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "heat",
      "goal": "띠와 물을 고르고 담그기 → 색이 변한 칸 세기 → 표에 적기 순으로 해 보세요.",
      "columns": ["띠", "물", "2분 뒤 모습"]
    },
    "home": {
      "title": "버터 숟가락 경주",
      "minutes": 15,
      "guardian": true,
      "materials": [
        { "name": "금속 숟가락과 플라스틱 숟가락", "qty": "1개씩", "have": "home" },
        { "name": "따뜻한 수돗물을 담은 컵", "qty": "1개", "have": "home" },
        { "name": "버터 조각(콩알만큼)", "qty": "2개", "have": "home" }
      ],
      "steps": [
        "두 숟가락의 손잡이 끝에 같은 크기의 버터 조각을 올리고, 숟가락을 따뜻한 물에 같은 깊이로 함께 꽂아요.",
        "어느 쪽 버터가 먼저 녹는지 시간을 재어 기록하고, 그 까닭을 전도로 설명해요."
      ],
      "safety": ["끓는 물이 아닌 따뜻한 수돗물을 써요. 물은 보호자가 부어요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s51-u02/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "열은 온도가 높은 곳에서 낮은 곳으로 이동해요." }],
    "analogy": "줄 선 친구들이 공을 옆 사람에게 차례로 건네듯, 고체에서는 열이 이웃에게 차례로 전해져요(전도). 물과 공기는 직접 자리를 옮기며 열을 싣고 가요(대류).",
    "principle": "열은 온도가 높은 곳에서 낮은 곳으로 — 고체에서는 전도로, 액체·기체에서는 대류로 이동해요. 금속은 열을 빠르게, 플라스틱·나무는 느리게 전달해요.",
    "cards": ["s51-u02-b01", "s51-u02-b02", "s51-u02-b03", "s51-u02-b04"],
    "table": "s51-u02-b05",
    "miniTest": ["s51-u02-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "보온병은 어떻게 따뜻함을 오래 지킬까요?" }],
    "items": ["s51-u02-b07", "s51-u02-b08", "s51-u02-b09"],
    "reading": {
      "magazine": heatReading,
      "title": "보온병은 어떻게 따뜻함을 오래 지킬까?",
      "text": "열은 늘 온도가 낮은 쪽으로 빠져나가려 해요. 보온병은 그 길을 막아요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "전도와 대류를 생활의 예로 구분할 수 있나요?" }],
    "items": ["s51-u02-b10", "s51-u02-b11", "s51-u02-b12"],
    "pass": 2
  },
  "report": {
    "title": "열의 이동 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "띠의 재료에 따라 열이 전달되는 빠르기가 다를까?" },
      { "key": "hypothesis", "label": "② 가설", "hint": "어느 재료의 띠가 가장 빨리 색이 변할까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "띠의 재료만 바꾸고, 물의 온도·깊이·시간은 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "띠마다 색이 변한 칸 수를 써요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "물질에 따른 열 전달 빠르기와 전도·대류를 나누어 써요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "결과를 표에 남겼나요?", "관찰 사실과 생각을 나누었나요?", "전도와 대류를 구별했나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.material} · ${r.water} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 띠의 재료에 따라 색이 변한 칸이 어떻게 달라졌나요?` : "";
