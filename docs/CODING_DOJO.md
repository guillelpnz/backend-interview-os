# Coding Dojo

The Coding Dojo turns selected Python live coding exercises into executable in-browser practice.

## How the runner works

The app remains fully static:

- No backend.
- No authentication.
- No external database.
- GitHub Pages compatible.

The editor is powered by Monaco through `@monaco-editor/react`.

Python execution is powered by Pyodide. The app lazily imports Pyodide only when tests are run and initializes it once per browser session. Pyodide runtime assets are loaded from jsDelivr using the version exported by the installed `pyodide` package.

Execution flow:

1. The user writes code in Monaco.
2. The code is saved to `localStorage` with a key scoped to the exercise id.
3. When tests run, Pyodide executes the user code in an isolated Python globals dictionary.
4. The runner calls the configured function by name.
5. Each test case passes JSON-compatible arguments and expected output.
6. The runner compares the returned Python value with the expected value.
7. Results are returned to React as structured visible and hidden test results.

## Adding a new interactive exercise

Add the interactive fields to an exercise in `src/content/core/exercises.ts`.

Required fields:

```ts
evaluationMode: 'function',
functionName: 'your_function_name',
starterCode: `def your_function_name(...):
    pass
`,
solution: `def your_function_name(...):
    ...
`,
visibleTests: [
  {
    id: 'basic-case',
    name: 'Basic case',
    input: [[1, 2, 3]],
    expected: 6,
    explanation: 'Optional note shown in the UI.',
  },
],
hiddenTests: [
  {
    id: 'edge-case',
    name: 'Edge case',
    input: [[]],
    expected: 0,
  },
],
```

The function must return a JSON-compatible result: dictionaries, lists, strings, numbers, booleans or `None`.

## Visible and hidden tests

Visible tests are intended for fast feedback and interview-style clarification. They should cover the prompt's core example and one common edge case.

Hidden tests are intended to catch hardcoding, missing edge cases and incomplete generalization. They are still local and deterministic; they are only hidden from the first-practice flow.

In interview simulation mode:

- Hints start hidden.
- Solutions start hidden.
- The user is expected to run visible tests first.
- A timer starts when the exercise is opened.
- After all tests run, the UI shows debrief prompts for verbal explanation and complexity.

## Mistake patterns

Mistake patterns are local static heuristics. They are not AI feedback.

Example:

```ts
mistakePatterns: [
  {
    id: 'no-return',
    label: 'No return statement',
    description: 'The runner checks function return values.',
    severity: 'error',
    detect: 'static-not-contains',
    pattern: 'return',
    feedback: 'Return the computed value instead of printing it.',
  },
]
```

Supported `detect` values:

- `static-contains`: report when the code contains the pattern.
- `static-not-contains`: report when the code does not contain the pattern.
- `regex`: report when the regular expression matches.

The analyzer also includes generic checks for missing returns, print-only solutions, possible input mutation, hardcoded visible expected output and zero tests passing.

## Limitations

- Pyodide has a cold-start cost the first time tests run.
- The runner is intended for deterministic pure-function exercises.
- It does not sandbox malicious code beyond the browser/Pyodide environment.
- Infinite loops can still freeze the browser tab.
- Heuristic feedback is approximate and can produce false positives or miss valid issues.
- Hidden tests are stored in the frontend bundle, so they are practice hidden tests, not secure contest tests.

## Future AI feedback option

AI feedback could be added later through a backend or API route that receives user code, test results and exercise metadata. That is intentionally not included now because this project must remain fully static and deployable to GitHub Pages.
