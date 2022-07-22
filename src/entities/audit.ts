/* eslint-disable prettier/prettier */
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class  Audit extends BaseEntity {
  @Column({nullable: true})
  creator_id?: number;

  @Column({nullable: true})
  editor_id?: number;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
  
}
