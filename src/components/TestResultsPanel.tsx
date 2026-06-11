import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import type { PythonExerciseRunResult, PythonExerciseTestResult } from '../utils/pyodideRunner'

type TestResultsPanelProps = {
  result: PythonExerciseRunResult | null
  loading?: boolean
}

function ResultRow({ result }: { result: PythonExerciseTestResult }) {
  return (
    <div className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{result.name}</p>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              {result.hidden ? 'Hidden' : 'Visible'}
            </span>
          </div>
          {result.explanation && <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{result.explanation}</p>}
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold ${
            result.passed
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
              : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
          }`}
        >
          {result.passed ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> : <XCircle className="h-3.5 w-3.5" aria-hidden="true" />}
          {result.passed ? 'Passed' : 'Failed'}
        </span>
      </div>
      {!result.passed && (
        <div className="mt-3 grid gap-2 text-xs md:grid-cols-2">
          <div>
            <p className="mb-1 font-semibold uppercase text-slate-500 dark:text-slate-400">Expected</p>
            <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-2 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">{JSON.stringify(result.expected, null, 2)}</pre>
          </div>
          <div>
            <p className="mb-1 font-semibold uppercase text-slate-500 dark:text-slate-400">{result.error ? 'Error' : 'Actual'}</p>
            <pre className="max-h-48 overflow-auto rounded bg-slate-50 p-2 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">{result.error ?? JSON.stringify(result.actual, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}

export function TestResultsPanel({ result, loading = false }: TestResultsPanelProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Clock className="h-4 w-4 animate-spin" aria-hidden="true" />
          Initializing Pyodide or running tests...
        </p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        Run visible tests first. The panel will show each visible case, what your function returned, and what the expected return value was. Run all tests when the visible cases pass.
      </div>
    )
  }

  const hiddenResults = result.hiddenResults ?? []
  const allResults = [...result.visibleResults, ...hiddenResults]
  const passed = allResults.filter((item) => item.passed).length

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            {result.status === 'passed' ? 'All executed tests passed' : result.status === 'error' ? 'Execution error' : 'Some tests failed'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {passed}/{allResults.length} passed in {result.durationMs}ms
          </p>
        </div>
        <span
          className={`rounded px-2 py-1 text-xs font-semibold ${
            result.status === 'passed'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
              : result.status === 'error'
                ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200'
          }`}
        >
          {result.status}
        </span>
      </div>

      {result.errorMessage && <pre className="mb-4 overflow-auto rounded bg-rose-50 p-3 text-xs text-rose-900 dark:bg-rose-950/30 dark:text-rose-100">{result.errorMessage}</pre>}

      <div className="space-y-3">
        {result.visibleResults.map((item) => (
          <ResultRow key={item.id} result={item} />
        ))}
        {hiddenResults.map((item) => (
          <ResultRow key={item.id} result={item} />
        ))}
      </div>

      {result.stdout && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase text-slate-500">stdout / stderr</p>
          <pre className="mt-2 max-h-44 overflow-auto rounded bg-slate-950 p-3 text-xs text-slate-100">{result.stdout}</pre>
        </div>
      )}
    </div>
  )
}
