-- Commande 13.1 — Import idempotent Histoire-Géographie Première A1 et A2
-- 7 chapitres, 16 leçons, tous inactifs, vides et non publiés.

DO $$
DECLARE
  v_level_id UUID;
  v_series_a1 UUID;
  v_series_a2 UUID;
  v_subject_hist_id UUID;
  v_subject_geo_id UUID;
  v_offering_hist_a1 UUID;
  v_offering_hist_a2 UUID;
  v_offering_geo_a1 UUID;
  v_offering_geo_a2 UUID;
  v_chapter_id UUID;
BEGIN
  -- 1. Récupérer les IDs de niveau et de série
  SELECT id INTO v_level_id FROM levels WHERE name = 'Première' LIMIT 1;
  SELECT id INTO v_series_a1 FROM series WHERE name = 'A1' LIMIT 1;
  SELECT id INTO v_series_a2 FROM series WHERE name = 'A2' LIMIT 1;

  IF v_level_id IS NULL OR v_series_a1 IS NULL OR v_series_a2 IS NULL THEN
    RAISE EXCEPTION 'Niveau Première ou séries A1/A2 introuvables';
  END IF;

  -- 2. Récupérer les IDs des matières Histoire-Géographie
  SELECT id INTO v_subject_hist_id FROM subjects WHERE name = 'Histoire-Géographie' LIMIT 1;
  -- Note: Si Histoire et Géographie sont dans une seule matière 'Histoire-Géographie' ou séparées, vérifions.
  -- Dans notre audit, la matière unique s'appelle 'Histoire-Géographie'. Créons ou réutilisons 'Histoire-Géographie'.
  IF v_subject_hist_id IS NULL THEN
    INSERT INTO subjects (name, description, is_active)
    VALUES ('Histoire-Géographie', 'Programme officiel Histoire-Géographie', true)
    RETURNING id INTO v_subject_hist_id;
  END IF;

  -- Créons distinctement Histoire et Géographie si nécessaire, ou utilisons la matière existante.
  -- D'après la commande, on doit créer ou réutiliser les matières "Histoire" et "Géographie" si elles sont distinctes, 
  -- ou "Histoire-Géographie". Vérifions les matières existantes en base.
  -- Laissons la création distincte si elles n'existent pas.
  SELECT id INTO v_subject_hist_id FROM subjects WHERE name = 'Histoire' LIMIT 1;
  IF v_subject_hist_id IS NULL THEN
    INSERT INTO subjects (name, description, is_active) VALUES ('Histoire', 'Programme officiel d''Histoire', true) RETURNING id INTO v_subject_hist_id;
  END IF;

  SELECT id INTO v_subject_geo_id FROM subjects WHERE name = 'Géographie' LIMIT 1;
  IF v_subject_geo_id IS NULL THEN
    INSERT INTO subjects (name, description, is_active) VALUES ('Géographie', 'Programme officiel de Géographie', true) RETURNING id INTO v_subject_geo_id;
  END IF;

  -- 3. Offres de cours pour Histoire (A1 et A2)
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order)
  VALUES (v_level_id, v_series_a1, v_subject_hist_id, false, 15)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_offering_hist_a1 FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_a1 AND subject_id = v_subject_hist_id LIMIT 1;

  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order)
  VALUES (v_level_id, v_series_a2, v_subject_hist_id, false, 15)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_offering_hist_a2 FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_a2 AND subject_id = v_subject_hist_id LIMIT 1;

  -- Offres de cours pour Géographie (A1 et A2)
  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order)
  VALUES (v_level_id, v_series_a1, v_subject_geo_id, false, 16)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_offering_geo_a1 FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_a1 AND subject_id = v_subject_geo_id LIMIT 1;

  INSERT INTO course_subject_offerings (level_id, series_id, subject_id, is_published, display_order)
  VALUES (v_level_id, v_series_a2, v_subject_geo_id, false, 16)
  ON CONFLICT DO NOTHING;
  SELECT id INTO v_offering_geo_a2 FROM course_subject_offerings WHERE level_id = v_level_id AND series_id = v_series_a2 AND subject_id = v_subject_geo_id LIMIT 1;


  -- 4. Insertion des 3 Chapitres d'Histoire et de leurs 8 leçons (pour A1 et A2)
  -- Nous bouclons sur les deux offres Histoire (A1 et A2)
  FOR v_offering_hist_id IN SELECT unnest(ARRAY[v_offering_hist_a1, v_offering_hist_a2]) LOOP

    -- Chapitre 1
    INSERT INTO chapters (subject_offering_id, title, description, display_order, is_active)
    VALUES (v_offering_hist_id, 'Le développement du capitalisme et l’industrialisation de l’Europe du XVIIIe au XIXe siècle', '', 1, false)
    ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_offering_hist_id AND title = 'Le développement du capitalisme et l’industrialisation de l’Europe du XVIIIe au XIXe siècle' LIMIT 1;

    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'L’essor du capitalisme et ses conséquences', '', 1, false),
    (v_chapter_id, 'Les révolutions industrielles', '', 2, false)
    ON CONFLICT DO NOTHING;

    -- Chapitre 2
    INSERT INTO chapters (subject_offering_id, title, description, display_order, is_active)
    VALUES (v_offering_hist_id, 'L’impérialisme en Afrique du XIXe à la première moitié du XXe siècle', '', 2, false)
    ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_offering_hist_id AND title = 'L’impérialisme en Afrique du XIXe à la première moitié du XXe siècle' LIMIT 1;

    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Le mouvement impérialiste et le Congrès de Berlin', '', 1, false),
    (v_chapter_id, 'Les résistances aux conquêtes territoriales : exemple de la Côte d’Ivoire', '', 2, false),
    (v_chapter_id, 'La colonisation et les résistances en Côte d’Ivoire', '', 3, false)
    ON CONFLICT DO NOTHING;

    -- Chapitre 3
    INSERT INTO chapters (subject_offering_id, title, description, display_order, is_active)
    VALUES (v_offering_hist_id, 'Les guerres et les violences de masse du XXe siècle à nos jours', '', 3, false)
    ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_offering_hist_id AND title = 'Les guerres et les violences de masse du XXe siècle à nos jours' LIMIT 1;

    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'La Première Guerre mondiale : causes et conséquences', '', 1, false),
    (v_chapter_id, 'La Deuxième Guerre mondiale : causes et conséquences', '', 2, false),
    (v_chapter_id, 'Les violences de masse : les génocides du XXe siècle à nos jours', '', 3, false)
    ON CONFLICT DO NOTHING;

  END LOOP;


  -- 5. Insertion des 4 Chapitres de Géographie et de leurs 8 leçons (pour A1 et A2)
  FOR v_offering_geo_id IN SELECT unnest(ARRAY[v_offering_geo_a1, v_offering_geo_a2]) LOOP

    -- Chapitre 1
    INSERT INTO chapters (subject_offering_id, title, description, display_order, is_active)
    VALUES (v_offering_geo_id, 'Dynamisme démographique de la Côte d’Ivoire et dans le monde', '', 1, false)
    ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_offering_geo_id AND title = 'Dynamisme démographique de la Côte d’Ivoire et dans le monde' LIMIT 1;

    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Dynamisme démographique et qualité de la vie en Côte d’Ivoire', '', 1, false),
    (v_chapter_id, 'Croissance démographique mondiale et ses conséquences', '', 2, false)
    ON CONFLICT DO NOTHING;

    -- Chapitre 2
    INSERT INTO chapters (subject_offering_id, title, description, display_order, is_active)
    VALUES (v_offering_geo_id, 'L’urbanisation dans le monde', '', 2, false)
    ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_offering_geo_id AND title = 'L’urbanisation dans le monde' LIMIT 1;

    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Urbanisation dans les pays en développement : exemple de la Côte d’Ivoire', '', 1, false),
    (v_chapter_id, 'Urbanisation dans les pays développés : exemple de la France', '', 2, false)
    ON CONFLICT DO NOTHING;

    -- Chapitre 3
    INSERT INTO chapters (subject_offering_id, title, description, display_order, is_active)
    VALUES (v_offering_geo_id, 'L’administration et l’aménagement du territoire ivoirien', '', 3, false)
    ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_offering_geo_id AND title = 'L’administration et l’aménagement du territoire ivoirien' LIMIT 1;

    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'Organisation administrative de la Côte d’Ivoire', '', 1, false),
    (v_chapter_id, 'Aménagement du territoire ivoirien', '', 2, false)
    ON CONFLICT DO NOTHING;

    -- Chapitre 4
    INSERT INTO chapters (subject_offering_id, title, description, display_order, is_active)
    VALUES (v_offering_geo_id, 'Le processus de la mondialisation', '', 4, false)
    ON CONFLICT DO NOTHING;
    SELECT id INTO v_chapter_id FROM chapters WHERE subject_offering_id = v_offering_geo_id AND title = 'Le processus de la mondialisation' LIMIT 1;

    INSERT INTO lessons (chapter_id, title, content, display_order, is_active) VALUES
    (v_chapter_id, 'La mondialisation : facteurs et acteurs', '', 1, false),
    (v_chapter_id, 'La mondialisation : manifestations et conséquences', '', 2, false)
    ON CONFLICT DO NOTHING;

  END LOOP;

END $$;
