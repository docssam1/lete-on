const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// 2026-11-23 감사 정비: 이 단원은 18개 합성 유형(소단원당 3분기)에서 원문 항목 유형(sourceItemId)으로 바뀌었다.
// 원문 대조 근거·난이도 분류는 원문 목록 파일이 curriculum.js에 붙인 값이고, 생성기는 원문 풀·유사문항 래퍼가 연결하므로
// index.html과 같은 순서로 앱 스크립트를 불러와 지금 앱의 유형 목록과 생성 경로를 검사한다.
// 원문 그대로 수를 고정한 문항이 있으므로 예전의 '기준 난이도 정답 n종 이상' 조건과 '유형 이름이 근거 문장에 있음' 조건은 뺐다.
const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const scripts = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map(match => match[1].replace(/^\.\//, "").replace(/\?.*$/, ""))
  .filter(file => !["app.js", "bank-access.js"].includes(file));
const context = { console };
context.window = context;
vm.createContext(context);
for (const file of scripts) vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context, { filename: file });

const curriculum = context.window.HSE_CURRICULUM;
const generators = context.window.HSE_GENERATORS;
const semester = curriculum.semesters.find(item => item.id === "4-1");
const failures = [];
const allowedTiers = new Set(["ability", "advanced", "advanced-contest-overlap"]);
let generatedCount = 0;
let typeCount = 0;
let subunitCount = 0;

for (const unitId of ["4-1-u2", "4-1-u3"]) {
  const unit = semester.units.find(item => item.id === unitId);
  const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({ ...type, semesterId: semester.id, unitId: unit.id, unitName: unit.name })));
  typeCount += types.length;
  subunitCount += unit.subunits.length;
  if (unit.subunits.length !== 6) failures.push(`${unit.name}: 소단원 수가 ${unit.subunits.length}개입니다.`);
  for (const subunit of unit.subunits) {
    if (!subunit.types.length) failures.push(`${unit.name} / ${subunit.name}: 세부 유형이 없습니다.`);
    const ids = subunit.types.map(type => type.id);
    if (new Set(ids).size !== ids.length) failures.push(`${unit.name} / ${subunit.name}: 유형 id가 겹칩니다.`);
  }
  const sourceIds = types.map(type => type.sourceItemId);
  if (new Set(sourceIds).size !== sourceIds.length) failures.push(`${unit.name}: 같은 원문 항목이 두 번 연결됐습니다.`);

  for (const type of types) {
    if (![-1, 0, 1].includes(type.difficultyBand)) failures.push(`${type.id}: 심화 난이도 근거가 없습니다.`);
    if (!allowedTiers.has(type.sourceTier)) failures.push(`${type.id}: 허용되지 않은 원본 분류 ${type.sourceTier}`);
    if (!type.sourceVerified || !type.sourceEvidence || !type.sourceItemId) failures.push(`${type.id}: 원본 대조 근거가 없습니다.`);
    if (String(type.sourceTier).includes("contest") && type.sourceTier !== "advanced-contest-overlap") {
      failures.push(`${type.id}: 심화와 겹친 구조가 경시 고유로 표시됐습니다.`);
    }
    if (type.reviewLocked) continue;
    if (!generators.generatorKey(type)) failures.push(`${type.id}: 생성기가 연결되지 않았습니다.`);
    const fixedPool = type.generationMode === "fixed-verified-pool";
    const variants = fixedPool ? Array.from({ length: Math.max(1, Number(type.verifiedVariantCount) || 0) }, (_, index) => index) : [type.variant ?? 0];
    for (const variant of variants) for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= (fixedPool ? 3 : 100); seed += 1) {
        try {
          const generated = generators.generate(type, 0, difficulty, seed, variant);
          generatedCount += 1;
          if (!generated?.prompt || generated.answer === "" || generated.answer === undefined || !generated?.solution) {
            failures.push(`${type.id} / 변형 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
            break;
          }
          // 원문 문항은 검산 근거를 URL 인코딩 JSON data 속성에 담는다(그 안의 null은 화면에 보이지 않음). 태그를 걷어 낸 화면 글자만 본다.
          const visible = `${generated.prompt} ${generated.answer} ${generated.solution}`.replace(/<[^>]*>/g, " ");
          if (/undefined|null|NaN|Infinity/.test(visible)) {
            failures.push(`${type.id} / 변형 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: 잘못된 계산 결과가 노출됩니다.`);
            break;
          }
        } catch (error) {
          failures.push(`${type.id} / 변형 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
          break;
        }
      }
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`4-1 각도·곱셈과 나눗셈 ${subunitCount}개 소단원 · ${typeCount}개 원문 항목 유형 · ${generatedCount.toLocaleString()}회 생성 검수 통과`);
