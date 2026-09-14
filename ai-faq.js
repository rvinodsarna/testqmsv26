// QMS RISE — AI FAQ + Gemini fallback via Netlify proxy
(function () {
  "use strict";

  console.log("[AI FAQ v26] Starting…");

  const $ = (id) => document.getElementById(id);
  const PROXY = "/.netlify/functions/gemini-proxy";
  const MODEL = "gemini-2.5-flash";

  // ---- Wait for Supabase client (max 10 s) ---------------------------
  function waitForSupabase() {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const t = setInterval(() => {
        if (window.supabaseClient) { clearInterval(t); resolve(); }
        else if (Date.now() - start > 10000) { clearInterval(t); reject(new Error("Supabase not ready")); }
      }, 100);
    });
  }

  // ---- Load FAQs ------------------------------------------------------
  async function loadFAQs() {
    try {
      const { data, error } = await window.supabaseClient
        .from("faqs")
        .select("question, answer, category")
        .order("created_at", { ascending: false });
      if (error) { console.warn("[AI FAQ] FAQ load:", error.message); return []; }
      console.log("[AI FAQ] Loaded", (data || []).length, "FAQs");
      return data || [];
    } catch (e) {
      console.warn("[AI FAQ] FAQ fetch failed:", e.message);
      return [];
    }
  }

  // ---- FAQ matching ---------------------------------------------------
  function findBestFAQ(question, faqs) {
    if (!faqs || !faqs.length) return null;
    const q = String(question || "").toLowerCase().trim();

    // exact
    for (const f of faqs) {
      const fq = String(f.question || "").toLowerCase();
      if (fq.includes(q) || q.includes(fq)) return { match: f, score: 1.0, type: "exact" };
    }
    // keyword
    const kws = q.split(/\s+/).filter(w => w.length > 3);
    for (const f of faqs) {
      const hay = (f.question + " " + f.answer).toLowerCase();
      const hits = kws.filter(kw => hay.includes(kw)).length;
      if (hits >= 2) return { match: f, score: 0.8, type: "keyword" };
    }
    return null;
  }

  // ---- Gemini via Netlify proxy --------------------------------------
  async function callGemini(question) {
    const r = await fetch(PROXY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        body: {
          contents: [{
            parts: [{
              text:
                "You are a helpful assistant for UNIMY QMS RISE. " +
                "Answer concisely and accurately: " + question
            }]
          }]
        }
      })
    });

    if (!r.ok) {
      const errText = await r.text().catch(() => "");
      throw new Error("Proxy " + r.status + ": " + errText.slice(0, 120));
    }

    const data = await r.json();
    const text = data &&
                 data.candidates &&
                 data.candidates[0] &&
                 data.candidates[0].content &&
                 data.candidates[0].content.parts &&
                 data.candidates[0].content.parts[0] &&
                 data.candidates[0].content.parts[0].text;

    if (!text) throw new Error("Empty Gemini response");
    return text;
  }

  // ---- Main handler ---------------------------------------------------
  async function handleAIChat(question) {
    const faqs = await loadFAQs();
    const hit  = findBestFAQ(question, faqs);

    if (hit && hit.score >= 0.6) {
      return {
        answer: hit.match.answer,
        source: "FAQ (" + hit.type + ")",
        category: hit.match.category || null
      };
    }

    try {
      const aiAnswer = await callGemini(question);
      return { answer: aiAnswer, source: "AI (Gemini)" };
    } catch (err) {
      console.error("[AI FAQ] Gemini failed:", err);
      return {
        answer: "I couldn't find this in the FAQ, and the AI service is unavailable right now. Please contact your lecturer or HOP.",
        source: "fallback"
      };
    }
  }

  // ---- Boot -----------------------------------------------------------
  waitForSupabase()
    .then(() => {
      window.handleAIChat = handleAIChat;
      window.loadFAQs     = loadFAQs;
      window.callGemini   = callGemini;
      console.log("[AI FAQ v26] Ready");
    })
    .catch(err => console.warn("[AI FAQ] Init failed:", err.message));
})();
