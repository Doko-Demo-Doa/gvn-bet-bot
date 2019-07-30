import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity({ name: 'DiscordUser' })
export class DiscordUser {
  @PrimaryGeneratedColumn({ name: 'Id'})
  id: number;

  @Column({ name: 'AvatarId' })
  avatarId: string;

  @Column({ name: 'Discriminator', readonly: true })
  discriminator: string;

  @Column({ name: 'UserId', readonly: true })
  userId: number;

  @Column({ name: 'DateAdded' })
  dateAdded: string;

  @Column({ name: 'Username' })
  username: string;

  @Column({ name: 'ClubId' })
  clubId: number;

  @Column({ name: 'LastLevelUp' })
  lastLevelUp: string;

  @Column({ name: 'NotifyOnLevelUp'})
  notifyOnLevelUp: number;

  @Column({ name: 'LastXpGain'})
  lastXpGain: string;

  @Column({ name: 'TotalXp'})
  totalXp: number;

  @Column({ name: 'IsClubAdmin'})
  isClubAdmin: number;

  @Column({ name: 'CurrencyAmount'})
  currencyAmount: number;
}
