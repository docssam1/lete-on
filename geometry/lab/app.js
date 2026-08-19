// GFIELD 지오메트리 랩 — 기하 학습지를 한 곳에서 고르고 만드는 문제은행.
//
// 이 파일에는 단계 목록도 쌓기나무 유형 목록도 들어 있지 않다. 둘 다 학습지
// 엔진(../worksheet/generators.js)이 유일한 원본이고, 이 페이지는 window.GW_GEN에
// 실린 LEVELS / TYPES를 그대로 읽어 그린다. 여기에 상수로 베껴 두면 엔진이
// 유형을 하나 늘리거나 어떤 단계를 열어 준 날 이 랜딩만 옛 목록을 보여 주고,
// "만들기" 버튼은 그 단계가 지원하지 않는 유형을 넘기게 된다.
//
// 미리보기도 같은 이유로 GW_CARD(../worksheet/card.js)를 부른다 — 학습지에
// 실제로 인쇄될 카드 마크업 그대로를 보여 주어야 "보고 고른 것"과 "받은 것"이
// 같아진다.
(function () {
  "use strict";

  const GEN = window.GW_GEN;
  const CARD = window.GW_CARD;
  const WORKSHEET_URL = "../worksheet/index.html";
  const BOOK_URL = "../cube-town/print.html";
  const FOLD_URL = "../worksheet/paper-fold/";

  // 문항 수 선택지는 학습지 생성기의 문항 수 select와 같은 값만 쓴다 — 거기
  // 없는 값을 넘기면 생성기가 무시하고 기본값으로 되돌아간다.
  const COUNTS = [6, 9, 12, 15, 20, 30, 50];
  // 고정 문제 학습지는 인쇄 엔진이 다르고 문제 수 선택지도 다르다(print.html의
  // select). 랩에서 9문항을 고르고 인쇄물이 10문제로 나오는 일이 없도록, 그쪽을
  // 고르면 문항 수 줄도 저쪽 선택지로 바꿔 보여 준다.
  const BOOK_COUNTS = [5, 10, 20];
  // 색종이 접기 학습지의 문항 수 선택지(paper-fold/index.html의 #count).
  const FOLD_COUNTS = [10, 20, 30, 40, 50];

  // ---------------------------------------------------------------------
  // 영역 — 랩이 다루는 두 갈래. 쌓기나무는 이 랩이 직접 문제를 만들고, 색종이
  // 접기는 자기 엔진을 가진 학습지 페이지로 넘긴다. 사람이 고르는 자리는
  // 하나여야 하므로, 만드는 쪽이 다르다는 사정은 카탈로그 뒤로 숨긴다.
  // ---------------------------------------------------------------------
  const DOMAIN_CUBE = "cube";
  const DOMAIN_FOLD = "fold";

  const DOMAINS = [
    { code: DOMAIN_CUBE, label: "쌓기나무", note: "입체를 보고 세고, 옮겨 그리고, 규칙을 찾는 유형." },
    { code: DOMAIN_FOLD, label: "색종이 접기", note: "접고 자르고 뚫은 다음, 펼친 모양을 머릿속으로 그려 보는 유형." }
  ];

  // 고정 문제 학습지 — 랩이 문제를 만들지 않고, 손으로 고른 문제 풀을 그대로
  // 인쇄 엔진(print.html)에 넘기는 유형이다. levels는 "이 학습지가 맞는 단계"고
  // 랩의 단계 배지가 그대로 읽는다.
  //
  // WHY 레벨은 항상 전체 혼합: 랩의 단계(L0..L8)와 문제 풀의 레벨(1..5)은 서로
  // 다른 축이라 1:1로 맞물리지 않는다. 억지로 매핑하면 "키즈 = 레벨 2" 같은
  // 근거 없는 규칙이 하나 더 생기므로, 랩은 그 풀 전체를 섞어 넘기고 레벨을
  // 좁히고 싶은 사람은 print.html의 레벨 select에서 고르게 한다.
  //
  // CB(똑같이 쌓기)만 games를 갖는 이유: 원목 관찰과 컬러 색칠은 같은 공부의
  // 두 표현이라 카드를 둘로 나누면 사람이 같은 것을 두 번 고르게 된다. 카드는
  // 하나로 두고, 난이도가 곧 표현 방식을 정한다 — 하 원목만 · 중 섞기 · 상 컬러.
  const BOOKS = [
    {
      code: "CB",
      label: "똑같이 쌓기",
      levels: ["L0", "L1"],
      games: { 1: "copy-wood", 2: "copy-mixed", 3: "copy-color" },
      gameNote: { 1: "원목 관찰만", 2: "원목 + 컬러 섞기", 3: "컬러 색칠만" }
    },
    { code: "CH", game: "count-heights", label: "쌓기나무 개수 세기", levels: ["L1", "L2"] },
    { code: "TV", game: "three-views", label: "여러 방향에서 본 모양", levels: ["L2", "L3"] }
  ];

  // 색종이 접기 유형 — ../worksheet/paper-fold/ 의 유형 select(#mode)와 같은
  // 값·같은 이름을 쓴다. 그 페이지가 ?mode= 로 받아 그대로 켜 주므로, 랩에서
  // 고른 유형이 저쪽 화면에서도 켜진 채로 열린다.
  //
  // 게임 연계 단계(game-l*, turn-l*)는 카탈로그에 올리지 않는다 — 게임의 문항을
  // 그대로 옮긴 것이라 "무엇을 연습할지"를 고르는 이 목록에서는 같은 공부가
  // 열 줄 넘게 늘어서 보일 뿐이다. 저쪽 페이지에 그대로 남아 있으니 필요하면
  // 거기서 고르면 된다.
  const FOLDS = [
    { code: "hole2", label: "구멍 개수 (반으로 접기)", levels: ["L2", "L3"] },
    { code: "hole3d", label: "구멍 개수 (대각선 접기)", levels: ["L3", "L4"] },
    { code: "pieces", label: "접고 자른 조각 개수", levels: ["L2", "L3", "L4"] },
    { code: "unfoldshape", label: "접어 자르고 펼친 모양 그리기", levels: ["L2", "L3", "L4"] },
    { code: "punch", label: "반원·원 펀치 모양별 개수", levels: ["L3", "L4"] },
    { code: "numsum", label: "남은 수들의 합", levels: ["L3", "L4"] },
    { code: "numcut", label: "잘려나간 수들의 합", levels: ["L3", "L4"] },
    { code: "numdiag", label: "대각선 한 번 접기 (실전)", levels: ["L4"] },
    { code: "numinv", label: "목표 합이 되게 색칠하기", levels: ["L4"] },
    { code: "foldtop", label: "여러 번 접기 — 가장 위의 수", levels: ["L3", "L4"] },
    { code: "stackfind", label: "겹친 색종이 — 가장 밑·위 찾기", levels: ["L2", "L3"] },
    { code: "stackorder", label: "겹친 색종이 — 위에서부터 순서대로", levels: ["L3", "L4"] }
  ];

  // 색종이 학습지의 난이도는 하/중/상 세 글자를 그대로 쓴다(저쪽 라디오 값).
  const FOLD_DIFFICULTY = { 1: "easy", 2: "mid", 3: "hard" };

  const state = {
    domain: DOMAIN_CUBE,
    level: GEN.DEFAULT_LEVEL,
    intensity: GEN.DEFAULT_INTENSITY,
    types: GEN.TYPES.filter((t) => t.defaultOn).map((t) => t.code),
    count: 9,
    // 고정 문제·색종이 학습지는 생성형 유형과 동시에 담을 수 없다 — 인쇄 엔진
    // 자체가 다르고, 한 권 안에 두 엔진의 페이지를 섞으면 문항 번호가 두 번
    // 1부터 시작한다.
    book: null,
    bookCount: 10,
    fold: null,
    foldCount: 20,
    levelNote: "",
    // 단계·영역을 바꿔서 골라 두었던 유형이 전부 이 조합에서 지원되지 않게
    // 잘려나가, 대신 첫 유형을 자동으로 골라 준 경우의 안내 한 줄. 유형 줄의
    // 기존 안내 자리(#typeNote)를 그대로 재활용해 보여 준다 — 새 안내
    // 영역을 만들면 화면에 "왜 바뀌었는지" 알리는 자리가 두 곳이 된다.
    typeAutoNote: "",
    // 미리보기는 학습지 쪽과 마찬가지로 자기 시드를 따로 쓴다 — "새 문제"를
    // 눌러도 아래의 선택은 그대로 있어야 한다.
    previewType: null,
    previewSeed: freshSeed(),
    previewAnswer: false
  };

  function freshSeed() {
    const t = Date.now() % 2147483647;
    const j = Math.floor((typeof performance !== "undefined" ? performance.now() : 0) * 1000) % 97;
    return (t + j) >>> 0 || 1;
  }

  function $(id) { return document.getElementById(id); }

  function supportsLevel(code) {
    return GEN.typeSupportsLevel(code, state.level);
  }

  function bookInfo(code) {
    return BOOKS.filter((b) => b.code === code)[0] || null;
  }

  function foldInfo(code) {
    return FOLDS.filter((f) => f.code === code)[0] || null;
  }

  // "전체"에서는 고정 문제 학습지를 계속 켜 둔다 — 어차피 그 풀의 전체 레벨을
  // 섞어 넘기므로(BOOKS 위 설명 참고), 학습지 쪽 단계가 "전체"로 바뀌었다고
  // 이것만 흐려질 이유가 없다. 색종이도 같은 규칙이다.
  function entrySupportsLevel(entry, level) {
    if (level === GEN.ALL_LEVEL) return true;
    return entry.levels.indexOf(level) !== -1;
  }

  function booksForLevel(level) {
    return BOOKS.filter((b) => entrySupportsLevel(b, level));
  }

  function foldsForLevel(level) {
    return FOLDS.filter((f) => entrySupportsLevel(f, level));
  }

  // 랩에서 "제공 중"인 단계는 생성형 학습지를 만들 수 있는 단계 ∪ 고정 문제
  // 학습지가 있는 단계 ∪ 색종이 유형이 있는 단계다. 킨더·키즈는 생성기가 아직
  // 문제를 만들지 못하지만 고정 문제 학습지가 있으므로 더 이상 준비 중이
  // 아니다 — generators.js의 LEVELS.available은 생성기 자신의 사정이라 그대로
  // 두고, 카탈로그를 합쳐 보는 판단은 입구인 여기서 한다.
  function levelOffered(code) {
    const info = GEN.levelInfo(code);
    return Boolean(
      (info && info.available) || booksForLevel(code).length || foldsForLevel(code).length
    );
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

  function levelRange(levels) {
    return levels.map(levelName).join(" · ");
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
    // "전체"를 고르면 생성형 유형을 전부 켠다 — 각 유형은 자기 자신이 지원하는
    // 단계에서 만들어지므로 전체에서 제외해야 할 유형이 없다.
    if (state.level === GEN.ALL_LEVEL) {
      state.types = GEN.TYPES.map((t) => t.code);
      return;
    }
    if (!GEN.typesForLevel(state.level).length) return;
    const kept = state.types.filter(supportsLevel);
    if (kept.length) { state.types = kept; return; }
    const fallback = GEN.TYPES.filter((t) => t.defaultOn && supportsLevel(t.code)).map((t) => t.code);
    state.types = fallback.length ? fallback : GEN.typesForLevel(state.level).slice(0, 1);
    state.typeAutoNote = "골라 둔 유형이 이 단계에서는 제공되지 않아 " + typeLabel(state.types[0]) + " 유형으로 자동으로 바꿨어요.";
  }

  // 준비 중 단계를 고르면 가장 가까운 제공 단계로 옮기고 왜 옮겼는지 남긴다
  // (학습지 생성기의 나이 선택과 같은 규칙).
  function setLevel(level) {
    state.typeAutoNote = "";
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

  // 단계를 옮긴 뒤 선택이 그 단계 밖으로 나가지 않게 맞추는다. 생성형이 없는
  // 단계에서는 다른 학습지가 반드시 하나 선택되어 있어야 "학습지 만들기"가
  // 빈 곳을 가리키지 않는다.
  function syncMode() {
    const books = booksForLevel(state.level);
    const folds = foldsForLevel(state.level);
    if (state.book && !books.some((b) => b.code === state.book)) state.book = null;
    if (state.fold && !folds.some((f) => f.code === state.fold)) state.fold = null;
    if (state.domain === DOMAIN_FOLD) {
      if (!state.fold && folds.length) {
        state.fold = folds[0].code;
        state.typeAutoNote = "골라 둔 유형이 이 단계에서는 제공되지 않아 " + foldInfo(state.fold).label + " 유형으로 자동으로 바꿨어요.";
      }
      return;
    }
    if (!state.book && !GEN.typesForLevel(state.level).length && books.length) {
      state.book = books[0].code;
      state.typeAutoNote = "골라 둔 유형이 이 단계에서는 제공되지 않아 " + bookInfo(state.book).label + " 유형으로 자동으로 바꿨어요.";
    }
  }

  function setDomain(domain) {
    state.typeAutoNote = "";
    state.domain = domain;
    if (domain === DOMAIN_FOLD) state.book = null;
    else state.fold = null;
    syncMode();
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
    const row = $("builderLevels");
    row.replaceChildren();
    // "전체" 배지는 커리큘럼 아홉 단계 목록(GEN.LEVELS)에 없다 — 그 아홉을
    // 섞으라는 지시일 뿐 학년 하나가 아니기 때문(generators.js ALL_LEVEL
    // 주석 참고). 그래서 줄 맨 앞에 따로 붙인다.
    //
    // WHY 배지가 한 곳뿐인가: 예전에는 페이지 맨 위에도 같은 아홉 단계 띠가
    // 따로 있었다. "학습지 만들기" 안의 것과 내용이 완전히 같아 위아래로 두 번
    // 고르는 것처럼 보였으므로, 위쪽 독립 섹션은 지우고 이 줄 하나만 남겼다
    // (안내 문구는 위 field-note.stage-static-note로 옮겨 붙였다, index.html
    // 참고).
    const allInfo = GEN.levelInfo(GEN.ALL_LEVEL);
    [allInfo].concat(GEN.LEVELS).forEach((info) => {
      const offered = levelOffered(info.code);
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

  // 버튼 표기는 "하/중/상"이 주고 점(●○○ 등)은 보조 — 내부 강도(intensity)
  // 값 1/2/3과 딥링크 파라미터는 그대로다.
  function renderIntensity() {
    const row = $("intensityRow");
    row.replaceChildren();
    GEN.INTENSITY_WORDS.forEach((word, index) => {
      const value = index + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "intensity-btn" + (value === state.intensity ? " is-active" : "");
      button.dataset.intensity = String(value);
      button.innerHTML = word + ' <span class="intensity-mark">' + GEN.INTENSITY_MARKS[index] + "</span>";
      button.setAttribute("aria-label", "난이도 " + word);
      button.setAttribute("aria-pressed", String(value === state.intensity));
      button.addEventListener("click", () => {
        state.intensity = value;
        state.previewSeed = freshSeed();
        renderAll();
      });
      row.appendChild(button);
    });
  }

  // 영역 탭 — 쌓기나무 / 색종이 접기. 두 카탈로그를 한 격자에 쏟아 놓으면
  // 스무 장 넘는 카드가 한 덩어리로 보여 무엇이 무엇의 이웃인지 읽히지 않는다.
  function renderDomains() {
    const row = $("domainRow");
    if (!row) return;
    row.replaceChildren();
    DOMAINS.forEach((domain) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "domain-btn" + (domain.code === state.domain ? " is-active" : "");
      button.dataset.domain = domain.code;
      button.textContent = domain.label;
      button.setAttribute("aria-pressed", String(domain.code === state.domain));
      button.addEventListener("click", () => {
        setDomain(domain.code);
        state.previewSeed = freshSeed();
        renderAll();
      });
      row.appendChild(button);
    });
    const note = $("domainNote");
    const current = DOMAINS.filter((d) => d.code === state.domain)[0];
    if (note && current) note.textContent = current.note;
  }

  // 유형 카드 한 장. 어느 영역이든 같은 격자·같은 부품을 쓴다 — 학습지를 고르는
  // 사람에게 이 카드들은 모두 "무엇을 연습할지"라는 하나의 질문에 대한 답이지,
  // 서로 다른 메뉴가 아니기 때문이다.
  function typeCard(opts) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "type-card" +
      (opts.ok ? "" : " is-unavailable") +
      (opts.ok && opts.active ? " is-active" : "");
    card.dataset.type = opts.code;
    if (opts.book) card.dataset.book = opts.code;
    if (opts.fold) card.dataset.fold = opts.code;
    card.disabled = !opts.ok;
    card.innerHTML = '<span class="type-head"><span class="type-code"></span></span>' +
      '<span class="type-label"></span><span class="type-levels"></span>';
    card.querySelector(".type-code").textContent = opts.code;
    card.querySelector(".type-label").textContent = opts.label;
    card.querySelector(".type-levels").textContent = levelRange(opts.levels);
    if (!opts.ok) card.title = "이 단계에서는 제공되지 않아요";
    card.addEventListener("click", opts.onClick);
    return card;
  }

  function renderCubeTypes(grid) {
    GEN.TYPES.forEach((type) => {
      const ok = supportsLevel(type.code);
      grid.appendChild(typeCard({
        code: type.code,
        label: type.label,
        levels: type.levels,
        ok,
        active: !state.book && state.types.indexOf(type.code) !== -1,
        onClick() {
          // 고정 문제 학습지를 담고 있었다면 그것을 내려놓고 이 유형 하나로
          // 새로 시작한다. 이전 생성형 선택에 토글로 얹으면, 화면에 한 장도
          // 켜져 있지 않던 상태에서 카드를 눌렀는데 아무 일도 안 일어나
          // 보이는 순간이 생긴다.
          if (state.book) {
            state.book = null;
            state.types = [type.code];
          } else {
            const at = state.types.indexOf(type.code);
            // 유형을 0개로 만드는 해제는 무시한다 — 빈 학습지는 만들 수 없다.
            if (at === -1) state.types.push(type.code);
            else if (state.types.length > 1) state.types.splice(at, 1);
          }
          state.previewType = type.code;
          state.previewSeed = freshSeed();
          renderAll();
        }
      }));
    });
    BOOKS.forEach((book) => {
      const ok = entrySupportsLevel(book, state.level);
      grid.appendChild(typeCard({
        code: book.code,
        label: book.label,
        levels: book.levels,
        book: true,
        ok,
        active: state.book === book.code,
        onClick() {
          // 이미 고른 것을 다시 누르면 생성형으로 돌아간다. 단, 생성형이 없는
          // 단계에서는 놓아 줄 곳이 없으므로 선택을 유지한다.
          if (state.book === book.code) {
            if (GEN.typesForLevel(state.level).length) state.book = null;
          } else {
            state.book = book.code;
          }
          renderAll();
        }
      }));
    });
  }

  function renderFoldTypes(grid) {
    FOLDS.forEach((fold) => {
      const ok = entrySupportsLevel(fold, state.level);
      grid.appendChild(typeCard({
        code: fold.code,
        label: fold.label,
        levels: fold.levels,
        fold: true,
        ok,
        active: state.fold === fold.code,
        onClick() {
          state.fold = fold.code;
          renderAll();
        }
      }));
    });
  }

  function renderTypes() {
    const grid = $("typeGrid");
    grid.replaceChildren();
    if (state.domain === DOMAIN_FOLD) renderFoldTypes(grid);
    else renderCubeTypes(grid);
    const note = $("typeNote");
    if (note) {
      if (state.typeAutoNote) {
        // 단계·영역을 바꿔 골라 둔 유형이 전부 잘려나간 경우의 안내가, 이 줄의
        // 다른 안내보다 우선한다 — 방금 화면이 왜 바뀌었는지가 지금 가장 궁금한
        // 정보이기 때문이다.
        note.textContent = state.typeAutoNote;
      } else if (state.domain === DOMAIN_FOLD) {
        note.textContent = "색종이 학습지는 한 번에 한 유형씩 만들어요. 만들기를 누르면 색종이 접기 학습지 화면이 그 유형으로 열려요.";
      } else if (state.book) {
        note.textContent = "이 학습지는 손으로 고른 문제 풀을 그대로 쓰므로 한 번에 하나만 만들어요.";
      } else {
        note.textContent = "선택한 단계에서 제공하지 않는 유형은 흐리게 표시돼요. 여러 장을 함께 고르면 한 학습지에 섞여 나와요.";
      }
      note.classList.toggle("is-warn", Boolean(state.typeAutoNote) || (Boolean(state.book) && state.domain === DOMAIN_CUBE));
    }
  }

  function currentCounts() {
    if (state.domain === DOMAIN_FOLD) return FOLD_COUNTS;
    return state.book ? BOOK_COUNTS : COUNTS;
  }

  function currentCount() {
    if (state.domain === DOMAIN_FOLD) return state.foldCount;
    return state.book ? state.bookCount : state.count;
  }

  function setCount(value) {
    if (state.domain === DOMAIN_FOLD) state.foldCount = value;
    else if (state.book) state.bookCount = value;
    else state.count = value;
  }

  function renderCounts() {
    const row = $("countRow");
    row.replaceChildren();
    const counts = currentCounts();
    const current = currentCount();
    const word = state.domain === DOMAIN_CUBE && state.book ? "문제" : "문항";
    counts.forEach((count) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "count-btn" + (count === current ? " is-active" : "");
      button.dataset.count = String(count);
      button.textContent = count + word;
      button.setAttribute("aria-pressed", String(count === current));
      button.addEventListener("click", () => {
        setCount(count);
        renderAll();
      });
      row.appendChild(button);
    });
  }

  // 난이도는 어느 학습지에나 뜻이 있다 — 생성형은 묻는 깊이가, 똑같이 쌓기는
  // 원목/컬러 표현이, 색종이는 저쪽 하/중/상 라디오가 달라진다. 그래서 줄을
  // 감추는 건 개수 세기·여러 방향처럼 정말 해당이 없는 경우뿐이고, 그때도
  // 흐리게만 두어 되돌리면 고르던 난이도가 그대로 남아 있음을 보여 준다.
  function intensityApplies() {
    if (state.domain === DOMAIN_FOLD) return true;
    if (!state.book) return true;
    const book = bookInfo(state.book);
    return Boolean(book && book.games);
  }

  function renderIntensityState() {
    const field = $("intensityField");
    if (!field) return;
    const applies = intensityApplies();
    field.classList.toggle("is-muted", !applies);
    field.querySelectorAll(".intensity-btn").forEach((b) => { b.disabled = !applies; });
    const note = $("intensityNote");
    if (!note) return;
    if (!applies) {
      note.textContent = "이 학습지는 정해진 문제를 그대로 쓰므로 난이도를 따로 고르지 않아요.";
      return;
    }
    const book = state.domain === DOMAIN_CUBE && state.book ? bookInfo(state.book) : null;
    if (book && book.gameNote) {
      note.textContent = "하 " + book.gameNote[1] + " · 중 " + book.gameNote[2] + " · 상 " + book.gameNote[3];
      return;
    }
    note.textContent = "하 기초 · 중 표준 · 상 심화";
  }

  // ---------------------------------------------------------------------
  // 미리보기 — 고른 유형의 문제 한 개를, 학습지에 실릴 카드 그대로.
  //
  // 시드를 학습지와 따로 두는 이유: "새 문제"는 이 한 장만 다시 뽑는 버튼이지
  // 아래 선택을 흔드는 버튼이 아니다.
  // ---------------------------------------------------------------------
  function previewableTypes() {
    return state.types.filter((code) => supportsLevel(code));
  }

  function ensurePreviewType() {
    const list = previewableTypes();
    if (!list.length) { state.previewType = null; return; }
    if (!state.previewType || list.indexOf(state.previewType) === -1) state.previewType = list[0];
  }

  function previewMessage(text) {
    $("previewBody").innerHTML = '<p class="preview-empty">' + CARD.escapeHtml(text) + "</p>";
    window.__LABPREVIEW = null;
  }

  function renderPreview() {
    const panel = $("previewPanel");
    const body = $("previewBody");
    if (!panel || !body) return;
    const head = $("previewType");

    // 생성형이 아닌 학습지는 미리보기가 없다 — 랩이 문제를 만들지 않고 정해진
    // 문제 풀을 그대로 넘기므로, 여기서 보여 줄 "생성 결과"라는 것이 없다.
    if (state.domain === DOMAIN_FOLD) {
      const fold = state.fold ? foldInfo(state.fold) : null;
      if (head) head.textContent = fold ? fold.label : "";
      previewMessage("색종이 접기 학습지는 만들기를 누르면 열리는 화면에서 유형 미리보기를 볼 수 있어요.");
      panel.classList.add("is-static");
      return;
    }
    if (state.book) {
      const book = bookInfo(state.book);
      if (head) head.textContent = book ? book.label : "";
      previewMessage("이 학습지는 손으로 고른 문제 풀에서 그대로 뽑아 나와요. 문제를 새로 만들지 않으니 미리보기는 인쇄 화면에서 확인하세요.");
      panel.classList.add("is-static");
      return;
    }

    panel.classList.remove("is-static");
    ensurePreviewType();
    if (head) head.textContent = state.previewType ? typeLabel(state.previewType) : "";
    if (!state.previewType) {
      previewMessage("이 단계에서 만들 수 있는 유형을 하나 이상 고르세요.");
      return;
    }
    // 학습지 생성기와 같은 rng 요리법 — 미리보기가 실제 출제와 다른 분포로
    // 뽑히면 보여 준 의미가 없다.
    const rng = GEN.createRng("GWP:" + state.previewSeed + ":" + state.level + ":" + state.intensity + ":" + state.previewType);
    let problem = null;
    try {
      problem = GEN.make(state.previewType, rng, state.level, state.intensity);
    } catch (error) {
      previewMessage("이 유형은 지금 단계에서 만들 수 없어요.");
      return;
    }
    const mixed = state.level === GEN.ALL_LEVEL;
    body.innerHTML =
      '<div class="preview-sheet">' + CARD.renderCard(problem, 0, mixed) + "</div>" +
      (state.previewAnswer
        ? '<div class="preview-answer"><b>정답</b><ol class="ws-answer-list preview-answer-list">' +
          CARD.renderAnswerItem(problem, 0, mixed) + "</ol></div>"
        : "");
    const toggle = $("previewAnswerBtn");
    if (toggle) {
      toggle.textContent = state.previewAnswer ? "정답 숨기기" : "정답 보기";
      toggle.setAttribute("aria-pressed", String(state.previewAnswer));
    }
    window.__LABPREVIEW = { type: state.previewType, seed: state.previewSeed, problem };
  }

  // 미리보기 유형 칩 — 여러 유형을 골랐을 때 어느 유형을 볼지 고른다.
  function renderPreviewTabs() {
    const tabs = $("previewTabs");
    if (!tabs) return;
    tabs.replaceChildren();
    if (state.domain === DOMAIN_FOLD || state.book) return;
    const list = previewableTypes();
    if (list.length < 2) return;
    list.forEach((code) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "preview-chip" + (code === state.previewType ? " is-active" : "");
      chip.dataset.type = code;
      chip.textContent = typeLabel(code);
      chip.addEventListener("click", (event) => {
        state.previewType = code;
        state.previewSeed = freshSeed();
        renderPreview();
        renderPreviewTabs();
      });
      tabs.appendChild(chip);
    });
  }

  // ---------------------------------------------------------------------
  // 만들기 버튼은 진짜 링크다 — 눌러서 가는 주소가 곧 이 화면의 선택이므로
  // 마우스 오른쪽 클릭으로 복사하거나 즐겨찾기에 넣어도 그대로 재현된다.
  // ---------------------------------------------------------------------
  function buildUrl() {
    if (state.domain === DOMAIN_FOLD) {
      const params = new URLSearchParams();
      if (state.fold) params.set("mode", state.fold);
      params.set("difficulty", FOLD_DIFFICULTY[state.intensity] || "mid");
      params.set("count", String(state.foldCount));
      return FOLD_URL + "?" + params.toString();
    }
    if (state.book) {
      const book = bookInfo(state.book);
      const params = new URLSearchParams();
      // 난이도가 표현 방식을 정하는 카드(똑같이 쌓기)는 강도에 따라 다른 모드로
      // 딥링크한다 — BOOKS의 games 설명 참고.
      params.set("game", book.games ? (book.games[state.intensity] || book.games[2]) : book.game);
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
    if (state.domain === DOMAIN_FOLD) {
      const fold = state.fold ? foldInfo(state.fold) : null;
      head.textContent = "색종이 접기 · 난이도 " + GEN.intensityWord(state.intensity) + " · " + state.foldCount + "문항";
      tail = fold ? " · " + fold.label : "";
    } else if (state.book) {
      const book = bookInfo(state.book);
      head.textContent = levelName(state.level) + " · " + state.bookCount + "문제";
      tail = " · " + book.label +
        (book.gameNote ? " (" + book.gameNote[state.intensity] + ")" : "");
    } else {
      const labels = state.types.map(typeLabel);
      tail = " · " + (labels.length <= 3
        ? labels.join(" · ")
        : labels.slice(0, 3).join(" · ") + " 외 " + (labels.length - 3) + "가지");
      head.textContent = levelName(state.level) + " · 난이도 " + GEN.intensityWord(state.intensity) + " · " + state.count + "문항";
    }
    $("buildSummary").replaceChildren(head, document.createTextNode(tail));
  }

  function renderAll() {
    renderLevels();
    renderIntensity();
    renderDomains();
    renderTypes();
    renderIntensityState();
    renderCounts();
    // 미리보기가 먼저다 — ensurePreviewType이 여기서 유효한 유형을 정하고,
    // 칩 줄은 그 결과를 읽어 어느 칩을 켤지 정한다. 순서를 바꾸면 유형을
    // 바꾼 직후 한 번은 어느 칩도 켜지지 않은 화면이 나온다.
    renderPreview();
    renderPreviewTabs();
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
    $("previewNewBtn").addEventListener("click", () => {
      state.previewSeed = freshSeed();
      renderPreview();
    });
    $("previewAnswerBtn").addEventListener("click", () => {
      state.previewAnswer = !state.previewAnswer;
      renderPreview();
    });
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
