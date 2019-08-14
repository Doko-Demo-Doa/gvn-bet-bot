import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordMatch } from "../entities/match";
import { DiscordBet } from "../entities/bet";

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

    const results = [...dataset];

    const queue = [];
    results.forEach(async (n) => {
      queue.push(DiscordBet.findOne({
        where: {
          userId: message.author.id,
          matchId: n.id
        }
      }));
    });

    const resp = await Promise.all(queue);
    const data = results.map((n, idx) => {
      const joinedSession = resp[idx];
      const lastLine = joinedSession
      ? `Bạn cược ${
          joinedSession.prediction === 1 ? n.team1Name : n.team2Name
        } win - ${joinedSession.amount}`
      : `Bạn chưa đặt cược trận này.`;

      return `
      Time: **${n.startTime}**
      Match ID: ${n.id}
      Game: ${n.gameName}

      \`\`\`sh
      ${n.team1Name} (x${n.team1Rate}) VS ${n.team2Name} (x${n.team2Rate})
      \`\`\`

      • ${lastLine}

      ========================`
    });      

    const msgHeading = dataset.length > 0 ? stripIndents`
    ** Danh sách các trận hiện có: **`
    : `Chưa có trận bet nào.`;

    return message.reply(msgHeading.concat('\n\n').concat(data.join("\n")));
  }
}
