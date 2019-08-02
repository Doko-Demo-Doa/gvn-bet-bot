import { Command, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import moment from 'moment';
import { DiscordUser } from '../entities/user';
import { DiscordBet } from '../entities/bet';
import { DiscordMatch } from '../entities/match';
import { client } from '../app-loader';

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
          type: 'integer',
          wait: WAIT_TIME
        },
        {
          key: 'winner',
          label: 'Team thắng cuộc.',
          prompt: 'Chọn team thắng cuộc. Tiền sẽ được cộng cho tất cả những ai đặt cho team này, không thể sửa đổi.',
          type: 'integer',
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
      return message.reply(`Không có trận nào có ID = ${args.id} cả.`);
    }

    // Set result for the match.
    targetMatch.result = args.winner;

    const betSessions = await DiscordBet.find({
      where: { matchId: targetMatch.id }
    });

    const totalCount = betSessions.length;
    let winnersCount = 0;

    if (betSessions.length > 0) {
      const winners = betSessions.filter(n => n.prediction === args.winner);
      winnersCount = winners.length;

      // Only winners get the prize:
      winners.forEach(async session => {
        const linkedUser = await DiscordUser.findOne({ where: {
          userId: session.userId
        }});

        const addedAmount = Math.ceil(session.amount * (session.amount + (args.winner === 1 ? targetMatch.team1Rate : targetMatch.team2Rate)));
        linkedUser.currencyAmount = addedAmount;
        linkedUser.save();

        const dUserToSend = client.client.fetchUser(linkedUser.userId);
        dUserToSend.send(`Xin chào, bạn đã thắng trận bet có mã ${targetMatch.id}.
        Số tiền bạn được cộng thêm là ${addedAmount}`)
      });

      return message.reply(`Đã đóng trận bet, trận này có ${winnersCount} bet thủ về bờ và ${totalCount - winnersCount} bet thủ ra đê.`);
    } else {
      return message.reply(`Đã đóng trận bet, trận này không có ai đặt cửa.`);
    }
  }
}
