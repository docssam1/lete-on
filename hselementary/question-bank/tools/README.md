# 초등 원문 독립 검수 연결

Apple Vision은 Mac 안에서 원문 글자·표·카드의 OCR 초안을 만들고, Claude Messages API는 정답을 미리 받지 않는 독립 풀이를 맡는다. 모델 결과를 원문과 별도 계산으로 대조한 뒤 기존 화면·A4 공개 문턱을 적용한다. 이 도구는 문항 잠금이나 배포 상태를 바꾸지 않는다.

원문 OCR에는 `fields-classic/question-bank/tools/golden-bell-ocr/apple-vision-ocr.swift`를 사용한다. Mac의 Apple Vision이 로컬에서 처리하며 OCR 결과는 사람이 원문과 대조한다.

## 비공개 입력

입력 JSON, 원문 이미지, 응답과 로그는 Git 작업본 밖의 절대 경로에 둔다. 다른 worktree와 symlink를 통한 저장소 내부 경로도 거부한다. API 키는 환경 변수 `ANTHROPIC_API_KEY`로만 전달하고 명령 인자나 기록에 넣지 않는다.

입력 형식(아래는 창작 예시):

```json
{"version":1,"items":[{"id":"example","prompt":"빨간 구슬 2개와 파란 구슬 3개가 있습니다. 전체 구슬 수를 구하고 answer_values에는 단위 없는 정수 하나를 문자열로 쓰세요."}]}
```

파일과 문항의 필드는 위 형식만 허용한다. `answer`, `solution`, `expected`, 임의 메타데이터를 추가하면 실행을 거부한다. 문제 그림을 함께 줄 때만 문항에 `image`(비공개 절대 경로)와 `image_question_only:true`를 추가한다. 필기 답이 남은 원문 스캔은 독립 풀이용 이미지로 사용하지 않는다. 실제로 답이 가려졌는지는 사람이 먼저 확인해야 한다.

한 번에 최대 여섯 문항, 이미지 합계 5 MiB다. 응답은 문항 ID·판정·전체 답 목록·풀이·모호한 조건을 포함한다. 답은 숫자만 문자열로 쓰는 등 문항별 응답 순서를 문제 지시문에 명시한다.

## 실행 (Claude API)

먼저 `--dry-run`으로 외부 호출 없는 요청 미리보기를 만든다. 실제 실행과 다른 출력 폴더를 사용한다.

```bash
node hselementary/question-bank/tools/independent-review/review.mjs \
  --engine claude-code --input /private/work/questions.json \
  --output /private/work/request-preview --dry-run
```

직접 Anthropic API 연결:

```bash
node hselementary/question-bank/tools/independent-review/review.mjs \
  --engine api --input /private/work/questions.json \
  --output /private/work/api-review --model MODEL_FROM_CONSOLE \
  --input-rate CURRENT_INPUT_USD_PER_MILLION \
  --output-rate CURRENT_OUTPUT_USD_PER_MILLION --budget-usd 1
```

모델 ID와 두 단가는 Console 및 최신 공식 가격표에서 확인해 설정한다. 실행 예시는 실제 모델·단가를 대신하지 않는다. 키가 없으면 외부 요청을 보내지 않는다. API는 최대 입력 12000토큰·출력 4096토큰이며 토큰 수를 먼저 조회하고, 제공한 단가로 계산한 최대 비용이 1달러 이하일 때 한 번만 생성한다. 이 계산은 클라이언트 추정이며 계정의 실제 청구 상한을 설정하지 않는다.

완료된 같은 요청은 캐시를 사용한다. 인증·응답 오류나 시간초과는 자동 재시도하지 않는다. `attempt.json`만 남은 요청은 서버에서 이미 처리됐을 수도 있으므로 결과와 사용량을 확인한 뒤 별도 출력 폴더로 다시 시작한다. 출력 권한은 파일 0600·새 폴더 0700이다.

## 검증 및 판정

```bash
node --test hselementary/question-bank/tools/independent-review/review.test.mjs
```

검사 대상은 정답 입력 혼입, 중복·누락 문항, 비공개 경로와 symlink, 비용·토큰 문턱, 인증 실패, 잘린 응답과 자동 재시도 방지다. 테스트의 HTTP 응답은 합성 모의 응답이며 실제 Claude API 검수로 표시하지 않는다.

API 응답은 별도 결정적 계산과 대조한다. 모델 검수만으로 공식 출판사 답 검증을 완료 표시하거나 생성 잠금을 해제하지 않는다. 원문·풀이·검수 결과는 기존 비공개 Drive 위치에, 이 도구의 코드는 프로젝트 Git에 보관한다.

공식 참고: [Messages JSON 출력](https://platform.claude.com/docs/en/build-with-claude/structured-outputs), [토큰 계산](https://platform.claude.com/docs/en/api/messages/count_tokens).
