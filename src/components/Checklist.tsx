import { CheckCircle2, Circle } from 'lucide-react'
import type { CompletionMap } from '../utils/progress'

type ChecklistItem = {
  id: string
  label: string
  detail?: string
}

type ChecklistProps = {
  items: ChecklistItem[]
  completions: CompletionMap
  onToggle: (id: string) => void
}

export function Checklist({ items, completions, onToggle }: ChecklistProps) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const checked = Boolean(completions[item.id])
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onToggle(item.id)}
            className="flex w-full items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-left transition hover:border-teal-300 hover:bg-teal-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-teal-600 dark:hover:bg-teal-950/30"
          >
            {checked ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-300" aria-hidden="true" />
            ) : (
              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
            )}
            <span>
              <span className={`block text-sm font-medium ${checked ? 'text-slate-500 line-through dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                {item.label}
              </span>
              {item.detail && <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{item.detail}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
