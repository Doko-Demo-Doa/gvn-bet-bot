import { Command, CommandMessage } from "discord.js-commando";
import { Message, RichEmbed } from "discord.js";
import { DiscordUser } from "../entities/user";

export class CheckMoney extends Command {
  constructor(client) {
    super(client, {
      name: "checkmoney",
      group: "bet",
      memberName: "checkmoney",
      description: "Kiểm tra số tiền đang có.",
      examples: ["checkmoney"]
    });
  }

  async run(
    message: CommandMessage,
    args: object | any | string | string[]
  ): Promise<Message | Message[]> {
    const user = await DiscordUser.findOne({
      where: {
        userId: message.author.id
      }
    });

    const embedData = new RichEmbed()
      .setColor("#77B019")
      .setTitle("Thông tin trận:")
      .addBlankField()
      .addField("Diễn ra ngày", "2019-08-21", true)
      .addField("Match ID", "1234", true)
      .addField("Game", "Dota 2", true)
      .addBlankField()
      .addField("Pow", "Tỉ lệ: 0.4 \n 0 join", true)
      .addField("VS", "-", true)
      .addField("Intel", "Tỉ lệ: 0.3 \n 0 join", true)

    return message.channel.send(embedData);
  }
}
