import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

/**
 * Actual "bet" session.
 */
@Entity({ name: "DiscordBet" })
export class DiscordBet extends BaseEntity {
  @PrimaryGeneratedColumn({ name: "Id" })
  id: number;

  @Column({ name: "Amount" })
  amount: number;

  /**
   * Prediction of the match:
   * 1: Team 1 wins.
   * 2: Team 2 wins.
   */
  @Column({ name: "Prediction" })
  prediction: number;

  /**
   * -1: Lose
   * 0: Draw
   * 1: Win
   */
  @Column({ name: "Result" })
  result: number;

  @Column({ name: "DateAdded" })
  dateAdded: string;

  @Column({ name: "UserId" })
  userId: string;

  @Column({ name: "MatchId" })
  matchId: string;
}
