export type WorkMode = 'Remote' | 'Hybrid' | 'On-site' | 'Remote within Spain'

export type ProcessStage = {
  id: string
  title: string
  format: string
  duration?: string
  focus: string[]
  preparation: string[]
}

export type CompanyStudyPlanDay = {
  day: number
  title: string
  focus: string
  tasks: string[]
}

export type CompanyProfile = {
  id: string
  name: string
  website: string
  roleTitle: string
  location: string
  workMode: WorkMode | string
  salaryRange?: string
  equity?: string
  recruiterNotes: string[]
  companySummary: string
  productSummary: string[]
  domain: string[]
  businessModel: string
  funding: string
  teamSize: string
  offices: string[]
  processStages: ProcessStage[]
  requiredStack: string[]
  preferredStack: string[]
  roleResponsibilities: string[]
  likelyTechnicalChallenges: string[]
  interviewFocusAreas: string[]
  riskAreasForCandidate: string[]
  candidateStrengthsForThisRole: string[]
  preparationPriorities: string[]
  likelyQuestions: string[]
  smartQuestionsToAsk: string[]
  systemDesignScenarios: string[]
  liveCodingThemes: string[]
  behavioralThemes: string[]
  studyPlan: CompanyStudyPlanDay[]
  fitAnalysis: string[]
  whyAttractive: string[]
  studyFirst: string[]
  interviewStrategy: string[]
  djangoPrepChecklist: string[]
  sqlPerformanceChecklist: string[]
  notes: string[]
}
