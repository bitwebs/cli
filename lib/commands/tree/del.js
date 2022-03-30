import * as BitStruct from '../../bit/struct.js'
import { statusLogger } from '../../status-logger.js'
import { fromPathToBittreeKeyList, parseBitUrl } from '../../urls.js'

const FULL_USAGE = `
Examples:

  bit tree del bit://1234..af/foo
  bit tree del bit://1234..af/foo/bar
`

export default {
  name: 'tree del',
  description: 'Delete an entry of the given bittree URL.',
  usage: {
    simple: '{url}',
    full: FULL_USAGE
  },
  command: async function (args) {
    if (!args._[0]) throw new Error('URL is required')

    var statusLog = statusLogger(['Accessing network...'])
    statusLog.print()

    var urlp = parseBitUrl(args._[0])
    var tree = await BitStruct.get(urlp.hostname, {expect: 'bittree'})

    var path = fromPathToBittreeKeyList(urlp.pathname)
    var keyspace = tree.api
    for (let i = 0; i < path.length - 1; i++) {
      keyspace = keyspace.sub(path[i])
    }
    await keyspace.del(path[path.length - 1])

    statusLog.clear()
    console.log(`/${path.map(encodeURIComponent).join('/')} has been deleted`)

    process.exit(0)
  }
}
