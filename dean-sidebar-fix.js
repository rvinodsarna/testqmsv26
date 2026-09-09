// dean-sidebar-fix.js - FIXED VERSION
(function() {
  'use strict';
  console.log('[Dean Sidebar Fix] Script loading...');

  function init() {
    const checkInterval = setInterval(function() {
      if (typeof window.QMS !== 'undefined' && window.QMS.state) {
        clearInterval(checkInterval);
        addDeanSidebarItem();
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
      console.warn('[Dean Sidebar Fix] QMS not found after 5s');
    }, 5000);
  }

  function addDeanSidebarItem() {
    console.log('[Dean Sidebar Fix] Adding menu item...');

    if (typeof window.NAV_TITLES !== 'undefined') {
      window.NAV_TITLES['dean-dashboard'] = '📊 Dean Analytics';
      console.log('[Dean Sidebar Fix] Added to NAV_TITLES');
    }

    const sidebar = document.querySelector('.sidebar-nav') || document.querySelector('.sidebar');
    if (sidebar) {
      const existingItem = sidebar.querySelector('[data-section="dean-dashboard"]');
      if (!existingItem) {
        const deanItem = document.createElement('div');
        deanItem.className = 'sidebar-item';
        deanItem.dataset.section = 'dean-dashboard';
        deanItem.innerHTML = '<span class="sidebar-icon">📊</span><span class="sidebar-label">Dean Analytics</span>';
        deanItem.addEventListener('click', function() {
          console.log('[Dean Sidebar] Clicked');
          if (typeof window.navigate === 'function') {
            window.navigate('dean-dashboard');
          } else if (typeof window.mountDeanDashboard === 'function') {
            window.mountDeanDashboard();
          }
        });
        sidebar.appendChild(deanItem);
        console.log('[Dean Sidebar Fix] Menu item added');
      } else {
        console.log('[Dean Sidebar Fix] Already exists');
      }
    } else {
      console.warn('[Dean Sidebar Fix] Sidebar not found');
    }

    console.log('[Dean Sidebar Fix] Complete');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[Dean Sidebar Fix] Loaded successfully');
})();
