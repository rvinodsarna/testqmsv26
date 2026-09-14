(function () {
  "use strict";
  let configPromise;
  function showConfigError(error) {
    if (!document.body || document.getElementById("qms-config-error")) return;
    const box = document.createElement("div");
    box.id = "qms-config-error";
    box.setAttribute("role", "alert");
    box.style.cssText = "position:fixed;inset:16px;z-index:99999;padding:16px;border-radius:8px;background:#fee2e2;color:#991b1b;font:14px system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.2)";
    box.textContent = "QMS configuration could not be loaded. Contact the system administrator.";
    document.body.appendChild(box);
    console.error("[QMS] Configuration error:", error);
  }
  function validateConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Configuration is not an object");
    if (!config.supabase?.url || !config.supabase?.anonKey) throw new Error("Missing Supabase configuration");
    const url = new URL(config.supabase.url);
    if (url.protocol !== "https:") throw new Error("Supabase URL must use HTTPS");
    return { supabase: { url: config.supabase.url, anonKey: config.supabase.anonKey }, gemini: { model: config.gemini?.model || "gemini-2.0-flash" }, app: { version: config.app?.version || "unknown", name: config.app?.name || "QMS RISE" } };
  }
  async function loadConfig() {
    const response = await fetch("/qms-config.json", { cache: "no-store", credentials: "same-origin" });
    if (!response.ok) throw new Error(`Configuration request failed: ${response.status}`);
    const config = validateConfig(await response.json());
    window.QMS_CONFIG = config;
    window.SUPABASE_URL = config.supabase.url;
    window.SUPABASE_ANON_KEY = config.supabase.anonKey;
    if (typeof window.supabase?.createClient === "function") window.supabaseClient = window.supabase.createClient(config.supabase.url, config.supabase.anonKey);
    console.info("[QMS] Configuration loaded");
    return config;
  }
  configPromise = loadConfig().catch((error) => { showConfigError(error); throw error; });
  window.QMS_READY = configPromise;
  window.loadConfig = () => window.QMS_READY;
})();
