import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'DiscordMatch' })
export class DiscordMatch {
  @PrimaryGeneratedColumn({ name: 'Id'})
  id: number;

  @Column({ name: 'Team1Name' })
  team1Name: string;

  @Column()
  team1Rate: string;

  @Column({ name: 'Team2Name' })
  team2Name: string;

  @Column()
  team2Rate: string;

  @Column()
  startDate: Date;
}
