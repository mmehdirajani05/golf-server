/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';
import { UserMatchPivotModel } from './usermatchpivot.model';

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

  @OneToMany(() => UserMatchPivotModel, x => x.match)
  matchPivot: UserMatchPivotModel[];

}
