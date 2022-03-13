import { join } from 'path'
import * as BitStruct from '../../bit/struct.js'
import { statusLogger } from '../../status-logger.js'
import { parseBitUrl } from '../../urls.js'

const FULL_USAGE = `
Options:

  -r/--recursive - If the target is a folder, delete it and all of its contents.

Examples:

  bit drive rm bit://1234..af/file.txt
  bit drive rm -r bit://1234..af/folder/
`

export default {
  name: 'drive rm',
  description: 'Remove a file or (if --recursive) a folder at the given bitdrive URL.',
  usage: {
    simple: '{url}',
    full: FULL_USAGE
  },
  options: [
    {
      name: 'recursive',
      default: false,
      abbr: 'r',
      boolean: true
    }
  ],
  command: async function (args) {
    if (!args._[0]) throw new Error('URL is required')

    var statusLines = ['Accessing network...']
    var statusLog = statusLogger(statusLines)
    statusLog.print()

    var urlp =  parseBitUrl(args._[0])
    if (!urlp.pathname || urlp.pathname === '/') {
      throw new Error('Cannot delete the root folder')
    }
    var drive = await BitStruct.get(urlp.hostname, {expect: 'bitdrive'})
    if (args.recursive) {
      async function recursiveRm (drive, pathname) {
        let st = await drive.api.promises.stat(pathname)
        if (st.isDirectory()) {
          let names = await drive.api.promises.readdir(pathname)
          for (let name of names) {
            await recursiveRm(drive, join(pathname, name))
          }
          await drive.api.promises.rmdir(pathname)
        } else {
          await drive.api.promises.unlink(pathname)
        }
        statusLines[0] = `${pathname} deleted`
        statusLog.print()
      }
      await recursiveRm(drive, urlp.pathname)
    } else {
      let st = await drive.api.promises.stat(urlp.pathname)
      if (!st.isFile()) throw new Error('Cannot delete a folder unless --recursive is specified')
      await drive.api.promises.unlink(urlp.pathname)
    }

    statusLog.clear()
    console.log(`${urlp.pathname} deleted`)
    process.exit(0)
  }
}