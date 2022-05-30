/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';
import { UserModel } from './user.model';

export enum InviteStatus {
  pending = 'pending',
  admitted = 'admitted',
  canceled = 'canceled'
}

@Entity({ name: 'user_match_pivot' })
export class UserMatchPivotModel extends BaseModel {
  @Column({
    nullable: false,
    name: 'match_id',
  })
  match_id: number;

  @Column({
    nullable: false,
    name: 'user_id',
  })
  user_id: number;
  

  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.pending
  })
  status: InviteStatus;

  @ManyToOne(() => UserModel, emp => emp.matchPivot)
  @JoinColumn({name: "user_id", referencedColumnName: "id"})
  user: UserModel;

}
