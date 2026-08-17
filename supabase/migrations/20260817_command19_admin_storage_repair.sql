begin;

create table if not exists public.edutech_term_evaluation_sessions (
  id uuid primary key default gen_random_uuid(),
  school_year_id uuid not null references public.edutech_school_years(id) on delete restrict,
  term_number integer not null check (term_number between 1 and 3),
  title text not null,
  starts_on date,
  ends_on date,
  is_open boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_year_id, term_number),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table if not exists public.edutech_archived_annual_reports (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete restrict,
  school_year_id uuid not null references public.edutech_school_years(id) on delete restrict,
  school_level text not null check (school_level in ('Première', 'Terminale')),
  series text not null check (series in ('A1', 'A2', 'C', 'D')),
  lv2_choice text check (lv2_choice is null or lv2_choice in ('Allemand', 'Espagnol')),
  term1_average numeric check (term1_average is null or (term1_average >= 0 and term1_average <= 20)),
  term2_average numeric check (term2_average is null or (term2_average >= 0 and term2_average <= 20)),
  term3_average numeric check (term3_average is null or (term3_average >= 0 and term3_average <= 20)),
  annual_average numeric check (annual_average is null or (annual_average >= 0 and annual_average <= 20)),
  final_decision text check (final_decision is null or final_decision in ('Admis', 'Redouble', 'En attente')),
  report_summary text,
  archived_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (student_id, school_year_id)
);

create index if not exists edutech_term_evaluation_sessions_year_idx on public.edutech_term_evaluation_sessions(school_year_id, term_number);
create index if not exists edutech_archived_reports_year_student_idx on public.edutech_archived_annual_reports(school_year_id, student_id);

alter table public.edutech_term_evaluation_sessions enable row level security;
alter table public.edutech_archived_annual_reports enable row level security;

drop policy if exists edutech_term_evaluation_sessions_admin_all on public.edutech_term_evaluation_sessions;
create policy edutech_term_evaluation_sessions_admin_all
on public.edutech_term_evaluation_sessions
for all to authenticated
using (public.is_edutech_admin())
with check (public.is_edutech_admin());

drop policy if exists edutech_archived_annual_reports_admin_all on public.edutech_archived_annual_reports;
drop policy if exists edutech_archived_annual_reports_student_select on public.edutech_archived_annual_reports;
create policy edutech_archived_annual_reports_admin_all
on public.edutech_archived_annual_reports
for all to authenticated
using (public.is_edutech_admin())
with check (public.is_edutech_admin());
create policy edutech_archived_annual_reports_student_select
on public.edutech_archived_annual_reports
for select to authenticated
using (student_id = auth.uid());

commit;
