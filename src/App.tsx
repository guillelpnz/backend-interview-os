import {
  BookOpen,
  Brain,
  Building2,
  CheckSquare,
  Code2,
  Database,
  FileQuestion,
  FileText,
  Gauge,
  Layers3,
  MessageSquareText,
  PanelLeft,
  ScrollText,
  ShieldQuestion,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Checklist } from './components/Checklist'
import { CodingDojo } from './components/CodingDojo'
import { CompanyPage } from './components/CompanyPage'
import { ExerciseCard } from './components/ExerciseCard'
import { Flashcard } from './components/Flashcard'
import { Layout } from './components/Layout'
import { MockInterview } from './components/MockInterview'
import { ProgressBadge } from './components/ProgressBadge'
import { RevealBlock } from './components/RevealBlock'
import { SearchBox } from './components/SearchBox'
import { SectionCard } from './components/SectionCard'
import type { NavItem } from './components/Sidebar'
import { cheatSheets } from './content/core/cheatSheets'
import { cvDefenseCards } from './content/core/cvDefense'
import { deepDiveTopics, djangoTopics, fastApiTopics, sqlTopics } from './content/core/deepDives'
import { liveCodingExercises } from './content/core/exercises'
import { behavioralFrameworks } from './content/core/behavioral'
import { flashcardGroups, flashcards } from './content/core/flashcards'
import { globalStudyPlan } from './content/core/studyPlan'
import { systemDesignScenarios } from './content/core/systemDesign'
import { companies } from './content/companies'
import type { CodingDojoExerciseProgress, CodingDojoProgressMap, DeepDiveTopic } from './types/content'
import { useLocalStorage } from './utils/storage'
import { collectTrackableIds, countCompleted, toggleCompletion, type CompletionMap } from './utils/progress'

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Gauge },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'study-plan', label: 'Study Plan', icon: CheckSquare },
  { id: 'live-coding', label: 'Python Coding', icon: Code2 },
  { id: 'coding-dojo', label: 'Coding Dojo', icon: Code2 },
  { id: 'django', label: 'Django', icon: Layers3 },
  { id: 'fastapi', label: 'FastAPI', icon: Sparkles },
  { id: 'sql', label: 'SQL/Postgres', icon: Database },
  { id: 'system-design', label: 'System Design', icon: PanelLeft },
  { id: 'behavioral', label: 'Behavioral', icon: MessageSquareText },
  { id: 'cv-defense', label: 'CV Defense', icon: ShieldQuestion },
  { id: 'flashcards', label: 'Flashcards', icon: Brain },
  { id: 'cheat-sheets', label: 'Cheat Sheets', icon: ScrollText },
  { id: 'mock', label: 'Mock Interview', icon: FileQuestion },
  { id: 'add-company', label: 'Add Company', icon: FileText },
]

function includesQuery(values: unknown[], query: string) {
  const haystack = values.flatMap((value) => (Array.isArray(value) ? value : [value])).join(' ').toLowerCase()
  return haystack.includes(query.toLowerCase())
}

function BadgeList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span key={item} className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {item}
        </span>
      ))}
    </div>
  )
}

function TextList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function DeepDiveGrid({ topics }: { topics: DeepDiveTopic[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {topics.map((topic) => (
        <SectionCard key={topic.id} title={topic.title} description={topic.explanation}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Interview answer</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{topic.interviewAnswer}</p>
            </div>
            <RevealBlock label="Mini example">{topic.miniExample}</RevealBlock>
            <div>
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Red flags</p>
              <TextList items={topic.redFlags} />
            </div>
            <p className="rounded-md bg-teal-50 p-3 text-sm leading-6 text-teal-900 dark:bg-teal-950/40 dark:text-teal-100">{topic.relevance}</p>
          </div>
        </SectionCard>
      ))}
    </div>
  )
}

function rankDojoResult(result?: CodingDojoExerciseProgress['bestResult']) {
  if (result === 'all-passed') return 4
  if (result === 'visible-passed') return 3
  if (result === 'failed') return 2
  if (result === 'error') return 1
  return 0
}

function betterDojoResult(
  current?: CodingDojoExerciseProgress['bestResult'],
  next?: CodingDojoExerciseProgress['bestResult'],
) {
  return rankDojoResult(next) > rankDojoResult(current) ? next : current
}

function App() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [selectedCompanyId, setSelectedCompanyId] = useLocalStorage('prep-hub:selected-company', companies[0].id)
  const [darkMode, setDarkMode] = useLocalStorage('prep-hub:dark-mode', false)
  const [completions, setCompletions] = useLocalStorage<CompletionMap>('prep-hub:completions', {})
  const [dojoProgress, setDojoProgress] = useLocalStorage<CodingDojoProgressMap>('prep-hub:coding-dojo-progress', {})
  const [search, setSearch] = useState('')
  const [flashcardGroup, setFlashcardGroup] = useState('All')

  const selectedCompany = companies.find((company) => company.id === selectedCompanyId) ?? companies[0]
  const interactiveExercises = useMemo(
    () => liveCodingExercises.filter((exercise) => exercise.evaluationMode === 'function' && exercise.functionName && exercise.starterCode),
    [],
  )
  const trackableIds = useMemo(() => collectTrackableIds(companies, liveCodingExercises, flashcards, globalStudyPlan), [])
  const completedCount = countCompleted(trackableIds, completions)
  const dojoAttempted = interactiveExercises.filter((exercise) => dojoProgress[exercise.id]?.attempted).length
  const dojoAllPassed = interactiveExercises.filter((exercise) => dojoProgress[exercise.id]?.allTestsPassed).length
  const dojoWeakTags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const exercise of interactiveExercises) {
      const progress = dojoProgress[exercise.id]
      if (!progress?.attempted || progress.allTestsPassed) continue
      for (const tag of progress.failedTags.length ? progress.failedTags : exercise.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([tag]) => tag)
  }, [dojoProgress, interactiveExercises])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const onToggleCompletion = (id: string) => {
    setCompletions((current) => toggleCompletion(current, id))
  }

  const updateDojoProgress = (exerciseId: string, nextProgress: CodingDojoExerciseProgress) => {
    setDojoProgress((current) => {
      const previous = current[exerciseId]
      const bestResult = betterDojoResult(previous?.bestResult, nextProgress.bestResult)
      return {
        ...current,
        [exerciseId]: {
          attempted: true,
          visibleTestsPassed: Boolean(previous?.visibleTestsPassed || nextProgress.visibleTestsPassed),
          allTestsPassed: Boolean(previous?.allTestsPassed || nextProgress.allTestsPassed),
          lastRunDate: nextProgress.lastRunDate,
          bestResult,
          runCount: (previous?.runCount ?? 0) + 1,
          failedTags: nextProgress.failedTags.length ? nextProgress.failedTags : (previous?.failedTags ?? []),
        },
      }
    })
  }

  const filteredExercises = liveCodingExercises.filter((exercise) => includesQuery([exercise.title, exercise.prompt, exercise.tags, exercise.companyRelevance], search))
  const filteredSystemDesign = systemDesignScenarios.filter((scenario) => includesQuery([scenario.title, scenario.tags, scenario.requirements, scenario.finalSummaryAnswer], search))
  const filteredBehavioral = behavioralFrameworks.filter((item) => includesQuery([item.question, item.themes, item.action, item.result], search))
  const filteredCvCards = cvDefenseCards.filter((card) => includesQuery([card.title, card.likelyChallenge, card.technicalDetails, card.practicePrompt], search))
  const filteredCheatSheets = cheatSheets.filter((sheet) => includesQuery([sheet.title, sheet.tags, sheet.sections.map((section) => section.points)], search))
  const filteredFlashcards = flashcards.filter((card) => {
    const groupMatch = flashcardGroup === 'All' || card.group === flashcardGroup
    return groupMatch && includesQuery([card.group, card.question, card.answer, card.tags], search)
  })

  const dailyChecklist = [
    ...selectedCompany.studyFirst.map((item, index) => ({
      id: `daily:${selectedCompany.id}:study-first:${index}`,
      label: item,
    })),
    {
      id: `daily:${selectedCompany.id}:mock`,
      label: 'Run one short mock interview set and note the weakest answer.',
    },
  ]

  const renderDashboard = () => (
    <div className="space-y-5">
      <SectionCard>
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">Active process</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-950 dark:text-white">{selectedCompany.name} - {selectedCompany.roleTitle}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{selectedCompany.companySummary}</p>
            <div className="mt-4">
              <BadgeList items={[selectedCompany.workMode, selectedCompany.salaryRange ?? 'Salary TBD', selectedCompany.equity ?? 'Equity TBD', ...selectedCompany.domain.slice(0, 3)]} />
            </div>
          </div>
          <ProgressBadge completed={completedCount} total={trackableIds.length} label="Total prep" />
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-4">
        <SectionCard title="Companies" description="Each company is rendered from a TypeScript profile.">
          <div className="space-y-3">
            {companies.map((company) => (
              <button
                key={company.id}
                type="button"
                onClick={() => {
                  setSelectedCompanyId(company.id)
                  setActiveSection('company')
                }}
                className="w-full rounded-lg border border-slate-200 p-4 text-left hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:hover:border-teal-600 dark:hover:bg-teal-950/30"
              >
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{company.name}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{company.roleTitle} - {company.workMode}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Weak areas" description="Use this as the first pass before polishing.">
          <TextList items={selectedCompany.riskAreasForCandidate} />
        </SectionCard>

        <SectionCard title="Daily checklist" description="Small list for today, saved locally.">
          <Checklist items={dailyChecklist} completions={completions} onToggle={onToggleCompletion} />
        </SectionCard>

        <SectionCard title="Coding Dojo progress" description="Interactive Python attempts saved locally.">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950/50">
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">{dojoAttempted}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Attempted</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-950/50">
              <p className="text-2xl font-semibold text-slate-950 dark:text-white">{dojoAllPassed}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">All passed</p>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Weak tags</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(dojoWeakTags.length ? dojoWeakTags : ['No failed attempts yet']).map((tag) => (
                <span key={tag} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Upcoming process stages">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {selectedCompany.processStages.map((stage) => (
            <div key={stage.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{stage.title}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stage.format} {stage.duration ? `- ${stage.duration}` : ''}</p>
              <ul className="mt-3 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {stage.preparation.slice(0, 2).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  const renderStudyPlan = () => (
    <div className="space-y-5">
      <SectionCard title="Global study plan" description="Day-by-day mode prioritized for the active company.">
        <div className="grid gap-4">
          {globalStudyPlan.map((item) => {
            const progressId = `study:${item.id}`
            return (
              <div key={item.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">Day {item.day} - {item.module}</p>
                    <h3 className="mt-1 text-base font-semibold text-slate-950 dark:text-slate-50">{item.title}</h3>
                    {item.companyBias && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.companyBias}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleCompletion(progressId)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium ${
                      completions[progressId]
                        ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {completions[progressId] ? 'Done' : 'Mark done'}
                  </button>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-[1fr_0.7fr]">
                  <TextList items={item.tasks} />
                  <p className="rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-600 dark:bg-slate-950/50 dark:text-slate-300">{item.output}</p>
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard title={`${selectedCompany.name} study plan`} description="Company-specific sequence from the selected profile.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {selectedCompany.studyPlan.map((day) => (
            <div key={day.day} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">Day {day.day}</p>
              <h3 className="mt-1 text-sm font-semibold text-slate-950 dark:text-slate-50">{day.title}</h3>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{day.focus}</p>
              <ul className="mt-3 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {day.tasks.map((task) => (
                  <li key={task}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )

  const renderLiveCoding = () => (
    <div className="space-y-4">
      <SearchBox value={search} onChange={setSearch} placeholder="Search exercises by topic, tag, or company relevance" />
      {filteredExercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} completions={completions} onToggle={onToggleCompletion} />
      ))}
    </div>
  )

  const renderSystemDesign = () => (
    <div className="space-y-4">
      <SearchBox value={search} onChange={setSearch} placeholder="Search system design scenarios" />
      <div className="grid gap-4">
        {filteredSystemDesign.map((scenario) => (
          <SectionCard key={scenario.id} title={scenario.title}>
            <div className="mb-4">
              <BadgeList items={scenario.tags} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Requirements</p>
                <TextList items={scenario.requirements} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Clarifying questions</p>
                <TextList items={scenario.clarifyingQuestions} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Core architecture</p>
                <TextList items={scenario.architecture} />
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <RevealBlock label="Data model">{scenario.entities.join('\n')}</RevealBlock>
              <RevealBlock label="API design">{scenario.apiDesign.join('\n')}</RevealBlock>
              <RevealBlock label="Failure modes">{scenario.failureModes.join('\n')}</RevealBlock>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-md bg-rose-50 p-3 text-sm leading-6 text-rose-900 dark:bg-rose-950/30 dark:text-rose-100">
                <strong>Weak answer:</strong> {scenario.weakAnswer}
              </div>
              <div className="rounded-md bg-teal-50 p-3 text-sm leading-6 text-teal-900 dark:bg-teal-950/30 dark:text-teal-100">
                <strong>Strong answer:</strong> {scenario.strongAnswer}
              </div>
            </div>
            <p className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">{scenario.finalSummaryAnswer}</p>
          </SectionCard>
        ))}
      </div>
    </div>
  )

  const renderBehavioral = () => (
    <div className="space-y-4">
      <SearchBox value={search} onChange={setSearch} placeholder="Search behavioral prompts" />
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredBehavioral.map((item) => (
          <SectionCard key={item.id} title={item.question}>
            <div className="space-y-3">
              <BadgeList items={item.themes} />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300"><strong>Situation:</strong> {item.situation}</p>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300"><strong>Task:</strong> {item.task}</p>
              <div>
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Action</p>
                <TextList items={item.action} />
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300"><strong>Result:</strong> {item.result}</p>
              <p className="rounded-md bg-teal-50 p-3 text-sm leading-6 text-teal-900 dark:bg-teal-950/30 dark:text-teal-100">{item.adaptByCompany}</p>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  )

  const renderCvDefense = () => (
    <div className="space-y-4">
      <SearchBox value={search} onChange={setSearch} placeholder="Search CV/project defense cards" />
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCvCards.map((card) => (
          <SectionCard key={card.id} title={card.title} description={card.likelyChallenge}>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{card.strongAnswer}</p>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Technical details</p>
                  <TextList items={card.technicalDetails} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Metrics to clarify</p>
                  <TextList items={card.metricsToClarify} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Risks if overstated</p>
                  <TextList items={card.risksIfOverstated} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Follow-up questions</p>
                  <TextList items={card.followUpQuestions} />
                </div>
              </div>
              <p className="rounded-md bg-slate-50 p-3 text-sm font-medium text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">{card.practicePrompt}</p>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  )

  const renderFlashcards = () => (
    <div className="space-y-4">
      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <SearchBox value={search} onChange={setSearch} placeholder="Search flashcards" />
        <select
          value={flashcardGroup}
          onChange={(event) => setFlashcardGroup(event.target.value)}
          className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none ring-teal-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
        >
          {['All', ...flashcardGroups].map((group) => (
            <option key={group}>{group}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredFlashcards.map((card) => (
          <Flashcard key={card.id} card={card} completions={completions} onToggle={onToggleCompletion} />
        ))}
      </div>
    </div>
  )

  const renderCheatSheets = () => (
    <div className="space-y-4">
      <SearchBox value={search} onChange={setSearch} placeholder="Search cheat sheets" />
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCheatSheets.map((sheet) => (
          <SectionCard key={sheet.id} title={sheet.title}>
            <div className="mb-4">
              <BadgeList items={sheet.tags} />
            </div>
            <div className="space-y-4">
              {sheet.sections.map((section) => (
                <div key={section.title}>
                  <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{section.title}</p>
                  <TextList items={section.points} />
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  )

  const renderAddCompany = () => (
    <div className="space-y-5">
      <SectionCard title="Add a new company" description="Create one TypeScript config file and export it through the company index.">
        <div className="space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <p>Create a file under <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">src/content/companies/newCompany.ts</code> that exports a <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">CompanyProfile</code>.</p>
          <p>Copy <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">exampleCompany.ts</code>, replace every field with the new process details, then import it in <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">src/content/companies/index.ts</code>.</p>
        </div>
      </SectionCard>
      <SectionCard title="Minimal pattern">
        <RevealBlock label="Company config example" defaultOpen>
          {`import type { CompanyProfile } from '../../types/company'

export const newCompany: CompanyProfile = {
  id: 'new-company',
  name: 'New Company',
  website: 'https://example.com',
  roleTitle: 'Backend Engineer',
  location: 'Remote',
  workMode: 'Remote',
  salaryRange: 'Add if known',
  equity: 'Add if known',
  recruiterNotes: [],
  companySummary: 'What the company does and why it matters.',
  productSummary: ['Main product workflow'],
  domain: ['SaaS'],
  businessModel: 'Who pays and why.',
  funding: 'Stage or funding.',
  teamSize: 'Team size.',
  offices: [],
  processStages: [],
  requiredStack: ['Python'],
  preferredStack: ['PostgreSQL'],
  roleResponsibilities: [],
  likelyTechnicalChallenges: [],
  interviewFocusAreas: [],
  riskAreasForCandidate: [],
  candidateStrengthsForThisRole: [],
  preparationPriorities: [],
  likelyQuestions: [],
  smartQuestionsToAsk: [],
  systemDesignScenarios: [],
  liveCodingThemes: [],
  behavioralThemes: [],
  studyPlan: [],
  fitAnalysis: [],
  whyAttractive: [],
  studyFirst: [],
  interviewStrategy: [],
  djangoPrepChecklist: [],
  sqlPerformanceChecklist: [],
  notes: [],
}`}
        </RevealBlock>
      </SectionCard>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard()
      case 'company':
        return <CompanyPage company={selectedCompany} completions={completions} onToggle={onToggleCompletion} onStartMock={() => setActiveSection('mock')} />
      case 'study-plan':
        return renderStudyPlan()
      case 'live-coding':
        return renderLiveCoding()
      case 'coding-dojo':
        return (
          <CodingDojo
            exercises={liveCodingExercises}
            companies={companies}
            selectedCompanyId={selectedCompany.id}
            darkMode={darkMode}
            progress={dojoProgress}
            onProgressUpdate={updateDojoProgress}
          />
        )
      case 'django':
        return <DeepDiveGrid topics={djangoTopics} />
      case 'fastapi':
        return <DeepDiveGrid topics={fastApiTopics} />
      case 'sql':
        return <DeepDiveGrid topics={sqlTopics} />
      case 'system-design':
        return renderSystemDesign()
      case 'behavioral':
        return renderBehavioral()
      case 'cv-defense':
        return renderCvDefense()
      case 'flashcards':
        return renderFlashcards()
      case 'cheat-sheets':
        return renderCheatSheets()
      case 'mock':
        return <MockInterview company={selectedCompany} />
      case 'add-company':
        return renderAddCompany()
      default:
        return renderDashboard()
    }
  }

  return (
    <Layout
      navItems={navItems}
      activeSection={activeSection}
      onNavigate={(sectionId) => {
        setSearch('')
        setActiveSection(sectionId)
      }}
      companies={companies}
      selectedCompanyId={selectedCompany.id}
      onSelectCompany={setSelectedCompanyId}
      darkMode={darkMode}
      onToggleDarkMode={() => setDarkMode((value) => !value)}
    >
      {activeSection !== 'coding-dojo' && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>{liveCodingExercises.length} exercises</span>
          <span>-</span>
          <span>{deepDiveTopics.length} deep-dive notes</span>
          <span>-</span>
          <span>{flashcards.length} flashcards</span>
        </div>
      )}
      {renderActiveSection()}
    </Layout>
  )
}

export default App
