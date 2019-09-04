import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordUser } from "../entities/user";
import { DiscordBetLog } from "../entities/bet-log";
import { DiscordMatch } from "../entities/match";
import moment = require("moment");
import { DiscordBetMoneyLog } from "../entities/bet-money-log";

const WAIT_TIME = 100;

export class BetMoneyLog extends Command {
  constructor(client) {
    super(client, {
      name: "betmoneylog",
      group: "bet",
      memberName: "betmoneylog",
      description: "Xem log tất cả các giao dịch trừ / cộng tiền",
      examples: ["betmoneylog Intel 2"],
      argsPromptLimit: 1,
      args: [
        {
          key: "user",
          label: "Người mà bạn muốn xem log",
          prompt: "Nhập tên người (dạng mention) mà bạn muốn xem log.",
          type: "member",
          wait: WAIT_TIME
        },
        {
          key: "page",
          label: "Số trang",
          prompt: "Nhập số trang mà bạn muốn xem, mặc định 20 bản ghi / trang.",
          type: "integer",
          default: 1,
          wait: WAIT_TIME
        },
      ]
    });
  }

  getProperLabel (reason: number) {
    if (reason === 0) return 'Đặt trận '
    if (reason === 1) return 'Lấy lại tiền hoà trận '
    if (reason === 2) return 'Ăn tiền win trận '
    return 'Đặt trận '
  }

  async run(
    message: CommandMessage,
    args: object | DiscordUser | any | string | string[]
  ): Promise<Message | Message[]> {

    const usr = await DiscordUser.findOne({ where: { userId: args.user.id } });
    if (!usr) return message.say("Không tìm được user này.");

    const results = await DiscordBetMoneyLog.find({
      where: { user: usr },
      relations: ['user', 'match']
    });

    let messageBuilder = '';
    messageBuilder += (`Danh sách log tiền thuế của <@${usr.userId}> : \n\n`);
    results.forEach((n, idx) => {
      messageBuilder += (
        `${n.moneyAmount >= 0 ? '🔵' : '🔴'}` +
        `**[${moment.unix(n.recordDate).format('DD/MM/YYYY HH:mm')}]** ` +
        `- ${this.getProperLabel(n.reason)} **(${n.match.team1Name} VS ${n.match.team2Name} || ID: ${n.match.id})**` +
        (n.moneyAmount > 0 ? ` (+${n.moneyAmount} 💵)` : ` (${n.moneyAmount} 💵)`) +
        `\n`
      );
    });

    return message.reply(messageBuilder);
  }
}
