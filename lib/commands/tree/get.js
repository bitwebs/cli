import * as BitStruct from '../../bit/struct.js'
import { statusLogger } from '../../status-logger.js'
import { fromPathToBittreeKeyList, parseBitUrl } from '../../urls.js'

const FULL_USAGE = `
Examples:

  bit tree get bit://1234..af/foo
  bit tree get bit://1234..af/foo/bar
`

export default {
  name: 'tree get',
  description: 'Get the value of an entry of the given bittree URL.',
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
    var entry = await keyspace.get(path[path.length - 1])

    statusLog.clear()
    console.log(JSON.stringify(entry.value, null, 2))

    process.exit(0)
  }
}
