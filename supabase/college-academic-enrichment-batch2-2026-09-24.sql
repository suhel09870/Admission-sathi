-- Academic information verified from official institution pages on 2026-09-24.
-- Only directly supported programme data is updated; unsupported fields remain unchanged.

begin;

update public.colleges
set
  courses = '[
    {"name":"B.A. (H) Economics","level":"UG"},
    {"name":"B.A. (H) English","level":"UG"},
    {"name":"B.A. (H) Hindi","level":"UG"},
    {"name":"B.A. (H) Music","level":"UG"},
    {"name":"B.A. (H) History","level":"UG"},
    {"name":"B.A. (H) Philosophy","level":"UG"},
    {"name":"B.A. (H) Political Science","level":"UG"},
    {"name":"B.A. (H) Psychology","level":"UG"},
    {"name":"B.A. (H) Sanskrit","level":"UG"},
    {"name":"B.Com. (H)","level":"UG"},
    {"name":"B.Com.","level":"UG"},
    {"name":"B.A. (P) Economics and Maths","level":"UG"},
    {"name":"B.A. (P) Political Science and History","level":"UG"},
    {"name":"B.A. (P) Nutrition and Health Education (NHE) and Music","level":"UG"},
    {"name":"BA (P) NHE and Entrepreneurship and Small Business (ESB)","level":"UG"},
    {"name":"BA (P) Philosophy and Psychology","level":"UG"},
    {"name":"BA (P) Physical Education and Political Science","level":"UG"},
    {"name":"BA (P) Hindi and Physical Education","level":"UG"},
    {"name":"BA (P) Sanskrit and Music","level":"UG"},
    {"name":"BA (P) History and English","level":"UG"},
    {"name":"B.Sc. (H) Biochemistry","level":"UG"},
    {"name":"B.Sc. (H) Botany","level":"UG"},
    {"name":"B.Sc. (H) Chemistry","level":"UG"},
    {"name":"B.Sc. (H) Mathematics","level":"UG"},
    {"name":"B.Sc. (H) Physics","level":"UG"},
    {"name":"B.Sc. (H) Zoology","level":"UG"},
    {"name":"B.Sc. Life Science","level":"UG"}
  ]'::jsonb,
  source_url = 'https://dr.du.ac.in/courses-offered-0',
  last_verified_at = date '2026-09-24',
  academic_data_verified_at = date '2026-09-24'
where id = 73;

update public.colleges
set
  courses = '[
    {"name":"B.A. (Programme)","level":"UG"},
    {"name":"B.A. (Hons.) Geography","level":"UG"},
    {"name":"B.A. (Hons.) Social Work","level":"UG"},
    {"name":"B.A. (Hons.) Hindi Patrakarita Evam Jansanchar","level":"UG"},
    {"name":"B.Com. (Hons.)","level":"UG"},
    {"name":"B.Com.","level":"UG"},
    {"name":"B.El.Ed.","level":"UG"}
  ]'::jsonb,
  source_url = 'https://aditi.du.ac.in/courses/',
  last_verified_at = date '2026-09-24',
  academic_data_verified_at = date '2026-09-24'
where id = 74;

update public.colleges
set
  courses = '[
    {"name":"B.A.Prog.","level":"UG"},
    {"name":"B.A. (Hons.) Hindi","level":"UG"},
    {"name":"B.A. (Hons.) English","level":"UG"},
    {"name":"B.A. (Hons.) History","level":"UG"},
    {"name":"B.A. (Hons.) Economics","level":"UG"},
    {"name":"B.A. (Hons.) Pol. Sc.","level":"UG"},
    {"name":"B. Com (Prog.)","level":"UG"},
    {"name":"B. Com (Hons.)","level":"UG"},
    {"name":"B. Sc. (Hons.) Physics","level":"UG"}
  ]'::jsonb,
  source_url = 'https://arsdcollege.ac.in/under_graduate_courses.aspx',
  last_verified_at = date '2026-09-24',
  academic_data_verified_at = date '2026-09-24'
where id = 76;

do $$
declare
  total_rows integer;
  distinct_ids integer;
  verified_course_rows integer;
  invalid_course_rows integer;
  protected_application_urls integer;
  outside_batch_rows integer;
begin
  select count(*)::integer, count(distinct id)::integer
  into total_rows, distinct_ids
  from public.colleges;

  select count(*)::integer
  into verified_course_rows
  from public.colleges
  where id in (73, 74, 76)
    and jsonb_typeof(courses) = 'array'
    and academic_data_verified_at = date '2026-09-24';

  select count(*)::integer
  into invalid_course_rows
  from public.colleges
  where id in (73, 74, 76)
    and (courses is null or jsonb_typeof(courses) <> 'array');

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

  select count(*)::integer
  into outside_batch_rows
  from public.colleges
  where id not between 72 and 93
    and academic_data_verified_at = date '2026-09-24';

  if total_rows <> 100 or distinct_ids <> 100 then
    raise exception 'Validation failed: expected 100 rows and 100 distinct ids, got % and %', total_rows, distinct_ids;
  end if;

  if verified_course_rows <> 3 or invalid_course_rows <> 0 then
    raise exception 'Validation failed: expected 3 valid course arrays, got % valid and % invalid', verified_course_rows, invalid_course_rows;
  end if;

  if protected_application_urls <> 8 then
    raise exception 'Validation failed: one or more protected application URLs changed';
  end if;

  if outside_batch_rows <> 0 then
    raise exception 'Validation failed: academic data appears modified outside intended batches';
  end if;
end $$;

commit;

select count(*) as total_rows, count(distinct id) as distinct_ids
from public.colleges;

select count(*) as protected_application_urls
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
