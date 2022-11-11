/* eslint-disable prettier/prettier */
import { Exclude, Transform } from 'class-transformer';
import { TicketStatus } from 'src/enums/ticket-status';
import { BeforeInsert, Column,  Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit';
import { Office } from './office.entity';
import { User } from './user.entity';
import { ManyToOne } from 'typeorm';
import { TypeOperation } from 'src/enums/type-operation';

@Entity("tickets")
export class Ticket extends Audit {
  static  entityName  = "tickets";

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({default: TicketStatus.WAITING})
  status?:TicketStatus;

  @Column({default: TypeOperation.OPERATION})
  type?: TypeOperation;

  @Column({nullable:true})
  receive_date: Date;

  @Column({nullable:true})
  finish_date: Date;

  // @Transform({order_nber=> order_nber.toFixed(2)})
  @Column({default:1})
  order_nber:number;

  @Column({ nullable: false, unique: true })
  code?: string;

  @ManyToOne((type) => User, {eager:true})
  @JoinColumn({ name: 'id_user'})
  agent:User;

  @ManyToOne((type) => Office, {eager:true})
  @JoinColumn({ name: 'id_office'})
  office:Office;

  @BeforeInsert()  async hashPassword() {
    this.code = Date.now() + "";
  }

}
