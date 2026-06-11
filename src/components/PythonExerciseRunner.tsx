import { Eye, EyeOff, Play, RotateCcw, ShieldAlert, Timer, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CodingDojoExerciseProgress, CodingExample, LiveCodingExercise } from '../types/content'
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

function SpecList({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null

  return (
    <div className="border-l border-slate-200 pl-3 dark:border-slate-700">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function ExampleBlock({ example }: { example: CodingExample }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{example.label} input</p>
        <pre className="max-h-48 overflow-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">{example.input}</pre>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Expected return value</p>
        <pre className="max-h-48 overflow-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">{example.expected}</pre>
      </div>
    </div>
  )
}

function firstFunctionLine(code?: string, fallback?: string) {
  return code?.split('\n').find((line) => line.trim().startsWith('def '))?.trim() ?? fallback ?? 'Write the requested function'
}

function isPlaceholderCode(code: string) {
  const meaningfulLines = code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('def '))

  return meaningfulLines.length === 1 && meaningfulLines[0] === 'pass'
}

export function PythonExerciseRunner({ exercise, darkMode, interviewMode, onProgressUpdate }: PythonExerciseRunnerProps) {
  const storageKey = `prep-hub:dojo:solution:${exercise.id}`
  const starterCode = exercise.starterCode ?? exercise.referenceSolution
  const [code, setCode] = useState(() => {
    const savedCode = readStorage(storageKey, starterCode)
    return isPlaceholderCode(savedCode) ? starterCode : savedCode
  })
  const [result, setResult] = useState<PythonExerciseRunResult | null>(null)
  const [running, setRunning] = useState(false)
  const [solutionVisible, setSolutionVisible] = useState(false)
  const [hintsVisible, setHintsVisible] = useState(!interviewMode)
  const [specOpen, setSpecOpen] = useState(true)
  const [exampleOpen, setExampleOpen] = useState(false)
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
  const codeStillPlaceholder = /\bpass\b\s*$/.test(code.trim()) && !/\breturn\b/.test(code)
  const feedbackReady = Boolean(result) || (code.trim() !== starterCode.trim() && !codeStillPlaceholder)
  const functionSignature = firstFunctionLine(exercise.starterCode, exercise.functionName)
  const examples = exercise.examples?.length
    ? exercise.examples
    : [
        {
          label: 'Example',
          input: exercise.inputExample,
          expected: exercise.expectedOutput,
        },
      ]

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
    <div className="space-y-4">
      <div className="grid gap-4 2xl:grid-cols-[380px_minmax(0,1fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 2xl:sticky 2xl:top-6 2xl:max-h-[calc(100vh-3rem)] 2xl:self-start 2xl:overflow-auto">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{exercise.difficulty}</span>
                {exercise.tags.map((tag) => (
                  <span key={tag} className="rounded bg-teal-50 px-2 py-1 text-xs font-medium text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-white">{exercise.title}</h2>
              <p className="mt-2 max-w-5xl text-sm leading-6 text-slate-700 dark:text-slate-300">{exercise.brief ?? exercise.prompt}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSpecOpen((value) => !value)}
                className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {specOpen ? 'Collapse instructions' : 'Expand instructions'}
              </button>
              {specOpen && (
                <button
                  type="button"
                  onClick={() => setExampleOpen((value) => !value)}
                  className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {exampleOpen ? 'Hide example' : 'Show example'}
                </button>
              )}
              {interviewMode && (
                <div className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                  <Timer className="h-4 w-4" aria-hidden="true" />
                  {formatTimer(elapsedSeconds)}
                </div>
              )}
            </div>
          </div>

          {specOpen && (
            <>
              <div className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-1">
                <SpecList title="Implement" items={exercise.requirements ?? [exercise.prompt]} />
                <SpecList title="Input" items={exercise.inputContract ?? [`Example input: ${exercise.inputExample}`]} />
                <SpecList title="Return" items={exercise.outputContract ?? [`Return value like: ${exercise.expectedOutput}`]} />
                <SpecList title="Watch for" items={exercise.edgeCases ?? exercise.commonMistakes} />
              </div>

              {exampleOpen && (
                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                  <ExampleBlock example={examples[0]} />
                </div>
              )}

              <p className="mt-3 inline-flex items-center gap-2 text-xs leading-5 text-amber-800 dark:text-amber-200">
                <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
                Python runs locally in your browser through Pyodide. Do not paste secrets or run untrusted code.
              </p>
            </>
          )}
        </section>

        {!canRun ? (
          <section className="rounded-lg border border-slate-200 bg-white p-5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            This exercise has not been converted to interactive mode yet.
          </section>
        ) : (
          <div className="space-y-4">
          <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-3 dark:border-slate-800 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Write this function</p>
                <code className="mt-1 block truncate text-sm font-semibold text-slate-950 dark:text-slate-50">{functionSignature}</code>
              </div>
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
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setSolutionVisible((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {solutionVisible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                  {solutionVisible ? 'Hide solution' : 'Solution'}
                </button>
                <button
                  type="button"
                  onClick={() => setHintsVisible((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {hintsVisible ? 'Hide hints' : 'Hints'}
                </button>
              </div>
            </div>
            <CodeEditor value={code} onChange={setCode} darkMode={darkMode} />
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <TestResultsPanel result={result} loading={running} />
            {feedbackReady ? (
              <MistakeFeedbackPanel feedback={feedback} />
            ) : (
              <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                Run the visible tests or start editing to see local heuristic feedback.
              </section>
            )}
          </div>

          {hintsVisible && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Hints</p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {exercise.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </section>
          )}

          {solutionVisible && (
            <RevealBlock label="Reference solution" defaultOpen>
              {exercise.solution ?? exercise.referenceSolution}
            </RevealBlock>
          )}
          </div>
        )}
      </div>

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
