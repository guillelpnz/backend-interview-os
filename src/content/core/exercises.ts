import type { LiveCodingExercise } from '../../types/content'

export const liveCodingExercises: LiveCodingExercise[] = [
  {
    id: 'aggregate-department-month',
    title: 'Aggregate transactions by department and month',
    difficulty: 'Easy',
    tags: ['python', 'dict', 'grouping', 'finance'],
    prompt:
      'Given transactions with department, ISO date and amount, return total spend per department per YYYY-MM month. Ignore rows with missing department, date or amount.',
    brief:
      'Write a pure function that groups imported transaction rows by department and calendar month, then returns the summed amount for each group.',
    requirements: [
      'Implement aggregate_by_department_month(rows).',
      'Group by department first, then by the first 7 characters of the ISO date: YYYY-MM.',
      'Add amounts for rows that land in the same department and month.',
      'Return a normal dict of dicts, not a defaultdict.',
    ],
    inputContract: [
      'rows is a list of dictionaries.',
      'Each valid row has department: str, date: str in YYYY-MM-DD format, and amount: number.',
      'Rows can be missing keys or contain empty department/date values.',
    ],
    outputContract: [
      'Return {"Department": {"YYYY-MM": total_amount}}.',
      'Do not print the answer; the runner compares the function return value.',
      'Department and month order does not matter for dictionary equality.',
    ],
    edgeCases: [
      'amount = 0 is valid and must be included.',
      'Skip rows with missing/empty department, missing/empty date, or missing amount.',
      'Empty input should return {}.',
    ],
    examples: [
      {
        label: 'Finance import',
        input: `rows = [
  {"department": "Sales", "date": "2026-01-12", "amount": 100},
  {"department": "Sales", "date": "2026-01-31", "amount": 40},
  {"department": "Ops", "date": "2026-02-01", "amount": 50}
]`,
        expected: `{
  "Sales": {"2026-01": 140},
  "Ops": {"2026-02": 50}
}`,
      },
    ],
    inputExample: `[{"department": "Sales", "date": "2026-01-12", "amount": 100}, {"department": "Sales", "date": "2026-01-31", "amount": 40}, {"department": "Ops", "date": "2026-02-01", "amount": 50}]`,
    expectedOutput: `{"Sales": {"2026-01": 140}, "Ops": {"2026-02": 50}}`,
    hints: ['Extract the month with date[:7].', 'defaultdict can keep the code compact.', 'Decide how to treat malformed rows before coding.'],
    referenceSolution: `from collections import defaultdict

def aggregate_by_department_month(rows):
    totals = defaultdict(lambda: defaultdict(float))
    for row in rows:
        department = row.get("department")
        date = row.get("date")
        amount = row.get("amount")
        if not department or not date or amount is None:
            continue
        totals[department][date[:7]] += amount
    return {department: dict(months) for department, months in totals.items()}`,
    pytestTests: `def test_aggregate_by_department_month():
    rows = [
        {"department": "Sales", "date": "2026-01-12", "amount": 100},
        {"department": "Sales", "date": "2026-01-31", "amount": 40},
        {"department": "Ops", "date": "2026-02-01", "amount": 50},
        {"department": "", "date": "2026-02-01", "amount": 999},
    ]
    assert aggregate_by_department_month(rows) == {
        "Sales": {"2026-01": 140},
        "Ops": {"2026-02": 50},
    }`,
    complexity: 'O(n) time and O(d*m) space for departments times months.',
    commonMistakes: ['Using a mutable dict as a default value.', 'Forgetting amount zero is valid.', 'Returning defaultdict objects.'],
    interviewerTips: ['State how invalid rows are handled.', 'Mention decimal precision if amounts represent money.', 'Add a simple test before optimizing.'],
    companyRelevance: ['abacum', 'fintech', 'saas'],
    evaluationMode: 'function',
    functionName: 'aggregate_by_department_month',
    starterCode: `def aggregate_by_department_month(rows):
    # rows: list of dicts with department, date, amount
    # return: {"Department": {"YYYY-MM": total_amount}}
    # skip invalid rows, but keep amount=0
    pass
`,
    solution: `from collections import defaultdict

def aggregate_by_department_month(rows):
    totals = defaultdict(lambda: defaultdict(float))
    for row in rows:
        department = row.get("department")
        date = row.get("date")
        amount = row.get("amount")
        if not department or not date or amount is None:
            continue
        totals[department][date[:7]] += amount
    return {department: dict(months) for department, months in totals.items()}
`,
    visibleTests: [
      {
        id: 'basic-grouping',
        name: 'Groups two departments by month',
        input: [
          [
            { department: 'Sales', date: '2026-01-12', amount: 100 },
            { department: 'Sales', date: '2026-01-31', amount: 40 },
            { department: 'Ops', date: '2026-02-01', amount: 50 },
          ],
        ],
        expected: { Sales: { '2026-01': 140 }, Ops: { '2026-02': 50 } },
        explanation: 'Amounts for the same department and month should be accumulated.',
      },
      {
        id: 'skip-invalid',
        name: 'Skips rows missing required fields',
        input: [
          [
            { department: 'Sales', date: '2026-01-01', amount: 0 },
            { department: '', date: '2026-01-01', amount: 999 },
            { department: 'Ops', date: '2026-02-01' },
          ],
        ],
        expected: { Sales: { '2026-01': 0 } },
        explanation: 'Zero is a valid amount, but missing department/date/amount rows are ignored.',
      },
    ],
    hiddenTests: [
      {
        id: 'multiple-months',
        name: 'Handles multiple months for same department',
        input: [
          [
            { department: 'Finance', date: '2026-03-02', amount: 10 },
            { department: 'Finance', date: '2026-04-02', amount: 15 },
            { department: 'Finance', date: '2026-03-15', amount: 5 },
          ],
        ],
        expected: { Finance: { '2026-03': 15, '2026-04': 15 } },
      },
      {
        id: 'empty-input',
        name: 'Empty input returns empty dict',
        input: [[]],
        expected: {},
      },
    ],
    mistakePatterns: [
      {
        id: 'no-dict',
        label: 'No dictionary-based aggregation detected',
        description: 'Aggregation problems are usually simplest with dict or defaultdict.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'dict|defaultdict|\\{',
        feedback: 'Consider using a dictionary keyed by department and month so the solution stays O(n).',
      },
      {
        id: 'missing-field-access',
        label: 'Direct field indexing may raise KeyError',
        description: 'Imported rows can be malformed.',
        severity: 'warning',
        detect: 'regex',
        pattern: "row\\[[\"'](department|date|amount)[\"']\\]",
        feedback: 'Use row.get(...) or explicit validation before indexing imported row fields.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The runner expects the target function to return the grouped dictionary.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the final dictionary instead of printing it.',
      },
    ],
  },
  {
    id: 'actual-vs-forecast-variance',
    title: 'Compute actual vs forecast variance',
    difficulty: 'Easy',
    tags: ['python', 'finance', 'math'],
    prompt:
      'Given actuals and forecasts keyed by department, return actual, forecast, absolute variance and percentage variance. Missing values should be treated as 0.',
    brief:
      'Write a pure function that reconciles actual spend against forecast spend for every department present in either input dictionary.',
    requirements: [
      'Implement compute_variance(actuals, forecasts).',
      'Include departments that appear only in actuals, only in forecasts, or in both.',
      'For each department, calculate variance = actual - forecast.',
      'Calculate variance_pct = round((variance / forecast) * 100, 2), unless forecast is 0.',
    ],
    inputContract: [
      'actuals is a dictionary keyed by department name with numeric actual values.',
      'forecasts is a dictionary keyed by department name with numeric forecast values.',
      'A missing department on either side should be treated as value 0.',
    ],
    outputContract: [
      'Return one dictionary entry per department.',
      'Each value must contain actual, forecast, variance, and variance_pct.',
      'variance_pct must be None when forecast is 0.',
    ],
    edgeCases: [
      'Do not divide by zero.',
      'Departments that only exist in forecasts still need output rows.',
      'Negative variance is valid when actual is below forecast.',
    ],
    examples: [
      {
        label: 'Actuals vs forecast',
        input: `actuals = {"Sales": 1200, "Ops": 800}
forecasts = {"Sales": 1000, "Marketing": 500}`,
        expected: `{
  "Marketing": {"actual": 0, "forecast": 500, "variance": -500, "variance_pct": -100.0},
  "Ops": {"actual": 800, "forecast": 0, "variance": 800, "variance_pct": None},
  "Sales": {"actual": 1200, "forecast": 1000, "variance": 200, "variance_pct": 20.0}
}`,
      },
    ],
    inputExample: `actuals={"Sales": 1200, "Ops": 800}; forecasts={"Sales": 1000, "Marketing": 500}`,
    expectedOutput: `{"Sales": {"actual": 1200, "forecast": 1000, "variance": 200, "variance_pct": 20.0}, "Ops": {"actual": 800, "forecast": 0, "variance": 800, "variance_pct": None}, "Marketing": {"actual": 0, "forecast": 500, "variance": -500, "variance_pct": -100.0}}`,
    hints: ['Use the union of keys.', 'Percentage variance is undefined when forecast is zero.', 'Sort keys only if deterministic output matters.'],
    referenceSolution: `def compute_variance(actuals, forecasts):
    result = {}
    for department in sorted(set(actuals) | set(forecasts)):
        actual = actuals.get(department, 0)
        forecast = forecasts.get(department, 0)
        variance = actual - forecast
        variance_pct = None if forecast == 0 else round((variance / forecast) * 100, 2)
        result[department] = {
            "actual": actual,
            "forecast": forecast,
            "variance": variance,
            "variance_pct": variance_pct,
        }
    return result`,
    pytestTests: `def test_compute_variance():
    assert compute_variance({"Sales": 1200, "Ops": 800}, {"Sales": 1000, "Marketing": 500}) == {
        "Marketing": {"actual": 0, "forecast": 500, "variance": -500, "variance_pct": -100.0},
        "Ops": {"actual": 800, "forecast": 0, "variance": 800, "variance_pct": None},
        "Sales": {"actual": 1200, "forecast": 1000, "variance": 200, "variance_pct": 20.0},
    }`,
    complexity: 'O(a + f) time and O(a + f) space.',
    commonMistakes: ['Dividing by zero.', 'Only iterating actual departments.', 'Rounding too early before further calculations.'],
    interviewerTips: ['Ask whether percentage should use forecast or actual as baseline.', 'Call out money precision.', 'Explain missing values explicitly.'],
    companyRelevance: ['abacum', 'fintech', 'saas'],
    evaluationMode: 'function',
    functionName: 'compute_variance',
    starterCode: `def compute_variance(actuals, forecasts):
    # actuals/forecasts: dict[str, number]
    # return one entry for every department in either dict
    # variance_pct is None when forecast is 0
    pass
`,
    solution: `def compute_variance(actuals, forecasts):
    result = {}
    for department in sorted(set(actuals) | set(forecasts)):
        actual = actuals.get(department, 0)
        forecast = forecasts.get(department, 0)
        variance = actual - forecast
        variance_pct = None if forecast == 0 else round((variance / forecast) * 100, 2)
        result[department] = {
            "actual": actual,
            "forecast": forecast,
            "variance": variance,
            "variance_pct": variance_pct,
        }
    return result
`,
    visibleTests: [
      {
        id: 'basic-variance',
        name: 'Computes actual, forecast and variance',
        input: [{ Sales: 1200, Ops: 800 }, { Sales: 1000, Marketing: 500 }],
        expected: {
          Marketing: { actual: 0, forecast: 500, variance: -500, variance_pct: -100 },
          Ops: { actual: 800, forecast: 0, variance: 800, variance_pct: null },
          Sales: { actual: 1200, forecast: 1000, variance: 200, variance_pct: 20 },
        },
        explanation: 'Departments from both actuals and forecasts should be represented.',
      },
      {
        id: 'zero-forecast',
        name: 'Forecast zero gives no percentage',
        input: [{ Support: 10 }, { Support: 0 }],
        expected: { Support: { actual: 10, forecast: 0, variance: 10, variance_pct: null } },
      },
    ],
    hiddenTests: [
      {
        id: 'negative-variance',
        name: 'Handles under-performance',
        input: [{ Sales: 75 }, { Sales: 100 }],
        expected: { Sales: { actual: 75, forecast: 100, variance: -25, variance_pct: -25 } },
      },
      {
        id: 'empty-inputs',
        name: 'No departments returns empty dict',
        input: [{}, {}],
        expected: {},
      },
    ],
    mistakePatterns: [
      {
        id: 'division-by-zero',
        label: 'Division by zero risk',
        description: 'Forecast can be zero for departments with no forecast.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'forecast == 0|forecast != 0|if forecast',
        feedback: 'Guard percentage variance when forecast is zero and return None for variance_pct.',
      },
      {
        id: 'actuals-only',
        label: 'May only iterate actual departments',
        description: 'Departments that only exist in forecasts still need an output row.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'set\\(actuals\\).*set\\(forecasts\\)|set\\(forecasts\\).*set\\(actuals\\)|actuals\\.keys\\(\\).*forecasts\\.keys\\(\\)|forecasts\\.keys\\(\\).*actuals\\.keys\\(',
        feedback: 'Iterate over the union of actual and forecast departments.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return a dictionary of department results.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the result dictionary instead of printing it.',
      },
    ],
  },
  {
    id: 'duplicated-financial-records',
    title: 'Detect duplicated financial records',
    difficulty: 'Easy',
    tags: ['python', 'deduplication', 'sets'],
    prompt:
      'Return duplicate records based on external_id and source. The first occurrence is canonical; later occurrences should be returned in original order.',
    brief:
      'Write a pure function that finds later duplicate imported records while keeping the first record for each source/external_id pair as canonical.',
    requirements: [
      'Implement find_duplicates(rows).',
      'Use the pair (source, external_id) as the uniqueness key.',
      'Treat the first occurrence of each key as the canonical record.',
      'Return only the later duplicate rows, preserving their original input order.',
    ],
    inputContract: [
      'rows is a list of dictionaries from external systems.',
      'A valid duplicate key needs both source and external_id.',
      'Different sources may reuse the same external_id without being duplicates.',
    ],
    outputContract: [
      'Return a list of row dictionaries.',
      'Do not return the first canonical row for a key.',
      'Return the original duplicate row object/value, including any extra fields.',
    ],
    edgeCases: [
      'Rows missing source or external_id should be ignored.',
      'If one key appears three times, return the second and third rows.',
      'No duplicates should return an empty list.',
    ],
    examples: [
      {
        label: 'Namespaced external ids',
        input: `rows = [
  {"source": "erp", "external_id": "A1", "amount": 10},
  {"source": "crm", "external_id": "A1", "amount": 10},
  {"source": "erp", "external_id": "A1", "amount": 12}
]`,
        expected: `[
  {"source": "erp", "external_id": "A1", "amount": 12}
]`,
      },
    ],
    inputExample: `[{"source": "erp", "external_id": "A1"}, {"source": "crm", "external_id": "A1"}, {"source": "erp", "external_id": "A1"}]`,
    expectedOutput: `[{"source": "erp", "external_id": "A1"}]`,
    hints: ['The unique key is a tuple.', 'Do not treat same external_id from different sources as duplicate.', 'Preserve input order.'],
    referenceSolution: `def find_duplicates(rows):
    seen = set()
    duplicates = []
    for row in rows:
        key = (row.get("source"), row.get("external_id"))
        if None in key:
            continue
        if key in seen:
            duplicates.append(row)
        else:
            seen.add(key)
    return duplicates`,
    pytestTests: `def test_find_duplicates():
    rows = [
        {"source": "erp", "external_id": "A1", "amount": 10},
        {"source": "crm", "external_id": "A1", "amount": 10},
        {"source": "erp", "external_id": "A1", "amount": 12},
    ]
    assert find_duplicates(rows) == [{"source": "erp", "external_id": "A1", "amount": 12}]`,
    complexity: 'O(n) time and O(n) space.',
    commonMistakes: ['Using only external_id as key.', 'Returning all copies instead of later duplicates.', 'Failing on missing fields.'],
    interviewerTips: ['Define canonical behavior first.', 'Discuss idempotency and unique constraints.', 'Mention source-specific namespaces.'],
    companyRelevance: ['abacum', 'fintech', 'integrations'],
    evaluationMode: 'function',
    functionName: 'find_duplicates',
    starterCode: `def find_duplicates(rows):
    # rows: list of dicts from external systems
    # duplicate key: (source, external_id)
    # return only later duplicate rows, in input order
    pass
`,
    solution: `def find_duplicates(rows):
    seen = set()
    duplicates = []
    for row in rows:
        key = (row.get("source"), row.get("external_id"))
        if None in key:
            continue
        if key in seen:
            duplicates.append(row)
        else:
            seen.add(key)
    return duplicates
`,
    visibleTests: [
      {
        id: 'source-namespaced',
        name: 'Same external id from different sources is not duplicate',
        input: [
          [
            { source: 'erp', external_id: 'A1', amount: 10 },
            { source: 'crm', external_id: 'A1', amount: 10 },
            { source: 'erp', external_id: 'A1', amount: 12 },
          ],
        ],
        expected: [{ source: 'erp', external_id: 'A1', amount: 12 }],
      },
      {
        id: 'no-duplicates',
        name: 'No duplicates returns empty list',
        input: [[{ source: 'erp', external_id: 'A1' }, { source: 'erp', external_id: 'B1' }]],
        expected: [],
      },
    ],
    hiddenTests: [
      {
        id: 'multiple-later-duplicates',
        name: 'Returns every later duplicate in order',
        input: [
          [
            { source: 'erp', external_id: 'A1', row: 1 },
            { source: 'erp', external_id: 'A1', row: 2 },
            { source: 'erp', external_id: 'A1', row: 3 },
          ],
        ],
        expected: [
          { source: 'erp', external_id: 'A1', row: 2 },
          { source: 'erp', external_id: 'A1', row: 3 },
        ],
      },
      {
        id: 'skip-missing-key',
        name: 'Ignores rows missing duplicate key parts',
        input: [[{ source: 'erp' }, { external_id: 'A1' }, { source: 'erp', external_id: 'A1' }]],
        expected: [],
      },
    ],
    mistakePatterns: [
      {
        id: 'no-set',
        label: 'No set usage detected',
        description: 'A set of seen keys gives O(n) duplicate detection.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'set\\(',
        feedback: 'Use a set to track seen (source, external_id) tuples.',
      },
      {
        id: 'external-only',
        label: 'Possibly ignores source in duplicate key',
        description: 'External IDs are only unique within a source namespace.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'source',
        feedback: 'Include both source and external_id in the duplicate key.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return duplicate records.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the duplicates list.',
      },
    ],
  },
  {
    id: 'merge-external-systems',
    title: 'Merge data from two external systems',
    difficulty: 'Medium',
    tags: ['python', 'merge', 'data-modeling'],
    prompt:
      'Merge ERP accounts and CRM account metadata by account_id. ERP values are required; CRM metadata is optional. Return only ERP accounts enriched with CRM fields when present.',
    brief:
      'Write a pure function that enriches authoritative ERP account rows with optional CRM metadata by account_id.',
    requirements: [
      'Implement merge_accounts(erp_accounts, crm_accounts).',
      'Return every valid ERP account, even when there is no matching CRM row.',
      'Merge CRM fields into the ERP row when account_id matches.',
      'Keep ERP values authoritative when the same key exists on both sides.',
    ],
    inputContract: [
      'erp_accounts is a list of account dictionaries from ERP.',
      'crm_accounts is a list of account dictionaries from CRM.',
      'A usable row has a non-empty account_id.',
    ],
    outputContract: [
      'Return a list of merged account dictionaries.',
      'Preserve ERP input order.',
      'Do not include CRM-only accounts.',
      'Do not mutate the input rows.',
    ],
    edgeCases: [
      'ERP rows without account_id are skipped.',
      'CRM rows without account_id are ignored.',
      'If CRM contains account_id, do not duplicate that field in the merge.',
    ],
    examples: [
      {
        label: 'ERP enriched with CRM owner',
        input: `erp_accounts = [
  {"account_id": "A", "amount": 10},
  {"account_id": "B", "amount": 20}
]
crm_accounts = [
  {"account_id": "A", "owner": "Ana"},
  {"account_id": "C", "owner": "Cora"}
]`,
        expected: `[
  {"account_id": "A", "amount": 10, "owner": "Ana"},
  {"account_id": "B", "amount": 20}
]`,
      },
    ],
    inputExample: `erp=[{"account_id": "A", "amount": 10}], crm=[{"account_id": "A", "owner": "Ana"}]`,
    expectedOutput: `[{"account_id": "A", "amount": 10, "owner": "Ana"}]`,
    hints: ['Index CRM rows by account_id.', 'Decide which side is authoritative.', 'Be careful not to mutate inputs unless allowed.'],
    referenceSolution: `def merge_accounts(erp_accounts, crm_accounts):
    crm_by_id = {row["account_id"]: row for row in crm_accounts if row.get("account_id")}
    merged = []
    for account in erp_accounts:
        account_id = account.get("account_id")
        if not account_id:
            continue
        enriched = dict(account)
        metadata = crm_by_id.get(account_id)
        if metadata:
            for key, value in metadata.items():
                if key != "account_id" and key not in enriched:
                    enriched[key] = value
        merged.append(enriched)
    return merged`,
    pytestTests: `def test_merge_accounts():
    erp = [{"account_id": "A", "amount": 10}, {"account_id": "B", "amount": 20}]
    crm = [{"account_id": "A", "owner": "Ana"}, {"account_id": "C", "owner": "Cora"}]
    assert merge_accounts(erp, crm) == [
        {"account_id": "A", "amount": 10, "owner": "Ana"},
        {"account_id": "B", "amount": 20},
    ]`,
    complexity: 'O(e + c) time and O(c) space.',
    commonMistakes: ['Nested loops for large inputs.', 'Dropping ERP rows with no CRM match.', 'Overwriting authoritative fields accidentally.'],
    interviewerTips: ['Ask about conflicting fields.', 'Name the authoritative source.', 'Mention database joins for persistent data.'],
    companyRelevance: ['abacum', 'saas', 'integrations'],
    evaluationMode: 'function',
    functionName: 'merge_accounts',
    starterCode: `def merge_accounts(erp_accounts, crm_accounts):
    # ERP is authoritative and must drive the output rows.
    # CRM metadata is optional enrichment by account_id.
    # Preserve ERP order and avoid mutating inputs.
    pass
`,
    solution: `def merge_accounts(erp_accounts, crm_accounts):
    crm_by_id = {row["account_id"]: row for row in crm_accounts if row.get("account_id")}
    merged = []
    for account in erp_accounts:
        account_id = account.get("account_id")
        if not account_id:
            continue
        enriched = dict(account)
        metadata = crm_by_id.get(account_id)
        if metadata:
            for key, value in metadata.items():
                if key != "account_id" and key not in enriched:
                    enriched[key] = value
        merged.append(enriched)
    return merged
`,
    visibleTests: [
      {
        id: 'enriches-erp-rows',
        name: 'Enriches ERP rows with matching CRM metadata',
        input: [
          [
            { account_id: 'A', amount: 10 },
            { account_id: 'B', amount: 20 },
          ],
          [
            { account_id: 'A', owner: 'Ana' },
            { account_id: 'C', owner: 'Cora' },
          ],
        ],
        expected: [
          { account_id: 'A', amount: 10, owner: 'Ana' },
          { account_id: 'B', amount: 20 },
        ],
        explanation: 'CRM-only account C should not appear because ERP is authoritative.',
      },
      {
        id: 'preserves-erp-values',
        name: 'ERP values win on conflicting keys',
        input: [[{ account_id: 'A', owner: 'ERP owner', amount: 10 }], [{ account_id: 'A', owner: 'CRM owner', segment: 'Mid-market' }]],
        expected: [{ account_id: 'A', owner: 'ERP owner', amount: 10, segment: 'Mid-market' }],
      },
    ],
    hiddenTests: [
      {
        id: 'skips-invalid-erp',
        name: 'Skips ERP rows without account id',
        input: [[{ amount: 10 }, { account_id: 'B', amount: 20 }], [{ account_id: 'B', owner: 'Bea' }]],
        expected: [{ account_id: 'B', amount: 20, owner: 'Bea' }],
      },
      {
        id: 'does-not-mutate-input',
        name: 'Does not mutate the original ERP row',
        input: [[{ account_id: 'A', amount: 10 }], [{ account_id: 'A', owner: 'Ana' }]],
        expected: [{ account_id: 'A', amount: 10, owner: 'Ana' }],
      },
    ],
    mistakePatterns: [
      {
        id: 'nested-loop-risk',
        label: 'Nested-loop merge risk',
        description: 'Nested loops are easy but scale poorly for integration imports.',
        severity: 'warning',
        detect: 'regex',
        pattern: 'for\\s+\\w+\\s+in\\s+erp_accounts[\\s\\S]*for\\s+\\w+\\s+in\\s+crm_accounts',
        feedback: 'Index CRM rows by account_id first so the merge stays O(e + c).',
      },
      {
        id: 'mutation-risk',
        label: 'Possible input mutation',
        description: 'The output should be a new merged row, not a mutated ERP row.',
        severity: 'warning',
        detect: 'regex',
        pattern: '\\.update\\(|\\[.*\\]\\s*=',
        feedback: 'Use dict(account) to copy ERP rows before adding CRM fields.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return the merged account list.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the merged list.',
      },
    ],
  },
  {
    id: 'validate-missing-fields',
    title: 'Validate rows with missing fields',
    difficulty: 'Easy',
    tags: ['python', 'validation', 'data-quality'],
    prompt:
      'Validate imported rows. Return a list of errors with row index, field and message for each missing required field.',
    brief:
      'Write a pure validator that reports every missing required field across imported rows, instead of stopping at the first error.',
    requirements: [
      'Implement validate_required_fields(rows, required_fields).',
      'Inspect every row and every required field.',
      'Return one error object for each missing field.',
      'Use zero-based row indexes.',
    ],
    inputContract: [
      'rows is a list of dictionaries from an import.',
      'required_fields is a list of field names.',
      'A missing field is either absent, None, or an empty string.',
    ],
    outputContract: [
      'Return a list of {"row": index, "field": field, "message": "Missing required field"}.',
      'Preserve row order, then required_fields order.',
      'Do not treat numeric 0 or boolean False as missing.',
    ],
    edgeCases: [
      'Collect all errors, not only the first error per row.',
      'Empty required_fields should return an empty list.',
      'Empty rows should report every required field as missing.',
    ],
    examples: [
      {
        label: 'Import validation',
        input: `rows = [
  {"department": "Sales", "amount": 0},
  {"department": "", "date": "2026-01-01"}
]
required_fields = ["department", "date", "amount"]`,
        expected: `[
  {"row": 0, "field": "date", "message": "Missing required field"},
  {"row": 1, "field": "department", "message": "Missing required field"},
  {"row": 1, "field": "amount", "message": "Missing required field"}
]`,
      },
    ],
    inputExample: `rows=[{"department": "Sales", "amount": 10}, {"department": "", "date": "2026-01-01"}], required=["department","date","amount"]`,
    expectedOutput: `[{"row": 0, "field": "date", "message": "Missing required field"}, {"row": 1, "field": "department", "message": "Missing required field"}, {"row": 1, "field": "amount", "message": "Missing required field"}]`,
    hints: ['Use enumerate for row indexes.', 'Empty string should count as missing.', 'Zero should not count as missing.'],
    referenceSolution: `def validate_required_fields(rows, required_fields):
    errors = []
    for index, row in enumerate(rows):
        for field in required_fields:
            value = row.get(field)
            if value is None or value == "":
                errors.append({
                    "row": index,
                    "field": field,
                    "message": "Missing required field",
                })
    return errors`,
    pytestTests: `def test_validate_required_fields():
    rows = [{"department": "Sales", "amount": 0}, {"department": "", "date": "2026-01-01"}]
    assert validate_required_fields(rows, ["department", "date", "amount"]) == [
        {"row": 0, "field": "date", "message": "Missing required field"},
        {"row": 1, "field": "department", "message": "Missing required field"},
        {"row": 1, "field": "amount", "message": "Missing required field"},
    ]`,
    complexity: 'O(n*r) time and O(e) space where r is required fields and e is errors.',
    commonMistakes: ['Treating 0 as missing.', 'Only returning the first error per row when all errors are needed.', 'Using one-based row indexes without clarifying.'],
    interviewerTips: ['Clarify output shape.', 'Mention collecting all errors improves user feedback.', 'Discuss schema validation libraries after solving manually.'],
    companyRelevance: ['abacum', 'integrations', 'saas'],
    evaluationMode: 'function',
    functionName: 'validate_required_fields',
    starterCode: `def validate_required_fields(rows, required_fields):
    # return one error dict per missing required field
    # missing means absent, None, or empty string
    # 0 and False are valid values
    pass
`,
    solution: `def validate_required_fields(rows, required_fields):
    errors = []
    for index, row in enumerate(rows):
        for field in required_fields:
            value = row.get(field)
            if value is None or value == "":
                errors.append({
                    "row": index,
                    "field": field,
                    "message": "Missing required field",
                })
    return errors
`,
    visibleTests: [
      {
        id: 'collects-all-errors',
        name: 'Collects all missing-field errors',
        input: [
          [
            { department: 'Sales', amount: 0 },
            { department: '', date: '2026-01-01' },
          ],
          ['department', 'date', 'amount'],
        ],
        expected: [
          { row: 0, field: 'date', message: 'Missing required field' },
          { row: 1, field: 'department', message: 'Missing required field' },
          { row: 1, field: 'amount', message: 'Missing required field' },
        ],
        explanation: '0 is valid, but missing date, empty department and missing amount are errors.',
      },
      {
        id: 'no-required-fields',
        name: 'No required fields gives no errors',
        input: [[{ department: 'Sales' }], []],
        expected: [],
      },
    ],
    hiddenTests: [
      {
        id: 'false-is-valid',
        name: 'False is not missing',
        input: [[{ active: false, amount: 0, name: '' }], ['active', 'amount', 'name']],
        expected: [{ row: 0, field: 'name', message: 'Missing required field' }],
      },
      {
        id: 'empty-row',
        name: 'Empty row reports each required field',
        input: [[{}], ['department', 'date']],
        expected: [
          { row: 0, field: 'department', message: 'Missing required field' },
          { row: 0, field: 'date', message: 'Missing required field' },
        ],
      },
    ],
    mistakePatterns: [
      {
        id: 'truthiness-missing',
        label: 'Truthiness can mark 0 or False as missing',
        description: 'Financial imports often contain valid zero values.',
        severity: 'warning',
        detect: 'regex',
        pattern: 'if\\s+not\\s+\\w+',
        feedback: 'Check explicitly for None or empty string so 0 and False remain valid.',
      },
      {
        id: 'no-enumerate',
        label: 'Row index tracking not obvious',
        description: 'The output needs zero-based row indexes.',
        severity: 'info',
        detect: 'static-not-contains',
        pattern: 'enumerate',
        feedback: 'enumerate(rows) is the clearest way to keep zero-based row indexes.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return the list of validation errors.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the errors list.',
      },
    ],
  },
  {
    id: 'permission-checker',
    title: 'Build a simple permission checker',
    difficulty: 'Medium',
    tags: ['python', 'permissions', 'rbac'],
    prompt:
      'Implement can_access(user, resource, action). Admins can do everything. Managers can read/write resources in their department. Viewers can only read resources in their department.',
    brief:
      'Write a conservative permission function for department-scoped resources. The safest default is to deny unless a rule explicitly grants access.',
    requirements: [
      'Implement can_access(user, resource, action).',
      'Admins can perform any action on any resource.',
      'Managers can read and write resources only in their own department.',
      'Viewers can read resources only in their own department.',
      'Unknown roles and unknown actions must be denied.',
    ],
    inputContract: [
      'user is a dictionary with role and department.',
      'resource is a dictionary with department.',
      'action is a string such as read, write, or delete.',
    ],
    outputContract: [
      'Return True when access is allowed.',
      'Return False when access is denied.',
      'Do not raise for unknown roles/actions; deny by default.',
    ],
    edgeCases: [
      'A manager from Ops cannot read a Sales resource.',
      'A viewer cannot write, even within their department.',
      'Admin is the only role that bypasses department scope.',
    ],
    examples: [
      {
        label: 'Viewer write attempt',
        input: `user = {"role": "viewer", "department": "Sales"}
resource = {"department": "Sales"}
action = "write"`,
        expected: `False`,
      },
    ],
    inputExample: `user={"role": "viewer", "department": "Sales"}; resource={"department": "Sales"}; action="write"`,
    expectedOutput: `False`,
    hints: ['Write explicit branches.', 'Keep action names normalized.', 'Avoid accidentally granting cross-department access.'],
    referenceSolution: `def can_access(user, resource, action):
    role = user.get("role")
    same_department = user.get("department") == resource.get("department")

    if role == "admin":
        return True
    if not same_department:
        return False
    if role == "manager" and action in {"read", "write"}:
        return True
    if role == "viewer" and action == "read":
        return True
    return False`,
    pytestTests: `def test_can_access():
    sales_report = {"department": "Sales"}
    assert can_access({"role": "admin", "department": "Ops"}, sales_report, "delete") is True
    assert can_access({"role": "manager", "department": "Sales"}, sales_report, "write") is True
    assert can_access({"role": "viewer", "department": "Sales"}, sales_report, "write") is False
    assert can_access({"role": "manager", "department": "Ops"}, sales_report, "read") is False`,
    complexity: 'O(1) time and O(1) space.',
    commonMistakes: ['Checking role before tenant/department scope in a way that leaks access.', 'Hard-coding strings across the codebase.', 'Forgetting unknown roles should deny by default.'],
    interviewerTips: ['Say "deny by default".', 'Mention audit logs for financial data.', 'Discuss how this scales to RBAC/ABAC policies.'],
    companyRelevance: ['abacum', 'saas', 'security'],
    evaluationMode: 'function',
    functionName: 'can_access',
    starterCode: `def can_access(user, resource, action):
    # return True only when a rule explicitly grants access
    # admin: any action, any department
    # manager: read/write in same department
    # viewer: read in same department
    pass
`,
    solution: `def can_access(user, resource, action):
    role = user.get("role")
    same_department = user.get("department") == resource.get("department")

    if role == "admin":
        return True
    if not same_department:
        return False
    if role == "manager" and action in {"read", "write"}:
        return True
    if role == "viewer" and action == "read":
        return True
    return False
`,
    visibleTests: [
      {
        id: 'admin-all',
        name: 'Admin can do anything',
        input: [{ role: 'admin', department: 'Ops' }, { department: 'Sales' }, 'delete'],
        expected: true,
      },
      {
        id: 'viewer-cannot-write',
        name: 'Viewer cannot write same-department resource',
        input: [{ role: 'viewer', department: 'Sales' }, { department: 'Sales' }, 'write'],
        expected: false,
      },
      {
        id: 'manager-can-write-same-department',
        name: 'Manager can write same-department resource',
        input: [{ role: 'manager', department: 'Sales' }, { department: 'Sales' }, 'write'],
        expected: true,
      },
    ],
    hiddenTests: [
      {
        id: 'cross-department-denied',
        name: 'Manager cannot read another department',
        input: [{ role: 'manager', department: 'Ops' }, { department: 'Sales' }, 'read'],
        expected: false,
      },
      {
        id: 'unknown-role-denied',
        name: 'Unknown role is denied',
        input: [{ role: 'contractor', department: 'Sales' }, { department: 'Sales' }, 'read'],
        expected: false,
      },
    ],
    mistakePatterns: [
      {
        id: 'no-default-deny',
        label: 'Default deny not obvious',
        description: 'Permission systems should deny unknown roles/actions by default.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'return False|return false',
        feedback: 'End with a deny-by-default return False path.',
      },
      {
        id: 'department-scope-missing',
        label: 'Department scoping may be missing',
        description: 'Non-admin access must be scoped to the same department.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'department',
        feedback: 'Check user and resource department before granting manager/viewer access.',
      },
      {
        id: 'hardcoded-true',
        label: 'Potential over-granting',
        description: 'Permission code should be explicit and conservative.',
        severity: 'warning',
        detect: 'regex',
        pattern: 'return\\s+True\\s*$',
        feedback: 'Make sure every True path is guarded by role and scope checks.',
      },
    ],
  },
  {
    id: 'vendor-quarter-spend',
    title: 'Group expenses by vendor and quarter',
    difficulty: 'Medium',
    tags: ['python', 'dates', 'grouping'],
    prompt:
      'Given expense rows with vendor, date and amount, return spend per vendor per quarter in the format YYYY-Qn.',
    brief:
      'Write a pure function that groups expense rows by vendor and calendar quarter, then sums spend per group.',
    requirements: [
      'Implement spend_by_vendor_quarter(rows).',
      'Use ISO date strings in YYYY-MM-DD format.',
      'Convert month to calendar quarter using (month - 1) // 3 + 1.',
      'Return normal nested dictionaries, not defaultdict objects.',
    ],
    inputContract: [
      'rows is a list of dictionaries.',
      'Each valid row has vendor, date, and amount.',
      'date is an ISO date string; the quarter key should be YYYY-Qn.',
    ],
    outputContract: [
      'Return {"Vendor": {"YYYY-Qn": total_amount}}.',
      'Skip rows missing vendor, date, or amount.',
      'Order of dictionary keys does not matter.',
    ],
    edgeCases: [
      'March is Q1 and April is Q2.',
      'amount = 0 is valid.',
      'Empty input should return {}.',
    ],
    examples: [
      {
        label: 'Vendor quarter spend',
        input: `rows = [
  {"vendor": "AWS", "date": "2026-02-10", "amount": 100},
  {"vendor": "AWS", "date": "2026-04-01", "amount": 200},
  {"vendor": "GitLab", "date": "2026-03-31", "amount": 50}
]`,
        expected: `{
  "AWS": {"2026-Q1": 100, "2026-Q2": 200},
  "GitLab": {"2026-Q1": 50}
}`,
      },
    ],
    inputExample: `[{"vendor": "AWS", "date": "2026-02-10", "amount": 100}, {"vendor": "AWS", "date": "2026-04-01", "amount": 200}]`,
    expectedOutput: `{"AWS": {"2026-Q1": 100, "2026-Q2": 200}}`,
    hints: ['Month to quarter: (month - 1) // 3 + 1.', 'Use date[5:7] if ISO date is guaranteed.', 'Ask whether fiscal quarters differ from calendar quarters.'],
    referenceSolution: `from collections import defaultdict

def spend_by_vendor_quarter(rows):
    totals = defaultdict(lambda: defaultdict(float))
    for row in rows:
        vendor = row.get("vendor")
        date = row.get("date")
        amount = row.get("amount")
        if not vendor or not date or amount is None:
            continue
        year = date[:4]
        month = int(date[5:7])
        quarter = (month - 1) // 3 + 1
        totals[vendor][f"{year}-Q{quarter}"] += amount
    return {vendor: dict(quarters) for vendor, quarters in totals.items()}`,
    pytestTests: `def test_spend_by_vendor_quarter():
    rows = [
        {"vendor": "AWS", "date": "2026-02-10", "amount": 100},
        {"vendor": "AWS", "date": "2026-04-01", "amount": 200},
        {"vendor": "GitLab", "date": "2026-03-31", "amount": 50},
    ]
    assert spend_by_vendor_quarter(rows) == {
        "AWS": {"2026-Q1": 100, "2026-Q2": 200},
        "GitLab": {"2026-Q1": 50},
    }`,
    complexity: 'O(n) time and O(v*q) space.',
    commonMistakes: ['Using zero-based quarters in output.', 'Ignoring fiscal-year definitions.', 'Crashing on missing dates.'],
    interviewerTips: ['Ask whether quarters are fiscal or calendar.', 'Mention date parsing if input is not guaranteed ISO.', 'Keep transformation readable.'],
    companyRelevance: ['abacum', 'finance', 'saas'],
    evaluationMode: 'function',
    functionName: 'spend_by_vendor_quarter',
    starterCode: `def spend_by_vendor_quarter(rows):
    # return {"Vendor": {"YYYY-Qn": total_amount}}
    # use calendar quarters from the ISO date month
    # skip invalid rows, but keep amount=0
    pass
`,
    solution: `from collections import defaultdict

def spend_by_vendor_quarter(rows):
    totals = defaultdict(lambda: defaultdict(float))
    for row in rows:
        vendor = row.get("vendor")
        date = row.get("date")
        amount = row.get("amount")
        if not vendor or not date or amount is None:
            continue
        year = date[:4]
        month = int(date[5:7])
        quarter = (month - 1) // 3 + 1
        totals[vendor][f"{year}-Q{quarter}"] += amount
    return {vendor: dict(quarters) for vendor, quarters in totals.items()}
`,
    visibleTests: [
      {
        id: 'groups-vendor-quarters',
        name: 'Groups vendor spend by calendar quarter',
        input: [
          [
            { vendor: 'AWS', date: '2026-02-10', amount: 100 },
            { vendor: 'AWS', date: '2026-04-01', amount: 200 },
            { vendor: 'GitLab', date: '2026-03-31', amount: 50 },
          ],
        ],
        expected: {
          AWS: { '2026-Q1': 100, '2026-Q2': 200 },
          GitLab: { '2026-Q1': 50 },
        },
        explanation: 'March belongs to Q1; April belongs to Q2.',
      },
      {
        id: 'skips-invalid-keeps-zero',
        name: 'Skips invalid rows but keeps zero amount',
        input: [[{ vendor: 'AWS', date: '2026-01-01', amount: 0 }, { vendor: '', date: '2026-01-01', amount: 99 }, { vendor: 'AWS', amount: 10 }]],
        expected: { AWS: { '2026-Q1': 0 } },
      },
    ],
    hiddenTests: [
      {
        id: 'quarter-boundaries',
        name: 'Handles quarter boundaries',
        input: [[{ vendor: 'Vercel', date: '2026-06-30', amount: 10 }, { vendor: 'Vercel', date: '2026-07-01', amount: 15 }]],
        expected: { Vercel: { '2026-Q2': 10, '2026-Q3': 15 } },
      },
      {
        id: 'empty-expenses',
        name: 'Empty input returns empty dict',
        input: [[]],
        expected: {},
      },
    ],
    mistakePatterns: [
      {
        id: 'quarter-formula',
        label: 'Quarter calculation not obvious',
        description: 'Calendar quarters are easy to get off by one.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: '//\\s*3|/\\s*3',
        feedback: 'Use (month - 1) // 3 + 1 to map Jan-Mar to Q1, Apr-Jun to Q2, and so on.',
      },
      {
        id: 'no-vendor-grouping',
        label: 'Vendor grouping may be missing',
        description: 'The output is nested by vendor and quarter.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'vendor',
        feedback: 'Group by vendor first, then by quarter.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return the nested spend dictionary.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the totals dictionary.',
      },
    ],
  },
  {
    id: 'pagination',
    title: 'Implement pagination',
    difficulty: 'Easy',
    tags: ['python', 'pagination', 'api'],
    prompt:
      'Implement paginate(items, page, page_size) returning items, total, page, page_size and has_next. Pages are one-based.',
    brief:
      'Write a pure helper for one-based offset pagination that normalizes invalid page inputs and returns metadata with the page slice.',
    requirements: [
      'Implement paginate(items, page, page_size).',
      'Treat pages as one-based.',
      'Normalize page < 1 to 1 and page_size < 1 to 1.',
      'Compute has_next from the normalized page window.',
    ],
    inputContract: [
      'items is a list.',
      'page is an integer requested by the caller.',
      'page_size is an integer requested by the caller.',
    ],
    outputContract: [
      'Return {"items": [...], "total": n, "page": page, "page_size": page_size, "has_next": bool}.',
      'items must contain only the requested page slice.',
      'total is the length of the original items list.',
    ],
    edgeCases: [
      'Page 1 starts at index 0.',
      'A page beyond the end returns an empty items list.',
      'Do not mutate the input list.',
    ],
    examples: [
      {
        label: 'Second page',
        input: `items = [1, 2, 3, 4, 5]
page = 2
page_size = 2`,
        expected: `{
  "items": [3, 4],
  "total": 5,
  "page": 2,
  "page_size": 2,
  "has_next": True
}`,
      },
    ],
    inputExample: `items=[1,2,3,4,5], page=2, page_size=2`,
    expectedOutput: `{"items": [3,4], "total": 5, "page": 2, "page_size": 2, "has_next": True}`,
    hints: ['Normalize invalid page and page_size.', 'Compute start = (page - 1) * page_size.', 'Do not mutate items.'],
    referenceSolution: `def paginate(items, page, page_size):
    page = max(1, page)
    page_size = max(1, page_size)
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "has_next": end < total,
    }`,
    pytestTests: `def test_paginate():
    assert paginate([1, 2, 3, 4, 5], 2, 2) == {
        "items": [3, 4],
        "total": 5,
        "page": 2,
        "page_size": 2,
        "has_next": True,
    }
    assert paginate([1], 0, 0)["items"] == [1]`,
    complexity: 'O(k) time for the returned page slice and O(k) space.',
    commonMistakes: ['Off-by-one page math.', 'Returning has_next true on the last page.', 'Ignoring invalid inputs.'],
    interviewerTips: ['Mention offset pagination limitations in databases.', 'Discuss keyset pagination for large tables.', 'Clarify one-based vs zero-based pages.'],
    companyRelevance: ['abacum', 'api', 'saas'],
    evaluationMode: 'function',
    functionName: 'paginate',
    starterCode: `def paginate(items, page, page_size):
    # pages are one-based
    # normalize invalid page/page_size values to 1
    # return items slice plus total/page/page_size/has_next
    pass
`,
    solution: `def paginate(items, page, page_size):
    page = max(1, page)
    page_size = max(1, page_size)
    total = len(items)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "page_size": page_size,
        "has_next": end < total,
    }
`,
    visibleTests: [
      {
        id: 'second-page',
        name: 'Returns the second one-based page',
        input: [[1, 2, 3, 4, 5], 2, 2],
        expected: { items: [3, 4], total: 5, page: 2, page_size: 2, has_next: true },
        explanation: 'Page 2 with size 2 starts at index 2.',
      },
      {
        id: 'normalizes-invalid-values',
        name: 'Normalizes invalid page and page size',
        input: [[1], 0, 0],
        expected: { items: [1], total: 1, page: 1, page_size: 1, has_next: false },
      },
    ],
    hiddenTests: [
      {
        id: 'last-page',
        name: 'Last partial page has no next page',
        input: [[1, 2, 3, 4, 5], 3, 2],
        expected: { items: [5], total: 5, page: 3, page_size: 2, has_next: false },
      },
      {
        id: 'beyond-end',
        name: 'Page beyond end returns empty list',
        input: [[1, 2, 3], 5, 2],
        expected: { items: [], total: 3, page: 5, page_size: 2, has_next: false },
      },
    ],
    mistakePatterns: [
      {
        id: 'zero-based-page-risk',
        label: 'Potential zero-based page math',
        description: 'The prompt defines pages as one-based.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'page - 1|page\\s*-\\s*1',
        feedback: 'Use start = (page - 1) * page_size for one-based pagination.',
      },
      {
        id: 'missing-has-next',
        label: 'Missing has_next metadata',
        description: 'API pagination responses need caller-friendly metadata.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'has_next',
        feedback: 'Return has_next based on whether the end index is still before total.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return a pagination dictionary.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the pagination metadata dictionary.',
      },
    ],
  },
  {
    id: 'reconcile-transactions',
    title: 'Reconcile expected vs actual transactions',
    difficulty: 'Medium',
    tags: ['python', 'reconciliation', 'finance'],
    prompt:
      'Compare expected and actual transactions by id. Return missing ids, unexpected ids and amount mismatches.',
    brief:
      'Write a pure reconciliation function that compares expected and actual transaction imports by id and explains the differences.',
    requirements: [
      'Implement reconcile(expected, actual).',
      'Index both lists by transaction id.',
      'Return ids missing from actual, ids unexpected in actual, and amount mismatches for ids present on both sides.',
      'Sort ids so the output is deterministic.',
    ],
    inputContract: [
      'expected is a list of dictionaries with id and amount.',
      'actual is a list of dictionaries with id and amount.',
      'Each id is assumed unique for this exercise.',
    ],
    outputContract: [
      'Return {"missing": [...], "unexpected": [...], "mismatched": [...]}.',
      'missing contains ids present in expected but absent from actual.',
      'unexpected contains ids present in actual but absent from expected.',
      'mismatched contains {"id": id, "expected": amount, "actual": amount}.',
    ],
    edgeCases: [
      'Matching ids with equal amounts are not reported.',
      'Return sorted missing and unexpected ids.',
      'Return mismatches sorted by id.',
    ],
    examples: [
      {
        label: 'Expected vs actual import',
        input: `expected = [
  {"id": "A", "amount": 10},
  {"id": "C", "amount": 7}
]
actual = [
  {"id": "A", "amount": 12},
  {"id": "B", "amount": 5}
]`,
        expected: `{
  "missing": ["C"],
  "unexpected": ["B"],
  "mismatched": [{"id": "A", "expected": 10, "actual": 12}]
}`,
      },
    ],
    inputExample: `expected=[{"id":"A","amount":10}], actual=[{"id":"A","amount":12},{"id":"B","amount":5}]`,
    expectedOutput: `{"missing": [], "unexpected": ["B"], "mismatched": [{"id": "A", "expected": 10, "actual": 12}]}`,
    hints: ['Index both lists by id.', 'Think about duplicate ids separately.', 'Sort ids for deterministic output.'],
    referenceSolution: `def reconcile(expected, actual):
    expected_by_id = {row["id"]: row for row in expected}
    actual_by_id = {row["id"]: row for row in actual}
    expected_ids = set(expected_by_id)
    actual_ids = set(actual_by_id)

    mismatched = []
    for transaction_id in sorted(expected_ids & actual_ids):
        expected_amount = expected_by_id[transaction_id].get("amount")
        actual_amount = actual_by_id[transaction_id].get("amount")
        if expected_amount != actual_amount:
            mismatched.append({
                "id": transaction_id,
                "expected": expected_amount,
                "actual": actual_amount,
            })

    return {
        "missing": sorted(expected_ids - actual_ids),
        "unexpected": sorted(actual_ids - expected_ids),
        "mismatched": mismatched,
    }`,
    pytestTests: `def test_reconcile():
    expected = [{"id": "A", "amount": 10}, {"id": "C", "amount": 7}]
    actual = [{"id": "A", "amount": 12}, {"id": "B", "amount": 5}]
    assert reconcile(expected, actual) == {
        "missing": ["C"],
        "unexpected": ["B"],
        "mismatched": [{"id": "A", "expected": 10, "actual": 12}],
    }`,
    complexity: 'O(n + m) time and O(n + m) space.',
    commonMistakes: ['Nested loops.', 'Not making output deterministic.', 'Ignoring duplicate transaction ids.'],
    interviewerTips: ['Call out duplicate handling as a follow-up.', 'Use precise financial language.', 'Mention tolerance for decimals if relevant.'],
    companyRelevance: ['abacum', 'finance', 'saas'],
    evaluationMode: 'function',
    functionName: 'reconcile',
    starterCode: `def reconcile(expected, actual):
    # compare transaction lists by id
    # return missing ids, unexpected ids, and amount mismatches
    # make output deterministic by sorting ids
    pass
`,
    solution: `def reconcile(expected, actual):
    expected_by_id = {row["id"]: row for row in expected}
    actual_by_id = {row["id"]: row for row in actual}
    expected_ids = set(expected_by_id)
    actual_ids = set(actual_by_id)

    mismatched = []
    for transaction_id in sorted(expected_ids & actual_ids):
        expected_amount = expected_by_id[transaction_id].get("amount")
        actual_amount = actual_by_id[transaction_id].get("amount")
        if expected_amount != actual_amount:
            mismatched.append({
                "id": transaction_id,
                "expected": expected_amount,
                "actual": actual_amount,
            })

    return {
        "missing": sorted(expected_ids - actual_ids),
        "unexpected": sorted(actual_ids - expected_ids),
        "mismatched": mismatched,
    }
`,
    visibleTests: [
      {
        id: 'basic-reconciliation',
        name: 'Reports missing, unexpected and mismatched transactions',
        input: [
          [
            { id: 'A', amount: 10 },
            { id: 'C', amount: 7 },
          ],
          [
            { id: 'A', amount: 12 },
            { id: 'B', amount: 5 },
          ],
        ],
        expected: {
          missing: ['C'],
          unexpected: ['B'],
          mismatched: [{ id: 'A', expected: 10, actual: 12 }],
        },
      },
      {
        id: 'matching-empty-diff',
        name: 'Matching transactions produce empty diff',
        input: [[{ id: 'A', amount: 10 }], [{ id: 'A', amount: 10 }]],
        expected: { missing: [], unexpected: [], mismatched: [] },
      },
    ],
    hiddenTests: [
      {
        id: 'sorted-output',
        name: 'Sorts ids deterministically',
        input: [
          [
            { id: 'C', amount: 3 },
            { id: 'A', amount: 1 },
          ],
          [
            { id: 'D', amount: 4 },
            { id: 'B', amount: 2 },
          ],
        ],
        expected: { missing: ['A', 'C'], unexpected: ['B', 'D'], mismatched: [] },
      },
      {
        id: 'multiple-mismatches-sorted',
        name: 'Returns mismatches sorted by id',
        input: [[{ id: 'B', amount: 20 }, { id: 'A', amount: 10 }], [{ id: 'B', amount: 25 }, { id: 'A', amount: 5 }]],
        expected: {
          missing: [],
          unexpected: [],
          mismatched: [
            { id: 'A', expected: 10, actual: 5 },
            { id: 'B', expected: 20, actual: 25 },
          ],
        },
      },
    ],
    mistakePatterns: [
      {
        id: 'nested-loop-risk',
        label: 'Nested-loop reconciliation risk',
        description: 'Nested loops make reconciliation slower and noisier than needed.',
        severity: 'warning',
        detect: 'regex',
        pattern: 'for\\s+\\w+\\s+in\\s+expected[\\s\\S]*for\\s+\\w+\\s+in\\s+actual',
        feedback: 'Index both lists by id, then compare sets of ids.',
      },
      {
        id: 'not-sorted',
        label: 'Deterministic sorting not obvious',
        description: 'Sorted output makes tests and interview explanations cleaner.',
        severity: 'info',
        detect: 'static-not-contains',
        pattern: 'sorted',
        feedback: 'Sort missing, unexpected and common ids before building the result.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return the reconciliation summary.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the reconciliation dictionary.',
      },
    ],
  },
  {
    id: 'stale-integrations',
    title: 'Detect stale integrations',
    difficulty: 'Easy',
    tags: ['python', 'dates', 'integrations'],
    prompt:
      'Given integrations with last_success_at as YYYY-MM-DD and a current date, return integration ids stale by more than threshold_days.',
    brief:
      'Write a pure function that identifies integrations whose last successful sync is older than the allowed threshold.',
    requirements: [
      'Implement stale_integrations(integrations, today, threshold_days).',
      'Parse dates with datetime.date.fromisoformat.',
      'An integration is stale when age in days is strictly greater than threshold_days.',
      'Treat missing last_success_at as stale.',
    ],
    inputContract: [
      'integrations is a list of dictionaries with id and last_success_at.',
      'today is a YYYY-MM-DD string.',
      'threshold_days is an integer.',
    ],
    outputContract: [
      'Return a list of stale integration ids.',
      'Preserve input order.',
      'Do not include integrations whose age is exactly threshold_days.',
    ],
    edgeCases: [
      'Missing or None last_success_at is stale.',
      'Exactly threshold_days old is not stale because the rule is "more than".',
      'Empty input returns an empty list.',
    ],
    examples: [
      {
        label: 'Integration health check',
        input: `integrations = [
  {"id": "erp", "last_success_at": "2026-01-01"},
  {"id": "crm", "last_success_at": "2026-01-09"},
  {"id": "hris", "last_success_at": None}
]
today = "2026-01-10"
threshold_days = 7`,
        expected: `["erp", "hris"]`,
      },
    ],
    inputExample: `integrations=[{"id":"erp","last_success_at":"2026-01-01"}], today="2026-01-10", threshold_days=7`,
    expectedOutput: `["erp"]`,
    hints: ['Use datetime.date.fromisoformat.', 'A missing last_success_at may be stale depending on requirements.', 'Clarify greater than vs greater or equal.'],
    referenceSolution: `from datetime import date

def stale_integrations(integrations, today, threshold_days):
    today_date = date.fromisoformat(today)
    stale = []
    for integration in integrations:
        last_success_at = integration.get("last_success_at")
        if not last_success_at:
            stale.append(integration.get("id"))
            continue
        age = (today_date - date.fromisoformat(last_success_at)).days
        if age > threshold_days:
            stale.append(integration.get("id"))
    return stale`,
    pytestTests: `def test_stale_integrations():
    rows = [
        {"id": "erp", "last_success_at": "2026-01-01"},
        {"id": "crm", "last_success_at": "2026-01-09"},
        {"id": "hris", "last_success_at": None},
    ]
    assert stale_integrations(rows, "2026-01-10", 7) == ["erp", "hris"]`,
    complexity: 'O(n) time and O(s) space.',
    commonMistakes: ['Comparing date strings manually.', 'Ambiguous threshold inclusivity.', 'Crashing on missing timestamps.'],
    interviewerTips: ['Clarify missing timestamp semantics.', 'Mention time zones for timestamps.', 'Connect to alerting and SLAs.'],
    companyRelevance: ['abacum', 'integrations', 'reliability'],
    evaluationMode: 'function',
    functionName: 'stale_integrations',
    starterCode: `def stale_integrations(integrations, today, threshold_days):
    # return ids whose last_success_at is older than threshold_days
    # missing last_success_at counts as stale
    # exactly threshold_days old is not stale
    pass
`,
    solution: `from datetime import date

def stale_integrations(integrations, today, threshold_days):
    today_date = date.fromisoformat(today)
    stale = []
    for integration in integrations:
        last_success_at = integration.get("last_success_at")
        if not last_success_at:
            stale.append(integration.get("id"))
            continue
        age = (today_date - date.fromisoformat(last_success_at)).days
        if age > threshold_days:
            stale.append(integration.get("id"))
    return stale
`,
    visibleTests: [
      {
        id: 'detects-stale-and-missing',
        name: 'Detects stale and missing timestamps',
        input: [
          [
            { id: 'erp', last_success_at: '2026-01-01' },
            { id: 'crm', last_success_at: '2026-01-09' },
            { id: 'hris', last_success_at: null },
          ],
          '2026-01-10',
          7,
        ],
        expected: ['erp', 'hris'],
      },
      {
        id: 'threshold-exclusive',
        name: 'Exactly threshold days old is not stale',
        input: [[{ id: 'erp', last_success_at: '2026-01-03' }], '2026-01-10', 7],
        expected: [],
      },
    ],
    hiddenTests: [
      {
        id: 'preserves-order',
        name: 'Preserves input order of stale ids',
        input: [
          [
            { id: 'a', last_success_at: '2026-01-01' },
            { id: 'b', last_success_at: '2026-01-02' },
            { id: 'c', last_success_at: '2026-01-10' },
          ],
          '2026-01-20',
          7,
        ],
        expected: ['a', 'b'],
      },
      {
        id: 'empty-integrations',
        name: 'Empty input returns empty list',
        input: [[], '2026-01-10', 7],
        expected: [],
      },
    ],
    mistakePatterns: [
      {
        id: 'date-parsing-missing',
        label: 'Date parsing not obvious',
        description: 'String comparison can hide subtle date/time bugs.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'fromisoformat',
        feedback: 'Use date.fromisoformat(...) before subtracting dates.',
      },
      {
        id: 'inclusive-threshold-risk',
        label: 'Threshold inclusivity risk',
        description: 'The prompt says stale by more than threshold_days.',
        severity: 'info',
        detect: 'regex',
        pattern: '>=\\s*threshold_days',
        feedback: 'Use age > threshold_days, not >=, for this prompt.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return stale integration ids.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the stale id list.',
      },
    ],
  },
  {
    id: 'normalize-field-names',
    title: 'Normalize external field names',
    difficulty: 'Easy',
    tags: ['python', 'normalization', 'integrations'],
    prompt:
      'Normalize external row keys using a mapping. Preserve unmapped keys in snake_case.',
    brief:
      'Write a pure function that normalizes one external-system row into internal field names, using explicit mappings first and snake_case as fallback.',
    requirements: [
      'Implement normalize_fields(row, mapping).',
      'For each input key, use mapping[key] when it exists.',
      'For unmapped keys, convert the key to snake_case.',
      'Keep values unchanged.',
    ],
    inputContract: [
      'row is a dictionary with external field names.',
      'mapping is a dictionary from exact external keys to internal keys.',
      'External keys may contain spaces, hyphens, punctuation, or mixed case.',
    ],
    outputContract: [
      'Return a new dictionary with normalized keys.',
      'Do not mutate the input row.',
      'Mapping takes precedence over generic snake_case conversion.',
    ],
    edgeCases: [
      'Strip leading and trailing separators when converting to snake_case.',
      'Do not lowercase or transform values.',
      'If two fields normalize to the same output key, later fields may overwrite earlier ones for this exercise.',
    ],
    examples: [
      {
        label: 'External import row',
        input: `row = {
  "Department Name": "Sales",
  "Forecast Amount": 10,
  "External-ID": "A1"
}
mapping = {
  "Department Name": "department",
  "Forecast Amount": "forecast"
}`,
        expected: `{
  "department": "Sales",
  "forecast": 10,
  "external_id": "A1"
}`,
      },
    ],
    inputExample: `row={"Department Name": "Sales", "Forecast Amount": 10, "External-ID": "A1"}`,
    expectedOutput: `{"department": "Sales", "forecast": 10, "external_id": "A1"}`,
    hints: ['Create a small snake_case helper.', 'Mapping should override generic normalization.', 'Keep values unchanged.'],
    referenceSolution: `import re

def to_snake_case(value):
    value = re.sub(r"[^0-9a-zA-Z]+", "_", value).strip("_")
    return value.lower()

def normalize_fields(row, mapping):
    normalized = {}
    for key, value in row.items():
        target_key = mapping.get(key, to_snake_case(key))
        normalized[target_key] = value
    return normalized`,
    pytestTests: `def test_normalize_fields():
    row = {"Department Name": "Sales", "Forecast Amount": 10, "External-ID": "A1"}
    mapping = {"Department Name": "department", "Forecast Amount": "forecast"}
    assert normalize_fields(row, mapping) == {
        "department": "Sales",
        "forecast": 10,
        "external_id": "A1",
    }`,
    complexity: 'O(k * l) time for k keys of average length l and O(k) space.',
    commonMistakes: ['Lowercasing values.', 'Ignoring mapping precedence.', 'Leaving trailing underscores.'],
    interviewerTips: ['Ask about conflicting normalized keys.', 'Mention schema versions.', 'Keep helper testable.'],
    companyRelevance: ['abacum', 'integrations', 'saas'],
    evaluationMode: 'function',
    functionName: 'normalize_fields',
    starterCode: `import re

def to_snake_case(value):
    # Convert external keys like "External-ID" to "external_id".
    pass

def normalize_fields(row, mapping):
    # mapping has priority over generic snake_case conversion.
    # return a new dict and keep values unchanged.
    pass
`,
    solution: `import re

def to_snake_case(value):
    value = re.sub(r"[^0-9a-zA-Z]+", "_", value).strip("_")
    return value.lower()

def normalize_fields(row, mapping):
    normalized = {}
    for key, value in row.items():
        target_key = mapping.get(key, to_snake_case(key))
        normalized[target_key] = value
    return normalized
`,
    visibleTests: [
      {
        id: 'mapping-and-snake-case',
        name: 'Uses mapping first and snake_case fallback',
        input: [
          { 'Department Name': 'Sales', 'Forecast Amount': 10, 'External-ID': 'A1' },
          { 'Department Name': 'department', 'Forecast Amount': 'forecast' },
        ],
        expected: { department: 'Sales', forecast: 10, external_id: 'A1' },
        explanation: 'Mapped keys use the configured names; External-ID falls back to snake_case.',
      },
      {
        id: 'keeps-values-unchanged',
        name: 'Keeps values unchanged',
        input: [{ 'Owner Name': 'Ana Gomez', Amount: 0 }, {}],
        expected: { owner_name: 'Ana Gomez', amount: 0 },
      },
    ],
    hiddenTests: [
      {
        id: 'strips-punctuation',
        name: 'Strips leading and trailing separators',
        input: [{ '--External ID--': 'A1', 'Budget 2026': 100 }, {}],
        expected: { external_id: 'A1', budget_2026: 100 },
      },
      {
        id: 'mapping-precedence',
        name: 'Mapping overrides generic normalization',
        input: [{ 'Forecast Amount': 10 }, { 'Forecast Amount': 'forecast' }],
        expected: { forecast: 10 },
      },
    ],
    mistakePatterns: [
      {
        id: 'mapping-not-used',
        label: 'Mapping precedence not obvious',
        description: 'Configured mappings should override generic normalization.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'mapping',
        feedback: 'Look up the external key in mapping before falling back to snake_case.',
      },
      {
        id: 'value-lowercase-risk',
        label: 'Possible value transformation',
        description: 'Only keys should be normalized; values must stay unchanged.',
        severity: 'warning',
        detect: 'regex',
        pattern: 'value\\.lower\\(|str\\(value\\)\\.lower',
        feedback: 'Do not lowercase or otherwise normalize row values.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return the normalized row dictionary.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the normalized dictionary.',
      },
    ],
  },
  {
    id: 'top-departments-spend',
    title: 'Top N departments by spend',
    difficulty: 'Easy',
    tags: ['python', 'sorting', 'aggregation'],
    prompt:
      'Return the top N departments by total spend, sorted by spend descending and department ascending for ties.',
    brief:
      'Write a pure function that aggregates spend by department and returns the top N departments with deterministic tie-breaking.',
    requirements: [
      'Implement top_departments_by_spend(rows, n).',
      'Aggregate total amount per department before sorting.',
      'Sort by spend descending.',
      'Break ties by department name ascending.',
      'Return at most n entries.',
    ],
    inputContract: [
      'rows is a list of dictionaries with department and amount.',
      'n is the maximum number of departments to return.',
      'Rows can be missing department or amount.',
    ],
    outputContract: [
      'Return a list of (department, total) pairs.',
      'The browser runner displays tuples as JSON arrays.',
      'Skip rows missing department or amount.',
    ],
    edgeCases: [
      'amount = 0 is valid.',
      'n larger than the number of departments returns all departments.',
      'n <= 0 should return an empty list.',
    ],
    examples: [
      {
        label: 'Top spenders',
        input: `rows = [
  {"department": "Sales", "amount": 10},
  {"department": "Ops", "amount": 20},
  {"department": "Sales", "amount": 15},
  {"department": "Finance", "amount": 25}
]
n = 2`,
        expected: `[
  ("Finance", 25),
  ("Sales", 25)
]`,
      },
    ],
    inputExample: `[{"department":"Sales","amount":10},{"department":"Ops","amount":20}], n=1`,
    expectedOutput: `[("Ops", 20)]`,
    hints: ['Aggregate first, sort second.', 'Tie-breaking makes tests deterministic.', 'Think about n larger than number of departments.'],
    referenceSolution: `from collections import defaultdict

def top_departments_by_spend(rows, n):
    totals = defaultdict(float)
    for row in rows:
        department = row.get("department")
        amount = row.get("amount")
        if department and amount is not None:
            totals[department] += amount
    return sorted(totals.items(), key=lambda item: (-item[1], item[0]))[:n]`,
    pytestTests: `def test_top_departments_by_spend():
    rows = [
        {"department": "Sales", "amount": 10},
        {"department": "Ops", "amount": 20},
        {"department": "Sales", "amount": 15},
        {"department": "Finance", "amount": 25},
    ]
    assert top_departments_by_spend(rows, 2) == [("Finance", 25), ("Sales", 25)]`,
    complexity: 'O(n + d log d) time and O(d) space.',
    commonMistakes: ['Sorting rows before aggregating.', 'Unstable tie behavior.', 'Ignoring zero amounts.'],
    interviewerTips: ['Mention heap if d is huge and N is small.', 'Clarify output shape.', 'Use deterministic sorting.'],
    companyRelevance: ['abacum', 'finance', 'saas'],
    evaluationMode: 'function',
    functionName: 'top_departments_by_spend',
    starterCode: `def top_departments_by_spend(rows, n):
    # aggregate spend by department before sorting
    # sort by total descending, then department ascending
    # return at most n (department, total) pairs
    pass
`,
    solution: `from collections import defaultdict

def top_departments_by_spend(rows, n):
    if n <= 0:
        return []

    totals = defaultdict(float)
    for row in rows:
        department = row.get("department")
        amount = row.get("amount")
        if department and amount is not None:
            totals[department] += amount

    return sorted(totals.items(), key=lambda item: (-item[1], item[0]))[:n]
`,
    visibleTests: [
      {
        id: 'top-two-with-tie',
        name: 'Aggregates first and sorts with tie-break',
        input: [
          [
            { department: 'Sales', amount: 10 },
            { department: 'Ops', amount: 20 },
            { department: 'Sales', amount: 15 },
            { department: 'Finance', amount: 25 },
          ],
          2,
        ],
        expected: [
          ['Finance', 25],
          ['Sales', 25],
        ],
        explanation: 'Finance and Sales tie at 25, so department name breaks the tie.',
      },
      {
        id: 'keeps-zero',
        name: 'Zero amount is valid',
        input: [[{ department: 'Ops', amount: 0 }], 3],
        expected: [['Ops', 0]],
      },
    ],
    hiddenTests: [
      {
        id: 'n-larger-than-departments',
        name: 'n larger than department count returns all',
        input: [[{ department: 'B', amount: 1 }, { department: 'A', amount: 1 }], 10],
        expected: [
          ['A', 1],
          ['B', 1],
        ],
      },
      {
        id: 'non-positive-n',
        name: 'Non-positive n returns empty list',
        input: [[{ department: 'Sales', amount: 10 }], 0],
        expected: [],
      },
    ],
    mistakePatterns: [
      {
        id: 'sort-before-aggregate-risk',
        label: 'May sort before aggregating',
        description: 'Rows are not departments; departments can appear multiple times.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'totals|defaultdict|dict\\(',
        feedback: 'Aggregate totals per department first, then sort departments.',
      },
      {
        id: 'tie-break-missing',
        label: 'Tie-break not obvious',
        description: 'Deterministic sorting avoids flaky outputs.',
        severity: 'info',
        detect: 'static-not-contains',
        pattern: 'lambda',
        feedback: 'Sort by (-total, department) so ties are alphabetical.',
      },
      {
        id: 'no-return',
        label: 'No return statement',
        description: 'The function should return the top departments list.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'return',
        feedback: 'Return the sorted top-N list.',
      },
    ],
  },
  {
    id: 'rate-limiter',
    title: 'Fixed-window rate limiter',
    difficulty: 'Medium',
    tags: ['python', 'api', 'rate-limiting'],
    prompt:
      'Implement allow_request(user_id, timestamp_seconds) for a fixed-window limiter with max_requests per window_seconds.',
    inputExample: `limiter=RateLimiter(2, 60); calls at 0, 10, 20`,
    expectedOutput: `True, True, False`,
    hints: ['Key by user and window number.', 'A dict of counters is enough.', 'Discuss cleanup as a follow-up.'],
    referenceSolution: `from collections import defaultdict

class RateLimiter:
    def __init__(self, max_requests, window_seconds):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.counts = defaultdict(int)

    def allow_request(self, user_id, timestamp_seconds):
        window = timestamp_seconds // self.window_seconds
        key = (user_id, window)
        if self.counts[key] >= self.max_requests:
            return False
        self.counts[key] += 1
        return True`,
    pytestTests: `def test_rate_limiter():
    limiter = RateLimiter(max_requests=2, window_seconds=60)
    assert limiter.allow_request("u1", 0) is True
    assert limiter.allow_request("u1", 10) is True
    assert limiter.allow_request("u1", 20) is False
    assert limiter.allow_request("u1", 61) is True
    assert limiter.allow_request("u2", 20) is True`,
    complexity: 'O(1) time per request and O(users * active_windows) space.',
    commonMistakes: ['Using one global counter.', 'Off-by-one at window boundaries.', 'Never cleaning old windows in production.'],
    interviewerTips: ['State fixed-window limitations.', 'Offer sliding window/token bucket as follow-up.', 'Mention Redis for distributed APIs.'],
    companyRelevance: ['saas', 'api', 'backend'],
  },
  {
    id: 'idempotency-deduplication',
    title: 'Idempotency key deduplication',
    difficulty: 'Medium',
    tags: ['python', 'idempotency', 'integrations'],
    prompt:
      'Process payment-like events once per idempotency_key. Return accepted events and duplicate keys. Events missing keys should be rejected.',
    brief:
      'Write a pure function that simulates idempotent event processing: accept the first event for each key, report later retries, and reject events without a usable key.',
    requirements: [
      'Implement dedupe_by_idempotency_key(events).',
      'Accept the first event for each non-empty idempotency_key.',
      'For later events with an already-seen key, append the key to duplicates.',
      'Events with missing or empty idempotency_key belong in rejected.',
      'Preserve input order inside accepted, duplicates, and rejected.',
    ],
    inputContract: [
      'events is a list of dictionaries.',
      'A valid event has a non-empty idempotency_key.',
      'Events may contain extra fields such as amount, source, or payload.',
    ],
    outputContract: [
      'Return {"accepted": [...], "duplicates": [...], "rejected": [...]}.',
      'accepted contains event dictionaries, not keys.',
      'duplicates contains duplicate key strings, not event dictionaries.',
      'rejected contains the original invalid event dictionaries.',
    ],
    edgeCases: [
      'The same key can appear more than twice; report every duplicate occurrence.',
      'An empty string key is rejected, not accepted.',
      'Do not mutate the input events.',
    ],
    examples: [
      {
        label: 'Retry stream',
        input: `events = [
  {"idempotency_key": "A"},
  {"idempotency_key": "A"},
  {"amount": 10}
]`,
        expected: `{
  "accepted": [{"idempotency_key": "A"}],
  "duplicates": ["A"],
  "rejected": [{"amount": 10}]
}`,
      },
    ],
    inputExample: `[{"idempotency_key":"A"}, {"idempotency_key":"A"}, {"amount":10}]`,
    expectedOutput: `{"accepted": [{"idempotency_key": "A"}], "duplicates": ["A"], "rejected": [{"amount": 10}]}`,
    hints: ['Use a seen set.', 'Separate duplicate from rejected.', 'Preserve accepted input order.'],
    referenceSolution: `def dedupe_by_idempotency_key(events):
    seen = set()
    accepted = []
    duplicates = []
    rejected = []

    for event in events:
        key = event.get("idempotency_key")
        if not key:
            rejected.append(event)
        elif key in seen:
            duplicates.append(key)
        else:
            seen.add(key)
            accepted.append(event)

    return {"accepted": accepted, "duplicates": duplicates, "rejected": rejected}`,
    pytestTests: `def test_dedupe_by_idempotency_key():
    events = [{"idempotency_key": "A"}, {"idempotency_key": "A"}, {"amount": 10}]
    assert dedupe_by_idempotency_key(events) == {
        "accepted": [{"idempotency_key": "A"}],
        "duplicates": ["A"],
        "rejected": [{"amount": 10}],
    }`,
    complexity: 'O(n) time and O(n) space.',
    commonMistakes: ['Treating missing keys as accepted.', 'Returning duplicate events when keys are requested.', 'Not preserving accepted order.'],
    interviewerTips: ['Mention database unique constraints.', 'Discuss idempotency across retries.', 'Connect to external integrations.'],
    companyRelevance: ['abacum', 'integrations', 'saas'],
    evaluationMode: 'function',
    functionName: 'dedupe_by_idempotency_key',
    starterCode: `def dedupe_by_idempotency_key(events):
    # return {"accepted": [...], "duplicates": [...], "rejected": [...]}
    # accepted: first event for each non-empty key
    # duplicates: duplicate keys, not duplicate events
    # rejected: events missing a non-empty key
    pass
`,
    solution: `def dedupe_by_idempotency_key(events):
    seen = set()
    accepted = []
    duplicates = []
    rejected = []

    for event in events:
        key = event.get("idempotency_key")
        if not key:
            rejected.append(event)
        elif key in seen:
            duplicates.append(key)
        else:
            seen.add(key)
            accepted.append(event)

    return {"accepted": accepted, "duplicates": duplicates, "rejected": rejected}
`,
    visibleTests: [
      {
        id: 'basic-idempotency',
        name: 'Accepts first event and reports duplicate key',
        input: [[{ idempotency_key: 'A' }, { idempotency_key: 'A' }, { amount: 10 }]],
        expected: {
          accepted: [{ idempotency_key: 'A' }],
          duplicates: ['A'],
          rejected: [{ amount: 10 }],
        },
      },
      {
        id: 'preserve-order',
        name: 'Preserves accepted order',
        input: [[{ idempotency_key: 'A', amount: 10 }, { idempotency_key: 'B', amount: 20 }]],
        expected: {
          accepted: [
            { idempotency_key: 'A', amount: 10 },
            { idempotency_key: 'B', amount: 20 },
          ],
          duplicates: [],
          rejected: [],
        },
      },
    ],
    hiddenTests: [
      {
        id: 'multiple-duplicates',
        name: 'Reports every duplicate occurrence',
        input: [[{ idempotency_key: 'A' }, { idempotency_key: 'B' }, { idempotency_key: 'A' }, { idempotency_key: 'A' }]],
        expected: {
          accepted: [{ idempotency_key: 'A' }, { idempotency_key: 'B' }],
          duplicates: ['A', 'A'],
          rejected: [],
        },
      },
      {
        id: 'empty-key-rejected',
        name: 'Empty key is rejected',
        input: [[{ idempotency_key: '' }, { idempotency_key: 'OK' }]],
        expected: {
          accepted: [{ idempotency_key: 'OK' }],
          duplicates: [],
          rejected: [{ idempotency_key: '' }],
        },
      },
    ],
    mistakePatterns: [
      {
        id: 'no-seen-set',
        label: 'No seen-key set detected',
        description: 'Idempotency requires remembering keys already processed.',
        severity: 'warning',
        detect: 'static-not-contains',
        pattern: 'set\\(',
        feedback: 'Use a set of seen idempotency keys to keep duplicate checks O(1).',
      },
      {
        id: 'missing-rejected',
        label: 'Missing rejected bucket',
        description: 'Events without idempotency_key should not be accepted.',
        severity: 'error',
        detect: 'static-not-contains',
        pattern: 'rejected',
        feedback: 'Keep a rejected list for events missing an idempotency key.',
      },
      {
        id: 'mutates-input',
        label: 'Possible input mutation',
        description: 'Interviewers usually expect transformation without mutating input rows.',
        severity: 'warning',
        detect: 'regex',
        pattern: '\\.pop\\(|\\.clear\\(|del\\s+',
        feedback: 'Avoid mutating the input events while deduplicating.',
      },
    ],
  },
  {
    id: 'dependency-recalculation-order',
    title: 'Dependency graph recalculation order',
    difficulty: 'Hard',
    tags: ['python', 'graphs', 'topological-sort'],
    prompt:
      'Given formula dependencies as a dict of node -> dependencies, return a valid recalculation order. Raise ValueError if there is a cycle.',
    inputExample: `{"gross_margin": ["revenue", "cogs"], "revenue": [], "cogs": []}`,
    expectedOutput: `["revenue", "cogs", "gross_margin"]`,
    hints: ['This is topological sort.', 'Track temporary and permanent marks.', 'Dependencies must appear before dependents.'],
    referenceSolution: `def recalculation_order(graph):
    order = []
    visiting = set()
    visited = set()

    def visit(node):
        if node in visited:
            return
        if node in visiting:
            raise ValueError("Cycle detected")
        visiting.add(node)
        for dependency in graph.get(node, []):
            visit(dependency)
        visiting.remove(node)
        visited.add(node)
        order.append(node)

    for node in graph:
        visit(node)
    return order`,
    pytestTests: `import pytest

def test_recalculation_order():
    graph = {"gross_margin": ["revenue", "cogs"], "revenue": [], "cogs": []}
    assert recalculation_order(graph) == ["revenue", "cogs", "gross_margin"]

def test_recalculation_order_cycle():
    with pytest.raises(ValueError):
        recalculation_order({"a": ["b"], "b": ["a"]})`,
    complexity: 'O(V + E) time and O(V) space.',
    commonMistakes: ['Appending a node before its dependencies.', 'Missing cycle detection.', 'Assuming all dependency nodes are explicit keys.'],
    interviewerTips: ['Name topological sort.', 'Explain cycle risk in financial formulas.', 'Mention incremental recalculation as production follow-up.'],
    companyRelevance: ['abacum', 'finance', 'system-design'],
  },
]
