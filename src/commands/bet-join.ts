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
      examples: ["joinbet 1 1200"],
      args: [
        {
          key: "team",
          label: "Chọn team đặt cược",
          prompt: "Nhập team mà bạn muốn đặt cược.",
          min: 1,
          max: 2,
          type: "integer"
        },
        {
          key: "amount",
          label: "Nhập số xèng mà bạn muốn đặt.",
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
    const dataset = await DiscordMatch.find({
      take: args["limit"],
      where: { result: null }
    });
    const resultList = dataset.map(
      n => `
      Trận đấu diễn ra vào: **${n.startTime}**
      **❯ Thông tin: **
      • Team 1: ${n.team1Name} / Tỉ lệ: ${n.team1Rate}
      • Team 2: ${n.team2Name} / Tỉ lệ: ${n.team2Rate}

      ==================================================`
    );

    const msgHeading = stripIndents`** Danh sách các trận đang diễn ra: ** \n`;

    return message.reply(msgHeading.concat(resultList.join("\n")));
  }
}
