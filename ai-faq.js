// QMS RISE v26.0 — AI FAQ Assistant with Fallback
(function() {
  "use strict";

  const AI_CONFIG = {
    MAX_QUESTION_LENGTH: 500,
    RESPONSE_TIMEOUT: 10000,
    MAX_RETRIES: 2,
    SIMILARITY_THRESHOLD: 0.6,
    GEMINI_PROXY_URL: "/api/gemini-proxy"
  };

  class AIAssistant {
    constructor() {
      this.faqCache = [];
      this.isInitialized = false;
      this.requestCount = 0;
      this.lastRequestTime = 0;
    }

    async init() {
      try {
        console.log("[AIAssistant] 🔒 Initializing AI assistant...");
        
        if (!window.QMS_READY) {
          throw new Error("QMS config not loaded");
        }
        await window.QMS_READY;

        await this.loadFAQs();
        
        this.isInitialized = true;
        console.log("[AIAssistant] ✅ AI assistant ready");
        return true;

      } catch (error) {
        console.error("[AIAssistant] ❌ Initialization failed:", error);
        return false;
      }
    }

    async loadFAQs() {
      try {
        if (!window.supabaseClient) {
          console.warn("[AIAssistant] Supabase not available, using empty FAQ cache");
          return;
        }

        const { data: faqs, error } = await window.supabaseClient
          .from("faqs")
          .select("id, question, answer, category, tags")
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("[AIAssistant] FAQ load error:", error.message);
          return;
        }

        this.faqCache = faqs || [];
        console.log("[AIAssistant] ✅ Loaded", this.faqCache.length, "FAQs");

      } catch (error) {
        console.error("[AIAssistant] FAQ load failed:", error);
      }
    }

    calculateSimilarity(text1, text2) {
      const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, "").trim();
      const words1 = normalize(text1).split(/\s+/).filter(w => w.length > 2);
      const words2 = normalize(text2).split(/\s+/).filter(w => w.length > 2);

      if (words1.length === 0 || words2.length === 0) return 0;

      const intersection = words1.filter(w => words2.includes(w));
      return intersection.length / Math.max(words1.length, words2.length);
    }

    async searchFAQs(question) {
      if (!question || question.trim().length === 0) {
        return [];
      }

      const normalizedQuestion = question.toLowerCase().trim();

      const questionMatches = this.faqCache
        .map(faq => ({
          ...faq,
          similarity: this.calculateSimilarity(normalizedQuestion, faq.question.toLowerCase())
        }))
        .filter(faq => faq.similarity >= AI_CONFIG.SIMILARITY_THRESHOLD)
        .sort((a, b) => b.similarity - a.similarity);

      if (questionMatches.length > 0) {
        console.log("[AIAssistant] Found", questionMatches.length, "FAQ matches in questions");
        return questionMatches.slice(0, 3);
      }

      const answerMatches = this.faqCache
        .map(faq => ({
          ...faq,
          similarity: this.calculateSimilarity(normalizedQuestion, faq.answer.toLowerCase())
        }))
        .filter(faq => faq.similarity >= AI_CONFIG.SIMILARITY_THRESHOLD * 0.8)
        .sort((a, b) => b.similarity - a.similarity);

      if (answerMatches.length > 0) {
        console.log("[AIAssistant] Found", answerMatches.length, "FAQ matches in answers");
        return answerMatches.slice(0, 3);
      }

      return [];
    }

    async ask(question, context = "") {
      if (!this.isInitialized) {
        await this.init();
      }

      if (!question || typeof question !== "string") {
        return { response: "Please ask a valid question.", source: "validation", confidence: "low" };
      }

      const trimmedQuestion = question.trim();
      if (trimmedQuestion.length > AI_CONFIG.MAX_QUESTION_LENGTH) {
        return {
          response: "Your question is too long. Please keep it under " + AI_CONFIG.MAX_QUESTION_LENGTH + " characters.",
          source: "validation",
          confidence: "low"
        };
      }

      const now = Date.now();
      if (now - this.lastRequestTime < 1000) {
        return {
          response: "Please wait a moment before asking another question.",
          source: "rate_limit",
          confidence: "low"
        };
      }
      this.lastRequestTime = now;
      this.requestCount++;

      console.log("[AIAssistant] Processing question:", trimmedQuestion.substring(0, 50));

      const faqMatches = await this.searchFAQs(trimmedQuestion);
      
      if (faqMatches.length > 0) {
        const bestMatch = faqMatches[0];
        console.log("[AIAssistant] ✅ FAQ match found:", bestMatch.similarity.toFixed(2));
        
        return {
          response: bestMatch.answer,
          source: "FAQ",
          category: bestMatch.category,
          question: bestMatch.question,
          confidence: bestMatch.similarity >= 0.8 ? "high" : "medium",
          alternatives: faqMatches.slice(1, 3)
        };
      }

      try {
        const aiResponse = await this.callGeminiAI(trimmedQuestion, context);
        return aiResponse;

      } catch (error) {
        console.error("[AIAssistant] AI fallback failed:", error);
        
        return {
          response: "I apologize, but I couldn't find information about that in our FAQ database. Please contact your lecturer, HOP, or Dean for assistance.",
          source: "fallback",
          confidence: "low",
          suggestion: "Try rephrasing your question or check the FAQ categories."
        };
      }
    }

    async callGeminiAI(question, context) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.RESPONSE_TIMEOUT);

      try {
        const response = await fetch(AI_CONFIG.GEMINI_PROXY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question,
            context: context || "You are a helpful assistant for UNIMY QMS RISE student portal.",
            maxRetries: AI_CONFIG.MAX_RETRIES
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("AI service returned " + response.status);
        }

        const data = await response.json();
        
        return {
          response: data.answer || "I apologize, but I could not generate a response.",
          source: "AI",
          confidence: "medium",
          model: data.model || "gemini"
        };

      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    }

    getFAQCategories() {
      const categories = {};
      this.faqCache.forEach(faq => {
        if (!categories[faq.category]) {
          categories[faq.category] = 0;
        }
        categories[faq.category]++;
      });
      return categories;
    }
  }

  window.AIAssistant = AIAssistant;
  window.AI_CONFIG = AI_CONFIG;

  console.log("[AIAssistant] 📦 AI FAQ module loaded");
})();
