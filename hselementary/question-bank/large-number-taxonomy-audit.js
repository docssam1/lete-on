const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = __dirname;
const context = { window: {} };
vm.createContext(context);
for (const file of ["curriculum.js", "generators.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
}

const curriculum = context.window.HSE_CURRICULUM;
const generators = context.window.HSE_GENERATORS;
const semester = curriculum.semesters.find(item => item.id === "4-1");
const unit = semester.units.find(item => item.id === "4-1-u1");
const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name
})));
const failures = [];
const allowedTiers = new Set(["ability", "advanced", "advanced-contest-overlap"]);

if (unit.subunits.length !== 6) failures.push(`큰 수 소단원 수가 ${unit.subunits.length}개입니다.`);
if (types.length !== 18) failures.push(`큰 수 세부 유형 수가 ${types.length}개입니다.`);

for (const subunit of unit.subunits) {
  const variants = subunit.types.map(type => type.variant).sort((a, b) => a - b);
  if (subunit.types.length !== 3 || variants.join(",") !== "0,1,2") {
    failures.push(`${subunit.name}: 세 문제 구조 분기가 0,1,2로 고정되지 않았습니다.`);
  }
}

for (const type of types) {
  if (![-1, 0, 1].includes(type.difficultyBand)) failures.push(`${type.id}: 심화 난이도 근거가 없습니다.`);
  if (!allowedTiers.has(type.sourceTier)) failures.push(`${type.id}: 허용되지 않은 원본 분류 ${type.sourceTier}`);
  if (!type.sourceVerified || !type.sourceEvidence) failures.push(`${type.id}: 원본 대조 근거가 없습니다.`);
  if (!type.sourceEvidence.includes(type.label)) failures.push(`${type.id}: 유형 구조명이 원본 대조 근거에 없습니다.`);
  if (type.sourceTier.includes("contest") && type.sourceTier !== "advanced-contest-overlap") {
    failures.push(`${type.id}: 경시 고유로 확인되지 않은 유형이 경시 전용으로 표시됐습니다.`);
  }
  if (!generators.generatorKey(type)) failures.push(`${type.id}: 생성기가 연결되지 않았습니다.`);

  const answers = new Set();
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 300; seed += 1) {
      try {
        const generated = generators.generate(type, 0, difficulty, seed, type.variant);
        if (!generated?.prompt || generated.answer === "" || !generated?.solution) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 문제·정답·풀이가 비었습니다.`);
          break;
        }
        const visible = `${generated.prompt} ${generated.answer} ${generated.solution}`;
        if (/undefined|null|NaN|Infinity/.test(visible)) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 잘못된 계산 결과가 노출됩니다.`);
          break;
        }
        if (difficulty === 0) answers.add(generated.answer);
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
    }
  }
  if (answers.size < 5) failures.push(`${type.id}: 기준 난이도 정답 다양성이 ${answers.size}개뿐입니다.`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`4-1 큰 수 6개 소단원 · 18개 세부 유형 · 16,200회 생성 검수 통과`);
