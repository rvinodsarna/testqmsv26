// UNIMY QMS RISE - FAQ Knowledge Base for AI Chat
// Add this script to index.html after app.js

window.QMS_FAQ_DATA = [
  // === LOGIN & ACCESS ===
  {
    question: "How do I login to QMS RISE?",
    answer: "Go to the QMS RISE login page, select your role (Student, Lecturer, Staff, Dean), enter your university email and password. First-time users must complete face authentication setup.",
    keywords: ["login", "signin", "access", "enter", "password"]
  },
  {
    question: "I forgot my password. How do I reset it?",
    answer: "Click 'Forgot Password' on the login page, enter your university email, and follow the reset link sent to your inbox. If you don't receive it, contact the IT helpdesk.",
    keywords: ["password", "reset", "forgot", "change password"]
  },
  {
    question: "Face authentication is not working. What should I do?",
    answer: "Ensure good lighting, remove glasses/masks, and position your face in the center of the camera. If it still fails, use password login and contact support to recalibrate your face data.",
    keywords: ["face", "authentication", "biometric", "camera", "recognition"]
  },
  
  // === STUDENT FEATURES ===
  {
    question: "How do I submit an assignment?",
    answer: "Navigate to your course, click the assignment, upload your file (PDF, DOCX, etc.), and click 'Submit'. You'll receive a confirmation. Late submissions are marked automatically.",
    keywords: ["submit", "assignment", "upload", "coursework", "deadline"]
  },
  {
    question: "How do I check my grades?",
    answer: "Go to 'My Dashboard' → 'Grades' section. You can view grades by course, semester, or overall GPA. Click any grade to see detailed feedback from your lecturer.",
    keywords: ["grade", "gpa", "result", "mark", "score", "feedback"]
  },
  {
    question: "How do I apply for credit transfer?",
    answer: "Go to 'Academic Services' → 'Credit Transfer', upload your transcript, select courses to transfer, and submit. The system will auto-match courses and notify you of the decision.",
    keywords: ["credit transfer", "exemption", "recognition", "prior learning", "transcript"]
  },
  {
    question: "How do I view my attendance?",
    answer: "Navigate to 'My Dashboard' → 'Attendance'. You'll see attendance percentage per course. QR code attendance is taken at the start of each lecture by the lecturer.",
    keywords: ["attendance", "absent", "present", "QR code", "percentage"]
  },
  
  // === LECTURER FEATURES ===
  {
    question: "How do I create a new course?",
    answer: "Go to 'Lecturer Dashboard' → 'Courses' → 'Create Course'. Fill in course code, name, credits, synopsis, and learning outcomes. Submit for Dean approval.",
    keywords: ["create course", "new course", "add course", "syllabus"]
  },
  {
    question: "How do I upload lecture materials?",
    answer: "In your course page, click 'Materials' → 'Upload'. Select files (PDF, PPT, video links) and organize by week/topic. Students can access immediately after upload.",
    keywords: ["upload", "materials", "lecture notes", "slides", "resources"]
  },
  {
    question: "How do I create an assignment?",
    answer: "Go to your course → 'Assignments' → 'Create Assignment'. Set title, description, due date, max marks, and submission type (file/text). Students will be notified automatically.",
    keywords: ["assignment", "create", "deadline", "submission", "task"]
  },
  {
    question: "How do I grade student submissions?",
    answer: "Navigate to the assignment → 'Submissions'. Click each student's submission, review the file, enter marks and feedback, then click 'Save Grade'. Bulk grading via CSV is also available.",
    keywords: ["grade", "mark", "feedback", "submission", "evaluate"]
  },
  {
    question: "How do I take attendance using QR code?",
    answer: "In your course page, click 'Attendance' → 'Generate QR'. Display the QR code for students to scan. The system automatically marks present students. You can also manually adjust if needed.",
    keywords: ["attendance", "QR code", "scan", "present", "register"]
  },
  
  // === DEAN FEATURES ===
  {
    question: "How do I approve new courses?",
    answer: "Go to 'Dean Dashboard' → 'Course Approvals'. Review submitted courses, check learning outcomes and credits, then approve or reject with comments.",
    keywords: ["approve", "course", "review", "dean", "authorization"]
  },
  {
    question: "How do I view institutional analytics?",
    answer: "Navigate to 'Dean Dashboard' → 'Analytics'. View enrollment trends, pass rates, attendance averages, and course performance across all programmes.",
    keywords: ["analytics", "dashboard", "statistics", "report", "data"]
  },
  {
    question: "How do I manage staff accounts?",
    answer: "Go to 'Dean Dashboard' → 'Staff Management'. You can create new staff accounts, assign roles (Lecturer, HOD, etc.), and deactivate accounts when needed.",
    keywords: ["staff", "account", "manage", "role", "lecturer"]
  },
  
  // === SYSTEM FEATURES ===
  {
    question: "What is the AI Chat Assistant?",
    answer: "The AI Chat (🤖) is your intelligent QMS assistant. Ask any question about the system, courses, assignments, or procedures. It uses the FAQ database to provide accurate answers instantly.",
    keywords: ["AI", "chat", "assistant", "bot", "help", "question"]
  },
  {
    question: "How do I update my profile?",
    answer: "Click your avatar in the top-right → 'Profile'. Update your name, contact info, avatar image, and notification preferences. Changes save automatically.",
    keywords: ["profile", "update", "edit", "avatar", "settings"]
  },
  {
    question: "Can I access QMS on mobile?",
    answer: "Yes! QMS RISE is fully responsive. Open the website on your phone browser. For best experience, add it to your home screen as a web app.",
    keywords: ["mobile", "phone", "tablet", "app", "responsive"]
  },
  {
    question: "How do I contact support?",
    answer: "Click the 'Help' icon in the sidebar or email qms-support@unimy.edu.my. Include your student/staff ID and a description of the issue for faster resolution.",
    keywords: ["support", "help", "contact", "issue", "problem", "error"]
  },
  
  // === ASSESSMENT & EXAMS ===
  {
    question: "What is the grading scale?",
    answer: "UNIMY uses: A (4.00), A- (3.67), B+ (3.33), B (3.00), B- (2.67), C+ (2.33), C (2.00), C- (1.67), D+ (1.33), D (1.00), F (0.00). Passing grade is C+ and above.",
    keywords: ["grade", "scale", "GPA", "marking", "percentage"]
  },
  {
    question: "How do I request a grade review?",
    answer: "Within 7 days of grade release, go to 'My Dashboard' → 'Grade Review', select the course, provide justification, and submit. The lecturer will review and respond within 5 working days.",
    keywords: ["grade review", "appeal", "reconsider", "dispute", "remark"]
  },
  {
    question: "What happens if I fail a course?",
    answer: "You must retake the course in the next available semester. If you fail the same course twice, you'll be required to meet with your academic advisor for a study plan.",
    keywords: ["fail", "retake", "repeat", "course", "semester"]
  },
  
  // === TECHNICAL ISSUES ===
  {
    question: "The page is not loading. What do I do?",
    answer: "Clear your browser cache (Ctrl+Shift+Delete), refresh the page (F5), or try a different browser (Chrome recommended). Check your internet connection.",
    keywords: ["loading", "freeze", "crash", "error", "browser", "cache"]
  },
  {
    question: "File upload is failing. How do I fix it?",
    answer: "Check file size (max 10MB per file), ensure it's a supported format (PDF, DOCX, PPTX, JPG, PNG), and check your internet connection. Try uploading again.",
    keywords: ["upload", "file", "fail", "error", "size", "format"]
  },
  {
    question: "I'm logged out automatically. Why?",
    answer: "For security, sessions expire after 8 hours of inactivity. Simply login again. If it happens frequently, check if your browser is blocking cookies.",
    keywords: ["logout", "session", "expired", "timeout", "automatic"]
  }
];

// AI Chat Helper Function - matches user query to best FAQ
window.findBestFAQ = function(query) {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const faq of window.QMS_FAQ_DATA) {
    let score = 0;
    
    // Check question match
    const questionLower = faq.question.toLowerCase();
    for (const word of queryWords) {
      if (questionLower.includes(word)) score += 2;
    }
    
    // Check keywords
    for (const keyword of faq.keywords) {
      if (queryLower.includes(keyword)) score += 3;
    }
    
    // Check answer relevance
    const answerLower = faq.answer.toLowerCase();
    for (const word of queryWords) {
      if (answerLower.includes(word)) score += 1;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }
  
  // Return match if score is good enough
  if (bestScore >= 3) {
    return { found: true, faq: bestMatch, confidence: bestScore };
  }
  
  return { found: false, message: "I couldn't find a specific answer. Try rephrasing or contact support at qms-support@unimy.edu.my" };
};

console.log('✅ QMS FAQ Data loaded -', window.QMS_FAQ_DATA.length, 'FAQs available');