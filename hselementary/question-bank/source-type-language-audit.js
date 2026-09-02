"use strict";

const inventory = require("./source-inventory/4-1-source-items.json");
const typeLanguage = require("./source-inventory/4-1-type-language.json");

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

const disallowedTerms = [
  "순열", "거듭제곱", "피제수", "공차", "등차수열", "파스칼", "분배법칙",
  "극값", "차대", "합성각", "미지각", "결측", "빈도", "계수", "정렬",
  "역산", "좌표값", "부분합", "가중합", "중첩", "근삿값", "미지수", "평행이동",
  "수열", "등차", "평각", "맞꼭지각", "부분각", "표시각", "내각", "외각", "수표",
  "연속합", "합성", "순환", "연산", "부등식", "교대", "소속", "가짓수", "관계식"
];
const genericLabels = new Set(["핵심 유형", "여러 가지 문제", "개념탐구", "예제", "Mission"]);
const ids = new Set(inventory.items.map(item => item.sourceItemId));
const labels = new Map();

check(inventory.items.length === 329, `4-1 한글 유형명 감사 대상이 329개가 아닙니다: ${inventory.items.length}`);
check(inventory.languagePolicy?.childReadableKoreanTypeNameRequired === true, "쉬운 한글 유형명 정책이 켜져 있지 않습니다.");

for (const [sourceItemId, label] of Object.entries(typeLanguage.overrides || {})) {
  check(ids.has(sourceItemId), `쉬운 한글 유형명에 존재하지 않는 원문 ID가 있습니다: ${sourceItemId}`);
  check(Boolean(String(label).trim()), `${sourceItemId}: 쉬운 한글 유형명이 비었습니다.`);
}

for (const item of inventory.items) {
  const label = String(item.typeLabel || "").trim();
  check(item.typeLanguageVerified === true, `${item.sourceItemId}: 한글 유형명 확인 표시가 없습니다.`);
  check(/[가-힣]/.test(label), `${item.sourceItemId}: 한글 유형명이 아닙니다: ${label}`);
  check(label.length >= 6, `${item.sourceItemId}: 유형명이 무엇을 하는 문제인지 설명하기에 너무 짧습니다: ${label}`);
  check(!genericLabels.has(label), `${item.sourceItemId}: 출처 구간이나 일반 표현만 유형명으로 사용했습니다: ${label}`);
  check(label !== item.sourceItemLabel && !/^개념탐구\s*\d|^예제\s*\d|^Mission\s*\d/i.test(label), `${item.sourceItemId}: 문제번호를 유형명으로 사용했습니다: ${label}`);
  for (const term of disallowedTerms) check(!label.includes(term), `${item.sourceItemId}: 초등학생용 유형명에 어려운 분류 용어 '${term}'이 남았습니다: ${label}`);
  const same = labels.get(label) || [];
  same.push(item.sourceItemId);
  labels.set(label, same);
}

for (const [label, sourceItemIds] of labels) {
  check(sourceItemIds.length === 1, `서로 다른 원문 문항에 같은 한글 유형명이 붙었습니다: ${label} (${sourceItemIds.join(", ")})`);
}

console.log(`4-1 쉬운 한글 유형명 감사 통과: ${inventory.items.length}유형 · 고유 이름 ${labels.size}개 · 어려운 분류 용어 0개`);
