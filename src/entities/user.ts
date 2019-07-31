import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, PrimaryColumn } from 'typeorm'

@Entity({ name: 'DiscordUser' })
export class DiscordUser extends BaseEntity {
  @PrimaryColumn({ name: 'Id'})
  id: number;

  @Column({ name: 'AvatarId', readonly: true, type: 'text', nullable: true })
  avatarId: string;

  @Column({ name: 'Discriminator', readonly: true })
  discriminator: string;

  @Column({ name: 'UserId', readonly: true })
  userId: number;

  @Column({ name: 'Username' })
  username: string;

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
