import { splashReading } from '../reading/s51-u01.reading.js';
export const lesson = {
  "unitId": "s51-u01",
  "grade": 5,
  "title": "과학자는 어떻게 탐구할까요",
  "hero": "튀는 물방울 실험실",
  "engage": {
    "say": [{ "mood": "thinking", "text": "무엇이 튀는 물방울의 수를 바꿀까요?" }],
    "scene": "splash-bottle",
    "question": "페트병 뚜껑 구멍이 1 mm일 때와 7 mm일 때, 어느 쪽에서 방울이 더 많이 튈까요?",
    "predictions": [
      { "id": "0", "text": "1 mm 쪽이 더 많다" },
      { "id": "1", "text": "7 mm 쪽이 더 많다" },
      { "id": "2", "text": "둘 다 똑같다" }
    ],
    "answer": "0",
    "wrongNote": "세 번 잰 평균값을 비교하며 물줄기의 모습(끊어짐·이어짐)을 다시 생각해요."
  },
  "explore": {
    "say": [{ "mood": "talk", "text": "다르게 할 조건은 하나! 같은 조건으로 세 번 재어 평균을 내요." }],
    "modes": ["lab", "scene", "home"],
    "lab": {
      "kind": "splash",
      "goal": "구멍 지름과 높이를 고르고 떨어뜨리기를 세 번 → 평균 내어 표에 적기 순으로 해 보세요.",
      "columns": ["구멍 지름", "높이", "1·2·3회", "평균"]
    },
    "home": {
      "title": "공 튀기기로 평균 내기",
      "minutes": 15,
      "guardian": false,
      "materials": [
        { "name": "탱탱볼이나 탁구공", "qty": "1개", "have": "home" },
        { "name": "줄자나 30 cm 자", "qty": "1개", "have": "home" },
        { "name": "기록지", "qty": "1장", "have": "home" }
      ],
      "steps": [
        "벽에 자를 세우고 공을 정한 높이(예: 50 cm)에서 떨어뜨려 튀어 오른 높이를 세 번 재어 평균을 내요.",
        "떨어뜨리는 높이만 바꾸어(예: 100 cm) 다시 세 번 재고, 두 평균을 비교해 결론을 써요."
      ],
      "safety": ["창문·화분·전등 근처에서는 하지 않아요."],
      "kitUrl": "https://lete-on.gfieldacademy.net/science-lab/v2/#/s51-u01/kit",
      "qr": null
    }
  },
  "explain": {
    "say": [{ "mood": "talk", "text": "과학자는 한 가지만 바꾸어 여러 번 재고, 결과를 근거로 결론을 내려요." }],
    "analogy": "달리기 기록을 한 번만 재면 넘어지거나 운이 좋았던 것이 섞여요. 세 번 재어 평균을 내면 진짜 실력에 가까워져요.",
    "principle": "탐구는 문제 → 가설 → 실험 계획(다르게 할 조건 하나) → 측정(여러 번, 평균) → 자료 정리 → 결론·발표 순서로 해요.",
    "cards": ["s51-u01-b01", "s51-u01-b02", "s51-u01-b03", "s51-u01-b04"],
    "table": "s51-u01-b05",
    "miniTest": ["s51-u01-b06"]
  },
  "elaborate": {
    "say": [{ "mood": "thinking", "text": "과학자는 발표한 뒤에 어떤 질문을 받을까요?" }],
    "items": ["s51-u01-b07", "s51-u01-b08", "s51-u01-b09"],
    "reading": {
      "magazine": splashReading,
      "title": "과학자는 왜 남에게 질문을 받으려 할까?",
      "text": "과학자의 결론은 발표하고 질문을 받은 뒤에야 단단해져요."
    },
    "report": true
  },
  "evaluate": {
    "say": [{ "mood": "praise", "text": "다르게 할 조건과 같게 할 조건을 구분할 수 있나요?" }],
    "items": ["s51-u01-b10", "s51-u01-b11", "s51-u01-b12"],
    "pass": 2
  },
  "report": {
    "title": "튀는 물방울 탐구보고서",
    "sections": [
      { "key": "problem", "label": "① 탐구 문제", "hint": "페트병 뚜껑 구멍의 지름에 따라 튄 방울 수가 달라질까?" },
      { "key": "hypothesis", "label": "② 가설", "hint": "구멍이 작을수록(물줄기가 가늘수록) 튄 방울 수는 어떻게 될까요?" },
      { "key": "vars", "label": "③ 비교 조건", "hint": "구멍 지름만 바꾸고, 높이·잉크 양·종이·잰 횟수는 같게 한다." },
      { "key": "result", "label": "④ 결과", "hint": "세 번의 값과 평균을 표에 써요." },
      { "key": "conclusion", "label": "⑤ 결론", "hint": "평균을 근거로, 실험한 것만 짧게 써요." },
      { "key": "more", "label": "⑥ 더 알고 싶은 점", "hint": "" }
    ],
    "checks": ["한 조건만 바꾸었나요?", "세 번 재어 평균을 냈나요?", "결과를 그대로 썼나요?", "실험하지 않은 것을 결론에 넣지 않았나요?"]
  }
};
lesson.explore.lab.rowText = r => `${r.hole} mm · ${r.height} cm · 평균 ${r.mean}개`;
lesson.explain.fromData = rows => rows.length ? `네 기록: ${rows.map(lesson.explore.lab.rowText).join(" / ")}. 구멍과 높이에 따라 평균이 어떻게 달라졌나요?` : "";
