/* eslint-disable prettier/prettier */
import { OfficeStatus } from 'src/enums/office-status';
import { Column,  Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit';
import { Office } from './office.entity';
import { User } from './user.entity';

@Entity("offices_agents")
export class AgentOffice extends Audit {
  static  entityName  = "offices_agents";

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({nullable:true})
  finish_date: Date;

  @OneToOne((type) => User, { eager:true })
  @JoinColumn({ name: 'user_id'})
  agent:User;

  @OneToOne((type) => Office, {eager:true})
  @JoinColumn({ name: 'office_id'})
  office:Office;

}
