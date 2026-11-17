export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
export const CAPITALS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
export const DIGITS = '0123456789'

export const NAME_CODE = /^[A-Za-z]{2}\d{4}$/
export const PRODUCT_CODE = /^[A-Za-z]{4}\d{2}$/
export const ACCOUNT_CODE = /^(?:[A-Za-z]{2}\d{4}|[A-Za-z]{4}\d{2})$/
export const LIST_CODE = /^\d{2}[A-Za-z]{4}$/
export const ITEM_CODE = /^[A-Za-z]{2}\d{2}(?:[A-Za-z][A-Za-z0-9]|\d[A-Za-z])$/

import { blockedProductCode } from './words'

export type CodeKind = 'account' | 'product' | 'list' | 'item'

export const isAccountCode = (value: string): boolean => ACCOUNT_CODE.test(value)
export const isProductCode = (value: string): boolean => PRODUCT_CODE.test(value)
export const isListCode = (value: string): boolean => LIST_CODE.test(value)
export const isItemCode = (value: string): boolean => ITEM_CODE.test(value)

export function codeKind(value: string): CodeKind | null {
  if (NAME_CODE.test(value)) return 'account'
  if (PRODUCT_CODE.test(value)) return 'product'
  if (LIST_CODE.test(value)) return 'list'
  if (ITEM_CODE.test(value)) return 'item'
  return null
}

type Random = () => number
const pick = (chars: string, random: Random) => chars[Math.floor(random() * chars.length)]

const PLAIN: Record<string, string> = { ø: 'o', æ: 'a', œ: 'o', ß: 's', ð: 'd', þ: 't', ł: 'l', đ: 'd', ı: 'i' }

function latinLetters(value: string): string {
  return [...value.normalize('NFKD').toLowerCase()]
    .map(letter => PLAIN[letter] ?? letter)
    .join('')
    .replace(/[^a-z]/g, '')
}

export function nameLetters(name: string, email = ''): string | null {
  const words = name.trim().split(/\s+/)
  for (const source of [words[0] ?? '', name, email.split('@')[0] ?? '']) {
    const letters = latinLetters(source)
    if (letters.length >= 2) return letters[0].toUpperCase() + letters[1]
  }
  return null
}

export function accountCodeCandidate(letters: string | null, random: Random = Math.random): string {
  const start = letters ?? pick(LETTERS, random) + pick(LETTERS, random)
  for (;;) {
    const code = start + String(Math.floor(random() * 10000)).padStart(4, '0')
    if (!isReservedAccountCode(code)) return code
  }
}

export const RESERVED_ACCOUNT_CODES = { owner: 'Jo4712', studio: 'Jo0001', onboarding: 'On0001', test: 'Te0001' } as const satisfies Record<string, string>

export type ReservedRole = keyof typeof RESERVED_ACCOUNT_CODES

export const RESERVED_ACCOUNT_EMAILS = {
  'jaa90@icloud.com': 'owner',
  'joachim@0001.dev': 'studio',
  'joachim+onboarding@0001.dev': 'onboarding',
  'joachim+test@0001.dev': 'test',
} as const satisfies Record<string, ReservedRole>

export const FORMER_RESERVED_ACCOUNT_CODES = ['On4713'] as const

let reserved: Set<string> | undefined

export const isReservedAccountCode = (code: string): boolean =>
  (reserved ??= new Set([...Object.values(RESERVED_ACCOUNT_CODES), ...FORMER_RESERVED_ACCOUNT_CODES].map(kept => kept.toLowerCase()))).has(code.toLowerCase())

export function reservedAccountCode(email: string | null | undefined): string | null {
  const key = email?.trim().toLowerCase() as keyof typeof RESERVED_ACCOUNT_EMAILS | undefined
  return key && key in RESERVED_ACCOUNT_EMAILS ? RESERVED_ACCOUNT_CODES[RESERVED_ACCOUNT_EMAILS[key]] : null
}

export function productCodeCandidate(random: Random = Math.random): string {
  for (let attempt = 0; attempt < 1000; attempt++) {
    const code = Array.from({ length: 4 }, () => pick(LETTERS, random)).join('') + String(Math.floor(random() * 100)).padStart(2, '0')
    if (!blockedProductCode(code)) return code
  }
  throw new Error('No product code could be drawn.')
}

export function listCodeCandidate(random: Random = Math.random): string {
  return pick(DIGITS, random) + pick(DIGITS, random) + Array.from({ length: 4 }, () => pick(CAPITALS, random)).join('')
}

export function itemCodeCandidate(random: Random = Math.random): string {
  const start = pick(LETTERS, random) + pick(LETTERS, random) + pick(DIGITS, random) + pick(DIGITS, random)
  const first = pick(LETTERS + DIGITS, random)
  const second = pick(LETTERS + DIGITS, random)
  return start + (/\d/.test(first) && /\d/.test(second) ? pick(LETTERS, random) : first) + second
}

export const CODE_PATTERN: Record<CodeKind, RegExp> = { account: ACCOUNT_CODE, product: PRODUCT_CODE, list: LIST_CODE, item: ITEM_CODE }

export const isCodeOf = (kind: CodeKind, value: string): boolean => CODE_PATTERN[kind].test(value)

export function codeCandidate(kind: CodeKind, options: { letters?: string | null; random?: Random } = {}): string {
  const random = options.random ?? Math.random
  if (kind === 'account') return accountCodeCandidate(options.letters ?? null, random)
  if (kind === 'product') return productCodeCandidate(random)
  if (kind === 'list') return listCodeCandidate(random)
  return itemCodeCandidate(random)
}

export function accountCodeCaseVariants(code: string): string[] {
  const [first, second] = [code[0], code[1]].map(letter => [...new Set([letter.toUpperCase(), letter.toLowerCase()])])
  return first.flatMap(a => second.map(b => a + b + code.slice(2)))
}
