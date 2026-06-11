import type { ReactNode } from 'react'

type SectionCardProps = {
  title?: string
  description?: string
  icon?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, description, icon, children, className = '' }: SectionCardProps) {
  return (
    <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {(title || description || icon) && (
        <div className="mb-4 flex items-start gap-3">
          {icon && <div className="mt-0.5 text-teal-600 dark:text-teal-300">{icon}</div>}
          <div>
            {title && <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">{title}</h2>}
            {description && <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  )
}
