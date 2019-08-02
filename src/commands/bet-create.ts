import { Command, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import moment from 'moment';
import { DiscordUser } from '../entities/user';
import { DiscordBet } from '../entities/bet';
import { DiscordMatch } from '../entities/match';

const stripIndents = require('common-tags').stripIndents;

const WAIT_TIME = 100

export class BetCreate extends Command {
  constructor(client) {
    super(client, {
      name: 'createbet',
      group: 'bet',
      memberName: 'createbet',
      argsSingleQuotes: true,
      description: 'Tạo team trong trận bet. Chỉ admin mới được tạo',
      examples: ["createbet -t1 'Vietnam' -a1 0.5 -t2 'Thailand' -a2 0.4 -time \"2019-09-12 20:14\""],
      args: [
        {
          key: 't1',
          label: 'Team 1',
          prompt: 'Tên team 1?',
          type: 'string',
          wait: WAIT_TIME
        },
        {
          key: 'a1',
          label: 'Tỷ lệ Team 1',
          prompt: 'Tỉ lệ team 1, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'float',
          wait: WAIT_TIME
        },
        {
          key: 't2',
          label: 'Team 2',
          prompt: 'Tên team 2?',
          type: 'string',
          wait: WAIT_TIME
        },
        {
          key: 'a2',
          label: 'Tỷ lệ Team 2',
          prompt: 'Tỉ lệ team 2, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'float',
          wait: WAIT_TIME
        },
        {
          key: 'time',
          label: 'Thời điểm bắt đầu',
          prompt: 'Chọn thời điểm bắt đầu của trận đấu. Sau khi trận đấu bắt đầu, không ai có thể đặt bet tiếp.',
          type: 'string',
          validate: (value: moment.MomentInput) => moment(value, 'YYYY-MM-DD HH:mm').isValid(),
          wait: WAIT_TIME + 50
        },
        {
          key: 'g',
          label: 'Game của trận bet',
          prompt: 'Tên game, Có thể đặt tuỳ ý, càng gọn càng tốt. VD: dota, csgo',
          type: 'string',
          wait: WAIT_TIME + 50
        }
      ]
    });
  }

  async run(message: CommandMessage, args: object | any | string | string[]): Promise<Message | Message[]> {
    const m = new DiscordMatch();
    m.team1Name = args['t1'];
    m.team2Name = args['t2'];
    m.team1Rate = args['a1'];
    m.team2Rate = args['a2'];
    m.startTime = args['time'];
    m.gameName = args['g'];

    if (moment().isAfter(moment(args.g, 'YYYY-MM-DD HH:mm'))) {
      return message.reply(`Vui lòng nhập ngày giờ hợp lệ.`);
    }
    
    const mSaved = await m.save();

    return message.reply(stripIndents`
      Thông tin trận: ** ${args['t1']} vs ${args['t2']} ** (ID: ${mSaved.id})
      Trận đấu diễn ra vào: ${args['time']}
			**❯ Thông tin trận bet: ${args['g']}**
      • Team 1: ${args['t1']} / Tỉ lệ: ${args['a1']}
      • Team 2: ${args['t2']} / Tỉ lệ: ${args['a2']}
      **❯ Chúc các bet thủ sớm ra đê!!! **
		`);
  }
}
