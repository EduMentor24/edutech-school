DROP POLICY IF EXISTS schoolci_years_read ON public.edutech_school_years;
CREATE POLICY schoolci_years_read ON public.edutech_school_years
  FOR SELECT USING (status = 'active' OR public.is_edutech_admin());
