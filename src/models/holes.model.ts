/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';
import { ScoreboardModel } from './scoreboard.model';

@Entity({ name: 'holes' })
export class HolesModel extends BaseModel {

  @Column({
    nullable: false,
    name: 'match_id',
  })
  match_id: number;

  @Column({
    nullable: false,
    name: 'yards'
  })
  yards: number;

  @Column({
    nullable: true,
    name: 'par_allowed'
  })
  par_allowed: number;

  @Column({
    nullable: true,
    name: 'match_specific_id'
  })
  match_specific_id: number;

  @OneToMany(() => ScoreboardModel, x => x.hole)
  scoreBoard: ScoreboardModel[];

}
