import { expect, test } from 'vite-plus/test'
import { ID_SPACE, idUsage } from '../src/space'

test('each kind of IDv1 code has as many as its generator can make', () => {
  expect(ID_SPACE.accounts).toBe(27_040_000)
  expect(ID_SPACE.products).toBe(731_161_600)
  expect(ID_SPACE.lists).toBe(45_697_600)
  expect(ID_SPACE.items).toBe(52 * 52 * 100 * (62 * 62 - 100))
})

test('usage says how much is used and how much is left', () => {
  expect(idUsage('accounts', 1352)).toEqual({ used: 1352, space: 27_040_000, left: 27_038_648, percent: 0.005 })
})
