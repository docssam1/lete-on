(() => {
  "use strict";
  const api = window.HSE_GENERATORS;
  const models = window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_MODELS;
  const contracts = window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_CONTRACTS;
  const presentation = window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_PRESENTATION;
  const assets = window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_ASSETS;
  if (!api || !models || !Array.isArray(models.pool) || models.pool.length !== 3 ||
    !models.pool.every((n, index) => n === [4, 3, 5][index]) || !contracts || typeof contracts.generate !== "function" ||
    !presentation || typeof presentation.renderBank !== "function" || !assets || typeof assets.image !== "function" ||
    typeof api.generatorKey !== "function" || typeof api.generate !== "function" || !Array.isArray(api.names)) {
    throw new Error("Four-vertex-cut models, contracts, bank presentation, static assets and generators must load first");
  }
  const id = "6-2-u3-e4-example-2", key = "sourceGrade6SecondSpaceE4FourVertexCut";
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
      !Number.isSafeInteger(variant) || variant < 0) throw new RangeError("Unsupported four-vertex-cut rank, difficulty or variant");
    const index = variant % pool.length, level = offset + 1, q = presentation.renderBank(id, index, level);
    const dimensionsMatch = dims => Array.isArray(dims) && dims.length === 3 && dims.every(n => n === pool[index]);
    if (!q || q.sourceItemId !== id || q.variant !== index || q.level !== level || q.model?.n !== pool[index] ||
      !dimensionsMatch(q.model.dimensions) || !dimensionsMatch(q.studentGiven?.dimensions) || q.studentGiven.solidFilled !== true ||
      q.conditionScope !== "solid-cube-and-positive-volume-cut-only" ||
      q.requestedAnswerUnique !== true || q.sourceConditionsClarified !== true || q.requiresOriginalReview !== true ||
      q.originalSourceReleaseStatus !== "locked" || q.sourceExact !== false || q.publisherAnswerVerified !== false ||
      q.officialAnswerVerified !== false || q.humanApproved !== false || q.learnerReleaseVerified !== false || q.empiricallyCalibrated !== false ||
      q.requiresLayerDrawing !== false || !Array.isArray(q.responseLayers) || q.responseLayers.length !== 0 ||
      !Array.isArray(q.studentGiven.responseLayers) || q.studentGiven.responseLayers.length !== 0 ||
      typeof q.prompt !== "string" || !q.prompt.trim() || typeof q.answerVisual !== "string" || !q.answerVisual.trim() ||
      typeof q.structuralFingerprint !== "string" || !q.structuralFingerprint.trim()) return null;
    const context = (html, role) => `<div data-four-vertex-cut-context="${role}" data-source-item-id="${id}" data-variant="${index}" data-level="${level}">${html}</div>`;
    return { ...q, prompt: context(q.prompt, "problem"), answerVisual: context(q.answerVisual, "teacher"),
      generator: key, levelRank: rank, generationMode: "fixed-verified-pool",
      verifiedVariantCount: pool.length, verifiedVariantTarget: pool.length, verifiedPoolIndex: index,
      verifiedVariantId: `${id}:v${index}`, difficultyLevel: level, difficultyRank: level, difficultyOffset: offset,
      sourceDifficultyRank: 1, answerPageLayout: "two-column", registrationOnly: true, officialAnswerVerified: false,
      variantProvenance: index === 0 && level === 1 ? "source-conditions-clarified" : "source-conditions-clarified-variant",
      sourceConditionProvenance: "explicit-learner-given-conditions" };
  };
  if (!api.names.includes(key)) api.names.push(key);
  window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_QUESTIONS = Object.freeze({ keys, pool, registrationOnly: true, learnerReleaseVerified: false });

  function zoomAsset(button) {
    const context = button.closest("[data-four-vertex-cut-context]"), data = context?.dataset;
    if (!data || data.sourceItemId !== id || !/^[0-2]$/.test(data.variant || "") || !/^[0-2]$/.test(data.level || "")) {
      throw new RangeError("Invalid four-vertex zoom source or difficulty");
    }
    const variant = Number(data.variant), level = Number(data.level), role = data.fourVertexCutContext;
    const hostSelector = ".source62-four-vertex-given,.source62-four-vertex-answer";
    const host = button.closest(hostSelector), solid = button.closest("[data-four-vertex-solid]");
    if (!host || host.matches(".source62-four-vertex-given") === host.matches(".source62-four-vertex-answer") ||
      host.closest("[data-four-vertex-cut-context]") !== context || !solid || solid.closest(hostSelector) !== host ||
      role !== (host.matches(".source62-four-vertex-given") ? "problem" : "teacher") ||
      solid.dataset.fourVertexSolid !== (role === "problem" ? "given" : "answer")) throw new RangeError("Invalid four-vertex zoom owner or phase");
    const phase = role === "problem" ? "given" : level === 0 ? "cut-top" : "cut-all", file = `n${pool[variant]}-${phase}.png`;
    if (button.dataset.fourVertexCutFile !== file || (button.dataset.phase !== undefined && button.dataset.phase !== phase) ||
      (button.dataset.sourceItemId !== undefined && button.dataset.sourceItemId !== id) ||
      (button.dataset.variant !== undefined && button.dataset.variant !== data.variant) ||
      (button.dataset.level !== undefined && button.dataset.level !== data.level)) throw new RangeError("Invalid four-vertex zoom file or variant");
    const asset = assets.image(file), dims = asset?.dimensions;
    if (!asset || asset.file !== file || asset.kind !== phase || !Array.isArray(dims) || dims.length !== 3 ||
      !dims.every(n => n === pool[variant]) || !Number.isSafeInteger(asset.width) || asset.width <= 0 ||
      !Number.isSafeInteger(asset.height) || asset.height <= 0 || asset.glyphSize !== 72 ||
      typeof asset.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(asset.sha256)) throw new RangeError("Invalid four-vertex zoom metadata");
    const snapshot = { ...asset, dimensions: [...dims] };
    return { asset: snapshot, revisionKey: `${id}:${variant}:${level}:${phase}:${file}:${dims.join("x")}:${asset.width}:${asset.height}:${asset.sha256}:${asset.glyphSize}` };
  }
  if (typeof document !== "undefined" && !window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_ZOOM_BOUND) {
    window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_ZOOM_BOUND = true;
    let dialog, viewport, opener, revision = 0;
    const dismiss = () => { if (dialog) { dialog.setAttribute("aria-busy", "false"); if (dialog.open) dialog.close(); } };
    document.addEventListener("click", async event => {
      const button = event.target?.closest?.(".source62-four-vertex-cut-zoom");
      if (!button) return;
      event.preventDefault();
      const current = ++revision;
      let request;
      try { request = zoomAsset(button); } catch { dismiss(); return; }
      if (!dialog) {
        dialog = document.createElement("dialog"); dialog.className = "source62-four-vertex-cut-figure-dialog";
        dialog.setAttribute("aria-label", "\uADF8\uB9BC \uD655\uB300");
        const close = document.createElement("button"); close.type = "button"; close.className = "source62-four-vertex-cut-figure-close";
        close.textContent = "\u00d7"; close.title = "\uB2EB\uAE30"; close.setAttribute("aria-label", close.title);
        close.addEventListener("click", () => dialog.close());
        viewport = document.createElement("div"); viewport.className = "source62-four-vertex-cut-figure-viewport"; viewport.tabIndex = 0;
        dialog.append(close, viewport); document.body.append(dialog);
        dialog.addEventListener("cancel", () => { revision++; });
        dialog.addEventListener("close", () => { revision++; dialog.setAttribute("aria-busy", "false"); if (opener?.isConnected) opener.focus(); });
        dialog.addEventListener("keydown", event => event.stopPropagation());
      }
      const image = document.createElement("img"), asset = request.asset;
      image.width = asset.width; image.height = asset.height;
      image.alt = button.querySelector("img")?.alt || "\uD655\uB300\uD55C \uC313\uAE30\uB098\uBB34 \uADF8\uB9BC";
      image.src = `./assets/source-6-2-four-vertex-cut/${asset.file}`; dialog.setAttribute("aria-busy", "true");
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
