import { CheckCircle2, Code2, Filter, Maximize2, Minimize2, Search, Target, XCircle } from 'lucide-react'
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
const statusOptions = ['All statuses', 'Not attempted', 'Needs work', 'Visible passed', 'All passed'] as const
type StatusFilter = (typeof statusOptions)[number]

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

function progressMatchesStatus(progress: CodingDojoExerciseProgress | undefined, statusFilter: StatusFilter) {
  if (statusFilter === 'All statuses') return true
  return progressLabel(progress) === statusFilter
}

function matchesSearch(exercise: LiveCodingExercise, query: string) {
  if (!query) return true

  const haystack = [
    exercise.title,
    exercise.prompt,
    exercise.brief,
    exercise.functionName,
    exercise.tags.join(' '),
    exercise.requirements?.join(' '),
    exercise.inputContract?.join(' '),
    exercise.outputContract?.join(' '),
    exercise.edgeCases?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(query)
}

export function CodingDojo({ exercises, companies, selectedCompanyId, darkMode, progress, onProgressUpdate }: CodingDojoProps) {
  const interactiveExercises = exercises.filter((exercise) => exercise.evaluationMode === 'function' && exercise.functionName && exercise.starterCode)
  const [selectedExerciseId, setSelectedExerciseId] = useState(interactiveExercises[0]?.id ?? '')
  const [companyFilter, setCompanyFilter] = useState(selectedCompanyId)
  const [difficultyFilter, setDifficultyFilter] = useState<'All' | Difficulty>('All')
  const [tagFilter, setTagFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All statuses')
  const [searchQuery, setSearchQuery] = useState('')
  const [interviewMode, setInterviewMode] = useState(false)
  const [focusMode, setFocusMode] = useState(false)

  const tags = useMemo(() => Array.from(new Set(interactiveExercises.flatMap((exercise) => exercise.tags))).sort(), [interactiveExercises])

  const filteredExercises = interactiveExercises.filter((exercise) => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const matchesCompany = companyFilter === 'All' || exercise.companyRelevance.includes(companyFilter)
    const matchesDifficulty = difficultyFilter === 'All' || exercise.difficulty === difficultyFilter
    const matchesTag = tagFilter === 'All' || exercise.tags.includes(tagFilter)
    const matchesStatus = progressMatchesStatus(progress[exercise.id], statusFilter)
    return matchesCompany && matchesDifficulty && matchesTag && matchesStatus && matchesSearch(exercise, normalizedQuery)
  })

  const selectedExercise = filteredExercises.find((exercise) => exercise.id === selectedExerciseId) ?? filteredExercises[0]
  const attempted = interactiveExercises.filter((exercise) => progress[exercise.id]?.attempted).length
  const allPassed = interactiveExercises.filter((exercise) => progress[exercise.id]?.allTestsPassed).length
  const clearFilters = () => {
    setCompanyFilter('All')
    setDifficultyFilter('All')
    setTagFilter('All')
    setStatusFilter('All statuses')
    setSearchQuery('')
  }

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-end 2xl:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Coding Dojo</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Interactive Python practice</h1>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {attempted}/{interactiveExercises.length} attempted
              </span>
              <span className="rounded bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
                {allPassed} all passed
              </span>
            </div>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Pick an exercise, read the contract, write Python in the browser, then run visible tests before trying the hidden set.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFocusMode((value) => !value)}
            className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {focusMode ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
            {focusMode ? 'Show exercise list' : 'Focus editor'}
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_160px_160px_180px_180px_minmax(230px,auto)]">
          <label className="block">
            <span className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              Search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="exercise, tag, function, edge case..."
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
            />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              <Filter className="h-3.5 w-3.5" aria-hidden="true" />
              Company
            </span>
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
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
            >
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
          <label className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 px-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-200 xl:mt-5">
            <input type="checkbox" checked={interviewMode} onChange={(event) => setInterviewMode(event.target.checked)} className="h-4 w-4 accent-teal-600" />
            Interview simulation mode
          </label>
        </div>
      </section>

      <div className={focusMode ? 'grid gap-4' : 'grid gap-4 2xl:grid-cols-[300px_minmax(0,1fr)]'}>
        {!focusMode && (
          <aside className="space-y-2 2xl:sticky 2xl:top-6 2xl:max-h-[calc(100vh-3rem)] 2xl:overflow-auto 2xl:pr-1">
            <div className="flex items-center justify-between px-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
              <span>{filteredExercises.length}/{interactiveExercises.length} exercises</span>
              <span>{progressLabel(progress[selectedExercise?.id ?? ''])}</span>
            </div>
            {filteredExercises.map((exercise) => {
              const itemProgress = progress[exercise.id]
              const selected = selectedExercise?.id === exercise.id
              return (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => setSelectedExerciseId(exercise.id)}
                  className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                    selected
                      ? 'border-teal-400 bg-teal-50 dark:border-teal-600 dark:bg-teal-950/30'
                      : 'border-slate-200 bg-white hover:border-teal-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-teal-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold leading-5 text-slate-950 dark:text-slate-50">{exercise.title}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className={`rounded px-2 py-1 text-xs font-semibold ${progressClass(itemProgress)}`}>{progressLabel(itemProgress)}</span>
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{exercise.difficulty}</span>
                      </div>
                    </div>
                    {itemProgress?.allTestsPassed ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" aria-hidden="true" />
                    ) : itemProgress?.attempted ? (
                      <XCircle className="h-5 w-5 shrink-0 text-amber-500" aria-hidden="true" />
                    ) : (
                      <Code2 className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {exercise.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>
              )
            })}
            {filteredExercises.length === 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <p>No interactive exercises match the current filters.</p>
                <button type="button" onClick={clearFilters} className="mt-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                  Clear filters
                </button>
              </div>
            )}
          </aside>
        )}

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
            <p>No exercise matches the current filters.</p>
            <button type="button" onClick={clearFilters} className="mt-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Clear filters
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
