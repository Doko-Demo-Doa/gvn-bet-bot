import { Message } from 'discord.js';
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
  .on('message', async (msg: Message) => {
    // Code...
    if (msg.content && msg.content.startsWith('!nsfw') || msg.content.startsWith('!ns')) {
      await msg.reply(msg.content.replace('!nsfw', '').replace('!ns', ''), {
        files: msg.attachments.map(n => ({
          attachment: n.url,
          name: `SPOILER_${n.filename}`
        }))
      });
      msg.delete();
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
