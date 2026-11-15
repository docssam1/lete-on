-- 2과정 권별 테스트 정답도 같은 비공개 표에 둔다(원장 2026-11-14 「좋아」). book_id: book-NN(1과정) 또는 course-0N-[ag]N.
alter table public.fields_unit_test_answer_keys drop constraint if exists fields_unit_test_answer_keys_book_id_check;
alter table public.fields_unit_test_answer_keys add constraint fields_unit_test_answer_keys_book_id_check check (book_id ~ '^(book-[0-9]{2}|course-0[23]-[ag][1-5])$');
grant select, insert, update, delete on table public.fields_unit_test_answer_keys to service_role;
