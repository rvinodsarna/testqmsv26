-- =====================================================
-- SEED STAFF, COURSES & FAQ DATA FOR AI CHAT
-- Run this in Supabase SQL Editor
-- =====================================================

-- First, let's add comprehensive FAQ entries for staff and courses
INSERT INTO faqs (question, answer, category, tags) VALUES

-- HOPs and Staff
('Who is the HOP for CS?', 'The Head of Programme for Computer Science (CS) manages the CS programme. Check the Staff Management page or your student portal for the current HOP.', 'Staff', 'hop,cs,computer science,programme head'),
('Who is the HOP for BM?', 'The Head of Programme for Business Management (BM) oversees the BM programme. Contact the faculty office or check the portal for current HOP details.', 'Staff', 'hop,bm,business management,programme head'),
('Who is the HOP for ENG?', 'The Head of Programme for Engineering manages the Engineering programme. Visit the faculty office or check your student portal.', 'Staff', 'hop,eng,engineering,programme head'),
('Who is the HOP for LAW?', 'The Head of Programme for Law oversees the Law programme. Contact the law faculty office for assistance.', 'Staff', 'hop,law,programme head'),
('Who is the HOP for MED?', 'The Head of Programme for Medical Sciences manages the MED programme. Contact the medical faculty office.', 'Staff', 'hop,med,medical,programme head'),
('Who is the HOP for DCY?', 'The Head of Programme for Digital Cybersecurity (DCY) manages the DCY programme. Check the portal or contact the faculty.', 'Staff', 'hop,dcy,cybersecurity,programme head'),
('Who is the HOP for DIT?', 'The Head of Programme for Diploma in Information Technology (DIT) oversees the DIT programme.', 'Staff', 'hop,dit,diploma,it,programme head'),
('Who is the HOP for BDS?', 'The Head of Programme for Bachelor of Dental Surgery (BDS) manages the BDS programme.', 'Staff', 'hop,bds,dental,programme head'),
('Who is the HOP for BCY?', 'The Head of Programme for Bachelor of Cybersecurity (BCY) oversees the BCY programme.', 'Staff', 'hop,bcy,cybersecurity,programme head'),
('Who is the HOP for BCS?', 'The Head of Programme for Bachelor of Computer Science (BCS) manages the BCS programme.', 'Staff', 'hop,bcs,computer science,programme head'),
('Who is the HOP for BSE?', 'The Head of Programme for Bachelor of Software Engineering (BSE) oversees the BSE programme.', 'Staff', 'hop,bse,software engineering,programme head'),

-- How to find staff
('How do I find my lecturer?', 'Go to the Staff Management page in the portal, or check your course timetable. You can also search by course code.', 'Staff', 'lecturer,find,search,timetable'),
('How do I contact my lecturer?', 'Use the Messages feature in the portal to contact your lecturer. You can also visit during their consultation hours.', 'Staff', 'lecturer,contact,message,consultation'),
('Where can I see all lecturers?', 'Go to Staff Management → View All Staff to see the complete list of lecturers and their details.', 'Staff', 'lecturers,list,staff,directory'),

-- Common Courses
('What is DIT4101?', 'DIT4101 is a core Information Technology course. Check your study plan or course catalogue for detailed syllabus and prerequisites.', 'Courses', 'dit4101,course code,it,core'),
('What is DIT4102?', 'DIT4102 is an Information Technology course. Refer to your course outline for topics, assessments, and learning outcomes.', 'Courses', 'dit4102,course code,it'),
('What is DIT4103?', 'DIT4103 is an IT course in the diploma programme. Check the course file for detailed information.', 'Courses', 'dit4103,course code,it'),
('What is DIT4104?', 'DIT4104 is a core IT course covering fundamental concepts. See your course outline for details.', 'Courses', 'dit4104,course code,it,core'),
('What is DIT4182?', 'DIT4182 is an excluded course for credit transfer. It cannot be used for credit transfer applications.', 'Courses', 'dit4182,course code,excluded,credit transfer'),
('What is DIT4204?', 'DIT4204 is an excluded course for credit transfer purposes.', 'Courses', 'dit4204,course code,excluded,credit transfer'),
('What is DIT4236?', 'DIT4236 is an excluded course that cannot be used for credit transfer.', 'Courses', 'dit4236,course code,excluded,credit transfer'),
('What is DIT4235?', 'DIT4235 is an excluded course for credit transfer applications.', 'Courses', 'dit4235,course code,excluded,credit transfer'),

-- Course Categories
('What are core courses?', 'Core courses are mandatory subjects you must pass to graduate. They are required for your programme.', 'Courses', 'core,mandatory,required,graduation'),
('What are elective courses?', 'Elective courses are optional subjects you can choose based on your interests. You need to complete a certain number of electives.', 'Courses', 'elective,optional,choice,subjects'),
('What is a prerequisite?', 'A prerequisite is a course you must complete before enrolling in an advanced course. Check course requirements before registration.', 'Courses', 'prerequisite,requirement,enrollment'),

-- General Academic Questions
('How do I check my courses?', 'Go to My Profile or Study Plan Maker to view all your registered courses and course codes.', 'General', 'courses,check,study plan,registered'),
('What courses am I taking?', 'Log in to the portal and go to My Profile → My Courses to see your current semester courses.', 'General', 'courses,current,taking,semester'),
('How do I know which lecturer teaches which course?', 'Check the Staff Management page or your course timetable. Each course lists the assigned lecturer.', 'Staff', 'lecturer,course,teaching,timetable'),

-- Programme-Specific Courses
('What courses are in CS programme?', 'Computer Science (CS) includes programming, algorithms, data structures, software engineering, and more. Check the Study Plan Maker for the complete list.', 'Courses', 'cs,computer science,courses,programme'),
('What courses are in BM programme?', 'Business Management (BM) includes management principles, marketing, finance, and business strategy courses. See your study plan.', 'Courses', 'bm,business management,courses,programme'),
('What courses are in DCY programme?', 'Digital Cybersecurity (DCY) includes network security, ethical hacking, cryptography, and cybersecurity fundamentals.', 'Courses', 'dcy,cybersecurity,courses,programme'),

-- Contact and Support
('Who do I ask about courses?', 'Contact your lecturer for course-specific questions, or your HOP for programme-related queries.', 'General', 'help,support,courses,programme'),
('Where is the course outline?', 'Course outlines are available in the Documents section or from your lecturer at the start of the semester.', 'Courses', 'outline,syllabus,documents,course content');

-- =====================================================
-- Verify the insertion
-- =====================================================
SELECT COUNT(*) as total_faqs FROM faqs;
SELECT category, COUNT(*) as count FROM faqs GROUP BY category ORDER BY count DESC;

-- =====================================================
-- DONE! The AI chat can now answer questions about:
-- - HOPs for all programmes
-- - How to find/contact lecturers
-- - Course codes and details
-- - Programme-specific courses
-- - General academic queries
-- =====================================================