import { createBet } from './controllers/create-bet'

const Commando = require('discord.js-commando')
const parser = require('discord-command-parser')
const commandArray = require('./commands/index')

const COMMAND_PREFIX = '.'

const client = new Commando.Client({
  owner: process.env.OWNER,
  commandPrefix: COMMAND_PREFIX
})

// const client = new Discord.Client()

/**
 * All Discord events are listed here:
 */
client
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
  })
  .on('message', (msg: any) => {
    const parsed = parser.parse(msg, COMMAND_PREFIX)
    if (parsed.prefix === COMMAND_PREFIX) {
      switch (parsed.command) {
        case 'createbet':
          createBet(parsed.arguments)
          break;
        case 'betlist':

          break;
        default:
          // Do nothing.
          break;
      }
    }
  })

client.registry
  .registerGroups([
    ['bet', 'Bet commands']
  ])
  .registerDefaults()
  .registerCommands(commandArray)

// Start the client:
export { client }

client.login(process.env.DISCORD_TOKEN)
