/*
 * Dean dashboard routing fix.
 * The official Dean dashboard is qms-no-login.html.
 * It opens in the application's main frame when available.
 */
(function () {
  'use strict';

  const DEAN_DASHBOARD_CONFIG = {
    TARGET_PATH: '/qms-no-login.html',
    DELAY_MS: 1000,
    MAX_RETRIES: 3
  };

  function openDeanDashboard() {
    console.log('[Dean Dashboard] Initializing...');

    // Check if we're already on the dashboard
    if (window.location.pathname.includes('qms-no-login.html')) {
      console.log('[Dean Dashboard] Already on dashboard');
      return;
    }

    // Try to open in main frame
    if (window.top !== window.self) {
      // We're in an iframe, try to redirect parent
      try {
        window.top.location.href = DEAN_DASHBOARD_CONFIG.TARGET_PATH;
        return;
      } catch (e) {
        console.warn('[Dean Dashboard] Cannot access parent frame');
      }
    }

    // Fallback: redirect current window
    setTimeout(() => {
      window.location.href = DEAN_DASHBOARD_CONFIG.TARGET_PATH;
    }, DEAN_DASHBOARD_CONFIG.DELAY_MS);
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', openDeanDashboard);
  } else {
    openDeanDashboard();
  }

  console.log('[Dean Dashboard] Fix loaded');
})();
