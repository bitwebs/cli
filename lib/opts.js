import path from 'path'

const BIT_URL_REGEX = /^(bit:\/\/)?([0-9a-f]{64})/i

export function parseBitUrl (url) {
  return BIT_URL_REGEX.exec(url)
}

export function isBitUrl (url) {
  return !!parseBitUrl(url)
}

export async function biturlOpt (arg) {
  if (arg) {
    var match = BIT_URL_REGEX.exec(arg)
    if (match) return `bit://${match[2]}`
  }
}

export function dirOpt (arg) {
  if (arg) {
    if (!path.isAbsolute(arg)) return path.resolve(process.cwd(), arg)
    return arg
  }
  return process.cwd()
}

export function biturlToKey (url) {
  var match = BIT_URL_REGEX.exec(url)
  return match && match[2]
}