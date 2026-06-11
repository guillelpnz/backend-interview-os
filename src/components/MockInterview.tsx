import { RefreshCw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { behavioralFrameworks } from '../content/core/behavioral'
import { cvDefenseCards } from '../content/core/cvDefense'
import { djangoTopics, sqlTopics } from '../content/core/deepDives'
import { liveCodingExercises } from '../content/core/exercises'
import { systemDesignScenarios } from '../content/core/systemDesign'
import type { CompanyProfile } from '../types/company'
import { pickMany } from '../utils/random'
import { SectionCard } from './SectionCard'

type MockInterviewProps = {
  company: CompanyProfile
}

type MockSet = {
  intro: string
  exercise: string
  theory: string[]
  design: string
  cv: string
  closing: string
}

function pickWithSalt<T>(items: T[], version: number, salt: number): T {
  return items[(Math.floor(Math.random() * items.length) + version + salt) % items.length]
}

function createMock(company: CompanyProfile, version: number): MockSet {
  const companyExercises = liveCodingExercises.filter((exercise) => exercise.companyRelevance.includes(company.id) || exercise.companyRelevance.includes('finance') || exercise.companyRelevance.includes('saas'))
  const financeScenarios = systemDesignScenarios.filter((scenario) => scenario.tags.includes(company.id) || scenario.tags.includes('finance') || scenario.tags.includes('reporting'))
  const theoryPool = [
    ...djangoTopics.map((topic) => `Django: ${topic.title} - ${topic.interviewAnswer}`),
    ...sqlTopics.map((topic) => `SQL: ${topic.title} - ${topic.interviewAnswer}`),
  ]

  return {
    intro: pickWithSalt(behavioralFrameworks, version, 1).question,
    exercise: pickWithSalt(companyExercises.length ? companyExercises : liveCodingExercises, version, 2).title,
    theory: pickMany(theoryPool, 3),
    design: pickWithSalt(financeScenarios.length ? financeScenarios : systemDesignScenarios, version, 3).title,
    cv: pickWithSalt(cvDefenseCards, version, 4).practicePrompt,
    closing: pickWithSalt(company.smartQuestionsToAsk, version, 5),
  }
}

export function MockInterview({ company }: MockInterviewProps) {
  const [version, setVersion] = useState(0)
  const mock = useMemo(() => createMock(company, version), [company, version])

  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Mock interview mode</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">{company.name} Backend Engineer rehearsal</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              One intro question, one live coding prompt, three Django/SQL theory checks, one system design prompt, one CV defense challenge and one closing question.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setVersion((value) => value + 1)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            New set
          </button>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="1. Intro / behavioral" icon={<Sparkles className="h-5 w-5" aria-hidden="true" />}>
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{mock.intro}</p>
        </SectionCard>
        <SectionCard title="2. Python live coding">
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{mock.exercise}</p>
        </SectionCard>
        <SectionCard title="3. Django / SQL theory">
          <ul className="space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {mock.theory.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="4. System design">
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{mock.design}</p>
        </SectionCard>
        <SectionCard title="5. CV / project defense">
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{mock.cv}</p>
        </SectionCard>
        <SectionCard title="6. Closing question">
          <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{mock.closing}</p>
        </SectionCard>
      </div>
    </div>
  )
}
