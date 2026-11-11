// 화면 보호(원장 2026-11-11 「오른쪽 마우스나 코드 보안잠금도」): 오른쪽 마우스 메뉴 · 개발자 도구 · 소스 보기 · 페이지 저장 단축키 ·
// 그림 끌어 가져가기를 막는다. 모든 화면의 <head>에 일반 스크립트로 넣는다(모듈보다 먼저 돈다, 덱 안에 들어간 학습지·워밍업 창에도).
// 그대로 두는 것: 글 입력 칸의 오른쪽 마우스(붙여넣기), 인쇄(Ctrl·⌘+P — 교재·학습지 인쇄), 글 선택·복사.
// 주의: 브라우저 메뉴로 여는 개발자 도구나 주소 앞에 view-source:를 붙이는 것까지 막을 수는 없다 — 겁을 주는 잠금이다.
// 진짜 지켜야 할 것(정답·승인번호·회원 정보)은 화면 파일에 두지 않고 서버(로그인 확인)에만 둔다.
(() => {
  const editable = (target) => target instanceof Element && Boolean(target.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']"));
  document.addEventListener("contextmenu", (event) => { if (!editable(event.target)) event.preventDefault(); }, true);
  document.addEventListener("dragstart", (event) => { if (event.target instanceof HTMLImageElement || event.target?.closest?.("svg")) event.preventDefault(); }, true);
  document.addEventListener("keydown", (event) => {
    const key = String(event.key || "").toLowerCase(), code = event.code || "";
    const mod = event.ctrlKey || event.metaKey;
    const blocked = key === "f12"
      || (mod && event.shiftKey && ["i", "j", "c", "k"].includes(key))   // 개발자 도구(Chrome·Edge·Firefox)
      || (event.metaKey && event.altKey && ["KeyI", "KeyJ", "KeyC", "KeyU"].includes(code))   // 맥: ⌘⌥I·J·C·U
      || (mod && !event.shiftKey && !event.altKey && (key === "u" || key === "s"));   // 소스 보기 · 페이지 저장
    if (blocked) { event.preventDefault(); event.stopPropagation(); }
  }, true);
})();
