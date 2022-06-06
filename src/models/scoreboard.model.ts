/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { BaseModel } from './base.model';

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

}
