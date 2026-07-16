export const BLOCK_TYPES = Object.freeze({
  CUBE: "cube",
  RECTANGULAR_PRISM: "rectangular-prism"
});

export const COPY_BUILD_LEVELS = Object.freeze([
  {
    level: 1,
    title: "원목 기초",
    mode: "copy",
    board: { columns: 3, rows: 3, maxHeight: 2 },
    allowedBlocks: [BLOCK_TYPES.CUBE],
    materialMode: "wood",
    sessionSize: 5,
    captureEnabled: false
  },
  {
    level: 2,
    title: "3×3×3 똑같이 쌓기",
    mode: "copy",
    board: { columns: 3, rows: 3, maxHeight: 3 },
    allowedBlocks: [BLOCK_TYPES.CUBE],
    materialMode: "wood",
    sessionSize: 5,
    captureEnabled: false
  },
  {
    level: 3,
    title: "색깔과 큰 원목 구조",
    mode: "copy",
    variants: [
      {
        id: "color-3x3x3",
        board: { columns: 3, rows: 3, maxHeight: 3 },
        allowedBlocks: [BLOCK_TYPES.CUBE],
        materialMode: "color"
      },
      {
        id: "wood-4x4x4",
        board: { columns: 4, rows: 4, maxHeight: 4 },
        allowedBlocks: [BLOCK_TYPES.CUBE],
        materialMode: "wood"
      }
    ],
    sessionSize: 5,
    captureEnabled: false
  },
  {
    level: 4,
    title: "직육면체로 만들기",
    mode: "copy",
    board: { columns: 4, rows: 4, maxHeight: 4 },
    allowedBlocks: [BLOCK_TYPES.RECTANGULAR_PRISM],
    materialMode: "wood",
    requireRotationMatch: true,
    sessionSize: 5,
    captureEnabled: false
  },
  {
    level: 5,
    title: "여러 가지 모양 만들기",
    mode: "creative",
    board: { columns: 5, rows: 5, maxHeight: 5 },
    allowedBlocks: [BLOCK_TYPES.CUBE, BLOCK_TYPES.RECTANGULAR_PRISM],
    materialMode: "mixed",
    captureEnabled: true,
    completionRules: {
      requireGroundSupport: true,
      requireConnectedBuild: true,
      requireAllAssignedBlocks: false
    }
  }
]);

export function getCopyBuildLevel(levelNumber) {
  return COPY_BUILD_LEVELS.find(({ level }) => level === Number(levelNumber)) ?? COPY_BUILD_LEVELS[0];
}

export function pickRandomProblems(problems, count = 5, recentIds = []) {
  const recent = new Set(recentIds);
  const preferred = problems.filter((problem) => !recent.has(problem.id));
  const pool = preferred.length >= count ? preferred : problems;

  return [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(count, pool.length));
}
