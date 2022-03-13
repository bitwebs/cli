import * as BitStruct from '../../bit/struct.js'
import { statusLogger } from '../../status-logger.js'
import { parseBitUrl } from '../../urls.js'

const FULL_USAGE = `
Examples:

  bit drive mkdir bit://1234..af/foldername
`

export default {
  name: 'drive mkdir',
  description: 'Create a new directory at the given bitdrive URL.',
  usage: {
    simple: '{url}',
    full: FULL_USAGE
  },
  command: async function (args) {
    if (!args._[0]) throw new Error('URL is required')

    var statusLog = statusLogger(['Accessing network...'])
    statusLog.print()

    var urlp =  parseBitUrl(args._[0])
    if (!urlp.pathname || urlp.pathname === '/') {
      throw new Error('Root folder already exists')
    }
    var drive = await BitStruct.get(urlp.hostname, {expect: 'bitdrive'})
    await drive.api.promises.mkdir(urlp.pathname || '/')

    statusLog.clear()
    console.log(`${urlp.pathname} created`)
    process.exit(0)
  }
}
