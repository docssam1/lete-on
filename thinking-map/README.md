# 사고력 유형지도·통합 사고력 문제은행

기존 교재 분석과 기프티드 매쓰를 재사용하는 로컬 문제은행의 실행 코드다. G·MAP 보딩스쿨과 별개다. 이미지·텍스트 입력, 교재/단원/문제번호 검색, 사고력·교과 연결 지도, 유사문항 생성과 저장, 학생/교사용 인쇄를 포함한다.

현재 보존 버전은 2026-11-25 체크포인트69이다. 450개 공통 유형 후보, 검산 대표423개, 실제 입력 생성62유형은 다른 집계다. 모든 유형의 난도·모든 seed·원문 동등성·교사 승인을 완료했다는 뜻이 아니다. 필즈 더클래식1·2과정의 완료 은행과 기존 소마 분석을 다시 연구하지 않는다.

## 코드와 비공개 자료

- `runtime/`: 실행에 필요한 코드와 렌더러. `code-manifest.json`이 파일 해시를 고정한다.
- 기존 필즈 생성기/렌더러·메인 캐릭터 자산은 이 저장소의 고정 커밋에서 복원한다. 원문 답안 장부를 복제하지 않는다.
- `private-data-manifest.json`: 외부 데이터11개의 파일명·해시만 기록한다. 실제 분석 JSON/HTML·학생/교사용 원본·OCR·저장DB는 공개 Git에 넣지 않는다.
- 이 경로에는 배포용 `index.html`이나 자료를 제공하는 공개 서버가 없다. 실행은 사설 작업 공간에서 `127.0.0.1`로만 한다.

## 복원과 실행

Python 3.10 이상과 Node가 필요하다. Apple Vision OCR은 macOS와 Swift가 필요하다. 검증은 Mac의 기존 Python/Node 런타임에서 수행했으며 다른 호스트나 버전의 검증을 뜻하지 않는다.

1. Git밖의 비공개 작업 공간을 정한다. 기존 content-map 작업 공간도 사용할 수 있다.
2. 기존 소유자 Drive 연구 폴더에서 중요 산출물·구현ZIP을 **같은 파일ID**로 가져온다. 외부 `outputs/`와 `work/quantity-relations/` 구조에 복원하고 `private-data-manifest.json`과 해시를 맞춘다. 필요한 파일만 옮기며 ZIP 전체/교사 자료를 이 Git작업본에 풀지 않는다.
3. 아래 명령으로 코드를 설치한다. 다른 내용의 기존 파일이 있으면 덮어쓰지 않고 멈춘다. 새 작업 공간을 골라 기존 작업을 보존한다.

```sh
python3 thinking-map/restore.py --workspace /absolute/private/content-map --install-code
python3 thinking-map/start.py --workspace /absolute/private/content-map --check
python3 thinking-map/start.py --workspace /absolute/private/content-map --port 18768
```

Node를 자동으로 찾지 못하면 `--node /absolute/path/to/node`를 지정한다. 현재 코드에 기록된 Mac 기본 Node경로도 사용할 수 있다. 이는 런타임 경로 선택이며 생성기 코드/검산 해시를 바꾸지 않는다. 다른 호스트의 숫자 연산·렌더링까지 자동 승인하지 않는다.

기존 AppleVision 실행파일은 `--vision-binary /absolute/path/to/vision-text-candidates`로 재사용한다. 실행파일이 없으면 macOS에서 보존된 Swift 코드로 로컬 빌드한다. `--no-ocr`는 문자 입력 작업용이며 이미지 인식 가용성은false로 표시한다. 유료 API를 호출하지 않는다.

다른 작업이 18766·18767을 사용하므로 기본 포트는 18768이다. 해당 포트가 이미 실행 중이면 새 서버가 실패하며 기존 프로세스를 종료하지 않는다. 임시 검증에는 다른 포트를 쓴다.

## Drive 보존 위치

기존 연구 폴더: https://drive.google.com/drive/folders/17cYBGD24L8eue-EHZsPoVKlgVPrCGLCj

- `quantity-crossbook-bank.html`: `1heLCR3uVV0d2-vaORe35uNhw8E7tpBoa`
- `quantity-crossbook-bank.json`: `1GhsHH0gr-7ptbrrPd_hmTtAoD_QxVkhY`
- `quantity-input-search-implementation.zip`: `1Xi148YYGPVskPkrqtWWcBhxwCojI-gQK`
- 승인된 학생원본 미리보기/근거 별도ZIP: `1_qlLgYlNALDIq5Mh_-4ryEzBpIw4ZMUU`

소유자 접근이 필요하며 위 위치가 공유 권한을 부여하지 않는다. 원본 미리보기는 비공개 등록 경로와 실제 SHA가 맞는 PNG만 읽는다. 다른 호스트에서는 복원한 자산의 실제 경로를 기존 비공개 매니페스트와 맞춘다. 원문을 다시 OCR하거나 답을 다시 추측하는 절차가 아니다.

사용자 문항 DB는 비공개 작업 공간의 `work/quantity-relations/saved-bank/generated-items.private.sqlite3`다. 자동 Drive 동기화는 없다. 화면에서 선택/전체 저장파일 또는 이전 기록 포함 보관파일을 내보내 이관한다. `item_archive`의 이전 기록도 보존하며 빌드·복원·정리 대상에서 제외한다.

## 검증과 다음 작업

```sh
python3 thinking-map/test_restore.py
python3 thinking-map/test_restore.py --private-workspace /absolute/private/content-map --node /absolute/path/to/node
```

첫 검사는 기존 파일 충돌·반복 설치·Git 밖의 작업 공간·사용자 DB 보존을 확인한다. 두 번째는 외부 비공개 자료를 읽는 별도 임시 서버/DB에서 실제 스키마·생성/저장·문제지 선택·원본 미리보기를 확인한다. 운영 중인 18768을 종료하지 않는다. 판본·최소 능력·난도 검수와 별개의 복원 검사다.

유형 탐색 화면은 `?view=types`로 연다. 포함과 배제의 네 유형 표시(기존5개 유형 ID)에 대영역→중영역→소영역→유형의 분류안을 연결했다. 기존450개 후보는 모두 검색하며, 미검토 분류 경로를 임의로 채우지 않는다. 분류안과 학습 연결을 구분하고, 실제 문항·조건별 생성·저장·문제지·교재 위치·필요 능력·교과 연결을 같은 흐름에서 확인한다.

`test_user_flow.cjs`는 별도 임시 서버/DB에서 유형 선택·실제 생성·저장·학생/교사 인쇄·모바일·교재 미리보기를 검증한다. 생성기와 기존 문항의 수학 검증은 재사용한다.

## 체크포인트 67 — 1031 초급 B 본문 문항 시작

Drive 원본 `1031 초급 B.pdf`(ID `1QrW_zdEvmXK7fqRmwdWE7Cozs9eWKy_B`, SHA-256 `f345e243…df21`)에서 1단원 두 문항을 학생 본문과 교사용 답안 페이지에 대조해 문항은행에 연결했다. 14쪽 적용하기 1-1 펜토미노(정답 12가지), 18쪽 연습 6 표시 칸 테트로미노(정답 12개)다. 기존 `partition_core.shapes` 검산기를 재사용하고 표시 칸 문제에는 D4 회전·반사 궤도수를 적용했다. 네 유사문항의 답은 각각 5·35·4·46가지다. 학생 본문 PNG 14·18쪽은 해시 등록 후 로컬 원본 미리보기 API에서 확인했다. 답안 모양은 정답·풀이 영역에만 둔다.

현재 1031 초급 B는 1단원 2문항만 구조화됐으며 나머지 교재·단원은 미완료다. 원문 난도는 교사 확정 전 연구후보 4이며, 초급 B나 유형 전체 난도 승인으로 확대하지 않는다. 페이지 전체 목록과 연결은 비공개 작업공간의 `outputs/quantity-crossbook-bank.json`, 분리 문항팩은 `outputs/1031-basic-b-shape-composition-items.json`에 보존했다. 신규 OCR·유료 API는 사용하지 않았다. 제안 시 Luna 높은 설정을 반복적인 자료 연결 업무에 권했지만 실제 실행 모델 ID는 확인하지 않았다.

다음은 같은 B 1단원의 원·확인·연습·심화 문항을 답안과 대조하고, 완료한 것과 미검토 항목을 분리한 뒤 1031 초급 B의 나머지 단원으로 이어가는 것이다. 2700/600/12712 기존 검증과 완료 교재 원문 분석은 다시 수행하지 않는다.

## 현재 교재 범위 — 2026-11-25

1031·소마·3% 올림피아드·필즈 더 클래식·필즈만 분석을 이어간다. 필즈와 필즈 더 클래식은 서로 다른 교재다. 기프티드 매쓰는 필즈 더 클래식 문제은행이다. 소마는 사고력 학원 교재군이며 레이·프리즘·프리미어 초급·중급·고급으로 선택한다. 레이의 Ray Kids/플러스북과 원래 책·권 ID를 보존한다. 팩토·GM 등 기존 장부는 삭제하지 않고 현재 메뉴와 신규 분석 대상에서 제외한다. 범위는 runtime/work/quantity-relations/textbook-scope.json에 기록했다. 기존 원문·검산·난도는 다시 연구하거나 바꾸지 않는다.


## 체크포인트 68 — 초급 B 1단원 복합 조각 문항

학생 본문 16쪽 연습 1번은 정삼각형 세 조각으로 된 사다리꼴 두 개를 같은 길이의 변 전체끼리 붙이는 문항이다. 교사용 답안 PDF 113쪽에 제시된 다섯 모양과 대조했다. 정확 격자 열거는 2조각에서 5가지로 답안과 일치했다. 같은 사다리꼴 3개·4개로 바꾼 새 문항은 동일 접촉 규칙 아래 각각 15·82가지로 생성했다. 두 변형 답은 교사 답안에 없는 연구용 계산 후보다. 원문/유사문항 구조 데이터, 해설 모양, 원본 지면 경로와 최소 필요 능력을 문제은행에 연결했다. 원문 이미지 전체는 학생용 원본 미리보기로 별도 유지한다.

기존 PT08 유형 아래 세부유형을 추가했으며 전체 유형 수를 늘리지 않았다. 초급 B 1단원은 현재 원문 3문항·유사문항 6문항만 확인됐고, 단원·교재는 미완료다. 난도 후보 4는 교사 승인 전이며 학년으로 바꾸지 않는다. 신규 OCR·유료 API 호출은 없었다. 이 체크포인트의 브라우저/자동 테스트는 실행하지 않았다.


## 체크포인트 69 — 초급 B p.16 색칠된 삼각형 문항

학생 본문 PDF 16쪽 연습 2번과 교사용 답안·해설 PDF 114쪽을 대조했다. 같은 직각이등변삼각형 3개 중 2개가 색칠되어 있으며, 회전·뒤집기 동치 판정에서 색칠된 부분의 위치를 보존한다. 공식 답안은 12가지다. 이를 `1031-basic-b:f345e2437c0f550e:pdf16:practice2`로 구조화해 교재/단원/문제번호 검색, 원문 학생 페이지 미리보기, 문제은행 화면에 연결했다. 원본 지면의 세 조각 그림은 문제의 필수 입력으로 별도 구조 SVG로 표시한다.

답안지의 12개 도형은 아직 벡터 형식으로 개별 디지털화하지 않았고 이 조건을 보존하는 유사문항 생성기도 검증되지 않았다. 따라서 답 개수는 공식 답안 대조로 확인했으나 독립 전수 열거·유사문항·해답 그림은 미완료로 기록했다. 난도 4는 연구 후보이며 교사 확정 전이다. 새 OCR·API를 사용하지 않았다. 데이터/화면은 private workspace의 `outputs/quantity-crossbook-bank.json` 및 `.html`, 문항팩 `outputs/1031-basic-b-shape-composition-items.json`에 있다. 세 유형 수는 그대로 450개이며 초급 B 1단원 일부 원문 4개·유사문항 6개만 확인되었다. 단원과 교재는 미완료다.

실행 환경은 Mac Codex이며 실제 모델 ID는 도구에서 확인되지 않았다. Luna High 권고를 실행 사실로 기록하지 않는다. 기존 실행 주소는 `http://127.0.0.1:18768/thinking-map/`이고 로컬 응답 HTTP 200을 확인했다. 기존 Drive 파일 ID를 유지해 은행 HTML `1heLCR3uVV0d2-vaORe35uNhw8E7tpBoa`, JSON `1GhsHH0gr-7ptbrrPd_hmTtAoD_QxVkhY`, 구현 ZIP `1Xi148YYGPVskPkrqtWWcBhxwCojI-gQK`를 갱신하고 각 파일을 다시 읽어 로컬 SHA-256과 크기가 일치함을 확인했다. ZIP에 반영할 체크포인트 문서·매니페스트를 동기화한 뒤 ZIP은 최종 재갱신한다. 운영 배포는 하지 않았다. 다음은 답안 그림 12개를 구조화하거나 조건에 맞는 정확 생성 규칙을 검증한 뒤에만 유사문항을 만든다.
