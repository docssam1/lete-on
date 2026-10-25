// 손글씨 판서 대본 — 7권(달력과 시계·규칙·가로수 심기·팔린드롬과 벤 다이어그램). 쓰는 법은 concept-boards.js 머리말과 같다.
// 판서의 날짜·시각은 골든벨 7권 문항(9/1 일, 3/1 월, 1/1 수, 5/11 금, 1/29 수, 4/17 목 …, 11시 10분·9시 20분·5시 45분 등)과
// 겹치지 않게 골랐다.

import { jo } from "./concept-board-kit.js?v=20261025f";

const T = (x, y, text, color = "ink", size = 30, align) => ({ kind: "text", x, y, text, size, color, align });
const title = (text) => ({ kind: "text", x: 60, y: 80, text, size: 54 });
const KO = { 1: "한", 2: "두", 3: "세", 4: "네", 5: "다섯", 6: "여섯", 7: "일곱", 8: "여덟", 9: "아홉", 10: "열" };
const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const shift = (d, n) => DAYS[((DAYS.indexOf(d) + n) % 7 + 7) % 7];
// 요일 바퀴: 일~토 일곱 칸을 둥글게 놓고, 한 칸씩 옮겨 가는 화살표를 그린다
const wheel = (cx, cy, r = 130) => {
  const at = (i) => { const a = (i * 360 / 7 - 90) * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  const items = DAYS.map((d, i) => { const [x, y] = at(i); return { kind: "node", cx: x, cy: y, r: 32, value: d, color: i === 0 ? "red" : i === 6 ? "blue" : "ink", size: 30 }; });
  const ring = (d, color = "green") => { const [x, y] = at(DAYS.indexOf(d)); return { kind: "ring", cx: x, cy: y, r: 42, color }; };
  const step = (from, n, color = "gold") => Array.from({ length: n }, (_, k) => { const i = (DAYS.indexOf(from) + k) % 7, [x1, y1] = at(i), [x2, y2] = at((i + 1) % 7);
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ox = (mx - cx) * 0.6, oy = (my - cy) * 0.6;   // 바퀴 바깥으로 휘게
    const qx = mx + ox, qy = my + oy, cut = (x, y) => { const L = Math.hypot(qx - x, qy - y); return [x + (qx - x) / L * 34, y + (qy - y) / L * 34]; };   // 동그라미 가장자리에서 시작·끝
    const [ax, ay] = cut(x1, y1), [bx, by] = cut(x2, y2);
    return { kind: "path", d: `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${qx.toFixed(1)} ${qy.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`, stroke: color, width: 3 }; });
  return { items, ring, step };
};

export const BOARDS_B07 = {
  "book-07/calendar-within-month-source": (() => {
    const START = "화", D0 = 3, D1 = 26, diff = D1 - D0, wk = Math.floor(diff / 7), rest = diff % 7, ans = shift(START, rest);
    const W = wheel(260, 380);
    const CHK = { from: "목", n: 12 }, chk = shift(CHK.from, CHK.n);
    const RX = 520;
    return {
      title: "한 달 안에서 요일 찾기",
      kicker: "7권 1단원 · 손글씨 개념",
      beats: [
        { say: "같은 달 안에서, 어느 날의 요일을 알면 다른 날의 요일도 찾을 수 있어요. 7일마다 같은 요일로 돌아온다는 것을 써요.",
          items: [title("한 달 안에서 요일 찾기")] },
        { say: "요일 일곱 개를 둥글게 그려요. 한 칸씩 가면 하루 뒤, 일곱 칸 가면 한 바퀴 돌아 같은 요일이에요.",
          items: W.items },
        { say: `${D0}일이 ${START}요일이에요. ${D1}일은 무슨 요일일까요?`,
          items: [W.ring(START), T(RX, 170, `${D0}일 = ${START}요일`, "green", 30), T(RX, 220, `${D1}일 = ?`, "red", 30)] },
        { say: `먼저 두 날짜가 며칠 차이인지 구해요. ${D1} 빼기 ${jo(D0, "은")} ${jo(diff, "이에요")}.`,
          items: [T(RX, 280, `${D1} − ${D0} = ${diff}일`, "blue", 30)] },
        { say: `${diff}일을 7일씩 묶어요. 7, 14, 21. 세 묶음이 ${wk * 7}일, 남는 날은 ${jo(rest, "이에요")}.`,
          items: [T(RX, 330, `${diff} = 7 × ${wk} + ${rest}`, "blue", 30)] },
        { say: `7일 묶음은 요일 바퀴를 한 바퀴씩 돌아 제자리예요. 그러니 남은 ${rest}일만 옮기면 돼요.`,
          items: [T(RX, 380, `7일씩은 제자리 → 남은 ${rest}일만`, "gold", 26)] },
        { say: `${START}요일에서 ${KO[rest]} 칸 가요. ${Array.from({ length: rest }, (_, k) => shift(START, k + 1)).join(", ")}. ${D1}일은 ${ans}요일이에요.`,
          items: [...W.step(START, rest), W.ring(ans, "red"), T(RX, 440, `${D1}일 = ${ans}요일`, "green", 32)] },
        { say: `7씩 더해 확인해도 돼요. ${D0}, ${D0 + 7}, ${D0 + 14}, ${D0 + 21}일이 모두 ${START}요일. ${D0 + 21}일에서 ${KO[D1 - D0 - 21]} 날 더 가면 ${jo(D1, "이에요")}.`,
          items: [T(RX, 500, `${D0}, ${D0 + 7}, ${D0 + 14}, ${D0 + 21} (${START})`, "gray", 24)] },
        { say: "정리해요. 두 날짜의 차를 구해 7일씩 묶어요. 묶음은 제자리, 남은 날만큼 요일을 옮겨요.", mood: "praise",
          items: [T(RX, 555, "차이 → 7씩 묶고 → 남은 날만", "gold", 26)] },
        { say: `한 문제 풀어 봐요. ${CHK.from}요일에서 ${CHK.n}일 뒤는 무슨 요일일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.from}요일에서 ${CHK.n}일 뒤는 무슨 요일?`,
            options: [`${shift(CHK.from, CHK.n - 1)}요일`, `${chk}요일`, `${shift(CHK.from, CHK.n + 1)}요일`], answer: 1,
            hint: "12일 = 7일 + 5일. 남은 5일만 옮겨요.", sayHint: `일곱 날은 제자리예요. ${CHK.from}요일에서 다섯 칸 가요.`,
            right: `맞았어요! ${CHK.n} = 7 + 5, ${CHK.from} → ${chk}.`, sayRight: `맞았어요! 다섯 칸 가면 ${chk}요일이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-07/calendar-next-month-source": (() => {
    const MON = [[2, 28], [4, 30], [3, 31]];
    const START = "금", W = wheel(260, 380);
    const r31 = 31 % 7, ans31 = shift(START, r31), r30 = 30 % 7, ans30 = shift(START, r30);
    const CHK = { from: "일", days: 31 }, chk = shift(CHK.from, CHK.days % 7);
    const RX = 520;
    return {
      title: "한 달 뒤 같은 날의 요일",
      kicker: "7권 1단원 · 손글씨 개념",
      beats: [
        { say: "이번 달 어느 날의 요일을 알 때, 다음 달 같은 날은 무슨 요일일까요? 이번 달이 며칠까지 있는지가 열쇠예요.",
          items: [title("한 달 뒤 같은 날")] },
        { say: "달마다 날 수가 달라요. 2월은 28일, 4월·6월·9월·11월은 30일, 나머지 달은 31일까지 있어요.",
          items: [T(RX, 160, "28일: 2월", "gray", 26), T(RX, 200, "30일: 4, 6, 9, 11월", "gray", 26), T(RX, 240, "31일: 1, 3, 5, 7, 8, 10, 12월", "gray", 26)] },
        { say: "28일은 7일씩 딱 네 묶음이에요. 남는 날이 없어요. 그래서 2월 어느 날과 3월 같은 날은 같은 요일이에요.",
          items: [T(RX, 300, "28 = 7 × 4 + 0 → 같은 요일", "blue", 26)] },
        { say: `31일까지 있는 달은 7일씩 네 묶음에 3일이 남아요. 그래서 다음 달 같은 날은 요일이 세 칸 옮겨 가요.`,
          items: [T(RX, 350, "31 = 7 × 4 + 3 → 세 칸", "blue", 26)] },
        { say: `3월 5일이 ${START}요일이면, 4월 5일은? 3월은 31일까지니까 세 칸 옮겨요. ${Array.from({ length: r31 }, (_, k) => shift(START, k + 1)).join(", ")}. ${ans31}요일이에요.`,
          items: [...W.items, W.ring(START), ...W.step(START, r31), W.ring(ans31, "red"), T(RX, 410, `3/5 ${START} → 4/5 ${ans31}`, "green", 28)] },
        { say: `30일까지 있는 달은 남는 날이 2일. 두 칸 옮겨요. 4월 5일이 ${ans31}요일이면 5월 5일은 두 칸 더 가서 ${shift(ans31, 2)}요일이에요.`,
          items: [T(RX, 460, `30 = 7 × 4 + 2 → 두 칸,  5/5 ${shift(ans31, 2)}`, "green", 26)] },
        { say: "두 달 넘게 가면 한 달씩 차례로 옮겨요. 달마다 날 수가 다르니까 한꺼번에 하지 말고 한 달씩요.",
          items: [T(RX, 515, "한 달씩 차례로!", "gold", 28)] },
        { say: "정리해요. 처음 달이 며칠까지인지 보고, 7일씩 묶은 뒤 남는 날만큼 요일을 옮겨요. 28일은 그대로, 30일은 두 칸, 31일은 세 칸이에요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. 7월 10일이 ${CHK.from}요일이에요. 8월 10일은 무슨 요일일까요? 7월은 31일까지 있어요.`, mood: "think",
          items: [],
          check: { question: `7월 10일이 ${CHK.from}요일이면 8월 10일은? (7월은 31일까지)`,
            options: [`${CHK.from}요일`, `${shift(CHK.from, 2)}요일`, `${chk}요일`], answer: 2,
            hint: "31일은 7일씩 네 묶음과 3일이에요.", sayHint: `${CHK.from}요일에서 세 칸 옮겨요.`,
            right: `맞았어요! ${CHK.from} → ${chk} (세 칸).`, sayRight: `맞았어요! 세 칸 옮겨 ${chk}요일이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-07/calendar-weekday": (() => {
    const A = { m: 6, d: 14, day: "목" }, B = { m: 8, d: 20 };
    const left6 = 30 - A.d, total = left6 + 31 + B.d, rest = total % 7, ans = shift(A.day, rest);
    const W = wheel(790, 380, 110);
    const CHK = { m1: 10, d1: 25, day: "월", m2: 11, d2: 9 }, cTot = (31 - CHK.d1) + CHK.d2, chk = shift(CHK.day, cTot % 7);
    return {
      title: "날짜를 옮겨 요일을 찾아요",
      kicker: "7권 1단원 · 손글씨 개념",
      beats: [
        { say: "달을 넘어가는 두 날짜 사이에 며칠이 있는지 세고, 7일씩 묶어 요일을 찾아요. 달마다 며칠까지인지 꼭 봐요.",
          items: [title("달을 넘어 요일 찾기")] },
        { say: `${A.m}월 ${A.d}일이 ${A.day}요일이에요. ${B.m}월 ${B.d}일은 무슨 요일일까요?`,
          items: [T(80, 160, `${A.m}/${A.d} = ${A.day}요일 → ${B.m}/${B.d} = ?`, "blue", 32)] },
        { say: `${A.m}월은 30일까지 있어요. ${A.d}일에서 30일까지 남은 날은 30 빼기 ${A.d}, ${left6}일.`,
          items: [T(80, 230, `6월 남은 날: 30 − ${A.d} = ${left6}`, "ink", 28)] },
        { say: "7월은 31일 전부 지나가요. 31일.",
          items: [T(80, 280, "7월: 31", "ink", 28)] },
        { say: `8월은 1일부터 ${B.d}일까지, ${B.d}일.`,
          items: [T(80, 330, `8월: ${B.d}`, "ink", 28)] },
        { say: `모두 더해요. ${left6} 더하기 31 더하기 ${jo(B.d, "은")} ${total}일 뒤예요.`,
          items: [T(80, 390, `${left6} + 31 + ${B.d} = ${total}일`, "blue", 32)] },
        { say: `${jo(total, "을")} 7일씩 묶어요. 7 곱하기 9는 63. ${total} 빼기 63은 ${rest}. 남은 날은 ${rest}일이에요.`,
          items: [T(80, 445, `${total} = 7 × ${Math.floor(total / 7)} + ${rest}`, "green", 30)] },
        { say: `${A.day}요일에서 ${KO[rest]} 칸 가요. ${Array.from({ length: rest }, (_, k) => shift(A.day, k + 1)).join(", ")}. ${B.m}월 ${B.d}일은 ${ans}요일이에요.`,
          items: [...W.items, W.ring(A.day), ...W.step(A.day, rest), W.ring(ans, "red"), T(80, 505, `${B.m}/${B.d} = ${ans}요일`, "red", 32)] },
        { say: "정리해요. 처음 달의 남은 날, 가운데 달 전체, 마지막 달의 날을 더해 며칠 뒤인지 구해요. 7일씩 묶고 남은 날만큼 요일을 옮겨요.", mood: "praise",
          items: [T(80, 560, "남은 날 + 가운데 달 + 마지막 날", "gold", 26)] },
        { say: `한 문제 풀어 봐요. ${CHK.m1}월 ${CHK.d1}일이 ${CHK.day}요일이에요. ${CHK.m2}월 ${CHK.d2}일은 무슨 요일일까요? ${CHK.m1}월은 31일까지 있어요.`, mood: "think",
          items: [],
          check: { question: `${CHK.m1}월 ${CHK.d1}일이 ${CHK.day}요일이면 ${CHK.m2}월 ${CHK.d2}일은? (${CHK.m1}월은 31일까지)`,
            options: [`${shift(chk, -1)}요일`, `${chk}요일`, `${shift(chk, 1)}요일`], answer: 1,
            hint: "10월 남은 날 + 11월 날을 더해 며칠 뒤인지 구해요.", sayHint: `31 빼기 ${jo(CHK.d1, "는")} ${31 - CHK.d1}, 더하기 ${jo(CHK.d2, "는")} ${jo(cTot, "예요")}. 7일씩 묶으면 남는 날은요?`,
            right: `맞았어요! ${cTot}일 뒤 = 7 × ${Math.floor(cTot / 7)} + ${cTot % 7}, ${chk}요일.`, sayRight: `맞았어요! ${cTot}일 뒤라 ${KO[cTot % 7]} 칸 옮겨 ${chk}요일이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-07/clock-reading": (() => {
    const C = { cx: 260, cy: 340, r: 170 }, H = 4, M = 40, hourTo = H + M / 60, minTo = M / 5;
    const CHK = { h: 9, m: 25 };
    const RX = 520;
    return {
      title: "시계를 읽어요",
      kicker: "7권 1단원 · 손글씨 개념",
      beats: [
        { say: "바늘 시계를 읽을 때는 긴바늘로 분을, 짧은바늘로 시를 읽어요. 긴바늘부터 읽으면 헷갈리지 않아요.",
          items: [title("시계 읽기")] },
        { say: "시계판을 그려요. 숫자 1부터 12까지.",
          items: [{ kind: "clock", ...C }] },
        { say: "긴바늘은 한 바퀴에 60분이에요. 숫자 한 칸은 5분. 1을 가리키면 5분, 2면 10분, 3이면 15분.",
          items: [T(RX, 170, "긴바늘: 숫자 1칸 = 5분", "blue", 28)] },
        { say: `긴바늘을 그려요. 숫자 ${jo(minTo, "을")} 가리켜요. 5씩 세면 5, 10, 15, 20, 25, 30, 35, ${M}. ${M}분이에요.`,
          items: [{ kind: "hand", ...C, to: minTo, len: 0.78, color: "blue", width: 5 }, T(RX, 225, `긴바늘 ${minTo} → ${M}분`, "blue", 28)] },
        { say: `짧은바늘을 그려요. ${jo(H, "와")} ${H + 1} 사이에 있어요. 아직 ${H + 1}에 닿지 않았으니 ${H}시예요.`,
          items: [{ kind: "hand", ...C, to: hourTo, len: 0.48, color: "red", width: 8 }, T(RX, 285, `짧은바늘 ${jo(H, "와")} ${H + 1} 사이 → ${H}시`, "red", 28)] },
        { say: `그래서 ${H}시 ${M}분이에요.`,
          items: [T(RX, 350, `${H}시 ${M}분`, "green", 40)] },
        { say: `짧은바늘이 숫자 사이에 있는 까닭이 있어요. 긴바늘이 한 바퀴 도는 동안 짧은바늘은 한 칸 가요. ${M}분이면 한 바퀴의 3분의 2만큼 왔으니, 짧은바늘도 ${H}에서 ${H + 1} 쪽으로 3분의 2쯤 와 있어요.`,
          items: [T(RX, 420, "짧은바늘은 분에 따라 조금씩 움직여요", "gold", 24)] },
        { say: "정리해요. 긴바늘이 가리키는 숫자에 5를 곱해 분을 읽어요. 짧은바늘은 지나온 숫자로 시를 읽어요. 두 숫자 사이면 작은 쪽이에요. 12와 1 사이면 12시예요.", mood: "praise",
          items: [T(RX, 490, "분: 긴바늘 × 5,  시: 지나온 숫자", "gold", 24)] },
        { say: `한 문제 풀어 봐요. 긴바늘이 ${jo(CHK.m / 5, "를")} 가리키고, 짧은바늘이 ${jo(CHK.h, "와")} ${CHK.h + 1} 사이에 있어요. 몇 시 몇 분일까요?`, mood: "think",
          items: [],
          check: { question: `긴바늘이 ${CHK.m / 5}, 짧은바늘이 ${jo(CHK.h, "와")} ${CHK.h + 1} 사이예요. 몇 시 몇 분?`,
            options: [`${CHK.h}시 ${CHK.m / 5}분`, `${CHK.h}시 ${CHK.m}분`, `${CHK.h + 1}시 ${CHK.m}분`], answer: 1,
            hint: "긴바늘 숫자에 5를 곱해요. 시는 지나온 숫자예요.", sayHint: `${CHK.m / 5} 곱하기 5는 ${jo(CHK.m, "예요")}. 짧은바늘은 ${jo(CHK.h, "를")} 지났어요.`,
            right: `맞았어요! ${CHK.h}시 ${CHK.m}분.`, sayRight: `맞았어요! ${CHK.h}시 ${CHK.m}분이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-07/time-unit-source": (() => {
    const A = { h: 2, m: 15 }, aMin = A.h * 60 + A.m;
    const B = 200, bH = Math.floor(B / 60), bM = B % 60;
    const D = { d: 3, h: 5 }, dH = D.d * 24 + D.h;
    const CHK = { h: 1, m: 45 }, chk = CHK.h * 60 + CHK.m;
    const RX = 560;
    return {
      title: "시간 단위 바꾸기",
      kicker: "7권 1단원 · 손글씨 개념",
      beats: [
        { say: "시간에는 여러 단위가 있어요. 큰 단위 하나가 작은 단위 몇 개인지 알면 서로 바꿀 수 있어요.",
          items: [title("시간 단위 바꾸기")] },
        { say: "약속을 써요. 1일은 24시간. 1시간은 60분. 1분은 60초. 1주일은 7일. 1년은 12개월.",
          items: [{ kind: "box", x: 70, y: 130, w: 420, h: 230, color: "gold" }, T(90, 175, "1일 = 24시간", "ink", 28), T(90, 215, "1시간 = 60분", "ink", 28), T(90, 255, "1분 = 60초", "ink", 28), T(90, 295, "1주일 = 7일", "ink", 28), T(90, 335, "1년 = 12개월", "ink", 28)] },
        { say: `${A.h}시간 ${A.m}분은 몇 분일까요? 1시간이 60분이니 ${A.h}시간은 60 더하기 60, ${A.h * 60}분. 거기에 ${A.m}분을 더해 ${aMin}분이에요.`,
          items: [T(RX, 170, `${A.h}시간 ${A.m}분 = ${A.h * 60} + ${A.m} = ${aMin}분`, "blue", 26)] },
        { say: `거꾸로 ${B}분은 몇 시간 몇 분일까요? 60분씩 묶어요. 60, 120, 180. 세 묶음이 ${bH}시간, 남는 것은 ${B} 빼기 180, ${bM}분이에요.`,
          items: [T(RX, 240, `${B}분 = 60 × ${bH} + ${bM}`, "blue", 26), T(RX, 285, `= ${bH}시간 ${bM}분`, "green", 28)] },
        { say: `${D.d}일 ${D.h}시간은 몇 시간일까요? 1일은 24시간이니 ${D.d}일은 24를 세 번, ${D.d * 24}시간. 더하기 ${D.h}, ${dH}시간이에요.`,
          items: [T(RX, 350, `${D.d}일 ${D.h}시간 = ${D.d * 24} + ${D.h} = ${dH}시간`, "blue", 26)] },
        { say: "큰 단위를 작은 단위로 바꿀 때는 곱하고 더해요. 작은 단위를 큰 단위로 바꿀 때는 묶음으로 나누고, 남는 것은 그대로 둬요.",
          items: [T(RX, 420, "큰 → 작은: 곱하고 더하기", "gold", 24), T(RX, 460, "작은 → 큰: 묶고 남은 것", "gold", 24)] },
        { say: "정리해요. 큰 단위 하나가 작은 단위 몇 개인지 떠올려요. 60분, 24시간, 7일, 12개월. 곱해서 더하거나, 묶어서 나눠요.", mood: "praise",
          items: [] },
        { say: `한 문제 풀어 봐요. ${CHK.h}시간 ${CHK.m}분은 몇 분일까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.h}시간 ${CHK.m}분은 몇 분?`,
            options: [`${CHK.h * 100 + CHK.m}분`, `${chk}분`, `${CHK.h + CHK.m}분`], answer: 1,
            hint: "1시간은 100분이 아니라 60분이에요.", sayHint: `60분에 ${CHK.m}분을 더해요.`,
            right: `맞았어요! 60 + ${CHK.m} = ${chk}분.`, sayRight: `맞았어요! 60 더하기 ${jo(CHK.m, "는")} ${chk}분이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()

  ,"book-07/elapsed-time": (() => {
    const S = { h: 8, m: 35 }, E = { h: 11, m: 20 };
    const borrowM = E.m + 60 - S.m, borrowH = E.h - 1 - S.h;
    const P = { h: 10, m: 50 }, dur = { h: 2, m: 25 }, endM = P.m + dur.m, endH = P.h + dur.h + Math.floor(endM / 60), endMm = endM % 60;
    const pmH = endH > 12 ? endH - 12 : endH;
    const CHK = { s: { h: 7, m: 45 }, e: { h: 9, m: 10 } }, cM = CHK.e.m + 60 - CHK.s.m, cH = CHK.e.h - 1 - CHK.s.h;
    const RX = 560;
    return {
      title: "시작과 끝 사이의 시간을 구해요",
      kicker: "7권 1단원 · 손글씨 개념",
      beats: [
        { say: "두 시각 사이에 얼마나 지났는지, 그리고 어떤 시각에서 몇 시간 지나면 몇 시인지 계산해요. 시는 시끼리, 분은 분끼리. 60분이 1시간이라는 것을 꼭 기억해요.",
          items: [title("걸린 시간 구하기")] },
        { say: `${S.h}시 ${S.m}분에 시작해서 ${E.h}시 ${E.m}분에 끝났어요. 얼마나 걸렸을까요? 세로로 맞춰 써요.`,
          items: [T(140, 190, `${E.h}시`, "ink", 36, "right"), T(250, 190, `${E.m}분`, "ink", 36, "right"), T(40, 245, "−", "ink", 36), T(140, 245, `${S.h}시`, "ink", 36, "right"), T(250, 245, `${S.m}분`, "ink", 36, "right"), { kind: "line", x1: 40, y1: 265, x2: 270, y2: 265, color: "ink", width: 3 }] },
        { say: `분끼리 빼요. ${E.m}분에서 ${S.m}분은 뺄 수 없어요. 1시간을 빌려 와 60분으로 바꿔요. ${E.m} 더하기 60은 ${E.m + 60}분.`,
          items: [{ kind: "line", x1: 92, y1: 180, x2: 122, y2: 172, color: "red", width: 2.5 }, T(108, 150, `${E.h - 1}`, "red", 26, "center"), { kind: "line", x1: 196, y1: 180, x2: 226, y2: 172, color: "red", width: 2.5 }, T(212, 150, `${E.m + 60}`, "red", 26, "center")] },
        { say: `${E.m + 60} 빼기 ${jo(S.m, "는")} ${borrowM}분. 시는 1을 빌려 줬으니 ${E.h - 1} 빼기 ${S.h}, ${borrowH}시간.`,
          items: [T(140, 310, `${borrowH}시간`, "green", 36, "right"), T(250, 310, `${borrowM}분`, "green", 36, "right")] },
        { say: `걸린 시간은 ${borrowH}시간 ${borrowM}분이에요. 시작 시각에 더해서 확인해요. ${S.h}시 ${S.m}분 더하기 ${borrowH}시간 ${borrowM}분은 ${E.h}시 ${E.m}분.`,
          items: [T(RX, 300, `${S.h}:${S.m} + ${borrowH}:${borrowM} = ${E.h}:${E.m} ✓`, "green", 26)] },
        { say: `이번엔 더하기예요. ${P.h}시 ${P.m}분에 시작한 공연이 ${dur.h}시간 ${dur.m}분 동안 해요. 분끼리 더하면 ${P.m} 더하기 ${dur.m}, ${endM}분. 60분이 넘었어요.`,
          items: [T(80, 400, `${P.h}시 ${P.m}분 + ${dur.h}시간 ${dur.m}분`, "blue", 30), T(80, 445, `분: ${P.m} + ${dur.m} = ${endM} → 1시간 ${endMm}분`, "blue", 26)] },
        { say: `60분을 1시간으로 올려요. ${endM}분은 1시간 ${endMm}분. 시는 ${P.h} 더하기 ${dur.h} 더하기 올라온 1, ${endH}시. 낮 12시를 지났으니 오후 ${pmH}시 ${endMm}분이에요.`,
          items: [T(80, 495, `시: ${P.h} + ${dur.h} + 1 = ${endH}시 → 오후 ${pmH}시 ${endMm}분`, "green", 26)] },
        { say: "오전과 오후가 섞이면, 오후 시각에 12를 더해 같은 기준으로 놓고 계산해요. 오후 1시는 13시예요.",
          items: [T(RX, 400, "오후 시각 + 12 → 같은 기준", "gold", 24)] },
        { say: "정리해요. 시는 시끼리, 분은 분끼리 계산해요. 분이 모자라면 1시간을 60분으로 빌려 오고, 60분이 넘으면 1시간으로 올려요. 구한 시간을 다시 더해 확인해요.", mood: "praise",
          items: [T(RX, 460, "60분 = 1시간 빌리고 올리기", "gold", 24)] },
        { say: `한 문제 풀어 봐요. ${CHK.s.h}시 ${CHK.s.m}분부터 ${CHK.e.h}시 ${CHK.e.m}분까지는 얼마나 걸렸을까요?`, mood: "think",
          items: [],
          check: { question: `${CHK.s.h}시 ${CHK.s.m}분부터 ${CHK.e.h}시 ${CHK.e.m}분까지 걸린 시간은?`,
            options: [`${CHK.e.h - CHK.s.h}시간 ${cM}분`, `${cH}시간 ${cM}분`, `${cH}시간 ${cM + 10}분`], answer: 1,
            hint: "10분에서 45분을 뺄 수 없으니 1시간을 빌려 와요.", sayHint: "10분에 60분을 더해 70분, 70 빼기 45는 25분. 시는 1을 빌려 줬으니 8 빼기 7이에요.",
            right: `맞았어요! ${cH}시간 ${cM}분.`, sayRight: `맞았어요! ${cH}시간 ${cM}분이에요. 이제 게임으로 가요.` } }
      ]
    };
  })()
};
