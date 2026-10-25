// 손글씨 판서 대본 — 2권(매트릭스·양팔저울·규칙·약속). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수는 골든벨 2권 문항(가르기 2·4·6…84·200, 주고받기 10/4·15/7·22/6…, 합차 10/2·13/3·15/3·17/3·22/6·24/10 등)과
// 겹치지 않게 골랐다. 겹치면 공개 판서가 비공개 정답을 보여 주게 된다.

import { jo } from "./concept-board-kit.js?v=20261025f";

// 말에서 개수는 우리말로 읽는다(「3번」을 「삼 번」으로 읽지 않게)
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };
const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const half = (n) => n / 2;
// 두 수를 십 묶음과 낱개로 나눠 반씩 — 「32의 반 = 30의 반 15 + 2의 반 1」
const tensOnes = (n) => [Math.floor(n / 10) * 10, n % 10];

// 3·4·5의 배수 판서 틀 — 묶음은 주사위 눈 모양(3: 대각선, 4: 네 모서리, 5: 모서리 + 가운데)
const DICE = { 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]] };
const KO_BUNDLE = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열", 12: "열두", 13: "열세" };
function multiplesBoard(base, M) {
  const BW = 46, GAP = 54, step = 13;
  const groups = (x0, y0, n, color) => Array.from({ length: n }, (_, i) => { const x = x0 + i * GAP;
    return [{ kind: "box", x, y: y0, w: BW, h: BW, color }, ...DICE[base].map(([c, r]) => ({ kind: "shape", type: "circle", cx: x + 10 + c * step, cy: y0 + 10 + r * step, r: 5.5, color, fill: color, quick: true }))]; }).flat();
  const g = M.terms.map((v) => v / base), gt = g.reduce((a, b) => a + b, 0), tot = M.terms.reduce((a, b) => a + b, 0);
  const colors = ["blue", "green", "gold"], RX = 610;
  let x = 80; const starts = g.map((n) => { const at = x; x += n * GAP + 22; return at; });
  const skip = (n) => Array.from({ length: n }, (_, i) => base * (i + 1)).join(", ");
  const [b1, b2] = M.big, [s1, s2] = M.sub;
  const chk = (M.check[0] + M.check[1]) / base;
  return {
    title: `${base}의 배수로 식을 바꿔요`,
    kicker: "2권 4단원 · 손글씨 개념",
    beats: [
      { say: `이번엔 ${base}개씩 묶어요. 주사위 눈처럼 점 ${KO[base]} 개를 한 묶음으로 그려요. ${base} 곱하기 몇은 ${jo(base, "가")} 몇 묶음인지를 뜻해요.`,
        items: [title(`${base}개씩 묶어 세요`), ...groups(80, 120, 1, "gray"), T(150, 152, `${base}개 = 한 묶음`, "gray", 26)] },
      { say: `이 식을 풀어 볼게요. ${jo(M.terms.join(" 더하기 "), "는")}, ${base} 곱하기 몇과 같을까요?`,
        items: [T(70, 245, `${M.terms.join(" + ")} = ${base} × □`, "ink", 38)] },
      ...M.terms.map((v, i) => ({ say: `${jo(v, "은")} ${jo(base, "가")} 몇 묶음일까요? ${skip(g[i])}. ${KO_BUNDLE[g[i]]} 묶음이에요.`,
        items: [...groups(starts[i], 290, g[i], colors[i]), T(starts[i] + (g[i] * GAP - 8) / 2, 372, `${g[i]}묶음`, colors[i], 24, "center")] })),
      { say: `모두 몇 묶음일까요? ${jo(g.join(" 더하기 "), "은")} ${gt}. 그러니까 네모는 ${jo(gt, "이에요")}.`,
        items: [T(RX, 245, `${g.join(" + ")} = ${gt}묶음 → □ = ${gt}`, "green", 28)] },
      { say: `확인해요. ${jo(base, "가")} ${KO_BUNDLE[gt]} 묶음이면 ${skip(gt)}. 처음 식 ${M.terms.join(" 더하기 ")}도 ${jo(tot, "이에요")}. 같아요.`,
        items: [T(RX, 300, `${base} × ${gt} = ${tot} ✓`, "green", 28)] },
      { say: `큰 수도 묶음으로 바꿔요. ${jo(b1, "은")} ${jo(base, "가")} ${KO_BUNDLE[b1 / base]} 묶음이에요. ${base}씩 열 번 세면 ${jo(b1, "이")}니까요. ${jo(b2, "는")} ${KO_BUNDLE[b2 / base]} 묶음. 그래서 ${b1} 더하기 ${jo(b2, "는")} ${jo(base, "가")} ${(b1 + b2) / base}묶음.`,
        items: [T(70, 440, `${b1} + ${b2} = ${base} × (${b1 / base} + ${b2 / base}) = ${base} × ${(b1 + b2) / base}`, "blue", 28)] },
      { say: `빼기도 묶음끼리 빼요. ${s1} 빼기 ${jo(s2, "는")} ${KO_BUNDLE[s1 / base]} 묶음에서 ${KO_BUNDLE[s2 / base]} 묶음을 빼서 ${KO_BUNDLE[(s1 - s2) / base]} 묶음. ${base} 곱하기 ${jo((s1 - s2) / base, "는")} ${s1 - s2}, ${s1} 빼기 ${s2}도 ${jo(s1 - s2, "이에요")}.`,
        items: [T(70, 490, `${s1} − ${s2} = ${base} × (${s1 / base} − ${s2 / base}) = ${base} × ${(s1 - s2) / base}`, "blue", 28)] },
      ...(M.extra ? [M.extra] : []),
      { say: `정리해요. 수마다 ${jo(base, "가")} 몇 묶음인지 바꿔요. 묶음 수끼리 더하거나 빼요. 마지막에 처음 식을 계산해서 같은지 확인해요.`, mood: "praise",
        items: [T(70, 560, `수마다 ${jo(base, "가")} 몇 묶음?`, "gold", 30)] },
      { say: `한 문제 풀어 봐요. ${M.check[0]} 더하기 ${jo(M.check[1], "는")} ${base} 곱하기 몇일까요?`, mood: "think",
        items: [],
        check: { question: `${M.check[0]} + ${M.check[1]} = ${base} × □에서 □는 얼마일까요?`,
          options: [String(chk - 1), String(chk), String(M.check[0] + M.check[1])], answer: 1,
          hint: `두 수가 각각 ${jo(base, "가")} 몇 묶음인지 세어 더해요.`, sayHint: `${jo(M.check[0], "은")} ${jo(base, "가")} ${KO_BUNDLE[M.check[0] / base]} 묶음이에요. ${jo(M.check[1], "은")} 몇 묶음일까요?`,
          right: `맞았어요! ${M.check[0] / base}묶음 + ${M.check[1] / base}묶음 = ${chk}묶음.`, sayRight: `맞았어요! ${KO_BUNDLE[M.check[0] / base]} 묶음과 ${KO_BUNDLE[M.check[1] / base]} 묶음, 모두 ${KO_BUNDLE[chk]} 묶음이에요. 이제 게임으로 가요.` } }
    ]
  };
}

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
  ,"book-02/balance-order": (() => {
    // 양팔저울: tilt 1 = 왼쪽이 내려감, -1 = 오른쪽이 내려감, 0 = 수평. 접시 위에는 글(이름) 또는 작은 도형
    const scale = (cx, cy, tilt, left, right, color = "ink") => {
      const dy = 24 * tilt, L = [cx - 110, cy + dy], R = [cx + 110, cy - dy], out = [];
      out.push({ kind: "path", d: `M ${cx} ${cy} L ${cx - 26} ${cy + 70} L ${cx + 26} ${cy + 70} Z`, stroke: "gray", width: 3, quick: true });
      out.push({ kind: "line", x1: L[0], y1: L[1], x2: R[0], y2: R[1], color, width: 4 });
      for (const [[x, y], stuff] of [[L, left], [R, right]]) {
        out.push({ kind: "line", x1: x, y1: y, x2: x, y2: y + 22, color: "gray", width: 2 });
        out.push({ kind: "path", d: `M ${x - 58} ${y + 22} Q ${x} ${y + 66} ${x + 58} ${y + 22}`, stroke: color, width: 3 });
        if (typeof stuff === "string") out.push(T(x, y + 38, stuff, "blue", 28, "center"));
        else stuff.forEach((type, i) => out.push({ kind: "shape", type, cx: x + (i - (stuff.length - 1) / 2) * 26, cy: y + 30, r: 10, color: "blue", width: 2.5, quick: true }));
      }
      return out;
    };
    const F = ["수박", "참외", "자두"];
    const SQ = 4, cir = SQ * 3, star = cir + SQ;
    const CHK = ["사과", "포도", "귤"];   // 포도 > 귤, 사과 > 포도
    return {
      title: "무게의 순서를 찾아요",
      kicker: "2권 2단원 · 손글씨 개념",
      beats: [
        { say: "양팔저울은 무거운 쪽이 아래로 내려가요. 저울 몇 개를 이어 보면 무게의 순서를 알 수 있어요.",
          items: [title("무게의 순서를 찾아요")] },
        { say: `첫 번째 저울이에요. 왼쪽에 ${F[1]}, 오른쪽에 ${F[2]}. 왼쪽이 내려갔어요. 내려간 쪽이 더 무거워요. ${F[1]}가 ${F[2]}보다 무거워요.`,
          items: [...scale(190, 175, 1, F[1], F[2]), T(110, 300, `${F[1]} > ${F[2]}`, "green", 30)] },
        { say: `두 번째 저울이에요. 왼쪽에 ${F[0]}, 오른쪽에 ${F[1]}. 이번에도 왼쪽이 내려갔어요. ${F[0]}이 ${F[1]}보다 무거워요.`,
          items: [...scale(520, 175, 1, F[0], F[1]), T(400, 300, `${F[0]} > ${F[1]}`, "green", 30)] },
        { say: `두 저울에 모두 나온 것이 있어요. ${F[1]}예요. ${F[1]}를 가운데에 두고 이어 봐요.`,
          items: [{ kind: "ring", cx: 134, cy: 290, r: 34, color: "gold" }, { kind: "ring", cx: 487, cy: 290, r: 34, color: "gold" }] },
        { say: `${F[0]}은 ${F[1]}보다 무겁고, ${F[1]}는 ${F[2]}보다 무거워요. 그러니까 무거운 것부터 ${F[0]}, ${F[1]}, ${F[2]}.`,
          items: [T(110, 370, `${F[0]} > ${F[1]} > ${F[2]}`, "blue", 36)] },
        { say: `${F[0]}과 ${F[2]}는 한 번도 저울에 같이 올리지 않았지만, ${F[1]}를 거쳐서 ${F[0]}이 더 무겁다는 걸 알 수 있어요.`,
          items: [T(110, 415, `가운데 ${F[1]}를 거쳐서 이어요`, "gray", 24)] },
        { say: "이번엔 저울이 수평인 경우예요. 수평이면 양쪽의 무게가 똑같아요.",
          items: [{ kind: "line", x1: 60, y1: 440, x2: 940, y2: 440, color: "gray", width: 2, dash: true }] },
        { say: "왼쪽에 동그라미 하나, 오른쪽에 네모 세 개를 올렸더니 수평이에요. 동그라미 하나의 무게는 네모 세 개의 무게와 같아요.",
          items: [...scale(190, 470, 0, ["circle"], ["square", "square", "square"])] },
        { say: `네모 하나가 ${SQ}그램이면 동그라미는 몇 그램일까요? 네모 세 개를 더하면 ${SQ} 더하기 ${SQ} 더하기 ${SQ}, ${cir}그램. 동그라미도 ${cir}그램이에요.`,
          items: [T(560, 480, `○ = □ + □ + □ = ${SQ} + ${SQ} + ${SQ} = ${cir}`, "blue", 28)] },
        { say: `같은 무게는 바꿔 넣을 수 있어요. 별 하나가 동그라미 하나와 네모 하나를 합한 무게라면, 동그라미 자리에 ${jo(cir, "를")} 넣어 ${cir} 더하기 ${SQ}, ${star}그램.`,
          items: [T(560, 530, `☆ = ○ + □ = ${cir} + ${SQ} = ${star}`, "green", 28)] },
        { say: "정리해요. 내려간 쪽이 무거워요. 두 저울에 함께 나온 것을 가운데에 두고 이어요. 수평이면 무게가 같으니, 같은 무게끼리 바꿔 넣어 계산해요.", mood: "praise",
          items: [{ kind: "box", x: 90, y: 335, w: 470, h: 95, color: "gold" }] },
        { say: `한 문제 풀어 봐요. ${CHK[1]}가 ${CHK[2]}보다 무겁고, ${CHK[0]}가 ${CHK[1]}보다 무거워요. 가장 가벼운 것은 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK[1]}가 ${CHK[2]}보다 무겁고, ${CHK[0]}가 ${CHK[1]}보다 무거워요. 가장 가벼운 것은?`,
            options: [CHK[0], CHK[1], CHK[2]], answer: 2,
            hint: "두 문장에 함께 나온 것을 가운데에 두고 이어요.", sayHint: `${CHK[1]}가 두 번 나와요. ${CHK[1]}를 가운데에 두면 무거운 쪽과 가벼운 쪽이 보여요.`,
            right: `맞았어요! ${CHK[0]} > ${CHK[1]} > ${CHK[2]}, 가장 가벼운 것은 ${CHK[2]}이에요.`, sayRight: `맞았어요! ${CHK[0]}, ${CHK[1]}, ${CHK[2]} 순서로 무거우니 가장 가벼운 것은 ${CHK[2]}이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/shape-number-equations": (() => {
    const A = 4, nA = 4, tot1 = A * nA, cir = tot1 / 2;           // 4+4+4+4 = ○+○
    const tri = (cir * 3) / 6;                                      // ○+○+○ = △×6
    const star = (tri + cir * 2) / 4;                               // △+○+○ = ☆×4
    const Y = [150, 250, 350];
    const CHK = { a: 9, b: 6, n: 3 }, chkV = (CHK.a + CHK.b) / CHK.n;
    return {
      title: "도형이 나타내는 수를 식으로 찾아요",
      kicker: "2권 2단원 · 손글씨 개념",
      beats: [
        { say: "식이 여러 개 이어져 있을 때, 하나를 풀면 그 값을 다음 식에 넣어 차례로 풀 수 있어요. 같은 도형은 어느 식에서나 같은 수예요.",
          items: [title("도형의 수를 차례로 찾아요")] },
        { say: "식 세 개를 써요. 첫 번째 식은 숫자와 동그라미, 두 번째 식은 동그라미와 세모, 세 번째 식은 세모, 동그라미, 별이에요.",
          items: [T(70, Y[0], `① ${Array(nA).fill(A).join(" + ")} = ○ + ○`, "ink", 32), T(70, Y[1], "② ○ + ○ + ○ = △ + △ + △ + △ + △ + △", "ink", 28), T(70, Y[2], "③ △ + ○ + ○ = ☆ + ☆ + ☆ + ☆", "ink", 30)] },
        { say: "어느 식부터 풀까요? 한쪽이 숫자로만 되어 있는 식부터예요. 첫 번째 식이에요.",
          items: [{ kind: "box", x: 58, y: Y[0] - 40, w: 470, h: 56, color: "gold", dash: true }] },
        { say: `${jo(A, "를")} ${KO[nA]} 번 더하면 ${A}, ${A * 2}, ${A * 3}, ${tot1}. 동그라미 두 개가 ${jo(tot1, "이에요")}. ${jo(tot1, "을")} 똑같이 둘로 가르면 ${cir}. 동그라미는 ${jo(cir, "이에요")}.`,
          items: [T(600, Y[0], `${tot1} ÷ 2 → ○ = ${cir}`, "green", 30)] },
        { say: `이제 두 번째 식의 동그라미 자리에 ${jo(cir, "을")} 넣어요. ${cir} 더하기 ${cir} 더하기 ${jo(cir, "은")} ${jo(cir * 3, "이에요")}.`,
          items: [T(70, Y[1] + 42, `${cir} + ${cir} + ${cir} = ${cir * 3}`, "blue", 28)] },
        { say: `세모 ${KO[6]} 개가 ${jo(cir * 3, "이에요")}. ${jo(cir * 3, "를")} ${KO[6]} 개로 똑같이 가르면 ${tri}. 세어 봐요. ${Array.from({ length: 6 }, (_, i) => tri * (i + 1)).join(", ")}. 세모는 ${jo(tri, "예요")}.`,
          items: [T(600, Y[1] + 42, `${cir * 3} → △ = ${tri}`, "green", 30)] },
        { say: `세 번째 식에는 세모와 동그라미가 다 나와요. 둘 다 알았으니 넣어 봐요. ${tri} 더하기 ${cir} 더하기 ${jo(cir, "은")} ${jo(tri + cir * 2, "이에요")}.`,
          items: [T(70, Y[2] + 42, `${tri} + ${cir} + ${cir} = ${tri + cir * 2}`, "blue", 28)] },
        { say: `별 ${KO[4]} 개가 ${jo(tri + cir * 2, "이에요")}. ${jo(tri + cir * 2, "을")} ${KO[4]} 개로 똑같이 가르면 ${star}. 별은 ${jo(star, "예요")}.`,
          items: [T(600, Y[2] + 42, `${tri + cir * 2} → ☆ = ${star}`, "green", 30)] },
        { say: `마지막 식에 모든 값을 넣어 확인해요. 왼쪽 ${tri} 더하기 ${cir} 더하기 ${jo(cir, "은")} ${tri + cir * 2}, 오른쪽 ${star} 더하기 ${star} 더하기 ${star} 더하기 ${jo(star, "는")} ${star * 4}. 양쪽이 같아요.`,
          items: [T(70, 470, `③ 왼쪽 ${tri + cir * 2} = 오른쪽 ${star * 4} ✓`, "green", 30)] },
        { say: "정리해요. 숫자만 있거나 한 가지 도형만 있는 식부터 풀어요. 찾은 값은 다음 식의 같은 도형 자리에 넣어요. 마지막 식에 모든 값을 넣어 양쪽이 같은지 확인해요.", mood: "praise",
          items: [T(70, 540, "푼 값은 다음 식으로 넘겨요!", "gold", 32)] },
        { say: `한 문제 풀어 봐요. 세모 세 개를 더하면 ${CHK.a} 더하기 ${jo(CHK.b, "과")} 같아요. 세모 하나는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `△ + △ + △ = ${CHK.a} + ${CHK.b}일 때 △는 얼마일까요?`,
            options: [String(CHK.n), String(chkV), String(CHK.a + CHK.b)], answer: 1,
            hint: "숫자 쪽을 먼저 더하고, 세모 세 개로 똑같이 갈라요.", sayHint: `${CHK.a} 더하기 ${jo(CHK.b, "은")} ${jo(CHK.a + CHK.b, "예요")}. 그 수를 세 개로 똑같이 가르면 얼마일까요?`,
            right: `맞았어요! ${CHK.a} + ${CHK.b} = ${CHK.a + CHK.b}, 셋으로 가르면 ${chkV}.`, sayRight: `맞았어요! ${jo(CHK.a + CHK.b, "를")} 세 개로 가르면 ${jo(chkV, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/arithmetic-sequences": (() => {
    const first = 3, d = 5, shown = 4, target = 7, nth = (n) => first + d * (n - 1);
    const X = (i) => 100 + i * 128, Y0 = 210, R = 32;
    const node = (i, value, color = "ink") => ({ kind: "node", cx: X(i), cy: Y0, r: R, value, color, size: 34 });
    const hop = (i, color = "red") => [{ kind: "arrow", x1: X(i) + 20, y1: Y0 - R - 2, x2: X(i + 1) - 20, y2: Y0 - R - 2, bend: 34, color, width: 3 }, T((X(i) + X(i + 1)) / 2, Y0 - R - 46, `+${d}`, color, 24, "center")];
    const CHK = { first: 2, d: 4, n: 8 }, chkV = CHK.first + CHK.d * (CHK.n - 1);
    return {
      title: "일정하게 커지는 수열을 찾아요",
      kicker: "2권 2단원 · 손글씨 개념",
      beats: [
        { say: "수가 늘어선 것을 수열이라고 해요. 오늘은 늘 같은 만큼씩 커지는 수열에서, 멀리 있는 수를 찾는 법을 배워요.",
          items: [title("일정하게 커지는 수열")] },
        { say: `수를 차례로 써요. ${Array.from({ length: shown }, (_, i) => nth(i + 1)).join(", ")}. 그 뒤로도 계속 이어져요.`,
          items: [...Array.from({ length: shown }, (_, i) => node(i, nth(i + 1), "blue")), T(X(target - 1) + 50, Y0 + 12, "…", "gray", 40)] },
        { say: "수 아래에 몇 번째인지 써 둬요. 첫 번째, 두 번째, 세 번째, 네 번째.",
          items: Array.from({ length: target }, (_, i) => T(X(i), Y0 + 70, `${i + 1}번째`, "gray", 22, "center")) },
        { say: `이웃한 두 수의 차이를 봐요. ${nth(2)} 빼기 ${jo(nth(1), "은")} ${jo(d, "예요")}. 첫 번째에서 두 번째로 갈 때 ${d}만큼 커졌어요.`,
          items: hop(0) },
        { say: `${nth(3)} 빼기 ${jo(nth(2), "은")} ${d}, ${nth(4)} 빼기 ${jo(nth(3), "은")} ${d}. 차이가 계속 ${jo(d, "예요")}. 이런 수열은 늘 ${d}씩 커져요.`,
          items: [...hop(1), ...hop(2)] },
        { say: `그럼 다섯 번째는 ${nth(4)}에 ${jo(d, "를")} 더해 ${nth(5)}. 여섯 번째는 ${nth(6)}, 일곱 번째는 ${jo(nth(7), "이에요")}.`,
          items: [...hop(3, "green"), node(4, nth(5), "green"), ...hop(4, "green"), node(5, nth(6), "green"), ...hop(5, "green"), node(6, nth(7), "green")] },
        { say: `일곱 번째까지 가면서 화살표가 몇 개였나 세어 봐요. 하나, 둘, 셋, 넷, 다섯, 여섯. 일곱 번째는 첫 수에서 ${jo(d, "를")} 여섯 번 더한 수예요. 화살표는 언제나 번째 수보다 하나 적어요.`,
          items: [T(70, 370, `${target}번째 = 첫 수에서 +${d}를 ${target - 1}번`, "gold", 30)] },
        { say: `그래서 일일이 쓰지 않아도 돼요. ${d}를 여섯 번 더해요. ${Array.from({ length: target - 1 }, (_, i) => d * (i + 1)).join(", ")}. ${jo(d * (target - 1), "이")} 돼요. 첫 수 ${first}에 더하면 ${first} 더하기 ${d * (target - 1)}, ${jo(nth(target), "이에요")}.`,
          items: [T(70, 430, `${first} + (${d}를 ${target - 1}번) = ${first} + ${d * (target - 1)} = ${nth(target)}`, "blue", 32)] },
        { say: `줄에 쓴 일곱 번째 수와 같아요. ${jo(nth(target), "이")} 맞아요.`,
          items: [{ kind: "ring", cx: X(6), cy: Y0, r: R + 10, color: "green" }, T(70, 490, `줄에 쓴 수와 같아요 ✓`, "green", 28)] },
        { say: "정리해요. 이웃한 두 수의 차이를 구하고, 다음 차이도 같은지 확인해요. 몇 번째 수를 구할 때는, 첫 수에 차이를 번째 수보다 하나 적게 더해요.", mood: "praise",
          items: [T(70, 555, "첫 수 + 차이를 (번째 − 1)번", "gold", 32)] },
        { say: `한 문제 풀어 봐요. ${Array.from({ length: 4 }, (_, i) => CHK.first + CHK.d * i).join(", ")}, 이렇게 이어지는 수열의 여덟 번째 수는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${Array.from({ length: 4 }, (_, i) => CHK.first + CHK.d * i).join(", ")}, … 의 ${CHK.n}번째 수는 얼마일까요?`,
            options: [String(chkV + CHK.d), String(chkV), String(chkV - CHK.d)], answer: 1,
            hint: "차이를 구하고, 첫 수에 그 차이를 일곱 번 더해요.", sayHint: `차이는 ${jo(CHK.d, "예요")}. 여덟 번째는 첫 수 ${CHK.first}에서 ${jo(CHK.d, "를")} 일곱 번 더한 수예요.`,
            right: `맞았어요! ${CHK.first} + (${CHK.d}를 ${CHK.n - 1}번) = ${CHK.first} + ${CHK.d * (CHK.n - 1)} = ${chkV}.`, sayRight: `맞았어요! ${CHK.d} 일곱 번은 ${CHK.d * (CHK.n - 1)}, 거기에 ${jo(CHK.first, "를")} 더하면 ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,"book-02/repeating-sequence": (() => {
    const P = [6, 2, 8, 5], L = P.length, at = (n) => P[(n - 1) % L], ask = 18, end = Math.floor(ask / L) * L;
    const X = (j) => 110 + j * 80, Yr = (r) => 175 + r * 80, R = 28;
    const row = (r, color = "blue", upto = L) => Array.from({ length: upto }, (_, j) => ({ kind: "node", cx: X(j), cy: Yr(r), r: R, value: P[j], color, size: 32 }));
    const rowEnd = (r, color = "gray") => T(X(L - 1) + 52, Yr(r) + 10, `← ${(r + 1) * L}번째`, color, 24);
    const CHK = { P: [4, 9, 1], n: 11 }, chkV = CHK.P[(CHK.n - 1) % CHK.P.length];
    return {
      title: "반복되는 한 마디로 먼 자리를 찾아요",
      kicker: "2권 3단원 · 손글씨 개념",
      beats: [
        { say: "같은 묶음이 계속 되풀이되는 수열이 있어요. 멀리 있는 수를 하나하나 세지 않고 찾는 법을 배워요.",
          items: [title("되풀이되는 수열")] },
        { say: `수를 차례로 써요. ${P.join(", ")}.`,
          items: row(0) },
        { say: `그다음에 다시 ${P.join(", ")}. 처음 네 수와 똑같아요. 아래 줄에 맞춰 써요.`,
          items: row(1) },
        { say: `또 ${P.join(", ")}. 한 줄에 네 개씩 쓰니까 같은 수가 세로로 나란히 서요.`,
          items: row(2) },
        { say: `되풀이되는 가장 짧은 묶음을 한 마디라고 해요. 이 수열의 한 마디는 ${P.join(", ")}, 네 칸이에요.`,
          items: [{ kind: "box", x: X(0) - R - 10, y: Yr(0) - R - 10, w: X(L - 1) - X(0) + 2 * R + 20, h: 2 * R + 20, color: "gold", dash: true }, T(560, 160, `한 마디 = ${P.join(", ")}  (${L}칸)`, "gold", 30)] },
        { say: "줄이 끝날 때마다 몇 번째인지 써요. 첫 줄 끝은 네 번째, 둘째 줄 끝은 여덟 번째, 셋째 줄 끝은 열두 번째. 4씩 커져요.",
          items: [rowEnd(0), rowEnd(1), rowEnd(2)] },
        { say: `그럼 ${ask}번째 수는 얼마일까요? 줄을 더 쓰지 않고 찾아봐요.`,
          items: [T(560, 230, `${ask}번째 = ?`, "red", 34)] },
        { say: `줄 끝을 이어서 세요. 4, 8, 12, ${end}. ${ask}보다 작은 줄 끝 가운데 가장 큰 것은 ${end}번째예요. ${end}번째는 한 마디의 마지막 칸, ${jo(at(end), "이에요")}.`,
          items: [T(560, 290, `줄 끝: 4, 8, 12, ${end}`, "blue", 28)] },
        { say: `${end}번째 다음, ${end + 1}번째는 새 마디의 첫 칸 ${at(end + 1)}. ${ask}번째는 둘째 칸, ${jo(at(ask), "예요")}.`,
          items: [T(560, 345, `${end + 1}번째 → 첫 칸 ${at(end + 1)},  ${ask}번째 → 둘째 칸 ${at(ask)}`, "green", 26)] },
        { say: `정말 그런지 줄을 더 써서 확인해요. 넷째 줄은 ${end}번째에서 끝나고, 다섯째 줄의 둘째 칸이 ${ask}번째. ${jo(at(ask), "가")} 맞아요.`,
          items: [...row(3, "gray"), rowEnd(3), ...row(4, "gray", 2), { kind: "ring", cx: X(1), cy: Yr(4), r: R + 10, color: "green" }] },
        { say: `줄 끝 수에 딱 맞는 번째라면 어떨까요? 20번째는 줄 끝이라서 한 마디의 마지막 칸, ${jo(at(20), "예요")}.`,
          items: [T(560, 405, `20번째 = 줄 끝 → 마지막 칸 ${at(20)}`, "blue", 26)] },
        { say: "정리해요. 되풀이되는 가장 짧은 한 마디를 찾아요. 한 마디의 칸 수씩 뛰어 세어 줄 끝을 찾고, 거기서 몇 칸 더 가는지 봐요. 줄 끝에 딱 맞으면 마지막 칸이에요.", mood: "praise",
          items: [{ kind: "box", x: 540, y: 120, w: 440, h: 310, color: "gold" }] },
        { say: `한 문제 풀어 봐요. ${jo(CHK.P.join(", "), "가")} 계속 되풀이될 때, ${CHK.n}번째 수는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `${jo(CHK.P.join(", "), "가")} 되풀이될 때 ${CHK.n}번째 수는?`,
            options: CHK.P.map(String), answer: CHK.P.indexOf(chkV),
            hint: "한 마디는 세 칸이에요. 3씩 뛰어 세어 줄 끝을 찾아요.", sayHint: `한 마디가 세 칸이니 줄 끝은 3, 6, 9. ${CHK.n}번째는 9번째에서 몇 칸 더 갈까요?`,
            right: `맞았어요! 줄 끝 9번째 다음 10번째는 ${CHK.P[0]}, ${CHK.n}번째는 ${chkV}.`, sayRight: `맞았어요! 9번째에서 한 마디가 끝나고, 열 번째는 ${CHK.P[0]}, 열한 번째는 ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/sequence-rules": (() => {
    const A = [2, 7, 2, 7, 2, 7], aNext = 2;
    const B = [4, 9, 14, 19], bD = 5, bNext = 24;
    const C = [3, 6, 12, 24], cNext = 48;
    const D = [2, 2, 4, 6, 10], dNext = 16;
    const Y = [160, 245, 330, 450], seqT = (i, arr, color = "blue") => T(70, Y[i], `${arr.join(", ")}, ?`, color, 34);
    const note = (i, text, color = "gray") => T(70, Y[i] + 36, text, color, 22);
    const ans = (i, v) => T(470, Y[i], `→ ${v}`, "green", 34);
    const CHK = [1, 4, 5, 9, 14], chkV = CHK.at(-2) + CHK.at(-1);
    return {
      title: "여러 수열의 규칙을 구별해요",
      kicker: "2권 3단원 · 손글씨 개념",
      beats: [
        { say: "수열마다 규칙이 달라요. 무엇이 바뀌는지 차례로 검사하면 다음 수를 찾을 수 있어요. 검사 순서를 먼저 정해요.",
          items: [title("규칙을 하나씩 검사해요")] },
        { say: "검사 네 가지예요. 첫째, 같은 묶음이 되풀이되나요? 둘째, 같은 수씩 커지나요? 셋째, 두 배씩 커지나요? 넷째, 앞의 두 수를 더하나요?",
          items: [{ kind: "box", x: 600, y: 120, w: 370, h: 230, color: "gold" }, T(620, 170, "① 되풀이?", "gold", 28), T(620, 215, "② 같은 수씩 커져?", "gold", 28), T(620, 260, "③ 두 배씩?", "gold", 28), T(620, 305, "④ 앞 두 수의 합?", "gold", 28)] },
        { say: `첫 번째 수열이에요. ${A.join(", ")}. 다음은 무엇일까요?`,
          items: [seqT(0, A)] },
        { say: `첫째 검사, 되풀이되나요? ${A[0]}, ${jo(A[1], "이")} 계속 되풀이돼요. 그러니까 다음은 ${jo(aNext, "예요")}.`,
          items: [note(0, `① ${A[0]}, ${jo(A[1], "이")} 되풀이`), ans(0, aNext)] },
        { say: `두 번째 수열이에요. ${B.join(", ")}. 되풀이되는 묶음은 없어요.`,
          items: [seqT(1, B)] },
        { say: `둘째 검사, 차이를 봐요. ${B[1]} 빼기 ${jo(B[0], "는")} ${bD}, ${B[2]} 빼기 ${jo(B[1], "는")} ${bD}, ${B[3]} 빼기 ${jo(B[2], "는")} ${bD}. ${bD}씩 커져요. 다음은 ${B[3]} 더하기 ${bD}, ${jo(bNext, "예요")}.`,
          items: [note(1, `② 차이가 ${bD}, ${bD}, ${bD}`), ans(1, bNext)] },
        { say: `세 번째 수열이에요. ${C.join(", ")}. 차이를 보면 ${C[1] - C[0]}, ${C[2] - C[1]}, ${C[3] - C[2]}. 차이가 같지 않아요.`,
          items: [seqT(2, C), note(2, `차이 ${C[1] - C[0]}, ${C[2] - C[1]}, ${C[3] - C[2]} — 같지 않아요`, "red")] },
        { say: `셋째 검사, 두 배씩 커지나요? ${C[0]} 더하기 ${jo(C[0], "은")} ${C[1]}, ${C[1]} 더하기 ${jo(C[1], "은")} ${C[2]}, ${C[2]} 더하기 ${jo(C[2], "는")} ${C[3]}. 늘 자기 자신을 한 번 더 더해요. 두 배예요. 다음은 ${C[3]} 더하기 ${C[3]}, ${jo(cNext, "이에요")}.`,
          items: [T(70, Y[2] + 66, "③ 늘 두 배", "gold", 22), ans(2, cNext)] },
        { say: `네 번째 수열이에요. ${D.join(", ")}. 되풀이도 아니고, 차이도 같지 않고, 두 배도 아니에요.`,
          items: [seqT(3, D)] },
        { say: `넷째 검사, 앞의 두 수를 더해 봐요. ${D[0]} 더하기 ${jo(D[1], "는")} ${D[2]}, ${D[1]} 더하기 ${jo(D[2], "는")} ${D[3]}, ${D[2]} 더하기 ${jo(D[3], "은")} ${D[4]}. 맞아요. 다음은 ${D[3]} 더하기 ${D[4]}, ${jo(dNext, "이에요")}.`,
          items: [note(3, `④ ${D[0]}+${D[1]}=${D[2]}, ${D[1]}+${D[2]}=${D[3]}, ${D[2]}+${D[3]}=${D[4]}`), ans(3, dNext)] },
        { say: "규칙을 찾으면 처음부터 끝까지 모든 수에 다시 넣어 봐요. 하나라도 안 맞으면 다른 규칙이에요. 그때는 다음 검사로 넘어가요.",
          items: [T(620, 400, "찾은 규칙은 처음부터", "green", 26), T(620, 440, "끝까지 다시 넣어 봐요", "green", 26)] },
        { say: "정리해요. 되풀이, 같은 수씩, 두 배씩, 앞 두 수의 합. 이 순서로 하나씩 검사해요. 맞는 규칙을 찾으면 다음 수를 쓰고, 모든 수로 확인해요.", mood: "praise",
          items: [T(620, 530, "하나씩 차례로 검사!", "gold", 32)] },
        { say: `한 문제 풀어 봐요. ${CHK.join(", ")}, 다음 수는 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.join(", ")} 다음 수는 무엇일까요?`,
            options: [String(CHK.at(-1) + 5), String(chkV), String(CHK.at(-1) * 2)], answer: 1,
            hint: "차이가 같은지, 두 배인지 보고, 아니면 앞의 두 수를 더해 봐요.", sayHint: `차이는 ${CHK.slice(1).map((v, i) => v - CHK[i]).join(", ")}. 같지 않아요. 두 배도 아니에요. 앞의 두 수를 더해 보면 어떨까요?`,
            right: `맞았어요! 앞 두 수의 합: ${CHK.at(-2)} + ${CHK.at(-1)} = ${chkV}.`, sayRight: `맞았어요! ${CHK[0]} 더하기 ${jo(CHK[1], "는")} ${CHK[2]}, ${CHK[1]} 더하기 ${jo(CHK[2], "는")} ${CHK[3]}. 그래서 ${CHK.at(-2)} 더하기 ${jo(CHK.at(-1), "는")} ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/dual-shape-color-pattern": (() => {
    const S = ["star", "diamond", "circle"], SN = { star: "별", diamond: "마름모", circle: "동그라미" }, SG = { star: "☆", diamond: "◇", circle: "○" };
    const C = [true, false, false, false];   // 색칠, 빈, 빈, 빈
    const shapeAt = (n) => S[(n - 1) % S.length], filledAt = (n) => C[(n - 1) % C.length];
    const SHOWN = 8, X = (n) => 75 + (n - 1) * 88, Y0 = 200;
    const item = (n, color = "blue") => ({ kind: "shape", type: shapeAt(n), cx: X(n), cy: Y0, r: 26, color, fill: filledAt(n) ? color : undefined });
    const q = (n) => [{ kind: "box", x: X(n) - 32, y: Y0 - 34, w: 64, h: 68, color: "red", dash: true }, T(X(n), Y0 + 14, "?", "red", 40, "center")];
    const word = (n) => `${filledAt(n) ? "색칠한" : "빈"} ${SN[shapeAt(n)]}`;
    const CHK = { S: ["triangle", "circle"], C: [false, true, true], n: 8 };
    const cS = CHK.S[(CHK.n - 1) % 2], cF = CHK.C[(CHK.n - 1) % 3];
    const CG = { triangle: "△", circle: "○" };
    return {
      title: "모양과 색의 규칙을 함께 찾아요",
      kicker: "2권 3단원 · 손글씨 개념",
      beats: [
        { say: "한 줄에 규칙이 두 개 섞여 있을 때가 있어요. 모양의 규칙과 색의 규칙을 따로따로 찾은 뒤 합쳐요.",
          items: [title("모양과 색, 규칙이 두 개")] },
        { say: `모양 ${KO[SHOWN]} 개를 그려요. 모양도 바뀌고, 색칠한 것과 빈 것도 바뀌어요. 아홉 번째와 열 번째는 비워 둬요.`,
          items: [...Array.from({ length: SHOWN }, (_, i) => item(i + 1)), ...q(9), ...q(10), ...Array.from({ length: 10 }, (_, i) => T(X(i + 1), Y0 + 58, String(i + 1), "gray", 20, "center"))] },
        { say: `먼저 색은 잊고 모양만 읽어요. ${Array.from({ length: SHOWN }, (_, i) => SN[shapeAt(i + 1)]).join(", ")}. ${S.map((t) => SN[t]).join(", ")}, 세 개가 되풀이돼요.`,
          items: [T(70, 320, `모양: ${Array.from({ length: SHOWN }, (_, i) => SG[shapeAt(i + 1)] + ((i + 1) % 3 === 0 ? " |" : "")).join(" ")}`, "blue", 30)] },
        { say: `아홉 번째 모양은? ${SN[shapeAt(7)]}, ${SN[shapeAt(8)]} 다음이니 ${SN[shapeAt(9)]}예요.`,
          items: [T(620, 320, `9번째 모양 → ${SG[shapeAt(9)]}`, "green", 30)] },
        { say: `이번엔 모양은 잊고 색만 읽어요. ${Array.from({ length: SHOWN }, (_, i) => (filledAt(i + 1) ? "색칠" : "빈")).join(", ")}. 색칠 하나, 빈 것 셋. 네 개가 되풀이돼요.`,
          items: [T(70, 390, `색: ${Array.from({ length: SHOWN }, (_, i) => (filledAt(i + 1) ? "●" : "○") + ((i + 1) % 4 === 0 ? " |" : "")).join(" ")}`, "blue", 30)] },
        { say: "아홉 번째 색은? 여덟 번째에서 색의 한 마디가 끝났어요. 아홉 번째는 다시 처음, 색칠이에요.",
          items: [T(620, 390, `9번째 색 → ${filledAt(9) ? "색칠" : "빈"}`, "green", 30)] },
        { say: `두 규칙을 합쳐요. 아홉 번째는 모양은 ${SN[shapeAt(9)]}, 색은 ${filledAt(9) ? "색칠" : "빈 것"}. ${word(9)}예요.`,
          items: [{ kind: "fill", x: X(9) - 29, y: Y0 - 31, w: 58, h: 62, fill: "#fffdf7" }, item(9, "green")] },
        { say: `열 번째도 해 봐요. 모양은 ${SN[shapeAt(9)]} 다음 ${SN[shapeAt(10)]}, 색은 색칠 다음 빈 것. ${jo(word(10), "이에요")}.`,
          items: [{ kind: "fill", x: X(10) - 29, y: Y0 - 31, w: 58, h: 62, fill: "#fffdf7" }, item(10, "green"), T(70, 470, `9번째 ${word(9)},  10번째 ${word(10)}`, "green", 28)] },
        { say: "정리해요. 규칙이 두 개 섞이면 하나씩 가리고 따로 읽어요. 모양의 한 마디와 색의 한 마디는 길이가 다를 수 있어요. 같은 자리에서 두 답을 합쳐요.", mood: "praise",
          items: [T(70, 545, "하나씩 가리고 따로 읽기!", "gold", 32)] },
        { say: "한 문제 풀어 봐요. 모양은 세모, 동그라미가 되풀이되고, 색은 빈 것, 색칠, 색칠이 되풀이돼요. 여덟 번째는 무엇일까요?", mood: "think",
          items: [],
          check: { question: "모양은 △, ○가 되풀이되고, 색은 빈 것·색칠·색칠이 되풀이돼요. 8번째는?",
            options: [`빈 ${CG[cS]}`, `색칠한 ${CG[cS]}`, `색칠한 ${CG[CHK.S.find((t) => t !== cS)]}`], answer: cF ? 1 : 0,
            hint: "모양은 두 칸마다, 색은 세 칸마다 되풀이돼요. 따로 세어요.", sayHint: "모양만 세어 봐요. 세모, 동그라미, 세모, 동그라미… 여덟 번째는요? 색은 세 칸씩, 여섯 번째에서 한 마디가 끝나요.",
            right: `맞았어요! 모양은 ${CG[cS]}, 색은 ${cF ? "색칠" : "빈 것"}.`, sayRight: `맞았어요! 여덟 번째 모양은 동그라미, 색은 일곱 번째가 빈 것이니 여덟 번째는 색칠. 색칠한 동그라미예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/multiples-2": (() => {
    // 2개씩 짝: 점 두 개를 세로로 놓고 테두리
    const pairs = (x0, y0, n, color) => Array.from({ length: n }, (_, i) => { const x = x0 + i * 40; return [{ kind: "box", x: x - 15, y: y0 - 15, w: 30, h: 62, color, dash: false }, { kind: "shape", type: "circle", cx: x, cy: y0 + 2, r: 7, color, fill: color, quick: true }, { kind: "shape", type: "circle", cx: x, cy: y0 + 30, r: 7, color, fill: color, quick: true }]; }).flat();
    const E = [6, 8, 2], g = E.map((v) => v / 2), tot = E.reduce((a, b) => a + b, 0), gt = tot / 2;
    const BIG = 40, bigE = 6, SUB = [12, 4];
    const CHK = [10, 8], chkV = (CHK[0] + CHK[1]) / 2;
    return {
      title: "2의 배수로 식을 바꿔요",
      kicker: "2권 3단원 · 손글씨 개념",
      beats: [
        { say: "물건을 2개씩 짝지어 세면, 덧셈을 2가 몇 묶음인지로 바꿀 수 있어요. 짝을 그려 가며 천천히 봐요.",
          items: [title("2개씩 묶어 세요")] },
        { say: "2 곱하기 3은, 2가 세 묶음이라는 뜻이에요. 짝을 세 개 그려요. 2, 4, 6. 2 곱하기 3은 6이에요.",
          items: [...pairs(90, 140, 3, "gray"), T(240, 175, "2 × 3 = 2가 3묶음 = 6", "gray", 28)] },
        { say: `이 식을 풀어 볼게요. ${E.join(" 더하기 ")}는, 2 곱하기 몇과 같을까요?`,
          items: [T(70, 285, `${E.join(" + ")} = 2 × □`, "ink", 38)] },
        { say: `${jo(E[0], "은")} 2가 몇 묶음일까요? 짝을 그리며 세어요. 2, 4, 6. ${KO[g[0]]} 묶음이에요.`,
          items: [...pairs(90, 340, g[0], "blue"), T(90 + (g[0] - 1) * 20, 440, `${g[0]}묶음`, "blue", 24, "center")] },
        { say: `${jo(E[1], "은")} 2, 4, 6, 8. ${KO[g[1]]} 묶음이에요.`,
          items: [...pairs(90 + g[0] * 40 + 30, 340, g[1], "green"), T(90 + g[0] * 40 + 30 + (g[1] - 1) * 20, 440, `${g[1]}묶음`, "green", 24, "center")] },
        { say: `${jo(E[2], "는")} 짝 하나, ${KO[g[2]]} 묶음이에요.`,
          items: [...pairs(90 + (g[0] + g[1]) * 40 + 60, 340, g[2], "gold"), T(90 + (g[0] + g[1]) * 40 + 60, 440, `${g[2]}묶음`, "gold", 24, "center")] },
        { say: `모두 몇 묶음일까요? ${g[0]} 더하기 ${g[1]} 더하기 ${jo(g[2], "은")} ${gt}. 그러니까 네모는 ${jo(gt, "이에요")}.`,
          items: [T(560, 285, `${g.join(" + ")} = ${gt}묶음  →  □ = ${gt}`, "green", 30)] },
        { say: `확인해요. 2가 ${KO[gt]} 묶음이면 ${Array.from({ length: gt }, (_, i) => 2 * (i + 1)).join(", ")}. 처음 식 ${E.join(" 더하기 ")}도 ${jo(tot, "이에요")}. 같아요.`,
          items: [T(560, 340, `2 × ${gt} = ${tot},  ${E.join(" + ")} = ${tot} ✓`, "green", 28)] },
        { say: `큰 수도 묶음으로 바꿀 수 있어요. 10은 2가 다섯 묶음이에요. ${jo(BIG, "은")} 10이 네 개니까 다섯 묶음이 네 번, 5, 10, 15, 20. 스무 묶음이에요. ${bigE}은 세 묶음. 그래서 ${BIG} 더하기 ${jo(bigE, "은")} 2가 ${BIG / 2 + bigE / 2}묶음.`,
          items: [T(560, 410, `${BIG} + ${bigE} = 2 × (${BIG / 2} + ${bigE / 2}) = 2 × ${BIG / 2 + bigE / 2}`, "blue", 26)] },
        { say: `빼기도 돼요. ${SUB[0]} 빼기 ${jo(SUB[1], "는")}, 여섯 묶음에서 두 묶음을 빼면 네 묶음. 2가 네 묶음은 8, ${SUB[0]} 빼기 ${SUB[1]}도 8. 같아요.`,
          items: [T(560, 465, `${SUB[0]} − ${SUB[1]} = 2 × (${SUB[0] / 2} − ${SUB[1] / 2}) = 2 × ${(SUB[0] - SUB[1]) / 2}`, "blue", 26)] },
        { say: "정리해요. 수마다 2가 몇 묶음인지 바꿔요. 묶음 수끼리 더하거나 빼요. 마지막에 처음 식을 계산해서 같은지 확인해요.", mood: "praise",
          items: [T(560, 540, "수마다 2가 몇 묶음?", "gold", 32)] },
        { say: `한 문제 풀어 봐요. ${CHK[0]} 더하기 ${jo(CHK[1], "은")} 2 곱하기 몇일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK[0]} + ${CHK[1]} = 2 × □에서 □는 얼마일까요?`,
            options: [String(CHK[0] + CHK[1]), String(chkV), String(CHK[1])], answer: 1,
            hint: "10과 8이 각각 2가 몇 묶음인지 세어 더해요.", sayHint: `10은 2가 다섯 묶음이에요. 8은 몇 묶음일까요? 두 묶음 수를 더해요.`,
            right: `맞았어요! ${CHK[0] / 2}묶음 + ${CHK[1] / 2}묶음 = ${chkV}묶음.`, sayRight: `맞았어요! 다섯 묶음과 네 묶음, 모두 아홉 묶음이에요. 2 곱하기 9는 18, ${CHK[0]} 더하기 ${jo(CHK[1], "도")} 18. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/growth-patterns": (() => {
    const SP = 26, Y0 = 140;
    const border = (n) => 4 * n, sideOf = (n) => n + 1;
    const frame = (x0, n, color = "blue", newColor) => { const s = sideOf(n), out = [];
      for (let r = 0; r < s; r++) for (let c = 0; c < s; c++) if (r === 0 || c === 0 || r === s - 1 || c === s - 1) {
        const isNew = newColor && ((r === 0 && c === 1) || (c === s - 1 && r === 1) || (r === s - 1 && c === s - 2) || (c === 0 && r === s - 2));   // 변마다 하나씩
        out.push({ kind: "shape", type: "circle", cx: x0 + c * SP, cy: Y0 + r * SP, r: 7, color: isNew ? newColor : color, fill: isNew ? newColor : color, quick: true }); }
      return out; };
    const X = [90, 200, 340, 520];
    const TX = 70, TY = 320, TC = 62, cellT = (r, c, text, color = "ink", size = 28) => T(TX + (c + 0.5) * TC, TY + (r + 0.5) * TC + size * 0.36, text, color, size, "center");
    const label = (i, n) => T(X[i] + (sideOf(n) - 1) * SP / 2, Y0 + 5 * SP + 22, `${n}단계 · ${border(n)}개`, "gray", 22, "center");
    const CHK = { first: 5, d: 3, n: 6 }, chkV = CHK.first + CHK.d * (CHK.n - 1);
    return {
      title: "도형이 자라는 개수 규칙을 찾아요",
      kicker: "2권 3단원 · 손글씨 개념",
      beats: [
        { say: "그림이 단계마다 자랄 때, 몇 개씩 늘어나는지 찾으면 그리지 않아도 먼 단계의 개수를 알 수 있어요.",
          items: [title("그림이 자라는 규칙")] },
        { say: "첫째 단계예요. 점 네 개로 작은 네모를 만들어요. 하나, 둘, 셋, 넷.",
          items: [...frame(X[0], 1), label(0, 1)] },
        { say: "둘째 단계는 한 변에 점이 세 개인 네모 테두리예요. 모서리 점은 두 변이 함께 써요. 하나씩 세면 여덟 개예요.",
          items: [...frame(X[1], 2), label(1, 2)] },
        { say: "셋째 단계는 한 변에 점이 네 개. 테두리만 세어요. 열두 개예요.",
          items: [...frame(X[2], 3), label(2, 3)] },
        { say: `표로 정리해요. 1단계 ${border(1)}개, 2단계 ${border(2)}개, 3단계 ${border(3)}개.`,
          items: [{ kind: "grid", x: TX, y: TY, cols: 7, rows: 2, cell: TC, color: "ink" }, cellT(0, 0, "단계", "ink", 22), cellT(1, 0, "점", "ink", 22), ...[1, 2, 3, 4, 5, 6].map((n) => cellT(0, n, String(n), "gray")), ...[1, 2, 3].map((n) => cellT(1, n, String(border(n)), "blue"))] },
        { say: `얼마씩 늘었나요? ${border(2)} 빼기 ${jo(border(1), "는")} 4, ${border(3)} 빼기 ${jo(border(2), "은")} 4. 4개씩 늘어요.`,
          items: [1, 2].map((n) => T(TX + (n + 1) * TC, TY + 2 * TC + 26, "+4", "red", 24, "center")) },
        { say: "왜 4개씩 늘까요? 단계가 하나 오르면 네 변마다 점이 하나씩 길어져요. 변이 네 개니까 4개가 늘어요. 새로 생긴 점을 다른 색으로 그려 볼게요.",
          items: [...frame(X[3], 4, "blue", "red"), label(3, 4)] },
        { say: `넷째 단계를 세어 보면 ${border(4)}개. 표에 써요. 다섯째는 ${border(4)} 더하기 4, ${border(5)}. 여섯째는 ${jo(border(6), "예요")}.`,
          items: [4, 5, 6].map((n) => cellT(1, n, String(border(n)), "green")) },
        { say: "정리해요. 단계마다 전체 개수를 정확히 세어 표에 써요. 몇 개씩 늘어나는지 보고, 왜 그만큼 느는지 그림에서 새로 생긴 부분으로 확인해요. 그다음 같은 만큼씩 이어 가요.", mood: "praise",
          items: [T(70, 530, "새로 생긴 부분을 보면 규칙이 보여요!", "gold", 30)] },
        { say: `한 문제 풀어 봐요. 점이 ${Array.from({ length: 4 }, (_, i) => CHK.first + CHK.d * i).join(", ")}개로 늘어나요. 여섯째 단계는 몇 개일까요?`, mood: "think",
          items: [],
          check: { question: `점이 ${Array.from({ length: 4 }, (_, i) => CHK.first + CHK.d * i).join(", ")}개로 늘어나요. 6단계는 몇 개일까요?`,
            options: [String(chkV - CHK.d), String(chkV), String(chkV + CHK.d)], answer: 1,
            hint: "몇 개씩 늘었는지 보고, 네 번째 다음부터 이어 가요.", sayHint: `${CHK.d}개씩 늘어요. 네 번째가 ${CHK.first + CHK.d * 3}개면, 다섯째와 여섯째는요?`,
            right: `맞았어요! ${CHK.first + CHK.d * 3} → ${CHK.first + CHK.d * 4} → ${chkV}.`, sayRight: `맞았어요! ${CHK.d}개씩 늘어서 ${CHK.first + CHK.d * 4}, 그다음 ${jo(chkV, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,"book-02/multiples-3": multiplesBoard(3, { terms: [9, 6, 3], big: [30, 9], sub: [15, 6], check: [12, 15] })
  ,"book-02/multiples-4": multiplesBoard(4, { terms: [8, 12, 4], big: [40, 8], sub: [20, 8], check: [16, 12],
      extra: { say: "2짜리 두 묶음을 합치면 4짜리 한 묶음이 돼요. 그래서 2가 여덟 묶음인 16은, 4가 네 묶음이기도 해요. 묶음이 두 배로 커지면 묶음 수는 반이 돼요.",
        items: [T(610, 360, "2 × 8 = 16 = 4 × 4", "gold", 28)] } })
  ,"book-02/multiples-5": multiplesBoard(5, { terms: [15, 20, 5], big: [50, 10], sub: [25, 10], check: [20, 15],
      extra: { say: "5짜리 두 묶음은 10이에요. 그래서 5가 여섯 묶음인 30은, 10이 세 묶음이기도 해요. 5 곱하기 6은 10 곱하기 3과 같아요.",
        items: [T(610, 360, "5 × 6 = 30 = 10 × 3", "gold", 28)] } })

  ,"book-02/diamond-number-promise": (() => {
    // 약속: 위 = 왼쪽 + 오른쪽 − 아래 (골든벨 원문과 다른 약속)
    const rule = ({ L, R, B }) => L + R - B;
    const EX = [{ L: 4, R: 7, B: 2 }, { L: 6, R: 5, B: 3 }, { L: 8, R: 6, B: 4 }].map((e) => ({ ...e, T: rule(e) }));
    const Q = { L: 7, R: 9, B: 5 }, qT = rule(Q);
    const INV = { T: 12, L: 5, B: 3 }, invR = INV.T + INV.B - INV.L;
    const D = 58, r = 23;
    const diamond = (cx, cy, v, color = "blue", big = 1) => { const d = D * big, rr = r * big, pts = { T: [cx, cy - d], L: [cx - d, cy], R: [cx + d, cy], B: [cx, cy + d] }, out = [];
      out.push({ kind: "path", d: `M ${cx} ${cy - d + rr} L ${cx + d - rr} ${cy} L ${cx} ${cy + d - rr} L ${cx - d + rr} ${cy} Z`, stroke: "gray", width: 2, quick: true });
      for (const k of ["T", "L", "R", "B"]) out.push({ kind: "node", cx: pts[k][0], cy: pts[k][1], r: rr, value: v[k] ?? "?", color: v[k] == null ? "red" : color, size: Math.round(26 * big) });
      return out; };
    const CX = [130, 320, 510], CY = 225;
    const CHK = { L: 9, R: 4, B: 6 }, chkT = rule(CHK);
    return {
      title: "네 수의 약속을 찾아요",
      kicker: "2권 4단원 · 손글씨 개념",
      beats: [
        { say: "네 수가 마름모 모양으로 놓여 있어요. 다 채워진 그림에서 네 수 사이의 약속을 찾고, 같은 약속으로 빈칸을 채워요.",
          items: [title("네 수의 약속")] },
        { say: `다 채워진 그림 세 개를 그려요. 첫째 그림은 위 ${EX[0].T}, 왼쪽 ${EX[0].L}, 오른쪽 ${EX[0].R}, 아래 ${jo(EX[0].B, "예요")}.`,
          items: diamond(CX[0], CY, EX[0]) },
        { say: "둘째, 셋째 그림도 그려요. 세 그림은 모두 같은 약속을 지켜요.",
          items: [...diamond(CX[1], CY, EX[1]), ...diamond(CX[2], CY, EX[2])] },
        { say: `약속을 하나씩 짐작해 봐요. 먼저, 위를 빼고 세 수를 다 더하면 위가 될까요? ${EX[0].L} 더하기 ${EX[0].R} 더하기 ${jo(EX[0].B, "는")} ${EX[0].L + EX[0].R + EX[0].B}. 위의 ${jo(EX[0].T, "가")} 아니에요.`,
          items: [T(70, 370, `${EX[0].L} + ${EX[0].R} + ${EX[0].B} = ${EX[0].L + EX[0].R + EX[0].B} ≠ ${EX[0].T}`, "red", 28), { kind: "x", cx: 400, cy: 360, r: 14, color: "red" }] },
        { say: `다른 짐작을 해 봐요. 왼쪽과 오른쪽만 더하면 ${EX[0].L} 더하기 ${jo(EX[0].R, "은")} ${EX[0].L + EX[0].R}. 위의 ${EX[0].T}보다 ${EX[0].L + EX[0].R - EX[0].T} 커요. 그런데 아래 수가 ${jo(EX[0].B, "예요")}. 아래 수만큼 빼면 위가 돼요.`,
          items: [T(70, 420, `${EX[0].L} + ${EX[0].R} − ${EX[0].B} = ${EX[0].T}`, "green", 30)] },
        { say: `약속이 맞는지 다른 그림에서도 확인해요. 둘째, ${EX[1].L} 더하기 ${jo(EX[1].R, "는")} ${EX[1].L + EX[1].R}, 빼기 ${jo(EX[1].B, "은")} ${jo(EX[1].T, "이에요")}. 셋째, ${EX[2].L} 더하기 ${jo(EX[2].R, "은")} ${EX[2].L + EX[2].R}, 빼기 ${jo(EX[2].B, "는")} ${EX[2].T}. 세 그림 모두 맞아요.`,
          items: [T(70, 465, `${EX[1].L}+${EX[1].R}−${EX[1].B}=${EX[1].T} ✓   ${EX[2].L}+${EX[2].R}−${EX[2].B}=${EX[2].T} ✓`, "green", 26)] },
        { say: "약속을 말로 써 둬요. 왼쪽과 오른쪽을 더하고, 아래를 빼면 위.",
          items: [{ kind: "box", x: 60, y: 495, w: 470, h: 56, color: "gold" }, T(75, 533, "약속: 왼쪽 + 오른쪽 − 아래 = 위", "gold", 28)] },
        { say: `이제 빈칸이 있는 그림이에요. 왼쪽 ${Q.L}, 오른쪽 ${Q.R}, 아래 ${jo(Q.B, "예요")}. 위는 얼마일까요?`,
          items: diamond(800, 225, { L: Q.L, R: Q.R, B: Q.B }, "blue", 1.2) },
        { say: `약속대로 해요. ${Q.L} 더하기 ${jo(Q.R, "는")} ${Q.L + Q.R}, 빼기 ${jo(Q.B, "는")} ${jo(qT, "이에요")}.`,
          items: [{ kind: "fill", x: 800 - 26, y: 225 - D * 1.2 - 26, w: 52, h: 52, fill: "#fffdf7" }, { kind: "node", cx: 800, cy: 225 - D * 1.2, r: r * 1.2, value: qT, color: "green", size: 31 }, T(640, 370, `${Q.L} + ${Q.R} − ${Q.B} = ${qT}`, "green", 30)] },
        { say: `빈칸이 다른 자리에 있을 때도 있어요. 위 ${INV.T}, 왼쪽 ${INV.L}, 아래 ${jo(INV.B, "이고")} 오른쪽이 비었어요. 약속을 거꾸로 생각해요. 왼쪽 더하기 오른쪽에서 ${jo(INV.B, "을")} 빼면 ${jo(INV.T, "니까")}, 왼쪽 더하기 오른쪽은 ${INV.T} 더하기 ${INV.B}, ${jo(INV.T + INV.B, "예요")}.`,
          items: [T(640, 430, `${INV.L} + ? = ${INV.T} + ${INV.B} = ${INV.T + INV.B}`, "blue", 28)] },
        { say: `${INV.L} 더하기 몇이 ${INV.T + INV.B}일까요? ${INV.T + INV.B} 빼기 ${jo(INV.L, "는")} ${invR}. 오른쪽은 ${jo(invR, "이에요")}.`,
          items: [T(640, 480, `? = ${INV.T + INV.B} − ${INV.L} = ${invR}`, "green", 28)] },
        { say: "정리해요. 다 채워진 그림에서 약속을 짐작하고, 모든 그림에서 맞는지 확인해요. 빈칸이 위가 아니면 약속을 거꾸로 계산해요.", mood: "praise",
          items: [T(640, 545, "짐작 → 모든 그림 확인!", "gold", 30)] },
        { say: `한 문제 풀어 봐요. 같은 약속이에요. 왼쪽 ${CHK.L}, 오른쪽 ${CHK.R}, 아래 ${jo(CHK.B, "이에요")}. 위는 얼마일까요?`, mood: "think",
          items: [],
          check: { question: `약속: 왼쪽 + 오른쪽 − 아래 = 위. 왼쪽 ${CHK.L}, 오른쪽 ${CHK.R}, 아래 ${CHK.B}일 때 위는?`,
            options: [String(CHK.L + CHK.R + CHK.B), String(chkT), String(CHK.L + CHK.R)], answer: 1,
            hint: "왼쪽과 오른쪽을 더한 뒤 아래를 빼요.", sayHint: `${CHK.L} 더하기 ${jo(CHK.R, "는")} ${jo(CHK.L + CHK.R, "이에요")}. 거기서 ${jo(CHK.B, "을")} 빼면요?`,
            right: `맞았어요! ${CHK.L} + ${CHK.R} − ${CHK.B} = ${chkT}.`, sayRight: `맞았어요! ${CHK.L + CHK.R} 빼기 ${jo(CHK.B, "은")} ${jo(chkT, "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-02/sudoku": (() => {
    const SOL = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
    const GIVEN = [[1, 0, 3, 4], [0, 4, 0, 0], [2, 0, 0, 3], [0, 3, 2, 0]];
    const X0 = 110, Y0 = 150, S = 80;
    const cell = (r, c, v, color) => ({ kind: "num", cx: X0 + (c + 0.5) * S, cy: Y0 + (r + 0.5) * S, value: v, color, size: 42 });
    const bold = [{ kind: "line", x1: X0 + 2 * S, y1: Y0, x2: X0 + 2 * S, y2: Y0 + 4 * S, color: "ink", width: 6 }, { kind: "line", x1: X0, y1: Y0 + 2 * S, x2: X0 + 4 * S, y2: Y0 + 2 * S, color: "ink", width: 6 }];
    // 보는 줄 표시는 판 바깥의 작은 화살표로(판 안에 테두리를 쌓으면 다 채운 판이 어지러워진다)
    const hl = (kind, i) => kind === "row" ? { kind: "arrow", x1: X0 - 46, y1: Y0 + (i + 0.5) * S, x2: X0 - 12, y2: Y0 + (i + 0.5) * S, color: "gold", width: 3 }
      : kind === "col" ? { kind: "arrow", x1: X0 + (i + 0.5) * S, y1: Y0 - 40, x2: X0 + (i + 0.5) * S, y2: Y0 - 10, color: "gold", width: 3 }
      : { kind: "box", x: X0 + (i % 2) * 2 * S - 4, y: Y0 + Math.floor(i / 2) * 2 * S - 4, w: 2 * S + 8, h: 2 * S + 8, color: "gold", dash: true };
    const RX = 500, line = (y, text, color = "blue", size = 26) => T(RX, y, text, color, size);
    // 채우는 차례: [r, c, 어디를 보나, 말]
    const steps = [
      [0, 1, ["row", 0], "첫째 가로줄은 1, 빈칸, 3, 4. 빈칸이 하나뿐이에요. 1부터 4 가운데 빠진 수는 2. 2를 써요."],
      [1, 0, ["box", 0], "왼쪽 위 굵은 네모를 봐요. 1, 2, 4가 있어요. 빈칸 하나에 빠진 3을 써요."],
      [3, 0, ["col", 0], "첫째 세로줄은 1, 3, 2, 빈칸. 빠진 수는 4예요."],
      [3, 3, ["row", 3], "넷째 가로줄은 4, 3, 2, 빈칸. 빠진 수는 1이에요."],
      [1, 3, ["col", 3], "넷째 세로줄은 4, 빈칸, 3, 1. 빠진 수는 2예요."],
      [1, 2, ["row", 1], "둘째 가로줄은 3, 4, 빈칸, 2. 빠진 수는 1이에요."],
      [2, 1, ["col", 1], "둘째 세로줄은 2, 4, 빈칸, 3. 빠진 수는 1이에요."],
      [2, 2, ["row", 2], "셋째 가로줄은 2, 1, 빈칸, 3. 마지막 빈칸은 4예요."]
    ];
    const lineY = (i) => 150 + i * 44;
    const CHK = { row: [2, null, null, 1], col3: true };
    return {
      title: "가로와 세로에서 빠진 수를 찾아요",
      kicker: "2권 4단원 · 손글씨 개념",
      beats: [
        { say: "스도쿠는 가로줄, 세로줄, 굵은 선으로 나눈 네모 안에 1부터 4까지가 한 번씩만 들어가는 퍼즐이에요.",
          items: [title("스도쿠")] },
        { say: "네 칸씩 네 줄의 판을 그려요. 굵은 선으로 판을 네 개의 작은 네모로 나눠요.",
          items: [{ kind: "grid", x: X0, y: Y0, cols: 4, rows: 4, cell: S, color: "ink" }, ...bold] },
        { say: "처음부터 있는 수를 써요. 이 수들은 바꾸지 않아요.",
          items: GIVEN.flatMap((row, r) => row.map((v, c) => (v ? cell(r, c, v, "ink") : null)).filter(Boolean)) },
        { say: "어디부터 채울까요? 빈칸이 하나뿐인 줄이나 네모부터 찾아요. 하나만 비어 있으면 빠진 수가 바로 보여요.",
          items: [line(lineY(0) - 10, "빈칸이 하나뿐인 곳부터!", "gold", 28)] },
        ...steps.map(([r, c, [kind, i], say], k) => ({ say,
          items: [hl(kind, i), cell(r, c, SOL[r][c], "green"), line(lineY(k + 1), `${kind === "row" ? `${i + 1}번째 가로줄` : kind === "col" ? `${i + 1}번째 세로줄` : "굵은 네모"} → ${SOL[r][c]}`, "green", 24)] })),
        { say: "다 채웠어요. 가로줄 네 개, 세로줄 네 개, 굵은 네모 네 개에 1, 2, 3, 4가 한 번씩 들어 있는지 확인해요. 모두 맞아요.",
          items: [line(lineY(9) + 4, "가로·세로·굵은 네모 모두 1~4 ✓", "green", 26)] },
        { say: "정리해요. 빈칸이 하나뿐인 줄이나 네모부터 채워요. 한 칸을 채우면 그 칸이 들어 있는 줄이 달라지니, 다시 빈칸이 하나뿐인 곳을 찾아요.", mood: "praise",
          items: [] },
        { say: "한 문제 풀어 봐요. 어떤 가로줄이 2, 가, 나, 1이에요. 가가 있는 세로줄에는 이미 3이 있어요. 가는 무엇일까요?", mood: "think",
          items: [],
          check: { question: "가로줄이 2, (가), (나), 1이에요. (가)가 있는 세로줄에 3이 이미 있어요. (가)는?",
            options: ["3", "4", "2"], answer: 1,
            hint: "가로줄에 빠진 수는 3과 4예요. 세로줄에 3이 있으면?", sayHint: "가로줄에는 2와 1이 있으니 빠진 수는 3과 4예요. 가의 세로줄에 이미 3이 있으니, 가에는 3을 쓸 수 없어요.",
            right: "맞았어요! (가)는 4, (나)는 3이에요.", sayRight: "맞았어요! 가는 4, 나는 남은 3이에요. 이제 게임으로 가요." } }
      ]
    };
  })()

  ,"book-02/fractions-and-folds": (() => {
    const PX = 80, PY = 140, PS = 170;
    const part = (x, y, w, h, fill) => ({ kind: "fill", x, y, w, h, fill, rx: 0 });
    const QX = 330, QW = 240, QH = 120, QY = 150;   // 4조각 막대
    const FX = 640, FY = 140, FS = 120;
    const CHK = { n: 5, k: 2 };
    return {
      title: "같은 조각의 분수와 접은 횟수를 알아요",
      kicker: "2권 4단원 · 손글씨 개념",
      beats: [
        { say: "전체를 같은 크기의 조각으로 나눈 뒤, 그중 몇 조각인지 나타내는 수를 분수라고 해요. 같은 크기라는 게 가장 중요해요.",
          items: [title("같은 크기 조각과 분수")] },
        { say: "색종이 한 장이에요. 아직 접지 않은 온전한 한 장을 전체라고 해요.",
          items: [{ kind: "box", x: PX, y: PY, w: PS, h: PS, color: "ink" }, T(PX + PS / 2, PY + PS + 34, "전체 1", "ink", 26, "center")] },
        { say: "반으로 한 번 접었다 펴요. 접은 선을 따라 같은 크기 두 조각이 생겨요. 한 조각은 전체의 2분의 1이에요.",
          items: [{ kind: "line", x1: PX + PS / 2, y1: PY, x2: PX + PS / 2, y2: PY + PS, color: "red", width: 3, dash: true }, part(PX + 4, PY + 4, PS / 2 - 8, PS - 8, "#e9f0e7"), T(PX + PS / 4, PY + PS / 2 + 10, "1/2", "green", 30, "center")] },
        { say: "분수를 읽는 법이에요. 아래 수는 전체를 몇 조각으로 나눴는지, 위 수는 그중 몇 조각인지예요. 2분의 1은, 두 조각 가운데 한 조각.",
          items: [T(PX, PY + PS + 80, "1 ← 고른 조각 수", "green", 24), T(PX, PY + PS + 112, "─", "ink", 24), T(PX, PY + PS + 144, "2 ← 전체 조각 수", "blue", 24)] },
        { say: "이번엔 막대를 같은 크기 네 조각으로 나눠요. 그중 세 조각을 색칠해요.",
          items: [{ kind: "box", x: QX, y: QY, w: QW, h: QH / 2, color: "ink" }, ...[1, 2, 3].map((i) => ({ kind: "line", x1: QX + i * QW / 4, y1: QY, x2: QX + i * QW / 4, y2: QY + QH / 2, color: "ink", width: 2.5 })), ...[0, 1, 2].map((i) => part(QX + i * QW / 4 + 4, QY + 4, QW / 4 - 8, QH / 2 - 8, "#cfe0f5"))] },
        { say: "전체는 네 조각, 색칠한 것은 세 조각. 4분의 3이에요. 아래에 전체 조각 수 4, 위에 고른 조각 수 3.",
          items: [T(QX + QW / 2, QY + QH / 2 + 46, "3/4", "blue", 34, "center")] },
        { say: "조심할 것이 있어요. 조각의 크기가 다르면 분수로 말할 수 없어요. 이 막대는 세 조각이지만 크기가 달라서 3분의 1이라고 할 수 없어요.",
          items: [{ kind: "box", x: QX, y: QY + 130, w: QW, h: QH / 2, color: "gray" }, { kind: "line", x1: QX + 40, y1: QY + 130, x2: QX + 40, y2: QY + 130 + QH / 2, color: "gray", width: 2.5 }, { kind: "line", x1: QX + 170, y1: QY + 130, x2: QX + 170, y2: QY + 130 + QH / 2, color: "gray", width: 2.5 }, { kind: "x", cx: QX + QW + 30, cy: QY + 130 + QH / 4, r: 14, color: "red" }, T(QX, QY + 230, "크기가 다르면 분수 ✗", "red", 24)] },
        { say: "다시 색종이로 돌아가요. 접을 때마다 조각이 어떻게 늘어나는지 봐요. 한 번 접으면 두 조각.",
          items: [{ kind: "box", x: FX, y: FY, w: FS, h: FS, color: "ink" }, { kind: "line", x1: FX + FS / 2, y1: FY, x2: FX + FS / 2, y2: FY + FS, color: "red", width: 2.5, dash: true }, T(FX + FS + 20, FY + 40, "1번 → 2조각, 1/2", "blue", 24)] },
        { say: "두 번 접으면, 두 조각이 각각 반으로 나뉘어 네 조각. 한 조각은 4분의 1.",
          items: [{ kind: "line", x1: FX, y1: FY + FS / 2, x2: FX + FS, y2: FY + FS / 2, color: "red", width: 2.5, dash: true }, T(FX + FS + 20, FY + 80, "2번 → 4조각, 1/4", "blue", 24)] },
        { say: "세 번 접으면 네 조각이 또 반씩, 여덟 조각. 한 조각은 8분의 1. 네 번 접으면 열여섯 조각, 16분의 1이에요.",
          items: [{ kind: "line", x1: FX + FS / 4, y1: FY, x2: FX + FS / 4, y2: FY + FS, color: "gold", width: 2, dash: true }, { kind: "line", x1: FX + FS * 3 / 4, y1: FY, x2: FX + FS * 3 / 4, y2: FY + FS, color: "gold", width: 2, dash: true }, T(FX + FS + 20, FY + 120, "3번 → 8조각, 1/8", "blue", 24), T(FX + FS + 20, FY + 160, "4번 → 16조각", "blue", 24)] },
        { say: "한 번 접을 때마다 조각 수가 두 배가 돼요. 2, 4, 8, 16. 그래서 한 조각은 점점 작아져요.",
          items: [T(FX, FY + FS + 120, "2 → 4 → 8 → 16  (두 배씩)", "gold", 26)] },
        { say: "정리해요. 먼저 모든 조각의 크기가 같은지 봐요. 전체 조각 수를 아래에, 고른 조각 수를 위에 써요. 접을 때마다 조각 수는 두 배가 돼요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 전체를 같은 크기 다섯 조각으로 나누고 두 조각을 색칠했어요. 분수로 무엇일까요?`, mood: "think",
          items: [],
          check: { question: "같은 크기 5조각 중 2조각을 색칠했어요. 분수로 나타내면?",
            options: [`${CHK.k}/${CHK.n}`, `${CHK.n - CHK.k}/${CHK.n}`, `${CHK.n}/${CHK.k}`], answer: 0,
            hint: "아래에는 전체 조각 수, 위에는 색칠한 조각 수예요.", sayHint: "전체는 다섯 조각이에요. 아래에 5. 색칠한 것은 몇 조각일까요?",
            right: "맞았어요! 5분의 2, 2/5예요.", sayRight: "맞았어요! 전체 다섯 조각 가운데 두 조각, 5분의 2예요. 이제 게임으로 가요." } }
      ]
    };
  })()
};
