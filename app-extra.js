// QMS RISE v26.0 — Enhanced App Extra (Complete)
(function() {
  "use strict";

  // Utility functions
  window.AppUtils = window.AppUtils || {};

  // Format date
  AppUtils.formatDate = function(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  AppUtils.formatTime = function(date) {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show notification
  AppUtils.notify = function(message, type = 'info') {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${colors[type] || colors.info};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  // Confirm dialog
  AppUtils.confirm = function(message) {
    return new Promise((resolve) => {
      if (window.confirm(message)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  // Loading spinner
  AppUtils.showLoading = function(container) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    `;
    spinner.innerHTML = '<div class="spinner">Loading...</div>';
    container.appendChild(spinner);
    return spinner;
  };

  AppUtils.hideLoading = function(spinner) {
    if (spinner && spinner.parentNode) {
      spinner.remove();
    }
  };

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
      from {
        transform: translateX(400px);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Enhanced button effects
  document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn, button').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        `;
        
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  });

  // Add ripple animation
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);

  console.log('[App Extra] Enhanced utilities loaded');
})();
