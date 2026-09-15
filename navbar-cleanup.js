// QMS RISE v26.0 — Secure Navbar Cleanup
(function() {
  "use strict";

  const CLEANUP_CONFIG = {
    DELAY_MS: 1500,
    MAX_RETRIES: 3,
    RETRY_INTERVAL_MS: 500,
    ALLOWED_NAV_ITEMS: ["security", "live feed", "profile", "messages", "logout"],
    REMOVED_PATTERNS: ["socdt", "school of computing", "dashboard", "analytics", "documents"]
  };

  function sanitizeText(text) {
    return (text || "").toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
  }

  function shouldRemove(text) {
    const sanitized = sanitizeText(text);
    return CLEANUP_CONFIG.REMOVED_PATTERNS.some(pattern => 
      sanitized.includes(pattern) && !CLEANUP_CONFIG.ALLOWED_NAV_ITEMS.some(allowed => 
        sanitized.includes(allowed)
      )
    );
  }

  function cleanNavbar() {
    console.log("[NavbarCleanup] 🧹 Starting navbar cleanup...");

    const navbar = document.getElementById("navbar");
    if (!navbar) {
      console.warn("[NavbarCleanup] ⚠️ No navbar found, will retry...");
      return false;
    }

    let removedCount = 0;

    navbar.querySelectorAll(".so-csi-badge, .hero-eyebrow, .badge-text, .dean-eyebrow, .hero, .page-header").forEach(element => {
      const text = element.textContent || "";
      if (shouldRemove(text)) {
        console.log("[NavbarCleanup] ✅ Removed:", text.substring(0, 40).trim());
        element.remove();
        removedCount++;
      }
    });

    navbar.querySelectorAll(".nav-item, .nav-link, a[href]").forEach(item => {
      const text = item.textContent || "";
      const href = item.getAttribute("href") || "";
      
      const isAllowed = CLEANUP_CONFIG.ALLOWED_NAV_ITEMS.some(allowed => 
        sanitizeText(text).includes(allowed) || href.includes(allowed)
      );

      if (!isAllowed && shouldRemove(text)) {
        console.log("[NavbarCleanup] ✅ Removed nav item:", text.trim());
        item.remove();
        removedCount++;
      }
    });

    console.log("[NavbarCleanup] ✅ Cleanup complete! Removed", removedCount, "elements");
    return true;
  }

  function cleanupWithRetry(retries = 0) {
    if (retries >= CLEANUP_CONFIG.MAX_RETRIES) {
      console.error("[NavbarCleanup] ❌ Max retries reached, giving up");
      return;
    }

    const success = cleanNavbar();
    
    if (!success) {
      console.log("[NavbarCleanup] ⏳ Retry", retries + 1, "in", CLEANUP_CONFIG.RETRY_INTERVAL_MS, "ms");
      setTimeout(() => cleanupWithRetry(retries + 1), CLEANUP_CONFIG.RETRY_INTERVAL_MS);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => cleanupWithRetry(), CLEANUP_CONFIG.DELAY_MS);
    });
  } else {
    setTimeout(() => cleanupWithRetry(), CLEANUP_CONFIG.DELAY_MS);
  }

  console.log("[NavbarCleanup] 🚦 Navbar cleanup script loaded");
})();
