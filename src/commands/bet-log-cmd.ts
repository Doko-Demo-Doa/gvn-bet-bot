import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordUser } from "../entities/user";
import { DiscordBetLog } from "../entities/bet-log";
import moment = require("moment");

const WAIT_TIME = 100;
const PER_PAGE = 20;

/**
 * Get current user's bet list.
 */
export class BetLog extends Command {
  constructor(client) {
    super(client, {
      name: "betlog",
      group: "bet",
      memberName: "betlog",
      description: "Log lại lượt bet của một ai đó",
      examples: ["betlog Intel"],
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
          default: 1,
          label: "Số thứ tự trang",
          prompt: "Nhập số số thứ tự của trang, mặc định là 1.",
          type: "integer",
          min: 1,
          wait: WAIT_TIME
        }
      ]
    });
  }

  async run(
    message: CommandMessage,
    args: object | DiscordUser | any | string | string[]
  ): Promise<Message | Message[]> {

    const usr = await DiscordUser.findOne({ where: { userId: args.user.id } });
    if (!usr) return message.say("Không tìm được user này.");

    const results = await DiscordBetLog.find({
      where: { user: usr },
      take: PER_PAGE,
      skip: (args.page - 1) * PER_PAGE,
      relations: ['user', 'match']
    });

    if (results.length <= 0) return message.reply('Bạn chưa có lượt bet nào cả, yolo đê đời là mấy.')

    let messageBuilder = '';
    messageBuilder += (`Sau đây là log lượt bet của ${usr.username} : \n\n`);
    results.forEach((n, idx) => {
      messageBuilder += (
        `**[${moment.unix(n.recordDate).format('DD/MM/YYYY HH:mm')}]** [${n.actionType === 0 ? 'Đặt kèo' : 'Đổi team'}] ` +
        `- Đặt cho team ${n.targetTeam}` +
        (n.actionType === 0 ? `- Số tiền: ${n.moneyAmount} 💵 ` : ' ') +
        `- **(${n.match.team1Name} VS ${n.match.team2Name})**` +
        `\n`
      );
    })

    return message.reply(messageBuilder);
  }
}
