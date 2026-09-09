// =====================================================
// AI CHAT FIX - Make it use FAQ data properly
// =====================================================
// This should go in ai-faq.js or the AI assistant section of app.js

async function queryFAQDatabase(question) {
    // Search the FAQ table for matching questions
    const { data: faqs, error } = await supabaseClient
        .from('faqs')
        .select('question, answer, category, tags')
        .ilike('question', `%${question}%`)
        .limit(5);
    
    if (error || !faqs || faqs.length === 0) {
        // Try searching in the answer field as fallback
        const { data: faqs2 } = await supabaseClient
            .from('faqs')
            .select('question, answer, category, tags')
            .ilike('answer', `%${question}%`)
            .limit(5);
        
        return faqs2 || [];
    }
    
    return faqs;
}

async function askAIAssistant(question) {
    // First, try to find matching FAQ
    const faqs = await queryFAQDatabase(question);
    
    if (faqs.length > 0) {
        // Return the best matching FAQ answer
        const bestMatch = faqs[0];
        return {
            response: bestMatch.answer,
            source: 'FAQ',
            category: bestMatch.category,
            confidence: 'high'
        };
    }
    
    // If no FAQ match, use Gemini AI as fallback
    try {
        const response = await fetch('/api/gemini-proxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                question: question,
                context: 'You are a helpful assistant for UNIMY QMS RISE student portal. Answer questions about attendance, evaluations, RISE points, complaints, and academic matters.'
            })
        });
        
        const data = await response.json();
        return {
            response: data.answer || 'I apologize, but I could not find information about that. Please contact your lecturer or HOP for assistance.',
            source: 'AI',
            confidence: 'medium'
        };
    } catch (err) {
        return {
            response: 'I apologize, but I could not find information about that in our FAQ database. Please contact your lecturer or HOP for assistance.',
            source: 'fallback',
            confidence: 'low'
        };
    }
}

// =====================================================
// HOW TO APPLY:
// 1. Open ai-faq.js in your text editor
// 2. Find the function that handles AI questions (might be called askAI, handleQuestion, etc.)
// 3. Replace it with the askAIAssistant function above
// 4. Make sure it calls queryFAQDatabase first before using AI
// 5. Save the file
// =====================================================

// Quick fix for existing code - find this pattern and replace:
// OLD (broken):
//   const response = await fetch(GEMINI_PROXY_URL, ...)
//
// NEW (fixed):
//   const faqs = await queryFAQDatabase(userQuestion);
//   if (faqs.length > 0) return faqs[0].answer;
//   const response = await fetch(GEMINI_PROXY_URL, ...)