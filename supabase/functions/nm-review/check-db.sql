-- Transactional fixtures only. Never use a real review code in this file.
begin;
do $test$
declare r jsonb; tok text; n int;
begin
insert into nm_private.review_accounts(username,code_hash) values ('review-fixture',extensions.crypt('fixture-only',extensions.gen_salt('bf',4)));
r:=public.nm_review_rpc('login','{"username":"review-fixture","code":"wrong"}'::jsonb,repeat('a',64));
assert r->>'error'='invalid_credentials','Wrong code accepted';
r:=public.nm_review_rpc('login','{"username":"review-fixture","code":"fixture-only"}'::jsonb,repeat('a',64));
assert r->>'scope'='learning_review','Wrong scope';tok:=r->>'token';
assert length(tok)=64,'Missing session';
r:=public.nm_review_rpc('status',jsonb_build_object('token',tok));
assert r->>'username'='review-fixture','Status failed';
assert nm_private.admin_hash(tok) is null,'Review token became admin';
r:=public.nm_membership_rpc('admin_list',jsonb_build_object('adminToken',tok),null,null);
assert r->>'error'='unauthorized','Review token accessed student administration';
assert not has_table_privilege('anon','nm_private.review_accounts','SELECT'),'Public credential read';
assert not has_function_privilege('authenticated','public.nm_review_rpc(text,jsonb,text)','EXECUTE'),'Public RPC access';
update nm_private.review_accounts set active=false where username='review-fixture';
r:=public.nm_review_rpc('status',jsonb_build_object('token',tok));
assert r->>'error'='unauthorized','Inactive account remained active';
update nm_private.review_accounts set active=true where username='review-fixture';
r:=public.nm_review_rpc('logout',jsonb_build_object('token',tok));
r:=public.nm_review_rpc('status',jsonb_build_object('token',tok));
assert r->>'error'='unauthorized','Logout token remained usable';
for n in 1..21 loop
 r:=public.nm_review_rpc('login','{"username":"review-fixture","code":"wrong"}'::jsonb,encode(extensions.digest(n::text,'sha256'),'hex'));
end loop;
assert r->>'error'='rate_limited','Distributed username rate limit absent';
end $test$;
rollback;
