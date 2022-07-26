/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
import { TicketStatus } from 'src/enums/ticket-status';
import { BeforeInsert, Column,  Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit';
import { Office } from './office.entity';
import { User } from './user.entity';
import { ManyToOne } from 'typeorm';

@Entity("tickets")
export class Ticket extends Audit {
  static  entityName  = "tickets";

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({default: TicketStatus.WAITING})
  status?:TicketStatus;

  @Column({nullable:true})
  receive_date: Date;

  @Column({nullable:true})
  finish_date: Date;

  @Exclude()
  @Column({default:1})
  order_nber:number;

  @Column({ nullable: false, unique: true })
  code?: string;

  @ManyToOne((type) => User, {eager:true})
  @JoinColumn({ name: 'user_id'})
  agent:User;

  @ManyToOne((type) => Office, {eager:true})
  @JoinColumn({ name: 'office_id'})
  office:Office;

  @BeforeInsert()  async hashPassword() {
    this.code = Date.now() + "";
  }

}
