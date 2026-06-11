import { Search } from 'lucide-react'

type SearchBoxProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBox({ value, onChange, placeholder = 'Search content' }: SearchBoxProps) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none ring-teal-500 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50"
      />
    </label>
  )
}
