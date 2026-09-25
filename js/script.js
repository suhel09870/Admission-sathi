let colleges = [];
let programsByCollegeId = new Map();

const filterForm = document.querySelector('#college-filters');
const collegeGrid = document.querySelector('.college-grid');
const applyFiltersButton = document.querySelector('.apply-filters');
const searchForm = document.querySelector('.search-bar');
const searchInput = document.querySelector('#college-search');
const searchButton = searchForm.querySelector('button');
const homeSearchForm = document.querySelector('#home-search');
const homeSearchInput = document.querySelector('#home-search-input');
const noResultsMessage = document.querySelector('#no-results');
const dataStatus = document.querySelector('#data-status');
const collegeModal = document.querySelector('#college-modal');
const modalCloseButton = document.querySelector('.college-modal-close');
const modalSecondaryCloseButton = document.querySelector('[data-college-modal-close]');
const modalApplyButton = document.querySelector('#modal-apply-button');
const modalWebsiteButton = document.querySelector('#modal-website-button');
const modalApplyMessage = document.querySelector('#modal-apply-message');
const modalPrograms = document.querySelector('#modal-programs');
const modalProgramList = document.querySelector('#modal-program-list');

const modalFields = {
  name: document.querySelector('#modal-college-name'), locationHeading: document.querySelector('#modal-location-heading'), location: document.querySelector('#modal-location'), courseType: document.querySelector('#modal-course-type'), courses: document.querySelector('#modal-courses'), affiliation: document.querySelector('#modal-affiliation'), fees: document.querySelector('#modal-fees'), eligibility: document.querySelector('#modal-eligibility'), admissionStatus: document.querySelector('#modal-admission-status'), description: document.querySelector('#modal-description')
};

const normalizeCourses = (value, fallbackCourse) => {
  let courses = value;
  if (typeof courses === 'string') {
    try {
      const parsedCourses = JSON.parse(courses);
      courses = Array.isArray(parsedCourses) ? parsedCourses : courses;
    } catch {
      courses = courses.split(',');
    }
  }
  if (!Array.isArray(courses)) courses = fallbackCourse ? [fallbackCourse] : [];
  const normalizedCourses = courses
    .flatMap((course) => {
      if (course && typeof course === 'object') return [course.name || course.code || ''];
      return [course];
    })
    .map((course) => String(course ?? '').trim())
    .filter(Boolean);
  return normalizedCourses.length ? normalizedCourses : (fallbackCourse ? [String(fallbackCourse).trim()] : []);
};

const normalizeCollege = (college) => {
  const course = college.course ?? '';
  return {
    id: college.id,
    name: college.name ?? '',
    city: college.city ?? '',
    state: college.state ?? '',
    course,
    courses: normalizeCourses(college.courses, course),
    fees: college.fees ?? '',
    eligibility: college.eligibility ?? '',
    admission_status: college.admission_status ?? '',
    description: college.description ?? '',
    application_url: college.application_url ?? '',
    website: college.website ?? '',
    official_website: college.official_website ?? '',
    affiliation: college.affiliation ?? '',
    category: college.category ?? '',
    institution_type: college.institution_type ?? '',
    ownership: college.ownership ?? '',
    address: college.address ?? '',
    established_year: college.established_year ?? '',
    last_verified_at: college.last_verified_at ?? '',
    source_url: college.source_url ?? '',
    academic_data_verified_at: college.academic_data_verified_at ?? ''
  };
};

const getAdmissionStatusClass = (status) => {
  const normalizedStatus = (status || '').toLowerCase();
  if (normalizedStatus.includes('soon')) return 'status-coming-soon';
  if (normalizedStatus.includes('open')) return 'status-open';
  return 'status-closed';
};

const displayValue = (value, fallback = 'Not available') => {
  if (value === null || value === undefined || value === '') return fallback;
  if (Array.isArray(value)) return value.join(', ') || fallback;
  if (typeof value === 'object') return fallback;
  return String(value);
};
const displayCollegeField = (value) => {
  return displayValue(value, 'Not verified');
};

const getCollegeCourses = (college) => {
  const programs = programsByCollegeId.get(college.id) || [];

  const programCourses = programs
    .map((program) => program.program_name)
    .filter((name) => name !== null && name !== undefined && String(name).trim() !== '')
    .map((name) => String(name).trim());

  if (programCourses.length) {
    return [...new Set(programCourses)];
  }

  return college.courses.length
    ? college.courses
    : normalizeCourses(college.course);
};
const getCollegeWebsite = (college) => college.official_website || college.website;

const isHttpUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const appendProgramField = (details, label, value) => {
  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) return;
  const wrapper = document.createElement('div');
  const term = document.createElement('dt');
  const description = document.createElement('dd');
  term.textContent = label;
  description.textContent = value;
  wrapper.append(term, description);
  details.append(wrapper);
};

const appendProgramLink = (details, label, value, linkText) => {
  if (!isHttpUrl(value)) return;
  const wrapper = document.createElement('div');
  const term = document.createElement('dt');
  const description = document.createElement('dd');
  const link = document.createElement('a');
  term.textContent = label;
  link.href = value;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = linkText;
  description.append(link);
  wrapper.append(term, description);
  details.append(wrapper);
};

const renderPrograms = (programs) => {
  modalProgramList.replaceChildren();
  modalPrograms.hidden = programs.length === 0;
  programs.forEach((program) => {
    const item = document.createElement('article');
    const title = document.createElement('h4');
    const details = document.createElement('dl');
    item.className = 'program-item';
    title.textContent = program.program_name || '';
    appendProgramField(details, 'Level', program.level);
    appendProgramField(details, 'Duration', program.duration);
    appendProgramField(details, 'Admission status', program.admission_status);
    appendProgramField(details, 'Fees', program.fees);
    appendProgramField(details, 'Eligibility', program.eligibility);
    appendProgramLink(details, 'Application', program.application_url, 'Apply');
    appendProgramField(details, 'Verified date', program.academic_data_verified_at);
    appendProgramLink(details, 'Source', program.source_url, 'Official source');
    item.append(title, details);
    modalProgramList.append(item);
  });
};

const openCollegeModal = (college) => {
  const location = [college.city, college.state].filter(Boolean).join(', ');
  const address = college.address || location;
  const website = getCollegeWebsite(college);
  const metadata = [
    college.established_year ? `Established: ${college.established_year}` : '',
    website ? `Website: ${website}` : ''
  ].filter(Boolean);
  modalFields.name.textContent = displayValue(college.name);
  modalFields.locationHeading.textContent = displayValue(location);
  modalFields.location.textContent = displayValue([address, location].filter(Boolean).join(' | '));
  modalFields.courseType.textContent = displayCollegeField(getCollegeCourses(college));
  modalFields.courses.textContent = displayCollegeField(getCollegeCourses(college));
  modalFields.affiliation.textContent =
  college.institution_type === 'University'
    ? 'Not applicable'
    : displayCollegeField(college.affiliation);
  modalFields.fees.textContent = displayCollegeField(college.fees);
  modalFields.eligibility.textContent = displayCollegeField(college.eligibility);
  modalFields.admissionStatus.textContent = displayCollegeField(college.admission_status);
  modalFields.admissionStatus.className = `admission-status ${getAdmissionStatusClass(college.admission_status)}`;
  modalFields.description.textContent = [displayCollegeField(college.description), ...metadata].join('\n\n');
  const collegePrograms = programsByCollegeId.get(college.id) || [];
renderPrograms(collegePrograms);
  modalApplyButton.dataset.applicationUrl = college.application_url || '';
  modalWebsiteButton.hidden = !isHttpUrl(website);
  modalWebsiteButton.href = isHttpUrl(website) ? website : '#';
  modalApplyMessage.hidden = true;
  modalApplyMessage.textContent = '';
  collegeModal.hidden = false;
  document.body.classList.add('modal-open');
};

const createCollegeCard = (college) => {
  const card = document.createElement('article');
  card.className = 'college-card';
  card.innerHTML = '<h3></h3><dl class="college-info"><div><dt>Location</dt><dd></dd></div><div><dt>Course</dt><dd></dd></div><div><dt>Admission status</dt><dd class="admission-status"></dd></div></dl><button class="view-details" type="button">View Details</button>';
  card.querySelector('h3').textContent = displayValue(college.name);
  const details = card.querySelectorAll('.college-info dd');
  details[0].textContent = displayValue([college.city, college.state].filter(Boolean).join(', '));
  details[1].textContent = displayCollegeField(getCollegeCourses(college));
  details[2].textContent = displayCollegeField(college.admission_status);
  details[2].className = `admission-status ${getAdmissionStatusClass(college.admission_status)}`;
  card.querySelector('.view-details').addEventListener('click', () => openCollegeModal(college));
  return card;
};

const renderCollegeCards = (visibleColleges) => {
  collegeGrid.querySelectorAll('.college-card').forEach((card) => card.remove());
  visibleColleges.forEach((college) => collegeGrid.insertBefore(createCollegeCard(college), noResultsMessage));
};

const populateFilterOptions = () => {
  const filters = [
    [filterForm.elements.location, colleges.flatMap((college) => [college.city, college.state]), 'All Locations'],
    [filterForm.elements['course-type'], colleges.flatMap(getCollegeCourses), 'All Courses'],
    [filterForm.elements.affiliation, colleges.map((college) => college.affiliation), 'All Affiliations']
  ];
  filters.forEach(([select, field, label]) => {
    select.replaceChildren(new Option(label, ''));
    const values = field.filter((value) => value !== null && value !== undefined && String(value).trim() !== '');
    [...new Set(values)].sort().forEach((value) => select.add(new Option(value, value)));
  });
};

const updateVisibleCards = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedLocation = filterForm.elements.location.value;
  const selectedCourse = filterForm.elements['course-type'].value;
  const selectedAffiliation = filterForm.elements.affiliation.value;
  const visibleColleges = colleges.filter((college) => {
    const courses = getCollegeCourses(college);
    const searchableText = [college.name, college.city, college.state, college.course, ...courses, college.affiliation].join(' ').toLowerCase();
    return (
      (!searchTerm || searchableText.includes(searchTerm)) &&
      (!selectedLocation || [college.city, college.state].includes(selectedLocation)) &&
      (!selectedCourse || courses.includes(selectedCourse)) &&
      (!selectedAffiliation || college.affiliation === selectedAffiliation)
    );
  });
  renderCollegeCards(visibleColleges);
  noResultsMessage.hidden = visibleColleges.length > 0;
};

applyFiltersButton.addEventListener('click', updateVisibleCards);
searchButton.addEventListener('click', updateVisibleCards);
searchForm.addEventListener('submit', (event) => { event.preventDefault(); updateVisibleCards(); });
homeSearchForm.addEventListener('submit', (event) => { event.preventDefault(); searchInput.value = homeSearchInput.value; updateVisibleCards(); document.querySelector('#college-filters').scrollIntoView({ behavior: 'smooth' }); });
filterForm.addEventListener('reset', () => { searchInput.value = ''; requestAnimationFrame(updateVisibleCards); });

const accountButton = document.querySelector('#account-button');
const accountModal = document.querySelector('#account-modal');
const accountModalCloseButton = document.querySelector('#account-modal-close');
const profileModal = document.querySelector('#profile-modal');
const profileModalCloseButton = document.querySelector('#profile-modal-close');
const loginState = document.querySelector('#login-state');
const signupState = document.querySelector('#signup-state');
const loginForm = document.querySelector('#login-form');
const signupForm = document.querySelector('#signup-form');
const loginMessage = document.querySelector('#login-message');
const signupMessage = document.querySelector('#signup-message');
const profileFields = { name: document.querySelector('#profile-name'), email: document.querySelector('#profile-email'), mobile: document.querySelector('#profile-mobile') };
const showSignupButton = document.querySelector('#show-signup');
const showLoginButton = document.querySelector('#show-login');
const logoutButton = document.querySelector('#logout-button');
const demoProfileKey = 'admissionSaathiDemoProfile';
const demoSessionKey = 'admissionSaathiDemoSession';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[6-9]\d{9}$/;

const getStoredProfile = () => {
  try { return JSON.parse(localStorage.getItem(demoProfileKey)); } catch { return null; }
};
const getCurrentProfile = () => {
  const profile = getStoredProfile();
  const sessionIdentifier = localStorage.getItem(demoSessionKey);
  if (!profile || !sessionIdentifier || ![profile.email, profile.mobile].includes(sessionIdentifier)) return null;
  return profile;
};
const setMessage = (element, message, isSuccess = false) => { element.textContent = message; element.classList.toggle('success', isSuccess); };
const clearFormMessages = (form) => { form.querySelectorAll('.field-error').forEach((field) => { field.textContent = ''; }); setMessage(form.querySelector('.form-message'), ''); };
const setAccountModalState = (state) => { const isSignup = state === 'signup'; loginState.hidden = isSignup; signupState.hidden = !isSignup; clearFormMessages(isSignup ? signupForm : loginForm); };
const openAccountModal = (state = 'login') => { setAccountModalState(state); accountModal.hidden = false; document.body.classList.add('modal-open'); (state === 'signup' ? signupForm : loginForm).querySelector('input').focus(); };
const closeAccountModal = () => { accountModal.hidden = true; if (profileModal.hidden && collegeModal.hidden) document.body.classList.remove('modal-open'); };

const openProfileModal = () => {
  const profile = getCurrentProfile();
  if (!profile) return openAccountModal();
  profileFields.name.textContent = profile.fullName;
  profileFields.email.textContent = profile.email;
  profileFields.mobile.textContent = profile.mobile;
  profileModal.hidden = false;
  document.body.classList.add('modal-open');
  profileModalCloseButton.focus();
};

const closeProfileModal = () => {
  profileModal.hidden = true;
  if (accountModal.hidden && collegeModal.hidden) document.body.classList.remove('modal-open');
};

const updateAccountButton = () => {
  const profile = getCurrentProfile();
  accountButton.textContent = profile ? profile.fullName : 'Login';
  accountButton.setAttribute('aria-label', profile ? `Open profile for ${profile.fullName}` : 'Open login dialog');
};

const validateSignup = (formData) => {
  const errors = {};
  if (!formData.fullName.trim()) errors.name = 'Please enter your full name.';
  if (!emailPattern.test(formData.email.trim())) errors.email = 'Enter a valid email address.';
  if (!mobilePattern.test(formData.mobile.trim())) errors.mobile = 'Enter a valid 10-digit mobile number.';
  if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters.';
  if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match.';
  return errors;
};

const showSignupErrors = (errors) => {
  const fields = { name: '#signup-name-error', email: '#signup-email-error', mobile: '#signup-mobile-error', password: '#signup-password-error', confirmPassword: '#signup-confirm-password-error' };
  Object.entries(fields).forEach(([field, selector]) => { document.querySelector(selector).textContent = errors[field] || ''; });
};

accountButton.addEventListener('click', () => {
  if (getCurrentProfile()) openProfileModal();
  else openAccountModal();
});
accountModalCloseButton.addEventListener('click', closeAccountModal);
profileModalCloseButton.addEventListener('click', closeProfileModal);
showSignupButton.addEventListener('click', () => setAccountModalState('signup'));
showLoginButton.addEventListener('click', () => setAccountModalState('login'));
accountModal.addEventListener('click', (event) => { if (event.target === accountModal) closeAccountModal(); });
profileModal.addEventListener('click', (event) => { if (event.target === profileModal) closeProfileModal(); });

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearFormMessages(signupForm);
  const formData = Object.fromEntries(new FormData(signupForm));
  const errors = validateSignup(formData);
  showSignupErrors(errors);
  if (Object.keys(errors).length) return;

  const profile = { fullName: formData.fullName.trim(), email: formData.email.trim().toLowerCase(), mobile: formData.mobile.trim() };
  localStorage.setItem(demoProfileKey, JSON.stringify(profile));
  localStorage.setItem(demoSessionKey, profile.email);
  updateAccountButton();
  signupForm.reset();
  closeAccountModal();
  openProfileModal();
});

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearFormMessages(loginForm);
  const identifier = loginForm.elements.identifier.value.trim().toLowerCase();
  const password = loginForm.elements.password.value;
  const profile = getStoredProfile();
  let hasError = false;
  if (!identifier) {
    document.querySelector('#login-identifier-error').textContent = 'Enter your email or mobile number.';
    hasError = true;
  }
  if (password.length < 6) {
    document.querySelector('#login-password-error').textContent = 'Password must be at least 6 characters.';
    hasError = true;
  }
  if (hasError) return;
  if (!profile || ![profile.email, profile.mobile].includes(identifier)) {
    setMessage(loginMessage, 'No demo account found. Please sign up first.');
    return;
  }

  localStorage.setItem(demoSessionKey, profile.email);
  updateAccountButton();
  loginForm.reset();
  closeAccountModal();
  openProfileModal();
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem(demoSessionKey);
  updateAccountButton();
  closeProfileModal();
});

const closeCollegeModal = () => {
  collegeModal.hidden = true;
  if (accountModal.hidden && profileModal.hidden) document.body.classList.remove('modal-open');
};
modalCloseButton.addEventListener('click', closeCollegeModal);
modalSecondaryCloseButton.addEventListener('click', closeCollegeModal);
modalApplyButton.addEventListener('click', () => {
  const applicationUrl = modalApplyButton.dataset.applicationUrl;
  if (isHttpUrl(applicationUrl)) {
    window.open(applicationUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  modalApplyMessage.textContent = 'Official application link not verified.';
  modalApplyMessage.hidden = false;
});
collegeModal.addEventListener('click', (event) => { if (event.target === collegeModal) closeCollegeModal(); });
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!collegeModal.hidden) closeCollegeModal();
  else if (!accountModal.hidden) closeAccountModal();
  else if (!profileModal.hidden) closeProfileModal();
});

const loadColleges = async () => {
  const config = window.SUPABASE_CONFIG || {};
  if (!window.supabase || !config.url || !config.anonKey) {
    dataStatus.textContent = 'College data is unavailable. Add the Supabase publishable key to js/config.js.';
    dataStatus.classList.add('error');
    console.error('Supabase client configuration is missing.');
    return;
  }

  const supabaseClient = window.supabase.createClient(config.url, config.anonKey);
  const [collegeRequest, programRequest] = await Promise.allSettled([
    supabaseClient.from('colleges').select('id, name, city, state, course, courses, fees, eligibility, admission_status, description, application_url, website, official_website, affiliation, category, institution_type, ownership, address, established_year, last_verified_at, source_url, academic_data_verified_at'),
    supabaseClient.from('college_programs').select('id, college_id, program_name, level, duration, fees, eligibility, admission_status, application_url, academic_data_verified_at, source_url')
  ]);
  const collegeResult = collegeRequest.status === 'fulfilled' ? collegeRequest.value : { data: null, error: collegeRequest.reason };
  const programResult = programRequest.status === 'fulfilled' ? programRequest.value : { data: null, error: programRequest.reason };
  const { data, error } = collegeResult;
  if (error) {
    dataStatus.textContent = `Unable to load colleges: ${error.message}`;
    dataStatus.classList.add('error');
    console.error('Unable to load colleges from public.colleges:', error);
    return;
  }

  colleges = (data || []).map(normalizeCollege);
  programsByCollegeId = new Map();
  if (!programResult.error) {
    (programResult.data || []).forEach((program) => {
      const collegePrograms = programsByCollegeId.get(program.college_id) || [];
      collegePrograms.push(program);
      programsByCollegeId.set(program.college_id, collegePrograms);
    });
  }
  dataStatus.hidden = true;
  populateFilterOptions();
  updateVisibleCards();
};

loadColleges();
updateAccountButton();