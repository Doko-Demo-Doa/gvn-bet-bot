import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'DiscordUser' })
export class DiscordUser {
  @PrimaryGeneratedColumn({ name: 'Id'})
  id: number;

  @Column({ name: 'AvatarId' })
  avatarId: string;

  @Column({ name: 'Discriminator' })
  discriminator: string;

  @Column({ name: 'UserId' })
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
