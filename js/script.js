const colleges = [
  { name: 'Indian Institute of Technology Delhi', city: 'New Delhi', state: 'Delhi', courses: ['Engineering'], category: 'Public Institute', fees: '₹2.5L - ₹10L', feesRange: 'under-5', eligibility: '12th with PCM and JEE Advanced', admissionStatus: 'Applications open', description: 'A leading public institute offering undergraduate and postgraduate engineering programmes.', established: '1961', ranking: '#4 Engineering Institute in India', website: 'https://home.iitd.ac.in', applicationUrl: null },
  { name: 'Christian Medical College', city: 'Vellore', state: 'Tamil Nadu', courses: ['Medical'], category: 'Private College', fees: '₹5L - ₹25L', feesRange: '15-25', eligibility: '12th with PCB and NEET qualification', admissionStatus: 'Admissions opening soon', description: 'A respected medical college and teaching hospital with comprehensive healthcare programmes.', established: '1942', ranking: '#1 Medical College in India', website: 'https://www.cmch-vellore.edu', applicationUrl: null },
  { name: "St. Xavier's College", city: 'Mumbai', state: 'Maharashtra', courses: ['Arts & Commerce'], category: 'Autonomous College', fees: '₹45K - ₹1.5L', feesRange: 'under-5', eligibility: '12th from a recognised board', admissionStatus: 'Applications open', description: 'An autonomous college known for undergraduate arts, commerce, and science education.', established: '1869', ranking: 'Top 10 Arts Colleges in India', website: 'https://xaviers.ac', applicationUrl: null },
  { name: 'National Institute of Fashion Technology', city: 'Bengaluru', state: 'Karnataka', courses: ['Design'], category: 'Public Institute', fees: '₹3L - ₹12L', feesRange: '5-15', eligibility: '12th from a recognised board and NIFT entrance exam', admissionStatus: 'Entrance registration open', description: 'A specialised institute for fashion design, technology, management, and related creative fields.', established: '1986', ranking: 'Top 5 Design Institutes in India', website: 'https://www.nift.ac.in', applicationUrl: null },
  { name: 'Indian Institute of Management Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', courses: ['Management'], category: 'Public Institute', fees: '₹12L - ₹25L', feesRange: '15-25', eligibility: 'Graduation with CAT qualification', admissionStatus: 'Applications opening soon', description: 'A premier management institute offering postgraduate and doctoral business programmes.', established: '1961', ranking: '#1 Management Institute in India', website: 'https://www.iima.ac.in', applicationUrl: null },
  { name: 'Birla Institute of Technology and Science', city: 'Pilani', state: 'Rajasthan', courses: ['Engineering'], category: 'Private Institute', fees: '₹8L - ₹18L', feesRange: '5-15', eligibility: '12th with PCM and BITSAT qualification', admissionStatus: 'Applications open', description: 'A private deemed university with flexible, research-focused programmes in engineering and sciences.', established: '1964', ranking: 'Top 20 Engineering Institutes in India', website: 'https://www.bits-pilani.ac.in', applicationUrl: null }
];

const filterForm = document.querySelector('#college-filters');
const collegeGrid = document.querySelector('.college-grid');
const applyFiltersButton = document.querySelector('.apply-filters');
const searchForm = document.querySelector('.search-bar');
const searchInput = document.querySelector('#college-search');
const searchButton = searchForm.querySelector('button');
const homeSearchForm = document.querySelector('#home-search');
const homeSearchInput = document.querySelector('#home-search-input');
const noResultsMessage = document.querySelector('#no-results');
const collegeModal = document.querySelector('#college-modal');
const modalCloseButton = document.querySelector('.college-modal-close');
const modalSecondaryCloseButton = document.querySelector('[data-college-modal-close]');
const modalApplyButton = document.querySelector('#modal-apply-button');
const modalApplyMessage = document.querySelector('#modal-apply-message');

const modalFields = {
  name: document.querySelector('#modal-college-name'), locationHeading: document.querySelector('#modal-location-heading'), location: document.querySelector('#modal-location'), courseType: document.querySelector('#modal-course-type'), courses: document.querySelector('#modal-courses'), category: document.querySelector('#modal-category'), fees: document.querySelector('#modal-fees'), eligibility: document.querySelector('#modal-eligibility'), admissionStatus: document.querySelector('#modal-admission-status'), description: document.querySelector('#modal-description')
};

const getAdmissionStatusClass = (status) => {
  const normalizedStatus = status.toLowerCase();
  if (normalizedStatus.includes('open')) return 'status-open';
  if (normalizedStatus.includes('soon')) return 'status-coming-soon';
  return 'status-closed';
};

const openCollegeModal = (college) => {
  modalFields.name.textContent = college.name;
  const location = `${college.city}, ${college.state}`;
  modalFields.locationHeading.textContent = location;
  modalFields.location.textContent = location;
  modalFields.courseType.textContent = college.courses.join(', ');
  modalFields.courses.textContent = college.courses.join(', ');
  modalFields.category.textContent = college.category;
  modalFields.fees.textContent = college.fees;
  modalFields.eligibility.textContent = college.eligibility;
  modalFields.admissionStatus.textContent = college.admissionStatus;
  modalFields.admissionStatus.className = `admission-status ${getAdmissionStatusClass(college.admissionStatus)}`;
  modalFields.description.textContent = college.description;
  modalApplyButton.dataset.applicationUrl = college.applicationUrl || '';
  modalApplyMessage.hidden = true;
  modalApplyMessage.textContent = '';
  collegeModal.hidden = false;
  document.body.classList.add('modal-open');
};

const createCollegeCard = (college) => {
  const card = document.createElement('article');
  card.className = 'college-card';
  card.innerHTML = `<h3>${college.name}</h3><dl class="college-info"><div><dt>Location</dt><dd>${college.city}, ${college.state}</dd></div><div><dt>Course type</dt><dd>${college.courses.join(', ')}</dd></div><div><dt>Fees range</dt><dd>${college.fees}</dd></div></dl><button class="view-details" type="button">View Details</button>`;
  card.querySelector('.view-details').addEventListener('click', () => openCollegeModal(college));
  return card;
};

const renderCollegeCards = (visibleColleges) => {
  collegeGrid.querySelectorAll('.college-card').forEach((card) => card.remove());
  visibleColleges.forEach((college) => collegeGrid.insertBefore(createCollegeCard(college), noResultsMessage));
};

const populateFilterOptions = () => {
  const filters = [[filterForm.elements.location, 'state', 'All Locations'], [filterForm.elements['course-type'], 'courses', 'All Courses'], [filterForm.elements.category, 'category', 'All College Types']];
  filters.forEach(([select, field, label]) => {
    select.replaceChildren(new Option(label, ''));
    const values = colleges.flatMap((college) => Array.isArray(college[field]) ? college[field] : [college[field]]);
    [...new Set(values)].sort().forEach((value) => select.add(new Option(value, value)));
  });
};

const updateVisibleCards = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedLocation = filterForm.elements.location.value;
  const selectedCourseType = filterForm.elements['course-type'].value;
  const selectedCategory = filterForm.elements.category.value;
  const selectedFeesRange = filterForm.elements['fees-range'].value;
  const visibleColleges = colleges.filter((college) => {
    const searchableText = [college.name, college.city, college.state, ...college.courses].join(' ').toLowerCase();
    return (!searchTerm || searchableText.includes(searchTerm)) && (!selectedLocation || [college.city, college.state].includes(selectedLocation)) && (!selectedCourseType || college.courses.includes(selectedCourseType)) && (!selectedCategory || college.category === selectedCategory) && (!selectedFeesRange || college.feesRange === selectedFeesRange);
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
const profileFields = {
  name: document.querySelector('#profile-name'),
  email: document.querySelector('#profile-email'),
  mobile: document.querySelector('#profile-mobile')
};
const showSignupButton = document.querySelector('#show-signup');
const showLoginButton = document.querySelector('#show-login');
const logoutButton = document.querySelector('#logout-button');
const demoProfileKey = 'admissionSaathiDemoProfile';
const demoSessionKey = 'admissionSaathiDemoSession';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobilePattern = /^[6-9]\d{9}$/;

const getStoredProfile = () => {
  try {
    return JSON.parse(localStorage.getItem(demoProfileKey));
  } catch {
    return null;
  }
};

const getCurrentProfile = () => {
  const profile = getStoredProfile();
  const sessionIdentifier = localStorage.getItem(demoSessionKey);
  if (!profile || !sessionIdentifier || ![profile.email, profile.mobile].includes(sessionIdentifier)) return null;
  return profile;
};

const setMessage = (element, message, isSuccess = false) => {
  element.textContent = message;
  element.classList.toggle('success', isSuccess);
};

const clearFormMessages = (form) => {
  form.querySelectorAll('.field-error').forEach((field) => { field.textContent = ''; });
  setMessage(form.querySelector('.form-message'), '');
};

const setAccountModalState = (state) => {
  const isSignup = state === 'signup';
  loginState.hidden = isSignup;
  signupState.hidden = !isSignup;
  clearFormMessages(isSignup ? signupForm : loginForm);
};

const openAccountModal = (state = 'login') => {
  setAccountModalState(state);
  accountModal.hidden = false;
  document.body.classList.add('modal-open');
  (state === 'signup' ? signupForm : loginForm).querySelector('input').focus();
};

const closeAccountModal = () => {
  accountModal.hidden = true;
  if (profileModal.hidden && collegeModal.hidden) document.body.classList.remove('modal-open');
};

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
  if (applicationUrl) {
    window.open(applicationUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  modalApplyMessage.textContent = 'Application details will be available here soon.';
  modalApplyMessage.hidden = false;
});
collegeModal.addEventListener('click', (event) => { if (event.target === collegeModal) closeCollegeModal(); });
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!collegeModal.hidden) closeCollegeModal();
  else if (!accountModal.hidden) closeAccountModal();
  else if (!profileModal.hidden) closeProfileModal();
});

populateFilterOptions();
updateVisibleCards();
updateAccountButton();