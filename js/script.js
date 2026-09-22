const filterForm = document.querySelector('#college-filters');
const collegeCards = document.querySelectorAll('.college-card');
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
  name: document.querySelector('#modal-college-name'),
  location: document.querySelector('#modal-location'),
  courseType: document.querySelector('#modal-course-type'),
  fees: document.querySelector('#modal-fees'),
  established: document.querySelector('#modal-established'),
  ranking: document.querySelector('#modal-ranking'),
  website: document.querySelector('#modal-website')
};

const updateVisibleCards = () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedLocation = filterForm.elements.location.value;
  const selectedCourseType = filterForm.elements['course-type'].value;
  const selectedFeesRange = filterForm.elements['fees-range'].value;
  let visibleCardCount = 0;

  collegeCards.forEach((card) => {
    const cardText = [
      card.querySelector('h3').textContent,
      card.dataset.location,
      card.dataset.courseType
    ].join(' ').toLowerCase();
    const matchesSearch = !searchTerm || cardText.includes(searchTerm);
    const matchesLocation = !selectedLocation || card.dataset.location === selectedLocation;
    const matchesCourseType = !selectedCourseType || card.dataset.courseType === selectedCourseType;
    const matchesFees = !selectedFeesRange || card.dataset.feesRange === selectedFeesRange;
    const isVisible = matchesSearch && matchesLocation && matchesCourseType && matchesFees;
    card.hidden = !isVisible;
    if (isVisible) {
      visibleCardCount += 1;
    }
  });

  noResultsMessage.hidden = visibleCardCount > 0;
};

applyFiltersButton.addEventListener('click', updateVisibleCards);
searchButton.addEventListener('click', updateVisibleCards);
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  updateVisibleCards();
});

homeSearchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchInput.value = homeSearchInput.value;
  searchButton.click();
  document.querySelector('#college-filters').scrollIntoView({ behavior: 'smooth' });
});

filterForm.addEventListener('reset', () => {
  searchInput.value = '';
  requestAnimationFrame(updateVisibleCards);
});

const closeCollegeModal = () => {
  collegeModal.hidden = true;
};

collegeCards.forEach((card) => {
  card.querySelector('.view-details').addEventListener('click', () => {
    const cardDetails = card.querySelectorAll('.college-info dd');

    modalFields.name.textContent = card.querySelector('h3').textContent;
    modalFields.location.textContent = cardDetails[0].textContent;
    modalFields.courseType.textContent = cardDetails[1].textContent;
    modalFields.fees.textContent = cardDetails[2].textContent;
    modalFields.established.textContent = card.dataset.established;
    modalFields.ranking.textContent = card.dataset.ranking;
    modalFields.website.textContent = card.dataset.website;
    modalFields.website.href = card.dataset.website;
    collegeModal.hidden = false;
  });
});

modalCloseButton.addEventListener('click', closeCollegeModal);

collegeModal.addEventListener('click', (event) => {
  if (event.target === collegeModal) {
    closeCollegeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !collegeModal.hidden) {
    closeCollegeModal();
  }
});