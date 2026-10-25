// 손글씨 판서 대본 — 6권(수직선과 비·둘레·연속수의 합·수와 숫자의 개수). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수는 골든벨 6권 문항(수직선 15~47·39~95·17~35·18~30·10~30·20~44·4~28, 가르기 24·34·…·92,
// 연필 2·3/3·4/3·5개, 공과 상자 5·6개 등)과 겹치지 않게 골랐다.

import { jo } from "./concept-board-kit.js?v=20261026b";

const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };

// 수직선: a~b를 n칸으로 똑같이 나눈 눈금. 칸마다 아래로 둥근 호를 그릴 수 있게 자리를 돌려준다.
const nline = (x0, x1, y, a, b, n) => {
  const X = (v) => x0 + (v - a) / (b - a) * (x1 - x0), step = (b - a) / n, ticks = Array.from({ length: n + 1 }, (_, i) => a + i * step);
  const base = [{ kind: "line", x1: x0 - 20, y1: y, x2: x1 + 20, y2: y, color: "ink", width: 3 }];
  const tick = (v, color = "ink") => ({ kind: "line", x1: X(v), y1: y - 12, x2: X(v), y2: y + 12, color, width: 3 });
  const label = (v, color = "blue", size = 26) => T(X(v), y + 44, String(v), color, size, "center");
  const arc = (i, color = "red", label) => { const xa = X(ticks[i]), xb = X(ticks[i + 1]);
    return [{ kind: "path", d: `M ${xa.toFixed(1)} ${y - 6} Q ${((xa + xb) / 2).toFixed(1)} ${y - 46} ${xb.toFixed(1)} ${y - 6}`, stroke: color, width: 2.5 }, ...(label != null ? [T((xa + xb) / 2, y - 40, String(label), color, 22, "center")] : [])]; };
  return { X, ticks, base, tick, label, arc };
};

export const BOARDS_B06 = {
  "book-06/number-line-unit-distance": (() => {
    const a = 12, b = 40, n = 7, step = (b - a) / n, L = nline(110, 880, 300, a, b, n);
    const CHK = { a: 21, b: 45, n: 8 }, chk = (CHK.b - CHK.a) / CHK.n;
    return {
      title: "수직선 한 칸의 거리를 찾아요",
      kicker: "6권 1단원 · 손글씨 개념",
      beats: [
        { say: "수직선의 두 끝 수 사이를 똑같은 칸으로 나눴을 때, 한 칸이 얼마인지 찾아요. 눈금이 아니라 칸을 세는 게 핵심이에요.",
          items: [title("수직선 한 칸의 거리")] },
        { say: `수직선에 ${jo(a, "와")} ${jo(b, "을")} 써요.`,
          items: [...L.base, L.tick(a), L.tick(b), L.label(a), L.label(b)] },
        { say: "두 수 사이를 똑같이 나누는 눈금을 그어요.",
          items: L.ticks.slice(1, -1).map((v) => L.tick(v, "gray")) },
        { say: `먼저 전체 거리를 구해요. 큰 수에서 작은 수를 빼요. ${b} 빼기 ${jo(a, "는")} ${jo(b - a, "이에요")}.`,
          items: [T(110, 420, `전체 거리: ${b} − ${a} = ${b - a}`, "blue", 30)] },
        { say: `이제 칸을 세요. 눈금이 아니라 눈금 사이의 칸이에요. 칸마다 호를 그리며 세요. ${Array.from({ length: n }, (_, i) => i + 1).join(", ")}. ${KO[n]} 칸이에요.`,
          items: Array.from({ length: n }, (_, i) => L.arc(i, "red", i + 1)).flat() },
        { say: `눈금은 몇 개일까요? 양쪽 끝까지 ${KO[n + 1]} 개예요. 눈금은 칸보다 하나 많아요. 눈금을 세면 틀려요.`,
          items: [T(110, 470, `눈금 ${n + 1}개, 칸 ${n}개 → 칸을 세요!`, "red", 26)] },
        { say: `전체 거리 ${jo(b - a, "을")} 칸 수 ${jo(n, "로")} 나눠요. ${b - a} 나누기 ${jo(n, "은")} ${jo(step, "예요")}. 한 칸의 거리는 ${jo(step, "예요")}.`,
          items: [T(110, 520, `한 칸: ${b - a} ÷ ${n} = ${step}`, "green", 32)] },
        { say: `확인해요. ${a}에서 ${step}씩 더해 가요. ${L.ticks.join(", ")}. ${b}에 딱 닿아요.`,
          items: L.ticks.slice(1, -1).map((v) => L.label(v, "green", 22)) },
        { say: "정리해요. 큰 끝 수에서 작은 끝 수를 빼 전체 거리를 구해요. 눈금이 아니라 칸을 세요. 전체 거리를 칸 수로 나누면 한 칸이에요.", mood: "praise",
          items: [T(560, 470, "전체 ÷ 칸 수 = 한 칸", "gold", 30)] },
        { say: `한 문제 풀어 봐요. ${CHK.a}부터 ${CHK.b}까지 똑같이 ${KO[CHK.n]} 칸으로 나누면 한 칸은 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a}부터 ${CHK.b}까지를 똑같이 ${CHK.n}칸으로 나누면 한 칸은?`,
            options: [String(chk), String(CHK.n), String(CHK.b - CHK.a)], answer: 0,
            hint: "전체 거리를 먼저 구하고 칸 수로 나눠요.", sayHint: `${CHK.b} 빼기 ${jo(CHK.a, "은")} ${jo(CHK.b - CHK.a, "예요")}. 여덟 칸으로 나누면요?`,
            right: `맞았어요! (${CHK.b} − ${CHK.a}) ÷ ${CHK.n} = ${chk}.`, sayRight: `맞았어요! 24를 여덟 칸으로 나누면 ${jo(chk, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/equal-share-source": (() => {
    const tree = (cx, top, n, value, kids, color = "blue") => { const out = [{ kind: "node", cx, cy: top, r: 34, value, color, size: 32 }];
      kids.forEach((v, i) => { const x = cx + (i - (n - 1) / 2) * 92, y = top + 120; out.push({ kind: "line", x1: cx, y1: top + 34, x2: x, y2: y - 32, color: "gray", width: 2.5 }, { kind: "node", cx: x, cy: y, r: 32, value: v, color: v == null ? "gray" : "green", size: 30 }); });
      return out; };
    const A = 64, B = 96;
    const CHK = 84, chk = CHK / 4;
    return {
      title: "똑같이 가르기",
      kicker: "6권 1단원 · 손글씨 개념",
      beats: [
        { say: "큰 수를 둘, 셋, 넷으로 똑같이 갈라요. 십의 자리와 일의 자리를 따로 가르면 쉬워요. 그리고 같은 수가 몇 번 있는지 곱셈식으로 써요.",
          items: [title("똑같이 가르기")] },
        { say: `${jo(A, "를")} 똑같이 둘로 갈라요. 가지를 두 개 그려요.`,
          items: tree(200, 180, 2, A, [null, null]) },
        { say: `${jo(A, "는")} 60과 4예요. 60을 둘로 가르면 30, 4를 둘로 가르면 2. 30과 2를 모아 32. 두 칸 모두 ${jo(A / 2, "예요")}.`,
          items: [...tree(200, 180, 2, A, [A / 2, A / 2]), T(80, 380, `60 ÷ 2 = 30, 4 ÷ 2 = 2 → ${A / 2}`, "blue", 26)] },
        { say: `확인해요. ${A / 2} 더하기 ${jo(A / 2, "는")} ${jo(A, "예요")}. 그리고 ${jo(A / 2, "가")} 두 번이니 곱셈식으로 ${A} = 2 × ${A / 2}.`,
          items: [T(80, 430, `${A / 2} + ${A / 2} = ${A},  ${A} = 2 × ${A / 2}`, "green", 28)] },
        { say: `이번엔 ${jo(B, "을")} 똑같이 셋으로 갈라요.`,
          items: tree(680, 180, 3, B, [null, null, null]) },
        { say: `${jo(B, "은")} 90과 6. 90을 셋으로 가르면 30, 6을 셋으로 가르면 2. 모으면 ${B / 3}. 세 칸 모두 ${jo(B / 3, "예요")}.`,
          items: [...tree(680, 180, 3, B, [B / 3, B / 3, B / 3]), T(560, 380, `90 ÷ 3 = 30, 6 ÷ 3 = 2 → ${B / 3}`, "blue", 26)] },
        { say: `${jo(B / 3, "가")} 세 번이에요. ${B / 3} 더하기 ${B / 3} 더하기 ${jo(B / 3, "는")} ${B}. 곱셈식으로 ${B} = 3 × ${B / 3}.`,
          items: [T(560, 430, `${B} = 3 × ${B / 3}`, "green", 30)] },
        { say: "넷으로 가를 때는 반으로 두 번 가르면 돼요. 반의 반이 넷으로 가른 거예요.",
          items: [T(80, 500, "넷으로 = 반으로 두 번", "gold", 28)] },
        { say: "정리해요. 몇 개로 가를지 정하고, 십의 자리와 일의 자리를 따로 갈라 모아요. 다시 더해 처음 수가 되는지 확인하고, 곱셈식으로 써요.", mood: "praise",
          items: [T(560, 500, "십 따로, 일 따로 → 모으기", "gold", 28)] },
        { say: `한 문제 풀어 봐요. ${jo(CHK, "를")} 똑같이 넷으로 가르면 한 칸은 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${jo(CHK, "를")} 똑같이 넷으로 가르면 한 칸은?`,
            options: [String(chk), String(CHK / 2), "24"], answer: 0,
            hint: "80과 4를 따로 넷으로 갈라 모아요.", sayHint: "80을 넷으로 가르면 20, 4를 넷으로 가르면 1이에요. 모으면요?",
            right: `맞았어요! 20 + 1 = ${chk}, ${CHK} = 4 × ${chk}.`, sayRight: `맞았어요! 20과 1을 모아 ${jo(chk, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/number-line-ratio-source": (() => {
    const a = 14, b = 50, n = 4, step = (b - a) / n, L = nline(110, 830, 300, a, b, n), k = 3;
    const CHK = { a: 16, b: 52, n: 9 }, chk = (CHK.b - CHK.a) / CHK.n;
    return {
      title: "수직선의 거리",
      kicker: "6권 1단원 · 손글씨 개념",
      beats: [
        { say: "수직선의 한 칸 거리를 구하고, 칸을 여러 개 묶은 거리도 구해요. 한 칸만 알면 몇 칸이든 셀 수 있어요.",
          items: [title("수직선의 거리")] },
        { say: `${a}부터 ${b}까지 그려요. 사이를 똑같이 ${KO[n]} 칸으로 나눴어요.`,
          items: [...L.base, ...L.ticks.map((v, i) => L.tick(v, i === 0 || i === n ? "ink" : "gray")), L.label(a), L.label(b)] },
        { say: `전체 거리는 ${b} 빼기 ${a}, ${jo(b - a, "이에요")}.`,
          items: [T(110, 420, `전체: ${b} − ${a} = ${b - a}`, "blue", 30)] },
        { say: `칸은 ${KO[n]} 개. ${b - a} 나누기 ${jo(n, "는")} ${step}. 한 칸의 거리는 ${jo(step, "예요")}.`,
          items: [...Array.from({ length: n }, (_, i) => L.arc(i, "red", step)).flat(), T(110, 470, `한 칸: ${b - a} ÷ ${n} = ${step}`, "green", 30)] },
        { say: `눈금마다 수를 써요. ${a}에서 ${step}씩, ${L.ticks.join(", ")}.`,
          items: L.ticks.slice(1, -1).map((v) => L.label(v, "green", 24)) },
        { say: `${KO[k]} 칸을 묶은 거리는 얼마일까요? 한 칸이 ${jo(step, "이니까")} ${step} 곱하기 ${k}, ${jo(step * k, "이에요")}.`,
          items: [{ kind: "path", d: `M ${L.X(a)} ${300 + 30} Q ${(L.X(a) + L.X(a + k * step)) / 2} ${300 + 110} ${L.X(a + k * step)} ${300 + 30}`, stroke: "gold", width: 3 }, T(560, 420, `${k}칸: ${step} × ${k} = ${step * k}`, "gold", 28)] },
        { say: `${a}에서 ${KO[k]} 칸을 가면 ${a} 더하기 ${step * k}, ${jo(a + k * step, "이에요")}. 눈금의 수와 같아요.`,
          items: [T(560, 470, `${a} + ${step * k} = ${a + k * step} ✓`, "green", 28)] },
        { say: "정리해요. 끝 수끼리 빼서 전체 거리를, 칸 수로 나눠 한 칸을 구해요. 여러 칸을 묶으면 한 칸 곱하기 칸 수예요.", mood: "praise",
          items: [T(110, 540, "묶은 거리 = 한 칸 × 칸 수", "gold", 28)] },
        { say: `한 문제 풀어 봐요. ${CHK.a}부터 ${CHK.b}까지를 똑같이 ${KO[CHK.n]} 칸으로 나누면 한 칸의 거리는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a}부터 ${CHK.b}까지를 똑같이 ${CHK.n}칸으로 나누면 한 칸의 거리는?`,
            options: [String(chk), String(CHK.n), String(CHK.b - CHK.a)], answer: 0,
            hint: "전체 거리를 칸 수로 나눠요.", sayHint: `${CHK.b} 빼기 ${jo(CHK.a, "은")} 36. 아홉 칸으로 나누면요?`,
            right: `맞았어요! 36 ÷ 9 = ${chk}.`, sayRight: `맞았어요! 36을 아홉 칸으로 나누면 ${jo(chk, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/number-line-ratio-compare-source": (() => {
    const a = 6, b = 36, L = b - a, up = 2, dn = 5, A = L / up, B = L / dn;
    const g = (x, y) => (y ? g(y, x % y) : x), G = g(A, B);
    const X0 = 110, X1 = 830, X = (v) => X0 + (v - a) / L * (X1 - X0);
    const bar = (y, n, color) => [{ kind: "line", x1: X0, y1: y, x2: X1, y2: y, color: "ink", width: 3 }, ...Array.from({ length: n + 1 }, (_, i) => ({ kind: "line", x1: X0 + i * (X1 - X0) / n, y1: y - 12, x2: X0 + i * (X1 - X0) / n, y2: y + 12, color, width: 3 }))];
    const CHK = { len: 20, up: 4, dn: 5 };
    return {
      title: "수직선과 비",
      kicker: "6권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 길이를 위에서는 적게, 아래에서는 많이 나누면 한 칸의 길이가 달라져요. 두 칸을 비로 비교해 봐요.",
          items: [title("같은 길이, 다른 칸")] },
        { say: `${a}부터 ${b}까지의 길이를 위에 그려요. 총 길이는 ${b} 빼기 ${a}, ${jo(L, "이에요")}.`,
          items: [...bar(220, up, "blue"), T(X0, 200, String(a), "blue", 24, "center"), T(X1, 200, String(b), "blue", 24, "center"), T(X0, 420, `총 길이: ${b} − ${a} = ${L}`, "ink", 28)] },
        { say: `위는 ${KO[up]} 칸으로 똑같이 나눴어요. 한 칸 A는 ${L} 나누기 ${up}, ${jo(A, "예요")}.`,
          items: [T((X0 + X1) / 4, 250, `A = ${A}`, "blue", 28, "center"), T(X0, 465, `A = ${L} ÷ ${up} = ${A}`, "blue", 28)] },
        { say: `같은 길이를 아래에 그리고 ${KO[dn]} 칸으로 나눠요. 한 칸 B는 ${L} 나누기 ${dn}, ${jo(B, "이에요")}.`,
          items: [...bar(330, dn, "green"), T(X0 + (X1 - X0) / dn / 2, 370, `B = ${B}`, "green", 26, "center"), T(X0, 510, `B = ${L} ÷ ${dn} = ${B}`, "green", 28)] },
        { say: "같은 길이를 적게 나눌수록 한 칸이 길어요. 위는 두 칸이라 길고, 아래는 다섯 칸이라 짧아요.",
          items: [T(560, 465, "적게 나눌수록 한 칸이 길어요", "gold", 24)] },
        { say: `A와 B를 비로 써요. A 대 B는 ${A} 대 ${jo(B, "이에요")}.`,
          items: [T(560, 510, `A : B = ${A} : ${B}`, "red", 30)] },
        { say: `비의 앞 수와 뒤 수를 같은 수로 나눠도 같은 비예요. 둘 다 ${jo(G, "으로")} 나누면 ${A / G} 대 ${jo(B / G, "예요")}. 칸 수 ${jo(up, "와")} ${jo(dn, "가")} 뒤바뀐 모양이에요.`,
          items: [T(560, 555, `= ${A / G} : ${B / G}  (칸 수 ${up} : ${jo(dn, "를")} 뒤집은 비)`, "green", 24)] },
        { say: "정리해요. 총 길이를 위 칸 수로 나누면 A, 아래 칸 수로 나누면 B예요. A : B로 쓰고, 같은 수로 나눠 간단히 해요. 칸이 많은 쪽이 한 칸은 짧아요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 길이 ${jo(CHK.len, "을")} 위는 ${KO[CHK.up]} 칸, 아래는 ${KO[CHK.dn]} 칸으로 똑같이 나눴어요. A 대 B를 간단히 하면 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `길이 ${jo(CHK.len, "을")} 위는 ${CHK.up}칸(A), 아래는 ${CHK.dn}칸(B)으로 똑같이 나눴어요. A : B를 간단히 하면?`,
            options: [`${CHK.up} : ${CHK.dn}`, `${CHK.dn} : ${CHK.up}`, `${CHK.len} : 9`], answer: 1,
            hint: "A와 B를 먼저 구해요.", sayHint: `A는 ${CHK.len} 나누기 ${CHK.up}, B는 ${CHK.len} 나누기 ${jo(CHK.dn, "예요")}.`,
            right: `맞았어요! A = ${CHK.len / CHK.up}, B = ${CHK.len / CHK.dn}, ${CHK.dn} : ${CHK.up}.`, sayRight: `맞았어요! A는 ${CHK.len / CHK.up}, B는 ${CHK.len / CHK.dn}. ${CHK.dn} 대 ${jo(CHK.up, "예요")}. 칸 수를 뒤집은 비예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/pencil-measure-source": (() => {
    const nA = 2, nB = 5, len = 20, A = len / nA, B = len / nB, C = A - B;
    const U = 30, X0 = 110;
    const seg = (y, n, w, color, label) => Array.from({ length: n }, (_, i) => [{ kind: "box", x: X0 + i * w * U, y, w: w * U - 4, h: 40, color }, T(X0 + (i + 0.5) * w * U, y + 30, label, color, 28, "center")]).flat();
    const CHK = { ruler: 12, n: 4, stick: 8 }, chk = CHK.ruler * CHK.n / CHK.stick;
    const RX = 560;
    return {
      title: "막대로 길이 재기",
      kicker: "6권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 길이를 서로 다른 막대로 재면 재는 횟수가 달라요. 하지만 막대 길이와 횟수를 곱하면 언제나 같은 전체 길이예요.",
          items: [title("막대로 길이 재기")] },
        { say: `연필의 길이는 막대 A ${KO[nA]} 개를 이은 길이와 같고, 막대 B ${KO[nB]} 개를 이은 길이와도 같아요.`,
          items: [{ kind: "box", x: X0, y: 150, w: len * U, h: 36, color: "ink" }, T(X0 - 10, 178, "연필", "ink", 26, "right"), ...seg(210, nA, A, "blue", "A"), ...seg(270, nB, B, "green", "B")] },
        { say: `연필이 ${len}센티미터라면, A 하나는 ${len} 나누기 ${nA}, ${A}센티미터. B 하나는 ${len} 나누기 ${nB}, ${B}센티미터예요.`,
          items: [T(RX, 380, `A = ${len} ÷ ${nA} = ${A}cm`, "blue", 28), T(RX, 425, `B = ${len} ÷ ${nB} = ${B}cm`, "green", 28)] },
        { say: `막대 C는 A와 B의 길이 차이예요. ${A} 빼기 ${jo(B, "는")} ${C}센티미터예요.`,
          items: [T(RX, 470, `C = ${A} − ${B} = ${C}cm`, "red", 28)] },
        { say: `연필이 될 수 있는 가장 짧은 길이는 얼마일까요? A ${KO[nA]} 개로도, B ${KO[nB]} 개로도 딱 맞아야 하니, 2단에도 5단에도 나오는 수예요. 가장 작은 것은 10이에요.`,
          items: [T(110, 380, "2단: 2, 4, 6, 8, 10, …", "gray", 24), T(110, 420, "5단: 5, 10, …", "gray", 24), T(110, 465, "둘 다 → 10", "gold", 28)] },
        { say: "이번엔 재는 횟수예요. 같은 길이를 긴 막대로 재면 적게, 짧은 막대로 재면 많이 재요. 막대 길이 곱하기 횟수는 늘 전체 길이예요.",
          items: [T(110, 520, "막대 길이 × 횟수 = 전체 길이", "gold", 28)] },
        { say: "책상을 6센티미터 막대로 재니 다섯 번이었어요. 책상은 6 곱하기 5, 30센티미터. 10센티미터 막대로 재면 30 나누기 10, 세 번이에요.",
          items: [T(RX, 520, "6 × 5 = 30 → 30 ÷ 10 = 3번", "green", 26)] },
        { say: "정리해요. 먼저 막대 길이 곱하기 횟수로 전체 길이를 구해요. 다른 막대의 길이로 나누면 몇 번 재는지 나와요. 두 막대로 딱 맞는 길이는 두 단에 모두 나오는 수예요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 탁자는 ${CHK.ruler}센티미터 자로 ${KO[CHK.n]} 번 잰 길이예요. 같은 탁자를 ${CHK.stick}센티미터 막대로 재면 몇 번일까요?`, mood: "think",
          items: [],
          check: { question: `탁자는 ${CHK.ruler}cm 자로 ${CHK.n}번 잰 길이예요. ${CHK.stick}cm 막대로 재면 몇 번?`,
            options: [String(chk), String(CHK.n), String(CHK.stick)], answer: 0,
            hint: "전체 길이부터 구해요.", sayHint: `${CHK.ruler} 곱하기 ${jo(CHK.n, "는")} ${CHK.ruler * CHK.n}센티미터. ${CHK.stick}센티미터로 나눠요.`,
            right: `맞았어요! ${CHK.ruler} × ${CHK.n} = ${CHK.ruler * CHK.n}, ÷ ${CHK.stick} = ${chk}번.`, sayRight: `맞았어요! 탁자는 ${CHK.ruler * CHK.n}센티미터, 8센티미터로 재면 ${KO[chk]} 번이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/fraction-balance-source": (() => {
    const bar = (x, y, w, n, k, color) => [{ kind: "box", x, y, w, h: 44, color: "ink" }, ...Array.from({ length: n - 1 }, (_, i) => ({ kind: "line", x1: x + (i + 1) * w / n, y1: y, x2: x + (i + 1) * w / n, y2: y + 44, color: "ink", width: 2 })), ...Array.from({ length: k }, (_, i) => ({ kind: "fill", x: x + i * w / n + 3, y: y + 3, w: w / n - 6, h: 38, fill: color }))];
    const W = 360, X = 110;
    const R = [2, 3], SUM = 40, part = SUM / (R[0] + R[1]);
    return {
      title: "분수와 비",
      kicker: "6권 1단원 · 손글씨 개념",
      beats: [
        { say: "모양은 달라도 크기가 같은 분수가 있어요. 분모와 분자에 같은 수를 곱하면 크기가 같아요. 비도 똑같아요.",
          items: [title("크기가 같은 분수와 비")] },
        { say: "막대를 셋으로 똑같이 나누고 한 칸을 칠해요. 3분의 1이에요.",
          items: [...bar(X, 150, W, 3, 1, "#cfe0f5"), T(X + W + 30, 182, "1/3", "blue", 32)] },
        { say: "같은 막대를 여섯으로 나누고 두 칸을 칠하면, 칠한 길이가 똑같아요. 6분의 2.",
          items: [...bar(X, 220, W, 6, 2, "#cfe0f5"), T(X + W + 30, 252, "2/6", "blue", 32)] },
        { say: "열둘로 나누고 네 칸을 칠해도 같아요. 12분의 4.",
          items: [...bar(X, 290, W, 12, 4, "#cfe0f5"), T(X + W + 30, 322, "4/12", "blue", 32)] },
        { say: "3분의 1에서 6분의 2로 갈 때, 분모가 두 배가 됐어요. 분자도 두 배. 분모와 분자에 같은 수를 곱했어요. 12분의 4는 둘 다 네 배예요.",
          items: [T(X, 400, "1/3 = (1×2)/(3×2) = 2/6 = (1×4)/(3×4) = 4/12", "green", 26)] },
        { say: "비도 같아요. 앞 수와 뒤 수에 같은 수를 곱하면 같은 비예요. 2 대 3은 4 대 6, 6 대 9와 같아요.",
          items: [T(X, 450, "2 : 3 = 4 : 6 = 6 : 9", "blue", 30)] },
        { say: `사탕 ${SUM}개를 언니와 동생이 2 대 3으로 나눠요. 비의 두 수를 더하면 5. ${jo(SUM, "을")} 5로 나누면 한 몫은 ${jo(part, "이에요")}.`,
          items: [T(620, 400, `${SUM} ÷ (2 + 3) = ${part}`, "blue", 28)] },
        { say: `언니는 두 몫, ${part} 곱하기 2, ${R[0] * part}개. 동생은 세 몫, ${part} 곱하기 3, ${R[1] * part}개. 더하면 ${jo(SUM, "이에요")}.`,
          items: [T(620, 450, `언니 ${R[0] * part}, 동생 ${R[1] * part} (합 ${SUM}) ✓`, "green", 26)] },
        { say: "정리해요. 분모가 몇 배가 되었는지 보고, 분자에도 같은 수를 곱해요. 비도 앞뒤에 같은 수를 곱해요. 합이 정해지면 비의 두 수의 합으로 나눠 한 몫을 구해요.", mood: "praise",
          items: [T(X, 530, "분모·분자에 같은 수 / 비의 앞뒤에 같은 수", "gold", 26)] },
        { say: "한 문제 풀어 봐요. 5분의 2와 크기가 같은 분수는 어느 것일까요?", mood: "think",
          items: [],
          check: { question: "2/5와 크기가 같은 분수는?",
            options: ["4/10", "4/7", "3/6"], answer: 0,
            hint: "분모와 분자에 같은 수를 곱한 것을 찾아요.", sayHint: "2분의 5가 아니라 5분의 2예요. 분모 5에 2를 곱하면 10, 분자 2에도 2를 곱하면요?",
            right: "맞았어요! (2×2)/(5×2) = 4/10.", sayRight: "맞았어요! 분모와 분자에 모두 2를 곱하면 10분의 4예요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-06/bar-balance-ratio-source": (() => {
    const nBox = 4, TOT = 35, part = TOT / (nBox + 1);
    const S = { cx: 300, cy: 230 };
    const pan = (x, y) => ({ kind: "path", d: `M ${x - 90} ${y + 20} Q ${x} ${y + 64} ${x + 90} ${y + 20}`, stroke: "ink", width: 3 });
    const CHK = { ball: 2, marble: 7 };
    const RX = 560;
    return {
      title: "막대와 저울의 비",
      kicker: "6권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 무게가 되는 개수를 보면, 하나의 무게를 비로 나타낼 수 있어요. 개수가 많은 쪽이 하나는 가벼워요.",
          items: [title("저울과 비")] },
        { say: `저울 왼쪽에 공 한 개, 오른쪽에 상자 ${KO[nBox]} 개. 수평이에요.`,
          items: [{ kind: "path", d: `M ${S.cx} ${S.cy} L ${S.cx - 24} ${S.cy + 62} L ${S.cx + 24} ${S.cy + 62} Z`, stroke: "gray", width: 3, quick: true }, { kind: "line", x1: S.cx - 150, y1: S.cy, x2: S.cx + 150, y2: S.cy, color: "ink", width: 4 }, pan(S.cx - 150, S.cy), pan(S.cx + 150, S.cy), { kind: "shape", type: "circle", cx: S.cx - 150, cy: S.cy + 20, r: 20, color: "red", fill: "#f6dcd3" }, ...Array.from({ length: nBox }, (_, i) => ({ kind: "shape", type: "square", cx: S.cx + 150 + (i - 1.5) * 34, cy: S.cy + 24, r: 13, color: "blue" }))] },
        { say: `공 하나가 상자 ${KO[nBox]} 개와 무게가 같으니, 공 하나는 상자 하나의 ${nBox}배 무게예요.`,
          items: [T(RX, 180, `공 1 = 상자 ${nBox}`, "blue", 30)] },
        { say: `하나의 무게를 비로 쓰면, 공 대 상자는 ${nBox} 대 1이에요. 개수의 비 1 대 ${nBox}를 뒤집은 거예요. 개수가 많은 쪽이 하나는 가벼우니까요.`,
          items: [T(RX, 230, `개수 1 : ${nBox} → 무게 ${nBox} : 1`, "red", 28)] },
        { say: `공 하나와 상자 하나를 합한 무게가 ${TOT}그램이에요. 비의 두 수를 더하면 ${nBox} 더하기 1, 5. ${TOT} 나누기 5는 ${part}, 한 몫이 ${part}그램이에요.`,
          items: [T(RX, 290, `${TOT} ÷ (${nBox} + 1) = ${part}`, "blue", 28)] },
        { say: `공은 ${KO[nBox]} 몫, ${part} 곱하기 ${nBox}, ${part * nBox}그램. 상자는 한 몫, ${part}그램.`,
          items: [T(RX, 340, `공 ${part * nBox}g, 상자 ${part}g`, "green", 30)] },
        { say: `확인해요. ${part * nBox} 더하기 ${jo(part, "은")} ${jo(TOT, "이에요")}. 공 하나는 상자 ${KO[nBox]} 개, ${part} 곱하기 ${jo(nBox, "와")} 같아요.`,
          items: [T(RX, 390, `${part * nBox} + ${part} = ${TOT} ✓`, "green", 28)] },
        { say: "막대도 같아요. 막대 A 세 개가 막대 B 두 개와 길이가 같으면, A 하나 대 B 하나는 개수를 뒤집어 2 대 3이에요.",
          items: [T(RX, 450, "A 3개 = B 2개 → A : B = 2 : 3", "gold", 26)] },
        { say: "정리해요. 같은 무게나 길이가 되는 개수를 세요. 개수의 비를 뒤집으면 하나의 비예요. 합을 알면 비의 두 수의 합으로 나눠 한 몫을 구해요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 공 ${KO[CHK.ball]} 개와 구슬 ${KO[CHK.marble]} 개가 수평이에요. 공 하나 대 구슬 하나의 무게의 비는 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `공 ${CHK.ball}개와 구슬 ${CHK.marble}개가 수평이에요. 공 : 구슬(하나의 무게)은?`,
            options: [`${CHK.ball} : ${CHK.marble}`, `${CHK.marble} : ${CHK.ball}`, `${CHK.marble} : ${CHK.ball + CHK.marble}`], answer: 1,
            hint: "개수의 비를 뒤집어요.", sayHint: `개수는 공 ${CHK.ball}, 구슬 ${CHK.marble}. 개수가 많은 구슬이 하나는 가벼워요. 뒤집으면요?`,
            right: `맞았어요! 개수 ${CHK.ball} : ${jo(CHK.marble, "을")} 뒤집어 ${CHK.marble} : ${CHK.ball}.`, sayRight: `맞았어요! 개수의 비를 뒤집어 ${CHK.marble} 대 ${jo(CHK.ball, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,"book-06/rectangle-missing-side": (() => {
    const P = 30, W = 9, H = P / 2 - W, U = 34, X0 = 110, Y0 = 170;
    const rect = (color = "ink") => ({ kind: "box", x: X0, y: Y0, w: W * U, h: H * U, color });
    const CHK = { P: 26, w: 8 }, chk = CHK.P / 2 - CHK.w;
    const RX = 520;
    return {
      title: "둘레로 빠진 변을 찾아요",
      kicker: "6권 2단원 · 손글씨 개념",
      beats: [
        { say: "직사각형의 둘레와 한 변을 알면, 다른 한 변을 찾을 수 있어요. 둘레의 반을 쓰는 게 열쇠예요.",
          items: [title("둘레로 빠진 변 찾기")] },
        { say: `직사각형을 그려요. 가로는 ${W}센티미터, 세로는 몰라요. 둘레는 ${P}센티미터예요.`,
          items: [rect(), T(X0 + W * U / 2, Y0 - 14, `${W}cm`, "blue", 28, "center"), T(X0 + W * U + 16, Y0 + H * U / 2 + 10, "?", "red", 34), T(RX, 170, `둘레 = ${P}cm`, "blue", 30)] },
        { say: "직사각형은 마주 보는 변의 길이가 같아요. 둘레를 한 바퀴 돌면 가로 두 번, 세로 두 번을 지나요.",
          items: [T(X0 + W * U / 2, Y0 + H * U + 34, `${W}cm`, "gray", 24, "center"), T(X0 - 30, Y0 + H * U / 2 + 10, "?", "gray", 28, "center"), T(RX, 220, "둘레 = 가로 + 세로 + 가로 + 세로", "gray", 24)] },
        { say: `그러니까 둘레의 반은 가로 하나와 세로 하나를 더한 길이예요. ${P}의 반은 ${jo(P / 2, "예요")}.`,
          items: [{ kind: "path", d: `M ${X0} ${Y0 + H * U} L ${X0} ${Y0} L ${X0 + W * U} ${Y0}`, stroke: "red", width: 6 }, T(RX, 275, `둘레의 반: ${P} ÷ 2 = ${P / 2} = 가로 + 세로`, "red", 26)] },
        { say: `가로 하나와 세로 하나가 ${jo(P / 2, "예요")}. 가로가 ${jo(W, "니까")} 세로는 ${P / 2} 빼기 ${W}, ${H}센티미터예요.`,
          items: [T(RX, 325, `세로 = ${P / 2} − ${W} = ${H}cm`, "green", 30), T(X0 + W * U + 16, Y0 + H * U / 2 + 10, `${H}cm`, "green", 28)] },
        { say: `확인해요. 가로 더하기 세로는 ${W} 더하기 ${H}, ${P / 2}. 두 번이면 ${jo(P, "이에요")}. 처음 둘레와 같아요.`,
          items: [T(RX, 380, `(${W} + ${H}) × 2 = ${P} ✓`, "green", 28)] },
        { say: "많이 하는 실수가 있어요. 둘레에서 가로를 바로 빼면 안 돼요. 가로는 두 번 들어 있으니까요. 꼭 반으로 나눈 다음에 빼요.",
          items: [T(RX, 440, `${P} − ${W} = ${P - W} ✗ (가로가 두 번)`, "red", 24)] },
        { say: "정리해요. 둘레를 2로 나눠 가로와 세로의 합을 구해요. 그 합에서 아는 변을 빼면 다른 변이에요. 두 변을 더해 두 번 하면 처음 둘레가 되는지 확인해요.", mood: "praise",
          items: [T(RX, 500, "둘레 ÷ 2 − 아는 변", "gold", 30)] },
        { say: `한 문제 풀어 봐요. 둘레가 ${CHK.P}센티미터인 직사각형의 가로가 ${CHK.w}센티미터예요. 세로는 몇 센티미터일까요?`, mood: "think",
          items: [],
          check: { question: `둘레 ${CHK.P}cm, 가로 ${CHK.w}cm인 직사각형의 세로는?`,
            options: [`${CHK.P - CHK.w}cm`, `${chk}cm`, `${CHK.P / 2}cm`], answer: 1,
            hint: "둘레를 반으로 나눈 다음 가로를 빼요.", sayHint: `${CHK.P}의 반은 ${jo(CHK.P / 2, "이에요")}. 거기서 ${jo(CHK.w, "을")} 빼요.`,
            right: `맞았어요! ${CHK.P} ÷ 2 − ${CHK.w} = ${chk}cm.`, sayRight: `맞았어요! ${CHK.P / 2} 빼기 ${jo(CHK.w, "은")} ${chk}센티미터예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/perimeter-source": (() => {
    const R = { w: 8, h: 5 }, SQ = 9, RH = 11, U = 22;
    const para = (x, y, w, h, sk, color) => ({ kind: "path", d: `M ${x + sk} ${y} L ${x + sk + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`, stroke: color, width: 3.5 });
    const CHK = { P: 60 };
    return {
      title: "사각형의 둘레",
      kicker: "6권 2단원 · 손글씨 개념",
      beats: [
        { say: "둘레는 도형의 바깥을 한 바퀴 돈 길이예요. 사각형마다 길이가 같은 변이 있어서, 그걸 알면 둘레를 쉽게 구해요.",
          items: [title("사각형의 둘레")] },
        { say: `직사각형이에요. 가로 ${R.w}센티미터, 세로 ${R.h}센티미터. 마주 보는 변의 길이가 같아요.`,
          items: [{ kind: "box", x: 90, y: 160, w: R.w * U, h: R.h * U, color: "blue" }, T(90 + R.w * U / 2, 148, `${R.w}`, "blue", 26, "center"), T(80, 160 + R.h * U / 2 + 8, `${R.h}`, "blue", 26, "right")] },
        { say: `가로 하나와 세로 하나를 더하면 ${R.w} 더하기 ${R.h}, ${R.w + R.h}. 그게 두 번 있으니 ${R.w + R.h} 곱하기 2, ${2 * (R.w + R.h)}센티미터예요.`,
          items: [T(90, 320, `(${R.w} + ${R.h}) × 2 = ${2 * (R.w + R.h)}cm`, "green", 28)] },
        { say: "평행사변형도 마주 보는 변의 길이가 같아요. 기울어져 있어도 둘레는 직사각형과 같은 방법으로 구해요.",
          items: [para(420, 160, R.w * U, R.h * U, 40, "green"), T(470 + R.w * U / 2, 148, `${R.w}`, "green", 26, "center"), T(430, 160 + R.h * U / 2 + 8, `${R.h}`, "green", 26, "right"), T(420, 320, `(${R.w} + ${R.h}) × 2 = ${2 * (R.w + R.h)}cm`, "green", 26)] },
        { say: `정사각형은 네 변이 모두 같아요. 한 변이 ${SQ}센티미터면 ${SQ} 곱하기 4, ${SQ * 4}센티미터.`,
          items: [{ kind: "box", x: 90, y: 380, w: 130, h: 130, color: "red" }, T(155, 370, `${SQ}`, "red", 26, "center"), T(240, 450, `${SQ} × 4 = ${SQ * 4}cm`, "red", 26)] },
        { say: `마름모도 네 변이 모두 같아요. 한 변이 ${RH}센티미터면 ${RH} 곱하기 4, ${RH * 4}센티미터.`,
          items: [{ kind: "path", d: "M 560 380 L 640 445 L 560 510 L 480 445 Z", stroke: "gold", width: 3.5 }, T(610, 405, `${RH}`, "gold", 26), T(660, 450, `${RH} × 4 = ${RH * 4}cm`, "gold", 26)] },
        { say: `거꾸로도 해요. 둘레가 ${jo(CHK.P, "인")} 정사각형의 한 변은 ${CHK.P} 나누기 4, ${CHK.P / 4}센티미터예요.`,
          items: [T(480, 545, `둘레 ${CHK.P} → 한 변 ${CHK.P} ÷ 4 = ${CHK.P / 4}`, "blue", 24)] },
        { say: "정리해요. 먼저 길이가 같은 변을 찾아요. 직사각형과 평행사변형은 가로 더하기 세로를 두 번, 정사각형과 마름모는 한 변을 네 번. 거꾸로는 2나 4로 나눠요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 둘레가 ${CHK.P}센티미터인 마름모의 한 변은 몇 센티미터일까요?`, mood: "think",
          items: [],
          check: { question: `둘레가 ${CHK.P}cm인 마름모의 한 변은?`,
            options: [`${CHK.P / 2}cm`, `${CHK.P / 4}cm`, `${CHK.P - 4}cm`], answer: 1,
            hint: "마름모는 네 변의 길이가 같아요.", sayHint: `네 변이 같으니 ${jo(CHK.P, "을")} 4로 나눠요.`,
            right: `맞았어요! ${CHK.P} ÷ 4 = ${CHK.P / 4}cm.`, sayRight: `맞았어요! 네 변이 같으니 ${CHK.P} 나누기 4, ${CHK.P / 4}센티미터예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/joined-perimeter-source": (() => {
    const s1 = 6, rw = 10, U = 26, X0 = 100, Y0 = 170;
    const perim = (s1 + rw) * 2 + s1 * 2;
    const CHK = { s: 7 }, chk = CHK.s * 6;
    const RX = 560;
    return {
      title: "붙인 도형의 둘레",
      kicker: "6권 2단원 · 손글씨 개념",
      beats: [
        { say: "도형 두 개를 붙이면, 맞닿은 변은 안쪽으로 숨어서 바깥 둘레에 들어가지 않아요. 이걸 조심하며 둘레를 구해요.",
          items: [title("붙인 도형의 둘레")] },
        { say: `한 변이 ${s1}센티미터인 정사각형과, 가로 ${rw}센티미터의 직사각형을 붙였어요. 직사각형의 세로는 정사각형과 맞닿아 있어요.`,
          items: [{ kind: "box", x: X0, y: Y0, w: s1 * U, h: s1 * U, color: "blue" }, { kind: "box", x: X0 + s1 * U, y: Y0, w: rw * U, h: s1 * U, color: "green" }, T(X0 + s1 * U / 2, Y0 - 12, `${s1}`, "blue", 26, "center"), T(X0 + s1 * U + rw * U / 2, Y0 - 12, `${rw}`, "green", 26, "center")] },
        { say: `맞닿은 변을 찾아요. 정사각형의 오른쪽 변과 직사각형의 왼쪽 변이에요. 두 도형에서 그 변의 길이는 같아요. 그래서 직사각형의 세로도 ${s1}센티미터예요.`,
          items: [{ kind: "line", x1: X0 + s1 * U, y1: Y0, x2: X0 + s1 * U, y2: Y0 + s1 * U, color: "red", width: 6 }, T(RX, 180, `맞닿은 변 = ${s1}cm`, "red", 28)] },
        { say: "맞닿은 변은 바깥에서 보이지 않아요. 둘레를 셀 때 빼요.",
          items: [{ kind: "x", cx: X0 + s1 * U, cy: Y0 + s1 * U / 2, r: 16, color: "red" }] },
        { say: `바깥만 따라 돌아요. 위는 ${s1} 더하기 ${rw}, 아래도 ${s1} 더하기 ${rw}. 왼쪽 ${s1}, 오른쪽 ${s1}.`,
          items: [{ kind: "path", d: `M ${X0} ${Y0} L ${X0 + (s1 + rw) * U} ${Y0} L ${X0 + (s1 + rw) * U} ${Y0 + s1 * U} L ${X0} ${Y0 + s1 * U} Z`, stroke: "gold", width: 5 }, T(RX, 240, `위·아래: (${s1} + ${rw}) × 2`, "blue", 26), T(RX, 285, `왼쪽·오른쪽: ${s1} × 2`, "blue", 26)] },
        { say: `모두 더해요. ${s1 + rw} 곱하기 2는 ${2 * (s1 + rw)}, ${s1} 곱하기 2는 ${2 * s1}. 둘레는 ${jo(perim, "이에요")}.`,
          items: [T(RX, 345, `${2 * (s1 + rw)} + ${2 * s1} = ${perim}cm`, "green", 30)] },
        { say: `두 도형의 둘레를 그냥 더하면 ${s1 * 4} 더하기 ${2 * (rw + s1)}, ${s1 * 4 + 2 * (rw + s1)}. 맞닿은 변 두 개만큼 더 커요. 숨은 변 ${jo(s1, "이")} 두 번 들어갔어요.`,
          items: [T(RX, 405, `${s1 * 4} + ${2 * (rw + s1)} − ${s1} × 2 = ${perim}`, "gold", 24)] },
        { say: "정리해요. 맞닿은 변을 찾고, 두 도형에서 그 변의 길이가 같다는 걸 써요. 바깥만 따라 돌며 더해요. 두 둘레를 더했다면 맞닿은 변을 두 번 빼요.", mood: "praise",
          items: [T(RX, 470, "맞닿은 변은 둘레에서 빼기", "gold", 26)] },
        { say: `한 문제 풀어 봐요. 한 변이 ${CHK.s}센티미터인 정사각형 두 개를 옆으로 붙였어요. 둘레는 몇 센티미터일까요?`, mood: "think",
          items: [],
          check: { question: `한 변이 ${CHK.s}cm인 정사각형 2개를 옆으로 붙인 도형의 둘레는?`,
            options: [`${CHK.s * 8}cm`, `${chk}cm`, `${CHK.s * 4}cm`], answer: 1,
            hint: "바깥에 보이는 변이 몇 개인지 세요.", sayHint: `정사각형 둘의 변은 여덟 개인데, 맞닿은 두 변은 숨어요. 바깥에는 ${CHK.s}센티미터짜리 변이 몇 개일까요?`,
            right: `맞았어요! 바깥 변 6개, ${CHK.s} × 6 = ${chk}cm.`, sayRight: `맞았어요! 바깥에 여섯 개, ${CHK.s} 곱하기 6은 ${chk}센티미터예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/cut-grid-perimeter-source": (() => {
    const C = 5, R = 3, S = 50, X0 = 100, Y0 = 170;
    const cut = [[0, 4], [0, 3], [1, 4]];
    const full = (C + R) * 2;
    const L = { w: 11, h: 4 };
    const cells = (list, fill) => list.map(([r, c]) => ({ kind: "fill", x: X0 + c * S + 3, y: Y0 + r * S + 3, w: S - 6, h: S - 6, fill }));
    const RX = 560;
    return {
      title: "잘라 만든 도형과 모눈 도형의 둘레",
      kicker: "6권 2단원 · 손글씨 개념",
      beats: [
        { say: "모눈 직사각형의 모서리에서 칸을 떼어 계단처럼 만들면, 둘레가 줄어들까요? 들어간 변을 밖으로 밀어 보면 알 수 있어요.",
          items: [title("떼어 낸 모양의 둘레")] },
        { say: `가로 ${KO[C]} 칸, 세로 ${KO[R]} 칸의 직사각형이에요. 한 칸의 변은 1센티미터. 둘레는 ${C} 더하기 ${R}, 두 번 해서 ${jo(full, "이에요")}.`,
          items: [{ kind: "grid", x: X0, y: Y0, cols: C, rows: R, cell: S, color: "gray" }, { kind: "box", x: X0, y: Y0, w: C * S, h: R * S, color: "blue" }, T(RX, 180, `(${C} + ${R}) × 2 = ${full}cm`, "blue", 28)] },
        { say: "오른쪽 위 모서리에서 칸 세 개를 계단 모양으로 떼어 내요.",
          items: [...cells(cut, "#fffdf7"), { kind: "path", d: `M ${X0 + 3 * S} ${Y0} L ${X0 + 3 * S} ${Y0 + S} L ${X0 + 4 * S} ${Y0 + S} L ${X0 + 4 * S} ${Y0 + 2 * S} L ${X0 + 5 * S} ${Y0 + 2 * S}`, stroke: "red", width: 4 }] },
        { say: "칸이 줄었으니 둘레도 줄었을까요? 계단의 변을 하나씩 밖으로 밀어 봐요. 가로로 놓인 변은 위로, 세로로 놓인 변은 오른쪽으로.",
          items: [{ kind: "arrow", x1: X0 + 3.5 * S, y1: Y0 + S - 6, x2: X0 + 3.5 * S, y2: Y0 + 8, color: "gold", width: 3 }, { kind: "arrow", x1: X0 + 4.5 * S, y1: Y0 + 2 * S - 6, x2: X0 + 4.5 * S, y2: Y0 + 8, color: "gold", width: 3 }, { kind: "arrow", x1: X0 + 3 * S + 6, y1: Y0 + 0.5 * S, x2: X0 + 5 * S - 8, y2: Y0 + 0.5 * S, color: "gold", width: 3 }, { kind: "arrow", x1: X0 + 4 * S + 6, y1: Y0 + 1.5 * S, x2: X0 + 5 * S - 8, y2: Y0 + 1.5 * S, color: "gold", width: 3 }] },
        { say: `밀고 나면 처음 직사각형의 테두리와 꼭 같아져요. 계단의 가로 변을 모으면 위쪽 빈 부분을, 세로 변을 모으면 오른쪽 빈 부분을 채워요. 그래서 둘레는 그대로 ${full}센티미터예요.`,
          items: [T(RX, 240, `떼어 내도 둘레 = ${full}cm`, "green", 30)] },
        { say: "하나씩 세어 확인해요. 바깥 테두리를 따라 한 칸씩 세면 열여섯 칸이에요.",
          items: [T(RX, 295, "한 칸씩 세면 16 ✓", "green", 26)] },
        { say: "단, 모서리가 아니라 변의 한가운데를 파 들어가면 달라요. 안으로 들어간 깊이만큼 양쪽 벽이 생겨서, 깊이의 두 배가 늘어요.",
          items: [T(RX, 360, "가운데를 파면 → 깊이 × 2 늘어요", "red", 24)] },
        { say: `직사각형을 잘라 가장 큰 정사각형을 만들 때는, 짧은 변이 정사각형의 한 변이에요. 가로 ${L.w}, 세로 ${jo(L.h, "인")} 직사각형에서 가장 큰 정사각형의 한 변은 ${jo(L.h, "예요")}.`,
          items: [T(RX, 420, `가로 ${L.w}, 세로 ${L.h} → 가장 큰 정사각형 한 변 ${L.h}`, "blue", 22)] },
        { say: "정리해요. 모서리를 계단처럼 떼어 낸 모양은 들어간 변을 밖으로 밀면 처음 직사각형과 둘레가 같아요. 변의 가운데를 파 들어가면 깊이의 두 배가 늘어요.", mood: "praise",
          items: [T(RX, 480, "모서리는 그대로, 가운데는 늘어요", "gold", 24)] },
        { say: "한 문제 풀어 봐요. 가로 여섯 칸, 세로 두 칸인 직사각형에서 왼쪽 아래 모서리 칸 하나를 떼어 냈어요. 둘레는 몇 센티미터일까요? 한 칸은 1센티미터예요.", mood: "think",
          items: [],
          check: { question: "가로 6칸, 세로 2칸 직사각형에서 모서리 칸 1개를 떼면 둘레는? (한 칸 1cm)",
            options: ["14cm", "16cm", "18cm"], answer: 1,
            hint: "모서리를 떼어도 들어간 두 변을 밖으로 밀면 처음 모양이에요.", sayHint: "처음 직사각형의 둘레는 6 더하기 2를 두 번, 16이에요. 모서리를 떼면요?",
            right: "맞았어요! 처음과 같은 (6 + 2) × 2 = 16cm.", sayRight: "맞았어요! 모서리를 떼어도 둘레는 그대로 16센티미터예요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-06/bent-perimeter-source": (() => {
    const W = 9, H = 6, U = 34, X0 = 100, Y0 = 160;
    const steps = [[0, 0], [3, 0], [3, 2], [6, 2], [6, 4], [9, 4], [9, 6], [0, 6]];
    const pt = ([x, y]) => `${X0 + x * U} ${Y0 + y * U}`;
    const perim = (W + H) * 2;
    const notch = { d: 2 };
    const CHK = { w: 10, h: 7 }, chk = (CHK.w + CHK.h) * 2;
    const RX = 520;
    return {
      title: "직각으로 꺾인 도형의 둘레",
      kicker: "6권 2단원 · 손글씨 개념",
      beats: [
        { say: "계단처럼 직각으로 여러 번 꺾인 도형의 둘레를, 변을 하나하나 몰라도 구하는 법을 배워요.",
          items: [title("꺾인 도형의 둘레")] },
        { say: `계단 모양 도형이에요. 전체 가로는 ${W}센티미터, 전체 세로는 ${H}센티미터. 계단의 변 하나하나의 길이는 모른다고 생각해요.`,
          items: [{ kind: "path", d: `M ${steps.map(pt).join(" L ")} Z`, stroke: "blue", width: 4 }, T(X0 + W * U / 2, Y0 + H * U + 36, `${W}cm`, "blue", 26, "center"), T(X0 - 14, Y0 + H * U / 2, `${H}cm`, "blue", 26, "right")] },
        { say: "계단의 가로 변을 모두 위로 올려 보세요. 맨 위 한 줄에 나란히 서면 전체 가로와 같아져요.",
          items: [{ kind: "arrow", x1: X0 + 4.5 * U, y1: Y0 + 2 * U - 4, x2: X0 + 4.5 * U, y2: Y0 + 6, color: "gold", width: 3 }, { kind: "arrow", x1: X0 + 7.5 * U, y1: Y0 + 4 * U - 4, x2: X0 + 7.5 * U, y2: Y0 + 6, color: "gold", width: 3 }, { kind: "line", x1: X0, y1: Y0 - 3, x2: X0 + W * U, y2: Y0 - 3, color: "gold", width: 2, dash: true }] },
        { say: "계단의 세로 변을 모두 오른쪽으로 밀어 보세요. 오른쪽 한 줄에 서면 전체 세로와 같아져요.",
          items: [{ kind: "arrow", x1: X0 + 3 * U + 4, y1: Y0 + 1 * U, x2: X0 + W * U - 6, y2: Y0 + 1 * U, color: "gold", width: 3 }, { kind: "arrow", x1: X0 + 6 * U + 4, y1: Y0 + 3 * U, x2: X0 + W * U - 6, y2: Y0 + 3 * U, color: "gold", width: 3 }, { kind: "line", x1: X0 + W * U + 3, y1: Y0, x2: X0 + W * U + 3, y2: Y0 + H * U, color: "gold", width: 2, dash: true }] },
        { say: `그러면 가로 ${W}, 세로 ${jo(H, "인")} 직사각형과 둘레가 같아요. ${W} 더하기 ${H}, 두 번 해서 ${perim}센티미터예요.`,
          items: [T(RX, 200, `(${W} + ${H}) × 2 = ${perim}cm`, "green", 30)] },
        { say: "계단이 몇 개든 상관없어요. 바깥으로 꺾여 나가는 계단은 언제나 큰 직사각형의 둘레와 같아요.",
          items: [T(RX, 255, "계단 수와 상관없이 같아요", "gold", 26)] },
        { say: `조심할 곳이 있어요. 한 변의 가운데가 안으로 쏙 들어간 홈이 있으면, 홈의 양쪽 벽은 밀어도 채워지지 않아요. 깊이가 ${notch.d}센티미터면 ${notch.d} 곱하기 2만큼 더 더해요.`,
          items: [{ kind: "path", d: `M ${RX} 340 L ${RX + 80} 340 L ${RX + 80} 380 L ${RX + 130} 380 L ${RX + 130} 340 L ${RX + 210} 340`, stroke: "red", width: 4 }, T(RX, 420, `안으로 들어간 홈 → 깊이 × 2 더하기`, "red", 24)] },
        { say: "정리해요. 꺾인 가로 변은 위로, 세로 변은 옆으로 밀어 큰 직사각형을 만들어요. 가로 더하기 세로를 두 번 해요. 안으로 파인 홈이 있으면 깊이의 두 배를 더해요.", mood: "praise",
          items: [T(RX, 480, "밀어서 큰 직사각형!", "gold", 30)] },
        { say: `한 문제 풀어 봐요. 전체 가로 ${CHK.w}센티미터, 전체 세로 ${CHK.h}센티미터 안에 계단처럼 꺾인 도형이 있어요. 둘레는 몇 센티미터일까요?`, mood: "think",
          items: [],
          check: { question: `전체 가로 ${CHK.w}cm, 세로 ${CHK.h}cm인 계단 모양 도형의 둘레는?`,
            options: [`${CHK.w + CHK.h}cm`, `${chk}cm`, `${CHK.w * CHK.h}cm`], answer: 1,
            hint: "꺾인 변을 밀면 큰 직사각형이 돼요.", sayHint: `가로 ${CHK.w}, 세로 ${jo(CHK.h, "인")} 직사각형의 둘레와 같아요. 더해서 두 번 해요.`,
            right: `맞았어요! (${CHK.w} + ${CHK.h}) × 2 = ${chk}cm.`, sayRight: `맞았어요! ${CHK.w + CHK.h}의 두 배, ${chk}센티미터예요. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,"book-06/inclusive-range-count": (() => {
    const a = 3, b = 9, n = b - a + 1, X = (v) => 110 + (v - 1) * 80, Y = 300;
    const A2 = 26, B2 = 73;
    const CHK = { a: 14, b: 52 }, chk = CHK.b - CHK.a + 1;
    return {
      title: "처음과 끝을 넣어 수를 세어요",
      kicker: "6권 3단원 · 손글씨 개념",
      beats: [
        { say: "몇부터 몇까지 수가 모두 몇 개일까요? 끝에서 처음을 빼기만 하면 하나가 모자라요. 왜 그런지 작은 수로 직접 세어 봐요.",
          items: [title("처음부터 끝까지 몇 개?")] },
        { say: `${a}부터 ${b}까지 수를 늘어놓아요.`,
          items: Array.from({ length: n }, (_, i) => ({ kind: "node", cx: X(a + i), cy: Y, r: 30, value: a + i, color: "blue", size: 30 })) },
        { say: `하나씩 세어요. ${Array.from({ length: n }, (_, i) => i + 1).join(", ")}. ${KO[n]} 개예요.`,
          items: Array.from({ length: n }, (_, i) => T(X(a + i), Y + 64, String(i + 1), "green", 26, "center")) },
        { say: `${b} 빼기 ${jo(a, "은")} ${jo(b - a, "이에요")}. 하나가 모자라요. 뺄셈은 수 사이의 간격을 세기 때문이에요.`,
          items: [...Array.from({ length: n - 1 }, (_, i) => ({ kind: "path", d: `M ${X(a + i) + 6} ${Y - 34} Q ${X(a + i) + 40} ${Y - 70} ${X(a + i + 1) - 6} ${Y - 34}`, stroke: "red", width: 2.5 })), T(110, 420, `${b} − ${a} = ${b - a}  → 간격의 수`, "red", 28)] },
        { say: `간격은 ${KO[b - a]} 개, 수는 ${KO[n]} 개. 수는 간격보다 하나 많아요. 처음 수를 빠뜨렸으니 1을 더해요.`,
          items: [T(110, 470, `수의 개수 = ${b} − ${a} + 1 = ${n}`, "green", 30)] },
        { say: `큰 수도 같은 방법이에요. ${A2}부터 ${B2}까지는 ${B2} 빼기 ${A2} 더하기 1, ${B2 - A2 + 1}개예요.`,
          items: [T(110, 530, `${A2} ~ ${B2}: ${B2} − ${A2} + 1 = ${B2 - A2 + 1}개`, "blue", 28)] },
        { say: "정리해요. 끝 수에서 처음 수를 빼면 간격의 수예요. 처음 수와 끝 수를 모두 세니까 1을 더해요. 헷갈리면 작은 수로 직접 세어 확인해요.", mood: "praise",
          items: [T(640, 470, "끝 − 처음 + 1", "gold", 34)] },
        { say: `한 문제 풀어 봐요. ${CHK.a}부터 ${CHK.b}까지 수는 모두 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a}부터 ${CHK.b}까지 수는 모두 몇 개?`,
            options: [`${chk - 1}개`, `${chk}개`, `${chk + 1}개`], answer: 1,
            hint: "끝 − 처음 + 1이에요.", sayHint: `${CHK.b} 빼기 ${jo(CHK.a, "는")} ${jo(CHK.b - CHK.a, "이에요")}. 처음 수까지 세려면요?`,
            right: `맞았어요! ${CHK.b} − ${CHK.a} + 1 = ${chk}개.`, sayRight: `맞았어요! ${CHK.b - CHK.a}에 1을 더해 ${chk}개예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/multiplication-source": (() => {
    const A = 47, k = 6, t = Math.floor(A / 10) * 10, o = A % 10;
    const X0 = 120, Y0 = 190, W1 = 300, W2 = 90, H = 110;
    const ADD = [64, 27, 36, 73];
    const CHK = { a: 38, k: 4 };
    return {
      title: "타일 곱셈과 간편 계산",
      kicker: "6권 3단원 · 손글씨 개념",
      beats: [
        { say: "두 자리 수에 한 자리 수를 곱할 때, 수를 십의 자리와 일의 자리로 갈라 타일처럼 그리면 쉽게 계산할 수 있어요.",
          items: [title("타일 곱셈")] },
        { say: `${A} 곱하기 ${jo(k, "을")} 계산해요. ${jo(A, "을")} ${jo(t, "과")} ${jo(o, "로")} 갈라요.`,
          items: [T(560, 170, `${A} × ${k}`, "ink", 40), T(560, 220, `${A} = ${t} + ${o}`, "blue", 30)] },
        { say: `직사각형 타일을 그려요. 가로는 ${jo(t, "과")} ${jo(o, "로")} 나누고, 세로는 ${jo(k, "이에요")}.`,
          items: [{ kind: "box", x: X0, y: Y0, w: W1, h: H, color: "blue" }, { kind: "box", x: X0 + W1, y: Y0, w: W2, h: H, color: "green" }, T(X0 + W1 / 2, Y0 - 12, String(t), "blue", 28, "center"), T(X0 + W1 + W2 / 2, Y0 - 12, String(o), "green", 28, "center"), T(X0 - 14, Y0 + H / 2 + 10, String(k), "ink", 28, "right")] },
        { say: `큰 칸은 ${t} 곱하기 ${k}, ${jo(t * k, "이에요")}. 작은 칸은 ${o} 곱하기 ${k}, ${jo(o * k, "예요")}.`,
          items: [T(X0 + W1 / 2, Y0 + H / 2 + 12, String(t * k), "blue", 34, "center"), T(X0 + W1 + W2 / 2, Y0 + H / 2 + 12, String(o * k), "green", 30, "center")] },
        { say: `두 칸을 더해요. ${t * k} 더하기 ${jo(o * k, "는")} ${jo(A * k, "예요")}. 그래서 ${A} 곱하기 ${jo(k, "은")} ${jo(A * k, "예요")}.`,
          items: [T(560, 280, `${t * k} + ${o * k} = ${A * k}`, "green", 32)] },
        { say: "여러 수를 더할 때는 딱 떨어지는 짝을 먼저 찾아요. 일의 자리끼리 더해 10이 되는 짝이요.",
          items: [T(110, 400, ADD.join(" + "), "ink", 36)] },
        { say: "일의 자리끼리 더해 10이 되는 짝을 찾아요. 64와 36이 짝이에요. 4 더하기 6은 10, 64 더하기 36은 100. 27과 73도 짝, 더하면 100.",
          items: [{ kind: "arrow", x1: 140, y1: 420, x2: 330, y2: 420, bend: -30, color: "red", width: 2.5 }, { kind: "arrow", x1: 235, y1: 420, x2: 425, y2: 420, bend: -50, color: "gold", width: 2.5 }, T(110, 470, "(64 + 36) + (27 + 73) = 100 + 100 = 200", "green", 28)] },
        { say: "정리해요. 두 자리 수는 십의 자리와 일의 자리로 갈라 칸마다 곱하고 더해요. 여러 수를 더할 때는 딱 떨어지는 짝부터 묶어요.", mood: "praise",
          items: [T(560, 520, "가르고 곱하고 더하기", "gold", 28)] },
        { say: `한 문제 풀어 봐요. ${CHK.a} 곱하기 ${jo(CHK.k, "는")} 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a} × ${CHK.k}는 얼마일까요?`,
            options: [String(CHK.a * CHK.k - 10), String(CHK.a * CHK.k), String(CHK.a * CHK.k + 10)], answer: 1,
            hint: "30과 8로 갈라 따로 곱해요.", sayHint: `30 곱하기 4는 120, 8 곱하기 4는 32. 더하면요?`,
            right: `맞았어요! 120 + 32 = ${CHK.a * CHK.k}.`, sayRight: `맞았어요! 120과 32를 더해 ${jo(CHK.a * CHK.k, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/same-factor-source": (() => {
    const F = 7, a = 6, b = 4;
    const N = 9, M = 13, N99 = 99, M99 = 6;
    const CHK = { f: 6, a: 7, b: 3 }, chk = CHK.f * (CHK.a + CHK.b);
    return {
      title: "같은 수로 묶기와 9에 가까운 수",
      kicker: "6권 3단원 · 손글씨 개념",
      beats: [
        { say: "식에 같은 수가 여러 번 곱해져 있으면, 곱하는 수끼리 먼저 더해 한 번에 곱할 수 있어요. 9나 99처럼 10이나 100에 가까운 수는 바꿔서 계산해요.",
          items: [title("같은 수로 묶기")] },
        { say: `${F} 곱하기 ${a} 더하기 ${F} 곱하기 ${jo(b, "를")} 계산해요.`,
          items: [T(80, 170, `${F} × ${a} + ${F} × ${b}`, "ink", 40)] },
        { say: `${jo(F, "이")} ${KO[a]} 번, 그리고 ${jo(F, "이")} 또 ${KO[b]} 번이에요. 모두 ${jo(F, "이")} 몇 번일까요? ${a} 더하기 ${b}, ${KO[a + b]} 번이에요.`,
          items: [...Array.from({ length: a }, (_, i) => ({ kind: "node", cx: 100 + i * 52, cy: 250, r: 22, value: F, color: "blue", size: 22 })), ...Array.from({ length: b }, (_, i) => ({ kind: "node", cx: 100 + (a + i) * 52, cy: 250, r: 22, value: F, color: "green", size: 22 }))] },
        { say: `그래서 ${F} 곱하기 ${a + b}, ${jo(F * (a + b), "이에요")}. 따로 곱해 더해도 ${F * a} 더하기 ${F * b}, 똑같이 ${jo(F * (a + b), "이에요")}.`,
          items: [T(80, 320, `= ${F} × (${a} + ${b}) = ${F} × ${a + b} = ${F * (a + b)}`, "green", 30)] },
        { say: `이번엔 ${N} 곱하기 ${jo(M, "을")} 해요. 9는 10보다 1 작아요. ${jo(M, "을")} 10번 하면 ${M * 10}, 거기서 ${jo(M, "을")} 한 번 빼면 ${jo(M * 9, "이에요")}.`,
          items: [T(80, 400, `${N} × ${M} = 10 × ${M} − ${M} = ${M * 10} − ${M} = ${M * 9}`, "blue", 28)] },
        { say: `99도 같아요. ${N99} 곱하기 ${jo(M99, "은")} 100 곱하기 ${M99}에서 ${jo(M99, "을")} 빼요. 600 빼기 6, ${jo(N99 * M99, "예요")}.`,
          items: [T(80, 450, `${N99} × ${M99} = 100 × ${M99} − ${M99} = ${N99 * M99}`, "blue", 28)] },
        { say: "곱하지 않고 혼자 있는 같은 수는 곱하기 1로 보면 돼요. 8 곱하기 9 더하기 8은 8 곱하기 10, 80이에요.",
          items: [T(80, 510, "8 × 9 + 8 = 8 × (9 + 1) = 80", "gold", 28)] },
        { say: "정리해요. 여러 번 나오는 같은 수를 찾아, 곱하는 수끼리 먼저 더해요. 9는 10 빼기 1, 99는 100 빼기 1로 바꿔 곱한 뒤 빼요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. ${CHK.f} 곱하기 ${CHK.a} 더하기 ${CHK.f} 곱하기 ${jo(CHK.b, "은")} 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.f} × ${CHK.a} + ${CHK.f} × ${jo(CHK.b, "는")}?`,
            options: [String(chk - CHK.f), String(chk), String(CHK.f * CHK.a * CHK.b)], answer: 1,
            hint: `${jo(CHK.f, "이")} 모두 몇 번인지 세요.`, sayHint: `${jo(CHK.f, "이")} ${CHK.a}번, 또 ${CHK.b}번. 모두 열 번이에요.`,
            right: `맞았어요! ${CHK.f} × (${CHK.a} + ${CHK.b}) = ${CHK.f} × 10 = ${chk}.`, sayRight: `맞았어요! ${jo(CHK.f, "이")} 열 번이라 ${jo(chk, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/consecutive-source": (() => {
    const a = 11, b = 18, n = b - a + 1, pair = a + b, sum = pair * n / 2;
    const c = 21, d = 27, m = d - c + 1, mid = (c + d) / 2;
    const CHK = { a: 5, b: 14 }, cn = CHK.b - CHK.a + 1, csum = (CHK.a + CHK.b) * cn / 2;
    return {
      title: "수의 개수와 연속수의 합",
      kicker: "6권 3단원 · 손글씨 개념",
      beats: [
        { say: "11, 12, 13처럼 1씩 커지는 수를 연속수라고 해요. 연속수를 모두 더할 때, 하나씩 더하지 않고 빠르게 구하는 법을 배워요.",
          items: [title("연속수의 합")] },
        { say: `${a}부터 ${b}까지 더해요. 먼저 개수를 세요. 끝 빼기 처음 더하기 1, ${b} 빼기 ${a} 더하기 1, ${KO[n]} 개예요.`,
          items: [T(80, 170, Array.from({ length: n }, (_, i) => a + i).join(" + "), "ink", 30), T(80, 220, `개수: ${b} − ${a} + 1 = ${n}`, "blue", 28)] },
        { say: `${KO[n]} 개, 짝수 개예요. 처음과 끝을 짝지어요. ${jo(a, "과")} ${b}, ${jo(a + 1, "와")} ${b - 1}. 짝마다 합이 ${jo(pair, "예요")}.`,
          items: [T(80, 280, `${a} + ${b} = ${a + 1} + ${b - 1} = … = ${pair}`, "red", 28)] },
        { say: `짝은 ${n}의 반, ${KO[n / 2]} 개. ${pair} 곱하기 ${n / 2}, ${jo(sum, "이에요")}.`,
          items: [T(80, 330, `${pair} × ${n / 2} = ${sum}`, "green", 32)] },
        { say: `홀수 개일 때는 가운데 수를 써요. ${c}부터 ${d}까지는 ${KO[m]} 개, 가운데 수는 ${jo(mid, "예요")}. 가운데 수가 모든 수의 평균이라서, 가운데 수 곱하기 개수예요.`,
          items: [T(80, 410, Array.from({ length: m }, (_, i) => c + i).join(" + "), "ink", 28), T(80, 460, `가운데 ${mid} × 개수 ${m} = ${mid * m}`, "green", 30)] },
        { say: "어느 경우든 처음과 끝을 더해 개수를 곱한 뒤 반으로 나눠도 같아요. 처음 더하기 끝, 곱하기 개수, 나누기 2.",
          items: [T(80, 530, "(처음 + 끝) × 개수 ÷ 2", "gold", 30)] },
        { say: "정리해요. 개수는 끝 빼기 처음 더하기 1. 짝수 개는 처음과 끝을 짝지어 짝의 합 곱하기 짝의 수, 홀수 개는 가운데 수 곱하기 개수예요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. ${CHK.a}부터 ${CHK.b}까지 모두 더하면 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a} + ${CHK.a + 1} + … + ${CHK.b}는?`,
            options: [String(csum - CHK.a), String(csum), String((CHK.a + CHK.b) * cn)], answer: 1,
            hint: "개수를 세고, 처음과 끝을 짝지어요.", sayHint: `개수는 ${CHK.b} 빼기 ${CHK.a} 더하기 1, 열 개예요. 짝은 다섯 개, 짝의 합은 ${jo(CHK.a + CHK.b, "예요")}.`,
            right: `맞았어요! ${CHK.a + CHK.b} × ${cn / 2} = ${csum}.`, sayRight: `맞았어요! ${CHK.a + CHK.b} 곱하기 5, ${jo(csum, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/even-odd-order-source": (() => {
    const K = 12, ev = 2 * K, od = 2 * K - 1, E2 = 58, O2 = 41;
    const X = (i) => 110 + i * 92;
    const CHK = 23, chk = 2 * CHK - 1;
    return {
      title: "짝수와 홀수의 순서",
      kicker: "6권 3단원 · 손글씨 개념",
      beats: [
        { say: "몇 번째 짝수, 몇 번째 홀수를 늘어놓지 않고 바로 구하는 법을 배워요. 거꾸로 어떤 수가 몇 번째인지도 찾아요.",
          items: [title("짝수와 홀수의 순서")] },
        { say: "짝수를 차례로 써요. 2, 4, 6, 8, 10. 그 아래에 몇 번째인지 써요.",
          items: [...[1, 2, 3, 4, 5].flatMap((i) => [{ kind: "node", cx: X(i - 1), cy: 200, r: 30, value: 2 * i, color: "blue", size: 30 }, T(X(i - 1), 260, `${i}번째`, "gray", 20, "center")])] },
        { say: "짝수는 2단 곱셈의 답이에요. 첫째는 2 곱하기 1, 둘째는 2 곱하기 2. 그래서 몇 번째 짝수는 2 곱하기 몇이에요.",
          items: [T(600, 200, "□번째 짝수 = 2 × □", "blue", 28)] },
        { say: `${K}번째 짝수는 2 곱하기 ${K}, ${jo(ev, "예요")}.`,
          items: [T(600, 250, `${K}번째 짝수 = ${ev}`, "green", 28)] },
        { say: "홀수를 짝수 바로 아래에 써요. 1, 3, 5, 7, 9. 같은 번째의 짝수보다 늘 1 작아요.",
          items: [...[1, 2, 3, 4, 5].map((i) => ({ kind: "node", cx: X(i - 1), cy: 330, r: 30, value: 2 * i - 1, color: "red", size: 30 }))] },
        { say: `그래서 몇 번째 홀수는 2 곱하기 몇 빼기 1이에요. ${K}번째 홀수는 ${ev} 빼기 1, ${jo(od, "이에요")}.`,
          items: [T(600, 330, "□번째 홀수 = 2 × □ − 1", "red", 28), T(600, 380, `${K}번째 홀수 = ${od}`, "green", 28)] },
        { say: `거꾸로도 해요. ${jo(E2, "은")} 몇 번째 짝수일까요? 2로 나누면 ${E2 / 2}, ${E2 / 2}번째예요. ${jo(O2, "은")} 몇 번째 홀수일까요? 1을 더해 ${O2 + 1}, 2로 나누면 ${O2 / 2 + 0.5}번째예요.`,
          items: [T(110, 450, `${E2} ÷ 2 = ${E2 / 2}번째 짝수,  (${O2} + 1) ÷ 2 = ${(O2 + 1) / 2}번째 홀수`, "blue", 26)] },
        { say: "정리해요. 몇 번째 짝수는 2 곱하기 몇, 몇 번째 홀수는 거기서 1을 빼요. 거꾸로는 짝수를 2로 나누고, 홀수는 1을 더해 2로 나눠요.", mood: "praise",
          items: [T(110, 520, "짝수 2×□,  홀수 2×□ − 1", "gold", 30)] },
        { say: `한 문제 풀어 봐요. ${CHK}번째 홀수는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK}번째 홀수는?`,
            options: [String(CHK * 2), String(chk), String(CHK)], answer: 1,
            hint: "같은 번째의 짝수보다 1 작아요.", sayHint: `${CHK}번째 짝수는 ${jo(2 * CHK, "이에요")}. 홀수는 거기서 1을 빼요.`,
            right: `맞았어요! 2 × ${CHK} − 1 = ${chk}.`, sayRight: `맞았어요! ${2 * CHK}에서 1을 빼 ${jo(chk, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/number-and-digit-count": (() => {
    const a = 8, b = 15, nums = b - a + 1, one = 9 - a + 1, two = b - 10 + 1, digits = one * 1 + two * 2;
    const X = (i) => 90 + i * 100;
    const CHK = { a: 6, b: 13 }, cOne = 9 - CHK.a + 1, cTwo = CHK.b - 10 + 1, chk = cOne + cTwo * 2;
    return {
      title: "수의 개수와 쓴 숫자를 구별해요",
      kicker: "6권 4단원 · 손글씨 개념",
      beats: [
        { say: "수와 숫자는 달라요. 15는 수 하나지만, 쓸 때는 숫자 1과 5, 두 개를 써요. 수의 개수와 쓴 숫자의 개수를 구별해 세요.",
          items: [title("수의 개수와 숫자의 개수")] },
        { say: `${a}부터 ${b}까지 차례로 써요.`,
          items: Array.from({ length: nums }, (_, i) => T(X(i), 200, String(a + i), "blue", 40, "center")) },
        { say: `수의 개수는 끝 빼기 처음 더하기 1, ${b} 빼기 ${a} 더하기 1, ${KO[nums]} 개예요.`,
          items: [T(90, 290, `수: ${b} − ${a} + 1 = ${nums}개`, "blue", 30)] },
        { say: `이번엔 숫자를 세요. 한 자리 수 ${a}, 9는 숫자를 하나씩 써요. ${KO[one]} 개.`,
          items: [...Array.from({ length: one }, (_, i) => ({ kind: "ring", cx: X(i), cy: 186, r: 30, color: "green" })), T(90, 350, `한 자리 수 ${one}개 × 1 = ${one}`, "green", 28)] },
        { say: `두 자리 수 10부터 ${b}까지는 숫자를 두 개씩 써요. 두 자리 수는 ${KO[two]} 개, 숫자는 ${two} 곱하기 2, ${KO[two * 2] || two * 2} 개예요.`,
          items: [...Array.from({ length: two }, (_, i) => ({ kind: "box", x: X(one + i) - 36, y: 160, w: 72, h: 54, color: "red" })), T(90, 400, `두 자리 수 ${two}개 × 2 = ${two * 2}`, "red", 28)] },
        { say: `쓴 숫자는 모두 ${one} 더하기 ${two * 2}, ${digits}개예요. 수는 ${KO[nums]} 개인데 숫자는 ${digits}개. 달라요.`,
          items: [T(90, 460, `숫자: ${one} + ${two * 2} = ${digits}개  (수는 ${nums}개)`, "gold", 30)] },
        { say: "세 자리 수가 섞이면 세 자리 묶음도 따로 세어 3을 곱해요. 자리 수가 같은 수끼리 묶는 게 핵심이에요.",
          items: [T(90, 520, "자리 수끼리 묶어 × 자리 수", "gold", 28)] },
        { say: "정리해요. 수의 개수는 끝 빼기 처음 더하기 1. 숫자의 개수는 한 자리, 두 자리, 세 자리 수로 나눠, 묶음마다 수의 개수에 자리 수를 곱해 더해요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. ${CHK.a}부터 ${CHK.b}까지 차례로 쓰면 숫자를 모두 몇 개 쓸까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.a}부터 ${CHK.b}까지 차례로 쓸 때 쓴 숫자는 모두 몇 개?`,
            options: [`${CHK.b - CHK.a + 1}개`, `${chk}개`, `${(CHK.b - CHK.a + 1) * 2}개`], answer: 1,
            hint: "한 자리 수와 두 자리 수를 나눠 세요.", sayHint: `한 자리 수는 ${CHK.a}부터 9까지 ${KO[cOne]} 개, 두 자리 수는 10부터 ${CHK.b}까지 ${KO[cTwo]} 개예요.`,
            right: `맞았어요! ${cOne} + ${cTwo} × 2 = ${chk}개.`, sayRight: `맞았어요! ${cOne} 더하기 ${cTwo * 2}, 숫자는 ${chk}개예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/digit-sign-source": (() => {
    const a = 1, b = 40, D = 3, ones = Array.from({ length: b }, (_, i) => i + 1).filter((n) => n % 10 === D), tens = Array.from({ length: b }, (_, i) => i + 1).filter((n) => Math.floor(n / 10) === D);
    const both = ones.filter((n) => tens.includes(n)), withD = [...new Set([...ones, ...tens])].sort((x, y) => x - y);
    const writes = ones.length + tens.length;
    const CHK = { b: 30, d: 2 }, cOnes = Array.from({ length: CHK.b }, (_, i) => i + 1).filter((n) => n % 10 === CHK.d), cTens = Array.from({ length: CHK.b }, (_, i) => i + 1).filter((n) => Math.floor(n / 10) === CHK.d), cWith = new Set([...cOnes, ...cTens]).size;
    const RX = 560;
    return {
      title: "수와 숫자의 개수",
      kicker: "6권 4단원 · 손글씨 개념",
      beats: [
        { say: `1부터 ${b}까지 쓸 때, 숫자 ${jo(D, "이")} 몇 번 나오는지, 그리고 ${jo(D, "이")} 들어간 수는 몇 개인지 세어요. 둘은 다를 수 있어요.`,
          items: [title(`숫자 ${D} 찾기`)] },
        { say: `먼저 일의 자리에 ${jo(D, "이")} 있는 수를 찾아요. ${jo(ones.join(", "), "이에요")}. 10마다 하나씩, ${KO[ones.length]} 개.`,
          items: [T(80, 170, `일의 자리 ${D}: ${ones.join(", ")}`, "blue", 28)] },
        { say: `다음은 십의 자리에 ${jo(D, "이")} 있는 수. 30부터 39까지, ${KO[tens.length]} 개예요.`,
          items: [T(80, 225, `십의 자리 ${D}: ${tens[0]} ~ ${tens.at(-1)}`, "green", 28)] },
        { say: `숫자 ${jo(D, "을")} 쓰는 횟수는 둘을 더해 ${ones.length} 더하기 ${tens.length}, ${writes}번이에요.`,
          items: [T(80, 285, `쓴 횟수: ${ones.length} + ${tens.length} = ${writes}번`, "gold", 28)] },
        { say: `그런데 ${jo(both[0], "은")} 두 목록에 다 있어요. 일의 자리에도 십의 자리에도 ${jo(D, "이")} 있으니까요. ${jo(D, "이")} 들어간 수를 셀 때는 ${jo(both[0], "을")} 한 번만 세요.`,
          items: [{ kind: "box", x: 80, y: 370, w: 420, h: 90, color: "red", dash: true }, T(80, 345, `${both[0]}: 일의 자리에도, 십의 자리에도 → 두 번 셌어요`, "red", 24)] },
        { say: `${jo(D, "이")} 들어간 수는 ${ones.length} 더하기 ${tens.length} 빼기 1, ${withD.length}개예요.`,
          items: [T(80, 400, `들어간 수: ${ones.length} + ${tens.length} − 1 = ${withD.length}개`, "green", 28)] },
        { say: "숫자를 쓴 횟수는 겹쳐도 두 번 세고, 숫자가 들어간 수는 겹치면 한 번만 세요. 무엇을 묻는지 꼭 읽어요.",
          items: [T(RX, 460, "쓴 횟수: 겹쳐도 두 번", "blue", 24), T(RX, 500, "들어간 수: 겹치면 한 번", "red", 24)] },
        { say: "정리해요. 일의 자리와 십의 자리를 따로 찾아요. 쓴 횟수는 그대로 더하고, 들어간 수는 두 자리에 모두 있는 수를 한 번 빼요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 1부터 ${CHK.b}까지 쓸 때 숫자 ${jo(CHK.d, "가")} 들어간 수는 모두 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `1부터 ${CHK.b}까지 중 숫자 ${jo(CHK.d, "가")} 들어간 수는 몇 개?`,
            options: [`${cWith}개`, `${cOnes.length + cTens.length}개`, `${cTens.length}개`], answer: 0,
            hint: "일의 자리, 십의 자리를 따로 찾고 겹친 수를 한 번 빼요.", sayHint: `일의 자리 2는 2, 12, 22로 세 개. 십의 자리 2는 20부터 29까지 열 개. 22는 두 번 셌어요.`,
            right: `맞았어요! ${cOnes.length} + ${cTens.length} − 1 = ${cWith}개.`, sayRight: `맞았어요! 22를 한 번만 세서 ${cWith}개예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-06/make-number-source": (() => {
    const N = [8, 3, 4, 1], TARGET = 8, all = N.reduce((x, y) => x + y, 0), over = all - TARGET, flip = over / 2;
    const sign = N.map((v, i) => (i > 0 && v === flip ? "−" : "+"));
    const expr = N.map((v, i) => (i === 0 ? String(v) : `${sign[i]} ${v}`)).join(" ");
    const B = [1, 2, 3], BT = 15;
    const CHK = { n: [7, 2, 3], t: 2 };
    const RX = 560;
    return {
      title: "수 만들기",
      kicker: "6권 4단원 · 손글씨 개념",
      beats: [
        { say: "수 사이에 더하기나 빼기를 넣어 원하는 수를 만들어요. 아무렇게나 넣지 말고, 먼저 모두 더해 보고 얼마나 차이 나는지 봐요.",
          items: [title("기호 넣어 수 만들기")] },
        { say: `${N.join(" ○ ")} = ${TARGET}. 동그라미에 더하기나 빼기를 넣어요.`,
          items: [T(80, 170, `${N.join("  ○  ")}  =  ${TARGET}`, "ink", 40)] },
        { say: `먼저 모두 더해 봐요. ${jo(N.join(" 더하기 "), "는")} ${jo(all, "이에요")}. 목표 ${TARGET}보다 ${over} 커요.`,
          items: [T(80, 240, `${N.join(" + ")} = ${all}  (${TARGET}보다 ${over} 큼)`, "blue", 28)] },
        { say: `더하기 하나를 빼기로 바꾸면, 그 수만큼 덜 더하고 또 그만큼 빼니까 그 수의 두 배만큼 줄어요. ${over}만큼 줄이려면 ${over}의 반, ${jo(flip, "를")} 빼기로 바꿔요.`,
          items: [T(80, 300, `빼기로 바꾸면 그 수 × 2만큼 줄어요`, "gold", 26), T(80, 345, `${over} ÷ 2 = ${flip} → ${flip} 앞을 −로`, "red", 28)] },
        { say: `${flip} 앞에 빼기를 넣어요. ${expr}. 계산하면 ${jo(TARGET, "이에요")}.`,
          items: [T(80, 410, `${expr} = ${TARGET} ✓`, "green", 36)] },
        { say: `모두 더한 값이 목표보다 작으면, 숫자를 붙여 두 자리 수를 만들어요. ${jo(B.join(", "), "으로")} ${jo(BT, "를")} 만들려면 12 더하기 3, 15.`,
          items: [T(RX, 300, `${B.join(" ○ ")} = ${BT}`, "ink", 30), T(RX, 350, `12 + 3 = ${BT} (1과 2를 붙임)`, "green", 26)] },
        { say: "정리해요. 먼저 모두 더해 목표와 비교해요. 너무 크면 차이의 반인 수 앞을 빼기로, 너무 작으면 숫자를 붙여 큰 수를 만들어요. 마지막에 계산해 확인해요.", mood: "praise",
          items: [T(RX, 450, "차이의 반 → 빼기로", "gold", 28)] },
        { say: `한 문제 풀어 봐요. ${CHK.n.join(" ○ ")} = ${jo(CHK.t, "가")} 되게 동그라미에 기호를 차례로 넣으면 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.n.join(" ○ ")} = ${CHK.t}가 되는 기호를 차례로 고르면?`,
            options: ["+, −", "−, −", "−, +"], answer: 1,
            hint: "모두 더하면 12, 목표보다 10 커요.", sayHint: "모두 더하면 12예요. 10만큼 줄여야 해서, 빼기로 바꿀 수들의 합이 5여야 해요. 2와 3을 둘 다 빼면요?",
            right: `맞았어요! ${CHK.n[0]} − ${CHK.n[1]} − ${CHK.n[2]} = ${CHK.t}.`, sayRight: "맞았어요! 2와 3을 모두 빼면 7 빼기 5, 2예요. 이제 게임으로 가요." } }
      ]
    };
  })()
};
