/* eslint-disable prettier/prettier */
import { OfficeStatus } from 'src/enums/office-status';
import { Column,  Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit';
import { User } from './user.entity';

@Entity("offices")
export class Office extends Audit {
  static  entityName  = "offices";

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false, unique:true})
  name: string;

  @Column({default: OfficeStatus.FERMER})
  status?:OfficeStatus;

  @Column({ nullable: true})
  description?: string;

}
