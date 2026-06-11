import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

type RevealBlockProps = {
  label: string
  children: string
  defaultOpen?: boolean
}

export function RevealBlock({ label, children, defaultOpen = false }: RevealBlockProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950/40">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        <span>{label}</span>
        {open ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
      {open && (
        <pre className="max-h-[420px] overflow-auto border-t border-slate-200 p-3 text-xs leading-5 text-slate-800 dark:border-slate-700 dark:text-slate-100">
          <code>{children}</code>
        </pre>
      )}
    </div>
  )
}
