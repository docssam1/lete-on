// Supabase Storage 공개 버킷(audio·library-images·library-pdfs·nm-worksheets) → Cloudflare R2 복사.
//
// 왜: Supabase는 무료 요금제로 내리고(저장 1GB 한도), 음성·그림은 R2(전송 요금 없음)에서 내보낸다.
// 무엇을: Supabase 버킷의 모든 파일을 내려받아 R2에 「버킷이름/같은 경로」·같은 Content-Type으로 올린다.
//         그래서 R2 공개 주소가 Supabase의 …/storage/v1/object/public 자리를 그대로 대신한다
//         (앱은 reading-world/app/main.js STORAGE_PUBLIC_BASE, number_magic/app/main.js NM_AUDIO_BASE 등 한 줄씩만 바꾼다).
//         이미 R2에 같은 크기로 있으면 건너뛴다(다시 돌려도 안전). Supabase 쪽은 지우지 않는다.
// 검증: 올린 뒤 R2의 파일 수·크기를 Supabase와 하나씩 대조하고, 공개 주소(R2_PUBLIC_BASE)가 있으면
//       표본 몇 개를 실제로 받아 본다. 하나라도 다르면 실패로 끝난다.
//
// 환경 변수(GitHub Actions secrets):
//   SUPABASE_SERVICE_ROLE_KEY            Supabase 서비스 키(이미 있음)
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY   R2 API 토큰
//   SOURCE_BUCKET (기본 audio), R2_BUCKET (기본 gfield-assets), R2_PUBLIC_BASE (예: https://assets.gfieldacademy.net, 선택)
//   DRY_RUN=1 이면 목록과 크기만 세고 올리지 않는다.
//   SKIP_IF_NO_R2=1 이면 R2 열쇠가 없을 때 실패하지 않고 건너뛴다 — 음성 생성 워크플로 끝에 붙여 「새로 만든 파일도 R2에」를
//                   하되, R2를 아직 만들기 전에는 생성 워크플로가 깨지지 않게(.github/actions/mirror-to-r2).
// 다시 만든 파일: 크기가 같아도 Supabase 쪽 수정 시각이 R2보다 늦으면 다시 올린다(같은 이름으로 다시 만든 음성을 놓치지 않게).

import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://fgahqumaldheqettmvqg.supabase.co";
const SOURCE_BUCKET = process.env.SOURCE_BUCKET || "audio";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.R2_BUCKET || "gfield-assets";
const keyOf = (path) => `${SOURCE_BUCKET}/${path}`;
const PUBLIC_BASE = (process.env.R2_PUBLIC_BASE || "").replace(/\/$/, "");
const DRY = process.env.DRY_RUN === "1";
const R2_KEYS = ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"];
if (process.env.SKIP_IF_NO_R2 === "1" && R2_KEYS.some((name) => !process.env[name])) {
  console.log(`R2 열쇠가 아직 없어 ${SOURCE_BUCKET} → R2 복사를 건너뜁니다(Supabase에는 올라가 있음).`);
  process.exit(0);
}
for (const name of ["SUPABASE_SERVICE_ROLE_KEY", ...(DRY ? [] : R2_KEYS)]) {
  if (!process.env[name]) { console.error(`환경 변수 ${name} 가 없습니다.`); process.exit(1); }
}
const headers = { Authorization: `Bearer ${KEY}`, apikey: KEY };

async function listAll(prefix = "") {
  const out = [];
  for (let offset = 0; ; offset += 1000) {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${SOURCE_BUCKET}`, {
      method: "POST", headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ prefix, limit: 1000, offset, sortBy: { column: "name", order: "asc" } })
    });
    if (!res.ok) throw new Error(`목록 실패 ${prefix}: ${res.status} ${await res.text()}`);
    const page = await res.json();
    for (const entry of page) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id === null) out.push(...await listAll(path)); // 폴더
      else out.push({ path, size: Number(entry.metadata?.size) || 0, type: entry.metadata?.mimetype || "application/octet-stream",
        updated: Date.parse(entry.updated_at || entry.created_at || "") || 0 });
    }
    if (page.length < 1000) return out;
  }
}

const files = await listAll();
const total = files.reduce((s, f) => s + f.size, 0);
console.log(`Supabase ${SOURCE_BUCKET}: ${files.length}개, ${(total / 1e6).toFixed(1)}MB`);
if (DRY) process.exit(0);

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }
});

/* R2에 이미 있는 것: 경로 → {크기, 올린 시각}. 파일마다 묻지 않고 목록을 한 번에 받는다. */
async function r2List() {
  const map = new Map();
  for (let token; ;) {
    const page = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, Prefix: `${SOURCE_BUCKET}/`, ContinuationToken: token }));
    for (const o of page.Contents || []) map.set(o.Key, { size: o.Size, at: o.LastModified ? o.LastModified.getTime() : 0 });
    if (!page.IsTruncated) return map;
    token = page.NextContinuationToken;
  }
}
const before = await r2List();
const upToDate = (f) => { const r = before.get(keyOf(f.path)); return !!r && r.size === f.size && r.at >= f.updated; };

let copied = 0, skipped = 0;
const queue = [...files];
async function worker() {
  for (let f = queue.shift(); f; f = queue.shift()) {
    if (upToDate(f)) { skipped++; continue; }
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${SOURCE_BUCKET}/${f.path.split("/").map(encodeURIComponent).join("/")}`, { headers });
        if (!res.ok) throw new Error(`받기 실패 ${res.status}`);
        const body = Buffer.from(await res.arrayBuffer());
        if (body.length !== f.size) throw new Error(`크기 다름 ${body.length} != ${f.size}`);
        await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: keyOf(f.path), Body: body, ContentType: f.type, CacheControl: "public, max-age=86400" }));
        copied++;
        if (copied % 100 === 0) console.log(`  ${copied}개 올림`);
        break;
      } catch (error) {
        if (attempt >= 4) throw new Error(`${f.path}: ${error.message}`);
        await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
      }
    }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`올림 ${copied}개, 이미 있음 ${skipped}개`);

// 대조: R2 전체 목록을 다시 받아 경로·크기가 Supabase와 같은지 본다.
const after = await r2List();
const missing = files.filter((f) => after.get(keyOf(f.path))?.size !== f.size);
if (missing.length) {
  console.error(`R2에 없거나 크기가 다른 파일 ${missing.length}개:`, missing.slice(0, 20).map((f) => f.path));
  process.exit(1);
}
console.log(`대조 통과: ${files.length}개 모두 R2에 같은 크기로 있음`);

if (PUBLIC_BASE) {
  const sample = [files[0], files[Math.floor(files.length / 2)], files.at(-1)];
  for (const f of sample) {
    const res = await fetch(`${PUBLIC_BASE}/${SOURCE_BUCKET}/${f.path.split("/").map(encodeURIComponent).join("/")}`);
    const len = (await res.arrayBuffer()).byteLength;
    if (!res.ok || len !== f.size) { console.error(`공개 주소 확인 실패 ${f.path}: ${res.status} ${len}`); process.exit(1); }
  }
  console.log(`공개 주소 확인 통과: ${PUBLIC_BASE}`);
}
