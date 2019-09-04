import { Command, CommandMessage } from 'discord.js-commando';
import { Message } from 'discord.js';
import moment from 'moment';
import { DiscordUser } from '../entities/user';
import { DiscordBet } from '../entities/bet';
import { DiscordMatch } from '../entities/match';
import { client } from '../app-loader';
import { DiscordBetMoneyLog } from '../entities/bet-money-log';

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
      argsPromptLimit: 0,
      // @ts-ignore
			userPermissions: ['ADMINISTRATOR'],
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
          min: 0,
          max: 2,
          wait: WAIT_TIME
        }
      ]
    });
  }

  async run(message: CommandMessage, args: object | any | string | string[]): Promise<Message | Message[]> {
    const targetMatch = await DiscordMatch.findOne({ where: {
      id: args.id
    }});

    if (!targetMatch) {
      return message.reply(`Không có trận nào có ID = ${args.id} cả.`);
    }

    if (targetMatch.result) {
      return message.reply(`Trận này đã kết thúc, không thể thao tác thêm.`);
    }

    // Set result for the match.
    targetMatch.result = args.winner;
    targetMatch.save();

    const betSessions = await DiscordBet.find({
      where: { matchId: targetMatch.id }
    });

    const totalCount = betSessions.length;
    let winnersCount = 0;

    if (betSessions.length > 0) {
      // If tie, chargeback money:
      if (args.winner === 0) {
        betSessions.forEach(async session => {
          const linkedUser = await DiscordUser.findOne({ where: {
            userId: session.userId
          }});

          session.result = 0; // Set kết quả hoà.
          session.save();
  
          const addedAmount = session.amount;
          linkedUser.currencyAmount = linkedUser.currencyAmount + addedAmount;
          linkedUser.save();

            // Đặt log tiền:
          const nMoneyLog = new DiscordBetMoneyLog();
          nMoneyLog.moneyAmount = addedAmount; // Cộng tiền
          nMoneyLog.recordDate = moment().unix();
          nMoneyLog.reason = 1;
          nMoneyLog.user = linkedUser;
          nMoneyLog.match = targetMatch;
          nMoneyLog.save();
  
          const dUserToSend = await client.fetchUser(linkedUser.userId);
          dUserToSend.send(`Xin chào, trận đấu kết quả hoà, bạn được trả lại: ${addedAmount} 💵`);
        });

        
        return message.say('Trận đấu hoà!');
      }

      // If there is winner, add money to winners
      const winners = betSessions.filter(n => n.prediction === args.winner);

      const losers = betSessions.filter(n => n.prediction !== args.winner);
      losers.forEach(s => {
        s.result = -1;
        s.save();
      })

      winnersCount = winners.length;

      // Only winners get the prize:
      winners.forEach(async session => {
        const linkedUser = await DiscordUser.findOne({ where: {
          userId: session.userId
        }});

        session.result = 1;
        session.save();

        const addedAmount = Math.ceil(session.amount * (args.winner === 1 ? targetMatch.team1Rate : targetMatch.team2Rate));
        linkedUser.currencyAmount = linkedUser.currencyAmount + addedAmount;
        linkedUser.save();

        // Đặt log tiền:
        const nMoneyLog = new DiscordBetMoneyLog();
        nMoneyLog.moneyAmount = addedAmount; // Cộng tiền
        nMoneyLog.recordDate = moment().unix();
        nMoneyLog.reason = 2;
        nMoneyLog.user = linkedUser;
        nMoneyLog.match = targetMatch;
        nMoneyLog.save();

        const dUserToSend = await client.fetchUser(linkedUser.userId);
        dUserToSend.send(`Xin chào, bạn đã thắng trận bet có mã là: ${targetMatch.id}. Số tiền bạn được cộng thêm là ${addedAmount} 💵`);
      });

      return message.reply(`Đã đóng trận bet, trận này có ${winnersCount} bet thủ về bờ và ${totalCount - winnersCount} bet thủ ra đê.`);
    } else {
      return message.reply(`Đã đóng trận bet, trận này không có ai đặt cửa.`);
    }
  }
}
