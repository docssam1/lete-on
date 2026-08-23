# 황소 중등 교재 문항 색인 규칙

황소 중등 교재에서 발견한 문항은 특정 학원 모드에 종속되지 않는 공용 ID `qst-bnk-<digest>`를 사용한다. 황소 고등 선발, 돌파, 이든, 원수학, 깊은생각 등은 문항을 복제하지 않고 동일 ID를 각 시험 구성에서 참조한다.

## 공개 레포와 비공개 색인의 경계

- 공개 레포: ID 생성 규칙, 페이지·슬롯·문항 종류, 검수 상태, 교육과정 코드, 재사용 가능 모드만 저장한다.
- 비공개 G드라이브: 원본 소스 ID와 지문 해시의 대응, 인쇄 문항번호, 원문·정답·해설 위치, 검수 메모를 저장한다.
- 공개 색인에는 원문, 답, 풀이, 로컬 경로, 원본 다운로드 위치를 넣지 않는다.

## 안정적인 ID

최초 발견 시에는 원본 SHA-256, PDF 페이지, 페이지 내 슬롯으로 위치 키를 만든다. 동일 문항이 다른 교재에서 다시 발견되면 원문 지문 해시를 대조해 하나의 대표 ID로 병합하고, 다른 위치는 별칭 locator로 남긴다. 페이지 재편집만으로 새 문항 ID가 생기지 않도록 위치 키와 대표 ID의 병합 이력을 분리한다.

## 검수 단계

1. `page_located`: 페이지 안에 문항 후보가 있음만 확인
2. `ocr_candidate`: 스캔 인식으로 문항 블록과 좌표를 찾았으나 사람이 미확인
3. `layout_candidate`: 인쇄 번호·열·Mission 격자 구조로 경계 후보를 찾았으나 사람이 미확인
4. `visual_verified`: 원본 페이지에서 문항 경계를 직접 확인
5. 교육과정은 `pending → reviewed → approved` 순서로 확정
6. 답안은 원본 답지 대조와 가능한 독립 검산을 거쳐야 `verified`

2차 레이아웃 탐색에서 채점표·학습상황표·표지·안내문으로 보이는 페이지는 문항에서 즉시 삭제하지 않고 `excludedPageCandidates`에 넣는다. 이 후보도 원본을 직접 본 뒤에만 제외 확정한다. Mission의 (1), (2) 같은 소문항은 주문항 하나에 포함하며 별도 ID를 만들지 않는다. 기존 ID는 유지하고 새 레이아웃 후보는 해당 페이지의 기존 최대 슬롯 다음 번호로만 추가한다.

일반 번호형 페이지에서 OCR이 연속 번호 일부를 놓치면 발견된 상자만 후보로 추가하고 `coverageStatus: partial`과 `partial-layout-coverage` 미해결 기록을 함께 남긴다. 누락 번호의 위치를 추측해 상자를 만들지 않는다.

`audit-private-question-index.cjs`는 v2 생성 후 ID·페이지/슬롯·좌표 스키마·잠금 상태·금지 필드와 v1 항목의 바이트 수준 동일성을 검사한다. 원문/답/풀이/OCR 전문/로컬 경로가 색인에 들어가면 감사에 실패한다.

`layout_candidate`가 추가된 문항 색인 계약은 `schemaVersion: 2`이며, v1을 병합한 산출물에는 `predecessorSchemaVersion: 1`을 함께 기록한다.

자동 제외 후보나 완전 미해결 페이지를 원본 렌더에서 직접 확인한 뒤에는 `apply-private-layout-review.cjs`로만 판정을 반영한다. `--record-decisions`로 비공개 결정 매니페스트를 만들거나, 재실행할 때 `--decision-file`로 불러온다. 매니페스트는 source-memory ID와 SHA-256을 함께 기록해 현재 원본과 묶는다. 정확히 6칸인 Mission 페이지였으면 주문항 1~6의 잠금 문항을 만들고 `visual_verified`로 기록하며, 실제 채점표·기록표였으면 문항을 만들지 않고 페이지 제외 검수 상태만 `visual_verified`로 올린다. 3·4·5칸 또는 혼합 레이아웃은 이 자동 적용 대상이 아니다. 어느 경우에도 교육과정이나 답안 상태는 변경하지 않는다.

부분 인식 페이지가 실제 6칸 Mission으로 확인됐지만 기존 숫자 앵커가 그래프·수식 숫자를 잘못 잡은 경우에는 `mission6_replace_candidates`만 사용한다. 기존 ID와 항목은 삭제하거나 재사용하지 않고 `rejectedCandidates`에 시각 기각 근거를 남긴다. 실제 Mission 6개는 해당 페이지 최대 슬롯 다음 번호로 추가하며, 활성 후보 수는 전체 이력 항목 수에서 기각 후보 수를 뺀 값으로 별도 집계한다.

3·4·5칸 Mission은 고정 템플릿으로 추정하지 않는다. 원본에서 주문항 경계를 직접 확인해 SHA 결합 결정 매니페스트에 순서·표시번호·정규화 박스를 모두 기록한 `mission_variable` 판정만 허용한다. 박스가 겹치거나 표시번호와 읽기 순서가 1부터 연속하지 않으면 적용기는 거부한다.

Mission이 아닌 특수 편집 페이지는 `manual_items` 결정으로만 복구한다. 주문항마다 원본에 표시된 짧은 라벨, 구조 종류(`concept`, `example`, `exercise`, `unknown`), 페이지 읽기 순서와 정확 박스를 기록하며 최대 12개까지만 허용한다. 이어지는 소문항 조각은 새 문항 ID를 만들지 않고 같은 원본의 앞쪽 시작 문항에 직접 연결된 `continuationFragments`로 남긴다. 시작 문항이 아직 색인되지 않은 페이지는 부분 확정하지 않고 미해결 큐에 유지한다.

기존 레이아웃 후보가 섞였지만 원본 시각 검수로 페이지의 모든 주문항 경계를 완전히 다시 확정한 경우에만 fingerprint 결합 결정 매니페스트의 `manual_items_replace_candidates`를 사용한다. 이 판정은 페이지에 하나 이상의 기존 항목이 있고 그 전부가 `layout_candidate`·`locked`·`pending`·`missing` 보호 상태이며 아직 기각되지 않았을 때만 허용된다. 자동 탐지가 실제 누락이 있는 페이지를 `candidate_full`로 잘못 판정하여 미해결 큐에는 없고 보호된 레이아웃 큐에만 남긴 경우에도, 완전한 수동 대체 결정에 한해서만 이 큐를 검수 입력으로 사용할 수 있다. 다른 결정 유형은 이 우회 경로를 사용할 수 없다. 기존 항목과 ID는 수정·삭제하지 않고 `rejectedCandidates`에 `visual-confirmed-manual-replacement` 근거로 격리하며, 새 수동 검수 항목은 기존 최대 슬롯 다음부터 결정적인 ID로 추가한다. 검수 레코드는 기각 ID와 신규 활성 ID를 각각 정확히 등록하고, 감사기는 두 집합·페이지 큐 분리·박스 비중첩·선행 색인 항목 동일성을 함께 확인한다.

`candidate_full`로 잘못 잡힌 페이지가 학습상황표·복습기록표·채점기록표처럼 실제 문항 페이지가 아닌 경우에는 `exclude_replace_candidates`만 사용한다. 이 판정도 fingerprint 결합 매니페스트에서만 적용하며, 보호 상태의 기존 후보 전부를 삭제하지 않고 `visual-confirmed-non-question-replacement` 근거로 격리한다. 해당 페이지는 `visual-confirmed-non-question` 제외 페이지로 확정하고, 감사기는 선행 색인의 `candidate_full` 큐·후보 전체 목록·상태·바이트 동일성을 다시 검사한다.

미해결 페이지 검수는 `render-private-layout-review.py --queue unresolved`로 별도 큐를 만든다. 반영 뒤 좌표 재검수는 `--queue reviewed --reason verified_mission_variable_cell`을 사용한다. `--reason layout-anchor-not-found` 또는 `--reason partial-layout-coverage`, `--source-id`, `--page source-memory-id:쪽`, `--offset`, `--limit`으로 범위를 제한한다. 미해결 큐는 `--limit`을 생략해도 최대 40쪽만 렌더하며, 현재 활성 색인 문항 상자만 원본 위에 표시하고 격리된 `rejectedCandidates` 상자는 다시 겹쳐 그리지 않는다. 생성된 접촉시트와 `review-manifest.json`은 비공개 검수 산출물이므로 `tmp/` 등 Git 비추적 위치에만 둔다.

미해결 큐가 비었다고 모든 활성 후보의 사람 검수가 끝난 것은 아니다. `layoutPages`에 남은 `candidate_full`·`partial` 페이지는 `--queue layout --reason candidate_full`처럼 별도 렌더해 자동 경계를 원문과 대조한다. `layout` 큐도 `--limit`을 생략하면 한 번에 최대 40쪽만 렌더한다. 검수 완료 수는 `unresolvedPages`가 아니라 활성 항목의 `discoveryStatus: visual_verified` 개수로 따로 집계하며, `ocr_candidate`와 `layout_candidate`는 계속 잠근다.

OCR 결과는 발견 보조 자료일 뿐 정답·유형·문항 경계의 최종 근거로 사용하지 않는다. 모든 신규 문항은 `releaseStatus: locked`로 시작하고 사용자 회차 검수 전에는 공개 시험에 배정하지 않는다.
