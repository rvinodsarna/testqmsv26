// QMS RISE - Configuration Loader (FINAL VERSION)
// Loads qms-config.json from the SAME repository

// Use var instead of let to allow re-declaration
var QMS_CONFIG = {
    supabase: {
        url: '',
        anonKey: ''
    },
    gemini: {
        apiKey: '',
        model: 'gemini-2.0-flash-exp'
    },
    app: {
        version: '20.0',
        name: 'UNIMY QMS RISE'
    }
};

async function loadConfig() {
    try {
        console.log('[QMS] Loading configuration from qms-config.json...');

        // Load from SAME repository (relative path)
        const response = await fetch('./qms-config.json');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const config = await response.json();

        // Validate required fields
        if (!config.supabase?.url || !config.supabase?.anonKey) {
            throw new Error('Invalid config: missing Supabase credentials');
        }

        // Store configuration
        QMS_CONFIG = config;

        console.log('[QMS] ✅ Configuration loaded successfully');
        console.log('[QMS] Supabase URL:', config.supabase.url);
        console.log('[QMS] App Version:', config.app.version);

        // ALSO set as window globals for other scripts to use
        window.SUPABASE_URL = config.supabase.url;
        window.SUPABASE_ANON_KEY = config.supabase.anonKey;
        window.QMS_CONFIG = QMS_CONFIG;

        return true;

    } catch (error) {
        console.error('[QMS] ❌ Configuration load failed:', error);

        // Show error in UI
        const errorEl = document.createElement('div');
        errorEl.className = 'alert alert-error';
        errorEl.style.cssText = 'position:fixed;top:20px;right:20px;max-width:400px;z-index:9999;background:#fee;padding:16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
        errorEl.innerHTML = `
            <h3 style="margin:0 0 8px 0;color:#c00;">❌ Configuration Error</h3>
            <p style="margin:0 0 8px 0;">Failed to load qms-config.json: ${error.message}</p>
            <p style="margin:0;font-size:12px;">
                Make sure qms-config.json exists in your repository root.
            </p>
        `;
        document.body.appendChild(errorEl);

        return false;
    }
}

// Auto-load immediately when script is included
loadConfig();
