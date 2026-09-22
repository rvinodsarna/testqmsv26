// QMS RISE v26.0 — Logout Video Overlay
(function() {
  "use strict";

  const LOGOUT_VIDEO_CONFIG = {
    VIDEO_SRC: "./rise-qms-logo2.mp4",
    OVERLAY_ID: "logout-video-overlay",
    VIDEO_ID: "logout-video",
    SKIP_BTN_ID: "logout-video-skip-btn",
    AUTO_SKIP_MS: 5000
  };

  // Create overlay HTML
  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = LOGOUT_VIDEO_CONFIG.OVERLAY_ID;
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #000;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
    `;

    overlay.innerHTML = `
      <video 
        id="${LOGOUT_VIDEO_CONFIG.VIDEO_ID}" 
        src="${LOGOUT_VIDEO_CONFIG.VIDEO_SRC}"
        autoplay
        playsinline
        style="max-width: 100%; max-height: 100%;"
      ></video>
      <button 
        id="${LOGOUT_VIDEO_CONFIG.SKIP_BTN_ID}"
        style="
          position: absolute;
          bottom: 40px;
          right: 40px;
          padding: 12px 24px;
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s;
        "
      >
        SKIP
      </button>
    `;

    document.body.appendChild(overlay);
    return overlay;
  }

  // Play logout video
  window.__playLogoutVideoOverlay = function(callback) {
    console.log('[Logout Video] Starting...');

    let overlay = document.getElementById(LOGOUT_VIDEO_CONFIG.OVERLAY_ID);
    if (!overlay) {
      overlay = createOverlay();
    }

    const video = document.getElementById(LOGOUT_VIDEO_CONFIG.VIDEO_ID);
    const skipBtn = document.getElementById(LOGOUT_VIDEO_CONFIG.SKIP_BTN_ID);

    if (!video) {
      console.error('[Logout Video] Video element not found');
      if (callback) callback();
      return;
    }

    // Show overlay
    overlay.style.display = 'flex';

    // Play video
    video.play().catch(err => {
      console.error('[Logout Video] Play error:', err);
      if (callback) callback();
    });

    // Auto-skip after video ends or timeout
    const endHandler = () => {
      console.log('[Logout Video] Ended');
      overlay.style.display = 'none';
      video.pause();
      if (callback) callback();
    };

    video.onended = endHandler;

    // Fallback timeout
    setTimeout(endHandler, 10000);

    // Skip button
    skipBtn.onclick = () => {
      console.log('[Logout Video] Skipped');
      overlay.style.display = 'none';
      video.pause();
      if (callback) callback();
    };
  };

  // Override default logout to play video first
  window.__originalLogout = window.logout || window.handleLogout || null;

  window.logout = function() {
    console.log('[Logout] Intercepted - playing video first');
    
    if (window.__playLogoutVideoOverlay) {
      window.__playLogoutVideoOverlay(() => {
        console.log('[Logout] Video complete, proceeding...');
        if (window.__originalLogout) {
          window.__originalLogout();
        } else {
          // Fallback: clear session and redirect
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/';
        }
      });
    } else {
      if (window.__originalLogout) {
        window.__originalLogout();
      } else {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }
    }
  };

  console.log('[Logout Video] Initialized');
})();
