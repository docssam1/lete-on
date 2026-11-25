// 2과정·3과정 권별 테스트 그림의 길이 표시 — 스킬 gfield-textbook-design 4-3(원장 2026-11-16 기준,
// 2026-11-24 「도형의 변의 길이를 점선 호를 사용하여 길이를 써야지 기준이잖아」).
// 선발시험 시험지 도구의 dim(바깥 곡선 점선 + 가운데 끊은 자리에 숫자·단위)을 그대로 쓰고, 곡선이 얼마나 휘어야
// 글자가 변에 닿지 않는지만 여기서 정한다(글자 자리 크기 + 틈).
//   lenArc(a, b, label, { side, far, size, blank, unit, varName })
//   a, b: 잴 구간의 두 끝 {x, y}
//   side: +1 이면 a→b 진행 방향에서 (−dy, dx) 쪽(왼쪽에서 오른쪽 가로선이면 아래), −1 이면 반대쪽 — 도형 바깥쪽으로 고른다.
//   far: 기본 거리에 더 띄우는 만큼 — 전체 길이를 부분 길이보다 바깥에 둘 때.
//   blank: 빈 답 칸(□ + 단위) · varName: 「x cm」의 x처럼 기울여 쓸 글자(맨 앞 글자 하나).
//   atLeast: 원래 그림의 휜 정도를 지킬 때 이보다 덜 휘지 않는다 · bend: 휜 정도를 직접.
//   halo: 글자가 도형 속 다른 선(칸 선 등) 위에 놓일 수밖에 없을 때 글자 둘레에 흰 테(점선은 그대로 끊는다).
import { dim } from "../selection-test-originals/kit.js?v=20261116a";

const textW = (value, size) => [...String(value)].reduce((w, ch) => w + (/[0-9]/.test(ch) ? 0.58 : /[mwMW]/.test(ch) ? 0.88 : /[a-z]/i.test(ch) ? 0.6 : 0.95) * size, 0);

export function lenArc(a, b, label = "", { side = 1, far = 0, size = 13, blank = false, unit = "cm", varName = false, halo = false, clear = 4, bend = null, atLeast = 0, boxW = 26, boxH = 20 } = {}) {
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, nx = -(b.y - a.y) / len, ny = (b.x - a.x) / len;
  const w = blank ? boxW + (unit ? textW(unit, size) + 4 : 0) : textW(label, size), h = blank ? boxH : size * 1.15;
  const outside = (w + 8) > len * 0.6;   // dim(gap 4)와 같은 기준 — 짧은 구간은 글자가 곡선 꼭대기 바깥으로 나간다
  const reach = Math.abs(nx) * w / 2 + Math.abs(ny) * h / 2;
  const d = bend ?? Math.max(atLeast, (outside ? Math.min(10, Math.max(6, len * 0.12)) : reach + clear) + far);
  let out = dim(a.x, a.y, b.x, b.y, (side < 0 ? -1 : 1) * d, label, { blank, unit, size, boxW, boxH, gap: 4 });
  if (halo) out = out.replace(/(<text [^>]*style=")/, "$1paint-order:stroke;stroke:#fff;stroke-width:4px;stroke-linejoin:round;");
  if (varName) {
    const s = String(label), v = s[0], rest = s.slice(1);
    out = out.replace(`>${s}</text>`, `><tspan style="font-style:italic;font-family:'Times New Roman',serif;font-size:${size + 1.5}px">${v}</tspan>${rest}</text>`);
  }
  return out;
}
// 도형 가운데 c 를 주면 바깥쪽을 알아서 고른다
export function lenOut(a, b, c, label, opts = {}) {
  const nx = -(b.y - a.y), ny = b.x - a.x, m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  return lenArc(a, b, label, { ...opts, side: (m.x - c.x) * nx + (m.y - c.y) * ny >= 0 ? 1 : -1 });
}
