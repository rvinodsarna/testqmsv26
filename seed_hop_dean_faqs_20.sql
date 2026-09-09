-- HOP (Head of Programme) and Dean role FAQ entries
-- New category: "Staff Roles" — feeds the AI Assistant's FAQ knowledge base (openAIAssistant loads all faqs rows)
-- Grounded in app.js role-gating logic (buildSidebar, mountStaffManagement, mountDeanDashboard, mountHOPDashboard,
-- mountCertReview, mountChat, mountCreditTransfer, canManageTerm, LKPI/course_files QA checks) as of 2026-08-26.
INSERT INTO faqs (question, answer, category) VALUES
('What modules can only the Dean access?', 'Staff Management, Question Bank, and Database Admin are restricted to the Dean role only — HOPs, lecturers, and other staff cannot open these pages.', 'Staff Roles'),
('What modules can only a HOP access?', 'The HOP Dashboard is restricted to the Head of Programme role only. It shows programme-specific analytics that even the Dean cannot view on that page — the Dean instead has a separate Dean Analytics dashboard.', 'Staff Roles'),
('What is the difference between the HOP Dashboard and the Dean Analytics dashboard?', 'The HOP Dashboard shows data scoped to the HOP''s own programme (e.g. BCY or BDS), while the Dean Analytics dashboard aggregates data institution-wide across all programmes and schools.', 'Staff Roles'),
('Which modules can both HOP and Dean access?', 'Student Management, Study Plan Maker, and Weekly Report are all available to both the HOP and Dean roles.', 'Staff Roles'),
('Who can review submitted certificates?', 'Certificate Review is available to HOP, Dean, and Admin roles. Lecturers and students cannot access this page.', 'Staff Roles'),
('Who can approve Lecturer KPI Tracker submissions?', 'Lecturers fill in and submit their own KPI Tracker, but only HOP, Dean, and Admin roles can review and approve those submissions.', 'Staff Roles'),
('Who can access the Course File Register?', 'Lecturers, HOP, Dean, and Admin can all view Course Files, but only HOP, Dean, and Admin can approve or QA-check a submitted course file.', 'Staff Roles'),
('Who can access the Credit Transfer module besides the Dean?', 'HOP, Admin, and Marketing roles can also access Credit Transfer applications, but only the Dean gives final approval in the ''Dean Review'' step.', 'Staff Roles'),
('Who can manage academic terms and semesters?', 'Dean, HOP, and Admin roles can manage academic term/semester settings; other roles cannot.', 'Staff Roles'),
('Can a HOP message the Dean?', 'Yes. A HOP''s Messages contact list automatically includes the Dean plus lecturers within their own programme.', 'Staff Roles'),
('Who appears in a Dean''s Messages contact list?', 'A Dean''s contact list shows the HOPs and lecturers in their school, so the Dean can reach any HOP or lecturer directly.', 'Staff Roles'),
('Does a HOP have access to the QR Scanner?', 'Yes — HOPs get both the QR Generator and QR Scanner in their sidebar, while the Dean only has the QR Generator.', 'Staff Roles'),
('How is a new staff member registered as HOP or Dean?', 'When adding a staff account, the role dropdown includes ''Lecturer'', ''Head of Programme (HOP)'', and ''Dean'' — an authorised staff member selects the appropriate role during registration.', 'Staff Roles'),
('Can a HOP see students outside their own programme?', 'No. A HOP''s access in Student Management and Study Plan Maker is scoped to their own programme, while the Dean can see and manage students in any programme.', 'Staff Roles'),
('Can a HOP view or edit the Question Bank?', 'No, only the Dean can access the Question Bank at all — HOPs cannot view, add, edit, or delete questions there.', 'Staff Roles'),
('What is the highest access level in QMS RISE?', 'The Dean role has the highest access level, combining institution-wide administrative control (Staff Management, Question Bank, Database Admin, Dean Analytics) with all the shared HOP/Dean tools.', 'Staff Roles'),
('What is a Head of Programme (HOP) responsible for in QMS RISE?', 'A HOP oversees one specific programme (e.g. BCY or BDS) — managing its students, study plans, and reviewing lecturer KPI, course file, and certificate submissions within that programme.', 'Staff Roles'),
('Can students see who their Dean is?', 'Yes, the Academic Support page shows the Dean''s contact information alongside the student''s HOP.', 'Staff Roles'),
('Is the Weekly Report the same for HOP and Dean?', 'The Weekly Report module is accessible to both roles and shows the same institution-wide summary — top students, attendance, evaluation averages, and pending complaints.', 'Staff Roles'),
('Can a HOP access Database Admin tools?', 'No, Database Admin (row-level security management, data import, validations, and reports) is restricted to the Dean role only.', 'Staff Roles');
