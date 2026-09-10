"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs/promises");

const DEFAULT_SOURCE = "https://hs.gfieldacademy.net/data.js";
const EXPECTED_COUNTS = Object.freeze({ sessions: 6, columns: 5, magazine: 40 });
const VERIFIED_HTTPS_UPGRADES = Object.freeze({
  "http://seoul.thesegye.com/news/view/1065562628426318": "https://seoul.thesegye.com/news/view/1065562628426318"
});
const VERIFIED_UNAVAILABLE_URLS = new Set([
  "https://www.seoul.co.kr/news/society/education-news/2026/02/04/20260204008005"
]);
const MANUAL_ITEMS = Object.freeze([
  {
    id: "hf-seminar-soma-premier-strategy",
    kind: "seminar",
    title: "소마 프리미어 합격 전략",
    summary: "소마 프리미어 합격 전략 영상입니다.",
    content_date: "2026-09-11",
    tags: ["소마", "프리미어", "합격 전략"],
    body_text: "",
    external_url: "https://youtu.be/h197u-ymJag"
  },
  {
    id: "hf-seminar-fields-age6-final-strategy",
    kind: "seminar",
    title: "6세 필즈대비 파이널 전략",
    summary: "6세 필즈 대비 파이널 전략 영상입니다.",
    content_date: "2026-09-11",
    tags: ["6세", "필즈", "파이널 전략"],
    body_text: "",
    external_url: "https://youtu.be/ipM78EnPTTU"
  },
  {
    id: "hf-resource-secret-roadmap-ages-5-6-7",
    kind: "resources",
    title: "상위권 5·6·7세를 위한 맞춤 시크릿 로드맵",
    summary: "아이의 현재 위치와 목표에 맞춰 학습 방향을 살펴보는 시크릿 로드맵입니다.",
    content_date: "2026-09-11",
    tags: ["5세", "6세", "7세", "로드맵"],
    body_text: "",
    external_url: "https://lete-on.gfieldacademy.net/roadmap/demo/"
  }
]);

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : "";
}

function sha(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function decodeEntities(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function htmlToText(value) {
  return decodeEntities(String(value || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/(?:p|h[1-6]|li|ul|ol)>/gi, "\n\n")
    .replace(/<[^>]+>/g, ""))
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstParagraph(value) {
  const match = String(value || "").match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  return htmlToText(match ? match[1] : value).slice(0, 500);
}

function externalUrl(value) {
  const raw = String(value || "").normalize("NFKC").trim();
  const candidate = VERIFIED_HTTPS_UPGRADES[raw] || raw;
  if (!candidate) return null;
  if (VERIFIED_UNAVAILABLE_URLS.has(candidate)) return null;
  const parsed = new URL(candidate);
  if (parsed.protocol !== "https:" || !parsed.hostname || parsed.username || parsed.password || Buffer.byteLength(parsed.href) > 2048) {
    throw new Error(`안전하지 않은 외부 링크: ${candidate}`);
  }
  return parsed.href;
}

function stableId(kind, key) {
  return `hs-vip-${kind}-${sha(String(key)).slice(0, 12)}`;
}

async function readSource(source) {
  if (/^https:\/\//i.test(source)) {
    const response = await fetch(source, { headers: { accept: "application/javascript,text/plain" } });
    if (!response.ok) throw new Error(`황소 VIP 원본을 읽지 못했습니다: HTTP ${response.status}`);
    return response.text();
  }
  return fs.readFile(source, "utf8");
}

function parseSource(script) {
  if (!/window\.GFIELD_DATA\s*=/.test(script)) throw new Error("GFIELD_DATA 원본 형식이 아닙니다.");
  const first = script.indexOf("{");
  const last = script.lastIndexOf("}");
  if (first < 0 || last <= first) throw new Error("GFIELD_DATA JSON을 찾지 못했습니다.");
  return JSON.parse(script.slice(first, last + 1));
}

function assertSource(vip) {
  for (const [key, count] of Object.entries(EXPECTED_COUNTS)) {
    if (!Array.isArray(vip?.[key]) || vip[key].length !== count) {
      throw new Error(`검수한 황소 VIP 원본과 ${key} 건수가 다릅니다. expected=${count}, actual=${vip?.[key]?.length ?? "missing"}`);
    }
  }
  if (!Array.isArray(vip.courses) || vip.courses.length !== 0) throw new Error("새 courses 자료는 별도 검수 후 가져와야 합니다.");
}

function importedItems(vip) {
  const sessions = vip.sessions.map(item => ({
    id: stableId("seminar", item.url || `${item.title}|${item.date}`),
    kind: "seminar",
    title: String(item.title || "").trim(),
    summary: "황소 VIP 자료실에서 가져온 전략 영상입니다.",
    content_date: item.date || null,
    tags: ["황소 대비", "설명회"],
    body_text: "",
    external_url: externalUrl(item.url)
  }));

  const seenColumnTitle = new Map();
  const columns = vip.columns.map(item => {
    const sourceTitle = String(item.title || "").trim();
    const occurrence = (seenColumnTitle.get(sourceTitle) || 0) + 1;
    seenColumnTitle.set(sourceTitle, occurrence);
    const body = htmlToText(item.html).slice(0, 30000);
    let title = sourceTitle;
    if (sourceTitle === "문과형 아이와 이과형 아이의 수학 학습법") {
      title += occurrence === 1 ? " · 맞춤형 학습 전략" : " · 경계를 넘는 학습 전략";
    }
    return {
      id: stableId("column", `${sourceTitle}|${item.date}|${sha(String(item.html || ""))}`),
      kind: "column",
      title,
      summary: firstParagraph(item.html),
      content_date: item.date || null,
      tags: [String(item.category || "프리미엄 칼럼"), "DOCSSAM"],
      body_text: body,
      external_url: null
    };
  });

  const magazine = vip.magazine.map(item => ({
    id: stableId("magazine", `${item.sourceUrl || ""}|${item.title}|${item.date}`),
    kind: "magazine",
    title: String(item.title || "").trim(),
    summary: String(item.desc || "").trim().slice(0, 500),
    content_date: item.date || null,
    tags: [String(item.category || "교육"), String(item.source || "교육 매거진")],
    body_text: "",
    external_url: externalUrl(item.sourceUrl)
  }));

  const items = [...sessions, ...columns, ...magazine, ...MANUAL_ITEMS].map(item => ({ ...item, status: "published" }));
  for (const item of items) {
    if (!item.id || !item.title || !["resources", "seminar", "column", "magazine"].includes(item.kind)) throw new Error("가져오기 항목 검증에 실패했습니다.");
  }
  if (new Set(items.map(item => item.id)).size !== items.length) throw new Error("가져오기 콘텐츠 ID가 중복됩니다.");
  return items;
}

function sqlFor(items) {
  const json = JSON.stringify(items);
  const tag = `$hf_vip_${sha(json).slice(0, 12)}$`;
  if (json.includes(tag)) throw new Error("SQL 구분자 충돌");
  return `begin;
with payload as (
  select value as item
  from jsonb_array_elements(${tag}${json}${tag}::jsonb)
)
insert into public.hf_vip_contents (
  id, kind, title, summary, content_date, tags, body_html, external_url,
  status, published_at, created_at, updated_at
)
select
  item->>'id', item->>'kind', item->>'title', item->>'summary',
  nullif(item->>'content_date', '')::date,
  array(select jsonb_array_elements_text(item->'tags')),
  item->>'body_text', nullif(item->>'external_url', ''),
  'published', now(), now(), now()
from payload
on conflict (id) do update set
  kind = excluded.kind,
  title = excluded.title,
  summary = excluded.summary,
  content_date = excluded.content_date,
  tags = excluded.tags,
  body_html = excluded.body_html,
  external_url = excluded.external_url,
  status = 'published',
  published_at = coalesce(hf_vip_contents.published_at, excluded.published_at),
  updated_at = now();
commit;
select kind, count(*)::int as count
from public.hf_vip_contents
where id like 'hs-vip-%' or id in (
  'hf-seminar-soma-premier-strategy',
  'hf-seminar-fields-age6-final-strategy',
  'hf-resource-secret-roadmap-ages-5-6-7'
)
group by kind
order by kind;`;
}

async function main() {
  const source = argValue("--source") || DEFAULT_SOURCE;
  const mode = process.argv.includes("--sql") ? "sql" : "audit";
  const script = await readSource(source);
  const data = parseSource(script);
  assertSource(data.vip);
  const items = importedItems(data.vip);
  if (mode === "sql") {
    process.stdout.write(sqlFor(items));
    return;
  }
  const counts = Object.fromEntries(["resources", "seminar", "column", "magazine"].map(kind => [kind, items.filter(item => item.kind === kind).length]));
  process.stdout.write(`${JSON.stringify({ source, selectedSourceSha256: sha(JSON.stringify({ sessions: data.vip.sessions, columns: data.vip.columns, magazine: data.vip.magazine })), importedItemsSha256: sha(JSON.stringify(items)), counts, total: items.length }, null, 2)}\n`);
}

main().catch(error => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
