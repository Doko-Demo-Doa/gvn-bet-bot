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
          prompt: 'Chọn team thắng cuộc. Tiền sẽ được cộng cho tất cả những ai đặt cho team này, không thể sửa đổi.',
          type: 'number',
          min: 1,
          max: 2,
          wait: WAIT_TIME
        }
      ]
    });
  }

  async run(message: CommandMessage, args: object | any | string | string[]): Promise<Message | Message[]> {
    const targetMatch = await DiscordMatch.findOne({ where: {
      id: args.match
    }});

    if (!targetMatch) {
      return message.reply(`Không có trận nào có ID = ${args.match} cả.`);
    }
  }
}
