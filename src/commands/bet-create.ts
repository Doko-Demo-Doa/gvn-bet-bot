import { Command } from 'discord.js-commando'

export default class MatchCreate extends Command {
  constructor(client) {
    super(client, {
      name: 'user-info',
      aliases: ['betc', '🗒'],
      group: 'bet',
      memberName: 'createbet',
      description: 'Create a match. Can only be used by admins.',
      examples: ['user-info @Crawl#3208', 'user-info Crawl'],
      guildOnly: true,

      args: [
        {
          key: '-t1',
          label: 'Specify Team 1',
          prompt: 'Tên đội thứ nhất?',
          type: 'member'
        },
        {
          key: '-t2',
          label: 'Specify Team 2',
          prompt: 'Tên đội thứ hai?',
          type: 'member'
        }
      ]
    });
  }
}
