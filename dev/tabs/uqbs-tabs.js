(function () {
  function initUQTabs() {
    const tabContainers = document.querySelectorAll('.uqbs-tab-container');

    tabContainers.forEach(container => {
      const tabs = container.querySelectorAll('.uqbs-tab');
      const panels = container.querySelectorAll('.uqbs-tab-content');
      const indicator = container.querySelector('.uqbs-tab-indicator');

      // Ensure one tab is active
      let hasActiveTab = false;
      tabs.forEach(tab => {
        if (tab.getAttribute('aria-selected') === 'true') {
          hasActiveTab = true;
        }
      });

      if (!hasActiveTab && tabs.length > 0) {
        tabs[0].setAttribute('aria-selected', 'true');
        tabs[0].setAttribute('tabindex', '0');
        const firstPanelId = tabs[0].getAttribute('aria-controls');
        const firstPanel = container.querySelector('#' + firstPanelId);
        if (firstPanel) {
          firstPanel.setAttribute('aria-hidden', 'false');
        }
      }

      function animateIndicator(tab) {
        if (!indicator) return;
        indicator.style.transition = "none";
        indicator.style.transform = "scaleX(0)";
        indicator.style.width = `${tab.offsetWidth}px`;
        indicator.style.left = `${tab.offsetLeft}px`;
        void indicator.offsetWidth; // force reflow
        indicator.style.transition = "transform 0.4s ease, width 0s ease 0.4s";
        indicator.style.transform = "scaleX(1)";
      }

      function activateTab(tab) {
        const targetPanelId = tab.getAttribute('aria-controls');
        const targetPanel = document.getElementById(targetPanelId);

        tabs.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('tabindex', '-1');
        });

        panels.forEach(p => {
          p.setAttribute('aria-hidden', 'true');
        });

        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');
        if (targetPanel) {
          targetPanel.setAttribute('aria-hidden', 'false');
        }

        animateIndicator(tab);
        tab.focus();
      }

      // Add click & keyboard listeners
      tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
          activateTab(this);
        });

        tab.addEventListener('keydown', function (e) {
          let newIndex = index;

          if (e.key === 'ArrowRight') {
            newIndex = (index + 1) % tabs.length;
          } else if (e.key === 'ArrowLeft') {
            newIndex = (index - 1 + tabs.length) % tabs.length;
          } else if (e.key === 'Home') {
            newIndex = 0;
          } else if (e.key === 'End') {
            newIndex = tabs.length - 1;
          } else {
            return;
          }

          tabs[newIndex].click();
          e.preventDefault();
        });
      });

      // Initial indicator setup
        let hasInitialised = false;

  function safeInit() {
    if (!hasInitialised) {
      initUQTabs();
      hasInitialised = true;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', safeInit);
  } else {
    safeInit();
  }

  // For LMS compatibility (e.g. Blackboard Ultra), fallback delayed attempt
  setTimeout(safeInit, 500);
})();
