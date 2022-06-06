/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';

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

}
