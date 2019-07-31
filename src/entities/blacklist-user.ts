import { Entity, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from 'typeorm'


@Entity({ name: 'DiscordUser' })
export class DiscordUser extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'Id'})
  id: number;

  @OneToOne(type => DiscordUser)
  @JoinColumn()
  user: DiscordUser;
}
