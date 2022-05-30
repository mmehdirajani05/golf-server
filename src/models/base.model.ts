/* eslint-disable prettier/prettier */
import {
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
  } from 'typeorm';
  
  export abstract class BaseModel {
    @PrimaryGeneratedColumn()
    id: string;
  
    @Column({
      type: 'boolean',
      default: true,
    })
    is_delete: boolean;
  
    @CreateDateColumn({
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;
  
    @UpdateDateColumn({
      type: 'timestamptz',
      default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;
  }
  