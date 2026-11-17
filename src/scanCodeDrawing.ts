const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export const scanCodeColumns = 16
export const scanCodeRows = 4
export const CODE_END_RADIUS = 0.1

export function scanCodeChecksum(bytes: readonly number[]): number {
  let crc = 0xffff
  for (const byte of bytes) {
    crc ^= byte << 8
    for (let bit = 0; bit < 8; bit++) crc = ((crc << 1) ^ (crc & 0x8000 ? 0x1021 : 0)) & 0xffff
  }
  return crc
}

export function encodeScanCode(id: string): boolean[] | null {
  if (!/^[A-Za-z0-9]{6}$/.test(id)) return null
  let value = 0
  for (const character of id) value = value * 62 + alphabet.indexOf(character)
  const bytes = [3]
  for (let shift = 32; shift >= 0; shift -= 8) bytes.push(Math.floor(value / 2 ** shift) & 255)
  const crc = scanCodeChecksum(bytes)
  bytes.push(crc >> 8, crc & 255)
  return bytes.flatMap(byte => Array.from({ length: 8 }, (_, bit) => !!(byte & (1 << (7 - bit)))))
}

export function scanCodePath(bits: readonly boolean[], { ink = (bit: boolean) => !bit, cell = 1, x = 0, y = 0, radius = 0 }: { ink?: (bit: boolean) => boolean; cell?: number; x?: number; y?: number; radius?: number } = {}): string {
  const round = (value: number) => Math.round(value * 1e4) / 1e4
  const inked = (row: number, column: number) =>
    row >= 0 && row < scanCodeRows && column >= 0 && column < scanCodeColumns && ink(bits[row * scanCodeColumns + column])
  const r = Math.min(Math.max(radius, 0), 0.5) * cell
  let d = ''
  for (let row = 0; row < scanCodeRows; row++) {
    for (let column = 0; column < scanCodeColumns;) {
      if (!inked(row, column)) { column++; continue }
      const start = column
      while (column < scanCodeColumns && inked(row, column)) column++
      const left = x + start * cell, right = x + column * cell, top = y + row * cell, bottom = top + cell
      if (!r) {
        d += `M${round(left)} ${round(top)}h${round(right - left)}v${round(cell)}h${round(left - right)}z`
        continue
      }
      const end = (facing: number, inside: number) => !inked(facing, inside) ? r : 0
      const tl = end(row - 1, start)
      const tr = end(row - 1, column - 1)
      const br = end(row + 1, column - 1)
      const bl = end(row + 1, start)
      const arc = (radius: number, toX: number, toY: number) => radius ? `A${round(radius)} ${round(radius)} 0 0 1 ${round(toX)} ${round(toY)}` : ''
      d += `M${round(left + tl)} ${round(top)}H${round(right - tr)}${arc(tr, right, top + tr)}`
      d += `V${round(bottom - br)}${arc(br, right - br, bottom)}`
      d += `H${round(left + bl)}${arc(bl, left, bottom - bl)}`
      d += `V${round(top + tl)}${arc(tl, left + tl, top)}Z`
    }
  }
  if (!r) return d
  for (let row = 0; row < scanCodeRows; row++) {
    for (let column = 0; column < scanCodeColumns; column++) {
      if (inked(row, column)) continue
      const left = x + column * cell, top = y + row * cell
      for (const [dy, dx] of [[-1, -1], [-1, 1], [1, 1], [1, -1]] as const) {
        if (!inked(row + dy, column) || !inked(row, column + dx) || !inked(row + dy, column + dx)) continue
        const cornerX = left + (dx > 0 ? cell : 0), cornerY = top + (dy > 0 ? cell : 0)
        const alongX = cornerX - dx * r, alongY = cornerY - dy * r
        const sweep = dx * dy > 0 ? 0 : 1
        d += `M${round(cornerX)} ${round(cornerY)}H${round(alongX)}A${round(r)} ${round(r)} 0 0 ${sweep} ${round(cornerX)} ${round(alongY)}Z`
      }
    }
  }
  return d
}

