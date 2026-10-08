create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  email text not null check (char_length(trim(email)) <= 254),
  company text check (company is null or char_length(trim(company)) <= 160),
  project_type text not null check (char_length(trim(project_type)) between 2 and 100),
  message text not null check (char_length(trim(message)) between 10 and 5000),
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;

revoke all on table public.contact_inquiries from anon, authenticated;
grant insert on table public.contact_inquiries to anon;

drop policy if exists "Public can submit contact inquiries" on public.contact_inquiries;
create policy "Public can submit contact inquiries"
  on public.contact_inquiries
  for insert
  to anon
  with check (
    char_length(trim(name)) between 2 and 100
    and char_length(trim(email)) between 5 and 254
    and position('@' in email) > 1
    and char_length(trim(project_type)) between 2 and 100
    and char_length(trim(message)) between 10 and 5000
  );
