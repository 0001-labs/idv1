export const BLOCKED_CODE_WORDS: readonly string[] = [
  'fuck', 'fuk', 'fck', 'fux', 'shit', 'sht', 'crap', 'turd', 'piss', 'cunt', 'twat', 'dick', 'dik', 'cock', 'knob',
  'wank', 'jizz', 'cum', 'porn', 'sex', 'anal', 'anus', 'arse', 'ass', 'butt', 'boob', 'tit', 'puss', 'slut',
  'whor', 'hoe', 'bich', 'btch', 'bitc', 'damn', 'hell', 'suck', 'fart', 'puke', 'barf', 'poo', 'smeg', 'dumb', 'ugly',
  'fat', 'kill', 'dead', 'rape', 'hate', 'nazi', 'hitl', 'heil', 'kkk', 'isis', 'fag', 'nig', 'nigg', 'coon', 'spic',
  'kike', 'gook', 'paki', 'dyke', 'homo', 'tard',
  'jew', 'gay',
  'lort', 'pik', 'pis', 'fis', 'fiss', 'kuss', 'knep', 'hore', 'lude', 'skid', 'nege', 'fand', 'svin', 'klam',
  'baka', 'aho', 'kuso', 'unko', 'mank', 'chnk', 'ecch', 'etch', 'ero', 'hent', 'kasu', 'kuzu',
  'busu', 'debu', 'hage', 'kich', 'yari', 'oppa',
  'fick', 'fotz', 'hure', 'kack', 'arsc', 'fitt', 'kuk', 'hora', 'knul', 'puta', 'puto', 'cono', 'culo', 'mier', 'jode',
  'pene', 'verg', 'merd', 'pute', 'bite', 'salo', 'cazz', 'figa', 'porr', 'ssib', 'shib', 'tmd', 'cao',
] as const

export const BLOCKED_CODE_DIGITS: readonly string[] = ['42', '49', '69'] as const

export function blockedCodeLetters(letters: string): boolean {
  const small = letters.toLowerCase()
  return BLOCKED_CODE_WORDS.some(word => small.includes(word))
}

export function blockedProductCode(code: string): boolean {
  return blockedCodeLetters(code.slice(0, 4)) || BLOCKED_CODE_DIGITS.includes(code.slice(4))
}
