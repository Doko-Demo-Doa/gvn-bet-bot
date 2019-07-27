const Commando = require('discord.js-commando')
const path = require('path')

const client = new Commando.Client({
  owner: process.env.OWNER,
  commandPrefix: '!gvn'
})

/**
 * All Discord events are listed here:
 */
client
  .on('ready', () => console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`))
  .on('message', (msg: any) => {
    // console.log(msg)
  })

client.registry
  .registerGroup('bet', 'Bet commands')
  .registerDefaults()
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'));

// Start the client:
client.login(process.env.DISCORD_TOKEN)
