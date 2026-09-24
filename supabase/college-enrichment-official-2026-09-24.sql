-- Official application destinations verified on 2026-09-24.
-- Run this migration in the Supabase SQL Editor.
-- It updates existing rows by numeric id only and does not create or delete rows.

begin;

update public.colleges
set
  application_url = 'https://admission.bhu.ac.in/en',
  source_url = 'https://admission.bhu.ac.in/en',
  last_verified_at = date '2026-09-24'
where id = 17;

update public.colleges
set
  application_url = 'https://admissions.keralauniversity.ac.in/fyugpHome.php',
  source_url = 'https://admissions.keralauniversity.ac.in/fyugpHome.php',
  last_verified_at = date '2026-09-24'
where id = 46;

update public.colleges
set
  application_url = 'https://admission.uoc.ac.in/',
  source_url = 'https://admission.uoc.ac.in/',
  last_verified_at = date '2026-09-24'
where id = 48;

update public.colleges
set
  application_url = 'https://admissions.puchd.ac.in/',
  source_url = 'https://admissions.puchd.ac.in/',
  last_verified_at = date '2026-09-24'
where id = 51;

update public.colleges
set
  application_url = 'https://www.lpu.in/admission/admissions.php',
  source_url = 'https://www.lpu.in/admission/admissions.php',
  last_verified_at = date '2026-09-24'
where id = 52;

update public.colleges
set
  application_url = 'https://portal.eternaluniversity.edu.in/register',
  source_url = 'https://portal.eternaluniversity.edu.in/register',
  last_verified_at = date '2026-09-24'
where id = 65;

update public.colleges
set
  application_url = 'https://ansmcollege.in/registration-form.php',
  source_url = 'https://ansmcollege.in/registration-form.php',
  last_verified_at = date '2026-09-24'
where id = 86;

update public.colleges
set
  application_url = 'https://erp.anscollege.ac.in/admission.aspx',
  source_url = 'https://erp.anscollege.ac.in/admission.aspx',
  last_verified_at = date '2026-09-24'
where id = 87;

do $$
declare
  total_rows integer;
  distinct_ids integer;
  verified_application_urls integer;
begin
  select count(*)::integer, count(distinct id)::integer
  into total_rows, distinct_ids
  from public.colleges;

  select count(*)::integer
  into verified_application_urls
  from public.colleges
  where application_url in (
    'https://admission.bhu.ac.in/en',
    'https://admissions.keralauniversity.ac.in/fyugpHome.php',
    'https://admission.uoc.ac.in/',
    'https://admissions.puchd.ac.in/',
    'https://www.lpu.in/admission/admissions.php',
    'https://portal.eternaluniversity.edu.in/register',
    'https://ansmcollege.in/registration-form.php',
    'https://erp.anscollege.ac.in/admission.aspx'
  );

  if total_rows <> 100 or distinct_ids <> 100 then
    raise exception 'Validation failed: expected 100 rows and 100 distinct ids, got % and %', total_rows, distinct_ids;
  end if;

  if verified_application_urls <> 8 then
    raise exception 'Validation failed: expected 8 verified application URLs, got %', verified_application_urls;
  end if;
end $$;

commit;

select count(*) as total_rows, count(distinct id) as distinct_ids
from public.colleges;

select count(*) as verified_application_urls
from public.colleges
where application_url is not null;