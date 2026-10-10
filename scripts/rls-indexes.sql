-- Index pour optimiser les politiques RLS sur la table profiles
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_school_level ON public.profiles(school_level);
CREATE INDEX IF NOT EXISTS idx_profiles_series ON public.profiles(series);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);

-- Index pour optimiser les politiques RLS sur les tables pédagogiques
CREATE INDEX IF NOT EXISTS idx_lessons_is_active ON public.edutech_lessons(is_active);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON public.edutech_lessons(published);
CREATE INDEX IF NOT EXISTS idx_lessons_subject_id ON public.edutech_lessons(subject_id);
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id ON public.edutech_lessons(chapter_id);

-- Index pour optimiser les politiques RLS sur les exercices et quiz
CREATE INDEX IF NOT EXISTS idx_exercises_is_active ON public.edutech_exercises(is_active);
CREATE INDEX IF NOT EXISTS idx_exercises_published ON public.edutech_exercises(published);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON public.edutech_exercises(lesson_id);

CREATE INDEX IF NOT EXISTS idx_quizzes_is_active ON public.edutech_quizzes(is_active);
CREATE INDEX IF NOT EXISTS idx_quizzes_published ON public.edutech_quizzes(published);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON public.edutech_quizzes(lesson_id);

-- Index pour optimiser les requêtes de progression
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON public.user_progress(completed);

-- Index pour optimiser les notifications
CREATE INDEX IF NOT EXISTS idx_notifications_target_type ON public.edutech_notifications(target_type);
CREATE INDEX IF NOT EXISTS idx_notifications_target_user_id ON public.edutech_notifications(target_user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_active ON public.edutech_notifications(is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.edutech_notifications(created_at DESC);

-- Index pour optimiser les requêtes de bulletin
CREATE INDEX IF NOT EXISTS idx_bulletin_entries_user_id ON public.edutech_bulletin_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_bulletin_entries_school_year ON public.edutech_bulletin_entries(school_year_id);

-- Index pour optimiser les requêtes de citations
CREATE INDEX IF NOT EXISTS idx_citations_is_active ON public.edutech_citations(is_active);
CREATE INDEX IF NOT EXISTS idx_citations_published ON public.edutech_citations(published);
CREATE INDEX IF NOT EXISTS idx_citations_subject_id ON public.edutech_citations(subject_id);

-- Index pour optimiser les requêtes de mentor
CREATE INDEX IF NOT EXISTS idx_mentor_history_user_id ON public.edutech_mentor_history(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_history_created_at ON public.edutech_mentor_history(created_at DESC);
