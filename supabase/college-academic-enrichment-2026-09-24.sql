-- Academic information verified from official institution pages on 2026-09-24.
-- Run this migration in the Supabase SQL Editor.
-- It updates existing rows by numeric id only; it does not create or delete rows.

begin;

update public.colleges
set
  course = 'B.A. English',
  courses = '[
    {"name":"Bachelor of Arts (English)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Sanskrit)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Urdu)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Home Science)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Philosophy)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Economics)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Hindi)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (History)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Sociology)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Political Science)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Geography)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Arts (Mathematics)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Science (Physics)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Science (Chemistry)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Science (Botany)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Science (Zoology)","level":"UG","duration":"4 years"},
    {"name":"Bachelor of Commerce (Commerce)","level":"UG","duration":"4 years"}
  ]'::jsonb,
  source_url = 'https://akscollege.com/courses/',
  last_verified_at = date '2026-09-24',
  academic_data_verified_at = date '2026-09-24'
where id = 92
  and course is null
  and coalesce(jsonb_array_length(courses), 0) = 0;

update public.colleges
set
  course = 'B.Tech. Computer Engineering',
  courses = '[
    {"name":"Bachelor of Technology (Automobile Engineering)","level":"UG"},
    {"name":"Bachelor of Technology (Civil Engineering)","level":"UG"},
    {"name":"Bachelor of Technology (Computer Engineering)","level":"UG"},
    {"name":"Bachelor of Technology (Computer Science and Design)","level":"UG"},
    {"name":"Bachelor of Technology (Dairy Technology)","level":"UG"},
    {"name":"Bachelor of Technology (Electronics and Communication Engineering)","level":"UG"},
    {"name":"Bachelor of Technology (Electrical Engineering)","level":"UG"},
    {"name":"Bachelor of Technology (Food Processing Technology)","level":"UG"},
    {"name":"Bachelor of Technology (Artificial Intelligence and Data Science)","level":"UG"},
    {"name":"Bachelor of Technology (Information Technology)","level":"UG"},
    {"name":"Bachelor of Technology (Mechanical Engineering)","level":"UG"},
    {"name":"Master of Technology (Food Technology)","level":"PG"},
    {"name":"Master of Technology (Artificial Intelligence)","level":"PG"},
    {"name":"Master of Technology (Mechanical Engineering)","level":"PG"}
  ]'::jsonb,
  eligibility = 'For B.Tech. Computer Engineering: 10+2 with PCM.',
  source_url = 'https://adit.ac.in/departments/department.php?dept=computerengineering&program=cp',
  last_verified_at = date '2026-09-24',
  academic_data_verified_at = date '2026-09-24'
where id = 93
  and course is null
  and eligibility is null
  and coalesce(jsonb_array_length(courses), 0) = 0;

do $$
declare
  total_rows integer;
  distinct_ids integer;
  academic_rows integer;
  protected_application_urls integer;
begin
  select count(*)::integer, count(distinct id)::integer
  into total_rows, distinct_ids
  from public.colleges;

  select count(*)::integer
  into academic_rows
  from public.colleges
  where id in (92, 93)
    and courses is not null
    and jsonb_typeof(courses) = 'array'
    and academic_data_verified_at = date '2026-09-24';

  select count(*)::integer
  into protected_application_urls
  from public.colleges
  where (id = 17 and application_url = 'https://admission.bhu.ac.in/en')
     or (id = 46 and application_url = 'https://admissions.keralauniversity.ac.in/fyugpHome.php')
     or (id = 48 and application_url = 'https://admission.uoc.ac.in/')
     or (id = 51 and application_url = 'https://admissions.puchd.ac.in/')
     or (id = 52 and application_url = 'https://www.lpu.in/admission/admissions.php')
     or (id = 65 and application_url = 'https://portal.eternaluniversity.edu.in/register')
     or (id = 86 and application_url = 'https://ansmcollege.in/registration-form.php')
     or (id = 87 and application_url = 'https://erp.anscollege.ac.in/admission.aspx');

  if total_rows <> 100 or distinct_ids <> 100 then
    raise exception 'Validation failed: expected 100 rows and 100 distinct ids, got % and %', total_rows, distinct_ids;
  end if;

  if academic_rows <> 2 then
    raise exception 'Validation failed: expected 2 academic rows, got %', academic_rows;
  end if;

  if protected_application_urls <> 8 then
    raise exception 'Validation failed: one or more protected application URLs changed';
  end if;
end $$;

commit;

select count(*) as total_rows, count(distinct id) as distinct_ids
from public.colleges;

select count(*) as verified_course_rows
from public.colleges
where courses is not null and jsonb_typeof(courses) = 'array';