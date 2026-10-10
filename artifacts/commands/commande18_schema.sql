-- Migration non destructive pour la gestion des sessions trimestrielles et des rapports archivés (Commande 18)

CREATE TABLE IF NOT EXISTS public.term_evaluation_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_year_id UUID NOT NULL REFERENCES public.school_years(id) ON DELETE CASCADE,
    term_number INTEGER NOT NULL CHECK (term_number IN (1, 2, 3)),
    title TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_open BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(school_year_id, term_number)
);

CREATE TABLE IF NOT EXISTS public.archived_annual_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    school_year_id UUID NOT NULL REFERENCES public.school_years(id) ON DELETE CASCADE,
    school_level TEXT NOT NULL,
    series TEXT NOT NULL,
    lv2_choice TEXT,
    term1_average NUMERIC(4,2),
    term2_average NUMERIC(4,2),
    term3_average NUMERIC(4,2),
    annual_average NUMERIC(4,2),
    final_decision TEXT CHECK (final_decision IN ('Admis', 'Redouble', 'En attente')),
    report_summary TEXT,
    archived_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(student_id, school_year_id)
);

ALTER TABLE public.term_evaluation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archived_annual_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "edutech_term_sessions_select_policy" ON public.term_evaluation_sessions;
CREATE POLICY "edutech_term_sessions_select_policy" ON public.term_evaluation_sessions
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "edutech_term_sessions_admin_policy" ON public.term_evaluation_sessions;
CREATE POLICY "edutech_term_sessions_admin_policy" ON public.term_evaluation_sessions
    FOR ALL USING (is_edutech_admin()) WITH CHECK (is_edutech_admin());

DROP POLICY IF EXISTS "edutech_archived_reports_select_policy" ON public.archived_annual_reports;
CREATE POLICY "edutech_archived_reports_select_policy" ON public.archived_annual_reports
    FOR SELECT USING (is_edutech_admin() OR auth.uid() = student_id);

DROP POLICY IF EXISTS "edutech_archived_reports_admin_policy" ON public.archived_annual_reports;
CREATE POLICY "edutech_archived_reports_admin_policy" ON public.archived_annual_reports
    FOR ALL USING (is_edutech_admin()) WITH CHECK (is_edutech_admin());
