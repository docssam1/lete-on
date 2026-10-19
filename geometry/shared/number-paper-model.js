/* Shared by the numbered-paper game and the existing worksheet. Coordinates
   stay on the original 4×4 sheet: up keeps rows 0–1; left keeps columns 0–1.
   No source-book numbers, pictures or answer keys are stored here. */
(function (global) {
  'use strict';
  function numberPaperModel({ grid, hDir, vDir, cells }) {
    // The legacy variation adapter may supply zero or values above two digits;
    // keep those valid worksheet inputs even though this game's bank uses 1–6.
    if (!Array.isArray(grid) || grid.length !== 4 || grid.some(row => !Array.isArray(row) || row.length !== 4 || row.some(n => !Number.isSafeInteger(n) || n < 0))) throw new Error('Invalid number-paper grid');
    if (!['up', 'down'].includes(hDir) || !['left', 'right'].includes(vDir)) throw new Error('Invalid number-paper fold');
    if (!Array.isArray(cells) || !cells.length || cells.length > 3 || cells.some(p => ![0, 1].includes(p.r) || ![0, 1].includes(p.c)) || new Set(cells.map(p => p.r * 2 + p.c)).size !== cells.length) throw new Error('Invalid number-paper cut');
    const packetRow = hDir === 'up' ? 0 : 2, packetCol = vDir === 'left' ? 0 : 2;
    const removed = new Set();
    for (const cell of cells) {
      const r = packetRow + cell.r, c = packetCol + cell.c;
      for (const rr of [r, 3 - r]) for (const cc of [c, 3 - c]) removed.add(rr * 4 + cc);
    }
    const total = grid.flat().reduce((sum, n) => sum + n, 0);
    const cut = [...removed].reduce((sum, id) => sum + grid[Math.floor(id / 4)][id % 4], 0);
    return { grid: grid.map(row => [...row]), hDir, vDir, cells: cells.map(cell => ({ ...cell })), packetRow, packetCol, removed, total, cut, remain: total - cut };
  }
  global.GW_NUMBER_PAPER = Object.freeze({ numberPaperModel });
})(globalThis);
