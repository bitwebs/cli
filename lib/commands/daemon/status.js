import chalk from 'chalk'
import bitspace from 'bitspace'
const BitspaceClient = bitspace.Client

const FULL_USAGE = `
Examples:

  bit daemon status
`

export default {
  name: 'daemon status',
  description: 'Check the status of the bitspace daemon.',
  usage: {
    simple: '',
    full: FULL_USAGE
  },
  command: async function (args) {
    try {
      let client = new BitspaceClient()
      await client.ready()
      let st = await client.status()
      const versionString = st.version ? `v${st.version}` : '(Unknown Version)'
      console.error(chalk.bold(`Bitspace ${versionString}`))
      console.error(chalk.bold(`Bitspace API v${st.apiVersion}`))
      console.error(`Your address: ${st.remoteAddress} (${st.holepunchable ? 'Hole-punchable' : 'Not Hole-punchable'})`)
    } catch {
      console.error(`Daemon not active`)
    }

    process.exit(0)
  }
}
