// 답 없는 문제지 쪽 그림을 Google Vision 문서 OCR로 읽는다. 원본 그림·결과는 저장소 밖 작업 폴더에만 둔다.
// GOOGLE_VISION_KEY=… node vision-ocr.mjs <쪽 그림 폴더> <결과 폴더> [p05,p06…]
// 쪽마다 <결과>/pNN.json(원본 응답) · pNN.words.json(낱말·상자·신뢰도) · pNN.txt(줄 단위, 위→아래·왼→오른쪽).
// 이미 pNN.json이 있으면 건너뛴다. 시험용: VISION_FAKE_RESPONSE=<응답 JSON 파일>이면 호출하지 않고 그 응답을 쓴다.
import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { basename, join } from "node:path";

const [pagesDir, outDir, only] = process.argv.slice(2);
if (!pagesDir || !outDir) throw new Error("usage: node vision-ocr.mjs <pages> <out> [p05,p06]");
const key = process.env.GOOGLE_VISION_KEY, fake = process.env.VISION_FAKE_RESPONSE;
if (!key && !fake) throw new Error("GOOGLE_VISION_KEY 가 없습니다(환경 설정의 Network secrets 또는 환경 변수).");
mkdirSync(outDir, { recursive: true });
const pick = only ? only.split(",") : null;
const pages = readdirSync(pagesDir).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort()
  .filter((f) => !pick || pick.includes(basename(f).replace(/\.\w+$/, "")));

// curl을 쓴다 — 작업 환경의 프록시·인증서 설정을 그대로 따른다.
const annotate = (file) => {
  if (fake) return JSON.parse(readFileSync(fake, "utf8"));
  const body = join(outDir, ".request.json");
  writeFileSync(body, JSON.stringify({ requests: [{
    image: { content: readFileSync(file).toString("base64") },
    features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
    imageContext: { languageHints: ["ko", "en"] }
  }] }));
  // 키는 주소가 아니라 머리글로 보낸다(프로세스 목록·로그에 남지 않게).
  const r = spawnSync("curl", ["-sS", "--max-time", "120", "-H", "Content-Type: application/json", "-H", "@-",
    "--data-binary", `@${body}`, "https://vision.googleapis.com/v1/images:annotate"],
    { encoding: "utf8", maxBuffer: 1 << 28, input: `X-Goog-Api-Key: ${key}\n` });
  unlinkSync(body);
  if (r.status !== 0) throw new Error(`curl ${r.status}: ${r.stderr.trim()}`);
  const j = JSON.parse(r.stdout);
  if (j.error) throw new Error(`vision ${j.error.code}: ${j.error.message}`);
  if (j.responses?.[0]?.error) throw new Error(`vision page: ${j.responses[0].error.message}`);
  return j;
};

// 낱말 = 기호를 이은 것. 상자는 꼭짓점의 최소·최대, 신뢰도는 낱말 값.
const wordsOf = (res) => {
  const out = [];
  for (const page of res.responses?.[0]?.fullTextAnnotation?.pages || [])
    for (const block of page.blocks || []) for (const para of block.paragraphs || []) for (const w of para.words || []) {
      const text = (w.symbols || []).map((s) => s.text).join("");
      const v = w.boundingBox?.vertices || [];
      const xs = v.map((p) => p.x || 0), ys = v.map((p) => p.y || 0);
      out.push({ text, conf: w.confidence ?? null, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] });
    }
  return out;
};
// 줄로 묶기: 세로 가운데가 낱말 높이의 절반 안에 들면 같은 줄.
const linesOf = (words) => {
  const lines = [];
  for (const w of [...words].sort((a, b) => (a.box[1] + a.box[3]) - (b.box[1] + b.box[3]))) {
    const cy = (w.box[1] + w.box[3]) / 2, h = w.box[3] - w.box[1];
    const line = lines.find((l) => Math.abs(l.cy - cy) <= Math.max(h, l.h) / 2);
    if (line) { line.words.push(w); line.cy = (line.cy * (line.words.length - 1) + cy) / line.words.length; }
    else lines.push({ cy, h, words: [w] });
  }
  return lines.sort((a, b) => a.cy - b.cy).map((l) => l.words.sort((a, b) => a.box[0] - b.box[0]));
};

let done = 0, skipped = 0, failed = 0;
for (const f of pages) {
  const name = basename(f).replace(/\.\w+$/, ""), raw = join(outDir, `${name}.json`);
  if (existsSync(raw)) { skipped++; continue; }
  let res, err;
  for (let t = 1; t <= 3 && !res; t++) { try { res = annotate(join(pagesDir, f)); } catch (e) { err = e; } }
  if (!res) { failed++; console.error(`FAIL ${name}: ${err.message}`); continue; }
  const words = wordsOf(res);
  writeFileSync(raw, JSON.stringify(res));
  writeFileSync(join(outDir, `${name}.words.json`), JSON.stringify(words));
  writeFileSync(join(outDir, `${name}.txt`), linesOf(words).map((l) => l.map((w) => w.text).join(" ")).join("\n") + "\n");
  const low = words.filter((w) => w.conf !== null && w.conf < 0.8).length;
  console.log(`OK ${name}: words ${words.length}, low-confidence ${low}`);
  done++;
}
console.log(`ocr done ${done}, skipped ${skipped}, failed ${failed}`);
if (failed) process.exitCode = 1;
