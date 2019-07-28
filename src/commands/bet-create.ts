import { Command, CommandMessage } from 'discord.js-commando'
import { Message } from 'discord.js';

export class BetCreate extends Command {
  constructor(client) {
    super(client, {
      name: 'createbet',
      group: 'bet',
      memberName: 'createbet',
      description: 'Tạo team trong trận bet. Chỉ admin mới được tạo',
      examples: ["createbet -t1 'Vietnam' -a1 0.5 -t2 'Thailand' -a2 0.4"],
      args: [
        {
          key: 't1',
          label: 'Chọn Team 1',
          prompt: 'Tên team 1?',
          type: 'member'
        },
        {
          key: 'a1',
          label: 'Chọn tỉ lệ Team 1',
          prompt: 'Tỉ lệ team 1, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'member'
        },
        {
          key: 't2',
          label: 'Chọn Team 2',
          prompt: 'Tên team 2?',
          type: 'member'
        },
        {
          key: 'a2',
          label: 'Chọn tỉ lệ Team 2',
          prompt: 'Tỉ lệ team 2, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'member'
        }
      ]
    });
  }

  run(message: CommandMessage, args: object | string | string[]): Promise<Message | Message[]> {
    return message.reply(`Test`)
  }
}
