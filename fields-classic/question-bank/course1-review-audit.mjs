import {
  CURRICULUM,
  CURRICULUM_REVIEW_CROSSWALK,
  typeById
} from "./source-data.js";

const expectedGroups = Object.freeze({
  "book-02": [10, 9, 8, 9],
  "book-03": [10, 10, 8, 9]
});

const failures = [];

for (const [hostBookId, groupCounts] of Object.entries(expectedGroups)) {
  const crosswalk = CURRICULUM_REVIEW_CROSSWALK[hostBookId];
  const sourceBook = CURRICULUM.find((book) => book.id === crosswalk?.sourceBookId);
  const sourceTypes = new Set(sourceBook?.units.flatMap((unit) => unit.typeIds) || []);
  const seen = new Set();

  if (!crosswalk?.verified) failures.push(`${hostBookId}: 검증 상태가 아닙니다.`);

  for (const [groupIndex, expectedCount] of groupCounts.entries()) {
    const group = groupIndex + 1;
    const links = crosswalk?.links.filter((link) => link.group === group) || [];
    const numbers = links.map((link) => link.number).sort((a, b) => a - b);
    const expectedNumbers = Array.from({ length: expectedCount }, (_, index) => index + 1);
    if (JSON.stringify(numbers) !== JSON.stringify(expectedNumbers)) {
      failures.push(`${hostBookId} 리뷰 ${group}: 문제번호 ${numbers.join(",")} (기대 ${expectedNumbers.join(",")})`);
    }
  }

  for (const link of crosswalk?.links || []) {
    const key = `${link.group}:${link.number}`;
    if (seen.has(key)) failures.push(`${hostBookId}: 중복 문제번호 ${key}`);
    seen.add(key);
    if (!typeById(link.typeId)) failures.push(`${hostBookId}: 없는 유형 ${link.typeId}`);
    if (!sourceTypes.has(link.typeId)) failures.push(`${hostBookId}: ${link.typeId}는 ${crosswalk.sourceBookId} 유형이 아닙니다.`);
  }

  const expectedTotal = groupCounts.reduce((sum, count) => sum + count, 0);
  if (crosswalk?.links.length !== expectedTotal) {
    failures.push(`${hostBookId}: ${crosswalk?.links.length || 0}문항 (기대 ${expectedTotal}문항)`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("1과정 리뷰 교차표 검산 완료: 2권 36문항, 3권 37문항, 누락·중복·잘못된 권 연결 0건");
