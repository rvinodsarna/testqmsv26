// dean-sidebar-fix.js — v26.0
// Ensures the "Dean Analytics" item exists in the sidebar, even if app.js
// didn't add it (e.g. non-dean roles, or a custom sidebar build).

(function () {
  "use strict";

  console.log("[Dean Sidebar] Loading…");

  function addItem() {
    const sidebar =
      document.querySelector(".sidebar .sidebar-inner") ||
      document.querySelector(".sidebar-inner") ||
      document.querySelector(".sidebar");

    if (!sidebar) {
      console.warn("[Dean Sidebar] Sidebar not found");
      return;
    }

    // Already present → nothing to do.
    if (sidebar.querySelector('[data-section="dean-dashboard"]')) {
      console.log("[Dean Sidebar] Item already present");
      return;
    }

    // Find the section that holds the nav items so we insert in the right place.
    const section = sidebar.querySelector(".sidebar-section") || sidebar;

    // Match app.js's markup exactly so styling is consistent.
    // app.js buildSidebar() outputs:
    //   <div class="sidebar-item" data-section="X" onclick="...">
    //     <span class="si-icon">ICON</span><span>LABEL</span>
    //   </div>
    const item = document.createElement("div");
    item.className = "sidebar-item";
    item.dataset.section = "dean-dashboard";
    item.setAttribute(
      "onclick",
      "closeSidebar();" +
      "(typeof navigate==='function'?navigate('dean-dashboard'):" +
      "(typeof mountDeanDashboard==='function'&&mountDeanDashboard()));"
    );
    item.innerHTML =
      '<span class="si-icon">📈</span><span>Dean Analytics</span>';

    // Insert before the "Logout" section if one exists; otherwise append.
    const logout = section.querySelector('[onclick*="logout"]');
    if (logout && logout.parentElement) {
      logout.parentElement.insertBefore(item, logout);
    } else {
      section.appendChild(item);
    }

    console.log("[Dean Sidebar] Item added");
  }

  // Wait until the sidebar actually exists AND the user is signed in.
  function wait() {
    const start = Date.now();
    const t = setInterval(() => {
      const ready = window.QMS && window.QMS.state && window.QMS.state.user;
      const sidebar = document.querySelector(".sidebar");
      if (ready && sidebar) {
        clearInterval(t);
        addItem();
      } else if (Date.now() - start > 8000) {
        clearInterval(t);
        console.warn("[Dean Sidebar] Timed out waiting for sidebar");
      }
    }, 150);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wait);
  } else {
    wait();
  }
})();
