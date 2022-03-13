import bitspace from 'bitspace'
const BitspaceClient = bitspace.Client

import { setup } from '../../bit/index.js'

const FULL_USAGE = `
Examples:

  bit daemon start
`
export default {
  name: 'daemon start',
  description: 'Start the bitspace daemon.',
  usage: {
    full: FULL_USAGE
  },
  command: async function (args) {
    await setup({canStartDaemon: true})
    try {
      const client = new BitspaceClient()
      await client.ready()
      await client.status()
    } catch (err) {
      console.error('Could not start the daemon:')
      console.error(err)
      process.exit(1)
    }
    console.log('Daemon is running.')
    process.exit(0)
  }
}
