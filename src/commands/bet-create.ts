import { Command, CommandMessage } from 'discord.js-commando'
import { Message } from 'discord.js';
const stripIndents = require('common-tags').stripIndents;

const WAIT_TIME = 100

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
          key: '-t1',
          label: 'Chọn Team 1',
          prompt: 'Tên team 1?',
          type: 'string',
          wait: WAIT_TIME
        },
        {
          key: '-a1',
          label: 'Chọn tỉ lệ Team 1',
          prompt: 'Tỉ lệ team 1, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'float',
          wait: WAIT_TIME
        },
        {
          key: '-t2',
          label: 'Chọn Team 2',
          prompt: 'Tên team 2?',
          type: 'string',
          wait: WAIT_TIME
        },
        {
          key: '-a2',
          label: 'Chọn tỉ lệ Team 2',
          prompt: 'Tỉ lệ team 2, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'float',
          wait: WAIT_TIME
        }
      ]
    });
  }

  run(message: CommandMessage, args: object | any | string | string[]): Promise<Message | Message[]> {
    console.log(args)
    return message.reply(stripIndents`
			Bet info ** ${args['-t1']} vs ${args['-t2']} ** (ID: 1234)
			**❯ Thông tin trận bet: **
      • Team 1: ${args['-t1']} / Tỉ lệ: ${args['-a1']}
      • Team 2: ${args['-t2']} / Tỉ lệ: ${args['-a2']}
      **❯ Chúc các bet thủ sớm ra đê!!! **
		`);
  }
}
