import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordMatch } from "../entities/match";

const stripIndents = require("common-tags").stripIndents;

const WAIT_TIME = 100;

export class MatchList extends Command {
  constructor(client) {
    super(client, {
      name: "listbet",
      group: "bet",
      memberName: "listbet",
      description: "Liệt kê các trận bet đang diễn ra.",
      examples: ["listbet -limit 10"],
      args: [
        {
          key: "limit",
          default: 5,
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
    const dataset = await DiscordMatch.find({
      take: args["limit"],
      where: { result: null }
    });
    const resultList = dataset.map(
      n => `
      Trận đấu diễn ra vào: **${n.startTime}**
      **❯ Thông tin: **
      • ID của trận: ${n.id}
      • Team 1: ${n.team1Name} / Tỉ lệ: ${n.team1Rate}
      • Team 2: ${n.team2Name} / Tỉ lệ: ${n.team2Rate}

      ==================================================`
    );

    const msgHeading = stripIndents`** Danh sách các trận đang diễn ra: ** \n`;

    return message.reply(msgHeading.concat(resultList.join("\n")));
  }
}
