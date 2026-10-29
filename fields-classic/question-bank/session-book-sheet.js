// 한 차시 교재(golden-bell.html?sessionbook=1)의 뒤쪽 — 문제은행 학습지(본책 · 오늘의 과제 · 데일리 테스트/단원 평가)를
// 같은 주소(index.html?…&as=student)로 숨은 창에서 만들어, 그 쪽들과 스타일을 워밍업 인쇄 묶음 뒤에 그대로 옮겨 붙인다.
// 문제를 새로 그리지 않는다 — 학생이 「인쇄해서 풀기」로 받는 학습지와 똑같은 카드다.

const READY_TIMEOUT = 30000;

function waitFor(test, timeout = READY_TIMEOUT) {
  return new Promise((resolve, reject) => {
    const start = performance.now();
    (function poll() {
      const value = test();
      if (value) return resolve(value);
      if (performance.now() - start > timeout) return reject(new Error("sheet_timeout"));
      setTimeout(poll, 120);
    })();
  });
}

// 학습지 주소 → <section class="session-sheet …">(문제 쪽들). 필요한 스타일시트는 이 문서 <head>에 더한다.
export async function importQuestionSheet(url) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.tabIndex = -1;
  frame.style.cssText = "position:fixed;left:-10000px;top:0;width:1280px;height:900px;border:0;visibility:hidden";
  frame.src = url;
  document.body.append(frame);
  try {
    const doc = await waitFor(() => frame.contentDocument?.querySelector("#questionGrid .question-page") && frame.contentDocument);
    await frame.contentWindow.document.fonts?.ready;
    await Promise.all([...doc.querySelectorAll("#worksheetSection img")].map((image) => image.decode?.().catch(() => null)));
    // 스타일: 문제은행 학습지가 쓰는 것 중 이 문서에 없는 것만(주소 꼬리표까지 같으면 이미 있는 것)
    const have = new Set([...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => new URL(link.href, location.href).href));
    const loads = [];
    for (const link of doc.querySelectorAll('link[rel="stylesheet"]')) {
      const href = new URL(link.getAttribute("href"), frame.contentWindow.location.href).href;
      if (have.has(href)) continue;
      const own = document.createElement("link");
      own.rel = "stylesheet"; own.href = href; own.dataset.sessionSheet = "1";
      loads.push(new Promise((resolve) => { own.onload = own.onerror = resolve; }));
      document.head.append(own);
    }
    await Promise.all(loads);
    const sheet = doc.querySelector("#worksheetSection");
    const wrap = document.createElement("section");
    // 학습지 화면의 몸 class(as-student · week-book …)를 감싸개에 옮겨 같은 규칙이 걸리게 한다
    wrap.className = ["session-sheet", ...doc.body.classList].join(" ");
    wrap.innerHTML = sheet.outerHTML;   // 워밍업 화면(golden-bell.html)과 겹치는 id는 없다(2026-10-29 확인)
    return wrap;
  } finally {
    frame.remove();
  }
}
