import { createBet } from './controllers/create-bet'
import { MessageReaction, User, Emoji, ReactionEmoji } from 'discord.js';

const Commando = require('discord.js-commando')
const parser = require('discord-command-parser')

const commandArray = require('./commands/index')

const COMMAND_PREFIX = '.'
const PIN_THRESHOLD = 1

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
    // Code...
  })
  .on('messageReactionAdd', (reaction: MessageReaction, user: User) => {
    if (reaction.emoji.name === '📌' && reaction.count >= PIN_THRESHOLD) {
      reaction.message.pin()
    }
  })
  .on('messageReactionRemove', (reaction: MessageReaction, user: User) => {
    const pinCount = reaction.message.reactions.filter(n => n.emoji.name === '📌').size
    if (pinCount < PIN_THRESHOLD) {
      reaction.message.reply('Message unpinned')
      reaction.message.unpin()
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
