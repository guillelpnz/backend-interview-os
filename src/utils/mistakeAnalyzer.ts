import type { MistakePattern, PythonTestCase } from '../types/content'
import type { PythonExerciseRunResult } from './pyodideRunner'

export type MistakeFeedback = {
  id: string
  label: string
  description: string
  severity: 'info' | 'warning' | 'error'
  feedback: string
}

function patternMatches(code: string, pattern: string, detect: MistakePattern['detect']) {
  if (detect === 'regex' || pattern.includes('|') || pattern.includes('\\')) {
    try {
      return new RegExp(pattern, 'im').test(code)
    } catch {
      return code.toLowerCase().includes(pattern.toLowerCase())
    }
  }

  return code.toLowerCase().includes(pattern.toLowerCase())
}

function expectedLiteralAppears(code: string, tests: PythonTestCase[]) {
  const normalizedCode = code.replace(/\s+/g, '')
  return tests.some((test) => {
    const expected = JSON.stringify(test.expected)
    return expected && expected.length > 8 && normalizedCode.includes(expected.replace(/\s+/g, ''))
  })
}

export function analyzeMistakes({
  code,
  patterns = [],
  visibleTests = [],
  lastResult,
}: {
  code: string
  patterns?: MistakePattern[]
  visibleTests?: PythonTestCase[]
  lastResult?: PythonExerciseRunResult | null
}): MistakeFeedback[] {
  const feedback: MistakeFeedback[] = []

  for (const pattern of patterns) {
    const matches = patternMatches(code, pattern.pattern, pattern.detect)
    const shouldReport = pattern.detect === 'static-not-contains' ? !matches : matches

    if (shouldReport) {
      feedback.push({
        id: pattern.id,
        label: pattern.label,
        description: pattern.description,
        severity: pattern.severity,
        feedback: pattern.feedback,
      })
    }
  }

  if (!/\breturn\b/.test(code)) {
    feedback.push({
      id: 'generic-no-return',
      label: 'No return statement found',
      description: 'Live coding exercises usually need a returned value for testability.',
      severity: 'error',
      feedback: 'Return the computed value rather than relying on print statements.',
    })
  }

  if (/\bprint\s*\(/.test(code) && !/\breturn\b/.test(code)) {
    feedback.push({
      id: 'generic-print-only',
      label: 'Print-only solution',
      description: 'The runner compares the function return value, not stdout.',
      severity: 'warning',
      feedback: 'Use print only for debugging; return the final answer from the function.',
    })
  }

  if (/\.(append|extend|insert|pop|remove|clear|sort)\s*\(/.test(code) && /\b(rows|events|items)\b/.test(code)) {
    feedback.push({
      id: 'generic-possible-input-mutation',
      label: 'Possible input mutation',
      description: 'Mutating input collections can surprise callers and make tests order-dependent.',
      severity: 'warning',
      feedback: 'Prefer building a new result list/dict unless the prompt explicitly allows mutation.',
    })
  }

  if (expectedLiteralAppears(code, visibleTests)) {
    feedback.push({
      id: 'generic-hardcoded-sample',
      label: 'Possible hardcoded sample output',
      description: 'The code appears to contain an expected output literal from visible tests.',
      severity: 'error',
      feedback: 'Generalize the algorithm so hidden tests pass too.',
    })
  }

  if (lastResult) {
    const allResults = [...lastResult.visibleResults, ...(lastResult.hiddenResults ?? [])]
    if (allResults.length > 0 && allResults.every((result) => !result.passed)) {
      feedback.push({
        id: 'generic-no-tests-passed',
        label: 'No tests passed yet',
        description: 'This is local heuristic feedback based on your latest run.',
        severity: 'info',
        feedback: 'Start from the visible examples and make the simplest case pass before optimizing.',
      })
    }
  }

  const unique = new Map(feedback.map((item) => [item.id, item]))
  return Array.from(unique.values())
}
