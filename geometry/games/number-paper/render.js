import '../../worksheet/render.js';

// Reuse Geometry's DOM-free SVG primitives. This small scene builder adds the
// original-sheet coordinate frame and fold arrows needed by numbered paper.
export function foldSequence(p, t) {
  const { wrapSvg, polygon } = globalThis.GW_RENDER;
  const unit = 40, origin = 16;
  const coord = value => origin + value * unit;
  const rect = (x,y,w,h,fill,stroke='#845b53') => polygon([
    {px:coord(x),py:coord(y)}, {px:coord(x+w),py:coord(y)},
    {px:coord(x+w),py:coord(y+h)}, {px:coord(x),py:coord(y+h)}
  ],fill,stroke);
  return [0,1,2].map(stage => {
    const row = stage ? p.packetRow : 0, col = stage === 2 ? p.packetCol : 0;
    const rows = stage ? 2 : 4, cols = stage === 2 ? 2 : 4;
    const hatch = `cut-${p.id}-${stage}`;
    const surface = `surface-${p.id}-${stage}`;
    let svg = `<defs><pattern id="${hatch}" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#f6cbc6"/><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#9b3539" stroke-width="2"/></pattern><marker id="arrow-${stage}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#2456c4"/></marker></defs>`;
    svg += `<defs><linearGradient id="${surface}" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#fff4ef"/><stop offset="0.4" stop-color="#fbded4"/><stop offset="0.52" stop-color="#fff0e9"/><stop offset="1" stop-color="#e7ad9c"/></linearGradient></defs>`;
    svg += `<rect x="${origin}" y="${origin}" width="160" height="160" fill="none" stroke="#b5becb" stroke-dasharray="4 4"/>`;
    // Thin exposed edges indicate 1, 2, then 4 layers. Their offsets fit in
    // the existing viewBox margin; the mathematical face/cell coordinates stay put.
    const layers = 2 ** stage;
    for (let layer=layers;layer>0;layer--) svg += rect(col+layer*.035,row+layer*.035,cols,rows,layer%2?'#f6d2c3':'#bd8472');
    svg += rect(col,row,cols,rows,`url(#${surface})`);
    svg += `<path d="M${coord(col)} ${coord(row+rows)}V${coord(row)}H${coord(col+cols)}" fill="none" stroke="#fff9f4" stroke-width="2" opacity=".85"/>`;
    for (let r=row;r<row+rows;r++) for (let c=col;c<col+cols;c++) {
      const cut = stage === 2 && p.cells.some(cell=>cell.r===r-row && cell.c===c-col);
      svg += `<rect data-packet-cell="${r},${c}" x="${coord(c)}" y="${coord(r)}" width="${unit}" height="${unit}" fill="${cut?`url(#${hatch})`:'none'}" stroke="#b1837b" stroke-width="1"/>`;
    }
    if (stage < 2) {
      const horizontal = stage === 0;
      svg += horizontal
        ? `<line x1="${coord(0)}" y1="${coord(2)}" x2="${coord(4)}" y2="${coord(2)}" stroke="#654843" stroke-width="2" stroke-dasharray="6 4"/>`
        : `<line x1="${coord(2)}" y1="${coord(row)}" x2="${coord(2)}" y2="${coord(row+2)}" stroke="#654843" stroke-width="2" stroke-dasharray="6 4"/>`;
      const from = horizontal ? (p.hDir==='up'?[2.7,3.2]:[2.7,.8]) : (p.vDir==='left'?[3.2,row+1]:[.8,row+1]);
      const to = horizontal ? [from[0],4-from[1]] : [4-from[0],from[1]];
      const mid = horizontal ? [3.8,2] : [2,row+.15];
      svg += `<path data-fold-arrow="${horizontal?p.hDir:p.vDir}" d="M${coord(from[0])} ${coord(from[1])} Q${coord(mid[0])} ${coord(mid[1])} ${coord(to[0])} ${coord(to[1])}" fill="none" stroke="#2456c4" stroke-width="3.5" marker-end="url(#arrow-${stage})"/>`;
    }
    const label = t[stage===0?p.hDir:stage===1?p.vDir:'cut'];
    return `<figure data-fold-stage="${stage}"><figcaption><b>${stage+1}</b> ${label}</figcaption>${wrapSvg(svg,{xMin:0,yMin:0,w:192,h:192},'fold-picture',` role="img" aria-label="${label}"`)}</figure>`;
  }).join('');
}

export function sourceBoard(p, selected, phase, t) {
  return p.grid.flat().map((n,id) => {
    const picked=selected.includes(id), r=Math.floor(id/4), c=id%4;
    return `<button type="button" class="number-cell${picked?' selected':''}${phase!=='cells' && picked?' removed':''}" data-cell="${id}" data-row="${r}" data-column="${c}" aria-label="${t.cell(r+1,c+1,n)}" aria-pressed="${picked}" ${phase!=='cells'?'aria-disabled="true"':''} tabindex="${id===0?'0':'-1'}"><span>${n}</span><i aria-hidden="true">${phase==='cells'?'✓':'×'}</i></button>`;
  }).join('');
}
