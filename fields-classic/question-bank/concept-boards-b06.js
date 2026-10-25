// 손글씨 판서 대본 — 6권(수직선과 비·둘레·연속수의 합·수와 숫자의 개수). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수는 골든벨 6권 문항(수직선 15~47·39~95·17~35·18~30·10~30·20~44·4~28, 가르기 24·34·…·92,
// 연필 2·3/3·4/3·5개, 공과 상자 5·6개 등)과 겹치지 않게 골랐다.

import { jo } from "./concept-board-kit.js?v=20261025f";

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
};
