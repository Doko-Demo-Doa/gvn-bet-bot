import { Command, CommandMessage } from "discord.js-commando";
import { Message } from "discord.js";
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
    const user = await DiscordUser.findOne({ where: {
      userId: message.author.id
    }});

    return message.say(`
    Time: 2019-08-13 03:00
    Match ID: 5
    Game: Rainbow6

    >>> Test
    `);
  }
}
