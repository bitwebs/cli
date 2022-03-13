import chalk from 'chalk'
import bitspace from 'bitspace'
import mirroring from 'bitspace-mirroring-service'
const BitspaceClient = bitspace.Client
const MirroringClient = mirroring.Client

const FULL_USAGE = `
Examples:

  bit daemon stop
`

export default {
  name: 'daemon stop',
  description: 'Stop the bitspace and mirroring daemons if active.',
  usage: {
    simple: '',
    full: FULL_USAGE
  },
  command: async function(args) {
    await stopDaemon('mirroring', () => new MirroringClient())
    await stopDaemon('bitspace', () => new BitspaceClient())
    process.exit(0)
  }
}

async function stopDaemon (name, clientFunc) {
  for (let i = 0; i < 10; i++) {
    var client
    try {
      client = clientFunc()
      await client.ready()
    } catch {
      console.error(`${name} daemon stopped`)
      break
    }

    if (i === 0) {
      console.error(`${name} daemon is running. Attempting to stop...`)
    }
    await client.stop()
    await new Promise(r => setTimeout(r, 1e3))
  }
}
