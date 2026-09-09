// ai-faq.js - v26.0 HYBRID AI Chat
// Uses FAQ database FIRST, then falls back to AI (Gemini) for unknown questions

(function() {
  'use strict';

  console.log('[AI FAQ v26.0 Hybrid] Loading FAQ + AI chat...');

  // Wait for Supabase client
  function waitForSupabase() {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient) {
          clearInterval(checkInterval);
          console.log('[AI FAQ v26.0] Supabase client ready');
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Supabase client not found after 10s'));
      }, 10000);
    });
  }

  // Load FAQs from database
  async function loadFAQs() {
    try {
      console.log('[AI FAQ v26.0] Loading FAQs from database...');

      const { data, error } = await window.supabaseClient
        .from('faqs')
        .select('question, answer, category')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[AI FAQ v26.0] Error loading FAQs:', error);
        return [];
      }

      console.log(`[AI FAQ v26.0] Loaded ${data?.length || 0} FAQs`);
      return data || [];
    } catch (err) {
      console.error('[AI FAQ v26.0] Failed to load FAQs:', err);
      return [];
    }
  }

  // Find best matching FAQ for user question
  function findBestFAQ(question, faqs) {
    if (!faqs || faqs.length === 0) return null;

    const q = question.toLowerCase().trim();

    // Exact match
    for (const faq of faqs) {
      if (faq.question.toLowerCase().includes(q) || q.includes(faq.question.toLowerCase())) {
        console.log('[AI FAQ v26.0] Found exact FAQ match');
        return { match: faq, score: 1.0, type: 'exact' };
      }
    }

    // Keyword match
    const keywords = q.split(/\s+/).filter(w => w.length > 3);
    for (const faq of faqs) {
      const qLower = faq.question.toLowerCase();
      const aLower = faq.answer.toLowerCase();
      let matchCount = 0;
      for (const kw of keywords) {
        if (qLower.includes(kw) || aLower.includes(kw)) matchCount++;
      }
      if (matchCount >= 2) {
        console.log(`[AI FAQ v26.0] Found keyword FAQ match (${matchCount} keywords)`);
        return { match: faq, score: 0.8, type: 'keyword' };
      }
    }

    // Partial match
    for (const faq of faqs) {
      const qLower = faq.question.toLowerCase();
      if (qLower.split(' ').some(w => q.includes(w) && w.length > 4)) {
        console.log('[AI FAQ v26.0] Found partial FAQ match');
        return { match: faq, score: 0.6, type: 'partial' };
      }
    }

    return null;
  }

  // Call Gemini AI for questions not in FAQ
  async function callGeminiAI(question) {
    try {
      console.log('[AI FAQ v26.0] Calling Gemini AI for:', question);

      // Get config
      const config = window.QMS_CONFIG || {};
      const geminiKey = config.gemini?.apiKey;
      const geminiModel = config.gemini?.model || 'gemini-2.0-flash-exp';

      // If no API key, return fallback
      if (!geminiKey) {
        console.warn('[AI FAQ v26.0] No Gemini API key configured');
        return {
          answer: "I couldn't find this in the FAQ. Please contact support for assistance.",
          source: 'Fallback (No API Key)',
          category: null
        };
      }

      // Call Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${geminiModel}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a helpful assistant for UNIMY QMS RISE (University Malaysia of Computer Science & Engineering). 
                Answer this question concisely and accurately: ${question}`
              }]
            }]
          })
        }
      );

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiAnswer = data.candidates[0].content.parts[0].text;
        console.log('[AI FAQ v26.0] AI response received');
        return {
          answer: aiAnswer,
          source: 'AI (Gemini)',
          category: 'AI Response'
        };
      } else {
        console.warn('[AI FAQ v26.0] AI returned no answer');
        return {
          answer: "I couldn't find this in the FAQ. Please contact support.",
          source: 'Fallback (AI Error)',
          category: null
        };
      }
    } catch (err) {
      console.error('[AI FAQ v26.0] AI call failed:', err);
      return {
        answer: "I couldn't find this in the FAQ. Please contact support.",
        source: 'Fallback (Error)',
        category: null
      };
    }
  }

  // Main AI chat handler - FAQ first, then AI
  async function handleAIChat(userQuestion) {
    console.log('[AI FAQ v26.0] Processing question:', userQuestion);

    // Step 1: Try FAQ database
    const faqs = await loadFAQs();
    const faqMatch = findBestFAQ(userQuestion, faqs);

    if (faqMatch && faqMatch.score >= 0.6) {
      console.log(`[AI FAQ v26.0] Returning FAQ answer (score: ${faqMatch.score}, type: ${faqMatch.type})`);
      return {
        answer: faqMatch.match.answer,
        source: `FAQ (${faqMatch.type} match)`,
        category: faqMatch.match.category,
        matchedQuestion: faqMatch.match.question
      };
    }

    // Step 2: No FAQ match - call AI
    console.log('[AI FAQ v26.0] No FAQ match, calling AI...');
    const aiResponse = await callGeminiAI(userQuestion);
    return aiResponse;
  }

  // Initialize
  waitForSupabase()
    .then(() => {
      console.log('[AI FAQ v26.0 Hybrid] FAQ + AI chat ready');
      window.handleAIChat = handleAIChat;
      window.loadFAQs = loadFAQs;
      window.callGeminiAI = callGeminiAI;
    })
    .catch(err => {
      console.error('[AI FAQ v26.0] Initialization failed:', err);
    });

  console.log('[AI FAQ v26.0 Hybrid] Script loaded');
})();
