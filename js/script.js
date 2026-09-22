const filterForm = document.querySelector('#college-filters');
const collegeCards = document.querySelectorAll('.college-card');

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();

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