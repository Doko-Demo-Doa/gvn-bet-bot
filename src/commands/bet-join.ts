import { Command, CommandMessage } from "discord.js-commando";
import { Message, User, RichEmbed } from "discord.js";
import moment from "moment";
import { DiscordUser } from "../entities/user";
import { DiscordBet } from "../entities/bet";
import { DiscordMatch } from "../entities/match";

export class BetJoin extends Command {
  constructor(client) {
    super(client, {
      name: "joinbet",
      group: "bet",
      memberName: "joinbet",
      description:
        "Tham gia vào một trận bet. Phải có đủ tiền mới tham gia được.",
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
          prompt: "Nhập team mà bạn muốn đặt cược. Để biết tên team vui lòng dùng lệnh `matchinfo`",
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
        return message.reply(`Trận này đã kết thúc, không thể bet được.`);
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

      console.log(joinedSession);

      if (joinedSession) {
        return message.reply(`Bạn đã vào kèo này rồi, dùng lệnh changeteam để đổi kèo.`)
      } else {
        // Create entirely new entry, money will be charged immediately.
        const targetUser = await DiscordUser.findOne({
          where: {
            userId: message.author.id
          }
        });
        if (!targetUser) {
          return message.reply(
            `Có lỗi xảy ra, vui lòng báo cho Intel để giải quyết. Tiền ko trừ đâu yên tâm.`
          );
        }
        if (targetUser.currencyAmount < args.amount) {
          return message.reply(`Số tiền đặt cược không thể lớn hơn số vốn bạn đang có.
          Bạn hiện đang có ${targetUser.currencyAmount}`);
        }
        // Actually create that:
        const newBet = new DiscordBet();
        newBet.matchId = args.match;
        newBet.prediction = args.team;
        newBet.amount = args.amount;
        newBet.userId = message.author.id;
        newBet.dateAdded = moment().format("YYYY-MM-DD HH:mm");

        await newBet.save();

        targetUser.currencyAmount = targetUser.currencyAmount - args.amount;

        await targetUser.save();

        const ed = new RichEmbed()
          .setColor('#FB8E02')
          .setTitle(`${message.author.username}, Bạn vừa đặt cửa cho trận sau:`)
          .setDescription('Vui lòng chú ý thời gian trận đấu bắt đầu')
          .addBlankField()
          .addField("Diễn ra ngày", targetMatch.startTime, true)
          .addField("Match ID", targetMatch.id, true)
          .addField("Game", targetMatch.gameName, true)
          .addField(targetMatch.team1Name, `Tỉ lệ: ${targetMatch.team1Rate}`, true)
          .addField("VS", ".", true)
          .addField(targetMatch.team2Name, `Tỉ lệ: ${targetMatch.team2Rate}`, true)
          .addBlankField()
          .addField('Bạn đã cược:', (newBet.prediction === 1 ? targetMatch.team1Name : targetMatch.team2Name) + ' win, số tiền cược: ' + `${newBet.amount} 💵`)
          .addField('Số vốn hiện có:', `${targetUser.currencyAmount} 💵`);

        return message.channel.send(ed);
      }
    } catch (_) {
      return message.reply("Có lỗi xảy ra, bot có thể đang bị quá tải ư ư ư");
    }
  }
}
