// 손글씨 판서 대본 — 2권(매트릭스·양팔저울·규칙·약속). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수는 골든벨 2권 문항(가르기 2·4·6…84·200, 주고받기 10/4·15/7·22/6…, 합차 10/2·13/3·15/3·17/3·22/6·24/10 등)과
// 겹치지 않게 골랐다. 겹치면 공개 판서가 비공개 정답을 보여 주게 된다.

import { jo } from "./concept-board-kit.js?v=20261025a";

// 말에서 개수는 우리말로 읽는다(「3번」을 「삼 번」으로 읽지 않게)
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };
const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const half = (n) => n / 2;
// 두 수를 십 묶음과 낱개로 나눠 반씩 — 「32의 반 = 30의 반 15 + 2의 반 1」
const tensOnes = (n) => [Math.floor(n / 10) * 10, n % 10];

export const BOARDS_B02 = {
  "book-02/number-splitting": (() => {
    const W = 32, H = half(W), Q = half(H), [wt, wo] = tensOnes(W), [ht, ho] = tensOnes(H);
    const TRI = 30, CHK = 44, [ct, co] = tensOnes(CHK), chkHalf = half(CHK), chkQ = half(chkHalf);
    const P = { root: [280, 160], L: [170, 290], R: [390, 290], q: [[115, 420], [225, 420], [335, 420], [445, 420]] };
    const node = ([cx, cy], value, color = "ink", r = 34) => ({ kind: "node", cx, cy, r, value, color });
    const num = ([cx, cy], value, color) => ({ kind: "num", cx, cy, value, color });
    const edge = ([x1, y1], [x2, y2], r1 = 34, r2 = 34) => { const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy); return { kind: "line", x1: x1 + dx / L * r1, y1: y1 + dy / L * r1, x2: x2 - dx / L * r2, y2: y2 - dy / L * r2, color: "gray", width: 3 }; };
    const t3 = { root: [770, 410], kids: [[680, 520], [770, 520], [860, 520]] };
    return {
      title: "수를 똑같이 가르며 관계를 찾아요",
      kicker: "2권 1단원 · 손글씨 개념",
      beats: [
        { say: `수 하나를 같은 크기 여러 개로 나누는 것을 똑같이 가르기라고 해요. 오늘은 ${jo(W, "을")} 차근차근 갈라 볼 거예요.`,
          items: [title("수를 똑같이 갈라요")] },
        { say: `맨 위에 전체 수 ${jo(W, "를")} 써요. 이 수를 똑같은 두 수로 가를 거예요.`,
          items: [node(P.root, W, "blue")] },
        { say: `가지를 두 개 그려요. 두 칸에는 같은 수가 들어가요. 그리고 두 수를 더하면 다시 ${jo(W, "이")} 되어야 해요.`,
          items: [edge(P.root, P.L), edge(P.root, P.R), node(P.L), node(P.R)] },
        { say: `${W}의 반을 한 번에 찾기 어려우면, 십 묶음과 낱개로 나눠 봐요. ${jo(W, "는")} ${jo(wt, "과")} ${jo(wo, "예요")}.`,
          items: [T(560, 150, `${W} = ${wt} + ${wo}`, "blue", 34)] },
        { say: `${jo(wt, "을")} 똑같이 둘로 가르면 ${jo(half(wt), "와")} ${half(wt)}. ${jo(wo, "를")} 똑같이 둘로 가르면 ${jo(half(wo), "과")} ${half(wo)}.`,
          items: [T(560, 205, `${wt}의 반 ${half(wt)},  ${wo}의 반 ${half(wo)}`, "gray", 28)] },
        { say: `한쪽에 ${jo(half(wt), "와")} ${jo(half(wo), "이")} 모이니까 ${half(wt)} 더하기 ${jo(half(wo), "은")} ${jo(H, "이에요")}. 두 칸 모두 ${H}.`,
          items: [num(P.L, H, "green"), num(P.R, H, "green"), T(560, 260, `${half(wt)} + ${half(wo)} = ${H}`, "green", 30)] },
        { say: `꼭 다시 더해 봐요. ${H} 더하기 ${jo(H, "은")} ${W}. 처음 수가 나왔으니 맞게 갈랐어요.`,
          items: [T(560, 315, `${H} + ${H} = ${W} ✓`, "green", 30)] },
        { say: `이번엔 ${jo(H, "을")} 다시 반으로 갈라요. 가지마다 두 개씩, 모두 네 칸이 생겨요.`,
          items: [edge(P.L, P.q[0], 34, 30), edge(P.L, P.q[1], 34, 30), edge(P.R, P.q[2], 34, 30), edge(P.R, P.q[3], 34, 30), ...P.q.map((p) => node(p, null, "ink", 30))] },
        { say: `${jo(H, "은")} ${jo(ht, "과")} ${ho}. ${ht}의 반은 ${half(ht)}, ${ho}의 반은 ${half(ho)}. ${half(ht)} 더하기 ${jo(half(ho), "은")} ${jo(Q, "이에요")}.`,
          items: [T(560, 370, `${H} → ${half(ht)} + ${half(ho)} = ${Q}`, "blue", 30)] },
        { say: `네 칸 모두 ${jo(Q, "을")} 써요.`,
          items: P.q.map((p) => num(p, Q, "green")) },
        { say: `네 개를 다 더해 봐요. ${Q} 더하기 ${jo(Q, "은")} ${H}, ${H} 더하기 ${jo(H, "은")} ${W}. 처음 ${jo(W, "으로")} 돌아왔어요.`,
          items: [T(60, 520, `${Q} + ${Q} + ${Q} + ${Q} = ${W} ✓`, "green", 30)] },
        { say: `반으로 두 번 가르면 네 개로 똑같이 가른 것과 같아요. ${jo(W, "을")} 네 개로 똑같이 가르면 하나는 ${jo(Q, "이에요")}.`,
          items: [T(60, 570, "반의 반 = 네 개로 똑같이", "gold", 28)] },
        { say: `세 개로 똑같이 가를 때도 있어요. ${jo(TRI, "을")} 세 개로 갈라 볼게요. 가지를 세 개 그려요.`,
          items: [node(t3.root, TRI, "blue", 30), ...t3.kids.map((k) => edge(t3.root, k, 30, 26)), ...t3.kids.map((k) => node(k, null, "ink", 26))] },
        { say: `${jo(TRI, "은")} 10 묶음이 세 개예요. 한 칸에 한 묶음씩 나눠 주면 10, 10, 10. 다시 더하면 ${TRI}.`,
          items: t3.kids.map((k) => ({ kind: "num", cx: k[0], cy: k[1], value: TRI / 3, color: "green", size: 32 })) },
        { say: "정리해요. 몇 개로 가를지 정해요. 어려우면 십 묶음과 낱개로 나눠서 따로 가른 뒤 모아요. 마지막에 다시 더해 처음 수가 되는지 확인해요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 110, w: 440, h: 280, color: "gold" }] },
        { say: `한 문제 풀어 봐요. ${jo(CHK, "를")} 네 개로 똑같이 가르면 하나는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${jo(CHK, "를")} 네 수로 똑같이 가르면 한 수는 얼마일까요?`,
            options: [String(chkHalf), String(chkQ), String(chkQ - 1)], answer: 1,
            hint: "먼저 반으로 가르고, 그 수를 다시 반으로 갈라요.", sayHint: `${CHK}의 반은 ${ct}의 반 ${jo(half(ct), "과")} ${co}의 반 ${jo(half(co), "를")} 모아 ${jo(chkHalf, "예요")}. ${jo(chkHalf, "를")} 또 반으로 가르면 얼마일까요?`,
            right: `맞았어요! ${CHK} → ${chkHalf} → ${chkQ}. ${chkQ} + ${chkQ} + ${chkQ} + ${chkQ} = ${CHK}.`, sayRight: `맞았어요! ${jo(CHK, "를")} 반으로 가르면 ${chkHalf}, 또 반으로 가르면 ${jo(chkQ, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/addition-matrix": (() => {
    const v = { tri: 7, cir: 4, sq: 9 }, X0 = 110, Y0 = 170, S = 110;
    const sums = { r0: v.tri * 2, c0: v.tri + v.cir, r1: v.cir + v.sq, c1: v.tri + v.sq };
    const at = (r, c) => [X0 + (c + 0.5) * S, Y0 + (r + 0.5) * S];
    const sh = (r, c, type, color = "ink") => { const [cx, cy] = at(r, c); return { kind: "shape", type, cx, cy, r: 30, color }; };
    const val = (r, c, value, type) => { const [cx, cy] = at(r, c); return { kind: "num", cx, cy: cy + (type === "triangle" ? 8 : 0), value, color: "green", size: 30 }; };
    const rowSum = (r, value, color = "blue") => T(X0 + 2 * S + 22, at(r, 0)[1] + 12, `= ${value}`, color, 34);
    const colSum = (c, value, color = "blue") => T(at(0, c)[0], Y0 + 2 * S + 48, String(value), color, 34, "center");
    const CHK = { sq2: 10, cirSq: 13 }, chkSq = CHK.sq2 / 2, chkCir = CHK.cirSq - chkSq;
    return {
      title: "가로와 세로의 합을 맞춰요",
      kicker: "2권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 모양은 언제나 같은 수를 나타내요. 가로줄과 세로줄의 합을 보고, 모양마다 어떤 수인지 찾아볼 거예요.",
          items: [title("가로와 세로의 합을 맞춰요")] },
        { say: "네 칸짜리 표를 그려요.",
          items: [{ kind: "grid", x: X0, y: Y0, cols: 2, rows: 2, cell: S, color: "ink" }] },
        { say: "윗줄에는 세모 두 개, 아랫줄에는 동그라미와 네모를 그려요. 두 세모는 같은 수예요.",
          items: [sh(0, 0, "triangle"), sh(0, 1, "triangle"), sh(1, 0, "circle"), sh(1, 1, "square")] },
        { say: `윗줄 오른쪽에 ${jo(sums.r0, "를")} 써요. 윗줄의 세모 두 개를 더하면 ${jo(sums.r0, "이라")}는 뜻이에요.`,
          items: [rowSum(0, sums.r0)] },
        { say: `왼쪽 세로줄 아래에는 ${jo(sums.c0, "을")} 써요. 세모와 동그라미를 더하면 ${jo(sums.c0, "이에요")}.`,
          items: [colSum(0, sums.c0)] },
        { say: `아랫줄의 합은 ${jo(sums.r1, "이에요")}. 동그라미와 네모를 더하면 ${jo(sums.r1, "이에요")}.`,
          items: [rowSum(1, sums.r1)] },
        { say: "어디서부터 풀까요? 모양이 한 가지뿐인 줄부터 봐요. 윗줄은 세모만 두 개 있어요.",
          items: [{ kind: "box", x: X0 - 8, y: Y0 - 8, w: 2 * S + 16, h: S + 16, color: "gold", dash: true }] },
        { say: `세모 두 개가 ${jo(sums.r0, "예요")}. 같은 수 두 개로 ${jo(sums.r0, "를")} 만들려면 ${jo(sums.r0, "를")} 똑같이 둘로 갈라요. ${jo(v.tri, "과")} ${v.tri}.`,
          items: [T(560, 170, `△ + △ = ${sums.r0}  →  △ = ${v.tri}`, "blue", 32)] },
        { say: `세모는 ${jo(v.tri, "이에요")}. 세모 두 개 안에 ${jo(v.tri, "을")} 써요.`,
          items: [val(0, 0, v.tri, "triangle"), val(0, 1, v.tri, "triangle")] },
        { say: `이제 왼쪽 세로줄을 봐요. 세모 ${v.tri} 더하기 동그라미가 ${jo(sums.c0, "이에요")}. ${sums.c0}에서 ${jo(v.tri, "을")} 빼면 ${v.cir}. 동그라미는 ${jo(v.cir, "예요")}.`,
          items: [T(560, 240, `${v.tri} + ○ = ${sums.c0}  →  ○ = ${sums.c0} − ${v.tri} = ${v.cir}`, "blue", 28), val(1, 0, v.cir)] },
        { say: `아랫줄을 봐요. 동그라미 ${v.cir} 더하기 네모가 ${jo(sums.r1, "이에요")}. ${sums.r1} 빼기 ${jo(v.cir, "는")} ${v.sq}. 네모는 ${jo(v.sq, "예요")}.`,
          items: [T(560, 310, `${v.cir} + □ = ${sums.r1}  →  □ = ${sums.r1} − ${v.cir} = ${v.sq}`, "blue", 28), val(1, 1, v.sq)] },
        { say: `남은 오른쪽 세로줄의 합도 구할 수 있어요. 세모 ${jo(v.tri, "과")} 네모 ${jo(v.sq, "를")} 더하면 ${jo(sums.c1, "이에요")}.`,
          items: [colSum(1, sums.c1, "green")] },
        { say: `모든 줄을 다시 더해 확인해요. ${v.tri} 더하기 ${jo(v.tri, "은")} ${sums.r0}, ${v.tri} 더하기 ${jo(v.cir, "는")} ${sums.c0}, ${v.cir} 더하기 ${jo(v.sq, "는")} ${sums.r1}. 모두 맞아요.`,
          items: [T(560, 380, `${v.tri}+${v.tri}=${sums.r0}, ${v.tri}+${v.cir}=${sums.c0}, ${v.cir}+${v.sq}=${sums.r1} ✓`, "green", 26)] },
        { say: "정리해요. 같은 모양만 있는 줄부터 반으로 갈라 값을 찾아요. 찾은 값을 다른 줄에 넣어 하나씩 풀어요. 마지막에 모든 줄을 다시 더해요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 120, w: 440, h: 290, color: "gold" }, T(560, 470, "한 가지 모양인 줄부터!", "gold", 32)] },
        { say: `한 문제 풀어 봐요. 네모 두 개의 합이 ${jo(CHK.sq2, "이고")}, 동그라미와 네모의 합이 ${jo(CHK.cirSq, "이에요")}. 동그라미는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `□ + □ = ${CHK.sq2},  ○ + □ = ${CHK.cirSq}일 때 ○는 얼마일까요?`,
            options: [String(chkSq), String(chkCir), String(CHK.cirSq - CHK.sq2)], answer: 1,
            hint: "네모만 있는 식부터 반으로 갈라요.", sayHint: `네모 두 개가 ${jo(CHK.sq2, "이에요")}. 네모 하나는 얼마일까요? 그 수를 두 번째 식에 넣어 봐요.`,
            right: `맞았어요! □ = ${chkSq}, ○ = ${CHK.cirSq} − ${chkSq} = ${chkCir}.`, sayRight: `맞았어요! 네모는 ${jo(chkSq, "이고")} 동그라미는 ${CHK.cirSq} 빼기 ${chkSq}, ${jo(chkCir, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/give-take-sum-difference": (() => {
    const A = 16, B = 6, diff = A - B, give = diff / 2, each = A - give;
    const TOT = 14, D = 4, small = (TOT - D) / 2, big = small + D;
    const C = 21, X = 160, YA = 140, YB = 192;
    const cells = (n, from = 0) => Array.from({ length: n }, (_, i) => [0, from + i]);
    const U = 30, BX = 160, BY1 = 360, BY2 = 430, BH = 40;
    const bar = (y, n, fill) => ({ kind: "fill", x: BX, y, w: n * U, h: BH, fill });
    const CHK = { tot: 16, d: 6 }, chkSmall = (CHK.tot - CHK.d) / 2, chkBig = chkSmall + CHK.d;
    return {
      title: "주고받기와 합·차 문제를 풀어요",
      kicker: "2권 1단원 · 손글씨 개념",
      beats: [
        { say: "두 사람이 가진 수를 같게 만드는 법, 그리고 합과 차만 알 때 두 수를 찾는 법을 차례로 배워요.",
          items: [title("주고받기와 합·차")] },
        { say: `가람이는 구슬 ${A}개, 나래는 ${B}개를 가지고 있어요. 줄을 맞춰 늘어놓아요.`,
          items: [T(70, YA + 17, "가람", "blue", 26), { kind: "cells", x: X, y: YA, cell: C, cells: cells(A), fill: "blue" }, T(70, YB + 17, "나래", "green", 26), { kind: "cells", x: X, y: YB, cell: C, cells: cells(B), fill: "green" }] },
        { say: `줄을 맞추니 가람이가 ${diff}개 더 많아요. ${A} 빼기 ${jo(B, "은")} ${jo(diff, "이에요")}.`,
          items: [{ kind: "box", x: X + B * C - 2, y: YA - 4, w: diff * C + 4, h: C + 8, color: "red", dash: true }, T(X + A * C + 14, YA + 17, `차이 ${diff}`, "red", 26)] },
        { say: `하나를 주면 가람이는 하나 줄고 나래는 하나 늘어서, 차이가 2씩 줄어요. 그래서 차이 ${diff}의 반, ${give}개만 주면 돼요.`,
          items: [T(560, 240, `차이의 반: ${diff} ÷ 2 = ${give}`, "gold", 28)] },
        { say: `${give}개를 주면 가람이는 ${A} 빼기 ${give}, ${each}개. 나래는 ${B} 더하기 ${give}, ${each}개. 똑같아졌어요.`,
          items: [T(560, 288, `${A} − ${give} = ${each},  ${B} + ${give} = ${each} ✓`, "green", 28)] },
        { say: `이번엔 다른 문제예요. 가람이와 나래의 사탕을 합하면 모두 ${TOT}개. 가람이가 나래보다 ${D}개 더 많아요. 각각 몇 개일까요?`,
          items: [{ kind: "line", x1: 60, y1: 318, x2: 940, y2: 318, color: "gray", width: 2, dash: true }, T(560, 350, `합 ${TOT},  차 ${D}`, "blue", 30)] },
        { say: `막대로 그려요. 나래 막대를 먼저 그리고, 가람이 막대는 나래 막대보다 ${D}만큼 더 길게 그려요.`,
          items: [T(70, BY2 + 28, "나래", "green", 26), bar(BY2, small, "green"), T(70, BY1 + 28, "가람", "blue", 26), bar(BY1, small, "blue"), { kind: "box", x: BX + small * U, y: BY1, w: D * U, h: BH, color: "red", dash: true }, T(BX + small * U + D * U / 2, BY1 - 10, `더 많은 ${D}`, "red", 22, "center")] },
        { say: `두 막대를 모두 합하면 ${jo(TOT, "예요")}. 막대 오른쪽에 써 둬요.`,
          items: [T(BX + big * U + 24, BY1 + 60, `모두 ${TOT}`, "blue", 28)] },
        { say: `가람이 막대에서 더 긴 ${D}만큼을 잠깐 떼어 내요. 그러면 두 막대 길이가 똑같아져요. 전체도 ${D}만큼 줄어서 ${TOT} 빼기 ${D}, ${jo(TOT - D, "이에요")}.`,
          items: [{ kind: "x", cx: BX + small * U + D * U / 2, cy: BY1 + BH / 2, r: 16, color: "red" }, T(560, 410, `${TOT} − ${D} = ${TOT - D}`, "red", 30)] },
        { say: `똑같은 막대 두 개가 ${jo(TOT - D, "이니까")} 하나는 ${TOT - D}의 반, ${small}. 나래는 ${small}개예요.`,
          items: [T(560, 460, `${TOT - D} ÷ 2 = ${small}  →  나래 ${small}`, "green", 30)] },
        { say: `가람이는 나래보다 ${D}개 더 많으니 ${small} 더하기 ${D}, ${big}개예요.`,
          items: [T(560, 510, `가람 ${small} + ${D} = ${big}`, "blue", 30)] },
        { say: `확인해요. ${big} 더하기 ${jo(small, "는")} ${TOT}, ${big} 빼기 ${jo(small, "는")} ${D}. 합도 차도 맞아요.`,
          items: [T(560, 560, `${big} + ${small} = ${TOT},  ${big} − ${small} = ${D} ✓`, "green", 26)] },
        { say: "정리해요. 같게 만들 때는 차이의 반만 옮겨요. 합과 차를 알 때는 전체에서 차이를 빼고 반으로 나눠 작은 수를 찾고, 거기에 차이를 더해 큰 수를 찾아요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 두 수를 합하면 ${jo(CHK.tot, "이고")}, 큰 수가 작은 수보다 ${CHK.d} 더 커요. 큰 수는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `두 수의 합은 ${CHK.tot}, 차는 ${jo(CHK.d, "이에요")}. 큰 수는 얼마일까요?`,
            options: [String(chkSmall), String(chkBig), String(CHK.tot - CHK.d)], answer: 1,
            hint: "전체에서 차이를 빼고 반으로 나누면 작은 수예요.", sayHint: `${CHK.tot}에서 ${jo(CHK.d, "을")} 빼고 반으로 나눠 작은 수를 먼저 찾아요. 그다음 차이를 더해요.`,
            right: `맞았어요! 작은 수 (${CHK.tot} − ${CHK.d}) ÷ 2 = ${chkSmall}, 큰 수 ${chkSmall} + ${CHK.d} = ${chkBig}.`, sayRight: `맞았어요! 작은 수는 ${jo(chkSmall, "이고")} 큰 수는 ${chkSmall} 더하기 ${CHK.d}, ${jo(chkBig, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/two-term-arithmetic": (() => {
    const N = 6, K = 3, TOT = N * K, two = TOT / 2, SIX = 6, six = TOT / SIX;
    const C = 25, X = 70, Y = 230;
    const run = (from, n, fill) => ({ kind: "cells", x: X + from * C, y: Y, cell: C, cells: Array.from({ length: n }, (_, i) => [0, i]), fill });
    const CHK = { a: 8, stars: 4 }, chkTot = CHK.a * 2, chkStar = chkTot / CHK.stars;
    return {
      title: "같은 수의 묶음을 식으로 바꿔요",
      kicker: "2권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 수를 여러 번 더한 식을, 다른 크기의 묶음으로 바꿔 볼 거예요. 전체는 그대로 두고 묶음만 바꿔요.",
          items: [title("같은 수의 묶음을 바꿔요")] },
        { say: `${N} 더하기 ${N} 더하기 ${jo(N, "을")} 써요. ${jo(N, "이")} ${KO[K]} 번 더해졌어요. ${N}짜리 묶음이 ${KO[K]} 개라는 뜻이에요.`,
          items: [T(70, 160, Array(K).fill(N).join(" + "), "blue", 40)] },
        { say: `칸으로 그려 봐요. ${N}칸씩 색을 바꿔 가며 ${KO[K]} 묶음을 이어 붙여요.`,
          items: Array.from({ length: K }, (_, i) => run(i * N, N, i % 2 ? "green" : "blue")) },
        { say: `모두 몇일까요? ${N} 더하기 ${jo(N, "은")} ${N * 2}, ${N * 2} 더하기 ${jo(N, "은")} ${jo(TOT, "이에요")}.`,
          items: [T(80 + K * 42, 160, `= ${TOT}`, "blue", 40)] },
        { say: `이번엔 ${jo(TOT, "을")} 같은 수 두 개로 나타내요. 네모 두 개는 같은 수예요.`,
          items: [T(70, 330, `${Array(K).fill(N).join(" + ")} = □ + □`, "ink", 36)] },
        { say: `같은 수 두 개로 ${jo(TOT, "을")} 만들려면 ${jo(TOT, "을")} 똑같이 둘로 갈라요. 칸 한가운데에 선을 그어요. 왼쪽 ${two}칸, 오른쪽 ${two}칸.`,
          items: [{ kind: "line", x1: X + two * C, y1: Y - 16, x2: X + two * C, y2: Y + C + 16, color: "red", width: 4 }, T(X + two * C / 2, Y + C + 40, String(two), "red", 28, "center"), T(X + two * C * 1.5, Y + C + 40, String(two), "red", 28, "center")] },
        { say: `네모는 ${jo(two, "예요")}. ${two} 더하기 ${jo(two, "는")} ${TOT}. 처음 식과 전체가 같아요.`,
          items: [T(560, 330, `□ = ${two}   (${two} + ${two} = ${TOT} ✓)`, "green", 30)] },
        { say: `이번엔 세모 ${KO[SIX]} 개로 나타내요. 같은 수 ${KO[SIX]} 개를 더해서 ${jo(TOT, "이")} 되어야 해요.`,
          items: [T(70, 400, `${Array(K).fill(N).join(" + ")} = ${Array(SIX).fill("△").join(" + ")}`, "ink", 32)] },
        { say: `${N}짜리 묶음 하나를 반으로 가르면 ${jo(N / 2, "과")} ${N / 2}. 묶음 ${KO[K]} 개를 모두 반으로 가르면 ${jo(N / 2, "이")} ${KO[SIX]} 개가 돼요.`,
          items: Array.from({ length: K }, (_, i) => ({ kind: "line", x1: X + (i * N + N / 2) * C, y1: Y - 6, x2: X + (i * N + N / 2) * C, y2: Y + C + 6, color: "gold", width: 3, dash: true })) },
        { say: `세어 봐요. ${Array.from({ length: SIX }, (_, i) => six * (i + 1)).join(", ")}. ${KO[SIX]} 번 더하니 ${jo(TOT, "이에요")}. 세모는 ${jo(six, "이에요")}.`,
          items: [T(560, 470, `△ = ${six}   (${Array(SIX).fill(six).join("+")} = ${TOT} ✓)`, "green", 28)] },
        { say: `잘 보세요. 묶음이 ${KO[K]} 개면 하나는 ${N}, ${KO[2]} 개면 ${two}, ${KO[SIX]} 개면 ${jo(six, "이에요")}. 묶음 수가 많아지면 한 묶음은 작아지고, 묶음 수가 적어지면 한 묶음은 커져요. 전체 ${jo(TOT, "은")} 그대로예요.`,
          items: [T(70, 530, `묶음 ${K}개 → ${N},  2개 → ${two},  ${SIX}개 → ${six}`, "gold", 28)] },
        { say: "정리해요. 먼저 숫자 쪽 전체를 더해요. 같은 도형이 몇 개인지 세요. 전체를 그 개수로 똑같이 가른 뒤, 다시 더해 확인해요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 290, w: 440, h: 210, color: "gold" }] },
        { say: `한 문제 풀어 봐요. 별 네 개를 더하면 ${CHK.a} 더하기 ${jo(CHK.a, "과")} 같아요. 별 하나는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `☆ + ☆ + ☆ + ☆ = ${CHK.a} + ${CHK.a}일 때 ☆는 얼마일까요?`,
            options: [String(chkStar / 2), String(chkStar), String(chkTot)], answer: 1,
            hint: "숫자 쪽 전체를 먼저 더하고, 별의 개수로 똑같이 갈라요.", sayHint: `${CHK.a} 더하기 ${jo(CHK.a, "은")} ${jo(chkTot, "이에요")}. ${jo(chkTot, "을")} 네 개로 똑같이 가르면 얼마일까요?`,
            right: `맞았어요! ${CHK.a} + ${CHK.a} = ${chkTot}, ${jo(chkTot, "을")} 넷으로 가르면 ${chkStar}.`, sayRight: `맞았어요! 전체 ${jo(chkTot, "을")} 네 개로 가르면 ${jo(chkStar, "예요")}. ${jo(Array(CHK.stars).fill(chkStar).join(" 더하기 "), "는")} ${chkTot}. 이제 게임으로 가요.` } }
      ]
    };
  })()
};
