/* ============================================================================
 * dean-rise-manager.js — RISE Points Management for Dean Dashboard
 * Allows Dean to: view, allocate, edit, and manage student RISE points
 * ============================================================================ */

(function() {
  'use strict';

  const RISE_MANAGER_CONFIG = {
    CATEGORIES: [
      { id: 'academic', name: 'Academic Excellence', icon: '📚', color: '#3b82f6' },
      { id: 'leadership', name: 'Leadership & Governance', icon: '👑', color: '#f59e0b' },
      { id: 'community', name: 'Community Service', icon: '🤝', color: '#10b981' },
      { id: 'sports', name: 'Sports & Wellness', icon: '⚽', color: '#ef4444' },
      { id: 'arts', name: 'Arts & Culture', icon: '🎨', color: '#8b5cf6' },
      { id: 'innovation', name: 'Innovation & Research', icon: '💡', color: '#06b6d4' },
      { id: 'professional', name: 'Professional Development', icon: '💼', color: '#ec4899' },
      { id: 'social', name: 'Social Impact', icon: '🌍', color: '#14b8a6' }
    ],
    POINT_VALUES: {
      minor: 5,
      standard: 10,
      major: 20,
      exceptional: 50
    }
  };

  // Create RISE Manager Button
  function createRiseManagerButton() {
    const container = document.querySelector('.dashboard-header') || 
                      document.querySelector('.content-header') ||
                      document.querySelector('header');
    
    if (!container) {
      console.warn('[RISE Manager] Container not found');
      return;
    }

    const btn = document.createElement('button');
    btn.id = 'rise-manager-btn';
    btn.className = 'btn btn-primary';
    btn.innerHTML = `
      <span style="font-size: 1.2em; margin-right: 0.5em;">🏆</span>
      <span>RISE Dashboard</span>
      <span style="font-size: 0.8em; opacity: 0.8; margin-left: 0.5em;">Manage Points</span>
    `;
    btn.style.cssText = `
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      margin-left: 1rem;
    `;
    btn.onmouseover = () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
    };
    btn.onmouseout = () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    };
    btn.onclick = openRiseManager;

    container.appendChild(btn);
    console.log('[RISE Manager] Button created');
  }

  // Open RISE Manager Modal
  function openRiseManager() {
    console.log('[RISE Manager] Opening...');

    const modal = document.createElement('div');
    modal.id = 'rise-manager-modal';
    modal.className = 'modal-overlay';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    `;

    modal.innerHTML = `
      <div class="modal modal-lg" style="max-width: 900px; max-height: 90vh; overflow: auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
        <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <h2 style="font-size: 1.5rem; color: white; margin: 0;">
            <span style="font-size: 1.8em; margin-right: 0.5em;">🏆</span>
            RISE Points Manager
          </h2>
          <button onclick="document.getElementById('rise-manager-modal').remove()" style="background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer; padding: 0.5rem;">
            ✕
          </button>
        </div>
        
        <div class="modal-body" style="padding: 2rem;">
          <!-- Search Student -->
          <div style="margin-bottom: 2rem;">
            <label style="display: block; color: #e2e8f0; font-weight: 600; margin-bottom: 0.5rem;">🔍 Search Student</label>
            <input type="text" id="rise-student-search" placeholder="Enter student ID or email..." 
              style="width: 100%; padding: 0.75rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); color: white; font-size: 14px;">
          </div>

          <!-- Student Info Card -->
          <div id="rise-student-info" style="display: none; background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; margin-bottom: 2rem; border: 1px solid rgba(255,255,255,0.1);">
            <h3 id="rise-student-name" style="color: white; margin: 0 0 0.5rem 0; font-size: 1.25rem;"></h3>
            <p id="rise-student-id" style="color: #94a3b8; margin: 0 0 1rem 0;"></p>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              <div style="background: rgba(102, 126, 234, 0.2); padding: 1rem; border-radius: 8px; min-width: 150px;">
                <div style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.25rem;">Total RISE Points</div>
                <div id="rise-total-points" style="color: #667eea; font-size: 2rem; font-weight: 700;">0</div>
              </div>
              <div style="background: rgba(16, 185, 129, 0.2); padding: 1rem; border-radius: 8px; min-width: 150px;">
                <div style="color: #94a3b8; font-size: 0.875rem; margin-bottom: 0.25rem;">Current Tier</div>
                <div id="rise-tier" style="color: #10b981; font-size: 1.5rem; font-weight: 700;">Bronze</div>
              </div>
            </div>
          </div>

          <!-- Categories Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
            ${RISE_MANAGER_CONFIG.CATEGORIES.map(cat => `
              <div class="rise-category-card" data-category="${cat.id}" style="
                background: rgba(255,255,255,0.05);
                border: 1px solid ${cat.color}40;
                border-radius: 12px;
                padding: 1.25rem;
                cursor: pointer;
                transition: all 0.3s ease;
              " onmouseover="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 20px ${cat.color}40';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                  <span style="font-size: 2rem;">${cat.icon}</span>
                  <div>
                    <div style="color: white; font-weight: 600; font-size: 0.95rem;">${cat.name}</div>
                    <div style="color: ${cat.color}; font-size: 0.875rem; font-weight: 600;">Current: <span id="points-${cat.id}">0</span> pts</div>
                  </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn-allocate" data-category="${cat.id}" style="
                    flex: 1;
                    padding: 0.5rem;
                    background: ${cat.color};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.875rem;
                    cursor: pointer;
                  ">Allocate Points</button>
                  <button class="btn-edit" data-category="${cat.id}" style="
                    padding: 0.5rem 0.75rem;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                  ">✏️</button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button onclick="document.getElementById('rise-manager-modal').remove()" style="
              padding: 0.75rem 1.5rem;
              background: rgba(255,255,255,0.1);
              color: white;
              border: 1px solid rgba(255,255,255,0.2);
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
            ">Close</button>
            <button onclick="saveRiseChanges()" style="
              padding: 0.75rem 1.5rem;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
            ">💾 Save Changes</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners
    modal.querySelectorAll('.btn-allocate').forEach(btn => {
      btn.onclick = (e) => allocatePoints(e.target.dataset.category);
    });

    modal.querySelectorAll('.btn-edit').forEach(btn => {
      btn.onclick = (e) => editPoints(e.target.dataset.category);
    });

    modal.querySelector('#rise-student-search').addEventListener('input', debounce(searchStudent, 300));
  }

  // Allocate points
  function allocatePoints(categoryId) {
    const category = RISE_MANAGER_CONFIG.CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const points = prompt(`Allocate points for ${category.name}:\n\nValues: 5 (Minor), 10 (Standard), 20 (Major), 50 (Exceptional)`, '10');
    
    if (points && !isNaN(points) && points > 0) {
      const currentEl = document.getElementById(`points-${categoryId}`);
      const current = parseInt(currentEl.textContent) || 0;
      currentEl.textContent = current + parseInt(points);
      
      showNotification(`✅ Allocated ${points} points to ${category.name}`, 'success');
    }
  }

  // Edit points
  function editPoints(categoryId) {
    const category = RISE_MANAGER_CONFIG.CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;

    const currentEl = document.getElementById(`points-${categoryId}`);
    const current = currentEl.textContent;
    
    const newPoints = prompt(`Edit points for ${category.name}:`, current);
    
    if (newPoints && !isNaN(newPoints) && newPoints >= 0) {
      currentEl.textContent = newPoints;
      showNotification(`✅ Updated ${category.name} to ${newPoints} points`, 'success');
    }
  }

  // Search student (placeholder)
  function searchStudent() {
    const query = document.getElementById('rise-student-search').value;
    if (query.length < 3) return;

    // Placeholder - integrate with your student database
    document.getElementById('rise-student-info').style.display = 'block';
    document.getElementById('rise-student-name').textContent = 'Student Name';
    document.getElementById('rise-student-id').textContent = `ID: ${query}`;
    
    // Random points for demo
    document.getElementById('rise-total-points').textContent = Math.floor(Math.random() * 500);
    document.getElementById('rise-tier').textContent = ['Bronze', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 4)];
  }

  // Save changes (placeholder)
  window.saveRiseChanges = function() {
    showNotification('💾 Changes saved successfully!', 'success');
    setTimeout(() => document.getElementById('rise-manager-modal').remove(), 1000);
  };

  // Utility: Debounce
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Utility: Notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#3b82f6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // Initialize on Dean dashboard
  if (window.location.pathname.includes('qms-no-login') || 
      document.querySelector('.dean-dashboard')) {
    setTimeout(createRiseManagerButton, 1000);
  }

  console.log('[RISE Manager] Loaded');
})();
