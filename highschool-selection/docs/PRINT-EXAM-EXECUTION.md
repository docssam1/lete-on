# Secure print exam execution

## Outcome

The printable exam is a sequence of short-lived, student- and exam-bound raster pages. The public repository contains the renderer and validation rules only. It never contains an original PDF, question or answer text, a permanent asset URL, or a local/storage path.

The current implementation consists of:

- `data/print-exam-policy.js`: measured A4 layout profiles and approved print plans;
- `shared/print-exam-security.js`: exact plan/design fingerprint and signed-manifest validation;
- `shared/print-exam-renderer.js`: image-only A4 DOM and print styling;
- `data/source-lineage.js`: approved `original -> twin -> similar` service chains.

## Private ingest and design reproduction

The SH R01 private reference page was inspected outside the public repository. Its A4 geometry is recorded in `data/print-layout-profiles.js` as fingerprints and measured values only: approximately 15 mm side margins, two columns, a 9.5 mm gutter with a rule, a 24 mm header band, a 50 mm body start, a 280 mm footer baseline, and green item numbers. The public file contains no source path, question text, answer, or source pixels.

Full visual fidelity still requires private all-page comparison. The production ingest worker must run outside the public repository:

1. Store the source document in an access-controlled asset service.
2. Assign a neutral `sourceAssetId` and compute its SHA-256 `sourceFingerprint`.
3. Render approved problem pages to raster images; do not return the source PDF.
4. Record `pageNumber`, a neutral `itemLocator`, and/or normalized `bbox` for each item.
5. Measure page size, margins, columns, and gutter into a neutral layout profile. Hash the measurement record as `referenceDesignFingerprint`.
6. Reproduce source-owned page geometry in the private render worker. Replace or omit external brand identity, proprietary fonts, and decorative assets unless their reuse rights are confirmed.

The source design can therefore be reproduced by the private server without committing its pixels or distinctive assets to Git. Final visual review must compare privately rendered pages with every supplied reference page; missing reference access is not a fidelity pass.

## Approval boundary

Each problem has neutral lineage metadata:

```text
sourceExamId -> originalQuestionId -> questionTypeId -> questionId
relation = original | twin | similar
```

`createApprovedServiceChain` requires all three stages, a common source round/original/type, matching asset variants, and an `approved` user decision for every stage. The original question remains part of the service, but its content is delivered only as a signed raster.

Question text, answer values, solution content, and final generated variants must not be frozen before the existing provenance, answer verification, single-answer/figure, user approval, and release gates pass. Pending, rejected, or revoked approval blocks both service-chain creation and print-plan creation.

## Server rendering contract

After `validateExamAssembly` returns `eligible: true`, the server creates a print plan containing only:

```text
examId, layoutProfileId, printPlanFingerprint
pages[] = { number, assetVariant, sourceRefs[], lineageIds[] }
```

Every source reference is limited to `sourceAssetId`, SHA-256 fingerprint, page number, locator/bbox, and variant. The server composes complete page rasters using the approved private layout profile, then returns the existing signed-page manifest plus:

```text
printPlanId, printPlanFingerprint, layoutProfileId, referenceDesignFingerprint
```

The signed manifest must use HTTPS, an approved image host, image MIME types only, an exact page count, and a short expiry. A PDF target or fingerprint mismatch is rejected.

## Browser and printing

The browser validates the packet before rendering. The renderer accepts only a verified `signed-page-images` packet, creates elements without HTML injection, loads every page eagerly, suppresses referrer data, and prints at A4 `210mm x 297mm` with exact color handling.

The UI should expose printing only after all page images have loaded. If any raster expires or fails to load, request a new authorized packet; do not fall back to cached, embedded, or local source material.

## Production verification checklist

- Private source registry resolves every `sourceAssetId` and fingerprint.
- Original, twin, and similar lineage records share the correct source round, original item, and type.
- Every question and print plan has explicit user approval.
- Server output contains no answer/solution fields and no direct PDF or permanent asset location.
- Page manifest matches the exact plan and reference-design fingerprints.
- Private side-by-side review covers every page, typography fallback, crop, figure, table, and print margin.
- A physical A4 proof confirms scale, clipping, page breaks, contrast, and figure readability.
- Approval is revoked and the packet regenerated whenever source, layout, lineage, or answer verification changes.

## Tests

From `repo/highschool-selection`:

```text
node --test tests/print-exam-pipeline-v2.test.cjs
```
