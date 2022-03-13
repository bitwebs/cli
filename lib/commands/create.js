import * as BitStruct from '../bit/struct.js'
import { getMirroringClient } from '../bit/index.js'

export default {
  name: 'create',
  description: 'Create a new bitdrive or bittree.',
  usage: {
    simple: '{drive|tree}',
    full: ''
  },
  command: async function (args) {
    var struct
    if (args._[0] === 'drive' || args._[0] === 'bitdrive') {
      struct = await BitStruct.create('bitdrive')
      console.error('Drive Created:', struct.url)
    } else if (args._[0] === 'bee' || args._[0] === 'bittree') {
      struct = await BitStruct.create('bittree')
      console.error('Tree Created:', struct.url)
    } else {
      if (args._[0]) console.error('Unknown type:', args._[0], '- must be a "drive" or "tree".')
      else console.error('What do you want to create? Can be a "drive" or "tree".')
      process.exit(1)
    }

    await getMirroringClient().mirror(struct.key, struct.type)
    console.log('Seeding', struct.type)
    process.exit(0)
  }
}
