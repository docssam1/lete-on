(() => {
  "use strict";
  const api = window.HSE_GENERATORS;
  const presentation = window.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION;
  const assets = window.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS;
  if (!api || !presentation || typeof presentation.renderBank !== "function" || !assets || typeof assets.image !== "function" ||
    typeof api.generatorKey !== "function" || typeof api.generate !== "function" || !Array.isArray(api.names)) {
    throw new Error("Plane-cut bank presentation, static assets and generators must load first");
  }
  const id = "6-2-u3-e4-exploration", key = "sourceGrade6SecondSpaceE4PrismCut";
  const keys = Object.freeze({ [id]: key });
  const previousKey = api.generatorKey, previousGenerate = api.generate;
  const owned = type => type?.sourceItemId === id || type?.generatorKey === key;
  const matches = type => type !== null && typeof type === "object" && !Array.isArray(type) &&
    Object.hasOwn(type, "sourceItemId") && Object.hasOwn(type, "generatorKey") && type.sourceItemId === id && type.generatorKey === key;
  api.generatorKey = function(type) {
    return matches(type) ? type.reviewLocked ? "" : key : owned(type) ? "" : previousKey.apply(this, arguments);
  };
  api.generate = function(type, rank, offset, seed, variant) {
    if (!matches(type)) return owned(type) ? null : previousGenerate.apply(this, arguments);
    if (type.reviewLocked) return null;
    if (offset === undefined) offset = 0;
    if (variant === undefined) variant = 0;
    if (![-1, 0, 1].includes(offset) || !Number.isSafeInteger(variant) || variant < 0) {
      throw new RangeError("Unsupported plane-cut difficulty or variant");
    }
    const pool = variant % 3, level = offset + 1, q = presentation.renderBank(id, pool, level);
    if (!q || q.sourceItemId !== id || q.variant !== pool || q.level !== level || q.requestedAnswerUnique !== true ||
      q.sourceConditionsClarified !== true || q.sourceReferencePanelRequired !== true || q.sourceReferencePanelImplemented !== true ||
      q.originalSourceReleaseStatus !== "locked" || q.sourceExact !== false || q.publisherAnswerVerified !== false ||
      q.learnerReleaseVerified !== false || q.humanApproved !== false || typeof q.structuralFingerprint !== "string" || !q.structuralFingerprint.trim()) return null;
    return { ...q, generator: key, levelRank: rank, generationMode: "fixed-verified-pool",
      verifiedVariantCount: 3, verifiedVariantTarget: 3, verifiedPoolIndex: pool, verifiedVariantId: `${id}:v${pool}`,
      difficultyLevel: level, difficultyRank: level, difficultyOffset: offset, sourceDifficultyRank: 1,
      answerPageLayout: "two-column", variantProvenance: pool === 0 && level === 1 ? "source-conditions-clarified" : "source-conditions-clarified-variant",
      sourceConditionProvenance: "explicit-learner-given-conditions", registrationOnly: true, officialAnswerVerified: false };
  };
  if (!api.names.includes(key)) api.names.push(key);
  window.HSE_SOURCE_GRADE6_PLANE_CUT_QUESTIONS = Object.freeze({ keys, registrationOnly: true, learnerReleaseVerified: false });
  if (typeof document !== "undefined" && !window.HSE_SOURCE_GRADE6_PLANE_CUT_ZOOM_BOUND) {
    window.HSE_SOURCE_GRADE6_PLANE_CUT_ZOOM_BOUND = true;
    let dialog, viewport, opener, revision = 0;
    document.addEventListener("click", async event => {
      const button = event.target?.closest?.(".source62-cut-zoom");
      if (!button) return;
      event.preventDefault();
      const current = ++revision, file = button.dataset.cutFile;
      let asset;
      try { asset = assets.image(file); if (asset.file !== file) return; } catch { if (dialog) { dialog.setAttribute("aria-busy", "false"); if (dialog.open) dialog.close(); } return; }
      if (!dialog) {
        dialog = document.createElement("dialog"); dialog.className = "source62-m3-figure-dialog source62-cut-figure-dialog";
        dialog.setAttribute("aria-label", "\uADF8\uB9BC \uD655\uB300");
        const close = document.createElement("button"); close.type = "button"; close.className = "source62-m3-figure-close";
        close.textContent = "\u00d7"; close.title = "\uB2EB\uAE30"; close.setAttribute("aria-label", close.title);
        close.addEventListener("click", () => dialog.close());
        viewport = document.createElement("div"); viewport.className = "source62-m3-figure-viewport"; viewport.tabIndex = 0;
        dialog.append(close, viewport); document.body.append(dialog);
        dialog.addEventListener("cancel", () => { revision++; });
        dialog.addEventListener("close", () => { revision++; dialog.setAttribute("aria-busy", "false"); if (opener?.isConnected) opener.focus(); });
        dialog.addEventListener("keydown", e => e.stopPropagation());
      }
      const image = document.createElement("img"); image.width = asset.width; image.height = asset.height;
      image.alt = button.querySelector("img")?.alt || "\uD655\uB300\uD55C \uC313\uAE30\uB098\uBB34 \uADF8\uB9BC";
      image.src = `./assets/source-6-2-plane-cut/${asset.file}`; dialog.setAttribute("aria-busy", "true");
      try {
        await image.decode();
        if (current !== revision) return;
        if (!button.isConnected || !dialog.isConnected) { dialog.setAttribute("aria-busy", "false"); if (dialog.open) dialog.close(); return; }
        viewport.replaceChildren(image); opener = button; dialog.setAttribute("aria-busy", "false");
        if (!dialog.open) dialog.showModal(); dialog.querySelector("button").focus();
      } catch { if (current === revision) { dialog.setAttribute("aria-busy", "false"); if (dialog.open) dialog.close(); } }
    });
  }
})();
