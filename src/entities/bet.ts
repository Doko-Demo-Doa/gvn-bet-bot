import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn
} from "typeorm";
import { DiscordMatch } from "./match";
import { DiscordUser } from "./user";

@Entity({ name: "DiscordBet" })
export class DiscordBet {
  @PrimaryGeneratedColumn({ name: "Id" })
  id: number;

  @Column({ name: 'Amount' })
  amount: number;

  team1Won: string;

  @Column({ name: 'DateAdded' })
  dateAdded: string;

  @OneToOne(type => DiscordUser)
  @JoinColumn()
  user: DiscordUser;

  @OneToOne(type => DiscordMatch)
  @JoinColumn()
  match: DiscordMatch;
}
