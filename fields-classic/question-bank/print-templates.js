// 인쇄 양식 — 학습지를 인쇄하기 전에 표지·단원 내지·본문 꼴·단 수·쪽 번호를 고른다.
// 생김새 규칙은 스킬 .claude/skills/gfield-textbook-design/SKILL.md 와 design-draft/ 시안을 따른다.
// 문항 카드는 app.js 가 만든 그대로 쓰고, 여기서는 쪽 묶음과 쪽 바깥(표지·내지·바닥글)만 그린다.
// 표지·내지에는 공개 정보(책 제목·단원 이름·유형 이름·문항 수)만 쓴다 — 정답은 여기 오지 않는다.

const STORAGE_KEY = "fcPrintTemplate.v1";

export const PRINT_TEMPLATE_OPTIONS = {
  cover: [
    { id: "none", label: "없음" },
    { id: "a", label: "A 흰 바탕 · 광택 도형" },
    { id: "b", label: "B 딥 그린 · 금 라인" },
    { id: "c", label: "C 기하 포스터" }
  ],
  unit: [
    { id: "none", label: "없음" },
    { id: "toc", label: "목차형" },
    { id: "map", label: "배움 지도형" },
    { id: "poster", label: "포스터형" }
  ],
  form: [
    { id: "basic", label: "기본" },
    { id: "exam", label: "시험지형" },
    { id: "lesson", label: "교재형" }
  ],
  cols: [
    { id: "1", label: "1단 · 쪽당 2문항" },
    { id: "2", label: "2단 · 쪽당 4문항" }
  ],
  ground: [
    { id: "green", label: "초록", color: "#16382a" },
    { id: "wine", label: "와인", color: "#4a1f2a" },
    { id: "ink", label: "먹", color: "#2a241c" }
  ]
};

const DEFAULTS = { cover: "none", unit: "none", form: "basic", cols: "1", pageNo: true, ground: "green", title: "", subtitle: "", volume: "" };

export function loadPrintTemplate() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const settings = { ...DEFAULTS };
    for (const key of Object.keys(PRINT_TEMPLATE_OPTIONS)) {
      if (PRINT_TEMPLATE_OPTIONS[key].some((option) => option.id === saved[key])) settings[key] = saved[key];
    }
    if (typeof saved.pageNo === "boolean") settings.pageNo = saved.pageNo;
    return settings;
  } catch {
    return { ...DEFAULTS };
  }
}

function saveSettings(settings) {
  // 제목·부제·권 번호는 학습지마다 달라서 저장하지 않는다.
  const { title, subtitle, volume, ...kept } = settings;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(kept)); } catch { /* 저장이 막혀도 인쇄는 된다 */ }
}

const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function choiceGroup(name, legend, current) {
  return `<fieldset class="pt-group" data-pt-group="${name}"><legend>${legend}</legend><div>${PRINT_TEMPLATE_OPTIONS[name].map((option) =>
    `<label class="pt-chip${option.color ? " has-swatch" : ""}"><input type="radio" name="pt-${name}" value="${option.id}" ${option.id === current ? "checked" : ""} />${option.color ? `<i style="background:${option.color}"></i>` : ""}<span>${option.label}</span></label>`).join("")}</div></fieldset>`;
}

// 패널은 한 번만 그리고, 바뀔 때마다 onChange(settings) 를 부른다.
export function mountPrintTemplatePanel(container, settings, defaults, onChange) {
  container.innerHTML = `<details class="pt-panel" open>
    <summary><strong>인쇄 양식</strong><span>표지 · 단원 내지 · 본문 꼴 · 단 수 · 쪽 번호</span></summary>
    <div class="pt-body">
      ${choiceGroup("cover", "표지", settings.cover)}
      <div class="pt-cover-fields" ${settings.cover === "none" ? "hidden" : ""}>
        <label>표지 제목<input type="text" data-pt-field="title" value="${esc(settings.title || defaults.title)}" maxlength="40" /></label>
        <label>부제<input type="text" data-pt-field="subtitle" value="${esc(settings.subtitle || defaults.subtitle)}" maxlength="40" /></label>
        <label>권 번호<input type="text" data-pt-field="volume" value="${esc(settings.volume || defaults.volume)}" maxlength="4" inputmode="numeric" /></label>
        <div class="pt-ground" ${settings.cover === "b" ? "" : "hidden"}>${choiceGroup("ground", "B안 바탕", settings.ground)}</div>
      </div>
      ${choiceGroup("unit", "단원 내지", settings.unit)}
      ${choiceGroup("form", "본문 꼴", settings.form)}
      ${choiceGroup("cols", "단 수", settings.cols)}
      <label class="pt-switch"><input type="checkbox" data-pt-field="pageNo" ${settings.pageNo ? "checked" : ""} /><span>쪽 번호 넣기 <small>표지에는 넣지 않아요</small></span></label>
    </div>
  </details>`;
  const read = (textOnly = false) => {
    const next = { ...settings };
    for (const name of Object.keys(PRINT_TEMPLATE_OPTIONS)) {
      const checked = container.querySelector(`input[name="pt-${name}"]:checked`);
      if (checked) next[name] = checked.value;
    }
    container.querySelectorAll("[data-pt-field]").forEach((input) => {
      next[input.dataset.ptField] = input.type === "checkbox" ? input.checked : input.value.trim();
    });
    container.querySelector(".pt-cover-fields").hidden = next.cover === "none";
    container.querySelector(".pt-ground").hidden = next.cover !== "b";
    Object.assign(settings, next);
    saveSettings(settings);
    onChange(settings, { textOnly });
  };
  container.addEventListener("change", (event) => { if (event.target.type !== "text") read(); });
  container.addEventListener("input", (event) => { if (event.target.type === "text") read(true); });
  return {
    // 학습지를 새로 만들 때(다른 책·다른 범위) 표지 글자를 그 학습지 기본값으로 되돌린다.
    resetCoverText(nextDefaults) {
      settings.title = nextDefaults.title;
      settings.subtitle = nextDefaults.subtitle;
      settings.volume = nextDefaults.volume;
      container.querySelector('[data-pt-field="title"]').value = nextDefaults.title;
      container.querySelector('[data-pt-field="subtitle"]').value = nextDefaults.subtitle;
      container.querySelector('[data-pt-field="volume"]').value = nextDefaults.volume;
    }
  };
}

// ── 단원 묶기 ─────────────────────────────────────────────
// 교재 단원(book.units[].typeIds)에 들어 있으면 그 단원, 아니면 유형의 중분류로 묶는다.
function unitOf(question, book) {
  const unitIndex = book?.units?.findIndex((unit) => unit.typeIds?.includes(question.type.id)) ?? -1;
  if (unitIndex >= 0) return { key: `u${unitIndex}`, label: book.units[unitIndex].label, index: unitIndex };
  return { key: `m:${question.type.middle}`, label: question.type.middle, index: -1 };
}

function unitRuns(questions, book) {
  const runs = [];
  questions.forEach((question, index) => {
    const unit = unitOf(question, book);
    const last = runs[runs.length - 1];
    if (last && last.key === unit.key) last.indexes.push(index);
    else runs.push({ ...unit, indexes: [index] });
  });
  return runs;
}

function typeLabelsOf(run, questions) {
  const seen = new Map();
  run.indexes.forEach((index) => {
    const type = questions[index].type;
    if (!seen.has(type.label)) seen.set(type.label, { label: type.label, middle: type.middle, numbers: [] });
    seen.get(type.label).numbers.push(index + 1);
  });
  return [...seen.values()].map((type) => ({ ...type, where: numbersLabel(type.numbers) }));
}

// 문항 번호가 이어지면 「3~5번」, 흩어져 있으면(섞기 순서) 「4문항」으로 쓴다.
function numbersLabel(numbers) {
  if (numbers.length === 1) return `${numbers[0]}번`;
  const contiguous = numbers.every((number, index) => index === 0 || number === numbers[index - 1] + 1);
  return contiguous ? `${numbers[0]}~${numbers[numbers.length - 1]}번` : `${numbers.length}문항`;
}

// ── 표지 ────────────────────────────────────────────────
function coverArt(kind, volume, groundColor) {
  if (kind === "a") {
    return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><defs>
      <linearGradient id="ptGreen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5da97c"/><stop offset="1" stop-color="#1e5a3c"/></linearGradient>
      <linearGradient id="ptCoral" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9d73"/><stop offset="1" stop-color="#d9542b"/></linearGradient>
      <linearGradient id="ptGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd978"/><stop offset="1" stop-color="#d99a1f"/></linearGradient>
      <radialGradient id="ptShine" cx=".32" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".35" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <filter id="ptDrop" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#211c15" flood-opacity=".22"/></filter></defs>
      <text x="150" y="252" font-size="150" font-weight="200" fill="#f0e9db" text-anchor="middle">${esc(volume)}</text>
      <g filter="url(#ptDrop)"><circle cx="76" cy="196" r="34" fill="url(#ptGreen)"/><ellipse cx="66" cy="182" rx="20" ry="14" fill="url(#ptShine)"/></g>
      <g filter="url(#ptDrop)" transform="rotate(-10 142 216)"><path d="M118 206l24-14 24 14-24 14Z" fill="url(#ptGold)"/><path d="M118 206v26l24 14v-26Z" fill="#c98a12"/><path d="M166 206v26l-24 14v-26Z" fill="#a66f08"/><path d="M118 206l24-14 24 14" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1"/></g>
      <g filter="url(#ptDrop)"><path d="M104 160 l18 46 a18 7 0 0 1 -36 0Z" fill="url(#ptCoral)"/><ellipse cx="104" cy="206" rx="18" ry="7" fill="#b43f1b"/><path d="M104 160 l-9 23" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/></g>
      <circle cx="160" cy="150" r="4.5" fill="url(#ptCoral)"/><circle cx="52" cy="142" r="3" fill="url(#ptGold)"/></svg>`;
  }
  if (kind === "b") {
    return `<svg class="pt-art" viewBox="0 0 210 297" aria-hidden="true"><rect width="210" height="297" fill="${groundColor}"/>
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

// 제목은 공백 기준으로 두 줄에 나눠 쓴다(「도형 움직이기와 / 마방진」처럼 앞줄이 길게).
function titleLines(title) {
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

function coverPage(settings, info) {
  const ground = PRINT_TEMPLATE_OPTIONS.ground.find((option) => option.id === settings.ground)?.color || "#16382a";
  const volume = settings.volume || info.volume;
  const kind = settings.cover;
  const badge = kind === "a" && volume ? `<span class="pt-cover-lv">${esc(volume)}</span>` : kind === "c" && volume ? `<span class="pt-cover-num">${esc(volume)}</span>` : "";
  return `<section class="pt-paper pt-cover pt-cover-${kind}" aria-label="표지"><div class="pt-in">
    ${coverArt(kind, volume, ground)}
    <div class="pt-plate"><span class="pt-eyebrow">GFIELD CLASSIC${info.bookLabel ? ` · ${esc(info.bookLabel)}` : ""}</span>
      <h1>${titleLines(settings.title || info.title)}</h1>
      <span class="pt-sub">${esc(settings.subtitle || info.subtitle)}</span></div>
    ${badge}
    <span class="pt-pub"><span>지필드 영재교육</span><span>QUESTION BANK</span></span>
  </div></section>`;
}

// ── 단원 내지 ─────────────────────────────────────────────
function pageFoot(info, settings, pageNumber) {
  return `<footer class="pt-foot"><span>${esc(info.footLabel)}</span><span class="pt-pg">${settings.pageNo ? pageNumber : ""}</span></footer>`;
}

function unitPage(kind, run, runNumber, ctx, pageNumber) {
  const { questions, info, settings, book } = ctx;
  const types = typeLabelsOf(run, questions);
  const count = run.indexes.length;
  const numberLabel = String(runNumber).padStart(2, "0");
  const range = numbersLabel(run.indexes.map((index) => index + 1));
  const keywords = [...new Set(types.map((type) => type.middle))].slice(0, 4).join(" · ");
  let body = "";
  if (kind === "toc") {
    body = `<div class="pt-u1-band"><span class="pt-u1-no">${runNumber}</span>${info.bookLabel ? `<span class="pt-u1-grade">${esc(info.bookLabel)}</span>` : ""}
      <h1>${esc(run.label)}</h1><p>문항 ${count}개 · ${range}</p></div>
      <div class="pt-u1-list"><div class="hd"><span></span><span>유형</span><span>문항</span><span>공부한 날</span><span>확인</span></div>
      ${types.map((type, index) => `<div class="pt-u1-row"><span class="n">${index + 1}</span><span>${esc(type.label)}</span><span class="d">${type.where}</span><span class="d">월　　일</span><span class="c"></span></div>`).join("")}</div>
      ${keywords ? `<div class="pt-u1-foot"><svg width="58" height="48" viewBox="0 0 64 54" aria-hidden="true"><circle cx="22" cy="27" r="16" fill="#5da97c"/><ellipse cx="17" cy="21" rx="8" ry="5.4" fill="#fff" opacity=".55"/><rect x="38" y="19" width="16" height="16" rx="2.5" fill="#d9a62e" transform="rotate(-9 46 27)"/><circle cx="51" cy="13" r="3.4" fill="#e8734a"/></svg><p><b>이 단원의 열쇠말</b> — ${esc(keywords)}. 한 유형을 끝낼 때마다 확인 칸에 동그라미를 채워 보세요.</p></div>` : ""}`;
  } else if (kind === "map") {
    const units = book?.units || [];
    const step = (tag, label, note, now) => label ? `<div class="pt-u2-step${now ? " now" : ""}"><span class="tag">${tag}</span><div><b>${esc(label)}</b>${note ? `<p>${esc(note)}</p>` : ""}</div></div>` : "";
    const prev = run.index > 0 ? units[run.index - 1]?.label : "";
    const next = run.index >= 0 && run.index < units.length - 1 ? units[run.index + 1]?.label : "";
    // 여러 단원이 섞인 학습지는 지난/다음 대신 들어 있는 단원을 차례로 보인다.
    const steps = run.parts
      ? run.parts.map((part, index) => step(`단원 ${index + 1}`, part.label, `${part.count}문항`, true)).join("")
      : `${step("지난 학습", prev, "", false)}${step("이번 단원", run.label, types.map((type) => type.label).slice(0, 4).join(" · "), true)}${step("다음 학습", next, "", false)}`;
    body = `<header class="pt-u2-head"><span class="pt-u2-no">${runNumber}</span><div><h1>${esc(run.label)}</h1><small>${esc(info.footLabel)} · 문항 ${count}개</small></div></header>
      <p class="pt-u2-label">${run.parts ? "이 학습지에 들어 있는 단원" : "이 단원에서 배우는 것"}</p>
      <div class="pt-u2-map">${steps}</div>
      <p class="pt-u2-label">이 단원에서 풀 문제</p>
      <div class="pt-u2-ready"><ol>${types.map((type) => `<li><b>${type.where}</b> ${esc(type.label)}</li>`).join("")}</ol></div>`;
  } else {
    body = `<svg class="pt-u3-art" viewBox="0 0 96 120" aria-hidden="true"><defs><linearGradient id="ptU3g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5da97c"/><stop offset="1" stop-color="#1e5a3c"/></linearGradient><linearGradient id="ptU3c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9d73"/><stop offset="1" stop-color="#d9542b"/></linearGradient></defs>
      <rect width="96" height="120" fill="#f3ede0"/><rect x="14" y="26" width="26" height="26" rx="4" fill="url(#ptU3g)"/><rect x="52" y="26" width="26" height="26" rx="4" fill="none" stroke="#2f6b4a" stroke-width="1.6"/>
      <circle cx="27" cy="78" r="12" fill="url(#ptU3c)"/><path d="M53 90l12-24 12 24Z" fill="#d9a62e"/><text x="46" y="110" font-size="7" font-weight="700" fill="#938a77" text-anchor="middle">UNIT ${numberLabel}</text></svg>
      <span class="pt-u3-no">UNIT ${numberLabel}</span><h1 class="pt-u3-title">${esc(run.label)}</h1>
      <p class="pt-u3-lead">${esc(info.footLabel)}의 「${esc(run.label)}」 단원입니다. 아래 유형을 차례로 풀어 봅니다.</p>
      <div class="pt-u3-goals">${types.slice(0, 5).map((type, index) => `<div class="pt-u3-goal"><i>${index + 1}</i><span><b>${esc(type.label)}</b> <small>${type.where}</small></span></div>`).join("")}</div>
      <span class="pt-u3-start">문항 ${count}개 · 유형 ${types.length}개</span>`;
  }
  return `<section class="pt-paper pt-unit pt-unit-${kind}" aria-label="단원 내지 — ${esc(run.label)}"><div class="pt-in">${body}${pageFoot(info, settings, pageNumber)}</div></section>`;
}

// ── 쪽 묶기 ──────────────────────────────────────────────
// 반환: lead = 표지와 첫 단원 내지(머리말 앞), grid = 문항 쪽과 그 뒤 단원 내지.
export function layoutWorksheetPages({ cards, questions, settings, info, book }) {
  const perPage = settings.cols === "2" ? 4 : 2;
  const runs = unitRuns(questions, book);
  const distinct = new Set(runs.map((run) => run.key)).size;
  // 같은 단원 문항이 흩어져 있으면(섞기 순서) 단원마다 내지를 넣지 않고 맨 앞에 한 장만 둔다.
  const perUnit = settings.unit !== "none" && runs.length === distinct && runs.length <= 12;
  const parts = [...new Map(runs.map((run) => [run.key, { label: run.label, count: 0 }])).values()];
  runs.forEach((run) => { parts.find((part) => part.label === run.label).count += run.indexes.length; });
  const groups = perUnit ? runs : [{ key: "all", label: parts.length === 1 ? runs[0].label : info.title, index: parts.length === 1 ? runs[0].index : -1, parts: parts.length > 1 ? parts : null, indexes: questions.map((_, index) => index) }];
  const lead = [];
  const grid = [];
  if (settings.cover !== "none") lead.push(coverPage(settings, info));
  let pageNumber = 1;
  groups.forEach((group, groupIndex) => {
    if (settings.unit !== "none") {
      const page = unitPage(settings.unit, group, groupIndex + 1, { questions, info, settings, book }, pageNumber);
      (groupIndex === 0 ? lead : grid).push(page);
      pageNumber += 1;
    }
    for (let start = 0; start < group.indexes.length; start += perPage) {
      const slice = group.indexes.slice(start, start + perPage);
      grid.push(`<section class="question-page" data-per-page="${perPage}" aria-label="${pageNumber}쪽">${slice.map((index) => cards[index]).join("")}${pageFoot(info, settings, pageNumber)}</section>`);
      pageNumber += 1;
    }
  });
  return { lead: lead.join(""), grid: grid.join("") };
}

export function printTemplateClasses(settings) {
  return [`pt-form-${settings.form}`, `pt-cols-${settings.cols}`, settings.pageNo ? "" : "pt-pg-off"].filter(Boolean);
}
