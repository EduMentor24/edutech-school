-- Commande 14 — Import idempotent Première C et Première D (DPFC 2025-2026)
-- Matières communes et spécifiques, chapitres et leçons vides, inactifs et non publiés.

DO $$
DECLARE
  v_level_id UUID;
  v_series_c UUID;
  v_series_d UUID;
  -- Matières
  v_sub_fr UUID;
  v_sub_en UUID;
  v_sub_es UUID;
  v_sub_math_c UUID;
  v_sub_math_d UUID;
  v_sub_phil UUID;
  v_sub_pc_c UUID;
  v_sub_pc_d UUID;
  v_sub_svt_c UUID;
  v_sub_svt_d UUID;
  v_sub_hg UUID;
  -- Offres
  v_off_fr_c UUID;
  v_off_fr_d UUID;
  v_off_en_c UUID;
  v_off_en_d UUID;
  v_off_math_c UUID;
  v_off_math_d UUID;
  v_off_phil_c UUID;
  v_off_phil_d UUID;
  v_off_pc_c UUID;
  v_off_pc_d UUID;
  v_off_svt_c UUID;
  v_off_svt_d UUID;
  v_off_hg_c UUID;
  v_off_hg_d UUID;
  v_chapter_id UUID;
  v_off_id UUID;
BEGIN
  -- 1. Niveau et Séries
  SELECT id INTO v_level_id FROM levels WHERE name = 'Première' LIMIT 1;
  SELECT id INTO v_series_c FROM series WHERE name = 'C' LIMIT 1;
  SELECT id INTO v_series_d FROM series WHERE name = 'D' LIMIT 1;

  IF v_level_id IS NULL OR v_series_c IS NULL OR v_series_d IS NULL THEN
    RAISE EXCEPTION 'Niveau Première ou séries C/D introuvables en base.';
  END IF;

  -- 2. Matières (réutilisation ou création)
  SELECT id INTO v_sub_fr FROM subjects WHERE name = 'Français' LIMIT 1;
  IF v_sub_fr IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Français', 'Français Second Cycle', true) RETURNING id INTO v_sub_fr; END IF;

  SELECT id INTO v_sub_en FROM subjects WHERE name = 'Anglais' LIMIT 1;
  IF v_sub_en IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Anglais', 'Anglais Second Cycle', true) RETURNING id INTO v_sub_en; END IF;

  SELECT id INTO v_sub_es FROM subjects WHERE name = 'Espagnol' LIMIT 1;
  IF v_sub_es IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Espagnol', 'Espagnol Second Cycle', true) RETURNING id INTO v_sub_es; END IF;

  SELECT id INTO v_sub_math_c FROM subjects WHERE name = 'Mathématiques (C)' LIMIT 1;
  IF v_sub_math_c IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Mathématiques (C)', 'Mathématiques Première C', true) RETURNING id INTO v_sub_math_c; END IF;

  SELECT id INTO v_sub_math_d FROM subjects WHERE name = 'Mathématiques (D)' LIMIT 1;
  IF v_sub_math_d IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Mathématiques (D)', 'Mathématiques Première D', true) RETURNING id INTO v_sub_math_d; END IF;

  SELECT id INTO v_sub_phil FROM subjects WHERE name = 'Philosophie' LIMIT 1;
  IF v_sub_phil IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Philosophie', 'Philosophie Premières C-D-E', true) RETURNING id INTO v_sub_phil; END IF;

  SELECT id INTO v_sub_pc_c FROM subjects WHERE name = 'Physique-Chimie (C)' LIMIT 1;
  IF v_sub_pc_c IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Physique-Chimie (C)', 'Physique-Chimie Première C', true) RETURNING id INTO v_sub_pc_c; END IF;

  SELECT id INTO v_sub_pc_d FROM subjects WHERE name = 'Physique-Chimie (D)' LIMIT 1;
  IF v_sub_pc_d IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Physique-Chimie (D)', 'Physique-Chimie Première D', true) RETURNING id INTO v_sub_pc_d; END IF;

  SELECT id INTO v_sub_svt_c FROM subjects WHERE name = 'Sciences de la Vie et de la Terre (C)' LIMIT 1;
  IF v_sub_svt_c IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Sciences de la Vie et de la Terre (C)', 'SVT Première C', true) RETURNING id INTO v_sub_svt_c; END IF;

  SELECT id INTO v_sub_svt_d FROM subjects WHERE name = 'Sciences de la Vie et de la Terre (D)' LIMIT 1;
  IF v_sub_svt_d IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Sciences de la Vie et de la Terre (D)', 'SVT Première D', true) RETURNING id INTO v_sub_svt_d; END IF;

  SELECT id INTO v_sub_hg FROM subjects WHERE name = 'Histoire-Géographie' LIMIT 1;
  IF v_sub_hg IS NULL THEN INSERT INTO subjects (name, description, is_active) VALUES ('Histoire-Géographie', 'Histoire-Géographie Second Cycle', true) RETURNING id INTO v_sub_hg; END IF;

  -- 3. Offres de cours Première C et D
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_c, v_sub_fr, false, 1) ON CONFLICT DO NOTHING;
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_d, v_sub_fr, false, 1) ON CONFLICT DO NOTHING;
  
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_c, v_sub_en, false, 2) ON CONFLICT DO NOTHING;
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_d, v_sub_en, false, 2) ON CONFLICT DO NOTHING;

  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_c, v_sub_math_c, false, 3) ON CONFLICT DO NOTHING;
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_d, v_sub_math_d, false, 3) ON CONFLICT DO NOTHING;

  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_c, v_sub_phil, false, 4) ON CONFLICT DO NOTHING;
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_d, v_sub_phil, false, 4) ON CONFLICT DO NOTHING;

  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_c, v_sub_pc_c, false, 5) ON CONFLICT DO NOTHING;
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_d, v_sub_pc_d, false, 5) ON CONFLICT DO NOTHING;

  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_c, v_sub_svt_c, false, 6) ON CONFLICT DO NOTHING;
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_d, v_sub_svt_d, false, 6) ON CONFLICT DO NOTHING;

  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_c, v_sub_hg, false, 7) ON CONFLICT DO NOTHING;
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order) VALUES (v_level_id, v_series_d, v_sub_hg, false, 7) ON CONFLICT DO NOTHING;

  -- Récupération des IDs d'offres pour l'insertion des chapitres et leçons
  SELECT id INTO v_off_math_c FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_c AND subject_id = v_sub_math_c LIMIT 1;
  SELECT id INTO v_off_math_d FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_d AND subject_id = v_sub_math_d LIMIT 1;
  SELECT id INTO v_off_phil_c FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_c AND subject_id = v_sub_phil LIMIT 1;
  SELECT id INTO v_off_phil_d FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_d AND subject_id = v_sub_phil LIMIT 1;
  SELECT id INTO v_off_pc_c FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_c AND subject_id = v_sub_pc_c LIMIT 1;
  SELECT id INTO v_off_pc_d FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_d AND subject_id = v_sub_pc_d LIMIT 1;
  SELECT id INTO v_off_svt_c FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_c AND subject_id = v_sub_svt_c LIMIT 1;
  SELECT id INTO v_off_svt_d FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_d AND subject_id = v_sub_svt_d LIMIT 1;

  -- 4. Insertion Mathématiques Première C (Éléments officiels DPFC)
  IF v_off_math_c IS NOT NULL THEN
    -- Chapitre 1
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_math_c, v_sub_math_c, 'Équations et inéquations du second degré dans R', '', 1, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_math_c AND title = 'Équations et inéquations du second degré dans R' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Généralités sur le trinôme du second degré', '', 1, false),
    (v_chapter_id, 'Résolution d’équations et inéquations', '', 2, false) ON CONFLICT DO NOTHING;

    -- Chapitre 2
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_math_c, v_sub_math_c, 'Angles orientés et trigonométrie', '', 2, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_math_c AND title = 'Angles orientés et trigonométrie' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Rendus et mesure principale', '', 1, false),
    (v_chapter_id, 'Formules trigonométriques', '', 2, false) ON CONFLICT DO NOTHING;

    -- Chapitre 3
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_math_c, v_sub_math_c, 'Généralités sur les fonctions', '', 3, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_math_c AND title = 'Généralités sur les fonctions' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Domaine de définition et variations', '', 1, false),
    (v_chapter_id, 'Parité et périodicité', '', 2, false) ON CONFLICT DO NOTHING;
  END IF;

  -- 5. Insertion Mathématiques Première D
  IF v_off_math_d IS NOT NULL THEN
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_math_d, v_sub_math_d, 'Calcul algébrique et polynômes en Première D', '', 1, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_math_d AND title = 'Calcul algébrique et polynômes en Première D' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Polynômes et fractions rationnelles', '', 1, false),
    (v_chapter_id, 'Équations paramétriques', '', 2, false) ON CONFLICT DO NOTHING;
  END IF;

  -- 6. Insertion Philosophie (Commune C-D-E)
  FOR v_off_id IN SELECT unnest(ARRAY[v_off_phil_c, v_off_phil_d]) LOOP
    IF v_off_id IS NOT NULL THEN
      INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
      VALUES (v_off_id, v_sub_phil, 'L’activité philosophique', '', 1, false) ON CONFLICT DO NOTHING;
      SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_id AND title = 'L’activité philosophique' LIMIT 1;
      INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
      (v_chapter_id, 'Qu’est-ce que la philosophie ?', '', 1, false),
      (v_chapter_id, 'Mythe et raison', '', 2, false) ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;

  -- 7. Insertion Physique-Chimie Première C et D
  IF v_off_pc_c IS NOT NULL THEN
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_pc_c, v_sub_pc_c, 'Mécanique newtonienne — Première C', '', 1, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_pc_c AND title = 'Mécanique newtonienne — Première C' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Cinématique du point mobile', '', 1, false),
    (v_chapter_id, 'Lois de Newton et applications', '', 2, false) ON CONFLICT DO NOTHING;
  END IF;

  IF v_off_pc_d IS NOT NULL THEN
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_pc_d, v_sub_pc_d, 'Mécanique et électricité — Première D', '', 1, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_pc_d AND title = 'Mécanique et électricité — Première D' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Mouvements plans et forces', '', 1, false),
    (v_chapter_id, 'Circuits électriques en régime permanent', '', 2, false) ON CONFLICT DO NOTHING;
  END IF;

  -- 8. Insertion SVT Première C et D
  IF v_off_svt_c IS NOT NULL THEN
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_svt_c, v_sub_svt_c, 'Biologie cellulaire et moléculaire', '', 1, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_svt_c AND title = 'Biologie cellulaire et moléculaire' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Structure de l’ADN et réplication', '', 1, false),
    (v_chapter_id, 'Synthèse des protéines', '', 2, false) ON CONFLICT DO NOTHING;
  END IF;

  IF v_off_svt_d IS NOT NULL THEN
    INSERT INTO chapters (subject_offering_id, subject_id, title, description, display_order, is_active)
    VALUES (v_off_svt_d, v_sub_svt_d, 'Géologie et tectonique des plaques', '', 1, false) ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_off_svt_d AND title = 'Géologie et tectonique des plaques' LIMIT 1;
    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'La tectonique des plaques et le magmatisme', '', 1, false),
    (v_chapter_id, 'La glycométabolisme et régulation', '', 2, false) ON CONFLICT DO NOTHING;
  END IF;

END $$;
