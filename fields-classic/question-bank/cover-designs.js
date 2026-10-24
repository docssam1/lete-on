// 교재 표지 — 지금까지 만든 시안을 모두 한곳에 모아 인쇄할 때 고른다(원장 지시 2026-10-24: 「여러 개 있어서 선택할 수 있게」).
// 문제은행 학습지(print-templates.js)와 골든벨 교재 인쇄(golden-bell.js)가 같은 목록·같은 그림을 쓴다.
// 그림은 전부 원본 SVG 도형이고 글자는 진짜 글자다. 크기는 종이 폭 기준(--mm = 종이 1mm)이라 미리보기 작은 칸에서도 같은 모양으로 줄어든다.
// 생김새 규칙: .claude/skills/gfield-textbook-design/SKILL.md · 시안 모음: design-draft/covers.html
// 1차·2차 시안은 3차(A·B·C)로 바뀌기 전 것이다. 2차의 「종이 오리기 풍경」「전면 무늬」는 그때 「촌스럽다」는 말을 들었지만,
// 고를 수 있게 남겨 두라는 지시라 목록에 넣고 묶음 이름으로 구분한다.

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

export const COVER_GROUNDS = [
  { id: "green", label: "초록", color: "#16382a" },
  { id: "wine", label: "와인", color: "#4a1f2a" },
  { id: "ink", label: "먹", color: "#2a241c" }
];

export const COVER_DESIGNS = [
  { id: "a", group: "3차 시안", label: "A 흰 바탕 · 광택 도형" },
  { id: "b", group: "3차 시안", label: "B 딥 그린 · 금 라인", grounds: true },
  { id: "c", group: "3차 시안", label: "C 기하 포스터" },
  { id: "r2-cubes", group: "2차 시안", label: "쌓기나무 탑" },
  { id: "r2-paper", group: "2차 시안", label: "종이 오리기 풍경" },
  { id: "r2-motif", group: "2차 시안", label: "전면 무늬" },
  { id: "r1-shape", group: "1차 시안", label: "도형 하나" },
  { id: "r1-grid", group: "1차 시안", label: "모눈과 번호" },
  { id: "r1-band", group: "1차 시안", label: "색 띠" }
];
export const isCoverDesign = (id) => COVER_DESIGNS.some((design) => design.id === id);

// 한 문서에 표지가 여러 장(미리보기 칸) 들어가도 SVG 그라데이션·필터 id가 겹치지 않게 한다.
let serial = 0;

// 제목은 공백 기준으로 두 줄에 나눠 쓴다(「도형 움직이기와 / 마방진」처럼 앞줄이 길게).
export function titleLines(title) {
  const words = String(title || "").split(/\s+/).filter(Boolean);
  if (words.length < 2 || title.length <= 8) return esc(title);
  let best = 1;
  let bestGap = Infinity;
  for (let cut = 1; cut < words.length; cut += 1) {
    const left = words.slice(0, cut).join(" ").length;
    const right = words.slice(cut).join(" ").length;
    const gap = Math.abs(left - right * 1.4);
    if (gap < bestGap) { bestGap = gap; best = cut; }
  }
  return `${esc(words.slice(0, best).join(" "))}<br>${esc(words.slice(best).join(" "))}`;
}

// ── 3차 시안 A·B·C ──
function art3(kind, volume, ground, u) {
  if (kind === "a") {
    return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><defs>
      <linearGradient id="g${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5da97c"/><stop offset="1" stop-color="#1e5a3c"/></linearGradient>
      <linearGradient id="r${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9d73"/><stop offset="1" stop-color="#d9542b"/></linearGradient>
      <linearGradient id="y${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd978"/><stop offset="1" stop-color="#d99a1f"/></linearGradient>
      <radialGradient id="s${u}" cx=".32" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".35" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <filter id="d${u}" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#211c15" flood-opacity=".22"/></filter></defs>
      <text x="150" y="252" font-size="150" font-weight="200" fill="#f0e9db" text-anchor="middle">${esc(volume)}</text>
      <g filter="url(#d${u})"><circle cx="76" cy="196" r="34" fill="url(#g${u})"/><ellipse cx="66" cy="182" rx="20" ry="14" fill="url(#s${u})"/></g>
      <g filter="url(#d${u})" transform="rotate(-10 142 216)"><path d="M118 206l24-14 24 14-24 14Z" fill="url(#y${u})"/><path d="M118 206v26l24 14v-26Z" fill="#c98a12"/><path d="M166 206v26l-24 14v-26Z" fill="#a66f08"/><path d="M118 206l24-14 24 14" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/></g>
      <g filter="url(#d${u})"><path d="M104 160 l18 46 a18 7 0 0 1 -36 0Z" fill="url(#r${u})"/><ellipse cx="104" cy="206" rx="18" ry="7" fill="#b43f1b"/><path d="M104 160 l-9 23" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/></g>
      <circle cx="160" cy="150" r="4.5" fill="url(#r${u})"/><circle cx="52" cy="142" r="3" fill="url(#y${u})"/></svg>`;
  }
  if (kind === "b") {
    return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><rect width="210" height="297" fill="${ground}"/>
      <g stroke="#d9a62e" stroke-width="1" fill="none" opacity=".9"><path d="M44 128H250M44 188H250M44 248H250"/><path d="M74 98V320M134 98V320M194 98V320"/></g>
      <g fill="#d9a62e"><circle cx="74" cy="128" r="2.6"/><circle cx="134" cy="188" r="2.6"/><circle cx="194" cy="248" r="2.6"/></g>
      <rect x="74" y="128" width="60" height="60" fill="#d9a62e" opacity=".14"/>
      <text x="172" y="268" font-size="88" font-weight="200" fill="#d9a62e" fill-opacity=".9" text-anchor="middle">${esc(volume)}</text></svg>`;
  }
  return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><rect x="0" y="170" width="210" height="127" fill="#211c15"/>
    <circle cx="52.5" cy="201" r="22" fill="#e8734a"/><path d="M83 223 h53 v-44Z" fill="#2f8f5b"/><rect x="146" y="181" width="40" height="40" fill="#d9a62e"/>
    <path d="M30.5 240 a22 22 0 0 1 44 0Z" fill="#d9a62e"/><rect x="85" y="240" width="49" height="33" fill="#e8734a"/>
    <circle cx="166" cy="256" r="22" fill="#f5efe2"/><circle cx="166" cy="256" r="9" fill="#2f8f5b"/>
    <path d="M12 142h186" stroke="#d8ccb4" stroke-width=".5"/></svg>`;
}

// ── 2차 시안 ──
const cube = (x, y) => `<g transform="translate(${x} ${y})"><path d="M0 6l10-6 10 6-10 6Z" fill="#ffeaa6"/><path d="M0 6v12l10 6V12Z" fill="#ffd45c"/><path d="M20 6v12l-10 6V12Z" fill="#f0b23a"/><path d="M0 6v12l10 6V12L0 6l10-6 10 6v12l-10 6" fill="none" stroke="#a8741a" stroke-width=".7"/></g>`;
function art2(kind, volume, u) {
  if (kind === "r2-paper") {
    const dots = [84, 104, 124].map((y) => [20, 44, 68, 92, 116, 140, 164, 188].map((x) => `<circle cx="${x}" cy="${y}" r=".8"/>`).join("")).join("");
    return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><defs>
      <filter id="a${u}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1.6" stdDeviation="1.4" flood-color="#5a4322" flood-opacity=".28"/></filter>
      <filter id="b${u}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="1" stdDeviation=".9" flood-color="#5a4322" flood-opacity=".22"/></filter></defs>
      <g fill="#e7dcc4">${dots}</g>
      <g filter="url(#b${u})"><path d="M158 118 a24 24 0 0 1 48 0 Z" fill="#d9a62e"/><rect x="158" y="118" width="48" height="2.4" fill="#b4512e"/></g>
      <circle cx="36" cy="236" r="86" fill="#9dbfa4" filter="url(#a${u})"/><circle cx="206" cy="252" r="96" fill="#7fa88a" filter="url(#a${u})"/>
      <circle cx="92" cy="298" r="104" fill="#2f6b4a" filter="url(#a${u})"/>
      <g filter="url(#b${u})"><rect x="24" y="196" width="40" height="40" rx="3" fill="#fbf5e8"/>
        <g stroke="#2a241c" stroke-width=".8"><path d="M24 209.3h40M24 222.6h40M37.3 196v40M50.6 196v40"/></g>
        <g font-size="8.4" fill="#2a241c" text-anchor="middle"><text x="30.6" y="206">8</text><text x="57.3" y="206">6</text><text x="44" y="219">5</text><text x="30.6" y="232.4">4</text><text x="57.3" y="232.4">2</text></g></g>
      <g filter="url(#a${u})"><circle cx="150" cy="166" r="17" fill="#c05a33"/><path d="M150 149 a17 17 0 0 1 0 34 c5-9 5-25 0-34" fill="#d9a62e" opacity=".9"/>
        <path d="M143 181l7 10 7-10" fill="none" stroke="#2a241c" stroke-width=".9"/><rect x="145.6" y="190" width="8.8" height="6.4" rx="1" fill="#2a241c"/></g>
      <g filter="url(#b${u})">${cube(96, 206)}${cube(116, 194)}${cube(116, 218)}</g>
      <path d="M30 262 C70 250 120 258 182 238" fill="none" stroke="#fbf5e8" stroke-width="1.6" stroke-dasharray="4 4" opacity=".85"/></svg>`;
  }
  if (kind === "r2-cubes") {
    return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><defs>
      <filter id="c${u}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="1.8" flood-color="#6a5125" flood-opacity=".3"/></filter></defs>
      <g stroke="#eadfc6" stroke-width=".5"><path d="M-20 80 L230 220M-20 120 L230 260M-20 160 L230 300M-20 40 L230 180M-20 0 L230 140"/><path d="M230 80 L-20 220M230 120 L-20 260M230 160 L-20 300M230 40 L-20 180M230 0 L-20 140"/></g>
      <text x="172" y="268" font-size="110" font-weight="700" fill="none" stroke="#c05a33" stroke-width="1.1" text-anchor="middle" opacity=".85">${esc(volume)}</text>
      <g filter="url(#c${u})" transform="translate(42 150)">
        <path d="M-6 76 l62-36 62 36-62 36Z" fill="#e3d4b2"/><path d="M-6 76v7l62 36v-7Z" fill="#cdbb93"/><path d="M118 76v7l-62 36v-7Z" fill="#bda87e"/>
        <g transform="translate(34 -20)"><path d="M0 40v48l22 12.8V52.8Z" fill="#ffd45c"/><path d="M44 40v48l-22 12.8V52.8Z" fill="#f0b23a"/><path d="M0 40l22-12.8L44 40 22 52.8Z" fill="#ffeaa6"/>
          <path d="M0 40l22-12.8L44 40M0 40v48l22 12.8V52.8L0 40m44 0v48l-22 12.8M22 52.8V100" fill="none" stroke="#a8741a" stroke-width=".8"/><path d="M0 56l22 12.8L44 56M0 72l22 12.8L44 72" fill="none" stroke="#a8741a" stroke-width=".7" opacity=".8"/></g>
        <g transform="translate(62 12)"><path d="M0 28v32l22 12.8V40.8Z" fill="#ffd45c"/><path d="M44 28v32l-22 12.8V40.8Z" fill="#f0b23a"/><path d="M0 28l22-12.8L44 28 22 40.8Z" fill="#ffeaa6"/>
          <path d="M0 28l22-12.8L44 28M0 28v32l22 12.8V40.8L0 28m44 0v32l-22 12.8M22 40.8V72.8" fill="none" stroke="#a8741a" stroke-width=".8"/><path d="M0 44l22 12.8L44 44" fill="none" stroke="#a8741a" stroke-width=".7" opacity=".8"/></g>
        <g transform="translate(6 36)"><path d="M0 16v16l22 12.8V28.8Z" fill="#ffd45c"/><path d="M44 16v16l-22 12.8V28.8Z" fill="#f0b23a"/><path d="M0 16l22-12.8L44 16 22 28.8Z" fill="#ffeaa6"/>
          <path d="M0 16l22-12.8L44 16 22 28.8 0 16v16l22 12.8V28.8m22-12.8v16l-22 12.8" fill="none" stroke="#a8741a" stroke-width=".8"/></g>
        <g transform="translate(56 -8)"><path d="M0 15V-16" stroke="#2a241c" stroke-width="1.2"/><path d="M0 -16l16 4.5L0 -7Z" fill="#2f6b4a"/></g></g>
      <g filter="url(#c${u})"><circle cx="36" cy="128" r="7" fill="#c05a33"/><path d="M166 120l8 14h-16Z" fill="#2f6b4a"/><rect x="26" y="252" width="12" height="12" rx="2" fill="#d9a62e" transform="rotate(-12 32 258)"/></g></svg>`;
  }
  return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><defs>
    <pattern id="m${u}" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
      <g fill="none" stroke="#fbf5e8" stroke-width="1.1" opacity=".5"><circle cx="10" cy="10" r="6"/><path d="M10 6v4l3 2"/>
        <path d="M31 4l1.8 3.8 4.2.6-3 2.9.7 4.2-3.7-2-3.7 2 .7-4.2-3-2.9 4.2-.6Z"/>
        <path d="M6 28h6v6H6Zm9 0h-1"/><path d="M15 25v12" stroke-dasharray="2 1.6"/><path d="M18 28h6v6h-6Z" opacity=".6"/>
        <g fill="#fbf5e8" stroke="none"><circle cx="33" cy="30" r="1.3"/><circle cx="38" cy="30" r="1.3"/><circle cx="33" cy="35" r="1.3"/><circle cx="38" cy="35" r="1.3"/><circle cx="35.5" cy="32.5" r="1.3"/></g></g></pattern></defs>
    <rect width="210" height="297" fill="#2f6b4a"/><rect width="210" height="297" fill="url(#m${u})"/>
    <rect x="8" y="8" width="194" height="281" fill="none" stroke="#d9a62e" stroke-width="1"/><rect x="10.5" y="10.5" width="189" height="276" fill="none" stroke="#d9a62e" stroke-width=".4"/></svg>`;
}

// info: { title, subtitle, volume(권 번호 숫자), eyebrow(위쪽 작은 줄), pubRight, stats(1차 「색 띠」 띠 안 글) }
export function coverDesignPage(id, info, { ground = "green" } = {}) {
  const u = `cv${(serial += 1)}`;
  const groundColor = COVER_GROUNDS.find((option) => option.id === ground)?.color || COVER_GROUNDS[0].color;
  const volume = info.volume || "";
  const eyebrow = esc(info.eyebrow || "GIFTED MATH BANK");
  const title = titleLines(info.title);
  const sub = esc(info.subtitle || "");
  const pub = `<span class="pt-pub"><span>지필드 영재교육</span><span>${esc(info.pubRight || "GOLDEN BELL SERIES")}</span></span>`;
  let body;
  if (["a", "b", "c"].includes(id)) {
    const badge = id === "a" && volume ? `<span class="pt-cover-lv">${esc(volume)}</span>` : id === "c" && volume ? `<span class="pt-cover-num">${esc(volume)}</span>` : "";
    body = `${art3(id, volume, groundColor, u)}<div class="pt-plate"><span class="pt-eyebrow">${eyebrow}</span><h1>${title}</h1><span class="pt-sub">${sub}</span></div>${badge}${pub}`;
  } else if (id === "r2-paper") {
    body = `${art2(id, volume, u)}<div class="cv-plate"><span class="cv-eyebrow">${eyebrow}</span><h1>${title}</h1><span class="cv-sub">${sub}</span></div>${volume ? `<span class="cv-badge">${esc(volume)}</span>` : ""}${pub}`;
  } else if (id === "r2-cubes") {
    body = `${art2(id, volume, u)}<div class="cv-plate"><span class="cv-eyebrow">${eyebrow}</span><h1>${esc(info.title)}</h1></div>${volume ? `<span class="cv-chip">제 ${esc(volume)} 권</span>` : ""}${pub}`;
  } else if (id === "r2-motif") {
    body = `${art2(id, volume, u)}<div class="cv-plate"><span class="cv-eyebrow">${eyebrow}</span><h1>${title}</h1><span class="cv-sub">${sub}</span>${volume ? `<span class="cv-volline">제 ${esc(volume)} 권</span>` : ""}</div>${pub}`;
  } else if (id === "r1-shape") {
    body = `<span class="cv-series">${eyebrow}</span>${volume ? `<span class="cv-vol">${esc(volume)}</span>` : ""}<h1 class="cv-title">${title}</h1><span class="cv-sub1">${sub}</span><span class="cv-shape" aria-hidden="true"></span>${pub}`;
  } else if (id === "r1-grid") {
    body = `<span class="cv-grid" aria-hidden="true"></span><span class="cv-keyline" aria-hidden="true"></span><span class="cv-series">${eyebrow}</span><h1 class="cv-title">${title}</h1><span class="cv-sub1">${sub}</span>${volume ? `<span class="cv-bigno" aria-hidden="true">${esc(volume)}</span>` : ""}${pub}`;
  } else {
    body = `<span class="cv-series">${eyebrow}</span>${volume ? `<span class="cv-vol">${esc(volume)}권</span>` : ""}<h1 class="cv-title">${title}</h1><span class="cv-sub1">${sub}</span><span class="cv-band" aria-hidden="true"><span class="cv-band-in">${esc(info.stats || "").replace(/\n/g, "<br>")}</span></span>${pub}`;
  }
  return `<section class="pt-paper pt-cover pt-cover-${id}" aria-label="표지"><div class="pt-in">${body}</div></section>`;
}
