// QMS RISE v26.0 — Secure Config Loader
(function () {
  "use strict";

  const CONFIG_VERSION = "26.0";
  const CONFIG_TIMEOUT = 5000;

  function validateConfig(cfg) {
    if (!cfg || typeof cfg !== "object") {
      throw new Error("Configuration is not an object");
    }

    if (!cfg.supabase?.url || !cfg.supabase?.anonKey) {
      throw new Error("Missing required Supabase configuration");
    }

    try {
      const url = new URL(cfg.supabase.url);
      if (url.protocol !== "https:") {
        throw new Error("Supabase URL must use HTTPS for security");
      }
      if (!url.hostname.endsWith(".supabase.co")) {
        throw new Error("Invalid Supabase hostname");
      }
    } catch (e) {
      throw new Error("Invalid Supabase URL format: " + e.message);
    }

    return {
      supabase: {
        url: cfg.supabase.url.trim(),
        anonKey: cfg.supabase.anonKey.trim()
      },
      gemini: {
        model: cfg.gemini?.model || "gemini-2.5-flash",
        apiKey: cfg.gemini?.apiKey || ""
      },
      app: {
        version: cfg.app?.version || CONFIG_VERSION,
        name: cfg.app?.name || "UNIMY QMS RISE"
      }
    };
  }

  function showConfigError(message) {
    if (!document.body || document.getElementById("qms-config-error")) return;

    const box = document.createElement("div");
    box.id = "qms-config-error";
    box.style.cssText = 
      "position:fixed;top:16px;right:16px;max-width:480px;z-index:99999;" +
      "padding:20px;border-radius:10px;background:#fee2e2;color:#991b1b;" +
      "font:14px system-ui,sans-serif;box-shadow:0 8px 32px rgba(0,0,0,.2);" +
      "border:2px solid #ef4444;";

    box.innerHTML = 
      "<h3 style=\"margin:0 0 12px;font-size:16px;font-weight:700;\">⚠️ Configuration Error</h3>" +
      "<p style=\"margin:0 0 12px;line-height:1.5;\">" + String(message) + "</p>" +
      "<p style=\"margin:12px 0 0;font-size:12px;color:#6b7280;\">Check qms-config.json</p>";

    document.body.appendChild(box);
    console.error("[QMS] Configuration error:", message);
  }

  async function loadConfig() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG_TIMEOUT);

    try {
      console.log("[QMS] 🔒 Loading secure configuration v" + CONFIG_VERSION + "...");

      const response = await fetch("./qms-config.json", {
        cache: "no-store",
        credentials: "same-origin",
        signal: controller.signal,
        headers: { "Accept": "application/json" }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const rawConfig = await response.json();
      const config = validateConfig(rawConfig);

      window.QMS_CONFIG = config;
      window.SUPABASE_URL = config.supabase.url;
      window.SUPABASE_ANON_KEY = config.supabase.anonKey;
      window.QMS_CONFIG_VERSION = CONFIG_VERSION;

      if (window.supabase && typeof window.supabase.createClient === "function") {
        window.supabaseClient = window.supabase.createClient(
          config.supabase.url,
          config.supabase.anonKey,
          { auth: { autoRefreshToken: true, persistSession: true } }
        );
        console.log("[QMS] ✅ Supabase client initialized");
      }

      console.log("[QMS] ✅ Configuration loaded successfully");
      return config;

    } catch (error) {
      clearTimeout(timeoutId);
      showConfigError("Configuration load failed: " + error.message);
      throw error;
    }
  }

  window.QMS_READY = loadConfig();
  window.loadConfig = () => window.QMS_READY;
})();
