const filterForm = document.querySelector('#college-filters');
const collegeCards = document.querySelectorAll('.college-card');
const applyFiltersButton = document.querySelector('.apply-filters');
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

applyFiltersButton.addEventListener('click', () => {
  const selectedLocation = filterForm.elements.location.value;
  const selectedCourseType = filterForm.elements['course-type'].value;

  collegeCards.forEach((card) => {
    const matchesLocation = !selectedLocation || card.dataset.location === selectedLocation;
    const matchesCourseType = !selectedCourseType || card.dataset.courseType === selectedCourseType;
    card.hidden = !(matchesLocation && matchesCourseType);
  });
});

filterForm.addEventListener('reset', () => {
  collegeCards.forEach((card) => {
    card.hidden = false;
  });
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