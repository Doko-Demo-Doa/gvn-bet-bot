import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordMatch } from "../entities/match";
import { DiscordBet } from "../entities/bet";

const stripIndents = require("common-tags").stripIndents;

const WAIT_TIME = 100;

/**
 * Get current user's bet list.
 */
export class BetList extends Command {
  constructor(client) {
    super(client, {
      name: "mybetinfo",
      group: "bet",
      memberName: "mybetinfo",
      description: "Liệt kê các lượt bet của bạn.",
      examples: ["mybetinfo 10"],
      argsPromptLimit: 0,
      defaultHandling: false,
      args: [
        {
          key: "limit",
          default: 10,
          label: "Giới hạn số lượng",
          prompt: "Nhập số lượng các trận bet đang diễn ra và có thể đặt cược.",
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
    const dataset = await DiscordBet.find({
      take: args["limit"],
      order: {
        id: "ASC"
      },
      where: {
        userId: message.author.id
      }
    });
    const resultList = dataset.map(
      n => `
      • Match ID: ${n.matchId}
      • Ngày tham gia: ${n.dateAdded}
      • Team đã đặt: ${n.prediction}
      • Tiền bet: ${n.amount}

      ==================================================`
    );

    const msgHeading = dataset.length > 0 ? stripIndents`** Danh sách các trận bạn tham gia: ** \n` : `Bạn chưa tham gia trận nào.`;

    return message.reply(msgHeading.concat(resultList.join("\n")));
  }
}
