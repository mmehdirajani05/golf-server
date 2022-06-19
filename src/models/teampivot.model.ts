/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';
import { UserModel } from './user.model';
import { userInfo } from 'os';

@Entity({ name: 'team_pivot' })
export class TeamPivotModel extends BaseModel {

  @Column({
    nullable: false,
    name: 'team_id',
  })
  team_id: number;

  @Column({
    nullable: false,
    name: 'user_id',
  })
  user_id: number;

  @Column({
    nullable: false,
    name: 'match_id',
  })
  match_id: number;

  @ManyToOne(() => UserModel, usr => usr.teams)
  @JoinColumn({name: "user_id", referencedColumnName: "id"})
  user: UserModel;

}
