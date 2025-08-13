const GSM7_BASIC =
  "@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞ" +
  " !\"#¤%&'()*+,-./" +
  "0123456789:;<=>?" +
  "¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ`" +
  "abcdefghijklmnopqrstuvwxyzäöñüà"

const GSM7_EXTENDED = "^{}\\[~]|€"

function isGsm7Char(ch: string) {
  return GSM7_BASIC.includes(ch) || GSM7_EXTENDED.includes(ch)
}

function gsm7Length(text: string) {
  let len = 0
  for (const ch of text) {
    if (!isGsm7Char(ch)) return null
    len += GSM7_EXTENDED.includes(ch) ? 2 : 1
  }
  return len
}

export function countSmsSegments(text: string) {
  const g7 = gsm7Length(text)
  if (g7 !== null) {
    if (g7 <= 160) return 1
    return Math.ceil(g7 / 153)
  }
  const ucs2Len = [...text].length
  if (ucs2Len <= 70) return 1
  return Math.ceil(ucs2Len / 67)
}
