export const curriculumBands = {
  facto1: { ko: "초등팩토 1", zh: "小学 FACTO 1", ja: "小学生 FACTO 1", en: "Elementary FACTO 1" },
  "1031-intro-entry": { ko: "1031 입문 · 입문", zh: "1031 入门 · 起步", ja: "1031 入門 · はじめ", en: "1031 Intro · Entry" },
  "1031-basic": { ko: "1031 초급", zh: "1031 初级", ja: "1031 初級", en: "1031 Beginner" }
};

export const activityBands = {
  "mirror-manor": { 1: "facto1", 2: "facto1", 3: "facto1", 4: "1031-intro-entry", 5: "1031-intro-entry" },
  geoboard: { 1: "1031-intro-entry", 2: "1031-intro-entry", 3: "1031-basic", 4: "1031-basic", 5: "1031-basic" },
  "shape-transform": { 1: "facto1", 2: "1031-intro-entry", 3: "1031-intro-entry", 4: "1031-basic", 5: "1031-basic" }
};

export const excludedConcepts = ["similarity"];

export function curriculumBandLabel(game, level, language = "ko") {
  const band = curriculumBands[activityBands[game]?.[level]];
  return band?.[language] || band?.ko || "";
}
