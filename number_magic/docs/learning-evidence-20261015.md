# 실제 학습 기록 → 목표 계획 연결

작업 키 `lete-on/number_magic/learning-evidence-20261015`. 기준 main `ed6bcf86`.
학습자 단계(`learner_stage`): 유아~고등의 기존 연산 과정, 계획·기록 화면은 보호자용.

## 계약

- 기존 74과정·557회차·문항·배점·진도·코인·양 배수는 유지한다. 기존 3D 계획 비교에 연결하며 두 번째 커리큘럼은 만들지 않는다.
- 프로필 state 안에 새 기록만 덧붙인다. 기존 공용 유형 통계는 형제별 소유자를 알 수 없어 소급 복사하지 않는다. 기존 점수·날짜를 삭제/재해석하지 않는다.
- 온라인 첫 채점의 정답/전체/실제 입력 수와 활동 시간을 자동 기록한다. 반복 채점은 새 실적이 아니다. 정답 공개 후 채점은 증량 판단에서 제외한다. 출력·진단·비채점 교구는 완료 실적이 아니다.
- 온라인 회차 화면은 교과 드릴 일부이므로 전체 회차 완료로 승격하지 않는다. 보호자가 창의·문장제 등 편성 전체 학습을 확인하고 실제 총 시간을 기록한 회차만 예측 속도 분자로 쓴다. 같은 회차 재학습은 보강이며 새 진도 회차로 중복 계산하지 않는다.
- 자동 시간은 화면이 연결되고 보이는 상태에서 마지막 조작 후 최대 60초까지만 누적한다. 탭 숨김·다른 화면·중단은 제외한다. 종이 시간과 온라인 부분 시간을 더하지 않는다.
- 최근 28일 중 동일 단계의 전체 회차 기록을 관찰한다. 최소 14일 범위·서로 다른 4일은 운영상 최소 조건이지 숙달 기준이 아니다. 최근 학습이 7일 넘게 없거나 정확도 근거가 없으면 증량은 보류한다.
- 증가 검토는 정확도 85% 이상, 충분한 문항, 최근 반복 저조/하락 없음에 한한다. 수치는 보수적인 운영 가드일 뿐 검증된 학습 효능 기준이 아니다. 목표가 급하다는 이유로 관문을 우회하지 않는다.
- 먼저 유지하고, 관찰 뒤 2주에 걸쳐 +5분 또는 주 +1회를 **비교 제안**한다. 실제 분량/횟수/속도는 자동 변경하지 않는다. 목표 과정·날짜는 보호자가 저장하고 바꿀 수 있다. 외부 입학 목표의 미확인 대응은 만들지 않는다.

## 검사 관문

| 관문 | 통과 조건 | 근거 |
|---|---|---|
| 기록 | 중복 채점·노출·미입력·같은 회차·프로필 교체·미래/오래된 기록 구분 | 순수/브라우저 검사 |
| 시간 | 숨김·비활동·화면 분리 제외, 부분 시간/전체 시간 중복 없음 | 가짜 시계 + 실제 UI |
| 추천 | 최소 관찰 전 유지, 결손·하락·미확인 시 증량 잠금 | 부정/경계 사례 |
| 연계 | 기록 자동 요약·기존 목표/3D 입력 연결·진도 불변 | PC/390px |
| learner-fit | language: 보호자 문구 / representations: 실제 과정·회차 / prerequisites: 기록과 가정 구분 / reasoning-load: 요약 우선 / response-mode: 확인·선택 | 화면 검수 |
| 회귀 | 진단·계획·과정·단계·연결 통과, 원본/타 프로젝트 불변 | 실행 결과 |

개인 학생 기록은 Git/검수 파일에 넣지 않는다. 검수는 가상 프로필과 원격 쓰기 차단으로 진행한다. main/배포는 별도 상태로 보고한다.

## 구현 범위와 한계

- `app/study-records.js`: 프로필 소유 기록, 중복 방지, 활동 시계, 관찰 요약. `app/main.js`의 기존 프로필 저장/슬롯을 그대로 사용한다. 저장 실패는 성공으로 표시하지 않으며 메모리에서도 롤백한다. 알 수 없는 새 버전 기록은 보존하고 해석을 보류한다.
- `app/exam.js`: 온라인 학습지(회차 탭·그리드·순차 풀이)의 첫 채점 연결. 재채점은 채점 화면을 갱신하지만 같은 기록을 추가하지 않는다. 정답 노출 여부와 미입력 개수를 남긴다. 원문·답·개별 응답은 로그에 복사하지 않는다.
- `app/study-record-panel.js`: 기존 보호자용 계획에 자동 관찰 요약, 전체 회차 확인, 목표 저장을 연결한다. 완료 저장 직후 다음 미완료 회차를 계획 출발점으로 반영하지만 기존 아이의 도장·진도는 변경하지 않는다.
- 전체 회차 집계와 온라인 부분 집계는 중복 합산하지 않는다. 전체 집계를 표시하되 온라인 저조·미완료·포함 범위 충돌을 별도 잠금 근거로 유지한다. 낮은 근거를 높은 집계로 가리지 않는다.
- `data/study-projection.js`: 자동 기록 모드의 유지 경로는 최근 확인된 실제 학습일/관찰 범위의 주 평균(소수 허용)을 사용한다. 기존 주당 설정과 다르면 함께 구분한다. 시간 추가는 진도 배수가 아니다.
- 새 레벨·과정·채점 기준 변경 없음. 종이 학습은 자동 추정하지 않는다. 보호자 확인은 교사 인증이 아니다. 개별 유닛의 프랙티스/아레나와 몸풀기의 옛 통계까지 전부 자동 수집·분리했다고 주장하지 않는다.
- 기기 로컬 저장은 검사했다. 기존 연결 계정의 state 백업 경로에 포함되는 구조이며 새 서버/DB는 만들지 않았다. 실제 학생 계정의 Mac↔Windows 동기화·동시 수정 병합을 검증하지 않았다. 기존 전체 state 덮어쓰기 동기화가 이벤트 병합을 보장하는 것은 아니다.
- 기록 수정·교사 인증·실측 시간의 학습 효과 검증은 후속 범위. 별도 작업판·대형 모델·새 유료 API·원본 변경 없음.

## 실행 근거

사용 스킬: evidence-gated-learning-pipeline(계약·독립 검토·반례), learning-ui-editorial(보호자용 요약·모바일), test-playable-web-games(실제 조작·기록 보존). 새 원본 조사나 기존 커리큘럼 재편은 하지 않았다.

`number_magic/`에서 아래 검사 실행:

```sh
node scripts/check-study-records.js
node scripts/check-study-projection.js
node scripts/check-study-records-browser.js
node scripts/check-study-records-browser.js --webgl
node scripts/check-diagnosis-observe-browser.js
node scripts/check-placement-plan.js
node scripts/check-placement-paths.js
node scripts/check-placement-auto.js
node scripts/check-placement-intake.js
node scripts/check-placement-integration.js
node scripts/check-placement-sheet.js --quick
node scripts/check-ladder.js
node scripts/check-stages.js
node scripts/check-about-stats.js
node scripts/check-roadmap-sync.js --self-test
node scripts/check-session-roles.js
node scripts/check-tone.js
node scripts/check-tex-hygiene.js
node scripts/check-answerable.js NS1 AD1 MD3 DC4 FR4
node scripts/check-print-lang.js NS1 AD1 MD3 DC4 FR4
node scripts/check-weekly-sheets.js C0 C1 C29 C38 C73
```

- 관찰 순수 부정·경계: 중복, 프로필 소유자 변경, 형식/범위, 과거 회차 재학습, 단계 변경, 미입력 저조, 종이/온라인 양방향 상충, 저장 실패·재시도, 60초 비활동/숨김, 최근 무학습일 분모, 기존 분량 불변.
- 실제 진단20→로드맵을 거쳐 한국어·영어·중국어 × 390/1280px 6조건, 원격 쓰기 차단. 실제 C1 온라인 채점→기록 자동 저장·재채점 중복 방지·새 세트·재접속·목표 저장·전체 완료 직후 계획 출발점 갱신·저장 공간 오류 롤백. 화면 확인은 가상 프로필이다.
- 실제 관찰 빈도를 넣은 WebGL 1조건(1280px) 및 기존 진단/종이/WebGL 회귀8조건. 모바일/PC 캡처를 눈으로 확인. 모두 기록/진도/코인/기존 분량·횟수 불변 검사 포함.
- 대표 A4 진단8범위. 화면 풀이17유형·레벨, 인쇄언어17유형·레벨×3언어, 주간 학습지5과정×2장=10장. **전수 인쇄/실물 인쇄나 전체 검사기 통과를 주장하지 않는다.**
- 기존 단계 차이36건은 보고 항목 그대로. 기존 74과정·557회차·1,319레벨 유지.
- 첫 브라우저 시도는 관찰 전 빈 입력의 기본 HTML 검증과 잘못된13일 fixture로 실패했다. 제출 안내를 정리하고 fixture를 수정했다. 후속 실제 화면 캡처에서 단독 패널의 색 변수 누락을 찾아 독립 스코프로 보완했다. 이전 실패 자료는 삭제하지 않았다.
- 독립 읽기 전용 검수에서 미입력 저조 제외, 집계가 부분점수 저조를 숨김, 저장 실패, 빈도/즉시 출발 갱신 문제를 찾아 수정·반례 추가·재검했다. 이는 교과·학습효과 승인이나 배포 승인이 아니다.

증거: 작업 기기의 `E:\Codex\work\numbers-learning-evidence-20261015\` 하위 `verified-final`, `verified-3d`, `diagnosis-regression`. `NM_RECORD_ARTIFACTS`/`NM_DIAG_ARTIFACTS`는 전용 절대 경로(Windows는 E:)를 지정한다. 기존 `NM_PLAYWRIGHT`, `NM_CHROMIUM` 환경을 재사용한다. Mac 실행·학생 계정 동기화는 미실행이다.

현재 상태: 기능 브랜치의 로컬 구현·검증. main 미반영·미배포. 공개 사이트에 적용됐다고 안내하지 않는다.
