-- Commande 17 — Socle administratif historique et sécurisé.
-- Cette migration ne supprime ni ne réécrit les données scolaires existantes.

ALTER TABLE public.edutech_school_years
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS closed_at timestamptz,
  ADD COLUMN IF NOT EXISTS closed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS notes text;

CREATE UNIQUE INDEX IF NOT EXISTS edutech_school_years_one_active_idx
  ON public.edutech_school_years ((1))
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS public.edutech_student_school_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  school_year_id uuid NOT NULL REFERENCES public.edutech_school_years(id) ON DELETE RESTRICT,
  school_year text NOT NULL,
  school_level text NOT NULL CHECK (school_level IN ('Première', 'Terminale')),
  series text NOT NULL CHECK (series IN ('A1', 'A2', 'C', 'D')),
  lv2_choice text CHECK (lv2_choice IS NULL OR lv2_choice IN ('Allemand', 'Espagnol')),
  t1_average numeric(5,2) CHECK (t1_average IS NULL OR (t1_average >= 0 AND t1_average <= 20)),
  t2_average numeric(5,2) CHECK (t2_average IS NULL OR (t2_average >= 0 AND t2_average <= 20)),
  t3_average numeric(5,2) CHECK (t3_average IS NULL OR (t3_average >= 0 AND t3_average <= 20)),
  annual_average numeric(5,2) CHECK (annual_average IS NULL OR (annual_average >= 0 AND annual_average <= 20)),
  promotion_decision text NOT NULL DEFAULT 'pending' CHECK (promotion_decision IN ('pending', 'admitted', 'repeat')),
  class_change_count integer NOT NULL DEFAULT 0 CHECK (class_change_count >= 0),
  record_status text NOT NULL DEFAULT 'active' CHECK (record_status IN ('active', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  UNIQUE(student_id, school_year_id)
);

CREATE INDEX IF NOT EXISTS edutech_student_school_history_student_idx
  ON public.edutech_student_school_history(student_id, school_year_id);

CREATE TABLE IF NOT EXISTS public.edutech_class_change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  school_year_id uuid NOT NULL REFERENCES public.edutech_school_years(id) ON DELETE RESTRICT,
  school_year text NOT NULL,
  old_school_level text NOT NULL CHECK (old_school_level IN ('Première', 'Terminale')),
  old_series text NOT NULL CHECK (old_series IN ('A1', 'A2', 'C', 'D')),
  new_school_level text NOT NULL CHECK (new_school_level IN ('Première', 'Terminale')),
  new_series text NOT NULL CHECK (new_series IN ('A1', 'A2', 'C', 'D')),
  reason text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'auto_approved')),
  is_automatic boolean NOT NULL DEFAULT false,
  reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (old_school_level <> new_school_level OR old_series <> new_series)
);

CREATE INDEX IF NOT EXISTS edutech_class_change_requests_student_idx
  ON public.edutech_class_change_requests(student_id, school_year_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS edutech_one_pending_class_request_idx
  ON public.edutech_class_change_requests(student_id, school_year_id)
  WHERE status = 'pending';

CREATE OR REPLACE FUNCTION public.edutech_touch_school_admin_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS edutech_touch_school_history ON public.edutech_student_school_history;
CREATE TRIGGER edutech_touch_school_history
  BEFORE UPDATE ON public.edutech_student_school_history
  FOR EACH ROW EXECUTE FUNCTION public.edutech_touch_school_admin_updated_at();

DROP TRIGGER IF EXISTS edutech_touch_class_change_requests ON public.edutech_class_change_requests;
CREATE TRIGGER edutech_touch_class_change_requests
  BEFORE UPDATE ON public.edutech_class_change_requests
  FOR EACH ROW EXECUTE FUNCTION public.edutech_touch_school_admin_updated_at();

CREATE OR REPLACE FUNCTION public.schoolci_guard_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_edutech_admin() THEN
    NEW.email := OLD.email;
    NEW.role := OLD.role;
    NEW.is_active := OLD.is_active;
    NEW.status := OLD.status;
    IF COALESCE(current_setting('app.edutech_allow_school_update', true), 'false') <> 'true' THEN
      NEW.school_level := OLD.school_level;
      NEW.series := OLD.series;
      NEW.level_id := OLD.level_id;
      NEW.series_id := OLD.series_id;
      NEW.school_year := OLD.school_year;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

ALTER TABLE public.edutech_school_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edutech_student_school_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edutech_class_change_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS edutech_school_years_all ON public.edutech_school_years;
DROP POLICY IF EXISTS schoolci_years_read ON public.edutech_school_years;
DROP POLICY IF EXISTS schoolci_years_admin ON public.edutech_school_years;
CREATE POLICY schoolci_years_read ON public.edutech_school_years
  FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY schoolci_years_admin ON public.edutech_school_years
  FOR ALL USING (public.is_edutech_admin()) WITH CHECK (public.is_edutech_admin());

DROP POLICY IF EXISTS edutech_profiles_admin_select ON public.profiles;
DROP POLICY IF EXISTS edutech_profiles_admin_update ON public.profiles;
CREATE POLICY edutech_profiles_admin_select ON public.profiles
  FOR SELECT USING (public.is_edutech_admin());
CREATE POLICY edutech_profiles_admin_update ON public.profiles
  FOR UPDATE USING (public.is_edutech_admin()) WITH CHECK (public.is_edutech_admin());

CREATE POLICY edutech_school_history_student_read ON public.edutech_student_school_history
  FOR SELECT USING (student_id = auth.uid() OR public.is_edutech_admin());
CREATE POLICY edutech_school_history_admin_manage ON public.edutech_student_school_history
  FOR ALL USING (public.is_edutech_admin()) WITH CHECK (public.is_edutech_admin());

CREATE POLICY edutech_class_request_student_read ON public.edutech_class_change_requests
  FOR SELECT USING (student_id = auth.uid() OR public.is_edutech_admin());
CREATE POLICY edutech_class_request_admin_manage ON public.edutech_class_change_requests
  FOR ALL USING (public.is_edutech_admin()) WITH CHECK (public.is_edutech_admin());

CREATE OR REPLACE FUNCTION public.edutech_log_school_action(
  p_action text,
  p_resource_type text,
  p_resource_id text,
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.edutech_activity_logs(actor_id, action, resource_type, resource_id, payload)
  VALUES (auth.uid(), p_action, p_resource_type, p_resource_id, COALESCE(p_payload, '{}'::jsonb));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_create_school_year(
  p_name text,
  p_starts_on date DEFAULT NULL,
  p_ends_on date DEFAULT NULL,
  p_notes text DEFAULT NULL
)
RETURNS public.edutech_school_years
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_year public.edutech_school_years;
BEGIN
  IF NOT public.is_edutech_admin() THEN RAISE EXCEPTION 'Accès administrateur requis'; END IF;
  IF p_name !~ '^\d{4}-\d{4}$' OR substring(p_name, 1, 4)::integer + 1 <> substring(p_name, 6, 4)::integer THEN
    RAISE EXCEPTION 'Le format de l’année scolaire doit être AAAA-AAAA avec deux années consécutives';
  END IF;
  INSERT INTO public.edutech_school_years(name, starts_on, ends_on, status, created_by, notes)
  VALUES (trim(p_name), p_starts_on, p_ends_on, 'draft', auth.uid(), NULLIF(trim(p_notes), ''))
  RETURNING * INTO v_year;
  PERFORM public.edutech_log_school_action('school_year_created', 'school_year', v_year.id::text, jsonb_build_object('name', v_year.name));
  RETURN v_year;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_activate_school_year(p_school_year_id uuid)
RETURNS public.edutech_school_years
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_year public.edutech_school_years;
BEGIN
  IF NOT public.is_edutech_admin() THEN RAISE EXCEPTION 'Accès administrateur requis'; END IF;
  SELECT * INTO v_year FROM public.edutech_school_years WHERE id = p_school_year_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Année scolaire introuvable'; END IF;
  IF v_year.status = 'archived' THEN RAISE EXCEPTION 'Une année archivée ne peut pas être réactivée'; END IF;
  IF EXISTS (SELECT 1 FROM public.edutech_school_years WHERE status = 'active' AND id <> p_school_year_id) THEN
    RAISE EXCEPTION 'Clôturez l’année scolaire active avant d’en activer une autre';
  END IF;
  UPDATE public.edutech_school_years SET status = 'active', closed_at = NULL, closed_by = NULL WHERE id = p_school_year_id RETURNING * INTO v_year;
  PERFORM public.edutech_log_school_action('school_year_activated', 'school_year', v_year.id::text, jsonb_build_object('name', v_year.name));
  RETURN v_year;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_close_school_year(p_school_year_id uuid)
RETURNS public.edutech_school_years
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_year public.edutech_school_years;
BEGIN
  IF NOT public.is_edutech_admin() THEN RAISE EXCEPTION 'Accès administrateur requis'; END IF;
  SELECT * INTO v_year FROM public.edutech_school_years WHERE id = p_school_year_id FOR UPDATE;
  IF NOT FOUND OR v_year.status <> 'active' THEN RAISE EXCEPTION 'Seule l’année scolaire active peut être clôturée'; END IF;
  UPDATE public.edutech_school_years SET status = 'closed', closed_at = now(), closed_by = auth.uid() WHERE id = p_school_year_id RETURNING * INTO v_year;
  UPDATE public.edutech_student_school_history SET record_status = 'archived' WHERE school_year_id = p_school_year_id;
  PERFORM public.edutech_log_school_action('school_year_closed', 'school_year', v_year.id::text, jsonb_build_object('name', v_year.name));
  RETURN v_year;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_archive_school_year(p_school_year_id uuid)
RETURNS public.edutech_school_years
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_year public.edutech_school_years;
BEGIN
  IF NOT public.is_edutech_admin() THEN RAISE EXCEPTION 'Accès administrateur requis'; END IF;
  SELECT * INTO v_year FROM public.edutech_school_years WHERE id = p_school_year_id FOR UPDATE;
  IF NOT FOUND OR v_year.status <> 'closed' THEN RAISE EXCEPTION 'Seule une année clôturée peut être archivée'; END IF;
  UPDATE public.edutech_school_years SET status = 'archived', archived_at = now(), archived_by = auth.uid() WHERE id = p_school_year_id RETURNING * INTO v_year;
  PERFORM public.edutech_log_school_action('school_year_archived', 'school_year', v_year.id::text, jsonb_build_object('name', v_year.name));
  RETURN v_year;
END;
$$;

CREATE OR REPLACE FUNCTION public.student_change_school_class(
  p_new_school_level text,
  p_new_series text,
  p_reason text DEFAULT NULL
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_profile public.profiles; v_year public.edutech_school_years; v_used boolean;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentification requise'; END IF;
  IF p_new_school_level NOT IN ('Première', 'Terminale') OR p_new_series NOT IN ('A1', 'A2', 'C', 'D') THEN RAISE EXCEPTION 'Niveau ou série invalide'; END IF;
  SELECT * INTO v_profile FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF NOT FOUND OR v_profile.role <> 'student' THEN RAISE EXCEPTION 'Cette action est réservée aux élèves'; END IF;
  SELECT * INTO v_year FROM public.edutech_school_years WHERE status = 'active' FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Aucune année scolaire active n’est configurée'; END IF;
  IF v_profile.school_level = p_new_school_level AND v_profile.series = p_new_series THEN RAISE EXCEPTION 'La classe demandée correspond déjà à votre profil'; END IF;
  SELECT EXISTS(SELECT 1 FROM public.edutech_class_change_requests WHERE student_id = auth.uid() AND school_year_id = v_year.id AND status IN ('auto_approved', 'accepted')) INTO v_used;
  IF v_used THEN
    IF EXISTS (SELECT 1 FROM public.edutech_class_change_requests WHERE student_id = auth.uid() AND school_year_id = v_year.id AND status = 'pending') THEN
      RAISE EXCEPTION 'Une demande de modification est déjà en attente';
    END IF;
    INSERT INTO public.edutech_class_change_requests(student_id, school_year_id, school_year, old_school_level, old_series, new_school_level, new_series, reason, status, is_automatic)
    VALUES (auth.uid(), v_year.id, v_year.name, v_profile.school_level, v_profile.series, p_new_school_level, p_new_series, NULLIF(trim(p_reason), ''), 'pending', false);
    PERFORM public.edutech_log_school_action('class_change_requested', 'class_change_request', NULL, jsonb_build_object('school_year', v_year.name, 'from_level', v_profile.school_level, 'from_series', v_profile.series, 'to_level', p_new_school_level, 'to_series', p_new_series));
    RETURN 'pending';
  END IF;
  PERFORM set_config('app.edutech_allow_school_update', 'true', true);
  UPDATE public.profiles SET school_level = p_new_school_level, series = p_new_series, school_year = v_year.name WHERE id = auth.uid();
  INSERT INTO public.edutech_student_school_history(student_id, school_year_id, school_year, school_level, series, lv2_choice, class_change_count, created_by)
  VALUES (auth.uid(), v_year.id, v_year.name, p_new_school_level, p_new_series, v_profile.lv2_choice, 1, auth.uid())
  ON CONFLICT (student_id, school_year_id) DO UPDATE SET school_level = EXCLUDED.school_level, series = EXCLUDED.series, lv2_choice = EXCLUDED.lv2_choice, class_change_count = public.edutech_student_school_history.class_change_count + 1, record_status = 'active';
  INSERT INTO public.edutech_class_change_requests(student_id, school_year_id, school_year, old_school_level, old_series, new_school_level, new_series, reason, status, is_automatic, reviewed_by, reviewed_at)
  VALUES (auth.uid(), v_year.id, v_year.name, v_profile.school_level, v_profile.series, p_new_school_level, p_new_series, NULLIF(trim(p_reason), ''), 'auto_approved', true, auth.uid(), now());
  PERFORM public.edutech_log_school_action('class_change_auto_approved', 'profile', auth.uid()::text, jsonb_build_object('school_year', v_year.name, 'new_level', p_new_school_level, 'new_series', p_new_series));
  RETURN 'applied';
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_review_class_change_request(
  p_request_id uuid,
  p_accept boolean,
  p_review_note text DEFAULT NULL
)
RETURNS public.edutech_class_change_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_request public.edutech_class_change_requests; v_profile public.profiles;
BEGIN
  IF NOT public.is_edutech_admin() THEN RAISE EXCEPTION 'Accès administrateur requis'; END IF;
  SELECT * INTO v_request FROM public.edutech_class_change_requests WHERE id = p_request_id FOR UPDATE;
  IF NOT FOUND OR v_request.status <> 'pending' THEN RAISE EXCEPTION 'Cette demande ne peut plus être examinée'; END IF;
  IF p_accept THEN
    PERFORM set_config('app.edutech_allow_school_update', 'true', true);
    UPDATE public.profiles SET school_level = v_request.new_school_level, series = v_request.new_series, school_year = v_request.school_year WHERE id = v_request.student_id RETURNING * INTO v_profile;
    INSERT INTO public.edutech_student_school_history(student_id, school_year_id, school_year, school_level, series, lv2_choice, class_change_count, created_by)
    VALUES (v_request.student_id, v_request.school_year_id, v_request.school_year, v_request.new_school_level, v_request.new_series, v_profile.lv2_choice, 1, auth.uid())
    ON CONFLICT (student_id, school_year_id) DO UPDATE SET school_level = EXCLUDED.school_level, series = EXCLUDED.series, lv2_choice = EXCLUDED.lv2_choice, class_change_count = public.edutech_student_school_history.class_change_count + 1, record_status = 'active';
    UPDATE public.edutech_class_change_requests SET status = 'accepted', reviewed_by = auth.uid(), reviewed_at = now(), review_note = NULLIF(trim(p_review_note), '') WHERE id = p_request_id RETURNING * INTO v_request;
    PERFORM public.edutech_log_school_action('class_change_accepted', 'class_change_request', v_request.id::text, jsonb_build_object('student_id', v_request.student_id, 'school_year', v_request.school_year));
  ELSE
    UPDATE public.edutech_class_change_requests SET status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now(), review_note = NULLIF(trim(p_review_note), '') WHERE id = p_request_id RETURNING * INTO v_request;
    PERFORM public.edutech_log_school_action('class_change_rejected', 'class_change_request', v_request.id::text, jsonb_build_object('student_id', v_request.student_id, 'school_year', v_request.school_year));
  END IF;
  RETURN v_request;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_record_promotion_decision(
  p_student_id uuid,
  p_school_year_id uuid,
  p_decision text,
  p_next_school_level text DEFAULT NULL,
  p_next_series text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_source public.edutech_school_years; v_active public.edutech_school_years; v_profile public.profiles;
BEGIN
  IF NOT public.is_edutech_admin() THEN RAISE EXCEPTION 'Accès administrateur requis'; END IF;
  IF p_decision NOT IN ('pending', 'admitted', 'repeat') THEN RAISE EXCEPTION 'Décision invalide'; END IF;
  SELECT * INTO v_source FROM public.edutech_school_years WHERE id = p_school_year_id;
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_student_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Élève introuvable'; END IF;
  INSERT INTO public.edutech_student_school_history(student_id, school_year_id, school_year, school_level, series, lv2_choice, promotion_decision, created_by)
  VALUES (p_student_id, v_source.id, v_source.name, v_profile.school_level, v_profile.series, v_profile.lv2_choice, p_decision, auth.uid())
  ON CONFLICT (student_id, school_year_id) DO UPDATE SET promotion_decision = EXCLUDED.promotion_decision;
  IF p_decision = 'admitted' AND p_next_school_level IS NOT NULL AND p_next_series IS NOT NULL THEN
    SELECT * INTO v_active FROM public.edutech_school_years WHERE status = 'active';
    IF NOT FOUND OR v_active.id = v_source.id THEN RAISE EXCEPTION 'Activez la nouvelle année scolaire avant d’inscrire l’élève dans sa classe suivante'; END IF;
    PERFORM set_config('app.edutech_allow_school_update', 'true', true);
    UPDATE public.profiles SET school_level = p_next_school_level, series = p_next_series, school_year = v_active.name WHERE id = p_student_id;
    INSERT INTO public.edutech_student_school_history(student_id, school_year_id, school_year, school_level, series, lv2_choice, created_by)
    VALUES (p_student_id, v_active.id, v_active.name, p_next_school_level, p_next_series, v_profile.lv2_choice, auth.uid())
    ON CONFLICT (student_id, school_year_id) DO UPDATE SET school_level = EXCLUDED.school_level, series = EXCLUDED.series, lv2_choice = EXCLUDED.lv2_choice, record_status = 'active';
  END IF;
  PERFORM public.edutech_log_school_action('promotion_decision_recorded', 'student_school_history', p_student_id::text, jsonb_build_object('school_year', v_source.name, 'decision', p_decision));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_set_student_account_status(p_student_id uuid, p_is_active boolean)
RETURNS public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_profile public.profiles;
BEGIN
  IF NOT public.is_edutech_admin() THEN RAISE EXCEPTION 'Accès administrateur requis'; END IF;
  IF p_student_id = auth.uid() THEN RAISE EXCEPTION 'Un administrateur ne peut pas modifier son propre statut par cette action'; END IF;
  UPDATE public.profiles SET is_active = p_is_active, status = CASE WHEN p_is_active THEN 'active' ELSE 'inactive' END WHERE id = p_student_id RETURNING * INTO v_profile;
  IF NOT FOUND THEN RAISE EXCEPTION 'Utilisateur introuvable'; END IF;
  PERFORM public.edutech_log_school_action(CASE WHEN p_is_active THEN 'account_reactivated' ELSE 'account_deactivated' END, 'profile', p_student_id::text, jsonb_build_object('email', v_profile.email));
  RETURN v_profile;
END;
$$;

REVOKE ALL ON FUNCTION public.edutech_log_school_action(text,text,text,jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_create_school_year(text,date,date,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_activate_school_year(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_close_school_year(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_archive_school_year(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.student_change_school_class(text,text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_review_class_change_request(uuid,boolean,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_record_promotion_decision(uuid,uuid,text,text,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_set_student_account_status(uuid,boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_create_school_year(text,date,date,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_activate_school_year(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_close_school_year(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_archive_school_year(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.student_change_school_class(text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_review_class_change_request(uuid,boolean,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_record_promotion_decision(uuid,uuid,text,text,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_student_account_status(uuid,boolean) TO authenticated;
