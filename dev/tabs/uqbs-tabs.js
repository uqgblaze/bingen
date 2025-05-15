  const tabs = document.querySelectorAll('[role="tab"]');
  const tabList = document.querySelector('[role="tablist"]');
  const indicator = document.querySelector('.uqbs-tab-indicator');

  function adjustTabContainerHeight() {
    const container = document.querySelector('.uqbs-tab-container');
    const panels = document.querySelectorAll('.uqbs-tab-content');

    container.style.minHeight = 'auto';
    let maxHeight = 0;

    panels.forEach(panel => {
      const wasHidden = panel.getAttribute('aria-hidden') === 'true';

      if (wasHidden) {
        panel.style.display = 'block';
        panel.style.visibility = 'hidden';
        panel.style.position = 'absolute';
      }

      const height = panel.offsetHeight;
      if (height > maxHeight) maxHeight = height;

      if (wasHidden) {
        panel.style.display = '';
        panel.style.visibility = '';
        panel.style.position = '';
      }
    });

    container.style.minHeight = (maxHeight + 80) + 'px'; // buffer for padding
  }

  function activateTab(tab) {
    tabs.forEach(t => {
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    });

    document.querySelectorAll('.uqbs-tab-content').forEach(panel => {
      panel.setAttribute("aria-hidden", "true");
    });

    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");
    tab.focus();

    const newPanel = document.getElementById(tab.getAttribute("aria-controls"));
    newPanel.setAttribute("aria-hidden", "false");

    // Animate indicator
    indicator.style.transition = "none";
    indicator.style.transform = "scaleX(0)";
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.left = `${tab.offsetLeft}px`;
    void indicator.offsetWidth; // force reflow
    indicator.style.transition = "transform 0.4s ease, width 0s ease 0.4s";
    indicator.style.transform = "scaleX(1)";

    // Adjust height to tallest panel
    adjustTabContainerHeight();
  }

  tabList.addEventListener("keydown", (e) => {
    const key = e.key;
    const currentTab = document.activeElement;
    const tabArray = Array.from(tabs);
    const currentIndex = tabArray.indexOf(currentTab);
    let newIndex;

    if (key === "ArrowRight") {
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (key === "ArrowLeft") {
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (key === "Home") {
      newIndex = 0;
    } else if (key === "End") {
      newIndex = tabs.length - 1;
    }

    if (newIndex !== undefined) {
      activateTab(tabs[newIndex]);
    }
  });

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activateTab(tab));
  });

  // Initial load
  const defaultTab = document.querySelector('[aria-selected="true"]');
  if (defaultTab) {
    activateTab(defaultTab);
    adjustTabContainerHeight();
  }
