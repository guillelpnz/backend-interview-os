import { AlertTriangle, Info, XCircle } from 'lucide-react'
import type { MistakeFeedback } from '../utils/mistakeAnalyzer'

type MistakeFeedbackPanelProps = {
  feedback: MistakeFeedback[]
}

const severityClass = {
  info: 'bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-100',
  warning: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-100',
  error: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-100',
}

const severityIcon = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
}

export function MistakeFeedbackPanel({ feedback }: MistakeFeedbackPanelProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">Local heuristic feedback</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Static checks only. This is not AI feedback and may miss valid approaches.</p>
      </div>

      {feedback.length === 0 ? (
        <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">No heuristic warnings right now.</p>
      ) : (
        <div className="space-y-2">
          {feedback.map((item) => {
            const Icon = severityIcon[item.severity]
            return (
              <div key={item.id} className={`rounded-md p-3 ${severityClass[item.severity]}`}>
                <p className="inline-flex items-center gap-2 text-sm font-semibold">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </p>
                <p className="mt-1 text-xs leading-5 opacity-90">{item.description}</p>
                <p className="mt-2 text-sm leading-6">{item.feedback}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
