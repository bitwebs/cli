import EventEmitter from 'events'
import bitdrive from '@web4/bitdrive'
import Bittree from '@web4/bittree'
import { getClient } from './index.js'
import lock from '../lock.js'
import { fromURLToKeyStr } from '../urls.js'
import BittrieMessages from '@web4/bittrie/lib/messages.js'
import BitTreeMessages from '@web4/bittree/lib/messages.js'

// globals
// =

export const activeStructures = {} // [keyStr] => HyperStructure

// exported apis
// =

class HyperStructure extends EventEmitter {
  constructor (keyStr) {
    super()
    this.keyStr = keyStr
    this.type = undefined
    this.header = undefined
    this.api = undefined
  }

  get key () {
    return this.chain?.key
  }

  get discoveryKey () {
    return this.chain?.discoveryKey
  }

  get url () {
    return `bit://${this.keyStr}/`
  }

  get chain () {
    if (!this.api) return undefined
    if (this.type === 'bitdrive') return this.api.metadata
    if (this.type === 'bittree') return this.api.feed
  }

  async load ({noNetConfig} = {noNetConfig: false}) {
    var chain
    var wasOpen = !!this.api

    // detect the bit-structure type
    if (!this.type || !this.header) {
      chain = getClient().chainstore().get(this.keyStr)
      await chain.ready()
      if (!noNetConfig) getClient().network.configure(chain, {lookup: true, announce: true})
      let headerBlock = await chain.get(0)
      try {
        this.header = BittrieMessages.Header.decode(headerBlock)
        if (this.header.type === 'bittrie') {
          this.type = this.header.subtype || 'bitdrive'
        } else {
          throw new Error() // bounce to the next parser
        }
      } catch {
        try {
          this.header = BittreeMessages.Header.decode(headerBlock)
          if (this.header?.protocol !== 'bittree') {
            throw new Error() // bounce to next parser
          }
          this.type = 'bittree'
        } catch {
          this.header = undefined
          this.type = 'unknown'
        }
      }
    }

    // load the bit-structure API session
    if (this.type === 'bitdrive') {
      this.api = bitdrive(getClient().chainstore(), this.keyStr, {extension: false})
      await this.api.promises.ready()
    } else if (this.type === 'bittree') {
      chain = chain || getClient().chainstore().get(this.keyStr)
      this.api = new Bittree(chain, {
        keyEncoding: 'binary',
        valueEncoding: 'json'
      })
      await this.api.ready()
    } else {
      this.api = chain || getClient().chainstore().get(this.keyStr)
      await this.api.ready()
    }

    if (wasOpen) {
      this.emit('reloaded')
    }
  }

  async create (type, {noNetConfig} = {noNetConfig: false}) {
    if (this.type) {
      throw new Error('Cannot call create on a bit structure that already exists')
    }
    if (type !== 'bitdrive' && type !== 'bittree') {
      throw new Error(`Unknown unichain structure type (${type}) cannot create`)
    }

    this.type = type

    if (this.type === 'bitdrive') {
      this.api = bitdrive(getClient().chainstore(), null, {extension: false})
      await this.api.promises.ready()
      this.keyStr = this.key.toString('hex')
    } else if (this.type === 'bittree') {
      let chain = getClient().chainstore().get(null)
      this.api = new Bittree(chain, {
        keyEncoding: 'binary',
        valueEncoding: 'json'
      })
      await this.api.ready()
      this.keyStr = this.key.toString('hex')
    }

    if (!noNetConfig) getClient().network.configure(this.chain, {lookup: true, announce: true})
  }


  async close () {
    if (this.api) {
      // TODO do we need to configure the network with announce/lookup false?
      this.api.close()
      this.api = undefined
      this.emit('closed')
    }
  }
}

export async function get (key, {expect, noNetConfig} = {expect: undefined, noNetConfig: false}) {
  var keyStr = fromURLToKeyStr(key)
  var release = await lock(`bit-struct-get:${keyStr}`)
  try {
    if (keyStr in activeStructures) {
      return activeStructures[keyStr]
    }
    var struct = new HyperStructure(keyStr)
    await struct.load({noNetConfig})
    activeStructures[keyStr] = struct

    if (expect && struct.type !== expect) {
      throw new Error(`The bit:// was expected to be a ${expect}, got ${struct.type}`)
    }

    return struct
  } finally {
    release()
  }
}

export async function create (type) {
  var struct = new HyperStructure(null)
  await struct.create(type)
  activeStructures[struct.keyStr] = struct
  return struct
}
