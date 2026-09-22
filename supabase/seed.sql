-- Admission Saathi demo data seed.
-- This seed is intentionally limited to the 12 current SAMPLE/DEMO records.
-- Rerunning it replaces only these exact demo names and leaves other rows intact.

begin;

delete from public.colleges
where name in (
  'Demo City College of Computer Studies',
  'Demo Institute of Digital Learning',
  'Demo Arts and Commerce College',
  'Demo Science Academy',
  'Demo School of Business',
  'Demo College of Technology',
  'Demo Media and Communication College',
  'Demo Law and Public Policy Institute',
  'Demo School of Commerce',
  'Demo College of Liberal Studies',
  'Demo Advanced Computing Institute',
  'Demo Management and Research Centre'
);

insert into public.colleges (
  name,
  city,
  state,
  category,
  courses,
  fees,
  eligibility,
  admission_status,
  description,
  application_url
) values
(
  'Demo City College of Computer Studies',
  'Chandausi',
  'Uttar Pradesh',
  'Private College',
  '[{"code":"BCA","name":"Bachelor of Computer Applications"},{"code":"MCA","name":"Master of Computer Applications"}]'::jsonb,
  '₹65K - ₹1.4L',
  '12th from a recognised board for BCA; graduation for MCA',
  'Applications open',
  'Sample record for testing computer applications searches and college details.',
  null
),
(
  'Demo Institute of Digital Learning',
  'Pune',
  'Maharashtra',
  'Autonomous College',
  '[{"code":"BCA","name":"Bachelor of Computer Applications"},{"code":"BBA","name":"Bachelor of Business Administration"}]'::jsonb,
  '₹1.2L - ₹2.8L',
  '12th from a recognised board',
  'Admissions opening soon',
  'Sample record with BCA and BBA for testing multi-course filters.',
  null
),
(
  'Demo Arts and Commerce College',
  'Mumbai',
  'Maharashtra',
  'Government College',
  '[{"code":"BA","name":"Bachelor of Arts"},{"code":"B.Com","name":"Bachelor of Commerce"}]'::jsonb,
  '₹35K - ₹90K',
  '12th from a recognised board',
  'Applications open',
  'Sample undergraduate arts and commerce college record.',
  null
),
(
  'Demo Science Academy',
  'Bengaluru',
  'Karnataka',
  'Private Institute',
  '[{"code":"B.Sc","name":"Bachelor of Science"},{"code":"M.Sc","name":"Master of Science"}]'::jsonb,
  '₹2.5L - ₹6L',
  '12th with relevant subjects for B.Sc; graduation for M.Sc',
  'Applications closed',
  'Sample science-focused institute record for filter testing.',
  null
),
(
  'Demo School of Business',
  'Ahmedabad',
  'Gujarat',
  'Private College',
  '[{"code":"BBA","name":"Bachelor of Business Administration"},{"code":"BBM","name":"Bachelor of Business Management"}]'::jsonb,
  '₹4L - ₹8L',
  '12th from a recognised board',
  'Applications open',
  'Sample business college record with mid-range fees.',
  null
),
(
  'Demo College of Technology',
  'Jaipur',
  'Rajasthan',
  'Public Institute',
  '[{"code":"B.Tech","name":"Bachelor of Technology"}]'::jsonb,
  '₹6L - ₹14L',
  '12th with PCM and an applicable entrance qualification',
  'Admissions opening soon',
  'Sample technology college record for engineering course searches.',
  null
),
(
  'Demo Media and Communication College',
  'Kolkata',
  'West Bengal',
  'Autonomous College',
  '[{"code":"BJMC","name":"Bachelor of Journalism and Mass Communication"},{"code":"BA","name":"Bachelor of Arts"}]'::jsonb,
  '₹1.8L - ₹4.5L',
  '12th from a recognised board',
  'Applications open',
  'Sample media college record for full course name searches.',
  null
),
(
  'Demo Law and Public Policy Institute',
  'New Delhi',
  'Delhi',
  'Public Institute',
  '[{"code":"LLB","name":"Bachelor of Laws"},{"code":"MA","name":"Master of Arts"}]'::jsonb,
  '₹5L - ₹16L',
  'Graduation for LLB and MA programmes',
  'Applications closed',
  'Sample law and public policy institute record.',
  null
),
(
  'Demo School of Commerce',
  'Chennai',
  'Tamil Nadu',
  'Private College',
  '[{"code":"B.Com","name":"Bachelor of Commerce"},{"code":"M.Com","name":"Master of Commerce"}]'::jsonb,
  '₹7L - ₹18L',
  '12th for B.Com; graduation for M.Com',
  'Applications open',
  'Sample commerce college record with postgraduate options.',
  null
),
(
  'Demo College of Liberal Studies',
  'Kochi',
  'Kerala',
  'Government College',
  '[{"code":"BA","name":"Bachelor of Arts"},{"code":"MA","name":"Master of Arts"}]'::jsonb,
  '₹2.2L - ₹5.5L',
  '12th for BA; graduation for MA',
  'Admissions opening soon',
  'Sample liberal studies college record for city and course testing.',
  null
),
(
  'Demo Advanced Computing Institute',
  'Hyderabad',
  'Telangana',
  'Private Institute',
  '[{"code":"MCA","name":"Master of Computer Applications"},{"code":"B.Tech","name":"Bachelor of Technology"}]'::jsonb,
  '₹16L - ₹28L',
  'Graduation for MCA; 12th with PCM for B.Tech',
  'Applications open',
  'Sample advanced computing institute record with a higher fee range.',
  null
),
(
  'Demo Management and Research Centre',
  'Indore',
  'Madhya Pradesh',
  'Deemed University',
  '[{"code":"BBM","name":"Bachelor of Business Management"},{"code":"BBA","name":"Bachelor of Business Administration"}]'::jsonb,
  '₹12L - ₹24L',
  '12th from a recognised board',
  'Admissions opening soon',
  'Sample management record for category, fees, and course filters.',
  null
);

commit;
