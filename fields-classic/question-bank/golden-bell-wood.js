// 골든벨 게임의 나무 판 결(지오메트리 게임 crystal-cubes의 나무 결과 같은 그림).
// 3D 무대는 이 캔버스를 바로 재질로 쓰고, HTML 게임 판은 같은 그림을 구운 assets/game-wood.webp를 배경으로 쓴다
// (tools/golden-bell-bake-wood.mjs가 이 함수로 굽는다 — 결을 바꾸면 다시 구울 것).

export function woodCanvas(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext("2d");
  const k = size / 512;
  ctx.scale(k, k);
  const base = ctx.createLinearGradient(0, 0, 512, 512);
  base.addColorStop(0, "#fff7e7");
  base.addColorStop(0.46, "#f0d4a5");
  base.addColorStop(1, "#d9b57e");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 512, 512);
  for (let line = 0; line < 76; line += 1) {
    const y = 18 + line * 6.5 + Math.sin(line * 1.7) * 6;
    ctx.beginPath();
    ctx.moveTo(-20, y);
    for (let x = -20; x <= 540; x += 18) ctx.lineTo(x, y + Math.sin(x * 0.036 + line) * 3.6 + Math.sin(x * 0.012 + line * 0.4) * 2.4);
    ctx.strokeStyle = line % 3 === 0 ? "rgba(115,78,39,.095)" : "rgba(255,255,245,.24)";
    ctx.lineWidth = line % 3 === 0 ? 1.15 : 0.9;
    ctx.stroke();
  }
  for (let knot = 0; knot < 34; knot += 1) {
    ctx.beginPath();
    ctx.ellipse(44 + (knot * 83) % 432, 38 + (knot * 117) % 420, 20, 6, knot, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(105,70,35,.07)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const glow = ctx.createRadialGradient(160, 120, 20, 160, 120, 420);
  glow.addColorStop(0, "rgba(255,255,255,.18)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 512, 512);
  return canvas;
}
