/**
 * Manifest de récupération du lot Physique-Chimie Terminale C/D publié.
 *
 * La migration de contenu correspondante a déjà été appliquée sur le projet
 * officiel sous la version 20260824144926. Ce fichier ne contient aucune
 * insertion et ne doit pas être transformé en opération de réexécution : les
 * douze leçons sont désormais intentionnellement remplies et publiées.
 */

export const appliedMigration = {
  name: "physics_chemistry_terminal_cd_acid_base_published",
  version: "20260824144926",
  status: "already_applied_do_not_replay",
  doDelimiter: "$pc_cd_acid_base_published_do$",
  contentDelimiter: "$pc_cd_acid_base_published$",
};

export const expectedAssessmentShape = Object.freeze({
  exercises: 2,
  publishedExercises: 2,
  exerciseQuestions: 8,
  quizzes: 2,
  publishedQuizzes: 2,
  quizQuestions: 8,
  quizAnswers: 24,
});

export const targetMatrix = Object.freeze([
  { series: "C", chapter: "CHIMIE ORGANIQUE", title: "Acides carboxyliques et dérivés", order: 30, source: "L4" },
  { series: "C", chapter: "CHIMIE ORGANIQUE", title: "Fabrication d’un savon", order: 40, source: "L5" },
  { series: "C", chapter: "CHIMIE GÉNÉRALE", title: "Solutions aqueuses. Notion de pH", order: 10, source: "L6" },
  { series: "C", chapter: "CHIMIE GÉNÉRALE", title: "Acide fort – Base forte", order: 20, source: "L7" },
  { series: "C", chapter: "CHIMIE GÉNÉRALE", title: "Acide faible – Base faible", order: 40, source: "L8" },
  { series: "C", chapter: "CHIMIE GÉNÉRALE", title: "Couples acide/base-Classification", order: 50, source: "L9" },
  { series: "D", chapter: "CHIMIE ORGANIQUE", title: "Acides carboxyliques et dérivés", order: 40, source: "L4" },
  { series: "D", chapter: "CHIMIE ORGANIQUE", title: "Fabrication d’un savon", order: 60, source: "L5" },
  { series: "D", chapter: "CHIMIE GÉNÉRALE", title: "Solutions aqueuses. Notion de pH", order: 10, source: "L6" },
  { series: "D", chapter: "CHIMIE GÉNÉRALE", title: "Acide fort – Base forte", order: 20, source: "L7" },
  { series: "D", chapter: "CHIMIE GÉNÉRALE", title: "Acide faible – Base faible", order: 40, source: "L8" },
  { series: "D", chapter: "CHIMIE GÉNÉRALE", title: "Couples acide/base - Classification", order: 50, source: "L9" },
]);

/**
 * Contrat historique de l’opération qui a été exécutée une seule fois.
 * Les étiquettes de dollar-quote sont volontairement distinctes afin que les
 * contenus SQL longs ne ferment jamais le bloc DO par collision de délimiteur.
 */
export const originalOperationGuarantees = Object.freeze([
  "lecture intégrale des six PDF avant rédaction",
  "rattachement ciblé aux structures C/D existantes",
  "création de structure seulement si une cible manquait",
  "écrasement interdit lorsque le contenu d’une leçon était déjà non vide",
  "duplication interdite lorsqu’un exercice ou quiz existait déjà",
  "publication et activation immédiates explicitement demandées",
  "cours, exercices corrigés et quiz strictement séparés",
]);

export function buildRecoveryAuditSummary() {
  return {
    migration: appliedMigration,
    targetCount: targetMatrix.length,
    perLesson: expectedAssessmentShape,
    aggregate: {
      lessons: targetMatrix.length,
      exercises: targetMatrix.length * expectedAssessmentShape.exercises,
      exerciseQuestions: targetMatrix.length * expectedAssessmentShape.exerciseQuestions,
      quizzes: targetMatrix.length * expectedAssessmentShape.quizzes,
      quizQuestions: targetMatrix.length * expectedAssessmentShape.quizQuestions,
      quizAnswers: targetMatrix.length * expectedAssessmentShape.quizAnswers,
    },
  };
}
