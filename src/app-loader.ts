const Discord = require('discord.js')

const Commando = require('discord.js-commando')
const client = new Commando.Client({
  owner: process.env.OWNER,
  commandPrefix: 'gvn'
})

/**
 * All Discord events are listed here:
 */
client
  .on('ready', () => console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`))
  .on('message', (msg: any) => console.log(msg))

client.login(process.env.DISCORD_TOKEN)
