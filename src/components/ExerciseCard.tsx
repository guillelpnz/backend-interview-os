import type { LiveCodingExercise } from '../types/content'
import type { CompletionMap } from '../utils/progress'
import { RevealBlock } from './RevealBlock'

type ExerciseCardProps = {
  exercise: LiveCodingExercise
  completions: CompletionMap
  onToggle: (id: string) => void
}

const difficultyClass = {
  Easy: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
  Hard: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200',
}

export function ExerciseCard({ exercise, completions, onToggle }: ExerciseCardProps) {
  const progressId = `exercise:${exercise.id}`
  const done = Boolean(completions[progressId])

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded px-2 py-1 text-xs font-semibold ${difficultyClass[exercise.difficulty]}`}>{exercise.difficulty}</span>
            {exercise.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="mt-3 text-lg font-semibold text-slate-950 dark:text-slate-50">{exercise.title}</h3>
        </div>
        <button
          type="button"
          onClick={() => onToggle(progressId)}
          className={`rounded-md border px-3 py-2 text-sm font-medium ${
            done
              ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          {done ? 'Completed' : 'Mark complete'}
        </button>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700 dark:text-slate-300">{exercise.prompt}</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950/50">
          <p className="text-xs font-semibold uppercase text-slate-500">Input</p>
          <pre className="mt-2 overflow-auto text-xs text-slate-700 dark:text-slate-200">{exercise.inputExample}</pre>
        </div>
        <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950/50">
          <p className="text-xs font-semibold uppercase text-slate-500">Expected</p>
          <pre className="mt-2 overflow-auto text-xs text-slate-700 dark:text-slate-200">{exercise.expectedOutput}</pre>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Hints</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {exercise.hints.map((hint) => (
              <li key={hint}>{hint}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Common mistakes</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {exercise.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Interviewer tips</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {exercise.interviewerTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 rounded-md bg-teal-50 p-3 text-sm font-medium text-teal-900 dark:bg-teal-950/40 dark:text-teal-100">{exercise.complexity}</p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <RevealBlock label="Reference solution">{exercise.referenceSolution}</RevealBlock>
        <RevealBlock label="pytest tests">{exercise.pytestTests}</RevealBlock>
      </div>
    </article>
  )
}
