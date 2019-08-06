import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordMatch } from "../entities/match";
import { DiscordBet } from "../entities/bet";

const WAIT_TIME = 100;

/**
 * Info for a single match:
 */
export class MatchInfo extends Command {
  constructor(client) {
    super(client, {
      name: "matchinfo",
      group: "bet",
      memberName: "matchinfo",
      description: "Thông tin trận đấu, kèm kèo bet của bạn (nếu có).",
      examples: ["matchinfo 10"],
      argsPromptLimit: 0,
      defaultHandling: false,
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
    let joinedSession = await DiscordBet.findOne({
      where: {
        userId: message.author.id,
        matchId: args.id
      }
    });

    const team1BetCount = await DiscordBet.count({
      where: {
        matchId: args.id,
        prediction: 1
      }
    });

    const team2BetCount = await DiscordBet.count({
      where: {
        matchId: args.id,
        prediction: 2
      }
    });

    if (resp) {
      const lastLine = joinedSession
        ? `Bạn cược ${
            joinedSession.prediction === 1 ? resp.team1Name : resp.team2Name
          } win - ${joinedSession.amount}`
        : `Bạn chưa đặt cược trận này.`;
      return message.reply(
        `
      Trận đấu diễn ra vào: **${resp.startTime}**
        **❯ Thông tin: (ID của trận: ${resp.id})**
        • ${resp.team1Name} (x${resp.team1Rate}) VS ${resp.team2Name} (x${resp.team2Rate})
        • ${lastLine}

        • (${team1BetCount} người đặt cửa ${resp.team1Name}) VS (${team2BetCount} người đặt cửa ${resp.team2Name})
      `
      );
    } else {
      return message.reply(`Không có trận nào có ID là: ${args.id}`);
    }
  }
}
