import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';
import { Message, RichEmbed } from 'discord.js';
import { DiscordMatch } from '../entities/match';

const stripIndents = require('common-tags').stripIndents;
const schedule = require('node-schedule');

const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Ho_Chi_Minh");

const WAIT_TIME = 100

export class BetCreate extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: 'createbet',
      group: 'bet',
      memberName: 'createbet',
      argsSingleQuotes: true,
      argsPromptLimit: 0,
      description: 'Tạo team trong trận bet. Chỉ admin mới được tạo',
      examples: ["createbet 'Vietnam' 0.5 'Thailand' 0.4 \'2019-09-12 20:14\' Dota"],
      // @ts-ignore
			userPermissions: ['ADMINISTRATOR'],
      args: [
        {
          key: 't1',
          label: 'Team 1',
          prompt: 'Tên team 1?',
          type: 'string',
          wait: WAIT_TIME
        },
        {
          key: 'a1',
          label: 'Tỷ lệ Team 1',
          prompt: 'Tỉ lệ team 1, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'float',
          wait: WAIT_TIME
        },
        {
          key: 't2',
          label: 'Team 2',
          prompt: 'Tên team 2?',
          type: 'string',
          wait: WAIT_TIME
        },
        {
          key: 'a2',
          label: 'Tỷ lệ Team 2',
          prompt: 'Tỉ lệ team 2, số tiền thắng sẽ bằng số tiền cược nhân với tỉ lệ này',
          type: 'float',
          wait: WAIT_TIME
        },
        {
          key: 'time',
          label: 'Thời điểm bắt đầu',
          prompt: 'Chọn thời điểm bắt đầu của trận đấu. Sau khi trận đấu bắt đầu, không ai có thể đặt bet tiếp.',
          type: 'string',
          validate: (value: string) => value.length === 16 && moment(value, 'YYYY-MM-DD HH:mm').isValid(),
          wait: WAIT_TIME + 50
        },
        {
          key: 'g',
          label: 'Game của trận bet',
          prompt: 'Tên game, Có thể đặt tuỳ ý, càng gọn càng tốt. VD: dota, csgo',
          type: 'string',
          wait: WAIT_TIME + 50
        },
        {
          key: 'tname',
          label: 'Tên giải',
          prompt: 'Tên giải, Có thể đặt tuỳ ý.',
          type: 'string',
          wait: WAIT_TIME + 50
        }
      ]
    });
  }

  hasPermission

  async run(message: CommandMessage, args: object | any | string | string[]): Promise<Message | Message[]> {
    const m = new DiscordMatch();
    m.team1Name = args['t1'];
    m.team2Name = args['t2'];
    m.team1Rate = args['a1'];
    m.team2Rate = args['a2'];
    m.startTime = args['time'];
    m.gameName = args['g'];
    m.tournamentName = args['tname'];

    const time = moment(args.time, 'YYYY-MM-DD HH:mm')

    if (moment().isAfter(time)) {
      return message.reply(`Vui lòng nhập ngày giờ hợp lệ.`);
    }

    const mSaved = await m.save();

    const embedData = new RichEmbed()
      .setColor("#127AB8")
      .setTitle(`Thông tin trận - ID: ${mSaved.id}`)
      .setTimestamp()
      .addField("Diễn ra ngày", mSaved.startTime, true)
      .addField("Game", mSaved.gameName, true)
      .addField("Giải", mSaved.tournamentName, true)
      .addBlankField()
      .addField(mSaved.team1Name, `Tỉ lệ: ${mSaved.team1Rate}`, true)
      .addField("VS", ".", true)
      .addField(mSaved.team2Name, `Tỉ lệ: ${mSaved.team2Rate}`, true)
      .addBlankField();

    const genMessage = <any>await message.channel.send(embedData);

    const scheduled = schedule.scheduleJob(time.toDate(), async () => {
      const newEmbedData = embedData;
      newEmbedData.setTitle(`Trận đấu đã bắt đầu, thông tin trận - ID: ${mSaved.id}`);
      const newMsg = <any>await message.channel.send(newEmbedData);

      newMsg.pin();
      scheduled.cancel();
    });

    return genMessage;
  }
}
