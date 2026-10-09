# 비공개 답안 DB에 새 답을 추가하는 SQL 틀 (값 없음)

정답 값은 이 저장소 어디에도 쓰지 않는다. 아래 `<새 답 JSON>` 자리에 넣을 답 묶음은
작업자 PC의 임시 폴더(저장소 밖)에서만 만들고, 커밋하지 않는다.

- Supabase 프로젝트: `fgahqumaldheqettmvqg`
- 테이블: `golden_bell_answer_books` (`book_id` · `payload` jsonb · `payload_sha256`)
- `payload`의 키 = 공개 데이터의 `answerRef` 문자열 그대로

## 0. 지금 상태 확인 (먼저 반드시)

```sql
select payload_sha256, (select count(*) from jsonb_object_keys(payload)) keys
from golden_bell_answer_books where book_id = 'book-04';
```

## 1. 새 키가 비어 있는지 확인

```sql
select k from jsonb_object_keys((select payload from golden_bell_answer_books where book_id='book-04')) k
where k like '/books/book-04/lessons/12/%';   -- 이번에 쓸 경로로 바꿔서
```
결과가 0줄이어야 한다. 1줄이라도 나오면 멈추고 원인부터 본다.

## 2. sha 조건을 걸고 추가 → sha 다시 계산

```sql
do $do$ declare p jsonb; n jsonb := $q$<새 답 JSON>$q$::jsonb; begin
  select payload into p from golden_bell_answer_books
   where book_id = 'book-04' and payload_sha256 = '<0번에서 본 sha>';
  if p is null then raise exception 'sha mismatch'; end if;
  if exists (select 1 from jsonb_object_keys(n) k where p ? k) then raise exception 'key clash'; end if;
  update golden_bell_answer_books set payload = p || n where book_id = 'book-04';
  update golden_bell_answer_books
     set payload_sha256 = encode(sha256(convert_to(payload::text, 'UTF8')), 'hex')
   where book_id = 'book-04';
end $do$;
select payload_sha256, (select count(*) from jsonb_object_keys(payload)) keys
from golden_bell_answer_books where book_id = 'book-04';
```
키 수가 정확히 "이전 + 새 키 수"인지 확인한다.

## 기존 값을 고칠 때 (원장 승인 필수)
1. 고치기 전 값을 `select payload->'<키>'`로 떠서 작업자 PC에 백업 JSON으로 남긴다(커밋 금지).
2. 같은 sha 조건으로 `jsonb_set` 하고 sha를 다시 계산한다.
3. 원본 오류를 바로잡은 내역은 그 기록의 `sourceNote` 필드에 적는다(공개 메모 칸에 쓰지 않는다).

## 답 기록의 모양

| 공개 문항 | DB 기록 |
|---|---|
| 답 하나(`answerMode: "input"` 또는 `"choice"`) | `{ "answer": "…", "solution": "…" }` |
| 칸이 여러 개(`parts`) | 문항 키에 `{ "solution": "…" }`, 각 칸 키(`…/parts/0`…)에 `{ "answer": "…" }` |
| 개념 확인 문제(`experience.check`) | `{ "answer": "…", "explanation": "…" }` |
| 이야기(`extension`) | `{ "answer": "…", "explanation": "…" }` |
| 문항이 없는 보류 메모 | `/books/<id>/history/<경로>` 키에 `{ "sourceNote": "…" }` |

`answerRef`가 하나라도 DB에 없으면 그 권 전체 답 불러오기가 깨진다. 추가 전에
"공개 데이터의 새 answerRef 목록 = 새 답 JSON의 키 목록"을 스크립트로 맞춰 볼 것.
