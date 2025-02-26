import pump from 'pump'
import concat from 'concat-stream'
import * as BitStruct from '../../bit/struct.js'
import { parseBitUrl } from '../../urls.js'

const FULL_USAGE = `
Examples:

  bit drive put bit://1234..af/hello.txt "Hello world!"
  cat package.json | bit drive put bit://1234..af/package.json
  cat photo.png | bit drive put bit://1234..af/photo.png
`

export default {
  name: 'drive put',
  description: 'Write a file at the given bitdrive URL.',
  usage: {
    simple: '{url} [content]',
    full: FULL_USAGE
  },
  command: async function (args) {
    try {
      if (!args._[0]) throw new Error('URL is required')
      var urlp = parseBitUrl(args._[0])

      try {
        var value
        if (!process.stdin.isTTY) {
          value = await new Promise((resolve, reject) => {
            pump(
              process.stdin,
              concat(res => resolve(res)),
              err => {
                if (err) reject(err)
              }
            )
          })
        } else {
          value = args._[1]
          if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
            console.log('Warning: JSON objects must be piped via STDIN')
          }
        }
      } catch (e) {
        console.error(e)
        throw e
      }

      if (typeof value === 'undefined') {
        console.error('A value is required. Can be parameter in the CLI or a stream via STDIN')
        process.exit()
      }

      if (!urlp.pathname || urlp.pathname === '/') {
        throw new Error('Cannot write a file to the root folder')
      }

      var drive = await BitStruct.get(urlp.hostname, {expect: 'bitdrive'})
      await drive.api.promises.writeFile(urlp.pathname, value)
      console.log(urlp.pathname, 'written')
    } catch (e) {
      console.error('Unexpected error', e)
    } finally {
      process.exit(0)
    }
  }
}
