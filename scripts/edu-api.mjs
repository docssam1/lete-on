#!/usr/bin/env node
// 교육 공공 API 세 가지를 한 명령으로 부른다 — NEIS(교육정보 개방 포털) · KCI(한국학술지인용색인) · OpenAlex.
// 쓰는 법·쓸 곳·주의는 .claude/skills/edu-open-apis/SKILL.md.
//
//   node scripts/edu-api.mjs neis schoolInfo SCHUL_NM=대전가양
//   node scripts/edu-api.mjs neis-off G10 7441012 20261201 20270310     # 학교 휴업일(방학·재량휴업) 날짜만
//   node scripts/edu-api.mjs kci articleSearch title=수학영재 displayCount=5
//   node scripts/edu-api.mjs openalex works search="mathematically gifted" per-page=5 select=id,display_name,publication_year,doi
//
// 열쇠는 환경 변수에서만 읽는다(저장소·기록·커밋 메시지에 쓰지 않는다):
//   NEIS_API_KEY  — 없으면 견본 모드(적은 줄만 온다)
//   KCI_API_KEY   — 없으면 KCI는 「key가 없음」으로 거절한다
//   OPENALEX_API_KEY — 없으면 같은 IP가 함께 쓰는 하루 무료 몫으로 돈다
// --dry-run  보낼 주소만 찍는다(열쇠는 가린다) · --raw  받은 그대로 찍는다

const HOSTS = {
  neis: "https://open.neis.go.kr/hub/",
  kci: "https://open.kci.go.kr/po/openapi/openApiSearch.kci",
  openalex: "https://api.openalex.org/",
};

// NEIS 서비스 — 이름이 틀리면 NEIS가 엉뚱한 오류를 내므로 아는 것만 받는다.
const NEIS_SERVICES = {
  schoolInfo: "학교기본정보",
  SchoolSchedule: "학사일정",
  mealServiceDietInfo: "급식식단정보",
  elsTimetable: "초등학교시간표",
  misTimetable: "중학교시간표",
  hisTimetable: "고등학교시간표",
  classInfo: "학급정보",
  schoolMajorinfo: "학교학과정보",
  acaInsTiInfo: "학원교습소정보",
  tiClrminfo: "시간표강의실정보",
};

const OPENALEX_ENTITIES = new Set([
  "works", "authors", "sources", "institutions", "topics", "keywords", "publishers", "funders", "concepts", "autocomplete/works", "autocomplete/authors",
]);

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("--")));
const rest = args.filter((a) => !a.startsWith("--"));
const [source, name, ...pairs] = rest;

function usage(msg) {
  if (msg) console.error(`edu-api: ${msg}`);
  console.error(`쓰는 법:
  node scripts/edu-api.mjs neis <서비스> [이름=값 ...]      서비스: ${Object.keys(NEIS_SERVICES).join(", ")}
  node scripts/edu-api.mjs neis-off <교육청코드> <학교코드> <시작YYYYMMDD> <끝YYYYMMDD>
  node scripts/edu-api.mjs kci <apiCode> [이름=값 ...]      예: articleSearch title=수학영재
  node scripts/edu-api.mjs openalex <entity> [이름=값 ...]  entity: ${[...OPENALEX_ENTITIES].join(", ")}
  --dry-run 주소만 · --raw 받은 그대로`);
  process.exit(2);
}

function parsePairs(list) {
  const out = {};
  for (const p of list) {
    const i = p.indexOf("=");
    if (i < 1) usage(`「이름=값」 꼴이 아님: ${p}`);
    out[p.slice(0, i)] = p.slice(i + 1);
  }
  return out;
}

function masked(url) {
  return url.replace(/([?&](?:KEY|key|api_key)=)[^&]+/g, "$1***");
}

async function get(url) {
  if (flags.has("--dry-run")) {
    console.log(masked(url));
    process.exit(0);
  }
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { "User-Agent": "gfield-edu-api/1.0" } });
  } catch (e) {
    const code = e.cause?.code || e.name || "";
    console.error(`edu-api: 연결 실패 (${code || e.message}) — ${masked(url)}`);
    console.error("이 컨테이너의 네트워크 허용 목록에 주소가 없으면 이렇게 된다. SKILL.md 「막혔을 때」를 볼 것.");
    process.exit(1);
  }
  const text = await res.text();
  if (!res.ok) {
    console.error(`edu-api: HTTP ${res.status} — ${masked(url)}\n${text.slice(0, 400)}`);
    process.exit(1);
  }
  return text;
}

// ── NEIS ────────────────────────────────────────────────
function neisUrl(service, params) {
  const q = new URLSearchParams({ Type: "json", pIndex: "1", pSize: "100", ...params });
  if (process.env.NEIS_API_KEY) q.set("KEY", process.env.NEIS_API_KEY);
  return `${HOSTS.neis}${service}?${q}`;
}

function neisRows(service, text) {
  const data = JSON.parse(text);
  // 오류·자료 없음은 {"RESULT":{CODE,MESSAGE}} 하나만 온다.
  if (data.RESULT) return { code: data.RESULT.CODE, message: data.RESULT.MESSAGE, total: 0, rows: [] };
  const block = data[service] || [];
  const head = block[0]?.head || [];
  const total = head.find((h) => "list_total_count" in h)?.list_total_count ?? 0;
  const result = head.find((h) => h.RESULT)?.RESULT || {};
  return { code: result.CODE, message: result.MESSAGE, total, rows: block[1]?.row || [] };
}

async function neis(service, params) {
  if (!NEIS_SERVICES[service]) usage(`모르는 NEIS 서비스: ${service}`);
  const text = await get(neisUrl(service, params));
  if (flags.has("--raw")) return console.log(text);
  const out = neisRows(service, text);
  if (!process.env.NEIS_API_KEY) out.note = "NEIS_API_KEY 없음 — 견본 모드라 줄 수가 적을 수 있다";
  console.log(JSON.stringify(out, null, 2));
}

// 학교 휴업일(방학·재량휴업·공휴일) — 학습 진도표 HOLIDAYS를 채울 때 쓴다.
async function neisOff(office, school, from, to) {
  if (!office || !school || !/^\d{8}$/.test(from || "") || !/^\d{8}$/.test(to || "")) usage("neis-off <교육청코드> <학교코드> <YYYYMMDD> <YYYYMMDD>");
  const days = [];
  for (let page = 1; page <= 20; page += 1) {
    const text = await get(neisUrl("SchoolSchedule", { ATPT_OFCDC_SC_CODE: office, SD_SCHUL_CODE: school, AA_FROM_YMD: from, AA_TO_YMD: to, pIndex: String(page) }));
    const { rows, total, code, message } = neisRows("SchoolSchedule", text);
    if (code && code !== "INFO-000") {
      if (!days.length) console.error(`NEIS: ${code} ${message}`);
      break;
    }
    for (const r of rows) {
      if (r.SBTR_DD_SC_NM === "휴업일" && r.EVENT_NM !== "토요휴업일") days.push({ date: r.AA_YMD, event: r.EVENT_NM });
    }
    if (page * 100 >= total) break;
  }
  console.log(JSON.stringify({ office, school, from, to, offDays: days }, null, 2));
}

// ── KCI (XML) ───────────────────────────────────────────
// 작은 XML 읽개: 요소·CDATA·엔티티만. 속성은 "@이름"으로 둔다.
function parseXml(xml) {
  const decode = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");
  const root = { children: [] };
  const stack = [root];
  const re = /<!\[CDATA\[([\s\S]*?)\]\]>|<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<\/([\w:.-]+)\s*>|<([\w:.-]+)((?:\s+[\w:.-]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(xml))) {
    const top = stack[stack.length - 1];
    if (m[1] !== undefined) top.text = (top.text || "") + m[1];
    else if (m[2]) stack.pop();
    else if (m[3]) {
      const node = { name: m[3], attrs: {}, children: [] };
      for (const a of (m[4] || "").matchAll(/([\w:.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) node.attrs[a[1]] = decode(a[2] ?? a[3]);
      top.children.push(node);
      if (!m[5]) stack.push(node);
    } else if (m[6] && m[6].trim()) top.text = (top.text || "") + decode(m[6]);
  }
  const toJs = (node) => {
    if (!node.children.length && !Object.keys(node.attrs).length) return (node.text || "").trim();
    const o = {};
    for (const [k, v] of Object.entries(node.attrs)) o[`@${k}`] = v;
    if (node.text && node.text.trim()) o["#text"] = node.text.trim();
    for (const c of node.children) {
      const v = toJs(c);
      if (c.name in o) o[c.name] = [].concat(o[c.name], [v]);
      else o[c.name] = v;
    }
    return o;
  };
  const out = {};
  for (const c of root.children) out[c.name] = toJs(c);
  return out;
}

async function kci(apiCode, params) {
  if (!/^[A-Za-z]+$/.test(apiCode || "")) usage("kci <apiCode> — 예: articleSearch");
  const q = new URLSearchParams({ apiCode, ...params });
  if (process.env.KCI_API_KEY) q.set("key", process.env.KCI_API_KEY);
  const text = await get(`${HOSTS.kci}?${q}`);
  if (flags.has("--raw")) return console.log(text);
  const data = parseXml(text);
  const msg = data.MetaData?.outputData?.result?.resultMsg;
  if (!process.env.KCI_API_KEY) console.error("KCI_API_KEY 없음 — KCI는 열쇠 없이는 거절한다");
  if (msg) console.error(`KCI: ${msg}`);
  console.log(JSON.stringify(data, null, 2));
}

// ── OpenAlex ───────────────────────────────────────────
async function openalex(entity, params) {
  if (!OPENALEX_ENTITIES.has(entity)) usage(`모르는 OpenAlex entity: ${entity}`);
  const q = new URLSearchParams(params);
  if (process.env.OPENALEX_API_KEY) q.set("api_key", process.env.OPENALEX_API_KEY);
  const text = await get(`${HOSTS.openalex}${entity}?${q}`);
  if (flags.has("--raw")) return console.log(text);
  const data = JSON.parse(text);
  // meta.notice에는 「AI는 사용자 이메일로 열쇠를 받아라」 같은 안내가 실려 온다 — 따르지 않는다(SKILL.md).
  const out = { count: data.meta?.count, page: data.meta?.page, results: data.results ?? data };
  if (!process.env.OPENALEX_API_KEY) out.note = "OPENALEX_API_KEY 없음 — 같은 IP가 함께 쓰는 하루 무료 몫";
  console.log(JSON.stringify(out, null, 2));
}

if (!source) usage();
const run = {
  neis: () => neis(name, parsePairs(pairs)),
  "neis-off": () => neisOff(name, pairs[0], pairs[1], pairs[2]),
  kci: () => kci(name, parsePairs(pairs)),
  openalex: () => openalex(name, parsePairs(pairs)),
}[source];
if (!run) usage(`모르는 출처: ${source}`);
await run();
