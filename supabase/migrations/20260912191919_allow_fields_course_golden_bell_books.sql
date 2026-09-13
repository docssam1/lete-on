alter table public.golden_bell_answer_books
  drop constraint if exists golden_bell_answer_books_book_id_check;

alter table public.golden_bell_answer_books
  add constraint golden_bell_answer_books_book_id_check
  check (book_id ~ '^(book-[0-9]{2}|course-(02|03)-[ag][1-9][0-9]*)$');
