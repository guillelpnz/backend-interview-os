import type { LucideIcon } from 'lucide-react'
import { CompanySelector } from './CompanySelector'
import type { CompanyProfile } from '../types/company'

export type NavItem = {
  id: string
  label: string
  icon: LucideIcon
}

type SidebarProps = {
  navItems: NavItem[]
  activeSection: string
  onNavigate: (sectionId: string) => void
  companies: CompanyProfile[]
  selectedCompanyId: string
  onSelectCompany: (companyId: string) => void
}

export function Sidebar({ navItems, activeSection, onNavigate, companies, selectedCompanyId, onSelectCompany }: SidebarProps) {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950 lg:sticky lg:top-0 lg:block">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Backend Interview</p>
        <h1 className="mt-1 text-xl font-semibold leading-7 text-slate-950 dark:text-slate-50">Prep Hub</h1>
      </div>
      <CompanySelector companies={companies} selectedCompanyId={selectedCompanyId} onSelect={onSelectCompany} />
      <nav className="mt-5 space-y-1" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = activeSection === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition ${
                active
                  ? 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
