# AMC 학년 비교 근거와 제품 경계

확인일: 2026-10-30 (KST)

## 2026-11-04 · AMC 8 2006 원본 연결 및 전체 응답표 추가

- 웹 검색으로 MAA 저작권 표기가 있는 2006 AMC 8 설명·응답표 보고서 사본을 회수했다. 해당 표는 147,210명 cohort의 문항별 A–E 선택률과 미응답률을 인쇄한다. LIVE의 연도별 원본 아카이브에서 2006 실제 시험지·정답표·전문 풀이가 각각 확인되고, 정답은 LIVE key와 대조했다. [응답표 포함 보고서](https://www.judymlevine.com/uploads/5/4/6/7/5467082/2006_amc_8_ws-25.pdf) · [LIVE 2006 답안](https://live.poshenloh.com/past-contests/amc8/2006/answers) · [LIVE 2006 시험·출력 PDF·풀이](https://live.poshenloh.com/past-contests/amc8/2006).
- 학년 평균과 인원은 이미 수록된 2001–2009 MAA 연례보고서 표에서 grade 5: 1,853명/8.21, grade 6: 6,639명/8.51, grade 7: 48,479명/9.82, grade 8: 78,038명/10.75로 확인된다. `amc8-grade-means-2001-2009.csv`의 기존 기록과 일치한다. 보고서는 AMC 8에 정립된 norm이 없으며 교실 성취·배치 시험과 동등 비교할 수 없다고 명시하므로 결과 UI는 과거 같은 회차/기록 학년 평균으로만 제시해야 한다. [2006 연례보고서 재게시 텍스트](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary).
- 새 `amc8-2006-item-response-percent.csv`와 `amc8-item-response-reference.js` 조회를 연결했다. 이 보고서 표에는 별도 unreadable-mark 비율이 없으므로 CSV에서 공란으로 남긴다. Q18과 Q19는 보고서가 복수 보기를 정답으로 별표 표시한다. 전체 25행 중 8행이 선택률+미응답률 합에서 100%를 0.15%p 이상 벗어나며, 런타임은 이 행들을 제외한다. 다수 응답률은 전체 cohort 기준이며 학년별 표본이나 개인 오개념 판정이 아니다.
- 확인 검증: 25문항 모두 CSV로 전사, key 25개가 LIVE answer key와 대조됨. 17개 행은 합계 허용범위 안이고 조회 가능하며, 8개는 합계 불일치로 제외(그중 Q18·Q19는 복수 correct marker도 있음). 출력 표/문항 원문은 프로젝트에 복사하지 않았다.

## 2026-11-04 웹 검색: AMC 8 2000 통계 경로 확인

- AMC 8 2000 통계의 구형 MAA 경로 `amc.maa.org/amc8/2000/*`를 Internet Archive CDX에서 조회했다. 와일드카드 검색 결과는 빈 목록이었고, `.../stats/*` 하위 경로 조회는 Archive 서버에서 503 오류를 반환해 확인되지 않았다. 조회한 기본 경로에 보존 캡처가 없다는 범위로만 기록하며, 다른 호스트·URL에 보고서가 없다는 뜻은 아니다.
- 이에 따라 2000 회차의 `no-grade-table-recovered` 상태를 유지하고 검색 범위를 coverage manifest에 적었다. 연도별 원본 문제·답·풀이 자료와 통계 회수 상태는 별도로 관리한다.

## 2026-11-04 웹 검색: AMC 8 2023–2024 공개 통계 범위

- MAA Wisconsin Spring 2023 뉴스레터는 AMC 8이 2023-01-17–23에 시행됐고, 당시 더 빠른 점수 보고 체계로 바뀌었지만 일반 AMC 데이터는 아직 제공되지 않았다고 기록한다. [MAA-WI Spring 2023 Contests Report](https://www.wisconsin.maa.org/s/MAA-WI-Newsletter-2023-01-Spring.pdf). 이는 해당 발행 시점의 상황이다.
- MAA Wisconsin Spring 2024 뉴스레터는 2024-01-18–24 AMC 8 일정과 함께, 당시 일반 데이터가 아직 공개되지 않았고 학생 개인정보가 보고 범위를 제한한다고 기록한다. Fall 2024 뉴스레터는 MAA Historical Statistics에 2023–24 경기 데이터가 실리지 않았다고 적고, AMC 8 참가자가 약 81,000명이었다는 전체 수만 언급한다. 이후 자료 공유도 학생/보호자의 동의를 조건으로 약속받았다고 기록한다. [MAA-WI Spring 2024](https://www.wisconsin.maa.org/s/MAA-WI-Newsletter-2024-01-Spring.pdf) · [MAA-WI Fall 2024](https://www.wisconsin.maa.org/s/MAA-WI-Newsletter-2024-02-Fall.pdf). 이 2023–24는 학년도 표현이며 AMC 8 2024 회차에 해당한다.
- 검색에서 확인한 [2023 AMC 8 점수 요약 재게시](https://www.scribd.com/document/853921825/Contest-Score-Report-2023-AMC8)는 전체 응시자 통계(평균·표준편차·응시자/학교 수 및 전체 점수 구간)만 보여 준다. 학년별 표가 아니므로 기존 MAA 전체 코호트 점수 기준과 분리하고, 학년별 진단값으로 추가하지 않는다.
- 따라서 2023·2024 AMC 8 행의 상태는 `no-grade-table-recovered`로 유지했다. 당시 통계 공개 상황을 현시점에도 데이터가 없다는 주장으로 일반화하지 않으며, 학교별 결과나 전체 평균에서 학년 평균을 추정하지 않는다. 실제 연도별 원본 시험·답·풀이 경로는 별도 카탈로그에서 계속 제공한다.

## 2026-11-04 웹 재검색: AMC 8 2016 보고서와 2022 부분 학년 자료

- 2016 MAA General Reports 보존본에서 AMC 8 보고서 항목(ID 63)은 확인했지만, Internet Archive 캡처의 ReportViewer 본문은 로드되지 않는다. 99CEF의 2019 AMC 8 연도 요약과 MAA Michigan Section 2016 뉴스레터는 전체 응시 평균만 제공하고 학년 행은 싣지 않는다. 두 출처의 전체 응시자 수(108,227 / 108,295)도 다르므로 별도 유지한다. Bard Math Circle의 2016 학년 평균은 행사 표본(n=35)이라 제외한다. 따라서 2016은 현재도 `no-grade-table-recovered`이며, 보고서 항목이 있었다는 사실을 본문 회수로 간주하지 않는다.
- 2022 표는 川观新闻 재게시 기사에서 연결된 별도 원본 이미지 링크를 따라 회수했다. 이미지 제목은 `Grade and Gender Average AMC 8 2022`, 범위는 `Location: Overall`이다. Apple Vision OCR 결과를 이미지 픽셀과 대조해 전체 6개 구간을 확인했다: `<=4` n=1,105 평균 8.90; 5학년 3,231명 8.98; 6학년 14,258명 8.78; 7학년 22,493명 9.57; 8학년 29,236명 10.38; `UNK` 694명 7.87. 인원 합은 71,017이고 가중 평균 9.69097로 표시된 Overall 9.69에 반올림 일치한다. 지리적 포함 범위는 이미지에 없어서 현재 미국·캐나다 규준이라고 표시하지 않는다. 성별별 인원 합은 각 grade 행의 전체 인원과 맞지 않아 진단에 사용하지 않는다. 정확 학년 5–8만 같은 연도/학년 과거 평균 비교에 연결하고 grouped/UNK 행은 비교하지 않는다. 데이터: [`amc8-grade-means-2022-maa-overall.csv`](../competition/historical-amc-grade/amc8-grade-means-2022-maa-overall.csv). [川观新闻 재게시 기사](https://cbgc.scol.com.cn/news/5801694) · [新花城/南方窗 이미지 포함 기사](https://huacheng.gz-cmc.com/pages/2024/12/26/395e30eec1e140a0b4a9600b3a6dc38b.html) · [통계 이미지](https://oss.gz-cmc.com/pgcr/root/huacheng/upload/news/image/2024/12/26/1735192467843013389.jpeg)
- 이 조사에서 확인한 자료: [MAA 2016 연도별 통계 메뉴 보존본](https://web.archive.org/web/20220204191809/http://amc-reg.maa.org/reports/generalreports.aspx), [99CEF 2019 AMC 8 연도 요약 PDF](https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf), [MAA Michigan Section 2016 뉴스레터](https://sections.maa.org/michigan/newsletters/Vol43no2_Spring_2017.pdf), [Bard Math Circle 2016 지역 결과](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in). 전국 또는 전체 응시 집단의 완전한 2016 학년별 표가 회수되기 전에는 비교 가능한 규준 데이터로 승격하지 않는다.

## 2026-11-04 웹 검색 추가: AMC 8 연도별 전체 응시 요약

99CEF의 [2019 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf) 안에 2005–2019 연도 비교표가 있어 전체 참가자 수, 만점 수, 20점 이상 수, 평균 점수를 회차별로 정리했다. 2005–2015 행은 원문의 “Global”, 2016–2019 행은 “United States and Canada” 열이다. 지역 집계가 바뀌는 2016년 경계에서 두 묶음을 하나의 연속 추세로 비교하지 않는다.

[`amc8-overall-cohort-summary-2002-2020.csv`](../competition/historical-amc-grade/amc8-overall-cohort-summary-2002-2020.csv)가 수치 전사본이고, [`amc8-overall-cohort-reference.js`](../competition/amc8-overall-cohort-reference.js)는 완성된 AMC 8 원본 답안 점수와 동일 연도 전체 평균을 대조한다. 이 전체 응시 평균은 학년 평균·백분위·실력 등급이 아니며, 이미 있는 정확한 학년 평균 비교와 별도 표시한다. 2016은 99CEF의 미국·캐나다 108,227명·평균 9.36이며, 별도의 MAA Michigan Section 통계는 108,295명을 보고해 응시자 수가 일치하지 않는다. 두 출처의 수치를 합치거나 임의로 하나로 조정하지 않았다. 2020은 MAA Wisconsin Section 보고서의 미국 평균 10.01만 확인됐고, 표본 수와 학년별 분포는 확보하지 못했다. 99CEF PDF 자체는 MAA 호스팅이 아니므로 출처 상태를 그대로 밝힌다. 해당 보고서 표의 별도 모집단·보고값은 각 열 그대로 보존했고, MAA의 2019 점수별 학년 분포(94,620행) 및 별도 재게시 요약(94,675명)과 결합하지 않았다.

## 원본 문항 개념 출처 연결 (2026-11-04)

LIVE by Po-Shen Loh의 [2010 AMC 8 전문 풀이](https://live.poshenloh.com/past-contests/amc8/2010/solutions)는 문항별 Concepts와 숫자형 difficulty rating을 제공하며, 해당 페이지는 문제를 MAA의 공식 법적 허가로 사용한다고 밝힌다. 25개 문항의 태그·rating과 각 문항 경로를 CSV로 기록했다. [`amc8-2010-item-concepts.csv`](../competition/historical-amc-grade/amc8-2010-item-concepts.csv).

같은 구조를 LIVE의 AMC 8 전체 연도 페이지에서 확인해 [`amc8-item-concept-source-inventory.csv`](../competition/historical-amc-grade/amc8-item-concept-source-inventory.csv)에 1985–2026(2021 제외) 41회 × 25문항, 총 1,025행을 수집했다. 문항 태그와 원본 rating은 각 연도의 LIVE 출처에서 그대로 기록했다. [`amc8-gfield-concept-crosswalk.csv`](../competition/historical-amc-grade/amc8-gfield-concept-crosswalk.csv)는 그 175개 고유 태그를 GFIELD의 다섯 넓은 복습 영역에 제안 분류한다. 2010 회차는 문항별로 확인한 분류를 쓰고, 나머지 AMC 8 회차는 태그 기반의 수정 가능한 제안 영역을 사용한다. 이 태그 교차표는 학년 배치·숙달도·문항 난이도 검증이 아니다. 실제 진단은 학습자가 기록한 정오·미응답과 직접 선택/수정한 영역으로 제한한다.

GFIELD 진단은 원본 태그를 바탕으로 한 수정 가능한 여섯 영역(식과 대수 관계, 수와 정수의 성질, 기하 도형과 측정, 경우의 수와 확률, 자료와 통계, 함수와 그래프)을 제안한다. 학습자가 영역을 바꿀 수 있고, 진단 결과는 LIVE의 rating으로 산정하지 않는다. 모든 AMC 8/10/12 및 AIME 원본 회차의 문제별 원본 개념 출처에 연결되어 있다. LIVE의 256개 현행 개념 분류에 없는 655개 태그는 이름 기반 자동 제안으로 표시해 교사 검토가 필요하다. 문항 난도·학년 배치·숙달도 검증으로 사용하지 않는다.

### 2026-11-04 · 연도·시험형별 AMC/AIME 개념 메타데이터 수집

LIVE의 [원본 아카이브](https://live.poshenloh.com/past-contests)는 AMC 8 41회, AMC 10 52회, AMC 12 102회, AIME 71회 등 266개 시험지 페이지와 문항별 개념·해설 링크를 제공한다. [개념 목록](https://live.poshenloh.com/past-contests/concepts)은 8개 출처 분류 아래 256개 이름을 공개하며, LIVE는 문제를 MAA의 공식 법적 허가로 사용한다고 명시한다. 각 회차의 해설 페이지를 웹에서 읽어 문항 번호·원본 태그·공개 difficulty rating·개별 문제/해설 URL만 보관했다.

[`amc-item-concept-source-inventory.csv`](../competition/amc-item-concept-source-inventory.csv)는 6,500개 문항 메타데이터(AMC 8 1,025, AMC 10 1,300, AMC 12 3,110, AIME 1,065)를 연도·시험형·문항 번호로 정리한다. [`amc-live-concept-taxonomy.csv`](../competition/amc-live-concept-taxonomy.csv)는 현행 256개 개념과 LIVE 분류를 보관한다. [`amc-gfield-concept-crosswalk-all.csv`](../competition/amc-gfield-concept-crosswalk-all.csv)는 911개 고유 태그를 GFIELD 여섯 영역으로 제안 대응한다. 현행 목록에서 못 찾은 655개 태그는 자동 이름 분석 제안이며 검토 필요 상태를 명시한다. 문항별 영역은 수정할 수 있다. 이 데이터는 답안 기반 복습·원본 출처 탐색을 돕는 메타데이터이며, LIVE 난도 점수나 자동 영역 제안을 GFIELD 학년 등급·숙달도로 해석하지 않는다. 원문 문제, 선택지, 정답, 힌트, 풀이 문장을 복사하지 않았다.

## 공개 근거

- MAA의 [AMC 공식 프로그램 안내](https://maa.org/student-programs/amc/)는 AMC 8·10·12의 참가 학년, 시험 형식·범위와 일부 현재 주기 정보를 제공한다. 공개 페이지에서 개인 점수의 학년별 백분위표, 같은 학년 순위표, 학년 규준 실력 등급표는 확인되지 않았다.
- MAA의 [학교 관리자 안내](https://maa.org/student-programs/amc/information-for-school-administrators/)는 주최 학교가 전국 수준의 학교 순위 관련 피드백을 받을 수 있다고 설명한다. 이것은 학교 단위 피드백이며 개별 학생의 같은 학년 순위나 AMC 능력 등급을 산출할 근거가 아니다. 안내의 대회 날짜는 2024–25 주기라 최신 주기 일정 근거로 쓰지 않는다.
- MAA의 [AMC 학생 포털 안내서](https://maa.org/wp-content/uploads/2025/06/Guide-to-the-AMC-Student-Portal.pdf)는 학생이 포털에서 연도별 성적을 확인할 수 있다고 설명한다. [AMC 교사용 안내서](https://maa.org/wp-content/uploads/2025/06/2025-26-AMC-8-Teachers-Manual.pdf)는 주최자가 포털에서 학생 성적표를 보는 흐름을 설명한다. 공개 안내만으로 학년별 비교 통계가 성적표에 포함된다고 확인할 수는 없다.
- MAA의 [AMC 데이터 보안·개인정보 안내](https://maa.org/policies-and-procedures/)는 참가자 등록 정보와 점수가 MAA 내부 시스템에 보관되고 승인·교육을 받은 직원에게만 접근 권한이 있다고 설명한다. 이 프로젝트는 해당 비공개 데이터에 접근하지 않았다.
- MAA의 [2026–27 AIME 안내](https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/)는 해당 주기 미국·캐나다 경로의 AMC 10/12 점수 기준을 발표한다. 이 값은 주기와 지역을 붙인 공식 점수 기준이며, 학년별 백분위·실력 등급이 아니다.

현행 MAA 공개 EduView 자료에는 학년별 필터가 없어 현재 응시자 집단을 같은 학년 규준처럼 비교할 수 없다. 다만 아래에 기록한 MAA 작성 역사 보고서와 보존된 구형 통계 페이지에는 일부 과거 회차의 학년별 평균·분포가 있었다. 과거 수치와 현재 통계를 구분하고, 출처·폼·참가 범위·학년 정의·분모가 확인된 해당 회차에 한해 역사적 비교 자료로 다룬다. 주최자 계정의 접근 제한 자료를 추정하거나, 수상자 명단·선택된 학교 순위에서 모집단 분포를 역산하지 않는다.

## 연도별 실제 시험지 공개 범위

- MAA의 [공식 자료 페이지](https://maa.org/audience/students-k-12/)에서 확인되는 “Sample Competition”은 2022 AMC 10 A, 2023 AMC 8 등 일부 회차의 체험 자료다. 이것만으로 전체 연도별 원본을 충족한다고 보지 않는다.
- 실제 연도별 기출은 [LIVE의 전체 AMC/AIME 색인](https://live.poshenloh.com/past-contests)을 사용한다. 색인은 MAA가 공식 법적 허가를 해 주었다고 명시하며, 266회 시험·6,500문항·77년 자료와 회차별 인쇄 가능 PDF, 정답 및 전문 풀이를 안내한다. 제공된 자료는 원본 호스트에서 열며, GFIELD 저장소에는 시험 문항·정답·풀이를 복사하지 않는다.
- LIVE의 [문항별 페이지 예시](https://live.poshenloh.com/past-contests/amc10/2025A/problem/1)에는 원본 정답·풀이와 함께 개념 태그, 작은/큰 힌트, LIVE 자체 난도 rating이 붙어 있다. AMC 8, AMC 10/12, AIME 모두 회차 페이지에서 각 문항 풀이로 바로 들어갈 수 있다. 개념·풀이 확인은 학습자가 원본 호스트에서 하도록 연결하며, LIVE 난도 rating을 MAA 공식 난도나 학년 규준처럼 취급하지 않는다.
- MAA가 직접 공개한 [2022 AMC 10 A 문제 PDF](https://maa.org/wp-content/uploads/2024/08/2022_AMC10A-Problems.pdf)는 실제 원본·25문항·75분 형식과 시험 종료 전 공개 금지 안내를 확인하는 1차 자료다. 이 한 파일을 전체 연도 자료의 대체물로 쓰지 않는다.
- 연도별 선택기의 허용 회차와 URL은 `competition/amc-original-paper-library.js`에 두고, AMC 8 1985–2026(2021 제외), AMC 10 2000–2025, AMC 12 1950–2025, AIME 1983–2026의 LIVE 실제 원본 경로로 연결한다. 연도·형식마다 인쇄와 해설 링크를 해당 원본 페이지에서 확인한다.

## 비교 가능한 점수 범위

- MAA 공개 EduView 보고서는 AMC 8의 2023–2026 회차와 AMC 10/12의 2022–2025 A/B 회차별 전체 응시자 기준점(상위 경계, 평균, 표준편차, 표본 수)을 확인할 수 있다. 이 기준은 학년 필터가 없는 같은 시험지 응시 집단 비교이며, 동학년 백분위나 학년별 능력 등급이 아니다.
- 따라서 원본 시험 진단은 해당 회차의 원점수, 문항 번호 구간, 학습자가 선택한 영역·오류 이유, 공개된 경우 같은 회차 전체 응시자 기준을 함께 보여준다. 학습지의 각 문항에서 연도·시험형·번호가 맞는 LIVE 원본 풀이·개념 페이지로 직접 이동할 수 있다. Grade는 학생의 학년 맥락으로 표시하되 등급 변환에 쓰지 않는다. GFIELD 창작 모의고사의 문항별 약점 진단도 AMC 공식 등급과 분리한다.

## 현재 제품 동작

- 원본 시험 복습 화면에는 별도의 역사적 학년 평균 비교가 연결되어 있다. AMC 8은 2003–2009, AMC 10/12는 2007–2011 A/B형에서 보고서에 정확한 학년으로 기록된 조합만 표시한다. 모든 문항의 채점 표시를 마친 뒤 시험연도·대회·폼·Grade가 모두 맞을 때 응시 점수와 과거 같은 학년 집단 평균 및 표본 수를 나란히 보여 준다. `4–5`, `8학년 이하`, `unknown`처럼 묶인 기록은 개별 Grade와 비교하지 않는다. 이 historical comparison은 MAA 공개 EduView 전체 응시자 기준(AMC 8 2023–2026, AMC 10/12 2022–2025 A/B)과 별도 자료·별도 패널이다.
- 해당 보고서 사본은 MAA 작성물로 표시되지만 현재 제3자 호스트에 보존되어 있다. 화면은 보고서 출처와 해당 코호트 표본을 표시하고, 과거 기술통계로만 안내한다. 데이터가 없는 연도·폼·학년에서 값을 보간하거나 현재 능력 등급, 백분위, AIME 진출 또는 학교 과목 배정을 만들지 않는다. 회차별 원본 문제지는 LIVE의 허가된 연도 색인에서 인쇄·답안·풀이 링크를 연다.
- AMC 8/10/12 점수 이력에는 사용자가 입력한 응시 당시 학년을 선택적으로 함께 보관하고, 회차별 표에 표시한다. 이는 본인 기록을 학년 맥락과 함께 되짚기 위한 정보이며 동학년 순위, 성장량, 시험 난도 보정이나 등급 산출에 쓰지 않는다.
- 회차별 점수 기록에 MAA 공개 분포가 있는 시험연도·시험형이면 그 같은 시험지의 공개 기준점과 출처 링크를 붙인다. AMC 8은 학년도 시작 다음 해의 1월 시험, AMC 10/12는 학년도 시작 해의 11월 시험을 대응한다. 현재 커버 범위는 AMC 8 2023–2026, AMC 10/12 2022–2025 A/B다. 기록된 학년과 나란히 표시해도 전체 응시자 기준이며, 경계 점수와 동점자가 있을 수 있어 개인 백분위나 동학년 등급을 뜻하지 않는다.
- 각 기록은 기존처럼 대회 종류별·날짜순으로 따로 보여 준다. AMC 10과 AMC 12, 서로 다른 시험지·연도는 동등한 난도라고 가정하지 않는다.
- 2026–27 미국·캐나다 MAA AIME 공지는 해당 대회 원점수가 발표된 문턱에 도달했는지만 표시한다. 응시 자격이나 실제 초청을 판정하지 않는다. 국제 AMC 기록에는 미국·캐나다 기준을 적용하지 않는다.
- 채점지 복습은 사용자가 표시한 정답·오답·미응답과 영역 태그를 정리한다. 이 문항별 결과는 AMC 공식 점수, 개인 순위, 수상·AIME 예상이나 학교 배치로 변환하지 않는다.
- 학업 평가 비교는 MAP Growth 등 원래 규준이 제공되는 자료의 확인된 입력을 활용한다. MAP RIT은 같은 척도의 점수 차로, 백분위는 규준 연도·시기·수업 주차가 일치할 때에만 각 학년 규준 내 상대 위치 차로 표시한다. 다른 시험 점수끼리는 환산하지 않는다.

## 자료의 범위

현행 비교 확인은 MAA 공개 페이지와 공개된 학생/교사용 안내서에 한정된다. 주최자 계정에 보이는 최신 보고서는 접근하지 않았다. 학년별 데이터가 전혀 공개된 적 없다고 단정하지 않는다. 과거 일부 AMC 8 보고서에는 학년별 평균·응시자 수가 있으나, 최신 동학년 규준이나 배치 기준으로 검증된 자료는 별도로 확인되지 않았다.

## 2026-11-04 추가 웹 확인

- LIVE의 현행 공개 색인을 다시 확인했다. 페이지는 MAA의 공식 법적 허가를 받아 실제 AMC 시험지를 게시한다고 명시하고, 각 회차의 무료 인쇄용 PDF와 온라인 문항 풀이를 제공한다. 색인에 표시된 현황은 총 266회·6,500문항·77년이며 AMC 8 41회(1985–2026, 2021 제외), AMC 10 52회(2000–2025), AMC 12 102회(1950–2025), AIME는 나머지 71회다. 이 수치는 LIVE 색인의 현재 공개 범위이지 MAA가 보증한 통계 규준은 아니다. GFIELD는 연도·폼·문항 경로만 보관하고 원문은 LIVE에서 열도록 한다.
- MAA의 [Student Awards 페이지](https://maa.org/student-programs/youth-program-awards-winners/)는 2026 Young Women in Mathematics Awards & Certificates 수상자와 일부 허가된 이름을 공개한다. MAA는 상을 각 대회 최고 점수 참가자, 인증서를 각 MAA Section의 최고 점수 참가자에게 준다고 설명하지만, 공개 명단은 게시 동의를 한 이름만 포함한다. 명단에 점수, 전체 응시자 수, 같은 학년 전체 분포가 없으므로 이를 개인의 학년별 순위나 AMC 점수 등급으로 사용할 수 없다.

### 2026-11-04 2016 AMC 8 MAA 보고서 경로 재탐색

Internet Archive CDX를 통해 `amc.maa.org/amc8/2016/stats/*`, `amc.maa.org/amc8/2016/*`, `amc-reg.maa.org/reports/*2016*`, `maa.org/*2016*AMC8*Report*` 패턴의 HTTP 200 캡처를 각각 확인했으나 결과가 없었다. 이는 이 네 URL 패턴에서 보존본을 회수하지 못했다는 뜻일 뿐, 다른 주소의 공개 자료가 존재하지 않는다는 증명은 아니다. 기존 MAA 통계 메뉴 캡처 ID 63은 메뉴 레코드만 있고 본문은 없으며, 이번에도 학년표 숫자는 확보되지 않았다. 2016 학년 비교 상태를 `no-grade-table-recovered`로 유지한다. 검색어와 결과는 추후 같은 경로를 불필요하게 반복하지 않도록 기록한다.
- MAA의 [현행 대회 정책 페이지](https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/)는 정책·수상 조건이 변경될 수 있고 공식 사이트에서 현재 기준을 확인해야 한다고 명시한다. 따라서 예전 자료에 등장하는 Achievement Roll/Honor Roll 명칭이나 제3자 점수표는, 해당 시즌의 MAA 공식 기준과 모집단이 확인되기 전까지 제품의 현재 등급 기준으로 채택하지 않는다.
- 비교 기능에 지금 반영할 수 있는 것은 공개된 동일 시험지 전체 응시자 점수 분포가 있는 회차의 기준과, 주기가 명시된 AIME 진입 점수 기준뿐이다. Grade는 응시 당시 학생의 기록 맥락으로 보이고, MAA의 공식 학년별 등급·백분위는 아니다.
- 역사자료 탐색 중 2008 MAA AMC 8 `Summary of Results and Awards` 보고서의 원문 텍스트 사본을 확인했다. 보고서에는 2002–2008 학년별 평균 및 recorded grade 응시자 수 표가 있다. 예를 들어 2008년에는 학년군 4–5, 6, 7, 8의 표본 수가 각각 2,698 / 19,726 / 48,889 / 75,002명, 평균이 10.75 / 9.88 / 11.18 / 12.07점이다. 이 보고서는 표의 분류가 학생이 답안지에 실제 표시한 학년에 기반하고 미기입 자료를 제외한다고 설명한다. 또 AMC 8에 “확립된 규준”이 없고 학교 수업·배치 시험과 비교할 수 없다고 명시한다. 따라서 이 값은 **과거 회차의 기술통계 사례**로만 보관하고 현재 학생 레벨, 백분위, placement에 쓰지 않는다.
- 자료 접근 경로는 [Stanford 연구자의 AMC 연례 보고서 아카이브](https://sites.google.com/view/ian-calaway/amc-archive/)와 그 페이지에 연결된 공개 MAA 작성 보고서 텍스트 사본이다. 아카이브 운영자는 1985–2022 중학교 요약집을 디지털화했다고 설명하지만, MAA 공식 호스트가 아닌 제3자 보관소이고 일부 누락 가능성을 직접 고지한다. 제품 기준에 쓰기 전에는 각 연도 원본 PDF와 표, 정의를 개별 대조해야 한다. 확인 예: [2008 MAA AMC 8 Results & Awards](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america).

확인 출처: [LIVE 실제 AMC/AIME 시험지 색인](https://live.poshenloh.com/past-contests), [MAA Student Awards](https://maa.org/student-programs/youth-program-awards-winners/), [MAA 현행 정책](https://maa.org/student-programs/amc/maa-american-mathematics-competitions-policies/). 확인일: 2026-11-04 KST.

## 2026-11-04 연도별 학년 통계 원자료 조사

사용자 요청에 따라 표본 글이 아니라 실제 연도·대회·폼 기준 원자료를 추적했다.

### 연례 보고서에서 직접 확인 가능한 학년별 수치

2026-11-04 웹 대조 결과를 아래 조사 CSV로 전사했다. CSV는 화면 노출용 규준표가 아니라 연도·시험형·학년군 단위 근거 보관본이다. AMC 8 2001–2002 값은 MAA 작성 2008 보고서 표 2, 2003–2009 값은 MAA 작성 2009 보고서 표 2와 대조했다. AMC 10/12 2007–2010과 2011 값은 MAA 작성 연례 통계 사본의 해당 표/Grand Statistics 항목과 대조했다. 보고서 사본은 제3자 호스트에 있으므로 primary-host capture 상태를 별도로 남겼다.

- `../competition/historical-amc-grade/amc8-grade-means-2001-2009.csv` — AMC 8 recorded grades 4–5, 6, 7, 8; participant counts and means.
- `../competition/historical-amc-grade/amc10-12-grade-means-2002-2011.csv` — AMC 10 and AMC 12 A/B form, grade-group counts and means (220 rows).
- `../competition/historical-amc-grade/amc-grade-reference-coverage-by-paper.csv` — one status row for each of the 266 year/form original-paper records, separating recovered grade-mean tables, grade-score distributions, and uncollected coverage.
- 두 평균 파일은 연도/시험/폼이 다르면 수치를 합치거나 서로 환산하지 않는다. 회차 coverage manifest는 현재 원본 카탈로그와의 대응표이지 성적 데이터가 아니다. 수치 표본은 현재 시험을 대표하지 않고, score-to-grade placement, ability level, percentile, AMC qualification을 의미하지 않는다.

### 2010 AIME I/II 학년별 점수 빈도 추가

- [MAA 작성 2010 AMC 10/12 Summary of Results and Awards 사본](https://www.scribd.com/document/51428451/2010-HS-summary)의 Table XIII (인쇄 페이지 201–202)에 AIME I·II 점수 0–15점별 학년 인원수가 있다. 사본은 Scribd에 있는 제3자 사본이다. 총계는 I 3,618명, II 2,904명이며, 각 학년군 열의 점수 합이 보고서의 참가자 총계와 일치하는지 검증했다. 학년 열은 unknown, ≤7, 8, 9, 10, 11, 12, 13이다.
- 원점수별 빈도는 `../competition/aime-historical-grade-distribution-reference.js`에 그대로 분리 저장했다. 특정 학년·점수 비교에서 계산하는 값은 `해당 점수보다 낮은 점수를 받은 인원 ÷ 해당 학년 표본 × 100`뿐이다. 동점은 제외한다. 이 계산값을 보고서가 발표한 percentile rank나 현재 학년 규준으로 부르지 않는다.
- 원본 AIME 2010 I/II 답안을 모두 채점하면 같은 연도·회차·선택 학년 표본을 나란히 보여준다. AMC 8/10/12 학년 평균, AIME 전체 회차 분포 및 진출 기준과는 다른 보고서 유형으로 분리했다. exact Grade 8–13만 사용할 수 있고 `≤7` 묶음에서는 개별 학년 비교를 만들지 않는다.
- 제품 검증 예시: 2010 AIME I Grade 8 표본은 136명이다. 8/15점은 해당 표본 중 104명이 더 낮은 점수를 받았고 15명이 동점으로 기록되어, strict lower-score share는 76.47%다. 이는 같은 시기 보고서의 역사 표본 설명이지 현재의 순위·자격·실력 등급이 아니다.

MAA 작성 AMC 8 `Summary of Results and Awards`의 2008·2009년판은 해당 회차와 직전 회차들의 **기록된 학년군별 응시자 수 및 평균 점수**를 함께 싣는다. 표는 `4 & 5`, `6`, `7`, `8`학년을 사용한다. 아래 값은 각 셀을 보고서 표와 대조해 옮겼다.

| 시험 연도 | 4–5학년 n / 평균 | 6학년 n / 평균 | 7학년 n / 평균 | 8학년 n / 평균 |
|---:|---:|---:|---:|---:|
| 2001 | 1,736 / 6.73 | 14,710 / 8.28 | 58,271 / 9.49 | 93,090 / 10.66 |
| 2002 | 1,560 / 7.76 | 14,707 / 9.31 | 53,804 / 10.59 | 85,351 / 11.79 |
| 2003 | 1,553 / 7.62 | 15,414 / 8.58 | 53,170 / 9.77 | 86,542 / 10.93 |
| 2004 | 1,496 / 8.15 | 15,248 / 8.51 | 51,679 / 9.55 | 84,399 / 10.48 |
| 2005 | 2,014 / 8.05 | 14,268 / 8.16 | 48,418 / 9.37 | 76,877 / 10.52 |
| 2006 | 1,853 / 8.21 | 16,639 / 8.51 | 48,479 / 9.82 | 78,038 / 10.75 |
| 2007 | 3,170 / 8.48 | 18,687 / 8.19 | 49,594 / 9.51 | 76,907 / 10.60 |
| 2008 | 2,698 / 10.75 | 19,726 / 9.88 | 48,889 / 11.18 | 75,002 / 12.07 |
| 2009 | 3,874 / 9.45 | 20,688 / 9.17 | 50,218 / 10.08 | 73,220 / 10.82 |

보고서는 `recorded`가 답안지에서 스캔된 학년 정보에 한정되며 학년 누락은 표에서 빠진다고 정의한다. 이 데이터는 해당 연도 AMC 8 점수의 설명 통계이지 학년별 백분위나 진단 등급은 아니다. 보고서는 AMC 8에 확립된 규준이 없고 교실 평가나 배치 시험과 비교할 수 없다고 직접 경고한다.

2001–2002년 표는 [2008 MAA AMC 8 Results & Awards 사본](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america)의 표 2에서 확인했다. 이 사본도 제3자 호스트의 MAA 작성 보고서다. 원본 MAA 저장소와의 대조가 끝날 때까지 같은 미확인 표시를 유지한다.

MAA 작성 2010 AMC 10/12 연례 보고서의 AMC 10 표에는 2007–2010 학년별 평균과 응시자 수가 A/B 폼별로 있다. 학년군은 10학년, 9학년, 8학년 이하, 학년 미기입으로 나뉜다.

| 시험 연도·폼 | 10학년 n / 평균 | 9학년 n / 평균 | 8학년 이하 n / 평균 | 학년 미기입 n / 평균 |
|---|---:|---:|---:|---:|
| AMC 10 2007 A | 34,297 / 67.3 | 27,606 / 62.0 | 3,658 / 75.9 | 8,208 / 86.7 |
| AMC 10 2007 B | 12,027 / 62.7 | 10,051 / 59.3 | 957 / 73.4 | 971 / 57.4 |
| AMC 10 2008 A | 34,705 / 59.9 | 25,411 / 54.3 | 3,736 / 70.5 | 4,249 / 55.0 |
| AMC 10 2008 B | 16,523 / 66.7 | 12,841 / 61.6 | 1,988 / 76.9 | 3,451 / 78.7 |
| AMC 10 2009 A | 36,603 / 72.9 | 26,419 / 65.7 | 3,363 / 82.0 | 4,624 / 65.7 |
| AMC 10 2009 B | 14,368 / 74.8 | 10,416 / 68.0 | 1,430 / 85.4 | 4,223 / 82.8 |
| AMC 10 2010 A | 30,768 / 73.1 | 21,717 / 66.5 | 4,686 / 79.6 | 5,083 / 66.5 |
| AMC 10 2010 B | 18,231 / 69.2 | 12,880 / 64.2 | 3,124 / 78.1 | 3,856 / 70.0 |

같은 보고서의 AMC 12 표에서 2010년 학년별 평균과 표본 수는 다음과 같다. 이 보고서의 고교 표에서는 학년 13과 학년 미기입도 별도 행으로 둔다.

| 시험 연도·폼 | 13학년 n / 평균 | 12학년 n / 평균 | 11학년 n / 평균 | 10학년 n / 평균 | 9학년 n / 평균 | 8학년 n / 평균 | 학년 미기입 n / 평균 |
|---|---:|---:|---:|---:|---:|---:|---:|
| AMC 12 2010 A | 61 / 66.9 | 26,546 / 63.6 | 31,229 / 61.5 | 4,258 / 64.0 | 1,173 / 62.2 | 184 / 74.6 | 3,704 / 60.5 |
| AMC 12 2010 B | 99 / 62.8 | 14,223 / 59.5 | 18,927 / 58.6 | 3,210 / 63.1 | 1,072 / 64.9 | 392 / 70.4 | 2,827 / 62.4 |

같은 연례 보고서에는 2010 AIME I과 II에 대해 학년별 점수 빈도표도 수록돼 있다. 예를 들어 AIME I은 3,618명, AIME II는 2,904명으로 보고서 상단 요약에 기재돼 있으며, 학년 행은 7학년 이하, 8–13학년, 학년 미기입으로 구분된다. 이 표는 해당 연도의 AIME 응시집단 분포로만 해석한다.

### 보존된 MAA 점수·학년 백분위 보고서

Internet Archive가 보존한 2022년 MAA `General Reports` 페이지는 MAA의 구형 통계 서비스이며, 페이지 안내문은 시스템 변경 중이라 최근 연도만 이 화면에서 제공하고 보관 통계를 추가할 예정이라고 밝혔다. 당시 AMC 선택 메뉴에는 AMC 8 회차가 2010–2022, AMC 10/12 A/B가 2009–2021, AIME 회차가 2009–2022 범위로 노출됐다. 이는 **메뉴에 보였던 회차 범위**이며 전체 연도·폼별 데이터가 온전히 보존되었다는 뜻은 아니다.

MAA 페이지 자체의 설명 문구는 `Contest Score Grade Report with Percentile`가 점수를 내림차순으로 나열하고, 각 점수에서 학년별 응시자 수와 대응 백분위를 제공한다고 정의한다. AMC 8의 경우 최대 점수 기준이 25, AMC 10의 경우 150으로 설명되어 있다. 2013 AMC 10 A 평균·응시자 수의 학년별 사례도 구형 보고서 수치와 대조된다. 하지만 이번 조사에서는 아카이브된 ASP.NET 페이지의 선택 메뉴와 설명은 확보했어도, 인터랙티브 리포트 본문 전체를 폼별로 재생해 원본 파일로 회수하지 못했다. 그러므로 구형 백분위표를 제품에 넣거나 특정 연도 전체를 완료했다고 표시하지 않는다.

추가 검색으로 **2011 AMC 8 한국 응시집단의 구형 `Contest Score Grade Report with Percentile` 전체 표**가 당시 MAA 결과를 전재한 자료에서 회수됐다. 게시물은 한국 참가자 899명 결과라고 명시한다. 표의 학년 구분은 `<=5`, `6`, `7`, `8`, `unknown`이고 점수별 인원 수 및 해당 집단 백분위가 있다. 원자료 표 전체는 [`historical-amc-grade/`](historical-amc-grade/) 아래의 전사 CSV에 저장했다. 이름·학교가 노출된 수상자 목록은 수집하지 않았다.

이것은 **미국 전체 통계가 아닌 2011년 한국 MAA 참가 집단 자료**이며, 현재 학생과 현재 시험 회차의 규준으로 대체할 수 없다. 출처가 MAA 운영 학원 사이트의 보고서 전재이므로, 원본 MAA 화면·지역 필터의 보존본과 직접 대조하기 전까지 데이터 상태를 `secondary transcription; primary capture pending`으로 유지한다. MAA 구형 리포트의 컬럼 설명과 행 구조는 일치하지만, 퍼센타일 정의가 `≤ 점수`인지 `< 점수`인지 등 계산 경계도 재검증할 항목으로 남긴다.

또한 **2009 AMC 8 한국 결과의 점수별 학년 분포**가 같은 계열의 결과 게시물에 남아 있다. 한국 전체 참가자는 741명이고, 학년별 점수표는 5–8학년의 각 점수별 인원 수를 제공한다. 학년 표시가 있는 합계 737명(5학년 70, 6학년 158, 7학년 262, 8학년 247)과 전체 차이 4명은 학년 미기입 잔여와 일치한다. 원자료에 백분위 열이 없어 CSV에는 점수별 빈도만 기록했다. 2011 표와 같은 방식으로 바로 percentile로 부르지 않는다.

### 다음 수집 단위와 제품 반영 기준

1. AMC 8 1985–2022, AMC 10/12 2009–2021, AIME 2009–2022를 회차·폼별 행으로 만들고 `paper availability`, `grade count/mean`, `grade score distribution/percentile`을 서로 다른 자료 상태로 관리한다. 현재는 모든 연도의 `paper availability`가 LIVE 색인에서 확인 가능하지만, 학년별 분포는 회차마다 원자료가 확인되어야 한다.
2. 저장 필드는 시험연도, 시험종류, 폼/세션, 학년 원문, 점수, 학년별 인원수, 보고서 통계 유형, 대상 지역, 출처 URL, 페이지/표, 수집 및 검수 상태로 고정한다. 점수 구간이나 백분위의 분모 의미가 불명확하면 비워 둔다.
3. 사용자의 응시 결과는 같은 연도·같은 시험·같은 폼·같은 지역 및 학년 정의가 확인된 완전 분포가 있을 때만 그 표와 대조한다. 연례 보고서의 학년 평균과 MAA 구형 백분위표를 한 데이터형으로 혼합하지 않는다. 시험점수로 교과 학년 배치나 장기 로드맵을 자동 결정하지 않는다.

### 이번 조사 출처

- [MAA 작성 2009 AMC 8 연례 보고서 사본](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html) — 표 2와 통계 해석 경고. MAA 작성물이지만 현재 링크는 제3자 문서 보관소이므로 원본 유통처와 구분해 기록.
- [MAA 작성 2010 AMC 10/12 연례 보고서 사본](https://www.scribd.com/doc/58090065/2010-AMC-HS-Summary) — 표 I/II 학년 평균·표본 수, AIME I/II의 학년별 점수 분포. 제3자 문서 보관소.
- [MAA AMC Archive, Ian Calaway](https://sites.google.com/view/ian-calaway/amc-archive/) — 저자는 AMC 8 1985–2022 보고서를 디지털화했다고 설명하고, 고교 보고서는 1980–2010 및 2011–2022 디지털 결과를 안내한다. 누락 보고서가 있음을 명시한 연구자 보관소이며 MAA 공식 호스트는 아님.
- [보존된 2022 MAA General Reports 페이지](https://web.archive.org/web/20221209122712id_/http://amc-reg.maa.org/reports/generalreports.aspx) — MAA 구형 통계 페이지의 연도 메뉴와 백분위 리포트 정의를 확인. 재생된 리포트 본문 원자료는 이번 조사에서 확보하지 못함.
- [2011 AMC 8 한국 결과·학년 백분위표 전재](https://www.amcstudy.net/79) — 899명 한국 참가집단, 학년별 평균·인원과 점수별 학년 백분위 표. MAA가 발표한 결과라는 게시물 설명과 원자료 표의 복사본이며, MAA 공식 호스트 자체는 아님. 보고된 전체 인원과 표시된 학년 표 합계가 달라 차이를 보존한다.
- [2009 AMC 8 한국 결과·점수별 학년 분포 전재](https://www.amcstudy.net/43) — 741명 한국 참가집단, 5–8학년 점수별 인원·학년 평균·문항 정답률. MAA 결과의 재전사본으로 취급하고 원본 대조 전에는 계산 percentile을 만들지 않음.
- [MAA 현행 EduView score distribution](https://maa.edvistas.com/eduview/report.aspx?view=1561&mode=6) — 현행 회차별 전체 응시 집단 기준. 학년 선택 필드는 페이지에 없음.
- 2011 AMC 10/12의 학년별 평균·표본 수·전체 평균은 MAA의 당시 공식 경로 `http://amc.maa.org/amc1012/2011/stats/11AMC1012-grandstats.pdf`가 Internet Archive에 보존된 [원본 호스트 스냅샷](https://web.archive.org/web/20130124025158/http://amc.maa.org/amc1012/2011/stats/11AMC1012-grandstats.pdf)에서 확인됐다. PDFKit 텍스트 추출로 4개 시험형과 전체 22개 학년/학년군 행을 기존 Scribd 전재와 대조했다. 통계 수치는 일치했다. 공식 응시자 수와 비공식 응시자 수는 별도 집계라 합치지 않았다. 해당 2011 행의 출처 상태를 원본 MAA 호스트 보존본으로 올렸으며, 다른 2007–2010 고교 통계는 제3자 호스팅 사본 상태를 유지한다.

확인일: 2026-11-04 KST. 과거 표는 역사적 기술통계이며, 현재 학생의 AMC 등급·학년 백분위·배치 판정에 바로 쓰지 않는다.

## 2026-11-04 웹 검색 후 화면 연결

- MAA의 [보존된 General Reports 페이지](https://web.archive.org/web/20221209122712id_/http://amc-reg.maa.org/reports/generalreports.aspx)에서 과거 통계 메뉴의 설명을 다시 확인했다. `Contest Score Grade Report with Percentile`은 점수별 학년 응시자 수와 해당 학년 percentile rank를 표시하는 표라고 안내한다. 현재 아카이브에서 보고서 렌더 결과 전체는 회수되지 않았으므로 이 설명을 데이터로 간주하지 않는다.
- 검색으로 확인한 [2011 AMC 8 한국 결과 전사본](https://www.amcstudy.net/79)은 899명 참가, 7학년 315명, 그리고 점수별 학년 인원과 보고서 기록 백분위를 제공한다. 표시된 학년 합은 894명으로 전체보다 5명 적다. 5학년 이하 구간에는 5학년 68명과 4학년 이하 4명이 합쳐져 72명이다. 이 차이는 삭제·보정하지 않는다.
- 보고서의 집단과 점수, 학년이 모두 맞는 경우의 역사 비교를 위해 `amc8-korea-percentile-reference.js`를 추가했다. 완성한 2011 AMC 8 답안을 입력했을 때 Grade 6–8은 같은 학년 행을, Grade 1–5는 원자료의 `<=5` 행을 보여 준다. 백분위는 원문 표 값을 그대로 표시하며 재계산하지 않는다. 현재 전국 규준·실력 등급·자격 판정으로 읽히지 않도록 2011 한국 응시집단과 학년 표본을 결과에 함께 쓴다.
- 같은 검색에서 [2009 AMC 8 한국 결과](https://www.amcstudy.net/43)도 학년별 평균뿐 아니라 5–8학년 전체 점수별 인원수를 제공하는 것을 확인했다. 기존 빈도 CSV의 각 학년 합계는 보고된 n(5학년 70, 6학년 158, 7학년 262, 8학년 247)과 일치한다. 추가로 이 전체 분포에서 `같은 학년 중 해당 점수보다 낮은 점수를 받은 인원 / 같은 학년 전체 인원 × 100`을 산출하도록 연결했다. 예를 들어 2009 AMC 8 7학년 21점은 이 명시된 계산식으로 84.73%다. 이는 보고서에 적힌 백분위가 아니며, 원자료 점수별 빈도에서 계산한 역사적 동점 전 percentile rank다.
- 전체 점수표의 비어 있는 백분위 및 score 1 미수록은 빈 값으로 남겼다. 출처에 없는 percentile이나 score 1행을 보간·생성하지 않는다.
- 검증: 2009/2011 전사 CSV의 모든 점수·학년 셀과 화면 lookup 데이터를 대조했고, 브라우저에서 2011 Grade 7의 21점 `88.25%` (보고서 값)와 2009 Grade 7의 21점 `84.73%` (명시 계산)을 각각 확인했다. 2011 표본 315명, 2009 표본 262명, 2009 Grade 7의 10점 표시, 다른 연도·학년 숨김 동작도 확인했다.

## 2003–2022 AMC 8 수상 기준선 추가 조사

- [Ivy League Education Center의 역사표](https://ivyleaguecenter.org/2016/10/12/amc-8-historical-results-from-2011-to-2015/)에서 2003–2024 AMC 8의 Honor Roll 및 Distinguished Honor Roll 점수를 확인했다. 데이터는 MAA 구형 `GeneralReports`를 출처로 밝힌 2차 정리다. 2003–2022 중 실제 회차가 있는 19개 연도만 `amc8-award-cutoffs-2003-2022.csv`에 보존했다. 2021 대회는 열리지 않아 행을 만들지 않았다.
- [Think Matrix 과거 수상표](https://www.think-matrix.com/math_planet/awards_setting_and_historical_result/)의 2013–2023 중첩 연도와 대조했고, 2018년은 [해당 회차 점수분포 보고서](https://mathcontest.org/sites/default/files/AMC8-2018-Score-Distribution.pdf)에서도 Honor Roll 15, DHR 19를 확인했다. 2012·2013 일부 사이트가 `>17`로 쓰는 경계는 최소 자격 점수 18과 같은 의미로 정규화했다.
- 과거 회차 응시 결과를 모두 표시한 뒤 같은 연도 전체 응시자 HR/DHR 기준선을 같이 볼 수 있도록 결과 패널을 연결했다. 2023년 이후에는 이미 있는 MAA EduView 상세 분포를 사용한다. 과거 패널은 입력 학년과 무관한 전체 응시자 기준이고, 학생의 공식 수상 여부나 학년 백분위로 해석하지 않도록 분리 표기한다.
- 검증: CSV 19행 모두 lookup 모듈 값 및 출처 URL과 일치하는지 검사했고, 2021과 2023이 이 구형 자료 모듈에서 반환되지 않는 것을 확인했다. 2011 Grade 7의 21점 입력 화면에서 HR 17, DHR 22 기준과 점수 차이가 표시되는 브라우저 확인을 포함해 총 8개 단위·브라우저 검사를 통과했다.

## 2026-11-04 후속 검색: 더 넓은 과거 통계 경로

- Stanford 연구자 Ian Calaway의 [AMC Archive](https://sites.google.com/view/ian-calaway/amc-archive/)는 중학교 AMC 8 요약 책자 1985–2022 디지털 보관이 완료됐고, 고교 요약은 1980–2010 원본 책자와 2011–2022 디지털 결과를 모았다고 설명한다. MAA 공식 저장소는 아니며 자료별 원본 표·연도·정의·접근 조건을 검수한 데이터셋이 아니므로, 다음 연도 확장 시 먼저 회차별 보고서를 확인할 후보 출처로 기록한다.
- 검색에서 확인된 2013·2016 AMC 8 Bard Math Circle 결과 페이지는 `Average score for grade ...`를 포함하지만 개별 행사 집단 보고다. 국가·전체 응시 집단으로 오인하지 않도록 학년 기준치로 사용하지 않는다. 예: [2013 AMC 8 Bard 결과](https://www.bardmathcircle.org/p/2013-amc-8), [2016 AMC 8 Bard 결과](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in). 2016 전국 전체 응시 통계는 99CEF 분석 보고서의 미국·캐나다 집계만 별도로 기록했으며, 학년 평균표는 확보하지 못했다.
- 2016년 사용자 게시물은 구 MAA `GeneralReports.aspx`에서 `Contest Score Grade Report with Percentile` 메뉴를 선택할 수 있었다고 회고하지만, 구동하는 연도별 리포트 본문은 현재 공개 페이지에서 재생되지 않았다. 이 검색 결과는 과거 메뉴의 존재에 대한 단서일 뿐, percentile 데이터 원본으로 쓰지 않는다.
- 따라서 현재 학생 화면의 연도별 학년 평균 적용 범위는 검수 완료된 AMC 8 2001–2009, AMC 10/12 2007–2011 A/B에서 멈춘다. 더 넓은 1980–2022 자료는 보고서 원문과 회차/폼/학년 모집단이 확인될 때만 추가하고, 학교 단위 결과나 수상자 목록으로 빈 연도를 채우지 않는다.

## 2026-11-04 웹 조사 추가: 2007–2010 AMC 10/12 전체 평균

- [MAA 작성 2010 AMC 10/12 Summary of Results and Awards 사본](https://www.scribd.com/document/51428451/2010-HS-summary)의 Table I·II에서 2007–2010 AMC 10/12 A/B 각 폼의 전체 응시 평균을 직접 전사했다. 각 표는 같은 행에 2010·2009·2008·2007 순서로 결과를 싣는다. MAA 고교 연례 보고서 디지털 아카이브의 범위 설명과 교차 확인했고, 현 링크는 제3자 보관본이다.
- 통계 모듈은 같은 표에 명시된 16개 평균만 기존 전체 응시자 기준 비교 패널에 연결한다. 상위 1%/5% 컷오프는 이 보고서 표에서 확인되지 않으므로 이 회차에는 생성하거나 표시하지 않는다. 별도 웹 연도표의 2007–2010 DHR는 MAA 원본 표와 직접 맞출 수 없어 추가하지 않았다.
- 보고서가 명시한 응시 집단은 등록·답안 회수 통계이고, 실제 시험 당시 학년별 표는 기록된 학년으로 구분한다. 여기 추가한 overall average는 학년 평균 모듈과 분리된 전체 응시자 수치다. 현재 학생의 학년 순위나 공식 점수 자격을 뜻하지 않는다.
- 교차 확인: AMC 10 평균 2007–2010 A/B는 Math Gold Medalist의 재인용 연도표와 일치했고, AMC 12 평균 2007–2010 A/B 역시 같은 연도표와 일치했다. 표본·학교 수는 이 화면에 붙이지 않고, 2010 연례 보고서 표의 등록 수를 현대 MAA `answer forms received` 값과 혼합하지 않는다.

## 2026-11-04 웹 검색 추가: 2002–2006 AMC 10/12 전체 평균

- [MAA 작성 2005 AMC 10/12 연례 보고서 사본](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions)의 Table I에서 2002–2005 AMC 10/12 전체 응시 평균을 회차별로 확인했다. [MAA 작성 2008 AMC 고교 연례 보고서 사본](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions)의 Table I·II에서는 2006 AMC 12 A/B와 AMC 10 A/B 전체 응시 평균을 확인했다. 두 보고서는 MAA 저작물이지만 현재 접근 가능한 파일은 제3자 호스팅 사본이다.
- AMC 10은 2002A 68.5, 2002B 74.9, 2003 A/B 74.4/79.6, 2004 A/B 69.1/80.4, 2005 A/B 74.7/77.9, 2006 A/B 79.0/68.5; AMC 12는 2002 A/B 72.7/80.8, 2003 77.8/76.6, 2004 73.9/84.5, 2005 78.7/83.4, 2006 85.7/85.5로 확인했다. 2002 AMC 10 B 전체 평균은 MAA 원본 Table I 시각 대조와 grade-count 가중 평균(74.86→74.9), 그리고 공개 연도표가 모두 일치한다. 2002 AMC 10 B 학년별 셀은 Table II에서 인원과 평균이 함께 확인되는 학년만 사용한다.
- 추가한 값은 평균만 표시한다. 역사적 Top 1%·Top 5% 경계나 학년 규준을 만들어 붙이지 않는다. 2000–2001 전체 평균은 이 시점에는 미수록으로 남겼고, 이후 2차 통계표에서 확인한 값은 아래 절에 출처 등급을 별도로 명시해 추가했다. 2010 보고서의 `School Winner Scores` 역사표는 학교별 우승자 평균이므로 전체 참가자 평균으로 재사용하지 않았다.
- 검수: AMC 10/12 2006 값은 두 공개 연도표와 MAA 보고서 표가 일치하는 값만 채택했다. 연례 보고서 Table I/II의 모집단 정의와 2010의 학교 우승자 별도 표를 구분했다. 코드 참조 테스트에 2002–2006 회차·폼, 미확인 2002 AMC 10 B 차단, Top 1% 미생성 확인을 추가했다.

## 2026-11-04 웹 검색 추가: 2000–2001 AMC 평균 및 원본 풀이

- [AMC 10 연도별 통계표](https://mathgoldmedalist.com/competitions/amc-10)는 2000 평균 64.2, 2001 평균 67.8을, [AMC 12 연도별 통계표](https://mathgoldmedalist.com/competitions/amc-12)는 2000 평균 64.9, 2001 평균 56.6을 기재한다. 이 페이지는 MAA 역사 보고서를 출처로 안내하지만, 제공 통계 파일을 전사했으며 일부 값을 MAA 원보고서와 독립 검증하지 못했다고 명시한다. 따라서 네 값은 2차 자료 참고값으로 평균만 화면에 표시하고 백분위·학년 규준·공식 자격으로 확장하지 않는다. [MAA K–12 공개 결과 화면](https://maa.edvistas.com/eduview/report.aspx?view=1561&mode=6)은 교차 확인 경로로 연결했다.
- [2001 AMC 10 원본 시험 PDF](https://f.hubspotusercontent30.net/hubfs/981338/Math%20Competition%20Problems_PDFS/2001AMC10.pdf), [2001 AMC 10 공식 풀이 PDF](https://f.hubspotusercontent30.net/hubfs/981338/Math%20Competition%20Problems_PDFS/2001AMC10-solutions.pdf), [2001 AMC 12 공식 풀이 PDF](https://f.hubspotusercontent30.net/hubfs/981338/Math%20Competition%20Problems_PDFS/2001AMC12-solutions.pdf)를 확인했다. 원본들은 MAA 저작권 표기를 포함한다. 시험지 내용은 저장소에 복제하지 않고, 허가를 명시한 LIVE 연도별 아카이브의 인쇄·온라인 응시·정답·풀이 경로를 이용한다.

## 2026-11-04 웹 검색 추가: 2010–2011 AMC 8 집계

- 실제 연도별 문제 자료도 검색으로 교차 확인했다. MAA의 [2010 AMC 8 원본 PDF](https://f.hubspotusercontent30.net/hubfs/981338/Math%20Competition%20Problems_PDFS/2010%20AMC8.pdf)는 2010년 11월 16일 시행, 25문항·40분, 계산기 미사용 조건을 명시한다. 프로젝트의 연도별 문제지는 이처럼 샘플 대신 회차별 공개 원본으로 연결하고, 문항 내용을 로컬 저장소에 복제하지 않는다.
- 2011 AMC 8의 과거 MAA 통계 페이지 경로를 확인했다: `http://amc.maa.org/amc8/2011/stats/2011-amc8stats.shtml`. 검색 결과가 가리키는 시험 당시 통계 소개는 약 1,300개 학교·84,000명 규모의 초기 집계로 설명한다. 이 분모는 [당시 공개 통계를 인용한 포럼 게시물](https://ww123.net/archiver/tid-4720219-page-3.html)에 남아 있다. MAA 호스트는 현재 403을 반환하고, 보존본의 연결 파일을 이 검색 세션에서 완전히 회수하지 못했으므로 이를 최종 국가 전체 규준이나 점수×학년 표로 전사하지 않았다.
- 해당 회차의 [MAA Grade and Gender Average PDF 경로](http://amc.maa.org/amc8/2011/stats/statestatistics/_Overall/Grade_and_Gender_Average.pdf)는 당시 페이지가 링크한 별도 보고서다. 현재까지 본문과 모집단 정의를 검수하지 못해 2011 글로벌 학년 평균으로는 사용하지 않는다.
- [AMC Study의 2011 한국 결과 재현](https://www.amcstudy.net/79)은 한국 참가자 899명의 학년별 평균·참가자 수를 제공한다(초등 이하 4명, 5학년 68명, 6학년 252명, 7학년 315명, 8학년 255명). 이는 이미 `amc8-korea-grade-means-2009-2011.csv`에 별도 한국 표본으로 보존되어 있다. 등급 비교는 한국 코호트와 MAA의 글로벌/미국 통계를 서로 합치지 않는다. 게시물의 개인별 수상자 목록은 연구 데이터로 복사하지 않았다.
- 2010 AMC 8에서는 당시 포럼에 MAA `Details Report`의 점수별 일부 학년 셀(25점·24점 등)과 한국 응시자 전용 표가 함께 인용되어 있다. 일부 행만으로 완전한 점수×학년 분포를 재구성할 수 없고, 한국 표본과 전체 표본이 섞일 위험이 있어 해당 점수별 기준치는 추가하지 않았다. 별도의 전체·학년별 평균은 아래 회수 기록을 참고한다. [2010 AMC 8 결과 인용 페이지](https://www.321ww.org/archiver/tid-4605419.html).
- 2010 통계 페이지를 Internet Archive의 MAA 원래 호스트 보존본에서 추가 회수했다. 이 페이지에는 전체 평균 9.98, 전체 참가자 153,211명, 결과 제출 학교 2,342곳 및 5–8학년별 평균·인원이 실려 있다. 기록 학년 행은 150,616명이므로 2,595명은 이 표의 학년 그룹에 배정되지 않았다. 정확한 학년별 평균만 `amc8-grade-means-2010.csv`와 같은 학년 lookup에 연결했다. 이는 점수별 학년 분포나 백분위 자료가 아니다. [MAA 2010 AMC 8 통계 페이지 보존본](https://web.archive.org/web/20130707194038/http://amc.maa.org/amc8/2010/stats/2010-amc8stats.shtml)
- 2011 AMC 8 MAA [통계 페이지 보존본](https://web.archive.org/web/20130204052822/http://amc.maa.org/amc8/2011/stats/2011-amc8stats.shtml)은 본문에서 `2011 General Statistics`라고 표시하고 Overall 지역·Grade and Gender Average·Contest Score Grade Report with Percentile 항목을 제공한다. 다만 Internet Archive CDX의 `statestatistics/*` 경로 조회에서 보존된 Overall 파일은 Achievement Roll과 School Honor Roll뿐이었고, 평균/점수×학년 산출 PDF는 회수되지 않았다. 페이지 내비게이션의 `2010 Statistics` 표기는 본문 시험연도와 구별한다. 개별 학교 점수표나 2011 한국 참가자 표본은 MAA 전체 모집단으로 대체하지 않는다. 따라서 2011은 `no-grade-table-recovered`로 유지한다. 이는 해당 연도 자료가 없다는 뜻이 아니라, 모집단·학년·지표를 함께 검수한 표를 아직 등록하지 않았다는 뜻이다.
- 별도로 보존된 [MAA 2011 AMC 8 Summary Report 이미지](https://web.archive.org/web/20121108193052id_/http://amc.maa.org/amc8/2011/AMC8_SummaryReport.jpg)를 직접 확인했다. 총 참가자 152,770명, 평균 10.76, 표준편차 4.44와 전체 점수 분위 경계만 보여 주며 학년 열은 없다. 그러므로 이 이미지는 회차 전체 점수 분포에는 참고가 되지만 학년 비교 공백을 메우지 않는다. 전체 지표는 기존 AMC 점수 분포 자료와 중복되어 별도 수치 행으로 복사하지 않았다.

## 2026-11-04 웹 검색 추가: 2009 AMC 8 전체 기록 점수×학년 분포

- [당시 MAA 결과표를 옮긴 게시물](https://www.321ww.org/archiver/tid-4605419.html)에서 2009 AMC 8 점수 0–25의 recorded grade별 인원표를 회수했다. 표는 5학년·6학년·7학년·8학년 열로 전재되어 있으나, 첫 열의 합 3,874명이 MAA 연례 보고서의 `4 & 5` 묶음과 일치한다. 제품과 CSV에서는 열 제목의 모호함을 피하기 위해 첫 열을 `4–5학년`으로 기록했다. Grade 4와 5 개별 값으로 나누지 않는다.
- 표의 모든 점수 셀을 [`amc8-2009-global-grade-score-counts.csv`](../competition/historical-amc-grade/amc8-2009-global-grade-score-counts.csv)에 기록하고, 결과 화면에 2009년 해당 학년·점수 분포에서 **해당 점수보다 낮은 점수를 받은 응시자 비율**을 계산해 표시하도록 연결했다. 이 비율은 공식 percentile이 아니다. 현재 기준, 능력 등급, 수상 판정으로 쓰지 않는다. 대한민국 자료의 2009/2011 표본은 기존 패널에 계속 분리해 둔다.
- 독립 대조로 [MAA 작성 2009 AMC 8 연례 보고서 사본](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html)의 학년별 recorded 참가자 수와 평균을 사용했다. 새 표 점수 빈도는 4–5학년 3,874명·평균 9.45, 6학년 20,688명·9.17, 7학년 50,218명·10.08, 8학년 73,220명·10.82를 모두 정확히 재현한다. 0점 두 행(일부 문항 시도/무응답)은 점수분포용 CSV에서 합쳤다. 연례 보고서는 이 수치를 규준·배치 시험으로 쓸 수 없다고 명시하므로 역사적 기술통계에 한정한다.
- 검증: 104개 grade×score 행(4개 grade group × 26개 score)을 점검했고 각 인원 합계와 네 학년 평균이 보고서와 일치함을 확인했다. 데이터 모듈은 2009, Grade 4–8, score 0–25 조합에서만 응답하며 Grade 1–3, Grade 9+, 다른 연도는 숨긴다.
- 이번 추가로 완전한 세계/전체 보고 학교 표로 확인된 AMC 8 점수×학년 분포는 2009 한 회차다. 2010의 일부 상위 점수행과 2011의 약 84,000명 초기 표본 상위 점수행은 계속 참고기록에만 두고, 완전한 최종 분포인 것처럼 확장하지 않는다.

## 2026-11-04 웹 검색 추가: 2010 AMC 8 문항별 응답 분포

- [AMC Study의 2010 AMC 8 문항 난도표 게시물](https://www.amcstudy.net/71)은 해당 표가 MAA가 공개한 난도 자료이며 153,211명 응답을 문항별 퍼센트로 집계했다고 설명한다. 표 이미지에는 A–E 선택, 공란, 판독불가, 정답 선택 비율이 나온다. MAA 원본 호스트 자체가 아닌 제3자 재게시이므로 출처 상태를 그렇게 기록한다.
- 표 이미지의 값은 Apple Vision OCR로 전사한 뒤 원본 이미지를 눈으로 대조했다. 정답 열은 [2010 AMC 8 공개 답안](https://live.poshenloh.com/past-contests/amc8/2010/answers)과 문항별로 일치하는지 확인했다. 빨간색으로 칠한 AMC Study 자체 예상 문항과 적중률 주장은 데이터로 옮기지 않았다.
- 응답 비율은 [`amc8-2010-item-response-percent.csv`](../competition/historical-amc-grade/amc8-2010-item-response-percent.csv)로 보존하고 `amc8-item-response-reference.js`에서 2010 AMC 8에만 조회한다. 답을 입력한 오답에는 당시 전체 응답자의 정답률과 해당 선택지 비율을, 답 입력이 없는 오답·공란에는 정답률 및 가장 많이 선택한 오답을 보여 준다. 이는 전체 응시자 표본의 문항 통계로서 학년별 점수 비교, 현재 규준, 개인 능력 등급으로 설명하지 않는다.
- 개별 문항 응답 비율은 학년 점수표가 발견됐다는 의미가 아니다. 2010 AMC 8 전 세계 학년별 점수 빈도표는 이번 검색에서 완전한 검증본을 찾지 못했다. 2011 초기 통계 조각, 중국 지역 표, 특정 학교 결과는 전체 집단의 학년 규준으로 전환하지 않았다.

## 2026-11-04 웹 검색 추가: 2009·2011 AMC 8 문항 응답 분포

- 검색으로 [2009 AMC 8 결과](https://www.amcstudy.net/43)와 [2011 AMC 8 결과](https://www.amcstudy.net/79)에 실린 MAA 응답 분포 표를 확인했다. 각 표본은 해당 페이지의 한국 AMC 8 참가 코호트(2009년 741명, 2011년 899명)다. 표의 웹 텍스트를 전사했고 이미지 OCR은 필요하지 않았다. 2009 정답 키는 [LIVE 2009 answer key](https://live.poshenloh.com/past-contests/amc8/2009/answers), 2011 정답 키는 [LIVE 2011 answer key](https://live.poshenloh.com/past-contests/amc8/2011/answers)와 문항별 대조했다.
- 2009년 12번은 LIVE 정답표의 답 D와 응답표의 Correct Response 별표(D, E)를 구분한다. 앱 정답 키는 D로 두고 집단 정답 응답률은 D+E 65.18%를 표시한다. 2009년과 2011년 각 25문항의 A–E·공란·판독 불가 비율 합계가 반올림 허용 범위 안에서 100%인지 확인한다.
- 원자료를 [`amc8-2010-item-response-percent.csv`](../competition/historical-amc-grade/amc8-2010-item-response-percent.csv)에 추가하고 결과 화면의 문항 응답 맥락을 연도별로 확장했다. 각 연도에 오답/미응답 문항만 표시하며, 선택한 실제 응시 코호트와 데이터 출처를 밝혀 2009/2011 한국 참가집단과 2010 MAA 전체 응답 집단을 섞지 않는다. 이는 학년 비교, 현재 규준, 개인 능력 등급이 아니다.
- 2008년 MAA 출력 형식의 자료도 발견했지만 특정 학교의 51명 등 소표본이므로 제품 기준에는 포함하지 않았다. 게시물에 있는 학생 이름·수상자 목록은 복사하지 않는다. AMC Study 재게시에는 CC BY-NC-ND 안내가 표시되어 있어 데이터에 귀속과 원출처 링크를 남기고, 해당 기관의 예측표와 자체 적중률 주장은 제외한다.
- 통계 전사와 lookup 검증, 수정 후 브라우저 UI 검수를 완료했다. 2009 Q3에 A 오답을 표시해 한국 741명 코호트, 90.28% 정답률, A 선택 7.42%, 원본 풀이·응답 출처 링크가 함께 보이는 것을 확인했다. 2011 Q4에서도 899명 코호트와 59.96% 정답률, A 선택 14.57% 및 출처 링크를 확인했다. Local only; no push, deployment, or Drive sync.
- 웹 검색에서 2013 AMC 8 학교별 MAA 결과 PDF도 회수했다. Mathematics Ed Clinic Grade 7은 63명으로, 공개 문항 응답 비율은 있지만 단일 학교 집단이다. 전국/현재 Grade 7 기준으로 사용하지 않으며, 화면에서 모집단을 명확히 구분할 수 있을 때만 별도 코호트로 검토한다. 출처: https://asiamathsalliance.com/amc8/results/MEC.pdf


## 2026-11-04 웹 검색 추가: 2013 AMC 8 학년별 학교 문항 응답표

- [MAA 생성 Mathematics Ed Clinic 2013 AMC 8 성적표 사본](https://asiamathsalliance.com/amc8/results/MEC.pdf)에서 Grade 7 63명, Grade 8 55명의 각 25문항 응답 비율을 확인했다. 응답 표에는 A–E, 공란, 판독불가, 정답 선택 비율이 함께 있다. 개별 학생 이름·점수는 가져오지 않았다.
- Grade 7·8의 50개 문항 집계 행을 [`amc8-2013-school-grade-item-response.csv`](../competition/historical-amc-grade/amc8-2013-school-grade-item-response.csv)에 전사하고, 문항 답을 [LIVE 2013 AMC 8 공식 답안표](https://live.poshenloh.com/past-contests/amc8/2013/answers) 25개와 전부 대조했다. 공식 MAA 콘텐츠 사용 허가를 안내하는 [LIVE 원본 시험 페이지](https://live.poshenloh.com/past-contests/amc8/2013)에는 인쇄 PDF·정답표·전문 풀이 링크가 연결되어 있다.
- 복습 화면은 시험연도와 응시 당시 학년이 2013 Grade 7 또는 Grade 8로 일치할 때만 해당 코호트의 문항 응답 비율을 보여 준다. 표본이 각각 63명·55명인 특정 학교 기록이므로 전국 등급 비교·백분위·능력 판정으로 표시하지 않는다. 다른 학년은 표시하지 않는다.
- 전체 25문항의 선택지·공란·판독불가 비율 합계를 전사값에서 확인하는 참조 검사를 추가했다. 기존 연도 참조(2009–2011) 동작도 그대로 검사한다.

## 2026-11-04 웹 검색 추가: 2015 AMC 8 Grade 7 학교 문항 응답표

- [2015 AMC 8 MAA 학교 결과 PDF](https://asiamathsalliance.com/2015/amc8/03057F.pdf)에서 싱가포르 한 학교의 Grade 7 응시자 10명에 대한 25문항 선택지 응답 비율을 확인했다. [`amc8-2015-school-grade7-item-response.csv`](../competition/historical-amc-grade/amc8-2015-school-grade7-item-response.csv)에 집단 집계만 옮겼다. 원본 보고서의 별표 정답은 [LIVE 2015 AMC 8 공식 답안표](https://live.poshenloh.com/past-contests/amc8/2015/answers)와 대조했다.
- 복습 화면은 2015 AMC 8 Grade 7에서만 해당 표본을 연결하고, 특정 학교 집단이며 전국 학년 기준이 아니라고 표시한다. 단일 학교·10명 표본이므로 2013 보고서나 전국 학년 평균과 합치지 않는다. 원본 PDF의 학생 이름/개인 점수는 CSV에 복사하지 않았다.
- 참조 검사에서 2013 Grade 7/8 50문항과 2015 Grade 7 25문항의 표본 수, 정답키, 선택지·공란·판독불가 합계 및 지원 학년 범위를 확인했다. CSV 25행과 화면 참조 모듈의 선택지별 비율도 전부 대조했다. 브라우저에서 2015 Q8 답 C 오답 예시를 넣어 60% 정답 응답률, 30% C 선택, 전국 규준이 아닌 학교 표본 안내를 확인했다.

## 2026-11-04 웹 검색 추가: 2017–2021 AMC 연도별 공개 결과 자료와 MAA 기록 확인

- Internet Archive에 보존된 [MAA AMC Historical Statistics 화면](https://web.archive.org/web/20220204191809id_/http://amc-reg.maa.org/reports/generalreports.aspx)은 `Contest Score Grade Report with Percentile`을 점수별 학년 인원과 percentile rank 표로 설명한다. 2022-02-04 캡처의 선택 목록에는 AMC 8 2020(ID 87), AMC 10/12 2020 A/B(ID 83/84), AMC 10/12 2021 봄 A/B(ID 88/89), 2021 가을 A/B(ID 93/94)가 구분돼 있다. 2009–2021의 다른 선택 항목도 남아 있다. 이 페이지는 통계 종류와 대회 ID를 확인하는 근거이며, 선택 후 만들어지는 보고서 본문은 캡처에 포함되지 않는다.
- [IvyTrack의 연도별 MAA 결과 재인용 표](https://www.ivytrack.org/forum.php?action=printable&mod=viewthread&tid=19383)는 AMC 10/12 2017–2021의 form별 평균, Distinction/HR, DHR, AIME 경계를 싣는다. MAA 원본이 아닌 2차 편집 자료다. 특히 2021년을 봄·가을로 나눠 적는다. [Think Academy의 2021 AMC 10 자료](https://beta-us.thethinkacademy.com/blog/amc-10-faq-and-resources-your-ultimate-guide/)도 2021 봄·가을 값을 별도 행으로 재인용한다. 출처 간 수치가 충돌하는 경우 앱 행에서 제외한다.
- 2017 AMC 10 A의 요약표 하나는 DHR을 112.5로 적지만 세부 결과표에는 DHR 127.5·HR 112.5로 나와 맞지 않는다. 앱에는 세부 결과표 값을 택하고 충돌 메모를 남겼다. 2018 AMC 12 B 값은 AMC 10 B 행의 값과 섞인 표가 있어 처음에는 보류했다. 추가 검색에서 [AMC 12 공식 국제 사이트의 결과 표](https://www.amc12.org.cn/ssgz)와 [IvyTrack 재인용표](https://www.ivytrack.org/forum.php?action=printable&mod=viewthread&tid=19383)가 DHR 126·AIME 경계 99·평균 57.85로 일치하는 것을 확인해, 이 세 항목만 앱에 추가했다. 2021 AMC 12 B의 `7.17` 표기는 평균으로 사용하지 않는다.
- 2021 봄·가을 응시 인원과 점수분포 이미지의 추가 재인용은 [TestDaily의 2021 가을 결과 분석](https://www.testdaily.cn/55839/)에서 대조했다. 이 페이지가 MAA 자료라고 설명한 이미지 통계와 연도별 텍스트 재인용의 평균 사이에도 차이가 있어, 인원·문항 응답·점수분포 이미지는 앱 점수 기준으로 옮기지 않았다.

### 2012–2016 AMC 10/12 공개 결과 기준선 추가

[IvyTrack의 AMC 10/12 연도별 MAA 결과 재인용표](https://www.ivytrack.org/forum.php?action=printable&mod=viewthread&tid=19383)와 [Math Gold Medalist의 전체 연도 통계표](https://mathgoldmedalist.com/competitions/amc-10), [AMC 12 통계표](https://mathgoldmedalist.com/competitions/amc-12)를 대조했다. 2012–2016의 평균과 DHR(상위 1% 경계)은 표 사이에서 일치해 AMC 10/12 A/B 연도 참조에 추가했다. 이번에도 MAA 원본 통계표 파일은 직접 회수하지 못했으므로 앱에는 제3자 재인용 출처·모집단 한계가 표시된다. AIME 진출선은 별도 자격 지표이므로 이 상위 1%·평균 패널에 섞지 않았다.

| 연도 | AMC 10 A DHR / 평균 | AMC 10 B DHR / 평균 | AMC 12 A DHR / 평균 | AMC 12 B DHR / 평균 |
|---:|---:|---:|---:|---:|
| 2012 | 121.5 / 72.51 | 133.5 / 76.59 | 109.5 / 64.62 | 114 / 70.08 |
| 2013 | 117 / 72.50 | 129 / 72.62 | 106.5 / 65.06 | 108 / 64.21 |
| 2014 | 132 / 63.34 | 132 / 71.42 | 109.5 / 63.60 | 121.5 / 68.12 |
| 2015 | 115.5 / 73.39 | 132 / 76.09 | 117 / 69.90 | 126 / 66.88 |
| 2016 | 120 / 65.31 | 124.5 / 65.40 | 111 / 60.32 | 127.5 / 68.65 |

이 기준선은 모든 점수 구간 분포가 아니라 재인용 자료에서 확인한 평균과 상위 1% 경계 두 항목만 제공합니다. 따라서 평균보다 낮은 점수를 받은 비율이나 Top 5/10/25%를 추정하지 않았고, 이 값만으로 학년 위치를 산출하지 않는다.

## 2026-11-04 후속 검색: AMC 10 학년별 원자료 회수 상태

- [MAA 역사 통계 페이지의 2022년 Internet Archive 캡처](https://web.archive.org/web/20220204191809/http://amc-reg.maa.org/reports/generalreports.aspx)에서 2009–2021년 contest report 목록과 `Contest Score Grade Report with Percentile` 항목을 확인했다. 이 목록은 AMC 10/12의 A/B, 2021 봄·가을 회차를 나눠 보여준다. 현재 MAA 호스트는 브라우저에서 521 오류를 반환했다. Internet Archive 캡처에서 2021 AMC 10A를 선택해 봤지만 보고서 본문이 보존되어 있지 않아 학년별 점수표를 회수하지 못했다.
- [2010 MAA High School Summary 재게시본](https://www.scribd.com/document/51428451/2010-HS-summary)은 2007–2010 AMC 10/12 폼별 Grade 10, Grade 9, `Grade 8 and below`, 학년 미기록의 참가 인원과 평균을 싣는다. 이 자료에서 Grade 7을 따로 분리할 수 없으며, 해당 2007–2010 집계는 기존 [`amc10-12-grade-means-2002-2011.csv`](../competition/historical-amc-grade/amc10-12-grade-means-2002-2011.csv)에 이미 포함돼 있다. 2011은 앞서 기록한 Internet Archive 보존 MAA 보고서다.
- [2019 AMC 10A Grade 7 전국 평균 59.72 (1,982명)](https://www.archimedean.org/amc-grade-7-student-sailalitha-kodukula-makes-history/)가 현재 AMC 10 전국 기준선에서 사용할 수 있는 정확 학년·폼 일치 자료다. 학교가 MAA 통계를 인용한 2차 출처이며, 앱에서 오직 2019 AMC 10A · Grade 7에 한해 평균과 표본 수를 보여준다.
- 2021 Grade 7 점수 경계 수치는 검색에서 교육자 포럼 게시물로만 재발견했다. MAA 보고서 본문을 회수하지 못했고 포럼은 원자료가 아니므로 수치·백분율·상위권 인원은 제품 데이터에 추가하지 않았다. AMC 10/12의 2007–2011 학년별 평균, 2012–2021 전체 응시자 평균·상위 경계는 학년별 결과와 별개로 취급한다.
- 따라서 이번 검색으로 새 전국 학년별 행은 추가하지 않았다. 근거가 있는 현행 데이터만 유지하고, 이후 MAA 연도별 Grade Report 본문 또는 원본 보고서를 확보할 때 연도·폼·학년·표본 수를 확인해 차례로 보강한다.

### 2026-11-05 · 2005 AMC 10/12 네 폼의 기록 학년 평균 추가

- 2005 AMC 10A/B와 AMC 12A/B의 폼별 학년 참가 인원·평균은 [56th annual report copy](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions)와 [2008 MAA High School Summary copy](https://studylib.net/doc/8366398/2008-high-school-summary---american-mathematics-competitions)의 비교표를 함께 확인해 전사했다. 두 자료 모두 MAA 작성 보고서의 제3자 호스팅 사본이다.
- `amc10-12-grade-means-2002-2011.csv`에 총 22개 행이 추가되었다. 학년별 참가 인원 합은 공식 참가자 수와 일치하며, 반올림된 학년 평균의 가중평균은 보고서 전체 평균(10A 74.7, 10B 77.9, 12A 78.7, 12B 83.4)과 일치한다. exact grade는 AMC 10의 8–10학년, AMC 12의 8–13학년이며 `unknown`은 별도 보존했다.
- `amc-historical-grade-reference.js`가 같은 연도·폼·학년 선택에서만 해당 기록 평균을 반환하도록 연결했고, 네 AMC 원본 행을 coverage manifest에서 staged로 표시했다. 이 표본은 보고서의 기록 학년 응시자 집단이며 국내/국제 범위가 학년 표에서 분리되지 않는다. 현재 규준, 백분위, 실력 레벨, AIME 자격 예측으로 해석하지 않는다.

| 시험 연도 | 구분 | A | B | 출처에 실린 항목 |
|---|---|---|---|---|
| 2017 | AMC 8 | — | — | DHR 20, HR 17 |
| 2018 | AMC 8 | — | — | DHR 19, HR 15 |
| 2019 | AMC 8 | — | — | DHR 23, HR 19 |
| 2020 | AMC 8 | — | — | DHR 21, HR 18 |
| 2017 | AMC 10 | DHR 127.5, HR 112.5, 평균 59.33 | DHR 136.5, HR 120, 평균 66.56 | 세부 재인용 |
| 2018 | AMC 10 | DHR 127.5, HR 100.5, 평균 53.84 | DHR 123, HR 97.5, 평균 57.81 | 세부 재인용 |
| 2019 | AMC 10 | DHR 123, HR 96, 평균 51.66 | DHR 121.5, HR 102, 평균 58.42 | 세부 재인용 |
| 2020 | AMC 10 | DHR 124.5, Distinction 105, 평균 64.29 | DHR 120, Distinction 103.5, 평균 61.22 | 세부 재인용 |
| 2021 봄 | AMC 10 | DHR 132, Distinction 112.5, 평균 65.53 | DHR 126, Distinction 108, 평균 62.31 | 봄 회차 |
| 2021 가을 | AMC 10 | DHR 117, Distinction 100.5 | DHR 120, Distinction 100.5 | 평균은 재인용 출처 간 불일치로 앱 미표시 |
| 2017 | AMC 12 | DHR 115.5, HR 96, 평균 57.0 | DHR 129, HR 100.5, 평균 58.35 | 세부 재인용 |
| 2018 | AMC 12 | DHR 120, 평균 56.36 | DHR 126, Distinction/AIME 경계 99, 평균 57.85 | 독립 연도표 교차 확인 |
| 2019 | AMC 12 | DHR 121.5, 평균 49.22 | DHR 123, 평균 56.73 | 세부 재인용 |
| 2020 | AMC 12 | DHR 123, Distinction 100.5, 평균 61.42 | DHR 120, Distinction 97.5, 평균 60.47 | 세부 재인용 |
| 2021 봄 | AMC 12 | DHR 133.5, Distinction 114, 평균 67.42 | DHR 132, Distinction 109.5, 평균 61.55 | 봄 회차 |
| 2021 가을 | AMC 12 | DHR 130.5, Distinction 111 | Distinction 103.5 | 평균은 재인용 출처 간 불일치; B형 DHR도 130/130.5로 충돌 |

- [AMC 8 최근 연도 표](https://www.thethinkacademy.com/blog/amc-8-faqs-the-ultimate-guide-for-first-time-test-takers/)는 2020 HR/DHR 18/21과 평균 10을 별도로 싣는다. 다른 제3자 페이지도 2020 AMC 8 HR/DHR 18/21을 싣지만, 2018 평균과 상위 경계의 공개 MAA 보고서처럼 보고서 본문·표본 세부가 확인된 것은 아니다. 기존 2018–2019·2022–2026 보고서 참조와 합치지 않는다.
- AMC 10/12의 AIME 진출선은 별도의 자격 경계이며, 위 표의 DHR·평균·참가자 수와 다른 통계다. 연도표 하나로 혼합하거나 DHR을 AIME Qualifier로 번역하지 않는다. [Ivy League Education Center의 연도별 자격 경계 표](https://ivyleaguecenter.org/2016/01/23/1487/comment-page-1/)는 2000–2025 AMC 10/12의 폼별 자격선을 재인용한다. 제품의 별도 AIME 기준 자료와 교차점검할 때만 사용한다.
- [2020 AMC 10/12 결과 요약 PDF](https://assets.website-files.com/6723d2eea35e367ec7173476/672706ed1a5a1688267f631f_50408871957.pdf)는 2020의 DHR/AIME 관련 수치를 일부 싣지만, 국제 지역 결과와 전국 자료를 분리해 설명하므로 전국 모집단 값으로 대체하지 않는다. 이처럼 회차, 지역, 평균·수상·자격 통계를 분리해 출처별로 기록한다.
- 결과 화면은 2017–2021에서 확인된 회차별 점수 경계와 평균만 연결한다. 2021 원본 회차 A–D는 `봄 A/B · 가을 A/B`로 보인다. 출처 간 값이 충돌하는 항목은 비워 두며, 표본 수·표준편차가 확보되지 않은 행은 표시하지 않는다. 제3자 재인용 자료이므로 출처 범위를 화면에 밝히고, 학년 규준·현재 실력 등급·공식 자격으로 해석하지 않는다.

## 2026-11-04 웹 검색 추가: 2019 AMC 8 MAA Overall 학년별 점수 분포

- [北京新东方의 2019 AMC 8 성적 분석](https://bj.xdf.cn/zixun/beimei/97334.html)에서 MAA가 발표한 2019 score report 이미지 3개와 설명을 확인했다. Grade score report는 `Location: Overall`로 표시되며, 별도 보고서 요약은 학년별 표본 수와 평균을 싣는다. 점수×학년 퍼센타일 표는 25점부터 0점까지 점수별 인원과 학년별 누적 위치를 제공한다. 기사 설명에서 전체 응시 수·상위 경계·평균을 확인했고, embedded report 요약 이미지의 전체 표본은 94,620명이다.
- 이미지 표는 Apple Vision OCR로 읽고 원본 이미지를 직접 확인해 전사했다. Grade 6/7/8, `<=5`, 학년 미기록 그룹 각각의 점수 0–25 빈도(총 130 셀)를 [`amc8-2019-global-grade-score-counts.csv`](../competition/historical-amc-grade/amc8-2019-global-grade-score-counts.csv)에 넣었다. 상위 5학년 이하 버킷을 Grade 4, 5 등으로 나누지 않았다. 학년 미기록 그룹은 원본 보존과 표본 총계 검증에만 쓰고 학년별 비교에서 제외했다.
- 독립 대조: 각 행에서 그룹별 빈도를 합산하면 보고서 수(4,396; 18,245; 30,327; 40,167; 학년 미기록 1,485명)와 일치한다. 점수 가중 평균은 각각 8.48, 8.50, 9.35, 10.06, 8.09로 반올림되어 보고서 요약(Grade ≤4 896명 평균 8.40, Grade 5 3,500명 평균 8.50, Grade 6/7/8, 미기록, 전체 9.43)에 맞는다. `<=5`의 평균 8.48은 Grade ≤4와 Grade 5 보고 행을 합친 계산값이다. 모든 그룹 수 합 94,620이 내장 보고서의 총계와 일치한다.
- AMC 8 복습 결과는 2019 회차에서만 정확 Grade 6–8 또는 원자료의 `5학년 이하` 버킷과 맞춰 점수보다 낮은 점수의 응시 비율을 보여준다. 이는 원자료 표의 누적 비율을 그대로 옮기지 않고 점수별 빈도에서 재계산한 엄격한 lower-share이며, 공식 개인 percentile·현재 규준·수상 판정·능력 등급으로 해석하지 않는다. 기사 설명은 2019 평균/전체 응시를 9.43/94,675라고 서술하지만 보고서 이미지 요약과 score×grade 표는 9.43/94,620이다. 구조적 대조가 가능한 내장 보고서 이미지의 표본 총계 94,620을 기준으로 하고, 기사 본문 수치 불일치는 이 출처 제한으로 남긴다.
- 근거 범위 manifest에서 AMC 8 2019를 완전한 학년 점수 분포 staged로 표시했다. MAA 원본 링크가 아니라 MAA 보고서를 재게시한 제3자 페이지이므로 secondary-host 제한을 유지한다.
- 후속 검색에서 [2018 AMC 8 Contest Score Report PDF 재게시본](https://www.mathcontest.org/sites/default/files/AMC8-2018-Score-Distribution.pdf)을 확인했다. 여기에는 전체 응시자 기준 상위 1·5·25·50·75% 점수선, 평균 8.51, 표준편차 3.68, 응시자 98,448명이 있지만 학년별 분포는 없다. 따라서 기존의 2018 학년 비교 미수록 상태를 유지한다.
- [Think Matrix의 AMC 8 2022 결과 페이지](https://www.think-matrix.com/math_planet/awards_setting_and_historical_result)에서 “Contest Score Grade Report” 이미지와 해당 표를 설명하는 문구를 확인했다. 연결된 Shimo 이미지의 서명 URL은 만료되어 표 내용을 회수하지 못했다. 점수별 학년 수치를 만들지 않고 커버리지에서 `grade-report-image-unavailable`로 구분한다. 같은 해의 전체 점수 요약(평균·컷)은 별도 표로 확인되지만 학년 분포를 대체하지 않는다.

## 2026-11-04 추가 웹 확인: 2022 AMC 8 전체 점수 보고서

- 검색에서 [2022 AMC 8 MAA Contest Score Report 이미지](https://p8.itc.cn/q_70/images03/20230706/2c9a1bf35856404c9fc1caddfcb8e0d5.png)가 포함된 재게시 페이지를 찾았다. 이미지 머리말은 `Contest Score Report - AMC 8 2022`, 자료 기준일은 `2/25/2023`이다. Apple Vision OCR 전사 후 이미지와 표를 눈으로 대조했다.
- 보고서에 표시된 자료: 상위 1% 22점, 상위 5% 19점, 상위 25% 13점, 상위 50% 9점, 상위 75% 6점, 최고점 25, 만점자 131명, 평균 9.69, 표준편차 4.84, 표본 71,143명, 학교 1,759곳. 보고서 이미지에는 상위 2.5%와 10% 열이 없다. 빈 구간을 다른 연도에서 채우거나 보간하지 않는다.
- 보고서는 제3자 페이지에 재게시되어 있고 원본 이미지에는 참가 모집단의 지역·포함 기준이 적혀 있지 않다. 별도 보도 자료에는 더 큰 세계 참가 통계(263,295명)가 있어 표본 범위가 서로 맞지 않을 수 있다. 따라서 제품은 이 값들을 `2022 MAA 보고서 이미지 표본`으로만 제시하고 세계/미국/전국 전체 응시자 기준이라고 쓰지 않는다. 해당 행을 전체 인원 263,295명 통계와 합치지 않는다.
- 같은 시험의 `Contest Score Grade Report with Percentile` 원본 이미지 재게시를 Think Matrix 페이지에서 추가로 찾았다. 링크에 붙어 있던 임시 접근 토큰은 만료됐지만 이미지 경로 자체는 내려받을 수 있었고, 표 전체를 직접 읽었다. Grade ≤5, 6, 7, 8, UNK의 점수 0–25 도수는 각각 4,336, 14,258, 22,493, 29,236, 694명으로 합계 71,017이다. 표의 All 열 26개도 이 학년 그룹 합과 모두 일치한다. 가중 평균 8.96, 8.78, 9.57, 10.38, 7.87은 별도 Overall 평균 이미지에서 ≤4+Grade 5, Grade 6–8, UNK로 보고한 값과 반올림 단위까지 일치한다. Grade 5 이하는 한 그룹으로 유지하며, UNK와 다른 학년을 끼워 맞추지 않는다. 이미지의 학년 백분위 대신 완전한 빈도에서 “점수보다 낮은 비율”을 계산해 표시한다. 이 표의 합계 71,017과 별도 전체 점수 보고서 이미지의 71,143은 출처가 다르므로 그대로 각각 보존한다. 전사 CSV와 화면 조회에는 [`amc8-2022-global-grade-score-counts.csv`](../competition/historical-amc-grade/amc8-2022-global-grade-score-counts.csv) 및 `amc8-global-grade-score-reference.js`를 쓴다. [Think Matrix 재게시·이미지 설명](https://www.think-matrix.com/math_planet/awards_setting_and_historical_result) · [학년 평균 원본 이미지 재게시](https://huacheng.gz-cmc.com/pages/2024/12/26/395e30eec1e140a0b4a9600b3a6dc38b.html)
- 2022행을 [`amc-score-distribution-reference.js`](../competition/amc-score-distribution-reference.js)에 연결해 2022 원본 시험을 모두 채점한 뒤 보고서에 실린 다섯 점수 경계만 비교할 수 있게 했다. 미수록 상위 2.5%·10% 경계는 숨기고, 자료 기준일과 표본·출처 범위 경고를 함께 표시한다. 연도별 원시험·PDF 인쇄·정답표·전문 풀이는 기존 LIVE 원본 연도 선택 경로에서 이어진다.
- 확인 근거: [MAA 점수 보고서 이미지 재게시 페이지](https://www.sohu.com/a/695186451_121124027), [2022 AMC 8 전체 점수 분포 보고서 언급](https://www.think-matrix.com/math_planet/awards_setting_and_historical_result), [2022 AMC 8 외부 참가통계 설명](https://ivyleaguecenter.org/2022/03/09/2022-amc-8-results-just-announced-ten-students-received-perfect-scores/). 서로 다른 표본 설명의 충돌 때문에 원본 이미지의 71,143명만 해당 보고서 표본값으로 보존한다.

## 2026-11-04 추가 웹 확인: 2018·2019 AMC 8 전체 점수 보고서

- 2018 [MAA Contest Score Report PDF 재게시본](https://www.mathcontest.org/sites/default/files/AMC8-2018-Score-Distribution.pdf): 상위 1·5·25·50·75% 점수선 19·15·11·8·6, 평균 8.51, 표준편차 3.68, 보고 표본 98,448명·학교 1,844곳. PDF 표에 상위 2.5%와 10% 값은 없다.
- 2019 [MAA AMC 8 Contest Score Report 재게시 페이지](https://www.ivytrack.com/forum.php?mod=viewthread&tid=19238): 자료 기준일 2020-01-01, 상위 1·5·25·50·75% 점수선 23·19·12·9·6, 만점자 151명, 평균 9.43, 표준편차 4.46, 보고 표본 94,675명·학교 1,869곳. 별도 2019 AMC 자료는 94,634명을 보고해 수치가 다르므로 이 행은 MAA 보고 이미지의 표본값으로만 둔다.
- 두 해 모두 제3자 재게시를 출처로 표시하며, 보고서 표본을 현재 전체 응시 규준·학년 규준이나 다른 출처의 참가자 총수와 혼합하지 않는다. 상위 2.5%·10% 점수선을 채워 넣지 않는다.
- `amc-score-distribution-reference.js`에 두 해를 연결했다. 동일 연도 원본을 끝까지 입력했을 때 기록된 경계만 나란히 표시한다. Grade 7은 학생이 입력한 학년 맥락일 뿐, 점수 기준은 전체 보고 표본 기준이며 학년별 순위·등급으로 표시하지 않는다.
- 대조 근거: [2018 MAA PDF 재게시본](https://www.mathcontest.org/sites/default/files/AMC8-2018-Score-Distribution.pdf), [2019 MAA 보고서 재게시](https://www.ivytrack.com/forum.php?mod=viewthread&tid=19238), [2019 점수 요약 교차 확인](https://bj.xdf.cn/zixun/beimei/97334.html). 2019의 교차 확인 페이지 또한 MAA 보고 이미지를 재인용한다.

## 2026-11-04 웹 검색 추가: 연도별 AMC 8/10 현지 보고서 구분

- 연도별 검색에서 [Bard Math Circle 2013 AMC 8 결과](https://www.bardmathcircle.org/p/2013-amc-8), [2014 AMC 8 결과](https://www.bardmathcircle.org/p/2014-amc-8), [2016 AMC 8 결과](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in)를 찾았다. 각 페이지는 Bard 행사에 온 학생과 연계 프로그램 참가자의 학년별 평균을 싣지만, 전국 참가자 표가 아니다. 공개된 학년 평균은 해당 지역/행사 집단 결과로만 남기고 전국 학년 비교 데이터에는 넣지 않는다.
- [2015 AMC 8 싱가포르 학교 보고서](https://asiamathsalliance.com/2015/amc8/05150F.pdf)는 Grade 7 다섯 명의 학교 평균을 싣는다. [2015 AMC 10/12B Bard 결과](https://www.bardmathcircle.org/p/2015-amc-10-12b), [2016 AMC 10/12B Bard 결과](https://www.bardmathcircle.org/p/2016-amc-10-12b), [2017 AMC 10/12B Bard 결과](https://www.bardmathcircle.org/p/2017-amc-1012b-results), [2019 AMC 10/12B Bard 결과](https://www.bardmathcircle.org/p/2019-amc-10-12b-results), [2021 AMC 10/12B Bard 결과](https://www.bardmathcircle.org/p/2021-amc-10-12b-results), [2022 AMC 10/12 결과](https://www.bardmathcircle.org/p/2022-amc-10-12-ab-results)도 확인했다. 이것들은 행사/학교 참가자들의 해당 연도 결과이며 AMC 전국 Grade Report를 대신하지 않는다. 개별 성취 사례나 소규모 집단 평균은 전국 비교에 합치지 않는다.
- [2011 AMC 8 한국 결과표 재게시](https://www.amcstudy.net/79)는 보고된 899명 집단의 학년별 평균표, 학년별 점수 빈도·누적 백분위 표, 문항 응답 선택 비율을 제공한다. 해당 값은 이미 `amc8-korea-grade-means-2009-2011.csv`, `amc8-2011-korea-grade-percentile.csv`, `amc8-2010-item-response-percent.csv`에 기록되어 있어 중복 행을 추가하지 않았다. 이 페이지는 개인 수상자 목록도 싣지만 그 명단은 수집하지 않는다.
- 이번 연도별 검색에서 새로 회수된 AMC 전국 학년 점수표는 없었다. 전체 응시자 평균·수상 경계와 현지 행사 성적을 학년별 전국 비교로 바꾸지 않는다. 다음 검색 범위는 coverage manifest에서 실제 Grade Report 본문이 비어 있는 MAA 메뉴 ID를 중심으로 유지한다.

### 2026-11-04 · AMC 10A Grade 7 과거 평균 웹 자료 추가

- [Archimedean Schools의 2019 AMC 10A 게시물](https://www.archimedean.org/amc-grade-7-student-sailalitha-kodukula-makes-history/)은 AMC 10A에 응시한 Grade 7 참가자 1,982명의 평균을 59.72점으로 보고한다. 페이지에는 MAA 작성 원자료 파일이 연결되어 있지 않아, 학교가 공개한 전국 학년 통계의 2차 보고로 분류했다.
- 이 값은 AMC 10A · 2019 · Grade 7과 정확히 일치할 때만 결과 비교에 나타난다. 참가자 수와 평균만 제시하며 백분위·학업 등급·현재 규준으로 바꾸지 않는다. UI에 2차 출처 안내와 원문 링크를 보인다. 원자료는 `competition/historical-amc-grade/amc10-2019a-grade7-mean.csv`, 참조 항목은 `competition/amc-historical-grade-reference.js`, 회차별 수집 상태는 coverage manifest에 기록했다.
- 출처 본문에서 해당 수치와 표본을 다시 대조했다. 수동 브라우저 검수에서 2019 AMC 10 A Grade 7 선택, LIVE 정답표 대조 후 결과 패널의 59.72 평균·1,982명 표본·2차 출처 설명과 링크를 확인했다. 검수용 응답은 저장하지 않고 페이지 새로고침으로 초기화했다. 이 값 하나로 다른 연도나 시험형을 채우지 않는다.

### 2026-11-04 · AMC 10A 2013 미국 학년별 평균표 전사 자료

- [Gifted Issues 토론의 2013 MAA Grade Average 표 전사](https://giftedissues.davidsongifted.org/bb/ubbthreads.php/printthread/Board/13/main/13750/type/thread.html)에서 `Grade Average 10 A 2013`, `Location: United States` 표를 확인했다. 표는 Grade 7 78.9점/1,730명, Grade 8 79.3점/3,332명, Grade 9 69.5점/23,236명, Grade 10 71.6점/26,286명이다. `06`은 6학년 이하 795명 묶음이므로 정확한 Grade 6 비교로 취급하지 않는다.
- 표의 `unknown` 1,337명 평균 68.4와 `all` 56,717명 평균 71.4도 전사되어 있으나, 표시 학년별 인원 합은 56,716명으로 `all`보다 1명 적다. 표의 소집단 가중 평균은 약 71.42점이다. 이 내부 차이와 다른 자료의 2013 전체 평균 수치를 해소할 MAA 원본 보고서는 회수하지 못했다. 앱에는 전체 행·전체 평균을 넣지 않고, 정확한 Grade 7–10 평균만 미국 위치 집단이라고 밝혀 제한적으로 연결했다.
- 자료 파일 [`amc10-2013a-us-grade-means.csv`](../competition/historical-amc-grade/amc10-2013a-us-grade-means.csv)는 전사된 MAA 표와 모집단 범위를 보존한다. 2013년 당시 MAA 통계 메뉴와 포럼에 옮겨진 미국 위치 평균표이며, 현재 표시 참조는 아래에서 검증한 99CEF 세계 참가자 보고서로 전환했다. 미국 전사치는 별도 모집단 자료로 남기며 UI 조회에는 중복 연결하지 않는다.
- 어느 표도 AMC 10B 또는 다른 연도의 평균 환산에 쓰지 않는다.
- 2014–2017 연도별 학년 평균을 다시 검색했으나, 회수된 추가 PDF는 [Williston School의 2014 AMC 10B/12B 결과](https://willistonblogs.com/math/files/2014/05/Williston_AMC10-12_Results.pdf)로 학교 응시자 9명의 Grade 10 평균을 보고하는 학교 집단 자료였다. 학교 표본은 전국 학년 규준과 다르므로 앱 기준에는 합치지 않았다. 같은 검색에서 확인한 대회 전체 평균·상위권 경계는 이미 별도 패널에서 관리하며, 학년 평균을 대신하지 않는다.

### 2026-11-04 웹 검색 추가: AMC 10A 2014–2018 학년별 평균 보고서

- 99CEF가 공개한 [2014](https://web.archive.org/web/20230319031424id_/https://www.99cef.org.tw/userfiles/2014AMC10A12AReport.pdf), [2015](https://web.archive.org/web/20230626064343id_/https://www.99cef.org.tw/userfiles/2015AMC10A12AReport.pdf), [2016](https://web.archive.org/web/20230626064539id_/https://www.99cef.org.tw/userfiles/2016AMC10A12AReport.pdf), [2018](https://web.archive.org/web/20230319031426id_/https://www.99cef.org.tw/userfiles/2018AMC10A12AReport.pdf) AMC 10A 분석 보고서를 Internet Archive PDF 보존본으로 열어 학년표를 시각 대조했다. 2014 Grade 7은 2,013명·73.95/150, 2015는 2,302명·78.53, 2016은 2,327명·74.97이다. 2018 보고서 표의 모집단은 세계 전체가 아니라 미국·캐나다이며 Grade 7 1,828명·62.82이다. 다른 연도·지역 모집단을 한 추세선이나 점수 환산으로 묶지 않는다.
- 원자료 [`amc10a-grade-means-2014-2018.csv`](../competition/historical-amc-grade/amc10a-grade-means-2014-2018.csv)에 네 보고서의 전체 학년 그룹을 보존하고, 화면에는 회차·형식·학년이 정확히 일치하는 Grade 7–10 행만 연결했다. 6학년 이하는 합쳐진 그룹으로 남겨 Grade 6에 붙이지 않는다. 보고서별 학년 그룹 합계와 전체 인원 사이에는 2014년 6명, 2015년 1명, 2018년 31명의 차이가 있다. 보고서에 적힌 행을 수정하거나 차이를 임의 배분하지 않았다.
- 같은 PDF에는 전 세계·대만의 문항 응답 선택률, 정답률과 문제 영역 분석도 포함된다. 이번 반영에서는 해당 내용을 문제별 수치 비교로 확대하지 않았으며, 이후 원문 표를 문항 번호·정답키와 대조한 뒤 별도 진단 자료로 다룬다.
- 점검: 2014·2015·2016·2018 보고서의 AMC 10A 종합 통계표를 PDF 렌더링으로 읽어 CSV의 학년, 평균, 표본 수와 대조했다. 보고서 URL은 현재 원호스트에서 404를 반환해 검증된 Internet Archive PDF 보존 URL로 교체했다. 브라우저 참조는 해당 연도·폼·학년에서만 값을 반환하도록 했다. 자동화 테스트는 실행하지 않았다.

### 2026-11-04 웹 검색 추가: AMC 10A 2013 세계 학년별 평균 보고서

- [99CEF 2013 AMC 10A/12A 분석 보고서의 Internet Archive PDF 보존본](https://web.archive.org/web/20150908065043id_/http://www.99cef.org.tw/userfiles/2013AMC10A12AReport.pdf)을 회수해 PDF 6쪽의 `2013 AMC10A 綜合統計表`를 시각 확인했다. 전 세계 열의 Grade 7은 2,232명·79.30/150, Grade 8은 4,420명·80.97, Grade 9는 25,995명·70.08, Grade 10은 34,116명·73.18이다. 표는 Taiwan 열을 별도로 두므로 두 모집단을 섞지 않았다.
- 보고서 전체 응시자 69,653명과 표에 적힌 6개 학년/학년군 행의 합 69,389명은 264명 차이가 난다. 이 차이는 원문대로 보존했으며 학년 행을 보정하거나 나누지 않았다. `<=6`은 855명으로 묶여 Grade 6에 자동 연결되지 않고, 학년 미기록 1,771명도 정확한 학년 진단에서 제외한다.
- 전체 학년 행은 [`amc10a-grade-means-2013-global.csv`](../competition/historical-amc-grade/amc10a-grade-means-2013-global.csv)에 보존했다. 2013 AMC 10A Grade 7–10의 화면 참조는 이제 포럼에 옮겨진 미국 위치표가 아니라 보고서 PDF에 직접 실린 세계 집계이며, 별도의 미국 전사 CSV는 기록으로 유지한다. 미국 표 2013 Grade 7 평균 78.9/1,730명과 세계 표 79.30/2,232명은 모집단이 다르므로 합치거나 추세 비교하지 않는다.
- PDF의 메타데이터 제목은 오래된 AMC 8 템플릿 문자열을 포함하지만, 렌더링한 6쪽 표 자체에 `2013 年 AMC10A`, `全球`와 Grade 7–10 행이 명시되어 있다. 현재 원호스트 URL은 404이고, Internet Archive 보존 PDF를 근거로 삼았다.
- 점검: PDF 6쪽 렌더링을 표와 대조하고 아카이브 캡처 HTTP 200, 그룹 행 합계 및 UI의 정확 학년 연결을 확인했다. 자동화 테스트는 실행하지 않았다.

### 2026-11-04 웹 검색 추가: 2017 AMC 8 미·캐나다 학년 평균 및 문항 응답표

- [99CEF 2017 AMC 8 분석 보고서의 Internet Archive PDF 보존본](https://web.archive.org/web/20180324183042id_/http://www.99cef.org.tw/userfiles/2017AMC8Report.pdf) 2쪽의 종합 통계표에는 `美加`와 대만이 별도 열로 나온다. 미·캐나다 Grade 7은 25,215명·평균 9.09/25, Grade 6은 15,907명·8.10, Grade 8은 35,541명·9.61이다. 앱에는 exact Grade 5–8만 연결하고 `4학년 및 이하`는 묶음 그대로 보존한다. 대만 수치는 별도 행이며 미·캐나다 참가자 평균에 합치지 않는다.
- 보고서 총원 81,386명에서 표의 기록 학년 인원 합 79,875명을 빼면 1,511명이다. 보고서 주석은 학년 인원과 전체 응시 인원 차이를 학년 미기록자로 설명한다. 이 수를 특정 학년이나 평균 점수에 나누어 넣지 않았다.
- PDF 7쪽 `美加答對率`에는 각 문항의 A–E 선택률, 무응답률, 판독 불명 비율이 있다. 전체 25문항을 [`amc8-2017-uscan-item-response.csv`](../competition/historical-amc-grade/amc8-2017-uscan-item-response.csv)에 옮기고, 기존 답안 입력 화면의 오답·미응답 문항에 81,386명 미·캐나다 응답 집단의 당시 분포를 참고로 연결했다. 학년별 응답률은 아니며 학생 능력 등급·현재 규준으로 쓰지 않는다. PDF의 별표 정답은 LIVE/MAA answer key와 25문항 모두 일치했다.
- 학년별 전체 지역 표는 [`amc8-grade-means-2017.csv`](../competition/historical-amc-grade/amc8-grade-means-2017.csv)에 보존하고, 원 PDF 원호스트가 현재 404라 보존 URL을 사용했다. PDF에서 텍스트 추출이 가능해 OCR은 쓰지 않았고, 통계표와 응답률표를 각각 렌더링해 시각 대조했다.
- 점검: PDF 표의 Grade 5–8 값과 문항별 별표/선택률, 공식 답안 키를 대조했고, CSV 행 수·평균·합계 및 아카이브 URL HTTP 200을 확인했다. 자동화 테스트는 실행하지 않았다.

### 2026-11-04 · MAA 연도별 통계 메뉴 ID 목록 회수

- [MAA Historical Statistics 페이지의 2022-02-04 Internet Archive 보존본](https://web.archive.org/web/20220204191809/http://amc-reg.maa.org/reports/generalreports.aspx)에서 정적 HTML 원문을 회수했다. 선택 목록에는 39개의 AMC 8 및 AMC 10/12 항목이 남아 있다: AMC 8 2010–2020, AMC 10/12 A/B 2009–2020, 2021년 2월 A/B 및 11월 A/B. 2021년 2월은 ID 88/89, 11월은 ID 93/94로 구분된다.
- 페이지의 보고서 설명은 AMC 8/10/12 모두 `Contest Score Grade Report with Percentile`을 점수별·학년별 인원과 누적 백분위가 있는 표로, `Grade and Gender Average`를 학년·성별 요약표로 명시한다. 따라서 해당 연도별 보고서 선택 경로가 보존된 것은 확인했으나, 값 자체는 아직 회수한 것이 아니다.
- [`maa-historical-report-menu-2022-02-04.csv`](../competition/historical-amc-grade/maa-historical-report-menu-2022-02-04.csv)에 보고서 ID·레이블·날짜·해당 앱 회차를 정리했다. 266개 원본 회차 coverage manifest에는 보관 메뉴 ID와 본문 상태를 추가했다. 이 정적 캡처에서는 SQL ReportViewer 보고서 본문이 불러와지지 않아 67개 연결 원본의 본문 상태를 모두 `menu-entry-preserved; ReportViewer body not preserved`로 표시한다. 메뉴 ID는 조사 경로이지 학년 통계 근거가 아니며, 수치·학년 규준·백분위로 노출하지 않는다.
- 다음 조사 방향: 보존 메뉴 ID를 이용해 MAA 원본 보고서/PDF나 다른 동시대 MAA 보고서 사본을 연도·회차 단위로 찾는다. 원본 보고서 본문이나 독립 대조 가능한 전체 전사가 확인되는 경우에만 점수별 빈도/학년 평균 CSV를 추가한다.

### 2026-11-04 웹 검색 추가: 2018·2019 AMC 8 학년 평균 및 문항 응답률

- 99CEF의 [2018 AMC 8 분석 보고서 보존본](https://web.archive.org/web/20210121195421id_/https://www.99cef.org.tw/userfiles/2018AMC8Report.pdf) 2쪽 통계표에서 US/Canada Grade 5는 3,157명·7.89/25, Grade 6은 18,649명·7.95, Grade 8은 43,114명·8.89로 확인했다. Grade 7 인원은 30,617명이며 평균 칸은 원문에 `8350`으로 찍혀 소수점이 없다. 숫자를 보정하지 않고 Grade 7 평균 조회에서 제외했다. `<=4` 879명·7.49, unknown 1,973명·7.34를 포함한 US/Canada 집계 인원은 98,389명으로 보고서 합계와 맞는다. 대만 행은 분리 보존했다.
- 같은 2018 보고서 8쪽 US/Canada 응답률 표의 25문항 A–E 선택, 무응답, 판독 불명 백분율을 옮겼다. 별표 정답 25개는 LIVE 답안키와 대조했다. 이 문항 분포는 해당 연도 전체 US/Canada 집단 자료이며 학년별 정답률로 읽지 않는다.
- 99CEF의 [2019 AMC 8 분석 보고서 보존본](https://web.archive.org/web/20210121214419id_/https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf) 3쪽 표에는 2019-12-25 기준 US/Canada Grade 5 3,499명·8.50, Grade 6 18,247명·8.50, Grade 7 30,332명·9.35, Grade 8 40,175명·10.06이 실려 있다. `<=4` 896명·8.40과 unknown 1,485명·9.43을 보존하고 exact Grade 5–8만 조회에 연결했다. 대만은 별도 집단으로 보존했다.
- 같은 2019 보고서 8쪽 US/Canada 문항 응답표 전체를 `amc8-2019-uscan-item-response.csv`와 답안 참조 파일에 전사했다. 별표 키는 [LIVE의 2019 answer key](https://live.poshenloh.com/past-contests/amc8/2019/answers) 25개와 모두 일치했다. 페이지의 표본은 94,634명이다.
- 모집단 수가 출처마다 다르다. 99CEF 2019 보고서는 US/Canada 응답 표본 94,634명, 기존 MAA Overall 점수별 빈도표는 기록 행 합 94,620명, 별도 점수요약 재게시물은 총 94,675명을 싣는다. 이 숫자는 서로 다른 보고 산출물에 그대로 보존하고 하나로 합치지 않았다.
- 점검: 2018·2019 원문 PDF 통계표와 문항 응답표를 화면 렌더링으로 확인하고 문항별 별표를 LIVE 정답키와 대조했다. 문항 응답 행 25개, 선택지·무응답·판독불명 비율 합계, 학년별 인원 합계를 확인했다. 2018 Grade 7은 원문 값 표기 때문에 조회 차단을 확인했다. 자동화 테스트는 실행하지 않았다.

### 2026-11-04 웹 검색 추가: 2020 AMC 10A·12A 학년 평균 및 문항 응답률

- 웹 검색에서 [99CEF 2020 AMC 10A/12A 분석 보고서](https://www.99cef.org.tw/userfiles/2020AMC10A12AReport.pdf)를 회수했다. 검색 색인에는 2020 보고서 표의 회차·전체 모집단·평균이 나타나며, Internet Archive 보존본으로 내려받아 Apple Vision OCR을 보조로 사용하고 표 이미지를 직접 확인했다. 99CEF 원 URL은 현재 요청 시 다른 연도 PDF로 리디렉션될 수 있어, 데이터는 고정된 [2021-01-21 보존 PDF](https://web.archive.org/web/20210121212429id_/https://www.99cef.org.tw/userfiles/2020AMC10A12AReport.pdf)를 출처로 연결했다.
- 보고서 인쇄 5쪽 AMC 10A 통계표는 미국·캐나다 모집단 n=36,010, Taiwan n=5,113으로 분리한다. 미국·캐나다 학년별 원문은 Grade 10 14,816명·63.52/150, Grade 9 13,371명·62.09, Grade 8 3,866명·72.43, Grade 7 2,071명·70.17, Grade 6 이하 1,147명·67.05, 미기입 739명·58.91이다. 앱 비교에는 원문이 별도 행으로 표시한 exact Grade 7–10만 연결했다.
- 인쇄 14쪽 AMC 12A 통계표는 미국·캐나다 n=27,416, Taiwan n=4,715로 구분한다. 미국·캐나다 exact Grade 12–5 표본은 각각 20/61.73, 10,075/61.83, 14,677/60.81, 1,582/62.94, 473/66.37, 100/73.17, 32/69.61, 7/74.36이다(인원/평균 점수). 5·6학년 행도 원문에서 개별 학년으로 인쇄되어 묶음으로 합치지 않았다. 소표본은 숨기거나 확장해 해석하지 않고 표본 수와 함께 노출한다.
- 같은 보고서 인쇄 10쪽(AMC 10A)과 19쪽(AMC 12A)의 US/Canada 표에서 25문항별 A–E 선택률·무응답·판독불명률을 전사했다. 별표로 표시된 50개 키를 [LIVE 2020 AMC 10A 답안표](https://live.poshenloh.com/past-contests/amc10/2020A/answers)와 [LIVE 2020 AMC 12A 답안표](https://live.poshenloh.com/past-contests/amc12/2020A/answers) 전 문항과 대조했다. `amc10-12-2020-item-response.csv` 원자료와 브라우저 참조 모듈을 만들고 결과 화면에서는 해당 폼과 US/Canada 전체 응답 코호트만 보여준다. 이 분포는 학년별 정답률이 아니다.
- 검수: 2020 AMC 10A/12A 각 25개 응답 행을 화면 데이터와 대조하고 A–E·무응답·판독불명 합계를 확인했다. 99CEF 학년별 인원 합계도 보고서 전체와 일치한다. AMC 10A Grade 7 n=2,071 / 평균 70.17, AMC 12A Grade 10 n=14,677 / 평균 60.81을 각각 정확한 연도·폼의 브라우저 결과에서 확인했다. 응답 입력·채점 흐름에서 10A Q1(E 정답)과 12A Q1(C 정답) 모두 대조되었고, 결과에 해당 폼의 응답률·해당 Grade 평균·공식 원본 풀이 링크가 표시됐다. 테스트 답은 임시 브라우저 화면에만 입력했고 저장하지 않았다. 출처 링크의 보조 설명이 대회 이름을 정확히 표시하는지 고쳤다. 시험 원문 문구를 새 데이터 파일에 복사하지 않았다.


## 2026-11-04 한국 AMC 8 학년 평균 비교 패널

웹에서 [2009 AMC 8 한국 결과표](https://www.amcstudy.net/43)와 [2011 AMC 8 한국 결과표](https://www.amcstudy.net/79)를 열어 Grade 5–8 평균과 응시 수를 재확인했다. 두 페이지가 보고한 한국 참가집단 값이며, MAA 연례 보고서의 보고학교 집계나 미국·캐나다 보고 표본과는 별도 모집단이다. 결과표의 전체 수 741/899명에 비해 학년 평균표에 표시된 수는 737/894명이므로 4/5명을 학년에 나눠 넣지 않는다.

`competition/amc8-korea-grade-mean-reference.js` 및 결과 패널은 2009·2011 AMC 8과 선택한 Grade 5–8이 정확히 일치할 때만 평균·표본·점수 차이를 보여 준다. 원본 답안 입력·공개 정답표 채점 후 2011 Grade 7에서 평균 13.92, n=315 및 미기재 5명을 확인했다. 새로고침으로 검수 답을 초기화했고 복습 저장 기능은 사용하지 않았다. 이 역사 평균은 현재 기준·능력 등급이 아니다.

같은 검색에서 [MAA 2009 AMC 8 연례 보고서 사본](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html)의 Table 2에 2003–2009 기록 학년군 평균과 표본 수가 있음을 확인했다. 이는 기존 `amc8-grade-means-2001-2009.csv`와 MAA 보고학교 코호트 기록을 재확인한 것이지 새 전국 비교 행은 아니다. 보고서가 해외 학교 참가도 언급하므로 이 표를 미국 단독 규준으로 부르지 않으며 4–5학년 묶음을 Grade 4/5로 나누지 않는다.

## 2026-11-04 웹 검색 추가: 연도별 원본 시험·정답·해설 아카이브 확인

- [LIVE의 AMC 과거 대회 아카이브](https://live.poshenloh.com/past-contests)는 MAA가 법적으로 사용을 허가한 실제 AMC 문항을 연도별로 제공한다고 명시한다. AMC 8 항목은 1985–2020년, 2022–2026년 총 41개 시행 회차이며 2021년은 빠져 있다. 각 회차에 온라인 시험, 인쇄용 시험 PDF, 정답표, 전문 해설 링크가 있는지 기존 [`amc-original-source-catalog.csv`](../competition/amc-original-source-catalog.csv) 266행을 대조했다. AMC 8 41회 전부에서 네 링크가 채워져 있다.
- AMC 10은 2000–2025년 52개 폼, AMC 12는 1950–2025년 102개 폼, AIME는 1983–2026년 71개 회차로 카탈로그에 정리돼 있다. 등록된 총 266행 모두 온라인 시험·인쇄용 PDF·정답·해설의 링크가 있다. 이 카탈로그는 문제를 재배포하지 않고 허가된 원문 페이지로 연결한다.
- 2011 AMC 8 회차 페이지는 [LIVE 원본](https://live.poshenloh.com/past-contests/amc8/2011)에서 시험·정답·해설을 연도별로 연결하고 MAA의 공식 사용 허가를 명시한다. 별도로 검색된 [MAA 2011 공식 Solutions Pamphlet 사본](https://www.profved.com/wp-content/uploads/AMC8/2011-AMC8-Solutions.pdf)은 당시 시험일과 MAA 저작권 표기를 확인하는 교차 근거로만 기록했다. 개별 문항·해설 원문은 프로젝트 파일로 복사하지 않는다.
- 조회·인쇄·채점 기능은 이 원본 카탈로그를 바탕으로 이어 붙일 수 있다. 통계 비교는 시험 원본 목록과 별도 데이터다. 실제 연도·폼·학년·모집단을 확인한 점수 분포가 없는 경우에는 연도 통계가 있는 것처럼 만들지 않는다.


## 2026-11-04 MAA 2010 AMC 8 한국 학년 점수 분포

Internet Archive에서 보존한 [MAA 2010 Korea 통계 원문](https://web.archive.org/web/20110625112502id_/http://amc.maa.org/amc8/2010/stats/statestatistics/KOREA.HTML)의 HTML 본문에서 총 751명, 8개 학교, 전체 평균 12.89점과 학년별 원자료를 확인했다. 학년 표에는 5학년 49명·10.43점, 6학년 189명·11.47점, 7학년 247명·13.28점, 8학년 257명·14.14점이 인쇄돼 있다. 네 행의 총합은 742명으로 보고서 전체보다 9명 적어 미기재 상태로 둔다.

원문에는 Grade 5–8 각 학년별 점수 0–25의 도수분포가 있어 `amc8-2010-korea-grade-score-counts.csv`에 전사하고 기존 결과 화면 조회 모듈에 연결했다. 각 학년 분포 합계는 보고서의 표본수와 맞고, 가중평균은 인쇄된 평균과 소수 둘째 자리까지 일치한다. 점수 비교는 해당 점수보다 낮은 학생의 비율로 계산하고, 2010 원문 MAA 보고서 링크·학년별 분모·해당 점수 응시자 수를 표시한다. 2009 방식과 같이 이는 공식 percentile가 아니며 한국의 해당 연도 보고 응시집단만을 설명한다. OCR은 사용하지 않았다. Internet Archive 보존본의 HTML `<pre>` 원문을 직접 읽어 표를 파싱하고 평균과 합계를 대조했다.

검수 범위: 4개 학년×26점수 빈도 총 104개 행, 점수 수 0–25 연속성, 학년별 인원합 및 가중평균, 점수 위치의 누적 계산을 확인한다. 해당 분포를 현재 학년 등급·전국 규준·학교 과목 배정으로 해석하지 않는다.

## 2026-11-04 연도별 공개 통계 범위 재검색

- 검색 범위: MAA AMC 공개 보고 메뉴(2010–2021 보존 메뉴 목록), AMC 8 Korea, 학년별 평균/점수-학년 percentile, 최신 MAA EduView 보고 페이지.
- [MAA의 현재 EduView score distribution](https://maa.edvistas.com/eduview/report.aspx?view=1561&mode=6)은 선택된 회차의 상위 점수선, 평균, 표준편차, 응시자·학교 수, 점수 분포를 보여준다. 확인 시 기본 회차는 AIME I 2026이었다. 이 자료는 대회별 전체 점수 분포 자료로, 여기서 개인의 학년별 AMC 8 순위를 산출할 수는 없다.
- MAA의 과거 AMC 보고 메뉴 캡처는 2010–2021 연도별 보고서 선택 ID와 날짜를 보존하지만 본문 데이터가 아니라 메뉴만 담고 있다. 해당 ID를 학년 통계로 해석하지 않는다. 현재 검색에서 2012–2020 한국 참가집단 Grade 5–8 빈도표 원문은 추가로 회수하지 못했다. 이 상태는 ‘미발견’이며 자료가 존재하지 않는다는 뜻은 아니다.
- 공개된 현대 점수 보고와 과거 학년표를 구분한다. 2022년 이후 MAA 공개 요약 통계만으로 학년별 백분위·평균을 채우지 않는다. 과거 상세 breakdown이 더는 공개되지 않는다고 말하는 사용자 보고는 있으나, 보존된 MAA report body가 확보되기 전에는 이를 공식 정책 문구로 단정하지 않는다.

## 2026-11-04 · AMC 8 2016·2020 연례 보고서 경로 교차 확인

- 검색 결과에서 독립 연구자가 모은 [MAA Summary of Results and Awards 아카이브](https://sites.google.com/view/ian-calaway/amc-archive)를 확인했다. 이 연례 소책자는 2010년까지 발행·배포됐고, 2011년부터는 온라인 인식 및 보고 흐름으로 이동했다는 설명이다. 따라서 2016·2020 학년표는 인쇄 연례 소책자 검색보다 MAA Historical Statistics의 web report ID/body 복구가 맞는 경로다.
- 이미 보존한 MAA Historical Statistics 목록은 2016 AMC 8 ID 63과 2020 AMC 8 ID 87을 남기며, `Contest Score Grade Report with Percentile` 선택 항목을 안내한다. 보존본에는 메뉴만 있고 선택 후 생성되는 표 본문은 없다. 2016 학년별 점수표는 아직 회수되지 않았다. (2020 MAA Overall 표는 후속 검색에서 별도로 회수·전사했다.)
- 2016 전체집단 수치(n=108,227, 평균 9.36)는 99CEF 분석 보고서와 MAA Michigan Section 뉴스레터(n=108,295, 평균 9.36)의 서로 다른 모집단 수를 병기한다. 어느 한쪽으로 임의 통일하지 않는다. [Michigan Section–MAA Spring 2017](https://sections.maa.org/michigan/newsletters/Vol43no2_Spring_2017.pdf). 2020은 Wisconsin Section이 미국 평균 10.01을 보고한다. 후속으로 MAA `Location: Overall` 학년 평균 이미지(표본 n=56,099; 평균 10.00)를 2차 보존본에서 회수했으며, 두 보고의 차이는 그대로 보존한다. [Wisconsin Section–MAA Fall 2021](https://sections.maa.org/wisconsin/news/MAAWINewsFall21v2.pdf).
- 결과: 2016은 `no-grade-table-recovered`로 유지하고, 2020은 확인된 Grade 5–8 평균·인원을 추가했다. MAA 원본 ReportViewer 본문은 계속 미회수이므로 2차 재게시라는 출처 경계를 표시한다. 다음 검색은 2016 report body 및 다른 연도의 비식별 집계 보고서로 이어간다. 지역 행사·학교·준비반 결과는 전국 학년 비교에 넣지 않는다.

## 2026-11-04 · AMC 8 2011 전국 학년표 및 참가집단 재검색

- MAA의 [2011 AMC 8 결과 요약 페이지 보존본](https://web.archive.org/web/20111125032909/http://amc.maa.org/amc8/2011/stats/2011-amc8stats.shtml)은 11월 23일 현재 수치를 매일 갱신 중이라고 명시하고 Summary Report 이미지를 포함한다. 동시대 포럼 글은 MAA의 `Grade_and_Gender_Average.pdf` 전국 보고서 경로를 직접 인용하고, 검색 색인에는 25점과 24점의 학년별 건수가 남아 있다. 다만 원 PDF/전체 표 본문은 확인한 Wayback 및 검색 결과에서 회수되지 않았다. 해당 초기 행은 일부 점수만의 잠정 건수여서 완결된 분포·평균이나 최종 국가 규준으로 사용하지 않는다. [동시대 포럼의 원래 경로 인용](https://giftedissues.davidsongifted.org/bb/ubbthreads.php/topics/117085/3.html).
- [2011 참가자 안내용 Connecticut 교육 자료](https://portal.ct.gov/-/media/SDE/CT-Core-Standards/2015/02/Connecting_Claims_Math_6-12_Participant_Guide.pdf)는 전체 응시자 153,485명, 7학년 50,433명, 8학년 72,648명을 서술한다. 이는 연도·학년별 참가 규모 정보이지 점수 통계가 아니다. 99CEF가 재수록한 최종 전체 보고 요약은 2011 전체를 152,745명으로 집계해 분모 차이가 있으므로, 학년별 점수 평균을 역산하거나 두 분모를 합치지 않는다.
- [AMC Study의 2011 한국 참가 결과표](https://www.amcstudy.net/79)는 별도 한국 모집단 899명에서 5학년 이하 4명/7.25, 5학년 68명/13.16, 6학년 252명/11.67, 7학년 315명/13.92, 8학년 255명/14.20의 평균을 제공한다. 이 행은 이미 `amc8-korea-grade-means-2009-2011.csv`에 한국 참가집단으로 저장돼 있다. 2011 전국 Grade mean의 대체값으로 취급하지 않는다.
- [MAA 통계 페이지 2013년 보존본](https://web.archive.org/web/20130204052822id_/http://amc.maa.org/amc8/2011/stats/2011-amc8stats.shtml)의 HTML을 직접 다시 열어 확인했다. 페이지 URL은 2011 경로지만 브라우저 제목은 `2010 AMC 8 Statistics`라고 되어 있어 연도 메타데이터가 서로 맞지 않는다. 본문은 2011년 11월 15일 시행을 적고, Overall/지역별 `Grade_and_Gender_Average.pdf` 및 `Contest_Score_Grade_Report_with_Percentile.pdf` 선택지를 제공한다. Internet Archive CDX의 2011 통계 하위폴더 전체 캡처 목록에서는 두 Overall PDF가 확인되지 않았다. [CDX 파일 인벤토리](https://web.archive.org/cdx/search/cdx?url=amc.maa.org%2Famc8%2F2011%2Fstats%2Fstatestatistics%2F%2A&output=json&filter=statuscode%3A200&collapse=urlkey)
- 결과: [`amc-grade-reference-coverage-by-paper.csv`](../competition/historical-amc-grade/amc-grade-reference-coverage-by-paper.csv)의 AMC 8 2011 상태는 `no-grade-table-recovered`로 유지했다. MAA 페이지의 선택 메뉴만을 실제 통계 회수로 간주하지 않으며, 한국 표본과 섞지 않는다.


### 2026-11-04 · 웹 검색: 2013 AMC 8 세계·대만 학년별 평균

- [99CEF의 2013 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2013AMC8Report.pdf) 6쪽 표에서 전체·대만 열의 학년별 인원과 평균을 확인했다. Global Grade 5–8은 각각 n=3,387/22,225/48,196/72,066, 평균 9.64/9.66/10.60/11.22점이다. 대만 Grade 5–8은 별도 집단이며 각각 n=89/248/3,288/6,173, 평균 13.22/14.25/15.57/16.65점이다. 두 집단을 합산하지 않는다.
- 같은 표의 Global `Grade 4 and below`는 n=892, 평균 8.63으로 묶여 있어 특정 학년에 배정하지 않는다. 보고서의 Global 전체 n=149,709 대비 명시 학년 행 합은 146,766으로 2,943명이 학년 미기재다. 대만 표의 다섯 학년 행 합은 9,811로 보고된 대만 전체와 일치한다.
- 원자료는 [`amc8-grade-means-2013-99cef.csv`](../competition/historical-amc-grade/amc8-grade-means-2013-99cef.csv)에 Global·Taiwan 행 전체를 보존한다. 결과 화면 lookup에는 Global 정확 Grade 5–8만 추가하고, 같은 2013 AMC 8·응시 학년과 맞을 때에만 표시한다. 99CEF 2차 보고서의 과거 집단 평균으로 표기하며, 현재 학년 등급·백분위·실력 예측으로 확장하지 않는다.


### 2026-11-04 · 웹 검색: 2014 AMC 8 세계·대만 학년별 평균

- [99CEF의 2014 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2014AMC8Summary.pdf) 7쪽 종합통계표에서 Global과 Taiwan의 Grade 5–8 표본 수·평균을 확인했다. Global: Grade 5 n=3,441 평균 10.44, Grade 6 n=22,617 평균 10.60, Grade 7 n=46,697 평균 11.30, Grade 8 n=68,036 평균 11.98. Taiwan 값은 별도 모집단이며 섞지 않는다.
- Global `Grade 4 and below`는 n=1,004 평균 9.67로 묶여 있어 개별 학년에 배정하지 않는다. 전체 n=144,737 중 기록된 학년 행 합은 141,795이며 차이 2,942명은 학년 미기재다. Taiwan 학년 행 합은 보고서 전체 n=9,199와 일치한다.
- [`amc8-grade-means-2014-99cef.csv`](../competition/historical-amc-grade/amc8-grade-means-2014-99cef.csv)에 두 모집단 행을 모두 보존하고, 화면 lookup에는 Global 정확 Grade 5–8만 연결했다. 해당 연도 원본 결과·응시 학년이 일치할 때에만 과거 평균을 표시한다.

### 2026-11-04 · 웹 검색: 2015 AMC 8 학년 평균·문항 반응표

- [99CEF의 2015 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2015AMC8Report.pdf) 8쪽 표에서 Global Grade 5–8은 n=3,785/25,445/49,505/67,530, 평균 7.85/7.72/8.49/9.03이다. Taiwan 열도 별도 행으로 원 CSV에 보존했다. Grade 4 이하 묶음은 Global 1,125명/7.21점, Taiwan 26명/5.92점으로 개별 학년에 배정하지 않는다. Global 전체 149,844명 중 기재된 학년 행 합은 147,390명이라 2,454명은 학년 미기재다. Taiwan 학년 합은 보고서 전체 9,017명과 일치한다.
- 같은 보고서 13–14쪽에서 Global·Taiwan의 25문항별 A–E 선택 비율, 공란, 판독불가 비율을 각각 회수해 [amc8-2015-global-taiwan-item-response.csv](../competition/historical-amc-grade/amc8-2015-global-taiwan-item-response.csv)에 저장했다. 정답 별표 25개는 [LIVE 2015 AMC 8 답안표](https://live.poshenloh.com/past-contests/amc8/2015/answers)와 전부 대조했다. 복습 화면은 전체 참가자 Global 반응률만 연결하며 Grade별 응답률이나 현재 규준으로 표시하지 않는다. Taiwan 표는 별도 원자료 행으로 보존한다.
- 결과 lookup에는 Global exact Grade 5–8의 과거 평균을 같은 2015 AMC 8·응시 학년에서만 표시한다. 대회 점수·문항 응답과 학년 평균은 별도 지표다.


### 2026-11-04 · Web search: 2012 AMC 8 detailed report recovered

- [99CEF 2012 AMC 8 detailed analysis report](https://www.99cef.org.tw/userfiles/2012_AMC8_Report.pdf) p.6 reports Global Grade 5–8 counts/means of 3,143/9.72, 20,279/9.73, 50,431/10.46, and 73,145/11.14. The grouped `<=4` row is 1,039/9.25; unknown grade is 3,080/9.36. The detailed report totals 151,117/10.64; Taiwan is a separate cohort.
- The same report's Global 25-item answer-choice table is connected to the review lookup, and both Global/Taiwan tables are preserved in `amc8-2012-global-taiwan-item-response.csv`. Its 25 answer markers were checked against the [LIVE 2012 answer key](https://live.poshenloh.com/past-contests/amc8/2012/answers). The screen uses only the Global cohort. Taiwan Q12 in text extraction totals 95.01%; the source PDF URL currently returns 404, so that cell is flagged and excluded from app lookup rather than silently adjusted.
- The 2019 report's retrospective annual-comparison table prints 2012 overall n=150,360 and mean 10.66, unlike the 2012 detailed report's own total (151,117/10.64). The grade and response lookup uses the detailed report only; the two report-specific figures are preserved separately and not merged or silently corrected.
- Search results for 2016 included a Bard Math Circle report for 35 test takers. This local-event cohort was excluded from national comparisons. Continue searching for a complete 2016 report.


### 2026-11-04 웹 검색: 2013·2014 AMC 8 전체 응답률표

- 99CEF 원 보고서의 Global/Taiwan 문항별 답안 선택률, 공란, 판독 불가율을 각 25문항씩 회수했다. 보고서 전체 인원은 2013 Global 149,709·Taiwan 9,811, 2014 Global 144,737·Taiwan 9,199이다. 근거: [2013 분석 보고서](https://www.99cef.org.tw/userfiles/2013AMC8Report.pdf) 10–11쪽, [2014 분석 보고서](https://www.99cef.org.tw/userfiles/2014AMC8Summary.pdf) 11–12쪽.
- 2013 Global Q20 보고서 행은 응답률 총합이 99.59%여서 원자료 수치를 유지하고 런타임 조회에서만 제외한다. 2013 Taiwan Q25의 B 선택률은 보고서 표의 52.17%로 바로잡아 합계를 재확인했다. 각 보고서 정답 표식은 [LIVE 2013 정답표](https://live.poshenloh.com/past-contests/amc8/2013/answers), [LIVE 2014 정답표](https://live.poshenloh.com/past-contests/amc8/2014/answers)와 대조했다. Global 정답키 25개씩 모두 일치한다.
- 응답 자료는 `amc8-2013-global-taiwan-item-response.csv`, `amc8-2014-global-taiwan-item-response.csv`에 총 100행으로 저장했고, 런타임은 전 학년 공통 whole-Global 분포를 사용한다. 2013년 Mathematics Ed Clinic의 63명 Grade 7/55명 Grade 8 학교 표본은 출처 추적용으로 남기되 앱의 전체 집단 응답률을 덮어쓰지 않는다. 이 분포는 과거 참가자 집단의 문항별 응답 맥락이며 개인 등급·현재 학년 규준으로 해석하지 않는다.
- 소스 리포트 PDF 직접 URL은 이 환경의 HTTP 요청에서 404였지만 웹 검색 도구가 PDF 페이지 본문을 읽었고, 보고서/답안 출처 링크는 CSV에 그대로 남겼다. 2013·2014 추가분의 웹 브라우저 화면 검수는 미실시.

### 2026-11-04 웹 검색: AMC 8 2016·2020 학년 자료 재확인

- 2016년은 2022-02-04 MAA 메뉴 보존본에 AMC 8 결과 항목 ID 63이 남아 있으나 결과 본문은 보존되지 않았다. 99CEF가 재현한 미국·캐나다 응시 통계(108,227명, 평균 9.36)는 전체집단 평균으로 기록했다. MAA Michigan Section Newsletter는 같은 해 108,295명·평균 9.36을 보고해 응시자 수가 68명 다르다. 두 보고값을 따로 보존하고 원인을 추측하지 않는다. Bard Math Circle의 35명과 Ivy League Education Center 준비반 통계는 별도 지역·준비반 표본이며 전국 학년 비교에 넣지 않았다. 학년별 표본 수와 전국 학년 평균은 아직 회수되지 않았다. 자료: [99CEF 2019 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2019AMC8Report.pdf), [MAA Michigan Section Spring 2017 Newsletter](https://sections.maa.org/michigan/newsletters/Vol43no2_Spring_2017.pdf), [Bard 2016 AMC 8 결과](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in), [Ivy League Education Center의 2016 결과 게시](https://ivyleaguecenter.org/2016/12/01/2016-amc-8-winners-for-the-u-s-ivy-league-education-center/).
- 첫 검색에서 회수한 MAA Wisconsin Section 뉴스레터는 미국 전체 평균 10.01만 보고해, 당시에는 학년표를 비워 두었다. 후속 웹 검색에서 2차 재게시된 MAA 2020 Overall 학년표를 회수해 Grade 5–8 평균을 추가했다(아래 회수 기록 참고). Bard Math Circle의 학년 평균은 지역 행사 표본이므로 전국 비교에 넣지 않는다. 자료: [MAA Wisconsin Section Fall 2021 Newsletter](https://sections.maa.org/wisconsin/news/MAAWINewsFall21v2.pdf), [Bard 2020 AMC 8 결과](https://www.bardmathcircle.org/p/2020-amc-8), [MAA 표 재게시 원문과 이미지](https://www.testdaily.cn/52247/).
- 2016 AMC 8 문제·답은 [LIVE MAA-authorized archive](https://live.poshenloh.com/past-contests/amc8/2016/answers)에서 다시 확인했다. 이는 이미 연도별 원본 인벤토리에 등록된 회차의 검수 링크이며, 전국 학년 점수 규준을 대신하지 않는다.


## 2026-11-04 웹 검색 회수: 2020 AMC 8 MAA Overall 학년 평균표

- [TestDaily의 2020 AMC 8 분석 페이지](https://www.testdaily.cn/52247/)는 그래프를 MAA 공식 통계의 `Grade and Gender Average AMC 8 2020`으로 설명한다. 첨부된 표 이미지는 `Location: Overall`로 표시되고, Grade, Students, Avg Score 열을 포함한다. 그래프 이미지 파일은 [이 링크](https://testdaily-static.oss-cn-beijing.aliyuncs.com/f/2024-09-29/20240929203745824184e8bb.jpg)다. MAA 호스트 원문이 아닌 2차 재게시 이미지라 출처 상태를 그대로 표시한다.
- 표의 Grade/Students/Avg Score는 `<=4: 762 / 9.35`, `5: 2,782 / 9.31`, `6: 12,242 / 9.08`, `7: 18,378 / 10.02`, `8: 21,829 / 10.63`, `UNK: 106 / 7.42`, `All: 56,099 / 10.00`이다. 숫자는 Apple Vision OCR을 실행하고 각 셀을 원 이미지와 육안 대조했다. 명시된 학년 행 합계는 56,099명으로 표의 All 인원과 맞는다. `<=4`는 묶음 그대로, `UNK`는 학년 미기록으로 보존한다.
- Grade 5–8 평균·인원은 [`amc8-grade-means-2020-maa-overall.csv`](../competition/historical-amc-grade/amc8-grade-means-2020-maa-overall.csv)에 추가하고, 연도·회차별 coverage와 과거 학년 평균 결과 조회에 연결했다. 현재 학년 등급·백분위·대회 자격을 계산하지 않는다.
- [MAA Wisconsin Section 뉴스레터](https://sections.maa.org/wisconsin/news/MAAWINewsFall21v2.pdf)는 2020 AMC 8 미국 전체 평균을 10.01로 보고한다. MAA 그래프의 `Overall` 표본 56,099명/평균 10.00과 분모 및 평균이 달라 두 출처 값을 별도 상태로 유지하고 차이를 추측으로 조정하지 않는다.


## 2026-11-04 웹 검색: AMC12A 연도별 학년 평균표 확장

- 99CEF 연례 AMC12A 보고서의 통계표를 웹 검색으로 회수해 2012, 2013, 2014, 2015, 2016, 2018 A형의 학년별 인원과 평균을 전사했다. 2012–2016은 보고서의 Global 표, 2018은 명시된 United States and Canada 표를 사용한다. Taiwan 표는 섞지 않는다.
- 보고서 표 페이지: [2012 AMC12A](https://web.archive.org/web/20210121210429id_/https://www.99cef.org.tw/userfiles/2012AMC10A&12ASummary.pdf) p.15, [2013](https://web.archive.org/web/20150908065043id_/http://www.99cef.org.tw/userfiles/2013AMC10A12AReport.pdf) p.17, [2014](https://web.archive.org/web/20150908065139id_/http://www.99cef.org.tw/userfiles/2014AMC10A12AReport.pdf) p.17, [2015](https://web.archive.org/web/20160406192614id_/http://www.99cef.org.tw/userfiles/2015AMC10A12AReport.pdf) p.17, [2016](https://www.99cef.org.tw/userfiles/2016AMC10A12AReport.pdf) p.17, [2018](https://web.archive.org/web/20230319031426id_/https://www.99cef.org.tw/userfiles/2018AMC10A12AReport.pdf) p.16. Each PDF table was checked by embedded text and rendered page image.
- Exact grade reference (n, mean /150): Grade 7 — 2012 (35, 68.36), 2013 (34, 71.16), 2014 (48, 61.31), 2015 (22, 70.57), 2016 (31, 77.81), 2018 (36, 65.38). Grade 12 — 2012 (28,268, 65.12), 2013 (26,789, 65.98), 2014 (22,900, 65.37), 2015 (21,743, 70.77), 2016 (21,563, 60.55), 2018 (12,668, 56.95).
- 각 연도에서 모든 표시 학년 및 묶음/미기재 행의 인원 합이 보고서 전체 인원(2012: 72,238; 2013: 66,525; 2014: 55,400; 2015: 55,432; 2016: 55,279; 2018: 32,795)과 일치한다. 2014 하위집단 평균을 인원 가중하면 64.02로, 보고서 전체 평균 64.00과 차이가 있어 원문 수치를 모두 보존하고 보정하지 않았다. 저학년 표본 수가 매우 작을 수 있어 n과 모집단을 함께 표시한다. 이 값은 연도별 과거 집단 평균이며 현재 등급·백분위·능력 예측이 아니다.
- [`amc12a-grade-means-2012-2018.csv`](../competition/historical-amc-grade/amc12a-grade-means-2012-2018.csv), 런타임 exact-grade lookup, coverage manifest에 연결했다. AMC12 B형과 2017/2019 표는 별도 검색 작업으로 계속 추적한다.

## 2026-11-04 웹 검색 회수: AMC12B 2013·2014 Global 학년 평균

- GEMT의 AMC10B/AMC12B 연례 분석 보고서에서 AMC12B Global 통계표를 확인했다. 2013 표 p.13은 Internet Archive 저장본 PDF를 내려받아 Apple Vision OCR과 시각 대조를 마쳤다. 현재 GEMT의 2013 파일 URL은 2014 PDF로 이동한다. 2014 표 p.12는 검색 색인 본문만 확보해 웹 텍스트 전사 상태로 남긴다.
- 2013 AMC12B Global: 전체 n=30,249, 평균 64.08. 보존 PDF 페이지를 렌더링해 기존 색인 전사와 대조했고, 출처 상태를 PDF 시각 검수 완료로 갱신했다. Grade 13 (81, 67.00), 12 (10,856, 65.98), 11 (15,365, 63.47), 10 (2,147, 63.63), 9 (793, 68.12), 8 (234, 67.73), 7 (90, 62.44), <=6 (39, 68.60), unknown (644, 64.00). 모든 행 인원 합은 30,249지만, 행 평균을 인원 가중하면 64.56으로 인쇄된 전체 평균 64.08과 다르다. 표의 하위행이나 전체행을 임의 수정하지 않고 차이를 기록한다.
- 2014 AMC12B Global: 전체 n=33,247, 평균 68.08. Grade 13 (73, 64.23), 12 (11,234, 66.52), 11 (17,303, 67.92), 10 (2,847, 71.75), 9 (828, 71.31), 8 (162, 78.96), 7 (63, 77.81), <=6 (40, 73.76), unknown (697, 74.96). 색인에 11학년 n이 `17.303`으로 표시돼 있어 전체 인원 합산에 맞춰 `17,303`으로 정규화했다. 모든 행 인원 합은 33,247이며 보고서 전체 평균과 가중 행 평균도 반올림 범위에서 일치한다. Taiwan 표는 제외했다.
- 두 연도의 Grade 7·12 값을 exact-year/form/grade reference로 연결했다. 결과 패널은 Global 모집단과 연도별 검수 상태를 명시하며 과거 평균을 현재 능력 등급·백분위로 부르지 않는다. 2013 결과 요약에도 인원 가중 하위집단 평균과 인쇄 전체 평균의 불일치를 노출한다.
- 출처: [2013 GEMT AMC10B/AMC12B 보존 보고서](https://web.archive.org/web/20130919114514id_/http://www.gemt.org.tw:80/wp-content/uploads/2012/11/2013AMC10B12B%E5%88%86%E6%9E%90%E5%A0%B1%E5%91%8A0411.pdf), [2014 GEMT AMC10B/AMC12B 보고서](https://www.gemt.org.tw/wp-content/uploads/2013/10/2014AMC10B12B%E5%88%86%E6%9E%90%E5%A0%B1%E5%91%8A0415.pdf). 2014 보고서 색인에는 AMC12B 전체집단·grade 행이 포함된다.


## 2026-11-04 웹 검색: AMC12B 2012 및 후속 연도 학년표 추가 확인

- 2012 AMC12B의 원본 시험지/정답/전문 풀이 경로는 LIVE 아카이브에 이미 연결되어 있고, LIVE 페이지는 MAA 교육용 재사용 허가를 명시한다. 2012 MAA solutions pamphlet 사본도 검색했다. 원시험 자료는 기존 카탈로그에 이미 있어 중복 레코드는 만들지 않았다.
- 학년별 평균표를 찾기 위해 `2012 AMC 12B grade statistics`, `Average score for grade 12`, MAA 2012B 결과 경로 및 2015–2017 연례 summary 표현을 검색했다. 2012에서 회수한 값은 전체 평균 70.08/AIME cutoff 99/DHR 114뿐이며, 출처는 독립 검증을 모두 마치지 않았다고 밝힌 2차 연도표다. 당시 게시글은 MAA legacy statistics 페이지가 존재했음을 보이지만 grade table의 숫자를 보존하지 않는다. 아카이브된 MAA 메뉴 항목은 확인되나 개별 ReportViewer 본문은 보존되지 않았다.
- 2015–2017 Bard Math Circle 검색 결과는 행사 표본(2015 AMC12B n=6, 2017 n=3)이다. 국가 또는 글로벌 학년 평균으로 바꾸지 않았다. 2016 MAA 교사 매뉴얼은 2015 요약 자료 링크의 존재를 말하지만 검색으로 해당 grade table을 회수하지 못했다.
- 따라서 2012 AMC12B의 `no-grade-table-recovered` 상태를 유지한다. 전체 평균/컷오프가 있다는 사실은 학년 평균표 발견으로 계산하지 않는다.
- 출처: [LIVE 2012 AMC12B](https://live.poshenloh.com/past-contests/amc12/2012B), [MAA 2012 AMC12B solutions pamphlet](https://www.isinj.com/mt-amc12/2012AMC12-Bsolutions.pdf), [2012 당시 MAA 결과 경로를 가리키는 토론](https://talk.collegeconfidential.com/t/official-amc-12-2012-discussion-thread/1242057?page=14), [AMC12 연도별 전체집단 수치(2차 출처)](https://mathgoldmedalist.com/competitions/amc-12), [2016 교사 매뉴얼의 2015 summary 언급](https://studylib.net/doc/8764350/amc-10-12-teachers--manual---mathematical-association-of-...).

## 2026-11-04 GEMT 연례 보고서에서 2014 AMC10B 학년표 추가

- 동일한 GEMT 2014 AMC10B/12B 보고서 p.3에 AMC10B Global grade 평균표가 있어 7–10학년을 exact-grade reference로 추가하고, `<=6`·미기재 학년은 비교에서 제외했다. Taiwan 집단은 포함하지 않았다.
- AMC10B 2014 Global: Grade 10 n=22,389 평균 73.76; Grade 9 n=12,551 평균 64.14; Grade 8 n=3,178 평균 79.36; Grade 7 n=1,511 평균 77.36; `<=6` n=643 평균 70.04; unknown n=1,403 평균 74.35. 총계 행은 n=42,032, 평균 71.45라고 인쇄되어 있다.
- 보고서 p.4의 점수 구간 표는 전체 n=41,682를 보고한다. 학년 하위행 인원 합은 41,675이고, 인원 가중 하위행 평균은 71.38이다. 따라서 전체 수·하위집단 수·전체 평균 사이 불일치를 임의로 보정하지 않고 데이터 주석과 화면에 드러낸다. 표는 검색 인덱스에서 회수했으며 로컬 PDF 렌더 확인은 하지 않았다.
- `amc10b-grade-means-2014.csv`, 런타임 exact-grade lookup, 266회 coverage manifest, 자료 README에 반영했다. 2014 AMC10B 점수 기록은 2014 AMC12B 또는 다른 연도와 혼합하지 않는다.
- 출처: [GEMT 2014 AMC10B/AMC12B report](https://www.gemt.org.tw/wp-content/uploads/2013/10/2014AMC10B12B%E5%88%86%E6%9E%90%E5%A0%B1%E5%91%8A0415.pdf).

## 2026-11-04 2014 AMC10B 문항별 글로벌 응답 분포 추가

- 같은 GEMT 보고서의 2014 AMC10B global response table (printed p.8)에서 25개 문항의 A–E 선택, 무응답, 판독불가 비율을 전사했다. 문제별 정답표와 선택지별 응답은 LIVE 2014 AMC10B Answer Key와 대조했다. Taiwan response table은 사용하지 않았다.
- 각 문항 집단 응답 분모는 보고서 p.4 점수 분포 총계 41,682로 기록했다. 보고서 p.3 요약 통계의 전체인원 42,032와는 차이가 있어 grade mean 데이터와 마찬가지로 수치를 보정하지 않았다. 백분율은 각 질문별 반올림 값이므로 100%와 약간 다를 수 있다.
- 기존 AMC10/12 item response lookup에 2014 AMC10B Global 행을 추가했다. 결과 화면은 자기 오답 선택 비율 또는 가장 많이 선택된 오답 비율을 그 과거 집단 응답과 함께 보여 준다. 이는 정답률/선택 분포 맥락이며 학생의 오개념을 판정하거나 학년·백분위·현재 규준을 뜻하지 않는다. 원본 문항 해설 링크와 함께 사용한다.
- 데이터: [`amc10b-2014-item-response-percent.csv`](../competition/historical-amc-grade/amc10b-2014-item-response-percent.csv). 출처: [GEMT 2014 report](https://www.gemt.org.tw/wp-content/uploads/2013/10/2014AMC10B12B%E5%88%86%E6%9E%90%E5%A0%B1%E5%91%8A0415.pdf), [LIVE 2014 AMC10B answer key](https://live.poshenloh.com/past-contests/amc10/2014B/answers).

## 2026-11-04 · 2016 AMC10A/AMC12A Global 문항별 선택 비율

- 웹에서 99CEF의 [2016 AMC10A/12A 분석 보고서](https://www.99cef.org.tw/userfiles/2016AMC10A12AReport.pdf)를 찾아 Global 모집단 답변표를 회수했다. AMC10A는 인쇄 p.11, AMC12A는 p.22에 A–E 선택·무응답·판독불가 비율이 있다. Global 총 인원은 각각 65,999명과 55,279명이다. Taiwan 표는 혼합하지 않았다.
- 25개 정답 별표는 [LIVE 2016 AMC10A](https://live.poshenloh.com/past-contests/amc10/2016A) 및 [LIVE 2016 AMC12A](https://live.poshenloh.com/past-contests/amc12/2016A)와 대조했다. 마지막 판독불가 비율은 검색 텍스트에서 행이 복제·깨져 보여 이어진 깨끗한 중복 값(AMC10A Q25 0.01%, AMC12A Q25 0.02%)을 CSV에 기록하고 전사 주석을 붙였다.
- CSV 2개와 기존 AMC10/12 응답 lookup에 반영했다. 이는 과거 전체 Global 응답률이며 Grade 7 비교 기준, 현재 규준, 개인의 오개념 판정이 아니다. PDF는 검색 인덱스 텍스트에서 전사했으며 로컬 렌더·Vision 대조는 아직 하지 않았다.
## 2026-11-04 웹 회수: 2018 AMC 10A·12A 미국·캐나다 문항응답표

- 99CEF의 2018 AMC10A/12A 분석 보고서 색인과 LIVE의 원본·답안 키를 웹 검색으로 확인했다. 99CEF 현재 파일 URL은 실제로 2016 보고서로 이동해, Internet Archive 2025-03-17 보존본을 회수했다. PDFKit에서 선택 가능한 텍스트를 읽고 인쇄 p.11(AMC10A), p.22(AMC12A)의 25행 응답표를 이미지로 눈으로 대조했다. OCR은 필요하지 않았다.
- 보고서의 미국·캐나다 코호트는 AMC10A n=40,839, AMC12A n=32,795다. A–E 선택·미응답·판독불가율 50문항을 CSV 및 문항 조회 레지스트리에 저장했다. 정답은 LIVE 2018 A형 키와 교차 확인했으며 AMC10A Q18만 보고서의 정답 별표가 없어 LIVE 정답 D를 적용했다.
- 행별 백분율은 원문 수치 그대로 보존한다. 합계가 100%가 아닌 AMC10A Q22–25 및 AMC12A Q1, Q22–25는 비교 조회에서 숨긴다. 이 집단은 문항별 응답 참고자료일 뿐 학년 규준·개인 백분위·오개념 판정이 아니다.
- 출처: [보존된 99CEF 2018 분석 보고서 PDF](https://web.archive.org/web/20250317215027id_/http://www.99cef.org.tw/userfiles/2018AMC10A12AReport.pdf), [LIVE AMC 10A 2018 정답](https://live.poshenloh.com/past-contests/amc10/2018A/answers), [LIVE AMC 12A 2018 정답](https://live.poshenloh.com/past-contests/amc12/2018A/answers), [LIVE 연도별 실제 시험지 아카이브](https://live.poshenloh.com/past-contests).

## 2026-11-04 웹 검색: 2019 AMC 10B·12B 전체 점수보고서 보강

- mathcontest.org에 재게시된 MAA 형식의 2019 AMC 10B·12B Contest Score Report 1페이지 PDF를 찾아 점수 경계, 평균, 표준편차, 전체 응시자 수와 학교 수를 기존 동일 연도·폼 조회 자료에 연결했다.
- AMC 10B: 상위 1% 121.5, AIME 자격선/상위 2.5% 108, 상위 5% 102, 상위 25/50/75% 73.5/54/40.5, 평균 58.42, 표준편차 23.52, n=23,832, 학교 1,375.
- AMC 12B: 상위 1% 123, 상위 5% 94.5, 상위 25/50/75% 66/52.5/42, 평균 56.73, 표준편차 21.32, n=19,116, 학교 1,459.
- 두 자료 모두 전체 응시 집단 통계이며 학년별 점수 분포나 Grade 7 기준을 제공하지 않는다. AMC 10A의 Grade 7 평균 59.72 (n=1,982)는 별도 학교 게시 자료를 근거로 유지하고, 두 자료를 전국 Grade 7 규준 또는 개인 백분위로 합치지 않았다.
- 출처: [MAA 형식 2019 AMC 10B score report 사본](https://mathcontest.org/sites/default/files/AMC10B-2019-Score-Distribution.pdf), [MAA 형식 2019 AMC 12B score report 사본](https://mathcontest.org/sites/default/files/AMC12B-2019-Score-Distribution.pdf). 이전 연도 요약 출처는 각 항목의 교차 확인 링크로 보존했다.

## 2026-11-04 웹 검색: 2016 AMC 8 학년별 표와 연도 통계 구분

- [99CEF 2018 AMC 8 분석 보고서](https://www.99cef.org.tw/userfiles/2018AMC8Report.pdf)는 2018 회차의 Global·Taiwan 학년별 평균과 인원, 2005–2018 전체 집단 비교표를 함께 제공한다. 2016 행은 미국·캐나다 전체 평균 9.36, n=108,227 및 Taiwan 전체 평균 14.60, n=7,115이며, 해당 연도 학년별 수치는 싣지 않았다. 2016 전체 행은 `amc8-overall-cohort-summary-2002-2020.csv`에 이미 모집단을 분리해 기록되어 있어 중복 행을 만들지 않았다.
- [MAA 현행 점수분포 화면](https://maa.edvistas.com/eduview/report.aspx?mode=6&r832=&view=1561)는 선택한 대회의 전체 점수 구간·평균·표준편차·학생·학교 수를 보여 준다. 이번 조회에 열린 기본 보고서는 2026 AIME II이며, AMC 8 학년별 평균표는 아니다. [MAA AMC 공식 페이지](https://maa.org/student-programs/amc/)에서 AMC 8이 8학년 이하 25문항·40분 대회이고 중학교 수학 주제를 다룬다는 현재 범위도 대조했다.
- 2016 “Contest Score Grade Report”를 가리키는 Think Matrix 페이지는 보고서 이미지가 서명된 임시 Shimo URL로 빠져 만료 상태였고, 2016 MAA 성적관리 원문도 검색 가능한 정적 표로 회수되지 않았다. [Bard Math Circle 2016 결과](https://www.bardmathcircle.org/p/2016-amc-8-results-are-in)는 해당 시험장 35명 성적만, [Ivy League Education Center 2016 게시물](https://ivyleaguecenter.org/2016/12/01/2016-amc-8-winners-for-the-u-s-ivy-league-education-center/)은 자기 수강생·수상자와 전체 평균 요약만 제공한다. 이 표본은 전국 학년별 비교에 넣지 않았다.
- 따라서 2016 AMC 8의 전국 학년별 평균·점수분포는 이 검색에서 회수하지 못했다. 이는 해당 자료가 존재하지 않는다는 뜻은 아니다. 2016 기존 전체집단 평균, 다른 해의 학년 평균, 학교 표본을 서로 대체하지 않고 `grade-report-image-unavailable`/`no-grade-table-recovered` 구분을 유지한다.
- 별도 연도별 원본 시험지는 이미 [LIVE의 MAA 허가 AMC/AIME 전체 아카이브](https://live.poshenloh.com/past-contests)에서 회차별로 제공되며, 각 연도의 인쇄 PDF·정답·풀이가 `amc-original-source-catalog.csv`에 연결되어 있다. 이 검색은 그 원문을 복사하지 않고 공개 출처 링크를 확인하는 작업이다.

## 2026-11-04 웹 검색: 2023–2025 AMC 8 전체 점수분포와 학년표 구분

- 2023–2025 AMC 8 grade-average 검색 결과로 회수된 MAA 공개 score-distribution 자료는 전체 응시자 지표다. 학년별 평균이나 학년별 점수 분포로 바꾸지 않는다. 정확 학년 표를 확인하는 검색은 새 검수 가능한 학년별 원표를 찾지 못했다.
- 2025 보고서 사본은 [Scribd의 AMC 8 2025 Score Distribution Summary](https://www.scribd.com/document/853921775/Contest-Score-Report-2025-AMC8)에 있다. 표는 Top 1% 23, Top 2.5% 21, Top 5% 19, 평균 11.74, 표준편차 4.29, 총 79,511명·2,027개 학교로 전사되어 있다. 같은 해 [Think Academy의 MAA 결과표 재게시](https://www.thethinkacademy.com/blog/amc-8-faqs-the-ultimate-guide-for-first-time-test-takers/)는 평균과 컷오프는 같지만 참가자를 79,524명으로 적어 13명 차이가 난다. 인원 수의 기준·갱신 시점을 확인하지 못했으므로 어느 한쪽으로 고치지 않았고, 새 CSV나 기준 수치로 승격하지 않았다.
- 2024년 점수분포는 [2024-02-28 당시 MAA EduView 링크를 포함한 결과 논의](https://www.dcurbanmom.com/jforum/posts/review/15/1151558.page)에 Top 1% 22, Top 5% 18, 평균 10.75, 표준편차 4.13, 총 80,685명으로 인용되어 있다. [Think Academy의 연도별 표](https://www.thethinkacademy.com/blog/amc-8-faqs-the-ultimate-guide-for-first-time-test-takers/)는 같은 컷오프·평균이지만 80,725명으로 적는다. 원 MAA EduView 링크는 날짜가 포함된 세션 주소이며 현재 재조회에서 동일 회차 보고서 본문을 고정 보존하지 못했다. 참가자 수 차이를 해결하기 전 수치를 앱의 공식 기록으로 추가하지 않았다.
- 재확인한 [현 MAA EduView score distribution](https://maa.edvistas.com/eduview/report.aspx?mode=6&view=1561)은 전체 cohort의 점수 구간·상위 백분율·평균·표준편차·응시자/학교 수를 출력한다. 학년 breakdown은 표시하지 않는다. 그러므로 이 자료는 향후 연도별 대회 컷오프 참고에는 쓸 수 있지만, Grade 7의 과거 또래 비교나 학년 수준 판정에는 쓸 수 없다.
- 다음 검색 대상은 MAA EduView의 과거 회차별 정식 보고서 식별자/내보내기 경로와 2023–2025 학년별 보고서 원본이다. 그 경로가 검수될 때까지 exact-grade 역사 비교와 전체 cohort 컷오프 패널은 별도 유지한다.

## 2026-11-04 후속 웹 검색: AMC 10/12 2017·2019 학년별 통계 원본 경로

- 99CEF의 2017·2019 AMC10A/12A 보고서를 찾기 위해 연도별 파일명, 학년 평균 표기, Global/grade 통계 문구를 각각 검색했다. `2017AMC10A12AReport.pdf`와 `2019AMC10A12AReport.pdf`라는 추정 경로는 웹 검색에서 원문으로 확인되지 않았다. GEMT의 2017 AMC10B/12B 분석 파일도 이 검색에서는 발견하지 못했다.
- 이름이 비슷한 99CEF PDF의 검색 결과도 URL만 믿지 않고 본문을 열어 확인했다. 검색 결과의 `2018AMC10A12AReport.pdf`는 열기 과정에서 2016 AMC10A/12A 보고서로 리다이렉트됐다. 따라서 보고서 파일명·검색 snippet만으로 연도별 통계를 전사하면 안 된다는 점을 확인했다.
- MAA의 보존된 General Reports 메뉴에서는 2017 A/B 통계 항목(ID 64/65)이 확인되지만, 이미 coverage manifest에 기록된 대로 해당 ReportViewer 본문은 보존되지 않았다. 메뉴 존재는 학년표 회수가 아니다. [MAA 보존 메뉴](https://web.archive.org/web/20220204191809/http://amc-reg.maa.org/reports/generalreports.aspx)
- 2019 AMC10A Grade 7 행은 기존에 학교 발행 페이지가 전국 참가자 통계로 보고한 단일 기록(n=1,982, 평균 59.72)만 들어 있다. [학교 발행 페이지](https://www.archimedean.org/amc-grade-7-student-sailalitha-kodukula-makes-history/). 이번 검색으로 그 값의 원 MAA 보고서나 Grade 8–10 표본 행을 회수하지 못해 전체 학년 비교표로 확장하거나 출처 상태를 올리지 않았다. AMC12A/B 2019 행도 추가하지 않았다.
- 다음 근거가 될 수 있는 것은 MAA의 2017 ReportViewer 본문 회수 또는 연도·폼·지역·학년별 행이 모두 포함된 99CEF/GEMT 원 분석 PDF다. 그때까지 2017·2019의 기존 `no-grade-table-recovered` 상태와 2019 Grade 7 단일 secondary row를 분리해서 유지한다.

## 2026-11-04 후속 확인: MAA 2017 보존 보고서 본문 경로

- Internet Archive에 보존된 MAA `generalreports.aspx`의 2017 A/B 항목(ID 64/65)을 다시 열어 보고서 선택 메뉴와 ReportViewer 본문을 분리 확인했다. 저장 HTML에는 2017 선택 항목은 있으나 ReportViewer 영역은 `ReportAreaContent.None`으로 비어 있고, 보고서 렌더링을 요청하는 서버 왕복 결과도 보존돼 있지 않다. 현재 MAA 구형 호스트는 404/521로 응답해 과거 선택 동작을 직접 재현할 수 없었다.
- 이 확인은 보고서가 당시 없었다는 뜻이 아니다. 보존된 메뉴만으로는 점수×학년 표를 회수할 수 없다는 한계를 구체화한다. 따라서 2017 ID 64/65는 출처 탐색 경로로만 남기고 학년 수치로 전사하지 않는다.
- 새로 검색된 [99CEF 2020 AMC10A/12A 분석 보고서](https://www.99cef.org.tw/userfiles/2020AMC10A12AReport.pdf)의 미국·캐나다 학년별 표는 기존 `amc10-12-grade-means-2020-99cef.csv`와 화면 연결에 이미 반영되어 있어 중복 행을 추가하지 않았다. [MAA EduView 현재 점수분포](https://maa.edvistas.com/eduview/report.aspx?mode=6&view=1561)는 전체 코호트 표로, 2017의 학년표를 대신하지 않는다.
- 다음 검색은 MAA 동적 ReportViewer 경로 반복 대신 원문 PDF를 실제로 제공하는 연도·폼별 시험 운영기관 분석 자료에 집중한다. 운영기관 표의 모집단(미국·캐나다, Taiwan, global 등)은 반드시 분리하고, 학교·학원 표본을 전국 기준으로 쓰지 않는다.

## 2026-11-04 웹 검색 대조: 2011 AMC 8 한국 문항 응답표

- [AMC Study의 2011 결과 재게시](https://www.amcstudy.net/79)는 MAA 통계 결과로 소개하며, AMC 8 응시 한국 학생 899명을 명시한다. 이 페이지의 `Item Difficulty by Contest` 표는 1–25번 선택지별 응답률·무응답·판독 불가 비율과 정답 표시를 제공한다. 표는 한국 코호트이며 미국/전체 국제 cohort로 해석하지 않는다.
- 25개 정답 표시를 [LIVE의 MAA 허가 2011 AMC 8 정답표](https://live.poshenloh.com/past-contests/amc8/2011/answers)와 하나씩 대조했다. 기존 `amc8-2010-item-response-percent.csv`에 저장된 2011년 25행과 Q4 등 대표 셀, n=899가 페이지 수치와 일치하며, CSV의 `South Korea reported cohort` 표기도 맞다. 이 행들은 이미 런타임 조회에 연결되어 있으므로 중복 데이터는 추가하지 않았다.
- MAA 공식 사이트의 [2011 AMC 8 보존 통계 페이지](https://web.archive.org/web/20130204052822id_/http://amc.maa.org/amc8/2011/stats/2011-amc8stats.shtml)도 CDX 보존 인덱스에서 확인했다. 현재 보존된 디렉터리에서 Item Difficulty PDF로 검색되는 파일은 California 위치 보고서였고, `Overall` 또는 United States 문항 응답 PDF는 이 경로에서 회수하지 못했다. 따라서 AMC Study의 899명 한국 표본을 MAA 전체 응시자 표처럼 대체하거나 표기하지 않는다. 이는 해당 MAA 자료가 다른 경로에 없다는 뜻은 아니다.
- 같은 2011년 화면에서 한국 점수·학년 백분위 표는 별도 historical cohort reference로 유지한다. 문항별 응답 분포, 학년별 점수 위치, 공식 답안·풀이의 출처와 목적은 각각 다르므로 한 수치로 합치지 않는다.

## 2026-11-04 웹 검색: 2004 AMC 8 응답 통계 원표 후보

- 2004 AMC 8의 실제 시험지, 답안, 문항별 professional solutions는 MAA 사용 허가를 밝힌 [LIVE 2004 AMC 8 페이지](https://live.poshenloh.com/past-contests/amc8/2004)에서 연도별로 확인할 수 있다. 페이지에는 인쇄용 시험지와 정답·풀이가 연결되어 있다.
- 별도 [2004 AMC 8 Results and Statistics 표 사본](https://www.scribd.com/doc/57421446/2004AMC8stats)은 154,590명 코호트의 학년별 평균표와 25문항 A–E 선택·미응답·판독불가 비율표를 싣는다. 같은 표의 전국 통계 및 Grade 4–5/6/7/8 평균은 MAA 작성 56th Annual AMC 요약의 [검색 가능한 사본](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions)으로 교차 확인했다. 이 2004 학년 평균은 기존 `amc8-grade-means-2001-2009.csv`에 이미 있으므로 중복하지 않는다.
- 응답표는 스캔 이미지다. 광고 시청 후 공개된 뷰어에서 표의 A–E/OMITS/? 열을 화면 이미지로 행별 직접 확인해 전사했다. Apple Vision OCR은 사용하지 않았다. 25개 별표 답을 [LIVE 2004 답안 키](https://live.poshenloh.com/past-contests/amc8/2004/answers)와 모두 대조했다. Q1은 인쇄값 합계가 99.74%여서 원값을 유지하고 런타임 비교에서 숨겼다. 나머지 24행은 0.15%p 허용오차 내 합계를 통과했다.
- 25행을 `amc8-2004-item-response-percent.csv`와 AMC 8 응답 조회 레지스트리에 저장했다. 조회 캐시를 갱신했고 기존 응답표 테스트에 2004 답안 25개·분모·행 합계·Q1 억제를 추가했다. 이 전체 응시 코호트 표는 학년별 응답률이나 개인의 오개념 진단이 아니다. 원본 연도별 시험·정답·풀이 링크는 별도 LIVE 경로를 유지한다.


## 2026-11-04 웹 검색: AMC 8 2005 문항 통계와 학년 평균 분리

- [LIVE AMC 8 2005 아카이브](https://live.poshenloh.com/past-contests/amc8/2005)는 실제 문제·인쇄용 시험지·정답·풀이 페이지를 제공한다.
- [MAA 2006 AMC 8 결과·수상 보고서 사본](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary)은 2006년 Item Difficulty 표를 싣고, 2005와 2006 전체 평균을 비교한다. 표 목차와 본문 표기는 응답률이 2006 회차 대상임을 확인한다.
- [MAA 2007 AMC 8 보고서 사본](https://studylib.net/doc/8198991/2007-amc-8-summary-of-results-and-awards)의 Table 2는 2001–2007년 Grade 4–5, 6, 7, 8 참가자 수와 평균을 제공한다. 2005 값은 이미 `amc8-grade-means-2001-2009.csv`에 들어 있어 중복하지 않는다. MAA 문서에는 AMC 8은 확립된 norm이 아니며 수업 배치 시험과 비교할 수 없다고도 적혀 있다.
- “2005 AMC 8 item difficulty / percent answering each problem” 검색에서는 MAA 보고서의 2005 A–E 선택률 전체 표를 회수하지 못했다. 공개된 학교/지역 결과는 해당 모집단의 표본이므로 전국 기준으로 간주하지 않는다. 따라서 2005 grade means는 과거 학년 평균 비교에만, 문항 선택률은 별도 검증된 연도에만 사용한다.
- 이 확인은 문항 응답표가 존재하지 않는다는 결론이 아니라, 이번 검색에서 검수 가능한 출처를 찾지 못했다는 상태 기록이다.


## 2026-11-04 웹 검색: AMC 8 2016 학년·문항 통계 재확인

- 2016 AMC 8 national grade mean/score table과 national item-response report를 연도명·보고서 제목·`Item Difficulty` 문구로 검색했지만, 이번 검색에서 검수 가능한 MAA 전국 원표를 회수하지 못했다. [LIVE의 2016 원본 회차 페이지](https://live.poshenloh.com/past-contests/amc8/2016)는 실제 문제 풀이 자료이며 응시자 답안 분포표의 대체물이 아니다.
- [MAA 2015 AMC 8 Teacher Manual 사본](https://www.scribd.com/document/435100141/2015-AMC8-TeacherManual)은 응시 학교별 결과 보고서에 `Tables of Item Difficulty for the participants in your school`가 포함됨을 설명한다. 이는 학교 단위 결과 기능의 증거이지, 2016년 전국 코호트 응답 자료가 공개되었다는 증거는 아니다.
- 기존 2016 전국 학년 통계는 `no-grade-table-recovered`로 둔다. 학교별 결과가 새로 확보되더라도 전국 수치와 별도로 보관하고 학년 비교 기준으로 합치지 않는다.

## 2026-11-04 웹 재검색 및 AMC 8 학년 비교 결과표

- 다시 검색한 [2009 MAA AMC 8 25th Annual 보고서 사본](https://pdfcoffee.com/maa-amc-8-25-annual-pdf-free.html)은 Table 2의 기록 학년 그룹(4–5, 6, 7, 8)과 점수별 빈도 근거를 제공한다. 검색 결과로 원표의 그룹 구성을 재확인했으며, 학년 빈도 전사본은 보고서의 합계·평균과 교차 대조된 기존 데이터를 사용한다. 모집단 설명은 보고서에 기록된 학교 응시자다.
- [2019 AMC 8 점수 보고서 재게시](https://bj.xdf.cn/zixun/beimei/97334.html)는 MAA Overall 성적 보고서의 학년별 score report image를 가리킨다. [2022 MAA Overall 학년 점수표 재게시](https://www.think-matrix.com/math_planet/awards_setting_and_historical_result/)는 `<5 grade`, 6, 7, 8, 학년 미상 그룹을 구분한다. 화면에서는 원자료처럼 5학년 이하 그룹을 그대로 두고 학년 미상 그룹은 비교행에서 제외한다. 2019·2022 재게시본의 숫자는 기존 CSV 및 요약 평균과 대조 완료된 전사값이며, 독립된 최신 전국 규준으로 표현하지 않는다.
- 2007·2008·2009·2019·2022 동일 연도 안에서 입력 점수보다 낮은 응시 비율과 각 그룹 표본 수를 나란히 볼 수 있도록 `comparisonFor(year, grade, score)`와 결과표를 추가했다. 선택 학년은 “선택 그룹” 문구로 식별한다. 다른 연도·시험, 서로 다른 모집단, 원자료에 없는 개별 4학년/5학년 행을 합산/분리하지 않는다. 화면에도 공식 percentile·현재 능력 등급이 아니라는 경계를 유지한다.

## 2026-11-04 웹 검색: 2007–2008 AMC 8 학년별 점수 분포

- 검색으로 회수한 MAA 작성 2007·2008 AMC 8 `Summary of Results and Awards`의 Table 7에서 4–5학년, 6학년, 7학년, 8학년별 0–25점 빈도를 옮겼다. 보고서는 점수별로 `0(@)`(문항을 일부 푼 학생)와 `0($)`(아무 문항도 시도하지 않은 학생)를 따로 두므로, 온라인 답안 점수와 맞추기 위해 0점에서 합쳤다. 이 구분은 원문 상태표에 남긴다.
- 각 연도 4개 그룹의 26개 점수 구간 합계와 가중평균을 보고서의 Grade Level Score Averages 표와 대조했다. 2007 그룹 표본/평균은 3,170/8.48, 18,687/8.19, 49,594/9.51, 76,907/10.60; 2008은 2,698/10.75, 19,726/9.88, 48,889/11.18, 75,002/12.07로 일치한다. 해당 표에는 전체 응시자 수와 다른 학년 미기록 응시자가 있으므로 개별 학년 분포를 전체 참가자로 표현하지 않는다.
- `amc8-global-grade-score-reference.js`와 `amc8-2007-2008-global-grade-score-counts.csv`에 연결했다. 사용 화면은 해당 연도 원자료 학년 그룹 내 엄격히 낮은 점수 비율을 계산하며, 이를 공식 percentile·현재 규준·능력 등급으로 부르지 않는다. 4·5학년은 원자료 버킷이 결합돼 있어 그대로 표시한다.
- 출처: [2007 MAA 연례 보고서 사본, Table 7](https://studylib.net/doc/8198991/2007-amc-8-summary-of-results-and-awards), [2008 MAA 연례 보고서 사본, Table 7](https://studylib.net/doc/8198989/maa-amc-8---mathematical-association-of-america). 둘 다 MAA 저작물의 제3자 보관 사본이므로 원호스트 검증 상태를 과장하지 않는다.

## 2026-11-04 웹 검색: 2006 AMC 8 학년별 점수 분포

- MAA 작성 2006 AMC 8 `Summary of Results and Awards`의 Table 5 `Results by Grade Level`에서 4–5, 6, 7, 8학년의 0–25점 빈도표를 확인했다. [보고서 웹 보관 사본](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary)에서 기록된 빈도를 옮겼으며, MAA의 2006 보고서 Table 2와 Table 5 Grade Level Score Averages로 표본 수와 평균을 대조했다.
- 각 그룹의 26개 빈도 합은 1,853 / 16,639 / 48,479 / 78,038명이고 계산 평균은 각각 8.21 / 8.51 / 9.82 / 10.75로 보고서 표기와 일치한다. Table 5는 0(@) 일부 문항 풀이와 0($) 미시도 학생을 따로 집계하므로 점수 입력과 비교하기 위해 0점에서 합쳤다. 이 표의 보고서 코호트는 국제 학교 참가자를 포함한다.
- `amc8-2006-global-grade-score-counts.csv` 및 `amc8-global-grade-score-reference.js`에 추가했다. 화면은 동일 보고서 학년 그룹별로 입력 점수보다 낮은 점수를 받은 비율을 계산한다. 해당 비율을 공식 percentile, 현재 규준, 개인 능력 등급으로 해석하지 않는다. 보고서는 제3자 호스트의 재게시본이다.
- 검수는 데이터 모듈의 9개 핵심 assertion(그룹 순서/표기, 입력 그룹, 세 연도 계산값, 유효하지 않은 연도·학년·점수 차단)을 node_repl에서 수행했다. 시스템 쉘에 Node 실행기가 없어 `node --test` 브라우저 테스트는 실행하지 못했다. CUA의 브라우저 탭 접근이 URL 정책에 차단되어 결과 화면 수동 검수도 하지 못했다. HTML/JS/CSS 정적 연결, 캐시 버전, 표의 접근 가능한 행/열 제목 및 `git diff --check`를 추가 확인한다.

## 2026-11-04 웹 검색: 2005 AMC 8 자료 범위 확인

- [MAA 2007 AMC 8 Results and Awards Summary](https://www.scribd.com/document/618492777/2007-AMC-8-Summary-of-Results-and-Awards-PDFDrive)의 Table 1–2에는 2005년 전체 평균 9.835와 기록 학년별 표본/평균(4–5: 2,014명/8.05; 6: 14,268명/8.16; 7: 48,418명/9.37; 8: 76,877명/10.52)이 실려 있다. 보고서 목차와 표 본문을 확인했으며, 이 자료에서 점수 0–25의 학년별 빈도표는 확인하지 못했다. 이미 있는 평균 자료를 점수별 분포로 바꾸거나 추정하지 않는다.
- 실제 2005 시험은 [LIVE의 2005 AMC 8 페이지](https://live.poshenloh.com/past-contests/amc8/2005)에서 25문항·40분 온라인 풀이, 인쇄 PDF, 정답표, 전문 풀이로 연결된다. 페이지는 MAA 공식 법적 허가를 명시한다. 이 연도는 문제 원본·해설 학습에는 바로 쓸 수 있고, 학년별 점수 이하 비율은 분포 자료가 확보될 때만 제공한다.
- 보고서 자체는 당시 AMC 8에 확립된 규준이 없고 교실 평가나 배치시험과 비교할 수 없다고 주의한다. 따라서 과거 코호트 평균과 향후 복원할 분포는 같은 회차 안의 참고 자료로만 제시한다.

## 2026-11-04 AMC 8/10/12 같은 회차 학년 평균 비교

- 앞서 인벤토리한 연도별 학년 평균 테이블 중 2001–2022 AMC 8 일부 연도, AMC 10/12의 기록된 연도·폼을 결과 화면에 더 직접 연결했다. 새 통계값은 추가하지 않았다.
- `amc-historical-grade-reference.js`의 `comparisonFor(program, year, form, grade)`는 선택한 정확 학년 기록과 연도·폼·출처 URL·출처 유형·보고 모집단이 일치하는 그룹만 반환한다. 원자료의 `4–5`, `<=8`처럼 묶인 학년은 묶음으로 표기하고 학년 미상은 제외한다. 사용자 선택 그룹은 텍스트로 표시한다. 서로 다른 모집단·출처·시험을 한 표에 합치지 않는다.
- 결과의 “같은 회차 · 학년별 평균” 표에는 점수 / 만점과 그룹별 보고 표본 수를 함께 표시한다. 개인 점수와 해당 학년 평균 비교 문구도 그대로 유지하며, 평균을 등급·백분위·수상 판정으로 바꾸지 않는다.
- 검수: 데이터 모듈에서 정확 학년 기록 238개 전부에 대해 비교행 존재, 선택 그룹 표시, unknown 제외, source URL/status 일치 확인. 로컬 브라우저에서 2009 AMC 8, 2011 AMC 10A 결과 표의 실제 렌더링을 확인했다. 2011 A의 Grade 8 and below, 9, 10 그룹/표본 수가 기존 MAA 통계 CSV와 맞는다. 브라우저 자동 테스트는 시스템 쉘 Node 부재로 미실행 상태다.

## 2026-11-04 · 2025–2026 공개 AMC 8 비교자료 재검색

- 웹 검색으로 2025 AMC 8 점수 요약 재게시본, 2026년까지 연도별 요약을 모은 제3자 안내, MAA 학생 포털 가이드와 2024–25 AMC 8 교사용 매뉴얼을 대조했다. MAA 포털 가이드는 학생 개인이 2022–23 주기부터 과거 점수를 볼 수 있다고 설명하고, 교사용 매뉴얼은 주최자가 학생 점수 보고서를 확인·공유하는 흐름을 설명한다. 이 자료는 공개된 전국 학년×점수 빈도표가 아니다. [MAA 학생 포털 가이드](https://maa.org/wp-content/uploads/2025/06/Guide-to-the-AMC-Student-Portal.pdf) · [MAA AMC 8 교사용 매뉴얼](https://maa.org/wp-content/uploads/2024/09/2024-25-AMC-8-Teachers-Manual-FINAL.pdf)
- 2025 점수 요약의 제3자 재게시본은 평균 11.74를 기재하지만, 다른 제3자 요약은 11.75로 표기한다. 두 값의 차이를 임의 조정하지 않고, 회차 전체 통계와 학년별 비교를 별도로 유지한다. [2025 AMC 8 점수 요약 재게시본](https://www.scribd.com/document/853921775/Contest-Score-Report-2025-AMC8) · [2022–2026 요약표](https://beyondgradestem.com/competitions/amc-8/scores/)
- 2025·2026 행은 `no-grade-table-recovered`로 두고, 이 상태를 자료 부재의 증명으로 읽지 않도록 범위를 명시했다. 학생 본인 성적표, MAA 공개 전체 응시자 기준점, 공개된 과거 학년 표본 비교는 각각 다른 레이어다. 전체 기준점은 학년별 등급이나 전국 동학년 순위로 바꾸지 않는다.
- 앱에서 완성된 AMC 8/10/12 결과에 같은 회차·학년의 참고자료가 연결되지 않은 경우, `amc-grade-comparison-unavailable` 문구를 보여 주도록 했다. 자료가 있는 2022 AMC 8에서는 기존 평균 비교가 표시되고 안내 문구는 숨겨진다.

## 2026-11-04 · 2011 AMC 8 세계 학년 평균 회수

- [99CEF 2011 AMC 8 summary PDF](https://www.99cef.org.tw/userfiles/2011AMC8Summary.pdf)의 `27th AMC8 2011` 세계 통계표에서 <=4학년 n=938, 평균 8.31; 5학년 3,456, 9.30; 6학년 22,879, 9.33; 7학년 50,176, 10.66; 8학년 72,230, 11.45를 확인했다. 이 보고서는 MAA 원본 호스트가 아닌 99CEF 국제 주관자/분석기관의 PDF이며 데이터 상태는 web-indexed PDF table text로 표시했다.
- 학년이 기재된 다섯 그룹은 149,679명으로 보고서 전체 152,745명보다 3,066명 적다. 이 차이를 특정 학년에 배분하지 않았다. 전체 평균 10.76과 학년별 평균은 모집단 범위가 각각 보존된 별도 보고값이며, 학년별 점수 빈도표/백분위는 이 자료에서 회수하지 않았다. 한국 2011 응시집단(n=899) 결과와도 합치지 않는다.
- CSV `competition/historical-amc-grade/amc8-grade-means-2011-99cef.csv`와 `amc-historical-grade-reference.js`에 5–8학년 평균을 추가했다. <=4 그룹은 정확 Grade에 자동 연결하지 않는다. AMC 8 2011 Grade 7 입력은 같은 연도 Grade 7 평균 및 표본을 보여 줄 수 있다.

### 2026-11-04 · 2012 AMC 10A Global 학년표 추가

- 웹 검색에서 [99CEF의 2012 AMC10A/12A 연례 분석 보고서](https://www.99cef.org.tw/userfiles/2012AMC10A%2612ASummary.pdf) 본문과 통계표를 찾았다. 현재 원본 경로는 접근이 불안정하고 2016 보고서로 대체되기도 하지만, Internet Archive의 [2021 PDF 저장본](https://web.archive.org/web/20210121210429id_/https://www.99cef.org.tw/userfiles/2012AMC10A&12ASummary.pdf)은 기존 2012 AMC12A 학년 자료에도 쓰이는 보존본이다.
- 보고서 p.5의 AMC10A Global 학년별 값은 Grade 10 36,206명/74.25점, Grade 9 25,498명/69.16점, Grade 8 3,948명/81.72점, Grade 7 1,810명/78.83점이다. 원문 그룹 합계는 전체 73,703명과 일치한다. `<=6`(978명/74.90점)과 학년 미기재(5,263명/67.21점)도 CSV에 보존하되 학년별 화면 비교에서는 제외했다.
- 같은 표의 Taiwan 행은 Global 집계와 별도다. 앱은 Global Grade 7–10 값만 같은 연도·폼·학년이 일치할 때 표시한다. 이를 백분위, 현재 학년 등급, 대회 진출 가능성으로 해석하지 않는다.
- 원자료는 `competition/historical-amc-grade/amc10a-grade-means-2012-global.csv`, 화면 참조는 `competition/amc-historical-grade-reference.js`, 회차 범위는 coverage manifest에 반영했다. MAA의 2012 ReportViewer 본문은 보존 캡처에서 열리지 않았고 99CEF 보고서는 국제 주최기관의 별도 집계이므로, 출처 유형과 모집단을 데이터에 남긴다.

## 2026-11-04 · 2013 AMC10B Global Grade Means PDF 검수

- [2013 GEMT AMC10B/AMC12B 보고서 보존본](https://web.archive.org/web/20130919114514id_/http://www.gemt.org.tw:80/wp-content/uploads/2012/11/2013AMC10B12B%E5%88%86%E6%9E%90%E5%A0%B1%E5%91%8A0411.pdf)을 내려받았다. 현재 GEMT URL은 2014 보고서로 이동하므로 보존 PDF를 출처로 쓴다. 인쇄 p.4의 Global 열을 Apple Vision으로 OCR하고 PDF 페이지 이미지와 대조했다.
- AMC10B Grade 7: n=1,342, mean 75.93; Grade 8: 2,593, 81.63; Grade 9: 11,239, 67.23; Grade 10: 17,726, 73.74. 전체 Global n=34,740, mean 72.34. 표의 학년 그룹 전체 합은 34,738로 총계보다 2명 적다. 원문 차이를 보정하지 않았다. Taiwan 열은 별도 유지했다.
- 2013 AMC12B 인쇄 p.13도 같은 PDF에서 다시 확인해 기존 색인 전사와 평균 차이를 대조했다. 2014 AMC12B는 여전히 웹 색인 텍스트만 확보된 상태다.
- CSV `amc10b-grade-means-2013-global.csv`, `amc12b-grade-means-2013-2014.csv`, 런타임 조회 JS와 coverage manifest를 갱신했다. PDF와 페이지 PNG는 검수가 끝난 뒤 임시 폴더에서 제거했다.

### 2026-11-04 · 2012 AMC 8 전체 점수 분포 연결

- 99CEF의 [2012 AMC 8 연례 분석 보고서](https://www.99cef.org.tw/userfiles/2012_AMC8_Report.pdf)에서 28th AMC 8 Global·Taiwan의 점수별 인원과 누적표(pp.7–8)를 웹 문서 뷰어의 표 텍스트로 회수했다. 원문은 Global 151,117명, Taiwan 12,550명이며, 각 모집단의 0–25점 26개 빈도 합계가 해당 표본 수와 일치한다. 가중평균은 Global 10.6448→10.64, Taiwan 15.4662→보고서 반올림 15.5로 일치한다.
- Global 연도별 점수 빈도는 `competition/historical-amc-grade/amc8-2012-global-taiwan-score-counts.csv`에 보존했다. 결과 화면의 전체 코호트 비교는 2012년 이 자료를 사용해 입력 점수보다 낮은 점수의 비율을 계산한다. 동점자를 제외한 보고서 빈도 기반 역사 비율이지, 공식 백분위·학년 순위·현재 규준·실력 등급이 아니다. Taiwan 빈도는 별도 모집단으로 기록하고 현재 화면에서 Global과 합치지 않는다.
- 2012년 당시 상세 보고서는 Global 평균 10.64, n=151,117을 보고하지만, 99CEF 2019년 회고표는 10.66, n=150,360을 기록한다. 모집단/집계 차이 원인은 공개 자료만으로 확인하지 못해 소스별 값을 유지했다. 2012 비교기는 당해 상세 보고서를 표시하고 화면에 차이를 설명한다.
- `amc8-overall-cohort-reference.js`, 결과 안내, 캐시 버전과 연구 README를 갱신했다. 학년별 점수 빈도표는 회수하지 않았으므로 같은 해 Grade 7 점수 분포는 계속 미연결 상태다. Grade 7 평균 자료와 전체 Global 점수 분포는 별도 비교 층으로 남는다.
# 2003–2004 AMC 10/12 annual grade table discovery (resolved)

The [MAA-authored 56th Annual AMC report copy](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions) contains a four-year comparison table for 2002–2005, including recorded-grade participation counts and mean scores by AMC 10/12 A/B form. Its introductory summary identifies the report as covering the 2005 contests, and the report's body states that international schools participated; the grade tables do not separate domestic and international results.

The initial web text extraction interleaved the multi-column grade counts and means, so the values were held back rather than guessed. This research blocker was later resolved using the original report PDF captured by Internet Archive, Apple Vision OCR, and visual column checks. See “2026-11-05 후속: MAA 56th Annual 표에서 AMC 10/12 2003–2004 값 전사” below: 44 records now reside in `amc10-12-grade-means-2002-2011.csv`, the eight year/form rows are marked verified in `amc-grade-reference-coverage-by-paper.csv`, and the exact year/form/grade lookup is connected to the paper-review result. Rounded grade means were reconciled to Table I form-wide means. The archived report does not separate domestic and international participants.

## 2026-11-05 웹 검색: MAA 학년별 AMC 10/12 원표 재접근

- 검색에서 MAA의 56th Annual AMC 보고서 전문을 제공하는 [Doczz 보관본](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions)을 다시 확인했다. 목차는 Table II를 `Participation and Average Score by Recorded Grade Levels`로 명시하고, 본문은 2002–2005 학년별 참여 수 및 평균 표가 있음을 보여 준다. 인접한 Table I에는 2003–2005 각 폼의 공식 전체 참가자 수와 평균이 있어 교차 검산 기준을 제공한다.
- 원 보고서의 옛 UNL 호스트 주소 `2005-HSsummary.pdf`에 대응하는 [Archive-It 보존 URL](https://wayback.archive-it.org/all/20081031153754/http://www.unl.edu/amc/d-publication/d1-pubarchive/2004-5pub/2005-HSsummary.pdf)도 찾았다. 현재 직접 회수는 Archive-It 세션 확인 페이지에서 멈췄다. 해당 보호 절차를 자동 우회하지 않는다.
- Doczz의 검색 가능한 텍스트는 Table II의 여러 폼·학년 열을 행 단위 텍스트로 풀면서 인접 열 값을 섞는다. 보고서가 표의 존재와 해당 연도를 증명하지만, 2003/04 grade-by-form 셀을 신뢰성 있게 특정하기에 충분하지 않아 숫자는 추가하지 않았다. 인쇄 페이지 이미지/PDF를 확보한 뒤 표 구조를 눈으로 확인하고, 기존 원칙대로 학년 표본 합계 및 가중 평균을 전체 폼 통계와 대조해야 한다.
- 별도로 [MAA 2010 High School Summary 재게시본](https://www.scribd.com/document/51428451/2010-HS-summary)의 표 I–II를 확인했다. 이는 AMC 12 2007–2010 및 AMC 10 2007–2010의 학년별 인원·평균과 전체 통계를 포함하지만, 해당 연도는 기존 `amc10-12-grade-means-2002-2011.csv`의 범위와 중복된다. 새 행은 넣지 않았다. 이 사본은 2003/04 셀을 복구하는 데 도움이 되지 않는다.
- 이번 검색으로 MAA 작성 보고서에서 학년별 참여·평균 표가 실제로 실렸다는 원문 근거와 Archive-It의 보존 경로를 확인했다. 2003/04 정확한 전사 및 출시 가능한 비교 기준은 여전히 미완료다.

## 2026-11-05 웹 검색: 인쇄 연례보고서 아카이브 확인

- [Ian Calaway의 AMC 보고서 아카이브 안내](https://sites.google.com/view/ian-calaway/amc-archive/)는 고교 AMC Summary of Results and Awards의 1980–2010 인쇄본을 수집·디지털화했고, 이후 디지털 결과를 2011–2022까지 정리했다고 밝힌다. 이 페이지에서 공개로 연결된 파일은 1968년 보고서 한 권과 1990년 서문 발췌 두 개뿐이었다. 2005 보고서 인쇄면을 바로 볼 수 있는 공개 링크는 찾지 못했다.
- 검색에서 `Yearbooks`라는 이름의 공개 Google Drive 폴더가 연도별 PDF를 제공하는 것처럼 나타났으나, 2004 파일을 내려받아 첫 페이지와 앞부분 10쪽을 Apple Vision으로 읽어 보니 AMC 통계 보고서가 아니라 지역 고등학교의 학생 연감이었다. AMC 원자료가 아니므로 데이터 출처에서 제외했고 저장소에는 넣지 않았다.
- 저자의 [Early Mentors 논문](https://icalaway.github.io/job-market-paper/Calaway_JMP.pdf)은 1980–2010 결과를 종이 연례보고서에서 직접 수집하고 2011–2020은 AMC 디지털 아카이브에서 수집했으며, 고득점 학생 명단에 학년이 포함된다고 설명한다. 이 설명은 보고서 아카이브의 범위를 뒷받침하지만, 원자료 데이터셋의 공개나 재사용 허가를 뜻하지 않는다. 개인 점수·명단은 비교 기준 데이터로 가져오지 않는다.
- 현재 확인된 가장 유용한 출처는 계속 [MAA 작성 56th Annual 보고서의 Doczz 텍스트 보관본](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions)이다. 이 보관본에서 표의 존재와 공식 전체 평균은 확인되지만 multi-column 학년 셀의 원본 시각 구조는 확인 불가다. 2003/04 숫자는 계속 보류한다.


## 2026-11-05 후속: MAA 56th Annual 표에서 AMC 10/12 2003–2004 값 전사

앞서 보고서 텍스트 미러만으로 수치 전사를 보류한 항목을 공개 Internet Archive 원본 캡처로 해결했다. [2005 MAA High School Summary 보존 PDF](https://web.archive.org/web/20081031153754id_/http://www.unl.edu/amc/d-publication/d1-pubarchive/2004-5pub/2005-HSsummary.pdf)는 인쇄 쪽 8(Table II, PDF 쪽 10)에 2002–2005 AMC 10A/B와 AMC 12A/B의 기록 학년별 참가 수·평균을 싣고 있다. [MAA 작성 보고서의 검색 가능한 미러](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions)로 표 제목과 연도를 대조하고, 보존 PDF 쪽을 macOS Apple Vision OCR한 뒤 표의 열·행을 이미지에서 확인했다.

`competition/historical-amc-grade/amc10-12-grade-means-2002-2011.csv`에는 2002 AMC 10/12 A/B의 인원·평균이 모두 보이는 학년 22개 기록과 AMC 10 2003/04, AMC 12 2003/04 총 44개 기록을 추가했다. 반올림된 학년 평균에 참가 수를 곱해 가중한 결과는 표 I의 폼 전체 평균과 일치한다: AMC 10 2003A/B 74.4/79.6, 2004A/B 69.1/80.4; AMC 12 2003A/B 77.8/76.6, 2004A/B 73.9/84.5. 참가자 수·평균은 MAA 보고서의 기록 학년 표본이며, 보고서가 미국/국제 참가자를 별도 분리하지 않으므로 국가별 규준으로 부르지 않는다.

`amc-grade-reference-coverage-by-paper.csv`의 8개 회차 상태를 전사 완료로 바꾸고, 브라우저의 정확 연도·폼·학년 조회 자료와 캐시 키를 갱신했다. 숫자가 인쇄되지 않은 AMC 10의 상위 학년 조합은 평균을 만들거나 보간하지 않았다. 기존 Doczz 검색결과의 열 혼합 때문에 멈춰 있던 검증 상태를 보존 PDF 페이지와 가중평균 검산으로 대체했다.


### 2002 AMC 10/12 recorded-grade comparison (2026-11-05)

Web search located the MAA-authored 56th Annual report and its preserved Internet Archive PDF. Table II (printed p. 8 / PDF p. 10) publishes 2002 AMC 10 A/B and AMC 12 A/B grade counts and means. Added 22 exact count-and-mean records to the year-organized grade-reference CSV and connected them to the exact year/form lookup. Weighted means of the rounded group means reconcile to Table I: AMC 10A 68.45→68.5 (n=77,302), AMC 10B 74.86→74.9 (n=24,800), AMC 12A 72.65→72.7 (n=103,070), and AMC 12B 80.77→80.8 (known grade groups n=33,161; the Table I overall n is 33,407). Means with no printed participant count are omitted: AMC 10 Grade 11 (both forms) and AMC 12 Grade 13 form B. The cohort is not separated into domestic and international participants.

Sources: [preserved MAA report PDF](https://web.archive.org/web/20081031153754id_/http://www.unl.edu/amc/d-publication/d1-pubarchive/2004-5pub/2005-HSsummary.pdf), [searchable copy of the MAA-authored report](https://doczz.net/doc/1401277/56th-annual---american-mathematics-competitions), and [year-by-year AMC historical mean table](https://uploads.strikinglycdn.com/files/8d7768ae-a5da-4b71-bb83-958231edc445/12446545885.pdf).

## 2026-11-05 웹 검색: 2005 AMC 8 전체 점수분포 표 연결

- MAA 작성 2006 AMC 8 Summary의 Table 6 `AMC 8 score comparison`은 2005·2006년 전체 응시집단의 점수 0–25별 인원 수를 싣는다. 2005 숫자는 searchable report text에서 확인했고, 26개 빈도 합은 Table 1의 answer forms received 143,428명과 일치한다. 인쇄 p.160.
- 빈도 가중평균 9.8451은 Table 1/2의 보고 평균 9.835보다 0.0101점 높다. 임의로 셀을 고치지 않고 빈도표와 보고 평균을 따로 연결했다. 점수 위치는 빈도표 분모를, 평균 비교는 MAA 보고 평균을 사용하며 paper-review 결과에 출처 차이를 고지한다. 표의 image scan을 확보하지 못해 Apple Vision OCR 시각 검수는 하지 않았으며, 데이터 상태는 web-indexed text transcription이다.
- 새 `amc8-2005-overall-score-counts.csv`와 연동 로직은 전체 응시 코호트 비교만 지원한다. Table 6에는 학년별 점수 빈도가 없으므로 이를 기존 2005 recorded-grade means와 합치지 않는다. MAA 보고서는 AMC 8에 확립된 규준이 없다고 설명하므로, 해당 표시도 공식 percentile·학년 등급이 아니다.
- 출처: [2006 MAA report, Scribd](https://www.scribd.com/document/618492772/2006-Amc-8-Summary), [대체 검색 텍스트, StudyLib](https://studylib.net/doc/28486602/618492772-2006-amc-8-summary), [MAA Wisconsin Section newsletter](https://sections.maa.org/wisconsin/news/MAAWINewsFall06.pdf).


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
