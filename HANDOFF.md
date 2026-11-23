### 2026-11-05 · 웹에서 2010 AMC 10/12 문항 응답표 확인 및 전사 정정

- MAA-authored 61st Annual AMC 10/12 Results Summary의 Table IX를 웹 검색으로 찾아 네 폼 응답표와 LIVE 정답 키를 대조했다. AMC 12A/B는 인쇄 p.195, AMC 10A/B는 p.196. 검색 가능한 제3자 미러를 사용했으며 출처 호스트는 MAA가 아니다.
- 2010 AMC 10A 23번 E 선택 비율을 3.52%에서 원표의 3.32%로 바로잡았다. 다섯 선택지·공란·판독불가 비율 합이 100.00%가 되어 coverage가 24/25에서 25/25로 바뀌었다. 10B 8·17번, 12B 3번은 원표 합계가 각각 99.91%, 99.92%, 99.88%여서 비교에서 제외한 상태를 유지한다.
- 갱신: 런타임 참조, 2010 원자료 CSV, 연도/폼 coverage manifest, 연구 노트, `historical-amc-grade/README.md`. 2009 전국 문항 응답표는 이번 검색에서도 못 찾았다. 학교별 보고서는 학교 표본으로 남기며 전국·학년 비교에 합치지 않는다.
- 확인: CSV 열 수, 10A 2010 Q23 정정값, coverage 상태를 정적으로 대조하고 `git diff --check`를 진행한다. 별도 테스트는 실행하지 않는다. `raw_youtube.txt`는 사용자 파일로 유지한다.

### 2026-11-05 · 연도별 응답자료 coverage 재대조 및 2009 출처 검색 갱신

- 현재 `amc-item-response-coverage-by-paper.csv`를 다시 집계했다. 2008 AMC 10A/B·12A/B는 각각 25/25, 2006은 AMC 10A 24/25, 10B 25/25, AMC 12A 25/25, 12B 24/25다. 2006 AMC 10B의 25행은 57th Annual Report의 잘못 표시된 AIME-qualifier 표가 아니라 MAA 발행 *Contest Problem Book VIII* p.170에서 회수한 별도 응답 패턴이며, 응시자 수/지역 범위 미공개이므로 전국 norm으로 해석하지 않는다.
- 2009 AMC 10/12 A/B의 MAA 전국 문항 응답표는 이번 웹 검색에서도 찾지 못했다. 2009B 학교별 결과 PDF 3건(Temasek n=89, Anglo-Chinese 10B n=31/12B n=1, Changkat Changi n=10)을 찾았으나 학교 코호트라 국가·등급 비교에 합치지 않았다. 2009 연도별 grade mean은 MAA 2010 report의 retrospective table에 이미 연결돼 있다.
- 연구 노트의 앞선 2006/2008 `not-found` 문장은 회수 전 시점 기록임을 명시하도록 고쳤다. 다음은 다른 미회수 연도·폼의 MAA 연례보고서/공개 원자료를 계속 찾아, 응답 분포와 grade comparison의 모집단을 분리해 채운다.
- 검수는 coverage CSV의 연도·폼 행과 기존 README/연구노트 서술을 대조하는 정적 확인으로 진행한다. `raw_youtube.txt` 사용자 파일은 그대로 둔다. 로컬 커밋 가능, push·배포·Drive 동기화 없음.

### 2026-11-05 · 2006 AMC 10/12 response tables recovered

- Added MAA 57th annual report item-response tables for 2006 AMC 10A, 12A, and 12B to the runtime reference, raw CSV, and year/form coverage manifest. Source PDF is the Internet Archive copy of the MAA-authored annual report; all 75 answer markers were cross-checked against LIVE keys.
- 10A Q9 and 12B Q18 response shares do not sum to 100% (90.98% and 109.00%); retained source values but excluded those questions from response comparison. 12B respondent count is printed `xxx,xxx` in Table X; manifest/runtime use 50,147 from Table VI. The 10B table in this report is explicitly 2005 and remains unassigned to 2006.
- Static validation still required before commit: check the CSV/runtime values, exclusions, response counts, manifest uniqueness and `git diff --check`. `raw_youtube.txt` is user-owned and remains unstaged. No tests, push, deployment, or Drive sync.
- Follow-up web search found 2009 grade means already stored in the MAA 2010 four-year comparison tables, but Table IX pp.195–196 is for 2010 item responses; 2009 local B-form PDFs are school/venue samples. Keep 2009 response coverage `not-found`.
- A separate 2006 AMC 10B AIME-qualifier Table IX (printed p.309) was found in the MAA report, but its answer stars repeatedly conflict with LIVE and an independent key (first three MAA marks A/D/D vs C/A/A) and the displayed response rates do not fit an AIME-qualifier cohort. Do not import; keep 2006 10B item-response coverage `not-found` until a corrected, verifiable table is found. This is distinct from the all-official Table X 2005 10B table.
- Continue year-by-year searches for other response-table gaps; never reassign years or populations.

### 2026-11-05 · MAA AMC 10/12 점수분포 연도별 원문 교차확인

- 웹 검색 후 MAA K–12 EduView 공개 보고서에서 2022–2025 AMC 10/12 A/B 16개 회차의 점수분포 행을 확인했다. 전체 점수선, 평균·표준편차, 학생/학교 수와 회차별 원문 URL을 `boarding-school-math/competition/historical-amc-grade/amc10-12-score-distribution-2022-2025-maa.csv`에 정리했다.
- 이 데이터는 `amc-score-distribution-reference.js`에 이미 쓰이는 수치와 일치하므로 기존 화면 값의 출처 추적성을 보강한다. 전체 응시 코호트 비교자료이며 Grade별 분포가 아니므로 학년 등급이나 배치 예측으로 해석하지 않는다. 2022/23–2025/26 AMC 8 CSV와도 서로의 모집단/시험을 합치지 않는다.
- README와 출처 연구 기록에 범위와 제한을 적었다. CSV 16행의 11개 런타임 공통 필드, 연도·회차 키, MAA 보고 URL 매개변수를 대조했고 `git diff --check`를 통과했다. 별도 테스트는 실행하지 않았다. `raw_youtube.txt`는 그대로 보존한다. 로컬 변경만 커밋 가능하며 push·배포·Drive 동기화는 하지 않는다.

### 2026-11-05 · 연도별 AMC 10/12 성과 연구 및 MAA 보고 경로 추가 확인

- 웹 검색으로 2007–2011 AMC 10/12 문항 정답률을 다룬 UWF 고교생 연구와 현재 MAA EduView 연도·회차별 전체 점수분포 화면을 확인했다. 연구 표본은 Northwest Florida 시험센터 970명(AMC 10 응시 Grade 9–10 n=487, AMC 12 응시 Grade 11–12 n=483)이며 전국 자료가 아니다. 웹 PDF 도표 텍스트가 열/소수점 일부를 손상시켜 모든 문항 수치를 전사하지 않았다.
- MAA EduView는 2022/23–2025/26의 AMC 10/12 A/B 및 AMC 8 회차별 전체 참가자 점수선·평균·표준편차·응시자/학교 수를 제공하지만, 공개 화면에 학년별 분포나 문항별 정답률은 없다. 옛 `generalreports.aspx` grade-percentile 보고서는 경로를 확인했으나 현재 원문 호스트가 HTTP 521을 반환했다.
- 조사 내용과 직접 출처는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 기록했다. UWF의 지역 표본은 전국·학생 진단에 사용하지 않으며, 한국 school/host report는 모집단이 일치하는 경우에만 추후 별도 검토한다. 검색에서 확인된 개인 식별 자료는 저장하지 않는다.
- 변경은 검색 근거 기록뿐이다. `raw_youtube.txt`는 그대로 두고, 아직 원문 grade-percentile 표나 새 숫자 데이터는 추가하지 않았다. `git diff --check` 후 로컬 커밋을 진행한다. Push, 배포, Drive 동기화는 하지 않는다.

### 2026-11-05 · 2016 AMC 8 whole-cohort summary extended

- Web search recovered the correct BEAM result post dated 2017-02-25, which identifies the prior November contest as 2016 and reports n=108,295, median 9, and top-quartile boundary 12. These align in population with the MAA Michigan Section Spring 2017 newsletter, which reports 108,295, 1,875 schools, mean 9.36, and top-1% boundary 22.
- Added median/top-25 markers and precise source provenance to the AMC score reference and README/research note. Kept the alternate 99CEF U.S./Canada n=108,227 row separate. This still is not a 0–25 frequency table, and it does not provide Grade 7 national averages.
- `git diff --check` passed and the 2016 reference entry was reviewed against the two cited posts; fields added (`top25`, `top50`) already exist in the reference schema. The system has no `node` executable, so no runtime/test command was run. Preserve `raw_youtube.txt`; do not infer full frequencies or substitute the Bard local sample for national grade data.

### 2026-11-05 · AMC 8 2002–2004 frequency-table search

- Searched web archives for 2002/2003 national AMC 8 score frequencies and inspected the MAA-authored 56th annual report's 2004 AMC 8 section. The accessible 2004 section prints cohort totals, perfect score count, overall/grade means and award recipients, but no 0–25 frequency table was found there. A 2002 result search returned an MAA-branded problems/solutions pamphlet, not statistics.
- Logged the bounded search and source links in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. Existing 2002–2004 cohort summaries remain averages/counts only; do not derive score distributions from them. Continue searching alternate annual-result archives or contemporaneous reports.
- No new numeric data imported. `raw_youtube.txt` remains untouched.

### 2026-11-05 · Recent AMC 8 MAA score distributions fetched directly

- Retrieved the official MAA K-12 EduView score distribution pages for AMC 8 2023–2026 and saved the full visible summary rows (percentile boundaries, mean, SD, student/school counts) in `boarding-school-math/competition/historical-amc-grade/amc8-score-distribution-2023-2026-maa.csv`. Direct report URLs and the data are documented in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md` and the data README.
- The direct MAA values confirm 2025 average 11.74 / n=79,524 and 2026 n=80,983; search snippets and secondary tables disagree slightly. Keep MAA report values separate from other cohorts and use only as whole-cohort score-report references.
- `raw_youtube.txt` remains untouched and unstaged. No tests, push, deployment, or Drive sync. Next: keep recovering year/form data from annual MAA reports, especially missing AMC8 score-frequency years and AMC10/12 recorded-grade comparisons; do not infer score distributions from summary averages.

### 2026-11-05 · 2003–2004 AMC 10/12 grade tables located on the web

- Web search found the MAA-authored [56th Annual AMC report copy](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions). Its printed Table II provides recorded-grade participant counts and average scores for AMC 10/12 A/B across 2002–2005, so 2003–2004 grade comparison data exist in a source report.
- The web-indexed text extraction scrambles multi-column cells; the report-viewer page triggered a Cloudflare check, and the web screenshot API cannot render this HTML copy as a PDF. I recorded the source and transcription blocker in the coverage manifest/evidence note, but deliberately did not import ambiguous figures. The exact 2003/2004 AMC 10/12 comparison is still unfinished until the printed page 8 is readable and its grade counts/weighted means reconcile to form totals.
- Next: locate an accessible report PDF or mirror/page image; transcribe 2003 and 2004 A/B grade tables, then continue year-by-year historical source recovery. Preserve `raw_youtube.txt`; no push/deployment/Drive sync.

### 2026-11-05 · 2005 AMC 10/12 grade means recovered from annual report comparison tables

- Web search located a MAA-authored 2008 High School Summary copy with four-year comparison tables that reproduce the 2005 AMC 10A/B and AMC 12A/B recorded-grade participant counts and means. Transcribed 22 grade-group rows into `boarding-school-math/competition/historical-amc-grade/amc10-12-grade-means-2005-2011.csv` and connected them to `amc-historical-grade-reference.js` for exact year/form/grade matching. The grade-group counts sum to each form's official-participant total, and weighted rounded averages reconcile to the published form-wide means (10A 74.7; 10B 77.9; 12A 78.7; 12B 83.4). Updated the 2005 and 2006 AMC 10/12 paper rows in the grade coverage manifest and the source evidence note.
- Source copies: [56th 2005 AMC annual report](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions) and [59th 2008 AMC High School Summary](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions). Both are third-party hosted MAA-authored publications; grade tables do not distinguish domestic from international participants. These are historical descriptive means, not current norms, percentile ranks, or skill levels.
- Next: run `git diff --check`; review the exact changed coverage rows and reference entries; verify the four published means and no cross-year/form collisions. Then continue annual report search for missing year/form grade tables; 2003–2004 remain unverified in the early AMC 10/12 coverage. Preserve `raw_youtube.txt`; no push, deployment, or Drive sync.

### 2026-11-05 · AMC 8 grade data cross-checked against annual reports

- Repository: `/Users/docssam/Developer/GFIELD/continuations/boarding-school`, branch `codex/boarding-g7-nsa-mac-20261017`, local HEAD `05f260a0e` (`Cross-check 2004 AMC 8 grade reference`). No push/deploy/Drive sync. Preserve the untracked user file `raw_youtube.txt` unchanged and unstaged.
- Web search found MAA-authored 56th and 57th annual AMC report copies. The 56th report independently confirms the existing 2004 AMC 8 recorded-grade counts and means: ≤5 1,496/8.15; Grade 6 15,248/8.51; Grade 7 51,679/9.55; Grade 8 84,399/10.48. The 57th report confirms the same 2004 row and the existing 2005 row: Grades 4–5 2,014/8.05; Grade 6 14,268/8.16; Grade 7 48,418/9.37; Grade 8 76,877/10.52. Coverage manifest and source research note now record the added checks and cohort caveat; no runtime values changed.
- The same report lists 2005 AMC 10/12 grade averages and whole-cohort item-difficulty tables, but web text extraction interleaves the table cells. Do not import those numbers without readable pages and row-by-row verification. Search did not surface a readable PDF; next step is to locate page images or another scan, then transcribe only clearly verified cells. The 2004 AMC 8 response table remains 24/25 usable rows; Q1 is suppressed because its published shares sum to 99.74%.
- The 56th report lists 2005 AMC 10/12 recorded-grade averages and item-difficulty tables, but its web text extraction interleaves columns. No readable report PDF was surfaced; do not add figures until they can be transcribed from readable pages. `git diff --check` passed before the source-note commits. No tests were added or run. Latest commits: `05f260a0e` (grade-source cross-check), `008127446` (handoff), with one new source-documentation commit pending.

### 2026-11-04 · 2020 AMC 8 item-response data recovered from web image

- Repository: `/Users/docssam/Developer/GFIELD/continuations/boarding-school`, branch `codex/boarding-g7-nsa-mac-20261017`, local HEAD `d319388d` (`Add 2020 AMC 8 item response diagnostics`). The 2020 work is committed; the only untracked file is user-owned `raw_youtube.txt`, which must not be staged or removed. No push/deploy/Drive sync.
- Web source: TestDaily article https://www.testdaily.cn/52247/ reproduces a 2020 MAA-labelled overall item difficulty image (n=52,517) and a Contest Score Report image (n=56,136, scope not stated). Apple Vision OCR was visually checked; all 25 answer markers match LIVE's key https://live.poshenloh.com/past-contests/amc8/2020/answers. A separate existing grade image uses n=56,099; preserve each population separately.
- Added `competition/historical-amc-grade/amc8-2020-overall-item-response.csv` and connected 2020 into `competition/amc8-item-response-reference.js`, so the existing AMC8 review panel can show historical correct/distractor/omission rates for wrong or blank items. Added a distinct 2020 whole-cohort summary row and connected visible award cutoff / mean / SD / n summary to `competition/amc-score-distribution-reference.js`. Do not calculate an individual percentile: no exact score-frequency table was recovered.
- Updated source README and research evidence. Follow-up search found no 2016 overall item-response chart; 2017 report has exact score-frequency and item response for its own cohort but is not a substitute for 2016. Next: continue year-by-year source search for exact AMC8 score-frequency/item-response reports and comparable AMC10/12 grade results; add only source-supported tables. 2020 item rows and score-reference lookup were checked via local Node REPL; `git diff --check` passed. No tests were added or run.

### 2026-11-04 · 현재 AMC8 원점수 통계 작업 상태

- 저장소: `/Users/docssam/Developer/GFIELD/continuations/boarding-school`, 브랜치 `codex/boarding-g7-nsa-mac-20261017`. 로컬 커밋 `89f7d3a4f`(2012), `becb223ab`(2013–2015), `ead2ca673`(2017–2022), `9543a55bd`(보고서 페이지 정정). 원격 push/배포/Drive 동기화 없음.
- 결과 화면은 완료 채점 후 연도별 Global·美加 또는 원자료 표본의 평균과, 점수별 빈도표가 확보된 연도는 동점 제외·strictly-lower share를 표시한다. 2014 분모 차이, 2017 가중평균 차이, 2018 PDF 제목 오기, 2022 지역 범위 미확인을 표시한다. 2019 점수 위치는 99CEF 美加 분포 n=94,634와 같은 출처 연례 평균을 사용하며, 다른 MAA grade-group 집계 n=94,620은 별도 보존한다. 이 비율은 공식 백분위·학년 등급이 아니다.
- 로컬 Node REPL에서 2012, 2013, 2014, 2015, 2017, 2018, 2019(99CEF), 2022 참조·원문 링크를 확인했다. CSV는 각 집단 26행, 0–25점, 누적 인원 계산을 검사했다. 2020·2023–2026의 full-score-frequency 표는 공개 원자료를 회수하지 못해 점수별 위치 계산을 연결하지 않았다. 2016은 연례 요약만 회수했으며 전체 빈도표 미확인.
- 작업본에 남은 미추적 파일은 사용자 원본 `raw_youtube.txt` 하나이며 수정/staging 금지. 다음에는 2020/2023 이후 공식 score reports와 공개 분포 이미지 경로를 계속 검색하고, 정확한 빈도표가 있는 회차만 추가한다.

### 2026-11-04 · 웹 검색 후속: 2016/2020 AMC 8 원자료 대조

구 MAA 보고서 ID 63(2016), 87(2020)을 현행 EduView endpoint에 직접 대입했으나, 옛 연도/회차가 현재 선택지에 없어 두 링크 모두 기본 n=673, 평균 6.55, 최고 15 표본을 돌려줬다. 이는 해당 AMC 8 연도 자료가 아니므로 저장하지 않는다. 웹 검색으로 별도 회수한 2020 U.S. 수상 컷 21/18과 수상 인원(Top 1% 664, Top 5% 1,942, Achievement Roll 1,671, 만점 53)은 Ivy League Education Center의 2차 요약에 한정한다. 같은 기관의 별도 페이지는 worldwide Top 1% 714, Top 5% 2,099, 완벽 점수 57을 보고하므로 지역 범위를 분리해 둔다. 평균 10.00은 Think Academy의 반올림 2차 자료이며, MAA Wisconsin Section의 기존 10.01과 별도로 둔다. Bard Math Circle Grade 7 평균 12.3은 35명 현장 표본이어서 전국 학년 규준에서 제외한다. Rootmaths의 2016 이미지 경로는 회수 실패; 정확한 점수 빈도표는 여전히 미확인이다. 자세한 링크와 근거는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 기록했다.

원본 AMC/AJHSME 시험지·정답·전문 해설은 기존 연도/폼별 LIVE 카탈로그에 연결되어 있다. 이번 검색에는 점수빈도 데이터 행 추가 없음. `raw_youtube.txt` 미수정. 로컬 문서만 갱신했으며 push·배포·Drive 동기화 없음.

### 2026-11-04 · 2019 AMC 8 원점수표를 같은 출처 기준으로 정렬

99CEF 2019 AMC 8 PDF의 web-indexed printed p.3에서 美加·Taiwan 각 26개 점수 빈도와 누적표를 회수했다. 美加 n=94,634, 가중평균 9.43094, Taiwan n=8,451, 평균 13.07798로 보고서 요약 9.43/13.08에 맞는다. 새 `amc8-2019-99cef-global-taiwan-score-counts.csv`에 저장했고, whole-cohort lookup의 2019 분포를 기존 동일 출처 연례 요약(美加 n=94,634)과 맞췄다. 기존 MAA Overall grade aggregation n=94,620 파일은 다른 표본으로 별도 유지한다. PDF는 직접 다운로드가 404였고 웹 인덱스 텍스트로 표를 대조했으므로 로컬 시각 검수·OCR 자료로 표시하지 않는다. 2019 통계 CSV/런타임 출처는 업데이트했으며 문제·해설 본문 복사는 없다. `raw_youtube.txt` 미수정; push·배포·Drive 동기화 없음.

### 2026-11-04 · AMC 8 2019/2022 전체 점수 분포 연결

기존 원자료를 재사용해 점수별 합계를 추가했다. 2019는 MAA Overall 보고서의 학년 그룹(미기재 포함) 원점수 0–25 빈도를 합쳐 n=94,620, 평균 9.4312, 만점 151, 20점 이상 2,958이다. 99CEF 회고 연례 요약은 참가자 94,634명으로 14명 차이가 나며, 분포 계산은 MAA 표에 기록된 분모 94,620을 사용한다. 2022는 MAA Overall 학년 그룹 다섯 개를 합산해 n=71,017, 평균 9.6927, 만점 131, 20점 이상 2,404이며 모든 점수 행이 이미지의 All 열과 일치한다. 지역 범위는 2022 이미지에서 확인되지 않는다.

2019/2022 전체 합계 CSV 및 lookup 화면을 연결했다. 출처·그룹·합계 차이를 문서화했고, 다음 원자료 후보 연도 탐색은 계속한다.

### 2026-11-04 · AMC 8 2017–2018 연도별 점수 분포 확보

99CEF의 2017/2018 AMC8 보고서에서 Global 또는 美加(미국·캐나다)와 Taiwan의 0–25점별 인원표를 웹 검색으로 회수했다. 2017 북미 81,386명과 대만 8,001명은 보고서 표와 일치하나 북미 가중평균 9.064와 보고서 요약 9.05는 서로 다르다. 2018 미국·캐나다 98,389명/대만 7,906명과 평균·20점 이상·만점은 보고서 요약과 맞는다. 단 2018 PDF 내부 제목/파일 메타데이터는 2009로 잘못 붙어 있고, 본문은 2018 34회로 명시하므로 이 불일치를 근거 문서·화면에 고지한다. 2016은 검색으로 전체 요약 n=108,227/mean=9.36/20+=3,104/perfect=268만 회수했고 점수별 분포는 미회수 상태로 둔다.

`amc8-2017-global-taiwan-score-counts.csv`, `amc8-2018-global-taiwan-score-counts.csv` 및 비교 런타임, README, 출처 조사 노트를 갱신했다. 2017·2018·2019·2022 각 모집단은 26개 점수 행, score 0–25, 누적 인원, 합계 및 가중평균을 Node REPL/CSV 교차검토로 확인했다. 2017 가중평균 차이와 PDF 제목 오기를 유지했다. 다음: 원점수 표가 공개된 연도를 계속 탐색하고, 점수 빈도표가 없으면 평균/수상선/학년표 등 다른 근거를 다른 종류의 데이터로 유지한다.

### 2026-11-04 · AMC 8 2013–2015 원점수 분포 웹 검색 연결

웹 검색으로 99CEF의 [2013 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2013AMC8Report.pdf), [2014 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2014AMC8Summary.pdf), [2015 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2015AMC8Report.pdf)에서 연도별 Global/Taiwan 0–25점 인원표를 확인했다. 2013 두 모집단 합계는 각각 보고서 n(149,709 / 9,811)과 일치하며 Global 가중평균 10.70, 만점 369, 20점 이상 6,531도 보고서 요약과 일치한다. 2014 Taiwan 빈도는 n=9,199로 맞지만 Global 점수 빈도 합계는 144,177, 보고서 전체 참가자는 144,737이고 560명 차이가 난다. 2014 분포 빈도 가중평균은 11.4620, 보고서 요약은 11.44다. 원표를 보정하지 않고 결과 화면은 2014 score-frequency 분모 144,177로 엄격히 낮은 점수 비율을 계산하며 두 분모 차이를 고지한다. 2015는 Global n=149,844와 가중평균 8.5545(보고 8.55), Taiwan n=9,017 모두 빈도와 요약이 일치한다.

`amc8-2013-global-taiwan-score-counts.csv`, `amc8-2014-global-taiwan-score-counts.csv`, `amc8-2015-global-taiwan-score-counts.csv`, 전체 코호트 lookup, 검수 화면 문구, README 및 `AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`를 갱신했다. 다음 단계는 다른 연례 보고서의 score-frequency 표를 이어서 찾아 연도별 CSV로 누적하는 것. OCR은 쓰지 않았다. `raw_youtube.txt`는 수정/staging하지 않는다.

### 2026-11-04 · AMC10B 2013 글로벌 학년표 회수 및 AMC12B 출처 검수

Internet Archive에서 2013 GEMT AMC10B/AMC12B 보고서 PDF를 회수했다. 현재 게시 URL은 2014년 파일로 이동하므로 2013 보존본을 출처로 쓴다. Apple Vision OCR과 시각 대조로 AMC10B p.4 및 AMC12B p.13 표를 확인했다. 신규 AMC10B Grade 7/8/9/10: n=1,342/2,593/11,239/17,726, 평균 75.93/81.63/67.23/73.74. 학년 그룹 합은 34,738, 보고서 전체는 34,740으로 차이 2명을 그대로 기록한다. 대만 자료는 분리했다.

`amc10b-grade-means-2013-global.csv`, `amc12b-grade-means-2013-2014.csv`, `amc-historical-grade-reference.js`, coverage manifest, README와 evidence를 갱신했다. 다음: 2013 AMC10B Grade 7–10 조회 매칭과 CSV/manifest 검수 후 로컬 커밋. `raw_youtube.txt`는 계속 보존한다.

### 2026-11-04 · 2012 AMC10A Global Grade Means

웹 검색에서 99CEF 2012 AMC10A/12A 분석 보고서의 전체(Global) 학년별 점수와 표본 수를 회수했다. Grade 7 1,810명/78.83, Grade 8 3,948명/81.72, Grade 9 25,498명/69.16, Grade 10 36,206명/74.25. 전체 Global 학년 묶음은 73,703명으로 보고서 참가자 수와 일치한다. 대만 열은 별도 모집단이고 `<=6`, unknown은 exact grade 비교에 사용하지 않는다.

신규 CSV `boarding-school-math/competition/historical-amc-grade/amc10a-grade-means-2012-global.csv`, 화면 조회 `boarding-school-math/competition/amc-historical-grade-reference.js`, coverage manifest, README와 증거 노트를 갱신했다. 조회 모듈에서 Grade 7–10의 네 매칭과 참가자 수를 확인했다. MAA의 2012 archived ReportViewer 본문은 회수되지 않았으며, 학년 비교는 99CEF 국제 참가자 보고서에 한정된다. `raw_youtube.txt`는 미추적 상태로 보존한다.

### 2026-11-04 · 웹 검색: AMC 8 2016 공개 통계 출처 재확인

2016 AMC 8 전국 학년 평균/점수표와 전국 문항응답 보고서를 MAA 보고서명·Item Difficulty 문구로 다시 검색했으나 검수 가능한 전국 원표는 찾지 못했다. 2015 MAA Teacher Manual 사본은 참가 학교별 Item Difficulty 표를 제공한다고 설명한다. 이는 학교 코호트 결과 기능이지, 전국 표본은 아니다. 2016년 상태를 `no-grade-table-recovered`로 유지하고 학교 통계를 전국 비교에 섞지 않는다. 근거: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`.

### 2026-11-04 · 웹 검색: AMC 8 2005 문항 통계 출처 구분

2005 AMC 8 실제 시험·정답·해설은 MAA 허가를 명시하는 LIVE 연도 아카이브에서 제공된다. MAA 2006 AMC 8 결과 보고서는 2006 회차의 Item Difficulty 표와 2005/2006 전체·학년 평균을 함께 싣지만, item table은 2006 시험 결과다. 2007 MAA 보고서의 표에는 2005 학년별 참가자 수와 평균이 포함된다. 기존 학년 평균 자료와 연도별 시험 카탈로그는 이 값을 이미 별도 연결하고 있다.

검색한 공개 MAA 보고서·색인에서 2005 AMC 8 A–E 선택률 전체 표는 확인되지 않았다. 학교별/국가별 결과를 전국 응답표로 대체하지 않았고 2006 문항 비율을 2005에 복사하지 않았다. 2005의 학년 평균 비교와 문항별 선택률 진단은 출처·용도가 다른 레이어로 유지한다. `raw_youtube.txt` 미수정; push·배포·Drive 동기화 없음.

### 2026-11-04 · 웹 검색: 2004 AMC 8 문항응답표 원자료 확인

2004 AMC 8 인쇄 시험지·정답·전문 풀이를 LIVE의 MAA 허가 아카이브에서 확인하고, 154,590명 응답표를 공개 뷰어의 표 이미지에서 직접 행별 전사했다. LIVE 정답 25개와 전부 대조했으며 Q1 응답률 합계 99.74%는 원문 그대로 보존하고 비교에서 숨겼다. 나머지 24행은 100%±0.15%p에 든다. CSV와 런타임 레지스트리, 기존 테스트, 조회 캐시, README와 근거 기록을 갱신했다. 2004 학년 평균은 이미 있는 파일을 그대로 쓴다. 집중 Node 테스트 1/1 통과. 브라우저 자동 테스트는 이 실행 환경의 프로젝트 Node 경로에서 Playwright를 찾지 못해 미실행이며, 로컬 브라우저에서 2004 결과 화면을 수동 확인했다. `git diff --check` 통과. `raw_youtube.txt`는 미수정이다. Push·배포·Drive 동기화 없음.

### 2026-11-04 · 실제 연도별 AMC 원본 연결 및 대회 경로 정리

사용자 요청에 따라 웹에서 실제 AMC 기출 아카이브와 MAA의 현행 대회 범위·자격 정보를 다시 확인했다. LIVE는 266개 회차, 6,500개 문제, 77개 연도를 제공하고, AMC 8은 1985–2026년(2021년 미수록) 41회, AMC 10은 2000–2025년 52개 A/B·가을 폼, AMC 12/AHSME는 1950–2025년 102회로 색인한다. 각 회차에 인쇄 PDF·정답표·전문 풀이·온라인 문항 복습이 있으며, 자료가 MAA의 공식 법적 허가 아래 사용된다고 아카이브가 명시한다. GFIELD에는 문항/풀이를 복사하지 않고 정확한 연도·시험형 선택 후 출처로 연결한다.

로드맵의 두 임시 MAA 샘플 링크를 제거하고, AMC 연도별 문제 복습으로 가는 내부 링크로 교체했다. 선택한 회차의 실제 원본 PDF를 인쇄하고 답안을 입력해 채점·동일 시험형 기준 비교·원문 해설 확인을 이어가는 구조다. AIME는 MAA 안내로, Math Kangaroo는 선택 학년에 맞는 공식 PDF 시험지/풀이 페이지로 연결한다. Grade 7 복습 선택지에 AMC 8/10/12/AIME가 나타나더라도 공식 응시 자격이나 학교 배치 판정이 아니라 연습용 문항 복습이며, 공식 자격 확인 링크는 MAA 페이지로 분리했다. MAA는 AMC 8의 학년/연령 제한과 AMC 10·12의 학년 및 연령 제한을 각각 제시한다.

검수: 기존 266회 AMC 인벤토리의 연도·폼·인쇄 PDF·정답·풀이 URL 무결성은 이전 검수에서 확인된 상태다. 이번 변경은 브라우저에서 Grade 7 경로를 확인해 샘플 링크가 사라지고 AMC 연도별 복습, Grade 7 Math Kangaroo 자료, AMC 결과 입력 경로가 각각 올바른 프로그램으로 가는지 확인했다. 2018 AMC 8 선택에서 25문항 입력, 인쇄 PDF·정답·전문 풀이 링크 및 Grade 7 복습 선택지를 확인했다. `git diff --check` 통과.

출처: [LIVE 실제 연도별 AMC/AIME 원본 아카이브·인쇄본·권한 안내](https://live.poshenloh.com/past-contests), [MAA 현행 AMC 범위·학년/연령 자격](https://maa.org/student-programs/amc/), [Math Kangaroo 연도별 실제 PDF 시험지](https://mathkangaroo.org/mks/practice/pdf-exams/), [Math Kangaroo 실제 시험 풀이](https://mathkangaroo.org/mks/practice/pdf-solutions/). `raw_youtube.txt`는 사용자 파일로 보존했다. 변경은 로컬 전용이며 push·배포·Drive 동기화는 없다.

### 2026-11-04 2018 AMC10A/12A 응답표 복구 및 연결

웹 검색으로 99CEF 2018 분석 보고서와 LIVE 공식 허가 아카이브의 2018 A형 원본·정답을 대조했다. 99CEF live URL이 2016 파일로 잘못 이동해 Internet Archive 저장본에서 2018 PDF를 회수했다. PDFKit 텍스트와 인쇄 p.11/p.22 이미지로 AMC10A·12A 각 25문항 응답표를 검수했다. 표본은 미국·캐나다 각각 40,839명 / 32,795명이다. AMC10A Q18 원문 답표에 키 표시가 없어 LIVE 키를 사용했다. 일부 행 합계가 어긋나는 문항은 수치를 고치지 않고 CSV에 보존하면서 앱 비교 조회에서 제외했다.

연도별 CSV 2개, 런타임 비교 레지스트리, 캐시 버전, 역사자료 README 및 증거 노트를 수정했다. 런타임 검증에서 정답 25개/폼과 분모·모집단을 확인했고, 이상 합계 문항은 null로 억제됨을 확인했다(AMC10A 표시 21문항, AMC12A 표시 20문항). `git diff --check` 통과. 변경은 로컬에만 있다. `raw_youtube.txt`는 건드리지 않았고 push·배포·Drive 동기화는 하지 않았다.

### 2026-11-04 2015 AMC10A/12A 글로벌 문항응답 자료 추가

웹 검색으로 99CEF의 2015 AMC10A/12A 분석 보고서를 찾고, 현행 원본 URL이 2016 보고서로 잘못 연결되는 문제를 확인했다. Internet Archive의 2016-04-06 보존 PDF를 회수해 macOS PDFKit으로 표를 추출했다. AMC10A p.11, AMC12A p.24의 글로벌 A–E 선택·미응답·판독불가율 25문항씩을 연도별 CSV와 조회 데이터에 반영했다. 같은 보고서의 점수분포 섹션에서 글로벌 표본 수 66,591 / 55,432를 대조하고, 정답 50개는 LIVE A형 키와 확인했다. 99CEF 원본 및 보존 URL, 검증 한계는 데이터 README에 기록했다.

`competition-paper-review.html`의 응답 데이터 캐시 버전을 올렸다. 변경 파일: `amc10-12-item-response-reference.js`, 2015 AMC10A/12A CSV 2개, `competition-paper-review.html`, 역사자료 README 및 이 인수인계. 양식별 25행·표본 수·응답률 합계를 확인하고 CSV 50행을 런타임 레지스트리 값과 대조했다. Node REPL에서 두 폼의 25개 조회·정답·정답 응답률을 검증했고 모두 통과했다. `git diff --check`도 통과. 로컬 커밋 완료. `raw_youtube.txt`는 건드리지 않는다. push·배포·Drive 동기화 없음.

### 2026-11-04 AMC12B 2013/2014 grade comparison added

GEMT annual AMC10B/AMC12B report text indexed by web search contained the AMC12B Global grade tables (printed p.13 in 2013 and p.12 in 2014). Added `amc12b-grade-means-2013-2014.csv`, exact-grade runtime lookup, and annual coverage rows. The PDF was not downloaded/rendered locally, so the data status and result-panel note explicitly identify it as web-indexed text, distinct from visually verified PDF tables. Taiwan values remain excluded. The 2014 Grade 11 count indexed as `17.303` was normalized to 17,303 after category counts reconciled with total n=33,247. 2013 group counts reconcile to total n=30,249, while the count-weighted subgroup mean 64.56 differs from printed overall mean 64.08; both are preserved and the mismatch appears in the result source note.

Grade 7/12 year/form-matched lookups are available; these are historical cohort means, not current level or percentile judgments. Focused runtime and browser validation passed for both 2013 and 2014 AMC12B Grade 11 result panels (2013 n=15,365; mean 63.47; 2014 n=17,303; mean 67.92 /150); 2013 source discrepancy is logged. Evidence is in `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. Local commit `b31451b73`; no push, deployment, or Drive sync. Web search now confirms the 2012 AMC12B original exam and MAA solutions are available, but has not recovered a national grade-mean table; see the latest search note in the evidence file. Preserve the untracked user file `raw_youtube.txt`.

### 2026-11-04 공식 웹 검색으로 연도별 AMC 원본 아카이브 재대조

사용자 지시에 따라 AMC 샘플 예시가 아니라 LIVE by Po-Shen Loh의 실제 기출 아카이브를 웹에서 확인했다. 아카이브는 MAA의 공식 법적 허가를 받아 실제 시험을 싣는다고 명시하고, 무료 인쇄용 PDF·온라인 풀이·문항별 professional solution을 제공한다. 웹 색인에는 AMC 8 41회(1985–2026, 2021 없음), AMC 10 52회(2000–2025), AMC 12 102회(1950–2025), AIME 71회(1983–2026)로 총 266회가 표시된다.

기존 `amc-original-source-catalog.csv`를 LIVE 색인과 재대조했다. 같은 266개 레코드가 있고 대회별 회차 수·연도 범위가 웹 색인과 일치한다. 중복 키 0개, 온라인 회차·인쇄 PDF·정답표·전문 풀이 링크 누락 0개다. 학년별 평균·점수 분포 자료는 별도 레이어이며, 원본 기출 보유량과 같은 뜻으로 취급하지 않는다.

로컬 문제 복습 화면의 연도 선택도 확인했다. AMC 12를 선택하면 1950–2025년, A/B 폼과 해당 회차의 시험지 PDF·정답표·전문 풀이·온라인 회차 링크가 표시되고, 문항별로 LIVE 원본 해설·개념 링크가 연결된다. 원본 답안 입력 후 GFIELD 창작 후속 모의고사로 이동하는 기존 흐름도 유지된다. 웹 원본의 문항·PDF는 복사하지 않고 권한이 표시된 LIVE 페이지로 연결한다.

출처: [LIVE 실제 AMC/AIME 원본 아카이브와 권한·회차 수](https://live.poshenloh.com/past-contests), [2025 AMC 8 인쇄 PDF·정답·문항별 해설 예시](https://live.poshenloh.com/past-contests/amc8/2025), [2025 AMC 10A 인쇄 PDF·정답·전문 풀이·문항별 해설 예시](https://live.poshenloh.com/past-contests/amc10/2025A), [MAA 대회 범위·형식·학년 자격](https://maa.org/student-programs/amc/). 검수는 공개 색인 대조와 로컬 브라우저의 2022 AMC 12 A 연도 선택/링크 표시를 포함한다. 로컬만 반영; push·배포·Drive 동기화 없음.

### 2026-11-04 MAA AMC 10·12 영역별 보충 세트 연결 및 연도 원본 목록 재점검

MAA 공식 Problem Sets 허브는 AMC 10과 AMC 12 각각 Algebra, Geometry, Probability, Functions, Number Sense & Theory의 5개 단원별 세트를 싣고, 각 상세 페이지에는 문제·풀이·확장 연습이 첨부되어 있다. AMC 8은 전략별 세트 8종이다. 오답 원인으로 개념/접근 아이디어를 선택했을 때 AMC 10·12는 해당 문항에 기록된 영역의 MAA 세트만 결과 화면에 보여 주도록 연결했다. 이는 오답 문항의 정답 풀이를 자동 분류한 것이 아니라고 분명히 안내한다. AMC 8은 접근 아이디어 오답에만 8개 전략 자료를 제안한다. AIME·다른 대회에는 이 AMC 자료를 표시하지 않는다.

연도 카탈로그를 구조적으로 다시 확인했다: AMC 8 41회(1985–2026, 2021 회차 없음), AMC 10 52개 A/B 원본(2000–2025), AMC 12/AHSME 102개 원본(1950–2025), AIME 71개 원본(1983–2026). 시험지·정답표·전문 풀이 URL 누락과 중복 키가 없다. 연도 수, 폼, 점수표 표본을 섞어 일반화하지 않는다.

수동 브라우저 검수: AMC 8 2022 접근 아이디어 오답 → 8개 전략 링크, AMC 10 2022 개념 오답 → 기록 영역에 맞는 Number Sense & Theory 링크 1개, AMC 12 2022 개념 오답 → AMC 12 영역별 세트 링크를 각각 확인했다. 기존 LIVE 연도별 시험지 인쇄·답안·전문 풀이 및 지필드 후속 모의고사 링크가 유지된다. `git diff --check` 통과. 테스트 스위트는 실행하지 않았다.

MAA 허브와 상세 페이지는 문제·풀이·확장 연습이 실린다고 표시하며, PDF 다운로드 전에 저작권 약관 동의를 요구한다. 파일을 복사하지 않고 공식 링크로 연결한다. 출처: [MAA Problem Sets 허브](https://connect.maa.org/viewdocument/problem-sets?CommunityKey=23b1e210-33fb-4cc6-b294-019eb20eba58&tab=librarydocuments), [AMC 10 Algebra 문제·풀이·확장](https://connect.maa.org/viewdocument/amc-10-algebra?CommunityKey=23b1e210-33fb-4cc6-b294-019eb20eba58&tab=librarydocuments). 로컬 변경만, push·배포·Drive 동기화 없음.

### 2026-11-04 MAA 공식 전략 세트를 AMC 8 오답 복습에 연결

MAA 공식 AMC 8 전략별 문제 세트 8종을 `competition-paper-review.html` 결과 화면에 연결했다. AMC 8에서 오답 이유를 ‘접근 아이디어’로 표시했을 때만 접을 수 있는 자료 영역을 보여 준다. 제목·원문 링크만 제공하고, 어떤 전략이 특정 문항의 풀이인지 자동 판정하지 않는다. 다른 대회 결과에는 AMC 8 전략 세트를 섞지 않는다.

수동 브라우저 검수: 2022 AMC 8에서 접근 아이디어 오답을 표시하면 8개 전략 링크가 보이고, 2022 AMC 10 같은 조건에서는 표시되지 않는 것을 확인했다. 기존 원본 시험지·정답·전문 풀이 링크와 GFIELD 창작 후속 연습도 같은 복습 흐름에서 유지된다. `git diff --check` 통과. 테스트 스위트는 실행하지 않았다.

코드: `boarding-school-math/competition/amc-maa-strategy-resources.js`, `boarding-school-math/competition-paper-review.html`, `boarding-school-math/competition-paper-review.js`, `boarding-school-math/competition-paper-review.css`. 외부 MAA PDF는 복사하지 않고 공식 페이지로 연결한다. 커밋 뒤 push·배포·Drive 동기화는 하지 않는다.

### 2026-11-04 MAA AMC 문제 세트 원문 검색·학습 연결 자원 목록

사용자 요청에 따라 웹에서 MAA Math Club Resource Hub를 검색해 AMC 8 전략별 문제 세트 8종을 찾았다: Work Backwards, Casework, Find a Pattern, Guess and Check, Make an Ordered List, Solve a Simpler Problem, Use Symmetry, Write an Equation. 각 MAA 항목은 문제 세트 PDF와 별도 해설 PDF가 첨부된 것으로 표시한다. 개별 공식 라이브러리 항목 URL은 `boarding-school-math/competition/amc-maa-strategy-resources.js`에 저장했다. MAA 자료실의 AMC 10/12는 Algebra, Geometry, Probability, Functions, Number Sense & Theory 내용별 세트도 함께 안내한다.

이 자료는 연도별 공식 시험지 목록과 구분한다. 실제 AMC 기출은 기존 `amc-original-source-catalog.csv`의 연도·폼·인쇄 PDF·정답·전문 풀이 인덱스를 계속 사용한다. 새 MAA 전략 자료는 오답 진단 뒤 전략 연습을 연결할 후보이며, 특정 과거 문항의 공식 태그/정답 근거로 보지 않는다. MAA 라이브러리에서 첨부파일 다운로드 전에 저작권 약관 동의를 요구하므로 이번에는 파일을 복사하지 않고 공식 항목 링크만 보관했다.

추가 웹 검색에서 AMC 8 2023–2026 전체 참가자 평균·컷은 확인되지만 최근 학년별 전국 평균표는 공개 검색으로 회수되지 않았다. 2024년 중국 지역 성적 자료는 별도 응시집단이고, 지역별 평균 또는 시험학원 표본을 미국 MAA 학년 기준으로 전환하지 않는다. 2022 `Location: Overall` 학년표와 오래된 연례 보고서의 기록 학년군 자료는 기존 모집단·연도 주의를 유지한다. MAA의 현행 AMC 설명은 AMC 8이 25문항·40분이며 비례 추론, 기하, 확률/조합, 그래프와 표 등 중학교 수학 범위라고 설명한다.

확인 출처: [MAA AMC 8 전략 자료실](https://connect.maa.org/viewdocument/amc-8?CommunityKey=23b1e210-33fb-4cc6-b294-019eb20eba58&tab=librarydocuments), [MAA AMC 문제 세트 색인](https://connect.maa.org/viewdocument/problem-sets?CommunityKey=23b1e210-33fb-4cc6-b294-019eb20eba58&tab=librarydocuments), [MAA AMC 8 공식 범위·형식](https://maa.org/student-programs/amc/), [연도별 실제 시험지 원본 아카이브 안내](https://live.poshenloh.com/past-contests). 링크와 첨부 표시를 수동 대조했다. 로컬 자료 목록만 추가, 원본 PDF 미복사; push·배포·Drive 동기화 없음.

### 2026-11-04 AMC 8 2022 MAA 학년 평균 이미지 회수·연도별 비교 연결

2022년 `Grade and Gender Average AMC 8 2022`의 `Location: Overall` 표 이미지를 川观新闻/南方窗 재게시 기사에서 회수했다. Apple Vision OCR 전사와 이미지 픽셀을 대조했다. Grade 5–8의 평균은 8.98 (n=3,231), 8.78 (n=14,258), 9.57 (n=22,493), 10.38 (n=29,236). `<=4` 및 `UNK`를 포함한 6개 표본 합계 71,017, 가중 평균은 9.69097로 보고서 전체 평균 9.69와 반올림 일치한다. 이미지가 `Overall`로만 범위를 표시하고 지리적 범위를 정의하지 않아 현재 미국·캐나다 규준이라고 하지 않는다. 불완전한 성별 합계는 사용하지 않는다.

Grade 5–8을 [`amc8-grade-means-2022-maa-overall.csv`](boarding-school-math/competition/historical-amc-grade/amc8-grade-means-2022-maa-overall.csv)와 `amc-historical-grade-reference.js`에 추가하고, 2022 AMC 8 coverage를 갱신했다. 결과 화면 cache key도 올렸다. 근거·OCR 원본 링크: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. `raw_youtube.txt`는 보존한다.

브라우저에서 2022 AMC 8 Grade 7을 열고 Q1에 임시 정답 A를 넣은 뒤 공개 정답표와 대조했다. 결과 화면에 응시 점수 1/25, 학년 평균 9.57점·참가자 22,493명, `Location: Overall` 범위, 재게시 출처와 모집단 주의가 함께 표시되는 것을 확인했다. 미응답 24문항은 복습 대상에 각 원본 문항·정답·개념 링크가 붙었고, 3문항 미만 영역 비율은 보류됐다. 이 입력은 브라우저 화면 임시 상태이며 저장하지 않았다. 연도별 시험지·정답·전문 풀이 링크도 선택 화면에서 확인했다. `git diff --check` 통과; 실제 문항 분석·브라우저 클릭 검수 외 테스트 suite는 실행하지 않았다.

### 2026-11-04 AMC 8 2016 보고서 본문·2022 학년 자료 재검색

2016 MAA 통계 메뉴의 AMC 8 보고서 ID 63은 확인했지만, 보존 페이지의 ReportViewer 본문은 복구되지 않았다. 99CEF 연도 요약 PDF와 MAA Michigan Section 뉴스레터는 전체 평균만 싣고 학년별 행은 제공하지 않는다. 이 두 출처의 2016 응시자 수(108,227 / 108,295)가 달라 그대로 분리한다. Bard Math Circle 2016 결과는 지역 행사 n=35라 전국 학년 비교에서 제외한다.

2022년 단일 Grade 5 인용값과 모집단 불명 상태를 먼저 확인했지만, 다음 검색에서 동일 기사에 임베드된 MAA `Overall` grade-average 이미지가 연결된 것을 찾아 회수·전사했다(상단 기록 참조). 로컬 변경만; `raw_youtube.txt`는 기존 미커밋 파일로 보존한다.

### 2026-11-04 AMC 8 연도별 학년 통계 웹 검색 추가 확인

AMC 8 2012–2016의 전국 학년별 평균을 검색했다. 2014·2015·2016 결과로 보이는 Bard Math Circle 게시물은 해당 행사/연계 프로그램 응시자 평균(예: 2016 n=35)으로 확인되어 국가·글로벌 학년 기준에 넣지 않았다. 2015 SchoolReport PDF 검색 결과도 개별 싱가포르 학교 보고서라 제외한다. MAA Michigan Section 뉴스레터는 2015(전체 평균 8.55, 참가자 149,277)와 2016(전체 평균 9.36, 참가자 108,295)의 전체 응시 요약을 싣지만 학년별 평균은 없다. 기존 99CEF 연도표의 참가자 수(2015 149,844; 2016 108,227)와 차이가 있어 각 출처 숫자는 해당 출처의 값으로 보존하고 임의로 합치지 않는다.

검색 출처: [Bard 2014](https://www.bardmathcircle.org/p/2014-amc-8), [Bard 2015](https://www.bardmathcircle.org/p/2015-amc-8), [Bard 2016](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in), [MAA Michigan 2015 report](https://sections.maa.org/michigan/newsletters/Vol42no2_Spring_2016.pdf), [MAA Michigan 2016 report](https://sections.maa.org/michigan/newsletters/Vol43no2_Spring_2017.pdf). 개별 학교/행사 표본과 전체 참가자 요약은 전국 학년별 비교에 대용하지 않는다. 이 조사에서 2011–2016 AMC 8 전체 학년별 국가 평균표는 회수되지 않았다. 원본 시험지의 연도별 카탈로그와 학년 기준 데이터 범위는 기존 상태를 유지하며, 새 통계 행은 추가하지 않았다. `raw_youtube.txt` 보존; 로컬 변경만, 외부 동기화 없음.

### 2026-11-04 AMC 8 2011 MAA 보고서 경로 재검색

재검색한 MAA 보존 페이지 제목은 `2011 General Statistics`이며, report/location 선택 메뉴에 Overall, Grade and Gender Average, Contest Score Grade Report with Percentile가 있었다. 다만 Internet Archive CDX에서 2011 `statestatistics` 산출물 경로를 전체 검색한 결과, 보존된 Overall 파일은 Achievement Roll과 School Honor Roll뿐이었고 Grade and Gender Average 및 score-by-grade-percentile PDF는 회수되지 않았다. 그래서 AMC 8 2011 전국/글로벌 평균이나 학년 percentile을 만들지 않고 coverage 상태 `no-grade-table-recovered`를 유지한다. 검색에 나타난 개별 학교 성적표는 n=50 등 학교 표본이라 전체 학년 비교에 합치지 않는다. 메뉴의 navigation text에는 `2010 Statistics`도 남아 있으나 본문 `2011 General Statistics`와 구별한다.

근거 페이지: [MAA 2011 통계 페이지 보존본](https://web.archive.org/web/20130204052822/http://amc.maa.org/amc8/2011/stats/2011-amc8stats.shtml). 이어서 회수 가능한 MAA global report 또는 전체 보고 집단 score-by-grade 자료를 연도별 검색한다. 로컬 문서 기록만; 통계 데이터 추가 없음. `raw_youtube.txt` 보존.

### 2026-11-04 AMC 8 2010 MAA 학년 평균 연결

Internet Archive의 MAA 원래 호스트 보존본에서 2010 AMC 8 `General Statistics` 페이지의 전체 평균(9.98), 응시자 153,211명, 결과 제출 학교 2,342곳과 5–8학년 평균·인원을 확인했다. 4개 학년 표본 수는 150,616명이고 2,595명은 표의 학년 구간에 배정되지 않는다. 네 행을 `amc8-grade-means-2010.csv`와 `amc-historical-grade-reference.js`에 연결해 원본 점수 입력 후 같은 시험연도·기록 학년의 평균 비교를 열 수 있게 했다. 이 자료는 학년별 평균이지 점수별 분포나 백분위표가 아니다. AMC 8 2011 글로벌 학년 기준 자료는 아직 회수되지 않았다.

자료 출처: [MAA 2010 AMC 8 통계 페이지 보존본](https://web.archive.org/web/20130707194038/http://amc.maa.org/amc8/2010/stats/2010-amc8stats.shtml). Focused Node 검증 6/6 통과: 2010 exact-grade 조회, 참가자 합계, 2010 전체 요약 및 source URL. 2010 결과 패널의 브라우저 테스트는 추가했으나, 현재 셸의 Node 환경에 Playwright 모듈이 없어 실행하지 못했다. localhost에서 2010 원본 연도 선택과 답안 입력 화면은 열리는 것을 확인했지만, 결과 패널의 실제 렌더 검수는 남아 있다. `raw_youtube.txt`는 보존한다. Local only; no push, deployment, or Drive sync.

### 2026-11-04 · 2011 AMC 10/12 MAA 원본 통계 회수

- 웹 검색에서 당시 MAA 경로의 [2011 AMC 10/12 Grand Statistics PDF](https://web.archive.org/web/20130124025158/http://amc.maa.org/amc1012/2011/stats/11AMC1012-grandstats.pdf)를 찾아 원본 호스트의 Internet Archive 보존 여부를 확인했다. 내려받은 2쪽 PDF에서 Apple PDFKit 텍스트 추출로 전체 평균·공식 응시자 수·학년별 평균과 표본 수를 확인하고, 기존 Scribd 사본의 4개 시험형 22개 행과 대조했다.
- 2011 AMC 10 A/B 평균은 67.7/72.2, AMC 12 A/B는 66.8/64.9. 공식 응시자 수는 각각 70,919 / 33,723 / 74,665 / 30,846명이며 보고서의 비공식 응시자는 합산하지 않았다. 기존 같은 연도 학년별 평균 22행의 출처를 MAA 원본 호스트 보존본으로 갱신했고, 결과 참조에 전체 평균 4개 행도 추가했다. 새로 확인한 자료는 시험연도 통계뿐이므로 학년별 점수 등급이나 백분위로 바꾸지 않는다.
- 검수는 PDF 추출 텍스트와 CSV·참조 모듈을 대조하는 범위로 수행한다. AMC 8 2010–2011 글로벌 점수×학년 상세표는 이번 검색으로 확보하지 못했다. 2010 일부 행이나 초기 집계는 전국/최종 결과표로 승격하지 않았다. 기존 `raw_youtube.txt`는 보존한다. 로컬 변경만; push, 배포, Drive 동기화 없음.

### 2026-11-04 AMC 웹 조사 후속 · 연도별 기준선 앱 반영

2012–2016 AMC 10/12 A/B 20개 회차의 평균·상위 1% 기준을 [IvyTrack 연도별 결과표](https://www.ivytrack.org/forum.php?action=printable&mod=viewthread&tid=19383)와 [Math Gold Medalist AMC 10](https://mathgoldmedalist.com/competitions/amc-10)/[AMC 12](https://mathgoldmedalist.com/competitions/amc-12) 연도표에서 교차 확인해 `amc-score-distribution-reference.js`에 연결했다. 2018 AMC 12 B는 처음 보류했으나 추가 표에서 DHR 126·Top5 99·평균 57.85가 일치해 포함했다. 서로 값이 섞인 AMC 10 B 수치는 적용하지 않았다.

2021 가을 AMC 10/12는 출처 충돌이 있는 평균을 앱에서 제외했다. AMC 12 B DHR도 재인용 값이 130/130.5로 달라 비워 두고, 맞는 Top5 값만 표시했다. 이 2012–2021 행은 MAA 원본 결과표 파일을 직접 회수한 상태가 아니라 제3자 연도별 재인용이다. 표본·학교 수·표준편차를 만들지 않았고, 학년별 규준이나 개인 등급으로 부르지 않는다. 결과 화면에서 재인용 범위와 가능한 교차 출처 링크를 노출한다.

검증: 번들 Node REPL에서 AMC 10/12 2012–2016 양식 각 10행, 2007–2010 MAA 전체 평균 16개, 2018 AMC 12 B, 2021 가을 충돌 필드의 부재와 83개 데이터 행의 알려진 기준점 순서를 검사했다. 모두 통과했고 `git -c core.whitespace=cr-at-eol diff --check`도 통과. 브라우저에서 2016 AMC 10 B 원본 선택을 확인해 PDF·정답표·전문 풀이·문항별 풀이 링크를 대조했다. 결과 보기 상호작용 후 통계 패널 표시는 이번 검수에서 확인되지 않아, 연도별 기준 비교의 화면 렌더 검수는 남아 있다. `raw_youtube.txt`는 미추적 상태로 보존. 다음: 2000–2006 AMC10/12 통계의 MAA 연례 보고서 값과 재인용표를 연도별로 대조하고, 2021 가을 충돌은 MAA 원본 리포트가 확보될 때 재검토한다. AMC 원본 시험지 카탈로그는 [266회 인벤토리](boarding-school-math/competition/amc-original-source-catalog.csv)에 연도·폼·인쇄 PDF·정답표·전문 풀이 링크로 기록돼 있다.

커밋·배포 상태는 아래 Git 로그/현재 상태를 확인한다. 로컬 변경만이며 push, 배포, Drive 동기화 없음.

### 2026-11-04 AMC 8 2018–2019 score reports added to year-specific review

Web search recovered the 2018 MAA AMC 8 Contest Score Report PDF and a 2019 MAA score-report image reproduced by IvyTrack. Added the printed top 1/5/25/50/75% cut scores and report sample statistics for both years; no top 2.5% or top 10% values were invented. The 2019 report is dated 2020-01-01 and a separate reproduction reports a slightly different participant count, so the product keeps the 94,675 count attributed to the MAA report copy and clearly labels third-party reposts. Neither row is called a grade-level norm.

The AMC 8 comparison now has 2018, 2019, 2022–2026 report rows. 2022 only shows the five thresholds printed in its report image. Updated asset versions because the modified reference and UI scripts retained old cache keys. In the browser, selected 2022 and entered its LIVE answer key (25/25); the panel showed its five cut lines, 71,143 report sample, 1,759 schools, date, secondary-source note, and source link. Then selected 2019 and used LIVE's published answer key to verify the same five-boundary flow, the 94,675 / 1,869 sample values, average 9.43, SD 4.46, report date, and year-specific repost label. Reset all test marks; no diagnostic was saved. Node REPL assertions verified 2018/2019/2022 values, report samples, dates, and absent thresholds. `git diff --check` passed; committed locally as `4ff5a2cd`.

Evidence and source scope: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. Next: continue web search by contest year and form; keep score-distribution report rows, grade-specific samples, and award cutoffs in distinct categories. Local only; no push, deployment, or Drive sync.

### 2026-11-04 AMC 8 2010 문항 응답 통계 검색·진단 연결

웹에서 AMC Study의 2010 AMC 8 난도표 게시물을 확인했다. 표가 MAA 공개 자료라고 명시하고 153,211명 응답의 A–E 선택·공란·판독불가·정답률을 제시한다. Apple Vision OCR 후 원본 이미지와 대조하고 LIVE 공개 정답 키의 25개 답을 교차 검증했다. `amc8-2010-item-response-percent.csv`와 `amc8-item-response-reference.js`를 추가했으며, 2010 AMC 8에서만 복습 목록의 오답/미응답 옆에 해당 집단 정답률과 학생이 입력한 오답 선택지의 집단 비율 또는 최다 오답을 표시한다. 표의 빨간 예측 표시와 사교육 기관의 적중 주장 데이터는 가져오지 않았다. 출처는 MAA 원본이 아닌 제3자 재게시이며, 전체 응시자 문항 통계이지 학년별 비교·현재 규준·학생 등급이 아니다. 연구 근거와 제한: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. 검수: 번들 Node REPL에서 25개 CSV/lookup 행 일치, 응답 비율 합계(반올림 오차 ±0.12% 이내), 2010 외 연도·26번 경계 거부, Q3의 오답 B 20.97% 및 정답률 64.41%를 확인했다. 로컬 브라우저에서 실제 Q3 답 B·오답 처리 후 결과 화면에 집계와 원본 풀이 링크가 함께 뜨는 것을 확인했고, 테스트 입력은 새로고침해 지웠다. `git diff --check` 통과. 전체 Playwright suite는 이 작업에서 실행하지 않았다. Local only; no push, deployment, or Drive sync.

### 2026-11-04 한국 AMC 8 학년 평균 결과 화면 연결

- 앞선 웹 검색의 [2009 한국 AMC 8 결과](https://www.amcstudy.net/43), [2011 한국 AMC 8 결과](https://www.amcstudy.net/79) 표를 연도별로 재확인했다. Grade 5–8의 평균·응시 인원은 해당 페이지가 보고한 한국 응시집단으로만 보존한다. MAA 2009 연례 보고서의 국제 범위가 혼합된 보고학교 집계와 섞지 않는다.
- `competition/amc8-korea-grade-mean-reference.js`를 추가하고 원본 시험 결과에 같은 연도·학년 한국 평균과 점수 차이를 표시한다. 2009/2011 외 연도와 Grade 4 이하는 매칭하지 않는다. 전체 741/899명과 학년표 737/894명의 차이 4/5명은 화면에 명시한다. 비교는 과거 집단 평균이며 능력 등급이나 현재 규준이 아니다.
- `competition-paper-review.html/js`에서 출처 링크 및 패널을 연결했다. 브라우저에서 2011 AMC 8 Grade 7 Q1의 답 E를 넣고 공개 정답표와 대조한 뒤 결과 화면에서 한국 Grade 7 평균 13.92, 표본 315, 입력 점수와 차이, 미기재 5명과 출처 링크를 확인했다. 이후 페이지를 새로고침해 테스트 답을 초기화했으며 복습 요약을 저장하지 않았다.
- 추가 웹 검색은 MAA 2009 25주년 보고서 사본의 Table 2가 2003–2009 기록 학년군 평균표임을 재확인했다. 이는 기존 `amc8-grade-means-2001-2009.csv`에 이미 반영된 별도 MAA 보고학교 집계이고, 첫 그룹은 4–5학년 묶음이다. 2009 결과표는 분포 인원이 연례 보고서와 교차 확인되지만 한국 결과는 별도 코호트다. 이 조사로 신규 전국 행을 추가하지 않았다.
- `git diff --check` 및 결과 UI의 실제 답안 대조·렌더 검수 완료. `raw_youtube.txt`는 사용자 파일로 보존한다. 로컬만 수정; push/배포/Drive 동기화 없음.

# Current handoff — 2026-11-04

### 2026-11-04 web-recovered 2009 AMC 8 global grade score distribution

Web search located a full 2009 AMC 8 score-by-grade table transcribed from the MAA result report in a contemporaneous forum thread. Added all 104 score×grade-group cells (0–25 for grades 4–5, 6, 7, 8) to `boarding-school-math/competition/historical-amc-grade/amc8-2009-global-grade-score-counts.csv`. The MAA annual-report sample counts and averages independently reconcile for every group: 3,874/9.45, 20,688/9.17, 50,218/10.08, 73,220/10.82. The source's first `5th Grade` heading is labeled 4–5 in the product because its count matches the MAA annual report's grouped 4–5 row; it is never split into invented Grade 4 and Grade 5 values.

The original-paper review now has a distinct 2009 MAA all-reporting-schools reference panel, separate from the Korea-cohort panels. It shows the fraction of that recorded-grade group with strictly lower scores, derived from the score counts; it is not presented as an official percentile, present-day norm, or ability level. It only returns for grades 4–8 and the 2009 AMC 8. Sources, scope, and transcriptions are recorded in `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`.

Validation: all 104 counts sum to the published grade totals and all four weighted means reproduce the annual report; Grade 7 score 21 returns 49,598/50,218 (98.77% strictly lower). Grade 3 and unsupported years return no result. The focused Node test command could not launch because shell `node` is absent; the reference module and CSV checks were run in the bundled Node REPL. The current localhost review screen was opened and inspected; the initial screen correctly shows the actual 2009 paper PDF, answer key, and solutions links. Full answer-entry/result panel browser QA remains to be repeated after rendering a completed review. Local only; no push, deployment, or Drive sync.

### 2026-11-04 AMC 8 historical-statistics web search follow-up

Searched for the missing 2010–2011 AMC 8 grade statistics and cross-checked the actual 2010 MAA AMC 8 paper PDF (25 items, 40 minutes, no calculator). Recovered the old MAA 2011 stats-page and Grade and Gender Average PDF paths; the archived score page is described by a contemporaneous secondary citation as an early sample (~1,300 schools, ~84,000 participants), and the current MAA host returns 403. The old PDF body / full grade-by-grade score table could not be retrieved and verified in this pass. The complete Korea-only 2011 grade mean table (899 students; 5 unrepresented in listed grade groups) was confirmed at `amcstudy.net/79`; it was already staged as a separate Korea cohort. No Korea or school-level table was substituted for a national norm. Likewise, partial 2010 grade-by-score rows were not extrapolated. Evidence, source links, and boundaries are recorded in `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. No statistical coverage row was promoted; 2010/2011 AMC 8 still need a retrievable, complete source table. Local only; no push, deployment, or Drive sync.

### 2026-11-04 retrieved 2010 AIME grade score distributions

Web search recovered the MAA-authored 2010 AMC 10/12 annual summary copy. Table XIII gives 0–15 score counts by grade for AIME I and II. Added a separate exact-grade lookup for Grade 8–13, checked every grade-column total against the report participant totals (3,618 for I; 2,904 for II), and connected a same-year/form/grade historic comparison to completed AIME paper review. The displayed derived value is only the share with a strictly lower score; ties are shown separately and it is not labeled a reported percentile, present-day norm, ability rank, or qualification. Grouped `≤7` is not split into invented exact grades. Source and boundaries: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. Unit checks pass 3/3; the full contest review browser suite passes 31/31. Coverage manifest retains 266 paper rows. `git diff --check` passes. The report copy is hosted at Scribd, not verified on a primary MAA host. Local only; no push, deployment, or Drive sync.

### 2026-11-04 AMC original-paper result-to-explanation link

The year/form catalog continues to point to the MAA-authorized LIVE archive for printable original papers, answer keys, and professional solutions. A reviewed AMC 8 2024 paper page exposes question-level concepts, hints, and written/video solutions. The review form already linked each numbered response to its source question; the result's wrong/blank list now repeats a direct source link for each missed question, so the learner can move from diagnosis to the original explanation without searching for the number again. It preserves the year/form/question route and then retains the GFIELD-authored similar-practice action. No original prompt or solution is stored locally.

Web-search audit for grade comparison: MAA-authored summary copies already staged contain national/combined cohort grade means for AMC 8 2001–2009 and AMC 10/12 2007–2011. Search results for 2013–2015 AMC 8 grade means surfaced individual school/Math Circle reports, including records with student names; those are not national grade norms and were not imported. The national AMC 8 grade-mean gap after 2009 remains open. Keep exact-year competition score references, grade means, Korean participant cohorts, and individual school samples separate. Sources reviewed: [LIVE AMC 8 2024](https://live.poshenloh.com/past-contests/amc8/2024), [MAA AMC 8 2009 annual report copy](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html), [2015 AMC 8 school report example](https://asiamathsalliance.com/2015/amc8/03057F.pdf), [Bard Math Circle 2014 result](https://www.bardmathcircle.org/p/2014-amc-8).

Verification: the targeted Chromium test `yearly AMC originals expose print, answer entry, and local self-marking` passes 1/1 and now asserts the missed Q1 result links to the matching 2023 AMC 8 original explanation route. `git diff --check` passes. No student answer is saved with these links. Local only; no push, deployment, or Drive sync.

### 2026-11-04 web-researched AMC year-by-year original-source catalog

The LIVE by Po-Shen Loh archive was searched and reconciled against the app's route builder. Added `boarding-school-math/competition/amc-original-source-catalog.csv` with 266 individual contest routes and companion URLs for each original exam PDF, answer page, and solutions page: AMC 8 41, AMC 10 52, AMC 12 102, and AIME 71. The matching scope, route exceptions, product flow, and citations are in `boarding-school-math/docs/AMC_YEARLY_SOURCE_CATALOG.md`.

The contest review page now has separate year/form-specific links for printable source paper, answer key, professional solutions, and the online contest page. Each numbered item still opens that year's source explanation/concept page; the result can pass marked wrong/unanswered items into a GFIELD-authored practice route. Copy now says “public answer key/solutions” rather than mislabeling LIVE's curated professional solutions as MAA-authored. No contest question, answer key, or worked solution is copied into GFIELD.

Verification: parsed the current LIVE index and matched all 266 contest route IDs exactly to the CSV. The route model was checked in the Node REPL for all four archive totals, 266 total sessions, companion URLs, invalid forms, and representative paper URLs. The existing localhost G·MAP review page opened in the browser and displayed the 2025 AMC 10 A-specific print/answer/solutions/online actions and numbered explanations. Six representative PDF/answer/solution endpoint sets across AMC 8, AMC 10, AMC 12/AHSME, and AIME returned HTTP 200. `git -c core.whitespace=cr-at-eol diff --check` passed. The automated Playwright suite could not be launched from the shell because its `node` executable is unavailable there; no full test suite is claimed. Existing untracked `raw_youtube.txt` is preserved. Local only; no push, deployment, or Drive sync.

Next: investigate recoverable MAA legacy grade-report bodies, year/form by year/form. Keep the report-type inventory separate for grade means/counts, per-score grade percentiles, and all-participant thresholds; do not convert older means into grade ranks.

### 2026-11-04 historical AMC grade data retrieved from web sources

Corrected the prior blanket wording about historical grade comparisons. MAA-authored annual reports contain actual grade-specific results: the 2008 and 2009 AMC 8 summaries give participant counts and mean scores for recorded Grades 4–5, 6, 7, and 8 across contest years 2001–2009; the 2010 AMC 10/12 summary gives 2007–2010 AMC 10 A/B and 2010 AMC 12 A/B grade-specific mean/counts, plus AIME I/II grade score distributions. MAA's archived legacy statistics page defines a per-score grade report with grade counts and percentile ranks. Contemporary Korean result reproductions now supply one complete 2011 AMC 8 South Korea score-by-grade percentile table and 2009 score-by-grade counts. 2011 counts reconcile (72/252/315/255; five additional participants had unknown grade); 2009 counts reconcile to 737 grade-recorded of 741 total. Both are secondary transcriptions; do not expose in student-facing comparisons until primary MAA source and calculation method are confirmed. The interactive legacy report bodies remain unrecovered for a complete year/form inventory. Full tables and provenance are in `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md` and `boarding-school-math/competition/historical-amc-grade/`.

The exact year/form original-paper inventory is complete for the public LIVE index. Historic score-statistics inventory remains separate: record each source as `grade mean/count`, `grade score distribution/percentile`, or `all-participant distribution`; do not derive or display student grade bands from AMC 8 annual means. For same-grade AMC percentile comparisons, first recover each complete legacy per-contest grade report and confirm its scope/denominator. Original AMC problem material remains linked to the LIVE archive; do not copy its questions/solutions into GFIELD.

Repository: `/Users/docssam/Developer/GFIELD/continuations/boarding-school`, branch `codex/boarding-g7-nsa-mac-20261017`. The map-stop readability and G·MAP palette updates are committed locally. No push, deployment, or Drive synchronization has occurred.

### 2026-11-03 Grade 9 annual resource-route verification

Commit `296bb8a56` adds Grade 9 links for GFIELD Algebra 2, Geometry, AMC 10, SAT foundation review, College Board SAT practice, and GFIELD Precalculus. The existing annual-plan note keeps the route school-dependent and asks families to match each resource to the learner's current course and prerequisites. AMC 10 and SAT return paths preserve Grade 9. The initial broader browser run caught a stale assertion that Grade 9 must have no links; it now asserts the actual route list and school-course note instead.

Verification: the Grade 3–12 roadmap/model, roadmap browser, SAT foundation, and workbook browser suites pass 109/109 on bundled Mac Node, Playwright, and Chrome. Direct local Chrome renders at 1440px and 390px show the four annual stages, all seven linked resources, the school-course caveat, no horizontal overflow, and no page errors. Screenshots are in `/tmp/gfield-grade9-desktop.png` and `/tmp/gfield-grade9-mobile.png`. The shared renderer presents mathematical fractions as stacked numerator, bar, and denominator; slash notation remains for rates and units. No private candidate content was opened. Local only; no push, deployment, or Drive sync.

Follow-up: from the 390px Grade 9 AMC 10 practice view, clicking the visible in-content “별도 복습 경로” opens manual paper review with Grade 9 and AMC 10 selected. The Grade 9 back-to-roadmap route is preserved. The browser assertion also documents why this uses the in-content link: the mobile header hides the desktop review link.

Follow-up: the Grade 9 growth-map stages now link the same original AMC 10/SAT resources as its annual plan, plus the current official MAA/College Board references. The final “next course” stage opens GFIELD Precalculus with a prerequisite check. Model/browser assertions and direct Chrome renders at 1440px/390px confirm all links, the school-course caveat, no page overflow, and no browser errors. The mobile view wraps every link inside the stage card.

### 2026-11-03 Grade 7 `7.NS.A` public contract regression

Revalidated only the public diagnostic/workbook contracts after the roadmap updates; private candidate content was excluded. The diagnostic remains answer-free, locked, non-placement, and dependent on four bound teacher reviews before a score projection. The public student workbook continues to provide its separate 36-item practice plus eight-item recheck.

Verification: nine public Node test files pass 65/65, covering the shared diagnostic engine, immutable release references and gates, granular focus analysis, report projections, teacher-review readiness, the Grade 7 workbook's exact rational/decimal checks, and the learning-delivery boundary. No private item file or student record was opened. Local only; no push, deployment, or Drive sync.

The Grade 7 learner plan and public course path also pass 22/22 focused browser/model checks. The student action opens the released `7.NS.A` workbook; the teacher action opens its separate teacher edition; the plan does not fabricate a learner score, weakness, or diagnosis while the private screener remains unreleased. The Pre-Algebra concept flow retains the six requested Unit 1 ideas in curriculum language and uses the shared stacked-fraction renderer.

### 2026-11-03 public contest review and analysis regression

Verification: six focused contest-profile, original-practice, paper-review browser/model, and AMC score-history suites pass 52/52. The Grade 9 AMC 10 path returns to the selected grade; manual paper review separates item/domain evidence, requires enough classified responses before comparing areas, and keeps reported score references distinct from official qualification. The original GFIELD practice remains explicitly non-diagnostic. Local only; no contest question bank or answer key was added or copied.

### 2026-11-03 GFIELD SAT Math foundation review for Grades 6–10

Added `boarding-school-math/sat-foundation-practice.html` with twenty original questions sampling all four College Board SAT Math domains: Algebra, Advanced Math, Problem-Solving and Data Analysis, and Geometry and Trigonometry. The set includes unit rates/proportions, percentages, linear and nonlinear relationships, measures of center, probability, sample claims, angles, area, circles, and volume. Each question includes five choices, a hint, worked reasoning, and a transfer question; the four Advanced Math questions are marked as optional extension. Grade 6 and Grade 7 annual SAT stages link this bridge before official practice. Grades 8–10 also link it as foundation review, preserve the selected grade on return, and continue to College Board practice. Grade 9 annual links label Algebra 2, Geometry, Precalculus, AMC 10, and SAT material as optional references matched to an inferred plan and school prerequisites; the original AMC 10 and SAT review routes retain Grade 9 when returning. Grade 10 AIME practice and MAA eligibility references sit in the 4–6 month AIME stage; the 7–9 month SAT stage links GFIELD review, Precalculus, Khan Academy, Bluebook, and the Student Question Bank. Domain filters, answer retries, and reset work without storing learner records. This samples selected skills only; it is not an official SAT form, complete course, diagnosis, score, readiness, or placement decision. No official questions were copied. References: College Board [content domains](https://satsuite.collegeboard.org/practice/content-domains), [SAT Math overview](https://satsuite.collegeboard.org/sat/whats-on-the-test/math/overview), and [Student Question Bank](https://satsuite.collegeboard.org/practice/student-question-bank/math).

Design note: `boarding-school-math/docs/SAT_FOUNDATION_PRACTICE_DESIGN.md` records the learner need, observable outcomes, intended platform, scope, boundaries, and evaluation plan. The shared fraction renderer shows numerator/fraction-bar/denominator forms in prompts, choices, hints, and solutions. A mobile title wrap found in the first screenshot was corrected; 1440px and 390px captures show all questions, no horizontal overflow, and no browser errors.

Verification: bank answer/scope contract, Grade 6/7 route, fractions, interaction, and roadmap link tests pass. The full relevant Grade 3–12 roadmap/model + browser suite and SAT bridge suite passes 59/59 using bundled Mac Node, Playwright, and Chrome. `git -c core.whitespace=cr-at-eol diff --check` is used for the CRLF `package.json`. No private item or learner data was opened. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Grade 7 contest branch follows the selected program

Replaced the fixed AMC 8 optional card with a program-aware card. Grade 7 selection now routes Math Kangaroo to its official Grade 7–8 practice PDFs, AMC 8 to the existing GFIELD 10-item practice, AMC 10 to the original GFIELD 12-item topic practice, and SASMO to its materials page. Changing the competition selector updates the card immediately. Each destination is labeled as official source material or GFIELD-authored practice, without treating it as a score diagnosis or level placement. The shared math renderer on the roadmap and workbooks continues to show numeric fractions as a stacked numerator, fraction bar, and denominator; `/` remains for unit rates and program labels such as AMC 10/12.

Verification: bundled Mac Node syntax checks pass. The Grade 7–12 roadmap browser suite passes 44/44, including the Grade 7 program-switch behavior and existing stacked-fraction rendering; the grade roadmap model passes 12/12. A follow-up test passes for a direct `?grade=7&program=kangaroo` visit, and local Chrome screenshots of the new card at 1440px and 390px show the correct official Grade 7–8 URL and no document overflow. The `git diff --check` for the first commit passed; follow-up test/doc edits remain local. No private candidate material opened, no push, deployment, Drive sync, or external API call.

### 2026-11-03 roadmap fraction typography

Connected the roadmap’s remaining learner-facing lesson, annual-plan, course-comparison, and algebra example text to the shared math-text renderer. Numeric fractions now use a stacked numerator and denominator with a horizontal rule instead of slash notation wherever those strings are rendered. A live local Chrome check of the Grade 7 roadmap’s Algebra 1 content found two stacked fractions (`8/3` and `14/3`) and no remaining numeric slash-fraction text in that section. A separate renderer spot check confirmed `1/2` and `3/4` render as inline grids while unit rates (`km/h`, `달러/회`) and `AMC 10/12` remain unchanged. No browser errors. Local only; no push, deployment, or Drive sync.

### 2026-11-03 roadmap and Pre-Algebra regression follow-up

Updated the roadmap browser assertions to match the current four-unit Pre-Algebra route: 14 student/teacher workbook links, 27 lessons and practice pages, and 27 teacher answer pages. The A4 check now restores screen media before changing the edition selector, because that control is correctly hidden in print media. This is test maintenance only; curriculum and item data did not change.

Verification: the selected grade-roadmap model/browser, Pre-Algebra course/pathway, and teacher-paper suites pass 75/75 using bundled Mac Node, Playwright, and Chrome. The browser coverage includes cross-grade comparisons, MAP norm-matched percentile rules, same-date/same-paper contest comparisons, Math Kangaroo's grade-band restriction, Grade 7 checkpoint/workbook routes, mobile widths, stacked fractions, A4 page fit, and separate teacher answers. `git diff --check` passes. Local only; no private candidate content opened, no push, deployment, or Drive sync.

### 2026-11-03 Grade 7 learning plan opens its current GFIELD workbook

The Grade 7 student's primary action now opens the released GFIELD 7.NS.A student workbook directly; the teacher view opens its teacher guide. The plan and notice say the personal diagnostic and result-based level comparison are under review; the selected study topic is explicitly learner-chosen and does not imply a weakness or grade level. Corrected the Korean topic sentence so labels ending in “빼기” do not receive the wrong subject particle. The shared workbook display was rechecked in Chrome: numeric fractions appear stacked, with zero slash-form fractions in student content.

Verification: the full learning-plan browser suite passes 10/10 using bundled Node, Playwright, and installed Chrome; student and teacher CTA destinations are asserted separately. A fresh live 1280px render shows the direct student-workbook link, review-status copy, corrected selected-topic sentence, and no horizontal overflow. Existing diagnostic and level comparison remain gated. Local only; no private candidate content opened, no push, deployment, or Drive sync.

### 2026-11-03 GFIELD Pre-Algebra Unit 3 · rational-number operations

Extended the original GFIELD Pre-Algebra workbook to three units: 20 lessons and 40 practice prompts. The new Grade 7 `7.NS.A.1–3` unit covers additive inverses and number-line models; rational addition, subtraction, multiplication, and division (including the zero-divisor restriction); terminating/repeating decimal representations; and signed-rational word problems. The public route links to the original student workbook and separate teacher solutions. Course counts, scope, route, README, and browser/contract expectations now match. It remains instructional material, not a diagnostic, mastery claim, or grade placement.

During answer review, corrected a subtraction practice key: the distance from −3 to −8 is 5, not 8. Added a regression assertion for the corrected key. The focused Node REPL contract run passes 8/8 across the Pre-Algebra course, course pathway, and shared fraction renderer. Local Chrome shows the 20 lesson and 20 practice pages in student edition, 20 answer pages in teacher edition, and zero overflowing A4 page cards. Student pages show stacked numerator/fraction-bar/denominator forms, no slash-form numeric fractions, and zero visible numeric-fraction matches in text pages. A student A4 screenshot was reviewed; a physical PDF export was not generated. No push, deployment, Drive sync, or external transmission.

### 2026-11-03 GFIELD Pre-Algebra Unit 4 · ratios and proportional relationships

Added seven lessons and fourteen practice prompts for Grade 7 `7.RP.A.1–3`: ratio meaning and order, equivalent ratios, unit rates, unit conversions, proportional tables/equations/graphs, percent applications, and nonproportional models. The unit is linked from the Pre-Algebra route alongside the existing reviewed 7.RP.A unit workbook. Course comparison, public resource counts, workbook selectors, and cache versions now report four authored units, 27 lessons, and 54 practice prompts. Updated the shared fraction boundary so a numeric fraction may begin next to Korean text correctly while a Korean-labeled unit rate such as `2.50달러/병` remains plain text; numeric fractions stay stacked. Regression test checks `km/h`, `AMC 10/12`, `2.50달러/병`, and `300원/개` preservation alongside real stacked fractions.

Focused Node REPL contract run passes 9/9. Local Chrome confirms the full student workbook shows 27 lesson and 27 practice pages, the teacher edition shows 27 answer pages, all page cards fit their A4 bounds, and neither edition leaves slash-form numeric fractions. The ratio unit's teacher pages retain horizontal unit-rate text. No physical PDF was generated. Changes remain local; no push, deployment, Drive sync, or external transmission.

### 2026-11-03 GFIELD Pre-Algebra Unit 2 · equations and inequalities

Extended the original Pre-Algebra workbook from one to two authored units: 12 lessons and 24 practice prompts. Unit 2 sequences substitution to check equation/inequality solutions, one-step addition and multiplication equations in the nonnegative-rational Grade 6 scope, contextual equations, inequality constraints on number lines, and explicitly labeled Grade 7 multi-step equation/inequality connections. References are CCSS 6.EE.B.5–8 and 7.EE.B.4. Updated the route, course comparison counts, workbook counts, tests, cache versions, and README. The path now reports two GFIELD units/12 lessons; it still states that the course is not complete and does not diagnose or place a learner.

Checked examples and answer keys manually; corrected a contradictory practice answer before verification. The Node REPL test runner passes the Pre-Algebra contract (3), course-pathway contract (3), and shared fraction-renderer contract (1): 7/7. A live local browser check now shows both units and 12 lesson/12 exercise pages in student mode and 12 answer pages in teacher mode. The student view has 12 stacked fractions and no slash-form numeric fractions; the teacher view has 17 stacked fractions and no slash-form numeric fractions, including the sentence-final `p=11/3.` case. Computed styles show inline-grid numerator/denominator and a visible 1px fraction bar. Actual PDF export was not generated; the pages use the existing A4 print renderer. No release, push, deployment, Drive sync, or external transmission.

### 2026-11-03 GFIELD Pre-Algebra Unit 1 and stacked fractions

Added `boarding-school-math/prealgebra-workbook.html` with an original GFIELD Unit 1: six lessons and twelve practice prompts covering variable expressions and values, exponents/order of operations, translating verbal relationships, operation properties, distribution, and combining like terms. Objectives and terminology follow the Common Core 6.EE scope; the course record links 6.EE and 7.EE references. The student route now includes the new unit and a separate teacher answer/solution route. The course comparison teacher link also opens the GFIELD workbook. Pre-Algebra remains a partial course prototype, not a diagnostic or placement result.

The workbook uses the existing A4 renderer and shared math formatting. Fractions such as 3/2, 9/4, and (s+12)/2 show a stacked numerator, horizontal bar, and denominator in both screen and print stylesheet structure; units, ratios, and counts are not reformatted as fractions. The request-specific six-step pathway uses curriculum terms such as “변수식으로 나타내고 식의 값 구하기,” “연산 성질,” and “동류항을 결합해 식을 정리하기.”

Verification: the local Chrome student view shows the fractions stacked in the worked square-area example, and accessibility output exposes them as Korean fraction readings; teacher mode also exposes stacked forms in answers. The course object reports 1 unit, 6 lessons, and 12 practice prompts in the available Node REPL. Course contract and browser regression tests were added, but the shell test runner was unavailable in this session; no suite pass is claimed. The Pre-Algebra route AX review confirms both student and teacher links, the six ordered concept labels, and current resource counts. `git diff --check` passes. Changes are local only; no push, deployment, Drive sync, or external API call.

### 2026-11-03 course comparison cards and fraction display check

The learner-selected previous/current/next course comparison now links each card directly to its GFIELD material. Algebra 1 availability matches the authored course: five units, 32 lessons, and 64 practice prompts. Grade 7 no longer shows the stale “first lesson available / next units in progress” status. This remains a learner-selected course path; the grade does not infer the course or placement.

Checked the requested fraction presentation against the rendered materials: workbook math uses stacked numerator/bar/denominator output, and the Grade 7 AMC 10 practice browser check confirms stacked fractions. Slash notation is retained for units and rates. The course pathway and roadmap browser suites pass 44/44, including course links and mobile layout. A separate broader workbook run was not clean: the checkout's Playwright default headless browser binary is missing, so no claim is made for those extra tests. `git diff --check` passes. Changes remain local; no push, deployment, Drive sync, or API call.

The contest grade-comparison copy now names its actual match key: the selected contest plus the learner-entered date and paper memo. It explicitly says that matching text does not verify the underlying paper or difficulty, and does not yield a grade, growth, or skill-level judgment. This is especially relevant when a saved label happens to match across two records. Focused AMC 8 and Math Kangaroo comparison browser checks pass 2/2; underlying comparison behavior and paper-band guard remain unchanged.

Replaced the generic Pre-Algebra card destination with a dedicated GFIELD study route. It sequences four strands—rational-number operations, ratios/proportions, expressions/relationships, and geometry/data—and links exactly ten public Grade 6 concept lessons, six reviewed Grade 6 workbooks, and two reviewed Grade 7 bridge workbooks. Four unreviewed Grade 6 workbook drafts are excluded. The Grade 7 items link to their released workbooks, not the Grade 6 concept lesson page. The route ends with a school-dependent link to the original GFIELD Algebra 1 workbook; it is a curated public-material path, not a complete placement course or diagnostic.

Course metadata now reports the 10 concept lessons and eight reviewed workbooks and links the student comparison card to the new path. Contract tests pass 3/3; focused course-pathway/Pre-Algebra browser tests pass 2/2 and check all ten concept cluster IDs, all eight workbook IDs, successful local resource responses, Algebra 1 bridge, and 390/1280px no-overflow. Manual Chrome screenshots were reviewed at both widths; initial header collapse was corrected before final screenshots. `git diff --check` passes. Changes remain local; no push, deployment, Drive sync, or API call.

### 2026-11-03 Precalculus polar-coordinate enrichment and fraction display

Added a GFIELD-authored optional lesson that converts polar coordinates to Cartesian coordinates and back, with a worked example and two practice prompts. It is explicitly labeled 선택 심화 because school sequencing varies; the course summary and A4 workbook metadata now report five units, 16 lessons, and 32 practice prompts. Fractions in the new example and practice are rendered with a visible numerator, horizontal bar, and denominator in both student and teacher workbook views; the displayed math does not leave slash-form fractions. The current AMC 10 practice route was also checked and already renders its simple numeric fractions as stacked fractions.

Verification: Precalculus workbook browser check confirms the new lesson/practice pages, stacked `3π/2` and `π/3`, zero visible slash-form fractions in the polar practice page, teacher answer pages, and responsive 320/390/1280px widths. The complete focused course-pathway/Precalculus/roadmap browser suite passes 45/45. `git diff --check` passes. Local only; no push, deployment, Drive sync, or API call.

### 2026-11-03 original Algebra 2 course + fraction notation

Added the GFIELD-authored Algebra 2 workbook at `boarding-school-math/algebra2-workbook.html`, reusing the existing student/teacher A4 workbook renderer. It contains five units, 18 lessons, and 36 original practice prompts with examples, explanations, answers, and feedback. Its scope is polynomial structure, quadratics, rational expressions/functions, exponential/logarithmic models, and sequences. Complex numbers and matrices are marked as optional extensions; it does not replace a school's Geometry course or establish a Grade 8/9 placement. Grade 8 optional enrichment and the inferred Grade 9 bridge now link to this local GFIELD workbook; external AoPS/FlippedMath Algebra 2 links were removed from those stages. Course metadata and resource counts now match the authored material.

The shared fraction renderer now displays numeric fractions and parenthesized algebraic fractions—including one level of nested factors—with a horizontal bar and an accessible Korean reading label. Non-mathematical unit notation such as `km/h` remains unchanged. The same renderer version is loaded by the roadmap, Algebra 1/2 workbooks, and teacher paper builder.

Verification: directly rendered the Algebra 2 workbook in the local browser at 320px, 390px, and 1280px with no horizontal overflow or page errors; confirmed 5 unit pages, 18 lesson pages, 18 practice pages, and 42 A4 page cards. The student edition contains no answer pages; the teacher edition contains 18 answer pages. Numeric and nested algebraic fractions show horizontal bars (including `75/8` and `(2x+2)/(x(x+2))`), while `km/h` remains slash notation. The Grade 8 route links to `./algebra2-workbook.html` in the same tab. Course data counts and representative worked answers were checked in the Node REPL. The repository test runner could not be invoked from this shell because `node` is not on PATH; targeted browser checks were performed manually, not claimed as a suite run. `git diff --check` is recorded after final edits. Changes remain local; no push, deployment, Drive sync, or API call.

Next: continue source-matched review of grade-to-grade course comparisons and contest-diagnostic evidence. The AIME manual-review path is now included, with same-date/same-paper comparison and no score or eligibility claims. Keep school course choice separate from inferred grade examples; do not convert contest results into placement claims. Grade 7 private diagnostic and contest candidates remain behind independent review, pilot, and release gates.

### 2026-11-03 original Geometry course

Added `boarding-school-math/geometry-workbook.html` and a GFIELD-authored course map with five units, 16 lessons, and 32 practice prompts. The sequence links coordinate transformations with congruence, construction and proof; similarity with right-triangle reasoning and trigonometric ratios; circle relationships; coordinate geometry; then measurement and modeling. Official Common Core Geometry codes are used to scope units; lesson text, examples, solutions, prompts, and feedback are original. The Grade 8 school-course check and Grade 9 inferred bridge now point to the internal Geometry workbook. Grade 8 annual resources no longer send learners to AoPS Geometry or Geometry Revisited; AMC guidance remains separate. The workbook reuses the existing student/teacher A4 renderer and displays fractions with the shared horizontal-bar notation.

Verification in the local browser: confirmed the student workbook renders 5 units, 16 lessons, and 16 practice pages. Numeric, Greek-letter, parenthesized, and Korean-labeled fractions render as numerator/denominator elements with a horizontal rule; common unit rates such as `km/h` remain inline. The current page exposed the revised HSG-CO standards list and no visible load failure. Earlier CUA inspection confirmed teacher mode exposes 16 answer pages. Grade 8 and Grade 9 route links resolve to `./geometry-workbook.html`; Grade 9 remains labeled as school-course confirmation, not placement. Responsive checks at 320/390/1280px and the new symbolic-fraction assertions are encoded in browser tests but were not executed in this environment. The shell has no Node binary, and the available Node REPL cannot import the installed Playwright bundle; the course-data contract test is also pending. No JavaScript console-error or horizontal-overflow claim is made. This section records local verification only. No push, deployment, Drive sync, or external API call.

Next: keep the high-school curriculum comparison aligned with each GFIELD workbook's actual scope and official standards. The earlier Precalculus external-link replacement is complete; Grade 9 remains an inferred bridge, and no grade label should be treated as course placement.

### 2026-11-03 G·MAP illustration palette update

Reworked the roadmap's wide map illustration to align with the GFIELD brand: deep plum `#482378`, violet `#7545D9`, lilac `#C7A5FF`, pale lavender `#EDE4FB`, and warm ivory `#FFF9F2`. Preserved the four floating-island learning sequence and winding route, reduced cyan/green, and left interface text/markers out of the artwork. The new optimized asset is `boarding-school-math/assets/roadmap/mathematics-learning-world-gmap-v2.webp` (1983×793, about 148 KB); the prior image remains untouched. The page and mobile layout now load v2 with updated cache keys. Generated with the built-in image tool from the existing local map image; prompt summary: recolor/refine the wide four-island G·MAP route into the stated GFIELD palette, keep the route composition and marker space, and omit text, logo, interface, people, and markers.

Verification after the asset/CSS update: roadmap model and browser suites pass 46/46. Fresh local renders at 1440×960 and 390×844 show the v2 asset returning HTTP 200 at both widths (151,418 bytes); mobile document width remains 390/390. Desktop prompt and route markers remain legible, and the phone layout keeps the map above the vertical stage list. No learner data or assessment items were used. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Grade 7 NS.A wording review preparation

Visually revisited the existing answer-free revision-11 mobile/A4 renders. The repeating-decimal open-response prompt remains dense, so a private review memo now offers two Korean/English/Simplified-Chinese alternatives: A keeps six labeled response fields; B asks for the same key evidence without a semicolon/six-field format. By character count, A is 40% shorter in Korean, 43% in English, and 29% in Chinese; B is 64%, 64%, and 59% shorter. These are length comparisons only, not readability or validity results. Reran the existing local calculation/contract check against revision 11: 18/18 calculation slots, three diagram mappings, 18 immutable plan slots, and the 14/4 automatic/teacher split passed. Public Grade 7 NS.A workbook, diagnostic-engine, release, scoring, report, and authoring contract tests now pass 88/88; these test public code and release boundaries, not private item validity. The candidate JSON remains unchanged at SHA-256 `476dc1c201a0ac07c6d6888db986ec7c1892604885c40d59d421fe7a7420e732`. This is a reproducible local check, not a new independent human review or a validity study. The memo distinguishes candidate-specific evidence from the narrower official `7.NS.A.2d` expectation and flags learner burden for independent review. Independent math and language review is still required before candidate revision or rerender. A read-only Claude Max review of option A is awaiting user approval; no candidate text has been transmitted. The screener remains locked; nothing from the proposal was copied into the public repository.

Follow-up: reran the private copy-proposal browser check with bundled Node/Playwright and installed Chrome. All nine language/width combinations (Korean, English, Simplified Chinese × 320/390/1280px) passed overflow checks; the prototype made zero network requests and persisted no responses. This verifies the local proposal UI only and does not approve wording, math, translation, accessibility, or candidate revision.

## Public roadmap and comparison work

The Grade 3–12 G·MAP boarding-school roadmap now contains the branded route illustration, supplied Grades 6–8 and 10 annual-plan examples, a clearly labeled inferred Grade 9 bridge, curriculum examples for grade comparison, student-entered external assessment comparison, and manual same-paper contest review. Grade 6 and Grade 7 plans link their stage-matched references. These records do not become placement decisions or unsupported cross-grade mastery bands. Public AMC/Kangaroo review remains bounded to entered marks, matching contest/date/paper, official score-report values, and descriptive evidence.

Current local regression evidence: roadmap model/browser `46/46`; contest practice, competition-source/profile, diagnostic-engine, and public Grade 7 NS.A plan/authoring/analysis/report/scoring/release/workbook tests `80/80`; competition paper-review browser `18/18`. Total `144/144`. Chrome rendered Grades 6, 7, and inferred Grade 9 at 1280px and true 390px device widths; all had four annual-plan stages, expected link/no-link behavior, G·MAP art, and no horizontal overflow. Commits `0c476d08f` (Grade 6–7 resource links), `4f0f2e424` (installed Chrome test override), and `fa44b6179` (metadata-only QA search record) are local.

## Two distinct private candidate gates

**Grade 7 `7.NS.A` screener:** revision-11 current answer-free visual QA artifacts already exist for Korean, English, and Simplified Chinese at 320px, 390px, A4, and Letter; the recorded pack hash matches `476dc1c201a0ac07c6d6888db986ec7c1892604885c40d59d421fe7a7420e732`. Known QA notes include horizontal pan for the initial 320px number-line view, diagram typography/print-label alignment, and dense repeating-decimal wording. These current captures/PDFs do not satisfy independent math/language/rights/accessibility review, pilot, immutable item release, or release authorization. Do not ask the user for another screenshot set for this unchanged `7.NS.A` revision.

**Separate Grade 7 AMC 8 R6 candidate:** this is the 42-item contest workbench, not the 18-slot `7.NS.A` screener. Current workbench/order files are dated 2026-10-30; available desktop/390px/320px screenshots and A4 PDF are dated 2026-10-29 and stale. Drive metadata searches on 2026-11-03 found no current replacements. Its project QA rule prohibits alternate/indirect rendering routes. Current visual review needs owner-provided current screenshots/PDF or an explicitly supported browser route. Even after visual review, independent content/rights/accessibility review, pilot, report validation, and release approvals remain separate gates. Keep it locked.

Continue public product work that does not require the private candidate contents. If the user supplies current AMC R6 QA artifacts or a supported route, review those specific artifacts; do not conflate that request with `7.NS.A`. No Claude review is claimed: Claude Code CLI reported `Not logged in` in the last recorded attempt.

- **유아 2차 디자인 패스 + R0 배너** (9bfc0815) — 오답 소리·😅표정을 공용 shake()
  한 곳에 연결(유닛 id N-* 게이트 — young 밴드는 A-*에도 걸려 과적용 위험), 색 대비
  30화면 스캔 후 8건 토큰 보정, young 밴드 공통 UI 확대(.nm-back은 유닛 바 스코프),
  N-15 최초 완료 시 R0 추천 오버레이(1회성·잠금 없음, S.seenR0Banner).

### 2026-11-03 G·MAP route stop readability

Kept the existing G·MAP violet, lavender, and ivory map artwork. Put selectable stage cards in a cream band below the panorama and left only neutral numbered markers over the illustrated route. Selecting a marker moves focus to the matching card; all stages keep equal visual weight, and selection does not imply completion or learner position. On phones the taller panorama remains above the text-first vertical stage list; the compact Grade 7 prompt stays clear of the markers.

Claude Max Opus 5.5 gave a read-only critique from a generic description of the artwork and layout; no source code, screenshots, assessment content, or learner data were sent. The Code workspace's whole-repository trust prompt was declined, and Claude reviewed only the supplied non-confidential design summary. Its key recommendation—move cards off the illustration and use linked, neutral markers—was implemented.

Rendered and inspected the Grade 7 page at 1440px and 390px. Verification covers the full Grade 3–12 roadmap browser/model suites after the layout update, plus `node --check boarding-roadmap.js` and `git diff --check`. Local only; no push, deployment, or Drive sync.


## 2026-10-30 learner roadmap presentation follow-up

Used the signed-in Claude Code CLI with the Claude Max Opus subscription for a read-only review of the public roadmap UI source. This is Max-subscription use, not an Anthropic API-key call. No private assessment items or student records were provided. Claude identified that pathway selection, measured position, and next-route choice were visually separated; its suggestions were used to add a responsive SVG dotted learning path, a prominent “not yet assessed” status, and a next-concept preview/action beside the path. The selected node is explicitly a preview, not a measured level. The Grade 7 prompt now describes selecting a concept; the unmeasured status lives in the adjacent panel. Mobile navigation keeps all three links visible.

Verification on the bundled Mac Node runtime: grade roadmap data and browser suites passed 16/16; changed roadmap JS passed `node --check`; `git diff --check` passed. HTTP-rendered 390px and 1280px views were visually inspected, and a 320px capture confirmed the navigation links remain visible. No horizontal overflow at 320, 390, or 1280px. This UI work remains local; no push or deployment.

Assessment and contest evidence flows have now been reviewed, and the roadmap shows grade-matched user-entered course evidence. The contest link now names both item-level review and AMC cycle records. A grade comparison now places the matching learner-selected course route beside the selected comparison-grade plan. Next: connect reviewed diagnostic focus evidence when a release-approved version exists, keeping numeric bands distinct from official placement and contest qualification. Do not derive public levels from the locked Grade 7 screener or unvalidated AMC cross-paper comparisons.

## 2026-10-30 Grade 11–12 roadmap bridge

Extended the public boarding roadmap from Grades 3–10 to Grades 3–12. Grade 11 and Grade 12 are explicitly labeled inferred examples because no grade-specific source plan was supplied. Their stages and annual plans begin with the learner's actual transcript, school course catalog, and prerequisites; they do not assume all students follow Precalculus → Calculus or another fixed order. Optional SAT and contest practice remains separate from school-course evidence. The AMC selector correctly presents AMC 12, not AMC 10, for Grades 11–12; families still need to verify current age/grade eligibility with MAA.

The inferred high-school content is limited to Common Core's conceptual categories (number and quantity, algebra, functions, modeling, geometry, statistics and probability), which do not define one grade-by-grade course sequence. Sources checked: [Common Core high school math standards](https://www.thecorestandards.org/wp-content/uploads/Math_Standards.pdf) and [MAA AMC program and eligibility](https://maa.org/student-programs/amc/). The 2026–27 MAA enrollment guide specifies grade and age limits, so the UI links families to current official rules rather than inferring eligibility from grade alone.

Verification on the bundled Mac Node runtime: `boarding-grade-roadmap.test.cjs` passed 7/7 and `boarding-roadmap-browser.test.cjs` passed 15/15, including Grade 11–12 inference/source labels, AMC 12-only option, 390px no-overflow, Grade 10 vs. 12 plan comparison, and existing Grade 7 interactions. Both changed JavaScript files passed `node --check`; `git diff --check` passed. Claude Max Opus read-only review was attempted twice on the public source/diff but returned no response and was interrupted; no Claude review approval is claimed. All changes remain local.

## 2026-10-30 high-school course comparison follow-up

The assessment-entry course selector now includes school-dependent Calculus, Statistics, and Discrete Mathematics options. It records only the chosen current and target courses; no middle course is auto-inserted and no fixed course sequence is implied. The copy now makes that boundary explicit. Grade 6 domain values retain their 6.* cluster mapping for the existing verified-material route; other grades keep only the learner-entered broad domain label and value without a Grade 6 cluster ID. Local v2 record storage accepts the nullable cluster marker, and old records with no selected target fall back to their current course when rendered.

Verification: external evidence engine, assessment-entry browser, and local-record suites passed 30/30. Grade 12 Algebra 2→Statistics selection, optional Calculus/Statistics choices, endpoint-only route, Grade 6-only cluster IDs, local persistence, ISEE restoration, and existing MAP/domain behavior are covered. No external score norm, learner level band, or school placement is inferred. Claude Max review remains unavailable in this run: both read-only CLI attempts returned no response; no independent review is claimed. Local only.

### Level-comparison evidence audit

The Algebra 2 screen uses its own 40-item test and GFIELD-internal reporting rules: a total band after at least 15 graded items (70% core target, 88% advanced target), with separate domain indicators. These are not validated boarding-school or cross-grade cut scores and must not be copied as if they were common norms. The Grade 7 `7.NS.A` screener contract explicitly excludes score cutoffs, mastery/strength/weakness thresholds, automatic assignment, and public execution; two reserved observations per focus are a blueprint minimum, not mastery evidence. The contest paper-review engine suppresses domain rates below three attempted items and compares only domains with enough evidence within that paper; its AMC history groups raw scores by contest and does not infer growth or readiness across papers. The next learner-comparison design should therefore preserve source, grade, diagnostic/form version, and denominators; compare observed domain/focus evidence only when the underlying item set is comparable; and label thin evidence as insufficient. Numeric grade bands remain out until a grade-specific approved policy and pilot evidence exist.

## 2026-10-30 private R6 workbench source repair

The private R6 teacher workbench generator was updated and rebuilt locally. Source fixes cover native button-group semantics, focus visibility/clipping, disclosure markers, English language tags, mobile instruction copy, short-viewport scrolling, long-string wrapping, and print generation on `beforeprint` with clearer non-distribution marking and pagination rules. Inline JavaScript syntax check passed. The private manifest now correctly marks rendered browser and current A4 visual QA as pending; Oct 29 browser/PDF captures are stale for R6.

Claude Max Opus UI-source review was attempted using sanitized HTML/CSS only (no candidate data). The first CLI call returned `Execution error`; a retry produced no output and was interrupted. No AI UI-review approval is claimed. R33 applies to the separate pilot-plan text only. Candidate content remains private and locked. Next work is still inspection of current R6 at desktop/390px and a fresh A4 export; the browser rejected the private `file://` route, so use user-supplied captures/PDF rather than a workaround.


Historical R4 desktop/390px screenshots were re-opened for reference. They show the intended list/preview flow but predate R6 and do not count as current visual QA. The old screen-visible watermark has been made print-only in source. Current browser/A4 evidence remains outstanding.

## 2026-10-30 roadmap and contest feature audit

Current source evidence: the roadmap's grade comparison places two grade-plan examples side by side and labels Grade 9 as inferred; it does not compare a learner's measured score/grade or assign placement. The competition-paper review accepts manually entered O/X/blank marks and optional domain/error labels for an already-scored external paper. It reports raw counts and cautious within-paper review cues; it has no answer key, official score, readiness/award/AIME estimate, learner history, or automatic course decision. The Grade 6 AMC 8 set remains topic practice, while the separate private Grade 7 42-candidate set remains locked pending human review and pilot approval.

Verification on 2026-10-30 with the bundled Mac Node runtime: roadmap and paper-review core tests passed 8/8. The associated browser test files could not load because `playwright` is not installed in this checkout; no browser-test pass is claimed. Current private R6 visual browser/A4 QA also remains pending under the recorded CUA security restriction.

## 2026-10-30 Grade 7 NS.A private-draft recheck

The external-root Grade 7 NS.A preflight was rerun against the existing private 18-slot pack: 14 automatic and 4 teacher-reviewed items; state remains `draft-pending-independent-review`, delivery locked, and both independent approval and mathematics verification false. Its separate exact-rational checker matched all 18 slots, the immutable plan contract, and three asset mappings. These are local structural/calculation checks, not independent human item review, rights approval, or release authorization. The Oct 29 revision-11 rendered QA notes remain current: initial 320px number-line arrows require horizontal pan; some asset typography and printed label alignment need review; the dense repeating-decimal prompt needs a separately reviewed content revision if changed. No candidate wording/assets changed during this recheck.

## 2026-10-30 Grade 7 AMC and NS.A continuation

The private R6 teacher workbench received Claude Max Opus R3–R7 sanitized-source reviews and repairs. The key defects included an incorrectly escaped whitespace search regex and a list-render index error; both are fixed, along with keyboard focus/state, validation order, and visible/printable failure handling. Generator and emitted script syntax checks and focused source assertions pass. R8 returned `Execution error`, so it is not treated as review evidence. The form remains 42 items, six per axis, private and locked. Current browser/A4/assistive-technology QA remains pending; CUA denied the private `file://` page under browser navigation policy.

Fresh Mac verification on 2026-10-30: six focused roadmap/competition/NS.A screener test files passed 26/26; the private AMC draft preflight passed (42 items, seven axes, six per axis); the private NS.A authoring preflight passed (18 slots, 14 automatic/four teacher, still locked and unapproved); and its exact-rational checker passed all 18 slots against the immutable plan/assets. These checks do not grant content, rights, human, or learner-use approval. The public roadmap still compares grade-plan examples rather than assigning measured grade placement; competition review summarizes teacher-entered scores and domain evidence without an official score or benchmark band.

## 2026-10-30 annual roadmap continuation

Added a grade-selected 12-month plan section to the public roadmap. Grades 6, 7, 8, and 10 show the four-stage plans and resource examples supplied in the conversation. Grade 9 has a distinct inferred label in its heading, note, and every period. Grades 3–5 keep their concept stages and explicitly say monthly plans were not supplied. The grade-comparison section and competition review retain their existing boundaries: planned grade examples and manually entered paper evidence only, with no learner placement or official competition level.

Claude Code CLI (Opus, Claude Max subscription, read-only diff review) flagged visitor-facing wording, an unused plan title, weak Grade 9 headings, and missing Grade 9 range assertions. Wording/headings and tests were updated; Claude also confirmed the hidden-state and responsive-border CSS behavior in the diff. It could not compare plan fidelity because the original plan text was not included in the review payload; source fidelity was checked against the user's messages in this conversation. Local Node verification passed six focused files, 27/27; both edited JS files passed `node --check`; `git diff --check` passed. Current browser visual verification remains unavailable under the recorded browser file-URL restriction, so no visual QA is claimed.

Follow-up: the existing grade comparison now includes annual-plan titles and each period's topic/description in both columns, with Grade 9 periods still marked inferred and Grades 3–5 explicitly showing no month-based plan. It also links to the existing external-evidence entry with the selected grade prefilled; this form can compare school Placement, MAP, CTP, SSAT, and ISEE evidence to current/target courses while keeping official placement to school policy. Browser tests were extended for the grade plan comparison and selected-grade link. Focused data/engine tests passed 34/34; JS syntax and `git diff --check` passed. Playwright is available through the bundled Node dependency path (set `NODE_PATH` to the bundled node_modules directory), and later continuation runs verified the roadmap browser suite. A read-only primary-source check found MAA's 2026–27 contest format and AIME qualification criteria are cycle-dependent; do not derive general learner grade bands from raw AMC counts. Current official reference: https://maa.org/student-programs/amc/ and https://maa.org/maa-invitational-competitions/ .

## 2026-11-02 Math Kangaroo past-paper route

Added a second official-source link to the roadmap's contest panel: after selecting Math Kangaroo, users can open the organizer's prior-year PDF exam archive alongside the existing test-rules page. It is hidden for other contests and opens in a separate tab with `noopener noreferrer`; no exam content is copied into GFIELD. The official archive describes prior exams as viewable/printable and provides a Grades 7 and 8 section: https://mathkangaroo.org/mks/practice/pdf-exams/ .

Verification: the Grade 3–12 roadmap model/browser suites pass 37/37, including the exact archive URL, selection visibility, switching back to AMC, and external-link protections. The bundled Node runtime passed syntax checking for the changed roadmap script; `git -c core.whitespace=cr-at-eol diff --check` passed. Local-only; no upload, sync, push, publication, or deployment. The private Grade 7 AMC 8 R6 candidate's current screen/A4 review gate remains open as documented in the continuation handoff.

## 2026-11-02 R6 structural recheck

Rechecked the private AMC candidate's nonvisual gates without changing the item pack: `validate-draft.cjs` reports 42 items, seven axes with six each, 14 per intended-difficulty label, four choices, English/Korean content, and locked delivery. The current generated review workbench's one executable inline script passes syntax parsing. File metadata confirms the prior screen captures/PDF still predate the Oct 30 current workbench rebuild. This does not close responsive browser, A4 visual, screen-reader/device, independent human math/language, rights/similarity, pilot, reporting-validation, or learner-authorization gates. No candidate content was sent externally or changed; no student use, sync, publication, or deployment.

The prepared R6 human-review packet and its separate temporary-ID mapping also pass a local consistency check: 42 unique temporary IDs are represented, no permanent candidate IDs or answer/key fields occur in the packet/mapping, and the mapping order matches the R6 form order. This confirms packet readiness only; no packet was transmitted and no human review is recorded.

## 2026-11-02 Math Kangaroo source-registry sync

The official prior-year PDF exam archive is now listed both in the K–12 competition profile and the shared program catalog, with the profile source marked verified on 2026-11-02. This keeps the in-app Grade 7/8 archive link aligned with the source-of-record and preserves the existing metadata-and-links-only rights boundary. Combined Grade 3–12 roadmap, browser, comparison, competition-profile, and question-bank suites pass 50/50; both changed JavaScript modules pass syntax checks and the CRLF-aware diff check passes. Local-only; no exam content was copied.

## 2026-10-30 AMC raw-score reference continuation

The public manual contest-paper review now shows a clearly labeled reference raw score only when all 25 marks are entered for AMC 8/10/12. AMC 8 uses correct-count out of 25; AMC 10/12 use 6 points per correct and 1.5 per blank, with wrong answers 0. Other contests, partial inputs, and non-25-question tests do not produce this score. It is not an official score, contest level, award/AIME prediction, or school placement; the report links to the current 2026–27 MAA scoring policy and tells users to follow the selected test's instructions. MAA's 2026–27 policy PDF (updated Oct. 30, 2026) confirms these formulas for U.S./Canada administration; international participants should follow their local organizer's instructions. MAA overview/teacher pages describe AMC age caps as “under” a half-year threshold, while the new 2026–27 policy PDF says “or younger”; the UI now tells families to confirm the age boundary in current MAA guidance rather than imply a resolved cutoff.

The Claude Max Opus read-only diff review flagged the JS cache-busting version, ambiguous blank-response label, stale module comment, and “unanswered” metric copy; all are fixed. The result boundary was narrowed so it does not imply that every contest receives a raw-score estimate. Focused Node verification on the Mac runtime passed 38/38 tests, three JS syntax checks and `git diff --check`. With the bundled Playwright dependency exposed using `NODE_PATH`, the Grade 7 paper-review and roadmap browser suites passed 14/14; desktop and 390px screenshots were reviewed, including the estimate card and mobile layout. The browser's existing `file://` restriction remains; tests use a local temporary HTTP server. This score-reference change is local and uncommitted as of this handoff update; do not push or publish.

## 2026-10-30 AMC attempt-history comparison

Added a separate session-only AMC 8/10/12 score-record comparison to the public paper-review screen. It accepts a cycle, form, date, and manually transcribed score-report raw score, groups and sorts entries within the same contest, and supports a validated JSON export/import so families can keep a file without server or browser persistence. The archive excludes student names and item responses, rejects unknown fields, duplicate IDs, invalid contest scales/forms/dates/cycles, and is capped at 100 records / 100KB. It deliberately shows no cross-paper score deltas, level, growth, difficulty adjustment, school placement, award, or qualification verdict.

For 2026–27 AMC 10/12, the form displays the MAA fixed AIME threshold (AMC 10: 100/150; AMC 12: 85/150) and minimum-age-13 condition only after the user explicitly selects the US/Canada MAA route. Selecting International AMC instead shows the official International Group Leader guidance without a threshold. The actual saved score records do not infer region or attach a qualification result. AMC 8 has no AIME threshold context. The older manual-item score estimate remains a separately labeled historical formula reference; the actual paper instructions govern.

Updated `docs/AMC_COMPETITION_DIAGNOSTIC_GATES_2026-10-29.md` to distinguish descriptive score records and region-selected official cycle context from the still-locked GFIELD diagnostic bands and predictions. Claude Max Opus read-only review found and prompted fixes for duplicate-import messaging, region-specific threshold display, keeping form selections between entries, primary-button contrast, print scope, and live-region verbosity. Unit tests passed 9/9, paper-review + roadmap browser tests passed 15/15 (including 320px overflow, import/export, duplicate imports, region gating, and AIME context), JS syntax checks and `git diff --check` passed. Desktop and 390px rendered screens were visually inspected. Source checks: MAA 2027 AIME announcement https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/ , current invitational eligibility https://maa.org/maa-invitational-competitions/ , and AMC International guidance https://maa.org/amc-international/ . This feature is local and not yet committed; no push or deployment.

### Accessibility follow-up (2026-10-30)

Success announcements now use a separate polite status region with green styling; validation failures stay in the alert region. Deleting a history entry clears stale announcements and returns focus to the next entry or section title. Official cycle context is only rebuilt when its content changes. If the optional score-history module is unavailable, the original paper-review tool remains usable and the history section is hidden. The AIME link label now names the 2027 MAA announcement explicitly. MAA's 2027 AIME announcement confirms AMC 10 ≥100 and AMC 12 ≥85 to register, subject to other eligibility requirements including age 13+; the invitational policy page confirms fixed thresholds and separate IGL policy for international participants. References: https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/ and https://maa.org/maa-invitational-competitions/ .

Latest local verification on 2026-10-30: focused Node tests 43/43; paper-review + roadmap browser tests 17/17, including status/focus behavior, print scope, 320px–844px overflow, and graceful operation when score history is unavailable. Changed JS syntax checks and `git diff --check` passed. Claude Code CLI Opus via the existing Claude Max subscription performed a read-only review; its actionable notes about separating success/error messages and restoring focus were addressed. One Claude run claimed test results without executing them, so only local test commands above are relied on. Committed locally as `f46bc477`; no push or deployment.

## 2026-10-30 cross-grade concept-flow map

Added the four concept progressions supplied in the conversation to the public Grade 3–10 roadmap: arithmetic to AMC 10 algebra manipulation; ratio/rate to coordinate geometry; parity to AMC/AIME combinatorics; and sequences to AIME number theory. Each path is an ordered five-step example, rendered once as an accessible ordered list. The copy explicitly says this is a concept-connection reference, not a learner position or mastery result. At widths up to 1100px, the map uses one card column; on phones, each path stacks vertically. Claude Max Opus read-only review identified mid-width card compression, mobile arrow alignment, and two test-scope/style improvements; these were fixed and coverage now includes 320, 390, 900, and 1280px plus title/note non-overlap. Latest roadmap checks passed: data tests 7/7 and browser tests 8/8; JS syntax and `git diff --check` passed. Committed locally on the current branch; no push or deployment.

## 2026-10-30 external-score comparison safety update

Reworked the public school-assessment result so it records the reported metric and comparison context, then shows the user-selected current-to-target course path. Removed internal score bands, confidence labels, the arbitrary 70% domain cutoff, and score-derived weeks/day/problem prescriptions. School Placement comparison now reports only whether the entered school cutoff was met; school policy still determines actual course placement. Domain values are displayed in ascending order as entered report values, not diagnosed weaknesses. ISEE Quantitative Reasoning and Mathematics Achievement stanines remain separate; no averaged stanine is calculated. Assessment-linked learning plans use the learner-selected study priority rather than deriving one from this external score.

This follows primary-source interpretation guidance: NWEA says RIT is grade-independent and does not itself imply a grade-level achievement label; NWEA and ERB percentiles are tied to their stated norm/reference groups. Sources: https://connection.nwea.org/s/article/Comparing-RIT-scores-across-grade-levels , https://www.nwea.org/map-growth-norms/ , https://www.erblearn.org/ctpscorereporthelp/ . External-evidence storage schema is now v2. A safe v1 migration restores only recoverable score-report input fields for user verification; old readiness labels, course recommendations, weak-domain rankings, and study prescriptions are discarded. Legacy ISEE averages are not restored into either stanine field. No scores or student records were sent to Claude.

Claude Max Opus read-only review was attempted on the public engine source but produced no output for over a minute and was interrupted; no review findings are claimed. The code was changed against official source descriptions and tested locally. Focused engine/storage and assessment-entry/learning-plan/roadmap browser tests passed 44/44. Four changed JavaScript files passed `node --check`; `git -c core.whitespace=cr-at-eol diff --check` passed. Local only; no push or deployment.

### Legacy score-summary restoration follow-up (2026-10-30)

The assessment-entry page now detects a saved v1 external score summary and pre-fills only report values that can be recovered. It does not regenerate or show a comparison until the user verifies the evidence and submits again; the screen asks them to confirm or supply missing season/norm group, current/target course, and domain values. Old course/readiness/weakness/study-plan outputs are omitted. A v1 ISEE summary had combined two stanines, so neither ISEE stanine is guessed from that average. Added unit and browser coverage. One adjacent test had an obsolete expected empty-state string; its assertion now matches the current UI label `진단 결과 없음`.

Focused Mac verification passed 62/62 across external-score engine/storage, assessment entry, learning-plan, Grade 3–10 roadmap, AMC score history, and competition review suites. Both edited JavaScript files passed `node --check`; CRLF-aware `git diff --check` passed. Claude Max Opus authentication is active, but the sanitized-source code review attempt produced no output for 30 seconds and was interrupted; no finding is claimed for that review. A later narrow Claude geometry check did return a response. Official MAA search did not identify a general AMC 8 score cutoff or grade-level award band suitable for learner comparison. Keep AMC 8 at descriptive historical/raw score and item-evidence level; do not add inferred grade labels or readiness bands. Local only; no push or deployment.

### R6 independent AI solve cross-check (2026-10-30)

Codex independently solved the private R6 blind packet and matched 42/42 mapped keys. Forty were genuinely solved before the private ID/key map was loaded; two keys were exposed during initial workspace inspection and are explicitly marked non-blind. A separate Claude Max Opus read-only review of the only flagged geometry interpretation found the stem determinate as written and no required edit. The private report is stored outside Git in the candidate folder. These are AI checks only; the item ledger's independent human math/language, age-fit, distractor, rights/similarity, current R6 browser/A4, and pilot gates remain pending. Form remains locked.

## 2026-10-30 comparison and contest-review usability follow-up

Claude Max Opus reviewed a sanitized description of the public grade-comparison and contest-review interactions. It identified two actionable clarity gaps: optional domain/error tags did not show their evidence denominator, and mobile grade comparisons put complete grade plans one after another. The Grade 3–10 comparison now pairs corresponding topics and periods in each mobile row while retaining the two-column desktop view; Grade 9 inference context appears once in the mobile comparison. Contest results now show how many questions had a domain and error reason assigned, explain why an incomplete AMC paper has no reference raw score, and distinguish unentered questions from unanswered ones. No diagnostic bands, readiness or placement predictions were added.

The focused roadmap, paper-review, and browser suites passed 30/30. Updated scripts passed `node --check`; `git diff --check` passed. Desktop and 390px captures were visually reviewed; the mobile comparison keeps both grades visible per row, and the result screen shows the denominators and incomplete-score explanation. This work remains local; no push or deployment.

Follow-through verification also passed the existing assessment-entry and learning-plan browser suites 13/13. An additional 390px browser sweep checked every ordered pair among Grades 3–10 (56 comparisons): no horizontal overflow, each row retained both grade values, and all comparison periods/categories rendered without generic fallback headings.

The public-exposure audit was also run, but did not complete its full-history scan: the local partial clone is missing a promisor object and lazy fetch is disabled. No historical privacy-audit pass is claimed; no fetch or remote sync was initiated.

Separately, Codex recorded a second blind-solve review of the private Grade 7 NS.A revision-11 candidate outside Git. All 14 auto-scored keys matched; the four teacher-scored responses were checked against their open-response requirements. The exact-rational checker and locked-state preflight pass. This is AI cross-check evidence only and does not replace human review, rights review, current pilot acceptance, or release approval. The candidate remains locked.

## 2026-10-30 assessment evidence on boarding roadmap

Connected the existing local external-assessment record to the roadmap's learner panel. For an exact grade match, the panel displays the user-selected assessment source, test date, and manually selected current-to-target course route. It does not repeat raw scores, derive grade bands, infer placement, or show a record from another grade. Malformed, legacy, missing, and other-grade records use the empty state. The comparison form remains the place to inspect source-specific score details. No candidate/private diagnostic data are read or sent.

Mac verification passed 41/41 across roadmap, external-assessment, local-record, and grade-data unit/browser suites. A real local browser flow entered a school Placement result and Pre-Algebra → Algebra 1 route, saved it, and confirmed the Grade 7 panel display; switching to Grade 8 correctly returned to the empty state. JS syntax and CRLF-aware whitespace checks passed. The empty state was visually inspected at 390px and 1280px with no overflow. Claude Code CLI using the signed-in Claude Max Opus subscription was invoked for a read-only sanitized UI review, but returned no findings before the attempt was interrupted; no Claude review approval is claimed. Committed locally as `ab448820`; no push or deployment.

## 2026-10-30 assessment route beside grade-plan comparison

The Grade 3–10 comparison view now adds a paired panel below the two grade plans. Its left side reads only the locally saved external-assessment record that exactly matches the selected current grade and shows the user-selected current → target course route, assessment source, and date. Its right side shows the selected comparison grade's roadmap title and core plan. With no matching assessment it shows an input link instead; changing the current grade cannot carry the previous grade's record into the comparison. It does not expose the raw test score, infer course fit, or assign a grade band. The comparison label works for any selected grade pair, not only the next grade.

The end-to-end browser test entered and saved a school Placement result, compared Grade 7's route with the Grade 8 plan, then changed the current grade and confirmed the Grade 7 evidence was not reused. The assessment-entry, local storage, roadmap browser, grade-data, and external-score unit suites passed 41/41; changed JavaScript syntax and CRLF-aware diff checks passed. Visual captures of the populated comparison at 390px and 1280px showed both columns readable and stacked on mobile. This remains local; no push or deployment.

## 2026-10-30 assessment history continuation

Expanded the single local external-assessment slot into a bounded history of 30 sanitized records. Each record keeps its own source, grade, test date, reported score units, norm/season when supplied, domain entries, and manually selected course route. Saving the same source + grade + test date updates that entry instead of duplicating it. A previously saved modern single record is migrated into history on first read; legacy summaries are not migrated into comparison history, and legacy input restoration is limited to the matching grade when no modern history exists. The entry page lists records newest first, labels device-local storage, and provides one action to clear history. Opening the page with a grade restores only that grade's newest record; the roadmap also selects evidence from the requested grade's history.

Assessment entry and roadmap browser tests cover Grade 7/8 record separation, previous-record migration, grade-specific restore, route loading on the roadmap, and clear behavior at 390px. The focused final suite passed 44/44; the three changed JavaScript files passed `node --check`; `git diff --check` passed. Read-only Claude Code CLI Opus review was attempted using the signed-in subscription, but did not return findings during the review window, so no Claude review approval is claimed. The changes remain local pending commit; no push or deployment.

The comparison panel now reads an independent saved record for each selected grade. When both grades have evidence, it displays each assessment source, date, and user-selected course route side by side; when one side has no record, it continues to show that grade's roadmap plan and offers a grade-prefilled assessment link. The 11-case roadmap browser suite passed after this change, including the two-record route comparison and mobile-width checks. No score normalization, readiness band, or placement inference was introduced.

## 2026-10-30 saved AMC diagnostic connection

The item-level contest review now offers an explicit “save summary to this device” action after the user enters an exam date and reviews results. The bounded local history stores grade, contest, date, paper memo, aggregate outcome counts, domain-level correct/attempted/blank counts, and user-selected error-reason counts. It strips question-level answers and does not retain raw-score estimates. The roadmap shows only the newest diagnostic matching both its selected grade and contest; domain rates remain suppressed below three attempted questions. A single saved record can be removed from that roadmap card. The UI keeps contest diagnosis separate from awards, AIME qualification, score normalization, and course placement.

Focused storage, review, roadmap, evidence-engine, and grade-roadmap checks passed 50/50, including save opt-in, answer-free persistence, exact grade matching, and a 390px no-overflow assertion. Changed JavaScript files passed `node --check`; `git diff --check` passed. Data remains local; no API sync or publication was performed.

The contest review page now also lists saved diagnostic summaries chronologically, with domain denominators and per-record deletion. The page shows rates only when at least three questions were attempted in that domain, and does not align scores across papers. Browser coverage confirms the list appears after opt-in save, can be deleted, and remains within 390px. The README's entry-point descriptions were updated to match local storage and comparison behavior.

## 2026-10-30 MAP grade comparison and ISEE persistence repair

Claude Max Opus read-only reviews identified an ISEE persistence defect and clarified that MAP Growth Math RIT is the only current external metric with a documented cross-grade vertical scale in this UI. ISEE Quantitative Reasoning and Mathematics Achievement stanines are now retained separately by the evidence engine and local-storage sanitizer; saved records restore their source-specific inputs, course route, season, and domains. Older ISEE records with no separate values display em dashes rather than `null` or `undefined`. The MAP season field now starts as “not confirmed from report” rather than silently defaulting to Fall.

The Grade 3–10 plan comparison now reads each grade's latest MAP record independently of the grade's latest other-source record. If both grades have MAP Growth Math RIT values, it shows dates, explicitly reported seasons, both RIT values, and their arithmetic difference. It does not calculate percentile differences, expected growth, mastery, or placement; mixed-source values are not combined. The comparison keeps the user-entered course routes alongside the score evidence.

Focused Mac browser and unit coverage passed 41/41 across assessment entry, grade roadmap, evidence engine, and local-record suites. This includes ISEE save/history/reload, MAP RIT same-scale comparison, mixed-source suppression, unknown season, and 390px overflow. Changed JavaScript passed syntax checks and `git diff --check`. Official NWEA source checked: the RIT scale is grade-independent, while test content differs across grade forms; this supports comparing the numeric scale while explicitly avoiding claims about untaught content or grade-level mastery. Claude Max Opus performed two read-only code reviews; its actionable findings were fixed and the second review found no blockers. This remains local; no API key, cloud sync, publication, or push was used.

## 2026-10-30 contest diagnostic record comparison

Added a side-by-side view of the two newest date-confirmed AMC/contest diagnostic records for the exact grade and contest selected on the roadmap. Each record keeps its own paper label/date, correct/wrong/blank/unmarked counts, classification denominator, and domain correct/attempted counts. Domains with no attempts show “미측정”; attempt rates remain withheld below three. Date-missing records are excluded from this pair so save time cannot make them look like a dated test. Cards identify recent vs previous and are labelled for assistive technology. Copy explains that paper difficulty is not adjusted and differences are not growth or skill level.

Claude Max Opus review confirmed the interpretation and denominator fixes, then found an undated-record ordering edge case and asked for stronger responsive column assertions. Storage now sorts dated assessment records before undated records; the latest dated result stays primary even if an undated entry was saved later. The pair view also lists each paper's classified error reasons beside its domain counts. Expanded browser coverage includes two dated AMC 8 papers plus a synthetic undated record with a later save timestamp; it checks answer/blank/domain denominators, reason counts, low-sample suppression, exact-grade filtering, card accessibility labels, 1/2-column layouts at 390/768/1280px, and no overflow at all three widths. The long paper-label test exposed a mobile overflow in the latest-record metadata, fixed with wrapping. Focused competition-review, roadmap and local-record suites passed 38/38. Claude Max read code but did not run tests; Codex ran the browser/unit suite. No push, deployment, cloud sync, or private-item access.

## 2026-10-30 contest-path eligibility wording

The grade menu's AMC choices are learning-path suggestions, not an MAA eligibility check. The selected AMC guidance now tells families to confirm that cycle's age and grade rules at MAA; other contests point families to the organizer's current rules. The manual grouped summary now states that domain counts are entered by the user and that its rates cannot establish a grade band, eligibility, award, or qualification.

The official MAA AMC overview was checked 2026-10-30 for current grade/age eligibility language: https://maa.org/student-programs/amc/ . Focused grade-roadmap unit and browser suites passed 22/22; `git diff --check` passed. Claude Max Opus was invoked twice for read-only review: the first session could not access the local files, and the supplied-excerpt attempt returned no review. No Claude review approval is claimed. Local only; no push, publication, or private-item access.

## 2026-10-30 roadmap section navigation

The Grade 3–12 page now has a sticky, keyboard-accessible shortcut bar for Growth Map, Monthly Plan, Grade Comparison, and Contest Records. It follows the current section while scrolling and uses scroll offsets so sticky navigation does not cover the destination. The quick links preserve the existing single-page content and screen-reader structure.

Visual review used the actual Grade 7 page at 1280×900 and 390×844; the shortcut bar fit both widths and page width matched the viewport. Existing GFIELD design rules and the local UI/UX Pro Max responsive/accessibility guidance were consulted. The reference `math-skill-map` research page is a separate repo and was not changed. `boarding-grade-roadmap.test.cjs` plus `boarding-roadmap-browser.test.cjs` passed 23/23, including section hash, active state, destination offset, mobile overflow, and prior navigation flows. Changed HTML/JS/CSS whitespace checks pass. Local only; no publish or deployment.

## 2026-11-02 Math Kangaroo Grade 7–8 paper comparison

Connected Math Kangaroo manual review summaries to the answer-safe local diagnostic store, which previously accepted AMC/SASMO IDs but rejected `kangaroo`. The roadmap comparison now names the official grade-specific ranking boundary while comparing only same-date, same-paper-memo raw review summaries. It does not calculate grade equivalence or growth. A browser scenario saves the same 30-question Grades 7–8 paper for both grades and verifies paired cards, denominators, the grade-specific rank note, and no mobile overflow. Official basis: https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/ .

Verification: roadmap browser, local-record, competition-profile, and question-bank suites pass 60/60. All work remains local; no original contest questions or student data were added. Private R6 visual and human-review gates remain open in the continuation handoff.

## 2026-11-02 Math Kangaroo official paper-band guard

The official archive groups prior student papers into paired grade bands (including Grades 7–8, 9–10, and 11–12). Math Kangaroo cross-grade review now requires the selected grades to belong to the same official paper band as well as matching date and paper memo. A 7-vs-9 test with identical date and memo is rejected with an explanation; 7-vs-8 remains comparable. Official sources: https://mathkangaroo.org/mks/practice/pdf-exams/ and https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/ .

Verification: Grade 3–12 roadmap model, roadmap browser, and answer-safe local-record suites pass 56/56. Mobile and desktop comparison views were visually inspected with sample records. Claude Max CLI review could not run because the local CLI session is not logged in; no Claude review is claimed. Local-only; private R6 and human-review gates remain open.

Cache-busting versions were also bumped on every HTML page that loads the updated shared diagnostic store, roadmap options, or comparison renderer. The same 56/56 suites were rerun after those HTML changes; CRLF-aware whitespace checks pass.

## 2026-11-02 user-provided Prealgebra reference check

Reviewed the user's private Prealgebra concept-companion PDF through Drive. Its PDF text layer is readable and its Unit 1 concept sequence corroborates the existing optional Prealgebra-to-Algebra 1 flow. No OCR was needed; no original lesson text, exercises, answers, or Drive link were copied into the public repository. No roadmap edit was needed from this source check.

### 2026-11-02 Grade 6 Prealgebra concept bridge follow-up

Made the supplied Grade 6 roadmap connection more explicit: the optional Prealgebra-to-Algebra 1 bridge now names substitution, exponents, and order of operations before operation properties, distribution, and combining like terms. The Grade 6 first-quarter example also names variable expressions and powers alongside its existing number, geometry, and data foundations. This remains an illustrative concept path, not a placement result or fixed pace.

Verification: Grade 3–12 roadmap model/browser tests pass 38/38. The flow was visually inspected at 390px and 1280px; all five stages remain readable without clipping. Changed JS passes `node --check`; CRLF-aware `git diff --check` passes. Local-only; no push or deployment. Current private R6 visual review, independent human math/language and rights review, pilot, reporting validation, and student-use approval remain open.

### 2026-11-02 roadmap preview button styling

Connected the existing journey-preview button class in the roadmap markup. This restores the already-defined G·MAP plum button treatment and visible keyboard focus styling; no new palette or interaction was added. The full Grade 6 and Grade 7 roadmap pages were visually reviewed at mobile width, with the Grade 6 control also checked at 1280px. No horizontal overflow was observed.

Verification: the roadmap model/browser suites pass 38/38, including the button's computed color and 42px target height. `boarding-roadmap.js` passes `node --check`; CRLF-aware `git diff --check` passes. Local-only; no push or deployment.

### 2026-11-02 Grade 7 NS.A public contract recheck

Re-ran the public `7.NS.A` diagnostic engine, locked screener plan, authoring/release manifests, analysis, role-separated report projections, and four-teacher-review readiness checks on the current branch. All 50 tests pass. They confirm the 18-slot plan remains answer-free and locked, the hypothetical report path cannot gain placement authority, and partial teacher review does not release a score. This verifies public contracts only; it does not inspect or approve private candidate items or authorize operational delivery.

Next required work remains independent formal review and release evidence for the separate private `7.NS.A` candidate before the authenticated 18/4 delivery adapter can be implemented. Keep the diagnostic locked. No private candidate content or student data was accessed; no remote sync or deployment occurred.

### 2026-11-02 public roadmap and contest comparison regression

Re-ran the Grade 3–12 roadmap model/browser, contest paper-review model/browser, answer-safe local learning record, and official K–12 contest profile suites on the current local branch: 88/88 pass. Coverage includes same-paper Math Kangaroo comparison for paired grade bands, grade-specific official ranking boundaries, unmatched-paper suppression, domain/error summaries, local answer-free saves, and grade-plan comparisons that do not infer placement. This is public functionality verification only; it does not make a contest diagnostic valid or unlock the private `7.NS.A` screener. No private item content or student record was accessed.

### 2026-11-02 roadmap and public diagnostic continuation

The Grade 10 roadmap now links MAA's current 2027 AIME entry notice and Invitational Competitions overview. The concept-flow section also gives the supplied AMC/AIME study sequence (concepts → topic practice → mixed problems → timed past papers) and advises adjusting pace when interest drops. At the time of this 11/2 entry, Grade roadmap model/browser tests passed 40/40 and the new sequence was checked at 320/390/900/1280px with 16px mobile body text, but screenshot review had not yet occurred. The 11/3 visual follow-up below completes public-roadmap screenshot review via a temporary localhost preview; no private file route or alternate surface was used.

Fresh regression on the current branch passes 76/76 across the public 7.NS.A screener/workbook contracts, AMC/contest review analysis and browser flows, and teacher paper-builder/A4 flows. This confirms public behavior and locked-state contracts only. A subsequent 81/81 public Grade 7 workbook/diagnostic contract run passed across the engine, answer-safe workbook, plan, analysis, report/readiness, release and projection checks; it does not inspect either private candidate. The private Grade 7 AMC 8 R6 candidate remains locked pending current screen/A4 artifacts, human math/language and rights review, pilot, reporting validation, and release gates. The separate private Grade 7 `7.NS.A` screener has its own independent gates. See `boarding-school-math/docs/CONTINUATION_HANDOFF_2026-09-09.md` for details. Latest roadmap map/UI implementation checkpoint: `b3461cfb7` (G·MAP palette refresh, mobile map strip, and mobile comparison/contest readability); local only, no push, deployment, or Drive sync.

### 2026-11-03 AMC/AIME roadmap visual QA

Served the public roadmap from the existing local worktree over a temporary localhost preview and visually inspected the new AMC/AIME study sequence and concept-flow cards. Desktop (1280×900), mobile (390×844), and narrow mobile (320×780) remain legible; mobile body text is 16px. At 320px, inspection found the global header-nav gap from `academy-ui.css` overrode the roadmap's original mobile gap, extending the navigation 2px beyond the content viewport. Added a more specific ≤360px gap rule and bumped the roadmap CSS cache version. After the fix, document scroll width equals client width at 320px (305px due to the visible scrollbar) and 390px (375px); the narrow view has no horizontal page scroll. Also visually checked the Grade 7/8 comparison at 1280px and 390px: two plan columns on desktop, readable stacked comparison on mobile, and an unmeasured grade is labelled as a plan example. Separately inspected the AMC 8 item-review screen at 390px and 320px: unmarked rows stay compact; marking a response wrong reveals both concept-domain and error-reason inputs on mobile, and the 320px document has no horizontal overflow. This was an unsaved synthetic mark in a temporary browser tab; no learner record was stored. This preview covered public UI only. No private candidate content was opened; no release, sync, or deployment occurred.

### 2026-11-03 public regression and private review access

The non-browser roadmap, contest-analysis, local-record, and competition-profile suites pass 41/41 on the bundled Mac Node runtime. A combined browser regression emitted 90 passing tests and no assertion failures, but both browser suites remained pending in teardown; the run was stopped after 261 seconds and is not counted as a complete browser-suite pass. Opening the local `file://` route in the in-app browser was rejected by its URL security policy; no alternate route or rendering workaround was attempted. Current-version desktop/mobile captures and A4 PDF from an authorized path are still needed to inspect the private Grade 7 AMC 8 R6 workbench (42-item contest candidate). The supplied roadmap mockups are design references, not current candidate QA evidence. This is separate from the private Grade 7 `7.NS.A` unit screener (18 slots, 14 automatic/four teacher-reviewed), which has its own independent content, rights, pilot, reporting, and release gates. Both candidates remain locked. No OCR, private content access, external API call, sync, push, or deployment occurred.

The separate 18-item private `7.NS.A` revision-11 pack does have its own answer-free render QA set. Its current SHA-256 matches the pack hash in `private-layout-qa-revision11-20261029.md`, which documents Korean/English/Simplified-Chinese 320px/390px/A4/Letter inspection and six 18-page PDFs. Findings and remaining independent human, rights, screen-reader, pilot, and release gates are recorded in the detailed continuation handoff. Do not conflate these current-for-pack unit-screener artifacts with the stale AMC 8 R6 workbench captures.

### 2026-11-03 Grade 10 aspirational score goals

The Grade 10 roadmap now includes the supplied AMC 12 130+ and Digital SAT Math 800 goals as optional personal challenges, with explicit wording that the roadmap does not predict scores or AIME/USAMO selection. The plan distinguishes AIME entry from USAMO selection and keeps USAMO-style proof practice optional. MAA's current 2027 AIME notice and Invitational FAQ were checked; both describe the current AMC-to-AIME entry thresholds and the 2027 AIME-score-based Olympiad selection framework. Sources: https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/ and https://maa.org/maa-invitational-competitions/ .

Verification: Grade roadmap model suite passes 10/10; changed roadmap data and the browser-test file pass Node syntax checks; `git diff --check` passes. The updated browser assertion was not run in this continuation; no current screenshot or print review was performed for this public copy change. Local only; no push or deployment.

### 2026-11-03 Grade 8 advanced topic coverage

Expanded the provided Grade 8 annual example to name Algebra 2 topics from the supplied roadmap: quadratics, exponential/logarithmic functions, and optional complex numbers, sequences/series, and matrices. The Geometry stage now explicitly keeps the school course in sequence and names trigonometry, circles/ellipses, transformations, and proof. The focus track keeps AMC 10/12 and AIME-style work optional; Algebra 2 extension is conditioned on readiness. This preserves the source's content without implying these topics are required for every Grade 8 student.

Verification: roadmap model suite passes 11/11; roadmap data and both test files pass Node syntax checks; `git diff --check` passes. Mobile browser assertions were updated but not run; visual layout for this longer copy remains unverified. Local only; no push or deployment.

### 2026-11-03 Grade 7 annual plan specificity

The Grade 7 year plan now makes the supplied tracks concrete: Algebra 1 names variable expressions, linear equations, inequalities, and explaining equality properties; school Geometry remains on the regular course path; AMC 10 is introduced as a readiness-based option; and SAT practice connects advanced algebra/geometry word problems with data interpretation. The final period asks learners to time only prepared-scope AMC/SAT-style practice and record whether a concept, idea, or calculation caused difficulty. It remains a learning example, not a placement result.

Verification: roadmap model suite passes 12/12; changed roadmap data and both test files pass Node syntax checks; `git diff --check` passes. Mobile assertions were added but not executed, so rendered layout remains unverified. Local only; no push or deployment.

### 2026-11-03 Grade 7 plan boundary clarification

Clarified that the Grade 7 annual-plan example does not assess a learner's current level or assigned course. The note now explicitly separates the roadmap example from diagnostic placement.

Verification: Grade roadmap model suite passes 12/12; changed roadmap data syntax check and `git diff --check` pass. Browser/visual and print checks were not run. The private R6 current captures/A4 request refers to evidence needed for visual review of the locked workbench; none was supplied, so that review remains open. This entry's commit contains the implementation and handoff update; local only, no push or deployment.

### 2026-11-03 roadmap and contest diagnostic browser regression

Enabled the competition paper-review browser suite to use the same optional `GFIELD_CHROME_EXECUTABLE` override already supported by the roadmap suite. The Mac has Playwright's Chromium revision 1234 but this checkout requested revision 1200; the installed Chrome executable was used for this run. Updated one Grade 8 browser expectation to match the current displayed course copy (“Geometry는 학교 과정에서 이어가요”).

Verification: roadmap model/browser and paper-review analysis/browser suites pass 69/69 in a single run, including grade comparisons, MAP same-scale handling, same-paper competition comparison, Math Kangaroo paired-grade links, and mobile reflow checks. Public Grade 7 NS.A workbook/screener-plan/authoring-manifest/analysis/report/scoring/release contracts pass 61/61. Changed tests pass syntax checks and `git diff --check`. This is automated public regression only; it is not a fresh screenshot or print review of private R6. Candidate remains locked; local only, no push/deployment.

### 2026-11-03 teacher paper builder mobile list flow

On phones, the 36-row question list and selected-question list now grow with the page instead of creating nested scroll areas. The fixed selection-count shortcut to paper settings remains available. The builder's browser test can use `GFIELD_CHROME_EXECUTABLE` when the Playwright-pinned Chromium revision is absent.

Verification: teacher paper-builder browser suite passes 11/11, including all 12 public unit worksheets, answer-key separation, A4 pagination, mobile/tablet width checks, and the new assertion that all 36 rows remain in normal page flow at 390px. Rendered and inspected the current mobile page; all 36 rows appear in sequence, page width equals viewport width, and no clipping was visible. Print source was unchanged; browser A4 generation tests passed. Local only; no push or deployment.

### 2026-11-03 A4 print sample visual review

Generated a temporary A4 student-paper sample from three selected public Grade 7 workbook items with the formal cover. The PDF contains one cover and two numbered question pages. Rendered and inspected every page: title, date/time/points, question visuals, choices, margins, watermark, and page numbers are legible; no overlap, clipping, blank page, or missing glyph was observed. The temporary PDF and page renders are removed after QA. This validates the public paper builder's print route only; it does not provide visual evidence for the separate private Grade 7 AMC 8 R6 workbench or the private 7.NS.A screener.

### 2026-11-03 private candidate identity and QA artifact recheck

Corrected an earlier handoff association: the private R6 `review-workbench.html`, `candidate-form-order.json`, and requested desktop/mobile/A4 visual QA belong to the 42-item Grade 7 AMC 8 contest candidate at `/Users/docssam/Documents/Codex/GFIELD-private/boarding-school/grade7-amc8-20261029`. They do not belong to the separate 18-slot private Grade 7 `7.NS.A` unit screener at `/Users/docssam/Documents/Codex/GFIELD-private/boarding-school/grade7-nsa-20261017`.

Metadata-only check on 2026-11-03 confirms the AMC candidate's desktop, 390px and 320px screenshots and A4 PDF are still timestamped 2026-10-29 22:24:17, while its current review workbench is timestamped 2026-10-30 02:59:31. They predate the current workbench and cannot close its visual gate. No private item content was opened. The AMC R6 candidate and the 7.NS.A screener both remain locked pending their own independent review and release requirements; no user file delivery or approved browser route was received in this turn.

### 2026-11-03 Math Kangaroo official within-grade percentile comparison

Math Kangaroo review now accepts the nationwide percentile copied from the official score report, stores it with the answer-free local review summary, and shows it beside each grade's same-date/same-paper review card. When both paired Grade 7/8 records have official percentiles, the roadmap reports the difference in percentile points and states that this compares relative position within each grade cohort; it is not a growth or math-skill comparison. Inputs outside 0–100 are rejected, and the field is hidden for other contests. Official scoring basis: https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/ (grades receive separate state and nationwide rankings/percentiles; verified 2026-11-03).

Verification: public browser flow on a local preview saved synthetic Grade 7 (72.5%) and Grade 8 (81%) records for the same date/paper, displayed +8.5 percentile points and the interpretation boundary, and suppressed no matching information. Checked the form at 390px; document width matched the viewport. Confirmed the field hides for AMC and rejects 100.1. No browser console errors. `git diff --check` requires CRLF-aware handling for `learning-plan.html`; all authored content changes are tracked in the intended one-line cache-version update. The repository Node/Playwright test suite could not run because this Mac execution environment has no Node/Bun binary. Synthetic records were entered only in the localhost preview origin and the two test records were removed after review; no real learner data or contest items were used. Local only; no push, publication, Drive sync, or deployment.

### 2026-11-03 verification follow-up after Math Kangaroo percentile source refresh

Found and fixed a stale source-freshness assertion that still expected every Math Kangaroo source to use the older general verification date. The scoring-page reference is now explicitly accepted at its 2026-11-03 verification date, while the prior-paper archive and MAA entries retain their separate dates.

Verification: Grade 3–12 roadmap, contest review analysis, local diagnostic storage, and competition-profile model suites pass 36/36. Public Grade 7 NS.A/workbook contracts pass 81/81. A first browser run found an optional-percentile helper passing `undefined` for Grade 9; the helper now skips that optional input. The full roadmap and contest-review browser suites pass 49/49 with Playwright 1.62.1 restored under `/tmp` from the lockfile using verified package integrity and the already-installed Chrome executable. `git diff --check` and changed-test syntax checks pass. No project dependencies or lockfiles changed. Private candidate state remains locked and untouched; local only.

### 2026-11-03 G·MAP branded learning map refresh

Recolored the shared learning-world illustration to G·MAP's violet/lavender and cream palette while preserving the connected study islands and math landmarks. Added an optimized 1800×720 version at `boarding-school-math/assets/roadmap/mathematics-learning-world-gmap.webp`; the original remains available. The Grade 7 guidance prompt now sits inside the illustrated map without obscuring route stops. Phone layouts retain their text-first vertical path.

Verification: the Grade roadmap browser suite passes 31/31, including branded map use across Grades 3–12, Grade 7 prompt placement and overlap checks, and responsive widths. Rendered and inspected the 1280px desktop preview; `git diff --check` passes. No private candidate content or learner data accessed; local only, no push or deployment.

The next map pass placed each grade's scenic route before the curriculum-detail cards, so the new branded artwork appears earlier on desktop. The Grade 8 desktop preview now shows the map before the school/contest/SAT detail and concept bridge; this does not change any grade content or learner-status claims. The same 31/31 browser suite now asserts this ordering across Grades 3–6 and 8–12, alongside the existing mobile and map checks.

### 2026-11-03 mobile map-label readability

Raised selectable route labels to 16px and stop numbers to 14.4px on phone layouts. The Grade 3–12 roadmap browser suite passes 31/31, including the mobile type-size assertion, keyboard selection, all-grade branded-map use, and responsive layout. Inspected Grade 7 at 390px and 320px; labels are 16px and the document has no horizontal overflow at either width. Local only; no push or deployment.


### 2026-11-03 G·MAP map palette and phone presentation

Replaced the shared route artwork with a higher-contrast G·MAP version: deep-violet path, ivory island surfaces, lavender math forms, and restrained sage trees. The image was created with the built-in image tool from the previous map composition, has no labels or logo, and is optimized as a 1983×793 WebP (186 KB). Desktop keeps route stops over the islands; phones show the panorama as a 2.5:1 strip above the vertical route. Mobile grade-comparison descriptions and contest guidance/domain labels were also enlarged.

Verification: the Grade 3–12 roadmap browser suite passes 33/33, including map coverage for all grades, mobile map-strip asset/size, comparison text size, contest guidance size, and 320px/390px no-overflow. Local renders were visually reviewed at 1280px, 390px, and 320px; stop cards remain legible over the art and route names remain in vertical flow on phones. `git diff --check` passes. Code and asset were committed locally as `b3461cfb7`; no push, deployment, or Drive sync.

### 2026-11-03 shared Pre-Algebra reference integrated

Read the user-provided `AmysMathConcepts_Prealgebra_Complete_Unit1.pdf` through its embedded text; it was not a scan, so OCR/Apple Vision was unnecessary. Updated the optional concept-flow example to follow its Unit 1 progression: build/evaluate variable expressions → exponents and order of operations → translate words into expressions → operation properties → distributive property → combine like terms. The note identifies this as a source-informed example, not a grade placement or diagnostic result. No exercises or answer keys were copied.

Verification: Grade roadmap model tests pass 12/12 and Grade 3–12 roadmap browser tests pass 33/33, including the 320px/390px/tablet/desktop concept-flow layout. `git diff --check` passes. This applies only to the public learning map; the separate locked private candidates remain under their recorded independent review gates. Local only; no push, deployment, Drive sync, or external API call.

### 2026-11-03 contest review and official-source recheck

Rechecked MAA's current AMC overview and 2026–27 Invitational guidance. The public manual paper review still limits itself to user-entered marks, self-selected domains/error reasons, descriptive within-paper comparisons shown only when each compared domain has at least three attempted items, and a conditional raw-score reference; the three-item display rule is not a validated diagnostic threshold. It does not infer an AMC/AIME level or placement. Current AMC source verification dates are updated to 2026-11-03. The 2027 AIME score thresholds remain cycle-specific and require age 13 plus other eligibility; the UI only displays threshold progress for matching US/Canada MAA contest, form, date, and cycle records and does not decide eligibility.

Verification: current roadmap/contest/profile/model suites pass 34/34, browser suites pass 51/51, and current source/catalog contract suites pass 16/16. A synthetic AMC 8 review was also rendered at 1440px and 390px; mobile page width remained 390/390 and the temporary entry left local storage empty. The skip link seen in full-page capture was offscreen in the actual viewport, with focus on the result heading. `git diff --check` passes. A requested read-only Claude review could not start because Claude Code CLI reports `Not logged in`; no Claude findings are claimed. No private candidate or student data was read. Local only; no push or deployment.

### 2026-11-03 Grade 6–7 annual-plan resource links

Added source-matched online links to each of the four Grade 6 and Grade 7 annual-plan stages. Grade 6 links point to AoPS Prealgebra, Khan Academy Pre-algebra, AMC 8 practice, Beast Academy 5D, Khan Academy Digital SAT, and College Board SAT question-bank/practice pages. Grade 7 links point to AoPS Introduction to Algebra, FlippedMath Grade 7 geometry, MAA AMC information, Khan Academy Digital SAT, and College Board SAT practice. Resource names remain alongside the original plan examples; links open in a new tab with `noopener noreferrer`. Link styling uses the existing G·MAP violet and has visible keyboard focus. No resource links were inferred for Grade 9.

Primary source checks: AoPS textbook pages describe the Prealgebra and Introduction to Algebra scope; Khan Academy labels its Digital SAT prep as an official College Board partnership; College Board's Student Question Bank provides SAT Math questions; Beast Academy lists its 5D book; MAA provides AMC program information. AMC practice archive link is AMC Trainer, a third-party archive, and is labeled as practice rather than an official MAA resource.

Verification: the changed data module imports successfully in the Node REPL and focused assertions confirm all 8 Grade 6–7 stages have titled HTTPS resources while Grade 9 remains unlinked. The roadmap renderer parses through its safe early-return path. Opened the local page in headless Chrome and inspected Grade 7 at 1280px and true 390px device emulation; desktop and mobile annual-plan links render in the G·MAP violet style, three of seven Grade 7 links appear in the first mobile viewport, and `scrollWidth` equals `clientWidth` at 390px. Chrome's rendered DOM confirms four linked stages for each of Grades 6 and 7. Scoped `git diff --check` passes. The standard Node and Playwright test suites were not run because the shell has no `node` binary and the in-app browser automation API returned `browser.user is unavailable`; test assertions are present but pending execution. No candidate data or private assessment items were accessed. Local only; no push or deployment.

### 2026-11-03 follow-up: bundled runtime regression and cross-grade rendering

Found the Mac Node and Playwright bundled with the ChatGPT app and used the installed Google Chrome through `GFIELD_CHROME_EXECUTABLE`. The Grade 3–12 roadmap model/browser suites pass 46/46. Competition practice, competition original-link contract, contest profile, placement engine, and public Grade 7 NS.A plan/authoring/analysis/report/scoring/release/workbook suites pass 80/80. Competition paper-review browser tests pass 18/18. Total related regressions: 144/144.

The broader run exposed that `competition-practice-browser.test.cjs` did not accept the installed Chrome override and failed to start Playwright's absent pinned Chromium 1200. Added the same optional executable override used by the other browser suites and guarded cleanup after startup failure; its six browser checks now pass. This changes test startup only, not the contest practice product. A direct Chrome protocol sweep rendered Grades 6, 7, and inferred Grade 9 at 1280px and true 390px widths: every Grade 6–7 stage has secure HTTPS links, Grade 9 receives no invented resource links, G·MAP artwork is present at both breakpoints, and document scroll width equals content width.

`node --check` and scoped `git diff --check` pass. Private Grade 7 `7.NS.A` and AMC R6 item candidates remain locked; the public suites validate release boundaries and do not satisfy independent item, rights, accessibility, pilot, or release approvals. No private item content or learner records were accessed. Local only; no push/deployment.

Metadata-only Google Drive recheck searched for the AMC R6 desktop/mobile captures, its current A4 review PDF, and the Grade 7 NS.A revision-11 review record; all four searches returned no results. No files were downloaded or opened. Current candidate evidence and approval state remain unchanged.

### 2026-11-03 GFIELD Precalculus course and horizontal fraction rendering

Added the original GFIELD Precalculus student/teacher A4 workbook and pathway entry. The course has five units, 15 lessons, and 30 original practice prompts: function structure/transformations; polynomial and rational graphs; exponential/logarithmic and sequence models; unit-circle trigonometry; vectors, complex numbers, and model selection. It is scoped to named Common Core high-school function, algebra, vector, and complex-number standards. Grade placement and sequence remain school-dependent; limits and calculus are not taught.

Updated the shared inline math renderer to stack symbolic numerator and denominator content on a horizontal rule. It now handles Greek/Korean labels, π-variable products, radicals, absolute-value factors, and parenthesized products such as `x(x+2)`. It preserves rate notation (`km/h`, `m/s`) and contest names (`AMC 12/AIME`) as literal slash text. All six HTML consumers load cache version `20261103-11`.

Verification: 18/18 focused course/pathway/roadmap model assertions pass. Three focused Chrome workbook checks pass for Geometry, Algebra 2, and Precalculus; these confirm horizontal-bar CSS, the `2π/|B|`, `πt/6`, `−√3/2`, Korean trig ratio, and nested algebraic denominator cases, plus student/teacher page counts. A separate 11/11 focused roadmap browser check passes for grade comparison, same-paper Math Kangaroo records, high-school route comparison, and course links. The full roadmap browser suite was not rerun to completion. No print-to-PDF review was performed. No private item data was opened. Local-only; no push or deployment.

### 2026-11-03 Grade 7 course links use GFIELD originals

Replaced the Grade 7 Algebra 1 and Geometry checkpoint materials that previously linked to external course pages with the matching GFIELD-original A4 workbooks. The annual-plan references now point to these same courses. Common Core standard references and MAA competition guidance remain separate source links; no course order or grade placement is inferred.

Verification: Grade 3–12 roadmap model tests pass 12/12; focused Chrome checks for the Grade 7 checkpoint links and Grade 6–7 annual-resource links pass 2/2. Internal course links open in the same tab and use the existing keyboard-visible link treatment. No private item data was opened; local only, no push or deployment.

### 2026-11-03 Grade 6 Pre-Algebra path uses GFIELD learning material

Updated the optional Grade 6 annual example to lead with GFIELD's 10 original concept lessons, six reviewed public Grade 6 unit-workbook topics, and the separate 10-question GFIELD AMC 8 practice set. The remaining four Grade 6 workbook drafts are still pending independent review and are not linked as public resources. The SAT foundation stage links to GFIELD ratio/problem-solving concepts and the College Board's official Math question bank. MAA and College Board references remain labeled as sources, not GFIELD-authored material. Replaced displayed AoPS/Beast Academy/PWN labels in the Grade 6 example; the optional enrichment plan stays separate from school placement. Grade 10's final stage still uses the existing generic “proof practice · selected contest problems” resource description; it has not been replaced by a GFIELD workbook claim.

Verification: Grade 3–12 roadmap model tests pass 12/12, including assertions that Grade 6 resources resolve to GFIELD concepts/workbooks and original AMC 8 practice. A focused Chrome annual-plan check passes 1/1; it follows the 6.EE.A concept link and AMC 8 practice link to their actual pages. Local-only; no push, deployment, or Drive sync.

### 2026-11-03 Roadmap grade and contest comparisons rechecked

Rechecked grade-route comparison, manual AMC 10 domain-entry diagnosis, same-paper/same-date contest-record comparison, Math Kangaroo Grade 7–8 paired-paper comparison, upper-grade planning boundaries, and mobile contest labels. Updated two stale browser assertions so they match the current Grade 9 roadmap wording and browser-rendered line breaks; no private diagnostic content was opened.

Verification: focused Chrome checks pass 5/5; roadmap model tests pass 12/12. This verifies the current comparison and manual-diagnostic flows, not a calibrated readiness/placement score. Local-only; no push, deployment, or Drive sync.

### 2026-11-03 Correct Grade 6 public-workbook count and route

Audited the Grade 6 annual-plan wording against the current release inventory. The earlier “10 topic workbooks” label counted private drafts as public resources. Replaced it with the ten public concept lessons and the reviewed public `6.EE.A` workbook (36 items), and linked the lesson and workbook separately. The four unreleased Grade 6 workbook drafts remain pending review and are not offered as public material. Updated the README to state this boundary.

Verification: Grade 3–12 roadmap model tests pass 12/12. Focused Chrome annual-resource check passes 1/1; it follows the 6.EE.A concept link to its lesson, the workbook link to the public unit workbook, and the AMC 8 practice link to its page. `node --check` and CRLF-aware `git diff --check` pass. Local only; no private item data opened, no push, deployment, or Drive sync.

### 2026-11-03 Recheck full roadmap browser suite

The full Grade 3–12 roadmap browser suite exposed one stale course-link test: it expected the Grade 7 Algebra 1 annual-plan link to navigate to the roadmap's inline course section, while the current link correctly opens the standalone GFIELD A4 workbook. Updated the test to verify the actual workbook page and then separately verify the inline course overview. No application behavior changed.

Verification: the full Grade 3–12 model and browser suites pass 51/51. This includes Grade 6 released-material links, Grade 7 Algebra 1/Geometry original workbooks, grade/contest comparisons, contest-record boundaries, mobile layouts, and the 7.NS.A public workbook route. No private diagnostic candidate was opened or modified. Local only; no push, deployment, or Drive sync.

Additional release-boundary check: competition paper-review and practice model/browser suites pass 36/36. The Grade 7 `7.NS.A` public workbook, screener plan/analysis, authoring and release manifests, teacher reports, and scoring-readiness suites pass 61/61. The public contracts continue to show the unit screener as locked and non-placement with teacher reviews pending. This does not inspect, approve, or release private item candidates.

### 2026-11-03 Reconcile Grade 6 public-resource counts across home and course views

Updated the home page, Grade 6 skill map, Pre-Algebra course card, and diagnostic QA notice to distinguish ten public concept lessons from the six reviewed public unit workbooks. The four unreleased workbook drafts are no longer counted as available materials. The diagnostic notice now distinguishes those public study resources from diagnostic-driven assignment, which remains locked. Updated the course-map test for the five Algebra 2 areas and its original workbook route, and made the browser harness use the installed Chrome override with safe cleanup after launch failure.

Verification: course-path model tests pass 2/2 and the full home/SASMO browser suite passes 7/7, including Grade 6 availability copy, direct course links, accessibility, and mobile overflow. The 51/51 Grade 3–12 roadmap suite and 36/36 competition review/practice suite remain passing from the same working version. No private diagnostic item candidate was opened or changed. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Stack fractions in roadmap checkpoint text

The shared fraction renderer was already used by the GFIELD course workbooks and roadmap's `setText` helper, but Grade 7 checkpoint prompts were inserted with `textContent`, leaving any `a/b` math as a slash. Route those checkpoint prompts through the shared renderer so the numerator and denominator stack over a fraction bar; the accessible fraction label remains available. The course workbook browser check also confirms Algebra 1's rational coordinate values render as stacked fractions.

Verification: the full roadmap browser suite passes 39/39, including Algebra 1, Algebra 2, Geometry, Precalculus, Grade 7 checkpoint, and responsive layout checks. Local only; no private candidate data accessed, no push or deployment.

### 2026-11-03 Prealgebra Unit 1 Korean learning objectives

Aligned the optional Prealgebra Unit 1 flow with curriculum wording: “문자를 사용해 대수식을 나타내고,” “식의 값,” “동치인 식,” “대수식 전개,” and “동류항을 결합.” This keeps the six supplied concept steps while making the student-facing labels explicit about the mathematical action and object.

Verification: Grade 3–12 roadmap model suite passes 12/12; the four-viewport (320, 390, 900, 1280px) concept-flow browser check passes 1/1. No placement or diagnostic claim added. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Keep mathematical fractions distinct from counts

Visual review of the full Grade 9 roadmap exposed that the shared math formatter was turning stage progress `1 / 4` into a stacked fraction. Keep stage progress and competition classified/attempted summaries as ordinary count text. Preserve the contest label `AMC 10/12` as slash notation while retaining stacked rendering for actual fractions. Bumped the shared renderer and roadmap script cache keys on all six consumers so open browser tabs fetch the updated code.

Verification: all 39 roadmap browser checks pass, including the 320/390/900/1280px concept flow, stage count, competition count summaries, AMC 10/12 label, and stacked fractions in Algebra 1/2, Geometry, and Precalculus. The roadmap checkpoint routing check passes 1/1 after the new AMC-label assertion. A local 390px Chrome render confirms stage text `단계 1 / 4`, zero fraction nodes in that label, and no horizontal overflow. No private item content was used. Local only; no push or deployment.

### 2026-11-03 Fraction rendering in teacher paper output

The teacher paper-builder regression check revealed that the shared renderer rejected `3/2x` in a coefficient context because it treated the following variable as part of a word boundary. It now renders the unambiguous trailing single-variable form as a stacked `3/2` followed by `x`; explicit compound denominators still use parentheses. Updated the answer-key browser assertion to check accessible fraction readings and preserved units instead of the source slash string, which is no longer visible after formatting. All six shared-renderer consumers now load cache version `20261103-13`.

Verification: teacher paper-builder browser suite passes 12/12, including question search/selection, actual stacked answer choices, separate answer-key fractions, A4 page fitting, and mobile/tablet overflow. No diagnostic candidate content or learner records were used. Local only; no push or deployment.

### 2026-11-03 Stack fractions in Grade 7 rate diagrams

Extended the fraction-bar treatment into the Grade 7 `7.RP.A.1` unit-rate diagram. Its distance and time quantities now use stacked numerator/denominator markup, matching the prompt and answer choices; the `km/h` unit label remains conventional slash notation. Updated the public workbook cache keys and added a browser regression assertion for the printed question diagram.

Verification: teacher paper-builder browser suite passes 12/12. A print-media A4 render of the public `g7rpa-w01` item visually confirms both diagram fractions are stacked and legible without clipping. Local only; no private diagnostic content used, no push, deployment, or Drive sync.

### 2026-11-03 Preserve multi-character units in shared fraction rendering

Cross-course A4 visual review found the shared fraction renderer splitting the Algebra 1 unit rate `달러/km` after the first denominator letter, producing a misleading stacked fragment. Restricted the optional trailing-variable case to numeric or parenthesized denominators; `3/2x` remains a stacked coefficient while unit text stays intact. Bumped all six HTML consumers to math-renderer cache version `20261103-14` and added a regression case for `달러/km`.

Verification: Grade 3–12 roadmap, teacher paper builder, Algebra 1, Geometry, Algebra 2, and Precalculus model/browser suites pass 59/59. Print-media A4 samples across the four original course workbooks show stacked fractions without page overflow; a fresh Algebra 1 teacher page confirms `달러/km` stays intact and coordinates render as stacked fractions. Local-only; no private item content used, no push, deployment, or Drive sync.

### 2026-11-03 Math fraction display and 2027 AIME reference

Routed concept-flow headings and steps through the shared math-text renderer, so actual numeric or algebraic fractions use a stacked numerator, fraction bar, and denominator instead of slash text. Existing labels such as AMC 10/12 and stage counts remain ordinary text. The Grade 8 and Grade 10 AIME practice stage now links to the official MAA 2027 eligibility page and distinguishes AIME-style study from exam eligibility; the note is explicitly tied to the 2027 U.S./Canada rules and directs other years/regions to their organizer.

Verification: Grade 3–12 roadmap model tests pass 12/12 and browser tests pass 39/39, including Grade 7 fraction checkpoints, AMC 10/12 notation, concept flows, and responsive layouts. `node --check` and CRLF-aware `git diff --check` pass. Local only; no push, deployment, or Drive sync.

### 2026-11-03 live Grade 7 fraction and Grade 9 route check

Opened the current local Grade 7 `7.NS.A` student workbook in Chrome at 390×844. The page rendered MathML fractions with stacked numerator and denominator (`mfrac` elements present), preserved the progress count as `0 / 36`, reported no page errors, and stayed at 390/390 document width. Opened the inferred Grade 9 route at 1280×900 and 390×844: both sizes retained the “학교 과목 확인” label and school-sequence note, with no horizontal overflow or page errors. This is a live screen render, not a saved-PDF review.

Checked Claude Code authentication after the prior review attempt: the CLI remains logged out. No candidate content was sent. The Grade 7 private diagnostic and AMC R6 independent-review gates remain open.

### 2026-11-03 Grade 7 NS.A roadmap now opens GFIELD material

Removed the two FlippedMath lesson links from the Grade 7 `7.NS.A` checkpoint now that GFIELD's own student workbook is available. Kept the Common Core source link for standards scope; the separate student action opens the GFIELD 36-question workbook in Korean with A4 selected. The external FlippedMath lesson pages remain source examples in the handoff only and are not the learner destination.

Verification: roadmap model tests pass 12/12 and browser tests pass 39/39. In a live 390×844 Chrome session, the checkpoint exposed only the official standards link plus the local GFIELD workbook action; opening it loaded all 36 questions at 390/390 document width with no page errors. `git diff --check` passes. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Grade 7 AMC 10 manual-diagnostic path

Ran the public Grade 7 AMC 10 flow in a temporary 390px Chrome session with synthetic domain counts only. The selector exposes AMC 10, renders separate Algebra, Number Theory, Geometry, and Combinatorics rows, produces a descriptive partial result, and the item-review link opens `competition-paper-review.html?grade=7&program=amc10`. The report states that entered domain rates do not yield an official score, skill level, eligibility, qualification, or course decision. Document width stayed 390/390; no browser errors occurred. No learner record or private candidate content was used, and no input was saved.

### 2026-11-03 Grade 7 AMC 10 concept practice and stacked fractions

Added a GFIELD-authored AMC 10 topic-practice page and linked it from the Grade 7 optional 4–6 month enrichment route. The 12 original questions cover algebra, number theory, geometry, counting, and probability; each includes a hint, worked solution, and a question about the reasoning. The page separates concept/type/connection practice from official-paper timing, links MAA for the published AMC scope, and states that the practice does not determine skill, placement, score, or qualification. No contest questions were copied. Fraction answers and worked calculations render with stacked numerator, fraction bar, and denominator; literal progress counts and unit/contest slash text remain unchanged.

Verification: live local browser shows all 12 questions and 60 choices, and computed fraction layout includes a visible 1px numerator rule. Screenshot review confirms stacked probability choices. A wrong answer leaves remaining choices available; a correct retry updates progress; the topic filter works and answered state persists after returning to all topics. The current browser layout had no horizontal overflow at 1265px desktop and 375px mobile. Added a browser regression assertion for the fraction bar. Automated Node tests were not run because Node/npm/bun are unavailable in this Mac shell. No private candidate content was opened. Local only; no push, deployment, or Drive sync.

Follow-up verification on this Mac supersedes the runner note above: the bundled ChatGPT Node 24 and Playwright 1.62.1 were found and used with the installed Chrome executable. The current full roadmap model/browser suite passes 53/53.

### 2026-11-03 Original AIME-style practice path

Added `boarding-school-math/aime-practice.html` with 12 original GFIELD-created short-response problems across Algebra, Number Theory, Geometry, and Counting. The concept → type → connection sequence is labeled as a study structure, not an AIME level. Each prompt has a 0–999 integer answer field, retryable self-check, hint, worked solution, and connection question. Actual fractions in worked solutions use the shared stacked numerator/bar/denominator renderer. Domain and stage filters work; attempt state stays in memory only and is not a learner record. Grade 8 AIME enrichment and Grade 10 AIME-preparation course stages now open this local page. MAA is linked only for the published response format and contest/eligibility information; this page does not reproduce official timing or question count and cannot diagnose ability, placement, or eligibility.

The answer sum for multiples of 3 or 5 was caught during solution review and corrected to 2,418 before final validation. Browser checks confirm all 12 expected answer values, input bounds, retry, filters, hint/solution disclosures, fraction display, and desktop/mobile overflow. The full Grade 3–12 roadmap model/browser and AIME page browser suites pass 53/53. A fresh 1280px render was visually inspected; the 390px render and no-overflow behavior were checked in browser automation. No private Grade 7 candidate content or learner records were opened. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Preserve grade context across contest-practice routes

The AMC 10 original practice route now carries the learner's selected Grade 7 or 8 context into its roadmap and item-review links. The shared AIME-style practice page carries Grade 8 or 10 context and switches its related AMC link to AMC 10 topic practice or Grade 10 AMC 12 paper review accordingly. Annual and stage links now pass the selected grade explicitly; the practice bank remains shared across grades without implying placement or readiness.

Verification: tested all four grade contexts, related links, and return labels. A stale browser expectation for the Grade 7 query string was corrected. The full Grade 3–12 roadmap model/browser plus AIME page browser suite passes 54/54. `node --check` and `git diff --check` pass. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Show AIME practice fractions with a fraction bar

The AIME practice page loaded the shared math-text renderer but omitted its stylesheet, so fractions did not receive the stacked numerator, bar, and denominator presentation. Added the shared fraction CSS and browser assertions for both inline-grid stacking and a visible numerator border.

Verification: the AIME practice browser test passes 1/1, including actual rendered fraction styles, answer validation, filters, explanations, and responsive layout. `git diff --check` passes. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Add manual AIME paper review and same-paper grade comparison

Added an optional 15-item AIME review choice to Grade 8+ contest diagnostics, based on the current MAA question/response format. The entry is for a user-marked AIME or personal practice set; the interface links the official MAA page and explicitly does not decide invitation, eligibility, or selection. It uses the existing four-area review taxonomy, stores only aggregate marks, and produces no AIME score or level. Grade comparisons require same date and paper memo and remain unadjusted descriptive summaries. Local-record validation accepts AIME only for Grade 8+ and retains no response-level data.

Verification: roadmap, paper-review analysis, and local-record model tests pass 40/40. Competition paper-review browser suite passes 19/19, including Grade 8/9 same-date/same-paper comparison, no AIME score estimate, MAA source visibility, and answer-free saved summaries. Official format reference checked at https://maa.org/maa-invitational-competitions/ on 2026-11-03. No private diagnostic items or learner records were used. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Current high-school course and comparison audit

Rechecked the active public routes after the local Algebra 2, Geometry, and Precalculus workbooks were added. Grade 8 optional Algebra 2/Geometry, inferred Grade 9 Algebra 2/Geometry/Precalculus, and Grade 10 Precalculus resources now resolve to GFIELD-authored workbooks; remaining outside links are official standards, assessment practice, or contest organizer references. Grade-to-grade comparison keeps inferred plans labeled, compares MAP RIT only on the same vertical scale, keeps CTP/SSAT/ISEE source values separate, and requires a matching date and paper memo for contest marks. No numeric grade band or course-placement verdict is derived from those records.

Verification: the full roadmap, high-school course model, and course-pathway/browser suites pass 59/59 on the current Mac worktree, including Algebra 2/Geometry/Precalculus workbook routes and comparison behavior. The AIME-specific competition browser suite independently passes 19/19. No private diagnostic candidates or student records were accessed. Local only; no push, deployment, or Drive sync.

### 2026-11-03 Review stacked fractions in A4 workbook output

Visually reviewed fresh Chromium print-media captures from the public Pre-Algebra student workbook cover and a fraction lesson, plus the matching teacher solution page. Fractions display with a stacked numerator, visible horizontal bar, and denominator in student prompts and teacher explanations. Text is legible with no clipping or overlapping in the sampled pages. The cover retains the name/class/date fields and standards note. This was a visual sample of the rendered pages, not a saved or distributed PDF; the lesson page has generous unused writing area by design.

Verification: captures `/tmp/gfield-prealgebra-a4-student-page1.png`, `/tmp/gfield-prealgebra-a4-student-fraction.png`, and `/tmp/gfield-prealgebra-a4-teacher-fraction.png` reviewed individually. The relevant current roadmap, Pre-Algebra, course-pathway, and paper-builder browser/model suite passes 75/75; JavaScript syntax and `git diff --check` pass. No private diagnostic items or learner records were used. Local only; no push, deployment, or Drive sync.

Follow-up: created temporary Chromium A4 PDFs for the Pre-Algebra student and teacher editions and rendered page 5 from each. Both are true A4 (594.96 × 841.92 pt), 59 pages, with stacked fractions and their bars intact on the printed lesson and worked solution; the text is legible and the page number is present. These are QA outputs in `/tmp`, not publication files. Also re-ran the updated Grade 3–12 roadmap model/browser, learning-plan browser, and course-pathway suites: 68/68 pass. Fresh 390px screenshots of the Grade 7, 8, and 10 annual-plan sections show the revised copy and linked materials without card overflow or browser errors; the page-width assertions remain zero-overflow. No private candidate content or learner records were used.

### 2026-11-03 Check public contest review against current organizer rules

Compared the published competition profiles and learner-facing review flow against the current official MAA 2026–27 rules (updated 2026-10-30), MAA AMC overview, and Math Kangaroo USA's format and scoring pages. The current model matches AMC 8/10/12 question counts, durations, age/grade limits, topic scope, and scoring; the AIME progress note remains cycle- and region-specific. Math Kangaroo keeps paired question-paper bands separate from official per-grade rankings and accepts a reported within-grade percentile instead of manufacturing a GFIELD percentile. No model change was needed.

The targeted contest and route regression initially found one stale AIME browser assertion: it expected an older comparison sentence. Updated the test to assert the current, more explicit message that records are paired by entered date/memo and that same paper identity, difficulty adjustment, and growth/level are not verified or inferred.

Verification: competition-paper-review browser, contest-analysis, AMC-score-history, competition-profile, and competition-practice suites pass 48/48 on current Chrome. Official references: https://maa.org/wp-content/uploads/2026/10/2026-2027-AMC-8-10-12-Policies.pdf (2026–27 MAA rules, updated 2026-10-30), https://maa.org/student-programs/amc/, https://mathkangaroo.org/mks/faqs/about-the-test/, and https://mathkangaroo.org/mks/resources/math-kangaroo-scoring/. No private item content or learner record was accessed. Local only; no external API, push, deployment, or Drive sync.

Revalidated the public Grade 7 `7.NS.A` assessment and learning contract on the same branch: diagnostic engine, learning-delivery and item-release contracts, screener plan/authoring/analysis/report/scoring/readiness/release manifests, and the student unit workbook pass 80/80. The tests keep the 18-slot diagnostic locked and answer-free, require bound teacher review, reject automatic placement, and verify the separate public workbook. Private revision-11 content was not opened or changed; independent review, pilot, and release authorization remain open.

Additional print QA on the released public Grade 7 `7.NS.A` workbook generated temporary Korean A4 student and teacher PDFs in `/tmp`. The student PDF has 12 pages; the teacher edition has 20. Rendered page 4 from each: signed fractions in prompts, choices, diagrams, and worked teacher solutions retain stacked numerator/bar/denominator layout with no clipping or page overflow. The full unit-workbook browser suite passes 50/50, including all three locales, both audiences, A4/Letter print layout, and checks for slash-form numeric fractions. These are disposable QA files, not distribution copies.

### 2026-11-03 Grade-comparison display audit

Used synthetic, unsaved MAP Growth examples to inspect the Grade 7/8 plan and evidence comparison at 1280px and 390px. The screen keeps the side-by-side course roadmap separate from the entered results; it shows same-scale RIT difference and only shows percentile-point difference when norm year, season, and instructional week match. The copy asks the family to verify that both records belong to the same learner and says the comparisons do not determine expected growth, mastery, level, or course placement. Other assessment sources and contest records remain separate panels. Both widths had no page overflow or browser errors; no learner data was entered or persisted.

### 2026-11-03 Grade 10 proof-writing workbook

Added an original GFIELD proof-writing workbook for the Grade 10 10–12 month stage and linked it from that annual-plan period. The student and teacher editions share eight prompts covering direct proof, inequality reasoning, contrapositive, divisibility, counterexample, triangle congruence, coordinate geometry, and contradiction. Student responses are not saved or scored. The teacher edition presents one model explanation per prompt; it is not a unique required solution. The roadmap now names the stage “주장을 근거로 설명하기” and describes its focus using claim, evidence, counterexample, and proof strategy language.

Verification: Grade roadmap model tests pass 12/12 and the full Grade 3–12 browser suite passes 44/44 (56/56 total across model and browser suites). The annual-plan link, student/teacher switch, five stacked mathematical fractions, and no page overflow at 1280px or 390px are covered. Student and teacher A4 PDFs both render as 3 pages; the student edition has writing space and the teacher edition shows solutions. Printed coordinate midpoint and rational-number examples use stacked fractions. Visual review at desktop, mobile, and PDF found no clipping; print layout uses two questions on page one and four on page two. No learner assessment or private candidate content was used. Local only; no push, deployment, Drive sync, or external API use.

Follow-up math review: made the nonzero-divisor condition explicit in the divisibility claim and model proof (“0이 아닌 정수 d”). Grade roadmap model tests still pass 12/12 and the focused student/teacher workbook browser test passes 1/1.

Open project gates remain unchanged: the private Grade 7 7.NS.A diagnostic is locked pending independent review, pilot, immutable release, and release authorization; the private Grade 7 AMC 8 R6 candidate remains locked pending its independent-review path. Continue public roadmap and original learning-resource work without opening or sending private candidate text.

### 2026-11-03 Grade 10 growth-map SAT links and Grade 7 fraction display

Connected the Grade 10 growth-map stage “필요한 실전 연습” to the same SAT resources shown in the Grade 10 annual plan: GFIELD SAT foundation practice, the original Precalculus workbook, Khan Academy Digital SAT, College Board Bluebook, and the College Board question bank. Kept the MAA AIME and invitational references and the eligibility note in that stage. Added model and browser regressions for matching destinations and mobile overflow. Confirmed the opened Grade 7 roadmap already displays its two mathematical fractions as stacked numerator/bar/denominator; count text such as `0 / 36` remains count notation.

Verification: Grade roadmap model/browser suites pass 56/56. A 390px Chrome render of Grade 10 stage 3 shows all seven references and the AIME eligibility note without page overflow or browser errors. The current Grade 7 `?grade=7&program=kangaroo` screen has no visible slash-form numeric fractions; its fraction nodes are stacked, and the fraction suite passes. JavaScript syntax and CRLF-aware `git diff --check` pass. Local only; no private diagnostic content accessed, no push, deployment, Drive sync, or external API call.

Follow-up: aligned the Grade 8 AMC 10 map step with the MAA's official AMC scope page, and the Grade 10 AIME map step with the same AIME eligibility and invitational references used in its annual plan. The mobile reference test verifies the labels, destinations, external-link handling, and no-overflow behavior. Grade roadmap model tests pass 12/12 and the targeted map browser test passes 1/1. Local only; no push or deployment.

Follow-up: added the GFIELD Algebra 2 workbook as an optional “필요한 단원 선택” resource beside Geometry in the inferred Grade 9 map, matching the annual-plan links while keeping the school-course-order note. Grade roadmap model tests pass 12/12 and the targeted mobile map browser test passes 1/1. Local only; no push or deployment.

### 2026-11-03 AMC reflection prompts

Added an optional “풀이 뒤에 한 번 더 생각하기” panel to the GFIELD AMC 10 and AIME-style practice pages, using the supplied coaching prompts about choice of method, alternate approaches, changing a condition, and changing the numbers. The panel is closed by default and does not record responses. It complements the existing item-specific connection questions and keeps “개념 → 유형 → 연결 → 실전” visible.

Verification: the targeted AMC 10 roadmap/practice test and AIME browser test pass 2/2, including prompt contents, disclosure behavior, stacked fractions, answers, and 390px no-overflow. Fresh mobile captures of both opened reflection panels show legible single-column prompts and no page errors. Local only; no private candidate content, push, deployment, or external API use.

### 2026-11-03 Contest-practice visual alignment and fraction check

Aligned the AMC 10 and AIME practice screens with the GFIELD growth-map plum/lilac palette. Styled the roadmap return link as a clear button, added matching keyboard-focus and selected-state colors, and corrected the AMC mobile intro so the title and source note use a single column. Korean text now wraps at word boundaries on narrow screens, and the AMC answered-count stays on one line. Kept green/red feedback colors for answer status.

The user's fraction-format request was verified against the rendered Grade 7 AMC practice: mathematical fractions use stacked numerator, horizontal bar, and denominator; a mobile viewport capture confirms the fraction form. Progress values such as `0 / 12` remain count notation. The existing shared renderers also cover the GFIELD Algebra 1, Pre-Algebra, Algebra 2, Geometry, Precalculus, workbook, and A4 views.

Verification: the targeted Grade 7 AMC browser test and AIME browser test pass 2/2, including fraction-bar, palette, focus, route, answer, and mobile layout assertions. Captures `/tmp/gfield-amc10-fraction-inline.png`, `/tmp/gfield-amc10-mobile-toolbar.png`, and `/tmp/gfield-amc10-desktop.png` reviewed. `git diff --check` passes. No private assessment item content or learner data was used. Local only; no push, deployment, Drive sync, or external API use.

Follow-up: connected AMC 10's item, answer-choice, hint, and explanation text to the shared math-text renderer. Mathematical fractions keep a stacked numerator, fraction bar, and denominator, with a Korean accessible label; question-progress counts retain slash count notation. The fallback remains escaped text if the shared renderer is unavailable. No item content changed. Verification on this refactor: the Grade 7 roadmap-to-AMC practice browser test passes 1/1; `/tmp/gfield-amc10-fraction-current.png` shows all five probability choices as actual stacked fractions in Chrome. Local code syntax and diff checks pass; no private content was used.

### 2026-11-03 Pre-Algebra expression wording

Replaced the Unit 1 lesson label “문장을 변수식으로 번역하기” with “문장으로 제시된 상황을 대수식으로 나타내기” in the GFIELD course, Grade 6–7 pathway, and roadmap flow. The new label describes the student action in the Common Core 6.EE.A.2/.2.a wording: read/write expressions and record operations with numbers and variables. The task examples still ask learners to identify the quantities and relationship, write the expression, and evaluate it; no item scope or answer changed. Source: https://www.thecorestandards.org/Math/Content/6/EE/ .

Verification: Pre-Algebra course plus Grade 3–12 roadmap model tests pass 17/17. The mobile Pre-Algebra route browser test passes 1/1, including the synchronized six-step labels, resource links, no horizontal overflow, and no browser errors. No private diagnostic content or learner data was accessed. Local only; no push, deployment, Drive sync, or external API use.

### 2026-11-03 Teacher question-bank visual alignment

Aligned the question-finding and A4 paper-builder interface with the GFIELD plum/lilac palette. Kept the Tabler/Carbon-inspired desktop layout: filters, searchable list, live item preview, and paper settings remain visible together. On phones, the detailed topic list starts collapsed with its current selection and count visible; applying a topic filter closes the list and moves keyboard focus to the results heading. Resizing between phone and desktop restores the appropriate default state. The named “블루 라인” printed-cover option remains blue; default UI and the geometry-cover variant use the brand accent.

Verification: the full paper-builder browser suite passes 12/12, including the mobile filter interaction, accessible focus transition, A4 answer separation and pagination. Fresh 1440px and 390px captures `/tmp/gfield-paper-builder-plum-desktop.png`, `/tmp/gfield-paper-builder-plum-mobile.png`, and `/tmp/gfield-paper-builder-plum-mobile-filters.png` were reviewed. Print-media captures of the geometry cover, a two-question A4 sheet, and the separate one-page answer key were also reviewed; all pages fit their A4 boxes without overflow, fractions remain stacked, and brand accents render in plum. No page errors or horizontal overflow; public item count and private-diagnostic exclusion are unchanged. No private candidate or learner record was accessed. Local only; no push, deployment, Drive sync, or external API use.

### 2026-11-03 Contest review palette alignment

Aligned the contest-paper review and score-history accents with the GFIELD plum/lilac tokens: active navigation, section labels, mark numbers, source notes, actions, score estimates, domain summaries, saved review values, and keyboard focus. Correct/incorrect and success/error colors retain their meanings. The markup and diagnostic/scoring logic are unchanged.

Verification: inspected Chromium renders at 1440×960 and 390×844. The `competition-paper-review-browser.test.cjs` suite passes 19/19, covering marking, result summaries, local save/history, mobile rows, keyboard focus, score-history import/export, and no horizontal overflow. `git diff --check` passes. No private item content or learner result was used; no publishing or external sync.

### 2026-11-03 School assessment comparison visual alignment

Aligned the external score and course comparison screen with GFIELD plum/lilac: replaced the residual blue and green kicker colors, moved the hero to deep plum, changed its oversize serif headings to the page sans-serif, and softened the form/result surfaces with rounded cards and inputs. Focus indicators and actions use the brand accent; reported-score success/error meanings remain semantic. Form fields, comparison logic, and local record behavior did not change.

Verification: inspected Chromium renders at 1440×960 and 390×844; the mobile heading stays in two readable lines. The `assessment-entry-browser.test.cjs` suite passes 10/10, including saved-result handling, school-placement boundaries, high-school course selection, MAP context, ISEE reporting, mobile layout, and print restrictions. Captures `/tmp/gfield-assessment-final-desktop.png` and `/tmp/gfield-assessment-final-mobile.png` reviewed. No student record or private candidate content used; local only.

### 2026-11-03 Keep the grade-comparison bridge out of fraction rendering

The Grade 7→8 comparison bridge joined two grade descriptions with `/`. The shared math renderer interpreted the Korean word before the separator and the next grade number as a fraction, so the 8 appeared stacked under the preceding text. Replaced the separator with a centered dot and added a browser assertion that this curriculum bridge contains no mathematical-fraction node.

Verification: Grade 3–12 roadmap/model tests pass 12/12; the full roadmap browser suite passes 44/44, including desktop/mobile grade comparison, matched-source assessment records, and the Math Kangaroo Grade 7–8 paper comparison. Fresh 1440px and 390px renders show both grade paths legibly, no injected fraction node, no page overflow, and no browser errors. Captures `/tmp/gfield-grade-comparison-fixed-1440.png` and `/tmp/gfield-grade-comparison-fixed-390.png` reviewed. No student data or private candidate content was used. Local only; no push, deployment, Drive sync, or external API use.

### 2026-11-03 Roadmap assessment flow uses GFIELD materials

Removed the roadmap's calls to enter school Placement Test, MAP Growth, CTP, SSAT, or ISEE results. The learner card and Grade 3–12 comparison now link only to available GFIELD-authored workbooks and practice sets; grades without released in-house material say so. Kept contest-paper review in its separate competition section. Existing external-score entry code remains outside this roadmap flow and is no longer linked from it. The current linked resources are practice materials, not a full timed mock exam or a normed grade comparison.

Verification: Grade 3–12 roadmap model tests pass 12/12; the complete roadmap browser suite passes 37/37. The new browser regression checks the Grade 7/8 GFIELD resource lists, absence of school-score links/labels, and the honest empty state for Grade 3. Fresh local Chrome renders at 1440px and 390px show the side-by-side GFIELD resources with no overflow or page errors. Captures `/tmp/gfield-grade-comparison-own-practice-1440.png` and `/tmp/gfield-grade-comparison-own-practice-390.png` reviewed. No student records or private diagnostic content were used. Local only; no push, deployment, Drive sync, or external API use.

Next: author and independently verify the first GFIELD timed mock exam and its answer/skill report before adding result history or cross-grade score comparisons. Do not reuse the locked Grade 7 private screener or claim a grade rank from an uncalibrated mock.

### 2026-11-03 GFIELD Grade 7 `7.NS.A` unit mock, first version

Responding to the clarification that families should take GFIELD's own mock exam rather than enter school results, added `grade7-ns-a-mock-exam.html` and its original 14-item bank. The 40-minute session samples rational-number addition/subtraction including number-line movement, multiplication/division and fraction-to-repeating-decimal conversion, plus multi-operation contexts under `7.NS.A.1–3`; answers and explanations stay hidden until submission. Results show this attempt's raw correct count, standard-tag counts, each response, and worked reasoning, then offer a direct link to the matching GFIELD unit workbook. The mock requests no name, school, or school score and stores no attempt. The roadmap's Grade 7 lead action now opens this mock. The grade-pair panel lists it as a GFIELD resource and says results are comparable only after a shared, reviewed basis exists. The mock links the official [Common Core Grade 7 Number System standard](https://www.thecorestandards.org/Math/Content/7/NS/) as the scope reference.

This is a unit mock prototype, not a full Grade 7 placement exam, calibrated level comparison, or release-approved diagnostic. The private `7.NS.A` screener and its items were not opened or reused. No learner or school result was used. Independent educator/content review and a pilot remain before interpreting scores beyond this form.

Verification: original item/answer/standard contract and browser flows pass 3/3; the complete Grade 3–12 roadmap browser suite passes 37/37. Local Chrome renders at 1440px and 390px were reviewed for start, exam, and results states: stacked fractions render as actual numerator/fraction-bar/denominator forms; page widths are 1440/1440 and 390/390; no browser errors. The final scope additions are covered by the rerun mock suite. `git diff --check` passes. Local only; no external API, publishing, push, or cloud sync.

Next: independent review of the public mock's math, language, answer choices, and age fit; then define reviewed same-scope mock forms before adding cross-grade score comparison. Build competition diagnosis as its own GFIELD assessment path with a separate reviewed item bank; do not call existing topic practice a mock or use contest scores as school-grade placement.

### 2026-11-04 GFIELD mock results feed the roadmap

Removed the home-screen school/admissions-score entry as the diagnostic call to action. Selecting Grade 7 opens the GFIELD-authored `7.NS.A` mock; other grades open their GFIELD roadmap materials. Submitting the mock stores up to 20 local summaries on this browser/device: raw correct/answered counts, the three `7.NS.A` standard counts, and labels for concepts to review. It does not store a learner name, school score, or selected item answers. The roadmap now shows the latest attempt, per-standard counts, up to three review concepts, and a clear-history control. If the same form is retaken, it may show the raw change with an explicit memory-effect caveat; it does not convert that change to a grade, rank, or mastery claim. The result page links back to this record and the matching GFIELD workbook. Existing external assessment code remains outside the home and boarding-roadmap diagnostic path; it is not used by this mock.

Verification: mock content, persistence sanitization, result-to-roadmap mobile flow, and incomplete responses pass 24/24 focused tests. The home directory's Grade 7 mock route and related course links pass the focused browser test; the Grade 3–12 roadmap test for GFIELD-authored practice routes passes. JS syntax checks and `git diff --check` pass. A stale course-link assertion in the home test was updated to the current Pre-Algebra route and current workbook count. `raw_youtube.txt` is user data and remains untracked/untouched. Local only; no API, push, sync, or deployment.

Next: build the next GFIELD-authored timed mock from the current curriculum roadmap, then add cross-grade level comparisons only after parallel forms have been independently reviewed and share a defensible score scale. Competition diagnosis remains a separate deliverable with its own GFIELD-written, reviewed item bank.

### 2026-11-04 GFIELD Grade 7 proportional mock and mock-only roadmap

Added a second original Grade 7 timed form for Common Core `7.RP.A.1–3` (unit rates, proportional relationships, and multistep percent contexts): 14 multiple-choice items, 40 minutes, answer explanations, and topic tags. The shared Grade 7 mock runner and local aggregate record now accept both `7.NS.A` and `7.RP.A`; the roadmap identifies the exam title and only compares retakes of the same form. No name, school result, outside contest result, or selected response is collected. Results remain local to the device.

The boarding roadmap no longer presents the direct-entry form or saved comparison for outside contest-paper results. Its Grade 7 mock catalog links the two GFIELD unit mocks and labels the separate 10-item AMC 8 set as topic practice, not as a mock exam or an AMC score diagnostic. Other grades see an empty state until their own GFIELD exams are prepared; the roadmap does not request school or contest scores as a substitute. The separate assessment/review tools remain outside this boarding-roadmap mock flow.

Verification: prior focused local-record and mock browser runs passed 27/27 before the latest UI copy change. In this turn, the Mac shell had no Node CLI, so the full repository test command could not be launched. Used the available Playwright runtime against the live localhost preview to verify Grade 7 catalog links, zero visible score-entry fields, hidden old comparison panels, Grade 9 empty state, 390px/1280px no-overflow, the 14-item `7.RP.A` form, stacked fractions, a complete 14/14 submission, local aggregate save, and display of the saved result on the roadmap. No browser errors. Changed JavaScript and browser-test files pass `vm.Script` syntax checks; `git diff --check` passes. No external API, push, deployment, or Drive sync.

Next: independently review both public mock banks for mathematical accuracy, language, and age fit; then create a separate GFIELD-authored AMC 8 diagnostic form. Keep results descriptive until comparable forms are reviewed and a score scale is calibrated. Do not reuse the locked private `7.NS.A` screener or imply school placement, contest rank, AMC qualification, or AIME selection from these forms.

### 2026-11-04 GFIELD Grade 7 AMC 8 style mock and mock-only competition flow

Added an original 25-question, 40-minute Grade 7 AMC 8-style GFIELD mock across five areas: number/ratio, algebra/patterns, geometry/coordinates, counting/probability, and integers/data. The form follows the public AMC 8 question-count/time format as a reference, but uses GFIELD-written questions and is not an official AMC paper. It reports only the learner's raw result on this form and five domain counts; it does not convert those results to an AMC score, contest rank, school grade, AMC 10 qualification, or AIME eligibility. Results are saved as an answer-safe aggregate in the local device record. A separate ten-item GFIELD topic set remains labeled as practice rather than a mock.

The Grade 7 roadmap now links both unit mocks, the new competition-style mock, and the separate practice set. At this checkpoint, the old external contest score-entry and comparison panels were hidden in this roadmap; the 2026-11-04 mock-only correction below removes them entirely. Other grades see the own-material preparation state rather than a score-entry substitute. The mock runner supports a per-form next-study link so this competition result leads to GFIELD AMC 8 practice.

Verification: the focused result-storage suite passes 22/22, the combined Grade 7 unit/AMC 8 mock suite passes 8/8, and the two changed roadmap-browser checks pass 2/2. Tests ran with the ChatGPT-bundled Node/Playwright runtime and installed Chrome; the full repository suite was not run. Changed JavaScript and test files pass `vm.Script` syntax checks; `git diff --check` passes. A separate local browser pass completed all 25 items at 25/25 and a partial mobile attempt at 4/25 from five answered items; both showed the five domain summaries and saved only an aggregate. The saved summary appeared on the Grade 7 roadmap. At 390px and 1280px the mock/roadmap have no horizontal overflow; Grade 9 hides the Grade 7 mock catalog; no visible school/contest result fields or browser errors were found. `raw_youtube.txt` is untracked user data and was left untouched. No Claude/API calls, Drive sync, push, publication, or deployment.

Next: educator review of the GFIELD AMC 8-style items and their age/difficulty fit; then author another independent form and pilot both before building any comparable level bands. A single 25-item form can describe this attempt by topic, but cannot support cross-grade ranks or contest-readiness claims. Continue the same GFIELD-mock-only flow for later AMC 10/AIME paths using separate original banks and review gates.

### 2026-11-04 AMC 8 style mock, second form and format correction

Reviewing the first GFIELD competition mock against MAA's public AMC 8 format exposed two differences: it had four choices instead of five and kept each topic in one consecutive block. Kept the first attempt's local history valid under its original form ID, and authored a separately versioned second form rather than silently changing the meaning of the first score. Form 2 has 25 new GFIELD-written items, five A–E choices per item, 40 minutes, five domain totals, and a planned easy-to-challenging sequence with domains interleaved. It adds estimation, proportional reasoning, Pythagorean geometry, spatial visualization, probability/counting, and three accessible data tables. Its results remain raw GFIELD mock results, not AMC scores, ranks, qualification, school placement, or calibrated grade bands. Official format/topic reference: https://maa.org/student-programs/amc/ and MAA 2023 AMC 8 sample PDF https://maa.org/wp-content/uploads/2024/08/2023-Problems-AMC8-PDF.pdf.

The shared mock runner now supports five choices and accessible tables. The result sanitizer uses the v2 form's explicit item-to-domain map, while retaining the v1 map and historical summaries. The roadmap card identifies Form 2. No external school or contest score entry was reintroduced.

Verification: local-record suite 22/22, Grade 7 mock suite 8/8, and the two changed roadmap browser checks 2/2 pass. Chromium renders show A–E, data tables, stacked fraction notation, the results-by-domain view, and no page errors. Mobile at 390px and desktop at 1280px show no horizontal overflow. JavaScript/test syntax checks and `git diff --check` pass. The full repository suite was not run. `raw_youtube.txt` remains untouched and untracked. Local only; no API, Drive sync, push, publication, or deployment.

Next: independently review the two public GFIELD mock forms for mathematical accuracy, Korean language, age fit, and intended item difficulty; pilot the second form before interpreting its difficulty bands. The bands are authoring structure only and are not reported as calibrated difficulty. Cross-grade competition comparisons still need same-form evidence across grades and an explicit reference population; do not infer percentiles or qualification from this local mock history.


### 2026-11-04 Roadmap diagnosis is GFIELD-mock-only

After the user clarified that learners should take GFIELD-created mocks rather than enter school or outside contest results, removed the old roadmap score-entry form, external score-summary panel, and cross-grade contest record/percentile comparison implementation. The competition section now presents the GFIELD mock catalog and saved GFIELD mock summaries only. Grade comparison remains a side-by-side curriculum path; its note says score-band comparisons will appear only for GFIELD mocks reviewed on a common basis. The Grade 11–12 roadmap examples now refer to GFIELD mock results for concept checks rather than transcripts. Updated navigation from “경시 기록” to “모의고사.”

Verification: combined focused tests pass 67/67 (`grade7-ns-a-mock-exam`, `gmap-local-learning-record`, and `boarding-roadmap-browser`) using the ChatGPT-bundled Node/Playwright runtime and installed Chrome. Browser coverage confirms the mock catalog, saved mock flow, cross-grade curriculum comparison, no assessment input controls, and mobile layouts. A full repository suite was not run. `raw_youtube.txt` remains untracked and untouched. This is local only; no API, Drive sync, push, publication, or deployment.

Remaining for calibrated grade/competition bands: author GFIELD mock forms for the other grades and relevant pathways, independently review item accuracy and age fit, pilot forms, and establish a common rubric/reference population before assigning comparative bands. Current results describe the learner's performance on the specific GFIELD mock and identify review topics; they are not grade ranks, school placement, AMC qualification, or AIME predictions.

### 2026-11-04 Competition roadmap starts from official original papers

The user clarified the competition sequence: use an original official paper first because a timed attempt against the actual contest format and its official standards is a meaningful level signal; follow with GFIELD mocks to locate concepts to review. Updated the roadmap sequence and added official source links for the 2023 AMC 8 paper/solutions, 2022 AMC 10 A paper/solutions, current AMC scope/eligibility, AIME current invitation/qualification guidance, and official Math Kangaroo Grade 7–8 past papers. The links open at the source; original problems and solutions are not copied into GFIELD. GFIELD mock results remain separate and local. No school transcript or outside score-entry form was added.

MAA's currently published AIME qualification criteria for the 2027 cycle list 100+ on AMC 10 and 85+ on AMC 12, with other eligibility requirements; the link opens the current MAA page because thresholds and administration can change. AMC 8/10 format and sample-paper links come from MAA; Math Kangaroo grade-band past papers link to its official practice page.

Verification: roadmap browser suite 37/37 passes, including mobile/desktop overflow and link/order assertions for official paper first then GFIELD mock. Fresh Chromium captures `/tmp/gfield-official-first-desktop.png` (1280px) and `/tmp/gfield-official-first-mobile.png` (390px) were visually reviewed; source links render as three columns on desktop and one column on mobile, with no clipping, page errors, or horizontal overflow. `git diff --check` passes. No original paper content was downloaded, OCRed, stored, or copied into the app. Local only; no API, Drive sync, push, publication, or deployment. `raw_youtube.txt` remains untracked and untouched.


### 2026-11-04 AMC original-paper study flow

The user clarified the intended learning loop: print a real past paper, take it under its timed format, enter answers, review the result and explanations, locate sticking points, then continue with GFIELD-authored similar practice. The earlier two-link sample list did not meet the request. Replaced it with a year/form picker backed by LIVE by Po-Shen Loh's AMC archive, whose page states MAA granted official permission and which offers contest-year pages with printable PDFs, timed interactive attempts, answer keys, concepts, hints, video and written solutions. The archive lists 41 AMC 8 exams (1985–2026; no 2021 event), AMC 10 exams from 2000–2025, and AMC 12 archive entries from 1950–2025; recent years include A/B forms and 2021 also has C/D routes. Verified sample destination routes on the hosted archive. No MAA questions, PDFs, keys, or solutions are copied into GFIELD.

Added A–E selection to each AMC review row. Learners first use the archive's timed answer checking and official solution, then manually mark the checked outcome and optionally classify domain/error reason in GFIELD. The result shows original-paper raw scoring when all 25 are marked, performance by question ranges, wrong/unanswered question numbers, selected responses, and a route to GFIELD-authored follow-up practice. Selected responses remain only in the open page and are excluded from saved summaries. GFIELD has not added cross-year rank/grade/qualification estimates; raw contest score and displayed question ranges describe only that attempt.

Manim was reviewed as a possible renderer for GFIELD-authored concept demonstrations. It is a Python animation framework, not a browser learning widget; no Manim scene or dependency was added. The authorized LIVE archive already supplies explanations for original contest questions. If local rendered concept videos are later authored, use Manim for original GFIELD examples and keep source-paper content at its authorized provider. `manim` is not installed in the current Mac shell.

Verification: archive/analysis tests 12/12 and focused Chromium review tests 3/3 pass using the ChatGPT bundled Node/Playwright. Browser checks verify the 41-year AMC 8 selector, selected year route, A–E answer entry, local answer-free summary, AMC 10 2021 A/B/C/D selector and direct D route. JS syntax and `git diff --check` pass. At 390px and 1280px, the page has no horizontal overflow or browser errors; latest captures `/tmp/gfield-amc-archive-desktop-final.png` and `/tmp/gfield-amc-archive-mobile-final.png` reviewed. The full repository/browser suite was not run; an older broad competition browser test still expects removed `#competition-select` roadmap controls. Local only; no API call, push, publication, Drive sync or deployment. `raw_youtube.txt` remains untracked and untouched.

Next: connect each diagnosed misconception/domain to an independently authored GFIELD similar question with a reviewed worked explanation. Consider a local Manim concept clip after those explanations are authored and reviewed. Do not copy the MAA/LIVE question, key, or worked solution into the GFIELD bank.

### 2026-11-04 Original-paper results now open targeted GFIELD practice

Connected AMC 8 Grade 7 and AMC 10 paper-review outcomes to the GFIELD-authored practice banks. When learners mark wrong or blank questions and choose their domains, the report carries those domain IDs, source year/form, and item numbers into the follow-up page. AMC 8 now has an independent topic-practice view backed by the existing 25-item GFIELD Grade 7 bank; it groups authored prompts into algebra, number/proportion, geometry, counting/probability, and graph/table practice and exposes worked explanations. AMC 10 starts with the matching authored domains from its 12-item concept bank. Learners can still change filters; progress uses the visible subset. AMC 8 question source/year details link back to LIVE. No original contest prompt, option, answer key, or explanation is copied. Practice attempts are ephemeral and do not change the original-paper diagnostic or persist to local records.

Verification: focused Chromium flows assert classification-to-practice routing for AMC 8 and AMC 10, preserved year/form/question context, correct filtered bank sizes, answer feedback/solution reveal, matching progress counts, and no mobile horizontal overflow. The AMC archive/analysis suite passes 12/12; five focused review-browser tests pass. JavaScript syntax checks and `git diff --check` pass. Mobile AMC 8 topic-practice and desktop AMC 10 targeted-practice captures were visually inspected (`/tmp/gfield-amc8-target-mobile.png`, `/tmp/gfield-amc10-target-desktop-final.png`). Full legacy competition browser suite still includes obsolete roadmap selectors and comparison assertions removed from the current roadmap; do not treat the focused suite as full-suite coverage.

Remaining: build independently authored, reviewed targeted banks for AMC 12/AIME and other requested grade/course paths; validate the mapping from each AMC 8/10 diagnostic domain to authored topics; and establish an evidence-backed interpretation if grade/competition-level comparison is required. Current AMC original-paper summaries are raw, within-paper observations and are not a calibrated grade rank, AMC award prediction, or AIME eligibility decision. Raw score entry/answer choices do not auto-grade against hosted keys; learners check the official key at the authorized host and mark the outcome here.

### 2026-11-04 AIME annual original-paper and targeted-practice flow

Web-verified the LIVE archive's AIME index: 71 official-permission archive entries spanning 1983–2026. The index lists one paper per year for 1983–1999 and I/II papers from 2000–2026. Directly checked the 1983 and 2026 II pages: each provides a printable PDF, timed attempt, answer key, problem concepts, hints, and worked solutions; LIVE states the MAA authorized use. GFIELD stores only year/form routes and does not copy prompts, keys, or solutions. Reference: https://live.poshenloh.com/past-contests.

Extended the shared archive selector to AIME, with year selection, I/II selection (where available), and correct legacy single-paper routes through 1999. The 15 review rows now accept AIME integer responses 0–999 as ephemeral inputs. After manual comparison with LIVE's key, the complete-paper summary reports only raw correct count out of 15; wrong/blank question numbers and manually chosen domain/error reasons remain visible. The answer values do not enter saved summaries. No grade rank, percentile, AIME invite/eligibility prediction, or score auto-grading is claimed.

The AIME review now routes selected error domains, source year/form, and question numbers into the separately authored GFIELD AIME-style bank. The follow-up opens only the selected topic set, shows the linked LIVE paper and return route, and tracks progress against the visible subset. The GFIELD bank is independent original practice; its attempts are not added to the source-paper result or stored.

Current-cycle distinction: the archive currently ends at 2026, when I/II past papers exist. MAA's 2027 AIME page says the upcoming event is a single registration window with two 90-minute parts, 8 then 7 questions, no return to part one, a minimum age of 13, and current AMC 10 ≥100 / AMC 12 ≥85 invitation thresholds subject to other eligibility rules. The historical PDF flow must not be described as the 2027 administration format. References: https://maa.org/maa-invitational-competitions/ and https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/.

Verification: archive and manual-analysis Node suites pass 12/12; JavaScript syntax checks and `git diff --check` pass. The existing browser-test file cannot run from the shell because this checkout has no installed `playwright` module; it fails at module loading, before executing tests. Direct local in-app-browser checks at 1280px and 390px verified AIME 2026 II and 1999 routes, 15 numeric answer inputs, a complete 13/15 raw summary, wrong/blank item routing to seven matching GFIELD items, source year/form/question context, and no horizontal overflow. A first manual check found the practice toolbar still said 12 items under a 7-item filter; fixed by updating visible count after every filter render and rechecked at 7/7. No AIME response was saved during browser verification. `raw_youtube.txt` remains untouched and untracked. Local only; no API, Drive sync, push, publication, or deployment.

Next: extend independently authored, reviewed error-targeted banks to AMC 12 and the next grade/course routes. For any future grade comparison, first obtain an actual grade-specific public cohort; do not turn the current all-grade AIME distribution into a grade rank. Keep raw score, same-paper cohort thresholds, official eligibility, and awards as separate claims.
### 2026-11-04 · AIME 원본 연도별 복습과 공개 점수 분포 비교

- LIVE의 MAA 허가 AIME 아카이브를 1983–2026년으로 연결했다. 1983–1999는 단일 시험지, 2000–2026은 I/II형으로 선택하며 PDF 인쇄·온라인 응시·정답·문항별 해설은 원본 제공처에서 연다.
- AIME 문항 복습은 답을 0–999 정수로 화면에서 입력하고 원본 답안 대조 결과를 표시한다. 원문이나 정답은 저장·재배포하지 않고, 오답·미응답은 연도·회차·문항 번호와 영역을 붙여 지필드 창작 연습으로 보낸다.
- MAA K-12 EduView 공개 Score Distribution 보고서에서 2023–2026년 AIME I/II별 상위 1·2.5·5·10·25·50·75% 기준점과 평균·표준편차·응시자·학교 수를 확인해 결과에 추가했다. 보고서는 학년별 분포가 아니므로 같은 시험지 전체 코호트 기준 비교로만 제공한다. 동점 처리 때문에 개인의 정확한 백분위, 학년 등급, AIME 응시 자격을 산출하지 않는다.
- 출처: [LIVE AIME archive](https://live.poshenloh.com/past-contests), [MAA K-12 EduView Score Distribution](https://maa.edvistas.com/eduview/report.aspx?view=1561&mode=6), [MAA Invitational Competitions](https://maa.org/maa-invitational-competitions/).
- UI 검수: 2025 AIME I에 10/15 수동 표시하여 상위 10% 기준(10점)을 충족, 상위 5% 기준(11점)은 미달로 표시되는 것과 cohort 통계/출처를 확인했다. 복습 정답과 답안은 화면에서만 사용했다.
- 테스트: JS syntax checks, AIME 분포·원본 아카이브·복습 분석 13건 통과, 직접 브라우저 UI 검수. `competition-paper-review-browser.test.cjs` 전체는 체크아웃에 Playwright 패키지가 없어 실행하지 못함.

### 2026-11-04 AMC 12 yearly papers, historical scoring, and targeted GFIELD practice

- Web-checked the LIVE by Po-Shen Loh annual AMC archive, which lists MAA-authorized original AMC papers (1950–2025 at the time checked), and MAA's current AMC contest information. The page stores year/form links only; GFIELD does not copy original prompts, keys, PDFs, or solutions. Sources: [LIVE AMC past contests](https://live.poshenloh.com/past-contests), [MAA AMC program](https://maa.org/student-programs/amc/).
- Added year-aware AMC 12 paper metadata and review behavior. Historical labels, item counts, time guidance, scoring and score display follow the published AHSME/AMC history: 50 items (1950–59; scoring varied, so only raw correct count), 40 (1960–67; raw count), 35 (1968–73; raw count), 30 with 5R-W / 80 minutes (1974–76), 30 with 30+4R-W / 90 minutes (1977–85), 5R+2B / 90 minutes (1986–99), 6R+2B (2000–01), 6R+2.5B (2002–06), and 6R+1.5B (2007 onward). Changing the year refreshes paper link, item rows, and directions; historical partial formats that cannot be scored reliably show raw count only. Reference: [MAA/AMS Contest Problem Book IX, historical format preface](https://www.toomates.net/biblioteca2/contestproblembooks/TheContestProblemBook9.pdf).
- Added a separate 15-item original GFIELD AMC 12 concept-practice bank across algebra, functions/trigonometry, number theory, geometry, and counting. AMC 12 diagnosed error areas can open matching authored practice and worked explanations. Grade 8–12 roadmaps link it as optional practice; this is not an AMC placement or score prediction.
- Checked MAA's public AMC 12 B Fall 2025 K–12 cohort report (16,432 participants): average 65.96, SD 28.66; Top 50/25/10/5/2.5/1% score thresholds 45/58.5/81/109.5/127.5/145.5. These are whole-form, all-grade reference thresholds, not grade-specific bands. No grade rank or calibrated readiness claim was added. Source: [MAA K–12 Score Distribution report](https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561).
- Verification: focused local unit suite passed 30/30; syntax checks and `git diff --check` pass. Manual Chromium checks covered 1950 (50 questions; no unsupported duration/score projection), 1975 (30, 80 min, 5R-W), year-switch to 1977 (30, 90 min, 30+4R-W), and live response entry/results. The shell browser runner cannot load because `playwright` is not installed in this checkout; manual local-browser checks were used. No API, push, publication, Drive sync, or deployment. `raw_youtube.txt` remains untracked and untouched.

Next: independently review/pilot the AMC 12 authored bank and add grade-specific comparison only if a public or locally piloted grade-specific reference cohort is defensible. Existing AMC 12 public cohort thresholds are aggregate-only; keep them clearly distinguished from AIME cohort bands and official invitation rules.

### 2026-11-04 AMC same-form score references for original-paper review

- Queried MAA's public K–12 EduView Score Distribution report directly for each listed AMC 8, AMC 10, and AMC 12 form. Added per-year/per-form reference data for AMC 8 (2023–2026) and AMC 10/12 A and B (2022–2025), including Top 1/2.5/5/10/25/50/75% thresholds, average, standard deviation, report sample size, school count, and a direct source link. The MAA report exposes school-year and competition filters, not grade-specific cohorts; the UI labels these as same-exam report-sample thresholds and explicitly avoids individual percentile, grade rank, qualification, and cross-year claims. Score distributions for 2026 AMC 10/12 are not yet available in the report; current MAA dates list the A contests for Nov. 5 and B for Nov. 13, 2026. Sources: [MAA AMC dates and formats](https://maa.org/student-programs/amc/), [MAA K–12 Score Distribution report](https://maa.edvistas.com/eduview/report.aspx?mode=6&r500=&view=1561).
- Complete AMC 8/10/12 answer-marking results now show matching year/form reference thresholds when the selected form has a verified MAA report. Incomplete attempts and unavailable year/form reports keep the comparison hidden. AIME's existing independent cohort panel remains unchanged.
- Verification: new AMC score-reference contract tests and the focused archive/analysis/bank/roadmap suites pass 33/33. JS syntax checks and `git diff --check` pass. Manual local-browser checks at 390px verified AMC 12 B 2025 (114/150; displayed same-form Top 10% threshold 109.5 reached, Top 5% 127.5 not reached, source report link and 16,432 report count) and AMC 8 2026 (19/25; Top 10% threshold 19 reached, source link and 80,983 report count). Screenshot review confirmed the score cards fit the existing results column. The shell Playwright test runner is unavailable in this checkout; browser tests were added but direct local-browser checks were used. No API, upload, push, publication, or deployment. `raw_youtube.txt` remains untracked and untouched.

Next: connect the AMC 12 original-paper outcome to a complete GFIELD AMC 12 mock/parallel-form stage, then independently review and pilot the authored mock before adding any GFIELD-only performance bands. Keep MAA sample cohort references separate from grade-specific norms.

### 2026-11-04 AMC yearly archive → GFIELD AMC 12 mock → targeted practice

- Web search verified the LIVE authorized annual index: AMC 8 currently lists 41 years (1985–2026, with no 2021 contest), AMC 10 lists 2000–2025, and AMC 12 lists 1950–2025. The AMC 12 index names each recent A/B paper and historical single papers; 2021 has A–D routes. LIVE says MAA granted permission and each paper page provides printable PDFs, answer keys, and solutions. GFIELD stores only metadata/routes and never copied the contest items. Sources: [LIVE AMC past-contest index](https://live.poshenloh.com/past-contests), [2025 AMC 12 B destination](https://live.poshenloh.com/past-contests/amc12/2025B), [MAA AMC 12 description and scope](https://maa.org/student-programs/amc/).
- Added a complete original GFIELD AMC 12-scope form: 25 items, 75 minutes, five choices each, five topic totals with five items per area. It follows AMC 12's scope through trigonometry and excludes calculus; learners practice without calculators to match MAA's stated rules. This is a GFIELD form, not an official AMC form or score scale.
- Rewired the AMC 12 original-paper result CTA to open the full GFIELD form first, carrying selected grade, source year/form, flagged areas, and question numbers. After submission, the follow-up goes to the matching 15-item GFIELD concept bank. The Grade 10 roadmap now lists the AMC 12 form. Historical year-specific paper review and same-year/form MAA report comparison remain separate steps/data.
- Verification: all 25 answer choices were checked against independently calculated expected values; bank/route/source tests pass 23/23. Focused browser checks pass 1/1 for original review → timed GFIELD form → filtered concept bank and 1/1 for the Grade 10 roadmap entry. Direct local-browser check shows 25 questions, 75:00, the original source label/return route, and no horizontal overflow. Syntax checks and `git diff --check` pass. A combined run of the full two browser suites was interrupted after it ran beyond one minute; do not claim full-suite success. The focused browser flows above are the verified scope.
- Current form is a first authored diagnostic draft; educator review, difficulty review, and a pilot are still needed before showing any GFIELD level bands or comparing students. MAA's public score cohort remains same-paper/all-grade and cannot substitute for grade-specific norms. Sources: [MAA current AMC 12 format](https://maa.org/student-programs/amc/), [MAA official competition policies](https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/), [AMC 10/12 exam materials policy](https://maa.org/wp-content/uploads/2024/09/2024-25-AMC-10-AMC-12-Teachers-Manual-FINAL.pdf).
- Local only; no API, Drive sync, push, publication, or deployment. `raw_youtube.txt` remains untracked and untouched.

Next: have an independent educator review the 25-item AMC 12 form for mathematical accuracy, language, topic balance, and intended difficulty; then pilot the form before building GFIELD-only performance bands. Keep the source paper's actual same-year/form MAA comparison distinct from a grade-specific learner comparison.

### 2026-11-04 AMC 12 authored-form review and outcome-driven follow-up

- Compared the current GFIELD form to the public metadata for the 2025 AMC 12 B: its 25-question/75-minute format and an increasing difficulty range across problem numbers. LIVE's displayed difficulty ratings begin around 890–1,200 in early questions, reach approximately 1,580–1,840 in the middle, and rise above 2,000 in later questions. This was used only as a broad pacing/scope reference; no original prompt, answer, or solution was copied. Source: [LIVE 2025 AMC 12 B](https://live.poshenloh.com/past-contests/amc12/2025B).
- Revised several overly routine GFIELD mock items to require combined reasoning (gcd/lcm, digit restrictions, constrained divisors, trig symmetric expressions, Heron/circumradius, interpolation, power residues, and constrained lattice paths). Choice uniqueness is now asserted for all 25. The form still has no measured GFIELD difficulty scale, grade rank, or cross-form comparison.
- Fixed a consequential route issue: after the GFIELD AMC 12 form, targeted practice now filters from the wrong/blank areas of that form, rather than reusing only the prior official-paper labels. The original year/form and question numbers remain explicitly separate and are carried along as context. The AMC 12 D 2021 archive context remains accepted. The shared runner now returns AMC/competition results to the competition section and Grade 7 unit results to the unit-practice section.
- Claude Code Opus read-only review was attempted with the existing CLI, but it returned `Not logged in · Please run /login`; no Claude/independent reviewer approval is claimed. Human educator review remains required before interpreting this form as an AMC level diagnostic or creating GFIELD performance bands.
- Verification: authored bank, archive, MAA cohort, and paper-analysis tests pass 23/23; Grade 7 shared-runner regression passes 8/8; focused browser flow passes 1/1 for official AMC paper → GFIELD mock → the mock's actual weak domain → worked practice. Syntax and `git diff --check` pass. No push, Drive sync, publication, or deployment. `raw_youtube.txt` remains untouched and untracked.

Next: continue constructing the AMC 10 full-form route after original-paper review (current AMC 10 path still opens topic practice directly), then obtain educator review and a small pilot for the AMC 12 form before adding any GFIELD performance bands.

### 2026-11-04 AMC 10 original-paper review → GFIELD mock → targeted practice

- Web search rechecked MAA's current AMC 10 specification: 25 multiple-choice questions in 75 minutes; elementary algebra, basic geometry, area/volume, elementary number theory, and probability; advanced trigonometry/algebra/geometry excluded. LIVE's public year-by-year index lists 52 AMC 10 forms, 2000–2025, including A/B each year and 2021 A–D; the year/form route opens the authorized paper page with printable exam, answers, and worked solutions. Sources: [MAA AMC details and current dates](https://maa.org/student-programs/amc/), [LIVE annual past-contest index](https://live.poshenloh.com/past-contests), [2025 AMC 10 A solutions and permission notice](https://live.poshenloh.com/past-contests/amc10/2025A/solutions).
- Added `amc10-gfield-mock-bank.js` and a complete 25-item, 75-minute GFIELD AMC 10-scope exam page. These are newly authored questions; no official paper items were copied. The Grade 9 competition panel links the form. Original AMC 10 review results route to it while preserving year/form, source question numbers, and reviewed domains. The shared runner routes results to competition diagnostics and carries original-paper context separately from mock wrong/blank question numbers and domains.
- After submission, topic practice uses the mock's actual missed domains (including probability) while showing original source paper metadata separately. Direct original-review → topic-practice links continue to work.
- Verification: new AMC10 bank/format/answer tests and archive/scoring analysis suites pass 21/21; focused browser chain for original review → 25-question timed form → mock-domain-filtered practice and direct paper-to-practice route passes 2/2; Grade 9 roadmap catalog route passes 1/1; JavaScript syntax checks pass. Browser chain asserts 390px no overflow and no runtime errors. Local only; no API, Drive sync, push, publication, or deployment. `raw_youtube.txt` is untouched/untracked.
- The GFIELD form is a first authored practice/diagnostic draft, not an AMC equivalent, level band, grade rank, qualification predictor, or calibrated comparison. Have an educator review wording, answer validity, balance, and intended difficulty, then pilot it before adding GFIELD cross-student bands. MAA's same-year/form report remains aggregate-all-grade context, not grade-specific norms.

Next: educator review/pilot both AMC 10 and AMC 12 authored forms; improve AMC10's intended difficulty progression using original-paper metadata without reproducing copyrighted questions. Only then consider GFIELD performance bands. Preserve original-paper MAA cohort thresholds as distinct from any future grade-specific pilot data.

### 2026-11-04 AMC 10 C/D source-context preservation

- Followed a 2021 AMC 10 D result through the full original review → GFIELD mock → targeted practice chain. The mock preserved 2021/D and original question numbers; AMC10 practice had accepted only A/B, which dropped C/D in its source note and return path.
- The practice page now accepts A–D and exposes a direct link to that exact LIVE original paper page for the printable paper, answer key, and worked solutions. The return-to-review route preserves the selected year/form too.
- Verification: focused Chrome chain passes 2/2 at 390px, including AMC 10 D 2021 preserved through all stages, official source URL `.../2021D`, no overflow, and no runtime errors. Local only; no remote changes.
- MAA's currently published 2025 AMC 10 A/B reports are transcribed in `competition/amc-score-distribution-reference.js` and confirmed by web search against the report entries: A top-10 threshold 94.5/150 (31,600 students); B top-10 threshold 87/150 (25,204 students). These remain same-form, all-grade cohort references; the public report does not provide a grade filter, so no grade-specific rank is inferred. Source: [MAA K–12 score distribution](https://maa.edvistas.com/eduview/report.aspx?mode=6&r631=&view=1561).

### AMC 10 same-form score comparison UI regression

- Added a Grade 9 browser check against the MAA 2025 AMC 10 A report: completed 150/150 result displays the matching top-1% threshold, 31,600-student / 1,956-school sample and direct MAA report link. The interface explicitly states this does not give grade-specific rank or grade-level classification.
- Verification: focused mobile Chrome run passes 1/1, with 390px width and no runtime errors. This confirms the cohort comparison belongs to the original AMC paper review; it is not a GFIELD mock score band.

### 2026-11-04 AMC 8 yearly paper → GFIELD mock → topic diagnosis

- Rechecked the LIVE annual index on the web. It lists 41 AMC 8 exams from 1985 through 2026; 2021 is absent. The index states that MAA authorized the archive, and each year page provides a printable PDF, answer key, and worked solutions. The GFIELD year selector stores only this route metadata and does not copy original contest questions, answer keys, or solutions. Sources: [LIVE annual archive](https://live.poshenloh.com/past-contests), [2023 AMC 8 printable exam](https://live.poshenloh.com/images/past-contests/pdf/amc8-2023-exam.pdf), [MAA AMC format and eligibility](https://maa.org/student-programs/amc/).
- AMC 8 original-paper review now routes through the complete GFIELD-authored 25-question / 40-minute mock before moving into filtered concept practice. Original year and question numbers stay separate from GFIELD mock wrong-item numbers; mock results select the actual follow-up domains. The 6th- and 8th-grade roadmaps now expose the same AMC 8-scope route with their selected grade preserved; Grade 7 retains its existing mock entry.
- Verification: focused Chromium browser checks pass 3/3 across the original→mock→targeted-practice chain, Grade 6/8 catalog links, and Grade 7 mock summary. AMC mock contract tests pass 2/2. Archive, paper-analysis, and MAA score-reference unit tests pass 18/18. Changed JavaScript syntax checks and CRLF-aware `git diff --check` pass. A full browser suite was not run; this verification is limited to the focused flows.
- The GFIELD form is not an official AMC paper, same-score substitute, rank, or grade-level comparison. It is a separate practice and domain diagnostic; educator review and pilot are still required before creating any GFIELD performance bands. The original AMC 8 reference remains its own same-form MAA cohort comparison when that public report exists.
- Local only; no API, Drive sync, push, publication, or deployment. `raw_youtube.txt` remains untouched and untracked.

### AMC 8 GFIELD mock content pass

- Independently worked through all 25 current AMC 8 mock items and rechecked keyed answers, stated solutions, choice uniqueness, five-area balance, and coverage against MAA's listed AMC 8 topics. The calculations and intended answers agree. This is a code/content pass, not an educator review or a difficulty calibration; the `difficultyBand` values do not support score-to-level comparisons.
- MAA's 2025–26 teacher manual says calculators are prohibited in the administered contest. The GFIELD mock start instructions now ask learners to complete this practice without a calculator. The 25-question/40-minute format and topic list also match the public MAA description. Sources: [MAA AMC overview](https://maa.org/student-programs/amc/), [MAA 2025–26 AMC 8 Teacher Manual](https://maa.org/wp-content/uploads/2025/06/2025-26-AMC-8-Teachers-Manual.pdf).
- The LIVE archive explicitly states that MAA granted permission to LIVE to host the archived papers; that statement does not establish a GFIELD license to reproduce them. Keep the original paper, key, and explanation at LIVE, including for printing. MAA's teacher manual says discussing or disseminating problems/solutions before the competition window closes violates its rules. Sources: [LIVE archive permission notice](https://live.poshenloh.com/past-contests), [MAA 2025–26 AMC 8 Teacher Manual](https://maa.org/wp-content/uploads/2025/06/2025-26-AMC-8-Teachers-Manual.pdf).
- Verification after the instruction update: AMC 8 mock-result browser test 1/1 and original→mock→targeted-practice browser test 1/1; JavaScript syntax and diff whitespace checks pass.

### AMC 10 authored-form correction pass

- Independently checked every AMC 10 and AMC 12 keyed answer against its prompt and worked solution. Found and corrected an AMC 10 sequence item that asked for the position of 100 in `4, 9, 14, 19, ...`; 100 is not a term. It now asks for 99, which is the 20th term, and the explanation shows the calculation. Bumped the internal AMC 10 form version to `2026-11-04-v2` and the page's bank cache key so prior attempts stay distinguishable.
- Verification: AMC 10 and AMC 12 bank/answer/form unit suites pass 8/8. Exact focused Chromium checks for the AMC 10 and AMC 12 original-review→mock→practice routes pass 2/2. An earlier invocation with a nonmatching test-name pattern stalled before executing assertions; it was replaced by these exact-name checks. `node --check` and CRLF-aware `git diff --check` pass.
- Review is a direct mathematical pass only. AMC 10/12 forms still need a separate educator review and pilot before any GFIELD-only performance band or level comparison.

### 2026-11-04 · AMC 학년별 모의고사 결과 저장 보완

- 웹에서 LIVE의 MAA 허가 연도별 자료실을 재확인했다. 현재 목록은 AMC 8 41회(1985–2026, 2021 제외), AMC 10 52개 시험지(2000–2025, 2021 A–D 포함), AMC 12 102개 시험지(1950–2025, 최근 A/B 및 2021 A–D 포함)다. 각 원본은 LIVE에서 인쇄·응시·정답·풀이를 제공한다. 지필드는 연도/회차 링크와 자체 제작 문항만 사용한다. 출처: [LIVE annual archive](https://live.poshenloh.com/past-contests), [MAA AMC format and scope](https://maa.org/student-programs/amc/).
- 저장 검증기가 모든 GFIELD 모의고사 결과를 7학년으로 고정해, AMC 8 6·8학년과 AMC 10 9학년, AMC 12 10학년의 완료 기록을 버리는 문제를 수정했다. 각 AMC 프로그램에 허용 학년 범위를 지정하고 제출 학년을 그대로 기록하며, 기존 7.NS.A·7.RP.A 학년 제한은 유지한다. AMC 12는 영역별 5문항씩이지만 실제 문항 순서는 영역이 섞여 있어 25개 문항의 영역 순서를 명시했다.
- 관련 HTML의 공용 저장 모듈 캐시 키를 `20261104-4`로 올렸다. `raw_youtube.txt`는 변경·추적하지 않았다.
- 검증: 로컬 기록 테스트 23/23, AMC 8 6·8학년 브라우저 기록 경로 1/1, AMC 10 9학년 및 AMC 12 10학년 기록 경로 2/2 통과. `node --check`와 CRLF-aware `git diff --check`도 통과. 이 범위는 로컬 수정만이며, 학년별 등급/백분위나 모의고사 간 등급 비교를 추가하지 않았다.
- 이 검수와 변경 커밋은 다음 업데이트에서 완료했다. 원본 연도별 시험지 페이지는 LIVE를 열고, GFIELD 안에는 원문/정답/풀이 PDF를 복사하지 않는다.

### 2026-11-04 · AMC 10 지필드 자체 폼 문항 흐름 보완

- LIVE의 실제 2025 AMC 10A 페이지에서 25문항·75분 형식과 게시된 문항별 난도 표기를 확인했다. LIVE 표기는 초반 Q1 860, Q2 980, Q3 1,130, 중간 Q12 1,560, 후반 Q25 2,600으로 폭이 넓다. 이는 LIVE가 붙인 참고 난도값이며 MAA의 공식 척도가 아니다. 원문은 복사하지 않고 형식·범위 참고로만 사용했다. 출처: [LIVE 2025 AMC 10A](https://live.poshenloh.com/past-contests/amc10/2025A), [MAA AMC format and scope](https://maa.org/student-programs/amc/).
- 지필드 AMC 10 자체 문항을 v3로 다시 구성했다. 다섯 영역이 5문항씩 균형을 유지하면서 영역별 묶음이 반복되지 않도록 5개씩 섞었고, 비율 모델·삼각형 부등식·나머지·제약 순열·비복원 확률에서 시작해 경로 세기·원형 배열·합동식·비인접 선택·포함·배제로 이어지도록 내용을 보완했다. 이 순서는 학습용 편성이고 난도 보정이나 성적 척도는 아니다.
- AMC 10의 기존 v2 저장 결과를 계속 읽을 수 있게 이전 폼 버전을 허용하고, 결과 영역 분류는 25문항 순서에 맞춰 지정했다. 은행 스크립트 캐시 키는 `20261104-3`이다. 실제 AMC 답안과 GFIELD 모의고사 결과는 서로 다른 기록·채점으로 유지한다.
- 검산: AMC 10 은행 계약 3/3, 저장 규칙 23/23, AMC 8 및 Grade 7 브라우저 회귀 9/9, AMC 10 원본→모의고사→실제 오답 영역 연습·원본 점수 결과 4/4, AMC 12 원본→모의고사→영역 연습 1/1. 별도 완전탐색으로 AMC 10 문항 3, 4, 9, 14, 18, 19, 23, 24, 25를 검산해 답 29, 48, 156, 26, 67(mod 77), 72, 33, 56, 266개를 확인했다. 남은 전체 점검은 문법/공백 및 최종 diff 확인이다.
- 다음: AMC 12 자체 폼도 문항 흐름과 난도 구성이 실제 AMC 범위와 잘 맞는지 같은 기준으로 검토한다. AMC 10·12의 GFIELD 등급 비교는 교육자 검토와 파일럿 결과가 쌓일 때까지 만들지 않는다. 실제 원본 시험 점수의 MAA 동일 연도·회차 기준 비교는 별도로 유지한다.

### 2026-11-04 · AMC 연도별 원본 아카이브 재확인 및 AMC 12 문항 개정

- 사용자가 요청한 대로 웹에서 MAA 공식 범위·형식과 LIVE 연도별 자료실을 재검색했다. LIVE는 MAA의 공식 사용 허가를 명시하고, 원본 시험마다 인쇄용 PDF·정답·전문 풀이를 제공한다. 현재 공개 색인: AMC 8 41회(1985–2026, 2021 제외), AMC 10 52개(2000–2025; 2021 A–D, 2000·2001 단일형), AMC 12 102개(1950–2025; 2000·2001 단일형, 2002년 이후 주로 A/B, 2021 A–D). 1950 AMC 12 페이지는 당시 형식대로 50문항/75분으로 표시된다. AMC 10/12 2026은 2026–27 MAA 일정상 2026-11-05/13 예정이므로 아직 과거 시험지 색인 범위에 넣지 않는다. 출처: https://live.poshenloh.com/past-contests, https://live.poshenloh.com/past-contests/amc12/1950, https://live.poshenloh.com/past-contests/amc12/2021D, https://maa.org/student-programs/amc/.
- 현재 `competition-paper-review`의 연도 선택기는 이미 연도·시험형 링크를 만들며, AMC 8 2026/2021 제외, AMC 10/12 2021 A–D와 이전 단일 시험지, AMC 12 1950–1999 AHSME의 문항 수/과거 배점, 실제 원본 답안 입력·수동 채점·동일 연도/회차 MAA 비교·오답 영역별 GFIELD 자체 연습 연결을 지원한다. 원문/답/풀이 파일을 GFIELD에 복사하지 않고 허가된 LIVE 페이지에서 인쇄·응시·해설을 연다.
- AMC 12 자체 창작 폼의 마지막 5문항을 치환 실근 수, 삼각방정식, 거듭제곱 나머지, 두 원의 공통현, 정12각형의 예각삼각형 확률로 개정했다. formVersion을 v2로 올리고 이전 v1 결과를 계속 읽도록 저장 규칙을 보완했다. 이는 AMC 점수/등급으로 환산되지 않는 GFIELD 개념 진단이다.
- 검증: AMC 12/아카이브 단위 테스트 6/6, 로컬 진단 저장 테스트 23/23, 원본 연도별 종이→채점 브라우저 2/2, AMC 12 원본→자체 모의고사→약점 연습 브라우저 2/2, 변경 JS 문법 및 `git diff --check` 통과. 시스템 기본 `node` 명령은 설치되지 않아 ChatGPT 앱 번들 Node로 단위·브라우저 검사를 실행했다. 로컬 작업만; push/게시/배포/Drive 동기화 없음. `raw_youtube.txt`는 미추적 상태로 그대로 두었다.
- 다음: 원본과 자체 폼을 섞지 않는 경계를 유지하면서 AMC10·12 자체 문항을 교육자 리뷰/파일럿에 넘길 수 있도록 문항별 개념·풀이·오류분류 기준을 정돈한다. 실제 등급/백분위 비교는 MAA의 동일 회차 공개 분포로만 제공하고 GFIELD 점수에는 부여하지 않는다.

### 2026-11-04 · AMC 10 진단 분류 교정 및 교사 검토표

- 창작 AMC 10 3번은 이등변삼각형의 삼각형 부등식과 정수 길이 경우 나누기가 핵심인데, 초기 분류가 `정수론`이었다. 자체 모의고사 결과에서 약점 영역이 잘못 표시되는 문제라 이를 `기하`로 옮기고 focus도 “삼각형 부등식과 정수 경우 나누기”로 구체화했다. 현재 영역별 문항 수는 대수 5, 정수론 4, 기하 6, 경우의 수 5, 확률 5로 표시하며, 진단 분류의 정확성을 맞추기 위해 영역 수를 억지로 동일하게 유지하지 않는다.
- AMC 10 폼을 v4로 올렸다. 저장기는 v4 분류(3번 기하), 이전 v3 분류(3번 정수론), 이전 v2 단원별 묶음 순서를 각각 이해해 옛 결과와 오답 포커스를 보존한다. 문제 복습→GFIELD 자체 모의고사→후속 연습 흐름을 브라우저에서 확인해, 원본 paper에 수동 입력한 영역 태그가 mock 영역 결과를 덮지 않고 mock의 3번 기하 오답이 기하 연습으로 이어지는 것을 검증했다.
- AMC 10/12 창작 폼 50문항을 영역·개념·정답 및 교사 검토란으로 정리한 `boarding-school-math/docs/AMC10_AMC12_GFIELD_FORM_REVIEW.md`를 추가했다. 외부 교육자 검토와 파일럿 전인 내부 검토표로 표시했고, 점수 난도·학년 등급 비교 기준은 포함하지 않았다. 자동 계약 테스트가 두 폼의 25문항 개수, 영역, 정답을 이 표와 동기화한다.
- 검증: AMC10/12 은행·저장·검토표 테스트 30/30, AMC10 원본→mock→기하 약점 연습과 AMC12 원본→mock→약점 연습 브라우저 2/2, 변경 파일 문법 및 `git diff --check` 통과. local only; no push, publication, Drive sync, or deployment. `raw_youtube.txt` unchanged/untracked.
- 오답 선택지별로 관찰 가능한 오류 가설을 50문항 검토표에 덧붙였다. 이는 교사의 풀이 확인을 돕는 검토 가설이며 선택지만으로 학생 오개념을 진단하지 않는다. 문항별 실응답 지표는 파일럿 전까지 비워 둔다.
- 다음: 교사 검토 결과와 파일럿 자료를 회차·폼 버전이 연결된 검토 기록으로 수집할 절차를 설계한다. 현재 결과는 영역·문항 focus·풀이·해당 영역 GFIELD 창작 연습으로 이어지지만, GFIELD 점수는 AMC 등급이 아니다. 실제 점수 비교는 원본 AMC의 동일 연도·회차 MAA 분포만 쓴다.

### 2026-11-04 · 웹에서 AMC 연도별 원본·학년 비교 자료 확인

- MAA가 실제 AMC 원본 사용을 허가했다고 밝힌 LIVE 자료실에서 전체 연도·회차 색인을 확인했다. 현재 공개 자료는 AMC 8 41회(1985–2026, 2021 제외), AMC 10 52개(2000–2025, 2021 A–D 및 2000/2001 단일형), AMC 12 102개(1950–2025, 2021 A–D 및 2000/2001 단일형)이며, 시험지마다 인쇄 PDF·답안·풀이가 연결된다. 2026 AMC 10/12는 MAA의 2026–27 일정상 11월 5일/13일 시행 예정이므로 과거 기록으로 취급하지 않는다. 출처: https://live.poshenloh.com/past-contests, https://maa.org/student-programs/amc/.
- 2026–27 MAA 공식 정책(PDF, 2026-10-30 개정)에서 현재 형식·응시 학년/나이·채점을 재확인했다. AMC 8은 Grade 8 이하/25문항/40분, AMC 10은 Grade 10 이하/25문항/75분, AMC 12는 Grade 12 이하/25문항/75분이다. 출처: https://maa.org/wp-content/uploads/2026/10/2026-2027-AMC-8-10-12-Policies.pdf.
- MAA 공개 K–12 EduView 점수분포의 AMC 10 A 2025 보고서는 Top 1%, Top 2.5%, Top 5%, Top 10%, Top 25%, Top 50%, Top 75%, 평균, 표준편차, 표본 학생/학교 수를 제공하지만 학년 필터는 보이지 않는다. 따라서 현재는 선택한 Grade와 같은 연도·폼의 전체 응시자 기준을 함께 표시하고, Grade별 순위·백분위·등급으로 오해하지 않도록 문구를 바꿨다. 출처: https://maa.edvistas.com/eduview/report.aspx?mode=6&r832=&view=1561.
- 연도별 원본에는 원문/답/풀이 파일을 복사하지 않는다. 기존 연도 선택에서 LIVE 원본으로 연결하고, 사용자가 표시한 원본 답안의 점수·오답·개념을 로컬에서 진단한 뒤 GFIELD 창작 모의고사와 후속 연습으로 연결한다. MAA 공개 점수분포가 없는 연도는 비교 패널을 표시하지 않는다.
- 검증: `competition-paper-review-browser.test.cjs` 및 `amc-score-distribution-reference.test.cjs` 통과. AMC 8/10/12 연도 색인, 1950 AHSME 단일 시험, 2021 AMC10 D, 원본 점수 입력, AMC 9학년/10학년과 전체 응시자 MAA 기준의 분리 표시를 확인했다. 로컬 작업만; push/배포/Drive 동기화 없음. `raw_youtube.txt` 미추적 파일은 그대로 둔다.

### 2026-11-04 · AMC 원본 검토 브라우저 회귀 기준 갱신

- `8f6712b68 Keep boarding roadmap diagnostics GFIELD mock only`에서 의도적으로 제거된 옛 학년 지도 대회 선택기·원본 성적 비교 UI를 기대하던 브라우저 테스트를 현재 동작에 맞췄다. 저장된 원본 답안 복습 요약은 시험 검토 화면 안에 유지하고, 학년 지도에서 지필드 모의고사 진단으로 오인하거나 서로 다른 원본 시험 성적을 학년별 등급으로 비교하지 않는 경계를 검증한다. Grade 선택/뒤로가기 테스트는 실제 `grade`·`program` URL 복원과 검토 화면 링크를 확인한다. 누락된 기능은 되살리지 않았다.
- 현재 문구와 표시값에 맞춰 부분 채점 안내, 입력하지 않은 답을 포함한 오답 문항, AMC 8 원점수 라벨, AIME 정수 답안 요약의 테스트 기대값도 정리했다.
- 검증: 전체 `competition-paper-review-browser.test.cjs` + `amc-score-distribution-reference.test.cjs` 32/32 통과. `git diff --check` 통과. 코드 기능 변경은 없으며, 2026-11-04 커밋 `ec93604e` 이후의 테스트 기준만 갱신했다. `raw_youtube.txt` 미추적 파일은 그대로 보존한다.

### 2026-11-04 · 웹 검색으로 원본 기출·비교 근거 재확인

- 사용자가 요청한 실제 연도별 AMC 자료를 웹에서 다시 확인했다. MAA 학생 자료 페이지의 “Sample Competition”은 일부 예시 회차다. 전체 연도별 원본은 MAA가 공식 법적 허가를 명시한 LIVE 공개 색인을 사용한다. 색인은 AMC 8 41회, AMC 10 52회, AMC 12 102회, AIME 71회(총 266회; 77년)를 제공하고, 회차별 인쇄 PDF·답안·전문 풀이로 연결한다. [LIVE 연도별 전체 색인](https://live.poshenloh.com/past-contests), [MAA K–12 자료 페이지](https://maa.org/audience/students-k-12/).
- MAA가 직접 공개한 [2022 AMC 10 A 원본 PDF](https://maa.org/wp-content/uploads/2024/08/2022_AMC10A-Problems.pdf)로 원본 시험의 25문항·75분 형식, 점수 규칙 및 종료 전 문제 공개 제한을 확인했다. 이 자료를 시험 종료 뒤 학습·복습에 쓰고, 원문·답안·해설은 LIVE 원본 호스트에서 열도록 하는 기존 구조를 유지한다.
- 점수 비교는 MAA 공개 EduView의 같은 연도·폼 전체 응시자 기준점으로 제한한다. 공개 보고서는 AMC 8 2023–2026 및 AMC 10/12 2022–2025 A/B를 제공하지만, 학년 필터 규준은 확인되지 않았다. 따라서 선택 Grade 맥락과 cohort 기준은 함께 볼 수 있어도 동학년 순위나 학년 능력 등급을 주장하지 않는다.
- 추가로 LIVE 회차 페이지에는 각 실제 문항의 개념 태그, 힌트, 해설과 LIVE 자체 난도 rating이 별도 페이지에 있음을 확인했다. MAA 공식 척도가 아닌 LIVE rating을 진단 등급으로 삼지 않고, 연도·시험형·문항에 맞춘 풀이 링크를 채점 행마다 둔다. 출처 예시: [2025 AMC 10 A Q1](https://live.poshenloh.com/past-contests/amc10/2025A/problem/1), [2026 AIME I Q1](https://live.poshenloh.com/past-contests/aime/2026I/problem/1), [1950 AHSME Q1](https://live.poshenloh.com/past-contests/amc12/1950/problem/1).
- `competition/amc-original-paper-library.js`에 원본 문항 링크 생성 함수를 추가하고, 각 AMC/AIME 답안 행의 “원본 풀이·개념” 링크가 외부 원문 페이지에서 정답·개념·해설을 열도록 했다. 저장소는 문제·답·풀이 콘텐츠를 저장하지 않는다.
- 웹에서 2023 AMC 8 Q1, 2025 AMC 10 A Q1, 2026 AIME I Q1, 1950 AHSME Q1의 실제 LIVE 문항별 URL을 열어 경로 규칙을 검증했다. MAA 사용 허가 표기와 각 페이지에 제공되는 개념 태그, LIVE 난도 rating 및 해설도 확인했다.
- 검증: `amc-original-paper-library.test.cjs` + `competition-paper-review-browser.test.cjs` 32/32 통과. 390px 모바일, 2021 AMC 10 D, AHSME 1950 50번 경계, AIME I/II, 잘못된 폼·문항 번호, 저장 데이터에 원문 응답이 포함되지 않는 경로를 확인했다. `git diff --check` 완료 후 현재 변경을 커밋한다. 사용자 미추적 `raw_youtube.txt`는 그대로 둔다.

### 2026-11-04 · AMC 성적 기록에 공개 동회차 기준 연결

- MAA 전체 응시자 분포가 공개된 연도만 AMC 회차별 기록에 연결했다. AMC 8 기록은 학년도 시작+1년의 1월 시험, AMC 10/12는 시작 연도의 11월 시험으로 매핑하고, AMC 10/12 A·B형을 각각 다른 분포에 연결한다. 공개 분포가 없는 회차는 cohort 값을 만들지 않는다.
- 기록에는 “전체 응시자 기준 · 상위 경계점 이상”과 원점수 경계를 표시하고 해당 MAA EduView 보고서로 링크한다. 사용자 Grade는 함께 유지하지만 같은 학년 백분위·등급으로 변환하지 않는다. 회차별 분포 없는 미래 시험도 빈 기준/가짜 점수로 채우지 않는다.
- 검증: MAA AMC history, score distribution, paper review 브라우저 묶음 41/41 통과. 추가로 AMC 10 A/B 및 AMC 8 연도 대응을 포함한 새 경로 모바일 폭 390px 테스트 1/1 통과. 새 UI/날짜 매핑 회귀 검수를 마친 뒤 커밋한다. 원문·점수 응답은 서버나 로컬 저장에 추가하지 않는다.

### 2026-11-04 · MAA 수상자 명단과 학년 비교 경계 재검증

- MAA의 현행 Student Awards 페이지와 AMC policy 페이지를 웹에서 확인했다. YWMAC 안내는 대회별 최고 점수 참가자와 MAA Section별 상위 참가자를 기리는 별도 수상 프로그램이며, 이름 공개는 동의한 사람만 포함한다. 공개 명단에는 전체 응시자의 점수·분모·학년별 분포가 없으므로 AMC 학년별 등급, 순위, 백분위의 자료로 쓰지 않는다. 오래된 Achievement Roll/Honor Roll 요약이나 제3자 컷 점수도 시즌별 현행 MAA 기준이 직접 확인되기 전에는 제품 기준으로 넣지 않는다.
- 같은 날짜 LIVE 색인의 현황을 대조했다: AMC 8 41회, AMC 10 52회, AMC 12 102회, AIME 71회(총 266회/6,500문항/77년). 연도별 원본·인쇄 PDF·정답·전문 풀이 링크는 LIVE에서 열고, GFIELD에는 회차 metadata와 source routes만 둔다.
- 수상 명단과 전체 응시자 코호트 비교의 차이 및 원본 연도 범위 근거를 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 추가했다. 시험 점수의 MAA 전체 응시자 기준과 현재 GFIELD 학년별 모의고사 원점수 진단은 별도다.
- 출처: [MAA Student Awards](https://maa.org/student-programs/youth-program-awards-winners/), [MAA current AMC policies](https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/), [LIVE complete yearly archive](https://live.poshenloh.com/past-contests).
- 추가 웹 조사에서 과거 MAA AMC 8 결과·수상 보고서(2008)의 학년군별 평균과 recorded-grade 응시 수 표를 찾았다. 2008 표의 Grade 4–5/6/7/8 평균은 각각 10.75/9.88/11.18/12.07, 표본은 2,698/19,726/48,889/75,002다. 이 보고서는 AMC 8에 established norms가 없고 수업·배치 시험과 비교할 수 없다고 직접 경고한다. 따라서 학년 맥락에 관한 역사적 기술통계이지 학생 레벨/등급 기준이 아니다. Stanford 연구자의 연례 보고서 아카이브는 1985–2022 중학교 결과책을 디지털화했다고 설명하지만 제3자 보관소이므로, 제품 데이터에 넣으려면 각 연도의 원본 PDF·표·표본 정의를 추가 검수해야 한다.
- 검증: AMC 원본 라이브러리·MAA 동회차 점수표·원본 검토 브라우저 테스트 36/36 통과, 현행 MAA·LIVE·수상 페이지와 2008 AMC 8 MAA 보고서의 grade summary 문단 열람, `git diff --check` 통과. 원본 문제·답안·해설은 복사하지 않는다.
- 후속 조사: historical grade summary reports의 AMC8 및 high-school report coverage(1980–2010), score reports/percentile breakdowns(2011–2022), 최신 MAA student/school reports의 공개 범위와 정의를 연도별로 inventory한다. 출처별 라이선스·응시자 분모·학년 누락·국제 포함 여부를 기록한 뒤, 근거가 완전한 것만 진단 화면에 고려한다.

### 2026-11-04 · 웹 조사 AMC 학년별 연례 통계 원자료 스테이징

- 사용자의 “웹 검색으로 가져와” 요청에 따라 AMC 연도별 학년 비교 근거를 검색하고 수치 원문을 대조했다. MAA 작성 2009 AMC 8 annual report의 표 2에서 2003–2009 기록 학년군별 참여 수·평균 28행을 대조했다. 보고서는 참여·학년 정보가 기록된 결과만 집계하며, 이 표에서 국내/국제 포함 범위를 따로 나누지 않는다. AMC 8에 확립된 규준이 없고 교실/배치 평가와 비교할 수 없다고 명시한다. 출처 사본: https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html.
- MAA 작성 2010 AMC 10/12 annual report의 2007–2010 표 I/II와 2011 AMC 10/12 Grand Statistics 표 사본을 열어 폼 A/B와 학년군별 평균·참여 수를 회수했다. 2007–2011 AMC 10 40행과 AMC 12 70행, 총 110행을 `boarding-school-math/competition/historical-amc-grade/amc10-12-grade-means-2005-2011.csv`에 전사했다. 2010 annual report mirror: https://www.scribd.com/document/51428451/2010-HS-summary. 2011 Grand Statistics copy: https://www.scribd.com/document/990470105/USA-AMC-10-2011-Statistic. 이 문서들은 MAA 작성 통계의 제3자 호스팅 사본이므로 원본 MAA 호스트 회수는 미완료 상태로 기록했다.
- 자료 README와 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 출처·시험연도·폼·학년 정의·모집단·한계를 연결했다. 한국 AMC 8 결과와 보고서 사본의 미국/MAA 참여 통계는 섞지 않는다. 회차별 원본 문제는 266개 연도·시험형 경로를 연결하고 원문·정답·풀이 파일을 복사하지 않는다.
- 이번 변경에서 검수된 과거 학년 평균을 시험 복습 화면에 연결했다. AMC 8 2001–2009, AMC 10/12 2007–2011 A/B 중 시험연도·대회·시험형·정확한 Grade가 일치하고 모든 답을 채점 확인한 경우에만 과거 응시 집단 평균, 표본 수, 원자료 보고서를 보여준다. `4–5`, `8학년 이하`, 미기입 등 합산 학년군은 개별 학년과 매칭하지 않는다. 과거 평균을 현재 능력 등급·백분위·AIME 진출·학교 배치로 해석하지 않는다.
- 검수: 375px 모바일 뷰포트에서 AMC 10 2011 A Grade 9 비교 표시(24,410명, 평균 62.40)와 가로 넘침 없음 확인; 같은 시험의 Grade 7은 학년 묶음 자료만 있어 숨김. AMC 8 2009 Grade 7 표시(50,218명, 평균 10.08)는 앞선 UI 점검에서 확인. 모듈 검증에서 AMC 10/12 A/B 폼별 일치, 미지원 연도, 학년군 매칭 차단을 확인했다. `git diff --check` 통과.
- 다음 수집: 연도별 원본 MAA 학년 보고서/점수-학년 백분위가 더 회수되는 범위를 조사하되, 출처 호스트와 모집단이 확정되기 전에는 이번 비교 데이터에 추가하지 않는다. 로컬 전용이며 push/배포/Drive 동기화 없음. `raw_youtube.txt`는 그대로 미추적 보존.

### 2026-11-04 · AMC 학년 통계 후속 웹 조사

- [Ian Calaway의 AMC Archive](https://sites.google.com/view/ian-calaway/amc-archive/)에서 AMC 8 요약책 1985–2022, 고교 요약 1980–2010 및 2011–2022 디지털 결과가 보관되었다는 조사 경로를 찾았다. 비공식 연구자 아카이브이며 회차별 보고서의 grade 표를 아직 대조하지 않았으므로 데이터 CSV에는 추가하지 않았다.
- 2013·2016 Bard AMC 8 연례 공개 페이지와 일부 MAA 모양의 학교 결과 PDF에서 학년 평균은 확인되지만 학교/센터 집단 통계다. 전국 집단 통계가 아니므로 기준치로 쓰지 않는다. 자료: https://www.bardmathcircle.org/p/2013-amc-8, https://www.bardmathcircle.org/p/2016-amc-8-results-are-in.
- 2016 사용자 포럼에서 구 MAA `Contest Score Grade Report with Percentile` 메뉴의 존재를 확인했으나 현재 연도별 본문 데이터는 검색·열람에서 재생되지 않았다. 원자료 확보로 기록하지 않는다.
- 후속: Calaway 아카이브의 원본 요약 보고서에서 학년별 평균/분포가 실린 회차를 회차·폼·참가 범위와 함께 전사하고 검수한다. 원문 기출은 LIVE 허가 색인 266회 전체 경로 유지. 현재 학생용 정확 Grade 평균 범위는 AMC 8 2001–2009, AMC 10/12 2007–2011 A/B로 제한한다.

### 2026-11-04 · AMC 8 연도별 학년 평균 근거 범위 확장

- 추가 웹 검색에서 [2008 MAA AMC 8 Results & Awards 보고서 사본](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america)의 표 2를 확인했다. 기존 보고서에 있는 2003–2008 행에 더해 2001–2002년의 기록 학년군별 응시 수·평균 8개 셀을 확인해 [`amc8-grade-means-2001-2009.csv`](boarding-school-math/competition/historical-amc-grade/amc8-grade-means-2001-2009.csv)에 넣었다. 근거가 늘어난 것은 2개 시험연도이며, 점수·학년 등급을 새로 만들거나 기존 매칭 규칙을 바꾸지는 않았다.
- [`amc-grade-reference-coverage-by-paper.csv`](boarding-school-math/competition/historical-amc-grade/amc-grade-reference-coverage-by-paper.csv)는 원본 아카이브 266개 회차·폼마다 학년 평균표의 회수 상태, 정확·묶음 학년군, 원본 시험 경로, 통계 보고서 주소를 기록한다. 29개 회차가 평균표와 연결되어 있으며, 그 외 표시는 이번 조사에서 완전한 전국 학년 평균표를 회수하지 못했다는 뜻이지 자료 부재의 증명은 아니다. AIME는 평균표 수집 범위 밖으로 표시했다.
- AMC 8 평균 참조 모듈을 CSV와 재동기화하고 2001–2002 비교 검증을 추가했다. MAA 작성 보고서의 제3자 사본이라는 상태와 모집단 범위 한계는 그대로 유지한다.
- 학교/센터별 평균과 전국 평균 자료를 분리했다. 개별 학교 결과표는 전국 단위 비교에 사용하지 않았다. MAA 구형 학년별 점수 백분위 보고서 본문은 여전히 회차별로 회수되지 않았다.
- 검수 완료: Python 대조에서 catalog 266행과 coverage 266행의 `(program, year, form)` 키가 전부 일치하고 중복·누락이 없음을 확인했다. 평균 원자료 146행 중 29개 회차가 manifest에서 `historical-grade-mean-staged`로 정확히 연결됐다. Node 참조 검사 5/5, `git diff --check` 통과. 로컬 AMC 8 Grade 7·2001 선택 화면에서 LIVE의 인쇄 PDF/답안/해설·문항 해설 링크와 결과 패널의 평균 9.49·표본 58,271명이 노출되는 것도 확인했다. 원본 시험·정답·풀이 파일은 복사하지 않았다. 로컬 수정만; push/배포/Drive 동기화 없음. `raw_youtube.txt`는 미추적 그대로 둔다.

### 2026-11-04 · 한국 AMC 8 학년 평균 원자료 추가 조사

- 웹에서 [2009 AMC 8 한국 결과표](https://www.amcstudy.net/43)와 [2011 AMC 8 한국 결과표](https://www.amcstudy.net/79)를 직접 열어 학년별 응시 수·평균을 확인했다. 각각 한국 참가집단 741명·899명이라고 보고한다. Grade 5–8 평균/인원은 `competition/historical-amc-grade/amc8-korea-grade-means-2009-2011.csv`에 모집단을 `South Korea reported cohort`로 분리해 기록했다. 2011 표의 `<=4` 구간도 따로 보존했다.
- 2009 학년별 응시 수 합은 737/741, 2011 표시 학년별 응시 수 합은 894/899라서 학년 표에 나타나지 않은 4명/5명을 임의 배분하지 않고 각 행의 coverage note에 남겼다. 이는 전국 AMC 8 평균표와 다른 별도 한국 코호트 연구자료이며 현행 제품의 미국/전세계 학년 규준이나 성적 등급으로 연결하지 않는다.
- 검수: 전사 CSV에서 연도별 원문 학년수 합계와 보고된 총 응시자 수 차이를 대조했다. 2011 페이지의 학년 평균 원문: Grade 5 13.16 (68명), Grade 6 11.67 (252명), Grade 7 13.92 (315명), Grade 8 14.20 (255명). 2009 원문: 각각 Grade 5 14.37 (70명), Grade 6 13.11 (158명), Grade 7 15.17 (262명), Grade 8 13.65 (247명). 개인 이름·학교·점수 기록은 옮기지 않았다. `git diff --check` 후 로컬 저장소에만 둔다.

### 2026-11-04 · AMC 8 연도별 문항 응답 집계 연결

- 웹에서 2009 AMC 8 한국 결과표(741명), 2010 MAA 보고 응답표(153,211명), 2011 AMC 8 한국 결과표(899명)를 확인했다. 2009·2011은 한국 참가자 집단이고 2010은 MAA 표의 별도 전체 응답 집단이므로 코호트를 합치거나 Grade 기준선으로 해석하지 않는다. 출처: [2009 AMC 8 결과·문항표](https://www.amcstudy.net/43), [2010 AMC 8 문항표](https://www.amcstudy.net/71), [2011 AMC 8 결과·문항표](https://www.amcstudy.net/79).
- AMC 8 응답 참조에 2009·2011년 25문항씩을 추가하고, 결과의 다시 볼 문항에 그 회차·문항 응답 분포와 원문 출처를 표시한다. 2009년 12번은 LIVE 정답표가 D로 안내하지만 AMC Study의 MAA 응답 표에서는 D와 E 모두 Correct Response 별표가 있어, 문제별 답 키는 D로 유지하고 집단 응답률 계산에는 D+E(65.18%)를 합산한다. 출처 대조: [LIVE 2009 정답표](https://live.poshenloh.com/past-contests/amc8/2009/answers).
- 응답 출처 링크 버그를 수정한 뒤 브라우저 검수를 다시 완료했다. 2009 Q3 A 오답에서 한국 741명 집단·정답률 90.28%·A 선택 7.42%와 원본 풀이/응답 출처 링크, 2011 Q4 A 오답에서 899명 집단·정답률 59.96%·A 선택 14.57%와 출처 링크를 확인했다. 한 문항 제출에서는 전체 시험 비율을 보류한다.
- 검증: AMC 응답 참조 단위 테스트(2009·2010·2011 총 75개 문항 합계/정답률 포함), `node --check`, `git diff --check`. 미추적 `raw_youtube.txt`는 제외한다. 로컬 변경만; push·배포·Drive 동기화 없음.
- 추가 웹 검색으로 2013 MAA 생성 학교 성적표 Grade 7(n=63)·Grade 8(n=55), 2015 싱가포르 학교 성적표 Grade 7(n=10)의 문항 응답표를 찾았다. 두 CSV에는 각각 50행·25행의 선택지/공란/판독불가 비율을 보존한다. LIVE 공식 답안과 대조했고, 결과 화면은 연도·Grade가 정확히 일치할 때만 표시하며 전국 기준이 아닌 특정 학교 집단이라고 고지한다. 2015 Q8에서 답 C 오답 예시로 정답 응답 60%, C 선택 30% 및 표본 고지의 화면 출력을 확인했다. 단위 검사(2009–2011, 2013, 2015)와 2015 CSV↔모듈 25행 대조, `git diff --check` 완료. 후속은 AMC 연도별 MAA 전체/Grade 성적표 검색과 확보 범위 확장이다. 없는 학년·연도 값은 채우지 않는다.

### 2026-11-04 웹 검색 추가: 2019 AMC 8 MAA Overall 학년별 점수 분포

- Beijing XDF의 2019 성적 분석 페이지에서 MAA `Location: Overall` Grade Report의 이미지 3장을 찾았다. Apple Vision OCR 및 시각 대조로 점수 0–25 × 5개 그룹(≤5, 6, 7, 8, unknown) 130 빈도 셀을 [`amc8-2019-global-grade-score-counts.csv`](boarding-school-math/competition/historical-amc-grade/amc8-2019-global-grade-score-counts.csv)에 전사했다. `unknown`은 csv에 보존하지만 학생의 학년 비교에 사용하지 않는다.
- 전체 학년 그룹 수 합계 94,620이 이미지 요약 총계와 맞는다. 보고서 반올림 평균도 ≤5 8.48, Grade 6 8.50, 7 9.35, 8 10.06, unknown 8.09로 맞는다. 단, XDF 기사 본문은 전체 응시 수를 94,675로 달리 적어 내장 MAA 보고 이미지 기준을 썼고 이 불일치를 근거 문서에 기록했다.
- AMC 8 2019 복습 결과에서 Grade 6–8, 5학년 이하 그룹만 같은 표본 점수 위치에 연결했다. Grade 4/5를 나누지 않았고, 엄격히 낮은 점수 비율은 빈도표에서 계산해 공식 percentile·현재 규준·능력 등급으로 부르지 않는다. 특정 연도만 조회된다.
- `amc8-global-grade-score-reference.test.cjs`에 총계·평균·점수 구간·차단 연도 검증을 추가했다. 번들 Node REPL 산술 검증 130셀 통과, 2009 기존 경로 회귀 및 2018 차단 확인. browser UI에서 2019 AMC 8 Grade 7·24/25 예시와 99.65% strict-lower 출력 및 표본/출처 라벨 확인 후 임시 답안을 지웠다. 추가 검색으로 2018 AMC 8 전체 점수 보고서(평균/전체 컷)는 확인했지만 학년별 분포는 없어 연도별 학년 비교에 넣지 않았다. `git diff --check` 완료; node:test 실행은 REPL 하위 프로세스가 결과를 반환하지 않아 미확인. Local only; no push, deployment, Drive sync. 다음 검색은 2010–2020에서 같은 형태의 MAA Overall grade table을 더 찾고, 표본·회차·누적 정의가 대조되는 경우만 추가한다.
- 이어진 2022 자료 검색에서 Think Matrix가 AMC 8 2022 “Contest Score Grade Report” 이미지를 인용하는 것을 확인했다. 그러나 Shimo 이미지의 서명 링크가 만료되어 원수치 대조가 불가능했다. 커버리지 상태를 `grade-report-image-unavailable`로 추가해 완전한 학년 표와 찾았으나 열 수 없는 자료를 구분했다. 수치를 전사하거나 비교 화면에는 연결하지 않았다.
### 2026-11-04 AMC 10/12 전체 평균 자료 확장 · 2002–2006

- 웹 검색으로 MAA 작성 2005 AMC 10/12 연례 보고서의 Table I과 2008 고교 연례 보고서 Table I/II를 확인해 2002–2006 회차별 전체 응시 평균을 기존 비교 참조에 추가했다. AMC 10 2002A, 2003–2006 A/B 및 AMC 12 2002–2006 A/B가 반영됐다.
- 2002 AMC 10 B는 MAA 2005 보고서 텍스트 전사에서 평균 68.5로 읽히지만 공개 역사표는 74.9로 표시해 충돌한다. 정확한 인쇄 표를 확인하기 전까지 해당 폼을 보류했다. 2000–2001 평균은 뒤이은 검색에서 2차 통계표로 확인해 평균만 추가하고 원보고서 독립 검증 제한을 화면에 표시했다.
- 자료 링크는 MAA 저작물의 제3자 보관본이다. 전체 응시 평균만 기록하고, 연도별 상위 백분위나 학년 규준은 생성하지 않았다. 2010 보고서의 학교 우승자 평균 역사표는 혼합하지 않았다.
- 검수 범위: 참조 테스트에 2006 A/B, 2005 A/B, 2002 AMC 12 A/B 및 2002 AMC 10 B 미연결을 추가했다. 브라우저 결과 화면 렌더 QA는 아직 미완료다. `raw_youtube.txt`는 미추적 상태로 보존한다. 로컬 변경만, 원격 동기화/배포 없음.
- 후속 웹 검색에서 AMC 10 2000/2001 평균 64.2/67.8과 AMC 12 2000/2001 평균 64.9/56.6을 찾았다. Math Gold Medalist가 MAA 역사 통계를 출처로 들지만 일부 항목은 원보고서와 독립 검증하지 못했다고 밝혀, 평균 한정·2차 출처로 저장하고 percentile·학년 기준은 추가하지 않았다. 2001 AMC 10 공식 문제지·풀이와 AMC 12 공식 풀이 PDF는 MAA 호스팅 링크를 확인했다. 시험지 텍스트는 복제하지 않고 LIVE 허가 아카이브를 계속 사용한다. 출처 필수값 테스트가 기존 AMC 8 보고서 사본 3행의 누락 라벨도 발견해 채웠고, 참조 테스트 3개 통과·`git diff --check` 완료. 브라우저 화면 렌더 검수는 별도다.

### 2026-11-04 · LIVE 원본의 AMC 8 문항 개념 태그 연결

- LIVE 2010 AMC 8 solutions를 웹에서 열어 25문항 전체의 Concepts, difficulty rating, 문제별 해설 경로를 확인했다. 페이지는 문제를 MAA의 공식 법적 허가로 사용한다고 명시한다. [전체 풀이](https://live.poshenloh.com/past-contests/amc8/2010/solutions) · [Q20 개별 개념·풀이](https://live.poshenloh.com/past-contests/amc8/2010/problem/20).
- 원본 태그·rating·문항 경로를 `competition/historical-amc-grade/amc8-2010-item-concepts.csv`에 전사하고, GFIELD 다섯 진단 영역과 한국어 개념 설명을 `competition/amc-original-item-concept-reference.js`에 연결했다. 화면에서 추천 영역을 직접 바꿀 수 있으며 결과가 원본 태그 분류/수동 수정으로 나뉜다. LIVE difficulty rating은 가져왔지만 지필드 학년/등급/진단점수로 쓰지 않는다. 원문·정답·힌트·해설은 저장하지 않는다.
- 회귀검사: source-reference·연도별 1,025행 inventory·paper-review-analysis 단위 검사 16/16 통과, JS 구문 검사 및 `git diff --check` 통과. Playwright 브라우저 자동 테스트는 bundled Node에서 `MODULE_NOT_FOUND`로 미실행이며, IAB에서 2010 AMC8 화면의 25/25 개념 추천/문항 출처 링크 및 인쇄 PDF·답안·전문 풀이 링크 렌더를 확인했다. 결과 제출 UI 상호작용은 미확인.
- 같은 형식의 LIVE AMC 8 모든 연도 페이지를 직접 조회해 1985–2026(2021 제외) 41회, 1,025문항의 개념 태그·rating·문항 URL을 `competition/historical-amc-grade/amc8-item-concept-source-inventory.csv`에 수집했다. 이어 175개 고유 태그를 `amc8-gfield-concept-crosswalk.csv`로 GFIELD 5개 영역에 연결하고, 2010년 문항별 검토값은 유지했다. 다른 연도는 LIVE 태그에 따른 수정 가능한 영역 제안이며, 실제 문항 내용을 독립적으로 검토한 완전한 진단 분류나 학년 수준 판단은 아니다.
- 이어서 기존 연도 선택기로 1985/2026 등 과거·최신 회차를 열어 영역 제안과 출처 링크, 오답 결과, 맞춤형 GFIELD 연습 연결을 실제 화면에서 검증한다. 오분류/복합 태그를 정정한 뒤 AMC 10/12·AIME의 전체 회차/폼 태그 수집과 크로스워크를 이어간다. 원문·답·풀이 미복사. `raw_youtube.txt` 미추적 파일 보존.
- 로컬 전용, 원격 반영·배포·Drive 동기화 없음.

### 2026-11-04 · AMC 8/10/12/AIME 원본 개념자료 전 회차 수집

- 웹에서 [LIVE 전체 연도별 시험지 아카이브](https://live.poshenloh.com/past-contests)와 [문항별 개념 색인](https://live.poshenloh.com/past-contests/concepts)을 확인했다. LIVE 페이지는 원문 문제의 MAA 공식 사용 허가를 명시한다. 실제 문항·보기·답·힌트·풀이 텍스트는 복사하지 않고, 문항 번호/원본 태그/공개 difficulty rating/원본 문항·해설 링크만 로컬 CSV에 저장했다.
- `boarding-school-math/competition/amc-item-concept-source-inventory.csv`: 266회, 6,500문항 (AMC 8 1,025 / AMC 10 1,300 / AMC 12 3,110 / AIME 1,065). 별도 `amc-live-concept-taxonomy.csv`: 현행 LIVE 개념 분류 256개. `amc-gfield-concept-crosswalk-all.csv`: 전체 원본 태그 911개의 GFIELD 진단 영역 제안. 현행 개념 목록에 없는 655개 태그는 slug 이름 분석 기반으로 자동 제안하고 교사 검토 필요를 기록했다. AMC 8 기존 2010 교사 검토 매핑과 기존 연도별 태그 매핑은 보존했다.
- `amc-original-item-concept-reference.js`가 이제 네 대회의 전 회차를 조회하며, paper review 영역 선택은 AMC 8/10/12/AIME 모두 여섯 영역(식과 대수 관계 / 수와 정수의 성질 / 기하 도형과 측정 / 경우의 수와 확률 / 자료와 통계 / 함수와 그래프)을 지원한다. 답안에 따라 오답·미응답, 원본 해설 링크와 GFIELD 유사 연습으로 이어지는 UI에 태그 영역 제안을 연결했다. LIVE rating을 학년·점수·숙달도 기준으로 쓰지 않는다.
- 재현: `python3 boarding-school-math/scripts/fetch_live_amc_item_inventory.py` (LIVE 공개 페이지에서 원본 메타데이터 새로 수집), 이후 `python3 boarding-school-math/scripts/build_amc_item_concept_reference.py` (전체 CSV crosswalk와 JS 참조 모듈 재생성). 현재 시험지 인쇄/답안/해설은 원본 호스트 링크를 사용한다.
- 검증: LIVE 메타데이터 재생성 후 6,500문항/266폼/911 태그/256 현행 분류 집계 확인. `amc-original-item-concept-reference`와 `paper-review-analysis` 검사 17/17 통과, JS 구문 3개 및 Python `py_compile`, `git diff --check` 통과. IAB에서 2025 AMC 10 A 원본 PDF·정답표·전문 풀이·문항별 출처 링크, 25개 답안/영역 입력 필드를 확인했다. 결과 제출 패널의 최신 화면 렌더와 655개 태그 교사 검수는 남아 있다. Playwright는 이번 추가분에서 실행하지 않았다.
- 로컬 커밋 `Index year-by-year AMC and AIME source concepts`에 포함. 카탈로그의 266개 인쇄 PDF 링크를 모두 HEAD 확인해 사용 가능 응답을 받았다. Push/배포/Drive 동기화 없음. `raw_youtube.txt` 미추적 원본은 스테이징·커밋하지 않았다. 655개 현행 색인 밖 태그의 자동 분류는 실제 문제의 교사별 개념 검토가 아니다.
- 후속 교차표 검수에서 태그 부분 문자열 충돌(예: `derangements`의 `range`)을 찾아 전체 911 태그를 LIVE 원분류 우선으로 재분류했다. AMC 8/전체 크로스워크와 6,500개 모듈을 다시 생성했고, 해당 충돌 사례 회귀검사를 추가했다. 재검증 17/17 통과. 보정분까지 포함해 커밋은 로컬에만 보관한다.

### 2026-11-04 · AMC 10/12/AIME 원본 오답에서 개념별 GFIELD 창작 연습 연결

- 웹 조사에서 [LIVE AMC/AIME 연도별 아카이브](https://live.poshenloh.com/past-contests)가 MAA 허가를 밝히고 266개 시험지·6,500문항의 인쇄본, 답안, 풀이, 문항별 개념/난이도 링크를 제공하는 것을 확인했다. 대표 경로: [2026 AMC 8](https://live.poshenloh.com/past-contests/amc8/2026), [2025 AMC 10 B 정답](https://live.poshenloh.com/past-contests/amc10/2025B/answers), [1950 AMC 12](https://live.poshenloh.com/past-contests/amc12/1950), [1983 AIME 풀이](https://live.poshenloh.com/past-contests/aime/1983/solutions). MAA의 [AMC 10A 공식 풀이 PDF](https://maa.org/wp-content/uploads/2024/08/2022-AMC-10A-solutions.pdf)는 교육 목적 공유와 수익 목적 복제를 구분하므로, 앱은 원문을 복사하지 않고 허가 아카이브의 직접 링크를 유지한다.
- 이미 연결된 AMC 10에 이어 AMC 12와 AIME 복습에서 오답/미응답 원본 문항의 개념 태그를 지필드 자체 모의고사 및 개념 연습으로 전달한다. 직접 태그가 일치하는 GFIELD 창작 문항을 먼저 보여 주고, 해당 개념 연습이 없는 경우 선택 영역 문항으로 넓힌다. 원본 연도·폼·문항과 진단 맥락을 후속 화면까지 보존한다. 지필드 문제은행의 실제 문제와 풀이를 사용하며 AoPS 등 외부 교재로 보내지 않는다.
- AMC 12 창작 연습 15문항 및 AIME 창작 연습 12문항에 각 문항이 실제 다루는 개념 태그를 부여했다. UI는 LIVE 개념 태그를 원문 풀이에서 발견한 신호로 표시하며, 공식 정답/등급/학년 예측 또는 동등 난도 증거라고 주장하지 않는다. 시험 성적과 원본 개념 분류는 별도 유지된다.
- 수동 브라우저 검수: 2025 AMC 10 원본 답안 대조에서 Q1 오답을 잡고 정답표, 풀이, 출처 개념을 표시했으며, 후속에 지필드 창작 문항 3개가 연결됐다. AMC 12 직접 개념 링크는 일치하는 창작 문항 1개를 보였다. 2025 AIME I Q1·2 선택 흐름은 나머지/경우 나누기 개념에 맞는 창작 문항 3개를 표시했다. 연도/폼/문항 메타데이터 전달은 코드 경로를 확인했다.
- `git diff --check` 통과. 이 셸에서 `node`, `bun`, `deno` 실행 파일을 찾지 못해 JS 구문 CLI 검사는 미실행; 별도 브라우저에서 페이지를 열고 기능을 확인했다. `raw_youtube.txt`는 미추적 원본으로 그대로 제외한다. 로컬 전용; push/배포/Drive 동기화 없음.
- 다음 진행: AMC 8 태그별 창작 연습에도 같은 연결 UX를 적용한 뒤, 911개 교차표 태그 중 자동 분류로 생성된 태그를 교사 검토 큐로 나누고 정리한다. 원본 자료의 연도별 인쇄/답안/해설 경로는 전 회차 연결된 상태다.

### 2026-11-04 · AMC 8 연도별 원본 → 지필드 창작 학습 연결 마감

- 추가 웹 검색으로 [LIVE의 MAA 허가 연도별 AMC 원본 아카이브](https://live.poshenloh.com/past-contests), [문항 개념 색인](https://live.poshenloh.com/past-contests/concepts), [MAA AMC 공식 안내](https://maa.org/student-programs/amc/)를 재확인했다. 전체 연도별 원본은 인쇄용 PDF·답안·해설로 연결하고, GFIELD는 실제 시험 문구를 복제하지 않는다. 기존 로컬 색인은 AMC 8/10/12/AIME 266회·6,500문항이며 시험 연도별 원본 경로를 이미 포함한다.
- AMC 8 복습의 오답/미응답 개념을 자체 모의고사까지 전달하고, 모의고사 결과는 원본 출처 개념과 분리한 `mockConcepts`로 후속 연습에 넘긴다. 25개 지필드 창작 연습 문항에는 각 문항의 실제 풀이 개념 태그를 부여했다. 후속 학습은 원본 또는 모의고사 오답 개념과 일치하는 지필드 창작 문항을 먼저 골라 보여 주고, 개념을 연결하지 못할 때만 선택한 영역 전체로 넓힌다. 원문 출처는 연도·폼·문항을 유지한다.
- AMC 8 태그 175개의 한국어 표시 이름을 crosswalk에서 로드하고, 개념 표시는 4개 뒤 `외 N개`로 접는다. 문항 선택 수가 길게 나열되지 않게 요약하며, 원본/모의고사 태그가 같은 창작 문항을 두 번 세지 않는다. 긴 AMC 8 오답 목록을 전달한 수동 브라우저 점검에서 한국어 문구·25개 연결 연습 렌더·연도별 원본/결과 돌아가기 링크 및 콘솔 오류 없음 확인.
- `git diff --check` 통과. 별도 자동 테스트는 추가하거나 실행하지 않았다. AMC 8 전체 미응답 QA 흐름은 이전 수동 점검 중 로컬 집계형 지필드 모의고사 결과 요약 1건을 이 기기에 생성했다(개별 답안·이름·학교 기록 없음). 이 기록은 다른 사용자 데이터와 분리 확인할 방법이 없어 지우지 않았다. `raw_youtube.txt`는 원본 미추적 파일로 보존·스테이징 제외.
- 변경은 Mac 로컬 저장소에만 있다. push·배포·Drive 동기화 없음. 후속으로 원본 개념 매핑 중 LIVE 자동 제안을 교사 검토 대상으로 나누고, 대회 원본의 연도별 학년/집단 비교는 회수 가능한 해당 연도 출처에 한해서 확장한다. 보유한 전체 참가자 점수분포와 학년별 평균/분포를 혼동하지 않는다.

### 2026-11-04 · AMC 8 benchmark web search follow-up

Searched 2016–2024 AMC 8 MAA Overall grade score reports and recent cutoffs. Search results reconfirmed the existing 2018 whole-contest report row, and the 2023–2026 all-participant report figures already staged from MAA score reports. No new publicly accessible MAA overall grade-by-score table was recovered. The 2020 Bard Math Circle result is a participating circle's local summary (e.g., one grade average), not a national cohort; excluded it from the comparison dataset. Keep the existing same-year/matching-cohort rules and do not convert contest marks into a school grade equivalent. Web search sources reviewed: https://mathcontest.org/sites/default/files/AMC8-2018-Score-Distribution.pdf ; https://www.bardmathcircle.org/p/2020-amc-8 .

### 2026-11-04 · AMC 10A Grade 7 연도별 통계 보충

- 사용자가 요청한 웹 검색으로 [Archimedean Schools 2019 AMC 10A 게시물](https://www.archimedean.org/amc-grade-7-student-sailalitha-kodukula-makes-history/)을 확인했다. 해당 페이지는 Grade 7 참가자 1,982명, 평균 59.72/150을 보고한다. MAA 원본 통계 PDF는 회수하지 못했으므로 학교가 공개한 2차 보고로 분류했다.
- 정확히 AMC 10A · 2019 · Grade 7에서만 결과에 노출하도록 통계 CSV/참조 모듈/coverage manifest를 연결했다. 화면에서 출처의 2차 성격과 제한을 명시한다. 백분위·현재 능력 등급·타 연도 비교로 확장하지 않는다.
- 구현 파일: `boarding-school-math/competition-paper-review.html`, `boarding-school-math/competition-paper-review.js`, `boarding-school-math/competition/amc-historical-grade-reference.js`, `boarding-school-math/competition/historical-amc-grade/` 하위 CSV/README; 근거 기록은 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`.
- 수동 브라우저 확인: AMC 10 A 2019, Grade 7에서 LIVE 정답표 대조 후 결과에 기록 학년 참가자 1,982명·평균 59.72/150·학교 2차 출처 안내 및 링크가 표시된다. 인쇄/PDF 링크와 25개 문항의 답안·원본 풀이 링크가 선택되는 상태도 확인했다. 검수용 입력은 저장하지 않고 새로고침으로 초기화했다. CSV coverage 266행 및 신규 원자료 1행 확인, `git diff --check` 통과.
- 다음 작업: 다른 AMC 연도·학년의 공개 학년 통계와 보고서를 웹에서 더 찾아 회차/폼/모집단이 검증된 원문만 같은 방식으로 추가한다. 현재 2019 A/Grade 7 외의 연도/폼에 이 평균을 확대하지 않는다. `raw_youtube.txt`는 미추적 원본이며 이번 변경에서 제외한다. 원격 push·배포·Drive 동기화 없음.

### 2026-11-04 · MAA 연도별 Grade Report 메뉴 인덱스 추가

- MAA의 2022-02-04 Internet Archive 페이지 정적 HTML에서 39개 AMC 8/10/12 통계 메뉴 ID를 회수했다. 목록은 AMC 8 2010–2020, AMC 10/12 2009–2020 및 2021 봄·가을 A/B이며, MAA 메뉴가 Grade Average와 점수별 Grade Report를 설명한다. `maa-historical-report-menu-2022-02-04.csv`에 ID·날짜·레이블을 기록했다.
- 266행 coverage CSV에 보존 메뉴 ID·레이블·캡처 URL·본문 회수 상태 열을 추가했다. 67개 AMC8/10/12 원본 항목에 ID가 대응하지만 Internet Archive의 ReportViewer 본문은 보존되지 않았다. 이 ID 매핑은 연도별 원자료 회수 인덱스이며 통계값은 아니다. 2013 AMC 10A 미국 위치 Grade 7–10 표와 2019 AMC 10A Grade 7 전국 학년 평균 외에 새 수치는 추가하지 않았다.
- 검증: coverage 행 266개 유지, CSV 파싱 overflow 0, MAA 메뉴 ID 39개 고유, 2021 A/B vs C/D가 각각 88/89 및 93/94로 정확히 분리됨. 다음 단계는 이 보고서 ID로 원본/동시대 사본의 실제 본문·점수표를 회수하는 것이다.
- 현재 브랜치 `codex/boarding-g7-nsa-mac-20261017`; 이전 데이터/UI 커밋 `beb6e8b4`, 검색·인수인계 커밋 `82d8c517`; 이번 메뉴 인덱스 작업은 아직 미커밋. `raw_youtube.txt`는 미추적 사용자 파일로 보존한다. push·배포·Drive 동기화 없음.

### 2026-11-04 · AMC 연도별 학년 자료 웹 검색 후 모집단 재분류

- 연도별 검색에서 AMC 8 2013/2014/2016, AMC 10/12B 2015–2022의 Bard Math Circle 행사 보고와 2015 싱가포르 학교 성적 PDF를 확인했다. 모두 해당 행사·학교 응시자 집단 결과여서 전국 Grade Report 값으로 합치지 않는다. 2019 AMC 10A 전국 Grade 7 평균(59.72, 1,982명)처럼 전국 집단과 회차·학년이 일치하는 기존 행만 비교 자료로 유지한다.
- 2011 AMC 8 한국 MAA 결과 재게시에는 학년 평균, 점수별 학년 빈도/백분위, 문항별 응답률이 함께 있다. 이 자료는 기존 한국 집단 CSV에 이미 전사되어 있어 중복 수치를 추가하지 않았고, 개인 수상자 명단은 가져오지 않았다.
- 검색 근거·범위는 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`의 `연도별 AMC 8/10 현지 보고서 구분` 절에 기록했다. 새로운 전국 학년 행은 없으며 MAA 메뉴 ID에 대응하는 원 보고서 본문 확보를 다음 검색 작업으로 유지한다.
- `git diff --check` 완료 후 이 문서 기록을 별도 로컬 커밋으로 보관한다. `raw_youtube.txt` 미추적 원본은 건드리지 않았다. push·배포·Drive 동기화 없음.

### 2026-11-04 AMC 8 학년 평균 연도자료 추가

웹에서 99CEF의 2013·2014 AMC 8 분석 보고서 원문을 찾아 Global·Taiwan의 Grade 5–8 평균·인원을 분리 전사했다. 원 CSV에는 두 모집단과 `<=4` 묶음값을 모두 보존하고, 복습 화면 lookup에는 Global 정확 Grade 5–8만 연결했다. 2013 Global 학년 행은 146,766명/전체 149,709명, 2014는 141,795명/전체 144,737명이며 각각 학년 미기재 2,943명과 2,942명을 할당하지 않았다. 대만 표본은 각 연도 전체와 합계가 일치한다.

검증: 두 연도 각각 원 CSV 10행, 모집단별 인원 합계, runtime lookup Grade 5–8 4행, coverage CSV 266행을 정적 확인했고 `git diff --check` 통과. JavaScript 엔진 CLI가 이 실행 환경에 없어 실제 JS 실행은 미실시. 브라우저는 기존 localhost 경로에서 이 checkout을 제공하지 않았고, file URL은 브라우저 보안 정책이 차단해 화면 상호작용 검수는 보류. 현재 연도별 공개 AMC8 grade-mean lookup에는 2013–2014 빈칸이 채워졌고, 2015–2016은 표본에 근거한 전체 학년 보고서가 더 확보될 때까지 미등록으로 둔다. 변경은 로컬 커밋; push·배포·Drive 동기화 없음. `raw_youtube.txt`는 미추적 사용자 파일로 제외.


### 2026-11-04 AMC 8 2015 연도 자료 추가

추가 웹 검색에서 99CEF 2015 AMC 8 분석 보고서를 회수했다. Global·Taiwan 학년별 인원/평균을 모두 원 CSV에 남기고, Global Grade 5–8 평균만 해당 연도 lookup에 연결했다. Global 전체와 기록 학년 표 차이는 2,454명으로 명시한다. 보고서의 25문항 Global·Taiwan 선택률·공란·판독불가 비율도 별도 CSV로 보존했고, 정답 표식 25개를 LIVE 답안표와 대조했다. 화면에는 전체 Global 반응률만 제공한다.

정적 검증: 2015 평균표 10행, 문항반응표 50행(두 모집단 × 25문항), Global 응답 lookup 25행, 퍼센트 합계 허용오차, 답안키 대조 및 coverage CSV 266행을 검사한다. 실제 브라우저 상호작용은 이 checkout의 localhost 경로를 확보하지 못해 계속 보류. 이 다음은 추가 AMC8 2016/이전 보고서 원문 검색과 2011–2020 MAA report-body 복구 탐색이다.


### 2026-11-04 · AMC 8 2012/2015 웹 원자료 후속 반영

- 검색으로 99CEF의 2012 상세 보고서와 2015 보고서를 다시 확인했다. 2012/2015 Global 정확 Grade 5–8 평균을 연도별 lookup에 넣고, Taiwan·묶음학년·unknown 행은 별도 CSV로 보존했다. 원본 LIVE 답안표에 각 연도 25개 정답을 대조했고 2012/2015 Global 문항 응답 자료를 lookup으로 연결했다. 2012의 Global·Taiwan 반응률 50행과 2015의 50행을 각각 CSV로 보관한다.
- 2012 상세 보고서 전체(151,117/평균10.64)와 별도 연도표(150,360/10.66)는 서로 다른 보고 수치라 구분해 남겼다. coverage/근거 문서에 차이를 명시했다. 2016 검색에서 확인한 Bard 행사 표본(35명)은 전국 기준에 사용하지 않았다.
- 검수: Node REPL에서 AMC 8 2012/2015 Grade 5–8 reference 8개를 로드하고 2012 Global, 2015 Grade 6/7 모두 Global 반응표을 확인했다. 2012/2015 Global 25개 answer key가 LIVE와 일치한다. 반응률 총합은 2012 Global과 2015 Global/Taiwan에서 100%±0.06 안에 든다. 2012 Taiwan Q12 text extraction은 95.01%로 합계 불일치해 미검증 표시했고 앱은 Global만 쓴다. `git -c core.whitespace=cr-at-eol diff --check` 통과. 웹 화면 브라우저는 현재 checkout을 제공하는 localhost 경로를 확인하지 못했으므로 UI 검수를 주장하지 않는다.
- 작업 위치: `/Users/docssam/Developer/GFIELD/continuations/boarding-school`, branch `codex/boarding-g7-nsa-mac-20261017`, parent commit `ee14f04f4`. 로컬 변경 미커밋. `raw_youtube.txt` 사용자 원본 제외. push/deploy/Drive sync 없음. 다음은 정적 검수 후 추가 연도별 원문 검색(AMC 8 2016, 2011 및 MAA legacy report body)이다.


### 2026-11-04 · AMC 8 2013·2014 전체 응답률 웹 자료 추가

- 사용자 요청에 따라 웹 검색에서 99CEF AMC 8 2013·2014 원 보고서의 Global 및 Taiwan 문항별 선택·공란·판독불가 비율을 확보했다. 전체 인원은 각 모집단 2013 Global 149,709/Taiwan 9,811, 2014 Global 144,737/Taiwan 9,199이다. 정답 표식은 LIVE의 각 연도 키와 확인했다. 자료는 `amc8-2013-global-taiwan-item-response.csv`, `amc8-2014-global-taiwan-item-response.csv`에 50행씩 들어간다.
- 런타임은 2013·2014 Global 전체집단 분포를 모든 선택 학년에 공통으로 보여준다. 2013 MEC 63명/55명 학년별 학교 표본은 provenance로만 두어 Global 응답 테이블을 덮지 않게 했다. 2015 단일 학교 표본도 기존에 Global 우선 처리되어 있다. cache query `20261104-10`으로 갱신했다.
- 기존 Node 회귀 검사 파일의 2013/2015 학교 표본 기대값을 Global runtime에 맞춰 변경했다. bundled Node REPL에서 수정 모듈을 불러 2012–2015 연도별 25문항, 2013/14 50개 키, 표본수, 연도별 런타임 참조 및 2013 Global Q20 자동 제외를 확인했고 이상 없음. Node CLI는 이 셸에 없어 `.cjs` 전체 테스트는 직접 실행하지 못했다. CSV 100행은 각 모집단에서 25개씩 확인했고 비율 합계는 2013 Global Q20만 99.59%로 불일치, Taiwan Q25는 원 보고서 B 선택 52.17%로 교정 후 합계 허용오차 통과; Q20은 원자료 보존 및 runtime 제외. `git -c core.whitespace=cr-at-eol diff --check` 통과. 2013/14 원 PDF 링크는 웹 도구로 본문 확인했으나 terminal HTTP는 404를 반환했고 UI 검수는 아직 하지 않았다.
- 다음: 검증 후 이 추가분을 커밋. 이어 AMC 8 2016 및 MAA legacy report body를 웹에서 계속 찾는다. `raw_youtube.txt` 미추적 파일은 건드리거나 스테이징하지 않는다. push/deploy/Drive sync 없음.

### 2026-11-04 · AMC 8 2016·2020 학년 통계 검색 후속

- 웹에서 MAA 과거 report 메뉴의 2016 AMC 8 ID 63과 LIVE 2016 원본 답안 페이지를 확인했으나 MAA ReportViewer 본문/전국 학년표는 확보하지 못했다. 발견된 Bard 2016 집단은 35명 행사 표본이며, Ivy League 게시물도 준비반·지역 인원 통계라 전국 Grade mean으로 쓰지 않았다.
- 2020도 Bard 행사 학년 평균만 찾았고, MAA 공개 전국 학년표는 회수하지 못했다. Think Academy 2차 안내의 전체 평균·컷오프는 학년별 Grade Report로 오인하지 않는다. 기존 coverage는 2016/2020 `no-grade-table-recovered`를 유지한다. 탐색 및 출처 판단은 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 남겼다.
- 다음은 AMC 8 2016/2020의 MAA Grade Report 원문 본문 또는 독립적으로 확인 가능한 연도별 전체 점수분포를 검색하고, 확인되는 범위에서 해당 모집단만 별도 비교에 추가한다. 원본 모집단·연도·학년이 불명확한 학원 표본은 전국 규준으로 확대하지 않는다. 2013/14 문항응답 업데이트는 커밋 `627c10c6`; `raw_youtube.txt`는 미추적 사용자 파일로 그대로 둔다.

### 2026-11-04 · AMC 8 2011 MAA 학년표 웹 재조사

- 웹 검색으로 당시 MAA 결과 요약 보존본, 전국 `Grade_and_Gender_Average.pdf` 경로를 인용한 동시대 게시물, 2011 참가 규모를 제시한 Connecticut 교육 자료를 확인했다. 보고서의 전체 전국 학년표/PDF는 회수되지 않았다. 검색 색인상의 초기 25·24점 학년 건수는 잠정 부분 집계이므로 규준으로 추가하지 않았다.
- 추가한 것은 커버리지 표의 직접 보고서 경로·회수 상태와 증거 문서의 출처·분모 주의사항이다. 한국 2011 학년 평균 n=899는 기존 별도 한국 모집단 CSV에 이미 있으며 전국 통계와 섞지 않는다. CT 자료의 총원 153,485와 99CEF 최종 전체 요약의 152,745가 달라 전국 학년 평균을 역산하지 않는다.
- 변경 파일: `boarding-school-math/competition/historical-amc-grade/amc-grade-reference-coverage-by-paper.csv`, `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. 다음은 2016·2020 및 MAA legacy report body의 공개 원자료 검색을 이어간다. `raw_youtube.txt` 미추적 원본은 보존·제외.

### 2026-11-04 · AMC 8 2016·2020 보고 경로 재검증

- 웹에서 AMC Summary of Results and Awards 인쇄 아카이브의 2010 종점과 MAA Historical Statistics 온라인 ID 63/87을 교차 확인했다. 상세 `Contest Score Grade Report with Percentile`을 선택할 수 있었으나 2022년 보존본에는 실제 보고 표가 없다.
- 2016·2020 전국 학년별 점수표는 미회수 상태로 유지했다. MAA 지역 뉴스레터의 2016 평균도 확인했으나 참가수 108,295가 99CEF 분석의 108,227과 달라 별도 보고값으로 보존한다. 2020 Wisconsin 보고는 미국 전체 평균 10.01만 제공하고 학년/분모는 없다.
- 자료 상태 및 경로를 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 기록. 다음은 ID 63/87 report body 복구를 계속하거나, 학년별 점수표가 실제 공개된 다른 회차/지역 보고서의 모집단을 분리 추가한다. `raw_youtube.txt`는 제외.


### 2026-11-04 · 웹 검색 회수: 2020 AMC 8 학년 평균표

- TestDaily에 재게시된 MAA `Grade and Gender Average AMC 8 2020 · Location: Overall` 이미지를 웹에서 직접 회수했다. Apple Vision OCR과 이미지 셀 대조로 Grade 5–8 응시 인원/평균을 확인하고 연도별 자료 CSV·비교 lookup·coverage에 등록했다. `<=4`와 `UNK`는 그룹 상태로 보존한다.
- MAA 보고 이미지의 `All`은 n=56,099·평균 10.00이다. MAA Wisconsin Section의 미국 평균 10.01과 모집단/보고값이 달라 합치지 않는다. 2016 Grade Report는 아직 미회수. 근거: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`.
- `raw_youtube.txt`는 미추적 사용자 파일로 보존·제외.


### 2026-11-04 · AMC12A 연도별 학년 평균 보고서 회수

- 웹 검색으로 99CEF AMC12A 연례 분석 보고서의 2012, 2013, 2014, 2015, 2016, 2018 A형 학년별 인원·평균표를 회수했다. Global 모집단(2012–2016)과 미국·캐나다(2018)를 분리하고 Taiwan 통계는 혼합하지 않았다. PDFKit 텍스트 및 렌더한 표 페이지 이미지로 확인했다.
- 정확 학년 평균 7–13(2016은 14 포함)을 paper review lookup에 등록했다. `<=6`, unknown은 원 CSV에만 그룹으로 남겨 특정 학년에 매칭하지 않는다. 학년 수와 평균은 같은 AMC12A 연도에만 비교한다. report-level overall 평균과 2014 weighted subgroup mean 차이(64.00 vs 64.02)는 원문 값을 유지하고 기록했다.
- 변경: `amc12a-grade-means-2012-2018.csv`, `amc-historical-grade-reference.js`, grade coverage manifest, README 및 `AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`. JavaScriptCore에서 2012–2018 매칭 표본을 확인하고 CSV의 참가자 수 합계와 `git diff --check`를 점검했다.
- 다음: 연도별 원본 시험 문제·정답·해설 워크플로는 LIVE 자료 인벤토리에 이미 연결되어 있다. 추가 학년 비교표는 AMC12 B형, AMC10 2017/2019 및 2017/2019 AMC12A의 연도별 원문을 계속 검색한다. 과거 평균은 학년 등급 예측으로 쓰지 않는다. `raw_youtube.txt`는 제외했고 원격 push/배포/Drive 동기화 없음.


### 2026-11-04 · AMC12B 2012 및 후속 연도 통계 웹 검색

사용자가 연도별 실제 AMC 자료를 웹 검색으로 확보하도록 요청해 2012 AMC12B 원시험지, MAA 해설지, 학년별 통계 보고서를 각각 검색했다. LIVE의 2012B 원본 페이지는 인쇄 PDF·정답·전문 풀이를 제공하며 MAA의 교육용 재사용 허가를 명시한다. MAA 작성 2012 해설지 사본도 검색됐고 해설지 자체에 시험문항/해설의 교육용 복제 허가 문구가 포함되어 있다. 기존 원본 카탈로그는 2012B 인쇄/답/풀이 링크를 이미 갖고 있어 중복 항목을 만들지 않았다.

2012B grade 통계로 검색된 결과는 전체 평균 70.08, AIME cutoff 99, DHR 114 등 전체집단 값뿐이다. College Confidential의 당시 글은 MAA 2012B 통계 메뉴로 이어지는 경로와 상위 5% 미포함 당시 상태를 언급하지만 학년별 표를 제공하지 않는다. MAA 보존 메뉴에는 `AMC 10/12 B 02/22/2012` 결과 항목이 남아 있으나 ReportViewer 본문은 보존되지 않은 상태다. Grade 11/12 등 전국 학년 평균 숫자는 새로 만들지 않았다. 2015–2017 검색에서는 2015–2017 Bard Math Circle 행사 소표본만 확인되어 전국 수치에서 제외했고, MAA 2016 교사 매뉴얼은 2015 요약 자료가 당시 게시됐다고만 확인해 준다.

출처: [LIVE 2012 AMC12B 원시험지·정답·풀이](https://live.poshenloh.com/past-contests/amc12/2012B), [MAA 2012 AMC12B 해설지 사본](https://www.isinj.com/mt-amc12/2012AMC12-Bsolutions.pdf), [당시 MAA 통계 페이지를 가리키는 2012 대회 토론](https://talk.collegeconfidential.com/t/official-amc-12-2012-discussion-thread/1242057?page=14), [2012B 전체 평균 등 2차 연도 통계표](https://mathgoldmedalist.com/competitions/amc-12), [2016 MAA 교사 매뉴얼 검색본](https://studylib.net/doc/8764350/amc-10-12-teachers--manual---mathematical-association-of-...). 연도별 학년표 발견과 전체 평균 발견을 서로 다른 데이터 상태로 유지한다.

### 2026-11-04 · 2014 AMC10B 학년 평균 웹 검색·연도 조회 연결

GEMT 2014 AMC10B/12B 연례 보고서에서 2014 AMC10B Global 학년별 행을 추가 확인했다. Grade 7 (n=1,511, mean 77.36), 8 (3,178, 79.36), 9 (12,551, 64.14), 10 (22,389, 73.76)을 기존 exact-year/form/grade 결과 참조에 넣었다. `<=6` 및 미기재 학년은 집계 파일에 보존하되 개인 학년 조회와는 매칭하지 않는다. Taiwan 행은 제외했다.

출처 내부 집계가 일치하지 않는다. 학년 행 인원 합은 41,675이며, 보고서 p.3 요약표는 전체 n=42,032, p.4 점수 구간표는 n=41,682다. 하위행의 인원 가중 평균은 71.38, p.3 인쇄 전체 평균은 71.45다. 어떤 숫자도 보정하지 않았고 이 차이를 각 행의 주석과 coverage manifest에 남겼다. 자료는 웹 인덱스 텍스트에서 전사했으며 로컬 PDF 페이지 렌더는 확인하지 않았다.

검증은 CSV 행·연도별 그룹합과 런타임 lookup을 대조한다. 출처와 제한은 [AMC 학년 비교 근거](boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md) 및 [GEMT 2014 보고서](https://www.gemt.org.tw/wp-content/uploads/2013/10/2014AMC10B12B%E5%88%86%E6%9E%90%E5%A0%B1%E5%91%8A0415.pdf)에 기록했다. `raw_youtube.txt`는 수정하지 않는다. Local only; no push, deployment, or Drive sync.

같은 보고서 p.8의 AMC10B 문항별 Global 응답표 A–E/무응답/판독불가 비율 25행도 연도·폼 정확히 묶어 item-response reference에 연결했다. LIVE answer key와 25개 정답을 교차 확인했다. 사용 화면은 학생이 선택한 오답 비율 또는 최다 오답 비율을 과거 집단 맥락으로만 보여주며, 개별 오개념 판정이나 학년 기준은 아니다. CSV `amc10b-2014-item-response-percent.csv`와 증거 문서에 출처·n 및 p.3 전체 인원(42,032) 대 p.4 response denominator (41,682) 차이를 남겼다. PDF는 웹 인덱스 텍스트로 전사했고 로컬 페이지 이미지 검수는 하지 않았다.

웹 검색에서 추가 확보한 2016 AMC10A/12A 99CEF 보고서 Global 문항별 응답표(p.11, p.22) 50행을 각각 문항 폼 일치로 연결했다. 전 선택지·무응답·판독불가 비율이며 모집단 n은 65,999 및 55,279다. 정답키는 LIVE와 대조했다. 마지막 행의 깨진 판독불가 숫자는 텍스트 중복 부분에서 클린 값 0.01%/0.02%를 채택하고 CSV 노트에 명시했다. 참조/CSV/근거/README가 갱신됐고 브라우저는 `?program=amc10&year=2016&form=A` 또는 `?program=amc12&year=2016&form=A`로 확인할 수 있다. PDF 원페이지 이미지 검수는 미실시. Local only; no push, deployment, or Drive sync.
### 2026-11-04 2014 AMC10A/12A 글로벌 문항응답 자료 추가

웹 검색으로 99CEF 2014 AMC10A/12A 분석 보고서를 확인하고, 현재 99CEF URL이 다른 연도 보고서를 반환해 Internet Archive의 2015-09-08 원본 보존본을 내려받아 PDFKit으로 추출했다. Global 표본 수 61,325 / 55,400을 보고서 점수 분포 페이지와 대조했다. 10A p.11, 12A p.24의 선택률·미응답·판독불가율을 각각 25문항 기록했고, 정답 50개를 LIVE 2014 A형 키와 대조했다. 12A 25번 원본 표는 미응답 8.49%로 인쇄되어 행 합계가 26.99%가 된다. 원문값을 그대로 보존하고 이 문항만 런타임 비교에서 제외했으며, 수치를 추정 보정하지 않았다. CSV 50행과 JS 원본 레지스트리, 정답키, 응답률 합계를 대조했다. 런타임은 10A 25문항, 12A 24문항을 반환하고 12A 25번은 숨기는 것을 확인했으며 `git diff --check`도 통과했다. 추가된 CSV 2개, 런타임 등록과 제외 처리, 브라우저 캐시 갱신 및 데이터 README 반영이 변경사항이다. `raw_youtube.txt`는 사용자 파일로 보존한다.

### 2026-11-04 2013 AMC10A/12A 글로벌 문항응답 자료 추가

웹 검색으로 99CEF 2013 AMC10A/12A 보고서를 찾아 Internet Archive 2015-09-08 보존 PDF로 내려받았다. PDFKit으로 AMC10A p.11과 AMC12A p.24를 추출하고 LIVE answer key와 각각 25개 정답을 대조했다. AMC12A 전체 n=66,525는 점수분포 누계와 일치한다. AMC10A 요약표 전체 n=69,653과 점수분포 누계 69,392는 서로 다르므로 수치를 조정하지 않고 두 수치의 차이를 README/CSV/runtime 메모에 남겼다. 2013 A형 CSV 2개, lookup 등록, 캐시 버전 및 README가 갱신됐다. CSV·JS 레지스트리 50개 문항·정답을 대조하고 전체 응답률 검산, 런타임 lookup 및 `git diff --check`를 통과했다. 로컬 커밋 완료. `raw_youtube.txt`는 staging 대상에서 제외한다.

### 2026-11-04 2012 AMC10A/12A 글로벌 문항응답 자료 추가

웹 검색으로 99CEF 2012 AMC10A/12A 전체 분석 보고서를 찾아 Internet Archive의 2014-10-05 보존본에서 내려받았다. PDFKit으로 AMC10A p.10 및 AMC12A p.22 Global 표를 추출했다. 총인원 73,703 / 72,238은 각각 점수분포 합계와 일치한다. 10A 키는 LIVE와, 12A 키는 원본 보고서 정답 표시 및 AoPS 키와 확인했다. 2012 A형 CSV 2개, runtime 조회, 캐시 버전, README를 갱신했다. CSV·레지스트리 50문항 행을 정확히 일치시키고 응답률 합계, 50개 정답, 런타임 lookup을 검수했으며 `git diff --check`도 통과했다. 로컬 커밋 완료. `raw_youtube.txt`는 staging 대상에서 제외한다.

### 2026-11-04 2011 AMC10A/12A 글로벌 문항응답 자료 추가

웹 검색으로 99CEF 2011 AMC10/12 분석 보고서를 찾고, 현재 99CEF 경로가 2010 보고서로 리다이렉트되어 Internet Archive의 2014-10-05 원본 PDF를 확보했다. PDFKit으로 AMC10 글로벌 응답표(인쇄 p.10)와 AMC12 글로벌 응답표(p.22)를 추출하고 페이지 이미지를 육안 대조했다. 보고서는 시험형식에 A/B 접미사를 표기하지 않으나, 글로벌 응시자 수 70,919 / 74,665와 50개 정답 별표가 각각 LIVE 2011A 코호트·정답키와 일치해 A형으로 등록했다. 두 표의 인원수는 각 점수구간 합계와도 일치한다. 대만 응답표를 글로벌 자료에 혼합하지 않았다. 2011 A형 CSV 2개와 런타임 참조를 추가하고 데이터 README 및 브라우저 캐시 버전을 갱신했다. CSV와 런타임 50개 문항, 정답키, 응답률 행 합계를 검수한 뒤 로컬 커밋한다. `raw_youtube.txt`는 staging 대상에서 제외한다.

2010 99CEF AMC10/12 보고서도 공식 사이트 검색 색인에서 찾아 Global 응답표를 수집했다. 원본 PDF URL은 직접 다운로드 시 404를 반환해 웹 색인의 PDF 텍스트를 사용했고, 이 한계를 CSV·런타임·README에 명시했다. 보고서의 A/B 미표기 표본 수 62,254 / 67,155가 MAA 2010 A형 공식 응시자 수와 맞고, 각 25문항 정답 별표가 LIVE 2010A 키와 일치한다. 2010 AMC10A Q23은 원문 선택지·미응답·판독불가 합이 100.20%여서 인쇄값은 보존하고 해당 문항만 화면 비교에서 숨긴다. 2010 A형 CSV 2개, 런타임 연결, README, 캐시 버전을 갱신했다. 화면 lookup·정답·합계 검수 후 로컬 커밋한다. `raw_youtube.txt`는 staging 대상에서 제외한다.
## 2026-11-04 웹 검색 반영: 2019 AMC 10B·12B cohort report

- `amc-score-distribution-reference.js`의 2019B AMC10/12 행에 공개된 MAA 형식 점수보고서 사본의 공식 표기 점수 경계, 평균, 표준편차, 인원수, 학교수를 연결했다. 문제풀이 페이지의 데이터 캐시 버전도 갱신.
- 출처: `https://mathcontest.org/sites/default/files/AMC10B-2019-Score-Distribution.pdf`, `https://mathcontest.org/sites/default/files/AMC12B-2019-Score-Distribution.pdf`. 검수: PDFKit 추출 텍스트를 웹 PDF 본문과 수치 대조.
- 이 점수보고서는 전체 코호트 통계이며 학년 분포가 없다. 2019 AMC10A Grade 7 평균은 Archimedean Schools의 2차 게시 통계(59.72, n=1,982)로 계속 별도 취급.
- 관련 한계와 출처는 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md` 및 historical-amc-grade README에 기록.
- 런타임에서 두 연도·폼 lookup의 score boundary, 평균, 표준편차, 인원수, 학교수, 출처 URL을 직접 확인했고 `git diff --check` 통과.
- `raw_youtube.txt` untouched. Local-only; no push, deployment, Drive sync. Next: find more year/form official score-report copies and pursue missing primary grade-level tables without mixing overall and grade cohorts.

## 2026-11-04 AMC 8 오답 개념 연결용 창작 연습 추가

- 기존 AMC 8 개념 교차표에서 자주 출현하지만 GFIELD 자체 연습 문항과 겹치지 않던 분수, 경우 나누기, 최적화, 자릿값, 속력, 논리 추론, 홀짝성, 삼각형·원의 넓이 개념에 창작 문항 9개를 추가했다. 고정된 25문항 시간제 모의고사와 데이터는 유지하고, 별도 개념 연습 은행으로 연결했다.
- 원본 개념 교차표 기준으로 연결되는 AMC 8 문항은 1,025개 중 601개에서 843개로 늘었다. 이는 태그가 하나라도 겹치는 수를 센 것이다. 교차표가 제안하는 개념 라벨을 사용한 연결 범위이며, 문항 분류의 독립 검증이나 진단 정확도·성취 수준을 뜻하지 않는다.
- 각 창작 문항의 고유 ID, 보기·정답 인덱스, 풀이, 개념 태그 존재를 확인했다. 로컬 브라우저의 원본 복습 진입 경로에서 연습 후보가 필터링되고, 분수는 쌓은 분수꼴로 표시되는 것을 확인했다. 새 은행 9개 중 선택된 오답 개념 조건에서 7개가 표시됐다.
- 추가 웹 검색에서 LIVE가 2025·2026 AMC 8 인쇄용 원본 시험지, 답안, 풀이 링크를 현재 제공하고 MAA 공식 사용 허가를 명시하는 것을 재확인했다. 연도별 카탈로그에 두 연도 자료가 이미 있어 중복 레코드는 만들지 않았다. [2025 AMC 8](https://live.poshenloh.com/past-contests/amc8/2025), [2026 AMC 8](https://live.poshenloh.com/past-contests/amc8/2026), [전체 LIVE 과거 시험 아카이브](https://live.poshenloh.com/past-contests).
- 변경: `boarding-school-math/amc8-concept-practice-bank.js`, `boarding-school-math/amc8-topic-practice.js`, `boarding-school-math/amc8-topic-practice.html`. `raw_youtube.txt`는 사용자 파일로 보존·제외. Local only; no push, deployment, or Drive sync.

## 2026-11-04 AMC 10 원본 개념 태그 후속 창작 연습

- 기존 AMC 10 창작 문항 은행 12개에 새 문항 13개를 추가했다. 주제는 비와 비례, 좌표거리, 평균, 백분율 변화, 홀짝·배수, 등차수열, 이차식, 원의 넓이, 부피, 정수 최적화, 정수해, 정삼각형 넓이, 분수식이다. 25문항 모두 GFIELD 자체 연습이며 AMC 원문이나 공식 모의고사가 아니다.
- 새 문항 13개가 사용하는 `sourceConcepts`는 원본 아카이브의 AMC 10 태그 목록과 모두 일치한다. 옵션 중복·누락 필드가 없고, 25문항 전체 정답 위치가 A–E 각 5개로 분포한다. 각 문항의 계산을 직접 점검했다. 연도별 원본 태그와 하나라도 겹치는 원본 문항은 1,300개 중 788개에서 1,073개로 늘었다. 이 수는 교차표 태그 범위일 뿐 분류 정확도나 진단 성능을 보증하지 않는다.
- localhost 학습 화면에서 쿼리의 13개 개념을 연결한 결과, 신규 13문항이 실제로 모두 렌더링되고 표기된 태그 라벨·힌트·풀이 접기·선택지가 표시된다. 숫자 분수는 위아래 분수꼴로 보인다. 정답표 제출, 원본 카탈로그는 변경하지 않았다.
- 변경: `boarding-school-math/competition/amc10-concept-practice-bank.js`, `boarding-school-math/amc10-practice.js`, `boarding-school-math/amc10-practice.html`, 본 인수인계. `raw_youtube.txt`는 수정·스테이징하지 않는다. Local only; no push, deployment, or Drive sync.

## 2026-11-04 AMC 12 원본 개념 태그 후속 창작 연습

- 기존 AMC 12 창작 개념 은행 15문항에 신규 14문항을 더해 29개로 확장했다. 좌표기하, 정수 경우 나누기, 닮음과 넓이비, 로그 정의역, 부등식, 대칭식 치환, 나머지 조건, 직각삼각형, 등차수열, 연속 증가율, 복소수, 근호, 정삼각형, 분수 계수 일차방정식을 추가했다. 모두 GFIELD 창작 연습이다.
- MAA 공식 안내는 AMC 12가 고등학교 수학 전체 범위를 포함하고 삼각함수·고급 대수·기하를 다루며 미적분은 제외한다고 명시한다: https://maa.org/student-programs/amc/. 문항별 sourceConcept 태그는 기존 AMC12 원본 아카이브의 태그 목록에 모두 존재한다. 정답과 풀이, 선택지 중복, 필수 필드 및 정답 인덱스를 확인했고, 정답 위치는 A–E에 6/6/6/6/5개다.
- 태그 교차표에서 연습 은행과 연결되는 AMC12 원본은 3,110개 중 1,460개에서 2,325개로 증가했다. 이는 태그 교집합 참고치이고 문항 분류 검증·진단 성능·수준 판정이 아니다.
- localhost AMC 12 화면에 신규 14문항 전체를 렌더링해 태그 요약·힌트·풀이·선택지를 확인했다. 분수는 쌓은 분수 형태로 표시된다. 문제은행에 실제 AMC 원문은 복사하지 않았다.
- 변경: `boarding-school-math/competition/amc12-concept-practice-bank.js`, `boarding-school-math/amc12-practice.js`, `boarding-school-math/amc12-practice.html`, 본 인수인계. `raw_youtube.txt`는 수정·스테이징하지 않는다. Local only; no push, deployment, or Drive sync.

## 2026-11-04 AIME 원본 개념 태그 후속 창작 연습

- 기존 정수 입력 AIME형 연습 12문항은 유지하고 별도 확장 은행에 GFIELD 창작 문항 16개를 추가해 총 28개를 연결했다. 좌표기하·연립식·삼각함수 항등식·최적화·복소수·로그·확률·닮음·디오판토스 방정식·이차식·점화식·대칭·코사인 법칙·입체기하·등차/등비수열을 다룬다.
- 신규 항목 16개는 원본 AIME 개념 태그 사전에 모두 연결되고, ID가 중복되지 않으며, 정답은 입력 허용 범위 0–999 안이다. 필수 문항/힌트/풀이/연결 문구도 모두 확인했다. AIME 원본 문제나 풀이를 복제하지 않는다.
- 개념 태그가 하나라도 일치하는 원본은 1,065개 중 528개에서 906개로 늘었다(85.1%). 이 교차표 수치는 검색·후속연습 연결 범위이지 진단 정확도나 수학적 분류 검증이 아니다.
- 브라우저에서 2025 I 원본 복습 조건을 넣고 기존 영역 필터와 함께 확인했다. 태그에 맞는 창작 문항이 선택 영역에 따라 필터링되고, 0–999 정수 입력과 힌트·풀이가 표시된다. 분수는 세로 분수 형태로 렌더링된다.
- 변경: `boarding-school-math/competition/aime-concept-practice-extension.js`, `boarding-school-math/aime-practice.js`, `boarding-school-math/aime-practice.html`, 본 인수인계. `raw_youtube.txt`는 수정·스테이징하지 않는다. Local only; no push, deployment, or Drive sync.

## 2026-11-04 AMC 8 연도별 원본 웹 자료 확인 및 개념 연습 확장

- 웹 검색으로 LIVE by Po-Shen Loh의 연도별 실제 AMC/AIME 자료를 확인했다. LIVE 아카이브는 MAA의 공식 사용 허가를 명시하고, 인쇄 가능한 원본 시험지·정답·전문 풀이를 연도별로 제공한다. 예: [2025 AMC 8 원본](https://live.poshenloh.com/past-contests/amc8/2025), [전체 AMC/AIME 과거 시험 아카이브](https://live.poshenloh.com/past-contests). MAA는 AMC 8·10·12의 공식 안내·범위를 별도로 제공한다: https://maa.org/student-programs/amc/.
- 기존 `competition/amc-original-paper-library.js`가 위 호스트의 원본 링크를 프로그램·연도·폼별로 이미 연결한다(AMC 8 1985–2026 중 2021 제외, AMC 10/12 A/B, AIME I/II). 원문을 로컬에 중복 복사하지 않고 기존 인쇄·답안·풀이 URL 생성 경로를 유지한다.
- 이전 AMC 8 창작 연습 9문항에 10개를 더했다: 체계적 나열, 중점 정사각형 넓이, 할인 후 세금, 평균과 중앙값, 약수 개수, 소수 곱, 역순 풀이, 정육면체 겉넓이, 완전제곱수, 짝짓기 합. 전체 연습 연결은 AMC 8 원본 개념 인벤토리 1,025문항 중 843개에서 917개로 늘었다. 이 값은 LIVE 태그 교차 범위이지 분류 정확도나 진단 성능이 아니다.
- 신규 10문항의 태그는 원본 175개 태그 사전에 모두 존재한다. 정답·보기·필수 필드·고유 ID를 확인했다. localhost에 2025 AMC 8 Q1 복습 조건을 열어 신규 10개 전부가 표시되는 것과 연도·문항 원본 링크, 선택지 응답, 정답 피드백, 풀이 표시를 확인했다.
- 변경: `amc8-concept-practice-extension.js`, `amc8-topic-practice.js`, `amc8-topic-practice.html`, 본 인수인계. 고정 AMC 8 모의 25문항과 원본 시험 데이터는 수정하지 않았다. `raw_youtube.txt`는 사용자 파일로 보존·제외. Local only; no push, deployment, or Drive sync.

## 2026-11-04 연도·폼별 원본 출력 및 해설 경로 대조

- 웹 검색으로 2024 AMC 10A, 2019 AMC 12B, 2025 AIME I의 LIVE 연도·폼 페이지 및 해설 페이지를 각각 확인했다. LIVE 페이지는 실제 원본 문항과 답안·풀이로 연결된다. 2025 AMC 8은 별도 인쇄 시험지 PDF와 인쇄 풀이 PDF가 직접 검색된다.
- `amc-original-paper-library.js`의 생성 경로를 위 네 사례로 실행해 시험지 PDF, 정답, 해설 URL이 LIVE 실제 연도·폼 주소와 일치하는 것을 대조했다. 예시: `amc10-2024A-exam.pdf`, `amc12/2019B/solutions`, `aime/2025I/solutions`, `amc8-2025-solutions.pdf`.
- 확인된 출처: [2024 AMC 10A](https://live.poshenloh.com/past-contests/amc10/2024A), [2019 AMC 12B 풀이](https://live.poshenloh.com/past-contests/amc12/2019B/solutions), [2025 AIME I 풀이](https://live.poshenloh.com/past-contests/aime/2025I/solutions), [2025 AMC 8 인쇄 시험지](https://live.poshenloh.com/images/past-contests/pdf/amc8-2025-exam.pdf), [2025 AMC 8 인쇄 풀이](https://live.poshenloh.com/images/past-contests/pdf/amc8-2025-solutions.pdf).
- 로컬 카탈로그 코드는 수정할 필요가 없었다. 검증은 경로 생성 확인이며 모든 과거 PDF를 한꺼번에 다운로드하거나 시각 검사했다는 뜻은 아니다.

## 2026-11-04 웹 검색 반영: 2021 AMC 봄·가을 폼 표기

- LIVE 연도별 원본 페이지에서 2021 AMC 10/12의 네 회차를 확인했다. 저장 코드 A/B는 봄 A/B, C/D는 가을 A/B다. 각 LIVE 페이지에 인쇄 PDF·답안표·전문 풀이 링크가 있고, MAA 공식 사용 허가 문구가 표시된다: [10A 봄](https://live.poshenloh.com/past-contests/amc10/2021A), [10B 봄](https://live.poshenloh.com/past-contests/amc10/2021B), [10A 가을](https://live.poshenloh.com/past-contests/amc10/2021C), [10B 가을](https://live.poshenloh.com/past-contests/amc10/2021D), [12A 가을](https://live.poshenloh.com/past-contests/amc12/2021C), [12B 가을](https://live.poshenloh.com/past-contests/amc12/2021D). 전체 연도별 목록은 [LIVE past contests](https://live.poshenloh.com/past-contests)에서 확인했다.
- 기존 카탈로그는 네 시험지를 모두 보유하지만 화면에 단순히 “A형/B형/C형/D형”으로만 표시했다. `formLabel`을 추가해 봄/가을의 실제 시험 이름과 LIVE 자료 코드를 함께 표시하고, 링크 제목에도 동일한 이름을 넣었다. 원본 문항·PDF는 계속 LIVE 제공처에서 연다.
- 검증: JS 런타임에서 2021 AMC 10 네 선택지 표기, AMC 12 가을 D 연결, 다른 연도의 기존 폼 표기, 단일 AMC 8 표기를 확인했다. 전체 연도별 경로 개수 266, review 스크립트 문법, `git diff --check` 통과. localhost는 현재 연결되지 않아 화면 브라우저 검수는 못 했다.
- 관련 파일: `boarding-school-math/competition/amc-original-paper-library.js`, `boarding-school-math/competition-paper-review.js`, 해당 라이브러리 테스트. `raw_youtube.txt`는 사용자 원자료로 제외한다. Local only; no push, deployment, or Drive sync.

## 2026-11-04 AMC 8 학년 비교 자료 추가 검색

- 빠진 2015–2016 AMC 8 전국 학년 비교표를 찾기 위해 MAA 통계, 99CEF 연례 보고서, 학년별 평균 검색을 다시 확인했다. 검색된 2015·2016 Bard Math Circle 값은 해당 시험장 45명·35명 참가자의 학년별 평균이고 전국 코호트가 아니다 ([2015](https://www.bardmathcircle.org/p/2015-amc-8), [2016](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in)). 이 값은 전국 학년 비교나 보딩 로드맵 수준 판단에 추가하지 않는다.
- [2015 99CEF AMC 8 보고서](https://www.99cef.org.tw/userfiles/2015AMC8Report.pdf)는 Global 학년 행과 Global 전체 연도별 표를 포함한다. 학년 행은 이미 `amc8-grade-means-2015-99cef.csv`에 연결되어 있다. [2019 보고서](https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf)의 US/Canada 학년 점수빈도와 문항 응답 자료도 기존 참조 CSV/화면에 있어 중복 추가하지 않는다.
- 2009–2018 참가자의 성별·상위권 분포를 분석한 논문 검색 결과는 학년별 평균·등급표가 아니므로 개인 학년 비교 기준으로 쓸 수 없다. 2015·2016 정확한 MAA grade table은 공개 검색으로 새 자료를 확보하지 못했다. MAA 과거 ReportViewer의 본문 보존본을 찾아야 다음 진전을 기대할 수 있다.
- 이 검색은 새 수치 입력을 만들지 않았다. 공식 전국 학년 자료와 특정 학교 표본을 구분하는 근거만 기록한다. 현재 데이터 커버리지 표와 정확 학년 연결 정책을 유지한다.

## 2026-11-04 웹 검색: AMC 회차 자료와 현행 일정 재확인

- 사용자가 요청한 대로 AMC 원본 자료를 연도·폼 기준으로 웹에서 확인했다. 기존 카탈로그/CSV는 이미 AMC 8 1985–2026(2021 제외), AMC 10 2000–2025, AMC 12/AHSME 1950–2025, AIME 1983–2026의 266 회차에 실제 시험지·정답·풀이 경로를 둔다. 2024 AMC 8 페이지에서 25문항·40분, 인쇄 PDF·답·풀이·문항별 연결과 MAA 허가 표시를 재확인했다. 원문을 저장소로 복제하지 않는다.
- MAA 현행 페이지의 2026–27 날짜: AMC 10A/12A 2026-11-05, AMC 10B/12B 2026-11-13, AMC 8 2027-01-21–27. 시험 전에 2026 AMC 10/12 문제 레코드를 만들지 않고, LIVE 공개 후 실제 공개된 회차에만 추가한다. 일정과 범위 요약은 `boarding-school-math/docs/AMC_YEARLY_SOURCE_CATALOG.md`에 반영했다.
- MAA 공개 점수분포 페이지는 대회 전체 통계(점수 구간, 평균·표준편차, 전체 학생·학교 수)를 보여준다. 이번 검색에서 새로 확인된 페이지는 2026 AIME II였고, 학년별 평균표는 제공하지 않았다. 따라서 이를 학년 등급이나 AMC8 20점 수준의 학년 비교에 섞지 않는다.
- 링크: [MAA AMC 연도·범위 및 일정](https://maa.org/student-programs/amc/), [MAA 현행 등록 일정](https://maa.org/amcreg/), [MAA 공개 점수분포 보고서](https://maa.edvistas.com/eduview/report.aspx?mode=6&r832=&view=1561), [2024 AMC 8 원본과 허가 표기](https://live.poshenloh.com/past-contests/amc8/2024).
- 로컬 변경: `boarding-school-math/docs/AMC_YEARLY_SOURCE_CATALOG.md`, 본 인수인계. 원본 문항·답·풀이는 추가 복사하지 않았고 점수 레퍼런스 숫자도 새로 넣지 않았다. `raw_youtube.txt`는 보존·제외한다. Local only; no push, deployment, or Drive sync.

## 2026-11-04 AMC 연도별 링크 전수 접근 확인

- 연도별 출처 CSV 266행에서 온라인 회차, 인쇄 PDF, 정답표, 전문 풀이 URL 총 1,064개를 HEAD로 확인했다. 모두 HTTP 2xx: AMC 8 164개, AMC 10 208개, AMC 12/AHSME 408개, AIME 284개. 따라서 저장된 연도·폼 라우트의 공개 접근은 현 시점 전부 확인됐다.
- 이는 접근 가능 여부 검사이며 PDF를 내려받거나 인쇄 레이아웃을 266개 모두 시각 검수한 것은 아니다. 연도별 카탈로그 문서에 동일한 범위/한계를 기록했다. `raw_youtube.txt` untouched. Local only; no push, deployment, or Drive sync.

## 2026-11-04 후속 검색: 2016 AMC 8 MAA grade-report 보존본

- Internet Archive CDX에 2016 AMC8 stats/report로 추정되는 네 URL 패턴을 조회했으나 일치 캡처가 없었다. 이 경로들에서 못 찾았다는 범위로만 기록하며 다른 경로 자료까지 없다고 단정하지 않는다. 학년 평균 값은 새로 추가하지 않았고 `no-grade-table-recovered`를 유지했다.
- 세부 검색 패턴과 자료 상태는 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`의 같은 날짜 항목에 남겼다.

## 2026-11-04 · 사용 요청에 따른 AMC 자료 웹 재검색

- 사용자가 “웹 검색으로 가져와”라고 요청해 AMC 원본과 학년 비교 자료를 직접 검색·대조했다. LIVE의 MAA 허가 아카이브에는 AMC 8/10/12 및 AIME가 연도·폼별로 실제 시험지 PDF, 정답표, 전문 풀이로 정리되어 있다. 기존 CSV에 있는 266개 회차/6,500문항 메타데이터 링크를 확인했고, 원문 문항은 저장소에 복사하지 않았다.
- AMC 8 2016 비교자료 검색에서 [99CEF 2018 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2018AMC8Report.pdf)의 2016 미국·캐나다 전체 평균 9.36점(n=108,227)과 Taiwan 전체 평균 14.60점(n=7,115)을 재확인했다. 이 보고서는 2016 학년별 평균을 싣지 않는다. 학교·학원 결과는 전국 학년 통계에서 제외하고 기존 모집단 구분을 유지했다.
- [MAA 점수분포 화면](https://maa.edvistas.com/eduview/report.aspx?mode=6&r832=&view=1561)은 전체 응시자 통계이며 이번 조회에서 학년표를 제공하지 않았다. 2016 MAA grade-report 이미지 경로는 서명 만료로 열리지 않았다. 기존 2016 전체 평균 외의 새 Grade 7/학년 점수는 임의 보충하지 않고 미회수 상태로 두었다. 검색 근거는 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 추가했다.
- 대상 파일: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`, 본 인수인계. `git diff --check` 후 로컬 커밋 예정. `raw_youtube.txt`는 미추적 원본으로 제외한다. Push·배포·Drive 동기화 없음.

## 2026-11-04 후속 웹 검색: AMC 8 최근 회차 점수분포

- 2023–2025 AMC 8 학년별 수치를 웹에서 추가 검색했으나, 검색으로 재확인한 MAA 공개 score distribution은 전체 응시자 데이터이고 새로 검수 가능한 학년표는 찾지 못했다. 최근 수상 기준선을 또래 학년 비교로 오인해 표시하지 않는다.
- 2025: 보고서 사본은 Top 1%=23, Top 5%=19, 평균 11.74를 기록한다. 참가자 수는 사본 79,511과 별도 MAA표 재게시 79,524가 13명 차이다. 2024도 컷오프/평균은 같지만 참가자 수가 한 출처는 80,685, 다른 출처는 80,725로 차이 난다. 차이를 해결하지 못해 신규 CSV나 공식 기록에 넣지 않았다.
- 공개 MAA EduView는 전체 cohort 통계만 노출한다. 연도별 학년 benchmark를 보강하려면 과거 회차 보고서 식별자와 정확 학년 원표 회수가 남았다. 상세 검색 기록과 직접 출처는 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 추가했다.
- 이번 작업은 문서만 수정했으며 데이터·앱 로직은 변경하지 않았다. `raw_youtube.txt` untouched; local only; no push, deployment, or Drive sync.

## 2026-11-04 후속 웹 검색: AMC10/12 2017·2019 학년표 원본 경로

- 2017·2019 AMC10A/12A 99CEF 분석 PDF와 2017 GEMT AMC10B/12B 보고서를 연도·파일명·학년 통계 키워드로 검색했으나 원문을 회수하지 못했다. 검색 결과의 2018 PDF 링크를 열자 2016 본문으로 리다이렉트되는 사례도 있어 파일명/snippet만 믿지 않도록 기록했다.
- 2017 MAA General Reports 메뉴 ID 64/65는 보존돼도 ReportViewer 본문은 없다. 2019 AMC10A Grade 7 n=1,982·평균 59.72는 학교 게시 페이지에 인용된 단일 secondary 행이며, 원 MAA 표와 다른 학년 행은 찾지 못했다. 2019 AMC12A/B와 이를 전국 학년 비교표로 확장하지 않았다.
- 상세 출처/검색 결과는 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 남겼다. 다음 단계는 MAA ReportViewer 본문 경로 또는 공식 운영기관 연례 PDF의 원문 회수다. `raw_youtube.txt` unchanged; local only; no push/deploy/Drive sync.

## 2026-11-04 MAA 보존 보고서 본문 재확인

- MAA Wayback `generalreports.aspx`에서 2017 AMC10/12 A·B 메뉴 ID 64/65는 확인되지만 ReportViewer의 저장 HTML은 `ReportAreaContent.None`으로 비어 있다. 구형 MAA 호스트는 HTTP 404/521이라 동적 보고서 선택을 다시 요청할 수 없었다. 이는 보존된 메뉴가 수치 데이터 본문을 보존하지 않았다는 확인이며, 보고서 부재를 뜻하지 않는다.
- 이번 검색에 다시 나온 99CEF 2020 A형 미국·캐나다 학년별 표는 기존 CSV/화면에 이미 수록되어 중복 추가하지 않았다. 전체 cohort 점수분포와 학년 표본은 계속 별도 표시한다.
- 다음 검색은 원문 PDF가 남아 있는 운영기관 연도별 분석 자료 중심으로 이어간다. `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 상세 근거를 추가했다. `git diff --check` 통과; 로컬 문서 수정만, no push/deploy/Drive sync. `raw_youtube.txt` untouched.

### 2026-11-04 · AMC 8 2023–2024 웹 검색 근거 보강

사용자 요청 “웹 검색으로 가져와”에 따라 연도별 AMC 8 점수 자료의 학년 범위를 확인했다. MAA Wisconsin Spring 2023 뉴스레터는 2023 AMC 8 직후 일반 데이터가 당시 아직 공개되지 않았다고 기록한다. Spring 2024도 당시 개인정보 제약과 일반 통계 미공개를 언급하며, Fall 2024는 MAA Historical Statistics에 2023–24 자료가 없었고 AMC 8 참가 약 81,000명이라는 전체 수만 제공한다. 이후 수치 공유는 학생/보호자 동의를 조건으로 한다는 설명도 있다. 이 발행 당시 상태를 현재에도 보고서가 없다는 말로 일반화하지 않는다.

2023 AMC 8 점수 보고서의 재게시 사본은 전체 응시자 분포 요약만 보이고 학년 breakdown이 없다. 이를 학년 평균이나 Grade 7 수준으로 추정하지 않았다. `amc-grade-reference-coverage-by-paper.csv`의 2023·2024 행에는 출처와 시점 한계를 기록하고 상태 `no-grade-table-recovered`를 유지했다. 상세 근거: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`.

검증: coverage CSV를 266개 회차로 파싱했고, 행별 14개 필드·2023/2024 출처 연결을 확인했다. `git diff --check` 통과. 이번 변경은 근거 문서/출처 인벤토리만이며 결과 비교 로직과 원본 시험 콘텐츠는 바꾸지 않았다. `raw_youtube.txt` 보존·제외. 로컬 전용, push·배포·Drive 동기화 없음.

출처: [MAA-WI Spring 2023](https://www.wisconsin.maa.org/s/MAA-WI-Newsletter-2023-01-Spring.pdf), [MAA-WI Spring 2024](https://www.wisconsin.maa.org/s/MAA-WI-Newsletter-2024-01-Spring.pdf), [MAA-WI Fall 2024](https://www.wisconsin.maa.org/s/MAA-WI-Newsletter-2024-02-Fall.pdf), [2023 AMC 8 whole-cohort report repost](https://www.scribd.com/document/853921825/Contest-Score-Report-2023-AMC8).

### 2026-11-04 · AMC 8 2000 MAA 통계 아카이브 경로 확인

AMC 8 2000 통계 공백을 위해 Internet Archive CDX에서 `amc.maa.org/amc8/2000/*`를 조회했고 빈 목록을 받았다. `.../stats/*` 하위 경로는 Archive 서버 503으로 확인할 수 없었다. 이 검색 경로에서 보존 캡처를 못 찾았다는 한계로만 기록하고, 해당 보고서가 없다고 단정하지 않았다. AMC grade coverage CSV에는 검색 범위/결과를 적되 2000은 `no-grade-table-recovered` 상태로 유지한다. 상세: `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`.

검증: coverage CSV 266행·14필드 파싱과 2000 note 필드를 확인했고 `git diff --check` 통과. `raw_youtube.txt` untouched. 로컬 전용; push/deploy/Drive sync 없음.

## 2026-11-04 웹 검색: AMC 8 2006 문항 응답 진단 자료 추가

- 웹에서 MAA authored 2006 report copy를 확인: 147,210 cohort의 item response percentage table 및 2006 AMC 8 grade score means. Grade 5–8 mean/counts 8.21/1,853; 8.51/6,639; 9.82/48,479; 10.75/78,038는 기존 `amc8-grade-means-2001-2009.csv`에 이미 있었다.
- 25-item response table을 `boarding-school-math/competition/historical-amc-grade/amc8-2006-item-response-percent.csv`로 옮기고 AMC 8 response lookup에 2006 데이터를 연결했다. LIVE answer key와 25개 키를 대조했다. Report가 unreadable percentage를 별도 제공하지 않아 CSV는 빈칸으로 둔다. 총 8문항이 응답률 합계 불일치로 런타임에서 숨겨지고, Q18/19도 복수 correct markers가 인쇄돼 있다.
- 갱신 파일: response lookup JS, lookup script cache version, item-response CSV, coverage CSV, historical-data README, evidence doc, this handoff. `raw_youtube.txt` 보존/제외. 검증은 CSV row/value reconciliation, lookup test, `git diff --check` 후 local commit 예정. 원본 AMC 문항·풀이 복사는 없음. No push/deploy/Drive sync.

출처: [2006 response table](https://www.judymlevine.com/uploads/5/4/6/7/5467082/2006_amc_8_ws-25.pdf), [LIVE 2006 answer key and solutions](https://live.poshenloh.com/past-contests/amc8/2006/answers), [MAA 2006 annual report copy](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary).

### 다음 연도 웹 자료 조사 포인터

- 2007·2008 MAA AMC 8 Summary of Results and Awards 재게시본에 전체 cohort `Item Difficulty` 표가 있고, grade mean/count 표도 있다. 보고된 item cohorts: 2007 n=150,618; 2008 n=148,731. 참고: [2007 report copy](https://studylib.net/doc/8198991/2007-amc-8-summary-of-results-and-awards), [2008 report copy](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america).
- 2007은 MAA 연례 보고서 Table 5의 전국 응답률 25문항을 `amc8-2007-item-response-percent.csv`와 lookup에 추가했다. n=150,618. 25개 키는 LIVE와 대조했다. 15, 19–23번은 선택률+무응답 합계가 런타임 0.15%p 허용치와 맞지 않아 결과 비교에서 숨긴다. 학년 평균·표본 수는 기존 2001–2009 MAA 표를 계속 사용한다.
- 2008은 MAA 연례 보고서 Table 5에 전국 응답표가 있다. 재게시본의 D/E 선택지 값 묶음을 분리해 정답 별표와 LIVE 정답 25개에 대조했고, 5개 불일치 합계 문항(18,19,22–24)은 런타임에서 숨겼다. 보고서는 Q12 accepted answers를 C/D/E로 집계하고 LIVE key는 C로 표기하므로 accepted set과 공식 표시 정답을 별도 보존한다. 다음은 2009 MAA 전국 표를 웹에서 찾되 기존 2009 한국 응시단 자료와 구분한다.

### 2026-11-04 웹 검색: 2009 AMC 8 전국표 자료 충돌 메모

- MAA 작성 2009 AMC 8 연례 보고서 사본의 Table 8은 문항 응답 표본을 151,367명으로 적지만, 같은 보고서의 Table 1/score summary는 answer forms received / number of participants를 150,733명으로 적는다. [PDFCoffee 재게시본의 Table 8](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html)과 [MAA 통계 재인용](https://www.scribd.com/doc/58090065/2010-AMC-HS-Summary)을 찾았다.
- 기존 2009 AMC Study 표본은 한국 참가자 741명이며 또 다른 모집단이다. 세 수치/표를 서로 대체하거나 합치지 않는다. 전국 Table 8의 모집단 차이는 원본 보고서 안의 충돌로 유지한다. 재게시 PDF 뷰어 사본은 열리지 않아 표 이미지를 Vision OCR로 교차확인할 수 없었다. 그래서 추출본의 숫자 흐름이 끊기거나 열 수가 맞지 않는 Q3·4·9·12·17은 보류하고, 나머지 20문항만 별도 CSV와 선택 가능한 대체 모집단 조회에 추가했다. 현재 UI 기본값은 한국 741명 자료이며 전국 코호트를 한국값과 섞지 않는다.

### 2026-11-04 웹 검색: AMC 8 2007 전국 문항 응답률 추가

- MAA 작성 2007 AMC 8 Results and Awards Summary의 Table 5에서 전국 응답 분포를 회수했다: 150,618명, 25문항, A–E 선택률과 무응답률. 표는 MAA 원문 보고서의 재게시본에서 읽었다.
- LIVE 2007 정답표와 25개 정답 문자를 대조했다. 선택률+무응답률이 런타임 허용치에 들지 않는 6개 문항(15, 19–23)은 자동으로 결과 비교에서 제외한다. unreadable 열은 보고서가 제공하지 않아 비워 두었다.
- `amc8-item-response-reference.js`와 연도별 CSV에 2007을 연결했고, 문제 복습 화면의 데이터 캐시 버전을 갱신했다. MAA 학년 평균/counts는 별도 출처의 기록 학년 통계로만 유지한다. 2007 응답률은 전국 참가자 전체의 역사적 분포이며 학생 개인의 오개념이나 현재 기준으로 해석하지 않는다.
- 검수: 25문항·25개 정답 대조·응답률 합계 및 대표 문항 오답 선택률 테스트, 기존 item response contract, `git diff --check`. 원문 문제를 복사하지 않는다. `raw_youtube.txt`는 보존/제외. 로컬 변경만, push·배포·Drive sync 없음.

### 2026-11-04 웹 검색: AMC 8 2008 전국 문항 응답률 추가

- MAA 작성 2008 AMC 8 Results and Awards Summary Table 5에서 전국 응답률을 가져왔다: n=148,731. D/E columns are combined by the text extractor; the 25 D values followed by 25 E values were separated and the resulting correct-answer markers were verified against all 25 LIVE keys. The annual report's accepted answers for item 12 are C/D/E; the app keeps that set for historical response shares while LIVE's answer key remains C.
- 25문항을 CSV와 response lookup에 추가했다. 합계가 허용 범위를 벗어난 5개 문항(18, 19, 22–24)은 사용자 비교에서 제외한다. unreadable 비율은 별도 열로 보고되지 않아 빈칸이다. grade means/counts는 이미 확보한 MAA 2008 기록 학년 통계와 별개 자료로 유지한다.
- 검수: 공식 LIVE 정답 25개·Q12 accepted set·대표 응답률·5개 suppression assertions, response contract, CSV row count and reconciliation, `git diff --check`. 원문 시험 문항은 복사하지 않는다. 로컬 변경만; push·배포·Drive sync 없음.

출처: [MAA 2008 연례 보고서 Table 5 재게시본](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america), [LIVE 2008 정답표](https://live.poshenloh.com/past-contests/amc8/2008/answers), [LIVE 2008 시험지·해설](https://live.poshenloh.com/past-contests/amc8/2008).

출처: [MAA 2007 연례 보고서 Table 5 재게시본](https://studylib.net/doc/8198991/2007-amc-8-summary-of-results-and-awards), [LIVE 2007 정답표](https://live.poshenloh.com/past-contests/amc8/2007/answers), [LIVE 2007 시험지·해설](https://live.poshenloh.com/past-contests/amc8/2007).

### 2026-11-04 웹 검색: 2009 AMC 8 MAA 전국 문항 응답률 추가

- [MAA 25th Annual AMC 8 Summary 재게시본](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html)의 검색 색인에 Table 8 전체 항목 응답 텍스트가 잡힌다. Table 8은 151,367명을 적지만, 같은 보고서 Table 1은 answer forms received 150,733명을 적는다. 불일치를 그대로 보존했고 어느 쪽도 임의로 정정하지 않았다.
- 보고서 PDF viewer는 손상/유효하지 않은 PDF 오류로 열리지 않았다. Apple Vision OCR 시각 대조는 진행할 수 없었으므로 추출 셀 배열이 깨진 3, 4, 9, 12, 17번을 제품 조회에서 제외했다. 나머지 20문항을 `amc8-2009-maa-national-item-response-percent.csv`에 기록하고 LIVE 2009 답안표와 대조했다.
- 런타임은 `responseFor(2009, question, answer, grade, "maa-national")`로 이 MAA 전국 코호트를 명시적으로 선택할 수 있다. 기존 2009 기본 조회는 한국 n=741 그대로다. 2009 AMC 8 원본 선택 화면에 한국 741명 / MAA Table 8 모집단 선택을 연결했다. MAA 전국 표본 선택 시 결과 영역에 보고서 내부 숫자 차와 제외 문항 수를 함께 알린다.
- 검수: 20개 CSV 행의 퍼센트 합계(0.15%p 허용), 정답 비율, 연도별 25개 질문 인덱스, 제외 문항 null 응답, 한국 기본값 보존을 확인했다. 기존 전체 CJS 테스트 실행기는 이 쉘에 없어서 전체 contract 파일 실행은 못했고, 핵심 lookup 검증은 node_repl에서 별도로 돌렸다. `git diff --check` 통과.

### 2026-11-04 웹 검색 대조: AMC 8 2011 한국 응답 코호트

- 사용자의 “웹 검색으로 가져와” 요청에 따라 2011 AMC 8 자료를 다시 원출처와 대조했다. AMC Study의 MAA 결과 재게시에는 한국 응시자 899명과 문항 1–25의 선택지별 응답률이 있으며, 25개 정답이 LIVE의 MAA 허가 답안표와 전부 일치한다.
- 해당 25개 행은 이미 `amc8-2010-item-response-percent.csv`와 AMC 8 문항 복습 조회에 반영돼 있었다. 한국 표본으로 정확히 표시되어 있어 중복 행이나 별도 선택지를 추가하지 않았다. MAA Wayback 통계 디렉터리도 확인했으나 회수된 문항 난도 PDF는 California 표본이었고, 이 디렉터리 경로에서는 전체/미국 문항 응답표를 찾지 못했다. 이를 한국 응답률과 합치지 않는다.
- 검색 기록·범위는 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 추가했다. AMC 시험지/답/전문 풀이는 이미 연도별 LIVE 원본 카탈로그에서 인쇄/학습으로 연결되어 있으므로 복사해 저장하지 않는다.
- 검증: `amc8-item-response-reference.test.cjs` 전체 contract를 node_repl에서 실행해 통과. `git diff --check` 확인 후 로컬 문서 변경만 커밋 예정. `raw_youtube.txt` untouched; no push, deployment, or Drive sync.

## 2026-11-04 · AMC 8 과거 학년별 결과 비교표

- 웹 재검색 근거를 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 추가했다: 2009 MAA 보고서 사본, 2019 MAA Overall score report 이미지 재게시, 2022 MAA Overall score-grade report 재게시.
- 구현: `competition/amc8-global-grade-score-reference.js`에 동일 연도별 `comparisonFor` 추가, `competition-paper-review.html/js/css` 결과 영역에 학년 그룹별 점수 이하 비율·표본 수 표 추가. 선택한 학년 행에는 “입력 학년”을 텍스트로 표시한다. 2009의 4–5학년, 2019/2022의 5학년 이하 원자료 그룹은 분리하지 않는다. 학년 미상 행은 비교하지 않는다. 공식 percentile이나 현재 실력 등급으로 표현하지 않는다.
- 검수: node_repl에서 9개 데이터 assertion 통과. 시스템 쉘에 Node가 없어 `node --test`를 실행하지 못했다. CUA 브라우저 탭 접근이 URL 정책에서 차단되어 실제 화면 수동 QA는 보류다. HTML 구조·JS 연결·CSS overflow fallback·캐시 버전·`git diff --check`를 검사한다.
- 현재 작업 브랜치 `codex/boarding-g7-nsa-mac-20261017`, head 당시 `4421e9ab4`. `raw_youtube.txt`는 미추적 사용자 파일로 그대로 두고, 이번 커밋에는 프로젝트 파일만 포함한다. 로컬 수정만; push·배포·Drive 동기화 없음.

## 2026-11-04 · AMC 8/10/12 학년 평균 교차 비교

- 기존에 근거 등록한 학년 평균 데이터 238개 정확 학년 레코드에, 같은 회차의 보고 학년 그룹 평균을 결과표로 연결했다. 새 점수 통계는 추가하지 않았다.
- `amc-historical-grade-reference.js`의 비교 API는 프로그램·연도·시험형·선택 기록의 source URL/status와 모집단 범위를 맞춰 그룹만 반환한다. `<=8`, `4–5` 등의 원자료 그룹을 그대로 표시하고 unknown을 제외한다. 결과 화면은 점수 평균과 표본 수를 비교표에 넣고, 기존 응시 점수 대 해당 학년 평균을 유지한다.
- 확인: Node REPL에서 238개 정확 학년 레코드 provenance/group assertions 통과. 로컬 브라우저에서 2009 AMC 8과 2011 AMC 10A 결과표 행을 실제 렌더링해 확인. `node --test`는 쉘 Node 없음으로 미실행. 브라우저 자동 테스트 사양에 2009 AMC 8·2011 AMC 10A 표를 추가했다.
- 이전 커밋 `46156641b`; 이번 변경은 별도 로컬 커밋 예정. `raw_youtube.txt` untouched. No push/deployment/Drive sync.

## 2026-11-04 · 웹 검색으로 경시 원본 연도와 시험명 정리

- LIVE의 연도별 AMC/AIME 아카이브에 연결된 266개 회차에서 인쇄 시험지, 답안, 풀이 경로가 모두 존재하는지 확인했다. 원문은 저장소로 복사하지 않고 출처 링크와 연도별 메타데이터로 연결한다.
- 검색으로 MAA의 명칭 전환 자료를 확인했다. AMC 8 전신 AJHSME는 1985–1998, AMC 8은 1999부터다. 1985–1998 `amc8` archive titles를 `AJHSME`로 바로잡고, 진단 화면의 해당 연도 표기도 원시험명으로 출력한다. 경로, 연도별 답 입력과 채점은 바꾸지 않았다.
- 지속 문서: `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. 자료 권리는 MAA의 공식 교육 공유 안내와 수익 목적 복제 제한을 함께 기록했다.
- 확인: 266개 행과 필수 링크 4종, 14개 AJHSME 제목, JS syntax 경로와 `git diff --check`. `raw_youtube.txt` 보존·제외. 로컬 변경만; push·배포·Drive 동기화 없음.

출처: [MAA FOCUS 1999 명칭 전환](https://old.maa.org/sites/default/files/pdf/pubs/focus/past_issues/FOCUS_19_6.pdf), [MAA FOCUS 2004 AHSME 개편](https://old.maa.org/sites/default/files/pdf/pubs/mar04.pdf), [LIVE 연도별 공식 허가 아카이브](https://live.poshenloh.com/past-contests), [MAA 2024 AMC 8 풀이 PDF의 이용 안내](https://981338.fs1.hubspotusercontent-na1.net/hubfs/981338/Blogs/AMC%208%20Problems%20and%20Solutions/AMC%208%20Solutions%202024.pdf).

## 2026-11-04 · AMC 8 원본 개념과 지필드 창작 연습 연결 확장

- 웹 검색 결과에서 “2024 AMC Performance Report” PDF를 검토했지만, 본문은 Australian Mathematics Competition 보고서이며 MAA AMC 8 자료가 아니어서 사용하지 않았다.
- LIVE AMC 8 원본 인벤토리 1,025문항의 개념 태그를 지필드의 AMC 8 timed mock 및 창작 연습 은행과 대조했다. 직접 태그가 하나 이상 이어지는 원본 문항은 979/1,025 (95.5%)다. 태그 발생 수 기준 겹침은 1,579/1,921 (82.2%)다. 이는 검색·선별용 편집 crosswalk 범위이며 진단 타당도나 학습 효과를 뜻하지 않는다.
- `amc8-concept-practice-extension.js`에 12개 독립 창작 문항을 추가해 연산 순서, 소수·자릿값, 부피·단위변환, 날짜와 나머지, 새 연산 기호, 여집합 세기, 각도 추론, 극단 원리, 등비수열, 좌표 거리, 닮음비·넓이비, 사다리꼴 넓이를 연결했다. 총 창작 개념 연습은 39문항이다. 기존 원본 문항이나 풀이를 복사하지 않는다.
- 검수: JavaScriptCore로 파일을 실행해 extension 22개 전체를 읽었고, 선택지 배열/정답 인덱스/source tag 검사에서 오류 0개. `git diff --check` 통과. 새 항목의 산술 풀이를 직접 재검산했다. Node 런타임이 이 Mac shell PATH에 없어 자동 테스트는 실행하지 않았다.
- 수정: extension bank, 해당 HTML cache key, README. 로컬만; `raw_youtube.txt` 미수정. push·배포·Drive 동기화 없음.

## 2026-11-04 웹 검색: AMC 8 2007–2008 학년별 점수분포 연결

- 연례 보고서 웹 검색 결과 2007/2008 MAA `Summary of Results and Awards`의 Table 7에는 4–5, 6, 7, 8학년별 점수 0–25의 빈도가 있다. 이를 GFIELD의 과거 AMC 8 학년 비교기에 연결해 2007/2008 점수 입력 시 같은 연도·학년 그룹 비교가 가능하도록 했다. 0점의 attempted/unattempted 구간은 답안 기록 모델상 합산했다.
- 8개 연도/학년그룹 분포 각각의 26개 빈도를 원문 요약 표본 수와 대조했고, 가중평균도 보고된 평균과 소수 둘째 자리까지 일치함을 확인했다. 데이터 파일은 `boarding-school-math/competition/historical-amc-grade/amc8-2007-2008-global-grade-score-counts.csv`; 런타임 lookup은 `boarding-school-math/competition/amc8-global-grade-score-reference.js`.
- 이 자료는 당시 MAA 보고서에 기록된 학년 코호트로, 현재 기준·공식 개인 percentile·능력 등급이 아니다. 4–5학년은 원자료 묶음 유지. 보고서 사본은 제3자 호스팅이라 그 제한을 근거 문서에 남겼다. 출처: [2007 report](https://studylib.net/doc/8198991/2007-amc-8-summary-of-results-and-awards), [2008 report](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america).
- 다음: 문제 풀이 경로에서 새 연도를 실제 선택해 결과 UI의 범위 문구와 cross-grade 표를 브라우저로 확인하고, AMC 8 연도별 grade evidence를 계속 확장한다. `raw_youtube.txt` unchanged; no push/deployment/Drive sync.

## 2026-11-04 웹 검색: 2006 AMC 8 학년별 분포 연결

- MAA 작성 2006 AMC 8 연례 보고서 Table 5에서 4–5, 6, 7, 8학년 점수 0–25 빈도를 추가했다. 표본 수 및 평균이 보고서의 기록 학년 요약과 일치한다. 0점 attempted/unattempted는 입력 점수와 맞추기 위해 합쳤고, 4–5학년과 모집단 범위는 보고서 원형대로 설명한다.
- 데이터: `boarding-school-math/competition/historical-amc-grade/amc8-2006-global-grade-score-counts.csv`; 조회 모듈: `boarding-school-math/competition/amc8-global-grade-score-reference.js`; UI note/cache/test도 연결했다.
- 출처: [2006 MAA 보고서 사본, Table 5](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary). 제3자 보관 사본이며 현재 규준/공식 percentile/능력 등급이 아니다.
- 검수: CSV 104개 행, 네 그룹 모두 표본 합계와 가중 평균 일치, 비교 함수의 2006년 교차 그룹 결과를 node_repl contract assertion으로 확인했고 `git diff --check` 통과. CUA는 `file:` URL 정책으로 막혀 브라우저 화면 검수는 하지 않았다(정책상 우회 금지). `raw_youtube.txt` untouched; no push/deployment/Drive sync.

### 2026-11-04 웹 검색: 2005 AMC 8 원본·학년 통계 범위 확인

- LIVE의 MAA 허가 페이지에서 2005 실제 시험 25문항, 인쇄 PDF, 답안, 전문 풀이를 확인했다. 연도별 원본 카탈로그에 이미 등록된 자료와 일치한다.
- MAA 2007 요약 보고서 Table 1–2는 2005년 전체 평균과 4–5, 6, 7, 8학년별 참가자 수/평균을 제공하지만, 해당 보고서에서 0–25 학년별 점수 빈도는 확인되지 않았다. 평균을 점수 분포나 percentile로 만들어내지 않고 기존 평균 비교 레이어에만 둔다.
- 출처: [LIVE 2005 AMC 8 시험·출력·정답·전문 풀이](https://live.poshenloh.com/past-contests/amc8/2005), [MAA 2007 보고서의 2005 요약표](https://www.scribd.com/document/618492777/2007-AMC-8-Summary-of-Results-and-Awards-PDFDrive). 상세 검색 결론은 `boarding-school-math/docs/AMC_GRADE_COMPARISON_EVIDENCE_2026-10-30.md`에 기록했다. `raw_youtube.txt` 보존; push·배포·Drive 동기화 없음.

## 2026-11-04 웹 검색: 최근 AMC 8 비교자료 공개 범위와 결과 안내

- 재검색 출처: [MAA AMC 학생 포털 가이드](https://maa.org/wp-content/uploads/2025/06/Guide-to-the-AMC-Student-Portal.pdf), [MAA 2024–25 AMC 8 교사용 매뉴얼](https://maa.org/wp-content/uploads/2024/09/2024-25-AMC-8-Teachers-Manual-FINAL.pdf), [2025 AMC 8 전체 점수 요약 재게시본](https://www.scribd.com/document/853921775/Contest-Score-Report-2025-AMC8), [2022–2026 연도별 요약](https://beyondgradestem.com/competitions/amc-8/scores/). MAA 포털은 학생 본인의 2022–23 이후 과거 성적을 제공하며, 교사용 매뉴얼은 호스트의 학생 점수 보고 흐름을 설명한다. 웹에서 회수한 이 자료들은 공개 전국 학년×점수 표와 다르다.
- 2025 제3자 점수 요약은 평균 11.74, 다른 제3자 요약은 11.75를 기재한다. 차이를 조정해 단일값으로 만들지 않고, 학년 분포나 백분위도 추론하지 않는다. `amc-grade-reference-coverage-by-paper.csv`의 2025·2026 출처/coverage note를 갱신했고, 두 연도는 계속 `no-grade-table-recovered`로 관리한다. 이는 현재 검색에서 표를 회수하지 못했다는 상태지, 다른 곳에도 없다는 단정이 아니다.
- 완료된 AMC 결과에서 정확히 같은 연도·시험형·학년의 비교 데이터가 연결되지 않으면 설명 문구를 결과 패널에 표시한다. 브라우저에서 2026 AMC 8 Grade 7에 25/25 입력 후 문구 표시를 확인했고, 2022 AMC 8의 기존 Grade 7 평균 비교가 나타날 때는 문구가 숨겨지는 것을 확인했다. 레이아웃은 1280px 폭에서 가로 넘침 없이 표시됐다.
- `git diff --check` 통과. 자동 Playwright 테스트는 Node CLI 부재로 돌리지 않았다. CUA 브라우저 검수로 두 데이터 경로를 수동 확인했다. 기존 untracked `raw_youtube.txt`는 그대로 두며 stage하지 않는다.

## 2026-11-04 웹 검색: 2011 AMC 8 세계 학년 평균 추가

- 99CEF의 [2011 AMC 8 Summary PDF](https://www.99cef.org.tw/userfiles/2011AMC8Summary.pdf)에서 `27th AMC8 2011` 세계 표를 회수했다: <=4 n=938 / 8.31, Grade 5 n=3,456 / 9.30, Grade 6 n=22,879 / 9.33, Grade 7 n=50,176 / 10.66, Grade 8 n=72,230 / 11.45. 이는 MAA 호스팅 원본이 아닌 국제 주관자 보고서로, 현재는 웹 색인의 PDF 표 텍스트에서 전사했다.
- 등재 학년 표본은 149,679명, 전체 152,745명보다 3,066명 적다. 누락 학년을 보정하지 않았다. 전체 cohort 평균 10.76과 비교 가능한 과거 Grade 7 평균은 표시하되, 이를 학년별 점수 분포·백분위라고 부르지 않는다. 한국 AMC Study n=899 자료는 별도 모집단이다.
- `amc8-grade-means-2011-99cef.csv`, `amc-historical-grade-reference.js`, 연도별 coverage CSV, README와 근거 문서를 갱신했다. Grade 4 이하 그룹은 그룹 그대로 두고 개별 학년 조회에 쓰지 않는다. 다음은 2012 이후의 빠진 공개 학년표 추적이다.

## 2026-11-04 웹 검색: AMC 원본과 학년 규준 분리

- MAA의 [2023 AMC 8 공식 공개 페이지](https://maa.org/resource/sample-competition-2023-amc-8/)에서 [문제 PDF](https://maa.org/wp-content/uploads/2024/08/2023-Problems-AMC8-PDF.pdf)와 [풀이 PDF](https://maa.org/wp-content/uploads/2024/08/2023_AMC8_Solutions_.pdf)를 직접 열어 시험 연도, 25문항·40분, 저작권/보안 안내를 확인했다. 연도별 출처 카탈로그의 2023 AMC 8 행을 이 공식 MAA 링크로 보강했고, 답안표는 기존 LIVE 링크를 유지했다. 원문은 복사하지 않았다.
- 2023 AMC 8 전체 점수 요약은 제3자 재게시본에서 평균 10.26, n=74,380으로 검색되지만 다른 공개 요약값과 차이가 해소되지 않아 런타임 자료로 넣지 않았다. 공식 문제·풀이 페이지에는 학년별 점수표가 없다.
- 2012 AMC 10/12 학년 평균 검색은 등록/교사용 매뉴얼과 시험 자료만 회수했고, 국가 단위 학년별 성적 표는 회수하지 못했다. 2016 AMC 8 Bard 결과는 지역 학원 35명 표본이며 학년별 n도 없어 전국 비교에서 제외했다.
- 확인: 연도별 출처 카탈로그 266행 유지, 2023 AMC 8 다섯 링크 HTTPS 확인, CSV 파싱, diff whitespace 검사(카탈로그는 저장소의 CRLF 형식 예외 확인). raw_youtube.txt 그대로 미추적 보존; push·배포·Drive 동기화 없음.
- 다음: 아직 미회수인 2012 이후 AMC 8 학년표와 AMC 10/12 연도별 통계를 출처별로 계속 검색한다. 평균만 발견되면 평균 지표에만, 학년 그룹의 표본과 모집단이 명시된 경우에만 학년 비교에 연결한다.

## 2026-11-04 웹 검색: 2016 AMC 8 및 지역 성적표 통계

- 2016 AMC 8 검색에서 99CEF의 연례 회고 표에 기반한 US/Canada 평균 9.36 (n=108,227)과 Michigan Section–MAA 뉴스레터 수치 9.36 (n=108,295)를 재확인했다. 두 참여자 수는 서로 다르므로 별개의 출처 기록으로 유지한다.
- [Bard Math Circle 2016 결과](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in)는 전체 현장 응시자 35명의 Grade 4–8 평균만 제공한다. 지역 현장 표본이고 학년별 표본 수를 명시하지 않아 전국 학년 비교 데이터로 쓰지 않는다.
- [99CEF AMC 공식 안내/FAQ](https://www.99cef.org.tw/maa-amc/)는 참가자 개인 성적표에 Taiwan 응시자 기준 평균 및 점수 구간이 있다고 안내한다. 이는 대만 지역 코호트의 참고치이며 전체 참가자 또는 미국·캐나다 학년 규준과 분리해야 한다. GFIELD에는 실제 연도별 성적표 값이 확보될 때 별도 지역 출처로 다룬다.
- MAA 보고서와 99CEF 2023/2024 자료 검색에서 공개 전국 Grade 7 분포/평균을 추가 회수하지 못했다. no-grade-table-recovered는 이번 검색의 회수 상태다. 출처에 자료가 존재하지 않는다는 뜻은 아니다.
- 근거는 boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md에도 기록했다. 다음은 공개 MAA historical reports/AMC 10·12 결과 통계를 연도·폼 단위로 계속 검색한다.

## 2026-11-04 · 2012 AMC 8 전체 코호트 점수 분포 연결

- 99CEF의 2012 AMC 8 상세 보고서에서 Global·Taiwan 각 점수(0–25) 빈도를 웹 검색 결과의 표 전사로 확보해 `amc8-2012-global-taiwan-score-counts.csv`에 기록했다. Global n=151,117, 평균 10.64; Taiwan n=12,550, 빈도 가중 평균 15.4662(보고서 반올림 15.5). 26개 빈도 합과 가중평균이 보고서와 일치한다.
- 결과 화면의 2012 전체 코호트 참고에 Global 점수보다 낮은 응시자 비율을 연결했다. 동점 제외 빈도 계산이며, 공식 percentile이나 Grade 7 등급은 아니다. 2012 당해 보고서와 99CEF 2019 회고표의 Global n/mean 차이(151,117/10.64 대 150,360/10.66)를 보존하고 화면에서 고지한다.
- `competition-paper-review.html/js`, `competition/amc8-overall-cohort-reference.js`, 데이터 CSV, README 및 근거 문서를 수정했다. `raw_youtube.txt`는 미추적 원본 상태로 보존. no push/deploy/Drive sync. 다음: 원문 표 이미지 확인 가능 여부 조사 후 출처 상태를 보강하고, AMC 연도·폼별 점수/학년 통계 원자료를 계속 검색한다.

### 2026-11-04 · MAA 웹 원문 재확인: 2020 및 2023–2026 AMC 8 통계

- MAA Wisconsin Section 2021 가을 보고서에서 2020 AMC 8 미국 평균 10.01을 재확인했다. 전국 인원과 점수별 정확한 인원표는 없다. 제3자 페이지의 2020 참가자 합계는 MAA 원문과 대조되지 않아 런타임에 추가하지 않았다.
- MAA K-12 EduView의 2023–2026 연도별 Score Distribution을 열어 기존 요약값(참가자 수, 평균, 학교 수, 백분위 컷)을 확인했다. 페이지의 0–25 그래프는 막대 높이만 공개하고 정확한 점수별 인원표는 제공하지 않아, 해당 연도는 전체 요약까지만 비교한다.
- 2022 보고서 n=71,143과 학년 그룹 빈도 합 n=71,017의 차이는 해소되지 않았다. 두 출처를 분리해 유지한다.
- 원문 링크와 회수 범위는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`의 “2020 and recent MAA AMC 8 score statistics checked from the web”에 추가했다. `raw_youtube.txt`는 보존, push·배포·Drive 동기화 없음.

### 2026-11-04 · 2016 AMC 8 공개 요약 추가 대조

- 웹에서 MAA Michigan Section 2017 뉴스레터(108,295명, 평균 9.36, 학교 1,875, 상위 1% 경계 22), 99CEF 회고 수치(미국·캐나다 108,227명, 평균 9.36), BEAM의 당시 게시물(전국 149,277명, 중앙값 8, 상위 25% 경계 11, 만점 90)을 추가 확인했다. 지역·모집단 정의가 일치하지 않아 합치지 않았다.
- 0–25점 정확한 빈도표는 이번에도 찾지 못했다. 2016년은 요약 통계만 표시하고 점수별 위치는 미연결로 유지한다. 근거 링크와 출처 구분은 조사 기록에 추가했다.

### 2026-11-04 · Internet Archive에서 MAA 과거 통계 포털 인덱스 회수

- 2021-02-04 저장된 [MAA AMC Historical Statistics 포털](https://web.archive.org/web/20210204011131/http://amc-reg.maa.org/reports/GeneralReports.aspx)을 확인했다. 선택 목록에 2020 AMC 8(ID 87), 2016 AMC 8(ID 63)이 있고, 페이지 설명은 score-distribution, 학년·성별 평균, 문항 난도 보고서 종류를 안내한다. 시스템 이전 중 최신 연도만 공개한다고도 적혀 있다.
- 보존된 화면은 시험 선택 전이라 해당 표의 데이터는 포함하지 않는다. 구 포털 현재 주소는 404이며, 보존 폼 제출은 Internet Archive HTTP 429로 결과표를 받지 못했다. 이 인덱스를 통계값 증거로 사용하지 않고, 후속 검색은 보존된 ReportViewer 응답/PDF 또는 재게시된 MAA 표를 대상으로 한다.

## 2026-11-05 · AMC 2025 공식 컷의 별도 기관 교차 확인

- 99CEF의 2025 AMC10/12 award notice에서 AMC 10A의 DHR 136.5, Top 5% 112.5, Top 10% 94.5, Top 25% 69, AIME 105를 확인했다. 나머지 10B/12A/12B 컷도 MAA K–12 EduView에 표시된 분포 컷 또는 별도 AIME threshold와 대조했다. 이는 2025 시험 전체의 수상·분포 확인이며 학년별 norm은 아니다.
- 99CEF 안내는 해당 기관이 발급하는 중국어 성적표에 Taiwan 지역 평균·점수 구간이 포함된다고 설명한다. 지역 모집단 자료는 전체/global 및 미국·캐나다 표와 구분해야 한다. 새 웹 검색에서도 2021–2025 AMC10/12 공개 학년별 global 표는 회수하지 못해 coverage CSV의 `no-grade-table-recovered` 상태를 유지했다.
- 근거: [99CEF 2025 award notice](https://www.99cef.org.tw/12784/), [99CEF score report scope FAQ](https://www.99cef.org.tw/maa-amc/). 기존 런타임 점수값 변경은 없으며, 최신 AMC 10A 컷은 앞선 커밋 `469bdc709`에서 MAA 원문과 일치하도록 수정됐다.

## 2026-11-05 웹 검색: 2005 AMC 8 점수 빈도 연결

- MAA 작성 2006 AMC 8 Summary의 Table 6(인쇄 p.160)을 searchable report text에서 회수했다. 2005년 0–25점 26개 빈도를 새 `boarding-school-math/competition/historical-amc-grade/amc8-2005-overall-score-counts.csv`에 기록했다. 합계 143,428명, 점수 20+ 2,548명, 만점 77명으로 Table 1과 일치한다. 빈도 가중평균 9.8451은 Table 1의 9.835와 0.0101점 다르므로 숫자를 수정하지 않고 화면에 분리 고지한다. 점수 위치는 빈도표로, 평균은 보고서 요약으로 표시한다.
- `amc8-overall-cohort-reference.js`, paper review 결과 문구, 전체 코호트 README와 조사 노트를 갱신했다. source status는 MAA 원보고서의 제3자 rehost에서 온 web-indexed transcription이며 인쇄 이미지 Apple Vision 대조는 아직 안 됐다. 2005 학년별 점수분포는 복구된 것이 아니며 기존 grade mean과 별개다.
- 검색 출처: [Scribd의 MAA 2006 보고서 본문](https://www.scribd.com/document/618492772/2006-Amc-8-Summary), [StudyLib 대체 본문](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary). 수동 합계·가중평균 계산과 브라우저 로직의 샘플 조회를 확인하고 `git diff --check`를 실행한다. `raw_youtube.txt`는 보존. Push·배포·Drive 동기화 없음.

### 이어서 검색: 2007–2008 AMC 8 분포

- MAA 2008 AMC 8 연례 보고서 Table 8(인쇄 p.226)에서 2007·2008 점수 0–25 빈도를 확인했다. 2007은 n=150,618, 평균 9.8736→9.87, 20+ 3,593, 만점 129로 요약과 맞는다.
- 2008 Table 8 빈도 합은 148,478이고, 보고서는 문제를 하나도 풀지 않은 253명을 별도 기재한다. 이 253명을 0점에 포함하면 n=148,731, 평균 11.4480→11.45, 20+ 8,575, 만점 334로 Table 1과 맞아 이 계산 근거를 UI에 밝혔다.
- `amc8-2007/2008-overall-score-counts.csv`, 전체코호트 조회, paper review 결과 안내, 통계 README와 조사 기록을 갱신했다. 출처는 MAA 작성 보고서의 third-party rehost이며 인쇄 이미지 OCR은 하지 않았다. 웹 검색 원문: [2008 AMC 8 report](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america). 이 변경도 diff 검수 후 별도 커밋한다.


## 2026-11-05 웹 검색: 2009 AMC 8 전체 점수 빈도표 연결

- MAA 작성 2009 AMC 8 연례 요약의 Table 5(인쇄 p.155)에서 0–25점 빈도표를 회수했다. 원표의 0점은 `0^` 일부 문항을 푼 학생 27명과 `0$` 한 문제도 시도하지 않은 212명으로 나뉘어 있어 CSV에는 별도 행으로 보존하고, 점수 비교 lookup에서만 0점으로 합산했다. 빈도는 n=151,367, 가중평균 10.2769(10.28로 반올림), 20점 이상 3,452, 만점 163이다.
- 같은 MAA 보고서 Table 1은 답안지 150,733장·평균 10.28을 적지만 Table 5와 문항 응답 Table 8은 151,367명을 적는다. p.155 요약 블록은 다시 150,733명·평균 10.25라고 표기하고, 99CEF 요약의 20점 이상 수는 MAA 빈도 합보다 2명 적다. 결과 화면에서는 점수 위치를 빈도표 분모로, 평균을 Table 1 값으로 분리해 설명한다. 수치를 조정해 일치시키지 않는다.
- `amc8-2009-overall-score-counts.csv`와 `amc8-overall-cohort-reference.js`에 원표 빈도를 연결했고, 결과 주석·README·캐시 버전을 갱신했다. MAA report copy는 웹 색인 텍스트로 확인했으며 PDF 페이지 이미지/Apple Vision 확인은 아직 하지 않았다. 점수 위치는 공식 percentile·학년 규준·능력 등급이 아니다.
- 출처: [MAA 2009 AMC 8 Annual Summary copy, Table 1, Table 5, Table 8](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html), [MAA-authored 2009 exam PDF copy](https://www.stemivy.com/2009%20AMC8.pdf). Table 2의 MAA 4–5, 6, 7, 8학년별 표본/평균과 기존 학년별 빈도 파일도 확인했으며, 해당 비교는 이미 화면에 연결되어 있다.


## 2026-11-05 웹 검색: 2010 AMC 8 세계 점수 분포 연결

- 99CEF의 [2010 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2010_AMC8_Report.pdf)에서 세계·대만 점수별 빈도표(pp.6)를 찾았다. direct PDF 다운로드는 웹 접근 차단 페이지로 응답해 Internet Archive 보존본을 회수했다. 인쇄 p.6을 렌더링해 Apple Vision OCR과 이미지 육안 대조로 점수 및 빈도를 확인했다. 대만 코호트는 별도 열로 보존하고 앱의 세계 비교와 합치지 않았다.
- 세계 0–25점 빈도 26개 합은 153,211명이며 가중평균 9.9827→9.98, 만점 499명으로 요약표와 맞는다. 다만 20–25 각 점수 빈도를 합한 5,840명은 같은 보고서 누적표 및 연도 요약의 5,849명보다 9명 적다. 점수별 인쇄 행은 수정하지 않고, UI에서 분포 계산과 요약값의 차이를 표시한다.
- `amc8-2010-overall-score-counts.csv`와 조회 모듈에 연결하고, 2010 결과 문구 및 연구 문서를 갱신했다. score-location은 해당 연도 Global 분포에서 동점 제외 낮은 점수 비율이며 공식 percentile·학년 순위·현재 규준·실력 등급이 아니다.


## 2026-11-05 웹 검색: 2011 AMC 8 세계 점수 분포 연결

- 99CEF의 [2011 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2011AMC8Summary.pdf)에서 27회 대회의 세계·대만 점수 분포표를 찾았다. Internet Archive 보존 PDF의 인쇄 p.6을 렌더링해 Apple Vision OCR과 육안으로 숫자를 대조했다.
- 세계 점수별 26개 빈도 합은 152,745명, 가중평균 10.7565→10.76, 20점 이상 6,709명, 만점 284명으로 보고서 요약과 모두 맞는다. 대만 빈도는 별도 모집단으로 두고 GFIELD 세계 응시자 비교에는 연결하지 않았다.
- `amc8-2011-overall-score-counts.csv`와 전체코호트 lookup/결과 안내를 갱신했다. 결과의 점수 위치는 점수보다 낮은 세계 응시자의 과거 비율이며 공식 percentile·학년 순위·현재 규준·능력 등급이 아니다.

## 2026-11-05 웹 검색: 2003–2004 AMC 8 만점자 수 정정

- MAA 작성 2006 AMC 8 연례 보고서의 Table 1에서 연도별 perfect papers 값 `293 79 50 192 126`이 인접 연도 열과 웹 텍스트에서 합쳐져 `50192126`으로 추출됐다. 이전에는 이를 잘못 2004=501, 2003=92로 입력했다. 표의 열 순서(2006→2002)를 따라 2004=50, 2003=192, 2002=126으로 바로잡았다.
- 2004=50은 MAA 작성 2005 연례 보고서의 `Table III: 2004 AMC 8 National Statistics`에서 154,590개 답안지·평균 9.94와 함께 직접 교차 확인한다. 2002–2004 전체 점수 빈도는 이번 검색에서도 회수되지 않아 점수 백분위/분포 진단은 만들지 않는다.
- 수정 파일: `boarding-school-math/competition/historical-amc-grade/amc8-overall-cohort-summary-2002-2020.csv`, `boarding-school-math/competition/amc8-overall-cohort-reference.js`, `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. 출처: [MAA 2006 AMC 8 report, Table 1](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary), [MAA 2005 annual report, 2004 AMC 8 Table III](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions).
- 검수: Python으로 CSV와 런타임의 2002–2004 perfect-paper 값 일치(126/192/50)를 확인했고 `git diff --check` 통과. `raw_youtube.txt` untouched; no push/deployment/Drive sync. 다음: AMC 8 2002–04의 전체 점수 빈도와 미회수 연도 통계를 계속 검색하고, 공개 자료로 확인되지 않은 값은 제품에 추정 입력하지 않는다.

## 2026-11-05 웹 검색: 2013–2015 AMC 8 세계·대만 점수표 회수

- 99CEF 원보고서에서 2013 Table III(p.7), 2014 Table III(p.8), 2015 Table III(p.9)의 점수 0–25 빈도를 회수했다. 이 연도는 기존 런타임에 배열만 있었으므로 `amc8-2013-2015-global-taiwan-score-counts.csv`에 Global과 Taiwan 행을 모두 분리해 원자료화했다. score lookup은 Global 배열만 사용한다.
- 2013 Global n=149,709, 가중평균 10.69755, 20+=6,531, 만점 369. 본문 narrative는 만점 364라고도 적지만 detailed score table 및 후향 연도표는 369여서 score table 수치를 유지했다. 2015 Global n=149,844, 가중평균 8.55448; Taiwan n=9,017, 가중평균 11.42376.
- 2014 Global 빈도 합은 144,177로 요약 전체 n=144,737보다 560 적고, 빈도가중평균은 11.46204인데 보고서 평균은 11.44다. 원자료는 수정하지 않고 유지했으며 결과 안내에 분모와 평균 차이를 추가했다. 대만 점수표 합은 보고된 대만 n=9,199와 일치한다.
- 수정: `amc8-overall-cohort-reference.js` 주석, `competition-paper-review.js`의 2014 결과 고지, 전체코호트 README, 조사 기록, CSV. 출처: [2013 보고서](https://www.99cef.org.tw/userfiles/2013AMC8Report.pdf), [2014 보고서](https://www.99cef.org.tw/userfiles/2014AMC8Summary.pdf), [2015 보고서](https://www.99cef.org.tw/userfiles/2015AMC8Report.pdf).
- 검수 완료: 3개 연도 × 2개 모집단 score 0–25 행 완비, 각 모집단별 합계·가중평균·20+·만점 재계산, Global 2013–2015 배열과 CSV 완전 일치, 2014 결과 고지 수치 확인, `git diff --check` 통과. 연도별 원본 시험지 카탈로그도 LIVE 공개 색인과 대조해 266 회차 및 각 회차의 온라인 문제·인쇄 PDF·정답표·풀이 링크를 확인했다. MAA 공개 안내에 따라 수익 목적 원문 재배포에는 별도 서면 허가가 필요하다고 조사 문서에 기록했다. AMC 8 점수 빈도 미회수 연도는 2016, 2020, 2023–2026으로 좁혔다. `raw_youtube.txt`는 계속 보호한다.

### 추가 검색 · 2016 AMC 8 점수 분포 자료 범위

- 99CEF 2017 분석 보고서의 연도별 표는 2016 AMC 8에 대해 North America/US-Canada 모집단 n=108,227, 평균 9.36, 만점 268, 20점 이상 3,104만 제공합니다. 0–25점별 인원표는 검색 가능한 해당 표와 MAA Michigan Section 2017 뉴스레터에서 찾지 못했다. 따라서 summary 값만 유지하고 점수별 누적비율이나 학생의 위치는 계산하지 않는다. 출처: [99CEF 2017 report](https://www.99cef.org.tw/userfiles/2017AMC8Report.pdf), [MAA Michigan 2017 newsletter](https://sections.maa.org/michigan/newsletters/Vol43no2_Spring_2017.pdf).
- 2020의 전체점수 빈도도 아직 회수되지 않았다. 기존 기록에 있는 2020 MAA-labelled item response와 별도 score/grade report는 서로 다른 분모로 보존한다. 다음 조사는 2020 exact score frequency와 2023–2026 공개 분포 원표에 한정하며, award cutoffs는 점수 구간 빈도로 재구성하지 않는다.

### 2026-11-05 웹 검색 후속 · 2016 AMC 8 연도 혼동 제거

- 검색 결과에 나온 BEAM의 2016-01-29 “AMC 8 Results” 게시물은 본문상 11월에 치른 시험 결과만 말하며 2016 대회를 특정하지 않는다. MAA 과거 보고서 선택 목록은 2016 AMC 8을 2016-11-15로 표기하고, 2015 Teacher Manual은 직전 대회일을 2015-11-17로 확인한다. BEAM의 149,277명/중앙값 8/상위 25% 경계 11/만점 90은 2016 대회 기준으로 사용하지 않고, 일치하는 원자료를 확인하기 전까지 2015에도 옮겨 넣지 않는다. 이 때문에 조사 문서의 종전 2016 통계 단락을 바로잡았다.
- LIVE의 [2016 AMC 8 원본 페이지](https://live.poshenloh.com/past-contests/amc8/2016)를 열어 25문항·40분, 인쇄 PDF·정답표·전문 풀이, 문항별 개념·힌트·풀이, MAA 허가 고지를 확인했다. 이는 연도별 학습 자료 출처이며 학년 규준 자료는 아니다.
- 2016 결과를 다룬 Ivy League Education Center 글은 2016-11-15 대회를 명시하지만 208,137 worldwide / 196,019 USA, 평균 9.35를 보고해 99CEF 108,227 및 MAA Michigan 108,295와 크게 다르다. 표본 범위를 설명할 원본 MAA 표를 회수하지 못해 이 secondary claim은 충돌 메모에만 남기고 런타임 비교 수치로 쓰지 않았다.
- 검색 확인 범위와 정정은 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 기록했다. 정확한 2016 점수 빈도와 전국 Grade 7 norm은 아직 미회수이며, 출처 충돌이 해소될 때까지 기존 2016 전체 요약도 소스별로 구분한다. `raw_youtube.txt`는 보호하고, 변경은 로컬 전용이다.
- 2016 결과 화면에는 99CEF·MAA Michigan·Ivy의 참가자/평균 수치를 하나의 norm처럼 합치지 않는 출처 충돌 주석을 추가했다. 결과 렌더링 중 주석의 `textContent`가 내부 출처 링크를 제거하던 DOM 구조도 바로잡았다. 로컬 화면에서 25개 답 대조 후 25/25 결과, Grade 7 전국 기준 미확인 문구, 해당 연도 통계 원문 링크가 함께 보이는 것을 확인했다. `git diff --check` 통과; 테스트 실행·push·배포·Drive 동기화 없음.

## 2026-11-05 후속 검색 · AMC 10/12B Grade 7 비교자료 범위

- 2017 AMC 10/12B 검색에서 Bard Math Circle의 지역 결과만 찾았다: Grade 7 n=3 평균 64.5, Grade 8 n=5 평균 82.2. 표본이 작고 단일 지역 행사이므로 전국 Grade 7 규준·등급 비교에 쓰지 않는다.
- MAA Wisconsin Section의 2021 가을 뉴스레터는 2017년 Wisconsin 전체 응시자 수(AMC 10 n=540, AMC 12 n=690)와 별도 주 전체 평균(10B 55.32, 12B 61.59)을 제공하지만 학년별 값은 없다. 지역 전체 평균으로만 구분한다.
- 조사 근거를 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 추가했다. 2017 B형 전국 학년 표는 여전히 미회수이며, 런타임에는 소표본 지역값을 넣지 않았다. 다음: 공개 MAA/지역별 원자료를 연도·폼·모집단 기준으로 계속 조사하고 확인된 범위만 기능에 연결한다. `raw_youtube.txt` 보호; push·배포·Drive 동기화 없음.

### 2026-11-05 웹 검색 · 2017 AMC 10/12 연도별 전체 코호트

- 2017 A/B의 전체 참가자 수와 평균은 Think Matrix 역사표에서 확인했다: AMC 10A/B n=53,169/25,919, 평균 59.33/66.56; AMC 12A/B n=44,915/23,439, 평균 56.99/58.35. 이는 학년별 평균이 아니다.
- AIME 초청 경계는 10A/B 112.5/120, 12A/B 96/100.5. 전 연도 경계표와 A형 당해 공지를 대조했다. 개인의 학년 등급이나 국가 내 학년 percentile로 해석하지 않는다.
- MAA report 메뉴 캡처에는 2017 A/B 보고서 항목이 있지만 생성 보고서 본문은 보존되지 않았다. 2017 B형에서 검색된 Bard의 Grade 7 n=3, Grade 8 n=5 수치는 지역 표본이므로 국가 학년 비교에 제외했다. MIT 연구의 1999–2007 9개년 학년별 평균 역시 2017 연도/폼 값을 복원하지 못하므로 연도별 기준으로 쓰지 않는다.
- 조사 상세를 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 기록했다. 런타임 학년 진단 자료는 추가하지 않았고, 미회수 표를 계속 웹 검색한다. 출처: [Think Matrix](https://www.think-matrix.com/math_planet/awards_setting_and_historical_result/), [AIME 경계표](https://ivyleaguecenter.org/2016/01/23/1487/), [MIT-hosted study](https://economics.mit.edu/sites/default/files/publications/08.2018_dynamics_of_the_gender_gap_in_high_math_ac.pdf).

### 2026-11-05 · AMC 원본 통계 결과집 아카이브 경로 및 2001–2007 대조

- 웹에서 [Ian Calaway AMC Archive](https://sites.google.com/view/ian-calaway/amc-archive)를 확인했다. 설명상 중등 결과집 디지털 아카이브는 1985–2022, 고등 결과집은 1980–2010 전체와 2011–2022 디지털 결과다. 이는 결과집 회수 경로이지 모든 해의 점수 분포표가 확보됐다는 뜻은 아니다.
- [MAA 작성 2007 AMC 8 결과집 사본](https://www.scribd.com/document/618492777/2007-AMC-8-Summary-of-Results-and-Awards-PDFDrive)의 기록 학년별 인원·평균(2001–2007)과 2007 학년별 점수 빈도, 2005–2007 전체 점수 비교를 기존 데이터와 대조해 일치함을 확인했다. 중복 행은 추가하지 않았다.
- 이 보고서는 당시 AMC 8 성적에 확립된 norm이 없으며 수업·배치고사와 비교할 수 없다고 밝힌다. 진단 화면은 같은 해의 대회 참가 코호트 참고로 제한한다.
- 2002–2004 점수별 빈도표는 이번 검색에서도 새로 확인되지 않았다. 상세 근거와 다음 검색 범위는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`의 “연도별 MAA 결과집 아카이브 경로 확인”에 남겼다.

### 2026-11-05 · 2016 AMC 8 MAA 점수 보고서 이미지 회수

- Rootmaths 기사에 포함된 “Contest Score Report - AMC 8 2016” 이미지를 찾아 Apple Vision OCR과 시각 대조를 마쳤다. Top 1/5/25/50/75% 경계 22/18/12/9/6, 최고점 25, 만점자 268명, 평균 9.36을 확인해 점수 요약 조회에 연결했다. MAA Michigan 뉴스레터의 참가자·학교 수와 BEAM의 중앙값도 별도 출처로 대조했다.
- 이미지의 점수별 그래프는 막대만 표시해 정확한 0–25 빈도는 복원할 수 없다. 워터마크로 가려진 표준편차·전체 인원·학교 수는 미기록이다. 전국 Grade 7 norm도 미확인으로 유지한다. 결과 화면에서 기사, MAA 교차 확인 자료, 점수 보고서 이미지를 각각 열 수 있다. 조사 기록: `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`의 “2016 AMC 8 MAA score-report image recovered”.
- 다음은 2020 AMC 8의 MAA 점수 보고서와 2016 이미지처럼 막대만 있는 통계자료를 대상으로 정확한 점수 도수표 또는 학년별 표가 별도로 있는지 계속 검색한다. 보호된 `raw_youtube.txt`는 건드리지 않는다.

### 2026-11-05 · 2020 AMC 8 MAA 점수 이미지 대조

- TestDaily 재게시 MAA 점수 보고서 이미지를 Apple Vision OCR 및 시각 대조했다. 상위 1/5/25/50/75% 경계 21/18/13/10/7, 최고점 25, 만점 57, 평균 10.00, 표준편차 4.69, 응시자 56,136명, 학교 1,408곳이 기존 런타임 기록과 일치했다. 화면의 보고서 이미지 직접 링크를 추가했다.
- 그래프는 정확한 점수별 인원수를 보여주지 않는다. 56,136명 점수보고서 모집단은 별도 응답률표 52,517명 및 학년별 이미지 56,099명과 계속 분리한다. 근거는 조사 기록의 “2020 AMC 8 MAA score-report image OCR cross-check”.

### 2026-11-05 · AMC 8 연도별 문제·학년통계 커버리지 연결

- 웹에서 [LIVE AMC archive](https://live.poshenloh.com/past-contests)를 확인했다. MAA 사용 허가를 명시하고 AMC 8/10/12 및 AIME 원본을 연도·폼별로 제공한다. 현재 목록은 총 266회차(AMC 8 41, AMC 10 52, AMC 12 102, AIME 71)이고, 실제 시험지 PDF·정답표·전문 풀이 링크를 제공한다. 2021 AMC 8은 시행되지 않아 목록에 없다. [MAA 2023 원본](https://maa.org/wp-content/uploads/2024/08/2023-Problems-AMC8-PDF.pdf)과 [MAA AMC 개요](https://maa.org/student-programs/amc/)도 시험 형식과 연례 운영을 대조했다.
- `amc-grade-reference-coverage-by-paper.csv`에 AMC 8 2004–2026 연도별 행 22개를 더했다. 기존 `amc8-grade-means-*.csv`의 보고서 링크·정확 학년·묶음 학년을 연결한 해는 2004–2015, 2017–2020, 2022다. 묶음 학년은 개별 학년 평균으로 간주하지 않는다.
- 2016 및 2023–2026은 전체 응시자 점수 요약만 확인되어 학년별 평균은 미회수 상태로 유지했다. 2017–2019는 미국·캐나다 응시자 표이므로 US-only라고 표시하지 않는다. 관련 근거는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 기록.
- 원본 자료 페이지는 시험지 인쇄본·답 입력용 정답표·전문 풀이뿐 아니라 개별 문항 링크, 개념 태그, 난도 평정, 힌트도 제공한다. 예: [2004 AMC 8](https://live.poshenloh.com/past-contests/amc8/2004), [2003 AMC 10A](https://live.poshenloh.com/past-contests/amc10/2003A). 저장소의 연도·폼별 원본 카탈로그와 답안/개념 색인은 이미 이 266회차를 연결한다. 미매칭 원본 문항은 지필드 자체 유사문항 뱅크의 범위 보완 대상으로 남긴다. 원문과 전문 풀이는 복제하지 않고 출처로 연결하며, 지필드가 만든 진단 결과·학습 추천·유사문항은 별도 레이어로 유지한다.
- 다음에는 AMC 10/12/AIME 문항별 응답률과 역사적 학년 기준을 교차 확인해 원본 개념 태그에서 지필드 진단·유사문항으로 이어지는 미연결 항목을 줄인다. `raw_youtube.txt` 보존; 푸시·배포·Drive 동기화 없음.

## 2026-11-05 · 경시 원본 태그 공백에 지필드 창작 연습 추가

- 6,500개 원본 문항의 공개 개념 태그와 지필드 후속 연습 은행을 다시 대조했다. 최소 한 태그가 연결되는 문항은 AMC 8 971/1,025 (94.7%), AMC 10 1,179/1,300 (90.7%), AMC 12 2,514/3,110 (80.8%), AIME 972/1,065 (91.3%)다. 이는 태그 교집합 수치이며 같은 난도·같은 문항 구조나 학년 수준을 보증하지 않는다.
- 원본에서 자주 나타나면서 후속 은행에는 없던 개념에 대해 각 대회별 창작 문항 2개를 추가했다: AMC 8 최소공배수·제한된 자리수 세기, AMC 10 이차 부등식의 정수 범위·부채꼴 넓이, AMC 12 점화식·도형 넓이 분해, AIME 벡터 내적·제약 배열. 각 문항에 힌트, 풀이 단계, 다음 사고 연결 질문을 넣었다. AMC 8 25문항 시간제 모의고사는 별도이며 후속 은행 카운트에 포함하지 않는다.
- 수정: `amc8-concept-practice-extension.js`, `competition/amc10-concept-practice-bank.js`, `competition/amc12-concept-practice-bank.js`, `competition/aime-concept-practice-extension.js`, `competition/historical-amc-grade/README.md`. 원본 문제·선택지·정답·해설은 복사하지 않았다. 확인: 원본 인벤토리 6,500행 재집계와 태그 교집합 산출, 여섯 문제의 답·산술을 직접 검산. 테스트는 실행하지 않는다. 이어서 남은 원본 개념 태그 중 빈도가 높은 항목과 각 연도별 진단표본을 계속 보완한다. `raw_youtube.txt` 보호; push·배포·Drive 동기화 없음.

### 후속: 다음 빈도 태그 묶음

- AMC 8에 자릿값을 이용한 연립식, 정삼각형의 높이·넓이 문항을 추가했다. AMC 10에는 표 가격 연립식과 두 원의 공통 외접선, AMC 12에는 합이 고정된 정수 곱 최적화와 보트 왕복 속력, AIME에는 바닥 함수 합의 범위 좁히기와 제곱의 나눗셈 조건 문항을 추가했다. 모두 지필드 창작이며 힌트·풀이·연결 질문을 포함한다.
- 갱신된 태그 교집합은 AMC 8 976/1,025 (95.2%), AMC 10 1,186/1,300 (91.2%), AMC 12 2,552/3,110 (82.1%), AIME 978/1,065 (91.8%)다. 후속 은행의 창작 문항 수는 각각 43, 37, 43, 38개다. 해당 백분율은 단일 태그 공유 여부만 센다.
- 수정: 위 네 대회 practice bank 파일, 각 연습 페이지의 캐시 키, `competition/historical-amc-grade/README.md`, 이 인수인계. 수치·개수는 6,500행 원본 인벤토리와 현행 연습 bank 태그를 재집계했다. 문제 풀이를 손으로 대조하고 `git diff --check`만 실행; tests 미실행. 다음 상위 공백은 AMC 8 net/3D geometry·tiling, AMC 10 regular polygon/rectangle, AMC 12 difference of squares/place value/angle chasing, AIME number base/tangent-circle geometry다. 계속 진행한다. `raw_youtube.txt` 보호; push·배포·Drive 동기화 없음.

### 2026-11-05 · 웹 원본 재확인 및 AMC 8 개념 공백 보완

- LIVE 연도별 아카이브와 MAA AMC 안내를 웹에서 다시 확인했다. LIVE는 MAA의 사용 허가를 명시하며, 현재 AMC 8 41회·AMC 10 52회·AMC 12 102회·AIME 71회, 총 266개 연도/형식 시험지를 열거한다. 각 종목 페이지에서 실제 시험지 PDF·정답표·전문 풀이와 문항별 개념·힌트·풀이 링크를 확인했다. `amc-original-source-catalog.csv`의 266행은 각 행에 인쇄 PDF, 정답, 전문 풀이 링크가 모두 채워져 있다. 출처 확인: [LIVE 아카이브](https://live.poshenloh.com/past-contests), [MAA AMC 형식 안내](https://maa.org/student-programs/amc/), [2004 AMC 8 회차](https://live.poshenloh.com/past-contests/amc8/2004), [2003 AMC 10A 회차](https://live.poshenloh.com/past-contests/amc10/2003A).
- AMC 8 후속 연습에 정육면체 전개도와 체스판 도미노 타일링 불변량 문항을 추가했다. 저장소는 원본 시험 텍스트를 복제하지 않고 회차별 원문/인쇄/정답/해설 출처를 연결하며, 이 두 문항은 지필드가 새로 쓴 후속 연습이다.
- 현재 후속 bank는 AMC 8 45, AMC 10 37, AMC 12 43, AIME 38문항이다. 최소 한 원본 개념 태그가 연결되는 원본 문항은 각각 983/1,025 (95.9%), 1,186/1,300 (91.2%), 2,552/3,110 (82.1%), 978/1,065 (91.8%)다. 태그 일치만 잰 수치로 난이도 동등성이나 학년 판정은 뜻하지 않는다. 두 새 문항의 답과 설명을 직접 점검했고 `git diff --check`를 실행했다. 테스트는 실행하지 않았다.
- `raw_youtube.txt`는 보존한다. 로컬 커밋만 가능하며 푸시·배포·Drive 동기화는 하지 않았다. 다음 작업은 가장 자주 남은 원본 개념 태그에 맞춰 새 문제를 보완하고, 실제 회차 페이지의 선택·답 입력·해설·연습 연결 흐름을 이어 검토한다.

### 2026-11-05 · AMC 10/12 및 AIME 원본 개념 후속 연습 보완

- 원본 개념 빈도 상위에서 AMC 10 정다각형·직사각형, AMC 12 제곱차·자릿값·각도 추적, AIME 진법·공통 내접선을 골라 지필드 창작 문항 7개를 추가했다. 문항마다 힌트, 단계별 풀이, 생각을 확장하는 연결 질문을 넣었다. 모든 `sourceConcepts`는 해당 대회 원본 인벤토리에 존재하는 태그인지 확인했다.
- 갱신한 원본 문항-후속 bank 태그 겹침은 AMC 8 983/1,025 (95.9%), AMC 10 1,192/1,300 (91.7%), AMC 12 2,599/3,110 (83.6%), AIME 986/1,065 (92.6%)다. 은행 수는 AMC 8 45, AMC 10 39, AMC 12 46, AIME 40이다. 겹침률은 원본 한 문항에서 bank 태그 하나 이상이 맞는지 센 값이며 난이도나 학년을 판정하지 않는다.
- 다음 태그 공백은 AMC 8 counting-integers-in-a-range / circumference / transformation; AMC 10 cube-geometry / prime / systematic-listing / dice-probability; AMC 12 angle-chasing / distance-formula / volume / logical-deduction; AIME distance-formula / incircle-incenter-and-inradius / complementary-counting / volume 순으로 남아 있다. 이어서 빈도 상위부터 보완한다.
- 수정: AMC 10/12/AIME bank, 세 연습 페이지 캐시 키, historical AMC README, 이 인수인계. 원본 인벤토리 6,500행을 기준으로 태그 중첩을 재집계하고 새 문항의 답과 풀이를 직접 계산해 대조했다. `git diff --check` 실행; 테스트는 실행하지 않는다. `raw_youtube.txt` 보호; 로컬 커밋만 허용, push·배포·Drive 동기화 없음.

### 2026-11-05 · 다음 원본 개념 공백 보완

- AMC 8에 정수 범위의 배수 개수·원둘레, AMC 10에 정육면체 공간 대각선·약수의 소인수 세기, AMC 12에 각 이등분·등거리 좌표, AIME에 원 위 격자점·13-14-15 삼각형 내접원 반지름을 추가했다. 전부 지필드가 작성한 연습 문항이며 원본 문항 본문은 포함하지 않는다.
- 커버리지 집계: AMC 8 987/1,025 (96.3%), AMC 10 1,205/1,300 (92.7%), AMC 12 2,633/3,110 (84.7%), AIME 995/1,065 (93.4%). bank 문항 수는 각각 47, 41, 48, 42개다. 한 원본 문항의 공개 개념 태그 중 하나 이상이 bank와 겹치는지를 센 수치다.
- 이어서 남는 높은 빈도 태그: AMC 8 transformation·permutations·telescoping; AMC 10 systematic-listing·dice-probability·difference-of-squares·recursion; AMC 12 volume·logical-deduction·tangent-line·perfect-square; AIME complementary-counting·volume·tangent-line·greatest-common-divisor. 해당 개념으로 계속 확장한다.
- 수정: AMC 8 extension과 페이지 캐시 키, AMC 10/12/AIME bank, historical AMC README, 이 인수인계. 새 태그를 원본 인벤토리와 대조하고 풀이·정답을 직접 검산했다. `git diff --check` 실행; 테스트는 실행하지 않는다. `raw_youtube.txt` 보호; 로컬 커밋만, push·배포·Drive 동기화 없음.

### 2026-11-05 · 경시 원본 태그 연결 추가 보완

- AMC 8 좌표 회전·순열, AMC 10 체계적 목록·두 주사위 확률, AMC 12 원기둥/원뿔 부피·참거짓 논리, AIME 이진 수열의 여집합 세기·최대공약수 조건 순서쌍 문항을 추가했다. 모두 지필드 새 연습이다.
- 커버리지: AMC 8 990/1,025 (96.6%), AMC 10 1,217/1,300 (93.6%), AMC 12 2,681/3,110 (86.2%), AIME 1,006/1,065 (94.5%). bank 49/43/50/44문항. 전체 사용 태그가 해당 대회의 원본 문항 태그 인벤토리에 존재하는 것도 확인했다.
- 다음 고빈도 공백: AMC 8 telescoping·cryptarithm·dice-probability; AMC 10 difference-of-squares·recursion·right-triangle; AMC 12 tangent-line·perfect-square·money; AIME volume·tangent-line·equilateral-triangle·chord. 계속 보완한다.
- 수정: AMC 8/10/12/AIME 연습 bank, AMC 8·10·12·AIME 연습 페이지 캐시 키, historical AMC README, 인수인계. `git diff --check`와 원본 태그/문항 중첩 재집계 실행; 별도 테스트는 실행하지 않는다. 새 문항 답과 풀이를 직접 계산해 확인했다. `raw_youtube.txt` 보호; 로컬 커밋만, push·배포·Drive 동기화 없음.

### 2026-11-05 · 빈도 상위 개념 연습 추가

- AMC 8에는 암호식과 호의 길이, AMC 10에는 제곱차와 점화식, AMC 12에는 접선으로 만든 사각형의 넓이와 완전제곱 배수, AIME에는 원기둥·원뿔 부피와 원의 접선 방정식 문항을 넣었다. 연습 문항은 지필드가 새로 작성했다.
- 원본 한 문항당 태그가 하나라도 맞는 연습 은행 문항은 AMC 8 991/1,025 (96.7%), AMC 10 1,226/1,300 (94.3%), AMC 12 2,687/3,110 (86.4%), AIME 1,012/1,065 (95.0%)다. bank 크기는 51/45/52/46. 모든 bank 태그는 해당 대회 원본 태그 인벤토리에서 확인했다. 이 지표는 교집합만 세며 실력·학년·난도 판정값이 아니다.
- 다음 우선 공백은 AMC 8 망원합·주사위확률·길이/넓이/부피 배율, AMC 10 직각삼각형·계승·이등변삼각형, AMC 12 화폐 문제·이등변삼각형·코사인 법칙, AIME 정삼각형·현·극값 논증이다. 이 태그별 문항 연결을 계속 확장한다.
- 수정: AMC 8/10/12/AIME bank, 네 연습 페이지 캐시 키, historical AMC README, 인수인계. 새 문항의 정답·풀이를 직접 계산했고 원본 태그 인벤토리 및 전체 중첩을 재집계했다. `git diff --check` 실행; 별도 테스트는 실행하지 않았다. `raw_youtube.txt` 보존; 로컬 커밋만, push·배포·Drive 동기화 없음.

### 2026-11-05 · 경시 연습의 수열·기하·수론 연결 보완

- AMC 8 망원합·주사위 확률, AMC 10 직각삼각형 내접원·계승의 끝자리 0, AMC 12 할인율·이등변삼각형, AIME 정삼각형 넓이·원의 현 거리를 다룬 지필드 문항 8개를 추가했다. 분수는 기존 연습 화면의 세로형 렌더러를 사용한다.
- 최신 태그 교집합: AMC 8 992/1,025 (96.8%), AMC 10 1,231/1,300 (94.7%), AMC 12 2,695/3,110 (86.7%), AIME 1,014/1,065 (95.2%). 은행은 53/47/54/48문항. 추가된 출처 태그는 각 대회 원본 인벤토리에 있음을 확인했다.
- 다음 상위 공백: AMC 8 길이·넓이·부피 배율 및 중복 세기; AMC 10 이등변삼각형·근호·기하확률; AMC 12 코사인 법칙·정다각형·접원; AIME 극값 논증·변환·순열·사인 법칙. 이어서 보완한다.
- 수정: AMC 8/10/12/AIME bank, 연습 페이지 캐시 키, historical AMC README, 인수인계. 새 풀이를 직접 검산했고 `git diff --check`와 태그 중첩 집계를 실행했다. 별도 테스트는 실행하지 않는다. `raw_youtube.txt` 보존; 로컬 커밋만, push·배포·Drive 동기화 없음.

### 2026-11-05 · 도형 비율·조합·극값 연습 추가

- AMC 8에는 정육면체 부피 배율과 악수 중복 세기, AMC 10에는 이등변삼각형 넓이와 근호 정리, AMC 12에는 코사인 법칙과 정다각형 대각선, AIME에는 최대값 하한과 제한 배열을 다룬 지필드 문항을 추가했다.
- 최신 은행 크기는 AMC 8 55, AMC 10 49, AMC 12 56, AIME 50문항. 하나 이상의 원본 개념 태그가 대응된 회차 문항은 각각 995/1,025 (97.1%), 1,237/1,300 (95.2%), 2,715/3,110 (87.3%), 1,018/1,065 (95.6%)다. 새 태그는 원본 인벤토리와 대조했다.
- 다음 잔여 공백 상위는 AMC 8 complementary-probability·mode·summation; AMC 10 geometric-probability·unit-conversion·transformation; AMC 12 tangent-circles·triangle-inequality·pattern-recognition; AIME transformation·law-of-sines·pattern-recognition·trapezoid다.
- 수정: 네 연습 bank, 페이지 캐시 키, historical AMC README, 인수인계. 문항 계산을 직접 점검하고 `git diff --check` 및 태그 중첩 집계를 실행했다. 별도 테스트 미실행. `raw_youtube.txt` 보존; 로컬 커밋만, push·배포·Drive 동기화 없음.

### 2026-11-05 · 확률·변환·삼각법 연습 연결

- AMC 8 여사건 확률·최빈값, AMC 10 원 안의 기하확률·속력 단위 변환, AMC 12 공통 내접선·정수 삼각형 부등식, AIME 사인 법칙으로 구한 외접원 반지름·이등변사다리꼴 넓이 문항을 추가했다.
- 갱신된 은행은 AMC 8 57, AMC 10 51, AMC 12 58, AIME 52문항이다. 태그 하나 이상이 원본과 겹치는 문항은 AMC 8 997/1,025 (97.3%), AMC 10 1,242/1,300 (95.5%), AMC 12 2,729/3,110 (87.7%), AIME 1,026/1,065 (96.3%)다. 모든 은행 태그가 해당 대회 원본 인벤토리에 있는지 확인했다.
- 다음 우선 공백은 AMC 8 합계·시계·평행사변형; AMC 10 변환·각 추적·중앙값; AMC 12 패턴 찾기·기울기·진법; AIME 변환·패턴 찾기·순서쌍 세기·이항정리다.
- 수정: AMC 8/10/12/AIME bank, 연습 페이지 캐시 키, historical AMC README, 인수인계. 풀이를 직접 점검했고 태그 중첩을 다시 집계했다. `git diff --check`를 실행하고 별도 테스트는 실행하지 않았다. `raw_youtube.txt` 보존; 로컬 커밋만, push·배포·Drive 동기화 없음.

### 2026-11-05 · 웹에서 연도별 AMC/AIME 원본 확인 및 태그 연습 추가

- 사용자가 “웹 검색으로 가져와”라고 요청해 LIVE의 연도별 아카이브와 MAA 원본 자료를 열어 확인했다. 아카이브가 실제 MAA AMC 시험을 허가 받아 제공하며 266회(AMC 8 41, AMC 10 52, AMC 12 102, AIME 71), 77개 연도, 6,500문항을 연도/형식별로 나열한다. 회차 페이지에서 PDF 인쇄·정답·전문 풀이·문항별 개념/힌트/풀이로 이어진다. 2025 AMC 8 회차와 인쇄 PDF·정답표·전문 해설, 2025 AMC 12A 및 2026 AIME I 회차를 브라우저에서 확인했다. MAA가 직접 호스팅하는 2023 AMC 8 PDF도 별도 공식 링크로 카탈로그에 기록되어 있다. 저장소에는 원문을 복제하지 않고 연결 주소/메타데이터만 둔다.
- 카탈로그의 266개 인쇄 PDF 주소에 HTTP HEAD를 확인했다: 265개는 200 PDF, 2023 AMC 8의 MAA 호스팅 PDF 1개는 자동 HEAD 요청에 403을 반환했다. 해당 링크는 MAA 공식 사이트의 웹 검색/문서 인덱스에서 원본 PDF로 확인되었으므로 제거하지 않았고, 일반 브라우저에서 열리는지 별도 직접 다운로드 검증은 미완료로 남긴다.
- 개념 후속 은행에 AMC 8 합계·시계 각도, AMC 10 좌표 반사/이동·평행선 동위각, AMC 12 수직선 기울기·제2차 차분 수열, AIME 이항계수·홀짝 순서쌍 문항을 추가했다. 답은 각각 240, 10°; (1,−6), x=20; 2/3, 48; 240, 100으로 풀이를 대조했다.
- 은행 크기 59/53/60/54. 태그 교집합 기준 연결은 AMC 8 1,002/1,025 (97.8%), AMC 10 1,246/1,300 (95.8%), AMC 12 2,735/3,110 (87.9%), AIME 1,030/1,065 (96.7%). 태그 전부 원본 인벤토리에 존재하고 중복 ID는 없다. 연습 페이지의 캐시 키를 갱신했다.
- 수정: 네 연습 bank와 HTML 캐시키, historical AMC README, 이 인수인계. 정적 태그 교집합·문항 수 재집계 및 `git diff --check` 수행. 별도 테스트는 실행하지 않는다. `raw_youtube.txt` 보존; 로컬 커밋 가능, push·배포·Drive 동기화 없음. 다음은 연도 카탈로그의 사용자 흐름과 비어 있는 문항-학습 연결을 계속 다룬다.

### 2026-11-05 · 원본 태그 상위 공백 추가 보완

- AMC 8에 제곱수 차·최대공약수, AMC 10에 중앙값·최소공배수·자리값, AMC 12에 기하확률·진법·공간 대각선·숫자 중복 없는 코드 세기, AIME에 복소평면 변환·수열의 차분·정다각형·망원합 연습을 추가했다. AIME 답 입력 범위와 맞도록 복소수 문항은 허수부 절댓값을 묻는다. 분수 표기는 화면의 세로형 분수 렌더러가 처리한다.
- 현재 은행은 AMC 8 61, AMC 10 56, AMC 12 64, AIME 58문항. 태그 겹침 기준 원본 연결은 AMC 8 1,005/1,025 (98.0%), AMC 10 1,251/1,300 (96.2%), AMC 12 2,760/3,110 (88.7%), AIME 1,035/1,065 (97.2%). 새 출처 태그는 인벤토리에 모두 있고 중복 ID는 없다.
- 다음 큰 공백은 AMC 8 계승·바닥/천장 함수·격자점·중점·평행사변형; AMC 10 역으로 풀기·여사건 세기·추정·극값·바닥 함수; AMC 12 중선·단위원·단위 변환·반례·고도; AIME 점의 거듭제곱·단위원·그래프 이론·대수적 대칭·각 추적이다.
- 새 문항의 답과 풀이를 직접 계산해 대조했고 원본 태그/문항 연결을 재집계했다. git diff --check만 수행하고 테스트는 추가하거나 실행하지 않는다. raw_youtube.txt 보존; 커밋은 허용된 로컬 범위이며 push·배포·Drive 동기화 없음.

### 2026-11-05 · 조합·수론·원기하 공백 후속 연결

- AMC 8에는 25! 끝자리 0 개수와 격자 선분의 정수 점 개수, AMC 10에는 0이 포함된 세 자리 수의 여집합 세기와 역산, AMC 12에는 단위근 합·소수 다항식 반례·시간 단위 변환, AIME에는 점의 거듭제곱·단위근·정규 그래프 차수·대칭식·원 내접 사각형 각 문항을 추가했다. 모두 새 창작 문제이며 AIME 답 규격에 맞춰 정수 입력으로 검토했다.
- 은행은 AMC 8 63, AMC 10 58, AMC 12 67, AIME 63문항이다. 원본 태그 교집합은 AMC 8 1,009/1,025 (98.4%), AMC 10 1,253/1,300 (96.4%), AMC 12 2,769/3,110 (89.0%), AIME 1,040/1,065 (97.7%)이다. 새 태그 존재와 ID 중복을 확인했다.
- 다음 빈도 상위 공백은 AMC 8 floor/ceiling·중점·평행사변형·피타고라스 삼쌍; AMC 10 추정·극값·바닥 함수·진법·치환; AMC 12 삼각형 중선·고도·포물선·중점·변환; AIME 여집합 세기·근호·각 이등분선·조건부 확률·헤론 공식이다.
- 새 답/풀이를 직접 검산하고 정적 집계 및 git diff --check를 수행했다. 테스트는 추가하거나 실행하지 않았다. raw_youtube.txt 보존; 커밋 가능 범위는 로컬이며 원격 반영·배포·Drive 동기화 없음.

### 2026-11-05 · AIME 학년별 원자료 표 목록 확인

- 웹 검색으로 2008 MAA High School Results and Awards Summary의 목차를 확인했다. AIME I의 학년별 점수분포는 인쇄 261쪽, AIME II는 262쪽에 있다고 나와 있다. 공개 StudyLib 미러의 실제 본문은 그 표 페이지 전에서 끝나므로 행별 수치를 읽거나 재검산할 수 없다.
- 보고서 본문에서 두 시험 합계 공식 응시자 8,584명, I 평균 4.77, II 평균 5.27은 확인했다. 이 값은 학년별 점수 빈도표를 대신하지 않으므로 2008 AIME 비교 진단에는 연결하지 않는다.
- 2008 AIME I/II의 범위표 상태를 `aime-grade-table-located-not-transcribed`로 바꿔 “아직 조사하지 않음”과 “표 위치는 확인했으나 표 본문을 못 구함”을 구분하고, 두 회차 행에 출처 URL과 제한사항을 기록했다. 2010 AIME 학년별 분포는 기존 검증 데이터로 유지한다.
- 출처: [2008 MAA 보고서 공개 미러](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions), [LIVE 연도별 AIME 원본](https://live.poshenloh.com/past-contests). 다음 단계는 MAA 보고서의 261–262쪽 원본을 확보해 표 행·학년합계·전체 평균을 서로 대조하는 것이다.

### 2026-11-05 · 웹 검색으로 AIME 학년별 비교표 재대조

- 요청에 따라 웹에서 연도별 AMC/AIME 원본과 결과 자료를 다시 찾았다. LIVE의 MAA 허가 아카이브는 실제 회차 266개(AMC 8 41, AMC 10 52, AMC 12 102, AIME 71)를 연도·형식별로 제공하고 시험지 인쇄 PDF·정답표·전문 풀이·문항별 개념/힌트/풀이를 연결한다. 이 경로는 `amc-original-source-catalog.csv`에 이미 들어 있다.
- 2010 MAA *AMC 10/12 Summary of Results and Awards*의 Scribd 공개 미러에서 AIME I/II 학년별 점수표(인쇄 pp.201–202)를 찾아 기존 전사를 다시 집계했다. I는 3,618명, 가중 평균 4.1235(보고서 4.12); II는 2,904명, 가중 평균 5.9098(보고서 5.91)로 일치한다. 정확한 학년 8–13에만 진단 비교를 제공하며 `unknown`과 `<=7`은 묶음 범주로 유지한다.
- 2008 AIME 학년별 표는 다른 검색에서도 목차와 수치만 노출되고 인쇄 pp.261–262의 행은 회수되지 않았다. College Sidekick 결과는 3쪽짜리 일부 미리보기라 표가 없고, 이를 2008 점수분포 원자료로 취급하지 않는다. 상태와 기존 데이터는 바꾸지 않는다.
- 갱신: `boarding-school-math/competition/historical-amc-grade/README.md`. 원본 기출은 출처 링크로 남기며 문항·풀이를 복제하지 않는다. 화면도 확인했고 7학년 지도에서 펼친 학년 선택 영역이 비어 있음을 다시 확인했으나, 실행 중인 localhost는 lete-on 작업본을 가리키고 그 작업본에는 광범위한 사용자 미커밋 변경이 있어 이 분기에서는 수정하지 않았다. 다음은 사용자 변경 보존 범위를 확인한 뒤 해당 화면의 학년 선택 렌더링을 바로잡는 것이다.
- 출처: [LIVE 연도별 원본](https://live.poshenloh.com/past-contests), [MAA 2010 결과 요약 공개 미러](https://www.scribd.com/document/51428451/2010-HS-summary), [2008 MAA 보고서 공개 미러](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions). `raw_youtube.txt` 보존; push·배포·Drive 동기화 없음.

### 2026-11-05 · 브라우저 연도별 진단 흐름 확인 및 인수인계 정정

- 앞 항목의 localhost 경로에 관한 설명을 정정한다. 개발 서버 PID 41588의 작업 디렉터리는 `/Users/docssam/Developer/GFIELD/continuations/boarding-school`이며, `:8765`는 이 continuation 작업본의 `boarding-school-math`를 제공한다. 빈 학년 선택 영역은 코드 누락이 아니라 이전 브라우저 문서/스크립트 캐시였다. 현재판으로 다시 불러오자 10개 학년 선택지가 렌더링됐다. 따라서 lete-on의 미커밋 변경과 충돌해 수정하지 못했다는 앞 설명은 부정확하며, 해당 파일은 수정하지 않았다.
- 현재 브라우저에서 AMC 8, 2008을 열어 확인했다: 연도별 PDF 인쇄·정답표·전문 풀이·문항별 출처 링크, 답 입력, 공개 정답표 자동 대조, 결과 진단까지 작동한다. 화면의 25문항에 임시로 A를 입력해 흐름만 확인한 뒤 결과를 저장하지 않았다. 이 임시 5/25는 실제 학습자 점수나 예시 진단으로 사용하지 않는다.
- 결과 화면은 문항 번호 구간, 과거 MAA 전체 응시자 수상 기준선, 2008 기록 학년별 분포(Grade 7 포함), 전체 응시자 점수 분포, 문항별 개념/응답 자료, 오답 이유 입력, 지필드 후속 연습 링크를 보여 줬다. 기준선은 그 시험의 과거 모집단 자료이며 공식 percentile·현재 규준·능력 등급 또는 학년별 수상 판정이 아니라고 화면에 구분되어 있다. 답·이름은 복습 기록에 저장되지 않는다.
- 2008 AIME 분포 재검색에서는 결과·수상 보고서 디지털화 컬렉션을 만든 연구자의 AMC archive를 찾았다. 본인 페이지는 1980–2010 고교 요약집을 모두 수집했다고 설명하지만, 공개된 “Full Text” 링크는 1968 자료만 열어준다. StudyLib의 2008 보고서 본문도 전체 추출 텍스트가 통계부 인쇄 p.261–262에 닿기 전에 끝난다. 따라서 2008 AIME I/II 행별 표는 여전히 확인 불가이며 데이터는 추가하지 않았다.
- 연도 색인을 정적으로 대조했다: 266개 회차 키가 모두 고유하고, 모든 행에 인쇄 PDF·정답표·전문 풀이 주소가 있다. 구성은 AMC 8 41, AMC 10 52, AMC 12 102, AIME 71. 학년 비교 커버리지 파일도 같은 266회차를 갖고 있으며, 비교 자료가 없는 연도를 빈 규준으로 두지 않고 명시 상태로 구분한다.
- 이 점검으로 문서만 갱신했다. `git diff --check`를 수행했고 테스트는 실행하지 않았다. `raw_youtube.txt` 보존; 로컬 커밋만 가능하며 push·배포·Drive 동기화 없음. 다음은 기존 연도 색인의 회차별 커버리지와 공식 통계가 있는 해/폼만 비교 지표가 표시되는지 계속 감사하고, 누락된 실제 원자료를 검색한다.
- 출처: [LIVE 연도별 공식 AMC/AIME 시험지·답안·풀이 아카이브](https://live.poshenloh.com/past-contests), [2008 MAA AMC 8 결과 보고서 공개 사본](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america), [AMC 통계 보고서 디지털 아카이브 설명](https://sites.google.com/view/ian-calaway/amc-archive/), [2008 고교 요약집 공개 미러](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions).
### 2026-11-05 · 2011 대만 문항 반응표와 LIVE 답안키 불일치

- 웹에서 회수한 [99CEF 2011 AMC 8 보고서](https://www.99cef.org.tw/userfiles/2011AMC8Summary.pdf)의 세계 점수분포와 Grade 7 평균(n=50,176; 10.66)은 해당 모집단의 별도 연도 통계로 유지한다. 그러나 보고서 p.10 대만 응답표(n=9,896)의 정답 표시가 [LIVE 2011 정답표](https://live.poshenloh.com/past-contests/amc8/2011/answers)와 일치하지 않는다(Q1 A/E, Q2 C/E). 표가 다른 폼/응답코드인지 또는 오류인지 공개 자료만으로 판단할 수 없어, 대만 응답을 LIVE 문항에 연결하지 않는다.
- 롤백: 임시 대만 응답 CSV와 런타임 선택기/표시를 제거했다. README와 조사 기록에 불일치·제외 사유를 남겼다. `raw_youtube.txt`는 그대로 보호했다.
- `git diff --check`로 문서 변경을 확인한다. 별도 테스트는 실행하지 않았다. 로컬 변경만 유지하며 push·배포·동기화는 하지 않는다.

### 2026-11-05 · 2008 AIME 학년표 웹 검색 후속

- MAA 작성 2008 고교 결과집의 목차는 AIME I/II 학년별 점수 분포가 인쇄 pp.261–262에 있다고 확인하지만, 공개 검색 미러에서 해당 표 행은 노출되지 않는다. 보고서 본문이 확인해 주는 것은 두 회차 합계 8,584명 및 I 평균 4.77, II 평균 5.27이다.
- 검색 결과의 상세 학년표(총 3,618/2,904명, 평균 4.12/5.91)는 2010 AIME이며 기존 데이터와 일치한다. 2008로 잘못 옮기지 않았고, coverage 상태는 `aime-grade-table-located-not-transcribed`로 유지한다. 상세 검색 기록은 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 있다.
- 출처: [2008 MAA 고교 결과집 미러](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions), [2010 MAA 고교 결과집 미러](https://www.scribd.com/document/51428451/2010-HS-summary), [연구자 AMC archive](https://sites.google.com/view/ian-calaway/amc-archive/).
### 2026-11-05 · MAA EduView recent AMC 8 values rechecked

- Reopened MAA's public score-distribution report for AMC 8 school years 2022/23–2025/26. All 12 values per year (percentile cut scores, maximum, mean, standard deviation, student count, and school count) match `boarding-school-math/competition/historical-amc-grade/amc8-score-distribution-2023-2026-maa.csv`; the report's `.00` integer formatting was normalized for numeric comparison.
- Confirmed this public report is overall-cohort only: it has no grade-by-grade or item-response rows. Keep these as year-specific overall comparisons, not grade ranks, placement, or skill levels. Evidence and exact links are in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`.
- `git diff --check` to be run. Preserve `raw_youtube.txt`; no push, deployment, or Drive sync.

### 2026-11-05 · 2008 AMC 10/12 item-statistics table located

- The MAA 2008 high-school results report table of contents locates all-official-student item-difficulty tables for AMC 12A/12B and AMC 10A/10B on printed pages 252–255. The accessible web text does not expose the table cells, so no response percentages were entered; those four manifest rows remain `not-found` pending a readable scan/page image.
- Evidence and source link recorded in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. Preserve `raw_youtube.txt`; no push, deployment, or Drive sync.
### 2026-11-05 · 2008 AMC 10/12 grade cohort cross-check

- Web search surfaced the 2008 MAA *High School Results & Awards Summary* and its published Table I/II. Cross-checked the previously staged 2008 grade-group rows against the four report-wide official-participant totals and means: AMC 10A 68,101 / 58.1; 10B 34,803 / 66.6; AMC 12A 78,560 / 65.6; 12B 41,609 / 68.9. Each grade-group count sum and count-weighted mean (using the published one-decimal grade means) reconciles to the report-wide values.
- The 2008 report's item-difficulty tables are confirmed at printed pp. 252–255, but searchable copies expose their titles/contents page rather than legible option-response rows. StudyLib's direct page presents a Cloudflare verification screen; do not work around it or transcribe guessed values. The four item-response coverage rows remain `not-found` pending a readable public copy/page image.
- Sources: [2008 MAA-authored report mirror](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions); [2010 MAA-authored report mirror with 2008 four-year comparison tables](https://www.scribd.com/document/51428451/2010-HS-summary). Exact check is recorded in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`.
### 2026-11-05 · 2014 AMC 12B 원문 응답률 추가

- 공개 GEMT 2014 AMC10B/12B 보고서에서 AMC12B Global 전 문항 선택률을 가져와 `amc10-12-item-response-reference.js`와 문항 응답 커버리지 표에 추가했다. 25개 정답은 LIVE 답안표와 일치하고, 표본은 Global n=33,247로 한정했다. 대만 1,886명 표는 섞지 않았다. 복습 화면 데이터 스크립트의 캐시 버전도 올렸다.
- 기존 2014 AMC12B 학년별 집계의 Global 표(인쇄 p.13)와도 대조했다. Grade 11의 PDF 텍스트 표기 `17.303`은 학년별 합계 33,247명과 일치하는 17,303으로 유지했다. 원보고서 총 평균은 68.08이다.
- 응답률 표는 웹에서 읽은 PDF 텍스트에서 전사했으며 로컬 이미지/OCR 확인은 하지 않았다. README와 연구 기록에 이 한계, 출처, 응답 통계의 해석 범위를 적었다. 이어서 연도별 AMC 10/12 원자료의 빈 구간을 웹에서 찾아 수집한다.
- `raw_youtube.txt`는 사용자 소유 파일로 그대로 두고 미스테이지 상태를 유지한다. 로컬 변경만 한다. push·배포·Drive 동기화는 하지 않는다.
### 2026-11-05 · 2013 AMC 10B/12B 문항 응답률 추가

- GEMT 2013 보고서의 Global 응답표(AMC10B p.9, AMC12B p.18)를 기존 시험지 복습 진단에 연결했다. 두 회차 모두 25개 정답이 LIVE 답안표와 일치한다. 응시 집단은 10B 34,740명, 12B 30,249명이며 Taiwan 표는 섞지 않았다.
- 10B 학년표의 응시자 합계는 전체보다 2명 적어 원문 불일치를 그대로 보존했다. 응답률은 색인된 PDF 텍스트에서 전사했으며, 페이지 이미지 OCR은 못 했다. README와 출처 연구 파일에 표본·한계·출처를 적었다. 복습 데이터 스크립트의 캐시 버전을 올렸다.
- `raw_youtube.txt`는 변경하지 않고 미스테이지로 유지한다. push·배포·Drive 동기화는 하지 않는다.

### 2026-11-05 · 웹 검색: 2005 AMC 10/12 원자료 경로

- MAA 작성 56th Annual AMC 보고서의 목차에서 2005년 전체 참가자 응답표 위치를 확인했다: AMC12A/B pp.330/332, AMC10A/B pp.334/336; AIME qualifying-only 표는 pp.326–329. 2005 AMC12B의 공식 참가자 44,303명·평균 83.4점 및 1–10번 평균 정답 6.54개도 확인했다. 요약·학년 자료는 기존 파일에 있어 중복 추가하지 않았다.
- Doczz 본문은 통계 표 셀을 제공하지 않았지만, Internet Archive가 보존한 원본 MAA PDF를 회수해 2005 AMC 10A/B·12A/B 네 표(pp. 330, 332, 334, 336)를 읽었다. Apple Vision OCR 결과를 페이지 이미지와 대조하고 100개 정답 표식을 LIVE의 해당 연도·폼 정답 키와 전부 대조했다.
- 네 폼의 25문항 응답률을 `boarding-school-math/competition/historical-amc-grade/amc10-12-2005-item-response.csv`와 런타임 참조에 연결했다. Table I 분모는 10A 67,074명, 10B 34,070명, 12A 83,728명, 12B 44,303명이다. 원문 반올림 비율을 그대로 보존했고 별도 unreadable 비율이 없어 미상으로 둔다. 상세 출처와 확인 경로는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 갱신했다.

### 2026-11-05 · 2010 AMC 10B/12B 전체 응답률 추가

- MAA 작성 2010 결과집 Table IX(pp.195–196)의 전체 공식 응시자 선택지별 응답률을 검색 가능한 본문에서 전사해 `amc10-12-2010b-item-response.csv`와 기존 복습 진단 lookup에 연결했다. AMC10B/12B 각각 n=40,750이며, LIVE 정답표와 25개 키를 모두 대조했다. AIME 진출자 표와 혼동하지 않았다.
- 응답률 합계가 99.91%·99.92%·99.88%인 10B 8·17번과 12B 3번은 원문 값은 보존하되 비교 UI에서 제외했다. 자료는 3자 호스팅 MAA 보고서의 web-indexed text 전사이며 페이지 이미지 OCR은 아니다. 출력용 원시험지·답안·해설 링크는 기존 year/form catalog를 사용한다.
- 현재 HEAD에는 앞서 커밋한 2005 출처 조사 기록 `73459532e`가 있다. 사용자 파일 `raw_youtube.txt`는 수정/stage 금지. 이번 2010 데이터 변경은 아직 미커밋이며, 다음은 25행·키·합계·coverage 및 lookup 연결을 확인하고 커밋한다.
- 후속 검색에서 PDFCoffee의 공개 2010 보고서 미러를 추가 확인했다. 2010 AMC10B 25문항의 다섯 선택률·무응답률과 정답 별표가 staged CSV와 모두 일치한다. 출처 링크를 이 미러로 갱신했고 조회 스크립트 캐시 버전을 올렸다. Q8/Q17은 표본-share 합계 문제 때문에 계속 비교에서 제외한다.

### 2026-11-05 · 2011 AMC 10/12 B형 문항 응답표 검색

- 웹에서 MAA 2011 Grand Statistics 보존 PDF를 확인했다. 전체 참가 수·평균·기록 학년 평균/인원은 제공하지만, 회수 가능한 2쪽 보고서에는 25문항 선택지 응답률이 없다. 기존 2011A 응답표(Global n=70,919/74,665)는 99CEF 자료로 이미 연결돼 있고, B형 행은 coverage에서 `not-found`로 유지한다.
- 2012 MAA 교사용 안내서는 2011 결과 요약이 온라인에 있다고 안내한다. 동시대 연구 논문은 옛 MAA 통계 페이지를 인용하며 10B #13 및 12B #14 등 네 문항의 정답률/무응답률을 수록한다. 하지만 전체 선택지 분포·응답 인원·오답 선택지를 제공하지 않으므로 진단 표에 옮기지 않았다.
- 연구자 AMC archive는 2011–2022 디지털 결과를 모았다고 설명하지만, 페이지의 유일한 Full Text 링크는 1968년 파일을 연다. 다음은 전체 2011 Results Summary 또는 `11-HS-StateStats.shtml` 자산을 읽을 수 있는 공개 경로로 찾고, 모든 정답 표시와 분모를 LIVE 형식별 정답키·MAA Grand Statistics와 대조하는 일이다.
- 근거/검색 범위: `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. 수치 데이터 변경 없음; `raw_youtube.txt` 보존; 로컬 문서만, push·배포·Drive 동기화 없음.
### 2026-11-05 · 웹 검색: 2012 AMC 10B 일부 문항 응답 분포 연결

- Illustrative Mathematics/OpenCurriculum의 AMC 적응 수업 자료에서 2012 AMC 10B #3, #5–8, #12–13, #16, #19–20의 문항별 A–E 선택·공란률을 회수했다. 페이지들은 해당 시험의 전체 응시자 n=35,086을 표시한다. 각 별표 정답을 LIVE 연도/폼 정답키와 대조했다.
- `amc10b-2012-global-item-response-partial.csv`와 응답 reference에 10문항을 추가하고 coverage에 `partial`/10을 기록했다. 일부 퍼센트는 정수 반올림이며 unreadable 응답률을 따로 보고하지 않아 미상으로 저장한다. 문항별 출처 URL을 원자료 표에 보존했다. 2012 AMC 10B 15문항 및 12B는 아직 미확인이다.
- 미검증: 점수 분포 또는 exact-grade Grade 7 비교는 이번 검색에서 추가로 발견되지 않았다. 전역 문항 응답 분포를 학생의 학년 등급·개념 결손으로 해석하지 않는다. 원본 인쇄·정답·풀이 링크는 기존 연도/폼 카탈로그 그대로다.
- 관련 문서: `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`; source/data coverage 및 README 갱신. 다음은 2012 AMC 12B와 나머지 2012 10B 문항의 연례 보고서/결과 통계를 찾는다. No push, deployment, or Drive sync.
### 2026-11-05 · 연도별 AMC 응답표 웹 검색 후속

- 웹에서 2012 AMC 10B/12B 및 2016 AMC 8 자료를 다시 조사했다. 2012 AMC 10B는 이미 확보한 문항 외에 같은 35,086명 코호트 응답률의 재게시/검색 인덱스 결과만 확인됐고, 새 독립 문항·표본은 나오지 않았다. 2012 AMC 12B 전체 응시자 문항별 표도 찾지 못했다. 학년별 문항 응답은 페이지에서 제공되지 않으므로 전체 응답률을 7학년 진단처럼 해석하지 않는다.
- 2008 MAA 고교 결과집은 AMC 12A/B·AMC 10A/B 전체 응시자 응답표의 인쇄 페이지(252–255)를 특정하지만, 접근 가능한 미러에 읽을 수 있는 선택지 행이 없다. 수치를 추정하지 않고 해당 폼은 미확인으로 유지한다. 2016 AMC 8도 이번 검색에서 국가 문항 응답률/Grade 7 표는 추가로 회수하지 못했다.
- 상세 검색 경로와 제외 사유: `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. 새 숫자 데이터는 추가하지 않았다. `raw_youtube.txt` 보존. 다음은 연도·폼별로 실제 읽을 수 있는 MAA 보고서 표/공개 이미지가 있는 경로를 더 찾고, 원본 시험·키·풀이 카탈로그와 통계 커버리지를 계속 분리해 메운다.


### 2026-11-05 · 2005 AMC 10/12 네 회차 응답 통계 회수

- 2005 AMC 10A/B 및 AMC 12A/B의 전체 100개 문항 응답 분포를 Internet Archive 보존 원본 MAA PDF에서 회수했다. Apple Vision OCR을 페이지 이미지와 대조했고 모든 정답 표식을 LIVE 키와 교차 확인했다.
- CSV, 런타임 참조, 연도별 coverage, 조사 노트, 데이터 README를 갱신했다. 원본 퍼센트 정밀도와 분모를 유지했고 학년별 성취도/백분위로 환산하지 않았다.
- 검수 완료: 4폼×25문항이 각 LIVE 정답표와 전부 일치하고, 런타임 조회 100개·코호트 분모·coverage 25/25·원문 반올림 편차(최대 0.05%p)·미제공 unreadable=null을 확인했다. 중복 말미 행으로 빠져 있던 2010B의 23/25·24/25 coverage를 해당 연도 폼 행에 합쳐 매니페스트도 런타임과 맞췄다. 로컬 변경만; `raw_youtube.txt` 미추적 파일은 보존한다.

### 2026-11-05 · 추가 검색: 2008/2006 AMC 10/12 문항 응답표

- 2008 MAA 고교 결과집의 검색 가능한 목차는 전체 응시자 응답표 위치(pp. 252–255)를 확인해 주지만, 표의 A–E/공란 수치는 노출하지 않는다. StudyLib 직접 회수는 HTTP 403으로 끝났으며 우회하지 않았다.
- Ian Calaway 공개 아카이브의 “Full Text Available Here”는 2008 책자가 아닌 1968 샘플로 연결된다. MAA 2010 보고서의 2008 값은 과거 점수·학년 요약이며, 같은 보고서의 문항응답 Table IX는 2010 시험이므로 섞지 않는다. 2006년으로 추정한 Internet Archive URL은 404, CDX 정확 URL 검색은 빈 결과였다.
- 2006/2008 통계값은 추가하지 않았고 coverage는 `not-found` 유지. 다음에는 실제 페이지 스캔을 공개하는 다른 저장소/문서 ID를 찾은 후 정답 키와 분모를 확인한다. 상세 근거는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 추가했다.

### 2026-11-05 · AMC 10/12 연도별 원본 링크 검증

- LIVE by Po-Shen Loh의 AMC 10/12 2000–2025 연도·폼 104개에 대해 인쇄 PDF·정답·해설 총 312개 주소를 확인했고 모두 HTTP 200이었다. 2000–2001 단일 폼과 2021 A–D 폼 예외를 포함한다. 2006 AMC 10A 해설 페이지에는 MAA의 공식 이용 허가 문구와 문제지·답안·해설 링크가 있다.
- 이 연도/폼 선택과 원본 외부 링크는 기존 문제은행에 이미 연결돼 있다. 원문·해설을 복사하지 않고 LIVE의 허가된 링크와 연동한다. 2008 MAA 연례보고서 웹 텍스트로 2006 AMC 10/12 학년별 기록 평균 표도 기존 CSV의 2006행과 대조 확인했다. 코호트 평균은 당시 기록 학년 집계이며 현재 규준·백분위가 아니다.
- 2006/2008 전체 응시자 문항별 A–E/공란 응답표 수치는 여전히 회수되지 않아 coverage `not-found` 유지. 다음 검색은 이 표의 실제 스캔을 찾는 데 집중한다. 검색 근거와 경계는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`.

### 2026-11-05 · 웹 검색으로 2016/2017 응답표 커버리지 재확인

- 99CEF 2016 AMC 10A/12A 보고서의 색인 텍스트에서 Global 문항응답표(pp. 11, 22)를 확인했다. 10A n=65,999와 12A n=55,279, 각 25문항은 기존 런타임 및 coverage에 이미 들어 있고 LIVE 연도·폼 정답표와 대조 기록도 있다. 직접 PDF 요청은 현재 404이므로 중복 전사 없이 기존 등록분을 유지한다. 이 보고서는 2016 B폼 표의 근거가 아니다.
- 2017 AMC 10/12 A/B의 인쇄 시험·정답 검색 결과는 기존 연도/폼 카탈로그 링크와 중복이고, 전국 전체 응답표는 회수하지 못했다. 별도 487명 연구 표본은 2007–2011 기간 자료라 2017 연도별 규준으로 쓰지 않는다. 2008 MAA 보고서 검색 텍스트도 pp. 252–255 표 위치만 보여주며 응답 셀은 여전히 읽히지 않는다. 미회수 응답표에 수치는 추가하지 않았다.
- 상세 출처와 검색 한계는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`의 “2026-11-05 web search: 2016 response tables and 2017 gaps”. 이어서 다른 연도·폼의 원본 응답표를 검색한다. `raw_youtube.txt` 보존, push·배포·Drive 동기화 없음.

### 2026-11-05 · 2016 AMC 10B 인쇄 정답표 오기 보정

- 웹 대조에서 LIVE의 2016 AMC 10B 인쇄용 정답 PDF는 18번을 B로 표시하지만, LIVE 공개 정답 페이지·전문 풀이와 MAA 저작 2016 AMC 10B 해설 미러는 E로 표시하는 충돌을 확인했다. 문제의 양의 연속 정수 표현도 7개라 E가 맞다. GFIELD 자동 채점 참조는 이미 E였다.
- 문제 복습 화면에서 2016 AMC 10B를 선택하면 인쇄용 PDF의 18번 오기를 알리는 안내를 보이게 했고 스크립트 캐시 버전을 갱신했다. 브라우저에서 A형 화면에서 B형으로 바꿀 때 안내가 갱신되지 않는 점을 찾아 `formSelect.onchange`에도 안내 갱신을 연결했다. 수정 후 새로고침한 화면 검수는 남았다.
- 2016 AMC 10B/12B 공개 지역 결과 n=27/7은 전국 규준·문항응답 자료로 섞지 않았다. 연도 검색에서도 2008/2017 전국 문항응답 비율은 확보하지 못했다. 2010 AMC 10/12 응답표와 2008 AMC 12 평균/컷오프는 이미 기존 자료에 들어 있어 중복 추가하지 않았다. 근거와 직접 링크는 연구 노트의 “2016 AMC 10B key erratum and cohort boundary”, “annual summary search”. `raw_youtube.txt` 보존, push·배포·Drive 동기화 없음.

### 2026-11-05 · 2007 AMC 10/12 원 보고서 원문 대조

- Internet Archive에서 MAA 58th Annual High School Results and Awards 보고서 PDF를 회수했다. Apple Vision OCR과 인쇄 p.257 Table VII 페이지 이미지로 2007 AMC 10/12 A/B의 학년별 평균·인원수를 재확인했고, 기존 네 폼 CSV와 런타임 출처를 원 보고서로 바꿨다.
- 원문 대조 수정: AMC 10A ≤8/unknown 인원 3,659/8,207로 정정; AMC 10B 11학년 n=2, 평균 39.8 행 추가 및 grade coverage 업데이트; AMC 12B 9학년 평균을 인쇄값 76.9로 정리. 네 폼 학년 집단 n 합계가 공식 인원과 맞고 가중 평균이 폼 평균(67.9, 61.5, 66.8, 73.1)에 반올림 일치함을 확인했다.
- 보고서 인쇄 pp.262–265에 네 폼 전체 응시자 문항응답표가 있어 원문을 회수했다. 100개 문항 비율 전사와 LIVE 키 교차검증은 다음 단계이며 아직 runtime/csv에 넣지 않았고 response coverage는 계속 0/25다. 근거: `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`의 2007 section.
- `git diff --check` 통과, CSV/런타임 JSON의 2007 표본수·평균·원문 출처를 대조했다. `raw_youtube.txt`는 사용자 미추적 파일로 보존. 로컬 변경만, push·배포·Drive 동기화 없음.


### 2026-11-05 · 2007 AMC 10/12 문항별 응답분포 추가

- MAA의 58th annual report Table IX(pp.262–265)에서 AMC 10A/B·12A/B 네 폼의 문항별 A–E 선택률과 공란률을 연도·폼별로 전사했다: `boarding-school-math/competition/historical-amc-grade/amc10-12-2007-item-response.csv` (100행). Runtime reference와 paper coverage manifest를 연결해 네 폼 모두 25/25로 표시한다.
- 100개 별표 정답을 LIVE 해당 연도·폼 answer key와 대조했다. A–E 및 공란 비율은 원문 그대로 보존했으며 합계는 인쇄 반올림에 따라 99.93–100.07%다. 보고서에 별도 unreadable 비율은 없어 빈 값으로 둔다. 공식 응시자 cohort n: AMC12A 93,179; AMC12B 33,489; AMC10A 73,769; AMC10B 24,008. 이 응답률은 폼 전체의 과거 선택 경향이지 학년별 규준이나 단독 개인 진단 판정이 아니다.
- README와 출처 연구 기록을 갱신했다. `raw_youtube.txt`는 손대지 않는다. 다음 연도는 MAA 연례 원문을 계속 검색해 year/form coverage에 추가하고, 원문 응시분포와 답안 키가 일치할 때만 진단 자료로 연결한다.


### 2026-11-05 · 2008 AMC 10/12 문항별 응답분포 추가

- MAA 59th annual report의 Table IX(pp.252–255)에서 2008 AMC 10A/B·AMC 12A/B 전 문항 선택률과 공란률을 전사해 `amc10-12-2008-item-response.csv`에 저장했다. 100개 별표 정답을 LIVE 키와 대조했고 runtime 및 year/form coverage를 네 폼 각각 25/25로 갱신했다.
- MAA 공식 응시자 수와 맞춘 분모: AMC10A 68,101; AMC10B 34,803; AMC12A 78,560; AMC12B 41,609. 인쇄 비율은 그대로 유지하고 별도 미판독률은 보고서에 없어 비웠다. 이 자료는 폼 전체의 역사적 응답 경향이며 학년별 규준은 아니다.
- manifest의 2007·2008 네 폼이 각각 중복 없이 한 행씩 있고 연도순으로 들어가는지, runtime/CSV의 2008 100행과 문항 순서를 확인한다. 기존 `raw_youtube.txt`는 그대로 둔다. 다음은 MAA 연례보고서에서 2009 이후 연도를 이어 찾는다.


### 2026-11-05 · 2009 AMC 10/12 item-response source search

- MAA annual-summary search confirms the 2010 report contains 2009 AMC 10/12 grade/score summary rows, but its Table IX item-response distributions are for 2010. Found 2009B response tables embedded in school-result reports for Temasek and Barker College; their local cohorts are not interchangeable with the national official-student cohort. Did not import them or label them national. Research note has sources and search boundary.
- Next: search for a 2009 form-level all-official response table or a well-documented regional report whose population can be labeled honestly; keep AMC original exam, answer, solution, and item-diagnostic sources attached by year/form.

### 2026-11-05 · 2009 AMC 10/12 web-source follow-up

- Web search found multiple 2009 AMC 10/12 B school-result PDFs on Math Oasis. The Temasek AMC 10B table is n=89 (grades 9–10); other opened school reports show n=16 or n=1. These are local school cohorts, not national annual distributions, so no rates were copied into the diagnostic reference.
- The 2010 MAA annual summary search result again exposed the already-staged recorded-grade means for 2008–2009. No new national table was recovered. The 2009 form-level item-response coverage stays `not-found`; evidence and source links are recorded in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`.
- Next: continue year/form web search for national published response tables and usable primary scans. Keep school/venue samples separate from national results. Preserve `raw_youtube.txt`; no external sync or publishing.
# Progress update · 2026-11-05

### 2026-11-08 · 2019 AMC 12A overall score report recovered

- The 2020 TestDaily article links a distinct 2019 AMC 12A `Contest Score Report` image. Apple Vision OCR and visual inspection verified the printed score boundaries, mean 49.22, SD 20.80, 34,476 students, 1,872 schools, high score, and perfect-score count. Added the whole-cohort fields to the AMC score lookup and a source row to `amc12a-2019-maa-score-distribution.csv`; this is not grade-level evidence and the image does not state geographic scope.
- Static CSV/runtime/source cross-check passed for all report fields; `git diff --check` passed. The paper-review display and script cache version were updated to surface the report's perfect-score count and data-as-of date when present. No browser QA or broader tests were run. Preserve untracked `raw_youtube.txt`; no push, publishing, or Drive sync.

### 2026-11-08 · 2021 Spring AMC participant totals from web research

- Web-opened the TestDaily 2021 Fall MAA-statistics analysis and verified Spring totals in its contest-count sections: AMC 10A/B 24,817/19,179 and AMC 12A/B 16,887/13,677. Added them to the corresponding 2021A/2021B whole-cohort score-reference rows, with a linked corroborating source and a note that geographic scope is unspecified.
- These totals are not grade samples. They add cohort-size context only; 2021 Spring exact-grade charts and item-response tables remain unrecovered. 2020 B exact-grade charts also remain an open search target. Fall 2021 C/D grade and item-response data stay separate.
- Validation: focused source-row assertions passed for all four counts and their TestDaily link; CSV coverage assertions confirmed Spring A/B remain `no-grade-table-recovered` while Fall C/D remain staged; `git diff --check` passed. Follow-up web queries for 2021 Spring grade reports and 2020 B grade charts returned no qualifying source. Preserve untracked `raw_youtube.txt`; only commit relevant tracked files. No push, publishing, or Drive sync.
- A second focused search for 2020 AMC10B/12B grade-percentile and item-response charts returned original-paper/answer/solution pages, score summaries, and the already-recovered 2020 A grade charts, but no complete B-form cohort tables. The research note now records this search boundary; 2020 B grade and item-response coverage remains open.

- Recovered the 57th MAA annual report from the Internet Archive and cross-checked every 2006 AMC 10/12 grade-group count and mean (22 records across 10A/B and 12A/B) against original Tables I–II. Counts sum to each published U.S. National Statistics total, and weighted means reconcile to the printed overall mean. Updated the data and coverage source links to the MAA report.
- Web search reconfirmed the 2004 AMC 8 item response table in a MAA-attributed Scribd scan. The LIVE key matches all 25 starred answers. Its Q1 rates sum to 99.74%, so that item remains excluded from runtime comparisons; the remaining eligible items are year-matched cohort context. MAA's 56th Annual report independently confirms the 154,590 cohort and recorded-grade averages, but does not include the item-choice table. The question-level source stays labeled as a secondary scan.
- Search notes and provenance distinctions are recorded in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md` and the historical AMC README.
- Validation performed: direct row/count/weighted-mean checks and `git diff --check`. No tests or browser review were run in this pass. No external sync or publishing was performed.
- Next: continue web search for primary national response tables in missing AMC years/forms (especially 2002–2004 AMC 10/12 and 2009), keep local/school cohorts separate, and add exact source/reconciliation notes before importing any found values.

### 2026-11-05 · 2004 AMC 10/12 response data from web archive

- Recovered the MAA-authored 56th annual report from Internet Archive. Added all 25 U.S. official-student response rows for AMC 12A (n=103,237, published mean 73.9) and AMC 10A (n=81,122, mean 69.1); OCR/page-image checks, LIVE key matches, response row sums, and implied means were reconciled.
- Found but rejected nearby bad source tables: AMC 10B's option shares total about 10% per row and fail the annual mean cross-check; a report table titled “2003 AMC 12B” has answer-key conflicts. Both are recorded as source-found-rejected in coverage. 2009 local school PDFs are not national cohorts; do not import them as whole-contest diagnostics.
- Search/evidence details in `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. Static data validation and local commit remain. Preserve untracked user file `raw_youtube.txt`; no push, deployment, or Drive sync. Continue year-by-year web search, especially early 2000s and 2009.
- New search lead: MAA's published AMC 10 Volume VIII and AMC 12 Volume IX cover 2000–2007 and include submitted-answer frequency tables (MAA review/catalog confirms this). These are copyrighted works; no third-party book scan was used. Obtain an authorized copy or continue seeking equivalent public annual-report tables before transcribing those years.
- Follow-up source audit: Table XI-B's “2003 AMC 12B” title and its response rates do not produce usable data: only 5/25 marked keys match LIVE, and applying LIVE's actual key produces 48.91 versus MAA Table I's 76.6 mean. The rejected-source note and manifest now record this stronger contradiction; no rates were imported.

### 2026-11-05 · 2002 AMC 12A 인쇄 정답 오류 채점 반영

- MAA/AMS *Contest Problem Book VIII* 웹 원문 후기가 2002 AMC 12A에서 오답 선택지 `N < 1`이 `N > 1`로 인쇄되어 정답이 둘이 됐다고 명시한다. LIVE 키와 MAA/AMS 풀이의 canonical answer는 D지만, 인쇄본에서 A도 참이므로 답안 입력 A/D 모두 정답 처리.
- 연도·폼·문항 범위의 정오표 CSV를 추가하고 생성기에서 canonical 키 D와 추가 인정 답 A를 따로 저장하도록 했다. 종이 시험 리뷰의 자동채점 및 문항 상세가 A/D 인정과 인쇄 오류 표시를 따른다. 과거 점수 규준/응답률 자료는 수정하지 않았다.
- 생성기를 실행해 6,500개 답안/266개 폼의 브라우저 참조를 재생성했다. `git diff --check` 통과. 테스트는 요청되지 않아 실행하지 않았다. `raw_youtube.txt` 보존; 변경은 로컬만이며 push·배포·Drive 동기화 없음.
- 근거: https://www.ams.org/books/prb/019/prb019-endmatter.pdf 및 https://live.poshenloh.com/past-contests/amc12/2002A. 다음: MAA 원 연례보고서의 2009 이후 문항별 응답분포와 2002–2004 누락 폼을 연도·폼 단위로 계속 검색.


### 2026-11-05 · 웹 검색으로 2002 AMC 12A/B 응답표 회수

- MAA 발행 *Contest Problem Book IX*에서 2002 AMC 12A/B의 25문항 선택지 응답률을 웹 검색으로 찾아 CSV, lookup, coverage manifest에 추가했다. 책 인쇄면 77/85; 읽을 수 있는 PDF는 제3자 호스트라 출처 상태에 그대로 표시한다. 원표에는 분모와 지역 범위가 없어 UI에서도 응답자 수 미공개로 표기한다.
- 50행 모두 비율 합계가 반올림 오차 내 100%이고, LIVE 답안키 50개와 대조했다. 2002 채점 방식으로 분포에서 얻은 평균은 12A 72.6742, 12B 80.8003으로 MAA 보고 평균 72.7/80.8에 일치한다. 12A 14번은 문항 오탈자 정오표에 따라 A/D 둘 다 정답률에 포함하되 공식 canonical key D는 유지한다. 분모 미공개 자료에서도 review 화면이 오류 없이 표시되도록 전체 응답자 수 표시를 조건화했다.
- 관련 README·연구 노트를 갱신했다. 코드 테스트는 실행하지 않았고 `git diff --check`와 수동 집계/답안대조만 남았다. `raw_youtube.txt`는 보존, 로컬 변경만 유지한다. 다음 작업: 2003–2007 AMC12 A/B를 같은 권의 표와 교차검증해 연도별로 연결하고 AMC10 Volume VIII 및 2009 누락 폼을 웹에서 계속 찾는다.
- 자료: [MAA book announcement](https://old.maa.org/sites/default/files/pdf/pubs/apr08web.pdf), [third-party searchable Volume IX](https://www.toomates.net/biblioteca2/contestproblembooks/TheContestProblemBook9.pdf), LIVE 2002 [12A](https://live.poshenloh.com/past-contests/amc12/2002A/answers) / [12B](https://live.poshenloh.com/past-contests/amc12/2002B/answers).

### 2026-11-05 · 2003 AMC 12A/B 응답표 연도별 자료 추가

- 같은 MAA 발행 *Contest Problem Book IX*에서 2003 AMC 12A/B 문제별 선택률 표를 확인해 `amc10-12-2002-2003-item-response.csv`로 연도 구분 저장했다 (인쇄 pp.94,105). 제3자 호스트 검색 가능한 사본이라는 출처 범위와 분모·지역 비공개를 기록했다.
- 50개 비율 합계와 LIVE 정답키를 확인했다. 분포에서 계산한 점수평균은 12A 77.786, 12B 76.535이며 기록 학년별 MAA 평균 가중값 77.762/76.599와 0.07점 이내로 맞는다. 2004 연례보고서의 잘못된 2003B 표는 계속 거부 상태이고, 이번 건은 독립된 책의 표다.
- 기존 README·출처 연구 노트·coverage manifest를 갱신했다. 다음은 Volume IX의 2004–2007 AMC12와 Volume VIII의 AMC10을 연도별로 확인한다. 이 패스는 코드 테스트 없이 원문 전사, 키/합계/평균 대조 및 `git diff --check`만 수행한다. `raw_youtube.txt` 미수정, 외부 동기화·게시 없음.


### 2026-11-05 · 2004 AMC 12B 응답분포 복구

- MAA *Contest Problem Book IX* 인쇄 p.125의 올바르게 제목 붙은 2004 AMC 12B 표를 찾아 25문항 원응답률을 별도 `amc12b-2004-bookIX-item-response.csv`와 런타임에 저장했다. 앞서 2004 연례보고서에서 거부한 잘못된 “2003 AMC 12B” 표와 다른 자료다. 이전 표는 계속 rejected; 이번 표는 LIVE 키 25개가 맞는다.
- 응답률 합계는 100% 이내 반올림 오차, 분포에서 나온 평균 84.451과 MAA 기록 학년평균 가중값 84.495는 0.05점 차이다. 책에 응답자 수/지역 범위가 없어 미공개 처리했다. Coverage 2004 12B를 25/25 complete로 갱신하고 provenance/주의 문구를 보강했다.
- 다음은 같은 책의 2005–2007 AMC12 A/B 원표를 웹에서 회수한다. `git diff --check`만 실행했으며 테스트 스위트 미실행. `raw_youtube.txt`는 보존한다.

### 2026-11-05 · 2005 AMC 12A/B 응답분포 추가

- MAA *Contest Problem Book IX* p.134/144에서 2005 AMC 12A/B 문항별 응답률 50행을 찾아 `amc12-bookIX-item-response-2002-2007.csv`, lookup, coverage manifest에 추가했다. 표본 분모와 지리 범위는 미공개다. 정답키 50개가 LIVE와 일치하고 비율합은 반올림 범위에서 100%다.
- 문항률 점수 평균 78.800/83.390, MAA 기록 학년별 가중 평균 78.720/83.382로 거의 일치한다. 이 대조는 신뢰도 보조 확인이며 동일 표본이라는 뜻은 아니다.
- README/연구 기록 추가. 2006–2008은 더 나은 MAA 연례보고서 원자료가 있어 book 중복은 추가하지 않는다. 계속 2002–2009의 남은 AMC10/12 폼을 검색한다. 테스트 미실행, `git diff --check` 예정, `raw_youtube.txt` 보존.

### 2026-11-05 · 2009 AMC 원문 통계 및 2001–2002 AMC 8 응답표 재검색

- MAA 작성 2010 AMC 10/12 Results Summary에서 2009 A/B의 전체 평균과 기록 학년 통계는 확인되지만, 문항별 응답표는 2010 폼만 싣는다. 2009 AMC10/12 문항응답 coverage는 `not-found`로 유지하고 학년 평균 데이터만 기존 회차 자료로 쓴다. 2009 학교별 성적 문서는 전국 집단과 섞지 않는다.
- 2001–2002 AMC 8 검색에서도 원본·정답·풀이만 확인했고 국가 문항 응답률 표는 새로 찾지 못했다. 세부 출처·범위는 `AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md` 마지막 절에 기록.
- 다음: 문항 응답 coverage manifest에서 남은 미회수 연도·폼을 연도순으로 조사한다. 실제 응답표를 찾으면 원문 회차, 키, 퍼센트 합계, 가능한 경우 기대 평균을 모두 대조한 뒤 런타임에 추가한다. `raw_youtube.txt` 보존; push·배포·Drive 동기화 없음.

### 2026-11-05 · 2021 AMC 10/12 문항응답 분포 재검색

- 2021 AMC 10/12 A/B에 대해 전국 A–E/공란 응답표를 검색했다. 공개 답·풀이와 전체 점수/AIME 기준 링크는 확인됐지만 보기별 참가자 응답률은 회수하지 못했다. 해설 문구나 총점 분포를 문항 오답률로 취급하지 않는다.
- 네 2021 폼은 원본 시험지 학습 링크가 완비된 상태이고, 문항별 비교는 data coverage상 미회수다. 자세한 검색 범위와 링크는 `AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`의 2021 절.
- 다음은 coverage manifest의 미회수 폼을 연도순 조사한다. 실제 표 발견 시 원문·정답·비율합·기대평균을 검증한 뒤 추가. `raw_youtube.txt` 보존, push·배포·Drive 동기화 없음.

### 2026-11-08 · AMC 연도/회차 통계 연결 오류 수정 및 웹 재검색

- 2021 Fall MAA grade-score percentile 표가 LIVE canonical 2021 C/D(가을 공개 A/B)만을 대상으로 함을 TestDaily 원문과 LIVE 연도별 페이지로 재확인했다. Coverage manifest에서 AMC 10/12의 봄 A/B를 `no-grade-table-recovered`로 고쳤고, 가을 C/D 표는 유지했다. 런타임 percentile rows와 item-response manifest는 이미 canonical C/D로 정확히 연결되어 있었다.
- 2021 가을 보고서는 봄 회차의 전체 응시자 수/일부 평균을 함께 언급하지만 학년별 점수표는 아니다. 별도 웹 검색 결과, 2020 B형은 AIME/전체 점수선 및 Bard 소규모 학교 표본만 재확인했고 국가 단위 학년별 차트는 찾지 못해 미회수 상태를 유지했다. 검색·범위는 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 기록했다.
- 검증: `git diff --check`; 2021 AMC 10/12 A/B coverage에 grade percentile 출처가 없고 C/D만 TestDaily 출처를 갖는지 CSV assertion 통과. 테스트 스위트와 브라우저 검수는 이번 변경에서 실행하지 않았다. `raw_youtube.txt`는 그대로 두고, 다음 단계는 미회수된 2021 봄 학년별 자료 및 2020 B 전국표를 계속 찾은 뒤 다른 해의 회차별 응답/학년 자료를 연도순 조사하는 것이다.
### 2026-11-08 · AMC 2020 A/B score reports transcribed; annual paper routes rechecked

- Web search rechecked the existing 266-row AMC 8/10/12/AIME source catalog. Each listed year/form has separate routes for printable paper, answer key, and solutions. LIVE states MAA permission for its archive; GFIELD links rather than copying complete papers.
- Transcribed all four 2020 AMC 10A/10B/12A/12B MAA score report charts reproduced by TestDaily and Sohu using Apple Vision OCR and visual review. Data are in `amc10-12-2020-maa-score-distribution.csv` and the runtime reference.
- The 10A/10B charts print 103.5/102 beneath `Top 2.5%`; 12A/12B print 87/87 beneath `Top 5%`. Cutoff sources identify these as AIME cutoffs, distinct from actual Top 5% distinctions 105/103.5/100.5/97.5. Runtime excludes the four cutoffs from percentile comparison while CSV audit columns retain the printed fields. Reports do not state geography and are not grade norms.
- Static validation confirms both CSV rows/fields, the 266-row source catalog's printable/key/solution routes, runtime values, and cache versions; `git diff --check` passes. Browser QA remains unverified; no push, deploy, or Drive sync. Keep `raw_youtube.txt` unstaged.
### 2026-11-08 · 웹 검색: 2017 AMC 전체 응시자 수 추가

- Think Academy/Think Matrix 공개 역사표에서 2017 AMC 10A/B·12A/B 전체 참가자 수 53,169 / 25,919 / 44,915 / 23,439명을 확인해 점수 참조 런타임에 반영했다. AMC 10 평균 및 DHR은 MT100 연도표와 교차 확인했다. 해당 표의 지리적 범위는 따로 설명되지 않아 지역 미상 전체 회차 참고로 표기한다.
- 2017 AMC 12A 평균은 기존 공개 표 56.99 대 60.32 충돌이 있어 계속 숨긴다. 참가자 수는 평균 충돌을 해소하지 않으며, 학년별·문항별 데이터로 전용하지 않았다. 상세 출처/제한은 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`.
- `git diff --check`와 네 연도·폼 참조 값 대조만 수행. 사용자 미추적 `raw_youtube.txt` 보존. 로컬 변경만, push·배포·Drive 동기화 없음.

### 2026-11-08 · 웹 검색: 2025 AMC 8 학교별 문항 결과

- Strath Haven Middle School의 2025 MAA Grade Report 공개 재게시본을 웹에서 확인했다. 전체 학교 코호트 n=46, 평균 12.37/25, 문항별 정답 인원 25개를 CSV로 따로 저장했다. 원문 LIVE 정답키 25개와 대조했고 표시된 정답 인원 평균은 12.37로 보고서 평균과 맞는다.
- 데이터: `boarding-school-math/competition/historical-amc-grade/amc8-2025-strath-haven-school-item-correct.csv`. README와 검색 기록에 출처/제한 추가. 이는 단일 학교, 학년 미분리, 선택지별 오답 분포 미제공 자료라 전국 규준·학년 비교·개별 오개념 판정으로 사용하면 안 된다. AMC 연도별 인쇄 시험·정답·해설은 기존 266행 연도/폼 카탈로그의 LIVE 허가 링크에 정리돼 있다.
- MAA overall 2025 점수 참조는 이미 79,524명/평균 11.74로 들어 있다. Scribd 재게시 요약의 79,511명은 불일치라 대체하지 않았다. 다음: 구 MAA score-report의 학교별/학년별 데이터가 공개 검색 가능한 경우에만 같은 코호트 경계를 유지해 누적하고, AMC10/12 원본의 연도·폼별 회차 카탈로그와 overall/grade/item coverage를 별도로 보강한다.

### 2026-11-08 · 2026 AMC 10A·12A 화면 연결

- 공개 웹 자료를 연도별 시험 선택기와 인쇄/정답/풀이 액션에 연결했다. MAA 일정의 11월 5일 A형, 11월 13일 예정 B형을 반영해 2026은 현재 A만 노출한다. 10A·12A 자료 페이지, 문제 PDF, 키 이미지가 모두 HTTP 200이다.
- 공개 키 이미지를 Apple Vision OCR 후 시각 대조해 각각 25개 답안을 등록했다. JavaScriptCore 확인에서 시험 선택, 출처 표시, 자동 채점 키 길이, PDF·풀이 링크를 확인했다. Third-party 자료임을 분명히 적고 LIVE 공식 아카이브로 잘못 부르지 않는다. 2026 개별 문항 LIVE 경로는 없으므로 통합 풀이 자료를 연다.
- 추가 확인 중 `archiveRoute`와 `problemRoute`의 2026 분기에서 `selectedYear`가 선언되지 않은 참조 오류를 발견해 수정했다. 웹 화면용 답안 안내도 출처가 바뀌어도 맞도록 “해당 회차 공개 답안 키”로 고쳤다. `git diff --check` 통과. 실제 브라우저·프린트 미리보기 검수는 미실행.
- 변경 경로: `boarding-school-math/competition/amc-original-paper-library.js`, `amc-original-answer-key-reference.js`, `competition-paper-review.js/.html`, `docs/AMC_YEARLY_SOURCE_CATALOG.md`, `docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. 사용자 자료 `raw_youtube.txt`는 그대로 둔다. 다음: 2026B가 공개되면 등록 후 연결, 그리고 2026A 학년별/전국 진단 비교 자료가 공개되는지 연도별로 조사한다.

### 2026-11-08 · 2026 AMC A형 문항 개념 crosswalk

- Random Math Wiki 공개 2026 AMC 10A/12A 문제·풀이 색인을 참고해 GFIELD 편집자 작성 개념 태그 50개를 연결했다. 문항 문장·선지·풀이 과정은 저장하지 않는다. 문제 리뷰 결과에는 third-party source label과 교사 검토 필요 표시가 뜬다.
- 기존 AMC 10 창작 후속 연습은행에서 exact `sourceConcepts` 태그가 확인되는 문항은 10A 24/25, 12A 22/25다. 네 문항은 선택된 수학 영역의 일반 연습으로 이어진다. 이 비율은 연습 태그의 분류 연결 상태이며 진단 타당도/실력 등급이 아니다.
- 파일: `competition/amc-original-item-concept-reference.js`, `competition-paper-review.js/.html`, `boarding-school-math/README.md`, `docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`. JavaScriptCore에서 10A/12A 각각 25문항 모두 reference lookup, source URL, domain, label 연결을 확인했다. 정적 점검에서 exact authored-tag match는 24/25와 22/25이며, 미래 B 폼은 계속 빠져 있고 2025 참조도 그대로다. `git diff --check` 통과. 브라우저·인쇄 미리보기는 별도 미검수. 사용자 자료는 보존한다.
- 이어서 연도/폼 선택기에서 불러오는 268회 전부(6,550문항)의 문항 개념, 공개 답안 키, 문제 형식별 문항 수를 JavaScriptCore에서 전수 대조했다. 누락 0건. 이는 메타데이터 연결 완전성을 뜻할 뿐 진단 분류의 타당성을 뜻하지 않는다. `docs/AMC_YEARLY_SOURCE_CATALOG.md`와 출처 조사 기록에 남겼다.

### 2026-11-08 · 웹 검색: 2021 Spring AMC 10/12 학년별 결과 재조사

- 2021 봄 10A/10B/12A/12B의 MAA 연례 보고서·성적표 검색어, MAA `generalreports.aspx`, 공개 역사 통계를 다시 조사했다. 검색으로 회수한 Think Academy·Hanlin 자료는 회차 전체 평균 및 컷/수상 기준이며, 정확한 학년별 표본 수·평균·백분위가 아니다. MAA 보존 메뉴의 해당 봄 A/B 항목은 본문 보고서가 저장되지 않았다.
- Grade percentile 차트는 2021 가을(C/D)로 명시되어 있어 봄(A/B)에 전용하지 않았다. 네 봄 회차의 `no-grade-table-recovered` 상태를 유지하고 근거/검색 범위를 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 남겼다.
- 회차별 문제지·정답·풀이 연결은 학년 자료 공백과 별도로 유지된다. 다음 우선순위는 공개된 원보고서/통계의 추가 회수이며, 지역·학교 표본을 전국 또는 학년 규준으로 합치지 않는다. 사용자 원자료 `raw_youtube.txt`는 보존한다.


### 2026-11-08 · 웹 검색: 2026 AMC 10A·12A 원본 학습자료 링크 추가

- MAA 일정에서 AMC 10A/12A 시행일(2026-11-05), 10B/12B 예정일(2026-11-13)을 확인했다. 11월 6일 게시된 Think Academy의 2026 AMC 10A/12A 페이지와 PDF를 열어 각 문제지가 25문항임을 확인했다. 각 페이지는 문제 PDF와 정답 키 이미지, 풀이 PDF를 연결한다. 12A 풀이 자료는 Q1–15와 Q16–25 두 PDF로 나뉜다.
- 연도별 카탈로그에 2026 AMC 10A와 AMC 12A 두 행을 추가했다. 아직 MAA/LIVE 공식 과거 시험 아카이브에 올라온 자료로 확인하지 못했으므로 제3자 재게시로 출처를 명시하고 공식 페이지가 생기면 바꿀 후속 항목으로 기록했다. 전체 PDF/문항 텍스트는 저장소에 복사하지 않았다.
- README·연도별 카탈로그 문서·검색 기록을 갱신했다. 남은 작업은 11월 13일 B회차 시행 뒤 원본·정답·풀이를 찾아 10B/12B 추가, 그리고 2026 회차의 공개 MAA 점수·학년·문항 응답 자료를 모집단을 구분해 보강하는 일이다. 원본 링크와 연도별 이력은 `boarding-school-math/competition/amc-original-source-catalog.csv`, `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 있다.
- 268행 카탈로그 CSV 파싱 및 중복 회차 검사를 통과했다. 일곱 PDF/키 URL 모두 HTTP 200이며 CRLF CSV를 고려한 `git -c core.whitespace=cr-at-eol diff --check`가 통과했다. `raw_youtube.txt`는 보존하고 이번 커밋에서 제외한다.

### 2026-11-08 · 웹 검색: AMC 8 최신 학년별 비교 출처 확인

- 2023–2026 MAA AMC 8 whole-cohort score report 경로를 확인했다. 연도별 전체 분포·참가자 수는 런타임 데이터에 이미 있지만, 공개 재조회에서 학년별 전국 평균·백분위 표는 회수하지 못했다. 학년별 비교 공백은 `no-grade-table-recovered`로 유지한다.
- 2026 SMO Malaysia 수상자 목록은 이름·학년·점수가 공개된 선택형 명단이라 전체 응시자 규준으로 쓸 수 없다. 2025 Strath Haven 자료는 단일 학교 n=46의 문항별 정답수이며 grade split·오답 선택지 분포가 없다. 두 모집단을 전국/학년 자료와 혼합하지 않는다.
- 출처 및 범위 판단을 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 기록했다. 다음 작업은 AMC 8/10/12/AIME 원본 카탈로그와 별개로 item-response coverage 미회수 연도를 순서대로 검색하고, 온전한 연도·시험형 전체 표를 발견한 경우만 대조·등록하는 것이다. `raw_youtube.txt`는 건드리지 않고 push·배포·Drive 동기화는 하지 않는다.

### 2026-11-08 · 2010 MAA High School Summary 채점·진단 대조

- MAA 2010 AMC 10/12 High School Summary의 Table I/II 점수·학년 평균, Table IX 전체 공식 응시자 응답, Table XI AIME 진출자 응답의 범위를 구분했다. Table XI는 고득점 선택 표본이며 전체 또는 학년 규준이 아니다. 2010 응시에서 정답 6점, 공란 1.5점, 오답 0점 배점과 연도별 정답키를 적용한다. 사용자 답을 채점한 점수, MAA 전체 평균·기록 학년 평균, 당시 AIME 기준점은 서로 다른 정보로 보여준다. 개념 태그는 MAA 응답표가 아니라 LIVE 문항 crosswalk에서 온다.
- Table XI 네 폼을 보기에 따라 집단 선택기로 연결했다. 보기 분포에는 표본 수와 출처 범위를 보이고, 개인 개념 원인이나 AIME 진출 가능성 판단에 사용하지 않는다고 명시한다. 점수 요약/문항 구간, 문항 영역, 표시한 오답·공란, GFIELD 창작 AMC 연습 연결까지 화면에서 확인했다.
- 원문과 LIVE 답안키 전수 대조에서 2010 AMC 12B Q24 오답키/응답률 오기재를 발견해 C 정답 및 A/B/C/D/E = 2.59/3.79/9.42/2.21/0.63%, 공란 81.37%로 고쳤다. 네 폼 100개 문항이 모두 정답키와 일치하고 25행씩 연결된다. 표에 인쇄된 반올림 응답률은 총합 100%에서 최대 0.20%p 차이가 있다.
- 로컬 브라우저에서 2010 AMC 12B 입력 흐름을 실행했다. 23정답·1오답·1공란은 역사적 채점 공식으로 139.5/150으로 계산됐고, Table XI 표본 n=3,270, 전체 평균 59.8, Grade 10 평균 63.1(n=3,210), AIME 기준점 88.5가 분리 표시됐다. 오답/공란은 Q14/Q24 응답분포·문항 개념·G·MAP 창작 연습으로 연결됐다. 학습자 기록은 저장하지 않았다. `git diff --check`와 JavaScriptCore 100문항 키/행/응답률 대조 통과. Node.js 부재로 테스트 스위트는 실행하지 않았다.
- 로컬 작업만 수행. `raw_youtube.txt`는 보존·미추적 상태이며 커밋 제외. push·배포·Drive 동기화 없음. 다음은 HS Summary 자료가 있는 다음 연도/시험형을 연도별로 찾아 전체 응답/진출자 응답·점수/학년 요약을 모집단 구분과 함께 더 연결하는 일이다.

### 2026-11-08 · 2011 MAA AMC 10/12 통계 PDF 재확인

- 예전 `2026-11-05 · 2011 AMC 10/12 B형 문항 응답표 검색` 항목의 “응답표 미회수”는 현재 상태와 맞지 않아 이 결과로 대체한다. Internet Archive에 보존된 MAA 2011 통계 페이지가 [Item Difficulty PDF](https://web.archive.org/web/20130121072809id_/http://amc.maa.org/amc1012/2011/stats/11AMC1012-itemdiff.pdf)와 [Score Distribution PDF](https://web.archive.org/web/20130121074149id_/http://amc.maa.org/amc1012/2011/stats/11AMC1012-scoredist.pdf)를 연결한다. 당시 페이지의 실제 링크도 확인했다.
- Apple Vision OCR와 PDF 페이지 이미지로 Item Difficulty 표 네 폼을 다시 확인했다. 런타임 응답표 100행은 LIVE 정답키 100개와 일치한다. 보기·공란·판독 불가 비율 합계의 최대 차이는 인쇄 반올림 기준 0.02%p다. 재구성 평균은 AMC 10A 67.6968, 10B 72.2124, 12A 66.8274, 12B 64.9398로 MAA Grand Statistics의 반올림 평균 67.7, 72.2, 66.8, 64.9에 맞는다.
- B형 Item Difficulty 표는 “All Participants”라고만 하고 응답 분모를 밝히지 않는다. Grand Statistics의 공식 학생 수 33,723/30,846명을 문항별 분모로 넣지 않는다. 기존 런타임·coverage에는 B형 25문항이 이미 들어 있다. Score Distribution PDF는 발견했으나 이번에는 그래프 수치를 새로 전사하지 않았다. 브라우저 검수는 Mac 잠금으로 진행하지 않았고, 정적 JavaScriptCore 키·표본·합계·평균 대조만 했다.
- 출처 조사 세부사항: `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`의 2011 절. 이 확인에서는 코드 데이터 변경이 없으며 사용자 파일 `raw_youtube.txt`는 그대로 보존한다.

### 2026-11-08 · 2013 AMC 10B/12B Taiwan response cohorts

- Added the Taiwan item-response tables printed in the GEMT 2013 analysis report, kept as separate populations beside the existing Global tables: AMC 10B n=1,396 (printed p.10) and AMC 12B n=1,194 (printed p.19), 25 questions each. Added the runtime selector entries and export CSV `boarding-school-math/competition/historical-amc-grade/amc10-12-2013b-taiwan-item-response.csv`; updated the review-page cache version and coverage notes.
- Runtime verification against the AMC answer-key reference found 25/25 matching keys for each form. A–E, omitted and unreadable rates summed to 100% within source rounding. Response-derived means were 86.88/150 and 70.77/150, matching the GEMT report values 86.9 and 70.77. The data are a Taiwan cohort, not U.S. or grade-specific norms.
- Rechecked the 2010 AMC 12B HS Summary interpretation: 23 correct, Q24 A incorrect, Q25 blank gives 139.5/150 under the 6/0/1.5 scoring. Q24 distribution separates the 40,750 all-official-student cohort from the 3,270 AIME-qualifier cohort. Grade 10 mean 63.1 (n=3,210), overall mean 59.8, and AIME qualifying score 88.5 are historical report context, not a current grade-level prediction. Concept-domain tags are a GFIELD crosswalk; the report's response distribution cannot establish an individual misconception. Diagnostic area rates require at least three attempted tagged questions, and any selected error reason is learner-entered.
- `git diff --check` passes. No browser visual audit performed in this pass. Preserve the untracked user file `raw_youtube.txt`; do not include it in a commit.

### 2026-11-08 · 2009 AMC 10/12 item-response source search

- Re-searched the missing 2009 AMC 10A/10B and AMC 12A/12B national item-response tables. The 2010 MAA summary provides prior-year aggregate statistics but its detailed item-response tables are for 2010. The 2008 annual report is for 2008, even though it lists February 2009 as the next contest dates.
- Search found 2009 B school reports with item tables for cohorts such as Temasek SS (n=89), Madrasah Al-Irsyad (n=16), Anglo-Chinese (n=31), and Changkat Changi (n=10). These are local venue/school samples and are not used as national response distributions. Coverage stays `not-found`; source search and rationale are in `docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`, and manifest notes are updated.
- `git diff --check` passes. `raw_youtube.txt` remains untracked and untouched; no push, deploy, or Drive sync.


### 2026-11-08 · 2014 AMC 12A Q25 원문 불일치의 투명한 처리

- 원본 99CEF PDF의 렌더링 페이지에서 Q25의 인쇄 미응답률 `8.49%`를 재확인했다. A–E 선택률과 판독불가율의 합은 `18.50%`라 행 전체가 `26.99%`만 설명한다.
- CSV와 런타임은 원문 `8.49%`를 그대로 보존하고 `runtime_inferred_omitted_percent=81.50`을 별도 파생 필드로 저장한다. 이 값은 100%에서 인쇄된 A–E 및 판독불가 비율을 뺀 잔여율이다.
- 진단 요약은 해당 문항을 표시할 때 원문 값과 계산값을 함께 알린다. 정답 키 B와 다른 응답률은 수정하지 않았다. README와 연구 노트에 계산 방식 및 한계를 기록했다.
- 검수: Node REPL에서 Q25 정답 B, 원문 8.49%, 계산 미응답 81.50%, 선택률+미응답+판독불가 합 100%, 두 모집단 선택지를 확인했다. CSV는 25행/18열과 원문·파생 필드를 확인했고 `git diff --check`를 통과했다. 브라우저 UI는 요약 문구 정적 대조까지 진행했다. 변경은 로컬에서만 커밋한다. `raw_youtube.txt`는 그대로 둔다.


### 2026-11-08 · 2015 AMC 10A Taiwan 응답 코호트 연결

- 99CEF 2015 분석보고서 보존본에서 p.12 Taiwan 응답표 25문항을 확보했고 p.6에서 n=5,087, 보고 평균 84.52를 확인했다. 현재 원본 주소가 2016년 보고서로 이동해 Internet Archive 2016-04-06 PDF를 사용했다.
- 25개 정답표시를 LIVE 답안키와 대조했다. 6/0/1.5 채점으로 응답률에서 계산한 평균은 81.46035로 보고 평균보다 3.06점 낮다. Taiwan을 별도 응답집단으로 추가하되, 화면에 평균 불일치 안내를 표시하고 점수 규준으로 사용하지 않는다.
- 검수: Node REPL에서 25개 정답을 LIVE 키와 각각 대조하고, 런타임·CSV 수치 및 행 합계를 확인했다. 계산 평균은 81.46035, 선택 목록은 Global n=66,591과 Taiwan n=5,087이며, Taiwan 집단 평균 불일치 경고가 포함된다. CSV는 25행, `git diff --check` 통과. 로컬 화면에서 25/25=150점, 24/25=144점 채점과 오답 25번 응답분포·개념·원본해설·지필드 후속 링크를 확인했다. Taiwan으로 전환 시 별도 n 및 불일치 경고와 응답률이 표시된다. raw_youtube.txt 보존. 로컬 커밋만.


### 2026-11-08 · 2015 AMC 10A 점수 참고 평균 출처 차이

- 브라우저 검수에서 점수 카드 평균 73.39와 99CEF 2015 연례보고서 p.6 Global 평균 73.59가 다름을 확인했다. 73.39는 2차 역사표 값이며 MAA 원통계와 해당 모집단 범위는 확보되지 않았다.
- 점수 카드 설명을 수정해 출처별 참고값으로 분리하고, 두 평균을 같은 집단 값으로 합치거나 Grade 7 규준으로 보지 않도록 안내했다. 99CEF 표와 2차 연도별 표를 각각 연구노트에 기록했다. `git diff --check` 후 커밋한다. `raw_youtube.txt`는 제외.

### 2026-11-08 · 2018 AMC 10B/12B 평균 출처 불일치 처리

- 웹에서 확인한 2018 AMC 10B 재인용 평균은 57.81(Think Matrix/Ivy Track) 또는 57.82(Hanlin/MT100)다. AMC 12B는 57.81(Think Matrix), 57.85(Ivy Track/Math Gold Medalist), 57.86(Hanlin/MT100)으로 갈린다. MAA 원 점수보고서는 회수하지 못했다.
- 두 B형의 active score reference에서 disputed average를 제거하고, 확인 가능한 컷·상위 경계는 유지했다. 각 설명에 평균 보류 및 출처 한계를 표시했다. 출처 비교와 후속 검색 기록은 `boarding-school-math/docs/AMC_ARCHIVE_SOURCE_RESEARCH_2026-11-04.md`에 남겼다.
- 검수: `git diff --check` 통과. Node.js가 없어 브라우저 테스트는 실행하지 않았다. `raw_youtube.txt`는 보존하고 커밋에서 제외한다.

### 2026-11-08 · 2008 AIME I/II grade-by-score source recovered and connected

- Researched the open 2008 AIME grade-table gap. Internet Archive CDX returned four preserved captures of the original MAA PDF. Downloaded the 2024 replay and extracted PDF pages 263–264 with macOS PDFKit; printed page labels identify the tables as pp. 261–262.
- Transcribed the 16 score rows × 8 grade groups for each form into `boarding-school-math/competition/aime-historical-grade-distribution-reference.js`. Exact grades 8–13 remain distinct; unknown and `<=7` stay grouped. Both forms are now available to the existing paper-review comparison by exact year/form/grade.
- Reconciliations: AIME I = n 5,468, weighted mean 4.774→4.77; AIME II = n 3,116, weighted mean 5.273→5.27. Combined n 8,584 matches the report narrative. Updated the coverage manifest and historical-source README/research notes.
- The 2008 values describe that year's recorded-grade cohort only; they are not current norms, predictions, or student ability labels. Original PDF source: `https://web.archive.org/web/20240107095913id_/https://maa.org/sites/default/files/pdf/AMC/d-publication/d1-pubarchive/2007-8pub/Summary,2008HS.pdf`.
