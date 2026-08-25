(function () {
  "use strict";
  const current = new URL(location.href);
  const target = new URL("./exam-editor.html", current);
  const draftId = String(current.searchParams.get("draftId") || "").trim();
  if (/^draft_[A-Za-z0-9]+$/.test(draftId)) target.searchParams.set("draftId", draftId);
  location.replace(target.href);
})();
