import type { LiveCodingExercise, Flashcard, StudyPlanItem } from '../types/content'
import type { CompanyProfile } from '../types/company'

export type CompletionMap = Record<string, boolean>

export function toggleCompletion(map: CompletionMap, id: string): CompletionMap {
  return {
    ...map,
    [id]: !map[id],
  }
}

export function countCompleted(ids: string[], map: CompletionMap) {
  return ids.filter((id) => map[id]).length
}

export function progressPercent(ids: string[], map: CompletionMap) {
  if (!ids.length) return 0
  return Math.round((countCompleted(ids, map) / ids.length) * 100)
}

export function collectTrackableIds(
  companies: CompanyProfile[],
  exercises: LiveCodingExercise[],
  flashcards: Flashcard[],
  studyPlan: StudyPlanItem[],
) {
  return [
    ...companies.flatMap((company) => [
      ...company.preparationPriorities.map((_, index) => `${company.id}:priority:${index}`),
      ...company.processStages.map((stage) => `${company.id}:stage:${stage.id}`),
    ]),
    ...exercises.map((exercise) => `exercise:${exercise.id}`),
    ...flashcards.map((flashcard) => `flashcard:${flashcard.id}`),
    ...studyPlan.map((item) => `study:${item.id}`),
  ]
}
