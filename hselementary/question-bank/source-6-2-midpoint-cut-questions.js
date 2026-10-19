(() => {
  "use strict";
  const api = window.HSE_GENERATORS;
  const models = window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_MODELS;
  const presentation = window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION;
  const assets = window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_ASSETS;
  if (!api || !models || !Array.isArray(models.pool) || models.pool.length !== 3 ||
    !presentation || typeof presentation.renderBank !== "function" || !assets || typeof assets.image !== "function" ||
    typeof api.generatorKey !== "function" || typeof api.generate !== "function" || !Array.isArray(api.names)) {
    throw new Error("Midpoint-cut models, bank presentation, static assets and generators must load first");
  }
  const id = "6-2-u3-e4-example-1", key = "sourceGrade6SecondSpaceE4MidpointCut";
  const keys = Object.freeze({ [id]: key }), pool = Object.freeze([...models.pool]);
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
    if ((rank !== undefined && !Number.isFinite(rank)) || ![-1, 0, 1].includes(offset) ||
      !Number.isSafeInteger(variant) || variant < 0) throw new RangeError("Unsupported midpoint-cut rank, difficulty or variant");
    const index = variant % pool.length, level = offset + 1, q = presentation.renderBank(id, index, level);
    if (!q || q.sourceItemId !== id || q.variant !== index || q.level !== level || q.model?.n !== pool[index] ||
      q.requestedAnswerUnique !== true || q.sourceConditionsClarified !== true || q.requiresOriginalReview !== true ||
      q.originalSourceReleaseStatus !== "locked" || q.sourceExact !== false || q.publisherAnswerVerified !== false ||
      q.humanApproved !== false || q.learnerReleaseVerified !== false || q.empiricallyCalibrated !== false ||
      q.requiresLayerDrawing !== false || !Array.isArray(q.responseLayers) || q.responseLayers.length !== 0 ||
      typeof q.structuralFingerprint !== "string" || !q.structuralFingerprint.trim()) return null;
    const context = (html, role) => `<div data-midpoint-cut-context="${role}" data-source-item-id="${id}" data-variant="${index}" data-level="${level}">${html}</div>`;
    return { ...q, prompt: context(q.prompt, "problem"), answerVisual: context(q.answerVisual, "teacher"),
      generator: key, levelRank: rank, generationMode: "fixed-verified-pool",
      verifiedVariantCount: pool.length, verifiedVariantTarget: pool.length, verifiedPoolIndex: index,
      verifiedVariantId: `${id}:v${index}`, difficultyLevel: level, difficultyRank: level, difficultyOffset: offset,
      sourceDifficultyRank: 1, answerPageLayout: "two-column", registrationOnly: true, officialAnswerVerified: false,
      variantProvenance: index === 0 && level === 1 ? "source-conditions-clarified" : "source-conditions-clarified-variant",
      sourceConditionProvenance: "explicit-learner-given-conditions" };
  };
  if (!api.names.includes(key)) api.names.push(key);
  window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_QUESTIONS = Object.freeze({ keys, pool, registrationOnly: true, learnerReleaseVerified: false });

  function zoomAsset(button) {
    const context = button.closest("[data-midpoint-cut-context]"), data = context?.dataset;
    if (!data) throw new RangeError("Missing midpoint zoom context");
    const source = data.sourceItemId;
    if (source !== id || !/^[0-2]$/.test(data.variant || "") || !/^[0-2]$/.test(data.level || "")) throw new RangeError("Invalid midpoint zoom source or difficulty");
    const variant = Number(data.variant), level = Number(data.level), role = data.midpointCutContext;
    const host = button.closest(".source62-midpoint-given,.source62-midpoint-answer");
    if (!host || host.matches(".source62-midpoint-given") === host.matches(".source62-midpoint-answer")) throw new RangeError("Invalid midpoint zoom host");
    if (role !== (host.matches(".source62-midpoint-given") ? "problem" : "teacher")) throw new RangeError("Invalid midpoint zoom phase context");
    const expectedPhase = role === "problem" ? "given" : level === 0 ? "cut-top" : "cut-all";
    const file = `n${pool[variant]}-${expectedPhase}.png`;
    if (button.dataset.midpointCutFile !== file || (button.dataset.phase !== undefined && button.dataset.phase !== expectedPhase) ||
      (button.dataset.sourceItemId !== undefined && button.dataset.sourceItemId !== source) ||
      (button.dataset.variant !== undefined && button.dataset.variant !== data.variant) ||
      (button.dataset.level !== undefined && button.dataset.level !== data.level)) throw new RangeError("Invalid midpoint zoom phase or variant");
    const asset = assets.image(file), dims = asset?.dims || asset?.dimensions;
    if (!asset || asset.file !== file || asset.kind !== expectedPhase || !Array.isArray(dims) || dims.length !== 3 ||
      !dims.every(n => n === pool[variant]) || !Number.isSafeInteger(asset.width) || asset.width <= 0 ||
      !Number.isSafeInteger(asset.height) || asset.height <= 0 || !Number.isFinite(asset.glyphSize) || asset.glyphSize <= 0) {
      throw new RangeError("Invalid midpoint zoom asset metadata");
    }
    return { asset, revisionKey: `${source}:${variant}:${level}:${expectedPhase}:${file}` };
  }
  if (typeof document !== "undefined" && !window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_ZOOM_BOUND) {
    window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_ZOOM_BOUND = true;
    let dialog, viewport, opener, revision = 0;
    const dismiss = () => { if (dialog) { dialog.setAttribute("aria-busy", "false"); if (dialog.open) dialog.close(); } };
    document.addEventListener("click", async event => {
      const button = event.target?.closest?.(".source62-midpoint-cut-zoom");
      if (!button) return;
      event.preventDefault();
      const current = ++revision;
      let request;
      try { request = zoomAsset(button); } catch { dismiss(); return; }
      if (!dialog) {
        dialog = document.createElement("dialog"); dialog.className = "source62-midpoint-cut-figure-dialog";
        dialog.setAttribute("aria-label", "\uADF8\uB9BC \uD655\uB300");
        const close = document.createElement("button"); close.type = "button"; close.className = "source62-midpoint-cut-figure-close";
        close.textContent = "\u00d7"; close.title = "\uB2EB\uAE30"; close.setAttribute("aria-label", close.title);
        close.addEventListener("click", () => dialog.close());
        viewport = document.createElement("div"); viewport.className = "source62-midpoint-cut-figure-viewport"; viewport.tabIndex = 0;
        dialog.append(close, viewport); document.body.append(dialog);
        dialog.addEventListener("cancel", () => { revision++; });
        dialog.addEventListener("close", () => { revision++; dialog.setAttribute("aria-busy", "false"); if (opener?.isConnected) opener.focus(); });
        dialog.addEventListener("keydown", e => e.stopPropagation());
      }
      const image = document.createElement("img"), asset = request.asset;
      image.width = asset.width; image.height = asset.height;
      image.alt = button.querySelector("img")?.alt || "\uD655\uB300\uD55C \uC313\uAE30\uB098\uBB34 \uADF8\uB9BC";
      image.src = `./assets/source-6-2-midpoint-cut/${asset.file}`; dialog.setAttribute("aria-busy", "true");
      try {
        await image.decode();
        if (current !== revision) return;
        if (!button.isConnected || !dialog.isConnected || zoomAsset(button).revisionKey !== request.revisionKey ||
          image.naturalWidth !== asset.width || image.naturalHeight !== asset.height) { dismiss(); return; }
        viewport.replaceChildren(image); opener = button; dialog.setAttribute("aria-busy", "false");
        if (!dialog.open) dialog.showModal(); dialog.querySelector("button").focus();
      } catch { if (current === revision) dismiss(); }
    });
  }
})();
