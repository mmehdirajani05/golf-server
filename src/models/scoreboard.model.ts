/* eslint-disable prettier/prettier */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './base.model';
import { HolesModel } from './holes.model';
import { UserModel } from './user.model';

@Entity({ name: 'scoreboard' })
export class ScoreboardModel extends BaseModel {
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

  @Column({
    nullable: false,
    name: 'hole_id',
  })
  hole_id: number;

  @Column({
    nullable: false,
    name: 'score'
  })
  score: number;

  @Column({
    nullable: true,
    name: 'team_id'
  })
  team_id: number;

  @ManyToOne(() => UserModel, emp => emp.scoreBoard)
  @JoinColumn({name: "user_id", referencedColumnName: "id"})
  user: UserModel;

  @ManyToOne(() => HolesModel, emp => emp.scoreBoard)
  @JoinColumn({name: "hole_id", referencedColumnName: "id"})
  hole: HolesModel;

}
