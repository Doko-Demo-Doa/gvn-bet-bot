import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: 'DiscordMatch' })
export class DiscordMatch {
  @PrimaryGeneratedColumn({ name: 'Id'})
  id: number;

  @Column({ name: 'AvatarId' })
  avatarId: string;

  @Column()
  discriminator: string;

  userId: number;

  dateAdded: string;

  username: string;

  clubId: number;

  lastLevelUp: string;

  notifyOnLevelUp: number;

  lastXpGain: string;

  totalXp: number;

  isClubAdmin: number;

  currencyAmount: number;
}
