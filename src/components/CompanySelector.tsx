import type { CompanyProfile } from '../types/company'

type CompanySelectorProps = {
  companies: CompanyProfile[]
  selectedCompanyId: string
  onSelect: (companyId: string) => void
}

export function CompanySelector({ companies, selectedCompanyId, onSelect }: CompanySelectorProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Company</span>
      <select
        value={selectedCompanyId}
        onChange={(event) => onSelect(event.target.value)}
        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none ring-teal-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </label>
  )
}
