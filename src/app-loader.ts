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

client.login('NTk2MDIyMjk0NTgxNjA4NjEz.XTw0Mw.SdYIuimjyEsUcm2OY9v38Q3T6JA')
