alter table public.readers
  add column if not exists sync_token_hash text;

create schema if not exists private;
revoke all on schema private from public;

create or replace function private.reader_sync_save(
  p_student_id text,
  p_token text,
  p_name text,
  p_book_id text,
  p_lesson_id text,
  p_data jsonb
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_hash text;
  v_saved boolean := false;
begin
  if p_student_id is null
     or p_student_id !~ '^s_[a-z0-9]{12,80}$'
     or p_token is null
     or length(p_token) < 32
     or length(p_token) > 256
     or octet_length(coalesce(p_data, '{}'::jsonb)::text) > 2000000 then
    return false;
  end if;

  v_hash := encode(extensions.digest(p_token, 'sha256'), 'hex');

  insert into public.readers (
    student_id, name, book_id, lesson_id, data, sync_token_hash, updated_at
  )
  values (
    p_student_id,
    left(coalesce(nullif(trim(p_name), ''), 'Reader'), 20),
    left(coalesce(nullif(trim(p_book_id), ''), 'cars-level-b'), 80),
    left(coalesce(nullif(trim(p_lesson_id), ''), 'lesson1'), 80),
    coalesce(p_data, '{}'::jsonb),
    v_hash,
    now()
  )
  on conflict (student_id) do update
    set name = excluded.name,
        book_id = excluded.book_id,
        lesson_id = excluded.lesson_id,
        data = excluded.data,
        sync_token_hash = excluded.sync_token_hash,
        updated_at = now()
    where readers.sync_token_hash is null
       or readers.sync_token_hash = excluded.sync_token_hash
  returning true into v_saved;

  return coalesce(v_saved, false);
end;
$$;

create or replace function private.reader_sync_pull(
  p_student_id text,
  p_token text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public, extensions
as $$
declare
  v_hash text;
  v_result jsonb;
begin
  if p_student_id is null
     or p_student_id !~ '^s_[a-z0-9]{12,80}$'
     or p_token is null
     or length(p_token) < 32
     or length(p_token) > 256 then
    return null;
  end if;

  v_hash := encode(extensions.digest(p_token, 'sha256'), 'hex');

  select jsonb_build_object(
           'data', r.data,
           'updated_at', r.updated_at
         )
    into v_result
    from public.readers r
   where r.student_id = p_student_id
     and r.sync_token_hash = v_hash;

  return v_result;
end;
$$;

create or replace function public.reader_sync_save(
  p_student_id text,
  p_token text,
  p_name text,
  p_book_id text,
  p_lesson_id text,
  p_data jsonb
)
returns boolean
language sql
set search_path = pg_catalog, private
as $$
  select private.reader_sync_save(
    p_student_id, p_token, p_name, p_book_id, p_lesson_id, p_data
  );
$$;

create or replace function public.reader_sync_pull(
  p_student_id text,
  p_token text
)
returns jsonb
language sql
stable
set search_path = pg_catalog, private
as $$
  select private.reader_sync_pull(p_student_id, p_token);
$$;

revoke all on function private.reader_sync_save(text, text, text, text, text, jsonb) from public;
revoke all on function private.reader_sync_pull(text, text) from public;

revoke all on function public.reader_sync_save(text, text, text, text, text, jsonb) from public;
revoke all on function public.reader_sync_pull(text, text) from public;
grant execute on function public.reader_sync_save(text, text, text, text, text, jsonb) to anon, authenticated;
grant execute on function public.reader_sync_pull(text, text) to anon, authenticated;
