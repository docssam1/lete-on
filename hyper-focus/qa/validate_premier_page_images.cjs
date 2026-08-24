const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..", "..");
const documentsPath = path.join(root, "fields-classic", "print-viewer", "documents.js");
const viewerPath = path.join(root, "fields-classic", "print-viewer", "index.html");
const libraryPath = path.join(root, "premier", "index.html");
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(documentsPath, "utf8"), context, { filename: documentsPath });

const expected = Object.freeze({
  "premier-utilization-1": 4,
  "premier-utilization-2": 4,
  "premier-utilization-3": 4,
  "premier-utilization-4": 4,
  "premier-utilization-5": 5,
  "premier-utilization-6": 4,
  "premier-utilization-7": 8,
  "premier-utilization-8": 4,
  "premier-final-1": 4,
  "premier-final-2": 4,
  "premier-final-3": 5,
  "premier-last-1": 5,
  "premier-last-2": 4,
  "premier-last-3": 4,
  "premier-last-4": 4
});

const documents = context.window.GFIELD_PRINT_DOCUMENTS;
const premierKeys = Object.keys(documents).filter((key) => key.startsWith("premier-"));
assert.deepStrictEqual(premierKeys, Object.keys(expected), "프리미어 15회 문서 순서가 달라졌습니다.");

let totalPages = 0;
let validatedImagePages = 0;
const firstAsset = path.join(root, "premier", "assets", "print", "utilization-1", "page_001.webp");
const privateAssetsPresent = fs.existsSync(firstAsset);
if (!privateAssetsPresent && process.env.PREMIER_REQUIRE_PRIVATE_ASSETS === "1") {
  assert.fail("비공개 프리미어 페이지 이미지가 없습니다. 배포 게이트에서는 자산 67쪽이 모두 필요합니다.");
}
for (const [key, pageCount] of Object.entries(expected)) {
  const document = documents[key];
  assert(document, `${key}: 인쇄 문서가 없습니다.`);
  assert.strictEqual(document.pageCount, pageCount, `${key}: 문제지 쪽 수가 달라졌습니다.`);
  assert(document.cover, `${key}: 학생용 표지가 없습니다.`);
  assert.strictEqual(document.cover.meta, "실전 문제 20문항", `${key}: 20문항 표기가 없습니다.`);
  assert.match(document.pagesBase, /^\.\.\/\.\.\/premier\/assets\/print\/[a-z0-9-]+\/page_$/, `${key}: 이미지 경로가 프리미어 자산 밖을 가리킵니다.`);

  if (privateAssetsPresent) {
    const directory = path.resolve(path.dirname(documentsPath), document.pagesBase.replace(/page_$/, ""));
    const files = fs.readdirSync(directory).filter((name) => /^page_\d{3}\.webp$/.test(name)).sort();
    assert.strictEqual(files.length, pageCount, `${key}: 이미지 파일 수가 문서 쪽 수와 다릅니다.`);
    files.forEach((name, index) => {
      assert.strictEqual(name, `page_${String(index + 1).padStart(3, "0")}.webp`, `${key}: 페이지 번호가 연속적이지 않습니다.`);
      const data = fs.readFileSync(path.join(directory, name));
      assert(data.length > 20_000, `${key}/${name}: 이미지가 비정상적으로 작습니다.`);
      assert.strictEqual(data.subarray(0, 4).toString("ascii"), "RIFF", `${key}/${name}: WebP RIFF 헤더가 없습니다.`);
      assert.strictEqual(data.subarray(8, 12).toString("ascii"), "WEBP", `${key}/${name}: WebP 형식이 아닙니다.`);
      validatedImagePages += 1;
    });
  }
  totalPages += pageCount;
}

const viewer = fs.readFileSync(viewerPath, "utf8");
assert.match(viewer, /documentKey\.startsWith\("premier-"\)\?"프리미어 모의고사"/, "공용 인쇄 뷰어가 프리미어 문서를 구분하지 않습니다.");
assert.match(viewer, /premierDocument\?"G-FIELD PREMIER"/, "프리미어 표지가 필즈더클래식 브랜드로 되돌아갔습니다.");

const library = fs.readFileSync(libraryPath, "utf8");
assert.match(library, /\.\.\/fields-classic\/print-viewer\/documents\.js/, "프리미어 서재가 공용 인쇄 문서 목록을 읽지 않습니다.");
assert.match(library, /\.\.\/fields-classic\/print-viewer\/\?doc=/, "프리미어 서재가 공용 이미지 시험지로 연결되지 않습니다.");
assert(!/\.\/viewer\.html\?exam=/.test(library), "프리미어 서재가 예전 HTML 재제작 시험지로 되돌아갔습니다.");
assert.match(library, /async function assetAvailable/, "비공개 이미지가 없을 때 회차를 잠그는 자산 확인이 없습니다.");
assert.match(library, /method:\s*'HEAD'/, "프리미어 서재가 원본 전체를 내려받지 않고 자산 존재를 확인해야 합니다.");
assert.match(library, /비공개 자산 대기/, "공개 저장소에서 유료 원본을 잠그는 안내가 없습니다.");

const restoreScript = fs.readFileSync(path.join(root, "scripts", "restore-premier-private-assets.ps1"), "utf8");
assert.match(restoreScript, /if \(-not \$repoInfo\.isPrivate\)/, "비공개 자산 복원 스크립트가 PUBLIC 저장소를 차단하지 않습니다.");
assert.match(restoreScript, /if \(\$branch -eq "main"\)/, "비공개 자산 복원 스크립트가 main 실행을 차단하지 않습니다.");
assert.match(restoreScript, /PREMIER_REQUIRE_PRIVATE_ASSETS/, "복원 뒤 67쪽 배포 게이트를 실행하지 않습니다.");

assert.strictEqual(totalPages, 67, "학생용 문제지 이미지는 총 67쪽이어야 합니다.");
if (privateAssetsPresent) {
  assert.strictEqual(validatedImagePages, 67, "비공개 학생용 문제지 이미지 검사가 67쪽을 모두 통과해야 합니다.");
  console.log(`PASS: 프리미어 이미지 시험지 ${premierKeys.length}회, 문제지 ${validatedImagePages}쪽, WebP 헤더·연속 번호·공용 인쇄 연결 확인`);
} else {
  const ignoreFile = fs.readFileSync(path.join(root, "premier", "assets", "print", ".gitignore"), "utf8");
  assert.match(ignoreFile, /^\*\.webp$/m, "공개 저장소에서 유료 페이지 이미지를 제외하는 규칙이 없습니다.");
  console.log(`PASS: 프리미어 이미지 시험지 ${premierKeys.length}회·${totalPages}쪽 계약 확인 (비공개 자산은 공개 저장소에서 제외)`);
}
