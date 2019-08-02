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
    const joinedSession = await DiscordBet.findOne({
      where: { 
        userId: message.author.id,
        match: args.match
      }
    })

    if (joinedSession) {
      joinedSession.prediction = args.team;
      joinedSession.dateAdded = moment().format("YYYY-MM-DD HH:mm");
      joinedSession.save();
    } else {
      const newBet = new DiscordBet();
      newBet.matchId = args.match;
      newBet.prediction = args.team;
      newBet.amount = args.amount;
      newBet.dateAdded = moment().format("YYYY-MM-DD HH:mm");

      newBet.save();
    }

    return message.reply("Test " + message.author.id);
  }
}
