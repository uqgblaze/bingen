// Hide preloader once the page has fully loaded
window.addEventListener('load', function() {
  document.getElementById('preloader').style.display = 'none';
});

// Tab switching for the left sidebar remains unchanged.
const tabLinks = document.querySelectorAll('.block-types li');
const tabContents = document.querySelectorAll('.preview-content');

tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Remove 'active' class from all list items
    tabLinks.forEach(item => item.classList.remove('active'));
    // Mark clicked tab as active
    link.classList.add('active');
    
    // Hide all preview content panels
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Show target preview content
    const targetId = link.getAttribute('data-target');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});

// Global variables for user settings
let courseCode = '';
let apiKey = '';

// Function to update the iframe URL with query parameters
function loadContent(url) {
  let fullUrl = url;
  const params = [];
  if (courseCode) params.push('course=' + encodeURIComponent(courseCode));
  if (apiKey) params.push('key=' + encodeURIComponent(apiKey));
  if (params.length) {
    fullUrl += (url.includes('?') ? '&' : '?') + params.join('&');
  }
  // Update the iframe's src attribute
  document.getElementById('content-frame').src = fullUrl;
}

// Instead of attaching the URL-loading event to the tab list items,
// we attach click listeners to the cards (or their child elements) that have a data-url.
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    // Check if the card itself has a data-url attribute
    let url = card.getAttribute('data-url');
    // If not, look for the first child element with a data-url attribute
    if (!url) {
      const childWithUrl = card.querySelector('[data-url]');
      if (childWithUrl) {
        url = childWithUrl.getAttribute('data-url');
      }
    }
    if (url) {
      loadContent(url);
    }
  });
});

// Modal logic for settings
const openSettingsBtn = document.getElementById('open-settings');
const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.getElementById('modal-overlay');
const settingsForm = document.getElementById('settings-form');

// Open modal when gear icon is clicked
openSettingsBtn.addEventListener('click', () => {
  modalOverlay.classList.remove('hidden');
});

// Close modal when the close button is clicked
closeModalBtn.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

// Close modal if clicking outside the modal content
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
});

// Save settings from the modal and update the iframe (if needed)
settingsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  courseCode = document.getElementById('course-code').value;
  apiKey = document.getElementById('api-key').value;
  
  // Close the modal
  modalOverlay.classList.add('hidden');

  // Optionally, update the current iframe content if a card was previously clicked.
});
