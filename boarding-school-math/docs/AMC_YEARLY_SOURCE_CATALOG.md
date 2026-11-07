# AMC 연도별 원본 자료 색인

확인일: 2026-11-08 (KST)

연도별 공개 색인을 읽어 AMC 8·10·12와 AIME의 **개별 회차 268건**을 정리했습니다. [CSV](../competition/amc-original-source-catalog.csv)는 회차별 온라인 시험지, 인쇄 PDF, 정답표, 전문 풀이의 URL만 보관합니다. 시험 문항·정답·풀이 본문은 복사하지 않습니다.

앱의 현재 연도 선택과 일치하는 확인에서 268회 전체의 원본 형식·문항별 개념 참조·공개 답안 키가 모든 문항에 연결된다. 선택된 원본 형식의 합계는 6,550문항이며 세 참조의 연도·폼·문항 인덱스를 JavaScriptCore에서 대조해 누락 0건을 확인했다. 개념 항목은 GFIELD 편집자의 학습 영역 제안이지 교사 검증된 진단·숙달 기준은 아니다. 2026 AMC 10A/12A는 MAA/LIVE 색인 대신 Think Academy 재게시 자료를 명시하며, 해당 개념 메타데이터는 Random Math Wiki의 공개 풀이 색인을 별도 근거로 쓴다.

| 대회 | 공개 색인 연도 | 폼 포함 회차 |
|---|---:|---:|
| AMC 8 | 1985–2026 (2021 제외) | 41 |
| AMC 10 | 2000–2026A | 53 |
| AMC 12 / 과거 AHSME | 1950–2026A | 103 |
| AIME | 1983–2026 | 71 |
| 합계 | | 268 |

회차 구분은 공개 색인의 실제 경로와 맞췄습니다. AMC 10/12는 2000·2001년에 단일 시험지, 2002년 이후 대다수는 A/B, 2021년은 A–D입니다. AIME는 1983–1999 단일 시험지, 2000년 이후 I/II입니다. AMC 12의 1950–1999 자료는 LIVE 색인 경로를 따라 보관했고, 앱에는 해당 시기 시험을 AHSME로 표시합니다.

## 제품 흐름

문제 복습 화면에서 대회·연도·폼을 고르면 다음 원본 링크가 각각 열립니다.

1. 실제 원본 시험지 PDF를 인쇄하고 제한 시간에 풉니다.
2. 회차별 공개 정답표를 열어 답을 대조하고, 내 답과 맞힘·오답·미응답을 입력합니다.
3. 문항 번호별 원본 풀이·개념 링크와 영역·오류 이유 입력으로 막힌 부분을 기록합니다.
4. 결과에서 해당 회차의 오답 번호·영역을 GFIELD가 만든 별도 유사 유형 연습으로 넘깁니다.

정답 대조는 원본 제공처의 정답표를 열어 학습자가 확인하는 흐름입니다. 앱에 외부 시험의 답안이나 문항별 풀이를 저장하지 않습니다. MAA 허가를 받은 원문은 LIVE 제공처에서 열며, LIVE의 난도 표시를 MAA 학년 규준처럼 해석하지 않습니다. 공개된 전체 응시자 기준점과 역사적인 학년별 자료는 서로 다른 지표로 구분합니다.

## 확인 근거

- [LIVE AMC/AIME 전체 색인](https://live.poshenloh.com/past-contests)은 실제 AMC 문항의 게시가 MAA의 공식 법적 허가를 받았다고 밝히며, 전체 색인에서 266회 시험과 6,500문항을 안내합니다.
- 2025 AMC 10 A 페이지는 printable PDF, answer key, professional solutions, 문항별 풀이로 연결됩니다. 확인한 동작은 [시험지 PDF](https://live.poshenloh.com/images/past-contests/pdf/amc10-2025A-exam.pdf), [정답표](https://live.poshenloh.com/past-contests/amc10/2025A/answers), [전문 풀이](https://live.poshenloh.com/past-contests/amc10/2025A/solutions)입니다.
- 직접 PDF 경로와 동반 자료 경로는 AMC 8 2024, AMC 10 2000·2025 A, AMC 12 1950, AIME 1983·2024 I에서 HTTP 200을 확인했습니다. 인쇄 PDF와 답·풀이 URL은 출처 페이지의 실제 링크 및 라우팅 규칙과 대조했습니다.
- [2009 AMC 8](https://live.poshenloh.com/past-contests/amc8/2009), [2010 AMC 10 A](https://live.poshenloh.com/past-contests/amc10/2010A), [1950 AMC 12](https://live.poshenloh.com/past-contests/amc12/1950), [1983 AIME](https://live.poshenloh.com/past-contests/aime/1983)까지 과거 원본 회차 페이지가 열리는 것을 확인했습니다.

이 색인은 연도별 **원본 자료 접근 목록**입니다. 점수로 학년을 배치하거나, AMC 점수를 현재 학년별 능력 등급·수상·AIME 진출 가능성으로 환산하는 규준표가 아닙니다.

## 2026–27 회차 확인 (2026-11-04)

[MAA 공식 일정](https://maa.org/student-programs/amc/)은 AMC 10A/12A를 2026년 11월 5일, AMC 10B/12B를 11월 13일, 다음 AMC 8을 2027년 1월 21–27일로 안내합니다. 2026-11-04 당시 공개 색인에 2026 AMC 10/12 원본은 없었습니다. 11월 8일 재확인에서 10A/12A 시행과 제3자 공개 자료를 확인해 별도 출처 표시로 추가했습니다. LIVE 공식 자료가 게시되면 링크를 교체합니다. 아직 시행 전인 10B/12B는 목록에 넣지 않습니다.

MAA는 현재 AMC 8을 8학년 이하 대상 25문항·40분의 중학교 수학 경시로, AMC 10을 10학년 이하 대상 25문항·75분으로 안내합니다. AMC 10 범위는 기초 대수·기하·정수론·확률이며 삼각함수와 고급 대수·기하는 제외합니다. AMC 12도 25문항·75분이며 고교 수학 전 범위를 다루되 미적분은 제외합니다. 이는 대회별 내용 범위를 설명하는 공식 안내이지, 특정 학년의 숙달도 판정 기준은 아닙니다.

[MAA 공개 점수 분포 보고서](https://maa.edvistas.com/eduview/report.aspx?mode=6&r832=&view=1561)는 해당 대회의 전체 점수 경계·평균·표준편차·응시자/학교 수를 제공합니다. 이번 확인에서 학년별 응시자 평균 표는 찾지 못했습니다. 전체 응시자 통계와 과거 공식 보고서의 기록 학년 통계를 섞지 않으며, 학년 비교는 연도·폼·지역·학년·표본 수가 명시된 자료가 있을 때만 별도 표시합니다.

### 2026 AMC 10A·12A 원본 링크 추가 (2026-11-08)

MAA 일정에 따르면 10A·12A는 2026-11-05에 시행됐고 10B·12B는 2026-11-13 예정입니다. 11월 6일 게시된 Think Academy 회차별 페이지에서 문제 PDF, 정답 키 이미지, 풀이 PDF 링크를 확인해 카탈로그에 2026A 두 행을 추가했습니다. 12A 풀이는 한 문서 칸에서 접근할 수 있도록 게시물 페이지를 연결했으며 페이지 안에 Q1–15와 Q16–25 풀이 PDF가 각각 있습니다. 현재 MAA/LIVE 원본 아카이브의 2026 AMC 10/12 행은 찾지 못해 이번 링크는 제3자 재게시로 분명히 표시했습니다. MAA 공식 아카이브에 게시되면 해당 행을 공식 원본으로 교체할 항목입니다. PDF 내용은 링크 확인과 문항 수 확인에만 사용하고 저장소에 복사하지 않습니다.

확인한 자료: [MAA 공식 일정](https://maa.org/student-programs/amc/), [AMC 10A 페이지/문제·정답·풀이](https://www.thethinkacademy.com/blog/2026-amc-10a-problems-solutions/), [AMC 10A 문제 PDF](https://www.thethinkacademy.com/blog/wp-content/uploads/2026/11/2026-AMC-10A-Paper.pdf), [AMC 12A 페이지/문제·정답·풀이](https://www.thethinkacademy.com/blog/2026-amc-12a-problems-solutions/), [AMC 12A 문제 PDF](https://www.thethinkacademy.com/blog/wp-content/uploads/2026/11/2026-AMC-12A-Paper.pdf).

### 원본 링크 전체 확인


2026-11-08에는 화면의 연도 선택기·자료 열기·답안 대조까지 2026 AMC 10A/12A를 연결했다. 두 시험 모두 문제 PDF, 공개 키, 풀이로 이어지고 각 공개 키는 25문항이다. Think Academy 출처 표식을 결과의 채점 설명에 표시한다. 2026 A형 문항별 LIVE 경로는 아직 없어 전체 풀이 자료로 연결하며, 문항별 개념 분석은 학생이 결과 화면에서 오답 이유를 표시하는 기존 흐름을 쓴다. 2026 B형은 시행일 전이라 선택 목록에 나타나지 않는다.

## 2026–27 AIME 현행 기준은 과거 회차 컷과 분리

[MAA의 2027 AIME 안내](https://maa.org/maa-invitational-competitions/)와 [공식 변경 공지](https://maa.org/news/maa-announces-official-testing-centers-for-the-2027-american-invitational-mathematics-examination/)를 다시 확인했습니다. 미국·캐나다 응시자는 AMC 10 100점 이상 또는 AMC 12 85점 이상이면 AIME 등록 대상 점수 기준을 충족하며, 별도 연령·학년 등 자격도 확인해야 합니다. 2027 AIME는 2월 5–6일 Pearson 시험장에서 시행하고, 13세 미만은 응시할 수 없습니다. MAA는 2027 USAJMO/USAMO 선발에서 AMC 점수를 더 이상 요소로 쓰지 않고 AIME 점수를 주로 활용한다고 안내합니다.

이 현행 기준은 연도·시험형별 과거 AIME 컷 기록과 별도입니다. 원본 회차 결과 화면에서는 선택한 같은 연도·폼의 당시 기준을 역사 자료로 표시하고, 2026–27 안내는 해당 주기·미국/캐나다 자격 문맥에서만 보여 줍니다. 어느 표시도 GFIELD 모의고사 점수나 다른 국가의 응시자에게 공식 초대·자격을 판정하지 않습니다. 국제 응시자는 각 지역 International Group Leader의 안내를 따릅니다.
