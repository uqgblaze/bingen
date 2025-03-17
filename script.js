// JavaScript Document
// Select all the list items in the sidebar
const tabLinks = document.querySelectorAll('.block-types li');
// Select all the preview content divs
const tabContents = document.querySelectorAll('.preview-content');

tabLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Remove 'active' class from all links
    tabLinks.forEach(item => item.classList.remove('active'));
    // Add 'active' class to the clicked link
    link.classList.add('active');
    
    // Hide all preview content
    tabContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Show the target content
    const targetId = link.getAttribute('data-target');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});
// Javascript to hide preloader when fully loaded
window.addEventListener("load", function () {
    // Hide preloader
    document.getElementById("preloader").style.display = "none";
    
    // Show main content
    document.getElementById("content").style.display = "block";
});
