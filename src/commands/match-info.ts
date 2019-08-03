import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordMatch } from "../entities/match";

const WAIT_TIME = 100;

export class MatchInfo extends Command {
  constructor(client) {
    super(client, {
      name: "matchinfo",
      group: "bet",
      memberName: "matchinfo",
      description: "Thông tin trận đấu, kèm kèo bet của bạn (nếu có).",
      examples: ["matchinfo 10"],
      args: [
        {
          key: "id",
          label: "ID trận bet",
          prompt: "Nhập ID của trận bet.",
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

    const resp = await DiscordMatch.findOne({ where: { id: args.id } });
    if (resp) {
      return message.reply(
        `
      Trận đấu diễn ra vào: **${resp.startTime}**
      **❯ Thông tin: **
      • Team 1: ${resp.team1Name} / Tỉ lệ: ${resp.team1Rate}
      • Team 2: ${resp.team2Name} / Tỉ lệ: ${resp.team2Rate}
      ==================================================`
      );
    }
  }
}
