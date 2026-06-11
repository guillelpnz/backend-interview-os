export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export type PythonTestCase = {
  id: string
  name: string
  input: unknown[]
  expected: unknown
  explanation?: string
}

export type CodingExample = {
  label: string
  input: string
  expected: string
}

export type MistakePattern = {
  id: string
  label: string
  description: string
  severity: 'info' | 'warning' | 'error'
  detect: 'static-contains' | 'static-not-contains' | 'regex'
  pattern: string
  feedback: string
}

export type LiveCodingExercise = {
  id: string
  title: string
  difficulty: Difficulty
  tags: string[]
  prompt: string
  inputExample: string
  expectedOutput: string
  brief?: string
  requirements?: string[]
  inputContract?: string[]
  outputContract?: string[]
  edgeCases?: string[]
  examples?: CodingExample[]
  hints: string[]
  referenceSolution: string
  pytestTests: string
  complexity: string
  commonMistakes: string[]
  interviewerTips: string[]
  companyRelevance: string[]
  starterCode?: string
  visibleTests?: PythonTestCase[]
  hiddenTests?: PythonTestCase[]
  solution?: string
  evaluationMode?: 'function'
  functionName?: string
  mistakePatterns?: MistakePattern[]
}

export type DeepDiveTopic = {
  id: string
  title: string
  group: 'Django' | 'FastAPI' | 'SQL'
  explanation: string
  interviewAnswer: string
  miniExample: string
  redFlags: string[]
  relevance: string
  tags: string[]
}

export type SystemDesignScenario = {
  id: string
  title: string
  tags: string[]
  requirements: string[]
  clarifyingQuestions: string[]
  entities: string[]
  apiDesign: string[]
  architecture: string[]
  consistencyConcerns: string[]
  scalingConcerns: string[]
  failureModes: string[]
  observability: string[]
  tradeOffs: string[]
  weakAnswer: string
  strongAnswer: string
  finalSummaryAnswer: string
}

export type BehavioralFramework = {
  id: string
  question: string
  themes: string[]
  situation: string
  task: string
  action: string[]
  result: string
  adaptByCompany: string
}

export type CvDefenseCard = {
  id: string
  title: string
  likelyChallenge: string
  strongAnswer: string
  technicalDetails: string[]
  metricsToClarify: string[]
  risksIfOverstated: string[]
  followUpQuestions: string[]
  practicePrompt: string
}

export type Flashcard = {
  id: string
  group: string
  question: string
  answer: string
  tags: string[]
}

export type CheatSheet = {
  id: string
  title: string
  tags: string[]
  sections: {
    title: string
    points: string[]
  }[]
}

export type StudyPlanItem = {
  id: string
  day: number
  title: string
  module: string
  companyBias?: string
  tasks: string[]
  output: string
}

export type CodingDojoExerciseProgress = {
  attempted: boolean
  visibleTestsPassed: boolean
  allTestsPassed: boolean
  lastRunDate?: string
  bestResult?: 'failed' | 'visible-passed' | 'all-passed' | 'error'
  runCount: number
  failedTags: string[]
}

export type CodingDojoProgressMap = Record<string, CodingDojoExerciseProgress>
