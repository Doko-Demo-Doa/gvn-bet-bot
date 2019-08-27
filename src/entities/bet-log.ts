import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn } from "typeorm";
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
   * Prediction of the match:
   * 1: Team 1 wins.
   * 2: Team 2 wins.
   */
  @Column({ name: "ActionType" })
  actionType: number; // 0 = đặt kèo, 1 = change team.

  @Column({ name: "RecordDate" })
  recordDate: number; // Unix timestamp.

  @JoinColumn()
  @OneToOne(type => DiscordUser)
  user: DiscordUser;

  @JoinColumn()
  @OneToOne(type => DiscordMatch)
  match: DiscordMatch;
}
