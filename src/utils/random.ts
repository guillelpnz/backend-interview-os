export function pickOne<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}

export function pickMany<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, count)
}
