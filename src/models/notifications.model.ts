/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { MatchModel } from './match.model';

@Entity({ name: 'notifications' })
export class NotificationsModel extends BaseModel {

  @Column({
    nullable: false,
    name: 'match_id',
  })
  match_id: number;

  @Column({
    nullable: false,
    name: 'sender_id'
  })
  sender_id: number;

  @Column({
    nullable: false,
    name: 'recipient_id'
  })
  recipient_id: number;

  @Column({
    type: 'boolean',
    nullable: false,
    name: 'seen',
    default: false
  })
  seen: boolean;

  @Column({
    nullable: true,
    name: 'message'
  })
  message: string;

  @ManyToOne(() => MatchModel, x => x.notification)
  @JoinColumn({name: "match_id", referencedColumnName: "id"})
  match: MatchModel[];

}
