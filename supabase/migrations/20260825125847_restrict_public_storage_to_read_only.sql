drop policy if exists "audio anon all" on storage.objects;
drop policy if exists "library-images anon all" on storage.objects;
drop policy if exists "library-pdfs anon all" on storage.objects;

create policy "audio anon read"
on storage.objects
for select
to anon
using (bucket_id = 'audio');

create policy "library-images anon read"
on storage.objects
for select
to anon
using (bucket_id = 'library-images');

create policy "library-pdfs anon read"
on storage.objects
for select
to anon
using (bucket_id = 'library-pdfs');
