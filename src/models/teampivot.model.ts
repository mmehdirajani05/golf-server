/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';

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

}
