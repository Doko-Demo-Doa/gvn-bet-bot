import { Command, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import moment from 'moment';
import { DiscordUser } from '../entities/user';
import { DiscordBet } from '../entities/bet';
import { DiscordMatch } from '../entities/match';

const stripIndents = require('common-tags').stripIndents;

const WAIT_TIME = 100

/**
 * End the bet and gives money to all winners.
 */
export class BetEnd extends Command {
  constructor(client) {
    super(client, {
      name: 'endbet',
      group: 'bet',
      memberName: 'endbet',
      argsSingleQuotes: true,
      description: 'Kết thúc trận bet và trả tiền cho tất cả những người thắng cuộc.',
      examples: ["endbet 12 1"],
      args: [
        {
          key: 'id',
          label: 'Match ID',
          prompt: 'ID của trận đấu?',
          type: 'number',
          wait: WAIT_TIME
        },
        {
          key: 'team',
          label: 'Team thắng cuộc.',
          prompt: 'Tỉ lệ team 1, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'float',
          wait: WAIT_TIME
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
