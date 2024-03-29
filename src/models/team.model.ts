/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';

@Entity({ name: 'team' })
export class TeamModel extends BaseModel {
  @Column({
    nullable: false,
    name: 'match_id',
  })
  match_id: number;

  @Column({
    nullable: true,
    name: 'captain',
  })
  captain: number;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'name',
  })
  name: string;

}
