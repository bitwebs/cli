import * as BitStruct from '../../bit/struct.js'
import { statusLogger } from '../../status-logger.js'
import pump from 'pump'
import concat from 'concat-stream'
import { parseBitUrl } from '../../urls.js'
import { keyToPath, listShallow } from '../../bittree-util.js'

const FULL_USAGE = `
Options:

  --gt {key} - Filter to items with a key greater than the given value.
  --gte {key} - Filter to items with a key greater than or equal to the given value.
  --lt {key} - Filter to items with a key less than the given value.
  --lte {key} - Filter to items with a key less than or equal to the given value.

Examples:

  bit tree ls bit://1234..af/
  bit tree ls bit://1234..af/foo/bar
  bit tree ls bit://1234..af/ --gte a --lt m
`

export default {
  name: 'tree ls',
  description: 'List the entries of the given bittree URL.',
  usage: {
    simple: '{url}',
    full: FULL_USAGE
  },
  // TODO
  // options: [
  //   {name: 'gt'},
  //   {name: 'gte'},
  //   {name: 'lt'},
  //   {name: 'lte'},
  // ],
  command: async function (args) {
    if (!args._[0]) throw new Error('URL is required')

    var statusLog = statusLogger(['Accessing network...'])
    statusLog.print()

    var urlp = parseBitUrl(args._[0])
    var tree = await BitStruct.get(urlp.hostname, {expect: 'bittree'})

    // ORIGINAL CODE
    // (I'm keeping this for when bittree gets shallow readstreams in core)
    // -prf
    // var opts = {}
    // if (args.gt) opts.gt = Buffer.from(args.gt, 'utf8')
    // if (args.gte) opts.gte = Buffer.from(args.gte, 'utf8')
    // if (args.lt) opts.lt = Buffer.from(args.lt, 'utf8')
    // if (args.lte) opts.lte = Buffer.from(args.lte, 'utf8')
    // var res = await new Promise((resolve, reject) => {
    //   pump(
    //     tree.api.createReadStream(opts),
    //     concat(res => resolve(res)),
    //     err => {
    //       if (err) reject(err)
    //     }
    //   )
    // })
    // console.log(res.map(entry =>
    //   `/${keyToPath(entry.key)} = ${JSON.stringify(entry.value, null, 2)}`
    // ).join('\n'))

    var res = await listShallow(tree.api, urlp.pathname || '/')

    statusLog.clear()
    console.log(res.map(entry =>
      `/${entry.path.join('/')}${entry.isContainer ? '/' : ` = ${JSON.stringify(entry.value, null, 2)}`}`
    ).join('\n'))

    process.exit(0)
  }
}