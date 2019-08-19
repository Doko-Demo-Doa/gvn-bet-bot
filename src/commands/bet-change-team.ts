import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import moment from "moment";
import { DiscordUser } from "../entities/user";
import { DiscordBet } from "../entities/bet";
import { DiscordMatch } from "../entities/match";

const stripIndents = require("common-tags").stripIndents;

const WAIT_TIME = 100;

export class BetChangeTeam extends Command {
  constructor(client) {
    super(client, {
      name: "changeteam",
      group: "bet",
      memberName: "changeteam",
      defaultHandling: true,
      description:
        "Tham gia vào một trận bet. Phải có đủ tiền mới tham gia được.",
      examples: ["changeteam 23 1"],
      args: [
        {
          key: "match",
          label: "ID trận đấu",
          prompt: "Nhập ID của trận đấu muốn đổi",
          type: "integer"
        }
      ]
    });
  }

  async run(
    message: CommandMessage,
    args: object | any | string | string[]
  ): Promise<Message | Message[]> {
    try {
      const targetMatch = await DiscordMatch.findOne({
        where: {
          id: args.match
        }
      });

      if (!targetMatch) {
        return message.reply(`Không có trận nào có ID = ${args.match} cả.`);
      }

      if (targetMatch.result) {
        return message.reply(`Trận này đã kết thúc, không thể đổi được.`);
      }

      if (moment().isAfter(moment(targetMatch.startTime, 'YYYY-MM-DD HH:mm'))) {
        return message.reply(`Trận đấu đã bắt đầu, không thể bet hoặc đổi kèo.`);
      }

      let joinedSession = await DiscordBet.findOne({
        where: {
          userId: message.author.id,
          matchId: args.match
        }
      });

      if (joinedSession) {
        // Editing a joined session.
        joinedSession.prediction = (joinedSession.prediction === 1) ? 2 : 1;
        joinedSession.dateAdded = moment().format("YYYY-MM-DD HH:mm");
        joinedSession.save();

        return message.reply(stripIndents`
        Bạn vừa thay đổi cửa đặt cho trận sau:
        Thông tin trận: ** ${targetMatch.team1Name} vs ${targetMatch.team2Name} ** (ID: ${targetMatch.id})
        Trận đấu diễn ra vào: ${targetMatch.startTime}
        **❯ Thông tin trận bet: ${targetMatch.gameName}**
        
        • ${targetMatch.team1Name} (x${targetMatch.team1Rate}) VS ${targetMatch.team2Name} (x${targetMatch.team2Rate})

        **❯ Bạn đặt lại cho cửa team: ${joinedSession.prediction} **
      `);
      } else {
        return message.reply(`Bạn chưa join kèo này, dùng lệnh \`.joinbet\` để tham gia`)
      }
    } catch (_) {
      return message.reply("Có lỗi xảy ra, bot có thể đang bị quá tải ư ư ư");
    }
  }
}
