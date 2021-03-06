import { BetCreate } from './bet-create';
import { MatchList } from './match-list';
import { MatchInfo } from './match-info';
import { BetJoin } from './bet-join';
import { BetEnd } from './bet-end';
import { CheckMoney } from './check-money';
import { BetChangeTeam } from './bet-change-team';
import { BetList } from './bet-list';
import { BetLog } from './bet-log-cmd';
import { BetMoneyLog } from './bet-money-log';

module.exports = [
  BetCreate,
  MatchList,
  MatchInfo,
  BetJoin,
  BetEnd,
  CheckMoney,
  BetChangeTeam,
  BetList,
  BetLog,
  BetMoneyLog
]