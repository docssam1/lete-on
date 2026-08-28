# SASMO source and program design report — 2026-08-28

## Direct answer

GFIELD should not become a mirror of Edugain or K12 Math Contests. It should be the preparation and evidence layer that those sites do not provide in one place:

`level → goal → diagnostic → domain prescription → guided practice → timed check → error review → retention check`

The public product covers the current **K2 and Grades 1–12** SASMO range, separates student and teacher work, and distinguishes official facts from GFIELD-authored preparation. Original contest papers remain on their source sites or in a private evidence archive; they are not copied into the public app.

## Scope, audience, and assumptions

- Audience: GFIELD program owner, curriculum lead, teachers, and implementers.
- Research scope: the public SASMO pages on Edugain and K12 Math Contests, compared with the current organizer site.
- Verification date: 2026-08-28.
- This is a source-and-product audit, not legal advice or a licence grant.
- No question, answer, solution, diagram, screenshot, or third-party PDF content is reproduced here.

## Source findings

### Official organizer baseline

The current [SASMO organizer page](https://sasmo.simcc.org/) identifies K2 and Grades 1–12 as eligible levels. It lists a 60-minute, 15-question K2 paper and 90-minute, 25-question papers for Grades 1–12. Historical paper availability and format must be recorded by year rather than inferred backward from the current format.

### Edugain

The public [Edugain SASMO curriculum page](https://kr.edugain.com/curriculum-16/SASMO) exposes Grades 1–10. A DOM-level audit found 158 selectable topic nodes and 158 corresponding public sample-page entries across those ten grades. A separate count based on comma-separated marketing text produced 163 labels; GFIELD uses the selectable controls as the reproducible product-structure count. Neither count is treated as a count of official SASMO questions.

Edugain's useful product pattern is grade selection followed by topic selection, worksheet/test activity, answer review, and progress tracking. Its [published policy](https://kr.edugain.com/policy) limits use and prohibits copying, republication, distribution, and software harvesting or collation. Therefore GFIELD does not copy Edugain questions, answers, solutions, worksheets, topic wording lists, generator rules, or screen copy. Only the high-level workflow is used for comparison, and the GFIELD taxonomy and interface are independently authored.

### K12 Math Contests

The public [K12 Math Contests SASMO index](https://www.k12mathcontests.com/contest/sasmo) exposes 88 year-and-level records spanning 2014–2024 and Grades 1–10. The 88 detail pages resolve to 144 physical PDF files because some problem, answer, or solution roles are bundled into one file. The physical-file mix is 66 problem files, 47 solution files, 23 problem-with-solution bundles, five answer keys, and three problem-with-answer bundles.

An internal custody check verified all 144 files by PDF signature, byte length, page count, and SHA-256: 1,796 pages, 153,123,480 bytes, 144 unique hashes, no duplicate hash groups. Nine files exactly match separately acquired organizer-hosted evidence. These checks establish identity and integrity, not permission.

K12 Math Contests does not publish a SASMO republication licence or demonstrate an organizer relationship on the audited pages. The archive is also incomplete relative to the current K2–Grade 12 range. GFIELD therefore classifies it as a **third-party index only**: public metadata and an external link may be shown with that warning, while PDFs, extracts, translations, and derivative item-bank content stay out of the public repository and browser build.

## Gap matrix

| Capability | Edugain | K12 Math Contests | GFIELD decision |
| --- | --- | --- | --- |
| Current SASMO levels | G1–G10 | Historical G1–G10 | K2 and G1–G12 |
| Content access | Generated practice and samples | Historical PDF links | Official links plus independently authored GFIELD content |
| Diagnostic model | Topic practice/test | None visible | Six-domain diagnostic with misconception evidence |
| Learning sequence | Grade → topic → activity | Year → grade → file | Level → goal → diagnostic → prescription → practice → review |
| Student view | Practice and progress | Download list | Today's plan, evidence map, review, retention |
| Teacher view | Classes and assignments | None visible | Cohort heatmap, evidence gaps, assignment approval, source status |
| Source rights | Restrictive published policy | No republication licence located | Fail-closed rights and verification states |
| Promotion | Not a school placement authority | None | School-configured thresholds and teacher review only |

## GFIELD architecture decision

### Level and goal

- Levels: K2 and G1–G12.
- Goals: first attempt, skill growth, award target, and AMC bridge.
- Current organizer eligibility and paper format are stored separately from GFIELD's preparation bands and curriculum.

### Six diagnostic domains

1. Number and operations
2. Patterns and algebra
3. Geometry and spatial reasoning
4. Combinatorics and logic
5. Data and probability
6. Problem-solving strategies

These are GFIELD instructional axes, not a copied Edugain topic list and not a claim that the organizer publishes this exact taxonomy.

### Modes and roles

- Modes: placement screener, skill diagnostic, guided practice, timed mini-test, full mock, error review, and retention check.
- Student: assigned work, feedback, error review, and next action.
- Teacher: evidence, grouping, assignment, review, and release state.

Actual role authorization remains locked until authenticated server-side enforcement is complete. A visual role preview is not an access-control boundary.

### Source and release states

Every resource records a source status, rights status, and verification status. Public delivery is allowed only for GFIELD originals or separately reviewed permissive material. Official links and third-party index links remain link-only; private references and unclear-rights sources cannot publish.

## Claim-to-source ledger

| Claim | Evidence | Confidence | Limitation |
| --- | --- | --- | --- |
| Current SASMO scope and format are K2/G1–12, 15/60 and 25/90. | [SASMO official](https://sasmo.simcc.org/) | High | Recheck before each competition cycle. |
| Edugain public navigation stops at G10. | [Edugain SASMO](https://kr.edugain.com/curriculum-16/SASMO) | High | Page structure can change. |
| Edugain content may not be copied or harvested for this product. | [Edugain policy](https://kr.edugain.com/policy) | High | Product-specific permission could change only through a separate written licence. |
| K12 exposes 88 SASMO records and 144 physical PDF links for G1–G10. | [K12 SASMO index](https://www.k12mathcontests.com/contest/sasmo) plus all linked detail-page metadata | High | Snapshot dated 2026-08-28; not organizer completeness. |
| K12 files may not be treated as licensed official distribution. | K12 audited pages plus the [SIMCC past-paper store](https://store.simcc.org/product-category/past-year-papers/) | High | A non-public agreement cannot be ruled out; no public licence was found. |

## Stop condition and next evidence

Research stopped after all 88 K12 records and 144 file endpoints were accounted for, Edugain's public grade/topic controls and policy were checked, and the official current format was reconfirmed. No further automated question retrieval is permitted under the source policy. Future item authoring must use GFIELD originals, or separately licensed official material with a recorded delivery decision and independent mathematical review.
