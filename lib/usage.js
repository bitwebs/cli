import chalk from 'chalk'

export default function usage (commands, err, cmd) {
  if (err) { 
    console.error(chalk.red(`${err}\n`))
  } else {
    console.error('')
  }

  if (cmd) {
    console.error(simple(cmd))
    if (cmd.usage.full) console.error(cmd.usage.full)
    else console.error('')
    process.exit(err ? 1 : 0)
  }

  console.error(`Usage: ${chalk.bold(`bit`)} <command> ${chalk.gray(`[opts...]`)}

${chalk.bold(`General Commands:`)}

  ${simple(commands.info)}
  ${simple(commands.seed)}
  ${simple(commands.unseed)}
  ${simple(commands.create)}

  ${simple(commands.beam)}

${chalk.bold(`BitDrive Commands:`)}

  ${simple(commands.driveLs)}
  ${simple(commands.driveMkdir)}
  ${simple(commands.driveRmdir)}

  ${simple(commands.driveCat)}
  ${simple(commands.drivePut)}
  ${simple(commands.driveRm)}

  ${simple(commands.driveDiff)}
  ${simple(commands.driveSync)}

  ${simple(commands.driveHttp)}

${chalk.bold(`BitTree Commands:`)}

  ${simple(commands.treeLs)}
  ${simple(commands.treeGet)}
  ${simple(commands.treePut)}
  ${simple(commands.treeDel)}

${chalk.bold(`Daemon Commands:`)}

  ${simple(commands.daemonStatus)}
  ${simple(commands.daemonStart)}
  ${simple(commands.daemonStop)}

${chalk.bold(`Aliases:`)}

  ${chalk.bold('bit sync')} -> bit drive sync
  ${chalk.bold('bit diff')} -> bit drive diff
  ${chalk.bold('bit ls')} -> bit drive ls
  ${chalk.bold('bit cat')} -> bit drive cat
  ${chalk.bold('bit put')} -> bit drive put

  ${chalk.green(`Learn more at https://github.com/bitwebs/cli`)}
`)
  process.exit(err ? 1 : 0)
}

function simple (cmd) {
  return `${chalk.bold(`bit ${cmd.name}`)} ${cmd.usage.simple ? `${cmd.usage.simple} -` : `-`} ${cmd.description}`
}
