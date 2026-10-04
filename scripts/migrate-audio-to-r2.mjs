// Supabase Storage `audio` 버킷 → Cloudflare R2 로 음성 파일을 같은 경로로 복사한다.
//
// 왜: 음성 전송량이 Supabase 비용의 대부분이다. R2는 전송 요금이 없고 10GB까지 무료.
// 무엇을: Supabase 버킷의 모든 파일을 내려받아 R2에 같은 경로·같은 Content-Type으로 올린다.
//         이미 R2에 같은 크기로 있으면 건너뛴다(다시 돌려도 안전). Supabase 쪽은 지우지 않는다.
// 검증: 올린 뒤 R2의 파일 수·크기를 Supabase와 하나씩 대조하고, 공개 주소(R2_PUBLIC_BASE)가 있으면
//       표본 몇 개를 실제로 받아 본다. 하나라도 다르면 실패로 끝난다.
//
// 환경 변수(GitHub Actions secrets):
//   SUPABASE_SERVICE_ROLE_KEY            Supabase 서비스 키(이미 있음)
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY   R2 API 토큰
//   R2_BUCKET (기본 gfield-audio), R2_PUBLIC_BASE (예: https://audio.gfieldacademy.net, 선택)
//   DRY_RUN=1 이면 목록과 크기만 세고 올리지 않는다.

import { S3Client, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://fgahqumaldheqettmvqg.supabase.co";
const SOURCE_BUCKET = process.env.SOURCE_BUCKET || "audio";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = process.env.R2_BUCKET || "gfield-audio";
const PUBLIC_BASE = (process.env.R2_PUBLIC_BASE || "").replace(/\/$/, "");
const DRY = process.env.DRY_RUN === "1";
for (const name of ["SUPABASE_SERVICE_ROLE_KEY", ...(DRY ? [] : ["R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY"])]) {
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
      else out.push({ path, size: Number(entry.metadata?.size) || 0, type: entry.metadata?.mimetype || "application/octet-stream" });
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

async function r2Size(path) {
  try { return (await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: path }))).ContentLength; } catch { return null; }
}

let copied = 0, skipped = 0;
const queue = [...files];
async function worker() {
  for (let f = queue.shift(); f; f = queue.shift()) {
    if (await r2Size(f.path) === f.size) { skipped++; continue; }
    for (let attempt = 1; ; attempt++) {
      try {
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${SOURCE_BUCKET}/${f.path.split("/").map(encodeURIComponent).join("/")}`, { headers });
        if (!res.ok) throw new Error(`받기 실패 ${res.status}`);
        const body = Buffer.from(await res.arrayBuffer());
        if (body.length !== f.size) throw new Error(`크기 다름 ${body.length} != ${f.size}`);
        await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: f.path, Body: body, ContentType: f.type, CacheControl: "public, max-age=86400" }));
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

// 대조: R2 전체 목록을 받아 경로·크기가 Supabase와 같은지 본다.
const r2 = new Map();
for (let token; ;) {
  const page = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET, ContinuationToken: token }));
  for (const o of page.Contents || []) r2.set(o.Key, o.Size);
  if (!page.IsTruncated) break;
  token = page.NextContinuationToken;
}
const missing = files.filter((f) => r2.get(f.path) !== f.size);
if (missing.length) {
  console.error(`R2에 없거나 크기가 다른 파일 ${missing.length}개:`, missing.slice(0, 20).map((f) => f.path));
  process.exit(1);
}
console.log(`대조 통과: ${files.length}개 모두 R2에 같은 크기로 있음`);

if (PUBLIC_BASE) {
  const sample = [files[0], files[Math.floor(files.length / 2)], files.at(-1)];
  for (const f of sample) {
    const res = await fetch(`${PUBLIC_BASE}/${f.path.split("/").map(encodeURIComponent).join("/")}`);
    const len = (await res.arrayBuffer()).byteLength;
    if (!res.ok || len !== f.size) { console.error(`공개 주소 확인 실패 ${f.path}: ${res.status} ${len}`); process.exit(1); }
  }
  console.log(`공개 주소 확인 통과: ${PUBLIC_BASE}`);
}
