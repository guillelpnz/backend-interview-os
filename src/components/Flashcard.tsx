import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import type { Flashcard as FlashcardType } from '../types/content'
import type { CompletionMap } from '../utils/progress'

type FlashcardProps = {
  card: FlashcardType
  completions: CompletionMap
  onToggle: (id: string) => void
}

export function Flashcard({ card, completions, onToggle }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false)
  const progressId = `flashcard:${card.id}`
  const done = Boolean(completions[progressId])

  return (
    <article className="flex min-h-[220px] flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">{card.group}</p>
          <h3 className="mt-1 text-sm font-semibold leading-6 text-slate-950 dark:text-slate-50">{card.question}</h3>
        </div>
        <button
          type="button"
          onClick={() => setRevealed(false)}
          className="rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          title="Reset card"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <div className="flex-1 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-950/50 dark:text-slate-200">
        {revealed ? card.answer : 'Answer hidden'}
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
        >
          {revealed ? 'Hide' : 'Reveal'}
        </button>
        <button
          type="button"
          onClick={() => onToggle(progressId)}
          className={`rounded-md border px-3 py-2 text-sm font-medium ${
            done
              ? 'border-teal-500 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          {done ? 'Done' : 'Mark done'}
        </button>
      </div>
    </article>
  )
}
