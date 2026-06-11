import type { PythonTestCase } from '../types/content'
import type { PyProxyWithSet } from 'pyodide/ffi'

type PyodideModule = typeof import('pyodide')
type PyodideInstance = Awaited<ReturnType<PyodideModule['loadPyodide']>>
type PyodideGlobals = PyProxyWithSet

export type PythonExerciseTestResult = {
  id: string
  name: string
  passed: boolean
  input: unknown[]
  expected: unknown
  actual?: unknown
  error?: string
  explanation?: string
  hidden?: boolean
}

export type PythonExerciseRunResult = {
  status: 'passed' | 'failed' | 'error'
  visibleResults: PythonExerciseTestResult[]
  hiddenResults?: PythonExerciseTestResult[]
  errorMessage?: string
  stdout?: string
  durationMs: number
}

type RunPythonExerciseArgs = {
  userCode: string
  functionName: string
  visibleTests: PythonTestCase[]
  hiddenTests: PythonTestCase[]
  runHiddenTests: boolean
}

let pyodidePromise: Promise<PyodideInstance> | null = null

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = import('pyodide').then(({ loadPyodide, version }) =>
      loadPyodide({
        indexURL: `https://cdn.jsdelivr.net/pyodide/v${version}/full/`,
      }),
    )
  }

  return pyodidePromise
}

function parseHarnessResult(raw: string, test: PythonTestCase, hidden: boolean): PythonExerciseTestResult {
  try {
    const parsed = JSON.parse(raw) as {
      passed: boolean
      actual?: unknown
      expected?: unknown
      error?: string
    }

    return {
      id: test.id,
      name: test.name,
      passed: parsed.passed,
      input: test.input,
      expected: parsed.expected ?? test.expected,
      actual: parsed.actual,
      error: parsed.error,
      explanation: test.explanation,
      hidden,
    }
  } catch (error) {
    return {
      id: test.id,
      name: test.name,
      passed: false,
      input: test.input,
      expected: test.expected,
      error: error instanceof Error ? error.message : 'Could not parse test result.',
      explanation: test.explanation,
      hidden,
    }
  }
}

function buildHarness(functionName: string) {
  return `
import json
import traceback

_args = json.loads(__dojo_input_json)
_expected = json.loads(__dojo_expected_json)
_function_name = ${JSON.stringify(functionName)}

try:
    _fn = globals().get(_function_name)
    if _fn is None or not callable(_fn):
        __dojo_result_json = json.dumps({
            "passed": False,
            "expected": _expected,
            "actual": None,
            "error": f"Function '{_function_name}' was not found or is not callable.",
        }, sort_keys=True)
    else:
        _actual = _fn(*_args)
        __dojo_result_json = json.dumps({
            "passed": _actual == _expected,
            "expected": _expected,
            "actual": _actual,
            "error": None,
        }, default=str, sort_keys=True)
except Exception:
    __dojo_result_json = json.dumps({
        "passed": False,
        "expected": _expected,
        "actual": None,
        "error": traceback.format_exc(limit=4),
    }, sort_keys=True)

__dojo_result_json
`
}

async function runOneTest(
  pyodide: PyodideInstance,
  globals: PyodideGlobals,
  functionName: string,
  test: PythonTestCase,
  hidden: boolean,
) {
  globals.set('__dojo_input_json', JSON.stringify(test.input))
  globals.set('__dojo_expected_json', JSON.stringify(test.expected))
  const raw = pyodide.runPython(buildHarness(functionName), { globals, filename: '<dojo_test>' })
  return parseHarnessResult(String(raw), test, hidden)
}

export async function runPythonExercise({
  userCode,
  functionName,
  visibleTests,
  hiddenTests,
  runHiddenTests,
}: RunPythonExerciseArgs): Promise<PythonExerciseRunResult> {
  const startedAt = performance.now()
  const stdout: string[] = []

  try {
    const pyodide = await getPyodide()
    pyodide.setStdout({ batched: (message) => stdout.push(message) })
    pyodide.setStderr({ batched: (message) => stdout.push(message) })

    const globals = pyodide.toPy({}) as PyodideGlobals

    try {
      pyodide.runPython(userCode, { globals, filename: '<user_code>' })
    } catch (error) {
      globals.destroy?.()
      return {
        status: 'error',
        visibleResults: [],
        hiddenResults: runHiddenTests ? [] : undefined,
        errorMessage: error instanceof Error ? error.message : String(error),
        stdout: stdout.join('\n'),
        durationMs: Math.round(performance.now() - startedAt),
      }
    }

    const visibleResults: PythonExerciseTestResult[] = []
    for (const test of visibleTests) {
      visibleResults.push(await runOneTest(pyodide, globals, functionName, test, false))
    }

    const hiddenResults: PythonExerciseTestResult[] = []
    if (runHiddenTests) {
      for (const test of hiddenTests) {
        hiddenResults.push(await runOneTest(pyodide, globals, functionName, test, true))
      }
    }

    globals.destroy?.()

    const allResults = [...visibleResults, ...hiddenResults]
    const status = allResults.every((result) => result.passed) ? 'passed' : 'failed'

    return {
      status,
      visibleResults,
      hiddenResults: runHiddenTests ? hiddenResults : undefined,
      stdout: stdout.join('\n'),
      durationMs: Math.round(performance.now() - startedAt),
    }
  } catch (error) {
    return {
      status: 'error',
      visibleResults: [],
      hiddenResults: runHiddenTests ? [] : undefined,
      errorMessage: error instanceof Error ? error.message : String(error),
      stdout: stdout.join('\n'),
      durationMs: Math.round(performance.now() - startedAt),
    }
  }
}
