// dean-dashboard-fix.js
// Dean dashboard CSS fixes and event button updates

// Add to your HTML before </body> tag:
// <script src="dean-dashboard-fix.js"></script>

(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('Dean dashboard fix initialized');
        
        // Apply CSS fixes
        applyCSSFixes();
        
        // Update event buttons
        updateEventButtons();
    }

    function applyCSSFixes() {
        const style = document.createElement('style');
        style.textContent = `
            /* Dean Dashboard CSS Fixes */
            .dashboard-container {
                max-width: 100%;
                overflow-x: hidden;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                padding: 1rem;
            }
            
            .stat-card {
                background: white;
                border-radius: 8px;
                padding: 1.5rem;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .event-actions {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }
            
            .btn-approve, .btn-reject {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 500;
            }
            
            .btn-approve {
                background: #10b981;
                color: white;
            }
            
            .btn-reject {
                background: #ef4444;
                color: white;
            }
            
            .btn-approve:hover {
                background: #059669;
            }
            
            .btn-reject:hover {
                background: #dc2626;
            }
        `;
        document.head.appendChild(style);
    }

    function updateEventButtons() {
        // Find event approval buttons and update them
        const eventRows = document.querySelectorAll('.event-row');
        
        eventRows.forEach(row => {
            const approveBtn = row.querySelector('.btn-approve');
            const rejectBtn = row.querySelector('.btn-reject');
            
            if (approveBtn) {
                approveBtn.textContent = '✓ Approve';
                approveBtn.addEventListener('click', () => handleApprove(row));
            }
            
            if (rejectBtn) {
                rejectBtn.textContent = '✗ Reject';
                rejectBtn.addEventListener('click', () => handleReject(row));
            }
        });
    }

    function handleApprove(row) {
        const eventId = row.dataset.eventId;
        console.log('Approving event:', eventId);
        // Add your approval logic here
        row.style.background = '#d1fae5';
    }

    function handleReject(row) {
        const eventId = row.dataset.eventId;
        console.log('Rejecting event:', eventId);
        // Add your rejection logic here
        row.style.background = '#fee2e2';
    }
})();