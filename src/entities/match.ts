import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity('DiscordMatch')
export class DiscordMatch extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "Id" })
  id: number;

  @Column({ name: "Team1Name", nullable: false })
  team1Name: string;

  @Column({ name: "Team1Rate", nullable: false })
  team1Rate: number;

  @Column({ name: "Team2Name", nullable: false })
  team2Name: string;

  @Column({ name: 'Team2Rate', nullable: false })
  team2Rate: number;

  /**
   * Prediction of the match:
   * 1: Team 1 wins.
   * 2: Team 2 wins.
   */
  @Column({ name: "Result", nullable: true })
  result: number;

  /**
   * Users cannot join after this date.
   * Will be calculated using dayjs.
   */
  @Column({ name: "StartTime", nullable: false })
  startTime: string;

  @Column({ name: "GameName", nullable: true })
  gameName: string;

  @Column({ name: "TournamentName", nullable: true })
  tournamentName: string;
}
