import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne, JoinColumn, JoinTable } from "typeorm";
import { DiscordUser } from "./user";
import { DiscordMatch } from "./match";

/**
 * Actual "bet" session.
 */
@Entity({ name: "DiscordBetMoneyLog" })
export class DiscordBetMoneyLog extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "Id" })
  id: number;

  @Column({ name: "MoneyAmount" })
  moneyAmount: number;

  /**
   * 0: Đặt bet
   * 1: Hoàn lại tiền khi hoà
   * 2: Hoàn lại tiền khi thắng
   */
  @Column({ name: "Reason" })
  reason: number;

  @Column({ name: "RecordDate" })
  recordDate: number; // Unix timestamp.

  @JoinColumn({ name: 'DiscordUser' })
  @OneToOne(type => DiscordUser)
  user: DiscordUser;

  @JoinColumn({ name: 'DiscordMatch' })
  @OneToOne(type => DiscordMatch)
  match: DiscordMatch;
}
