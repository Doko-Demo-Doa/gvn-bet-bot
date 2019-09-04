import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, JoinTable } from "typeorm";
import { DiscordUser } from "./user";
import { DiscordMatch } from "./match";

/**
 * Actual "bet" session.
 */
@Entity({ name: "DiscordBetLog" })
export class DiscordBetLog extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "Id" })
  id: number;

  /**
   * 0 = đặt kèo, 1 = change team.
   */
  @Column({ name: "ActionType" })
  actionType: number;

  @Column({ name: "TargetTeam" })
  targetTeam: number;

  @Column({ name: "MoneyAmount" })
  moneyAmount: number;

  @Column({ name: "RecordDate" })
  recordDate: number; // Unix timestamp.

  @JoinColumn({ name: 'DiscordUser' })
  @OneToOne(type => DiscordUser)
  user: DiscordUser;

  @JoinColumn({ name: 'DiscordMatch' })
  @OneToOne(type => DiscordMatch)
  match: DiscordMatch;
}
