import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordUser } from "../entities/user";
import { DiscordBetLog } from "../entities/bet-log";
import { DiscordMatch } from "../entities/match";
import moment = require("moment");

const WAIT_TIME = 100;

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
        }
      ]
    });
  }

  async run(
    message: CommandMessage,
    args: object | DiscordUser | any | string | string[]
  ): Promise<Message | Message[]> {
    console.log(args.user.id);

    const usr = await DiscordUser.findOne({ where: { userId: args.user.id } });
    if (!usr) return message.say("Không tìm được user này.");

    const results = await DiscordBetLog.find({
      where: { user: usr }
    });

    let messageBuilder = '';
    messageBuilder += (`Sau đây là log lượt bet của <@${usr.userId}> : \n\n`);
    results.forEach((n, idx) => {
      messageBuilder += (
        `**[${moment.unix(n.recordDate).format('DD/MM/YYYY HH:mm')}]** [${n.actionType === 0 ? 'Đặt kèo' : 'Đổi team'}] ` +
        `- Đặt cho team ${n.targetTeam}` 
      );
    })
    console.log(results);

    return message.reply(messageBuilder);
  }
}
