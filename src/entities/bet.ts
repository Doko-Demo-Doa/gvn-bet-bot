import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  BaseEntity
} from "typeorm";
import { DiscordMatch } from "./match";
import { DiscordUser } from "./user";

@Entity({ name: "DiscordBet" })
export class DiscordBet extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "Id" })
  id: number;

  @Column({ name: 'Amount' })
  amount: number;

  /**
   * Prediction of the match:
   * 1: Team 1 wins.
   * 2: Team 2 wins.
   */
  @Column({ name: 'Prediction' })
  prediction: number;

  @Column({ name: 'DateAdded' })
  dateAdded: string;

  @OneToOne(type => DiscordUser)
  @JoinColumn()
  user: DiscordUser;

  @OneToOne(type => DiscordMatch)
  @JoinColumn()
  match: DiscordMatch;
}
