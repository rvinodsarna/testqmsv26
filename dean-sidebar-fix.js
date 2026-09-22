// QMS RISE v26.0 — Dean Sidebar Fix (Enhanced)
(function() {
  "use strict";

  const DEAN_SIDEBAR_CONFIG = {
    ITEM_LABEL: "Dean Analytics",
    ITEM_ICON: "📈",
    TARGET_URL: "/qms-no-login.html"
  };

  function init() {
    console.log('[Dean Sidebar] Initializing...');

    // Wait for sidebar to render
    waitForSidebar();
  }

  function waitForSidebar(retries = 0) {
    if (retries >= DEAN_SIDEBAR_CONFIG.MAX_RETRIES) {
      console.warn('[Dean Sidebar] Sidebar not found');
      return;
    }

    const sidebar = document.querySelector('.sidebar') || 
                    document.querySelector('nav') ||
                    document.querySelector('[class*="sidebar"]');

    if (sidebar) {
      updateSidebarMenu(sidebar);
    } else {
      setTimeout(() => waitForSidebar(retries + 1), 500);
    }
  }

  function updateSidebarMenu(sidebar) {
    console.log('[Dean Sidebar] Updating menu...');

    // Find or create Dean menu item
    let deanItem = sidebar.querySelector('[href*="qms-no-login"], [href*="dean"]');

    if (!deanItem) {
      // Create new menu item
      deanItem = document.createElement('a');
      deanItem.href = DEAN_SIDEBAR_CONFIG.TARGET_URL;
      deanItem.className = 'menu-item';
      deanItem.innerHTML = `
        <span class="menu-icon">${DEAN_SIDEBAR_CONFIG.ITEM_ICON}</span>
        <span class="menu-label">${DEAN_SIDEBAR_CONFIG.ITEM_LABEL}</span>
      `;

      // Insert at top of menu
      const menu = sidebar.querySelector('.menu') || sidebar;
      const firstItem = menu.querySelector('.menu-item');
      if (firstItem) {
        menu.insertBefore(deanItem, firstItem);
      } else {
        menu.appendChild(deanItem);
      }

      console.log('[Dean Sidebar] Menu item created');
    } else {
      // Update existing item
      deanItem.href = DEAN_SIDEBAR_CONFIG.TARGET_URL;
      console.log('[Dean Sidebar] Menu item updated');
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[Dean Sidebar] Fix loaded');
})();
