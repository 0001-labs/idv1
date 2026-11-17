import { CODE_PATTERN, codeKind, type CodeKind } from './shapes'
import { blockedCodeLetters } from './words'

export type AdvancedCodeKind = CodeKind | 'event'

export const ANY_CODE = /^[A-Za-z0-9]{6}$/

const ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const isEventCode = (value: string): boolean => ANY_CODE.test(value) && codeKind(value) === null

export function advancedCodeKind(value: string): AdvancedCodeKind | null {
  return codeKind(value) ?? (ANY_CODE.test(value) ? 'event' : null)
}

export const isAdvancedCodeOf = (kind: AdvancedCodeKind, value: string): boolean =>
  kind === 'event' ? isEventCode(value) : CODE_PATTERN[kind].test(value)

type Random = () => number

export function secureRandom(): number {
  const crypto = globalThis.crypto
  if (!crypto?.getRandomValues) return Math.random()
  const value = new Uint32Array(1)
  crypto.getRandomValues(value)
  return value[0] / 2 ** 32
}

export function eventCodeCandidate(random: Random = secureRandom): string {
  for (let attempt = 0; attempt < 1000; attempt++) {
    let code = ''
    for (let index = 0; index < 6; index++) code += ALPHABET[Math.floor(random() * ALPHABET.length)]
    if (isEventCode(code) && !blockedCodeLetters(code)) return code
  }
  throw new Error('No event code could be drawn.')
}

export const ADVANCED_SPACE = (() => {
  const letters = 52
  const digits = 10
  const all = (letters + digits) ** 6
  const shapes =
    letters ** 2 * digits ** 4 +
    letters ** 4 * digits ** 2 +
    digits ** 2 * letters ** 4 +
    letters ** 2 * digits ** 2 * ((letters + digits) ** 2 - digits ** 2)
  return { all, shapes, events: all - shapes } as const
})()
