const LETTERS = 52
const CAPITALS = 26
const DIGITS = 10

export const ID_SPACE = {
  accounts: LETTERS ** 2 * DIGITS ** 4,
  products: LETTERS ** 4 * DIGITS ** 2,
  lists: DIGITS ** 2 * CAPITALS ** 4,
  items: LETTERS ** 2 * DIGITS ** 2 * ((LETTERS + DIGITS) ** 2 - DIGITS ** 2),
} as const

export type IdSpaceKind = keyof typeof ID_SPACE

export function idUsage(kind: IdSpaceKind, used: number): { used: number; space: number; left: number; percent: number } {
  const space = ID_SPACE[kind]
  return { used, space, left: Math.max(0, space - used), percent: (used / space) * 100 }
}
