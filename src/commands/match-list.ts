import { Command, CommandMessage } from "discord.js-commando";
import { Message, RichEmbed } from "discord.js";
import { DiscordMatch } from "../entities/match";
import { DiscordBet } from "../entities/bet";

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
          default: 4,
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
    // Get match list:
    const dataset = await DiscordMatch.find({
      take: args["limit"],
      where: { result: null }
    });

    const results = [...dataset];

    const queue = [];
    results.forEach(async n => {
      queue.push(
        DiscordBet.findOne({
          where: {
            userId: message.author.id,
            matchId: n.id
          }
        })
      );
    });

    const resp = await Promise.all(queue);

    let ed = new RichEmbed()
      .setColor("#E88094")
      .setTitle("Danh sách các trận bet:")
      .setDescription(dataset.length > 0 ? `Để liệt kê thêm kết quả, vui lòng thêm số sau lệnh .listbet` : `Chưa có trận bet nào.`)
      .addBlankField();

    results.forEach((n, idx) => {
      ed.addField("Diễn ra ngày", n.startTime, true);
      ed.addField("Match ID", n.id, true);
      ed.addField("Game", n.gameName, true);
      ed.addField(n.team1Name, `Tỉ lệ: ${n.team1Rate}`, true);
      ed.addField("VS", ".", true);
      ed.addField(n.team2Name, `Tỉ lệ: ${n.team2Rate}`, true);

      const joinedSession = resp[idx];
      ed.addField(
        "Tình trạng bet:",
        joinedSession
          ? `<@${message.author.id}> cược ${
              joinedSession.prediction === 1 ? n.team1Name : n.team2Name
            } win - ${joinedSession.amount}`
          : `<@${message.author.id}> chưa đặt cược trận này.`
      );
      ed.addBlankField();
    });

    return message.channel.send(ed);
  }
}
