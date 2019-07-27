const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!')
  }

  axios.get('https://api.github.com/users/github')
    .then(r => console.log(r.data))
    .catch(e => console.log(e))
})

client.login(process.env.DISCORD_TOKEN)
