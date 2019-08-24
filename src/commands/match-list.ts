import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { DiscordMatch } from "../entities/match";
import { DiscordBet } from "../entities/bet";

const stripIndents = require("common-tags").stripIndents;

const WAIT_TIME = 100;
const PER_PAGE = 7;

export class MatchList extends Command {
  constructor(client) {
    super(client, {
      name: "listbet",
      group: "bet",
      memberName: "listbet",
      argsPromptLimit: 0,
      description: "Liệt kê các trận bet đang diễn ra.",
      examples: ["listbet -limit 10"],
      args: [
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
    args: object | any | string | string[]
  ): Promise<Message | Message[]> {
    // Count total match:
    const numberOfMatches = await DiscordMatch.count({
      where: { result: null }
    });

    // Get match list:
    const dataset = await DiscordMatch.find({
      take: PER_PAGE,
      skip: (args.page - 1) * PER_PAGE,
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
      ? `<@${message.author.id}> cược ${joinedSession.prediction === 1 ? n.team1Name : n.team2Name} win - ${joinedSession.amount}`
      : `<@${message.author.id}> chưa đặt cược trận này.`;

      return stripIndents`
      Time: **${n.startTime}**
      Match ID: **${n.id}**
      Game: **${n.gameName}**
      \`\`\`cs
      ${n.team1Name} (x${n.team1Rate}) VS ${n.team2Name} (x${n.team2Rate})\`\`\`
      • ${lastLine}
      ========================`
    });

    const msgHeading = dataset.length > 0 ? stripIndents`
    ** Danh sách các trận hiện có (trang ${args.page} / ${(numberOfMatches / PER_PAGE).toFixed(0)}): **`
    : `Chưa có trận bet nào.`;

    return message.reply(msgHeading.concat('\n\n').concat(data.join("\n")));
  }
}
