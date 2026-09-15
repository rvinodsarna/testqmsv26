// QMS RISE v26.0 — Dean Sidebar Fix (Enhanced)
(function() {
  "use strict";

  const DEAN_SIDEBAR_CONFIG = {
    ITEM_LABEL: "Dean Analytics",
    ITEM_ICON: "📈",
    DATA_SECTION: "dean-dashboard",
    TIMEOUT_MS: 8000,
    CHECK_INTERVAL_MS: 150,
    REQUIRED_USER_ROLE: "dean"
  };

  function addItem() {
    console.log("[DeanSidebar] 🔍 Looking for sidebar...");

    const sidebar = 
      document.querySelector(".sidebar .sidebar-inner") ||
      document.querySelector(".sidebar-inner") ||
      document.querySelector(".sidebar");

    if (!sidebar) {
      console.warn("[DeanSidebar] ⚠️ Sidebar not found");
      return false;
    }

    if (sidebar.querySelector(`[data-section="${DEAN_SIDEBAR_CONFIG.DATA_SECTION}"]`)) {
      console.log("[DeanSidebar] ✅ Item already present");
      return true;
    }

    const userRole = window.QMS?.state?.user?.role;
    if (userRole && userRole.toLowerCase() !== DEAN_SIDEBAR_CONFIG.REQUIRED_USER_ROLE) {
      console.log("[DeanSidebar] ℹ️ User is not Dean, skipping");
      return true;
    }

    const section = sidebar.querySelector(".sidebar-section") || sidebar;

    const item = document.createElement("div");
    item.className = "sidebar-item";
    item.dataset.section = DEAN_SIDEBAR_CONFIG.DATA_SECTION;
    
    item.onclick = function() {
      if (typeof closeSidebar === "function") {
        closeSidebar();
      }
      if (typeof navigate === "function") {
        navigate(DEAN_SIDEBAR_CONFIG.DATA_SECTION);
      } else if (typeof mountDeanDashboard === "function") {
        mountDeanDashboard();
      } else {
        console.error("[DeanSidebar] ❌ No navigation function found");
      }
    };

    item.innerHTML = 
      `<span class="si-icon">${DEAN_SIDEBAR_CONFIG.ITEM_ICON}</span>` +
      `<span>${DEAN_SIDEBAR_CONFIG.ITEM_LABEL}</span>`;

    const logout = section.querySelector('[onclick*="logout"]') || 
                   section.querySelector('[data-section="logout"]');
    
    if (logout && logout.parentElement) {
      logout.parentElement.insertBefore(item, logout);
    } else {
      section.appendChild(item);
    }

    console.log("[DeanSidebar] ✅ Item added successfully");
    return true;
  }

  function waitForReady() {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      const configReady = window.QMS_CONFIG !== undefined;
      const sidebarExists = document.querySelector(".sidebar");
      const elapsed = Date.now() - startTime;

      if (configReady && sidebarExists) {
        clearInterval(checkInterval);
        addItem();
      } else if (elapsed > DEAN_SIDEBAR_CONFIG.TIMEOUT_MS) {
        clearInterval(checkInterval);
        console.warn("[DeanSidebar] ⏰ Timed out waiting for sidebar");
      }
    }, DEAN_SIDEBAR_CONFIG.CHECK_INTERVAL_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForReady);
  } else {
    waitForReady();
  }

  console.log("[DeanSidebar] 📦 Dean sidebar fix loaded");
})();
