import { isEmpty } from 'lodash'
import dayjs from 'dayjs'

export function createBet(args: Array<string>) {
  const result: any = {}


  const [team1Name, team1Rate, team2Name, team2Rate, startDate] = args

  console.log(dayjs(startDate, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm'))


  if (!team1Name) {
    result.error = 'Chưa đặt tên cho team 1'
  } else if (!team1Rate || isNaN(parseFloat(team1Rate))) {
    result.error = 'Tỉ lệ team 1 không hợp lệ'
  } else if (!team2Name) {
    result.error = 'Chưa đặt tên cho team 2'
  } else if (!team2Rate || isNaN(parseFloat(team2Rate))) {
    result.error = 'Tỉ lệ team 2 không hợp lệ'
  }
}
