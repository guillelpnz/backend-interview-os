import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import type { CompanyProfile } from '../types/company'
import { CompanySelector } from './CompanySelector'
import { Sidebar, type NavItem } from './Sidebar'

type LayoutProps = {
  children: ReactNode
  navItems: NavItem[]
  activeSection: string
  onNavigate: (sectionId: string) => void
  companies: CompanyProfile[]
  selectedCompanyId: string
  onSelectCompany: (companyId: string) => void
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function Layout({
  children,
  navItems,
  activeSection,
  onNavigate,
  companies,
  selectedCompanyId,
  onSelectCompany,
  darkMode,
  onToggleDarkMode,
}: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeItem = navItems.find((item) => item.id === activeSection)
  const wideContent = activeSection === 'coding-dojo'

  const navigate = (sectionId: string) => {
    onNavigate(sectionId)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="lg:flex">
        <Sidebar
          navItems={navItems}
          activeSection={activeSection}
          onNavigate={navigate}
          companies={companies}
          selectedCompanyId={selectedCompanyId}
          onSelectCompany={onSelectCompany}
        />
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                title="Toggle navigation"
              >
                {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">Prep Hub</p>
                <p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">{activeItem?.label ?? 'Dashboard'}</p>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                title="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
            {mobileOpen && (
              <div className="mt-3 space-y-3">
                <CompanySelector companies={companies} selectedCompanyId={selectedCompanyId} onSelect={onSelectCompany} />
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const active = activeSection === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => navigate(item.id)}
                        className={`flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium ${
                          active
                            ? 'bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-100'
                            : 'bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="min-w-0 truncate">{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </header>

          <main className={`mx-auto px-4 py-6 sm:px-6 lg:px-8 ${wideContent ? 'max-w-[1800px]' : 'max-w-7xl'}`}>
            <div className="mb-5 hidden items-center justify-between gap-4 lg:flex">
              <div>
                <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Backend Interview Prep Hub</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">{activeItem?.label ?? 'Dashboard'}</h2>
              </div>
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                {darkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
                {darkMode ? 'Light' : 'Dark'}
              </button>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
