import * as BitStruct from '../../bit/struct.js'
import { statusLogger } from '../../status-logger.js'
import { parseBitUrl } from '../../urls.js'

const FULL_USAGE = `
Examples:

  bit drive ls bit://1234..af/
  bit drive ls bit://1234..af/foo/bar
`

export default {
  name: 'drive ls',
  description: 'List the entries of the given bitdrive URL.',
  usage: {
    simple: '{url}',
    full: FULL_USAGE
  },
  command: async function (args) {
    if (!args._[0]) throw new Error('URL is required')

    var statusLog = statusLogger(['Accessing network...'])
    statusLog.print()

    var urlp =  parseBitUrl(args._[0])
    var drive = await BitStruct.get(urlp.hostname, {expect: 'bitdrive'})
    var res = await drive.api.promises.readdir(urlp.pathname || '/')

    statusLog.clear()
    console.log(res.join('\n'))

    process.exit(0)
  }
}
