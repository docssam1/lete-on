// 손글씨 판서 대본 — 5권(수 배열표·달력·최단거리·곱셈·삼각수). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 수는 골든벨 5권 문항(달력 합 9·11·13·15·17·19·20·21·22·23·25·27·35·36·37·38·39·41·42·47·50·51·55,
// 4×4 뱀 길·소용돌이 표 등)과 겹치지 않게 골랐다.

import { jo } from "./concept-board-kit.js?v=20261025f";

const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 한 달 달력: 1일의 요일(0 = 일요일)과 날 수. 칸 [줄, 요일]을 돌려준다.
const month = (x0, y0, startDay, days, cw = 60, ch = 50) => {
  const pos = (d) => { const k = startDay + d - 1; return [Math.floor(k / 7), k % 7]; };
  const rows = Math.ceil((startDay + days) / 7);
  const xy = (d) => { const [r, c] = pos(d); return [x0 + (c + 0.5) * cw, y0 + (r + 0.5) * ch]; };
  const items = [];
  items.push(...Array.from({ length: rows + 1 }, (_, r) => ({ kind: "line", x1: x0, y1: y0 + r * ch, x2: x0 + 7 * cw, y2: y0 + r * ch, color: "gray", width: 1.5 })));
  items.push(...Array.from({ length: 8 }, (_, c) => ({ kind: "line", x1: x0 + c * cw, y1: y0, x2: x0 + c * cw, y2: y0 + rows * ch, color: "gray", width: 1.5 })));
  items.push(...DAYS.map((d, c) => T(x0 + (c + 0.5) * cw, y0 - 10, d, c === 0 ? "red" : c === 6 ? "blue" : "ink", 26, "center")));
  items.push(...Array.from({ length: days }, (_, i) => { const [x, y] = xy(i + 1); return T(x, y + 9, String(i + 1), "ink", 26, "center"); }));
  const mark = (d, color = "#cfe0f5") => { const [r, c] = pos(d); return { kind: "fill", x: x0 + c * cw + 3, y: y0 + r * ch + 3, w: cw - 6, h: ch - 6, fill: color }; };
  const reWrite = (d, color = "blue") => { const [x, y] = xy(d); return T(x, y + 9, String(d), color, 28, "center"); };
  return { items, mark, reWrite, xy, pos };
};

export const BOARDS_B05 = {
  "book-05/path-number-grid": (() => {
    const C = 5, R = 4, X0 = 110, Y0 = 150, S = 74;
    const val = (r, c) => r % 2 === 0 ? r * C + c + 1 : r * C + (C - c);        // 줄마다 방향이 바뀌는 길
    const shown = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 4], [1, 3]];
    const Q = [3, 1], qv = val(...Q), CHKC = [2, 3], chk = val(...CHKC);
    const cell = (r, c, v, color = "ink") => T(X0 + (c + 0.5) * S, Y0 + (r + 0.5) * S + 11, String(v), color, 32, "center");
    return {
      title: "수 배열표의 빈칸을 찾아요",
      kicker: "5권 1단원 · 손글씨 개념",
      beats: [
        { say: "수 배열표는 수가 일정한 길을 따라 놓여 있어요. 그 길을 찾으면 빈칸의 수를 알 수 있어요.",
          items: [title("수 배열표의 길 찾기")] },
        { say: `다섯 칸씩 네 줄의 표예요. 몇 칸에만 수가 적혀 있고, 아래 줄의 한 칸이 색칠되어 있어요.`,
          items: [{ kind: "grid", x: X0, y: Y0, cols: C, rows: R, cell: S, color: "ink" }, { kind: "fill", x: X0 + Q[1] * S + 4, y: Y0 + Q[0] * S + 4, w: S - 8, h: S - 8, fill: "#f6dcd3" }, ...shown.map(([r, c]) => cell(r, c, val(r, c)))] },
        { say: "먼저 1이 있는 첫 칸을 찾아요. 왼쪽 위예요. 그다음 2, 3, 4, 5가 오른쪽으로 가요.",
          items: [{ kind: "arrow", x1: X0 + 0.5 * S, y1: Y0 - 18, x2: X0 + 4.5 * S, y2: Y0 - 18, color: "red", width: 3 }] },
        { say: "5 다음 6은 바로 아래 칸이에요. 그리고 7은 왼쪽으로 가요. 줄이 바뀔 때마다 방향이 반대로 바뀌어요.",
          items: [{ kind: "arrow", x1: X0 + C * S + 18, y1: Y0 + 0.5 * S, x2: X0 + C * S + 18, y2: Y0 + 1.5 * S, color: "red", width: 3 }, { kind: "arrow", x1: X0 + 4.5 * S, y1: Y0 + 2 * S - 8, x2: X0 + 0.5 * S, y2: Y0 + 2 * S - 8, color: "red", width: 3 }] },
        { say: "한 줄에 다섯 칸이니까, 줄의 끝에는 5, 10, 15, 20이 와요. 줄 끝만 알면 한 줄씩 건너뛰며 셀 수 있어요.",
          items: [cell(1, 0, 10, "gold"), cell(2, 4, 15, "gold"), cell(3, 0, 20, "gold"), T(560, 170, "줄 끝: 5, 10, 15, 20", "gold", 28)] },
        { say: "셋째 줄은 오른쪽으로 가요. 10 다음 11이 왼쪽 끝에서 시작해 15까지. 넷째 줄은 다시 왼쪽으로, 16이 오른쪽 끝에서 시작해요.",
          items: [cell(2, 0, 11, "gray"), cell(3, 4, 16, "gray"), { kind: "arrow", x1: X0 + 0.5 * S, y1: Y0 + 3 * S - 8, x2: X0 + 4.5 * S, y2: Y0 + 3 * S - 8, color: "red", width: 3 }] },
        { say: `색칠한 칸까지 따라가요. 16, 17, 18, 19. 색칠한 칸은 ${jo(qv, "예요")}.`,
          items: [cell(3, 3, 17, "gray"), cell(3, 2, 18, "gray"), cell(Q[0], Q[1], qv, "red"), T(560, 230, `색칠한 칸 = ${qv}`, "red", 32)] },
        { say: `줄 끝으로도 확인해요. 넷째 줄 끝 20이 왼쪽 맨 끝이에요. 색칠한 칸은 그 바로 오른쪽이니 20보다 1 작은 ${jo(qv, "예요")}.`,
          items: [T(560, 290, `20 − 1 = ${qv} ✓`, "green", 28)] },
        { say: "정리해요. 1이 있는 첫 칸을 찾고, 수가 가는 방향을 따라가요. 줄 끝이 일정하게 커지면 줄 끝부터 건너뛰어 세요. 마지막에 다시 따라가 확인해요.", mood: "praise",
          items: [T(560, 360, "첫 칸 → 방향 → 줄 끝으로 건너뛰기", "gold", 24)] },
        { say: `한 문제 풀어 봐요. 같은 표에서 셋째 줄 넷째 칸에는 어떤 수가 들어갈까요?`, mood: "think",
          items: [],
          check: { question: "같은 표에서 셋째 줄, 왼쪽에서 넷째 칸의 수는?",
            options: [String(chk - 1), String(chk), String(val(3, 3))], answer: 1,
            hint: "셋째 줄은 왼쪽에서 오른쪽으로, 11부터 시작해요.", sayHint: "셋째 줄은 11, 12, 13… 오른쪽으로 가요. 넷째 칸은요?",
            right: `맞았어요! 11, 12, 13, ${chk}.`, sayRight: `맞았어요! 11부터 오른쪽으로 세면 넷째 칸은 ${jo(chk, "예요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-05/calendar-arithmetic-source": (() => {
    const M = month(70, 160, 3, 30);
    const V = { sum: 33, d: 7 }, vs = (V.sum - V.d) / 2, vb = vs + V.d;
    const D = { sum: 26, d: 8 }, ds = (D.sum - D.d) / 2, db = ds + D.d;
    const CHK = { sum: 45, d: 7 }, cs = (CHK.sum - CHK.d) / 2;
    const RX = 540;
    return {
      title: "달력 속 두 수의 합",
      kicker: "5권 1단원 · 손글씨 개념",
      beats: [
        { say: "달력에서 붙어 있는 두 칸의 합만 알아도 두 날짜를 찾을 수 있어요. 달력의 칸끼리 얼마나 차이 나는지가 열쇠예요.",
          items: [title("달력 속 두 수")] },
        { say: "한 달 달력을 그려요. 1일이 수요일에서 시작해요.",
          items: M.items },
        { say: "바로 아래 칸은 일주일 뒤예요. 그래서 위 칸보다 늘 7 커요. 3일 아래는 10일, 10일 아래는 17일.",
          items: [M.mark(3), M.mark(10), M.reWrite(3), M.reWrite(10), T(RX, 170, "바로 아래 칸 = +7", "blue", 28)] },
        { say: "오른쪽 아래 칸은 일주일 하고 하루 더, 8 커요. 두 줄 아래는 14 커요.",
          items: [T(RX, 215, "오른쪽 아래 = +8,  두 줄 아래 = +14", "blue", 24)] },
        { say: `위아래 두 칸의 합이 ${jo(V.sum, "이에요")}. 두 수는 무엇일까요? 아래 칸이 위 칸보다 7 커요.`,
          items: [T(RX, 275, `위 + 아래 = ${V.sum}, 아래 = 위 + 7`, "ink", 26)] },
        { say: `합에서 더 큰 만큼인 7을 빼면, 두 수가 똑같아진 셈이에요. ${V.sum} 빼기 7은 ${V.sum - V.d}.`,
          items: [T(RX, 320, `${V.sum} − 7 = ${V.sum - V.d}`, "blue", 28)] },
        { say: `똑같은 두 수가 ${jo(V.sum - V.d, "이니까")} 반으로 나누면 ${vs}. 위 칸은 ${vs}일, 아래 칸은 ${vs} 더하기 7, ${vb}일.`,
          items: [T(RX, 365, `÷ 2 = ${vs} → 위 ${vs}, 아래 ${vb}`, "green", 28), M.mark(vs, "#e9f0e7"), M.mark(vb, "#e9f0e7"), M.reWrite(vs, "green"), M.reWrite(vb, "green")] },
        { say: `확인해요. ${vs} 더하기 ${jo(vb, "은")} ${jo(V.sum, "이에요")}. 달력에서도 ${vs}일 바로 아래가 ${vb}일이에요.`,
          items: [T(RX, 410, `${vs} + ${vb} = ${V.sum} ✓`, "green", 28)] },
        { say: `오른쪽 아래 두 칸은 차이가 8이에요. 합이 ${jo(D.sum, "이면")} ${D.sum} 빼기 8은 ${D.sum - D.d}, 반은 ${ds}. ${ds}일과 ${db}일이에요.`,
          items: [T(RX, 465, `${D.sum} − 8 = ${D.sum - D.d}, ÷ 2 = ${ds} → ${ds}, ${db}`, "blue", 24), M.mark(ds, "#fbf4dc"), M.mark(db, "#fbf4dc"), M.reWrite(ds, "gold"), M.reWrite(db, "gold")] },
        { say: "정리해요. 두 칸이 얼마나 차이 나는지 찾아요. 합에서 차이를 빼고 반으로 나누면 작은 수, 거기에 차이를 더하면 큰 수예요. 다시 더해 확인해요.", mood: "praise",
          items: [T(RX, 530, "작은 수 = (합 − 차) ÷ 2", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 달력에서 위아래 두 칸의 합이 ${jo(CHK.sum, "예요")}. 위 칸은 며칠일까요?`, mood: "think",
          items: [],
          check: { question: `달력에서 위아래 두 칸의 합이 ${jo(CHK.sum, "예요")}. 위 칸은 며칠?`,
            options: [`${cs - 1}일`, `${cs}일`, `${cs + CHK.d}일`], answer: 1,
            hint: "위아래 칸은 7 차이예요. 합에서 7을 빼고 반으로 나눠요.", sayHint: `${CHK.sum} 빼기 7은 ${jo(CHK.sum - CHK.d, "이에요")}. 반으로 나누면요?`,
            right: `맞았어요! (${CHK.sum} − 7) ÷ 2 = ${cs}일, 아래 칸은 ${cs + CHK.d}일.`, sayRight: `맞았어요! 위 칸은 ${cs}일, 아래 칸은 ${cs + CHK.d}일이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-05/calendar-weekday-source": (() => {
    const SUM = 29, second = (SUM - 7) / 2, third = second + 7;        // 둘째·셋째 토요일
    const M = month(70, 170, 3, 30);                                   // 1일 수요일 → 토요일 4, 11, 18, 25
    const SAT = 6, dayName = (d) => DAYS[(3 + d - 1) % 7];
    const ask = 30, near = third + 7, stepN = ask - near;
    const CHK = { sum: 31 }, cSecond = (CHK.sum - 7) / 2, cThird = cSecond + 7;    // 둘째·셋째 화요일 12, 19 → 30일 = 토
    const cDay = DAYS[(2 + (30 - (cThird + 7))) % 7];
    const RX = 540;
    return {
      title: "달력에서 요일 찾기",
      kicker: "5권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 요일은 7일마다 돌아와요. 이걸 쓰면 달력을 다 그리지 않아도 날짜의 요일을 찾을 수 있어요.",
          items: [title("달력에서 요일 찾기")] },
        { say: `어느 달의 둘째 토요일과 셋째 토요일 날짜를 더하면 ${jo(SUM, "예요")}. 이 달 ${ask}일은 무슨 요일일까요?`,
          items: [T(RX, 170, `둘째 토 + 셋째 토 = ${SUM}`, "blue", 28), T(RX, 215, `${ask}일은 무슨 요일?`, "red", 28)] },
        { say: "둘째 토요일과 셋째 토요일은 일주일 차이, 7 차이예요. 합에서 7을 빼고 반으로 나누면 둘째 토요일이에요.",
          items: [T(RX, 275, `(${SUM} − 7) ÷ 2 = ${second}`, "blue", 28)] },
        { say: `둘째 토요일은 ${second}일, 셋째 토요일은 ${second} 더하기 7, ${third}일이에요.`,
          items: [T(RX, 320, `둘째 토 ${second}일, 셋째 토 ${third}일`, "green", 26)] },
        { say: `${third}일에서 7씩 더해 ${ask}일 가까이 가요. ${third} 더하기 7은 ${near}. ${near}일도 토요일이에요.`,
          items: [T(RX, 370, `${third} + 7 = ${near} (토)`, "blue", 26)] },
        { say: `${near}일에서 ${ask}일까지는 ${KO[stepN]} 날 더 가요. 토요일에서 하루씩 옮겨요. 일, 월, 화, 수, 목. ${ask}일은 ${dayName(ask)}요일이에요.`,
          items: [T(RX, 420, `토 → 일 → 월 → 화 → 수 → ${dayName(ask)}`, "red", 26)] },
        { say: "달력을 그려서 확인해요. 이 달은 1일이 수요일이에요. 토요일 줄을 보면 4, 11, 18, 25일. 그리고 30일은 목요일 칸에 있어요.",
          items: [...M.items, ...[4, 11, 18, 25].map((d) => M.mark(d)), M.mark(ask, "#f6dcd3"), ...[4, 11, 18, 25].map((d) => M.reWrite(d)), M.reWrite(ask, "red")] },
        { say: "달이 바뀌면 그 달이 며칠까지인지 꼭 보세요. 30일까지 있는 달과 31일까지 있는 달은 다음 달 1일의 요일이 달라져요.",
          items: [T(RX, 480, "달마다 날 수(30일? 31일?)", "gold", 26)] },
        { say: "정리해요. 같은 요일 두 날짜의 합이면, 7을 빼고 반으로 나눠 앞 날짜를 찾아요. 7씩 더해 묻는 날 가까이 가고, 남은 날만큼 요일을 옮겨요.", mood: "praise",
          items: [T(RX, 530, "7씩 건너뛰고, 남은 날만 옮기기", "gold", 26)] },
        { say: `한 문제 풀어 봐요. 어느 달의 둘째 화요일과 셋째 화요일 날짜를 더하면 ${jo(CHK.sum, "이에요")}. 이 달 30일은 무슨 요일일까요?`, mood: "think",
          items: [],
          check: { question: `둘째 화요일 + 셋째 화요일 = ${CHK.sum}일 때, 이 달 30일은 무슨 요일?`,
            options: ["금요일", `${cDay}요일`, "일요일"], answer: 1,
            hint: "(합 − 7) ÷ 2로 둘째 화요일을 찾고, 7씩 더해 가요.", sayHint: `둘째 화요일은 ${cSecond}일, 셋째는 ${cThird}일, 넷째는 ${cThird + 7}일이에요. 30일까지 몇 날 남았을까요?`,
            right: `맞았어요! ${cThird + 7}일이 화요일, 4일 뒤 30일은 ${cDay}요일.`, sayRight: `맞았어요! ${cThird + 7}일이 화요일이니 나흘 뒤 30일은 ${cDay}요일이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()
  ,"book-05/shortest-route-source": (() => {
    const C = 4, R = 3, X0 = 120, Y0 = 150, S = 100;
    const ways = Array.from({ length: R + 1 }, () => Array(C + 1).fill(0));
    for (let r = 0; r <= R; r++) for (let c = 0; c <= C; c++) ways[r][c] = r === 0 || c === 0 ? 1 : ways[r - 1][c] + ways[r][c - 1];
    const P = (r, c) => [X0 + c * S, Y0 + r * S];
    const node = (r, c, color = "blue") => { const [x, y] = P(r, c); return { kind: "node", cx: x, cy: y, r: 28, value: ways[r][c], color, textColor: color === "gray" ? "ink" : color, size: 32, width: 2.5, bg: "#fffdf7" }; };
    const CHK = { c: 5, r: 3 }, chk = (() => { let a = Array(CHK.c + 1).fill(1); for (let r = 1; r <= CHK.r; r++) for (let c = 1; c <= CHK.c; c++) a[c] += a[c - 1]; return a[CHK.c]; })();
    const RX = 620;
    return {
      title: "최단거리 가짓수",
      kicker: "5권 2단원 · 손글씨 개념",
      beats: [
        { say: "바둑판 같은 길에서 오른쪽과 아래로만 가면 가장 짧은 길이에요. 그런 길이 몇 가지인지, 하나씩 그리지 않고 세는 법을 배워요.",
          items: [title("최단거리 가짓수")] },
        { say: `가로 ${KO[C]} 칸, 세로 ${KO[R]} 칸의 길을 그려요. 왼쪽 위가 출발, 오른쪽 아래가 도착이에요.`,
          items: [{ kind: "grid", x: X0, y: Y0, cols: C, rows: R, cell: S, color: "gray" }, T(X0 - 30, Y0 - 24, "출발", "green", 24), T(X0 + C * S - 20, Y0 + R * S + 50, "도착", "red", 24)] },
        { say: "가장 짧게 가려면 오른쪽이나 아래로만 가요. 왼쪽이나 위로 되돌아가면 길어져요.",
          items: [{ kind: "arrow", x1: RX, y1: 170, x2: RX + 60, y2: 170, color: "blue", width: 3 }, { kind: "arrow", x1: RX + 100, y1: 150, x2: RX + 100, y2: 200, color: "blue", width: 3 }, T(RX + 130, 182, "만 가요", "blue", 26)] },
        { say: "맨 윗줄의 점들은 출발에서 오른쪽으로 곧게만 가야 닿아요. 길이 하나뿐이니 모두 1을 써요. 맨 왼쪽 줄도 아래로만 가니 모두 1이에요.",
          items: [...Array.from({ length: C + 1 }, (_, c) => node(0, c, "gray")), ...Array.from({ length: R }, (_, r) => node(r + 1, 0, "gray"))] },
        { say: "안쪽 점에는 두 길로 올 수 있어요. 왼쪽 점에서 오거나, 위쪽 점에서 오거나. 그래서 왼쪽 수와 위쪽 수를 더해요. 첫 안쪽 점은 1 더하기 1, 2예요.",
          items: [node(1, 1, "red"), { kind: "arrow", x1: P(1, 0)[0] + 24, y1: P(1, 0)[1], x2: P(1, 1)[0] - 24, y2: P(1, 1)[1], color: "red", width: 2.5 }, { kind: "arrow", x1: P(0, 1)[0], y1: P(0, 1)[1] + 24, x2: P(1, 1)[0], y2: P(1, 1)[1] - 24, color: "red", width: 2.5 }, T(RX, 260, "안쪽 점 = 왼쪽 + 위쪽", "red", 28)] },
        { say: `둘째 줄을 이어 채워요. 2 더하기 1은 3, 3 더하기 1은 4, 4 더하기 1은 5.`,
          items: [2, 3, 4].map((c) => node(1, c)) },
        { say: `셋째 줄이에요. 1 더하기 2는 3, 3 더하기 3은 6, 6 더하기 4는 10, 10 더하기 5는 15.`,
          items: [1, 2, 3, 4].map((c) => node(2, c)) },
        { say: `넷째 줄이에요. 1 더하기 3은 4, 4 더하기 6은 10, 10 더하기 10은 20, 20 더하기 15는 ${jo(ways[R][C], "예요")}.`,
          items: [1, 2, 3].map((c) => node(3, c)) },
        { say: `도착점의 수가 답이에요. 최단거리는 모두 ${ways[R][C]}가지예요.`,
          items: [node(R, C, "green"), T(RX, 330, `최단거리 = ${ways[R][C]}가지`, "green", 32)] },
        { say: "길이 막혀 있거나 굵은 선으로만 다닐 수 있으면, 다닐 수 있는 선으로 이어진 점의 수만 더해요. 막힌 쪽에서는 아무것도 오지 않아요.",
          items: [T(RX, 400, "막힌 길 → 그쪽 수는 더하지 않기", "gold", 24)] },
        { say: "정리해요. 가장자리 점은 모두 1. 안쪽 점은 왼쪽 수와 위쪽 수를 더해요. 줄마다 차례로 채우면 도착점의 수가 최단거리 가짓수예요.", mood: "praise",
          items: [T(RX, 460, "가장자리 1, 안쪽은 왼쪽 + 위쪽", "gold", 24)] },
        { say: `한 문제 풀어 봐요. 가로 ${KO[CHK.c]} 칸, 세로 ${KO[CHK.r]} 칸인 길에서 최단거리는 몇 가지일까요? 표를 오른쪽으로 한 칸 더 늘려 생각해 봐요.`, mood: "think",
          items: [],
          check: { question: `가로 ${CHK.c}칸, 세로 ${CHK.r}칸인 길에서 왼쪽 위 → 오른쪽 아래 최단거리는 몇 가지?`,
            options: [String(chk - 11), String(chk), String(chk + 14)], answer: 1,
            hint: "지금 표의 오른쪽에 한 줄을 더 이어서 채워요.", sayHint: "맨 윗줄은 1, 둘째 줄은 5 다음 6, 셋째 줄은 15 다음 21이에요. 넷째 줄은 35 다음에 몇일까요?",
            right: `맞았어요! 35 + 21 = ${chk}가지.`, sayRight: `맞았어요! 35 더하기 21, ${chk}가지예요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-05/digit-card-ranked-number": (() => {
    const D = [2, 4, 7], perms = [];
    for (const a of D) for (const b of D) for (const c of D) if (new Set([a, b, c]).size === 3) perms.push(a * 100 + b * 10 + c);
    perms.sort((x, y) => x - y);
    const Z = [0, 3, 5], zp = [];
    for (const a of Z) for (const b of Z) for (const c of Z) if (new Set([a, b, c]).size === 3 && a !== 0) zp.push(a * 100 + b * 10 + c);
    zp.sort((x, y) => x - y);
    const card = (x, y, v, color = "gold") => [{ kind: "box", x, y, w: 56, h: 70, color }, T(x + 28, y + 50, String(v), color, 40, "center")];
    const CHK = [1, 5, 8], cp = []; for (const a of CHK) for (const b of CHK) for (const c of CHK) if (new Set([a, b, c]).size === 3) cp.push(a * 100 + b * 10 + c);
    cp.sort((x, y) => y - x);
    const RX = 560;
    return {
      title: "숫자 카드로 만든 수의 차례를 찾아요",
      kicker: "5권 2단원 · 손글씨 개념",
      beats: [
        { say: "숫자 카드를 한 번씩만 써서 만든 수를 크기 순서로 늘어놓고, 몇 번째 수를 찾는 법을 배워요. 빠짐없이 늘어놓는 차례가 중요해요.",
          items: [title("숫자 카드로 만든 수")] },
        { say: `카드 ${KO[3]} 장, ${jo(D.join(", "), "가")} 있어요. 세 장을 한 번씩만 써서 세 자리 수를 만들어요.`,
          items: D.flatMap((v, i) => card(80 + i * 70, 130, v)) },
        { say: "작은 수부터 늘어놓을 거예요. 가장 높은 자리, 백의 자리부터 정해요. 백의 자리에 가장 작은 2를 놓아요.",
          items: [T(80, 260, "백의 자리부터, 작은 카드부터", "gold", 26)] },
        { say: `백의 자리가 2이면, 남은 카드 4와 7로 십의 자리와 일의 자리를 만들어요. 작은 것부터 ${perms[0]}, ${jo(perms[1], "이에요")}.`,
          items: [T(80, 320, `2□□: ${perms[0]}, ${perms[1]}`, "blue", 30)] },
        { say: `백의 자리가 4이면 남은 카드는 2와 7. ${perms[2]}, ${perms[3]}.`,
          items: [T(80, 370, `4□□: ${perms[2]}, ${perms[3]}`, "blue", 30)] },
        { say: `백의 자리가 7이면 ${perms[4]}, ${perms[5]}. 모두 ${KO[perms.length]} 개예요. 백의 자리마다 두 개씩, 세 번이에요.`,
          items: [T(80, 420, `7□□: ${perms[4]}, ${perms[5]}`, "blue", 30), T(80, 470, `모두 ${perms.length}개 (2개씩 3묶음)`, "gray", 24)] },
        { say: `작은 수부터 넷째는 무엇일까요? 하나, 둘, 셋, 넷. ${jo(perms[3], "이에요")}.`,
          items: [T(RX, 320, `작은 수부터 4번째 = ${perms[3]}`, "green", 30)] },
        { say: `큰 수부터 셀 때는 목록을 거꾸로 읽어요. 큰 수부터 둘째는 ${jo(perms[4], "이에요")}.`,
          items: [T(RX, 370, `큰 수부터 2번째 = ${perms[4]}`, "green", 28)] },
        { say: `0이 있으면 조심해요. 카드 ${Z.join(", ")}로 세 자리 수를 만들 때, 0은 백의 자리에 놓을 수 없어요. 그래서 ${zp.join(", ")}, ${KO[zp.length]} 개뿐이에요.`,
          items: [...Z.flatMap((v, i) => card(RX + i * 70, 420, v, "red")), T(RX, 530, `${zp.join(", ")} (0은 맨 앞 ✗)`, "red", 24)] },
        { say: "정리해요. 가장 높은 자리부터 작은 카드를 차례로 놓고, 남은 카드로 다음 자리를 채워요. 0은 맨 앞에 놓지 않아요. 큰 수부터면 목록을 거꾸로 세요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 카드 ${CHK.join(", ")}로 세 자리 수를 만들 때, 큰 수부터 셋째는 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `카드 ${jo(CHK.join(", "), "를")} 한 번씩 써서 만든 세 자리 수 중 큰 수부터 3번째는?`,
            options: [String(cp[3]), String(cp[2]), String(cp[1])], answer: 1,
            hint: "백의 자리에 가장 큰 8부터 놓아요.", sayHint: `백의 자리가 8이면 ${cp[0]}, ${cp[1]}. 그다음은 백의 자리가 5예요.`,
            right: `맞았어요! ${cp[0]}, ${cp[1]}, ${cp[2]}.`, sayRight: `맞았어요! 큰 수부터 ${cp[0]}, ${cp[1]}, 그다음 ${jo(cp[2], "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-05/two-digit-condition-source": (() => {
    const SUM = 7, list = []; for (let t = 1; t <= 9; t++) { const o = SUM - t; if (o >= 0 && o <= 9) list.push(t * 10 + o); }
    const DIF = 3, dl = []; for (let t = 1; t <= 9; t++) for (const o of [t - DIF, t + DIF]) if (o >= 0 && o <= 9) dl.push(t * 10 + o);
    dl.sort((a, b) => a - b);
    const CHK = 12, cl = []; for (let t = 1; t <= 9; t++) { const o = CHK - t; if (o >= 0 && o <= 9) cl.push(t * 10 + o); }
    const RX = 560;
    return {
      title: "조건에 맞는 두 자리 수",
      kicker: "5권 2단원 · 손글씨 개념",
      beats: [
        { say: "십의 자리 숫자와 일의 자리 숫자에 조건이 있을 때, 맞는 수를 빠짐없이 적고 몇 번째 수를 찾아요.",
          items: [title("조건에 맞는 두 자리 수")] },
        { say: "두 자리 수의 십의 자리에는 1부터 9까지, 일의 자리에는 0부터 9까지 올 수 있어요. 십의 자리에 0은 안 돼요.",
          items: [T(80, 160, "십의 자리: 1~9,  일의 자리: 0~9", "blue", 28)] },
        { say: `조건이에요. 십의 자리 숫자와 일의 자리 숫자를 더하면 ${jo(SUM, "이에요")}.`,
          items: [T(80, 215, `십 + 일 = ${SUM}`, "gold", 32)] },
        { say: `빠뜨리지 않게 십의 자리에 1부터 차례로 놓아요. 1이면 일의 자리는 6, 16. 2면 5, 25. 3이면 4, 34.`,
          items: [T(80, 275, list.slice(0, 3).join(", "), "blue", 32)] },
        { say: `계속해요. ${list.slice(3).join(", ")}. 십의 자리가 8이면 일의 자리가 −1이 되어야 해서 안 돼요. 모두 ${KO[list.length]} 개예요.`,
          items: [T(80, 325, list.join(", "), "blue", 32), T(80, 370, `모두 ${list.length}개`, "gray", 24)] },
        { say: `십의 자리를 1부터 적었으니 이미 작은 수부터예요. 작은 수부터 넷째는 하나, 둘, 셋, 넷, ${jo(list[3], "이에요")}.`,
          items: [T(RX, 275, `작은 수부터 4번째 = ${list[3]}`, "green", 28)] },
        { say: `큰 수부터 셋째는 목록을 거꾸로 세요. ${list.at(-1)}, ${list.at(-2)}, ${list.at(-3)}. ${jo(list.at(-3), "예요")}.`,
          items: [T(RX, 325, `큰 수부터 3번째 = ${list.at(-3)}`, "green", 28)] },
        { say: `조건이 차이일 때도 같아요. 두 숫자의 차가 3이면, 일의 자리가 십의 자리보다 3 클 수도 있고 3 작을 수도 있어요. 두 경우를 다 적어요.`,
          items: [T(80, 440, `차 = ${DIF}: 일 = 십 + ${DIF} 또는 일 = 십 − ${DIF}`, "gold", 26)] },
        { say: `십의 자리를 1부터 차례로 놓고 두 경우를 다 찾아 적어요. ${dl.slice(0, 6).join(", ")}, 이렇게 차례로 적으면 모두 ${dl.length}개예요.`,
          items: [T(80, 490, dl.join(", "), "blue", 22)] },
        { say: "정리해요. 십의 자리에 1부터 차례로 놓고, 조건에 맞는 일의 자리를 찾아요. 차이 조건은 두 경우를 다 봐요. 작은 수부터 적은 목록에서 세고, 큰 수부터면 거꾸로 세요.", mood: "praise",
          items: [T(RX, 380, "십의 자리 1부터 차례로!", "gold", 28)] },
        { say: `한 문제 풀어 봐요. 십의 자리 숫자와 일의 자리 숫자의 합이 ${jo(CHK, "인")} 두 자리 수 중, 작은 수부터 셋째는 무엇일까요?`, mood: "think",
          items: [],
          check: { question: `십의 자리 + 일의 자리 = ${CHK}인 두 자리 수 중 작은 수부터 3번째는?`,
            options: [String(cl[1]), String(cl[2]), String(cl[3])], answer: 1,
            hint: "일의 자리는 9까지예요. 십의 자리를 3부터 놓아요.", sayHint: `십의 자리가 1이나 2면 일의 자리가 11이나 10이 되어 안 돼요. 3부터 ${cl.slice(0, 2).join(", ")}… 그다음은요?`,
            right: `맞았어요! ${cl.slice(0, 3).join(", ")}.`, sayRight: `맞았어요! ${cl.slice(0, 2).join(", ")}, 그다음 ${jo(cl[2], "이에요")}. 이제 게임으로 가요.` } }
      ]
    };
  })()
};
