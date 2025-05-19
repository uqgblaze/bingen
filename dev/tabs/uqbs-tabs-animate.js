function animateIndicator(tab) {
  if (!indicator) return;
  indicator.style.transition = "none";
  indicator.style.transform = "scaleX(0)";
  indicator.style.width = `${tab.offsetWidth}px`;
  indicator.style.left = `${tab.offsetLeft}px`;
  void indicator.offsetWidth; // Force reflow
  indicator.style.transition = "transform 0.4s ease, width 0s ease 0.4s";
  indicator.style.transform = "scaleX(1)";
}
