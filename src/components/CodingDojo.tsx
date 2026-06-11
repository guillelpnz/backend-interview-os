import { CheckCircle2, Code2, Filter, Target, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { CompanyProfile } from '../types/company'
import type { CodingDojoExerciseProgress, CodingDojoProgressMap, Difficulty, LiveCodingExercise } from '../types/content'
import { PythonExerciseRunner } from './PythonExerciseRunner'

type CodingDojoProps = {
  exercises: LiveCodingExercise[]
  companies: CompanyProfile[]
  selectedCompanyId: string
  darkMode: boolean
  progress: CodingDojoProgressMap
  onProgressUpdate: (exerciseId: string, progress: CodingDojoExerciseProgress) => void
}

const difficultyOptions: Array<'All' | Difficulty> = ['All', 'Easy', 'Medium', 'Hard']

function progressLabel(progress?: CodingDojoExerciseProgress) {
  if (!progress?.attempted) return 'Not attempted'
  if (progress.allTestsPassed) return 'All passed'
  if (progress.visibleTestsPassed) return 'Visible passed'
  if (progress.bestResult === 'error') return 'Error'
  return 'Needs work'
}

function progressClass(progress?: CodingDojoExerciseProgress) {
  if (progress?.allTestsPassed) return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
  if (progress?.visibleTestsPassed) return 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-200'
  if (progress?.attempted) return 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200'
  return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
}

export function CodingDojo({ exercises, companies, selectedCompanyId, darkMode, progress, onProgressUpdate }: CodingDojoProps) {
  const interactiveExercises = exercises.filter((exercise) => exercise.evaluationMode === 'function' && exercise.functionName && exercise.starterCode)
  const [selectedExerciseId, setSelectedExerciseId] = useState(interactiveExercises[0]?.id ?? '')
  const [companyFilter, setCompanyFilter] = useState(selectedCompanyId)
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All')
  const [tagFilter, setTagFilter] = useState('All')
  const [interviewMode, setInterviewMode] = useState(false)

  const tags = useMemo(() => Array.from(new Set(interactiveExercises.flatMap((exercise) => exercise.tags))).sort(), [interactiveExercises])

  const filteredExercises = interactiveExercises.filter((exercise) => {
    const matchesCompany = companyFilter === 'All' || exercise.companyRelevance.includes(companyFilter)
    const matchesDifficulty = difficultyFilter === 'All' || exercise.difficulty === difficultyFilter
    const matchesTag = tagFilter === 'All' || exercise.tags.includes(tagFilter)
    return matchesCompany && matchesDifficulty && matchesTag
  })

  const selectedExercise = interactiveExercises.find((exercise) => exercise.id === selectedExerciseId) ?? filteredExercises[0] ?? interactiveExercises[0]
  const attempted = interactiveExercises.filter((exercise) => progress[exercise.id]?.attempted).length
  const allPassed = interactiveExercises.filter((exercise) => progress[exercise.id]?.allTestsPassed).length

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Coding Dojo</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">Interactive Python practice</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Run visible and hidden tests in the browser, save your solutions locally, and practice explaining trade-offs like a live backend interview.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-md bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">{attempted}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Attempted</p>
            </div>
            <div className="rounded-md bg-slate-50 px-4 py-3 dark:bg-slate-950/50">
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">{allPassed}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">All passed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
          <Filter className="h-4 w-4" aria-hidden="true" />
          Filters
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Company</span>
            <select
              value={companyFilter}
              onChange={(event) => setCompanyFilter(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
            >
              <option value="All">All</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Difficulty</span>
            <select
              value={difficultyFilter}
              onChange={(event) => setDifficultyFilter(event.target.value as 'All' | Difficulty)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
            >
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty}>{difficulty}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Tag</span>
            <select
              value={tagFilter}
              onChange={(event) => setTagFilter(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
            >
              <option value="All">All</option>
              {tags.map((tag) => (
                <option key={tag}>{tag}</option>
              ))}
            </select>
          </label>
          <label className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200 md:mt-5">
            <input type="checkbox" checked={interviewMode} onChange={(event) => setInterviewMode(event.target.checked)} className="h-4 w-4 accent-teal-600" />
            Interview simulation mode
          </label>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-3">
          {filteredExercises.map((exercise) => {
            const itemProgress = progress[exercise.id]
            const selected = selectedExercise?.id === exercise.id
            return (
              <button
                key={exercise.id}
                type="button"
                onClick={() => setSelectedExerciseId(exercise.id)}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  selected
                    ? 'border-teal-400 bg-teal-50 dark:border-teal-600 dark:bg-teal-950/30'
                    : 'border-slate-200 bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold leading-6 text-slate-950 dark:text-slate-50">{exercise.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{exercise.difficulty}</p>
                  </div>
                  {itemProgress?.allTestsPassed ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                  ) : itemProgress?.attempted ? (
                    <XCircle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
                  ) : (
                    <Code2 className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${progressClass(itemProgress)}`}>{progressLabel(itemProgress)}</span>
                  {exercise.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            )
          })}
          {filteredExercises.length === 0 && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              No interactive exercises match the current filters.
            </div>
          )}
        </aside>

        {selectedExercise ? (
          <PythonExerciseRunner
            key={`${selectedExercise.id}:${interviewMode ? 'interview' : 'practice'}`}
            exercise={selectedExercise}
            darkMode={darkMode}
            interviewMode={interviewMode}
            onProgressUpdate={onProgressUpdate}
          />
        ) : (
          <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Target className="mb-3 h-5 w-5 text-teal-600" aria-hidden="true" />
            Add interactive exercise metadata to start practicing.
          </section>
        )}
      </div>
    </div>
  )
}
