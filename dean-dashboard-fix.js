// dean-dashboard-fix.js — v26.0
// Renders the Dean Analytics page inside the main content frame.
// app.js already routes "dean-dashboard" to mountDeanDashboard(),
// so we just override that function with our iframe version.

(function () {
  "use strict";

  // Change this to whichever page you want the Dean Analytics tab to load.
  //   "./qms.html"                              → Dean Command Center
  //   "./deepseek_html_20260903_2bc3d2.html"    → Deepseek dashboard
  const DEAN_PAGE_URL = "./qms.html";

  console.log("[Dean Dashboard v26.0] Loading…");

  function mount() {
    const main = document.getElementById("main-content");
    if (!main) {
      console.error("[Dean Dashboard] #main-content not found");
      return;
    }

    console.log("[Dean Dashboard] Rendering iframe →", DEAN_PAGE_URL);

    main.innerHTML = `
      <div class="dean-dashboard-container"
           style="width:100%;min-height:calc(100vh - 120px);background:#05080f;">
        <iframe
          id="dean-dashboard-iframe"
          src="${DEAN_PAGE_URL}"
          title="Dean Analytics Dashboard"
          style="width:100%;height:calc(100vh - 120px);border:none;display:block;"
          sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"
        ></iframe>
      </div>
    `;

    const iframe = document.getElementById("dean-dashboard-iframe");
    if (iframe) {
      iframe.addEventListener("load", () => console.log("[Dean Dashboard] iframe loaded"));
      iframe.addEventListener("error", () => console.error("[Dean Dashboard] iframe failed"));
    }
  }

  // Override app.js's built-in mountDeanDashboard with our iframe version.
  // This must happen AFTER app.js has loaded — the script order in index.html
  // already guarantees that (app.js loads first, then this file).
  window.mountDeanDashboard = mount;

  console.log("[Dean Dashboard v26.0] Ready — mountDeanDashboard overridden");
})();
