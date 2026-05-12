-- Campos de redes sociais no perfil
alter table public.usuarios
  add column if not exists instagram text,
  add column if not exists twitter   text,
  add column if not exists youtube   text,
  add column if not exists website   text;

-- Bucket público para fotos de perfil
insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true)
on conflict (id) do nothing;

-- Políticas de storage para avatares
do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'objects' and policyname = 'avatares_select_public'
  ) then
    execute $p$
      create policy "avatares_select_public" on storage.objects
        for select using (bucket_id = 'avatares')
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'objects' and policyname = 'avatares_insert_auth'
  ) then
    execute $p$
      create policy "avatares_insert_auth" on storage.objects
        for insert with check (bucket_id = 'avatares' and auth.uid() is not null)
    $p$;
  end if;

  if not exists (
    select 1 from pg_policies
    where tablename = 'objects' and policyname = 'avatares_update_auth'
  ) then
    execute $p$
      create policy "avatares_update_auth" on storage.objects
        for update using (bucket_id = 'avatares' and auth.uid() is not null)
    $p$;
  end if;
end $$;
