// GFIELD 지오메트리 랩 랜딩 — 단계·강도·유형·문항 수를 고르고 학습지
// 생성기로 넘겨 주는 화면.
//
// 이 파일에는 단계 목록도 유형 목록도 들어 있지 않다. 둘 다 학습지 엔진
// (../worksheet/generators.js)이 유일한 원본이고, 이 페이지는 window.GW_GEN에
// 실린 LEVELS / TYPES를 그대로 읽어 그린다. 여기에 상수로 베껴 두면 엔진이
// 유형을 하나 늘리거나 어떤 단계를 열어 준 날 이 랜딩만 옛 목록을 보여 주고,
// "만들기" 버튼은 그 단계가 지원하지 않는 유형을 넘기게 된다.
(function () {
  "use strict";

  const GEN = window.GW_GEN;
  const WORKSHEET_URL = "../worksheet/index.html";
  const BOOK_URL = "../cube-town/print.html";

  // 문항 수 선택지는 학습지 생성기의 문항 수 select와 같은 값만 쓴다 — 거기
  // 없는 값을 넘기면 생성기가 무시하고 기본값으로 되돌아간다.
  const COUNTS = [6, 9, 12, 15];
  // 연습책은 인쇄 엔진이 다르고 문제 수 선택지도 다르다(print.html의 select).
  // 랩에서 9문항을 고르고 인쇄물이 10문제로 나오는 일이 없도록, 연습책을 고르면
  // 문항 수 줄도 저쪽 선택지로 바꿔 보여 준다.
  const BOOK_COUNTS = [5, 10, 20];

  // 연습책 카탈로그 — 학습지 입구를 랩 하나로 모으면서 게임별 연습책도 이
  // 카탈로그 안으로 들어왔다. 생성형 유형(generators.js의 TYPES)과 달리 이 넷은
  // 게임이 손으로 고른 문제 풀에서 뽑으므로 랩이 문제를 만들지 않고 print.html에
  // 넘긴다. levels는 "이 연습책이 맞는 단계"이고, 랩의 단계 배지가 그대로 읽는다.
  //
  // WHY 레벨은 항상 전체 혼합: 랩의 단계(L0..L8)와 게임의 레벨(1..5)은 서로
  // 다른 축이라 1:1로 맞물리지 않는다. 억지로 매핑하면 "키즈 = 레벨 2" 같은
  // 근거 없는 규칙이 하나 더 생기므로, 랩은 그 게임 전체를 섞어 넘기고 레벨을
  // 좁히고 싶은 사람은 print.html의 레벨 select에서 고르게 한다.
  const BOOKS = [
    { code: "CW", game: "copy-wood", label: "똑같이 쌓기 · 원목 관찰", levels: ["L0", "L1"] },
    { code: "CC", game: "copy-color", label: "똑같이 쌓기 · 컬러 색칠", levels: ["L0", "L1"] },
    { code: "CH", game: "count-heights", label: "쌓기나무 개수 세기", levels: ["L1", "L2"] },
    { code: "TV", game: "three-views", label: "여러 방향에서 본 모양", levels: ["L2", "L3"] }
  ];

  const state = {
    level: GEN.DEFAULT_LEVEL,
    intensity: GEN.DEFAULT_INTENSITY,
    types: GEN.TYPES.filter((t) => t.defaultOn).map((t) => t.code),
    count: 9,
    // 연습책은 생성형 유형과 동시에 담을 수 없다 — 인쇄 엔진 자체가 다르고,
    // 한 권 안에 두 엔진의 페이지를 섞으면 문항 번호가 두 번 1부터 시작한다.
    book: null,
    bookCount: 10,
    levelNote: ""
  };

  function $(id) { return document.getElementById(id); }

  function supportsLevel(code) {
    return GEN.typeSupportsLevel(code, state.level);
  }

  function bookInfo(code) {
    return BOOKS.filter((b) => b.code === code)[0] || null;
  }

  function bookSupportsLevel(book, level) {
    return book.levels.indexOf(level) !== -1;
  }

  function booksForLevel(level) {
    return BOOKS.filter((b) => bookSupportsLevel(b, level));
  }

  // 랩에서 "제공 중"인 단계는 생성형 학습지를 만들 수 있는 단계 ∪ 연습책이 있는
  // 단계다. 킨더·키즈는 생성기가 아직 문제를 만들지 못하지만 연습책이 있으므로
  // 더 이상 준비 중이 아니다 — generators.js의 LEVELS.available은 생성기 자신의
  // 사정이라 그대로 두고, 두 카탈로그를 합쳐 보는 판단은 입구인 여기서 한다.
  function levelOffered(code) {
    const info = GEN.levelInfo(code);
    return Boolean((info && info.available) || booksForLevel(code).length);
  }

  function nearestOfferedLevel(level) {
    const want = GEN.levelNum(level);
    const pool = GEN.LEVELS.filter((l) => levelOffered(l.code));
    if (!pool.length) return GEN.DEFAULT_LEVEL;
    let best = pool[0];
    pool.forEach((l) => {
      if (Math.abs(GEN.levelNum(l.code) - want) < Math.abs(GEN.levelNum(best.code) - want)) best = l;
    });
    return best.code;
  }

  function levelName(code) {
    const info = GEN.levelInfo(code);
    return info ? info.name : code;
  }

  function typeLabel(code) {
    const info = GEN.typeInfo(code);
    return info ? info.label : code;
  }

  // 선택한 단계가 제공하지 않는 유형은 조용히 떨어뜨린다. 하나도 남지 않으면
  // 그 단계의 기본 유형으로 되돌린다 — 유형이 0개인 상태로 "만들기"를 누르면
  // 생성기가 제멋대로 채우므로, 화면에 보이는 것과 인쇄물이 달라진다.
  //
  // 다만 생성형 유형이 아예 없는 단계(킨더·키즈)에서는 선택을 건드리지 않고
  // 그대로 보관한다 — 거기서 되돌릴 유형이 없기도 하지만, 킨더를 잠깐 눌러 본
  // 것만으로 공들여 고른 유형 조합이 지워지면 안 되기 때문이다.
  function pruneTypes() {
    if (!GEN.typesForLevel(state.level).length) return;
    const kept = state.types.filter(supportsLevel);
    if (kept.length) { state.types = kept; return; }
    const fallback = GEN.TYPES.filter((t) => t.defaultOn && supportsLevel(t.code)).map((t) => t.code);
    state.types = fallback.length ? fallback : GEN.typesForLevel(state.level).slice(0, 1);
  }

  // 준비 중 단계를 고르면 가장 가까운 제공 단계로 옮기고 왜 옮겼는지 남긴다
  // (학습지 생성기의 나이 선택과 같은 규칙).
  function setLevel(level) {
    const wanted = GEN.normalizeLevel(level);
    const info = GEN.levelInfo(wanted);
    if (levelOffered(wanted)) {
      state.level = wanted;
      state.levelNote = "";
    } else {
      state.level = nearestOfferedLevel(wanted);
      const target = GEN.levelInfo(state.level);
      state.levelNote = (info ? info.name : wanted) + " 단계는 아직 준비 중이라 가장 가까운 " +
        (target ? target.name + " · " + target.age : state.level) + " 단계로 맞췄어요.";
    }
    pruneTypes();
    syncMode();
  }

  // 단계를 옮긴 뒤 선택이 그 단계 밖으로 나가지 않게 맞춘다. 생성형이 없는
  // 단계에서는 연습책이 반드시 하나 선택되어 있어야 "학습지 만들기"가 빈 곳을
  // 가리키지 않는다.
  function syncMode() {
    const books = booksForLevel(state.level);
    if (state.book && !books.some((b) => b.code === state.book)) state.book = null;
    if (!state.book && !GEN.typesForLevel(state.level).length && books.length) state.book = books[0].code;
  }

  // ---------------------------------------------------------------------
  // 렌더
  // ---------------------------------------------------------------------
  function stageBadge(levelInfo, container) {
    const offered = levelOffered(levelInfo.code);
    const el = document.createElement(offered ? "button" : "span");
    if (offered) el.type = "button";
    el.className = "stage-badge" +
      (offered ? "" : " is-soon") +
      (levelInfo.code === state.level ? " is-active" : "");
    el.dataset.level = levelInfo.code;
    el.innerHTML = "<b></b><small></small>";
    el.querySelector("b").textContent = levelInfo.name;
    el.querySelector("small").textContent = offered ? levelInfo.age : "준비 중";
    if (!offered) {
      el.title = levelInfo.name + " 단계는 준비 중이에요";
      el.setAttribute("aria-disabled", "true");
    } else {
      el.setAttribute("aria-pressed", String(levelInfo.code === state.level));
    }
    container.appendChild(el);
    return el;
  }

  function renderLevels() {
    const band = $("stageBand");
    const row = $("builderLevels");
    band.replaceChildren();
    row.replaceChildren();
    GEN.LEVELS.forEach((info) => {
      // 띠에서 고르면 아래 "학습지 만들기"로 스크롤해 그 단계를 선택해 준다 —
      // 띠는 커리큘럼 안내이자 곧바로 쓰는 입구이기도 하다.
      const offered = levelOffered(info.code);
      const bandEl = stageBadge(info, band);
      if (offered) {
        bandEl.addEventListener("click", () => {
          setLevel(info.code);
          renderAll();
          $("builder").scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      const rowEl = stageBadge(info, row);
      if (offered) {
        rowEl.addEventListener("click", () => { setLevel(info.code); renderAll(); });
      }
    });
    const note = $("levelNote");
    note.textContent = state.levelNote;
    note.hidden = !state.levelNote;
    note.classList.toggle("is-warn", Boolean(state.levelNote));
  }

  function renderIntensity() {
    const row = $("intensityRow");
    row.replaceChildren();
    GEN.INTENSITY_MARKS.forEach((mark, index) => {
      const value = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "intensity-btn" + (value === state.intensity ? " is-active" : "");
      button.dataset.intensity = String(value);
      button.textContent = mark;
      button.setAttribute("aria-label", "강도 " + value);
      button.setAttribute("aria-pressed", String(value === state.intensity));
      button.addEventListener("click", () => {
        state.intensity = value;
        renderAll();
      });
      row.appendChild(button);
    });
  }

  // 유형 카드 한 장. 생성형이든 연습책이든 같은 격자·같은 부품을 쓰고, 연습책만
  // 배지 하나로 구분한다 — 학습지를 고르는 사람에게 둘은 "무엇을 연습할지"라는
  // 같은 질문의 답이지, 서로 다른 메뉴가 아니기 때문이다.
  function typeCard(opts) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "type-card" +
      (opts.book ? " is-book" : "") +
      (opts.ok ? "" : " is-unavailable") +
      (opts.ok && opts.active ? " is-active" : "");
    card.dataset.type = opts.code;
    if (opts.book) card.dataset.book = opts.code;
    card.disabled = !opts.ok;
    card.innerHTML = '<span class="type-head"><span class="type-code"></span></span>' +
      '<span class="type-label"></span><span class="type-levels"></span>';
    card.querySelector(".type-code").textContent = opts.code;
    card.querySelector(".type-label").textContent = opts.label;
    card.querySelector(".type-levels").textContent = opts.levels.map(levelName).join(" · ");
    if (opts.book) {
      const badge = document.createElement("span");
      badge.className = "type-badge";
      badge.textContent = "연습책";
      card.querySelector(".type-head").appendChild(badge);
    }
    if (!opts.ok) card.title = "이 단계에서는 제공되지 않아요";
    card.addEventListener("click", opts.onClick);
    return card;
  }

  function renderTypes() {
    const grid = $("typeGrid");
    grid.replaceChildren();
    GEN.TYPES.forEach((type) => {
      const ok = supportsLevel(type.code);
      grid.appendChild(typeCard({
        code: type.code,
        label: type.label,
        levels: type.levels,
        ok,
        active: !state.book && state.types.indexOf(type.code) !== -1,
        onClick() {
          // 연습책을 담고 있었다면 그것을 내려놓고 이 유형 하나로 새로 시작한다.
          // 이전 생성형 선택에 토글로 얹으면, 화면에 한 장도 켜져 있지 않던
          // 상태에서 카드를 눌렀는데 아무 일도 안 일어나 보이는 순간이 생긴다.
          if (state.book) {
            state.book = null;
            state.types = [type.code];
            renderAll();
            return;
          }
          const at = state.types.indexOf(type.code);
          // 유형을 0개로 만드는 해제는 무시한다 — 빈 학습지는 만들 수 없다.
          if (at === -1) state.types.push(type.code);
          else if (state.types.length > 1) state.types.splice(at, 1);
          renderAll();
        }
      }));
    });
    BOOKS.forEach((book) => {
      const ok = bookSupportsLevel(book, state.level);
      grid.appendChild(typeCard({
        code: book.code,
        label: book.label,
        levels: book.levels,
        book: true,
        ok,
        active: state.book === book.code,
        onClick() {
          // 이미 고른 연습책을 다시 누르면 생성형으로 돌아간다. 단, 생성형이
          // 없는 단계에서는 놓아 줄 곳이 없으므로 선택을 유지한다.
          if (state.book === book.code) {
            if (GEN.typesForLevel(state.level).length) state.book = null;
          } else {
            state.book = book.code;
          }
          renderAll();
        }
      }));
    });
    const note = $("typeNote");
    if (note) {
      note.textContent = state.book
        ? "연습책은 한 번에 한 권만 만들어요. 생성형 유형과 함께 담을 수는 없어요."
        : "선택한 단계에서 제공하지 않는 유형은 흐리게 표시돼요. 연습책 배지가 붙은 넷은 게임의 문제를 그대로 묶은 책이에요.";
      note.classList.toggle("is-warn", Boolean(state.book));
    }
  }

  function renderCounts() {
    const row = $("countRow");
    row.replaceChildren();
    const book = Boolean(state.book);
    const counts = book ? BOOK_COUNTS : COUNTS;
    const current = book ? state.bookCount : state.count;
    counts.forEach((count) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "count-btn" + (count === current ? " is-active" : "");
      button.dataset.count = String(count);
      button.textContent = count + (book ? "문제" : "문항");
      button.setAttribute("aria-pressed", String(count === current));
      button.addEventListener("click", () => {
        if (book) state.bookCount = count;
        else state.count = count;
        renderAll();
      });
      row.appendChild(button);
    });
  }

  // 강도는 생성기가 문제를 얼마나 깊게 물을지 정하는 축이라 연습책에는 해당이
  // 없다. 줄을 감추는 대신 흐리게 두어, 연습책을 내려놓으면 원래 고르던 강도가
  // 그대로 남아 있음을 보여 준다.
  function renderIntensityState() {
    const field = $("intensityField");
    if (!field) return;
    const book = Boolean(state.book);
    field.classList.toggle("is-muted", book);
    field.querySelectorAll(".intensity-btn").forEach((b) => { b.disabled = book; });
    const note = $("intensityNote");
    if (note) note.textContent = book
      ? "연습책은 게임이 고른 문제를 그대로 쓰므로 강도를 따로 고르지 않아요."
      : "●○○ 기초 · ●●○ 표준 · ●●● 심화";
  }

  // 만들기 버튼은 진짜 링크다 — 눌러서 가는 주소가 곧 이 화면의 선택이므로
  // 마우스 오른쪽 클릭으로 복사하거나 즐겨찾기에 넣어도 그대로 재현된다.
  function buildUrl() {
    if (state.book) {
      const book = bookInfo(state.book);
      const params = new URLSearchParams();
      params.set("game", book.game);
      // 레벨은 늘 전체 혼합 — 왜 그런지는 BOOKS 위의 설명 참조.
      params.set("level", "all");
      params.set("count", String(state.bookCount));
      params.set("cover", "1");
      return BOOK_URL + "?" + params.toString();
    }
    const params = new URLSearchParams();
    params.set("level", state.level);
    params.set("intensity", String(state.intensity));
    params.set("types", state.types.join("."));
    params.set("count", String(state.count));
    // types의 구분점(.)까지 인코딩되면 링크가 읽기 어려워지므로 되돌린다.
    // 물음표 뒤 경로가 아닌 값에서 '.'은 인코딩할 필요가 없는 문자다.
    return WORKSHEET_URL + "?" + params.toString().replace(/%2E/gi, ".");
  }

  function renderSummary() {
    const link = $("buildBtn");
    link.href = buildUrl();
    const head = document.createElement("b");
    let tail;
    if (state.book) {
      const book = bookInfo(state.book);
      head.textContent = levelName(state.level) + " · " + state.bookCount + "문제";
      tail = " · " + book.label + " 연습책";
    } else {
      const labels = state.types.map(typeLabel);
      tail = " · " + (labels.length <= 3
        ? labels.join(" · ")
        : labels.slice(0, 3).join(" · ") + " 외 " + (labels.length - 3) + "가지");
      head.textContent = levelName(state.level) + " " + GEN.intensityMark(state.intensity) + " · " + state.count + "문항";
    }
    $("buildSummary").replaceChildren(head, document.createTextNode(tail));
  }

  function renderAll() {
    renderLevels();
    renderIntensity();
    renderTypes();
    renderIntensityState();
    renderCounts();
    renderSummary();
  }

  // ---------------------------------------------------------------------
  // 학습지 코드로 다시 열기
  // ---------------------------------------------------------------------
  function openCode() {
    const raw = $("codeInput").value.trim();
    const note = $("codeNote");
    const parsed = raw ? GEN.parseCode(raw) : null;
    if (!parsed) {
      note.textContent = "코드 형식이 올바르지 않아요. 인쇄물 머리말의 코드를 그대로 적어 주세요. (예: #GW-TC.VC-9xl42kf3a)";
      note.hidden = false;
      note.classList.add("is-warn");
      $("codeInput").focus();
      return;
    }
    note.hidden = true;
    // '#'은 URL에서 조각 구분자라 반드시 인코딩해서 넘긴다 — 그대로 두면
    // 학습지 쪽 ?code= 가 빈 값으로 도착한다.
    window.location.href = WORKSHEET_URL + "?code=" + encodeURIComponent(raw);
  }

  function init() {
    setLevel(state.level);
    renderAll();
    $("codeBtn").addEventListener("click", openCode);
    $("codeInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") openCode();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
