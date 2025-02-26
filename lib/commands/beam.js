import Bitbeam from '@web4/bitbeam'
import randomWords from 'random-words'
import chalk from 'chalk'

const FULL_USAGE = `
  The beam command is a general-purpose tool for sending data over the network
  according to a secret passphrase. You choose a phrase (try to make it hard-ish
  to guess!) and then share the phrase with your recipient. The phrase is only
  good for 30-60 minutes.

On the sending device:

  cat hello.txt | bit beam "for bob roberts"

On the receiving device:

  bit beam "for bob roberts" > ./hello.txt

This can be really useful for sharing BIT keys between devices. For instance:

  > bit sync ./my-folder
  Creating new bitdrive...
  Source: my-folder/
  Target: bit://f7145e1bbc0d17705861e996b47422e0ca50a80db9441249bd721ff426b79f2a/
  Begin sync? [y/N] y
  Syncing...
  Synced
  > echo "bit://f7145e1bbc0d17705861e996b47422e0ca50a80db9441249bd721ff426b79f2a/" \\
    | bit beam "nobody can guess"
`

export default {
  name: 'beam',
  description: 'Send a stream of data over the network.',
  usage: {
    simple: '[passphrase]',
    full: FULL_USAGE
  },
  command: async function (args) {
    var phrase = args._[0] ? args._.join(' ') : randomWords(3).join(' ')
    const beam = new Bitbeam(phrase)

    if (!args._[0]) {
      console.error('[bitbeam] Generated passphrase:')
      console.error('')
      console.error('  ', chalk.bold(phrase))
      console.error('')
    }
    
    beam.on('remote-address', function ({ host, port }) {
      if (!host) console.error('[bitbeam] Could not detect remote address')
      else console.error('[bitbeam] Joined the DHT - remote address is ' + host + ':' + port)
      if (port) console.error('[bitbeam] Network is holepunchable \\o/')
    })

    beam.on('connected', function () {
      console.error('[bitbeam] Success! Encrypted tunnel established to remote peer')
    })

    beam.on('end', () => beam.end())

    process.stdin.pipe(beam).pipe(process.stdout)
    process.stdin.unref()

    process.once('SIGINT', () => {
      if (!beam.connected) closeASAP()
      else beam.end()
    })

    function closeASAP () {
      console.error('[bitbeam] Shutting down beam...')

      const timeout = setTimeout(() => process.exit(1), 2000)
      beam.destroy()
      beam.on('close', function () {
        clearTimeout(timeout)
      })
    }
  }
}
