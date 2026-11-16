-- 선발시험(입학 모의고사) 정답도 같은 비공개 표에 둔다(원장 2026-11-16 「답안이 없어」).
-- book_id = selection-<시험 id> (예: selection-k6-2023-02, selection-g1-2022-03). 정답 값은 git에 쓰지 않는다.
alter table public.fields_unit_test_answer_keys drop constraint if exists fields_unit_test_answer_keys_book_id_check;
alter table public.fields_unit_test_answer_keys add constraint fields_unit_test_answer_keys_book_id_check
  check (book_id ~ '^(book-[0-9]{2}|course-0[23]-[ag][1-5]|selection-(k[67]|g1)-[0-9]{4}-[0-9]{2})$');
