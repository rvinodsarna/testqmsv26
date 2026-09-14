// QMS RISE — Config loader
// Loads qms-config.json from the same origin.
(function () {
  "use strict";

  window.QMS_CONFIG = window.QMS_CONFIG || {
    supabase: { url: "", anonKey: "" },
    gemini:   { model: "gemini-2.5-flash" },
    app:      { version: "26.0", name: "UNIMY QMS RISE" }
  };

  window.QMS_READY = (async function loadConfig() {
    try {
      const res = await fetch("./qms-config.json", {
        cache: "no-store",
        credentials: "same-origin"
      });
      if (!res.ok) throw new Error("HTTP " + res.status + " " + res.statusText);
      const cfg = await res.json();

      if (!cfg.supabase || !cfg.supabase.url || !cfg.supabase.anonKey) {
        throw new Error("qms-config.json missing supabase.url or supabase.anonKey");
      }

      window.QMS_CONFIG        = cfg;
      window.SUPABASE_URL      = cfg.supabase.url;
      window.SUPABASE_ANON_KEY = cfg.supabase.anonKey;

      console.log("[QMS] ✅ Configuration loaded:", cfg.app && cfg.app.version);
      return cfg;
    } catch (err) {
      console.error("[QMS] ❌ Config load failed:", err);
      showConfigError(err);
      return null;
    }
  })();

  function showConfigError(err) {
    const paint = () => {
      const box = document.createElement("div");
      box.style.cssText =
        "position:fixed;top:16px;right:16px;max-width:420px;z-index:99999;" +
        "background:#fee;padding:16px;border-radius:8px;border:1px solid #c00;" +
        "font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,.15);";
      box.innerHTML =
        '<h3 style="margin:0 0 8px;color:#c00;">Configuration Error</h3>' +
        '<p style="margin:0 0 8px;">' + String(err.message || err) + '</p>' +
        '<p style="margin:0;font-size:12px;color:#666;">' +
        'Ensure <code>qms-config.json</code> exists in the repository root.</p>';
      document.body.appendChild(box);
    };
    if (document.body) paint();
    else document.addEventListener("DOMContentLoaded", paint, { once: true });
  }
})();
