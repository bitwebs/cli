import chalk from 'chalk'
import * as BitStruct from '../bit/struct.js'
import { getMirroringClient } from '../bit/index.js'
import { parseBitUrl } from '../urls.js'

const FULL_USAGE = `
Examples:

  bit seed bit://1234..af/
  bit seed bit://1234..af/ bit:://fedc..21/
`

export default {
  name: 'seed',
  description: 'Download and make bit data available to the network.',
  usage: {
    simple: '{urls...}',
    full: FULL_USAGE
  },
  command: async function (args) {
    if (!args._[0]) throw new Error('At least URL is required')
    var mirroringClient = getMirroringClient()

    var keys = []
    for (let url of args._) {
      let urlp = parseBitUrl(url)
      keys.push(urlp.hostname)
    }

    for (const key of keys) {
      var struct = await BitStruct.get(key)
      await mirroringClient.mirror(struct.key, struct.type)
      console.log(`Seeding ${chalk.bold(short(key))}`)
    }
    process.exit(0)
  }
}

function short (key) {
  return `${key.slice(0, 6)}..${key.slice(-2)}`
}
