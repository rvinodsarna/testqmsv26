// dean-dashboard-fix.js - v26.0 FIXED VERSION
// Displays deepseek_html_20260903_2bc3d2.html in the main frame

(function() {
  'use strict';

  console.log('[Dean Dashboard v26.0] Script loading...');

  // Wait for DOM and QMS to be ready
  function init() {
    if (typeof window.mountDeanDashboard === 'function') {
      console.log('[Dean Dashboard v26.0] Already defined, skipping');
      return;
    }

    // Define the mount function
    window.mountDeanDashboard = function() {
      const main = document.getElementById('main-content');
      if (!main) {
        console.error('[Dean Dashboard v26.0] main-content not found');
        return;
      }

      console.log('[Dean Dashboard v26.0] Loading deepseek HTML...');

      // Load deepseek_html_20260903_2bc3d2.html in iframe
      main.innerHTML = `
        <div class="dean-dashboard-container" style="width:100%;height:100%;min-height:calc(100vh - 120px);background:#fff;">
          <iframe 
            id="dean-dashboard-iframe"
            src="./deepseek_html_20260903_2bc3d2.html" 
            style="width:100%;height:100%;border:none;display:block;"
            title="Dean Analytics Dashboard"
            sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
          ></iframe>
        </div>
      `;

      // Monitor iframe load
      const iframe = document.getElementById('dean-dashboard-iframe');
      if (iframe) {
        iframe.addEventListener('load', function() {
          console.log('[Dean Dashboard v26.0] Deepseek HTML loaded successfully');
        });

        iframe.addEventListener('error', function() {
          console.error('[Dean Dashboard v26.0] Iframe failed to load');
        });
      }
    };

    console.log('[Dean Dashboard v26.0] mountDeanDashboard function defined');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[Dean Dashboard v26.0] Loaded successfully');
})();
 
// dean-dashboard-fix.js - FIXED VERSION
(function() {
  'use strict';
  console.log('[Dean Dashboard Fix] Script loading...');

  function init() {
    if (typeof window.mountDeanDashboard === 'function') {
      console.log('[Dean Dashboard Fix] Already defined, skipping');
      return;
    }

    window.mountDeanDashboard = function() {
      const main = document.getElementById('main-content');
      if (!main) {
        console.error('[Dean Dashboard] main-content not found');
        return;
      }

      console.log('[Dean Dashboard] Mounting iframe...');
      main.innerHTML = `
        <div class="dean-dashboard-container" style="width:100%;height:100%;min-height:calc(100vh - 120px);">
          <iframe 
            id="dean-dashboard-iframe"
            src="/qms.html" 
            style="width:100%;height:100%;border:none;display:block;"
            title="Dean Analytics Dashboard"
            sandbox="allow-scripts allow-same-origin allow-forms"
          ></iframe>
        </div>
      `;

      const iframe = document.getElementById('dean-dashboard-iframe');
      if (iframe) {
        iframe.addEventListener('load', () => console.log('[Dean Dashboard] Iframe loaded'));
        iframe.addEventListener('error', () => console.error('[Dean Dashboard] Iframe error'));
      }
    };

    console.log('[Dean Dashboard Fix] Function defined');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  console.log('[Dean Dashboard Fix] Loaded successfully');
})();
