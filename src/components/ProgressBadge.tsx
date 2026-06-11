type ProgressBadgeProps = {
  completed: number
  total: number
  label?: string
}

export function ProgressBadge({ completed, total, label = 'Complete' }: ProgressBadgeProps) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="min-w-[132px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-2 rounded-full bg-teal-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {completed}/{total}
      </p>
    </div>
  )
}
