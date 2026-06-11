import { Eye, EyeOff, Play, RotateCcw, ShieldAlert, Timer, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CodingDojoExerciseProgress, LiveCodingExercise } from '../types/content'
import { analyzeMistakes } from '../utils/mistakeAnalyzer'
import { runPythonExercise, type PythonExerciseRunResult } from '../utils/pyodideRunner'
import { readStorage, writeStorage } from '../utils/storage'
import { CodeEditor } from './CodeEditor'
import { MistakeFeedbackPanel } from './MistakeFeedbackPanel'
import { RevealBlock } from './RevealBlock'
import { TestResultsPanel } from './TestResultsPanel'

type PythonExerciseRunnerProps = {
  exercise: LiveCodingExercise
  darkMode: boolean
  interviewMode: boolean
  onProgressUpdate: (exerciseId: string, progress: CodingDojoExerciseProgress) => void
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

function nextBestResult(result: PythonExerciseRunResult, runHiddenTests: boolean): CodingDojoExerciseProgress['bestResult'] {
  if (result.status === 'error') return 'error'
  if (runHiddenTests && result.status === 'passed') return 'all-passed'
  if (!runHiddenTests && result.visibleResults.every((item) => item.passed)) return 'visible-passed'
  return 'failed'
}

export function PythonExerciseRunner({ exercise, darkMode, interviewMode, onProgressUpdate }: PythonExerciseRunnerProps) {
  const storageKey = `prep-hub:dojo:solution:${exercise.id}`
  const starterCode = exercise.starterCode ?? exercise.referenceSolution
  const [code, setCode] = useState(() => readStorage(storageKey, starterCode))
  const [result, setResult] = useState<PythonExerciseRunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [hintsVisible, setHintsVisible] = useState(!interviewMode)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      writeStorage(storageKey, code)
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [code, storageKey])

  useEffect(() => {
    if (!interviewMode) return undefined

    const interval = window.setInterval(() => {
      setElapsedSeconds((value) => value + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [interviewMode, exercise.id])

  const feedback = useMemo(
    () =>
      analyzeMistakes({
        code,
        patterns: exercise.mistakePatterns,
        visibleTests: exercise.visibleTests,
        lastResult: result,
      }),
    [code, exercise.mistakePatterns, exercise.visibleTests, result],
  )

  const canRun = Boolean(exercise.functionName && exercise.visibleTests && exercise.hiddenTests)

  const runTests = async (runHiddenTests: boolean) => {
    if (!exercise.functionName || !exercise.visibleTests || !exercise.hiddenTests) return

    setRunning(true)
    const runResult = await runPythonExercise({
      userCode: code,
      functionName: exercise.functionName,
      visibleTests: exercise.visibleTests,
      hiddenTests: exercise.hiddenTests,
      runHiddenTests,
    })
    setResult(runResult)
    setRunning(false)

    const visibleTestsPassed = runResult.visibleResults.length > 0 && runResult.visibleResults.every((item) => item.passed)
    const allTestsPassed = runHiddenTests && runResult.status === 'passed'
    const bestResult = nextBestResult(runResult, runHiddenTests)
    const failedTags = runResult.status === 'passed' ? [] : exercise.tags

    onProgressUpdate(exercise.id, {
      attempted: true,
      visibleTestsPassed,
      allTestsPassed,
      lastRunDate: new Date().toISOString(),
      bestResult,
      runCount: 1,
      failedTags,
    })
  }

  const resetCode = () => {
    setCode(starterCode)
    writeStorage(storageKey, starterCode)
    setResult(null)
    setElapsedSeconds(0)
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{exercise.difficulty}</span>
              {exercise.tags.map((tag) => (
                <span key={tag} className="rounded bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{exercise.title}</h2>
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-700 dark:text-slate-300">{exercise.prompt}</p>
          </div>
          {interviewMode && (
            <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
              <Timer className="h-4 w-4" aria-hidden="true" />
              {formatTimer(elapsedSeconds)}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm leading-6 text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="inline-flex items-center gap-2 font-semibold">
            <ShieldAlert className="h-4 w-4" aria-hidden="true" />
            Local execution note
          </p>
          <p className="mt-1">Python runs locally in your browser through Pyodide. Do not paste secrets or use this runner for untrusted code.</p>
        </div>
      </section>

      {!canRun ? (
        <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          This exercise has not been converted to interactive mode yet.
        </section>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-4">
            <CodeEditor value={code} onChange={setCode} darkMode={darkMode} />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => runTests(false)}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                Run visible tests
              </button>
              <button
                type="button"
                onClick={() => runTests(true)}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
              >
                <Trophy className="h-4 w-4" aria-hidden="true" />
                Run all tests
              </button>
              <button
                type="button"
                onClick={resetCode}
                disabled={running}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Reset starter code
              </button>
              <button
                type="button"
                onClick={() => setSolutionVisible((value) => !value)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {solutionVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                {solutionVisible ? 'Hide solution' : 'Show solution'}
              </button>
              <button
                type="button"
                onClick={() => setHintsVisible((value) => !value)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {hintsVisible ? 'Hide hints' : 'Show hints'}
              </button>
            </div>

            {solutionVisible && <RevealBlock label="Reference solution" defaultOpen>{exercise.solution ?? exercise.referenceSolution}</RevealBlock>}
            {hintsVisible && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Hints</p>
                <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {exercise.hints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <TestResultsPanel result={result} loading={running} />
            <MistakeFeedbackPanel feedback={feedback} />
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Time complexity</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{exercise.complexity}</p>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Common mistakes</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {exercise.commonMistakes.map((mistake) => (
              <li key={mistake}>{mistake}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Interview communication</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {exercise.interviewerTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>
      </div>

      {interviewMode && result?.hiddenResults && (
        <section className="rounded-lg border border-teal-200 bg-teal-50 p-4 dark:border-teal-900 dark:bg-teal-950/30">
          <p className="text-sm font-semibold text-teal-950 dark:text-teal-100">Interview debrief</p>
          <p className="mt-2 text-sm leading-6 text-teal-900 dark:text-teal-100">
            Suggested verbal explanation: clarify the input shape, name the data structure you used, walk through one visible case, then state why the solution is correct for edge cases.
          </p>
          <p className="mt-2 text-sm leading-6 text-teal-900 dark:text-teal-100">Complexity prompt: explain the time and space complexity in terms of rows, departments, keys or events.</p>
        </section>
      )}
    </div>
  )
}
