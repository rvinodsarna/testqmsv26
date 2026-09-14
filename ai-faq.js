(function () {
  "use strict";
  const MAX_QUESTION_LENGTH = 1000;
  let faqPromise = null;
  function fallback(message) { return { answer: message || "I could not find a reliable answer. Please contact QMS support.", source: "fallback", category: null }; }
  function normalize(value) { return String(value || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim(); }
  function words(value) { return new Set(normalize(value).split(" ").filter((word) => word.length >= 4)); }
  function scoreFAQ(question, faq) { const q = words(question), f = words(`${faq.question} ${faq.answer}`); if (!q.size || !f.size) return 0; let matches = 0; for (const word of q) if (f.has(word)) matches++; return matches / q.size; }
  function findBestFAQ(question, faqs) { const ranked = faqs.map((faq) => ({ faq, score: scoreFAQ(question, faq) })).sort((a, b) => b.score - a.score); const best = ranked[0], second = ranked[1]; if (!best || best.score < 0.45 || (second && best.score - second.score < 0.1)) return null; return best; }
  async function loadFAQs() { await window.QMS_READY; if (!window.supabaseClient) throw new Error("Supabase client unavailable"); const { data, error } = await window.supabaseClient.from("faqs").select("question, answer, category").order("created_at", { ascending: false }); if (error) throw error; return Array.isArray(data) ? data : []; }
  function getFAQs() { if (!faqPromise) faqPromise = loadFAQs().catch((error) => { console.error("[FAQ] Failed to load FAQs:", error); return []; }); return faqPromise; }
  async function callQMSAI(question) { const sessionResult = await window.supabaseClient.auth.getSession(); const token = sessionResult.data?.session?.access_token; const response = await fetch("/.netlify/functions/qms-ai", { method: "POST", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ question }) }); const data = await response.json().catch(() => ({})); if (!response.ok) return fallback("The AI assistant is temporarily unavailable."); return { answer: data.answer || "No answer was returned.", source: data.source || "AI", category: data.category || "AI Response" }; }
  async function handleAIChat(userQuestion) { const question = String(userQuestion || "").trim(); if (!question) return fallback("Please enter a question."); if (question.length > MAX_QUESTION_LENGTH) return fallback(`Please shorten your question to ${MAX_QUESTION_LENGTH} characters or fewer.`); const match = findBestFAQ(question, await getFAQs()); if (match) return { answer: match.faq.answer, source: "FAQ", category: match.faq.category || null, matchedQuestion: match.faq.question, confidence: Number(match.score.toFixed(2)) }; try { return await callQMSAI(question); } catch (error) { console.error("[FAQ] AI request failed:", error); return fallback(); } }
  window.loadFAQs = getFAQs;
  window.handleAIChat = handleAIChat;
  window.findBestFAQ = findBestFAQ;
  window.QMS_READY.then(() => console.info("[FAQ] FAQ assistant ready")).catch((error) => console.error("[FAQ] Startup failed:", error));
})();
