-- Fix: students cannot see ANY lecturer/HOP/Dean records
-- ---------------------------------------------------------------------------
-- Root cause (confirmed via QA + direct REST testing): the `staff` table's Row
-- Level Security only allows a staff member to read their OWN row
-- ("Staff view own" -> USING (auth.uid() = id)). Students are not rows in
-- `staff`, so every query students run against `staff` returns zero rows.
-- This breaks: the Lecturer Evaluation dropdown, the Messages "To" (HOP)
-- dropdown, and the Academic Support page's HOP/Dean/Lecturer cards.
--
-- Fix: instead of loosening RLS on the raw `staff` table (which also holds
-- pwd_hash and must stay locked down), expose a safe, read-only VIEW with
-- only the columns students legitimately need, and grant SELECT on that view
-- to all authenticated users. The corresponding app code changes read from
-- `staff_directory` instead of `staff` on the three student-facing screens.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE VIEW public.staff_directory AS
SELECT id, name, email, role, programme, school, avatar_url, title, active
FROM public.staff
WHERE active IS DISTINCT FROM false;

GRANT SELECT ON public.staff_directory TO authenticated, anon;

-- ---------------------------------------------------------------------------
-- Assign real lecturers to the 7 BCY (May 2026 intake) courses
-- ---------------------------------------------------------------------------
-- sp_courses has no lecturer column yet. Add one and assign lecturers from the
-- pool of staff already scoped to BCY or to all programmes ("ALL"), so the
-- Academic Support "Your Lecturers" list and Timetable can eventually surface
-- real names instead of staying empty.

ALTER TABLE public.sp_courses ADD COLUMN IF NOT EXISTS lecturer_email text;
ALTER TABLE public.sp_courses ADD COLUMN IF NOT EXISTS lecturer_name text;

-- Round-robin the 5 lecturers currently scoped to BCY/ALL across the 7 BCY
-- Semester 1 (May 2026) courses that the demo student is registered for.
UPDATE public.sp_courses SET lecturer_email = 'lecturer@unimy.edu.my',        lecturer_name = 'Demo Lecturer'                              WHERE programme = 'BCY' AND course_code = 'BCCS1013';
UPDATE public.sp_courses SET lecturer_email = 'norazlinah@unimy.edu.my',      lecturer_name = 'Assoc. Prof. Dr. Nor Azlinah Binti Md Lazam' WHERE programme = 'BCY' AND course_code = 'BCCS1023';
UPDATE public.sp_courses SET lecturer_email = 'rodina@unimy.edu.my',          lecturer_name = 'Assoc. Prof. Dr. Rodina Binti Ahmad'         WHERE programme = 'BCY' AND course_code = 'BCCS1043';
UPDATE public.sp_courses SET lecturer_email = 'habibollah@unimy.edu.my',      lecturer_name = 'Prof. Dr. Habibollah Bin Haron'              WHERE programme = 'BCY' AND course_code = 'BCCS1073';
UPDATE public.sp_courses SET lecturer_email = 'adnan.yahaya@unimy.edu.my',    lecturer_name = 'Prof. Dr. Nor Adnan Bin Yahaya'              WHERE programme = 'BCY' AND course_code = 'MPU3143';
UPDATE public.sp_courses SET lecturer_email = 'lecturer@unimy.edu.my',        lecturer_name = 'Demo Lecturer'                              WHERE programme = 'BCY' AND course_code = 'MPU3193';
UPDATE public.sp_courses SET lecturer_email = 'norazlinah@unimy.edu.my',      lecturer_name = 'Assoc. Prof. Dr. Nor Azlinah Binti Md Lazam' WHERE programme = 'BCY' AND course_code = 'MPU3333';

-- Grant students read access to sp_courses' lecturer columns is already
-- covered by the existing "Authenticated read subjects"-style policies if
-- sp_courses already allows authenticated SELECT; if the table has no SELECT
-- policy for students yet, add one (idempotent):
DROP POLICY IF EXISTS "Authenticated read sp_courses" ON public.sp_courses;
CREATE POLICY "Authenticated read sp_courses" ON public.sp_courses FOR SELECT TO authenticated USING (true);
