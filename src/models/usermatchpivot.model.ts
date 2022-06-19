/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { MatchModel } from './match.model';
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
  

  // TODO: Status set to pending hard coded, need to resolve this later.
  @Column({
    type: 'enum',
    enum: InviteStatus,
    default: InviteStatus.admitted
  })
  status: InviteStatus;

  @ManyToOne(() => UserModel, emp => emp.matchPivot)
  @JoinColumn({name: "user_id", referencedColumnName: "id"})
  user: UserModel;

  @ManyToOne(() => MatchModel, x => x.matchPivot)
  @JoinColumn({name: "match_id", referencedColumnName: "id"})
  match: MatchModel[];

}
