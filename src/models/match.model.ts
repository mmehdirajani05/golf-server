/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';
import { UserMatchPivotModel } from './usermatchpivot.model';
import { NotificationsModel } from './notifications.model';

export enum MatchStatus {
  COMPLETE =  'complete',
  PENDING =  'pending'
}

@Entity({ name: 'match' })
export class MatchModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'title',
  })
  title: string;

  @Column({
    nullable: false,
    name: 'datetime',
  })
  datetime: Date;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'location',
  })
  location: string;

  @Column({
    nullable: false,
    name: 'createdby'
  })
  createdby: number;

  @Column({
    name: 'matchfees',
    nullable: true
  })
  matchfees: number;

  @Column({
    name: 'status',
    nullable: false,
    default: MatchStatus.PENDING
  })
  status: string;

  @OneToMany(() => UserMatchPivotModel, x => x.match)
  matchPivot: UserMatchPivotModel[];

  @OneToMany(() => NotificationsModel, x => x.match)
  notification: NotificationsModel[];

}
