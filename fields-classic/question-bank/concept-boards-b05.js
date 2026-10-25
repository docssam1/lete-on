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
};
