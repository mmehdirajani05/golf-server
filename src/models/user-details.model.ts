/* eslint-disable prettier/prettier */
import { Entity, Column } from 'typeorm';
import { BaseModel } from './base.model';

@Entity({ name: 'user_details' })
export class UserDetailsModel extends BaseModel {

  @Column({
    nullable: false,
    name: 'user_id',
  })
  user_id: number;

  @Column({
    nullable: true,
    name: 'uuid',
  })
  uuid: string;

  @Column({
    nullable: false,
    name: 'fcm_id',
  })
  fcm_id: string;

  @Column({
    nullable: false,
    name: 'os',
  })
  os: string;

}
