// 연습 공방 전용 유형 — 문제은행에 숫자로 답하는 유형이 없는 차시만 여기서 만든다.
// 골든벨 원본 문항·정답은 쓰지 않는다. 차시 개념(골든벨 representativeConcept)의 풀이 그대로 수만 새로 뽑는다.
// 꼴은 문제은행 생성기와 같다: ({ difficulty }) → { prompt, visual, answer, solution } | null
import { jo } from "./concept-board-kit.js?v=20261026b";

const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

// 「N개씩 묶어 식을 바꿔요」(2권 2·3·4·5의 배수 · 3권 6의 배수)
//   각 수를 N 묶음 몇 개로 바꾼 뒤 묶음 수끼리 더하고 빼서 N×□ 하나로 만든다.
//   연습: 두 수 더하기 · 실전: 셋째 수를 빼기 · 도전: 이미 곱셈인 항이 섞이거나, 거꾸로 빠진 수 찾기
function bundleEquation(base) {
  return ({ difficulty = 2 }) => {
    const n = base;
    // 「14는 2×7, 6은 2×3이에요」 — 마지막 것만 이에요/예요를 붙인다
    const say = (...gs) => gs.map((g, i) => `${jo(n * g, "은")} ${i === gs.length - 1 ? jo(`${n}×${g}`, "이에요") : `${n}×${g}`}`).join(", ");
    const prompt = `${n}개씩 묶어 생각하여 □에 알맞은 수를 쓰세요.`;
    if (difficulty === 1) {
      const a = randomInt(2, 6), b = randomInt(2, 6);
      return {
        prompt, answer: String(a + b),
        visual: { kind: "book6", subtype: "expression", expression: `${n * a} + ${n * b} = ${n}×□` },
        solution: `${say(a, b)}. 묶음 수를 더하면 ${a}+${b}=${a + b}이니까 □는 ${a + b}입니다.`
      };
    }
    if (difficulty === 2) {
      const a = randomInt(3, 9), b = randomInt(2, 8), c = randomInt(1, Math.min(a + b - 1, 6));
      if (c === b || c === a) return null;   // 더하고 바로 같은 수를 빼면 묶음으로 바꿀 까닭이 없다
      const g = a + b - c;
      return {
        prompt, answer: String(g),
        visual: { kind: "book6", subtype: "expression", expression: `${n * a} + ${n * b} − ${n * c} = ${n}×□` },
        solution: `${say(a, b, c)}. 묶음 수로 계산하면 ${a}+${b}−${c}=${g}이니까 □는 ${g}입니다.`
      };
    }
    if (Math.random() < 0.5) {
      // 이미 곱셈인 항 + 수 − 수
      const a = randomInt(6, 15), b = randomInt(2, 8), c = randomInt(1, 5), g = a + b - c;
      return {
        prompt, answer: String(g),
        visual: { kind: "book6", subtype: "expression", expression: `${n}×${a} + ${n * b} − ${n * c} = ${n}×□` },
        solution: `${jo(`${n}×${a}`, "은")} ${n} 묶음 ${a}개, ${say(b, c)}. 묶음 수로 계산하면 ${a}+${b}−${c}=${g}이니까 □는 ${g}입니다.`
      };
    }
    // 거꾸로: 빠진 수 찾기
    const a = randomInt(5, 12), total = a + randomInt(2, 7), gap = total - a;
    return {
      prompt, answer: String(n * gap),
      visual: { kind: "book6", subtype: "expression", expression: `${n}×${a} + □ = ${n}×${total}` },
      solution: `${n} 묶음 ${total}개가 되려면 ${total}−${a}=${gap}묶음이 더 있어야 해요. ${n}×${gap}=${n * gap}이니까 □는 ${n * gap}입니다.`
    };
  };
}

const bundleType = (base) => ({ id: `drill-bundle-${base}`, label: `${base}개씩 묶어 식을 바꾸기`, make: bundleEquation(base) });

export const DRILL_TYPES = Object.freeze(Object.fromEntries([2, 3, 4, 5, 6].map((n) => [`drill-bundle-${n}`, bundleType(n)])));
