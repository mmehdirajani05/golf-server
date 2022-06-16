/* eslint-disable prettier/prettier */
import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseModel } from './base.model';
import { UserMatchPivotModel } from './usermatchpivot.model';
import { ScoreboardModel } from './scoreboard.model';

@Entity({ name: 'user' })
export class UserModel extends BaseModel {
  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'first_name',
  })
  first_name: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'last_name',
  })
  last_name: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: false,
    name: 'email',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    name: 'avatar'
  })
  avatar: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 128,
    nullable: true,
    select: true,
  })
  password: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  phone: string;

  @Column({
    name: 'state',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  state: string;

  @Column({
    name: 'address',
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
    name: 'average_handicap',
    default: 0
  })
  average_handicap: number;

  @OneToMany(() => ScoreboardModel, x => x.user)
  scoreBoard: ScoreboardModel[];

  @OneToMany(() => UserMatchPivotModel, x => x.user)
  matchPivot: UserMatchPivotModel[];
}
