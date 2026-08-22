# SH-R01 최종 확인 준비도

상태: `ready_for_final_confirmation`

학생 공개: 잠금

검수 버전: `rv-20260822-fastlane-v2`

판매 제목: `황소 고등 선발 대비 1회`

우리 모의고사 시험시간: `120분`

시간 적용 범위: `our-sale-mock` — 실제 학원 공개 회차의 시험시간과 분리

## 완료된 게이트

| 게이트 | 결과 |
|---|---:|
| 문항 수와 순서 | 40/40 |
| 독립 답 검산 | 40/40 |
| 2022 개정 분류 | 40/40 |
| 응답 입력 계약 | 40/40 |
| 시각 감사 | 40/40 |
| 원본 지문 대조 | 40/40 |
| 교정 산출물 대조 | 40/40 |
| 문항 해소 | 교체 1, 검수 유지 39 |
| 보호 채점 정책 | 통과 |
| A4 인쇄 감사 | 8쪽 통과 |
| 학생별 서명 페이지 전달 | 8쪽 통과 |

## 공개를 계속 막는 조건

1. 사용자가 완성된 시험 1회 전체를 아직 최종 확인하지 않았다.
2. 보호 운영 설정의 `finalRoundConfirmation`은 `false`다.
3. 보호 운영 설정과 공개 카탈로그의 `releaseStatus`는 `review_pending`이다.
4. 공식 커트라인 자료가 없으므로 합격·불합격 판정은 제공하지 않는다.

최종 확인은 40개 문항별 승인이 아니라 시험 1회 전체에 대해 한 번만 받는다. 최종 확인 전에는 이름·승인번호로 시험을 허용해도 학생 뷰어가 원본 페이지를 제공하지 않는다.

## 증거 라우팅

공개 문서에는 정답, 풀이, 원본 주소, 파일 지문을 기록하지 않는다. 검수 근거는 증거 메모리의 다음 검증 레코드로 라우팅한다.

- `hwangso.high.round1.release-evidence-v2`
- `hwangso.high.round1.general-evidence-v1`
- `hwangso.high.round1.scoring-normalization-audit-v1`
- `hwangso.high.round1.print-audit-v2`
- `hwangso.high.round1.signed-assets-v2`
- `hwangso.high.round1.runtime-v1`

## 최종 확인 뒤 별도 작업

- 보호 설정에서만 `finalRoundConfirmation=true` 기록
- 공개 카탈로그와 보호 설정의 `releaseStatus=released`를 같은 검수 버전으로 전환
- 전환 직후 로그인·개별 승인·8쪽 서명 전달·40문항 채점·진단지·인쇄 회귀 테스트

공식 배점·커트라인은 근거 자료가 제공될 때만 추가한다.

공개된 실제 학원 시험시간은 지점·과정·회차별 참고 근거로만 보존한다. 우리 판매용 120분 설정이 실제 학원의 모든 시험시간을 뜻하지 않는다.
