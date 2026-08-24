# 운영 API 계약

정적 화면만으로는 시험지와 답안을 보호할 수 없습니다. 운영에서는 아래 API가 이름+승인번호 세션, 시험별 권한, 짧은 만료시간의 페이지 이미지 URL을 제공합니다.

```text
POST   /session
GET    /selection-tracks
GET    /programs/:programCode/selection-tracks
GET    /exams/:examId/pages
GET    /exams/:examId/response-schema
POST   /exams/:examId/attempts
GET    /attempts/:attemptId/report
POST   /practice-sets/plan
POST   /practice-sets/:practiceSetId/approve
GET    /practice-sets/:practiceSetId/pages
POST   /practice-sets/:practiceSetId/attempts
GET    /admin/access-grants
POST   /admin/access-grants
PUT    /admin/access-grants/:grantId
DELETE /admin/access-grants/:grantId
GET    /admin/exam-reviews/:examId
POST   /admin/exam-reviews/:examId/items/:number/resolution
POST   /admin/exam-reviews/:examId/final-confirmation
GET    /admin/exam-reviews/:examId/items/:number/evidence
```

## 보안 조건

- 세션 쿠키는 `HttpOnly`, `Secure`, `SameSite=Lax` 이상
- 모든 시험·페이지·채점 API에서 서버가 시험별 승인을 재검사
- 페이지 URL은 학생·시험·만료시각을 묶은 서명 URL
- URL 대상은 PDF가 아니라 렌더된 페이지 이미지
- 응답에 원답, 원본 저장경로, 버킷 영구 URL을 포함하지 않음
- 관리자 승인번호는 단방향 해시로 저장
- 시험 `releaseStatus=released`이고 답안·분류 검수가 완료된 경우에만 채점 허용
- 제출 답안은 서버에서 정규화·채점하고 채점 버전을 기록
- 문항 처리 상태 응답에는 정답값·문제 원문·풀이·원본 경로·교정 산출물 지문값을 포함하지 않음
- `agent_verified|replacement_verified`는 정답 검산·교육과정 분류·시각 감사·원본 지문·보호 교정 산출물 지문이 모두 확인된 항목만 허용
- 불확실한 문항은 검증된 채점 제외 정책과 함께 `scoring_excluded`로 처리하고 정답을 추측하지 않음
- 검수 API는 `Cache-Control: no-store`를 반환하고 관리자 세션을 매 요청마다 다시 검사

## 학생별 시험 승인

`GET /admin/access-grants`는 관리자 세션에서만 학생 이름, 중립 승인 ID, 허용 시험 ID, 선택 만료일을 반환합니다. 승인번호와 승인번호 해시는 반환하지 않습니다.

`POST /admin/access-grants`는 신규 승인을 만들고, `PUT /admin/access-grants/:grantId`는 중립 승인 ID로 기존 승인을 수정합니다. 두 경로 모두 `studentName`, `approvalCode`, `examIds[]`, 선택 `expiresAt(YYYY-MM-DD)`을 받습니다. 동명이인은 서로 다른 승인 ID와 승인번호로 분리하며 이름만으로 기존 계정을 덮어쓰지 않습니다. 승인번호는 서버에서 즉시 scrypt 해시로 바꾸고, 존재하는 운영 시험만 허용하며, 한국시간 기준 만료일이 지난 학생은 로그인과 기존 세션을 모두 차단합니다. 수정으로 승인번호가 바뀌면 이전 승인번호로 발급된 세션도 즉시 무효화합니다.

`DELETE /admin/access-grants/:grantId`는 해당 학생 승인 레코드를 취소합니다. 관리자 계정은 이 경로로 변경하거나 삭제할 수 없습니다. 변경 요청은 현재 운영 출처와 정확히 같은 `Origin`, `X-Highselect-Admin: 1` 헤더를 요구하며 POST/PUT은 JSON만 받습니다. 설정 파일 잠금과 버전 검사를 통과하지 못한 동시 변경은 덮어쓰지 않고 `409`로 실패합니다. 모든 응답은 `Cache-Control: no-store`이며 비공개 설정 파일 밖에 승인 상태를 복제하지 않습니다.

## 선발 트랙 응답

`GET /selection-tracks`는 중립 `trackId`, 표시명, 대상 단계, 입학 목적만 반환합니다. `GET /programs/:programCode/selection-tracks`는 해당 프로그램의 `trackId`, 범위 코드와 `evidenceStatus`를 반환합니다. 학원·프로그램 코드를 `trackId`에 합치지 않으며, `needs-review` 연결은 확인된 시험 규격처럼 표시하거나 시험 생성의 기본값으로 사용하지 않습니다. 시험 목록은 기존 `examId`를 유지하고 서버가 `ExamTrackAssignment`를 조인합니다.

## SH-R01 문항별 검수

`GET /admin/exam-reviews/sh-selection-r01`은 `examId`, `roundCode`, `reviewVersion`과 1~40번 상태만 반환합니다. 문항 상태에는 중립 `itemId`, 번호, 답 검산 상태, 분류 검증 상태, 시각 감사 상태, 원본·교정 산출물 지문 일치 여부, 에이전트 처리 상태만 둡니다. 지문값 자체와 비공개 파일 주소는 반환하지 않습니다.

`POST /admin/exam-reviews/sh-selection-r01/items/:number/resolution`은 현재 `reviewVersion`과 중립 문항 ID를 다시 대조합니다. `agent_verify`와 `replacement_verified`는 답 검산·분류·시각·원본 지문·교정 산출물 지문 중 하나라도 미완료이면 거부합니다. `scoring_excluded`는 문제 페이지 시각 감사와 원본 지문이 통과하고 채점 제외 정책에 포함된 경우에만 허용합니다. 정적 화면과 브라우저 저장소는 처리 근거로 사용하지 않습니다.

`POST /admin/exam-reviews/sh-selection-r01/final-confirmation`은 40문항이 모두 `agent_verified|replacement_verified|scoring_excluded` 중 하나이고, 7개 교정 결정과 12개 분류검수 큐가 모두 해소되며 답안 입력 구성·채점 정책·인쇄 감사·학생별 서명 자산이 통과한 동일 `reviewVersion`에서만 허용합니다. 사용자는 문항마다 승인하지 않고 완성된 시험 1회 전체만 한 번 확인합니다. 요청에는 `itemCount`, `activeItemCount`, `excludedItemCount`만 포함하고 정답·풀이를 넣지 않습니다.

Q3 동형·동난도 대체문항은 비공개 검산 산출물로 완료되어 있습니다. 운영 서버는 비공개 교정 레지스트리의 지문과 일치할 때만 Q3을 `replacement_verified`로 반환하며 공개 응답에는 지문값을 노출하지 않습니다. Q4·Q8·Q10·Q11·Q34·Q39는 확정된 교정 종류를 실행한 보호 산출물의 지문이 일치할 때까지 처리 대기입니다.

`GET /admin/exam-reviews/sh-selection-r01/items/:number/evidence`는 관리자 세션에서만 문제 원본 구간, 원답·풀이 구간, 독립 검산 결정안의 세 이미지를 반환합니다. 세 이미지는 모두 원본 문서가 아닌 서버 렌더 이미지이며, 관리자·시험·문항·검수 버전·만료시각에 묶인 서명 URL입니다. 최대 유효시간은 10분이고 응답은 `Cache-Control: no-store`를 사용합니다. JSON에는 문제·정답·풀이 텍스트, PDF/HWP 주소, 저장 경로, 영구 URL을 넣지 않습니다.

## 페이지 이미지 응답

`GET /exams/:examId/pages`는 다음 필드를 반환합니다.

```text
examId, studentId, expiresAt
pages[] = { number, url, mimeType }
```

- `studentId`는 현재 세션 학생과 같아야 합니다.
- `expiresAt`은 현재보다 미래이고 최대 15분 이내여야 합니다.
- `pages`는 학생용 문제 페이지 수와 정확히 같아야 합니다. SH 1회는 원본 11쪽 중 문제 8쪽만 전달합니다.
- 모든 URL은 `https`, 허용 호스트, `image/png|jpeg|webp` 조건을 통과해야 합니다.
- PDF, 답·풀이 페이지, 원본 경로는 이 응답에 포함하지 않습니다.

## 답안 입력 응답

`GET /exams/:examId/response-schema`에는 `examId`, `studentId`, 문항번호와 입력 방식만 둡니다. 입력 방식은 `input`, `multi_input`, `ordered_list`, `unordered_set`, `self_check` 다섯 가지입니다. `studentId`는 현재 세션과 같아야 합니다. `answer`, `answers`, `answerSpec`, `correctAnswer`, `solution`, `explanation`은 중첩 객체까지 금지합니다. 응답은 허용 필드만 다시 만들어 사용하므로 임의 메타데이터도 학생 화면으로 전달하지 않습니다.

`multi_input`은 문항에 `fields[] = { slotId, label, groupId?, groupLabel? }`를 제공하며 `slotId`는 문항 안에서 유일해야 합니다. 제출 시 `value[]`, `slotIds[]`, `groupIds[]`를 같은 길이·같은 위치로 보내 빈 슬롯과 그룹을 보존합니다. `ordered_list`는 쉼표 또는 줄바꿈으로 분리한 배열의 순서를 유지하고, `unordered_set`은 같은 토큰 규칙을 적용한 뒤 정규 순서로 정렬해 보냅니다. 두 방식 모두 실제 정답과 비교하는 정규화는 서버에서 수행합니다.

그림·작도형 `self_check`는 단일 정답 그림 검증이 끝난 문항만 허용하며, 정답 그림 역시 학생별 단기 서명 이미지 URL이어야 합니다. 제출값은 `o|x|""`이고 서버는 이를 학생의 자기 확인 상태로 기록합니다. 이전 `ox` 표기는 응답 스키마 수신 시 `self_check`로 변환하는 호환 별칭일 뿐 신규 스키마와 제출에는 사용하지 않습니다.

`POST /exams/:examId/attempts`의 각 답안은 다음 형태입니다. 이 요청에는 정답 명세가 포함되지 않습니다.

```text
{ number, responseType, value }
{ number, responseType=multi_input, value[], slotIds[], groupIds[] }
```

분석지는 브라우저 캐시를 신뢰하지 않고 `GET /attempts/:attemptId/report`에서 서버가 다시 권한을 확인한 결과만 표시합니다.

## 반복 연습 응답

`POST /practice-sets/plan`은 승인된 문항의 중립 ID, 교육과정 코드, 원문→쌍둥이→유사문제 관계, 난이도, 숙달 상태와 재도전 예정일만 반환합니다. 문제 원문, 답, 풀이, 원본 위치는 반환하지 않습니다.

계획 결과가 완전하더라도 `releaseStatus=approval_required`이며, 관리자가 해당 `practiceSetId`를 승인하기 전에는 페이지 API가 응답하지 않습니다. `GET /practice-sets/:practiceSetId/pages`는 시험지와 같은 학생별 단기 서명 이미지 정책을 적용합니다. 풀이 결과는 정답 값이 아니라 `correct|incorrect`와 문항·계열 중립 ID만 반복 이력에 기록합니다.
