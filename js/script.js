const colleges = [
  { name: 'Indian Institute of Technology Delhi', city: 'New Delhi', state: 'Delhi', course: 'Engineering', category: 'Public Institute', fees: '₹2.5L - ₹10L', feesRange: 'under-5', eligibility: '12th with PCM and JEE Advanced', admissionStatus: 'Applications open', description: 'A leading public institute offering undergraduate and postgraduate engineering programmes.', established: '1961', ranking: '#4 Engineering Institute in India', website: 'https://home.iitd.ac.in' },
  { name: 'Christian Medical College', city: 'Vellore', state: 'Tamil Nadu', course: 'Medical', category: 'Private College', fees: '₹5L - ₹25L', feesRange: '15-25', eligibility: '12th with PCB and NEET qualification', admissionStatus: 'Admissions opening soon', description: 'A respected medical college and teaching hospital with comprehensive healthcare programmes.', established: '1942', ranking: '#1 Medical College in India', website: 'https://www.cmch-vellore.edu' },
  { name: "St. Xavier's College", city: 'Mumbai', state: 'Maharashtra', course: 'Arts & Commerce', category: 'Autonomous College', fees: '₹45K - ₹1.5L', feesRange: 'under-5', eligibility: '12th from a recognised board', admissionStatus: 'Applications open', description: 'An autonomous college known for undergraduate arts, commerce, and science education.', established: '1869', ranking: 'Top 10 Arts Colleges in India', website: 'https://xaviers.ac' },
  { name: 'National Institute of Fashion Technology', city: 'Bengaluru', state: 'Karnataka', course: 'Design', category: 'Public Institute', fees: '₹3L - ₹12L', feesRange: '5-15', eligibility: '12th from a recognised board and NIFT entrance exam', admissionStatus: 'Entrance registration open', description: 'A specialised institute for fashion design, technology, management, and related creative fields.', established: '1986', ranking: 'Top 5 Design Institutes in India', website: 'https://www.nift.ac.in' },
  { name: 'Indian Institute of Management Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', course: 'Management', category: 'Public Institute', fees: '₹12L - ₹25L', feesRange: '15-25', eligibility: 'Graduation with CAT qualification', admissionStatus: 'Applications opening soon', description: 'A premier management institute offering postgraduate and doctoral business programmes.', established: '1961', ranking: '#1 Management Institute in India', website: 'https://www.iima.ac.in' },
  { name: 'Birla Institute of Technology and Science', city: 'Pilani', state: 'Rajasthan', course: 'Engineering', category: 'Private Institute', fees: '₹8L - ₹18L', feesRange: '5-15', eligibility: '12th with PCM and BITSAT qualification', admissionStatus: 'Applications open', description: 'A private deemed university with flexible, research-focused programmes in engineering and sciences.', established: '1964', ranking: 'Top 20 Engineering Institutes in India', website: 'https://www.bits-pilani.ac.in' }
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

const modalFields = {
  name: document.querySelector('#modal-college-name'), location: document.querySelector('#modal-location'), courseType: document.querySelector('#modal-course-type'), category: document.querySelector('#modal-category'), fees: document.querySelector('#modal-fees'), eligibility: document.querySelector('#modal-eligibility'), established: document.querySelector('#modal-established'), ranking: document.querySelector('#modal-ranking'), admissionStatus: document.querySelector('#modal-admission-status'), description: document.querySelector('#modal-description'), website: document.querySelector('#modal-website')
};

const openCollegeModal = (college) => {
  modalFields.name.textContent = college.name;
  modalFields.location.textContent = `${college.city}, ${college.state}`;
  modalFields.courseType.textContent = college.course;
  modalFields.category.textContent = college.category;
  modalFields.fees.textContent = college.fees;
  modalFields.eligibility.textContent = college.eligibility;
  modalFields.established.textContent = college.established;
  modalFields.ranking.textContent = college.ranking;
  modalFields.admissionStatus.textContent = college.admissionStatus;
  modalFields.description.textContent = college.description;
  modalFields.website.textContent = college.website;
  modalFields.website.href = college.website;
  collegeModal.hidden = false;
};

const createCollegeCard = (college, index) => {
  const card = document.createElement('article');
  card.className = 'college-card';
  card.dataset.index = index;
  card.innerHTML = `<h3>${college.name}</h3><dl class="college-info"><div><dt>Location</dt><dd>${college.city}, ${college.state}</dd></div><div><dt>Course type</dt><dd>${college.course}</dd></div><div><dt>Fees range</dt><dd>${college.fees}</dd></div></dl><button class="view-details" type="button">View Details</button>`;
  card.querySelector('.view-details').addEventListener('click', () => openCollegeModal(college));
  return card;
};

const renderCollegeCards = () => {
  collegeGrid.querySelectorAll('.college-card').forEach((card) => card.remove());
  colleges.forEach((college, index) => collegeGrid.insertBefore(createCollegeCard(college, index), noResultsMessage));
};

const populateFilterOptions = () => {
  const filters = [[filterForm.elements.location, 'state', 'All Locations'], [filterForm.elements['course-type'], 'course', 'All Courses'], [filterForm.elements.category, 'category', 'All College Types']];
  filters.forEach(([select, field, label]) => {
    select.replaceChildren(new Option(label, ''));
    [...new Set(colleges.map((college) => college[field]))].sort().forEach((value) => select.add(new Option(value, value)));
  });
};

const updateVisibleCards = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedLocation = filterForm.elements.location.value;
  const selectedCourseType = filterForm.elements['course-type'].value;
  const selectedCategory = filterForm.elements.category.value;
  const selectedFeesRange = filterForm.elements['fees-range'].value;
  let visibleCardCount = 0;

  collegeGrid.querySelectorAll('.college-card').forEach((card) => {
    const college = colleges[card.dataset.index];
    const searchableText = [college.name, college.city, college.course].join(' ').toLowerCase();
    const isVisible = (!searchTerm || searchableText.includes(searchTerm)) && (!selectedLocation || college.state === selectedLocation) && (!selectedCourseType || college.course === selectedCourseType) && (!selectedCategory || college.category === selectedCategory) && (!selectedFeesRange || college.feesRange === selectedFeesRange);
    card.hidden = !isVisible;
    if (isVisible) visibleCardCount += 1;
  });
  noResultsMessage.hidden = visibleCardCount > 0;
};

applyFiltersButton.addEventListener('click', updateVisibleCards);
searchButton.addEventListener('click', updateVisibleCards);
searchForm.addEventListener('submit', (event) => { event.preventDefault(); updateVisibleCards(); });
homeSearchForm.addEventListener('submit', (event) => { event.preventDefault(); searchInput.value = homeSearchInput.value; updateVisibleCards(); document.querySelector('#college-filters').scrollIntoView({ behavior: 'smooth' }); });
filterForm.addEventListener('reset', () => { searchInput.value = ''; requestAnimationFrame(updateVisibleCards); });

const closeCollegeModal = () => { collegeModal.hidden = true; };
modalCloseButton.addEventListener('click', closeCollegeModal);
collegeModal.addEventListener('click', (event) => { if (event.target === collegeModal) closeCollegeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !collegeModal.hidden) closeCollegeModal(); });

renderCollegeCards();
populateFilterOptions();
updateVisibleCards();