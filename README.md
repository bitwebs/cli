# BitWeb CLI

A CLI for peer-to-peer file sharing (and more) using the [BIT protocol](https://bitwebs.org).

## Installation

Requires nodejs 14+

```
npm install -g bitweb-cli
```

To start using the network, run:

```
bit daemon start
```

This will run in the background, sync data for you, until you run:

```
bit daemon stop
```

## Usage

Command overview:

```bash
Usage: bit <command> [opts...]

General Commands:

  bit info [urls...] - Show information about one (or more) bitweb data.
  bit seed {urls...} - Download and make data available to the network.
  bit unseed {urls...} - Stop making data available to the network.
  bit create {drive|tree} - Create a new bitdrive or bittree.

  bit beam {pass_phrase} - Send a stream of data over the network.

Bitdrive Commands:

  bit drive ls {url} - List the entries of the given bitdrive URL.
  bit drive mkdir {url} - Create a new directory at the given bitdrive URL.
  bit drive rmdir {url} - Remove a directory at the given bitdrive URL.

  bit drive cat {url} - Output the content of the given bitdrive URL.
  bit drive put {url} [content] - Write a file at the given bitdrive URL.
  bit drive rm {url} - Remove a file or (if --recursive) a folder at the given bitdrive URL.

  bit drive diff {source_path_or_url} {target_path_or_url} - Compare two folders in your local filesystem or in bitdrives. Can optionally "commit" the difference.
  bit drive sync {source_path_or_url} [target_path_or_url] - Continuously sync changes between two folders in your local filesystem or in bitdrives.

  bit drive http {url} - Host a bitdrive as using HTTP on the localhost.

BitTree Commands:

  bit tree ls {url} - List the entries of the given bittree URL.
  bit tree get {url} - Get the value of an entry of the given bittree URL.
  bit tree put {url} [value] - Set the value of an entry of the given bittree URL.
  bit tree del {url} - Delete an entry of the given bittree URL.

Daemon Commands:

  bit daemon status - Check the status of the bitweb daemon.
  bit daemon start - Start the bitweb daemon.
  bit daemon stop - Stop the bitweb daemon and mirroring daemons if active.

Aliases:

  bit sync -> bit drive sync
  bit diff -> bit drive diff
  bit ls -> bit drive ls
  bit cat -> bit drive cat
  bit put -> bit drive put
```

## Overview

The [BitWeb](https:/bitwebs.org) is a peer-to-peer network for sharing files and data. This command-line provides a convenient set of tools for accessing the network.

BitWeb data exists within a data structure known as a [UniChain](https://github.com/bitwebs/unichain). There are two common kinds of "UniChains":

- **BitDrive** A folder containing files.
- **BitTree** A key-value database (similar to leveldb).

All data has a URL which starts with `bit://`. A URL will look like this:

```
bit://515bbbc1db2139ef27b6c45dfa418c8be6a1dec16823ea7cb9e61af8d060049e/
```

You use these URLs to access the BitWeb data over the peer-to-peer network. For example:

```
bit ls bit://515bbbc1db2139ef27b6c45dfa418c8be6a1dec16823ea7cb9e61af8d060049e/
bit cat bit://515bbbc1db2139ef27b6c45dfa418c8be6a1dec16823ea7cb9e61af8d060049e/file.txt
cat diagram.png | bit put 515bbbc1db2139ef27b6c45dfa418c8be6a1dec16823ea7cb9e61af8d060049e/diagram.png
```

You can create a new bitdrive or bittree using the `create` commands:

```
bit create drive
```

You can then seed the BitWeb data (or seed a data created by somebody else) using the `seed` command:

```
bit seed bit://515bbbc1db2139ef27b6c45dfa418c8be6a1dec16823ea7cb9e61af8d060049e/
```

To see what bitweb data you are currently seeding, run `info`:

```
bit info
```

## Documentation

The [website documentation](https://bitwebs.org/guides/cli/) have a lot of useful guides:

- [Full Commands Reference](https://bitwebs.org/guides/cli/commands/)
- [Guide: Sharing Folders](https://bitwebs.org/guides/cli/sharing-folders/)
- [Guide: Seeding Data](https://bitwebs.org/guides/cli/seeding-data/)
- [Guide: Beaming Files](https://bitwebs.org/guides/cli/beaming-files/)
