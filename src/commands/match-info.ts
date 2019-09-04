import { Command, CommandMessage } from "discord.js-commando";
import { Message, RichEmbed } from "discord.js";
import { DiscordMatch } from "../entities/match";
import { DiscordBet } from "../entities/bet";

const stripIndents = require("common-tags").stripIndents;

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
      const embedData = new RichEmbed()
        .setColor("#77B019")
        .setTitle(`Thông tin trận - ID: ${resp.id}`)
        .setTimestamp()
        .addField("Diễn ra ngày", resp.startTime, true)
        .addField("Giải", resp.tournamentName, true)
        .addField("Game", resp.gameName, true)
        .addBlankField()
        .addField(resp.team1Name, `Tỉ lệ: ${resp.team1Rate} | ${team1BetCount} join`, true)
        .addField("VS", ".", true)
        .addField(resp.team2Name, `Tỉ lệ: ${resp.team2Rate} | ${team2BetCount} join`, true)
        .addBlankField();

      if (joinedSession) {
        embedData.addField('Tình trạng bet:',  `Bạn cược ${
          joinedSession.prediction === 1 ? resp.team1Name : resp.team2Name
        } win - ${joinedSession.amount} 💵`);
      } else {
        embedData.addField('Tình trạng bet:', `Bạn chưa đặt cược trận này.`);
      }

      return message.channel.send(embedData);
    } else {
      return message.channel.send(`Không có trận nào có ID là: ${args.id}`);
    }
  }
}
