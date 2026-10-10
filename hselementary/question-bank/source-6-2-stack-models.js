(() => {
  "use strict";
  const freeze = value => {
    if (value && typeof value === "object") { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  };
  const definitions = [
    { sourceItemId: "6-2-u3-e1-example-4", sourcePage: 30, printedPage: 32,
      countGiven: true, releaseStatus: "locked", publisherAnswerVerified: false,
      pools: [
        { heights: [[3,0,0],[1,1,2],[0,1,0]], top: [[1,0,0],[1,1,1],[0,1,0]], front: [3,1,2], right: [1,2,3], total: 8 },
        { heights: [[3,0,0],[1,2,1],[0,1,0]], top: [[1,0,0],[1,1,1],[0,1,0]], front: [3,2,1], right: [1,2,3], total: 8 },
        { heights: [[2,0,0],[2,2,3],[0,2,0]], top: [[1,0,0],[1,1,1],[0,1,0]], front: [2,2,3], right: [2,3,2], total: 11 }
      ] },
    { sourceItemId: "6-2-u3-e1-mission-3", sourcePage: 31, printedPage: 33,
      countGiven: false, releaseStatus: "locked", publisherAnswerVerified: false,
      pools: [
        { heights: [[3,2],[2,0],[1,0]], top: [[1,1],[1,0],[1,0]], front: [3,2], right: [1,2,3] },
        { heights: [[4,2],[1,0],[2,0]], top: [[1,1],[1,0],[1,0]], front: [4,2], right: [2,1,4] },
        { heights: [[3,3],[2,0],[1,0]], top: [[1,1],[1,0],[1,0]], front: [3,3], right: [1,2,3] }
      ] }
  ];
  function validateHeights(h) {
    if (!Array.isArray(h) || h.length < 1 || h.length > 6 || !Array.isArray(h[0]) || h[0].length < 1 || h[0].length > 6 ||
      !Array.from({length:h.length},(_,z) => Object.hasOwn(h,z) && Array.isArray(h[z]) && h[z].length === h[0].length &&
        Array.from({length:h[z].length},(_,x) => Object.hasOwn(h[z],x) && Number.isSafeInteger(h[z][x]) && h[z][x] >= 0 && h[z][x] <= 6).every(Boolean)).every(Boolean) || !h.flat().some(Boolean)) throw new Error("Invalid cube height matrix");
  }
  function cubes(h) {
    validateHeights(h);
    // x increases rightward, z increases toward the front, y increases upward.
    return h.flatMap((row,z) => row.flatMap((n,x) => Array.from({length:n},(_,y) => [x,y,z])));
  }
  const api = freeze({ definitions, validateHeights, cubes, registrationOnly: true });
  if (typeof window !== "undefined") window.HSE_SOURCE_GRADE6_STACK_MODELS = api;
  if (typeof module !== "undefined") module.exports = api;
})();
