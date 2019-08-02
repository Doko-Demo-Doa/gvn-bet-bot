import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
import moment from "moment";
import { DiscordUser } from "../entities/user";
import { DiscordBet } from "../entities/bet";
import { DiscordMatch } from "../entities/match";

const stripIndents = require("common-tags").stripIndents;

const WAIT_TIME = 100;

export class BetJoin extends Command {
  constructor(client) {
    super(client, {
      name: "joinbet",
      group: "bet",
      memberName: "joinbet",
      description: "Tham gia vào một trận bet. Phải có đủ tiền mới tham gia được.",
      examples: ["joinbet 23 1 1200"],
      args: [
        {
          key: "match",
          label: "ID trận đấu",
          prompt: "Nhập ID của trận đấu muốn cược",
          type: "integer"
        },
        {
          key: "team",
          label: "Team đặt cược",
          prompt: "Nhập team mà bạn muốn đặt cược.",
          min: 1,
          max: 2,
          type: "integer"
        },
        {
          key: "amount",
          label: "Số tiền muốn đặt",
          prompt: "Vui lòng nhập số tiền mà bạn muốn đặt. Tối thiểu là 1000.",
          default: 0,
          min: 1000,
          type: "integer"
        },
      ]
    });
  }

  async run(
    message: CommandMessage,
    args: object | any | string | string[]
  ): Promise<Message | Message[]> {
    const targetMatch = await DiscordMatch.findOne({ where: {
      id: args.match
    }})

    if (!targetMatch) {
      return message.reply(`Không có trận nào có ID = ${args.match} cả.`);
    }
    let joinedSession = await DiscordBet.findOne({
      where: { 
        userId: message.author.id,
        match: args.match
      }
    })

    console.log(joinedSession);

    if (joinedSession) {
      // Editing a joined session.
      joinedSession.prediction = args.team;
      joinedSession.dateAdded = moment().format("YYYY-MM-DD HH:mm");
      joinedSession.save();

      return message.reply(stripIndents`
      Bạn vừa thay đổi cửa đặt cho trận sau:
      Thông tin trận: ** ${targetMatch.team1Name} vs ${targetMatch.team2Name} ** (ID: ${targetMatch.id})
      Trận đấu diễn ra vào: ${targetMatch.startTime}
			**❯ Thông tin trận bet: ${targetMatch.gameName}**
      • Team 1: ${targetMatch.team1Name} / Tỉ lệ: ${targetMatch.team1Rate}
      • Team 2: ${targetMatch.team2Name} / Tỉ lệ: ${targetMatch.team2Rate}
      **❯ Bạn đặt lại cho cửa team: ${args.team} **
		`);
    } else {
      // Create entirely new entry, money will be charged immediately.
      const targetUser = await DiscordUser.findOne({
        where: {
          userId: message.author.id
        }
      })
      if (!targetUser) {
        return message.reply(`Có lỗi xảy ra, vui lòng báo cho Intel để giải quyết. Tiền ko trừ đâu yên tâm.`);
      }
      if (targetUser.currencyAmount < args.amount) {
        return message.reply(`Số tiền đặt cược không thể lớn hơn số vốn bạn đang có.`);
      }
      const newBet = new DiscordBet();
      newBet.matchId = args.match;
      newBet.prediction = args.team;
      newBet.amount = args.amount;
      newBet.userId = message.author.id;
      newBet.dateAdded = moment().format("YYYY-MM-DD HH:mm");

      newBet.save();
    }

    return message.reply("Test " + message.author.id);
  }
}
