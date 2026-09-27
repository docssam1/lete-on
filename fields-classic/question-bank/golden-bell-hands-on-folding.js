import { reflectPoint } from "../../geometry/games/paper-fold/curriculum.js";

const square = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
const folds = {
  right: { axis: "vertical", keep: (p) => p.x - .5 },
  left: { axis: "vertical", keep: (p) => .5 - p.x },
  down: { axis: "horizontal", keep: (p) => p.y - .5 },
  up: { axis: "horizontal", keep: (p) => .5 - p.y }
};

function clip(poly, keep) {
  const out = [];
  poly.forEach((a, index) => {
    const b = poly[(index + 1) % poly.length];
    const da = keep(a), db = keep(b);
    if (da >= -1e-9) out.push(a);
    if (da > 1e-9 && db < -1e-9 || da < -1e-9 && db > 1e-9) {
      const t = da / (da - db);
      out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  });
  return out;
}

export function foldPaper(model, count = model.folds.length) {
  return model.folds.slice(0, count).reduce((poly, key) => clip(poly, folds[key].keep), square);
}

export function unfoldCuts(model, remaining = 0) {
  let cuts = model.cuts.map((points) => points.map(([x, y]) => ({ x, y })));
  for (let i = model.folds.length - 1; i >= remaining; i--) {
    cuts = cuts.flatMap((poly) => [poly, poly.map((point) => reflectPoint(point, folds[model.folds[i]].axis))]);
  }
  return cuts;
}

export function foldSelectedCells(model) {
  const cuts = unfoldCuts(model);
  const inside = (poly, point) => {
    let sign = 0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const cross = (b.x - a.x) * (point.y - a.y) - (b.y - a.y) * (point.x - a.x);
      if (Math.abs(cross) < 1e-8) continue;
      if (sign && Math.sign(cross) !== sign) return false;
      sign = Math.sign(cross);
    }
    return Boolean(sign);
  };
  const size = model.grid;
  return Array.from({ length: size * size }, (_, cell) => cell).filter((cell) =>
    cuts.some((poly) => inside(poly, { x: (cell % size + .5) / size, y: (Math.floor(cell / size) + .5) / size })));
}
