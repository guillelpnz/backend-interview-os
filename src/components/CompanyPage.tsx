import { BriefcaseBusiness, ExternalLink, MapPin, Sparkles, Timeline } from 'lucide-react'
import type { CompanyProfile } from '../types/company'
import type { CompletionMap } from '../utils/progress'
import { Checklist } from './Checklist'
import { SectionCard } from './SectionCard'

type CompanyPageProps = {
  company: CompanyProfile
  completions: CompletionMap
  onToggle: (id: string) => void
  onStartMock: () => void
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

export function CompanyPage({ company, completions, onToggle, onStartMock }: CompanyPageProps) {
  return (
    <div className="space-y-5">
      <SectionCard>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200">{company.roleTitle}</span>
              <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{company.workMode}</span>
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{company.name}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">{company.companySummary}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {company.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                {company.salaryRange}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Website <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onStartMock}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Start mock
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Fit analysis" description="How Guillermo should position himself for this process.">
          <div className="grid gap-5 md:grid-cols-2">
            <ListBlock title="Fit" items={company.fitAnalysis} />
            <ListBlock title="Why attractive" items={company.whyAttractive} />
            <ListBlock title="Strengths" items={company.candidateStrengthsForThisRole} />
            <ListBlock title="Risks and gaps" items={company.riskAreasForCandidate} />
          </div>
        </SectionCard>

        <SectionCard title="Study first" description="Company-specific prep priorities.">
          <Checklist
            items={company.preparationPriorities.map((priority, index) => ({
              id: `${company.id}:priority:${index}`,
              label: priority,
            }))}
            completions={completions}
            onToggle={onToggle}
          />
        </SectionCard>
      </div>

      <SectionCard title="Process timeline" icon={<Timeline className="h-5 w-5" aria-hidden="true" />}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {company.processStages.map((stage) => (
            <div key={stage.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-50">{stage.title}</h3>
                {stage.duration && <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{stage.duration}</span>}
              </div>
              <p className="mt-2 text-xs font-medium uppercase text-teal-700 dark:text-teal-300">{stage.format}</p>
              <ul className="mt-3 space-y-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                {stage.focus.map((focus) => (
                  <li key={focus}>{focus}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Interview strategy">
          <ListBlock title="Strategy" items={company.interviewStrategy} />
        </SectionCard>
        <SectionCard title="Likely questions">
          <ListBlock title="Prepare answers for" items={company.likelyQuestions} />
        </SectionCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SectionCard title="Django checklist">
          <ListBlock title="Refresh" items={company.djangoPrepChecklist} />
        </SectionCard>
        <SectionCard title="SQL/performance checklist">
          <ListBlock title="Practice" items={company.sqlPerformanceChecklist} />
        </SectionCard>
        <SectionCard title="Smart questions">
          <ListBlock title="Ask" items={company.smartQuestionsToAsk} />
        </SectionCard>
      </div>

      <SectionCard title="Role and product details">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ListBlock title="Product" items={company.productSummary} />
          <ListBlock title="Responsibilities" items={company.roleResponsibilities} />
          <ListBlock title="Technical challenges" items={company.likelyTechnicalChallenges} />
          <ListBlock title="Required stack" items={company.requiredStack} />
          <ListBlock title="Preferred stack" items={company.preferredStack} />
          <ListBlock title="Behavioral themes" items={company.behavioralThemes} />
        </div>
      </SectionCard>
    </div>
  )
}
