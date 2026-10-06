import { shadowReading } from '../reading/s42-u03.reading.js';
export const lesson = {
  "unitId": "s42-u03",
  "grade": 4,
  "title": "그림자와 거울",
  "hero": "그림자 놀이 상자",
  "engage": {
    "say": [{ "mood": "thinking", "text": "그림자는 왜 커졌다 작아졌다 할까요?" }],
    "scene": "shadow-box",
    "question": "물체를 손전등 쪽으로 옮기면 그림자는 어떻게 될까요?",
    "predictions": [
      { "id": "0", "text": "그림자가 커진다" },
      { "id": "1", "text": "그림자가 작아진다" },
      { "id": "2", "text": "크기가 그대로이다" }
    ],
    "answer": "0",
    "wrongNote": "실험 결과와 비교하며 빛이 나아가는 모습을 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "물체의 위치만 바꾸고 손전등과 스크린은 그대로 둬요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "shadow",
      "goal": "빛·물체·위치를 고르고 불 켜기 → 관찰 → 표에 적기 순으로 해 보세요.",
      "columns": ["빛", "물체", "위치", "그림자"]
    },
    "home": {
      "title": "손 그림자와 막대 그림자",
      "minutes": 10,
      "guardian": false,
      "materials": [
        { "name": "손전등", "qty": "1개", "have": "home" },
        { "name": "흰 벽이나 흰 종이", "qty": "1장", "have": "home" },
        { "name": "막대(연필도 좋아요)", "qty": "1개", "have": "home" }
      ],
      "steps": [
        "어두운 방에서 손전등으로 흰 벽에 손 그림자를 만들어요. 손을 손전등 쪽·벽 쪽으로 옮기며 크기를 비교해요.",
        "맑은 날 막대를 세워 두고 오전과 오후에 그림자의 방향과 길이를 비교해요."
      ],
      "safety": ["손전등 빛을 사람 눈에 비추지 않아요. 해를 똑바로 보지 않아요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s42-u03/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "빛은 곧게 나아가고, 물체가 빛을 막으면 그림자가 생겨요." }],
    "analogy": "손전등 빛은 우산을 펼친 것처럼 퍼져 나가요. 손전등 가까이 있는 물체는 펼친 우산의 넓은 부분을 가려요.",
    "principle": "빛은 곧게 나아가요. 손전등 빛은 퍼지고 햇빛은 거의 나란해요.",
    "cards": ["s42-u03-b01", "s42-u03-b02", "s42-u03-b03", "s42-u03-b04"],
    "table": "s42-u03-b05",
    "miniTest": ["s42-u03-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "우리 주변의 그림자와 거울을 찾아봐요." }],
    "items": ["s42-u03-b07", "s42-u03-b08", "s42-u03-b09"],
    "reading": {
      "magazine": shadowReading,
      "title": "작은 구멍 하나로 세상을 거꾸로 볼 수 있을까?",
      "text": "빛은 곧게 나아가요. 그 성질 하나로 그림자도, 바늘구멍 사진기도, 거울도 설명할 수 있어요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "그림자의 크기가 변하는 까닭을 설명할 수 있나요?" }],
    "items": ["s42-u03-b10", "s42-u03-b11", "s42-u03-b12"],
    "pass": 2
  },
  "report": {
    "title": "그림자 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "그림자가 생기는 까닭을 알아보고, 물체의 위치만 바꾸어 그림자 크기를 비교해 보자." },
      { "key": "hypothesis", "label": "② 가설", "hint": "물체를 손전등에 가깝게 하면 그림자는 어떻게 될까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "물체의 위치만 바꾸고, 손전등·스크린·물체는 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "모형 값과 실제 관찰을 나누어요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "그림자 크기가 달라진 까닭을 빛의 나아감과 이어 설명해요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "결과를 표에 남겼나요?", "관찰 사실과 생각을 나누었나요?", "전등빛과 햇빛의 그림자를 구별했나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.light} · ${r.object} · ${r.place} · ${r.result}`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 위치에 따라 그림자 크기가 어떻게 달라졌나요?` : "";
