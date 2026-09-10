-- Public web destinations attached to VIP catalog entries stay behind the
-- existing VIP row-level policies. Private files continue to use hf_vip_assets.
alter table public.hf_vip_contents
  add column if not exists external_url text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.hf_vip_contents'::regclass
      and conname = 'hf_vip_contents_external_url_https'
  ) then
    alter table public.hf_vip_contents
      add constraint hf_vip_contents_external_url_https
      check (
        external_url is null
        or (
          octet_length(external_url) <= 2048
          and external_url = btrim(external_url)
          and external_url !~ '[[:cntrl:]]'
          and strpos(external_url, E'\\') = 0
          and external_url ~ '^https://[^[:space:]]+$'
        )
      );
  end if;
end
$$;

comment on column public.hf_vip_contents.external_url is
  'Optional HTTPS destination revealed only with the containing VIP content row.';
