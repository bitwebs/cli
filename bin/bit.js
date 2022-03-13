#!/usr/bin/env node


process.title = "bit"

import subcommand from 'subcommand'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import * as bit from '../lib/bit/index.js'

import info from '../lib/commands/info.js'
import create from '../lib/commands/create.js'
import seed from '../lib/commands/seed.js'
import unseed from '../lib/commands/unseed.js'
import beam from '../lib/commands/beam.js'

import driveLs from '../lib/commands/drive/ls.js'
import driveCat from '../lib/commands/drive/cat.js'
import driveMkdir from '../lib/commands/drive/mkdir.js'
import driveRmdir from '../lib/commands/drive/rmdir.js'
import drivePut from '../lib/commands/drive/put.js'
import driveRm from '../lib/commands/drive/rm.js'
import driveDiff from '../lib/commands/drive/diff.js'
import driveSync from '../lib/commands/drive/sync.js'
import driveHttp from '../lib/commands/drive/http.js'

import treeLs from '../lib/commands/tree/ls.js'
import treeGet from '../lib/commands/tree/get.js'
import treePut from '../lib/commands/tree/put.js'
import treeDel from '../lib/commands/tree/del.js'

import daemonStatus from '../lib/commands/daemon/status.js'
import daemonStart from '../lib/commands/daemon/start.js'
import daemonStop from '../lib/commands/daemon/stop.js'

import usage from '../lib/usage.js'

// main
// =

const commands = {
  info,
  seed,
  unseed,
  create,
  beam,

  driveLs,
  driveCat,
  driveMkdir,
  driveRmdir,
  drivePut,
  driveRm,
  driveDiff,
  driveSync,
  driveHttp,

  treeLs,
  treeGet,
  treePut,
  treeDel,

  daemonStatus,
  daemonStart,
  daemonStop
}

// handle command aliases
const driveCmdAliases = ['sync', 'diff', 'ls', 'cat', 'put']
var argv = process.argv.slice(2)
if (driveCmdAliases.includes(argv[0])) {
  argv.unshift('drive')
}

// match & run the command
var match = subcommand({ commands: Object.values(commands).map(wrapCommand), none })
match(argv)

// error output when no/invalid command is given
function none (args) {
  if (args.version) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(fileURLToPath(import.meta.url), '../../package.json'), 'utf8'))
    console.log(packageJson.version)
    process.exit(0)
  }
  if (args._[0]) {
    console.error(`Invalid command: ${args._[0]}`)
  } else {
    usage(commands)
  }
}

function wrapCommand (obj) {
  var innerCommand = obj.command

  obj.command = async function (...args) {
    if (args[0].h || args[0].help) {
      usage(commands, null, obj)
      process.exit(0)
    }

    try {
      if (!obj.name.startsWith('daemon') && obj.name !== 'beam') {
        await bit.setup()
      }
    } catch (err) {
      console.error('The daemon is not active. Please run:')
      console.error('')
      console.error('  bit daemon start')
      console.error('')
      process.exit(2)
    }

    try {
      await innerCommand(...args)
    } catch (err) {
      console.error('Error:', err.message)
      process.exit(1)
    }
  }
  return obj
}
