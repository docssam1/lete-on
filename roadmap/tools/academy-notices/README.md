# 학원 공지·일정 게시판 유지보수

회원용 화면: `roadmap/demo2/planner.html?academy=notices`.

## 수집과 게시

기존 `.github/workflows/refresh-academy-notices.yml`을 사용한다. 매일 08:00 UTC(한국시간17:00)에 공식 공개 공지 목록을 확인하고, 공유 수학학원 피드와 로드맵 자체 피드를 함께 갱신한다. 이후 기존 Pages 배포 작업을 실행한다. AI API·유료 서비스·학생 정보는 사용하지 않는다.

- `sources.json`: 학원 목록과 검증한 공식 공개 수집처. 학원24개가 모두 자동 수집된다는 뜻은 아니다. 등록한 수집처도 응답 실패·목록 변경 시 확인 지연으로 표시한다.
- `curated.json`: 원문과 대조한 행사·접수 일정. 게시일이나 제목의 모집연도로 행사일을 추정하지 않는다. 지점과 실제 대상 학년/과정도 구분한다.
- `refresh.py`: 최대2MB/12초 제한, 허용한 HTTPS 출처만 수집. 게시글 제목·링크·게시일과 필요한 일정만 저장하고 본문·수상자 명단은 복제하지 않는다.
- 생성 파일: `roadmap/demo2/data/academy-notices.json`. 공유 원본은 `highschool-selection/data/academy-notices.js`이며 기존 수집기는 수정하지 않는다.

수집처 장애 시 마지막 글·마지막 성공일을 유지한다. 새 확인일로 실패를 숨기지 않는다. 날짜를 검토한 원문이 바뀌면 기존 날짜는 보존하되 재확인 표시를 한다. PDF는 SHA256, 공유 공지는 기존 수집기의 revision을 비교한다. 지난 일정은 별도 필터로 남긴다. 확인할 수 없는 새 일정은 ‘원문 일정 확인’으로 표시한다.

## 실행·검증

```sh
python3 -m unittest discover -s roadmap/tools/academy-notices -p 'test_*.py'
python3 roadmap/tools/academy-notices/refresh.py
```

공유 피드가 없는 sparse 작업본에서는 기존 공유 피드를 별도 경로로 읽고 `--shared /absolute/path/academy-notices.js`를 지정한다. 전체 저장소로 실행되는 GitHub Actions에서는 기본 경로를 사용한다. 실패한 학원 때문에 TLS 검증을 끄거나 비공개 페이지·로그인을 우회하지 않는다. 날짜 변경은 원문을 확인한 뒤 curated 항목과 revision을 함께 갱신한다.
