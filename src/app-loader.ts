import { MessageReaction, User, Emoji, ReactionEmoji } from 'discord.js';
//   "database": "../NadekoBot/src/NadekoBot/bin/Release/netcoreapp2.1/data/NadekoBot.db",

const Commando = require('discord.js-commando')
const parser = require('discord-command-parser')

const commandArray = require('./commands/index')

const COMMAND_PREFIX = '.'
const PIN_THRESHOLD = 5

const client = new Commando.Client({
  owner: process.env.OWNER,
  commandPrefix: COMMAND_PREFIX,
  unknownCommandResponse: ''
})

// const client = new Discord.Client()

/**
 * All Discord events are listed here:
 */
client
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`)
    client.user.setActivity('Gambling and Pin Bot');
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
      reaction.message.unpin()
    }
  })
  .on('commandError', (cmd, err) => {
    console.log(err);
    if (err instanceof client.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('unknownCommand', (cmd, err) => {
    return '';
	})

client.registry
  .registerGroups([
    ['bet', 'Bet commands']
  ])
  .registerDefaultTypes()
  .registerCommands(commandArray)

// Start the client:
export { client }

client.login(process.env.DISCORD_TOKEN)
