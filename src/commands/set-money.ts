import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordMatch } from "../entities/match";
import { DiscordBet } from "../entities/bet";
import { DiscordUser } from "../entities/user";

const WAIT_TIME = 100;

/**
 * Info for a single match:
 */
export class SetMoney extends Command {
  constructor(client) {
    super(client, {
      name: "setmoney",
      group: "bet",
      memberName: "setmoney",
      description: "Set tiền cho người gõ. Lệnh này dùng để test.",
      examples: ["setmoney 10"],
      // @ts-ignore
      userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: "money",
          label: "Số tiền",
          prompt: "Nhập số tiền.",
          type: "integer",
          wait: WAIT_TIME
        }
      ]
    });
  }

  async run(
    message: CommandMessage,
    args: object | any | string | string[]
  ): Promise<Message | Message[]> {
    const targetUser = await DiscordUser.findOne({ where: { userId: message.author.id }});
    if (targetUser) {
      targetUser.currencyAmount = args.money;
      targetUser.save();
      return message.reply(`Đã set tiền.`);
    }
  }
}
