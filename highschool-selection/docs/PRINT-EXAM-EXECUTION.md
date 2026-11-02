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


## 2026-11-02 운영 시험지 재편집

기존 SH 1회, 돌파 2세트, 생수 2세트의 문항 순서·그림·수식을 유지하며 A4 흑백 2단으로 다시 배치했다. 기본 순서는 왼쪽 위/아래 1·2, 오른쪽 위/아래 3·4이며 긴 지문은 한 열을 사용한다. 좌우 여백 약15.5mm, 열 사이 구분선, 이름·회차·시간·답 영역과 쪽 번호를 넣었다. 한글 머리말과 재구성 가능한 본문은 자체 보관 Noto Serif KR 400을 사용한다. 기존 그림/수식/일부 글꼴 윤곽은 보존했으며 스캔 본문 전체를 새 글꼴로 전사했다고 표시하지 않는다. 돌파 2회는 원본 벡터 클립의 머리말 누출이 있어 문제별 300dpi 흑백 크롭을 사용했다. 해설은 별도 검수본 전체를 유지한다.

상세 회차·쪽·시간·운영 구분은 SERVER-DEPLOYMENT.md의 v5 후속 표를 따른다. 비공개 산출물은 기존 Drive highschool-selection/deliverables의 돌파·생수 4세트 묶음에 보관하며 문제·해설·개인정보·인증 자료는 공개 Git에 넣지 않는다. 실물 인쇄 확인은 남아 있다.
